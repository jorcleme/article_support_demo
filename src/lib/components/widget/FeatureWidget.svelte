<script>
    import { CarouselState } from '../store';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';
    import { setContext } from 'svelte';
    import Slide from './_Slide.svelte';

    export let model;
    export let datasheet;
    export let similarSeries;
    export let devices;
    export let carouselState = false;

    setContext('FeatureWidget', {
        getDatasheet: () => datasheet,
        getModel: () => model,
        getSimilarSeries: () => similarSeries,
        getDevices: () => devices
    });

    $: carouselState = $CarouselState;

    const toggleWidget = () => {
        $CarouselState = !$CarouselState;
        console.log('$CarouselState is: ', $CarouselState);
    };

    $: {
        console.log('curr slide is: ', currentSlide);
    }

    let currentSlide = 0;
</script>

{#if $CarouselState}
    <div id="default-carousel">
        {#key carouselState}
            <div
                class="carousel-content"
                in:fly={{ duration: 1000, delay: 200, easing: cubicIn, x: -100 }}
                out:fly={{ duration: 800, delay: 0, easing: cubicOut, x: 50 }}
            >
                <Slide on:toggle={toggleWidget} />
                <!-- <div class="slide-pointer" /> -->
            </div>
        {/key}
    </div>
{/if}

<style>
    #default-carousel {
        padding-top: 4em;
        z-index: 1;
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .carousel-content {
        position: relative;
        width: 100%;
    }
    /* .slide-pointer {
        border: solid 15px transparent;
        border-top-color: #fefefe;
        position: absolute;
        z-index: 5;
        filter: drop-shadow(0 2px 2px rgba(100, 100, 111, 0.2));
        left: 49%;
    } */
</style>
