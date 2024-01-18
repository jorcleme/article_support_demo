/** @type { import('./$types').PageServerLoad } */
export async function load({ fetch, url }) {
    const search = new URLSearchParams([
        ['model', 'CBS350-24FP-4G'],
        ['attributes', url.searchParams.getAll('attributes')]
    ]);
    const { media } = await fetch(`/media.json?${search}`).then((res) => res.json());

    return {
        media
    };
}
