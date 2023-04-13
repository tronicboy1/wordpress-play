import { S as V, i as Y, a as ee, b as j, s as te, e as h, c as T, n as A, j as L, k as q, d as k, l as x, m as O, h as S, r as M, o as B, p as le, q as oe, t as g, g as U, u as ne } from "./index-2f6ecf53.js";
import { S as ie, a as se } from "./index-ae6e79f2.js";
import { f as ue } from "./double-click-5ca33fd4.js";
import "./Observable-2c9a47b5.js";
function W(o, n, r) {
  const s = o.slice();
  return s[27] = n[r], s;
}
function X(o) {
  let n, r, s, p, C, u, d, b, c = (
    /*$todos$*/
    o[1]
  ), i = [];
  for (let e = 0; e < c.length; e += 1)
    i[e] = $(W(o, c, e));
  return {
    c() {
      n = h("ul");
      for (let e = 0; e < i.length; e += 1)
        i[e].c();
      r = T(), s = h("nav"), p = h("button"), p.textContent = "Back", C = T(), u = h("button"), u.textContent = "Next";
    },
    m(e, _) {
      j(e, n, _);
      for (let a = 0; a < i.length; a += 1)
        i[a] && i[a].m(n, null);
      j(e, r, _), j(e, s, _), k(s, p), k(s, C), k(s, u), d || (b = [
        x(
          p,
          "click",
          /*click_handler_1*/
          o[12]
        ),
        x(
          u,
          "click",
          /*click_handler_2*/
          o[13]
        )
      ], d = !0);
    },
    p(e, _) {
      if (_ & /*handleTodoClick, $todos$*/
      258) {
        c = /*$todos$*/
        e[1];
        let a;
        for (a = 0; a < c.length; a += 1) {
          const m = W(e, c, a);
          i[a] ? i[a].p(m, _) : (i[a] = $(m), i[a].c(), i[a].m(n, null));
        }
        for (; a < i.length; a += 1)
          i[a].d(1);
        i.length = c.length;
      }
    },
    d(e) {
      e && S(n), oe(i, e), e && S(r), e && S(s), d = !1, M(b);
    }
  };
}
function $(o) {
  let n, r, s = (
    /*todo*/
    o[27].id + ""
  ), p, C, u = (
    /*todo*/
    o[27].text + ""
  ), d, b, c;
  function i() {
    return (
      /*click_handler*/
      o[11](
        /*todo*/
        o[27]
      )
    );
  }
  return {
    c() {
      n = h("li"), r = h("small"), p = g(s), C = h("br"), d = g(u);
    },
    m(e, _) {
      j(e, n, _), k(n, r), k(r, p), k(n, C), k(n, d), b || (c = [
        x(n, "click", i),
        x(
          n,
          "keydown",
          /*keydown_handler*/
          o[10]
        )
      ], b = !0);
    },
    p(e, _) {
      o = e, _ & /*$todos$*/
      2 && s !== (s = /*todo*/
      o[27].id + "") && U(p, s), _ & /*$todos$*/
      2 && u !== (u = /*todo*/
      o[27].text + "") && U(d, u);
    },
    d(e) {
      e && S(n), b = !1, M(c);
    }
  };
}
function I(o) {
  let n, r, s = (
    /*$todo$*/
    o[3].text + ""
  ), p, C, u, d, b = new Date(
    /*$todo$*/
    o[3].created_at
  ).toLocaleString() + "", c;
  return {
    c() {
      n = h("article"), r = h("h1"), p = g(s), C = T(), u = h("p"), d = g("Date: "), c = g(b);
    },
    m(i, e) {
      j(i, n, e), k(n, r), k(r, p), k(n, C), k(n, u), k(u, d), k(u, c);
    },
    p(i, e) {
      e & /*$todo$*/
      8 && s !== (s = /*$todo$*/
      i[3].text + "") && U(p, s), e & /*$todo$*/
      8 && b !== (b = new Date(
        /*$todo$*/
        i[3].created_at
      ).toLocaleString() + "") && U(c, b);
    },
    d(i) {
      i && S(n);
    }
  };
}
function re(o) {
  let n, r, s, p, C, u, d, b, c, i, e, _, a, m, D, E, y, R, w = (
    /*$todos$*/
    o[1] && X(o)
  ), v = (
    /*$todo$*/
    o[3] && I(o)
  );
  return {
    c() {
      n = h("h1"), n.textContent = "All Todos", r = T(), w && w.c(), s = T(), p = h("h1"), p.textContent = "Todo Lookup", C = T(), u = h("input"), d = T(), v && v.c(), b = T(), c = h("h1"), c.textContent = "New Todo", i = T(), e = h("form"), _ = h("label"), _.textContent = "Text", a = T(), m = h("input"), D = T(), E = h("button"), E.textContent = "Add", this.c = A, L(u, "type", "number"), L(_, "for", "text"), L(m, "type", "text"), L(m, "name", "text"), L(m, "id", "text"), L(m, "maxlength", "255"), m.required = !0, L(E, "type", "submit");
    },
    m(t, f) {
      j(t, n, f), j(t, r, f), w && w.m(t, f), j(t, s, f), j(t, p, f), j(t, C, f), j(t, u, f), q(
        u,
        /*$input$*/
        o[2]
      ), j(t, d, f), v && v.m(t, f), j(t, b, f), j(t, c, f), j(t, i, f), j(t, e, f), k(e, _), k(e, a), k(e, m), q(
        m,
        /*textInput*/
        o[0]
      ), k(e, D), k(e, E), y || (R = [
        x(
          u,
          "input",
          /*input0_input_handler*/
          o[14]
        ),
        x(
          m,
          "input",
          /*input1_input_handler*/
          o[15]
        ),
        x(
          e,
          "submit",
          /*handleSubmit*/
          o[9]
        )
      ], y = !0);
    },
    p(t, [f]) {
      /*$todos$*/
      t[1] ? w ? w.p(t, f) : (w = X(t), w.c(), w.m(s.parentNode, s)) : w && (w.d(1), w = null), f & /*$input$*/
      4 && O(u.value) !== /*$input$*/
      t[2] && q(
        u,
        /*$input$*/
        t[2]
      ), /*$todo$*/
      t[3] ? v ? v.p(t, f) : (v = I(t), v.c(), v.m(b.parentNode, b)) : v && (v.d(1), v = null), f & /*textInput*/
      1 && m.value !== /*textInput*/
      t[0] && q(
        m,
        /*textInput*/
        t[0]
      );
    },
    i: A,
    o: A,
    d(t) {
      t && S(n), t && S(r), w && w.d(t), t && S(s), t && S(p), t && S(C), t && S(u), t && S(d), v && v.d(t), t && S(b), t && S(c), t && S(i), t && S(e), y = !1, M(R);
    }
  };
}
function F(o) {
  return new URL(o, document.location.origin);
}
function ae(o, n, r) {
  let s, p, C;
  const { filter: u, mergeMap: d, sampleTime: b, Subject: c, switchMap: i, takeUntil: e, startWith: _, map: a } = rxjs, m = new ie();
  B(o, m, (l) => r(2, p = l));
  const D = new c();
  le(() => {
    D.next();
  });
  const E = new c(), y = new se(1), R = E.pipe(
    _(void 0),
    i(() => y),
    i((l) => {
      const N = F("/wp-json/todo/v1/todos");
      return N.searchParams.set("page", String(l)), fetch(N);
    }),
    u((l) => l.ok),
    d((l) => l.json())
  );
  B(o, R, (l) => r(1, s = l));
  const w = m.pipe(e(D), u(Boolean), b(500), i((l) => fetch(F(`/wp-json/todo/v1/todos/${l}`))), u((l) => l.ok), d((l) => l.json()));
  B(o, w, (l) => r(3, C = l));
  const v = new c();
  v.pipe(e(D), ue(500), d((l) => fetch(F(`/wp-json/todo/v1/todos/${l}`), { method: "DELETE" }))).subscribe((l) => {
    console.log("dbl click", l), E.next();
  });
  function t(l) {
    m.next(l), v.next(l);
  }
  let f = "";
  E.pipe(
    i(() => fetch("https://api.api-ninjas.com/v1/loremipsum", {
      headers: {
        "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1"
      }
    })),
    u((l) => l.ok),
    d((l) => l.json()),
    a(({ text: l }) => l),
    a((l) => l.slice(0, 255)),
    e(D)
  ).subscribe((l) => r(0, f = l));
  function P(l) {
    l.preventDefault();
    const N = l.target;
    if (!(N instanceof HTMLFormElement))
      throw TypeError("NotForm");
    const Q = new FormData(N);
    fetch(F("/wp-json/todo/v1/todos"), { body: Q, method: "POST" }).then(() => {
      E.next(), N.reset();
    });
  }
  function G(l) {
    ne.call(this, o, l);
  }
  const H = (l) => t(l.id), K = () => y.next(y.value - 1), Z = () => y.next(y.value + 1);
  function z() {
    p = O(this.value), m.set(p);
  }
  function J() {
    f = this.value, r(0, f);
  }
  return [
    f,
    s,
    p,
    C,
    m,
    y,
    R,
    w,
    t,
    P,
    G,
    H,
    K,
    Z,
    z,
    J
  ];
}
class fe extends V {
  constructor(n) {
    super();
    const r = document.createElement("style");
    r.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}ul{list-style-type:none;margin:0;padding:0}li{background-color:white;border:1px solid white;border-radius:4px;margin:1rem 0;padding:0.5rem 1rem;user-select:none}li:first-child{margin-top:0}li:last-child{margin-bottom:0}", this.shadowRoot.appendChild(r), Y(
      this,
      {
        target: this.shadowRoot,
        props: ee(this.attributes),
        customElement: !0
      },
      ae,
      re,
      te,
      {},
      null
    ), n && n.target && j(n.target, this, n.anchor);
  }
}
customElements.define("wc-svelte-todo", fe);
export {
  fe as default
};
