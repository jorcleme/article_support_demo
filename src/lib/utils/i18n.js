import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';

const defaultLocale = 'en';

register('en', () => import('$lib/locales/en.json'));
register('cn', () => import('$lib/locales/cn.json'));
register('fr', () => import('$lib/locales/fr.json'));
register('jp', () => import('$lib/locales/jp.json'));

init({
    fallbackLocale: 'en',
    initialLocale: browser ? getLocaleFromNavigator() : defaultLocale
});
