import { S as J, i as Q, a as V, b as k, s as Y, e as _, c as T, n as M, j as C, k as q, d as h, l as y, m as Z, h as j, r as O, o as W, p as ee, q as te, t as N, g as B, u as le } from "./index-2f6ecf53.js";
import { buffer as oe, debounceTime as ne, filter as x, map as I, Subject as X, startWith as ie, switchMap as F, mergeMap as U, takeUntil as $, sampleTime as se } from "rxjs";
import { S as ue, a as re } from "./index-57368024.js";
function ae(o = 250) {
  return (n) => n.pipe(oe(n.pipe(ne(o))), x((s) => s.length > 1), I(([s]) => s));
}
function P(o, n, s) {
  const r = o.slice();
  return r[19] = n[s], r;
}
function G(o) {
  let n, s, r, p, S, u, m, c, a = (
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
      s = T(), r = _("nav"), p = _("button"), p.textContent = "Back", S = T(), u = _("button"), u.textContent = "Next";
    },
    m(t, d) {
      k(t, n, d);
      for (let f = 0; f < i.length; f += 1)
        i[f] && i[f].m(n, null);
      k(t, s, d), k(t, r, d), h(r, p), h(r, S), h(r, u), m || (c = [
        y(
          p,
          "click",
          /*click_handler_1*/
          o[12]
        ),
        y(
          u,
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
      t && j(n), te(i, t), t && j(s), t && j(r), m = !1, O(c);
    }
  };
}
function H(o) {
  let n, s, r = (
    /*todo*/
    o[19].id + ""
  ), p, S, u = (
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
      n = _("li"), s = _("small"), p = N(r), S = _("br"), m = N(u);
    },
    m(t, d) {
      k(t, n, d), h(n, s), h(s, p), h(n, S), h(n, m), c || (a = [
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
      2 && r !== (r = /*todo*/
      o[19].id + "") && B(p, r), d & /*$todos$*/
      2 && u !== (u = /*todo*/
      o[19].text + "") && B(m, u);
    },
    d(t) {
      t && j(n), c = !1, O(a);
    }
  };
}
function K(o) {
  let n, s, r = (
    /*$todo$*/
    o[3].text + ""
  ), p, S, u, m, c = new Date(
    /*$todo$*/
    o[3].created_at
  ).toLocaleString() + "", a;
  return {
    c() {
      n = _("article"), s = _("h1"), p = N(r), S = T(), u = _("p"), m = N("Date: "), a = N(c);
    },
    m(i, t) {
      k(i, n, t), h(n, s), h(s, p), h(n, S), h(n, u), h(u, m), h(u, a);
    },
    p(i, t) {
      t & /*$todo$*/
      8 && r !== (r = /*$todo$*/
      i[3].text + "") && B(p, r), t & /*$todo$*/
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
function fe(o) {
  let n, s, r, p, S, u, m, c, a, i, t, d, f, b, g, E, L, R, w = (
    /*$todos$*/
    o[1] && G(o)
  ), v = (
    /*$todo$*/
    o[3] && K(o)
  );
  return {
    c() {
      n = _("h1"), n.textContent = "All Todos", s = T(), w && w.c(), r = T(), p = _("h1"), p.textContent = "Todo Lookup", S = T(), u = _("input"), m = T(), v && v.c(), c = T(), a = _("h1"), a.textContent = "New Todo", i = T(), t = _("form"), d = _("label"), d.textContent = "Text", f = T(), b = _("input"), g = T(), E = _("button"), E.textContent = "Add", this.c = M, C(u, "type", "number"), C(d, "for", "text"), C(b, "type", "text"), C(b, "name", "text"), C(b, "id", "text"), C(b, "maxlength", "255"), b.required = !0, C(E, "type", "submit");
    },
    m(l, e) {
      k(l, n, e), k(l, s, e), w && w.m(l, e), k(l, r, e), k(l, p, e), k(l, S, e), k(l, u, e), q(
        u,
        /*$input$*/
        o[2]
      ), k(l, m, e), v && v.m(l, e), k(l, c, e), k(l, a, e), k(l, i, e), k(l, t, e), h(t, d), h(t, f), h(t, b), q(
        b,
        /*textInput*/
        o[0]
      ), h(t, g), h(t, E), L || (R = [
        y(
          u,
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
      l[1] ? w ? w.p(l, e) : (w = G(l), w.c(), w.m(r.parentNode, r)) : w && (w.d(1), w = null), e & /*$input$*/
      4 && Z(u.value) !== /*$input$*/
      l[2] && q(
        u,
        /*$input$*/
        l[2]
      ), /*$todo$*/
      l[3] ? v ? v.p(l, e) : (v = K(l), v.c(), v.m(c.parentNode, c)) : v && (v.d(1), v = null), e & /*textInput*/
      1 && b.value !== /*textInput*/
      l[0] && q(
        b,
        /*textInput*/
        l[0]
      );
    },
    i: M,
    o: M,
    d(l) {
      l && j(n), l && j(s), w && w.d(l), l && j(r), l && j(p), l && j(S), l && j(u), l && j(m), v && v.d(l), l && j(c), l && j(a), l && j(i), l && j(t), L = !1, O(R);
    }
  };
}
function A(o) {
  return new URL(o, document.location.origin);
}
function pe(o, n, s) {
  let r, p, S;
  const u = new ue();
  W(o, u, (e) => s(2, p = e));
  const m = new X();
  ee(() => {
    m.next();
  });
  const c = new X(), a = new re(1), i = c.pipe(
    ie(void 0),
    F(() => a),
    F((e) => {
      const D = A("/wp-json/todo/v1/todos");
      return D.searchParams.set("page", String(e)), fetch(D);
    }),
    x((e) => e.ok),
    U((e) => e.json())
  );
  W(o, i, (e) => s(1, r = e));
  const t = u.pipe($(m), x(Boolean), se(500), F((e) => fetch(A(`/wp-json/todo/v1/todos/${e}`))), x((e) => e.ok), U((e) => e.json()));
  W(o, t, (e) => s(3, S = e));
  const d = new X();
  d.pipe($(m), ae(500), U((e) => fetch(A(`/wp-json/todo/v1/todos/${e}`), { method: "DELETE" }))).subscribe((e) => {
    console.log("dbl click", e), c.next();
  });
  function f(e) {
    u.next(e), d.next(e);
  }
  let b = "";
  c.pipe(
    F(() => fetch("https://api.api-ninjas.com/v1/loremipsum", {
      headers: {
        "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1"
      }
    })),
    x((e) => e.ok),
    U((e) => e.json()),
    I(({ text: e }) => e),
    I((e) => e.slice(0, 255)),
    $(m)
  ).subscribe((e) => s(0, b = e));
  function g(e) {
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
    p = Z(this.value), u.set(p);
  }
  function l() {
    b = this.value, s(0, b);
  }
  return [
    b,
    r,
    p,
    S,
    u,
    a,
    i,
    t,
    f,
    g,
    E,
    L,
    R,
    w,
    v,
    l
  ];
}
class ce extends J {
  constructor(n) {
    super();
    const s = document.createElement("style");
    s.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}ul{list-style-type:none;margin:0;padding:0}li{background-color:white;border:1px solid white;border-radius:4px;margin:1rem 0;padding:0.5rem 1rem;user-select:none}li:first-child{margin-top:0}li:last-child{margin-bottom:0}", this.shadowRoot.appendChild(s), Q(
      this,
      {
        target: this.shadowRoot,
        props: V(this.attributes),
        customElement: !0
      },
      pe,
      fe,
      Y,
      {},
      null
    ), n && n.target && k(n.target, this, n.anchor);
  }
}
customElements.define("wc-svelte-todo", ce);
export {
  ce as default
};
