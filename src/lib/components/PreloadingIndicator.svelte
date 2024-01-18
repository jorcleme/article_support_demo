<script>
	import { onMount } from 'svelte';

	let counter = 0;
	let visible = false;

	onMount(() => {
		visible = true;
		function next() {
			counter += 0.1;
			const tick = 1 - counter;
			if (tick > 0.15) setTimeout(next, 500 / tick);
		}
		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div class="progress-container">
		<div class="progress" style="width: {counter * 100}%" />
	</div>
{/if}

{#if counter >= 0.4}
	<div class="fade" />
{/if}

<style>
	.progress-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		z-index: 999;
	}

	.progress {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background-color: var(--cisco-blue);
		transition: width 0.4s;
	}

	.fade {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		pointer-events: none;
		z-index: 998;
		animation: fade 0.4s;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
