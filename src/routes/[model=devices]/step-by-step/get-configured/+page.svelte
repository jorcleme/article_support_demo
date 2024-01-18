<script>
    import ReusableLayout from '$lib/components/ReusableLayout.svelte';
    import GetConfigured from '$lib/components/GetConfigured.svelte';
    import Steps from '$lib/components/Steps.svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { CurrentStep, BreadcrumbStore } from '$lib/components/store';
    import { APP_STEPS_NO_TEXT } from '$lib/utils/constants';
    import { beforeNavigate } from '$app/navigation';
    import { _ as format } from 'svelte-i18n';

    beforeNavigate(autoCompleteStep);

    function autoCompleteStep() {
        CurrentStep.setStepTwo();
        $BreadcrumbStore.step2complete = true;
        $BreadcrumbStore.currentStep = 2;
        CurrentStep.persistStep($CurrentStep);
        BreadcrumbStore.saveState($BreadcrumbStore);
    }

    let open = false;

    onMount(() => {
        open = true;
    });
</script>

<svelte:head>
    <title>Cisco {$format('headers_h2')} | {$format('get_configured_title')}</title>
</svelte:head>

<ReusableLayout>
    <div
        slot="estimated-completion"
        class="estimated-completion"
        style="display: flex; align-items: center;"
        id="estimated-completion"
    >
        <svg xmlns="http://www.w3.org/2000/svg" style="width:50px;" viewBox="0 0 80 80"
            ><path
                d="M58,39.25H46.70581a6.74732,6.74732,0,0,0-13.41162,0H22a12.75,12.75,0,0,0,0,25.5H57.29419a6.75,6.75,0,1,0,0-1.5H22a11.25,11.25,0,0,1,0-22.5H33.29419a6.74732,6.74732,0,0,0,13.41162,0H58a12.75,12.75,0,0,0,0-25.5H22.70581a6.687,6.687,0,0,0-.66064-2.23462L25.06055,10,24,8.93945l-2.78308,2.78308A6.74807,6.74807,0,1,0,22.70581,16.75H58a11.25,11.25,0,0,1,0,22.5Zm6,19.5A5.25,5.25,0,1,1,58.75,64,5.25605,5.25605,0,0,1,64,58.75ZM40,45.25A5.25,5.25,0,1,1,45.25,40,5.25605,5.25605,0,0,1,40,45.25Zm-24-24a5.25009,5.25009,0,1,1,4.13525-8.44586L16,16.93945l-2-2L12.93945,16l2.53028,2.53027a.74971.74971,0,0,0,1.06054,0l4.36939-4.36944A5.19508,5.19508,0,0,1,21.25,16,5.25605,5.25605,0,0,1,16,21.25Z"
            /></svg
        >
        <p>{$format('estimated_completion_text')}: <span>10 Min.</span></p>
    </div>
    <section slot="step-module">
        <GetConfigured bind:open />
    </section>
    <a
        slot="cta"
        class="cta"
        in:fade={{ duration: 500, delay: 200 }}
        data-sveltekit-preload-data="hover"
        href="/{$page.params.model}/step-by-step/get-optimized#estimated-completion"
    >
        {$format('get_optimized_title')}
    </a>
    <svelte:fragment slot="progress-steps">
        <Steps steps={APP_STEPS_NO_TEXT} />
    </svelte:fragment>
</ReusableLayout>

<style>
    .estimated-completion {
        padding: 0 0 0 2.5em;
    }

    .estimated-completion > p {
        font-size: var(--font-size-base);
        padding: 0 1.5em;
        font-family: 'CiscoSansThin';
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
        background-color: #0060ad;
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .estimated-completion {
            max-width: 400px;
            padding: 0 0 0 2.5em;
        }

        .estimated-completion svg {
            display: inline-block;
            height: auto;
        }
    }
</style>
