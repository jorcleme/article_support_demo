<script>
    import GetToKnow from '$lib/components/GetToKnow.svelte';
    import GetConfigured from '$lib/components/GetConfigured.svelte';
    import GetOptimized from '$lib/components/GetOptimized.svelte';
    import { onMount } from 'svelte';
    import { AppCurrentSeries, UserPreferences, jumpToAllNavigation } from '$lib/components/store';
    import { page } from '$app/stores';

    /** @type {import('./$types').PageServerData} */
    export let data;

    let title;

    onMount(() => {
        title = $AppCurrentSeries;
        UserPreferences.add('device', $page.params.model);
        UserPreferences.persist($UserPreferences);
    });

    $: getToKnowOpen = $jumpToAllNavigation === 0;
    $: getConfiguredOpen = $jumpToAllNavigation === 1;
    $: getOptimizedOpen = $jumpToAllNavigation === 2;
</script>

<svelte:head>
    <title>Cisco Hardware Installation Guide Catalyst 1200 Series Switches | All-Steps</title>
    <meta
        name="description"
        content="Cisco Hardware Installation Guide Catalyst 1200 Series Switches | All-Steps" />
</svelte:head>

<div class="all-steps">
    <div
        class="estimated-completion"
        id="estimated-completion"
        style="display:flex; align-items: center;"
    >
        <svg xmlns="http://www.w3.org/2000/svg" style="width:50px;" viewBox="0 0 80 80"
            ><path
                d="M58,39.25H46.70581a6.74732,6.74732,0,0,0-13.41162,0H22a12.75,12.75,0,0,0,0,25.5H57.29419a6.75,6.75,0,1,0,0-1.5H22a11.25,11.25,0,0,1,0-22.5H33.29419a6.74732,6.74732,0,0,0,13.41162,0H58a12.75,12.75,0,0,0,0-25.5H22.70581a6.687,6.687,0,0,0-.66064-2.23462L25.06055,10,24,8.93945l-2.78308,2.78308A6.74807,6.74807,0,1,0,22.70581,16.75H58a11.25,11.25,0,0,1,0,22.5Zm6,19.5A5.25,5.25,0,1,1,58.75,64,5.25605,5.25605,0,0,1,64,58.75ZM40,45.25A5.25,5.25,0,1,1,45.25,40,5.25605,5.25605,0,0,1,40,45.25Zm-24-24a5.25009,5.25009,0,1,1,4.13525-8.44586L16,16.93945l-2-2L12.93945,16l2.53028,2.53027a.74971.74971,0,0,0,1.06054,0l4.36939-4.36944A5.19508,5.19508,0,0,1,21.25,16,5.25605,5.25605,0,0,1,16,21.25Z"
            /></svg
        >
        <p>Estimated Completion: <span>14 Min.</span></p>
    </div>
    <div class="step-container">
        <GetToKnow bind:open={getToKnowOpen} />
        <GetConfigured bind:open={getConfiguredOpen} />
        <GetOptimized
            media={[...data.media.videos, ...data.media.articles]}
            bind:open={getOptimizedOpen}
        />
    </div>
</div>

<style>
    .all-steps {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .estimated-completion {
        padding: 0 0 0 2.5em;
    }

    .estimated-completion > p {
        font-size: var(--font-size-base);
    }
    .step-container {
        z-index: 4;
    }

    .estimated-completion p {
        padding: 0 1.5em;
        font-family: 'CiscoSansThin';
    }

    @media only screen and (min-width: 1024px) {
        .step-container {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            grid-template-rows: 1fr;
        }
    }
    /* Mobile View (Large) */
    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .all-steps {
            padding: 1em;
        }

        .estimated-completion {
            max-width: 400px;
            padding: 0 0 0 2.5em;
        }
    }
</style>
