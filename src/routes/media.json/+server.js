import { json } from '@sveltejs/kit';
import { getMedia } from './_helper';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const deviceModel = url.searchParams.get('model');
    console.log('from Media.json API (GET): ', deviceModel);
    const media = getMedia(deviceModel);

    return json(
        { media: media },
        {
            status: 200,
            headers: {
                'cache-control': 'max-age=14400'
            }
        }
    );
}
