<script>
	import Mutation from '$lib/components/Mutation.svelte';
	import { onMount, afterUpdate } from 'svelte';

	/** @type { import('./$types').PageServerData}*/
	export let pageData;
	onMount(() => {
		console.log('pageData is: ', pageData);
	});
	afterUpdate(() => {
		console.log('pageData is: ', pageData);
	});
</script>

<div>
	<Mutation />
</div>

<style>
	div {
		margin-top: 150px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90%;
		margin: 150px auto 0;
	}
</style>
