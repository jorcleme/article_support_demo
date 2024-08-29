import * as api from '$lib/utils/api';
import strip from '../utils/stripHTML';
import { API_BASE_URL } from '../constants';

export async function generateAIQuestion(stepNumber, stepsArr) {
	let error = null;

	const stepArrayContext =
		stepNumber > -1 && Array.isArray(stepsArr) ? stepsArr.slice(0, stepNumber + 1) : [];

	const stepContextString = stepArrayContext
		.map((step, index) => `Step ${index + 1}: ${strip(step.text)}`)
		.join('\n');
	const res = await fetch(`${API_BASE_URL}/openai/QuestionGenerator`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ stepContextString })
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return await res.json();
		})
		.catch((err) => {
			error = err;
			console.log(err);
			return null;
		});
	if (error) {
		throw error;
	}

	const questions = res.questions ?? [];
	// const res = await api.post('openai/QuestionGenerator', { stepContextString });
	return questions;
}

export async function answerGenAIQuestion(messages) {
	const answer = await api.post('openai/AnswerGen', { messages });
	console.log('Answer from answerGenAIQuestion:', answer);
	return answer;
}
