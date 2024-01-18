<script>
	import Step from './Step.svelte';
	import { onMount, createEventDispatcher, setContext } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintIn } from 'svelte/easing';
	import ModalitySelectArticle from '$lib/components/ModalitySelectArticle.svelte';
	import {
		mostRecentStep,
		mountedArticleSteps,
		mountedArticlePreambleObjective,
		mountedArticlePreambleDevices,
		ExpGradeSelected
	} from '$lib/components/store';
	import GetSupportDetailsFooter from '$lib/components/GetSupportDetailsFooter.svelte';
	import GetSupportDetailsMobile from '$lib/components/GetSupportDetailsMobile.svelte';
	import { _ as format } from 'svelte-i18n';

	export let article;
	export let open = true;

	setContext('SelectedArticle', {
		getSelectedArticle: () => article
	});

	onMount(() => {
		window.addEventListener('scroll', handleScroll);

		if (article) {
			console.log('article from onMount is:', article);
			// Set articleSteps and update mountedArticleSteps store
			let articleSteps = article.Steps;
			// console.log('articleSteps', articleSteps);
			if ('related_video' in article) {
				hasRelatedVideo = true;
				relatedVideo = article.related_video;
			}
			// Combine objective and applicable devices into a single string
			const objective = article.objective;
			const applicableDevices = article.applicable_devices
				.map((device) => `${device.device_name} (Software version: ${device.software_version})`)
				.join(', ');

			// Update the mountedArticle store
			mountedArticlePreambleObjective.set(objective);
			mountedArticlePreambleDevices.set(applicableDevices);
			mountedArticleSteps.set(article.steps);
		} else {
			console.log('article is not defined');
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	let isSticky = false;
	let expandedSteps = new Set();
	let hasRelatedVideo = false;
	let relatedVideo = undefined;
	let expanded = false;
	let video = 'View Video Version of this Article';

	function toggleExpand() {
		expanded = !expanded;
		video = expanded ? 'Hide Video' : 'View Video Version of this Article';
	}

	function handleScroll() {
		const stickyElement = document.getElementById('test');

		if (stickyElement) {
			const stickyRect = stickyElement.getBoundingClientRect();

			if (stickyRect.top <= 0) {
				isSticky = true;
			} else {
				isSticky = false;
			}
		}
	}

	function handleClick(index, step) {
		console.log('from article HandleClick: ', index);
		// Toggle the expanded state of the clicked step
		if (expandedSteps.has(index)) {
			expandedSteps.delete(index);
		} else {
			expandedSteps.add(index);
		}

		dispatch('customAction', { index, step });

		$mostRecentStep = index;
		console.log('from Article.svelte mostRecentStep is: ', $mostRecentStep);
		dispatch('stepClick', index);
		// Trigger a component update
		expandedSteps = new Set(expandedSteps);
		dispatch('customAction', { index, step });
		console.log('Expanded Steps: ', expandedSteps);
	}

	$: console.log('ExpGradeSelected, from article is: ', $ExpGradeSelected);

	$: if ($ExpGradeSelected !== 'video') {
		expanded = false;
	}
	$: if ($ExpGradeSelected === 'video') {
		console.log('video selected');
		expanded = true;
	}

	function onVideoSelected() {
		console.log('Video Selected');
		expanded = true;
	}

	function handleVideoSelected(event) {
		expanded = event.detail.expanded;
	}

	function handleOpen(event) {
		console.log('Open event received:', event.detail);
	}

	let windowWidth;
	const dispatch = createEventDispatcher();

	function toggleModalState() {
		dispatch('toggle');
		console.log('mountedArticleSteps from toggleModalState() is: ', $mountedArticleSteps);
	}

	function toggleModalStateKeyPress(e) {
		e.preventDefault();
		console.log('key press: ', e.key);
		if (e.key === 'Enter') {
			toggleModalState();
		} else {
			return;
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if open}
	<div class="modal">
		<div id="eot-doc-wrapper">
			<span
				aria-hidden="false"
				class="close cursor"
				title="Close The Current Article"
				on:keydown={toggleModalStateKeyPress}
				on:click={toggleModalState}>&times;</span
			>
			<div class="article-Hero">
				<div class="frostedGlass">
					<!-- <img id="heroImage" src={backgroundImage} alt="hero image" style="display:none;"/> -->

					<div class="band" />

					<h1 style="line-height: 1.075em;">{article.title}</h1>
					<h2 class="articleHeadersExp">Objective</h2>
					<p>{@html article.objective}</p>

					{#if article && article.applicable_devices && article.applicable_devices.length > 0}
						<h2 class="articleHeadersExp">Applicable Devices | Software Version</h2>
						<ul>
							{#each article.applicable_devices as device}
								{#if device.device_name && device.software_version && device.data_sheet_link && device.download_latest_link}
									<li>
										{device.device_name}
										<a href={device.data_sheet_link}> (Datasheet) </a>
										| {device.software_version}
										<a href={device.download_latest_link}> (Download Latest) </a>
									</li>
								{:else if device.device_name && device.software_version && device.data_sheet_link}
									<li>
										{device.device_name}
										<a href={device.data_sheet_link}> (Datasheet) </a>
										| {device.software_version}
									</li>
								{:else if device.device_name && device.software_version && device.download_latest_link}
									<li>
										{device.device_name} | {device.software_version}
										<a href={device.download_latest_link}> (Download Latest) </a>
									</li>
								{:else if device.device_name && device.software_version}
									<li>
										{device.device_name}{#if device.software_version}
											| {device.software_version}{/if}
									</li>
								{:else}
									<li>{device.device_name}</li>
								{/if}
							{/each}
						</ul>
					{/if}
					{#if article.intro}
						<h2 class="articleHeadersExp">Introduction</h2>
						<p>{@html article.intro}</p>
					{/if}
				</div>
			</div>

			<div class="container-est-completion" id="test">
				<div class="nested-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 80 80"
						class="s-qHuZzP0FnHPs"
						style="width: 50px;display:inline-block;"
						><path
							d="M58,39.25H46.70581a6.74732,6.74732,0,0,0-13.41162,0H22a12.75,12.75,0,0,0,0,25.5H57.29419a6.75,6.75,0,1,0,0-1.5H22a11.25,11.25,0,0,1,0-22.5H33.29419a6.74732,6.74732,0,0,0,13.41162,0H58a12.75,12.75,0,0,0,0-25.5H22.70581a6.687,6.687,0,0,0-.66064-2.23462L25.06055,10,24,8.93945l-2.78308,2.78308A6.74807,6.74807,0,1,0,22.70581,16.75H58a11.25,11.25,0,0,1,0,22.5Zm6,19.5A5.25,5.25,0,1,1,58.75,64,5.25605,5.25605,0,0,1,64,58.75ZM40,45.25A5.25,5.25,0,1,1,45.25,40,5.25605,5.25605,0,0,1,40,45.25Zm-24-24a5.25009,5.25009,0,1,1,4.13525-8.44586L16,16.93945l-2-2L12.93945,16l2.53028,2.53027a.74971.74971,0,0,0,1.06054,0l4.36939-4.36944A5.19508,5.19508,0,0,1,21.25,16,5.25605,5.25605,0,0,1,16,21.25Z"
							class="s-qHuZzP0FnHPs"
						/></svg
					>
					<p class="estcomText">{$format('estimated_completion_text')}:</p>
					<span>14 Min.</span>
				</div>

				<!-- <div class="nested-2">
                <ModalitySelectArticle />
            </div>
            {#if windowWidth < 768}
                <div class="nested-3">
                    <GetSupportDetailsMobile index={$mostRecentStep} />
                </div>
            {/if} -->
			</div>

			{#if expanded && hasRelatedVideo}
				<div class="vid-card-container" transition:slide>
					<div
						class="video-card"
						in:fly={{ delay: 25, duration: 1000, y: 55, easing: quintIn }}
						out:fly={{ duration: 1000, y: -55, easing: quintIn }}
					>
						<iframe
							loading="lazy"
							class="vid-card-iframe"
							src={relatedVideo.URL}
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
							webkitallowfullscreen
							mozallowfullscreen
						/>
						<div class="video-text-content">
							<h3 class="video-card-title">{article.title}</h3>
							<p id="video-card-description">{article.objective}</p>
						</div>
					</div>
				</div>
				<!-- <GetSupportDetailsFooter index={$mostRecentStep} /> -->
			{:else if expanded && !hasRelatedVideo}
				<p class="warning-text" style="display: flex; justify-content: center;" transition:slide>
					This article does not have a related video.
				</p>
			{/if}
			{#if article.best_practice}
				{@html article.best_practice}
			{/if}

			<div
				class="stepContainer"
				style="scroll-snap-type: y mandatory; overflow-y: auto; scroll-snap-type: y mandatory; scroll-behavior: smooth; scroll-snap-align: start;"
			>
				{#each article.Steps as step, index}
					{#if step.step_number === 1}
						<h4 class="section-title">{step.section}</h4>
					{/if}
					<Step
						style="scroll-snap-align: start;"
						{step}
						{index}
						open={expandedSteps.has(index)}
						on:stepClick={() => handleClick(index, step)}
					/>
				{/each}
			</div>
			<!-- {#if $ExpGradeSelected === 'lightlyguided' || $ExpGradeSelected === 'defaultdocumentstyle' || $ExpGradeSelected === 'fullyguided'}
            <GetSupportDetailsFooter index={$mostRecentStep} />
        {/if} -->
		</div>
	</div>
{/if}

<style>
	.warning-text {
		color: var(--theme-warning);
		font-size: var(--font-size-base);
		transition: opacity 0.5s ease;
		opacity: 1;
	}
	:link {
		text-decoration: none;
	}
	.section-title {
		color: #58585b;
		margin-top: 1.5em;
		font-weight: bold;
	}

	.modal {
		position: fixed;
		z-index: 9999;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transition: opacity 0.5s ease-in-out;
		background-color: rgba(0, 0, 0, 0.77);
		padding: 3em 0;
		overflow-y: auto;
	}

	.close {
		font-size: 35px;
		font-weight: bold;
		color: #333;
		transition: color 0.2s ease-in-out;
	}

	.close:hover {
		color: #000000;
	}

	.cursor {
		cursor: pointer;
	}

	#eot-doc-wrapper {
		padding: 1em 2em;
		font-size: var(--font-size-base);
		background-color: #efefef;
		width: 75%;
		height: max-content;
		margin: 0 auto;
	}

	#eot-doc-wrapper h2 {
		margin: 1em 0;
	}

	#eot-doc-wrapper h3 {
		font-size: var(--font-size-base);
		color: var(--text-color-black3);
	}

	:global(#eot-doc-wrapper > ul) {
		list-style-type: none;
	}

	.frostedGlass {
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 1em;
		/* margin: 1em; */
		z-index: -1;
	}

	.stepContainer {
		scroll-snap-type: proximity;

		scroll-snap-type: y proximity;
		transition: all 0.5s ease-in-out;
	}

	.frostedGlass {
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 1em;
		/* margin: 1em; */
		z-index: -1;
	}

	.stepContainer {
		scroll-snap-type: proximity;

		scroll-snap-type: y proximity;
		transition: all 0.5s ease-in-out;
	}

	.vid-card-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin: 0 auto;
		max-width: 100%;
		padding: 0 1em;
		margin-bottom: 2em;
		z-index: -1;
	}

	.video-card {
		max-width: clamp(200px, 100%, 600px);
		height: 400px;
		background-color: white;
		display: inline-flex;
		flex-flow: column nowrap;
		position: relative;
		top: 0;
		left: 0;
		margin: 1em;
		padding: 0;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid #d2d3d7;
		transition: all 0.5s ease-in-out;
		scroll-snap-align: start;
		align-self: center;
		margin-bottom: 2em;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		max-height: 550px;
	}

	.vid-card-iframe {
		width: 100%;
		height: clamp(300px, 100%, 600px);
	}

	.video-text-content {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;
		flex: 1;
	}

	.video-card-title {
		padding: 1em;
		color: var(--cisco-dark-blue);
		margin: 0;
		font-weight: 700;
		font-size: var(--font-size-base);
		line-height: 1.286;
	}

	#video-card-description {
		padding: 0 1em 1em 1em;
		color: rgb(88, 91, 99);
		margin: 0 0 1em 0;
		display: -webkit-box;
		display: inline-block;
		font-weight: 800;
		overflow: hidden;
		font-family: 'CiscoSansThin';
	}

	.nested-1 {
		display: flex;
		align-items: center;
		justify-content: center;
		/* margin: 1em; */
	}

	#eot-doc-wrapper p {
		margin: 1em;
	}
	.container-est-completion {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		flex-wrap: wrap;
		padding-left: 1.25em;
	}

	h1 {
		font-size: 2em;
		text-align: center;
		font-family: ciscosansthin;
		margin: 2em 0;
	}

	.article-Hero {
		background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%),
			linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%),
			linear-gradient(10deg, #a1c4fd 0%, #c2e9fb 100%);
		transition: all 0.5s ease-in-out;

		/* 
        background-image: url('$lib/assets/assing-port-to-vlan-dall-e-2.png'),
            linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);  */
		background-size: cover;

		mix-blend-mode: darken;
		/* height: 50vh; */
		/* width: 100%; */
		/* padding: 1em; */
		margin: 1em;
		border-radius: 20px;
	}

	#eot-doc-wrapper h2 {
		color: #2b5592;
		margin-top: 1.5em;
	}

	#eot-doc-wrapper h3 {
		color: #58585b;
	}

	#eot-doc-wrapper a[href],
	#eot-doc-wrapper abbr {
		color: #2b5592;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
		font-weight: 700;
	}

	#eot-doc-wrapper a[href]:hover,
	#eot-doc-wrapper abbr:hover {
		color: #64bbe3;
		-webkit-text-decoration-color: #2b5592;
		text-decoration-color: #2b5592;
		transition: 0.3s;
	}

	#eot-doc-wrapper a {
		color: #2b5592;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
		text-underline-position: below;
		transition: 0.3s;
	}

	#eot-doc-wrapper #context-selector-tab-container a:not(.active) {
		color: #64bbe3;
	}

	#eot-doc-wrapper .cdt-note a[href] {
		color: #64bbe3;
		-webkit-text-decoration-color: #6cc04a;
		text-decoration-color: #6cc04a;
	}

	#eot-doc-wrapper .cdt-note a[href]:hover {
		color: #6cc04a;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
	}

	#eot-doc-wrapper .cdt-best-practice a[href] {
		color: #6cc04a;
	}

	#eot-doc-wrapper .cdt-best-practice a[href]:hover {
		color: #64bbe3;
		-webkit-text-decoration-color: #6cc04a;
		text-decoration-color: #6cc04a;
	}

	#eot-doc-wrapper samp {
		color: #fff;
	}

	#eot-doc-wrapper .kbd-cdt p {
		color: #64bbe3;
	}

	#eot-doc-wrapper p {
		line-height: 1.25em;
		margin: 1.5em 40px;
		text-align: justify;
	}

	#eot-doc-wrapper blockquote {
		font-size: 1.5em;
		border-top: 0.25em #2b5592 solid;
		border-bottom: 0.25em #2b5592 solid;
		color: #2b5592;
		font-weight: 600;
		padding: 1.5em 1em;
		margin: 1.5em 40px;
	}

	:global(#eot-doc-wrapper kbd) {
		display: block;
		font-size: 1.25em;
		height: auto;
		background-color: #0d274d;
		color: #64bbe3;
		border-radius: 5px;
		padding: 1.5em;
		margin: 1.5em 40px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
	}

	#eot-doc-wrapper li {
		color: #58585b;
	}

	:global(#eot-doc-wrapper li p) {
		margin: 0;
	}

	:global(#eot-doc-wrapper ol) {
		-webkit-padding-start: 1px;
		padding-inline-start: 1px;
	}

	:global(#eot-doc-wrapper ol, #eot-doc-wrapper ul) {
		list-style: none;
	}

	:global(#eot-doc-wrapper ul) {
		margin-left: 0 !important;
	}

	#eot-doc-wrapper ul li p {
		display: contents;
	}

	#eot-doc-wrapper ul li p a {
		display: contents;
	}

	#eot-doc-wrapper ul li ul li {
		display: contents;
	}

	#eot-doc-wrapper ul li::before {
		content: '\25cf';
		color: #64bbe3;
		font-weight: 900;
		font-size: 1.15em;
		display: inline-block;
		width: 1em;
		text-align: left;
	}

	#eot-doc-wrapper ol {
		margin-left: 20px;
	}

	#eot-doc-wrapper .cdt-count li {
		counter-increment: step-counter;
		margin-bottom: 10px;
	}

	#eot-doc-wrapper .cdt-count li::before {
		content: counter(step-counter);
		margin-right: 8px;
		font-size: 80%;
		border: #64bbe3 2px solid;
		color: #58585b;
		font-weight: 700;
		padding: 4px 8px;
		border-radius: 15px;
		text-align: center;
	}

	@media only screen and (min-width: 769px) and (max-width: 1024px) {
		#eot-doc-wrapper {
			width: 85%;
		}
	}

	@media (max-width: 768px) {
		#eot-doc-wrapper {
			width: 90%;
			margin: 0 auto;
		}
		#test {
			position: sticky;
			top: 0;
			z-index: 50;
			padding: 1em;
			gap: 1em;
			background: #efefef;
		}

		.container-est-completion {
			/* justify-content: space-around; */
			padding-left: 0;
		}
		.video-card {
			margin: 0;
		}
		.estcomText {
			display: none;
		}

		.stepContainer {
			margin: 1em;
			transition: all 0.5s ease-in-out;
		}
	}
</style>
