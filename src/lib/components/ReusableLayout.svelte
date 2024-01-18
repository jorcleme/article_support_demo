<div class="page">
    <div class="auto-width">
        <div class="column">
            <slot name="estimated-completion" />
            <slot name="step-module" />
        </div>
        <div class="progress column">
            <slot name="cta" />
            <slot name="progress-steps" />
            <slot name="completed" />
        </div>
    </div>
</div>

<style>
    .page {
        background: var(--menu-background-gray);
        padding: 1em;
        position: relative;
        z-index: 2;
    }

    .column {
        display: flex;
        flex-flow: column nowrap;
        /* z-index: 3;
        position: relative; */
    }

    .progress {
        padding-bottom: 5vmin;
    }

    @media only screen and (max-width: 768px) {
        .page {
            padding: 0;
        }
    }
    @media only screen and (min-width: 1024px) {
        .auto-width {
            max-width: 63%;
            margin: 0 auto;
        }
    }
</style>
