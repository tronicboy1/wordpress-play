import { S as Qt, i as Yt, a as Zt, b as z, s as Jt, e as an, c as Ln, j as Xt, n as wn, k as _t, l as Un, m as Ht, o as Yn, h as Q, p as Dn, q as ne, t as te, d as zn, g as ee } from "./index-6f88ea70.js";
import { o as m, c as v, _ as R, h as re, d as W, O as x, e as S, g as I, S as E, i as Zn, A as cn, j as sn, k as T, l as Tn, n as C, p as w, q as ue, r as ie, u as oe, v as ae, w as fe, x as le, y as ce, z as se, B as ve, C as nn, D as jn, E as Jn, F as q, G as Z, H as j, b as k, I as de, J as F, K as Xn, L as J, M as O, N as tn, P as Fn, m as en, Q as _n, a as Y, R as Hn, T as he, U as me, V as pe, W as ge, X as ye, f as we, Y as be, Z as xe, $ as Ae, s as nt, t as tt } from "./takeUntil-f112e689.js";
function et() {
  return m(function(t, n) {
    var e = null;
    t._refCount++;
    var r = v(n, void 0, void 0, void 0, function() {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        e = null;
        return;
      }
      var u = t._connection, i = e;
      e = null, u && (!i || u === i) && u.unsubscribe(), n.unsubscribe();
    });
    t.subscribe(r), r.closed || (e = t.connect());
  });
}
var vn = function(t) {
  R(n, t);
  function n(e, r) {
    var u = t.call(this) || this;
    return u.source = e, u.subjectFactory = r, u._subject = null, u._refCount = 0, u._connection = null, re(e) && (u.lift = e.lift), u;
  }
  return n.prototype._subscribe = function(e) {
    return this.getSubject().subscribe(e);
  }, n.prototype.getSubject = function() {
    var e = this._subject;
    return (!e || e.isStopped) && (this._subject = this.subjectFactory()), this._subject;
  }, n.prototype._teardown = function() {
    this._refCount = 0;
    var e = this._connection;
    this._subject = this._connection = null, e == null || e.unsubscribe();
  }, n.prototype.connect = function() {
    var e = this, r = this._connection;
    if (!r) {
      r = this._connection = new W();
      var u = this.getSubject();
      r.add(this.source.subscribe(v(u, void 0, function() {
        e._teardown(), u.complete();
      }, function(i) {
        e._teardown(), u.error(i);
      }, function() {
        return e._teardown();
      }))), r.closed && (this._connection = null, r = W.EMPTY);
    }
    return r;
  }, n.prototype.refCount = function() {
    return et()(this);
  }, n;
}(x), rt = {
  now: function() {
    return (rt.delegate || performance).now();
  },
  delegate: void 0
}, B = {
  schedule: function(t) {
    var n = requestAnimationFrame, e = cancelAnimationFrame, r = B.delegate;
    r && (n = r.requestAnimationFrame, e = r.cancelAnimationFrame);
    var u = n(function(i) {
      e = void 0, t(i);
    });
    return new W(function() {
      return e == null ? void 0 : e(u);
    });
  },
  requestAnimationFrame: function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    var e = B.delegate;
    return ((e == null ? void 0 : e.requestAnimationFrame) || requestAnimationFrame).apply(void 0, S([], I(t)));
  },
  cancelAnimationFrame: function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    var e = B.delegate;
    return ((e == null ? void 0 : e.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, S([], I(t)));
  },
  delegate: void 0
};
function Se(t) {
  return t ? ut(t) : Ie;
}
function ut(t) {
  return new x(function(n) {
    var e = t || rt, r = e.now(), u = 0, i = function() {
      n.closed || (u = B.requestAnimationFrame(function(o) {
        u = 0;
        var a = e.now();
        n.next({
          timestamp: t ? a : o,
          elapsed: a - r
        }), i();
      }));
    };
    return i(), function() {
      u && B.cancelAnimationFrame(u);
    };
  });
}
var Ie = ut(), it = function(t) {
  R(n, t);
  function n(e) {
    var r = t.call(this) || this;
    return r._value = e, r;
  }
  return Object.defineProperty(n.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), n.prototype._subscribe = function(e) {
    var r = t.prototype._subscribe.call(this, e);
    return !r.closed && e.next(this._value), r;
  }, n.prototype.getValue = function() {
    var e = this, r = e.hasError, u = e.thrownError, i = e._value;
    if (r)
      throw u;
    return this._throwIfClosed(), i;
  }, n.prototype.next = function(e) {
    t.prototype.next.call(this, this._value = e);
  }, n;
}(E), Vn = function(t) {
  R(n, t);
  function n(e, r, u) {
    e === void 0 && (e = 1 / 0), r === void 0 && (r = 1 / 0), u === void 0 && (u = Zn);
    var i = t.call(this) || this;
    return i._bufferSize = e, i._windowTime = r, i._timestampProvider = u, i._buffer = [], i._infiniteTimeWindow = !0, i._infiniteTimeWindow = r === 1 / 0, i._bufferSize = Math.max(1, e), i._windowTime = Math.max(1, r), i;
  }
  return n.prototype.next = function(e) {
    var r = this, u = r.isStopped, i = r._buffer, o = r._infiniteTimeWindow, a = r._timestampProvider, f = r._windowTime;
    u || (i.push(e), !o && i.push(a.now() + f)), this._trimBuffer(), t.prototype.next.call(this, e);
  }, n.prototype._subscribe = function(e) {
    this._throwIfClosed(), this._trimBuffer();
    for (var r = this._innerSubscribe(e), u = this, i = u._infiniteTimeWindow, o = u._buffer, a = o.slice(), f = 0; f < a.length && !e.closed; f += i ? 1 : 2)
      e.next(a[f]);
    return this._checkFinalizedStatuses(e), r;
  }, n.prototype._trimBuffer = function() {
    var e = this, r = e._bufferSize, u = e._timestampProvider, i = e._buffer, o = e._infiniteTimeWindow, a = (o ? 1 : 2) * r;
    if (r < 1 / 0 && a < i.length && i.splice(0, i.length - a), !o) {
      for (var f = u.now(), l = 0, c = 1; c < i.length && i[c] <= f; c += 2)
        l = c;
      l && i.splice(0, l + 1);
    }
  }, n;
}(E), Cn = function(t) {
  R(n, t);
  function n() {
    var e = t !== null && t.apply(this, arguments) || this;
    return e._value = null, e._hasValue = !1, e._isComplete = !1, e;
  }
  return n.prototype._checkFinalizedStatuses = function(e) {
    var r = this, u = r.hasError, i = r._hasValue, o = r._value, a = r.thrownError, f = r.isStopped, l = r._isComplete;
    u ? e.error(a) : (f || l) && (i && e.next(o), e.complete());
  }, n.prototype.next = function(e) {
    this.isStopped || (this._value = e, this._hasValue = !0);
  }, n.prototype.complete = function() {
    var e = this, r = e._hasValue, u = e._value, i = e._isComplete;
    i || (this._isComplete = !0, r && t.prototype.next.call(this, u), t.prototype.complete.call(this));
  }, n;
}(E), Ee = 1, bn, An = {};
function Bn(t) {
  return t in An ? (delete An[t], !0) : !1;
}
var ot = {
  setImmediate: function(t) {
    var n = Ee++;
    return An[n] = !0, bn || (bn = Promise.resolve()), bn.then(function() {
      return Bn(n) && t();
    }), n;
  },
  clearImmediate: function(t) {
    Bn(t);
  }
}, Te = ot.setImmediate, je = ot.clearImmediate, fn = {
  setImmediate: function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    var e = fn.delegate;
    return ((e == null ? void 0 : e.setImmediate) || Te).apply(void 0, S([], I(t)));
  },
  clearImmediate: function(t) {
    var n = fn.delegate;
    return ((n == null ? void 0 : n.clearImmediate) || je)(t);
  },
  delegate: void 0
}, Fe = function(t) {
  R(n, t);
  function n(e, r) {
    var u = t.call(this, e, r) || this;
    return u.scheduler = e, u.work = r, u;
  }
  return n.prototype.requestAsyncId = function(e, r, u) {
    return u === void 0 && (u = 0), u !== null && u > 0 ? t.prototype.requestAsyncId.call(this, e, r, u) : (e.actions.push(this), e._scheduled || (e._scheduled = fn.setImmediate(e.flush.bind(e, void 0))));
  }, n.prototype.recycleAsyncId = function(e, r, u) {
    var i;
    if (u === void 0 && (u = 0), u != null ? u > 0 : this.delay > 0)
      return t.prototype.recycleAsyncId.call(this, e, r, u);
    var o = e.actions;
    r != null && ((i = o[o.length - 1]) === null || i === void 0 ? void 0 : i.id) !== r && (fn.clearImmediate(r), e._scheduled = void 0);
  }, n;
}(cn), Ve = function(t) {
  R(n, t);
  function n() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return n.prototype.flush = function(e) {
    this._active = !0;
    var r = this._scheduled;
    this._scheduled = void 0;
    var u = this.actions, i;
    e = e || u.shift();
    do
      if (i = e.execute(e.state, e.delay))
        break;
    while ((e = u[0]) && e.id === r && u.shift());
    if (this._active = !1, i) {
      for (; (e = u[0]) && e.id === r && u.shift(); )
        e.unsubscribe();
      throw i;
    }
  }, n;
}(sn), at = new Ve(Fe), Ce = at, Re = function(t) {
  R(n, t);
  function n(e, r) {
    var u = t.call(this, e, r) || this;
    return u.scheduler = e, u.work = r, u;
  }
  return n.prototype.schedule = function(e, r) {
    return r === void 0 && (r = 0), r > 0 ? t.prototype.schedule.call(this, e, r) : (this.delay = r, this.state = e, this.scheduler.flush(this), this);
  }, n.prototype.execute = function(e, r) {
    return r > 0 || this.closed ? t.prototype.execute.call(this, e, r) : this._execute(e, r);
  }, n.prototype.requestAsyncId = function(e, r, u) {
    return u === void 0 && (u = 0), u != null && u > 0 || u == null && this.delay > 0 ? t.prototype.requestAsyncId.call(this, e, r, u) : (e.flush(this), 0);
  }, n;
}(cn), ke = function(t) {
  R(n, t);
  function n() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return n;
}(sn), ft = new ke(Re), Ne = ft, We = function(t) {
  R(n, t);
  function n(e, r) {
    var u = t.call(this, e, r) || this;
    return u.scheduler = e, u.work = r, u;
  }
  return n.prototype.requestAsyncId = function(e, r, u) {
    return u === void 0 && (u = 0), u !== null && u > 0 ? t.prototype.requestAsyncId.call(this, e, r, u) : (e.actions.push(this), e._scheduled || (e._scheduled = B.requestAnimationFrame(function() {
      return e.flush(void 0);
    })));
  }, n.prototype.recycleAsyncId = function(e, r, u) {
    var i;
    if (u === void 0 && (u = 0), u != null ? u > 0 : this.delay > 0)
      return t.prototype.recycleAsyncId.call(this, e, r, u);
    var o = e.actions;
    r != null && ((i = o[o.length - 1]) === null || i === void 0 ? void 0 : i.id) !== r && (B.cancelAnimationFrame(r), e._scheduled = void 0);
  }, n;
}(cn), qe = function(t) {
  R(n, t);
  function n() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return n.prototype.flush = function(e) {
    this._active = !0;
    var r = this._scheduled;
    this._scheduled = void 0;
    var u = this.actions, i;
    e = e || u.shift();
    do
      if (i = e.execute(e.state, e.delay))
        break;
    while ((e = u[0]) && e.id === r && u.shift());
    if (this._active = !1, i) {
      for (; (e = u[0]) && e.id === r && u.shift(); )
        e.unsubscribe();
      throw i;
    }
  }, n;
}(sn), lt = new qe(We), Pe = lt, Me = function(t) {
  R(n, t);
  function n(e, r) {
    e === void 0 && (e = ct), r === void 0 && (r = 1 / 0);
    var u = t.call(this, e, function() {
      return u.frame;
    }) || this;
    return u.maxFrames = r, u.frame = 0, u.index = -1, u;
  }
  return n.prototype.flush = function() {
    for (var e = this, r = e.actions, u = e.maxFrames, i, o; (o = r[0]) && o.delay <= u && (r.shift(), this.frame = o.delay, !(i = o.execute(o.state, o.delay))); )
      ;
    if (i) {
      for (; o = r.shift(); )
        o.unsubscribe();
      throw i;
    }
  }, n.frameTimeFactor = 10, n;
}(sn), ct = function(t) {
  R(n, t);
  function n(e, r, u) {
    u === void 0 && (u = e.index += 1);
    var i = t.call(this, e, r) || this;
    return i.scheduler = e, i.work = r, i.index = u, i.active = !0, i.index = e.index = u, i;
  }
  return n.prototype.schedule = function(e, r) {
    if (r === void 0 && (r = 0), Number.isFinite(r)) {
      if (!this.id)
        return t.prototype.schedule.call(this, e, r);
      this.active = !1;
      var u = new n(this.scheduler, this.work);
      return this.add(u), u.schedule(e, r);
    } else
      return W.EMPTY;
  }, n.prototype.requestAsyncId = function(e, r, u) {
    u === void 0 && (u = 0), this.delay = e.frame + u;
    var i = e.actions;
    return i.push(this), i.sort(n.sortActions), 1;
  }, n.prototype.recycleAsyncId = function(e, r, u) {
  }, n.prototype._execute = function(e, r) {
    if (this.active === !0)
      return t.prototype._execute.call(this, e, r);
  }, n.sortActions = function(e, r) {
    return e.delay === r.delay ? e.index === r.index ? 0 : e.index > r.index ? 1 : -1 : e.delay > r.delay ? 1 : -1;
  }, n;
}(cn), N = new x(function(t) {
  return t.complete();
});
function $e(t) {
  return t ? Oe(t) : N;
}
function Oe(t) {
  return new x(function(n) {
    return t.schedule(function() {
      return n.complete();
    });
  });
}
function Rn(t) {
  return t[t.length - 1];
}
function rn(t) {
  return T(Rn(t)) ? t.pop() : void 0;
}
function P(t) {
  return Tn(Rn(t)) ? t.pop() : void 0;
}
function st(t, n) {
  return typeof Rn(t) == "number" ? t.pop() : n;
}
function dn(t, n) {
  return n === void 0 && (n = 0), m(function(e, r) {
    e.subscribe(v(r, function(u) {
      return C(r, t, function() {
        return r.next(u);
      }, n);
    }, function() {
      return C(r, t, function() {
        return r.complete();
      }, n);
    }, function(u) {
      return C(r, t, function() {
        return r.error(u);
      }, n);
    }));
  });
}
function hn(t, n) {
  return n === void 0 && (n = 0), m(function(e, r) {
    r.add(t.schedule(function() {
      return e.subscribe(r);
    }, n));
  });
}
function Le(t, n) {
  return w(t).pipe(hn(n), dn(n));
}
function Ue(t, n) {
  return w(t).pipe(hn(n), dn(n));
}
function De(t, n) {
  return new x(function(e) {
    var r = 0;
    return n.schedule(function() {
      r === t.length ? e.complete() : (e.next(t[r++]), e.closed || this.schedule());
    });
  });
}
function vt(t, n) {
  return new x(function(e) {
    var r;
    return C(e, n, function() {
      r = t[ue](), C(e, n, function() {
        var u, i, o;
        try {
          u = r.next(), i = u.value, o = u.done;
        } catch (a) {
          e.error(a);
          return;
        }
        o ? e.complete() : e.next(i);
      }, 0, !0);
    }), function() {
      return T(r == null ? void 0 : r.return) && r.return();
    };
  });
}
function dt(t, n) {
  if (!t)
    throw new Error("Iterable cannot be null");
  return new x(function(e) {
    C(e, n, function() {
      var r = t[Symbol.asyncIterator]();
      C(e, n, function() {
        r.next().then(function(u) {
          u.done ? e.complete() : e.next(u.value);
        });
      }, 0, !0);
    });
  });
}
function ze(t, n) {
  return dt(ie(t), n);
}
function ht(t, n) {
  if (t != null) {
    if (oe(t))
      return Le(t, n);
    if (ae(t))
      return De(t, n);
    if (fe(t))
      return Ue(t, n);
    if (le(t))
      return dt(t, n);
    if (ce(t))
      return vt(t, n);
    if (se(t))
      return ze(t, n);
  }
  throw ve(t);
}
function M(t, n) {
  return n ? ht(t, n) : w(t);
}
function kn() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = P(t);
  return M(t, e);
}
function mt(t, n) {
  var e = T(t) ? t : function() {
    return t;
  }, r = function(u) {
    return u.error(e());
  };
  return new x(n ? function(u) {
    return n.schedule(r, 0, u);
  } : r);
}
var Sn;
(function(t) {
  t.NEXT = "N", t.ERROR = "E", t.COMPLETE = "C";
})(Sn || (Sn = {}));
var on = function() {
  function t(n, e, r) {
    this.kind = n, this.value = e, this.error = r, this.hasValue = n === "N";
  }
  return t.prototype.observe = function(n) {
    return pt(this, n);
  }, t.prototype.do = function(n, e, r) {
    var u = this, i = u.kind, o = u.value, a = u.error;
    return i === "N" ? n == null ? void 0 : n(o) : i === "E" ? e == null ? void 0 : e(a) : r == null ? void 0 : r();
  }, t.prototype.accept = function(n, e, r) {
    var u;
    return T((u = n) === null || u === void 0 ? void 0 : u.next) ? this.observe(n) : this.do(n, e, r);
  }, t.prototype.toObservable = function() {
    var n = this, e = n.kind, r = n.value, u = n.error, i = e === "N" ? kn(r) : e === "E" ? mt(function() {
      return u;
    }) : e === "C" ? N : 0;
    if (!i)
      throw new TypeError("Unexpected notification kind " + e);
    return i;
  }, t.createNext = function(n) {
    return new t("N", n);
  }, t.createError = function(n) {
    return new t("E", void 0, n);
  }, t.createComplete = function() {
    return t.completeNotification;
  }, t.completeNotification = new t("C"), t;
}();
function pt(t, n) {
  var e, r, u, i = t, o = i.kind, a = i.value, f = i.error;
  if (typeof o != "string")
    throw new TypeError('Invalid notification, missing "kind"');
  o === "N" ? (e = n.next) === null || e === void 0 || e.call(n, a) : o === "E" ? (r = n.error) === null || r === void 0 || r.call(n, f) : (u = n.complete) === null || u === void 0 || u.call(n);
}
function Be(t) {
  return !!t && (t instanceof x || T(t.lift) && T(t.subscribe));
}
var K = nn(function(t) {
  return function() {
    t(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function Ge(t, n) {
  var e = typeof n == "object";
  return new Promise(function(r, u) {
    var i = !1, o;
    t.subscribe({
      next: function(a) {
        o = a, i = !0;
      },
      error: u,
      complete: function() {
        i ? r(o) : e ? r(n.defaultValue) : u(new K());
      }
    });
  });
}
function Ke(t, n) {
  var e = typeof n == "object";
  return new Promise(function(r, u) {
    var i = new jn({
      next: function(o) {
        r(o), i.unsubscribe();
      },
      error: u,
      complete: function() {
        e ? r(n.defaultValue) : u(new K());
      }
    });
    t.subscribe(i);
  });
}
var In = nn(function(t) {
  return function() {
    t(this), this.name = "ArgumentOutOfRangeError", this.message = "argument out of range";
  };
}), gt = nn(function(t) {
  return function(e) {
    t(this), this.name = "NotFoundError", this.message = e;
  };
}), yt = nn(function(t) {
  return function(e) {
    t(this), this.name = "SequenceError", this.message = e;
  };
}), wt = nn(function(t) {
  return function(e) {
    e === void 0 && (e = null), t(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = e;
  };
});
function bt(t, n) {
  var e = Jn(t) ? { first: t } : typeof t == "number" ? { each: t } : t, r = e.first, u = e.each, i = e.with, o = i === void 0 ? Qe : i, a = e.scheduler, f = a === void 0 ? n ?? q : a, l = e.meta, c = l === void 0 ? null : l;
  if (r == null && u == null)
    throw new TypeError("No timeout provided.");
  return m(function(s, h) {
    var g, d, y = null, p = 0, b = function(A) {
      d = C(h, f, function() {
        try {
          g.unsubscribe(), w(o({
            meta: c,
            lastValue: y,
            seen: p
          })).subscribe(h);
        } catch (V) {
          h.error(V);
        }
      }, A);
    };
    g = s.subscribe(v(h, function(A) {
      d == null || d.unsubscribe(), p++, h.next(y = A), u > 0 && b(u);
    }, void 0, void 0, function() {
      d != null && d.closed || d == null || d.unsubscribe(), y = null;
    })), !p && b(r != null ? typeof r == "number" ? r : +r - f.now() : u);
  });
}
function Qe(t) {
  throw new wt(t);
}
function ln(t, n, e, r) {
  if (e)
    if (Tn(e))
      r = e;
    else
      return function() {
        for (var u = [], i = 0; i < arguments.length; i++)
          u[i] = arguments[i];
        return ln(t, n, r).apply(this, u).pipe(Z(e));
      };
  return r ? function() {
    for (var u = [], i = 0; i < arguments.length; i++)
      u[i] = arguments[i];
    return ln(t, n).apply(this, u).pipe(hn(r), dn(r));
  } : function() {
    for (var u = this, i = [], o = 0; o < arguments.length; o++)
      i[o] = arguments[o];
    var a = new Cn(), f = !0;
    return new x(function(l) {
      var c = a.subscribe(l);
      if (f) {
        f = !1;
        var s = !1, h = !1;
        n.apply(u, S(S([], I(i)), [
          function() {
            for (var g = [], d = 0; d < arguments.length; d++)
              g[d] = arguments[d];
            if (t) {
              var y = g.shift();
              if (y != null) {
                a.error(y);
                return;
              }
            }
            a.next(1 < g.length ? g : g[0]), h = !0, s && a.complete();
          }
        ])), h && a.complete(), s = !0;
      }
      return c;
    });
  };
}
function Ye(t, n, e) {
  return ln(!1, t, n, e);
}
function Ze(t, n, e) {
  return ln(!0, t, n, e);
}
var Je = Array.isArray, Xe = Object.getPrototypeOf, _e = Object.prototype, He = Object.keys;
function xt(t) {
  if (t.length === 1) {
    var n = t[0];
    if (Je(n))
      return { args: n, keys: null };
    if (nr(n)) {
      var e = He(n);
      return {
        args: e.map(function(r) {
          return n[r];
        }),
        keys: e
      };
    }
  }
  return { args: t, keys: null };
}
function nr(t) {
  return t && typeof t == "object" && Xe(t) === _e;
}
function At(t, n) {
  return t.reduce(function(e, r, u) {
    return e[r] = n[u], e;
  }, {});
}
function St() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = P(t), r = rn(t), u = xt(t), i = u.args, o = u.keys;
  if (i.length === 0)
    return M([], e);
  var a = new x(It(i, e, o ? function(f) {
    return At(o, f);
  } : j));
  return r ? a.pipe(Z(r)) : a;
}
function It(t, n, e) {
  return e === void 0 && (e = j), function(r) {
    Gn(n, function() {
      for (var u = t.length, i = new Array(u), o = u, a = u, f = function(c) {
        Gn(n, function() {
          var s = M(t[c], n), h = !1;
          s.subscribe(v(r, function(g) {
            i[c] = g, h || (h = !0, a--), a || r.next(e(i.slice()));
          }, function() {
            --o || r.complete();
          }));
        }, r);
      }, l = 0; l < u; l++)
        f(l);
    }, r);
  };
}
function Gn(t, n, e) {
  t ? C(e, t, n) : n();
}
function mn(t) {
  return t === void 0 && (t = 1 / 0), k(j, t);
}
function Nn() {
  return mn(1);
}
function _() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return Nn()(M(t, P(t)));
}
function pn(t) {
  return new x(function(n) {
    w(t()).subscribe(n);
  });
}
var tr = {
  connector: function() {
    return new E();
  },
  resetOnDisconnect: !0
};
function er(t, n) {
  n === void 0 && (n = tr);
  var e = null, r = n.connector, u = n.resetOnDisconnect, i = u === void 0 ? !0 : u, o = r(), a = new x(function(f) {
    return o.subscribe(f);
  });
  return a.connect = function() {
    return (!e || e.closed) && (e = pn(function() {
      return t;
    }).subscribe(o), i && e.add(function() {
      return o = r();
    })), e;
  }, a;
}
function rr() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = rn(t), r = xt(t), u = r.args, i = r.keys, o = new x(function(a) {
    var f = u.length;
    if (!f) {
      a.complete();
      return;
    }
    for (var l = new Array(f), c = f, s = f, h = function(d) {
      var y = !1;
      w(u[d]).subscribe(v(a, function(p) {
        y || (y = !0, s--), l[d] = p;
      }, function() {
        return c--;
      }, void 0, function() {
        (!c || !y) && (s || a.next(i ? At(i, l) : l), a.complete());
      }));
    }, g = 0; g < f; g++)
      h(g);
  });
  return e ? o.pipe(Z(e)) : o;
}
function Et(t, n, e) {
  return e ? Et(t, n).pipe(Z(e)) : new x(function(r) {
    var u = function() {
      for (var o = [], a = 0; a < arguments.length; a++)
        o[a] = arguments[a];
      return r.next(o.length === 1 ? o[0] : o);
    }, i = t(u);
    return T(n) ? function() {
      return n(u, i);
    } : void 0;
  });
}
function ur(t, n, e, r, u) {
  var i, o, a, f;
  arguments.length === 1 ? (i = t, f = i.initialState, n = i.condition, e = i.iterate, o = i.resultSelector, a = o === void 0 ? j : o, u = i.scheduler) : (f = t, !r || Tn(r) ? (a = j, u = r) : a = r);
  function l() {
    var c;
    return de(this, function(s) {
      switch (s.label) {
        case 0:
          c = f, s.label = 1;
        case 1:
          return !n || n(c) ? [4, a(c)] : [3, 4];
        case 2:
          s.sent(), s.label = 3;
        case 3:
          return c = e(c), [3, 1];
        case 4:
          return [2];
      }
    });
  }
  return pn(u ? function() {
    return vt(l(), u);
  } : l);
}
function ir(t, n, e) {
  return pn(function() {
    return t() ? n : e;
  });
}
function or() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = P(t), r = st(t, 1 / 0), u = t;
  return u.length ? u.length === 1 ? w(u[0]) : mn(r)(M(u, e)) : N;
}
var Tt = new x(F);
function ar() {
  return Tt;
}
var fr = Array.isArray;
function X(t) {
  return t.length === 1 && fr(t[0]) ? t[0] : t;
}
function jt() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = X(t);
  return new x(function(r) {
    var u = 0, i = function() {
      if (u < e.length) {
        var o = void 0;
        try {
          o = w(e[u++]);
        } catch {
          i();
          return;
        }
        var a = new Xn(r, void 0, F, F);
        o.subscribe(a), a.add(i);
      } else
        r.complete();
    };
    i();
  });
}
function lr(t, n) {
  return M(Object.entries(t), n);
}
function cr(t, n) {
  return function(e, r) {
    return !t.call(n, e, r);
  };
}
function L(t, n) {
  return m(function(e, r) {
    var u = 0;
    e.subscribe(v(r, function(i) {
      return t.call(n, i, u++) && r.next(i);
    }));
  });
}
function sr(t, n, e) {
  return [L(n, e)(w(t)), L(cr(n, e))(w(t))];
}
function vr() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return t = X(t), t.length === 1 ? w(t[0]) : new x(Ft(t));
}
function Ft(t) {
  return function(n) {
    for (var e = [], r = function(i) {
      e.push(w(t[i]).subscribe(v(n, function(o) {
        if (e) {
          for (var a = 0; a < e.length; a++)
            a !== i && e[a].unsubscribe();
          e = null;
        }
        n.next(o);
      })));
    }, u = 0; e && !n.closed && u < t.length; u++)
      r(u);
  };
}
function dr(t, n, e) {
  if (n == null && (n = t, t = 0), n <= 0)
    return N;
  var r = n + t;
  return new x(e ? function(u) {
    var i = t;
    return e.schedule(function() {
      i < r ? (u.next(i++), this.schedule()) : u.complete();
    });
  } : function(u) {
    for (var i = t; i < r && !u.closed; )
      u.next(i++);
    u.complete();
  });
}
function hr(t, n) {
  return new x(function(e) {
    var r = t(), u = n(r), i = u ? w(u) : N;
    return i.subscribe(e), function() {
      r && r.unsubscribe();
    };
  });
}
function Wn() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = rn(t), r = X(t);
  return r.length ? new x(function(u) {
    var i = r.map(function() {
      return [];
    }), o = r.map(function() {
      return !1;
    });
    u.add(function() {
      i = o = null;
    });
    for (var a = function(l) {
      w(r[l]).subscribe(v(u, function(c) {
        if (i[l].push(c), i.every(function(h) {
          return h.length;
        })) {
          var s = i.map(function(h) {
            return h.shift();
          });
          u.next(e ? e.apply(void 0, S([], I(s))) : s), i.some(function(h, g) {
            return !h.length && o[g];
          }) && u.complete();
        }
      }, function() {
        o[l] = !0, !i[l].length && u.complete();
      }));
    }, f = 0; !u.closed && f < r.length; f++)
      a(f);
    return function() {
      i = o = null;
    };
  }) : N;
}
function Vt(t) {
  return m(function(n, e) {
    var r = !1, u = null, i = null, o = !1, a = function() {
      if (i == null || i.unsubscribe(), i = null, r) {
        r = !1;
        var l = u;
        u = null, e.next(l);
      }
      o && e.complete();
    }, f = function() {
      i = null, o && e.complete();
    };
    n.subscribe(v(e, function(l) {
      r = !0, u = l, i || w(t(l)).subscribe(i = v(e, a, f));
    }, function() {
      o = !0, (!r || !i || i.closed) && e.complete();
    }));
  });
}
function mr(t, n) {
  return n === void 0 && (n = q), Vt(function() {
    return J(t, n);
  });
}
function pr(t) {
  return m(function(n, e) {
    var r = [];
    return n.subscribe(v(e, function(u) {
      return r.push(u);
    }, function() {
      e.next(r), e.complete();
    })), w(t).subscribe(v(e, function() {
      var u = r;
      r = [], e.next(u);
    }, F)), function() {
      r = null;
    };
  });
}
function gr(t, n) {
  return n === void 0 && (n = null), n = n ?? t, m(function(e, r) {
    var u = [], i = 0;
    e.subscribe(v(r, function(o) {
      var a, f, l, c, s = null;
      i++ % n === 0 && u.push([]);
      try {
        for (var h = O(u), g = h.next(); !g.done; g = h.next()) {
          var d = g.value;
          d.push(o), t <= d.length && (s = s ?? [], s.push(d));
        }
      } catch (b) {
        a = { error: b };
      } finally {
        try {
          g && !g.done && (f = h.return) && f.call(h);
        } finally {
          if (a)
            throw a.error;
        }
      }
      if (s)
        try {
          for (var y = O(s), p = y.next(); !p.done; p = y.next()) {
            var d = p.value;
            tn(u, d), r.next(d);
          }
        } catch (b) {
          l = { error: b };
        } finally {
          try {
            p && !p.done && (c = y.return) && c.call(y);
          } finally {
            if (l)
              throw l.error;
          }
        }
    }, function() {
      var o, a;
      try {
        for (var f = O(u), l = f.next(); !l.done; l = f.next()) {
          var c = l.value;
          r.next(c);
        }
      } catch (s) {
        o = { error: s };
      } finally {
        try {
          l && !l.done && (a = f.return) && a.call(f);
        } finally {
          if (o)
            throw o.error;
        }
      }
      r.complete();
    }, void 0, function() {
      u = null;
    }));
  });
}
function yr(t) {
  for (var n, e, r = [], u = 1; u < arguments.length; u++)
    r[u - 1] = arguments[u];
  var i = (n = P(r)) !== null && n !== void 0 ? n : q, o = (e = r[0]) !== null && e !== void 0 ? e : null, a = r[1] || 1 / 0;
  return m(function(f, l) {
    var c = [], s = !1, h = function(y) {
      var p = y.buffer, b = y.subs;
      b.unsubscribe(), tn(c, y), l.next(p), s && g();
    }, g = function() {
      if (c) {
        var y = new W();
        l.add(y);
        var p = [], b = {
          buffer: p,
          subs: y
        };
        c.push(b), C(y, i, function() {
          return h(b);
        }, t);
      }
    };
    o !== null && o >= 0 ? C(l, i, g, o, !0) : s = !0, g();
    var d = v(l, function(y) {
      var p, b, A = c.slice();
      try {
        for (var V = O(A), $ = V.next(); !$.done; $ = V.next()) {
          var U = $.value, D = U.buffer;
          D.push(y), a <= D.length && h(U);
        }
      } catch (Kt) {
        p = { error: Kt };
      } finally {
        try {
          $ && !$.done && (b = V.return) && b.call(V);
        } finally {
          if (p)
            throw p.error;
        }
      }
    }, function() {
      for (; c != null && c.length; )
        l.next(c.shift().buffer);
      d == null || d.unsubscribe(), l.complete(), l.unsubscribe();
    }, void 0, function() {
      return c = null;
    });
    f.subscribe(d);
  });
}
function wr(t, n) {
  return m(function(e, r) {
    var u = [];
    w(t).subscribe(v(r, function(i) {
      var o = [];
      u.push(o);
      var a = new W(), f = function() {
        tn(u, o), r.next(o), a.unsubscribe();
      };
      a.add(w(n(i)).subscribe(v(r, f, F)));
    }, F)), e.subscribe(v(r, function(i) {
      var o, a;
      try {
        for (var f = O(u), l = f.next(); !l.done; l = f.next()) {
          var c = l.value;
          c.push(i);
        }
      } catch (s) {
        o = { error: s };
      } finally {
        try {
          l && !l.done && (a = f.return) && a.call(f);
        } finally {
          if (o)
            throw o.error;
        }
      }
    }, function() {
      for (; u.length > 0; )
        r.next(u.shift());
      r.complete();
    }));
  });
}
function br(t) {
  return m(function(n, e) {
    var r = null, u = null, i = function() {
      u == null || u.unsubscribe();
      var o = r;
      r = [], o && e.next(o), w(t()).subscribe(u = v(e, i, F));
    };
    i(), n.subscribe(v(e, function(o) {
      return r == null ? void 0 : r.push(o);
    }, function() {
      r && e.next(r), e.complete();
    }, void 0, function() {
      return r = u = null;
    }));
  });
}
function Ct(t) {
  return m(function(n, e) {
    var r = null, u = !1, i;
    r = n.subscribe(v(e, void 0, void 0, function(o) {
      i = w(t(o, Ct(t)(n))), r ? (r.unsubscribe(), r = null, i.subscribe(e)) : u = !0;
    })), u && (r.unsubscribe(), r = null, i.subscribe(e));
  });
}
function Rt(t, n, e, r, u) {
  return function(i, o) {
    var a = e, f = n, l = 0;
    i.subscribe(v(o, function(c) {
      var s = l++;
      f = a ? t(f, c, s) : (a = !0, c), r && o.next(f);
    }, u && function() {
      a && o.next(f), o.complete();
    }));
  };
}
function un(t, n) {
  return m(Rt(t, n, arguments.length >= 2, !1, !0));
}
var xr = function(t, n) {
  return t.push(n), t;
};
function kt() {
  return m(function(t, n) {
    un(xr, [])(t).subscribe(n);
  });
}
function Nt(t, n) {
  return Fn(kt(), k(function(e) {
    return t(e);
  }), n ? Z(n) : j);
}
function Wt(t) {
  return Nt(St, t);
}
var Ar = Wt;
function qt() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = rn(t);
  return e ? Fn(qt.apply(void 0, S([], I(t))), Z(e)) : m(function(r, u) {
    It(S([r], I(X(t))))(u);
  });
}
function Sr() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return qt.apply(void 0, S([], I(t)));
}
function En(t, n) {
  return T(n) ? k(t, n, 1) : k(t, 1);
}
function Ir(t, n) {
  return T(n) ? En(function() {
    return t;
  }, n) : En(function() {
    return t;
  });
}
function Er() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = P(t);
  return m(function(r, u) {
    Nn()(M(S([r], I(t)), e)).subscribe(u);
  });
}
function Tr() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return Er.apply(void 0, S([], I(t)));
}
function jr(t) {
  return new x(function(n) {
    return t.subscribe(n);
  });
}
var Fr = {
  connector: function() {
    return new E();
  }
};
function qn(t, n) {
  n === void 0 && (n = Fr);
  var e = n.connector;
  return m(function(r, u) {
    var i = e();
    w(t(jr(i))).subscribe(u), u.add(r.subscribe(i));
  });
}
function Vr(t) {
  return un(function(n, e, r) {
    return !t || t(e, r) ? n + 1 : n;
  }, 0);
}
function Cr(t) {
  return m(function(n, e) {
    var r = !1, u = null, i = null, o = function() {
      if (i == null || i.unsubscribe(), i = null, r) {
        r = !1;
        var a = u;
        u = null, e.next(a);
      }
    };
    n.subscribe(v(e, function(a) {
      i == null || i.unsubscribe(), r = !0, u = a, i = v(e, o, F), w(t(a)).subscribe(i);
    }, function() {
      o(), e.complete();
    }, void 0, function() {
      u = i = null;
    }));
  });
}
function Rr(t, n) {
  return n === void 0 && (n = q), m(function(e, r) {
    var u = null, i = null, o = null, a = function() {
      if (u) {
        u.unsubscribe(), u = null;
        var l = i;
        i = null, r.next(l);
      }
    };
    function f() {
      var l = o + t, c = n.now();
      if (c < l) {
        u = this.schedule(void 0, l - c), r.add(u);
        return;
      }
      a();
    }
    e.subscribe(v(r, function(l) {
      i = l, o = n.now(), u || (u = n.schedule(f, t), r.add(u));
    }, function() {
      a(), r.complete();
    }, void 0, function() {
      i = u = null;
    }));
  });
}
function gn(t) {
  return m(function(n, e) {
    var r = !1;
    n.subscribe(v(e, function(u) {
      r = !0, e.next(u);
    }, function() {
      r || e.next(t), e.complete();
    }));
  });
}
function H(t) {
  return t <= 0 ? function() {
    return N;
  } : m(function(n, e) {
    var r = 0;
    n.subscribe(v(e, function(u) {
      ++r <= t && (e.next(u), t <= r && e.complete());
    }));
  });
}
function Pt() {
  return m(function(t, n) {
    t.subscribe(v(n, F));
  });
}
function Mt(t) {
  return en(function() {
    return t;
  });
}
function Pn(t, n) {
  return n ? function(e) {
    return _(n.pipe(H(1), Pt()), e.pipe(Pn(t)));
  } : k(function(e, r) {
    return w(t(e, r)).pipe(H(1), Mt(e));
  });
}
function kr(t, n) {
  n === void 0 && (n = q);
  var e = J(t, n);
  return Pn(function() {
    return e;
  });
}
function Nr() {
  return m(function(t, n) {
    t.subscribe(v(n, function(e) {
      return pt(e, n);
    }));
  });
}
function Wr(t, n) {
  return m(function(e, r) {
    var u = /* @__PURE__ */ new Set();
    e.subscribe(v(r, function(i) {
      var o = t ? t(i) : i;
      u.has(o) || (u.add(o), r.next(i));
    })), n && w(n).subscribe(v(r, function() {
      return u.clear();
    }, F));
  });
}
function $t(t, n) {
  return n === void 0 && (n = j), t = t ?? qr, m(function(e, r) {
    var u, i = !0;
    e.subscribe(v(r, function(o) {
      var a = n(o);
      (i || !t(u, a)) && (i = !1, u = a, r.next(o));
    }));
  });
}
function qr(t, n) {
  return t === n;
}
function Pr(t, n) {
  return $t(function(e, r) {
    return n ? n(e[t], r[t]) : e[t] === r[t];
  });
}
function yn(t) {
  return t === void 0 && (t = Mr), m(function(n, e) {
    var r = !1;
    n.subscribe(v(e, function(u) {
      r = !0, e.next(u);
    }, function() {
      return r ? e.complete() : e.error(t());
    }));
  });
}
function Mr() {
  return new K();
}
function $r(t, n) {
  if (t < 0)
    throw new In();
  var e = arguments.length >= 2;
  return function(r) {
    return r.pipe(L(function(u, i) {
      return i === t;
    }), H(1), e ? gn(n) : yn(function() {
      return new In();
    }));
  };
}
function Or() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return function(e) {
    return _(e, kn.apply(void 0, S([], I(t))));
  };
}
function Lr(t, n) {
  return m(function(e, r) {
    var u = 0;
    e.subscribe(v(r, function(i) {
      t.call(n, i, u++, e) || (r.next(!1), r.complete());
    }, function() {
      r.next(!0), r.complete();
    }));
  });
}
function Mn(t, n) {
  return n ? function(e) {
    return e.pipe(Mn(function(r, u) {
      return w(t(r, u)).pipe(en(function(i, o) {
        return n(r, i, u, o);
      }));
    }));
  } : m(function(e, r) {
    var u = 0, i = null, o = !1;
    e.subscribe(v(r, function(a) {
      i || (i = v(r, void 0, function() {
        i = null, o && r.complete();
      }), w(t(a, u++)).subscribe(i));
    }, function() {
      o = !0, !i && r.complete();
    }));
  });
}
function Ot() {
  return Mn(j);
}
var Ur = Ot;
function Dr(t, n, e) {
  return n === void 0 && (n = 1 / 0), n = (n || 0) < 1 ? 1 / 0 : n, m(function(r, u) {
    return _n(r, u, t, n, void 0, !0, e);
  });
}
function zr(t) {
  return m(function(n, e) {
    try {
      n.subscribe(e);
    } finally {
      e.add(t);
    }
  });
}
function Br(t, n) {
  return m(Lt(t, n, "value"));
}
function Lt(t, n, e) {
  var r = e === "index";
  return function(u, i) {
    var o = 0;
    u.subscribe(v(i, function(a) {
      var f = o++;
      t.call(n, a, f, u) && (i.next(r ? f : a), i.complete());
    }, function() {
      i.next(r ? -1 : void 0), i.complete();
    }));
  };
}
function Gr(t, n) {
  return m(Lt(t, n, "index"));
}
function Kr(t, n) {
  var e = arguments.length >= 2;
  return function(r) {
    return r.pipe(t ? L(function(u, i) {
      return t(u, i, r);
    }) : j, H(1), e ? gn(n) : yn(function() {
      return new K();
    }));
  };
}
function Qr(t, n, e, r) {
  return m(function(u, i) {
    var o;
    !n || typeof n == "function" ? o = n : (e = n.duration, o = n.element, r = n.connector);
    var a = /* @__PURE__ */ new Map(), f = function(d) {
      a.forEach(d), d(i);
    }, l = function(d) {
      return f(function(y) {
        return y.error(d);
      });
    }, c = 0, s = !1, h = new Xn(i, function(d) {
      try {
        var y = t(d), p = a.get(y);
        if (!p) {
          a.set(y, p = r ? r() : new E());
          var b = g(y, p);
          if (i.next(b), e) {
            var A = v(p, function() {
              p.complete(), A == null || A.unsubscribe();
            }, void 0, void 0, function() {
              return a.delete(y);
            });
            h.add(w(e(b)).subscribe(A));
          }
        }
        p.next(o ? o(d) : d);
      } catch (V) {
        l(V);
      }
    }, function() {
      return f(function(d) {
        return d.complete();
      });
    }, l, function() {
      return a.clear();
    }, function() {
      return s = !0, c === 0;
    });
    u.subscribe(h);
    function g(d, y) {
      var p = new x(function(b) {
        c++;
        var A = y.subscribe(b);
        return function() {
          A.unsubscribe(), --c === 0 && s && h.unsubscribe();
        };
      });
      return p.key = d, p;
    }
  });
}
function Yr() {
  return m(function(t, n) {
    t.subscribe(v(n, function() {
      n.next(!1), n.complete();
    }, function() {
      n.next(!0), n.complete();
    }));
  });
}
function Ut(t) {
  return t <= 0 ? function() {
    return N;
  } : m(function(n, e) {
    var r = [];
    n.subscribe(v(e, function(u) {
      r.push(u), t < r.length && r.shift();
    }, function() {
      var u, i;
      try {
        for (var o = O(r), a = o.next(); !a.done; a = o.next()) {
          var f = a.value;
          e.next(f);
        }
      } catch (l) {
        u = { error: l };
      } finally {
        try {
          a && !a.done && (i = o.return) && i.call(o);
        } finally {
          if (u)
            throw u.error;
        }
      }
      e.complete();
    }, void 0, function() {
      r = null;
    }));
  });
}
function Zr(t, n) {
  var e = arguments.length >= 2;
  return function(r) {
    return r.pipe(t ? L(function(u, i) {
      return t(u, i, r);
    }) : j, Ut(1), e ? gn(n) : yn(function() {
      return new K();
    }));
  };
}
function Jr() {
  return m(function(t, n) {
    t.subscribe(v(n, function(e) {
      n.next(on.createNext(e));
    }, function() {
      n.next(on.createComplete()), n.complete();
    }, function(e) {
      n.next(on.createError(e)), n.complete();
    }));
  });
}
function Xr(t) {
  return un(T(t) ? function(n, e) {
    return t(n, e) > 0 ? n : e;
  } : function(n, e) {
    return n > e ? n : e;
  });
}
var _r = k;
function Hr(t, n, e) {
  return e === void 0 && (e = 1 / 0), T(n) ? k(function() {
    return t;
  }, n, e) : (typeof n == "number" && (e = n), k(function() {
    return t;
  }, e));
}
function nu(t, n, e) {
  return e === void 0 && (e = 1 / 0), m(function(r, u) {
    var i = n;
    return _n(r, u, function(o, a) {
      return t(i, o, a);
    }, e, function(o) {
      i = o;
    }, !1, void 0, function() {
      return i = null;
    });
  });
}
function tu() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = P(t), r = st(t, 1 / 0);
  return t = X(t), m(function(u, i) {
    mn(r)(M(S([u], I(t)), e)).subscribe(i);
  });
}
function eu() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return tu.apply(void 0, S([], I(t)));
}
function ru(t) {
  return un(T(t) ? function(n, e) {
    return t(n, e) < 0 ? n : e;
  } : function(n, e) {
    return n < e ? n : e;
  });
}
function $n(t, n) {
  var e = T(t) ? t : function() {
    return t;
  };
  return T(n) ? qn(n, {
    connector: e
  }) : function(r) {
    return new vn(r, e);
  };
}
function uu() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = X(t);
  return function(r) {
    return jt.apply(void 0, S([r], I(e)));
  };
}
function iu() {
  return m(function(t, n) {
    var e, r = !1;
    t.subscribe(v(n, function(u) {
      var i = e;
      e = u, r && n.next([i, u]), r = !0;
    }));
  });
}
function ou() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = t.length;
  if (e === 0)
    throw new Error("list of properties cannot be empty.");
  return en(function(r) {
    for (var u = r, i = 0; i < e; i++) {
      var o = u == null ? void 0 : u[t[i]];
      if (typeof o < "u")
        u = o;
      else
        return;
    }
    return u;
  });
}
function au(t) {
  return t ? function(n) {
    return qn(t)(n);
  } : function(n) {
    return $n(new E())(n);
  };
}
function fu(t) {
  return function(n) {
    var e = new it(t);
    return new vn(n, function() {
      return e;
    });
  };
}
function lu() {
  return function(t) {
    var n = new Cn();
    return new vn(t, function() {
      return n;
    });
  };
}
function cu(t, n, e, r) {
  e && !T(e) && (r = e);
  var u = T(e) ? e : void 0;
  return function(i) {
    return $n(new Vn(t, n, r), u)(i);
  };
}
function su() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return t.length ? m(function(e, r) {
    Ft(S([e], I(t)))(r);
  }) : j;
}
function vu(t) {
  var n, e = 1 / 0, r;
  return t != null && (typeof t == "object" ? (n = t.count, e = n === void 0 ? 1 / 0 : n, r = t.delay) : e = t), e <= 0 ? function() {
    return N;
  } : m(function(u, i) {
    var o = 0, a, f = function() {
      if (a == null || a.unsubscribe(), a = null, r != null) {
        var c = typeof r == "number" ? J(r) : w(r(o)), s = v(i, function() {
          s.unsubscribe(), l();
        });
        c.subscribe(s);
      } else
        l();
    }, l = function() {
      var c = !1;
      a = u.subscribe(v(i, void 0, function() {
        ++o < e ? a ? f() : c = !0 : i.complete();
      })), c && f();
    };
    l();
  });
}
function du(t) {
  return m(function(n, e) {
    var r, u = !1, i, o = !1, a = !1, f = function() {
      return a && o && (e.complete(), !0);
    }, l = function() {
      return i || (i = new E(), w(t(i)).subscribe(v(e, function() {
        r ? c() : u = !0;
      }, function() {
        o = !0, f();
      }))), i;
    }, c = function() {
      a = !1, r = n.subscribe(v(e, void 0, function() {
        a = !0, !f() && l().next();
      })), u && (r.unsubscribe(), r = null, u = !1, c());
    };
    c();
  });
}
function hu(t) {
  t === void 0 && (t = 1 / 0);
  var n;
  t && typeof t == "object" ? n = t : n = {
    count: t
  };
  var e = n.count, r = e === void 0 ? 1 / 0 : e, u = n.delay, i = n.resetOnSuccess, o = i === void 0 ? !1 : i;
  return r <= 0 ? j : m(function(a, f) {
    var l = 0, c, s = function() {
      var h = !1;
      c = a.subscribe(v(f, function(g) {
        o && (l = 0), f.next(g);
      }, void 0, function(g) {
        if (l++ < r) {
          var d = function() {
            c ? (c.unsubscribe(), c = null, s()) : h = !0;
          };
          if (u != null) {
            var y = typeof u == "number" ? J(u) : w(u(g, l)), p = v(f, function() {
              p.unsubscribe(), d();
            }, function() {
              f.complete();
            });
            y.subscribe(p);
          } else
            d();
        } else
          f.error(g);
      })), h && (c.unsubscribe(), c = null, s());
    };
    s();
  });
}
function mu(t) {
  return m(function(n, e) {
    var r, u = !1, i, o = function() {
      r = n.subscribe(v(e, void 0, void 0, function(a) {
        i || (i = new E(), w(t(i)).subscribe(v(e, function() {
          return r ? o() : u = !0;
        }))), i && i.next(a);
      })), u && (r.unsubscribe(), r = null, u = !1, o());
    };
    o();
  });
}
function pu(t, n) {
  return m(Rt(t, n, arguments.length >= 2, !0));
}
function gu(t, n) {
  return n === void 0 && (n = function(e, r) {
    return e === r;
  }), m(function(e, r) {
    var u = Kn(), i = Kn(), o = function(f) {
      r.next(f), r.complete();
    }, a = function(f, l) {
      var c = v(r, function(s) {
        var h = l.buffer, g = l.complete;
        h.length === 0 ? g ? o(!1) : f.buffer.push(s) : !n(s, h.shift()) && o(!1);
      }, function() {
        f.complete = !0;
        var s = l.complete, h = l.buffer;
        s && o(h.length === 0), c == null || c.unsubscribe();
      });
      return c;
    };
    e.subscribe(a(u, i)), w(t).subscribe(a(i, u));
  });
}
function Kn() {
  return {
    buffer: [],
    complete: !1
  };
}
function Dt(t) {
  t === void 0 && (t = {});
  var n = t.connector, e = n === void 0 ? function() {
    return new E();
  } : n, r = t.resetOnError, u = r === void 0 ? !0 : r, i = t.resetOnComplete, o = i === void 0 ? !0 : i, a = t.resetOnRefCountZero, f = a === void 0 ? !0 : a;
  return function(l) {
    var c, s, h, g = 0, d = !1, y = !1, p = function() {
      s == null || s.unsubscribe(), s = void 0;
    }, b = function() {
      p(), c = h = void 0, d = y = !1;
    }, A = function() {
      var V = c;
      b(), V == null || V.unsubscribe();
    };
    return m(function(V, $) {
      g++, !y && !d && p();
      var U = h = h ?? e();
      $.add(function() {
        g--, g === 0 && !y && !d && (s = xn(A, f));
      }), U.subscribe($), !c && g > 0 && (c = new jn({
        next: function(D) {
          return U.next(D);
        },
        error: function(D) {
          y = !0, p(), s = xn(b, u, D), U.error(D);
        },
        complete: function() {
          d = !0, p(), s = xn(b, o), U.complete();
        }
      }), w(V).subscribe(c));
    })(l);
  };
}
function xn(t, n) {
  for (var e = [], r = 2; r < arguments.length; r++)
    e[r - 2] = arguments[r];
  if (n === !0) {
    t();
    return;
  }
  if (n !== !1) {
    var u = new jn({
      next: function() {
        u.unsubscribe(), t();
      }
    });
    return w(n.apply(void 0, S([], I(e)))).subscribe(u);
  }
}
function yu(t, n, e) {
  var r, u, i, o, a = !1;
  return t && typeof t == "object" ? (r = t.bufferSize, o = r === void 0 ? 1 / 0 : r, u = t.windowTime, n = u === void 0 ? 1 / 0 : u, i = t.refCount, a = i === void 0 ? !1 : i, e = t.scheduler) : o = t ?? 1 / 0, Dt({
    connector: function() {
      return new Vn(o, n, e);
    },
    resetOnError: !0,
    resetOnComplete: !1,
    resetOnRefCountZero: a
  });
}
function wu(t) {
  return m(function(n, e) {
    var r = !1, u, i = !1, o = 0;
    n.subscribe(v(e, function(a) {
      i = !0, (!t || t(a, o++, n)) && (r && e.error(new yt("Too many matching values")), r = !0, u = a);
    }, function() {
      r ? (e.next(u), e.complete()) : e.error(i ? new gt("No matching values") : new K());
    }));
  });
}
function bu(t) {
  return L(function(n, e) {
    return t <= e;
  });
}
function xu(t) {
  return t <= 0 ? j : m(function(n, e) {
    var r = new Array(t), u = 0;
    return n.subscribe(v(e, function(i) {
      var o = u++;
      if (o < t)
        r[o] = i;
      else {
        var a = o % t, f = r[a];
        r[a] = i, e.next(f);
      }
    })), function() {
      r = null;
    };
  });
}
function Au(t) {
  return m(function(n, e) {
    var r = !1, u = v(e, function() {
      u == null || u.unsubscribe(), r = !0;
    }, F);
    w(t).subscribe(u), n.subscribe(v(e, function(i) {
      return r && e.next(i);
    }));
  });
}
function Su(t) {
  return m(function(n, e) {
    var r = !1, u = 0;
    n.subscribe(v(e, function(i) {
      return (r || (r = !t(i, u++))) && e.next(i);
    }));
  });
}
function Iu() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = P(t);
  return m(function(r, u) {
    (e ? _(t, r, e) : _(t, r)).subscribe(u);
  });
}
function Eu() {
  return Y(j);
}
function Tu(t, n) {
  return T(n) ? Y(function() {
    return t;
  }, n) : Y(function() {
    return t;
  });
}
function ju(t, n) {
  return m(function(e, r) {
    var u = n;
    return Y(function(i, o) {
      return t(u, i, o);
    }, function(i, o) {
      return u = o, o;
    })(e).subscribe(r), function() {
      u = null;
    };
  });
}
function Fu(t, n) {
  return n === void 0 && (n = !1), m(function(e, r) {
    var u = 0;
    e.subscribe(v(r, function(i) {
      var o = t(i, u++);
      (o || n) && r.next(i), !o && r.complete();
    }));
  });
}
function Vu(t, n, e) {
  var r = T(t) || n || e ? { next: t, error: n, complete: e } : t;
  return r ? m(function(u, i) {
    var o;
    (o = r.subscribe) === null || o === void 0 || o.call(r);
    var a = !0;
    u.subscribe(v(i, function(f) {
      var l;
      (l = r.next) === null || l === void 0 || l.call(r, f), i.next(f);
    }, function() {
      var f;
      a = !1, (f = r.complete) === null || f === void 0 || f.call(r), i.complete();
    }, function(f) {
      var l;
      a = !1, (l = r.error) === null || l === void 0 || l.call(r, f), i.error(f);
    }, function() {
      var f, l;
      a && ((f = r.unsubscribe) === null || f === void 0 || f.call(r)), (l = r.finalize) === null || l === void 0 || l.call(r);
    }));
  }) : j;
}
var zt = {
  leading: !0,
  trailing: !1
};
function Bt(t, n) {
  return n === void 0 && (n = zt), m(function(e, r) {
    var u = n.leading, i = n.trailing, o = !1, a = null, f = null, l = !1, c = function() {
      f == null || f.unsubscribe(), f = null, i && (g(), l && r.complete());
    }, s = function() {
      f = null, l && r.complete();
    }, h = function(d) {
      return f = w(t(d)).subscribe(v(r, c, s));
    }, g = function() {
      if (o) {
        o = !1;
        var d = a;
        a = null, r.next(d), !l && h(d);
      }
    };
    e.subscribe(v(r, function(d) {
      o = !0, a = d, !(f && !f.closed) && (u ? g() : h(d));
    }, function() {
      l = !0, !(i && o && f && !f.closed) && r.complete();
    }));
  });
}
function Cu(t, n, e) {
  n === void 0 && (n = q), e === void 0 && (e = zt);
  var r = J(t, n);
  return Bt(function() {
    return r;
  }, e);
}
function Ru(t) {
  return t === void 0 && (t = q), m(function(n, e) {
    var r = t.now();
    n.subscribe(v(e, function(u) {
      var i = t.now(), o = i - r;
      r = i, e.next(new ku(u, o));
    }));
  });
}
var ku = function() {
  function t(n, e) {
    this.value = n, this.interval = e;
  }
  return t;
}();
function Nu(t, n, e) {
  var r, u, i;
  if (e = e ?? Hn, Jn(t) ? r = t : typeof t == "number" && (u = t), n)
    i = function() {
      return n;
    };
  else
    throw new TypeError("No observable provided to switch to");
  if (r == null && u == null)
    throw new TypeError("No timeout provided.");
  return bt({
    first: r,
    each: u,
    scheduler: e,
    with: i
  });
}
function Wu(t) {
  return t === void 0 && (t = Zn), en(function(n) {
    return { value: n, timestamp: t.now() };
  });
}
function qu(t) {
  return m(function(n, e) {
    var r = new E();
    e.next(r.asObservable());
    var u = function(i) {
      r.error(i), e.error(i);
    };
    return n.subscribe(v(e, function(i) {
      return r == null ? void 0 : r.next(i);
    }, function() {
      r.complete(), e.complete();
    }, u)), w(t).subscribe(v(e, function() {
      r.complete(), e.next(r = new E());
    }, F, u)), function() {
      r == null || r.unsubscribe(), r = null;
    };
  });
}
function Pu(t, n) {
  n === void 0 && (n = 0);
  var e = n > 0 ? n : t;
  return m(function(r, u) {
    var i = [new E()], o = [], a = 0;
    u.next(i[0].asObservable()), r.subscribe(v(u, function(f) {
      var l, c;
      try {
        for (var s = O(i), h = s.next(); !h.done; h = s.next()) {
          var g = h.value;
          g.next(f);
        }
      } catch (p) {
        l = { error: p };
      } finally {
        try {
          h && !h.done && (c = s.return) && c.call(s);
        } finally {
          if (l)
            throw l.error;
        }
      }
      var d = a - t + 1;
      if (d >= 0 && d % e === 0 && i.shift().complete(), ++a % e === 0) {
        var y = new E();
        i.push(y), u.next(y.asObservable());
      }
    }, function() {
      for (; i.length > 0; )
        i.shift().complete();
      u.complete();
    }, function(f) {
      for (; i.length > 0; )
        i.shift().error(f);
      u.error(f);
    }, function() {
      o = null, i = null;
    }));
  });
}
function Mu(t) {
  for (var n, e, r = [], u = 1; u < arguments.length; u++)
    r[u - 1] = arguments[u];
  var i = (n = P(r)) !== null && n !== void 0 ? n : q, o = (e = r[0]) !== null && e !== void 0 ? e : null, a = r[1] || 1 / 0;
  return m(function(f, l) {
    var c = [], s = !1, h = function(p) {
      var b = p.window, A = p.subs;
      b.complete(), A.unsubscribe(), tn(c, p), s && g();
    }, g = function() {
      if (c) {
        var p = new W();
        l.add(p);
        var b = new E(), A = {
          window: b,
          subs: p,
          seen: 0
        };
        c.push(A), l.next(b.asObservable()), C(p, i, function() {
          return h(A);
        }, t);
      }
    };
    o !== null && o >= 0 ? C(l, i, g, o, !0) : s = !0, g();
    var d = function(p) {
      return c.slice().forEach(p);
    }, y = function(p) {
      d(function(b) {
        var A = b.window;
        return p(A);
      }), p(l), l.unsubscribe();
    };
    return f.subscribe(v(l, function(p) {
      d(function(b) {
        b.window.next(p), a <= ++b.seen && h(b);
      });
    }, function() {
      return y(function(p) {
        return p.complete();
      });
    }, function(p) {
      return y(function(b) {
        return b.error(p);
      });
    })), function() {
      c = null;
    };
  });
}
function $u(t, n) {
  return m(function(e, r) {
    var u = [], i = function(o) {
      for (; 0 < u.length; )
        u.shift().error(o);
      r.error(o);
    };
    w(t).subscribe(v(r, function(o) {
      var a = new E();
      u.push(a);
      var f = new W(), l = function() {
        tn(u, a), a.complete(), f.unsubscribe();
      }, c;
      try {
        c = w(n(o));
      } catch (s) {
        i(s);
        return;
      }
      r.next(a.asObservable()), f.add(c.subscribe(v(r, l, F, i)));
    }, F)), e.subscribe(v(r, function(o) {
      var a, f, l = u.slice();
      try {
        for (var c = O(l), s = c.next(); !s.done; s = c.next()) {
          var h = s.value;
          h.next(o);
        }
      } catch (g) {
        a = { error: g };
      } finally {
        try {
          s && !s.done && (f = c.return) && f.call(c);
        } finally {
          if (a)
            throw a.error;
        }
      }
    }, function() {
      for (; 0 < u.length; )
        u.shift().complete();
      r.complete();
    }, i, function() {
      for (; 0 < u.length; )
        u.shift().unsubscribe();
    }));
  });
}
function Ou(t) {
  return m(function(n, e) {
    var r, u, i = function(a) {
      r.error(a), e.error(a);
    }, o = function() {
      u == null || u.unsubscribe(), r == null || r.complete(), r = new E(), e.next(r.asObservable());
      var a;
      try {
        a = w(t());
      } catch (f) {
        i(f);
        return;
      }
      a.subscribe(u = v(e, o, o, i));
    };
    o(), n.subscribe(v(e, function(a) {
      return r.next(a);
    }, function() {
      r.complete(), e.complete();
    }, i, function() {
      u == null || u.unsubscribe(), r = null;
    }));
  });
}
function Lu() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  var e = rn(t);
  return m(function(r, u) {
    for (var i = t.length, o = new Array(i), a = t.map(function() {
      return !1;
    }), f = !1, l = function(s) {
      w(t[s]).subscribe(v(u, function(h) {
        o[s] = h, !f && !a[s] && (a[s] = !0, (f = a.every(j)) && (a = null));
      }, F));
    }, c = 0; c < i; c++)
      l(c);
    r.subscribe(v(u, function(s) {
      if (f) {
        var h = S([s], I(o));
        u.next(e ? e.apply(void 0, S([], I(h))) : h);
      }
    }));
  });
}
function Uu(t) {
  return Nt(Wn, t);
}
function Du() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return m(function(e, r) {
    Wn.apply(void 0, S([e], I(t))).subscribe(r);
  });
}
function zu() {
  for (var t = [], n = 0; n < arguments.length; n++)
    t[n] = arguments[n];
  return Du.apply(void 0, S([], I(t)));
}
const Bu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ArgumentOutOfRangeError: In,
  AsyncSubject: Cn,
  BehaviorSubject: it,
  ConnectableObservable: vn,
  EMPTY: N,
  EmptyError: K,
  NEVER: Tt,
  NotFoundError: gt,
  Notification: on,
  get NotificationKind() {
    return Sn;
  },
  ObjectUnsubscribedError: he,
  Observable: x,
  ReplaySubject: Vn,
  Scheduler: me,
  SequenceError: yt,
  Subject: E,
  Subscriber: pe,
  Subscription: W,
  TimeoutError: wt,
  UnsubscriptionError: ge,
  VirtualAction: ct,
  VirtualTimeScheduler: Me,
  animationFrame: Pe,
  animationFrameScheduler: lt,
  animationFrames: Se,
  asap: Ce,
  asapScheduler: at,
  async: Hn,
  asyncScheduler: q,
  audit: Vt,
  auditTime: mr,
  bindCallback: Ye,
  bindNodeCallback: Ze,
  buffer: pr,
  bufferCount: gr,
  bufferTime: yr,
  bufferToggle: wr,
  bufferWhen: br,
  catchError: Ct,
  combineAll: Ar,
  combineLatest: St,
  combineLatestAll: Wt,
  combineLatestWith: Sr,
  concat: _,
  concatAll: Nn,
  concatMap: En,
  concatMapTo: Ir,
  concatWith: Tr,
  config: ye,
  connect: qn,
  connectable: er,
  count: Vr,
  debounce: Cr,
  debounceTime: Rr,
  defaultIfEmpty: gn,
  defer: pn,
  delay: kr,
  delayWhen: Pn,
  dematerialize: Nr,
  distinct: Wr,
  distinctUntilChanged: $t,
  distinctUntilKeyChanged: Pr,
  elementAt: $r,
  empty: $e,
  endWith: Or,
  every: Lr,
  exhaust: Ur,
  exhaustAll: Ot,
  exhaustMap: Mn,
  expand: Dr,
  filter: L,
  finalize: zr,
  find: Br,
  findIndex: Gr,
  first: Kr,
  firstValueFrom: Ke,
  flatMap: _r,
  forkJoin: rr,
  from: M,
  fromEvent: we,
  fromEventPattern: Et,
  generate: ur,
  groupBy: Qr,
  identity: j,
  ignoreElements: Pt,
  iif: ir,
  interval: be,
  isEmpty: Yr,
  isObservable: Be,
  last: Zr,
  lastValueFrom: Ge,
  map: en,
  mapTo: Mt,
  materialize: Jr,
  max: Xr,
  merge: or,
  mergeAll: mn,
  mergeMap: k,
  mergeMapTo: Hr,
  mergeScan: nu,
  mergeWith: eu,
  min: ru,
  multicast: $n,
  never: ar,
  noop: F,
  observable: xe,
  observeOn: dn,
  of: kn,
  onErrorResumeNext: jt,
  onErrorResumeNextWith: uu,
  pairs: lr,
  pairwise: iu,
  partition: sr,
  pipe: Fn,
  pluck: ou,
  publish: au,
  publishBehavior: fu,
  publishLast: lu,
  publishReplay: cu,
  queue: Ne,
  queueScheduler: ft,
  race: vr,
  raceWith: su,
  range: dr,
  reduce: un,
  refCount: et,
  repeat: vu,
  repeatWhen: du,
  retry: hu,
  retryWhen: mu,
  sample: Ae,
  sampleTime: nt,
  scan: pu,
  scheduled: ht,
  sequenceEqual: gu,
  share: Dt,
  shareReplay: yu,
  single: wu,
  skip: bu,
  skipLast: xu,
  skipUntil: Au,
  skipWhile: Su,
  startWith: Iu,
  subscribeOn: hn,
  switchAll: Eu,
  switchMap: Y,
  switchMapTo: Tu,
  switchScan: ju,
  take: H,
  takeLast: Ut,
  takeUntil: tt,
  takeWhile: Fu,
  tap: Vu,
  throttle: Bt,
  throttleTime: Cu,
  throwError: mt,
  throwIfEmpty: yn,
  timeInterval: Ru,
  timeout: bt,
  timeoutWith: Nu,
  timer: J,
  timestamp: Wu,
  toArray: kt,
  using: hr,
  window: qu,
  windowCount: Pu,
  windowTime: Mu,
  windowToggle: $u,
  windowWhen: Ou,
  withLatestFrom: Lu,
  zip: Wn,
  zipAll: Uu,
  zipWith: zu
}, Symbol.toStringTag, { value: "Module" }));
function Gu(t) {
  if (t.__esModule)
    return t;
  var n = t.default;
  if (typeof n == "function") {
    var e = function r() {
      if (this instanceof r) {
        var u = [null];
        u.push.apply(u, arguments);
        var i = Function.bind.apply(n, u);
        return new i();
      }
      return n.apply(this, arguments);
    };
    e.prototype = n.prototype;
  } else
    e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var u = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(e, r, u.get ? u : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), e;
}
var G = {};
const Ku = /* @__PURE__ */ Gu(Bu);
Object.defineProperty(G, "__esModule", { value: !0 });
G.SvelteReplaySubject = G.SvelteBehaviorSubject = Gt = G.SvelteSubject = void 0;
const On = Ku;
class Qu extends On.Subject {
  set(n) {
    this.next(n);
  }
}
var Gt = G.SvelteSubject = Qu;
class Yu extends On.BehaviorSubject {
  set(n) {
    this.next(n);
  }
}
G.SvelteBehaviorSubject = Yu;
class Zu extends On.ReplaySubject {
  set(n) {
    this.next(n);
  }
}
G.SvelteReplaySubject = Zu;
function Qn(t) {
  let n, e, r = (
    /*$todo$*/
    t[1].title + ""
  ), u;
  return {
    c() {
      n = an("article"), e = an("h1"), u = te(r);
    },
    m(i, o) {
      z(i, n, o), zn(n, e), zn(e, u);
    },
    p(i, o) {
      o & /*$todo$*/
      2 && r !== (r = /*$todo$*/
      i[1].title + "") && ee(u, r);
    },
    d(i) {
      i && Q(n);
    }
  };
}
function Ju(t) {
  let n, e, r, u, i, o, a, f = (
    /*$todo$*/
    t[1] && Qn(t)
  );
  return {
    c() {
      n = an("h1"), n.textContent = "Todo Lookup", e = Ln(), r = an("input"), u = Ln(), f && f.c(), i = Xt(), this.c = wn, _t(r, "type", "number");
    },
    m(l, c) {
      z(l, n, c), z(l, e, c), z(l, r, c), Un(
        r,
        /*$input$*/
        t[0]
      ), z(l, u, c), f && f.m(l, c), z(l, i, c), o || (a = Ht(
        r,
        "input",
        /*input_input_handler*/
        t[4]
      ), o = !0);
    },
    p(l, [c]) {
      c & /*$input$*/
      1 && Yn(r.value) !== /*$input$*/
      l[0] && Un(
        r,
        /*$input$*/
        l[0]
      ), /*$todo$*/
      l[1] ? f ? f.p(l, c) : (f = Qn(l), f.c(), f.m(i.parentNode, i)) : f && (f.d(1), f = null);
    },
    i: wn,
    o: wn,
    d(l) {
      l && Q(n), l && Q(e), l && Q(r), l && Q(u), f && f.d(l), l && Q(i), o = !1, a();
    }
  };
}
function Xu(t, n, e) {
  let r, u;
  const i = new Gt();
  Dn(t, i, (l) => e(0, r = l));
  const o = new E();
  ne(() => {
    o.next();
  });
  const a = i.pipe(tt(o), L(Boolean), nt(500), Y((l) => fetch(`https://jsonplaceholder.typicode.com/todos/${l}`)), k((l) => l.json()));
  Dn(t, a, (l) => e(1, u = l));
  function f() {
    r = Yn(this.value), i.set(r);
  }
  return [r, u, i, a, f];
}
class _u extends Qt {
  constructor(n) {
    super();
    const e = document.createElement("style");
    e.textContent = ":host{background-color:lightsalmon;display:block;padding:1rem}", this.shadowRoot.appendChild(e), Yt(
      this,
      {
        target: this.shadowRoot,
        props: Zt(this.attributes),
        customElement: !0
      },
      Xu,
      Ju,
      Jt,
      {},
      null
    ), n && n.target && z(n.target, this, n.anchor);
  }
}
customElements.define("wc-svelte-todo", _u);
export {
  _u as default
};
