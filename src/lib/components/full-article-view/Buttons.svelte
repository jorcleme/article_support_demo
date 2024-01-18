<script>
	import {
		mostRecentStep,
		mountedArticleSteps,
		mountedArticlePreambleObjective,
		mountedArticlePreambleDevices
	} from '../store';
	import { generateAIQuestion, answerGenAIQuestion } from './services/gai';
	import { createEventDispatcher } from 'svelte';
	import strip from '$lib/components/full-article-view/utils/stripHTML';

	export let messages = [];

	export let promptQuestionButtons = [
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

	let dispatch = createEventDispatcher();

	async function handleGenAIQuestion(index) {
		try {
			dispatch('message-loading');
			let btn = promptQuestionButtons[index];
			promptQuestionButtons[index].clicked = true;
			let questionAsked = btn.text.trim();
			console.log('question asked', questionAsked);
			messages = [...messages, { role: 'user', content: questionAsked }];
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
			let data = await answerGenAIQuestion(messages);
			let answer = data.answer;
			messages = [...messages, { role: 'assistant', content: answer }];
			dispatch('message-loaded');
		} catch (e) {
			console.error(e);
		}
	}
</script>

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

<style>
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

	.custom-details {
		border-radius: 5px;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		color: var(--text-color-black3);
		background: white;
		width: 100%;
	}

	.genericSupportButtons {
		display: flex;
		align-items: flex-start;
		gap: 1em;
		justify-content: space-evenly;
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

	details summary::marker {
		display: none;
		content: '';
	}

	summary::marker {
		appearance: none;
	}
</style>
