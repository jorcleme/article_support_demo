// // src/routes/openai.js
// // import openai from 'openai';
// import { Configuration, OpenAIApi } from 'openai';
// import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';

// const config = new Configuration({
//     apiKey: PRIVATE_OPENAI_API_KEY
// });

// const openai = new OpenAIApi(config);

// // openai.apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// // console.log('OpenAI API Key:', openai.apiKey);
// export async function POST(event) {
//     // console.log('Received request:', request);

//     try {
//         const data = await event.request.json();
//         console.log('Received request:', data);
//         const { prompt, maxTokens } = data;

//         // const { prompt, maxTokens } = event.request.body;

//         // console.log('Prompt and maxTokens:', prompt, maxTokens);
//         console.log('prompt:', prompt);
//         console.log('maxTokens:', maxTokens);
//         const response = await openai.Completion.create({
//             engine: 'davinci-codex',
//             prompt,
//             max_tokens: maxTokens,
//             n: 1,
//             stop: null,
//             temperature: 0.5
//         });

//         const choice = response.choices && response.choices.length > 0 ? response.choices[0] : null;

//         return {
//             status: 200,
//             body: {
//                 data: choice
//             }
//         };
//     } catch (error) {
//         console.error('Error in OpenAI API call:', error);
//         return {
//             status: 500,
//             body: {
//                 error: 'Error in OpenAI API call'
//             }
//         };
//     }
// }
