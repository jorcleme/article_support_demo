<script>
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { slide, fly, fade, crossfade } from 'svelte/transition';
	import { cubicIn, quintInOut, quintOut } from 'svelte/easing';
	import {
		mostRecentStep,
		mountedArticleSteps,
		mountedArticlePreambleDevices,
		mountedArticlePreambleObjective
	} from '../store';
	import { generateAIQuestion, answerGenAIQuestion } from './services/gai';
	import strip from './utils/stripHTML';
	import LoadingSpinner from '../LoadingSpinner.svelte';
	import ThumbsDownDialog from './ThumbsDownDialog.svelte';
	import ThumbsUpDialog from './ThumbsUpDialog.svelte';
	import { createChatStore } from './fullViewStore';
	import EditableMessage from './EditableMessage.svelte';

	export let currentStep;
	export let index;
	export let open;
	export let stepId;

	$: supportOpen = $mostRecentStep === index;

	/** @type {HTMLDetailsElement}*/
	let details;
	// Initial message for the chat
	// let messages = createChatStore([
	// 	{
	// 		role: 'system',
	// 		content:
	// 			'You are a TAC engineer and an expert at explaining technology in easy to understand terms. You are helping the user to understand how the objective ties into the step of the configuration step they are currently on. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. Keep in mind users are not able to respond to your messages, so do not ask the user any questions at all. Do not ask them to let you know how it turned out. Messages should be self contained and not require a response from the user.'
	// 	},
	// 	{ role: 'user', content: "Hi, I'm having trouble with my switch." }
	// ]);
	let messages = [
		{
			role: 'system',
			content:
				'You are a TAC engineer and an expert at explaining technology in easy to understand terms. You are helping the user to understand how the objective ties into the step of the configuration step they are currently on. Use the previous steps as a context to inform what steps to take nextb ut most importantly pay attention to the latest step in the configuration. Keep in mind users are not able to respond to your messages, so do not ask the user any questions at all. Do not ask them to let you know how it turned out. Messages should be self contained and not require a response from the user.'
		},
		{ role: 'user', content: "Hi, I'm having trouble with my switch." }
	];

	let questions = [];
	let questionsFetched = false;
	let isLoading = false;
	let currentQuestion;
	const dispatch = createEventDispatcher();

	let thumbsUpOpen = false;
	let thumbsDownOpen = false;

	function handleToggle() {
		console.log('details is', details.open);
		if (details.open) {
			dispatch('openDialog', { index });
		} else {
			dispatch('closeStepDialog', { index });
		}

		console.log('details is now', details.open);
	}

	/**
	 *
	 * @param event {CustomEvent<{message: {id: string, content: string, role: string }}>
	 */
	function handleEdit(event) {
		console.log('edit', event);
		messages = messages.map((m) => (m.id === event.detail.message.id ? event.detail.message : m));
	}

	async function handleGenerateDynamicQuestions() {
		if (details.open) {
			if (promptQuestionButtons.length > 3) {
				return;
			}
			const cachedQuestions = localStorage.getItem(`${stepId}`);
			if (cachedQuestions) {
				console.log('cached questions', cachedQuestions);
				promptQuestionButtons = [...promptQuestionButtons, ...JSON.parse(cachedQuestions)];
				questionsFetched = true;
				return;
			}

			let generatedQuestionsData = await generateAIQuestion($mostRecentStep, $mountedArticleSteps);
			if (generatedQuestionsData && $mostRecentStep > -1) {
				questionsFetched = true;
				questions = generatedQuestionsData.questions;
				console.log('questions', questions);
				let converted = questions.map((q, index) => {
					return {
						id: `dynamicAnswer${index + 1}`,
						text: q,
						clicked: false
					};
				});
				localStorage.setItem(`${stepId}`, JSON.stringify(converted));
				// promptQuestionButtons = promptQuestionButtons.concat(converted);
				promptQuestionButtons = [...promptQuestionButtons, ...converted];
			}
		}
	}

	async function handleGenAIQuestion(index) {
		try {
			isLoading = true;
			let btn = promptQuestionButtons[index];
			promptQuestionButtons[index].clicked = true;
			let questionAsked = btn.text.trim();
			currentQuestion = questionAsked;
			console.log('question asked', questionAsked);
			const cacheAnswers = localStorage.getItem(`${stepId}-${questionAsked}-answer`);
			let a;
			if (cacheAnswers) {
				a = JSON.parse(cacheAnswers);
				messages = [
					...messages,
					{ role: 'user', content: questionAsked },
					{ role: 'assistant', content: a }
				];
				return;
			}
			messages = [...messages, { role: 'user', content: questionAsked }];
			// messages.addMessage({ role: 'user', content: questionAsked });
			const stepArrayContext =
				$mostRecentStep > -1 && $mountedArticleSteps.length > 0
					? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
					: [];

			const stepContextString = stepArrayContext
				.map((step, index) => `Step ${index + 1}: ${strip(step.text)}`)
				.join('\n');

			let context;

			if (index === 0) {
				context = `\nCONTEXT: Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices}\nBelow is the context of all steps leading to the current step. The most recent step is the most important to pay attention to.\nThe objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI don't understand this step, use the context of the previous steps to explain in simple language how the latest step ties into the objective of the article.`;
			} else if (index === 1) {
				context = `You are a one-shot troubleshooting helper. You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks. If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration.\nAlso of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\nThe objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI need help troubleshooting, use the context of the previous steps to inform the steps to troubleshoot presented to the user. Be sure to cite the articles content when responding. `;
			} else if (index === 2) {
				context = `You are a TAC engineer and an expert at explaining technology in easy to understand terms. You are helping the user to understand how the objective ties into the step of the configuration step they are currently on. Help the user understand the factors to think about when applying best practices. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration.\nAlso of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices}\nBelow is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nPlease provide any best practices related to the current step and the overall article context.\n `;
			} else {
				context = `You are a TAC engineer and an expert at explaining technology in easy to understand terms. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration.\nAlso of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices}\nBelow is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nWhenever possible cite your answer from the Step context:\n${stepContextString}\n${questionAsked}}`;
			}
			messages = [...messages, { role: 'system', content: context }];
			// messages.addMessage({ role: 'system', content: context });
			let data = await answerGenAIQuestion(messages);
			let answer = data.answer;
			localStorage.setItem(`${stepId}-${questionAsked}-answer`, JSON.stringify(answer));
			messages = [...messages, { role: 'assistant', content: answer }];

			// messages.addMessage({ role: 'assistant', content: answer });
		} catch (e) {
			console.error(e);
		} finally {
			isLoading = false;
			// messages.save(stepId, $messages);
		}
	}

	function handleClose() {
		console.log('close button clicked');
		dispatch('closeStepDialog', { index });
		details.open = false;
	}

	let promptQuestionButtons = [
		{
			id: 'staticAnswer1',
			text: "I don't understand this step",
			clicked: false
		},
		{
			id: 'staticAnswer2',
			text: 'I need help troubleshooting',
			clicked: false
		},
		{
			id: 'staticAnswer3',
			text: 'Show Best Practices',
			clicked: false
		}
	];

	afterUpdate(() => {
		console.log('Suport Dialog is: ', supportOpen);
		messages = messages.map((m, i) => ({ ...m, id: i }));
		console.log('messages', messages);
	});

	function handleThumbsDownClick() {
		console.log('thumbs down clicked');
		thumbsDownOpen = !thumbsDownOpen;
		dispatch('thumb-down-click', { status: thumbsDownOpen });
	}

	function handleThumbsUpClick() {
		console.log('thumbs up clicked');
		thumbsUpOpen = !thumbsUpOpen;
		dispatch('thumb-up-click', { status: thumbsUpOpen });
	}
</script>

<details
	bind:this={details}
	on:toggle={handleGenerateDynamicQuestions}
	bind:open
	transition:slide={{ duration: 1000, easing: quintInOut }}
	class="detailsGetSupport"
>
	<summary tabindex="-1" class="s-5e5kg2sOboz_"
		><span id="stepNumberBreadcrumb" class="s-5e5kg2sOboz_">?</span>
		<h3 style="display:inline;">
			Get Support <p style="color:#999899; display:inline;">{currentStep}</p>
		</h3></summary
	>

	<div class="messageWell s-5e5kg2sOboz_">
		<h1 style="text-align: center;">Need Answers?</h1>
		<h3 style="text-align: center; margin-top: -1em; margin-bottom: 4rem;">
			choose from our options below
		</h3>
		{#each messages as message, index (index)}
			{#if message && message.role === 'user' && index !== 1}
				<div class="question user">
					<h4>{@html message.content}</h4>
				</div>
			{:else if message.role === 'assistant' && index !== 0}
				<div class="assistant">
					<p>
						{@html message.content
							?.replace(/\n/g, '<br>')
							.replace(
								/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
								(match) => `<a href="${match}">${match}</a>`
							)}
					</p>
					<!-- {#if index === messages.findIndex((m) => m.role === 'assistant')}
						<div class="rollout" in:slide={{ delay: 500, duration: 1500, axis: 'y' }}>
							<i class="fa fa-info-circle"></i>
						</div>
					{/if} -->
				</div>
				<details id="sources" style=" border:none; cursor:pointer;">
					<summary><h4 style="margin-bottom:0; background:#f2f2f2;">Sources used</h4></summary>
					<h3>How did we use AI and Cisco experts to provide this answer?</h3>
					<div id="sourcescontentcontainer">
						<p>
							We search our content database for similar text to the question and context. We then
							use small chunks of the broader text to summarize or pick and choose which chunks are
							relevant. In the end the Gen AI uses the chunks to arrive at the answer. The answer
							produced is then reviewed for accuracy and relevancy by Cisco experts. <a href=""
								>Cisco's Responsible AI Framework FAQ</a
							>
						</p>
						<img src="answerDiagram.png" style="box-shadow:none;" alt="Image description" />
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							Business stackable switches. If you are stacking the legacy switches, consult the
							following link:
							https://www.cisco.com/c/en/us/support/docs/smb/switches/cisco-350x-series-stackable-managed-switches/smb5367-feature-support-comparison-between-the-cisco-stackable-manag.html
							The feature set of the CBS350 SKUs with 10G network ports and the feature CBS350 SKUs
							with 10G uplink ports are nearly identical. However, there are a few differences in
							feature support and table sizes between the 2
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html"
							>
								View Get To Know Your Switch in the Administration Guide</a
							>
						</p>
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							in the user interfaces of the product software, language used based on RFP
							documentation, or language that is used by a referenced third-party product. Learn
							more about how Cisco is using Inclusive Language. Cisco Business 350 Series Switches
							Administration Guide Chapter Title View with Adobe Reader on a variety of devices This
							chapter contains the following sections: A Smartport is an interface (port, VLAN or
							LAG) to which a built-in (or user-defined) macro may be applied. This Smartport
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_09.html"
							>
								View Smartport in the Administration Guide</a
							>
						</p>
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							settings for your 10G Cisco Business 350 series switch. Click on the link below to
							access the tool.
							https://www.cisco.com/c/en/us/support/docs/smb/switches/Cisco-Business-Switching/kmgmt-2799-switch-stack-selector-cbs.html
							Note You cannot stack the legacy switches with the new Cisco Business stackable
							switches. If you are stacking the legacy switches, consult the following link:
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html"
							>
								View Get To Know Your Switch in the Administration Guide</a
							>
						</p>
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							and Reset button are located on the front panel of the switch, as well as the
							following components: Cisco Business 350 Series Model Note Models may differ within
							the CBS 350 series and this is just a representation of a model within the series.
							There are 2 device types with different console interface: Console port with RJ-45 and
							mini USB connector if both are connected the Mini USB has precedence over the RJ-45
							RJ-45 connector only type of console. The console interface connects a serial cable
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html"
							>
								View Get To Know Your Switch in the Administration Guide</a
							>
						</p>
					</div>
				</details>
			{/if}
		{/each}
		{#if isLoading}
			<div
				style="text-align: center; margin-top: 2.5em;"
				in:fly={{ y: 25, duration: 1000 }}
				out:fly={{ y: -25, duration: 1000 }}
			>
				<LoadingSpinner size="2.5em" color="#0E274D" />
			</div>
		{/if}
		<!-- <div>
			<div class="assistant animated-answer">
				<p>
					The latest step explains how to access the Cisco Business Switch Stack Selector tool,
					which allows you to configure the settings for your 10G Cisco Business 350 series switch.
					This tool is important for achieving the objective of the article, which is to explain
					some best practices when dealing with Smartports on Cisco Business 250 or 350 series
					switches.
				</p>
				<details id="sources" style=" border:none; cursor:pointer;">
					<summary><h4 style="margin-bottom:0; background:#f2f2f2;">Sources used</h4></summary>
					<h3>How did we use AI and Cisco experts to provide this answer?</h3>
					<div id="sourcescontentcontainer">
						<p>
							We search our content database for similar text to the question and context. We then
							use small chunks of the broader text to summarize or pick and choose which chunks are
							relevant. In the end the Gen AI uses the chunks to arrive at the answer. The answer
							produced is then reviewed for accuracy and relevancy by Cisco experts. <a href=""
								>Cisco's Responsible AI Framework FAQ</a
							>
						</p>
						<img src="answerDiagram.png" style="box-shadow:none;" alt="Image description" />
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							Business stackable switches. If you are stacking the legacy switches, consult the
							following link:
							https://www.cisco.com/c/en/us/support/docs/smb/switches/cisco-350x-series-stackable-managed-switches/smb5367-feature-support-comparison-between-the-cisco-stackable-manag.html
							The feature set of the CBS350 SKUs with 10G network ports and the feature CBS350 SKUs
							with 10G uplink ports are nearly identical. However, there are a few differences in
							feature support and table sizes between the 2
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html"
							>
								View Get To Know Your Switch in the Administration Guide</a
							>
						</p>
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							in the user interfaces of the product software, language used based on RFP
							documentation, or language that is used by a referenced third-party product. Learn
							more about how Cisco is using Inclusive Language. Cisco Business 350 Series Switches
							Administration Guide Chapter Title View with Adobe Reader on a variety of devices This
							chapter contains the following sections: A Smartport is an interface (port, VLAN or
							LAG) to which a built-in (or user-defined) macro may be applied. This Smartport
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_09.html"
							>
								View Smartport in the Administration Guide</a
							>
						</p>
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							settings for your 10G Cisco Business 350 series switch. Click on the link below to
							access the tool.
							https://www.cisco.com/c/en/us/support/docs/smb/switches/Cisco-Business-Switching/kmgmt-2799-switch-stack-selector-cbs.html
							Note You cannot stack the legacy switches with the new Cisco Business stackable
							switches. If you are stacking the legacy switches, consult the following link:
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html"
							>
								View Get To Know Your Switch in the Administration Guide</a
							>
						</p>
					</div>
					<div class="icon-band icon-guide">
						<i class=" "></i>
						<p>
							and Reset button are located on the front panel of the switch, as well as the
							following components: Cisco Business 350 Series Model Note Models may differ within
							the CBS 350 series and this is just a representation of a model within the series.
							There are 2 device types with different console interface: Console port with RJ-45 and
							mini USB connector if both are connected the Mini USB has precedence over the RJ-45
							RJ-45 connector only type of console. The console interface connects a serial cable
						</p>
						<p>
							<a
								href="https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html"
							>
								View Get To Know Your Switch in the Administration Guide</a
							>
						</p>
					</div>
				</details>
			</div>
		</div> -->
		{#if messages && messages.length > 2}
			<div class="feedbackContainer" in:fade={{ duration: 1000, easing: cubicIn }}>
				<div id="thumbsContainer">
					<h4>Helpful?</h4>
					<button on:click={handleThumbsUpClick} id="thumbsUp" class="fa fa-thumbs-up"
					></button><button
						id="thumbsDown"
						class="fa fa-thumbs-down"
						on:click={handleThumbsDownClick}
					></button>
				</div>
			</div>
		{/if}
		<button on:click={handleClose} id="closeDialogButton">×</button>
	</div>
	<div class="genericSupportButtons s-5e5kg2sOboz_">
		<details
			class="custom-details s-5e5kg2sOboz_"
			id="detailsFaqlike"
			style="border:#d2d2d2 1px solid; margin:0;"
			open="true"
		>
			<summary class="s-5e5kg2sOboz_"></summary>
			<div class="buttonWell">
				{#each promptQuestionButtons as btn, index}
					<button
						on:click={() => handleGenAIQuestion(index)}
						class="button"
						class:clicked={btn.clicked}
						id={btn.id}
						tabindex="0"
						data-clicked={btn.clicked}>{btn.text}</button
					>
				{/each}
			</div>
		</details>
	</div>
</details>
<ThumbsUpDialog
	bind:showDialog={thumbsUpOpen}
	formId={'upForm' + index}
	qaBtnText={currentQuestion}
/>
<ThumbsDownDialog
	bind:showDialog={thumbsDownOpen}
	formId={'downForm' + index}
	on:thumbsDownMounted
	qaBtnText={currentQuestion}
/>

<style>
	#sources {
		margin: 1em 0 0 0;
		padding: 0;
	}
	details {
		color: #333;
		padding: 1em;
		border: #d2d2d2 1px solid;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		border-radius: 0 16px 16px 0;
		position: relative;
		background-color: var(--menu-background-gray);
		max-width: 1100px;
	}

	details[open] > summary {
		margin-bottom: 1em;
	}
	#closeDialogButton {
		position: absolute;
		top: 20px;
		right: 10px;
		background: white;
		border-radius: 35px;
		color: #aaa;
		font-size: 41px;
		font-weight: bold;
		background: none;
		border: none;
		cursor: pointer;
	}
	.detailsGetSupport {
		border-radius: 16px;
		background-color: white;
		background-image: radial-gradient(
				75.83% 78.18% at 51.72% 100%,
				rgba(56, 96, 190, 0.03) 0%,
				rgba(100, 187, 227, 0.03) 65.24%,
				rgba(223, 223, 223, 0) 100%
			),
			conic-gradient(
				from 180deg at 50% 50%,
				rgba(56, 96, 190, 0) 0deg,
				rgba(56, 96, 190, 0.02) 360deg
			);
		margin-left: 40px;
		transition: all 0.3s ease-in-out;
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.07),
			0 2px 4px rgba(0, 0, 0, 0.07),
			0 4px 8px rgba(0, 0, 0, 0.07),
			0 8px 16px rgba(0, 0, 0, 0.07),
			0 16px 32px rgba(0, 0, 0, 0.07),
			0 32px 64px rgba(0, 0, 0, 0.07);
	}

	.detailsGetSupport:hover {
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
	}

	details summary::marker {
		display: none;
		content: '';
	}

	summary::marker {
		appearance: none;
	}

	.messageWell {
		margin: 1em 0 0 0;
		overflow: auto;
		transition: all 0.5s ease-out;
		border-radius: 5px 5px 0 0;
		min-height: 30dvh;
		max-height: 50vh;
		overflow: auto;
		padding: 1em 1em 5em 1em;
	}

	.messageWell h1 {
		font-family: 'CiscoSansTT', sans-serif;
		font-size: var(--font-size-md);
		color: #333;
		max-width: 1500px;
		line-height: 2.8em;
		font-weight: 700;
		margin: 0em 0 0 0;
		background: -webkit-linear-gradient(left, #1d69cc, #2196f3);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	details > div.messageWell {
		background-image: radial-gradient(
				75.83% 78.18% at 51.72% 100%,
				rgba(56, 96, 190, 0.03) 0%,
				rgba(100, 187, 227, 0.03) 65.24%,
				rgba(223, 223, 223, 0) 100%
			),
			conic-gradient(
				from 180deg at 50% 50%,
				rgba(56, 96, 190, 0) 0deg,
				rgba(56, 96, 190, 0.02) 360deg
			);
	}

	.genericSupportButtons {
		display: flex;
		align-items: flex-start;
		gap: 1em;
		justify-content: space-evenly;
	}

	.custom-details {
		border-radius: 5px;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		color: var(--text-color-black3);
		background: white;
		width: 100%;
	}

	.buttonWell {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 1em;
	}

	.button {
		display: inline;
		border: #333 1px solid;
		color: #333;
		background-color: white;
		padding: 0.5em;
		border-radius: 6px;
		text-align: center;
		font-size: var(--font-size-base);
		cursor: pointer;
		text-decoration: none;
		transition: all 0.5s ease-in-out;
		font-family: 'CiscoSansThin';
		font-weight: 600;
	}

	.button:hover {
		background-color: rgba(155, 215, 255, 0.5);
		color: #2b5592;
		border-radius: 12px;
		border: #2b5592 1px solid;
	}

	.button.clicked {
		color: rgb(136, 136, 136);
		border: 1px solid rgb(136, 136, 136);
		border-radius: 6px;
	}

	.assistant {
		background-color: #f2f2f2;
		border-radius: 10px;
		padding: 1.5em;
		color: var(--font-gray);
		margin-bottom: 0;
		position: relative;
	}

	.question h4 {
		background: rgba(155, 215, 255, 0.5);
		color: #2b5592 !important;
		width: fit-content;
		padding: 1.5em;
		margin: 1em 0;
		border-radius: 10px;
	}

	.feedbackContainer {
		display: flex;
		gap: 1em;
		z-index: 1000;
		justify-items: end;
		justify-content: end;
		align-items: center;
		height: auto;
	}

	#thumbsContainer {
		display: flex;
		flex-direction: row;
		gap: 1em;
		align-items: center;
	}

	#thumbsUp,
	#thumbsDown {
		border: #d2d2d2 1px solid;
		padding: 1em;
		border-radius: 16px;
		transition: all 0.3s ease-in-out;
		cursor: pointer;
		height: 48px;
	}

	#thumbsUp:before,
	#thumbsDown:before {
		color: #2b5592;
	}

	.rollout {
		position: absolute;
		top: 100%;
		left: 2em;
		width: 90%;
		height: 150px;
		border: 1px solid #ccc;
		padding: 20px;
		border-top: none;
		border-radius: 0 0 6px 6px;
		background-color: #d2d2d2;
		margin-bottom: 1em;
	}

	.rollout i {
		color: #2b5592;
		font-size: 2em;
	}
</style>
