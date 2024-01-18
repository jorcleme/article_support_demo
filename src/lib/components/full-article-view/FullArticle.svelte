<script>
	import { format } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import {
		mostRecentStep,
		mountedArticleSteps,
		mountedArticlePreambleObjective,
		mountedArticlePreambleDevices,
		ExpGradeSelected
	} from '$lib/components/store';
	import lightlyGuidedImage from '$lib/assets/assing-port-to-vlan-dall-e-2.png';
	import fullyGuidedImage from '$lib/assets/assing-port-to-vlan-dall-e.png';
	import { slide, fly } from 'svelte/transition';
	import { quintIn, cubicIn } from 'svelte/easing';
	import FullStep from './FullStep.svelte';
	import debounce from '$lib/utils/debounce';
	import DetailsGetSupportStep from './DetailsGetSupportStep.svelte';
	import {
		activeSupportSection,
		isSupportStepDetailsOpen,
		activeSupportStep
	} from './fullViewStore';

	let dialogComponent;

	export let article;

	let hasRelatedVideo = false;
	$: expandedSteps = new Set();
	const stepElements = [];
	let objectiveElement;
	let relatedVideo = undefined;
	let expanded = false;
	let isSticky = false;
	/** @type {Array<HTMLDivElement>} */
	let getSupportDivs = [];
	$: backgroundImage = $ExpGradeSelected === 'Fully Guided' ? fullyGuidedImage : lightlyGuidedImage;

	onMount(() => {
		window.addEventListener('scroll', handleClosestSupportDiv);
		window.addEventListener('scroll', debounce(handleScroll, 100));
		console.log('objectiveElement', objectiveElement);
		if (article) {
			const { steps } = article;
			if ('related_video_url' in article) {
				hasRelatedVideo = true;
				relatedVideo = article.related_video_url;
			}
			// Combine objective and applicable devices into a single string
			const { objective } = article;
			const applicableDevices = article.applicable_devices
				.map((device) => `${device.device_name} (Software version: ${device.software_version})`)
				.join('\n');

			// Update the mountedArticle store
			mountedArticlePreambleObjective.set(objective);
			mountedArticlePreambleDevices.set(applicableDevices);
			mountedArticleSteps.set(steps);
			// observer = new IntersectionObserver(processEntries, {
			// 	threshold: 0.95,
			// 	rootMargin: '0px'
			// });
			// observer = new IntersectionObserver(
			// 	(entries) => {
			// 		console.log('entries', entries);
			// 		entries.forEach((entry) => {
			// 			if (entry.isIntersecting) {
			// 				const stepIndex = stepElements.indexOf(entry.target);
			// 				console.log('stepIndex', stepIndex);
			// 				console.log('entry target', entry.target);
			// 				mostRecentStep.set(stepIndex);
			// 				console.log('mostRecentStep', $mostRecentStep);
			// 				expandedSteps.add(stepIndex);
			// 			}
			// 		});
			// 	},
			// 	{ threshold: [0, 0.25, 0.5, 0.75, 1] }
			// );

			// getSupportDivs.forEach((el) => {
			// 	observer.observe(el);
			// 	console.log(el);
			// });
			// observer.observe(objectiveElement);
		} else {
			console.log('article is not defined');
		}
		console.log($mountedArticleSteps);
		console.log($mountedArticlePreambleObjective);
		console.log($mountedArticlePreambleDevices);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function handleClosestSupportDiv() {
		let divs = Array.from(getSupportDivs);
		divs.unshift(objectiveElement);
		let { closestSection, currentStep } = divs.reduce(
			(acc, div) => {
				const rect = div.getBoundingClientRect();
				const divCenter = rect.top + rect.height / 2;
				const screenCenter = window.innerHeight / 2;
				const distance = Math.abs(screenCenter - divCenter);
				return distance < acc.closestDistance
					? {
							closestDistance: distance,
							closestSection: div.getAttribute('data-section'),
							currentStep: div.getAttribute('data-step')
						}
					: acc;
			},
			{ closestDistance: Infinity, closestSection: null, currentStep: null }
		);

		if (closestSection) {
			activeSupportSection.set(closestSection);
		}
		if (currentStep) {
			mostRecentStep.set(parseInt(currentStep));
		}
	}

	$: {
		console.log('mostRecentStep', $mostRecentStep);
	}

	$: {
		let step = $mountedArticleSteps[$mostRecentStep];
		if (step) {
			activeSupportStep.set(parseInt(step.step_number));
		}
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

	function handleOpen(event) {
		isSupportStepDetailsOpen.set(true);
		console.log('handleOpen', event);
		console.log('mostRecentStep', $mostRecentStep);
		expandedSteps.add(event.detail.index);
		console.log('expandedSteps', expandedSteps);
	}
	function handleClose(event) {
		console.log('handleClose', event);
		expandedSteps.delete(event.detail.index);
		console.log('expandedSteps', expandedSteps);
		// $isSupportStepDetailsOpen = false;
		mostRecentStep.set(-1);
	}
</script>

<!-- <svelte:window on:scroll={() => debounce(handleClosestSupportDiv)} /> -->

<div id="eot-doc-wrapper" style="position: relative;">
	<div>
		<div
			class="article-Hero"
			style="background-image: url({backgroundImage}); margin: -1em 0 3em 0; border-radius: 16px;"
		>
			<div class="frostedGlass">
				<!-- <img id="heroImage" src={backgroundImage} alt="hero dynamic experience background" /> -->

				<div class="band" />

				<h1 style="line-height: 1.075em;">{article.title}</h1>
				<h2 class="articleHeadersExp">Objective</h2>
				<div data-section="Objective" bind:this={objectiveElement}>
					<p>{article.objective}</p>
				</div>

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
		<div class="cdt-best-practice">
			<p>
				Backup your configuration prior to upgrading the firmware. You can do this by navigating to <b
					>Administration &gt; File Management &gt; File Operations</b
				> in the menu. Download a copy of the running configuration to your PC. It is not recommended
				to do a firmware upgrade of your device remotely.
			</p>
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
		</div>
		{#if expanded && hasRelatedVideo}
			<div class="vid-card-container" in:slide>
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
		{/if}
		{#each article.steps as step, index}
			<div class="stepContainer" bind:this={stepElements[index]}>
				{#if step.step_number === 1}
					<h4 class="section-title">{step.section}</h4>
				{/if}
				<FullStep {index} {step} active={expandedSteps.has(index)} />

				<div
					class="getSupportStep"
					data-section={step.section}
					data-step={index}
					bind:this={getSupportDivs[index]}
					class:hidden={$ExpGradeSelected === 'Lightly Guided'}
				>
					<!-- <DetailsGetSupportWidget
							open={isWidgetOpen}
							on:openDialog={handleOpen}
							on:closeDialog={handleClose}
							currentStep={step.section + ' | Step ' + step.step_number}
						/> -->

					<DetailsGetSupportStep
						open={expandedSteps.has(index)}
						{index}
						on:openDialog={handleOpen}
						on:closeStepDialog={handleClose}
						stepId={step.id}
						currentStep={step.section + ' | Step ' + step.step_number}
					/>
				</div>
			</div>
		{/each}
		<slot />
	</div>
</div>

<style>
	#eot-doc-wrapper a[href] {
		color: #2b5592;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
		font-family: 'CiscoSansThin';
		font-weight: 700;
	}
	.hidden {
		visibility: hidden;
		margin: 0;
		padding: 0;
		height: 0;
	}
	#eot-doc-wrapper {
		color: #58585b;
	}
	.frostedGlass {
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 1em;
		z-index: -1;
		transition: all 0.1s ease;
	}

	.article-Hero {
		background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%),
			linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%),
			linear-gradient(10deg, #a1c4fd 0%, #c2e9fb 100%);
		transition: all 0.3s ease-in-out;
		background-size: cover;
		mix-blend-mode: darken;
		margin: 1em;
		border-radius: 20px;
	}

	#eot-doc-wrapper h1,
	#eot-doc-wrapper h2 {
		font-weight: 700;
	}

	#eot-doc-wrapper h1 {
		font-size: var(--font-size-md);
		text-align: center;
		font-family: 'CiscoSansTT';
		margin: 2em 0;
		font-weight: 700;
		color: #58585b;
		line-height: 1.25em;
	}

	#eot-doc-wrapper h2 {
		font-size: var(--font-size-base);
		font-family: 'CiscoSansTT';
		margin: 1em 0;
		color: #2b5592;
	}

	.container-est-completion {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		flex-wrap: wrap;
		padding-left: 1.25em;
	}

	.nested-1 {
		display: flex;
		align-items: center;
		justify-content: center;
		/* margin: 1em; */
	}

	.nested-1 svg,
	.nested-1 p {
		margin-right: 10px;
	}

	:link {
		text-decoration: none;
	}

	ul {
		list-style-type: none;
	}

	ul li::before {
		content: '\25cf';
		color: #64bbe3;
		font-weight: 900;
		font-size: 1.15em;
		display: inline-block;
		width: 1em;
		text-align: left;
	}

	.section-title {
		font-weight: 700;
		margin: 20px 0 16px 0;
		color: var(--cisco-midnight-blue);
	}

	#eot-doc-wrapper .cdt-best-practice {
		background-color: #0d274d;
		padding: 1.5em;
		color: #fff;
		margin: 1.5em 40px;
		border-radius: 5px;
		-webkit-box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		border-left: #6cc04a 5px solid;
		font-size: var(--font-size-base);
	}

	#eot-doc-wrapper .cdt-best-practice:before {
		color: #6cc04a;
		content: '\272A  Best Practice:';
		font-size: var(--font-size-base);
		font-weight: 700;
		line-height: 2em;
		-webkit-transition: all 0.3s ease;
		-o-transition: all 0.3s ease;
		transition: all 0.3s ease;
	}

	@media only screen and (max-width: 768px) {
		.estcomText {
			display: none;
		}
	}
</style>
