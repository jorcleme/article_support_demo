import {
    CISCO_CATALYST_1200_SERIES_SWITCHES
} from '$lib/utils/allSeries.js';


/** @type { import('@sveltejs/kit').ParamMatcher } */
export function match(param) {
    return CISCO_CATALYST_1200_SERIES_SWITCHES.includes(param);
}
