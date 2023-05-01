<svelte:options tag="svelte-wcs" />

<script lang="ts">
  export let name = "User";
  import * as loc from "@angular/localize/init";
</script>

<h1>Svelte WC</h1>
<p>{loc.$localize`Hello ${name}`}</p>

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
