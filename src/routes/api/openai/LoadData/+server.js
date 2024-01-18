// import { Configuration, OpenAIApi } from 'openai';
// import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';
// import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { RetrievalQAChain } from 'langchain/chains';
// import { ChatOpenAI } from 'langchain/chat_models/openai';
// import { ConversationalRetrievalQAChain } from 'langchain/chains';
// import { BufferMemory } from 'langchain/memory';

// const config = new Configuration({
//     apiKey: PRIVATE_OPENAI_API_KEY
// });

// const openai = new OpenAIApi(config);

// const loader = new CheerioWebBaseLoader(
//     'https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-1200-series-switches/nb-06-cat1200-ser-data-sheet-cte-en.html'
// );

// const datasheet = await loader.load();

// /** @type { import('./$types').RequestHandler } */
// export async function POST({ request }) {
//     try {
//         const model = new ChatOpenAI({
//             modelName: 'gpt-3.5-turbo',
//             openAIApiKey: PRIVATE_OPENAI_API_KEY
//         });
//         const memory = new BufferMemory({
//             memoryKey: 'chat_history',
//             returnMessages: true
//         });
//         const body = await request.json();
//         const splitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 500,
//             chunkOverlap: 0
//         });

//         const splitDocument = await splitter.splitDocuments(datasheet);

//         const embeddings = new OpenAIEmbeddings({ openAIApiKey: PRIVATE_OPENAI_API_KEY });
//         const vectorStore = await MemoryVectorStore.fromDocuments(splitDocument, embeddings);
//         const requestData = body.prompt;
//         const relavantDocs = await vectorStore.similaritySearch(requestData);
//         console.log('Relevant Docs: ', relavantDocs);
//         const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
//             memory
//         });
//         console.log('requestData is: ', requestData);
//         const response = await chain.call({
//             question: requestData
//         });
//         console.log(response);
//         return new Response(JSON.stringify({ splitDocument: response.text.trim() }), {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//     } catch (err) {
//         console.error('Error from LoadData');
//         return new Response(JSON.stringify({ body: 'Internal Server Error' }), {
//             status: 500
//         });
//     }
// }
