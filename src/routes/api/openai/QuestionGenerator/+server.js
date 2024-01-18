import { json } from '@sveltejs/kit';
import { OpenAI } from 'langchain/llms/openai';
import { LLMChain, SimpleSequentialChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { PRIVATE_OPENAI_API_KEY, PRIVATE_OPENAI_BACKUP_API_KEY } from '$env/static/private';

/** @type { import('./$types').RequestHandler} */
export async function POST({ request }) {
	const model = new OpenAI({
		openAIApiKey: PRIVATE_OPENAI_BACKUP_API_KEY,
		temperature: 0
	});
	const template =
		'{prompt} - given all this context, what are three questions a user may have about the most recent step? Return only the questions.';

	const prompt = new PromptTemplate({
		template: template,
		inputVariables: ['prompt']
	});

	const dynamicQuestionsChain = new LLMChain({ llm: model, prompt: prompt });
	const staticQuestionTemplate = '{question} ';
	try {
		const requestData = await request.json();
		console.log('Request data:', requestData);

		const stepContextString = `${requestData.stepContextString}`;
		console.log('stepContextString from question gen:', stepContextString);

		const res = await dynamicQuestionsChain.call({ prompt: stepContextString });
		console.log('From QuestionsGen here is the response: ', { res });
		const chatGPTMessage = res.text.trim();
		console.log('chatGPTMessage:', chatGPTMessage);

		const questions = chatGPTMessage
			.split(/[\n;]|1\.\s*|2\.\s*|3\.\s*/)
			.filter((q) => q)
			.slice(0, 3);
		return json({ questions });
	} catch (error) {
		console.error('Error calling LangChain API:', error);
		return { status: 500, body: 'Internal Server Error' };
	}
}
