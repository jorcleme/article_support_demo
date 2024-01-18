import { prismadb } from '$lib/utils/prisma.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler } */
export async function POST({ params }) {
	const id = params.id;
	console.log('id', id);

	const updated = await prismadb.article.update({
		where: { document_id: id },
		data: { views: { increment: 1 } }
	});
	return json({ article: updated }, { status: 200 });
}
