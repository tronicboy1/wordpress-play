import { i, _ as b, e as w, o as y, f as p, g as h, h as v, O as l, r as S, j as I, k as x, l as O } from "./BehaviorSubject-d8faa85a.js";
function g(r) {
  return i(r == null ? void 0 : r.lift);
}
function k(r) {
  return function(n) {
    if (g(n))
      return n.lift(function(e) {
        try {
          return r(e, this);
        } catch (t) {
          this.error(t);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function A(r, n, e, t, o) {
  return new L(r, n, e, t, o);
}
var L = function(r) {
  b(n, r);
  function n(e, t, o, a, s, u) {
    var c = r.call(this, e) || this;
    return c.onFinalize = s, c.shouldUnsubscribe = u, c._next = t ? function(f) {
      try {
        t(f);
      } catch (d) {
        e.error(d);
      }
    } : r.prototype._next, c._error = a ? function(f) {
      try {
        a(f);
      } catch (d) {
        e.error(d);
      } finally {
        this.unsubscribe();
      }
    } : r.prototype._error, c._complete = o ? function() {
      try {
        o();
      } catch (f) {
        e.error(f);
      } finally {
        this.unsubscribe();
      }
    } : r.prototype._complete, c;
  }
  return n.prototype.unsubscribe = function() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var t = this.closed;
      r.prototype.unsubscribe.call(this), !t && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }, n;
}(w), T = function(r) {
  return r && typeof r.length == "number" && typeof r != "function";
};
function R(r) {
  return i(r == null ? void 0 : r.then);
}
function U(r) {
  return i(r[y]);
}
function _(r) {
  return Symbol.asyncIterator && i(r == null ? void 0 : r[Symbol.asyncIterator]);
}
function E(r) {
  return new TypeError("You provided " + (r !== null && typeof r == "object" ? "an invalid object" : "'" + r + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function F() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var P = F();
function G(r) {
  return i(r == null ? void 0 : r[P]);
}
function z(r) {
  return p(this, arguments, function() {
    var e, t, o, a;
    return h(this, function(s) {
      switch (s.label) {
        case 0:
          e = r.getReader(), s.label = 1;
        case 1:
          s.trys.push([1, , 9, 10]), s.label = 2;
        case 2:
          return [4, v(e.read())];
        case 3:
          return t = s.sent(), o = t.value, a = t.done, a ? [4, v(void 0)] : [3, 5];
        case 4:
          return [2, s.sent()];
        case 5:
          return [4, v(o)];
        case 6:
          return [4, s.sent()];
        case 7:
          return s.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return e.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function Y(r) {
  return i(r == null ? void 0 : r.getReader);
}
function K(r) {
  if (r instanceof l)
    return r;
  if (r != null) {
    if (U(r))
      return j(r);
    if (T(r))
      return V(r);
    if (R(r))
      return q(r);
    if (_(r))
      return m(r);
    if (G(r))
      return B(r);
    if (Y(r))
      return D(r);
  }
  throw E(r);
}
function j(r) {
  return new l(function(n) {
    var e = r[y]();
    if (i(e.subscribe))
      return e.subscribe(n);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function V(r) {
  return new l(function(n) {
    for (var e = 0; e < r.length && !n.closed; e++)
      n.next(r[e]);
    n.complete();
  });
}
function q(r) {
  return new l(function(n) {
    r.then(function(e) {
      n.closed || (n.next(e), n.complete());
    }, function(e) {
      return n.error(e);
    }).then(null, S);
  });
}
function B(r) {
  return new l(function(n) {
    var e, t;
    try {
      for (var o = I(r), a = o.next(); !a.done; a = o.next()) {
        var s = a.value;
        if (n.next(s), n.closed)
          return;
      }
    } catch (u) {
      e = { error: u };
    } finally {
      try {
        a && !a.done && (t = o.return) && t.call(o);
      } finally {
        if (e)
          throw e.error;
      }
    }
    n.complete();
  });
}
function m(r) {
  return new l(function(n) {
    H(r, n).catch(function(e) {
      return n.error(e);
    });
  });
}
function D(r) {
  return m(z(r));
}
function H(r, n) {
  var e, t, o, a;
  return x(this, void 0, void 0, function() {
    var s, u;
    return h(this, function(c) {
      switch (c.label) {
        case 0:
          c.trys.push([0, 5, 6, 11]), e = O(r), c.label = 1;
        case 1:
          return [4, e.next()];
        case 2:
          if (t = c.sent(), !!t.done)
            return [3, 4];
          if (s = t.value, n.next(s), n.closed)
            return [2];
          c.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return u = c.sent(), o = { error: u }, [3, 11];
        case 6:
          return c.trys.push([6, , 9, 10]), t && !t.done && (a = e.return) ? [4, a.call(e)] : [3, 8];
        case 7:
          c.sent(), c.label = 8;
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
function M(r, n) {
  return k(function(e, t) {
    var o = 0;
    e.subscribe(A(t, function(a) {
      t.next(r.call(n, a, o++));
    }));
  });
}
export {
  P as a,
  U as b,
  A as c,
  T as d,
  R as e,
  _ as f,
  G as g,
  Y as h,
  K as i,
  E as j,
  M as m,
  k as o,
  z as r
};
