import { i as b, _ as f, l as h } from "./Observable-0eaf2fb8.js";
function p(r) {
  return b(r == null ? void 0 : r.lift);
}
function d(r) {
  return function(e) {
    if (p(e))
      return e.lift(function(t) {
        try {
          return r(t, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function y(r, e, t, n, i) {
  return new v(r, e, t, n, i);
}
var v = function(r) {
  f(e, r);
  function e(t, n, i, u, s, l) {
    var o = r.call(this, t) || this;
    return o.onFinalize = s, o.shouldUnsubscribe = l, o._next = n ? function(c) {
      try {
        n(c);
      } catch (a) {
        t.error(a);
      }
    } : r.prototype._next, o._error = u ? function(c) {
      try {
        u(c);
      } catch (a) {
        t.error(a);
      } finally {
        this.unsubscribe();
      }
    } : r.prototype._error, o._complete = i ? function() {
      try {
        i();
      } catch (c) {
        t.error(c);
      } finally {
        this.unsubscribe();
      }
    } : r.prototype._complete, o;
  }
  return e.prototype.unsubscribe = function() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var n = this.closed;
      r.prototype.unsubscribe.call(this), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }, e;
}(h), m = {
  now: function() {
    return (m.delegate || Date).now();
  },
  delegate: void 0
};
function _(r, e) {
  return d(function(t, n) {
    var i = 0;
    t.subscribe(y(n, function(u) {
      n.next(r.call(e, u, i++));
    }));
  });
}
export {
  y as c,
  m as d,
  _ as m,
  d as o
};
