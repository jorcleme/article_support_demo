<script>
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { mostRecentStep, mountedArticleSteps } from '$lib/components/store.js';
    import { _ as format } from 'svelte-i18n';

    async function apiCallFour(message, buttonText) {
        console.log('$mostRecentStep:', $mostRecentStep);
        console.log('$mountedArticleSteps:', $mountedArticleSteps);

        const stepArrayContext =
            $mostRecentStep && $mountedArticleSteps.length > 0
                ? $mountedArticleSteps.slice(0, $mostRecentStep + 1)
                : [];

        const stepContextString = stepArrayContext
            .map((step, index) => `Step ${index + 1}: ${step.text}`)
            .join('\n');
        // console.log('stepContextString is:', stepContextString);
        const res = await fetch('/api/openai/QuestionGenerator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ stepContextString })
        });

        const data = await res.json();
        questions = data.questions;
        questionsFetched = true;
    }
</script>

<div class="wrapper" in:fly={{ duration: 800, delay: 200, easing: cubicOut, x: -50 }}>
    <section class="section" id="ID-000004d8__d13686e1068">
        <h4 class="header">The following describes the different scenarios when the <span class="searchMark primary">reset</span> button is pushed for a defined set of time.</h4>
        
        <ol class="ol">
           
           <li class="li">
              
              <p class="p">When the <span class="searchMark primary">Reset</span> button is pushed for less than <strong class="ph b">1 sec</strong>, the Ethernet port LED will light in <strong class="ph b">solid Amber</strong> for 5 seconds, when the port is supplying power for the device.
              </p>
              
           </li>
           
           <li class="li">
              
              <p class="p">When the <span class="searchMark primary">Reset</span> button is pushed for <strong class="ph b">1 to 5 sec</strong>, the system LED continues to be <strong class="ph b">solid Green</strong>. If the <span class="searchMark primary">Reset</span> button is released, the system will not reload, and no action is taken. 
              </p>
              
           </li>
           
           <li class="li">
              
              <p class="p">When the <span class="searchMark primary">Reset</span> button is pushed for <strong class="ph b">6 to 10 sec</strong>, the system LED will <strong class="ph b">slowly flash Green</strong>. If the <span class="searchMark primary">Reset</span> button is released, the system will reload without a factory default.
              </p>
              
           </li>
           
           <li class="li">
              
              <p class="p">When the <span class="searchMark primary">Reset</span> button is pushed for <strong class="ph b">11 to 15 sec</strong>, the system LED will light in <strong class="ph b">solid Green</strong>. If the <span class="searchMark primary">Reset</span> button is released, the system does not reload, and no action is taken.
              </p>
              
           </li>
           
           <li class="li">
              
              <p class="p">When the <span class="searchMark primary">Reset</span> button is pushed for <strong class="ph b">16 to 20 sec</strong>, the system LED will <strong class="ph b">rapidly flash Green</strong>. If the <span class="searchMark primary">Reset</span> button is released, the system will reload to factory default settings.
              </p>
              
           </li>
           
           <li class="li">
              
              <p class="p">When the <span class="searchMark primary">Reset</span> button  is pushed for <strong class="ph b">more than 20 sec</strong>, the system LED will light in <strong class="ph b">solid Green</strong>. If the <span class="searchMark primary">Reset</span> button is released, the system does not reload, and no action is taken.
              </p>
              
           </li>
           
        </ol>
        
     </section>
</div>

<style>

.header {
        font-weight: bold;
        color: var(--cisco-dark-blue);
        margin: 0.5em;
        font-size: var(--font-size-md);
        text-align: left;
    }

    .primary {
        font-weight: 700;
    }

    .b {
        font-weight: 700;
    }
  
    .p {
        font-size: calc(var(--font-size-sm) + 1px);
        line-height: 1.4em;
        font-weight: 500;
        margin: 12px 0;
        word-wrap: break-word;
        color: var(--cisco-dark-blue);
    }


    .wrapper {
        background: var(--menu-background-gray);
        border-radius: 16px;
        padding: 1em 0;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }

    section {
        padding: 0 1em;
    }

    li::marker {
        font-weight: bold;
        color: var(--cisco-blue);
    }
</style>
