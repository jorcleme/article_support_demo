<script context="module">
    import { page } from '$app/stores';
</script>

<script>
    import { dev } from '$app/environment';
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { quadIn } from 'svelte/easing';

    let error = false;

    onMount(() => {
        error = true;
    });
</script>

<svelte:head>
    <title>{$page.status} | {$page.error}</title>
</svelte:head>

{#if error}
    <div in:fly={{ duration: 800, delay: 200, easing: quadIn }} class="center">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"
                ><path
                    d="M37.49414,10.74365v.00049L9.59082,62.57764A2.83317,2.83317,0,0,0,12.09619,66.75H67.90332a2.83362,2.83362,0,0,0,2.50586-4.17236l-27.90332-51.834a2.84883,2.84883,0,0,0-5.01172,0ZM40,10.75a1.3277,1.3277,0,0,1,1.18555.70508L69.08887,63.28857a1.29711,1.29711,0,0,1-.0293,1.30762,1.33461,1.33461,0,0,1-1.15625.65381H12.09619a1.3344,1.3344,0,0,1-1.15576-.65332,1.298,1.298,0,0,1-.0293-1.30811L38.81445,11.45508A1.3277,1.3277,0,0,1,40,10.75Z"
                /><rect x="39.25781" y="28" width="1.5" height="20.00001" /><path
                    d="M40,58.75A2.75,2.75,0,1,0,37.25,56,2.7528,2.7528,0,0,0,40,58.75Zm0-4A1.25,1.25,0,1,1,38.75,56,1.25116,1.25116,0,0,1,40,54.75Z"
                /></svg
            >
        </div>

        <h2>{$page.status}</h2>
        <p>Page {$page.error.message}</p>
        <a class="cta" href="/" target="_self">Back Home</a>

        {#if dev && $page.error.stack}
            <pre>{$page.error.stack}</pre>
        {/if}
    </div>
{/if}

<style>
    .center {
        display: grid;
        place-items: center;
        margin-top: 200px;
    }

    svg {
        fill: var(--theme-warning);
        width: 12em;
        height: auto;
    }

    h2,
    p {
        color: var(--cisco-midnight-blue);
        font-family: 'CiscoSansThin';
    }

    h2 {
        font-size: var(--font-size-lg);
        font-weight: 700;
    }

    p {
        font-size: var(--font-size-md);
    }

    .cta {
        text-decoration: none;
        cursor: pointer;
        margin: 2em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--btn-blue-1);
        color: white;
        padding: 1em 2em;
        border-radius: 32px;
        transition: all 0.2s ease-in-out;
        align-self: center;
        border: var(--btn-blue-1) 1px solid;
    }
    .cta:hover {
        background-color: var(--btn-hover-main);
    }
</style>
