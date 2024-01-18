<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import screenfull from 'screenfull';

	/**
	 * @type {HTMLElement} component
	 */
	let component;
	const dispatch = createEventDispatcher();

	onMount(() => {
		if (screenfull.isEnabled) {
			screenfull.on('change', () => dispatch('change'));
			screenfull.on('error', () => dispatch('error'));
		}
	});

	const toggle = () => {
		if (screenfull.isEnabled && component?.nextElementSibling) {
			console.log(component.nextElementSibling);
			screenfull.toggle(component.nextElementSibling);
		}
	};

	const request = () => {
		if (screenfull.isEnabled && component?.nextElementSibling) {
			screenfull.request(component.nextElementSibling);
		}
	};

	const exit = () => {
		if (screenfull.isEnabled && component?.nextElementSibling) {
			screenfull.exit();
		}
	};

	onDestroy(() => {
		if (screenfull.isEnabled) {
			screenfull.off('change', () => true);
			screenfull.off('error', () => true);
		}
	});
</script>

<div style="width: 0; height: 0" bind:this={component} />
<slot name="fullscreen" {toggle} {request} {exit} />

<style>
	:host {
		display: block;
		z-index: auto;
	}

	:fullscreen {
		height: 100%;
		width: 100%;
		overflow-x: scroll;
	}
</style>
