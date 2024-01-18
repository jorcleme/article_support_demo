import { json } from '@sveltejs/kit';
import articles from '$lib/data/step_with_mobile_text.json';
import { OpenAI } from 'langchain/llms/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { CacheBackedEmbeddings } from 'langchain/embeddings/cache_backed';
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private';
import { MultiVectorRetriever } from 'langchain/retrievers/multi_vector';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { InMemoryStore } from 'langchain/storage/in_memory';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { Document } from 'langchain/document';
import { ScoreThresholdRetriever } from 'langchain/retrievers/score_threshold';
import { SearchApiLoader } from 'langchain/document_loaders/web/searchapi';

const caseNotes = 'Bluetooth Features not working on switch';
const embeddings = new OpenAIEmbeddings({ openAIApiKey: PRIVATE_OPENAI_API_KEY });
const createQueryEmbeddings = async (notes) => {
    const queryEmbeddings = await embeddings.embedQuery(notes);
    return queryEmbeddings;
};
const inMemoryStore = new InMemoryStore();
const createArticleEmbeddings = async (articles) => {
    return await embeddings.embedDocuments(articles);
};

function stripHTMLTags(text) {
    return text.replace(/<[^>]*>?/gm, '');
}

// Create a function that takes in an article object and returns a chunk of text from the objective, title, and each step in the article.
const createArticleDocument = (article) => {
    let articleText = `${article.title} ${article.objective} ${article.steps
        .map((step) => stripHTMLTags(step.text))
        .join(' ')}`;
    const doc = new Document({
        pageContent: articleText,
        metadata: { title: article.title, objective: article.objective }
    });
    return doc;
};

const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(embeddings, inMemoryStore);

export async function POST({ request, params, url }) {
    try {
        const data = await request.json();
        const notes = data.notes;
        console.log('notes', notes);
        console.log(typeof notes);
        // const queryEmbedding = await createQueryEmbeddings(notes);
        // const loader = new JSONLoader('src/lib/data/step_with_mobile_text.json', [
        //     '/title',
        //     '/objective'
        // ]);

        const chunkedArticles = articles.map((article) => createArticleDocument(article));
        const vectorStore = await MemoryVectorStore.fromDocuments(chunkedArticles, embeddings);
        const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
            minSimilarityScore: 0.8
        });
        const result = await retriever.getRelevantDocuments(notes);
        const resultArticles = result.map((article) => {
            const found = articles.find((a) => a.title === article.metadata.title);
            if (found) {
                return found;
            }
        });
        // const documents = await loader.load();
        // const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
        // const result = await vectorStore.similaritySearch(notes, 5);
        // console.log('loaded docs', documents);
        // const queryEmbeddings = await createQueryEmbeddings(notes);
        // const articlesChunks = articles.map(
        //     async (article) => await createQueryEmbeddings(createArticleText(article))
        // );
        return json({ resultArticles });
    } catch (err) {
        console.log(err);
        return { status: 500, body: 'Internal Server Error' };
    }
}
