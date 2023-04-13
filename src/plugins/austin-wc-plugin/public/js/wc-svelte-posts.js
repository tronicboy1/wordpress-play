import { S as be, i as ge, a as ve, b as R, s as ke, e as s, c as w, t as H, n as ne, j as d, v as se, d as a, k as ue, w as Z, l as A, m as me, g as ee, h as O, r as we, o as G, q as ye, x as ce } from "./index-2f6ecf53.js";
import { combineLatest as ae, sampleTime as Pe, map as M, switchMap as Ce, mergeMap as Ne, catchError as je, of as xe, tap as Be, from as Ee, shareReplay as Se } from "rxjs";
import { a as $ } from "./index-57368024.js";
function pe(e, i, l) {
  const o = e.slice();
  return o[28] = i[l], o;
}
function de(e) {
  let i, l = (
    /*$posts$*/
    e[3]
  ), o = [];
  for (let r = 0; r < l.length; r += 1)
    o[r] = fe(pe(e, l, r));
  return {
    c() {
      i = s("ul");
      for (let r = 0; r < o.length; r += 1)
        o[r].c();
      d(i, "id", "posts");
    },
    m(r, u) {
      R(r, i, u);
      for (let n = 0; n < o.length; n += 1)
        o[n] && o[n].m(i, null);
    },
    p(r, u) {
      if (u & /*$posts$*/
      8) {
        l = /*$posts$*/
        r[3];
        let n;
        for (n = 0; n < l.length; n += 1) {
          const P = pe(r, l, n);
          o[n] ? o[n].p(P, u) : (o[n] = fe(P), o[n].c(), o[n].m(i, null));
        }
        for (; n < o.length; n += 1)
          o[n].d(1);
        o.length = l.length;
      }
    },
    d(r) {
      r && O(i), ye(o, r);
    }
  };
}
function fe(e) {
  let i, l, o, r, u = (
    /*post*/
    e[28].title.rendered + ""
  ), n, P, C, y, T;
  return {
    c() {
      i = s("li"), l = s("a"), o = s("article"), r = s("h1"), n = H(u), P = w(), C = s("p"), T = w(), d(l, "href", y = "/archives/" + /*post*/
      e[28].id);
    },
    m(f, m) {
      R(f, i, m), a(i, l), a(l, o), a(o, r), a(r, n), a(o, P), a(o, C), a(i, T);
    },
    p(f, m) {
      m & /*$posts$*/
      8 && u !== (u = /*post*/
      f[28].title.rendered + "") && ee(n, u), m & /*$posts$*/
      8 && y !== (y = "/archives/" + /*post*/
      f[28].id) && d(l, "href", y);
    },
    d(f) {
      f && O(i);
    }
  };
}
function _e(e) {
  let i, l, o, r;
  return {
    c() {
      i = s("button"), l = H(
        /*$lastPageNo$*/
        e[5]
      ), d(i, "type", "button");
    },
    m(u, n) {
      R(u, i, n), a(i, l), o || (r = A(
        i,
        "click",
        /*click_handler_1*/
        e[22]
      ), o = !0);
    },
    p(u, n) {
      n & /*$lastPageNo$*/
      32 && ee(
        l,
        /*$lastPageNo$*/
        u[5]
      );
    },
    d(u) {
      u && O(i), o = !1, r();
    }
  };
}
function he(e) {
  let i, l, o, r;
  return {
    c() {
      i = s("button"), l = H(
        /*$nextPageNo$*/
        e[8]
      ), d(i, "type", "button");
    },
    m(u, n) {
      R(u, i, n), a(i, l), o || (r = A(
        i,
        "click",
        /*click_handler_2*/
        e[23]
      ), o = !0);
    },
    p(u, n) {
      n & /*$nextPageNo$*/
      256 && ee(
        l,
        /*$nextPageNo$*/
        u[8]
      );
    },
    d(u) {
      u && O(i), o = !1, r();
    }
  };
}
function Ge(e) {
  let i, l, o, r, u, n, P, C, y, T, f, m, p, F, N, x, I, b, L, B, E, S, X, J, K, U, _, q, te, Q, t, j, W, V, D, le, z, ie, Y, oe, re, g = (
    /*$posts$*/
    e[3] && de(e)
  ), v = (
    /*$canGoBack$*/
    e[4] && _e(e)
  ), k = (
    /*$canGoForward$*/
    e[7] && he(e)
  );
  return {
    c() {
      i = s("nav"), l = s("ul"), o = s("li"), r = s("label"), r.textContent = "Posts Per Page", u = w(), n = s("input"), P = w(), C = s("li"), y = s("label"), y.textContent = "Order", T = w(), f = s("select"), m = s("option"), m.textContent = "Desc", p = s("option"), p.textContent = "Asc", F = w(), N = s("li"), x = s("label"), x.textContent = "Order By", I = w(), b = s("select"), L = s("option"), L.textContent = "Date", B = s("option"), B.textContent = "Id", E = s("option"), E.textContent = "Title", S = s("option"), S.textContent = "Slug", X = w(), J = s("ul"), J.innerHTML = "<li></li>", K = w(), g && g.c(), U = w(), _ = s("nav"), q = s("button"), te = H("Back"), t = w(), v && v.c(), j = w(), W = s("button"), V = H(
        /*$pageNo$*/
        e[6]
      ), D = w(), k && k.c(), le = w(), z = s("button"), ie = H("Forward"), this.c = ne, d(r, "for", "per-page"), d(n, "type", "number"), d(n, "name", "per-page"), d(n, "id", "per-page"), d(n, "min", "1"), d(y, "for", "order"), m.__value = "desc", m.value = m.__value, p.__value = "asc", p.value = p.__value, d(f, "name", "order"), d(f, "id", "order"), /*$order$*/
      e[1] === void 0 && se(() => (
        /*select0_change_handler*/
        e[19].call(f)
      )), d(x, "for", "order-by"), L.__value = "date", L.value = L.__value, B.__value = "id", B.value = B.__value, E.__value = "title", E.value = E.__value, S.__value = "slug", S.value = S.__value, d(b, "name", "order-by"), d(b, "id", "order-by"), /*$orderBy$*/
      e[2] === void 0 && se(() => (
        /*select1_change_handler*/
        e[20].call(b)
      )), q.disabled = Q = !/*$canGoBack$*/
      e[4], d(q, "type", "button"), d(W, "type", "button"), d(W, "class", "active"), z.disabled = Y = !/*$canGoForward$*/
      e[7], d(z, "type", "button"), d(_, "id", "paginator");
    },
    m(c, h) {
      R(c, i, h), a(i, l), a(l, o), a(o, r), a(o, u), a(o, n), ue(
        n,
        /*$postsPerPage$*/
        e[0]
      ), a(l, P), a(l, C), a(C, y), a(C, T), a(C, f), a(f, m), a(f, p), Z(
        f,
        /*$order$*/
        e[1],
        !0
      ), a(l, F), a(l, N), a(N, x), a(N, I), a(N, b), a(b, L), a(b, B), a(b, E), a(b, S), Z(
        b,
        /*$orderBy$*/
        e[2],
        !0
      ), a(i, X), a(i, J), R(c, K, h), g && g.m(c, h), R(c, U, h), R(c, _, h), a(_, q), a(q, te), a(_, t), v && v.m(_, null), a(_, j), a(_, W), a(W, V), a(_, D), k && k.m(_, null), a(_, le), a(_, z), a(z, ie), oe || (re = [
        A(
          n,
          "input",
          /*input_input_handler*/
          e[18]
        ),
        A(
          f,
          "change",
          /*select0_change_handler*/
          e[19]
        ),
        A(
          b,
          "change",
          /*select1_change_handler*/
          e[20]
        ),
        A(
          q,
          "click",
          /*click_handler*/
          e[21]
        ),
        A(
          z,
          "click",
          /*click_handler_3*/
          e[24]
        )
      ], oe = !0);
    },
    p(c, [h]) {
      h & /*$postsPerPage$*/
      1 && me(n.value) !== /*$postsPerPage$*/
      c[0] && ue(
        n,
        /*$postsPerPage$*/
        c[0]
      ), h & /*$order$*/
      2 && Z(
        f,
        /*$order$*/
        c[1]
      ), h & /*$orderBy$*/
      4 && Z(
        b,
        /*$orderBy$*/
        c[2]
      ), /*$posts$*/
      c[3] ? g ? g.p(c, h) : (g = de(c), g.c(), g.m(U.parentNode, U)) : g && (g.d(1), g = null), h & /*$canGoBack$*/
      16 && Q !== (Q = !/*$canGoBack$*/
      c[4]) && (q.disabled = Q), /*$canGoBack$*/
      c[4] ? v ? v.p(c, h) : (v = _e(c), v.c(), v.m(_, j)) : v && (v.d(1), v = null), h & /*$pageNo$*/
      64 && ee(
        V,
        /*$pageNo$*/
        c[6]
      ), /*$canGoForward$*/
      c[7] ? k ? k.p(c, h) : (k = he(c), k.c(), k.m(_, le)) : k && (k.d(1), k = null), h & /*$canGoForward$*/
      128 && Y !== (Y = !/*$canGoForward$*/
      c[7]) && (z.disabled = Y);
    },
    i: ne,
    o: ne,
    d(c) {
      c && O(i), c && O(K), g && g.d(c), c && O(U), c && O(_), v && v.d(), k && k.d(), oe = !1, we(re);
    }
  };
}
function Me(e, i, l) {
  let o, r, u, n, P, C, y, T, f;
  const m = () => new URL("/wp-json/wp/v2/posts", window.location.origin), p = new $(1);
  G(e, p, (t) => l(6, y = t));
  const F = new $(5);
  G(e, F, (t) => l(0, o = t));
  const N = new $("desc");
  G(e, N, (t) => l(1, r = t));
  const x = new $("date");
  G(e, x, (t) => l(2, u = t));
  const I = ae([p, F, N, x]).pipe(
    Pe(100),
    M((t) => t.map(String)),
    M(([t, j, W, V]) => {
      const D = m();
      return D.searchParams.set("page", t), D.searchParams.set("per_page", j), D.searchParams.set("order", W), D.searchParams.set("orderby", V), D;
    }),
    Ce((t) => fetch(t)),
    Ne((t) => {
      if (!t.ok)
        throw Error();
      return t.json();
    }),
    je((t, j) => (console.error(t), xe([]))),
    Be((t) => console.log("res: ", t))
  );
  G(e, I, (t) => l(3, n = t));
  const b = Ee(fetch(m())).pipe(M((t) => t.headers.get("X-WP-Total")), M(Number), Se(1)), L = ae([F, b]).pipe(M(([t, j]) => Math.ceil(j / t))), B = ae([p, L]).pipe(M(([t, j]) => t < j));
  G(e, B, (t) => l(7, T = t));
  const E = p.pipe(M((t) => t > 1));
  G(e, E, (t) => l(4, P = t));
  const S = p.pipe(M((t) => t + 1));
  G(e, S, (t) => l(8, f = t));
  const X = p.pipe(M((t) => t - 1));
  G(e, X, (t) => l(5, C = t));
  function J() {
    o = me(this.value), F.set(o);
  }
  function K() {
    r = ce(this), N.set(r);
  }
  function U() {
    u = ce(this), x.set(u);
  }
  return [
    o,
    r,
    u,
    n,
    P,
    C,
    y,
    T,
    f,
    p,
    F,
    N,
    x,
    I,
    B,
    E,
    S,
    X,
    J,
    K,
    U,
    () => p.next(p.value - 1),
    () => p.next(p.value - 1),
    () => p.next(p.value + 1),
    () => p.next(p.value + 1)
  ];
}
class Re extends be {
  constructor(i) {
    super();
    const l = document.createElement("style");
    l.textContent = ":host{display:block;width:90%;max-width:600px;margin:1rem auto;border:1px solid white;border-radius:4px;box-shadow:3px 3px 5px rgba(0, 0, 0, 0.164);padding:1rem;background-color:white}*{box-sizing:border-box}a{color:inherit;text-decoration:none}ul{list-style-type:none;margin:0;padding:0}#posts li{margin:1rem 0}#posts li:first-child{margin-top:0}#posts li:last-child{margin-bottom:0}nav{padding:0.5rem;border-bottom:1px solid lightgray;margin-bottom:1rem}nav ul{display:flex;flex-direction:row;justify-content:left}nav ul li{display:flex;flex-direction:column;margin:0 0.5rem}nav ul li:last-child{margin-right:0}nav ul li:first-child{margin-left:0}input,select{padding:0.25rem;border:1px solid lightgray;border-radius:4px;height:40px}#paginator{display:flex;flex-direction:row;justify-content:center}#paginator button{height:40px;border:1px solid lightgray;background-color:white;border-radius:4px;margin:0 0.5rem;min-width:60px}.active{background-color:lightgray !important}", this.shadowRoot.appendChild(l), ge(
      this,
      {
        target: this.shadowRoot,
        props: ve(this.attributes),
        customElement: !0
      },
      Me,
      Ge,
      ke,
      {},
      null
    ), i && i.target && R(i.target, this, i.anchor);
  }
}
customElements.define("wc-svelte-posts", Re);
export {
  Re as default
};
