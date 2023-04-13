var E = function(r, e) {
  return E = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var o in i)
      Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o]);
  }, E(r, e);
};
function k(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  E(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function W(r, e, t, i) {
  function o(n) {
    return n instanceof t ? n : new t(function(u) {
      u(n);
    });
  }
  return new (t || (t = Promise))(function(n, u) {
    function c(f) {
      try {
        s(i.next(f));
      } catch (y) {
        u(y);
      }
    }
    function l(f) {
      try {
        s(i.throw(f));
      } catch (y) {
        u(y);
      }
    }
    function s(f) {
      f.done ? n(f.value) : o(f.value).then(c, l);
    }
    s((i = i.apply(r, e || [])).next());
  });
}
function X(r, e) {
  var t = { label: 0, sent: function() {
    if (n[0] & 1)
      throw n[1];
    return n[1];
  }, trys: [], ops: [] }, i, o, n, u;
  return u = { next: c(0), throw: c(1), return: c(2) }, typeof Symbol == "function" && (u[Symbol.iterator] = function() {
    return this;
  }), u;
  function c(s) {
    return function(f) {
      return l([s, f]);
    };
  }
  function l(s) {
    if (i)
      throw new TypeError("Generator is already executing.");
    for (; u && (u = 0, s[0] && (t = 0)), t; )
      try {
        if (i = 1, o && (n = s[0] & 2 ? o.return : s[0] ? o.throw || ((n = o.return) && n.call(o), 0) : o.next) && !(n = n.call(o, s[1])).done)
          return n;
        switch (o = 0, n && (s = [s[0] & 2, n.value]), s[0]) {
          case 0:
          case 1:
            n = s;
            break;
          case 4:
            return t.label++, { value: s[1], done: !1 };
          case 5:
            t.label++, o = s[1], s = [0];
            continue;
          case 7:
            s = t.ops.pop(), t.trys.pop();
            continue;
          default:
            if (n = t.trys, !(n = n.length > 0 && n[n.length - 1]) && (s[0] === 6 || s[0] === 2)) {
              t = 0;
              continue;
            }
            if (s[0] === 3 && (!n || s[1] > n[0] && s[1] < n[3])) {
              t.label = s[1];
              break;
            }
            if (s[0] === 6 && t.label < n[1]) {
              t.label = n[1], n = s;
              break;
            }
            if (n && t.label < n[2]) {
              t.label = n[2], t.ops.push(s);
              break;
            }
            n[2] && t.ops.pop(), t.trys.pop();
            continue;
        }
        s = e.call(r, t);
      } catch (f) {
        s = [6, f], o = 0;
      } finally {
        i = n = 0;
      }
    if (s[0] & 5)
      throw s[1];
    return { value: s[0] ? s[1] : void 0, done: !0 };
  }
}
function m(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], i = 0;
  if (t)
    return t.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && i >= r.length && (r = void 0), { value: r && r[i++], done: !r };
      }
    };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function S(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t)
    return r;
  var i = t.call(r), o, n = [], u;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = i.next()).done; )
      n.push(o.value);
  } catch (c) {
    u = { error: c };
  } finally {
    try {
      o && !o.done && (t = i.return) && t.call(i);
    } finally {
      if (u)
        throw u.error;
    }
  }
  return n;
}
function w(r, e, t) {
  if (t || arguments.length === 2)
    for (var i = 0, o = e.length, n; i < o; i++)
      (n || !(i in e)) && (n || (n = Array.prototype.slice.call(e, 0, i)), n[i] = e[i]);
  return r.concat(n || Array.prototype.slice.call(e));
}
function P(r) {
  return this instanceof P ? (this.v = r, this) : new P(r);
}
function Z(r, e, t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var i = t.apply(r, e || []), o, n = [];
  return o = {}, u("next"), u("throw"), u("return"), o[Symbol.asyncIterator] = function() {
    return this;
  }, o;
  function u(a) {
    i[a] && (o[a] = function(p) {
      return new Promise(function(b, h) {
        n.push([a, p, b, h]) > 1 || c(a, p);
      });
    });
  }
  function c(a, p) {
    try {
      l(i[a](p));
    } catch (b) {
      y(n[0][3], b);
    }
  }
  function l(a) {
    a.value instanceof P ? Promise.resolve(a.value.v).then(s, f) : y(n[0][2], a);
  }
  function s(a) {
    c("next", a);
  }
  function f(a) {
    c("throw", a);
  }
  function y(a, p) {
    a(p), n.shift(), n.length && c(n[0][0], n[0][1]);
  }
}
function $(r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = r[Symbol.asyncIterator], t;
  return e ? e.call(r) : (r = typeof m == "function" ? m(r) : r[Symbol.iterator](), t = {}, i("next"), i("throw"), i("return"), t[Symbol.asyncIterator] = function() {
    return this;
  }, t);
  function i(n) {
    t[n] = r[n] && function(u) {
      return new Promise(function(c, l) {
        u = r[n](u), o(c, l, u.done, u.value);
      });
    };
  }
  function o(n, u, c, l) {
    Promise.resolve(l).then(function(s) {
      n({ value: s, done: c });
    }, u);
  }
}
function d(r) {
  return typeof r == "function";
}
function Y(r) {
  var e = function(i) {
    Error.call(i), i.stack = new Error().stack;
  }, t = r(e);
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var _ = Y(function(r) {
  return function(t) {
    r(this), this.message = t ? t.length + ` errors occurred during unsubscription:
` + t.map(function(i, o) {
      return o + 1 + ") " + i.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = t;
  };
});
function O(r, e) {
  if (r) {
    var t = r.indexOf(e);
    0 <= t && r.splice(t, 1);
  }
}
var A = function() {
  function r(e) {
    this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return r.prototype.unsubscribe = function() {
    var e, t, i, o, n;
    if (!this.closed) {
      this.closed = !0;
      var u = this._parentage;
      if (u)
        if (this._parentage = null, Array.isArray(u))
          try {
            for (var c = m(u), l = c.next(); !l.done; l = c.next()) {
              var s = l.value;
              s.remove(this);
            }
          } catch (h) {
            e = { error: h };
          } finally {
            try {
              l && !l.done && (t = c.return) && t.call(c);
            } finally {
              if (e)
                throw e.error;
            }
          }
        else
          u.remove(this);
      var f = this.initialTeardown;
      if (d(f))
        try {
          f();
        } catch (h) {
          n = h instanceof _ ? h.errors : [h];
        }
      var y = this._finalizers;
      if (y) {
        this._finalizers = null;
        try {
          for (var a = m(y), p = a.next(); !p.done; p = a.next()) {
            var b = p.value;
            try {
              I(b);
            } catch (h) {
              n = n ?? [], h instanceof _ ? n = w(w([], S(n)), S(h.errors)) : n.push(h);
            }
          }
        } catch (h) {
          i = { error: h };
        } finally {
          try {
            p && !p.done && (o = a.return) && o.call(a);
          } finally {
            if (i)
              throw i.error;
          }
        }
      }
      if (n)
        throw new _(n);
    }
  }, r.prototype.add = function(e) {
    var t;
    if (e && e !== this)
      if (this.closed)
        I(e);
      else {
        if (e instanceof r) {
          if (e.closed || e._hasParent(this))
            return;
          e._addParent(this);
        }
        (this._finalizers = (t = this._finalizers) !== null && t !== void 0 ? t : []).push(e);
      }
  }, r.prototype._hasParent = function(e) {
    var t = this._parentage;
    return t === e || Array.isArray(t) && t.includes(e);
  }, r.prototype._addParent = function(e) {
    var t = this._parentage;
    this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
  }, r.prototype._removeParent = function(e) {
    var t = this._parentage;
    t === e ? this._parentage = null : Array.isArray(t) && O(t, e);
  }, r.prototype.remove = function(e) {
    var t = this._finalizers;
    t && O(t, e), e instanceof r && e._removeParent(this);
  }, r.EMPTY = function() {
    var e = new r();
    return e.closed = !0, e;
  }(), r;
}(), z = A.EMPTY;
function F(r) {
  return r instanceof A || r && "closed" in r && d(r.remove) && d(r.add) && d(r.unsubscribe);
}
function I(r) {
  d(r) ? r() : r.unsubscribe();
}
var M = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, x = {
  setTimeout: function(r, e) {
    for (var t = [], i = 2; i < arguments.length; i++)
      t[i - 2] = arguments[i];
    var o = x.delegate;
    return o != null && o.setTimeout ? o.setTimeout.apply(o, w([r, e], S(t))) : setTimeout.apply(void 0, w([r, e], S(t)));
  },
  clearTimeout: function(r) {
    var e = x.delegate;
    return ((e == null ? void 0 : e.clearTimeout) || clearTimeout)(r);
  },
  delegate: void 0
};
function C(r) {
  x.setTimeout(function() {
    throw r;
  });
}
function j() {
}
function D(r) {
  r();
}
var R = function(r) {
  k(e, r);
  function e(t) {
    var i = r.call(this) || this;
    return i.isStopped = !1, t ? (i.destination = t, F(t) && t.add(i)) : i.destination = V, i;
  }
  return e.create = function(t, i, o) {
    return new T(t, i, o);
  }, e.prototype.next = function(t) {
    this.isStopped || this._next(t);
  }, e.prototype.error = function(t) {
    this.isStopped || (this.isStopped = !0, this._error(t));
  }, e.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, e.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, r.prototype.unsubscribe.call(this), this.destination = null);
  }, e.prototype._next = function(t) {
    this.destination.next(t);
  }, e.prototype._error = function(t) {
    try {
      this.destination.error(t);
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
}(A), B = Function.prototype.bind;
function g(r, e) {
  return B.call(r, e);
}
var G = function() {
  function r(e) {
    this.partialObserver = e;
  }
  return r.prototype.next = function(e) {
    var t = this.partialObserver;
    if (t.next)
      try {
        t.next(e);
      } catch (i) {
        v(i);
      }
  }, r.prototype.error = function(e) {
    var t = this.partialObserver;
    if (t.error)
      try {
        t.error(e);
      } catch (i) {
        v(i);
      }
    else
      v(e);
  }, r.prototype.complete = function() {
    var e = this.partialObserver;
    if (e.complete)
      try {
        e.complete();
      } catch (t) {
        v(t);
      }
  }, r;
}(), T = function(r) {
  k(e, r);
  function e(t, i, o) {
    var n = r.call(this) || this, u;
    if (d(t) || !t)
      u = {
        next: t ?? void 0,
        error: i ?? void 0,
        complete: o ?? void 0
      };
    else {
      var c;
      n && M.useDeprecatedNextContext ? (c = Object.create(t), c.unsubscribe = function() {
        return n.unsubscribe();
      }, u = {
        next: t.next && g(t.next, c),
        error: t.error && g(t.error, c),
        complete: t.complete && g(t.complete, c)
      }) : u = t;
    }
    return n.destination = new G(u), n;
  }
  return e;
}(R);
function v(r) {
  C(r);
}
function H(r) {
  throw r;
}
var V = {
  closed: !0,
  next: j,
  error: H,
  complete: j
}, q = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function J(r) {
  return r;
}
function K(r) {
  return r.length === 0 ? J : r.length === 1 ? r[0] : function(t) {
    return r.reduce(function(i, o) {
      return o(i);
    }, t);
  };
}
var N = function() {
  function r(e) {
    e && (this._subscribe = e);
  }
  return r.prototype.lift = function(e) {
    var t = new r();
    return t.source = this, t.operator = e, t;
  }, r.prototype.subscribe = function(e, t, i) {
    var o = this, n = Q(e) ? e : new T(e, t, i);
    return D(function() {
      var u = o, c = u.operator, l = u.source;
      n.add(c ? c.call(n, l) : l ? o._subscribe(n) : o._trySubscribe(n));
    }), n;
  }, r.prototype._trySubscribe = function(e) {
    try {
      return this._subscribe(e);
    } catch (t) {
      e.error(t);
    }
  }, r.prototype.forEach = function(e, t) {
    var i = this;
    return t = U(t), new t(function(o, n) {
      var u = new T({
        next: function(c) {
          try {
            e(c);
          } catch (l) {
            n(l), u.unsubscribe();
          }
        },
        error: n,
        complete: o
      });
      i.subscribe(u);
    });
  }, r.prototype._subscribe = function(e) {
    var t;
    return (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(e);
  }, r.prototype[q] = function() {
    return this;
  }, r.prototype.pipe = function() {
    for (var e = [], t = 0; t < arguments.length; t++)
      e[t] = arguments[t];
    return K(e)(this);
  }, r.prototype.toPromise = function(e) {
    var t = this;
    return e = U(e), new e(function(i, o) {
      var n;
      t.subscribe(function(u) {
        return n = u;
      }, function(u) {
        return o(u);
      }, function() {
        return i(n);
      });
    });
  }, r.create = function(e) {
    return new r(e);
  }, r;
}();
function U(r) {
  var e;
  return (e = r ?? M.Promise) !== null && e !== void 0 ? e : Promise;
}
function L(r) {
  return r && d(r.next) && d(r.error) && d(r.complete);
}
function Q(r) {
  return r && r instanceof R || L(r) && F(r);
}
export {
  z as E,
  N as O,
  R as S,
  k as _,
  Z as a,
  X as b,
  P as c,
  m as d,
  W as e,
  $ as f,
  Y as g,
  A as h,
  d as i,
  O as j,
  D as k,
  w as l,
  S as m,
  j as n,
  q as o,
  C as r
};
