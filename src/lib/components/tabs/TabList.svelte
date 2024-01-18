<script>
    export let ulClass = 'flex';
</script>

<ul class={ulClass} role="tablist">
    <slot />
</ul>

<style>
    .flex {
        display: flex;
        align-items: center;
        list-style-type: none;
        background-color: #fff;
        margin-left: 0;
        padding-left: 0;
        border-bottom: 1px solid var(--border-gray-2);
    }

    ul {
        margin-top: 0;
    }
</style>
