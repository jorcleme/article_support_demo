<script>
    import GetSupport from '$lib/components/GetSupport.svelte';
    import Steps from '$lib/components/Steps.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { UserPreferences } from '$lib/components/store';
    import Feedback from '$lib/components/Feedback.svelte';
    import MediaCardArticle from '$lib/components/MediaCardArticle.svelte';

    const steps = [
        { icon: Breadcrumb, iconProps: { name: 'gettoknow' } },
        { icon: Breadcrumb, iconProps: { name: 'getconfigured' } },
        { icon: Breadcrumb, iconProps: { name: 'getoptimized' } }
    ];

    $: device = $UserPreferences?.device ?? null;

    let open = false;
    onMount(() => {
        open = true;
    });

    let notes;
    let openaiResponse;
    async function handleSubmit(event) {
        const req = await fetch('/api/openai/sherlock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes })
        });
        const res = await req.json();
        console.log('res: ', res);
        if (res.resultArticles) {
            openaiResponse = res.resultArticles;
        }
    }
</script>

<div class="page">
    <div class="auto-width">
        <div class="column">
            <section>
                <GetSupport bind:open />

                <label for="notes">Case Notes Query:</label>
                <input id="notes" type="text" bind:value={notes} />
                <button class="cta" type="button" on:click={handleSubmit}>Submit</button>
                {#if openaiResponse}
                    {#each openaiResponse as article}
                        <MediaCardArticle media={article} />
                    {/each}
                {/if}
            </section>
        </div>
        <div class="progress column">
            <Steps {steps} />
        </div>
        <div class="cta" in:fade={{ duration: 500, delay: 200 }}>
            <a
                data-sveltekit-preload-code="hover"
                href="/{device}/step-by-step/get-to-know"
                class="button inverse">Begin at Step 1</a
            >
        </div>
    </div>
</div>
<Feedback />

<style>
    .page {
        background: transparent;
        margin-top: 200px;
        padding: 1em;
    }

    .column {
        display: flex;
        flex-flow: column nowrap;
    }
    .progress {
        padding: 5vmin 0;
    }
    .cta a {
        text-decoration: none;
        color: white;
    }
    .cta {
        text-decoration: none;
        cursor: pointer;
        max-width: 200px;
        margin: 2em auto;
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
        background-color: #0060ad;
    }

    @media only screen and (min-width: 1024px) {
        .auto-width {
            max-width: 80%;
            margin: 0 auto;
        }
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
    }
</style>
