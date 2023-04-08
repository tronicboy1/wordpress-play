<svelte:options tag="svelte-wcs" />

<script lang="ts">
  export let name = "User";
</script>

<h1>Svelte WC</h1>
<p>Hello {name}</p>

<style>
  * {
    text-align: center;
  }
  :host {
    background-color: aqua;
    display: block;
    padding: 1rem;
  }
</style>
