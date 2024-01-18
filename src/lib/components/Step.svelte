<script>
	import { slide, fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { tick, getContext } from 'svelte';
	import GetSupportDetails from './GetSupportDetails.svelte';
	import { ExpGradeSelected } from './store';
	import { stepsExpanded } from './store';
	import { mostRecentStep } from './store';

	export let article;
	let imageLoaded = false;
	let innerWidth = 0;
	// Create reactive variable that will be used to track window width
	$: displayMobileText = innerWidth < 768;
	const { getSelectedArticle } = getContext('SelectedArticle');

	let articleCopy = getSelectedArticle();

	import { createEventDispatcher } from 'svelte';
	export let open = false;
	export let index;
	export let step;

	const dispatch = createEventDispatcher();

	function handleClick(index) {
		console.log('from step.svelte, current index is: ', index);
		dispatch('stepClick', { index });
	}

	let detailsElement;
	let summaryElement;

	function slideFade(node, { delay = 0, duration = 400, easing = cubicOut }) {
		const slideOpts = { delay, duration, easing };
		const fadeOpts = { delay, duration, easing };

		return {
			...slide(node, slideOpts),
			...fade(node, fadeOpts)
		};
	}

	function toggleOpen() {
		open = !open;
		dispatch('stepClick', index);
		// document.querySelectorAll('.custom-details').forEach((step, key, parent) => {
		//     console.log(step.textContent);
		//     console.log(step);
		//     console.log(parent);
		//     console.log('most recent step is: ', $mostRecentStep);

		//     if (step.textContent.match(/\d*/g)[0] == $mostRecentStep) {
		//         console.log('we found a match');
		//     }
		// });
	}

	//     function toggleOpen() {
	//     open = !open;
	// }

	// ...

	/** @param {MouseEvent} event */
	async function copyToClipboard(event) {
		console.log(event);
		try {
			const textToCopy = event.target.querySelector('.cCN_CmdName strong').textContent;
			await navigator.clipboard.writeText(textToCopy);
			console.log('Async: Copy to Clipboard Success!');
			let dataLabel = 'Copied!';
			let kbdElement = document.querySelector('.kbd-cdt');
			kbdElement.setAttribute('data-label', dataLabel);
			// Set the data-label back to 'Click to copy' after 2 seconds
			setTimeout(() => {
				dataLabel = 'Click to copy command';
				kbdElement.setAttribute('data-label', dataLabel);
			}, 1000);
		} catch (err) {
			console.error('Failed to copy!', err);
		}
	}

	let questions = [];

	function handleQuestionsFetched(event) {
		questions = event.detail.questions
			.map((question) => {
				return `${question}`;
			})
			.join('');
	}
</script>

<svelte:window bind:innerWidth />

<div
	class="custom-details"
	on:click={toggleOpen}
	bind:this={detailsElement}
	role="presentation"
	on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleOpen()}
>
	<button
		class="custom-summary"
		bind:this={summaryElement}
		aria-expanded="false"
		aria-controls="content"
		title="Click to expand or collapse this step"
	>
		<span id="stepNumberBreadcrumb" class="stepNumberBreadcrumb">{step.step_number}</span>
		{#if !open && !displayMobileText && step.ml_summary}
			<p style="display: block; margin: 0; text-align: left;">{@html step.ml_summary}</p>
		{:else if !open && displayMobileText && step.mobile_summary}
			<p style="display: block; margin: 0; text-align: left;">{@html step.mobile_summary}</p>
		{:else if !open && !displayMobileText && !step.ml_summary}
			<p>
				{@html step.text}
			</p>
		{:else if !open}
			<p>{@html step.text.substring(0, 30) + '....'}</p>
		{/if}
	</button>
	{#if open}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div
			class="content"
			id="content"
			role="region"
			aria-labelledby="stepNumberBreadcrumb"
			transition:slideFade
			on:click={handleClick}
			on:input={handleClick}
			on:keypress={(e) => e.key === 'Enter' && handleClick()}
		>
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<p
				style="text-align: left;"
				on:click={copyToClipboard}
				on:keypress={(e) => e.key === 'Enter' && copyToClipboard(e)}
				in:fly={{ y: -15, duration: 750 }}
			>
				{@html step.text}
			</p>

			{#if step.src}
				<div
					class="img-placeholder"
					style="padding-bottom: calc({step.height} / {step.width} * 100%);"
				>
					<div
						in:fly={{ y: -15, duration: 750, delay: 250 }}
						class="img-wrapper"
						style="aspect-ratio: {step.width} / {step.height};"
					>
						<img
							src={step.src}
							alt={step.alt}
							class={imageLoaded ? 'loaded' : 'hidden'}
							on:load={() => (imageLoaded = true)}
						/>
					</div>
				</div>
			{/if}

			{#if step.note}
				<div class="cdt-note" in:fly={{ y: -15, duration: 750, delay: 550 }}>
					<p>{@html step.note}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
<!-- video
fullyguided
defaultdocumentstyle -->
{#if open && ($ExpGradeSelected === 'fullyguided' || $ExpGradeSelected === 'video')}
	<GetSupportDetails
		{step}
		{index}
		article={articleCopy}
		on:questionsFetched={handleQuestionsFetched}
	/>
{/if}

<style>
	:global(strong) {
		font-weight: bold;
	}
	.hidden {
		display: none;
	}

	img {
		max-width: 100%;
	}
	.img-wrapper {
		background-size: cover;
		background-position: center;
		margin: 1em 40px;
	}

	.img-wrapper img {
		opacity: 0;
		transition: opacity 0.3s;
	}

	.img-wrapper img.loaded {
		opacity: 1;
	}

	button {
		background-color: transparent;
		border: none;
		outline: none;
		cursor: pointer;
		display: flex;
		align-items: center;
	}
	.custom-details {
		cursor: pointer;
		z-index: 10;
		position: relative;
		margin: 0 1em;
		overflow: hidden;
	}
	.custom-summary {
		user-select: none;
		padding: 0;
		width: fit-content;
	}

	#stepNumberBreadcrumb {
		display: inline-block;
		text-align: center;
		line-height: 1.75em;
		font-weight: bold;
		font-size: 1.25em;
		width: 1.75em;
		height: 1.75em;
		color: white;
		border-radius: 35px;
		aspect-ratio: 1/1;
		margin-right: 0.5em;
		background-color: var(--cisco-midnight-blue);
	}
	.custom-details {
		border-radius: 16px;
		background-color: white;
		font-family: inherit;
		font-size: var(--font-size-base);
		color: #333;
		padding: 1em 1.5em;
		border: #d2d2d2 1px solid;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		/* box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0,
          rgba(0, 0, 0, 0.12) 0 1px 18px 0; */
	}

	:global(.cdt-note a[href]) {
		color: #64bbe3;
		-webkit-text-decoration-color: #6cc04a;
		text-decoration-color: #6cc04a;
	}

	:global(.cdt-note a[href]:hover) {
		color: #6cc04a;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
	}

	:global(.cdt-best-practice a[href]) {
		color: #6cc04a;
	}

	:global(.cdt-best-practice a[href]:hover) {
		color: #64bbe3;
		-webkit-text-decoration-color: #6cc04a;
		text-decoration-color: #6cc04a;
	}
	.cdt-note {
		/* background-color: #0d274d; */
		padding: 1.5em;
		color: #333;
		margin: 1.5em 0;
		/* border-radius: 5px; */
		/* box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2); */
		border-left: #0d274d 5px solid;
	}

	:global(#eot-doc-wrapper .kbd-cdt p) {
		margin: 0;
		padding: 0;
	}

	:global(#eot-doc-wrapper ol) {
		list-style-position: initial;
		list-style: none;
	}

	:global(#eot-doc-wrapper ol li) {
		counter-increment: step-counter;
		margin-bottom: 10px;
	}

	:global(#eot-doc-wrapper ol li::before) {
		content: counter(step-counter);
		margin-right: 8px;
		font-size: 80%;
		border: var(--cisco-blue) 2px solid;
		color: #58585b;
		font-weight: 700;
		padding: 4px 8px;
		border-radius: 15px;
		text-align: center;
	}

	:global(#eot-doc-wrapper .kbd-cdt p) {
		margin: 0;
		padding: 0;
	}

	:global(#eot-doc-wrapper > .stepContainer ul li p) {
		display: inline;
	}

	:global(#eot-doc-wrapper > .stepContainer p ul li) {
		display: block;
	}

	:global(#eot-doc-wrapper > .stepContainer ul) {
		list-style: none;
		font-size: 0.95em;
	}

	:global(#eot-doc-wrapper > .stepContainer ul li) {
		display: inline-block;
		font-weight: 400;
		margin-bottom: 6px;
		font-size: 1em;
	}

	:global(#eot-doc-wrapper .stepContainer ul li::before) {
		content: '\25cf';
		color: var(--cisco-blue);
		font-weight: 900;
		font-size: 1.15em;
		display: inline-block;
		width: 1em;
		text-align: left;
	}

	:global(#eot-doc-wrapper .kbd-cdt) {
		display: block;
		font-size: 1.25em;
		height: auto;
		background-color: #0d274d;
		color: #64bbe3;
		border-radius: 5px;
		padding: 1.5em;
		margin: 1em 20px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		text-align: left;
	}
</style>
