<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { activeSupportStep, activeSupportSection } from './fullViewStore';

	export let showDialog = false;
	export let qaBtnText = "I don't understand this step";
	export let formId;

	const dispatch = createEventDispatcher();
	let textarea = '';

	/** @type {HTMLDialogElement}*/
	let dialog;

	let options = [
		{
			id: 'option1',
			label: 'Exactly what I was looking for',
			value: 'Exactly what I was looking for',
			classname: 'DialogFeedbackButtons'
		},
		{
			id: 'option2',
			label: 'Saved me time',
			value: 'Saved me time',
			classname: 'DialogFeedbackButtons'
		},
		{
			id: 'option3',
			label: 'Helped me solve my own issue',
			value: 'Helped me solve my own issue',
			classname: 'DialogFeedbackButtons'
		}
	];

	let feedback = [];

	let selected = [];

	function handleFormChange(event) {
		console.log('form change', event);
	}

	$: {
		console.log('feedback', feedback);
		console.log('showDialog', showDialog);
	}

	let o = [];

	function handleChange(event) {
		console.log('change', event);
		const value = event.target.value;
		if (o.findIndex((item) => item === value) === -1) {
			o = [...o, value];
		} else {
			o = o.filter((item) => item !== value);
		}
	}

	function handleDialogClose() {
		dispatch('close');
		showDialog = false;
		dialog.close();
	}

	$: if (showDialog) {
		dialog.showModal();
	} else if (dialog) {
		dialog.close();
	}
</script>

{#key showDialog}
	<dialog in:fade={{ duration: 1000 }} id="thumbsUpDialog" bind:this={dialog} on:close>
		<div class="dialogContainer">
			<form use:enhance id={formId} on:submit={handleFormChange} method="POST" action="?/thumbsUp">
				<div class="modal-content">
					<h2 style="margin-bottom: 0; color: #333">Please provide additional feedback</h2>
					<span id="qaPair" style="color: #58585b; margin: 0 0 2em 0"
						>{'Step ' + $activeSupportStep + ' > ' + qaBtnText}</span
					>
					<div class="DialogFeedbackButtonsContainer">
						{#each options as option, index}
							<label
								for={option.id}
								class="feedbackButton {o.includes(option.value) ? 'selected' : ''}"
								>{option.label}
								<input
									bind:group={feedback}
									name={option.id}
									type="checkbox"
									id={option.id}
									value={option.value}
									on:change={handleChange}
									style="display: none;"
								/>
							</label>
						{/each}
					</div>
					<textarea
						bind:value={textarea}
						placeholder="Let us know what we can do even better"
						id="textarea"
						name="textarea"
						form={formId}
					/>
					<div class="dialogControls">
						<button class="closeButton" on:click={handleDialogClose} type="button">Close</button>
						<button class="submitButton" formaction="?/thumbsUp" type="submit">Submit</button>
					</div>
				</div>
			</form>
		</div>
	</dialog>
{/key}

<style>
	#thumbsUpDialog {
		position: fixed;
		display: grid;
		place-items: center;
		max-width: 590px;
		/* top: 50%;
		left: 50%;
		transform: translate(-50%, -50%); */
		z-index: 9999; /* Ensure it sits on top of other content */

		/* other style properties as needed */
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		box-shadow:
			0 10px 20px rgba(0, 0, 0, 0.19),
			0 6px 6px rgba(0, 0, 0, 0.23);

		background-color: #fefefe;
		border: none;
		border-radius: 1rem;
	}

	#thumbsUp:hover {
		border: #2b5592 1px solid;
		background-color: #d0e0f8;
		color: white;
	}

	.dialogContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.dialogContainer h2 {
		margin-top: 1em;
		font-weight: bold;
	}

	.modal-content {
		margin: 1em;
		padding-top: 1em;
		gap: 1em;
		display: grid;
	}

	.DialogFeedbackButtonsContainer {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 1em;
		flex-wrap: wrap;
	}

	.feedbackButton {
		padding: 10px 20px;
		border: 1px solid #ccc;
		border-radius: 6px;
		display: inline-block;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	textarea {
		width: 100%;
		height: 100px;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: none;
	}

	.dialogControls {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		gap: 1em;
	}

	.closeButton {
		background: white;
		color: #888;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: transparent 1px solid;
	}

	.submitButton {
		background: #1d69cc;
		margin: 1px;
		color: white;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: 1px solid #1d69cc;
	}

	.selected,
	label > input:checked {
		background-color: #2b5592;
		color: white;
		border-radius: 12px;
		border: #2b5592 1px solid;
	}

	.submitButton:hover,
	.selected {
		background-color: rgba(155, 215, 255, 0.5);
		color: #2b5592;
		border-radius: 12px;
		border: #2b5592 1px solid;
	}

	@media (hover: hover) and (pointer: fine) {
		.submitButton:hover {
			background-color: #2b5592;
			color: white;
			border-radius: 12px;
			border: #2b5592 1px solid;
			cursor: pointer;
		}

		.closeButton:hover {
			cursor: pointer;
		}
	}

	.DialogFeedbackButtons {
		display: none;
	}

	.feedbackButton:hover,
	.submitButton:hover {
		border-radius: 12px;
		color: #1d69cc;
		border: #1d69cc 1px solid;
		background: rgba(155, 215, 255, 0.5);
	}

	.closeButton:hover {
		border: #888 1px solid;
	}
</style>
