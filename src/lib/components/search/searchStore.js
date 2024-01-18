import { derived, writable } from 'svelte/store';
import searchFilter from './searchFilters.js';
import { UserPreferences } from '../store.js';

export const type = writable('All');
export const category = writable('All');
export const searchValue = writable('');
export const searchStore = writable({
	data: [],
	filtered: [],
	search: ''
});

/* Re-implementation to reduce score on Sonar Scans */
/** @param {string} searchTerm */
function extractKeywords(searchTerm) {
	const delimiters = /[+,]/g;
	return searchTerm.split(delimiters).map((term) => term.trim());
}

function matchesSearchCriteria(item, type, category, keywords) {
	const itemSearchTerms = String(item.search_terms).toLowerCase();
	const matchesType = type === 'All' || item.type === type;
	const matchesCategory = category === 'All' || item.category === category;
	const matchesKeywords = keywords.some((keyword) => itemSearchTerms.includes(keyword));

	return matchesType && matchesCategory && matchesKeywords;
}

export const search = derived(
	[type, category, searchValue, searchStore],
	([$type, $category, $searchValue, $searchStore], set) => {
		const searchTerm = $searchValue.toLowerCase().trim() || '';
		const searchKeywords = searchFilter(extractKeywords(searchTerm));
		const filtered =
			$searchStore.data.filter((item) =>
				matchesSearchCriteria(item, $type, $category, searchKeywords)
			) || [];

		if ($category === 'Restore') {
			category.set('All');
			const attributes = UserPreferences.get('attributes');
			searchValue.set(attributes?.join(', '));
		}
		set({
			data: [...$searchStore.data],
			filtered: filtered,
			search: $searchValue || $searchStore.search || ''
		});
	}
);
