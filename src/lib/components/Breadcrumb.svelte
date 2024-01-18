<script context="module">
    import svgByKeys from './Breadcrumbs.js';
    export const iconRef = Object.keys(svgByKeys);
</script>

<script>
    import { BreadcrumbStore } from './store.js';
    import Check from './Check.svelte';
    import BreadcrumbLink from './BreadcrumbLink.svelte';
    import { fade } from 'svelte/transition';
    import { quintIn } from 'svelte/easing';

    export let name;

    $: icons = svgByKeys[name] || [];
    $: stepOneComplete = BreadcrumbStore.getKey('step1complete', $BreadcrumbStore);
    $: stepTwoComplete = BreadcrumbStore.getKey('step2complete', $BreadcrumbStore);
    $: stepThreeComplete = BreadcrumbStore.getKey('step3complete', $BreadcrumbStore);
</script>

{#each icons as icon, i (i)}
    <div
        class="breadcrumbs breadcrumb-{i + 1}"
        in:fade={{ delay: 100, duration: 800, easing: quintIn }}
    >
        {#if name === 'gettoknow'}
            {#if !stepOneComplete}
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {@html icon}
                </svg>
            {:else if !!stepOneComplete}
                <Check />
            {/if}
        {/if}
        {#if name === 'getconfigured'}
            {#if !stepTwoComplete}
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {@html icon}
                </svg>
            {:else if !!stepTwoComplete}
                <Check />
            {/if}
        {/if}
        {#if name === 'getoptimized'}
            {#if !stepThreeComplete}
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {@html icon}
                </svg>
            {:else if !!stepThreeComplete}
                <Check />
            {/if}
        {/if}
    </div>
    <slot />
{/each}

<style>
    .breadcrumbs {
        display: grid;
        place-items: center;
    }

    svg {
        display: inherit;
        width: var(--icon-width);
        height: var(--icon-height, auto);
    }
</style>
