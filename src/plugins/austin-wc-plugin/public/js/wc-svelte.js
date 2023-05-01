import { S as m, i as $, a as _, b as s, f as d, s as w, e as h, c as g, t as y, n as f, d as k, g as v, h as u } from "./index-2f6ecf53.js";
/**
 * @license Angular v15.2.8
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */
const x = ":";
var p;
(function(e) {
  e[e.Little = 0] = "Little", e[e.Big = 1] = "Big";
})(p || (p = {}));
function B(e, t) {
  for (let l = 1, n = 1; l < e.length; l++, n++)
    if (t[n] === "\\")
      n++;
    else if (e[l] === x)
      return l;
  throw new Error(`Unterminated $localize metadata block in "${t}".`);
}
const C = /* @__PURE__ */ (() => typeof globalThis < "u" && globalThis || typeof global < "u" && global || typeof window < "u" && window || typeof self < "u" && typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && self)(), r = function(e, ...t) {
  if (r.translate) {
    const n = r.translate(e, t);
    e = n[0], t = n[1];
  }
  let l = b(e[0], e.raw[0]);
  for (let n = 1; n < e.length; n++)
    l += t[n - 1] + b(e[n], e.raw[n]);
  return l;
}, E = ":";
function b(e, t) {
  return t.charAt(0) === E ? e.substring(B(e, t) + 1) : e;
}
/**
 * @license Angular v15.2.8
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */
C.$localize = r;
function R(e) {
  let t, l, n, i = r`Hello ${/*name*/
  e[0]}` + "", c;
  return {
    c() {
      t = h("h1"), t.textContent = "Svelte WC", l = g(), n = h("p"), c = y(i), this.c = f;
    },
    m(o, a) {
      s(o, t, a), s(o, l, a), s(o, n, a), k(n, c);
    },
    p(o, [a]) {
      a & /*name*/
      1 && i !== (i = r`Hello ${/*name*/
      o[0]}` + "") && v(c, i);
    },
    i: f,
    o: f,
    d(o) {
      o && u(t), o && u(l), o && u(n);
    }
  };
}
function S(e, t, l) {
  let { name: n = "User" } = t;
  return e.$$set = (i) => {
    "name" in i && l(0, n = i.name);
  }, [n];
}
class A extends m {
  constructor(t) {
    super();
    const l = document.createElement("style");
    l.textContent = "*{text-align:center}:host{background-color:aqua;display:block;padding:1rem}", this.shadowRoot.appendChild(l), $(
      this,
      {
        target: this.shadowRoot,
        props: _(this.attributes),
        customElement: !0
      },
      S,
      R,
      w,
      { name: 0 },
      null
    ), t && (t.target && s(t.target, this, t.anchor), t.props && (this.$set(t.props), d()));
  }
  static get observedAttributes() {
    return ["name"];
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(t) {
    this.$$set({ name: t }), d();
  }
}
customElements.define("svelte-wcs", A);
export {
  A as default
};
