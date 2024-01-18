import Breadcrumb from '$lib/components/Breadcrumb.svelte';

export const AppSteps = [
    {
        icon: Breadcrumb,
        key: `get_to_know_header`,
        iconProps: { name: 'gettoknow', path: 'get-to-know' }
    },
    {
        icon: Breadcrumb,
        key: 'get_configured_title',
        iconProps: { name: 'getconfigured', path: 'get-configured' }
    },
    {
        icon: Breadcrumb,
        key: 'get_optimized_title',
        iconProps: { name: 'getoptimized', path: 'get-optimized' }
    }
];

export const APP_STEPS_NO_TEXT = [
    {
        icon: Breadcrumb,
        iconProps: { name: 'gettoknow', path: 'get-to-know' }
    },
    {
        icon: Breadcrumb,
        iconProps: { name: 'getconfigured', path: 'get-configured' }
    },
    {
        icon: Breadcrumb,
        iconProps: { name: 'getoptimized', path: 'get-optimized' }
    }
];
