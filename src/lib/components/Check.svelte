<script>
    import { quintOut } from 'svelte/easing';
    import { fade, draw } from 'svelte/transition';

    export let stroke = '#1E4471';
</script>

<svg width="80" height="80" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="breadcrumb-ack-2">
        <g>
            <rect
                id="circle-backing"
                in:fade={{
                    duration: 1000,
                    easing: quintOut,
                    delay: 100
                }}
                x="5"
                y="5"
                width="30"
                height="30"
                rx="15"
                fill="#D2D2D2"
            />
            <path
                in:draw={{
                    duration: 1000,
                    easing: quintOut,
                    delay: 100
                }}
                id="breadcrumb-ack-stroke-check"
                d="M10.2178 20.218L17.2178 27.218L35.2178 8.71796"
                {stroke}
            />
            <path
                in:draw={{
                    duration: 1000,
                    easing: quintOut,
                    delay: 100
                }}
                id="breadcrumb-ack-stroke-circle"
                d="M33.0936 13.5497C34.7867 16.8188 35.1728 20.6095 34.1737 24.1528C33.1747 27.6961 30.8652 30.7267 27.7139 32.6299C24.5625 34.5331 20.8052 35.1664 17.2041 34.4012C13.6031 33.636 10.4279 31.5297 8.32263 28.5096C6.21739 25.4895 5.33977 21.7816 5.86778 18.1382C6.3958 14.4948 8.2899 11.1886 11.1659 8.89038C14.0419 6.59213 17.6844 5.47389 21.3545 5.76248C25.0247 6.05107 28.4476 7.72489 30.9291 10.4444"
                {stroke}
            />
        </g>
    </g>
</svg>

<style>
    svg {
        display: inherit;
        width: var(--icon-width);
        height: auto;
    }
</style>
