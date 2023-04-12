function p() {
}
function x(t) {
  return t();
}
function C() {
  return /* @__PURE__ */ Object.create(null);
}
function h(t) {
  t.forEach(x);
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
    return p;
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
function q(t) {
  return Array.from(t.childNodes);
}
function ot(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function st(t, e) {
  t.value = e ?? "";
}
function ct(t, e, n) {
  for (let r = 0; r < t.options.length; r += 1) {
    const s = t.options[r];
    if (s.__value === e) {
      s.selected = !0;
      return;
    }
  }
  (!n || e !== void 0) && (t.selectedIndex = -1);
}
function ut(t) {
  const e = t.querySelector(":checked");
  return e && e.__value;
}
function it(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let d;
function l(t) {
  d = t;
}
function H() {
  if (!d)
    throw new Error("Function called outside component initialization");
  return d;
}
function at(t) {
  H().$$.on_destroy.push(t);
}
const i = [], j = [];
let a = [];
const S = [], z = /* @__PURE__ */ Promise.resolve();
let g = !1;
function B() {
  g || (g = !0, z.then(L));
}
function y(t) {
  a.push(t);
}
const m = /* @__PURE__ */ new Set();
let u = 0;
function L() {
  if (u !== 0)
    return;
  const t = d;
  do {
    try {
      for (; u < i.length; ) {
        const e = i[u];
        u++, l(e), D(e.$$);
      }
    } catch (e) {
      throw i.length = 0, u = 0, e;
    }
    for (l(null), i.length = 0, u = 0; j.length; )
      j.pop()();
    for (let e = 0; e < a.length; e += 1) {
      const n = a[e];
      m.has(n) || (m.add(n), n());
    }
    a.length = 0;
  } while (i.length);
  for (; S.length; )
    S.pop()();
  g = !1, m.clear(), l(t);
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
  a.forEach((r) => t.indexOf(r) === -1 ? e.push(r) : n.push(r)), n.forEach((r) => r()), a = e;
}
const I = /* @__PURE__ */ new Set();
function P(t, e) {
  t && t.i && (I.delete(t), t.i(e));
}
function V(t, e, n, r) {
  const { fragment: s, after_update: $ } = t.$$;
  s && s.m(e, n), r || y(() => {
    const f = t.$$.on_mount.map(x).filter(b);
    t.$$.on_destroy ? t.$$.on_destroy.push(...f) : h(f), t.$$.on_mount = [];
  }), $.forEach(y);
}
function G(t, e) {
  const n = t.$$;
  n.fragment !== null && (F(n.after_update), h(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function J(t, e) {
  t.$$.dirty[0] === -1 && (i.push(t), B(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function ft(t, e, n, r, s, $, f, N = [-1]) {
  const _ = d;
  l(t);
  const o = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: $,
    update: p,
    not_equal: s,
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
  let k = !1;
  if (o.ctx = n ? n(t, e.props || {}, (c, E, ...w) => {
    const v = w.length ? w[0] : E;
    return o.ctx && s(o.ctx[c], o.ctx[c] = v) && (!o.skip_bound && o.bound[c] && o.bound[c](v), k && J(t, c)), E;
  }) : [], o.update(), k = !0, h(o.before_update), o.fragment = r ? r(o.ctx) : !1, e.target) {
    if (e.hydrate) {
      const c = q(e.target);
      o.fragment && o.fragment.l(c), c.forEach(T);
    } else
      o.fragment && o.fragment.c();
    e.intro && P(t.$$.fragment), V(t, e.target, e.anchor, e.customElement), L();
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
    this.$$.on_disconnect = t.map(x).filter(b);
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
    G(this, 1), this.$destroy = p;
  }
  $on(t, e) {
    if (!b(e))
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
  K as S,
  it as a,
  W as b,
  Z as c,
  U as d,
  Y as e,
  L as f,
  ot as g,
  T as h,
  ft as i,
  tt as j,
  nt as k,
  st as l,
  et as m,
  p as n,
  rt as o,
  R as p,
  at as q,
  X as r,
  Q as s,
  A as t,
  y as u,
  ct as v,
  h as w,
  ut as x
};
