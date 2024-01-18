<script>
    import { _ as format } from 'svelte-i18n';
    export let open;
</script>

<div class="gs-container">
    <details class="dropdown" bind:open>
        <summary class="dropdown-summary">
            <div class="row-flex">
                <div class="center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                    >
                        <path
                            d="M40.0137 9.25C33.9319 9.25 27.9867 11.0535 22.9299 14.4323C17.8731 17.8112 13.9318 22.6137 11.6044 28.2325C9.27699 33.8513 8.66804 40.0341 9.85454 45.999C11.041 51.9639 13.9697 57.4431 18.2702 61.7435C22.5706 66.044 28.0497 68.9727 34.0147 70.1591C39.9796 71.3456 46.1624 70.7367 51.7812 68.4093C57.4 66.0819 62.2025 62.1406 65.5814 57.0838C68.9602 52.027 70.7637 46.0818 70.7637 40C70.7545 31.8474 67.5119 24.0313 61.7471 18.2666C55.9823 12.5018 48.1663 9.25915 40.0137 9.25ZM40.0137 69.25C34.2286 69.25 28.5734 67.5345 23.7633 64.3205C18.9531 61.1065 15.2041 56.5382 12.9902 51.1935C10.7763 45.8488 10.1971 39.9676 11.3257 34.2936C12.4543 28.6197 15.2401 23.4078 19.3308 19.3171C23.4215 15.2264 28.6333 12.4406 34.3073 11.312C39.9812 10.1834 45.8624 10.7627 51.2072 12.9765C56.5519 15.1904 61.1201 18.9394 64.3342 23.7496C67.5482 28.5597 69.2637 34.2149 69.2637 40C69.255 47.7549 66.1705 55.1897 60.6869 60.6732C55.2034 66.1568 47.7686 69.2413 40.0137 69.25Z"
                            fill="#00BCEB"
                        />
                        <path
                            d="M40.0137 21.25C37.1357 21.2533 34.3766 22.3981 32.3417 24.4332C30.3068 26.4683 29.1623 29.2275 29.1592 32.1055H30.6592C30.6592 29.6244 31.6448 27.2449 33.3992 25.4905C35.1536 23.7361 37.5331 22.7505 40.0142 22.7505C42.4953 22.7505 44.8748 23.7361 46.6292 25.4905C48.3836 27.2449 49.3692 29.6244 49.3692 32.1055C49.3692 35.8989 46.5674 37.9644 43.8584 39.9619C41.4952 41.7041 39.2637 43.3501 39.2637 45.9946L39.25 47.9946L40.75 48.0054L40.7637 46C40.7637 44.1074 42.6103 42.7461 44.749 41.1694C47.6172 39.0542 50.8691 36.6562 50.8691 32.1054C50.8658 29.2274 49.7211 26.4682 47.686 24.4331C45.6509 22.3981 42.8917 21.2533 40.0137 21.25Z"
                            fill="#000"
                        />
                        <path
                            d="M40.0137 53.25C39.4698 53.25 38.9381 53.4113 38.4859 53.7135C38.0336 54.0156 37.6811 54.4451 37.473 54.9476C37.2649 55.4501 37.2104 56.0031 37.3165 56.5365C37.4226 57.0699 37.6845 57.5599 38.0691 57.9445C38.4537 58.3291 38.9437 58.591 39.4772 58.6972C40.0106 58.8033 40.5636 58.7488 41.0661 58.5407C41.5685 58.3325 41.998 57.9801 42.3002 57.5278C42.6024 57.0756 42.7637 56.5439 42.7637 56C42.7629 55.2709 42.473 54.5718 41.9574 54.0563C41.4418 53.5407 40.7428 53.2507 40.0137 53.25ZM40.0137 57.25C39.7664 57.25 39.5248 57.1767 39.3192 57.0393C39.1136 56.902 38.9534 56.7068 38.8588 56.4784C38.7642 56.2499 38.7395 55.9986 38.7877 55.7561C38.8359 55.5137 38.955 55.2909 39.1298 55.1161C39.3046 54.9413 39.5273 54.8222 39.7698 54.774C40.0123 54.7258 40.2636 54.7505 40.492 54.8451C40.7204 54.9398 40.9157 55.1 41.053 55.3055C41.1904 55.5111 41.2637 55.7528 41.2637 56C41.2634 56.3314 41.1316 56.6492 40.8972 56.8835C40.6629 57.1179 40.3451 57.2497 40.0137 57.25Z"
                            fill="#000"
                        />
                    </svg>
                </div>
                <div class="title">{$format('get_support_text')}</div>
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
            <div class="video-card">
               <div class="video-wrapper">
                   <iframe
                       loading="lazy"
                       class="vid-card-iframe"
                       src="https://www.youtube.com/embed/ZcJcZAiDM7Q"
                       title="YouTube video player"
                       frameborder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowfullscreen
                       webkitallowfullscreen
                       mozallowfullscreen
                       referrerpolicy="no-referrer"
                   />
               </div>
                <div class="video-text-content">
                    <!-- textContent = item['title'] -->
                    <h3 class="video-card-title">Getting To Know The Virtual Assistant</h3>
                    <!-- textContent = item["Description"] -->
                    <p style="padding:1em;" id="video-card-description">
                        Nobody supports you like you. Learn how to use the Cisco Small Business Bot
                    </p>
                </div>
            </div>
        </div>
        <section class="full">
            <iframe
                title="Discover Support Content"
                src="https://spyder.cisco.com/app/v1/chat?id=7c62830f-b6d4-42f2-b5eb-60445741a80d"
            >
                <div />
            </iframe>
        </section>
        <section>
            <form
                id="login-form"
                method="post"
                name="login-form"
                action="https://cloudsso.cisco.com//as/T7EeI/resume/as/authorization.ping"
            />
        </section>
    </details>
</div>

<style>
    details.dropdown {
        border: 1px solid var(--border-gray-2);
        border-radius: 16px;
        background-color: #fff;
        font-family: inherit;
        font-size: var(--font-size-base);
        color: #333;
    }

    summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .center {
        display: grid;
        place-items: center;
    }

    .row-flex > .center > svg {
        width: 3.5em;
        height: auto;
    }

    summary::marker {
        appearance: none;
    }

    details.dropdown {
        list-style: none;
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

    details[open] {
        filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.2));
    }

    .row-flex {
        display: flex;
        align-items: center;
    }

    .full {
        width: 100%;
        margin-top: 2em;
    }

    .full iframe {
        width: 100%;
        min-height: 100vh;
        overflow-y: visible;
    }

    .title {
        margin-left: clamp(0.5em, 0.75em, 3.24em);
    }

    .ionicon {
        height: 2em;
        width: 2em;
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
        border-bottom: 1px solid #dfdfdf;
        width: 100%;
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
        justify-content: center;
        align-items: flex-start;
    }

    .video-card-title {
        padding: 0 1em;
        color: var(--cisco-dark-blue);
        margin: 0 0 0.6em 0;
        font-weight: 700;
        font-size: var(--font-size-md);
        line-height: 1.286;
    }

    #video-card-description {
        padding: 0 1em 1em 1em;
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

    :link {
        text-decoration: none;
        color: var(--cisco-blue);
    }

    @media only screen and (min-width: 401px) and (max-width: 768px) {
        summary.dropdown-summary {
            max-height: 80px;
        }
        .vid-card-iframe {
            width: 100%;
            height: 55%;
        }
        .video-card {
            width: 250px;
            height: 250px;
            border-radius: 16px;
        }

        .video-card-title {
            padding: 0.5em 0.5em 5em 0.5em;
            font-weight: 700;
        }
    }
</style>
