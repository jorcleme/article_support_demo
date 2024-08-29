import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const isSupportWidgetOpen = writable(false);
export const activeArticleStep = writable(0);
export const activeSupportSection = writable('Objective');
export const activeSupportStep = writable(1);
export const isSupportStepDetailsOpen = writable(false);
export const activeArticleId = writable(null);

export function createChatStore(initial) {
	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
		addMessage: (message) => {
			update((messages) => [...messages, message]);
		},
		save: (stepId, state) => {
			if (browser) {
				localStorage.setItem('chat-' + stepId, JSON.stringify(state));
			}
		},
		get: (stepId) => {
			if (browser) {
				return JSON.parse(localStorage.getItem('chat-' + stepId));
			}
		}
	};
}
