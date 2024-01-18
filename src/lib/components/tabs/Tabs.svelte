<script context="module">
    export const TABS = {};
</script>

<script>
    import { setContext, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';

    const tabs = [];
    const panels = [];
    const selectedTab = writable(null);
    const selectedPanel = writable(null);

    setContext(TABS, {
        registerTab: (tab) => {
            tabs.push(tab);
            selectedTab.update((current) => current || tab);

            onDestroy(() => {
                const index = tabs.indexOf(tab);
                tabs.splice(index, 1);
                selectedTab.update((current) =>
                    current === tab ? tabs[index] || tabs[tabs.length - 1] : current
                );
            });
        },
        registerPanel: (panel) => {
            panels.push(panel);
            selectedPanel.update((current) => current || panel);

            onDestroy(() => {
                const index = panels.indexOf(panel);
                panels.splice(index, 1);
                selectedPanel.update((current) =>
                    current === panel ? panels[index] || panels[panels.length - 1] : current
                );
            });
        },
        selectTab: (tab) => {
            const selectedTabIndex = tabs.indexOf(tab);
            selectedTab.set(tab);
            selectedPanel.set(panels[selectedTabIndex]);
        },
        selectedTab,
        selectedPanel
    });

    export let wrapperDivClass = 'tabs';
    /**
     *
     * @param {Event} event
     */
    async function handleKeyDown(event) {
        event.preventDefault();
        let selectedIndex = tabs.indexOf($selectedTab);

        switch (event.key) {
            case 'ArrowRight':
                console.log(event.key);
                selectedIndex += 1;
                if (selectedIndex > tabs.length - 1) {
                    selectedIndex = 0;
                }
                selectedTab.set(tabs[selectedIndex]);
                selectedPanel.set(panels[selectedIndex]);
                return;

            case 'ArrowLeft':
                console.log(event);
                selectedIndex -= 1;
                if (selectedIndex < 0) {
                    selectedIndex = tabs.length - 1;
                }
                selectedTab.set(tabs[selectedIndex]);
                selectedPanel.set(panels[selectedIndex]);
                return;
        }
    }
</script>

<div class={wrapperDivClass} on:keydown={handleKeyDown}>
    <slot />
</div>
