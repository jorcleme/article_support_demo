<script>
    import Logo from '$lib/assets/Cisco_Logo_Gray_Small.png';
    import Select from './select/Select.svelte';
    import Steps from './Steps.svelte';
    import { AppSteps } from '$lib/utils/constants';
    import { createEventDispatcher } from 'svelte';
    import { UserPreferences } from './store';
    import { _ as format } from 'svelte-i18n';
    import { page } from '$app/stores';
    import { CurrentModel } from './store';
    import { CISCO_CATALYST_1200_SERIES_SWITCHES } from '$lib/utils/allSeries';
    import { goto } from '$app/navigation';

    const dispatch = createEventDispatcher();

    $: devices = CISCO_CATALYST_1200_SERIES_SWITCHES.map((device) => {
        return { label: device, value: device };
    });
    // const devices = [
    //     { label: 'C1200-8T-D', value: 'C1200-8T-D' },
    //     {
    //         label: 'C1200-8T-E-2G',
    //         value: 'C1200-8T-E-2G'
    //     },
    //     {
    //         label: 'C1200-8P-E-2G',
    //         value: 'C1200-8P-E-2G'
    //     },
    //     {
    //         label: 'C1200-8FP-E-2G',
    //         value: 'C1200-8FP-E-2G'
    //     },
    //     {
    //         label: 'C1200-16T-2G',
    //         value: 'C1200-16T-2G'
    //     },
    //     {
    //         label: 'C1200-16P-2G',
    //         value: 'C1200-16P-2G'
    //     },
    //     {
    //         label: 'C1200-24T-4G',
    //         value: 'C1200-24T-4G'
    //     },
    //     {
    //         label: 'C1200-24P-4G',
    //         value: 'C1200-24P-4G'
    //     },
    //     {
    //         label: 'C1200-24FP-4G',
    //         value: 'C1200-24FP-4G'
    //     },
    //     {
    //         label: 'C1200-24T-4X',
    //         value: 'C1200-24T-4X'
    //     },
    //     {
    //         label: 'C1200-24P-4X',
    //         value: 'C1200-24P-4X'
    //     },
    //     {
    //         label: 'C1200-24FP-4X',
    //         value: 'C1200-24FP-4X'
    //     },
    //     {
    //         label: 'C1200-48T-4G',
    //         value: 'C1200-48T-4G'
    //     },
    //     {
    //         label: 'C1200-48P-4G',
    //         value: 'C1200-48P-4G'
    //     },
    //     {
    //         label: 'C1200-48FP-4X',
    //         value: 'C1200-48FP-4X'
    //     },
    //     {
    //         label: 'C1200-48T-4X',
    //         value: 'C1200-48T-4X'
    //     },
    //     {
    //         label: 'C1200-48P-4X',
    //         value: 'C1200-48P-4X'
    //     },
    //     {
    //         label: 'C1200-48FP-4X',
    //         value: 'C1200-48FP-4X'
    //     }
    // ];

    function ToggleBreadcrumbStore(event) {
        const { current, last } = event.detail;
        console.log(current);
        dispatch('navigating', { current, last });
    }
    /**
     *
     * @param event {CustomEvent}
     */
     const handleSelect = (event) => {
        if (!event.detail) return;
        const { value } = event.detail;
        console.log(value);
        $UserPreferences.device = value;
        console.log($UserPreferences);
        UserPreferences.persist($UserPreferences);
        let lastCurrentModel = $CurrentModel;
        $CurrentModel = value;
        console.log('page info: ', $page.url);
        let pathname = $page.url.pathname;
        if ($page.params.model) {
            pathname = pathname.replace(`${$page.params.model}`, $CurrentModel);
            console.log('new url: ', pathname);
        } else {
            pathname = pathname.replace(`${lastCurrentModel}`, $CurrentModel);
        }
        goto(pathname);
        dispatch('closeHamburgerMenu');
    };
</script>

<aside>
    <div class="logo">
        <img src={Logo} alt="Cisco Systems Brand Logo" loading="lazy" />
    </div>

    <div class="select-theme">
        <Select isClearable={true} on:select={handleSelect} items={devices} />
    </div>
    <nav>
        <div class="stepper">
            <Steps vertical steps={AppSteps} on:click={ToggleBreadcrumbStore} />
        </div>
        <div class="step step-help">
            <div>
                <a href="/get-support" target="_self" rel="canonical">
                    <div class="circle circle-help" style="font-weight: bold;">&quest;</div>
                </a>
            </div>
            <div class="title">{$format('get_support_text')}</div>
        </div>
        <div class="exit-group">
            <button class="btn exit-btn">
                <a
                    href="https://www.cisco.com/c/en/us/support/all-products.html"
                    target="_blank"
                    rel="noreferrer noopener external"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"
                        ><path
                            d="M46.28418,17.25H18a.7502.7502,0,0,0-.75.75V46.28418h1.5V19.81055L61.31055,62.37109l1.06054-1.06054L19.81055,18.75H46.28418Z"
                        /></svg
                    ><span>{$format('exit_anchor')}</span>
                </a>
            </button>
        </div>
    </nav>
</aside>

<style>
    aside {
        position: absolute;
        z-index: 998;
        background-color: var(--menu-background-gray);
        padding: 5em;
        width: 50%;
        max-height: 1100px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-bottom-right-radius: 16px;
        border-top-right-radius: 16px;
    }

    nav {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: space-around;
        position: relative;
    }

    .logo {
        max-width: 150px;
        padding: 2.5em 0;
    }

    .logo img {
        width: 100%;
        height: auto;
    }

    .select-theme {
        --borderRadius: 12px;
        --padding: 25px;
    }
    .stepper {
        margin-top: 3rem;
    }
    .step {
        position: relative;
        min-height: 3.5rem;
        color: var(--cisco-gray);
    }

    .title {
        line-height: 3.5rem;
        font-family: 'CiscoSansTT';
        font-size: var(--font-size-md);
    }

    .step-help {
        margin-top: 3rem;
    }

    .step > div:first-child {
        position: static;
        height: 0;
    }

    .step > div:not(:first-child) {
        margin-left: 2rem;
        padding-left: 3.5rem;
    }

    .circle {
        background-color: var(--cisco-gray);
        position: relative;
        width: 3.5rem;
        height: 3.5rem;
        line-height: 3.5rem;
        border-radius: 50%;
        text-align: center;
        font-size: var(--font-size-base);
    }

    .circle-help {
        background-color: transparent;
        color: #333;
        border: 1px solid var(--cisco-gray);
    }

    .circle-help::after {
        display: none;
    }

    .circle-help:link {
        text-decoration: none;
        pointer-events: all;
    }

    .circle-help:hover {
        background-color: var(--btn-hover-color-gray);
        border: 1px solid transparent;
    }

    .step:last-child .circle::after {
        display: none;
    }

    .step .circle:hover:not(.circle-help) {
        background-color: var(--cisco-blue);
    }

    a {
        text-decoration: none;
    }

    .exit-group {
        margin-top: 3rem;
    }

    .btn {
        border-radius: 50px;
        border: 1px solid var(--cisco-gray);
        outline: transparent;
        padding: 1em;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }

    .btn a {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .btn:hover {
        border-color: var(--btn-hover-color-gray);
        box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
        transition: all 0.5s ease-in-out;
    }

    .btn a svg {
        display: inline;
        height: auto;
        width: 2em;
        margin-right: 10px;
    }

    a:link {
        color: var(--cisco-gray);
    }

    a:visited {
        color: #333;
    }

    a:hover:not(div.step > div > a) {
        cursor: pointer;
        text-decoration: underline;
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        aside {
            width: 100% !important;
        }
        .logo {
            width: 30vw;
            transition: all 0.2s ease;
        }

        .logo img {
            width: 100%;
            height: auto;
        }
    }
</style>
