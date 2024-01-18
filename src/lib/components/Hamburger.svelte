<script>
    import { isHamburgerNavOpen } from '../../store';
    import Sidebar from './Sidebar.svelte';
    import { fly } from 'svelte/transition';
    import { quintInOut } from 'svelte/easing';
    import { beforeNavigate } from '$app/navigation';
    import { jumpToAllNavigation } from './store';

    /**
     * @type {string}
     * @default "spin"
     *
     * enables us to change the animation if we want to
     */
    export let type = 'spin';

    const handleNavigate = async (event) => {
        await sleep(100);
        $isHamburgerNavOpen = false;
        $jumpToAllNavigation = event.detail.current ?? 0;

        console.log('module opened is: ', $jumpToAllNavigation);
    };

    const sleep = (ms) => new Promise((f) => setTimeout(f, ms));
    beforeNavigate(async () => {
        await sleep(100);
        $isHamburgerNavOpen = false;
    });
</script>

<button
    class="hamburger hamburger--{type}"
    aria-label="Hamburger menu"
    class:is-active={!!$isHamburgerNavOpen}
    on:click={() => ($isHamburgerNavOpen = !$isHamburgerNavOpen)}
>
    <span class="hamburger-box">
        <span class="hamburger-inner" />
    </span>
</button>

{#if $isHamburgerNavOpen}
    <div
        transition:fly={{ delay: 0, duration: 1000, easing: quintInOut, x: -100 }}
        style:z-index={998}
        style:position={'relative'}
    >
        <Sidebar on:navigating={handleNavigate} />
    </div>
{/if}

<style>
    .hamburger {
        padding: var(--padding, 15px);
        display: inline-block;
        cursor: pointer;
        transition-property: opacity, filter;
        transition-duration: 0.15s;
        transition-timing-function: linear;
        font: inherit;
        color: inherit;
        text-transform: none;
        background-color: inherit;
        border: 0;
        margin: 0;
        overflow: visible;
        z-index: 999;
        position: absolute;
        top: 0;
        left: 0;
    }
    .hamburger:active {
        background-color: transparent !important;
    }
    .hamburger:hover {
        opacity: var(--hover-opacity, 0.7);
    }
    .hamburger.is-active:hover {
        opacity: var(--hover-opacity-active, var(--hover-opacity, 0.7));
        z-index: 999;
    }
    .hamburger.is-active .hamburger-inner,
    .hamburger.is-active .hamburger-inner::before,
    .hamburger.is-active .hamburger-inner::after {
        background-color: var(--active-color, var(--cisco-gray, black));
    }

    .hamburger-box {
        width: var(--layer-width, 30px);
        height: calc(var(--layer-height, 4px) * 3 + var(--layer-spacing, 6px) * 2);
        display: inline-block;
        position: relative;
        z-index: 999;
    }

    .hamburger-inner {
        display: block;
        top: 50%;
        margin-top: var(--layer-height, 4px) / -2;
    }
    .hamburger-inner,
    .hamburger-inner::before,
    .hamburger-inner::after {
        width: var(--layer-width, 30px);
        height: var(--layer-height, 4px);
        background-color: var(--cisco-gray, black);
        border-radius: var(--border-radius, 4px);
        position: absolute;
        transition-property: transform;
        transition-duration: 0.15s;
        transition-timing-function: ease;
    }
    .hamburger-inner::before,
    .hamburger-inner::after {
        content: '';
        display: block;
    }
    .hamburger-inner::before {
        top: calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1);
    }
    .hamburger-inner::after {
        bottom: calc((var(--layer-spacing, 6px) + var(--layer-height, 4px)) * -1);
    }

    .hamburger--spin .hamburger-inner {
        transition-duration: 0.22s;
        transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    .hamburger--spin .hamburger-inner::before {
        transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
    }
    .hamburger--spin .hamburger-inner::after {
        transition: bottom 0.1s 0.25s ease-in,
            transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    .hamburger--spin.is-active .hamburger-inner {
        transform: rotate(225deg);
        transition-delay: 0.12s;
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .hamburger--spin.is-active .hamburger-inner::before {
        top: 0;
        opacity: 0;
        transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
        z-index: 999;
    }
    .hamburger--spin.is-active .hamburger-inner::after {
        bottom: 0;
        transform: rotate(-90deg);
        transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
</style>
