import { d as b, o as y, c as d, m as k } from "./map-ceec7a47.js";
import { _ as m, S as _, a as w, b as I, c as T, i as l, o as A, d as L, e as S, f as v, O as f, r as O, g as E, h as P, j as R, n as C } from "./Observable-0eaf2fb8.js";
var F = function(e) {
  m(i, e);
  function i(r, n) {
    return e.call(this) || this;
  }
  return i.prototype.schedule = function(r, n) {
    return this;
  }, i;
}(_), h = {
  setInterval: function(e, i) {
    for (var r = [], n = 2; n < arguments.length; n++)
      r[n - 2] = arguments[n];
    var t = h.delegate;
    return t != null && t.setInterval ? t.setInterval.apply(t, w([e, i], I(r))) : setInterval.apply(void 0, w([e, i], I(r)));
  },
  clearInterval: function(e) {
    var i = h.delegate;
    return ((i == null ? void 0 : i.clearInterval) || clearInterval)(e);
  },
  delegate: void 0
}, G = function(e) {
  m(i, e);
  function i(r, n) {
    var t = e.call(this, r, n) || this;
    return t.scheduler = r, t.work = n, t.pending = !1, t;
  }
  return i.prototype.schedule = function(r, n) {
    var t;
    if (n === void 0 && (n = 0), this.closed)
      return this;
    this.state = r;
    var o = this.id, a = this.scheduler;
    return o != null && (this.id = this.recycleAsyncId(a, o, n)), this.pending = !0, this.delay = n, this.id = (t = this.id) !== null && t !== void 0 ? t : this.requestAsyncId(a, this.id, n), this;
  }, i.prototype.requestAsyncId = function(r, n, t) {
    return t === void 0 && (t = 0), h.setInterval(r.flush.bind(r, this), t);
  }, i.prototype.recycleAsyncId = function(r, n, t) {
    if (t === void 0 && (t = 0), t != null && this.delay === t && this.pending === !1)
      return n;
    n != null && h.clearInterval(n);
  }, i.prototype.execute = function(r, n) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var t = this._execute(r, n);
    if (t)
      return t;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, i.prototype._execute = function(r, n) {
    var t = !1, o;
    try {
      this.work(r);
    } catch (a) {
      t = !0, o = a || new Error("Scheduled action threw falsy error");
    }
    if (t)
      return this.unsubscribe(), o;
  }, i.prototype.unsubscribe = function() {
    if (!this.closed) {
      var r = this, n = r.id, t = r.scheduler, o = t.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, T(o, this), n != null && (this.id = this.recycleAsyncId(t, n, null)), this.delay = null, e.prototype.unsubscribe.call(this);
    }
  }, i;
}(F), g = function() {
  function e(i, r) {
    r === void 0 && (r = e.now), this.schedulerActionCtor = i, this.now = r;
  }
  return e.prototype.schedule = function(i, r, n) {
    return r === void 0 && (r = 0), new this.schedulerActionCtor(this, i).schedule(n, r);
  }, e.now = b.now, e;
}(), V = function(e) {
  m(i, e);
  function i(r, n) {
    n === void 0 && (n = g.now);
    var t = e.call(this, r, n) || this;
    return t.actions = [], t._active = !1, t;
  }
  return i.prototype.flush = function(r) {
    var n = this.actions;
    if (this._active) {
      n.push(r);
      return;
    }
    var t;
    this._active = !0;
    do
      if (t = r.execute(r.state, r.delay))
        break;
    while (r = n.shift());
    if (this._active = !1, t) {
      for (; r = n.shift(); )
        r.unsubscribe();
      throw t;
    }
  }, i;
}(g), q = new V(G), Y = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function B(e) {
  return l(e == null ? void 0 : e.then);
}
function D(e) {
  return l(e[A]);
}
function U(e) {
  return Symbol.asyncIterator && l(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function W(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function j() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var z = j();
function H(e) {
  return l(e == null ? void 0 : e[z]);
}
function J(e) {
  return L(this, arguments, function() {
    var r, n, t, o;
    return S(this, function(a) {
      switch (a.label) {
        case 0:
          r = e.getReader(), a.label = 1;
        case 1:
          a.trys.push([1, , 9, 10]), a.label = 2;
        case 2:
          return [4, v(r.read())];
        case 3:
          return n = a.sent(), t = n.value, o = n.done, o ? [4, v(void 0)] : [3, 5];
        case 4:
          return [2, a.sent()];
        case 5:
          return [4, v(t)];
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
function K(e) {
  return l(e == null ? void 0 : e.getReader);
}
function M(e) {
  if (e instanceof f)
    return e;
  if (e != null) {
    if (D(e))
      return N(e);
    if (Y(e))
      return Q(e);
    if (B(e))
      return X(e);
    if (U(e))
      return x(e);
    if (H(e))
      return Z(e);
    if (K(e))
      return $(e);
  }
  throw W(e);
}
function N(e) {
  return new f(function(i) {
    var r = e[A]();
    if (l(r.subscribe))
      return r.subscribe(i);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function Q(e) {
  return new f(function(i) {
    for (var r = 0; r < e.length && !i.closed; r++)
      i.next(e[r]);
    i.complete();
  });
}
function X(e) {
  return new f(function(i) {
    e.then(function(r) {
      i.closed || (i.next(r), i.complete());
    }, function(r) {
      return i.error(r);
    }).then(null, O);
  });
}
function Z(e) {
  return new f(function(i) {
    var r, n;
    try {
      for (var t = E(e), o = t.next(); !o.done; o = t.next()) {
        var a = o.value;
        if (i.next(a), i.closed)
          return;
      }
    } catch (u) {
      r = { error: u };
    } finally {
      try {
        o && !o.done && (n = t.return) && n.call(t);
      } finally {
        if (r)
          throw r.error;
      }
    }
    i.complete();
  });
}
function x(e) {
  return new f(function(i) {
    ee(e, i).catch(function(r) {
      return i.error(r);
    });
  });
}
function $(e) {
  return x(J(e));
}
function ee(e, i) {
  var r, n, t, o;
  return P(this, void 0, void 0, function() {
    var a, u;
    return S(this, function(s) {
      switch (s.label) {
        case 0:
          s.trys.push([0, 5, 6, 11]), r = R(e), s.label = 1;
        case 1:
          return [4, r.next()];
        case 2:
          if (n = s.sent(), !!n.done)
            return [3, 4];
          if (a = n.value, i.next(a), i.closed)
            return [2];
          s.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return u = s.sent(), t = { error: u }, [3, 11];
        case 6:
          return s.trys.push([6, , 9, 10]), n && !n.done && (o = r.return) ? [4, o.call(r)] : [3, 8];
        case 7:
          s.sent(), s.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (t)
            throw t.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return i.complete(), [2];
      }
    });
  });
}
function re(e, i) {
  return y(function(r, n) {
    var t = 0;
    r.subscribe(d(n, function(o) {
      return e.call(i, o, t++) && n.next(o);
    }));
  });
}
function te(e) {
  return y(function(i, r) {
    var n = [];
    return i.subscribe(d(r, function(t) {
      return n.push(t);
    }, function() {
      r.next(n), r.complete();
    })), M(e).subscribe(d(r, function() {
      var t = n;
      n = [], r.next(t);
    }, C)), function() {
      n = null;
    };
  });
}
function ne(e, i) {
  return i === void 0 && (i = q), y(function(r, n) {
    var t = null, o = null, a = null, u = function() {
      if (t) {
        t.unsubscribe(), t = null;
        var c = o;
        o = null, n.next(c);
      }
    };
    function s() {
      var c = a + e, p = i.now();
      if (p < c) {
        t = this.schedule(void 0, c - p), n.add(t);
        return;
      }
      u();
    }
    r.subscribe(d(n, function(c) {
      o = c, a = i.now(), t || (t = i.schedule(s, e), n.add(t));
    }, function() {
      u(), n.complete();
    }, void 0, function() {
      o = t = null;
    }));
  });
}
function ae(e = 250) {
  return (i) => i.pipe(te(i.pipe(ne(e))), re((r) => r.length > 1), k(([r]) => r));
}
export {
  ae as f
};
