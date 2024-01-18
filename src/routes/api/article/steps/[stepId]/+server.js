import { prismadb } from '$lib/utils/prisma';

/** @type {import('./$types').RequestHandler} */
export async function POST(request) {
	const { stepId } = request.params;
	const { body } = request;

	const step = await prismadb.step.update({
		where: { id: stepId },
		data: {
			support_questions: body.support_questions
		}
	});
}
