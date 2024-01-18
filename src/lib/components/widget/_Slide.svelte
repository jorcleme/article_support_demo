<script>
    import { createEventDispatcher, getContext } from 'svelte';
    import { Slides, CurrentSlide } from '../store';
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import switchicon from '$lib/assets/switch-icon.svg?url';

    const { getModel } = getContext('FeatureWidget');

    $: model = getModel();

    const dispatch = createEventDispatcher();

    $: currentSlide = $CurrentSlide;

    const closeWidget = () => {
        dispatch('toggle');
    };
</script>

<div class="slide">
    <div class="slide-content">
        <div class="slide-header">
            <h1 class="header-title" id="xxl">{$Slides[currentSlide].title}</h1>
            <button class="close-carousel" on:click={closeWidget}>&times</button>
        </div>
        <div class="product-name">
            <img src={switchicon} alt="Network Switch Icon" />

            <h2 style="margin: 0;">{model}</h2>
        </div>
        {#each $Slides as { slide, component }, i (i)}
            {#if slide === currentSlide}
                <div class="wrap" in:fly={{ duration: 800, delay: 200, easing: cubicOut, x: -50 }}>
                    <svelte:component this={component} />
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    @media only screen and (min-width: 1024px) {
        .slide {
            min-width: 50em !important;
        }
        .slide-content {
            background-color: #fefefe;
            font-family: inherit;
            margin: 0 auto;
            padding: 2.5em;
            border-radius: 10px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            z-index: 5;
        }
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .slide-content {
            position: relative;
            width: 90%;
            padding: 1em !important;
        }
    }

    @media only screen and (min-width: 1px) and (max-width: 400px) {
        .slide-content {
            width: 98% !important;
            height: 400px !important;
        }
    }

    #xxl {
        font-size: var(--font-size-lg);
        font-family: 'CiscoSansTTBold';
        color: var(--text-color-black2);
    }
    .slide-content {
        background-color: #fefefe;
        font-family: inherit;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        max-width: 55em;
        padding: 1em 2em;
        max-height: 490px;
        overflow-y: auto;
        display: flex;
        flex-flow: column nowrap;
        position: relative;
        transition: all 0.3s ease-out;
    }

    ::-webkit-scrollbar {
        width: 1rem !important;
        height: 1rem !important;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #a8a8a8 !important;
        border: 4px solid #f2f5f9 !important;
        border-top: none !important;
        border-bottom: none !important;
        border-radius: 7px !important;
    }

    ::-webkit-scrollbar-thumb {
        border: 4px solid #f8f8f8 !important;
    }

    ::-webkit-scrollbar-track {
        background: #f2f5f9 !important;
        border-bottom: none !important;
        border-top: none !important;
    }

    ::-webkit-scrollbar-track {
        background: #f8f8f8 !important;
    }

    .slide-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 1em 0;
    }

    .header-title {
        font-weight: 500;
        margin: 0;
    }

    .close-carousel {
        color: #aaaaaa;
        font-size: var(--font-size-xl);
        font-weight: bold;
        background-color: transparent;
        outline: none;
        border: none;
        cursor: pointer;
    }

    .close-carousel:hover,
    .close-carousel:focus {
        color: #333;
        text-decoration: none;
    }

    .product-name {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--cisco-gray);
    }

    .product-name h2 {
        font-size: var(--font-size-base);
        flex: 1;
    }

    img {
        object-fit: cover;
        width: 60px;
        height: auto;
        margin-right: 10px;
    }

    @media only screen and (max-width: 880px) and (min-width: 769px) {
        .slide-content {
            width: 95%;
            margin: 0 auto;
        }
    }
</style>
