import MediaJSON from '$lib/data/beta-media.json';

/**
 *
 * @param {String} model
 * @returns all media content for the active series
 */
export function getMedia(model) {
	const series = normalizeSeries(model.split('-')[0]);
	const media = MediaJSON.find((med) => med.series === series).media;
	let { videos, articles } = media;
	console.log('articles', articles);
	videos = videos.map((video) => {
		return {
			...video,
			search_terms: `${video.title} ${video.description} ${video.category}`
		};
	});

	return { videos, articles };
}

function normalizeSeries(seriesPrefix) {
	switch (seriesPrefix) {
		case 'C1200':
			return 'Cisco Catalyst 1200 Series Switches';
		default:
			return 'Cisco Catalyst 1200 Series Switches';
	}
}
