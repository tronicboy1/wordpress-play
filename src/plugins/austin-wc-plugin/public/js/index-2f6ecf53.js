function p() {
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
function m(t) {
  return typeof t == "function";
}
function Q(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function N(t) {
  return Object.keys(t).length === 0;
}
function O(t, ...e) {
  if (t == null)
    return p;
  const n = t.subscribe(...e);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function R(t, e, n) {
  t.$$.on_destroy.push(O(e, n));
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
function X(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function Y(t) {
  return document.createElement(t);
}
function T(t) {
  return document.createTextNode(t);
}
function Z() {
  return T(" ");
}
function tt(t, e, n, o) {
  return t.addEventListener(e, n, o), () => t.removeEventListener(e, n, o);
}
function et(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function nt(t) {
  return t === "" ? null : +t;
}
function q(t) {
  return Array.from(t.childNodes);
}
function ot(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function rt(t, e) {
  t.value = e ?? "";
}
function st(t, e, n) {
  for (let o = 0; o < t.options.length; o += 1) {
    const s = t.options[o];
    if (s.__value === e) {
      s.selected = !0;
      return;
    }
  }
  (!n || e !== void 0) && (t.selectedIndex = -1);
}
function ct(t) {
  const e = t.querySelector(":checked");
  return e && e.__value;
}
function ut(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let d;
function f(t) {
  d = t;
}
function H() {
  if (!d)
    throw new Error("Function called outside component initialization");
  return d;
}
function it(t) {
  H().$$.on_destroy.push(t);
}
function at(t, e) {
  const n = t.$$.callbacks[e.type];
  n && n.slice().forEach((o) => o.call(this, e));
}
const i = [], j = [];
let a = [];
const S = [], z = /* @__PURE__ */ Promise.resolve();
let g = !1;
function B() {
  g || (g = !0, z.then(A));
}
function y(t) {
  a.push(t);
}
const $ = /* @__PURE__ */ new Set();
let u = 0;
function A() {
  if (u !== 0)
    return;
  const t = d;
  do {
    try {
      for (; u < i.length; ) {
        const e = i[u];
        u++, f(e), D(e.$$);
      }
    } catch (e) {
      throw i.length = 0, u = 0, e;
    }
    for (f(null), i.length = 0, u = 0; j.length; )
      j.pop()();
    for (let e = 0; e < a.length; e += 1) {
      const n = a[e];
      $.has(n) || ($.add(n), n());
    }
    a.length = 0;
  } while (i.length);
  for (; S.length; )
    S.pop()();
  g = !1, $.clear(), f(t);
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
  a.forEach((o) => t.indexOf(o) === -1 ? e.push(o) : n.push(o)), n.forEach((o) => o()), a = e;
}
const I = /* @__PURE__ */ new Set();
function P(t, e) {
  t && t.i && (I.delete(t), t.i(e));
}
function V(t, e, n, o) {
  const { fragment: s, after_update: b } = t.$$;
  s && s.m(e, n), o || y(() => {
    const l = t.$$.on_mount.map(k).filter(m);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : h(l), t.$$.on_mount = [];
  }), b.forEach(y);
}
function G(t, e) {
  const n = t.$$;
  n.fragment !== null && (F(n.after_update), h(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function J(t, e) {
  t.$$.dirty[0] === -1 && (i.push(t), B(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function lt(t, e, n, o, s, b, l, L = [-1]) {
  const _ = d;
  f(t);
  const r = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: b,
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
    dirty: L,
    skip_bound: !1,
    root: e.target || _.$$.root
  };
  l && l(r.root);
  let x = !1;
  if (r.ctx = n ? n(t, e.props || {}, (c, E, ...w) => {
    const v = w.length ? w[0] : E;
    return r.ctx && s(r.ctx[c], r.ctx[c] = v) && (!r.skip_bound && r.bound[c] && r.bound[c](v), x && J(t, c)), E;
  }) : [], r.update(), x = !0, h(r.before_update), r.fragment = o ? o(r.ctx) : !1, e.target) {
    if (e.hydrate) {
      const c = q(e.target);
      r.fragment && r.fragment.l(c), c.forEach(M);
    } else
      r.fragment && r.fragment.c();
    e.intro && P(t.$$.fragment), V(t, e.target, e.anchor, e.customElement), A();
  }
  f(_);
}
let K;
typeof HTMLElement == "function" && (K = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(k).filter(m);
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
    if (!m(e))
      return p;
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return n.push(e), () => {
      const o = n.indexOf(e);
      o !== -1 && n.splice(o, 1);
    };
  }
  $set(t) {
    this.$$set && !N(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
export {
  K as S,
  ut as a,
  W as b,
  Z as c,
  U as d,
  Y as e,
  A as f,
  ot as g,
  M as h,
  lt as i,
  et as j,
  rt as k,
  tt as l,
  nt as m,
  p as n,
  R as o,
  it as p,
  X as q,
  h as r,
  Q as s,
  T as t,
  at as u,
  y as v,
  st as w,
  ct as x
};
