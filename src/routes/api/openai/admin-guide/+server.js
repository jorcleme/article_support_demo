import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';

export async function GET({ request }) {
	try {
		// const loader = new CheerioWebBaseLoader(
		// 	'https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/catalyst-1200-1300/AdminGuide/catalyst-1200-admin-guide.html',
		// 	{
		// 		selector: '#pageContentDiv'
		// 	}
		// );
		// const pageContent = await loader.load();
		// const text2Split = pageContent.map((x) => x.pageContent);
		// console.log('pageContent:', pageContent);
		// const splitter = RecursiveCharacterTextSplitter.fromLanguage('html', {
		// 	chunkSize: 180,
		// 	chunkOverlap: 0
		// });
		// const chunks = await splitter.createDocuments(text2Split);
		// console.log('chunks:', chunks);
		// const charSplitter = new CharacterTextSplitter({ chunkSize: 3000, chunkOverlap: 0 });
		const pdfLoader = new PDFLoader('src/lib/server/catalyst-1200-admin-guide.pdf', {
			splitPages: true
		});
		const documents = await pdfLoader.load();
		const vector = await HNSWLib.fromDocuments(
			documents,
			new OpenAIEmbeddings({ openAIApiKey: PRIVATE_OPENAI_API_KEY })
		);
		const model = new OpenAI({
			openAIApiKey: PRIVATE_OPENAI_API_KEY,
			temperature: 0,
			cache: true
		});
		const chain = new RetrievalQAChain({
			combineDocumentsChain: loadQAStuffChain(model),
			retriever: vector.asRetriever(),
			returnSourceDocuments: true
		});
		const req = await chain.call({
			query: 'How do I enable smartports on a Cisco Catalyst 1300?'
		});
		console.log('req:', req);
		return new Response(null, { status: 200, statusText: 'OK' });
	} catch (err) {
		console.error('Error calling LangChain API:', err);
		return { status: 500, body: 'Internal Server Error' };
	}
}
