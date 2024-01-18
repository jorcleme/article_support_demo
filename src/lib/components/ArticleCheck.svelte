<script>
	import { fade, draw, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let open = false;
</script>

{#if open}
	<div
		class="article_check"
		in:slide={{ delay: 1500, duration: 1200, easing: quintOut, axis: 'x' }}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
			<g>
				<circle
					cx="17.5"
					cy="17.5"
					r="17.5"
					fill="#6ABF4B"
					in:fade={{ delay: 1000, duration: 1000, easing: quintOut, delay: 500 }}
				/>
				<path
					d="M11 17.5L16.7929 23.2929C17.1834 23.6834 17.8166 23.6834 18.2071 23.2929L27.5 14"
					stroke="white"
					stroke-width="4"
					stroke-linecap="round"
					in:draw={{ delay: 1000, duration: 1000, easing: quintOut, delay: 500 }}
				/>
			</g>
		</svg>
	</div>
{/if}

<style>
	.article_check {
		display: grid;
		place-items: center;
		position: absolute;
		top: 18%;
	}
	svg {
		width: 100%;
		height: auto;
	}
</style>
