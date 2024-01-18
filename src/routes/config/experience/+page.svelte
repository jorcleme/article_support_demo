<script>
    import { onMount } from 'svelte/internal';
    import { fade, draw, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { goto } from '$app/navigation';
    import { UserPreferences } from '$lib/components/store';
    import { _ as format } from 'svelte-i18n';

    let pageLoaded = false;
    onMount(() => {
        pageLoaded = !pageLoaded;
    });

    const experienceOptions = [
        {
            value: 'step-by-step',
            icon: `<svg
						xmlns="http://www.w3.org/2000/svg"
						width="3.5rem"
						height="3.5rem"
						viewBox="0 0 50 50"
						fill="none"
					>
						<circle
							cx="22.7185"
							cy="25.5329"
							r="2.53293"
							stroke="url(#paint0_linear_1341_768)"
							stroke-width="2"
						/>
						<circle
							cx="7.53293"
							cy="25.5329"
							r="2.53293"
							stroke="url(#paint1_linear_1341_768)"
							stroke-width="2"
						/>
						<path d="M19.8922 25.533H10" stroke="url(#paint2_linear_1341_768)" stroke-width="3" />
						<path
							d="M35.4371 25.533H25.5449"
							stroke="url(#paint3_linear_1341_768)"
							stroke-width="3"
						/>
						<path
							d="M45.9282 25.533L30.9282 16.8727V34.1932L45.9282 25.533ZM31.0898 27.033H32.4282V24.033H31.0898V27.033Z"
							fill="url(#paint4_linear_1341_768)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_1341_768"
								x1="22.7185"
								y1="22"
								x2="22.7185"
								y2="29.0659"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#007AFF" />
								<stop offset="0.487215" stop-color="#389A91" />
								<stop offset="1" stop-color="#68B631" />
							</linearGradient>
							<linearGradient
								id="paint1_linear_1341_768"
								x1="7.53293"
								y1="22"
								x2="7.53293"
								y2="29.0659"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#007AFF" />
								<stop offset="0.487215" stop-color="#389A91" />
								<stop offset="1" stop-color="#68B631" />
							</linearGradient>
							<linearGradient
								id="paint2_linear_1341_768"
								x1="14.9461"
								y1="25.533"
								x2="14.9461"
								y2="26.533"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#007AFF" />
								<stop offset="0.487215" stop-color="#389A91" />
								<stop offset="1" stop-color="#68B631" />
							</linearGradient>
							<linearGradient
								id="paint3_linear_1341_768"
								x1="30.491"
								y1="25.533"
								x2="30.491"
								y2="26.533"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#007AFF" />
								<stop offset="0.487215" stop-color="#389A91" />
								<stop offset="1" stop-color="#68B631" />
							</linearGradient>
							<linearGradient
								id="paint4_linear_1341_768"
								x1="38.509"
								y1="25.533"
								x2="38.509"
								y2="26.533"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#007AFF" />
								<stop offset="0.487215" stop-color="#389A91" />
								<stop offset="1" stop-color="#68B631" />
							</linearGradient>
						</defs>
					</svg>`,
            id: 'step-by-step',
            innerHTML: `${$format('config_experience_btn_left')}`
        },
        {
            value: 'all-steps',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="3.5rem" height="3.5rem" viewBox="0 0 50 35" fill="none">
		<g id="Frame 152">
			<g id="Rectangle 266">
				<path
					d="M33.5 4.7793C33.5 3.67473 34.3954 2.7793 35.5 2.7793H38.6627C39.7672 2.7793 40.6627 3.67473 40.6627 4.7793V28.7793C40.6627 29.8839 39.7672 30.7793 38.6627 30.7793H35.5C34.3954 30.7793 33.5 29.8839 33.5 28.7793V4.7793Z"
					fill="#0076D5"
				/>
				<path
					d="M33.5 4.7793C33.5 3.67473 34.3954 2.7793 35.5 2.7793H38.6627C39.7672 2.7793 40.6627 3.67473 40.6627 4.7793V28.7793C40.6627 29.8839 39.7672 30.7793 38.6627 30.7793H35.5C34.3954 30.7793 33.5 29.8839 33.5 28.7793V4.7793Z"
					fill="url(#paint0_linear_1341_784)"
					style="mix-blend-mode:color"
				/>
			</g>
			<path
				id="Polygon 7"
				d="M5.89513 8.80378C5.89513 6.52763 8.39051 5.11964 10.4075 6.25771L25.0945 14.5447C27.129 15.6926 27.1509 18.5651 25.1337 19.7033L10.4468 27.9902C8.42966 29.1284 5.89513 27.6736 5.89513 25.3777L5.89513 8.80378Z"
				fill="url(#paint1_linear_1341_784)"
			/>
		</g>
		<defs>
			<linearGradient
				id="paint0_linear_1341_784"
				x1="10.8936"
				y1="37.4927"
				x2="-5.72983"
				y2="33.6506"
				gradientUnits="userSpaceOnUse"
			>
				<stop stop-color="#0076D5" />
				<stop offset="0.427083" stop-color="#00BCEB" />
				<stop offset="1" stop-color="#007AFF" />
			</linearGradient>
			<linearGradient
				id="paint1_linear_1341_784"
				x1="56.6047"
				y1="640.318"
				x2="0.456072"
				y2="628.003"
				gradientUnits="userSpaceOnUse"
			>
				<stop stop-color="#0076D5" />
				<stop offset="0.9999" stop-color="#00BCEB" />
				<stop offset="1" stop-color="#007AFF" />
			</linearGradient>
		</defs>
	</svg>`,
            id: 'all-steps',
            innerHTML: `${$format('config_experience_btn_right')}`
        }
    ];
    export let container = undefined;
    let experienceType;

    $: {
        console.log(experienceType);
        console.log($UserPreferences);
    }

    /**
     *	@returns {Promise<void>} Add the selected input value from user and store to UserPreferences Object
     */
    async function navigateAfterInput() {
        UserPreferences.add('experience', experienceType);
        console.log($UserPreferences);
        UserPreferences.persist($UserPreferences);
        await goto('/config/network');
    }
</script>

{#if pageLoaded}
    <div class="container" bind:this={container}>
        <div class="follow-the-path">
            <svg
                width="388"
                height="112"
                viewBox="0 0 388 112"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6.62872e-06 56L233 56"
                    stroke="#1E4471"
                    stroke-width="2"
                    in:draw={{ delay: 500, duration: 3000, easing: quintOut }}
                />
                <path
                    d="M56.4731 66.008C62.69 66.008 67.7298 61.3052 67.7298 55.504C67.7298 49.7028 62.69 45 56.4731 45C50.2561 45 45.2163 49.7028 45.2163 55.504C45.2163 61.3052 50.2561 66.008 56.4731 66.008Z"
                    fill="white"
                    stroke="#1E4471"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    in:fly={{
                        x: -300,
                        delay: 600,
                        duration: 3000,
                        easing: quintOut
                    }}
                />
                <path
                    d="M320.749 13.2041L347.271 13.2041C350.371 13.2041 352.883 10.4966 352.883 7.1568L352.883 7.0473C352.883 3.70747 350.371 0.999997 347.271 0.999998L320.749 1C317.65 1 315.137 3.70747 315.137 7.0473L315.137 7.1568C315.137 10.4966 317.65 13.2041 320.749 13.2041Z"
                    fill="none"
                    stroke="#0B2750"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M303.66 51.9042C303.66 48.5912 306.151 45.968 309.149 45.968C312.147 45.968 314.637 48.5912 314.637 51.9042C314.637 55.2172 312.147 57.8403 309.149 57.8403C306.151 57.8403 303.66 55.2172 303.66 51.9042Z"
                    stroke="black"
                />

                <path
                    d="M371.43 18.5533C364.394 18.5533 358.69 24.6998 358.69 32.2818C358.69 39.8638 364.394 46.0103 371.43 46.0103C378.466 46.0103 384.169 39.8638 384.169 32.2818C384.169 24.6998 378.466 18.5533 371.43 18.5533Z"
                    fill="#0B2750"
                    out:fly={{
                        x: 300,
                        duration: 1000,
                        easing: quintOut
                    }}
                />
                <path
                    d="M387 99.2976H360.868V111H387V99.2976Z"
                    fill="#042750"
                    stroke="#042750"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M273.258 55.7164L273.258 48.0202C273.258 47.2793 273.441 46.5517 273.788 45.9118C274.135 45.2719 274.634 44.7426 275.233 44.3779C275.833 44.0132 276.511 43.8264 277.2 43.8363C277.889 43.8463 278.563 44.0527 279.153 44.4345L284.928 48.1703L291.055 52.1338C291.63 52.506 292.106 53.0318 292.436 53.6602C292.767 54.2886 292.94 54.9982 292.94 55.72C292.94 56.4419 292.767 57.1514 292.436 57.7798C292.106 58.4081 291.63 58.934 291.055 59.3061L284.928 63.2696L279.153 67.0055C278.563 67.3873 277.889 67.5937 277.2 67.6036C276.511 67.6136 275.833 67.4267 275.233 67.0621C274.634 66.6974 274.135 66.1681 273.788 65.5281C273.441 64.8882 273.258 64.1607 273.258 63.4198L273.258 55.7164Z"
                    fill="#0B2750"
                    in:draw={{ delay: 3000, duration: 3000, easing: quintOut }}
                    out:fly={{
                        x: 300,
                        duration: 1000,
                        easing: quintOut
                    }}
                />
                <path
                    d="M230.017 60.771L231.605 62.2292L237.593 56.7292C237.698 56.6335 237.78 56.5198 237.837 56.3947C237.893 56.2696 237.922 56.1355 237.922 56.0001C237.922 55.8647 237.893 55.7306 237.837 55.6055C237.78 55.4804 237.698 55.3667 237.593 55.271L231.605 49.771L230.017 51.2292L234.089 54.9689H233V57.0314H234.089L230.017 60.771Z"
                    fill="#1E4471"
                    in:fly={{
                        x: -300,
                        delay: 385,
                        duration: 3000,
                        easing: quintOut
                    }}
                />
                <path d="M239.794 76.9688H203.863V79.0312H239.794V76.9688Z" fill="#1E4471" />
                <path
                    d="M227.817 68.0312V65.9688H191.885C191.588 65.9688 191.302 66.0775 191.092 66.2709C190.881 66.4643 190.763 66.7265 190.763 67V89C190.763 89.2735 190.881 89.5357 191.092 89.7291C191.302 89.9225 191.588 90.0312 191.885 90.0312H203.863V87.9688H193.008V68.0312H227.817Z"
                    fill="#1E4471"
                />
                <path
                    d="M226.694 89V100H228.94V90.0312H239.794V87.9688H227.817C227.519 87.9688 227.233 88.0775 227.023 88.2709C226.812 88.4643 226.694 88.7265 226.694 89Z"
                    fill="#1E4471"
                />
                <path d="M216.962 89H214.717V100H216.962V89Z" fill="#1E4471" />
                <path
                    d="M157.077 89V79.0312H179.908C180.206 79.0312 180.492 78.9225 180.702 78.7291C180.913 78.5357 181.031 78.2735 181.031 78V67H178.785V76.9688H155.954C155.656 76.9688 155.371 77.0775 155.16 77.2709C154.95 77.4643 154.831 77.7265 154.831 78V87.9688H143.977V90.0312H155.954C156.252 90.0312 156.538 89.9225 156.748 89.7291C156.959 89.5357 157.077 89.2735 157.077 89V89Z"
                    fill="#1E4471"
                />
                <path d="M167.931 65.9688H143.977V68.0312H167.931V65.9688Z" fill="#1E4471" />
                <path d="M181.031 89H178.785V100H181.031V89Z" fill="#1E4471" />
                <path d="M169.054 89H166.808V100H169.054V89Z" fill="#1E4471" />
                <path
                    d="M157.077 45V35.0312H167.931V32.9688H155.954C155.656 32.9688 155.371 33.0775 155.16 33.2709C154.95 33.4643 154.831 33.7265 154.831 34V43.9688H143.977V46.0312H155.954C156.252 46.0312 156.538 45.9225 156.748 45.7291C156.959 45.5357 157.077 45.2735 157.077 45V45Z"
                    fill="#1E4471"
                />
                <path
                    d="M157.077 23V12H154.831V21.9688H143.977V24.0312H155.954C156.252 24.0312 156.538 23.9225 156.748 23.7291C156.959 23.5357 157.077 23.2735 157.077 23V23Z"
                    fill="#1E4471"
                />
                <path
                    d="M166.808 12V23C166.808 23.2735 166.927 23.5357 167.137 23.7291C167.348 23.9225 167.633 24.0312 167.931 24.0312H178.785V43.9688H167.931V46.0312H179.908C180.206 46.0312 180.492 45.9225 180.702 45.7291C180.913 45.5357 181.031 45.2735 181.031 45V23C181.031 22.7265 180.913 22.4643 180.702 22.2709C180.492 22.0775 180.206 21.9688 179.908 21.9688H169.054V12H166.808Z"
                    fill="#1E4471"
                />
                <path
                    d="M190.763 12V34C190.763 34.2735 190.881 34.5357 191.092 34.7291C191.302 34.9225 191.588 35.0312 191.885 35.0312H203.863V32.9688H193.008V12H190.763Z"
                    fill="#1E4471"
                />
                <path
                    d="M214.717 34V43.9688H191.885V46.0312H215.84C216.137 46.0312 216.423 45.9225 216.633 45.7291C216.844 45.5357 216.962 45.2735 216.962 45V35.0312H239.794V32.9688H215.84C215.542 32.9688 215.256 33.0775 215.046 33.2709C214.835 33.4643 214.717 33.7265 214.717 34V34Z"
                    fill="#1E4471"
                />
                <path d="M204.985 12H202.74V23H204.985V12Z" fill="#1E4471" />
                <path
                    d="M228.94 23V12H226.694V21.9688H215.84V24.0312H227.817C228.114 24.0312 228.4 23.9225 228.611 23.7291C228.821 23.5357 228.939 23.2735 228.94 23V23Z"
                    fill="#1E4471"
                />
            </svg>
        </div>
        <p style="max-width: 60ch;" transition:fade={{ duration: 2000, delay: 200 }}>
            {$format('config_experience_text')}
        </p>
        <div class="choose-your-experience">
            {#each experienceOptions as option, i (i)}
                <label for={option.id} class="label__btn">
                    <input
                        type="radio"
                        id={option.id}
                        name={option.id}
                        bind:group={experienceType}
                        value={option.value}
                        style="display: none;"
                        on:change={navigateAfterInput}
                    />
                    <div>
                        {@html option.icon}
                    </div>
                    <div>
                        <span>{@html option.innerHTML}</span>
                    </div>
                </label>
            {/each}
        </div>
    </div>
{/if}

<style>
    .mask {
        position: relative;
        text-transform: uppercase;
    }
    .mask::after {
        content: '';
        position: absolute;
        top: 95%;
        width: 120%;
        aspect-ratio: 3.5 / 1;
        left: 45%;
        transform: translate(-50%, 0);
        border-radius: 50%;
        border: 2px solid #6abf4b;
        clip-path: polygon(0 0, 50% 50%, 100% 0);
    }
    .container {
        display: grid;
        place-items: center;
        margin: 15.25em auto 0;
    }

    .follow-the-path {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding: 2em 0;
        transition: width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        min-width: 30vw;
    }

    p {
        margin: 3em 1.5em;
        text-align: center;
        font-size: calc(var(--font-size-base) + 1px);
        color: var(--cisco-midnight-blue);
        line-height: 1.6rem;
    }

    .choose-your-experience {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1em;
        align-items: center;
        margin: auto;
        margin-bottom: 2em;
    }

    label.label__btn {
        display: flex;
        flex-flow: column wrap;
        justify-content: space-around;
        align-items: center;
        text-decoration: none;
        background: #efefef;
        outline: none;
        border: 1px solid var(--border-gray);
        cursor: pointer;
        border-radius: 14px;
        margin: 1em;
        padding: 1em 1.8em;
        transition: all 0.4s ease-in;
        color: var(--cisco-midnight-blue);
        font-size: var(--font-size-base);
        font-family: 'CiscoSansTTBold';
        box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0,
            rgba(0, 0, 0, 0.12) 0 1px 18px 0;
        overflow: hidden;
        font-kerning: none;
    }

    label.label__btn > div > span {
        white-space: nowrap;
        text-align: center;
        word-break: break-word;
    }

    /* Desktop View */
    @media only screen and (min-width: 769px) {
    }

    /* Tablet View */
    @media only screen and (min-width: 769px) and (max-width: 1023px) {
    }

    /* Mobile View */

    @media only screen and (min-width: 300px) and (max-width: 768px) {
        .follow-the-path {
            min-height: 150px;
            width: 100%;
            min-width: fit-content !important;
        }
    }

    label.label__btn:hover,
    label.label__btn:focus,
    label.label__btn > input:checked {
        background-color: var(--cisco-midnight-blue);
        color: whitesmoke;
        border: 1px solid var(--cisco-blue);
    }
</style>
