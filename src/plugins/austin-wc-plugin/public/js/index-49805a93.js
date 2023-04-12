var g = function(e, r) {
  return g = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
  }, g(e, r);
};
function p(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
  g(e, r);
  function t() {
    this.constructor = e;
  }
  e.prototype = r === null ? Object.create(r) : (t.prototype = r.prototype, new t());
}
function E(e) {
  var r = typeof Symbol == "function" && Symbol.iterator, t = r && e[r], n = 0;
  if (t)
    return t.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function() {
        return e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e };
      }
    };
  throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function b(e, r) {
  var t = typeof Symbol == "function" && e[Symbol.iterator];
  if (!t)
    return e;
  var n = t.call(e), o, i = [], s;
  try {
    for (; (r === void 0 || r-- > 0) && !(o = n.next()).done; )
      i.push(o.value);
  } catch (u) {
    s = { error: u };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (s)
        throw s.error;
    }
  }
  return i;
}
function y(e, r, t) {
  if (t || arguments.length === 2)
    for (var n = 0, o = r.length, i; n < o; n++)
      (i || !(n in r)) && (i || (i = Array.prototype.slice.call(r, 0, n)), i[n] = r[n]);
  return e.concat(i || Array.prototype.slice.call(r));
}
function l(e) {
  return typeof e == "function";
}
function M(e) {
  var r = function(n) {
    Error.call(n), n.stack = new Error().stack;
  }, t = e(r);
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var _ = M(function(e) {
  return function(t) {
    e(this), this.message = t ? t.length + ` errors occurred during unsubscription:
` + t.map(function(n, o) {
      return o + 1 + ") " + n.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = t;
  };
});
function x(e, r) {
  if (e) {
    var t = e.indexOf(r);
    0 <= t && e.splice(t, 1);
  }
}
var S = function() {
  function e(r) {
    this.initialTeardown = r, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return e.prototype.unsubscribe = function() {
    var r, t, n, o, i;
    if (!this.closed) {
      this.closed = !0;
      var s = this._parentage;
      if (s)
        if (this._parentage = null, Array.isArray(s))
          try {
            for (var u = E(s), c = u.next(); !c.done; c = u.next()) {
              var m = c.value;
              m.remove(this);
            }
          } catch (a) {
            r = { error: a };
          } finally {
            try {
              c && !c.done && (t = u.return) && t.call(u);
            } finally {
              if (r)
                throw r.error;
            }
          }
        else
          s.remove(this);
      var T = this.initialTeardown;
      if (l(T))
        try {
          T();
        } catch (a) {
          i = a instanceof _ ? a.errors : [a];
        }
      var A = this._finalizers;
      if (A) {
        this._finalizers = null;
        try {
          for (var h = E(A), f = h.next(); !f.done; f = h.next()) {
            var V = f.value;
            try {
              I(V);
            } catch (a) {
              i = i ?? [], a instanceof _ ? i = y(y([], b(i)), b(a.errors)) : i.push(a);
            }
          }
        } catch (a) {
          n = { error: a };
        } finally {
          try {
            f && !f.done && (o = h.return) && o.call(h);
          } finally {
            if (n)
              throw n.error;
          }
        }
      }
      if (i)
        throw new _(i);
    }
  }, e.prototype.add = function(r) {
    var t;
    if (r && r !== this)
      if (this.closed)
        I(r);
      else {
        if (r instanceof e) {
          if (r.closed || r._hasParent(this))
            return;
          r._addParent(this);
        }
        (this._finalizers = (t = this._finalizers) !== null && t !== void 0 ? t : []).push(r);
      }
  }, e.prototype._hasParent = function(r) {
    var t = this._parentage;
    return t === r || Array.isArray(t) && t.includes(r);
  }, e.prototype._addParent = function(r) {
    var t = this._parentage;
    this._parentage = Array.isArray(t) ? (t.push(r), t) : t ? [t, r] : r;
  }, e.prototype._removeParent = function(r) {
    var t = this._parentage;
    t === r ? this._parentage = null : Array.isArray(t) && x(t, r);
  }, e.prototype.remove = function(r) {
    var t = this._finalizers;
    t && x(t, r), r instanceof e && r._removeParent(this);
  }, e.EMPTY = function() {
    var r = new e();
    return r.closed = !0, r;
  }(), e;
}(), R = S.EMPTY;
function Y(e) {
  return e instanceof S || e && "closed" in e && l(e.remove) && l(e.add) && l(e.unsubscribe);
}
function I(e) {
  l(e) ? e() : e.unsubscribe();
}
var k = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, O = {
  setTimeout: function(e, r) {
    for (var t = [], n = 2; n < arguments.length; n++)
      t[n - 2] = arguments[n];
    var o = O.delegate;
    return o != null && o.setTimeout ? o.setTimeout.apply(o, y([e, r], b(t))) : setTimeout.apply(void 0, y([e, r], b(t)));
  },
  clearTimeout: function(e) {
    var r = O.delegate;
    return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(e);
  },
  delegate: void 0
};
function H(e) {
  O.setTimeout(function() {
    throw e;
  });
}
function C() {
}
function d(e) {
  e();
}
var D = function(e) {
  p(r, e);
  function r(t) {
    var n = e.call(this) || this;
    return n.isStopped = !1, t ? (n.destination = t, Y(t) && t.add(n)) : n.destination = K, n;
  }
  return r.create = function(t, n, o) {
    return new j(t, n, o);
  }, r.prototype.next = function(t) {
    this.isStopped || this._next(t);
  }, r.prototype.error = function(t) {
    this.isStopped || (this.isStopped = !0, this._error(t));
  }, r.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, r.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
  }, r.prototype._next = function(t) {
    this.destination.next(t);
  }, r.prototype._error = function(t) {
    try {
      this.destination.error(t);
    } finally {
      this.unsubscribe();
    }
  }, r.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, r;
}(S), q = Function.prototype.bind;
function w(e, r) {
  return q.call(e, r);
}
var G = function() {
  function e(r) {
    this.partialObserver = r;
  }
  return e.prototype.next = function(r) {
    var t = this.partialObserver;
    if (t.next)
      try {
        t.next(r);
      } catch (n) {
        v(n);
      }
  }, e.prototype.error = function(r) {
    var t = this.partialObserver;
    if (t.error)
      try {
        t.error(r);
      } catch (n) {
        v(n);
      }
    else
      v(r);
  }, e.prototype.complete = function() {
    var r = this.partialObserver;
    if (r.complete)
      try {
        r.complete();
      } catch (t) {
        v(t);
      }
  }, e;
}(), j = function(e) {
  p(r, e);
  function r(t, n, o) {
    var i = e.call(this) || this, s;
    if (l(t) || !t)
      s = {
        next: t ?? void 0,
        error: n ?? void 0,
        complete: o ?? void 0
      };
    else {
      var u;
      i && k.useDeprecatedNextContext ? (u = Object.create(t), u.unsubscribe = function() {
        return i.unsubscribe();
      }, s = {
        next: t.next && w(t.next, u),
        error: t.error && w(t.error, u),
        complete: t.complete && w(t.complete, u)
      }) : s = t;
    }
    return i.destination = new G(s), i;
  }
  return r;
}(D);
function v(e) {
  H(e);
}
function J(e) {
  throw e;
}
var K = {
  closed: !0,
  next: C,
  error: J,
  complete: C
}, L = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function Q(e) {
  return e;
}
function W(e) {
  return e.length === 0 ? Q : e.length === 1 ? e[0] : function(t) {
    return e.reduce(function(n, o) {
      return o(n);
    }, t);
  };
}
var U = function() {
  function e(r) {
    r && (this._subscribe = r);
  }
  return e.prototype.lift = function(r) {
    var t = new e();
    return t.source = this, t.operator = r, t;
  }, e.prototype.subscribe = function(r, t, n) {
    var o = this, i = Z(r) ? r : new j(r, t, n);
    return d(function() {
      var s = o, u = s.operator, c = s.source;
      i.add(u ? u.call(i, c) : c ? o._subscribe(i) : o._trySubscribe(i));
    }), i;
  }, e.prototype._trySubscribe = function(r) {
    try {
      return this._subscribe(r);
    } catch (t) {
      r.error(t);
    }
  }, e.prototype.forEach = function(r, t) {
    var n = this;
    return t = F(t), new t(function(o, i) {
      var s = new j({
        next: function(u) {
          try {
            r(u);
          } catch (c) {
            i(c), s.unsubscribe();
          }
        },
        error: i,
        complete: o
      });
      n.subscribe(s);
    });
  }, e.prototype._subscribe = function(r) {
    var t;
    return (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(r);
  }, e.prototype[L] = function() {
    return this;
  }, e.prototype.pipe = function() {
    for (var r = [], t = 0; t < arguments.length; t++)
      r[t] = arguments[t];
    return W(r)(this);
  }, e.prototype.toPromise = function(r) {
    var t = this;
    return r = F(r), new r(function(n, o) {
      var i;
      t.subscribe(function(s) {
        return i = s;
      }, function(s) {
        return o(s);
      }, function() {
        return n(i);
      });
    });
  }, e.create = function(r) {
    return new e(r);
  }, e;
}();
function F(e) {
  var r;
  return (r = e ?? k.Promise) !== null && r !== void 0 ? r : Promise;
}
function X(e) {
  return e && l(e.next) && l(e.error) && l(e.complete);
}
function Z(e) {
  return e && e instanceof D || X(e) && Y(e);
}
var $ = M(function(e) {
  return function() {
    e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), P = function(e) {
  p(r, e);
  function r() {
    var t = e.call(this) || this;
    return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
  }
  return r.prototype.lift = function(t) {
    var n = new B(this, this);
    return n.operator = t, n;
  }, r.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new $();
  }, r.prototype.next = function(t) {
    var n = this;
    d(function() {
      var o, i;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var s = E(n.currentObservers), u = s.next(); !u.done; u = s.next()) {
            var c = u.value;
            c.next(t);
          }
        } catch (m) {
          o = { error: m };
        } finally {
          try {
            u && !u.done && (i = s.return) && i.call(s);
          } finally {
            if (o)
              throw o.error;
          }
        }
      }
    });
  }, r.prototype.error = function(t) {
    var n = this;
    d(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.hasError = n.isStopped = !0, n.thrownError = t;
        for (var o = n.observers; o.length; )
          o.shift().error(t);
      }
    });
  }, r.prototype.complete = function() {
    var t = this;
    d(function() {
      if (t._throwIfClosed(), !t.isStopped) {
        t.isStopped = !0;
        for (var n = t.observers; n.length; )
          n.shift().complete();
      }
    });
  }, r.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(r.prototype, "observed", {
    get: function() {
      var t;
      return ((t = this.observers) === null || t === void 0 ? void 0 : t.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), r.prototype._trySubscribe = function(t) {
    return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
  }, r.prototype._subscribe = function(t) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t);
  }, r.prototype._innerSubscribe = function(t) {
    var n = this, o = this, i = o.hasError, s = o.isStopped, u = o.observers;
    return i || s ? R : (this.currentObservers = null, u.push(t), new S(function() {
      n.currentObservers = null, x(u, t);
    }));
  }, r.prototype._checkFinalizedStatuses = function(t) {
    var n = this, o = n.hasError, i = n.thrownError, s = n.isStopped;
    o ? t.error(i) : s && t.complete();
  }, r.prototype.asObservable = function() {
    var t = new U();
    return t.source = this, t;
  }, r.create = function(t, n) {
    return new B(t, n);
  }, r;
}(U), B = function(e) {
  p(r, e);
  function r(t, n) {
    var o = e.call(this) || this;
    return o.destination = t, o.source = n, o;
  }
  return r.prototype.next = function(t) {
    var n, o;
    (o = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || o === void 0 || o.call(n, t);
  }, r.prototype.error = function(t) {
    var n, o;
    (o = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || o === void 0 || o.call(n, t);
  }, r.prototype.complete = function() {
    var t, n;
    (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t);
  }, r.prototype._subscribe = function(t) {
    var n, o;
    return (o = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && o !== void 0 ? o : R;
  }, r;
}(P), z = function(e) {
  p(r, e);
  function r(t) {
    var n = e.call(this) || this;
    return n._value = t, n;
  }
  return Object.defineProperty(r.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), r.prototype._subscribe = function(t) {
    var n = e.prototype._subscribe.call(this, t);
    return !n.closed && t.next(this._value), n;
  }, r.prototype.getValue = function() {
    var t = this, n = t.hasError, o = t.thrownError, i = t._value;
    if (n)
      throw o;
    return this._throwIfClosed(), i;
  }, r.prototype.next = function(t) {
    e.prototype.next.call(this, this._value = t);
  }, r;
}(P);
class N extends P {
  set(r) {
    this.next(r);
  }
}
class tt extends z {
  set(r) {
    this.next(r);
  }
}
export {
  N as S,
  tt as a
};
