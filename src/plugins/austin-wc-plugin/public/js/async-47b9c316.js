import { _ as l, h as f, l as a, m as o, j as v } from "./Observable-fdef4a06.js";
var d = {
  now: function() {
    return (d.delegate || Date).now();
  },
  delegate: void 0
}, p = function(n) {
  l(i, n);
  function i(t, r) {
    return n.call(this) || this;
  }
  return i.prototype.schedule = function(t, r) {
    return this;
  }, i;
}(f), c = {
  setInterval: function(n, i) {
    for (var t = [], r = 2; r < arguments.length; r++)
      t[r - 2] = arguments[r];
    var e = c.delegate;
    return e != null && e.setInterval ? e.setInterval.apply(e, a([n, i], o(t))) : setInterval.apply(void 0, a([n, i], o(t)));
  },
  clearInterval: function(n) {
    var i = c.delegate;
    return ((i == null ? void 0 : i.clearInterval) || clearInterval)(n);
  },
  delegate: void 0
}, y = function(n) {
  l(i, n);
  function i(t, r) {
    var e = n.call(this, t, r) || this;
    return e.scheduler = t, e.work = r, e.pending = !1, e;
  }
  return i.prototype.schedule = function(t, r) {
    var e;
    if (r === void 0 && (r = 0), this.closed)
      return this;
    this.state = t;
    var s = this.id, u = this.scheduler;
    return s != null && (this.id = this.recycleAsyncId(u, s, r)), this.pending = !0, this.delay = r, this.id = (e = this.id) !== null && e !== void 0 ? e : this.requestAsyncId(u, this.id, r), this;
  }, i.prototype.requestAsyncId = function(t, r, e) {
    return e === void 0 && (e = 0), c.setInterval(t.flush.bind(t, this), e);
  }, i.prototype.recycleAsyncId = function(t, r, e) {
    if (e === void 0 && (e = 0), e != null && this.delay === e && this.pending === !1)
      return r;
    r != null && c.clearInterval(r);
  }, i.prototype.execute = function(t, r) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var e = this._execute(t, r);
    if (e)
      return e;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, i.prototype._execute = function(t, r) {
    var e = !1, s;
    try {
      this.work(t);
    } catch (u) {
      e = !0, s = u || new Error("Scheduled action threw falsy error");
    }
    if (e)
      return this.unsubscribe(), s;
  }, i.prototype.unsubscribe = function() {
    if (!this.closed) {
      var t = this, r = t.id, e = t.scheduler, s = e.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, v(s, this), r != null && (this.id = this.recycleAsyncId(e, r, null)), this.delay = null, n.prototype.unsubscribe.call(this);
    }
  }, i;
}(p), h = function() {
  function n(i, t) {
    t === void 0 && (t = n.now), this.schedulerActionCtor = i, this.now = t;
  }
  return n.prototype.schedule = function(i, t, r) {
    return t === void 0 && (t = 0), new this.schedulerActionCtor(this, i).schedule(r, t);
  }, n.now = d.now, n;
}(), g = function(n) {
  l(i, n);
  function i(t, r) {
    r === void 0 && (r = h.now);
    var e = n.call(this, t, r) || this;
    return e.actions = [], e._active = !1, e;
  }
  return i.prototype.flush = function(t) {
    var r = this.actions;
    if (this._active) {
      r.push(t);
      return;
    }
    var e;
    this._active = !0;
    do
      if (e = t.execute(t.state, t.delay))
        break;
    while (t = r.shift());
    if (this._active = !1, e) {
      for (; t = r.shift(); )
        t.unsubscribe();
      throw e;
    }
  }, i;
}(h), A = new g(y), w = A;
export {
  A as a,
  w as b
};
