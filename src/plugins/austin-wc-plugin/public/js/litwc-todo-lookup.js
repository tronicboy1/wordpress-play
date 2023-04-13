import { css as m, LitElement as d, html as p } from "lit";
import { property as u, state as h, query as f } from "lit/decorators.js";
import { Subject as w, fromEvent as $, takeUntil as y, sampleTime as b, map as v, switchMap as k, mergeMap as C } from "rxjs";
var _ = Object.defineProperty, g = Object.getOwnPropertyDescriptor, r = (c, o, t, s) => {
  for (var e = s > 1 ? void 0 : s ? g(o, t) : o, l = c.length - 1, n; l >= 0; l--)
    (n = c[l]) && (e = (s ? n(o, t, e) : n(e)) || e);
  return s && e && _(o, t, e), e;
};
const a = "litwc-hello-world";
class i extends d {
  constructor() {
    super(...arguments), this.name = "User", this.clicks = 0, this.teardown$ = new w();
  }
  firstUpdated() {
    $(this.input, "input").pipe(
      y(this.teardown$),
      b(500),
      v(() => this.input.value.trim()),
      k((t) => fetch(`https://jsonplaceholder.typicode.com/todos/${t}`)),
      C((t) => t.json())
    ).subscribe((t) => this.todo = t);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.teardown$.next();
  }
  handleClick() {
    this.clicks = this.clicks += 1;
  }
  render() {
    return p`
      <h1 @click=${this.handleClick}>Hello World from Lit</h1>
      <p>Welcome, ${this.name}.</p>
      <p>Clicks: ${this.clicks}</p>
      <input type="number" />
      ${this.todo ? p` <article>
            <h1>${this.todo.title}</h1>
          </article>` : ""}
    `;
  }
}
i.styles = [
  m`
      :host {
        text-align: center;
      }
    `
];
r([
  u()
], i.prototype, "name", 2);
r([
  h()
], i.prototype, "clicks", 2);
r([
  h()
], i.prototype, "todo", 2);
r([
  f("input")
], i.prototype, "input", 2);
window.customElements.get(a) || window.customElements.define(a, i);
export {
  i as WcHelloWorld,
  a as tagName
};
