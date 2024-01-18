<script>
    import { slide, fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import { ExpGradeSelected } from '$lib/components/store.js';
    import lightlyGuidedImage from '$lib/assets/assing-port-to-vlan-dall-e-2.png';
    import fullyGuidedImage from '$lib/assets/assing-port-to-vlan-dall-e.png';
    import daellEBlankImage from '$lib/assets/dall-e-blank.png';

    // $ExpGradeSelected ===
    $: console.log('ExpGradeSelected is:', $ExpGradeSelected);
    let showOptions = false;

    const dispatch = createEventDispatcher();

    function stripStylingAndExpand(steps) {
        steps.forEach((step) => {
            // Remove styling from the step
            step.classList.remove('your-styling-class');

            // Expand the content
            step.style.display = 'block';
        });
    }
    function handleSelection(option) {
        selectedOption = option;
        showOptions = false;
        console.log(selectedOption);

        $ExpGradeSelected = option.value;

        const articleHeadersExp = document.querySelectorAll('.articleHeadersExp');
        const detailsGetSupport = document.querySelector('.detailsGetSupport');
        const steps = document.querySelectorAll('.custom-details');
        const stepContainer = document.querySelector('.stepContainer');
        const cdtNote = document.querySelectorAll('.cdt-Note');
        const stepNumberBreadcrumb = document.querySelectorAll('.stepNumberBreadcrumb');
        const articleHero = document.querySelector('.article-Hero');
        // const lightlyGuidedImage = '$lib/assets/assing-port-to-vlan-dall-e-2.png';
        // const fullyGuidedImage = '$lib/assets/assing-port-to-vlan-dall-e.png';
        // const daellEBlankImage = '$lib/assets/dall-e-blank.png';

        // Reset all styles before applying new ones
        stripStylingAndExpand(steps);
        try {
            detailsGetSupport.removeAttribute('style');
        } catch {
            console.log('no detailsGetSupport found');
        }

        stepContainer.removeAttribute('style');
        stepContainer.classList.remove('stepContainerDocumentStyle');
        cdtNote.forEach((note) => note.removeAttribute('style'));
        stepNumberBreadcrumb.forEach((step) => step.removeAttribute('style'));
        articleHero.removeAttribute('style');

        switch (option.value) {
            case 'video':
                dispatch('videoSelected', { expanded: true });
                break;
            case 'lightlyguided':
                articleHero.style.backgroundImage = `url(${lightlyGuidedImage})`;
                steps.forEach((step) => {
                    step.style.background = '#f5f5f5';
                    step.style.border = '#d2d2d2 1px solid';
                });

                articleHeadersExp.forEach((header) => {
                    header.style.color = '#2b5592';
                });
                break;
            case 'fullyguided':
                articleHero.style.backgroundImage = `url(${fullyGuidedImage})`;
                try {
                    detailsGetSupport.style.marginTop = '-1em 0 3em 0';
                    detailsGetSupport.style.borderRadius = '0 0 25px 25px';
                } catch {
                    console.log('no detailsGetSupport ');
                }

                steps.forEach((step) => {
                    step.style.background = 'white';
                    step.style.border = '#d2d2d2 1px solid';
                });

                articleHeadersExp.forEach((header) => {
                    header.style.color = '#2b5592';
                });
                break;
            case 'defaultdocumentstyle':
                stepContainer.style.margin = '0 1.40em';
                stepContainer.classList.toggle('stepContainerDocumentStyle');

                steps.forEach((step) => {
                    step.style.display = 'block';
                    step.style.background = 'none';
                    step.style.border = 'none';
                    dispatch('fullyGuided', { expanded: true });
                });

                stepNumberBreadcrumb.forEach((step) => {
                    step.style.background = 'none';
                    step.style.color = 'black';
                    step.style.fontSize = '1.5em';
                });
                articleHeadersExp.forEach((header) => {
                    header.style.color = '#333';
                });

                articleHero.style.background = `url(${daellEBlankImage})`;
                articleHero.style.margin = '0 3em';

                // detailsGetSupport.style.marginTop = '12em';
                // detailsGetSupport.style.borderRadius = '0.5em';
                // detailsGetSupport.style.margin = '0 3em';

                break;
            default:
                console.error('Invalid option value provided.');
        }
    }

    // onMount(() => {
    //     handleSelection(options.find((option) => option.label === 'Fully Guided'));
    // });

    const options = [
        {
            label: 'Video',
            value: 'video',
            svg: `
        <svg in:fade width="45" height="45" style="margin:0 ;" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1844_932)">
<path d="M19.125 27.422C19.1904 27.4219 19.2549 27.4067 19.3134 27.3775L28.3134 22.8775C28.3836 22.8425 28.4426 22.7886 28.4838 22.722C28.5251 22.6553 28.5469 22.5785 28.5469 22.5001C28.5469 22.4217 28.5251 22.3449 28.4838 22.2782C28.4426 22.2115 28.3836 22.1577 28.3134 22.1227L19.3134 17.6227C19.2491 17.5905 19.1777 17.5753 19.1058 17.5785C19.034 17.5818 18.9642 17.6033 18.903 17.6411C18.8418 17.679 18.7914 17.7318 18.7564 17.7946C18.7214 17.8574 18.7031 17.9282 18.7031 18.0001V27.0001C18.7031 27.0555 18.7139 27.1104 18.7351 27.1616C18.7563 27.2128 18.7874 27.2593 18.8266 27.2985C18.8658 27.3377 18.9123 27.3688 18.9635 27.39C19.0147 27.4111 19.0696 27.422 19.125 27.422ZM19.5469 18.6826L27.1818 22.5001L19.5469 26.3176V18.6826Z" fill="black"/>
<path d="M5.625 37.5469H39.375C39.4869 37.5468 39.5942 37.5024 39.6733 37.4233C39.7524 37.3442 39.7968 37.2369 39.7969 37.125V7.875C39.7968 7.76312 39.7524 7.65583 39.6733 7.57672C39.5942 7.49761 39.4869 7.45315 39.375 7.45312H5.625C5.51312 7.45315 5.40583 7.49761 5.32672 7.57672C5.24761 7.65583 5.20315 7.76312 5.20312 7.875V37.125C5.20315 37.2369 5.24761 37.3442 5.32672 37.4233C5.40583 37.5024 5.51312 37.5468 5.625 37.5469ZM18.7031 36.7031H12.7969V33.0469H18.7031V36.7031ZM25.4531 36.7031H19.5469V33.0469H25.4531V36.7031ZM32.2031 36.7031H26.2969V33.0469H32.2031V36.7031ZM38.9531 36.7031H33.0469V33.0469H38.9531V36.7031ZM33.0469 8.29688H38.9531V11.9531H33.0469V8.29688ZM26.2969 8.29688H32.2031V11.9531H26.2969V8.29688ZM19.5469 8.29688H25.4531V11.9531H19.5469V8.29688ZM12.7969 8.29688H18.7031V11.9531H12.7969V8.29688ZM6.04688 8.29688H11.9531V11.9531H6.04688V8.29688ZM6.04688 12.7969H38.9531V32.2031H6.04688V12.7969ZM6.04688 33.0469H11.9531V36.7031H6.04688V33.0469Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_1844_932">
<rect width="45" height="45" fill="white"/>
</clipPath>
</defs>
</svg>
        `
        },
        {
            label: 'Document Style',
            value: 'defaultdocumentstyle',
            svg: `
        <svg in:fade width="45" height="45" style="margin:0 ;" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.9813 17.6499H11.8813V18.5124H27.9813V17.6499Z" fill="black"/>
<path d="M27.9813 21.1001H11.8813V21.9626H27.9813V21.1001Z" fill="black"/>
<path d="M27.9813 24.5498H11.8813V25.4123H27.9813V24.5498Z" fill="black"/>
<path d="M23.3813 28H11.8813V28.8625H23.3813V28Z" fill="black"/>
<path d="M32.0062 40.3624C33.115 40.3624 34.1989 40.0336 35.1208 39.4176C36.0428 38.8016 36.7613 37.926 37.1857 36.9016C37.61 35.8772 37.721 34.7499 37.5047 33.6624C37.2884 32.5749 36.7544 31.576 35.9704 30.7919C35.1863 30.0079 34.1874 29.4739 33.0999 29.2576C32.0124 29.0413 30.8851 29.1523 29.8607 29.5767C28.8363 30.001 27.9607 30.7195 27.3447 31.6415C26.7287 32.5634 26.3999 33.6473 26.3999 34.7562C26.4016 36.2425 26.9928 37.6675 28.0438 38.7185C29.0948 39.7695 30.5198 40.3607 32.0062 40.3624ZM32.0062 30.0124C32.9444 30.0124 33.8615 30.2906 34.6416 30.8119C35.4217 31.3331 36.0298 32.074 36.3888 32.9408C36.7479 33.8076 36.8418 34.7614 36.6588 35.6816C36.4757 36.6018 36.0239 37.4471 35.3605 38.1105C34.6971 38.7739 33.8518 39.2257 32.9316 39.4088C32.0114 39.5918 31.0576 39.4979 30.1908 39.1388C29.324 38.7798 28.5831 38.1717 28.0619 37.3916C27.5406 36.6115 27.2624 35.6944 27.2624 34.7562C27.2639 33.4985 27.7641 32.2927 28.6534 31.4034C29.5427 30.5141 30.7485 30.0139 32.0062 30.0124Z" fill="black"/>
<path d="M31.4313 36.9122C31.4879 36.9123 31.544 36.9012 31.5963 36.8795C31.6487 36.8578 31.6962 36.826 31.7362 36.7859L35.1862 33.3359L34.5764 32.7261L31.4313 35.8712L30.0112 34.4511L29.4014 35.0609L31.1264 36.7859C31.1663 36.826 31.2139 36.8578 31.2662 36.8795C31.3185 36.9012 31.3746 36.9123 31.4313 36.9122Z" fill="black"/>
<path d="M31.8625 27.2812V13.4812C31.8625 13.3669 31.817 13.2572 31.7362 13.1763L23.6862 5.12634C23.6461 5.08628 23.5986 5.0545 23.5463 5.03282C23.494 5.01114 23.4379 4.99999 23.3812 5H8.43125C8.31688 5.00003 8.20721 5.04548 8.12634 5.12634C8.04548 5.20721 8.00003 5.31688 8 5.43125V39.9312C8.00003 40.0456 8.04548 40.1553 8.12634 40.2362C8.20721 40.317 8.31688 40.3625 8.43125 40.3625H25.6812V39.5H8.8625V5.8625H22.95V13.4812C22.95 13.5956 22.9955 13.7053 23.0763 13.7862C23.1572 13.867 23.2669 13.9125 23.3812 13.9125H31V27.2812H31.8625ZM23.8125 13.05V6.47232L30.3902 13.05H23.8125Z" fill="black"/>
</svg>
        `
        },
        {
            label: 'Lightly Guided',
            value: 'lightlyguided',
            svg: `
        <svg in:fade width="45" height="45" style="margin:0 ;" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.375 22.9218H14.1306L14.1515 30.3763C14.1518 30.5016 14.2019 30.6217 14.2906 30.7102C14.3794 30.7987 14.4996 30.8484 14.625 30.8484H31.4675C31.4786 30.8487 31.4889 30.8517 31.5 30.8517C31.9247 30.8512 32.3318 30.6823 32.6321 30.382C32.9324 30.0817 33.1013 29.6746 33.1018 29.2499V22.8976C34.9581 22.7748 36.694 21.9352 37.9425 20.5561C39.1911 19.1769 39.8545 17.3664 39.7926 15.5071C39.7307 13.6477 38.9483 11.8853 37.6107 10.5923C36.2732 9.2993 34.4853 8.57698 32.625 8.578H12.772C12.7227 8.14049 12.5969 7.71504 12.4004 7.32103L14.0966 5.62488L13.5 5.02832L11.9345 6.59388C11.3788 5.9165 10.606 5.45218 9.74706 5.27968C8.88812 5.10718 7.99595 5.23712 7.22189 5.64747C6.44784 6.05781 5.83956 6.72329 5.50025 7.53101C5.16095 8.33873 5.1115 9.23896 5.3603 10.079C5.6091 10.919 6.14082 11.6471 6.86528 12.1398C7.58973 12.6324 8.4623 12.8593 9.33498 12.7819C10.2076 12.7045 11.0267 12.3276 11.6531 11.7152C12.2796 11.1028 12.6749 10.2925 12.772 9.42176H32.625C34.2617 9.42099 35.8349 10.0547 37.0141 11.1897C38.1933 12.3247 38.8866 13.8726 38.9484 15.5081C39.0101 17.1436 38.4355 18.7394 37.3452 19.96C36.2549 21.1807 34.7339 21.9312 33.1018 22.0538V14.6249C33.1018 14.5623 33.0895 14.5002 33.0656 14.4424C33.0416 14.3845 33.0065 14.3319 32.9622 14.2877C32.9179 14.2434 32.8654 14.2082 32.8075 14.1843C32.7496 14.1603 32.6876 14.148 32.625 14.1481H15.9181C15.8555 14.148 15.7934 14.1603 15.7356 14.1843C15.6777 14.2082 15.6251 14.2434 15.5809 14.2877C15.5366 14.3319 15.5015 14.3845 15.4775 14.4424C15.4536 14.5002 15.4412 14.5623 15.4413 14.6249V16.3662L14.5882 16.3643H14.5871C14.5248 16.3642 14.463 16.3765 14.4055 16.4004C14.3479 16.4242 14.2956 16.4592 14.2516 16.5033C14.2076 16.5475 14.1728 16.5999 14.1491 16.6575C14.1254 16.7151 14.1133 16.7769 14.1136 16.8392L14.1283 22.078H12.375C10.4729 22.078 8.64871 22.8336 7.30372 24.1786C5.95873 25.5236 5.20313 27.3478 5.20312 29.2499C5.20313 31.152 5.95873 32.9762 7.30372 34.3212C8.64871 35.6662 10.4729 36.4218 12.375 36.4218H32.228C32.3358 37.3862 32.8088 38.2727 33.5498 38.8993C34.2909 39.5258 35.2437 39.8449 36.2126 39.7909C37.1815 39.7369 38.093 39.3139 38.7598 38.6089C39.4267 37.9039 39.7982 36.9703 39.7982 35.9999C39.7982 35.0295 39.4267 34.0959 38.7598 33.3908C38.093 32.6858 37.1815 32.2629 36.2126 32.2089C35.2437 32.1549 34.2909 32.4739 33.5498 33.1005C32.8088 33.7271 32.3358 34.6136 32.228 35.578H12.375C10.6967 35.578 9.08709 34.9113 7.90034 33.7245C6.71359 32.5378 6.04688 30.9282 6.04688 29.2499C6.04688 27.5716 6.71359 25.962 7.90034 24.7752C9.08709 23.5885 10.6967 22.9218 12.375 22.9218ZM9 11.953C8.49727 11.9559 8.00213 11.8304 7.56147 11.5884C7.12081 11.3464 6.74923 10.9959 6.48192 10.5701C6.21461 10.1443 6.06043 9.65733 6.03397 9.15529C6.00752 8.65325 6.10966 8.15277 6.33074 7.70124C6.55181 7.24972 6.8845 6.86211 7.29728 6.57513C7.71006 6.28815 8.18927 6.1113 8.68951 6.06133C9.18976 6.01136 9.69449 6.08992 10.1559 6.28958C10.6173 6.48923 11.0201 6.80337 11.3261 7.20224L9 9.52832L7.875 8.40332L7.27844 8.99988L8.70172 10.4232C8.74089 10.4623 8.78739 10.4934 8.83856 10.5146C8.88974 10.5358 8.9446 10.5468 9 10.5468C9.0554 10.5468 9.11026 10.5358 9.16144 10.5146C9.21262 10.4934 9.25911 10.4623 9.29828 10.4232L11.7561 7.96538C11.8839 8.29543 11.9506 8.64596 11.9531 8.99988C11.9522 9.78282 11.6408 10.5334 11.0872 11.0871C10.5336 11.6407 9.78294 11.9521 9 11.953ZM16.3949 15.1017H32.1482V29.2499C32.1482 29.4218 32.0799 29.5867 31.9583 29.7082C31.8368 29.8298 31.6719 29.8981 31.5 29.8981C31.3281 29.8981 31.1632 29.8298 31.0417 29.7082C30.9201 29.5867 30.8518 29.4218 30.8518 29.2499V28.1249H30.8485V16.8749C30.8485 16.7495 30.7987 16.6293 30.7102 16.5405C30.6216 16.4517 30.5015 16.4017 30.3761 16.4014L16.3949 16.3685V15.1017ZM29.9015 17.3473V28.1249H29.8982V29.2499C29.8988 29.4746 29.947 29.6967 30.0398 29.9014H15.0974L15.0617 17.3124L29.9015 17.3473ZM36 33.0468C36.5841 33.0468 37.155 33.22 37.6407 33.5444C38.1263 33.8689 38.5048 34.3302 38.7283 34.8698C38.9518 35.4094 39.0103 36.0032 38.8964 36.576C38.7824 37.1489 38.5012 37.6751 38.0882 38.0881C37.6752 38.5011 37.149 38.7823 36.5761 38.8963C36.0033 39.0102 35.4095 38.9517 34.8699 38.7282C34.3303 38.5047 33.8691 38.1262 33.5446 37.6406C33.2201 37.1549 33.0469 36.584 33.0469 35.9999C33.0478 35.2169 33.3592 34.4663 33.9128 33.9127C34.4664 33.3591 35.2171 33.0477 36 33.0468Z" fill="black"/>
<path d="M28.125 19.7729H16.875V20.7266H28.125V19.7729Z" fill="black"/>
<path d="M28.125 23.1479H16.875V24.1016H28.125V23.1479Z" fill="black"/>
<path d="M24.75 26.5229H16.875V27.4766H24.75V26.5229Z" fill="black"/>
</svg>
        `
        },
        {
            label: 'Fully Guided',
            value: 'fullyguided',
            svg: `
        <svg in:fade={{duration:1000}} width="45" height="45" style="margin:0 ;" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28.544 5.3132C28.4954 5.24783 28.4322 5.19473 28.3594 5.15815C28.2866 5.12158 28.2063 5.10253 28.1248 5.10254H16.8748C16.7652 5.10254 16.6583 5.13706 16.5694 5.20119C16.4805 5.26533 16.414 5.35583 16.3794 5.45987L10.7544 22.3349C10.7282 22.4134 10.721 22.497 10.7335 22.5788C10.746 22.6606 10.7777 22.7383 10.8261 22.8054C10.8745 22.8726 10.9382 22.9273 11.0118 22.965C11.0855 23.0027 11.1671 23.0223 11.2498 23.0223H19.6126L16.3626 39.2725C16.3394 39.3886 16.3563 39.5091 16.4105 39.6143C16.4647 39.7195 16.5531 39.8032 16.6611 39.8516C16.7691 39.9001 16.8904 39.9104 17.005 39.8808C17.1197 39.8513 17.2209 39.7837 17.2921 39.6891L34.1671 17.2921C34.2252 17.215 34.2608 17.1232 34.2699 17.0271C34.279 16.9309 34.2613 16.8341 34.2187 16.7474C34.176 16.6607 34.1102 16.5876 34.0285 16.536C33.9468 16.4845 33.8525 16.4566 33.7559 16.4555L25.4494 16.3605L28.6253 5.77518C28.6486 5.69716 28.6534 5.61477 28.6393 5.53457C28.6252 5.45436 28.5926 5.37856 28.544 5.3132ZM24.2494 16.7247C24.2262 16.8022 24.2213 16.8841 24.2351 16.9638C24.2489 17.0436 24.281 17.1191 24.3289 17.1843C24.3769 17.2495 24.4393 17.3027 24.5113 17.3397C24.5833 17.3766 24.6629 17.3964 24.7438 17.3973L32.7111 17.4885L17.8364 37.2307L20.7621 22.6024C20.7773 22.5266 20.7754 22.4484 20.7567 22.3734C20.738 22.2984 20.7029 22.2285 20.6539 22.1687C20.6049 22.1089 20.5432 22.0608 20.4733 22.0277C20.4035 21.9947 20.3271 21.9775 20.2498 21.9775H11.9747L17.2514 6.14734H27.4228L24.2494 16.7247Z" fill="black"/>
</svg>
        `
        }
    ];

    const toggleOptions = () => {
        showOptions = !showOptions;
    };

    let selectedOption = options.find((option) => option.value === 'fullyguided');
</script>

<div class="select-container" role="listbox" aria-label="Option selector">
    <button
        class="selected-option"
        class:noBorder={showOptions}
        aria-haspopup="true"
        aria-expanded={showOptions}
        on:click={() => (showOptions = !showOptions)}
    >
        {@html selectedOption.svg}<span class="selectedOptionLabel">{selectedOption.label}</span>
    </button>
    {#if showOptions}
        <div
            class="options"
            role="list"
            class:mobile={showOptions}
            in:fly={{ y: -15, duration: 1000 }}
            out:fly={{ y: -15, duration: 1000 }}
        >
            {#each options as option}
                <button
                    class="option"
                    role="option"
                    aria-selected={selectedOption.value === option.value}
                    on:click={() => handleSelection(option)}
                >
                    {@html option.svg}
                    <span>{option.label}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .noBorder {
        border-bottom: 0px !important;
    }
    .options.mobile {
        position: absolute;
        top: 67px;
        min-width: 190px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .stepContainerDocumentStyle {
        margin: auto 5em;
    }

    .articleHero-Revert {
        background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%),
            linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%),
            linear-gradient(10deg, #a1c4fd 0%, #c2e9fb 100%);
    }
    .select-container {
        position: relative;
        /* width: 250px; */
        padding-right: 1em;
        z-index: 250;
        height: 67px;
    }

    .selected-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
        width: 190px;
    }

    .selectedOptionLabel {
        flex: 1;
    }

    .options {
        top: 250px;
        left: 0;
        max-width: 100%;
        background: #efefef;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 1;
        display: none;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .options > * {
        margin: 0.5em 0;
    }

    .options.show {
        display: block;
    }

    .options-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .option {
        display: flex;

        align-items: center;
        /* margin-right: 1rem; */
        cursor: pointer;
        flex-direction: row;
    }

    .option:hover {
        background: #eee;
    }

    @media (max-width: 768px) {
        .selectedOptionLabel {
            display: none;
        }
        .selected-option {
            width: 60px;
        }
    }
</style>
