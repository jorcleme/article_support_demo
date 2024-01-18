import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { PRIVATE_OPENAI_API_KEY, PRIVATE_APIFY_TOKEN } from '$env/static/private';
import { ApifyDatasetLoader } from 'langchain/document_loaders/web/apify_dataset';

const model = new OpenAI({ openAIApiKey: PRIVATE_OPENAI_API_KEY, temperature: 0 });

const templateAnswer = '{prompt}';
console.log(templateAnswer);
const prompt = new PromptTemplate({
	template: '{prompt}',
	inputVariables: ['prompt']
});

const chain = new LLMChain({ llm: model, prompt: prompt });
export const POST = async ({ request }) => {
	try {
		const requestData = await request.json();

		let lastElementContent;
		console.log('requestData from answergen:', requestData);
		if (requestData.messages) {
			console.log(
				'Request data requestData.messages[-1] from answergen:',
				requestData.messages.at(-1)
			);
			let lastElement = requestData.messages.slice(-1);
			lastElementContent = lastElement[0].content;
		}

		if (requestData.stepContextString) {
			lastElementContent = requestData.stepContextString;
			lastElementContent = `${lastElementContent}`;
		}

		lastElementContent = `${lastElementContent}`;

		// console.log('stepContextStringfrom answergen is:', stepContextString);

		if (lastElementContent === undefined) {
			return new Response('Bad Request', {
				status: 400,
				headers: {
					'Content-Type': 'text/plain'
				}
			});
		}
		const res = await chain.call({ prompt: lastElementContent });

		const answer = res.text.trim();
		console.log('From answergen:', answer);
		// Return the response using the new Response object
		return new Response(JSON.stringify({ answer }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error calling LangChain API:', error);
		return { status: 500, body: 'Internal Server Error' };
	}
};
