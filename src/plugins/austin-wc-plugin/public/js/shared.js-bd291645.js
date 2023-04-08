function N() {
}
function Q(t) {
  return t();
}
function P() {
  return /* @__PURE__ */ Object.create(null);
}
function x(t) {
  t.forEach(Q);
}
function b(t) {
  return typeof t == "function";
}
function W(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let z;
function V(t, e) {
  return z || (z = document.createElement("a")), z.href = e, t === z.href;
}
function nt(t) {
  return Object.keys(t).length === 0;
}
function o(t, e) {
  t.appendChild(e);
}
function h(t, e, n) {
  t.insertBefore(e, n || null);
}
function T(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function a(t) {
  return document.createElement(t);
}
function E(t) {
  return document.createTextNode(t);
}
function I() {
  return E(" ");
}
function it(t, e, n, i) {
  return t.addEventListener(e, n, i), () => t.removeEventListener(e, n, i);
}
function l(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function rt(t) {
  return Array.from(t.childNodes);
}
function J(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function Z(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let G;
function w(t) {
  G = t;
}
const L = [], X = [];
let m = [];
const F = [], ut = /* @__PURE__ */ Promise.resolve();
let v = !1;
function ct() {
  v || (v = !0, ut.then(O));
}
function U(t) {
  m.push(t);
}
const S = /* @__PURE__ */ new Set();
let j = 0;
function O() {
  if (j !== 0)
    return;
  const t = G;
  do {
    try {
      for (; j < L.length; ) {
        const e = L[j];
        j++, w(e), st(e.$$);
      }
    } catch (e) {
      throw L.length = 0, j = 0, e;
    }
    for (w(null), L.length = 0, j = 0; X.length; )
      X.pop()();
    for (let e = 0; e < m.length; e += 1) {
      const n = m[e];
      S.has(n) || (S.add(n), n());
    }
    m.length = 0;
  } while (L.length);
  for (; F.length; )
    F.pop()();
  v = !1, S.clear(), w(t);
}
function st(t) {
  if (t.fragment !== null) {
    t.update(), x(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(U);
  }
}
function ot(t) {
  const e = [], n = [];
  m.forEach((i) => t.indexOf(i) === -1 ? e.push(i) : n.push(i)), n.forEach((i) => i()), m = e;
}
const $ = /* @__PURE__ */ new Set();
let lt;
function q(t, e) {
  t && t.i && ($.delete(t), t.i(e));
}
function Mt(t, e, n, i) {
  if (t && t.o) {
    if ($.has(t))
      return;
    $.add(t), lt.c.push(() => {
      $.delete(t), i && (n && t.d(1), i());
    }), t.o(e);
  } else
    i && i();
}
function at(t) {
  t && t.c();
}
function K(t, e, n, i) {
  const { fragment: u, after_update: M } = t.$$;
  u && u.m(e, n), i || U(() => {
    const r = t.$$.on_mount.map(Q).filter(b);
    t.$$.on_destroy ? t.$$.on_destroy.push(...r) : x(r), t.$$.on_mount = [];
  }), M.forEach(U);
}
function tt(t, e) {
  const n = t.$$;
  n.fragment !== null && (ot(n.after_update), x(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function gt(t, e) {
  t.$$.dirty[0] === -1 && (L.push(t), ct(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function R(t, e, n, i, u, M, r, s = [-1]) {
  const f = G;
  w(t);
  const c = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: M,
    update: N,
    not_equal: u,
    bound: P(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    // everything else
    callbacks: P(),
    dirty: s,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  r && r(c.root);
  let y = !1;
  if (c.ctx = n ? n(t, e.props || {}, (g, C, ...A) => {
    const d = A.length ? A[0] : C;
    return c.ctx && u(c.ctx[g], c.ctx[g] = d) && (!c.skip_bound && c.bound[g] && c.bound[g](d), y && gt(t, g)), C;
  }) : [], c.update(), y = !0, x(c.before_update), c.fragment = i ? i(c.ctx) : !1, e.target) {
    if (e.hydrate) {
      const g = rt(e.target);
      c.fragment && c.fragment.l(g), g.forEach(T);
    } else
      c.fragment && c.fragment.c();
    e.intro && q(t.$$.fragment), K(t, e.target, e.anchor, e.customElement), O();
  }
  w(f);
}
let k;
typeof HTMLElement == "function" && (k = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(Q).filter(b);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, n) {
    this[t] = n;
  }
  disconnectedCallback() {
    x(this.$$.on_disconnect);
  }
  $destroy() {
    tt(this, 1), this.$destroy = N;
  }
  $on(t, e) {
    if (!b(e))
      return N;
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return n.push(e), () => {
      const i = n.indexOf(e);
      i !== -1 && n.splice(i, 1);
    };
  }
  $set(t) {
    this.$$set && !nt(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
const ft = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1sb2dvcyIgd2lkdGg9IjI2LjYiIGhlaWdodD0iMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAyNTYgMzA4Ij48cGF0aCBmaWxsPSIjRkYzRTAwIiBkPSJNMjM5LjY4MiA0MC43MDdDMjExLjExMy0uMTgyIDE1NC42OS0xMi4zMDEgMTEzLjg5NSAxMy42OUw0Mi4yNDcgNTkuMzU2YTgyLjE5OCA4Mi4xOTggMCAwIDAtMzcuMTM1IDU1LjA1NmE4Ni41NjYgODYuNTY2IDAgMCAwIDguNTM2IDU1LjU3NmE4Mi40MjUgODIuNDI1IDAgMCAwLTEyLjI5NiAzMC43MTlhODcuNTk2IDg3LjU5NiAwIDAgMCAxNC45NjQgNjYuMjQ0YzI4LjU3NCA0MC44OTMgODQuOTk3IDUzLjAwNyAxMjUuNzg3IDI3LjAxNmw3MS42NDgtNDUuNjY0YTgyLjE4MiA4Mi4xODIgMCAwIDAgMzcuMTM1LTU1LjA1N2E4Ni42MDEgODYuNjAxIDAgMCAwLTguNTMtNTUuNTc3YTgyLjQwOSA4Mi40MDkgMCAwIDAgMTIuMjktMzAuNzE4YTg3LjU3MyA4Ny41NzMgMCAwIDAtMTQuOTYzLTY2LjI0NCI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMDYuODg5IDI3MC44NDFjLTIzLjEwMiA2LjAwNy00Ny40OTctMy4wMzYtNjEuMTAzLTIyLjY0OGE1Mi42ODUgNTIuNjg1IDAgMCAxLTkuMDAzLTM5Ljg1YTQ5Ljk3OCA0OS45NzggMCAwIDEgMS43MTMtNi42OTNsMS4zNS00LjExNWwzLjY3MSAyLjY5N2E5Mi40NDcgOTIuNDQ3IDAgMCAwIDI4LjAzNiAxNC4wMDdsMi42NjMuODA4bC0uMjQ1IDIuNjU5YTE2LjA2NyAxNi4wNjcgMCAwIDAgMi44OSAxMC42NTZhMTcuMTQzIDE3LjE0MyAwIDAgMCAxOC4zOTcgNi44MjhhMTUuNzg2IDE1Ljc4NiAwIDAgMCA0LjQwMy0xLjkzNWw3MS42Ny00NS42NzJhMTQuOTIyIDE0LjkyMiAwIDAgMCA2LjczNC05Ljk3N2ExNS45MjMgMTUuOTIzIDAgMCAwLTIuNzEzLTEyLjAxMWExNy4xNTYgMTcuMTU2IDAgMCAwLTE4LjQwNC02LjgzMmExNS43OCAxNS43OCAwIDAgMC00LjM5NiAxLjkzM2wtMjcuMzUgMTcuNDM0YTUyLjI5OCA1Mi4yOTggMCAwIDEtMTQuNTUzIDYuMzkxYy0yMy4xMDEgNi4wMDctNDcuNDk3LTMuMDM2LTYxLjEwMS0yMi42NDlhNTIuNjgxIDUyLjY4MSAwIDAgMS05LjAwNC0zOS44NDlhNDkuNDI4IDQ5LjQyOCAwIDAgMSAyMi4zNC0zMy4xMTRsNzEuNjY0LTQ1LjY3N2E1Mi4yMTggNTIuMjE4IDAgMCAxIDE0LjU2My02LjM5OGMyMy4xMDEtNi4wMDcgNDcuNDk3IDMuMDM2IDYxLjEwMSAyMi42NDhhNTIuNjg1IDUyLjY4NSAwIDAgMSA5LjAwNCAzOS44NWE1MC41NTkgNTAuNTU5IDAgMCAxLTEuNzEzIDYuNjkybC0xLjM1IDQuMTE2bC0zLjY3LTIuNjkzYTkyLjM3MyA5Mi4zNzMgMCAwIDAtMjguMDM3LTE0LjAxM2wtMi42NjQtLjgwOWwuMjQ2LTIuNjU4YTE2LjA5OSAxNi4wOTkgMCAwIDAtMi44OS0xMC42NTZhMTcuMTQzIDE3LjE0MyAwIDAgMC0xOC4zOTgtNi44MjhhMTUuNzg2IDE1Ljc4NiAwIDAgMC00LjQwMiAxLjkzNWwtNzEuNjcgNDUuNjc0YTE0Ljg5OCAxNC44OTggMCAwIDAtNi43MyA5Ljk3NWExNS45IDE1LjkgMCAwIDAgMi43MDkgMTIuMDEyYTE3LjE1NiAxNy4xNTYgMCAwIDAgMTguNDA0IDYuODMyYTE1Ljg0MSAxNS44NDEgMCAwIDAgNC40MDItMS45MzVsMjcuMzQ1LTE3LjQyN2E1Mi4xNDcgNTIuMTQ3IDAgMCAxIDE0LjU1Mi02LjM5N2MyMy4xMDEtNi4wMDYgNDcuNDk3IDMuMDM3IDYxLjEwMiAyMi42NWE1Mi42ODEgNTIuNjgxIDAgMCAxIDkuMDAzIDM5Ljg0OGE0OS40NTMgNDkuNDUzIDAgMCAxLTIyLjM0IDMzLjEybC03MS42NjQgNDUuNjczYTUyLjIxOCA1Mi4yMTggMCAwIDEtMTQuNTYzIDYuMzk4Ij48L3BhdGg+PC9zdmc+", Nt = "/vite.svg";
function dt(t) {
  let e, n, i, u, M;
  return {
    c() {
      e = a("button"), n = E("count is "), i = E(
        /*count*/
        t[0]
      ), this.c = N;
    },
    m(r, s) {
      h(r, e, s), o(e, n), o(e, i), u || (M = it(
        e,
        "click",
        /*increment*/
        t[1]
      ), u = !0);
    },
    p(r, [s]) {
      s & /*count*/
      1 && J(
        i,
        /*count*/
        r[0]
      );
    },
    i: N,
    o: N,
    d(r) {
      r && T(e), u = !1, M();
    }
  };
}
function ht(t, e, n) {
  let i = 0;
  return [i, () => {
    n(0, i += 1);
  }];
}
class At extends k {
  constructor(e) {
    super(), R(
      this,
      {
        target: this.shadowRoot,
        props: Z(this.attributes),
        customElement: !0
      },
      ht,
      dt,
      W,
      {},
      null
    ), e && e.target && h(e.target, this, e.anchor);
  }
}
function Dt(t) {
  let e, n, i, u, M, r, s, f, c, y, g, C, A, d, H, Y, B, _, p;
  return d = new At({}), {
    c() {
      e = a("main"), n = a("div"), i = a("a"), u = a("img"), r = I(), s = a("a"), f = a("img"), y = I(), g = a("h1"), g.textContent = "Vite + Svelte", C = I(), A = a("div"), at(d.$$.fragment), H = I(), Y = a("p"), Y.innerHTML = 'Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!', B = I(), _ = a("p"), _.textContent = "Click on the Vite and Svelte logos to learn more", this.c = N, V(u.src, M = Nt) || l(u, "src", M), l(u, "class", "logo"), l(u, "alt", "Vite Logo"), l(i, "href", "https://vitejs.dev"), l(i, "target", "_blank"), l(i, "rel", "noreferrer"), V(f.src, c = ft) || l(f, "src", c), l(f, "class", "logo svelte"), l(f, "alt", "Svelte Logo"), l(s, "href", "https://svelte.dev"), l(s, "target", "_blank"), l(s, "rel", "noreferrer"), l(A, "class", "card"), l(_, "class", "read-the-docs");
    },
    m(D, et) {
      h(D, e, et), o(e, n), o(n, i), o(i, u), o(n, r), o(n, s), o(s, f), o(e, y), o(e, g), o(e, C), o(e, A), K(d, A, null), o(e, H), o(e, Y), o(e, B), o(e, _), p = !0;
    },
    p: N,
    i(D) {
      p || (q(d.$$.fragment, D), p = !0);
    },
    o(D) {
      Mt(d.$$.fragment, D), p = !1;
    },
    d(D) {
      D && T(e), tt(d);
    }
  };
}
class Tt extends k {
  constructor(e) {
    super();
    const n = document.createElement("style");
    n.textContent = ".logo{height:6em;padding:1.5em;will-change:filter;transition:filter 300ms}.logo:hover{filter:drop-shadow(0 0 2em #646cffaa)}.logo.svelte:hover{filter:drop-shadow(0 0 2em #ff3e00aa)}.read-the-docs{color:#888}", this.shadowRoot.appendChild(n), R(
      this,
      {
        target: this.shadowRoot,
        props: Z(this.attributes),
        customElement: !0
      },
      null,
      Dt,
      W,
      {},
      null
    ), e && e.target && h(e.target, this, e.anchor);
  }
}
function jt(t) {
  let e, n, i, u, M;
  return {
    c() {
      e = a("h1"), e.textContent = "Svelte WC", n = I(), i = a("p"), u = E("Hello "), M = E(
        /*name*/
        t[0]
      ), this.c = N;
    },
    m(r, s) {
      h(r, e, s), h(r, n, s), h(r, i, s), o(i, u), o(i, M);
    },
    p(r, [s]) {
      s & /*name*/
      1 && J(
        M,
        /*name*/
        r[0]
      );
    },
    i: N,
    o: N,
    d(r) {
      r && T(e), r && T(n), r && T(i);
    }
  };
}
function It(t, e, n) {
  let { name: i = "User" } = e;
  return t.$$set = (u) => {
    "name" in u && n(0, i = u.name);
  }, [i];
}
class Lt extends k {
  constructor(e) {
    super();
    const n = document.createElement("style");
    n.textContent = "*{text-align:center}:host{background-color:aqua;display:block;padding:1rem}", this.shadowRoot.appendChild(n), R(
      this,
      {
        target: this.shadowRoot,
        props: Z(this.attributes),
        customElement: !0
      },
      It,
      jt,
      W,
      { name: 0 },
      null
    ), e && (e.target && h(e.target, this, e.anchor), e.props && (this.$set(e.props), O()));
  }
  static get observedAttributes() {
    return ["name"];
  }
  get name() {
    return this.$$.ctx[0];
  }
  set name(e) {
    this.$$set({ name: e }), O();
  }
}
customElements.define("svelte-wcs", Lt);
export {
  Tt as A,
  Lt as W
};
