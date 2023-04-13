import { css as V, LitElement as G, html as R } from "lit";
import { customElement as Q } from "lit/decorators.js";
import { scan as X, map as Z } from "rxjs";
import { o as N } from "./observer.directive-566fb119.js";
import "lit/directive.js";
import "lit/async-directive.js";
var j = function(n, e) {
  return j = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, r) {
    t.__proto__ = r;
  } || function(t, r) {
    for (var o in r)
      Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o]);
  }, j(n, e);
};
function b(n, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  j(n, e);
  function t() {
    this.constructor = n;
  }
  n.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var W = function() {
  return W = Object.assign || function(e) {
    for (var t, r = 1, o = arguments.length; r < o; r++) {
      t = arguments[r];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, W.apply(this, arguments);
};
function A(n) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && n[e], r = 0;
  if (t)
    return t.call(n);
  if (n && typeof n.length == "number")
    return {
      next: function() {
        return n && r >= n.length && (n = void 0), { value: n && n[r++], done: !n };
      }
    };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function g(n, e) {
  var t = typeof Symbol == "function" && n[Symbol.iterator];
  if (!t)
    return n;
  var r = t.call(n), o, i = [], s;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = r.next()).done; )
      i.push(o.value);
  } catch (u) {
    s = { error: u };
  } finally {
    try {
      o && !o.done && (t = r.return) && t.call(r);
    } finally {
      if (s)
        throw s.error;
    }
  }
  return i;
}
function E(n, e, t) {
  if (t || arguments.length === 2)
    for (var r = 0, o = e.length, i; r < o; r++)
      (i || !(r in e)) && (i || (i = Array.prototype.slice.call(e, 0, r)), i[r] = e[r]);
  return n.concat(i || Array.prototype.slice.call(e));
}
function v(n) {
  return typeof n == "function";
}
function L(n) {
  var e = function(r) {
    Error.call(r), r.stack = new Error().stack;
  }, t = n(e);
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var T = L(function(n) {
  return function(t) {
    n(this), this.message = t ? t.length + ` errors occurred during unsubscription:
` + t.map(function(r, o) {
      return o + 1 + ") " + r.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = t;
  };
});
function I(n, e) {
  if (n) {
    var t = n.indexOf(e);
    0 <= t && n.splice(t, 1);
  }
}
var _ = function() {
  function n(e) {
    this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return n.prototype.unsubscribe = function() {
    var e, t, r, o, i;
    if (!this.closed) {
      this.closed = !0;
      var s = this._parentage;
      if (s)
        if (this._parentage = null, Array.isArray(s))
          try {
            for (var u = A(s), c = u.next(); !c.done; c = u.next()) {
              var a = c.value;
              a.remove(this);
            }
          } catch (f) {
            e = { error: f };
          } finally {
            try {
              c && !c.done && (t = u.return) && t.call(u);
            } finally {
              if (e)
                throw e.error;
            }
          }
        else
          s.remove(this);
      var d = this.initialTeardown;
      if (v(d))
        try {
          d();
        } catch (f) {
          i = f instanceof T ? f.errors : [f];
        }
      var l = this._finalizers;
      if (l) {
        this._finalizers = null;
        try {
          for (var p = A(l), h = p.next(); !h.done; h = p.next()) {
            var y = h.value;
            try {
              $(y);
            } catch (f) {
              i = i ?? [], f instanceof T ? i = E(E([], g(i)), g(f.errors)) : i.push(f);
            }
          }
        } catch (f) {
          r = { error: f };
        } finally {
          try {
            h && !h.done && (o = p.return) && o.call(p);
          } finally {
            if (r)
              throw r.error;
          }
        }
      }
      if (i)
        throw new T(i);
    }
  }, n.prototype.add = function(e) {
    var t;
    if (e && e !== this)
      if (this.closed)
        $(e);
      else {
        if (e instanceof n) {
          if (e.closed || e._hasParent(this))
            return;
          e._addParent(this);
        }
        (this._finalizers = (t = this._finalizers) !== null && t !== void 0 ? t : []).push(e);
      }
  }, n.prototype._hasParent = function(e) {
    var t = this._parentage;
    return t === e || Array.isArray(t) && t.includes(e);
  }, n.prototype._addParent = function(e) {
    var t = this._parentage;
    this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
  }, n.prototype._removeParent = function(e) {
    var t = this._parentage;
    t === e ? this._parentage = null : Array.isArray(t) && I(t, e);
  }, n.prototype.remove = function(e) {
    var t = this._finalizers;
    t && I(t, e), e instanceof n && e._removeParent(this);
  }, n.EMPTY = function() {
    var e = new n();
    return e.closed = !0, e;
  }(), n;
}(), J = _.EMPTY;
function Y(n) {
  return n instanceof _ || n && "closed" in n && v(n.remove) && v(n.add) && v(n.unsubscribe);
}
function $(n) {
  v(n) ? n() : n.unsubscribe();
}
var q = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, C = {
  setTimeout: function(n, e) {
    for (var t = [], r = 2; r < arguments.length; r++)
      t[r - 2] = arguments[r];
    var o = C.delegate;
    return o != null && o.setTimeout ? o.setTimeout.apply(o, E([n, e], g(t))) : setTimeout.apply(void 0, E([n, e], g(t)));
  },
  clearTimeout: function(n) {
    var e = C.delegate;
    return ((e == null ? void 0 : e.clearTimeout) || clearTimeout)(n);
  },
  delegate: void 0
};
function tt(n) {
  C.setTimeout(function() {
    throw n;
  });
}
function M() {
}
function w(n) {
  n();
}
var F = function(n) {
  b(e, n);
  function e(t) {
    var r = n.call(this) || this;
    return r.isStopped = !1, t ? (r.destination = t, Y(t) && t.add(r)) : r.destination = ot, r;
  }
  return e.create = function(t, r, o) {
    return new D(t, r, o);
  }, e.prototype.next = function(t) {
    this.isStopped || this._next(t);
  }, e.prototype.error = function(t) {
    this.isStopped || (this.isStopped = !0, this._error(t));
  }, e.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, e.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, n.prototype.unsubscribe.call(this), this.destination = null);
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
}(_), et = Function.prototype.bind;
function k(n, e) {
  return et.call(n, e);
}
var rt = function() {
  function n(e) {
    this.partialObserver = e;
  }
  return n.prototype.next = function(e) {
    var t = this.partialObserver;
    if (t.next)
      try {
        t.next(e);
      } catch (r) {
        S(r);
      }
  }, n.prototype.error = function(e) {
    var t = this.partialObserver;
    if (t.error)
      try {
        t.error(e);
      } catch (r) {
        S(r);
      }
    else
      S(e);
  }, n.prototype.complete = function() {
    var e = this.partialObserver;
    if (e.complete)
      try {
        e.complete();
      } catch (t) {
        S(t);
      }
  }, n;
}(), D = function(n) {
  b(e, n);
  function e(t, r, o) {
    var i = n.call(this) || this, s;
    if (v(t) || !t)
      s = {
        next: t ?? void 0,
        error: r ?? void 0,
        complete: o ?? void 0
      };
    else {
      var u;
      i && q.useDeprecatedNextContext ? (u = Object.create(t), u.unsubscribe = function() {
        return i.unsubscribe();
      }, s = {
        next: t.next && k(t.next, u),
        error: t.error && k(t.error, u),
        complete: t.complete && k(t.complete, u)
      }) : s = t;
    }
    return i.destination = new rt(s), i;
  }
  return e;
}(F);
function S(n) {
  tt(n);
}
function nt(n) {
  throw n;
}
var ot = {
  closed: !0,
  next: M,
  error: nt,
  complete: M
}, it = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function st(n) {
  return n;
}
function ut(n) {
  return n.length === 0 ? st : n.length === 1 ? n[0] : function(t) {
    return n.reduce(function(r, o) {
      return o(r);
    }, t);
  };
}
var O = function() {
  function n(e) {
    e && (this._subscribe = e);
  }
  return n.prototype.lift = function(e) {
    var t = new n();
    return t.source = this, t.operator = e, t;
  }, n.prototype.subscribe = function(e, t, r) {
    var o = this, i = at(e) ? e : new D(e, t, r);
    return w(function() {
      var s = o, u = s.operator, c = s.source;
      i.add(u ? u.call(i, c) : c ? o._subscribe(i) : o._trySubscribe(i));
    }), i;
  }, n.prototype._trySubscribe = function(e) {
    try {
      return this._subscribe(e);
    } catch (t) {
      e.error(t);
    }
  }, n.prototype.forEach = function(e, t) {
    var r = this;
    return t = z(t), new t(function(o, i) {
      var s = new D({
        next: function(u) {
          try {
            e(u);
          } catch (c) {
            i(c), s.unsubscribe();
          }
        },
        error: i,
        complete: o
      });
      r.subscribe(s);
    });
  }, n.prototype._subscribe = function(e) {
    var t;
    return (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(e);
  }, n.prototype[it] = function() {
    return this;
  }, n.prototype.pipe = function() {
    for (var e = [], t = 0; t < arguments.length; t++)
      e[t] = arguments[t];
    return ut(e)(this);
  }, n.prototype.toPromise = function(e) {
    var t = this;
    return e = z(e), new e(function(r, o) {
      var i;
      t.subscribe(function(s) {
        return i = s;
      }, function(s) {
        return o(s);
      }, function() {
        return r(i);
      });
    });
  }, n.create = function(e) {
    return new n(e);
  }, n;
}();
function z(n) {
  var e;
  return (e = n ?? q.Promise) !== null && e !== void 0 ? e : Promise;
}
function ct(n) {
  return n && v(n.next) && v(n.error) && v(n.complete);
}
function at(n) {
  return n && n instanceof F || ct(n) && Y(n);
}
var ft = L(function(n) {
  return function() {
    n(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), x = function(n) {
  b(e, n);
  function e() {
    var t = n.call(this) || this;
    return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
  }
  return e.prototype.lift = function(t) {
    var r = new U(this, this);
    return r.operator = t, r;
  }, e.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new ft();
  }, e.prototype.next = function(t) {
    var r = this;
    w(function() {
      var o, i;
      if (r._throwIfClosed(), !r.isStopped) {
        r.currentObservers || (r.currentObservers = Array.from(r.observers));
        try {
          for (var s = A(r.currentObservers), u = s.next(); !u.done; u = s.next()) {
            var c = u.value;
            c.next(t);
          }
        } catch (a) {
          o = { error: a };
        } finally {
          try {
            u && !u.done && (i = s.return) && i.call(s);
          } finally {
            if (o)
              throw o.error;
          }
        }
      }
    });
  }, e.prototype.error = function(t) {
    var r = this;
    w(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.hasError = r.isStopped = !0, r.thrownError = t;
        for (var o = r.observers; o.length; )
          o.shift().error(t);
      }
    });
  }, e.prototype.complete = function() {
    var t = this;
    w(function() {
      if (t._throwIfClosed(), !t.isStopped) {
        t.isStopped = !0;
        for (var r = t.observers; r.length; )
          r.shift().complete();
      }
    });
  }, e.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(e.prototype, "observed", {
    get: function() {
      var t;
      return ((t = this.observers) === null || t === void 0 ? void 0 : t.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._trySubscribe = function(t) {
    return this._throwIfClosed(), n.prototype._trySubscribe.call(this, t);
  }, e.prototype._subscribe = function(t) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t);
  }, e.prototype._innerSubscribe = function(t) {
    var r = this, o = this, i = o.hasError, s = o.isStopped, u = o.observers;
    return i || s ? J : (this.currentObservers = null, u.push(t), new _(function() {
      r.currentObservers = null, I(u, t);
    }));
  }, e.prototype._checkFinalizedStatuses = function(t) {
    var r = this, o = r.hasError, i = r.thrownError, s = r.isStopped;
    o ? t.error(i) : s && t.complete();
  }, e.prototype.asObservable = function() {
    var t = new O();
    return t.source = this, t;
  }, e.create = function(t, r) {
    return new U(t, r);
  }, e;
}(O), U = function(n) {
  b(e, n);
  function e(t, r) {
    var o = n.call(this) || this;
    return o.destination = t, o.source = r, o;
  }
  return e.prototype.next = function(t) {
    var r, o;
    (o = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null || o === void 0 || o.call(r, t);
  }, e.prototype.error = function(t) {
    var r, o;
    (o = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null || o === void 0 || o.call(r, t);
  }, e.prototype.complete = function() {
    var t, r;
    (r = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || r === void 0 || r.call(t);
  }, e.prototype._subscribe = function(t) {
    var r, o;
    return (o = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(t)) !== null && o !== void 0 ? o : J;
  }, e;
}(x), H = {
  now: function() {
    return (H.delegate || Date).now();
  },
  delegate: void 0
}, P = function(n) {
  b(e, n);
  function e(t, r, o) {
    t === void 0 && (t = 1 / 0), r === void 0 && (r = 1 / 0), o === void 0 && (o = H);
    var i = n.call(this) || this;
    return i._bufferSize = t, i._windowTime = r, i._timestampProvider = o, i._buffer = [], i._infiniteTimeWindow = !0, i._infiniteTimeWindow = r === 1 / 0, i._bufferSize = Math.max(1, t), i._windowTime = Math.max(1, r), i;
  }
  return e.prototype.next = function(t) {
    var r = this, o = r.isStopped, i = r._buffer, s = r._infiniteTimeWindow, u = r._timestampProvider, c = r._windowTime;
    o || (i.push(t), !s && i.push(u.now() + c)), this._trimBuffer(), n.prototype.next.call(this, t);
  }, e.prototype._subscribe = function(t) {
    this._throwIfClosed(), this._trimBuffer();
    for (var r = this._innerSubscribe(t), o = this, i = o._infiniteTimeWindow, s = o._buffer, u = s.slice(), c = 0; c < u.length && !t.closed; c += i ? 1 : 2)
      t.next(u[c]);
    return this._checkFinalizedStatuses(t), r;
  }, e.prototype._trimBuffer = function() {
    var t = this, r = t._bufferSize, o = t._timestampProvider, i = t._buffer, s = t._infiniteTimeWindow, u = (s ? 1 : 2) * r;
    if (r < 1 / 0 && u < i.length && i.splice(0, i.length - u), !s) {
      for (var c = o.now(), a = 0, d = 1; d < i.length && i[d] <= c; d += 2)
        a = d;
      a && i.splice(0, a + 1);
    }
  }, e;
}(x), lt = {
  url: "",
  deserializer: function(n) {
    return JSON.parse(n.data);
  },
  serializer: function(n) {
    return JSON.stringify(n);
  }
}, pt = "WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }", ht = function(n) {
  b(e, n);
  function e(t, r) {
    var o = n.call(this) || this;
    if (o._socket = null, t instanceof O)
      o.destination = r, o.source = t;
    else {
      var i = o._config = W({}, lt);
      if (o._output = new x(), typeof t == "string")
        i.url = t;
      else
        for (var s in t)
          t.hasOwnProperty(s) && (i[s] = t[s]);
      if (!i.WebSocketCtor && WebSocket)
        i.WebSocketCtor = WebSocket;
      else if (!i.WebSocketCtor)
        throw new Error("no WebSocket constructor can be found");
      o.destination = new P();
    }
    return o;
  }
  return e.prototype.lift = function(t) {
    var r = new e(this._config, this.destination);
    return r.operator = t, r.source = this, r;
  }, e.prototype._resetState = function() {
    this._socket = null, this.source || (this.destination = new P()), this._output = new x();
  }, e.prototype.multiplex = function(t, r, o) {
    var i = this;
    return new O(function(s) {
      try {
        i.next(t());
      } catch (c) {
        s.error(c);
      }
      var u = i.subscribe({
        next: function(c) {
          try {
            o(c) && s.next(c);
          } catch (a) {
            s.error(a);
          }
        },
        error: function(c) {
          return s.error(c);
        },
        complete: function() {
          return s.complete();
        }
      });
      return function() {
        try {
          i.next(r());
        } catch (c) {
          s.error(c);
        }
        u.unsubscribe();
      };
    });
  }, e.prototype._connectSocket = function() {
    var t = this, r = this._config, o = r.WebSocketCtor, i = r.protocol, s = r.url, u = r.binaryType, c = this._output, a = null;
    try {
      a = i ? new o(s, i) : new o(s), this._socket = a, u && (this._socket.binaryType = u);
    } catch (l) {
      c.error(l);
      return;
    }
    var d = new _(function() {
      t._socket = null, a && a.readyState === 1 && a.close();
    });
    a.onopen = function(l) {
      var p = t._socket;
      if (!p) {
        a.close(), t._resetState();
        return;
      }
      var h = t._config.openObserver;
      h && h.next(l);
      var y = t.destination;
      t.destination = F.create(function(f) {
        if (a.readyState === 1)
          try {
            var m = t._config.serializer;
            a.send(m(f));
          } catch (K) {
            t.destination.error(K);
          }
      }, function(f) {
        var m = t._config.closingObserver;
        m && m.next(void 0), f && f.code ? a.close(f.code, f.reason) : c.error(new TypeError(pt)), t._resetState();
      }, function() {
        var f = t._config.closingObserver;
        f && f.next(void 0), a.close(), t._resetState();
      }), y && y instanceof P && d.add(y.subscribe(t.destination));
    }, a.onerror = function(l) {
      t._resetState(), c.error(l);
    }, a.onclose = function(l) {
      a === t._socket && t._resetState();
      var p = t._config.closeObserver;
      p && p.next(l), l.wasClean ? c.complete() : c.error(l);
    }, a.onmessage = function(l) {
      try {
        var p = t._config.deserializer;
        c.next(p(l));
      } catch (h) {
        c.error(h);
      }
    };
  }, e.prototype._subscribe = function(t) {
    var r = this, o = this.source;
    return o ? o.subscribe(t) : (this._socket || this._connectSocket(), this._output.subscribe(t), t.add(function() {
      var i = r._socket;
      r._output.observers.length === 0 && (i && (i.readyState === 1 || i.readyState === 0) && i.close(), r._resetState());
    }), t);
  }, e.prototype.unsubscribe = function() {
    var t = this._socket;
    t && (t.readyState === 1 || t.readyState === 0) && t.close(), this._resetState(), n.prototype.unsubscribe.call(this);
  }, e;
}(U);
function dt(n) {
  return new ht(n);
}
var vt = Object.defineProperty, bt = Object.getOwnPropertyDescriptor, yt = (n, e, t, r) => {
  for (var o = r > 1 ? void 0 : r ? bt(e, t) : e, i = n.length - 1, s; i >= 0; i--)
    (s = n[i]) && (o = (r ? s(e, t, o) : s(o)) || o);
  return r && o && vt(e, t, o), o;
};
const _t = "wc-lit-websocket";
let B = class extends G {
  constructor() {
    super(...arguments), this.socket$ = dt({
      url: "ws://localhost:5200",
      protocol: "echo-protocol"
    }), this.messages$ = this.socket$.pipe(X((n, e) => [e, ...n], []));
  }
  handleSubmit(n) {
    n.preventDefault();
    const e = n.target, r = new FormData(e).get("message");
    r && typeof r == "string" && (this.socket$.next(r), e.reset());
  }
  render() {
    return R`<h1>Lit Websocket Demo</h1>
      <ul>
        ${N(this.messages$.pipe(Z((n) => n.map((e) => R`<li>${e}</li>`))))}
      </ul>
      <form @submit=${this.handleSubmit}>
        <label for="message">New Message</label>
        <input autofocus type="text" maxlength="255" required name="message" id="message" autocomplete="off" />
        <button type="submit">Send</button>
      </form> `;
  }
};
B.styles = [
  V`
      :host {
        display: block;
      }
    `
];
B = yt([
  Q(_t)
], B);
export {
  B as WcLitWebsocket
};
