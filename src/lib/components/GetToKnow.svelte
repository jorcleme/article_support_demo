<script>
    import { UserPreferences } from './store.js';
    import { slide } from 'svelte/transition';
    import { afterUpdate, onMount, tick } from 'svelte';
    import Breadcrumb from './Breadcrumb.svelte';
    import FAQ from './FAQ.svelte';
    import { BreadcrumbStore, CurrentStep } from './store.js';
    import { _ as format } from 'svelte-i18n';

    export let open;

    let brownFieldBoolean = false;

    if ($UserPreferences.network === 'existing-network') {
        brownFieldBoolean = true;
    }

    function handleDropdownClick() {
        if (!open) {
            return;
        } else {
            $BreadcrumbStore.step1complete = true;
            $BreadcrumbStore.currentStep = 1;
            CurrentStep.setStepOne();
        }
        CurrentStep.persistStep($CurrentStep);
        BreadcrumbStore.saveState($BreadcrumbStore);
    }

    function handleKeyDown(event) {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        console.log(event);
    }

    let inputIsChecked;
    $: {
        console.log('inputIsChecked: ', inputIsChecked);
    }

    let elements = [
        { id: 'plugId', xStart: 15, yStart: 15, xEnd: -57, yEnd: -35 },
        {
            id: 'opacityElement',
            xStart: 0,
            yStart: 0,
            xEnd: 0,
            yEnd: 0,
            opacityStart: 1,
            opacityEnd: 0.35
        },
        {
            id: 'opacityUpElement',
            xStart: 0,
            yStart: 0,
            xEnd: 0,
            yEnd: 0,
            opacityStart: 0,
            opacityEnd: 1
        },
        {
            id: 'scaleElement',
            xStart: 50,
            yStart: 50,
            xEnd: 0,
            yEnd: 0,
            scaleStart: 1,
            scaleEnd: 6
        }

        // Add more elements as needed
    ];

    const refs = new Map();

    function setRefs(node, id) {
        if (node) {
            refs.set(id, node);
        } else {
            refs.delete(id);
        }
    }

    function bindRef(node, { id }) {
        setRefs(node, id);
        return {
            destroy() {
                setRefs(null, id);
            }
        };
    }

    async function onScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollPosition = scrollTop / (scrollHeight - clientHeight);

        await tick();

        for (const el of elements) {
            const currentElement = refs.get(el.id);
            if (!currentElement) continue;

            const currentProgress = scrollPosition;
            const translateX = el.xStart - (el.xStart - el.xEnd) * currentProgress;
            const translateY = el.yStart - (el.yStart - el.yEnd) * currentProgress;

            let transform = `translate(${translateX}px, ${translateY}px)`;

            if (el.opacityUpElement !== undefined && el.opacityUpElement !== undefined) {
                const currentOpacity =
                    el.opacityUpElement -
                    (el.opacityUpElement - el.opacityUpElement) * currentProgress;
                currentElement.style.opacity = currentOpacity;
            }
            currentElement.style.transform = transform;

            if (el.opacityStart !== undefined && el.opacityEnd !== undefined) {
                const currentOpacity =
                    el.opacityStart - (el.opacityStart - el.opacityEnd) * currentProgress;
                currentElement.style.opacity = currentOpacity;
            }
        }
    }

    let url = '';
    let height = '400px';
    let maxHeight = '400px';
    let jumpToAllRoute = false;
    onMount(async () => {
        window.addEventListener('scroll', scrollHandler);
        const wordsPerMinute = 200;
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li');

        elements.forEach((element) => {
            totalWords += element.innerText.split(' ').length;
        });

        totalTime = Math.ceil(totalWords / wordsPerMinute);

        return () => window.removeEventListener('scroll', scrollHandler);
    });

    let windowWidth;
    let mobileWindowSize;
    afterUpdate(() => {
        mobileWindowSize = jumpToAllRoute && windowWidth < 1024;
    });

    function scrollHandler() {
        onScroll();
    }
    let totalWords = 0;
    let totalTime = 0;
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="container" id="get-to-know">
    <details class="dropdown" bind:open>
        <summary class="dropdown-summary" on:click={handleDropdownClick} on:keydown={handleKeyDown}>
            <div class="row-flex">
                <Breadcrumb
                    --icon-height="auto"
                    --icon-width="3.5rem"
                    name="gettoknow"
                    path="get-to-know"
                />
                <div class="title">{$format('get_to_know_header')}</div>
            </div>
            <div class="row-flex">
                <svg
                    class:drop={open === true}
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
            <div class="video-card">
                <div class="video-wrapper">
                    <iframe
                        loading="lazy"
                        class="vid-card-iframe"
                        src="https://www.youtube.com/embed/MORtCCPvibc?si=zpckqo4mStUhTHbq"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                        webkitallowfullscreen
                        mozallowfullscreen
                    />
                </div>
                <div class="video-text-content">
                    <h3 class="video-card-title">Unbox the Catalyst 1200</h3>
                    <p id="video-card-description">
                        Unbox the Cisco Catalyst 1200 and familiarize yourself with all of its
                        impressive features
                    </p>
                </div>
            </div>
            <section class="product-contents">
                <h2 class="section-title">{$format('get_to_know_whats_in_the_box_header')}</h2>
                <div>
                    <ul>
                        <li>
                            {$format('headers_h1', {
                                values: { app_series_name: 'Catalyst 1200 Series Switch' }
                            })}
                        </li>
                        <li>{$format('whats_in_the_box_item1')}</li>
                        <li>{$format('whats_in_the_box_item2')}</li>
                        <li>{$format('whats_in_the_box_item3')}</li>
                        <li>{$format('whats_in_the_box_item4')}</li>
                        <li>{$format('whats_in_the_box_item5')}</li>
                    </ul>
                </div>
            </section>
            <section>
                <h2 class="section-title">{$format('get_to_know_video_header')}</h2>
                <div style="display: flex; justify-content: center;">
                    <div class="video-card">
                        <div class="video-wrapper">
                            <iframe
                                class="vid-card-iframe"
                                src="https://www.youtube.com/embed/_Vqdkwu3m1g"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                                mozallowfullscreen
                                webkitallowfullscreen
                            />
                        </div>

                        <div class="video-text-content">
                            <h3 class="video-card-title">Get To Know the Catalyst 1200</h3>
                            <p id="video-card-description">
                                Get to know your new Catalyst 1200. Follow along our video and get
                                the most out of your network
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="prepping-product">
                <h2 class="section-title">{$format('get_to_know_get_connected_header')}</h2>
                <div class="prepping-directions">
                    <h3 style="color:white;margin-top:0;">
                        {$format('get_to_know_get_connected_p')}
                    </h3>
                    <p>
                        {$format('get_to_know_get_connected_text')}
                        <span class="underline" style="color: var(--theme-success);"
                            >{$format('get_configured_title')}</span
                        >
                    </p>
                </div>
            </section>
            <section class="plug-in-diagram">
                <div class="diagram">
                    <svg
                        width="298"
                        height="290"
                        viewBox="0 0 298 290"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {#each elements as element (element.id)}
                            {#if element.id === 'opacityUpElement'}
                                <g id="opacityUpElement" use:bindRef={{ id: element.id }}>
                                    <g use:bindRef={{ id: element.id }}>
                                        <path
                                            d="M180.593 252.521H254.228C254.472 252.521 254.706 252.425 254.879 252.255C255.052 252.084 255.149 251.852 255.149 251.611V193.332C255.149 193.091 255.052 192.859 254.879 192.689C254.706 192.518 254.472 192.422 254.228 192.422H180.593C180.349 192.422 180.115 192.518 179.942 192.689C179.769 192.859 179.672 193.091 179.672 193.332V251.611C179.672 251.852 179.769 252.084 179.942 252.255C180.115 252.425 180.349 252.521 180.593 252.521ZM181.513 194.243H253.308V202.135H181.513V194.243ZM181.513 203.956H253.308V250.7H181.513V203.956Z"
                                            fill="black"
                                        />
                                        <path
                                            d="M187.956 199.403C188.634 199.403 189.184 198.86 189.184 198.189C189.184 197.518 188.634 196.975 187.956 196.975C187.278 196.975 186.729 197.518 186.729 198.189C186.729 198.86 187.278 199.403 187.956 199.403Z"
                                            fill="black"
                                        />
                                        <path
                                            d="M195.32 199.403C195.998 199.403 196.547 198.86 196.547 198.189C196.547 197.518 195.998 196.975 195.32 196.975C194.642 196.975 194.093 197.518 194.093 198.189C194.093 198.86 194.642 199.403 195.32 199.403Z"
                                            fill="black"
                                        />
                                        <path
                                            d="M202.683 199.403C203.361 199.403 203.911 198.86 203.911 198.189C203.911 197.518 203.361 196.975 202.683 196.975C202.006 196.975 201.456 197.518 201.456 198.189C201.456 198.86 202.006 199.403 202.683 199.403Z"
                                            fill="black"
                                        />
                                    </g>
                                </g>
                            {/if}
                        {/each}
                        <path
                            d="M85.7036 33.1372L294.5 2M57.5094 61.0299L134.5 89.5M56.8965 33.1372L134.5 1"
                            stroke="#68B631"
                            stroke-width="0.5"
                        />
                        <path d="M67.6222 46.1741H30.8472V47.9932H67.6222V46.1741Z" fill="black" />
                        <path
                            d="M1.42719 57.6946H74.9773C75.2211 57.6945 75.4549 57.5987 75.6273 57.4281C75.7997 57.2576 75.8966 57.0263 75.8967 56.7851V37.3815C75.8966 37.1403 75.7997 36.909 75.6273 36.7384C75.4549 36.5678 75.2211 36.472 74.9773 36.4719H1.42719C1.18337 36.472 0.949566 36.5678 0.777163 36.7384C0.604761 36.909 0.507877 37.1403 0.507812 37.3815V56.7851C0.507877 57.0263 0.604761 57.2576 0.777163 57.4281C0.949566 57.5987 1.18337 57.6945 1.42719 57.6946ZM2.34657 38.291H74.0579V55.8755H2.34657V38.291Z"
                            fill="black"
                        />
                        <path
                            d="M8.78199 48.2963C9.459 48.2963 10.0078 47.7533 10.0078 47.0836C10.0078 46.4138 9.459 45.8708 8.78199 45.8708C8.10498 45.8708 7.55615 46.4138 7.55615 47.0836C7.55615 47.7533 8.10498 48.2963 8.78199 48.2963Z"
                            fill="black"
                        />
                        <path
                            d="M16.137 48.2963C16.814 48.2963 17.3628 47.7533 17.3628 47.0836C17.3628 46.4138 16.814 45.8708 16.137 45.8708C15.46 45.8708 14.9111 46.4138 14.9111 47.0836C14.9111 47.7533 15.46 48.2963 16.137 48.2963Z"
                            fill="black"
                        />
                        <path
                            d="M23.4924 48.2963C24.1694 48.2963 24.7183 47.7533 24.7183 47.0836C24.7183 46.4138 24.1694 45.8708 23.4924 45.8708C22.8154 45.8708 22.2666 46.4138 22.2666 47.0836C22.2666 47.7533 22.8154 48.2963 23.4924 48.2963Z"
                            fill="black"
                        />
                        <rect
                            x="57.0898"
                            y="33.031"
                            width="28.42"
                            height="28.1054"
                            stroke="#68B631"
                        />
                        <path
                            d="M83.6777 61.03L295.905 89.5291"
                            stroke="#68B631"
                            stroke-width="0.5"
                        />
                        <rect
                            x="134.612"
                            y="1"
                            width="161.292"
                            height="88.5289"
                            fill="#D2D2D2"
                            stroke="#68B631"
                        />
                        <mask
                            id="mask0_662_1085"
                            style="mask-type:alpha"
                            maskUnits="userSpaceOnUse"
                            x="134"
                            y="1"
                            width="162"
                            height="89"
                        >
                            <rect
                                x="134.612"
                                y="1"
                                width="161.292"
                                height="88.5289"
                                fill="#D9D9D9"
                            />
                        </mask>

                        <g mask="url(#mask0_662_1085)">
                            <path
                                d="M305.912 29.7024L-57.8721 126.196V54.4994L305.912 -41.9939V29.7024Z"
                                fill="white"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M118.238 -149.435L-245.961 -52.8313L-57.8724 54.4988L305.749 -42.2732L118.238 -149.435Z"
                                fill="white"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linejoin="round"
                                style="z-index: 1"
                            />

                            <path
                                d="M280.487 13.7851L252.928 20.9548V-1.0318L280.487 -8.20142V13.7851Z"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M271.518 23.9046L264.665 25.6638C264.398 25.7322 264.118 25.7391 263.847 25.6839C263.577 25.6287 263.322 25.513 263.104 25.3455C262.885 25.178 262.709 24.9633 262.587 24.7177C262.465 24.4722 262.402 24.2023 262.402 23.9288V19.3429L272.876 16.6543V22.1695C272.875 22.5668 272.742 22.9529 272.496 23.2669C272.25 23.581 271.906 23.8053 271.518 23.9046Z"
                                fill="#0D274D"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M240.653 24.062L213.094 31.2316V9.24506L240.653 2.07544V24.062Z"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M232.053 33.8945L225.202 35.6538C224.934 35.7222 224.655 35.7291 224.384 35.6739C224.113 35.6187 223.859 35.503 223.64 35.3355C223.422 35.168 223.245 34.9533 223.123 34.7077C223.002 34.4622 222.939 34.1923 222.938 33.9188V29.3329L233.411 26.6443V32.1595C233.411 32.5568 233.278 32.9428 233.032 33.2569C232.786 33.5709 232.442 33.7952 232.053 33.8945Z"
                                fill="#0D274D"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M190.259 39.1082L-30.8716 97.5174V75.3462L190.259 16.937V39.1082Z"
                                fill="white"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M158.398 25.7881V47.297"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M145.141 36.6279L138.29 38.3872C138.022 38.4556 137.742 38.4625 137.472 38.4073C137.201 38.3521 136.947 38.2364 136.728 38.0689C136.51 37.9014 136.333 37.6867 136.211 37.4411C136.09 37.1955 136.026 36.9257 136.026 36.6522V32.0663L146.499 29.3777V34.8929C146.499 35.2902 146.366 35.6762 146.12 35.9902C145.874 36.3043 145.53 36.5286 145.141 36.6279Z"
                                fill="#0D274D"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M177.734 27.5554L170.883 29.3146C170.615 29.383 170.336 29.3899 170.065 29.3347C169.794 29.2795 169.54 29.1638 169.322 28.9963C169.103 28.8288 168.926 28.6141 168.805 28.3686C168.683 28.123 168.62 27.8531 168.62 27.5796V22.9928L179.092 20.3042V25.8212C179.092 26.2184 178.959 26.6041 178.713 26.918C178.467 27.2319 178.123 27.4561 177.734 27.5554Z"
                                fill="#0D274D"
                                stroke="#0B2750"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />

                            {#each elements as element (element.id)}
                                {#if element.id === 'plugId'}
                                    <g id="plugId" use:bindRef={{ id: element.id }}>
                                        <path
                                            d="M220.742 78.8423L200.14 66.2069L200.14 54.1017L206.171 52.1715L206.171 49.945L209.839 48.6091L209.839 46.2261L217.176 43.7102L217.176 45.2544L220.742 43.71L223.275 45.2544L225.976 44.6006L242.138 53.7561L242.138 67.8671L220.742 78.8423Z"
                                            fill="white"
                                            class="plug"
                                        />
                                        <path
                                            d="M200.14 54.1017L200.14 66.2069L220.742 78.8423M200.14 54.1017L220.742 64.4774M200.14 54.1017L206.171 52.1715L206.171 49.945L209.839 48.6091L209.839 46.2261L217.176 43.7102L217.176 45.2544L220.742 43.71L223.275 45.2544L225.976 44.6006L242.138 53.7561M220.742 64.4774L220.742 78.8423M220.742 64.4774L242.138 53.7561M220.742 78.8423L242.138 67.8671L242.138 53.7561"
                                            stroke="#1E4471"
                                            stroke-width="2"
                                            stroke-linejoin="round"
                                            stroke-linecap="round"
                                            class="plug"
                                        />
                                        <path
                                            d="M226.017 55.9146L234.733 51.9949L216.904 44.1555L209.772 46.5073L226.017 55.9146Z"
                                            fill="white"
                                            stroke="#1E4471"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="plug"
                                        />

                                        <path
                                            d="M248.19 150.518C249.007 89.9973 245.432 69.9874 232.867 66.9556"
                                            stroke="#1E4471"
                                            stroke-width="15"
                                            stroke-linecap="round"
                                            class="plug"
                                        />
                                    </g>
                                {/if}

                                {#if element.id === 'plugId'}
                                    <path
                                        d="M172.007 34.7547L182.09 55.5316L195.042 36.4117L172.007 34.7547ZM194.484 47.5651L188.032 43.1941L185.788 46.5058L192.241 50.8768L194.484 47.5651Z"
                                        fill="url(#paint0_linear_662_1085)"
                                        use:bindRef={{ id: 'opacityElement' }}
                                    />
                                {/if}
                            {/each}
                        </g>
                        <path
                            d="M138.718 272.369C134.298 272.369 129.922 271.508 125.839 269.835C121.756 268.162 118.045 265.709 114.92 262.618C111.795 259.526 109.316 255.856 107.625 251.816C105.933 247.777 105.063 243.447 105.063 239.075L105.063 80.927C105.063 72.0968 101.517 63.6283 95.2057 57.3845C88.8943 51.1406 80.3343 47.6329 71.4087 47.6329"
                            stroke="#1E4471"
                            stroke-width="2"
                            stroke-miterlimit="10"
                        />
                        <path
                            d="M144.541 279.702H215.458V286.138H180.975V290H253.845V286.138H219.362V279.702H290.28C292.177 279.7 293.996 278.953 295.338 277.626C296.68 276.298 297.435 274.499 297.437 272.621V185.083C297.435 183.206 296.68 181.406 295.338 180.079C293.996 178.751 292.177 178.005 290.28 178.003H144.541C142.643 178.005 140.824 178.751 139.482 180.079C138.14 181.406 137.386 183.206 137.384 185.083V272.621C137.386 274.499 138.14 276.298 139.482 277.626C140.824 278.953 142.643 279.7 144.541 279.702ZM141.288 185.083C141.288 184.23 141.631 183.412 142.241 182.808C142.851 182.205 143.678 181.866 144.541 181.865H290.28C291.142 181.866 291.969 182.205 292.579 182.808C293.189 183.412 293.532 184.23 293.533 185.083V260.392H141.288V185.083ZM141.288 264.254H293.533V272.621C293.532 273.475 293.189 274.293 292.579 274.896C291.969 275.499 291.142 275.839 290.28 275.84H144.541C143.678 275.839 142.851 275.499 142.241 274.896C141.631 274.293 141.288 273.475 141.288 272.621V264.254Z"
                            fill="black"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_662_1085"
                                x1="195.79"
                                y1="47.0912"
                                x2="171.047"
                                y2="37.1442"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#68B631" />
                                <stop offset="0.48623" stop-color="#6BBF4B" />
                                <stop offset="1" stop-color="#499C0E" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </section>
            {#if brownFieldBoolean}
                <div class="infoBrownfield" transition:slide>
                    <p>
                        <strong>
                            <span class="warningHeader">Brownfield Deployments:</span></strong
                        ><br />
                    </p>
                    <p>Here are 3 tips for deploying a switch to an existing network:</p>
                    <ul>
                        <li>
                            <p>
                                Plan the deployment: Before deploying a new switch into an existing
                                network, it is crucial to plan the deployment. This includes
                                identifying the location of the switch, the number of users that
                                will be connected to it, and the type of devices that will be
                                connected to it. In mixed vendor environments, consider the
                                compatibility between the new switch and existing devices to avoid
                                potential interoperability issues. For hybrid infrastructures,
                                ensure seamless connectivity between on-premises and cloud-based
                                components. Planning helps ensure that the switch is configured
                                correctly and meets the needs of the network.
                            </p>
                        </li>

                        <li>
                            <p>
                                Test the switch before deployment: Before deploying the switch into
                                the existing network, it is important to test it first. This will
                                help to ensure that the switch is working properly and that it is
                                configured correctly. Testing can include verifying that the switch
                                is connected to the correct VLAN, that all ports are functioning
                                correctly, and that the switch is configured to support the required
                                protocols. In mixed vendor settings, validate the switch's
                                interoperability with other vendors' devices. For hybrid networks,
                                check the switch's ability to support communication between
                                on-premises and cloud resources.
                            </p>
                        </li>

                        <li>
                            <p>
                                Document the deployment: After deploying the switch into the
                                existing network, it is important to document the deployment. This
                                includes recording the switch's location, its configuration, and the
                                devices that are connected to it. This information can be used to
                                troubleshoot any issues that may arise in the future and to help
                                ensure that the network is running efficiently. Additionally, it is
                                important to update any network diagrams or documentation to reflect
                                the new switch's deployment. In mixed vendor environments and hybrid
                                infrastructures, document any specific configurations or settings
                                required to maintain compatibility and connectivity.
                            </p>
                        </li>
                    </ul>

                    <button class="btn" on:click={() => (brownFieldBoolean = false)}
                        >{$format('acknowledgment_btn')}</button
                    >
                </div>
            {/if}
            <FAQ />
        </div>
    </details>
</div>

<style>
    .btn {
        float: right;
        margin: 0 0 0.5em;
        padding: 0.5em 1.5em;
        border-radius: 10px;
        background-color: var(--btn-blue-1);
        color: #efefef;
        font-family: CiscoSansTTBold;
        cursor: pointer;
        transition: all 0.2s ease-in;
        box-shadow: #959da533 0 8px 24px;
    }

    .btn:hover {
        background-color: var(--btn-hover-main);
    }
    .underline {
        text-decoration: underline;
        text-decoration-thickness: 2px;
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

    details {
        padding: 1em 1.5em;
        background: #d2d3d7;
        border-radius: 15px;
        -webkit-transition: all 0.25s ease-in;
        -o-transition: all 0.25s ease-in;
        transition: all 0.25s ease-in;
        margin: 1em;
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
        width: inherit;
        margin-bottom: 1em;
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
        justify-content: space-around;
        align-items: flex-start;
        flex: 1;
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

    .infoBrownfield {
        background-color: white;
        padding: 1em;
        margin: 1em 0;
        min-height: 250px;
        border-left: var(--theme-success) 5px solid;
        background-color: var(--menu-background-gray);
    }
    .warningHeader {
        color: var(--theme-success);
    } /* Hover section */
    .video-card:hover {
        box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
        transition: all 0.5s ease-in-out;
    }

    .product-contents-list ul li::before {
        font-weight: bold;
    }

    .product-contents-list ul li {
        font-size: calc(var(--font-size-base) - 1px);
    }

    .prepping-product {
        font-family: inherit;
        font-size: var(--font-size-base);
    }

    .prepping-directions {
        background-color: var(--cisco-ocean-blue);
        border-radius: 12px;
        padding: 20px;
        font-size: var(--font-size-base);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }

    .prepping-directions p {
        color: var(--cisco-blue);
        margin: 0 0 1em 0;
        font-weight: 700;
    }

    .plug-in-diagram {
        margin: 2em 0;
    }

    .diagram {
        margin: 0 auto;
    }
    .plug-in-diagram svg {
        width: 100%;
        height: auto;
    }
    .section-title {
        font-weight: 700;
        color: var(--text-color-black2);
        font-size: var(--font-size-md);
    }
    #plugId {
        /* animation for plug to move toward the switch */
        transform: translateX(-80px) translateY(-80px);
    }

    @keyframes plug {
        0% {
            transform: translateX(15px) translateY(15px);
        }
        100% {
            transform: translateX(-5px) translateY(-15px);
        }
    }
</style>
