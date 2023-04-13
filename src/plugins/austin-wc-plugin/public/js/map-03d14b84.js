import { i as b, g as a, k as g, S as w, l as f, m as d, j as A } from "./Observable-80c792d5.js";
function I(n) {
  return b(n == null ? void 0 : n.lift);
}
function _(n) {
  return function(i) {
    if (I(i))
      return i.lift(function(t) {
        try {
          return n(t, this);
        } catch (e) {
          this.error(e);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function S(n, i, t, e, r) {
  return new m(n, i, t, e, r);
}
var m = function(n) {
  a(i, n);
  function i(t, e, r, s, c, y) {
    var u = n.call(this, t) || this;
    return u.onFinalize = c, u.shouldUnsubscribe = y, u._next = e ? function(o) {
      try {
        e(o);
      } catch (h) {
        t.error(h);
      }
    } : n.prototype._next, u._error = s ? function(o) {
      try {
        s(o);
      } catch (h) {
        t.error(h);
      } finally {
        this.unsubscribe();
      }
    } : n.prototype._error, u._complete = r ? function() {
      try {
        r();
      } catch (o) {
        t.error(o);
      } finally {
        this.unsubscribe();
      }
    } : n.prototype._complete, u;
  }
  return i.prototype.unsubscribe = function() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var e = this.closed;
      n.prototype.unsubscribe.call(this), !e && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }, i;
}(g), p = {
  now: function() {
    return (p.delegate || Date).now();
  },
  delegate: void 0
}, x = function(n) {
  a(i, n);
  function i(t, e) {
    return n.call(this) || this;
  }
  return i.prototype.schedule = function(t, e) {
    return this;
  }, i;
}(w), l = {
  setInterval: function(n, i) {
    for (var t = [], e = 2; e < arguments.length; e++)
      t[e - 2] = arguments[e];
    var r = l.delegate;
    return r != null && r.setInterval ? r.setInterval.apply(r, f([n, i], d(t))) : setInterval.apply(void 0, f([n, i], d(t)));
  },
  clearInterval: function(n) {
    var i = l.delegate;
    return ((i == null ? void 0 : i.clearInterval) || clearInterval)(n);
  },
  delegate: void 0
}, k = function(n) {
  a(i, n);
  function i(t, e) {
    var r = n.call(this, t, e) || this;
    return r.scheduler = t, r.work = e, r.pending = !1, r;
  }
  return i.prototype.schedule = function(t, e) {
    var r;
    if (e === void 0 && (e = 0), this.closed)
      return this;
    this.state = t;
    var s = this.id, c = this.scheduler;
    return s != null && (this.id = this.recycleAsyncId(c, s, e)), this.pending = !0, this.delay = e, this.id = (r = this.id) !== null && r !== void 0 ? r : this.requestAsyncId(c, this.id, e), this;
  }, i.prototype.requestAsyncId = function(t, e, r) {
    return r === void 0 && (r = 0), l.setInterval(t.flush.bind(t, this), r);
  }, i.prototype.recycleAsyncId = function(t, e, r) {
    if (r === void 0 && (r = 0), r != null && this.delay === r && this.pending === !1)
      return e;
    e != null && l.clearInterval(e);
  }, i.prototype.execute = function(t, e) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var r = this._execute(t, e);
    if (r)
      return r;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, i.prototype._execute = function(t, e) {
    var r = !1, s;
    try {
      this.work(t);
    } catch (c) {
      r = !0, s = c || new Error("Scheduled action threw falsy error");
    }
    if (r)
      return this.unsubscribe(), s;
  }, i.prototype.unsubscribe = function() {
    if (!this.closed) {
      var t = this, e = t.id, r = t.scheduler, s = r.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, A(s, this), e != null && (this.id = this.recycleAsyncId(r, e, null)), this.delay = null, n.prototype.unsubscribe.call(this);
    }
  }, i;
}(x), v = function() {
  function n(i, t) {
    t === void 0 && (t = n.now), this.schedulerActionCtor = i, this.now = t;
  }
  return n.prototype.schedule = function(i, t, e) {
    return t === void 0 && (t = 0), new this.schedulerActionCtor(this, i).schedule(e, t);
  }, n.now = p.now, n;
}(), O = function(n) {
  a(i, n);
  function i(t, e) {
    e === void 0 && (e = v.now);
    var r = n.call(this, t, e) || this;
    return r.actions = [], r._active = !1, r;
  }
  return i.prototype.flush = function(t) {
    var e = this.actions;
    if (this._active) {
      e.push(t);
      return;
    }
    var r;
    this._active = !0;
    do
      if (r = t.execute(t.state, t.delay))
        break;
    while (t = e.shift());
    if (this._active = !1, r) {
      for (; t = e.shift(); )
        t.unsubscribe();
      throw r;
    }
  }, i;
}(v), U = new O(k), q = U;
function z(n, i) {
  return _(function(t, e) {
    var r = 0;
    t.subscribe(S(e, function(s) {
      e.next(n.call(i, s, r++));
    }));
  });
}
export {
  U as a,
  q as b,
  S as c,
  z as m,
  _ as o
};
