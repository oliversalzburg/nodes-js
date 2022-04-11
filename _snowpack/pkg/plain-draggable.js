var MSPF = 1e3 / 60, KEEP_LOOP = 500, tasks = [];
var requestAnim = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
  return setTimeout(callback, MSPF);
}, cancelAnim = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(requestID2) {
  return clearTimeout(requestID2);
};
var lastFrameTime = Date.now(), requestID;
function step() {
  var called, next;
  if (requestID) {
    cancelAnim.call(window, requestID);
    requestID = null;
  }
  tasks.forEach(function(task) {
    var event;
    if (event = task.event) {
      task.event = null;
      task.listener(event);
      called = true;
    }
  });
  if (called) {
    lastFrameTime = Date.now();
    next = true;
  } else if (Date.now() - lastFrameTime < KEEP_LOOP) {
    next = true;
  }
  if (next) {
    requestID = requestAnim.call(window, step);
  }
}
function indexOfTasks(listener) {
  var index = -1;
  tasks.some(function(task, i) {
    if (task.listener === listener) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
}
var AnimEvent = {
  add: function add(listener) {
    var task;
    if (indexOfTasks(listener) === -1) {
      tasks.push(task = {
        listener
      });
      return function(event) {
        task.event = event;
        if (!requestID) {
          step();
        }
      };
    }
    return null;
  },
  remove: function remove(listener) {
    var iRemove;
    if ((iRemove = indexOfTasks(listener)) > -1) {
      tasks.splice(iRemove, 1);
      if (!tasks.length && requestID) {
        cancelAnim.call(window, requestID);
        requestID = null;
      }
    }
  }
};
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
var MOUSE_EMU_INTERVAL = 400;
var passiveSupported = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, "passive", {
    get: function get() {
      passiveSupported = true;
    }
  }));
} catch (error) {
}
function addEventListenerWithOptions(target, type, listener, options) {
  target.addEventListener(type, listener, passiveSupported ? options : options.capture);
}
function getTouchById(touches, id) {
  if (touches != null && id != null) {
    for (var i = 0; i < touches.length; i++) {
      if (touches[i].identifier === id) {
        return touches[i];
      }
    }
  }
  return null;
}
function hasXY(xy) {
  return xy && typeof xy.clientX === "number" && typeof xy.clientY === "number";
}
function dragstart(event) {
  event.preventDefault();
}
var PointerEvent = /* @__PURE__ */ function() {
  function PointerEvent2(options) {
    var _this = this;
    _classCallCheck(this, PointerEvent2);
    this.startHandlers = {};
    this.lastHandlerId = 0;
    this.curPointerClass = null;
    this.curTouchId = null;
    this.lastPointerXY = {
      clientX: 0,
      clientY: 0
    };
    this.lastTouchTime = 0;
    this.options = {
      preventDefault: true,
      stopPropagation: true
    };
    if (options) {
      ["preventDefault", "stopPropagation"].forEach(function(option) {
        if (typeof options[option] === "boolean") {
          _this.options[option] = options[option];
        }
      });
    }
  }
  _createClass(PointerEvent2, [{
    key: "regStartHandler",
    value: function regStartHandler(startHandler) {
      var that = this;
      that.startHandlers[++that.lastHandlerId] = function(event) {
        var pointerClass = event.type === "mousedown" ? "mouse" : "touch", now = Date.now();
        var pointerXY, touchId;
        if (pointerClass === "touch") {
          that.lastTouchTime = now;
          pointerXY = event.changedTouches[0];
          touchId = event.changedTouches[0].identifier;
        } else {
          if (now - that.lastTouchTime < MOUSE_EMU_INTERVAL) {
            return;
          }
          pointerXY = event;
        }
        if (!hasXY(pointerXY)) {
          throw new Error("No clientX/clientY");
        }
        if (that.curPointerClass) {
          that.cancel();
        }
        if (startHandler.call(that, pointerXY)) {
          that.curPointerClass = pointerClass;
          that.curTouchId = pointerClass === "touch" ? touchId : null;
          that.lastPointerXY.clientX = pointerXY.clientX;
          that.lastPointerXY.clientY = pointerXY.clientY;
          if (that.options.preventDefault) {
            event.preventDefault();
          }
          if (that.options.stopPropagation) {
            event.stopPropagation();
          }
        }
      };
      return that.lastHandlerId;
    }
  }, {
    key: "unregStartHandler",
    value: function unregStartHandler(handlerId) {
      delete this.startHandlers[handlerId];
    }
  }, {
    key: "addStartHandler",
    value: function addStartHandler(element, handlerId) {
      if (!this.startHandlers[handlerId]) {
        throw new Error("Invalid handlerId: ".concat(handlerId));
      }
      addEventListenerWithOptions(element, "mousedown", this.startHandlers[handlerId], {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, "touchstart", this.startHandlers[handlerId], {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, "dragstart", dragstart, {
        capture: false,
        passive: false
      });
      return handlerId;
    }
  }, {
    key: "removeStartHandler",
    value: function removeStartHandler(element, handlerId) {
      if (!this.startHandlers[handlerId]) {
        throw new Error("Invalid handlerId: ".concat(handlerId));
      }
      element.removeEventListener("mousedown", this.startHandlers[handlerId], false);
      element.removeEventListener("touchstart", this.startHandlers[handlerId], false);
      element.removeEventListener("dragstart", dragstart, false);
      return handlerId;
    }
  }, {
    key: "addMoveHandler",
    value: function addMoveHandler(element, moveHandler, rawEvent) {
      var that = this;
      function handler(event) {
        var pointerClass = event.type === "mousemove" ? "mouse" : "touch";
        if (pointerClass === "touch") {
          that.lastTouchTime = Date.now();
        }
        if (pointerClass === that.curPointerClass) {
          var pointerXY = pointerClass === "touch" ? getTouchById(event.changedTouches, that.curTouchId) : event;
          if (hasXY(pointerXY)) {
            if (pointerXY.clientX !== that.lastPointerXY.clientX || pointerXY.clientY !== that.lastPointerXY.clientY) {
              that.move(pointerXY);
            }
            if (that.options.preventDefault) {
              event.preventDefault();
            }
            if (that.options.stopPropagation) {
              event.stopPropagation();
            }
          }
        }
      }
      var wrappedHandler = rawEvent ? handler : AnimEvent.add(handler);
      addEventListenerWithOptions(element, "mousemove", wrappedHandler, {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, "touchmove", wrappedHandler, {
        capture: false,
        passive: false
      });
      that.curMoveHandler = moveHandler;
    }
  }, {
    key: "move",
    value: function move2(pointerXY) {
      if (hasXY(pointerXY)) {
        this.lastPointerXY.clientX = pointerXY.clientX;
        this.lastPointerXY.clientY = pointerXY.clientY;
      }
      if (this.curMoveHandler) {
        this.curMoveHandler(this.lastPointerXY);
      }
    }
  }, {
    key: "addEndHandler",
    value: function addEndHandler(element, endHandler) {
      var that = this;
      function wrappedHandler(event) {
        var pointerClass = event.type === "mouseup" ? "mouse" : "touch";
        if (pointerClass === "touch") {
          that.lastTouchTime = Date.now();
        }
        if (pointerClass === that.curPointerClass) {
          var pointerXY = pointerClass === "touch" ? getTouchById(event.changedTouches, that.curTouchId) || (getTouchById(event.touches, that.curTouchId) ? null : {}) : event;
          if (pointerXY) {
            that.end(pointerXY);
            if (that.options.preventDefault) {
              event.preventDefault();
            }
            if (that.options.stopPropagation) {
              event.stopPropagation();
            }
          }
        }
      }
      addEventListenerWithOptions(element, "mouseup", wrappedHandler, {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, "touchend", wrappedHandler, {
        capture: false,
        passive: false
      });
      that.curEndHandler = endHandler;
    }
  }, {
    key: "end",
    value: function end(pointerXY) {
      if (hasXY(pointerXY)) {
        this.lastPointerXY.clientX = pointerXY.clientX;
        this.lastPointerXY.clientY = pointerXY.clientY;
      }
      if (this.curEndHandler) {
        this.curEndHandler(this.lastPointerXY);
      }
      this.curPointerClass = this.curTouchId = null;
    }
  }, {
    key: "addCancelHandler",
    value: function addCancelHandler(element, cancelHandler) {
      var that = this;
      function wrappedHandler(event) {
        that.lastTouchTime = Date.now();
        if (that.curPointerClass != null) {
          var pointerXY = getTouchById(event.changedTouches, that.curTouchId) || (getTouchById(event.touches, that.curTouchId) ? null : {});
          if (pointerXY) {
            that.cancel();
          }
        }
      }
      addEventListenerWithOptions(element, "touchcancel", wrappedHandler, {
        capture: false,
        passive: false
      });
      that.curCancelHandler = cancelHandler;
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.curCancelHandler) {
        this.curCancelHandler();
      }
      this.curPointerClass = this.curTouchId = null;
    }
  }], [{
    key: "addEventListenerWithOptions",
    get: function get() {
      return addEventListenerWithOptions;
    }
  }]);
  return PointerEvent2;
}();
function ucf(text) {
  return text.substr(0, 1).toUpperCase() + text.substr(1);
}
var PREFIXES = ["webkit", "moz", "ms", "o"], NAME_PREFIXES = PREFIXES.reduce(function(prefixes, prefix) {
  prefixes.push(prefix);
  prefixes.push(ucf(prefix));
  return prefixes;
}, []), VALUE_PREFIXES = PREFIXES.map(function(prefix) {
  return "-".concat(prefix, "-");
}), getDeclaration = function() {
  var declaration;
  return function() {
    return declaration = declaration || document.createElement("div").style;
  };
}(), normalizeName = function() {
  var rePrefixedName = new RegExp("^(?:" + PREFIXES.join("|") + ")(.)", "i"), reUc = /[A-Z]/;
  return function(propName) {
    return (propName = (propName + "").replace(/\s/g, "").replace(/-([\da-z])/gi, function(str, p1) {
      return p1.toUpperCase();
    }).replace(rePrefixedName, function(str, p1) {
      return reUc.test(p1) ? p1.toLowerCase() : str;
    })).toLowerCase() === "float" ? "cssFloat" : propName;
  };
}(), normalizeValue = function() {
  var rePrefixedValue = new RegExp("^(?:" + VALUE_PREFIXES.join("|") + ")", "i");
  return function(propValue) {
    return (propValue != null ? propValue + "" : "").replace(/\s/g, "").replace(rePrefixedValue, "");
  };
}(), cssSupports = function() {
  return function(propName, propValue) {
    var declaration = getDeclaration();
    propName = propName.replace(/[A-Z]/g, function(str) {
      return "-".concat(str.toLowerCase());
    });
    declaration.setProperty(propName, propValue);
    return declaration[propName] != null && declaration.getPropertyValue(propName) === propValue;
  };
}(), propNames = {}, propValues = {};
function getName(propName) {
  propName = normalizeName(propName);
  if (propName && propNames[propName] == null) {
    var declaration = getDeclaration();
    if (declaration[propName] != null) {
      propNames[propName] = propName;
    } else {
      var ucfName = ucf(propName);
      if (!NAME_PREFIXES.some(function(prefix) {
        var prefixed = prefix + ucfName;
        if (declaration[prefixed] != null) {
          propNames[propName] = prefixed;
          return true;
        }
        return false;
      })) {
        propNames[propName] = false;
      }
    }
  }
  return propNames[propName] || void 0;
}
function getValue(propName, propValue) {
  var res;
  if (!(propName = getName(propName))) {
    return res;
  }
  propValues[propName] = propValues[propName] || {};
  (Array.isArray(propValue) ? propValue : [propValue]).some(function(propValue2) {
    propValue2 = normalizeValue(propValue2);
    if (propValues[propName][propValue2] != null) {
      if (propValues[propName][propValue2] !== false) {
        res = propValues[propName][propValue2];
        return true;
      }
      return false;
    }
    if (cssSupports(propName, propValue2)) {
      res = propValues[propName][propValue2] = propValue2;
      return true;
    }
    if (VALUE_PREFIXES.some(function(prefix) {
      var prefixed = prefix + propValue2;
      if (cssSupports(propName, prefixed)) {
        res = propValues[propName][propValue2] = prefixed;
        return true;
      }
      return false;
    })) {
      return true;
    }
    propValues[propName][propValue2] = false;
    return false;
  });
  return typeof res === "string" ? res : void 0;
}
var CSSPrefix = {
  getName,
  getValue
};
function normalize(token) {
  return (token + "").trim();
}
function applyList(list, element) {
  element.setAttribute("class", list.join(" "));
}
function _add(list, element, tokens) {
  if (tokens.filter(function(token) {
    if (!(token = normalize(token)) || list.indexOf(token) !== -1) {
      return false;
    }
    list.push(token);
    return true;
  }).length) {
    applyList(list, element);
  }
}
function _remove(list, element, tokens) {
  if (tokens.filter(function(token) {
    var i;
    if (!(token = normalize(token)) || (i = list.indexOf(token)) === -1) {
      return false;
    }
    list.splice(i, 1);
    return true;
  }).length) {
    applyList(list, element);
  }
}
function _toggle(list, element, token, force) {
  var i = list.indexOf(token = normalize(token));
  if (i !== -1) {
    if (force) {
      return true;
    }
    list.splice(i, 1);
    applyList(list, element);
    return false;
  }
  if (force === false) {
    return false;
  }
  list.push(token);
  applyList(list, element);
  return true;
}
function _replace(list, element, token, newToken) {
  var i;
  if (!(token = normalize(token)) || !(newToken = normalize(newToken)) || token === newToken || (i = list.indexOf(token)) === -1) {
    return;
  }
  list.splice(i, 1);
  if (list.indexOf(newToken) === -1) {
    list.push(newToken);
  }
  applyList(list, element);
}
function mClassList(element) {
  return !mClassList.ignoreNative && element.classList || function() {
    var list = (element.getAttribute("class") || "").trim().split(/\s+/).filter(function(token) {
      return !!token;
    }), ins = {
      length: list.length,
      item: function item(i) {
        return list[i];
      },
      contains: function contains(token) {
        return list.indexOf(normalize(token)) !== -1;
      },
      add: function add2() {
        _add(list, element, Array.prototype.slice.call(arguments));
        return mClassList.methodChain ? ins : void 0;
      },
      remove: function remove2() {
        _remove(list, element, Array.prototype.slice.call(arguments));
        return mClassList.methodChain ? ins : void 0;
      },
      toggle: function toggle(token, force) {
        return _toggle(list, element, token, force);
      },
      replace: function replace(token, newToken) {
        _replace(list, element, token, newToken);
        return mClassList.methodChain ? ins : void 0;
      }
    };
    return ins;
  }();
}
mClassList.methodChain = true;
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1(Constructor, staticProps);
  return Constructor;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
mClassList.ignoreNative = true;
var ZINDEX = 9e3, SNAP_GRAVITY = 20, SNAP_CORNER = "tl", SNAP_SIDE = "both", SNAP_EDGE = "both", SNAP_BASE = "containment", SNAP_ALL_CORNERS = ["tl", "tr", "bl", "br"], SNAP_ALL_SIDES = ["start", "end"], SNAP_ALL_EDGES = ["inside", "outside"], AUTOSCROLL_SPEED = [40, 200, 1e3], AUTOSCROLL_SENSITIVITY = [100, 40, 0], IS_EDGE = "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style && !window.navigator.msPointerEnabled, IS_TRIDENT = !IS_EDGE && !!document.uniqueID, IS_GECKO = "MozAppearance" in document.documentElement.style, IS_BLINK = !IS_EDGE && !IS_GECKO && !!window.chrome && !!window.CSS, IS_WEBKIT = !IS_EDGE && !IS_TRIDENT && !IS_GECKO && !IS_BLINK && !window.chrome && "WebkitAppearance" in document.documentElement.style, isObject = function() {
  var toString = {}.toString, fnToString = {}.hasOwnProperty.toString, objFnString = fnToString.call(Object);
  return function(obj) {
    var proto, constr;
    return obj && toString.call(obj) === "[object Object]" && (!(proto = Object.getPrototypeOf(obj)) || (constr = proto.hasOwnProperty("constructor") && proto.constructor) && typeof constr === "function" && fnToString.call(constr) === objFnString);
  };
}(), isFinite = Number.isFinite || function(value) {
  return typeof value === "number" && window.isFinite(value);
}, insProps = {}, pointerOffset = {}, pointerEvent = new PointerEvent();
var insId = 0, activeProps, hasMoved, body, cssValueDraggableCursor, cssValueDraggingCursor, cssOrgValueBodyCursor, cssPropTransitionProperty, cssPropTransform, cssPropUserSelect, cssOrgValueBodyUserSelect, cssWantedValueDraggableCursor = IS_WEBKIT ? ["all-scroll", "move"] : ["grab", "all-scroll", "move"], cssWantedValueDraggingCursor = IS_WEBKIT ? "move" : ["grabbing", "move"], draggableClass = "plain-draggable", draggingClass = "plain-draggable-dragging", movingClass = "plain-draggable-moving";
var scrollFrame = {}, MSPF$1 = 1e3 / 60, requestAnim$1 = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
  return setTimeout(callback, MSPF$1);
}, cancelAnim$1 = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(requestID2) {
  return clearTimeout(requestID2);
};
{
  let frameUpdate = function() {
    var now = Date.now();
    ["x", "y"].forEach(function(xy) {
      var moveArgs = curXyMoveArgs[xy];
      if (moveArgs) {
        var timeLen = now - moveArgs.lastFrameTime, absValue = curScrollXY(curElement, xy), curValue = moveArgs.lastValue != null && Math.abs(moveArgs.lastValue - absValue) < 10 ? moveArgs.lastValue : absValue;
        if (moveArgs.dir === -1 ? curValue > moveArgs.min : curValue < moveArgs.max) {
          var newValue = curValue + moveArgs.speed * timeLen * moveArgs.dir;
          if (newValue < moveArgs.min) {
            newValue = moveArgs.min;
          } else if (newValue > moveArgs.max) {
            newValue = moveArgs.max;
          }
          curScrollXY(curElement, xy, newValue);
          moveArgs.lastValue = newValue;
        }
        moveArgs.lastFrameTime = now;
      }
    });
  }, frame = function() {
    cancelAnim$1.call(window, requestID$1);
    frameUpdate();
    requestID$1 = requestAnim$1.call(window, frame);
  };
  var curXyMoveArgs = {}, curElement, curScrollXY, requestID$1;
  scrollFrame.move = function(element, xyMoveArgs, scrollXY) {
    cancelAnim$1.call(window, requestID$1);
    frameUpdate();
    if (curElement === element) {
      if (xyMoveArgs.x && curXyMoveArgs.x) {
        xyMoveArgs.x.lastValue = curXyMoveArgs.x.lastValue;
      }
      if (xyMoveArgs.y && curXyMoveArgs.y) {
        xyMoveArgs.y.lastValue = curXyMoveArgs.y.lastValue;
      }
    }
    curElement = element;
    curXyMoveArgs = xyMoveArgs;
    curScrollXY = scrollXY;
    var now = Date.now();
    ["x", "y"].forEach(function(xy) {
      var moveArgs = curXyMoveArgs[xy];
      if (moveArgs) {
        moveArgs.lastFrameTime = now;
      }
    });
    requestID$1 = requestAnim$1.call(window, frame);
  };
  scrollFrame.stop = function() {
    cancelAnim$1.call(window, requestID$1);
    frameUpdate();
    curXyMoveArgs = {};
    curElement = null;
  };
}
function scrollXYWindow(element, xy, value) {
  if (value != null) {
    if (xy === "x") {
      element.scrollTo(value, element.pageYOffset);
    } else {
      element.scrollTo(element.pageXOffset, value);
    }
  }
  return xy === "x" ? element.pageXOffset : element.pageYOffset;
}
function scrollXYElement(element, xy, value) {
  var prop = xy === "x" ? "scrollLeft" : "scrollTop";
  if (value != null) {
    element[prop] = value;
  }
  return element[prop];
}
function getScrollable(element, isWindow, dontScroll) {
  var scrollable = {};
  var cmpStyleHtml, cmpStyleBody, cmpStyleElement;
  (function(target) {
    scrollable.clientWidth = target.clientWidth;
    scrollable.clientHeight = target.clientHeight;
  })(isWindow ? document.documentElement : element);
  var maxScrollLeft = 0, maxScrollTop = 0;
  if (!dontScroll) {
    var curScrollLeft, curScrollTop;
    if (isWindow) {
      curScrollLeft = scrollXYWindow(element, "x");
      curScrollTop = scrollXYWindow(element, "y");
      cmpStyleHtml = getComputedStyle(document.documentElement, "");
      cmpStyleBody = getComputedStyle(document.body, "");
      maxScrollLeft = scrollXYWindow(element, "x", document.documentElement.scrollWidth + scrollable.clientWidth + ["marginLeft", "marginRight", "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"].reduce(function(len, prop) {
        return len + (parseFloat(cmpStyleHtml[prop]) || 0) + (parseFloat(cmpStyleBody[prop]) || 0);
      }, 0));
      maxScrollTop = scrollXYWindow(element, "y", document.documentElement.scrollHeight + scrollable.clientHeight + ["marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"].reduce(function(len, prop) {
        return len + (parseFloat(cmpStyleHtml[prop]) || 0) + (parseFloat(cmpStyleBody[prop]) || 0);
      }, 0));
      scrollXYWindow(element, "x", curScrollLeft);
      scrollXYWindow(element, "y", curScrollTop);
    } else {
      curScrollLeft = scrollXYElement(element, "x");
      curScrollTop = scrollXYElement(element, "y");
      cmpStyleElement = getComputedStyle(element, "");
      maxScrollLeft = scrollXYElement(element, "x", element.scrollWidth + scrollable.clientWidth + ["marginLeft", "marginRight", "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"].reduce(function(len, prop) {
        return len + (parseFloat(cmpStyleElement[prop]) || 0);
      }, 0));
      maxScrollTop = scrollXYElement(element, "y", element.scrollHeight + scrollable.clientHeight + ["marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"].reduce(function(len, prop) {
        return len + (parseFloat(cmpStyleElement[prop]) || 0);
      }, 0));
      scrollXYElement(element, "x", curScrollLeft);
      scrollXYElement(element, "y", curScrollTop);
    }
  }
  scrollable.scrollWidth = scrollable.clientWidth + maxScrollLeft;
  scrollable.scrollHeight = scrollable.clientHeight + maxScrollTop;
  var rect;
  if (isWindow) {
    scrollable.clientX = scrollable.clientY = 0;
  } else {
    rect = element.getBoundingClientRect();
    if (!cmpStyleElement) {
      cmpStyleElement = getComputedStyle(element, "");
    }
    scrollable.clientX = rect.left + (parseFloat(cmpStyleElement.borderLeftWidth) || 0);
    scrollable.clientY = rect.top + (parseFloat(cmpStyleElement.borderTopWidth) || 0);
  }
  return scrollable;
}
function copyTree(obj) {
  return !obj ? obj : isObject(obj) ? Object.keys(obj).reduce(function(copyObj, key) {
    copyObj[key] = copyTree(obj[key]);
    return copyObj;
  }, {}) : Array.isArray(obj) ? obj.map(copyTree) : obj;
}
function hasChanged(a, b) {
  var typeA, keysA;
  return _typeof(a) !== _typeof(b) || (typeA = isObject(a) ? "obj" : Array.isArray(a) ? "array" : "") !== (isObject(b) ? "obj" : Array.isArray(b) ? "array" : "") || (typeA === "obj" ? hasChanged(keysA = Object.keys(a).sort(), Object.keys(b).sort()) || keysA.some(function(prop) {
    return hasChanged(a[prop], b[prop]);
  }) : typeA === "array" ? a.length !== b.length || a.some(function(aVal, i) {
    return hasChanged(aVal, b[i]);
  }) : a !== b);
}
function isElement(element) {
  return !!(element && element.nodeType === Node.ELEMENT_NODE && typeof element.getBoundingClientRect === "function" && !(element.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED));
}
function validBBox(bBox) {
  if (!isObject(bBox)) {
    return null;
  }
  var value;
  if (isFinite(value = bBox.left) || isFinite(value = bBox.x)) {
    bBox.left = bBox.x = value;
  } else {
    return null;
  }
  if (isFinite(value = bBox.top) || isFinite(value = bBox.y)) {
    bBox.top = bBox.y = value;
  } else {
    return null;
  }
  if (isFinite(bBox.width) && bBox.width >= 0) {
    bBox.right = bBox.left + bBox.width;
  } else if (isFinite(bBox.right) && bBox.right >= bBox.left) {
    bBox.width = bBox.right - bBox.left;
  } else {
    return null;
  }
  if (isFinite(bBox.height) && bBox.height >= 0) {
    bBox.bottom = bBox.top + bBox.height;
  } else if (isFinite(bBox.bottom) && bBox.bottom >= bBox.top) {
    bBox.height = bBox.bottom - bBox.top;
  } else {
    return null;
  }
  return bBox;
}
function validPPValue(value) {
  function string2PPValue(inString) {
    var matches = /^(.+?)(%)?$/.exec(inString);
    var value2, isRatio;
    return matches && isFinite(value2 = parseFloat(matches[1])) ? {
      value: (isRatio = !!(matches[2] && value2)) ? value2 / 100 : value2,
      isRatio
    } : null;
  }
  return isFinite(value) ? {
    value,
    isRatio: false
  } : typeof value === "string" ? string2PPValue(value.replace(/\s/g, "")) : null;
}
function ppValue2OptionValue(ppValue) {
  return ppValue.isRatio ? "".concat(ppValue.value * 100, "%") : ppValue.value;
}
function resolvePPValue(ppValue, baseOrigin, baseSize) {
  return typeof ppValue === "number" ? ppValue : baseOrigin + ppValue.value * (ppValue.isRatio ? baseSize : 1);
}
function validPPBBox(bBox) {
  if (!isObject(bBox)) {
    return null;
  }
  var ppValue;
  if ((ppValue = validPPValue(bBox.left)) || (ppValue = validPPValue(bBox.x))) {
    bBox.left = bBox.x = ppValue;
  } else {
    return null;
  }
  if ((ppValue = validPPValue(bBox.top)) || (ppValue = validPPValue(bBox.y))) {
    bBox.top = bBox.y = ppValue;
  } else {
    return null;
  }
  if ((ppValue = validPPValue(bBox.width)) && ppValue.value >= 0) {
    bBox.width = ppValue;
    delete bBox.right;
  } else if (ppValue = validPPValue(bBox.right)) {
    bBox.right = ppValue;
    delete bBox.width;
  } else {
    return null;
  }
  if ((ppValue = validPPValue(bBox.height)) && ppValue.value >= 0) {
    bBox.height = ppValue;
    delete bBox.bottom;
  } else if (ppValue = validPPValue(bBox.bottom)) {
    bBox.bottom = ppValue;
    delete bBox.height;
  } else {
    return null;
  }
  return bBox;
}
function ppBBox2OptionObject(ppBBox) {
  return Object.keys(ppBBox).reduce(function(obj, prop) {
    obj[prop] = ppValue2OptionValue(ppBBox[prop]);
    return obj;
  }, {});
}
function resolvePPBBox(ppBBox, baseBBox) {
  var prop2Axis = {
    left: "x",
    right: "x",
    x: "x",
    width: "x",
    top: "y",
    bottom: "y",
    y: "y",
    height: "y"
  }, baseOriginXY = {
    x: baseBBox.left,
    y: baseBBox.top
  }, baseSizeXY = {
    x: baseBBox.width,
    y: baseBBox.height
  };
  return validBBox(Object.keys(ppBBox).reduce(function(bBox, prop) {
    bBox[prop] = resolvePPValue(ppBBox[prop], prop === "width" || prop === "height" ? 0 : baseOriginXY[prop2Axis[prop]], baseSizeXY[prop2Axis[prop]]);
    return bBox;
  }, {}));
}
function getBBox(element, getPaddingBox) {
  var rect = element.getBoundingClientRect(), bBox = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
  bBox.left += window.pageXOffset;
  bBox.top += window.pageYOffset;
  if (getPaddingBox) {
    var style = window.getComputedStyle(element, ""), borderTop = parseFloat(style.borderTopWidth) || 0, borderRight = parseFloat(style.borderRightWidth) || 0, borderBottom = parseFloat(style.borderBottomWidth) || 0, borderLeft = parseFloat(style.borderLeftWidth) || 0;
    bBox.left += borderLeft;
    bBox.top += borderTop;
    bBox.width -= borderLeft + borderRight;
    bBox.height -= borderTop + borderBottom;
  }
  return validBBox(bBox);
}
function initAnim(element, gpuTrigger) {
  var style = element.style;
  style.webkitTapHighlightColor = "transparent";
  var cssPropBoxShadow = CSSPrefix.getName("boxShadow"), boxShadow = window.getComputedStyle(element, "")[cssPropBoxShadow];
  if (!boxShadow || boxShadow === "none") {
    style[cssPropBoxShadow] = "0 0 1px transparent";
  }
  if (gpuTrigger && cssPropTransform) {
    style[cssPropTransform] = "translateZ(0)";
  }
  return element;
}
function setDraggableCursor(element, orgCursor) {
  if (cssValueDraggableCursor == null) {
    if (cssWantedValueDraggableCursor !== false) {
      cssValueDraggableCursor = CSSPrefix.getValue("cursor", cssWantedValueDraggableCursor);
    }
    if (cssValueDraggableCursor == null) {
      cssValueDraggableCursor = false;
    }
  }
  element.style.cursor = cssValueDraggableCursor === false ? orgCursor : cssValueDraggableCursor;
}
function setDraggingCursor(element) {
  if (cssValueDraggingCursor == null) {
    if (cssWantedValueDraggingCursor !== false) {
      cssValueDraggingCursor = CSSPrefix.getValue("cursor", cssWantedValueDraggingCursor);
    }
    if (cssValueDraggingCursor == null) {
      cssValueDraggingCursor = false;
    }
  }
  if (cssValueDraggingCursor !== false) {
    element.style.cursor = cssValueDraggingCursor;
  }
}
function viewPoint2SvgPoint(props, clientX, clientY) {
  var svgPoint = props.svgPoint;
  svgPoint.x = clientX;
  svgPoint.y = clientY;
  return svgPoint.matrixTransform(props.svgCtmElement.getScreenCTM().inverse());
}
function moveTranslate(props, position) {
  var elementBBox = props.elementBBox;
  if (position.left !== elementBBox.left || position.top !== elementBBox.top) {
    var offset = props.htmlOffset;
    props.elementStyle[cssPropTransform] = "translate(".concat(position.left + offset.left, "px, ").concat(position.top + offset.top, "px)");
    return true;
  }
  return false;
}
function moveLeftTop(props, position) {
  var elementBBox = props.elementBBox, elementStyle = props.elementStyle, offset = props.htmlOffset;
  var moved = false;
  if (position.left !== elementBBox.left) {
    elementStyle.left = position.left + offset.left + "px";
    moved = true;
  }
  if (position.top !== elementBBox.top) {
    elementStyle.top = position.top + offset.top + "px";
    moved = true;
  }
  return moved;
}
function moveSvg(props, position) {
  var elementBBox = props.elementBBox;
  if (position.left !== elementBBox.left || position.top !== elementBBox.top) {
    var offset = props.svgOffset, originBBox = props.svgOriginBBox, point = viewPoint2SvgPoint(props, position.left - window.pageXOffset, position.top - window.pageYOffset);
    props.svgTransform.setTranslate(point.x + offset.x - originBBox.x, point.y + offset.y - originBBox.y);
    return true;
  }
  return false;
}
function move(props, position, cbCheck) {
  var elementBBox = props.elementBBox;
  function fix() {
    if (props.minLeft >= props.maxLeft) {
      position.left = elementBBox.left;
    } else if (position.left < props.minLeft) {
      position.left = props.minLeft;
    } else if (position.left > props.maxLeft) {
      position.left = props.maxLeft;
    }
    if (props.minTop >= props.maxTop) {
      position.top = elementBBox.top;
    } else if (position.top < props.minTop) {
      position.top = props.minTop;
    } else if (position.top > props.maxTop) {
      position.top = props.maxTop;
    }
  }
  fix();
  if (cbCheck) {
    if (cbCheck(position) === false) {
      return false;
    }
    fix();
  }
  var moved = props.moveElm(props, position);
  if (moved) {
    props.elementBBox = validBBox({
      left: position.left,
      top: position.top,
      width: elementBBox.width,
      height: elementBBox.height
    });
  }
  return moved;
}
function initTranslate(props) {
  var element = props.element, elementStyle = props.elementStyle, curPosition = getBBox(element), RESTORE_PROPS = ["display", "marginTop", "marginBottom", "width", "height"];
  RESTORE_PROPS.unshift(cssPropTransform);
  var orgTransitionProperty = elementStyle[cssPropTransitionProperty];
  elementStyle[cssPropTransitionProperty] = "none";
  var fixPosition = getBBox(element);
  if (!props.orgStyle) {
    props.orgStyle = RESTORE_PROPS.reduce(function(orgStyle, prop) {
      orgStyle[prop] = elementStyle[prop] || "";
      return orgStyle;
    }, {});
    props.lastStyle = {};
  } else {
    RESTORE_PROPS.forEach(function(prop) {
      if (props.lastStyle[prop] == null || elementStyle[prop] === props.lastStyle[prop]) {
        elementStyle[prop] = props.orgStyle[prop];
      }
    });
  }
  var orgSize = getBBox(element), cmpStyle = window.getComputedStyle(element, "");
  if (cmpStyle.display === "inline") {
    elementStyle.display = "inline-block";
    ["Top", "Bottom"].forEach(function(dirProp) {
      var padding = parseFloat(cmpStyle["padding".concat(dirProp)]);
      elementStyle["margin".concat(dirProp)] = padding ? "-".concat(padding, "px") : "0";
    });
  }
  elementStyle[cssPropTransform] = "translate(0, 0)";
  var newBBox = getBBox(element);
  var offset = props.htmlOffset = {
    left: newBBox.left ? -newBBox.left : 0,
    top: newBBox.top ? -newBBox.top : 0
  };
  elementStyle[cssPropTransform] = "translate(".concat(curPosition.left + offset.left, "px, ").concat(curPosition.top + offset.top, "px)");
  ["width", "height"].forEach(function(prop) {
    if (newBBox[prop] !== orgSize[prop]) {
      elementStyle[prop] = orgSize[prop] + "px";
      newBBox = getBBox(element);
      if (newBBox[prop] !== orgSize[prop]) {
        elementStyle[prop] = orgSize[prop] - (newBBox[prop] - orgSize[prop]) + "px";
      }
    }
    props.lastStyle[prop] = elementStyle[prop];
  });
  element.offsetWidth;
  elementStyle[cssPropTransitionProperty] = orgTransitionProperty;
  if (fixPosition.left !== curPosition.left || fixPosition.top !== curPosition.top) {
    elementStyle[cssPropTransform] = "translate(".concat(fixPosition.left + offset.left, "px, ").concat(fixPosition.top + offset.top, "px)");
  }
  return fixPosition;
}
function initLeftTop(props) {
  var element = props.element, elementStyle = props.elementStyle, curPosition = getBBox(element), RESTORE_PROPS = ["position", "marginTop", "marginRight", "marginBottom", "marginLeft", "width", "height"];
  var orgTransitionProperty = elementStyle[cssPropTransitionProperty];
  elementStyle[cssPropTransitionProperty] = "none";
  var fixPosition = getBBox(element);
  if (!props.orgStyle) {
    props.orgStyle = RESTORE_PROPS.reduce(function(orgStyle, prop) {
      orgStyle[prop] = elementStyle[prop] || "";
      return orgStyle;
    }, {});
    props.lastStyle = {};
  } else {
    RESTORE_PROPS.forEach(function(prop) {
      if (props.lastStyle[prop] == null || elementStyle[prop] === props.lastStyle[prop]) {
        elementStyle[prop] = props.orgStyle[prop];
      }
    });
  }
  var orgSize = getBBox(element);
  elementStyle.position = "absolute";
  elementStyle.left = elementStyle.top = elementStyle.margin = "0";
  var newBBox = getBBox(element);
  var offset = props.htmlOffset = {
    left: newBBox.left ? -newBBox.left : 0,
    top: newBBox.top ? -newBBox.top : 0
  };
  elementStyle.left = curPosition.left + offset.left + "px";
  elementStyle.top = curPosition.top + offset.top + "px";
  ["width", "height"].forEach(function(prop) {
    if (newBBox[prop] !== orgSize[prop]) {
      elementStyle[prop] = orgSize[prop] + "px";
      newBBox = getBBox(element);
      if (newBBox[prop] !== orgSize[prop]) {
        elementStyle[prop] = orgSize[prop] - (newBBox[prop] - orgSize[prop]) + "px";
      }
    }
    props.lastStyle[prop] = elementStyle[prop];
  });
  element.offsetWidth;
  elementStyle[cssPropTransitionProperty] = orgTransitionProperty;
  if (fixPosition.left !== curPosition.left || fixPosition.top !== curPosition.top) {
    elementStyle.left = fixPosition.left + offset.left + "px";
    elementStyle.top = fixPosition.top + offset.top + "px";
  }
  return fixPosition;
}
function initSvg(props) {
  var element = props.element, svgTransform = props.svgTransform, curRect = element.getBoundingClientRect(), fixPosition = getBBox(element);
  svgTransform.setTranslate(0, 0);
  var originBBox = props.svgOriginBBox = element.getBBox(), newRect = element.getBoundingClientRect(), originPoint = viewPoint2SvgPoint(props, newRect.left, newRect.top), offset = props.svgOffset = {
    x: originBBox.x - originPoint.x,
    y: originBBox.y - originPoint.y
  }, curPoint = viewPoint2SvgPoint(props, curRect.left, curRect.top);
  svgTransform.setTranslate(curPoint.x + offset.x - originBBox.x, curPoint.y + offset.y - originBBox.y);
  return fixPosition;
}
function initBBox(props, eventType) {
  var docBBox = getBBox(document.documentElement), elementBBox = props.elementBBox = props.initElm(props), containmentBBox = props.containmentBBox = props.containmentIsBBox ? resolvePPBBox(props.options.containment, docBBox) || docBBox : getBBox(props.options.containment, true);
  props.minLeft = containmentBBox.left;
  props.maxLeft = containmentBBox.right - elementBBox.width;
  props.minTop = containmentBBox.top;
  props.maxTop = containmentBBox.bottom - elementBBox.height;
  move(props, {
    left: elementBBox.left,
    top: elementBBox.top
  });
  if (props.parsedSnapTargets) {
    var elementSizeXY = {
      x: elementBBox.width,
      y: elementBBox.height
    }, minXY = {
      x: props.minLeft,
      y: props.minTop
    }, maxXY = {
      x: props.maxLeft,
      y: props.maxTop
    }, prop2Axis = {
      left: "x",
      right: "x",
      x: "x",
      width: "x",
      xStart: "x",
      xEnd: "x",
      xStep: "x",
      top: "y",
      bottom: "y",
      y: "y",
      height: "y",
      yStart: "y",
      yEnd: "y",
      yStep: "y"
    }, snapTargets = props.parsedSnapTargets.reduce(function(snapTargets2, parsedSnapTarget) {
      var baseRect = parsedSnapTarget.base === "containment" ? containmentBBox : docBBox, baseOriginXY = {
        x: baseRect.left,
        y: baseRect.top
      }, baseSizeXY = {
        x: baseRect.width,
        y: baseRect.height
      };
      function addSnapTarget(targetXY) {
        if (targetXY.center == null) {
          targetXY.center = parsedSnapTarget.center;
        }
        if (targetXY.xGravity == null) {
          targetXY.xGravity = parsedSnapTarget.gravity;
        }
        if (targetXY.yGravity == null) {
          targetXY.yGravity = parsedSnapTarget.gravity;
        }
        if (targetXY.x != null && targetXY.y != null) {
          targetXY.x = resolvePPValue(targetXY.x, baseOriginXY.x, baseSizeXY.x);
          targetXY.y = resolvePPValue(targetXY.y, baseOriginXY.y, baseSizeXY.y);
          if (targetXY.center) {
            targetXY.x -= elementSizeXY.x / 2;
            targetXY.y -= elementSizeXY.y / 2;
            targetXY.corners = ["tl"];
          }
          (targetXY.corners || parsedSnapTarget.corners).forEach(function(corner) {
            var x = targetXY.x - (corner === "tr" || corner === "br" ? elementSizeXY.x : 0), y = targetXY.y - (corner === "bl" || corner === "br" ? elementSizeXY.y : 0);
            if (x >= minXY.x && x <= maxXY.x && y >= minXY.y && y <= maxXY.y) {
              var snapTarget = {
                x,
                y
              }, gravityXStart = x - targetXY.xGravity, gravityXEnd = x + targetXY.xGravity, gravityYStart = y - targetXY.yGravity, gravityYEnd = y + targetXY.yGravity;
              if (gravityXStart > minXY.x) {
                snapTarget.gravityXStart = gravityXStart;
              }
              if (gravityXEnd < maxXY.x) {
                snapTarget.gravityXEnd = gravityXEnd;
              }
              if (gravityYStart > minXY.y) {
                snapTarget.gravityYStart = gravityYStart;
              }
              if (gravityYEnd < maxXY.y) {
                snapTarget.gravityYEnd = gravityYEnd;
              }
              snapTargets2.push(snapTarget);
            }
          });
        } else {
          var specAxis = targetXY.x != null ? "x" : "y", rangeAxis = specAxis === "x" ? "y" : "x", startProp = "".concat(rangeAxis, "Start"), endProp = "".concat(rangeAxis, "End"), gravityProp = "".concat(specAxis, "Gravity"), specAxisL = specAxis.toUpperCase(), rangeAxisL = rangeAxis.toUpperCase(), gravitySpecStartProp = "gravity".concat(specAxisL, "Start"), gravitySpecEndProp = "gravity".concat(specAxisL, "End"), gravityRangeStartProp = "gravity".concat(rangeAxisL, "Start"), gravityRangeEndProp = "gravity".concat(rangeAxisL, "End");
          targetXY[specAxis] = resolvePPValue(targetXY[specAxis], baseOriginXY[specAxis], baseSizeXY[specAxis]);
          targetXY[startProp] = resolvePPValue(targetXY[startProp], baseOriginXY[rangeAxis], baseSizeXY[rangeAxis]);
          targetXY[endProp] = resolvePPValue(targetXY[endProp], baseOriginXY[rangeAxis], baseSizeXY[rangeAxis]) - elementSizeXY[rangeAxis];
          if (targetXY[startProp] > targetXY[endProp] || targetXY[startProp] > maxXY[rangeAxis] || targetXY[endProp] < minXY[rangeAxis]) {
            return;
          }
          if (targetXY.center) {
            targetXY[specAxis] -= elementSizeXY[specAxis] / 2;
            targetXY.sides = ["start"];
          }
          (targetXY.sides || parsedSnapTarget.sides).forEach(function(side) {
            var xy = targetXY[specAxis] - (side === "end" ? elementSizeXY[specAxis] : 0);
            if (xy >= minXY[specAxis] && xy <= maxXY[specAxis]) {
              var snapTarget = {}, gravitySpecStart = xy - targetXY[gravityProp], gravitySpecEnd = xy + targetXY[gravityProp];
              snapTarget[specAxis] = xy;
              if (gravitySpecStart > minXY[specAxis]) {
                snapTarget[gravitySpecStartProp] = gravitySpecStart;
              }
              if (gravitySpecEnd < maxXY[specAxis]) {
                snapTarget[gravitySpecEndProp] = gravitySpecEnd;
              }
              if (targetXY[startProp] > minXY[rangeAxis]) {
                snapTarget[gravityRangeStartProp] = targetXY[startProp];
              }
              if (targetXY[endProp] < maxXY[rangeAxis]) {
                snapTarget[gravityRangeEndProp] = targetXY[endProp];
              }
              snapTargets2.push(snapTarget);
            }
          });
        }
      }
      var bBox;
      if ((bBox = parsedSnapTarget.element ? getBBox(parsedSnapTarget.element) : null) || parsedSnapTarget.ppBBox) {
        if (parsedSnapTarget.ppBBox) {
          bBox = resolvePPBBox(parsedSnapTarget.ppBBox, baseRect);
        }
        if (bBox) {
          parsedSnapTarget.edges.forEach(function(edge) {
            var lengthenX = parsedSnapTarget.gravity, lengthenY = parsedSnapTarget.gravity;
            if (edge === "outside") {
              lengthenX += elementBBox.width;
              lengthenY += elementBBox.height;
            }
            var xStart = bBox.left - lengthenX, xEnd = bBox.right + lengthenX, yStart = bBox.top - lengthenY, yEnd = bBox.bottom + lengthenY;
            var side = edge === "inside" ? "start" : "end";
            addSnapTarget({
              xStart,
              xEnd,
              y: bBox.top,
              sides: [side],
              center: false
            });
            addSnapTarget({
              x: bBox.left,
              yStart,
              yEnd,
              sides: [side],
              center: false
            });
            side = edge === "inside" ? "end" : "start";
            addSnapTarget({
              xStart,
              xEnd,
              y: bBox.bottom,
              sides: [side],
              center: false
            });
            addSnapTarget({
              x: bBox.right,
              yStart,
              yEnd,
              sides: [side],
              center: false
            });
          });
        }
      } else {
        var expanded = [["x", "y", "xStart", "xEnd", "xStep", "yStart", "yEnd", "yStep"].reduce(function(targetXY, prop) {
          if (parsedSnapTarget[prop]) {
            targetXY[prop] = resolvePPValue(parsedSnapTarget[prop], prop === "xStep" || prop === "yStep" ? 0 : baseOriginXY[prop2Axis[prop]], baseSizeXY[prop2Axis[prop]]);
          }
          return targetXY;
        }, {})];
        ["x", "y"].forEach(function(axis) {
          var startProp = "".concat(axis, "Start"), endProp = "".concat(axis, "End"), stepProp = "".concat(axis, "Step"), gravityProp = "".concat(axis, "Gravity");
          expanded = expanded.reduce(function(expanded2, targetXY) {
            var start = targetXY[startProp], end = targetXY[endProp], step2 = targetXY[stepProp];
            if (start != null && end != null && start >= end) {
              return expanded2;
            }
            if (step2 != null) {
              if (step2 < 2) {
                return expanded2;
              }
              var gravity = step2 / 2;
              gravity = parsedSnapTarget.gravity > gravity ? gravity : null;
              for (var curValue = start; curValue <= end; curValue += step2) {
                var expandedXY = Object.keys(targetXY).reduce(function(expandedXY2, prop) {
                  if (prop !== startProp && prop !== endProp && prop !== stepProp) {
                    expandedXY2[prop] = targetXY[prop];
                  }
                  return expandedXY2;
                }, {});
                expandedXY[axis] = curValue;
                expandedXY[gravityProp] = gravity;
                expanded2.push(expandedXY);
              }
            } else {
              expanded2.push(targetXY);
            }
            return expanded2;
          }, []);
        });
        expanded.forEach(function(targetXY) {
          addSnapTarget(targetXY);
        });
      }
      return snapTargets2;
    }, []);
    props.snapTargets = snapTargets.length ? snapTargets : null;
  }
  var autoScroll = {}, autoScrollOptions = props.options.autoScroll;
  if (autoScrollOptions) {
    autoScroll.isWindow = autoScrollOptions.target === window;
    autoScroll.target = autoScrollOptions.target;
    var dontScroll = eventType === "scroll", scrollable = getScrollable(autoScrollOptions.target, autoScroll.isWindow, dontScroll), scrollableBBox = validBBox({
      left: scrollable.clientX,
      top: scrollable.clientY,
      width: scrollable.clientWidth,
      height: scrollable.clientHeight
    });
    if (!dontScroll) {
      autoScroll.scrollWidth = scrollable.scrollWidth;
      autoScroll.scrollHeight = scrollable.scrollHeight;
    } else if (props.autoScroll) {
      autoScroll.scrollWidth = props.autoScroll.scrollWidth;
      autoScroll.scrollHeight = props.autoScroll.scrollHeight;
    }
    [["X", "Width", "left", "right"], ["Y", "Height", "top", "bottom"]].forEach(function(axis) {
      var xy = axis[0], wh = axis[1], back = axis[2], forward = axis[3], maxAbs = (autoScroll["scroll".concat(wh)] || 0) - scrollable["client".concat(wh)], min = autoScrollOptions["min".concat(xy)] || 0;
      var max = isFinite(autoScrollOptions["max".concat(xy)]) ? autoScrollOptions["max".concat(xy)] : maxAbs;
      if (min < max && min < maxAbs) {
        if (max > maxAbs) {
          max = maxAbs;
        }
        var lines = [], elementSize = elementBBox[wh.toLowerCase()];
        for (var i = autoScrollOptions.sensitivity.length - 1; i >= 0; i--) {
          var sensitivity = autoScrollOptions.sensitivity[i], speed = autoScrollOptions.speed[i];
          lines.push({
            dir: -1,
            speed,
            position: scrollableBBox[back] + sensitivity
          });
          lines.push({
            dir: 1,
            speed,
            position: scrollableBBox[forward] - sensitivity - elementSize
          });
        }
        autoScroll[xy.toLowerCase()] = {
          min,
          max,
          lines
        };
      }
    });
  }
  props.autoScroll = autoScroll.x || autoScroll.y ? autoScroll : null;
}
function dragEnd(props) {
  scrollFrame.stop();
  setDraggableCursor(props.options.handle, props.orgCursor);
  body.style.cursor = cssOrgValueBodyCursor;
  if (props.options.zIndex !== false) {
    props.elementStyle.zIndex = props.orgZIndex;
  }
  if (cssPropUserSelect) {
    body.style[cssPropUserSelect] = cssOrgValueBodyUserSelect;
  }
  var classList = mClassList(props.element);
  if (movingClass) {
    classList.remove(movingClass);
  }
  if (draggingClass) {
    classList.remove(draggingClass);
  }
  activeProps = null;
  pointerEvent.cancel();
  if (props.onDragEnd) {
    props.onDragEnd({
      left: props.elementBBox.left,
      top: props.elementBBox.top
    });
  }
}
function dragStart(props, pointerXY) {
  if (props.disabled) {
    return false;
  }
  if (props.onDragStart && props.onDragStart(pointerXY) === false) {
    return false;
  }
  if (activeProps) {
    dragEnd(activeProps);
  }
  setDraggingCursor(props.options.handle);
  body.style.cursor = cssValueDraggingCursor || window.getComputedStyle(props.options.handle, "").cursor;
  if (props.options.zIndex !== false) {
    props.elementStyle.zIndex = props.options.zIndex;
  }
  if (cssPropUserSelect) {
    body.style[cssPropUserSelect] = "none";
  }
  if (draggingClass) {
    mClassList(props.element).add(draggingClass);
  }
  activeProps = props;
  hasMoved = false;
  pointerOffset.left = props.elementBBox.left - (pointerXY.clientX + window.pageXOffset);
  pointerOffset.top = props.elementBBox.top - (pointerXY.clientY + window.pageYOffset);
  return true;
}
function _setOptions(props, newOptions) {
  var options = props.options;
  var needsInitBBox;
  if (newOptions.containment) {
    var bBox;
    if (isElement(newOptions.containment)) {
      if (newOptions.containment !== options.containment) {
        options.containment = newOptions.containment;
        props.containmentIsBBox = false;
        needsInitBBox = true;
      }
    } else if ((bBox = validPPBBox(copyTree(newOptions.containment))) && hasChanged(bBox, options.containment)) {
      options.containment = bBox;
      props.containmentIsBBox = true;
      needsInitBBox = true;
    }
  }
  function commonSnapOptions(options2, newOptions2) {
    function cleanString(inString) {
      return typeof inString === "string" ? inString.replace(/[, ]+/g, " ").trim().toLowerCase() : null;
    }
    if (isFinite(newOptions2.gravity) && newOptions2.gravity > 0) {
      options2.gravity = newOptions2.gravity;
    }
    var corner = cleanString(newOptions2.corner);
    if (corner) {
      if (corner !== "all") {
        var added = {}, corners = corner.split(/\s/).reduce(function(corners2, corner2) {
          corner2 = corner2.trim().replace(/^(.).*?-(.).*$/, "$1$2");
          if ((corner2 = corner2 === "tl" || corner2 === "lt" ? "tl" : corner2 === "tr" || corner2 === "rt" ? "tr" : corner2 === "bl" || corner2 === "lb" ? "bl" : corner2 === "br" || corner2 === "rb" ? "br" : null) && !added[corner2]) {
            corners2.push(corner2);
            added[corner2] = true;
          }
          return corners2;
        }, []), cornersLen = corners.length;
        corner = !cornersLen ? null : cornersLen === 4 ? "all" : corners.join(" ");
      }
      if (corner) {
        options2.corner = corner;
      }
    }
    var side = cleanString(newOptions2.side);
    if (side) {
      if (side === "start" || side === "end" || side === "both") {
        options2.side = side;
      } else if (side === "start end" || side === "end start") {
        options2.side = "both";
      }
    }
    if (typeof newOptions2.center === "boolean") {
      options2.center = newOptions2.center;
    }
    var edge = cleanString(newOptions2.edge);
    if (edge) {
      if (edge === "inside" || edge === "outside" || edge === "both") {
        options2.edge = edge;
      } else if (edge === "inside outside" || edge === "outside inside") {
        options2.edge = "both";
      }
    }
    var base = typeof newOptions2.base === "string" ? newOptions2.base.trim().toLowerCase() : null;
    if (base && (base === "containment" || base === "document")) {
      options2.base = base;
    }
    return options2;
  }
  if (newOptions.snap != null) {
    var newSnapOptions = isObject(newOptions.snap) && newOptions.snap.targets != null ? newOptions.snap : {
      targets: newOptions.snap
    }, snapTargetsOptions = [], snapOptions = commonSnapOptions({
      targets: snapTargetsOptions
    }, newSnapOptions);
    if (!snapOptions.gravity) {
      snapOptions.gravity = SNAP_GRAVITY;
    }
    if (!snapOptions.corner) {
      snapOptions.corner = SNAP_CORNER;
    }
    if (!snapOptions.side) {
      snapOptions.side = SNAP_SIDE;
    }
    if (typeof snapOptions.center !== "boolean") {
      snapOptions.center = false;
    }
    if (!snapOptions.edge) {
      snapOptions.edge = SNAP_EDGE;
    }
    if (!snapOptions.base) {
      snapOptions.base = SNAP_BASE;
    }
    var parsedSnapTargets = (Array.isArray(newSnapOptions.targets) ? newSnapOptions.targets : [newSnapOptions.targets]).reduce(function(parsedSnapTargets2, target) {
      if (target == null) {
        return parsedSnapTargets2;
      }
      var isElementPre = isElement(target), ppBBoxPre = validPPBBox(copyTree(target)), newSnapTargetOptions = isElementPre || ppBBoxPre ? {
        boundingBox: target
      } : isObject(target) && target.start == null && target.end == null && target.step == null ? target : {
        x: target,
        y: target
      }, expandedParsedSnapTargets = [], snapTargetOptions = {}, newOptionsBBox = newSnapTargetOptions.boundingBox;
      var ppBBox;
      if (isElementPre || isElement(newOptionsBBox)) {
        expandedParsedSnapTargets.push({
          element: newOptionsBBox
        });
        snapTargetOptions.boundingBox = newOptionsBBox;
      } else if (ppBBox = ppBBoxPre || validPPBBox(copyTree(newOptionsBBox))) {
        expandedParsedSnapTargets.push({
          ppBBox
        });
        snapTargetOptions.boundingBox = ppBBox2OptionObject(ppBBox);
      } else {
        var invalid;
        var parsedXY = ["x", "y"].reduce(function(parsedXY2, axis) {
          var newOptionsXY = newSnapTargetOptions[axis];
          var ppValue;
          if (ppValue = validPPValue(newOptionsXY)) {
            parsedXY2[axis] = ppValue;
            snapTargetOptions[axis] = ppValue2OptionValue(ppValue);
          } else {
            var start, end, step2;
            if (isObject(newOptionsXY)) {
              start = validPPValue(newOptionsXY.start);
              end = validPPValue(newOptionsXY.end);
              step2 = validPPValue(newOptionsXY.step);
              if (start && end && start.isRatio === end.isRatio && start.value >= end.value) {
                invalid = true;
              }
            }
            start = parsedXY2["".concat(axis, "Start")] = start || {
              value: 0,
              isRatio: false
            };
            end = parsedXY2["".concat(axis, "End")] = end || {
              value: 1,
              isRatio: true
            };
            snapTargetOptions[axis] = {
              start: ppValue2OptionValue(start),
              end: ppValue2OptionValue(end)
            };
            if (step2) {
              if (step2.isRatio ? step2.value > 0 : step2.value >= 2) {
                parsedXY2["".concat(axis, "Step")] = step2;
                snapTargetOptions[axis].step = ppValue2OptionValue(step2);
              } else {
                invalid = true;
              }
            }
          }
          return parsedXY2;
        }, {});
        if (invalid) {
          return parsedSnapTargets2;
        }
        if (parsedXY.xStart && !parsedXY.xStep && parsedXY.yStart && !parsedXY.yStep) {
          expandedParsedSnapTargets.push({
            xStart: parsedXY.xStart,
            xEnd: parsedXY.xEnd,
            y: parsedXY.yStart
          }, {
            xStart: parsedXY.xStart,
            xEnd: parsedXY.xEnd,
            y: parsedXY.yEnd
          }, {
            x: parsedXY.xStart,
            yStart: parsedXY.yStart,
            yEnd: parsedXY.yEnd
          }, {
            x: parsedXY.xEnd,
            yStart: parsedXY.yStart,
            yEnd: parsedXY.yEnd
          });
        } else {
          expandedParsedSnapTargets.push(parsedXY);
        }
      }
      if (expandedParsedSnapTargets.length) {
        snapTargetsOptions.push(commonSnapOptions(snapTargetOptions, newSnapTargetOptions));
        var corner = snapTargetOptions.corner || snapOptions.corner, side = snapTargetOptions.side || snapOptions.side, edge = snapTargetOptions.edge || snapOptions.edge, commonOptions = {
          gravity: snapTargetOptions.gravity || snapOptions.gravity,
          base: snapTargetOptions.base || snapOptions.base,
          center: typeof snapTargetOptions.center === "boolean" ? snapTargetOptions.center : snapOptions.center,
          corners: corner === "all" ? SNAP_ALL_CORNERS : corner.split(" "),
          sides: side === "both" ? SNAP_ALL_SIDES : [side],
          edges: edge === "both" ? SNAP_ALL_EDGES : [edge]
        };
        expandedParsedSnapTargets.forEach(function(parsedSnapTarget) {
          ["gravity", "corners", "sides", "center", "edges", "base"].forEach(function(option) {
            parsedSnapTarget[option] = commonOptions[option];
          });
          parsedSnapTargets2.push(parsedSnapTarget);
        });
      }
      return parsedSnapTargets2;
    }, []);
    if (parsedSnapTargets.length) {
      options.snap = snapOptions;
      if (hasChanged(parsedSnapTargets, props.parsedSnapTargets)) {
        props.parsedSnapTargets = parsedSnapTargets;
        needsInitBBox = true;
      }
    }
  } else if (newOptions.hasOwnProperty("snap") && props.parsedSnapTargets) {
    options.snap = props.parsedSnapTargets = props.snapTargets = void 0;
  }
  if (newOptions.autoScroll) {
    var newAutoScrollOptions = isObject(newOptions.autoScroll) ? newOptions.autoScroll : {
      target: newOptions.autoScroll === true ? window : newOptions.autoScroll
    }, autoScrollOptions = {};
    autoScrollOptions.target = isElement(newAutoScrollOptions.target) ? newAutoScrollOptions.target : window;
    autoScrollOptions.speed = [];
    (Array.isArray(newAutoScrollOptions.speed) ? newAutoScrollOptions.speed : [newAutoScrollOptions.speed]).every(function(speed, i) {
      if (i <= 2 && isFinite(speed)) {
        autoScrollOptions.speed[i] = speed;
        return true;
      }
      return false;
    });
    if (!autoScrollOptions.speed.length) {
      autoScrollOptions.speed = AUTOSCROLL_SPEED;
    }
    var newSensitivity = Array.isArray(newAutoScrollOptions.sensitivity) ? newAutoScrollOptions.sensitivity : [newAutoScrollOptions.sensitivity];
    autoScrollOptions.sensitivity = autoScrollOptions.speed.map(function(v, i) {
      return isFinite(newSensitivity[i]) ? newSensitivity[i] : AUTOSCROLL_SENSITIVITY[i];
    });
    ["X", "Y"].forEach(function(option) {
      var optionMin = "min".concat(option), optionMax = "max".concat(option);
      if (isFinite(newAutoScrollOptions[optionMin]) && newAutoScrollOptions[optionMin] >= 0) {
        autoScrollOptions[optionMin] = newAutoScrollOptions[optionMin];
      }
      if (isFinite(newAutoScrollOptions[optionMax]) && newAutoScrollOptions[optionMax] >= 0 && (!autoScrollOptions[optionMin] || newAutoScrollOptions[optionMax] >= autoScrollOptions[optionMin])) {
        autoScrollOptions[optionMax] = newAutoScrollOptions[optionMax];
      }
    });
    if (hasChanged(autoScrollOptions, options.autoScroll)) {
      options.autoScroll = autoScrollOptions;
      needsInitBBox = true;
    }
  } else if (newOptions.hasOwnProperty("autoScroll")) {
    if (options.autoScroll) {
      needsInitBBox = true;
    }
    options.autoScroll = void 0;
  }
  if (needsInitBBox) {
    initBBox(props);
  }
  if (isElement(newOptions.handle) && newOptions.handle !== options.handle) {
    if (options.handle) {
      options.handle.style.cursor = props.orgCursor;
      if (cssPropUserSelect) {
        options.handle.style[cssPropUserSelect] = props.orgUserSelect;
      }
      pointerEvent.removeStartHandler(options.handle, props.pointerEventHandlerId);
    }
    var handle = options.handle = newOptions.handle;
    props.orgCursor = handle.style.cursor;
    setDraggableCursor(handle, props.orgCursor);
    if (cssPropUserSelect) {
      props.orgUserSelect = handle.style[cssPropUserSelect];
      handle.style[cssPropUserSelect] = "none";
    }
    pointerEvent.addStartHandler(handle, props.pointerEventHandlerId);
  }
  if (isFinite(newOptions.zIndex) || newOptions.zIndex === false) {
    options.zIndex = newOptions.zIndex;
    if (props === activeProps) {
      props.elementStyle.zIndex = options.zIndex === false ? props.orgZIndex : options.zIndex;
    }
  }
  var position = {
    left: props.elementBBox.left,
    top: props.elementBBox.top
  };
  var needsMove;
  if (isFinite(newOptions.left) && newOptions.left !== position.left) {
    position.left = newOptions.left;
    needsMove = true;
  }
  if (isFinite(newOptions.top) && newOptions.top !== position.top) {
    position.top = newOptions.top;
    needsMove = true;
  }
  if (needsMove) {
    move(props, position);
  }
  ["onDrag", "onMove", "onDragStart", "onMoveStart", "onDragEnd"].forEach(function(option) {
    if (typeof newOptions[option] === "function") {
      options[option] = newOptions[option];
      props[option] = options[option].bind(props.ins);
    } else if (newOptions.hasOwnProperty(option) && newOptions[option] == null) {
      options[option] = props[option] = void 0;
    }
  });
}
var PlainDraggable = /* @__PURE__ */ function() {
  function PlainDraggable2(element, options) {
    _classCallCheck$1(this, PlainDraggable2);
    var props = {
      ins: this,
      options: {
        zIndex: ZINDEX
      },
      disabled: false
    };
    Object.defineProperty(this, "_id", {
      value: ++insId
    });
    props._id = this._id;
    insProps[this._id] = props;
    if (!isElement(element) || element === body) {
      throw new Error("This element is not accepted.");
    }
    if (!options) {
      options = {};
    } else if (!isObject(options)) {
      throw new Error("Invalid options.");
    }
    var gpuTrigger = true;
    var ownerSvg;
    if (element instanceof SVGElement && (ownerSvg = element.ownerSVGElement)) {
      if (!element.getBBox) {
        throw new Error("This element is not accepted. (SVGLocatable)");
      }
      if (!element.transform) {
        throw new Error("This element is not accepted. (SVGAnimatedTransformList)");
      }
      props.svgTransform = element.transform.baseVal.appendItem(ownerSvg.createSVGTransform());
      props.svgPoint = ownerSvg.createSVGPoint();
      var svgView = element.nearestViewportElement;
      props.svgCtmElement = !IS_GECKO ? svgView : svgView.appendChild(document.createElementNS(ownerSvg.namespaceURI, "rect"));
      gpuTrigger = false;
      props.initElm = initSvg;
      props.moveElm = moveSvg;
    } else {
      var cssPropWillChange = CSSPrefix.getName("willChange");
      if (cssPropWillChange) {
        gpuTrigger = false;
      }
      if (!options.leftTop && cssPropTransform) {
        if (cssPropWillChange) {
          element.style[cssPropWillChange] = "transform";
        }
        props.initElm = initTranslate;
        props.moveElm = moveTranslate;
      } else {
        if (cssPropWillChange) {
          element.style[cssPropWillChange] = "left, top";
        }
        props.initElm = initLeftTop;
        props.moveElm = moveLeftTop;
      }
    }
    props.element = initAnim(element, gpuTrigger);
    props.elementStyle = element.style;
    props.orgZIndex = props.elementStyle.zIndex;
    if (draggableClass) {
      mClassList(element).add(draggableClass);
    }
    props.pointerEventHandlerId = pointerEvent.regStartHandler(function(pointerXY) {
      return dragStart(props, pointerXY);
    });
    if (!options.containment) {
      var parent;
      options.containment = (parent = element.parentNode) && isElement(parent) ? parent : body;
    }
    if (!options.handle) {
      options.handle = element;
    }
    _setOptions(props, options);
  }
  _createClass$1(PlainDraggable2, [{
    key: "remove",
    value: function remove2() {
      var props = insProps[this._id];
      this.disabled = true;
      pointerEvent.unregStartHandler(pointerEvent.removeStartHandler(props.options.handle, props.pointerEventHandlerId));
      delete insProps[this._id];
    }
  }, {
    key: "setOptions",
    value: function setOptions(options) {
      if (isObject(options)) {
        _setOptions(insProps[this._id], options);
      }
      return this;
    }
  }, {
    key: "position",
    value: function position() {
      initBBox(insProps[this._id]);
      return this;
    }
  }, {
    key: "disabled",
    get: function get() {
      return insProps[this._id].disabled;
    },
    set: function set(value) {
      var props = insProps[this._id];
      if ((value = !!value) !== props.disabled) {
        props.disabled = value;
        if (props.disabled) {
          if (props === activeProps) {
            dragEnd(props);
          }
          props.options.handle.style.cursor = props.orgCursor;
          if (cssPropUserSelect) {
            props.options.handle.style[cssPropUserSelect] = props.orgUserSelect;
          }
          if (draggableClass) {
            mClassList(props.element).remove(draggableClass);
          }
        } else {
          setDraggableCursor(props.options.handle, props.orgCursor);
          if (cssPropUserSelect) {
            props.options.handle.style[cssPropUserSelect] = "none";
          }
          if (draggableClass) {
            mClassList(props.element).add(draggableClass);
          }
        }
      }
    }
  }, {
    key: "element",
    get: function get() {
      return insProps[this._id].element;
    }
  }, {
    key: "rect",
    get: function get() {
      return copyTree(insProps[this._id].elementBBox);
    }
  }, {
    key: "left",
    get: function get() {
      return insProps[this._id].elementBBox.left;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        left: value
      });
    }
  }, {
    key: "top",
    get: function get() {
      return insProps[this._id].elementBBox.top;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        top: value
      });
    }
  }, {
    key: "containment",
    get: function get() {
      var props = insProps[this._id];
      return props.containmentIsBBox ? ppBBox2OptionObject(props.options.containment) : props.options.containment;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        containment: value
      });
    }
  }, {
    key: "snap",
    get: function get() {
      return copyTree(insProps[this._id].options.snap);
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        snap: value
      });
    }
  }, {
    key: "autoScroll",
    get: function get() {
      return copyTree(insProps[this._id].options.autoScroll);
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        autoScroll: value
      });
    }
  }, {
    key: "handle",
    get: function get() {
      return insProps[this._id].options.handle;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        handle: value
      });
    }
  }, {
    key: "zIndex",
    get: function get() {
      return insProps[this._id].options.zIndex;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        zIndex: value
      });
    }
  }, {
    key: "onDrag",
    get: function get() {
      return insProps[this._id].options.onDrag;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        onDrag: value
      });
    }
  }, {
    key: "onMove",
    get: function get() {
      return insProps[this._id].options.onMove;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        onMove: value
      });
    }
  }, {
    key: "onDragStart",
    get: function get() {
      return insProps[this._id].options.onDragStart;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        onDragStart: value
      });
    }
  }, {
    key: "onMoveStart",
    get: function get() {
      return insProps[this._id].options.onMoveStart;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        onMoveStart: value
      });
    }
  }, {
    key: "onDragEnd",
    get: function get() {
      return insProps[this._id].options.onDragEnd;
    },
    set: function set(value) {
      _setOptions(insProps[this._id], {
        onDragEnd: value
      });
    }
  }], [{
    key: "draggableCursor",
    get: function get() {
      return cssWantedValueDraggableCursor;
    },
    set: function set(value) {
      if (cssWantedValueDraggableCursor !== value) {
        cssWantedValueDraggableCursor = value;
        cssValueDraggableCursor = null;
        Object.keys(insProps).forEach(function(id) {
          var props = insProps[id];
          if (props.disabled || props === activeProps && cssValueDraggingCursor !== false) {
            return;
          }
          setDraggableCursor(props.options.handle, props.orgCursor);
          if (props === activeProps) {
            body.style.cursor = cssOrgValueBodyCursor;
            body.style.cursor = window.getComputedStyle(props.options.handle, "").cursor;
          }
        });
      }
    }
  }, {
    key: "draggingCursor",
    get: function get() {
      return cssWantedValueDraggingCursor;
    },
    set: function set(value) {
      if (cssWantedValueDraggingCursor !== value) {
        cssWantedValueDraggingCursor = value;
        cssValueDraggingCursor = null;
        if (activeProps) {
          setDraggingCursor(activeProps.options.handle);
          if (cssValueDraggingCursor === false) {
            setDraggableCursor(activeProps.options.handle, activeProps.orgCursor);
            body.style.cursor = cssOrgValueBodyCursor;
          }
          body.style.cursor = cssValueDraggingCursor || window.getComputedStyle(activeProps.options.handle, "").cursor;
        }
      }
    }
  }, {
    key: "draggableClass",
    get: function get() {
      return draggableClass;
    },
    set: function set(value) {
      value = value ? value + "" : void 0;
      if (value !== draggableClass) {
        Object.keys(insProps).forEach(function(id) {
          var props = insProps[id];
          if (!props.disabled) {
            var classList = mClassList(props.element);
            if (draggableClass) {
              classList.remove(draggableClass);
            }
            if (value) {
              classList.add(value);
            }
          }
        });
        draggableClass = value;
      }
    }
  }, {
    key: "draggingClass",
    get: function get() {
      return draggingClass;
    },
    set: function set(value) {
      value = value ? value + "" : void 0;
      if (value !== draggingClass) {
        if (activeProps) {
          var classList = mClassList(activeProps.element);
          if (draggingClass) {
            classList.remove(draggingClass);
          }
          if (value) {
            classList.add(value);
          }
        }
        draggingClass = value;
      }
    }
  }, {
    key: "movingClass",
    get: function get() {
      return movingClass;
    },
    set: function set(value) {
      value = value ? value + "" : void 0;
      if (value !== movingClass) {
        if (activeProps && hasMoved) {
          var classList = mClassList(activeProps.element);
          if (movingClass) {
            classList.remove(movingClass);
          }
          if (value) {
            classList.add(value);
          }
        }
        movingClass = value;
      }
    }
  }]);
  return PlainDraggable2;
}();
pointerEvent.addMoveHandler(document, function(pointerXY) {
  if (!activeProps) {
    return;
  }
  var position = {
    left: pointerXY.clientX + window.pageXOffset + pointerOffset.left,
    top: pointerXY.clientY + window.pageYOffset + pointerOffset.top
  };
  if (move(activeProps, position, activeProps.snapTargets ? function(position2) {
    var iLen = activeProps.snapTargets.length;
    var snappedX = false, snappedY = false, i;
    for (i = 0; i < iLen && (!snappedX || !snappedY); i++) {
      var snapTarget = activeProps.snapTargets[i];
      if ((snapTarget.gravityXStart == null || position2.left >= snapTarget.gravityXStart) && (snapTarget.gravityXEnd == null || position2.left <= snapTarget.gravityXEnd) && (snapTarget.gravityYStart == null || position2.top >= snapTarget.gravityYStart) && (snapTarget.gravityYEnd == null || position2.top <= snapTarget.gravityYEnd)) {
        if (!snappedX && snapTarget.x != null) {
          position2.left = snapTarget.x;
          snappedX = true;
          i = -1;
        }
        if (!snappedY && snapTarget.y != null) {
          position2.top = snapTarget.y;
          snappedY = true;
          i = -1;
        }
      }
    }
    position2.snapped = snappedX || snappedY;
    return activeProps.onDrag ? activeProps.onDrag(position2) : true;
  } : activeProps.onDrag)) {
    var xyMoveArgs = {}, autoScroll = activeProps.autoScroll;
    if (autoScroll) {
      var clientXY = {
        x: activeProps.elementBBox.left - window.pageXOffset,
        y: activeProps.elementBBox.top - window.pageYOffset
      };
      ["x", "y"].forEach(function(axis) {
        if (autoScroll[axis]) {
          var min = autoScroll[axis].min, max = autoScroll[axis].max;
          autoScroll[axis].lines.some(function(line) {
            if (line.dir === -1 ? clientXY[axis] <= line.position : clientXY[axis] >= line.position) {
              xyMoveArgs[axis] = {
                dir: line.dir,
                speed: line.speed / 1e3,
                min,
                max
              };
              return true;
            }
            return false;
          });
        }
      });
    }
    if (xyMoveArgs.x || xyMoveArgs.y) {
      scrollFrame.move(autoScroll.target, xyMoveArgs, autoScroll.isWindow ? scrollXYWindow : scrollXYElement);
      position.autoScroll = true;
    } else {
      scrollFrame.stop();
    }
    if (!hasMoved) {
      hasMoved = true;
      if (movingClass) {
        mClassList(activeProps.element).add(movingClass);
      }
      if (activeProps.onMoveStart) {
        activeProps.onMoveStart(position);
      }
    }
    if (activeProps.onMove) {
      activeProps.onMove(position);
    }
  }
});
{
  let endHandler = function() {
    if (activeProps) {
      dragEnd(activeProps);
    }
  };
  pointerEvent.addEndHandler(document, endHandler);
  pointerEvent.addCancelHandler(document, endHandler);
}
{
  let initDoc = function() {
    cssPropTransitionProperty = CSSPrefix.getName("transitionProperty");
    cssPropTransform = CSSPrefix.getName("transform");
    cssOrgValueBodyCursor = body.style.cursor;
    if (cssPropUserSelect = CSSPrefix.getName("userSelect")) {
      cssOrgValueBodyUserSelect = body.style[cssPropUserSelect];
    }
    var LAZY_INIT_DELAY = 200;
    var initDoneItems = {}, lazyInitTimer;
    function checkInitBBox(props, eventType) {
      if (props.initElm) {
        initBBox(props, eventType);
      }
    }
    function initAll(eventType) {
      clearTimeout(lazyInitTimer);
      Object.keys(insProps).forEach(function(id) {
        if (!initDoneItems[id]) {
          checkInitBBox(insProps[id], eventType);
        }
      });
      initDoneItems = {};
    }
    var layoutChanging = false;
    var layoutChange = AnimEvent.add(function(event) {
      if (layoutChanging) {
        return;
      }
      layoutChanging = true;
      if (activeProps) {
        checkInitBBox(activeProps, event.type);
        pointerEvent.move();
        initDoneItems[activeProps._id] = true;
      }
      clearTimeout(lazyInitTimer);
      lazyInitTimer = setTimeout(function() {
        initAll(event.type);
      }, LAZY_INIT_DELAY);
      layoutChanging = false;
    });
    window.addEventListener("resize", layoutChange, true);
    window.addEventListener("scroll", layoutChange, true);
  };
  if (body = document.body) {
    initDoc();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      body = document.body;
      initDoc();
    }, true);
  }
}
export default PlainDraggable;
