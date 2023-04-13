import { css as f, LitElement as g, html as d } from "lit";
import { query as w, customElement as x } from "lit/decorators.js";
import { o as m } from "./observer.directive-566fb119.js";
import { Subject as n, BehaviorSubject as v, startWith as k, switchMap as a, mergeMap as l, of as L, sampleTime as N, map as i, filter as u, tap as y, takeUntil as b } from "rxjs";
import { f as j } from "./double-click-6a902698.js";
import "lit/directive.js";
import "lit/async-directive.js";
var T = Object.defineProperty, C = Object.getOwnPropertyDescriptor, $ = (t, e, r, s) => {
  for (var o = s > 1 ? void 0 : s ? C(e, r) : e, c = t.length - 1, h; c >= 0; c--)
    (h = t[c]) && (o = (s ? h(e, r, o) : h(o)) || o);
  return s && o && T(e, r, o), o;
};
const D = "wc-lit-todos";
let p = class extends g {
  constructor() {
    super(...arguments), this.teardown$ = new n(), this.pageNo$ = new v(1), this.refresh$ = new n(), this.todos$ = this.refresh$.pipe(
      k(void 0),
      a(() => this.pageNo$),
      a((t) => {
        const e = this.createURL();
        return e.searchParams.set("page", String(t)), fetch(e);
      }),
      l((t) => t.ok ? t.json() : L([]))
    ), this.input$ = new n(), this.todo$ = this.input$.pipe(
      N(100),
      i((t) => t.data),
      i(Number),
      u((t) => !isNaN(t) && t > 0),
      y((t) => console.log(t)),
      a((t) => fetch(this.createURL(t))),
      u((t) => t.ok),
      l((t) => t.json())
    ), this.todoClick$ = new n();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.teardown$.next();
  }
  connectedCallback() {
    super.connectedCallback(), this.todoClick$.pipe(
      b(this.teardown$),
      j(200),
      l((t) => fetch(this.createURL(t), { method: "DELETE" }))
    ).subscribe({
      next: () => this.refresh$.next(),
      error: (t) => console.error(t)
    }), this.refresh$.pipe(
      a(
        () => fetch("https://api.api-ninjas.com/v1/loremipsum", {
          headers: { "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1" }
        })
      ),
      u((t) => t.ok),
      l((t) => t.json()),
      i(({ text: t }) => t),
      i((t) => t.slice(0, 255)),
      b(this.teardown$)
    ).subscribe((t) => this.newTodoInput.value = t);
  }
  createURL(t) {
    return new URL(`/wp-json/todo/v1/todos${t ? "/" + t : ""}`, document.location.origin);
  }
  handleSubmit(t) {
    t.preventDefault();
    const e = t.target, r = new FormData(e);
    fetch(this.createURL(), {
      body: r,
      method: "POST"
    }).then(() => {
      this.refresh$.next(), e.reset();
    });
  }
  render() {
    return d`<h1>All Todos</h1>
      <ul>
        ${m(
      this.todos$.pipe(
        i(
          (t) => t.map(
            (e) => d`<li @click=${this.todoClick$.next.bind(this.todoClick$, e.id)}>
                  <small>${e.id}</small>
                  <br />${e.text}
                </li>`
          )
        )
      )
    )}
      </ul>
      <nav>
        <button @click=${() => this.pageNo$.next(this.pageNo$.value - 1)}>Back</button>
        <button @click=${() => this.pageNo$.next(this.pageNo$.value + 1)}>Next</button>
      </nav>
      <h1>Todo Lookup</h1>
      <input type="number" @input=${(t) => this.input$.next(t)} />
      ${m(
      this.todo$.pipe(
        i(
          (t) => d` <article>
              <h3>${t.text}</h3>
              <p>${new Date(t.created_at).toLocaleString()}</p>
            </article>`
        )
      )
    )}

      <h1>New Todo</h1>
      <form @submit=${this.handleSubmit}>
        <label for="text">Text</label>
        <input id="new-todo" type="text" name="text" id="text" maxlength="255" required bind:value="{textInput}" />
        <button type="submit">Add</button>
      </form>`;
  }
};
p.styles = [
  f`
      :host {
        background-color: lightblue;
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
    `
];
$([
  w("input#new-todo")
], p.prototype, "newTodoInput", 2);
p = $([
  x(D)
], p);
export {
  p as WcLitTodos
};
