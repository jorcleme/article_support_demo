/**
 *
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns - Your atypical debounce operation
 */

// export default function debounce(func, wait = 200, immediate) {
// 	let timeout;

// 	return function executedFunction() {
// 		const context = this;
// 		const args = arguments;

// 		let later = function () {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};

// 		const makeCallImmediately = immediate && !timeout;

// 		clearTimeout(timeout);

// 		timeout = setTimeout(later, wait);

// 		if (makeCallImmediately) func.apply(context, args);
// 	};
// }

export default function debounce(func, delay = 200) {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => func(...args), delay);
	};
}
