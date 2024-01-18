/** @type { import('./$types').PageServerLoad } */
// eslint-disable-next-line no-unused-vars
export async function load({ url, params, fetch }) {
    // Setting a default for Demo purposes only. Should *params.model*
    const model = params.model;
    const search = new URLSearchParams([['model', model]]);

    const { media } = await fetch(`/media.json?${search}`).then((res) => res.json());

    return {
        media
    };
}
