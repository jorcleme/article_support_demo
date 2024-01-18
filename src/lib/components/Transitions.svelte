<script>
	import { fly } from 'svelte/transition';

	export let key;
	export let duration = 300;
</script>

{#key key}
	<div in:fly={{ x: 50, duration, delay: duration }} out:fly={{ x: -50, duration }}>
		<slot />
	</div>
{/key}

<style>
	div {
		position: absolute;
		inset: 0;
	}
</style>
