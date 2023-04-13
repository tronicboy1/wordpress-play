import { i as c, _ as d, b as k, c as _, d as p, e as b, f as O, o as w, g as L, h as I, j as y, O as l, r as T, k as E, l as P, m as R } from "./BehaviorSubject-8702209b.js";
function U(e) {
  return c(e == null ? void 0 : e.lift);
}
function g(e) {
  return function(n) {
    if (U(n))
      return n.lift(function(r) {
        try {
          return e(r, this);
        } catch (t) {
          this.error(t);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function A(e, n, r, t, i) {
  return new F(e, n, r, t, i);
}
var F = function(e) {
  d(n, e);
  function n(r, t, i, a, o, u) {
    var s = e.call(this, r) || this;
    return s.onFinalize = o, s.shouldUnsubscribe = u, s._next = t ? function(f) {
      try {
        t(f);
      } catch (v) {
        r.error(v);
      }
    } : e.prototype._next, s._error = a ? function(f) {
      try {
        a(f);
      } catch (v) {
        r.error(v);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, s._complete = i ? function() {
      try {
        i();
      } catch (f) {
        r.error(f);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, s;
  }
  return n.prototype.unsubscribe = function() {
    var r;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var t = this.closed;
      e.prototype.unsubscribe.call(this), !t && ((r = this.onFinalize) === null || r === void 0 || r.call(this));
    }
  }, n;
}(k), S = {
  now: function() {
    return (S.delegate || Date).now();
  },
  delegate: void 0
}, G = function(e) {
  d(n, e);
  function n(r, t) {
    return e.call(this) || this;
  }
  return n.prototype.schedule = function(r, t) {
    return this;
  }, n;
}(_), h = {
  setInterval: function(e, n) {
    for (var r = [], t = 2; t < arguments.length; t++)
      r[t - 2] = arguments[t];
    var i = h.delegate;
    return i != null && i.setInterval ? i.setInterval.apply(i, p([e, n], b(r))) : setInterval.apply(void 0, p([e, n], b(r)));
  },
  clearInterval: function(e) {
    var n = h.delegate;
    return ((n == null ? void 0 : n.clearInterval) || clearInterval)(e);
  },
  delegate: void 0
}, q = function(e) {
  d(n, e);
  function n(r, t) {
    var i = e.call(this, r, t) || this;
    return i.scheduler = r, i.work = t, i.pending = !1, i;
  }
  return n.prototype.schedule = function(r, t) {
    var i;
    if (t === void 0 && (t = 0), this.closed)
      return this;
    this.state = r;
    var a = this.id, o = this.scheduler;
    return a != null && (this.id = this.recycleAsyncId(o, a, t)), this.pending = !0, this.delay = t, this.id = (i = this.id) !== null && i !== void 0 ? i : this.requestAsyncId(o, this.id, t), this;
  }, n.prototype.requestAsyncId = function(r, t, i) {
    return i === void 0 && (i = 0), h.setInterval(r.flush.bind(r, this), i);
  }, n.prototype.recycleAsyncId = function(r, t, i) {
    if (i === void 0 && (i = 0), i != null && this.delay === i && this.pending === !1)
      return t;
    t != null && h.clearInterval(t);
  }, n.prototype.execute = function(r, t) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var i = this._execute(r, t);
    if (i)
      return i;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, n.prototype._execute = function(r, t) {
    var i = !1, a;
    try {
      this.work(r);
    } catch (o) {
      i = !0, a = o || new Error("Scheduled action threw falsy error");
    }
    if (i)
      return this.unsubscribe(), a;
  }, n.prototype.unsubscribe = function() {
    if (!this.closed) {
      var r = this, t = r.id, i = r.scheduler, a = i.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, O(a, this), t != null && (this.id = this.recycleAsyncId(i, t, null)), this.delay = null, e.prototype.unsubscribe.call(this);
    }
  }, n;
}(G), m = function() {
  function e(n, r) {
    r === void 0 && (r = e.now), this.schedulerActionCtor = n, this.now = r;
  }
  return e.prototype.schedule = function(n, r, t) {
    return r === void 0 && (r = 0), new this.schedulerActionCtor(this, n).schedule(t, r);
  }, e.now = S.now, e;
}(), z = function(e) {
  d(n, e);
  function n(r, t) {
    t === void 0 && (t = m.now);
    var i = e.call(this, r, t) || this;
    return i.actions = [], i._active = !1, i;
  }
  return n.prototype.flush = function(r) {
    var t = this.actions;
    if (this._active) {
      t.push(r);
      return;
    }
    var i;
    this._active = !0;
    do
      if (i = r.execute(r.state, r.delay))
        break;
    while (r = t.shift());
    if (this._active = !1, i) {
      for (; r = t.shift(); )
        r.unsubscribe();
      throw i;
    }
  }, n;
}(m), V = new z(q), te = V, Y = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function j(e) {
  return c(e == null ? void 0 : e.then);
}
function C(e) {
  return c(e[w]);
}
function D(e) {
  return Symbol.asyncIterator && c(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function B(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function H() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var J = H();
function K(e) {
  return c(e == null ? void 0 : e[J]);
}
function M(e) {
  return L(this, arguments, function() {
    var r, t, i, a;
    return I(this, function(o) {
      switch (o.label) {
        case 0:
          r = e.getReader(), o.label = 1;
        case 1:
          o.trys.push([1, , 9, 10]), o.label = 2;
        case 2:
          return [4, y(r.read())];
        case 3:
          return t = o.sent(), i = t.value, a = t.done, a ? [4, y(void 0)] : [3, 5];
        case 4:
          return [2, o.sent()];
        case 5:
          return [4, y(i)];
        case 6:
          return [4, o.sent()];
        case 7:
          return o.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return r.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function Q(e) {
  return c(e == null ? void 0 : e.getReader);
}
function ne(e) {
  if (e instanceof l)
    return e;
  if (e != null) {
    if (C(e))
      return W(e);
    if (Y(e))
      return X(e);
    if (j(e))
      return Z(e);
    if (D(e))
      return x(e);
    if (K(e))
      return $(e);
    if (Q(e))
      return N(e);
  }
  throw B(e);
}
function W(e) {
  return new l(function(n) {
    var r = e[w]();
    if (c(r.subscribe))
      return r.subscribe(n);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function X(e) {
  return new l(function(n) {
    for (var r = 0; r < e.length && !n.closed; r++)
      n.next(e[r]);
    n.complete();
  });
}
function Z(e) {
  return new l(function(n) {
    e.then(function(r) {
      n.closed || (n.next(r), n.complete());
    }, function(r) {
      return n.error(r);
    }).then(null, T);
  });
}
function $(e) {
  return new l(function(n) {
    var r, t;
    try {
      for (var i = E(e), a = i.next(); !a.done; a = i.next()) {
        var o = a.value;
        if (n.next(o), n.closed)
          return;
      }
    } catch (u) {
      r = { error: u };
    } finally {
      try {
        a && !a.done && (t = i.return) && t.call(i);
      } finally {
        if (r)
          throw r.error;
      }
    }
    n.complete();
  });
}
function x(e) {
  return new l(function(n) {
    ee(e, n).catch(function(r) {
      return n.error(r);
    });
  });
}
function N(e) {
  return x(M(e));
}
function ee(e, n) {
  var r, t, i, a;
  return P(this, void 0, void 0, function() {
    var o, u;
    return I(this, function(s) {
      switch (s.label) {
        case 0:
          s.trys.push([0, 5, 6, 11]), r = R(e), s.label = 1;
        case 1:
          return [4, r.next()];
        case 2:
          if (t = s.sent(), !!t.done)
            return [3, 4];
          if (o = t.value, n.next(o), n.closed)
            return [2];
          s.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return u = s.sent(), i = { error: u }, [3, 11];
        case 6:
          return s.trys.push([6, , 9, 10]), t && !t.done && (a = r.return) ? [4, a.call(r)] : [3, 8];
        case 7:
          s.sent(), s.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (i)
            throw i.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return n.complete(), [2];
      }
    });
  });
}
function ie(e, n) {
  return g(function(r, t) {
    var i = 0;
    r.subscribe(A(t, function(a) {
      t.next(e.call(n, a, i++));
    }));
  });
}
function ae(e, n) {
  return g(function(r, t) {
    var i = 0;
    r.subscribe(A(t, function(a) {
      return e.call(n, a, i++) && t.next(a);
    }));
  });
}
export {
  V as a,
  J as b,
  A as c,
  C as d,
  Y as e,
  ae as f,
  j as g,
  D as h,
  ne as i,
  K as j,
  Q as k,
  B as l,
  ie as m,
  te as n,
  g as o,
  M as r
};
