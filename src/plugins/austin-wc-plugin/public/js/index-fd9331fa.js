function p() {
}
function x(t) {
  return t();
}
function j() {
  return /* @__PURE__ */ Object.create(null);
}
function d(t) {
  t.forEach(x);
}
function g(t) {
  return typeof t == "function";
}
function K(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function O(t) {
  return Object.keys(t).length === 0;
}
function Q(t, e) {
  t.appendChild(e);
}
function R(t, e, n) {
  t.insertBefore(e, n || null);
}
function M(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function U(t) {
  return document.createElement(t);
}
function T(t) {
  return document.createTextNode(t);
}
function W() {
  return T(" ");
}
function X(t, e, n, r) {
  return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
}
function Y(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function H(t) {
  return Array.from(t.childNodes);
}
function Z(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function tt(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let E;
function l(t) {
  E = t;
}
const a = [], S = [];
let u = [];
const A = [], q = /* @__PURE__ */ Promise.resolve();
let y = !1;
function B() {
  y || (y = !0, q.then(L));
}
function b(t) {
  u.push(t);
}
const m = /* @__PURE__ */ new Set();
let i = 0;
function L() {
  if (i !== 0)
    return;
  const t = E;
  do {
    try {
      for (; i < a.length; ) {
        const e = a[i];
        i++, l(e), P(e.$$);
      }
    } catch (e) {
      throw a.length = 0, i = 0, e;
    }
    for (l(null), a.length = 0, i = 0; S.length; )
      S.pop()();
    for (let e = 0; e < u.length; e += 1) {
      const n = u[e];
      m.has(n) || (m.add(n), n());
    }
    u.length = 0;
  } while (a.length);
  for (; A.length; )
    A.pop()();
  y = !1, m.clear(), l(t);
}
function P(t) {
  if (t.fragment !== null) {
    t.update(), d(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(b);
  }
}
function V(t) {
  const e = [], n = [];
  u.forEach((r) => t.indexOf(r) === -1 ? e.push(r) : n.push(r)), n.forEach((r) => r()), u = e;
}
const _ = /* @__PURE__ */ new Set();
let z;
function D(t, e) {
  t && t.i && (_.delete(t), t.i(e));
}
function et(t, e, n, r) {
  if (t && t.o) {
    if (_.has(t))
      return;
    _.add(t), z.c.push(() => {
      _.delete(t), r && (n && t.d(1), r());
    }), t.o(e);
  } else
    r && r();
}
function nt(t) {
  t && t.c();
}
function F(t, e, n, r) {
  const { fragment: c, after_update: $ } = t.$$;
  c && c.m(e, n), r || b(() => {
    const f = t.$$.on_mount.map(x).filter(g);
    t.$$.on_destroy ? t.$$.on_destroy.push(...f) : d(f), t.$$.on_mount = [];
  }), $.forEach(b);
}
function G(t, e) {
  const n = t.$$;
  n.fragment !== null && (V(n.after_update), d(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function I(t, e) {
  t.$$.dirty[0] === -1 && (a.push(t), B(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function rt(t, e, n, r, c, $, f, N = [-1]) {
  const h = E;
  l(t);
  const s = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: $,
    update: p,
    not_equal: c,
    bound: j(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: j(),
    dirty: N,
    skip_bound: !1,
    root: e.target || h.$$.root
  };
  f && f(s.root);
  let w = !1;
  if (s.ctx = n ? n(t, e.props || {}, (o, k, ...v) => {
    const C = v.length ? v[0] : k;
    return s.ctx && c(s.ctx[o], s.ctx[o] = C) && (!s.skip_bound && s.bound[o] && s.bound[o](C), w && I(t, o)), k;
  }) : [], s.update(), w = !0, d(s.before_update), s.fragment = r ? r(s.ctx) : !1, e.target) {
    if (e.hydrate) {
      const o = H(e.target);
      s.fragment && s.fragment.l(o), o.forEach(M);
    } else
      s.fragment && s.fragment.c();
    e.intro && D(t.$$.fragment), F(t, e.target, e.anchor, e.customElement), L();
  }
  l(h);
}
let J;
typeof HTMLElement == "function" && (J = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(x).filter(g);
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
    G(this, 1), this.$destroy = p;
  }
  $on(t, e) {
    if (!g(e))
      return p;
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return n.push(e), () => {
      const r = n.indexOf(e);
      r !== -1 && n.splice(r, 1);
    };
  }
  $set(t) {
    this.$$set && !O(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
export {
  J as S,
  tt as a,
  R as b,
  Q as c,
  Z as d,
  U as e,
  M as f,
  W as g,
  nt as h,
  rt as i,
  Y as j,
  D as k,
  X as l,
  F as m,
  p as n,
  et as o,
  G as p,
  L as q,
  K as s,
  T as t
};
