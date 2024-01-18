<script>
    import { onMount } from 'svelte';
    import { cubicOut } from 'svelte/easing';
    import { tweened, spring } from 'svelte/motion';
    import { fade } from 'svelte/transition';
    import { pannable } from '$lib/utils/pannable';
    import { CarouselState } from '../store';
    import Cat1200 from './Cat1200Hero.svelte';
    import { AppCurrentSeries, CurrentSlide, Slides } from '../store.js';

    let contentOptions = [{ active: 'Cisco Catalyst 1200 Series Switches', component: Cat1200 }];

    $: component = contentOptions.find((type) => type.active === $AppCurrentSeries).component;

    let markers = [];

    const sleep = (ms) => new Promise((f) => setTimeout(f, ms));

    let currentSlide = $CurrentSlide;
    let nextTitleString = '';
    let prevTitleString = '';

    $: currentSlide = $CurrentSlide;

    $: {
        let nextSlide = currentSlide + 1;
        try {
            nextTitleString = $Slides[nextSlide]?.title.toString();
        } catch (e) {
            console.log('error is ', e);
        }
    }

    $: {
        let previousSlide = currentSlide === 0 ? $Slides.length - 1 : currentSlide - 1;
        let maxSlides = $Slides.length - 1;
        try {
            prevTitleString = $Slides[previousSlide].title.toString();
        } catch (e) {
            console.log('error is ', e);
        }

        if (currentSlide === maxSlides) {
            nextTitleString = $Slides[0].title.toString();
        }
    }

    onMount(async () => {
        await position.set(window * 0.5);
        if (container) {
            markers = getClientRect(container);
        } else {
            await sleep(1000);
            markers = getClientRect(container);
        }
    });

    const coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.2,
            damping: 0.4
        }
    );
    function handlePanStart() {
        coords.stiffness = coords.damping = 1;
    }
    function handlePanMove(event) {
        coords.update(($coords) => ({
            x: $coords.x + event.detail.dx,
            y: $coords.y + event.detail.dy
        }));
    }
    function handlePanEnd() {
        coords.stiffness = 0.2;
        coords.damping = 0.4;
        coords.set({ x: 0, y: 0 });
    }

    let window;
    /**
     * @type {HTMLDivElement} container
     */
    let container;

    const position = tweened(window * 0.5, { duration: 800, easing: cubicOut });
    /**
     *
     * @param {HTMLDivElement} container
     * @returns Array of each markers DOM Rect
     */
    function getClientRect(container) {
        return Array.from(container.querySelectorAll('.marker'), (node) =>
            node.getBoundingClientRect()
        ).sort((a, b) => a.x - b.x);
    }

    async function handlePrev() {
        if (!$CarouselState) {
            $CarouselState = !$CarouselState;
            return;
        }
        if ($CurrentSlide === 0) $CurrentSlide = $Slides.length - 1;
        else $CurrentSlide -= 1;
        await position.set(window * 0.5 - (markers[$CurrentSlide].x - window * 0.5));
    }
    async function handleNext(event) {
        if (!$CarouselState) {
            $CarouselState = !$CarouselState;
            return;
        }
        if ($CurrentSlide === $Slides.length - 1) $CurrentSlide = 0;
        else $CurrentSlide += 1;
        console.log('handleNext is $CurrentSlide ', $CurrentSlide);
        await position.set(window * 0.5 - (markers[$CurrentSlide].x - window * 0.5));
    }
    async function handleResize(event) {
        await position.set(event.currentTarget.innerWidth * 0.5);
        markers = getClientRect(container);
    }
    async function goToSlide(event) {
        if (!$CarouselState) {
            $CarouselState = !$CarouselState;
        }
        console.log('Hello from goToSlide()' + event);
        $CurrentSlide = +event.detail.slide;
        await position.set(window * 0.5 - (markers[$CurrentSlide].x - window * 0.5));
    }
</script>

<svelte:window on:resize={handleResize} />

<div class="carousel-control">
    <div class="buttons">
        <button on:click={handlePrev}
            ><i class="arrow left" /> Prev
            <p class="header-title" transition:fade>{prevTitleString}</p></button
        >
        <button on:click={handleNext}
            >Next <i class="arrow right" />
            <p class="header-title" transition:fade>{nextTitleString}</p></button
        >
    </div>
</div>

<div class="wrapper" bind:clientWidth={window}>
    <div
        class="content-container-layout"
        use:pannable
        on:panstart={handlePanStart}
        on:panmove={handlePanMove}
        on:panend={handlePanEnd}
        style="transform: translate({$coords.x}px, {$coords.y}px);"
    >
        <div
            class="card"
            style:transform={window <= 768 ? `translate(${$position}px, 0)` : 'translate(0)'}
            bind:this={container}
        >
            <svelte:component this={component} on:marker-click={goToSlide} />
        </div>
    </div>
</div>

<style>
    .carousel-control {
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 2;
    }
    .content-container-layout {
        display: grid;
        touch-action: auto;
        margin-top: 5vmin;
    }
    .header-title {
        font-size: 0.75em;
        margin: 0;
    }

    @media only screen and (min-width: 768px) and (max-width: 1024px) {
        .card {
            margin-bottom: 10vh !important;
        }
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .content-container-layout {
            display: flex;
            justify-content: flex-end;
            align-items: stretch;
            z-index: 2;
            flex-direction: column;
            gap: 2em;
            overflow-x: hidden;
            padding: 0;
        }

        .card {
            display: block !important;
            margin-bottom: 10vh !important;
        }
    }

    @media only screen and (max-width: 400px) {
        .content-container-layout {
            margin-top: 0 !important;
        }

        .card {
            margin-bottom: 10vh !important;
        }
    }
    .wrapper {
        width: 100%;
    }
    .card {
        will-change: transform;
        transform-origin: -88px 0;
        margin-bottom: 6vh;
        height: auto;
        display: inherit;
    }
    .buttons {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        transition: all 0.5s ease-in-out;
    }
    .buttons button {
        min-width: 225px;
    }
    .buttons > button {
        transition: all 0.5s ease-in-out;
        background: var(--cisco-gray);
        border-radius: 32px;
        padding: 1em 1.5em;
        margin: 0 1em;
        cursor: pointer;
    }
    .buttons > button:hover {
        background: var(--btn-blue-1);
        color: var(--text-white-1);
    }
    .arrow {
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
    }
    .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
    .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
    }

    @media only screen and (max-width: 768px) {
        .buttons button {
            min-width: max-content;
        }
    }
</style>
