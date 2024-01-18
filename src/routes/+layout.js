import { browser } from '$app/environment';
import '$lib/utils/i18n.js';
import { locale, waitLocale } from 'svelte-i18n';

/**
 * @type {import('./$types').LayoutLoad}
 */
export const load = async ({ url }) => {
    if (browser) {
        locale.set(window.navigator.language);
    }
    await waitLocale();
    return { url: url.pathname };
};
