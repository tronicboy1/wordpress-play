import { i as l, _ as y, S as x, a as k, b, c as w, d as _, o as g, e as O, f as A, g as m, O as h, r as T, h as L, j as E, k as P, n as R } from "./Observable-1fac79e7.js";
import { d as F } from "./dateTimestampProvider-fa1bb5f7.js";
function U(e) {
  return l(e == null ? void 0 : e.lift);
}
function p(e) {
  return function(i) {
    if (U(i))
      return i.lift(function(r) {
        try {
          return e(r, this);
        } catch (t) {
          this.error(t);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function d(e, i, r, t, n) {
  return new G(e, i, r, t, n);
}
var G = function(e) {
  y(i, e);
  function i(r, t, n, o, a, s) {
    var u = e.call(this, r) || this;
    return u.onFinalize = a, u.shouldUnsubscribe = s, u._next = t ? function(c) {
      try {
        t(c);
      } catch (f) {
        r.error(f);
      }
    } : e.prototype._next, u._error = o ? function(c) {
      try {
        o(c);
      } catch (f) {
        r.error(f);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, u._complete = n ? function() {
      try {
        n();
      } catch (c) {
        r.error(c);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, u;
  }
  return i.prototype.unsubscribe = function() {
    var r;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var t = this.closed;
      e.prototype.unsubscribe.call(this), !t && ((r = this.onFinalize) === null || r === void 0 || r.call(this));
    }
  }, i;
}(x), V = function(e) {
  y(i, e);
  function i(r, t) {
    return e.call(this) || this;
  }
  return i.prototype.schedule = function(r, t) {
    return this;
  }, i;
}(k), v = {
  setInterval: function(e, i) {
    for (var r = [], t = 2; t < arguments.length; t++)
      r[t - 2] = arguments[t];
    var n = v.delegate;
    return n != null && n.setInterval ? n.setInterval.apply(n, b([e, i], w(r))) : setInterval.apply(void 0, b([e, i], w(r)));
  },
  clearInterval: function(e) {
    var i = v.delegate;
    return ((i == null ? void 0 : i.clearInterval) || clearInterval)(e);
  },
  delegate: void 0
}, q = function(e) {
  y(i, e);
  function i(r, t) {
    var n = e.call(this, r, t) || this;
    return n.scheduler = r, n.work = t, n.pending = !1, n;
  }
  return i.prototype.schedule = function(r, t) {
    var n;
    if (t === void 0 && (t = 0), this.closed)
      return this;
    this.state = r;
    var o = this.id, a = this.scheduler;
    return o != null && (this.id = this.recycleAsyncId(a, o, t)), this.pending = !0, this.delay = t, this.id = (n = this.id) !== null && n !== void 0 ? n : this.requestAsyncId(a, this.id, t), this;
  }, i.prototype.requestAsyncId = function(r, t, n) {
    return n === void 0 && (n = 0), v.setInterval(r.flush.bind(r, this), n);
  }, i.prototype.recycleAsyncId = function(r, t, n) {
    if (n === void 0 && (n = 0), n != null && this.delay === n && this.pending === !1)
      return t;
    t != null && v.clearInterval(t);
  }, i.prototype.execute = function(r, t) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var n = this._execute(r, t);
    if (n)
      return n;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, i.prototype._execute = function(r, t) {
    var n = !1, o;
    try {
      this.work(r);
    } catch (a) {
      n = !0, o = a || new Error("Scheduled action threw falsy error");
    }
    if (n)
      return this.unsubscribe(), o;
  }, i.prototype.unsubscribe = function() {
    if (!this.closed) {
      var r = this, t = r.id, n = r.scheduler, o = n.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, _(o, this), t != null && (this.id = this.recycleAsyncId(n, t, null)), this.delay = null, e.prototype.unsubscribe.call(this);
    }
  }, i;
}(V), I = function() {
  function e(i, r) {
    r === void 0 && (r = e.now), this.schedulerActionCtor = i, this.now = r;
  }
  return e.prototype.schedule = function(i, r, t) {
    return r === void 0 && (r = 0), new this.schedulerActionCtor(this, i).schedule(t, r);
  }, e.now = F.now, e;
}(), z = function(e) {
  y(i, e);
  function i(r, t) {
    t === void 0 && (t = I.now);
    var n = e.call(this, r, t) || this;
    return n.actions = [], n._active = !1, n;
  }
  return i.prototype.flush = function(r) {
    var t = this.actions;
    if (this._active) {
      t.push(r);
      return;
    }
    var n;
    this._active = !0;
    do
      if (n = r.execute(r.state, r.delay))
        break;
    while (r = t.shift());
    if (this._active = !1, n) {
      for (; r = t.shift(); )
        r.unsubscribe();
      throw n;
    }
  }, i;
}(I), C = new z(q), Y = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function B(e) {
  return l(e == null ? void 0 : e.then);
}
function D(e) {
  return l(e[g]);
}
function W(e) {
  return Symbol.asyncIterator && l(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function j(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function H() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var J = H();
function K(e) {
  return l(e == null ? void 0 : e[J]);
}
function M(e) {
  return O(this, arguments, function() {
    var r, t, n, o;
    return A(this, function(a) {
      switch (a.label) {
        case 0:
          r = e.getReader(), a.label = 1;
        case 1:
          a.trys.push([1, , 9, 10]), a.label = 2;
        case 2:
          return [4, m(r.read())];
        case 3:
          return t = a.sent(), n = t.value, o = t.done, o ? [4, m(void 0)] : [3, 5];
        case 4:
          return [2, a.sent()];
        case 5:
          return [4, m(n)];
        case 6:
          return [4, a.sent()];
        case 7:
          return a.sent(), [3, 2];
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
  return l(e == null ? void 0 : e.getReader);
}
function X(e) {
  if (e instanceof h)
    return e;
  if (e != null) {
    if (D(e))
      return Z(e);
    if (Y(e))
      return $(e);
    if (B(e))
      return N(e);
    if (W(e))
      return S(e);
    if (K(e))
      return ee(e);
    if (Q(e))
      return re(e);
  }
  throw j(e);
}
function Z(e) {
  return new h(function(i) {
    var r = e[g]();
    if (l(r.subscribe))
      return r.subscribe(i);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function $(e) {
  return new h(function(i) {
    for (var r = 0; r < e.length && !i.closed; r++)
      i.next(e[r]);
    i.complete();
  });
}
function N(e) {
  return new h(function(i) {
    e.then(function(r) {
      i.closed || (i.next(r), i.complete());
    }, function(r) {
      return i.error(r);
    }).then(null, T);
  });
}
function ee(e) {
  return new h(function(i) {
    var r, t;
    try {
      for (var n = L(e), o = n.next(); !o.done; o = n.next()) {
        var a = o.value;
        if (i.next(a), i.closed)
          return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        o && !o.done && (t = n.return) && t.call(n);
      } finally {
        if (r)
          throw r.error;
      }
    }
    i.complete();
  });
}
function S(e) {
  return new h(function(i) {
    te(e, i).catch(function(r) {
      return i.error(r);
    });
  });
}
function re(e) {
  return S(M(e));
}
function te(e, i) {
  var r, t, n, o;
  return E(this, void 0, void 0, function() {
    var a, s;
    return A(this, function(u) {
      switch (u.label) {
        case 0:
          u.trys.push([0, 5, 6, 11]), r = P(e), u.label = 1;
        case 1:
          return [4, r.next()];
        case 2:
          if (t = u.sent(), !!t.done)
            return [3, 4];
          if (a = t.value, i.next(a), i.closed)
            return [2];
          u.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return s = u.sent(), n = { error: s }, [3, 11];
        case 6:
          return u.trys.push([6, , 9, 10]), t && !t.done && (o = r.return) ? [4, o.call(r)] : [3, 8];
        case 7:
          u.sent(), u.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (n)
            throw n.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return i.complete(), [2];
      }
    });
  });
}
function ne(e, i) {
  return p(function(r, t) {
    var n = 0;
    r.subscribe(d(t, function(o) {
      t.next(e.call(i, o, n++));
    }));
  });
}
function ie(e, i) {
  return p(function(r, t) {
    var n = 0;
    r.subscribe(d(t, function(o) {
      return e.call(i, o, n++) && t.next(o);
    }));
  });
}
function oe(e) {
  return p(function(i, r) {
    var t = [];
    return i.subscribe(d(r, function(n) {
      return t.push(n);
    }, function() {
      r.next(t), r.complete();
    })), X(e).subscribe(d(r, function() {
      var n = t;
      t = [], r.next(n);
    }, R)), function() {
      t = null;
    };
  });
}
function ae(e, i) {
  return i === void 0 && (i = C), p(function(r, t) {
    var n = null, o = null, a = null, s = function() {
      if (n) {
        n.unsubscribe(), n = null;
        var c = o;
        o = null, t.next(c);
      }
    };
    function u() {
      var c = a + e, f = i.now();
      if (f < c) {
        n = this.schedule(void 0, c - f), t.add(n);
        return;
      }
      s();
    }
    r.subscribe(d(t, function(c) {
      o = c, a = i.now(), n || (n = i.schedule(u, e), t.add(n));
    }, function() {
      s(), t.complete();
    }, void 0, function() {
      o = n = null;
    }));
  });
}
function se(e = 250) {
  return (i) => i.pipe(oe(i.pipe(ae(e))), ie((r) => r.length > 1), ne(([r]) => r));
}
export {
  se as f
};
