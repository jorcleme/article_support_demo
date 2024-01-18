import { locale } from 'svelte-i18n';

/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }) {
    // fallback is 'en';
    const lang = event.request.headers.get('Accept-Language')?.split(',')[0] || 'en';
    if (lang) {
        locale.set(lang);
    }
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html.replace('%lang%', lang);
        }
    });
    // response.headers.set('cache-control', 'max-age=31536000');
    // console.log('response', response)
    // console.log(response.headers)
    return response;
}
