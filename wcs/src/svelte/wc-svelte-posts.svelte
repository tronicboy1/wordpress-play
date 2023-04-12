<svelte:options tag="wc-svelte-posts" />

<script lang="ts">
  const { map, mergeMap, sampleTime, switchMap, combineLatest, tap, catchError, of, from, shareReplay } = rxjs;
  import { SvelteBehaviorSubject } from '@tronicboy/svelte-rxjs-subjects';

  type Post = { title: { rendered: string }; content: { rendered: string }; id: number };
  const baseUrl = () => new URL("/wp-json/wp/v2/posts", window.location.origin);

  const pageNo$ = new SvelteBehaviorSubject(1);
  const postsPerPage$ = new SvelteBehaviorSubject(5);
  const order$ = new SvelteBehaviorSubject("desc");
  const orderBy$ = new SvelteBehaviorSubject("date");
  const posts$ = combineLatest([pageNo$, postsPerPage$, order$, orderBy$]).pipe(
    sampleTime(100),
    map((values) => values.map(String)),
    map(([pageNo, postsPerPage, order, orderBy]) => {
      const url = baseUrl();
      url.searchParams.set("page", pageNo);
      url.searchParams.set("per_page", postsPerPage);
      url.searchParams.set("order", order);
      url.searchParams.set("orderby", orderBy);
      return url;
    }),
    switchMap((url) => fetch(url)),
    mergeMap((result) => {
      if (!result.ok) throw Error();
      return result.json() as Promise<Post[]>;
    }),
    catchError((err, caught) => {
      console.error(err);
      return of([]) as typeof caught;
    }),
    tap((posts) => console.log("res: ", posts))
  );

  const totalPosts$ = from(fetch(baseUrl())).pipe(
    map((result) => result.headers.get("X-WP-Total")),
    map(Number),
    shareReplay(1)
  );
  const totalPages$ = combineLatest([postsPerPage$, totalPosts$]).pipe(
    map(([pPP, totalPosts]) => Math.ceil(totalPosts / pPP))
  );
  const canGoForward$ = combineLatest([pageNo$, totalPages$]).pipe(map(([pageNo, totalPages]) => pageNo < totalPages));
  const canGoBack$ = pageNo$.pipe(map((pageNo) => pageNo > 1));
  const nextPageNo$ = pageNo$.pipe(map((pageNo) => pageNo + 1));
  const lastPageNo$ = pageNo$.pipe(map((pageNo) => pageNo - 1));
</script>

<nav>
  <ul>
    <li>
      <label for="per-page">Posts Per Page</label>
      <input type="number" name="per-page" id="per-page" min="1" bind:value={$postsPerPage$} />
    </li>
    <li>
      <label for="order">Order</label>
      <select name="order" id="order" bind:value={$order$}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </li>
    <li>
      <label for="order-by">Order By</label>
      <select name="order-by" id="order-by" bind:value={$orderBy$}>
        <option value="date">Date</option>
        <option value="id">Id</option>
        <option value="title">Title</option>
        <option value="slug">Slug</option>
      </select>
    </li>
  </ul>
  <ul>
    <li></li>
  </ul>
</nav>

{#if $posts$}
  <ul id="posts">
    {#each $posts$ as post}
      <li>
        <a href="/archives/{post.id}">
          <article>
            <h1>{post.title.rendered}</h1>
            <p />
          </article>
        </a>
      </li>
    {/each}
  </ul>
{/if}

<nav id="paginator">
  <button disabled={!$canGoBack$} on:click={() => pageNo$.next(pageNo$.value - 1)} type="button">Back</button>
  {#if $canGoBack$}
    <button type="button" on:click={() => pageNo$.next(pageNo$.value - 1)}>{$lastPageNo$}</button>
  {/if}
  <button type="button" class="active">{$pageNo$}</button>
  {#if $canGoForward$}
    <button type="button" on:click={() => pageNo$.next(pageNo$.value + 1)}>{$nextPageNo$}</button>
  {/if}
  <button disabled={!$canGoForward$} on:click={() => pageNo$.next(pageNo$.value + 1)} type="button">Forward</button>
</nav>

<style>
  :host {
    display: block;
    width: 90%;
    max-width: 600px;
    margin: 1rem auto;
    border: 1px solid white;
    border-radius: 4px;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.164);
    padding: 1rem;
    background-color: white;
  }

  * {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  #posts li {
    margin: 1rem 0;
  }
  #posts li:first-child {
    margin-top: 0;
  }
  #posts li:last-child {
    margin-bottom: 0;
  }

  nav {
    padding: 0.5rem;
    border-bottom: 1px solid lightgray;
    margin-bottom: 1rem;
  }
  nav ul {
    display: flex;
    flex-direction: row;
    justify-content: left;
  }
  nav ul li {
    display: flex;
    flex-direction: column;
    margin: 0 0.5rem;
  }
  nav ul li:last-child {
    margin-right: 0;
  }
  nav ul li:first-child {
    margin-left: 0;
  }

  input,
  select {
    padding: 0.25rem;
    border: 1px solid lightgray;
    border-radius: 4px;
    height: 40px;
  }

  #paginator {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  #paginator button {
    height: 40px;
    border: 1px solid lightgray;
    background-color: white;
    border-radius: 4px;
    margin: 0 0.5rem;
    min-width: 60px;
  }
  .active {
    background-color: lightgray !important;
  }
</style>
