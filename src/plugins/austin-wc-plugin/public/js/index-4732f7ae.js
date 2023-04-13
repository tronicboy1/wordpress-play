import { f as d, g as l, h as a, E as v, S as _, j as y, O as h, c as S } from "./Observable-80c792d5.js";
var w = d(function(n) {
  return function() {
    n(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), c = function(n) {
  l(e, n);
  function e() {
    var r = n.call(this) || this;
    return r.closed = !1, r.currentObservers = null, r.observers = [], r.isStopped = !1, r.hasError = !1, r.thrownError = null, r;
  }
  return e.prototype.lift = function(r) {
    var t = new p(this, this);
    return t.operator = r, t;
  }, e.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new w();
  }, e.prototype.next = function(r) {
    var t = this;
    a(function() {
      var o, s;
      if (t._throwIfClosed(), !t.isStopped) {
        t.currentObservers || (t.currentObservers = Array.from(t.observers));
        try {
          for (var i = S(t.currentObservers), u = i.next(); !u.done; u = i.next()) {
            var f = u.value;
            f.next(r);
          }
        } catch (b) {
          o = { error: b };
        } finally {
          try {
            u && !u.done && (s = i.return) && s.call(i);
          } finally {
            if (o)
              throw o.error;
          }
        }
      }
    });
  }, e.prototype.error = function(r) {
    var t = this;
    a(function() {
      if (t._throwIfClosed(), !t.isStopped) {
        t.hasError = t.isStopped = !0, t.thrownError = r;
        for (var o = t.observers; o.length; )
          o.shift().error(r);
      }
    });
  }, e.prototype.complete = function() {
    var r = this;
    a(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.isStopped = !0;
        for (var t = r.observers; t.length; )
          t.shift().complete();
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
    return this._throwIfClosed(), n.prototype._trySubscribe.call(this, r);
  }, e.prototype._subscribe = function(r) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(r), this._innerSubscribe(r);
  }, e.prototype._innerSubscribe = function(r) {
    var t = this, o = this, s = o.hasError, i = o.isStopped, u = o.observers;
    return s || i ? v : (this.currentObservers = null, u.push(r), new _(function() {
      t.currentObservers = null, y(u, r);
    }));
  }, e.prototype._checkFinalizedStatuses = function(r) {
    var t = this, o = t.hasError, s = t.thrownError, i = t.isStopped;
    o ? r.error(s) : i && r.complete();
  }, e.prototype.asObservable = function() {
    var r = new h();
    return r.source = this, r;
  }, e.create = function(r, t) {
    return new p(r, t);
  }, e;
}(h), p = function(n) {
  l(e, n);
  function e(r, t) {
    var o = n.call(this) || this;
    return o.destination = r, o.source = t, o;
  }
  return e.prototype.next = function(r) {
    var t, o;
    (o = (t = this.destination) === null || t === void 0 ? void 0 : t.next) === null || o === void 0 || o.call(t, r);
  }, e.prototype.error = function(r) {
    var t, o;
    (o = (t = this.destination) === null || t === void 0 ? void 0 : t.error) === null || o === void 0 || o.call(t, r);
  }, e.prototype.complete = function() {
    var r, t;
    (t = (r = this.destination) === null || r === void 0 ? void 0 : r.complete) === null || t === void 0 || t.call(r);
  }, e.prototype._subscribe = function(r) {
    var t, o;
    return (o = (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(r)) !== null && o !== void 0 ? o : v;
  }, e;
}(c), E = function(n) {
  l(e, n);
  function e(r) {
    var t = n.call(this) || this;
    return t._value = r, t;
  }
  return Object.defineProperty(e.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._subscribe = function(r) {
    var t = n.prototype._subscribe.call(this, r);
    return !t.closed && r.next(this._value), t;
  }, e.prototype.getValue = function() {
    var r = this, t = r.hasError, o = r.thrownError, s = r._value;
    if (t)
      throw o;
    return this._throwIfClosed(), s;
  }, e.prototype.next = function(r) {
    n.prototype.next.call(this, this._value = r);
  }, e;
}(c);
class m extends c {
  set(e) {
    this.next(e);
  }
}
class x extends E {
  set(e) {
    this.next(e);
  }
}
export {
  m as S,
  x as a
};
