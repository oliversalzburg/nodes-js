import {c as createCommonjsModule, a as commonjsGlobal, g as getDefaultExportFromCjs} from "./common/_commonjsHelpers-8c19dec8.js";
var $Object = Object;
var $ = {
  create: $Object.create,
  getProto: $Object.getPrototypeOf,
  isEnum: {}.propertyIsEnumerable,
  getDesc: $Object.getOwnPropertyDescriptor,
  setDesc: $Object.defineProperty,
  setDescs: $Object.defineProperties,
  getKeys: $Object.keys,
  getNames: $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each: [].forEach
};
var defineProperty = function defineProperty2(it, key, desc) {
  return $.setDesc(it, key, desc);
};
var defineProperty$1 = createCommonjsModule(function(module) {
  module.exports = {default: defineProperty, __esModule: true};
});
var createClass = createCommonjsModule(function(module, exports) {
  var _Object$defineProperty = defineProperty$1["default"];
  exports["default"] = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  exports.__esModule = true;
});
var classCallCheck = createCommonjsModule(function(module, exports) {
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
});
var $_iterStep = function(done, value) {
  return {value, done: !!done};
};
var $_iterators = {};
var toString = {}.toString;
var $_cof = function(it) {
  return toString.call(it).slice(8, -1);
};
var $_iobject = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
  return $_cof(it) == "String" ? it.split("") : Object(it);
};
var $_defined = function(it) {
  if (it == void 0)
    throw TypeError("Can't call method on  " + it);
  return it;
};
var $_toIobject = function(it) {
  return $_iobject($_defined(it));
};
var $_global = createCommonjsModule(function(module) {
  var global = module.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
  if (typeof __g == "number")
    __g = global;
});
var $_core = createCommonjsModule(function(module) {
  var core = module.exports = {version: "1.2.6"};
  if (typeof __e == "number")
    __e = core;
});
var $_aFunction = function(it) {
  if (typeof it != "function")
    throw TypeError(it + " is not a function!");
  return it;
};
var $_ctx = function(fn, that, length) {
  $_aFunction(fn);
  if (that === void 0)
    return fn;
  switch (length) {
    case 1:
      return function(a) {
        return fn.call(that, a);
      };
    case 2:
      return function(a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function(a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function() {
    return fn.apply(that, arguments);
  };
};
var PROTOTYPE = "prototype";
var $export = function(type, name, source) {
  var IS_FORCED = type & $export.F, IS_GLOBAL = type & $export.G, IS_STATIC = type & $export.S, IS_PROTO = type & $export.P, IS_BIND = type & $export.B, IS_WRAP = type & $export.W, exports = IS_GLOBAL ? $_core : $_core[name] || ($_core[name] = {}), target = IS_GLOBAL ? $_global : IS_STATIC ? $_global[name] : ($_global[name] || {})[PROTOTYPE], key, own, out;
  if (IS_GLOBAL)
    source = name;
  for (key in source) {
    own = !IS_FORCED && target && key in target;
    if (own && key in exports)
      continue;
    out = own ? target[key] : source[key];
    exports[key] = IS_GLOBAL && typeof target[key] != "function" ? source[key] : IS_BIND && own ? $_ctx(out, $_global) : IS_WRAP && target[key] == out ? function(C) {
      var F = function(param) {
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    }(out) : IS_PROTO && typeof out == "function" ? $_ctx(Function.call, out) : out;
    if (IS_PROTO)
      (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
$export.F = 1;
$export.G = 2;
$export.S = 4;
$export.P = 8;
$export.B = 16;
$export.W = 32;
var $_export = $export;
var $_propertyDesc = function(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value
  };
};
var $_fails = function(exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};
var $_descriptors = !$_fails(function() {
  return Object.defineProperty({}, "a", {get: function() {
    return 7;
  }}).a != 7;
});
var $_hide = $_descriptors ? function(object, key, value) {
  return $.setDesc(object, key, $_propertyDesc(1, value));
} : function(object, key, value) {
  object[key] = value;
  return object;
};
var $_redefine = $_hide;
var hasOwnProperty = {}.hasOwnProperty;
var $_has = function(it, key) {
  return hasOwnProperty.call(it, key);
};
var SHARED = "__core-js_shared__", store = $_global[SHARED] || ($_global[SHARED] = {});
var $_shared = function(key) {
  return store[key] || (store[key] = {});
};
var id = 0, px = Math.random();
var $_uid = function(key) {
  return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
};
var store$1 = $_shared("wks"), Symbol = $_global.Symbol;
var $_wks = function(name) {
  return store$1[name] || (store$1[name] = Symbol && Symbol[name] || (Symbol || $_uid)("Symbol." + name));
};
var def = $.setDesc, TAG = $_wks("toStringTag");
var $_setToStringTag = function(it, tag, stat) {
  if (it && !$_has(it = stat ? it : it.prototype, TAG))
    def(it, TAG, {configurable: true, value: tag});
};
var IteratorPrototype = {};
$_hide(IteratorPrototype, $_wks("iterator"), function() {
  return this;
});
var $_iterCreate = function(Constructor, NAME, next) {
  Constructor.prototype = $.create(IteratorPrototype, {next: $_propertyDesc(1, next)});
  $_setToStringTag(Constructor, NAME + " Iterator");
};
var getProto = $.getProto, ITERATOR = $_wks("iterator"), BUGGY = !([].keys && "next" in [].keys()), FF_ITERATOR = "@@iterator", KEYS = "keys", VALUES = "values";
var returnThis = function() {
  return this;
};
var $_iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $_iterCreate(Constructor, NAME, next);
  var getMethod = function(kind) {
    if (!BUGGY && kind in proto)
      return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }
    return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG2 = NAME + " Iterator", DEF_VALUES = DEFAULT == VALUES, VALUES_BUG = false, proto = Base.prototype, $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT], $default = $native || getMethod(DEFAULT), methods, key;
  if ($native) {
    var IteratorPrototype2 = getProto($default.call(new Base()));
    $_setToStringTag(IteratorPrototype2, TAG2, true);
    if (DEF_VALUES && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() {
        return $native.call(this);
      };
    }
  }
  if (FORCED && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    $_hide(proto, ITERATOR, $default);
  }
  $_iterators[NAME] = $default;
  $_iterators[TAG2] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod("entries")
    };
    if (FORCED)
      for (key in methods) {
        if (!(key in proto))
          $_redefine(proto, key, methods[key]);
      }
    else
      $_export($_export.P + $_export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
var es6_array_iterator = $_iterDefine(Array, "Array", function(iterated, kind) {
  this._t = $_toIobject(iterated);
  this._i = 0;
  this._k = kind;
}, function() {
  var O = this._t, kind = this._k, index = this._i++;
  if (!O || index >= O.length) {
    this._t = void 0;
    return $_iterStep(1);
  }
  if (kind == "keys")
    return $_iterStep(0, index);
  if (kind == "values")
    return $_iterStep(0, O[index]);
  return $_iterStep(0, [index, O[index]]);
}, "values");
$_iterators.Arguments = $_iterators.Array;
$_iterators.NodeList = $_iterators.HTMLCollection = $_iterators.Array;
var ceil = Math.ceil, floor = Math.floor;
var $_toInteger = function(it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
var $_stringAt = function(TO_STRING) {
  return function(that, pos) {
    var s = String($_defined(that)), i = $_toInteger(pos), l = s.length, a, b;
    if (i < 0 || i >= l)
      return TO_STRING ? "" : void 0;
    a = s.charCodeAt(i);
    return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
  };
};
var $at = $_stringAt(true);
$_iterDefine(String, "String", function(iterated) {
  this._t = String(iterated);
  this._i = 0;
}, function() {
  var O = this._t, index = this._i, point;
  if (index >= O.length)
    return {value: void 0, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
var $_isObject = function(it) {
  return typeof it === "object" ? it !== null : typeof it === "function";
};
var $_anObject = function(it) {
  if (!$_isObject(it))
    throw TypeError(it + " is not an object!");
  return it;
};
var TAG$1 = $_wks("toStringTag"), ARG = $_cof(function() {
  return arguments;
}()) == "Arguments";
var $_classof = function(it) {
  var O, T, B;
  return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (T = (O = Object(it))[TAG$1]) == "string" ? T : ARG ? $_cof(O) : (B = $_cof(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : B;
};
var ITERATOR$1 = $_wks("iterator");
var core_getIteratorMethod = $_core.getIteratorMethod = function(it) {
  if (it != void 0)
    return it[ITERATOR$1] || it["@@iterator"] || $_iterators[$_classof(it)];
};
var core_getIterator = $_core.getIterator = function(it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != "function")
    throw TypeError(it + " is not iterable!");
  return $_anObject(iterFn.call(it));
};
var getIterator = core_getIterator;
var getIterator$1 = createCommonjsModule(function(module) {
  module.exports = {default: getIterator, __esModule: true};
});
var ITERATOR$2 = $_wks("iterator");
var core_isIterable = $_core.isIterable = function(it) {
  var O = Object(it);
  return O[ITERATOR$2] !== void 0 || "@@iterator" in O || $_iterators.hasOwnProperty($_classof(O));
};
var isIterable = core_isIterable;
var isIterable$1 = createCommonjsModule(function(module) {
  module.exports = {default: isIterable, __esModule: true};
});
var slicedToArray = createCommonjsModule(function(module, exports) {
  var _getIterator = getIterator$1["default"];
  var _isIterable = isIterable$1["default"];
  exports["default"] = function() {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"])
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    return function(arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (_isIterable(Object(arr))) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  exports.__esModule = true;
});
var interopRequireDefault = createCommonjsModule(function(module, exports) {
  exports["default"] = function(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  };
  exports.__esModule = true;
});
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== "undefined") {
  globalContext = window;
} else if (typeof self !== "undefined") {
  globalContext = self;
} else {
  globalContext = {};
}
if (typeof globalContext.setTimeout === "function") {
  cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === "function") {
  cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var argv = [];
var version = "";
var versions = {};
var release = {};
var config = {};
function noop() {
}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
var performance = globalContext.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
  return new Date().getTime();
};
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1e3;
}
var process = {
  nextTick,
  title,
  browser,
  env: {NODE_ENV: "production"},
  argv,
  version,
  versions,
  on,
  addListener,
  once,
  off,
  removeListener,
  removeAllListeners,
  emit,
  binding,
  cwd,
  chdir,
  umask,
  hrtime,
  platform,
  release,
  config,
  uptime
};
var browserProcessHrtime = process.hrtime || hrtime$1;
var performance$1 = commonjsGlobal.performance || {};
var performanceNow$1 = performance$1.now || performance$1.mozNow || performance$1.msNow || performance$1.oNow || performance$1.webkitNow || function() {
  return new Date().getTime();
};
function hrtime$1(previousTimestamp) {
  var clocktime = performanceNow$1.call(performance$1) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
var hrtimeBrowser = createCommonjsModule(function(module, exports) {
  var _interopRequireDefault = interopRequireDefault["default"];
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _browserProcessHrtime2 = _interopRequireDefault(browserProcessHrtime);
  exports["default"] = _browserProcessHrtime2["default"];
  module.exports = exports["default"];
});
var lib = createCommonjsModule(function(module, exports) {
  var _createClass = createClass["default"];
  var _classCallCheck = classCallCheck["default"];
  var _slicedToArray = slicedToArray["default"];
  var _interopRequireDefault = interopRequireDefault["default"];
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _hrtime6 = _interopRequireDefault(hrtimeBrowser);
  var defaultFormatter = function defaultFormatter2(value) {
    if (value < 1e3) {
      return value + "ns";
    }
    if (value < 1e6) {
      return (value / 1e3).toFixed(3) + "us";
    }
    if (value < 1e9) {
      return (value / 1e6).toFixed(3) + "ms";
    }
    return (value / 1e9).toFixed(3) + "s";
  };
  var ElapsedTime = function() {
    function ElapsedTime2(opts) {
      _classCallCheck(this, ElapsedTime2);
      this._prevTime = null;
      this._savedTime = null;
      this._formatter = Object(opts).formatter;
      if (typeof this._formatter !== "function") {
        this._formatter = defaultFormatter;
      }
    }
    _createClass(ElapsedTime2, [{
      key: "start",
      value: function start() {
        if (this._prevTime !== null || this._savedTime !== null) {
          throw new Error("ElapsedTime already started, please call `reset` first!");
        }
        this._prevTime = (0, _hrtime6["default"])();
        this._savedTime = null;
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        if (this._prevTime === null && this._savedTime === null) {
          throw new Error("ElapsedTime not started, please call `start` first!");
        }
        if (this._savedTime !== null) {
          throw new Error("ElapsedTime already paused, please call `resume` first!");
        }
        var _hrtime = (0, _hrtime6["default"])(this._prevTime);
        var _hrtime2 = _slicedToArray(_hrtime, 2);
        var seconds = _hrtime2[0];
        var nanoseconds = _hrtime2[1];
        this._prevTime = null;
        this._savedTime = seconds * 1e9 + nanoseconds;
        return this;
      }
    }, {
      key: "resume",
      value: function resume() {
        if (this._prevTime === null && this._savedTime === null) {
          throw new Error("ElapsedTime not started, please call `start` first!");
        }
        if (this._savedTime === null) {
          throw new Error("ElapsedTime not paused, please call `pause` first!");
        }
        var _hrtime3 = (0, _hrtime6["default"])();
        var _hrtime32 = _slicedToArray(_hrtime3, 2);
        var seconds = _hrtime32[0];
        var nanoseconds = _hrtime32[1];
        seconds -= Math.floor(this._savedTime / 1e9);
        nanoseconds -= this._savedTime % 1e9;
        if (nanoseconds < 0) {
          seconds -= 1;
          nanoseconds += 1e9;
        }
        this._prevTime = [seconds, nanoseconds];
        this._savedTime = null;
        return this;
      }
    }, {
      key: "sleep",
      value: function sleep(timeout) {
        this.pause();
        setTimeout(this.resume.bind(this), timeout);
        return this;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._prevTime = null;
        this._savedTime = null;
        return this;
      }
    }, {
      key: "getRawValue",
      value: function getRawValue() {
        if (this._prevTime === null && this._savedTime === null) {
          throw new Error("ElapsedTime not started yet, please call `start` first!");
        }
        if (this._savedTime !== null) {
          return this._savedTime;
        }
        var _hrtime4 = (0, _hrtime6["default"])(this._prevTime);
        var _hrtime42 = _slicedToArray(_hrtime4, 2);
        var seconds = _hrtime42[0];
        var nanoseconds = _hrtime42[1];
        return seconds * 1e9 + nanoseconds;
      }
    }, {
      key: "getValue",
      value: function getValue(opts) {
        var formatter = Object(opts).formatter;
        if (typeof formatter !== "function") {
          formatter = this._formatter;
        }
        return formatter(this.getRawValue());
      }
    }], [{
      key: "new",
      value: function _new(opts) {
        return new ElapsedTime2(opts);
      }
    }, {
      key: "setDefaultFormatter",
      value: function setDefaultFormatter(formatter) {
        defaultFormatter = formatter;
      }
    }]);
    return ElapsedTime2;
  }();
  exports["default"] = ElapsedTime;
  module.exports = exports["default"];
});
var __pika_web_default_export_for_treeshaking__ = /* @__PURE__ */ getDefaultExportFromCjs(lib);
export default __pika_web_default_export_for_treeshaking__;
