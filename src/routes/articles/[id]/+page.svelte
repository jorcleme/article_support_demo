<script>
	import GetSupportWidgetContainer from '$lib/components/full-article-view/GetSupportWidgetContainer.svelte';
	import FullArticle from '$lib/components/full-article-view/FullArticle.svelte';
	import { afterUpdate } from 'svelte';

	/** @type {import('./$types').PageServerData}*/
	export let data;
	/** @type {import('./$types').ActionData}*/
	export let form;

	afterUpdate(() => {
		console.log('form', form);
	});
	// onMount(() => {
	// 	console.log(data);
	// });
</script>

<div class="container">
	<FullArticle article={data.article}>
		<GetSupportWidgetContainer></GetSupportWidgetContainer>
	</FullArticle>
</div>

<style>
	.container {
		width: 85% !important;
		margin: 170px auto 0;
	}

	@media only screen and (max-width: 768px) {
		.container {
			width: 95% !important;
			margin-top: 170px !important;
		}
	}
</style>
