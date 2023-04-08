<svelte:options tag="wc-svelte-todo" />

<script lang="ts">
  const { filter, mergeMap, sampleTime, Subject, switchMap, takeUntil } = rxjs;
  import { SvelteSubject } from "./lib/svelte-subjects";
  import { onDestroy } from "svelte";
  const input$ = new SvelteSubject<string>();
  const teardown$ = new Subject<void>();
  onDestroy(() => {
    teardown$.next();
  });

  const todo$ = input$.pipe(
    takeUntil(teardown$),
    filter(Boolean),
    sampleTime(500),
    switchMap((input) => fetch(`https://jsonplaceholder.typicode.com/todos/${input}`)),
    mergeMap((result) => result.json() as Promise<{ title: string; id: number }>)
  );
</script>

<h1>Todo Lookup</h1>
<input type="number" bind:value={$input$} />
{#if $todo$}
  <article>
    <h1>{$todo$.title}</h1>
  </article>
{/if}

<style>
  :host {
    background-color: lightsalmon;
    display: block;
    padding: 1rem;
  }
</style>
