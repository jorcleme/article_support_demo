<script>
    import Hamburger from '$lib/components/Hamburger.svelte';
    import IconSwitch from '$lib/components/IconSwitch.svelte';
    import PageTransition from '$lib/components/Transitions.svelte';
    import { navigating, updated } from '$app/stores';
    import { beforeNavigate } from '$app/navigation';
    import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
    import { _ as format } from 'svelte-i18n';
    import { AppCurrentSeries } from '$lib/components/store.js';
    import { onMount } from 'svelte';

    /**
     * @type {import('./$types').LayoutData}
     */
    export let data;
    console.log(data.url);

    let app_series_name;

    onMount(() => {

        if ($AppCurrentSeries === 'Cisco Catalyst 1300 Series Switches') {
            app_series_name = 'Catalyst 1300';
        } else if ($AppCurrentSeries === 'Cisco Catalyst 1200 Series Switches') {
            app_series_name = 'Catalyst 1200';
        }

        window['adrum-start-time'] = new Date().getTime();

        (function (config) {
            config.appKey = 'AD-AAB-ACB-JKC';

            config.adrumExtUrlHttp = 'http://cdn.appdynamics.com';

            config.adrumExtUrlHttps = 'https://cdn.appdynamics.com';

            config.beaconUrlHttp = 'http://pdx-col.eum-appdynamics.com';

            config.beaconUrlHttps = 'https://pdx-col.eum-appdynamics.com';

            config.resTiming = { bufSize: 200, clearResTimingOnBeaconSend: true };

            config.maxUrlLength = 512;
        })(window['adrum-config'] || (window['adrum-config'] = {}));

        const script = document.createElement('script');
        script.textContent = data.appDynamics;
        document.head.appendChild(script);
})


</script>

<svelte:head>
    <title>Cisco | Hardware Installation Guide</title>
    <meta
        name="description"
        content="Cisco Catalyst 1200 Hardware Installation Guide. Onboard and integrate the Catalyst 1200 into your home and business network through our comprehensive articles and videos. Get the most out of your network."
    />
</svelte:head>

{#if $navigating}
    <PreloadingIndicator />
{/if}

<main>
    <Hamburger --layer-width="50px" --layer-height="6px" --border-radius="2px" />
    <div class="flex-column">
        <div class="switch">
            <IconSwitch />
        </div>
        <div class="headers">
            <h1>
                {$format('headers_h1', {
                    values: { app_series_name: app_series_name }
                })}
            </h1>
            <h2 style="margin-top: 0;font-weight:100;">{$format('headers_h2')}</h2>
        </div>
    </div>
    <PageTransition key={data.url} duration={200}>
        <slot />
    </PageTransition>
</main>

<style>
    .headers {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: var(--font-size-xl);
    }
    .headers h1 {
        font-weight: 100;
        margin: 0.4em 0;
        font-family: 'CiscoSansThin';
        margin-top: 0;
    }

    .headers h1,
    .headers h2 {
        color: var(--cisco-midnight-blue);
        letter-spacing: 0.0625em;
    }
    .headers h2 {
        font-family: 'CiscoSansThin';
        font-size: var(--font-size-md);
        font-weight: 100;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(255, 122, 89, 0);
        position: absolute;
        top: 0;
        z-index: 1;
        width: 100%;
    }
    main {
        width: 100%;
        min-height: 100%;
    }
</style>
