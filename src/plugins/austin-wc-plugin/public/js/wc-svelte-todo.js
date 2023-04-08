import { S as x, i as C, a as q, b as r, s as M, e as _, c as k, j as R, n as b, k as T, l as v, m as B, o as $, h as f, p as w, q as D, t as L, d as y, g as N } from "./index-6f88ea70.js";
const { Subject: U } = rxjs;
class W extends U {
  set(s) {
    this.next(s);
  }
}
function S(i) {
  let s, l, e = (
    /*$todo$*/
    i[1].title + ""
  ), u;
  return {
    c() {
      s = _("article"), l = _("h1"), u = L(e);
    },
    m(n, p) {
      r(n, s, p), y(s, l), y(l, u);
    },
    p(n, p) {
      p & /*$todo$*/
      2 && e !== (e = /*$todo$*/
      n[1].title + "") && N(u, e);
    },
    d(n) {
      n && f(s);
    }
  };
}
function z(i) {
  let s, l, e, u, n, p, d, o = (
    /*$todo$*/
    i[1] && S(i)
  );
  return {
    c() {
      s = _("h1"), s.textContent = "Todo Lookup", l = k(), e = _("input"), u = k(), o && o.c(), n = R(), this.c = b, T(e, "type", "number");
    },
    m(t, a) {
      r(t, s, a), r(t, l, a), r(t, e, a), v(
        e,
        /*$input$*/
        i[0]
      ), r(t, u, a), o && o.m(t, a), r(t, n, a), p || (d = B(
        e,
        "input",
        /*input_input_handler*/
        i[4]
      ), p = !0);
    },
    p(t, [a]) {
      a & /*$input$*/
      1 && $(e.value) !== /*$input$*/
      t[0] && v(
        e,
        /*$input$*/
        t[0]
      ), /*$todo$*/
      t[1] ? o ? o.p(t, a) : (o = S(t), o.c(), o.m(n.parentNode, n)) : o && (o.d(1), o = null);
    },
    i: b,
    o: b,
    d(t) {
      t && f(s), t && f(l), t && f(e), t && f(u), o && o.d(t), t && f(n), p = !1, d();
    }
  };
}
function A(i, s, l) {
  let e, u;
  const { filter: n, mergeMap: p, sampleTime: d, Subject: o, switchMap: t, takeUntil: a } = rxjs, m = new W();
  w(i, m, (c) => l(0, e = c));
  const h = new o();
  D(() => {
    h.next();
  });
  const j = m.pipe(a(h), n(Boolean), d(500), t((c) => fetch(`https://jsonplaceholder.typicode.com/todos/${c}`)), p((c) => c.json()));
  w(i, j, (c) => l(1, u = c));
  function E() {
    e = $(this.value), m.set(e);
  }
  return [e, u, m, j, E];
}
class F extends x {
  constructor(s) {
    super();
    const l = document.createElement("style");
    l.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}", this.shadowRoot.appendChild(l), C(
      this,
      {
        target: this.shadowRoot,
        props: q(this.attributes),
        customElement: !0
      },
      A,
      z,
      M,
      {},
      null
    ), s && s.target && r(s.target, this, s.anchor);
  }
}
customElements.define("wc-svelte-todo", F);
export {
  F as default
};
