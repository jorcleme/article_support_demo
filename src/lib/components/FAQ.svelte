<script>
    import { AppCurrentSeries } from './store';
    import { _ as format } from 'svelte-i18n';

    let inputIsChecked;

    $: current = COMBINED_FAQS.find((series) => series.instance);
    $: questions = 'faq' in current ? current.faq : [];
    $: activeFAQs = Object.entries(questions);

    const CISCO_CATALYST_1200_AND_1300 = {
        applicableDevices: [
            'Cisco Catalyst 1200 Series Switches',
            'Cisco Catalyst 1300 Series Switches'
        ],
        get instance() {
            return this.applicableDevices.includes($AppCurrentSeries);
        },
        faq: {
            [`${$format('frequently_asked_question_category_general')}`]: [
                {
                    question: `${$format('frequently_asked_question_1')}`,
                    answer: `${$format('frequently_asked_question_answer_1')}`
                },
                {
                    question: `${$format('frequently_asked_question_2')}`,
                    answer: `${$format('frequently_asked_question_answer_2')}`
                },
                {
                    question: `${$format('frequently_asked_question_3')}`,
                    answer: `${$format('frequently_asked_question_answer_3')}`
                },
                {
                    question: `${$format('frequently_asked_question_4')}`,
                    answer: `${$format('frequently_asked_question_answer_4')}`
                },
                {
                    question: `${$format('frequently_asked_question_5')}`,
                    answer: `${$format('frequently_asked_question_answer_5')}`
                },
                {
                    question: `${$format('frequently_asked_question_6')}`,
                    answer: `${$format('frequently_asked_question_answer_6')}`
                }
            ]
        }
    };

    const COMBINED_FAQS = [CISCO_CATALYST_1200_AND_1300];
</script>

<section class="frequently-asked-questions">
    <div class="faq-title">
        <h3 class="section-title">{$format('frequently_asked_questions_header')}</h3>
    </div>
    <div class="faq-attributes">
        <label
            name={$format('frequently_asked_question_category_all')}
            for={$format('frequently_asked_question_category_all')}
        >
            <input
                id={$format('frequently_asked_question_category_all')}
                type="radio"
                value={$format('frequently_asked_question_category_all')}
                bind:group={inputIsChecked}
            />
            <span>{$format('frequently_asked_question_category_all')}</span>
        </label>
        {#each activeFAQs as [name, items], i (i)}
            <label for={name} {name}>
                <input id={name} type="radio" value={name} bind:group={inputIsChecked} />
                <span>{name}</span>
            </label>
        {/each}
    </div>
    <div class="faq-questions">
        {#each activeFAQs as [name, items], i (i)}
            {#if inputIsChecked === `${$format('frequently_asked_question_category_all')}`}
                <h2>{name}</h2>
                {#each items as { question, answer }, j (j)}
                    <details title={answer}>
                        <summary>{question}</summary>
                        <article>{@html answer}</article>
                    </details>
                {/each}
            {:else if inputIsChecked === name}
                <h2>{name}</h2>
                {#each items as { question, answer }, j (j)}
                    <details title={answer}>
                        <summary>{question}</summary>
                        <article>{@html answer}</article>
                    </details>
                {/each}
            {/if}
        {/each}
    </div>
</section>

<style>
    label {
        text-align: center;
        white-space: nowrap;
    }

    [type='radio'] {
        display: none;
    }
    [type='radio'] ~ span {
        padding: 1em;
        font-size: var(--font-size-base);
        color: #575757;
        font-weight: bold;
        border: 1px solid var(--btn-hover-color-gray);
        border-radius: 30px;
        display: inline-block;
        min-width: 12em;
    }
    [type='radio']:checked ~ span {
        background-color: var(--btn-blue-1);
        color: white;
    }

    details {
        padding: 1em 1.5em;
        border: #d2d2d2 1px solid;
        border-radius: 5px;
        -webkit-transition: all 0.25s ease-in;
        -o-transition: all 0.25s ease-in;
        transition: all 0.25s ease-in;
        margin: 1em;
        color: var(--text-color-black3);
        font-family: 'CiscoSansTTBold';
    }

    details > article {
        color: var(--text-color-black3);
        font-family: 'CiscoSansTT';
    }

    :link {
        color: #2b5592;
        font-weight: 700;
    }

    .faq-questions > h2,
    .faq-title > h3 {
        color: var(--text-color-black2);
        font-weight: 700;
        font-size: var(--font-size-md);
    }
    .frequently-asked-questions {
        margin: 3em 0;
    }

    .frequently-asked-questions > .faq-title {
        padding: 1em 0;
    }

    .faq-attributes {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        align-items: center;
        gap: 20px;
        margin-bottom: 1em;
    }
    .faq-attributes span:hover {
        background-color: var(--cisco-dark-blue);
        border: 1px solid var(--cisco-blue);
        color: whitesmoke;
        cursor: pointer;
    }
</style>
