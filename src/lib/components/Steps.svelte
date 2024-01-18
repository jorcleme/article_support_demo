<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { createEventDispatcher, afterUpdate } from 'svelte';
    import { CurrentStep, UserPreferences } from './store';
    import Breadcrumb from './Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { _ as format } from 'svelte-i18n';

    $: experience = $UserPreferences.experience || 'all-steps';
    $: model = $page.params.model || 'C1200-24FP-4X';
    $: filter = experience === 'step-by-step' ? 'step-by-step' : 'jump-to-all';

    afterUpdate(() => {
        console.log('CurrentStep is : ', $CurrentStep);
    });
    export let steps;
    export let vertical = false;
    export let size = '3.5rem';
    export let line = vertical ? '0.15rem' : '0.3rem';
    export let primary = 'var(--btn-blue-1)';
    export let secondary = '#afc0e5';
    export let light = '#fff';
    export let dark = '#333';
    export let borderRadius = '50%';
    export let clickable = true;
    export let fontFamily = 'CiscoSansTT';
    export let reverse = false;

    $: current = $CurrentStep;

    const minStepSize = '5rem';
    const stepLabelSpace = '2rem';

    let segments = [];
    for (let i = 0; i < steps.length; i++) {
        segments.push({ height: 0, width: 0 });
    }
    if (current > steps.length - 1) {
        current = steps.length - 1;
    }

    if (current < 0) {
        current = 0;
    }

    let progress = tweened(current, { duration: 400, easing: cubicOut });
    let total = 0;
    let key = vertical ? 'height' : 'width';

    function fillSegments(step) {
        let size = 0;
        let i = 0;
        while (step > 1) {
            step--;
            size += (segments[i][key] + segments[i + 1][key]) / 2;
            i++;
        }
        if (i < segments.length - 1) {
            size += (step * (segments[i][key] + segments[i + 1][key])) / 2;
        }
        return size;
    }

    $: fill = fillSegments($CurrentStep);

    $: {
        total = 0;
        for (let i = 0; i < steps.length; i++) {
            total += segments[i][key];
        }
        total -= (segments[0][key] + segments[segments.length - 1][key]) / 2;
        fill = fillSegments($progress);
    }

    $: {
        $progress = current;
    }

    const dispatch = createEventDispatcher();
    const onClick = (i) => {
        if (clickable) {
            let last = current;
            dispatch('click', { current: i, last });
        }
    };
</script>

<div
    role="progressbar"
    class="steps-container"
    style={`--size: ${size}; 
      --line-thickness: ${line};
      --primary: ${primary}; 
      --secondary: ${secondary};
      --light: ${light};
      --dark: ${dark};
      --border-radius: ${borderRadius};
      --font-family: ${fontFamily || 'CiscoSansTT'};
    	display: flex;
        align-items: stretch; 
    `}
    style:flex-direction={vertical ? (reverse ? 'row-reverse' : 'row') : 'column'}
    style:height={vertical ? '40vh' : '0'}
    style:min-height={vertical ? '40vh' : '0'}
>
    <!-- progress line container -->
    <div
        style="display: flex; align-items: center;"
        style:flex-direction={vertical ? 'column' : 'row'}
        style:width={vertical ? size : '100%'}
        style:min-width={vertical ? size : null}
        style:height={vertical ? '100%' : size}
        style:min-height={vertical ? '100%' : size}
    >
        <div
            style:width={vertical ? line : `${segments[0].width / 2}px`}
            style:height={vertical ? `${segments[0].height / 2}px` : line}
        />
        <div
            style:width={vertical ? line : `${total}px`}
            style:height={vertical ? `${total}px` : line}
            class="bg-secondary"
            style="display: flex; align-items:center;"
            style:flex-direction={vertical ? 'column' : reverse ? 'row-reverse' : 'row'}
        >
            <div
                class="bg-primary"
                style:width={vertical ? line : `${fill}px`}
                style:height={vertical ? `${fill}px` : line}
            />
            {#if line !== size}
                <!-- the progress indicator -->
                <div class="bg-primary" style="width:8px; height:8px; border-radius: 50%;" />
            {/if}
        </div>
    </div>
    <!--  progress line end -->
    <div
        style="display: flex; justify-content: space-between;"
        style:flex-direction={vertical ? 'column' : reverse ? 'row-reverse' : 'row'}
        style:margin-left={vertical ? (reverse ? null : '-' + size) : null}
        style:margin-right={vertical ? (reverse ? '-' + size : null) : null}
        style:margin-top={vertical ? null : '-' + size}
    >
        {#each steps as step, i (i)}
            <!-- step container -->
            <div
                style="display: flex; align-items: center; flex: 1; width: 100%"
                style:flex-direction={vertical ? (reverse ? 'row-reverse' : 'row') : 'column'}
                bind:clientWidth={segments[i].width}
                bind:clientHeight={segments[i].height}
            >
                <!-- circle and text label -->
                <a
                    href={experience === 'all-steps'
                        ? `/${model}/${filter}#estimated-completion`
                        : `/${model}/${filter}/${step.iconProps.path}#estimated-completion`}
                    style="display: flex; align-items: center; text-decoration: none;"
                    style:flex-direction={vertical ? (reverse ? 'row-reverse' : 'row') : 'column'}
                    style:min-width={vertical ? 'var(--size)' : minStepSize}
                    style:min-height={vertical ? minStepSize : 'var(--size)'}
                >
                    <!-- circle -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="step
						{current <= $progress ? `bg-primary text-light` : `bg-secondary text-light`}
						"
                        class:shadow={i === current}
                        class:hover-highlight={clickable}
                        style="display: flex; flex-direction: row; flex-wrap: nowrap"
                        on:click={() => onClick(i)}
                    >
                        {#if step.icon}
                            {#if step.iconProps}
                                <Breadcrumb name={step.iconProps.name} />
                            {:else}
                                <svelte:component this={step.icon} />
                            {/if}
                        {:else}
                            <svelte:component this={step.icon} />
                        {/if}
                    </div>
                    <!-- text label -->
                    <div
                        class="steps__label"
                        class:hover-highlight={clickable}
                        style:margin-left={vertical ? (reverse ? null : stepLabelSpace) : null}
                        style:margin-right={vertical ? (reverse ? stepLabelSpace : null) : null}
                        style:margin-top={vertical ? null : stepLabelSpace}
                        style:text-align={vertical ? (reverse ? 'right' : 'left') : 'center'}
                    >
                    {#if typeof step.key !== 'undefined'}
                    <div class:text-primary={i <= $progress}>
                        {$format(`${step.key}`)}
                    </div>
                {/if}
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>

<style>
    .steps-container {
        font-family: var(--font-family);
    }
    .step {
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--size);
        min-width: var(--size);
        height: var(--size);
        min-height: var(--size);
        font-size: calc(var(--size) * 0.5);
    }
    .hover-highlight:hover {
        cursor: pointer;
        filter: brightness(85%);
    }
    .steps__label {
        font-size: var(--font-size-md);
        color: var(--cisco-gray);
    }
    .text-primary {
        color: var(--primary) !important;
    }
    .text-light {
        color: var(--light) !important;
    }
    .text-dark {
        color: var(--dark) !important;
    }
    .bg-secondary {
        background-color: var(--secondary) !important;
    }
    .bg-primary {
        background-color: var(--primary) !important;
    }
    .shadow {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
</style>
