<script>
	import Breadcrumb from './Breadcrumb.svelte';
	import { UserPreferences, CurrentStep, BreadcrumbStore } from './store';
	import MediaCardArticle from '$lib/components/MediaCardArticle.svelte';
	import MediaCardVideo from '$lib/components/MediaCardVideo.svelte';
	import { onMount, afterUpdate } from 'svelte/internal';
	import { quadInOut, quintOut } from 'svelte/easing';
	import { slide, crossfade } from 'svelte/transition';
	import {
		type,
		category,
		searchValue,
		searchStore,
		search
	} from '$lib/components/search/searchStore.js';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	// NOTE: Imported as "_" here because we are using a reactive variable with the same name "format".
	// Props
	export let open;
	export let media;

	$: referrer = $page.url.pathname;

	onMount(() => {
		console.log('referrer: ', referrer);
		console.log(UserPreferences.get('attributes'));
		const attributes = UserPreferences.get('attributes') || [];
		if (attributes && attributes.length > 0) {
			$searchValue = attributes.join(', ');
			if (attributes.includes('CLI') || attributes.includes('Command Line Interface')) {
				warningCLI = true;
			}
		}
		$searchStore.data = media;
		console.log('searchStore data: ', $searchStore.data);
		$searchStore.filtered = media;
	});

	afterUpdate(() => {
		console.log('Here are your returned media based on your selections of ');
		console.log('Category: ', $category);
		console.log('Type: ', $type);
		console.log('Media: ', $search);

		let articlesOnly = media.filter((media) => media.type === 'Articles');
		console.log(articlesOnly);
	});

	function handleDropdownClick(event) {
		if (!open) {
			return;
		} else {
			$BreadcrumbStore.step3complete = true;
			$BreadcrumbStore.currentStep = 3;
			CurrentStep.setStepThree();
			if (event.target.classList.contains('searchBar')) {
				document.querySelector('.searchButton').style.transform = 'translateX(100px)';
			}
			if (!event.target.classList.contains('searchBar')) {
				document.querySelector('.searchButton').style.transform = 'translateX(0px)';
			}
		}

		CurrentStep.persistStep($CurrentStep);
		BreadcrumbStore.saveState($BreadcrumbStore);
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	let warningCLI = false;
	// on mount check if the window has search params and filter the media object

	$: format = true; // the format of the media, either all on y axis or x scrolling

	// function that changes chatbot-content-card-container from grid-template-columns: 1fr 1fr 1fr 1fr; to grid-template-columns: 1fr;
	function changeFormat() {
		// This logic is now abstracted to a dynamic class -> formatted
		format = !format;
	}

	$: filteredMedia = $search.data.filter((media) => $type === 'All' || media.type === $type);

	$: filteredcategory = filteredMedia.filter(
		(media) => $category === 'All' || media.category === $category
	);

	// When user clicks into the searchBar, set the media object to all media
	/** @param {MouseEvent} event */
	function resetMedia(event) {
		// if searchBar is in the classList of the event target, then set the media object to all media
		if (event.target.classList.contains('searchBar')) {
			document.querySelector('.searchButton').style.transform = 'translateX(100px)';
		}
		if (!event.target.classList.contains('searchBar')) {
			document.querySelector('.searchButton').style.transform = 'translateX(0px)';
		}
	}

	function handleKeyDown(event) {
		if (event.isComposing || event.keyCode === 229) {
			return;
		}
		console.log(event);
	}

	function resetSearchTerm(event) {
		if (/restore/gi.test($category)) {
			console.log('Restoring The search term.....');
			restoreUserPreferences();
		}
		if (/reset/gi.test(event.target.value)) {
			console.log('Reset Detected. Navigating......');
			$UserPreferences.attributes = [];
			UserPreferences.persist($UserPreferences);
			const params = new URLSearchParams([['referrer', referrer]]);
			window.location.href = `/config/attributes?${params}`;
		}
	}

	function restoreUserPreferences() {
		$category = $category === 'Restore' ? 'All' : $category;
		$searchValue = $UserPreferences.attributes?.join(', ');
		return;
	}
</script>

<div class="container" id="get-optimized" role="contentinfo">
	<details class="dropdown" bind:open>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<summary class="dropdown-summary" on:click={handleDropdownClick} on:keydown={handleKeyDown}>
			<div class="row-flex">
				<Breadcrumb name="getoptimized" --icon-width="3.5rem" --icon-height="auto" />
				<div class="title">{$_('get_optimized_title')}</div>
			</div>
			<div class="row-flex">
				<svg
					class:drop={open === true}
					class:up={open === false}
					xmlns="http://www.w3.org/2000/svg"
					class="ionicon"
					viewBox="0 0 512 512"
					><title>Chevron Down</title><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="48"
						d="M112 184l144 144 144-144"
					/></svg
				>
			</div>
		</summary>
		<div class="dropdown-content">
			<div class="intro">
				<p>{$_('get_optmized_intro')}</p>
			</div>
			<section style="margin: 3em 0;">
				<div class="heroContainer">
					<div class="searchContainer">
						<svg
							class="searchButton"
							width="50"
							height="50"
							viewBox="0 0 50 50"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clip-path="url(#clip0_1580_847)">
								<path
									d="M10.3119 32.1883C13.1552 35.0293 16.9932 36.6512 21.0122 36.7099C25.0311 36.7687 28.9149 35.2596 31.84 32.5029L43.4186 44.0816L44.0815 43.4187L32.5028 31.8401C34.5836 29.6267 35.9663 26.8494 36.4781 23.855C36.9899 20.8606 36.6082 17.7817 35.3807 15.0029C34.1531 12.2241 32.1342 9.86848 29.5759 8.23026C27.0176 6.59203 24.0334 5.74379 20.9959 5.79145C17.9584 5.83912 15.0023 6.78058 12.4966 8.49826C9.99101 10.2159 8.04694 12.6337 6.9072 15.4497C5.76746 18.2656 5.48256 21.355 6.08808 24.3319C6.6936 27.3088 8.16271 30.0413 10.3119 32.1883ZM10.9748 10.9749C13.007 8.94264 15.5963 7.55865 18.4151 6.99795C21.2339 6.43725 24.1557 6.72503 26.811 7.82487C29.4663 8.92472 31.7358 10.7873 33.3325 13.1769C34.9292 15.5666 35.7815 18.3761 35.7815 21.2502C35.7815 24.1242 34.9292 26.9337 33.3325 29.3234C31.7358 31.7131 29.4663 33.5756 26.811 34.6754C24.1557 35.7753 21.2339 36.0631 18.4151 35.5024C15.5963 34.9417 13.007 33.5577 10.9748 31.5254C9.62001 30.1791 8.54486 28.5781 7.81119 26.8147C7.07751 25.0513 6.69981 23.1601 6.69981 21.2502C6.69981 19.3402 7.07752 17.4491 7.81119 15.6856C8.54487 13.9222 9.62001 12.3212 10.9748 10.9749Z"
									fill="url(#paint0_linear_1580_847)"
								/>
							</g>
							<defs>
								<linearGradient
									id="paint0_linear_1580_847"
									x1="24.9297"
									y1="5.78955"
									x2="24.9297"
									y2="44.0816"
									gradientUnits="userSpaceOnUse"
								>
									<stop stop-color="#00BCEB" />
									<stop offset="0.445546" stop-color="#1482DB" />
									<stop offset="1" stop-color="#0169C2" />
								</linearGradient>
								<clipPath id="clip0_1580_847">
									<rect width="50" height="50" fill="white" />
								</clipPath>
							</defs>
						</svg>

						<input
							class="searchBar"
							type="search"
							on:click={(event) => resetMedia(event)}
							on:keydown
							placeholder="Search All Media"
							bind:value={$searchValue}
							on:input={resetSearchTerm}
						/>
					</div>

					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="filterRow" on:click={(event) => resetMedia(event)} on:keydown>
						<select bind:value={$category} on:change={resetSearchTerm} class="filterSelect">
							<option value="All">{$_('all_categories')}</option>
							<option value="Design">{$_('design_category')}</option>
							<option value="Configuration">{$_('configuration_category')}</option>
							<option value="Maintain & Operate">{$_('maintain_and_operate_category')}</option>
							<option value="Upgrade">{$_('upgrade_category')}</option>
							<option value="Troubleshooting">{$_('troubleshooting_category')}</option>
							<option value="All" disabled>-----</option>
							<option value="Restore">{$_('restore_media_prefs')}</option>
							<option value="Reset">{$_('reset_media_prefs')}</option>
						</select>
						<select bind:value={$type} class="filterSelect">
							<option value="All">Articles + Videos</option>
							<option value="Articles">Articles</option>
							<option value="Videos">Videos</option>
						</select>

						<!-- Button that changes the format from x scrolling to all on y axis -->
						<div class="mediaFormat">
							{#if format}
								<button
									on:click={changeFormat}
									title="Change the display of  media items to a grid view"
								>
									<svg
										width="44"
										height="44"
										viewBox="0 0 44 44"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect width="20" height="20" rx="3" fill="#999899" />
										<rect y="24" width="20" height="20" rx="3" fill="#999899" />
										<rect x="24" y="24" width="20" height="20" rx="3" fill="#999899" />
										<rect x="24" width="20" height="20" rx="3" fill="#999899" />
									</svg>
								</button>
							{:else if !format}
								<button
									on:click={changeFormat}
									title="Change the display of media items to a row view"
								>
									<svg
										width="68"
										height="20"
										viewBox="0 0 68 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect width="20" height="20" rx="3" fill="#999899" />
										<rect x="24" width="20" height="20" rx="3" fill="#999899" />
										<rect x="48" width="20" height="20" rx="3" fill="#999899" />
									</svg>
								</button>
							{/if}
						</div>
					</div>

					{#if warningCLI}
						<div class="warningCLI" transition:slide>
							<p>
								<strong> <span class="warningHeader">Warning:</span></strong><br />
								<br />{$_('cli_warning')}
								<a
									href="https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-12-2/200000-CLIs-for-12-2-58.html"
									target="_blank"
									rel="noopener noreferrer">{$_('cli_warning_anchor')}</a
								>
							</p>
							<button class="btn" on:click={() => (warningCLI = false)}
								>{$_('acknowledgment_btn')}</button
							>
						</div>
					{/if}
					<div class="content-cards-container" class:formatted={!format}>
						{#if $search.filtered.length > 0}
							{#each $search.filtered as media, i (i)}
								<div in:receive|local={{ key: i }} out:send|local={{ key: i }}>
									{#if media.type === 'Videos'}
										<MediaCardVideo {media} />
									{/if}
									{#if media.type === 'Articles'}
										<MediaCardArticle {media} />
									{/if}
								</div>
							{/each}
						{:else if $search.filtered.length === 0}
							<div class="no-results-msg" in:slide={{ duration: 520, delay: 0, easing: quadInOut }}>
								<p><strong>No results.</strong></p>
							</div>
						{:else}
							{#each filteredcategory as media, i (i)}
								<div in:receive|local={{ key: i }} out:send|local={{ key: i }}>
									{#if media.type === 'Videos'}
										<MediaCardVideo {media} />
									{/if}
									{#if media.type === 'Articles'}
										<MediaCardArticle {media} />
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</section>
			<section class="support">
				<a
					style="margin: 0 0.5em 0.5em;"
					class="cta"
					rel="noopener noreferrer"
					target="_self"
					href="/get-support"
				>
					{$_('get_support_text')}
				</a>
			</section>

			<div class="video-card">
				<div class="video-wrapper">
					<iframe
						loading="lazy"
						class="vid-card-iframe"
						src="https://www.youtube.com/embed/t2fmE-2HDGk"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						webkitallowfullscreen
						mozallowfullscreen
					/>
				</div>
				<div class="video-text-content">
					<h3 class="video-card-title">
						{$_('cisco_support_video_title')}
					</h3>
					<p style="padding: 0 1em;" id="video-card-description">
						{$_('cisco_support_video_description')}.
					</p>
					<a
						style="padding: 0.5em 1em;"
						href="https://www.cisco.com/c/en/us/solutions/small-business/services.html"
						>{$_('cisco_support_services')}</a
					>
					<a style="padding: 0.5em 1em;" href="http://www.cisco.com/go/cbcommunity"
						>{$_('cisco_support_community')}</a
					>
					<a href="http://www.cisco.com/go/cbphone" style="padding: 0.5em 1em;"
						>{$_('cisco_support_phone_locator')}</a
					>
					<a
						style="padding: 0.5em 1em;"
						href="https://www.cisco.com/c/en/us/products/warranties/warranty-doc-c99-740618.html"
						>{$_('cisco_support_warranty')}</a
					>
				</div>
			</div>
		</div>
	</details>
</div>

<style>
	.btn {
		float: right;
		margin: 0em 0 0.5em;
		padding: 0.5em 1.5em;
		border-radius: 10px;
		background-color: var(--btn-blue-1);
		color: #efefef;
		font-family: 'CiscoSansTTBold';
		cursor: pointer;
		transition: all 200ms ease-in;
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	}

	.btn:hover {
		transform: scale(1.02);
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
		transition: all 0.5s ease-in-out;
		background-color: #0060ad;
	}

	.no-results-msg {
		padding: 0.8em 2em;
		font-size: var(--font-size-base);
		text-align: center;
		background-color: var(--menu-background-gray);
		border-left: 5px solid var(--cisco-blue);
		color: var(--text-color-black2);
		border-radius: 5px;
	}

	strong {
		font-weight: 700;
	}
	.container {
		transition: width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
	}
	details.dropdown {
		border-radius: 16px;
		background-color: #fff;
		font-family: inherit;
		font-size: var(--font-size-base);
		color: #333;
		padding: 1em 1.5em;
		border: #d2d2d2 1px solid;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		box-shadow:
			rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
			rgba(0, 0, 0, 0.14) 0 6px 10px 0,
			rgba(0, 0, 0, 0.12) 0 1px 18px 0;
	}

	summary.dropdown-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: none;
		max-height: 60px;
	}

	.row-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		margin-left: clamp(0.5em, 0.75em, 3.24em);
		font-size: var(--font-size-md);
		font-family: 'CiscoSansThin';
	}

	.ionicon {
		height: 1.2rem;
		width: 1.2rem;
		fill: #333;
	}

	.up {
		transform: rotate(0deg);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.drop {
		transform: rotate(180deg);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.dropdown-content {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		border-top: none;
		width: 100%;
		margin-bottom: 1em;
	}

	.video-card {
		max-width: clamp(200px, 100%, 600px);
		background-color: white;
		display: inline-flex;
		flex-flow: column nowrap;
		position: relative;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid #d2d3d7;
		transition: all 0.5s ease-in-out;
		scroll-snap-align: start;
		align-self: center;
		margin-bottom: 2em;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}

	.video-wrapper {
		position: relative;
		padding-top: 56.25%;
		overflow: hidden;
	}
	.vid-card-iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* height: clamp(300px, 100%, 600px); */
	}

	.video-text-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.video-text-content a:link {
		text-decoration: none;
		color: var(--cisco-blue);
	}

	.video-text-content a:visited {
		color: #6f53bc;
	}

	.video-text-content a:hover {
		color: var(--cisco-blue-hover);
	}

	.video-card-title {
		padding: 1em;
		color: var(--cisco-dark-blue);
		margin: 0;
		font-weight: 700;
		font-size: var(--font-size-md);
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

	/* Hover section */
	.video-card:hover {
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
		transition: all 0.5s ease-in-out;
	}

	.intro p {
		font-size: var(--font-size-base);
		text-align: left;
	}

	section.support {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.cta {
		text-decoration: none;
		cursor: pointer;
		margin: 2em 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--btn-blue-1);
		color: white;
		padding: 1em 2em;
		border-radius: 32px;
		transition: all 0.2s ease-in-out;
		align-self: center;
		border: var(--btn-blue-1) 1px solid;
	}
	.cta:hover {
		background-color: #0060ad;
	}

	.filterRow select {
		justify-content: flex-start;
		align-items: center;
	}

	.mediaFormat button {
		background: rgba(255, 255, 255, 0);
	}

	.warningCLI {
		background-color: white;
		padding: 1em;
		margin: 1em 0;
		height: 250px;
		border-left: var(--theme-warning) 5px solid;
		background-color: var(--menu-background-gray);
	}
	.warningHeader {
		color: var(--theme-warning);
	}
	/* .heroContainer {
        background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
    } */
	.searchButton {
		display: block;
		transition: all 0.85s ease;
	}

	.searchContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1em 0;
	}
	.searchBar {
		width: 450px;
		height: 50px;
		outline: 1px solid var(--cisco-gray);
		color: var(--text-color-black3);
		background-color: var(--menu-background-gray);
		border-radius: 30px;
		padding: 0 1em;
		margin: 1em;
		transition: all 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6);
		z-index: 10;
	}

	.searchBar:focus {
		outline: 1px solid var(--theme-warning);
	}

	.filterRow select {
		justify-content: flex-start;
		align-items: center;
		background-color: #ffffff00;
	}

	.mediaFormat {
		margin-left: auto;
		align-self: center;
	}
	.mediaFormat button {
		padding: 1em;
		transition: all 0.85s ease;
	}
	.mediaFormat button:hover {
		cursor: pointer;
		background-color: var(--btn-gray-1);
		border-radius: 10px;
	}
	select:hover {
		background-color: #f2f2f2;
	}
	select {
		padding: 0.5em;
		font-size: 14px;
		transition: all 1s ease;
		transition: all 0.08s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		color: var(--font-gray);
	}

	::marker {
		color: var(--step-blue-shade);
		font-size: 5.5em;
	}
	.filterRow {
		display: flex;
		min-height: 75px;
		margin: 1em 0;
	}

	select:nth-of-type(1) {
		margin: 1em 0 1em 1em;
		color: #575757;
		border: #575757 1px solid;
		border-radius: 40px 0 0 40px;
	}
	select::before {
		content: 'Category';
		color: red;
	}
	select:nth-of-type(2) {
		margin: 1em 0 1em 0;
		color: #575757;
		border: #575757 1px solid;
		border-left: none;
		border-radius: 0 40px 40px 0;
		width: 170px;
	}

	.content-cards-container {
		clear: right;
		display: grid;
		grid-auto-flow: column;
		gap: 1em;
		padding-bottom: 2em;
		overflow-y: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		justify-content: start;
		scroll-behavior: smooth;
		scroll-snap-align: start;
		justify-items: center;
	}

	.formatted {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-auto-flow: row;
	}

	/* grid-template-rows: masonry; */

	@media only screen and (max-width: 768px) {
		select {
			font-size: 0.74em;
		}

		.filterRow {
			margin: 0;
			/* height: 100px; */
			/* margin: 0 1em; */
		}
	}

	.warningCLI > p > a {
		color: #007493;
	}
</style>
