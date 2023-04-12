import { S as p, i as b, a as x, b as i, f as m, s as _, e as f, c as g, t as d, n as o, d as h, g as v, h as u } from "./index-2f6ecf53.js";
function $(r) {
  let t, s, a, n, c;
  return {
    c() {
      t = f("h1"), t.textContent = "Svelte WC", s = g(), a = f("p"), n = d("Hello "), c = d(
        /*name*/
        r[0]
      ), this.c = o;
    },
    m(e, l) {
      i(e, t, l), i(e, s, l), i(e, a, l), h(a, n), h(a, c);
    },
    p(e, [l]) {
      l & /*name*/
      1 && v(
        c,
        /*name*/
        e[0]
      );
    },
    i: o,
    o,
    d(e) {
      e && u(t), e && u(s), e && u(a);
    }
  };
}
function C(r, t, s) {
  let { name: a = "User" } = t;
  return r.$$set = (n) => {
    "name" in n && s(0, a = n.name);
  }, [a];
}
class E extends p {
  constructor(t) {
    super();
    const s = document.createElement("style");
    s.textContent = "*{text-align:center}:host{background-color:aqua;display:block;padding:1rem}", this.shadowRoot.appendChild(s), b(
      this,
      {
        target: this.shadowRoot,
        props: x(this.attributes),
        customElement: !0
      },
      C,
      $,
      _,
      { name: 0 },
      null
    ), t && (t.target && i(t.target, this, t.anchor), t.props && (this.$set(t.props), m()));
  }
  static get observedAttributes() {
    return ["name"];
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(t) {
    this.$$set({ name: t }), m();
  }
}
customElements.define("svelte-wcs", E);
export {
  E as default
};
