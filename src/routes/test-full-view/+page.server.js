export async function load({ fetch }) {
	const res = await fetch('/api/article');
	const { article } = await res.json();
	console.log('data from article.js', article);
	return {
		article: article
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	thumbsUp: async (event) => {
		const formData = await event.request.formData();
		console.log('formData', formData);
		const { option1, option2, option3, textarea } = formData;
		if (event.url.searchParams.has('redirectTo')) {
			return {
				status: 303,
				headers: {
					location: event.url.searchParams.get('redirectTo')
				}
			};
		}

		return { success: true };
	},
	thumbsDown: async (event) => {
		const formData = await event.request.formData();
		console.log('formData', formData);
	}
};
