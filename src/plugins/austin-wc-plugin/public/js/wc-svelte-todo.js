import { S as C, i as q, a as M, b as c, s as R, e as _, c as j, j as T, n as b, k as B, l as v, m as D, o as $, h as f, p as w, q as L, t as N, d as y, g as U } from "./index-3259abc3.js";
import { S as W } from "./svelte-subjects-77548414.js";
function S(a) {
  let o, l, e = (
    /*$todo$*/
    a[1].title + ""
  ), u;
  return {
    c() {
      o = _("article"), l = _("h1"), u = N(e);
    },
    m(n, p) {
      c(n, o, p), y(o, l), y(l, u);
    },
    p(n, p) {
      p & /*$todo$*/
      2 && e !== (e = /*$todo$*/
      n[1].title + "") && U(u, e);
    },
    d(n) {
      n && f(o);
    }
  };
}
function x(a) {
  let o, l, e, u, n, p, m, s = (
    /*$todo$*/
    a[1] && S(a)
  );
  return {
    c() {
      o = _("h1"), o.textContent = "Todo Lookup", l = j(), e = _("input"), u = j(), s && s.c(), n = T(), this.c = b, B(e, "type", "number");
    },
    m(t, i) {
      c(t, o, i), c(t, l, i), c(t, e, i), v(
        e,
        /*$input$*/
        a[0]
      ), c(t, u, i), s && s.m(t, i), c(t, n, i), p || (m = D(
        e,
        "input",
        /*input_input_handler*/
        a[4]
      ), p = !0);
    },
    p(t, [i]) {
      i & /*$input$*/
      1 && $(e.value) !== /*$input$*/
      t[0] && v(
        e,
        /*$input$*/
        t[0]
      ), /*$todo$*/
      t[1] ? s ? s.p(t, i) : (s = S(t), s.c(), s.m(n.parentNode, n)) : s && (s.d(1), s = null);
    },
    i: b,
    o: b,
    d(t) {
      t && f(o), t && f(l), t && f(e), t && f(u), s && s.d(t), t && f(n), p = !1, m();
    }
  };
}
function z(a, o, l) {
  let e, u;
  const { filter: n, mergeMap: p, sampleTime: m, Subject: s, switchMap: t, takeUntil: i } = rxjs, d = new W();
  w(a, d, (r) => l(0, e = r));
  const h = new s();
  L(() => {
    h.next();
  });
  const k = d.pipe(i(h), n(Boolean), m(500), t((r) => fetch(`https://jsonplaceholder.typicode.com/todos/${r}`)), p((r) => r.json()));
  w(a, k, (r) => l(1, u = r));
  function E() {
    e = $(this.value), d.set(e);
  }
  return [e, u, d, k, E];
}
class A extends C {
  constructor(o) {
    super();
    const l = document.createElement("style");
    l.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}", this.shadowRoot.appendChild(l), q(
      this,
      {
        target: this.shadowRoot,
        props: M(this.attributes),
        customElement: !0
      },
      z,
      x,
      R,
      {},
      null
    ), o && o.target && c(o.target, this, o.anchor);
  }
}
customElements.define("wc-svelte-todo", A);
export {
  A as default
};
