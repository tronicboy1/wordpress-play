var Y = function(t, e) {
  return Y = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var i in n)
      Object.prototype.hasOwnProperty.call(n, i) && (r[i] = n[i]);
  }, Y(t, e);
};
function S(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Y(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function fr(t, e, r, n) {
  function i(o) {
    return o instanceof r ? o : new r(function(u) {
      u(o);
    });
  }
  return new (r || (r = Promise))(function(o, u) {
    function s(f) {
      try {
        a(n.next(f));
      } catch (v) {
        u(v);
      }
    }
    function c(f) {
      try {
        a(n.throw(f));
      } catch (v) {
        u(v);
      }
    }
    function a(f) {
      f.done ? o(f.value) : i(f.value).then(s, c);
    }
    a((n = n.apply(t, e || [])).next());
  });
}
function N(t, e) {
  var r = { label: 0, sent: function() {
    if (o[0] & 1)
      throw o[1];
    return o[1];
  }, trys: [], ops: [] }, n, i, o, u;
  return u = { next: s(0), throw: s(1), return: s(2) }, typeof Symbol == "function" && (u[Symbol.iterator] = function() {
    return this;
  }), u;
  function s(a) {
    return function(f) {
      return c([a, f]);
    };
  }
  function c(a) {
    if (n)
      throw new TypeError("Generator is already executing.");
    for (; u && (u = 0, a[0] && (r = 0)), r; )
      try {
        if (n = 1, i && (o = a[0] & 2 ? i.return : a[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, a[1])).done)
          return o;
        switch (i = 0, o && (a = [a[0] & 2, o.value]), a[0]) {
          case 0:
          case 1:
            o = a;
            break;
          case 4:
            return r.label++, { value: a[1], done: !1 };
          case 5:
            r.label++, i = a[1], a = [0];
            continue;
          case 7:
            a = r.ops.pop(), r.trys.pop();
            continue;
          default:
            if (o = r.trys, !(o = o.length > 0 && o[o.length - 1]) && (a[0] === 6 || a[0] === 2)) {
              r = 0;
              continue;
            }
            if (a[0] === 3 && (!o || a[1] > o[0] && a[1] < o[3])) {
              r.label = a[1];
              break;
            }
            if (a[0] === 6 && r.label < o[1]) {
              r.label = o[1], o = a;
              break;
            }
            if (o && r.label < o[2]) {
              r.label = o[2], r.ops.push(a);
              break;
            }
            o[2] && r.ops.pop(), r.trys.pop();
            continue;
        }
        a = e.call(t, r);
      } catch (f) {
        a = [6, f], i = 0;
      } finally {
        n = o = 0;
      }
    if (a[0] & 5)
      throw a[1];
    return { value: a[0] ? a[1] : void 0, done: !0 };
  }
}
function _(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], n = 0;
  if (r)
    return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function() {
        return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
      }
    };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function m(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r)
    return t;
  var n = r.call(t), i, o = [], u;
  try {
    for (; (e === void 0 || e-- > 0) && !(i = n.next()).done; )
      o.push(i.value);
  } catch (s) {
    u = { error: s };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (u)
        throw u.error;
    }
  }
  return o;
}
function E(t, e, r) {
  if (r || arguments.length === 2)
    for (var n = 0, i = e.length, o; n < i; n++)
      (o || !(n in e)) && (o || (o = Array.prototype.slice.call(e, 0, n)), o[n] = e[n]);
  return t.concat(o || Array.prototype.slice.call(e));
}
function x(t) {
  return this instanceof x ? (this.v = t, this) : new x(t);
}
function lr(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []), i, o = [];
  return i = {}, u("next"), u("throw"), u("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function u(h) {
    n[h] && (i[h] = function(p) {
      return new Promise(function(b, d) {
        o.push([h, p, b, d]) > 1 || s(h, p);
      });
    });
  }
  function s(h, p) {
    try {
      c(n[h](p));
    } catch (b) {
      v(o[0][3], b);
    }
  }
  function c(h) {
    h.value instanceof x ? Promise.resolve(h.value.v).then(a, f) : v(o[0][2], h);
  }
  function a(h) {
    s("next", h);
  }
  function f(h) {
    s("throw", h);
  }
  function v(h, p) {
    h(p), o.shift(), o.length && s(o[0][0], o[0][1]);
  }
}
function hr(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator], r;
  return e ? e.call(t) : (t = typeof _ == "function" ? _(t) : t[Symbol.iterator](), r = {}, n("next"), n("throw"), n("return"), r[Symbol.asyncIterator] = function() {
    return this;
  }, r);
  function n(o) {
    r[o] = t[o] && function(u) {
      return new Promise(function(s, c) {
        u = t[o](u), i(s, c, u.done, u.value);
      });
    };
  }
  function i(o, u, s, c) {
    Promise.resolve(c).then(function(a) {
      o({ value: a, done: s });
    }, u);
  }
}
function l(t) {
  return typeof t == "function";
}
function rr(t) {
  var e = function(n) {
    Error.call(n), n.stack = new Error().stack;
  }, r = t(e);
  return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
}
var R = rr(function(t) {
  return function(r) {
    t(this), this.message = r ? r.length + ` errors occurred during unsubscription:
` + r.map(function(n, i) {
      return i + 1 + ") " + n.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = r;
  };
});
function U(t, e) {
  if (t) {
    var r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var O = function() {
  function t(e) {
    this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return t.prototype.unsubscribe = function() {
    var e, r, n, i, o;
    if (!this.closed) {
      this.closed = !0;
      var u = this._parentage;
      if (u)
        if (this._parentage = null, Array.isArray(u))
          try {
            for (var s = _(u), c = s.next(); !c.done; c = s.next()) {
              var a = c.value;
              a.remove(this);
            }
          } catch (d) {
            e = { error: d };
          } finally {
            try {
              c && !c.done && (r = s.return) && r.call(s);
            } finally {
              if (e)
                throw e.error;
            }
          }
        else
          u.remove(this);
      var f = this.initialTeardown;
      if (l(f))
        try {
          f();
        } catch (d) {
          o = d instanceof R ? d.errors : [d];
        }
      var v = this._finalizers;
      if (v) {
        this._finalizers = null;
        try {
          for (var h = _(v), p = h.next(); !p.done; p = h.next()) {
            var b = p.value;
            try {
              K(b);
            } catch (d) {
              o = o ?? [], d instanceof R ? o = E(E([], m(o)), m(d.errors)) : o.push(d);
            }
          }
        } catch (d) {
          n = { error: d };
        } finally {
          try {
            p && !p.done && (i = h.return) && i.call(h);
          } finally {
            if (n)
              throw n.error;
          }
        }
      }
      if (o)
        throw new R(o);
    }
  }, t.prototype.add = function(e) {
    var r;
    if (e && e !== this)
      if (this.closed)
        K(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this))
            return;
          e._addParent(this);
        }
        (this._finalizers = (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }, t.prototype._hasParent = function(e) {
    var r = this._parentage;
    return r === e || Array.isArray(r) && r.includes(e);
  }, t.prototype._addParent = function(e) {
    var r = this._parentage;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }, t.prototype._removeParent = function(e) {
    var r = this._parentage;
    r === e ? this._parentage = null : Array.isArray(r) && U(r, e);
  }, t.prototype.remove = function(e) {
    var r = this._finalizers;
    r && U(r, e), e instanceof t && e._removeParent(this);
  }, t.EMPTY = function() {
    var e = new t();
    return e.closed = !0, e;
  }(), t;
}(), tr = O.EMPTY;
function er(t) {
  return t instanceof O || t && "closed" in t && l(t.remove) && l(t.add) && l(t.unsubscribe);
}
function K(t) {
  l(t) ? t() : t.unsubscribe();
}
var I = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, j = {
  setTimeout: function(t, e) {
    for (var r = [], n = 2; n < arguments.length; n++)
      r[n - 2] = arguments[n];
    var i = j.delegate;
    return i != null && i.setTimeout ? i.setTimeout.apply(i, E([t, e], m(r))) : setTimeout.apply(void 0, E([t, e], m(r)));
  },
  clearTimeout: function(t) {
    var e = j.delegate;
    return ((e == null ? void 0 : e.clearTimeout) || clearTimeout)(t);
  },
  delegate: void 0
};
function nr(t) {
  j.setTimeout(function() {
    var e = I.onUnhandledError;
    if (e)
      e(t);
    else
      throw t;
  });
}
function M() {
}
var dr = function() {
  return G("C", void 0, void 0);
}();
function vr(t) {
  return G("E", void 0, t);
}
function pr(t) {
  return G("N", t, void 0);
}
function G(t, e, r) {
  return {
    kind: t,
    value: e,
    error: r
  };
}
var g = null;
function L(t) {
  if (I.useDeprecatedSynchronousErrorHandling) {
    var e = !g;
    if (e && (g = { errorThrown: !1, error: null }), t(), e) {
      var r = g, n = r.errorThrown, i = r.error;
      if (g = null, n)
        throw i;
    }
  } else
    t();
}
function yr(t) {
  I.useDeprecatedSynchronousErrorHandling && g && (g.errorThrown = !0, g.error = t);
}
var V = function(t) {
  S(e, t);
  function e(r) {
    var n = t.call(this) || this;
    return n.isStopped = !1, r ? (n.destination = r, er(r) && r.add(n)) : n.destination = Sr, n;
  }
  return e.create = function(r, n, i) {
    return new q(r, n, i);
  }, e.prototype.next = function(r) {
    this.isStopped ? H(pr(r), this) : this._next(r);
  }, e.prototype.error = function(r) {
    this.isStopped ? H(vr(r), this) : (this.isStopped = !0, this._error(r));
  }, e.prototype.complete = function() {
    this.isStopped ? H(dr, this) : (this.isStopped = !0, this._complete());
  }, e.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this), this.destination = null);
  }, e.prototype._next = function(r) {
    this.destination.next(r);
  }, e.prototype._error = function(r) {
    try {
      this.destination.error(r);
    } finally {
      this.unsubscribe();
    }
  }, e.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, e;
}(O), br = Function.prototype.bind;
function F(t, e) {
  return br.call(t, e);
}
var mr = function() {
  function t(e) {
    this.partialObserver = e;
  }
  return t.prototype.next = function(e) {
    var r = this.partialObserver;
    if (r.next)
      try {
        r.next(e);
      } catch (n) {
        C(n);
      }
  }, t.prototype.error = function(e) {
    var r = this.partialObserver;
    if (r.error)
      try {
        r.error(e);
      } catch (n) {
        C(n);
      }
    else
      C(e);
  }, t.prototype.complete = function() {
    var e = this.partialObserver;
    if (e.complete)
      try {
        e.complete();
      } catch (r) {
        C(r);
      }
  }, t;
}(), q = function(t) {
  S(e, t);
  function e(r, n, i) {
    var o = t.call(this) || this, u;
    if (l(r) || !r)
      u = {
        next: r ?? void 0,
        error: n ?? void 0,
        complete: i ?? void 0
      };
    else {
      var s;
      o && I.useDeprecatedNextContext ? (s = Object.create(r), s.unsubscribe = function() {
        return o.unsubscribe();
      }, u = {
        next: r.next && F(r.next, s),
        error: r.error && F(r.error, s),
        complete: r.complete && F(r.complete, s)
      }) : u = r;
    }
    return o.destination = new mr(u), o;
  }
  return e;
}(V);
function C(t) {
  I.useDeprecatedSynchronousErrorHandling ? yr(t) : nr(t);
}
function wr(t) {
  throw t;
}
function H(t, e) {
  var r = I.onStoppedNotification;
  r && j.setTimeout(function() {
    return r(t, e);
  });
}
var Sr = {
  closed: !0,
  next: M,
  error: wr,
  complete: M
}, J = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function gr(t) {
  return t;
}
function ct() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return ir(t);
}
function ir(t) {
  return t.length === 0 ? gr : t.length === 1 ? t[0] : function(r) {
    return t.reduce(function(n, i) {
      return i(n);
    }, r);
  };
}
var y = function() {
  function t(e) {
    e && (this._subscribe = e);
  }
  return t.prototype.lift = function(e) {
    var r = new t();
    return r.source = this, r.operator = e, r;
  }, t.prototype.subscribe = function(e, r, n) {
    var i = this, o = Ir(e) ? e : new q(e, r, n);
    return L(function() {
      var u = i, s = u.operator, c = u.source;
      o.add(s ? s.call(o, c) : c ? i._subscribe(o) : i._trySubscribe(o));
    }), o;
  }, t.prototype._trySubscribe = function(e) {
    try {
      return this._subscribe(e);
    } catch (r) {
      e.error(r);
    }
  }, t.prototype.forEach = function(e, r) {
    var n = this;
    return r = W(r), new r(function(i, o) {
      var u = new q({
        next: function(s) {
          try {
            e(s);
          } catch (c) {
            o(c), u.unsubscribe();
          }
        },
        error: o,
        complete: i
      });
      n.subscribe(u);
    });
  }, t.prototype._subscribe = function(e) {
    var r;
    return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(e);
  }, t.prototype[J] = function() {
    return this;
  }, t.prototype.pipe = function() {
    for (var e = [], r = 0; r < arguments.length; r++)
      e[r] = arguments[r];
    return ir(e)(this);
  }, t.prototype.toPromise = function(e) {
    var r = this;
    return e = W(e), new e(function(n, i) {
      var o;
      r.subscribe(function(u) {
        return o = u;
      }, function(u) {
        return i(u);
      }, function() {
        return n(o);
      });
    });
  }, t.create = function(e) {
    return new t(e);
  }, t;
}();
function W(t) {
  var e;
  return (e = t ?? I.Promise) !== null && e !== void 0 ? e : Promise;
}
function Er(t) {
  return t && l(t.next) && l(t.error) && l(t.complete);
}
function Ir(t) {
  return t && t instanceof V || Er(t) && er(t);
}
function xr(t) {
  return l(t == null ? void 0 : t.lift);
}
function P(t) {
  return function(e) {
    if (xr(e))
      return e.lift(function(r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function w(t, e, r, n, i) {
  return new _r(t, e, r, n, i);
}
var _r = function(t) {
  S(e, t);
  function e(r, n, i, o, u, s) {
    var c = t.call(this, r) || this;
    return c.onFinalize = u, c.shouldUnsubscribe = s, c._next = n ? function(a) {
      try {
        n(a);
      } catch (f) {
        r.error(f);
      }
    } : t.prototype._next, c._error = o ? function(a) {
      try {
        o(a);
      } catch (f) {
        r.error(f);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, c._complete = i ? function() {
      try {
        i();
      } catch (a) {
        r.error(a);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._complete, c;
  }
  return e.prototype.unsubscribe = function() {
    var r;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var n = this.closed;
      t.prototype.unsubscribe.call(this), !n && ((r = this.onFinalize) === null || r === void 0 || r.call(this));
    }
  }, e;
}(V), Ar = rr(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), Tr = function(t) {
  S(e, t);
  function e() {
    var r = t.call(this) || this;
    return r.closed = !1, r.currentObservers = null, r.observers = [], r.isStopped = !1, r.hasError = !1, r.thrownError = null, r;
  }
  return e.prototype.lift = function(r) {
    var n = new X(this, this);
    return n.operator = r, n;
  }, e.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new Ar();
  }, e.prototype.next = function(r) {
    var n = this;
    L(function() {
      var i, o;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var u = _(n.currentObservers), s = u.next(); !s.done; s = u.next()) {
            var c = s.value;
            c.next(r);
          }
        } catch (a) {
          i = { error: a };
        } finally {
          try {
            s && !s.done && (o = u.return) && o.call(u);
          } finally {
            if (i)
              throw i.error;
          }
        }
      }
    });
  }, e.prototype.error = function(r) {
    var n = this;
    L(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.hasError = n.isStopped = !0, n.thrownError = r;
        for (var i = n.observers; i.length; )
          i.shift().error(r);
      }
    });
  }, e.prototype.complete = function() {
    var r = this;
    L(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.isStopped = !0;
        for (var n = r.observers; n.length; )
          n.shift().complete();
      }
    });
  }, e.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(e.prototype, "observed", {
    get: function() {
      var r;
      return ((r = this.observers) === null || r === void 0 ? void 0 : r.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._trySubscribe = function(r) {
    return this._throwIfClosed(), t.prototype._trySubscribe.call(this, r);
  }, e.prototype._subscribe = function(r) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(r), this._innerSubscribe(r);
  }, e.prototype._innerSubscribe = function(r) {
    var n = this, i = this, o = i.hasError, u = i.isStopped, s = i.observers;
    return o || u ? tr : (this.currentObservers = null, s.push(r), new O(function() {
      n.currentObservers = null, U(s, r);
    }));
  }, e.prototype._checkFinalizedStatuses = function(r) {
    var n = this, i = n.hasError, o = n.thrownError, u = n.isStopped;
    i ? r.error(o) : u && r.complete();
  }, e.prototype.asObservable = function() {
    var r = new y();
    return r.source = this, r;
  }, e.create = function(r, n) {
    return new X(r, n);
  }, e;
}(y), X = function(t) {
  S(e, t);
  function e(r, n) {
    var i = t.call(this) || this;
    return i.destination = r, i.source = n, i;
  }
  return e.prototype.next = function(r) {
    var n, i;
    (i = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || i === void 0 || i.call(n, r);
  }, e.prototype.error = function(r) {
    var n, i;
    (i = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || i === void 0 || i.call(n, r);
  }, e.prototype.complete = function() {
    var r, n;
    (n = (r = this.destination) === null || r === void 0 ? void 0 : r.complete) === null || n === void 0 || n.call(r);
  }, e.prototype._subscribe = function(r) {
    var n, i;
    return (i = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(r)) !== null && i !== void 0 ? i : tr;
  }, e;
}(Tr), or = {
  now: function() {
    return (or.delegate || Date).now();
  },
  delegate: void 0
}, Or = function(t) {
  S(e, t);
  function e(r, n) {
    return t.call(this) || this;
  }
  return e.prototype.schedule = function(r, n) {
    return this;
  }, e;
}(O), D = {
  setInterval: function(t, e) {
    for (var r = [], n = 2; n < arguments.length; n++)
      r[n - 2] = arguments[n];
    var i = D.delegate;
    return i != null && i.setInterval ? i.setInterval.apply(i, E([t, e], m(r))) : setInterval.apply(void 0, E([t, e], m(r)));
  },
  clearInterval: function(t) {
    var e = D.delegate;
    return ((e == null ? void 0 : e.clearInterval) || clearInterval)(t);
  },
  delegate: void 0
}, Pr = function(t) {
  S(e, t);
  function e(r, n) {
    var i = t.call(this, r, n) || this;
    return i.scheduler = r, i.work = n, i.pending = !1, i;
  }
  return e.prototype.schedule = function(r, n) {
    var i;
    if (n === void 0 && (n = 0), this.closed)
      return this;
    this.state = r;
    var o = this.id, u = this.scheduler;
    return o != null && (this.id = this.recycleAsyncId(u, o, n)), this.pending = !0, this.delay = n, this.id = (i = this.id) !== null && i !== void 0 ? i : this.requestAsyncId(u, this.id, n), this;
  }, e.prototype.requestAsyncId = function(r, n, i) {
    return i === void 0 && (i = 0), D.setInterval(r.flush.bind(r, this), i);
  }, e.prototype.recycleAsyncId = function(r, n, i) {
    if (i === void 0 && (i = 0), i != null && this.delay === i && this.pending === !1)
      return n;
    n != null && D.clearInterval(n);
  }, e.prototype.execute = function(r, n) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var i = this._execute(r, n);
    if (i)
      return i;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, e.prototype._execute = function(r, n) {
    var i = !1, o;
    try {
      this.work(r);
    } catch (u) {
      i = !0, o = u || new Error("Scheduled action threw falsy error");
    }
    if (i)
      return this.unsubscribe(), o;
  }, e.prototype.unsubscribe = function() {
    if (!this.closed) {
      var r = this, n = r.id, i = r.scheduler, o = i.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, U(o, this), n != null && (this.id = this.recycleAsyncId(i, n, null)), this.delay = null, t.prototype.unsubscribe.call(this);
    }
  }, e;
}(Or), Z = function() {
  function t(e, r) {
    r === void 0 && (r = t.now), this.schedulerActionCtor = e, this.now = r;
  }
  return t.prototype.schedule = function(e, r, n) {
    return r === void 0 && (r = 0), new this.schedulerActionCtor(this, e).schedule(n, r);
  }, t.now = or.now, t;
}(), kr = function(t) {
  S(e, t);
  function e(r, n) {
    n === void 0 && (n = Z.now);
    var i = t.call(this, r, n) || this;
    return i.actions = [], i._active = !1, i;
  }
  return e.prototype.flush = function(r) {
    var n = this.actions;
    if (this._active) {
      n.push(r);
      return;
    }
    var i;
    this._active = !0;
    do
      if (i = r.execute(r.state, r.delay))
        break;
    while (r = n.shift());
    if (this._active = !1, i) {
      for (; r = n.shift(); )
        r.unsubscribe();
      throw i;
    }
  }, e;
}(Z), Q = new kr(Pr), Cr = Q;
function Lr(t) {
  return t && l(t.schedule);
}
var ur = function(t) {
  return t && typeof t.length == "number" && typeof t != "function";
};
function Ur(t) {
  return l(t == null ? void 0 : t.then);
}
function jr(t) {
  return l(t[J]);
}
function Mr(t) {
  return Symbol.asyncIterator && l(t == null ? void 0 : t[Symbol.asyncIterator]);
}
function Dr(t) {
  return new TypeError("You provided " + (t !== null && typeof t == "object" ? "an invalid object" : "'" + t + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Rr() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var Fr = Rr();
function Hr(t) {
  return l(t == null ? void 0 : t[Fr]);
}
function Yr(t) {
  return lr(this, arguments, function() {
    var r, n, i, o;
    return N(this, function(u) {
      switch (u.label) {
        case 0:
          r = t.getReader(), u.label = 1;
        case 1:
          u.trys.push([1, , 9, 10]), u.label = 2;
        case 2:
          return [4, x(r.read())];
        case 3:
          return n = u.sent(), i = n.value, o = n.done, o ? [4, x(void 0)] : [3, 5];
        case 4:
          return [2, u.sent()];
        case 5:
          return [4, x(i)];
        case 6:
          return [4, u.sent()];
        case 7:
          return u.sent(), [3, 2];
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
function qr(t) {
  return l(t == null ? void 0 : t.getReader);
}
function A(t) {
  if (t instanceof y)
    return t;
  if (t != null) {
    if (jr(t))
      return Gr(t);
    if (ur(t))
      return Vr(t);
    if (Ur(t))
      return Jr(t);
    if (Mr(t))
      return sr(t);
    if (Hr(t))
      return Qr(t);
    if (qr(t))
      return Br(t);
  }
  throw Dr(t);
}
function Gr(t) {
  return new y(function(e) {
    var r = t[J]();
    if (l(r.subscribe))
      return r.subscribe(e);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function Vr(t) {
  return new y(function(e) {
    for (var r = 0; r < t.length && !e.closed; r++)
      e.next(t[r]);
    e.complete();
  });
}
function Jr(t) {
  return new y(function(e) {
    t.then(function(r) {
      e.closed || (e.next(r), e.complete());
    }, function(r) {
      return e.error(r);
    }).then(null, nr);
  });
}
function Qr(t) {
  return new y(function(e) {
    var r, n;
    try {
      for (var i = _(t), o = i.next(); !o.done; o = i.next()) {
        var u = o.value;
        if (e.next(u), e.closed)
          return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        o && !o.done && (n = i.return) && n.call(i);
      } finally {
        if (r)
          throw r.error;
      }
    }
    e.complete();
  });
}
function sr(t) {
  return new y(function(e) {
    Kr(t, e).catch(function(r) {
      return e.error(r);
    });
  });
}
function Br(t) {
  return sr(Yr(t));
}
function Kr(t, e) {
  var r, n, i, o;
  return fr(this, void 0, void 0, function() {
    var u, s;
    return N(this, function(c) {
      switch (c.label) {
        case 0:
          c.trys.push([0, 5, 6, 11]), r = hr(t), c.label = 1;
        case 1:
          return [4, r.next()];
        case 2:
          if (n = c.sent(), !!n.done)
            return [3, 4];
          if (u = n.value, e.next(u), e.closed)
            return [2];
          c.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return s = c.sent(), i = { error: s }, [3, 11];
        case 6:
          return c.trys.push([6, , 9, 10]), n && !n.done && (o = r.return) ? [4, o.call(r)] : [3, 8];
        case 7:
          c.sent(), c.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (i)
            throw i.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return e.complete(), [2];
      }
    });
  });
}
function Wr(t, e, r, n, i) {
  n === void 0 && (n = 0), i === void 0 && (i = !1);
  var o = e.schedule(function() {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if (t.add(o), !i)
    return o;
}
function Xr(t) {
  return t instanceof Date && !isNaN(t);
}
function ar(t, e) {
  return P(function(r, n) {
    var i = 0;
    r.subscribe(w(n, function(o) {
      n.next(t.call(e, o, i++));
    }));
  });
}
var Zr = Array.isArray;
function $r(t, e) {
  return Zr(e) ? t.apply(void 0, E([], m(e))) : t(e);
}
function zr(t) {
  return ar(function(e) {
    return $r(t, e);
  });
}
function Nr(t, e, r, n, i, o, u, s) {
  var c = [], a = 0, f = 0, v = !1, h = function() {
    v && !c.length && !a && e.complete();
  }, p = function(d) {
    return a < n ? b(d) : c.push(d);
  }, b = function(d) {
    o && e.next(d), a++;
    var B = !1;
    A(r(d, f++)).subscribe(w(e, function(T) {
      i == null || i(T), o ? p(T) : e.next(T);
    }, function() {
      B = !0;
    }, void 0, function() {
      if (B)
        try {
          a--;
          for (var T = function() {
            var k = c.shift();
            u ? Wr(e, u, function() {
              return b(k);
            }) : b(k);
          }; c.length && a < n; )
            T();
          h();
        } catch (k) {
          e.error(k);
        }
    }));
  };
  return t.subscribe(w(e, p, function() {
    v = !0, h();
  })), function() {
    s == null || s();
  };
}
function cr(t, e, r) {
  return r === void 0 && (r = 1 / 0), l(e) ? cr(function(n, i) {
    return ar(function(o, u) {
      return e(n, o, i, u);
    })(A(t(n, i)));
  }, r) : (typeof e == "number" && (r = e), P(function(n, i) {
    return Nr(n, i, t, r);
  }));
}
var rt = ["addListener", "removeListener"], tt = ["addEventListener", "removeEventListener"], et = ["on", "off"];
function $(t, e, r, n) {
  if (l(r) && (n = r, r = void 0), n)
    return $(t, e, r).pipe(zr(n));
  var i = m(ot(t) ? tt.map(function(s) {
    return function(c) {
      return t[s](e, c, r);
    };
  }) : nt(t) ? rt.map(z(t, e)) : it(t) ? et.map(z(t, e)) : [], 2), o = i[0], u = i[1];
  if (!o && ur(t))
    return cr(function(s) {
      return $(s, e, r);
    })(A(t));
  if (!o)
    throw new TypeError("Invalid event target");
  return new y(function(s) {
    var c = function() {
      for (var a = [], f = 0; f < arguments.length; f++)
        a[f] = arguments[f];
      return s.next(1 < a.length ? a : a[0]);
    };
    return o(c), function() {
      return u(c);
    };
  });
}
function z(t, e) {
  return function(r) {
    return function(n) {
      return t[r](e, n);
    };
  };
}
function nt(t) {
  return l(t.addListener) && l(t.removeListener);
}
function it(t) {
  return l(t.on) && l(t.off);
}
function ot(t) {
  return l(t.addEventListener) && l(t.removeEventListener);
}
function ut(t, e, r) {
  t === void 0 && (t = 0), r === void 0 && (r = Cr);
  var n = -1;
  return e != null && (Lr(e) ? r = e : n = e), new y(function(i) {
    var o = Xr(t) ? +t - r.now() : t;
    o < 0 && (o = 0);
    var u = 0;
    return r.schedule(function() {
      i.closed || (i.next(u++), 0 <= n ? this.schedule(void 0, n) : i.complete());
    }, o);
  });
}
function st(t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Q), t < 0 && (t = 0), ut(t, t, e);
}
function at(t) {
  return P(function(e, r) {
    var n = !1, i = null;
    e.subscribe(w(r, function(o) {
      n = !0, i = o;
    })), A(t).subscribe(w(r, function() {
      if (n) {
        n = !1;
        var o = i;
        i = null, r.next(o);
      }
    }, M));
  });
}
function ft(t, e) {
  return e === void 0 && (e = Q), at(st(t, e));
}
function lt(t, e) {
  return P(function(r, n) {
    var i = null, o = 0, u = !1, s = function() {
      return u && !i && n.complete();
    };
    r.subscribe(w(n, function(c) {
      i == null || i.unsubscribe();
      var a = 0, f = o++;
      A(t(c, f)).subscribe(i = w(n, function(v) {
        return n.next(e ? e(c, v, f, a++) : v);
      }, function() {
        i = null, s();
      }));
    }, function() {
      u = !0, s();
    }));
  });
}
function ht(t) {
  return P(function(e, r) {
    A(t).subscribe(w(r, function() {
      return r.complete();
    }, M)), !r.closed && e.subscribe(r);
  });
}
export {
  at as $,
  Pr as A,
  Dr as B,
  rr as C,
  q as D,
  Xr as E,
  Q as F,
  zr as G,
  gr as H,
  N as I,
  M as J,
  _r as K,
  ut as L,
  _ as M,
  U as N,
  y as O,
  ct as P,
  Nr as Q,
  Cr as R,
  Tr as S,
  Ar as T,
  Z as U,
  V,
  R as W,
  I as X,
  st as Y,
  J as Z,
  S as _,
  lt as a,
  cr as b,
  w as c,
  O as d,
  E as e,
  $ as f,
  m as g,
  xr as h,
  or as i,
  kr as j,
  l as k,
  Lr as l,
  ar as m,
  Wr as n,
  P as o,
  A as p,
  Fr as q,
  Yr as r,
  ft as s,
  ht as t,
  jr as u,
  ur as v,
  Ur as w,
  Mr as x,
  Hr as y,
  qr as z
};
