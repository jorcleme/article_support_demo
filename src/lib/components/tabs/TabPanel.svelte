<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	const panel = {};
	const { registerPanel, selectedPanel } = getContext(TABS);
	registerPanel(panel);
</script>

{#if $selectedPanel === panel}
	<div class="tab-content bg-gray" role="tabpanel" aria-labelledby="tab">
		<slot />
	</div>
{/if}

<style>
	.tab-content {
		padding: 0;
	}
</style>
