import { json } from '@sveltejs/kit';
import { getDatasheet } from './_datasheet.js';

/** @type { import('./$types').RequestHandler} */
export async function GET({ url }) {
    const deviceModel = url.searchParams.get('model');
    console.log('from Datasheets.json API: ', deviceModel);
    const { datasheet, similarSeries } = await getDatasheet(deviceModel);

    return json(
        { datasheet, similarSeries, devices: [] },
        {
            status: 200,
            headers: {
                'cache-control': 'max-age=14400',
            }
        }
    );
}


