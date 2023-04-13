import { m as d, _ as h, p as a, E as p, a as b, d as _, O as l, h as y } from "./Observable-1fac79e7.js";
var S = d(function(s) {
  return function() {
    s(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), w = function(s) {
  h(o, s);
  function o() {
    var r = s.call(this) || this;
    return r.closed = !1, r.currentObservers = null, r.observers = [], r.isStopped = !1, r.hasError = !1, r.thrownError = null, r;
  }
  return o.prototype.lift = function(r) {
    var t = new c(this, this);
    return t.operator = r, t;
  }, o.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new S();
  }, o.prototype.next = function(r) {
    var t = this;
    a(function() {
      var e, u;
      if (t._throwIfClosed(), !t.isStopped) {
        t.currentObservers || (t.currentObservers = Array.from(t.observers));
        try {
          for (var n = y(t.currentObservers), i = n.next(); !i.done; i = n.next()) {
            var v = i.value;
            v.next(r);
          }
        } catch (f) {
          e = { error: f };
        } finally {
          try {
            i && !i.done && (u = n.return) && u.call(n);
          } finally {
            if (e)
              throw e.error;
          }
        }
      }
    });
  }, o.prototype.error = function(r) {
    var t = this;
    a(function() {
      if (t._throwIfClosed(), !t.isStopped) {
        t.hasError = t.isStopped = !0, t.thrownError = r;
        for (var e = t.observers; e.length; )
          e.shift().error(r);
      }
    });
  }, o.prototype.complete = function() {
    var r = this;
    a(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.isStopped = !0;
        for (var t = r.observers; t.length; )
          t.shift().complete();
      }
    });
  }, o.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(o.prototype, "observed", {
    get: function() {
      var r;
      return ((r = this.observers) === null || r === void 0 ? void 0 : r.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), o.prototype._trySubscribe = function(r) {
    return this._throwIfClosed(), s.prototype._trySubscribe.call(this, r);
  }, o.prototype._subscribe = function(r) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(r), this._innerSubscribe(r);
  }, o.prototype._innerSubscribe = function(r) {
    var t = this, e = this, u = e.hasError, n = e.isStopped, i = e.observers;
    return u || n ? p : (this.currentObservers = null, i.push(r), new b(function() {
      t.currentObservers = null, _(i, r);
    }));
  }, o.prototype._checkFinalizedStatuses = function(r) {
    var t = this, e = t.hasError, u = t.thrownError, n = t.isStopped;
    e ? r.error(u) : n && r.complete();
  }, o.prototype.asObservable = function() {
    var r = new l();
    return r.source = this, r;
  }, o.create = function(r, t) {
    return new c(r, t);
  }, o;
}(l), c = function(s) {
  h(o, s);
  function o(r, t) {
    var e = s.call(this) || this;
    return e.destination = r, e.source = t, e;
  }
  return o.prototype.next = function(r) {
    var t, e;
    (e = (t = this.destination) === null || t === void 0 ? void 0 : t.next) === null || e === void 0 || e.call(t, r);
  }, o.prototype.error = function(r) {
    var t, e;
    (e = (t = this.destination) === null || t === void 0 ? void 0 : t.error) === null || e === void 0 || e.call(t, r);
  }, o.prototype.complete = function() {
    var r, t;
    (t = (r = this.destination) === null || r === void 0 ? void 0 : r.complete) === null || t === void 0 || t.call(r);
  }, o.prototype._subscribe = function(r) {
    var t, e;
    return (e = (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(r)) !== null && e !== void 0 ? e : p;
  }, o;
}(w);
export {
  c as A,
  w as S
};
