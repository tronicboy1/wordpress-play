import { S as J, i as Q, a as V, b as k, s as Y, e as _, c as C, n as M, j as T, k as g, d as h, l as y, m as Z, h as j, r as I, o as W, p as ee, q as te, t as x, g as B, u as le } from "./index-2f6ecf53.js";
import { Subject as X, startWith as oe, switchMap as q, filter as F, mergeMap as U, takeUntil as $, sampleTime as ne, map as O } from "rxjs";
import { S as ie, a as se } from "./index-57368024.js";
import { f as ue } from "./double-click-6a902698.js";
function P(o, n, r) {
  const u = o.slice();
  return u[19] = n[r], u;
}
function G(o) {
  let n, r, u, p, S, s, m, c, a = (
    /*$todos$*/
    o[1]
  ), i = [];
  for (let t = 0; t < a.length; t += 1)
    i[t] = H(P(o, a, t));
  return {
    c() {
      n = _("ul");
      for (let t = 0; t < i.length; t += 1)
        i[t].c();
      r = C(), u = _("nav"), p = _("button"), p.textContent = "Back", S = C(), s = _("button"), s.textContent = "Next";
    },
    m(t, d) {
      k(t, n, d);
      for (let f = 0; f < i.length; f += 1)
        i[f] && i[f].m(n, null);
      k(t, r, d), k(t, u, d), h(u, p), h(u, S), h(u, s), m || (c = [
        y(
          p,
          "click",
          /*click_handler_1*/
          o[12]
        ),
        y(
          s,
          "click",
          /*click_handler_2*/
          o[13]
        )
      ], m = !0);
    },
    p(t, d) {
      if (d & /*handleTodoClick, $todos$*/
      258) {
        a = /*$todos$*/
        t[1];
        let f;
        for (f = 0; f < a.length; f += 1) {
          const b = P(t, a, f);
          i[f] ? i[f].p(b, d) : (i[f] = H(b), i[f].c(), i[f].m(n, null));
        }
        for (; f < i.length; f += 1)
          i[f].d(1);
        i.length = a.length;
      }
    },
    d(t) {
      t && j(n), te(i, t), t && j(r), t && j(u), m = !1, I(c);
    }
  };
}
function H(o) {
  let n, r, u = (
    /*todo*/
    o[19].id + ""
  ), p, S, s = (
    /*todo*/
    o[19].text + ""
  ), m, c, a;
  function i() {
    return (
      /*click_handler*/
      o[11](
        /*todo*/
        o[19]
      )
    );
  }
  return {
    c() {
      n = _("li"), r = _("small"), p = x(u), S = _("br"), m = x(s);
    },
    m(t, d) {
      k(t, n, d), h(n, r), h(r, p), h(n, S), h(n, m), c || (a = [
        y(n, "click", i),
        y(
          n,
          "keydown",
          /*keydown_handler*/
          o[10]
        )
      ], c = !0);
    },
    p(t, d) {
      o = t, d & /*$todos$*/
      2 && u !== (u = /*todo*/
      o[19].id + "") && B(p, u), d & /*$todos$*/
      2 && s !== (s = /*todo*/
      o[19].text + "") && B(m, s);
    },
    d(t) {
      t && j(n), c = !1, I(a);
    }
  };
}
function K(o) {
  let n, r, u = (
    /*$todo$*/
    o[3].text + ""
  ), p, S, s, m, c = new Date(
    /*$todo$*/
    o[3].created_at
  ).toLocaleString() + "", a;
  return {
    c() {
      n = _("article"), r = _("h1"), p = x(u), S = C(), s = _("p"), m = x("Date: "), a = x(c);
    },
    m(i, t) {
      k(i, n, t), h(n, r), h(r, p), h(n, S), h(n, s), h(s, m), h(s, a);
    },
    p(i, t) {
      t & /*$todo$*/
      8 && u !== (u = /*$todo$*/
      i[3].text + "") && B(p, u), t & /*$todo$*/
      8 && c !== (c = new Date(
        /*$todo$*/
        i[3].created_at
      ).toLocaleString() + "") && B(a, c);
    },
    d(i) {
      i && j(n);
    }
  };
}
function re(o) {
  let n, r, u, p, S, s, m, c, a, i, t, d, f, b, N, E, L, R, w = (
    /*$todos$*/
    o[1] && G(o)
  ), v = (
    /*$todo$*/
    o[3] && K(o)
  );
  return {
    c() {
      n = _("h1"), n.textContent = "All Todos", r = C(), w && w.c(), u = C(), p = _("h1"), p.textContent = "Todo Lookup", S = C(), s = _("input"), m = C(), v && v.c(), c = C(), a = _("h1"), a.textContent = "New Todo", i = C(), t = _("form"), d = _("label"), d.textContent = "Text", f = C(), b = _("input"), N = C(), E = _("button"), E.textContent = "Add", this.c = M, T(s, "type", "number"), T(d, "for", "text"), T(b, "type", "text"), T(b, "name", "text"), T(b, "id", "text"), T(b, "maxlength", "255"), b.required = !0, T(E, "type", "submit");
    },
    m(l, e) {
      k(l, n, e), k(l, r, e), w && w.m(l, e), k(l, u, e), k(l, p, e), k(l, S, e), k(l, s, e), g(
        s,
        /*$input$*/
        o[2]
      ), k(l, m, e), v && v.m(l, e), k(l, c, e), k(l, a, e), k(l, i, e), k(l, t, e), h(t, d), h(t, f), h(t, b), g(
        b,
        /*textInput*/
        o[0]
      ), h(t, N), h(t, E), L || (R = [
        y(
          s,
          "input",
          /*input0_input_handler*/
          o[14]
        ),
        y(
          b,
          "input",
          /*input1_input_handler*/
          o[15]
        ),
        y(
          t,
          "submit",
          /*handleSubmit*/
          o[9]
        )
      ], L = !0);
    },
    p(l, [e]) {
      /*$todos$*/
      l[1] ? w ? w.p(l, e) : (w = G(l), w.c(), w.m(u.parentNode, u)) : w && (w.d(1), w = null), e & /*$input$*/
      4 && Z(s.value) !== /*$input$*/
      l[2] && g(
        s,
        /*$input$*/
        l[2]
      ), /*$todo$*/
      l[3] ? v ? v.p(l, e) : (v = K(l), v.c(), v.m(c.parentNode, c)) : v && (v.d(1), v = null), e & /*textInput*/
      1 && b.value !== /*textInput*/
      l[0] && g(
        b,
        /*textInput*/
        l[0]
      );
    },
    i: M,
    o: M,
    d(l) {
      l && j(n), l && j(r), w && w.d(l), l && j(u), l && j(p), l && j(S), l && j(s), l && j(m), v && v.d(l), l && j(c), l && j(a), l && j(i), l && j(t), L = !1, I(R);
    }
  };
}
function A(o) {
  return new URL(o, document.location.origin);
}
function ae(o, n, r) {
  let u, p, S;
  const s = new ie();
  W(o, s, (e) => r(2, p = e));
  const m = new X();
  ee(() => {
    m.next();
  });
  const c = new X(), a = new se(1), i = c.pipe(
    oe(void 0),
    q(() => a),
    q((e) => {
      const D = A("/wp-json/todo/v1/todos");
      return D.searchParams.set("page", String(e)), fetch(D);
    }),
    F((e) => e.ok),
    U((e) => e.json())
  );
  W(o, i, (e) => r(1, u = e));
  const t = s.pipe($(m), F(Boolean), ne(500), q((e) => fetch(A(`/wp-json/todo/v1/todos/${e}`))), F((e) => e.ok), U((e) => e.json()));
  W(o, t, (e) => r(3, S = e));
  const d = new X();
  d.pipe($(m), ue(500), U((e) => fetch(A(`/wp-json/todo/v1/todos/${e}`), { method: "DELETE" }))).subscribe((e) => {
    console.log("dbl click", e), c.next();
  });
  function f(e) {
    s.next(e), d.next(e);
  }
  let b = "";
  c.pipe(
    q(() => fetch("https://api.api-ninjas.com/v1/loremipsum", {
      headers: {
        "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1"
      }
    })),
    F((e) => e.ok),
    U((e) => e.json()),
    O(({ text: e }) => e),
    O((e) => e.slice(0, 255)),
    $(m)
  ).subscribe((e) => r(0, b = e));
  function N(e) {
    e.preventDefault();
    const D = e.target;
    if (!(D instanceof HTMLFormElement))
      throw TypeError("NotForm");
    const z = new FormData(D);
    fetch(A("/wp-json/todo/v1/todos"), { body: z, method: "POST" }).then(() => {
      c.next(), D.reset();
    });
  }
  function E(e) {
    le.call(this, o, e);
  }
  const L = (e) => f(e.id), R = () => a.next(a.value - 1), w = () => a.next(a.value + 1);
  function v() {
    p = Z(this.value), s.set(p);
  }
  function l() {
    b = this.value, r(0, b);
  }
  return [
    b,
    u,
    p,
    S,
    s,
    a,
    i,
    t,
    f,
    N,
    E,
    L,
    R,
    w,
    v,
    l
  ];
}
class fe extends J {
  constructor(n) {
    super();
    const r = document.createElement("style");
    r.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}ul{list-style-type:none;margin:0;padding:0}li{background-color:white;border:1px solid white;border-radius:4px;margin:1rem 0;padding:0.5rem 1rem;user-select:none}li:first-child{margin-top:0}li:last-child{margin-bottom:0}", this.shadowRoot.appendChild(r), Q(
      this,
      {
        target: this.shadowRoot,
        props: V(this.attributes),
        customElement: !0
      },
      ae,
      re,
      Y,
      {},
      null
    ), n && n.target && k(n.target, this, n.anchor);
  }
}
customElements.define("wc-svelte-todo", fe);
export {
  fe as default
};
