import { css as m, LitElement as d, html as p } from "lit";
import { property as u, state as h, query as f } from "lit/decorators.js";
var w = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, r = (c, i, t, o) => {
  for (var e = o > 1 ? void 0 : o ? $(i, t) : i, n = c.length - 1, l; n >= 0; n--)
    (l = c[n]) && (e = (o ? l(i, t, e) : l(e)) || e);
  return o && e && w(i, t, e), e;
};
const { Subject: y, fromEvent: b, map: v, mergeMap: k, sampleTime: j, switchMap: C, takeUntil: _ } = rxjs, a = "litwc-hello-world";
class s extends d {
  constructor() {
    super(...arguments), this.name = "User", this.clicks = 0, this.teardown$ = new y();
  }
  firstUpdated() {
    b(this.input, "input").pipe(
      _(this.teardown$),
      j(500),
      v(() => this.input.value.trim()),
      C((t) => fetch(`https://jsonplaceholder.typicode.com/todos/${t}`)),
      k((t) => t.json())
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
