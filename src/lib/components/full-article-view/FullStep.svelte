<script>
	import { createEventDispatcher } from 'svelte';

	export let step;
	export let index;
	export let active;

	const dispatch = createEventDispatcher();
	let stepContainer;

	$: {
		console.log('active', active);
	}

	function handleMouseOver(event) {
		dispatch('onStepInteract', { index });
	}

	function handleFocus(event) {
		console.log('focus event', event);
		stepContainer.focus();
		stepContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<div
	role="contentinfo"
	class="stepContainer"
	bind:this={stepContainer}
	on:mouseover={handleMouseOver}
	on:focus={handleFocus}
>
	<h4>Step {step.step_number}</h4>
	<p>{@html step.text}</p>
	{#if step.src}
		<a href={step.src} class="show-image-alone" title="Related image, diagram or screenshot."
			><img alt={step.alt} src={step.src} /></a
		>
	{/if}
</div>

<style>
	.stepContainer {
		margin: 1em 0;
		padding: 1em 0;
	}
	.stepContainer p {
		margin: 0;
	}

	.stepContainer h4 {
		margin: 0;
		font-weight: 700;
	}

	:global(ul) {
		list-style-type: none;
	}

	:global(ul li::before) {
		content: '\25cf';
		color: #64bbe3;
		font-weight: 900;
		font-size: 1.15em;
		display: inline-block;
		width: 1em;
		text-align: left;
	}

	.stepContainer img {
		max-width: calc(100% - 80px);
		height: auto;
		margin: 1.5em 40px;
		border-radius: 5px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
	}

	:global(#eot-doc-wrapper .kbd-cdt) {
		display: block;
		font-size: 1.25em;
		height: auto;
		background-color: #dfdfdf;
		color: var(--text-color-blue1);
		border-radius: 12px;
		padding: 1.5em;
		margin: 1.5em 40px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
	}

	:global(#eot-doc-wrapper .kbd-cdt p) {
		padding: 0;
		margin: 0;
	}

	:global(#eot-doc-wrapper .kbd-cdt:hover) {
		background-color: #c2c2c2;
		cursor: copy;
	}

	:global(#eot-doc-wrapper .kbd-cdt:hover:after) {
		content: attr(data-label);
		display: grid;
		justify-content: end;
		align-content: flex-start;
		height: 0;
	}
	:global(#eot-doc-wrapper .KBDCDTCOPY::after) {
		display: grid;
		place-items: center;
		color: #ffa000;
		content: ' Copied! ';
	}

	@media only screen and (max-width: 768px) {
		.stepContainer img {
			max-width: calc(100% - 40px);
			margin: 1.5em 20px;
		}

		.stepContainer p {
			margin: 0 20px;
		}
	}
</style>
