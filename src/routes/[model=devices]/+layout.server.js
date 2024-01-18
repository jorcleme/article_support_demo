/** @type { import ('./$types').LayoutServerLoad } */

export async function load({ params, fetch }) {
    const search = new URLSearchParams([['model', params.model]]);
    const { datasheet, similarSeries, devices } = await fetch(`/datasheets.json?${search}`).then(
        (res) => res.json()
    );

    return {
        datasheet,
        similarSeries,
        devices
    };
}
