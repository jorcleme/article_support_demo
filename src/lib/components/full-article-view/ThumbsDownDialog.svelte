<script>
	import { mostRecentStep, mountedArticleSteps } from '../store';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { quadIn } from 'svelte/easing';
	import { activeSupportStep } from './fullViewStore';

	const dispatch = createEventDispatcher();
	export let qaBtnText = "I don't understand this step";
	export let showDialog = false;
	export let formId;
	$: text = `Step ${$activeSupportStep} > ${qaBtnText}`;

	let textarea = '';

	let options = [
		{
			id: 'option4',
			label: 'Error in content accuracy',
			value: 'Error in content accuracy',
			classname: 'DialogFeedbackButtons'
		},
		{
			id: 'option5',
			label: 'Took too much time',
			value: 'Took too much time',
			classname: 'DialogFeedbackButtons'
		},
		{
			id: 'option6',
			label: "Didn't solve my issue",
			value: "Didn't solve my issue",
			classname: 'DialogFeedbackButtons'
		}
	];

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

	let negativeFeedback = [];

	$: {
		console.log('feedback', negativeFeedback);
	}

	/** @type {HTMLDialogElement}*/
	let dialog;

	$: if (showDialog && dialog) {
		dialog.showModal();
	} else if (dialog && !showDialog) {
		dialog.close();
	}

	function handleDialogClose() {
		dispatch('close');
		showDialog = false;
		dialog.close();
	}

	onMount(() => {
		dispatch('thumbsDownMounted');

		return () => {
			dispatch('thumbsDownUnmounted');
		};
	});
</script>

{#key showDialog}
	<dialog
		in:fade={{ duration: 1000, easing: quadIn }}
		id="thumbsDownDialog"
		bind:this={dialog}
		on:close
	>
		<div class="dialogContainer">
			<form id={formId} method="POST" action="?/thumbsDown" onsubmit="resetForm(); return false;">
				<div class="modal-content">
					<h2 style="margin-bottom: 0; color: #333">
						We're sorry to hear that. Can you provide more feedback?
					</h2>
					<span id="qaPair" style="color: #58585b; margin: 0 0 2em 0">{text}</span>
					<div class="DialogFeedbackButtonsContainer">
						{#each options as option}
							<label
								for={option.id}
								class="feedbackButton"
								class:selected={negativeFeedback.includes(option.value)}>{option.label}</label
							>
							<input
								bind:group={negativeFeedback}
								class={option.classname}
								type="checkbox"
								id={option.id}
								name={option.id}
								value={option.value}
								on:change={handleChange}
							/>
						{/each}
					</div>
					<textarea
						style="max-width: 1000px; height: 100px; padding: 1em"
						placeholder="Let us know what we can do to improve"
						id="textarea2"
						bind:value={textarea}
						form={formId}
					/>
					<div class="dialogControls">
						<button class="closeButton" on:click={handleDialogClose} type="button">Close</button>
						<button class="submitButton" onclick="" type="submit">Submit</button>
					</div>

					<div class="dialogFooter">
						<div class="dialogFooterText">
							<p>Tip: Check the sources to this question for related support content.</p>
							<p>Additional resources:</p>
							<ul>
								<li>
									<a
										href="https://www.cisco.com/c/en/us/support/web/tsd-cisco-small-business-support-center-contacts.html"
										>Contact Support &gt;
									</a>
								</li>
								<li>
									<a
										href="https://www.cisco.com/c/en/us/support/web/tsd-cisco-small-business-support-center-contacts.html"
										>Help Center &gt;
									</a>
								</li>
								<li>
									<a
										href="https://www.cisco.com/c/en/us/support/web/tsd-cisco-small-business-support-center-contacts.html"
										>Product Documentation &gt;
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</form>
		</div>
	</dialog>
{/key}

<style>
	input[type='checkbox'] {
		appearance: none;
	}

	#thumbsDownDialog {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		/* top: 50%;
		left: 50%;
		transform: translate(-50%, -50%); */
		z-index: 9999;
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

	.feedbackButton:hover,
	.submitButton:hover,
	.feedbackButton:checked {
		border-radius: 12px;
		color: #1d69cc;
		border: #1d69cc 1px solid;
		background: rgba(155, 215, 255, 0.5);
	}

	textarea {
		width: 100%;
		height: 100px;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: none;
	}

	label.selected {
		border-radius: 12px;
		color: #1d69cc;
		border: #1d69cc 1px solid;
		background: rgba(155, 215, 255, 0.5);
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
		cursor: pointer;
	}

	.closeButton:hover {
		border: #888 1px solid;
	}

	.submitButton {
		background: #1d69cc;
		margin: 1px;
		color: white;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: 0;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.dialogFooter {
		color: #898989;
		border-radius: 0 0 16px 16px;
		padding: 1em;
		border: #1d69cc 1px solid;
	}

	.dialogFooterText {
		margin: 0.5em 0;
	}

	.dialogFooterText p {
		line-height: 1.25em;
	}

	.dialogFooterText ul {
		list-style: none;
	}

	.dialogFooterText ul li {
		margin: 0.5em 0;
	}

	.dialogFooterText ul li::before {
		content: '\25cf';
		color: #64bbe3;
		font-weight: 900;
		font-size: 1.15em;
		display: inline-block;
		width: 1em;
		text-align: left;
	}

	.dialogFooterText ul li a {
		color: #2b5592;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
		font-weight: 700;
	}

	.dialogFooterText ul li a:hover {
		color: #64bbe3;
		-webkit-text-decoration-color: #2b5592;
		text-decoration-color: #2b5592;
		transition: 0.3s;
	}
</style>
