import { css as m, LitElement as h, html as a } from "lit";
import { property as f, state as d } from "lit/decorators.js";
var u = Object.defineProperty, w = Object.getOwnPropertyDescriptor, p = (r, t, c, s) => {
  for (var e = s > 1 ? void 0 : s ? w(t, c) : t, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (e = (s ? i(t, c, e) : i(e)) || e);
  return s && e && u(t, c, e), e;
};
const n = "litwc-hello-world";
class l extends h {
  constructor() {
    super(...arguments), this.name = "User", this.clicks = 0;
  }
  handleClick() {
    this.clicks = this.clicks += 1;
  }
  render() {
    return a`
      <h1 @click=${this.handleClick}>Hello World from Lit</h1>
      <p>Welcome, ${this.name}.</p>
      <p>Clicks: ${this.clicks}</p>
    `;
  }
}
l.styles = [
  m`
      :host {
        text-align: center;
      }
    `
];
p([
  f()
], l.prototype, "name", 2);
p([
  d()
], l.prototype, "clicks", 2);
window.customElements.get(n) || window.customElements.define(n, l);
export {
  l as WcHelloWorld,
  n as tagName
};
