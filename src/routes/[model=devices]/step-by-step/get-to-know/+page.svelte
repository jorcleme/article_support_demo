<script>
    import ReusableLayout from '$lib/components/ReusableLayout.svelte';
    import GetToKnow from '$lib/components/GetToKnow.svelte';
    import Steps from '$lib/components/Steps.svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { APP_STEPS_NO_TEXT } from '$lib/utils/constants';
    import { CurrentStep, BreadcrumbStore, UserPreferences } from '$lib/components/store';
    import { beforeNavigate } from '$app/navigation';
    import { _ as format } from 'svelte-i18n';

    let open = false;

    beforeNavigate(autoCompleteStep);

    function autoCompleteStep() {
        CurrentStep.setStepOne();
        $BreadcrumbStore.step1complete = true;
        $BreadcrumbStore.currentStep = 1;
        CurrentStep.persistStep($CurrentStep);
        BreadcrumbStore.saveState($BreadcrumbStore);
    }

    onMount(() => {
        open = true;
        // This won't live here in Prod. Just for DEV ENV ONLY. Correct placement is root page/layout
        $UserPreferences.device = $page.params.model ?? null;
        UserPreferences.persist($UserPreferences);
    });
</script>

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
        <p id="estComText">{$format('estimated_completion_text')}: <span>14 Min.</span></p>
    </div>
    <section slot="step-module">
        <GetToKnow bind:open />
    </section>
    <div slot="cta" class="cta" in:fade={{ duration: 500, delay: 200 }}>
        <a
            data-sveltekit-preload-code="hover"
            href="/{$page.params.model}/step-by-step/get-configured#estimated-completion"
            class="button">{$format('get_configured_title')}</a
        >
    </div>
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
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button {
        text-decoration: none;
        cursor: pointer;
        margin: 2em 0;
        background-color: var(--btn-blue-1);
        color: white;
        padding: 1em 2em;
        border-radius: 32px;
        transition: all 0.2s ease-in-out;
        align-self: center;
        border: var(--btn-blue-1) 1px solid;
    }

    .cta a {
        text-decoration: none;
        color: white;
    }
    .button:hover {
        background-color: #0060ad;
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .estimated-completion {
            max-width: 400px;
            padding: 0 0 0 2.5em;
        }
        #estComText {
            display: none;
        }

        .estimated-completion svg {
            display: inline-block;
            height: auto;
        }
    }
</style>
