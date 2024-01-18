<script>
    import { UserPreferences } from './store';
    import { page } from '$app/stores';

    const replaceStateWithQuery = (values) => {
        const url = new URL(window.location.toString());
        for (let [k, v] of Object.entries(values)) {
            if (!!v) {
                url.searchParams.set(k, v);
            } else {
                url.searchParams.delete(k);
            }
        }
        history.replaceState(history.state, '', url);
    };

    export let path;
    export let text;

    $: experience = $UserPreferences.experience || 'all-steps';
    $: model = $page.params.model || 'C1200-24FP-4X';
    $: filter = experience === 'step-by-step' ? 'step-by-step' : 'jump-to-all';
    $: url =
        experience === 'all-steps'
            ? `/${model}/${filter}#estimated-completion`
            : `/${model}/${filter}/${path}#estimated-completion`;
</script>

<div>
    <a rel="prefetch" href={url}>
        <slot />
    </a>
</div>

<style>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    a {
        text-decoration: none;
        display: flex;
    }
</style>
