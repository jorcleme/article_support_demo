import * as api from '$lib/utils/api';
import strip from '../utils/stripHTML';

export async function generateAIQuestion(stepNumber, stepsArr) {
	const stepArrayContext =
		stepNumber > -1 && Array.isArray(stepsArr) ? stepsArr.slice(0, stepNumber + 1) : [];

	const stepContextString = stepArrayContext
		.map((step, index) => `Step ${index + 1}: ${strip(step.text)}`)
		.join('\n');

	const res = await api.post('openai/QuestionGenerator', { stepContextString });
	return res;
}

export async function answerGenAIQuestion(messages) {
	const answer = await api.post('openai/AnswerGen', { messages });
	console.log('Answer from answerGenAIQuestion:', answer);
	return answer;
}
