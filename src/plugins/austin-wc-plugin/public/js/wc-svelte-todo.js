import { S as he, i as pe, a as ve, b as S, s as me, e as y, c as I, n as $, j, k as P, d as b, l as E, m as ee, h as g, r as X, o as M, p as ye, q as be, t as D, g as N, u as we } from "./index-2f6ecf53.js";
import { i as C, _ as G, S as _e, a as ke, b as z, c as Y, d as Se, o as te, e as ge, f as ne, g as V, O as R, r as Ie, h as xe, j as Ae, k as Te, n as Le, l as je, m as Ee } from "./index-773a725d.js";
function Ce(e) {
  return C(e == null ? void 0 : e.lift);
}
function W(e) {
  return function(n) {
    if (Ce(n))
      return n.lift(function(t) {
        try {
          return e(t, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function U(e, n, t, r, o) {
  return new Oe(e, n, t, r, o);
}
var Oe = function(e) {
  G(n, e);
  function n(t, r, o, l, i, h) {
    var f = e.call(this, t) || this;
    return f.onFinalize = i, f.shouldUnsubscribe = h, f._next = r ? function(d) {
      try {
        r(d);
      } catch (c) {
        t.error(c);
      }
    } : e.prototype._next, f._error = l ? function(d) {
      try {
        l(d);
      } catch (c) {
        t.error(c);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, f._complete = o ? function() {
      try {
        o();
      } catch (d) {
        t.error(d);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, f;
  }
  return n.prototype.unsubscribe = function() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var r = this.closed;
      e.prototype.unsubscribe.call(this), !r && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }, n;
}(_e), re = {
  now: function() {
    return (re.delegate || Date).now();
  },
  delegate: void 0
}, Re = function(e) {
  G(n, e);
  function n(t, r) {
    return e.call(this) || this;
  }
  return n.prototype.schedule = function(t, r) {
    return this;
  }, n;
}(ke), B = {
  setInterval: function(e, n) {
    for (var t = [], r = 2; r < arguments.length; r++)
      t[r - 2] = arguments[r];
    var o = B.delegate;
    return o != null && o.setInterval ? o.setInterval.apply(o, z([e, n], Y(t))) : setInterval.apply(void 0, z([e, n], Y(t)));
  },
  clearInterval: function(e) {
    var n = B.delegate;
    return ((n == null ? void 0 : n.clearInterval) || clearInterval)(e);
  },
  delegate: void 0
}, De = function(e) {
  G(n, e);
  function n(t, r) {
    var o = e.call(this, t, r) || this;
    return o.scheduler = t, o.work = r, o.pending = !1, o;
  }
  return n.prototype.schedule = function(t, r) {
    var o;
    if (r === void 0 && (r = 0), this.closed)
      return this;
    this.state = t;
    var l = this.id, i = this.scheduler;
    return l != null && (this.id = this.recycleAsyncId(i, l, r)), this.pending = !0, this.delay = r, this.id = (o = this.id) !== null && o !== void 0 ? o : this.requestAsyncId(i, this.id, r), this;
  }, n.prototype.requestAsyncId = function(t, r, o) {
    return o === void 0 && (o = 0), B.setInterval(t.flush.bind(t, this), o);
  }, n.prototype.recycleAsyncId = function(t, r, o) {
    if (o === void 0 && (o = 0), o != null && this.delay === o && this.pending === !1)
      return r;
    r != null && B.clearInterval(r);
  }, n.prototype.execute = function(t, r) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var o = this._execute(t, r);
    if (o)
      return o;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, n.prototype._execute = function(t, r) {
    var o = !1, l;
    try {
      this.work(t);
    } catch (i) {
      o = !0, l = i || new Error("Scheduled action threw falsy error");
    }
    if (o)
      return this.unsubscribe(), l;
  }, n.prototype.unsubscribe = function() {
    if (!this.closed) {
      var t = this, r = t.id, o = t.scheduler, l = o.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, Se(l, this), r != null && (this.id = this.recycleAsyncId(o, r, null)), this.delay = null, e.prototype.unsubscribe.call(this);
    }
  }, n;
}(Re), H = function() {
  function e(n, t) {
    t === void 0 && (t = e.now), this.schedulerActionCtor = n, this.now = t;
  }
  return e.prototype.schedule = function(n, t, r) {
    return t === void 0 && (t = 0), new this.schedulerActionCtor(this, n).schedule(r, t);
  }, e.now = re.now, e;
}(), Ue = function(e) {
  G(n, e);
  function n(t, r) {
    r === void 0 && (r = H.now);
    var o = e.call(this, t, r) || this;
    return o.actions = [], o._active = !1, o;
  }
  return n.prototype.flush = function(t) {
    var r = this.actions;
    if (this._active) {
      r.push(t);
      return;
    }
    var o;
    this._active = !0;
    do
      if (o = t.execute(t.state, t.delay))
        break;
    while (t = r.shift());
    if (this._active = !1, o) {
      for (; t = r.shift(); )
        t.unsubscribe();
      throw o;
    }
  }, n;
}(H), Fe = new Ue(De), Pe = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function qe(e) {
  return C(e == null ? void 0 : e.then);
}
function Ne(e) {
  return C(e[te]);
}
function Be(e) {
  return Symbol.asyncIterator && C(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function Ge(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function We() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var $e = We();
function Me(e) {
  return C(e == null ? void 0 : e[$e]);
}
function Ve(e) {
  return ge(this, arguments, function() {
    var t, r, o, l;
    return ne(this, function(i) {
      switch (i.label) {
        case 0:
          t = e.getReader(), i.label = 1;
        case 1:
          i.trys.push([1, , 9, 10]), i.label = 2;
        case 2:
          return [4, V(t.read())];
        case 3:
          return r = i.sent(), o = r.value, l = r.done, l ? [4, V(void 0)] : [3, 5];
        case 4:
          return [2, i.sent()];
        case 5:
          return [4, V(o)];
        case 6:
          return [4, i.sent()];
        case 7:
          return i.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return t.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function Xe(e) {
  return C(e == null ? void 0 : e.getReader);
}
function ze(e) {
  if (e instanceof R)
    return e;
  if (e != null) {
    if (Ne(e))
      return Ye(e);
    if (Pe(e))
      return He(e);
    if (qe(e))
      return Ke(e);
    if (Be(e))
      return oe(e);
    if (Me(e))
      return Ze(e);
    if (Xe(e))
      return Je(e);
  }
  throw Ge(e);
}
function Ye(e) {
  return new R(function(n) {
    var t = e[te]();
    if (C(t.subscribe))
      return t.subscribe(n);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function He(e) {
  return new R(function(n) {
    for (var t = 0; t < e.length && !n.closed; t++)
      n.next(e[t]);
    n.complete();
  });
}
function Ke(e) {
  return new R(function(n) {
    e.then(function(t) {
      n.closed || (n.next(t), n.complete());
    }, function(t) {
      return n.error(t);
    }).then(null, Ie);
  });
}
function Ze(e) {
  return new R(function(n) {
    var t, r;
    try {
      for (var o = xe(e), l = o.next(); !l.done; l = o.next()) {
        var i = l.value;
        if (n.next(i), n.closed)
          return;
      }
    } catch (h) {
      t = { error: h };
    } finally {
      try {
        l && !l.done && (r = o.return) && r.call(o);
      } finally {
        if (t)
          throw t.error;
      }
    }
    n.complete();
  });
}
function oe(e) {
  return new R(function(n) {
    Qe(e, n).catch(function(t) {
      return n.error(t);
    });
  });
}
function Je(e) {
  return oe(Ve(e));
}
function Qe(e, n) {
  var t, r, o, l;
  return Ae(this, void 0, void 0, function() {
    var i, h;
    return ne(this, function(f) {
      switch (f.label) {
        case 0:
          f.trys.push([0, 5, 6, 11]), t = Te(e), f.label = 1;
        case 1:
          return [4, t.next()];
        case 2:
          if (r = f.sent(), !!r.done)
            return [3, 4];
          if (i = r.value, n.next(i), n.closed)
            return [2];
          f.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return h = f.sent(), o = { error: h }, [3, 11];
        case 6:
          return f.trys.push([6, , 9, 10]), r && !r.done && (l = t.return) ? [4, l.call(t)] : [3, 8];
        case 7:
          f.sent(), f.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (o)
            throw o.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return n.complete(), [2];
      }
    });
  });
}
function et(e, n) {
  return W(function(t, r) {
    var o = 0;
    t.subscribe(U(r, function(l) {
      r.next(e.call(n, l, o++));
    }));
  });
}
function tt(e, n) {
  return W(function(t, r) {
    var o = 0;
    t.subscribe(U(r, function(l) {
      return e.call(n, l, o++) && r.next(l);
    }));
  });
}
function nt(e) {
  return W(function(n, t) {
    var r = [];
    return n.subscribe(U(t, function(o) {
      return r.push(o);
    }, function() {
      t.next(r), t.complete();
    })), ze(e).subscribe(U(t, function() {
      var o = r;
      r = [], t.next(o);
    }, Le)), function() {
      r = null;
    };
  });
}
function rt(e, n) {
  return n === void 0 && (n = Fe), W(function(t, r) {
    var o = null, l = null, i = null, h = function() {
      if (o) {
        o.unsubscribe(), o = null;
        var d = l;
        l = null, r.next(d);
      }
    };
    function f() {
      var d = i + e, c = n.now();
      if (c < d) {
        o = this.schedule(void 0, d - c), r.add(o);
        return;
      }
      h();
    }
    t.subscribe(U(r, function(d) {
      l = d, i = n.now(), o || (o = n.schedule(f, e), r.add(o));
    }, function() {
      h(), r.complete();
    }, void 0, function() {
      l = o = null;
    }));
  });
}
function ot(e = 250) {
  return (n) => n.pipe(nt(n.pipe(rt(e))), tt((t) => t.length > 1), et(([t]) => t));
}
function K(e, n, t) {
  const r = e.slice();
  return r[28] = n[t], r;
}
function Z(e) {
  let n, t, r, o, l, i, h, f, d = (
    /*$todos$*/
    e[1]
  ), c = [];
  for (let s = 0; s < d.length; s += 1)
    c[s] = J(K(e, d, s));
  return {
    c() {
      n = y("ul");
      for (let s = 0; s < c.length; s += 1)
        c[s].c();
      t = I(), r = y("nav"), o = y("button"), o.textContent = "Back", l = I(), i = y("button"), i.textContent = "Next";
    },
    m(s, m) {
      S(s, n, m);
      for (let p = 0; p < c.length; p += 1)
        c[p] && c[p].m(n, null);
      S(s, t, m), S(s, r, m), b(r, o), b(r, l), b(r, i), h || (f = [
        E(
          o,
          "click",
          /*click_handler_1*/
          e[12]
        ),
        E(
          i,
          "click",
          /*click_handler_2*/
          e[13]
        )
      ], h = !0);
    },
    p(s, m) {
      if (m & /*handleTodoClick, $todos$*/
      258) {
        d = /*$todos$*/
        s[1];
        let p;
        for (p = 0; p < d.length; p += 1) {
          const w = K(s, d, p);
          c[p] ? c[p].p(w, m) : (c[p] = J(w), c[p].c(), c[p].m(n, null));
        }
        for (; p < c.length; p += 1)
          c[p].d(1);
        c.length = d.length;
      }
    },
    d(s) {
      s && g(n), be(c, s), s && g(t), s && g(r), h = !1, X(f);
    }
  };
}
function J(e) {
  let n, t, r = (
    /*todo*/
    e[28].id + ""
  ), o, l, i = (
    /*todo*/
    e[28].text + ""
  ), h, f, d;
  function c() {
    return (
      /*click_handler*/
      e[11](
        /*todo*/
        e[28]
      )
    );
  }
  return {
    c() {
      n = y("li"), t = y("small"), o = D(r), l = y("br"), h = D(i);
    },
    m(s, m) {
      S(s, n, m), b(n, t), b(t, o), b(n, l), b(n, h), f || (d = [
        E(n, "click", c),
        E(
          n,
          "keydown",
          /*keydown_handler*/
          e[10]
        )
      ], f = !0);
    },
    p(s, m) {
      e = s, m & /*$todos$*/
      2 && r !== (r = /*todo*/
      e[28].id + "") && N(o, r), m & /*$todos$*/
      2 && i !== (i = /*todo*/
      e[28].text + "") && N(h, i);
    },
    d(s) {
      s && g(n), f = !1, X(d);
    }
  };
}
function Q(e) {
  let n, t, r = (
    /*$todo$*/
    e[3].text + ""
  ), o, l, i, h, f = new Date(
    /*$todo$*/
    e[3].created_at
  ).toLocaleString() + "", d;
  return {
    c() {
      n = y("article"), t = y("h1"), o = D(r), l = I(), i = y("p"), h = D("Date: "), d = D(f);
    },
    m(c, s) {
      S(c, n, s), b(n, t), b(t, o), b(n, l), b(n, i), b(i, h), b(i, d);
    },
    p(c, s) {
      s & /*$todo$*/
      8 && r !== (r = /*$todo$*/
      c[3].text + "") && N(o, r), s & /*$todo$*/
      8 && f !== (f = new Date(
        /*$todo$*/
        c[3].created_at
      ).toLocaleString() + "") && N(d, f);
    },
    d(c) {
      c && g(n);
    }
  };
}
function it(e) {
  let n, t, r, o, l, i, h, f, d, c, s, m, p, w, T, x, L, A, _ = (
    /*$todos$*/
    e[1] && Z(e)
  ), k = (
    /*$todo$*/
    e[3] && Q(e)
  );
  return {
    c() {
      n = y("h1"), n.textContent = "All Todos", t = I(), _ && _.c(), r = I(), o = y("h1"), o.textContent = "Todo Lookup", l = I(), i = y("input"), h = I(), k && k.c(), f = I(), d = y("h1"), d.textContent = "New Todo", c = I(), s = y("form"), m = y("label"), m.textContent = "Text", p = I(), w = y("input"), T = I(), x = y("button"), x.textContent = "Add", this.c = $, j(i, "type", "number"), j(m, "for", "text"), j(w, "type", "text"), j(w, "name", "text"), j(w, "id", "text"), j(w, "maxlength", "255"), w.required = !0, j(x, "type", "submit");
    },
    m(u, v) {
      S(u, n, v), S(u, t, v), _ && _.m(u, v), S(u, r, v), S(u, o, v), S(u, l, v), S(u, i, v), P(
        i,
        /*$input$*/
        e[2]
      ), S(u, h, v), k && k.m(u, v), S(u, f, v), S(u, d, v), S(u, c, v), S(u, s, v), b(s, m), b(s, p), b(s, w), P(
        w,
        /*textInput*/
        e[0]
      ), b(s, T), b(s, x), L || (A = [
        E(
          i,
          "input",
          /*input0_input_handler*/
          e[14]
        ),
        E(
          w,
          "input",
          /*input1_input_handler*/
          e[15]
        ),
        E(
          s,
          "submit",
          /*handleSubmit*/
          e[9]
        )
      ], L = !0);
    },
    p(u, [v]) {
      /*$todos$*/
      u[1] ? _ ? _.p(u, v) : (_ = Z(u), _.c(), _.m(r.parentNode, r)) : _ && (_.d(1), _ = null), v & /*$input$*/
      4 && ee(i.value) !== /*$input$*/
      u[2] && P(
        i,
        /*$input$*/
        u[2]
      ), /*$todo$*/
      u[3] ? k ? k.p(u, v) : (k = Q(u), k.c(), k.m(f.parentNode, f)) : k && (k.d(1), k = null), v & /*textInput*/
      1 && w.value !== /*textInput*/
      u[0] && P(
        w,
        /*textInput*/
        u[0]
      );
    },
    i: $,
    o: $,
    d(u) {
      u && g(n), u && g(t), _ && _.d(u), u && g(r), u && g(o), u && g(l), u && g(i), u && g(h), k && k.d(u), u && g(f), u && g(d), u && g(c), u && g(s), L = !1, X(A);
    }
  };
}
function q(e) {
  return new URL(e, document.location.origin);
}
function lt(e, n, t) {
  let r, o, l;
  const { filter: i, mergeMap: h, sampleTime: f, Subject: d, switchMap: c, takeUntil: s, tap: m, startWith: p, map: w } = rxjs, T = new je();
  M(e, T, (a) => t(2, o = a));
  const x = new d();
  ye(() => {
    x.next();
  });
  const L = new d(), A = new Ee(1), _ = L.pipe(
    p(void 0),
    c(() => A),
    m((a) => console.log(a)),
    c((a) => {
      const O = q("/wp-json/todo/v1/todos");
      return O.searchParams.set("page", String(a)), fetch(O);
    }),
    i((a) => a.ok),
    h((a) => a.json())
  );
  M(e, _, (a) => t(1, r = a));
  const k = T.pipe(s(x), i(Boolean), f(500), c((a) => fetch(q(`/wp-json/todo/v1/todos/${a}`))), i((a) => a.ok), h((a) => a.json()), m((a) => console.log(a)));
  M(e, k, (a) => t(3, l = a));
  const u = new d();
  u.pipe(s(x), ot(500), h((a) => fetch(q(`/wp-json/todo/v1/todos/${a}`), { method: "DELETE" }))).subscribe((a) => {
    console.log("dbl click", a), L.next();
  });
  function v(a) {
    T.next(a), u.next(a);
  }
  let F = "";
  L.pipe(
    c(() => fetch("https://api.api-ninjas.com/v1/loremipsum", {
      headers: {
        "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1"
      }
    })),
    i((a) => a.ok),
    h((a) => a.json()),
    w(({ text: a }) => a),
    w((a) => a.slice(0, 255)),
    s(x)
  ).subscribe((a) => t(0, F = a));
  function ie(a) {
    a.preventDefault();
    const O = a.target;
    if (!(O instanceof HTMLFormElement))
      throw TypeError("NotForm");
    const de = new FormData(O);
    fetch(q("/wp-json/todo/v1/todos"), { body: de, method: "POST" }).then(() => {
      L.next(), O.reset();
    });
  }
  function le(a) {
    we.call(this, e, a);
  }
  const se = (a) => v(a.id), ae = () => A.next(A.value - 1), ue = () => A.next(A.value + 1);
  function ce() {
    o = ee(this.value), T.set(o);
  }
  function fe() {
    F = this.value, t(0, F);
  }
  return [
    F,
    r,
    o,
    l,
    T,
    A,
    _,
    k,
    v,
    ie,
    le,
    se,
    ae,
    ue,
    ce,
    fe
  ];
}
class st extends he {
  constructor(n) {
    super();
    const t = document.createElement("style");
    t.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}ul{list-style-type:none;margin:0;padding:0}li{background-color:white;border:1px solid white;border-radius:4px;margin:1rem 0;padding:0.5rem 1rem;user-select:none}li:first-child{margin-top:0}li:last-child{margin-bottom:0}", this.shadowRoot.appendChild(t), pe(
      this,
      {
        target: this.shadowRoot,
        props: ve(this.attributes),
        customElement: !0
      },
      lt,
      it,
      me,
      {},
      null
    ), n && n.target && S(n.target, this, n.anchor);
  }
}
customElements.define("wc-svelte-todo", st);
export {
  st as default
};
