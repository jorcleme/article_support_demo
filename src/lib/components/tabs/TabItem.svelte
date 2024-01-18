<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import { TABS } from './Tabs.svelte';
    export let id;
    export let href = undefined;

    const dispatch = createEventDispatcher();
    const tab = { id: ++id };
    const { registerTab, selectTab, selectedTab } = getContext(TABS);
    registerTab(tab);
    $: active = false;

    function handleSelectedTab() {
        dispatch('activateTab', { active: !active });
    }
</script>

<li class="md-row" role="presentation" id={href ? href : null}>
    <button
        class:selected={$selectedTab === tab}
        class:inactive={$selectedTab !== tab}
        on:click={() => selectTab(tab)}
        on:click|once={() => handleSelectedTab()}
        id="{tab.id}-tabhead"
        type="button"
        role="tab"
    >
        <slot />
    </button>
</li>

<style>
    li {
        padding: 1em 1em 0 1em;
    }
    .selected {
        border-bottom: 3px solid var(--cisco-blue);
    }
    .inactive {
        color: var(--border-gray);
    }
    button {
        border: none;
        cursor: pointer;
        font-size: var(--font-size-base);
        background: #fff;
        color: var(--font-gray);
        padding: 0.3em;
    }

    button:focus {
        border-radius: 5px;
    }
</style>
