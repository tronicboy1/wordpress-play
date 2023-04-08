import { css as m, LitElement as d, html as p } from "lit";
import { property as u, state as h, query as f } from "lit/decorators.js";
import { S as w, f as $, t as b, s as y, m as v, a as k, b as C } from "./takeUntil-f112e689.js";
var _ = Object.defineProperty, g = Object.getOwnPropertyDescriptor, r = (c, i, t, o) => {
  for (var e = o > 1 ? void 0 : o ? g(i, t) : i, l = c.length - 1, n; l >= 0; l--)
    (n = c[l]) && (e = (o ? n(i, t, e) : n(e)) || e);
  return o && e && _(i, t, e), e;
};
const a = "litwc-hello-world";
class s extends d {
  constructor() {
    super(...arguments), this.name = "User", this.clicks = 0, this.teardown$ = new w();
  }
  firstUpdated() {
    $(this.input, "input").pipe(
      b(this.teardown$),
      y(500),
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
s.styles = [
  m`
      :host {
        text-align: center;
      }
    `
];
r([
  u()
], s.prototype, "name", 2);
r([
  h()
], s.prototype, "clicks", 2);
r([
  h()
], s.prototype, "todo", 2);
r([
  f("input")
], s.prototype, "input", 2);
window.customElements.get(a) || window.customElements.define(a, s);
export {
  s as WcHelloWorld,
  a as tagName
};
