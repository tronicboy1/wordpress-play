import { S as he, i as me, a as be, b as S, s as ge, e as c, c as w, t as I, n as ae, j as f, v as ie, d as a, k as re, w as te, l as A, m as _e, g as oe, h as U, r as ve, o as E, q as ke, x as se } from "./index-2f6ecf53.js";
import { a as le } from "./index-ae6e79f2.js";
import "./Observable-2c9a47b5.js";
function ce(e, i, l) {
  const o = e.slice();
  return o[38] = i[l], o;
}
function ue(e) {
  let i, l = (
    /*$posts$*/
    e[3]
  ), o = [];
  for (let r = 0; r < l.length; r += 1)
    o[r] = pe(ce(e, l, r));
  return {
    c() {
      i = c("ul");
      for (let r = 0; r < o.length; r += 1)
        o[r].c();
      f(i, "id", "posts");
    },
    m(r, u) {
      S(r, i, u);
      for (let n = 0; n < o.length; n += 1)
        o[n] && o[n].m(i, null);
    },
    p(r, u) {
      if (u[0] & /*$posts$*/
      8) {
        l = /*$posts$*/
        r[3];
        let n;
        for (n = 0; n < l.length; n += 1) {
          const P = ce(r, l, n);
          o[n] ? o[n].p(P, u) : (o[n] = pe(P), o[n].c(), o[n].m(i, null));
        }
        for (; n < o.length; n += 1)
          o[n].d(1);
        o.length = l.length;
      }
    },
    d(r) {
      r && U(i), ke(o, r);
    }
  };
}
function pe(e) {
  let i, l, o, r, u = (
    /*post*/
    e[38].title.rendered + ""
  ), n, P, C, y, G;
  return {
    c() {
      i = c("li"), l = c("a"), o = c("article"), r = c("h1"), n = I(u), P = w(), C = c("p"), G = w(), f(l, "href", y = "/archives/" + /*post*/
      e[38].id);
    },
    m(_, p) {
      S(_, i, p), a(i, l), a(l, o), a(o, r), a(r, n), a(o, P), a(o, C), a(i, G);
    },
    p(_, p) {
      p[0] & /*$posts$*/
      8 && u !== (u = /*post*/
      _[38].title.rendered + "") && oe(n, u), p[0] & /*$posts$*/
      8 && y !== (y = "/archives/" + /*post*/
      _[38].id) && f(l, "href", y);
    },
    d(_) {
      _ && U(i);
    }
  };
}
function de(e) {
  let i, l, o, r;
  return {
    c() {
      i = c("button"), l = I(
        /*$lastPageNo$*/
        e[5]
      ), f(i, "type", "button");
    },
    m(u, n) {
      S(u, i, n), a(i, l), o || (r = A(
        i,
        "click",
        /*click_handler_1*/
        e[22]
      ), o = !0);
    },
    p(u, n) {
      n[0] & /*$lastPageNo$*/
      32 && oe(
        l,
        /*$lastPageNo$*/
        u[5]
      );
    },
    d(u) {
      u && U(i), o = !1, r();
    }
  };
}
function fe(e) {
  let i, l, o, r;
  return {
    c() {
      i = c("button"), l = I(
        /*$nextPageNo$*/
        e[8]
      ), f(i, "type", "button");
    },
    m(u, n) {
      S(u, i, n), a(i, l), o || (r = A(
        i,
        "click",
        /*click_handler_2*/
        e[23]
      ), o = !0);
    },
    p(u, n) {
      n[0] & /*$nextPageNo$*/
      256 && oe(
        l,
        /*$nextPageNo$*/
        u[8]
      );
    },
    d(u) {
      u && U(i), o = !1, r();
    }
  };
}
function we(e) {
  let i, l, o, r, u, n, P, C, y, G, _, p, M, V, W, R, Y, k, T, F, L, x, h, N, q, j, m, B, Z, z, X, H, D, J, $, K, O, ne, Q, ee, t, d = (
    /*$posts$*/
    e[3] && ue(e)
  ), b = (
    /*$canGoBack$*/
    e[4] && de(e)
  ), g = (
    /*$canGoForward$*/
    e[7] && fe(e)
  );
  return {
    c() {
      i = c("nav"), l = c("ul"), o = c("li"), r = c("label"), r.textContent = "Posts Per Page", u = w(), n = c("input"), P = w(), C = c("li"), y = c("label"), y.textContent = "Order", G = w(), _ = c("select"), p = c("option"), p.textContent = "Desc", M = c("option"), M.textContent = "Asc", V = w(), W = c("li"), R = c("label"), R.textContent = "Order By", Y = w(), k = c("select"), T = c("option"), T.textContent = "Date", F = c("option"), F.textContent = "Id", L = c("option"), L.textContent = "Title", x = c("option"), x.textContent = "Slug", h = w(), N = c("ul"), N.innerHTML = "<li></li>", q = w(), d && d.c(), j = w(), m = c("nav"), B = c("button"), Z = I("Back"), X = w(), b && b.c(), H = w(), D = c("button"), J = I(
        /*$pageNo$*/
        e[6]
      ), $ = w(), g && g.c(), K = w(), O = c("button"), ne = I("Forward"), this.c = ae, f(r, "for", "per-page"), f(n, "type", "number"), f(n, "name", "per-page"), f(n, "id", "per-page"), f(n, "min", "1"), f(y, "for", "order"), p.__value = "desc", p.value = p.__value, M.__value = "asc", M.value = M.__value, f(_, "name", "order"), f(_, "id", "order"), /*$order$*/
      e[1] === void 0 && ie(() => (
        /*select0_change_handler*/
        e[19].call(_)
      )), f(R, "for", "order-by"), T.__value = "date", T.value = T.__value, F.__value = "id", F.value = F.__value, L.__value = "title", L.value = L.__value, x.__value = "slug", x.value = x.__value, f(k, "name", "order-by"), f(k, "id", "order-by"), /*$orderBy$*/
      e[2] === void 0 && ie(() => (
        /*select1_change_handler*/
        e[20].call(k)
      )), B.disabled = z = !/*$canGoBack$*/
      e[4], f(B, "type", "button"), f(D, "type", "button"), f(D, "class", "active"), O.disabled = Q = !/*$canGoForward$*/
      e[7], f(O, "type", "button"), f(m, "id", "paginator");
    },
    m(s, v) {
      S(s, i, v), a(i, l), a(l, o), a(o, r), a(o, u), a(o, n), re(
        n,
        /*$postsPerPage$*/
        e[0]
      ), a(l, P), a(l, C), a(C, y), a(C, G), a(C, _), a(_, p), a(_, M), te(
        _,
        /*$order$*/
        e[1],
        !0
      ), a(l, V), a(l, W), a(W, R), a(W, Y), a(W, k), a(k, T), a(k, F), a(k, L), a(k, x), te(
        k,
        /*$orderBy$*/
        e[2],
        !0
      ), a(i, h), a(i, N), S(s, q, v), d && d.m(s, v), S(s, j, v), S(s, m, v), a(m, B), a(B, Z), a(m, X), b && b.m(m, null), a(m, H), a(m, D), a(D, J), a(m, $), g && g.m(m, null), a(m, K), a(m, O), a(O, ne), ee || (t = [
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
          O,
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
      s[3] ? d ? d.p(s, v) : (d = ue(s), d.c(), d.m(j.parentNode, j)) : d && (d.d(1), d = null), v[0] & /*$canGoBack$*/
      16 && z !== (z = !/*$canGoBack$*/
      s[4]) && (B.disabled = z), /*$canGoBack$*/
      s[4] ? b ? b.p(s, v) : (b = de(s), b.c(), b.m(m, H)) : b && (b.d(1), b = null), v[0] & /*$pageNo$*/
      64 && oe(
        J,
        /*$pageNo$*/
        s[6]
      ), /*$canGoForward$*/
      s[7] ? g ? g.p(s, v) : (g = fe(s), g.c(), g.m(m, K)) : g && (g.d(1), g = null), v[0] & /*$canGoForward$*/
      128 && Q !== (Q = !/*$canGoForward$*/
      s[7]) && (O.disabled = Q);
    },
    i: ae,
    o: ae,
    d(s) {
      s && U(i), s && U(q), d && d.d(s), s && U(j), s && U(m), b && b.d(), g && g.d(), ee = !1, ve(t);
    }
  };
}
function ye(e, i, l) {
  let o, r, u, n, P, C, y, G, _;
  const { map: p, mergeMap: M, sampleTime: V, switchMap: W, combineLatest: R, tap: Y, catchError: k, of: T, from: F, shareReplay: L } = rxjs, x = () => new URL("/wp-json/wp/v2/posts", window.location.origin), h = new le(1);
  E(e, h, (t) => l(6, y = t));
  const N = new le(5);
  E(e, N, (t) => l(0, o = t));
  const q = new le("desc");
  E(e, q, (t) => l(1, r = t));
  const j = new le("date");
  E(e, j, (t) => l(2, u = t));
  const m = R([h, N, q, j]).pipe(
    V(100),
    p((t) => t.map(String)),
    p(([t, d, b, g]) => {
      const s = x();
      return s.searchParams.set("page", t), s.searchParams.set("per_page", d), s.searchParams.set("order", b), s.searchParams.set("orderby", g), s;
    }),
    W((t) => fetch(t)),
    M((t) => {
      if (!t.ok)
        throw Error();
      return t.json();
    }),
    k((t, d) => (console.error(t), T([]))),
    Y((t) => console.log("res: ", t))
  );
  E(e, m, (t) => l(3, n = t));
  const B = F(fetch(x())).pipe(p((t) => t.headers.get("X-WP-Total")), p(Number), L(1)), Z = R([N, B]).pipe(p(([t, d]) => Math.ceil(d / t))), z = R([h, Z]).pipe(p(([t, d]) => t < d));
  E(e, z, (t) => l(7, G = t));
  const X = h.pipe(p((t) => t > 1));
  E(e, X, (t) => l(4, P = t));
  const H = h.pipe(p((t) => t + 1));
  E(e, H, (t) => l(8, _ = t));
  const D = h.pipe(p((t) => t - 1));
  E(e, D, (t) => l(5, C = t));
  function J() {
    o = _e(this.value), N.set(o);
  }
  function $() {
    r = se(this), q.set(r);
  }
  function K() {
    u = se(this), j.set(u);
  }
  return [
    o,
    r,
    u,
    n,
    P,
    C,
    y,
    G,
    _,
    h,
    N,
    q,
    j,
    m,
    z,
    X,
    H,
    D,
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
    l.textContent = ":host{display:block;width:90%;max-width:600px;margin:1rem auto;border:1px solid white;border-radius:4px;box-shadow:3px 3px 5px rgba(0, 0, 0, 0.164);padding:1rem;background-color:white}*{box-sizing:border-box}a{color:inherit;text-decoration:none}ul{list-style-type:none;margin:0;padding:0}#posts li{margin:1rem 0}#posts li:first-child{margin-top:0}#posts li:last-child{margin-bottom:0}nav{padding:0.5rem;border-bottom:1px solid lightgray;margin-bottom:1rem}nav ul{display:flex;flex-direction:row;justify-content:left}nav ul li{display:flex;flex-direction:column;margin:0 0.5rem}nav ul li:last-child{margin-right:0}nav ul li:first-child{margin-left:0}input,select{padding:0.25rem;border:1px solid lightgray;border-radius:4px;height:40px}#paginator{display:flex;flex-direction:row;justify-content:center}#paginator button{height:40px;border:1px solid lightgray;background-color:white;border-radius:4px;margin:0 0.5rem;min-width:60px}.active{background-color:lightgray !important}", this.shadowRoot.appendChild(l), me(
      this,
      {
        target: this.shadowRoot,
        props: be(this.attributes),
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
