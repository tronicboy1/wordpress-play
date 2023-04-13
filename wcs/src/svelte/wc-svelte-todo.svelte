<svelte:options tag="wc-svelte-todo" />

<script lang="ts">
  const { filter, mergeMap, sampleTime, Subject, switchMap, takeUntil, startWith, map } = rxjs;
  import { onDestroy } from "svelte";
  import { SvelteSubject, SvelteBehaviorSubject } from "@tronicboy/svelte-rxjs-subjects";
  import { filterForDoubleClick } from "@tronicboy/rxjs-operators";
  import type { Observable } from "rxjs";
  const input$ = new SvelteSubject<string | number>();
  const teardown$ = new Subject<void>();
  onDestroy(() => {
    teardown$.next();
  });

  function createURL(path: string) {
    return new URL(path, document.location.origin);
  }

  type Todo = { text: string; id: number; created_at: string };

  const refresh$ = new Subject<void>();
  const pageNo$ = new SvelteBehaviorSubject(1);
  const todos$: Observable<Todo[]> = refresh$.pipe(
    startWith(undefined),
    switchMap(() => pageNo$),
    switchMap((pageNo) => {
      const url = createURL("/wp-json/todo/v1/todos");
      url.searchParams.set("page", String(pageNo));
      return fetch(url);
    }),
    filter((result) => result.ok),
    mergeMap((result) => result.json())
  );

  const todo$ = input$.pipe(
    takeUntil(teardown$),
    filter(Boolean),
    sampleTime(500),
    switchMap((input) => fetch(createURL(`/wp-json/todo/v1/todos/${input}`))),
    filter((response) => response.ok),
    mergeMap((result) => result.json() as Promise<Todo>)
  );

  const click$ = new Subject<number>();
  click$
    .pipe(
      takeUntil(teardown$),
      filterForDoubleClick(500),
      mergeMap((id) => fetch(createURL(`/wp-json/todo/v1/todos/${id}`), { method: "DELETE" }))
    )
    .subscribe((id) => {
      console.log("dbl click", id);
      refresh$.next();
    });
  function handleTodoClick(id: number) {
    input$.next(id);
    click$.next(id);
  }

  let textInput = "";
  refresh$
    .pipe(
      switchMap(() =>
        fetch("https://api.api-ninjas.com/v1/loremipsum", {
          headers: { "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1" },
        })
      ),
      filter((result) => result.ok),
      mergeMap((result) => result.json()),
      map(({ text }) => text as string),
      map((text) => text.slice(0, 255)),
      takeUntil(teardown$)
    )
    .subscribe((text) => (textInput = text));
  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) throw TypeError("NotForm");
    const formData = new FormData(form);
    fetch(createURL("/wp-json/todo/v1/todos"), {
      body: formData,
      method: "POST",
    }).then(() => {
      refresh$.next();
      form.reset();
    });
  }
</script>

<h1>All Todos</h1>
{#if $todos$}
  <ul>
    {#each $todos$ as todo}
      <li on:click={() => handleTodoClick(todo.id)} on:keydown><small>{todo.id}</small><br />{todo.text}</li>
    {/each}
  </ul>
  <nav>
    <button on:click={() => pageNo$.next(pageNo$.value - 1)}>Back</button>
    <button on:click={() => pageNo$.next(pageNo$.value + 1)}>Next</button>
  </nav>
{/if}
<h1>Todo Lookup</h1>
<input type="number" bind:value={$input$} />
{#if $todo$}
  <article>
    <h1>{$todo$.text}</h1>
    <p>Date: {new Date($todo$.created_at).toLocaleString()}</p>
  </article>
{/if}

<h1>New Todo</h1>
<form on:submit={handleSubmit}>
  <label for="text">Text</label>
  <input type="text" name="text" id="text" maxlength="255" required bind:value={textInput} />
  <button type="submit">Add</button>
</form>

<style>
  :host {
    background-color: lightsalmon;
    display: block;
    padding: 1rem;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    background-color: white;
    border: 1px solid white;
    border-radius: 4px;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    user-select: none;
  }
  li:first-child {
    margin-top: 0;
  }
  li:last-child {
    margin-bottom: 0;
  }
</style>
