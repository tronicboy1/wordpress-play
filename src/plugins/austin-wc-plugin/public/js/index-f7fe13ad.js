import { S as a } from "./Subject-24481839.js";
import { _ as i } from "./Observable-0eaf2fb8.js";
var u = function(o) {
  i(t, o);
  function t(e) {
    var r = o.call(this) || this;
    return r._value = e, r;
  }
  return Object.defineProperty(t.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype._subscribe = function(e) {
    var r = o.prototype._subscribe.call(this, e);
    return !r.closed && e.next(this._value), r;
  }, t.prototype.getValue = function() {
    var e = this, r = e.hasError, n = e.thrownError, s = e._value;
    if (r)
      throw n;
    return this._throwIfClosed(), s;
  }, t.prototype.next = function(e) {
    o.prototype.next.call(this, this._value = e);
  }, t;
}(a);
class h extends a {
  set(t) {
    this.next(t);
  }
}
class v extends u {
  set(t) {
    this.next(t);
  }
}
export {
  h as S,
  v as a
};
