import { S as b, i as v, s as k, a as x, b as d, e as u, t as _, n as m, c as r, l as S, d as y, f as C, g as p, h as E, j as $, m as j, k as R, o as V, p as q } from "./index-fd9331fa.js";
function A(c) {
  let t, e, a, n, s;
  return {
    c() {
      t = u("button"), e = _("count is "), a = _(
        /*count*/
        c[0]
      ), this.c = m;
    },
    m(o, l) {
      d(o, t, l), r(t, e), r(t, a), n || (s = S(
        t,
        "click",
        /*increment*/
        c[1]
      ), n = !0);
    },
    p(o, [l]) {
      l & /*count*/
      1 && y(
        a,
        /*count*/
        o[0]
      );
    },
    i: m,
    o: m,
    d(o) {
      o && C(t), n = !1, s();
    }
  };
}
function H(c, t, e) {
  let a = 0;
  return [a, () => {
    e(0, a += 1);
  }];
}
class K extends b {
  constructor(t) {
    super(), v(
      this,
      {
        target: this.shadowRoot,
        props: x(this.attributes),
        customElement: !0
      },
      H,
      A,
      k,
      {},
      null
    ), t && t.target && d(t.target, this, t.anchor);
  }
}
function L(c) {
  let t, e, a, n, s, o, l, g, f, h;
  return s = new K({}), {
    c() {
      t = u("main"), e = u("h1"), e.textContent = "Vite + Svelte", a = p(), n = u("div"), E(s.$$.fragment), o = p(), l = u("p"), l.innerHTML = `Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the
    official Svelte app framework powered by Vite!`, g = p(), f = u("p"), f.textContent = "Click on the Vite and Svelte logos to learn more", this.c = m, $(n, "class", "card"), $(f, "class", "read-the-docs");
    },
    m(i, w) {
      d(i, t, w), r(t, e), r(t, a), r(t, n), j(s, n, null), r(t, o), r(t, l), r(t, g), r(t, f), h = !0;
    },
    p: m,
    i(i) {
      h || (R(s.$$.fragment, i), h = !0);
    },
    o(i) {
      V(s.$$.fragment, i), h = !1;
    },
    d(i) {
      i && C(t), q(s);
    }
  };
}
class T extends b {
  constructor(t) {
    super();
    const e = document.createElement("style");
    e.textContent = ".read-the-docs{color:#888}", this.shadowRoot.appendChild(e), v(
      this,
      {
        target: this.shadowRoot,
        props: x(this.attributes),
        customElement: !0
      },
      null,
      L,
      k,
      {},
      null
    ), t && t.target && d(t.target, this, t.anchor);
  }
}
export {
  T as default
};
