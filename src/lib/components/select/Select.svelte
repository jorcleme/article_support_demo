<script>
	import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
	import _List from './List.svelte';
	import _Item from './Item.svelte';
	import _Selection from './Selection.svelte';
	import _ClearIcon from './ClearIcon.svelte';
	import debounce from '../../utils/debounce';
	import { _ as format } from 'svelte-i18n';

	const dispatch = createEventDispatcher();

	// Give the component an id if you wish
	export let id = null;
	export let container = undefined;
	export let input = undefined;
	export let isDisabled = false;
	export let isFocused = false;
	// value is the selected value from the UI
	export let value = null;
	// filterText is bound to the input below. This is what makes the component searchable upon input
	export let filterText = '';
	// items is the list of items in the dropdown UI
	export let items = null;
	export let itemFilter = (label, filterText) =>
		`${label}`.toLowerCase().includes(filterText.toLowerCase());
	// We can organize these into categories if we wish. If not, I can easily delete this feature
	// Anything with "group" in it's name is related to this feature
	export let groupBy = undefined;
	export let groupFilter = (groups) => groups;
	export let isGroupHeaderSelectable = false;
	export let labelIdentifier = 'label';
	export let getOptionLabel = (option) => {
		return option[labelIdentifier];
	};
	export let optionIdentifier = 'value';
	// The below property is what we'll use if we need to fetch devices async.
	// Supports custom function or default function getItems() below
	export let fetchItems = undefined;
	export let hasError = false;
	export let containerStyles = '';
	export let getSelectionLabel = (option) => {
		if (option) return option[labelIdentifier];
		else return null;
	};
	export let createGroupHeaderItem = (groupValue) => {
		console.log('createGroupHeader', groupValue);
		return {
			value: groupValue,
			label: groupValue
		};
	};
	export const getFilteredItems = () => {
		return filteredItems;
	};
	export let isSearchable = true;
	export let inputStyles = '';
	export let isClearable = true;
	export let isWaiting = false;
	export let listPlacement = 'auto';
	export let listOpen = false;
	export let fetchItemsInterval = 300;
	export let noOptionsMessage = 'No options';
	export let hideEmptyState = false;
	export let inputAttributes = {};
	export let listAutoWidth = true;
	export let Icon = undefined;
	export let iconProps = {};
	export let showChevron = true;
	export let showIndicator = true;
	export let containerClasses = '';
	export let indicatorSvg = undefined;
	export let listOffset = 5;
	export let ClearIcon = _ClearIcon;
	export let Item = _Item;
	export let List = _List;
	export let Selection = _Selection;

	const placeholder = $format("devices_text");

	function filterMethod(args) {
		if (args.fetchItems && args.filterText.length > 0) return;
		if (!args.items) return [];

		if (
			args.items &&
			args.items.length > 0 &&
			typeof args.items[0] !== 'object'
		) {
			args.items = convertStringItemsToObjects(args.items);
		}
		let filterResults = args.items.filter((item) => {
			let matchesFilter = itemFilter(getOptionLabel(item), args.filterText);

			if (matchesFilter && args.value && Array.isArray(args.value)) {
				matchesFilter = !args.value.some((x) => {
					return x[args.optionIdentifier] === item[args.optionIdentifier];
				});
			}

			return matchesFilter;
		});

		if (args.groupBy) {
			filterResults = filterGroupedItems(filterResults);
		}

		return filterResults;
	}

	$: filteredItems = filterMethod({
		fetchItems,
		filterText,
		items,
		value,
		optionIdentifier,
		groupBy
	});

	let prev_value;
	let prev_filterText;
	let prev_isFocused;
	let hoverItemIndex;

	const getItems = debounce(async () => {
		isWaiting = true;
		let res = await fetchItems(filterText).catch((err) => {
			console.warn('Select.svelte fetchItems::func error :>> ', err);
			dispatch('error', { type: 'fetchItems', details: err });
		});

		if (res && !res.cancelled) {
			if (res) {
				if (res && res.length > 0 && typeof res[0] !== 'object') {
					res = convertStringItemsToObjects(res);
				}
				filteredItems = [...res];
				dispatch('loaded', { items: filteredItems });
			} else {
				filteredItems = [];
			}

			isWaiting = false;
			isFocused = true;
			listOpen = true;
		}
	}, fetchItemsInterval);

	$: updateValueDisplay(items);

	function setValue() {
		if (typeof value === 'string') {
			value = {
				[optionIdentifier]: value,
				label: value
			};
		} else if (Array.isArray(value) && value.length > 0) {
			value = value.map((item) =>
				typeof item === 'string' ? { value: item, label: item } : item
			);
		}
	}

	let _inputAttributes;
	function assignInputAttributes() {
		_inputAttributes = Object.assign(
			{
				autocapitalize: 'none',
				autocomplete: 'off',
				autocorrect: 'off',
				spellcheck: false,
				tabindex: 0,
				type: 'text',
				'aria-autocomplete': 'list'
			},
			inputAttributes
		);

		if (id) {
			_inputAttributes.id = id;
		}

		if (!isSearchable) {
			_inputAttributes.readonly = true;
		}
	}

	function convertStringItemsToObjects(_items) {
		return _items.map((item, index) => {
			return {
				index,
				value: item,
				label: `${item}`
			};
		});
	}

	function filterGroupedItems(_items) {
		const groupValues = [];
		const groups = {};
		console.log('items:', _items);

		_items.forEach((item) => {
			const groupValue = groupBy(item);

			if (!groupValues.includes(groupValue)) {
				groupValues.push(groupValue);
				groups[groupValue] = [];

				if (groupValue) {
					groups[groupValue].push(
						Object.assign(createGroupHeaderItem(groupValue, item), {
							id: groupValue,
							isGroupHeader: true,
							isSelectable: isGroupHeaderSelectable
						})
					);
				}
			}

			groups[groupValue].push(
				Object.assign({ isGroupItem: !!groupValue }, item)
			);
		});

		const sortedGroupedItems = [];

		groupFilter(groupValues).forEach((groupValue) => {
			if (groups[groupValue]) sortedGroupedItems.push(...groups[groupValue]);
		});

		return sortedGroupedItems;
	}

	function dispatchSelectedItem() {
		if (
			!prev_value ||
			JSON.stringify(value[optionIdentifier]) !==
				JSON.stringify(prev_value[optionIdentifier])
		) {
			dispatch('select', value);
		}
	}

	function setupFocus() {
		if (isFocused || listOpen) {
			handleFocus();
		} else {
			if (input) input.blur();
		}
	}

	$: {
		if (value) setValue();
	}

	$: {
		if (inputAttributes || !isSearchable) assignInputAttributes();
	}

	$: {
		if (value) dispatchSelectedItem();
	}

	$: {
		if (!value && prev_value) {
			dispatch('select', value);
		}
	}

	$: {
		if (isFocused !== prev_isFocused) {
			setupFocus();
		}
	}

	$: {
		if (filterText !== prev_filterText) {
			setupFilterText();
		}
	}

	function setupFilterText() {
		if (filterText.length === 0) return;

		isFocused = true;
		listOpen = true;

		if (fetchItems) {
			getItems();
		} else {
			listOpen = true;
		}
	}

	$: showSelectedItem = value && filterText.length === 0;
	$: showClearIcon =
		showSelectedItem && isClearable && !isDisabled && !isWaiting;
	$: placeholderText = value ? '' : placeholder;

	beforeUpdate(async () => {
		prev_value = value;
		prev_filterText = filterText;
		prev_isFocused = isFocused;
	});

	function findItem(selection) {
		let matchTo = selection
			? selection[optionIdentifier]
			: value[optionIdentifier];
		return items.find((item) => item[optionIdentifier] === matchTo);
	}

	function updateValueDisplay(items) {
		if (
			!items ||
			items.length === 0 ||
			items.some((item) => typeof item !== 'object')
		)
			return;
		if (!value || !value[optionIdentifier]) return;
		console.log(items);
		if (Array.isArray(value)) {
			value = value.map((selection) => findItem(selection) || selection);
		} else {
			value = findItem() || value;
		}
	}

	function handleKeyDown(e) {
		if (!isFocused) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				listOpen = true;
				break;
			case 'ArrowUp':
				e.preventDefault();
				listOpen = true;
				break;
			case 'Tab':
				if (!listOpen) isFocused = false;
				break;
		}
	}

	function handleFocus() {
		isFocused = true;
		if (input) input.focus();
	}
	/**
	 *
	 * @param event {Event}
	 */
	function handleWindowEvent(event) {
		if (!container) return;
		const eventTarget = event.composedPath().shift() ?? event.target;
		if (
			container.contains(eventTarget) ||
			container.contains(event.relatedTarget)
		) {
			return;
		}
		isFocused = false;
		listOpen = false;
		if (input) input.blur();
	}

	function handleClick() {
		if (isDisabled) return;
		isFocused = true;
		listOpen = !listOpen;
	}

	export function handleClear() {
		value = undefined;
		listOpen = false;
		dispatch('clear', value);
		handleFocus();
	}

	onMount(() => {
		if (isFocused && input) input.focus();
	});

	$: listProps = {
		Item,
		filterText,
		optionIdentifier,
		noOptionsMessage,
		hideEmptyState,
		value,
		items: filteredItems,
		getOptionLabel,
		listPlacement,
		parent: container,
		listAutoWidth,
		listOffset
	};
	/**
	 * @typedef ICustomEvent
	 * @property detail {{ label: string, value: string }}
	 * @param {CustomEvent<ICustomEvent>} event
	 */
	function itemSelected(event) {
		const { detail } = event;

		if (detail) {
			filterText = '';
			const item = Object.assign({}, detail);

			if (!item.isGroupHeader || item.isSelectable) {
				value = item;

				setTimeout(() => {
					listOpen = false;
				});
			}
		}
	}

	function closeList() {
		filterText = '';
		listOpen = false;
	}

	export let ariaValues = (values) => {
		return `Option ${values}, selected.`;
	};

	export let ariaListOpen = (label, count) => {
		return `You are currently focused on option ${label}. There are ${count} results available.`;
	};

	export let ariaFocused = () => {
		return `Select is focused, type to refine list, press down to open the menu.`;
	};

	function handleAriaSelection() {
		let selected = undefined;
		selected = getSelectionLabel(value);

		return ariaValues(selected);
	}

	function handleAriaContent() {
		if (!isFocused || !filteredItems || filteredItems.length === 0) return '';

		let _item = filteredItems[hoverItemIndex];
		if (listOpen && _item) {
			let label = getSelectionLabel(_item);
			let count = filteredItems ? filteredItems.length : 0;

			return ariaListOpen(label, count);
		} else {
			return ariaFocused();
		}
	}

	$: ariaSelection = value ? handleAriaSelection() : '';
	$: ariaContext = handleAriaContent(
		filteredItems,
		hoverItemIndex,
		isFocused,
		listOpen
	);
</script>

<svelte:window
	on:click={handleWindowEvent}
	on:focusin={handleWindowEvent}
	on:keydown={handleKeyDown}
/>

<div
	class="selectContainer {containerClasses}"
	class:hasError
	class:disabled={isDisabled}
	class:focused={isFocused}
	style={containerStyles}
	on:click={handleClick}
	on:keydown={handleKeyDown}
	bind:this={container}
>
	<span
		aria-live="polite"
		aria-atomic="false"
		aria-relevant="additions text"
		class="a11yText"
	>
		{#if isFocused}
			<span id="aria-selection">{ariaSelection}</span>
			<span id="aria-context">
				{ariaContext}
			</span>
		{/if}
	</span>

	{#if Icon}
		<svelte:component this={Icon} {...iconProps} />
	{/if}

	<input
		readOnly={!isSearchable}
		{..._inputAttributes}
		bind:this={input}
		on:focus={handleFocus}
		bind:value={filterText}
		placeholder={placeholderText}
		style={inputStyles}
		disabled={isDisabled}
	/>

	{#if showSelectedItem}
		<div class="selectedItem" on:focus={handleFocus}>
			<svelte:component this={Selection} item={value} {getSelectionLabel} />
		</div>
	{/if}

	{#if showClearIcon}
		<div
			class="clearSelect"
			on:click|preventDefault={handleClear}
			aria-hidden="true"
		>
			<svelte:component this={ClearIcon} />
		</div>
	{/if}

	{#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}
		<div class="indicator" aria-hidden="true">
			{#if indicatorSvg}
				{@html indicatorSvg}
			{:else}
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 20 20"
					focusable="false"
					aria-hidden="true"
				>
					<path
						d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0
          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
					/>
				</svg>
			{/if}
		</div>
	{/if}

	{#if isWaiting}
		<div class="spinner">
			<svg class="spinner_icon" viewBox="25 25 50 50">
				<circle
					class="spinner_path"
					cx="50"
					cy="50"
					r="20"
					fill="none"
					stroke="currentColor"
					stroke-width="5"
					stroke-miterlimit="10"
				/>
			</svg>
		</div>
	{/if}

	{#if listOpen}
		<svelte:component
			this={List}
			{...listProps}
			bind:hoverItemIndex
			on:itemSelected={itemSelected}
			on:closeList={closeList}
		/>
	{/if}
</div>

<style>
	.selectContainer {
		--internalPadding: 0 16px;
		border: var(--border, 1px solid #d8dbdf);
		border-radius: var(--borderRadius, 3px);
		box-sizing: border-box;
		font-family: 'CiscoSansTT';
		font-size: var(--font-size-base);
		height: var(--height, 50px);
		position: relative;
		display: flex;
		align-items: center;
		padding: var(--padding, var(--internalPadding));
		background: var(--background-menu-gray);
		margin: var(--margin, 0);
		width: 100%;
		max-width: 600px;
	}

	.selectContainer input {
		border: none;
		color: var(--inputColor, #3f4f5f);
		height: var(--height, 50px);
		line-height: var(--height, 50px);
		padding: var(--inputPadding, var(--padding, var(--internalPadding)));
		width: 100%;
		font-size: var(--font-size-base);
		max-width: 600px;
		background: transparent;
		letter-spacing: var(--inputLetterSpacing, -0.08px);
		position: absolute;
		left: var(--inputLeft, 0);
		margin: var(--inputMargin, 0);
		cursor: pointer;
	}

	.selectContainer input::placeholder {
		color: var(--placeholderColor, #78848f);
		opacity: var(--placeholderOpacity, 1);
	}

	.selectContainer input:focus {
		outline: none;
	}

	.selectContainer:hover {
		border-color: var(--borderHoverColor, #b2b8bf);
	}

	.selectContainer.focused {
		border-color: #adb5bd;
	}

	.selectContainer.disabled {
		background: var(--disabledBackground, #ebedef);
		border-color: var(--disabledBorderColor, #ebedef);
		color: var(--disabledColor, #c1c6cc);
	}

	.selectContainer.disabled input::placeholder {
		color: var(--disabledPlaceholderColor, #c1c6cc);
		opacity: var(--disabledPlaceholderOpacity, 1);
	}

	.selectedItem {
		line-height: var(--height, 50px);
		height: var(--height, 50px);
		overflow-x: hidden;
		padding: var(--selectedItemPadding, 0 20px 0 0);
	}

	.selectedItem:focus {
		outline: none;
	}

	.clearSelect {
		position: absolute;
		right: var(--clearSelectRight, 10px);
		top: var(--clearSelectTop, 11px);
		bottom: var(--clearSelectBottom, 11px);
		width: var(--clearSelectWidth, 20px);
		color: var(--clearSelectColor, #c5cacf);
		flex: none !important;
	}

	.clearSelect:hover {
		color: var(--clearSelectHoverColor, #2c3e50);
	}

	.selectContainer.focused .clearSelect {
		color: var(--clearSelectFocusColor, #3f4f5f);
	}

	.indicator {
		position: absolute;
		right: var(--indicatorRight, 10px);
		top: var(--indicatorTop, 11px);
		width: var(--indicatorWidth, 20px);
		height: var(--indicatorHeight, 20px);
		color: var(--indicatorColor, #c5cacf);
	}

	.indicator svg {
		display: inline-block;
		fill: var(--indicatorFill, currentcolor);
		line-height: 1;
		stroke: var(--indicatorStroke, currentcolor);
		stroke-width: 0;
	}

	.spinner {
		position: absolute;
		right: var(--spinnerRight, 10px);
		top: var(--spinnerLeft, 11px);
		width: var(--spinnerWidth, 20px);
		height: var(--spinnerHeight, 20px);
		color: var(--spinnerColor, #51ce6c);
		animation: rotate 0.75s linear infinite;
	}

	.spinner_icon {
		display: block;
		height: 100%;
		transform-origin: center center;
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}

	.spinner_path {
		stroke-dasharray: 90;
		stroke-linecap: round;
	}

	.hasError {
		border: var(--errorBorder, 1px solid #ff2d55);
		background: var(--errorBackground, #fff);
	}

	.a11yText {
		z-index: 9999;
		border: 0px;
		clip: rect(1px, 1px, 1px, 1px);
		height: 1px;
		width: 1px;
		position: absolute;
		overflow: hidden;
		padding: 0px;
		white-space: nowrap;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
