<script>
	import { createEventDispatcher } from 'svelte';
	import { activeSupportStep, activeSupportSection } from './fullViewStore';

	export let message;
	export let question;

	let isEditing = false;
	let content = message.content;

	$: currentEditingStep = `Step ${$activeSupportStep} | ${$activeSupportSection}`;

	const dispatch = createEventDispatcher();

	function handleSave() {
		dispatch('edit', { message: { ...message, content: content } });
		isEditing = false;
	}

	let dialog;

	$: if (isEditing && dialog) {
		dialog.showModal();
	} else if (dialog && !isEditing) {
		dialog.close();
	}
</script>

{#if isEditing}
	<dialog bind:this={dialog}>
		<h3>
			{currentEditingStep}<strong style="font-weight: 700;">&nbsp;&gt;&nbsp;{question}</strong>
		</h3>
		<textarea bind:value={content}></textarea>
		<div style="display: flex; justify-content: flex-end;">
			<button class="btn cancel" on:click={() => (isEditing = false)}>Cancel</button>
			<button class="btn" on:click={handleSave}>Save & Close</button>
		</div>
	</dialog>
{:else}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div role="contentinfo" on:click={() => (isEditing = true)} on:keydown>
		<p>
			{@html message.content
				?.replace(/\n/g, '<br>')
				.replace(
					/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
					(match) => `<a href="${match}">${match}</a>`
				)}
		</p>
	</div>
{/if}

<style>
	dialog {
		width: 75%;
		border-radius: 12px;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
	textarea {
		width: 100%;
		height: 200px;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: none;
	}

	textarea:focus-visible {
		outline: none;
	}

	.btn {
		background: #1d69cc;
		margin: 5px;
		color: white;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: 1px solid #1d69cc;
	}

	.btn.cancel {
		background: white;
		color: #888;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: #888 1px solid;
	}
</style>
