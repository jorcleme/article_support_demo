<script>
    import MediaCardArticle from '$lib/components/MediaCardArticle.svelte';
    import MediaCardVideo from '$lib/components/MediaCardVideo.svelte';

    import Article from "/src/lib/components/Article.svelte";
    import articleData from "./article-data.json";
    const article = {
    "title": "Configure Port VLAN Membership",
    "objective": "This article provides instructions on how to assign a port to one or more VLANs in the Cisco Business 250 or 350 series switch.",
    "intro": "",
    "applicable_devices": [
        {
            "device_name": "CBS250",
            "software_version": "3.0.0.69",
            "data_sheet_link": null,
            "download_latest_link": "https://software.cisco.com/download/home/286325765"
        },
        {
            "device_name": "CBS350",
            "software_version": "3.0.0.69",
            "data_sheet_link": "https://www.cisco.com/c/en/us/products/collateral/switches/business-350-series-managed-switches/datasheet-c78-744156.html",
            "download_latest_link": "https://software.cisco.com/download/home/286325769"
        },
        {
            "device_name": "CBS350-2X",
            "software_version": "3.0.0.69",
            "data_sheet_link": "https://www.cisco.com/c/en/us/products/collateral/switches/business-350-series-managed-switches/datasheet-c78-744156.html",
            "download_latest_link": "https://software.cisco.com/download/home/286325769"
        },
        {
            "device_name": "CBS350-4X",
            "software_version": "3.0.0.69",
            "data_sheet_link": "https://www.cisco.com/c/en/us/products/collateral/switches/business-350-series-managed-switches/datasheet-c78-744156.html",
            "download_latest_link": "https://software.cisco.com/download/home/286325769"
        }
    ],
    "steps": [
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 1,
            "text": "Log in to the web-based utility of your switch then choose VLAN Management > Port VLAN Membership. ",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step1.png",
            "alt": null,
            "note": null,
            "MLSummary": "Configure Port VLAN Membership."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 2,
            "text": "Choose the interface type (Port or LAG) and click Go.  The following fields are displayed for all interfaces of the selected type:  Interface - Port or LAG ID. Mode - Interface VLAN mode that was selected in the Interface Settings page. Administrative VLANs - Drop-down list that displays all VLANs of which the interface might be a member. Operational VLANs - Drop-down list that displays all VLANs of which the interface is currently a member. LAG - If the interface selected is Port, it will display the LAG in which it is a member.  Note: In this example, Port is chosen.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step2.png",
            "alt": null,
            "note": null,
            "MLSummary": "Configure Port or LAG interfaces."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 3,
            "text": "Click the radio button of a port that you want to configure.  Note: In this example, GE3 is chosen.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step3.png",
            "alt": null,
            "note": "Note: In this example, Port is chosen.",
            "MLSummary": "Configure port GE3."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 4,
            "text": "Click the Join VLAN button. ",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step4.png",
            "alt": null,
            "note": "Note: In this example, GE3 is chosen.",
            "MLSummary": "Join the VLAN."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 5,
            "text": "Make sure the correct Port or LAG is chosen in the Interface area.  Note: The Current VLAN Mode displays the port VLAN mode that was chosen in the Interface Settings page. In this example, the mode is set to Access. To learn more about how to configure this feature, click here for instructions.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step5.png",
            "alt": null,
            "note": null,
            "MLSummary": "Configure the correct Port or LAG in the Interface area."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 6,
            "text": "Choose an access VLAN ID from the drop-down list. When the port is in Access mode, it will be a member of the Access VLAN. The default value is 1.  Note: In this example, VLAN 20 is chosen.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step6.png",
            "alt": null,
            "note": null,
            "MLSummary": "Choose VLAN 20 from the drop-down list to make the port a member of the Access VLAN."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 7,
            "text": "Choose a multicast TV VLAN from the drop-down list. When the port is in Access mode, it will be a member of the Multicast TV VLAN. The default value is None.  The following settings are for the inactive interface VLAN modes. These effects will be saved, but will not take effect until the interface VLAN mode is changed in the VLAN Interface Settings page. To learn more about how to configure this feature, click here for instructions.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step7.png",
            "alt": null,
            "note": "Note: In this example, VLAN 20 is chosen.",
            "MLSummary": "Get Configured: Choose a multicast TV VLAN from the drop-down list."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 8,
            "text": "Choose a native VLAN ID from the drop-down list. When the port is in Trunk mode, it will be a member of the Native VLAN. The default value is 1. ",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step8.png",
            "alt": null,
            "note": null,
            "MLSummary": "Choose a Native VLAN ID to become a member of the Native VLAN when in Trunk mode."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 9,
            "text": "When the port is in Trunk mode, it will be a member of the Tagged VLANs. Choose from the following options:  All VLANs - When the port is in Trunk mode, it will be a member of all VLANs. User Defined - When the port is in Trunk mode, it will be a member of the VLANs that are entered in this field.   Note: In this example, User Defined is chosen and VLANs 30-40 are used. All VLANs - When the port is in Trunk mode, it will be a member of all VLANs. User Defined - When the port is in Trunk mode, it will be a member of the VLANs that are entered in this field.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step9.png",
            "alt": null,
            "note": null,
            "MLSummary": "Get Configured: When the port is in Trunk mode, it will be a member of the specified VLAN"
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 10,
            "text": "Enter the VLAN ID in the Untagged VLANs field. When the port is in General mode, it will be an untagged member of this VLAN.  Note: In this example, VLAN 1 is used.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step10.png",
            "alt": null,
            "note": "Note: In this example, User Defined is chosen and VLANs 30-40 are used.",
            "MLSummary": "Enter VLAN ID in Untagged VLANs field to make port an untagged member of VLAN 1."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 11,
            "text": "Enter the VLAN ID in the Tagged VLANs field. When the port is in General mode, it will be a tagged member of this VLAN.  Note: In this example, VLAN 30 is used.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step11.png",
            "alt": null,
            "note": "Note: In this example, VLAN 1 is used.",
            "MLSummary": "Add VLAN 30 to the Tagged VLANs field."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 12,
            "text": "Enter the VLAN ID in the Forbidden VLANs field. When the port is in General mode, the interface is not allowed to join the VLAN even from GVRP registration. When a port is not a member of any other VLAN, enabling this option on the port makes the port part of internal VLAN 4095 which is a reserved VLAN ID (VID).  Note: In this example, VLAN 40 is used.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step12.png",
            "alt": null,
            "note": "Note: In this example, VLAN 30 is used.",
            "MLSummary": "Prevent port from joining VLAN 40."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 13,
            "text": "Choose a VLAN ID from the General PVID drop-down list. When the port is in General mode, it will be a member of these VLANs. The default value is 1. ",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step13.png",
            "alt": null,
            "note": "Note: In this example, VLAN 40 is used.",
            "MLSummary": "Choose a VLAN ID from the General PVID drop-down list to become a member of the VLANs"
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 14,
            "text": "(Optional) Choose a VLAN ID from the Customer VLAN ID drop-down list. When the port is in Customer mode, it will be a member of this VLAN.  Note: In this example, VLAN 20 is chosen.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step14.png",
            "alt": null,
            "note": null,
            "MLSummary": "Choose a VLAN ID from the drop-down list."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 15,
            "text": "(Optional) Enter the VLAN ID in the Customer Multicast VLANs field. When the port is in Customer mode, it will be a member of this Multicast TV VLAN.  Note: In this example, no VLAN ID is entered.",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step15.png",
            "alt": null,
            "note": "Note: In this example, VLAN 20 is chosen.",
            "MLSummary": "Get configured."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 16,
            "text": "Click Apply then click Close. ",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step16.png",
            "alt": null,
            "note": "Note: In this example, no VLAN ID is entered.",
            "MLSummary": "Apply and Close."
        },
        {
            "section": "Configure VLAN Membership of an Interface",
            "step_number": 17,
            "text": "(Optional) Click Save to save settings to the startup configuration file.  You have now successfully assigned a port to one or more VLANs in the switch. Looking for more information on VLANs for your Cisco Business Switches? Check out any of the following links for more information.   Create VLANs Private VLAN Membership Access and Trunk Ports Protocol-Based Groups to VLAN Port to VLAN Settings Subnet-Based VLAN            Configure Multicast TV Group to VLAN Protocol-Based VLAN Groups Access Port Multicast TV VLAN Membership Customer Port Multicast TV VLAN Membership ",
            "src": "https://www.cisco.com/c/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/kmgmt-2517-configure-port-vlan-membership-cbs-step17.png",
            "alt": null,
            "note": null,
            "MLSummary": "Save settings and configure VLANs."
        }
    ]
}

    import { onMount } from 'svelte';
    import {
        type,
        category,
        searchValue,
        searchStore,
        search
    } from '$lib/components/search/searchStore.js';
    import { quintOut, quadInOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import MediaGridSvg from '$lib/assets/MediaGridSVG.svelte';
    import MediaRowSVG from '$lib/assets/MediaRowSVG.svelte';

    /** @type {import('./$types').PageServerData}*/
    export let data;

    let media = [...data.media.articles, ...data.media.videos];

    let warningCLI = false;
    // on mount check if the window has search params and filter the media object
    onMount(() => {
        // if window has search params of attributes filter the media object
        // Guest%20Access,Segmented%20Networks,Command%20Line%20Interface

        if (window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            const filter = urlParams.get('attributes');

            //if filter contains the value CLI then trigger boolean to true

            if (filter) {
                const filterArray = filter.split(',');
                if (filterArray.includes('CLI')) {
                    warningCLI = true;
                }
            }
        }

        $searchStore.data = media;
        $searchStore.filtered = media;
    });

    $: filteredMedia = $search.data.filter((m) => $type === 'All' || m.type === $type);
    $: filteredcategory = filteredMedia.filter(
        (m) => $category === 'All' || m.category === $category
    );
    $: format = true; // the format of the media, either all on y axis or x scrolling

    // function that changes chatbot-content-card-container from grid-template-columns: 1fr 1fr 1fr 1fr; to grid-template-columns: 1fr;
    function changeFormat() {
        if (format) {
            document.querySelector('.content-cards-container').style.gridTemplateColumns =
                'repeat(auto-fit, minmax(300px, 1fr))';
            document.querySelector('.content-cards-container').style.gridAutoFlow = 'row';

            format = false;
        } else {
            document.querySelector('.content-cards-container').style.gridTemplateColumns =
                '1fr 1fr 1fr 1fr';
            document.querySelector('.content-cards-container').style.gridAutoFlow = 'column';
            format = true;
        }
    }

    // When user clicks into the searchBar, set the media object to all media
    /** @param {MouseEvent} event */
    function resetMedia(event) {
        console.log('resetMedia has been run');

        console.log(
            'From reset media the event is           ',
            event.target.classList.contains('searchBar')
        );

        // if searchBar is in the classList of the event target, then set the media object to all media

        if (event.target.classList.contains('searchBar')) {
            document.querySelector('.searchButton').style.transform = 'translateX(100px)';
        }
        if (!event.target.classList.contains('searchBar')) {
            document.querySelector('.searchButton').style.transform = 'translateX(0px)';
        }

        searchFilter = false;
    }
</script>

<svelte:window on:click={resetMedia} />

<section>
    <div class="heroContainer">
        <div class="searchContainer">
            <svg
                class="searchButton"
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clip-path="url(#clip0_1580_847)">
                    <path
                        d="M10.3119 32.1883C13.1552 35.0293 16.9932 36.6512 21.0122 36.7099C25.0311 36.7687 28.9149 35.2596 31.84 32.5029L43.4186 44.0816L44.0815 43.4187L32.5028 31.8401C34.5836 29.6267 35.9663 26.8494 36.4781 23.855C36.9899 20.8606 36.6082 17.7817 35.3807 15.0029C34.1531 12.2241 32.1342 9.86848 29.5759 8.23026C27.0176 6.59203 24.0334 5.74379 20.9959 5.79145C17.9584 5.83912 15.0023 6.78058 12.4966 8.49826C9.99101 10.2159 8.04694 12.6337 6.9072 15.4497C5.76746 18.2656 5.48256 21.355 6.08808 24.3319C6.6936 27.3088 8.16271 30.0413 10.3119 32.1883ZM10.9748 10.9749C13.007 8.94264 15.5963 7.55865 18.4151 6.99795C21.2339 6.43725 24.1557 6.72503 26.811 7.82487C29.4663 8.92472 31.7358 10.7873 33.3325 13.1769C34.9292 15.5666 35.7815 18.3761 35.7815 21.2502C35.7815 24.1242 34.9292 26.9337 33.3325 29.3234C31.7358 31.7131 29.4663 33.5756 26.811 34.6754C24.1557 35.7753 21.2339 36.0631 18.4151 35.5024C15.5963 34.9417 13.007 33.5577 10.9748 31.5254C9.62001 30.1791 8.54486 28.5781 7.81119 26.8147C7.07751 25.0513 6.69981 23.1601 6.69981 21.2502C6.69981 19.3402 7.07752 17.4491 7.81119 15.6856C8.54487 13.9222 9.62001 12.3212 10.9748 10.9749Z"
                        fill="url(#paint0_linear_1580_847)"
                    />
                </g>
                <defs>
                    <linearGradient
                        id="paint0_linear_1580_847"
                        x1="24.9297"
                        y1="5.78955"
                        x2="24.9297"
                        y2="44.0816"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="#00BCEB" />
                        <stop offset="0.445546" stop-color="#1482DB" />
                        <stop offset="1" stop-color="#0169C2" />
                    </linearGradient>
                    <clipPath id="clip0_1580_847">
                        <rect width="50" height="50" fill="white" />
                    </clipPath>
                </defs>
            </svg>

            <input
                class="searchBar"
                type="search"
                on:click={(event) => resetMedia(event)}
                on:keydown
                placeholder="Search All Media"
                bind:value={$searchValue}
            />

            <!-- <pre>{JSON.stringify($searchStore.data, null, 2)}</pre> -->
        </div>

        <div class="filterRow" on:click={(event) => resetMedia(event)} on:keydown>
            <select bind:value={$category} class="filterSelect">
                <option value="All">All Categories</option>
                <option value="Design">Design</option>
                <option value="Configuration">Configuration</option>
                <option value="Maintain and Operate TechNotes">Maintain and Operate</option>
                <option value="Upgrade">Upgrade</option>
            </select>
            <select bind:value={$type} class="filterSelect">
                <option value="All">Articles + Videos</option>
                <option value="Articles">Articles</option>
                <option value="Videos">Videos</option>
            </select>

            <!-- Button that changes the format from x scrolling to all on y axis -->
            <div class="mediaFormat">
                {#if format}
                    <button
                        on:click={changeFormat}
                        title="Change the display of  media items to a grid view"
                    >
                        <svg
                            width="44"
                            height="44"
                            viewBox="0 0 44 44"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="20" height="20" rx="3" fill="#999899" />
                            <rect y="24" width="20" height="20" rx="3" fill="#999899" />
                            <rect x="24" y="24" width="20" height="20" rx="3" fill="#999899" />
                            <rect x="24" width="20" height="20" rx="3" fill="#999899" />
                        </svg>
                    </button>
                {:else if !format}
                    <button
                        on:click={changeFormat}
                        title="Change the display of media items to a row view"
                    >
                        <svg
                            width="68"
                            height="20"
                            viewBox="0 0 68 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect width="20" height="20" rx="3" fill="#999899" />
                            <rect x="24" width="20" height="20" rx="3" fill="#999899" />
                            <rect x="48" width="20" height="20" rx="3" fill="#999899" />
                        </svg>
                    </button>
                {/if}
            </div>
        </div>

        {#if warningCLI}
            <div class="warningCLI" transition:slide>
                <p>
                    <strong> <span class="warningHeader">Warning:</span></strong><br />
                    <br />These devices do not utilize IOS or IOS XE. The commands are similar but
                    have key differences. Please see this article for more information:
                    <a
                        href="https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-12-2/200000-CLIs-for-12-2-58.html"
                        rel="noopener noreferrer"
                        target="_blank">Cisco CLI Differences</a
                    >
                </p>
                <button style="float:right;" on:click={() => (warningCLI = false)}
                    >I understand</button
                >
            </div>
        {/if}
        <div class="content-cards-container">
            {#if $search.filtered.length > 0}
                {#each $search.filtered as media, i (i)}
                    {#if media.type === 'Videos'}
                        <MediaCardVideo {media} />
                    {/if}
                    {#if media.type === 'Articles'}
                        <MediaCardArticle {media} />
                    {/if}
                {/each}
            {:else if $search.filtered.length === 0}
                <div
                    class="no-results-msg"
                    in:slide={{ duration: 520, delay: 0, easing: quadInOut }}
                >
                    <p><strong>No results.</strong></p>
                </div>
            {:else}
                {#each filteredcategory as media, i (i)}
                    {#if media.type === 'Videos'}
                        <MediaCardVideo {media} />
                    {/if}
                    {#if media.type === 'Articles'}
                        <MediaCardArticle {media} />
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
</section>


<style>
    .filterRow select {
        justify-content: flex-start;
        align-items: center;
    }

    .mediaFormat button {
        background: rgba(255, 255, 255, 0);
    }

    .warningCLI {
        background-color: white;
        padding: 1em;
        margin: 1em;
        height: 150px;
        border-left: var(--theme-warning) 5px solid;
        background-color: var(--menu-background-gray);
    }
    .warningHeader {
        color: var(--theme-warning);
    }

    .searchButton {
        /* display:contents; */
        transition: all 0.85s ease;
    }

    .searchContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1em 0;
    }
    .searchBar {
        width: 450px;
        height: 50px;
        border: var(--border-gray);
        border-radius: 30px;
        padding: 0 1em;
        margin: 1em;
        transition: all 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6);
        z-index: 10;
    }

    .filterRow select {
        justify-content: flex-start;
        align-items: center;
        background-color: #ffffff00;
    }

    .filterRow {
        display: flex;
        height: 80px;
        margin: 0 1em;
    }
    .mediaFormat {
        margin-left: auto;
        align-self: center;
    }
    .mediaFormat button {
        padding: 1em;
        transition: all 0.85s ease;
    }
    .mediaFormat button:hover {
        cursor: pointer;
        background-color: var(--white);
        border-radius: 10px;
    }
    select:hover {
        background-color: var(--btn-blue-1);
        color: white;
    }
    select {
        padding: 0.5em;
        /* font-size: 1.15em; */
        transition: all 1s ease;
        transition: all 0.08s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        color: var(--font-gray);
    }
    select:nth-of-type(1) {
        margin: 1em 0 1em 0;

        border: var(--font-gray) 1px solid;
        border-radius: 30px 0 0 30px;
    }

    select:nth-of-type(2) {
        margin: 1em 0 1em 0;

        border: var(--text-color-black3) 1px solid;
        border-radius: 0 30px 30px 0;
        width: 220px;
    }
    ::marker {
        color: var(--step-blue-shade);
    }
    .filterRow {
        display: flex;
        /* height: 100px; */
        margin: 0 1em;
    }
    .mediaFormat {
        margin-left: auto;
        align-self: center;
    }

    select:hover {
        background-color: #f2f2f2;
    }
    select {
        padding: 0.5em;
    }
    select:nth-of-type(1) {
        margin: 1em 0 1em 1em;
        color: #575757;

        border: #575757 1px solid;
        border-radius: 30px 0 0 30px;
    }
    select::before {
        content: 'Category';
        color: red;
    }
    select:nth-of-type(2) {
        margin: 1em 0 1em 0;
        color: #575757;

        border: #575757 1px solid;
        border-radius: 0 30px 30px 0;
        width: 170px;
    }
    ::marker {
        color: blue;
        font-size: 5.5em;
    }
    section {
        margin-top: 15em;
    }

    .content-cards-container {
        display: grid;
        grid-auto-flow: column;
        gap: 1em;
        padding-bottom: 2em;
        overflow-y: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        justify-content: start;
        scroll-behavior: smooth;
        scroll-snap-align: start;
        justify-items: center;
    }

    div.warningCLI > p > strong {
        color: var(--text-color-red);
    }

    @media only screen and (max-width: 768px) {
        select {
            font-size: 0.74em;
            padding: 0;
        }
    }
    .filterRow {
        margin: 0;
    }
    @media only screen and (max-width: 768px) {
        select {
            font-size: 0.74em;
        }

        .filterRow {
            margin: 0;
            /* height: 100px; */
            /* margin: 0 1em; */
        }
    }

   
</style>
