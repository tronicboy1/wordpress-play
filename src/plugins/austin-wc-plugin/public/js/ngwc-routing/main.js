var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// node_modules/rxjs/dist/esm/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  const _super = (instance) => {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  const ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass((_super) => function UnsubscriptionErrorImpl(errors) {
  _super(this);
  this.message = errors ? `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join("\n  ")}` : "";
  this.name = "UnsubscriptionError";
  this.errors = errors;
});

// node_modules/rxjs/dist/esm/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    const index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm/internal/Subscription.js
var Subscription = class {
  constructor(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  unsubscribe() {
    let errors;
    if (!this.closed) {
      this.closed = true;
      const {
        _parentage
      } = this;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          for (const parent of _parentage) {
            parent.remove(this);
          }
        } else {
          _parentage.remove(this);
        }
      }
      const {
        initialTeardown: initialFinalizer
      } = this;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      const {
        _finalizers
      } = this;
      if (_finalizers) {
        this._finalizers = null;
        for (const finalizer of _finalizers) {
          try {
            execFinalizer(finalizer);
          } catch (err) {
            errors = errors !== null && errors !== void 0 ? errors : [];
            if (err instanceof UnsubscriptionError) {
              errors = [...errors, ...err.errors];
            } else {
              errors.push(err);
            }
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  }
  add(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  }
  _hasParent(parent) {
    const {
      _parentage
    } = this;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  }
  _addParent(parent) {
    const {
      _parentage
    } = this;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  }
  _removeParent(parent) {
    const {
      _parentage
    } = this;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  }
  remove(teardown) {
    const {
      _finalizers
    } = this;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription) {
      teardown._removeParent(this);
    }
  }
};
Subscription.EMPTY = (() => {
  const empty = new Subscription();
  empty.closed = true;
  return empty;
})();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout(handler, timeout, ...args) {
    const {
      delegate
    } = timeoutProvider;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout(handler, timeout, ...args);
    }
    return setTimeout(handler, timeout, ...args);
  },
  clearTimeout(handle) {
    const {
      delegate
    } = timeoutProvider;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(() => {
    const {
      onUnhandledError
    } = config;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = (() => createNotification("C", void 0, void 0))();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    const isRoot = !context;
    if (isRoot) {
      context = {
        errorThrown: false,
        error: null
      };
    }
    cb();
    if (isRoot) {
      const {
        errorThrown,
        error
      } = context;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}

// node_modules/rxjs/dist/esm/internal/Subscriber.js
var Subscriber = class extends Subscription {
  constructor(destination) {
    super();
    this.isStopped = false;
    if (destination) {
      this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(this);
      }
    } else {
      this.destination = EMPTY_OBSERVER;
    }
  }
  static create(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  }
  next(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  }
  error(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  }
  complete() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  }
  unsubscribe() {
    if (!this.closed) {
      this.isStopped = true;
      super.unsubscribe();
      this.destination = null;
    }
  }
  _next(value) {
    this.destination.next(value);
  }
  _error(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  }
  _complete() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }
};
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = class {
  constructor(partialObserver) {
    this.partialObserver = partialObserver;
  }
  next(value) {
    const {
      partialObserver
    } = this;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  }
  error(err) {
    const {
      partialObserver
    } = this;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  }
  complete() {
    const {
      partialObserver
    } = this;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  }
};
var SafeSubscriber = class extends Subscriber {
  constructor(observerOrNext, error, complete) {
    super();
    let partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      let context2;
      if (this && config.useDeprecatedNextContext) {
        context2 = Object.create(observerOrNext);
        context2.unsubscribe = () => this.unsubscribe();
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context2),
          error: observerOrNext.error && bind(observerOrNext.error, context2),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context2)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    this.destination = new ConsumerObserver(partialObserver);
  }
};
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  const {
    onStoppedNotification
  } = config;
  onStoppedNotification && timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm/internal/symbol/observable.js
var observable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();

// node_modules/rxjs/dist/esm/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm/internal/util/pipe.js
function pipe(...fns) {
  return pipeFromArray(fns);
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}

// node_modules/rxjs/dist/esm/internal/Observable.js
var Observable = /* @__PURE__ */ (() => {
  class Observable2 {
    constructor(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    lift(operator) {
      const observable2 = new Observable2();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    }
    subscribe(observerOrNext, error, complete) {
      const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(() => {
        const {
          operator,
          source
        } = this;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? this._subscribe(subscriber) : this._trySubscribe(subscriber));
      });
      return subscriber;
    }
    _trySubscribe(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    }
    forEach(next, promiseCtor) {
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor((resolve, reject) => {
        const subscriber = new SafeSubscriber({
          next: (value) => {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        this.subscribe(subscriber);
      });
    }
    _subscribe(subscriber) {
      var _a;
      return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    }
    [observable]() {
      return this;
    }
    pipe(...operations) {
      return pipeFromArray(operations)(this);
    }
    toPromise(promiseCtor) {
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor((resolve, reject) => {
        let value;
        this.subscribe((x) => value = x, (err) => reject(err), () => resolve(value));
      });
    }
  }
  Observable2.create = (subscribe) => {
    return new Observable2(subscribe);
  };
  return Observable2;
})();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return (source) => {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/rxjs/dist/esm/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = class extends Subscriber {
  constructor(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    super(destination);
    this.onFinalize = onFinalize;
    this.shouldUnsubscribe = shouldUnsubscribe;
    this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : super._next;
    this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : super._error;
    this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : super._complete;
  }
  unsubscribe() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      const {
        closed
      } = this;
      super.unsubscribe();
      !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  }
};

// node_modules/rxjs/dist/esm/internal/operators/refCount.js
function refCount() {
  return operate((source, subscriber) => {
    let connection = null;
    source._refCount++;
    const refCounter = createOperatorSubscriber(subscriber, void 0, void 0, void 0, () => {
      if (!source || source._refCount <= 0 || 0 < --source._refCount) {
        connection = null;
        return;
      }
      const sharedConnection = source._connection;
      const conn = connection;
      connection = null;
      if (sharedConnection && (!conn || sharedConnection === conn)) {
        sharedConnection.unsubscribe();
      }
      subscriber.unsubscribe();
    });
    source.subscribe(refCounter);
    if (!refCounter.closed) {
      connection = source.connect();
    }
  });
}

// node_modules/rxjs/dist/esm/internal/observable/ConnectableObservable.js
var ConnectableObservable = class extends Observable {
  constructor(source, subjectFactory) {
    super();
    this.source = source;
    this.subjectFactory = subjectFactory;
    this._subject = null;
    this._refCount = 0;
    this._connection = null;
    if (hasLift(source)) {
      this.lift = source.lift;
    }
  }
  _subscribe(subscriber) {
    return this.getSubject().subscribe(subscriber);
  }
  getSubject() {
    const subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  }
  _teardown() {
    this._refCount = 0;
    const {
      _connection
    } = this;
    this._subject = this._connection = null;
    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
  }
  connect() {
    let connection = this._connection;
    if (!connection) {
      connection = this._connection = new Subscription();
      const subject = this.getSubject();
      connection.add(this.source.subscribe(createOperatorSubscriber(subject, void 0, () => {
        this._teardown();
        subject.complete();
      }, (err) => {
        this._teardown();
        subject.error(err);
      }, () => this._teardown())));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }
    return connection;
  }
  refCount() {
    return refCount()(this);
  }
};

// node_modules/rxjs/dist/esm/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass((_super) => function ObjectUnsubscribedErrorImpl() {
  _super(this);
  this.name = "ObjectUnsubscribedError";
  this.message = "object unsubscribed";
});

// node_modules/rxjs/dist/esm/internal/Subject.js
var Subject = /* @__PURE__ */ (() => {
  class Subject2 extends Observable {
    constructor() {
      super();
      this.closed = false;
      this.currentObservers = null;
      this.observers = [];
      this.isStopped = false;
      this.hasError = false;
      this.thrownError = null;
    }
    lift(operator) {
      const subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    }
    _throwIfClosed() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
    }
    next(value) {
      errorContext(() => {
        this._throwIfClosed();
        if (!this.isStopped) {
          if (!this.currentObservers) {
            this.currentObservers = Array.from(this.observers);
          }
          for (const observer of this.currentObservers) {
            observer.next(value);
          }
        }
      });
    }
    error(err) {
      errorContext(() => {
        this._throwIfClosed();
        if (!this.isStopped) {
          this.hasError = this.isStopped = true;
          this.thrownError = err;
          const {
            observers
          } = this;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    }
    complete() {
      errorContext(() => {
        this._throwIfClosed();
        if (!this.isStopped) {
          this.isStopped = true;
          const {
            observers
          } = this;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    }
    unsubscribe() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    }
    get observed() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    _trySubscribe(subscriber) {
      this._throwIfClosed();
      return super._trySubscribe(subscriber);
    }
    _subscribe(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    }
    _innerSubscribe(subscriber) {
      const {
        hasError,
        isStopped,
        observers
      } = this;
      if (hasError || isStopped) {
        return EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription(() => {
        this.currentObservers = null;
        arrRemove(observers, subscriber);
      });
    }
    _checkFinalizedStatuses(subscriber) {
      const {
        hasError,
        thrownError,
        isStopped
      } = this;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    }
    asObservable() {
      const observable2 = new Observable();
      observable2.source = this;
      return observable2;
    }
  }
  Subject2.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
})();
var AnonymousSubject = class extends Subject {
  constructor(destination, source) {
    super();
    this.destination = destination;
    this.source = source;
  }
  next(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  }
  error(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  }
  complete() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  }
  _subscribe(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  }
};

// node_modules/rxjs/dist/esm/internal/BehaviorSubject.js
var BehaviorSubject = class extends Subject {
  constructor(_value) {
    super();
    this._value = _value;
  }
  get value() {
    return this.getValue();
  }
  _subscribe(subscriber) {
    const subscription = super._subscribe(subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  }
  getValue() {
    const {
      hasError,
      thrownError,
      _value
    } = this;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  }
  next(value) {
    super.next(this._value = value);
  }
};

// node_modules/rxjs/dist/esm/internal/scheduler/dateTimestampProvider.js
var dateTimestampProvider = {
  now() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm/internal/ReplaySubject.js
var ReplaySubject = class extends Subject {
  constructor(_bufferSize = Infinity, _windowTime = Infinity, _timestampProvider = dateTimestampProvider) {
    super();
    this._bufferSize = _bufferSize;
    this._windowTime = _windowTime;
    this._timestampProvider = _timestampProvider;
    this._buffer = [];
    this._infiniteTimeWindow = true;
    this._infiniteTimeWindow = _windowTime === Infinity;
    this._bufferSize = Math.max(1, _bufferSize);
    this._windowTime = Math.max(1, _windowTime);
  }
  next(value) {
    const {
      isStopped,
      _buffer,
      _infiniteTimeWindow,
      _timestampProvider,
      _windowTime
    } = this;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    super.next(value);
  }
  _subscribe(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    const subscription = this._innerSubscribe(subscriber);
    const {
      _infiniteTimeWindow,
      _buffer
    } = this;
    const copy = _buffer.slice();
    for (let i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  }
  _trimBuffer() {
    const {
      _bufferSize,
      _timestampProvider,
      _buffer,
      _infiniteTimeWindow
    } = this;
    const adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      const now = _timestampProvider.now();
      let last4 = 0;
      for (let i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last4 = i;
      }
      last4 && _buffer.splice(0, last4 + 1);
    }
  }
};

// node_modules/rxjs/dist/esm/internal/observable/empty.js
var EMPTY = new Observable((subscriber) => subscriber.complete());

// node_modules/rxjs/dist/esm/internal/util/isScheduler.js
function isScheduler(value) {
  return value && isFunction(value.schedule);
}

// node_modules/rxjs/dist/esm/internal/util/args.js
function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}

// node_modules/tslib/tslib.es6.js
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return {
          value: o && o[i++],
          done: !o
        };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({
        value: v2,
        done: d
      });
    }, reject);
  }
}

// node_modules/rxjs/dist/esm/internal/util/isArrayLike.js
var isArrayLike = (x) => x && typeof x.length === "number" && typeof x !== "function";

// node_modules/rxjs/dist/esm/internal/util/isPromise.js
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

// node_modules/rxjs/dist/esm/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm/internal/util/isAsyncIterable.js
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError(`You provided ${input !== null && typeof input === "object" ? "an invalid object" : `'${input}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
}

// node_modules/rxjs/dist/esm/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

// node_modules/rxjs/dist/esm/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function* readableStreamLikeToAsyncGenerator_1() {
    const reader = readableStream.getReader();
    try {
      while (true) {
        const {
          value,
          done
        } = yield __await(reader.read());
        if (done) {
          return yield __await(void 0);
        }
        yield yield __await(value);
      }
    } finally {
      reader.releaseLock();
    }
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

// node_modules/rxjs/dist/esm/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable((subscriber) => {
    const obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable((subscriber) => {
    for (let i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise2) {
  return new Observable((subscriber) => {
    promise2.then((value) => {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, (err) => subscriber.error(err)).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable((subscriber) => {
    for (const value of iterable) {
      subscriber.next(value);
      if (subscriber.closed) {
        return;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable((subscriber) => {
    process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_1, _a;
  return __awaiter(this, void 0, void 0, function* () {
    try {
      for (asyncIterable_1 = __asyncValues(asyncIterable); asyncIterable_1_1 = yield asyncIterable_1.next(), !asyncIterable_1_1.done; ) {
        const value = asyncIterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))
          yield _a.call(asyncIterable_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    subscriber.complete();
  });
}

// node_modules/rxjs/dist/esm/internal/util/executeSchedule.js
function executeSchedule(parentSubscription, scheduler2, work, delay = 0, repeat = false) {
  const scheduleSubscription = scheduler2.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay));
    } else {
      this.unsubscribe();
    }
  }, delay);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}

// node_modules/rxjs/dist/esm/internal/operators/observeOn.js
function observeOn(scheduler2, delay = 0) {
  return operate((source, subscriber) => {
    source.subscribe(createOperatorSubscriber(subscriber, (value) => executeSchedule(subscriber, scheduler2, () => subscriber.next(value), delay), () => executeSchedule(subscriber, scheduler2, () => subscriber.complete(), delay), (err) => executeSchedule(subscriber, scheduler2, () => subscriber.error(err), delay)));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/subscribeOn.js
function subscribeOn(scheduler2, delay = 0) {
  return operate((source, subscriber) => {
    subscriber.add(scheduler2.schedule(() => source.subscribe(subscriber), delay));
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleObservable.js
function scheduleObservable(input, scheduler2) {
  return innerFrom(input).pipe(subscribeOn(scheduler2), observeOn(scheduler2));
}

// node_modules/rxjs/dist/esm/internal/scheduled/schedulePromise.js
function schedulePromise(input, scheduler2) {
  return innerFrom(input).pipe(subscribeOn(scheduler2), observeOn(scheduler2));
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleArray.js
function scheduleArray(input, scheduler2) {
  return new Observable((subscriber) => {
    let i = 0;
    return scheduler2.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleIterable.js
function scheduleIterable(input, scheduler2) {
  return new Observable((subscriber) => {
    let iterator2;
    executeSchedule(subscriber, scheduler2, () => {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler2, () => {
        let value;
        let done;
        try {
          ({
            value,
            done
          } = iterator2.next());
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return () => isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleAsyncIterable.js
function scheduleAsyncIterable(input, scheduler2) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable((subscriber) => {
    executeSchedule(subscriber, scheduler2, () => {
      const iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler2, () => {
        iterator2.next().then((result) => {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduleReadableStreamLike.js
function scheduleReadableStreamLike(input, scheduler2) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler2);
}

// node_modules/rxjs/dist/esm/internal/scheduled/scheduled.js
function scheduled(input, scheduler2) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler2);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler2);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler2);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler2);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler2);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler2);
    }
  }
  throw createInvalidObservableTypeError(input);
}

// node_modules/rxjs/dist/esm/internal/observable/from.js
function from(input, scheduler2) {
  return scheduler2 ? scheduled(input, scheduler2) : innerFrom(input);
}

// node_modules/rxjs/dist/esm/internal/observable/of.js
function of(...args) {
  const scheduler2 = popScheduler(args);
  return from(args, scheduler2);
}

// node_modules/rxjs/dist/esm/internal/observable/throwError.js
function throwError(errorOrErrorFactory, scheduler2) {
  const errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : () => errorOrErrorFactory;
  const init = (subscriber) => subscriber.error(errorFactory());
  return new Observable(scheduler2 ? (subscriber) => scheduler2.schedule(init, 0, subscriber) : init);
}

// node_modules/rxjs/dist/esm/internal/util/EmptyError.js
var EmptyError = createErrorClass((_super) => function EmptyErrorImpl() {
  _super(this);
  this.name = "EmptyError";
  this.message = "no elements in sequence";
});

// node_modules/rxjs/dist/esm/internal/operators/map.js
function map(project, thisArg) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/util/mapOneOrManyArgs.js
var {
  isArray
} = Array;
function callOrApply(fn, args) {
  return isArray(args) ? fn(...args) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map((args) => callOrApply(fn, args));
}

// node_modules/rxjs/dist/esm/internal/util/argsArgArrayOrObject.js
var {
  isArray: isArray2
} = Array;
var {
  getPrototypeOf,
  prototype: objectProto,
  keys: getKeys
} = Object;
function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    const first2 = args[0];
    if (isArray2(first2)) {
      return {
        args: first2,
        keys: null
      };
    }
    if (isPOJO(first2)) {
      const keys = getKeys(first2);
      return {
        args: keys.map((key) => first2[key]),
        keys
      };
    }
  }
  return {
    args,
    keys: null
  };
}
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}

// node_modules/rxjs/dist/esm/internal/util/createObject.js
function createObject(keys, values) {
  return keys.reduce((result, key, i) => (result[key] = values[i], result), {});
}

// node_modules/rxjs/dist/esm/internal/observable/combineLatest.js
function combineLatest(...args) {
  const scheduler2 = popScheduler(args);
  const resultSelector = popResultSelector(args);
  const {
    args: observables,
    keys
  } = argsArgArrayOrObject(args);
  if (observables.length === 0) {
    return from([], scheduler2);
  }
  const result = new Observable(combineLatestInit(observables, scheduler2, keys ? (values) => createObject(keys, values) : identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler2, valueTransform = identity) {
  return (subscriber) => {
    maybeSchedule(scheduler2, () => {
      const {
        length
      } = observables;
      const values = new Array(length);
      let active = length;
      let remainingFirstValues = length;
      for (let i = 0; i < length; i++) {
        maybeSchedule(scheduler2, () => {
          const source = from(observables[i], scheduler2);
          let hasFirstValue = false;
          source.subscribe(createOperatorSubscriber(subscriber, (value) => {
            values[i] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, () => {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      }
    }, subscriber);
  };
}
function maybeSchedule(scheduler2, execute, subscription) {
  if (scheduler2) {
    executeSchedule(subscription, scheduler2, execute);
  } else {
    execute();
  }
}

// node_modules/rxjs/dist/esm/internal/operators/mergeInternals.js
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  const buffer = [];
  let active = 0;
  let index = 0;
  let isComplete = false;
  const checkComplete = () => {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  const outerNext = (value) => active < concurrent ? doInnerSub(value) : buffer.push(value);
  const doInnerSub = (value) => {
    expand && subscriber.next(value);
    active++;
    let innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, (innerValue) => {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, () => {
      innerComplete = true;
    }, void 0, () => {
      if (innerComplete) {
        try {
          active--;
          while (buffer.length && active < concurrent) {
            const bufferedValue = buffer.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, () => doInnerSub(bufferedValue));
            } else {
              doInnerSub(bufferedValue);
            }
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, () => {
    isComplete = true;
    checkComplete();
  }));
  return () => {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}

// node_modules/rxjs/dist/esm/internal/operators/mergeMap.js
function mergeMap(project, resultSelector, concurrent = Infinity) {
  if (isFunction(resultSelector)) {
    return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(innerFrom(project(a, i))), concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
}

// node_modules/rxjs/dist/esm/internal/operators/mergeAll.js
function mergeAll(concurrent = Infinity) {
  return mergeMap(identity, concurrent);
}

// node_modules/rxjs/dist/esm/internal/operators/concatAll.js
function concatAll() {
  return mergeAll(1);
}

// node_modules/rxjs/dist/esm/internal/observable/concat.js
function concat(...args) {
  return concatAll()(from(args, popScheduler(args)));
}

// node_modules/rxjs/dist/esm/internal/observable/defer.js
function defer(observableFactory) {
  return new Observable((subscriber) => {
    innerFrom(observableFactory()).subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm/internal/observable/merge.js
function merge(...args) {
  const scheduler2 = popScheduler(args);
  const concurrent = popNumber(args, Infinity);
  const sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler2));
}

// node_modules/rxjs/dist/esm/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => predicate.call(thisArg, value, index++) && subscriber.next(value)));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/catchError.js
function catchError(selector) {
  return operate((source, subscriber) => {
    let innerSub = null;
    let syncUnsub = false;
    let handledResult;
    innerSub = source.subscribe(createOperatorSubscriber(subscriber, void 0, void 0, (err) => {
      handledResult = innerFrom(selector(err, catchError(selector)(source)));
      if (innerSub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      } else {
        syncUnsub = true;
      }
    }));
    if (syncUnsub) {
      innerSub.unsubscribe();
      innerSub = null;
      handledResult.subscribe(subscriber);
    }
  });
}

// node_modules/rxjs/dist/esm/internal/operators/scanInternals.js
function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return (source, subscriber) => {
    let hasState = hasSeed;
    let state = seed;
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      const i = index++;
      state = hasState ? accumulator(state, value, i) : (hasState = true, value);
      emitOnNext && subscriber.next(state);
    }, emitBeforeComplete && (() => {
      hasState && subscriber.next(state);
      subscriber.complete();
    })));
  };
}

// node_modules/rxjs/dist/esm/internal/operators/concatMap.js
function concatMap(project, resultSelector) {
  return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
}

// node_modules/rxjs/dist/esm/internal/operators/defaultIfEmpty.js
function defaultIfEmpty(defaultValue) {
  return operate((source, subscriber) => {
    let hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      hasValue = true;
      subscriber.next(value);
    }, () => {
      if (!hasValue) {
        subscriber.next(defaultValue);
      }
      subscriber.complete();
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/take.js
function take(count) {
  return count <= 0 ? () => EMPTY : operate((source, subscriber) => {
    let seen = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      if (++seen <= count) {
        subscriber.next(value);
        if (count <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/mapTo.js
function mapTo(value) {
  return map(() => value);
}

// node_modules/rxjs/dist/esm/internal/operators/throwIfEmpty.js
function throwIfEmpty(errorFactory = defaultErrorFactory) {
  return operate((source, subscriber) => {
    let hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      hasValue = true;
      subscriber.next(value);
    }, () => hasValue ? subscriber.complete() : subscriber.error(errorFactory())));
  });
}
function defaultErrorFactory() {
  return new EmptyError();
}

// node_modules/rxjs/dist/esm/internal/operators/finalize.js
function finalize(callback) {
  return operate((source, subscriber) => {
    try {
      source.subscribe(subscriber);
    } finally {
      subscriber.add(callback);
    }
  });
}

// node_modules/rxjs/dist/esm/internal/operators/first.js
function first(predicate, defaultValue) {
  const hasDefaultValue = arguments.length >= 2;
  return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
}

// node_modules/rxjs/dist/esm/internal/operators/takeLast.js
function takeLast(count) {
  return count <= 0 ? () => EMPTY : operate((source, subscriber) => {
    let buffer = [];
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      buffer.push(value);
      count < buffer.length && buffer.shift();
    }, () => {
      for (const value of buffer) {
        subscriber.next(value);
      }
      subscriber.complete();
    }, void 0, () => {
      buffer = null;
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/last.js
function last2(predicate, defaultValue) {
  const hasDefaultValue = arguments.length >= 2;
  return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
}

// node_modules/rxjs/dist/esm/internal/operators/scan.js
function scan(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}

// node_modules/rxjs/dist/esm/internal/operators/share.js
function share(options = {}) {
  const {
    connector = () => new Subject(),
    resetOnError = true,
    resetOnComplete = true,
    resetOnRefCountZero = true
  } = options;
  return (wrapperSource) => {
    let connection;
    let resetConnection;
    let subject;
    let refCount2 = 0;
    let hasCompleted = false;
    let hasErrored = false;
    const cancelReset = () => {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    const reset = () => {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    const resetAndUnsubscribe = () => {
      const conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate((source, subscriber) => {
      refCount2++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      const dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(() => {
        refCount2--;
        if (refCount2 === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount2 > 0) {
        connection = new SafeSubscriber({
          next: (value) => dest.next(value),
          error: (err) => {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: () => {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on, ...args) {
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  const onSubscriber = new SafeSubscriber({
    next: () => {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on(...args)).subscribe(onSubscriber);
}

// node_modules/rxjs/dist/esm/internal/operators/startWith.js
function startWith(...values) {
  const scheduler2 = popScheduler(values);
  return operate((source, subscriber) => {
    (scheduler2 ? concat(values, source, scheduler2) : concat(values, source)).subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm/internal/operators/switchMap.js
function switchMap(project, resultSelector) {
  return operate((source, subscriber) => {
    let innerSubscriber = null;
    let index = 0;
    let isComplete = false;
    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      let innerIndex = 0;
      const outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
        innerSubscriber = null;
        checkComplete();
      }));
    }, () => {
      isComplete = true;
      checkComplete();
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/takeWhile.js
function takeWhile(predicate, inclusive = false) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      const result = predicate(value, index++);
      (result || inclusive) && subscriber.next(value);
      !result && subscriber.complete();
    }));
  });
}

// node_modules/rxjs/dist/esm/internal/operators/tap.js
function tap(observerOrNext, error, complete) {
  const tapObserver = isFunction(observerOrNext) || error || complete ? {
    next: observerOrNext,
    error,
    complete
  } : observerOrNext;
  return tapObserver ? operate((source, subscriber) => {
    var _a;
    (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
    let isUnsub = true;
    source.subscribe(createOperatorSubscriber(subscriber, (value) => {
      var _a2;
      (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
      subscriber.next(value);
    }, () => {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      subscriber.complete();
    }, (err) => {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
      subscriber.error(err);
    }, () => {
      var _a2, _b;
      if (isUnsub) {
        (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      }
      (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
    }));
  }) : identity;
}

// node_modules/@angular/core/fesm2020/core.mjs
function getClosureSafeProperty(objWithPropertyToExtract) {
  for (let key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === getClosureSafeProperty) {
      return key;
    }
  }
  throw Error("Could not find renamed property on target object.");
}
function stringify(token) {
  if (typeof token === "string") {
    return token;
  }
  if (Array.isArray(token)) {
    return "[" + token.map(stringify).join(", ") + "]";
  }
  if (token == null) {
    return "" + token;
  }
  if (token.overriddenName) {
    return `${token.overriddenName}`;
  }
  if (token.name) {
    return `${token.name}`;
  }
  const res = token.toString();
  if (res == null) {
    return "" + res;
  }
  const newLineIndex = res.indexOf("\n");
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
function concatStringsWithSpace(before, after) {
  return before == null || before === "" ? after === null ? "" : after : after == null || after === "" ? before : before + " " + after;
}
var __forward_ref__ = /* @__PURE__ */ getClosureSafeProperty({
  __forward_ref__: getClosureSafeProperty
});
function forwardRef(forwardRefFn) {
  forwardRefFn.__forward_ref__ = forwardRef;
  forwardRefFn.toString = function() {
    return stringify(this());
  };
  return forwardRefFn;
}
function resolveForwardRef(type) {
  return isForwardRef(type) ? type() : type;
}
function isForwardRef(fn) {
  return typeof fn === "function" && fn.hasOwnProperty(__forward_ref__) && fn.__forward_ref__ === forwardRef;
}
function isEnvironmentProviders(value) {
  return value && !!value.\u0275providers;
}
var ERROR_DETAILS_PAGE_BASE_URL = "https://angular.io/errors";
var XSS_SECURITY_URL = "https://g.co/ng/security#xss";
var RuntimeError = class extends Error {
  constructor(code, message) {
    super(formatRuntimeError(code, message));
    this.code = code;
  }
};
function formatRuntimeError(code, message) {
  const fullCode = `NG0${Math.abs(code)}`;
  let errorMessage = `${fullCode}${message ? ": " + message.trim() : ""}`;
  if (ngDevMode && code < 0) {
    const addPeriodSeparator = !errorMessage.match(/[.,;!?]$/);
    const separator = addPeriodSeparator ? "." : "";
    errorMessage = `${errorMessage}${separator} Find more at ${ERROR_DETAILS_PAGE_BASE_URL}/${fullCode}`;
  }
  return errorMessage;
}
function renderStringify(value) {
  if (typeof value === "string")
    return value;
  if (value == null)
    return "";
  return String(value);
}
function stringifyForError(value) {
  if (typeof value === "function")
    return value.name || value.toString();
  if (typeof value === "object" && value != null && typeof value.type === "function") {
    return value.type.name || value.type.toString();
  }
  return renderStringify(value);
}
function throwCyclicDependencyError(token, path) {
  const depPath = path ? `. Dependency path: ${path.join(" > ")} > ${token}` : "";
  throw new RuntimeError(-200, `Circular dependency in DI detected for ${token}${depPath}`);
}
function throwMixedMultiProviderError() {
  throw new Error(`Cannot mix multi providers and regular providers`);
}
function throwInvalidProviderError(ngModuleType, providers, provider) {
  if (ngModuleType && providers) {
    const providerDetail = providers.map((v) => v == provider ? "?" + provider + "?" : "...");
    throw new Error(`Invalid provider for the NgModule '${stringify(ngModuleType)}' - only instances of Provider and Type are allowed, got: [${providerDetail.join(", ")}]`);
  } else if (isEnvironmentProviders(provider)) {
    if (provider.\u0275fromNgModule) {
      throw new RuntimeError(207, `Invalid providers from 'importProvidersFrom' present in a non-environment injector. 'importProvidersFrom' can't be used for component providers.`);
    } else {
      throw new RuntimeError(207, `Invalid providers present in a non-environment injector. 'EnvironmentProviders' can't be used for component providers.`);
    }
  } else {
    throw new Error("Invalid provider");
  }
}
function throwProviderNotFoundError(token, injectorName) {
  const injectorDetails = injectorName ? ` in ${injectorName}` : "";
  throw new RuntimeError(-201, ngDevMode && `No provider for ${stringifyForError(token)} found${injectorDetails}`);
}
function assertNumber(actual, msg) {
  if (!(typeof actual === "number")) {
    throwError2(msg, typeof actual, "number", "===");
  }
}
function assertString(actual, msg) {
  if (!(typeof actual === "string")) {
    throwError2(msg, actual === null ? "null" : typeof actual, "string", "===");
  }
}
function assertFunction(actual, msg) {
  if (!(typeof actual === "function")) {
    throwError2(msg, actual === null ? "null" : typeof actual, "function", "===");
  }
}
function assertEqual(actual, expected, msg) {
  if (!(actual == expected)) {
    throwError2(msg, actual, expected, "==");
  }
}
function assertNotEqual(actual, expected, msg) {
  if (!(actual != expected)) {
    throwError2(msg, actual, expected, "!=");
  }
}
function assertSame(actual, expected, msg) {
  if (!(actual === expected)) {
    throwError2(msg, actual, expected, "===");
  }
}
function assertNotSame(actual, expected, msg) {
  if (!(actual !== expected)) {
    throwError2(msg, actual, expected, "!==");
  }
}
function assertLessThan(actual, expected, msg) {
  if (!(actual < expected)) {
    throwError2(msg, actual, expected, "<");
  }
}
function assertGreaterThan(actual, expected, msg) {
  if (!(actual > expected)) {
    throwError2(msg, actual, expected, ">");
  }
}
function assertGreaterThanOrEqual(actual, expected, msg) {
  if (!(actual >= expected)) {
    throwError2(msg, actual, expected, ">=");
  }
}
function assertDefined(actual, msg) {
  if (actual == null) {
    throwError2(msg, actual, null, "!=");
  }
}
function throwError2(msg, actual, expected, comparison) {
  throw new Error(`ASSERTION ERROR: ${msg}` + (comparison == null ? "" : ` [Expected=> ${expected} ${comparison} ${actual} <=Actual]`));
}
function assertDomNode(node) {
  if (!(typeof Node !== "undefined" && node instanceof Node) && !(typeof node === "object" && node != null && node.constructor.name === "WebWorkerRenderNode")) {
    throwError2(`The provided value must be an instance of a DOM Node but got ${stringify(node)}`);
  }
}
function assertIndexInRange(arr, index) {
  assertDefined(arr, "Array must be defined.");
  const maxLen = arr.length;
  if (index < 0 || index >= maxLen) {
    throwError2(`Index expected to be less than ${maxLen} but got ${index}`);
  }
}
function \u0275\u0275defineInjectable(opts) {
  return {
    token: opts.token,
    providedIn: opts.providedIn || null,
    factory: opts.factory,
    value: void 0
  };
}
function \u0275\u0275defineInjector(options) {
  return {
    providers: options.providers || [],
    imports: options.imports || []
  };
}
function getInjectableDef(type) {
  return getOwnDefinition(type, NG_PROV_DEF) || getOwnDefinition(type, NG_INJECTABLE_DEF);
}
function isInjectable(type) {
  return getInjectableDef(type) !== null;
}
function getOwnDefinition(type, field) {
  return type.hasOwnProperty(field) ? type[field] : null;
}
function getInheritedInjectableDef(type) {
  const def = type && (type[NG_PROV_DEF] || type[NG_INJECTABLE_DEF]);
  if (def) {
    const typeName = getTypeName(type);
    ngDevMode && console.warn(`DEPRECATED: DI is instantiating a token "${typeName}" that inherits its @Injectable decorator but does not provide one itself.
This will become an error in a future version of Angular. Please add @Injectable() to the "${typeName}" class.`);
    return def;
  } else {
    return null;
  }
}
function getTypeName(type) {
  if (type.hasOwnProperty("name")) {
    return type.name;
  }
  const match2 = ("" + type).match(/^function\s*([^\s(]+)/);
  return match2 === null ? "" : match2[1];
}
function getInjectorDef(type) {
  return type && (type.hasOwnProperty(NG_INJ_DEF) || type.hasOwnProperty(NG_INJECTOR_DEF)) ? type[NG_INJ_DEF] : null;
}
var NG_PROV_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275prov: getClosureSafeProperty
});
var NG_INJ_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275inj: getClosureSafeProperty
});
var NG_INJECTABLE_DEF = /* @__PURE__ */ getClosureSafeProperty({
  ngInjectableDef: getClosureSafeProperty
});
var NG_INJECTOR_DEF = /* @__PURE__ */ getClosureSafeProperty({
  ngInjectorDef: getClosureSafeProperty
});
var InjectFlags = /* @__PURE__ */ (() => {
  InjectFlags = InjectFlags || {};
  InjectFlags[InjectFlags["Default"] = 0] = "Default";
  InjectFlags[InjectFlags["Host"] = 1] = "Host";
  InjectFlags[InjectFlags["Self"] = 2] = "Self";
  InjectFlags[InjectFlags["SkipSelf"] = 4] = "SkipSelf";
  InjectFlags[InjectFlags["Optional"] = 8] = "Optional";
  return InjectFlags;
})();
var _injectImplementation;
function getInjectImplementation() {
  return _injectImplementation;
}
function setInjectImplementation(impl) {
  const previous = _injectImplementation;
  _injectImplementation = impl;
  return previous;
}
function injectRootLimpMode(token, notFoundValue, flags) {
  const injectableDef = getInjectableDef(token);
  if (injectableDef && injectableDef.providedIn == "root") {
    return injectableDef.value === void 0 ? injectableDef.value = injectableDef.factory() : injectableDef.value;
  }
  if (flags & InjectFlags.Optional)
    return null;
  if (notFoundValue !== void 0)
    return notFoundValue;
  throwProviderNotFoundError(stringify(token), "Injector");
}
function assertInjectImplementationNotEqual(fn) {
  ngDevMode && assertNotEqual(_injectImplementation, fn, "Calling \u0275\u0275inject would cause infinite recursion");
}
var _global = /* @__PURE__ */ (() => typeof globalThis !== "undefined" && globalThis || typeof global !== "undefined" && global || typeof window !== "undefined" && window || typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && self)();
function ngDevModeResetPerfCounters() {
  const locationString = typeof location !== "undefined" ? location.toString() : "";
  const newCounters = {
    namedConstructors: locationString.indexOf("ngDevMode=namedConstructors") != -1,
    firstCreatePass: 0,
    tNode: 0,
    tView: 0,
    rendererCreateTextNode: 0,
    rendererSetText: 0,
    rendererCreateElement: 0,
    rendererAddEventListener: 0,
    rendererSetAttribute: 0,
    rendererRemoveAttribute: 0,
    rendererSetProperty: 0,
    rendererSetClassName: 0,
    rendererAddClass: 0,
    rendererRemoveClass: 0,
    rendererSetStyle: 0,
    rendererRemoveStyle: 0,
    rendererDestroy: 0,
    rendererDestroyNode: 0,
    rendererMoveNode: 0,
    rendererRemoveNode: 0,
    rendererAppendChild: 0,
    rendererInsertBefore: 0,
    rendererCreateComment: 0
  };
  const allowNgDevModeTrue = locationString.indexOf("ngDevMode=false") === -1;
  _global["ngDevMode"] = allowNgDevModeTrue && newCounters;
  return newCounters;
}
function initNgDevMode() {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (typeof ngDevMode !== "object") {
      ngDevModeResetPerfCounters();
    }
    return typeof ngDevMode !== "undefined" && !!ngDevMode;
  }
  return false;
}
var _THROW_IF_NOT_FOUND = {};
var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
var DI_DECORATOR_FLAG = "__NG_DI_FLAG__";
var NG_TEMP_TOKEN_PATH = "ngTempTokenPath";
var NG_TOKEN_PATH = "ngTokenPath";
var NEW_LINE = /\n/gm;
var NO_NEW_LINE = "\u0275";
var SOURCE = "__source";
var _currentInjector = void 0;
function setCurrentInjector(injector) {
  const former = _currentInjector;
  _currentInjector = injector;
  return former;
}
function injectInjectorOnly(token, flags = InjectFlags.Default) {
  if (_currentInjector === void 0) {
    throw new RuntimeError(-203, ngDevMode && `inject() must be called from an injection context such as a constructor, a factory function, a field initializer, or a function used with \`EnvironmentInjector#runInContext\`.`);
  } else if (_currentInjector === null) {
    return injectRootLimpMode(token, void 0, flags);
  } else {
    return _currentInjector.get(token, flags & InjectFlags.Optional ? null : void 0, flags);
  }
}
function \u0275\u0275inject(token, flags = InjectFlags.Default) {
  return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token), flags);
}
function inject(token, flags = InjectFlags.Default) {
  return \u0275\u0275inject(token, convertToBitFlags(flags));
}
function convertToBitFlags(flags) {
  if (typeof flags === "undefined" || typeof flags === "number") {
    return flags;
  }
  return 0 | // comment to force a line break in the formatter
  (flags.optional && 8) | (flags.host && 1) | (flags.self && 2) | (flags.skipSelf && 4);
}
function injectArgs(types) {
  const args = [];
  for (let i = 0; i < types.length; i++) {
    const arg = resolveForwardRef(types[i]);
    if (Array.isArray(arg)) {
      if (arg.length === 0) {
        throw new RuntimeError(900, ngDevMode && "Arguments array must have arguments.");
      }
      let type = void 0;
      let flags = InjectFlags.Default;
      for (let j = 0; j < arg.length; j++) {
        const meta = arg[j];
        const flag = getInjectFlag(meta);
        if (typeof flag === "number") {
          if (flag === -1) {
            type = meta.token;
          } else {
            flags |= flag;
          }
        } else {
          type = meta;
        }
      }
      args.push(\u0275\u0275inject(type, flags));
    } else {
      args.push(\u0275\u0275inject(arg));
    }
  }
  return args;
}
function attachInjectFlag(decorator, flag) {
  decorator[DI_DECORATOR_FLAG] = flag;
  decorator.prototype[DI_DECORATOR_FLAG] = flag;
  return decorator;
}
function getInjectFlag(token) {
  return token[DI_DECORATOR_FLAG];
}
function catchInjectorError(e, token, injectorErrorName, source) {
  const tokenPath = e[NG_TEMP_TOKEN_PATH];
  if (token[SOURCE]) {
    tokenPath.unshift(token[SOURCE]);
  }
  e.message = formatError("\n" + e.message, tokenPath, injectorErrorName, source);
  e[NG_TOKEN_PATH] = tokenPath;
  e[NG_TEMP_TOKEN_PATH] = null;
  throw e;
}
function formatError(text, obj, injectorErrorName, source = null) {
  text = text && text.charAt(0) === "\n" && text.charAt(1) == NO_NEW_LINE ? text.slice(2) : text;
  let context2 = stringify(obj);
  if (Array.isArray(obj)) {
    context2 = obj.map(stringify).join(" -> ");
  } else if (typeof obj === "object") {
    let parts = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        parts.push(key + ":" + (typeof value === "string" ? JSON.stringify(value) : stringify(value)));
      }
    }
    context2 = `{${parts.join(", ")}}`;
  }
  return `${injectorErrorName}${source ? "(" + source + ")" : ""}[${context2}]: ${text.replace(NEW_LINE, "\n  ")}`;
}
function noSideEffects(fn) {
  return {
    toString: fn
  }.toString();
}
var ChangeDetectionStrategy = /* @__PURE__ */ (() => {
  ChangeDetectionStrategy = ChangeDetectionStrategy || {};
  ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
  ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
  return ChangeDetectionStrategy;
})();
var ViewEncapsulation$1 = /* @__PURE__ */ (() => {
  (function(ViewEncapsulation) {
    ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
    ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
    ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
  })(ViewEncapsulation$1 || (ViewEncapsulation$1 = {}));
  return ViewEncapsulation$1;
})();
var EMPTY_OBJ = {};
var EMPTY_ARRAY = [];
if ((typeof ngDevMode === "undefined" || ngDevMode) && /* @__PURE__ */ initNgDevMode()) {
  /* @__PURE__ */ Object.freeze(EMPTY_OBJ);
  /* @__PURE__ */ Object.freeze(EMPTY_ARRAY);
}
var NG_COMP_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275cmp: getClosureSafeProperty
});
var NG_DIR_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275dir: getClosureSafeProperty
});
var NG_PIPE_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275pipe: getClosureSafeProperty
});
var NG_MOD_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275mod: getClosureSafeProperty
});
var NG_FACTORY_DEF = /* @__PURE__ */ getClosureSafeProperty({
  \u0275fac: getClosureSafeProperty
});
var NG_ELEMENT_ID = /* @__PURE__ */ getClosureSafeProperty({
  __NG_ELEMENT_ID__: getClosureSafeProperty
});
var componentDefCount = 0;
function \u0275\u0275defineComponent(componentDefinition) {
  return noSideEffects(() => {
    (typeof ngDevMode === "undefined" || ngDevMode) && initNgDevMode();
    const baseDef = getNgDirectiveDef(componentDefinition);
    const def = __spreadProps(__spreadValues({}, baseDef), {
      decls: componentDefinition.decls,
      vars: componentDefinition.vars,
      template: componentDefinition.template,
      consts: componentDefinition.consts || null,
      ngContentSelectors: componentDefinition.ngContentSelectors,
      onPush: componentDefinition.changeDetection === ChangeDetectionStrategy.OnPush,
      directiveDefs: null,
      pipeDefs: null,
      dependencies: baseDef.standalone && componentDefinition.dependencies || null,
      getStandaloneInjector: null,
      data: componentDefinition.data || {},
      encapsulation: componentDefinition.encapsulation || ViewEncapsulation$1.Emulated,
      id: `c${componentDefCount++}`,
      styles: componentDefinition.styles || EMPTY_ARRAY,
      _: null,
      schemas: componentDefinition.schemas || null,
      tView: null
    });
    initFeatures(def);
    const dependencies = componentDefinition.dependencies;
    def.directiveDefs = extractDefListOrFactory(
      dependencies,
      /* pipeDef */
      false
    );
    def.pipeDefs = extractDefListOrFactory(
      dependencies,
      /* pipeDef */
      true
    );
    return def;
  });
}
function extractDirectiveDef(type) {
  return getComponentDef(type) || getDirectiveDef(type);
}
function nonNull(value) {
  return value !== null;
}
function \u0275\u0275defineNgModule(def) {
  return noSideEffects(() => {
    const res = {
      type: def.type,
      bootstrap: def.bootstrap || EMPTY_ARRAY,
      declarations: def.declarations || EMPTY_ARRAY,
      imports: def.imports || EMPTY_ARRAY,
      exports: def.exports || EMPTY_ARRAY,
      transitiveCompileScopes: null,
      schemas: def.schemas || null,
      id: def.id || null
    };
    return res;
  });
}
function invertObject(obj, secondary) {
  if (obj == null)
    return EMPTY_OBJ;
  const newLookup = {};
  for (const minifiedKey in obj) {
    if (obj.hasOwnProperty(minifiedKey)) {
      let publicName = obj[minifiedKey];
      let declaredName = publicName;
      if (Array.isArray(publicName)) {
        declaredName = publicName[1];
        publicName = publicName[0];
      }
      newLookup[publicName] = minifiedKey;
      if (secondary) {
        secondary[publicName] = declaredName;
      }
    }
  }
  return newLookup;
}
function \u0275\u0275defineDirective(directiveDefinition) {
  return noSideEffects(() => {
    const def = getNgDirectiveDef(directiveDefinition);
    initFeatures(def);
    return def;
  });
}
function getComponentDef(type) {
  return type[NG_COMP_DEF] || null;
}
function getDirectiveDef(type) {
  return type[NG_DIR_DEF] || null;
}
function getPipeDef$1(type) {
  return type[NG_PIPE_DEF] || null;
}
function isStandalone(type) {
  const def = getComponentDef(type) || getDirectiveDef(type) || getPipeDef$1(type);
  return def !== null ? def.standalone : false;
}
function getNgModuleDef(type, throwNotFound) {
  const ngModuleDef = type[NG_MOD_DEF] || null;
  if (!ngModuleDef && throwNotFound === true) {
    throw new Error(`Type ${stringify(type)} does not have '\u0275mod' property.`);
  }
  return ngModuleDef;
}
function getNgDirectiveDef(directiveDefinition) {
  const declaredInputs = {};
  return {
    type: directiveDefinition.type,
    providersResolver: null,
    factory: null,
    hostBindings: directiveDefinition.hostBindings || null,
    hostVars: directiveDefinition.hostVars || 0,
    hostAttrs: directiveDefinition.hostAttrs || null,
    contentQueries: directiveDefinition.contentQueries || null,
    declaredInputs,
    exportAs: directiveDefinition.exportAs || null,
    standalone: directiveDefinition.standalone === true,
    selectors: directiveDefinition.selectors || EMPTY_ARRAY,
    viewQuery: directiveDefinition.viewQuery || null,
    features: directiveDefinition.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: invertObject(directiveDefinition.inputs, declaredInputs),
    outputs: invertObject(directiveDefinition.outputs)
  };
}
function initFeatures(definition) {
  definition.features?.forEach((fn) => fn(definition));
}
function extractDefListOrFactory(dependencies, pipeDef) {
  if (!dependencies) {
    return null;
  }
  const defExtractor = pipeDef ? getPipeDef$1 : extractDirectiveDef;
  return () => (typeof dependencies === "function" ? dependencies() : dependencies).map((dep) => defExtractor(dep)).filter(nonNull);
}
var HOST = 0;
var TVIEW = 1;
var FLAGS = 2;
var PARENT = 3;
var NEXT = 4;
var TRANSPLANTED_VIEWS_TO_REFRESH = 5;
var T_HOST = 6;
var CLEANUP = 7;
var CONTEXT = 8;
var INJECTOR$1 = 9;
var RENDERER_FACTORY = 10;
var RENDERER = 11;
var SANITIZER = 12;
var CHILD_HEAD = 13;
var CHILD_TAIL = 14;
var DECLARATION_VIEW = 15;
var DECLARATION_COMPONENT_VIEW = 16;
var DECLARATION_LCONTAINER = 17;
var PREORDER_HOOK_FLAGS = 18;
var QUERIES = 19;
var ID = 20;
var EMBEDDED_VIEW_INJECTOR = 21;
var HEADER_OFFSET = 22;
var TYPE = 1;
var HAS_TRANSPLANTED_VIEWS = 2;
var NATIVE = 7;
var VIEW_REFS = 8;
var MOVED_VIEWS = 9;
var CONTAINER_HEADER_OFFSET = 10;
function isLView(value) {
  return Array.isArray(value) && typeof value[TYPE] === "object";
}
function isLContainer(value) {
  return Array.isArray(value) && value[TYPE] === true;
}
function isContentQueryHost(tNode) {
  return (tNode.flags & 4) !== 0;
}
function isComponentHost(tNode) {
  return tNode.componentOffset > -1;
}
function isDirectiveHost(tNode) {
  return (tNode.flags & 1) === 1;
}
function isComponentDef(def) {
  return !!def.template;
}
function isRootView(target) {
  return (target[FLAGS] & 256) !== 0;
}
function assertTNodeForLView(tNode, lView) {
  assertTNodeForTView(tNode, lView[TVIEW]);
}
function assertTNodeForTView(tNode, tView) {
  assertTNode(tNode);
  tNode.hasOwnProperty("tView_") && assertEqual(tNode.tView_, tView, "This TNode does not belong to this TView.");
}
function assertTNode(tNode) {
  assertDefined(tNode, "TNode must be defined");
  if (!(tNode && typeof tNode === "object" && tNode.hasOwnProperty("directiveStylingLast"))) {
    throwError2("Not of type TNode, got: " + tNode);
  }
}
function assertComponentType(actual, msg = "Type passed in is not ComponentType, it does not have '\u0275cmp' property.") {
  if (!getComponentDef(actual)) {
    throwError2(msg);
  }
}
function assertNgModuleType(actual, msg = "Type passed in is not NgModuleType, it does not have '\u0275mod' property.") {
  if (!getNgModuleDef(actual)) {
    throwError2(msg);
  }
}
function assertHasParent(tNode) {
  assertDefined(tNode, "currentTNode should exist!");
  assertDefined(tNode.parent, "currentTNode should have a parent");
}
function assertLContainer(value) {
  assertDefined(value, "LContainer must be defined");
  assertEqual(isLContainer(value), true, "Expecting LContainer");
}
function assertLViewOrUndefined(value) {
  value && assertEqual(isLView(value), true, "Expecting LView or undefined or null");
}
function assertLView(value) {
  assertDefined(value, "LView must be defined");
  assertEqual(isLView(value), true, "Expecting LView");
}
function assertFirstCreatePass(tView, errMessage) {
  assertEqual(tView.firstCreatePass, true, errMessage || "Should only be called in first create pass.");
}
function assertFirstUpdatePass(tView, errMessage) {
  assertEqual(tView.firstUpdatePass, true, errMessage || "Should only be called in first update pass.");
}
function assertDirectiveDef(obj) {
  if (obj.type === void 0 || obj.selectors == void 0 || obj.inputs === void 0) {
    throwError2(`Expected a DirectiveDef/ComponentDef and this object does not seem to have the expected shape.`);
  }
}
function assertIndexInDeclRange(lView, index) {
  const tView = lView[1];
  assertBetween(HEADER_OFFSET, tView.bindingStartIndex, index);
}
function assertIndexInExpandoRange(lView, index) {
  const tView = lView[1];
  assertBetween(tView.expandoStartIndex, lView.length, index);
}
function assertBetween(lower, upper, index) {
  if (!(lower <= index && index < upper)) {
    throwError2(`Index out of range (expecting ${lower} <= ${index} < ${upper})`);
  }
}
function assertProjectionSlots(lView, errMessage) {
  assertDefined(lView[DECLARATION_COMPONENT_VIEW], "Component views should exist.");
  assertDefined(lView[DECLARATION_COMPONENT_VIEW][T_HOST].projection, errMessage || "Components with projection nodes (<ng-content>) must have projection slots defined.");
}
function assertParentView(lView, errMessage) {
  assertDefined(lView, errMessage || "Component views should always have a parent view (component's host view)");
}
function assertNodeInjector(lView, injectorIndex) {
  assertIndexInExpandoRange(lView, injectorIndex);
  assertIndexInExpandoRange(
    lView,
    injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  );
  assertNumber(lView[injectorIndex + 0], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 1], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 2], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 3], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 4], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 5], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 6], "injectorIndex should point to a bloom filter");
  assertNumber(lView[injectorIndex + 7], "injectorIndex should point to a bloom filter");
  assertNumber(lView[
    injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  ], "injectorIndex should point to parent injector");
}
function getFactoryDef(type, throwNotFound) {
  const hasFactoryDef = type.hasOwnProperty(NG_FACTORY_DEF);
  if (!hasFactoryDef && throwNotFound === true && ngDevMode) {
    throw new Error(`Type ${stringify(type)} does not have '\u0275fac' property.`);
  }
  return hasFactoryDef ? type[NG_FACTORY_DEF] : null;
}
var SimpleChange = class {
  constructor(previousValue, currentValue, firstChange) {
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.firstChange = firstChange;
  }
  /**
   * Check whether the new value is the first value assigned.
   */
  isFirstChange() {
    return this.firstChange;
  }
};
function \u0275\u0275NgOnChangesFeature() {
  return NgOnChangesFeatureImpl;
}
function NgOnChangesFeatureImpl(definition) {
  if (definition.type.prototype.ngOnChanges) {
    definition.setInput = ngOnChangesSetInput;
  }
  return rememberChangeHistoryAndInvokeOnChangesHook;
}
\u0275\u0275NgOnChangesFeature.ngInherit = true;
function rememberChangeHistoryAndInvokeOnChangesHook() {
  const simpleChangesStore = getSimpleChangesStore(this);
  const current = simpleChangesStore?.current;
  if (current) {
    const previous = simpleChangesStore.previous;
    if (previous === EMPTY_OBJ) {
      simpleChangesStore.previous = current;
    } else {
      for (let key in current) {
        previous[key] = current[key];
      }
    }
    simpleChangesStore.current = null;
    this.ngOnChanges(current);
  }
}
function ngOnChangesSetInput(instance, value, publicName, privateName) {
  const declaredName = this.declaredInputs[publicName];
  ngDevMode && assertString(declaredName, "Name of input in ngOnChanges has to be a string");
  const simpleChangesStore = getSimpleChangesStore(instance) || setSimpleChangesStore(instance, {
    previous: EMPTY_OBJ,
    current: null
  });
  const current = simpleChangesStore.current || (simpleChangesStore.current = {});
  const previous = simpleChangesStore.previous;
  const previousChange = previous[declaredName];
  current[declaredName] = new SimpleChange(previousChange && previousChange.currentValue, value, previous === EMPTY_OBJ);
  instance[privateName] = value;
}
var SIMPLE_CHANGES_STORE = "__ngSimpleChanges__";
function getSimpleChangesStore(instance) {
  return instance[SIMPLE_CHANGES_STORE] || null;
}
function setSimpleChangesStore(instance, store) {
  return instance[SIMPLE_CHANGES_STORE] = store;
}
var profilerCallback = null;
var setProfiler = (profiler2) => {
  profilerCallback = profiler2;
};
var profiler = function(event, instance, hookOrListener) {
  if (profilerCallback != null) {
    profilerCallback(event, instance, hookOrListener);
  }
};
var SVG_NAMESPACE = "svg";
var MATH_ML_NAMESPACE = "math";
function unwrapRNode(value) {
  while (Array.isArray(value)) {
    value = value[HOST];
  }
  return value;
}
function getNativeByTNode(tNode, lView) {
  ngDevMode && assertTNodeForLView(tNode, lView);
  ngDevMode && assertIndexInRange(lView, tNode.index);
  const node = unwrapRNode(lView[tNode.index]);
  return node;
}
function getTNode(tView, index) {
  ngDevMode && assertGreaterThan(index, -1, "wrong index for TNode");
  ngDevMode && assertLessThan(index, tView.data.length, "wrong index for TNode");
  const tNode = tView.data[index];
  ngDevMode && tNode !== null && assertTNode(tNode);
  return tNode;
}
function getComponentLViewByIndex(nodeIndex, hostView) {
  ngDevMode && assertIndexInRange(hostView, nodeIndex);
  const slotValue = hostView[nodeIndex];
  const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
  return lView;
}
function isCreationMode(view) {
  return (view[FLAGS] & 4) === 4;
}
function viewAttachedToChangeDetector(view) {
  return (view[FLAGS] & 64) === 64;
}
function viewAttachedToContainer(view) {
  return isLContainer(view[PARENT]);
}
function getConstant(consts, index) {
  if (index === null || index === void 0)
    return null;
  ngDevMode && assertIndexInRange(consts, index);
  return consts[index];
}
function resetPreOrderHookFlags(lView) {
  lView[PREORDER_HOOK_FLAGS] = 0;
}
function updateTransplantedViewCount(lContainer, amount) {
  lContainer[TRANSPLANTED_VIEWS_TO_REFRESH] += amount;
  let viewOrContainer = lContainer;
  let parent = lContainer[PARENT];
  while (parent !== null && (amount === 1 && viewOrContainer[TRANSPLANTED_VIEWS_TO_REFRESH] === 1 || amount === -1 && viewOrContainer[TRANSPLANTED_VIEWS_TO_REFRESH] === 0)) {
    parent[TRANSPLANTED_VIEWS_TO_REFRESH] += amount;
    viewOrContainer = parent;
    parent = parent[PARENT];
  }
}
var instructionState = {
  lFrame: /* @__PURE__ */ createLFrame(null),
  bindingsEnabled: true
};
var _isInCheckNoChangesMode = false;
function getElementDepthCount() {
  return instructionState.lFrame.elementDepthCount;
}
function increaseElementDepthCount() {
  instructionState.lFrame.elementDepthCount++;
}
function decreaseElementDepthCount() {
  instructionState.lFrame.elementDepthCount--;
}
function getBindingsEnabled() {
  return instructionState.bindingsEnabled;
}
function getLView() {
  return instructionState.lFrame.lView;
}
function getTView() {
  return instructionState.lFrame.tView;
}
function getCurrentTNode() {
  let currentTNode = getCurrentTNodePlaceholderOk();
  while (currentTNode !== null && currentTNode.type === 64) {
    currentTNode = currentTNode.parent;
  }
  return currentTNode;
}
function getCurrentTNodePlaceholderOk() {
  return instructionState.lFrame.currentTNode;
}
function getCurrentParentTNode() {
  const lFrame = instructionState.lFrame;
  const currentTNode = lFrame.currentTNode;
  return lFrame.isParent ? currentTNode : currentTNode.parent;
}
function setCurrentTNode(tNode, isParent) {
  ngDevMode && tNode && assertTNodeForTView(tNode, instructionState.lFrame.tView);
  const lFrame = instructionState.lFrame;
  lFrame.currentTNode = tNode;
  lFrame.isParent = isParent;
}
function isCurrentTNodeParent() {
  return instructionState.lFrame.isParent;
}
function setCurrentTNodeAsNotParent() {
  instructionState.lFrame.isParent = false;
}
function isInCheckNoChangesMode() {
  !ngDevMode && throwError2("Must never be called in production mode");
  return _isInCheckNoChangesMode;
}
function setIsInCheckNoChangesMode(mode) {
  !ngDevMode && throwError2("Must never be called in production mode");
  _isInCheckNoChangesMode = mode;
}
function getBindingIndex() {
  return instructionState.lFrame.bindingIndex;
}
function setBindingIndex(value) {
  return instructionState.lFrame.bindingIndex = value;
}
function nextBindingIndex() {
  return instructionState.lFrame.bindingIndex++;
}
function isInI18nBlock() {
  return instructionState.lFrame.inI18n;
}
function setBindingRootForHostBindings(bindingRootIndex, currentDirectiveIndex) {
  const lFrame = instructionState.lFrame;
  lFrame.bindingIndex = lFrame.bindingRootIndex = bindingRootIndex;
  setCurrentDirectiveIndex(currentDirectiveIndex);
}
function getCurrentDirectiveIndex() {
  return instructionState.lFrame.currentDirectiveIndex;
}
function setCurrentDirectiveIndex(currentDirectiveIndex) {
  instructionState.lFrame.currentDirectiveIndex = currentDirectiveIndex;
}
function setCurrentQueryIndex(value) {
  instructionState.lFrame.currentQueryIndex = value;
}
function getDeclarationTNode(lView) {
  const tView = lView[TVIEW];
  if (tView.type === 2) {
    ngDevMode && assertDefined(tView.declTNode, "Embedded TNodes should have declaration parents.");
    return tView.declTNode;
  }
  if (tView.type === 1) {
    return lView[T_HOST];
  }
  return null;
}
function enterDI(lView, tNode, flags) {
  ngDevMode && assertLViewOrUndefined(lView);
  if (flags & InjectFlags.SkipSelf) {
    ngDevMode && assertTNodeForTView(tNode, lView[TVIEW]);
    let parentTNode = tNode;
    let parentLView = lView;
    while (true) {
      ngDevMode && assertDefined(parentTNode, "Parent TNode should be defined");
      parentTNode = parentTNode.parent;
      if (parentTNode === null && !(flags & InjectFlags.Host)) {
        parentTNode = getDeclarationTNode(parentLView);
        if (parentTNode === null)
          break;
        ngDevMode && assertDefined(parentLView, "Parent LView should be defined");
        parentLView = parentLView[DECLARATION_VIEW];
        if (parentTNode.type & (2 | 8)) {
          break;
        }
      } else {
        break;
      }
    }
    if (parentTNode === null) {
      return false;
    } else {
      tNode = parentTNode;
      lView = parentLView;
    }
  }
  ngDevMode && assertTNodeForLView(tNode, lView);
  const lFrame = instructionState.lFrame = allocLFrame();
  lFrame.currentTNode = tNode;
  lFrame.lView = lView;
  return true;
}
function enterView(newView) {
  ngDevMode && assertNotEqual(newView[0], newView[1], "????");
  ngDevMode && assertLViewOrUndefined(newView);
  const newLFrame = allocLFrame();
  if (ngDevMode) {
    assertEqual(newLFrame.isParent, true, "Expected clean LFrame");
    assertEqual(newLFrame.lView, null, "Expected clean LFrame");
    assertEqual(newLFrame.tView, null, "Expected clean LFrame");
    assertEqual(newLFrame.selectedIndex, -1, "Expected clean LFrame");
    assertEqual(newLFrame.elementDepthCount, 0, "Expected clean LFrame");
    assertEqual(newLFrame.currentDirectiveIndex, -1, "Expected clean LFrame");
    assertEqual(newLFrame.currentNamespace, null, "Expected clean LFrame");
    assertEqual(newLFrame.bindingRootIndex, -1, "Expected clean LFrame");
    assertEqual(newLFrame.currentQueryIndex, 0, "Expected clean LFrame");
  }
  const tView = newView[TVIEW];
  instructionState.lFrame = newLFrame;
  ngDevMode && tView.firstChild && assertTNodeForTView(tView.firstChild, tView);
  newLFrame.currentTNode = tView.firstChild;
  newLFrame.lView = newView;
  newLFrame.tView = tView;
  newLFrame.contextLView = newView;
  newLFrame.bindingIndex = tView.bindingStartIndex;
  newLFrame.inI18n = false;
}
function allocLFrame() {
  const currentLFrame = instructionState.lFrame;
  const childLFrame = currentLFrame === null ? null : currentLFrame.child;
  const newLFrame = childLFrame === null ? createLFrame(currentLFrame) : childLFrame;
  return newLFrame;
}
function createLFrame(parent) {
  const lFrame = {
    currentTNode: null,
    isParent: true,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent,
    child: null,
    inI18n: false
  };
  parent !== null && (parent.child = lFrame);
  return lFrame;
}
function leaveViewLight() {
  const oldLFrame = instructionState.lFrame;
  instructionState.lFrame = oldLFrame.parent;
  oldLFrame.currentTNode = null;
  oldLFrame.lView = null;
  return oldLFrame;
}
var leaveDI = leaveViewLight;
function leaveView() {
  const oldLFrame = leaveViewLight();
  oldLFrame.isParent = true;
  oldLFrame.tView = null;
  oldLFrame.selectedIndex = -1;
  oldLFrame.contextLView = null;
  oldLFrame.elementDepthCount = 0;
  oldLFrame.currentDirectiveIndex = -1;
  oldLFrame.currentNamespace = null;
  oldLFrame.bindingRootIndex = -1;
  oldLFrame.bindingIndex = -1;
  oldLFrame.currentQueryIndex = 0;
}
function getSelectedIndex() {
  return instructionState.lFrame.selectedIndex;
}
function setSelectedIndex(index) {
  ngDevMode && index !== -1 && assertGreaterThanOrEqual(index, HEADER_OFFSET, "Index must be past HEADER_OFFSET (or -1).");
  ngDevMode && assertLessThan(index, instructionState.lFrame.lView.length, "Can't set index passed end of LView");
  instructionState.lFrame.selectedIndex = index;
}
function getSelectedTNode() {
  const lFrame = instructionState.lFrame;
  return getTNode(lFrame.tView, lFrame.selectedIndex);
}
function getNamespace$1() {
  return instructionState.lFrame.currentNamespace;
}
function registerPreOrderHooks(directiveIndex, directiveDef, tView) {
  ngDevMode && assertFirstCreatePass(tView);
  const {
    ngOnChanges,
    ngOnInit,
    ngDoCheck
  } = directiveDef.type.prototype;
  if (ngOnChanges) {
    const wrappedOnChanges = NgOnChangesFeatureImpl(directiveDef);
    (tView.preOrderHooks ?? (tView.preOrderHooks = [])).push(directiveIndex, wrappedOnChanges);
    (tView.preOrderCheckHooks ?? (tView.preOrderCheckHooks = [])).push(directiveIndex, wrappedOnChanges);
  }
  if (ngOnInit) {
    (tView.preOrderHooks ?? (tView.preOrderHooks = [])).push(0 - directiveIndex, ngOnInit);
  }
  if (ngDoCheck) {
    (tView.preOrderHooks ?? (tView.preOrderHooks = [])).push(directiveIndex, ngDoCheck);
    (tView.preOrderCheckHooks ?? (tView.preOrderCheckHooks = [])).push(directiveIndex, ngDoCheck);
  }
}
function registerPostOrderHooks(tView, tNode) {
  ngDevMode && assertFirstCreatePass(tView);
  for (let i = tNode.directiveStart, end = tNode.directiveEnd; i < end; i++) {
    const directiveDef = tView.data[i];
    ngDevMode && assertDefined(directiveDef, "Expecting DirectiveDef");
    const lifecycleHooks = directiveDef.type.prototype;
    const {
      ngAfterContentInit,
      ngAfterContentChecked,
      ngAfterViewInit,
      ngAfterViewChecked,
      ngOnDestroy
    } = lifecycleHooks;
    if (ngAfterContentInit) {
      (tView.contentHooks ?? (tView.contentHooks = [])).push(-i, ngAfterContentInit);
    }
    if (ngAfterContentChecked) {
      (tView.contentHooks ?? (tView.contentHooks = [])).push(i, ngAfterContentChecked);
      (tView.contentCheckHooks ?? (tView.contentCheckHooks = [])).push(i, ngAfterContentChecked);
    }
    if (ngAfterViewInit) {
      (tView.viewHooks ?? (tView.viewHooks = [])).push(-i, ngAfterViewInit);
    }
    if (ngAfterViewChecked) {
      (tView.viewHooks ?? (tView.viewHooks = [])).push(i, ngAfterViewChecked);
      (tView.viewCheckHooks ?? (tView.viewCheckHooks = [])).push(i, ngAfterViewChecked);
    }
    if (ngOnDestroy != null) {
      (tView.destroyHooks ?? (tView.destroyHooks = [])).push(i, ngOnDestroy);
    }
  }
}
function executeCheckHooks(lView, hooks, nodeIndex) {
  callHooks(lView, hooks, 3, nodeIndex);
}
function executeInitAndCheckHooks(lView, hooks, initPhase, nodeIndex) {
  ngDevMode && assertNotEqual(initPhase, 3, "Init pre-order hooks should not be called more than once");
  if ((lView[FLAGS] & 3) === initPhase) {
    callHooks(lView, hooks, initPhase, nodeIndex);
  }
}
function incrementInitPhaseFlags(lView, initPhase) {
  ngDevMode && assertNotEqual(initPhase, 3, "Init hooks phase should not be incremented after all init hooks have been run.");
  let flags = lView[FLAGS];
  if ((flags & 3) === initPhase) {
    flags &= 2047;
    flags += 1;
    lView[FLAGS] = flags;
  }
}
function callHooks(currentView, arr, initPhase, currentNodeIndex) {
  ngDevMode && assertEqual(isInCheckNoChangesMode(), false, "Hooks should never be run when in check no changes mode.");
  const startIndex = currentNodeIndex !== void 0 ? currentView[PREORDER_HOOK_FLAGS] & 65535 : 0;
  const nodeIndexLimit = currentNodeIndex != null ? currentNodeIndex : -1;
  const max = arr.length - 1;
  let lastNodeIndexFound = 0;
  for (let i = startIndex; i < max; i++) {
    const hook = arr[i + 1];
    if (typeof hook === "number") {
      lastNodeIndexFound = arr[i];
      if (currentNodeIndex != null && lastNodeIndexFound >= currentNodeIndex) {
        break;
      }
    } else {
      const isInitHook = arr[i] < 0;
      if (isInitHook)
        currentView[PREORDER_HOOK_FLAGS] += 65536;
      if (lastNodeIndexFound < nodeIndexLimit || nodeIndexLimit == -1) {
        callHook(currentView, initPhase, arr, i);
        currentView[PREORDER_HOOK_FLAGS] = (currentView[PREORDER_HOOK_FLAGS] & 4294901760) + i + 2;
      }
      i++;
    }
  }
}
function callHook(currentView, initPhase, arr, i) {
  const isInitHook = arr[i] < 0;
  const hook = arr[i + 1];
  const directiveIndex = isInitHook ? -arr[i] : arr[i];
  const directive = currentView[directiveIndex];
  if (isInitHook) {
    const indexWithintInitPhase = currentView[FLAGS] >> 11;
    if (indexWithintInitPhase < currentView[PREORDER_HOOK_FLAGS] >> 16 && (currentView[FLAGS] & 3) === initPhase) {
      currentView[FLAGS] += 2048;
      profiler(4, directive, hook);
      try {
        hook.call(directive);
      } finally {
        profiler(5, directive, hook);
      }
    }
  } else {
    profiler(4, directive, hook);
    try {
      hook.call(directive);
    } finally {
      profiler(5, directive, hook);
    }
  }
}
var NO_PARENT_INJECTOR = -1;
var NodeInjectorFactory = class {
  constructor(factory, isViewProvider, injectImplementation) {
    this.factory = factory;
    this.resolving = false;
    ngDevMode && assertDefined(factory, "Factory not specified");
    ngDevMode && assertEqual(typeof factory, "function", "Expected factory function.");
    this.canSeeViewProviders = isViewProvider;
    this.injectImpl = injectImplementation;
  }
};
function isFactory(obj) {
  return obj instanceof NodeInjectorFactory;
}
function toTNodeTypeAsString(tNodeType) {
  let text = "";
  tNodeType & 1 && (text += "|Text");
  tNodeType & 2 && (text += "|Element");
  tNodeType & 4 && (text += "|Container");
  tNodeType & 8 && (text += "|ElementContainer");
  tNodeType & 16 && (text += "|Projection");
  tNodeType & 32 && (text += "|IcuContainer");
  tNodeType & 64 && (text += "|Placeholder");
  return text.length > 0 ? text.substring(1) : text;
}
function hasClassInput(tNode) {
  return (tNode.flags & 8) !== 0;
}
function hasStyleInput(tNode) {
  return (tNode.flags & 16) !== 0;
}
function assertTNodeType(tNode, expectedTypes, message) {
  assertDefined(tNode, "should be called with a TNode");
  if ((tNode.type & expectedTypes) === 0) {
    throwError2(message || `Expected [${toTNodeTypeAsString(expectedTypes)}] but got ${toTNodeTypeAsString(tNode.type)}.`);
  }
}
function assertPureTNodeType(type) {
  if (!(type === 2 || //
  type === 1 || //
  type === 4 || //
  type === 8 || //
  type === 32 || //
  type === 16 || //
  type === 64)) {
    throwError2(`Expected TNodeType to have only a single type selected, but got ${toTNodeTypeAsString(type)}.`);
  }
}
function setUpAttributes(renderer, native, attrs) {
  let i = 0;
  while (i < attrs.length) {
    const value = attrs[i];
    if (typeof value === "number") {
      if (value !== 0) {
        break;
      }
      i++;
      const namespaceURI = attrs[i++];
      const attrName = attrs[i++];
      const attrVal = attrs[i++];
      ngDevMode && ngDevMode.rendererSetAttribute++;
      renderer.setAttribute(native, attrName, attrVal, namespaceURI);
    } else {
      const attrName = value;
      const attrVal = attrs[++i];
      ngDevMode && ngDevMode.rendererSetAttribute++;
      if (isAnimationProp(attrName)) {
        renderer.setProperty(native, attrName, attrVal);
      } else {
        renderer.setAttribute(native, attrName, attrVal);
      }
      i++;
    }
  }
  return i;
}
function isNameOnlyAttributeMarker(marker) {
  return marker === 3 || marker === 4 || marker === 6;
}
function isAnimationProp(name) {
  return name.charCodeAt(0) === 64;
}
function mergeHostAttrs(dst, src) {
  if (src === null || src.length === 0) {
  } else if (dst === null || dst.length === 0) {
    dst = src.slice();
  } else {
    let srcMarker = -1;
    for (let i = 0; i < src.length; i++) {
      const item = src[i];
      if (typeof item === "number") {
        srcMarker = item;
      } else {
        if (srcMarker === 0) {
        } else if (srcMarker === -1 || srcMarker === 2) {
          mergeHostAttribute(dst, srcMarker, item, null, src[++i]);
        } else {
          mergeHostAttribute(dst, srcMarker, item, null, null);
        }
      }
    }
  }
  return dst;
}
function mergeHostAttribute(dst, marker, key1, key2, value) {
  let i = 0;
  let markerInsertPosition = dst.length;
  if (marker === -1) {
    markerInsertPosition = -1;
  } else {
    while (i < dst.length) {
      const dstValue = dst[i++];
      if (typeof dstValue === "number") {
        if (dstValue === marker) {
          markerInsertPosition = -1;
          break;
        } else if (dstValue > marker) {
          markerInsertPosition = i - 1;
          break;
        }
      }
    }
  }
  while (i < dst.length) {
    const item = dst[i];
    if (typeof item === "number") {
      break;
    } else if (item === key1) {
      if (key2 === null) {
        if (value !== null) {
          dst[i + 1] = value;
        }
        return;
      } else if (key2 === dst[i + 1]) {
        dst[i + 2] = value;
        return;
      }
    }
    i++;
    if (key2 !== null)
      i++;
    if (value !== null)
      i++;
  }
  if (markerInsertPosition !== -1) {
    dst.splice(markerInsertPosition, 0, marker);
    i = markerInsertPosition + 1;
  }
  dst.splice(i++, 0, key1);
  if (key2 !== null) {
    dst.splice(i++, 0, key2);
  }
  if (value !== null) {
    dst.splice(i++, 0, value);
  }
}
function hasParentInjector(parentLocation) {
  return parentLocation !== NO_PARENT_INJECTOR;
}
function getParentInjectorIndex(parentLocation) {
  ngDevMode && assertNumber(parentLocation, "Number expected");
  ngDevMode && assertNotEqual(parentLocation, -1, "Not a valid state.");
  const parentInjectorIndex = parentLocation & 32767;
  ngDevMode && assertGreaterThan(parentInjectorIndex, HEADER_OFFSET, "Parent injector must be pointing past HEADER_OFFSET.");
  return parentLocation & 32767;
}
function getParentInjectorViewOffset(parentLocation) {
  return parentLocation >> 16;
}
function getParentInjectorView(location2, startView) {
  let viewOffset = getParentInjectorViewOffset(location2);
  let parentView = startView;
  while (viewOffset > 0) {
    parentView = parentView[DECLARATION_VIEW];
    viewOffset--;
  }
  return parentView;
}
var includeViewProviders = true;
function setIncludeViewProviders(v) {
  const oldValue = includeViewProviders;
  includeViewProviders = v;
  return oldValue;
}
var BLOOM_SIZE = 256;
var BLOOM_MASK = BLOOM_SIZE - 1;
var BLOOM_BUCKET_BITS = 5;
var nextNgElementId = 0;
var NOT_FOUND = {};
function bloomAdd(injectorIndex, tView, type) {
  ngDevMode && assertEqual(tView.firstCreatePass, true, "expected firstCreatePass to be true");
  let id;
  if (typeof type === "string") {
    id = type.charCodeAt(0) || 0;
  } else if (type.hasOwnProperty(NG_ELEMENT_ID)) {
    id = type[NG_ELEMENT_ID];
  }
  if (id == null) {
    id = type[NG_ELEMENT_ID] = nextNgElementId++;
  }
  const bloomHash = id & BLOOM_MASK;
  const mask = 1 << bloomHash;
  tView.data[injectorIndex + (bloomHash >> BLOOM_BUCKET_BITS)] |= mask;
}
function getOrCreateNodeInjectorForNode(tNode, lView) {
  const existingInjectorIndex = getInjectorIndex(tNode, lView);
  if (existingInjectorIndex !== -1) {
    return existingInjectorIndex;
  }
  const tView = lView[TVIEW];
  if (tView.firstCreatePass) {
    tNode.injectorIndex = lView.length;
    insertBloom(tView.data, tNode);
    insertBloom(lView, null);
    insertBloom(tView.blueprint, null);
  }
  const parentLoc = getParentInjectorLocation(tNode, lView);
  const injectorIndex = tNode.injectorIndex;
  if (hasParentInjector(parentLoc)) {
    const parentIndex = getParentInjectorIndex(parentLoc);
    const parentLView = getParentInjectorView(parentLoc, lView);
    const parentData = parentLView[TVIEW].data;
    for (let i = 0; i < 8; i++) {
      lView[injectorIndex + i] = parentLView[parentIndex + i] | parentData[parentIndex + i];
    }
  }
  lView[
    injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  ] = parentLoc;
  return injectorIndex;
}
function insertBloom(arr, footer) {
  arr.push(0, 0, 0, 0, 0, 0, 0, 0, footer);
}
function getInjectorIndex(tNode, lView) {
  if (tNode.injectorIndex === -1 || // If the injector index is the same as its parent's injector index, then the index has been
  // copied down from the parent node. No injector has been created yet on this node.
  tNode.parent && tNode.parent.injectorIndex === tNode.injectorIndex || // After the first template pass, the injector index might exist but the parent values
  // might not have been calculated yet for this instance
  lView[
    tNode.injectorIndex + 8
    /* NodeInjectorOffset.PARENT */
  ] === null) {
    return -1;
  } else {
    ngDevMode && assertIndexInRange(lView, tNode.injectorIndex);
    return tNode.injectorIndex;
  }
}
function getParentInjectorLocation(tNode, lView) {
  if (tNode.parent && tNode.parent.injectorIndex !== -1) {
    return tNode.parent.injectorIndex;
  }
  let declarationViewOffset = 0;
  let parentTNode = null;
  let lViewCursor = lView;
  while (lViewCursor !== null) {
    parentTNode = getTNodeFromLView(lViewCursor);
    if (parentTNode === null) {
      return NO_PARENT_INJECTOR;
    }
    ngDevMode && parentTNode && assertTNodeForLView(parentTNode, lViewCursor[DECLARATION_VIEW]);
    declarationViewOffset++;
    lViewCursor = lViewCursor[DECLARATION_VIEW];
    if (parentTNode.injectorIndex !== -1) {
      return parentTNode.injectorIndex | declarationViewOffset << 16;
    }
  }
  return NO_PARENT_INJECTOR;
}
function diPublicInInjector(injectorIndex, tView, token) {
  bloomAdd(injectorIndex, tView, token);
}
function injectAttributeImpl(tNode, attrNameToInject) {
  ngDevMode && assertTNodeType(
    tNode,
    12 | 3
    /* TNodeType.AnyRNode */
  );
  ngDevMode && assertDefined(tNode, "expecting tNode");
  if (attrNameToInject === "class") {
    return tNode.classes;
  }
  if (attrNameToInject === "style") {
    return tNode.styles;
  }
  const attrs = tNode.attrs;
  if (attrs) {
    const attrsLength = attrs.length;
    let i = 0;
    while (i < attrsLength) {
      const value = attrs[i];
      if (isNameOnlyAttributeMarker(value))
        break;
      if (value === 0) {
        i = i + 2;
      } else if (typeof value === "number") {
        i++;
        while (i < attrsLength && typeof attrs[i] === "string") {
          i++;
        }
      } else if (value === attrNameToInject) {
        return attrs[i + 1];
      } else {
        i = i + 2;
      }
    }
  }
  return null;
}
function notFoundValueOrThrow(notFoundValue, token, flags) {
  if (flags & InjectFlags.Optional || notFoundValue !== void 0) {
    return notFoundValue;
  } else {
    throwProviderNotFoundError(token, "NodeInjector");
  }
}
function lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue) {
  if (flags & InjectFlags.Optional && notFoundValue === void 0) {
    notFoundValue = null;
  }
  if ((flags & (InjectFlags.Self | InjectFlags.Host)) === 0) {
    const moduleInjector = lView[INJECTOR$1];
    const previousInjectImplementation = setInjectImplementation(void 0);
    try {
      if (moduleInjector) {
        return moduleInjector.get(token, notFoundValue, flags & InjectFlags.Optional);
      } else {
        return injectRootLimpMode(token, notFoundValue, flags & InjectFlags.Optional);
      }
    } finally {
      setInjectImplementation(previousInjectImplementation);
    }
  }
  return notFoundValueOrThrow(notFoundValue, token, flags);
}
function getOrCreateInjectable(tNode, lView, token, flags = InjectFlags.Default, notFoundValue) {
  if (tNode !== null) {
    if (lView[FLAGS] & 1024) {
      const embeddedInjectorValue = lookupTokenUsingEmbeddedInjector(tNode, lView, token, flags, NOT_FOUND);
      if (embeddedInjectorValue !== NOT_FOUND) {
        return embeddedInjectorValue;
      }
    }
    const value = lookupTokenUsingNodeInjector(tNode, lView, token, flags, NOT_FOUND);
    if (value !== NOT_FOUND) {
      return value;
    }
  }
  return lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue);
}
function lookupTokenUsingNodeInjector(tNode, lView, token, flags, notFoundValue) {
  const bloomHash = bloomHashBitOrFactory(token);
  if (typeof bloomHash === "function") {
    if (!enterDI(lView, tNode, flags)) {
      return flags & InjectFlags.Host ? notFoundValueOrThrow(notFoundValue, token, flags) : lookupTokenUsingModuleInjector(lView, token, flags, notFoundValue);
    }
    try {
      const value = bloomHash(flags);
      if (value == null && !(flags & InjectFlags.Optional)) {
        throwProviderNotFoundError(token);
      } else {
        return value;
      }
    } finally {
      leaveDI();
    }
  } else if (typeof bloomHash === "number") {
    let previousTView = null;
    let injectorIndex = getInjectorIndex(tNode, lView);
    let parentLocation = NO_PARENT_INJECTOR;
    let hostTElementNode = flags & InjectFlags.Host ? lView[DECLARATION_COMPONENT_VIEW][T_HOST] : null;
    if (injectorIndex === -1 || flags & InjectFlags.SkipSelf) {
      parentLocation = injectorIndex === -1 ? getParentInjectorLocation(tNode, lView) : lView[
        injectorIndex + 8
        /* NodeInjectorOffset.PARENT */
      ];
      if (parentLocation === NO_PARENT_INJECTOR || !shouldSearchParent(flags, false)) {
        injectorIndex = -1;
      } else {
        previousTView = lView[TVIEW];
        injectorIndex = getParentInjectorIndex(parentLocation);
        lView = getParentInjectorView(parentLocation, lView);
      }
    }
    while (injectorIndex !== -1) {
      ngDevMode && assertNodeInjector(lView, injectorIndex);
      const tView = lView[TVIEW];
      ngDevMode && assertTNodeForLView(tView.data[
        injectorIndex + 8
        /* NodeInjectorOffset.TNODE */
      ], lView);
      if (bloomHasToken(bloomHash, injectorIndex, tView.data)) {
        const instance = searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode);
        if (instance !== NOT_FOUND) {
          return instance;
        }
      }
      parentLocation = lView[
        injectorIndex + 8
        /* NodeInjectorOffset.PARENT */
      ];
      if (parentLocation !== NO_PARENT_INJECTOR && shouldSearchParent(flags, lView[TVIEW].data[
        injectorIndex + 8
        /* NodeInjectorOffset.TNODE */
      ] === hostTElementNode) && bloomHasToken(bloomHash, injectorIndex, lView)) {
        previousTView = tView;
        injectorIndex = getParentInjectorIndex(parentLocation);
        lView = getParentInjectorView(parentLocation, lView);
      } else {
        injectorIndex = -1;
      }
    }
  }
  return notFoundValue;
}
function searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode) {
  const currentTView = lView[TVIEW];
  const tNode = currentTView.data[
    injectorIndex + 8
    /* NodeInjectorOffset.TNODE */
  ];
  const canAccessViewProviders = previousTView == null ? (
    // 1) This is the first invocation `previousTView == null` which means that we are at the
    // `TNode` of where injector is starting to look. In such a case the only time we are allowed
    // to look into the ViewProviders is if:
    // - we are on a component
    // - AND the injector set `includeViewProviders` to true (implying that the token can see
    // ViewProviders because it is the Component or a Service which itself was declared in
    // ViewProviders)
    isComponentHost(tNode) && includeViewProviders
  ) : (
    // 2) `previousTView != null` which means that we are now walking across the parent nodes.
    // In such a case we are only allowed to look into the ViewProviders if:
    // - We just crossed from child View to Parent View `previousTView != currentTView`
    // - AND the parent TNode is an Element.
    // This means that we just came from the Component's View and therefore are allowed to see
    // into the ViewProviders.
    previousTView != currentTView && (tNode.type & 3) !== 0
  );
  const isHostSpecialCase = flags & InjectFlags.Host && hostTElementNode === tNode;
  const injectableIdx = locateDirectiveOrProvider(tNode, currentTView, token, canAccessViewProviders, isHostSpecialCase);
  if (injectableIdx !== null) {
    return getNodeInjectable(lView, currentTView, injectableIdx, tNode);
  } else {
    return NOT_FOUND;
  }
}
function locateDirectiveOrProvider(tNode, tView, token, canAccessViewProviders, isHostSpecialCase) {
  const nodeProviderIndexes = tNode.providerIndexes;
  const tInjectables = tView.data;
  const injectablesStart = nodeProviderIndexes & 1048575;
  const directivesStart = tNode.directiveStart;
  const directiveEnd = tNode.directiveEnd;
  const cptViewProvidersCount = nodeProviderIndexes >> 20;
  const startingIndex = canAccessViewProviders ? injectablesStart : injectablesStart + cptViewProvidersCount;
  const endIndex = isHostSpecialCase ? injectablesStart + cptViewProvidersCount : directiveEnd;
  for (let i = startingIndex; i < endIndex; i++) {
    const providerTokenOrDef = tInjectables[i];
    if (i < directivesStart && token === providerTokenOrDef || i >= directivesStart && providerTokenOrDef.type === token) {
      return i;
    }
  }
  if (isHostSpecialCase) {
    const dirDef = tInjectables[directivesStart];
    if (dirDef && isComponentDef(dirDef) && dirDef.type === token) {
      return directivesStart;
    }
  }
  return null;
}
function getNodeInjectable(lView, tView, index, tNode) {
  let value = lView[index];
  const tData = tView.data;
  if (isFactory(value)) {
    const factory = value;
    if (factory.resolving) {
      throwCyclicDependencyError(stringifyForError(tData[index]));
    }
    const previousIncludeViewProviders = setIncludeViewProviders(factory.canSeeViewProviders);
    factory.resolving = true;
    const previousInjectImplementation = factory.injectImpl ? setInjectImplementation(factory.injectImpl) : null;
    const success = enterDI(lView, tNode, InjectFlags.Default);
    ngDevMode && assertEqual(success, true, "Because flags do not contain `SkipSelf' we expect this to always succeed.");
    try {
      value = lView[index] = factory.factory(void 0, tData, lView, tNode);
      if (tView.firstCreatePass && index >= tNode.directiveStart) {
        ngDevMode && assertDirectiveDef(tData[index]);
        registerPreOrderHooks(index, tData[index], tView);
      }
    } finally {
      previousInjectImplementation !== null && setInjectImplementation(previousInjectImplementation);
      setIncludeViewProviders(previousIncludeViewProviders);
      factory.resolving = false;
      leaveDI();
    }
  }
  return value;
}
function bloomHashBitOrFactory(token) {
  ngDevMode && assertDefined(token, "token must be defined");
  if (typeof token === "string") {
    return token.charCodeAt(0) || 0;
  }
  const tokenId = (
    // First check with `hasOwnProperty` so we don't get an inherited ID.
    token.hasOwnProperty(NG_ELEMENT_ID) ? token[NG_ELEMENT_ID] : void 0
  );
  if (typeof tokenId === "number") {
    if (tokenId >= 0) {
      return tokenId & BLOOM_MASK;
    } else {
      ngDevMode && assertEqual(tokenId, -1, "Expecting to get Special Injector Id");
      return createNodeInjector;
    }
  } else {
    return tokenId;
  }
}
function bloomHasToken(bloomHash, injectorIndex, injectorView) {
  const mask = 1 << bloomHash;
  const value = injectorView[injectorIndex + (bloomHash >> BLOOM_BUCKET_BITS)];
  return !!(value & mask);
}
function shouldSearchParent(flags, isFirstHostTNode) {
  return !(flags & InjectFlags.Self) && !(flags & InjectFlags.Host && isFirstHostTNode);
}
var NodeInjector = class {
  constructor(_tNode, _lView) {
    this._tNode = _tNode;
    this._lView = _lView;
  }
  get(token, notFoundValue, flags) {
    return getOrCreateInjectable(this._tNode, this._lView, token, convertToBitFlags(flags), notFoundValue);
  }
};
function createNodeInjector() {
  return new NodeInjector(getCurrentTNode(), getLView());
}
function \u0275\u0275getInheritedFactory(type) {
  return noSideEffects(() => {
    const ownConstructor = type.prototype.constructor;
    const ownFactory = ownConstructor[NG_FACTORY_DEF] || getFactoryOf(ownConstructor);
    const objectPrototype = Object.prototype;
    let parent = Object.getPrototypeOf(type.prototype).constructor;
    while (parent && parent !== objectPrototype) {
      const factory = parent[NG_FACTORY_DEF] || getFactoryOf(parent);
      if (factory && factory !== ownFactory) {
        return factory;
      }
      parent = Object.getPrototypeOf(parent);
    }
    return (t) => new t();
  });
}
function getFactoryOf(type) {
  if (isForwardRef(type)) {
    return () => {
      const factory = getFactoryOf(resolveForwardRef(type));
      return factory && factory();
    };
  }
  return getFactoryDef(type);
}
function lookupTokenUsingEmbeddedInjector(tNode, lView, token, flags, notFoundValue) {
  let currentTNode = tNode;
  let currentLView = lView;
  while (currentTNode !== null && currentLView !== null && currentLView[FLAGS] & 1024 && !(currentLView[FLAGS] & 256)) {
    ngDevMode && assertTNodeForLView(currentTNode, currentLView);
    const nodeInjectorValue = lookupTokenUsingNodeInjector(currentTNode, currentLView, token, flags | InjectFlags.Self, NOT_FOUND);
    if (nodeInjectorValue !== NOT_FOUND) {
      return nodeInjectorValue;
    }
    let parentTNode = currentTNode.parent;
    if (!parentTNode) {
      const embeddedViewInjector = currentLView[EMBEDDED_VIEW_INJECTOR];
      if (embeddedViewInjector) {
        const embeddedViewInjectorValue = embeddedViewInjector.get(token, NOT_FOUND, flags);
        if (embeddedViewInjectorValue !== NOT_FOUND) {
          return embeddedViewInjectorValue;
        }
      }
      parentTNode = getTNodeFromLView(currentLView);
      currentLView = currentLView[DECLARATION_VIEW];
    }
    currentTNode = parentTNode;
  }
  return notFoundValue;
}
function getTNodeFromLView(lView) {
  const tView = lView[TVIEW];
  const tViewType = tView.type;
  if (tViewType === 2) {
    ngDevMode && assertDefined(tView.declTNode, "Embedded TNodes should have declaration parents.");
    return tView.declTNode;
  } else if (tViewType === 1) {
    return lView[T_HOST];
  }
  return null;
}
function \u0275\u0275injectAttribute(attrNameToInject) {
  return injectAttributeImpl(getCurrentTNode(), attrNameToInject);
}
var PARAMETERS = "__parameters__";
function makeMetadataCtor(props) {
  return function ctor(...args) {
    if (props) {
      const values = props(...args);
      for (const propName in values) {
        this[propName] = values[propName];
      }
    }
  };
}
function makeParamDecorator(name, props, parentClass) {
  return noSideEffects(() => {
    const metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory(...args) {
      if (this instanceof ParamDecoratorFactory) {
        metaCtor.apply(this, args);
        return this;
      }
      const annotationInstance = new ParamDecoratorFactory(...args);
      ParamDecorator.annotation = annotationInstance;
      return ParamDecorator;
      function ParamDecorator(cls, unusedKey, index) {
        const parameters = cls.hasOwnProperty(PARAMETERS) ? cls[PARAMETERS] : Object.defineProperty(cls, PARAMETERS, {
          value: []
        })[PARAMETERS];
        while (parameters.length <= index) {
          parameters.push(null);
        }
        (parameters[index] = parameters[index] || []).push(annotationInstance);
        return cls;
      }
    }
    if (parentClass) {
      ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.ngMetadataName = name;
    ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
  });
}
var InjectionToken = class {
  /**
   * @param _desc   Description for the token,
   *                used only for debugging purposes,
   *                it should but does not need to be unique
   * @param options Options for the token's usage, as described above
   */
  constructor(_desc, options) {
    this._desc = _desc;
    this.ngMetadataName = "InjectionToken";
    this.\u0275prov = void 0;
    if (typeof options == "number") {
      (typeof ngDevMode === "undefined" || ngDevMode) && assertLessThan(options, 0, "Only negative numbers are supported here");
      this.__NG_ELEMENT_ID__ = options;
    } else if (options !== void 0) {
      this.\u0275prov = \u0275\u0275defineInjectable({
        token: this,
        providedIn: options.providedIn || "root",
        factory: options.factory
      });
    }
  }
  /**
   * @internal
   */
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
function getCompilerFacade(request) {
  const globalNg = _global["ng"];
  if (globalNg && globalNg.\u0275compilerFacade) {
    return globalNg.\u0275compilerFacade;
  }
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    console.error(`JIT compilation failed for ${request.kind}`, request.type);
    let message = `The ${request.kind} '${request.type.name}' needs to be compiled using the JIT compiler, but '@angular/compiler' is not available.

`;
    if (request.usage === 1) {
      message += `The ${request.kind} is part of a library that has been partially compiled.
`;
      message += `However, the Angular Linker has not processed the library such that JIT compilation is used as fallback.
`;
      message += "\n";
      message += `Ideally, the library is processed using the Angular Linker to become fully AOT compiled.
`;
    } else {
      message += `JIT compilation is discouraged for production use-cases! Consider using AOT mode instead.
`;
    }
    message += `Alternatively, the JIT compiler should be loaded by bootstrapping using '@angular/platform-browser-dynamic' or '@angular/platform-server',
`;
    message += `or manually provide the compiler with 'import "@angular/compiler";' before bootstrapping.`;
    throw new Error(message);
  } else {
    throw new Error("JIT compiler unavailable");
  }
}
function isType(v) {
  return typeof v === "function";
}
function deepForEach(input, fn) {
  input.forEach((value) => Array.isArray(value) ? deepForEach(value, fn) : fn(value));
}
function addToArray(arr, index, value) {
  if (index >= arr.length) {
    arr.push(value);
  } else {
    arr.splice(index, 0, value);
  }
}
function removeFromArray(arr, index) {
  if (index >= arr.length - 1) {
    return arr.pop();
  } else {
    return arr.splice(index, 1)[0];
  }
}
function newArray(size, value) {
  const list = [];
  for (let i = 0; i < size; i++) {
    list.push(value);
  }
  return list;
}
var Optional = (
  // Disable tslint because `InternalInjectFlags` is a const enum which gets inlined.
  // tslint:disable-next-line: no-toplevel-property-access
  /* @__PURE__ */ attachInjectFlag(
    /* @__PURE__ */ makeParamDecorator("Optional"),
    8
    /* InternalInjectFlags.Optional */
  )
);
var SkipSelf = (
  // Disable tslint because `InternalInjectFlags` is a const enum which gets inlined.
  // tslint:disable-next-line: no-toplevel-property-access
  /* @__PURE__ */ attachInjectFlag(
    /* @__PURE__ */ makeParamDecorator("SkipSelf"),
    4
    /* InternalInjectFlags.SkipSelf */
  )
);
function resolveComponentResources(resourceResolver) {
  const componentResolved = [];
  const urlMap = /* @__PURE__ */ new Map();
  function cachedResourceResolve(url) {
    let promise2 = urlMap.get(url);
    if (!promise2) {
      const resp = resourceResolver(url);
      urlMap.set(url, promise2 = resp.then(unwrapResponse));
    }
    return promise2;
  }
  componentResourceResolutionQueue.forEach((component, type) => {
    const promises = [];
    if (component.templateUrl) {
      promises.push(cachedResourceResolve(component.templateUrl).then((template) => {
        component.template = template;
      }));
    }
    const styleUrls = component.styleUrls;
    const styles = component.styles || (component.styles = []);
    const styleOffset = component.styles.length;
    styleUrls && styleUrls.forEach((styleUrl, index) => {
      styles.push("");
      promises.push(cachedResourceResolve(styleUrl).then((style) => {
        styles[styleOffset + index] = style;
        styleUrls.splice(styleUrls.indexOf(styleUrl), 1);
        if (styleUrls.length == 0) {
          component.styleUrls = void 0;
        }
      }));
    });
    const fullyResolved = Promise.all(promises).then(() => componentDefResolved(type));
    componentResolved.push(fullyResolved);
  });
  clearResolutionOfComponentResourcesQueue();
  return Promise.all(componentResolved).then(() => void 0);
}
var componentResourceResolutionQueue = /* @__PURE__ */ new Map();
var componentDefPendingResolution = /* @__PURE__ */ new Set();
function clearResolutionOfComponentResourcesQueue() {
  const old = componentResourceResolutionQueue;
  componentResourceResolutionQueue = /* @__PURE__ */ new Map();
  return old;
}
function isComponentResourceResolutionQueueEmpty() {
  return componentResourceResolutionQueue.size === 0;
}
function unwrapResponse(response) {
  return typeof response == "string" ? response : response.text();
}
function componentDefResolved(type) {
  componentDefPendingResolution.delete(type);
}
var CUSTOM_ELEMENTS_SCHEMA = {
  name: "custom-elements"
};
var NO_ERRORS_SCHEMA = {
  name: "no-errors-schema"
};
var shouldThrowErrorOnUnknownElement = false;
var shouldThrowErrorOnUnknownProperty = false;
function validateElementIsKnown(element, lView, tagName, schemas, hasDirectives) {
  if (schemas === null)
    return;
  if (!hasDirectives && tagName !== null) {
    const isUnknown = (
      // Note that we can't check for `typeof HTMLUnknownElement === 'function'`,
      // because while most browsers return 'function', IE returns 'object'.
      typeof HTMLUnknownElement !== "undefined" && HTMLUnknownElement && element instanceof HTMLUnknownElement || typeof customElements !== "undefined" && tagName.indexOf("-") > -1 && !customElements.get(tagName)
    );
    if (isUnknown && !matchingSchemas(schemas, tagName)) {
      const isHostStandalone = isHostComponentStandalone(lView);
      const templateLocation = getTemplateLocationDetails(lView);
      const schemas2 = `'${isHostStandalone ? "@Component" : "@NgModule"}.schemas'`;
      let message = `'${tagName}' is not a known element${templateLocation}:
`;
      message += `1. If '${tagName}' is an Angular component, then verify that it is ${isHostStandalone ? "included in the '@Component.imports' of this component" : "a part of an @NgModule where this component is declared"}.
`;
      if (tagName && tagName.indexOf("-") > -1) {
        message += `2. If '${tagName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the ${schemas2} of this component to suppress this message.`;
      } else {
        message += `2. To allow any element add 'NO_ERRORS_SCHEMA' to the ${schemas2} of this component.`;
      }
      if (shouldThrowErrorOnUnknownElement) {
        throw new RuntimeError(304, message);
      } else {
        console.error(formatRuntimeError(304, message));
      }
    }
  }
}
function reportUnknownPropertyError(message) {
  if (shouldThrowErrorOnUnknownProperty) {
    throw new RuntimeError(303, message);
  } else {
    console.error(formatRuntimeError(303, message));
  }
}
function getDeclarationComponentDef(lView) {
  !ngDevMode && throwError2("Must never be called in production mode");
  const declarationLView = lView[DECLARATION_COMPONENT_VIEW];
  const context2 = declarationLView[CONTEXT];
  if (!context2)
    return null;
  return context2.constructor ? getComponentDef(context2.constructor) : null;
}
function isHostComponentStandalone(lView) {
  !ngDevMode && throwError2("Must never be called in production mode");
  const componentDef = getDeclarationComponentDef(lView);
  return !!componentDef?.standalone;
}
function getTemplateLocationDetails(lView) {
  !ngDevMode && throwError2("Must never be called in production mode");
  const hostComponentDef = getDeclarationComponentDef(lView);
  const componentClassName = hostComponentDef?.type?.name;
  return componentClassName ? ` (used in the '${componentClassName}' component template)` : "";
}
function matchingSchemas(schemas, tagName) {
  if (schemas !== null) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      if (schema === NO_ERRORS_SCHEMA || schema === CUSTOM_ELEMENTS_SCHEMA && tagName && tagName.indexOf("-") > -1) {
        return true;
      }
    }
  }
  return false;
}
var RendererStyleFlags2 = /* @__PURE__ */ (() => {
  RendererStyleFlags2 = RendererStyleFlags2 || {};
  RendererStyleFlags2[RendererStyleFlags2["Important"] = 1] = "Important";
  RendererStyleFlags2[RendererStyleFlags2["DashCase"] = 2] = "DashCase";
  return RendererStyleFlags2;
})();
var COMMENT_DISALLOWED = /^>|^->|<!--|-->|--!>|<!-$/g;
var COMMENT_DELIMITER = /(<|>)/;
var COMMENT_DELIMITER_ESCAPED = "\u200B$1\u200B";
function escapeCommentText(value) {
  return value.replace(COMMENT_DISALLOWED, (text) => text.replace(COMMENT_DELIMITER, COMMENT_DELIMITER_ESCAPED));
}
var TRACKED_LVIEWS = /* @__PURE__ */ new Map();
var uniqueIdCounter = 0;
function getUniqueLViewId() {
  return uniqueIdCounter++;
}
function registerLView(lView) {
  ngDevMode && assertNumber(lView[ID], "LView must have an ID in order to be registered");
  TRACKED_LVIEWS.set(lView[ID], lView);
}
function getLViewById(id) {
  ngDevMode && assertNumber(id, "ID used for LView lookup must be a number");
  return TRACKED_LVIEWS.get(id) || null;
}
function unregisterLView(lView) {
  ngDevMode && assertNumber(lView[ID], "Cannot stop tracking an LView that does not have an ID");
  TRACKED_LVIEWS.delete(lView[ID]);
}
var LContext = class {
  /** Component's parent view data. */
  get lView() {
    return getLViewById(this.lViewId);
  }
  constructor(lViewId, nodeIndex, native) {
    this.lViewId = lViewId;
    this.nodeIndex = nodeIndex;
    this.native = native;
  }
};
function getLContext(target) {
  let mpValue = readPatchedData(target);
  if (mpValue) {
    if (isLView(mpValue)) {
      const lView = mpValue;
      let nodeIndex;
      let component = void 0;
      let directives = void 0;
      if (isComponentInstance(target)) {
        nodeIndex = findViaComponent(lView, target);
        if (nodeIndex == -1) {
          throw new Error("The provided component was not found in the application");
        }
        component = target;
      } else if (isDirectiveInstance(target)) {
        nodeIndex = findViaDirective(lView, target);
        if (nodeIndex == -1) {
          throw new Error("The provided directive was not found in the application");
        }
        directives = getDirectivesAtNodeIndex(nodeIndex, lView);
      } else {
        nodeIndex = findViaNativeElement(lView, target);
        if (nodeIndex == -1) {
          return null;
        }
      }
      const native = unwrapRNode(lView[nodeIndex]);
      const existingCtx = readPatchedData(native);
      const context2 = existingCtx && !Array.isArray(existingCtx) ? existingCtx : createLContext(lView, nodeIndex, native);
      if (component && context2.component === void 0) {
        context2.component = component;
        attachPatchData(context2.component, context2);
      }
      if (directives && context2.directives === void 0) {
        context2.directives = directives;
        for (let i = 0; i < directives.length; i++) {
          attachPatchData(directives[i], context2);
        }
      }
      attachPatchData(context2.native, context2);
      mpValue = context2;
    }
  } else {
    const rElement = target;
    ngDevMode && assertDomNode(rElement);
    let parent = rElement;
    while (parent = parent.parentNode) {
      const parentContext = readPatchedData(parent);
      if (parentContext) {
        const lView = Array.isArray(parentContext) ? parentContext : parentContext.lView;
        if (!lView) {
          return null;
        }
        const index = findViaNativeElement(lView, rElement);
        if (index >= 0) {
          const native = unwrapRNode(lView[index]);
          const context2 = createLContext(lView, index, native);
          attachPatchData(native, context2);
          mpValue = context2;
          break;
        }
      }
    }
  }
  return mpValue || null;
}
function createLContext(lView, nodeIndex, native) {
  return new LContext(lView[ID], nodeIndex, native);
}
function getComponentViewByInstance(componentInstance) {
  let patchedData = readPatchedData(componentInstance);
  let lView;
  if (isLView(patchedData)) {
    const contextLView = patchedData;
    const nodeIndex = findViaComponent(contextLView, componentInstance);
    lView = getComponentLViewByIndex(nodeIndex, contextLView);
    const context2 = createLContext(contextLView, nodeIndex, lView[HOST]);
    context2.component = componentInstance;
    attachPatchData(componentInstance, context2);
    attachPatchData(context2.native, context2);
  } else {
    const context2 = patchedData;
    const contextLView = context2.lView;
    ngDevMode && assertLView(contextLView);
    lView = getComponentLViewByIndex(context2.nodeIndex, contextLView);
  }
  return lView;
}
var MONKEY_PATCH_KEY_NAME = "__ngContext__";
function attachPatchData(target, data) {
  ngDevMode && assertDefined(target, "Target expected");
  if (isLView(data)) {
    target[MONKEY_PATCH_KEY_NAME] = data[ID];
    registerLView(data);
  } else {
    target[MONKEY_PATCH_KEY_NAME] = data;
  }
}
function readPatchedData(target) {
  ngDevMode && assertDefined(target, "Target expected");
  const data = target[MONKEY_PATCH_KEY_NAME];
  return typeof data === "number" ? getLViewById(data) : data || null;
}
function readPatchedLView(target) {
  const value = readPatchedData(target);
  if (value) {
    return isLView(value) ? value : value.lView;
  }
  return null;
}
function isComponentInstance(instance) {
  return instance && instance.constructor && instance.constructor.\u0275cmp;
}
function isDirectiveInstance(instance) {
  return instance && instance.constructor && instance.constructor.\u0275dir;
}
function findViaNativeElement(lView, target) {
  const tView = lView[TVIEW];
  for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
    if (unwrapRNode(lView[i]) === target) {
      return i;
    }
  }
  return -1;
}
function traverseNextElement(tNode) {
  if (tNode.child) {
    return tNode.child;
  } else if (tNode.next) {
    return tNode.next;
  } else {
    while (tNode.parent && !tNode.parent.next) {
      tNode = tNode.parent;
    }
    return tNode.parent && tNode.parent.next;
  }
}
function findViaComponent(lView, componentInstance) {
  const componentIndices = lView[TVIEW].components;
  if (componentIndices) {
    for (let i = 0; i < componentIndices.length; i++) {
      const elementComponentIndex = componentIndices[i];
      const componentView = getComponentLViewByIndex(elementComponentIndex, lView);
      if (componentView[CONTEXT] === componentInstance) {
        return elementComponentIndex;
      }
    }
  } else {
    const rootComponentView = getComponentLViewByIndex(HEADER_OFFSET, lView);
    const rootComponent = rootComponentView[CONTEXT];
    if (rootComponent === componentInstance) {
      return HEADER_OFFSET;
    }
  }
  return -1;
}
function findViaDirective(lView, directiveInstance) {
  let tNode = lView[TVIEW].firstChild;
  while (tNode) {
    const directiveIndexStart = tNode.directiveStart;
    const directiveIndexEnd = tNode.directiveEnd;
    for (let i = directiveIndexStart; i < directiveIndexEnd; i++) {
      if (lView[i] === directiveInstance) {
        return tNode.index;
      }
    }
    tNode = traverseNextElement(tNode);
  }
  return -1;
}
function getDirectivesAtNodeIndex(nodeIndex, lView) {
  const tNode = lView[TVIEW].data[nodeIndex];
  if (tNode.directiveStart === 0)
    return EMPTY_ARRAY;
  const results = [];
  for (let i = tNode.directiveStart; i < tNode.directiveEnd; i++) {
    const directiveInstance = lView[i];
    if (!isComponentInstance(directiveInstance)) {
      results.push(directiveInstance);
    }
  }
  return results;
}
function getComponentAtNodeIndex(nodeIndex, lView) {
  const tNode = lView[TVIEW].data[nodeIndex];
  const {
    directiveStart,
    componentOffset
  } = tNode;
  return componentOffset > -1 ? lView[directiveStart + componentOffset] : null;
}
var _icuContainerIterate;
function icuContainerIterate(tIcuContainerNode, lView) {
  return _icuContainerIterate(tIcuContainerNode, lView);
}
function getLViewParent(lView) {
  ngDevMode && assertLView(lView);
  const parent = lView[PARENT];
  return isLContainer(parent) ? parent[PARENT] : parent;
}
function getRootView(componentOrLView) {
  ngDevMode && assertDefined(componentOrLView, "component");
  let lView = isLView(componentOrLView) ? componentOrLView : readPatchedLView(componentOrLView);
  while (lView && !(lView[FLAGS] & 256)) {
    lView = getLViewParent(lView);
  }
  ngDevMode && assertLView(lView);
  return lView;
}
function getRootContext(viewOrComponent) {
  const rootView = getRootView(viewOrComponent);
  ngDevMode && assertDefined(rootView[CONTEXT], "Root view has no context. Perhaps it is disconnected?");
  return rootView[CONTEXT];
}
function getFirstLContainer(lView) {
  return getNearestLContainer(lView[CHILD_HEAD]);
}
function getNextLContainer(container) {
  return getNearestLContainer(container[NEXT]);
}
function getNearestLContainer(viewOrContainer) {
  while (viewOrContainer !== null && !isLContainer(viewOrContainer)) {
    viewOrContainer = viewOrContainer[NEXT];
  }
  return viewOrContainer;
}
function applyToElementOrContainer(action, renderer, parent, lNodeToHandle, beforeNode) {
  if (lNodeToHandle != null) {
    let lContainer;
    let isComponent = false;
    if (isLContainer(lNodeToHandle)) {
      lContainer = lNodeToHandle;
    } else if (isLView(lNodeToHandle)) {
      isComponent = true;
      ngDevMode && assertDefined(lNodeToHandle[HOST], "HOST must be defined for a component LView");
      lNodeToHandle = lNodeToHandle[HOST];
    }
    const rNode = unwrapRNode(lNodeToHandle);
    if (action === 0 && parent !== null) {
      if (beforeNode == null) {
        nativeAppendChild(renderer, parent, rNode);
      } else {
        nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
      }
    } else if (action === 1 && parent !== null) {
      nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
    } else if (action === 2) {
      nativeRemoveNode(renderer, rNode, isComponent);
    } else if (action === 3) {
      ngDevMode && ngDevMode.rendererDestroyNode++;
      renderer.destroyNode(rNode);
    }
    if (lContainer != null) {
      applyContainer(renderer, action, lContainer, parent, beforeNode);
    }
  }
}
function createTextNode(renderer, value) {
  ngDevMode && ngDevMode.rendererCreateTextNode++;
  ngDevMode && ngDevMode.rendererSetText++;
  return renderer.createText(value);
}
function createElementNode(renderer, name, namespace) {
  ngDevMode && ngDevMode.rendererCreateElement++;
  return renderer.createElement(name, namespace);
}
function removeViewFromContainer(tView, lView) {
  const renderer = lView[RENDERER];
  applyView(tView, lView, renderer, 2, null, null);
  lView[HOST] = null;
  lView[T_HOST] = null;
}
function addViewToContainer(tView, parentTNode, renderer, lView, parentNativeNode, beforeNode) {
  lView[HOST] = parentNativeNode;
  lView[T_HOST] = parentTNode;
  applyView(tView, lView, renderer, 1, parentNativeNode, beforeNode);
}
function renderDetachView(tView, lView) {
  applyView(tView, lView, lView[RENDERER], 2, null, null);
}
function destroyViewTree(rootView) {
  let lViewOrLContainer = rootView[CHILD_HEAD];
  if (!lViewOrLContainer) {
    return cleanUpView(rootView[TVIEW], rootView);
  }
  while (lViewOrLContainer) {
    let next = null;
    if (isLView(lViewOrLContainer)) {
      next = lViewOrLContainer[CHILD_HEAD];
    } else {
      ngDevMode && assertLContainer(lViewOrLContainer);
      const firstView = lViewOrLContainer[CONTAINER_HEADER_OFFSET];
      if (firstView)
        next = firstView;
    }
    if (!next) {
      while (lViewOrLContainer && !lViewOrLContainer[NEXT] && lViewOrLContainer !== rootView) {
        if (isLView(lViewOrLContainer)) {
          cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
        }
        lViewOrLContainer = lViewOrLContainer[PARENT];
      }
      if (lViewOrLContainer === null)
        lViewOrLContainer = rootView;
      if (isLView(lViewOrLContainer)) {
        cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
      }
      next = lViewOrLContainer && lViewOrLContainer[NEXT];
    }
    lViewOrLContainer = next;
  }
}
function insertView(tView, lView, lContainer, index) {
  ngDevMode && assertLView(lView);
  ngDevMode && assertLContainer(lContainer);
  const indexInContainer = CONTAINER_HEADER_OFFSET + index;
  const containerLength = lContainer.length;
  if (index > 0) {
    lContainer[indexInContainer - 1][NEXT] = lView;
  }
  if (index < containerLength - CONTAINER_HEADER_OFFSET) {
    lView[NEXT] = lContainer[indexInContainer];
    addToArray(lContainer, CONTAINER_HEADER_OFFSET + index, lView);
  } else {
    lContainer.push(lView);
    lView[NEXT] = null;
  }
  lView[PARENT] = lContainer;
  const declarationLContainer = lView[DECLARATION_LCONTAINER];
  if (declarationLContainer !== null && lContainer !== declarationLContainer) {
    trackMovedView(declarationLContainer, lView);
  }
  const lQueries = lView[QUERIES];
  if (lQueries !== null) {
    lQueries.insertView(tView);
  }
  lView[FLAGS] |= 64;
}
function trackMovedView(declarationContainer, lView) {
  ngDevMode && assertDefined(lView, "LView required");
  ngDevMode && assertLContainer(declarationContainer);
  const movedViews = declarationContainer[MOVED_VIEWS];
  const insertedLContainer = lView[PARENT];
  ngDevMode && assertLContainer(insertedLContainer);
  const insertedComponentLView = insertedLContainer[PARENT][DECLARATION_COMPONENT_VIEW];
  ngDevMode && assertDefined(insertedComponentLView, "Missing insertedComponentLView");
  const declaredComponentLView = lView[DECLARATION_COMPONENT_VIEW];
  ngDevMode && assertDefined(declaredComponentLView, "Missing declaredComponentLView");
  if (declaredComponentLView !== insertedComponentLView) {
    declarationContainer[HAS_TRANSPLANTED_VIEWS] = true;
  }
  if (movedViews === null) {
    declarationContainer[MOVED_VIEWS] = [lView];
  } else {
    movedViews.push(lView);
  }
}
function detachMovedView(declarationContainer, lView) {
  ngDevMode && assertLContainer(declarationContainer);
  ngDevMode && assertDefined(declarationContainer[MOVED_VIEWS], "A projected view should belong to a non-empty projected views collection");
  const movedViews = declarationContainer[MOVED_VIEWS];
  const declarationViewIndex = movedViews.indexOf(lView);
  const insertionLContainer = lView[PARENT];
  ngDevMode && assertLContainer(insertionLContainer);
  if (lView[FLAGS] & 512) {
    lView[FLAGS] &= ~512;
    updateTransplantedViewCount(insertionLContainer, -1);
  }
  movedViews.splice(declarationViewIndex, 1);
}
function detachView(lContainer, removeIndex) {
  if (lContainer.length <= CONTAINER_HEADER_OFFSET)
    return;
  const indexInContainer = CONTAINER_HEADER_OFFSET + removeIndex;
  const viewToDetach = lContainer[indexInContainer];
  if (viewToDetach) {
    const declarationLContainer = viewToDetach[DECLARATION_LCONTAINER];
    if (declarationLContainer !== null && declarationLContainer !== lContainer) {
      detachMovedView(declarationLContainer, viewToDetach);
    }
    if (removeIndex > 0) {
      lContainer[indexInContainer - 1][NEXT] = viewToDetach[NEXT];
    }
    const removedLView = removeFromArray(lContainer, CONTAINER_HEADER_OFFSET + removeIndex);
    removeViewFromContainer(viewToDetach[TVIEW], viewToDetach);
    const lQueries = removedLView[QUERIES];
    if (lQueries !== null) {
      lQueries.detachView(removedLView[TVIEW]);
    }
    viewToDetach[PARENT] = null;
    viewToDetach[NEXT] = null;
    viewToDetach[FLAGS] &= ~64;
  }
  return viewToDetach;
}
function destroyLView(tView, lView) {
  if (!(lView[FLAGS] & 128)) {
    const renderer = lView[RENDERER];
    if (renderer.destroyNode) {
      applyView(tView, lView, renderer, 3, null, null);
    }
    destroyViewTree(lView);
  }
}
function cleanUpView(tView, lView) {
  if (!(lView[FLAGS] & 128)) {
    lView[FLAGS] &= ~64;
    lView[FLAGS] |= 128;
    executeOnDestroys(tView, lView);
    processCleanups(tView, lView);
    if (lView[TVIEW].type === 1) {
      ngDevMode && ngDevMode.rendererDestroy++;
      lView[RENDERER].destroy();
    }
    const declarationContainer = lView[DECLARATION_LCONTAINER];
    if (declarationContainer !== null && isLContainer(lView[PARENT])) {
      if (declarationContainer !== lView[PARENT]) {
        detachMovedView(declarationContainer, lView);
      }
      const lQueries = lView[QUERIES];
      if (lQueries !== null) {
        lQueries.detachView(tView);
      }
    }
    unregisterLView(lView);
  }
}
function processCleanups(tView, lView) {
  const tCleanup = tView.cleanup;
  const lCleanup = lView[CLEANUP];
  let lastLCleanupIndex = -1;
  if (tCleanup !== null) {
    for (let i = 0; i < tCleanup.length - 1; i += 2) {
      if (typeof tCleanup[i] === "string") {
        const targetIdx = tCleanup[i + 3];
        ngDevMode && assertNumber(targetIdx, "cleanup target must be a number");
        if (targetIdx >= 0) {
          lCleanup[lastLCleanupIndex = targetIdx]();
        } else {
          lCleanup[lastLCleanupIndex = -targetIdx].unsubscribe();
        }
        i += 2;
      } else {
        const context2 = lCleanup[lastLCleanupIndex = tCleanup[i + 1]];
        tCleanup[i].call(context2);
      }
    }
  }
  if (lCleanup !== null) {
    for (let i = lastLCleanupIndex + 1; i < lCleanup.length; i++) {
      const instanceCleanupFn = lCleanup[i];
      ngDevMode && assertFunction(instanceCleanupFn, "Expecting instance cleanup function.");
      instanceCleanupFn();
    }
    lView[CLEANUP] = null;
  }
}
function executeOnDestroys(tView, lView) {
  let destroyHooks;
  if (tView != null && (destroyHooks = tView.destroyHooks) != null) {
    for (let i = 0; i < destroyHooks.length; i += 2) {
      const context2 = lView[destroyHooks[i]];
      if (!(context2 instanceof NodeInjectorFactory)) {
        const toCall = destroyHooks[i + 1];
        if (Array.isArray(toCall)) {
          for (let j = 0; j < toCall.length; j += 2) {
            const callContext = context2[toCall[j]];
            const hook = toCall[j + 1];
            profiler(4, callContext, hook);
            try {
              hook.call(callContext);
            } finally {
              profiler(5, callContext, hook);
            }
          }
        } else {
          profiler(4, context2, toCall);
          try {
            toCall.call(context2);
          } finally {
            profiler(5, context2, toCall);
          }
        }
      }
    }
  }
}
function getParentRElement(tView, tNode, lView) {
  return getClosestRElement(tView, tNode.parent, lView);
}
function getClosestRElement(tView, tNode, lView) {
  let parentTNode = tNode;
  while (parentTNode !== null && parentTNode.type & (8 | 32)) {
    tNode = parentTNode;
    parentTNode = tNode.parent;
  }
  if (parentTNode === null) {
    return lView[HOST];
  } else {
    ngDevMode && assertTNodeType(
      parentTNode,
      3 | 4
      /* TNodeType.Container */
    );
    const {
      componentOffset
    } = parentTNode;
    if (componentOffset > -1) {
      ngDevMode && assertTNodeForLView(parentTNode, lView);
      const {
        encapsulation
      } = tView.data[parentTNode.directiveStart + componentOffset];
      if (encapsulation === ViewEncapsulation$1.None || encapsulation === ViewEncapsulation$1.Emulated) {
        return null;
      }
    }
    return getNativeByTNode(parentTNode, lView);
  }
}
function nativeInsertBefore(renderer, parent, child, beforeNode, isMove) {
  ngDevMode && ngDevMode.rendererInsertBefore++;
  renderer.insertBefore(parent, child, beforeNode, isMove);
}
function nativeAppendChild(renderer, parent, child) {
  ngDevMode && ngDevMode.rendererAppendChild++;
  ngDevMode && assertDefined(parent, "parent node must be defined");
  renderer.appendChild(parent, child);
}
function nativeAppendOrInsertBefore(renderer, parent, child, beforeNode, isMove) {
  if (beforeNode !== null) {
    nativeInsertBefore(renderer, parent, child, beforeNode, isMove);
  } else {
    nativeAppendChild(renderer, parent, child);
  }
}
function nativeRemoveChild(renderer, parent, child, isHostElement) {
  renderer.removeChild(parent, child, isHostElement);
}
function nativeParentNode(renderer, node) {
  return renderer.parentNode(node);
}
function nativeNextSibling(renderer, node) {
  return renderer.nextSibling(node);
}
function getInsertInFrontOfRNode(parentTNode, currentTNode, lView) {
  return _getInsertInFrontOfRNodeWithI18n(parentTNode, currentTNode, lView);
}
function getInsertInFrontOfRNodeWithNoI18n(parentTNode, currentTNode, lView) {
  if (parentTNode.type & (8 | 32)) {
    return getNativeByTNode(parentTNode, lView);
  }
  return null;
}
var _getInsertInFrontOfRNodeWithI18n = getInsertInFrontOfRNodeWithNoI18n;
var _processI18nInsertBefore;
function appendChild(tView, lView, childRNode, childTNode) {
  const parentRNode = getParentRElement(tView, childTNode, lView);
  const renderer = lView[RENDERER];
  const parentTNode = childTNode.parent || lView[T_HOST];
  const anchorNode = getInsertInFrontOfRNode(parentTNode, childTNode, lView);
  if (parentRNode != null) {
    if (Array.isArray(childRNode)) {
      for (let i = 0; i < childRNode.length; i++) {
        nativeAppendOrInsertBefore(renderer, parentRNode, childRNode[i], anchorNode, false);
      }
    } else {
      nativeAppendOrInsertBefore(renderer, parentRNode, childRNode, anchorNode, false);
    }
  }
  _processI18nInsertBefore !== void 0 && _processI18nInsertBefore(renderer, childTNode, lView, childRNode, parentRNode);
}
function getFirstNativeNode(lView, tNode) {
  if (tNode !== null) {
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12 | 32 | 16
      /* TNodeType.Projection */
    );
    const tNodeType = tNode.type;
    if (tNodeType & 3) {
      return getNativeByTNode(tNode, lView);
    } else if (tNodeType & 4) {
      return getBeforeNodeForView(-1, lView[tNode.index]);
    } else if (tNodeType & 8) {
      const elIcuContainerChild = tNode.child;
      if (elIcuContainerChild !== null) {
        return getFirstNativeNode(lView, elIcuContainerChild);
      } else {
        const rNodeOrLContainer = lView[tNode.index];
        if (isLContainer(rNodeOrLContainer)) {
          return getBeforeNodeForView(-1, rNodeOrLContainer);
        } else {
          return unwrapRNode(rNodeOrLContainer);
        }
      }
    } else if (tNodeType & 32) {
      let nextRNode = icuContainerIterate(tNode, lView);
      let rNode = nextRNode();
      return rNode || unwrapRNode(lView[tNode.index]);
    } else {
      const projectionNodes = getProjectionNodes(lView, tNode);
      if (projectionNodes !== null) {
        if (Array.isArray(projectionNodes)) {
          return projectionNodes[0];
        }
        const parentView = getLViewParent(lView[DECLARATION_COMPONENT_VIEW]);
        ngDevMode && assertParentView(parentView);
        return getFirstNativeNode(parentView, projectionNodes);
      } else {
        return getFirstNativeNode(lView, tNode.next);
      }
    }
  }
  return null;
}
function getProjectionNodes(lView, tNode) {
  if (tNode !== null) {
    const componentView = lView[DECLARATION_COMPONENT_VIEW];
    const componentHost = componentView[T_HOST];
    const slotIdx = tNode.projection;
    ngDevMode && assertProjectionSlots(lView);
    return componentHost.projection[slotIdx];
  }
  return null;
}
function getBeforeNodeForView(viewIndexInContainer, lContainer) {
  const nextViewIndex = CONTAINER_HEADER_OFFSET + viewIndexInContainer + 1;
  if (nextViewIndex < lContainer.length) {
    const lView = lContainer[nextViewIndex];
    const firstTNodeOfView = lView[TVIEW].firstChild;
    if (firstTNodeOfView !== null) {
      return getFirstNativeNode(lView, firstTNodeOfView);
    }
  }
  return lContainer[NATIVE];
}
function nativeRemoveNode(renderer, rNode, isHostElement) {
  ngDevMode && ngDevMode.rendererRemoveNode++;
  const nativeParent = nativeParentNode(renderer, rNode);
  if (nativeParent) {
    nativeRemoveChild(renderer, nativeParent, rNode, isHostElement);
  }
}
function applyNodes(renderer, action, tNode, lView, parentRElement, beforeNode, isProjection) {
  while (tNode != null) {
    ngDevMode && assertTNodeForLView(tNode, lView);
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12 | 16 | 32
      /* TNodeType.Icu */
    );
    const rawSlotValue = lView[tNode.index];
    const tNodeType = tNode.type;
    if (isProjection) {
      if (action === 0) {
        rawSlotValue && attachPatchData(unwrapRNode(rawSlotValue), lView);
        tNode.flags |= 2;
      }
    }
    if ((tNode.flags & 32) !== 32) {
      if (tNodeType & 8) {
        applyNodes(renderer, action, tNode.child, lView, parentRElement, beforeNode, false);
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      } else if (tNodeType & 32) {
        const nextRNode = icuContainerIterate(tNode, lView);
        let rNode;
        while (rNode = nextRNode()) {
          applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
        }
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      } else if (tNodeType & 16) {
        applyProjectionRecursive(renderer, action, lView, tNode, parentRElement, beforeNode);
      } else {
        ngDevMode && assertTNodeType(
          tNode,
          3 | 4
          /* TNodeType.Container */
        );
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      }
    }
    tNode = isProjection ? tNode.projectionNext : tNode.next;
  }
}
function applyView(tView, lView, renderer, action, parentRElement, beforeNode) {
  applyNodes(renderer, action, tView.firstChild, lView, parentRElement, beforeNode, false);
}
function applyProjectionRecursive(renderer, action, lView, tProjectionNode, parentRElement, beforeNode) {
  const componentLView = lView[DECLARATION_COMPONENT_VIEW];
  const componentNode = componentLView[T_HOST];
  ngDevMode && assertEqual(typeof tProjectionNode.projection, "number", "expecting projection index");
  const nodeToProjectOrRNodes = componentNode.projection[tProjectionNode.projection];
  if (Array.isArray(nodeToProjectOrRNodes)) {
    for (let i = 0; i < nodeToProjectOrRNodes.length; i++) {
      const rNode = nodeToProjectOrRNodes[i];
      applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
    }
  } else {
    let nodeToProject = nodeToProjectOrRNodes;
    const projectedComponentLView = componentLView[PARENT];
    applyNodes(renderer, action, nodeToProject, projectedComponentLView, parentRElement, beforeNode, true);
  }
}
function applyContainer(renderer, action, lContainer, parentRElement, beforeNode) {
  ngDevMode && assertLContainer(lContainer);
  const anchor = lContainer[NATIVE];
  const native = unwrapRNode(lContainer);
  if (anchor !== native) {
    applyToElementOrContainer(action, renderer, parentRElement, anchor, beforeNode);
  }
  for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    const lView = lContainer[i];
    applyView(lView[TVIEW], lView, renderer, action, parentRElement, anchor);
  }
}
function writeDirectStyle(renderer, element, newValue) {
  ngDevMode && assertString(newValue, "'newValue' should be a string");
  renderer.setAttribute(element, "style", newValue);
  ngDevMode && ngDevMode.rendererSetStyle++;
}
function writeDirectClass(renderer, element, newValue) {
  ngDevMode && assertString(newValue, "'newValue' should be a string");
  if (newValue === "") {
    renderer.removeAttribute(element, "class");
  } else {
    renderer.setAttribute(element, "class", newValue);
  }
  ngDevMode && ngDevMode.rendererSetClassName++;
}
function setupStaticAttributes(renderer, element, tNode) {
  const {
    mergedAttrs,
    classes,
    styles
  } = tNode;
  if (mergedAttrs !== null) {
    setUpAttributes(renderer, element, mergedAttrs);
  }
  if (classes !== null) {
    writeDirectClass(renderer, element, classes);
  }
  if (styles !== null) {
    writeDirectStyle(renderer, element, styles);
  }
}
var DOCUMENT = void 0;
function setDocument(document2) {
  DOCUMENT = document2;
}
var policy;
function getPolicy() {
  if (policy === void 0) {
    policy = null;
    if (_global.trustedTypes) {
      try {
        policy = _global.trustedTypes.createPolicy("angular#unsafe-bypass", {
          createHTML: (s) => s,
          createScript: (s) => s,
          createScriptURL: (s) => s
        });
      } catch {
      }
    }
  }
  return policy;
}
function trustedScriptURLFromStringBypass(url) {
  return getPolicy()?.createScriptURL(url) || url;
}
var SafeValueImpl = class {
  constructor(changingThisBreaksApplicationSecurity) {
    this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${XSS_SECURITY_URL})`;
  }
};
function unwrapSafeValue(value) {
  return value instanceof SafeValueImpl ? value.changingThisBreaksApplicationSecurity : value;
}
function allowSanitizationBypassAndThrow(value, type) {
  const actualType = getSanitizationBypassType(value);
  if (actualType != null && actualType !== type) {
    if (actualType === "ResourceURL" && type === "URL")
      return true;
    throw new Error(`Required a safe ${type}, got a ${actualType} (see ${XSS_SECURITY_URL})`);
  }
  return actualType === type;
}
function getSanitizationBypassType(value) {
  return value instanceof SafeValueImpl && value.getTypeName() || null;
}
var SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function _sanitizeUrl(url) {
  url = String(url);
  if (url.match(SAFE_URL_PATTERN))
    return url;
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    console.warn(`WARNING: sanitizing unsafe URL value ${url} (see ${XSS_SECURITY_URL})`);
  }
  return "unsafe:" + url;
}
var SecurityContext = /* @__PURE__ */ (() => {
  SecurityContext = SecurityContext || {};
  SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
  SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
  SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
  SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
  SecurityContext[SecurityContext["URL"] = 4] = "URL";
  SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
  return SecurityContext;
})();
function \u0275\u0275sanitizeUrl(unsafeUrl) {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.URL, unsafeUrl) || "";
  }
  if (allowSanitizationBypassAndThrow(
    unsafeUrl,
    "URL"
    /* BypassType.Url */
  )) {
    return unwrapSafeValue(unsafeUrl);
  }
  return _sanitizeUrl(renderStringify(unsafeUrl));
}
function \u0275\u0275sanitizeResourceUrl(unsafeResourceUrl) {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return trustedScriptURLFromStringBypass(sanitizer.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || "");
  }
  if (allowSanitizationBypassAndThrow(
    unsafeResourceUrl,
    "ResourceURL"
    /* BypassType.ResourceUrl */
  )) {
    return trustedScriptURLFromStringBypass(unwrapSafeValue(unsafeResourceUrl));
  }
  throw new RuntimeError(904, ngDevMode && `unsafe value used in a resource URL context (see ${XSS_SECURITY_URL})`);
}
function getUrlSanitizer(tag, prop) {
  if (prop === "src" && (tag === "embed" || tag === "frame" || tag === "iframe" || tag === "media" || tag === "script") || prop === "href" && (tag === "base" || tag === "link")) {
    return \u0275\u0275sanitizeResourceUrl;
  }
  return \u0275\u0275sanitizeUrl;
}
function \u0275\u0275sanitizeUrlOrResourceUrl(unsafeUrl, tag, prop) {
  return getUrlSanitizer(tag, prop)(unsafeUrl);
}
function validateAgainstEventAttributes(name) {
  if (name.toLowerCase().startsWith("on")) {
    const errorMessage = `Binding to event attribute '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...`;
    throw new RuntimeError(306, errorMessage);
  }
}
function getSanitizer() {
  const lView = getLView();
  return lView && lView[SANITIZER];
}
var ENVIRONMENT_INITIALIZER = /* @__PURE__ */ new InjectionToken("ENVIRONMENT_INITIALIZER");
var INJECTOR = /* @__PURE__ */ new InjectionToken(
  "INJECTOR",
  // Disable tslint because this is const enum which gets inlined not top level prop access.
  // tslint:disable-next-line: no-toplevel-property-access
  -1
  /* InjectorMarkers.Injector */
);
var INJECTOR_DEF_TYPES = /* @__PURE__ */ new InjectionToken("INJECTOR_DEF_TYPES");
var NullInjector = class {
  get(token, notFoundValue = THROW_IF_NOT_FOUND) {
    if (notFoundValue === THROW_IF_NOT_FOUND) {
      const error = new Error(`NullInjectorError: No provider for ${stringify(token)}!`);
      error.name = "NullInjectorError";
      throw error;
    }
    return notFoundValue;
  }
};
function importProvidersFrom(...sources) {
  return {
    \u0275providers: internalImportProvidersFrom(true, sources),
    \u0275fromNgModule: true
  };
}
function internalImportProvidersFrom(checkForStandaloneCmp, ...sources) {
  const providersOut = [];
  const dedup = /* @__PURE__ */ new Set();
  let injectorTypesWithProviders;
  deepForEach(sources, (source) => {
    if ((typeof ngDevMode === "undefined" || ngDevMode) && checkForStandaloneCmp) {
      const cmpDef = getComponentDef(source);
      if (cmpDef?.standalone) {
        throw new RuntimeError(800, `Importing providers supports NgModule or ModuleWithProviders but got a standalone component "${stringifyForError(source)}"`);
      }
    }
    const internalSource = source;
    if (walkProviderTree(internalSource, providersOut, [], dedup)) {
      injectorTypesWithProviders || (injectorTypesWithProviders = []);
      injectorTypesWithProviders.push(internalSource);
    }
  });
  if (injectorTypesWithProviders !== void 0) {
    processInjectorTypesWithProviders(injectorTypesWithProviders, providersOut);
  }
  return providersOut;
}
function processInjectorTypesWithProviders(typesWithProviders, providersOut) {
  for (let i = 0; i < typesWithProviders.length; i++) {
    const {
      ngModule,
      providers
    } = typesWithProviders[i];
    deepForEachProvider(providers, (provider) => {
      ngDevMode && validateProvider(provider, providers || EMPTY_ARRAY, ngModule);
      providersOut.push(provider);
    });
  }
}
function walkProviderTree(container, providersOut, parents, dedup) {
  container = resolveForwardRef(container);
  if (!container)
    return false;
  let defType = null;
  let injDef = getInjectorDef(container);
  const cmpDef = !injDef && getComponentDef(container);
  if (!injDef && !cmpDef) {
    const ngModule = container.ngModule;
    injDef = getInjectorDef(ngModule);
    if (injDef) {
      defType = ngModule;
    } else {
      return false;
    }
  } else if (cmpDef && !cmpDef.standalone) {
    return false;
  } else {
    defType = container;
  }
  if (ngDevMode && parents.indexOf(defType) !== -1) {
    const defName = stringify(defType);
    const path = parents.map(stringify);
    throwCyclicDependencyError(defName, path);
  }
  const isDuplicate = dedup.has(defType);
  if (cmpDef) {
    if (isDuplicate) {
      return false;
    }
    dedup.add(defType);
    if (cmpDef.dependencies) {
      const deps = typeof cmpDef.dependencies === "function" ? cmpDef.dependencies() : cmpDef.dependencies;
      for (const dep of deps) {
        walkProviderTree(dep, providersOut, parents, dedup);
      }
    }
  } else if (injDef) {
    if (injDef.imports != null && !isDuplicate) {
      ngDevMode && parents.push(defType);
      dedup.add(defType);
      let importTypesWithProviders;
      try {
        deepForEach(injDef.imports, (imported) => {
          if (walkProviderTree(imported, providersOut, parents, dedup)) {
            importTypesWithProviders || (importTypesWithProviders = []);
            importTypesWithProviders.push(imported);
          }
        });
      } finally {
        ngDevMode && parents.pop();
      }
      if (importTypesWithProviders !== void 0) {
        processInjectorTypesWithProviders(importTypesWithProviders, providersOut);
      }
    }
    if (!isDuplicate) {
      const factory = getFactoryDef(defType) || (() => new defType());
      providersOut.push(
        // Provider to create `defType` using its factory.
        {
          provide: defType,
          useFactory: factory,
          deps: EMPTY_ARRAY
        },
        // Make this `defType` available to an internal logic that calculates injector scope.
        {
          provide: INJECTOR_DEF_TYPES,
          useValue: defType,
          multi: true
        },
        // Provider to eagerly instantiate `defType` via `ENVIRONMENT_INITIALIZER`.
        {
          provide: ENVIRONMENT_INITIALIZER,
          useValue: () => \u0275\u0275inject(defType),
          multi: true
        }
        //
      );
    }
    const defProviders = injDef.providers;
    if (defProviders != null && !isDuplicate) {
      const injectorType = container;
      deepForEachProvider(defProviders, (provider) => {
        ngDevMode && validateProvider(provider, defProviders, injectorType);
        providersOut.push(provider);
      });
    }
  } else {
    return false;
  }
  return defType !== container && container.providers !== void 0;
}
function validateProvider(provider, providers, containerType) {
  if (isTypeProvider(provider) || isValueProvider(provider) || isFactoryProvider(provider) || isExistingProvider(provider)) {
    return;
  }
  const classRef = resolveForwardRef(provider && (provider.useClass || provider.provide));
  if (!classRef) {
    throwInvalidProviderError(containerType, providers, provider);
  }
}
function deepForEachProvider(providers, fn) {
  for (let provider of providers) {
    if (isEnvironmentProviders(provider)) {
      provider = provider.\u0275providers;
    }
    if (Array.isArray(provider)) {
      deepForEachProvider(provider, fn);
    } else {
      fn(provider);
    }
  }
}
var USE_VALUE$1 = /* @__PURE__ */ getClosureSafeProperty({
  provide: String,
  useValue: getClosureSafeProperty
});
function isValueProvider(value) {
  return value !== null && typeof value == "object" && USE_VALUE$1 in value;
}
function isExistingProvider(value) {
  return !!(value && value.useExisting);
}
function isFactoryProvider(value) {
  return !!(value && value.useFactory);
}
function isTypeProvider(value) {
  return typeof value === "function";
}
var INJECTOR_SCOPE = /* @__PURE__ */ new InjectionToken("Set Injector scope.");
var NOT_YET = {};
var CIRCULAR = {};
var NULL_INJECTOR$1 = void 0;
function getNullInjector() {
  if (NULL_INJECTOR$1 === void 0) {
    NULL_INJECTOR$1 = new NullInjector();
  }
  return NULL_INJECTOR$1;
}
var EnvironmentInjector = class {
};
var R3Injector = class extends EnvironmentInjector {
  /**
   * Flag indicating that this injector was previously destroyed.
   */
  get destroyed() {
    return this._destroyed;
  }
  constructor(providers, parent, source, scopes) {
    super();
    this.parent = parent;
    this.source = source;
    this.scopes = scopes;
    this.records = /* @__PURE__ */ new Map();
    this._ngOnDestroyHooks = /* @__PURE__ */ new Set();
    this._onDestroyHooks = [];
    this._destroyed = false;
    forEachSingleProvider(providers, (provider) => this.processProvider(provider));
    this.records.set(INJECTOR, makeRecord(void 0, this));
    if (scopes.has("environment")) {
      this.records.set(EnvironmentInjector, makeRecord(void 0, this));
    }
    const record = this.records.get(INJECTOR_SCOPE);
    if (record != null && typeof record.value === "string") {
      this.scopes.add(record.value);
    }
    this.injectorDefTypes = new Set(this.get(INJECTOR_DEF_TYPES.multi, EMPTY_ARRAY, InjectFlags.Self));
  }
  /**
   * Destroy the injector and release references to every instance or provider associated with it.
   *
   * Also calls the `OnDestroy` lifecycle hooks of every instance that was created for which a
   * hook was found.
   */
  destroy() {
    this.assertNotDestroyed();
    this._destroyed = true;
    try {
      for (const service of this._ngOnDestroyHooks) {
        service.ngOnDestroy();
      }
      for (const hook of this._onDestroyHooks) {
        hook();
      }
    } finally {
      this.records.clear();
      this._ngOnDestroyHooks.clear();
      this.injectorDefTypes.clear();
      this._onDestroyHooks.length = 0;
    }
  }
  onDestroy(callback) {
    this._onDestroyHooks.push(callback);
  }
  runInContext(fn) {
    this.assertNotDestroyed();
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(void 0);
    try {
      return fn();
    } finally {
      setCurrentInjector(previousInjector);
      setInjectImplementation(previousInjectImplementation);
    }
  }
  get(token, notFoundValue = THROW_IF_NOT_FOUND, flags = InjectFlags.Default) {
    this.assertNotDestroyed();
    flags = convertToBitFlags(flags);
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(void 0);
    try {
      if (!(flags & InjectFlags.SkipSelf)) {
        let record = this.records.get(token);
        if (record === void 0) {
          const def = couldBeInjectableType(token) && getInjectableDef(token);
          if (def && this.injectableDefInScope(def)) {
            record = makeRecord(injectableDefOrInjectorDefFactory(token), NOT_YET);
          } else {
            record = null;
          }
          this.records.set(token, record);
        }
        if (record != null) {
          return this.hydrate(token, record);
        }
      }
      const nextInjector = !(flags & InjectFlags.Self) ? this.parent : getNullInjector();
      notFoundValue = flags & InjectFlags.Optional && notFoundValue === THROW_IF_NOT_FOUND ? null : notFoundValue;
      return nextInjector.get(token, notFoundValue);
    } catch (e) {
      if (e.name === "NullInjectorError") {
        const path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
        path.unshift(stringify(token));
        if (previousInjector) {
          throw e;
        } else {
          return catchInjectorError(e, token, "R3InjectorError", this.source);
        }
      } else {
        throw e;
      }
    } finally {
      setInjectImplementation(previousInjectImplementation);
      setCurrentInjector(previousInjector);
    }
  }
  /** @internal */
  resolveInjectorInitializers() {
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(void 0);
    try {
      const initializers = this.get(ENVIRONMENT_INITIALIZER.multi, EMPTY_ARRAY, InjectFlags.Self);
      if (ngDevMode && !Array.isArray(initializers)) {
        throw new RuntimeError(-209, `Unexpected type of the \`ENVIRONMENT_INITIALIZER\` token value (expected an array, but got ${typeof initializers}). Please check that the \`ENVIRONMENT_INITIALIZER\` token is configured as a \`multi: true\` provider.`);
      }
      for (const initializer of initializers) {
        initializer();
      }
    } finally {
      setCurrentInjector(previousInjector);
      setInjectImplementation(previousInjectImplementation);
    }
  }
  toString() {
    const tokens = [];
    const records = this.records;
    for (const token of records.keys()) {
      tokens.push(stringify(token));
    }
    return `R3Injector[${tokens.join(", ")}]`;
  }
  assertNotDestroyed() {
    if (this._destroyed) {
      throw new RuntimeError(205, ngDevMode && "Injector has already been destroyed.");
    }
  }
  /**
   * Process a `SingleProvider` and add it.
   */
  processProvider(provider) {
    provider = resolveForwardRef(provider);
    let token = isTypeProvider(provider) ? provider : resolveForwardRef(provider && provider.provide);
    const record = providerToRecord(provider);
    if (!isTypeProvider(provider) && provider.multi === true) {
      let multiRecord = this.records.get(token);
      if (multiRecord) {
        if (ngDevMode && multiRecord.multi === void 0) {
          throwMixedMultiProviderError();
        }
      } else {
        multiRecord = makeRecord(void 0, NOT_YET, true);
        multiRecord.factory = () => injectArgs(multiRecord.multi);
        this.records.set(token, multiRecord);
      }
      token = provider;
      multiRecord.multi.push(provider);
    } else {
      const existing = this.records.get(token);
      if (ngDevMode && existing && existing.multi !== void 0) {
        throwMixedMultiProviderError();
      }
    }
    this.records.set(token, record);
  }
  hydrate(token, record) {
    if (ngDevMode && record.value === CIRCULAR) {
      throwCyclicDependencyError(stringify(token));
    } else if (record.value === NOT_YET) {
      record.value = CIRCULAR;
      record.value = record.factory();
    }
    if (typeof record.value === "object" && record.value && hasOnDestroy(record.value)) {
      this._ngOnDestroyHooks.add(record.value);
    }
    return record.value;
  }
  injectableDefInScope(def) {
    if (!def.providedIn) {
      return false;
    }
    const providedIn = resolveForwardRef(def.providedIn);
    if (typeof providedIn === "string") {
      return providedIn === "any" || this.scopes.has(providedIn);
    } else {
      return this.injectorDefTypes.has(providedIn);
    }
  }
};
function injectableDefOrInjectorDefFactory(token) {
  const injectableDef = getInjectableDef(token);
  const factory = injectableDef !== null ? injectableDef.factory : getFactoryDef(token);
  if (factory !== null) {
    return factory;
  }
  if (token instanceof InjectionToken) {
    throw new RuntimeError(204, ngDevMode && `Token ${stringify(token)} is missing a \u0275prov definition.`);
  }
  if (token instanceof Function) {
    return getUndecoratedInjectableFactory(token);
  }
  throw new RuntimeError(204, ngDevMode && "unreachable");
}
function getUndecoratedInjectableFactory(token) {
  const paramLength = token.length;
  if (paramLength > 0) {
    const args = newArray(paramLength, "?");
    throw new RuntimeError(204, ngDevMode && `Can't resolve all parameters for ${stringify(token)}: (${args.join(", ")}).`);
  }
  const inheritedInjectableDef = getInheritedInjectableDef(token);
  if (inheritedInjectableDef !== null) {
    return () => inheritedInjectableDef.factory(token);
  } else {
    return () => new token();
  }
}
function providerToRecord(provider) {
  if (isValueProvider(provider)) {
    return makeRecord(void 0, provider.useValue);
  } else {
    const factory = providerToFactory(provider);
    return makeRecord(factory, NOT_YET);
  }
}
function providerToFactory(provider, ngModuleType, providers) {
  let factory = void 0;
  if (ngDevMode && isEnvironmentProviders(provider)) {
    throwInvalidProviderError(void 0, providers, provider);
  }
  if (isTypeProvider(provider)) {
    const unwrappedProvider = resolveForwardRef(provider);
    return getFactoryDef(unwrappedProvider) || injectableDefOrInjectorDefFactory(unwrappedProvider);
  } else {
    if (isValueProvider(provider)) {
      factory = () => resolveForwardRef(provider.useValue);
    } else if (isFactoryProvider(provider)) {
      factory = () => provider.useFactory(...injectArgs(provider.deps || []));
    } else if (isExistingProvider(provider)) {
      factory = () => \u0275\u0275inject(resolveForwardRef(provider.useExisting));
    } else {
      const classRef = resolveForwardRef(provider && (provider.useClass || provider.provide));
      if (ngDevMode && !classRef) {
        throwInvalidProviderError(ngModuleType, providers, provider);
      }
      if (hasDeps(provider)) {
        factory = () => new classRef(...injectArgs(provider.deps));
      } else {
        return getFactoryDef(classRef) || injectableDefOrInjectorDefFactory(classRef);
      }
    }
  }
  return factory;
}
function makeRecord(factory, value, multi = false) {
  return {
    factory,
    value,
    multi: multi ? [] : void 0
  };
}
function hasDeps(value) {
  return !!value.deps;
}
function hasOnDestroy(value) {
  return value !== null && typeof value === "object" && typeof value.ngOnDestroy === "function";
}
function couldBeInjectableType(value) {
  return typeof value === "function" || typeof value === "object" && value instanceof InjectionToken;
}
function forEachSingleProvider(providers, fn) {
  for (const provider of providers) {
    if (Array.isArray(provider)) {
      forEachSingleProvider(provider, fn);
    } else if (provider && isEnvironmentProviders(provider)) {
      forEachSingleProvider(provider.\u0275providers, fn);
    } else {
      fn(provider);
    }
  }
}
var ComponentRef$1 = class {
};
var ComponentFactory$1 = class {
};
function noComponentFactoryError(component) {
  const error = Error(`No component factory found for ${stringify(component)}. Did you add it to @NgModule.entryComponents?`);
  error[ERROR_COMPONENT] = component;
  return error;
}
var ERROR_COMPONENT = "ngComponent";
var _NullComponentFactoryResolver = class {
  resolveComponentFactory(component) {
    throw noComponentFactoryError(component);
  }
};
var ComponentFactoryResolver$1 = /* @__PURE__ */ (() => {
  class ComponentFactoryResolver$12 {
  }
  ComponentFactoryResolver$12.NULL = /* @__PURE__ */ new _NullComponentFactoryResolver();
  return ComponentFactoryResolver$12;
})();
function injectElementRef() {
  return createElementRef(getCurrentTNode(), getLView());
}
function createElementRef(tNode, lView) {
  return new ElementRef(getNativeByTNode(tNode, lView));
}
var ElementRef = /* @__PURE__ */ (() => {
  class ElementRef2 {
    constructor(nativeElement) {
      this.nativeElement = nativeElement;
    }
  }
  ElementRef2.__NG_ELEMENT_ID__ = injectElementRef;
  return ElementRef2;
})();
var RendererFactory2 = class {
};
var Renderer2 = /* @__PURE__ */ (() => {
  class Renderer22 {
  }
  Renderer22.__NG_ELEMENT_ID__ = () => injectRenderer2();
  return Renderer22;
})();
function injectRenderer2() {
  const lView = getLView();
  const tNode = getCurrentTNode();
  const nodeAtIndex = getComponentLViewByIndex(tNode.index, lView);
  return (isLView(nodeAtIndex) ? nodeAtIndex : lView)[RENDERER];
}
var Sanitizer = /* @__PURE__ */ (() => {
  class Sanitizer2 {
  }
  Sanitizer2.\u0275prov = \u0275\u0275defineInjectable({
    token: Sanitizer2,
    providedIn: "root",
    factory: () => null
  });
  return Sanitizer2;
})();
var Version = class {
  constructor(full) {
    this.full = full;
    this.major = full.split(".")[0];
    this.minor = full.split(".")[1];
    this.patch = full.split(".").slice(2).join(".");
  }
};
var VERSION = /* @__PURE__ */ new Version("15.2.6");
var NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
var ERROR_ORIGINAL_ERROR = "ngOriginalError";
function getOriginalError(error) {
  return error[ERROR_ORIGINAL_ERROR];
}
var ErrorHandler = class {
  constructor() {
    this._console = console;
  }
  handleError(error) {
    const originalError = this._findOriginalError(error);
    this._console.error("ERROR", error);
    if (originalError) {
      this._console.error("ORIGINAL ERROR", originalError);
    }
  }
  /** @internal */
  _findOriginalError(error) {
    let e = error && getOriginalError(error);
    while (e && getOriginalError(e)) {
      e = getOriginalError(e);
    }
    return e || null;
  }
};
function normalizeDebugBindingName(name) {
  name = camelCaseToDashCase(name.replace(/[$@]/g, "_"));
  return `ng-reflect-${name}`;
}
var CAMEL_CASE_REGEXP = /([A-Z])/g;
function camelCaseToDashCase(input) {
  return input.replace(CAMEL_CASE_REGEXP, (...m) => "-" + m[1].toLowerCase());
}
function normalizeDebugBindingValue(value) {
  try {
    return value != null ? value.toString().slice(0, 30) : value;
  } catch (e) {
    return "[ERROR] Exception while trying to serialize the value";
  }
}
var INTERPOLATION_DELIMITER = `\uFFFD`;
function maybeUnwrapFn(value) {
  if (value instanceof Function) {
    return value();
  } else {
    return value;
  }
}
function throwMultipleComponentError(tNode, first2, second) {
  throw new RuntimeError(-300, `Multiple components match node with tagname ${tNode.value}: ${stringifyForError(first2)} and ${stringifyForError(second)}`);
}
function throwErrorIfNoChangesMode(creationMode, oldValue, currValue, propName) {
  const field = propName ? ` for '${propName}'` : "";
  let msg = `ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value${field}: '${oldValue}'. Current value: '${currValue}'.`;
  if (creationMode) {
    msg += ` It seems like the view has been created after its parent and its children have been dirty checked. Has it been created in a change detection hook?`;
  }
  throw new RuntimeError(-100, msg);
}
function constructDetailsForInterpolation(lView, rootIndex, expressionIndex, meta, changedValue) {
  const [propName, prefix, ...chunks] = meta.split(INTERPOLATION_DELIMITER);
  let oldValue = prefix, newValue = prefix;
  for (let i = 0; i < chunks.length; i++) {
    const slotIdx = rootIndex + i;
    oldValue += `${lView[slotIdx]}${chunks[i]}`;
    newValue += `${slotIdx === expressionIndex ? changedValue : lView[slotIdx]}${chunks[i]}`;
  }
  return {
    propName,
    oldValue,
    newValue
  };
}
function getExpressionChangedErrorDetails(lView, bindingIndex, oldValue, newValue) {
  const tData = lView[TVIEW].data;
  const metadata = tData[bindingIndex];
  if (typeof metadata === "string") {
    if (metadata.indexOf(INTERPOLATION_DELIMITER) > -1) {
      return constructDetailsForInterpolation(lView, bindingIndex, bindingIndex, metadata, newValue);
    }
    return {
      propName: metadata,
      oldValue,
      newValue
    };
  }
  if (metadata === null) {
    let idx = bindingIndex - 1;
    while (typeof tData[idx] !== "string" && tData[idx + 1] === null) {
      idx--;
    }
    const meta = tData[idx];
    if (typeof meta === "string") {
      const matches = meta.match(new RegExp(INTERPOLATION_DELIMITER, "g"));
      if (matches && matches.length - 1 > bindingIndex - idx) {
        return constructDetailsForInterpolation(lView, idx, bindingIndex, meta, newValue);
      }
    }
  }
  return {
    propName: void 0,
    oldValue,
    newValue
  };
}
function classIndexOf(className, classToSearch, startingIndex) {
  ngDevMode && assertNotEqual(classToSearch, "", 'can not look for "" string.');
  let end = className.length;
  while (true) {
    const foundIndex = className.indexOf(classToSearch, startingIndex);
    if (foundIndex === -1)
      return foundIndex;
    if (foundIndex === 0 || className.charCodeAt(foundIndex - 1) <= 32) {
      const length = classToSearch.length;
      if (foundIndex + length === end || className.charCodeAt(foundIndex + length) <= 32) {
        return foundIndex;
      }
    }
    startingIndex = foundIndex + 1;
  }
}
var NG_TEMPLATE_SELECTOR = "ng-template";
function isCssClassMatching(attrs, cssClassToMatch, isProjectionMode) {
  ngDevMode && assertEqual(cssClassToMatch, cssClassToMatch.toLowerCase(), "Class name expected to be lowercase.");
  let i = 0;
  let isImplicitAttrsSection = true;
  while (i < attrs.length) {
    let item = attrs[i++];
    if (typeof item === "string" && isImplicitAttrsSection) {
      const value = attrs[i++];
      if (isProjectionMode && item === "class") {
        if (classIndexOf(value.toLowerCase(), cssClassToMatch, 0) !== -1) {
          return true;
        }
      }
    } else if (item === 1) {
      while (i < attrs.length && typeof (item = attrs[i++]) == "string") {
        if (item.toLowerCase() === cssClassToMatch)
          return true;
      }
      return false;
    } else if (typeof item === "number") {
      isImplicitAttrsSection = false;
    }
  }
  return false;
}
function isInlineTemplate(tNode) {
  return tNode.type === 4 && tNode.value !== NG_TEMPLATE_SELECTOR;
}
function hasTagAndTypeMatch(tNode, currentSelector, isProjectionMode) {
  const tagNameToCompare = tNode.type === 4 && !isProjectionMode ? NG_TEMPLATE_SELECTOR : tNode.value;
  return currentSelector === tagNameToCompare;
}
function isNodeMatchingSelector(tNode, selector, isProjectionMode) {
  ngDevMode && assertDefined(selector[0], "Selector should have a tag name");
  let mode = 4;
  const nodeAttrs = tNode.attrs || [];
  const nameOnlyMarkerIdx = getNameOnlyMarkerIndex(nodeAttrs);
  let skipToNextSelector = false;
  for (let i = 0; i < selector.length; i++) {
    const current = selector[i];
    if (typeof current === "number") {
      if (!skipToNextSelector && !isPositive(mode) && !isPositive(current)) {
        return false;
      }
      if (skipToNextSelector && isPositive(current))
        continue;
      skipToNextSelector = false;
      mode = current | mode & 1;
      continue;
    }
    if (skipToNextSelector)
      continue;
    if (mode & 4) {
      mode = 2 | mode & 1;
      if (current !== "" && !hasTagAndTypeMatch(tNode, current, isProjectionMode) || current === "" && selector.length === 1) {
        if (isPositive(mode))
          return false;
        skipToNextSelector = true;
      }
    } else {
      const selectorAttrValue = mode & 8 ? current : selector[++i];
      if (mode & 8 && tNode.attrs !== null) {
        if (!isCssClassMatching(tNode.attrs, selectorAttrValue, isProjectionMode)) {
          if (isPositive(mode))
            return false;
          skipToNextSelector = true;
        }
        continue;
      }
      const attrName = mode & 8 ? "class" : current;
      const attrIndexInNode = findAttrIndexInNode(attrName, nodeAttrs, isInlineTemplate(tNode), isProjectionMode);
      if (attrIndexInNode === -1) {
        if (isPositive(mode))
          return false;
        skipToNextSelector = true;
        continue;
      }
      if (selectorAttrValue !== "") {
        let nodeAttrValue;
        if (attrIndexInNode > nameOnlyMarkerIdx) {
          nodeAttrValue = "";
        } else {
          ngDevMode && assertNotEqual(nodeAttrs[attrIndexInNode], 0, "We do not match directives on namespaced attributes");
          nodeAttrValue = nodeAttrs[attrIndexInNode + 1].toLowerCase();
        }
        const compareAgainstClassName = mode & 8 ? nodeAttrValue : null;
        if (compareAgainstClassName && classIndexOf(compareAgainstClassName, selectorAttrValue, 0) !== -1 || mode & 2 && selectorAttrValue !== nodeAttrValue) {
          if (isPositive(mode))
            return false;
          skipToNextSelector = true;
        }
      }
    }
  }
  return isPositive(mode) || skipToNextSelector;
}
function isPositive(mode) {
  return (mode & 1) === 0;
}
function findAttrIndexInNode(name, attrs, isInlineTemplate2, isProjectionMode) {
  if (attrs === null)
    return -1;
  let i = 0;
  if (isProjectionMode || !isInlineTemplate2) {
    let bindingsMode = false;
    while (i < attrs.length) {
      const maybeAttrName = attrs[i];
      if (maybeAttrName === name) {
        return i;
      } else if (maybeAttrName === 3 || maybeAttrName === 6) {
        bindingsMode = true;
      } else if (maybeAttrName === 1 || maybeAttrName === 2) {
        let value = attrs[++i];
        while (typeof value === "string") {
          value = attrs[++i];
        }
        continue;
      } else if (maybeAttrName === 4) {
        break;
      } else if (maybeAttrName === 0) {
        i += 4;
        continue;
      }
      i += bindingsMode ? 1 : 2;
    }
    return -1;
  } else {
    return matchTemplateAttribute(attrs, name);
  }
}
function isNodeMatchingSelectorList(tNode, selector, isProjectionMode = false) {
  for (let i = 0; i < selector.length; i++) {
    if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) {
      return true;
    }
  }
  return false;
}
function getNameOnlyMarkerIndex(nodeAttrs) {
  for (let i = 0; i < nodeAttrs.length; i++) {
    const nodeAttr = nodeAttrs[i];
    if (isNameOnlyAttributeMarker(nodeAttr)) {
      return i;
    }
  }
  return nodeAttrs.length;
}
function matchTemplateAttribute(attrs, name) {
  let i = attrs.indexOf(
    4
    /* AttributeMarker.Template */
  );
  if (i > -1) {
    i++;
    while (i < attrs.length) {
      const attr = attrs[i];
      if (typeof attr === "number")
        return -1;
      if (attr === name)
        return i;
      i++;
    }
  }
  return -1;
}
function maybeWrapInNotSelector(isNegativeMode, chunk) {
  return isNegativeMode ? ":not(" + chunk.trim() + ")" : chunk;
}
function stringifyCSSSelector(selector) {
  let result = selector[0];
  let i = 1;
  let mode = 2;
  let currentChunk = "";
  let isNegativeMode = false;
  while (i < selector.length) {
    let valueOrMarker = selector[i];
    if (typeof valueOrMarker === "string") {
      if (mode & 2) {
        const attrValue = selector[++i];
        currentChunk += "[" + valueOrMarker + (attrValue.length > 0 ? '="' + attrValue + '"' : "") + "]";
      } else if (mode & 8) {
        currentChunk += "." + valueOrMarker;
      } else if (mode & 4) {
        currentChunk += " " + valueOrMarker;
      }
    } else {
      if (currentChunk !== "" && !isPositive(valueOrMarker)) {
        result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
        currentChunk = "";
      }
      mode = valueOrMarker;
      isNegativeMode = isNegativeMode || !isPositive(mode);
    }
    i++;
  }
  if (currentChunk !== "") {
    result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
  }
  return result;
}
function stringifyCSSSelectorList(selectorList) {
  return selectorList.map(stringifyCSSSelector).join(",");
}
function extractAttrsAndClassesFromSelector(selector) {
  const attrs = [];
  const classes = [];
  let i = 1;
  let mode = 2;
  while (i < selector.length) {
    let valueOrMarker = selector[i];
    if (typeof valueOrMarker === "string") {
      if (mode === 2) {
        if (valueOrMarker !== "") {
          attrs.push(valueOrMarker, selector[++i]);
        }
      } else if (mode === 8) {
        classes.push(valueOrMarker);
      }
    } else {
      if (!isPositive(mode))
        break;
      mode = valueOrMarker;
    }
    i++;
  }
  return {
    attrs,
    classes
  };
}
var NO_CHANGE = typeof ngDevMode === "undefined" || ngDevMode ? {
  __brand__: "NO_CHANGE"
} : {};
function selectIndexInternal(tView, lView, index, checkNoChangesMode) {
  ngDevMode && assertIndexInDeclRange(lView, index);
  if (!checkNoChangesMode) {
    const hooksInitPhaseCompleted = (lView[FLAGS] & 3) === 3;
    if (hooksInitPhaseCompleted) {
      const preOrderCheckHooks = tView.preOrderCheckHooks;
      if (preOrderCheckHooks !== null) {
        executeCheckHooks(lView, preOrderCheckHooks, index);
      }
    } else {
      const preOrderHooks = tView.preOrderHooks;
      if (preOrderHooks !== null) {
        executeInitAndCheckHooks(lView, preOrderHooks, 0, index);
      }
    }
  }
  setSelectedIndex(index);
}
function createInjector(defType, parent = null, additionalProviders = null, name) {
  const injector = createInjectorWithoutInjectorInstances(defType, parent, additionalProviders, name);
  injector.resolveInjectorInitializers();
  return injector;
}
function createInjectorWithoutInjectorInstances(defType, parent = null, additionalProviders = null, name, scopes = /* @__PURE__ */ new Set()) {
  const providers = [additionalProviders || EMPTY_ARRAY, importProvidersFrom(defType)];
  name = name || (typeof defType === "object" ? void 0 : stringify(defType));
  return new R3Injector(providers, parent || getNullInjector(), name || null, scopes);
}
var Injector = /* @__PURE__ */ (() => {
  class Injector2 {
    static create(options, parent) {
      if (Array.isArray(options)) {
        return createInjector({
          name: ""
        }, parent, options, "");
      } else {
        const name = options.name ?? "";
        return createInjector({
          name
        }, options.parent, options.providers, name);
      }
    }
  }
  Injector2.THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
  Injector2.NULL = /* @__PURE__ */ new NullInjector();
  Injector2.\u0275prov = \u0275\u0275defineInjectable({
    token: Injector2,
    providedIn: "any",
    factory: () => \u0275\u0275inject(INJECTOR)
  });
  Injector2.__NG_ELEMENT_ID__ = -1;
  return Injector2;
})();
function \u0275\u0275directiveInject(token, flags = InjectFlags.Default) {
  const lView = getLView();
  if (lView === null) {
    ngDevMode && assertInjectImplementationNotEqual(\u0275\u0275directiveInject);
    return \u0275\u0275inject(token, flags);
  }
  const tNode = getCurrentTNode();
  return getOrCreateInjectable(tNode, lView, resolveForwardRef(token), flags);
}
function \u0275\u0275invalidFactory() {
  const msg = ngDevMode ? `This constructor was not compatible with Dependency Injection.` : "invalid";
  throw new Error(msg);
}
function processHostBindingOpCodes(tView, lView) {
  const hostBindingOpCodes = tView.hostBindingOpCodes;
  if (hostBindingOpCodes === null)
    return;
  try {
    for (let i = 0; i < hostBindingOpCodes.length; i++) {
      const opCode = hostBindingOpCodes[i];
      if (opCode < 0) {
        setSelectedIndex(~opCode);
      } else {
        const directiveIdx = opCode;
        const bindingRootIndx = hostBindingOpCodes[++i];
        const hostBindingFn = hostBindingOpCodes[++i];
        setBindingRootForHostBindings(bindingRootIndx, directiveIdx);
        const context2 = lView[directiveIdx];
        hostBindingFn(2, context2);
      }
    }
  } finally {
    setSelectedIndex(-1);
  }
}
function refreshContentQueries(tView, lView) {
  const contentQueries = tView.contentQueries;
  if (contentQueries !== null) {
    for (let i = 0; i < contentQueries.length; i += 2) {
      const queryStartIdx = contentQueries[i];
      const directiveDefIdx = contentQueries[i + 1];
      if (directiveDefIdx !== -1) {
        const directiveDef = tView.data[directiveDefIdx];
        ngDevMode && assertDefined(directiveDef, "DirectiveDef not found.");
        ngDevMode && assertDefined(directiveDef.contentQueries, "contentQueries function should be defined");
        setCurrentQueryIndex(queryStartIdx);
        directiveDef.contentQueries(2, lView[directiveDefIdx], directiveDefIdx);
      }
    }
  }
}
function refreshChildComponents(hostLView, components) {
  for (let i = 0; i < components.length; i++) {
    refreshComponent(hostLView, components[i]);
  }
}
function renderChildComponents(hostLView, components) {
  for (let i = 0; i < components.length; i++) {
    renderComponent(hostLView, components[i]);
  }
}
function createLView(parentLView, tView, context2, flags, host, tHostNode, rendererFactory, renderer, sanitizer, injector, embeddedViewInjector) {
  const lView = tView.blueprint.slice();
  lView[HOST] = host;
  lView[FLAGS] = flags | 4 | 64 | 8;
  if (embeddedViewInjector !== null || parentLView && parentLView[FLAGS] & 1024) {
    lView[FLAGS] |= 1024;
  }
  resetPreOrderHookFlags(lView);
  ngDevMode && tView.declTNode && parentLView && assertTNodeForLView(tView.declTNode, parentLView);
  lView[PARENT] = lView[DECLARATION_VIEW] = parentLView;
  lView[CONTEXT] = context2;
  lView[RENDERER_FACTORY] = rendererFactory || parentLView && parentLView[RENDERER_FACTORY];
  ngDevMode && assertDefined(lView[RENDERER_FACTORY], "RendererFactory is required");
  lView[RENDERER] = renderer || parentLView && parentLView[RENDERER];
  ngDevMode && assertDefined(lView[RENDERER], "Renderer is required");
  lView[SANITIZER] = sanitizer || parentLView && parentLView[SANITIZER] || null;
  lView[INJECTOR$1] = injector || parentLView && parentLView[INJECTOR$1] || null;
  lView[T_HOST] = tHostNode;
  lView[ID] = getUniqueLViewId();
  lView[EMBEDDED_VIEW_INJECTOR] = embeddedViewInjector;
  ngDevMode && assertEqual(tView.type == 2 ? parentLView !== null : true, true, "Embedded views must have parentLView");
  lView[DECLARATION_COMPONENT_VIEW] = tView.type == 2 ? parentLView[DECLARATION_COMPONENT_VIEW] : lView;
  return lView;
}
function getOrCreateTNode(tView, index, type, name, attrs) {
  ngDevMode && index !== 0 && // 0 are bogus nodes and they are OK. See `createContainerRef` in
  // `view_engine_compatibility` for additional context.
  assertGreaterThanOrEqual(index, HEADER_OFFSET, "TNodes can't be in the LView header.");
  ngDevMode && assertPureTNodeType(type);
  let tNode = tView.data[index];
  if (tNode === null) {
    tNode = createTNodeAtIndex(tView, index, type, name, attrs);
    if (isInI18nBlock()) {
      tNode.flags |= 32;
    }
  } else if (tNode.type & 64) {
    tNode.type = type;
    tNode.value = name;
    tNode.attrs = attrs;
    const parent = getCurrentParentTNode();
    tNode.injectorIndex = parent === null ? -1 : parent.injectorIndex;
    ngDevMode && assertTNodeForTView(tNode, tView);
    ngDevMode && assertEqual(index, tNode.index, "Expecting same index");
  }
  setCurrentTNode(tNode, true);
  return tNode;
}
function createTNodeAtIndex(tView, index, type, name, attrs) {
  const currentTNode = getCurrentTNodePlaceholderOk();
  const isParent = isCurrentTNodeParent();
  const parent = isParent ? currentTNode : currentTNode && currentTNode.parent;
  const tNode = tView.data[index] = createTNode(tView, parent, type, index, name, attrs);
  if (tView.firstChild === null) {
    tView.firstChild = tNode;
  }
  if (currentTNode !== null) {
    if (isParent) {
      if (currentTNode.child == null && tNode.parent !== null) {
        currentTNode.child = tNode;
      }
    } else {
      if (currentTNode.next === null) {
        currentTNode.next = tNode;
        tNode.prev = currentTNode;
      }
    }
  }
  return tNode;
}
function allocExpando(tView, lView, numSlotsToAlloc, initialValue) {
  if (numSlotsToAlloc === 0)
    return -1;
  if (ngDevMode) {
    assertFirstCreatePass(tView);
    assertSame(tView, lView[TVIEW], "`LView` must be associated with `TView`!");
    assertEqual(tView.data.length, lView.length, "Expecting LView to be same size as TView");
    assertEqual(tView.data.length, tView.blueprint.length, "Expecting Blueprint to be same size as TView");
    assertFirstUpdatePass(tView);
  }
  const allocIdx = lView.length;
  for (let i = 0; i < numSlotsToAlloc; i++) {
    lView.push(initialValue);
    tView.blueprint.push(initialValue);
    tView.data.push(null);
  }
  return allocIdx;
}
function renderView(tView, lView, context2) {
  ngDevMode && assertEqual(isCreationMode(lView), true, "Should be run in creation mode");
  enterView(lView);
  try {
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(1, viewQuery, context2);
    }
    const templateFn = tView.template;
    if (templateFn !== null) {
      executeTemplate(tView, lView, templateFn, 1, context2);
    }
    if (tView.firstCreatePass) {
      tView.firstCreatePass = false;
    }
    if (tView.staticContentQueries) {
      refreshContentQueries(tView, lView);
    }
    if (tView.staticViewQueries) {
      executeViewQueryFn(2, tView.viewQuery, context2);
    }
    const components = tView.components;
    if (components !== null) {
      renderChildComponents(lView, components);
    }
  } catch (error) {
    if (tView.firstCreatePass) {
      tView.incompleteFirstPass = true;
      tView.firstCreatePass = false;
    }
    throw error;
  } finally {
    lView[FLAGS] &= ~4;
    leaveView();
  }
}
function refreshView(tView, lView, templateFn, context2) {
  ngDevMode && assertEqual(isCreationMode(lView), false, "Should be run in update mode");
  const flags = lView[FLAGS];
  if ((flags & 128) === 128)
    return;
  enterView(lView);
  const isInCheckNoChangesPass = ngDevMode && isInCheckNoChangesMode();
  try {
    resetPreOrderHookFlags(lView);
    setBindingIndex(tView.bindingStartIndex);
    if (templateFn !== null) {
      executeTemplate(tView, lView, templateFn, 2, context2);
    }
    const hooksInitPhaseCompleted = (flags & 3) === 3;
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const preOrderCheckHooks = tView.preOrderCheckHooks;
        if (preOrderCheckHooks !== null) {
          executeCheckHooks(lView, preOrderCheckHooks, null);
        }
      } else {
        const preOrderHooks = tView.preOrderHooks;
        if (preOrderHooks !== null) {
          executeInitAndCheckHooks(lView, preOrderHooks, 0, null);
        }
        incrementInitPhaseFlags(
          lView,
          0
          /* InitPhaseState.OnInitHooksToBeRun */
        );
      }
    }
    markTransplantedViewsForRefresh(lView);
    refreshEmbeddedViews(lView);
    if (tView.contentQueries !== null) {
      refreshContentQueries(tView, lView);
    }
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const contentCheckHooks = tView.contentCheckHooks;
        if (contentCheckHooks !== null) {
          executeCheckHooks(lView, contentCheckHooks);
        }
      } else {
        const contentHooks = tView.contentHooks;
        if (contentHooks !== null) {
          executeInitAndCheckHooks(
            lView,
            contentHooks,
            1
            /* InitPhaseState.AfterContentInitHooksToBeRun */
          );
        }
        incrementInitPhaseFlags(
          lView,
          1
          /* InitPhaseState.AfterContentInitHooksToBeRun */
        );
      }
    }
    processHostBindingOpCodes(tView, lView);
    const components = tView.components;
    if (components !== null) {
      refreshChildComponents(lView, components);
    }
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(2, viewQuery, context2);
    }
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const viewCheckHooks = tView.viewCheckHooks;
        if (viewCheckHooks !== null) {
          executeCheckHooks(lView, viewCheckHooks);
        }
      } else {
        const viewHooks = tView.viewHooks;
        if (viewHooks !== null) {
          executeInitAndCheckHooks(
            lView,
            viewHooks,
            2
            /* InitPhaseState.AfterViewInitHooksToBeRun */
          );
        }
        incrementInitPhaseFlags(
          lView,
          2
          /* InitPhaseState.AfterViewInitHooksToBeRun */
        );
      }
    }
    if (tView.firstUpdatePass === true) {
      tView.firstUpdatePass = false;
    }
    if (!isInCheckNoChangesPass) {
      lView[FLAGS] &= ~(32 | 8);
    }
    if (lView[FLAGS] & 512) {
      lView[FLAGS] &= ~512;
      updateTransplantedViewCount(lView[PARENT], -1);
    }
  } finally {
    leaveView();
  }
}
function executeTemplate(tView, lView, templateFn, rf, context2) {
  const prevSelectedIndex = getSelectedIndex();
  const isUpdatePhase = rf & 2;
  try {
    setSelectedIndex(-1);
    if (isUpdatePhase && lView.length > HEADER_OFFSET) {
      selectIndexInternal(tView, lView, HEADER_OFFSET, !!ngDevMode && isInCheckNoChangesMode());
    }
    const preHookType = isUpdatePhase ? 2 : 0;
    profiler(preHookType, context2);
    templateFn(rf, context2);
  } finally {
    setSelectedIndex(prevSelectedIndex);
    const postHookType = isUpdatePhase ? 3 : 1;
    profiler(postHookType, context2);
  }
}
function executeContentQueries(tView, tNode, lView) {
  if (isContentQueryHost(tNode)) {
    const start = tNode.directiveStart;
    const end = tNode.directiveEnd;
    for (let directiveIndex = start; directiveIndex < end; directiveIndex++) {
      const def = tView.data[directiveIndex];
      if (def.contentQueries) {
        def.contentQueries(1, lView[directiveIndex], directiveIndex);
      }
    }
  }
}
function createDirectivesInstances(tView, lView, tNode) {
  if (!getBindingsEnabled())
    return;
  instantiateAllDirectives(tView, lView, tNode, getNativeByTNode(tNode, lView));
  if ((tNode.flags & 64) === 64) {
    invokeDirectivesHostBindings(tView, lView, tNode);
  }
}
function saveResolvedLocalsInData(viewData, tNode, localRefExtractor = getNativeByTNode) {
  const localNames = tNode.localNames;
  if (localNames !== null) {
    let localIndex = tNode.index + 1;
    for (let i = 0; i < localNames.length; i += 2) {
      const index = localNames[i + 1];
      const value = index === -1 ? localRefExtractor(tNode, viewData) : viewData[index];
      viewData[localIndex++] = value;
    }
  }
}
function getOrCreateComponentTView(def) {
  const tView = def.tView;
  if (tView === null || tView.incompleteFirstPass) {
    const declTNode = null;
    return def.tView = createTView(1, declTNode, def.template, def.decls, def.vars, def.directiveDefs, def.pipeDefs, def.viewQuery, def.schemas, def.consts);
  }
  return tView;
}
function createTView(type, declTNode, templateFn, decls, vars, directives, pipes, viewQuery, schemas, constsOrFactory) {
  ngDevMode && ngDevMode.tView++;
  const bindingStartIndex = HEADER_OFFSET + decls;
  const initialViewLength = bindingStartIndex + vars;
  const blueprint = createViewBlueprint(bindingStartIndex, initialViewLength);
  const consts = typeof constsOrFactory === "function" ? constsOrFactory() : constsOrFactory;
  const tView = blueprint[TVIEW] = {
    type,
    blueprint,
    template: templateFn,
    queries: null,
    viewQuery,
    declTNode,
    data: blueprint.slice().fill(null, bindingStartIndex),
    bindingStartIndex,
    expandoStartIndex: initialViewLength,
    hostBindingOpCodes: null,
    firstCreatePass: true,
    firstUpdatePass: true,
    staticViewQueries: false,
    staticContentQueries: false,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof directives === "function" ? directives() : directives,
    pipeRegistry: typeof pipes === "function" ? pipes() : pipes,
    firstChild: null,
    schemas,
    consts,
    incompleteFirstPass: false
  };
  if (ngDevMode) {
    Object.seal(tView);
  }
  return tView;
}
function createViewBlueprint(bindingStartIndex, initialViewLength) {
  const blueprint = [];
  for (let i = 0; i < initialViewLength; i++) {
    blueprint.push(i < bindingStartIndex ? null : NO_CHANGE);
  }
  return blueprint;
}
function locateHostElement(renderer, elementOrSelector, encapsulation) {
  const preserveContent = encapsulation === ViewEncapsulation$1.ShadowDom;
  return renderer.selectRootElement(elementOrSelector, preserveContent);
}
function storeCleanupWithContext(tView, lView, context2, cleanupFn) {
  const lCleanup = getOrCreateLViewCleanup(lView);
  if (context2 === null) {
    if (ngDevMode) {
      Object.freeze(getOrCreateTViewCleanup(tView));
    }
    lCleanup.push(cleanupFn);
  } else {
    lCleanup.push(context2);
    if (tView.firstCreatePass) {
      getOrCreateTViewCleanup(tView).push(cleanupFn, lCleanup.length - 1);
    }
  }
}
function createTNode(tView, tParent, type, index, value, attrs) {
  ngDevMode && index !== 0 && // 0 are bogus nodes and they are OK. See `createContainerRef` in
  // `view_engine_compatibility` for additional context.
  assertGreaterThanOrEqual(index, HEADER_OFFSET, "TNodes can't be in the LView header.");
  ngDevMode && assertNotSame(attrs, void 0, "'undefined' is not valid value for 'attrs'");
  ngDevMode && ngDevMode.tNode++;
  ngDevMode && tParent && assertTNodeForTView(tParent, tView);
  let injectorIndex = tParent ? tParent.injectorIndex : -1;
  const tNode = {
    type,
    index,
    insertBeforeIndex: null,
    injectorIndex,
    directiveStart: -1,
    directiveEnd: -1,
    directiveStylingLast: -1,
    componentOffset: -1,
    propertyBindings: null,
    flags: 0,
    providerIndexes: 0,
    value,
    attrs,
    mergedAttrs: null,
    localNames: null,
    initialInputs: void 0,
    inputs: null,
    outputs: null,
    tView: null,
    next: null,
    prev: null,
    projectionNext: null,
    child: null,
    parent: tParent,
    projection: null,
    styles: null,
    stylesWithoutHost: null,
    residualStyles: void 0,
    classes: null,
    classesWithoutHost: null,
    residualClasses: void 0,
    classBindings: 0,
    styleBindings: 0
  };
  if (ngDevMode) {
    Object.seal(tNode);
  }
  return tNode;
}
function generatePropertyAliases(aliasMap, directiveIndex, propertyAliases, hostDirectiveAliasMap) {
  for (let publicName in aliasMap) {
    if (aliasMap.hasOwnProperty(publicName)) {
      propertyAliases = propertyAliases === null ? {} : propertyAliases;
      const internalName = aliasMap[publicName];
      if (hostDirectiveAliasMap === null) {
        addPropertyAlias(propertyAliases, directiveIndex, publicName, internalName);
      } else if (hostDirectiveAliasMap.hasOwnProperty(publicName)) {
        addPropertyAlias(propertyAliases, directiveIndex, hostDirectiveAliasMap[publicName], internalName);
      }
    }
  }
  return propertyAliases;
}
function addPropertyAlias(propertyAliases, directiveIndex, publicName, internalName) {
  if (propertyAliases.hasOwnProperty(publicName)) {
    propertyAliases[publicName].push(directiveIndex, internalName);
  } else {
    propertyAliases[publicName] = [directiveIndex, internalName];
  }
}
function initializeInputAndOutputAliases(tView, tNode, hostDirectiveDefinitionMap) {
  ngDevMode && assertFirstCreatePass(tView);
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  const tViewData = tView.data;
  const tNodeAttrs = tNode.attrs;
  const inputsFromAttrs = [];
  let inputsStore = null;
  let outputsStore = null;
  for (let directiveIndex = start; directiveIndex < end; directiveIndex++) {
    const directiveDef = tViewData[directiveIndex];
    const aliasData = hostDirectiveDefinitionMap ? hostDirectiveDefinitionMap.get(directiveDef) : null;
    const aliasedInputs = aliasData ? aliasData.inputs : null;
    const aliasedOutputs = aliasData ? aliasData.outputs : null;
    inputsStore = generatePropertyAliases(directiveDef.inputs, directiveIndex, inputsStore, aliasedInputs);
    outputsStore = generatePropertyAliases(directiveDef.outputs, directiveIndex, outputsStore, aliasedOutputs);
    const initialInputs = inputsStore !== null && tNodeAttrs !== null && !isInlineTemplate(tNode) ? generateInitialInputs(inputsStore, directiveIndex, tNodeAttrs) : null;
    inputsFromAttrs.push(initialInputs);
  }
  if (inputsStore !== null) {
    if (inputsStore.hasOwnProperty("class")) {
      tNode.flags |= 8;
    }
    if (inputsStore.hasOwnProperty("style")) {
      tNode.flags |= 16;
    }
  }
  tNode.initialInputs = inputsFromAttrs;
  tNode.inputs = inputsStore;
  tNode.outputs = outputsStore;
}
function markDirtyIfOnPush(lView, viewIndex) {
  ngDevMode && assertLView(lView);
  const childComponentLView = getComponentLViewByIndex(viewIndex, lView);
  if (!(childComponentLView[FLAGS] & 16)) {
    childComponentLView[FLAGS] |= 32;
  }
}
function setNgReflectProperty(lView, element, type, attrName, value) {
  const renderer = lView[RENDERER];
  attrName = normalizeDebugBindingName(attrName);
  const debugValue = normalizeDebugBindingValue(value);
  if (type & 3) {
    if (value == null) {
      renderer.removeAttribute(element, attrName);
    } else {
      renderer.setAttribute(element, attrName, debugValue);
    }
  } else {
    const textContent = escapeCommentText(`bindings=${JSON.stringify({
      [attrName]: debugValue
    }, null, 2)}`);
    renderer.setValue(element, textContent);
  }
}
function resolveDirectives(tView, lView, tNode, localRefs) {
  ngDevMode && assertFirstCreatePass(tView);
  if (getBindingsEnabled()) {
    const exportsMap = localRefs === null ? null : {
      "": -1
    };
    const matchResult = findDirectiveDefMatches(tView, tNode);
    let directiveDefs;
    let hostDirectiveDefs;
    if (matchResult === null) {
      directiveDefs = hostDirectiveDefs = null;
    } else {
      [directiveDefs, hostDirectiveDefs] = matchResult;
    }
    if (directiveDefs !== null) {
      initializeDirectives(tView, lView, tNode, directiveDefs, exportsMap, hostDirectiveDefs);
    }
    if (exportsMap)
      cacheMatchingLocalNames(tNode, localRefs, exportsMap);
  }
  tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, tNode.attrs);
}
function initializeDirectives(tView, lView, tNode, directives, exportsMap, hostDirectiveDefs) {
  ngDevMode && assertFirstCreatePass(tView);
  for (let i = 0; i < directives.length; i++) {
    diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, directives[i].type);
  }
  initTNodeFlags(tNode, tView.data.length, directives.length);
  for (let i = 0; i < directives.length; i++) {
    const def = directives[i];
    if (def.providersResolver)
      def.providersResolver(def);
  }
  let preOrderHooksFound = false;
  let preOrderCheckHooksFound = false;
  let directiveIdx = allocExpando(tView, lView, directives.length, null);
  ngDevMode && assertSame(directiveIdx, tNode.directiveStart, "TNode.directiveStart should point to just allocated space");
  for (let i = 0; i < directives.length; i++) {
    const def = directives[i];
    tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, def.hostAttrs);
    configureViewWithDirective(tView, tNode, lView, directiveIdx, def);
    saveNameToExportMap(directiveIdx, def, exportsMap);
    if (def.contentQueries !== null)
      tNode.flags |= 4;
    if (def.hostBindings !== null || def.hostAttrs !== null || def.hostVars !== 0)
      tNode.flags |= 64;
    const lifeCycleHooks = def.type.prototype;
    if (!preOrderHooksFound && (lifeCycleHooks.ngOnChanges || lifeCycleHooks.ngOnInit || lifeCycleHooks.ngDoCheck)) {
      (tView.preOrderHooks ?? (tView.preOrderHooks = [])).push(tNode.index);
      preOrderHooksFound = true;
    }
    if (!preOrderCheckHooksFound && (lifeCycleHooks.ngOnChanges || lifeCycleHooks.ngDoCheck)) {
      (tView.preOrderCheckHooks ?? (tView.preOrderCheckHooks = [])).push(tNode.index);
      preOrderCheckHooksFound = true;
    }
    directiveIdx++;
  }
  initializeInputAndOutputAliases(tView, tNode, hostDirectiveDefs);
}
function registerHostBindingOpCodes(tView, tNode, directiveIdx, directiveVarsIdx, def) {
  ngDevMode && assertFirstCreatePass(tView);
  const hostBindings = def.hostBindings;
  if (hostBindings) {
    let hostBindingOpCodes = tView.hostBindingOpCodes;
    if (hostBindingOpCodes === null) {
      hostBindingOpCodes = tView.hostBindingOpCodes = [];
    }
    const elementIndx = ~tNode.index;
    if (lastSelectedElementIdx(hostBindingOpCodes) != elementIndx) {
      hostBindingOpCodes.push(elementIndx);
    }
    hostBindingOpCodes.push(directiveIdx, directiveVarsIdx, hostBindings);
  }
}
function lastSelectedElementIdx(hostBindingOpCodes) {
  let i = hostBindingOpCodes.length;
  while (i > 0) {
    const value = hostBindingOpCodes[--i];
    if (typeof value === "number" && value < 0) {
      return value;
    }
  }
  return 0;
}
function instantiateAllDirectives(tView, lView, tNode, native) {
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  if (isComponentHost(tNode)) {
    ngDevMode && assertTNodeType(
      tNode,
      3
      /* TNodeType.AnyRNode */
    );
    addComponentLogic(lView, tNode, tView.data[start + tNode.componentOffset]);
  }
  if (!tView.firstCreatePass) {
    getOrCreateNodeInjectorForNode(tNode, lView);
  }
  attachPatchData(native, lView);
  const initialInputs = tNode.initialInputs;
  for (let i = start; i < end; i++) {
    const def = tView.data[i];
    const directive = getNodeInjectable(lView, tView, i, tNode);
    attachPatchData(directive, lView);
    if (initialInputs !== null) {
      setInputsFromAttrs(lView, i - start, directive, def, tNode, initialInputs);
    }
    if (isComponentDef(def)) {
      const componentView = getComponentLViewByIndex(tNode.index, lView);
      componentView[CONTEXT] = getNodeInjectable(lView, tView, i, tNode);
    }
  }
}
function invokeDirectivesHostBindings(tView, lView, tNode) {
  const start = tNode.directiveStart;
  const end = tNode.directiveEnd;
  const elementIndex = tNode.index;
  const currentDirectiveIndex = getCurrentDirectiveIndex();
  try {
    setSelectedIndex(elementIndex);
    for (let dirIndex = start; dirIndex < end; dirIndex++) {
      const def = tView.data[dirIndex];
      const directive = lView[dirIndex];
      setCurrentDirectiveIndex(dirIndex);
      if (def.hostBindings !== null || def.hostVars !== 0 || def.hostAttrs !== null) {
        invokeHostBindingsInCreationMode(def, directive);
      }
    }
  } finally {
    setSelectedIndex(-1);
    setCurrentDirectiveIndex(currentDirectiveIndex);
  }
}
function invokeHostBindingsInCreationMode(def, directive) {
  if (def.hostBindings !== null) {
    def.hostBindings(1, directive);
  }
}
function findDirectiveDefMatches(tView, tNode) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && assertTNodeType(
    tNode,
    3 | 12
    /* TNodeType.AnyContainer */
  );
  const registry = tView.directiveRegistry;
  let matches = null;
  let hostDirectiveDefs = null;
  if (registry) {
    for (let i = 0; i < registry.length; i++) {
      const def = registry[i];
      if (isNodeMatchingSelectorList(
        tNode,
        def.selectors,
        /* isProjectionMode */
        false
      )) {
        matches || (matches = []);
        if (isComponentDef(def)) {
          if (ngDevMode) {
            assertTNodeType(tNode, 2, `"${tNode.value}" tags cannot be used as component hosts. Please use a different tag to activate the ${stringify(def.type)} component.`);
            if (isComponentHost(tNode)) {
              throwMultipleComponentError(tNode, matches.find(isComponentDef).type, def.type);
            }
          }
          if (def.findHostDirectiveDefs !== null) {
            const hostDirectiveMatches = [];
            hostDirectiveDefs = hostDirectiveDefs || /* @__PURE__ */ new Map();
            def.findHostDirectiveDefs(def, hostDirectiveMatches, hostDirectiveDefs);
            matches.unshift(...hostDirectiveMatches, def);
            const componentOffset = hostDirectiveMatches.length;
            markAsComponentHost(tView, tNode, componentOffset);
          } else {
            matches.unshift(def);
            markAsComponentHost(tView, tNode, 0);
          }
        } else {
          hostDirectiveDefs = hostDirectiveDefs || /* @__PURE__ */ new Map();
          def.findHostDirectiveDefs?.(def, matches, hostDirectiveDefs);
          matches.push(def);
        }
      }
    }
  }
  return matches === null ? null : [matches, hostDirectiveDefs];
}
function markAsComponentHost(tView, hostTNode, componentOffset) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && assertGreaterThan(componentOffset, -1, "componentOffset must be great than -1");
  hostTNode.componentOffset = componentOffset;
  (tView.components ?? (tView.components = [])).push(hostTNode.index);
}
function cacheMatchingLocalNames(tNode, localRefs, exportsMap) {
  if (localRefs) {
    const localNames = tNode.localNames = [];
    for (let i = 0; i < localRefs.length; i += 2) {
      const index = exportsMap[localRefs[i + 1]];
      if (index == null)
        throw new RuntimeError(-301, ngDevMode && `Export of name '${localRefs[i + 1]}' not found!`);
      localNames.push(localRefs[i], index);
    }
  }
}
function saveNameToExportMap(directiveIdx, def, exportsMap) {
  if (exportsMap) {
    if (def.exportAs) {
      for (let i = 0; i < def.exportAs.length; i++) {
        exportsMap[def.exportAs[i]] = directiveIdx;
      }
    }
    if (isComponentDef(def))
      exportsMap[""] = directiveIdx;
  }
}
function initTNodeFlags(tNode, index, numberOfDirectives) {
  ngDevMode && assertNotEqual(numberOfDirectives, tNode.directiveEnd - tNode.directiveStart, "Reached the max number of directives");
  tNode.flags |= 1;
  tNode.directiveStart = index;
  tNode.directiveEnd = index + numberOfDirectives;
  tNode.providerIndexes = index;
}
function configureViewWithDirective(tView, tNode, lView, directiveIndex, def) {
  ngDevMode && assertGreaterThanOrEqual(directiveIndex, HEADER_OFFSET, "Must be in Expando section");
  tView.data[directiveIndex] = def;
  const directiveFactory = def.factory || (def.factory = getFactoryDef(def.type, true));
  const nodeInjectorFactory = new NodeInjectorFactory(directiveFactory, isComponentDef(def), \u0275\u0275directiveInject);
  tView.blueprint[directiveIndex] = nodeInjectorFactory;
  lView[directiveIndex] = nodeInjectorFactory;
  registerHostBindingOpCodes(tView, tNode, directiveIndex, allocExpando(tView, lView, def.hostVars, NO_CHANGE), def);
}
function addComponentLogic(lView, hostTNode, def) {
  const native = getNativeByTNode(hostTNode, lView);
  const tView = getOrCreateComponentTView(def);
  const rendererFactory = lView[RENDERER_FACTORY];
  const componentView = addToViewTree(lView, createLView(lView, tView, null, def.onPush ? 32 : 16, native, hostTNode, rendererFactory, rendererFactory.createRenderer(native, def), null, null, null));
  lView[hostTNode.index] = componentView;
}
function elementAttributeInternal(tNode, lView, name, value, sanitizer, namespace) {
  if (ngDevMode) {
    assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
    validateAgainstEventAttributes(name);
    assertTNodeType(tNode, 2, `Attempted to set attribute \`${name}\` on a container node. Host bindings are not valid on ng-container or ng-template.`);
  }
  const element = getNativeByTNode(tNode, lView);
  setElementAttribute(lView[RENDERER], element, namespace, tNode.value, name, value, sanitizer);
}
function setElementAttribute(renderer, element, namespace, tagName, name, value, sanitizer) {
  if (value == null) {
    ngDevMode && ngDevMode.rendererRemoveAttribute++;
    renderer.removeAttribute(element, name, namespace);
  } else {
    ngDevMode && ngDevMode.rendererSetAttribute++;
    const strValue = sanitizer == null ? renderStringify(value) : sanitizer(value, tagName || "", name);
    renderer.setAttribute(element, name, strValue, namespace);
  }
}
function setInputsFromAttrs(lView, directiveIndex, instance, def, tNode, initialInputData) {
  const initialInputs = initialInputData[directiveIndex];
  if (initialInputs !== null) {
    const setInput = def.setInput;
    for (let i = 0; i < initialInputs.length; ) {
      const publicName = initialInputs[i++];
      const privateName = initialInputs[i++];
      const value = initialInputs[i++];
      if (setInput !== null) {
        def.setInput(instance, value, publicName, privateName);
      } else {
        instance[privateName] = value;
      }
      if (ngDevMode) {
        const nativeElement = getNativeByTNode(tNode, lView);
        setNgReflectProperty(lView, nativeElement, tNode.type, privateName, value);
      }
    }
  }
}
function generateInitialInputs(inputs, directiveIndex, attrs) {
  let inputsToStore = null;
  let i = 0;
  while (i < attrs.length) {
    const attrName = attrs[i];
    if (attrName === 0) {
      i += 4;
      continue;
    } else if (attrName === 5) {
      i += 2;
      continue;
    }
    if (typeof attrName === "number")
      break;
    if (inputs.hasOwnProperty(attrName)) {
      if (inputsToStore === null)
        inputsToStore = [];
      const inputConfig = inputs[attrName];
      for (let j = 0; j < inputConfig.length; j += 2) {
        if (inputConfig[j] === directiveIndex) {
          inputsToStore.push(attrName, inputConfig[j + 1], attrs[i + 1]);
          break;
        }
      }
    }
    i += 2;
  }
  return inputsToStore;
}
function createLContainer(hostNative, currentView, native, tNode) {
  ngDevMode && assertLView(currentView);
  const lContainer = [
    hostNative,
    true,
    false,
    currentView,
    null,
    0,
    tNode,
    native,
    null,
    null
    // moved views
  ];
  ngDevMode && assertEqual(lContainer.length, CONTAINER_HEADER_OFFSET, "Should allocate correct number of slots for LContainer header.");
  return lContainer;
}
function refreshEmbeddedViews(lView) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) {
    for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
      const embeddedLView = lContainer[i];
      const embeddedTView = embeddedLView[TVIEW];
      ngDevMode && assertDefined(embeddedTView, "TView must be allocated");
      if (viewAttachedToChangeDetector(embeddedLView)) {
        refreshView(embeddedTView, embeddedLView, embeddedTView.template, embeddedLView[CONTEXT]);
      }
    }
  }
}
function markTransplantedViewsForRefresh(lView) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) {
    if (!lContainer[HAS_TRANSPLANTED_VIEWS])
      continue;
    const movedViews = lContainer[MOVED_VIEWS];
    ngDevMode && assertDefined(movedViews, "Transplanted View flags set but missing MOVED_VIEWS");
    for (let i = 0; i < movedViews.length; i++) {
      const movedLView = movedViews[i];
      const insertionLContainer = movedLView[PARENT];
      ngDevMode && assertLContainer(insertionLContainer);
      if ((movedLView[FLAGS] & 512) === 0) {
        updateTransplantedViewCount(insertionLContainer, 1);
      }
      movedLView[FLAGS] |= 512;
    }
  }
}
function refreshComponent(hostLView, componentHostIdx) {
  ngDevMode && assertEqual(isCreationMode(hostLView), false, "Should be run in update mode");
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  if (viewAttachedToChangeDetector(componentView)) {
    const tView = componentView[TVIEW];
    if (componentView[FLAGS] & (16 | 32)) {
      refreshView(tView, componentView, tView.template, componentView[CONTEXT]);
    } else if (componentView[TRANSPLANTED_VIEWS_TO_REFRESH] > 0) {
      refreshContainsDirtyView(componentView);
    }
  }
}
function refreshContainsDirtyView(lView) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null; lContainer = getNextLContainer(lContainer)) {
    for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
      const embeddedLView = lContainer[i];
      if (viewAttachedToChangeDetector(embeddedLView)) {
        if (embeddedLView[FLAGS] & 512) {
          const embeddedTView = embeddedLView[TVIEW];
          ngDevMode && assertDefined(embeddedTView, "TView must be allocated");
          refreshView(embeddedTView, embeddedLView, embeddedTView.template, embeddedLView[CONTEXT]);
        } else if (embeddedLView[TRANSPLANTED_VIEWS_TO_REFRESH] > 0) {
          refreshContainsDirtyView(embeddedLView);
        }
      }
    }
  }
  const tView = lView[TVIEW];
  const components = tView.components;
  if (components !== null) {
    for (let i = 0; i < components.length; i++) {
      const componentView = getComponentLViewByIndex(components[i], lView);
      if (viewAttachedToChangeDetector(componentView) && componentView[TRANSPLANTED_VIEWS_TO_REFRESH] > 0) {
        refreshContainsDirtyView(componentView);
      }
    }
  }
}
function renderComponent(hostLView, componentHostIdx) {
  ngDevMode && assertEqual(isCreationMode(hostLView), true, "Should be run in creation mode");
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  const componentTView = componentView[TVIEW];
  syncViewWithBlueprint(componentTView, componentView);
  renderView(componentTView, componentView, componentView[CONTEXT]);
}
function syncViewWithBlueprint(tView, lView) {
  for (let i = lView.length; i < tView.blueprint.length; i++) {
    lView.push(tView.blueprint[i]);
  }
}
function addToViewTree(lView, lViewOrLContainer) {
  if (lView[CHILD_HEAD]) {
    lView[CHILD_TAIL][NEXT] = lViewOrLContainer;
  } else {
    lView[CHILD_HEAD] = lViewOrLContainer;
  }
  lView[CHILD_TAIL] = lViewOrLContainer;
  return lViewOrLContainer;
}
function markViewDirty(lView) {
  while (lView) {
    lView[FLAGS] |= 32;
    const parent = getLViewParent(lView);
    if (isRootView(lView) && !parent) {
      return lView;
    }
    lView = parent;
  }
  return null;
}
function detectChangesInternal(tView, lView, context2, notifyErrorHandler = true) {
  const rendererFactory = lView[RENDERER_FACTORY];
  const checkNoChangesMode = !!ngDevMode && isInCheckNoChangesMode();
  if (!checkNoChangesMode && rendererFactory.begin)
    rendererFactory.begin();
  try {
    refreshView(tView, lView, tView.template, context2);
  } catch (error) {
    if (notifyErrorHandler) {
      handleError(lView, error);
    }
    throw error;
  } finally {
    if (!checkNoChangesMode && rendererFactory.end)
      rendererFactory.end();
  }
}
function checkNoChangesInternal(tView, lView, context2, notifyErrorHandler = true) {
  setIsInCheckNoChangesMode(true);
  try {
    detectChangesInternal(tView, lView, context2, notifyErrorHandler);
  } finally {
    setIsInCheckNoChangesMode(false);
  }
}
function executeViewQueryFn(flags, viewQueryFn, component) {
  ngDevMode && assertDefined(viewQueryFn, "View queries function to execute must be defined.");
  setCurrentQueryIndex(0);
  viewQueryFn(flags, component);
}
function storePropertyBindingMetadata(tData, tNode, propertyName, bindingIndex, ...interpolationParts) {
  if (tData[bindingIndex] === null) {
    if (tNode.inputs == null || !tNode.inputs[propertyName]) {
      const propBindingIdxs = tNode.propertyBindings || (tNode.propertyBindings = []);
      propBindingIdxs.push(bindingIndex);
      let bindingMetadata = propertyName;
      if (interpolationParts.length > 0) {
        bindingMetadata += INTERPOLATION_DELIMITER + interpolationParts.join(INTERPOLATION_DELIMITER);
      }
      tData[bindingIndex] = bindingMetadata;
    }
  }
}
function getOrCreateLViewCleanup(view) {
  return view[CLEANUP] || (view[CLEANUP] = []);
}
function getOrCreateTViewCleanup(tView) {
  return tView.cleanup || (tView.cleanup = []);
}
function handleError(lView, error) {
  const injector = lView[INJECTOR$1];
  const errorHandler2 = injector ? injector.get(ErrorHandler, null) : null;
  errorHandler2 && errorHandler2.handleError(error);
}
function setInputsForProperty(tView, lView, inputs, publicName, value) {
  for (let i = 0; i < inputs.length; ) {
    const index = inputs[i++];
    const privateName = inputs[i++];
    const instance = lView[index];
    ngDevMode && assertIndexInRange(lView, index);
    const def = tView.data[index];
    if (def.setInput !== null) {
      def.setInput(instance, value, publicName, privateName);
    } else {
      instance[privateName] = value;
    }
  }
}
function computeStaticStyling(tNode, attrs, writeToHost) {
  ngDevMode && assertFirstCreatePass(getTView(), "Expecting to be called in first template pass only");
  let styles = writeToHost ? tNode.styles : null;
  let classes = writeToHost ? tNode.classes : null;
  let mode = 0;
  if (attrs !== null) {
    for (let i = 0; i < attrs.length; i++) {
      const value = attrs[i];
      if (typeof value === "number") {
        mode = value;
      } else if (mode == 1) {
        classes = concatStringsWithSpace(classes, value);
      } else if (mode == 2) {
        const style = value;
        const styleValue = attrs[++i];
        styles = concatStringsWithSpace(styles, style + ": " + styleValue + ";");
      }
    }
  }
  writeToHost ? tNode.styles = styles : tNode.stylesWithoutHost = styles;
  writeToHost ? tNode.classes = classes : tNode.classesWithoutHost = classes;
}
function collectNativeNodes(tView, lView, tNode, result, isProjection = false) {
  while (tNode !== null) {
    ngDevMode && assertTNodeType(
      tNode,
      3 | 12 | 16 | 32
      /* TNodeType.Icu */
    );
    const lNode = lView[tNode.index];
    if (lNode !== null) {
      result.push(unwrapRNode(lNode));
    }
    if (isLContainer(lNode)) {
      for (let i = CONTAINER_HEADER_OFFSET; i < lNode.length; i++) {
        const lViewInAContainer = lNode[i];
        const lViewFirstChildTNode = lViewInAContainer[TVIEW].firstChild;
        if (lViewFirstChildTNode !== null) {
          collectNativeNodes(lViewInAContainer[TVIEW], lViewInAContainer, lViewFirstChildTNode, result);
        }
      }
    }
    const tNodeType = tNode.type;
    if (tNodeType & 8) {
      collectNativeNodes(tView, lView, tNode.child, result);
    } else if (tNodeType & 32) {
      const nextRNode = icuContainerIterate(tNode, lView);
      let rNode;
      while (rNode = nextRNode()) {
        result.push(rNode);
      }
    } else if (tNodeType & 16) {
      const nodesInSlot = getProjectionNodes(lView, tNode);
      if (Array.isArray(nodesInSlot)) {
        result.push(...nodesInSlot);
      } else {
        const parentView = getLViewParent(lView[DECLARATION_COMPONENT_VIEW]);
        ngDevMode && assertParentView(parentView);
        collectNativeNodes(parentView[TVIEW], parentView, nodesInSlot, result, true);
      }
    }
    tNode = isProjection ? tNode.projectionNext : tNode.next;
  }
  return result;
}
var ViewRef$1 = class {
  get rootNodes() {
    const lView = this._lView;
    const tView = lView[TVIEW];
    return collectNativeNodes(tView, lView, tView.firstChild, []);
  }
  constructor(_lView, _cdRefInjectingView) {
    this._lView = _lView;
    this._cdRefInjectingView = _cdRefInjectingView;
    this._appRef = null;
    this._attachedToViewContainer = false;
  }
  get context() {
    return this._lView[CONTEXT];
  }
  set context(value) {
    this._lView[CONTEXT] = value;
  }
  get destroyed() {
    return (this._lView[FLAGS] & 128) === 128;
  }
  destroy() {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._attachedToViewContainer) {
      const parent = this._lView[PARENT];
      if (isLContainer(parent)) {
        const viewRefs = parent[VIEW_REFS];
        const index = viewRefs ? viewRefs.indexOf(this) : -1;
        if (index > -1) {
          ngDevMode && assertEqual(index, parent.indexOf(this._lView) - CONTAINER_HEADER_OFFSET, "An attached view should be in the same position within its container as its ViewRef in the VIEW_REFS array.");
          detachView(parent, index);
          removeFromArray(viewRefs, index);
        }
      }
      this._attachedToViewContainer = false;
    }
    destroyLView(this._lView[TVIEW], this._lView);
  }
  onDestroy(callback) {
    storeCleanupWithContext(this._lView[TVIEW], this._lView, null, callback);
  }
  /**
   * Marks a view and all of its ancestors dirty.
   *
   * This can be used to ensure an {@link ChangeDetectionStrategy#OnPush OnPush} component is
   * checked when it needs to be re-rendered but the two normal triggers haven't marked it
   * dirty (i.e. inputs haven't changed and events haven't fired in the view).
   *
   * <!-- TODO: Add a link to a chapter on OnPush components -->
   *
   * @usageNotes
   * ### Example
   *
   * ```typescript
   * @Component({
   *   selector: 'app-root',
   *   template: `Number of ticks: {{numberOfTicks}}`
   *   changeDetection: ChangeDetectionStrategy.OnPush,
   * })
   * class AppComponent {
   *   numberOfTicks = 0;
   *
   *   constructor(private ref: ChangeDetectorRef) {
   *     setInterval(() => {
   *       this.numberOfTicks++;
   *       // the following is required, otherwise the view will not be updated
   *       this.ref.markForCheck();
   *     }, 1000);
   *   }
   * }
   * ```
   */
  markForCheck() {
    markViewDirty(this._cdRefInjectingView || this._lView);
  }
  /**
   * Detaches the view from the change detection tree.
   *
   * Detached views will not be checked during change detection runs until they are
   * re-attached, even if they are dirty. `detach` can be used in combination with
   * {@link ChangeDetectorRef#detectChanges detectChanges} to implement local change
   * detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds. We can do that by detaching
   * the component's change detector and doing a local check every five seconds.
   *
   * ```typescript
   * class DataProvider {
   *   // in a real application the returned data will be different every time
   *   get data() {
   *     return [1,2,3,4,5];
   *   }
   * }
   *
   * @Component({
   *   selector: 'giant-list',
   *   template: `
   *     <li *ngFor="let d of dataProvider.data">Data {{d}}</li>
   *   `,
   * })
   * class GiantList {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {
   *     ref.detach();
   *     setInterval(() => {
   *       this.ref.detectChanges();
   *     }, 5000);
   *   }
   * }
   *
   * @Component({
   *   selector: 'app',
   *   providers: [DataProvider],
   *   template: `
   *     <giant-list><giant-list>
   *   `,
   * })
   * class App {
   * }
   * ```
   */
  detach() {
    this._lView[FLAGS] &= ~64;
  }
  /**
   * Re-attaches a view to the change detection tree.
   *
   * This can be used to re-attach views that were previously detached from the tree
   * using {@link ChangeDetectorRef#detach detach}. Views are attached to the tree by default.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example creates a component displaying `live` data. The component will detach
   * its change detector from the main change detector tree when the component's live property
   * is set to false.
   *
   * ```typescript
   * class DataProvider {
   *   data = 1;
   *
   *   constructor() {
   *     setInterval(() => {
   *       this.data = this.data * 2;
   *     }, 500);
   *   }
   * }
   *
   * @Component({
   *   selector: 'live-data',
   *   inputs: ['live'],
   *   template: 'Data: {{dataProvider.data}}'
   * })
   * class LiveData {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {}
   *
   *   set live(value) {
   *     if (value) {
   *       this.ref.reattach();
   *     } else {
   *       this.ref.detach();
   *     }
   *   }
   * }
   *
   * @Component({
   *   selector: 'app-root',
   *   providers: [DataProvider],
   *   template: `
   *     Live Update: <input type="checkbox" [(ngModel)]="live">
   *     <live-data [live]="live"><live-data>
   *   `,
   * })
   * class AppComponent {
   *   live = true;
   * }
   * ```
   */
  reattach() {
    this._lView[FLAGS] |= 64;
  }
  /**
   * Checks the view and its children.
   *
   * This can also be used in combination with {@link ChangeDetectorRef#detach detach} to implement
   * local change detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine, the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds.
   *
   * We can do that by detaching the component's change detector and doing a local change detection
   * check every five seconds.
   *
   * See {@link ChangeDetectorRef#detach detach} for more information.
   */
  detectChanges() {
    detectChangesInternal(this._lView[TVIEW], this._lView, this.context);
  }
  /**
   * Checks the change detector and its children, and throws if any changes are detected.
   *
   * This is used in development mode to verify that running change detection doesn't
   * introduce other changes.
   */
  checkNoChanges() {
    if (ngDevMode) {
      checkNoChangesInternal(this._lView[TVIEW], this._lView, this.context);
    }
  }
  attachToViewContainerRef() {
    if (this._appRef) {
      throw new RuntimeError(902, ngDevMode && "This view is already attached directly to the ApplicationRef!");
    }
    this._attachedToViewContainer = true;
  }
  detachFromAppRef() {
    this._appRef = null;
    renderDetachView(this._lView[TVIEW], this._lView);
  }
  attachToAppRef(appRef) {
    if (this._attachedToViewContainer) {
      throw new RuntimeError(902, ngDevMode && "This view is already attached to a ViewContainer!");
    }
    this._appRef = appRef;
  }
};
var RootViewRef = class extends ViewRef$1 {
  constructor(_view) {
    super(_view);
    this._view = _view;
  }
  detectChanges() {
    const lView = this._view;
    const tView = lView[TVIEW];
    const context2 = lView[CONTEXT];
    detectChangesInternal(tView, lView, context2, false);
  }
  checkNoChanges() {
    if (ngDevMode) {
      const lView = this._view;
      const tView = lView[TVIEW];
      const context2 = lView[CONTEXT];
      checkNoChangesInternal(tView, lView, context2, false);
    }
  }
  get context() {
    return null;
  }
};
var ComponentFactoryResolver = class extends ComponentFactoryResolver$1 {
  /**
   * @param ngModule The NgModuleRef to which all resolved factories are bound.
   */
  constructor(ngModule) {
    super();
    this.ngModule = ngModule;
  }
  resolveComponentFactory(component) {
    ngDevMode && assertComponentType(component);
    const componentDef = getComponentDef(component);
    return new ComponentFactory(componentDef, this.ngModule);
  }
};
function toRefArray(map2) {
  const array = [];
  for (let nonMinified in map2) {
    if (map2.hasOwnProperty(nonMinified)) {
      const minified = map2[nonMinified];
      array.push({
        propName: minified,
        templateName: nonMinified
      });
    }
  }
  return array;
}
function getNamespace(elementName) {
  const name = elementName.toLowerCase();
  return name === "svg" ? SVG_NAMESPACE : name === "math" ? MATH_ML_NAMESPACE : null;
}
var ChainedInjector = class {
  constructor(injector, parentInjector) {
    this.injector = injector;
    this.parentInjector = parentInjector;
  }
  get(token, notFoundValue, flags) {
    flags = convertToBitFlags(flags);
    const value = this.injector.get(token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, flags);
    if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR || notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
      return value;
    }
    return this.parentInjector.get(token, notFoundValue, flags);
  }
};
var ComponentFactory = class extends ComponentFactory$1 {
  get inputs() {
    return toRefArray(this.componentDef.inputs);
  }
  get outputs() {
    return toRefArray(this.componentDef.outputs);
  }
  /**
   * @param componentDef The component definition.
   * @param ngModule The NgModuleRef to which the factory is bound.
   */
  constructor(componentDef, ngModule) {
    super();
    this.componentDef = componentDef;
    this.ngModule = ngModule;
    this.componentType = componentDef.type;
    this.selector = stringifyCSSSelectorList(componentDef.selectors);
    this.ngContentSelectors = componentDef.ngContentSelectors ? componentDef.ngContentSelectors : [];
    this.isBoundToModule = !!ngModule;
  }
  create(injector, projectableNodes, rootSelectorOrNode, environmentInjector) {
    environmentInjector = environmentInjector || this.ngModule;
    let realEnvironmentInjector = environmentInjector instanceof EnvironmentInjector ? environmentInjector : environmentInjector?.injector;
    if (realEnvironmentInjector && this.componentDef.getStandaloneInjector !== null) {
      realEnvironmentInjector = this.componentDef.getStandaloneInjector(realEnvironmentInjector) || realEnvironmentInjector;
    }
    const rootViewInjector = realEnvironmentInjector ? new ChainedInjector(injector, realEnvironmentInjector) : injector;
    const rendererFactory = rootViewInjector.get(RendererFactory2, null);
    if (rendererFactory === null) {
      throw new RuntimeError(407, ngDevMode && "Angular was not able to inject a renderer (RendererFactory2). Likely this is due to a broken DI hierarchy. Make sure that any injector used to create this component has a correct parent.");
    }
    const sanitizer = rootViewInjector.get(Sanitizer, null);
    const hostRenderer = rendererFactory.createRenderer(null, this.componentDef);
    const elementName = this.componentDef.selectors[0][0] || "div";
    const hostRNode = rootSelectorOrNode ? locateHostElement(hostRenderer, rootSelectorOrNode, this.componentDef.encapsulation) : createElementNode(hostRenderer, elementName, getNamespace(elementName));
    const rootFlags = this.componentDef.onPush ? 32 | 256 : 16 | 256;
    const rootTView = createTView(0, null, null, 1, 0, null, null, null, null, null);
    const rootLView = createLView(null, rootTView, null, rootFlags, null, null, rendererFactory, hostRenderer, sanitizer, rootViewInjector, null);
    enterView(rootLView);
    let component;
    let tElementNode;
    try {
      const rootComponentDef = this.componentDef;
      let rootDirectives;
      let hostDirectiveDefs = null;
      if (rootComponentDef.findHostDirectiveDefs) {
        rootDirectives = [];
        hostDirectiveDefs = /* @__PURE__ */ new Map();
        rootComponentDef.findHostDirectiveDefs(rootComponentDef, rootDirectives, hostDirectiveDefs);
        rootDirectives.push(rootComponentDef);
      } else {
        rootDirectives = [rootComponentDef];
      }
      const hostTNode = createRootComponentTNode(rootLView, hostRNode);
      const componentView = createRootComponentView(hostTNode, hostRNode, rootComponentDef, rootDirectives, rootLView, rendererFactory, hostRenderer);
      tElementNode = getTNode(rootTView, HEADER_OFFSET);
      if (hostRNode) {
        setRootNodeAttributes(hostRenderer, rootComponentDef, hostRNode, rootSelectorOrNode);
      }
      if (projectableNodes !== void 0) {
        projectNodes(tElementNode, this.ngContentSelectors, projectableNodes);
      }
      component = createRootComponent(componentView, rootComponentDef, rootDirectives, hostDirectiveDefs, rootLView, [LifecycleHooksFeature]);
      renderView(rootTView, rootLView, null);
    } finally {
      leaveView();
    }
    return new ComponentRef(this.componentType, component, createElementRef(tElementNode, rootLView), rootLView, tElementNode);
  }
};
var ComponentRef = class extends ComponentRef$1 {
  constructor(componentType, instance, location2, _rootLView, _tNode) {
    super();
    this.location = location2;
    this._rootLView = _rootLView;
    this._tNode = _tNode;
    this.instance = instance;
    this.hostView = this.changeDetectorRef = new RootViewRef(_rootLView);
    this.componentType = componentType;
  }
  setInput(name, value) {
    const inputData = this._tNode.inputs;
    let dataValue;
    if (inputData !== null && (dataValue = inputData[name])) {
      const lView = this._rootLView;
      setInputsForProperty(lView[TVIEW], lView, dataValue, name, value);
      markDirtyIfOnPush(lView, this._tNode.index);
    } else {
      if (ngDevMode) {
        const cmpNameForError = stringifyForError(this.componentType);
        let message = `Can't set value of the '${name}' input on the '${cmpNameForError}' component. `;
        message += `Make sure that the '${name}' property is annotated with @Input() or a mapped @Input('${name}') exists.`;
        reportUnknownPropertyError(message);
      }
    }
  }
  get injector() {
    return new NodeInjector(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(callback) {
    this.hostView.onDestroy(callback);
  }
};
function createRootComponentTNode(lView, rNode) {
  const tView = lView[TVIEW];
  const index = HEADER_OFFSET;
  ngDevMode && assertIndexInRange(lView, index);
  lView[index] = rNode;
  return getOrCreateTNode(tView, index, 2, "#host", null);
}
function createRootComponentView(tNode, rNode, rootComponentDef, rootDirectives, rootView, rendererFactory, hostRenderer, sanitizer) {
  const tView = rootView[TVIEW];
  applyRootComponentStyling(rootDirectives, tNode, rNode, hostRenderer);
  const viewRenderer = rendererFactory.createRenderer(rNode, rootComponentDef);
  const componentView = createLView(rootView, getOrCreateComponentTView(rootComponentDef), null, rootComponentDef.onPush ? 32 : 16, rootView[tNode.index], tNode, rendererFactory, viewRenderer, sanitizer || null, null, null);
  if (tView.firstCreatePass) {
    markAsComponentHost(tView, tNode, rootDirectives.length - 1);
  }
  addToViewTree(rootView, componentView);
  return rootView[tNode.index] = componentView;
}
function applyRootComponentStyling(rootDirectives, tNode, rNode, hostRenderer) {
  for (const def of rootDirectives) {
    tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, def.hostAttrs);
  }
  if (tNode.mergedAttrs !== null) {
    computeStaticStyling(tNode, tNode.mergedAttrs, true);
    if (rNode !== null) {
      setupStaticAttributes(hostRenderer, rNode, tNode);
    }
  }
}
function createRootComponent(componentView, rootComponentDef, rootDirectives, hostDirectiveDefs, rootLView, hostFeatures) {
  const rootTNode = getCurrentTNode();
  ngDevMode && assertDefined(rootTNode, "tNode should have been already created");
  const tView = rootLView[TVIEW];
  const native = getNativeByTNode(rootTNode, rootLView);
  initializeDirectives(tView, rootLView, rootTNode, rootDirectives, null, hostDirectiveDefs);
  for (let i = 0; i < rootDirectives.length; i++) {
    const directiveIndex = rootTNode.directiveStart + i;
    const directiveInstance = getNodeInjectable(rootLView, tView, directiveIndex, rootTNode);
    attachPatchData(directiveInstance, rootLView);
  }
  invokeDirectivesHostBindings(tView, rootLView, rootTNode);
  if (native) {
    attachPatchData(native, rootLView);
  }
  ngDevMode && assertGreaterThan(rootTNode.componentOffset, -1, "componentOffset must be great than -1");
  const component = getNodeInjectable(rootLView, tView, rootTNode.directiveStart + rootTNode.componentOffset, rootTNode);
  componentView[CONTEXT] = rootLView[CONTEXT] = component;
  if (hostFeatures !== null) {
    for (const feature of hostFeatures) {
      feature(component, rootComponentDef);
    }
  }
  executeContentQueries(tView, rootTNode, componentView);
  return component;
}
function setRootNodeAttributes(hostRenderer, componentDef, hostRNode, rootSelectorOrNode) {
  if (rootSelectorOrNode) {
    setUpAttributes(hostRenderer, hostRNode, ["ng-version", VERSION.full]);
  } else {
    const {
      attrs,
      classes
    } = extractAttrsAndClassesFromSelector(componentDef.selectors[0]);
    if (attrs) {
      setUpAttributes(hostRenderer, hostRNode, attrs);
    }
    if (classes && classes.length > 0) {
      writeDirectClass(hostRenderer, hostRNode, classes.join(" "));
    }
  }
}
function projectNodes(tNode, ngContentSelectors, projectableNodes) {
  const projection = tNode.projection = [];
  for (let i = 0; i < ngContentSelectors.length; i++) {
    const nodesforSlot = projectableNodes[i];
    projection.push(nodesforSlot != null ? Array.from(nodesforSlot) : null);
  }
}
function LifecycleHooksFeature() {
  const tNode = getCurrentTNode();
  ngDevMode && assertDefined(tNode, "TNode is required");
  registerPostOrderHooks(getLView()[TVIEW], tNode);
}
function isListLikeIterable(obj) {
  if (!isJsObject(obj))
    return false;
  return Array.isArray(obj) || !(obj instanceof Map) && // JS Map are iterables but return entries as [k, v]
  Symbol.iterator in obj;
}
function areIterablesEqual(a, b, comparator) {
  const iterator1 = a[Symbol.iterator]();
  const iterator2 = b[Symbol.iterator]();
  while (true) {
    const item1 = iterator1.next();
    const item2 = iterator2.next();
    if (item1.done && item2.done)
      return true;
    if (item1.done || item2.done)
      return false;
    if (!comparator(item1.value, item2.value))
      return false;
  }
}
function isJsObject(o) {
  return o !== null && (typeof o === "function" || typeof o === "object");
}
function devModeEqual(a, b) {
  const isListLikeIterableA = isListLikeIterable(a);
  const isListLikeIterableB = isListLikeIterable(b);
  if (isListLikeIterableA && isListLikeIterableB) {
    return areIterablesEqual(a, b, devModeEqual);
  } else {
    const isAObject = a && (typeof a === "object" || typeof a === "function");
    const isBObject = b && (typeof b === "object" || typeof b === "function");
    if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
      return true;
    } else {
      return Object.is(a, b);
    }
  }
}
function bindingUpdated(lView, bindingIndex, value) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
  ngDevMode && assertLessThan(bindingIndex, lView.length, `Slot should have been initialized to NO_CHANGE`);
  const oldValue = lView[bindingIndex];
  if (Object.is(oldValue, value)) {
    return false;
  } else {
    if (ngDevMode && isInCheckNoChangesMode()) {
      const oldValueToCompare = oldValue !== NO_CHANGE ? oldValue : void 0;
      if (!devModeEqual(oldValueToCompare, value)) {
        const details = getExpressionChangedErrorDetails(lView, bindingIndex, oldValueToCompare, value);
        throwErrorIfNoChangesMode(oldValue === NO_CHANGE, details.oldValue, details.newValue, details.propName);
      }
      return false;
    }
    lView[bindingIndex] = value;
    return true;
  }
}
function \u0275\u0275attribute(name, value, sanitizer, namespace) {
  const lView = getLView();
  const bindingIndex = nextBindingIndex();
  if (bindingUpdated(lView, bindingIndex, value)) {
    const tView = getTView();
    const tNode = getSelectedTNode();
    elementAttributeInternal(tNode, lView, name, value, sanitizer, namespace);
    ngDevMode && storePropertyBindingMetadata(tView.data, tNode, "attr." + name, bindingIndex);
  }
  return \u0275\u0275attribute;
}
function detectChanges(component) {
  const view = getComponentViewByInstance(component);
  detectChangesInternal(view[TVIEW], view, component);
}
function setDirectiveInputsWhichShadowsStyling(tView, tNode, lView, value, isClassBased) {
  const inputs = tNode.inputs;
  const property = isClassBased ? "class" : "style";
  setInputsForProperty(tView, lView, inputs[property], property, value);
}
function elementStartFirstCreatePass(index, tView, lView, name, attrsIndex, localRefsIndex) {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && ngDevMode.firstCreatePass++;
  const tViewConsts = tView.consts;
  const attrs = getConstant(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(tView, index, 2, name, attrs);
  resolveDirectives(tView, lView, tNode, getConstant(tViewConsts, localRefsIndex));
  if (tNode.attrs !== null) {
    computeStaticStyling(tNode, tNode.attrs, false);
  }
  if (tNode.mergedAttrs !== null) {
    computeStaticStyling(tNode, tNode.mergedAttrs, true);
  }
  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }
  return tNode;
}
function \u0275\u0275elementStart(index, name, attrsIndex, localRefsIndex) {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = HEADER_OFFSET + index;
  ngDevMode && assertEqual(getBindingIndex(), tView.bindingStartIndex, "elements should be created before any bindings");
  ngDevMode && assertIndexInRange(lView, adjustedIndex);
  const renderer = lView[RENDERER];
  const tNode = tView.firstCreatePass ? elementStartFirstCreatePass(adjustedIndex, tView, lView, name, attrsIndex, localRefsIndex) : tView.data[adjustedIndex];
  const native = lView[adjustedIndex] = createElementNode(renderer, name, getNamespace$1());
  const hasDirectives = isDirectiveHost(tNode);
  if (ngDevMode && tView.firstCreatePass) {
    validateElementIsKnown(native, lView, tNode.value, tView.schemas, hasDirectives);
  }
  setCurrentTNode(tNode, true);
  setupStaticAttributes(renderer, native, tNode);
  if ((tNode.flags & 32) !== 32) {
    appendChild(tView, lView, native, tNode);
  }
  if (getElementDepthCount() === 0) {
    attachPatchData(native, lView);
  }
  increaseElementDepthCount();
  if (hasDirectives) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }
  if (localRefsIndex !== null) {
    saveResolvedLocalsInData(lView, tNode);
  }
  return \u0275\u0275elementStart;
}
function \u0275\u0275elementEnd() {
  let currentTNode = getCurrentTNode();
  ngDevMode && assertDefined(currentTNode, "No parent node to close.");
  if (isCurrentTNodeParent()) {
    setCurrentTNodeAsNotParent();
  } else {
    ngDevMode && assertHasParent(getCurrentTNode());
    currentTNode = currentTNode.parent;
    setCurrentTNode(currentTNode, false);
  }
  const tNode = currentTNode;
  ngDevMode && assertTNodeType(
    tNode,
    3
    /* TNodeType.AnyRNode */
  );
  decreaseElementDepthCount();
  const tView = getTView();
  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, currentTNode);
    if (isContentQueryHost(currentTNode)) {
      tView.queries.elementEnd(currentTNode);
    }
  }
  if (tNode.classesWithoutHost != null && hasClassInput(tNode)) {
    setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.classesWithoutHost, true);
  }
  if (tNode.stylesWithoutHost != null && hasStyleInput(tNode)) {
    setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.stylesWithoutHost, false);
  }
  return \u0275\u0275elementEnd;
}
function \u0275\u0275element(index, name, attrsIndex, localRefsIndex) {
  \u0275\u0275elementStart(index, name, attrsIndex, localRefsIndex);
  \u0275\u0275elementEnd();
  return \u0275\u0275element;
}
function isPromise2(obj) {
  return !!obj && typeof obj.then === "function";
}
function isSubscribable(obj) {
  return !!obj && typeof obj.subscribe === "function";
}
var isObservable = isSubscribable;
function \u0275\u0275listener(eventName, listenerFn, useCapture, eventTargetResolver) {
  const lView = getLView();
  const tView = getTView();
  const tNode = getCurrentTNode();
  listenerInternal(tView, lView, lView[RENDERER], tNode, eventName, listenerFn, eventTargetResolver);
  return \u0275\u0275listener;
}
function findExistingListener(tView, lView, eventName, tNodeIdx) {
  const tCleanup = tView.cleanup;
  if (tCleanup != null) {
    for (let i = 0; i < tCleanup.length - 1; i += 2) {
      const cleanupEventName = tCleanup[i];
      if (cleanupEventName === eventName && tCleanup[i + 1] === tNodeIdx) {
        const lCleanup = lView[CLEANUP];
        const listenerIdxInLCleanup = tCleanup[i + 2];
        return lCleanup.length > listenerIdxInLCleanup ? lCleanup[listenerIdxInLCleanup] : null;
      }
      if (typeof cleanupEventName === "string") {
        i += 2;
      }
    }
  }
  return null;
}
function listenerInternal(tView, lView, renderer, tNode, eventName, listenerFn, eventTargetResolver) {
  const isTNodeDirectiveHost = isDirectiveHost(tNode);
  const firstCreatePass = tView.firstCreatePass;
  const tCleanup = firstCreatePass && getOrCreateTViewCleanup(tView);
  const context2 = lView[CONTEXT];
  const lCleanup = getOrCreateLViewCleanup(lView);
  ngDevMode && assertTNodeType(
    tNode,
    3 | 12
    /* TNodeType.AnyContainer */
  );
  let processOutputs = true;
  if (tNode.type & 3 || eventTargetResolver) {
    const native = getNativeByTNode(tNode, lView);
    const target = eventTargetResolver ? eventTargetResolver(native) : native;
    const lCleanupIndex = lCleanup.length;
    const idxOrTargetGetter = eventTargetResolver ? (_lView) => eventTargetResolver(unwrapRNode(_lView[tNode.index])) : tNode.index;
    let existingListener = null;
    if (!eventTargetResolver && isTNodeDirectiveHost) {
      existingListener = findExistingListener(tView, lView, eventName, tNode.index);
    }
    if (existingListener !== null) {
      const lastListenerFn = existingListener.__ngLastListenerFn__ || existingListener;
      lastListenerFn.__ngNextListenerFn__ = listenerFn;
      existingListener.__ngLastListenerFn__ = listenerFn;
      processOutputs = false;
    } else {
      listenerFn = wrapListener(
        tNode,
        lView,
        context2,
        listenerFn,
        false
        /** preventDefault */
      );
      const cleanupFn = renderer.listen(target, eventName, listenerFn);
      ngDevMode && ngDevMode.rendererAddEventListener++;
      lCleanup.push(listenerFn, cleanupFn);
      tCleanup && tCleanup.push(eventName, idxOrTargetGetter, lCleanupIndex, lCleanupIndex + 1);
    }
  } else {
    listenerFn = wrapListener(
      tNode,
      lView,
      context2,
      listenerFn,
      false
      /** preventDefault */
    );
  }
  const outputs = tNode.outputs;
  let props;
  if (processOutputs && outputs !== null && (props = outputs[eventName])) {
    const propsLength = props.length;
    if (propsLength) {
      for (let i = 0; i < propsLength; i += 2) {
        const index = props[i];
        ngDevMode && assertIndexInRange(lView, index);
        const minifiedName = props[i + 1];
        const directiveInstance = lView[index];
        const output = directiveInstance[minifiedName];
        if (ngDevMode && !isObservable(output)) {
          throw new Error(`@Output ${minifiedName} not initialized in '${directiveInstance.constructor.name}'.`);
        }
        const subscription = output.subscribe(listenerFn);
        const idx = lCleanup.length;
        lCleanup.push(listenerFn, subscription);
        tCleanup && tCleanup.push(eventName, tNode.index, idx, -(idx + 1));
      }
    }
  }
}
function executeListenerWithErrorHandling(lView, context2, listenerFn, e) {
  try {
    profiler(6, context2, listenerFn);
    return listenerFn(e) !== false;
  } catch (error) {
    handleError(lView, error);
    return false;
  } finally {
    profiler(7, context2, listenerFn);
  }
}
function wrapListener(tNode, lView, context2, listenerFn, wrapWithPreventDefault) {
  return function wrapListenerIn_markDirtyAndPreventDefault(e) {
    if (e === Function) {
      return listenerFn;
    }
    const startView = tNode.componentOffset > -1 ? getComponentLViewByIndex(tNode.index, lView) : lView;
    markViewDirty(startView);
    let result = executeListenerWithErrorHandling(lView, context2, listenerFn, e);
    let nextListenerFn = wrapListenerIn_markDirtyAndPreventDefault.__ngNextListenerFn__;
    while (nextListenerFn) {
      result = executeListenerWithErrorHandling(lView, context2, nextListenerFn, e) && result;
      nextListenerFn = nextListenerFn.__ngNextListenerFn__;
    }
    if (wrapWithPreventDefault && result === false) {
      e.preventDefault();
      e.returnValue = false;
    }
    return result;
  };
}
function \u0275\u0275text(index, value = "") {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = index + HEADER_OFFSET;
  ngDevMode && assertEqual(getBindingIndex(), tView.bindingStartIndex, "text nodes should be created before any bindings");
  ngDevMode && assertIndexInRange(lView, adjustedIndex);
  const tNode = tView.firstCreatePass ? getOrCreateTNode(tView, adjustedIndex, 1, value, null) : tView.data[adjustedIndex];
  const textNative = lView[adjustedIndex] = createTextNode(lView[RENDERER], value);
  appendChild(tView, lView, textNative, tNode);
  setCurrentTNode(tNode, false);
}
if (false) {
  /* @__PURE__ */ (function() {
    _global["ngI18nClosureMode"] = // TODO(FW-1250): validate that this actually, you know, works.
    // tslint:disable-next-line:no-toplevel-property-access
    typeof goog !== "undefined" && typeof goog.getMsg === "function";
  })();
}
var DEFAULT_LOCALE_ID = "en-US";
var LOCALE_ID$1 = DEFAULT_LOCALE_ID;
function setLocaleId(localeId) {
  assertDefined(localeId, `Expected localeId to be defined`);
  if (typeof localeId === "string") {
    LOCALE_ID$1 = localeId.toLowerCase().replace(/_/g, "-");
  }
}
var NgModuleRef$1 = class {
};
var NgModuleFactory$1 = class {
};
var NgModuleRef = class extends NgModuleRef$1 {
  constructor(ngModuleType, _parent) {
    super();
    this._parent = _parent;
    this._bootstrapComponents = [];
    this.destroyCbs = [];
    this.componentFactoryResolver = new ComponentFactoryResolver(this);
    const ngModuleDef = getNgModuleDef(ngModuleType);
    ngDevMode && assertDefined(ngModuleDef, `NgModule '${stringify(ngModuleType)}' is not a subtype of 'NgModuleType'.`);
    this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
    this._r3Injector = createInjectorWithoutInjectorInstances(ngModuleType, _parent, [{
      provide: NgModuleRef$1,
      useValue: this
    }, {
      provide: ComponentFactoryResolver$1,
      useValue: this.componentFactoryResolver
    }], stringify(ngModuleType), /* @__PURE__ */ new Set(["environment"]));
    this._r3Injector.resolveInjectorInitializers();
    this.instance = this._r3Injector.get(ngModuleType);
  }
  get injector() {
    return this._r3Injector;
  }
  destroy() {
    ngDevMode && assertDefined(this.destroyCbs, "NgModule already destroyed");
    const injector = this._r3Injector;
    !injector.destroyed && injector.destroy();
    this.destroyCbs.forEach((fn) => fn());
    this.destroyCbs = null;
  }
  onDestroy(callback) {
    ngDevMode && assertDefined(this.destroyCbs, "NgModule already destroyed");
    this.destroyCbs.push(callback);
  }
};
var NgModuleFactory = class extends NgModuleFactory$1 {
  constructor(moduleType) {
    super();
    this.moduleType = moduleType;
  }
  create(parentInjector) {
    return new NgModuleRef(this.moduleType, parentInjector);
  }
};
var EnvironmentNgModuleRefAdapter = class extends NgModuleRef$1 {
  constructor(providers, parent, source) {
    super();
    this.componentFactoryResolver = new ComponentFactoryResolver(this);
    this.instance = null;
    const injector = new R3Injector([...providers, {
      provide: NgModuleRef$1,
      useValue: this
    }, {
      provide: ComponentFactoryResolver$1,
      useValue: this.componentFactoryResolver
    }], parent || getNullInjector(), source, /* @__PURE__ */ new Set(["environment"]));
    this.injector = injector;
    injector.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(callback) {
    this.injector.onDestroy(callback);
  }
};
function createEnvironmentInjector(providers, parent, debugName = null) {
  const adapter = new EnvironmentNgModuleRefAdapter(providers, parent, debugName);
  return adapter.injector;
}
var StandaloneService = /* @__PURE__ */ (() => {
  class StandaloneService2 {
    constructor(_injector) {
      this._injector = _injector;
      this.cachedInjectors = /* @__PURE__ */ new Map();
    }
    getOrCreateStandaloneInjector(componentDef) {
      if (!componentDef.standalone) {
        return null;
      }
      if (!this.cachedInjectors.has(componentDef.id)) {
        const providers = internalImportProvidersFrom(false, componentDef.type);
        const standaloneInjector = providers.length > 0 ? createEnvironmentInjector([providers], this._injector, `Standalone[${componentDef.type.name}]`) : null;
        this.cachedInjectors.set(componentDef.id, standaloneInjector);
      }
      return this.cachedInjectors.get(componentDef.id);
    }
    ngOnDestroy() {
      try {
        for (const injector of this.cachedInjectors.values()) {
          if (injector !== null) {
            injector.destroy();
          }
        }
      } finally {
        this.cachedInjectors.clear();
      }
    }
  }
  StandaloneService2.\u0275prov = \u0275\u0275defineInjectable({
    token: StandaloneService2,
    providedIn: "environment",
    factory: () => new StandaloneService2(\u0275\u0275inject(EnvironmentInjector))
  });
  return StandaloneService2;
})();
function \u0275\u0275StandaloneFeature(definition) {
  definition.getStandaloneInjector = (parentInjector) => {
    return parentInjector.get(StandaloneService).getOrCreateStandaloneInjector(definition);
  };
}
function getComponent(element) {
  ngDevMode && assertDomElement(element);
  const context2 = getLContext(element);
  if (context2 === null)
    return null;
  if (context2.component === void 0) {
    const lView = context2.lView;
    if (lView === null) {
      return null;
    }
    context2.component = getComponentAtNodeIndex(context2.nodeIndex, lView);
  }
  return context2.component;
}
function getContext(element) {
  assertDomElement(element);
  const context2 = getLContext(element);
  const lView = context2 ? context2.lView : null;
  return lView === null ? null : lView[CONTEXT];
}
function getOwningComponent(elementOrDir) {
  const context2 = getLContext(elementOrDir);
  let lView = context2 ? context2.lView : null;
  if (lView === null)
    return null;
  let parent;
  while (lView[TVIEW].type === 2 && (parent = getLViewParent(lView))) {
    lView = parent;
  }
  return lView[FLAGS] & 256 ? null : lView[CONTEXT];
}
function getRootComponents(elementOrDir) {
  const lView = readPatchedLView(elementOrDir);
  return lView !== null ? [getRootContext(lView)] : [];
}
function getInjector(elementOrDir) {
  const context2 = getLContext(elementOrDir);
  const lView = context2 ? context2.lView : null;
  if (lView === null)
    return Injector.NULL;
  const tNode = lView[TVIEW].data[context2.nodeIndex];
  return new NodeInjector(tNode, lView);
}
function getDirectives(node) {
  if (node instanceof Text) {
    return [];
  }
  const context2 = getLContext(node);
  const lView = context2 ? context2.lView : null;
  if (lView === null) {
    return [];
  }
  const tView = lView[TVIEW];
  const nodeIndex = context2.nodeIndex;
  if (!tView?.data[nodeIndex]) {
    return [];
  }
  if (context2.directives === void 0) {
    context2.directives = getDirectivesAtNodeIndex(nodeIndex, lView);
  }
  return context2.directives === null ? [] : [...context2.directives];
}
function getDirectiveMetadata$1(directiveOrComponentInstance) {
  const {
    constructor
  } = directiveOrComponentInstance;
  if (!constructor) {
    throw new Error("Unable to find the instance constructor");
  }
  const componentDef = getComponentDef(constructor);
  if (componentDef) {
    return {
      inputs: componentDef.inputs,
      outputs: componentDef.outputs,
      encapsulation: componentDef.encapsulation,
      changeDetection: componentDef.onPush ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
    };
  }
  const directiveDef = getDirectiveDef(constructor);
  if (directiveDef) {
    return {
      inputs: directiveDef.inputs,
      outputs: directiveDef.outputs
    };
  }
  return null;
}
function getHostElement(componentOrDirective) {
  return getLContext(componentOrDirective).native;
}
function getListeners(element) {
  ngDevMode && assertDomElement(element);
  const lContext = getLContext(element);
  const lView = lContext === null ? null : lContext.lView;
  if (lView === null)
    return [];
  const tView = lView[TVIEW];
  const lCleanup = lView[CLEANUP];
  const tCleanup = tView.cleanup;
  const listeners = [];
  if (tCleanup && lCleanup) {
    for (let i = 0; i < tCleanup.length; ) {
      const firstParam = tCleanup[i++];
      const secondParam = tCleanup[i++];
      if (typeof firstParam === "string") {
        const name = firstParam;
        const listenerElement = unwrapRNode(lView[secondParam]);
        const callback = lCleanup[tCleanup[i++]];
        const useCaptureOrIndx = tCleanup[i++];
        const type = typeof useCaptureOrIndx === "boolean" || useCaptureOrIndx >= 0 ? "dom" : "output";
        const useCapture = typeof useCaptureOrIndx === "boolean" ? useCaptureOrIndx : false;
        if (element == listenerElement) {
          listeners.push({
            element,
            name,
            callback,
            useCapture,
            type
          });
        }
      }
    }
  }
  listeners.sort(sortListeners);
  return listeners;
}
function sortListeners(a, b) {
  if (a.name == b.name)
    return 0;
  return a.name < b.name ? -1 : 1;
}
function assertDomElement(value) {
  if (typeof Element !== "undefined" && !(value instanceof Element)) {
    throw new Error("Expecting instance of DOM Element");
  }
}
var EventEmitter_ = class extends Subject {
  constructor(isAsync = false) {
    super();
    this.__isAsync = isAsync;
  }
  emit(value) {
    super.next(value);
  }
  subscribe(observerOrNext, error, complete) {
    let nextFn = observerOrNext;
    let errorFn = error || (() => null);
    let completeFn = complete;
    if (observerOrNext && typeof observerOrNext === "object") {
      const observer = observerOrNext;
      nextFn = observer.next?.bind(observer);
      errorFn = observer.error?.bind(observer);
      completeFn = observer.complete?.bind(observer);
    }
    if (this.__isAsync) {
      errorFn = _wrapInTimeout(errorFn);
      if (nextFn) {
        nextFn = _wrapInTimeout(nextFn);
      }
      if (completeFn) {
        completeFn = _wrapInTimeout(completeFn);
      }
    }
    const sink = super.subscribe({
      next: nextFn,
      error: errorFn,
      complete: completeFn
    });
    if (observerOrNext instanceof Subscription) {
      observerOrNext.add(sink);
    }
    return sink;
  }
};
function _wrapInTimeout(fn) {
  return (value) => {
    setTimeout(fn, void 0, value);
  };
}
var EventEmitter = EventEmitter_;
var ViewContainerRef = /* @__PURE__ */ (() => {
  class ViewContainerRef3 {
  }
  ViewContainerRef3.__NG_ELEMENT_ID__ = injectViewContainerRef;
  return ViewContainerRef3;
})();
function injectViewContainerRef() {
  const previousTNode = getCurrentTNode();
  return createContainerRef(previousTNode, getLView());
}
var VE_ViewContainerRef = ViewContainerRef;
var R3ViewContainerRef = class ViewContainerRef2 extends VE_ViewContainerRef {
  constructor(_lContainer, _hostTNode, _hostLView) {
    super();
    this._lContainer = _lContainer;
    this._hostTNode = _hostTNode;
    this._hostLView = _hostLView;
  }
  get element() {
    return createElementRef(this._hostTNode, this._hostLView);
  }
  get injector() {
    return new NodeInjector(this._hostTNode, this._hostLView);
  }
  /** @deprecated No replacement */
  get parentInjector() {
    const parentLocation = getParentInjectorLocation(this._hostTNode, this._hostLView);
    if (hasParentInjector(parentLocation)) {
      const parentView = getParentInjectorView(parentLocation, this._hostLView);
      const injectorIndex = getParentInjectorIndex(parentLocation);
      ngDevMode && assertNodeInjector(parentView, injectorIndex);
      const parentTNode = parentView[TVIEW].data[
        injectorIndex + 8
        /* NodeInjectorOffset.TNODE */
      ];
      return new NodeInjector(parentTNode, parentView);
    } else {
      return new NodeInjector(null, this._hostLView);
    }
  }
  clear() {
    while (this.length > 0) {
      this.remove(this.length - 1);
    }
  }
  get(index) {
    const viewRefs = getViewRefs(this._lContainer);
    return viewRefs !== null && viewRefs[index] || null;
  }
  get length() {
    return this._lContainer.length - CONTAINER_HEADER_OFFSET;
  }
  createEmbeddedView(templateRef, context2, indexOrOptions) {
    let index;
    let injector;
    if (typeof indexOrOptions === "number") {
      index = indexOrOptions;
    } else if (indexOrOptions != null) {
      index = indexOrOptions.index;
      injector = indexOrOptions.injector;
    }
    const viewRef = templateRef.createEmbeddedView(context2 || {}, injector);
    this.insert(viewRef, index);
    return viewRef;
  }
  createComponent(componentFactoryOrType, indexOrOptions, injector, projectableNodes, environmentInjector) {
    const isComponentFactory = componentFactoryOrType && !isType(componentFactoryOrType);
    let index;
    if (isComponentFactory) {
      if (ngDevMode) {
        assertEqual(typeof indexOrOptions !== "object", true, "It looks like Component factory was provided as the first argument and an options object as the second argument. This combination of arguments is incompatible. You can either change the first argument to provide Component type or change the second argument to be a number (representing an index at which to insert the new component's host view into this container)");
      }
      index = indexOrOptions;
    } else {
      if (ngDevMode) {
        assertDefined(getComponentDef(componentFactoryOrType), `Provided Component class doesn't contain Component definition. Please check whether provided class has @Component decorator.`);
        assertEqual(typeof indexOrOptions !== "number", true, "It looks like Component type was provided as the first argument and a number (representing an index at which to insert the new component's host view into this container as the second argument. This combination of arguments is incompatible. Please use an object as the second argument instead.");
      }
      const options = indexOrOptions || {};
      if (ngDevMode && options.environmentInjector && options.ngModuleRef) {
        throwError2(`Cannot pass both environmentInjector and ngModuleRef options to createComponent().`);
      }
      index = options.index;
      injector = options.injector;
      projectableNodes = options.projectableNodes;
      environmentInjector = options.environmentInjector || options.ngModuleRef;
    }
    const componentFactory = isComponentFactory ? componentFactoryOrType : new ComponentFactory(getComponentDef(componentFactoryOrType));
    const contextInjector = injector || this.parentInjector;
    if (!environmentInjector && componentFactory.ngModule == null) {
      const _injector = isComponentFactory ? contextInjector : this.parentInjector;
      const result = _injector.get(EnvironmentInjector, null);
      if (result) {
        environmentInjector = result;
      }
    }
    const componentRef = componentFactory.create(contextInjector, projectableNodes, void 0, environmentInjector);
    this.insert(componentRef.hostView, index);
    return componentRef;
  }
  insert(viewRef, index) {
    const lView = viewRef._lView;
    const tView = lView[TVIEW];
    if (ngDevMode && viewRef.destroyed) {
      throw new Error("Cannot insert a destroyed View in a ViewContainer!");
    }
    if (viewAttachedToContainer(lView)) {
      const prevIdx = this.indexOf(viewRef);
      if (prevIdx !== -1) {
        this.detach(prevIdx);
      } else {
        const prevLContainer = lView[PARENT];
        ngDevMode && assertEqual(isLContainer(prevLContainer), true, "An attached view should have its PARENT point to a container.");
        const prevVCRef = new R3ViewContainerRef(prevLContainer, prevLContainer[T_HOST], prevLContainer[PARENT]);
        prevVCRef.detach(prevVCRef.indexOf(viewRef));
      }
    }
    const adjustedIdx = this._adjustIndex(index);
    const lContainer = this._lContainer;
    insertView(tView, lView, lContainer, adjustedIdx);
    const beforeNode = getBeforeNodeForView(adjustedIdx, lContainer);
    const renderer = lView[RENDERER];
    const parentRNode = nativeParentNode(renderer, lContainer[NATIVE]);
    if (parentRNode !== null) {
      addViewToContainer(tView, lContainer[T_HOST], renderer, lView, parentRNode, beforeNode);
    }
    viewRef.attachToViewContainerRef();
    addToArray(getOrCreateViewRefs(lContainer), adjustedIdx, viewRef);
    return viewRef;
  }
  move(viewRef, newIndex) {
    if (ngDevMode && viewRef.destroyed) {
      throw new Error("Cannot move a destroyed View in a ViewContainer!");
    }
    return this.insert(viewRef, newIndex);
  }
  indexOf(viewRef) {
    const viewRefsArr = getViewRefs(this._lContainer);
    return viewRefsArr !== null ? viewRefsArr.indexOf(viewRef) : -1;
  }
  remove(index) {
    const adjustedIdx = this._adjustIndex(index, -1);
    const detachedView = detachView(this._lContainer, adjustedIdx);
    if (detachedView) {
      removeFromArray(getOrCreateViewRefs(this._lContainer), adjustedIdx);
      destroyLView(detachedView[TVIEW], detachedView);
    }
  }
  detach(index) {
    const adjustedIdx = this._adjustIndex(index, -1);
    const view = detachView(this._lContainer, adjustedIdx);
    const wasDetached = view && removeFromArray(getOrCreateViewRefs(this._lContainer), adjustedIdx) != null;
    return wasDetached ? new ViewRef$1(view) : null;
  }
  _adjustIndex(index, shift = 0) {
    if (index == null) {
      return this.length + shift;
    }
    if (ngDevMode) {
      assertGreaterThan(index, -1, `ViewRef index must be positive, got ${index}`);
      assertLessThan(index, this.length + 1 + shift, "index");
    }
    return index;
  }
};
function getViewRefs(lContainer) {
  return lContainer[VIEW_REFS];
}
function getOrCreateViewRefs(lContainer) {
  return lContainer[VIEW_REFS] || (lContainer[VIEW_REFS] = []);
}
function createContainerRef(hostTNode, hostLView) {
  ngDevMode && assertTNodeType(
    hostTNode,
    12 | 3
    /* TNodeType.AnyRNode */
  );
  let lContainer;
  const slotValue = hostLView[hostTNode.index];
  if (isLContainer(slotValue)) {
    lContainer = slotValue;
  } else {
    let commentNode;
    if (hostTNode.type & 8) {
      commentNode = unwrapRNode(slotValue);
    } else {
      const renderer = hostLView[RENDERER];
      ngDevMode && ngDevMode.rendererCreateComment++;
      commentNode = renderer.createComment(ngDevMode ? "container" : "");
      const hostNative = getNativeByTNode(hostTNode, hostLView);
      const parentOfHostNative = nativeParentNode(renderer, hostNative);
      nativeInsertBefore(renderer, parentOfHostNative, commentNode, nativeNextSibling(renderer, hostNative), false);
    }
    hostLView[hostTNode.index] = lContainer = createLContainer(slotValue, hostLView, commentNode, hostTNode);
    addToViewTree(hostLView, lContainer);
  }
  return new R3ViewContainerRef(lContainer, hostTNode, hostLView);
}
var jitOptions = null;
function setJitOptions(options) {
  if (jitOptions !== null) {
    if (options.defaultEncapsulation !== jitOptions.defaultEncapsulation) {
      ngDevMode && console.error("Provided value for `defaultEncapsulation` can not be changed once it has been set.");
      return;
    }
    if (options.preserveWhitespaces !== jitOptions.preserveWhitespaces) {
      ngDevMode && console.error("Provided value for `preserveWhitespaces` can not be changed once it has been set.");
      return;
    }
  }
  jitOptions = options;
}
function isNgModule(value) {
  return !!getNgModuleDef(value);
}
function noop2(...args) {
}
var APP_INITIALIZER = /* @__PURE__ */ new InjectionToken("Application Initializer");
var ApplicationInitStatus = /* @__PURE__ */ (() => {
  class ApplicationInitStatus2 {
    constructor(appInits) {
      this.appInits = appInits;
      this.resolve = noop2;
      this.reject = noop2;
      this.initialized = false;
      this.done = false;
      this.donePromise = new Promise((res, rej) => {
        this.resolve = res;
        this.reject = rej;
      });
    }
    /** @internal */
    runInitializers() {
      if (this.initialized) {
        return;
      }
      const asyncInitPromises = [];
      const complete = () => {
        this.done = true;
        this.resolve();
      };
      if (this.appInits) {
        for (let i = 0; i < this.appInits.length; i++) {
          const initResult = this.appInits[i]();
          if (isPromise2(initResult)) {
            asyncInitPromises.push(initResult);
          } else if (isObservable(initResult)) {
            const observableAsPromise = new Promise((resolve, reject) => {
              initResult.subscribe({
                complete: resolve,
                error: reject
              });
            });
            asyncInitPromises.push(observableAsPromise);
          }
        }
      }
      Promise.all(asyncInitPromises).then(() => {
        complete();
      }).catch((e) => {
        this.reject(e);
      });
      if (asyncInitPromises.length === 0) {
        complete();
      }
      this.initialized = true;
    }
  }
  ApplicationInitStatus2.\u0275fac = function ApplicationInitStatus_Factory(t) {
    return new (t || ApplicationInitStatus2)(\u0275\u0275inject(APP_INITIALIZER, 8));
  };
  ApplicationInitStatus2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: ApplicationInitStatus2,
    factory: ApplicationInitStatus2.\u0275fac,
    providedIn: "root"
  });
  return ApplicationInitStatus2;
})();
var APP_ID = /* @__PURE__ */ new InjectionToken("AppId", {
  providedIn: "root",
  factory: _appIdRandomProviderFactory
});
function _appIdRandomProviderFactory() {
  return `${_randomChar()}${_randomChar()}${_randomChar()}`;
}
function _randomChar() {
  return String.fromCharCode(97 + Math.floor(Math.random() * 25));
}
var PLATFORM_INITIALIZER = /* @__PURE__ */ new InjectionToken("Platform Initializer");
var PLATFORM_ID = /* @__PURE__ */ new InjectionToken("Platform ID", {
  providedIn: "platform",
  factory: () => "unknown"
  // set a default platform name, when none set explicitly
});
var Console = /* @__PURE__ */ (() => {
  class Console2 {
    log(message) {
      console.log(message);
    }
    // Note: for reporting errors use `DOM.logError()` as it is platform specific
    warn(message) {
      console.warn(message);
    }
  }
  Console2.\u0275fac = function Console_Factory(t) {
    return new (t || Console2)();
  };
  Console2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: Console2,
    factory: Console2.\u0275fac,
    providedIn: "platform"
  });
  return Console2;
})();
function getGlobalLocale() {
  if (false) {
    return goog.LOCALE;
  } else {
    return typeof $localize !== "undefined" && $localize.locale || DEFAULT_LOCALE_ID;
  }
}
var LOCALE_ID = /* @__PURE__ */ new InjectionToken("LocaleId", {
  providedIn: "root",
  factory: () => inject(LOCALE_ID, InjectFlags.Optional | InjectFlags.SkipSelf) || getGlobalLocale()
});
var ModuleWithComponentFactories = class {
  constructor(ngModuleFactory, componentFactories) {
    this.ngModuleFactory = ngModuleFactory;
    this.componentFactories = componentFactories;
  }
};
var Compiler = /* @__PURE__ */ (() => {
  class Compiler2 {
    /**
     * Compiles the given NgModule and all of its components. All templates of the components listed
     * in `entryComponents` have to be inlined.
     */
    compileModuleSync(moduleType) {
      return new NgModuleFactory(moduleType);
    }
    /**
     * Compiles the given NgModule and all of its components
     */
    compileModuleAsync(moduleType) {
      return Promise.resolve(this.compileModuleSync(moduleType));
    }
    /**
     * Same as {@link #compileModuleSync} but also creates ComponentFactories for all components.
     */
    compileModuleAndAllComponentsSync(moduleType) {
      const ngModuleFactory = this.compileModuleSync(moduleType);
      const moduleDef = getNgModuleDef(moduleType);
      const componentFactories = maybeUnwrapFn(moduleDef.declarations).reduce((factories, declaration) => {
        const componentDef = getComponentDef(declaration);
        componentDef && factories.push(new ComponentFactory(componentDef));
        return factories;
      }, []);
      return new ModuleWithComponentFactories(ngModuleFactory, componentFactories);
    }
    /**
     * Same as {@link #compileModuleAsync} but also creates ComponentFactories for all components.
     */
    compileModuleAndAllComponentsAsync(moduleType) {
      return Promise.resolve(this.compileModuleAndAllComponentsSync(moduleType));
    }
    /**
     * Clears all caches.
     */
    clearCache() {
    }
    /**
     * Clears the cache for the given component/ngModule.
     */
    clearCacheFor(type) {
    }
    /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     */
    getModuleId(moduleType) {
      return void 0;
    }
  }
  Compiler2.\u0275fac = function Compiler_Factory(t) {
    return new (t || Compiler2)();
  };
  Compiler2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: Compiler2,
    factory: Compiler2.\u0275fac,
    providedIn: "root"
  });
  return Compiler2;
})();
var COMPILER_OPTIONS = /* @__PURE__ */ new InjectionToken("compilerOptions");
function applyChanges(component) {
  ngDevMode && assertDefined(component, "component");
  markViewDirty(getComponentViewByInstance(component));
  getRootComponents(component).forEach((rootComponent) => detectChanges(rootComponent));
}
var GLOBAL_PUBLISH_EXPANDO_KEY = "ng";
var _published = false;
function publishDefaultGlobalUtils$1() {
  if (!_published) {
    _published = true;
    publishGlobalUtil("\u0275setProfiler", setProfiler);
    publishGlobalUtil("getDirectiveMetadata", getDirectiveMetadata$1);
    publishGlobalUtil("getComponent", getComponent);
    publishGlobalUtil("getContext", getContext);
    publishGlobalUtil("getListeners", getListeners);
    publishGlobalUtil("getOwningComponent", getOwningComponent);
    publishGlobalUtil("getHostElement", getHostElement);
    publishGlobalUtil("getInjector", getInjector);
    publishGlobalUtil("getRootComponents", getRootComponents);
    publishGlobalUtil("getDirectives", getDirectives);
    publishGlobalUtil("applyChanges", applyChanges);
  }
}
function publishGlobalUtil(name, fn) {
  if (typeof COMPILED === "undefined" || !COMPILED) {
    const w = _global;
    ngDevMode && assertDefined(fn, "function not defined");
    if (w) {
      let container = w[GLOBAL_PUBLISH_EXPANDO_KEY];
      if (!container) {
        container = w[GLOBAL_PUBLISH_EXPANDO_KEY] = {};
      }
      container[name] = fn;
    }
  }
}
var promise = /* @__PURE__ */ (() => Promise.resolve(0))();
function scheduleMicroTask(fn) {
  if (typeof Zone === "undefined") {
    promise.then(() => {
      fn && fn.apply(null, null);
    });
  } else {
    Zone.current.scheduleMicroTask("scheduleMicrotask", fn);
  }
}
function getNativeRequestAnimationFrame() {
  let nativeRequestAnimationFrame = _global["requestAnimationFrame"];
  let nativeCancelAnimationFrame = _global["cancelAnimationFrame"];
  if (typeof Zone !== "undefined" && nativeRequestAnimationFrame && nativeCancelAnimationFrame) {
    const unpatchedRequestAnimationFrame = nativeRequestAnimationFrame[Zone.__symbol__("OriginalDelegate")];
    if (unpatchedRequestAnimationFrame) {
      nativeRequestAnimationFrame = unpatchedRequestAnimationFrame;
    }
    const unpatchedCancelAnimationFrame = nativeCancelAnimationFrame[Zone.__symbol__("OriginalDelegate")];
    if (unpatchedCancelAnimationFrame) {
      nativeCancelAnimationFrame = unpatchedCancelAnimationFrame;
    }
  }
  return {
    nativeRequestAnimationFrame,
    nativeCancelAnimationFrame
  };
}
var AsyncStackTaggingZoneSpec = class {
  constructor(namePrefix, consoleAsyncStackTaggingImpl = console) {
    this.name = "asyncStackTagging for " + namePrefix;
    this.createTask = consoleAsyncStackTaggingImpl?.createTask ?? (() => null);
  }
  onScheduleTask(delegate, _current, target, task) {
    task.consoleTask = this.createTask(`Zone - ${task.source || task.type}`);
    return delegate.scheduleTask(target, task);
  }
  onInvokeTask(delegate, _currentZone, targetZone, task, applyThis, applyArgs) {
    let ret;
    if (task.consoleTask) {
      ret = task.consoleTask.run(() => delegate.invokeTask(targetZone, task, applyThis, applyArgs));
    } else {
      ret = delegate.invokeTask(targetZone, task, applyThis, applyArgs);
    }
    return ret;
  }
};
var NgZone = class {
  constructor({
    enableLongStackTrace = false,
    shouldCoalesceEventChangeDetection = false,
    shouldCoalesceRunChangeDetection = false
  }) {
    this.hasPendingMacrotasks = false;
    this.hasPendingMicrotasks = false;
    this.isStable = true;
    this.onUnstable = new EventEmitter(false);
    this.onMicrotaskEmpty = new EventEmitter(false);
    this.onStable = new EventEmitter(false);
    this.onError = new EventEmitter(false);
    if (typeof Zone == "undefined") {
      throw new RuntimeError(908, ngDevMode && `In this configuration Angular requires Zone.js`);
    }
    Zone.assertZonePatched();
    const self2 = this;
    self2._nesting = 0;
    self2._outer = self2._inner = Zone.current;
    if (ngDevMode) {
      self2._inner = self2._inner.fork(new AsyncStackTaggingZoneSpec("Angular"));
    }
    if (Zone["TaskTrackingZoneSpec"]) {
      self2._inner = self2._inner.fork(new Zone["TaskTrackingZoneSpec"]());
    }
    if (enableLongStackTrace && Zone["longStackTraceZoneSpec"]) {
      self2._inner = self2._inner.fork(Zone["longStackTraceZoneSpec"]);
    }
    self2.shouldCoalesceEventChangeDetection = !shouldCoalesceRunChangeDetection && shouldCoalesceEventChangeDetection;
    self2.shouldCoalesceRunChangeDetection = shouldCoalesceRunChangeDetection;
    self2.lastRequestAnimationFrameId = -1;
    self2.nativeRequestAnimationFrame = getNativeRequestAnimationFrame().nativeRequestAnimationFrame;
    forkInnerZoneWithAngularBehavior(self2);
  }
  static isInAngularZone() {
    return typeof Zone !== "undefined" && Zone.current.get("isAngularZone") === true;
  }
  static assertInAngularZone() {
    if (!NgZone.isInAngularZone()) {
      throw new RuntimeError(909, ngDevMode && "Expected to be in Angular Zone, but it is not!");
    }
  }
  static assertNotInAngularZone() {
    if (NgZone.isInAngularZone()) {
      throw new RuntimeError(909, ngDevMode && "Expected to not be in Angular Zone, but it is!");
    }
  }
  /**
   * Executes the `fn` function synchronously within the Angular zone and returns value returned by
   * the function.
   *
   * Running functions via `run` allows you to reenter Angular zone from a task that was executed
   * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
   *
   * Any future tasks or microtasks scheduled from within this function will continue executing from
   * within the Angular zone.
   *
   * If a synchronous error happens it will be rethrown and not reported via `onError`.
   */
  run(fn, applyThis, applyArgs) {
    return this._inner.run(fn, applyThis, applyArgs);
  }
  /**
   * Executes the `fn` function synchronously within the Angular zone as a task and returns value
   * returned by the function.
   *
   * Running functions via `run` allows you to reenter Angular zone from a task that was executed
   * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
   *
   * Any future tasks or microtasks scheduled from within this function will continue executing from
   * within the Angular zone.
   *
   * If a synchronous error happens it will be rethrown and not reported via `onError`.
   */
  runTask(fn, applyThis, applyArgs, name) {
    const zone = this._inner;
    const task = zone.scheduleEventTask("NgZoneEvent: " + name, fn, EMPTY_PAYLOAD, noop2, noop2);
    try {
      return zone.runTask(task, applyThis, applyArgs);
    } finally {
      zone.cancelTask(task);
    }
  }
  /**
   * Same as `run`, except that synchronous errors are caught and forwarded via `onError` and not
   * rethrown.
   */
  runGuarded(fn, applyThis, applyArgs) {
    return this._inner.runGuarded(fn, applyThis, applyArgs);
  }
  /**
   * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
   * the function.
   *
   * Running functions via {@link #runOutsideAngular} allows you to escape Angular's zone and do
   * work that
   * doesn't trigger Angular change-detection or is subject to Angular's error handling.
   *
   * Any future tasks or microtasks scheduled from within this function will continue executing from
   * outside of the Angular zone.
   *
   * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
   */
  runOutsideAngular(fn) {
    return this._outer.run(fn);
  }
};
var EMPTY_PAYLOAD = {};
function checkStable(zone) {
  if (zone._nesting == 0 && !zone.hasPendingMicrotasks && !zone.isStable) {
    try {
      zone._nesting++;
      zone.onMicrotaskEmpty.emit(null);
    } finally {
      zone._nesting--;
      if (!zone.hasPendingMicrotasks) {
        try {
          zone.runOutsideAngular(() => zone.onStable.emit(null));
        } finally {
          zone.isStable = true;
        }
      }
    }
  }
}
function delayChangeDetectionForEvents(zone) {
  if (zone.isCheckStableRunning || zone.lastRequestAnimationFrameId !== -1) {
    return;
  }
  zone.lastRequestAnimationFrameId = zone.nativeRequestAnimationFrame.call(_global, () => {
    if (!zone.fakeTopEventTask) {
      zone.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
        zone.lastRequestAnimationFrameId = -1;
        updateMicroTaskStatus(zone);
        zone.isCheckStableRunning = true;
        checkStable(zone);
        zone.isCheckStableRunning = false;
      }, void 0, () => {
      }, () => {
      });
    }
    zone.fakeTopEventTask.invoke();
  });
  updateMicroTaskStatus(zone);
}
function forkInnerZoneWithAngularBehavior(zone) {
  const delayChangeDetectionForEventsDelegate = () => {
    delayChangeDetectionForEvents(zone);
  };
  zone._inner = zone._inner.fork({
    name: "angular",
    properties: {
      "isAngularZone": true
    },
    onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
      try {
        onEnter(zone);
        return delegate.invokeTask(target, task, applyThis, applyArgs);
      } finally {
        if (zone.shouldCoalesceEventChangeDetection && task.type === "eventTask" || zone.shouldCoalesceRunChangeDetection) {
          delayChangeDetectionForEventsDelegate();
        }
        onLeave(zone);
      }
    },
    onInvoke: (delegate, current, target, callback, applyThis, applyArgs, source) => {
      try {
        onEnter(zone);
        return delegate.invoke(target, callback, applyThis, applyArgs, source);
      } finally {
        if (zone.shouldCoalesceRunChangeDetection) {
          delayChangeDetectionForEventsDelegate();
        }
        onLeave(zone);
      }
    },
    onHasTask: (delegate, current, target, hasTaskState) => {
      delegate.hasTask(target, hasTaskState);
      if (current === target) {
        if (hasTaskState.change == "microTask") {
          zone._hasPendingMicrotasks = hasTaskState.microTask;
          updateMicroTaskStatus(zone);
          checkStable(zone);
        } else if (hasTaskState.change == "macroTask") {
          zone.hasPendingMacrotasks = hasTaskState.macroTask;
        }
      }
    },
    onHandleError: (delegate, current, target, error) => {
      delegate.handleError(target, error);
      zone.runOutsideAngular(() => zone.onError.emit(error));
      return false;
    }
  });
}
function updateMicroTaskStatus(zone) {
  if (zone._hasPendingMicrotasks || (zone.shouldCoalesceEventChangeDetection || zone.shouldCoalesceRunChangeDetection) && zone.lastRequestAnimationFrameId !== -1) {
    zone.hasPendingMicrotasks = true;
  } else {
    zone.hasPendingMicrotasks = false;
  }
}
function onEnter(zone) {
  zone._nesting++;
  if (zone.isStable) {
    zone.isStable = false;
    zone.onUnstable.emit(null);
  }
}
function onLeave(zone) {
  zone._nesting--;
  checkStable(zone);
}
var NoopNgZone = class {
  constructor() {
    this.hasPendingMicrotasks = false;
    this.hasPendingMacrotasks = false;
    this.isStable = true;
    this.onUnstable = new EventEmitter();
    this.onMicrotaskEmpty = new EventEmitter();
    this.onStable = new EventEmitter();
    this.onError = new EventEmitter();
  }
  run(fn, applyThis, applyArgs) {
    return fn.apply(applyThis, applyArgs);
  }
  runGuarded(fn, applyThis, applyArgs) {
    return fn.apply(applyThis, applyArgs);
  }
  runOutsideAngular(fn) {
    return fn();
  }
  runTask(fn, applyThis, applyArgs, name) {
    return fn.apply(applyThis, applyArgs);
  }
};
var TESTABILITY = /* @__PURE__ */ new InjectionToken("");
var TESTABILITY_GETTER = /* @__PURE__ */ new InjectionToken("");
var Testability = /* @__PURE__ */ (() => {
  class Testability2 {
    constructor(_ngZone, registry, testabilityGetter) {
      this._ngZone = _ngZone;
      this.registry = registry;
      this._pendingCount = 0;
      this._isZoneStable = true;
      this._didWork = false;
      this._callbacks = [];
      this.taskTrackingZone = null;
      if (!_testabilityGetter) {
        setTestabilityGetter(testabilityGetter);
        testabilityGetter.addToWindow(registry);
      }
      this._watchAngularEvents();
      _ngZone.run(() => {
        this.taskTrackingZone = typeof Zone == "undefined" ? null : Zone.current.get("TaskTrackingZone");
      });
    }
    _watchAngularEvents() {
      this._ngZone.onUnstable.subscribe({
        next: () => {
          this._didWork = true;
          this._isZoneStable = false;
        }
      });
      this._ngZone.runOutsideAngular(() => {
        this._ngZone.onStable.subscribe({
          next: () => {
            NgZone.assertNotInAngularZone();
            scheduleMicroTask(() => {
              this._isZoneStable = true;
              this._runCallbacksIfReady();
            });
          }
        });
      });
    }
    /**
     * Increases the number of pending request
     * @deprecated pending requests are now tracked with zones.
     */
    increasePendingRequestCount() {
      this._pendingCount += 1;
      this._didWork = true;
      return this._pendingCount;
    }
    /**
     * Decreases the number of pending request
     * @deprecated pending requests are now tracked with zones
     */
    decreasePendingRequestCount() {
      this._pendingCount -= 1;
      if (this._pendingCount < 0) {
        throw new Error("pending async requests below zero");
      }
      this._runCallbacksIfReady();
      return this._pendingCount;
    }
    /**
     * Whether an associated application is stable
     */
    isStable() {
      return this._isZoneStable && this._pendingCount === 0 && !this._ngZone.hasPendingMacrotasks;
    }
    _runCallbacksIfReady() {
      if (this.isStable()) {
        scheduleMicroTask(() => {
          while (this._callbacks.length !== 0) {
            let cb = this._callbacks.pop();
            clearTimeout(cb.timeoutId);
            cb.doneCb(this._didWork);
          }
          this._didWork = false;
        });
      } else {
        let pending = this.getPendingTasks();
        this._callbacks = this._callbacks.filter((cb) => {
          if (cb.updateCb && cb.updateCb(pending)) {
            clearTimeout(cb.timeoutId);
            return false;
          }
          return true;
        });
        this._didWork = true;
      }
    }
    getPendingTasks() {
      if (!this.taskTrackingZone) {
        return [];
      }
      return this.taskTrackingZone.macroTasks.map((t) => {
        return {
          source: t.source,
          // From TaskTrackingZone:
          // https://github.com/angular/zone.js/blob/master/lib/zone-spec/task-tracking.ts#L40
          creationLocation: t.creationLocation,
          data: t.data
        };
      });
    }
    addCallback(cb, timeout, updateCb) {
      let timeoutId = -1;
      if (timeout && timeout > 0) {
        timeoutId = setTimeout(() => {
          this._callbacks = this._callbacks.filter((cb2) => cb2.timeoutId !== timeoutId);
          cb(this._didWork, this.getPendingTasks());
        }, timeout);
      }
      this._callbacks.push({
        doneCb: cb,
        timeoutId,
        updateCb
      });
    }
    /**
     * Wait for the application to be stable with a timeout. If the timeout is reached before that
     * happens, the callback receives a list of the macro tasks that were pending, otherwise null.
     *
     * @param doneCb The callback to invoke when Angular is stable or the timeout expires
     *    whichever comes first.
     * @param timeout Optional. The maximum time to wait for Angular to become stable. If not
     *    specified, whenStable() will wait forever.
     * @param updateCb Optional. If specified, this callback will be invoked whenever the set of
     *    pending macrotasks changes. If this callback returns true doneCb will not be invoked
     *    and no further updates will be issued.
     */
    whenStable(doneCb, timeout, updateCb) {
      if (updateCb && !this.taskTrackingZone) {
        throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
      }
      this.addCallback(doneCb, timeout, updateCb);
      this._runCallbacksIfReady();
    }
    /**
     * Get the number of pending requests
     * @deprecated pending requests are now tracked with zones
     */
    getPendingRequestCount() {
      return this._pendingCount;
    }
    /**
     * Registers an application with a testability hook so that it can be tracked.
     * @param token token of application, root element
     *
     * @internal
     */
    registerApplication(token) {
      this.registry.registerApplication(token, this);
    }
    /**
     * Unregisters an application.
     * @param token token of application, root element
     *
     * @internal
     */
    unregisterApplication(token) {
      this.registry.unregisterApplication(token);
    }
    /**
     * Find providers by name
     * @param using The root element to search from
     * @param provider The name of binding variable
     * @param exactMatch Whether using exactMatch
     */
    findProviders(using, provider, exactMatch) {
      return [];
    }
  }
  Testability2.\u0275fac = function Testability_Factory(t) {
    return new (t || Testability2)(\u0275\u0275inject(NgZone), \u0275\u0275inject(TestabilityRegistry), \u0275\u0275inject(TESTABILITY_GETTER));
  };
  Testability2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: Testability2,
    factory: Testability2.\u0275fac
  });
  return Testability2;
})();
var TestabilityRegistry = /* @__PURE__ */ (() => {
  class TestabilityRegistry2 {
    constructor() {
      this._applications = /* @__PURE__ */ new Map();
    }
    /**
     * Registers an application with a testability hook so that it can be tracked
     * @param token token of application, root element
     * @param testability Testability hook
     */
    registerApplication(token, testability) {
      this._applications.set(token, testability);
    }
    /**
     * Unregisters an application.
     * @param token token of application, root element
     */
    unregisterApplication(token) {
      this._applications.delete(token);
    }
    /**
     * Unregisters all applications
     */
    unregisterAllApplications() {
      this._applications.clear();
    }
    /**
     * Get a testability hook associated with the application
     * @param elem root element
     */
    getTestability(elem) {
      return this._applications.get(elem) || null;
    }
    /**
     * Get all registered testabilities
     */
    getAllTestabilities() {
      return Array.from(this._applications.values());
    }
    /**
     * Get all registered applications(root elements)
     */
    getAllRootElements() {
      return Array.from(this._applications.keys());
    }
    /**
     * Find testability of a node in the Tree
     * @param elem node
     * @param findInAncestors whether finding testability in ancestors if testability was not found in
     * current node
     */
    findTestabilityInTree(elem, findInAncestors = true) {
      return _testabilityGetter?.findTestabilityInTree(this, elem, findInAncestors) ?? null;
    }
  }
  TestabilityRegistry2.\u0275fac = function TestabilityRegistry_Factory(t) {
    return new (t || TestabilityRegistry2)();
  };
  TestabilityRegistry2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: TestabilityRegistry2,
    factory: TestabilityRegistry2.\u0275fac,
    providedIn: "platform"
  });
  return TestabilityRegistry2;
})();
function setTestabilityGetter(getter) {
  _testabilityGetter = getter;
}
var _testabilityGetter;
var NG_DEV_MODE = typeof ngDevMode === "undefined" || ngDevMode;
var _platformInjector = null;
var ALLOW_MULTIPLE_PLATFORMS = /* @__PURE__ */ new InjectionToken("AllowMultipleToken");
var PLATFORM_DESTROY_LISTENERS = /* @__PURE__ */ new InjectionToken("PlatformDestroyListeners");
var APP_BOOTSTRAP_LISTENER = /* @__PURE__ */ new InjectionToken("appBootstrapListener");
function compileNgModuleFactory(injector, options, moduleType) {
  ngDevMode && assertNgModuleType(moduleType);
  const moduleFactory = new NgModuleFactory(moduleType);
  if (true) {
    return Promise.resolve(moduleFactory);
  }
  const compilerOptions = injector.get(COMPILER_OPTIONS, []).concat(options);
  setJitOptions({
    defaultEncapsulation: _lastDefined(compilerOptions.map((opts) => opts.defaultEncapsulation)),
    preserveWhitespaces: _lastDefined(compilerOptions.map((opts) => opts.preserveWhitespaces))
  });
  if (isComponentResourceResolutionQueueEmpty()) {
    return Promise.resolve(moduleFactory);
  }
  const compilerProviders = _mergeArrays(compilerOptions.map((o) => o.providers));
  if (compilerProviders.length === 0) {
    return Promise.resolve(moduleFactory);
  }
  const compiler = getCompilerFacade({
    usage: 0,
    kind: "NgModule",
    type: moduleType
  });
  const compilerInjector = Injector.create({
    providers: compilerProviders
  });
  const resourceLoader = compilerInjector.get(compiler.ResourceLoader);
  return resolveComponentResources((url) => Promise.resolve(resourceLoader.get(url))).then(() => moduleFactory);
}
function publishDefaultGlobalUtils() {
  ngDevMode && publishDefaultGlobalUtils$1();
}
function isBoundToModule(cf) {
  return cf.isBoundToModule;
}
var NgProbeToken = class {
  constructor(name, token) {
    this.name = name;
    this.token = token;
  }
};
function createPlatform(injector) {
  if (_platformInjector && !_platformInjector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
    throw new RuntimeError(400, ngDevMode && "There can be only one platform. Destroy the previous one to create a new one.");
  }
  publishDefaultGlobalUtils();
  _platformInjector = injector;
  const platform = injector.get(PlatformRef);
  runPlatformInitializers(injector);
  return platform;
}
function runPlatformInitializers(injector) {
  const inits = injector.get(PLATFORM_INITIALIZER, null);
  if (inits) {
    inits.forEach((init) => init());
  }
}
function createPlatformFactory(parentPlatformFactory, name, providers = []) {
  const desc = `Platform: ${name}`;
  const marker = new InjectionToken(desc);
  return (extraProviders = []) => {
    let platform = getPlatform();
    if (!platform || platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
      const platformProviders = [...providers, ...extraProviders, {
        provide: marker,
        useValue: true
      }];
      if (parentPlatformFactory) {
        parentPlatformFactory(platformProviders);
      } else {
        createPlatform(createPlatformInjector(platformProviders, desc));
      }
    }
    return assertPlatform(marker);
  };
}
function assertPlatform(requiredToken) {
  const platform = getPlatform();
  if (!platform) {
    throw new RuntimeError(401, ngDevMode && "No platform exists!");
  }
  if ((typeof ngDevMode === "undefined" || ngDevMode) && !platform.injector.get(requiredToken, null)) {
    throw new RuntimeError(400, "A platform with a different configuration has been created. Please destroy it first.");
  }
  return platform;
}
function createPlatformInjector(providers = [], name) {
  return Injector.create({
    name,
    providers: [{
      provide: INJECTOR_SCOPE,
      useValue: "platform"
    }, {
      provide: PLATFORM_DESTROY_LISTENERS,
      useValue: /* @__PURE__ */ new Set([() => _platformInjector = null])
    }, ...providers]
  });
}
function getPlatform() {
  return _platformInjector?.get(PlatformRef) ?? null;
}
var PlatformRef = /* @__PURE__ */ (() => {
  class PlatformRef2 {
    /** @internal */
    constructor(_injector) {
      this._injector = _injector;
      this._modules = [];
      this._destroyListeners = [];
      this._destroyed = false;
    }
    /**
     * Creates an instance of an `@NgModule` for the given platform.
     *
     * @deprecated Passing NgModule factories as the `PlatformRef.bootstrapModuleFactory` function
     *     argument is deprecated. Use the `PlatformRef.bootstrapModule` API instead.
     */
    bootstrapModuleFactory(moduleFactory, options) {
      const ngZone = getNgZone(options?.ngZone, getNgZoneOptions(options));
      const providers = [{
        provide: NgZone,
        useValue: ngZone
      }];
      return ngZone.run(() => {
        const ngZoneInjector = Injector.create({
          providers,
          parent: this.injector,
          name: moduleFactory.moduleType.name
        });
        const moduleRef = moduleFactory.create(ngZoneInjector);
        const exceptionHandler = moduleRef.injector.get(ErrorHandler, null);
        if (!exceptionHandler) {
          throw new RuntimeError(402, ngDevMode && "No ErrorHandler. Is platform module (BrowserModule) included?");
        }
        ngZone.runOutsideAngular(() => {
          const subscription = ngZone.onError.subscribe({
            next: (error) => {
              exceptionHandler.handleError(error);
            }
          });
          moduleRef.onDestroy(() => {
            remove(this._modules, moduleRef);
            subscription.unsubscribe();
          });
        });
        return _callAndReportToErrorHandler(exceptionHandler, ngZone, () => {
          const initStatus = moduleRef.injector.get(ApplicationInitStatus);
          initStatus.runInitializers();
          return initStatus.donePromise.then(() => {
            const localeId = moduleRef.injector.get(LOCALE_ID, DEFAULT_LOCALE_ID);
            setLocaleId(localeId || DEFAULT_LOCALE_ID);
            this._moduleDoBootstrap(moduleRef);
            return moduleRef;
          });
        });
      });
    }
    /**
     * Creates an instance of an `@NgModule` for a given platform.
     *
     * @usageNotes
     * ### Simple Example
     *
     * ```typescript
     * @NgModule({
     *   imports: [BrowserModule]
     * })
     * class MyModule {}
     *
     * let moduleRef = platformBrowser().bootstrapModule(MyModule);
     * ```
     *
     */
    bootstrapModule(moduleType, compilerOptions = []) {
      const options = optionsReducer({}, compilerOptions);
      return compileNgModuleFactory(this.injector, options, moduleType).then((moduleFactory) => this.bootstrapModuleFactory(moduleFactory, options));
    }
    _moduleDoBootstrap(moduleRef) {
      const appRef = moduleRef.injector.get(ApplicationRef);
      if (moduleRef._bootstrapComponents.length > 0) {
        moduleRef._bootstrapComponents.forEach((f) => appRef.bootstrap(f));
      } else if (moduleRef.instance.ngDoBootstrap) {
        moduleRef.instance.ngDoBootstrap(appRef);
      } else {
        throw new RuntimeError(-403, ngDevMode && `The module ${stringify(moduleRef.instance.constructor)} was bootstrapped, but it does not declare "@NgModule.bootstrap" components nor a "ngDoBootstrap" method. Please define one of these.`);
      }
      this._modules.push(moduleRef);
    }
    /**
     * Registers a listener to be called when the platform is destroyed.
     */
    onDestroy(callback) {
      this._destroyListeners.push(callback);
    }
    /**
     * Retrieves the platform {@link Injector}, which is the parent injector for
     * every Angular application on the page and provides singleton providers.
     */
    get injector() {
      return this._injector;
    }
    /**
     * Destroys the current Angular platform and all Angular applications on the page.
     * Destroys all modules and listeners registered with the platform.
     */
    destroy() {
      if (this._destroyed) {
        throw new RuntimeError(404, ngDevMode && "The platform has already been destroyed!");
      }
      this._modules.slice().forEach((module) => module.destroy());
      this._destroyListeners.forEach((listener) => listener());
      const destroyListeners = this._injector.get(PLATFORM_DESTROY_LISTENERS, null);
      if (destroyListeners) {
        destroyListeners.forEach((listener) => listener());
        destroyListeners.clear();
      }
      this._destroyed = true;
    }
    /**
     * Indicates whether this instance was destroyed.
     */
    get destroyed() {
      return this._destroyed;
    }
  }
  PlatformRef2.\u0275fac = function PlatformRef_Factory(t) {
    return new (t || PlatformRef2)(\u0275\u0275inject(Injector));
  };
  PlatformRef2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: PlatformRef2,
    factory: PlatformRef2.\u0275fac,
    providedIn: "platform"
  });
  return PlatformRef2;
})();
function getNgZoneOptions(options) {
  return {
    enableLongStackTrace: typeof ngDevMode === "undefined" ? false : !!ngDevMode,
    shouldCoalesceEventChangeDetection: !!(options && options.ngZoneEventCoalescing) || false,
    shouldCoalesceRunChangeDetection: !!(options && options.ngZoneRunCoalescing) || false
  };
}
function getNgZone(ngZoneToUse, options) {
  let ngZone;
  if (ngZoneToUse === "noop") {
    ngZone = new NoopNgZone();
  } else {
    ngZone = (ngZoneToUse === "zone.js" ? void 0 : ngZoneToUse) || new NgZone(options);
  }
  return ngZone;
}
function _callAndReportToErrorHandler(errorHandler2, ngZone, callback) {
  try {
    const result = callback();
    if (isPromise2(result)) {
      return result.catch((e) => {
        ngZone.runOutsideAngular(() => errorHandler2.handleError(e));
        throw e;
      });
    }
    return result;
  } catch (e) {
    ngZone.runOutsideAngular(() => errorHandler2.handleError(e));
    throw e;
  }
}
function optionsReducer(dst, objs) {
  if (Array.isArray(objs)) {
    dst = objs.reduce(optionsReducer, dst);
  } else {
    dst = __spreadValues(__spreadValues({}, dst), objs);
  }
  return dst;
}
var ApplicationRef = /* @__PURE__ */ (() => {
  class ApplicationRef2 {
    /**
     * Indicates whether this instance was destroyed.
     */
    get destroyed() {
      return this._destroyed;
    }
    /**
     * The `EnvironmentInjector` used to create this application.
     */
    get injector() {
      return this._injector;
    }
    /** @internal */
    constructor(_zone, _injector, _exceptionHandler) {
      this._zone = _zone;
      this._injector = _injector;
      this._exceptionHandler = _exceptionHandler;
      this._bootstrapListeners = [];
      this._views = [];
      this._runningTick = false;
      this._stable = true;
      this._destroyed = false;
      this._destroyListeners = [];
      this.componentTypes = [];
      this.components = [];
      this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
        next: () => {
          this._zone.run(() => {
            this.tick();
          });
        }
      });
      const isCurrentlyStable = new Observable((observer) => {
        this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks;
        this._zone.runOutsideAngular(() => {
          observer.next(this._stable);
          observer.complete();
        });
      });
      const isStable = new Observable((observer) => {
        let stableSub;
        this._zone.runOutsideAngular(() => {
          stableSub = this._zone.onStable.subscribe(() => {
            NgZone.assertNotInAngularZone();
            scheduleMicroTask(() => {
              if (!this._stable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks) {
                this._stable = true;
                observer.next(true);
              }
            });
          });
        });
        const unstableSub = this._zone.onUnstable.subscribe(() => {
          NgZone.assertInAngularZone();
          if (this._stable) {
            this._stable = false;
            this._zone.runOutsideAngular(() => {
              observer.next(false);
            });
          }
        });
        return () => {
          stableSub.unsubscribe();
          unstableSub.unsubscribe();
        };
      });
      this.isStable = merge(isCurrentlyStable, isStable.pipe(share()));
    }
    /**
     * Bootstrap a component onto the element identified by its selector or, optionally, to a
     * specified element.
     *
     * @usageNotes
     * ### Bootstrap process
     *
     * When bootstrapping a component, Angular mounts it onto a target DOM element
     * and kicks off automatic change detection. The target DOM element can be
     * provided using the `rootSelectorOrNode` argument.
     *
     * If the target DOM element is not provided, Angular tries to find one on a page
     * using the `selector` of the component that is being bootstrapped
     * (first matched element is used).
     *
     * ### Example
     *
     * Generally, we define the component to bootstrap in the `bootstrap` array of `NgModule`,
     * but it requires us to know the component while writing the application code.
     *
     * Imagine a situation where we have to wait for an API call to decide about the component to
     * bootstrap. We can use the `ngDoBootstrap` hook of the `NgModule` and call this method to
     * dynamically bootstrap a component.
     *
     * {@example core/ts/platform/platform.ts region='componentSelector'}
     *
     * Optionally, a component can be mounted onto a DOM element that does not match the
     * selector of the bootstrapped component.
     *
     * In the following example, we are providing a CSS selector to match the target element.
     *
     * {@example core/ts/platform/platform.ts region='cssSelector'}
     *
     * While in this example, we are providing reference to a DOM node.
     *
     * {@example core/ts/platform/platform.ts region='domNode'}
     */
    bootstrap(componentOrFactory, rootSelectorOrNode) {
      NG_DEV_MODE && this.warnIfDestroyed();
      const isComponentFactory = componentOrFactory instanceof ComponentFactory$1;
      const initStatus = this._injector.get(ApplicationInitStatus);
      if (!initStatus.done) {
        const standalone = !isComponentFactory && isStandalone(componentOrFactory);
        const errorMessage = "Cannot bootstrap as there are still asynchronous initializers running." + (standalone ? "" : " Bootstrap components in the `ngDoBootstrap` method of the root module.");
        throw new RuntimeError(405, NG_DEV_MODE && errorMessage);
      }
      let componentFactory;
      if (isComponentFactory) {
        componentFactory = componentOrFactory;
      } else {
        const resolver = this._injector.get(ComponentFactoryResolver$1);
        componentFactory = resolver.resolveComponentFactory(componentOrFactory);
      }
      this.componentTypes.push(componentFactory.componentType);
      const ngModule = isBoundToModule(componentFactory) ? void 0 : this._injector.get(NgModuleRef$1);
      const selectorOrNode = rootSelectorOrNode || componentFactory.selector;
      const compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
      const nativeElement = compRef.location.nativeElement;
      const testability = compRef.injector.get(TESTABILITY, null);
      testability?.registerApplication(nativeElement);
      compRef.onDestroy(() => {
        this.detachView(compRef.hostView);
        remove(this.components, compRef);
        testability?.unregisterApplication(nativeElement);
      });
      this._loadComponent(compRef);
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        const _console = this._injector.get(Console);
        _console.log(`Angular is running in development mode. Call enableProdMode() to enable production mode.`);
      }
      return compRef;
    }
    /**
     * Invoke this method to explicitly process change detection and its side-effects.
     *
     * In development mode, `tick()` also performs a second change detection cycle to ensure that no
     * further changes are detected. If additional changes are picked up during this second cycle,
     * bindings in the app have side-effects that cannot be resolved in a single change detection
     * pass.
     * In this case, Angular throws an error, since an Angular application can only have one change
     * detection pass during which all change detection must complete.
     */
    tick() {
      NG_DEV_MODE && this.warnIfDestroyed();
      if (this._runningTick) {
        throw new RuntimeError(101, ngDevMode && "ApplicationRef.tick is called recursively");
      }
      try {
        this._runningTick = true;
        for (let view of this._views) {
          view.detectChanges();
        }
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          for (let view of this._views) {
            view.checkNoChanges();
          }
        }
      } catch (e) {
        this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(e));
      } finally {
        this._runningTick = false;
      }
    }
    /**
     * Attaches a view so that it will be dirty checked.
     * The view will be automatically detached when it is destroyed.
     * This will throw if the view is already attached to a ViewContainer.
     */
    attachView(viewRef) {
      NG_DEV_MODE && this.warnIfDestroyed();
      const view = viewRef;
      this._views.push(view);
      view.attachToAppRef(this);
    }
    /**
     * Detaches a view from dirty checking again.
     */
    detachView(viewRef) {
      NG_DEV_MODE && this.warnIfDestroyed();
      const view = viewRef;
      remove(this._views, view);
      view.detachFromAppRef();
    }
    _loadComponent(componentRef) {
      this.attachView(componentRef.hostView);
      this.tick();
      this.components.push(componentRef);
      const listeners = this._injector.get(APP_BOOTSTRAP_LISTENER, []);
      if (ngDevMode && !Array.isArray(listeners)) {
        throw new RuntimeError(-209, `Unexpected type of the \`APP_BOOTSTRAP_LISTENER\` token value (expected an array, but got ${typeof listeners}). Please check that the \`APP_BOOTSTRAP_LISTENER\` token is configured as a \`multi: true\` provider.`);
      }
      listeners.push(...this._bootstrapListeners);
      listeners.forEach((listener) => listener(componentRef));
    }
    /** @internal */
    ngOnDestroy() {
      if (this._destroyed)
        return;
      try {
        this._destroyListeners.forEach((listener) => listener());
        this._views.slice().forEach((view) => view.destroy());
        this._onMicrotaskEmptySubscription.unsubscribe();
      } finally {
        this._destroyed = true;
        this._views = [];
        this._bootstrapListeners = [];
        this._destroyListeners = [];
      }
    }
    /**
     * Registers a listener to be called when an instance is destroyed.
     *
     * @param callback A callback function to add as a listener.
     * @returns A function which unregisters a listener.
     *
     * @internal
     */
    onDestroy(callback) {
      NG_DEV_MODE && this.warnIfDestroyed();
      this._destroyListeners.push(callback);
      return () => remove(this._destroyListeners, callback);
    }
    /**
     * Destroys an Angular application represented by this `ApplicationRef`. Calling this function
     * will destroy the associated environment injectors as well as all the bootstrapped components
     * with their views.
     */
    destroy() {
      if (this._destroyed) {
        throw new RuntimeError(406, ngDevMode && "This instance of the `ApplicationRef` has already been destroyed.");
      }
      const injector = this._injector;
      if (injector.destroy && !injector.destroyed) {
        injector.destroy();
      }
    }
    /**
     * Returns the number of attached views.
     */
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {
      if (NG_DEV_MODE && this._destroyed) {
        console.warn(formatRuntimeError(406, "This instance of the `ApplicationRef` has already been destroyed."));
      }
    }
  }
  ApplicationRef2.\u0275fac = function ApplicationRef_Factory(t) {
    return new (t || ApplicationRef2)(\u0275\u0275inject(NgZone), \u0275\u0275inject(EnvironmentInjector), \u0275\u0275inject(ErrorHandler));
  };
  ApplicationRef2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: ApplicationRef2,
    factory: ApplicationRef2.\u0275fac,
    providedIn: "root"
  });
  return ApplicationRef2;
})();
function remove(list, el) {
  const index = list.indexOf(el);
  if (index > -1) {
    list.splice(index, 1);
  }
}
function _lastDefined(args) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i] !== void 0) {
      return args[i];
    }
  }
  return void 0;
}
function _mergeArrays(parts) {
  const result = [];
  parts.forEach((part) => part && result.push(...part));
  return result;
}
var ChangeDetectorRef = /* @__PURE__ */ (() => {
  class ChangeDetectorRef2 {
  }
  ChangeDetectorRef2.__NG_ELEMENT_ID__ = injectChangeDetectorRef;
  return ChangeDetectorRef2;
})();
function injectChangeDetectorRef(flags) {
  return createViewRef(
    getCurrentTNode(),
    getLView(),
    (flags & 16) === 16
    /* InternalInjectFlags.ForPipe */
  );
}
function createViewRef(tNode, lView, isPipe) {
  if (isComponentHost(tNode) && !isPipe) {
    const componentView = getComponentLViewByIndex(tNode.index, lView);
    return new ViewRef$1(componentView, componentView);
  } else if (tNode.type & (3 | 12 | 32)) {
    const hostComponentView = lView[DECLARATION_COMPONENT_VIEW];
    return new ViewRef$1(hostComponentView, lView);
  }
  return null;
}
var platformCore = /* @__PURE__ */ createPlatformFactory(null, "core", []);
var ApplicationModule = /* @__PURE__ */ (() => {
  class ApplicationModule2 {
    // Inject ApplicationRef to make it eager...
    constructor(appRef) {
    }
  }
  ApplicationModule2.\u0275fac = function ApplicationModule_Factory(t) {
    return new (t || ApplicationModule2)(\u0275\u0275inject(ApplicationRef));
  };
  ApplicationModule2.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: ApplicationModule2
  });
  ApplicationModule2.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  return ApplicationModule2;
})();
function coerceToBoolean(value) {
  return typeof value === "boolean" ? value : value != null && value !== "false";
}
if (typeof ngDevMode !== "undefined" && ngDevMode) {
  _global.$localize = _global.$localize || function() {
    throw new Error("It looks like your application or one of its dependencies is using i18n.\nAngular 9 introduced a global `$localize()` function that needs to be loaded.\nPlease run `ng add @angular/localize` from the Angular CLI.\n(For non-CLI projects, add `import '@angular/localize/init';` to your `polyfills.ts` file.\nFor server-side rendering applications add the import to your `main.server.ts` file.)");
  };
}

// node_modules/@angular/common/fesm2020/common.mjs
var _DOM = null;
function getDOM() {
  return _DOM;
}
function setRootDomAdapter(adapter) {
  if (!_DOM) {
    _DOM = adapter;
  }
}
var DomAdapter = class {
};
var DOCUMENT2 = /* @__PURE__ */ new InjectionToken("DocumentToken");
var PlatformLocation = /* @__PURE__ */ (() => {
  class PlatformLocation2 {
    historyGo(relativePosition) {
      throw new Error("Not implemented");
    }
  }
  PlatformLocation2.\u0275fac = function PlatformLocation_Factory(t) {
    return new (t || PlatformLocation2)();
  };
  PlatformLocation2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: PlatformLocation2,
    factory: function() {
      return useBrowserPlatformLocation();
    },
    providedIn: "platform"
  });
  return PlatformLocation2;
})();
function useBrowserPlatformLocation() {
  return \u0275\u0275inject(BrowserPlatformLocation);
}
var LOCATION_INITIALIZED = /* @__PURE__ */ new InjectionToken("Location Initialized");
var BrowserPlatformLocation = /* @__PURE__ */ (() => {
  class BrowserPlatformLocation2 extends PlatformLocation {
    constructor(_doc) {
      super();
      this._doc = _doc;
      this._location = window.location;
      this._history = window.history;
    }
    getBaseHrefFromDOM() {
      return getDOM().getBaseHref(this._doc);
    }
    onPopState(fn) {
      const window2 = getDOM().getGlobalEventTarget(this._doc, "window");
      window2.addEventListener("popstate", fn, false);
      return () => window2.removeEventListener("popstate", fn);
    }
    onHashChange(fn) {
      const window2 = getDOM().getGlobalEventTarget(this._doc, "window");
      window2.addEventListener("hashchange", fn, false);
      return () => window2.removeEventListener("hashchange", fn);
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(newPath) {
      this._location.pathname = newPath;
    }
    pushState(state, title, url) {
      if (supportsState()) {
        this._history.pushState(state, title, url);
      } else {
        this._location.hash = url;
      }
    }
    replaceState(state, title, url) {
      if (supportsState()) {
        this._history.replaceState(state, title, url);
      } else {
        this._location.hash = url;
      }
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(relativePosition = 0) {
      this._history.go(relativePosition);
    }
    getState() {
      return this._history.state;
    }
  }
  BrowserPlatformLocation2.\u0275fac = function BrowserPlatformLocation_Factory(t) {
    return new (t || BrowserPlatformLocation2)(\u0275\u0275inject(DOCUMENT2));
  };
  BrowserPlatformLocation2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: BrowserPlatformLocation2,
    factory: function() {
      return createBrowserPlatformLocation();
    },
    providedIn: "platform"
  });
  return BrowserPlatformLocation2;
})();
function supportsState() {
  return !!window.history.pushState;
}
function createBrowserPlatformLocation() {
  return new BrowserPlatformLocation(\u0275\u0275inject(DOCUMENT2));
}
function joinWithSlash(start, end) {
  if (start.length == 0) {
    return end;
  }
  if (end.length == 0) {
    return start;
  }
  let slashes = 0;
  if (start.endsWith("/")) {
    slashes++;
  }
  if (end.startsWith("/")) {
    slashes++;
  }
  if (slashes == 2) {
    return start + end.substring(1);
  }
  if (slashes == 1) {
    return start + end;
  }
  return start + "/" + end;
}
function stripTrailingSlash(url) {
  const match2 = url.match(/#|\?|$/);
  const pathEndIdx = match2 && match2.index || url.length;
  const droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === "/" ? 1 : 0);
  return url.slice(0, droppedSlashIdx) + url.slice(pathEndIdx);
}
function normalizeQueryParams(params) {
  return params && params[0] !== "?" ? "?" + params : params;
}
var LocationStrategy = /* @__PURE__ */ (() => {
  class LocationStrategy2 {
    historyGo(relativePosition) {
      throw new Error("Not implemented");
    }
  }
  LocationStrategy2.\u0275fac = function LocationStrategy_Factory(t) {
    return new (t || LocationStrategy2)();
  };
  LocationStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: LocationStrategy2,
    factory: function() {
      return (() => inject(PathLocationStrategy))();
    },
    providedIn: "root"
  });
  return LocationStrategy2;
})();
var APP_BASE_HREF = /* @__PURE__ */ new InjectionToken("appBaseHref");
var PathLocationStrategy = /* @__PURE__ */ (() => {
  class PathLocationStrategy2 extends LocationStrategy {
    constructor(_platformLocation, href) {
      super();
      this._platformLocation = _platformLocation;
      this._removeListenerFns = [];
      this._baseHref = href ?? this._platformLocation.getBaseHrefFromDOM() ?? inject(DOCUMENT2).location?.origin ?? "";
    }
    /** @nodoc */
    ngOnDestroy() {
      while (this._removeListenerFns.length) {
        this._removeListenerFns.pop()();
      }
    }
    onPopState(fn) {
      this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
    }
    getBaseHref() {
      return this._baseHref;
    }
    prepareExternalUrl(internal) {
      return joinWithSlash(this._baseHref, internal);
    }
    path(includeHash = false) {
      const pathname = this._platformLocation.pathname + normalizeQueryParams(this._platformLocation.search);
      const hash = this._platformLocation.hash;
      return hash && includeHash ? `${pathname}${hash}` : pathname;
    }
    pushState(state, title, url, queryParams) {
      const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
      this._platformLocation.pushState(state, title, externalUrl);
    }
    replaceState(state, title, url, queryParams) {
      const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
      this._platformLocation.replaceState(state, title, externalUrl);
    }
    forward() {
      this._platformLocation.forward();
    }
    back() {
      this._platformLocation.back();
    }
    getState() {
      return this._platformLocation.getState();
    }
    historyGo(relativePosition = 0) {
      this._platformLocation.historyGo?.(relativePosition);
    }
  }
  PathLocationStrategy2.\u0275fac = function PathLocationStrategy_Factory(t) {
    return new (t || PathLocationStrategy2)(\u0275\u0275inject(PlatformLocation), \u0275\u0275inject(APP_BASE_HREF, 8));
  };
  PathLocationStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: PathLocationStrategy2,
    factory: PathLocationStrategy2.\u0275fac,
    providedIn: "root"
  });
  return PathLocationStrategy2;
})();
var HashLocationStrategy = /* @__PURE__ */ (() => {
  class HashLocationStrategy2 extends LocationStrategy {
    constructor(_platformLocation, _baseHref) {
      super();
      this._platformLocation = _platformLocation;
      this._baseHref = "";
      this._removeListenerFns = [];
      if (_baseHref != null) {
        this._baseHref = _baseHref;
      }
    }
    /** @nodoc */
    ngOnDestroy() {
      while (this._removeListenerFns.length) {
        this._removeListenerFns.pop()();
      }
    }
    onPopState(fn) {
      this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
    }
    getBaseHref() {
      return this._baseHref;
    }
    path(includeHash = false) {
      let path = this._platformLocation.hash;
      if (path == null)
        path = "#";
      return path.length > 0 ? path.substring(1) : path;
    }
    prepareExternalUrl(internal) {
      const url = joinWithSlash(this._baseHref, internal);
      return url.length > 0 ? "#" + url : url;
    }
    pushState(state, title, path, queryParams) {
      let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
      if (url.length == 0) {
        url = this._platformLocation.pathname;
      }
      this._platformLocation.pushState(state, title, url);
    }
    replaceState(state, title, path, queryParams) {
      let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
      if (url.length == 0) {
        url = this._platformLocation.pathname;
      }
      this._platformLocation.replaceState(state, title, url);
    }
    forward() {
      this._platformLocation.forward();
    }
    back() {
      this._platformLocation.back();
    }
    getState() {
      return this._platformLocation.getState();
    }
    historyGo(relativePosition = 0) {
      this._platformLocation.historyGo?.(relativePosition);
    }
  }
  HashLocationStrategy2.\u0275fac = function HashLocationStrategy_Factory(t) {
    return new (t || HashLocationStrategy2)(\u0275\u0275inject(PlatformLocation), \u0275\u0275inject(APP_BASE_HREF, 8));
  };
  HashLocationStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: HashLocationStrategy2,
    factory: HashLocationStrategy2.\u0275fac
  });
  return HashLocationStrategy2;
})();
var Location = /* @__PURE__ */ (() => {
  class Location2 {
    constructor(locationStrategy) {
      this._subject = new EventEmitter();
      this._urlChangeListeners = [];
      this._urlChangeSubscription = null;
      this._locationStrategy = locationStrategy;
      const baseHref = this._locationStrategy.getBaseHref();
      this._basePath = _stripOrigin(stripTrailingSlash(_stripIndexHtml(baseHref)));
      this._locationStrategy.onPopState((ev) => {
        this._subject.emit({
          "url": this.path(true),
          "pop": true,
          "state": ev.state,
          "type": ev.type
        });
      });
    }
    /** @nodoc */
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe();
      this._urlChangeListeners = [];
    }
    /**
     * Normalizes the URL path for this location.
     *
     * @param includeHash True to include an anchor fragment in the path.
     *
     * @returns The normalized URL path.
     */
    // TODO: vsavkin. Remove the boolean flag and always include hash once the deprecated router is
    // removed.
    path(includeHash = false) {
      return this.normalize(this._locationStrategy.path(includeHash));
    }
    /**
     * Reports the current state of the location history.
     * @returns The current value of the `history.state` object.
     */
    getState() {
      return this._locationStrategy.getState();
    }
    /**
     * Normalizes the given path and compares to the current normalized path.
     *
     * @param path The given URL path.
     * @param query Query parameters.
     *
     * @returns True if the given URL path is equal to the current normalized path, false
     * otherwise.
     */
    isCurrentPathEqualTo(path, query = "") {
      return this.path() == this.normalize(path + normalizeQueryParams(query));
    }
    /**
     * Normalizes a URL path by stripping any trailing slashes.
     *
     * @param url String representing a URL.
     *
     * @returns The normalized URL string.
     */
    normalize(url) {
      return Location2.stripTrailingSlash(_stripBasePath(this._basePath, _stripIndexHtml(url)));
    }
    /**
     * Normalizes an external URL path.
     * If the given URL doesn't begin with a leading slash (`'/'`), adds one
     * before normalizing. Adds a hash if `HashLocationStrategy` is
     * in use, or the `APP_BASE_HREF` if the `PathLocationStrategy` is in use.
     *
     * @param url String representing a URL.
     *
     * @returns  A normalized platform-specific URL.
     */
    prepareExternalUrl(url) {
      if (url && url[0] !== "/") {
        url = "/" + url;
      }
      return this._locationStrategy.prepareExternalUrl(url);
    }
    // TODO: rename this method to pushState
    /**
     * Changes the browser's URL to a normalized version of a given URL, and pushes a
     * new item onto the platform's history.
     *
     * @param path  URL path to normalize.
     * @param query Query parameters.
     * @param state Location history state.
     *
     */
    go(path, query = "", state = null) {
      this._locationStrategy.pushState(state, "", path, query);
      this._notifyUrlChangeListeners(this.prepareExternalUrl(path + normalizeQueryParams(query)), state);
    }
    /**
     * Changes the browser's URL to a normalized version of the given URL, and replaces
     * the top item on the platform's history stack.
     *
     * @param path  URL path to normalize.
     * @param query Query parameters.
     * @param state Location history state.
     */
    replaceState(path, query = "", state = null) {
      this._locationStrategy.replaceState(state, "", path, query);
      this._notifyUrlChangeListeners(this.prepareExternalUrl(path + normalizeQueryParams(query)), state);
    }
    /**
     * Navigates forward in the platform's history.
     */
    forward() {
      this._locationStrategy.forward();
    }
    /**
     * Navigates back in the platform's history.
     */
    back() {
      this._locationStrategy.back();
    }
    /**
     * Navigate to a specific page from session history, identified by its relative position to the
     * current page.
     *
     * @param relativePosition  Position of the target page in the history relative to the current
     *     page.
     * A negative value moves backwards, a positive value moves forwards, e.g. `location.historyGo(2)`
     * moves forward two pages and `location.historyGo(-2)` moves back two pages. When we try to go
     * beyond what's stored in the history session, we stay in the current page. Same behaviour occurs
     * when `relativePosition` equals 0.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/History_API#Moving_to_a_specific_point_in_history
     */
    historyGo(relativePosition = 0) {
      this._locationStrategy.historyGo?.(relativePosition);
    }
    /**
     * Registers a URL change listener. Use to catch updates performed by the Angular
     * framework that are not detectible through "popstate" or "hashchange" events.
     *
     * @param fn The change handler function, which take a URL and a location history state.
     * @returns A function that, when executed, unregisters a URL change listener.
     */
    onUrlChange(fn) {
      this._urlChangeListeners.push(fn);
      if (!this._urlChangeSubscription) {
        this._urlChangeSubscription = this.subscribe((v) => {
          this._notifyUrlChangeListeners(v.url, v.state);
        });
      }
      return () => {
        const fnIndex = this._urlChangeListeners.indexOf(fn);
        this._urlChangeListeners.splice(fnIndex, 1);
        if (this._urlChangeListeners.length === 0) {
          this._urlChangeSubscription?.unsubscribe();
          this._urlChangeSubscription = null;
        }
      };
    }
    /** @internal */
    _notifyUrlChangeListeners(url = "", state) {
      this._urlChangeListeners.forEach((fn) => fn(url, state));
    }
    /**
     * Subscribes to the platform's `popState` events.
     *
     * Note: `Location.go()` does not trigger the `popState` event in the browser. Use
     * `Location.onUrlChange()` to subscribe to URL changes instead.
     *
     * @param value Event that is triggered when the state history changes.
     * @param exception The exception to throw.
     *
     * @see [onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)
     *
     * @returns Subscribed events.
     */
    subscribe(onNext, onThrow, onReturn) {
      return this._subject.subscribe({
        next: onNext,
        error: onThrow,
        complete: onReturn
      });
    }
  }
  Location2.normalizeQueryParams = normalizeQueryParams;
  Location2.joinWithSlash = joinWithSlash;
  Location2.stripTrailingSlash = stripTrailingSlash;
  Location2.\u0275fac = function Location_Factory(t) {
    return new (t || Location2)(\u0275\u0275inject(LocationStrategy));
  };
  Location2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: Location2,
    factory: function() {
      return createLocation();
    },
    providedIn: "root"
  });
  return Location2;
})();
function createLocation() {
  return new Location(\u0275\u0275inject(LocationStrategy));
}
function _stripBasePath(basePath, url) {
  if (!basePath || !url.startsWith(basePath)) {
    return url;
  }
  const strippedUrl = url.substring(basePath.length);
  if (strippedUrl === "" || ["/", ";", "?", "#"].includes(strippedUrl[0])) {
    return strippedUrl;
  }
  return url;
}
function _stripIndexHtml(url) {
  return url.replace(/\/index.html$/, "");
}
function _stripOrigin(baseHref) {
  const isAbsoluteUrl2 = new RegExp("^(https?:)?//").test(baseHref);
  if (isAbsoluteUrl2) {
    const [, pathname] = baseHref.split(/\/\/[^\/]+/);
    return pathname;
  }
  return baseHref;
}
function parseCookieValue(cookieStr, name) {
  name = encodeURIComponent(name);
  for (const cookie of cookieStr.split(";")) {
    const eqIndex = cookie.indexOf("=");
    const [cookieName, cookieValue] = eqIndex == -1 ? [cookie, ""] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)];
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
var NG_DEV_MODE2 = typeof ngDevMode === "undefined" || !!ngDevMode;
var CommonModule = /* @__PURE__ */ (() => {
  class CommonModule2 {
  }
  CommonModule2.\u0275fac = function CommonModule_Factory(t) {
    return new (t || CommonModule2)();
  };
  CommonModule2.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: CommonModule2
  });
  CommonModule2.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  return CommonModule2;
})();
var PLATFORM_BROWSER_ID = "browser";
var ViewportScroller = /* @__PURE__ */ (() => {
  class ViewportScroller2 {
  }
  ViewportScroller2.\u0275prov = \u0275\u0275defineInjectable({
    token: ViewportScroller2,
    providedIn: "root",
    factory: () => new BrowserViewportScroller(\u0275\u0275inject(DOCUMENT2), window)
  });
  return ViewportScroller2;
})();
var BrowserViewportScroller = class {
  constructor(document2, window2) {
    this.document = document2;
    this.window = window2;
    this.offset = () => [0, 0];
  }
  /**
   * Configures the top offset used when scrolling to an anchor.
   * @param offset A position in screen coordinates (a tuple with x and y values)
   * or a function that returns the top offset position.
   *
   */
  setOffset(offset) {
    if (Array.isArray(offset)) {
      this.offset = () => offset;
    } else {
      this.offset = offset;
    }
  }
  /**
   * Retrieves the current scroll position.
   * @returns The position in screen coordinates.
   */
  getScrollPosition() {
    if (this.supportsScrolling()) {
      return [this.window.pageXOffset, this.window.pageYOffset];
    } else {
      return [0, 0];
    }
  }
  /**
   * Sets the scroll position.
   * @param position The new position in screen coordinates.
   */
  scrollToPosition(position) {
    if (this.supportsScrolling()) {
      this.window.scrollTo(position[0], position[1]);
    }
  }
  /**
   * Scrolls to an element and attempts to focus the element.
   *
   * Note that the function name here is misleading in that the target string may be an ID for a
   * non-anchor element.
   *
   * @param target The ID of an element or name of the anchor.
   *
   * @see https://html.spec.whatwg.org/#the-indicated-part-of-the-document
   * @see https://html.spec.whatwg.org/#scroll-to-fragid
   */
  scrollToAnchor(target) {
    if (!this.supportsScrolling()) {
      return;
    }
    const elSelected = findAnchorFromDocument(this.document, target);
    if (elSelected) {
      this.scrollToElement(elSelected);
      elSelected.focus();
    }
  }
  /**
   * Disables automatic scroll restoration provided by the browser.
   */
  setHistoryScrollRestoration(scrollRestoration) {
    if (this.supportScrollRestoration()) {
      const history = this.window.history;
      if (history && history.scrollRestoration) {
        history.scrollRestoration = scrollRestoration;
      }
    }
  }
  /**
   * Scrolls to an element using the native offset and the specified offset set on this scroller.
   *
   * The offset can be used when we know that there is a floating header and scrolling naively to an
   * element (ex: `scrollIntoView`) leaves the element hidden behind the floating header.
   */
  scrollToElement(el) {
    const rect = el.getBoundingClientRect();
    const left = rect.left + this.window.pageXOffset;
    const top = rect.top + this.window.pageYOffset;
    const offset = this.offset();
    this.window.scrollTo(left - offset[0], top - offset[1]);
  }
  /**
   * We only support scroll restoration when we can get a hold of window.
   * This means that we do not support this behavior when running in a web worker.
   *
   * Lifting this restriction right now would require more changes in the dom adapter.
   * Since webworkers aren't widely used, we will lift it once RouterScroller is
   * battle-tested.
   */
  supportScrollRestoration() {
    try {
      if (!this.supportsScrolling()) {
        return false;
      }
      const scrollRestorationDescriptor = getScrollRestorationProperty(this.window.history) || getScrollRestorationProperty(Object.getPrototypeOf(this.window.history));
      return !!scrollRestorationDescriptor && !!(scrollRestorationDescriptor.writable || scrollRestorationDescriptor.set);
    } catch {
      return false;
    }
  }
  supportsScrolling() {
    try {
      return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window;
    } catch {
      return false;
    }
  }
};
function getScrollRestorationProperty(obj) {
  return Object.getOwnPropertyDescriptor(obj, "scrollRestoration");
}
function findAnchorFromDocument(document2, target) {
  const documentResult = document2.getElementById(target) || document2.getElementsByName(target)[0];
  if (documentResult) {
    return documentResult;
  }
  if (typeof document2.createTreeWalker === "function" && document2.body && (document2.body.createShadowRoot || document2.body.attachShadow)) {
    const treeWalker = document2.createTreeWalker(document2.body, NodeFilter.SHOW_ELEMENT);
    let currentNode = treeWalker.currentNode;
    while (currentNode) {
      const shadowRoot = currentNode.shadowRoot;
      if (shadowRoot) {
        const result = shadowRoot.getElementById(target) || shadowRoot.querySelector(`[name="${target}"]`);
        if (result) {
          return result;
        }
      }
      currentNode = treeWalker.nextNode();
    }
  }
  return null;
}
var XhrFactory = class {
};
function isAbsoluteUrl(src) {
  return /^https?:\/\//.test(src);
}
function isValidPath(path) {
  const isString = typeof path === "string";
  if (!isString || path.trim() === "") {
    return false;
  }
  try {
    const url = new URL(path);
    return true;
  } catch {
    return false;
  }
}
function normalizePath(path) {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
function normalizeSrc(src) {
  return src.startsWith("/") ? src.slice(1) : src;
}
var noopImageLoader = (config2) => config2.src;
var IMAGE_LOADER = /* @__PURE__ */ new InjectionToken("ImageLoader", {
  providedIn: "root",
  factory: () => noopImageLoader
});
function createImageLoader(buildUrlFn, exampleUrls) {
  return function provideImageLoader(path) {
    if (!isValidPath(path)) {
      throwInvalidPathError(path, exampleUrls || []);
    }
    path = normalizePath(path);
    const loaderFn = (config2) => {
      if (isAbsoluteUrl(config2.src)) {
        throwUnexpectedAbsoluteUrlError(path, config2.src);
      }
      return buildUrlFn(path, __spreadProps(__spreadValues({}, config2), {
        src: normalizeSrc(config2.src)
      }));
    };
    const providers = [{
      provide: IMAGE_LOADER,
      useValue: loaderFn
    }];
    return providers;
  };
}
function throwInvalidPathError(path, exampleUrls) {
  throw new RuntimeError(2959, ngDevMode && `Image loader has detected an invalid path (\`${path}\`). To fix this, supply a path using one of the following formats: ${exampleUrls.join(" or ")}`);
}
function throwUnexpectedAbsoluteUrlError(path, url) {
  throw new RuntimeError(2959, ngDevMode && `Image loader has detected a \`<img>\` tag with an invalid \`ngSrc\` attribute: ${url}. This image loader expects \`ngSrc\` to be a relative URL - however the provided value is an absolute URL. To fix this, provide \`ngSrc\` as a path relative to the base URL configured for this loader (\`${path}\`).`);
}
var provideCloudflareLoader = /* @__PURE__ */ createImageLoader(createCloudflareUrl, ngDevMode ? ["https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>"] : void 0);
function createCloudflareUrl(path, config2) {
  let params = `format=auto`;
  if (config2.width) {
    params += `,width=${config2.width}`;
  }
  return `${path}/cdn-cgi/image/${params}/${config2.src}`;
}
var provideCloudinaryLoader = /* @__PURE__ */ createImageLoader(createCloudinaryUrl, ngDevMode ? ["https://res.cloudinary.com/mysite", "https://mysite.cloudinary.com", "https://subdomain.mysite.com"] : void 0);
function createCloudinaryUrl(path, config2) {
  let params = `f_auto,q_auto`;
  if (config2.width) {
    params += `,w_${config2.width}`;
  }
  return `${path}/image/upload/${params}/${config2.src}`;
}
var provideImageKitLoader = /* @__PURE__ */ createImageLoader(createImagekitUrl, ngDevMode ? ["https://ik.imagekit.io/mysite", "https://subdomain.mysite.com"] : void 0);
function createImagekitUrl(path, config2) {
  const {
    src,
    width
  } = config2;
  let urlSegments;
  if (width) {
    const params = `tr:w-${width}`;
    urlSegments = [path, params, src];
  } else {
    urlSegments = [path, src];
  }
  return urlSegments.join("/");
}
var provideImgixLoader = /* @__PURE__ */ createImageLoader(createImgixUrl, ngDevMode ? ["https://somepath.imgix.net/"] : void 0);
function createImgixUrl(path, config2) {
  const url = new URL(`${path}/${config2.src}`);
  url.searchParams.set("auto", "format");
  if (config2.width) {
    url.searchParams.set("w", config2.width.toString());
  }
  return url.href;
}

// node_modules/@angular/platform-browser/fesm2020/platform-browser.mjs
var GenericBrowserDomAdapter = class extends DomAdapter {
  constructor() {
    super(...arguments);
    this.supportsDOMEvents = true;
  }
};
var BrowserDomAdapter = class extends GenericBrowserDomAdapter {
  static makeCurrent() {
    setRootDomAdapter(new BrowserDomAdapter());
  }
  onAndCancel(el, evt, listener) {
    el.addEventListener(evt, listener, false);
    return () => {
      el.removeEventListener(evt, listener, false);
    };
  }
  dispatchEvent(el, evt) {
    el.dispatchEvent(evt);
  }
  remove(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  createElement(tagName, doc) {
    doc = doc || this.getDefaultDocument();
    return doc.createElement(tagName);
  }
  createHtmlDocument() {
    return document.implementation.createHTMLDocument("fakeTitle");
  }
  getDefaultDocument() {
    return document;
  }
  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  isShadowRoot(node) {
    return node instanceof DocumentFragment;
  }
  /** @deprecated No longer being used in Ivy code. To be removed in version 14. */
  getGlobalEventTarget(doc, target) {
    if (target === "window") {
      return window;
    }
    if (target === "document") {
      return doc;
    }
    if (target === "body") {
      return doc.body;
    }
    return null;
  }
  getBaseHref(doc) {
    const href = getBaseElementHref();
    return href == null ? null : relativePath(href);
  }
  resetBaseElement() {
    baseElement = null;
  }
  getUserAgent() {
    return window.navigator.userAgent;
  }
  getCookie(name) {
    return parseCookieValue(document.cookie, name);
  }
};
var baseElement = null;
function getBaseElementHref() {
  baseElement = baseElement || document.querySelector("base");
  return baseElement ? baseElement.getAttribute("href") : null;
}
var urlParsingNode;
function relativePath(url) {
  urlParsingNode = urlParsingNode || document.createElement("a");
  urlParsingNode.setAttribute("href", url);
  const pathName = urlParsingNode.pathname;
  return pathName.charAt(0) === "/" ? pathName : `/${pathName}`;
}
var TRANSITION_ID = /* @__PURE__ */ new InjectionToken("TRANSITION_ID");
function appInitializerFactory(transitionId, document2, injector) {
  return () => {
    injector.get(ApplicationInitStatus).donePromise.then(() => {
      const dom = getDOM();
      const styles = document2.querySelectorAll(`style[ng-transition="${transitionId}"]`);
      for (let i = 0; i < styles.length; i++) {
        dom.remove(styles[i]);
      }
    });
  };
}
var SERVER_TRANSITION_PROVIDERS = [{
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  deps: [TRANSITION_ID, DOCUMENT2, Injector],
  multi: true
}];
var BrowserGetTestability = class {
  addToWindow(registry) {
    _global["getAngularTestability"] = (elem, findInAncestors = true) => {
      const testability = registry.findTestabilityInTree(elem, findInAncestors);
      if (testability == null) {
        throw new Error("Could not find testability for element.");
      }
      return testability;
    };
    _global["getAllAngularTestabilities"] = () => registry.getAllTestabilities();
    _global["getAllAngularRootElements"] = () => registry.getAllRootElements();
    const whenAllStable = (callback) => {
      const testabilities = _global["getAllAngularTestabilities"]();
      let count = testabilities.length;
      let didWork = false;
      const decrement = function(didWork_) {
        didWork = didWork || didWork_;
        count--;
        if (count == 0) {
          callback(didWork);
        }
      };
      testabilities.forEach(function(testability) {
        testability.whenStable(decrement);
      });
    };
    if (!_global["frameworkStabilizers"]) {
      _global["frameworkStabilizers"] = [];
    }
    _global["frameworkStabilizers"].push(whenAllStable);
  }
  findTestabilityInTree(registry, elem, findInAncestors) {
    if (elem == null) {
      return null;
    }
    const t = registry.getTestability(elem);
    if (t != null) {
      return t;
    } else if (!findInAncestors) {
      return null;
    }
    if (getDOM().isShadowRoot(elem)) {
      return this.findTestabilityInTree(registry, elem.host, true);
    }
    return this.findTestabilityInTree(registry, elem.parentElement, true);
  }
};
var BrowserXhr = /* @__PURE__ */ (() => {
  class BrowserXhr2 {
    build() {
      return new XMLHttpRequest();
    }
  }
  BrowserXhr2.\u0275fac = function BrowserXhr_Factory(t) {
    return new (t || BrowserXhr2)();
  };
  BrowserXhr2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: BrowserXhr2,
    factory: BrowserXhr2.\u0275fac
  });
  return BrowserXhr2;
})();
var EVENT_MANAGER_PLUGINS = /* @__PURE__ */ new InjectionToken("EventManagerPlugins");
var EventManager = /* @__PURE__ */ (() => {
  class EventManager2 {
    /**
     * Initializes an instance of the event-manager service.
     */
    constructor(plugins, _zone) {
      this._zone = _zone;
      this._eventNameToPlugin = /* @__PURE__ */ new Map();
      plugins.forEach((plugin) => {
        plugin.manager = this;
      });
      this._plugins = plugins.slice().reverse();
    }
    /**
     * Registers a handler for a specific element and event.
     *
     * @param element The HTML element to receive event notifications.
     * @param eventName The name of the event to listen for.
     * @param handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @returns  A callback function that can be used to remove the handler.
     */
    addEventListener(element, eventName, handler) {
      const plugin = this._findPluginFor(eventName);
      return plugin.addEventListener(element, eventName, handler);
    }
    /**
     * Registers a global handler for an event in a target view.
     *
     * @param target A target for global event notifications. One of "window", "document", or "body".
     * @param eventName The name of the event to listen for.
     * @param handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @returns A callback function that can be used to remove the handler.
     * @deprecated No longer being used in Ivy code. To be removed in version 14.
     */
    addGlobalEventListener(target, eventName, handler) {
      const plugin = this._findPluginFor(eventName);
      return plugin.addGlobalEventListener(target, eventName, handler);
    }
    /**
     * Retrieves the compilation zone in which event listeners are registered.
     */
    getZone() {
      return this._zone;
    }
    /** @internal */
    _findPluginFor(eventName) {
      const plugin = this._eventNameToPlugin.get(eventName);
      if (plugin) {
        return plugin;
      }
      const plugins = this._plugins;
      for (let i = 0; i < plugins.length; i++) {
        const plugin2 = plugins[i];
        if (plugin2.supports(eventName)) {
          this._eventNameToPlugin.set(eventName, plugin2);
          return plugin2;
        }
      }
      throw new Error(`No event manager plugin found for event ${eventName}`);
    }
  }
  EventManager2.\u0275fac = function EventManager_Factory(t) {
    return new (t || EventManager2)(\u0275\u0275inject(EVENT_MANAGER_PLUGINS), \u0275\u0275inject(NgZone));
  };
  EventManager2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: EventManager2,
    factory: EventManager2.\u0275fac
  });
  return EventManager2;
})();
var EventManagerPlugin = class {
  constructor(_doc) {
    this._doc = _doc;
  }
  addGlobalEventListener(element, eventName, handler) {
    const target = getDOM().getGlobalEventTarget(this._doc, element);
    if (!target) {
      throw new Error(`Unsupported event target ${target} for event ${eventName}`);
    }
    return this.addEventListener(target, eventName, handler);
  }
};
var SharedStylesHost = /* @__PURE__ */ (() => {
  class SharedStylesHost2 {
    constructor() {
      this.usageCount = /* @__PURE__ */ new Map();
    }
    addStyles(styles) {
      for (const style of styles) {
        const usageCount = this.changeUsageCount(style, 1);
        if (usageCount === 1) {
          this.onStyleAdded(style);
        }
      }
    }
    removeStyles(styles) {
      for (const style of styles) {
        const usageCount = this.changeUsageCount(style, -1);
        if (usageCount === 0) {
          this.onStyleRemoved(style);
        }
      }
    }
    onStyleRemoved(style) {
    }
    onStyleAdded(style) {
    }
    getAllStyles() {
      return this.usageCount.keys();
    }
    changeUsageCount(style, delta) {
      const map2 = this.usageCount;
      let usage = map2.get(style) ?? 0;
      usage += delta;
      if (usage > 0) {
        map2.set(style, usage);
      } else {
        map2.delete(style);
      }
      return usage;
    }
    ngOnDestroy() {
      for (const style of this.getAllStyles()) {
        this.onStyleRemoved(style);
      }
      this.usageCount.clear();
    }
  }
  SharedStylesHost2.\u0275fac = function SharedStylesHost_Factory(t) {
    return new (t || SharedStylesHost2)();
  };
  SharedStylesHost2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: SharedStylesHost2,
    factory: SharedStylesHost2.\u0275fac
  });
  return SharedStylesHost2;
})();
var DomSharedStylesHost = /* @__PURE__ */ (() => {
  class DomSharedStylesHost2 extends SharedStylesHost {
    constructor(doc) {
      super();
      this.doc = doc;
      this.styleRef = /* @__PURE__ */ new Map();
      this.hostNodes = /* @__PURE__ */ new Set();
      this.resetHostNodes();
    }
    onStyleAdded(style) {
      for (const host of this.hostNodes) {
        this.addStyleToHost(host, style);
      }
    }
    onStyleRemoved(style) {
      const styleRef = this.styleRef;
      const styleElements = styleRef.get(style);
      styleElements?.forEach((e) => e.remove());
      styleRef.delete(style);
    }
    ngOnDestroy() {
      super.ngOnDestroy();
      this.styleRef.clear();
      this.resetHostNodes();
    }
    addHost(hostNode) {
      this.hostNodes.add(hostNode);
      for (const style of this.getAllStyles()) {
        this.addStyleToHost(hostNode, style);
      }
    }
    removeHost(hostNode) {
      this.hostNodes.delete(hostNode);
    }
    addStyleToHost(host, style) {
      const styleEl = this.doc.createElement("style");
      styleEl.textContent = style;
      host.appendChild(styleEl);
      const styleElRef = this.styleRef.get(style);
      if (styleElRef) {
        styleElRef.push(styleEl);
      } else {
        this.styleRef.set(style, [styleEl]);
      }
    }
    resetHostNodes() {
      const hostNodes = this.hostNodes;
      hostNodes.clear();
      hostNodes.add(this.doc.head);
    }
  }
  DomSharedStylesHost2.\u0275fac = function DomSharedStylesHost_Factory(t) {
    return new (t || DomSharedStylesHost2)(\u0275\u0275inject(DOCUMENT2));
  };
  DomSharedStylesHost2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: DomSharedStylesHost2,
    factory: DomSharedStylesHost2.\u0275fac
  });
  return DomSharedStylesHost2;
})();
var NAMESPACE_URIS = {
  "svg": "http://www.w3.org/2000/svg",
  "xhtml": "http://www.w3.org/1999/xhtml",
  "xlink": "http://www.w3.org/1999/xlink",
  "xml": "http://www.w3.org/XML/1998/namespace",
  "xmlns": "http://www.w3.org/2000/xmlns/",
  "math": "http://www.w3.org/1998/MathML/"
};
var COMPONENT_REGEX = /%COMP%/g;
var NG_DEV_MODE$1 = typeof ngDevMode === "undefined" || !!ngDevMode;
var COMPONENT_VARIABLE = "%COMP%";
var HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
var CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
var REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT = false;
var REMOVE_STYLES_ON_COMPONENT_DESTROY = /* @__PURE__ */ new InjectionToken("RemoveStylesOnCompDestory", {
  providedIn: "root",
  factory: () => REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT
});
function shimContentAttribute(componentShortId) {
  return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimHostAttribute(componentShortId) {
  return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function flattenStyles(compId, styles) {
  return styles.flat(100).map((s) => s.replace(COMPONENT_REGEX, compId));
}
function decoratePreventDefault(eventHandler) {
  return (event) => {
    if (event === "__ngUnwrap__") {
      return eventHandler;
    }
    const allowDefaultBehavior = eventHandler(event);
    if (allowDefaultBehavior === false) {
      event.preventDefault();
      event.returnValue = false;
    }
    return void 0;
  };
}
var DomRendererFactory2 = /* @__PURE__ */ (() => {
  class DomRendererFactory22 {
    constructor(eventManager, sharedStylesHost, appId, removeStylesOnCompDestory) {
      this.eventManager = eventManager;
      this.sharedStylesHost = sharedStylesHost;
      this.appId = appId;
      this.removeStylesOnCompDestory = removeStylesOnCompDestory;
      this.rendererByCompId = /* @__PURE__ */ new Map();
      this.defaultRenderer = new DefaultDomRenderer2(eventManager);
    }
    createRenderer(element, type) {
      if (!element || !type) {
        return this.defaultRenderer;
      }
      const renderer = this.getOrCreateRenderer(element, type);
      if (renderer instanceof EmulatedEncapsulationDomRenderer2) {
        renderer.applyToHost(element);
      } else if (renderer instanceof NoneEncapsulationDomRenderer) {
        renderer.applyStyles();
      }
      return renderer;
    }
    getOrCreateRenderer(element, type) {
      const rendererByCompId = this.rendererByCompId;
      let renderer = rendererByCompId.get(type.id);
      if (!renderer) {
        const eventManager = this.eventManager;
        const sharedStylesHost = this.sharedStylesHost;
        const removeStylesOnCompDestory = this.removeStylesOnCompDestory;
        switch (type.encapsulation) {
          case ViewEncapsulation$1.Emulated:
            renderer = new EmulatedEncapsulationDomRenderer2(eventManager, sharedStylesHost, type, this.appId, removeStylesOnCompDestory);
            break;
          case ViewEncapsulation$1.ShadowDom:
            return new ShadowDomRenderer(eventManager, sharedStylesHost, element, type);
          default:
            renderer = new NoneEncapsulationDomRenderer(eventManager, sharedStylesHost, type, removeStylesOnCompDestory);
            break;
        }
        renderer.onDestroy = () => rendererByCompId.delete(type.id);
        rendererByCompId.set(type.id, renderer);
      }
      return renderer;
    }
    ngOnDestroy() {
      this.rendererByCompId.clear();
    }
    begin() {
    }
    end() {
    }
  }
  DomRendererFactory22.\u0275fac = function DomRendererFactory2_Factory(t) {
    return new (t || DomRendererFactory22)(\u0275\u0275inject(EventManager), \u0275\u0275inject(DomSharedStylesHost), \u0275\u0275inject(APP_ID), \u0275\u0275inject(REMOVE_STYLES_ON_COMPONENT_DESTROY));
  };
  DomRendererFactory22.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: DomRendererFactory22,
    factory: DomRendererFactory22.\u0275fac
  });
  return DomRendererFactory22;
})();
var DefaultDomRenderer2 = class {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.data = /* @__PURE__ */ Object.create(null);
    this.destroyNode = null;
  }
  destroy() {
  }
  createElement(name, namespace) {
    if (namespace) {
      return document.createElementNS(NAMESPACE_URIS[namespace] || namespace, name);
    }
    return document.createElement(name);
  }
  createComment(value) {
    return document.createComment(value);
  }
  createText(value) {
    return document.createTextNode(value);
  }
  appendChild(parent, newChild) {
    const targetParent = isTemplateNode(parent) ? parent.content : parent;
    targetParent.appendChild(newChild);
  }
  insertBefore(parent, newChild, refChild) {
    if (parent) {
      const targetParent = isTemplateNode(parent) ? parent.content : parent;
      targetParent.insertBefore(newChild, refChild);
    }
  }
  removeChild(parent, oldChild) {
    if (parent) {
      parent.removeChild(oldChild);
    }
  }
  selectRootElement(selectorOrNode, preserveContent) {
    let el = typeof selectorOrNode === "string" ? document.querySelector(selectorOrNode) : selectorOrNode;
    if (!el) {
      throw new Error(`The selector "${selectorOrNode}" did not match any elements`);
    }
    if (!preserveContent) {
      el.textContent = "";
    }
    return el;
  }
  parentNode(node) {
    return node.parentNode;
  }
  nextSibling(node) {
    return node.nextSibling;
  }
  setAttribute(el, name, value, namespace) {
    if (namespace) {
      name = namespace + ":" + name;
      const namespaceUri = NAMESPACE_URIS[namespace];
      if (namespaceUri) {
        el.setAttributeNS(namespaceUri, name, value);
      } else {
        el.setAttribute(name, value);
      }
    } else {
      el.setAttribute(name, value);
    }
  }
  removeAttribute(el, name, namespace) {
    if (namespace) {
      const namespaceUri = NAMESPACE_URIS[namespace];
      if (namespaceUri) {
        el.removeAttributeNS(namespaceUri, name);
      } else {
        el.removeAttribute(`${namespace}:${name}`);
      }
    } else {
      el.removeAttribute(name);
    }
  }
  addClass(el, name) {
    el.classList.add(name);
  }
  removeClass(el, name) {
    el.classList.remove(name);
  }
  setStyle(el, style, value, flags) {
    if (flags & (RendererStyleFlags2.DashCase | RendererStyleFlags2.Important)) {
      el.style.setProperty(style, value, flags & RendererStyleFlags2.Important ? "important" : "");
    } else {
      el.style[style] = value;
    }
  }
  removeStyle(el, style, flags) {
    if (flags & RendererStyleFlags2.DashCase) {
      el.style.removeProperty(style);
    } else {
      el.style[style] = "";
    }
  }
  setProperty(el, name, value) {
    NG_DEV_MODE$1 && checkNoSyntheticProp(name, "property");
    el[name] = value;
  }
  setValue(node, value) {
    node.nodeValue = value;
  }
  listen(target, event, callback) {
    NG_DEV_MODE$1 && checkNoSyntheticProp(event, "listener");
    if (typeof target === "string") {
      return this.eventManager.addGlobalEventListener(target, event, decoratePreventDefault(callback));
    }
    return this.eventManager.addEventListener(target, event, decoratePreventDefault(callback));
  }
};
var AT_CHARCODE = /* @__PURE__ */ (() => "@".charCodeAt(0))();
function checkNoSyntheticProp(name, nameKind) {
  if (name.charCodeAt(0) === AT_CHARCODE) {
    throw new Error(`Unexpected synthetic ${nameKind} ${name} found. Please make sure that:
  - Either \`BrowserAnimationsModule\` or \`NoopAnimationsModule\` are imported in your application.
  - There is corresponding configuration for the animation named \`${name}\` defined in the \`animations\` field of the \`@Component\` decorator (see https://angular.io/api/core/Component#animations).`);
  }
}
function isTemplateNode(node) {
  return node.tagName === "TEMPLATE" && node.content !== void 0;
}
var ShadowDomRenderer = class extends DefaultDomRenderer2 {
  constructor(eventManager, sharedStylesHost, hostEl, component) {
    super(eventManager);
    this.sharedStylesHost = sharedStylesHost;
    this.hostEl = hostEl;
    this.shadowRoot = hostEl.attachShadow({
      mode: "open"
    });
    this.sharedStylesHost.addHost(this.shadowRoot);
    const styles = flattenStyles(component.id, component.styles);
    for (const style of styles) {
      const styleEl = document.createElement("style");
      styleEl.textContent = style;
      this.shadowRoot.appendChild(styleEl);
    }
  }
  nodeOrShadowRoot(node) {
    return node === this.hostEl ? this.shadowRoot : node;
  }
  appendChild(parent, newChild) {
    return super.appendChild(this.nodeOrShadowRoot(parent), newChild);
  }
  insertBefore(parent, newChild, refChild) {
    return super.insertBefore(this.nodeOrShadowRoot(parent), newChild, refChild);
  }
  removeChild(parent, oldChild) {
    return super.removeChild(this.nodeOrShadowRoot(parent), oldChild);
  }
  parentNode(node) {
    return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(node)));
  }
  destroy() {
    this.sharedStylesHost.removeHost(this.shadowRoot);
  }
};
var NoneEncapsulationDomRenderer = class extends DefaultDomRenderer2 {
  constructor(eventManager, sharedStylesHost, component, removeStylesOnCompDestory, compId = component.id) {
    super(eventManager);
    this.sharedStylesHost = sharedStylesHost;
    this.removeStylesOnCompDestory = removeStylesOnCompDestory;
    this.rendererUsageCount = 0;
    this.styles = flattenStyles(compId, component.styles);
  }
  applyStyles() {
    this.sharedStylesHost.addStyles(this.styles);
    this.rendererUsageCount++;
  }
  destroy() {
    if (!this.removeStylesOnCompDestory) {
      return;
    }
    this.sharedStylesHost.removeStyles(this.styles);
    this.rendererUsageCount--;
    if (this.rendererUsageCount === 0) {
      this.onDestroy?.();
    }
  }
};
var EmulatedEncapsulationDomRenderer2 = class extends NoneEncapsulationDomRenderer {
  constructor(eventManager, sharedStylesHost, component, appId, removeStylesOnCompDestory) {
    const compId = appId + "-" + component.id;
    super(eventManager, sharedStylesHost, component, removeStylesOnCompDestory, compId);
    this.contentAttr = shimContentAttribute(compId);
    this.hostAttr = shimHostAttribute(compId);
  }
  applyToHost(element) {
    this.applyStyles();
    this.setAttribute(element, this.hostAttr, "");
  }
  createElement(parent, name) {
    const el = super.createElement(parent, name);
    super.setAttribute(el, this.contentAttr, "");
    return el;
  }
};
var DomEventsPlugin = /* @__PURE__ */ (() => {
  class DomEventsPlugin2 extends EventManagerPlugin {
    constructor(doc) {
      super(doc);
    }
    // This plugin should come last in the list of plugins, because it accepts all
    // events.
    supports(eventName) {
      return true;
    }
    addEventListener(element, eventName, handler) {
      element.addEventListener(eventName, handler, false);
      return () => this.removeEventListener(element, eventName, handler);
    }
    removeEventListener(target, eventName, callback) {
      return target.removeEventListener(eventName, callback);
    }
  }
  DomEventsPlugin2.\u0275fac = function DomEventsPlugin_Factory(t) {
    return new (t || DomEventsPlugin2)(\u0275\u0275inject(DOCUMENT2));
  };
  DomEventsPlugin2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: DomEventsPlugin2,
    factory: DomEventsPlugin2.\u0275fac
  });
  return DomEventsPlugin2;
})();
var MODIFIER_KEYS = ["alt", "control", "meta", "shift"];
var _keyMap = {
  "\b": "Backspace",
  "	": "Tab",
  "\x7F": "Delete",
  "\x1B": "Escape",
  "Del": "Delete",
  "Esc": "Escape",
  "Left": "ArrowLeft",
  "Right": "ArrowRight",
  "Up": "ArrowUp",
  "Down": "ArrowDown",
  "Menu": "ContextMenu",
  "Scroll": "ScrollLock",
  "Win": "OS"
};
var MODIFIER_KEY_GETTERS = {
  "alt": (event) => event.altKey,
  "control": (event) => event.ctrlKey,
  "meta": (event) => event.metaKey,
  "shift": (event) => event.shiftKey
};
var KeyEventsPlugin = /* @__PURE__ */ (() => {
  class KeyEventsPlugin2 extends EventManagerPlugin {
    /**
     * Initializes an instance of the browser plug-in.
     * @param doc The document in which key events will be detected.
     */
    constructor(doc) {
      super(doc);
    }
    /**
     * Reports whether a named key event is supported.
     * @param eventName The event name to query.
     * @return True if the named key event is supported.
     */
    supports(eventName) {
      return KeyEventsPlugin2.parseEventName(eventName) != null;
    }
    /**
     * Registers a handler for a specific element and key event.
     * @param element The HTML element to receive event notifications.
     * @param eventName The name of the key event to listen for.
     * @param handler A function to call when the notification occurs. Receives the
     * event object as an argument.
     * @returns The key event that was registered.
     */
    addEventListener(element, eventName, handler) {
      const parsedEvent = KeyEventsPlugin2.parseEventName(eventName);
      const outsideHandler = KeyEventsPlugin2.eventCallback(parsedEvent["fullKey"], handler, this.manager.getZone());
      return this.manager.getZone().runOutsideAngular(() => {
        return getDOM().onAndCancel(element, parsedEvent["domEventName"], outsideHandler);
      });
    }
    /**
     * Parses the user provided full keyboard event definition and normalizes it for
     * later internal use. It ensures the string is all lowercase, converts special
     * characters to a standard spelling, and orders all the values consistently.
     *
     * @param eventName The name of the key event to listen for.
     * @returns an object with the full, normalized string, and the dom event name
     * or null in the case when the event doesn't match a keyboard event.
     */
    static parseEventName(eventName) {
      const parts = eventName.toLowerCase().split(".");
      const domEventName = parts.shift();
      if (parts.length === 0 || !(domEventName === "keydown" || domEventName === "keyup")) {
        return null;
      }
      const key = KeyEventsPlugin2._normalizeKey(parts.pop());
      let fullKey = "";
      let codeIX = parts.indexOf("code");
      if (codeIX > -1) {
        parts.splice(codeIX, 1);
        fullKey = "code.";
      }
      MODIFIER_KEYS.forEach((modifierName) => {
        const index = parts.indexOf(modifierName);
        if (index > -1) {
          parts.splice(index, 1);
          fullKey += modifierName + ".";
        }
      });
      fullKey += key;
      if (parts.length != 0 || key.length === 0) {
        return null;
      }
      const result = {};
      result["domEventName"] = domEventName;
      result["fullKey"] = fullKey;
      return result;
    }
    /**
     * Determines whether the actual keys pressed match the configured key code string.
     * The `fullKeyCode` event is normalized in the `parseEventName` method when the
     * event is attached to the DOM during the `addEventListener` call. This is unseen
     * by the end user and is normalized for internal consistency and parsing.
     *
     * @param event The keyboard event.
     * @param fullKeyCode The normalized user defined expected key event string
     * @returns boolean.
     */
    static matchEventFullKeyCode(event, fullKeyCode) {
      let keycode = _keyMap[event.key] || event.key;
      let key = "";
      if (fullKeyCode.indexOf("code.") > -1) {
        keycode = event.code;
        key = "code.";
      }
      if (keycode == null || !keycode)
        return false;
      keycode = keycode.toLowerCase();
      if (keycode === " ") {
        keycode = "space";
      } else if (keycode === ".") {
        keycode = "dot";
      }
      MODIFIER_KEYS.forEach((modifierName) => {
        if (modifierName !== keycode) {
          const modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
          if (modifierGetter(event)) {
            key += modifierName + ".";
          }
        }
      });
      key += keycode;
      return key === fullKeyCode;
    }
    /**
     * Configures a handler callback for a key event.
     * @param fullKey The event name that combines all simultaneous keystrokes.
     * @param handler The function that responds to the key event.
     * @param zone The zone in which the event occurred.
     * @returns A callback function.
     */
    static eventCallback(fullKey, handler, zone) {
      return (event) => {
        if (KeyEventsPlugin2.matchEventFullKeyCode(event, fullKey)) {
          zone.runGuarded(() => handler(event));
        }
      };
    }
    /** @internal */
    static _normalizeKey(keyName) {
      switch (keyName) {
        case "esc":
          return "escape";
        default:
          return keyName;
      }
    }
  }
  KeyEventsPlugin2.\u0275fac = function KeyEventsPlugin_Factory(t) {
    return new (t || KeyEventsPlugin2)(\u0275\u0275inject(DOCUMENT2));
  };
  KeyEventsPlugin2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: KeyEventsPlugin2,
    factory: KeyEventsPlugin2.\u0275fac
  });
  return KeyEventsPlugin2;
})();
var NG_DEV_MODE3 = typeof ngDevMode === "undefined" || !!ngDevMode;
function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
}
function errorHandler() {
  return new ErrorHandler();
}
function _document() {
  setDocument(document);
  return document;
}
var INTERNAL_BROWSER_PLATFORM_PROVIDERS = [{
  provide: PLATFORM_ID,
  useValue: PLATFORM_BROWSER_ID
}, {
  provide: PLATFORM_INITIALIZER,
  useValue: initDomAdapter,
  multi: true
}, {
  provide: DOCUMENT2,
  useFactory: _document,
  deps: []
}];
var platformBrowser = /* @__PURE__ */ createPlatformFactory(platformCore, "browser", INTERNAL_BROWSER_PLATFORM_PROVIDERS);
var BROWSER_MODULE_PROVIDERS_MARKER = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE3 ? "BrowserModule Providers Marker" : "");
var TESTABILITY_PROVIDERS = [{
  provide: TESTABILITY_GETTER,
  useClass: BrowserGetTestability,
  deps: []
}, {
  provide: TESTABILITY,
  useClass: Testability,
  deps: [NgZone, TestabilityRegistry, TESTABILITY_GETTER]
}, {
  provide: Testability,
  useClass: Testability,
  deps: [NgZone, TestabilityRegistry, TESTABILITY_GETTER]
}];
var BROWSER_MODULE_PROVIDERS = [{
  provide: INJECTOR_SCOPE,
  useValue: "root"
}, {
  provide: ErrorHandler,
  useFactory: errorHandler,
  deps: []
}, {
  provide: EVENT_MANAGER_PLUGINS,
  useClass: DomEventsPlugin,
  multi: true,
  deps: [DOCUMENT2, NgZone, PLATFORM_ID]
}, {
  provide: EVENT_MANAGER_PLUGINS,
  useClass: KeyEventsPlugin,
  multi: true,
  deps: [DOCUMENT2]
}, {
  provide: DomRendererFactory2,
  useClass: DomRendererFactory2,
  deps: [EventManager, DomSharedStylesHost, APP_ID, REMOVE_STYLES_ON_COMPONENT_DESTROY]
}, {
  provide: RendererFactory2,
  useExisting: DomRendererFactory2
}, {
  provide: SharedStylesHost,
  useExisting: DomSharedStylesHost
}, {
  provide: DomSharedStylesHost,
  useClass: DomSharedStylesHost,
  deps: [DOCUMENT2]
}, {
  provide: EventManager,
  useClass: EventManager,
  deps: [EVENT_MANAGER_PLUGINS, NgZone]
}, {
  provide: XhrFactory,
  useClass: BrowserXhr,
  deps: []
}, NG_DEV_MODE3 ? {
  provide: BROWSER_MODULE_PROVIDERS_MARKER,
  useValue: true
} : []];
var BrowserModule = /* @__PURE__ */ (() => {
  class BrowserModule2 {
    constructor(providersAlreadyPresent) {
      if (NG_DEV_MODE3 && providersAlreadyPresent) {
        throw new Error(`Providers from the \`BrowserModule\` have already been loaded. If you need access to common directives such as NgIf and NgFor, import the \`CommonModule\` instead.`);
      }
    }
    /**
     * Configures a browser-based app to transition from a server-rendered app, if
     * one is present on the page.
     *
     * @param params An object containing an identifier for the app to transition.
     * The ID must match between the client and server versions of the app.
     * @returns The reconfigured `BrowserModule` to import into the app's root `AppModule`.
     */
    static withServerTransition(params) {
      return {
        ngModule: BrowserModule2,
        providers: [{
          provide: APP_ID,
          useValue: params.appId
        }, {
          provide: TRANSITION_ID,
          useExisting: APP_ID
        }, SERVER_TRANSITION_PROVIDERS]
      };
    }
  }
  BrowserModule2.\u0275fac = function BrowserModule_Factory(t) {
    return new (t || BrowserModule2)(\u0275\u0275inject(BROWSER_MODULE_PROVIDERS_MARKER, 12));
  };
  BrowserModule2.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: BrowserModule2
  });
  BrowserModule2.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS],
    imports: [CommonModule, ApplicationModule]
  });
  return BrowserModule2;
})();
function createTitle() {
  return new Title(\u0275\u0275inject(DOCUMENT2));
}
var Title = /* @__PURE__ */ (() => {
  class Title2 {
    constructor(_doc) {
      this._doc = _doc;
    }
    /**
     * Get the title of the current HTML document.
     */
    getTitle() {
      return this._doc.title;
    }
    /**
     * Set the title of the current HTML document.
     * @param newTitle
     */
    setTitle(newTitle) {
      this._doc.title = newTitle || "";
    }
  }
  Title2.\u0275fac = function Title_Factory(t) {
    return new (t || Title2)(\u0275\u0275inject(DOCUMENT2));
  };
  Title2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: Title2,
    factory: function Title_Factory(t) {
      let r = null;
      if (t) {
        r = new t();
      } else {
        r = createTitle();
      }
      return r;
    },
    providedIn: "root"
  });
  return Title2;
})();

// node_modules/@angular/router/fesm2020/router.mjs
var PRIMARY_OUTLET = "primary";
var RouteTitleKey = /* @__PURE__ */ Symbol("RouteTitle");
var ParamsAsMap = class {
  constructor(params) {
    this.params = params || {};
  }
  has(name) {
    return Object.prototype.hasOwnProperty.call(this.params, name);
  }
  get(name) {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v[0] : v;
    }
    return null;
  }
  getAll(name) {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v : [v];
    }
    return [];
  }
  get keys() {
    return Object.keys(this.params);
  }
};
function convertToParamMap(params) {
  return new ParamsAsMap(params);
}
function defaultUrlMatcher(segments, segmentGroup, route) {
  const parts = route.path.split("/");
  if (parts.length > segments.length) {
    return null;
  }
  if (route.pathMatch === "full" && (segmentGroup.hasChildren() || parts.length < segments.length)) {
    return null;
  }
  const posParams = {};
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const segment = segments[index];
    const isParameter = part.startsWith(":");
    if (isParameter) {
      posParams[part.substring(1)] = segment;
    } else if (part !== segment.path) {
      return null;
    }
  }
  return {
    consumed: segments.slice(0, parts.length),
    posParams
  };
}
function shallowEqualArrays(a, b) {
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; ++i) {
    if (!shallowEqual(a[i], b[i]))
      return false;
  }
  return true;
}
function shallowEqual(a, b) {
  const k1 = a ? Object.keys(a) : void 0;
  const k2 = b ? Object.keys(b) : void 0;
  if (!k1 || !k2 || k1.length != k2.length) {
    return false;
  }
  let key;
  for (let i = 0; i < k1.length; i++) {
    key = k1[i];
    if (!equalArraysOrString(a[key], b[key])) {
      return false;
    }
  }
  return true;
}
function equalArraysOrString(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length)
      return false;
    const aSorted = [...a].sort();
    const bSorted = [...b].sort();
    return aSorted.every((val, index) => bSorted[index] === val);
  } else {
    return a === b;
  }
}
function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}
function last3(a) {
  return a.length > 0 ? a[a.length - 1] : null;
}
function forEach(map2, callback) {
  for (const prop in map2) {
    if (map2.hasOwnProperty(prop)) {
      callback(map2[prop], prop);
    }
  }
}
function wrapIntoObservable(value) {
  if (isObservable(value)) {
    return value;
  }
  if (isPromise2(value)) {
    return from(Promise.resolve(value));
  }
  return of(value);
}
var NG_DEV_MODE$b = typeof ngDevMode === "undefined" || ngDevMode;
var pathCompareMap = {
  "exact": equalSegmentGroups,
  "subset": containsSegmentGroup
};
var paramCompareMap = {
  "exact": equalParams,
  "subset": containsParams,
  "ignored": () => true
};
function containsTree(container, containee, options) {
  return pathCompareMap[options.paths](container.root, containee.root, options.matrixParams) && paramCompareMap[options.queryParams](container.queryParams, containee.queryParams) && !(options.fragment === "exact" && container.fragment !== containee.fragment);
}
function equalParams(container, containee) {
  return shallowEqual(container, containee);
}
function equalSegmentGroups(container, containee, matrixParams) {
  if (!equalPath(container.segments, containee.segments))
    return false;
  if (!matrixParamsMatch(container.segments, containee.segments, matrixParams)) {
    return false;
  }
  if (container.numberOfChildren !== containee.numberOfChildren)
    return false;
  for (const c in containee.children) {
    if (!container.children[c])
      return false;
    if (!equalSegmentGroups(container.children[c], containee.children[c], matrixParams))
      return false;
  }
  return true;
}
function containsParams(container, containee) {
  return Object.keys(containee).length <= Object.keys(container).length && Object.keys(containee).every((key) => equalArraysOrString(container[key], containee[key]));
}
function containsSegmentGroup(container, containee, matrixParams) {
  return containsSegmentGroupHelper(container, containee, containee.segments, matrixParams);
}
function containsSegmentGroupHelper(container, containee, containeePaths, matrixParams) {
  if (container.segments.length > containeePaths.length) {
    const current = container.segments.slice(0, containeePaths.length);
    if (!equalPath(current, containeePaths))
      return false;
    if (containee.hasChildren())
      return false;
    if (!matrixParamsMatch(current, containeePaths, matrixParams))
      return false;
    return true;
  } else if (container.segments.length === containeePaths.length) {
    if (!equalPath(container.segments, containeePaths))
      return false;
    if (!matrixParamsMatch(container.segments, containeePaths, matrixParams))
      return false;
    for (const c in containee.children) {
      if (!container.children[c])
        return false;
      if (!containsSegmentGroup(container.children[c], containee.children[c], matrixParams)) {
        return false;
      }
    }
    return true;
  } else {
    const current = containeePaths.slice(0, container.segments.length);
    const next = containeePaths.slice(container.segments.length);
    if (!equalPath(container.segments, current))
      return false;
    if (!matrixParamsMatch(container.segments, current, matrixParams))
      return false;
    if (!container.children[PRIMARY_OUTLET])
      return false;
    return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next, matrixParams);
  }
}
function matrixParamsMatch(containerPaths, containeePaths, options) {
  return containeePaths.every((containeeSegment, i) => {
    return paramCompareMap[options](containerPaths[i].parameters, containeeSegment.parameters);
  });
}
var UrlTree = class {
  constructor(root = new UrlSegmentGroup([], {}), queryParams = {}, fragment = null) {
    this.root = root;
    this.queryParams = queryParams;
    this.fragment = fragment;
    if (NG_DEV_MODE$b) {
      if (root.segments.length > 0) {
        throw new RuntimeError(4015, "The root `UrlSegmentGroup` should not contain `segments`. Instead, these segments belong in the `children` so they can be associated with a named outlet.");
      }
    }
  }
  get queryParamMap() {
    if (!this._queryParamMap) {
      this._queryParamMap = convertToParamMap(this.queryParams);
    }
    return this._queryParamMap;
  }
  /** @docsNotRequired */
  toString() {
    return DEFAULT_SERIALIZER.serialize(this);
  }
};
var UrlSegmentGroup = class {
  constructor(segments, children) {
    this.segments = segments;
    this.children = children;
    this.parent = null;
    forEach(children, (v, k) => v.parent = this);
  }
  /** Whether the segment has child segments */
  hasChildren() {
    return this.numberOfChildren > 0;
  }
  /** Number of child segments */
  get numberOfChildren() {
    return Object.keys(this.children).length;
  }
  /** @docsNotRequired */
  toString() {
    return serializePaths(this);
  }
};
var UrlSegment = class {
  constructor(path, parameters) {
    this.path = path;
    this.parameters = parameters;
  }
  get parameterMap() {
    if (!this._parameterMap) {
      this._parameterMap = convertToParamMap(this.parameters);
    }
    return this._parameterMap;
  }
  /** @docsNotRequired */
  toString() {
    return serializePath(this);
  }
};
function equalSegments(as, bs) {
  return equalPath(as, bs) && as.every((a, i) => shallowEqual(a.parameters, bs[i].parameters));
}
function equalPath(as, bs) {
  if (as.length !== bs.length)
    return false;
  return as.every((a, i) => a.path === bs[i].path);
}
function mapChildrenIntoArray(segment, fn) {
  let res = [];
  forEach(segment.children, (child, childOutlet) => {
    if (childOutlet === PRIMARY_OUTLET) {
      res = res.concat(fn(child, childOutlet));
    }
  });
  forEach(segment.children, (child, childOutlet) => {
    if (childOutlet !== PRIMARY_OUTLET) {
      res = res.concat(fn(child, childOutlet));
    }
  });
  return res;
}
var UrlSerializer = /* @__PURE__ */ (() => {
  class UrlSerializer2 {
  }
  UrlSerializer2.\u0275fac = function UrlSerializer_Factory(t) {
    return new (t || UrlSerializer2)();
  };
  UrlSerializer2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: UrlSerializer2,
    factory: function() {
      return (() => new DefaultUrlSerializer())();
    },
    providedIn: "root"
  });
  return UrlSerializer2;
})();
var DefaultUrlSerializer = class {
  /** Parses a url into a `UrlTree` */
  parse(url) {
    const p = new UrlParser(url);
    return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
  }
  /** Converts a `UrlTree` into a url */
  serialize(tree2) {
    const segment = `/${serializeSegment(tree2.root, true)}`;
    const query = serializeQueryParams(tree2.queryParams);
    const fragment = typeof tree2.fragment === `string` ? `#${encodeUriFragment(tree2.fragment)}` : "";
    return `${segment}${query}${fragment}`;
  }
};
var DEFAULT_SERIALIZER = /* @__PURE__ */ new DefaultUrlSerializer();
function serializePaths(segment) {
  return segment.segments.map((p) => serializePath(p)).join("/");
}
function serializeSegment(segment, root) {
  if (!segment.hasChildren()) {
    return serializePaths(segment);
  }
  if (root) {
    const primary = segment.children[PRIMARY_OUTLET] ? serializeSegment(segment.children[PRIMARY_OUTLET], false) : "";
    const children = [];
    forEach(segment.children, (v, k) => {
      if (k !== PRIMARY_OUTLET) {
        children.push(`${k}:${serializeSegment(v, false)}`);
      }
    });
    return children.length > 0 ? `${primary}(${children.join("//")})` : primary;
  } else {
    const children = mapChildrenIntoArray(segment, (v, k) => {
      if (k === PRIMARY_OUTLET) {
        return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
      }
      return [`${k}:${serializeSegment(v, false)}`];
    });
    if (Object.keys(segment.children).length === 1 && segment.children[PRIMARY_OUTLET] != null) {
      return `${serializePaths(segment)}/${children[0]}`;
    }
    return `${serializePaths(segment)}/(${children.join("//")})`;
  }
}
function encodeUriString(s) {
  return encodeURIComponent(s).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",");
}
function encodeUriQuery(s) {
  return encodeUriString(s).replace(/%3B/gi, ";");
}
function encodeUriFragment(s) {
  return encodeURI(s);
}
function encodeUriSegment(s) {
  return encodeUriString(s).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
}
function decode(s) {
  return decodeURIComponent(s);
}
function decodeQuery(s) {
  return decode(s.replace(/\+/g, "%20"));
}
function serializePath(path) {
  return `${encodeUriSegment(path.path)}${serializeMatrixParams(path.parameters)}`;
}
function serializeMatrixParams(params) {
  return Object.keys(params).map((key) => `;${encodeUriSegment(key)}=${encodeUriSegment(params[key])}`).join("");
}
function serializeQueryParams(params) {
  const strParams = Object.keys(params).map((name) => {
    const value = params[name];
    return Array.isArray(value) ? value.map((v) => `${encodeUriQuery(name)}=${encodeUriQuery(v)}`).join("&") : `${encodeUriQuery(name)}=${encodeUriQuery(value)}`;
  }).filter((s) => !!s);
  return strParams.length ? `?${strParams.join("&")}` : "";
}
var SEGMENT_RE = /^[^\/()?;=#]+/;
function matchSegments(str) {
  const match2 = str.match(SEGMENT_RE);
  return match2 ? match2[0] : "";
}
var QUERY_PARAM_RE = /^[^=?&#]+/;
function matchQueryParams(str) {
  const match2 = str.match(QUERY_PARAM_RE);
  return match2 ? match2[0] : "";
}
var QUERY_PARAM_VALUE_RE = /^[^&#]+/;
function matchUrlQueryParamValue(str) {
  const match2 = str.match(QUERY_PARAM_VALUE_RE);
  return match2 ? match2[0] : "";
}
var UrlParser = class {
  constructor(url) {
    this.url = url;
    this.remaining = url;
  }
  parseRootSegment() {
    this.consumeOptional("/");
    if (this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#")) {
      return new UrlSegmentGroup([], {});
    }
    return new UrlSegmentGroup([], this.parseChildren());
  }
  parseQueryParams() {
    const params = {};
    if (this.consumeOptional("?")) {
      do {
        this.parseQueryParam(params);
      } while (this.consumeOptional("&"));
    }
    return params;
  }
  parseFragment() {
    return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren() {
    if (this.remaining === "") {
      return {};
    }
    this.consumeOptional("/");
    const segments = [];
    if (!this.peekStartsWith("(")) {
      segments.push(this.parseSegment());
    }
    while (this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(")) {
      this.capture("/");
      segments.push(this.parseSegment());
    }
    let children = {};
    if (this.peekStartsWith("/(")) {
      this.capture("/");
      children = this.parseParens(true);
    }
    let res = {};
    if (this.peekStartsWith("(")) {
      res = this.parseParens(false);
    }
    if (segments.length > 0 || Object.keys(children).length > 0) {
      res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
    }
    return res;
  }
  // parse a segment with its matrix parameters
  // ie `name;k1=v1;k2`
  parseSegment() {
    const path = matchSegments(this.remaining);
    if (path === "" && this.peekStartsWith(";")) {
      throw new RuntimeError(4009, NG_DEV_MODE$b && `Empty path url segment cannot have parameters: '${this.remaining}'.`);
    }
    this.capture(path);
    return new UrlSegment(decode(path), this.parseMatrixParams());
  }
  parseMatrixParams() {
    const params = {};
    while (this.consumeOptional(";")) {
      this.parseParam(params);
    }
    return params;
  }
  parseParam(params) {
    const key = matchSegments(this.remaining);
    if (!key) {
      return;
    }
    this.capture(key);
    let value = "";
    if (this.consumeOptional("=")) {
      const valueMatch = matchSegments(this.remaining);
      if (valueMatch) {
        value = valueMatch;
        this.capture(value);
      }
    }
    params[decode(key)] = decode(value);
  }
  // Parse a single query parameter `name[=value]`
  parseQueryParam(params) {
    const key = matchQueryParams(this.remaining);
    if (!key) {
      return;
    }
    this.capture(key);
    let value = "";
    if (this.consumeOptional("=")) {
      const valueMatch = matchUrlQueryParamValue(this.remaining);
      if (valueMatch) {
        value = valueMatch;
        this.capture(value);
      }
    }
    const decodedKey = decodeQuery(key);
    const decodedVal = decodeQuery(value);
    if (params.hasOwnProperty(decodedKey)) {
      let currentVal = params[decodedKey];
      if (!Array.isArray(currentVal)) {
        currentVal = [currentVal];
        params[decodedKey] = currentVal;
      }
      currentVal.push(decodedVal);
    } else {
      params[decodedKey] = decodedVal;
    }
  }
  // parse `(a/b//outlet_name:c/d)`
  parseParens(allowPrimary) {
    const segments = {};
    this.capture("(");
    while (!this.consumeOptional(")") && this.remaining.length > 0) {
      const path = matchSegments(this.remaining);
      const next = this.remaining[path.length];
      if (next !== "/" && next !== ")" && next !== ";") {
        throw new RuntimeError(4010, NG_DEV_MODE$b && `Cannot parse url '${this.url}'`);
      }
      let outletName = void 0;
      if (path.indexOf(":") > -1) {
        outletName = path.slice(0, path.indexOf(":"));
        this.capture(outletName);
        this.capture(":");
      } else if (allowPrimary) {
        outletName = PRIMARY_OUTLET;
      }
      const children = this.parseChildren();
      segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] : new UrlSegmentGroup([], children);
      this.consumeOptional("//");
    }
    return segments;
  }
  peekStartsWith(str) {
    return this.remaining.startsWith(str);
  }
  // Consumes the prefix when it is present and returns whether it has been consumed
  consumeOptional(str) {
    if (this.peekStartsWith(str)) {
      this.remaining = this.remaining.substring(str.length);
      return true;
    }
    return false;
  }
  capture(str) {
    if (!this.consumeOptional(str)) {
      throw new RuntimeError(4011, NG_DEV_MODE$b && `Expected "${str}".`);
    }
  }
};
function createRoot(rootCandidate) {
  return rootCandidate.segments.length > 0 ? new UrlSegmentGroup([], {
    [PRIMARY_OUTLET]: rootCandidate
  }) : rootCandidate;
}
function squashSegmentGroup(segmentGroup) {
  const newChildren = {};
  for (const childOutlet of Object.keys(segmentGroup.children)) {
    const child = segmentGroup.children[childOutlet];
    const childCandidate = squashSegmentGroup(child);
    if (childCandidate.segments.length > 0 || childCandidate.hasChildren()) {
      newChildren[childOutlet] = childCandidate;
    }
  }
  const s = new UrlSegmentGroup(segmentGroup.segments, newChildren);
  return mergeTrivialChildren(s);
}
function mergeTrivialChildren(s) {
  if (s.numberOfChildren === 1 && s.children[PRIMARY_OUTLET]) {
    const c = s.children[PRIMARY_OUTLET];
    return new UrlSegmentGroup(s.segments.concat(c.segments), c.children);
  }
  return s;
}
function isUrlTree(v) {
  return v instanceof UrlTree;
}
var NG_DEV_MODE$a = typeof ngDevMode === "undefined" || ngDevMode;
function createSegmentGroupFromRoute(route) {
  let targetGroup;
  function createSegmentGroupFromRouteRecursive(currentRoute) {
    const childOutlets = {};
    for (const childSnapshot of currentRoute.children) {
      const root = createSegmentGroupFromRouteRecursive(childSnapshot);
      childOutlets[childSnapshot.outlet] = root;
    }
    const segmentGroup = new UrlSegmentGroup(currentRoute.url, childOutlets);
    if (currentRoute === route) {
      targetGroup = segmentGroup;
    }
    return segmentGroup;
  }
  const rootCandidate = createSegmentGroupFromRouteRecursive(route.root);
  const rootSegmentGroup = createRoot(rootCandidate);
  return targetGroup ?? rootSegmentGroup;
}
function createUrlTreeFromSegmentGroup(relativeTo, commands, queryParams, fragment) {
  let root = relativeTo;
  while (root.parent) {
    root = root.parent;
  }
  if (commands.length === 0) {
    return tree(root, root, root, queryParams, fragment);
  }
  const nav = computeNavigation(commands);
  if (nav.toRoot()) {
    return tree(root, root, new UrlSegmentGroup([], {}), queryParams, fragment);
  }
  const position = findStartingPositionForTargetGroup(nav, root, relativeTo);
  const newSegmentGroup = position.processChildren ? updateSegmentGroupChildren(position.segmentGroup, position.index, nav.commands) : updateSegmentGroup(position.segmentGroup, position.index, nav.commands);
  return tree(root, position.segmentGroup, newSegmentGroup, queryParams, fragment);
}
function createUrlTree(route, urlTree, commands, queryParams, fragment) {
  if (commands.length === 0) {
    return tree(urlTree.root, urlTree.root, urlTree.root, queryParams, fragment);
  }
  const nav = computeNavigation(commands);
  if (nav.toRoot()) {
    return tree(urlTree.root, urlTree.root, new UrlSegmentGroup([], {}), queryParams, fragment);
  }
  function createTreeUsingPathIndex(lastPathIndex) {
    const startingPosition = findStartingPosition(nav, urlTree, route.snapshot?._urlSegment, lastPathIndex);
    const segmentGroup = startingPosition.processChildren ? updateSegmentGroupChildren(startingPosition.segmentGroup, startingPosition.index, nav.commands) : updateSegmentGroup(startingPosition.segmentGroup, startingPosition.index, nav.commands);
    return tree(urlTree.root, startingPosition.segmentGroup, segmentGroup, queryParams, fragment);
  }
  const result = createTreeUsingPathIndex(route.snapshot?._lastPathIndex);
  return result;
}
function isMatrixParams(command) {
  return typeof command === "object" && command != null && !command.outlets && !command.segmentPath;
}
function isCommandWithOutlets(command) {
  return typeof command === "object" && command != null && command.outlets;
}
function tree(oldRoot, oldSegmentGroup, newSegmentGroup, queryParams, fragment) {
  let qp = {};
  if (queryParams) {
    forEach(queryParams, (value, name) => {
      qp[name] = Array.isArray(value) ? value.map((v) => `${v}`) : `${value}`;
    });
  }
  let rootCandidate;
  if (oldRoot === oldSegmentGroup) {
    rootCandidate = newSegmentGroup;
  } else {
    rootCandidate = replaceSegment(oldRoot, oldSegmentGroup, newSegmentGroup);
  }
  const newRoot = createRoot(squashSegmentGroup(rootCandidate));
  return new UrlTree(newRoot, qp, fragment);
}
function replaceSegment(current, oldSegment, newSegment) {
  const children = {};
  forEach(current.children, (c, outletName) => {
    if (c === oldSegment) {
      children[outletName] = newSegment;
    } else {
      children[outletName] = replaceSegment(c, oldSegment, newSegment);
    }
  });
  return new UrlSegmentGroup(current.segments, children);
}
var Navigation = class {
  constructor(isAbsolute, numberOfDoubleDots, commands) {
    this.isAbsolute = isAbsolute;
    this.numberOfDoubleDots = numberOfDoubleDots;
    this.commands = commands;
    if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
      throw new RuntimeError(4003, NG_DEV_MODE$a && "Root segment cannot have matrix parameters");
    }
    const cmdWithOutlet = commands.find(isCommandWithOutlets);
    if (cmdWithOutlet && cmdWithOutlet !== last3(commands)) {
      throw new RuntimeError(4004, NG_DEV_MODE$a && "{outlets:{}} has to be the last command");
    }
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/";
  }
};
function computeNavigation(commands) {
  if (typeof commands[0] === "string" && commands.length === 1 && commands[0] === "/") {
    return new Navigation(true, 0, commands);
  }
  let numberOfDoubleDots = 0;
  let isAbsolute = false;
  const res = commands.reduce((res2, cmd, cmdIdx) => {
    if (typeof cmd === "object" && cmd != null) {
      if (cmd.outlets) {
        const outlets = {};
        forEach(cmd.outlets, (commands2, name) => {
          outlets[name] = typeof commands2 === "string" ? commands2.split("/") : commands2;
        });
        return [...res2, {
          outlets
        }];
      }
      if (cmd.segmentPath) {
        return [...res2, cmd.segmentPath];
      }
    }
    if (!(typeof cmd === "string")) {
      return [...res2, cmd];
    }
    if (cmdIdx === 0) {
      cmd.split("/").forEach((urlPart, partIndex) => {
        if (partIndex == 0 && urlPart === ".") {
        } else if (partIndex == 0 && urlPart === "") {
          isAbsolute = true;
        } else if (urlPart === "..") {
          numberOfDoubleDots++;
        } else if (urlPart != "") {
          res2.push(urlPart);
        }
      });
      return res2;
    }
    return [...res2, cmd];
  }, []);
  return new Navigation(isAbsolute, numberOfDoubleDots, res);
}
var Position = class {
  constructor(segmentGroup, processChildren, index) {
    this.segmentGroup = segmentGroup;
    this.processChildren = processChildren;
    this.index = index;
  }
};
function findStartingPositionForTargetGroup(nav, root, target) {
  if (nav.isAbsolute) {
    return new Position(root, true, 0);
  }
  if (!target) {
    return new Position(root, false, NaN);
  }
  if (target.parent === null) {
    return new Position(target, true, 0);
  }
  const modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
  const index = target.segments.length - 1 + modifier;
  return createPositionApplyingDoubleDots(target, index, nav.numberOfDoubleDots);
}
function findStartingPosition(nav, tree2, segmentGroup, lastPathIndex) {
  if (nav.isAbsolute) {
    return new Position(tree2.root, true, 0);
  }
  if (lastPathIndex === -1) {
    const processChildren = segmentGroup === tree2.root;
    return new Position(segmentGroup, processChildren, 0);
  }
  const modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
  const index = lastPathIndex + modifier;
  return createPositionApplyingDoubleDots(segmentGroup, index, nav.numberOfDoubleDots);
}
function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
  let g = group;
  let ci = index;
  let dd = numberOfDoubleDots;
  while (dd > ci) {
    dd -= ci;
    g = g.parent;
    if (!g) {
      throw new RuntimeError(4005, NG_DEV_MODE$a && "Invalid number of '../'");
    }
    ci = g.segments.length;
  }
  return new Position(g, false, ci - dd);
}
function getOutlets(commands) {
  if (isCommandWithOutlets(commands[0])) {
    return commands[0].outlets;
  }
  return {
    [PRIMARY_OUTLET]: commands
  };
}
function updateSegmentGroup(segmentGroup, startIndex, commands) {
  if (!segmentGroup) {
    segmentGroup = new UrlSegmentGroup([], {});
  }
  if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
    return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
  }
  const m = prefixedWith(segmentGroup, startIndex, commands);
  const slicedCommands = commands.slice(m.commandIndex);
  if (m.match && m.pathIndex < segmentGroup.segments.length) {
    const g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
    g.children[PRIMARY_OUTLET] = new UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
    return updateSegmentGroupChildren(g, 0, slicedCommands);
  } else if (m.match && slicedCommands.length === 0) {
    return new UrlSegmentGroup(segmentGroup.segments, {});
  } else if (m.match && !segmentGroup.hasChildren()) {
    return createNewSegmentGroup(segmentGroup, startIndex, commands);
  } else if (m.match) {
    return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
  } else {
    return createNewSegmentGroup(segmentGroup, startIndex, commands);
  }
}
function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
  if (commands.length === 0) {
    return new UrlSegmentGroup(segmentGroup.segments, {});
  } else {
    const outlets = getOutlets(commands);
    const children = {};
    if (!outlets[PRIMARY_OUTLET] && segmentGroup.children[PRIMARY_OUTLET] && segmentGroup.numberOfChildren === 1 && segmentGroup.children[PRIMARY_OUTLET].segments.length === 0) {
      const childrenOfEmptyChild = updateSegmentGroupChildren(segmentGroup.children[PRIMARY_OUTLET], startIndex, commands);
      return new UrlSegmentGroup(segmentGroup.segments, childrenOfEmptyChild.children);
    }
    forEach(outlets, (commands2, outlet) => {
      if (typeof commands2 === "string") {
        commands2 = [commands2];
      }
      if (commands2 !== null) {
        children[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands2);
      }
    });
    forEach(segmentGroup.children, (child, childOutlet) => {
      if (outlets[childOutlet] === void 0) {
        children[childOutlet] = child;
      }
    });
    return new UrlSegmentGroup(segmentGroup.segments, children);
  }
}
function prefixedWith(segmentGroup, startIndex, commands) {
  let currentCommandIndex = 0;
  let currentPathIndex = startIndex;
  const noMatch2 = {
    match: false,
    pathIndex: 0,
    commandIndex: 0
  };
  while (currentPathIndex < segmentGroup.segments.length) {
    if (currentCommandIndex >= commands.length)
      return noMatch2;
    const path = segmentGroup.segments[currentPathIndex];
    const command = commands[currentCommandIndex];
    if (isCommandWithOutlets(command)) {
      break;
    }
    const curr = `${command}`;
    const next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
    if (currentPathIndex > 0 && curr === void 0)
      break;
    if (curr && next && typeof next === "object" && next.outlets === void 0) {
      if (!compare(curr, next, path))
        return noMatch2;
      currentCommandIndex += 2;
    } else {
      if (!compare(curr, {}, path))
        return noMatch2;
      currentCommandIndex++;
    }
    currentPathIndex++;
  }
  return {
    match: true,
    pathIndex: currentPathIndex,
    commandIndex: currentCommandIndex
  };
}
function createNewSegmentGroup(segmentGroup, startIndex, commands) {
  const paths = segmentGroup.segments.slice(0, startIndex);
  let i = 0;
  while (i < commands.length) {
    const command = commands[i];
    if (isCommandWithOutlets(command)) {
      const children = createNewSegmentChildren(command.outlets);
      return new UrlSegmentGroup(paths, children);
    }
    if (i === 0 && isMatrixParams(commands[0])) {
      const p = segmentGroup.segments[startIndex];
      paths.push(new UrlSegment(p.path, stringify2(commands[0])));
      i++;
      continue;
    }
    const curr = isCommandWithOutlets(command) ? command.outlets[PRIMARY_OUTLET] : `${command}`;
    const next = i < commands.length - 1 ? commands[i + 1] : null;
    if (curr && next && isMatrixParams(next)) {
      paths.push(new UrlSegment(curr, stringify2(next)));
      i += 2;
    } else {
      paths.push(new UrlSegment(curr, {}));
      i++;
    }
  }
  return new UrlSegmentGroup(paths, {});
}
function createNewSegmentChildren(outlets) {
  const children = {};
  forEach(outlets, (commands, outlet) => {
    if (typeof commands === "string") {
      commands = [commands];
    }
    if (commands !== null) {
      children[outlet] = createNewSegmentGroup(new UrlSegmentGroup([], {}), 0, commands);
    }
  });
  return children;
}
function stringify2(params) {
  const res = {};
  forEach(params, (v, k) => res[k] = `${v}`);
  return res;
}
function compare(path, params, segment) {
  return path == segment.path && shallowEqual(params, segment.parameters);
}
var IMPERATIVE_NAVIGATION = "imperative";
var RouterEvent = class {
  constructor(id, url) {
    this.id = id;
    this.url = url;
  }
};
var NavigationStart = class extends RouterEvent {
  constructor(id, url, navigationTrigger = "imperative", restoredState = null) {
    super(id, url);
    this.type = 0;
    this.navigationTrigger = navigationTrigger;
    this.restoredState = restoredState;
  }
  /** @docsNotRequired */
  toString() {
    return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
  }
};
var NavigationEnd = class extends RouterEvent {
  constructor(id, url, urlAfterRedirects) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.type = 1;
  }
  /** @docsNotRequired */
  toString() {
    return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
  }
};
var NavigationCancel = class extends RouterEvent {
  constructor(id, url, reason, code) {
    super(id, url);
    this.reason = reason;
    this.code = code;
    this.type = 2;
  }
  /** @docsNotRequired */
  toString() {
    return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
  }
};
var NavigationSkipped = class extends RouterEvent {
  constructor(id, url, reason, code) {
    super(id, url);
    this.reason = reason;
    this.code = code;
    this.type = 16;
  }
};
var NavigationError = class extends RouterEvent {
  constructor(id, url, error, target) {
    super(id, url);
    this.error = error;
    this.target = target;
    this.type = 3;
  }
  /** @docsNotRequired */
  toString() {
    return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
  }
};
var RoutesRecognized = class extends RouterEvent {
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
    this.type = 4;
  }
  /** @docsNotRequired */
  toString() {
    return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var GuardsCheckStart = class extends RouterEvent {
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
    this.type = 7;
  }
  toString() {
    return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var GuardsCheckEnd = class extends RouterEvent {
  constructor(id, url, urlAfterRedirects, state, shouldActivate) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
    this.shouldActivate = shouldActivate;
    this.type = 8;
  }
  toString() {
    return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
  }
};
var ResolveStart = class extends RouterEvent {
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
    this.type = 5;
  }
  toString() {
    return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var ResolveEnd = class extends RouterEvent {
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
    this.type = 6;
  }
  toString() {
    return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var RouteConfigLoadStart = class {
  constructor(route) {
    this.route = route;
    this.type = 9;
  }
  toString() {
    return `RouteConfigLoadStart(path: ${this.route.path})`;
  }
};
var RouteConfigLoadEnd = class {
  constructor(route) {
    this.route = route;
    this.type = 10;
  }
  toString() {
    return `RouteConfigLoadEnd(path: ${this.route.path})`;
  }
};
var ChildActivationStart = class {
  constructor(snapshot) {
    this.snapshot = snapshot;
    this.type = 11;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ChildActivationStart(path: '${path}')`;
  }
};
var ChildActivationEnd = class {
  constructor(snapshot) {
    this.snapshot = snapshot;
    this.type = 12;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ChildActivationEnd(path: '${path}')`;
  }
};
var ActivationStart = class {
  constructor(snapshot) {
    this.snapshot = snapshot;
    this.type = 13;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ActivationStart(path: '${path}')`;
  }
};
var ActivationEnd = class {
  constructor(snapshot) {
    this.snapshot = snapshot;
    this.type = 14;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ActivationEnd(path: '${path}')`;
  }
};
var Scroll = class {
  constructor(routerEvent, position, anchor) {
    this.routerEvent = routerEvent;
    this.position = position;
    this.anchor = anchor;
    this.type = 15;
  }
  toString() {
    const pos = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
    return `Scroll(anchor: '${this.anchor}', position: '${pos}')`;
  }
};
function stringifyEvent(routerEvent) {
  if (!("type" in routerEvent)) {
    return `Unknown Router Event: ${routerEvent.constructor.name}`;
  }
  switch (routerEvent.type) {
    case 14:
      return `ActivationEnd(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case 13:
      return `ActivationStart(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case 12:
      return `ChildActivationEnd(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case 11:
      return `ChildActivationStart(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case 8:
      return `GuardsCheckEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state}, shouldActivate: ${routerEvent.shouldActivate})`;
    case 7:
      return `GuardsCheckStart(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case 2:
      return `NavigationCancel(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case 16:
      return `NavigationSkipped(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case 1:
      return `NavigationEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}')`;
    case 3:
      return `NavigationError(id: ${routerEvent.id}, url: '${routerEvent.url}', error: ${routerEvent.error})`;
    case 0:
      return `NavigationStart(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case 6:
      return `ResolveEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case 5:
      return `ResolveStart(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case 10:
      return `RouteConfigLoadEnd(path: ${routerEvent.route.path})`;
    case 9:
      return `RouteConfigLoadStart(path: ${routerEvent.route.path})`;
    case 4:
      return `RoutesRecognized(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case 15:
      const pos = routerEvent.position ? `${routerEvent.position[0]}, ${routerEvent.position[1]}` : null;
      return `Scroll(anchor: '${routerEvent.anchor}', position: '${pos}')`;
  }
}
var NG_DEV_MODE$9 = typeof ngDevMode === "undefined" || ngDevMode;
var LegacyCreateUrlTree = /* @__PURE__ */ (() => {
  class LegacyCreateUrlTree2 {
    createUrlTree(relativeTo, currentState, currentUrlTree, commands, queryParams, fragment) {
      const a = relativeTo || currentState.root;
      const tree2 = createUrlTree(a, currentUrlTree, commands, queryParams, fragment);
      if (NG_DEV_MODE$9) {
        const treeFromSnapshotStrategy = new CreateUrlTreeUsingSnapshot().createUrlTree(relativeTo, currentState, currentUrlTree, commands, queryParams, fragment);
        if (treeFromSnapshotStrategy.toString() !== tree2.toString()) {
          let warningString = `The navigation to ${tree2.toString()} will instead go to ${treeFromSnapshotStrategy.toString()} in an upcoming version of Angular.`;
          if (!!relativeTo) {
            warningString += " `relativeTo` might need to be removed from the `UrlCreationOptions`.";
          }
          tree2._warnIfUsedForNavigation = warningString;
        }
      }
      return tree2;
    }
  }
  LegacyCreateUrlTree2.\u0275fac = function LegacyCreateUrlTree_Factory(t) {
    return new (t || LegacyCreateUrlTree2)();
  };
  LegacyCreateUrlTree2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: LegacyCreateUrlTree2,
    factory: LegacyCreateUrlTree2.\u0275fac
  });
  return LegacyCreateUrlTree2;
})();
var CreateUrlTreeUsingSnapshot = /* @__PURE__ */ (() => {
  class CreateUrlTreeUsingSnapshot2 {
    createUrlTree(relativeTo, currentState, currentUrlTree, commands, queryParams, fragment) {
      let relativeToUrlSegmentGroup;
      try {
        const relativeToSnapshot = relativeTo ? relativeTo.snapshot : currentState.snapshot.root;
        relativeToUrlSegmentGroup = createSegmentGroupFromRoute(relativeToSnapshot);
      } catch (e) {
        if (typeof commands[0] !== "string" || !commands[0].startsWith("/")) {
          commands = [];
        }
        relativeToUrlSegmentGroup = currentUrlTree.root;
      }
      return createUrlTreeFromSegmentGroup(relativeToUrlSegmentGroup, commands, queryParams, fragment);
    }
  }
  CreateUrlTreeUsingSnapshot2.\u0275fac = function CreateUrlTreeUsingSnapshot_Factory(t) {
    return new (t || CreateUrlTreeUsingSnapshot2)();
  };
  CreateUrlTreeUsingSnapshot2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: CreateUrlTreeUsingSnapshot2,
    factory: CreateUrlTreeUsingSnapshot2.\u0275fac
  });
  return CreateUrlTreeUsingSnapshot2;
})();
var CreateUrlTreeStrategy = /* @__PURE__ */ (() => {
  class CreateUrlTreeStrategy2 {
  }
  CreateUrlTreeStrategy2.\u0275fac = function CreateUrlTreeStrategy_Factory(t) {
    return new (t || CreateUrlTreeStrategy2)();
  };
  CreateUrlTreeStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: CreateUrlTreeStrategy2,
    factory: function(t) {
      return LegacyCreateUrlTree.\u0275fac(t);
    },
    providedIn: "root"
  });
  return CreateUrlTreeStrategy2;
})();
var Tree = class {
  constructor(root) {
    this._root = root;
  }
  get root() {
    return this._root.value;
  }
  /**
   * @internal
   */
  parent(t) {
    const p = this.pathFromRoot(t);
    return p.length > 1 ? p[p.length - 2] : null;
  }
  /**
   * @internal
   */
  children(t) {
    const n = findNode(t, this._root);
    return n ? n.children.map((t2) => t2.value) : [];
  }
  /**
   * @internal
   */
  firstChild(t) {
    const n = findNode(t, this._root);
    return n && n.children.length > 0 ? n.children[0].value : null;
  }
  /**
   * @internal
   */
  siblings(t) {
    const p = findPath(t, this._root);
    if (p.length < 2)
      return [];
    const c = p[p.length - 2].children.map((c2) => c2.value);
    return c.filter((cc) => cc !== t);
  }
  /**
   * @internal
   */
  pathFromRoot(t) {
    return findPath(t, this._root).map((s) => s.value);
  }
};
function findNode(value, node) {
  if (value === node.value)
    return node;
  for (const child of node.children) {
    const node2 = findNode(value, child);
    if (node2)
      return node2;
  }
  return null;
}
function findPath(value, node) {
  if (value === node.value)
    return [node];
  for (const child of node.children) {
    const path = findPath(value, child);
    if (path.length) {
      path.unshift(node);
      return path;
    }
  }
  return [];
}
var TreeNode = class {
  constructor(value, children) {
    this.value = value;
    this.children = children;
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function nodeChildrenAsMap(node) {
  const map2 = {};
  if (node) {
    node.children.forEach((child) => map2[child.value.outlet] = child);
  }
  return map2;
}
var RouterState = class extends Tree {
  /** @internal */
  constructor(root, snapshot) {
    super(root);
    this.snapshot = snapshot;
    setRouterState(this, root);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function createEmptyState(urlTree, rootComponent) {
  const snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
  const emptyUrl = new BehaviorSubject([new UrlSegment("", {})]);
  const emptyParams = new BehaviorSubject({});
  const emptyData = new BehaviorSubject({});
  const emptyQueryParams = new BehaviorSubject({});
  const fragment = new BehaviorSubject("");
  const activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
  activated.snapshot = snapshot.root;
  return new RouterState(new TreeNode(activated, []), snapshot);
}
function createEmptyStateSnapshot(urlTree, rootComponent) {
  const emptyParams = {};
  const emptyData = {};
  const emptyQueryParams = {};
  const fragment = "";
  const activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
  return new RouterStateSnapshot("", new TreeNode(activated, []));
}
var ActivatedRoute = class {
  /** @internal */
  constructor(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
    this.url = url;
    this.params = params;
    this.queryParams = queryParams;
    this.fragment = fragment;
    this.data = data;
    this.outlet = outlet;
    this.component = component;
    this.title = this.data?.pipe(map((d) => d[RouteTitleKey])) ?? of(void 0);
    this._futureSnapshot = futureSnapshot;
  }
  /** The configuration used to match this route. */
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  /** The root of the router state. */
  get root() {
    return this._routerState.root;
  }
  /** The parent of this route in the router state tree. */
  get parent() {
    return this._routerState.parent(this);
  }
  /** The first child of this route in the router state tree. */
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  /** The children of this route in the router state tree. */
  get children() {
    return this._routerState.children(this);
  }
  /** The path from the root of the router state tree to this route. */
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  /**
   * An Observable that contains a map of the required and optional parameters
   * specific to the route.
   * The map supports retrieving single and multiple values from the same parameter.
   */
  get paramMap() {
    if (!this._paramMap) {
      this._paramMap = this.params.pipe(map((p) => convertToParamMap(p)));
    }
    return this._paramMap;
  }
  /**
   * An Observable that contains a map of the query parameters available to all routes.
   * The map supports retrieving single and multiple values from the query parameter.
   */
  get queryParamMap() {
    if (!this._queryParamMap) {
      this._queryParamMap = this.queryParams.pipe(map((p) => convertToParamMap(p)));
    }
    return this._queryParamMap;
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function inheritedParamsDataResolve(route, paramsInheritanceStrategy = "emptyOnly") {
  const pathFromRoot = route.pathFromRoot;
  let inheritingStartingFrom = 0;
  if (paramsInheritanceStrategy !== "always") {
    inheritingStartingFrom = pathFromRoot.length - 1;
    while (inheritingStartingFrom >= 1) {
      const current = pathFromRoot[inheritingStartingFrom];
      const parent = pathFromRoot[inheritingStartingFrom - 1];
      if (current.routeConfig && current.routeConfig.path === "") {
        inheritingStartingFrom--;
      } else if (!parent.component) {
        inheritingStartingFrom--;
      } else {
        break;
      }
    }
  }
  return flattenInherited(pathFromRoot.slice(inheritingStartingFrom));
}
function flattenInherited(pathFromRoot) {
  return pathFromRoot.reduce((res, curr) => {
    const params = __spreadValues(__spreadValues({}, res.params), curr.params);
    const data = __spreadValues(__spreadValues({}, res.data), curr.data);
    const resolve = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, curr.data), res.resolve), curr.routeConfig?.data), curr._resolvedData);
    return {
      params,
      data,
      resolve
    };
  }, {
    params: {},
    data: {},
    resolve: {}
  });
}
var ActivatedRouteSnapshot = class {
  /** The resolved route title */
  get title() {
    return this.data?.[RouteTitleKey];
  }
  /** @internal */
  constructor(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
    this.url = url;
    this.params = params;
    this.queryParams = queryParams;
    this.fragment = fragment;
    this.data = data;
    this.outlet = outlet;
    this.component = component;
    this.routeConfig = routeConfig;
    this._urlSegment = urlSegment;
    this._lastPathIndex = lastPathIndex;
    this._resolve = resolve;
  }
  /** The root of the router state */
  get root() {
    return this._routerState.root;
  }
  /** The parent of this route in the router state tree */
  get parent() {
    return this._routerState.parent(this);
  }
  /** The first child of this route in the router state tree */
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  /** The children of this route in the router state tree */
  get children() {
    return this._routerState.children(this);
  }
  /** The path from the root of the router state tree to this route */
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    if (!this._paramMap) {
      this._paramMap = convertToParamMap(this.params);
    }
    return this._paramMap;
  }
  get queryParamMap() {
    if (!this._queryParamMap) {
      this._queryParamMap = convertToParamMap(this.queryParams);
    }
    return this._queryParamMap;
  }
  toString() {
    const url = this.url.map((segment) => segment.toString()).join("/");
    const matched = this.routeConfig ? this.routeConfig.path : "";
    return `Route(url:'${url}', path:'${matched}')`;
  }
};
var RouterStateSnapshot = class extends Tree {
  /** @internal */
  constructor(url, root) {
    super(root);
    this.url = url;
    setRouterState(this, root);
  }
  toString() {
    return serializeNode(this._root);
  }
};
function setRouterState(state, node) {
  node.value._routerState = state;
  node.children.forEach((c) => setRouterState(state, c));
}
function serializeNode(node) {
  const c = node.children.length > 0 ? ` { ${node.children.map(serializeNode).join(", ")} } ` : "";
  return `${node.value}${c}`;
}
function advanceActivatedRoute(route) {
  if (route.snapshot) {
    const currentSnapshot = route.snapshot;
    const nextSnapshot = route._futureSnapshot;
    route.snapshot = nextSnapshot;
    if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
      route.queryParams.next(nextSnapshot.queryParams);
    }
    if (currentSnapshot.fragment !== nextSnapshot.fragment) {
      route.fragment.next(nextSnapshot.fragment);
    }
    if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
      route.params.next(nextSnapshot.params);
    }
    if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
      route.url.next(nextSnapshot.url);
    }
    if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
      route.data.next(nextSnapshot.data);
    }
  } else {
    route.snapshot = route._futureSnapshot;
    route.data.next(route._futureSnapshot.data);
  }
}
function equalParamsAndUrlSegments(a, b) {
  const equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
  const parentsMismatch = !a.parent !== !b.parent;
  return equalUrlParams && !parentsMismatch && (!a.parent || equalParamsAndUrlSegments(a.parent, b.parent));
}
function createRouterState(routeReuseStrategy, curr, prevState) {
  const root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : void 0);
  return new RouterState(root, curr);
}
function createNode(routeReuseStrategy, curr, prevState) {
  if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
    const value = prevState.value;
    value._futureSnapshot = curr.value;
    const children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
    return new TreeNode(value, children);
  } else {
    if (routeReuseStrategy.shouldAttach(curr.value)) {
      const detachedRouteHandle = routeReuseStrategy.retrieve(curr.value);
      if (detachedRouteHandle !== null) {
        const tree2 = detachedRouteHandle.route;
        tree2.value._futureSnapshot = curr.value;
        tree2.children = curr.children.map((c) => createNode(routeReuseStrategy, c));
        return tree2;
      }
    }
    const value = createActivatedRoute(curr.value);
    const children = curr.children.map((c) => createNode(routeReuseStrategy, c));
    return new TreeNode(value, children);
  }
}
function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
  return curr.children.map((child) => {
    for (const p of prevState.children) {
      if (routeReuseStrategy.shouldReuseRoute(child.value, p.value.snapshot)) {
        return createNode(routeReuseStrategy, child, p);
      }
    }
    return createNode(routeReuseStrategy, child);
  });
}
function createActivatedRoute(c) {
  return new ActivatedRoute(new BehaviorSubject(c.url), new BehaviorSubject(c.params), new BehaviorSubject(c.queryParams), new BehaviorSubject(c.fragment), new BehaviorSubject(c.data), c.outlet, c.component, c);
}
var NAVIGATION_CANCELING_ERROR = "ngNavigationCancelingError";
function redirectingNavigationError(urlSerializer, redirect) {
  const {
    redirectTo,
    navigationBehaviorOptions
  } = isUrlTree(redirect) ? {
    redirectTo: redirect,
    navigationBehaviorOptions: void 0
  } : redirect;
  const error = navigationCancelingError(ngDevMode && `Redirecting to "${urlSerializer.serialize(redirectTo)}"`, 0, redirect);
  error.url = redirectTo;
  error.navigationBehaviorOptions = navigationBehaviorOptions;
  return error;
}
function navigationCancelingError(message, code, redirectUrl) {
  const error = new Error("NavigationCancelingError: " + (message || ""));
  error[NAVIGATION_CANCELING_ERROR] = true;
  error.cancellationCode = code;
  if (redirectUrl) {
    error.url = redirectUrl;
  }
  return error;
}
function isRedirectingNavigationCancelingError$1(error) {
  return isNavigationCancelingError$1(error) && isUrlTree(error.url);
}
function isNavigationCancelingError$1(error) {
  return error && error[NAVIGATION_CANCELING_ERROR];
}
var OutletContext = class {
  constructor() {
    this.outlet = null;
    this.route = null;
    this.resolver = null;
    this.injector = null;
    this.children = new ChildrenOutletContexts();
    this.attachRef = null;
  }
};
var ChildrenOutletContexts = /* @__PURE__ */ (() => {
  class ChildrenOutletContexts2 {
    constructor() {
      this.contexts = /* @__PURE__ */ new Map();
    }
    /** Called when a `RouterOutlet` directive is instantiated */
    onChildOutletCreated(childName, outlet) {
      const context2 = this.getOrCreateContext(childName);
      context2.outlet = outlet;
      this.contexts.set(childName, context2);
    }
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     */
    onChildOutletDestroyed(childName) {
      const context2 = this.getContext(childName);
      if (context2) {
        context2.outlet = null;
        context2.attachRef = null;
      }
    }
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     */
    onOutletDeactivated() {
      const contexts = this.contexts;
      this.contexts = /* @__PURE__ */ new Map();
      return contexts;
    }
    onOutletReAttached(contexts) {
      this.contexts = contexts;
    }
    getOrCreateContext(childName) {
      let context2 = this.getContext(childName);
      if (!context2) {
        context2 = new OutletContext();
        this.contexts.set(childName, context2);
      }
      return context2;
    }
    getContext(childName) {
      return this.contexts.get(childName) || null;
    }
  }
  ChildrenOutletContexts2.\u0275fac = function ChildrenOutletContexts_Factory(t) {
    return new (t || ChildrenOutletContexts2)();
  };
  ChildrenOutletContexts2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: ChildrenOutletContexts2,
    factory: ChildrenOutletContexts2.\u0275fac,
    providedIn: "root"
  });
  return ChildrenOutletContexts2;
})();
var NG_DEV_MODE$8 = typeof ngDevMode === "undefined" || ngDevMode;
var RouterOutlet = /* @__PURE__ */ (() => {
  class RouterOutlet2 {
    constructor() {
      this.activated = null;
      this._activatedRoute = null;
      this.name = PRIMARY_OUTLET;
      this.activateEvents = new EventEmitter();
      this.deactivateEvents = new EventEmitter();
      this.attachEvents = new EventEmitter();
      this.detachEvents = new EventEmitter();
      this.parentContexts = inject(ChildrenOutletContexts);
      this.location = inject(ViewContainerRef);
      this.changeDetector = inject(ChangeDetectorRef);
      this.environmentInjector = inject(EnvironmentInjector);
    }
    /** @nodoc */
    ngOnChanges(changes) {
      if (changes["name"]) {
        const {
          firstChange,
          previousValue
        } = changes["name"];
        if (firstChange) {
          return;
        }
        if (this.isTrackedInParentContexts(previousValue)) {
          this.deactivate();
          this.parentContexts.onChildOutletDestroyed(previousValue);
        }
        this.initializeOutletWithName();
      }
    }
    /** @nodoc */
    ngOnDestroy() {
      if (this.isTrackedInParentContexts(this.name)) {
        this.parentContexts.onChildOutletDestroyed(this.name);
      }
    }
    isTrackedInParentContexts(outletName) {
      return this.parentContexts.getContext(outletName)?.outlet === this;
    }
    /** @nodoc */
    ngOnInit() {
      this.initializeOutletWithName();
    }
    initializeOutletWithName() {
      this.parentContexts.onChildOutletCreated(this.name, this);
      if (this.activated) {
        return;
      }
      const context2 = this.parentContexts.getContext(this.name);
      if (context2?.route) {
        if (context2.attachRef) {
          this.attach(context2.attachRef, context2.route);
        } else {
          this.activateWith(context2.route, context2.injector);
        }
      }
    }
    get isActivated() {
      return !!this.activated;
    }
    /**
     * @returns The currently activated component instance.
     * @throws An error if the outlet is not activated.
     */
    get component() {
      if (!this.activated)
        throw new RuntimeError(4012, NG_DEV_MODE$8 && "Outlet is not activated");
      return this.activated.instance;
    }
    get activatedRoute() {
      if (!this.activated)
        throw new RuntimeError(4012, NG_DEV_MODE$8 && "Outlet is not activated");
      return this._activatedRoute;
    }
    get activatedRouteData() {
      if (this._activatedRoute) {
        return this._activatedRoute.snapshot.data;
      }
      return {};
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach() {
      if (!this.activated)
        throw new RuntimeError(4012, NG_DEV_MODE$8 && "Outlet is not activated");
      this.location.detach();
      const cmp = this.activated;
      this.activated = null;
      this._activatedRoute = null;
      this.detachEvents.emit(cmp.instance);
      return cmp;
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref, activatedRoute) {
      this.activated = ref;
      this._activatedRoute = activatedRoute;
      this.location.insert(ref.hostView);
      this.attachEvents.emit(ref.instance);
    }
    deactivate() {
      if (this.activated) {
        const c = this.component;
        this.activated.destroy();
        this.activated = null;
        this._activatedRoute = null;
        this.deactivateEvents.emit(c);
      }
    }
    activateWith(activatedRoute, resolverOrInjector) {
      if (this.isActivated) {
        throw new RuntimeError(4013, NG_DEV_MODE$8 && "Cannot activate an already activated outlet");
      }
      this._activatedRoute = activatedRoute;
      const location2 = this.location;
      const snapshot = activatedRoute.snapshot;
      const component = snapshot.component;
      const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
      const injector = new OutletInjector(activatedRoute, childContexts, location2.injector);
      if (resolverOrInjector && isComponentFactoryResolver(resolverOrInjector)) {
        const factory = resolverOrInjector.resolveComponentFactory(component);
        this.activated = location2.createComponent(factory, location2.length, injector);
      } else {
        const environmentInjector = resolverOrInjector ?? this.environmentInjector;
        this.activated = location2.createComponent(component, {
          index: location2.length,
          injector,
          environmentInjector
        });
      }
      this.changeDetector.markForCheck();
      this.activateEvents.emit(this.activated.instance);
    }
  }
  RouterOutlet2.\u0275fac = function RouterOutlet_Factory(t) {
    return new (t || RouterOutlet2)();
  };
  RouterOutlet2.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: RouterOutlet2,
    selectors: [["router-outlet"]],
    inputs: {
      name: "name"
    },
    outputs: {
      activateEvents: "activate",
      deactivateEvents: "deactivate",
      attachEvents: "attach",
      detachEvents: "detach"
    },
    exportAs: ["outlet"],
    standalone: true,
    features: [\u0275\u0275NgOnChangesFeature]
  });
  return RouterOutlet2;
})();
var OutletInjector = class {
  constructor(route, childContexts, parent) {
    this.route = route;
    this.childContexts = childContexts;
    this.parent = parent;
  }
  get(token, notFoundValue) {
    if (token === ActivatedRoute) {
      return this.route;
    }
    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }
    return this.parent.get(token, notFoundValue);
  }
};
function isComponentFactoryResolver(item) {
  return !!item.resolveComponentFactory;
}
var \u0275EmptyOutletComponent = /* @__PURE__ */ (() => {
  class \u0275EmptyOutletComponent2 {
  }
  \u0275EmptyOutletComponent2.\u0275fac = function \u0275EmptyOutletComponent_Factory(t) {
    return new (t || \u0275EmptyOutletComponent2)();
  };
  \u0275EmptyOutletComponent2.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: \u0275EmptyOutletComponent2,
    selectors: [["ng-component"]],
    standalone: true,
    features: [\u0275\u0275StandaloneFeature],
    decls: 1,
    vars: 0,
    template: function \u0275EmptyOutletComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "router-outlet");
      }
    },
    dependencies: [RouterOutlet],
    encapsulation: 2
  });
  return \u0275EmptyOutletComponent2;
})();
function getOrCreateRouteInjectorIfNeeded(route, currentInjector) {
  if (route.providers && !route._injector) {
    route._injector = createEnvironmentInjector(route.providers, currentInjector, `Route: ${route.path}`);
  }
  return route._injector ?? currentInjector;
}
function validateConfig(config2, parentPath = "", requireStandaloneComponents = false) {
  for (let i = 0; i < config2.length; i++) {
    const route = config2[i];
    const fullPath = getFullPath(parentPath, route);
    validateNode(route, fullPath, requireStandaloneComponents);
  }
}
function assertStandalone(fullPath, component) {
  if (component && isNgModule(component)) {
    throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}'. You are using 'loadComponent' with a module, but it must be used with standalone components. Use 'loadChildren' instead.`);
  } else if (component && !isStandalone(component)) {
    throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}'. The component must be standalone.`);
  }
}
function validateNode(route, fullPath, requireStandaloneComponents) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (!route) {
      throw new RuntimeError(4014, `
      Invalid configuration of route '${fullPath}': Encountered undefined route.
      The reason might be an extra comma.

      Example:
      const routes: Routes = [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: 'dashboard',  component: DashboardComponent },, << two commas
        { path: 'detail/:id', component: HeroDetailComponent }
      ];
    `);
    }
    if (Array.isArray(route)) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': Array cannot be specified`);
    }
    if (!route.redirectTo && !route.component && !route.loadComponent && !route.children && !route.loadChildren && route.outlet && route.outlet !== PRIMARY_OUTLET) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': a componentless route without children or loadChildren cannot have a named outlet set`);
    }
    if (route.redirectTo && route.children) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and children cannot be used together`);
    }
    if (route.redirectTo && route.loadChildren) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and loadChildren cannot be used together`);
    }
    if (route.children && route.loadChildren) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': children and loadChildren cannot be used together`);
    }
    if (route.redirectTo && (route.component || route.loadComponent)) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and component/loadComponent cannot be used together`);
    }
    if (route.component && route.loadComponent) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': component and loadComponent cannot be used together`);
    }
    if (route.redirectTo && route.canActivate) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and canActivate cannot be used together. Redirects happen before activation so canActivate will never be executed.`);
    }
    if (route.path && route.matcher) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': path and matcher cannot be used together`);
    }
    if (route.redirectTo === void 0 && !route.component && !route.loadComponent && !route.children && !route.loadChildren) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}'. One of the following must be provided: component, loadComponent, redirectTo, children or loadChildren`);
    }
    if (route.path === void 0 && route.matcher === void 0) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': routes must have either a path or a matcher specified`);
    }
    if (typeof route.path === "string" && route.path.charAt(0) === "/") {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': path cannot start with a slash`);
    }
    if (route.path === "" && route.redirectTo !== void 0 && route.pathMatch === void 0) {
      const exp = `The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`;
      throw new RuntimeError(4014, `Invalid configuration of route '{path: "${fullPath}", redirectTo: "${route.redirectTo}"}': please provide 'pathMatch'. ${exp}`);
    }
    if (requireStandaloneComponents) {
      assertStandalone(fullPath, route.component);
    }
  }
  if (route.children) {
    validateConfig(route.children, fullPath, requireStandaloneComponents);
  }
}
function getFullPath(parentPath, currentRoute) {
  if (!currentRoute) {
    return parentPath;
  }
  if (!parentPath && !currentRoute.path) {
    return "";
  } else if (parentPath && !currentRoute.path) {
    return `${parentPath}/`;
  } else if (!parentPath && currentRoute.path) {
    return currentRoute.path;
  } else {
    return `${parentPath}/${currentRoute.path}`;
  }
}
function standardizeConfig(r) {
  const children = r.children && r.children.map(standardizeConfig);
  const c = children ? __spreadProps(__spreadValues({}, r), {
    children
  }) : __spreadValues({}, r);
  if (!c.component && !c.loadComponent && (children || c.loadChildren) && c.outlet && c.outlet !== PRIMARY_OUTLET) {
    c.component = \u0275EmptyOutletComponent;
  }
  return c;
}
function getOutlet(route) {
  return route.outlet || PRIMARY_OUTLET;
}
function sortByMatchingOutlets(routes2, outletName) {
  const sortedConfig = routes2.filter((r) => getOutlet(r) === outletName);
  sortedConfig.push(...routes2.filter((r) => getOutlet(r) !== outletName));
  return sortedConfig;
}
function getClosestRouteInjector(snapshot) {
  if (!snapshot)
    return null;
  if (snapshot.routeConfig?._injector) {
    return snapshot.routeConfig._injector;
  }
  for (let s = snapshot.parent; s; s = s.parent) {
    const route = s.routeConfig;
    if (route?._loadedInjector)
      return route._loadedInjector;
    if (route?._injector)
      return route._injector;
  }
  return null;
}
var activateRoutes = (rootContexts, routeReuseStrategy, forwardEvent) => map((t) => {
  new ActivateRoutes(routeReuseStrategy, t.targetRouterState, t.currentRouterState, forwardEvent).activate(rootContexts);
  return t;
});
var ActivateRoutes = class {
  constructor(routeReuseStrategy, futureState, currState, forwardEvent) {
    this.routeReuseStrategy = routeReuseStrategy;
    this.futureState = futureState;
    this.currState = currState;
    this.forwardEvent = forwardEvent;
  }
  activate(parentContexts) {
    const futureRoot = this.futureState._root;
    const currRoot = this.currState ? this.currState._root : null;
    this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
    advanceActivatedRoute(this.futureState.root);
    this.activateChildRoutes(futureRoot, currRoot, parentContexts);
  }
  // De-activate the child route that are not re-used for the future state
  deactivateChildRoutes(futureNode, currNode, contexts) {
    const children = nodeChildrenAsMap(currNode);
    futureNode.children.forEach((futureChild) => {
      const childOutletName = futureChild.value.outlet;
      this.deactivateRoutes(futureChild, children[childOutletName], contexts);
      delete children[childOutletName];
    });
    forEach(children, (v, childName) => {
      this.deactivateRouteAndItsChildren(v, contexts);
    });
  }
  deactivateRoutes(futureNode, currNode, parentContext) {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;
    if (future === curr) {
      if (future.component) {
        const context2 = parentContext.getContext(future.outlet);
        if (context2) {
          this.deactivateChildRoutes(futureNode, currNode, context2.children);
        }
      } else {
        this.deactivateChildRoutes(futureNode, currNode, parentContext);
      }
    } else {
      if (curr) {
        this.deactivateRouteAndItsChildren(currNode, parentContext);
      }
    }
  }
  deactivateRouteAndItsChildren(route, parentContexts) {
    if (route.value.component && this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
      this.detachAndStoreRouteSubtree(route, parentContexts);
    } else {
      this.deactivateRouteAndOutlet(route, parentContexts);
    }
  }
  detachAndStoreRouteSubtree(route, parentContexts) {
    const context2 = parentContexts.getContext(route.value.outlet);
    const contexts = context2 && route.value.component ? context2.children : parentContexts;
    const children = nodeChildrenAsMap(route);
    for (const childOutlet of Object.keys(children)) {
      this.deactivateRouteAndItsChildren(children[childOutlet], contexts);
    }
    if (context2 && context2.outlet) {
      const componentRef = context2.outlet.detach();
      const contexts2 = context2.children.onOutletDeactivated();
      this.routeReuseStrategy.store(route.value.snapshot, {
        componentRef,
        route,
        contexts: contexts2
      });
    }
  }
  deactivateRouteAndOutlet(route, parentContexts) {
    const context2 = parentContexts.getContext(route.value.outlet);
    const contexts = context2 && route.value.component ? context2.children : parentContexts;
    const children = nodeChildrenAsMap(route);
    for (const childOutlet of Object.keys(children)) {
      this.deactivateRouteAndItsChildren(children[childOutlet], contexts);
    }
    if (context2) {
      if (context2.outlet) {
        context2.outlet.deactivate();
        context2.children.onOutletDeactivated();
      }
      context2.attachRef = null;
      context2.resolver = null;
      context2.route = null;
    }
  }
  activateChildRoutes(futureNode, currNode, contexts) {
    const children = nodeChildrenAsMap(currNode);
    futureNode.children.forEach((c) => {
      this.activateRoutes(c, children[c.value.outlet], contexts);
      this.forwardEvent(new ActivationEnd(c.value.snapshot));
    });
    if (futureNode.children.length) {
      this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
    }
  }
  activateRoutes(futureNode, currNode, parentContexts) {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;
    advanceActivatedRoute(future);
    if (future === curr) {
      if (future.component) {
        const context2 = parentContexts.getOrCreateContext(future.outlet);
        this.activateChildRoutes(futureNode, currNode, context2.children);
      } else {
        this.activateChildRoutes(futureNode, currNode, parentContexts);
      }
    } else {
      if (future.component) {
        const context2 = parentContexts.getOrCreateContext(future.outlet);
        if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
          const stored = this.routeReuseStrategy.retrieve(future.snapshot);
          this.routeReuseStrategy.store(future.snapshot, null);
          context2.children.onOutletReAttached(stored.contexts);
          context2.attachRef = stored.componentRef;
          context2.route = stored.route.value;
          if (context2.outlet) {
            context2.outlet.attach(stored.componentRef, stored.route.value);
          }
          advanceActivatedRoute(stored.route.value);
          this.activateChildRoutes(futureNode, null, context2.children);
        } else {
          const injector = getClosestRouteInjector(future.snapshot);
          const cmpFactoryResolver = injector?.get(ComponentFactoryResolver$1) ?? null;
          context2.attachRef = null;
          context2.route = future;
          context2.resolver = cmpFactoryResolver;
          context2.injector = injector;
          if (context2.outlet) {
            context2.outlet.activateWith(future, context2.injector);
          }
          this.activateChildRoutes(futureNode, null, context2.children);
        }
      } else {
        this.activateChildRoutes(futureNode, null, parentContexts);
      }
    }
  }
};
var CanActivate = class {
  constructor(path) {
    this.path = path;
    this.route = this.path[this.path.length - 1];
  }
};
var CanDeactivate = class {
  constructor(component, route) {
    this.component = component;
    this.route = route;
  }
};
function getAllRouteGuards(future, curr, parentContexts) {
  const futureRoot = future._root;
  const currRoot = curr ? curr._root : null;
  return getChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
}
function getCanActivateChild(p) {
  const canActivateChild = p.routeConfig ? p.routeConfig.canActivateChild : null;
  if (!canActivateChild || canActivateChild.length === 0)
    return null;
  return {
    node: p,
    guards: canActivateChild
  };
}
function getTokenOrFunctionIdentity(tokenOrFunction, injector) {
  const NOT_FOUND2 = Symbol();
  const result = injector.get(tokenOrFunction, NOT_FOUND2);
  if (result === NOT_FOUND2) {
    if (typeof tokenOrFunction === "function" && !isInjectable(tokenOrFunction)) {
      return tokenOrFunction;
    } else {
      return injector.get(tokenOrFunction);
    }
  }
  return result;
}
function getChildRouteGuards(futureNode, currNode, contexts, futurePath, checks = {
  canDeactivateChecks: [],
  canActivateChecks: []
}) {
  const prevChildren = nodeChildrenAsMap(currNode);
  futureNode.children.forEach((c) => {
    getRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]), checks);
    delete prevChildren[c.value.outlet];
  });
  forEach(prevChildren, (v, k) => deactivateRouteAndItsChildren(v, contexts.getContext(k), checks));
  return checks;
}
function getRouteGuards(futureNode, currNode, parentContexts, futurePath, checks = {
  canDeactivateChecks: [],
  canActivateChecks: []
}) {
  const future = futureNode.value;
  const curr = currNode ? currNode.value : null;
  const context2 = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
  if (curr && future.routeConfig === curr.routeConfig) {
    const shouldRun = shouldRunGuardsAndResolvers(curr, future, future.routeConfig.runGuardsAndResolvers);
    if (shouldRun) {
      checks.canActivateChecks.push(new CanActivate(futurePath));
    } else {
      future.data = curr.data;
      future._resolvedData = curr._resolvedData;
    }
    if (future.component) {
      getChildRouteGuards(futureNode, currNode, context2 ? context2.children : null, futurePath, checks);
    } else {
      getChildRouteGuards(futureNode, currNode, parentContexts, futurePath, checks);
    }
    if (shouldRun && context2 && context2.outlet && context2.outlet.isActivated) {
      checks.canDeactivateChecks.push(new CanDeactivate(context2.outlet.component, curr));
    }
  } else {
    if (curr) {
      deactivateRouteAndItsChildren(currNode, context2, checks);
    }
    checks.canActivateChecks.push(new CanActivate(futurePath));
    if (future.component) {
      getChildRouteGuards(futureNode, null, context2 ? context2.children : null, futurePath, checks);
    } else {
      getChildRouteGuards(futureNode, null, parentContexts, futurePath, checks);
    }
  }
  return checks;
}
function shouldRunGuardsAndResolvers(curr, future, mode) {
  if (typeof mode === "function") {
    return mode(curr, future);
  }
  switch (mode) {
    case "pathParamsChange":
      return !equalPath(curr.url, future.url);
    case "pathParamsOrQueryParamsChange":
      return !equalPath(curr.url, future.url) || !shallowEqual(curr.queryParams, future.queryParams);
    case "always":
      return true;
    case "paramsOrQueryParamsChange":
      return !equalParamsAndUrlSegments(curr, future) || !shallowEqual(curr.queryParams, future.queryParams);
    case "paramsChange":
    default:
      return !equalParamsAndUrlSegments(curr, future);
  }
}
function deactivateRouteAndItsChildren(route, context2, checks) {
  const children = nodeChildrenAsMap(route);
  const r = route.value;
  forEach(children, (node, childName) => {
    if (!r.component) {
      deactivateRouteAndItsChildren(node, context2, checks);
    } else if (context2) {
      deactivateRouteAndItsChildren(node, context2.children.getContext(childName), checks);
    } else {
      deactivateRouteAndItsChildren(node, null, checks);
    }
  });
  if (!r.component) {
    checks.canDeactivateChecks.push(new CanDeactivate(null, r));
  } else if (context2 && context2.outlet && context2.outlet.isActivated) {
    checks.canDeactivateChecks.push(new CanDeactivate(context2.outlet.component, r));
  } else {
    checks.canDeactivateChecks.push(new CanDeactivate(null, r));
  }
}
function isFunction2(v) {
  return typeof v === "function";
}
function isBoolean(v) {
  return typeof v === "boolean";
}
function isCanLoad(guard) {
  return guard && isFunction2(guard.canLoad);
}
function isCanActivate(guard) {
  return guard && isFunction2(guard.canActivate);
}
function isCanActivateChild(guard) {
  return guard && isFunction2(guard.canActivateChild);
}
function isCanDeactivate(guard) {
  return guard && isFunction2(guard.canDeactivate);
}
function isCanMatch(guard) {
  return guard && isFunction2(guard.canMatch);
}
function isEmptyError(e) {
  return e instanceof EmptyError || e?.name === "EmptyError";
}
var INITIAL_VALUE = /* @__PURE__ */ Symbol("INITIAL_VALUE");
function prioritizedGuardValue() {
  return switchMap((obs) => {
    return combineLatest(obs.map((o) => o.pipe(take(1), startWith(INITIAL_VALUE)))).pipe(map((results) => {
      for (const result of results) {
        if (result === true) {
          continue;
        } else if (result === INITIAL_VALUE) {
          return INITIAL_VALUE;
        } else if (result === false || result instanceof UrlTree) {
          return result;
        }
      }
      return true;
    }), filter((item) => item !== INITIAL_VALUE), take(1));
  });
}
function checkGuards(injector, forwardEvent) {
  return mergeMap((t) => {
    const {
      targetSnapshot,
      currentSnapshot,
      guards: {
        canActivateChecks,
        canDeactivateChecks
      }
    } = t;
    if (canDeactivateChecks.length === 0 && canActivateChecks.length === 0) {
      return of(__spreadProps(__spreadValues({}, t), {
        guardsResult: true
      }));
    }
    return runCanDeactivateChecks(canDeactivateChecks, targetSnapshot, currentSnapshot, injector).pipe(mergeMap((canDeactivate) => {
      return canDeactivate && isBoolean(canDeactivate) ? runCanActivateChecks(targetSnapshot, canActivateChecks, injector, forwardEvent) : of(canDeactivate);
    }), map((guardsResult) => __spreadProps(__spreadValues({}, t), {
      guardsResult
    })));
  });
}
function runCanDeactivateChecks(checks, futureRSS, currRSS, injector) {
  return from(checks).pipe(mergeMap((check) => runCanDeactivate(check.component, check.route, currRSS, futureRSS, injector)), first((result) => {
    return result !== true;
  }, true));
}
function runCanActivateChecks(futureSnapshot, checks, injector, forwardEvent) {
  return from(checks).pipe(concatMap((check) => {
    return concat(fireChildActivationStart(check.route.parent, forwardEvent), fireActivationStart(check.route, forwardEvent), runCanActivateChild(futureSnapshot, check.path, injector), runCanActivate(futureSnapshot, check.route, injector));
  }), first((result) => {
    return result !== true;
  }, true));
}
function fireActivationStart(snapshot, forwardEvent) {
  if (snapshot !== null && forwardEvent) {
    forwardEvent(new ActivationStart(snapshot));
  }
  return of(true);
}
function fireChildActivationStart(snapshot, forwardEvent) {
  if (snapshot !== null && forwardEvent) {
    forwardEvent(new ChildActivationStart(snapshot));
  }
  return of(true);
}
function runCanActivate(futureRSS, futureARS, injector) {
  const canActivate = futureARS.routeConfig ? futureARS.routeConfig.canActivate : null;
  if (!canActivate || canActivate.length === 0)
    return of(true);
  const canActivateObservables = canActivate.map((canActivate2) => {
    return defer(() => {
      const closestInjector = getClosestRouteInjector(futureARS) ?? injector;
      const guard = getTokenOrFunctionIdentity(canActivate2, closestInjector);
      const guardVal = isCanActivate(guard) ? guard.canActivate(futureARS, futureRSS) : closestInjector.runInContext(() => guard(futureARS, futureRSS));
      return wrapIntoObservable(guardVal).pipe(first());
    });
  });
  return of(canActivateObservables).pipe(prioritizedGuardValue());
}
function runCanActivateChild(futureRSS, path, injector) {
  const futureARS = path[path.length - 1];
  const canActivateChildGuards = path.slice(0, path.length - 1).reverse().map((p) => getCanActivateChild(p)).filter((_) => _ !== null);
  const canActivateChildGuardsMapped = canActivateChildGuards.map((d) => {
    return defer(() => {
      const guardsMapped = d.guards.map((canActivateChild) => {
        const closestInjector = getClosestRouteInjector(d.node) ?? injector;
        const guard = getTokenOrFunctionIdentity(canActivateChild, closestInjector);
        const guardVal = isCanActivateChild(guard) ? guard.canActivateChild(futureARS, futureRSS) : closestInjector.runInContext(() => guard(futureARS, futureRSS));
        return wrapIntoObservable(guardVal).pipe(first());
      });
      return of(guardsMapped).pipe(prioritizedGuardValue());
    });
  });
  return of(canActivateChildGuardsMapped).pipe(prioritizedGuardValue());
}
function runCanDeactivate(component, currARS, currRSS, futureRSS, injector) {
  const canDeactivate = currARS && currARS.routeConfig ? currARS.routeConfig.canDeactivate : null;
  if (!canDeactivate || canDeactivate.length === 0)
    return of(true);
  const canDeactivateObservables = canDeactivate.map((c) => {
    const closestInjector = getClosestRouteInjector(currARS) ?? injector;
    const guard = getTokenOrFunctionIdentity(c, closestInjector);
    const guardVal = isCanDeactivate(guard) ? guard.canDeactivate(component, currARS, currRSS, futureRSS) : closestInjector.runInContext(() => guard(component, currARS, currRSS, futureRSS));
    return wrapIntoObservable(guardVal).pipe(first());
  });
  return of(canDeactivateObservables).pipe(prioritizedGuardValue());
}
function runCanLoadGuards(injector, route, segments, urlSerializer) {
  const canLoad = route.canLoad;
  if (canLoad === void 0 || canLoad.length === 0) {
    return of(true);
  }
  const canLoadObservables = canLoad.map((injectionToken) => {
    const guard = getTokenOrFunctionIdentity(injectionToken, injector);
    const guardVal = isCanLoad(guard) ? guard.canLoad(route, segments) : injector.runInContext(() => guard(route, segments));
    return wrapIntoObservable(guardVal);
  });
  return of(canLoadObservables).pipe(prioritizedGuardValue(), redirectIfUrlTree(urlSerializer));
}
function redirectIfUrlTree(urlSerializer) {
  return pipe(tap((result) => {
    if (!isUrlTree(result))
      return;
    throw redirectingNavigationError(urlSerializer, result);
  }), map((result) => result === true));
}
function runCanMatchGuards(injector, route, segments, urlSerializer) {
  const canMatch = route.canMatch;
  if (!canMatch || canMatch.length === 0)
    return of(true);
  const canMatchObservables = canMatch.map((injectionToken) => {
    const guard = getTokenOrFunctionIdentity(injectionToken, injector);
    const guardVal = isCanMatch(guard) ? guard.canMatch(route, segments) : injector.runInContext(() => guard(route, segments));
    return wrapIntoObservable(guardVal);
  });
  return of(canMatchObservables).pipe(prioritizedGuardValue(), redirectIfUrlTree(urlSerializer));
}
var noMatch$1 = {
  matched: false,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {}
};
function matchWithChecks(segmentGroup, route, segments, injector, urlSerializer) {
  const result = match(segmentGroup, route, segments);
  if (!result.matched) {
    return of(result);
  }
  injector = getOrCreateRouteInjectorIfNeeded(route, injector);
  return runCanMatchGuards(injector, route, segments, urlSerializer).pipe(map((v) => v === true ? result : __spreadValues({}, noMatch$1)));
}
function match(segmentGroup, route, segments) {
  if (route.path === "") {
    if (route.pathMatch === "full" && (segmentGroup.hasChildren() || segments.length > 0)) {
      return __spreadValues({}, noMatch$1);
    }
    return {
      matched: true,
      consumedSegments: [],
      remainingSegments: segments,
      parameters: {},
      positionalParamSegments: {}
    };
  }
  const matcher = route.matcher || defaultUrlMatcher;
  const res = matcher(segments, segmentGroup, route);
  if (!res)
    return __spreadValues({}, noMatch$1);
  const posParams = {};
  forEach(res.posParams, (v, k) => {
    posParams[k] = v.path;
  });
  const parameters = res.consumed.length > 0 ? __spreadValues(__spreadValues({}, posParams), res.consumed[res.consumed.length - 1].parameters) : posParams;
  return {
    matched: true,
    consumedSegments: res.consumed,
    remainingSegments: segments.slice(res.consumed.length),
    // TODO(atscott): investigate combining parameters and positionalParamSegments
    parameters,
    positionalParamSegments: res.posParams ?? {}
  };
}
function split(segmentGroup, consumedSegments, slicedSegments, config2) {
  if (slicedSegments.length > 0 && containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config2)) {
    const s2 = new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(segmentGroup, consumedSegments, config2, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
    s2._sourceSegment = segmentGroup;
    s2._segmentIndexShift = consumedSegments.length;
    return {
      segmentGroup: s2,
      slicedSegments: []
    };
  }
  if (slicedSegments.length === 0 && containsEmptyPathMatches(segmentGroup, slicedSegments, config2)) {
    const s2 = new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, consumedSegments, slicedSegments, config2, segmentGroup.children));
    s2._sourceSegment = segmentGroup;
    s2._segmentIndexShift = consumedSegments.length;
    return {
      segmentGroup: s2,
      slicedSegments
    };
  }
  const s = new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
  s._sourceSegment = segmentGroup;
  s._segmentIndexShift = consumedSegments.length;
  return {
    segmentGroup: s,
    slicedSegments
  };
}
function addEmptyPathsToChildrenIfNeeded(segmentGroup, consumedSegments, slicedSegments, routes2, children) {
  const res = {};
  for (const r of routes2) {
    if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
      const s = new UrlSegmentGroup([], {});
      s._sourceSegment = segmentGroup;
      s._segmentIndexShift = consumedSegments.length;
      res[getOutlet(r)] = s;
    }
  }
  return __spreadValues(__spreadValues({}, children), res);
}
function createChildrenForEmptyPaths(segmentGroup, consumedSegments, routes2, primarySegment) {
  const res = {};
  res[PRIMARY_OUTLET] = primarySegment;
  primarySegment._sourceSegment = segmentGroup;
  primarySegment._segmentIndexShift = consumedSegments.length;
  for (const r of routes2) {
    if (r.path === "" && getOutlet(r) !== PRIMARY_OUTLET) {
      const s = new UrlSegmentGroup([], {});
      s._sourceSegment = segmentGroup;
      s._segmentIndexShift = consumedSegments.length;
      res[getOutlet(r)] = s;
    }
  }
  return res;
}
function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes2) {
  return routes2.some((r) => emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet(r) !== PRIMARY_OUTLET);
}
function containsEmptyPathMatches(segmentGroup, slicedSegments, routes2) {
  return routes2.some((r) => emptyPathMatch(segmentGroup, slicedSegments, r));
}
function emptyPathMatch(segmentGroup, slicedSegments, r) {
  if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === "full") {
    return false;
  }
  return r.path === "";
}
function isImmediateMatch(route, rawSegment, segments, outlet) {
  if (getOutlet(route) !== outlet && (outlet === PRIMARY_OUTLET || !emptyPathMatch(rawSegment, segments, route))) {
    return false;
  }
  if (route.path === "**") {
    return true;
  }
  return match(rawSegment, route, segments).matched;
}
function noLeftoversInUrl(segmentGroup, segments, outlet) {
  return segments.length === 0 && !segmentGroup.children[outlet];
}
var NG_DEV_MODE$7 = typeof ngDevMode === "undefined" || ngDevMode;
var NoMatch$1 = class {
  constructor(segmentGroup) {
    this.segmentGroup = segmentGroup || null;
  }
};
var AbsoluteRedirect = class {
  constructor(urlTree) {
    this.urlTree = urlTree;
  }
};
function noMatch(segmentGroup) {
  return throwError(new NoMatch$1(segmentGroup));
}
function absoluteRedirect(newTree) {
  return throwError(new AbsoluteRedirect(newTree));
}
function namedOutletsRedirect(redirectTo) {
  return throwError(new RuntimeError(4e3, NG_DEV_MODE$7 && `Only absolute redirects can have named outlets. redirectTo: '${redirectTo}'`));
}
function canLoadFails(route) {
  return throwError(navigationCancelingError(
    NG_DEV_MODE$7 && `Cannot load children because the guard of the route "path: '${route.path}'" returned false`,
    3
    /* NavigationCancellationCode.GuardRejected */
  ));
}
function applyRedirects$1(injector, configLoader, urlSerializer, urlTree, config2) {
  return new ApplyRedirects(injector, configLoader, urlSerializer, urlTree, config2).apply();
}
var ApplyRedirects = class {
  constructor(injector, configLoader, urlSerializer, urlTree, config2) {
    this.injector = injector;
    this.configLoader = configLoader;
    this.urlSerializer = urlSerializer;
    this.urlTree = urlTree;
    this.config = config2;
    this.allowRedirects = true;
  }
  apply() {
    const splitGroup = split(this.urlTree.root, [], [], this.config).segmentGroup;
    const rootSegmentGroup = new UrlSegmentGroup(splitGroup.segments, splitGroup.children);
    const expanded$ = this.expandSegmentGroup(this.injector, this.config, rootSegmentGroup, PRIMARY_OUTLET);
    const urlTrees$ = expanded$.pipe(map((rootSegmentGroup2) => {
      return this.createUrlTree(squashSegmentGroup(rootSegmentGroup2), this.urlTree.queryParams, this.urlTree.fragment);
    }));
    return urlTrees$.pipe(catchError((e) => {
      if (e instanceof AbsoluteRedirect) {
        this.allowRedirects = false;
        return this.match(e.urlTree);
      }
      if (e instanceof NoMatch$1) {
        throw this.noMatchError(e);
      }
      throw e;
    }));
  }
  match(tree2) {
    const expanded$ = this.expandSegmentGroup(this.injector, this.config, tree2.root, PRIMARY_OUTLET);
    const mapped$ = expanded$.pipe(map((rootSegmentGroup) => {
      return this.createUrlTree(squashSegmentGroup(rootSegmentGroup), tree2.queryParams, tree2.fragment);
    }));
    return mapped$.pipe(catchError((e) => {
      if (e instanceof NoMatch$1) {
        throw this.noMatchError(e);
      }
      throw e;
    }));
  }
  noMatchError(e) {
    return new RuntimeError(4002, NG_DEV_MODE$7 && `Cannot match any routes. URL Segment: '${e.segmentGroup}'`);
  }
  createUrlTree(rootCandidate, queryParams, fragment) {
    const root = createRoot(rootCandidate);
    return new UrlTree(root, queryParams, fragment);
  }
  expandSegmentGroup(injector, routes2, segmentGroup, outlet) {
    if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
      return this.expandChildren(injector, routes2, segmentGroup).pipe(map((children) => new UrlSegmentGroup([], children)));
    }
    return this.expandSegment(injector, segmentGroup, routes2, segmentGroup.segments, outlet, true);
  }
  // Recursively expand segment groups for all the child outlets
  expandChildren(injector, routes2, segmentGroup) {
    const childOutlets = [];
    for (const child of Object.keys(segmentGroup.children)) {
      if (child === "primary") {
        childOutlets.unshift(child);
      } else {
        childOutlets.push(child);
      }
    }
    return from(childOutlets).pipe(concatMap((childOutlet) => {
      const child = segmentGroup.children[childOutlet];
      const sortedRoutes = sortByMatchingOutlets(routes2, childOutlet);
      return this.expandSegmentGroup(injector, sortedRoutes, child, childOutlet).pipe(map((s) => ({
        segment: s,
        outlet: childOutlet
      })));
    }), scan((children, expandedChild) => {
      children[expandedChild.outlet] = expandedChild.segment;
      return children;
    }, {}), last2());
  }
  expandSegment(injector, segmentGroup, routes2, segments, outlet, allowRedirects) {
    return from(routes2).pipe(concatMap((r) => {
      const expanded$ = this.expandSegmentAgainstRoute(injector, segmentGroup, routes2, r, segments, outlet, allowRedirects);
      return expanded$.pipe(catchError((e) => {
        if (e instanceof NoMatch$1) {
          return of(null);
        }
        throw e;
      }));
    }), first((s) => !!s), catchError((e, _) => {
      if (isEmptyError(e)) {
        if (noLeftoversInUrl(segmentGroup, segments, outlet)) {
          return of(new UrlSegmentGroup([], {}));
        }
        return noMatch(segmentGroup);
      }
      throw e;
    }));
  }
  expandSegmentAgainstRoute(injector, segmentGroup, routes2, route, paths, outlet, allowRedirects) {
    if (!isImmediateMatch(route, segmentGroup, paths, outlet)) {
      return noMatch(segmentGroup);
    }
    if (route.redirectTo === void 0) {
      return this.matchSegmentAgainstRoute(injector, segmentGroup, route, paths, outlet);
    }
    if (allowRedirects && this.allowRedirects) {
      return this.expandSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes2, route, paths, outlet);
    }
    return noMatch(segmentGroup);
  }
  expandSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes2, route, segments, outlet) {
    if (route.path === "**") {
      return this.expandWildCardWithParamsAgainstRouteUsingRedirect(injector, routes2, route, outlet);
    }
    return this.expandRegularSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes2, route, segments, outlet);
  }
  expandWildCardWithParamsAgainstRouteUsingRedirect(injector, routes2, route, outlet) {
    const newTree = this.applyRedirectCommands([], route.redirectTo, {});
    if (route.redirectTo.startsWith("/")) {
      return absoluteRedirect(newTree);
    }
    return this.lineralizeSegments(route, newTree).pipe(mergeMap((newSegments) => {
      const group = new UrlSegmentGroup(newSegments, {});
      return this.expandSegment(injector, group, routes2, newSegments, outlet, false);
    }));
  }
  expandRegularSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes2, route, segments, outlet) {
    const {
      matched,
      consumedSegments,
      remainingSegments,
      positionalParamSegments
    } = match(segmentGroup, route, segments);
    if (!matched)
      return noMatch(segmentGroup);
    const newTree = this.applyRedirectCommands(consumedSegments, route.redirectTo, positionalParamSegments);
    if (route.redirectTo.startsWith("/")) {
      return absoluteRedirect(newTree);
    }
    return this.lineralizeSegments(route, newTree).pipe(mergeMap((newSegments) => {
      return this.expandSegment(injector, segmentGroup, routes2, newSegments.concat(remainingSegments), outlet, false);
    }));
  }
  matchSegmentAgainstRoute(injector, rawSegmentGroup, route, segments, outlet) {
    if (route.path === "**") {
      injector = getOrCreateRouteInjectorIfNeeded(route, injector);
      if (route.loadChildren) {
        const loaded$ = route._loadedRoutes ? of({
          routes: route._loadedRoutes,
          injector: route._loadedInjector
        }) : this.configLoader.loadChildren(injector, route);
        return loaded$.pipe(map((cfg) => {
          route._loadedRoutes = cfg.routes;
          route._loadedInjector = cfg.injector;
          return new UrlSegmentGroup(segments, {});
        }));
      }
      return of(new UrlSegmentGroup(segments, {}));
    }
    return matchWithChecks(rawSegmentGroup, route, segments, injector, this.urlSerializer).pipe(switchMap(({
      matched,
      consumedSegments,
      remainingSegments
    }) => {
      if (!matched)
        return noMatch(rawSegmentGroup);
      injector = route._injector ?? injector;
      const childConfig$ = this.getChildConfig(injector, route, segments);
      return childConfig$.pipe(mergeMap((routerConfig) => {
        const childInjector = routerConfig.injector ?? injector;
        const childConfig = routerConfig.routes;
        const {
          segmentGroup: splitSegmentGroup,
          slicedSegments
        } = split(rawSegmentGroup, consumedSegments, remainingSegments, childConfig);
        const segmentGroup = new UrlSegmentGroup(splitSegmentGroup.segments, splitSegmentGroup.children);
        if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
          const expanded$2 = this.expandChildren(childInjector, childConfig, segmentGroup);
          return expanded$2.pipe(map((children) => new UrlSegmentGroup(consumedSegments, children)));
        }
        if (childConfig.length === 0 && slicedSegments.length === 0) {
          return of(new UrlSegmentGroup(consumedSegments, {}));
        }
        const matchedOnOutlet = getOutlet(route) === outlet;
        const expanded$ = this.expandSegment(childInjector, segmentGroup, childConfig, slicedSegments, matchedOnOutlet ? PRIMARY_OUTLET : outlet, true);
        return expanded$.pipe(map((cs) => new UrlSegmentGroup(consumedSegments.concat(cs.segments), cs.children)));
      }));
    }));
  }
  getChildConfig(injector, route, segments) {
    if (route.children) {
      return of({
        routes: route.children,
        injector
      });
    }
    if (route.loadChildren) {
      if (route._loadedRoutes !== void 0) {
        return of({
          routes: route._loadedRoutes,
          injector: route._loadedInjector
        });
      }
      return runCanLoadGuards(injector, route, segments, this.urlSerializer).pipe(mergeMap((shouldLoadResult) => {
        if (shouldLoadResult) {
          return this.configLoader.loadChildren(injector, route).pipe(tap((cfg) => {
            route._loadedRoutes = cfg.routes;
            route._loadedInjector = cfg.injector;
          }));
        }
        return canLoadFails(route);
      }));
    }
    return of({
      routes: [],
      injector
    });
  }
  lineralizeSegments(route, urlTree) {
    let res = [];
    let c = urlTree.root;
    while (true) {
      res = res.concat(c.segments);
      if (c.numberOfChildren === 0) {
        return of(res);
      }
      if (c.numberOfChildren > 1 || !c.children[PRIMARY_OUTLET]) {
        return namedOutletsRedirect(route.redirectTo);
      }
      c = c.children[PRIMARY_OUTLET];
    }
  }
  applyRedirectCommands(segments, redirectTo, posParams) {
    return this.applyRedirectCreateUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
  }
  applyRedirectCreateUrlTree(redirectTo, urlTree, segments, posParams) {
    const newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
    return new UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
  }
  createQueryParams(redirectToParams, actualParams) {
    const res = {};
    forEach(redirectToParams, (v, k) => {
      const copySourceValue = typeof v === "string" && v.startsWith(":");
      if (copySourceValue) {
        const sourceName = v.substring(1);
        res[k] = actualParams[sourceName];
      } else {
        res[k] = v;
      }
    });
    return res;
  }
  createSegmentGroup(redirectTo, group, segments, posParams) {
    const updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
    let children = {};
    forEach(group.children, (child, name) => {
      children[name] = this.createSegmentGroup(redirectTo, child, segments, posParams);
    });
    return new UrlSegmentGroup(updatedSegments, children);
  }
  createSegments(redirectTo, redirectToSegments, actualSegments, posParams) {
    return redirectToSegments.map((s) => s.path.startsWith(":") ? this.findPosParam(redirectTo, s, posParams) : this.findOrReturn(s, actualSegments));
  }
  findPosParam(redirectTo, redirectToUrlSegment, posParams) {
    const pos = posParams[redirectToUrlSegment.path.substring(1)];
    if (!pos)
      throw new RuntimeError(4001, NG_DEV_MODE$7 && `Cannot redirect to '${redirectTo}'. Cannot find '${redirectToUrlSegment.path}'.`);
    return pos;
  }
  findOrReturn(redirectToUrlSegment, actualSegments) {
    let idx = 0;
    for (const s of actualSegments) {
      if (s.path === redirectToUrlSegment.path) {
        actualSegments.splice(idx);
        return s;
      }
      idx++;
    }
    return redirectToUrlSegment;
  }
};
function applyRedirects(environmentInjector, configLoader, urlSerializer, config2) {
  return switchMap((t) => applyRedirects$1(environmentInjector, configLoader, urlSerializer, t.extractedUrl, config2).pipe(map((urlAfterRedirects) => __spreadProps(__spreadValues({}, t), {
    urlAfterRedirects
  }))));
}
var NG_DEV_MODE$6 = typeof ngDevMode === "undefined" || !!ngDevMode;
var NoMatch = class {
};
function newObservableError(e) {
  return new Observable((obs) => obs.error(e));
}
function recognize$1(injector, rootComponentType, config2, urlTree, url, urlSerializer, paramsInheritanceStrategy = "emptyOnly") {
  return new Recognizer(injector, rootComponentType, config2, urlTree, url, paramsInheritanceStrategy, urlSerializer).recognize().pipe(switchMap((result) => {
    if (result === null) {
      return newObservableError(new NoMatch());
    } else {
      return of(result);
    }
  }));
}
var Recognizer = class {
  constructor(injector, rootComponentType, config2, urlTree, url, paramsInheritanceStrategy, urlSerializer) {
    this.injector = injector;
    this.rootComponentType = rootComponentType;
    this.config = config2;
    this.urlTree = urlTree;
    this.url = url;
    this.paramsInheritanceStrategy = paramsInheritanceStrategy;
    this.urlSerializer = urlSerializer;
  }
  recognize() {
    const rootSegmentGroup = split(this.urlTree.root, [], [], this.config.filter((c) => c.redirectTo === void 0)).segmentGroup;
    return this.processSegmentGroup(this.injector, this.config, rootSegmentGroup, PRIMARY_OUTLET).pipe(map((children) => {
      if (children === null) {
        return null;
      }
      const root = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(__spreadValues({}, this.urlTree.queryParams)), this.urlTree.fragment, {}, PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
      const rootNode = new TreeNode(root, children);
      const routeState = new RouterStateSnapshot(this.url, rootNode);
      this.inheritParamsAndData(routeState._root);
      return routeState;
    }));
  }
  inheritParamsAndData(routeNode) {
    const route = routeNode.value;
    const i = inheritedParamsDataResolve(route, this.paramsInheritanceStrategy);
    route.params = Object.freeze(i.params);
    route.data = Object.freeze(i.data);
    routeNode.children.forEach((n) => this.inheritParamsAndData(n));
  }
  processSegmentGroup(injector, config2, segmentGroup, outlet) {
    if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
      return this.processChildren(injector, config2, segmentGroup);
    }
    return this.processSegment(injector, config2, segmentGroup, segmentGroup.segments, outlet);
  }
  /**
   * Matches every child outlet in the `segmentGroup` to a `Route` in the config. Returns `null` if
   * we cannot find a match for _any_ of the children.
   *
   * @param config - The `Routes` to match against
   * @param segmentGroup - The `UrlSegmentGroup` whose children need to be matched against the
   *     config.
   */
  processChildren(injector, config2, segmentGroup) {
    return from(Object.keys(segmentGroup.children)).pipe(concatMap((childOutlet) => {
      const child = segmentGroup.children[childOutlet];
      const sortedConfig = sortByMatchingOutlets(config2, childOutlet);
      return this.processSegmentGroup(injector, sortedConfig, child, childOutlet);
    }), scan((children, outletChildren) => {
      if (!children || !outletChildren)
        return null;
      children.push(...outletChildren);
      return children;
    }), takeWhile((children) => children !== null), defaultIfEmpty(null), last2(), map((children) => {
      if (children === null)
        return null;
      const mergedChildren = mergeEmptyPathMatches(children);
      if (NG_DEV_MODE$6) {
        checkOutletNameUniqueness(mergedChildren);
      }
      sortActivatedRouteSnapshots(mergedChildren);
      return mergedChildren;
    }));
  }
  processSegment(injector, routes2, segmentGroup, segments, outlet) {
    return from(routes2).pipe(concatMap((r) => {
      return this.processSegmentAgainstRoute(r._injector ?? injector, r, segmentGroup, segments, outlet);
    }), first((x) => !!x), catchError((e) => {
      if (isEmptyError(e)) {
        if (noLeftoversInUrl(segmentGroup, segments, outlet)) {
          return of([]);
        }
        return of(null);
      }
      throw e;
    }));
  }
  processSegmentAgainstRoute(injector, route, rawSegment, segments, outlet) {
    if (route.redirectTo || !isImmediateMatch(route, rawSegment, segments, outlet))
      return of(null);
    let matchResult;
    if (route.path === "**") {
      const params = segments.length > 0 ? last3(segments).parameters : {};
      const pathIndexShift = getPathIndexShift(rawSegment) + segments.length;
      const snapshot = new ActivatedRouteSnapshot(segments, params, Object.freeze(__spreadValues({}, this.urlTree.queryParams)), this.urlTree.fragment, getData(route), getOutlet(route), route.component ?? route._loadedComponent ?? null, route, getSourceSegmentGroup(rawSegment), pathIndexShift, getResolve(route));
      matchResult = of({
        snapshot,
        consumedSegments: [],
        remainingSegments: []
      });
    } else {
      matchResult = matchWithChecks(rawSegment, route, segments, injector, this.urlSerializer).pipe(map(({
        matched,
        consumedSegments,
        remainingSegments,
        parameters
      }) => {
        if (!matched) {
          return null;
        }
        const pathIndexShift = getPathIndexShift(rawSegment) + consumedSegments.length;
        const snapshot = new ActivatedRouteSnapshot(consumedSegments, parameters, Object.freeze(__spreadValues({}, this.urlTree.queryParams)), this.urlTree.fragment, getData(route), getOutlet(route), route.component ?? route._loadedComponent ?? null, route, getSourceSegmentGroup(rawSegment), pathIndexShift, getResolve(route));
        return {
          snapshot,
          consumedSegments,
          remainingSegments
        };
      }));
    }
    return matchResult.pipe(switchMap((result) => {
      if (result === null) {
        return of(null);
      }
      const {
        snapshot,
        consumedSegments,
        remainingSegments
      } = result;
      injector = route._injector ?? injector;
      const childInjector = route._loadedInjector ?? injector;
      const childConfig = getChildConfig(route);
      const {
        segmentGroup,
        slicedSegments
      } = split(
        rawSegment,
        consumedSegments,
        remainingSegments,
        // Filter out routes with redirectTo because we are trying to create activated route
        // snapshots and don't handle redirects here. That should have been done in
        // `applyRedirects`.
        childConfig.filter((c) => c.redirectTo === void 0)
      );
      if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
        return this.processChildren(childInjector, childConfig, segmentGroup).pipe(map((children) => {
          if (children === null) {
            return null;
          }
          return [new TreeNode(snapshot, children)];
        }));
      }
      if (childConfig.length === 0 && slicedSegments.length === 0) {
        return of([new TreeNode(snapshot, [])]);
      }
      const matchedOnOutlet = getOutlet(route) === outlet;
      return this.processSegment(childInjector, childConfig, segmentGroup, slicedSegments, matchedOnOutlet ? PRIMARY_OUTLET : outlet).pipe(map((children) => {
        if (children === null) {
          return null;
        }
        return [new TreeNode(snapshot, children)];
      }));
    }));
  }
};
function sortActivatedRouteSnapshots(nodes) {
  nodes.sort((a, b) => {
    if (a.value.outlet === PRIMARY_OUTLET)
      return -1;
    if (b.value.outlet === PRIMARY_OUTLET)
      return 1;
    return a.value.outlet.localeCompare(b.value.outlet);
  });
}
function getChildConfig(route) {
  if (route.children) {
    return route.children;
  }
  if (route.loadChildren) {
    return route._loadedRoutes;
  }
  return [];
}
function hasEmptyPathConfig(node) {
  const config2 = node.value.routeConfig;
  return config2 && config2.path === "" && config2.redirectTo === void 0;
}
function mergeEmptyPathMatches(nodes) {
  const result = [];
  const mergedNodes = /* @__PURE__ */ new Set();
  for (const node of nodes) {
    if (!hasEmptyPathConfig(node)) {
      result.push(node);
      continue;
    }
    const duplicateEmptyPathNode = result.find((resultNode) => node.value.routeConfig === resultNode.value.routeConfig);
    if (duplicateEmptyPathNode !== void 0) {
      duplicateEmptyPathNode.children.push(...node.children);
      mergedNodes.add(duplicateEmptyPathNode);
    } else {
      result.push(node);
    }
  }
  for (const mergedNode of mergedNodes) {
    const mergedChildren = mergeEmptyPathMatches(mergedNode.children);
    result.push(new TreeNode(mergedNode.value, mergedChildren));
  }
  return result.filter((n) => !mergedNodes.has(n));
}
function checkOutletNameUniqueness(nodes) {
  const names = {};
  nodes.forEach((n) => {
    const routeWithSameOutletName = names[n.value.outlet];
    if (routeWithSameOutletName) {
      const p = routeWithSameOutletName.url.map((s) => s.toString()).join("/");
      const c = n.value.url.map((s) => s.toString()).join("/");
      throw new RuntimeError(4006, NG_DEV_MODE$6 && `Two segments cannot have the same outlet name: '${p}' and '${c}'.`);
    }
    names[n.value.outlet] = n.value;
  });
}
function getSourceSegmentGroup(segmentGroup) {
  let s = segmentGroup;
  while (s._sourceSegment) {
    s = s._sourceSegment;
  }
  return s;
}
function getPathIndexShift(segmentGroup) {
  let s = segmentGroup;
  let res = s._segmentIndexShift ?? 0;
  while (s._sourceSegment) {
    s = s._sourceSegment;
    res += s._segmentIndexShift ?? 0;
  }
  return res - 1;
}
function getData(route) {
  return route.data || {};
}
function getResolve(route) {
  return route.resolve || {};
}
function recognize(injector, rootComponentType, config2, serializer, paramsInheritanceStrategy) {
  return mergeMap((t) => recognize$1(injector, rootComponentType, config2, t.urlAfterRedirects, serializer.serialize(t.urlAfterRedirects), serializer, paramsInheritanceStrategy).pipe(map((targetSnapshot) => __spreadProps(__spreadValues({}, t), {
    targetSnapshot
  }))));
}
function resolveData(paramsInheritanceStrategy, injector) {
  return mergeMap((t) => {
    const {
      targetSnapshot,
      guards: {
        canActivateChecks
      }
    } = t;
    if (!canActivateChecks.length) {
      return of(t);
    }
    let canActivateChecksResolved = 0;
    return from(canActivateChecks).pipe(concatMap((check) => runResolve(check.route, targetSnapshot, paramsInheritanceStrategy, injector)), tap(() => canActivateChecksResolved++), takeLast(1), mergeMap((_) => canActivateChecksResolved === canActivateChecks.length ? of(t) : EMPTY));
  });
}
function runResolve(futureARS, futureRSS, paramsInheritanceStrategy, injector) {
  const config2 = futureARS.routeConfig;
  const resolve = futureARS._resolve;
  if (config2?.title !== void 0 && !hasStaticTitle(config2)) {
    resolve[RouteTitleKey] = config2.title;
  }
  return resolveNode(resolve, futureARS, futureRSS, injector).pipe(map((resolvedData) => {
    futureARS._resolvedData = resolvedData;
    futureARS.data = inheritedParamsDataResolve(futureARS, paramsInheritanceStrategy).resolve;
    if (config2 && hasStaticTitle(config2)) {
      futureARS.data[RouteTitleKey] = config2.title;
    }
    return null;
  }));
}
function resolveNode(resolve, futureARS, futureRSS, injector) {
  const keys = getDataKeys(resolve);
  if (keys.length === 0) {
    return of({});
  }
  const data = {};
  return from(keys).pipe(mergeMap((key) => getResolver(resolve[key], futureARS, futureRSS, injector).pipe(first(), tap((value) => {
    data[key] = value;
  }))), takeLast(1), mapTo(data), catchError((e) => isEmptyError(e) ? EMPTY : throwError(e)));
}
function getDataKeys(obj) {
  return [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
}
function getResolver(injectionToken, futureARS, futureRSS, injector) {
  const closestInjector = getClosestRouteInjector(futureARS) ?? injector;
  const resolver = getTokenOrFunctionIdentity(injectionToken, closestInjector);
  const resolverValue = resolver.resolve ? resolver.resolve(futureARS, futureRSS) : closestInjector.runInContext(() => resolver(futureARS, futureRSS));
  return wrapIntoObservable(resolverValue);
}
function hasStaticTitle(config2) {
  return typeof config2.title === "string" || config2.title === null;
}
function switchTap(next) {
  return switchMap((v) => {
    const nextResult = next(v);
    if (nextResult) {
      return from(nextResult).pipe(map(() => v));
    }
    return of(v);
  });
}
var NG_DEV_MODE$5 = typeof ngDevMode === "undefined" || !!ngDevMode;
var ROUTES = /* @__PURE__ */ new InjectionToken("ROUTES");
var RouterConfigLoader = /* @__PURE__ */ (() => {
  class RouterConfigLoader2 {
    constructor() {
      this.componentLoaders = /* @__PURE__ */ new WeakMap();
      this.childrenLoaders = /* @__PURE__ */ new WeakMap();
      this.compiler = inject(Compiler);
    }
    loadComponent(route) {
      if (this.componentLoaders.get(route)) {
        return this.componentLoaders.get(route);
      } else if (route._loadedComponent) {
        return of(route._loadedComponent);
      }
      if (this.onLoadStartListener) {
        this.onLoadStartListener(route);
      }
      const loadRunner = wrapIntoObservable(route.loadComponent()).pipe(map(maybeUnwrapDefaultExport), tap((component) => {
        if (this.onLoadEndListener) {
          this.onLoadEndListener(route);
        }
        NG_DEV_MODE$5 && assertStandalone(route.path ?? "", component);
        route._loadedComponent = component;
      }), finalize(() => {
        this.componentLoaders.delete(route);
      }));
      const loader = new ConnectableObservable(loadRunner, () => new Subject()).pipe(refCount());
      this.componentLoaders.set(route, loader);
      return loader;
    }
    loadChildren(parentInjector, route) {
      if (this.childrenLoaders.get(route)) {
        return this.childrenLoaders.get(route);
      } else if (route._loadedRoutes) {
        return of({
          routes: route._loadedRoutes,
          injector: route._loadedInjector
        });
      }
      if (this.onLoadStartListener) {
        this.onLoadStartListener(route);
      }
      const moduleFactoryOrRoutes$ = this.loadModuleFactoryOrRoutes(route.loadChildren);
      const loadRunner = moduleFactoryOrRoutes$.pipe(map((factoryOrRoutes) => {
        if (this.onLoadEndListener) {
          this.onLoadEndListener(route);
        }
        let injector;
        let rawRoutes;
        let requireStandaloneComponents = false;
        if (Array.isArray(factoryOrRoutes)) {
          rawRoutes = factoryOrRoutes;
          requireStandaloneComponents = true;
        } else {
          injector = factoryOrRoutes.create(parentInjector).injector;
          rawRoutes = flatten(injector.get(ROUTES, [], InjectFlags.Self | InjectFlags.Optional));
        }
        const routes2 = rawRoutes.map(standardizeConfig);
        NG_DEV_MODE$5 && validateConfig(routes2, route.path, requireStandaloneComponents);
        return {
          routes: routes2,
          injector
        };
      }), finalize(() => {
        this.childrenLoaders.delete(route);
      }));
      const loader = new ConnectableObservable(loadRunner, () => new Subject()).pipe(refCount());
      this.childrenLoaders.set(route, loader);
      return loader;
    }
    loadModuleFactoryOrRoutes(loadChildren) {
      return wrapIntoObservable(loadChildren()).pipe(map(maybeUnwrapDefaultExport), mergeMap((t) => {
        if (t instanceof NgModuleFactory$1 || Array.isArray(t)) {
          return of(t);
        } else {
          return from(this.compiler.compileModuleAsync(t));
        }
      }));
    }
  }
  RouterConfigLoader2.\u0275fac = function RouterConfigLoader_Factory(t) {
    return new (t || RouterConfigLoader2)();
  };
  RouterConfigLoader2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: RouterConfigLoader2,
    factory: RouterConfigLoader2.\u0275fac,
    providedIn: "root"
  });
  return RouterConfigLoader2;
})();
function isWrappedDefaultExport(value) {
  return value && typeof value === "object" && "default" in value;
}
function maybeUnwrapDefaultExport(input) {
  return isWrappedDefaultExport(input) ? input["default"] : input;
}
var NG_DEV_MODE$4 = typeof ngDevMode === "undefined" || !!ngDevMode;
var NavigationTransitions = /* @__PURE__ */ (() => {
  class NavigationTransitions2 {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      this.currentNavigation = null;
      this.lastSuccessfulNavigation = null;
      this.events = new Subject();
      this.configLoader = inject(RouterConfigLoader);
      this.environmentInjector = inject(EnvironmentInjector);
      this.urlSerializer = inject(UrlSerializer);
      this.rootContexts = inject(ChildrenOutletContexts);
      this.navigationId = 0;
      this.afterPreactivation = () => of(void 0);
      this.rootComponentType = null;
      const onLoadStart = (r) => this.events.next(new RouteConfigLoadStart(r));
      const onLoadEnd = (r) => this.events.next(new RouteConfigLoadEnd(r));
      this.configLoader.onLoadEndListener = onLoadEnd;
      this.configLoader.onLoadStartListener = onLoadStart;
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(request) {
      const id = ++this.navigationId;
      this.transitions?.next(__spreadProps(__spreadValues(__spreadValues({}, this.transitions.value), request), {
        id
      }));
    }
    setupNavigations(router) {
      this.transitions = new BehaviorSubject({
        id: 0,
        targetPageId: 0,
        currentUrlTree: router.currentUrlTree,
        currentRawUrl: router.currentUrlTree,
        extractedUrl: router.urlHandlingStrategy.extract(router.currentUrlTree),
        urlAfterRedirects: router.urlHandlingStrategy.extract(router.currentUrlTree),
        rawUrl: router.currentUrlTree,
        extras: {},
        resolve: null,
        reject: null,
        promise: Promise.resolve(true),
        source: IMPERATIVE_NAVIGATION,
        restoredState: null,
        currentSnapshot: router.routerState.snapshot,
        targetSnapshot: null,
        currentRouterState: router.routerState,
        targetRouterState: null,
        guards: {
          canActivateChecks: [],
          canDeactivateChecks: []
        },
        guardsResult: null
      });
      return this.transitions.pipe(
        filter((t) => t.id !== 0),
        // Extract URL
        map((t) => __spreadProps(__spreadValues({}, t), {
          extractedUrl: router.urlHandlingStrategy.extract(t.rawUrl)
        })),
        // Using switchMap so we cancel executing navigations when a new one comes in
        switchMap((overallTransitionState) => {
          let completed = false;
          let errored = false;
          return of(overallTransitionState).pipe(
            // Store the Navigation object
            tap((t) => {
              this.currentNavigation = {
                id: t.id,
                initialUrl: t.rawUrl,
                extractedUrl: t.extractedUrl,
                trigger: t.source,
                extras: t.extras,
                previousNavigation: !this.lastSuccessfulNavigation ? null : __spreadProps(__spreadValues({}, this.lastSuccessfulNavigation), {
                  previousNavigation: null
                })
              };
            }),
            switchMap((t) => {
              const browserUrlTree = router.browserUrlTree.toString();
              const urlTransition = !router.navigated || t.extractedUrl.toString() !== browserUrlTree || // Navigations which succeed or ones which fail and are cleaned up
              // correctly should result in `browserUrlTree` and `currentUrlTree`
              // matching. If this is not the case, assume something went wrong and
              // try processing the URL again.
              browserUrlTree !== router.currentUrlTree.toString();
              const onSameUrlNavigation = t.extras.onSameUrlNavigation ?? router.onSameUrlNavigation;
              if (!urlTransition && onSameUrlNavigation !== "reload") {
                const reason = NG_DEV_MODE$4 ? `Navigation to ${t.rawUrl} was ignored because it is the same as the current Router URL.` : "";
                this.events.next(new NavigationSkipped(
                  t.id,
                  router.serializeUrl(overallTransitionState.rawUrl),
                  reason,
                  0
                  /* NavigationSkippedCode.IgnoredSameUrlNavigation */
                ));
                router.rawUrlTree = t.rawUrl;
                t.resolve(null);
                return EMPTY;
              }
              if (router.urlHandlingStrategy.shouldProcessUrl(t.rawUrl)) {
                if (isBrowserTriggeredNavigation(t.source)) {
                  router.browserUrlTree = t.extractedUrl;
                }
                return of(t).pipe(
                  // Fire NavigationStart event
                  switchMap((t2) => {
                    const transition = this.transitions?.getValue();
                    this.events.next(new NavigationStart(t2.id, this.urlSerializer.serialize(t2.extractedUrl), t2.source, t2.restoredState));
                    if (transition !== this.transitions?.getValue()) {
                      return EMPTY;
                    }
                    return Promise.resolve(t2);
                  }),
                  // ApplyRedirects
                  applyRedirects(this.environmentInjector, this.configLoader, this.urlSerializer, router.config),
                  // Update the currentNavigation
                  // `urlAfterRedirects` is guaranteed to be set after this point
                  tap((t2) => {
                    this.currentNavigation = __spreadProps(__spreadValues({}, this.currentNavigation), {
                      finalUrl: t2.urlAfterRedirects
                    });
                    overallTransitionState.urlAfterRedirects = t2.urlAfterRedirects;
                  }),
                  // Recognize
                  recognize(this.environmentInjector, this.rootComponentType, router.config, this.urlSerializer, router.paramsInheritanceStrategy),
                  // Update URL if in `eager` update mode
                  tap((t2) => {
                    overallTransitionState.targetSnapshot = t2.targetSnapshot;
                    if (router.urlUpdateStrategy === "eager") {
                      if (!t2.extras.skipLocationChange) {
                        const rawUrl = router.urlHandlingStrategy.merge(t2.urlAfterRedirects, t2.rawUrl);
                        router.setBrowserUrl(rawUrl, t2);
                      }
                      router.browserUrlTree = t2.urlAfterRedirects;
                    }
                    const routesRecognized = new RoutesRecognized(t2.id, this.urlSerializer.serialize(t2.extractedUrl), this.urlSerializer.serialize(t2.urlAfterRedirects), t2.targetSnapshot);
                    this.events.next(routesRecognized);
                  })
                );
              } else if (urlTransition && router.urlHandlingStrategy.shouldProcessUrl(router.rawUrlTree)) {
                const {
                  id,
                  extractedUrl,
                  source,
                  restoredState,
                  extras
                } = t;
                const navStart = new NavigationStart(id, this.urlSerializer.serialize(extractedUrl), source, restoredState);
                this.events.next(navStart);
                const targetSnapshot = createEmptyState(extractedUrl, this.rootComponentType).snapshot;
                overallTransitionState = __spreadProps(__spreadValues({}, t), {
                  targetSnapshot,
                  urlAfterRedirects: extractedUrl,
                  extras: __spreadProps(__spreadValues({}, extras), {
                    skipLocationChange: false,
                    replaceUrl: false
                  })
                });
                return of(overallTransitionState);
              } else {
                const reason = NG_DEV_MODE$4 ? `Navigation was ignored because the UrlHandlingStrategy indicated neither the current URL ${router.rawUrlTree} nor target URL ${t.rawUrl} should be processed.` : "";
                this.events.next(new NavigationSkipped(
                  t.id,
                  router.serializeUrl(overallTransitionState.extractedUrl),
                  reason,
                  1
                  /* NavigationSkippedCode.IgnoredByUrlHandlingStrategy */
                ));
                router.rawUrlTree = t.rawUrl;
                t.resolve(null);
                return EMPTY;
              }
            }),
            // --- GUARDS ---
            tap((t) => {
              const guardsStart = new GuardsCheckStart(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
              this.events.next(guardsStart);
            }),
            map((t) => {
              overallTransitionState = __spreadProps(__spreadValues({}, t), {
                guards: getAllRouteGuards(t.targetSnapshot, t.currentSnapshot, this.rootContexts)
              });
              return overallTransitionState;
            }),
            checkGuards(this.environmentInjector, (evt) => this.events.next(evt)),
            tap((t) => {
              overallTransitionState.guardsResult = t.guardsResult;
              if (isUrlTree(t.guardsResult)) {
                throw redirectingNavigationError(this.urlSerializer, t.guardsResult);
              }
              const guardsEnd = new GuardsCheckEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot, !!t.guardsResult);
              this.events.next(guardsEnd);
            }),
            filter((t) => {
              if (!t.guardsResult) {
                router.restoreHistory(t);
                this.cancelNavigationTransition(
                  t,
                  "",
                  3
                  /* NavigationCancellationCode.GuardRejected */
                );
                return false;
              }
              return true;
            }),
            // --- RESOLVE ---
            switchTap((t) => {
              if (t.guards.canActivateChecks.length) {
                return of(t).pipe(tap((t2) => {
                  const resolveStart = new ResolveStart(t2.id, this.urlSerializer.serialize(t2.extractedUrl), this.urlSerializer.serialize(t2.urlAfterRedirects), t2.targetSnapshot);
                  this.events.next(resolveStart);
                }), switchMap((t2) => {
                  let dataResolved = false;
                  return of(t2).pipe(resolveData(router.paramsInheritanceStrategy, this.environmentInjector), tap({
                    next: () => dataResolved = true,
                    complete: () => {
                      if (!dataResolved) {
                        router.restoreHistory(t2);
                        this.cancelNavigationTransition(
                          t2,
                          NG_DEV_MODE$4 ? `At least one route resolver didn't emit any value.` : "",
                          2
                          /* NavigationCancellationCode.NoDataFromResolver */
                        );
                      }
                    }
                  }));
                }), tap((t2) => {
                  const resolveEnd = new ResolveEnd(t2.id, this.urlSerializer.serialize(t2.extractedUrl), this.urlSerializer.serialize(t2.urlAfterRedirects), t2.targetSnapshot);
                  this.events.next(resolveEnd);
                }));
              }
              return void 0;
            }),
            // --- LOAD COMPONENTS ---
            switchTap((t) => {
              const loadComponents = (route) => {
                const loaders = [];
                if (route.routeConfig?.loadComponent && !route.routeConfig._loadedComponent) {
                  loaders.push(this.configLoader.loadComponent(route.routeConfig).pipe(tap((loadedComponent) => {
                    route.component = loadedComponent;
                  }), map(() => void 0)));
                }
                for (const child of route.children) {
                  loaders.push(...loadComponents(child));
                }
                return loaders;
              };
              return combineLatest(loadComponents(t.targetSnapshot.root)).pipe(defaultIfEmpty(), take(1));
            }),
            switchTap(() => this.afterPreactivation()),
            map((t) => {
              const targetRouterState = createRouterState(router.routeReuseStrategy, t.targetSnapshot, t.currentRouterState);
              overallTransitionState = __spreadProps(__spreadValues({}, t), {
                targetRouterState
              });
              return overallTransitionState;
            }),
            /* Once here, we are about to activate synchronously. The assumption is
               this will succeed, and user code may read from the Router service.
               Therefore before activation, we need to update router properties storing
               the current URL and the RouterState, as well as updated the browser URL.
               All this should happen *before* activating. */
            tap((t) => {
              router.currentUrlTree = t.urlAfterRedirects;
              router.rawUrlTree = router.urlHandlingStrategy.merge(t.urlAfterRedirects, t.rawUrl);
              router.routerState = t.targetRouterState;
              if (router.urlUpdateStrategy === "deferred") {
                if (!t.extras.skipLocationChange) {
                  router.setBrowserUrl(router.rawUrlTree, t);
                }
                router.browserUrlTree = t.urlAfterRedirects;
              }
            }),
            activateRoutes(this.rootContexts, router.routeReuseStrategy, (evt) => this.events.next(evt)),
            // Ensure that if some observable used to drive the transition doesn't
            // complete, the navigation still finalizes This should never happen, but
            // this is done as a safety measure to avoid surfacing this error (#49567).
            take(1),
            tap({
              next: (t) => {
                completed = true;
                this.lastSuccessfulNavigation = this.currentNavigation;
                router.navigated = true;
                this.events.next(new NavigationEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(router.currentUrlTree)));
                router.titleStrategy?.updateTitle(t.targetRouterState.snapshot);
                t.resolve(true);
              },
              complete: () => {
                completed = true;
              }
            }),
            finalize(() => {
              if (!completed && !errored) {
                const cancelationReason = NG_DEV_MODE$4 ? `Navigation ID ${overallTransitionState.id} is not equal to the current navigation id ${this.navigationId}` : "";
                this.cancelNavigationTransition(
                  overallTransitionState,
                  cancelationReason,
                  1
                  /* NavigationCancellationCode.SupersededByNewNavigation */
                );
              }
              if (this.currentNavigation?.id === overallTransitionState.id) {
                this.currentNavigation = null;
              }
            }),
            catchError((e) => {
              errored = true;
              if (isNavigationCancelingError$1(e)) {
                if (!isRedirectingNavigationCancelingError$1(e)) {
                  router.navigated = true;
                  router.restoreHistory(overallTransitionState, true);
                }
                const navCancel = new NavigationCancel(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), e.message, e.cancellationCode);
                this.events.next(navCancel);
                if (!isRedirectingNavigationCancelingError$1(e)) {
                  overallTransitionState.resolve(false);
                } else {
                  const mergedTree = router.urlHandlingStrategy.merge(e.url, router.rawUrlTree);
                  const extras = {
                    skipLocationChange: overallTransitionState.extras.skipLocationChange,
                    // The URL is already updated at this point if we have 'eager' URL
                    // updates or if the navigation was triggered by the browser (back
                    // button, URL bar, etc). We want to replace that item in history
                    // if the navigation is rejected.
                    replaceUrl: router.urlUpdateStrategy === "eager" || isBrowserTriggeredNavigation(overallTransitionState.source)
                  };
                  router.scheduleNavigation(mergedTree, IMPERATIVE_NAVIGATION, null, extras, {
                    resolve: overallTransitionState.resolve,
                    reject: overallTransitionState.reject,
                    promise: overallTransitionState.promise
                  });
                }
              } else {
                router.restoreHistory(overallTransitionState, true);
                const navError = new NavigationError(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), e, overallTransitionState.targetSnapshot ?? void 0);
                this.events.next(navError);
                try {
                  overallTransitionState.resolve(router.errorHandler(e));
                } catch (ee) {
                  overallTransitionState.reject(ee);
                }
              }
              return EMPTY;
            })
          );
        })
      );
    }
    cancelNavigationTransition(t, reason, code) {
      const navCancel = new NavigationCancel(t.id, this.urlSerializer.serialize(t.extractedUrl), reason, code);
      this.events.next(navCancel);
      t.resolve(false);
    }
  }
  NavigationTransitions2.\u0275fac = function NavigationTransitions_Factory(t) {
    return new (t || NavigationTransitions2)();
  };
  NavigationTransitions2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: NavigationTransitions2,
    factory: NavigationTransitions2.\u0275fac,
    providedIn: "root"
  });
  return NavigationTransitions2;
})();
function isBrowserTriggeredNavigation(source) {
  return source !== IMPERATIVE_NAVIGATION;
}
var TitleStrategy = /* @__PURE__ */ (() => {
  class TitleStrategy2 {
    /**
     * @returns The `title` of the deepest primary route.
     */
    buildTitle(snapshot) {
      let pageTitle;
      let route = snapshot.root;
      while (route !== void 0) {
        pageTitle = this.getResolvedTitleForRoute(route) ?? pageTitle;
        route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
      }
      return pageTitle;
    }
    /**
     * Given an `ActivatedRouteSnapshot`, returns the final value of the
     * `Route.title` property, which can either be a static string or a resolved value.
     */
    getResolvedTitleForRoute(snapshot) {
      return snapshot.data[RouteTitleKey];
    }
  }
  TitleStrategy2.\u0275fac = function TitleStrategy_Factory(t) {
    return new (t || TitleStrategy2)();
  };
  TitleStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: TitleStrategy2,
    factory: function() {
      return (() => inject(DefaultTitleStrategy))();
    },
    providedIn: "root"
  });
  return TitleStrategy2;
})();
var DefaultTitleStrategy = /* @__PURE__ */ (() => {
  class DefaultTitleStrategy2 extends TitleStrategy {
    constructor(title) {
      super();
      this.title = title;
    }
    /**
     * Sets the title of the browser to the given value.
     *
     * @param title The `pageTitle` from the deepest primary route.
     */
    updateTitle(snapshot) {
      const title = this.buildTitle(snapshot);
      if (title !== void 0) {
        this.title.setTitle(title);
      }
    }
  }
  DefaultTitleStrategy2.\u0275fac = function DefaultTitleStrategy_Factory(t) {
    return new (t || DefaultTitleStrategy2)(\u0275\u0275inject(Title));
  };
  DefaultTitleStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: DefaultTitleStrategy2,
    factory: DefaultTitleStrategy2.\u0275fac,
    providedIn: "root"
  });
  return DefaultTitleStrategy2;
})();
var RouteReuseStrategy = /* @__PURE__ */ (() => {
  class RouteReuseStrategy2 {
  }
  RouteReuseStrategy2.\u0275fac = function RouteReuseStrategy_Factory(t) {
    return new (t || RouteReuseStrategy2)();
  };
  RouteReuseStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: RouteReuseStrategy2,
    factory: function() {
      return (() => inject(DefaultRouteReuseStrategy))();
    },
    providedIn: "root"
  });
  return RouteReuseStrategy2;
})();
var BaseRouteReuseStrategy = class {
  /**
   * Whether the given route should detach for later reuse.
   * Always returns false for `BaseRouteReuseStrategy`.
   * */
  shouldDetach(route) {
    return false;
  }
  /**
   * A no-op; the route is never stored since this strategy never detaches routes for later re-use.
   */
  store(route, detachedTree) {
  }
  /** Returns `false`, meaning the route (and its subtree) is never reattached */
  shouldAttach(route) {
    return false;
  }
  /** Returns `null` because this strategy does not store routes for later re-use. */
  retrieve(route) {
    return null;
  }
  /**
   * Determines if a route should be reused.
   * This strategy returns `true` when the future route config and current route config are
   * identical.
   */
  shouldReuseRoute(future, curr) {
    return future.routeConfig === curr.routeConfig;
  }
};
var DefaultRouteReuseStrategy = /* @__PURE__ */ (() => {
  class DefaultRouteReuseStrategy2 extends BaseRouteReuseStrategy {
  }
  DefaultRouteReuseStrategy2.\u0275fac = /* @__PURE__ */ function() {
    let \u0275DefaultRouteReuseStrategy_BaseFactory;
    return function DefaultRouteReuseStrategy_Factory(t) {
      return (\u0275DefaultRouteReuseStrategy_BaseFactory || (\u0275DefaultRouteReuseStrategy_BaseFactory = \u0275\u0275getInheritedFactory(DefaultRouteReuseStrategy2)))(t || DefaultRouteReuseStrategy2);
    };
  }();
  DefaultRouteReuseStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: DefaultRouteReuseStrategy2,
    factory: DefaultRouteReuseStrategy2.\u0275fac,
    providedIn: "root"
  });
  return DefaultRouteReuseStrategy2;
})();
var NG_DEV_MODE$3 = typeof ngDevMode === "undefined" || !!ngDevMode;
var ROUTER_CONFIGURATION = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE$3 ? "router config" : "", {
  providedIn: "root",
  factory: () => ({})
});
var UrlHandlingStrategy = /* @__PURE__ */ (() => {
  class UrlHandlingStrategy2 {
  }
  UrlHandlingStrategy2.\u0275fac = function UrlHandlingStrategy_Factory(t) {
    return new (t || UrlHandlingStrategy2)();
  };
  UrlHandlingStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: UrlHandlingStrategy2,
    factory: function() {
      return (() => inject(DefaultUrlHandlingStrategy))();
    },
    providedIn: "root"
  });
  return UrlHandlingStrategy2;
})();
var DefaultUrlHandlingStrategy = /* @__PURE__ */ (() => {
  class DefaultUrlHandlingStrategy2 {
    shouldProcessUrl(url) {
      return true;
    }
    extract(url) {
      return url;
    }
    merge(newUrlPart, wholeUrl) {
      return newUrlPart;
    }
  }
  DefaultUrlHandlingStrategy2.\u0275fac = function DefaultUrlHandlingStrategy_Factory(t) {
    return new (t || DefaultUrlHandlingStrategy2)();
  };
  DefaultUrlHandlingStrategy2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: DefaultUrlHandlingStrategy2,
    factory: DefaultUrlHandlingStrategy2.\u0275fac,
    providedIn: "root"
  });
  return DefaultUrlHandlingStrategy2;
})();
var NG_DEV_MODE$2 = typeof ngDevMode === "undefined" || !!ngDevMode;
function defaultErrorHandler2(error) {
  throw error;
}
function defaultMalformedUriErrorHandler(error, urlSerializer, url) {
  return urlSerializer.parse("/");
}
var exactMatchOptions = {
  paths: "exact",
  fragment: "ignored",
  matrixParams: "ignored",
  queryParams: "exact"
};
var subsetMatchOptions = {
  paths: "subset",
  fragment: "ignored",
  matrixParams: "ignored",
  queryParams: "subset"
};
var Router = /* @__PURE__ */ (() => {
  class Router2 {
    // TODO(b/260747083): This should not exist and navigationId should be private in
    // `NavigationTransitions`
    get navigationId() {
      return this.navigationTransitions.navigationId;
    }
    /**
     * The ɵrouterPageId of whatever page is currently active in the browser history. This is
     * important for computing the target page id for new navigations because we need to ensure each
     * page id in the browser history is 1 more than the previous entry.
     */
    get browserPageId() {
      return this.location.getState()?.\u0275routerPageId;
    }
    /**
     * An event stream for routing events.
     */
    get events() {
      return this.navigationTransitions.events;
    }
    constructor() {
      this.disposed = false;
      this.currentPageId = 0;
      this.console = inject(Console);
      this.isNgZoneEnabled = false;
      this.options = inject(ROUTER_CONFIGURATION, {
        optional: true
      }) || {};
      this.errorHandler = this.options.errorHandler || defaultErrorHandler2;
      this.malformedUriErrorHandler = this.options.malformedUriErrorHandler || defaultMalformedUriErrorHandler;
      this.navigated = false;
      this.lastSuccessfulId = -1;
      this.urlHandlingStrategy = inject(UrlHandlingStrategy);
      this.routeReuseStrategy = inject(RouteReuseStrategy);
      this.urlCreationStrategy = inject(CreateUrlTreeStrategy);
      this.titleStrategy = inject(TitleStrategy);
      this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
      this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
      this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      this.canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
      this.config = flatten(inject(ROUTES, {
        optional: true
      }) ?? []);
      this.navigationTransitions = inject(NavigationTransitions);
      this.urlSerializer = inject(UrlSerializer);
      this.location = inject(Location);
      this.isNgZoneEnabled = inject(NgZone) instanceof NgZone && NgZone.isInAngularZone();
      this.resetConfig(this.config);
      this.currentUrlTree = new UrlTree();
      this.rawUrlTree = this.currentUrlTree;
      this.browserUrlTree = this.currentUrlTree;
      this.routerState = createEmptyState(this.currentUrlTree, null);
      this.navigationTransitions.setupNavigations(this).subscribe((t) => {
        this.lastSuccessfulId = t.id;
        this.currentPageId = t.targetPageId;
      }, (e) => {
        this.console.warn(`Unhandled Navigation Error: ${e}`);
      });
    }
    /** @internal */
    resetRootComponentType(rootComponentType) {
      this.routerState.root.component = rootComponentType;
      this.navigationTransitions.rootComponentType = rootComponentType;
    }
    /**
     * Sets up the location change listener and performs the initial navigation.
     */
    initialNavigation() {
      this.setUpLocationChangeListener();
      if (!this.navigationTransitions.hasRequestedNavigation) {
        const state = this.location.getState();
        this.navigateToSyncWithBrowser(this.location.path(true), IMPERATIVE_NAVIGATION, state);
      }
    }
    /**
     * Sets up the location change listener. This listener detects navigations triggered from outside
     * the Router (the browser back/forward buttons, for example) and schedules a corresponding Router
     * navigation so that the correct events, guards, etc. are triggered.
     */
    setUpLocationChangeListener() {
      if (!this.locationSubscription) {
        this.locationSubscription = this.location.subscribe((event) => {
          const source = event["type"] === "popstate" ? "popstate" : "hashchange";
          if (source === "popstate") {
            setTimeout(() => {
              this.navigateToSyncWithBrowser(event["url"], source, event.state);
            }, 0);
          }
        });
      }
    }
    /**
     * Schedules a router navigation to synchronize Router state with the browser state.
     *
     * This is done as a response to a popstate event and the initial navigation. These
     * two scenarios represent times when the browser URL/state has been updated and
     * the Router needs to respond to ensure its internal state matches.
     */
    navigateToSyncWithBrowser(url, source, state) {
      const extras = {
        replaceUrl: true
      };
      const restoredState = state?.navigationId ? state : null;
      if (state) {
        const stateCopy = __spreadValues({}, state);
        delete stateCopy.navigationId;
        delete stateCopy.\u0275routerPageId;
        if (Object.keys(stateCopy).length !== 0) {
          extras.state = stateCopy;
        }
      }
      const urlTree = this.parseUrl(url);
      this.scheduleNavigation(urlTree, source, restoredState, extras);
    }
    /** The current URL. */
    get url() {
      return this.serializeUrl(this.currentUrlTree);
    }
    /**
     * Returns the current `Navigation` object when the router is navigating,
     * and `null` when idle.
     */
    getCurrentNavigation() {
      return this.navigationTransitions.currentNavigation;
    }
    /**
     * Resets the route configuration used for navigation and generating links.
     *
     * @param config The route array for the new configuration.
     *
     * @usageNotes
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     */
    resetConfig(config2) {
      NG_DEV_MODE$2 && validateConfig(config2);
      this.config = config2.map(standardizeConfig);
      this.navigated = false;
      this.lastSuccessfulId = -1;
    }
    /** @nodoc */
    ngOnDestroy() {
      this.dispose();
    }
    /** Disposes of the router. */
    dispose() {
      this.navigationTransitions.complete();
      if (this.locationSubscription) {
        this.locationSubscription.unsubscribe();
        this.locationSubscription = void 0;
      }
      this.disposed = true;
    }
    /**
     * Appends URL segments to the current URL tree to create a new URL tree.
     *
     * @param commands An array of URL fragments with which to construct the new URL tree.
     * If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
     * segments, followed by the parameters for each segment.
     * The fragments are applied to the current URL tree or the one provided  in the `relativeTo`
     * property of the options object, if supplied.
     * @param navigationExtras Options that control the navigation strategy.
     * @returns The new URL tree.
     *
     * @usageNotes
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it,
     * // you can do the following:
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     *
     * Note that a value of `null` or `undefined` for `relativeTo` indicates that the
     * tree should be created relative to the root.
     * ```
     */
    createUrlTree(commands, navigationExtras = {}) {
      const {
        relativeTo,
        queryParams,
        fragment,
        queryParamsHandling,
        preserveFragment
      } = navigationExtras;
      const f = preserveFragment ? this.currentUrlTree.fragment : fragment;
      let q = null;
      switch (queryParamsHandling) {
        case "merge":
          q = __spreadValues(__spreadValues({}, this.currentUrlTree.queryParams), queryParams);
          break;
        case "preserve":
          q = this.currentUrlTree.queryParams;
          break;
        default:
          q = queryParams || null;
      }
      if (q !== null) {
        q = this.removeEmptyProps(q);
      }
      return this.urlCreationStrategy.createUrlTree(relativeTo, this.routerState, this.currentUrlTree, commands, q, f ?? null);
    }
    /**
     * Navigates to a view using an absolute route path.
     *
     * @param url An absolute path for a defined route. The function does not apply any delta to the
     *     current URL.
     * @param extras An object containing properties that modify the navigation strategy.
     *
     * @returns A Promise that resolves to 'true' when navigation succeeds,
     * to 'false' when navigation fails, or is rejected on error.
     *
     * @usageNotes
     *
     * The following calls request navigation to an absolute path.
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * @see [Routing and Navigation guide](guide/router)
     *
     */
    navigateByUrl(url, extras = {
      skipLocationChange: false
    }) {
      if (NG_DEV_MODE$2) {
        if (this.isNgZoneEnabled && !NgZone.isInAngularZone()) {
          this.console.warn(`Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?`);
        }
        if (url instanceof UrlTree && url._warnIfUsedForNavigation) {
          this.console.warn(url._warnIfUsedForNavigation);
        }
      }
      const urlTree = isUrlTree(url) ? url : this.parseUrl(url);
      const mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
      return this.scheduleNavigation(mergedTree, IMPERATIVE_NAVIGATION, null, extras);
    }
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * @param commands An array of URL fragments with which to construct the target URL.
     * If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
     * segments, followed by the parameters for each segment.
     * The fragments are applied to the current URL or the one provided  in the `relativeTo` property
     * of the options object, if supplied.
     * @param extras An options object that determines how the URL should be constructed or
     *     interpreted.
     *
     * @returns A Promise that resolves to `true` when navigation succeeds, to `false` when navigation
     *     fails,
     * or is rejected on error.
     *
     * @usageNotes
     *
     * The following calls request navigation to a dynamic route path relative to the current URL.
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL, overriding the default behavior
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * @see [Routing and Navigation guide](guide/router)
     *
     */
    navigate(commands, extras = {
      skipLocationChange: false
    }) {
      validateCommands(commands);
      return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
    }
    /** Serializes a `UrlTree` into a string */
    serializeUrl(url) {
      return this.urlSerializer.serialize(url);
    }
    /** Parses a string into a `UrlTree` */
    parseUrl(url) {
      let urlTree;
      try {
        urlTree = this.urlSerializer.parse(url);
      } catch (e) {
        urlTree = this.malformedUriErrorHandler(e, this.urlSerializer, url);
      }
      return urlTree;
    }
    isActive(url, matchOptions) {
      let options;
      if (matchOptions === true) {
        options = __spreadValues({}, exactMatchOptions);
      } else if (matchOptions === false) {
        options = __spreadValues({}, subsetMatchOptions);
      } else {
        options = matchOptions;
      }
      if (isUrlTree(url)) {
        return containsTree(this.currentUrlTree, url, options);
      }
      const urlTree = this.parseUrl(url);
      return containsTree(this.currentUrlTree, urlTree, options);
    }
    removeEmptyProps(params) {
      return Object.keys(params).reduce((result, key) => {
        const value = params[key];
        if (value !== null && value !== void 0) {
          result[key] = value;
        }
        return result;
      }, {});
    }
    /** @internal */
    scheduleNavigation(rawUrl, source, restoredState, extras, priorPromise) {
      if (this.disposed) {
        return Promise.resolve(false);
      }
      let resolve;
      let reject;
      let promise2;
      if (priorPromise) {
        resolve = priorPromise.resolve;
        reject = priorPromise.reject;
        promise2 = priorPromise.promise;
      } else {
        promise2 = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
      }
      let targetPageId;
      if (this.canceledNavigationResolution === "computed") {
        if (restoredState && restoredState.\u0275routerPageId) {
          targetPageId = restoredState.\u0275routerPageId;
        } else {
          if (extras.replaceUrl || extras.skipLocationChange) {
            targetPageId = this.browserPageId ?? 0;
          } else {
            targetPageId = (this.browserPageId ?? 0) + 1;
          }
        }
      } else {
        targetPageId = 0;
      }
      this.navigationTransitions.handleNavigationRequest({
        targetPageId,
        source,
        restoredState,
        currentUrlTree: this.currentUrlTree,
        currentRawUrl: this.currentUrlTree,
        rawUrl,
        extras,
        resolve,
        reject,
        promise: promise2,
        currentSnapshot: this.routerState.snapshot,
        currentRouterState: this.routerState
      });
      return promise2.catch((e) => {
        return Promise.reject(e);
      });
    }
    /** @internal */
    setBrowserUrl(url, transition) {
      const path = this.urlSerializer.serialize(url);
      const state = __spreadValues(__spreadValues({}, transition.extras.state), this.generateNgRouterState(transition.id, transition.targetPageId));
      if (this.location.isCurrentPathEqualTo(path) || !!transition.extras.replaceUrl) {
        this.location.replaceState(path, "", state);
      } else {
        this.location.go(path, "", state);
      }
    }
    /**
     * Performs the necessary rollback action to restore the browser URL to the
     * state before the transition.
     * @internal
     */
    restoreHistory(transition, restoringFromCaughtError = false) {
      if (this.canceledNavigationResolution === "computed") {
        const targetPagePosition = this.currentPageId - transition.targetPageId;
        const browserUrlUpdateOccurred = transition.source === "popstate" || this.urlUpdateStrategy === "eager" || this.currentUrlTree === this.getCurrentNavigation()?.finalUrl;
        if (browserUrlUpdateOccurred && targetPagePosition !== 0) {
          this.location.historyGo(targetPagePosition);
        } else if (this.currentUrlTree === this.getCurrentNavigation()?.finalUrl && targetPagePosition === 0) {
          this.resetState(transition);
          this.browserUrlTree = transition.currentUrlTree;
          this.resetUrlToCurrentUrlTree();
        } else {
        }
      } else if (this.canceledNavigationResolution === "replace") {
        if (restoringFromCaughtError) {
          this.resetState(transition);
        }
        this.resetUrlToCurrentUrlTree();
      }
    }
    resetState(t) {
      this.routerState = t.currentRouterState;
      this.currentUrlTree = t.currentUrlTree;
      this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, t.rawUrl);
    }
    resetUrlToCurrentUrlTree() {
      this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId));
    }
    generateNgRouterState(navigationId, routerPageId) {
      if (this.canceledNavigationResolution === "computed") {
        return {
          navigationId,
          \u0275routerPageId: routerPageId
        };
      }
      return {
        navigationId
      };
    }
  }
  Router2.\u0275fac = function Router_Factory(t) {
    return new (t || Router2)();
  };
  Router2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: Router2,
    factory: Router2.\u0275fac,
    providedIn: "root"
  });
  return Router2;
})();
function validateCommands(commands) {
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (cmd == null) {
      throw new RuntimeError(4008, NG_DEV_MODE$2 && `The requested path contains ${cmd} segment at index ${i}`);
    }
  }
}
var RouterLink = /* @__PURE__ */ (() => {
  class RouterLink2 {
    constructor(router, route, tabIndexAttribute, renderer, el, locationStrategy) {
      this.router = router;
      this.route = route;
      this.tabIndexAttribute = tabIndexAttribute;
      this.renderer = renderer;
      this.el = el;
      this.locationStrategy = locationStrategy;
      this._preserveFragment = false;
      this._skipLocationChange = false;
      this._replaceUrl = false;
      this.href = null;
      this.commands = null;
      this.onChanges = new Subject();
      const tagName = el.nativeElement.tagName?.toLowerCase();
      this.isAnchorElement = tagName === "a" || tagName === "area";
      if (this.isAnchorElement) {
        this.subscription = router.events.subscribe((s) => {
          if (s instanceof NavigationEnd) {
            this.updateHref();
          }
        });
      } else {
        this.setTabIndexIfNotOnNativeEl("0");
      }
    }
    /**
     * Passed to {@link Router#createUrlTree Router#createUrlTree} as part of the
     * `UrlCreationOptions`.
     * @see {@link UrlCreationOptions#preserveFragment UrlCreationOptions#preserveFragment}
     * @see {@link Router#createUrlTree Router#createUrlTree}
     */
    set preserveFragment(preserveFragment) {
      this._preserveFragment = coerceToBoolean(preserveFragment);
    }
    get preserveFragment() {
      return this._preserveFragment;
    }
    /**
     * Passed to {@link Router#navigateByUrl Router#navigateByUrl} as part of the
     * `NavigationBehaviorOptions`.
     * @see {@link NavigationBehaviorOptions#skipLocationChange NavigationBehaviorOptions#skipLocationChange}
     * @see {@link Router#navigateByUrl Router#navigateByUrl}
     */
    set skipLocationChange(skipLocationChange) {
      this._skipLocationChange = coerceToBoolean(skipLocationChange);
    }
    get skipLocationChange() {
      return this._skipLocationChange;
    }
    /**
     * Passed to {@link Router#navigateByUrl Router#navigateByUrl} as part of the
     * `NavigationBehaviorOptions`.
     * @see {@link NavigationBehaviorOptions#replaceUrl NavigationBehaviorOptions#replaceUrl}
     * @see {@link Router#navigateByUrl Router#navigateByUrl}
     */
    set replaceUrl(replaceUrl) {
      this._replaceUrl = coerceToBoolean(replaceUrl);
    }
    get replaceUrl() {
      return this._replaceUrl;
    }
    /**
     * Modifies the tab index if there was not a tabindex attribute on the element during
     * instantiation.
     */
    setTabIndexIfNotOnNativeEl(newTabIndex) {
      if (this.tabIndexAttribute != null || this.isAnchorElement) {
        return;
      }
      this.applyAttributeValue("tabindex", newTabIndex);
    }
    /** @nodoc */
    ngOnChanges(changes) {
      if (this.isAnchorElement) {
        this.updateHref();
      }
      this.onChanges.next(this);
    }
    /**
     * Commands to pass to {@link Router#createUrlTree Router#createUrlTree}.
     *   - **array**: commands to pass to {@link Router#createUrlTree Router#createUrlTree}.
     *   - **string**: shorthand for array of commands with just the string, i.e. `['/route']`
     *   - **null|undefined**: effectively disables the `routerLink`
     * @see {@link Router#createUrlTree Router#createUrlTree}
     */
    set routerLink(commands) {
      if (commands != null) {
        this.commands = Array.isArray(commands) ? commands : [commands];
        this.setTabIndexIfNotOnNativeEl("0");
      } else {
        this.commands = null;
        this.setTabIndexIfNotOnNativeEl(null);
      }
    }
    /** @nodoc */
    onClick(button, ctrlKey, shiftKey, altKey, metaKey) {
      if (this.urlTree === null) {
        return true;
      }
      if (this.isAnchorElement) {
        if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) {
          return true;
        }
        if (typeof this.target === "string" && this.target != "_self") {
          return true;
        }
      }
      const extras = {
        skipLocationChange: this.skipLocationChange,
        replaceUrl: this.replaceUrl,
        state: this.state
      };
      this.router.navigateByUrl(this.urlTree, extras);
      return !this.isAnchorElement;
    }
    /** @nodoc */
    ngOnDestroy() {
      this.subscription?.unsubscribe();
    }
    updateHref() {
      this.href = this.urlTree !== null && this.locationStrategy ? this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(this.urlTree)) : null;
      const sanitizedValue = this.href === null ? null : (
        // This class represents a directive that can be added to both `<a>` elements,
        // as well as other elements. As a result, we can't define security context at
        // compile time. So the security context is deferred to runtime.
        // The `ɵɵsanitizeUrlOrResourceUrl` selects the necessary sanitizer function
        // based on the tag and property names. The logic mimics the one from
        // `packages/compiler/src/schema/dom_security_schema.ts`, which is used at compile time.
        //
        // Note: we should investigate whether we can switch to using `@HostBinding('attr.href')`
        // instead of applying a value via a renderer, after a final merge of the
        // `RouterLinkWithHref` directive.
        \u0275\u0275sanitizeUrlOrResourceUrl(this.href, this.el.nativeElement.tagName.toLowerCase(), "href")
      );
      this.applyAttributeValue("href", sanitizedValue);
    }
    applyAttributeValue(attrName, attrValue) {
      const renderer = this.renderer;
      const nativeElement = this.el.nativeElement;
      if (attrValue !== null) {
        renderer.setAttribute(nativeElement, attrName, attrValue);
      } else {
        renderer.removeAttribute(nativeElement, attrName);
      }
    }
    get urlTree() {
      if (this.commands === null) {
        return null;
      }
      return this.router.createUrlTree(this.commands, {
        // If the `relativeTo` input is not defined, we want to use `this.route` by default.
        // Otherwise, we should use the value provided by the user in the input.
        relativeTo: this.relativeTo !== void 0 ? this.relativeTo : this.route,
        queryParams: this.queryParams,
        fragment: this.fragment,
        queryParamsHandling: this.queryParamsHandling,
        preserveFragment: this.preserveFragment
      });
    }
  }
  RouterLink2.\u0275fac = function RouterLink_Factory(t) {
    return new (t || RouterLink2)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275injectAttribute("tabindex"), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(LocationStrategy));
  };
  RouterLink2.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: RouterLink2,
    selectors: [["", "routerLink", ""]],
    hostVars: 1,
    hostBindings: function RouterLink_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function RouterLink_click_HostBindingHandler($event) {
          return ctx.onClick($event.button, $event.ctrlKey, $event.shiftKey, $event.altKey, $event.metaKey);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("target", ctx.target);
      }
    },
    inputs: {
      target: "target",
      queryParams: "queryParams",
      fragment: "fragment",
      queryParamsHandling: "queryParamsHandling",
      state: "state",
      relativeTo: "relativeTo",
      preserveFragment: "preserveFragment",
      skipLocationChange: "skipLocationChange",
      replaceUrl: "replaceUrl",
      routerLink: "routerLink"
    },
    standalone: true,
    features: [\u0275\u0275NgOnChangesFeature]
  });
  return RouterLink2;
})();
var PreloadingStrategy = class {
};
var RouterPreloader = /* @__PURE__ */ (() => {
  class RouterPreloader2 {
    constructor(router, compiler, injector, preloadingStrategy, loader) {
      this.router = router;
      this.injector = injector;
      this.preloadingStrategy = preloadingStrategy;
      this.loader = loader;
    }
    setUpPreloading() {
      this.subscription = this.router.events.pipe(filter((e) => e instanceof NavigationEnd), concatMap(() => this.preload())).subscribe(() => {
      });
    }
    preload() {
      return this.processRoutes(this.injector, this.router.config);
    }
    /** @nodoc */
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
    processRoutes(injector, routes2) {
      const res = [];
      for (const route of routes2) {
        if (route.providers && !route._injector) {
          route._injector = createEnvironmentInjector(route.providers, injector, `Route: ${route.path}`);
        }
        const injectorForCurrentRoute = route._injector ?? injector;
        const injectorForChildren = route._loadedInjector ?? injectorForCurrentRoute;
        if (route.loadChildren && !route._loadedRoutes && route.canLoad === void 0 || route.loadComponent && !route._loadedComponent) {
          res.push(this.preloadConfig(injectorForCurrentRoute, route));
        }
        if (route.children || route._loadedRoutes) {
          res.push(this.processRoutes(injectorForChildren, route.children ?? route._loadedRoutes));
        }
      }
      return from(res).pipe(mergeAll());
    }
    preloadConfig(injector, route) {
      return this.preloadingStrategy.preload(route, () => {
        let loadedChildren$;
        if (route.loadChildren && route.canLoad === void 0) {
          loadedChildren$ = this.loader.loadChildren(injector, route);
        } else {
          loadedChildren$ = of(null);
        }
        const recursiveLoadChildren$ = loadedChildren$.pipe(mergeMap((config2) => {
          if (config2 === null) {
            return of(void 0);
          }
          route._loadedRoutes = config2.routes;
          route._loadedInjector = config2.injector;
          return this.processRoutes(config2.injector ?? injector, config2.routes);
        }));
        if (route.loadComponent && !route._loadedComponent) {
          const loadComponent$ = this.loader.loadComponent(route);
          return from([recursiveLoadChildren$, loadComponent$]).pipe(mergeAll());
        } else {
          return recursiveLoadChildren$;
        }
      });
    }
  }
  RouterPreloader2.\u0275fac = function RouterPreloader_Factory(t) {
    return new (t || RouterPreloader2)(\u0275\u0275inject(Router), \u0275\u0275inject(Compiler), \u0275\u0275inject(EnvironmentInjector), \u0275\u0275inject(PreloadingStrategy), \u0275\u0275inject(RouterConfigLoader));
  };
  RouterPreloader2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: RouterPreloader2,
    factory: RouterPreloader2.\u0275fac,
    providedIn: "root"
  });
  return RouterPreloader2;
})();
var ROUTER_SCROLLER = /* @__PURE__ */ new InjectionToken("");
var RouterScroller = /* @__PURE__ */ (() => {
  class RouterScroller2 {
    /** @nodoc */
    constructor(urlSerializer, transitions, viewportScroller, zone, options = {}) {
      this.urlSerializer = urlSerializer;
      this.transitions = transitions;
      this.viewportScroller = viewportScroller;
      this.zone = zone;
      this.options = options;
      this.lastId = 0;
      this.lastSource = "imperative";
      this.restoredId = 0;
      this.store = {};
      options.scrollPositionRestoration = options.scrollPositionRestoration || "disabled";
      options.anchorScrolling = options.anchorScrolling || "disabled";
    }
    init() {
      if (this.options.scrollPositionRestoration !== "disabled") {
        this.viewportScroller.setHistoryScrollRestoration("manual");
      }
      this.routerEventsSubscription = this.createScrollEvents();
      this.scrollEventsSubscription = this.consumeScrollEvents();
    }
    createScrollEvents() {
      return this.transitions.events.subscribe((e) => {
        if (e instanceof NavigationStart) {
          this.store[this.lastId] = this.viewportScroller.getScrollPosition();
          this.lastSource = e.navigationTrigger;
          this.restoredId = e.restoredState ? e.restoredState.navigationId : 0;
        } else if (e instanceof NavigationEnd) {
          this.lastId = e.id;
          this.scheduleScrollEvent(e, this.urlSerializer.parse(e.urlAfterRedirects).fragment);
        }
      });
    }
    consumeScrollEvents() {
      return this.transitions.events.subscribe((e) => {
        if (!(e instanceof Scroll))
          return;
        if (e.position) {
          if (this.options.scrollPositionRestoration === "top") {
            this.viewportScroller.scrollToPosition([0, 0]);
          } else if (this.options.scrollPositionRestoration === "enabled") {
            this.viewportScroller.scrollToPosition(e.position);
          }
        } else {
          if (e.anchor && this.options.anchorScrolling === "enabled") {
            this.viewportScroller.scrollToAnchor(e.anchor);
          } else if (this.options.scrollPositionRestoration !== "disabled") {
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        }
      });
    }
    scheduleScrollEvent(routerEvent, anchor) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            this.transitions.events.next(new Scroll(routerEvent, this.lastSource === "popstate" ? this.store[this.restoredId] : null, anchor));
          });
        }, 0);
      });
    }
    /** @nodoc */
    ngOnDestroy() {
      this.routerEventsSubscription?.unsubscribe();
      this.scrollEventsSubscription?.unsubscribe();
    }
  }
  RouterScroller2.\u0275fac = function RouterScroller_Factory(t) {
    \u0275\u0275invalidFactory();
  };
  RouterScroller2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: RouterScroller2,
    factory: RouterScroller2.\u0275fac
  });
  return RouterScroller2;
})();
var NavigationResult = /* @__PURE__ */ (() => {
  NavigationResult = NavigationResult || {};
  NavigationResult[NavigationResult["COMPLETE"] = 0] = "COMPLETE";
  NavigationResult[NavigationResult["FAILED"] = 1] = "FAILED";
  NavigationResult[NavigationResult["REDIRECTING"] = 2] = "REDIRECTING";
  return NavigationResult;
})();
function afterNextNavigation(router, action) {
  router.events.pipe(filter((e) => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError || e instanceof NavigationSkipped), map((e) => {
    if (e instanceof NavigationEnd || e instanceof NavigationSkipped) {
      return NavigationResult.COMPLETE;
    }
    const redirecting = e instanceof NavigationCancel ? e.code === 0 || e.code === 1 : false;
    return redirecting ? NavigationResult.REDIRECTING : NavigationResult.FAILED;
  }), filter((result) => result !== NavigationResult.REDIRECTING), take(1)).subscribe(() => {
    action();
  });
}
var NG_DEV_MODE$12 = typeof ngDevMode === "undefined" || ngDevMode;
function rootRoute(router) {
  return router.routerState.root;
}
function routerFeature(kind, providers) {
  return {
    \u0275kind: kind,
    \u0275providers: providers
  };
}
var ROUTER_IS_PROVIDED = /* @__PURE__ */ new InjectionToken("", {
  providedIn: "root",
  factory: () => false
});
function getBootstrapListener() {
  const injector = inject(Injector);
  return (bootstrappedComponentRef) => {
    const ref = injector.get(ApplicationRef);
    if (bootstrappedComponentRef !== ref.components[0]) {
      return;
    }
    const router = injector.get(Router);
    const bootstrapDone = injector.get(BOOTSTRAP_DONE);
    if (injector.get(INITIAL_NAVIGATION) === 1) {
      router.initialNavigation();
    }
    injector.get(ROUTER_PRELOADER, null, InjectFlags.Optional)?.setUpPreloading();
    injector.get(ROUTER_SCROLLER, null, InjectFlags.Optional)?.init();
    router.resetRootComponentType(ref.componentTypes[0]);
    if (!bootstrapDone.closed) {
      bootstrapDone.next();
      bootstrapDone.complete();
      bootstrapDone.unsubscribe();
    }
  };
}
var BOOTSTRAP_DONE = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE$12 ? "bootstrap done indicator" : "", {
  factory: () => {
    return new Subject();
  }
});
var INITIAL_NAVIGATION = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE$12 ? "initial navigation" : "", {
  providedIn: "root",
  factory: () => 1
  /* InitialNavigation.EnabledNonBlocking */
});
function withEnabledBlockingInitialNavigation() {
  const providers = [{
    provide: INITIAL_NAVIGATION,
    useValue: 0
    /* InitialNavigation.EnabledBlocking */
  }, {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [Injector],
    useFactory: (injector) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve());
      return () => {
        return locationInitialized.then(() => {
          return new Promise((resolve) => {
            const router = injector.get(Router);
            const bootstrapDone = injector.get(BOOTSTRAP_DONE);
            afterNextNavigation(router, () => {
              resolve(true);
            });
            injector.get(NavigationTransitions).afterPreactivation = () => {
              resolve(true);
              return bootstrapDone.closed ? of(void 0) : bootstrapDone;
            };
            router.initialNavigation();
          });
        });
      };
    }
  }];
  return routerFeature(2, providers);
}
function withDisabledInitialNavigation() {
  const providers = [{
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => {
      const router = inject(Router);
      return () => {
        router.setUpLocationChangeListener();
      };
    }
  }, {
    provide: INITIAL_NAVIGATION,
    useValue: 2
    /* InitialNavigation.Disabled */
  }];
  return routerFeature(3, providers);
}
function withDebugTracing() {
  let providers = [];
  if (NG_DEV_MODE$12) {
    providers = [{
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const router = inject(Router);
        return () => router.events.subscribe((e) => {
          console.group?.(`Router Event: ${e.constructor.name}`);
          console.log(stringifyEvent(e));
          console.log(e);
          console.groupEnd?.();
        });
      }
    }];
  } else {
    providers = [];
  }
  return routerFeature(1, providers);
}
var ROUTER_PRELOADER = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE$12 ? "router preloader" : "");
function withPreloading(preloadingStrategy) {
  const providers = [{
    provide: ROUTER_PRELOADER,
    useExisting: RouterPreloader
  }, {
    provide: PreloadingStrategy,
    useExisting: preloadingStrategy
  }];
  return routerFeature(0, providers);
}
var NG_DEV_MODE4 = typeof ngDevMode === "undefined" || ngDevMode;
var ROUTER_FORROOT_GUARD = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE4 ? "router duplicate forRoot guard" : "ROUTER_FORROOT_GUARD");
var ROUTER_PROVIDERS = [
  Location,
  {
    provide: UrlSerializer,
    useClass: DefaultUrlSerializer
  },
  Router,
  ChildrenOutletContexts,
  {
    provide: ActivatedRoute,
    useFactory: rootRoute,
    deps: [Router]
  },
  RouterConfigLoader,
  // Only used to warn when `provideRoutes` is used without `RouterModule` or `provideRouter`. Can
  // be removed when `provideRoutes` is removed.
  NG_DEV_MODE4 ? {
    provide: ROUTER_IS_PROVIDED,
    useValue: true
  } : []
];
function routerNgProbeToken() {
  return new NgProbeToken("Router", Router);
}
var RouterModule = /* @__PURE__ */ (() => {
  class RouterModule2 {
    constructor(guard) {
    }
    /**
     * Creates and configures a module with all the router providers and directives.
     * Optionally sets up an application listener to perform an initial navigation.
     *
     * When registering the NgModule at the root, import as follows:
     *
     * ```
     * @NgModule({
     *   imports: [RouterModule.forRoot(ROUTES)]
     * })
     * class MyNgModule {}
     * ```
     *
     * @param routes An array of `Route` objects that define the navigation paths for the application.
     * @param config An `ExtraOptions` configuration object that controls how navigation is performed.
     * @return The new `NgModule`.
     *
     */
    static forRoot(routes2, config2) {
      return {
        ngModule: RouterModule2,
        providers: [ROUTER_PROVIDERS, NG_DEV_MODE4 ? config2?.enableTracing ? withDebugTracing().\u0275providers : [] : [], {
          provide: ROUTES,
          multi: true,
          useValue: routes2
        }, {
          provide: ROUTER_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[Router, new Optional(), new SkipSelf()]]
        }, {
          provide: ROUTER_CONFIGURATION,
          useValue: config2 ? config2 : {}
        }, config2?.useHash ? provideHashLocationStrategy() : providePathLocationStrategy(), provideRouterScroller(), config2?.preloadingStrategy ? withPreloading(config2.preloadingStrategy).\u0275providers : [], {
          provide: NgProbeToken,
          multi: true,
          useFactory: routerNgProbeToken
        }, config2?.initialNavigation ? provideInitialNavigation(config2) : [], provideRouterInitializer()]
      };
    }
    /**
     * Creates a module with all the router directives and a provider registering routes,
     * without creating a new Router service.
     * When registering for submodules and lazy-loaded submodules, create the NgModule as follows:
     *
     * ```
     * @NgModule({
     *   imports: [RouterModule.forChild(ROUTES)]
     * })
     * class MyNgModule {}
     * ```
     *
     * @param routes An array of `Route` objects that define the navigation paths for the submodule.
     * @return The new NgModule.
     *
     */
    static forChild(routes2) {
      return {
        ngModule: RouterModule2,
        providers: [{
          provide: ROUTES,
          multi: true,
          useValue: routes2
        }]
      };
    }
  }
  RouterModule2.\u0275fac = function RouterModule_Factory(t) {
    return new (t || RouterModule2)(\u0275\u0275inject(ROUTER_FORROOT_GUARD, 8));
  };
  RouterModule2.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: RouterModule2
  });
  RouterModule2.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [\u0275EmptyOutletComponent]
  });
  return RouterModule2;
})();
function provideRouterScroller() {
  return {
    provide: ROUTER_SCROLLER,
    useFactory: () => {
      const viewportScroller = inject(ViewportScroller);
      const zone = inject(NgZone);
      const config2 = inject(ROUTER_CONFIGURATION);
      const transitions = inject(NavigationTransitions);
      const urlSerializer = inject(UrlSerializer);
      if (config2.scrollOffset) {
        viewportScroller.setOffset(config2.scrollOffset);
      }
      return new RouterScroller(urlSerializer, transitions, viewportScroller, zone, config2);
    }
  };
}
function provideHashLocationStrategy() {
  return {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  };
}
function providePathLocationStrategy() {
  return {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  };
}
function provideForRootGuard(router) {
  if (NG_DEV_MODE4 && router) {
    throw new RuntimeError(4007, `The Router was provided more than once. This can happen if 'forRoot' is used outside of the root injector. Lazy loaded modules should use RouterModule.forChild() instead.`);
  }
  return "guarded";
}
function provideInitialNavigation(config2) {
  return [config2.initialNavigation === "disabled" ? withDisabledInitialNavigation().\u0275providers : [], config2.initialNavigation === "enabledBlocking" ? withEnabledBlockingInitialNavigation().\u0275providers : []];
}
var ROUTER_INITIALIZER = /* @__PURE__ */ new InjectionToken(NG_DEV_MODE4 ? "Router Initializer" : "");
function provideRouterInitializer() {
  return [
    // ROUTER_INITIALIZER token should be removed. It's public API but shouldn't be. We can just
    // have `getBootstrapListener` directly attached to APP_BOOTSTRAP_LISTENER.
    {
      provide: ROUTER_INITIALIZER,
      useFactory: getBootstrapListener
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useExisting: ROUTER_INITIALIZER
    }
  ];
}

// projects/ngwc-routing/src/app/subpage/subpage.component.ts
var SubpageComponent = /* @__PURE__ */ (() => {
  const _SubpageComponent = class {
  };
  let SubpageComponent2 = _SubpageComponent;
  (() => {
    _SubpageComponent.\u0275fac = function SubpageComponent_Factory(t) {
      return new (t || _SubpageComponent)();
    };
  })();
  (() => {
    _SubpageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _SubpageComponent,
      selectors: [["app-subpage"]],
      decls: 2,
      vars: 0,
      template: function SubpageComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "p");
          \u0275\u0275text(1, "subpage works!");
          \u0275\u0275elementEnd();
        }
      },
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFtdLAogICJzb3VyY2VzQ29udGVudCI6IFtdLAogICJtYXBwaW5ncyI6ICIiLAogICJuYW1lcyI6IFtdCn0K */"]
    });
  })();
  return SubpageComponent2;
})();
(function() {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();

// projects/ngwc-routing/src/app/mainpage/mainpage.component.ts
var MainpageComponent = /* @__PURE__ */ (() => {
  const _MainpageComponent = class {
  };
  let MainpageComponent2 = _MainpageComponent;
  (() => {
    _MainpageComponent.\u0275fac = function MainpageComponent_Factory(t) {
      return new (t || _MainpageComponent)();
    };
  })();
  (() => {
    _MainpageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MainpageComponent,
      selectors: [["app-mainpage"]],
      decls: 2,
      vars: 0,
      template: function MainpageComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "p");
          \u0275\u0275text(1, "mainpage works!");
          \u0275\u0275elementEnd();
        }
      },
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFtdLAogICJzb3VyY2VzQ29udGVudCI6IFtdLAogICJtYXBwaW5ncyI6ICIiLAogICJuYW1lcyI6IFtdCn0K */"]
    });
  })();
  return MainpageComponent2;
})();
(function() {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();

// projects/ngwc-routing/src/app/app-routing.module.ts
var routes = [{
  path: "",
  component: MainpageComponent
}, {
  path: "subpage",
  component: SubpageComponent
}];
var AppRoutingModule = /* @__PURE__ */ (() => {
  const _AppRoutingModule = class {
  };
  let AppRoutingModule2 = _AppRoutingModule;
  (() => {
    _AppRoutingModule.\u0275fac = function AppRoutingModule_Factory(t) {
      return new (t || _AppRoutingModule)();
    };
  })();
  (() => {
    _AppRoutingModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _AppRoutingModule
    });
  })();
  (() => {
    _AppRoutingModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [RouterModule.forRoot(routes, {
        useHash: true
      }), RouterModule]
    });
  })();
  return AppRoutingModule2;
})();
(function() {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
(function() {
})();

// projects/ngwc-routing/src/app/app.component.ts
var AppComponent = /* @__PURE__ */ (() => {
  const _AppComponent = class {
    constructor() {
      this.title = "ngwc-routing";
    }
  };
  let AppComponent2 = _AppComponent;
  (() => {
    _AppComponent.\u0275fac = function AppComponent_Factory(t) {
      return new (t || _AppComponent)();
    };
  })();
  (() => {
    _AppComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _AppComponent,
      selectors: [["app-root"]],
      decls: 5,
      vars: 0,
      consts: [["routerLink", "/subpage"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "h1");
          \u0275\u0275text(1, "routing component");
          \u0275\u0275elementEnd();
          \u0275\u0275elementStart(2, "a", 0);
          \u0275\u0275text(3, "Subpage");
          \u0275\u0275elementEnd();
          \u0275\u0275element(4, "router-outlet");
        }
      },
      dependencies: [RouterOutlet, RouterLink],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFtdLAogICJzb3VyY2VzQ29udGVudCI6IFtdLAogICJtYXBwaW5ncyI6ICIiLAogICJuYW1lcyI6IFtdCn0K */"]
    });
  })();
  return AppComponent2;
})();
(function() {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();

// node_modules/@angular/elements/fesm2020/elements.mjs
var scheduler = {
  /**
   * Schedule a callback to be called after some delay.
   *
   * Returns a function that when executed will cancel the scheduled function.
   */
  schedule(taskFn, delay) {
    const id = setTimeout(taskFn, delay);
    return () => clearTimeout(id);
  },
  /**
   * Schedule a callback to be called before the next render.
   * (If `window.requestAnimationFrame()` is not available, use `scheduler.schedule()` instead.)
   *
   * Returns a function that when executed will cancel the scheduled function.
   */
  scheduleBeforeRender(taskFn) {
    if (typeof window === "undefined") {
      return scheduler.schedule(taskFn, 0);
    }
    if (typeof window.requestAnimationFrame === "undefined") {
      const frameMs = 16;
      return scheduler.schedule(taskFn, frameMs);
    }
    const id = window.requestAnimationFrame(taskFn);
    return () => window.cancelAnimationFrame(id);
  }
};
function camelToDashCase(input) {
  return input.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
function isElement(node) {
  return !!node && node.nodeType === Node.ELEMENT_NODE;
}
function isFunction3(value) {
  return typeof value === "function";
}
var _matches;
function matchesSelector(el, selector) {
  if (!_matches) {
    const elProto = Element.prototype;
    _matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector || elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;
  }
  return el.nodeType === Node.ELEMENT_NODE ? _matches.call(el, selector) : false;
}
function strictEquals(value1, value2) {
  return value1 === value2 || value1 !== value1 && value2 !== value2;
}
function getDefaultAttributeToPropertyInputs(inputs) {
  const attributeToPropertyInputs = {};
  inputs.forEach(({
    propName,
    templateName
  }) => {
    attributeToPropertyInputs[camelToDashCase(templateName)] = propName;
  });
  return attributeToPropertyInputs;
}
function getComponentInputs(component, injector) {
  const componentFactoryResolver = injector.get(ComponentFactoryResolver$1);
  const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
  return componentFactory.inputs;
}
function extractProjectableNodes(host, ngContentSelectors) {
  const nodes = host.childNodes;
  const projectableNodes = ngContentSelectors.map(() => []);
  let wildcardIndex = -1;
  ngContentSelectors.some((selector, i) => {
    if (selector === "*") {
      wildcardIndex = i;
      return true;
    }
    return false;
  });
  for (let i = 0, ii = nodes.length; i < ii; ++i) {
    const node = nodes[i];
    const ngContentIndex = findMatchingIndex(node, ngContentSelectors, wildcardIndex);
    if (ngContentIndex !== -1) {
      projectableNodes[ngContentIndex].push(node);
    }
  }
  return projectableNodes;
}
function findMatchingIndex(node, selectors, defaultIndex) {
  let matchingIndex = defaultIndex;
  if (isElement(node)) {
    selectors.some((selector, i) => {
      if (selector !== "*" && matchesSelector(node, selector)) {
        matchingIndex = i;
        return true;
      }
      return false;
    });
  }
  return matchingIndex;
}
var DESTROY_DELAY = 10;
var ComponentNgElementStrategyFactory = class {
  constructor(component, injector) {
    this.componentFactory = injector.get(ComponentFactoryResolver$1).resolveComponentFactory(component);
  }
  create(injector) {
    return new ComponentNgElementStrategy(this.componentFactory, injector);
  }
};
var ComponentNgElementStrategy = class {
  constructor(componentFactory, injector) {
    this.componentFactory = componentFactory;
    this.injector = injector;
    this.eventEmitters = new ReplaySubject(1);
    this.events = this.eventEmitters.pipe(switchMap((emitters) => merge(...emitters)));
    this.componentRef = null;
    this.viewChangeDetectorRef = null;
    this.inputChanges = null;
    this.hasInputChanges = false;
    this.implementsOnChanges = false;
    this.scheduledChangeDetectionFn = null;
    this.scheduledDestroyFn = null;
    this.initialInputValues = /* @__PURE__ */ new Map();
    this.unchangedInputs = new Set(this.componentFactory.inputs.map(({
      propName
    }) => propName));
    this.ngZone = this.injector.get(NgZone);
    this.elementZone = typeof Zone === "undefined" ? null : this.ngZone.run(() => Zone.current);
  }
  /**
   * Initializes a new component if one has not yet been created and cancels any scheduled
   * destruction.
   */
  connect(element) {
    this.runInZone(() => {
      if (this.scheduledDestroyFn !== null) {
        this.scheduledDestroyFn();
        this.scheduledDestroyFn = null;
        return;
      }
      if (this.componentRef === null) {
        this.initializeComponent(element);
      }
    });
  }
  /**
   * Schedules the component to be destroyed after some small delay in case the element is just
   * being moved across the DOM.
   */
  disconnect() {
    this.runInZone(() => {
      if (this.componentRef === null || this.scheduledDestroyFn !== null) {
        return;
      }
      this.scheduledDestroyFn = scheduler.schedule(() => {
        if (this.componentRef !== null) {
          this.componentRef.destroy();
          this.componentRef = null;
          this.viewChangeDetectorRef = null;
        }
      }, DESTROY_DELAY);
    });
  }
  /**
   * Returns the component property value. If the component has not yet been created, the value is
   * retrieved from the cached initialization values.
   */
  getInputValue(property) {
    return this.runInZone(() => {
      if (this.componentRef === null) {
        return this.initialInputValues.get(property);
      }
      return this.componentRef.instance[property];
    });
  }
  /**
   * Sets the input value for the property. If the component has not yet been created, the value is
   * cached and set when the component is created.
   */
  setInputValue(property, value) {
    this.runInZone(() => {
      if (this.componentRef === null) {
        this.initialInputValues.set(property, value);
        return;
      }
      if (strictEquals(value, this.getInputValue(property)) && !(value === void 0 && this.unchangedInputs.has(property))) {
        return;
      }
      this.recordInputChange(property, value);
      this.unchangedInputs.delete(property);
      this.hasInputChanges = true;
      this.componentRef.instance[property] = value;
      this.scheduleDetectChanges();
    });
  }
  /**
   * Creates a new component through the component factory with the provided element host and
   * sets up its initial inputs, listens for outputs changes, and runs an initial change detection.
   */
  initializeComponent(element) {
    const childInjector = Injector.create({
      providers: [],
      parent: this.injector
    });
    const projectableNodes = extractProjectableNodes(element, this.componentFactory.ngContentSelectors);
    this.componentRef = this.componentFactory.create(childInjector, projectableNodes, element);
    this.viewChangeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
    this.implementsOnChanges = isFunction3(this.componentRef.instance.ngOnChanges);
    this.initializeInputs();
    this.initializeOutputs(this.componentRef);
    this.detectChanges();
    const applicationRef = this.injector.get(ApplicationRef);
    applicationRef.attachView(this.componentRef.hostView);
  }
  /** Set any stored initial inputs on the component's properties. */
  initializeInputs() {
    this.componentFactory.inputs.forEach(({
      propName
    }) => {
      if (this.initialInputValues.has(propName)) {
        this.setInputValue(propName, this.initialInputValues.get(propName));
      }
    });
    this.initialInputValues.clear();
  }
  /** Sets up listeners for the component's outputs so that the events stream emits the events. */
  initializeOutputs(componentRef) {
    const eventEmitters = this.componentFactory.outputs.map(({
      propName,
      templateName
    }) => {
      const emitter = componentRef.instance[propName];
      return emitter.pipe(map((value) => ({
        name: templateName,
        value
      })));
    });
    this.eventEmitters.next(eventEmitters);
  }
  /** Calls ngOnChanges with all the inputs that have changed since the last call. */
  callNgOnChanges(componentRef) {
    if (!this.implementsOnChanges || this.inputChanges === null) {
      return;
    }
    const inputChanges = this.inputChanges;
    this.inputChanges = null;
    componentRef.instance.ngOnChanges(inputChanges);
  }
  /**
   * Marks the component view for check, if necessary.
   * (NOTE: This is required when the `ChangeDetectionStrategy` is set to `OnPush`.)
   */
  markViewForCheck(viewChangeDetectorRef) {
    if (this.hasInputChanges) {
      this.hasInputChanges = false;
      viewChangeDetectorRef.markForCheck();
    }
  }
  /**
   * Schedules change detection to run on the component.
   * Ignores subsequent calls if already scheduled.
   */
  scheduleDetectChanges() {
    if (this.scheduledChangeDetectionFn) {
      return;
    }
    this.scheduledChangeDetectionFn = scheduler.scheduleBeforeRender(() => {
      this.scheduledChangeDetectionFn = null;
      this.detectChanges();
    });
  }
  /**
   * Records input changes so that the component receives SimpleChanges in its onChanges function.
   */
  recordInputChange(property, currentValue) {
    if (!this.implementsOnChanges) {
      return;
    }
    if (this.inputChanges === null) {
      this.inputChanges = {};
    }
    const pendingChange = this.inputChanges[property];
    if (pendingChange) {
      pendingChange.currentValue = currentValue;
      return;
    }
    const isFirstChange = this.unchangedInputs.has(property);
    const previousValue = isFirstChange ? void 0 : this.getInputValue(property);
    this.inputChanges[property] = new SimpleChange(previousValue, currentValue, isFirstChange);
  }
  /** Runs change detection on the component. */
  detectChanges() {
    if (this.componentRef === null) {
      return;
    }
    this.callNgOnChanges(this.componentRef);
    this.markViewForCheck(this.viewChangeDetectorRef);
    this.componentRef.changeDetectorRef.detectChanges();
  }
  /** Runs in the angular zone, if present. */
  runInZone(fn) {
    return this.elementZone && Zone.current !== this.elementZone ? this.ngZone.run(fn) : fn();
  }
};
var NgElement = class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.ngElementEventsSubscription = null;
  }
};
function createCustomElement(component, config2) {
  const inputs = getComponentInputs(component, config2.injector);
  const strategyFactory = config2.strategyFactory || new ComponentNgElementStrategyFactory(component, config2.injector);
  const attributeToPropertyInputs = getDefaultAttributeToPropertyInputs(inputs);
  class NgElementImpl extends NgElement {
    get ngElementStrategy() {
      if (!this._ngElementStrategy) {
        const strategy = this._ngElementStrategy = strategyFactory.create(this.injector || config2.injector);
        inputs.forEach(({
          propName
        }) => {
          if (!this.hasOwnProperty(propName)) {
            return;
          }
          const value = this[propName];
          delete this[propName];
          strategy.setInputValue(propName, value);
        });
      }
      return this._ngElementStrategy;
    }
    constructor(injector) {
      super();
      this.injector = injector;
    }
    attributeChangedCallback(attrName, oldValue, newValue, namespace) {
      const propName = attributeToPropertyInputs[attrName];
      this.ngElementStrategy.setInputValue(propName, newValue);
    }
    connectedCallback() {
      let subscribedToEvents = false;
      if (this.ngElementStrategy.events) {
        this.subscribeToEvents();
        subscribedToEvents = true;
      }
      this.ngElementStrategy.connect(this);
      if (!subscribedToEvents) {
        this.subscribeToEvents();
      }
    }
    disconnectedCallback() {
      if (this._ngElementStrategy) {
        this._ngElementStrategy.disconnect();
      }
      if (this.ngElementEventsSubscription) {
        this.ngElementEventsSubscription.unsubscribe();
        this.ngElementEventsSubscription = null;
      }
    }
    subscribeToEvents() {
      this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe((e) => {
        const customEvent = new CustomEvent(e.name, {
          detail: e.value
        });
        this.dispatchEvent(customEvent);
      });
    }
  }
  NgElementImpl["observedAttributes"] = Object.keys(attributeToPropertyInputs);
  inputs.forEach(({
    propName
  }) => {
    Object.defineProperty(NgElementImpl.prototype, propName, {
      get() {
        return this.ngElementStrategy.getInputValue(propName);
      },
      set(newValue) {
        this.ngElementStrategy.setInputValue(propName, newValue);
      },
      configurable: true,
      enumerable: true
    });
  });
  return NgElementImpl;
}

// projects/ngwc-routing/src/app/app.module.ts
var AppModule = /* @__PURE__ */ (() => {
  const _AppModule = class {
    constructor() {
      this.injector = inject(Injector);
    }
    ngDoBootstrap() {
      const appComponent = createCustomElement(AppComponent, {
        injector: this.injector
      });
      customElements.define("ngwc-routing", appComponent);
    }
  };
  let AppModule2 = _AppModule;
  (() => {
    _AppModule.\u0275fac = function AppModule_Factory(t) {
      return new (t || _AppModule)();
    };
  })();
  (() => {
    _AppModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _AppModule
    });
  })();
  (() => {
    _AppModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [BrowserModule, AppRoutingModule]
    });
  })();
  return AppModule2;
})();
(function() {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
(function() {
})();

// node_modules/zone.js/fesm2015/zone.js
(function(global2) {
  const performance = global2["performance"];
  function mark(name) {
    performance && performance["mark"] && performance["mark"](name);
  }
  function performanceMeasure(name, label) {
    performance && performance["measure"] && performance["measure"](name, label);
  }
  mark("Zone");
  const symbolPrefix = global2["__Zone_symbol_prefix"] || "__zone_symbol__";
  function __symbol__(name) {
    return symbolPrefix + name;
  }
  const checkDuplicate = global2[__symbol__("forceDuplicateZoneCheck")] === true;
  if (global2["Zone"]) {
    if (checkDuplicate || typeof global2["Zone"].__symbol__ !== "function") {
      throw new Error("Zone already loaded.");
    } else {
      return global2["Zone"];
    }
  }
  let Zone2 = /* @__PURE__ */ (() => {
    class Zone3 {
      constructor(parent, zoneSpec) {
        this._parent = parent;
        this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
        this._properties = zoneSpec && zoneSpec.properties || {};
        this._zoneDelegate = new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
      }
      static assertZonePatched() {
        if (global2["Promise"] !== patches["ZoneAwarePromise"]) {
          throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
        }
      }
      static get root() {
        let zone = Zone3.current;
        while (zone.parent) {
          zone = zone.parent;
        }
        return zone;
      }
      static get current() {
        return _currentZoneFrame.zone;
      }
      static get currentTask() {
        return _currentTask;
      }
      // tslint:disable-next-line:require-internal-with-underscore
      static __load_patch(name, fn, ignoreDuplicate = false) {
        if (patches.hasOwnProperty(name)) {
          if (!ignoreDuplicate && checkDuplicate) {
            throw Error("Already loaded patch: " + name);
          }
        } else if (!global2["__Zone_disable_" + name]) {
          const perfName = "Zone:" + name;
          mark(perfName);
          patches[name] = fn(global2, Zone3, _api);
          performanceMeasure(perfName, perfName);
        }
      }
      get parent() {
        return this._parent;
      }
      get name() {
        return this._name;
      }
      get(key) {
        const zone = this.getZoneWith(key);
        if (zone)
          return zone._properties[key];
      }
      getZoneWith(key) {
        let current = this;
        while (current) {
          if (current._properties.hasOwnProperty(key)) {
            return current;
          }
          current = current._parent;
        }
        return null;
      }
      fork(zoneSpec) {
        if (!zoneSpec)
          throw new Error("ZoneSpec required!");
        return this._zoneDelegate.fork(this, zoneSpec);
      }
      wrap(callback, source) {
        if (typeof callback !== "function") {
          throw new Error("Expecting function got: " + callback);
        }
        const _callback = this._zoneDelegate.intercept(this, callback, source);
        const zone = this;
        return function() {
          return zone.runGuarded(_callback, this, arguments, source);
        };
      }
      run(callback, applyThis, applyArgs, source) {
        _currentZoneFrame = {
          parent: _currentZoneFrame,
          zone: this
        };
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } finally {
          _currentZoneFrame = _currentZoneFrame.parent;
        }
      }
      runGuarded(callback, applyThis = null, applyArgs, source) {
        _currentZoneFrame = {
          parent: _currentZoneFrame,
          zone: this
        };
        try {
          try {
            return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
          } catch (error) {
            if (this._zoneDelegate.handleError(this, error)) {
              throw error;
            }
          }
        } finally {
          _currentZoneFrame = _currentZoneFrame.parent;
        }
      }
      runTask(task, applyThis, applyArgs) {
        if (task.zone != this) {
          throw new Error("A task can only be run in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
        }
        if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
          return;
        }
        const reEntryGuard = task.state != running;
        reEntryGuard && task._transitionTo(running, scheduled2);
        task.runCount++;
        const previousTask = _currentTask;
        _currentTask = task;
        _currentZoneFrame = {
          parent: _currentZoneFrame,
          zone: this
        };
        try {
          if (task.type == macroTask && task.data && !task.data.isPeriodic) {
            task.cancelFn = void 0;
          }
          try {
            return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
          } catch (error) {
            if (this._zoneDelegate.handleError(this, error)) {
              throw error;
            }
          }
        } finally {
          if (task.state !== notScheduled && task.state !== unknown) {
            if (task.type == eventTask || task.data && task.data.isPeriodic) {
              reEntryGuard && task._transitionTo(scheduled2, running);
            } else {
              task.runCount = 0;
              this._updateTaskCount(task, -1);
              reEntryGuard && task._transitionTo(notScheduled, running, notScheduled);
            }
          }
          _currentZoneFrame = _currentZoneFrame.parent;
          _currentTask = previousTask;
        }
      }
      scheduleTask(task) {
        if (task.zone && task.zone !== this) {
          let newZone = this;
          while (newZone) {
            if (newZone === task.zone) {
              throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${task.zone.name}`);
            }
            newZone = newZone.parent;
          }
        }
        task._transitionTo(scheduling, notScheduled);
        const zoneDelegates = [];
        task._zoneDelegates = zoneDelegates;
        task._zone = this;
        try {
          task = this._zoneDelegate.scheduleTask(this, task);
        } catch (err) {
          task._transitionTo(unknown, scheduling, notScheduled);
          this._zoneDelegate.handleError(this, err);
          throw err;
        }
        if (task._zoneDelegates === zoneDelegates) {
          this._updateTaskCount(task, 1);
        }
        if (task.state == scheduling) {
          task._transitionTo(scheduled2, scheduling);
        }
        return task;
      }
      scheduleMicroTask(source, callback, data, customSchedule) {
        return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, void 0));
      }
      scheduleMacroTask(source, callback, data, customSchedule, customCancel) {
        return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
      }
      scheduleEventTask(source, callback, data, customSchedule, customCancel) {
        return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
      }
      cancelTask(task) {
        if (task.zone != this)
          throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
        if (task.state !== scheduled2 && task.state !== running) {
          return;
        }
        task._transitionTo(canceling, scheduled2, running);
        try {
          this._zoneDelegate.cancelTask(this, task);
        } catch (err) {
          task._transitionTo(unknown, canceling);
          this._zoneDelegate.handleError(this, err);
          throw err;
        }
        this._updateTaskCount(task, -1);
        task._transitionTo(notScheduled, canceling);
        task.runCount = 0;
        return task;
      }
      _updateTaskCount(task, count) {
        const zoneDelegates = task._zoneDelegates;
        if (count == -1) {
          task._zoneDelegates = null;
        }
        for (let i = 0; i < zoneDelegates.length; i++) {
          zoneDelegates[i]._updateTaskCount(task.type, count);
        }
      }
    }
    Zone3.__symbol__ = __symbol__;
    return Zone3;
  })();
  const DELEGATE_ZS = {
    name: "",
    onHasTask: (delegate, _, target, hasTaskState) => delegate.hasTask(target, hasTaskState),
    onScheduleTask: (delegate, _, target, task) => delegate.scheduleTask(target, task),
    onInvokeTask: (delegate, _, target, task, applyThis, applyArgs) => delegate.invokeTask(target, task, applyThis, applyArgs),
    onCancelTask: (delegate, _, target, task) => delegate.cancelTask(target, task)
  };
  class _ZoneDelegate {
    constructor(zone, parentDelegate, zoneSpec) {
      this._taskCounts = {
        "microTask": 0,
        "macroTask": 0,
        "eventTask": 0
      };
      this.zone = zone;
      this._parentDelegate = parentDelegate;
      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
      this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate._forkCurrZone);
      this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
      this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
      this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate._interceptCurrZone);
      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
      this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
      this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate._invokeCurrZone);
      this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
      this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
      this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate._handleErrorCurrZone);
      this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
      this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
      this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate._scheduleTaskCurrZone);
      this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
      this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
      this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate._invokeTaskCurrZone);
      this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
      this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
      this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate._cancelTaskCurrZone);
      this._hasTaskZS = null;
      this._hasTaskDlgt = null;
      this._hasTaskDlgtOwner = null;
      this._hasTaskCurrZone = null;
      const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
      const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
      if (zoneSpecHasTask || parentHasTask) {
        this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
        this._hasTaskDlgt = parentDelegate;
        this._hasTaskDlgtOwner = this;
        this._hasTaskCurrZone = zone;
        if (!zoneSpec.onScheduleTask) {
          this._scheduleTaskZS = DELEGATE_ZS;
          this._scheduleTaskDlgt = parentDelegate;
          this._scheduleTaskCurrZone = this.zone;
        }
        if (!zoneSpec.onInvokeTask) {
          this._invokeTaskZS = DELEGATE_ZS;
          this._invokeTaskDlgt = parentDelegate;
          this._invokeTaskCurrZone = this.zone;
        }
        if (!zoneSpec.onCancelTask) {
          this._cancelTaskZS = DELEGATE_ZS;
          this._cancelTaskDlgt = parentDelegate;
          this._cancelTaskCurrZone = this.zone;
        }
      }
    }
    fork(targetZone, zoneSpec) {
      return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone2(targetZone, zoneSpec);
    }
    intercept(targetZone, callback, source) {
      return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
    }
    invoke(targetZone, callback, applyThis, applyArgs, source) {
      return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
    }
    handleError(targetZone, error) {
      return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
    }
    scheduleTask(targetZone, task) {
      let returnTask = task;
      if (this._scheduleTaskZS) {
        if (this._hasTaskZS) {
          returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
        }
        returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
        if (!returnTask)
          returnTask = task;
      } else {
        if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == microTask) {
          scheduleMicroTask2(task);
        } else {
          throw new Error("Task is missing scheduleFn.");
        }
      }
      return returnTask;
    }
    invokeTask(targetZone, task, applyThis, applyArgs) {
      return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
    }
    cancelTask(targetZone, task) {
      let value;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
      } else {
        if (!task.cancelFn) {
          throw Error("Task is not cancelable");
        }
        value = task.cancelFn(task);
      }
      return value;
    }
    hasTask(targetZone, isEmpty) {
      try {
        this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
      } catch (err) {
        this.handleError(targetZone, err);
      }
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _updateTaskCount(type, count) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error("More tasks executed then were scheduled.");
      }
      if (prev == 0 || next == 0) {
        const isEmpty = {
          microTask: counts["microTask"] > 0,
          macroTask: counts["macroTask"] > 0,
          eventTask: counts["eventTask"] > 0,
          change: type
        };
        this.hasTask(this.zone, isEmpty);
      }
    }
  }
  class ZoneTask {
    constructor(type, source, callback, options, scheduleFn, cancelFn) {
      this._zone = null;
      this.runCount = 0;
      this._zoneDelegates = null;
      this._state = "notScheduled";
      this.type = type;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      if (!callback) {
        throw new Error("callback is not defined");
      }
      this.callback = callback;
      const self2 = this;
      if (type === eventTask && options && options.useG) {
        this.invoke = ZoneTask.invokeTask;
      } else {
        this.invoke = function() {
          return ZoneTask.invokeTask.call(global2, self2, this, arguments);
        };
      }
    }
    static invokeTask(task, target, args) {
      if (!task) {
        task = this;
      }
      _numberOfNestedTaskFrames++;
      try {
        task.runCount++;
        return task.zone.runTask(task, target, args);
      } finally {
        if (_numberOfNestedTaskFrames == 1) {
          drainMicroTaskQueue();
        }
        _numberOfNestedTaskFrames--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(notScheduled, scheduling);
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _transitionTo(toState, fromState1, fromState2) {
      if (this._state === fromState1 || this._state === fromState2) {
        this._state = toState;
        if (toState == notScheduled) {
          this._zoneDelegates = null;
        }
      } else {
        throw new Error(`${this.type} '${this.source}': can not transition to '${toState}', expecting state '${fromState1}'${fromState2 ? " or '" + fromState2 + "'" : ""}, was '${this._state}'.`);
      }
    }
    toString() {
      if (this.data && typeof this.data.handleId !== "undefined") {
        return this.data.handleId.toString();
      } else {
        return Object.prototype.toString.call(this);
      }
    }
    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount
      };
    }
  }
  const symbolSetTimeout = __symbol__("setTimeout");
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  let _microTaskQueue = [];
  let _isDrainingMicrotaskQueue = false;
  let nativeMicroTaskQueuePromise;
  function nativeScheduleMicroTask(func) {
    if (!nativeMicroTaskQueuePromise) {
      if (global2[symbolPromise]) {
        nativeMicroTaskQueuePromise = global2[symbolPromise].resolve(0);
      }
    }
    if (nativeMicroTaskQueuePromise) {
      let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
      if (!nativeThen) {
        nativeThen = nativeMicroTaskQueuePromise["then"];
      }
      nativeThen.call(nativeMicroTaskQueuePromise, func);
    } else {
      global2[symbolSetTimeout](func, 0);
    }
  }
  function scheduleMicroTask2(task) {
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      nativeScheduleMicroTask(drainMicroTaskQueue);
    }
    task && _microTaskQueue.push(task);
  }
  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (error) {
            _api.onUnhandledError(error);
          }
        }
      }
      _api.microtaskDrainDone();
      _isDrainingMicrotaskQueue = false;
    }
  }
  const NO_ZONE = {
    name: "NO ZONE"
  };
  const notScheduled = "notScheduled", scheduling = "scheduling", scheduled2 = "scheduled", running = "running", canceling = "canceling", unknown = "unknown";
  const microTask = "microTask", macroTask = "macroTask", eventTask = "eventTask";
  const patches = {};
  const _api = {
    symbol: __symbol__,
    currentZoneFrame: () => _currentZoneFrame,
    onUnhandledError: noop3,
    microtaskDrainDone: noop3,
    scheduleMicroTask: scheduleMicroTask2,
    showUncaughtError: () => !Zone2[__symbol__("ignoreConsoleErrorUncaughtError")],
    patchEventTarget: () => [],
    patchOnProperties: noop3,
    patchMethod: () => noop3,
    bindArguments: () => [],
    patchThen: () => noop3,
    patchMacroTask: () => noop3,
    patchEventPrototype: () => noop3,
    isIEOrEdge: () => false,
    getGlobalObjects: () => void 0,
    ObjectDefineProperty: () => noop3,
    ObjectGetOwnPropertyDescriptor: () => void 0,
    ObjectCreate: () => void 0,
    ArraySlice: () => [],
    patchClass: () => noop3,
    wrapWithCurrentZone: () => noop3,
    filterProperties: () => [],
    attachOriginToPatched: () => noop3,
    _redefineProperty: () => noop3,
    patchCallbacks: () => noop3,
    nativeScheduleMicroTask
  };
  let _currentZoneFrame = {
    parent: null,
    zone: new Zone2(null, null)
  };
  let _currentTask = null;
  let _numberOfNestedTaskFrames = 0;
  function noop3() {
  }
  performanceMeasure("Zone", "Zone");
  return global2["Zone"] = Zone2;
})(typeof window !== "undefined" && window || typeof self !== "undefined" && self || global);
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ObjectDefineProperty = Object.defineProperty;
var ObjectGetPrototypeOf = Object.getPrototypeOf;
var ObjectCreate = Object.create;
var ArraySlice = Array.prototype.slice;
var ADD_EVENT_LISTENER_STR = "addEventListener";
var REMOVE_EVENT_LISTENER_STR = "removeEventListener";
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
var TRUE_STR = "true";
var FALSE_STR = "false";
var ZONE_SYMBOL_PREFIX = Zone.__symbol__("");
function wrapWithCurrentZone(callback, source) {
  return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
  return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== "undefined";
var internalWindow = isWindowExists ? window : void 0;
var _global2 = isWindowExists && internalWindow || typeof self === "object" && self || global;
var REMOVE_ATTRIBUTE = "removeAttribute";
function bindArguments(args, source) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === "function") {
      args[i] = wrapWithCurrentZone(args[i], source + "_" + i);
    }
  }
  return args;
}
function patchPrototype(prototype, fnNames) {
  const source = prototype.constructor["name"];
  for (let i = 0; i < fnNames.length; i++) {
    const name = fnNames[i];
    const delegate = prototype[name];
    if (delegate) {
      const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
      if (!isPropertyWritable(prototypeDesc)) {
        continue;
      }
      prototype[name] = ((delegate2) => {
        const patched = function() {
          return delegate2.apply(this, bindArguments(arguments, source + "." + name));
        };
        attachOriginToPatched(patched, delegate2);
        return patched;
      })(delegate);
    }
  }
}
function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }
  if (propertyDesc.writable === false) {
    return false;
  }
  return !(typeof propertyDesc.get === "function" && typeof propertyDesc.set === "undefined");
}
var isWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
var isNode = !("nw" in _global2) && typeof _global2.process !== "undefined" && {}.toString.call(_global2.process) === "[object process]";
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var isMix = typeof _global2.process !== "undefined" && {}.toString.call(_global2.process) === "[object process]" && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var zoneSymbolEventNames$1 = {};
var wrapFn = function(event) {
  event = event || _global2.event;
  if (!event) {
    return;
  }
  let eventNameSymbol = zoneSymbolEventNames$1[event.type];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[event.type] = zoneSymbol("ON_PROPERTY" + event.type);
  }
  const target = this || event.target || _global2;
  const listener = target[eventNameSymbol];
  let result;
  if (isBrowser && target === internalWindow && event.type === "error") {
    const errorEvent = event;
    result = listener && listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
    if (result === true) {
      event.preventDefault();
    }
  } else {
    result = listener && listener.apply(this, arguments);
    if (result != void 0 && !result) {
      event.preventDefault();
    }
  }
  return result;
};
function patchProperty(obj, prop, prototype) {
  let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
  if (!desc && prototype) {
    const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
    if (prototypeDesc) {
      desc = {
        enumerable: true,
        configurable: true
      };
    }
  }
  if (!desc || !desc.configurable) {
    return;
  }
  const onPropPatchedSymbol = zoneSymbol("on" + prop + "patched");
  if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
    return;
  }
  delete desc.writable;
  delete desc.value;
  const originalDescGet = desc.get;
  const originalDescSet = desc.set;
  const eventName = prop.slice(2);
  let eventNameSymbol = zoneSymbolEventNames$1[eventName];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[eventName] = zoneSymbol("ON_PROPERTY" + eventName);
  }
  desc.set = function(newValue) {
    let target = this;
    if (!target && obj === _global2) {
      target = _global2;
    }
    if (!target) {
      return;
    }
    const previousValue = target[eventNameSymbol];
    if (typeof previousValue === "function") {
      target.removeEventListener(eventName, wrapFn);
    }
    originalDescSet && originalDescSet.call(target, null);
    target[eventNameSymbol] = newValue;
    if (typeof newValue === "function") {
      target.addEventListener(eventName, wrapFn, false);
    }
  };
  desc.get = function() {
    let target = this;
    if (!target && obj === _global2) {
      target = _global2;
    }
    if (!target) {
      return null;
    }
    const listener = target[eventNameSymbol];
    if (listener) {
      return listener;
    } else if (originalDescGet) {
      let value = originalDescGet.call(this);
      if (value) {
        desc.set.call(this, value);
        if (typeof target[REMOVE_ATTRIBUTE] === "function") {
          target.removeAttribute(prop);
        }
        return value;
      }
    }
    return null;
  };
  ObjectDefineProperty(obj, prop, desc);
  obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      patchProperty(obj, "on" + properties[i], prototype);
    }
  } else {
    const onProperties = [];
    for (const prop in obj) {
      if (prop.slice(0, 2) == "on") {
        onProperties.push(prop);
      }
    }
    for (let j = 0; j < onProperties.length; j++) {
      patchProperty(obj, onProperties[j], prototype);
    }
  }
}
var originalInstanceKey = zoneSymbol("originalInstance");
function patchClass(className) {
  const OriginalClass = _global2[className];
  if (!OriginalClass)
    return;
  _global2[zoneSymbol(className)] = OriginalClass;
  _global2[className] = function() {
    const a = bindArguments(arguments, className);
    switch (a.length) {
      case 0:
        this[originalInstanceKey] = new OriginalClass();
        break;
      case 1:
        this[originalInstanceKey] = new OriginalClass(a[0]);
        break;
      case 2:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
        break;
      case 3:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
        break;
      case 4:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
        break;
      default:
        throw new Error("Arg list too long.");
    }
  };
  attachOriginToPatched(_global2[className], OriginalClass);
  const instance = new OriginalClass(function() {
  });
  let prop;
  for (prop in instance) {
    if (className === "XMLHttpRequest" && prop === "responseBlob")
      continue;
    (function(prop2) {
      if (typeof instance[prop2] === "function") {
        _global2[className].prototype[prop2] = function() {
          return this[originalInstanceKey][prop2].apply(this[originalInstanceKey], arguments);
        };
      } else {
        ObjectDefineProperty(_global2[className].prototype, prop2, {
          set: function(fn) {
            if (typeof fn === "function") {
              this[originalInstanceKey][prop2] = wrapWithCurrentZone(fn, className + "." + prop2);
              attachOriginToPatched(this[originalInstanceKey][prop2], fn);
            } else {
              this[originalInstanceKey][prop2] = fn;
            }
          },
          get: function() {
            return this[originalInstanceKey][prop2];
          }
        });
      }
    })(prop);
  }
  for (prop in OriginalClass) {
    if (prop !== "prototype" && OriginalClass.hasOwnProperty(prop)) {
      _global2[className][prop] = OriginalClass[prop];
    }
  }
}
function patchMethod(target, name, patchFn) {
  let proto = target;
  while (proto && !proto.hasOwnProperty(name)) {
    proto = ObjectGetPrototypeOf(proto);
  }
  if (!proto && target[name]) {
    proto = target;
  }
  const delegateName = zoneSymbol(name);
  let delegate = null;
  if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
    delegate = proto[delegateName] = proto[name];
    const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
    if (isPropertyWritable(desc)) {
      const patchDelegate = patchFn(delegate, delegateName, name);
      proto[name] = function() {
        return patchDelegate(this, arguments);
      };
      attachOriginToPatched(proto[name], delegate);
    }
  }
  return delegate;
}
function patchMacroTask(obj, funcName, metaCreator) {
  let setNative = null;
  function scheduleTask(task) {
    const data = task.data;
    data.args[data.cbIdx] = function() {
      task.invoke.apply(this, arguments);
    };
    setNative.apply(data.target, data.args);
    return task;
  }
  setNative = patchMethod(obj, funcName, (delegate) => function(self2, args) {
    const meta = metaCreator(self2, args);
    if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === "function") {
      return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
    } else {
      return delegate.apply(self2, args);
    }
  });
}
function attachOriginToPatched(patched, original) {
  patched[zoneSymbol("OriginalDelegate")] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1) {
      return true;
    }
  } catch (error) {
  }
  return false;
}
function isIEOrEdge() {
  if (isDetectedIEOrEdge) {
    return ieOrEdge;
  }
  isDetectedIEOrEdge = true;
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1 || ua.indexOf("Edge/") !== -1) {
      ieOrEdge = true;
    }
  } catch (error) {
  }
  return ieOrEdge;
}
Zone.__load_patch("ZoneAwarePromise", (global2, Zone2, api) => {
  const ObjectGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
  const ObjectDefineProperty2 = Object.defineProperty;
  function readableObjectToString(obj) {
    if (obj && obj.toString === Object.prototype.toString) {
      const className = obj.constructor && obj.constructor.name;
      return (className ? className : "") + ": " + JSON.stringify(obj);
    }
    return obj ? obj.toString() : Object.prototype.toString.call(obj);
  }
  const __symbol__ = api.symbol;
  const _uncaughtPromiseErrors = [];
  const isDisableWrappingUncaughtPromiseRejection = global2[__symbol__("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] === true;
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  const creationTrace = "__creationTrace__";
  api.onUnhandledError = (e) => {
    if (api.showUncaughtError()) {
      const rejection = e && e.rejection;
      if (rejection) {
        console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e.zone.name, "; Task:", e.task && e.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : void 0);
      } else {
        console.error(e);
      }
    }
  };
  api.microtaskDrainDone = () => {
    while (_uncaughtPromiseErrors.length) {
      const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
      try {
        uncaughtPromiseError.zone.runGuarded(() => {
          if (uncaughtPromiseError.throwOriginal) {
            throw uncaughtPromiseError.rejection;
          }
          throw uncaughtPromiseError;
        });
      } catch (error) {
        handleUnhandledRejection(error);
      }
    }
  };
  const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__("unhandledPromiseRejectionHandler");
  function handleUnhandledRejection(e) {
    api.onUnhandledError(e);
    try {
      const handler = Zone2[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
      if (typeof handler === "function") {
        handler.call(this, e);
      }
    } catch (err) {
    }
  }
  function isThenable(value) {
    return value && value.then;
  }
  function forwardResolution(value) {
    return value;
  }
  function forwardRejection(rejection) {
    return ZoneAwarePromise.reject(rejection);
  }
  const symbolState = __symbol__("state");
  const symbolValue = __symbol__("value");
  const symbolFinally = __symbol__("finally");
  const symbolParentPromiseValue = __symbol__("parentPromiseValue");
  const symbolParentPromiseState = __symbol__("parentPromiseState");
  const source = "Promise.then";
  const UNRESOLVED = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;
  function makeResolver(promise2, state) {
    return (v) => {
      try {
        resolvePromise(promise2, state, v);
      } catch (err) {
        resolvePromise(promise2, false, err);
      }
    };
  }
  const once = function() {
    let wasCalled = false;
    return function wrapper(wrappedFunction) {
      return function() {
        if (wasCalled) {
          return;
        }
        wasCalled = true;
        wrappedFunction.apply(null, arguments);
      };
    };
  };
  const TYPE_ERROR = "Promise resolved with itself";
  const CURRENT_TASK_TRACE_SYMBOL = __symbol__("currentTaskTrace");
  function resolvePromise(promise2, state, value) {
    const onceWrapper = once();
    if (promise2 === value) {
      throw new TypeError(TYPE_ERROR);
    }
    if (promise2[symbolState] === UNRESOLVED) {
      let then = null;
      try {
        if (typeof value === "object" || typeof value === "function") {
          then = value && value.then;
        }
      } catch (err) {
        onceWrapper(() => {
          resolvePromise(promise2, false, err);
        })();
        return promise2;
      }
      if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
        clearRejectedNoCatch(value);
        resolvePromise(promise2, value[symbolState], value[symbolValue]);
      } else if (state !== REJECTED && typeof then === "function") {
        try {
          then.call(value, onceWrapper(makeResolver(promise2, state)), onceWrapper(makeResolver(promise2, false)));
        } catch (err) {
          onceWrapper(() => {
            resolvePromise(promise2, false, err);
          })();
        }
      } else {
        promise2[symbolState] = state;
        const queue = promise2[symbolValue];
        promise2[symbolValue] = value;
        if (promise2[symbolFinally] === symbolFinally) {
          if (state === RESOLVED) {
            promise2[symbolState] = promise2[symbolParentPromiseState];
            promise2[symbolValue] = promise2[symbolParentPromiseValue];
          }
        }
        if (state === REJECTED && value instanceof Error) {
          const trace = Zone2.currentTask && Zone2.currentTask.data && Zone2.currentTask.data[creationTrace];
          if (trace) {
            ObjectDefineProperty2(value, CURRENT_TASK_TRACE_SYMBOL, {
              configurable: true,
              enumerable: false,
              writable: true,
              value: trace
            });
          }
        }
        for (let i = 0; i < queue.length; ) {
          scheduleResolveOrReject(promise2, queue[i++], queue[i++], queue[i++], queue[i++]);
        }
        if (queue.length == 0 && state == REJECTED) {
          promise2[symbolState] = REJECTED_NO_CATCH;
          let uncaughtPromiseError = value;
          try {
            throw new Error("Uncaught (in promise): " + readableObjectToString(value) + (value && value.stack ? "\n" + value.stack : ""));
          } catch (err) {
            uncaughtPromiseError = err;
          }
          if (isDisableWrappingUncaughtPromiseRejection) {
            uncaughtPromiseError.throwOriginal = true;
          }
          uncaughtPromiseError.rejection = value;
          uncaughtPromiseError.promise = promise2;
          uncaughtPromiseError.zone = Zone2.current;
          uncaughtPromiseError.task = Zone2.currentTask;
          _uncaughtPromiseErrors.push(uncaughtPromiseError);
          api.scheduleMicroTask();
        }
      }
    }
    return promise2;
  }
  const REJECTION_HANDLED_HANDLER = __symbol__("rejectionHandledHandler");
  function clearRejectedNoCatch(promise2) {
    if (promise2[symbolState] === REJECTED_NO_CATCH) {
      try {
        const handler = Zone2[REJECTION_HANDLED_HANDLER];
        if (handler && typeof handler === "function") {
          handler.call(this, {
            rejection: promise2[symbolValue],
            promise: promise2
          });
        }
      } catch (err) {
      }
      promise2[symbolState] = REJECTED;
      for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
        if (promise2 === _uncaughtPromiseErrors[i].promise) {
          _uncaughtPromiseErrors.splice(i, 1);
        }
      }
    }
  }
  function scheduleResolveOrReject(promise2, zone, chainPromise, onFulfilled, onRejected) {
    clearRejectedNoCatch(promise2);
    const promiseState = promise2[symbolState];
    const delegate = promiseState ? typeof onFulfilled === "function" ? onFulfilled : forwardResolution : typeof onRejected === "function" ? onRejected : forwardRejection;
    zone.scheduleMicroTask(source, () => {
      try {
        const parentPromiseValue = promise2[symbolValue];
        const isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
        if (isFinallyPromise) {
          chainPromise[symbolParentPromiseValue] = parentPromiseValue;
          chainPromise[symbolParentPromiseState] = promiseState;
        }
        const value = zone.run(delegate, void 0, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
        resolvePromise(chainPromise, true, value);
      } catch (error) {
        resolvePromise(chainPromise, false, error);
      }
    }, chainPromise);
  }
  const ZONE_AWARE_PROMISE_TO_STRING = "function ZoneAwarePromise() { [native code] }";
  const noop3 = function() {
  };
  const AggregateError = global2.AggregateError;
  class ZoneAwarePromise {
    static toString() {
      return ZONE_AWARE_PROMISE_TO_STRING;
    }
    static resolve(value) {
      return resolvePromise(new this(null), RESOLVED, value);
    }
    static reject(error) {
      return resolvePromise(new this(null), REJECTED, error);
    }
    static any(values) {
      if (!values || typeof values[Symbol.iterator] !== "function") {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      const promises = [];
      let count = 0;
      try {
        for (let v of values) {
          count++;
          promises.push(ZoneAwarePromise.resolve(v));
        }
      } catch (err) {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      if (count === 0) {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      let finished = false;
      const errors = [];
      return new ZoneAwarePromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].then((v) => {
            if (finished) {
              return;
            }
            finished = true;
            resolve(v);
          }, (err) => {
            errors.push(err);
            count--;
            if (count === 0) {
              finished = true;
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          });
        }
      });
    }
    static race(values) {
      let resolve;
      let reject;
      let promise2 = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      function onResolve(value) {
        resolve(value);
      }
      function onReject(error) {
        reject(error);
      }
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        value.then(onResolve, onReject);
      }
      return promise2;
    }
    static all(values) {
      return ZoneAwarePromise.allWithCallback(values);
    }
    static allSettled(values) {
      const P = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
      return P.allWithCallback(values, {
        thenCallback: (value) => ({
          status: "fulfilled",
          value
        }),
        errorCallback: (err) => ({
          status: "rejected",
          reason: err
        })
      });
    }
    static allWithCallback(values, callback) {
      let resolve;
      let reject;
      let promise2 = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      let unresolvedCount = 2;
      let valueIndex = 0;
      const resolvedValues = [];
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        const curValueIndex = valueIndex;
        try {
          value.then((value2) => {
            resolvedValues[curValueIndex] = callback ? callback.thenCallback(value2) : value2;
            unresolvedCount--;
            if (unresolvedCount === 0) {
              resolve(resolvedValues);
            }
          }, (err) => {
            if (!callback) {
              reject(err);
            } else {
              resolvedValues[curValueIndex] = callback.errorCallback(err);
              unresolvedCount--;
              if (unresolvedCount === 0) {
                resolve(resolvedValues);
              }
            }
          });
        } catch (thenErr) {
          reject(thenErr);
        }
        unresolvedCount++;
        valueIndex++;
      }
      unresolvedCount -= 2;
      if (unresolvedCount === 0) {
        resolve(resolvedValues);
      }
      return promise2;
    }
    constructor(executor) {
      const promise2 = this;
      if (!(promise2 instanceof ZoneAwarePromise)) {
        throw new Error("Must be an instanceof Promise.");
      }
      promise2[symbolState] = UNRESOLVED;
      promise2[symbolValue] = [];
      try {
        const onceWrapper = once();
        executor && executor(onceWrapper(makeResolver(promise2, RESOLVED)), onceWrapper(makeResolver(promise2, REJECTED)));
      } catch (error) {
        resolvePromise(promise2, false, error);
      }
    }
    get [Symbol.toStringTag]() {
      return "Promise";
    }
    get [Symbol.species]() {
      return ZoneAwarePromise;
    }
    then(onFulfilled, onRejected) {
      var _a;
      let C = (_a = this.constructor) === null || _a === void 0 ? void 0 : _a[Symbol.species];
      if (!C || typeof C !== "function") {
        C = this.constructor || ZoneAwarePromise;
      }
      const chainPromise = new C(noop3);
      const zone = Zone2.current;
      if (this[symbolState] == UNRESOLVED) {
        this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
      }
      return chainPromise;
    }
    catch(onRejected) {
      return this.then(null, onRejected);
    }
    finally(onFinally) {
      var _a;
      let C = (_a = this.constructor) === null || _a === void 0 ? void 0 : _a[Symbol.species];
      if (!C || typeof C !== "function") {
        C = ZoneAwarePromise;
      }
      const chainPromise = new C(noop3);
      chainPromise[symbolFinally] = symbolFinally;
      const zone = Zone2.current;
      if (this[symbolState] == UNRESOLVED) {
        this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
      }
      return chainPromise;
    }
  }
  ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
  ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
  ZoneAwarePromise["race"] = ZoneAwarePromise.race;
  ZoneAwarePromise["all"] = ZoneAwarePromise.all;
  const NativePromise = global2[symbolPromise] = global2["Promise"];
  global2["Promise"] = ZoneAwarePromise;
  const symbolThenPatched = __symbol__("thenPatched");
  function patchThen(Ctor) {
    const proto = Ctor.prototype;
    const prop = ObjectGetOwnPropertyDescriptor2(proto, "then");
    if (prop && (prop.writable === false || !prop.configurable)) {
      return;
    }
    const originalThen = proto.then;
    proto[symbolThen] = originalThen;
    Ctor.prototype.then = function(onResolve, onReject) {
      const wrapped = new ZoneAwarePromise((resolve, reject) => {
        originalThen.call(this, resolve, reject);
      });
      return wrapped.then(onResolve, onReject);
    };
    Ctor[symbolThenPatched] = true;
  }
  api.patchThen = patchThen;
  function zoneify(fn) {
    return function(self2, args) {
      let resultPromise = fn.apply(self2, args);
      if (resultPromise instanceof ZoneAwarePromise) {
        return resultPromise;
      }
      let ctor = resultPromise.constructor;
      if (!ctor[symbolThenPatched]) {
        patchThen(ctor);
      }
      return resultPromise;
    };
  }
  if (NativePromise) {
    patchThen(NativePromise);
    patchMethod(global2, "fetch", (delegate) => zoneify(delegate));
  }
  Promise[Zone2.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
  return ZoneAwarePromise;
});
Zone.__load_patch("toString", (global2) => {
  const originalFunctionToString = Function.prototype.toString;
  const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol("OriginalDelegate");
  const PROMISE_SYMBOL = zoneSymbol("Promise");
  const ERROR_SYMBOL = zoneSymbol("Error");
  const newFunctionToString = function toString() {
    if (typeof this === "function") {
      const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
      if (originalDelegate) {
        if (typeof originalDelegate === "function") {
          return originalFunctionToString.call(originalDelegate);
        } else {
          return Object.prototype.toString.call(originalDelegate);
        }
      }
      if (this === Promise) {
        const nativePromise = global2[PROMISE_SYMBOL];
        if (nativePromise) {
          return originalFunctionToString.call(nativePromise);
        }
      }
      if (this === Error) {
        const nativeError = global2[ERROR_SYMBOL];
        if (nativeError) {
          return originalFunctionToString.call(nativeError);
        }
      }
    }
    return originalFunctionToString.call(this);
  };
  newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
  Function.prototype.toString = newFunctionToString;
  const originalObjectToString = Object.prototype.toString;
  const PROMISE_OBJECT_TO_STRING = "[object Promise]";
  Object.prototype.toString = function() {
    if (typeof Promise === "function" && this instanceof Promise) {
      return PROMISE_OBJECT_TO_STRING;
    }
    return originalObjectToString.call(this);
  };
});
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
  useG: true
};
var zoneSymbolEventNames = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = new RegExp("^" + ZONE_SYMBOL_PREFIX + "(\\w+)(true|false)$");
var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol("propagationStopped");
function prepareEventNames(eventName, eventNameToString) {
  const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
  const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
  const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
  const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
  zoneSymbolEventNames[eventName] = {};
  zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
  zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
}
function patchEventTarget(_global3, api, apis, patchOptions) {
  const ADD_EVENT_LISTENER = patchOptions && patchOptions.add || ADD_EVENT_LISTENER_STR;
  const REMOVE_EVENT_LISTENER = patchOptions && patchOptions.rm || REMOVE_EVENT_LISTENER_STR;
  const LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.listeners || "eventListeners";
  const REMOVE_ALL_LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.rmAll || "removeAllListeners";
  const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
  const ADD_EVENT_LISTENER_SOURCE = "." + ADD_EVENT_LISTENER + ":";
  const PREPEND_EVENT_LISTENER = "prependListener";
  const PREPEND_EVENT_LISTENER_SOURCE = "." + PREPEND_EVENT_LISTENER + ":";
  const invokeTask = function(task, target, event) {
    if (task.isRemoved) {
      return;
    }
    const delegate = task.callback;
    if (typeof delegate === "object" && delegate.handleEvent) {
      task.callback = (event2) => delegate.handleEvent(event2);
      task.originalDelegate = delegate;
    }
    let error;
    try {
      task.invoke(task, target, [event]);
    } catch (err) {
      error = err;
    }
    const options = task.options;
    if (options && typeof options === "object" && options.once) {
      const delegate2 = task.originalDelegate ? task.originalDelegate : task.callback;
      target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate2, options);
    }
    return error;
  };
  function globalCallback(context2, event, isCapture) {
    event = event || _global3.event;
    if (!event) {
      return;
    }
    const target = context2 || event.target || _global3;
    const tasks = target[zoneSymbolEventNames[event.type][isCapture ? TRUE_STR : FALSE_STR]];
    if (tasks) {
      const errors = [];
      if (tasks.length === 1) {
        const err = invokeTask(tasks[0], target, event);
        err && errors.push(err);
      } else {
        const copyTasks = tasks.slice();
        for (let i = 0; i < copyTasks.length; i++) {
          if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
            break;
          }
          const err = invokeTask(copyTasks[i], target, event);
          err && errors.push(err);
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          api.nativeScheduleMicroTask(() => {
            throw err;
          });
        }
      }
    }
  }
  const globalZoneAwareCallback = function(event) {
    return globalCallback(this, event, false);
  };
  const globalZoneAwareCaptureCallback = function(event) {
    return globalCallback(this, event, true);
  };
  function patchEventTargetMethods(obj, patchOptions2) {
    if (!obj) {
      return false;
    }
    let useGlobalCallback = true;
    if (patchOptions2 && patchOptions2.useG !== void 0) {
      useGlobalCallback = patchOptions2.useG;
    }
    const validateHandler = patchOptions2 && patchOptions2.vh;
    let checkDuplicate = true;
    if (patchOptions2 && patchOptions2.chkDup !== void 0) {
      checkDuplicate = patchOptions2.chkDup;
    }
    let returnTarget = false;
    if (patchOptions2 && patchOptions2.rt !== void 0) {
      returnTarget = patchOptions2.rt;
    }
    let proto = obj;
    while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
      proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && obj[ADD_EVENT_LISTENER]) {
      proto = obj;
    }
    if (!proto) {
      return false;
    }
    if (proto[zoneSymbolAddEventListener]) {
      return false;
    }
    const eventNameToString = patchOptions2 && patchOptions2.eventNameToString;
    const taskData = {};
    const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
    const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
    const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
    const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
    let nativePrependEventListener;
    if (patchOptions2 && patchOptions2.prepend) {
      nativePrependEventListener = proto[zoneSymbol(patchOptions2.prepend)] = proto[patchOptions2.prepend];
    }
    function buildEventListenerOptions(options, passive) {
      if (!passiveSupported && typeof options === "object" && options) {
        return !!options.capture;
      }
      if (!passiveSupported || !passive) {
        return options;
      }
      if (typeof options === "boolean") {
        return {
          capture: options,
          passive: true
        };
      }
      if (!options) {
        return {
          passive: true
        };
      }
      if (typeof options === "object" && options.passive !== false) {
        return Object.assign(Object.assign({}, options), {
          passive: true
        });
      }
      return options;
    }
    const customScheduleGlobal = function(task) {
      if (taskData.isExisting) {
        return;
      }
      return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
    };
    const customCancelGlobal = function(task) {
      if (!task.isRemoved) {
        const symbolEventNames = zoneSymbolEventNames[task.eventName];
        let symbolEventName;
        if (symbolEventNames) {
          symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
        }
        const existingTasks = symbolEventName && task.target[symbolEventName];
        if (existingTasks) {
          for (let i = 0; i < existingTasks.length; i++) {
            const existingTask = existingTasks[i];
            if (existingTask === task) {
              existingTasks.splice(i, 1);
              task.isRemoved = true;
              if (existingTasks.length === 0) {
                task.allRemoved = true;
                task.target[symbolEventName] = null;
              }
              break;
            }
          }
        }
      }
      if (!task.allRemoved) {
        return;
      }
      return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
    };
    const customScheduleNonGlobal = function(task) {
      return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customSchedulePrepend = function(task) {
      return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customCancelNonGlobal = function(task) {
      return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
    };
    const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
    const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
    const compareTaskCallbackVsDelegate = function(task, delegate) {
      const typeOfDelegate = typeof delegate;
      return typeOfDelegate === "function" && task.callback === delegate || typeOfDelegate === "object" && task.originalDelegate === delegate;
    };
    const compare2 = patchOptions2 && patchOptions2.diff ? patchOptions2.diff : compareTaskCallbackVsDelegate;
    const unpatchedEvents = Zone[zoneSymbol("UNPATCHED_EVENTS")];
    const passiveEvents = _global3[zoneSymbol("PASSIVE_EVENTS")];
    const makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget2 = false, prepend = false) {
      return function() {
        const target = this || _global3;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        let delegate = arguments[1];
        if (!delegate) {
          return nativeListener.apply(this, arguments);
        }
        if (isNode && eventName === "uncaughtException") {
          return nativeListener.apply(this, arguments);
        }
        let isHandleEvent = false;
        if (typeof delegate !== "function") {
          if (!delegate.handleEvent) {
            return nativeListener.apply(this, arguments);
          }
          isHandleEvent = true;
        }
        if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
          return;
        }
        const passive = passiveSupported && !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
        const options = buildEventListenerOptions(arguments[2], passive);
        if (unpatchedEvents) {
          for (let i = 0; i < unpatchedEvents.length; i++) {
            if (eventName === unpatchedEvents[i]) {
              if (passive) {
                return nativeListener.call(target, eventName, delegate, options);
              } else {
                return nativeListener.apply(this, arguments);
              }
            }
          }
        }
        const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
        const once = options && typeof options === "object" ? options.once : false;
        const zone = Zone.current;
        let symbolEventNames = zoneSymbolEventNames[eventName];
        if (!symbolEventNames) {
          prepareEventNames(eventName, eventNameToString);
          symbolEventNames = zoneSymbolEventNames[eventName];
        }
        const symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
        let existingTasks = target[symbolEventName];
        let isExisting = false;
        if (existingTasks) {
          isExisting = true;
          if (checkDuplicate) {
            for (let i = 0; i < existingTasks.length; i++) {
              if (compare2(existingTasks[i], delegate)) {
                return;
              }
            }
          }
        } else {
          existingTasks = target[symbolEventName] = [];
        }
        let source;
        const constructorName = target.constructor["name"];
        const targetSource = globalSources[constructorName];
        if (targetSource) {
          source = targetSource[eventName];
        }
        if (!source) {
          source = constructorName + addSource + (eventNameToString ? eventNameToString(eventName) : eventName);
        }
        taskData.options = options;
        if (once) {
          taskData.options.once = false;
        }
        taskData.target = target;
        taskData.capture = capture;
        taskData.eventName = eventName;
        taskData.isExisting = isExisting;
        const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : void 0;
        if (data) {
          data.taskData = taskData;
        }
        const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
        taskData.target = null;
        if (data) {
          data.taskData = null;
        }
        if (once) {
          options.once = true;
        }
        if (!(!passiveSupported && typeof task.options === "boolean")) {
          task.options = options;
        }
        task.target = target;
        task.capture = capture;
        task.eventName = eventName;
        if (isHandleEvent) {
          task.originalDelegate = delegate;
        }
        if (!prepend) {
          existingTasks.push(task);
        } else {
          existingTasks.unshift(task);
        }
        if (returnTarget2) {
          return target;
        }
      };
    };
    proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
    if (nativePrependEventListener) {
      proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
    }
    proto[REMOVE_EVENT_LISTENER] = function() {
      const target = this || _global3;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const options = arguments[2];
      const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
      const delegate = arguments[1];
      if (!delegate) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
        return;
      }
      const symbolEventNames = zoneSymbolEventNames[eventName];
      let symbolEventName;
      if (symbolEventNames) {
        symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
      }
      const existingTasks = symbolEventName && target[symbolEventName];
      if (existingTasks) {
        for (let i = 0; i < existingTasks.length; i++) {
          const existingTask = existingTasks[i];
          if (compare2(existingTask, delegate)) {
            existingTasks.splice(i, 1);
            existingTask.isRemoved = true;
            if (existingTasks.length === 0) {
              existingTask.allRemoved = true;
              target[symbolEventName] = null;
              if (typeof eventName === "string") {
                const onPropertySymbol = ZONE_SYMBOL_PREFIX + "ON_PROPERTY" + eventName;
                target[onPropertySymbol] = null;
              }
            }
            existingTask.zone.cancelTask(existingTask);
            if (returnTarget) {
              return target;
            }
            return;
          }
        }
      }
      return nativeRemoveEventListener.apply(this, arguments);
    };
    proto[LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global3;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const listeners = [];
      const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
        listeners.push(delegate);
      }
      return listeners;
    };
    proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global3;
      let eventName = arguments[0];
      if (!eventName) {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i++) {
          const prop = keys[i];
          const match2 = EVENT_NAME_SYMBOL_REGX.exec(prop);
          let evtName = match2 && match2[1];
          if (evtName && evtName !== "removeListener") {
            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
          }
        }
        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, "removeListener");
      } else {
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const symbolEventNames = zoneSymbolEventNames[eventName];
        if (symbolEventNames) {
          const symbolEventName = symbolEventNames[FALSE_STR];
          const symbolCaptureEventName = symbolEventNames[TRUE_STR];
          const tasks = target[symbolEventName];
          const captureTasks = target[symbolCaptureEventName];
          if (tasks) {
            const removeTasks = tasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
          if (captureTasks) {
            const removeTasks = captureTasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
        }
      }
      if (returnTarget) {
        return this;
      }
    };
    attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
    attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
    if (nativeRemoveAllListeners) {
      attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
    }
    if (nativeListeners) {
      attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
    }
    return true;
  }
  let results = [];
  for (let i = 0; i < apis.length; i++) {
    results[i] = patchEventTargetMethods(apis[i], patchOptions);
  }
  return results;
}
function findEventTasks(target, eventName) {
  if (!eventName) {
    const foundTasks = [];
    for (let prop in target) {
      const match2 = EVENT_NAME_SYMBOL_REGX.exec(prop);
      let evtName = match2 && match2[1];
      if (evtName && (!eventName || evtName === eventName)) {
        const tasks = target[prop];
        if (tasks) {
          for (let i = 0; i < tasks.length; i++) {
            foundTasks.push(tasks[i]);
          }
        }
      }
    }
    return foundTasks;
  }
  let symbolEventName = zoneSymbolEventNames[eventName];
  if (!symbolEventName) {
    prepareEventNames(eventName);
    symbolEventName = zoneSymbolEventNames[eventName];
  }
  const captureFalseTasks = target[symbolEventName[FALSE_STR]];
  const captureTrueTasks = target[symbolEventName[TRUE_STR]];
  if (!captureFalseTasks) {
    return captureTrueTasks ? captureTrueTasks.slice() : [];
  } else {
    return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) : captureFalseTasks.slice();
  }
}
function patchEventPrototype(global2, api) {
  const Event = global2["Event"];
  if (Event && Event.prototype) {
    api.patchMethod(Event.prototype, "stopImmediatePropagation", (delegate) => function(self2, args) {
      self2[IMMEDIATE_PROPAGATION_SYMBOL] = true;
      delegate && delegate.apply(self2, args);
    });
  }
}
function patchCallbacks(api, target, targetName, method, callbacks) {
  const symbol = Zone.__symbol__(method);
  if (target[symbol]) {
    return;
  }
  const nativeDelegate = target[symbol] = target[method];
  target[method] = function(name, opts, options) {
    if (opts && opts.prototype) {
      callbacks.forEach(function(callback) {
        const source = `${targetName}.${method}::` + callback;
        const prototype = opts.prototype;
        try {
          if (prototype.hasOwnProperty(callback)) {
            const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
            if (descriptor && descriptor.value) {
              descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
              api._redefineProperty(opts.prototype, callback, descriptor);
            } else if (prototype[callback]) {
              prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
            }
          } else if (prototype[callback]) {
            prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
          }
        } catch (_a) {
        }
      });
    }
    return nativeDelegate.call(target, name, opts, options);
  };
  api.attachOriginToPatched(target[method], nativeDelegate);
}
function filterProperties(target, onProperties, ignoreProperties) {
  if (!ignoreProperties || ignoreProperties.length === 0) {
    return onProperties;
  }
  const tip = ignoreProperties.filter((ip) => ip.target === target);
  if (!tip || tip.length === 0) {
    return onProperties;
  }
  const targetIgnoreProperties = tip[0].ignoreProperties;
  return onProperties.filter((op) => targetIgnoreProperties.indexOf(op) === -1);
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
  if (!target) {
    return;
  }
  const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
  patchOnProperties(target, filteredProperties, prototype);
}
function getOnEventNames(target) {
  return Object.getOwnPropertyNames(target).filter((name) => name.startsWith("on") && name.length > 2).map((name) => name.substring(2));
}
function propertyDescriptorPatch(api, _global3) {
  if (isNode && !isMix) {
    return;
  }
  if (Zone[api.symbol("patchEvents")]) {
    return;
  }
  const ignoreProperties = _global3["__Zone_ignore_on_properties"];
  let patchTargets = [];
  if (isBrowser) {
    const internalWindow2 = window;
    patchTargets = patchTargets.concat(["Document", "SVGElement", "Element", "HTMLElement", "HTMLBodyElement", "HTMLMediaElement", "HTMLFrameSetElement", "HTMLFrameElement", "HTMLIFrameElement", "HTMLMarqueeElement", "Worker"]);
    const ignoreErrorProperties = isIE() ? [{
      target: internalWindow2,
      ignoreProperties: ["error"]
    }] : [];
    patchFilteredProperties(internalWindow2, getOnEventNames(internalWindow2), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow2));
  }
  patchTargets = patchTargets.concat(["XMLHttpRequest", "XMLHttpRequestEventTarget", "IDBIndex", "IDBRequest", "IDBOpenDBRequest", "IDBDatabase", "IDBTransaction", "IDBCursor", "WebSocket"]);
  for (let i = 0; i < patchTargets.length; i++) {
    const target = _global3[patchTargets[i]];
    target && target.prototype && patchFilteredProperties(target.prototype, getOnEventNames(target.prototype), ignoreProperties);
  }
}
Zone.__load_patch("util", (global2, Zone2, api) => {
  const eventNames = getOnEventNames(global2);
  api.patchOnProperties = patchOnProperties;
  api.patchMethod = patchMethod;
  api.bindArguments = bindArguments;
  api.patchMacroTask = patchMacroTask;
  const SYMBOL_BLACK_LISTED_EVENTS = Zone2.__symbol__("BLACK_LISTED_EVENTS");
  const SYMBOL_UNPATCHED_EVENTS = Zone2.__symbol__("UNPATCHED_EVENTS");
  if (global2[SYMBOL_UNPATCHED_EVENTS]) {
    global2[SYMBOL_BLACK_LISTED_EVENTS] = global2[SYMBOL_UNPATCHED_EVENTS];
  }
  if (global2[SYMBOL_BLACK_LISTED_EVENTS]) {
    Zone2[SYMBOL_BLACK_LISTED_EVENTS] = Zone2[SYMBOL_UNPATCHED_EVENTS] = global2[SYMBOL_BLACK_LISTED_EVENTS];
  }
  api.patchEventPrototype = patchEventPrototype;
  api.patchEventTarget = patchEventTarget;
  api.isIEOrEdge = isIEOrEdge;
  api.ObjectDefineProperty = ObjectDefineProperty;
  api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
  api.ObjectCreate = ObjectCreate;
  api.ArraySlice = ArraySlice;
  api.patchClass = patchClass;
  api.wrapWithCurrentZone = wrapWithCurrentZone;
  api.filterProperties = filterProperties;
  api.attachOriginToPatched = attachOriginToPatched;
  api._redefineProperty = Object.defineProperty;
  api.patchCallbacks = patchCallbacks;
  api.getGlobalObjects = () => ({
    globalSources,
    zoneSymbolEventNames,
    eventNames,
    isBrowser,
    isMix,
    isNode,
    TRUE_STR,
    FALSE_STR,
    ZONE_SYMBOL_PREFIX,
    ADD_EVENT_LISTENER_STR,
    REMOVE_EVENT_LISTENER_STR
  });
});
var taskSymbol = zoneSymbol("zoneTask");
function patchTimer(window2, setName, cancelName, nameSuffix) {
  let setNative = null;
  let clearNative = null;
  setName += nameSuffix;
  cancelName += nameSuffix;
  const tasksByHandleId = {};
  function scheduleTask(task) {
    const data = task.data;
    data.args[0] = function() {
      return task.invoke.apply(this, arguments);
    };
    data.handleId = setNative.apply(window2, data.args);
    return task;
  }
  function clearTask(task) {
    return clearNative.call(window2, task.data.handleId);
  }
  setNative = patchMethod(window2, setName, (delegate) => function(self2, args) {
    if (typeof args[0] === "function") {
      const options = {
        isPeriodic: nameSuffix === "Interval",
        delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : void 0,
        args
      };
      const callback = args[0];
      args[0] = function timer() {
        try {
          return callback.apply(this, arguments);
        } finally {
          if (!options.isPeriodic) {
            if (typeof options.handleId === "number") {
              delete tasksByHandleId[options.handleId];
            } else if (options.handleId) {
              options.handleId[taskSymbol] = null;
            }
          }
        }
      };
      const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
      if (!task) {
        return task;
      }
      const handle = task.data.handleId;
      if (typeof handle === "number") {
        tasksByHandleId[handle] = task;
      } else if (handle) {
        handle[taskSymbol] = task;
      }
      if (handle && handle.ref && handle.unref && typeof handle.ref === "function" && typeof handle.unref === "function") {
        task.ref = handle.ref.bind(handle);
        task.unref = handle.unref.bind(handle);
      }
      if (typeof handle === "number" || handle) {
        return handle;
      }
      return task;
    } else {
      return delegate.apply(window2, args);
    }
  });
  clearNative = patchMethod(window2, cancelName, (delegate) => function(self2, args) {
    const id = args[0];
    let task;
    if (typeof id === "number") {
      task = tasksByHandleId[id];
    } else {
      task = id && id[taskSymbol];
      if (!task) {
        task = id;
      }
    }
    if (task && typeof task.type === "string") {
      if (task.state !== "notScheduled" && (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
        if (typeof id === "number") {
          delete tasksByHandleId[id];
        } else if (id) {
          id[taskSymbol] = null;
        }
        task.zone.cancelTask(task);
      }
    } else {
      delegate.apply(window2, args);
    }
  });
}
function patchCustomElements(_global3, api) {
  const {
    isBrowser: isBrowser2,
    isMix: isMix2
  } = api.getGlobalObjects();
  if (!isBrowser2 && !isMix2 || !_global3["customElements"] || !("customElements" in _global3)) {
    return;
  }
  const callbacks = ["connectedCallback", "disconnectedCallback", "adoptedCallback", "attributeChangedCallback"];
  api.patchCallbacks(api, _global3.customElements, "customElements", "define", callbacks);
}
function eventTargetPatch(_global3, api) {
  if (Zone[api.symbol("patchEventTarget")]) {
    return;
  }
  const {
    eventNames,
    zoneSymbolEventNames: zoneSymbolEventNames2,
    TRUE_STR: TRUE_STR2,
    FALSE_STR: FALSE_STR2,
    ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX2
  } = api.getGlobalObjects();
  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i];
    const falseEventName = eventName + FALSE_STR2;
    const trueEventName = eventName + TRUE_STR2;
    const symbol = ZONE_SYMBOL_PREFIX2 + falseEventName;
    const symbolCapture = ZONE_SYMBOL_PREFIX2 + trueEventName;
    zoneSymbolEventNames2[eventName] = {};
    zoneSymbolEventNames2[eventName][FALSE_STR2] = symbol;
    zoneSymbolEventNames2[eventName][TRUE_STR2] = symbolCapture;
  }
  const EVENT_TARGET = _global3["EventTarget"];
  if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
    return;
  }
  api.patchEventTarget(_global3, api, [EVENT_TARGET && EVENT_TARGET.prototype]);
  return true;
}
function patchEvent(global2, api) {
  api.patchEventPrototype(global2, api);
}
Zone.__load_patch("legacy", (global2) => {
  const legacyPatch = global2[Zone.__symbol__("legacyPatch")];
  if (legacyPatch) {
    legacyPatch();
  }
});
Zone.__load_patch("queueMicrotask", (global2, Zone2, api) => {
  api.patchMethod(global2, "queueMicrotask", (delegate) => {
    return function(self2, args) {
      Zone2.current.scheduleMicroTask("queueMicrotask", args[0]);
    };
  });
});
Zone.__load_patch("timers", (global2) => {
  const set = "set";
  const clear = "clear";
  patchTimer(global2, set, clear, "Timeout");
  patchTimer(global2, set, clear, "Interval");
  patchTimer(global2, set, clear, "Immediate");
});
Zone.__load_patch("requestAnimationFrame", (global2) => {
  patchTimer(global2, "request", "cancel", "AnimationFrame");
  patchTimer(global2, "mozRequest", "mozCancel", "AnimationFrame");
  patchTimer(global2, "webkitRequest", "webkitCancel", "AnimationFrame");
});
Zone.__load_patch("blocking", (global2, Zone2) => {
  const blockingMethods = ["alert", "prompt", "confirm"];
  for (let i = 0; i < blockingMethods.length; i++) {
    const name = blockingMethods[i];
    patchMethod(global2, name, (delegate, symbol, name2) => {
      return function(s, args) {
        return Zone2.current.run(delegate, global2, args, name2);
      };
    });
  }
});
Zone.__load_patch("EventTarget", (global2, Zone2, api) => {
  patchEvent(global2, api);
  eventTargetPatch(global2, api);
  const XMLHttpRequestEventTarget = global2["XMLHttpRequestEventTarget"];
  if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
    api.patchEventTarget(global2, api, [XMLHttpRequestEventTarget.prototype]);
  }
});
Zone.__load_patch("MutationObserver", (global2, Zone2, api) => {
  patchClass("MutationObserver");
  patchClass("WebKitMutationObserver");
});
Zone.__load_patch("IntersectionObserver", (global2, Zone2, api) => {
  patchClass("IntersectionObserver");
});
Zone.__load_patch("FileReader", (global2, Zone2, api) => {
  patchClass("FileReader");
});
Zone.__load_patch("on_property", (global2, Zone2, api) => {
  propertyDescriptorPatch(api, global2);
});
Zone.__load_patch("customElements", (global2, Zone2, api) => {
  patchCustomElements(global2, api);
});
Zone.__load_patch("XHR", (global2, Zone2) => {
  patchXHR(global2);
  const XHR_TASK = zoneSymbol("xhrTask");
  const XHR_SYNC = zoneSymbol("xhrSync");
  const XHR_LISTENER = zoneSymbol("xhrListener");
  const XHR_SCHEDULED = zoneSymbol("xhrScheduled");
  const XHR_URL = zoneSymbol("xhrURL");
  const XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol("xhrErrorBeforeScheduled");
  function patchXHR(window2) {
    const XMLHttpRequest2 = window2["XMLHttpRequest"];
    if (!XMLHttpRequest2) {
      return;
    }
    const XMLHttpRequestPrototype = XMLHttpRequest2.prototype;
    function findPendingTask(target) {
      return target[XHR_TASK];
    }
    let oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
    let oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
    if (!oriAddListener) {
      const XMLHttpRequestEventTarget = window2["XMLHttpRequestEventTarget"];
      if (XMLHttpRequestEventTarget) {
        const XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
        oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      }
    }
    const READY_STATE_CHANGE = "readystatechange";
    const SCHEDULED = "scheduled";
    function scheduleTask(task) {
      const data = task.data;
      const target = data.target;
      target[XHR_SCHEDULED] = false;
      target[XHR_ERROR_BEFORE_SCHEDULED] = false;
      const listener = target[XHR_LISTENER];
      if (!oriAddListener) {
        oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      }
      if (listener) {
        oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
      }
      const newListener = target[XHR_LISTENER] = () => {
        if (target.readyState === target.DONE) {
          if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
            const loadTasks = target[Zone2.__symbol__("loadfalse")];
            if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
              const oriInvoke = task.invoke;
              task.invoke = function() {
                const loadTasks2 = target[Zone2.__symbol__("loadfalse")];
                for (let i = 0; i < loadTasks2.length; i++) {
                  if (loadTasks2[i] === task) {
                    loadTasks2.splice(i, 1);
                  }
                }
                if (!data.aborted && task.state === SCHEDULED) {
                  oriInvoke.call(task);
                }
              };
              loadTasks.push(task);
            } else {
              task.invoke();
            }
          } else if (!data.aborted && target[XHR_SCHEDULED] === false) {
            target[XHR_ERROR_BEFORE_SCHEDULED] = true;
          }
        }
      };
      oriAddListener.call(target, READY_STATE_CHANGE, newListener);
      const storedTask = target[XHR_TASK];
      if (!storedTask) {
        target[XHR_TASK] = task;
      }
      sendNative.apply(target, data.args);
      target[XHR_SCHEDULED] = true;
      return task;
    }
    function placeholderCallback() {
    }
    function clearTask(task) {
      const data = task.data;
      data.aborted = true;
      return abortNative.apply(data.target, data.args);
    }
    const openNative = patchMethod(XMLHttpRequestPrototype, "open", () => function(self2, args) {
      self2[XHR_SYNC] = args[2] == false;
      self2[XHR_URL] = args[1];
      return openNative.apply(self2, args);
    });
    const XMLHTTPREQUEST_SOURCE = "XMLHttpRequest.send";
    const fetchTaskAborting = zoneSymbol("fetchTaskAborting");
    const fetchTaskScheduling = zoneSymbol("fetchTaskScheduling");
    const sendNative = patchMethod(XMLHttpRequestPrototype, "send", () => function(self2, args) {
      if (Zone2.current[fetchTaskScheduling] === true) {
        return sendNative.apply(self2, args);
      }
      if (self2[XHR_SYNC]) {
        return sendNative.apply(self2, args);
      } else {
        const options = {
          target: self2,
          url: self2[XHR_URL],
          isPeriodic: false,
          args,
          aborted: false
        };
        const task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
        if (self2 && self2[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted && task.state === SCHEDULED) {
          task.invoke();
        }
      }
    });
    const abortNative = patchMethod(XMLHttpRequestPrototype, "abort", () => function(self2, args) {
      const task = findPendingTask(self2);
      if (task && typeof task.type == "string") {
        if (task.cancelFn == null || task.data && task.data.aborted) {
          return;
        }
        task.zone.cancelTask(task);
      } else if (Zone2.current[fetchTaskAborting] === true) {
        return abortNative.apply(self2, args);
      }
    });
  }
});
Zone.__load_patch("geolocation", (global2) => {
  if (global2["navigator"] && global2["navigator"].geolocation) {
    patchPrototype(global2["navigator"].geolocation, ["getCurrentPosition", "watchPosition"]);
  }
});
Zone.__load_patch("PromiseRejectionEvent", (global2, Zone2) => {
  function findPromiseRejectionHandler(evtName) {
    return function(e) {
      const eventTasks = findEventTasks(global2, evtName);
      eventTasks.forEach((eventTask) => {
        const PromiseRejectionEvent = global2["PromiseRejectionEvent"];
        if (PromiseRejectionEvent) {
          const evt = new PromiseRejectionEvent(evtName, {
            promise: e.promise,
            reason: e.rejection
          });
          eventTask.invoke(evt);
        }
      });
    };
  }
  if (global2["PromiseRejectionEvent"]) {
    Zone2[zoneSymbol("unhandledPromiseRejectionHandler")] = findPromiseRejectionHandler("unhandledrejection");
    Zone2[zoneSymbol("rejectionHandledHandler")] = findPromiseRejectionHandler("rejectionhandled");
  }
});

// projects/ngwc-routing/src/main.ts
platformBrowser().bootstrapModule(AppModule).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
