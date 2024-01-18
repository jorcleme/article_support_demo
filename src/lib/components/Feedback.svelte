<script>
    import IconFeedback from '$lib/components/IconFeedback.svelte';
    import { cubicIn } from 'svelte/easing';
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';

    let chatOpen = false;
    let selectedIssue;
    let ellipsisOpen = false;
    let email;
    let name;
    let message;
    let messageSubmitted = false;

    function styleOverflow(style) {
        setTimeout(() => {
            document.querySelector('body').style.overflowY = style;
        }, 1300);
    }

    onMount(() => {
        selectedIssue = null;
        messageSubmitted = false;
    });
    function handleClick() {
        chatOpen = !chatOpen;

        if (chatOpen) {
            styleOverflow('hidden');
            // document.querySelector('body').style.overflowY = 'hidden';
        } else {
            styleOverflow('auto');
            // document.querySelector('body').style.overflowY = 'scroll';
        }
    }

    function handleSupportSelection() {
        console.log('Selected User Issue: ', selectedIssue);
    }

    function handleEllipsis() {
        ellipsisOpen = !ellipsisOpen;
    }

    const handleNewIssue = () => {
        selectedIssue = null;
        ellipsisOpen = false;
    };

    function determineMailTo(topic) {
        switch (topic) {
            case 'Hardware Installation Guide' ||
                'The Virtual Assistant' ||
                'Support Pages or Emulators':
                return 'smb_dev@cisco.com';
            case 'Documenation or Video':
                return 'smbcontent@cisco.com';
            default:
                return 'smb_dev@cisco.com';
        }
    }

    async function handleSubmit() {
        const to = determineMailTo(selectedIssue);
        const sendMail = document.createElement('a');
        sendMail.href = `mailto:${to}?subject=Issue With: ${selectedIssue} from: ${name} &body=${message}\n`;
        sendMail.click();
        messageSubmitted = true;
        setTimeout(() => {
            chatOpen = !chatOpen;
        }, 300);
    }
</script>

{#key chatOpen}
    {#if chatOpen}
        <div
            transition:fly={{ delay: 200, duration: 1200, easing: cubicIn, y: 100 }}
            role="document"
            id="chat_container"
        >
            <div class="contact_capture">
                <div class="content">
                    <div class="layer1">
                        <div class="header">
                            <div class="header_items">
                                <h2>Contact Us</h2>
                                <div class="button_options">
                                    <button on:click={handleEllipsis}>&vellip;</button>
                                    <button on:click={handleClick}>&times;</button>
                                </div>
                                {#if ellipsisOpen}
                                    <div
                                        in:fly={{
                                            delay: 200,
                                            duration: 800,
                                            easing: cubicIn,
                                            x: -10
                                        }}
                                        class="ellipsisOptions"
                                    >
                                        <button class="btn" on:click={handleNewIssue}
                                            >Select A Different Issue</button
                                        >
                                        <button class="btn" on:click={handleEllipsis}>Back</button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        <div class="topics">
                            {#if !selectedIssue}
                                <div class="form-container form">
                                    <p style="padding: 3px 6px; text-align: center;">
                                        I'm Having An Issue With&colon;
                                    </p>
                                    <div class="grid">
                                        <label
                                            for="guide"
                                            class="item"
                                            class:selected={selectedIssue ===
                                                'Hardware Installation Guide'}
                                        >
                                            <input
                                                id="guide"
                                                type="radio"
                                                style="display: none;"
                                                value="Hardware Installation Guide"
                                                bind:group={selectedIssue}
                                                on:change={handleSupportSelection}
                                            />
                                            <span>Hardware Installation Guide</span>
                                        </label>
                                        <label
                                            for="docs"
                                            class="item"
                                            class:selected={selectedIssue ===
                                                'Documentation or Video'}
                                        >
                                            <input
                                                id="docs"
                                                type="radio"
                                                style="display: none;"
                                                value="Documentation or Video"
                                                bind:group={selectedIssue}
                                                on:change={handleSupportSelection}
                                            />
                                            <span>Documentation or Video</span>
                                        </label>
                                        <label
                                            for="assistant"
                                            class="item"
                                            class:selected={selectedIssue ===
                                                'The Virtual Assistant'}
                                        >
                                            <input
                                                id="assistant"
                                                type="radio"
                                                style="display: none;"
                                                value="The Virtual Assistant"
                                                bind:group={selectedIssue}
                                                on:change={handleSupportSelection}
                                            />
                                            <span>The Virtual Assistant</span>
                                        </label>
                                        <label
                                            for="support"
                                            class="item"
                                            class:selected={selectedIssue ===
                                                'Support Pages or Emulators'}
                                        >
                                            <input
                                                id="support"
                                                type="radio"
                                                style="display: none;"
                                                value="Support Pages or Emulators"
                                                bind:group={selectedIssue}
                                                on:change={handleSupportSelection}
                                            />
                                            <span>Support Pages or Emulators</span>
                                        </label>
                                    </div>
                                </div>
                            {/if}
                        </div>
                        {#if selectedIssue}
                            <div id="form" class="form">
                                <div
                                    in:fly={{
                                        delay: 200,
                                        duration: 800,
                                        easing: cubicIn,
                                        x: -20
                                    }}
                                    class="wrapper"
                                >
                                    <div class="form-group">
                                        <label for="topic" class="prettify-label">Issue</label>
                                        <input
                                            id="topic"
                                            class="prettify"
                                            name="topic"
                                            type="text"
                                            placeholder={selectedIssue}
                                            value={selectedIssue}
                                            readonly
                                            disabled
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="youremail@cisco.com"
                                            autocomplete="email"
                                            form="form"
                                            bind:value={email}
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="name">Your Full Name</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            autocomplete="name"
                                            form="form"
                                            bind:value={name}
                                        />
                                    </div>
                                    <div class="message-group">
                                        <label for="message">Your Experience</label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            bind:value={message}
                                            cols="30"
                                            rows="5"
                                            required
                                            spellcheck="true"
                                            form="form"
                                            placeholder="Tell us about the issue and provide as much details as possible. We appreciate all feedback to make our products better and more accessible."
                                        />
                                    </div>
                                    <div class="form-group">
                                        <button
                                            form="form"
                                            class="btn"
                                            type="submit"
                                            on:click={handleSubmit}>Submit</button
                                        >
                                    </div>
                                </div>
                                {#if messageSubmitted}
                                    <p>Message Sent! Thank you for your feedback.</p>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    <div class="feedback_container">
        <button class="btn_interact" on:click={handleClick} tabindex="0">
            <span class="button_label">
                <span class="ally_screen_reader"
                    >Have a problem? Chat with us and leave us feedback</span
                >
            </span>
            <span class="end_icon">
                <IconFeedback />
            </span>
        </button>
    </div>
{/key}

<style>
    @media only screen and (max-width: 768px) {
        #chat_container {
            max-width: 448px;
        }
    }

    .message-group {
        display: flex;
        flex-direction: column;
    }

    .grid {
        display: grid;
        grid-auto-flow: row dense;
        height: 100%;
    }

    .form {
        color: #333;
        letter-spacing: -1px;
        min-height: 458px;
    }

    .form-group {
        margin-bottom: 17px;
    }

    .form-group > label,
    .message-group > label {
        margin-bottom: 9px;
        display: block;
        color: var(--cisco-midnight-blue);
    }

    textarea {
        resize: none;
        border-radius: 2px;
        padding: 5px;
        outline: 1px solid var(--border-gray);
        caret-color: var(--cisco-blue);
    }

    textarea:focus {
        outline: 1px solid var(--cisco-midnight-blue);
        border-radius: 2px;
    }

    .form-group > input {
        border: 1px solid var(--border-gray);
        display: block;
        width: 100%;
        height: 40px;
        padding: 0 20px;
        border-radius: 20px;
        background: 0 0;
    }

    .form-group:first-of-type > input {
        border: none;
    }

    .form-group > input:focus {
        outline: 1px solid var(--cisco-midnight-blue);
    }

    .form-group > input:user-valid {
        border: 1px solid var(--theme-success);
    }

    .form-group > input:user-invalid {
        border: 1px solid var(--theme-danger);
    }

    .item {
        display: inline-flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: center;
        text-decoration: none;
        background-color: transparent;
        outline: none;
        border: 1px solid var(--border-gray);
        cursor: pointer;
        border-radius: 14px;
        padding: 1em;
        flex: 0 1 250px;
        margin: 1em 0;
        transition: all 0.25s ease-in;
        color: var(--cisco-midnight-blue);
        font-size: var(--font-size-base);
        font-family: 'CiscoSansTTBold';
        box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0,
            rgba(0, 0, 0, 0.12) 0 1px 18px 0;
        overflow: hidden;
        font-kerning: none;
    }

    .btn {
        text-decoration: none;
        cursor: pointer;
        margin: 1em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--btn-blue-1);
        color: white;
        padding: 1em 2em;
        border-radius: 32px;
        transition: all 0.2s ease-in-out;
        border: var(--btn-blue-1) 1px solid;
        width: 100%;
    }

    .selected {
        background-color: var(--cisco-midnight-blue);
        color: whitesmoke;
        border: 1px solid var(--cisco-blue);
    }

    #chat_container {
        width: auto;
        min-width: 445px;
        max-width: 445px;
        right: 16px;
        bottom: 5px;
        max-height: 100%;
        position: fixed;
        display: flex;
        z-index: 10000;
        transition: height 0.2s ease 0s, max-width 0.2s ease 0s, min-width 0.2s ease 0s,
            bottom 0.2s ease 0s, right 0.2s ease 0s;
    }

    .ellipsisOptions {
        position: absolute;
        inset: 48px 0px 0px;
        overflow: hidden auto;
        padding: 1em 18px;
        background-color: rgb(255, 255, 255);
        color: #333;
        z-index: 10001;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .contact_capture {
        -webkit-box-flex: 1;
        flex-grow: 1;
        display: flex;
        animation-timing-function: ease-in-out;
        animation-fill-mode: both;
        animation-duration: 250ms;
        animation-name: iYtCBa;
    }

    .content {
        -webkit-box-flex: 1;
        flex-grow: 1;
        border-radius: 0px 0px 8px 8px;
        overflow: hidden;
        position: relative;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 0px 25px;
        display: flex;
        flex-direction: column;
        font-family: 'CiscoSansTT', sans-serif;
        box-sizing: border-box;
    }

    .layer1 {
        background-color: rgb(255, 255, 255);
        display: flex;
        flex: 1 1 0%;
        flex-direction: column;
        overflow: hidden;
        overscroll-behavior-y: contain;
    }

    .header {
        flex-shrink: 0;
    }

    .header h2 {
        margin: 0;
        font: 700 var(--font-size-md) 'CiscoSansThin';
    }

    .header_items {
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        align-items: center;
        height: 48px;
        font-size: 18px;
        padding: 0px 8px 0px 18px;
        color: rgb(31, 31, 31);
        background: rgb(245, 247, 248);
        transition: color 200ms ease 0s, background-color 200ms ease 0s;
    }

    .button_options {
        -webkit-box-align: center;
        align-items: center;
        display: flex;
        flex-shrink: 0;
        height: 100%;
        margin-left: auto;
    }

    .button_options > button {
        padding: 0px;
        margin-left: 2px;
        width: 44px;
        height: 44px;
        display: flex;
        flex-shrink: 0;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        border-radius: 50%;
        cursor: pointer;
        border: none;
        outline: none;
        transition: background 200ms ease 0s;
    }
    .feedback_container {
        position: fixed;
        z-index: 999;
        bottom: 12px;
        right: 12px;
        animation: 0.2s ease-out 0s 1 normal both running animation-1m49nxd;
    }

    @keyframes animation-1m49nxd {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }
    .btn_interact {
        appearance: button;
        text-transform: none;
        text-align: center;
        max-width: 320px;
        min-width: unset;
        transition: none 0s ease 0s;
        color: #fff;
        background-color: var(--btn-blue-1);
        font: 'CiscoSansTT';
        width: 56px;
        height: 56px;
        padding: 12px !important;
        border-radius: 50% !important;
        box-shadow: rgba(31, 31, 31, 0.5) 2px 2px 5px 0px !important;
        border: 0;
        cursor: pointer;
        margin: 0;
        display: inline-flex;
        outline: 0;
        position: relative;
        align-items: center;
        user-select: none;
        vertical-align: middle;
        -moz-appearance: none;
        justify-content: center;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }

    button:hover {
        background-color: var(--btn-hover-main);
        border-color: var(--btn-hover-main);
    }

    .button_label {
        width: 100%;
        display: inherit;
        justify-content: inherit;
        align-items: inherit;
        text-transform: none;
    }

    .ally_screen_reader {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        clip-path: inset(50%);
        border: 0;
        text-transform: none;
    }

    .end_icon {
        margin: 0;
        display: inherit;
    }

    .form {
        padding: 1em 18px;
    }
</style>
