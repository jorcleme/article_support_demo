<script>
    import { _ as format } from 'svelte-i18n';

    let app_series_name = 'Catalyst 1200';
</script>

<div class="wrapper">
    <article class="topic concept nested2" lang="en-US" id="concept_bx3_w5m_ckb">
        <section class="body conbody">
            <ol>
                <li style="--cardColor: var(--cisco-midnight-blue)">
                    <div class="content">
                        <p>
                            {$format('feature_widget_console_ports_li_1', {
                                values: { app_series_name: app_series_name }
                            })}
                        </p>
                    </div>
                </li>
                <li style="--cardColor: var(--cisco-midnight-blue)">
                    <div class="content">
                        <p>
                            {$format('feature_widget_console_ports_li_2')}
                        </p>
                    </div>
                </li>
                <li style="--cardColor: var(--cisco-midnight-blue)">
                    <div class="content">
                        <p>
                            {$format('feature_widget_console_ports_li_3')}
                        </p>
                    </div>
                </li>
            </ol>
        </section>
    </article>
</div>

<style>
    article {
        display: block;
    }

    ol {
        list-style: none;
        counter-reset: list;
        font-family: 'CiscoSansTT';
        display: flex;
        flex-flow: column nowrap;
        --gap: 0.8rem;
        gap: var(--gap);
        padding: 0;
        margin: 0;
        padding-bottom: var(--gap);
    }

    ol li {
        counter-increment: list;
        display: flex;
        color: whitesmoke;
        --offset: 1rem;
        --clipSize: 1.5rem;
        margin-top: var(--offset);
    }

    ol li::before {
        content: counter(list, decimal-leading-zero);
        background: #f5f5f5;
        color: var(--cardColor);
        font-size: 1.5em;
        font-weight: 700;
        transform: translateY(calc(-1 * var(--offset)));
        margin-right: calc(-1 * var(--offset));
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-inline: 0.5em;
    }

    ol li .content {
        background-color: var(--cardColor);
        --inlinePadding: 1em;
        --boxPadding: 0.5em;
        display: grid;
        padding: var(--boxPadding) calc(var(--inlinePadding) + var(--clipSize)) var(--boxPadding)
            calc(var(--inlinePadding) + var(--offset));
        grid-template-areas: 'text';
        gap: 0.25em 1em;
        clip-path: polygon(
            0 0,
            calc(100% - var(--clipSize)) 0,
            100% 50%,
            calc(100% - var(--clipSize)) 100%,
            calc(100% - var(--clipSize)) calc(100% + var(--gap)),
            0 calc(100% + var(--gap))
        );
        position: relative;
        width: 100%;
    }

    ol li .content::before {
        content: '';
        position: absolute;
        width: var(--offset);
        height: var(--offset);
        background: var(--cardColor);
        left: 0;
        bottom: 0;
        clip-path: polygon(0 0, 100% 0, 0 100%);
        filter: brightness(0.75);
    }

    ol li .content::after {
        content: '';
        position: absolute;
        height: var(--gap);
        width: var(--gap);
        background: linear-gradient(to right, rgba(0, 0, 0, 0.25), transparent 50%);
        left: 0;
        top: 100%;
    }

    ol li .content p {
        grid-area: text;
        font-size: 14px;
        font-family: 'CiscoSansThin';
        line-height: 1rem;
    }

    /* img {
        width: 40%;
        height: auto;
    }

    .body.conbody {
        padding: 0;
        border: 0;
        font: inherit;
        display: block;
        margin-top: 0 !important;
        margin: 12px 0;
    }

    ol {
        counter-reset: li;
        font-family: 'CiscoSansTT';
        font-size: var(--font-size-base);
        list-style: none;
        list-style: decimal;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
        padding-inline-start: 5px;
        margin: 0;
    }

    ol > li > span::before {
        content: counter(li);
        counter-increment: li;
        position: absolute;
        left: -1.3em;
        top: 50%;
        margin-top: -1.3em;
        background: var(--cisco-midnight-blue);
        height: 2em;
        width: 2em;
        line-height: 2em;
        border: 0.3em solid #fff;
        text-align: center;
        font-weight: 700;
        border-radius: 2em;
        transition: all 0.3s ease-out;
        color: whitesmoke;
    }

    ol > li > span:hover::before {
        transform: rotate(360deg);
    } */

    /* li {
        display: block;
        padding: 0.6em 0.6em 0.6em 2em;
        margin: 1.5em 0;
        color: #333;
        position: relative;
        border-radius: 5px;
        background-color: var(--menu-background-gray);
        font-family: 'CiscoSansThin';
        font-weight: bold;
    } */
</style>
