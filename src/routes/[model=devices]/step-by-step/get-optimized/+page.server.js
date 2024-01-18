export const prerender = 'auto';

/** @type {import('./$types').PageServerLoad } */
export async function load({ fetch, params }) {
    const model = params.model;
    const search = new URLSearchParams([['model', model]]);
    const { media } = await fetch(`/media.json?${search}`).then((res) => res.json());

    return {
        media
    };
}
