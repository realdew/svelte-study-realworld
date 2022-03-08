<script>
    import { navigating } from '$app/stores';
    import Nav from '$lib/Nav.svelte';
    //import PreloadingIndicator from '$lib/PreloadingIndicator.svelte';

</script>

<Nav />

<main>
    <slot />
</main>