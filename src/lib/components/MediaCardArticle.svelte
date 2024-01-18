<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { quintIn, quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Article from '$lib/components/Article.svelte';
	import ArticleCheck from './ArticleCheck.svelte';
	import stepArticles from '$lib/data/step_with_mobile_text.json';
	import { createEventDispatcher, setContext } from 'svelte';
	// Props
	export let media;
	// Is the article open in a Lightbox window? Manages state for each article.
	let isLightboxed = false;
	$: articleHasBeenViewed = media.opened || false;

	onMount(() => {
		articleHasBeenViewed = media.opened || false;
	});

	const dispatch = createEventDispatcher();

	let selectedArticle;

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

	async function makeRequest(article) {
		const res = await fetch(`/api/article/${article.document_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ article })
		});
		const data = await res.json();
		return data;
	}

	async function toggleLightboxState() {
		isLightboxed = !isLightboxed;

		if (isLightboxed) {
			selectedArticle = stepArticles.find((m) => m.title === media.title);
			media.opened = true;
			articleHasBeenViewed = true;
			const updatedArticle = await makeRequest(media);
			document.body.style.overflowY = 'hidden';
		} else {
			document.body.style.overflowY = 'scroll';
		}
	}
</script>

{#key isLightboxed}
	<div
		class="wrapper"
		style:z-index={isLightboxed ? 999 : 0}
		in:receive|local={{
			key: media.title,
			delay: 0,
			duration: 800,
			easing: quintIn
		}}
		out:send|local={{
			key: media.title,
			delay: 0,
			duration: 1000,
			easing: quintOut
		}}
	>
		{#if !isLightboxed}
			<div
				title={media.description}
				class="content-card-anchor"
				on:click={toggleLightboxState}
				on:keydown
				role="presentation"
			>
				<div class="content-card">
					<ArticleCheck bind:open={articleHasBeenViewed} />
					<div class="content-card-header-logo">
						<img
							src="https://www.cisco.com/web/fw/tools/cisco-business/Chatbot/images/switch-icon-blue.svg"
							alt="Cisco Logo"
							class:hidden={articleHasBeenViewed}
						/>
					</div>
					<div class="content-card-header-text">
						<p style="font-size: var(--font-size-base); flex: 1;">
							{media.title}
						</p>
						<div
							style="font-size: var(--font-size-sm); display: flex; align-items: center;"
							class="mediaCategory"
						>
							<span>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_1697_852)">
										<path
											d="M12.0075 3.03201L19.0858 10.1105C19.7691 10.7939 19.7691 11.902 19.0857 12.5854L12.5849 19.0862C11.9015 19.7696 10.7934 19.7696 10.11 19.0862L3.03177 12.0077C2.74542 11.7214 2.56725 11.3446 2.52762 10.9416L1.81865 3.73171C1.71068 2.63365 2.63345 1.71088 3.73151 1.81886L10.9413 2.52782C11.3444 2.56745 11.7212 2.74564 12.0075 3.03201Z"
											stroke="black"
											stroke-width="0.5"
										/>
										<circle
											cx="5.12109"
											cy="5.12132"
											r="1.5"
											transform="rotate(45 5.12109 5.12132)"
											fill="#D9D9D9"
										/>
									</g>
									<defs>
										<clipPath id="clip0_1697_852">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</span>
							<span style="font-size: 12px; padding-left:1em;">{media.category}</span>
						</div>
					</div>
				</div>
			</div>
		{:else if isLightboxed && selectedArticle}
			<Article article={selectedArticle} open={isLightboxed} on:toggle={toggleLightboxState} />
		{/if}
	</div>
{/key}

<style>
	p {
		font-size: var(--font-size-base);
		margin-top: 0;
		flex: 1;
	}

	.hidden {
		visibility: hidden;
	}

	@media (max-width: 576px) {
		#content-card-compact {
			grid-template-columns: 0.5fr 2fr;
			width: calc(100vw - 20px);
			max-height: 180px;
			min-height: 150px;
			border-radius: 0;
		}

		#content-card-header-logo-compact {
			width: 100px;
			height: 100%;

			margin: 0;
			/* margin:0 1em 0 0; */
		}
		div#content-card-header-text-compact {
			width: 100%;
			min-height: 100px;
			display: flex;
			justify-content: center;
			flex-direction: column;
			/* margin:0 0 0 1em; */
			padding: 0.5em;
		}
	}
	div#content-card-header-text-compact {
		width: 100%;
		min-height: 110px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		/* margin:0 0 0 1em; */
		padding: 0.5em;
	}

	/* Dropping in card css content, semi-unsorted */

	.content-card-header-logo img {
		width: 40px;
	}
	.mediaCategory {
		color: var(--font-gray);
		font-size: 0.95em;
	}
	div.content-card-header-text {
		width: 200px;
		min-height: 150px;
		/* max-height: 150px; */
		height: 150px;
		display: flex;
		justify-content: center;
		flex-flow: column nowrap;
		align-items: flex-start;
	}

	.content-card {
		display: grid;
		place-items: center;
		width: 230px;
		min-height: 225px;
		max-height: 300px;
		height: 300px;
		border-radius: 16px;
		background-color: var(--white);
		border: 1px solid var(--border-gray);
		transition: all 0.5s ease-in-out;
		scroll-snap-align: start;
		cursor: pointer;
		position: relative;
	}
	.content-card:hover {
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
		transition: all 0.5s ease-in-out;
	}
	.views-icon {
		width: 12px;
		height: 12px;
	}

	.content-card-anchor {
		text-decoration: none;
		color: var(--cisco-dark-blue) !important;
		display: grid !important;
		align-items: stretch;
	}

	.content-card-header-logo {
		display: grid;
		place-items: center;
		width: 200px;
		height: 100px;
		margin-top: 0.75em;
		aspect-ratio: 6 / 2;
		background-color: #00bceb29;
		transition: all 0.5s ease-in-out;
	}
</style>
