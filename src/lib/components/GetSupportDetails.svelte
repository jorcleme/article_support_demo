<script>
	// Import necessary Svelte functions and store
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import {
		mostRecentStep,
		mountedArticleSteps,
		mountedArticlePreambleObjective,
		mountedArticlePreambleDevices
	} from '$lib/components/store';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { createEventDispatcher } from 'svelte';

	// Export variables to be used as props
	export let article;
	export let userClickedButton = '';
	export let index;
	export let answer;

	// Create an event dispatcher
	const dispatch = createEventDispatcher();

	function handleClick() {
		mostRecentStep.set(index);
		dispatch('stepClick', index);
	}

	// Initialize variables
	let isLoading = false;
	let articleSteps = [];
	let buttonTexts = [
		{ klass: 'button', text: "I don't understand this step" },
		{ klass: 'button', text: 'I need help troubleshooting' },
		{ klass: 'button', text: 'Show Best Practices' }
	];
	let articleDetails = '';
	let questions = [];
	let questionsFetched = false;

	// Initial message for the chat
	let messages = [
		{
			role: 'system',
			content:
				'You are a TAC engineer and an expert at explaining technology in easy to understand terms. You are helping the user to understand how the objective ties into the step of the configuration step they are currently on. Use the previous steps as a context to inform what steps to take nextb ut most importantly pay attention to the latest step in the configuration. Keep in mind users are not able to respond to your messages, so do not ask the user any questions at all. Do not ask them to let you know how it turned out. Messages should be self contained and not require a response from the user.'
		},
		{ role: 'user', content: "Hi, I'm having trouble with my switch." }
	];

	onMount(() => {
		if (article) {
			// Set articleSteps and update mountedArticleSteps store
			articleSteps = article.steps;
			// console.log('articleSteps', articleSteps);
			mountedArticleSteps.set(articleSteps);
			console.log($mountedArticleSteps);

			// Combine objective and applicable devices into a single string
			const objective = article.objective;
			const applicableDevices = article.applicable_devices
				.map((device) => `${device.device_name} (Software version: ${device.software_version})`)
				.join(', ');

			articleDetails = `Objective: ${objective} | Applicable Devices: ${applicableDevices}`;

			// Update the mountedArticlePreamble store
			mountedArticlePreambleObjective.set(objective);
			mountedArticlePreambleDevices.set(applicableDevices);
		} else {
			console.log('article is not defined');
		}
	});

	async function performApiCall(
		contextMessage,
		userClickedButton,
		apiEndpoint,
		currentStepIndex,
		requestData = {}
	) {
		// console.log('from just inside performApiCall, userClickedButton is:', userClickedButton);
		let stepContextString;
		isLoading = true;
		const stepArrayContext =
			$mostRecentStep > -1 && $mountedArticleSteps.length > 0
				? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
				: [];
		stepContextString = stepArrayContext
			.map((step, index) => `Step ${index + 1}: ${step.text}`)
			.join('\n');

		// console.log('outside try block contextMessage from apiPerformCall is:', contextMessage);

		try {
			isLoading = true;

			// const messageToAPI = `${contextMessage}\n${stepContextString}`;
			// console.log('contextMessage from apiPerformCall is:', contextMessage);
			// console.log('messageToAPI is this:', messageToAPI)

			const response = await fetch(apiEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: [...messages, { role: 'user', content: contextMessage }],
					...requestData
				})
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
					answer = data.answer;
					console.log('answer is:', answer);
					messages = [...messages, { role: 'assistant', content: answer }];
					isLoading = false;
				})
				.catch((error) => {
					console.error('Error:', error);
				});

			// const data = await response.json();
			// console.log('data from apiPerformCall is:', data)
			// const answer = data.answer;
			// console.log('data.answer from apiPerformCall is:', data.answer)

			// messages.push({
			//     role: 'assistant',
			//     content: answer
			// });

			mostRecentStep.set(currentStepIndex);
		} catch (error) {
			console.error('Error while chatting:', error);
		} finally {
			isLoading = false;
		}
	}

	// Reactive statement to log mostRecentStep value whenever it changes
	$: {
		console.log('mostRecentStep', $mostRecentStep);
	}

	// Answers 1 of 3 generic questions included inside every support module
	// Meant to replace ApiCallOne, ApiCallTwo, ApiCallThree
	// I dont understand this step, I need help troubleshooting, Show Best Practices
	async function answerGenericSupportQuestion(buttonText) {
		userClickedButton = buttonText.trim();
		messages.push({ role: 'user', content: userClickedButton });
		console.log('Most recent step clicked on: ', $mostRecentStep);
		const stepArrayContext =
			$mostRecentStep > -1 && $mountedArticleSteps.length > 0
				? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
				: [];
		const stepContextString = stepArrayContext
			.map((step, index) => `Step ${index + 1}: ${step.text}`)
			.join('\n');

		let contextMessage;

		const foundButton = buttonTexts.find((btn) => btn.text === buttonText);

		if (foundButton && foundButton.text === "I don't understand this step") {
			contextMessage = `\n CONTEXT: Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The most recent step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI don't understand this step, use the context of the previous steps to explain in simple language how the latest step ties into the objective of the article.`;
		} else if (foundButton && foundButton.text === 'I need help troubleshooting') {
			contextMessage = `You are a one-shot troubleshooting helper. You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks. If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. \n Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI need help troubleshooting, use the context of the previous steps to inform the steps to troubleshoot presented to the user. Be sure to cite the articles content when responding. `;
		} else if (foundButton && foundButton.text === 'Show Best Practices') {
			contextMessage = `You are a TAC engineer and an expert at explaining technology in easy to understand terms. You are helping the user to understand how the objective ties into the step of the configuration step they are currently on. Help the user understand the factors to think about when applying best practices. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. \n Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nPlease provide any best practices related to the current step and the overall article context.\n `;
		} else {
			contextMessage = `\n CONTEXT: Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The most recent step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI don't understand this step, use the context of the previous steps to explain in simple language how the latest step ties into the objective of the article.`;
		}

		await performApiCall(contextMessage, userClickedButton, '/api/openai/AnswerGen', index);
	}

	// Function for the first API call
	// async function apiCallOne(event) {
	//     console.log('here is click event: ', event.target.innerText?.trim());
	//     userClickedButton = "I don't understand this step";
	//     const stepArrayContext =
	//         $mostRecentStep && $mountedArticleSteps.length > 0
	//             ? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
	//             : [];
	//     const stepContextString = stepArrayContext
	//         .map((step, index) => `Step ${index + 1}: ${step.text}`)
	//         .join('\n');
	//     const contextMessage = `\n CONTEXT: Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The most recent step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI don't understand this step, use the context of the previous steps to explain in simple language how the latest step ties into the objective of the article.`;
	//     // console.log('contextMessage is:', contextMessage);
	//     // const cacheKey = {
	//     //     userClickedButton,
	//     //     mostRecentStep: $mostRecentStep,
	//     //     article: article,
	//     //     step_number: article.step_number
	//     // };
	//     // const cachedResponse = localStorage.getItem(
	//     //     `cache:${article.title}:step${$mostRecentStep + 1}`
	//     // );
	//     // if (cachedResponse) {
	//     //     console.log(cachedResponse);
	//     //     console.log('Returning Cached Response');
	//     //     const cached = JSON.parse(cachedResponse);
	//     //     messages = [...messages, cached.message];
	//     //     return;
	//     // }
	//     // await chat(userClickedButton, contextMessage, cacheKey);
	//     messages.push({ role: 'user', content: userClickedButton });
	//     await performApiCall(contextMessage, userClickedButton, '/api/openai/AnswerGen', index);
	// }

	// Function for the second API call
	// async function apiCallTwo(message, buttonText) {
	//     userClickedButton = 'I need help troubleshooting';
	//     const stepArrayContext =
	//         $mostRecentStep && $mountedArticleSteps.length > 0
	//             ? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
	//             : [];
	//     const stepContextString = stepArrayContext
	//         .map((step, index) => `Step ${index + 1}: ${step.text}`)
	//         .join('\n');
	//     const contextMessage = `You are a one-shot troubleshooting helper. You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks. If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. \n Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nI need help troubleshooting, use the context of the previous steps to inform the steps to troubleshoot presented to the user. Be sure to cite the articles content when responding. `;
	//     console.log('contextMessage is:', contextMessage);
	//     messages.push({ role: 'user', content: userClickedButton });
	//     await performApiCall(contextMessage, userClickedButton, '/api/openai/AnswerGen', index);

	//     // await chat(userClickedButton, contextMessage);
	// }
	// async function apiCallThree(message, buttonText) {
	//     // Your API call logic here
	//     userClickedButton = 'Show Best Practices';
	//     messages.push({ role: 'user', content: userClickedButton });
	//     const stepArrayContext =
	//         $mostRecentStep && $mountedArticleSteps.length > 0
	//             ? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
	//             : [];
	//     const stepContextString = stepArrayContext
	//         .map((step, index) => `Step ${index + 1}: ${step.text}`)
	//         .join('\n');
	//     const contextMessage = `You are a TAC engineer and an expert at explaining technology in easy to understand terms. You are helping the user to understand how the objective ties into the step of the configuration step they are currently on. Help the user understand the factors to think about when applying best practices. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. \n Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\nStep context:\n${stepContextString}\nPlease provide any best practices related to the current step and the overall article context.\n `;

	//     console.log('contextMessage is:', contextMessage);

	//     await performApiCall(contextMessage, userClickedButton, '/api/openai/AnswerGen', index);

	//     // await chat(userClickedButton, contextMessage);
	// }

	async function generateAiQuestions() {
		let stepArrayContext = '';

		if ($mostRecentStep > -1 && $mountedArticleSteps.length > 0) {
			stepArrayContext = $mountedArticleSteps.slice(0, $mostRecentStep + 1);
		} else {
			stepArrayContext = articleSteps;
		}

		console.log('stepArrayContext is:', stepArrayContext);
		const stepContextString = stepArrayContext
			.map((step, index) => `Step ${index + 1}: ${step.text}`)
			.join('\n');

		const res = await fetch('/api/openai/QuestionGenerator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ stepContextString })
		});

		const data = await res.json();
		questions = data.questions;
		questionsFetched = true;

		// return guard
		return;
	}
	// This has been moved to generateAiQuestions()
	// async function apiCallFour(message, buttonText) {
	//     console.log('$mostRecentStep:', $mostRecentStep);
	//     console.log('$mountedArticleSteps:', $mountedArticleSteps);

	//     let stepArrayContext = '';
	//     if ($mostRecentStep && $mountedArticleSteps.length > 0) {
	//         stepArrayContext =
	//             $mostRecentStep && $mountedArticleSteps.length > 0
	//                 ? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
	//                 : [];
	//     } else {
	//         stepArrayContext = articleSteps;
	//     }

	//     console.log('stepArrayContext is:', stepArrayContext);
	//     const stepContextString = stepArrayContext
	//         .map((step, index) => `Step ${index + 1}: ${step.text}`)
	//         .join('\n');
	//     // console.log('stepContextString is:', stepContextString);
	//     const res = await fetch('/api/openai/QuestionGenerator', {
	//         method: 'POST',
	//         headers: {
	//             'Content-Type': 'application/json',
	//             Accept: 'application/json'
	//         },
	//         body: JSON.stringify({ stepContextString })
	//     });

	//     const data = await res.json();
	//     questions = data.questions;
	//     questionsFetched = true;
	// }

	async function answerSingleGenerativeAiQuestion(question) {
		messages.push({ role: 'user', content: question });

		const stepArrayContext =
			$mostRecentStep > -1 && $mountedArticleSteps.length > 0
				? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
				: [];

		const stepContextString = stepArrayContext
			.map((step, index) => `Step ${index + 1}: ${step.text}`)
			.join('\n');
		const contextMessage = `You are a TAC engineer and an expert at explaining technology in easy to understand terms. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. \n Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\n Whenever possible cite your answer from the Step context:\n${stepContextString}\n${question}}`;

		const requestData = {
			stepContextString: contextMessage
		};

		isLoading = true;
		await fetch('/api/openai/AnswerGen', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ stepContextString, ...requestData })
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				if (data && data.answer) {
					answer = data.answer;
					console.log('answer is:', answer);
					messages = [...messages, { role: 'assistant', content: answer }];
				} else {
					console.error('Error: Answer is undefined or not present in the response');
				}
				isLoading = false;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
	// This has been refactored to answerSingleGenerativeAiQuestion() above
	// async function apiCallFive(question) {
	//     messages.push({
	//         role: 'user',
	//         content: question
	//     });
	//     const stepArrayContext =
	//         $mostRecentStep && $mountedArticleSteps.length > 0
	//             ? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
	//             : [];

	//     const stepContextString = stepArrayContext
	//         .map((step, index) => `Step ${index + 1}: ${step.text}`)
	//         .join('\n');
	//     const contextMessage = `You are a TAC engineer and an expert at explaining technology in easy to understand terms. Use the previous steps as a context to inform what steps to take next but most importantly pay attention to the latest step in the configuration. \n Also of importance is the devices they are performing the configuration on: ${$mountedArticlePreambleDevices} \n Below is the context of all steps leading to the current step. The last step is the most important to pay attention to.\n The objective of this article is ${$mountedArticlePreambleObjective}\n Whenever possible cite your answer from the Step context:\n${stepContextString}\n${question}}`;

	//     const requestData = {
	//         stepContextString: contextMessage
	//     };

	//     isLoading = true;
	//     await fetch('/api/openai/AnswerGen', {
	//         method: 'POST',
	//         headers: {
	//             'Content-Type': 'application/json'
	//         },
	//         body: JSON.stringify({ stepContextString, ...requestData })
	//     })
	//         .then((response) => response.json())
	//         .then((data) => {
	//             console.log('Success:', data);
	//             if (data && data.answer) {
	//                 answer = data.answer;
	//                 console.log('answer is:', answer);
	//                 messages.push({
	//                     role: 'assistant',
	//                     content: answer
	//                 });
	//             } else {
	//                 console.error('Error: Answer is undefined or not present in the response');
	//             }
	//             isLoading = false;
	//         })
	//         .catch((error) => {
	//             console.error('Error:', error);
	//         });
	// }
</script>

<div style="margin:1em 0 1em 40px;">
	<details
		on:toggle={generateAiQuestions}
		class="detailsGetSupport"
		in:fly={{ y: -25, duration: 1000, delay: 750 }}
	>
		<summary on:click={handleClick()}
			><span
				id="stepNumberBreadcrumb"
				on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
				>?
			</span> Get Support</summary
		>
		<div class="messageWell">
			{#each messages as message, index (message)}
				{#if message && message.role && message.role === 'user' && index !== 1}
					<p class="user" in:fly={{ y: 25, duration: 1000 }}>
						{@html message.content}
					</p>
				{:else if message.role === 'assistant' && index !== 0}
					{#if message.role}
						<p class={message.role} in:fly={{ y: 25, duration: 1000 }}>
							{@html message.content?.replace(/\n/g, '<br>')}
						</p>
					{/if}
					<!-- {#if answer}
                        <p class="assistant" in:fly={{ y: 25, duration: 1000 }}>
                            {@html answer}
                        </p>
                    {/if} -->
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
		</div>
		<div class="genericSupportButtons">
			{#each buttonTexts as button, i (i)}
				<button
					class={button.klass}
					tabindex="0"
					on:keydown={(e) =>
						(e.key === 'Enter' || e.key === ' ') && answerGenericSupportQuestion(button.text)}
					on:click={() => answerGenericSupportQuestion(button.text)}>{button.text}</button
				>
			{/each}
		</div>

		{#if questionsFetched}
			<details
				class="custom-details"
				id="detailsFaqlike"
				style="margin:1em 0 0 0 ; border:none; padding-left:0;"
				open="true"
				in:fly={{ y: 25, duration: 1000 }}
			>
				<summary>More specific questions you may have:</summary>
				<div class="questions">
					{#each questions as question (question)}
						<button
							class="question-button"
							on:click={() => answerSingleGenerativeAiQuestion(question)}
						>
							{question}
						</button>
					{/each}
				</div>
			</details>
		{/if}
	</details>
</div>

<style>
	/* .get-support-container button {
    pointer-events: auto;
} */

	@media only screen and (max-width: 768px) {
		.questions {
			display: grid;
			grid-auto-flow: row dense;
			justify-content: center;
		}
	}

	.genericSupportButtons {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	#detailsFaqlike {
		padding: 1em 1.5em;
		/* border: #d2d2d2 1px solid; */
		border-radius: 5px;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		color: var(--text-color-black3);
		font-family: 'CiscoSansTTBold';
	}
	.get-support-container {
		position: relative;
		z-index: 0;
		pointer-events: none;
	}
	.messageWell:nth-of-type(2) {
		background-color: pink;
	}
	.messageWell {
		border-bottom: var(--font-gray) 1px solid;
		display: flex;
		flex-direction: column;
	}

	.user {
		background-color: var(--cisco-dark-blue);
		color: var(--text-white-1);
		padding: 2em;
		max-width: fit-content;
		display: inline-block;
		align-self: flex-start;
		position: relative;
		border-radius: 20px;
		border-bottom-left-radius: 0px;
	}

	.assistant {
		background: var(--border-gray);
		background-attachment: fixed;
		position: relative;
		padding: 2em;
		color: var(--text-color-black2);
		/* margin-bottom: 0; */
		align-self: flex-start;
		display: inline-block;
		border-radius: 20px;
		border-bottom-right-radius: 0px;
		width: fit-content;
	}

	details {
		border-radius: 16px;
		font-family: inherit;
		font-size: var(--font-size-base);
		color: #333;
		padding: 2.5em 1.5em 1.5em 1.5em;
		border: #d2d2d2 1px solid;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		margin-top: -2em;
		border-radius: 0 0 16px 16px;

		position: relative;
		background-color: var(--menu-background-gray);
	}

	.button,
	.question-button,
	#detailsFaqlike > div > button {
		display: inline;
		border: var(--cisco-midnight-blue) 1px solid;
		color: var(--cisco-midnight-blue);
		padding: 0.5em 1em;
		border-radius: 30px;
		text-align: center;
		font-size: var(--font-size-base);
		cursor: pointer;
		font-family: 'CiscoSansThin';
		margin: 1em 0.3em;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
	}

	.question-button,
	.button {
		margin: 1em 0.3em !important;
	}

	summary::marker {
		appearance: none;
	}

	details summary::-webkit-details-marker,
	details summary::marker {
		display: none;
		content: '';
	}

	#stepNumberBreadcrumb {
		display: inline-block;
		text-align: center;
		line-height: 1.75em;
		font-weight: bold;
		font-size: 1.25em;
		width: 1.75em;
		height: 1.75em;
		color: var(--cisco-midnight-blue);
		border-radius: 35px;
		aspect-ratio: 1/1;
		margin-right: 0.5em;
		border: var(--cisco-midnight-blue) 1px solid;
	}

	.button:hover,
	#detailsFaqlike > div > button:hover {
		background-color: var(--cisco-midnight-blue);
		color: white;
	}

	details {
		border-left: 3px solid #2b5592;
	}
</style>
