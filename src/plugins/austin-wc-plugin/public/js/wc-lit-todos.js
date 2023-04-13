import { noChange as f, css as x, LitElement as g, html as d } from "lit";
import { query as w, customElement as v } from "lit/decorators.js";
import { directive as k } from "lit/directive.js";
import { AsyncDirective as j } from "lit/async-directive.js";
import { f as y } from "./double-click-5ca33fd4.js";
import "./Observable-2c9a47b5.js";
const { Subject: L, takeUntil: N } = rxjs;
class C extends j {
  constructor() {
    super(...arguments), this.disconnected$ = new L();
  }
  render(t) {
    return this.source = t.pipe(N(this.disconnected$)), this.subscribe(), f;
  }
  disconnected() {
    this.disconnected$.next();
  }
  reconnected() {
    this.subscribe();
  }
  subscribe() {
    this.isConnected && this.source.subscribe({
      next: (t) => this.setValue(t),
      error: (t) => console.error(t)
    });
  }
}
function m(e) {
  return k(C)(e);
}
var T = Object.defineProperty, D = Object.getOwnPropertyDescriptor, $ = (e, t, r, s) => {
  for (var i = s > 1 ? void 0 : s ? D(t, r) : t, h = e.length - 1, p; h >= 0; h--)
    (p = e[h]) && (i = (s ? p(t, r, i) : p(i)) || i);
  return s && i && T(t, r, i), i;
};
const { BehaviorSubject: S, Subject: n, filter: u, map: o, mergeMap: c, of: U, sampleTime: O, startWith: R, switchMap: a, takeUntil: b, tap: _ } = rxjs, E = "wc-lit-todos";
let l = class extends g {
  constructor() {
    super(...arguments), this.teardown$ = new n(), this.pageNo$ = new S(1), this.refresh$ = new n(), this.todos$ = this.refresh$.pipe(
      R(void 0),
      a(() => this.pageNo$),
      a((e) => {
        const t = this.createURL();
        return t.searchParams.set("page", String(e)), fetch(t);
      }),
      c((e) => e.ok ? e.json() : U([]))
    ), this.input$ = new n(), this.todo$ = this.input$.pipe(
      O(100),
      o((e) => e.data),
      o(Number),
      u((e) => !isNaN(e) && e > 0),
      _((e) => console.log(e)),
      a((e) => fetch(this.createURL(e))),
      u((e) => e.ok),
      c((e) => e.json())
    ), this.todoClick$ = new n();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.teardown$.next();
  }
  connectedCallback() {
    super.connectedCallback(), this.todoClick$.pipe(
      b(this.teardown$),
      y(200),
      c((e) => fetch(this.createURL(e), { method: "DELETE" }))
    ).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => console.error(e)
    }), this.refresh$.pipe(
      a(
        () => fetch("https://api.api-ninjas.com/v1/loremipsum", {
          headers: { "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1" }
        })
      ),
      u((e) => e.ok),
      c((e) => e.json()),
      o(({ text: e }) => e),
      o((e) => e.slice(0, 255)),
      b(this.teardown$)
    ).subscribe((e) => this.newTodoInput.value = e);
  }
  createURL(e) {
    return new URL(`/wp-json/todo/v1/todos${e ? "/" + e : ""}`, document.location.origin);
  }
  handleSubmit(e) {
    e.preventDefault();
    const t = e.target, r = new FormData(t);
    fetch(this.createURL(), {
      body: r,
      method: "POST"
    }).then(() => {
      this.refresh$.next(), t.reset();
    });
  }
  render() {
    return d`<h1>All Todos</h1>
      <ul>
        ${m(
      this.todos$.pipe(
        o(
          (e) => e.map(
            (t) => d`<li @click=${this.todoClick$.next.bind(this.todoClick$, t.id)}>
                  <small>${t.id}</small>
                  <br />${t.text}
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
      <input type="number" @input=${(e) => this.input$.next(e)} />
      ${m(
      this.todo$.pipe(
        o(
          (e) => d` <article>
              <h3>${e.text}</h3>
              <p>${new Date(e.created_at).toLocaleString()}</p>
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
l.styles = [
  x`
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
], l.prototype, "newTodoInput", 2);
l = $([
  v(E)
], l);
export {
  l as WcLitTodos
};
