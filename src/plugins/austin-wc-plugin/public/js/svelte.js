function g() {
}
function E(t) {
  return t();
}
function S() {
  return /* @__PURE__ */ Object.create(null);
}
function d(t) {
  t.forEach(E);
}
function y(t) {
  return typeof t == "function";
}
function Q(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let _;
function R(t, e) {
  return _ || (_ = document.createElement("a")), _.href = e, t === _.href;
}
function q(t) {
  return Object.keys(t).length === 0;
}
function U(t, e) {
  t.appendChild(e);
}
function W(t, e, n) {
  t.insertBefore(e, n || null);
}
function M(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function X(t) {
  return document.createElement(t);
}
function T(t) {
  return document.createTextNode(t);
}
function Y() {
  return T(" ");
}
function Z(t, e, n, r) {
  return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
}
function tt(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function H(t) {
  return Array.from(t.childNodes);
}
function et(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function nt(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let w;
function l(t) {
  w = t;
}
const a = [], A = [];
let u = [];
const L = [], B = /* @__PURE__ */ Promise.resolve();
let b = !1;
function P() {
  b || (b = !0, B.then(N));
}
function x(t) {
  u.push(t);
}
const p = /* @__PURE__ */ new Set();
let i = 0;
function N() {
  if (i !== 0)
    return;
  const t = w;
  do {
    try {
      for (; i < a.length; ) {
        const e = a[i];
        i++, l(e), V(e.$$);
      }
    } catch (e) {
      throw a.length = 0, i = 0, e;
    }
    for (l(null), a.length = 0, i = 0; A.length; )
      A.pop()();
    for (let e = 0; e < u.length; e += 1) {
      const n = u[e];
      p.has(n) || (p.add(n), n());
    }
    u.length = 0;
  } while (a.length);
  for (; L.length; )
    L.pop()();
  b = !1, p.clear(), l(t);
}
function V(t) {
  if (t.fragment !== null) {
    t.update(), d(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(x);
  }
}
function z(t) {
  const e = [], n = [];
  u.forEach((r) => t.indexOf(r) === -1 ? e.push(r) : n.push(r)), n.forEach((r) => r()), u = e;
}
const m = /* @__PURE__ */ new Set();
let D;
function F(t, e) {
  t && t.i && (m.delete(t), t.i(e));
}
function rt(t, e, n, r) {
  if (t && t.o) {
    if (m.has(t))
      return;
    m.add(t), D.c.push(() => {
      m.delete(t), r && (n && t.d(1), r());
    }), t.o(e);
  } else
    r && r();
}
function st(t) {
  t && t.c();
}
function G(t, e, n, r) {
  const { fragment: c, after_update: $ } = t.$$;
  c && c.m(e, n), r || x(() => {
    const f = t.$$.on_mount.map(E).filter(y);
    t.$$.on_destroy ? t.$$.on_destroy.push(...f) : d(f), t.$$.on_mount = [];
  }), $.forEach(x);
}
function I(t, e) {
  const n = t.$$;
  n.fragment !== null && (z(n.after_update), d(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function J(t, e) {
  t.$$.dirty[0] === -1 && (a.push(t), P(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function ot(t, e, n, r, c, $, f, O = [-1]) {
  const h = w;
  l(t);
  const s = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: $,
    update: g,
    not_equal: c,
    bound: S(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: S(),
    dirty: O,
    skip_bound: !1,
    root: e.target || h.$$.root
  };
  f && f(s.root);
  let k = !1;
  if (s.ctx = n ? n(t, e.props || {}, (o, v, ...C) => {
    const j = C.length ? C[0] : v;
    return s.ctx && c(s.ctx[o], s.ctx[o] = j) && (!s.skip_bound && s.bound[o] && s.bound[o](j), k && J(t, o)), v;
  }) : [], s.update(), k = !0, d(s.before_update), s.fragment = r ? r(s.ctx) : !1, e.target) {
    if (e.hydrate) {
      const o = H(e.target);
      s.fragment && s.fragment.l(o), o.forEach(M);
    } else
      s.fragment && s.fragment.c();
    e.intro && F(t.$$.fragment), G(t, e.target, e.anchor, e.customElement), N();
  }
  l(h);
}
let K;
typeof HTMLElement == "function" && (K = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(E).filter(y);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, n) {
    this[t] = n;
  }
  disconnectedCallback() {
    d(this.$$.on_disconnect);
  }
  $destroy() {
    I(this, 1), this.$destroy = g;
  }
  $on(t, e) {
    if (!y(e))
      return g;
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return n.push(e), () => {
      const r = n.indexOf(e);
      r !== -1 && n.splice(r, 1);
    };
  }
  $set(t) {
    this.$$set && !q(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
export {
  K as S,
  nt as a,
  W as b,
  U as c,
  et as d,
  X as e,
  M as f,
  Y as g,
  st as h,
  ot as i,
  R as j,
  tt as k,
  Z as l,
  G as m,
  g as n,
  F as o,
  rt as p,
  I as q,
  N as r,
  Q as s,
  T as t
};
