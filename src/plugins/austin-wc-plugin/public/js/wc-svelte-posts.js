import { S as he, i as be, a as me, b as S, s as ge, e as u, c as w, t as I, n as ae, k as f, r as ie, d as a, l as re, u as te, m as A, o as _e, g as oe, h as W, v as ve, p as E, w as ke, x as se } from "./index-3259abc3.js";
import { a as le } from "./svelte-subjects-77548414.js";
function ue(e, i, l) {
  const o = e.slice();
  return o[38] = i[l], o;
}
function ce(e) {
  let i, l = (
    /*$posts$*/
    e[3]
  ), o = [];
  for (let r = 0; r < l.length; r += 1)
    o[r] = pe(ue(e, l, r));
  return {
    c() {
      i = u("ul");
      for (let r = 0; r < o.length; r += 1)
        o[r].c();
      f(i, "id", "posts");
    },
    m(r, c) {
      S(r, i, c);
      for (let n = 0; n < o.length; n += 1)
        o[n] && o[n].m(i, null);
    },
    p(r, c) {
      if (c[0] & /*$posts$*/
      8) {
        l = /*$posts$*/
        r[3];
        let n;
        for (n = 0; n < l.length; n += 1) {
          const P = ue(r, l, n);
          o[n] ? o[n].p(P, c) : (o[n] = pe(P), o[n].c(), o[n].m(i, null));
        }
        for (; n < o.length; n += 1)
          o[n].d(1);
        o.length = l.length;
      }
    },
    d(r) {
      r && W(i), ke(o, r);
    }
  };
}
function pe(e) {
  let i, l, o, r, c = (
    /*post*/
    e[38].title.rendered + ""
  ), n, P, C, y, G;
  return {
    c() {
      i = u("li"), l = u("a"), o = u("article"), r = u("h1"), n = I(c), P = w(), C = u("p"), G = w(), f(l, "href", y = "/archives/" + /*post*/
      e[38].id);
    },
    m(_, p) {
      S(_, i, p), a(i, l), a(l, o), a(o, r), a(r, n), a(o, P), a(o, C), a(i, G);
    },
    p(_, p) {
      p[0] & /*$posts$*/
      8 && c !== (c = /*post*/
      _[38].title.rendered + "") && oe(n, c), p[0] & /*$posts$*/
      8 && y !== (y = "/archives/" + /*post*/
      _[38].id) && f(l, "href", y);
    },
    d(_) {
      _ && W(i);
    }
  };
}
function de(e) {
  let i, l, o, r;
  return {
    c() {
      i = u("button"), l = I(
        /*$lastPageNo$*/
        e[5]
      ), f(i, "type", "button");
    },
    m(c, n) {
      S(c, i, n), a(i, l), o || (r = A(
        i,
        "click",
        /*click_handler_1*/
        e[22]
      ), o = !0);
    },
    p(c, n) {
      n[0] & /*$lastPageNo$*/
      32 && oe(
        l,
        /*$lastPageNo$*/
        c[5]
      );
    },
    d(c) {
      c && W(i), o = !1, r();
    }
  };
}
function fe(e) {
  let i, l, o, r;
  return {
    c() {
      i = u("button"), l = I(
        /*$nextPageNo$*/
        e[8]
      ), f(i, "type", "button");
    },
    m(c, n) {
      S(c, i, n), a(i, l), o || (r = A(
        i,
        "click",
        /*click_handler_2*/
        e[23]
      ), o = !0);
    },
    p(c, n) {
      n[0] & /*$nextPageNo$*/
      256 && oe(
        l,
        /*$nextPageNo$*/
        c[8]
      );
    },
    d(c) {
      c && W(i), o = !1, r();
    }
  };
}
function we(e) {
  let i, l, o, r, c, n, P, C, y, G, _, p, M, V, q, R, Y, k, T, F, L, N, h, j, D, x, b, B, Z, z, X, H, O, J, $, K, U, ne, Q, ee, t, d = (
    /*$posts$*/
    e[3] && ce(e)
  ), m = (
    /*$canGoBack$*/
    e[4] && de(e)
  ), g = (
    /*$canGoForward$*/
    e[7] && fe(e)
  );
  return {
    c() {
      i = u("nav"), l = u("ul"), o = u("li"), r = u("label"), r.textContent = "Posts Per Page", c = w(), n = u("input"), P = w(), C = u("li"), y = u("label"), y.textContent = "Order", G = w(), _ = u("select"), p = u("option"), p.textContent = "Desc", M = u("option"), M.textContent = "Asc", V = w(), q = u("li"), R = u("label"), R.textContent = "Order By", Y = w(), k = u("select"), T = u("option"), T.textContent = "Date", F = u("option"), F.textContent = "Id", L = u("option"), L.textContent = "Title", N = u("option"), N.textContent = "Slug", h = w(), j = u("ul"), j.innerHTML = "<li></li>", D = w(), d && d.c(), x = w(), b = u("nav"), B = u("button"), Z = I("Back"), X = w(), m && m.c(), H = w(), O = u("button"), J = I(
        /*$pageNo$*/
        e[6]
      ), $ = w(), g && g.c(), K = w(), U = u("button"), ne = I("Forward"), this.c = ae, f(r, "for", "per-page"), f(n, "type", "number"), f(n, "name", "per-page"), f(n, "id", "per-page"), f(n, "min", "1"), f(y, "for", "order"), p.__value = "desc", p.value = p.__value, M.__value = "asc", M.value = M.__value, f(_, "name", "order"), f(_, "id", "order"), /*$order$*/
      e[1] === void 0 && ie(() => (
        /*select0_change_handler*/
        e[19].call(_)
      )), f(R, "for", "order-by"), T.__value = "date", T.value = T.__value, F.__value = "id", F.value = F.__value, L.__value = "title", L.value = L.__value, N.__value = "slug", N.value = N.__value, f(k, "name", "order-by"), f(k, "id", "order-by"), /*$orderBy$*/
      e[2] === void 0 && ie(() => (
        /*select1_change_handler*/
        e[20].call(k)
      )), B.disabled = z = !/*$canGoBack$*/
      e[4], f(B, "type", "button"), f(O, "type", "button"), f(O, "class", "active"), U.disabled = Q = !/*$canGoForward$*/
      e[7], f(U, "type", "button"), f(b, "id", "paginator");
    },
    m(s, v) {
      S(s, i, v), a(i, l), a(l, o), a(o, r), a(o, c), a(o, n), re(
        n,
        /*$postsPerPage$*/
        e[0]
      ), a(l, P), a(l, C), a(C, y), a(C, G), a(C, _), a(_, p), a(_, M), te(
        _,
        /*$order$*/
        e[1],
        !0
      ), a(l, V), a(l, q), a(q, R), a(q, Y), a(q, k), a(k, T), a(k, F), a(k, L), a(k, N), te(
        k,
        /*$orderBy$*/
        e[2],
        !0
      ), a(i, h), a(i, j), S(s, D, v), d && d.m(s, v), S(s, x, v), S(s, b, v), a(b, B), a(B, Z), a(b, X), m && m.m(b, null), a(b, H), a(b, O), a(O, J), a(b, $), g && g.m(b, null), a(b, K), a(b, U), a(U, ne), ee || (t = [
        A(
          n,
          "input",
          /*input_input_handler*/
          e[18]
        ),
        A(
          _,
          "change",
          /*select0_change_handler*/
          e[19]
        ),
        A(
          k,
          "change",
          /*select1_change_handler*/
          e[20]
        ),
        A(
          B,
          "click",
          /*click_handler*/
          e[21]
        ),
        A(
          U,
          "click",
          /*click_handler_3*/
          e[24]
        )
      ], ee = !0);
    },
    p(s, v) {
      v[0] & /*$postsPerPage$*/
      1 && _e(n.value) !== /*$postsPerPage$*/
      s[0] && re(
        n,
        /*$postsPerPage$*/
        s[0]
      ), v[0] & /*$order$*/
      2 && te(
        _,
        /*$order$*/
        s[1]
      ), v[0] & /*$orderBy$*/
      4 && te(
        k,
        /*$orderBy$*/
        s[2]
      ), /*$posts$*/
      s[3] ? d ? d.p(s, v) : (d = ce(s), d.c(), d.m(x.parentNode, x)) : d && (d.d(1), d = null), v[0] & /*$canGoBack$*/
      16 && z !== (z = !/*$canGoBack$*/
      s[4]) && (B.disabled = z), /*$canGoBack$*/
      s[4] ? m ? m.p(s, v) : (m = de(s), m.c(), m.m(b, H)) : m && (m.d(1), m = null), v[0] & /*$pageNo$*/
      64 && oe(
        J,
        /*$pageNo$*/
        s[6]
      ), /*$canGoForward$*/
      s[7] ? g ? g.p(s, v) : (g = fe(s), g.c(), g.m(b, K)) : g && (g.d(1), g = null), v[0] & /*$canGoForward$*/
      128 && Q !== (Q = !/*$canGoForward$*/
      s[7]) && (U.disabled = Q);
    },
    i: ae,
    o: ae,
    d(s) {
      s && W(i), s && W(D), d && d.d(s), s && W(x), s && W(b), m && m.d(), g && g.d(), ee = !1, ve(t);
    }
  };
}
function ye(e, i, l) {
  let o, r, c, n, P, C, y, G, _;
  const { map: p, mergeMap: M, sampleTime: V, switchMap: q, combineLatest: R, tap: Y, catchError: k, of: T, from: F, shareReplay: L } = rxjs, N = () => new URL("/wp-json/wp/v2/posts", window.location.origin), h = new le(1);
  E(e, h, (t) => l(6, y = t));
  const j = new le(5);
  E(e, j, (t) => l(0, o = t));
  const D = new le("desc");
  E(e, D, (t) => l(1, r = t));
  const x = new le("date");
  E(e, x, (t) => l(2, c = t));
  const b = R([h, j, D, x]).pipe(
    V(100),
    p((t) => t.map(String)),
    p(([t, d, m, g]) => {
      const s = N();
      return s.searchParams.set("page", t), s.searchParams.set("per_page", d), s.searchParams.set("order", m), s.searchParams.set("orderby", g), s;
    }),
    q((t) => fetch(t)),
    M((t) => {
      if (!t.ok)
        throw Error();
      return t.json();
    }),
    k((t, d) => (console.error(t), T([]))),
    Y((t) => console.log("res: ", t))
  );
  E(e, b, (t) => l(3, n = t));
  const B = F(fetch(N())).pipe(p((t) => t.headers.get("X-WP-Total")), p(Number), L(1)), Z = R([j, B]).pipe(p(([t, d]) => Math.ceil(d / t))), z = R([h, Z]).pipe(p(([t, d]) => t < d));
  E(e, z, (t) => l(7, G = t));
  const X = h.pipe(p((t) => t > 1));
  E(e, X, (t) => l(4, P = t));
  const H = h.pipe(p((t) => t + 1));
  E(e, H, (t) => l(8, _ = t));
  const O = h.pipe(p((t) => t - 1));
  E(e, O, (t) => l(5, C = t));
  function J() {
    o = _e(this.value), j.set(o);
  }
  function $() {
    r = se(this), D.set(r);
  }
  function K() {
    c = se(this), x.set(c);
  }
  return [
    o,
    r,
    c,
    n,
    P,
    C,
    y,
    G,
    _,
    h,
    j,
    D,
    x,
    b,
    z,
    X,
    H,
    O,
    J,
    $,
    K,
    () => h.next(h.value - 1),
    () => h.next(h.value - 1),
    () => h.next(h.value + 1),
    () => h.next(h.value + 1)
  ];
}
class Pe extends he {
  constructor(i) {
    super();
    const l = document.createElement("style");
    l.textContent = ":host{display:block;width:90%;max-width:600px;margin:1rem auto;border:1px solid white;border-radius:4px;box-shadow:3px 3px 5px rgba(0, 0, 0, 0.164);padding:1rem;background-color:white}*{box-sizing:border-box}a{color:inherit;text-decoration:none}ul{list-style-type:none;margin:0;padding:0}#posts li{margin:1rem 0}#posts li:first-child{margin-top:0}#posts li:last-child{margin-bottom:0}nav{padding:0.5rem;border-bottom:1px solid lightgray;margin-bottom:1rem}nav ul{display:flex;flex-direction:row;justify-content:left}nav ul li{display:flex;flex-direction:column;margin:0 0.5rem}nav ul li:last-child{margin-right:0}nav ul li:first-child{margin-left:0}input,select{padding:0.25rem;border:1px solid lightgray;border-radius:4px;height:40px}#paginator{display:flex;flex-direction:row;justify-content:center}#paginator button{height:40px;border:1px solid lightgray;background-color:white;border-radius:4px;margin:0 0.5rem;min-width:60px}.active{background-color:lightgray !important}", this.shadowRoot.appendChild(l), be(
      this,
      {
        target: this.shadowRoot,
        props: me(this.attributes),
        customElement: !0
      },
      ye,
      we,
      ge,
      {},
      null,
      [-1, -1]
    ), i && i.target && S(i.target, this, i.anchor);
  }
}
customElements.define("wc-svelte-posts", Pe);
export {
  Pe as default
};
