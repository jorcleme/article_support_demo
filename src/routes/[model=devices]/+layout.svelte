<script>
    import DeviceFeatureHotSpot from '$lib/components/hot-spotter/DeviceFeatureHotSpot.svelte';
    import FeatureWidget from '$lib/components/widget/FeatureWidget.svelte';
    import Fullscreen from '$lib/components/Fullscreen.svelte';
    import sprite from '$lib/assets/sprites.svg?url';
    import { page } from '$app/stores';
    import { _ as format } from 'svelte-i18n';

    /** @type {import('./$types').LayoutServerData} */
    export let data;

    $: model = $page.params.model;
</script>

<Fullscreen let:toggle>
    <div slot="fullscreen">
        <div class="layout-container">
            <section class="feature-widget">
                <FeatureWidget
                    {model}
                    datasheet={data.datasheet}
                    similarSeries={data.similarSeries}
                    devices={data.devices}
                />
            </section>
            <div class="device-demo">
                <DeviceFeatureHotSpot />
            </div>
            <section class="fullscreen-section">
                <div class="align-end">
                    <button class="btn" on:click={() => toggle()}>
                        <svg class="sprite">
                            <use xlink:href={`${sprite}#icon-target`} />
                        </svg>
                        <span>{$format('fullscreen')}</span>
                    </button>
                </div>
            </section>
        </div>
        <slot />
    </div>
</Fullscreen>

<style>
    .sprite {
        width: 2em;
        height: 2em;
        stroke: var(--border-gray);
        margin-inline-end: 1em;
    }
    .feature-widget {
        height: 470px;
    }
    :fullscreen {
        background: rgba(255, 122, 89, 0);
        overflow-x: scroll;
        width: 100%;
    }

    ::backdrop {
        background-color: rgba(255, 122, 89, 0);
    }

    .layout-container {
        display: grid;
        width: 100%;
        background: radial-gradient(
                15.83% 154.58% at 1.95% 42.83%,
                rgba(86, 86, 86, 0.092) 0%,
                rgba(0, 0, 0, 0) 100%
            ),
            linear-gradient(360deg, rgba(0, 0, 0, 0.0368) 37%, rgba(0, 0, 0, 0) 50%),
            radial-gradient(
                44.67% 413.58% at 100% 0%,
                rgba(234, 243, 249, 0.2) 0%,
                rgba(210, 210, 210, 0.2) 100%
            ),
            linear-gradient(360deg, #d4d8db 40.67%, #ecf0f3 75.67%);
        border-bottom-left-radius: 14px;
        border-bottom-right-radius: 14px;
    }

    .device-demo {
        width: 100%;
        z-index: 1;
        position: relative;
        transform: translateY(85px);
        overflow: hidden;
    }

    .fullscreen-section {
        background: radial-gradient(
                55.38% 55.38% at 47.05% 13.61%,
                rgba(240, 240, 240, 0.4) 0%,
                rgba(210, 210, 210, 0.316) 100%
            ),
            radial-gradient(
                3.72% 69.36% at 3.72% 68.51%,
                rgba(210, 210, 210, 0.045) 0%,
                rgba(0, 0, 0, 0) 100%
            ),
            radial-gradient(
                231.72% 68.5% at 90.77% 19.78%,
                rgba(210, 210, 210, 0.2) 0%,
                rgba(210, 210, 210, 0.068) 100%
            ),
            linear-gradient(0deg, rgba(0, 0, 0, 0.064) 0%, rgba(0, 0, 0, 0) 32.73%),
            linear-gradient(180deg, #dde0e4 27.73%, #d5d6d6 100%);
        border-bottom-right-radius: 22px;
        border-bottom-left-radius: 22px;
        position: relative;
        min-height: 200px;
        padding-top: 130px;
    }

    .align-end {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 2em;
    }

    .btn {
        background-color: #fff;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: inherit;
        border: transparent;
        border-radius: 32px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        cursor: pointer;
        padding: 0.5em 2em;
    }

    /* Mobile View (Large) */
    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .fullscreen-section {
            width: 100%;
            min-height: 180px !important;
            padding-top: 100px !important;
        }
    }
</style>
