import { writable, get, readable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import LEDOverview from './widget/_LEDOverview.svelte';
import UplinkPorts from './widget/_UplinkPorts.svelte';
import DownlinkPorts from './widget/_DownlinkPorts.svelte';
import Reset from './widget/_Reset.svelte';
import USB from './widget/_USB.svelte';
import { _ as format } from 'svelte-i18n';

export const CurrentModel = writable('C1200-24P-4X');
export const jumpToAllNavigation = writable(0);
export const AppCurrentSeries = readable('Cisco Catalyst 1200 Series Switches');
export const completeToggleStore = writable(false);
export const CarouselState = writable(false);
export const CurrentSlide = writable(0);
export const Slides = derived(format, ($format) => {
	return [
		{ slide: 0, component: Reset, title: `${$format('feature_widget_reset_slide_title')}` },
		{ slide: 1, component: LEDOverview, title: `${$format('feature_widget_led_slide_title')}` },
		{ slide: 2, component: USB, title: `${$format('feature_widget_console_ports_title')}` },
		{
			slide: 3,
			component: DownlinkPorts,
			title: `${$format('feature_widget_downlinks_title')}`
		},
		{
			slide: 4,
			component: UplinkPorts,
			title: `${$format('feature_widget_uplinks_title')}`
		}
	];
});

export const IsArticleComplete = writable(false);
// export const IsLightboxArticleOpen = writable(false);
// export const CurrentModel = writable('C1200-24FP-4X');

function createUserPreferencesStore() {
	const defaultValue = {};
	const initialValue = browser
		? JSON.parse(window.localStorage.getItem('userPreferences')) ?? defaultValue
		: defaultValue;
	const { subscribe, update, set } = writable(initialValue);

	return {
		subscribe,
		set,
		add: (key, value) =>
			update((prefs) => {
				return {
					...prefs,
					[key]: value
				};
			}),
		persist: (prefs) => {
			if (browser) {
				window.localStorage.setItem('userPreferences', JSON.stringify(prefs));
			}
		},
		clear: () => {
			try {
				localStorage.removeItem('userPreferences');
				update(() => {
					return {
						attributes: [],
						experience: 'all-steps',
						network: 'new-network',
						device: null
					};
				});
			} catch (err) {
				console.error(err);
			}
		},
		check: (key, obj) => {
			return Object.hasOwn(obj, key);
		},
		get: (key) => {
			const store = get(UserPreferences);
			console.log(store);
			return store[key];
		},

		setPersona: (persona) => {
			switch (persona) {
				case 'P1':
					set({
						learningStyle: 'step-by-step',
						device: 'mobile',
						network: ['new-network', 'existing-network'],
						topics: ['troubleshooting', 'security', 'continue'],
						format: 'fully-guided'
					});
					break;
				case 'P2':
					set({
						learningStyle: ['step-by-step', 'all-steps'],
						device: ['desktop', 'mobile'],
						network: ['new-network', 'existing-network'],
						topics: ['segmented-networks', 'security', 'command-line-interface'],
						format: ['lightly-guided', 'video']
					});
					break;
				case 'P3':
					set({
						learningStyle: 'all-steps',
						device: ['desktop', 'mobile'],
						network: ['new-network', 'existing-network'],
						topics: ['segmented-networks', 'security', 'command-line-interface', 'troubleshooting'],
						format: 'traditional-document-style'
					});
					break;
				default:
					console.error('Invalid persona');
			}
		}
	};
}

export const UserPreferences = createUserPreferencesStore();

// This is the start of getting the breadcrumbs in sync across the app. I think adding a derived store
// that makes periodic checks will help accomplish this feat along with local Storage
function createBreadCrumbStore() {
	const defaultValue = {
		step1complete: false,
		step2complete: false,
		step3complete: false,
		currentStep: 0
	};
	const initialValue = browser
		? JSON.parse(window.localStorage.getItem('breadcrumbs')) ?? defaultValue
		: defaultValue;
	const { subscribe, update, set } = writable(initialValue);

	return {
		subscribe,
		set,
		update,
		initialize: () => {
			update(() => {
				return {
					step1complete: false,
					step2complete: false,
					step3complete: false,
					currentStep: 0
				};
			});
		},
		saveState: (steps) => {
			localStorage.setItem('breadcrumbs', JSON.stringify(steps));
		},
		getState: () => {
			try {
				const breadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs')) || initialValue;
				return breadcrumbs;
			} catch (err) {
				console.error(err);
			}
		},
		clearState: () => {
			try {
				if (browser) {
					localStorage.removeItem('breadcrumbs');
					update(() => ({
						step1complete: false,
						step2complete: false,
						step3complete: false,
						currentStep: 0
					}));
				} else {
					BreadcrumbStore.initialize();
				}
			} catch (err) {
				console.error(err);
			}
		},
		getKey: (key, obj) => {
			if (browser) {
				const breadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs')) || initialValue;
				return breadcrumbs[key];
			}
			return obj[key];
		},
		updateKey: (key, value) =>
			update((crumbs) => {
				return {
					...crumbs,
					[key]: value
				};
			})
	};
}

export const BreadcrumbStore = createBreadCrumbStore();

function trackCurrentStep() {
	const defaultValue = 0;

	const initialValue = browser
		? JSON.parse(window.localStorage.getItem('currentStep')) ?? defaultValue
		: defaultValue;

	const { subscribe, set, update } = writable(initialValue);

	return {
		subscribe,
		set,
		update,
		getCurrentStep: () => {
			const step = JSON.parse(window.localStorage.getItem('currentStep')) || initialValue;
			return parseInt(step, 10);
		},
		persistStep: (store) => window.localStorage.setItem('currentStep', JSON.stringify(store)),
		setStepOne: () =>
			update(() => {
				return 1;
			}),
		setStepTwo: () =>
			update(() => {
				return 2;
			}),
		setStepThree: () =>
			update(() => {
				return 3;
			}),
		clearState: () => {
			try {
				localStorage.removeItem('currentStep');
			} catch (err) {
				console.error(err);
			}
		}
	};
}
export const CurrentStep = trackCurrentStep();
export const mountedArticleSteps = writable([]);
export const mountedArticlePreambleObjective = writable([]);
export const mountedArticlePreambleDevices = writable([]);
export const stepsExpanded = writable(false);
export const ExpGradeSelected = writable('Fully Guided');
export const mostRecentStep = writable(-1);
