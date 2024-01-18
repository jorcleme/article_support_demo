<script>
    import { beforeUpdate, getContext, onMount } from 'svelte';
    import { transformData } from '$lib/utils/organizeDatasheetData';
    import OtherQuestions from '../OtherQuestions.svelte';
    import { page } from '$app/stores';
    import { _ as format } from 'svelte-i18n';

    const { getDatasheet, getModel, getSimilarSeries } = getContext('FeatureWidget');

    const datasheet = getDatasheet();
    const model = getModel();
    const similarSeries = getSimilarSeries();

    let modelsMap;
    let genericsMap;
    let modelKeyInstances;
    let activeModelUI;
    let similarModelUI;
    let similarSeriesUI;
    let prompts;

    beforeUpdate(() => {
        [
            modelsMap,
            modelKeyInstances,
            genericsMap,
            activeModelUI,
            similarSeriesUI,
            similarModelUI
        ] = transformData({
            datasheet,
            model,
            componentType: 'uplink',
            similarSeries
        });
    });

    // $: deviceFamily = 'Cisco Catalyst 1200 Series Switches';

    // onMount(() => {
    //     prompts = `You are a Cisco TAC engineer and an expert at explaining network technology in simple and concise terms. You will be given the model product family name along with corresponding data that describes some of the features and specifications of the given product family as context. Keep in mind that the user will not be able to respond to your messages so do not ask the user more questions. Do not include code in your response and ensure the text is concise and a complete sentence. Here is the model product family: ${deviceFamily}. The current model id is ${$page.params.model}. The current model has ${activeModelUI['portCount']} uplink ports with a maximum speed of ${activeModelUI['portSpeed']}. Return 3 questions that user may have about this device. Keep the questions focused upon the specifications of this product and device.`;
    // });

    let moreDetails;
</script>

<div class="wrapper">
    <section class="slide-body">
        <div class="col col-1">
            <h3 class="column-header underline">{$format('feature_widget_other_series_title')}</h3>
            <div class="column-group">
                <p>{similarSeriesUI['portCount']}</p>
                <p><strong>{$format('feature_widget_downlinks_port_count')}</strong></p>
            </div>
            <div class="column-group">
                <p>G</p>
                <p><strong>{$format('feature_widget_downlinks_port_option')}</strong></p>
            </div>
            <div class="column-group">
                <p>{similarSeriesUI['portSpeed']}</p>
                <p><strong>{$format('feature_widget_downlinks_port_speed')}</strong></p>
            </div>
        </div>
        <div class="col col-2">
            <h3 class="column-header cisco-blue underline">
                {$format('feature_widget_you_have_title')}
            </h3>
            <div class="column-group">
                <p>{activeModelUI['portCount']}</p>
                <p><strong>{$format('feature_widget_downlinks_port_count')}</strong></p>
            </div>
            <div class="column-group">
                <p>G</p>
                <p><strong>{$format('feature_widget_downlinks_port_option')}</strong></p>
            </div>
            <div class="column-group">
                <p>
                    {activeModelUI['portSpeed']}
                </p>
                <p><strong>{$format('feature_widget_downlinks_port_speed')}</strong></p>
            </div>
        </div>
        <div class="col col-3">
            <h3 class="column-header underline">{$format('feature_widget_other_models_title')}</h3>
            <div class="column-group">
                <p>{similarModelUI['portCount']}</p>
                <p><strong>{$format('feature_widget_downlinks_port_count')}</strong></p>
            </div>
            <div class="column-group">
                <p>{similarModelUI['portOption']}</p>
                <p><strong>{$format('feature_widget_downlinks_port_option')}</strong></p>
            </div>
            <div class="column-group">
                <p>{similarModelUI['portSpeed']}</p>
                <p><strong>{$format('feature_widget_downlinks_port_speed')}</strong></p>
            </div>
        </div>
    </section>
    <!-- <section class="questionsAsked">
        <OtherQuestions prompt={prompts} />
    </section> -->
    <section class="dropdown">
        <details bind:open={moreDetails}>
            <summary>&nbsp;{$format('show_more_details_text')}&nbsp;</summary>
            <div>
                <table border="1">
                    <caption>Product Specifications</caption>
                    <thead>
                        <tr align="left">
                            <td>
                                <b>Feature</b>
                            </td>
                            <td colspan="6">
                                <b>Description</b>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {#if 'Total System Ports' in modelKeyInstances}
                            <tr>
                                <td
                                    style="vertical-align: top;"
                                    rowspan={modelKeyInstances['Total System Ports'] + 1}
                                    ><p><b>Ports</b></p></td
                                >
                                <td style="vertical-align: top;"><p><b>Model Name</b></p></td>
                                <td style="vertical-align: top;"
                                    ><p><b>Total System Ports</b></p></td
                                >
                                <td colspan="2" style="vertical-align: top;"
                                    ><p><b>Downlink Ports</b></p></td
                                >
                                <td style="vertical-align: top;" colspan="2"
                                    ><p><b>Uplink Ports</b></p></td
                                >
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                {#if 'Downlink Ports' in obj && 'Uplink Ports' in obj}
                                    <tr align="left">
                                        <td>{model}</td>
                                        <td
                                            >{obj['Total System Ports'] ||
                                                parseInt(obj['Downlink Ports']) +
                                                    parseInt(obj['Uplink Ports'], 10)}</td
                                        >
                                        <td colspan="2">{obj['Downlink Ports']}</td>
                                        <td colspan="2">{obj['Uplink Ports']}</td>
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                        {#if 'Packet Buffer' in modelKeyInstances}
                            <tr>
                                <td
                                    style="vertical-align: top;"
                                    rowspan={modelKeyInstances['Packet Buffer'] + 2}
                                    ><p><b>Packet Buffer</b></p></td
                                >
                                <td colspan="6"
                                    ><p>
                                        All numbers are aggregate across all ports as the buffers
                                        are dynamically shared
                                    </p></td
                                >
                            </tr>
                            <tr>
                                <td colspan="3"><p><b>Model Name</b></p></td>
                                <td colspan="3"><p><b>Packet Buffer</b></p></td>
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                <tr align="left">
                                    <td colspan="3"><p>{model}</p></td>
                                    <td colspan="3"><p>{obj['Packet Buffer']}</p></td>
                                </tr>
                            {/each}
                        {/if}
                        {#if 'Unit Weight' in modelKeyInstances}
                            <tr align="left">
                                <td
                                    rowspan={modelKeyInstances['Unit Dimensions'] + 1}
                                    style="vertical-align: top;"
                                    ><p><b>Unit Dimensions (W x D x H)</b></p></td
                                >
                                <td colspan="3"><p><b>Model Name</b></p></td>
                                <td colspan="3"><p><b>Unit Dimensions</b></p></td>
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                {#if 'Unit Dimensions' in obj}
                                    <tr align="left">
                                        <td colspan="3"><p>{model}</p></td>
                                        <td colspan="3"><p>{obj['Unit Dimensions']}</p></td>
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                        {#if 'Unit Weight' in modelKeyInstances}
                            <tr align="left">
                                <td
                                    rowspan={modelKeyInstances['Unit Weight'] + 1}
                                    style="vertical-align: top;"><p><b>Unit Weight</b></p></td
                                >
                                <td colspan="3"><p><b>Model Name</b></p></td>
                                <td colspan="3"><p><b>Unit Weight</b></p></td>
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                {#if 'Unit Weight' in obj}
                                    <tr align="left">
                                        <td colspan="3"><p>{model}</p></td>
                                        <td colspan="3"><p>{obj['Unit Weight']}</p></td>
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                        {#each genericsMap as [key, value], i (i)}
                            {#if typeof value === 'string' || typeof value === 'number'}
                                <tr align="left">
                                    <td colspan="2">
                                        <p>
                                            <b>{key}</b>
                                        </p>
                                    </td>
                                    <td colspan="5">
                                        {#if typeof value === 'string' && (value.startsWith('https') || value.startsWith('mailto'))}
                                            <a href={value}>{key}</a>
                                        {:else}
                                            <p>{value}</p>
                                        {/if}
                                    </td>
                                </tr>
                            {:else if typeof value === 'object' && Array.isArray(value)}
                                <tr align="left">
                                    <td style="vertical-align: top;" colspan="2">
                                        <p>
                                            <b>{key}</b>
                                        </p>
                                    </td>
                                    <td colspan="5">
                                        <ul style="padding: 0;">
                                            {#each value as v}
                                                <li style="padding: 0.2em;">{v}</li>
                                            {/each}
                                        </ul>
                                    </td>
                                </tr>
                            {/if}
                        {/each}
                        {#if 'Acoustic Noise' in modelKeyInstances}
                            <tr align="left">
                                <td
                                    style="vertical-align: top;"
                                    rowspan={modelKeyInstances['Acoustic Noise'] + 1}
                                >
                                    <p>
                                        <b>Acoustic Noise and Mean Time Between Failure (MTBF)</b>
                                    </p>
                                </td>
                                <td style="vertical-align: top;"><p><b>Model Name</b></p></td>
                                <td style="vertical-align: top;" colspan="2"
                                    ><p><b>Fan (number)</b></p></td
                                >
                                <td style="vertical-align: top;" colspan="2"
                                    ><p><b>Acoustic Noise</b></p></td
                                >
                                <td style="vertical-align: top;"
                                    ><p><b>MTBF @ 25&#8451;</b></p>
                                    <br />
                                    <b>(hours)</b></td
                                >
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                {#if 'Acoustic Noise' in obj}
                                    <tr align="left">
                                        <td>{model}</td>
                                        <td colspan="2">{obj['Fan']}</td>
                                        <td colspan="2">{obj['Acoustic Noise']}</td>
                                        <td>{obj['Mtbf']}</td>
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                        {#if 'Switching Capacity' in modelKeyInstances}
                            <tr align="left">
                                <td
                                    style="vertical-align: top;"
                                    rowspan={modelKeyInstances['Switching Capacity'] + 1}
                                >
                                    <p><b>Switching Capacity</b></p>
                                </td>
                                <td colspan="2" style="vertical-align: top;">
                                    <p><b>Model Name</b></p>
                                </td>
                                <td colspan="2" style="vertical-align: top;">
                                    <p>
                                        <b
                                            >Forwarding rate in millions of packets per second
                                            (mpps; 64-byte packets)</b
                                        >
                                    </p>
                                </td>
                                <td colspan="2" style="vertical-align: top;">
                                    <p><b>Switching Capacity in Gigabits per second (Gbps)</b></p>
                                </td>
                            </tr>
                            {#each modelsMap as [model, obj]}
                                <tr align="left">
                                    <td colspan="2">{model}</td>
                                    <td colspan="2">{obj['Forwarding Rate']}</td>
                                    <td colspan="2">{obj['Switching Capacity']}</td>
                                </tr>
                            {/each}
                        {/if}
                        {#if 'Number Of Ports Supporting PoE' in modelKeyInstances}
                            <tr align="left">
                                <td
                                    style="vertical-align: top;"
                                    rowspan={modelKeyInstances['Number Of Ports Supporting PoE'] +
                                        2}
                                >
                                    <p>
                                        <b>Power Over Ethernet</b>
                                    </p>
                                </td>
                                <td colspan="6">
                                    <p>
                                        Switches support 802.3af and 802.3at and Cisco pre-standard
                                        (legacy) PoE with maximum power of 30 W per port.
                                    </p>
                                    <br />
                                    <p>
                                        This applies to the following PoE-enabled models. The max
                                        number of ports providing PoE is determined by the total PoE
                                        budget.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="2" style="vertical-align: top;">
                                    <p><b>Model Name</b></p>
                                </td>
                                <td colspan="2" style="vertical-align: top;">
                                    <p><b>PoE Power Budget</b></p>
                                </td>
                                <td colspan="2" style="vertical-align: top;">
                                    <p><b>Number of Ports That Supports PoE</b></p>
                                </td>
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                {#if 'Power Dedicated To PoE' in obj && 'Number Of Ports Supporting PoE' in obj}
                                    <tr align="left">
                                        <td colspan="2">{model}</td>
                                        <td colspan="2">{obj['Power Dedicated To PoE']}</td>
                                        <td colspan="2">{obj['Number Of Ports Supporting PoE']}</td>
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                        {#if modelKeyInstances['Power Consumption']}
                            <tr align="left">
                                <td
                                    style="vertical-align: top;"
                                    rowspan={modelKeyInstances['Power Consumption'] + 1}
                                    ><p><b>Power Consumption</b></p></td
                                >
                                <td style="vertical-align: top;"><p><b>Model Name</b></p></td>
                                <td colspan="2" style="vertical-align: top;"
                                    ><p><b>System Power Consumption</b></p></td
                                >
                                <td colspan="2" style="vertical-align: top;"
                                    ><p><b>Power Consumption</b></p>
                                    <br />
                                    <p><b>(With PoE)</b></p></td
                                >
                                <td style="vertical-align: top;"
                                    ><p><b>Heat Dissipation (BTU/hr)</b></p></td
                                >
                            </tr>
                            {#each modelsMap as [model, obj], i (i)}
                                {#if 'Power Consumption' in obj}
                                    <tr align="left">
                                        <td><p>{model}</p></td>
                                        <td colspan="2">{obj['System Power Consumption']}</td>
                                        {#if obj['Power Consumption'] === null}
                                            <td colspan="2"><p>-</p></td>
                                        {:else}
                                            <td colspan="2"><p>{obj['Power Consumption']}</p></td>
                                        {/if}
                                        <td><p>{obj['Heat Dissipation']}</p></td>
                                    </tr>
                                {/if}
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </details>
    </section>
</div>

<style>
    .questionsAsked {
        margin-top: 3em;
    }
    .column-group p {
        font-size: var(--font-size-base);
    }

    table {
        overflow: auto !important;
        border-spacing: 0;
        border-collapse: collapse;
        table-layout: fixed;
        word-wrap: break-word;
        border: 1px solid #adadad;
        width: 100%;
        position: relative;
        font-size: calc(var(--font-size-sm) + 1.3px);
    }

    caption {
        margin-bottom: 1em;
        font-weight: 700;
        color: var(--text-color-black2);
    }

    thead {
        width: 100%;
    }
    table thead tr td {
        border-bottom: 1px solid #adadad;
        background-color: var(--cisco-dark-blue);
    }

    table thead tr td b {
        color: #fff;
    }

    table td[rowspan] {
        border-right: 1px solid #adadad;
    }

    table tbody tr {
        width: 100%;
        transition: all 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    table tbody tr:nth-child(even) {
        background-color: #d8d8d8;
    }

    table tbody tr:hover,
    table tbody tr:focus {
        background-color: #c6e9b2;
    }

    table td {
        text-align: left;
        padding: 16px 13px 16px 7px;
        border-left-width: 0;
        border-right-width: 0;
        border: 0;
        border-collapse: collapse;
        color: var(--text-color-black3);
        vertical-align: middle;
    }

    table thead td {
        vertical-align: middle;
    }

    table tbody tr td p {
        display: inline;
        line-height: 1.25;
        font-style: normal;
        font-variant: normal;
        font-weight: normal;
        margin-bottom: 3pt;
        text-align: left;
        text-decoration: none;
        text-indent: 0pt;
        text-transform: none;
        line-height: 1.7;
    }

    b {
        font-weight: 700;
        color: var(--text-color-black2);
    }

    table tbody tr td ul {
        list-style: none;
        padding-inline-start: 0;
    }

    .slide-body {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: 1fr;
        grid-auto-flow: row;
        color: var(--text-color-black2);
        align-items: end;
    }

    .col {
        padding: 0.5em;
        display: flex;
        flex-flow: column nowrap;
        row-gap: 8px;
    }

    .col > h3 {
        margin-top: 0;
    }

    .col:nth-of-type(2) {
        border: 1px solid var(--cisco-blue);
        border-radius: 10px;
    }

    .column-group {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        flex: 1;
    }

    .column-group p:nth-child(even) {
        margin-top: 0;
    }

    .column-group p:nth-child(odd) {
        margin-bottom: 0.3em;
    }

    .column-group p:last-child {
        margin-bottom: 0;
    }

    .column-header {
        font-size: var(--font-size-base);
        font-weight: 600;
        text-align: center;
        margin-bottom: 0;
    }

    .underline {
        text-decoration-line: underline;
    }

    .cisco-blue {
        color: var(--cisco-blue);
    }

    .dropdown {
        margin: 2em 0 0 0;
        padding: 1em;
        background: var(--menu-background-gray);
        border-radius: 15px;
    }

    details summary {
        outline: none;
        border: none;
        cursor: pointer;
        color: var(--text-color-black2);
    }

    strong {
        font-weight: 600;
    }

    :link {
        text-decoration: none;
        cursor: pointer;
        color: var(--cisco-dark-blue);
    }
</style>
