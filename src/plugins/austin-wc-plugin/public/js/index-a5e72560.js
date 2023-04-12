function $() {
}
function k(t) {
  return t();
}
function C() {
  return /* @__PURE__ */ Object.create(null);
}
function h(t) {
  t.forEach(k);
}
function b(t) {
  return typeof t == "function";
}
function Q(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function O(t) {
  return Object.keys(t).length === 0;
}
function M(t, ...e) {
  if (t == null)
    return $;
  const n = t.subscribe(...e);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function R(t, e, n) {
  t.$$.on_destroy.push(M(e, n));
}
function U(t, e) {
  t.appendChild(e);
}
function W(t, e, n) {
  t.insertBefore(e, n || null);
}
function T(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function X(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function Y(t) {
  return document.createElement(t);
}
function A(t) {
  return document.createTextNode(t);
}
function Z() {
  return A(" ");
}
function tt() {
  return A("");
}
function et(t, e, n, r) {
  return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
}
function nt(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function rt(t) {
  return t === "" ? null : +t;
}
function H(t) {
  return Array.from(t.childNodes);
}
function ot(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function st(t, e) {
  t.value = e ?? "";
}
function ct(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let d;
function l(t) {
  d = t;
}
function q() {
  if (!d)
    throw new Error("Function called outside component initialization");
  return d;
}
function ut(t) {
  q().$$.on_destroy.push(t);
}
const u = [], j = [];
let i = [];
const S = [], z = /* @__PURE__ */ Promise.resolve();
let g = !1;
function B() {
  g || (g = !0, z.then(L));
}
function y(t) {
  i.push(t);
}
const p = /* @__PURE__ */ new Set();
let c = 0;
function L() {
  if (c !== 0)
    return;
  const t = d;
  do {
    try {
      for (; c < u.length; ) {
        const e = u[c];
        c++, l(e), D(e.$$);
      }
    } catch (e) {
      throw u.length = 0, c = 0, e;
    }
    for (l(null), u.length = 0, c = 0; j.length; )
      j.pop()();
    for (let e = 0; e < i.length; e += 1) {
      const n = i[e];
      p.has(n) || (p.add(n), n());
    }
    i.length = 0;
  } while (u.length);
  for (; S.length; )
    S.pop()();
  g = !1, p.clear(), l(t);
}
function D(t) {
  if (t.fragment !== null) {
    t.update(), h(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(y);
  }
}
function F(t) {
  const e = [], n = [];
  i.forEach((r) => t.indexOf(r) === -1 ? e.push(r) : n.push(r)), n.forEach((r) => r()), i = e;
}
const P = /* @__PURE__ */ new Set();
function V(t, e) {
  t && t.i && (P.delete(t), t.i(e));
}
function G(t, e, n, r) {
  const { fragment: a, after_update: m } = t.$$;
  a && a.m(e, n), r || y(() => {
    const f = t.$$.on_mount.map(k).filter(b);
    t.$$.on_destroy ? t.$$.on_destroy.push(...f) : h(f), t.$$.on_mount = [];
  }), m.forEach(y);
}
function I(t, e) {
  const n = t.$$;
  n.fragment !== null && (F(n.after_update), h(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function J(t, e) {
  t.$$.dirty[0] === -1 && (u.push(t), B(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function it(t, e, n, r, a, m, f, N = [-1]) {
  const _ = d;
  l(t);
  const o = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: m,
    update: $,
    not_equal: a,
    bound: C(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (_ ? _.$$.context : [])),
    // everything else
    callbacks: C(),
    dirty: N,
    skip_bound: !1,
    root: e.target || _.$$.root
  };
  f && f(o.root);
  let x = !1;
  if (o.ctx = n ? n(t, e.props || {}, (s, E, ...w) => {
    const v = w.length ? w[0] : E;
    return o.ctx && a(o.ctx[s], o.ctx[s] = v) && (!o.skip_bound && o.bound[s] && o.bound[s](v), x && J(t, s)), E;
  }) : [], o.update(), x = !0, h(o.before_update), o.fragment = r ? r(o.ctx) : !1, e.target) {
    if (e.hydrate) {
      const s = H(e.target);
      o.fragment && o.fragment.l(s), s.forEach(T);
    } else
      o.fragment && o.fragment.c();
    e.intro && V(t.$$.fragment), G(t, e.target, e.anchor, e.customElement), L();
  }
  l(_);
}
let K;
typeof HTMLElement == "function" && (K = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(k).filter(b);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, n) {
    this[t] = n;
  }
  disconnectedCallback() {
    h(this.$$.on_disconnect);
  }
  $destroy() {
    I(this, 1), this.$destroy = $;
  }
  $on(t, e) {
    if (!b(e))
      return $;
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
  K as S,
  ct as a,
  W as b,
  Z as c,
  U as d,
  Y as e,
  L as f,
  ot as g,
  T as h,
  it as i,
  tt as j,
  nt as k,
  st as l,
  et as m,
  $ as n,
  rt as o,
  R as p,
  ut as q,
  X as r,
  Q as s,
  A as t
};
