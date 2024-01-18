<script>
    import Tabs from '$lib/components/tabs/Tabs.svelte';
    import TabList from '$lib/components/tabs/TabList.svelte';
    import TabItem from './tabs/TabItem.svelte';
    import TabPanel from './tabs/TabPanel.svelte';
    import QRCode from '$lib/assets/Cisco_Business_Mobile_App_QR_Code.png';
    import QuickResources from './QuickResources.svelte';
    import Breadcrumb from './Breadcrumb.svelte';
    import { BreadcrumbStore, CurrentStep } from './store';
    import { afterUpdate, onMount } from 'svelte';
    import { _ as format, _ } from 'svelte-i18n';
    import { slide } from 'svelte/transition';

    export let open = false;

    $: onSuccess = $BreadcrumbStore.step2complete;

    function handleDropdownClick() {
        if (!open) {
            return;
        } else {
            $BreadcrumbStore.step2complete = true;
            $BreadcrumbStore.currentStep = 2;
            CurrentStep.setStepTwo();
        }
        CurrentStep.persistStep($CurrentStep);
        BreadcrumbStore.saveState($BreadcrumbStore);
    }

    let url = '';
    let height;
    let maxHeight;
    let jumpToAllRoute = false;

    let windowWidth;
    let mobileWindowSize;
    let warningCLI = false;
    afterUpdate(() => {
        mobileWindowSize = jumpToAllRoute && windowWidth < 1024;
    });

    function onActivateTab(event) {
        warningCLI = event.detail.active;
        console.log('warningCLI is: ', warningCLI);
        return;
    }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="container" id="get-configured">
    <details class="dropdown" bind:open>
        <summary class="dropdown-summary" on:click={handleDropdownClick} on:keydown>
            <div class="row-flex">
                <Breadcrumb name="getconfigured" --icon-width="3.5rem" --icon-height="auto" />
                <div class="title">{$format('get_configured_title')}</div>
            </div>
            <div class="row-flex">
                <svg
                    class:drop={!!open}
                    class:up={open === false}
                    xmlns="http://www.w3.org/2000/svg"
                    class="ionicon"
                    viewBox="0 0 512 512"
                    ><title>Chevron Down</title><path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="48"
                        d="M112 184l144 144 144-144"
                    /></svg
                >
            </div>
        </summary>

        <div class="dropdown-content">
            <Tabs>
                <TabList>
                    <TabItem href={`web-setup`} id={0}
                        >{$format('get_configured_beginner_tab')}</TabItem
                    >
                    <TabItem on:activateTab={onActivateTab} id={1}
                        >{$format('get_configured_pro_tab')}</TabItem
                    >
                </TabList>
                <TabPanel>
                    <div class="beginner-container">
                        <div class="video-card">
                        <div class="video-wrapper">
                            <iframe
                                loading="lazy"
                                class="vid-card-iframe"
                                src="https://www.youtube.com/embed/i8TGGHAMhZA"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                                mozallowfullscreen
                                webkitallowfullscreen
                            />
                        </div>

                            <div class="video-text-content">
                                <h3 class="video-card-title">Get Your Catalyst 1200 Configured</h3>
                                <p id="video-card-description">
                                    Day zero configuration of your Catalyst 1200 Series Switch
                                </p>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    {#if warningCLI}
                        <div class="warningCLI" transition:slide>
                            <p>
                                <strong> <span class="warningHeader">Warning:</span></strong><br />
                                <br />{$_('cli_warning')}
                                <a
                                    href="https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-12-2/200000-CLIs-for-12-2-58.html"
                                    target="_blank"
                                    rel="noopener noreferrer">{$_('cli_warning_anchor')}</a
                                >
                            </p>
                            <button class="btn" on:click={() => (warningCLI = false)}
                                >{$_('acknowledgment_btn')}</button
                            >
                        </div>
                    {/if}
                    <div class="pro-container">
                        <div
                            class="video-card"
                        >
                        <div class="video-wrapper">

                            <iframe
                                class="vid-card-iframe"
                                loading="lazy"
                                src="https://www.youtube.com/embed/sheiqfCGosg"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                            />
                        </div>

                            <div class="video-text-content">
                                <h3 class="video-card-title">
                                    Get Your Catalyst 1200 Configured - CLI Style
                                </h3>
                                <p id="video-card-description">
                                    Day zero configuration of your Catalyst 1200 Series Switch
                                    through the Command Line Interface (CLI)
                                </p>
                            </div>
                        </div>
                    </div></TabPanel
                >
                <TabPanel />
            </Tabs>
            <section class="product-contents">
                <h2 class="section-title">{$format('get_configured_get_started_header')}</h2>
                <div>
                    <ul class="rounded-counter">
                        <li><span>{$format('get_configured_get_started_item_1')}</span></li>
                        <li>
                            <span>{$format('get_configured_get_started_item_2')}</span>
                        </li>
                        <li><span>{$format('get_configured_get_started_item_3')}</span></li>
                    </ul>
                </div>
            </section>
            <section class="prepping-product">
                <h2 class="section-title">{$format('get_configured_title')}</h2>
                <Tabs>
                    <TabList>
                        <TabItem id={0}>{$format('get_configured_beginner_tab')}</TabItem>
                        <TabItem id={1}>{$format('get_configured_pro_tab')}</TabItem>
                    </TabList>
                    <TabPanel>
                        <div class="content-wrapper">
                            <p>{$format('download_cisco_business_mobile_app')}</p>
                            <div class="content-row">
                                <div class="qr-code">
                                    <img src={QRCode} alt="Cisco Business Mobile App QR Code" />
                                </div>
                                <div class="text-right">
                                    <p>
                                        {$format('download_cisco_business_mobile_app_link_text')}
                                        <a href="https://www.cisco.com/go/cbsapp"
                                            >cisco.com/go/cbsapp</a
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="appIcons">
                            <a
                                aria-label="Download Cisco Business Mobile App on the Apple App Store"
                                href="https://apps.apple.com/us/app/cisco-business/id1569243325"
                            >
                                <img
                                    alt="Apple App Store Button"
                                    src="https://www.cisco.com/web/fw/tools/cisco-business/cisco-business-app/QRLanding/images/apple-app-badge.svg"
                                />
                            </a>
                            <a
                                aria-label="Download Cisco Business Mobile App on the Google App Store"
                                href="https://play.google.com/store/apps/details?id=com.cisco.cbdmobile&hl=en_US&gl=US"
                            >
                                <img
                                    alt="Google Play Store Button"
                                    src="https://www.cisco.com/web/fw/tools/cisco-business/cisco-business-app/QRLanding/images/google-play-badge-svg-cropped.svg"
                                />
                            </a>
                        </div>
                        <div class="alternative">
                            <h3>{$format('download_alternative_header')}</h3>
                            <br />
                            <p>
                                {$format('download_alternative_text_1')}
                            </p>
                            <br />
                            <p>
                                {$format('download_alternative_text_2')}
                                <a href="#web-setup">{$format('get_configured_beginner_tab')}</a
                                >&nbsp;section above.
                            </p>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div class="content-wrapper">
                            <h3 style="padding-bottom: 1em; margin: 0;">
                                {$format('cisco_business_dashboard_header')}
                            </h3>
                            <div class="flexrow">
                                <div class="med">
                                    <img
                                        src="https://www.cisco.com/c/en/us/support/smb/product-support/small-business/CBD/jcr:content/Title/full_4c44_copy_1276329814/Full/spotlight_592b.img.png/1652800231505.png"
                                        alt="Cisco Business Dashboard Logo"
                                    />
                                </div>
                                <p>
                                    {$format('cisco_business_dashboard_text')}
                                </p>
                            </div>
                            <p>
                                To find out more: <a
                                    href="https://www.cisco.com/c/en/us/support/smb/product-support/small-business/CBD.html"
                                    >{$format('cisco_business_dashboard_header')}</a
                                >
                            </p>
                        </div></TabPanel
                    >
                    <TabPanel />
                </Tabs>
            </section>
            <QuickResources />
        </div>
    </details>
</div>

<style>
    .beginner-container,
    .pro-container {
        display: flex;
        justify-content: center;
    }
    .container {
        transition: width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    details.dropdown {
        border-radius: 16px;
        background-color: #fff;
        font-family: inherit;
        font-size: var(--font-size-base);
        color: #333;
        padding: 1em 1.5em;
        border: #d2d2d2 1px solid;
        -webkit-transition: all 0.25s ease-in;
        -o-transition: all 0.25s ease-in;
        transition: all 0.25s ease-in;
        margin: 1em;
        box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0,
            rgba(0, 0, 0, 0.12) 0 1px 18px 0;
    }

    summary.dropdown-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: none;
        max-height: 60px;
    }

    details[open] {
        filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.2));
    }

    .row-flex {
        display: flex;
        align-items: center;
    }

    .title {
        margin-left: clamp(0.5em, 0.75em, 3.24em);
        font-size: var(--font-size-md);

        font-family: 'CiscoSansThin';
    }

    .ionicon {
        height: 1.2rem;
        width: 1.2rem;
        fill: #333;
    }

    .up {
        transform: rotate(0deg);
        transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .drop {
        transform: rotate(180deg);
        transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .dropdown-content {
        background-color: #fff;
        display: flex;
        flex-direction: column;
        border-top: none;
        width: 100%;
        margin-bottom: 1em;
        font-family: 'CiscoSansTT';
        text-rendering: optimizeSpeed;
    }

    .video-card {
        max-width: clamp(200px, 100%, 600px);
        background-color: white;
        display: inline-flex;
        flex-flow: column nowrap;
        position: relative;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #d2d3d7;
        transition: all 0.5s ease-in-out;
        scroll-snap-align: start;
        align-self: center;
        margin-bottom: 2em;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }

    .video-wrapper {
        position: relative;
        padding-top: 56.25%;
        overflow: hidden;
    }
    .vid-card-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* height: clamp(300px, 100%, 600px); */
    }

    .video-text-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .video-card-title {
        padding: 1rem;
        color: var(--cisco-dark-blue);
        margin: 0;
        font-weight: 700;
        font-size: var(--font-size-md);
        line-height: 1.286;
    }

    #video-card-description {
        padding: 0 1rem 1rem 1rem;
        color: rgb(88, 91, 99);
        margin: 0 0 1em 0;
        display: -webkit-box;
        display: inline-block;
        font-weight: 800;
        overflow: hidden;
        font-family: 'CiscoSansThin';
    }

    /* Hover section */
    .video-card:hover {
        box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
        transition: all 0.5s ease-in-out;
    }

    .product-contents {
        width: 90%;
        font-size: var(--font-size-base);
    }

    .product-contents-list ul li {
        font-size: var(--font-size-base);
    }

    .prepping-product {
        font-family: inherit;
        font-size: var(--font-size-base);
        margin: 0;
    }

    ul.rounded-counter {
        counter-reset: li;
        font-family: 'CiscoSansTT';
        font-size: var(--font-size-base);
        list-style: none;
        padding-inline-start: 20px;
    }

    .rounded-counter > li > span::before {
        content: counter(li);
        counter-increment: li;
        position: absolute;
        left: -1.3em;
        top: 50%;
        margin-top: -1.3em;
        background: var(--cisco-dark-blue);
        height: 2em;
        width: 2em;
        line-height: 2em;
        border: 0.3em solid #fff;
        text-align: center;
        font-weight: 700;
        border-radius: 2em;
        transition: all 0.3s ease-out;
        color: #fff;
    }

    li {
        display: block;
        padding: 0.6em 0.6em 0.6em 2em;
        margin: 0.5em 0;
        color: #333;
        position: relative;
        border-radius: 1em;
    }

    .content-wrapper {
        padding: 0.5em 1em;
    }

    .content-wrapper h3 {
        font-weight: 700;
    }

    .flexrow {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .med {
        width: 200px;
    }

    .flexrow .med img {
        width: 100%;
        height: auto;
    }

    .flexrow p {
        flex: 1;
        padding: 0.2em;
        font-size: var(--font-size-sm);
    }

    .content-wrapper p {
        color: #333;
        font-size: var(--font-size-base);
    }

    .content-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-template-rows: 1fr;
        align-items: center;
        justify-items: start;
        margin: 1em 0;
        font-family: 'CiscoSansTT';
        font-size: var(--font-size-sm);
    }

    .qr-code {
        border: 1px solid #000;
        flex: 1;
    }

    .qr-code img {
        object-fit: cover;
        width: 100%;
        height: auto;
    }

    .text-right {
        margin: 1em;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-family: inherit;
        overflow: hidden;
        white-space: pre-wrap;
        text-overflow: ellipsis;
    }

    .text-right p {
        color: var(--cisco-gray);
        font-size: var(--font-size-base);
        font-weight: 500;
    }

    .appIcons {
        display: grid;
        place-items: center;
        padding: 20px 0;
    }

    .appIcons a img {
        width: 200px;
        max-width: 100%;
        height: auto;
    }

    :link {
        text-decoration: none;
        color: var(--cisco-blue);
    }

    .alternative {
        background-color: var(--border-gray);
        border-radius: 12px;
        padding: 0.5em 1em;
        font-size: var(--font-size-sm);
        font-family: 'CiscoSansTTBold';
    }

    .alternative p:nth-of-type(even) {
        font-family: 'CiscoSansTT';
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        .product-contents-list ul li {
            font-size: var(--font-size-sm);
        }
    }

    .section-title {
        font-weight: 700;
        color: var(--text-color-black2);
        font-size: var(--font-size-md);
    }

    .warningCLI {
        background-color: white;
        padding: 1em;
        margin: 1em 0;
        height: 250px;
        border-left: var(--theme-warning) 5px solid;
        background-color: var(--menu-background-gray);
    }
    .warningHeader {
        color: var(--theme-warning);
    }

    .btn {
        float: right;
        margin: 0em 0 0.5em;
        padding: 0.5em 1.5em;
        border-radius: 10px;
        background-color: var(--btn-blue-1);
        color: #efefef;
        font-family: 'CiscoSansTTBold';
        cursor: pointer;
        transition: all 200ms ease-in;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }

    .btn:hover {
        transform: scale(1.02);
        box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
        transition: all 0.5s ease-in-out;
        background-color: #0060ad;
    }
</style>
