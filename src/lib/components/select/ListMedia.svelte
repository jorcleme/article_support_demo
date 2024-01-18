<script>
	import { beforeUpdate, createEventDispatcher, onMount, tick } from 'svelte';
	import isOutOfViewport from '../../utils/viewport';
	import ItemComponent from './Item.svelte';

	const dispatch = createEventDispatcher();

	export let container = undefined;
	export let Item = ItemComponent;
	export let items = [];
	export let labelIdentifier = 'label';
	export let getOptionLabel = (option) => {
		if (option) return option[labelIdentifier];
	};
	export let hoverItemIndex = 0;
	export let value = undefined;
	export let optionIdentifier = 'value';
	export let hideEmptyState = false;
	export let noOptionsMessage = 'No options';
	export let activeItemIndex = 0;
	export let filterText = '';
	/**
	 * @type {HTMLElement} parent
	 */
	export let parent = null;
	export let listPlacement = null;
	export let listAutoWidth = null;
	export let listOffset = 5;

	let isScrollingTimer = 0;
	let isScrolling = false;
	let prev_items;

	onMount(() => {
		if (items.length > 0 && value) {
			const _hoverItemIndex = items.findIndex(
				(item) => item[optionIdentifier] === value[optionIdentifier]
			);

			if (_hoverItemIndex) {
				hoverItemIndex = _hoverItemIndex;
			}
		}

		scrollToActiveItem('active');

		container.addEventListener(
			'scroll',
			() => {
				clearTimeout(isScrollingTimer);

				isScrollingTimer = setTimeout(() => {
					isScrolling = false;
				}, 100);
			},
			false
		);
	});

	beforeUpdate(() => {
		if (!items) items = [];
		if (items !== prev_items && items.length > 0) {
			hoverItemIndex = 0;
		}

		prev_items = items;
	});

	function handleSelect(item) {

		dispatch('itemSelected', item);
	}

	function handleHover(i) {
		if (isScrolling) return;
		hoverItemIndex = i;
	}

	function handleClick(args) {
		const { item, i, event } = args;
		event.stopPropagation();

		if (value && value[optionIdentifier] === item[optionIdentifier]) return closeList();

		// use the existing filter to filter the media object

		if (isItemSelectable(item)) {

			activeItemIndex = i;
			hoverItemIndex = i;
			handleSelect(item);
		}
	}

	function closeList() {
		dispatch('closeList');
	}

	async function updateHoverItem(increment) {
		let isNonSelectableItem = true;

		while (isNonSelectableItem) {
			if (increment > 0 && hoverItemIndex === items.length - 1) {
				hoverItemIndex = 0;
			} else if (increment < 0 && hoverItemIndex === 0) {
				hoverItemIndex = items.length - 1;
			} else {
				hoverItemIndex = hoverItemIndex + increment;
			}

			isNonSelectableItem = !isItemSelectable(items[hoverItemIndex]);
		}

		await tick();

		scrollToActiveItem('hover');
	}

	function handleKeyDown(e) {
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				closeList();
				break;
			case 'ArrowDown':
				e.preventDefault();
				items.length && updateHoverItem(1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				items.length && updateHoverItem(-1);
				break;
			case 'Enter':
				e.preventDefault();
				if (items.length === 0) break;
				const hoverItem = items[hoverItemIndex];
				if (value && value[optionIdentifier] === hoverItem[optionIdentifier]) {
					closeList();
					break;
				}

				activeItemIndex = hoverItemIndex;
				handleSelect(items[hoverItemIndex]);

				break;
			case 'Tab':
				e.preventDefault();
				if (items.length === 0) {
					return closeList();
				}
				if (value && value[optionIdentifier] === items[hoverItemIndex][optionIdentifier])
					return closeList();
				activeItemIndex = hoverItemIndex;
				handleSelect(items[hoverItemIndex]);
				break;
		}
	}

	function scrollToActiveItem(className) {
		if (!container) return;

		let offsetBounding;
		const focusedElemBounding = container.querySelector(`.listItem .${className}`);

		if (focusedElemBounding) {
			offsetBounding =
				container.getBoundingClientRect().bottom -
				focusedElemBounding.getBoundingClientRect().bottom;
		}

		container.scrollTop -= offsetBounding;
	}

	function isItemActive(item, value, optionIdentifier) {
		return value && value[optionIdentifier] === item[optionIdentifier];
	}

	function isItemFirst(itemIndex) {
		return itemIndex === 0;
	}

	function isItemHover(hoverItemIndex, item, itemIndex, items) {
		return isItemSelectable(item) && (hoverItemIndex === itemIndex || items.length === 1);
	}

	function isItemSelectable(item) {
		return (
			(item.isGroupHeader && item.isSelectable) ||
			item.selectable ||
			!item.hasOwnProperty('selectable')
		);
	}

	let listStyle;
	function computePlacement() {
		const { height, width } = parent.getBoundingClientRect();
		console.log(height, width);

		listStyle = '';
		listStyle += `min-width:${width}px;width:${listAutoWidth ? 'auto' : '100%'};`;

		if (
			listPlacement === 'top' ||
			(listPlacement === 'auto' && isOutOfViewport(parent, container).bottom)
		) {
			listStyle += `bottom:${height + listOffset}px;`;
		} else {
			listStyle += `top:${height + listOffset}px;`;
		}
	}

	$: {
		if (parent && container) computePlacement();
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:resize={computePlacement} />

<div class="listContainer" bind:this={container} style={listStyle}>
	{#each items as item, i}
	
			<div
				on:mouseover={() => handleHover(i)}
				on:focus={() => handleHover(i)}
				on:click={(event) => handleClick({ item, i, event })}
				on:keydown={handleKeyDown}
				class="listItem"
				tabindex="-1"
			>
				<svelte:component
					this={Item}
					{item}
					{filterText}
					{getOptionLabel}
					isFirst={isItemFirst(i)}
					isActive={isItemActive(item, value, optionIdentifier)}
					isHover={isItemHover(hoverItemIndex, item, i, items)}
					isSelectable={isItemSelectable(item)}
				/>
			</div>

	{:else}
		{#if !hideEmptyState}
			<div class="empty">{noOptionsMessage}</div>
		{/if}
	{/each}
</div>

<style>
	.listContainer {
		box-shadow: var(--listShadow, 0 2px 3px 0 rgba(44, 62, 80, 0.24));
		border-radius: var(--listBorderRadius, 4px);
		max-height: var(--listMaxHeight, 250px);
		overflow-y: auto;
		background: var(--listBackground, #fff);
		border: var(--listBorder, none);
		position: var(--listPosition, absolute);
		z-index: var(--listZIndex, 2);
		width: 100%;
		left: var(--listLeft, 0);
		right: var(--listRight, 0);
	}

	.empty {
		text-align: var(--listEmptyTextAlign, center);
		padding: var(--listEmptyPadding, 20px 0);
		color: var(--listEmptyColor, #78848f);
	}

	.listAnchor:link {
		text-decoration: none;
		color: #333;
	}

	.listAnchor:hover {
		cursor: pointer;
	}

	.listAnchor:active {
		background-color: var(--cisco-midnight-blue);
	}
</style>
