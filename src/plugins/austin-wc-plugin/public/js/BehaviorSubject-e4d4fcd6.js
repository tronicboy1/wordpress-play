var P = function(e, r) {
  return P = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n)
      Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, P(e, r);
};
function m(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
  P(e, r);
  function t() {
    this.constructor = e;
  }
  e.prototype = r === null ? Object.create(r) : (t.prototype = r.prototype, new t());
}
function N(e, r, t, n) {
  function i(o) {
    return o instanceof t ? o : new t(function(s) {
      s(o);
    });
  }
  return new (t || (t = Promise))(function(o, s) {
    function u(f) {
      try {
        c(n.next(f));
      } catch (y) {
        s(y);
      }
    }
    function a(f) {
      try {
        c(n.throw(f));
      } catch (y) {
        s(y);
      }
    }
    function c(f) {
      f.done ? o(f.value) : i(f.value).then(u, a);
    }
    c((n = n.apply(e, r || [])).next());
  });
}
function tt(e, r) {
  var t = { label: 0, sent: function() {
    if (o[0] & 1)
      throw o[1];
    return o[1];
  }, trys: [], ops: [] }, n, i, o, s;
  return s = { next: u(0), throw: u(1), return: u(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function u(c) {
    return function(f) {
      return a([c, f]);
    };
  }
  function a(c) {
    if (n)
      throw new TypeError("Generator is already executing.");
    for (; s && (s = 0, c[0] && (t = 0)), t; )
      try {
        if (n = 1, i && (o = c[0] & 2 ? i.return : c[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, c[1])).done)
          return o;
        switch (i = 0, o && (c = [c[0] & 2, o.value]), c[0]) {
          case 0:
          case 1:
            o = c;
            break;
          case 4:
            return t.label++, { value: c[1], done: !1 };
          case 5:
            t.label++, i = c[1], c = [0];
            continue;
          case 7:
            c = t.ops.pop(), t.trys.pop();
            continue;
          default:
            if (o = t.trys, !(o = o.length > 0 && o[o.length - 1]) && (c[0] === 6 || c[0] === 2)) {
              t = 0;
              continue;
            }
            if (c[0] === 3 && (!o || c[1] > o[0] && c[1] < o[3])) {
              t.label = c[1];
              break;
            }
            if (c[0] === 6 && t.label < o[1]) {
              t.label = o[1], o = c;
              break;
            }
            if (o && t.label < o[2]) {
              t.label = o[2], t.ops.push(c);
              break;
            }
            o[2] && t.ops.pop(), t.trys.pop();
            continue;
        }
        c = r.call(e, t);
      } catch (f) {
        c = [6, f], i = 0;
      } finally {
        n = o = 0;
      }
    if (c[0] & 5)
      throw c[1];
    return { value: c[0] ? c[1] : void 0, done: !0 };
  }
}
function d(e) {
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
function w(e, r) {
  var t = typeof Symbol == "function" && e[Symbol.iterator];
  if (!t)
    return e;
  var n = t.call(e), i, o = [], s;
  try {
    for (; (r === void 0 || r-- > 0) && !(i = n.next()).done; )
      o.push(i.value);
  } catch (u) {
    s = { error: u };
  } finally {
    try {
      i && !i.done && (t = n.return) && t.call(n);
    } finally {
      if (s)
        throw s.error;
    }
  }
  return o;
}
function g(e, r, t) {
  if (t || arguments.length === 2)
    for (var n = 0, i = r.length, o; n < i; n++)
      (o || !(n in r)) && (o || (o = Array.prototype.slice.call(r, 0, n)), o[n] = r[n]);
  return e.concat(o || Array.prototype.slice.call(r));
}
function j(e) {
  return this instanceof j ? (this.v = e, this) : new j(e);
}
function rt(e, r, t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = t.apply(e, r || []), i, o = [];
  return i = {}, s("next"), s("throw"), s("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function s(l) {
    n[l] && (i[l] = function(p) {
      return new Promise(function(b, h) {
        o.push([l, p, b, h]) > 1 || u(l, p);
      });
    });
  }
  function u(l, p) {
    try {
      a(n[l](p));
    } catch (b) {
      y(o[0][3], b);
    }
  }
  function a(l) {
    l.value instanceof j ? Promise.resolve(l.value.v).then(c, f) : y(o[0][2], l);
  }
  function c(l) {
    u("next", l);
  }
  function f(l) {
    u("throw", l);
  }
  function y(l, p) {
    l(p), o.shift(), o.length && u(o[0][0], o[0][1]);
  }
}
function et(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = e[Symbol.asyncIterator], t;
  return r ? r.call(e) : (e = typeof d == "function" ? d(e) : e[Symbol.iterator](), t = {}, n("next"), n("throw"), n("return"), t[Symbol.asyncIterator] = function() {
    return this;
  }, t);
  function n(o) {
    t[o] = e[o] && function(s) {
      return new Promise(function(u, a) {
        s = e[o](s), i(u, a, s.done, s.value);
      });
    };
  }
  function i(o, s, u, a) {
    Promise.resolve(a).then(function(c) {
      o({ value: c, done: u });
    }, s);
  }
}
function v(e) {
  return typeof e == "function";
}
function M(e) {
  var r = function(n) {
    Error.call(n), n.stack = new Error().stack;
  }, t = e(r);
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var x = M(function(e) {
  return function(t) {
    e(this), this.message = t ? t.length + ` errors occurred during unsubscription:
` + t.map(function(n, i) {
      return i + 1 + ") " + n.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = t;
  };
});
function T(e, r) {
  if (e) {
    var t = e.indexOf(r);
    0 <= t && e.splice(t, 1);
  }
}
var E = function() {
  function e(r) {
    this.initialTeardown = r, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return e.prototype.unsubscribe = function() {
    var r, t, n, i, o;
    if (!this.closed) {
      this.closed = !0;
      var s = this._parentage;
      if (s)
        if (this._parentage = null, Array.isArray(s))
          try {
            for (var u = d(s), a = u.next(); !a.done; a = u.next()) {
              var c = a.value;
              c.remove(this);
            }
          } catch (h) {
            r = { error: h };
          } finally {
            try {
              a && !a.done && (t = u.return) && t.call(u);
            } finally {
              if (r)
                throw r.error;
            }
          }
        else
          s.remove(this);
      var f = this.initialTeardown;
      if (v(f))
        try {
          f();
        } catch (h) {
          o = h instanceof x ? h.errors : [h];
        }
      var y = this._finalizers;
      if (y) {
        this._finalizers = null;
        try {
          for (var l = d(y), p = l.next(); !p.done; p = l.next()) {
            var b = p.value;
            try {
              C(b);
            } catch (h) {
              o = o ?? [], h instanceof x ? o = g(g([], w(o)), w(h.errors)) : o.push(h);
            }
          }
        } catch (h) {
          n = { error: h };
        } finally {
          try {
            p && !p.done && (i = l.return) && i.call(l);
          } finally {
            if (n)
              throw n.error;
          }
        }
      }
      if (o)
        throw new x(o);
    }
  }, e.prototype.add = function(r) {
    var t;
    if (r && r !== this)
      if (this.closed)
        C(r);
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
    t === r ? this._parentage = null : Array.isArray(t) && T(t, r);
  }, e.prototype.remove = function(r) {
    var t = this._finalizers;
    t && T(t, r), r instanceof e && r._removeParent(this);
  }, e.EMPTY = function() {
    var r = new e();
    return r.closed = !0, r;
  }(), e;
}(), R = E.EMPTY;
function V(e) {
  return e instanceof E || e && "closed" in e && v(e.remove) && v(e.add) && v(e.unsubscribe);
}
function C(e) {
  v(e) ? e() : e.unsubscribe();
}
var Y = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, I = {
  setTimeout: function(e, r) {
    for (var t = [], n = 2; n < arguments.length; n++)
      t[n - 2] = arguments[n];
    var i = I.delegate;
    return i != null && i.setTimeout ? i.setTimeout.apply(i, g([e, r], w(t))) : setTimeout.apply(void 0, g([e, r], w(t)));
  },
  clearTimeout: function(e) {
    var r = I.delegate;
    return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(e);
  },
  delegate: void 0
};
function H(e) {
  I.setTimeout(function() {
    throw e;
  });
}
function U() {
}
function _(e) {
  e();
}
var D = function(e) {
  m(r, e);
  function r(t) {
    var n = e.call(this) || this;
    return n.isStopped = !1, t ? (n.destination = t, V(t) && t.add(n)) : n.destination = L, n;
  }
  return r.create = function(t, n, i) {
    return new A(t, n, i);
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
}(E), q = Function.prototype.bind;
function O(e, r) {
  return q.call(e, r);
}
var J = function() {
  function e(r) {
    this.partialObserver = r;
  }
  return e.prototype.next = function(r) {
    var t = this.partialObserver;
    if (t.next)
      try {
        t.next(r);
      } catch (n) {
        S(n);
      }
  }, e.prototype.error = function(r) {
    var t = this.partialObserver;
    if (t.error)
      try {
        t.error(r);
      } catch (n) {
        S(n);
      }
    else
      S(r);
  }, e.prototype.complete = function() {
    var r = this.partialObserver;
    if (r.complete)
      try {
        r.complete();
      } catch (t) {
        S(t);
      }
  }, e;
}(), A = function(e) {
  m(r, e);
  function r(t, n, i) {
    var o = e.call(this) || this, s;
    if (v(t) || !t)
      s = {
        next: t ?? void 0,
        error: n ?? void 0,
        complete: i ?? void 0
      };
    else {
      var u;
      o && Y.useDeprecatedNextContext ? (u = Object.create(t), u.unsubscribe = function() {
        return o.unsubscribe();
      }, s = {
        next: t.next && O(t.next, u),
        error: t.error && O(t.error, u),
        complete: t.complete && O(t.complete, u)
      }) : s = t;
    }
    return o.destination = new J(s), o;
  }
  return r;
}(D);
function S(e) {
  H(e);
}
function K(e) {
  throw e;
}
var L = {
  closed: !0,
  next: U,
  error: K,
  complete: U
}, Q = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function W(e) {
  return e;
}
function X(e) {
  return e.length === 0 ? W : e.length === 1 ? e[0] : function(t) {
    return e.reduce(function(n, i) {
      return i(n);
    }, t);
  };
}
var k = function() {
  function e(r) {
    r && (this._subscribe = r);
  }
  return e.prototype.lift = function(r) {
    var t = new e();
    return t.source = this, t.operator = r, t;
  }, e.prototype.subscribe = function(r, t, n) {
    var i = this, o = $(r) ? r : new A(r, t, n);
    return _(function() {
      var s = i, u = s.operator, a = s.source;
      o.add(u ? u.call(o, a) : a ? i._subscribe(o) : i._trySubscribe(o));
    }), o;
  }, e.prototype._trySubscribe = function(r) {
    try {
      return this._subscribe(r);
    } catch (t) {
      r.error(t);
    }
  }, e.prototype.forEach = function(r, t) {
    var n = this;
    return t = F(t), new t(function(i, o) {
      var s = new A({
        next: function(u) {
          try {
            r(u);
          } catch (a) {
            o(a), s.unsubscribe();
          }
        },
        error: o,
        complete: i
      });
      n.subscribe(s);
    });
  }, e.prototype._subscribe = function(r) {
    var t;
    return (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(r);
  }, e.prototype[Q] = function() {
    return this;
  }, e.prototype.pipe = function() {
    for (var r = [], t = 0; t < arguments.length; t++)
      r[t] = arguments[t];
    return X(r)(this);
  }, e.prototype.toPromise = function(r) {
    var t = this;
    return r = F(r), new r(function(n, i) {
      var o;
      t.subscribe(function(s) {
        return o = s;
      }, function(s) {
        return i(s);
      }, function() {
        return n(o);
      });
    });
  }, e.create = function(r) {
    return new e(r);
  }, e;
}();
function F(e) {
  var r;
  return (r = e ?? Y.Promise) !== null && r !== void 0 ? r : Promise;
}
function Z(e) {
  return e && v(e.next) && v(e.error) && v(e.complete);
}
function $(e) {
  return e && e instanceof D || Z(e) && V(e);
}
var z = M(function(e) {
  return function() {
    e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), G = function(e) {
  m(r, e);
  function r() {
    var t = e.call(this) || this;
    return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
  }
  return r.prototype.lift = function(t) {
    var n = new B(this, this);
    return n.operator = t, n;
  }, r.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new z();
  }, r.prototype.next = function(t) {
    var n = this;
    _(function() {
      var i, o;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var s = d(n.currentObservers), u = s.next(); !u.done; u = s.next()) {
            var a = u.value;
            a.next(t);
          }
        } catch (c) {
          i = { error: c };
        } finally {
          try {
            u && !u.done && (o = s.return) && o.call(s);
          } finally {
            if (i)
              throw i.error;
          }
        }
      }
    });
  }, r.prototype.error = function(t) {
    var n = this;
    _(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.hasError = n.isStopped = !0, n.thrownError = t;
        for (var i = n.observers; i.length; )
          i.shift().error(t);
      }
    });
  }, r.prototype.complete = function() {
    var t = this;
    _(function() {
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
    var n = this, i = this, o = i.hasError, s = i.isStopped, u = i.observers;
    return o || s ? R : (this.currentObservers = null, u.push(t), new E(function() {
      n.currentObservers = null, T(u, t);
    }));
  }, r.prototype._checkFinalizedStatuses = function(t) {
    var n = this, i = n.hasError, o = n.thrownError, s = n.isStopped;
    i ? t.error(o) : s && t.complete();
  }, r.prototype.asObservable = function() {
    var t = new k();
    return t.source = this, t;
  }, r.create = function(t, n) {
    return new B(t, n);
  }, r;
}(k), B = function(e) {
  m(r, e);
  function r(t, n) {
    var i = e.call(this) || this;
    return i.destination = t, i.source = n, i;
  }
  return r.prototype.next = function(t) {
    var n, i;
    (i = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || i === void 0 || i.call(n, t);
  }, r.prototype.error = function(t) {
    var n, i;
    (i = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || i === void 0 || i.call(n, t);
  }, r.prototype.complete = function() {
    var t, n;
    (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t);
  }, r.prototype._subscribe = function(t) {
    var n, i;
    return (i = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && i !== void 0 ? i : R;
  }, r;
}(G), nt = function(e) {
  m(r, e);
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
    var t = this, n = t.hasError, i = t.thrownError, o = t._value;
    if (n)
      throw i;
    return this._throwIfClosed(), o;
  }, r.prototype.next = function(t) {
    e.prototype.next.call(this, this._value = t);
  }, r;
}(G);
export {
  nt as B,
  k as O,
  E as S,
  m as _,
  g as a,
  w as b,
  T as c,
  G as d,
  W as e,
  D as f,
  rt as g,
  tt as h,
  v as i,
  j,
  d as k,
  N as l,
  et as m,
  U as n,
  Q as o,
  H as r
};
