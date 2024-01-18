<script>
	import quickOptions from '$lib/data/quick-resources.json';
	import { AppCurrentSeries } from './store';
	import { _ as format } from 'svelte-i18n';

	const quickResources = quickOptions
		.filter(({ series }) => series === $AppCurrentSeries)
		.map((obj) => {
			const interpolatedResources = obj.resources.map((res) => {
				if (res.id === 'AdminGuide') {
					let ag = `${$format('quick_resource_admin_guide')}`.split(' ').join('');
					return {
						id: ag,
						...res
					};
				}
				if (res.id === 'DataSheet') {
					let ds = `${$format('quick_resource_data_sheet')}`.split(' ').join('');
					return {
						id: ds,
						...res
					};
				}
				if (res.id === 'Firmware') {
					let firmware = `${$format('quick_resource_firmware')}`;
					return {
						id: firmware,
						...res
					};
				}
			});
			return {
				...obj,
				resources: interpolatedResources
			};
		});
</script>

<div class="flexContainer">
	<h2 class="headerCopy">Quick Resources:</h2>
	<div class="links">
		{#each quickResources as { series, url, description, resources }}
			{#each resources as resource}
				{#if resource.nested_resources}
					<div class="flexItem">
						<details title={description} class="QSG">
							<summary>{resource.id.split(/(?=[A-Z])/).join(' ')}</summary>
							<div id="AG">
								{#each resource.nested_resources as nested, j (j)}
									<a target="_blank" href={nested.href}>{nested.device}</a>
								{/each}
							</div>
						</details>
					</div>
				{:else}
					<a target="_blank" title={resource.description} href={resource.href}>
						<div class="flexItem">
							<div class="grid-container">
								<div class="copy">
									{resource.id.split(/(?=[A-Z])/).join(' ')}
								</div>
							</div>
						</div>
					</a>
				{/if}
			{/each}
		{/each}
	</div>
</div>

<style>
	.flexContainer {
		background: var(--cisco-dark-blue);
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-evenly;
		align-items: center;
		list-style: none;
		user-select: none;
		padding: 2em;
		margin: 1em 0;
	}

	.flexContainer details[open] {
		position: absolute !important;
		left: 0 !important;
		background-color: #00bceb;
		border-radius: 5px;
		width: 100%;
		z-index: 3;
	}

	.headerCopy {
		color: #fff;
		text-align: center;
		justify-self: center;
		font-size: var(--font-size-base);
		margin-bottom: 0;
		margin-block-start: 0;
	}

	.links {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
	}

	a[href] {
		color: #fff;
		font-weight: 400;
		text-decoration: none;
		line-height: inherit;
		margin: 0 0.5em;
		display: block;
	}

	a:hover {
		cursor: pointer;
	}

	.flexItem {
		width: clamp(100px, 225px, 350px);
		margin-top: 10px;
		font-weight: bold;
		text-align: center;
		margin: 0.2em 1em;
		min-height: 56px;
		position: relative;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-template-rows: repeat(2, 1fr);
		gap: 0px 0px;
		grid-template-areas:
			'copy copy copy copy'
			'copy copy copy copy';
		border-radius: 5px;
		transition: all 0.25s ease-in;
		border: 1px solid var(--cisco-blue);
		color: #fff;
		margin: 0 0.3em;
	}

	.copy {
		display: grid;
		place-content: center;
		grid-area: copy;
		color: #fff;
		padding: 1em 1.5em;
	}

	#AG {
		background-color: #1e4471;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-flow: column wrap;
		flex-flow: column wrap;
		-ms-flex-pack: distribute;
		justify-content: space-around;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		width: 100%;
	}

	#AG * {
		padding: 1.5em 0.5em;
		color: white;
		margin: 0.5em;
	}
	details.QSG {
		position: relative;
		color: white;
		position: absolute;
		display: list-item;
		left: 0;
		width: clamp(100px, 225px, 350px);
		padding: 1em 2em;
		border: #00bceb 1px solid;
	}

	details[open] {
		position: absolute !important;
		left: 0 !important;
		background-color: #00bceb;
		border-radius: 5px;
		width: 100%;
		z-index: 3;
	}

	.flexItem *:hover {
		-webkit-transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		-o-transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		background: none;
		background: var(--cisco-blue);
		border-radius: 5px;
		color: var(--cisco-midnight-blue);
	}

	.flexItem:active {
		border-radius: 20px;
		-webkit-text-decoration-color: var(--theme-success);
		text-decoration-color: var(--theme-success);
	}

	.grid-container > .copy:active {
		-webkit-text-decoration-color: var(--theme-success);
		text-decoration-color: var(--theme-success);
	}
</style>
