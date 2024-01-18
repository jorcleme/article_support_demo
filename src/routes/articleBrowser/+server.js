// import { json } from '@sveltejs/kit';
// // Former openai imports, langchain already contains openai so we import from there
// // import { Configuration, OpenAIApi } from 'openai';

// // migrating to langchain
// import { OpenAI } from 'langchain/llms/openai';
// import { LLMChain } from 'langchain/chains';
// import { PromptTemplate } from 'langchain/prompts';
// import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';

// const model = new OpenAI({ openAIApiKey: PRIVATE_OPENAI_API_KEY, temperature: 0.9 });

// const template =
//     '{prompt} - given all this, what are three questions a user may have about this step?';
// const prompt = new PromptTemplate({
//     template: template,
//     inputVariables: ['prompt']
// });

// const chain = new LLMChain({ llm: model, prompt: prompt });
// export const POST = async ({ request }) => {
//     const { messages } = await request.json();

//     // Create the prompt string from the messages array
//     const contextMessage = messages
//         .map((message) => `${message.role}: ${message.content}`)
//         .join('\n');

//     try {
//         const res = await chain.call({ prompt: contextMessage });
//         const chatGPTMessage = res.text.trim();
//         console.log('chatGPTMessage:', chatGPTMessage);

//         return json({ chatGPTMessage: chatGPTMessage });
//     } catch (error) {
//         console.error('Error calling LangChain API:', error);
//         return { status: 500, body: 'Internal Server Error' };
//     }
// };
