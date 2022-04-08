var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// build/output/Maybe.js
function isNil(nilable) {
  return nilable === null || nilable === void 0;
}
var UnexpectedNilError = class extends Error {
  constructor(message = "unexpected nil value") {
    super(message);
  }
};
function mustExist(subject) {
  if (isNil(subject)) {
    throw new UnexpectedNilError();
  }
  return subject;
}

// build/output/behavior/BehaviorMetadata.js
var MatchTitleMarkup = /^\/\/\/ @title "(?<title>[^"]+)"$/gm;
var MatchInputMarkup = /^\/\/\/ @input (?<identifier>[^ ]+) "(?<label>[^"]+)".*$/gm;
var MatchOutputMarkup = /^\/\/\/ @output (?<identifier>[^ ]+) "(?<label>[^"]+)".*$/gm;
var BehaviorMetadata = class {
  constructor(title = "", inputs = new Array(), outputs = new Array()) {
    this.title = title;
    this.inputs = inputs;
    this.outputs = outputs;
  }
  serialize() {
    const meta = new Array();
    meta.push(`/// @title "${this.title}"`);
    for (const input of this.inputs) {
      meta.push(`/// @input ${input.identifier} "${input.label}"`);
    }
    for (const output of this.outputs) {
      meta.push(`/// @output ${output.identifier} "${output.label}"`);
    }
    return meta.join("\n");
  }
  wrapExecutable(executable) {
    const inputsInit = this.inputs.map((input, index) => `const ${input.identifier} = this.inputs[${index}].value;`).join("\n");
    const outputsInit = this.outputs.map((output, index) => `let ${output.identifier} = undefined;`).join("\n");
    const outputsWrite = this.outputs.map((output, index) => `this.outputs[${index}].value = ${output.identifier};`).join("\n");
    return `
${inputsInit}
${outputsInit}

${executable}

${outputsWrite}
    `.trim();
  }
  static fromNode(node) {
    const meta = new BehaviorMetadata();
    meta.title = node.name;
    let inputIndex = 0;
    for (const input of node.inputs) {
      meta.inputs.push({identifier: `input${inputIndex++}`, label: input.label});
    }
    let outputIndex = 0;
    for (const output of node.outputs) {
      meta.outputs.push({identifier: `output${outputIndex++}`, label: output.label});
    }
    return meta;
  }
  static parse(script) {
    const meta = new BehaviorMetadata();
    const titleMatches = script.matchAll(MatchTitleMarkup);
    for (const titleMatch of titleMatches) {
      meta.title = mustExist(titleMatch.groups)["title"];
    }
    const inputMatches = script.matchAll(MatchInputMarkup);
    const outputMatches = script.matchAll(MatchOutputMarkup);
    for (const inputMatch of inputMatches) {
      meta.inputs.push({
        identifier: mustExist(inputMatch.groups)["identifier"],
        label: mustExist(inputMatch.groups)["label"]
      });
    }
    for (const outputMatch of outputMatches) {
      meta.outputs.push({
        identifier: mustExist(outputMatch.groups)["identifier"],
        label: mustExist(outputMatch.groups)["label"]
      });
    }
    return meta;
  }
  static stripMetadataFromBehaviorScript(behavior) {
    return behavior.replaceAll(MatchTitleMarkup, "").replaceAll(MatchInputMarkup, "").replaceAll(MatchOutputMarkup, "").trim();
  }
};

// build/output/behavior/Behavior.js
var _script, _metadata;
var _Behavior = class {
  constructor(script = "", metadata = new BehaviorMetadata()) {
    _script.set(this, void 0);
    _metadata.set(this, void 0);
    __privateSet(this, _script, script);
    __privateSet(this, _metadata, metadata);
  }
  get metadata() {
    return __privateGet(this, _metadata);
  }
  toExecutableBehavior() {
    return __privateGet(this, _metadata).wrapExecutable(__privateGet(this, _script));
  }
  toEditableScript() {
    return __privateGet(this, _metadata).serialize() + "\n\n" + __privateGet(this, _script);
  }
  toCodeFragment() {
    return __privateGet(this, _script);
  }
  static fromEditableScript(editable) {
    const metadata = BehaviorMetadata.parse(editable);
    const script = BehaviorMetadata.stripMetadataFromBehaviorScript(editable);
    return new _Behavior(script, metadata);
  }
  static fromCodeFragment(executable, metadata) {
    return new _Behavior(executable, metadata);
  }
  static fromCodeFragmentForNode(executable, node) {
    return new _Behavior(executable, BehaviorMetadata.fromNode(node));
  }
};
var Behavior = _Behavior;
_script = new WeakMap();
_metadata = new WeakMap();

// build/output/ui/Column.module.css
var _default = {};

// build/output/ui/Column.js
var Column = class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.columnId = null;
    this.parent = null;
    this.label = "<unlabled column>";
  }
  connectedCallback() {
    this.parent = mustExist(this.parentElement).parentElement;
    this.classList.add(_default.column);
    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);
    this.valueElement = document.createElement("span");
    this.valueElement.classList.add(_default.value);
    this.valueElement.textContent = String(this.value);
    this.appendChild(this.valueElement);
    this.addEventListener("mouseenter", (event) => this.onMouseEnter(event));
    this.addEventListener("mouseleave", (event) => this.onMouseLeave(event));
  }
  init(initParameters) {
    this.columnId = initParameters?.id ?? this.columnId;
  }
  connect(connection) {
    mustExist(this.parent).onConnect(connection);
    this.classList.add(_default.connected);
  }
  disconnect(connection) {
    this.classList.remove(_default.connected);
  }
  updateUi() {
    mustExist(this.labelElement).textContent = this.label;
    mustExist(this.valueElement).textContent = String(this.value);
  }
};

// build/_snowpack/pkg/common/_commonjsHelpers-913f9c4a.js
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base) {
      return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}

// build/_snowpack/pkg/leader-line.js
var leaderLine_min = createCommonjsModule(function(module) {
  /*! LeaderLine v1.0.7 (c) anseki https://anseki.github.io/leader-line/ */
  var LeaderLine2 = function() {
    var Z, w, O, M, I, o, t, s, h, u, n, a, e, _, v, l, r, i, E, x, p, c, d, C = "leader-line", b = 1, k = 2, L = 3, A = 4, V = {top: b, right: k, bottom: L, left: A}, P = 1, N = 2, T = 3, W = 4, B = 5, R = {straight: P, arc: N, fluid: T, magnet: W, grid: B}, Y = "behind", f = C + "-defs", y = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="leader-line-defs"><style><![CDATA[.leader-line{position:absolute;overflow:visible!important;pointer-events:none!important;font-size:16px}#leader-line-defs{width:0;height:0;position:absolute;left:0;top:0}.leader-line-line-path{fill:none}.leader-line-mask-bg-rect{fill:white}.leader-line-caps-mask-anchor,.leader-line-caps-mask-marker-shape{fill:black}.leader-line-caps-mask-anchor{stroke:black}.leader-line-caps-mask-line,.leader-line-plugs-face{stroke:rgba(0,0,0,0)}.leader-line-line-mask-shape{stroke:white}.leader-line-line-outline-mask-shape{stroke:black}.leader-line-plug-mask-shape{fill:white;stroke:black}.leader-line-plug-outline-mask-shape{fill:black;stroke:white}.leader-line-areaAnchor{position:absolute;overflow:visible!important}]]></style><defs><circle id="leader-line-disc" cx="0" cy="0" r="5"/><rect id="leader-line-square" x="-5" y="-5" width="10" height="10"/><polygon id="leader-line-arrow1" points="-8,-8 8,0 -8,8 -5,0"/><polygon id="leader-line-arrow2" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"/><polygon id="leader-line-arrow3" points="-4,-5 8,0 -4,5"/><g id="leader-line-hand"><path style="fill: #fcfcfc" d="M9.19 11.14h4.75c1.38 0 2.49-1.11 2.49-2.49 0-.51-.15-.98-.41-1.37h1.3c1.38 0 2.49-1.11 2.49-2.49s-1.11-2.53-2.49-2.53h1.02c1.38 0 2.49-1.11 2.49-2.49s-1.11-2.49-2.49-2.49h14.96c1.37 0 2.49-1.11 2.49-2.49s-1.11-2.49-2.49-2.49H16.58C16-9.86 14.28-11.14 9.7-11.14c-4.79 0-6.55 3.42-7.87 4.73H-2.14v13.23h3.68C3.29 9.97 5.47 11.14 9.19 11.14L9.19 11.14Z"/><path style="fill: black" d="M13.95 12c1.85 0 3.35-1.5 3.35-3.35 0-.17-.02-.34-.04-.51h.07c1.85 0 3.35-1.5 3.35-3.35 0-.79-.27-1.51-.72-2.08 1.03-.57 1.74-1.67 1.74-2.93 0-.59-.16-1.15-.43-1.63h12.04c1.85 0 3.35-1.5 3.35-3.35 0-1.85-1.5-3.35-3.35-3.35H17.2C16.26-10.93 13.91-12 9.7-12 5.36-12 3.22-9.4 1.94-7.84c0 0-.29.33-.5.57-.63 0-3.58 0-3.58 0C-2.61-7.27-3-6.88-3-6.41v13.23c0 .47.39.86.86.86 0 0 2.48 0 3.2 0C2.9 10.73 5.29 12 9.19 12L13.95 12ZM9.19 10.28c-3.46 0-5.33-1.05-6.9-3.87-.15-.27-.44-.44-.75-.44 0 0-1.81 0-2.82 0V-5.55c1.06 0 3.11 0 3.11 0 .25 0 .44-.06.61-.25l.83-.95c1.23-1.49 2.91-3.53 6.43-3.53 3.45 0 4.9.74 5.57 1.72h-4.3c-.48 0-.86.38-.86.86s.39.86.86.86h22.34c.9 0 1.63.73 1.63 1.63 0 .9-.73 1.63-1.63 1.63H15.83c-.48 0-.86.38-.86.86 0 .47.39.86.86.86h2.52c.9 0 1.63.73 1.63 1.63s-.73 1.63-1.63 1.63h-3.12c-.48 0-.86.38-.86.86 0 .47.39.86.86.86h2.11c.88 0 1.63.76 1.63 1.67 0 .9-.73 1.63-1.63 1.63h-3.2c-.48 0-.86.39-.86.86 0 .47.39.86.86.86h1.36c.05.16.09.34.09.51 0 .9-.73 1.63-1.63 1.63C13.95 10.28 9.19 10.28 9.19 10.28Z"/></g><g id="leader-line-crosshair"><path d="M0-78.97c-43.54 0-78.97 35.43-78.97 78.97 0 43.54 35.43 78.97 78.97 78.97s78.97-35.43 78.97-78.97C78.97-43.54 43.55-78.97 0-78.97ZM76.51-1.21h-9.91v-9.11h-2.43v9.11h-11.45c-.64-28.12-23.38-50.86-51.5-51.5V-64.17h9.11V-66.6h-9.11v-9.91C42.46-75.86 75.86-42.45 76.51-1.21ZM-1.21-30.76h-9.11v2.43h9.11V-4.2c-1.44.42-2.57 1.54-2.98 2.98H-28.33v-9.11h-2.43v9.11H-50.29C-49.65-28-27.99-49.65-1.21-50.29V-30.76ZM-30.76 1.21v9.11h2.43v-9.11H-4.2c.42 1.44 1.54 2.57 2.98 2.98v24.13h-9.11v2.43h9.11v19.53C-27.99 49.65-49.65 28-50.29 1.21H-30.76ZM1.22 30.75h9.11v-2.43h-9.11V4.2c1.44-.42 2.56-1.54 2.98-2.98h24.13v9.11h2.43v-9.11h19.53C49.65 28 28 49.65 1.22 50.29V30.75ZM30.76-1.21v-9.11h-2.43v9.11H4.2c-.42-1.44-1.54-2.56-2.98-2.98V-28.33h9.11v-2.43h-9.11V-50.29C28-49.65 49.65-28 50.29-1.21H30.76ZM-1.21-76.51v9.91h-9.11v2.43h9.11v11.45c-28.12.64-50.86 23.38-51.5 51.5H-64.17v-9.11H-66.6v9.11h-9.91C-75.86-42.45-42.45-75.86-1.21-76.51ZM-76.51 1.21h9.91v9.11h2.43v-9.11h11.45c.64 28.12 23.38 50.86 51.5 51.5v11.45h-9.11v2.43h9.11v9.91C-42.45 75.86-75.86 42.45-76.51 1.21ZM1.22 76.51v-9.91h9.11v-2.43h-9.11v-11.45c28.12-.64 50.86-23.38 51.5-51.5h11.45v9.11h2.43v-9.11h9.91C75.86 42.45 42.45 75.86 1.22 76.51Z"/><path d="M0 83.58-7.1 96 7.1 96Z"/><path d="M0-83.58 7.1-96-7.1-96"/><path d="M83.58 0 96 7.1 96-7.1Z"/><path d="M-83.58 0-96-7.1-96 7.1Z"/></g></defs></svg>', X = {disc: {elmId: "leader-line-disc", noRotate: true, bBox: {left: -5, top: -5, width: 10, height: 10, right: 5, bottom: 5}, widthR: 2.5, heightR: 2.5, bCircle: 5, sideLen: 5, backLen: 5, overhead: 0, outlineBase: 1, outlineMax: 4}, square: {elmId: "leader-line-square", noRotate: true, bBox: {left: -5, top: -5, width: 10, height: 10, right: 5, bottom: 5}, widthR: 2.5, heightR: 2.5, bCircle: 5, sideLen: 5, backLen: 5, overhead: 0, outlineBase: 1, outlineMax: 4}, arrow1: {elmId: "leader-line-arrow1", bBox: {left: -8, top: -8, width: 16, height: 16, right: 8, bottom: 8}, widthR: 4, heightR: 4, bCircle: 8, sideLen: 8, backLen: 8, overhead: 8, outlineBase: 2, outlineMax: 1.5}, arrow2: {elmId: "leader-line-arrow2", bBox: {left: -7, top: -8, width: 11, height: 16, right: 4, bottom: 8}, widthR: 2.75, heightR: 4, bCircle: 8, sideLen: 8, backLen: 7, overhead: 4, outlineBase: 1, outlineMax: 1.75}, arrow3: {elmId: "leader-line-arrow3", bBox: {left: -4, top: -5, width: 12, height: 10, right: 8, bottom: 5}, widthR: 3, heightR: 2.5, bCircle: 8, sideLen: 5, backLen: 4, overhead: 8, outlineBase: 1, outlineMax: 2.5}, hand: {elmId: "leader-line-hand", bBox: {left: -3, top: -12, width: 40, height: 24, right: 37, bottom: 12}, widthR: 10, heightR: 6, bCircle: 37, sideLen: 12, backLen: 3, overhead: 37}, crosshair: {elmId: "leader-line-crosshair", noRotate: true, bBox: {left: -96, top: -96, width: 192, height: 192, right: 96, bottom: 96}, widthR: 48, heightR: 48, bCircle: 96, sideLen: 96, backLen: 96, overhead: 0}}, F = {behind: Y, disc: "disc", square: "square", arrow1: "arrow1", arrow2: "arrow2", arrow3: "arrow3", hand: "hand", crosshair: "crosshair"}, q = {disc: "disc", square: "square", arrow1: "arrow1", arrow2: "arrow2", arrow3: "arrow3", hand: "hand", crosshair: "crosshair"}, G = [b, k, L, A], D = "auto", Q = {x: "left", y: "top", width: "width", height: "height"}, z = 80, j = 4, H = 5, U = 120, K = 8, J = 3.75, $ = 10, ee = 30, te = 0.5522847, ne = 0.25 * Math.PI, m = /^\s*(\-?[\d\.]+)\s*(\%)?\s*$/, ae = "http://www.w3.org/2000/svg", S = "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style && !window.navigator.msPointerEnabled, ie = !S && !!document.uniqueID, oe = "MozAppearance" in document.documentElement.style, le = !(S || oe || !window.chrome || !window.CSS), re = !S && !ie && !oe && !le && !window.chrome && "WebkitAppearance" in document.documentElement.style, se = ie || S ? 0.2 : 0.1, ue = {path: T, lineColor: "coral", lineSize: 4, plugSE: [Y, "arrow1"], plugSizeSE: [1, 1], lineOutlineEnabled: false, lineOutlineColor: "indianred", lineOutlineSize: 0.25, plugOutlineEnabledSE: [false, false], plugOutlineSizeSE: [1, 1]}, he = (p = {}.toString, c = {}.hasOwnProperty.toString, d = c.call(Object), function(e2) {
      return e2 && p.call(e2) === "[object Object]" && (!(e2 = Object.getPrototypeOf(e2)) || (e2 = e2.hasOwnProperty("constructor") && e2.constructor) && typeof e2 == "function" && c.call(e2) === d);
    }), pe = Number.isFinite || function(e2) {
      return typeof e2 == "number" && window.isFinite(e2);
    }, g = (_ = {ease: [0.25, 0.1, 0.25, 1], linear: [0, 0, 1, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1]}, v = 1e3 / 60 / 2, l = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(e2) {
      setTimeout(e2, v);
    }, r = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(e2) {
      clearTimeout(e2);
    }, i = Number.isFinite || function(e2) {
      return typeof e2 == "number" && window.isFinite(e2);
    }, E = [], x = 0, {add: function(n2, e2, t2, a2, i2, o2, l2) {
      var r2, s2, u2, h2, p2, c2, d2, f2, y2, m2, S2 = ++x;
      function g2(e3, t3) {
        return {value: n2(t3), timeRatio: e3, outputRatio: t3};
      }
      if (typeof i2 == "string" && (i2 = _[i2]), n2 = n2 || function() {
      }, t2 < v)
        r2 = [g2(0, 0), g2(1, 1)];
      else {
        if (s2 = v / t2, r2 = [g2(0, 0)], i2[0] === 0 && i2[1] === 0 && i2[2] === 1 && i2[3] === 1)
          for (h2 = s2; h2 <= 1; h2 += s2)
            r2.push(g2(h2, h2));
        else
          for (p2 = u2 = (h2 = s2) / 10; p2 <= 1; p2 += u2)
            d2 = p2, m2 = y2 = f2 = void 0, f2 = (m2 = p2 * p2) * p2, m2 *= 3 * (y2 = 1 - p2), h2 <= (c2 = {x: (d2 = 3 * (y2 * y2) * p2) * i2[0] + m2 * i2[2] + f2, y: d2 * i2[1] + m2 * i2[3] + f2}).x && (r2.push(g2(c2.x, c2.y)), h2 += s2);
        r2.push(g2(1, 1));
      }
      return E.push(o2 = {animId: S2, frameCallback: e2, duration: t2, count: a2, frames: r2, reverse: !!o2}), l2 !== false && be(o2, l2), S2;
    }, remove: function(n2) {
      var a2;
      E.some(function(e2, t2) {
        return e2.animId === n2 && (a2 = t2, !(e2.framesStart = null));
      }) && E.splice(a2, 1);
    }, start: function(t2, n2, a2) {
      E.some(function(e2) {
        return e2.animId === t2 && (e2.reverse = !!n2, be(e2, a2), true);
      });
    }, stop: function(t2, n2) {
      var a2;
      return E.some(function(e2) {
        return e2.animId === t2 && (n2 ? e2.lastFrame != null && (a2 = e2.frames[e2.lastFrame].timeRatio) : (a2 = (Date.now() - e2.framesStart) / e2.duration, (a2 = e2.reverse ? 1 - a2 : a2) < 0 ? a2 = 0 : 1 < a2 && (a2 = 1)), !(e2.framesStart = null));
      }), a2;
    }, validTiming: function(t2) {
      return typeof t2 == "string" ? _[t2] : Array.isArray(t2) && [0, 1, 2, 3].every(function(e2) {
        return i(t2[e2]) && 0 <= t2[e2] && t2[e2] <= 1;
      }) ? [t2[0], t2[1], t2[2], t2[3]] : null;
    }}), ce = function(e2) {
      e2.SVGPathElement.prototype.getPathData && e2.SVGPathElement.prototype.setPathData || function() {
        function i2(e3) {
          this._string = e3, this._currentIndex = 0, this._endIndex = this._string.length, this._prevCommand = null, this._skipOptionalSpaces();
        }
        var a2 = {Z: "Z", M: "M", L: "L", C: "C", Q: "Q", A: "A", H: "H", V: "V", S: "S", T: "T", z: "Z", m: "m", l: "l", c: "c", q: "q", a: "a", h: "h", v: "v", s: "s", t: "t"}, o2 = e2.navigator.userAgent.indexOf("MSIE ") !== -1;
        i2.prototype = {parseSegment: function() {
          var e3 = this._string[this._currentIndex], t2 = a2[e3] || null;
          if (t2 === null) {
            if (this._prevCommand === null)
              return null;
            if ((t2 = (e3 === "+" || e3 === "-" || e3 === "." || "0" <= e3 && e3 <= "9") && this._prevCommand !== "Z" ? this._prevCommand === "M" ? "L" : this._prevCommand === "m" ? "l" : this._prevCommand : null) === null)
              return null;
          } else
            this._currentIndex += 1;
          var n3 = null, e3 = (this._prevCommand = t2).toUpperCase();
          return e3 === "H" || e3 === "V" ? n3 = [this._parseNumber()] : e3 === "M" || e3 === "L" || e3 === "T" ? n3 = [this._parseNumber(), this._parseNumber()] : e3 === "S" || e3 === "Q" ? n3 = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()] : e3 === "C" ? n3 = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()] : e3 === "A" ? n3 = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseArcFlag(), this._parseArcFlag(), this._parseNumber(), this._parseNumber()] : e3 === "Z" && (this._skipOptionalSpaces(), n3 = []), n3 === null || 0 <= n3.indexOf(null) ? null : {type: t2, values: n3};
        }, hasMoreData: function() {
          return this._currentIndex < this._endIndex;
        }, peekSegmentType: function() {
          var e3 = this._string[this._currentIndex];
          return a2[e3] || null;
        }, initialCommandIsMoveTo: function() {
          if (!this.hasMoreData())
            return true;
          var e3 = this.peekSegmentType();
          return e3 === "M" || e3 === "m";
        }, _isCurrentSpace: function() {
          var e3 = this._string[this._currentIndex];
          return e3 <= " " && (e3 === " " || e3 === "\n" || e3 === "	" || e3 === "\r" || e3 === "\f");
        }, _skipOptionalSpaces: function() {
          for (; this._currentIndex < this._endIndex && this._isCurrentSpace(); )
            this._currentIndex += 1;
          return this._currentIndex < this._endIndex;
        }, _skipOptionalSpacesOrDelimiter: function() {
          return !(this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string[this._currentIndex] !== ",") && (this._skipOptionalSpaces() && this._currentIndex < this._endIndex && this._string[this._currentIndex] === "," && (this._currentIndex += 1, this._skipOptionalSpaces()), this._currentIndex < this._endIndex);
        }, _parseNumber: function() {
          var e3 = 0, t2 = 0, n3 = 1, a3 = 0, i3 = 1, o3 = 1, l3 = this._currentIndex;
          if (this._skipOptionalSpaces(), this._currentIndex < this._endIndex && this._string[this._currentIndex] === "+" ? this._currentIndex += 1 : this._currentIndex < this._endIndex && this._string[this._currentIndex] === "-" && (this._currentIndex += 1, i3 = -1), this._currentIndex === this._endIndex || (this._string[this._currentIndex] < "0" || "9" < this._string[this._currentIndex]) && this._string[this._currentIndex] !== ".")
            return null;
          for (var r3 = this._currentIndex; this._currentIndex < this._endIndex && "0" <= this._string[this._currentIndex] && this._string[this._currentIndex] <= "9"; )
            this._currentIndex += 1;
          if (this._currentIndex !== r3)
            for (var s3 = this._currentIndex - 1, u3 = 1; r3 <= s3; )
              t2 += u3 * (this._string[s3] - "0"), --s3, u3 *= 10;
          if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ".") {
            if (this._currentIndex += 1, this._currentIndex >= this._endIndex || this._string[this._currentIndex] < "0" || "9" < this._string[this._currentIndex])
              return null;
            for (; this._currentIndex < this._endIndex && "0" <= this._string[this._currentIndex] && this._string[this._currentIndex] <= "9"; )
              n3 *= 10, a3 += (this._string.charAt(this._currentIndex) - "0") / n3, this._currentIndex += 1;
          }
          if (this._currentIndex !== l3 && this._currentIndex + 1 < this._endIndex && (this._string[this._currentIndex] === "e" || this._string[this._currentIndex] === "E") && this._string[this._currentIndex + 1] !== "x" && this._string[this._currentIndex + 1] !== "m") {
            if (this._currentIndex += 1, this._string[this._currentIndex] === "+" ? this._currentIndex += 1 : this._string[this._currentIndex] === "-" && (this._currentIndex += 1, o3 = -1), this._currentIndex >= this._endIndex || this._string[this._currentIndex] < "0" || "9" < this._string[this._currentIndex])
              return null;
            for (; this._currentIndex < this._endIndex && "0" <= this._string[this._currentIndex] && this._string[this._currentIndex] <= "9"; )
              e3 *= 10, e3 += this._string[this._currentIndex] - "0", this._currentIndex += 1;
          }
          var h2 = t2 + a3;
          return h2 *= i3, e3 && (h2 *= Math.pow(10, o3 * e3)), l3 === this._currentIndex ? null : (this._skipOptionalSpacesOrDelimiter(), h2);
        }, _parseArcFlag: function() {
          if (this._currentIndex >= this._endIndex)
            return null;
          var e3 = null, t2 = this._string[this._currentIndex];
          if (this._currentIndex += 1, t2 === "0")
            e3 = 0;
          else {
            if (t2 !== "1")
              return null;
            e3 = 1;
          }
          return this._skipOptionalSpacesOrDelimiter(), e3;
        }};
        function n2(e3) {
          if (!e3 || e3.length === 0)
            return [];
          var t2 = new i2(e3), n3 = [];
          if (t2.initialCommandIsMoveTo())
            for (; t2.hasMoreData(); ) {
              var a3 = t2.parseSegment();
              if (a3 === null)
                break;
              n3.push(a3);
            }
          return n3;
        }
        function l2(e3) {
          return e3.map(function(e4) {
            return {type: e4.type, values: Array.prototype.slice.call(e4.values)};
          });
        }
        function r2(e3) {
          var u3 = [], h2 = null, p2 = null, c2 = null, d3 = null, f3 = null, y2 = null, m2 = null;
          return e3.forEach(function(e4) {
            var t2, n3, a3, i3, o3, l3, r3, s3;
            e4.type === "M" ? (r3 = e4.values[0], s3 = e4.values[1], u3.push({type: "M", values: [r3, s3]}), d3 = y2 = r3, f3 = m2 = s3) : e4.type === "C" ? (o3 = e4.values[0], l3 = e4.values[1], t2 = e4.values[2], n3 = e4.values[3], r3 = e4.values[4], s3 = e4.values[5], u3.push({type: "C", values: [o3, l3, t2, n3, r3, s3]}), p2 = t2, c2 = n3, d3 = r3, f3 = s3) : e4.type === "L" ? (r3 = e4.values[0], s3 = e4.values[1], u3.push({type: "L", values: [r3, s3]}), d3 = r3, f3 = s3) : e4.type === "H" ? (r3 = e4.values[0], u3.push({type: "L", values: [r3, f3]}), d3 = r3) : e4.type === "V" ? (s3 = e4.values[0], u3.push({type: "L", values: [d3, s3]}), f3 = s3) : e4.type === "S" ? (t2 = e4.values[0], n3 = e4.values[1], r3 = e4.values[2], s3 = e4.values[3], i3 = h2 === "C" || h2 === "S" ? (a3 = d3 + (d3 - p2), f3 + (f3 - c2)) : (a3 = d3, f3), u3.push({type: "C", values: [a3, i3, t2, n3, r3, s3]}), p2 = t2, c2 = n3, d3 = r3, f3 = s3) : e4.type === "T" ? (r3 = e4.values[0], s3 = e4.values[1], l3 = h2 === "Q" || h2 === "T" ? (o3 = d3 + (d3 - p2), f3 + (f3 - c2)) : (o3 = d3, f3), u3.push({type: "C", values: [a3 = d3 + 2 * (o3 - d3) / 3, i3 = f3 + 2 * (l3 - f3) / 3, r3 + 2 * (o3 - r3) / 3, s3 + 2 * (l3 - s3) / 3, r3, s3]}), p2 = o3, c2 = l3, d3 = r3, f3 = s3) : e4.type === "Q" ? (o3 = e4.values[0], l3 = e4.values[1], r3 = e4.values[2], s3 = e4.values[3], u3.push({type: "C", values: [a3 = d3 + 2 * (o3 - d3) / 3, i3 = f3 + 2 * (l3 - f3) / 3, r3 + 2 * (o3 - r3) / 3, s3 + 2 * (l3 - s3) / 3, r3, s3]}), p2 = o3, c2 = l3, d3 = r3, f3 = s3) : e4.type === "A" ? (n3 = e4.values[0], a3 = e4.values[1], i3 = e4.values[2], o3 = e4.values[3], l3 = e4.values[4], r3 = e4.values[5], s3 = e4.values[6], n3 === 0 || a3 === 0 ? (u3.push({type: "C", values: [d3, f3, r3, s3, r3, s3]}), d3 = r3, f3 = s3) : d3 === r3 && f3 === s3 || b2(d3, f3, r3, s3, n3, a3, i3, o3, l3).forEach(function(e5) {
              u3.push({type: "C", values: e5}), d3 = r3, f3 = s3;
            })) : e4.type === "Z" && (u3.push(e4), d3 = y2, f3 = m2), h2 = e4.type;
          }), u3;
        }
        var s2 = e2.SVGPathElement.prototype.setAttribute, u2 = e2.SVGPathElement.prototype.removeAttribute, d2 = e2.Symbol ? e2.Symbol() : "__cachedPathData", f2 = e2.Symbol ? e2.Symbol() : "__cachedNormalizedPathData", b2 = function(e3, t2, n3, a3, i3, o3, l3, r3, s3, u3) {
          function h2(e4, t3, n4) {
            return {x: e4 * Math.cos(n4) - t3 * Math.sin(n4), y: e4 * Math.sin(n4) + t3 * Math.cos(n4)};
          }
          var p2 = Math.PI * l3 / 180, c2 = [];
          u3 ? (_2 = u3[0], v2 = u3[1], S2 = u3[2], g2 = u3[3]) : (e3 = (m2 = h2(e3, t2, -p2)).x, t2 = m2.y, 1 < (m2 = (y2 = (e3 - (n3 = (f3 = h2(n3, a3, -p2)).x)) / 2) * y2 / (i3 * i3) + (d3 = (t2 - (a3 = f3.y)) / 2) * d3 / (o3 * o3)) && (i3 *= m2 = Math.sqrt(m2), o3 *= m2), f3 = i3 * i3, m2 = o3 * o3, S2 = (f3 = (r3 === s3 ? -1 : 1) * Math.sqrt(Math.abs((f3 * m2 - f3 * d3 * d3 - m2 * y2 * y2) / (f3 * d3 * d3 + m2 * y2 * y2)))) * i3 * d3 / o3 + (e3 + n3) / 2, g2 = f3 * -o3 * y2 / i3 + (t2 + a3) / 2, _2 = Math.asin(parseFloat(((t2 - g2) / o3).toFixed(9))), v2 = Math.asin(parseFloat(((a3 - g2) / o3).toFixed(9))), e3 < S2 && (_2 = Math.PI - _2), n3 < S2 && (v2 = Math.PI - v2), _2 < 0 && (_2 = 2 * Math.PI + _2), v2 < 0 && (v2 = 2 * Math.PI + v2), s3 && v2 < _2 && (_2 -= 2 * Math.PI), !s3 && _2 < v2 && (v2 -= 2 * Math.PI));
          var d3, f3, y2, m2 = v2 - _2;
          Math.abs(m2) > 120 * Math.PI / 180 && (d3 = v2, f3 = n3, y2 = a3, v2 = s3 && _2 < v2 ? _2 + 120 * Math.PI / 180 * 1 : _2 + 120 * Math.PI / 180 * -1, n3 = S2 + i3 * Math.cos(v2), a3 = g2 + o3 * Math.sin(v2), c2 = b2(n3, a3, f3, y2, i3, o3, l3, 0, s3, [v2, d3, S2, g2]));
          var m2 = v2 - _2, S2 = Math.cos(_2), g2 = Math.sin(_2), _2 = Math.cos(v2), v2 = Math.sin(v2), m2 = Math.tan(m2 / 4), i3 = 4 / 3 * i3 * m2, o3 = 4 / 3 * o3 * m2, m2 = [e3, t2], S2 = [e3 + i3 * g2, t2 - o3 * S2], _2 = [n3 + i3 * v2, a3 - o3 * _2], a3 = [n3, a3];
          if (S2[0] = 2 * m2[0] - S2[0], S2[1] = 2 * m2[1] - S2[1], u3)
            return [S2, _2, a3].concat(c2);
          var c2 = [S2, _2, a3].concat(c2).join().split(","), E2 = [], x2 = [];
          return c2.forEach(function(e4, t3) {
            t3 % 2 ? x2.push(h2(c2[t3 - 1], c2[t3], p2).y) : x2.push(h2(c2[t3], c2[t3 + 1], p2).x), x2.length === 6 && (E2.push(x2), x2 = []);
          }), E2;
        };
        e2.SVGPathElement.prototype.setAttribute = function(e3, t2) {
          e3 === "d" && (this[d2] = null, this[f2] = null), s2.call(this, e3, t2);
        }, e2.SVGPathElement.prototype.removeAttribute = function(e3, t2) {
          e3 === "d" && (this[d2] = null, this[f2] = null), u2.call(this, e3);
        }, e2.SVGPathElement.prototype.getPathData = function(e3) {
          if (e3 && e3.normalize) {
            if (this[f2])
              return l2(this[f2]);
            this[d2] ? t2 = l2(this[d2]) : (t2 = n2(this.getAttribute("d") || ""), this[d2] = l2(t2));
            e3 = r2((s3 = [], c2 = p2 = h2 = u3 = null, t2.forEach(function(e4) {
              var t3, n3, a3, i3, o3, l3, r3 = e4.type;
              r3 === "M" ? (o3 = e4.values[0], l3 = e4.values[1], s3.push({type: "M", values: [o3, l3]}), u3 = p2 = o3, h2 = c2 = l3) : r3 === "m" ? (o3 = u3 + e4.values[0], l3 = h2 + e4.values[1], s3.push({type: "M", values: [o3, l3]}), u3 = p2 = o3, h2 = c2 = l3) : r3 === "L" ? (o3 = e4.values[0], l3 = e4.values[1], s3.push({type: "L", values: [o3, l3]}), u3 = o3, h2 = l3) : r3 === "l" ? (o3 = u3 + e4.values[0], l3 = h2 + e4.values[1], s3.push({type: "L", values: [o3, l3]}), u3 = o3, h2 = l3) : r3 === "C" ? (t3 = e4.values[0], n3 = e4.values[1], a3 = e4.values[2], i3 = e4.values[3], o3 = e4.values[4], l3 = e4.values[5], s3.push({type: "C", values: [t3, n3, a3, i3, o3, l3]}), u3 = o3, h2 = l3) : r3 === "c" ? (t3 = u3 + e4.values[0], n3 = h2 + e4.values[1], a3 = u3 + e4.values[2], i3 = h2 + e4.values[3], o3 = u3 + e4.values[4], l3 = h2 + e4.values[5], s3.push({type: "C", values: [t3, n3, a3, i3, o3, l3]}), u3 = o3, h2 = l3) : r3 === "Q" ? (t3 = e4.values[0], n3 = e4.values[1], o3 = e4.values[2], l3 = e4.values[3], s3.push({type: "Q", values: [t3, n3, o3, l3]}), u3 = o3, h2 = l3) : r3 === "q" ? (t3 = u3 + e4.values[0], n3 = h2 + e4.values[1], o3 = u3 + e4.values[2], l3 = h2 + e4.values[3], s3.push({type: "Q", values: [t3, n3, o3, l3]}), u3 = o3, h2 = l3) : r3 === "A" ? (o3 = e4.values[5], l3 = e4.values[6], s3.push({type: "A", values: [e4.values[0], e4.values[1], e4.values[2], e4.values[3], e4.values[4], o3, l3]}), u3 = o3, h2 = l3) : r3 === "a" ? (o3 = u3 + e4.values[5], l3 = h2 + e4.values[6], s3.push({type: "A", values: [e4.values[0], e4.values[1], e4.values[2], e4.values[3], e4.values[4], o3, l3]}), u3 = o3, h2 = l3) : r3 === "H" ? (o3 = e4.values[0], s3.push({type: "H", values: [o3]}), u3 = o3) : r3 === "h" ? (o3 = u3 + e4.values[0], s3.push({type: "H", values: [o3]}), u3 = o3) : r3 === "V" ? (l3 = e4.values[0], s3.push({type: "V", values: [l3]}), h2 = l3) : r3 === "v" ? (l3 = h2 + e4.values[0], s3.push({type: "V", values: [l3]}), h2 = l3) : r3 === "S" ? (a3 = e4.values[0], i3 = e4.values[1], o3 = e4.values[2], l3 = e4.values[3], s3.push({type: "S", values: [a3, i3, o3, l3]}), u3 = o3, h2 = l3) : r3 === "s" ? (a3 = u3 + e4.values[0], i3 = h2 + e4.values[1], o3 = u3 + e4.values[2], l3 = h2 + e4.values[3], s3.push({type: "S", values: [a3, i3, o3, l3]}), u3 = o3, h2 = l3) : r3 === "T" ? (o3 = e4.values[0], l3 = e4.values[1], s3.push({type: "T", values: [o3, l3]}), u3 = o3, h2 = l3) : r3 === "t" ? (o3 = u3 + e4.values[0], l3 = h2 + e4.values[1], s3.push({type: "T", values: [o3, l3]}), u3 = o3, h2 = l3) : r3 !== "Z" && r3 !== "z" || (s3.push({type: "Z", values: []}), u3 = p2, h2 = c2);
            }), s3));
            return this[f2] = l2(e3), e3;
          }
          if (this[d2])
            return l2(this[d2]);
          var s3, u3, h2, p2, c2, t2 = n2(this.getAttribute("d") || "");
          return this[d2] = l2(t2), t2;
        }, e2.SVGPathElement.prototype.setPathData = function(e3) {
          if (e3.length === 0)
            o2 ? this.setAttribute("d", "") : this.removeAttribute("d");
          else {
            for (var t2 = "", n3 = 0, a3 = e3.length; n3 < a3; n3 += 1) {
              var i3 = e3[n3];
              0 < n3 && (t2 += " "), t2 += i3.type, i3.values && 0 < i3.values.length && (t2 += " " + i3.values.join(" "));
            }
            this.setAttribute("d", t2);
          }
        }, e2.SVGRectElement.prototype.getPathData = function(e3) {
          var t2 = this.x.baseVal.value, n3 = this.y.baseVal.value, a3 = this.width.baseVal.value, i3 = this.height.baseVal.value, o3 = (this.hasAttribute("rx") ? this.rx : this.ry).baseVal.value, l3 = (this.hasAttribute("ry") ? this.ry : this.rx).baseVal.value, n3 = (n3 = [{type: "M", values: [t2 + (o3 = a3 / 2 < o3 ? a3 / 2 : o3), n3]}, {type: "H", values: [t2 + a3 - o3]}, {type: "A", values: [o3, l3 = i3 / 2 < l3 ? i3 / 2 : l3, 0, 0, 1, t2 + a3, n3 + l3]}, {type: "V", values: [n3 + i3 - l3]}, {type: "A", values: [o3, l3, 0, 0, 1, t2 + a3 - o3, n3 + i3]}, {type: "H", values: [t2 + o3]}, {type: "A", values: [o3, l3, 0, 0, 1, t2, n3 + i3 - l3]}, {type: "V", values: [n3 + l3]}, {type: "A", values: [o3, l3, 0, 0, 1, t2 + o3, n3]}, {type: "Z", values: []}]).filter(function(e4) {
            return e4.type !== "A" || e4.values[0] !== 0 && e4.values[1] !== 0;
          });
          return n3 = e3 && e3.normalize === true ? r2(n3) : n3;
        }, e2.SVGCircleElement.prototype.getPathData = function(e3) {
          var t2 = this.cx.baseVal.value, n3 = this.cy.baseVal.value, a3 = this.r.baseVal.value, n3 = [{type: "M", values: [t2 + a3, n3]}, {type: "A", values: [a3, a3, 0, 0, 1, t2, n3 + a3]}, {type: "A", values: [a3, a3, 0, 0, 1, t2 - a3, n3]}, {type: "A", values: [a3, a3, 0, 0, 1, t2, n3 - a3]}, {type: "A", values: [a3, a3, 0, 0, 1, t2 + a3, n3]}, {type: "Z", values: []}];
          return n3 = e3 && e3.normalize === true ? r2(n3) : n3;
        }, e2.SVGEllipseElement.prototype.getPathData = function(e3) {
          var t2 = this.cx.baseVal.value, n3 = this.cy.baseVal.value, a3 = this.rx.baseVal.value, i3 = this.ry.baseVal.value, n3 = [{type: "M", values: [t2 + a3, n3]}, {type: "A", values: [a3, i3, 0, 0, 1, t2, n3 + i3]}, {type: "A", values: [a3, i3, 0, 0, 1, t2 - a3, n3]}, {type: "A", values: [a3, i3, 0, 0, 1, t2, n3 - i3]}, {type: "A", values: [a3, i3, 0, 0, 1, t2 + a3, n3]}, {type: "Z", values: []}];
          return n3 = e3 && e3.normalize === true ? r2(n3) : n3;
        }, e2.SVGLineElement.prototype.getPathData = function() {
          return [{type: "M", values: [this.x1.baseVal.value, this.y1.baseVal.value]}, {type: "L", values: [this.x2.baseVal.value, this.y2.baseVal.value]}];
        }, e2.SVGPolylineElement.prototype.getPathData = function() {
          for (var e3 = [], t2 = 0; t2 < this.points.numberOfItems; t2 += 1) {
            var n3 = this.points.getItem(t2);
            e3.push({type: t2 === 0 ? "M" : "L", values: [n3.x, n3.y]});
          }
          return e3;
        }, e2.SVGPolygonElement.prototype.getPathData = function() {
          for (var e3 = [], t2 = 0; t2 < this.points.numberOfItems; t2 += 1) {
            var n3 = this.points.getItem(t2);
            e3.push({type: t2 === 0 ? "M" : "L", values: [n3.x, n3.y]});
          }
          return e3.push({type: "Z", values: []}), e3;
        };
      }();
    }, S = (a = {}, Ee.m = n = [function(e2, t2, n2) {
      n2.r(t2);
      var a2 = 500, i2 = [], o2 = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(e3) {
        return setTimeout(e3, 1e3 / 60);
      }, l2 = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(e3) {
        return clearTimeout(e3);
      }, r2 = Date.now(), s2 = void 0;
      function u2() {
        var n3 = void 0, e3 = void 0;
        s2 && (l2.call(window, s2), s2 = null), i2.forEach(function(e4) {
          var t3;
          (t3 = e4.event) && (e4.event = null, e4.listener(t3), n3 = true);
        }), n3 ? (r2 = Date.now(), e3 = true) : Date.now() - r2 < a2 && (e3 = true), e3 && (s2 = o2.call(window, u2));
      }
      function h2(n3) {
        var a3 = -1;
        return i2.some(function(e3, t3) {
          return e3.listener === n3 && (a3 = t3, true);
        }), a3;
      }
      t2.default = {add: function(e3) {
        var t3 = void 0;
        return h2(e3) === -1 ? (i2.push(t3 = {listener: e3}), function(e4) {
          t3.event = e4, s2 || u2();
        }) : null;
      }, remove: function(e3) {
        -1 < (e3 = h2(e3)) && (i2.splice(e3, 1), !i2.length && s2 && (l2.call(window, s2), s2 = null));
      }};
    }], Ee.c = a, Ee.d = function(e2, t2, n2) {
      Ee.o(e2, t2) || Object.defineProperty(e2, t2, {enumerable: true, get: n2});
    }, Ee.r = function(e2) {
      typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e2, "__esModule", {value: true});
    }, Ee.t = function(t2, e2) {
      if (1 & e2 && (t2 = Ee(t2)), 8 & e2)
        return t2;
      if (4 & e2 && typeof t2 == "object" && t2 && t2.__esModule)
        return t2;
      var n2 = Object.create(null);
      if (Ee.r(n2), Object.defineProperty(n2, "default", {enumerable: true, value: t2}), 2 & e2 && typeof t2 != "string")
        for (var a2 in t2)
          Ee.d(n2, a2, function(e3) {
            return t2[e3];
          }.bind(null, a2));
      return n2;
    }, Ee.n = function(e2) {
      var t2 = e2 && e2.__esModule ? function() {
        return e2.default;
      } : function() {
        return e2;
      };
      return Ee.d(t2, "a", t2), t2;
    }, Ee.o = function(e2, t2) {
      return Object.prototype.hasOwnProperty.call(e2, t2);
    }, Ee.p = "", Ee(Ee.s = 0).default), de = {line_altColor: {iniValue: false}, line_color: {}, line_colorTra: {iniValue: false}, line_strokeWidth: {}, plug_enabled: {iniValue: false}, plug_enabledSE: {hasSE: true, iniValue: false}, plug_plugSE: {hasSE: true, iniValue: Y}, plug_colorSE: {hasSE: true}, plug_colorTraSE: {hasSE: true, iniValue: false}, plug_markerWidthSE: {hasSE: true}, plug_markerHeightSE: {hasSE: true}, lineOutline_enabled: {iniValue: false}, lineOutline_color: {}, lineOutline_colorTra: {iniValue: false}, lineOutline_strokeWidth: {}, lineOutline_inStrokeWidth: {}, plugOutline_enabledSE: {hasSE: true, iniValue: false}, plugOutline_plugSE: {hasSE: true, iniValue: Y}, plugOutline_colorSE: {hasSE: true}, plugOutline_colorTraSE: {hasSE: true, iniValue: false}, plugOutline_strokeWidthSE: {hasSE: true}, plugOutline_inStrokeWidthSE: {hasSE: true}, position_socketXYSE: {hasSE: true, hasProps: true}, position_plugOverheadSE: {hasSE: true}, position_path: {}, position_lineStrokeWidth: {}, position_socketGravitySE: {hasSE: true}, path_pathData: {}, path_edge: {hasProps: true}, viewBox_bBox: {hasProps: true}, viewBox_plugBCircleSE: {hasSE: true}, lineMask_enabled: {iniValue: false}, lineMask_outlineMode: {iniValue: false}, lineMask_x: {}, lineMask_y: {}, lineOutlineMask_x: {}, lineOutlineMask_y: {}, maskBGRect_x: {}, maskBGRect_y: {}, capsMaskAnchor_enabledSE: {hasSE: true, iniValue: false}, capsMaskAnchor_pathDataSE: {hasSE: true}, capsMaskAnchor_strokeWidthSE: {hasSE: true}, capsMaskMarker_enabled: {iniValue: false}, capsMaskMarker_enabledSE: {hasSE: true, iniValue: false}, capsMaskMarker_plugSE: {hasSE: true, iniValue: Y}, capsMaskMarker_markerWidthSE: {hasSE: true}, capsMaskMarker_markerHeightSE: {hasSE: true}, caps_enabled: {iniValue: false}, attach_plugSideLenSE: {hasSE: true}, attach_plugBackLenSE: {hasSE: true}}, fe = {show_on: {}, show_effect: {}, show_animOptions: {}, show_animId: {}, show_inAnim: {}}, ye = "fade", me = [], Se = {}, ge = 0, _e = {}, ve = 0;
    function Ee(e2) {
      if (a[e2])
        return a[e2].exports;
      var t2 = a[e2] = {i: e2, l: false, exports: {}};
      return n[e2].call(t2.exports, t2, t2.exports, Ee), t2.l = true, t2.exports;
    }
    function xe() {
      var i2 = Date.now(), o2 = false;
      e && (r.call(window, e), e = null), E.forEach(function(e2) {
        var t2, n2, a2;
        if (e2.framesStart) {
          if ((t2 = i2 - e2.framesStart) >= e2.duration && e2.count && e2.loopsLeft <= 1)
            return a2 = e2.frames[e2.lastFrame = e2.reverse ? 0 : e2.frames.length - 1], e2.frameCallback(a2.value, true, a2.timeRatio, a2.outputRatio), void (e2.framesStart = null);
          if (t2 > e2.duration) {
            if (n2 = Math.floor(t2 / e2.duration), e2.count) {
              if (n2 >= e2.loopsLeft)
                return a2 = e2.frames[e2.lastFrame = e2.reverse ? 0 : e2.frames.length - 1], e2.frameCallback(a2.value, true, a2.timeRatio, a2.outputRatio), void (e2.framesStart = null);
              e2.loopsLeft -= n2;
            }
            e2.framesStart += e2.duration * n2, t2 = i2 - e2.framesStart;
          }
          e2.reverse && (t2 = e2.duration - t2), a2 = e2.frames[e2.lastFrame = Math.round(t2 / v)], e2.frameCallback(a2.value, false, a2.timeRatio, a2.outputRatio) !== false ? o2 = true : e2.framesStart = null;
        }
      }), o2 && (e = l.call(window, xe));
    }
    function be(e2, t2) {
      e2.framesStart = Date.now(), t2 != null && (e2.framesStart -= e2.duration * (e2.reverse ? 1 - t2 : t2)), e2.loopsLeft = e2.count, e2.lastFrame = null, xe();
    }
    function ke(t2, n2) {
      var e2, a2;
      return typeof t2 != typeof n2 || (e2 = he(t2) ? "obj" : Array.isArray(t2) ? "array" : "") != (he(n2) ? "obj" : Array.isArray(n2) ? "array" : "") || (e2 === "obj" ? ke(a2 = Object.keys(t2).sort(), Object.keys(n2).sort()) || a2.some(function(e3) {
        return ke(t2[e3], n2[e3]);
      }) : e2 === "array" ? t2.length !== n2.length || t2.some(function(e3, t3) {
        return ke(e3, n2[t3]);
      }) : t2 !== n2);
    }
    function we(n2) {
      return n2 && (he(n2) ? Object.keys(n2).reduce(function(e2, t2) {
        return e2[t2] = we(n2[t2]), e2;
      }, {}) : Array.isArray(n2) ? n2.map(we) : n2);
    }
    function Oe(e2) {
      var t2, n2, a2, i2 = 1, o2 = e2 = (e2 + "").trim();
      function l2(e3) {
        var t3 = 1, e3 = m.exec(e3);
        return e3 && (t3 = parseFloat(e3[1]), e3[2] ? t3 = 0 <= t3 && t3 <= 100 ? t3 / 100 : 1 : (t3 < 0 || 1 < t3) && (t3 = 1)), t3;
      }
      return (t2 = /^(rgba|hsla|hwb|gray|device\-cmyk)\s*\(([\s\S]+)\)$/i.exec(e2)) ? (n2 = t2[1].toLowerCase(), a2 = t2[2].trim().split(/\s*,\s*/), n2 === "rgba" && a2.length === 4 ? (i2 = l2(a2[3]), o2 = "rgb(" + a2.slice(0, 3).join(", ") + ")") : n2 === "hsla" && a2.length === 4 ? (i2 = l2(a2[3]), o2 = "hsl(" + a2.slice(0, 3).join(", ") + ")") : n2 === "hwb" && a2.length === 4 ? (i2 = l2(a2[3]), o2 = "hwb(" + a2.slice(0, 3).join(", ") + ")") : n2 === "gray" && a2.length === 2 ? (i2 = l2(a2[1]), o2 = "gray(" + a2[0] + ")") : n2 === "device-cmyk" && 5 <= a2.length && (i2 = l2(a2[4]), o2 = "device-cmyk(" + a2.slice(0, 4).join(", ") + ")")) : (t2 = /^\#(?:([\da-f]{6})([\da-f]{2})|([\da-f]{3})([\da-f]))$/i.exec(e2)) ? o2 = t2[1] ? (i2 = parseInt(t2[2], 16) / 255, "#" + t2[1]) : (i2 = parseInt(t2[4] + t2[4], 16) / 255, "#" + t2[3]) : e2.toLocaleLowerCase() === "transparent" && (i2 = 0), [i2, o2];
    }
    function Me(e2) {
      return !(!e2 || e2.nodeType !== Node.ELEMENT_NODE || typeof e2.getBoundingClientRect != "function");
    }
    function Ie(e2, t2) {
      var n2, a2, i2, o2 = {};
      if (!(i2 = e2.ownerDocument))
        return console.error("Cannot get document that contains the element."), null;
      if (e2.compareDocumentPosition(i2) & Node.DOCUMENT_POSITION_DISCONNECTED)
        return console.error("A disconnected element was passed."), null;
      for (a2 in n2 = e2.getBoundingClientRect())
        o2[a2] = n2[a2];
      if (!t2) {
        if (!(i2 = i2.defaultView))
          return console.error("Cannot get window that contains the element."), null;
        o2.left += i2.pageXOffset, o2.right += i2.pageXOffset, o2.top += i2.pageYOffset, o2.bottom += i2.pageYOffset;
      }
      return o2;
    }
    function Ce(e2, t2) {
      var n2, a2 = [], i2 = e2;
      for (t2 = t2 || window; ; ) {
        if (!(n2 = i2.ownerDocument))
          return console.error("Cannot get document that contains the element."), null;
        if (!(n2 = n2.defaultView))
          return console.error("Cannot get window that contains the element."), null;
        if (n2 === t2)
          break;
        if (!(i2 = n2.frameElement))
          return console.error("`baseWindow` was not found."), null;
        a2.unshift(i2);
      }
      return a2;
    }
    function Le(e2, t2) {
      var a2 = 0, i2 = 0;
      return (t2 = Ce(e2, t2 = t2 || window)) ? t2.length ? (t2.forEach(function(e3, t3) {
        var n2 = Ie(e3, 0 < t3);
        a2 += n2.left, i2 += n2.top, e3 = (t3 = e3).ownerDocument.defaultView.getComputedStyle(t3, ""), n2 = {left: t3.clientLeft + parseFloat(e3.paddingLeft), top: t3.clientTop + parseFloat(e3.paddingTop)}, a2 += n2.left, i2 += n2.top;
      }), (t2 = Ie(e2, true)).left += a2, t2.right += a2, t2.top += i2, t2.bottom += i2, t2) : Ie(e2) : null;
    }
    function Ae(e2, t2) {
      var n2 = e2.x - t2.x, t2 = e2.y - t2.y;
      return Math.sqrt(n2 * n2 + t2 * t2);
    }
    function Ve(e2, t2, n2) {
      var a2 = t2.x - e2.x, t2 = t2.y - e2.y;
      return {x: e2.x + a2 * n2, y: e2.y + t2 * n2, angle: Math.atan2(t2, a2) / (Math.PI / 180)};
    }
    function Pe(e2, t2, n2) {
      e2 = Math.atan2(e2.y - t2.y, t2.x - e2.x);
      return {x: t2.x + Math.cos(e2) * n2, y: t2.y + Math.sin(e2) * n2 * -1};
    }
    function Ne(e2, t2, n2, a2, i2) {
      var o2 = i2 * i2, l2 = o2 * i2, r2 = 1 - i2, s2 = r2 * r2, u2 = s2 * r2, h2 = u2 * e2.x + 3 * s2 * i2 * t2.x + 3 * r2 * o2 * n2.x + l2 * a2.x, p2 = u2 * e2.y + 3 * s2 * i2 * t2.y + 3 * r2 * o2 * n2.y + l2 * a2.y, c2 = e2.x + 2 * i2 * (t2.x - e2.x) + o2 * (n2.x - 2 * t2.x + e2.x), u2 = e2.y + 2 * i2 * (t2.y - e2.y) + o2 * (n2.y - 2 * t2.y + e2.y), s2 = t2.x + 2 * i2 * (n2.x - t2.x) + o2 * (a2.x - 2 * n2.x + t2.x), l2 = t2.y + 2 * i2 * (n2.y - t2.y) + o2 * (a2.y - 2 * n2.y + t2.y), o2 = r2 * e2.x + i2 * t2.x, e2 = r2 * e2.y + i2 * t2.y, t2 = r2 * n2.x + i2 * a2.x, i2 = r2 * n2.y + i2 * a2.y, a2 = 90 - 180 * Math.atan2(c2 - s2, u2 - l2) / Math.PI;
      return {x: h2, y: p2, fromP2: {x: c2, y: u2}, toP1: {x: s2, y: l2}, fromP1: {x: o2, y: e2}, toP2: {x: t2, y: i2}, angle: a2 += 180 < a2 ? -180 : 180};
    }
    function Te(n2, a2, i2, o2, e2) {
      function l2(e3, t2, n3, a3, i3) {
        return e3 * (e3 * (-3 * t2 + 9 * n3 - 9 * a3 + 3 * i3) + 6 * t2 - 12 * n3 + 6 * a3) - 3 * t2 + 3 * n3;
      }
      var r2, s2, u2 = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472], h2 = 0, p2 = (e2 = e2 == null || 1 < e2 ? 1 : e2 < 0 ? 0 : e2) / 2;
      return [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816].forEach(function(e3, t2) {
        r2 = l2(s2 = p2 * e3 + p2, n2.x, a2.x, i2.x, o2.x), s2 = l2(s2, n2.y, a2.y, i2.y, o2.y), s2 = r2 * r2 + s2 * s2, h2 += u2[t2] * Math.sqrt(s2);
      }), p2 * h2;
    }
    function We(e2, t2, n2, a2, i2) {
      for (var o2, l2 = 0.5, r2 = 1 - l2; o2 = Te(e2, t2, n2, a2, r2), !(Math.abs(o2 - i2) <= 0.01); )
        r2 += (o2 < i2 ? 1 : -1) * (l2 /= 2);
      return r2;
    }
    function Be(e2, t2) {
      var n2;
      return e2.forEach(function(e3) {
        e3 = t2 ? e3.map(function(e4) {
          e4 = {x: e4.x, y: e4.y};
          return t2(e4), e4;
        }) : e3;
        (n2 = n2 || [{type: "M", values: [e3[0].x, e3[0].y]}]).push(e3.length ? e3.length === 2 ? {type: "L", values: [e3[1].x, e3[1].y]} : {type: "C", values: [e3[1].x, e3[1].y, e3[2].x, e3[2].y, e3[3].x, e3[3].y]} : {type: "Z", values: []});
      }), n2;
    }
    function Re(e2) {
      var t2 = [], n2 = 0;
      return e2.forEach(function(e3) {
        e3 = (e3.length === 2 ? Ae : Te).apply(null, e3);
        t2.push(e3), n2 += e3;
      }), {segsLen: t2, lenAll: n2};
    }
    function Fe(e2, a2) {
      return e2 == null || a2 == null || e2.length !== a2.length || e2.some(function(e3, t2) {
        var n2 = a2[t2];
        return e3.type !== n2.type || e3.values.some(function(e4, t3) {
          return e4 !== n2.values[t3];
        });
      });
    }
    function Ge(e2, t2, n2) {
      e2.events[t2] ? e2.events[t2].indexOf(n2) < 0 && e2.events[t2].push(n2) : e2.events[t2] = [n2];
    }
    function De(e2, t2, n2) {
      var a2;
      e2.events[t2] && -1 < (a2 = e2.events[t2].indexOf(n2)) && e2.events[t2].splice(a2, 1);
    }
    function ze(e2) {
      t && clearTimeout(t), me.push(e2), t = setTimeout(function() {
        me.forEach(function(e3) {
          e3();
        }), me = [];
      }, 0);
    }
    function je(e2, t2) {
      e2.reflowTargets.indexOf(t2) < 0 && e2.reflowTargets.push(t2);
    }
    function He(e2) {
      e2.reflowTargets.forEach(function(e3) {
        var n2;
        n2 = e3, setTimeout(function() {
          var e4 = n2.parentNode, t2 = n2.nextSibling;
          e4.insertBefore(e4.removeChild(n2), t2);
        }, 0);
      }), e2.reflowTargets = [];
    }
    function Ue(e2, t2, n2, a2, i2, o2, l2) {
      var r2;
      n2 === "auto-start-reverse" ? (typeof s != "boolean" && (t2.setAttribute("orient", "auto-start-reverse"), s = t2.orientType.baseVal === SVGMarkerElement.SVG_MARKER_ORIENT_UNKNOWN), s ? t2.setAttribute("orient", n2) : ((r2 = i2.createSVGTransform()).setRotate(180, 0, 0), o2.transform.baseVal.appendItem(r2), t2.setAttribute("orient", "auto"), r2 = true)) : (t2.setAttribute("orient", n2), s === false && o2.transform.baseVal.clear()), t2 = t2.viewBox.baseVal, r2 ? (t2.x = -a2.right, t2.y = -a2.bottom) : (t2.x = a2.left, t2.y = a2.top), t2.width = a2.width, t2.height = a2.height, ie && je(e2, l2);
    }
    function Ze(e2, t2) {
      return {prop: e2 ? "markerEnd" : "markerStart", orient: t2 ? t2.noRotate ? "0" : e2 ? "auto" : "auto-start-reverse" : null};
    }
    function Ye(n2, a2) {
      Object.keys(a2).forEach(function(e2) {
        var t2 = a2[e2];
        n2[e2] = t2.iniValue != null ? t2.hasSE ? [t2.iniValue, t2.iniValue] : t2.iniValue : t2.hasSE ? t2.hasProps ? [{}, {}] : [] : t2.hasProps ? {} : null;
      });
    }
    function Xe(t2, e2, n2, a2, i2) {
      return a2 !== e2[n2] && (e2[n2] = a2, i2 && i2.forEach(function(e3) {
        e3(t2, a2, n2);
      }), true);
    }
    function qe(e2) {
      function t2(e3, t3) {
        return e3 + parseFloat(t3);
      }
      var n2 = e2.document, a2 = e2.getComputedStyle(n2.documentElement, ""), e2 = e2.getComputedStyle(n2.body, ""), n2 = {x: 0, y: 0};
      return e2.position !== "static" ? (n2.x -= [a2.marginLeft, a2.borderLeftWidth, a2.paddingLeft, e2.marginLeft, e2.borderLeftWidth].reduce(t2, 0), n2.y -= [a2.marginTop, a2.borderTopWidth, a2.paddingTop, e2.marginTop, e2.borderTopWidth].reduce(t2, 0)) : a2.position !== "static" && (n2.x -= [a2.marginLeft, a2.borderLeftWidth].reduce(t2, 0), n2.y -= [a2.marginTop, a2.borderTopWidth].reduce(t2, 0)), n2;
    }
    function Qe(e2) {
      var t2, n2 = e2.document;
      n2.getElementById(f) || (t2 = new e2.DOMParser().parseFromString(y, "image/svg+xml"), n2.body.appendChild(t2.documentElement), ce(e2));
    }
    function Ke(l2) {
      var g2, c2, _2, e2, n2, a2, i2, d2, o2, r2, s2, t2, u2, h2, p2 = l2.options, f2 = l2.curStats, y2 = l2.aplStats, v2 = f2.position_socketXYSE, m2 = false;
      function S2(e3, t3) {
        e3 = t3 === b ? {x: e3.left + e3.width / 2, y: e3.top} : t3 === k ? {x: e3.right, y: e3.top + e3.height / 2} : t3 === L ? {x: e3.left + e3.width / 2, y: e3.bottom} : {x: e3.left, y: e3.top + e3.height / 2};
        return e3.socketId = t3, e3;
      }
      function E2(e3) {
        return {x: e3.x, y: e3.y};
      }
      if (f2.position_path = p2.path, f2.position_lineStrokeWidth = f2.line_strokeWidth, f2.position_socketGravitySE = g2 = we(p2.socketGravitySE), c2 = [0, 1].map(function(e3) {
        var t3 = p2.anchorSE[e3], n3 = l2.optionIsAttach.anchorSE[e3], a3 = n3 !== false ? _e[t3._id] : null, i3 = n3 !== false && a3.conf.getStrokeWidth ? a3.conf.getStrokeWidth(a3, l2) : 0, o3 = n3 !== false && a3.conf.getBBoxNest ? a3.conf.getBBoxNest(a3, l2, i3) : Le(t3, l2.baseWindow);
        return f2.capsMaskAnchor_pathDataSE[e3] = n3 !== false && a3.conf.getPathData ? a3.conf.getPathData(a3, l2, i3) : (n3 = (t3 = o3).right != null ? t3.right : t3.left + t3.width, a3 = t3.bottom != null ? t3.bottom : t3.top + t3.height, [{type: "M", values: [t3.left, t3.top]}, {type: "L", values: [n3, t3.top]}, {type: "L", values: [n3, a3]}, {type: "L", values: [t3.left, a3]}, {type: "Z", values: []}]), f2.capsMaskAnchor_strokeWidthSE[e3] = i3, o3;
      }), i2 = -1, p2.socketSE[0] && p2.socketSE[1] ? (v2[0] = S2(c2[0], p2.socketSE[0]), v2[1] = S2(c2[1], p2.socketSE[1])) : (p2.socketSE[0] || p2.socketSE[1] ? (a2 = p2.socketSE[0] ? (n2 = 0, 1) : (n2 = 1, 0), v2[n2] = S2(c2[n2], p2.socketSE[n2]), (e2 = G.map(function(e3) {
        return S2(c2[a2], e3);
      })).forEach(function(e3) {
        var t3 = Ae(e3, v2[n2]);
        (t3 < i2 || i2 === -1) && (v2[a2] = e3, i2 = t3);
      })) : (e2 = G.map(function(e3) {
        return S2(c2[1], e3);
      }), G.map(function(e3) {
        return S2(c2[0], e3);
      }).forEach(function(n3) {
        e2.forEach(function(e3) {
          var t3 = Ae(n3, e3);
          (t3 < i2 || i2 === -1) && (v2[0] = n3, v2[1] = e3, i2 = t3);
        });
      })), [0, 1].forEach(function(e3) {
        var t3, n3;
        p2.socketSE[e3] || (c2[e3].width || c2[e3].height ? c2[e3].width || v2[e3].socketId !== A && v2[e3].socketId !== k ? c2[e3].height || v2[e3].socketId !== b && v2[e3].socketId !== L || (v2[e3].socketId = 0 <= v2[e3 ? 0 : 1].y - c2[e3].top ? L : b) : v2[e3].socketId = 0 <= v2[e3 ? 0 : 1].x - c2[e3].left ? k : A : (t3 = v2[e3 ? 0 : 1].x - c2[e3].left, n3 = v2[e3 ? 0 : 1].y - c2[e3].top, v2[e3].socketId = Math.abs(t3) >= Math.abs(n3) ? 0 <= t3 ? k : A : 0 <= n3 ? L : b));
      })), f2.position_path !== y2.position_path || f2.position_lineStrokeWidth !== y2.position_lineStrokeWidth || [0, 1].some(function(e3) {
        return f2.position_plugOverheadSE[e3] !== y2.position_plugOverheadSE[e3] || (t3 = v2[e3], n3 = y2.position_socketXYSE[e3], t3.x !== n3.x || t3.y !== n3.y || t3.socketId !== n3.socketId) || (t3 = g2[e3], n3 = y2.position_socketGravitySE[e3], (e3 = t3 == null ? "auto" : Array.isArray(t3) ? "array" : "number") != (n3 == null ? "auto" : Array.isArray(n3) ? "array" : "number") || (e3 == "array" ? t3[0] !== n3[0] || t3[1] !== n3[1] : t3 !== n3));
        var t3, n3;
      })) {
        switch (l2.pathList.baseVal = _2 = [], l2.pathList.animVal = null, f2.position_path) {
          case P:
            _2.push([E2(v2[0]), E2(v2[1])]);
            break;
          case N:
            t2 = typeof g2[0] == "number" && 0 < g2[0] || typeof g2[1] == "number" && 0 < g2[1], u2 = ne * (t2 ? -1 : 1), h2 = Math.atan2(v2[1].y - v2[0].y, v2[1].x - v2[0].x), t2 = u2 - h2, h2 = Math.PI - h2 - u2, u2 = Ae(v2[0], v2[1]) / Math.sqrt(2) * te, t2 = {x: v2[0].x + Math.cos(t2) * u2, y: v2[0].y + Math.sin(t2) * u2 * -1}, u2 = {x: v2[1].x + Math.cos(h2) * u2, y: v2[1].y + Math.sin(h2) * u2 * -1}, _2.push([E2(v2[0]), t2, u2, E2(v2[1])]);
            break;
          case T:
          case W:
            o2 = [g2[0], f2.position_path === W ? 0 : g2[1]], r2 = [], s2 = [], v2.forEach(function(e3, t3) {
              var n3, a3 = o2[t3], i3 = Array.isArray(a3) ? {x: a3[0], y: a3[1]} : typeof a3 == "number" ? e3.socketId === b ? {x: 0, y: -a3} : e3.socketId === k ? {x: a3, y: 0} : e3.socketId === L ? {x: 0, y: a3} : {x: -a3, y: 0} : (n3 = v2[t3 ? 0 : 1], a3 = 0 < (a3 = f2.position_plugOverheadSE[t3]) ? U + (K < a3 ? (a3 - K) * J : 0) : z + (f2.position_lineStrokeWidth > j ? (f2.position_lineStrokeWidth - j) * H : 0), e3.socketId === b ? {x: 0, y: -(i3 = (i3 = (e3.y - n3.y) / 2) < a3 ? a3 : i3)} : e3.socketId === k ? {x: i3 = (i3 = (n3.x - e3.x) / 2) < a3 ? a3 : i3, y: 0} : e3.socketId === L ? {x: 0, y: i3 = (i3 = (n3.y - e3.y) / 2) < a3 ? a3 : i3} : {x: -(i3 = (i3 = (e3.x - n3.x) / 2) < a3 ? a3 : i3), y: 0});
              r2[t3] = e3.x + i3.x, s2[t3] = e3.y + i3.y;
            }), _2.push([E2(v2[0]), {x: r2[0], y: s2[0]}, {x: r2[1], y: s2[1]}, E2(v2[1])]);
            break;
          case B:
            !function() {
              var n3, i3 = 1, l3 = 2, r3 = 3, o3 = 4, s3 = [[], []], u3 = [];
              function h3(e3) {
                return e3 === i3 ? r3 : e3 === l3 ? o3 : e3 === r3 ? i3 : l3;
              }
              function p3(e3) {
                return e3 === l3 || e3 === o3 ? "x" : "y";
              }
              function c3(e3, t3, n4) {
                var a3 = {x: e3.x, y: e3.y};
                if (n4) {
                  if (n4 === h3(e3.dirId))
                    throw new Error("Invalid dirId: " + n4);
                  a3.dirId = n4;
                } else
                  a3.dirId = e3.dirId;
                return a3.dirId === i3 ? a3.y -= t3 : a3.dirId === l3 ? a3.x += t3 : a3.dirId === r3 ? a3.y += t3 : a3.x -= t3, a3;
              }
              function d3(e3, t3) {
                return t3.dirId === i3 ? e3.y <= t3.y : t3.dirId === l3 ? e3.x >= t3.x : t3.dirId === r3 ? e3.y >= t3.y : e3.x <= t3.x;
              }
              function f3(e3, t3) {
                return t3.dirId === i3 || t3.dirId === r3 ? e3.x === t3.x : e3.y === t3.y;
              }
              function y3(e3) {
                return e3[0] ? {contain: 0, notContain: 1} : {contain: 1, notContain: 0};
              }
              function m3(e3, t3, n4) {
                return Math.abs(t3[n4] - e3[n4]);
              }
              function S3(e3, t3, n4) {
                return n4 === "x" ? e3.x < t3.x ? l3 : o3 : e3.y < t3.y ? r3 : i3;
              }
              for (v2.forEach(function(e3, t3) {
                var n4 = E2(e3), a3 = g2[t3];
                e3 = Array.isArray(a3) ? a3[0] < 0 ? [o3, -a3[0]] : 0 < a3[0] ? [l3, a3[0]] : a3[1] < 0 ? [i3, -a3[1]] : 0 < a3[1] ? [r3, a3[1]] : [e3.socketId, 0] : typeof a3 != "number" ? [e3.socketId, ee] : 0 <= a3 ? [e3.socketId, a3] : [h3(e3.socketId), -a3], n4.dirId = e3[0], a3 = e3[1], s3[t3].push(n4), u3[t3] = c3(n4, a3);
              }); function() {
                var e3, t3, a3, i4, n4 = [d3(u3[1], u3[0]), d3(u3[0], u3[1])], o4 = [p3(u3[0].dirId), p3(u3[1].dirId)];
                if (o4[0] === o4[1]) {
                  if (n4[0] && n4[1])
                    return void (f3(u3[1], u3[0]) || (u3[0][o4[0]] === u3[1][o4[1]] ? (s3[0].push(u3[0]), s3[1].push(u3[1])) : (e3 = u3[0][o4[0]] + (u3[1][o4[1]] - u3[0][o4[0]]) / 2, s3[0].push(c3(u3[0], Math.abs(e3 - u3[0][o4[0]]))), s3[1].push(c3(u3[1], Math.abs(e3 - u3[1][o4[1]]))))));
                  n4[0] !== n4[1] ? (t3 = y3(n4), (a3 = m3(u3[t3.notContain], u3[t3.contain], o4[t3.notContain])) < ee && (u3[t3.notContain] = c3(u3[t3.notContain], ee - a3)), s3[t3.notContain].push(u3[t3.notContain]), u3[t3.notContain] = c3(u3[t3.notContain], ee, f3(u3[t3.contain], u3[t3.notContain]) ? o4[t3.notContain] === "x" ? r3 : l3 : S3(u3[t3.notContain], u3[t3.contain], o4[t3.notContain] === "x" ? "y" : "x"))) : (a3 = m3(u3[0], u3[1], o4[0] === "x" ? "y" : "x"), s3.forEach(function(e4, t4) {
                    var n5 = t4 === 0 ? 1 : 0;
                    e4.push(u3[t4]), u3[t4] = c3(u3[t4], ee, 2 * ee <= a3 ? S3(u3[t4], u3[n5], o4[t4] === "x" ? "y" : "x") : o4[t4] === "x" ? r3 : l3);
                  }));
                } else {
                  if (n4[0] && n4[1])
                    return void (f3(u3[1], u3[0]) ? s3[1].push(u3[1]) : f3(u3[0], u3[1]) ? s3[0].push(u3[0]) : s3[0].push(o4[0] === "x" ? {x: u3[1].x, y: u3[0].y} : {x: u3[0].x, y: u3[1].y}));
                  n4[0] !== n4[1] ? (t3 = y3(n4), s3[t3.notContain].push(u3[t3.notContain]), u3[t3.notContain] = c3(u3[t3.notContain], ee, m3(u3[t3.notContain], u3[t3.contain], o4[t3.contain]) >= ee ? S3(u3[t3.notContain], u3[t3.contain], o4[t3.contain]) : u3[t3.contain].dirId)) : (i4 = [{x: u3[0].x, y: u3[0].y}, {x: u3[1].x, y: u3[1].y}], s3.forEach(function(e4, t4) {
                    var n5 = t4 === 0 ? 1 : 0, a4 = m3(i4[t4], i4[n5], o4[t4]);
                    a4 < ee && (u3[t4] = c3(u3[t4], ee - a4)), e4.push(u3[t4]), u3[t4] = c3(u3[t4], ee, S3(u3[t4], u3[n5], o4[n5]));
                  }));
                }
                return 1;
              }(); )
                ;
              s3[1].reverse(), s3[0].concat(s3[1]).forEach(function(e3, t3) {
                e3 = {x: e3.x, y: e3.y};
                0 < t3 && _2.push([n3, e3]), n3 = e3;
              });
            }();
        }
        d2 = [], f2.position_plugOverheadSE.forEach(function(e3, t3) {
          var n3, a3, i3, o3, l3, r3, s3, u3, h3, p3 = !t3;
          0 < e3 ? (n3 = _2[a3 = p3 ? 0 : _2.length - 1]).length === 2 ? (d2[a3] = d2[a3] || Ae.apply(null, n3), d2[a3] > $ && (d2[a3] - e3 < $ && (e3 = d2[a3] - $), s3 = Ve(n3[0], n3[1], (p3 ? e3 : d2[a3] - e3) / d2[a3]), _2[a3] = p3 ? [s3, n3[1]] : [n3[0], s3], d2[a3] -= e3)) : (d2[a3] = d2[a3] || Te.apply(null, n3), d2[a3] > $ && (d2[a3] - e3 < $ && (e3 = d2[a3] - $), s3 = Ne(n3[0], n3[1], n3[2], n3[3], We(n3[0], n3[1], n3[2], n3[3], p3 ? e3 : d2[a3] - e3)), o3 = p3 ? (i3 = n3[0], s3.toP1) : (i3 = n3[3], s3.fromP2), l3 = Math.atan2(i3.y - s3.y, s3.x - i3.x), r3 = Ae(s3, o3), s3.x = i3.x + Math.cos(l3) * e3, s3.y = i3.y + Math.sin(l3) * e3 * -1, o3.x = s3.x + Math.cos(l3) * r3, o3.y = s3.y + Math.sin(l3) * r3 * -1, _2[a3] = p3 ? [s3, s3.toP1, s3.toP2, n3[3]] : [n3[0], s3.fromP1, s3.fromP2, s3], d2[a3] = null)) : e3 < 0 && (n3 = _2[a3 = p3 ? 0 : _2.length - 1], s3 = v2[t3].socketId, t3 = -c2[t3][(u3 = s3 === A || s3 === k ? "x" : "y") == "x" ? "width" : "height"], h3 = (e3 = e3 < t3 ? t3 : e3) * (s3 === A || s3 === b ? -1 : 1), n3.length === 2 ? n3[p3 ? 0 : n3.length - 1][u3] += h3 : (p3 ? [0, 1] : [n3.length - 2, n3.length - 1]).forEach(function(e4) {
            n3[e4][u3] += h3;
          }), d2[a3] = null);
        }), y2.position_socketXYSE = we(v2), y2.position_plugOverheadSE = we(f2.position_plugOverheadSE), y2.position_path = f2.position_path, y2.position_lineStrokeWidth = f2.position_lineStrokeWidth, y2.position_socketGravitySE = we(g2), m2 = true, l2.events.apl_position && l2.events.apl_position.forEach(function(e3) {
          e3(l2, _2);
        });
      }
      return m2;
    }
    function Je(t2, n2) {
      n2 !== t2.isShown && (!!n2 != !!t2.isShown && (t2.svg.style.visibility = n2 ? "" : "hidden"), t2.isShown = n2, t2.events && t2.events.svgShow && t2.events.svgShow.forEach(function(e2) {
        e2(t2, n2);
      }));
    }
    function $e(e2, t2) {
      var n2, a2, h2, p2, c2, d2, f2, i2, o2, l2, r2, s2, u2, y2, m2, S2, g2, _2, v2, E2, x2, b2, k2, w2, O2, M2, I2, C2, L2, A2, V2, P2, N2, T2, W2, B2, R2, F2, G2, D2, z2, j2, H2, U2 = {};
      t2.line && (U2.line = (i2 = (n2 = e2).options, a2 = n2.curStats, o2 = n2.events, l2 = false, l2 = Xe(n2, a2, "line_color", i2.lineColor, o2.cur_line_color) || l2, l2 = Xe(n2, a2, "line_colorTra", Oe(a2.line_color)[0] < 1) || l2, l2 = Xe(n2, a2, "line_strokeWidth", i2.lineSize, o2.cur_line_strokeWidth) || l2)), (t2.plug || U2.line) && (U2.plug = (p2 = (h2 = e2).options, c2 = h2.curStats, d2 = h2.events, f2 = false, [0, 1].forEach(function(e3) {
        var t3, n3, a3, i3, o3, l3, r3, s3, u3 = p2.plugSE[e3];
        f2 = Xe(h2, c2.plug_enabledSE, e3, u3 !== Y) || f2, f2 = Xe(h2, c2.plug_plugSE, e3, u3) || f2, f2 = Xe(h2, c2.plug_colorSE, e3, s3 = p2.plugColorSE[e3] || c2.line_color, d2.cur_plug_colorSE) || f2, f2 = Xe(h2, c2.plug_colorTraSE, e3, Oe(s3)[0] < 1) || f2, u3 !== Y && (i3 = n3 = (t3 = X[q[u3]]).widthR * p2.plugSizeSE[e3], o3 = a3 = t3.heightR * p2.plugSizeSE[e3], re && (i3 *= c2.line_strokeWidth, o3 *= c2.line_strokeWidth), f2 = Xe(h2, c2.plug_markerWidthSE, e3, i3) || f2, f2 = Xe(h2, c2.plug_markerHeightSE, e3, o3) || f2, c2.capsMaskMarker_markerWidthSE[e3] = n3, c2.capsMaskMarker_markerHeightSE[e3] = a3), c2.plugOutline_plugSE[e3] = c2.capsMaskMarker_plugSE[e3] = u3, c2.plug_enabledSE[e3] ? (s3 = c2.line_strokeWidth / ue.lineSize * p2.plugSizeSE[e3], c2.position_plugOverheadSE[e3] = t3.overhead * s3, c2.viewBox_plugBCircleSE[e3] = t3.bCircle * s3, l3 = t3.sideLen * s3, r3 = t3.backLen * s3) : (c2.position_plugOverheadSE[e3] = -c2.line_strokeWidth / 2, c2.viewBox_plugBCircleSE[e3] = l3 = r3 = 0), Xe(h2, c2.attach_plugSideLenSE, e3, l3, d2.cur_attach_plugSideLenSE), Xe(h2, c2.attach_plugBackLenSE, e3, r3, d2.cur_attach_plugBackLenSE), c2.capsMaskAnchor_enabledSE[e3] = !c2.plug_enabledSE[e3];
      }), f2 = Xe(h2, c2, "plug_enabled", c2.plug_enabledSE[0] || c2.plug_enabledSE[1]) || f2)), (t2.lineOutline || U2.line) && (U2.lineOutline = (o2 = (i2 = e2).options, l2 = i2.curStats, k2 = false, k2 = Xe(i2, l2, "lineOutline_enabled", o2.lineOutlineEnabled) || k2, k2 = Xe(i2, l2, "lineOutline_color", o2.lineOutlineColor) || k2, k2 = Xe(i2, l2, "lineOutline_colorTra", Oe(l2.lineOutline_color)[0] < 1) || k2, o2 = l2.line_strokeWidth * o2.lineOutlineSize, k2 = Xe(i2, l2, "lineOutline_strokeWidth", l2.line_strokeWidth - 2 * o2) || k2, k2 = Xe(i2, l2, "lineOutline_inStrokeWidth", l2.lineOutline_colorTra ? l2.lineOutline_strokeWidth + 2 * se : l2.line_strokeWidth - o2) || k2)), (t2.plugOutline || U2.line || U2.plug || U2.lineOutline) && (U2.plugOutline = (s2 = (r2 = e2).options, u2 = r2.curStats, y2 = false, [0, 1].forEach(function(e3) {
        var t3 = u2.plugOutline_plugSE[e3], n3 = t3 !== Y ? X[q[t3]] : null;
        y2 = Xe(r2, u2.plugOutline_enabledSE, e3, s2.plugOutlineEnabledSE[e3] && u2.plug_enabled && u2.plug_enabledSE[e3] && !!n3 && !!n3.outlineBase) || y2, y2 = Xe(r2, u2.plugOutline_colorSE, e3, t3 = s2.plugOutlineColorSE[e3] || u2.lineOutline_color) || y2, y2 = Xe(r2, u2.plugOutline_colorTraSE, e3, Oe(t3)[0] < 1) || y2, n3 && n3.outlineBase && ((t3 = s2.plugOutlineSizeSE[e3]) > n3.outlineMax && (t3 = n3.outlineMax), t3 *= 2 * n3.outlineBase, y2 = Xe(r2, u2.plugOutline_strokeWidthSE, e3, t3) || y2, y2 = Xe(r2, u2.plugOutline_inStrokeWidthSE, e3, u2.plugOutline_colorTraSE[e3] ? t3 - se / (u2.line_strokeWidth / ue.lineSize) / s2.plugSizeSE[e3] * 2 : t3 / 2) || y2);
      }), y2)), (t2.faces || U2.line || U2.plug || U2.lineOutline || U2.plugOutline) && (U2.faces = (g2 = (m2 = e2).curStats, _2 = m2.aplStats, v2 = m2.events, E2 = false, !g2.line_altColor && Xe(m2, _2, "line_color", S2 = g2.line_color, v2.apl_line_color) && (m2.lineFace.style.stroke = S2, E2 = true), Xe(m2, _2, "line_strokeWidth", S2 = g2.line_strokeWidth, v2.apl_line_strokeWidth) && (m2.lineShape.style.strokeWidth = S2 + "px", E2 = true, (oe || ie) && (je(m2, m2.lineShape), ie && (je(m2, m2.lineFace), je(m2, m2.lineMaskCaps)))), Xe(m2, _2, "lineOutline_enabled", S2 = g2.lineOutline_enabled, v2.apl_lineOutline_enabled) && (m2.lineOutlineFace.style.display = S2 ? "inline" : "none", E2 = true), g2.lineOutline_enabled && (Xe(m2, _2, "lineOutline_color", S2 = g2.lineOutline_color, v2.apl_lineOutline_color) && (m2.lineOutlineFace.style.stroke = S2, E2 = true), Xe(m2, _2, "lineOutline_strokeWidth", S2 = g2.lineOutline_strokeWidth, v2.apl_lineOutline_strokeWidth) && (m2.lineOutlineMaskShape.style.strokeWidth = S2 + "px", E2 = true, ie && (je(m2, m2.lineOutlineMaskCaps), je(m2, m2.lineOutlineFace))), Xe(m2, _2, "lineOutline_inStrokeWidth", S2 = g2.lineOutline_inStrokeWidth, v2.apl_lineOutline_inStrokeWidth) && (m2.lineMaskShape.style.strokeWidth = S2 + "px", E2 = true, ie && (je(m2, m2.lineOutlineMaskCaps), je(m2, m2.lineOutlineFace)))), Xe(m2, _2, "plug_enabled", S2 = g2.plug_enabled, v2.apl_plug_enabled) && (m2.plugsFace.style.display = S2 ? "inline" : "none", E2 = true), g2.plug_enabled && [0, 1].forEach(function(n3) {
        var e3 = g2.plug_plugSE[n3], t3 = e3 !== Y ? X[q[e3]] : null, a3 = Ze(n3, t3);
        Xe(m2, _2.plug_enabledSE, n3, S2 = g2.plug_enabledSE[n3], v2.apl_plug_enabledSE) && (m2.plugsFace.style[a3.prop] = S2 ? "url(#" + m2.plugMarkerIdSE[n3] + ")" : "none", E2 = true), g2.plug_enabledSE[n3] && (Xe(m2, _2.plug_plugSE, n3, e3, v2.apl_plug_plugSE) && (m2.plugFaceSE[n3].href.baseVal = "#" + t3.elmId, Ue(m2, m2.plugMarkerSE[n3], a3.orient, t3.bBox, m2.svg, m2.plugMarkerShapeSE[n3], m2.plugsFace), E2 = true, oe && je(m2, m2.plugsFace)), Xe(m2, _2.plug_colorSE, n3, S2 = g2.plug_colorSE[n3], v2.apl_plug_colorSE) && (m2.plugFaceSE[n3].style.fill = S2, E2 = true, (le || re || ie) && !g2.line_colorTra && je(m2, ie ? m2.lineMaskCaps : m2.capsMaskLine)), ["markerWidth", "markerHeight"].forEach(function(e4) {
          var t4 = "plug_" + e4 + "SE";
          Xe(m2, _2[t4], n3, S2 = g2[t4][n3], v2["apl_" + t4]) && (m2.plugMarkerSE[n3][e4].baseVal.value = S2, E2 = true);
        }), Xe(m2, _2.plugOutline_enabledSE, n3, S2 = g2.plugOutline_enabledSE[n3], v2.apl_plugOutline_enabledSE) && (S2 ? (m2.plugFaceSE[n3].style.mask = "url(#" + m2.plugMaskIdSE[n3] + ")", m2.plugOutlineFaceSE[n3].style.display = "inline") : (m2.plugFaceSE[n3].style.mask = "none", m2.plugOutlineFaceSE[n3].style.display = "none"), E2 = true), g2.plugOutline_enabledSE[n3] && (Xe(m2, _2.plugOutline_plugSE, n3, e3, v2.apl_plugOutline_plugSE) && (m2.plugOutlineFaceSE[n3].href.baseVal = m2.plugMaskShapeSE[n3].href.baseVal = m2.plugOutlineMaskShapeSE[n3].href.baseVal = "#" + t3.elmId, [m2.plugMaskSE[n3], m2.plugOutlineMaskSE[n3]].forEach(function(e4) {
          e4.x.baseVal.value = t3.bBox.left, e4.y.baseVal.value = t3.bBox.top, e4.width.baseVal.value = t3.bBox.width, e4.height.baseVal.value = t3.bBox.height;
        }), E2 = true), Xe(m2, _2.plugOutline_colorSE, n3, S2 = g2.plugOutline_colorSE[n3], v2.apl_plugOutline_colorSE) && (m2.plugOutlineFaceSE[n3].style.fill = S2, E2 = true, ie && (je(m2, m2.lineMaskCaps), je(m2, m2.lineOutlineMaskCaps))), Xe(m2, _2.plugOutline_strokeWidthSE, n3, S2 = g2.plugOutline_strokeWidthSE[n3], v2.apl_plugOutline_strokeWidthSE) && (m2.plugOutlineMaskShapeSE[n3].style.strokeWidth = S2 + "px", E2 = true), Xe(m2, _2.plugOutline_inStrokeWidthSE, n3, S2 = g2.plugOutline_inStrokeWidthSE[n3], v2.apl_plugOutline_inStrokeWidthSE) && (m2.plugMaskShapeSE[n3].style.strokeWidth = S2 + "px", E2 = true)));
      }), E2)), (t2.position || U2.line || U2.plug) && (U2.position = Ke(e2)), (t2.path || U2.position) && (U2.path = (k2 = (x2 = e2).curStats, I2 = x2.aplStats, M2 = x2.pathList.animVal || x2.pathList.baseVal, w2 = k2.path_edge, C2 = false, M2 && (w2.x1 = w2.x2 = M2[0][0].x, w2.y1 = w2.y2 = M2[0][0].y, k2.path_pathData = b2 = Be(M2, function(e3) {
        e3.x < w2.x1 && (w2.x1 = e3.x), e3.y < w2.y1 && (w2.y1 = e3.y), e3.x > w2.x2 && (w2.x2 = e3.x), e3.y > w2.y2 && (w2.y2 = e3.y);
      }), Fe(b2, I2.path_pathData) && (x2.linePath.setPathData(b2), I2.path_pathData = b2, C2 = true, ie ? (je(x2, x2.plugsFace), je(x2, x2.lineMaskCaps)) : oe && je(x2, x2.linePath), x2.events.apl_path && x2.events.apl_path.forEach(function(e3) {
        e3(x2, b2);
      }))), C2)), U2.viewBox = (M2 = (O2 = e2).curStats, I2 = O2.aplStats, C2 = M2.path_edge, L2 = M2.viewBox_bBox, A2 = I2.viewBox_bBox, V2 = O2.svg.viewBox.baseVal, P2 = O2.svg.style, N2 = false, I2 = Math.max(M2.line_strokeWidth / 2, M2.viewBox_plugBCircleSE[0] || 0, M2.viewBox_plugBCircleSE[1] || 0), T2 = {x1: C2.x1 - I2, y1: C2.y1 - I2, x2: C2.x2 + I2, y2: C2.y2 + I2}, O2.events.new_edge4viewBox && O2.events.new_edge4viewBox.forEach(function(e3) {
        e3(O2, T2);
      }), L2.x = M2.lineMask_x = M2.lineOutlineMask_x = M2.maskBGRect_x = T2.x1, L2.y = M2.lineMask_y = M2.lineOutlineMask_y = M2.maskBGRect_y = T2.y1, L2.width = T2.x2 - T2.x1, L2.height = T2.y2 - T2.y1, ["x", "y", "width", "height"].forEach(function(e3) {
        var t3;
        (t3 = L2[e3]) !== A2[e3] && (V2[e3] = A2[e3] = t3, P2[Q[e3]] = t3 + (e3 === "x" || e3 === "y" ? O2.bodyOffset[e3] : 0) + "px", N2 = true);
      }), N2), U2.mask = (R2 = (W2 = e2).curStats, F2 = W2.aplStats, G2 = false, R2.plug_enabled ? [0, 1].forEach(function(e3) {
        R2.capsMaskMarker_enabledSE[e3] = R2.plug_enabledSE[e3] && R2.plug_colorTraSE[e3] || R2.plugOutline_enabledSE[e3] && R2.plugOutline_colorTraSE[e3];
      }) : R2.capsMaskMarker_enabledSE[0] = R2.capsMaskMarker_enabledSE[1] = false, R2.capsMaskMarker_enabled = R2.capsMaskMarker_enabledSE[0] || R2.capsMaskMarker_enabledSE[1], R2.lineMask_outlineMode = R2.lineOutline_enabled, R2.caps_enabled = R2.capsMaskMarker_enabled || R2.capsMaskAnchor_enabledSE[0] || R2.capsMaskAnchor_enabledSE[1], R2.lineMask_enabled = R2.caps_enabled || R2.lineMask_outlineMode, (R2.lineMask_enabled && !R2.lineMask_outlineMode || R2.lineOutline_enabled) && ["x", "y"].forEach(function(e3) {
        var t3 = "maskBGRect_" + e3;
        Xe(W2, F2, t3, B2 = R2[t3]) && (W2.maskBGRect[e3].baseVal.value = B2, G2 = true);
      }), Xe(W2, F2, "lineMask_enabled", B2 = R2.lineMask_enabled) && (W2.lineFace.style.mask = B2 ? "url(#" + W2.lineMaskId + ")" : "none", G2 = true, re && je(W2, W2.lineMask)), R2.lineMask_enabled && (Xe(W2, F2, "lineMask_outlineMode", B2 = R2.lineMask_outlineMode) && (B2 ? (W2.lineMaskBG.style.display = "none", W2.lineMaskShape.style.display = "inline") : (W2.lineMaskBG.style.display = "inline", W2.lineMaskShape.style.display = "none"), G2 = true), ["x", "y"].forEach(function(e3) {
        var t3 = "lineMask_" + e3;
        Xe(W2, F2, t3, B2 = R2[t3]) && (W2.lineMask[e3].baseVal.value = B2, G2 = true);
      }), Xe(W2, F2, "caps_enabled", B2 = R2.caps_enabled) && (W2.lineMaskCaps.style.display = W2.lineOutlineMaskCaps.style.display = B2 ? "inline" : "none", G2 = true, re && je(W2, W2.capsMaskLine)), R2.caps_enabled && ([0, 1].forEach(function(e3) {
        var t3;
        Xe(W2, F2.capsMaskAnchor_enabledSE, e3, B2 = R2.capsMaskAnchor_enabledSE[e3]) && (W2.capsMaskAnchorSE[e3].style.display = B2 ? "inline" : "none", G2 = true, re && je(W2, W2.lineMask)), R2.capsMaskAnchor_enabledSE[e3] && (Fe(t3 = R2.capsMaskAnchor_pathDataSE[e3], F2.capsMaskAnchor_pathDataSE[e3]) && (W2.capsMaskAnchorSE[e3].setPathData(t3), F2.capsMaskAnchor_pathDataSE[e3] = t3, G2 = true), Xe(W2, F2.capsMaskAnchor_strokeWidthSE, e3, B2 = R2.capsMaskAnchor_strokeWidthSE[e3]) && (W2.capsMaskAnchorSE[e3].style.strokeWidth = B2 + "px", G2 = true));
      }), Xe(W2, F2, "capsMaskMarker_enabled", B2 = R2.capsMaskMarker_enabled) && (W2.capsMaskLine.style.display = B2 ? "inline" : "none", G2 = true), R2.capsMaskMarker_enabled && [0, 1].forEach(function(n3) {
        var e3 = R2.capsMaskMarker_plugSE[n3], t3 = e3 !== Y ? X[q[e3]] : null, a3 = Ze(n3, t3);
        Xe(W2, F2.capsMaskMarker_enabledSE, n3, B2 = R2.capsMaskMarker_enabledSE[n3]) && (W2.capsMaskLine.style[a3.prop] = B2 ? "url(#" + W2.lineMaskMarkerIdSE[n3] + ")" : "none", G2 = true), R2.capsMaskMarker_enabledSE[n3] && (Xe(W2, F2.capsMaskMarker_plugSE, n3, e3) && (W2.capsMaskMarkerShapeSE[n3].href.baseVal = "#" + t3.elmId, Ue(W2, W2.capsMaskMarkerSE[n3], a3.orient, t3.bBox, W2.svg, W2.capsMaskMarkerShapeSE[n3], W2.capsMaskLine), G2 = true, oe && (je(W2, W2.capsMaskLine), je(W2, W2.lineFace))), ["markerWidth", "markerHeight"].forEach(function(e4) {
          var t4 = "capsMaskMarker_" + e4 + "SE";
          Xe(W2, F2[t4], n3, B2 = R2[t4][n3]) && (W2.capsMaskMarkerSE[n3][e4].baseVal.value = B2, G2 = true);
        }));
      }))), R2.lineOutline_enabled && ["x", "y"].forEach(function(e3) {
        var t3 = "lineOutlineMask_" + e3;
        Xe(W2, F2, t3, B2 = R2[t3]) && (W2.lineOutlineMask[e3].baseVal.value = B2, G2 = true);
      }), G2), t2.effect && (j2 = (D2 = e2).curStats, H2 = D2.aplStats, Object.keys(Z).forEach(function(e3) {
        var t3 = Z[e3], n3 = e3 + "_enabled", a3 = e3 + "_options", e3 = j2[a3];
        Xe(D2, H2, n3, z2 = j2[n3]) ? (z2 && (H2[a3] = we(e3)), t3[z2 ? "init" : "remove"](D2)) : z2 && ke(e3, H2[a3]) && (t3.remove(D2), H2[n3] = true, H2[a3] = we(e3), t3.init(D2));
      })), (le || re) && U2.line && !U2.path && je(e2, e2.lineShape), le && U2.plug && !U2.line && je(e2, e2.plugsFace), He(e2);
    }
    function et(e2, t2) {
      return {duration: (pe(e2.duration) && 0 < e2.duration ? e2 : t2).duration, timing: g.validTiming(e2.timing) ? e2.timing : we(t2.timing)};
    }
    function tt(e2, t2, n2, a2) {
      var i2 = e2.curStats, o2 = e2.aplStats, l2 = {};
      function r2() {
        ["show_on", "show_effect", "show_animOptions"].forEach(function(e3) {
          o2[e3] = i2[e3];
        });
      }
      i2.show_on = t2, n2 && w[n2] && (i2.show_effect = n2, i2.show_animOptions = et(he(a2) ? a2 : {}, w[n2].defaultAnimOptions)), l2.show_on = i2.show_on !== o2.show_on, l2.show_effect = i2.show_effect !== o2.show_effect, l2.show_animOptions = ke(i2.show_animOptions, o2.show_animOptions), l2.show_effect || l2.show_animOptions ? i2.show_inAnim ? (n2 = l2.show_effect ? w[o2.show_effect].stop(e2, true, true) : w[o2.show_effect].stop(e2), r2(), w[o2.show_effect].init(e2, n2)) : l2.show_on && (o2.show_effect && l2.show_effect && w[o2.show_effect].stop(e2, true, true), r2(), w[o2.show_effect].init(e2)) : l2.show_on && (r2(), w[o2.show_effect].start(e2));
    }
    function nt(e2, t2, n2) {
      n2 = {props: e2, optionName: n2};
      return e2.attachments.indexOf(t2) < 0 && (!t2.conf.bind || t2.conf.bind(t2, n2)) && (e2.attachments.push(t2), t2.boundTargets.push(n2), 1);
    }
    function at(n2, a2, e2) {
      var i2 = n2.attachments.indexOf(a2);
      -1 < i2 && n2.attachments.splice(i2, 1), a2.boundTargets.some(function(e3, t2) {
        return e3.props === n2 && (a2.conf.unbind && a2.conf.unbind(a2, e3), i2 = t2, true);
      }) && (a2.boundTargets.splice(i2, 1), e2 || ze(function() {
        a2.boundTargets.length || o(a2);
      }));
    }
    function it(s2, u2) {
      var i2, n2, e2, t2, a2, o2, l2, r2, h2, p2, c2, d2, f2, y2, m2, S2 = s2.options, g2 = {};
      function _2(e3, t3, n3, a3, i3) {
        var o3 = {};
        return n3 ? a3 != null ? (o3.container = e3[n3], o3.key = a3) : (o3.container = e3, o3.key = n3) : (o3.container = e3, o3.key = t3), o3.default = i3, o3.acceptsAuto = o3.default == null, o3;
      }
      function v2(e3, t3, n3, a3, i3, o3, l3) {
        var r3, s3, u3, l3 = _2(e3, n3, i3, o3, l3);
        return t3[n3] != null && (s3 = (t3[n3] + "").toLowerCase()) && (l3.acceptsAuto && s3 === D || (u3 = a3[s3])) && u3 !== l3.container[l3.key] && (l3.container[l3.key] = u3, r3 = true), l3.container[l3.key] != null || l3.acceptsAuto || (l3.container[l3.key] = l3.default, r3 = true), r3;
      }
      function E2(e3, t3, n3, a3, i3, o3, l3, r3, s3) {
        var u3, h3, p3, c3, l3 = _2(e3, n3, i3, o3, l3);
        if (!a3) {
          if (l3.default == null)
            throw new Error("Invalid `type`: " + n3);
          a3 = typeof l3.default;
        }
        return t3[n3] != null && (l3.acceptsAuto && (t3[n3] + "").toLowerCase() === D || (p3 = h3 = t3[n3], ((c3 = a3) === "number" ? pe(p3) : typeof p3 === c3) && (h3 = s3 && a3 === "string" && h3 ? h3.trim() : h3, 1) && (!r3 || r3(h3)))) && h3 !== l3.container[l3.key] && (l3.container[l3.key] = h3, u3 = true), l3.container[l3.key] != null || l3.acceptsAuto || (l3.container[l3.key] = l3.default, u3 = true), u3;
      }
      if (u2 = u2 || {}, ["start", "end"].forEach(function(e3, t3) {
        var n3 = u2[e3], a3 = false;
        if (n3 && (Me(n3) || (a3 = I(n3, "anchor"))) && n3 !== S2.anchorSE[t3]) {
          if (s2.optionIsAttach.anchorSE[t3] !== false && at(s2, _e[S2.anchorSE[t3]._id]), a3 && !nt(s2, _e[n3._id], e3))
            throw new Error("Can't bind attachment");
          S2.anchorSE[t3] = n3, s2.optionIsAttach.anchorSE[t3] = a3, i2 = g2.position = true;
        }
      }), !S2.anchorSE[0] || !S2.anchorSE[1] || S2.anchorSE[0] === S2.anchorSE[1])
        throw new Error("`start` and `end` are required.");
      function x2(e3) {
        var t3 = a2.appendChild(y2.createElementNS(ae, "mask"));
        return t3.id = e3, t3.maskUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE, [t3.x, t3.y, t3.width, t3.height].forEach(function(e4) {
          e4.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0);
        }), t3;
      }
      function b2(e3) {
        var t3 = a2.appendChild(y2.createElementNS(ae, "marker"));
        return t3.id = e3, t3.markerUnits.baseVal = SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH, t3.viewBox.baseVal || t3.setAttribute("viewBox", "0 0 0 0"), t3;
      }
      function k2(e3) {
        return [e3.width, e3.height].forEach(function(e4) {
          e4.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100);
        }), e3;
      }
      i2 && (c2 = function(e3, t3) {
        var n3, a3;
        if (!(e3 = Ce(e3)) || !(n3 = Ce(t3)))
          throw new Error("Cannot get frames.");
        return e3.length && n3.length && (e3.reverse(), n3.reverse(), e3.some(function(t4) {
          return n3.some(function(e4) {
            return e4 === t4 && (a3 = e4.contentWindow, true);
          });
        })), a3 || window;
      }(s2.optionIsAttach.anchorSE[0] !== false ? _e[S2.anchorSE[0]._id].element : S2.anchorSE[0], s2.optionIsAttach.anchorSE[1] !== false ? _e[S2.anchorSE[1]._id].element : S2.anchorSE[1])) !== s2.baseWindow && (e2 = c2, f2 = (n2 = s2).aplStats, y2 = e2.document, m2 = C + "-" + n2._id, n2.pathList = {}, Ye(f2, de), Object.keys(Z).forEach(function(e3) {
        var t3 = e3 + "_enabled";
        f2[t3] && (Z[e3].remove(n2), f2[t3] = false);
      }), n2.baseWindow && n2.svg && n2.baseWindow.document.body.removeChild(n2.svg), Qe(n2.baseWindow = e2), n2.bodyOffset = qe(e2), n2.svg = t2 = y2.createElementNS(ae, "svg"), t2.className.baseVal = C, t2.viewBox.baseVal || t2.setAttribute("viewBox", "0 0 0 0"), n2.defs = a2 = t2.appendChild(y2.createElementNS(ae, "defs")), n2.linePath = l2 = a2.appendChild(y2.createElementNS(ae, "path")), l2.id = r2 = m2 + "-line-path", l2.className.baseVal = C + "-line-path", re && (l2.style.fill = "none"), n2.lineShape = l2 = a2.appendChild(y2.createElementNS(ae, "use")), l2.id = h2 = m2 + "-line-shape", l2.href.baseVal = "#" + r2, (o2 = a2.appendChild(y2.createElementNS(ae, "g"))).id = p2 = m2 + "-caps", n2.capsMaskAnchorSE = [0, 1].map(function() {
        var e3 = o2.appendChild(y2.createElementNS(ae, "path"));
        return e3.className.baseVal = C + "-caps-mask-anchor", e3;
      }), n2.lineMaskMarkerIdSE = [m2 + "-caps-mask-marker-0", m2 + "-caps-mask-marker-1"], n2.capsMaskMarkerSE = [0, 1].map(function(e3) {
        return b2(n2.lineMaskMarkerIdSE[e3]);
      }), n2.capsMaskMarkerShapeSE = [0, 1].map(function(e3) {
        e3 = n2.capsMaskMarkerSE[e3].appendChild(y2.createElementNS(ae, "use"));
        return e3.className.baseVal = C + "-caps-mask-marker-shape", e3;
      }), n2.capsMaskLine = l2 = o2.appendChild(y2.createElementNS(ae, "use")), l2.className.baseVal = C + "-caps-mask-line", l2.href.baseVal = "#" + h2, n2.maskBGRect = l2 = k2(a2.appendChild(y2.createElementNS(ae, "rect"))), l2.id = c2 = m2 + "-mask-bg-rect", l2.className.baseVal = C + "-mask-bg-rect", re && (l2.style.fill = "white"), n2.lineMask = k2(x2(n2.lineMaskId = m2 + "-line-mask")), n2.lineMaskBG = l2 = n2.lineMask.appendChild(y2.createElementNS(ae, "use")), l2.href.baseVal = "#" + c2, n2.lineMaskShape = l2 = n2.lineMask.appendChild(y2.createElementNS(ae, "use")), l2.className.baseVal = C + "-line-mask-shape", l2.href.baseVal = "#" + r2, l2.style.display = "none", n2.lineMaskCaps = l2 = n2.lineMask.appendChild(y2.createElementNS(ae, "use")), l2.href.baseVal = "#" + p2, n2.lineOutlineMask = k2(x2(e2 = m2 + "-line-outline-mask")), (l2 = n2.lineOutlineMask.appendChild(y2.createElementNS(ae, "use"))).href.baseVal = "#" + c2, n2.lineOutlineMaskShape = l2 = n2.lineOutlineMask.appendChild(y2.createElementNS(ae, "use")), l2.className.baseVal = C + "-line-outline-mask-shape", l2.href.baseVal = "#" + r2, n2.lineOutlineMaskCaps = l2 = n2.lineOutlineMask.appendChild(y2.createElementNS(ae, "use")), l2.href.baseVal = "#" + p2, n2.face = t2.appendChild(y2.createElementNS(ae, "g")), n2.lineFace = l2 = n2.face.appendChild(y2.createElementNS(ae, "use")), l2.href.baseVal = "#" + h2, n2.lineOutlineFace = l2 = n2.face.appendChild(y2.createElementNS(ae, "use")), l2.href.baseVal = "#" + h2, l2.style.mask = "url(#" + e2 + ")", l2.style.display = "none", n2.plugMaskIdSE = [m2 + "-plug-mask-0", m2 + "-plug-mask-1"], n2.plugMaskSE = [0, 1].map(function(e3) {
        return x2(n2.plugMaskIdSE[e3]);
      }), n2.plugMaskShapeSE = [0, 1].map(function(e3) {
        e3 = n2.plugMaskSE[e3].appendChild(y2.createElementNS(ae, "use"));
        return e3.className.baseVal = C + "-plug-mask-shape", e3;
      }), d2 = [], n2.plugOutlineMaskSE = [0, 1].map(function(e3) {
        return x2(d2[e3] = m2 + "-plug-outline-mask-" + e3);
      }), n2.plugOutlineMaskShapeSE = [0, 1].map(function(e3) {
        e3 = n2.plugOutlineMaskSE[e3].appendChild(y2.createElementNS(ae, "use"));
        return e3.className.baseVal = C + "-plug-outline-mask-shape", e3;
      }), n2.plugMarkerIdSE = [m2 + "-plug-marker-0", m2 + "-plug-marker-1"], n2.plugMarkerSE = [0, 1].map(function(e3) {
        e3 = b2(n2.plugMarkerIdSE[e3]);
        return re && (e3.markerUnits.baseVal = SVGMarkerElement.SVG_MARKERUNITS_USERSPACEONUSE), e3;
      }), n2.plugMarkerShapeSE = [0, 1].map(function(e3) {
        return n2.plugMarkerSE[e3].appendChild(y2.createElementNS(ae, "g"));
      }), n2.plugFaceSE = [0, 1].map(function(e3) {
        return n2.plugMarkerShapeSE[e3].appendChild(y2.createElementNS(ae, "use"));
      }), n2.plugOutlineFaceSE = [0, 1].map(function(e3) {
        var t3 = n2.plugMarkerShapeSE[e3].appendChild(y2.createElementNS(ae, "use"));
        return t3.style.mask = "url(#" + d2[e3] + ")", t3.style.display = "none", t3;
      }), n2.plugsFace = l2 = n2.face.appendChild(y2.createElementNS(ae, "use")), l2.className.baseVal = C + "-plugs-face", l2.href.baseVal = "#" + h2, l2.style.display = "none", n2.curStats.show_inAnim ? (n2.isShown = 1, w[f2.show_effect].stop(n2, true)) : n2.isShown || (t2.style.visibility = "hidden"), y2.body.appendChild(t2), [0, 1, 2].forEach(function(e3) {
        var t3, e3 = n2.options.labelSEM[e3];
        e3 && I(e3, "label") && (t3 = _e[e3._id]).conf.initSvg && t3.conf.initSvg(t3, n2);
      }), g2.line = g2.plug = g2.lineOutline = g2.plugOutline = g2.faces = g2.effect = true), g2.position = v2(S2, u2, "path", R, null, null, ue.path) || g2.position, g2.position = v2(S2, u2, "startSocket", V, "socketSE", 0) || g2.position, g2.position = v2(S2, u2, "endSocket", V, "socketSE", 1) || g2.position, [u2.startSocketGravity, u2.endSocketGravity].forEach(function(e3, t3) {
        var n3, a3, i3 = false;
        e3 != null && (Array.isArray(e3) ? pe(e3[0]) && pe(e3[1]) && (i3 = [e3[0], e3[1]], Array.isArray(S2.socketGravitySE[t3]) && (n3 = i3, a3 = S2.socketGravitySE[t3], n3.length === a3.length && n3.every(function(e4, t4) {
          return e4 === a3[t4];
        })) && (i3 = false)) : ((e3 + "").toLowerCase() === D ? i3 = null : pe(e3) && 0 <= e3 && (i3 = e3), i3 === S2.socketGravitySE[t3] && (i3 = false)), i3 !== false && (S2.socketGravitySE[t3] = i3, g2.position = true));
      }), g2.line = E2(S2, u2, "color", null, "lineColor", null, ue.lineColor, null, true) || g2.line, g2.line = E2(S2, u2, "size", null, "lineSize", null, ue.lineSize, function(e3) {
        return 0 < e3;
      }) || g2.line, ["startPlug", "endPlug"].forEach(function(e3, t3) {
        g2.plug = v2(S2, u2, e3, F, "plugSE", t3, ue.plugSE[t3]) || g2.plug, g2.plug = E2(S2, u2, e3 + "Color", "string", "plugColorSE", t3, null, null, true) || g2.plug, g2.plug = E2(S2, u2, e3 + "Size", null, "plugSizeSE", t3, ue.plugSizeSE[t3], function(e4) {
          return 0 < e4;
        }) || g2.plug;
      }), g2.lineOutline = E2(S2, u2, "outline", null, "lineOutlineEnabled", null, ue.lineOutlineEnabled) || g2.lineOutline, g2.lineOutline = E2(S2, u2, "outlineColor", null, "lineOutlineColor", null, ue.lineOutlineColor, null, true) || g2.lineOutline, g2.lineOutline = E2(S2, u2, "outlineSize", null, "lineOutlineSize", null, ue.lineOutlineSize, function(e3) {
        return 0 < e3 && e3 <= 0.48;
      }) || g2.lineOutline, ["startPlugOutline", "endPlugOutline"].forEach(function(e3, t3) {
        g2.plugOutline = E2(S2, u2, e3, null, "plugOutlineEnabledSE", t3, ue.plugOutlineEnabledSE[t3]) || g2.plugOutline, g2.plugOutline = E2(S2, u2, e3 + "Color", "string", "plugOutlineColorSE", t3, null, null, true) || g2.plugOutline, g2.plugOutline = E2(S2, u2, e3 + "Size", null, "plugOutlineSizeSE", t3, ue.plugOutlineSizeSE[t3], function(e4) {
          return 1 <= e4;
        }) || g2.plugOutline;
      }), ["startLabel", "endLabel", "middleLabel"].forEach(function(e3, t3) {
        var n3, a3, i3, o3 = u2[e3], l3 = S2.labelSEM[t3] && !s2.optionIsAttach.labelSEM[t3] ? _e[S2.labelSEM[t3]._id].text : S2.labelSEM[t3], r3 = false;
        if ((n3 = typeof o3 == "string") && (o3 = o3.trim()), (n3 || o3 && (r3 = I(o3, "label"))) && o3 !== l3) {
          if (S2.labelSEM[t3] && (at(s2, _e[S2.labelSEM[t3]._id]), S2.labelSEM[t3] = ""), o3) {
            if (r3 ? (a3 = _e[(i3 = o3)._id]).boundTargets.slice().forEach(function(e4) {
              a3.conf.removeOption(a3, e4);
            }) : i3 = new M(O.captionLabel, [o3]), !nt(s2, _e[i3._id], e3))
              throw new Error("Can't bind attachment");
            S2.labelSEM[t3] = i3;
          }
          s2.optionIsAttach.labelSEM[t3] = r3;
        }
      }), Object.keys(Z).forEach(function(a3) {
        var e3, t3, o3 = Z[a3], n3 = a3 + "_enabled", i3 = a3 + "_options";
        function l3(a4) {
          var i4 = {};
          return o3.optionsConf.forEach(function(e4) {
            var t4 = e4[0], n4 = e4[3];
            e4[4] == null || i4[n4] || (i4[n4] = []), (typeof t4 == "function" ? t4 : t4 === "id" ? v2 : E2).apply(null, [i4, a4].concat(e4.slice(1)));
          }), i4;
        }
        function r3(e4) {
          var t4, n4 = a3 + "_animOptions";
          return e4.hasOwnProperty("animation") ? he(e4.animation) ? t4 = s2.curStats[n4] = et(e4.animation, o3.defaultAnimOptions) : (t4 = !!e4.animation, s2.curStats[n4] = t4 ? et({}, o3.defaultAnimOptions) : null) : (t4 = !!o3.defaultEnabled, s2.curStats[n4] = t4 ? et({}, o3.defaultAnimOptions) : null), t4;
        }
        u2.hasOwnProperty(a3) && (e3 = u2[a3], he(e3) ? (s2.curStats[n3] = true, t3 = s2.curStats[i3] = l3(e3), o3.anim && (s2.curStats[i3].animation = r3(e3))) : (t3 = s2.curStats[n3] = !!e3) && (s2.curStats[i3] = l3({}), o3.anim && (s2.curStats[i3].animation = r3({}))), ke(t3, S2[a3]) && (S2[a3] = t3, g2.effect = true));
      }), $e(s2, g2);
    }
    function ot(e2, t2, n2) {
      var a2 = {options: {anchorSE: [], socketSE: [], socketGravitySE: [], plugSE: [], plugColorSE: [], plugSizeSE: [], plugOutlineEnabledSE: [], plugOutlineColorSE: [], plugOutlineSizeSE: [], labelSEM: ["", "", ""]}, optionIsAttach: {anchorSE: [false, false], labelSEM: [false, false, false]}, curStats: {}, aplStats: {}, attachments: [], events: {}, reflowTargets: []};
      Ye(a2.curStats, de), Ye(a2.aplStats, de), Object.keys(Z).forEach(function(e3) {
        var t3 = Z[e3].stats;
        Ye(a2.curStats, t3), Ye(a2.aplStats, t3), a2.options[e3] = false;
      }), Ye(a2.curStats, fe), Ye(a2.aplStats, fe), a2.curStats.show_effect = ye, a2.curStats.show_animOptions = we(w[ye].defaultAnimOptions), Object.defineProperty(this, "_id", {value: ++ge}), a2._id = this._id, Se[this._id] = a2, arguments.length === 1 && (n2 = e2, e2 = null), n2 = n2 || {}, (e2 || t2) && (n2 = we(n2), e2 && (n2.start = e2), t2 && (n2.end = t2)), a2.isShown = a2.aplStats.show_on = !n2.hide, this.setOptions(n2);
    }
    function lt(n2) {
      return function(e2) {
        var t2 = {};
        t2[n2] = e2, this.setOptions(t2);
      };
    }
    function rt(e2, t2) {
      var n2, a2 = {conf: e2, curStats: {}, aplStats: {}, boundTargets: []}, i2 = {};
      e2.argOptions.every(function(e3) {
        return !(!t2.length || (typeof e3.type == "string" ? typeof t2[0] !== e3.type : typeof e3.type != "function" || !e3.type(t2[0]))) && (i2[e3.optionName] = t2.shift(), true);
      }), n2 = t2.length && he(t2[0]) ? we(t2[0]) : {}, Object.keys(i2).forEach(function(e3) {
        n2[e3] = i2[e3];
      }), e2.stats && (Ye(a2.curStats, e2.stats), Ye(a2.aplStats, e2.stats)), Object.defineProperty(this, "_id", {value: ++ve}), Object.defineProperty(this, "isRemoved", {get: function() {
        return !_e[this._id];
      }}), a2._id = this._id, e2.init && !e2.init(a2, n2) || (_e[this._id] = a2);
    }
    return Z = {dash: {stats: {dash_len: {}, dash_gap: {}, dash_maxOffset: {}}, anim: true, defaultAnimOptions: {duration: 1e3, timing: "linear"}, optionsConf: [["type", "len", "number", null, null, null, function(e2) {
      return 0 < e2;
    }], ["type", "gap", "number", null, null, null, function(e2) {
      return 0 < e2;
    }]], init: function(e2) {
      Ge(e2, "apl_line_strokeWidth", Z.dash.update), e2.lineFace.style.strokeDashoffset = 0, Z.dash.update(e2);
    }, remove: function(e2) {
      var t2 = e2.curStats;
      De(e2, "apl_line_strokeWidth", Z.dash.update), t2.dash_animId && (g.remove(t2.dash_animId), t2.dash_animId = null), e2.lineFace.style.strokeDasharray = "none", e2.lineFace.style.strokeDashoffset = 0, Ye(e2.aplStats, Z.dash.stats);
    }, update: function(t2) {
      var e2, n2 = t2.curStats, a2 = t2.aplStats, i2 = a2.dash_options, o2 = false;
      n2.dash_len = i2.len || 2 * a2.line_strokeWidth, n2.dash_gap = i2.gap || a2.line_strokeWidth, n2.dash_maxOffset = n2.dash_len + n2.dash_gap, o2 = Xe(t2, a2, "dash_len", n2.dash_len) || o2, (o2 = Xe(t2, a2, "dash_gap", n2.dash_gap) || o2) && (t2.lineFace.style.strokeDasharray = a2.dash_len + "," + a2.dash_gap), n2.dash_animOptions ? (o2 = Xe(t2, a2, "dash_maxOffset", n2.dash_maxOffset), a2.dash_animOptions && (o2 || ke(n2.dash_animOptions, a2.dash_animOptions)) && (n2.dash_animId && (e2 = g.stop(n2.dash_animId), g.remove(n2.dash_animId)), a2.dash_animOptions = null), a2.dash_animOptions || (n2.dash_animId = g.add(function(e3) {
        return (1 - e3) * a2.dash_maxOffset + "px";
      }, function(e3) {
        t2.lineFace.style.strokeDashoffset = e3;
      }, n2.dash_animOptions.duration, 0, n2.dash_animOptions.timing, false, e2), a2.dash_animOptions = we(n2.dash_animOptions))) : a2.dash_animOptions && (n2.dash_animId && (g.remove(n2.dash_animId), n2.dash_animId = null), t2.lineFace.style.strokeDashoffset = 0, a2.dash_animOptions = null);
    }}, gradient: {stats: {gradient_colorSE: {hasSE: true}, gradient_pointSE: {hasSE: true, hasProps: true}}, optionsConf: [["type", "startColor", "string", "colorSE", 0, null, null, true], ["type", "endColor", "string", "colorSE", 1, null, null, true]], init: function(e2) {
      var a2 = e2.baseWindow.document, t2 = e2.defs, n2 = C + "-" + e2._id + "-gradient";
      e2.efc_gradient_gradient = t2 = t2.appendChild(a2.createElementNS(ae, "linearGradient")), t2.id = n2, t2.gradientUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE, [t2.x1, t2.y1, t2.x2, t2.y2].forEach(function(e3) {
        e3.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0);
      }), e2.efc_gradient_stopSE = [0, 1].map(function(t3) {
        var n3 = e2.efc_gradient_gradient.appendChild(a2.createElementNS(ae, "stop"));
        try {
          n3.offset.baseVal = t3;
        } catch (e3) {
          if (e3.code !== DOMException.NO_MODIFICATION_ALLOWED_ERR)
            throw e3;
          n3.setAttribute("offset", t3);
        }
        return n3;
      }), Ge(e2, "cur_plug_colorSE", Z.gradient.update), Ge(e2, "apl_path", Z.gradient.update), e2.curStats.line_altColor = true, e2.lineFace.style.stroke = "url(#" + n2 + ")", Z.gradient.update(e2);
    }, remove: function(e2) {
      e2.efc_gradient_gradient && (e2.defs.removeChild(e2.efc_gradient_gradient), e2.efc_gradient_gradient = e2.efc_gradient_stopSE = null), De(e2, "cur_plug_colorSE", Z.gradient.update), De(e2, "apl_path", Z.gradient.update), e2.curStats.line_altColor = false, e2.lineFace.style.stroke = e2.curStats.line_color, Ye(e2.aplStats, Z.gradient.stats);
    }, update: function(a2) {
      var e2, i2 = a2.curStats, o2 = a2.aplStats, t2 = o2.gradient_options, n2 = a2.pathList.animVal || a2.pathList.baseVal;
      [0, 1].forEach(function(e3) {
        i2.gradient_colorSE[e3] = t2.colorSE[e3] || i2.plug_colorSE[e3];
      }), e2 = n2[0][0], i2.gradient_pointSE[0] = {x: e2.x, y: e2.y}, e2 = (n2 = n2[n2.length - 1])[n2.length - 1], i2.gradient_pointSE[1] = {x: e2.x, y: e2.y}, [0, 1].forEach(function(t3) {
        var n3;
        Xe(a2, o2.gradient_colorSE, t3, n3 = i2.gradient_colorSE[t3]) && (re ? (n3 = Oe(n3), a2.efc_gradient_stopSE[t3].style.stopColor = n3[1], a2.efc_gradient_stopSE[t3].style.stopOpacity = n3[0]) : a2.efc_gradient_stopSE[t3].style.stopColor = n3), ["x", "y"].forEach(function(e3) {
          (n3 = i2.gradient_pointSE[t3][e3]) !== o2.gradient_pointSE[t3][e3] && (a2.efc_gradient_gradient[e3 + (t3 + 1)].baseVal.value = o2.gradient_pointSE[t3][e3] = n3);
        });
      });
    }}, dropShadow: {stats: {dropShadow_dx: {}, dropShadow_dy: {}, dropShadow_blur: {}, dropShadow_color: {}, dropShadow_opacity: {}, dropShadow_x: {}, dropShadow_y: {}}, optionsConf: [["type", "dx", null, null, null, 2], ["type", "dy", null, null, null, 4], ["type", "blur", null, null, null, 3, function(e2) {
      return 0 <= e2;
    }], ["type", "color", null, null, null, "#000", null, true], ["type", "opacity", null, null, null, 0.8, function(e2) {
      return 0 <= e2 && e2 <= 1;
    }]], init: function(t2) {
      var e2, n2, a2, i2, o2 = t2.baseWindow.document, l2 = t2.defs, r2 = C + "-" + t2._id + "-dropShadow", s2 = (e2 = o2, n2 = r2, i2 = {}, typeof u != "boolean" && (u = !!window.SVGFEDropShadowElement && !re), i2.elmsAppend = [i2.elmFilter = o2 = e2.createElementNS(ae, "filter")], o2.filterUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE, o2.x.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), o2.y.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), o2.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100), o2.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100), o2.id = n2, u ? (i2.elmOffset = i2.elmBlur = a2 = o2.appendChild(e2.createElementNS(ae, "feDropShadow")), i2.styleFlood = a2.style) : (i2.elmBlur = o2.appendChild(e2.createElementNS(ae, "feGaussianBlur")), i2.elmOffset = a2 = o2.appendChild(e2.createElementNS(ae, "feOffset")), a2.result.baseVal = "offsetblur", a2 = o2.appendChild(e2.createElementNS(ae, "feFlood")), i2.styleFlood = a2.style, (a2 = o2.appendChild(e2.createElementNS(ae, "feComposite"))).in2.baseVal = "offsetblur", a2.operator.baseVal = SVGFECompositeElement.SVG_FECOMPOSITE_OPERATOR_IN, (a2 = o2.appendChild(e2.createElementNS(ae, "feMerge"))).appendChild(e2.createElementNS(ae, "feMergeNode")), a2.appendChild(e2.createElementNS(ae, "feMergeNode")).in1.baseVal = "SourceGraphic"), i2);
      ["elmFilter", "elmOffset", "elmBlur", "styleFlood", "elmsAppend"].forEach(function(e3) {
        t2["efc_dropShadow_" + e3] = s2[e3];
      }), s2.elmsAppend.forEach(function(e3) {
        l2.appendChild(e3);
      }), t2.face.setAttribute("filter", "url(#" + r2 + ")"), Ge(t2, "new_edge4viewBox", Z.dropShadow.adjustEdge), Z.dropShadow.update(t2);
    }, remove: function(e2) {
      var t2 = e2.defs;
      e2.efc_dropShadow_elmsAppend && (e2.efc_dropShadow_elmsAppend.forEach(function(e3) {
        t2.removeChild(e3);
      }), e2.efc_dropShadow_elmFilter = e2.efc_dropShadow_elmOffset = e2.efc_dropShadow_elmBlur = e2.efc_dropShadow_styleFlood = e2.efc_dropShadow_elmsAppend = null), De(e2, "new_edge4viewBox", Z.dropShadow.adjustEdge), $e(e2, {}), e2.face.removeAttribute("filter"), Ye(e2.aplStats, Z.dropShadow.stats);
    }, update: function(e2) {
      var t2, n2, a2 = e2.curStats, i2 = e2.aplStats, o2 = i2.dropShadow_options;
      a2.dropShadow_dx = t2 = o2.dx, Xe(e2, i2, "dropShadow_dx", t2) && (e2.efc_dropShadow_elmOffset.dx.baseVal = t2, n2 = true), a2.dropShadow_dy = t2 = o2.dy, Xe(e2, i2, "dropShadow_dy", t2) && (e2.efc_dropShadow_elmOffset.dy.baseVal = t2, n2 = true), a2.dropShadow_blur = t2 = o2.blur, Xe(e2, i2, "dropShadow_blur", t2) && (e2.efc_dropShadow_elmBlur.setStdDeviation(t2, t2), n2 = true), n2 && $e(e2, {}), a2.dropShadow_color = t2 = o2.color, Xe(e2, i2, "dropShadow_color", t2) && (e2.efc_dropShadow_styleFlood.floodColor = t2), a2.dropShadow_opacity = t2 = o2.opacity, Xe(e2, i2, "dropShadow_opacity", t2) && (e2.efc_dropShadow_styleFlood.floodOpacity = t2);
    }, adjustEdge: function(a2, i2) {
      var e2, o2 = a2.curStats, l2 = a2.aplStats;
      o2.dropShadow_dx != null && (e2 = 3 * o2.dropShadow_blur, (e2 = {x1: i2.x1 - e2 + o2.dropShadow_dx, y1: i2.y1 - e2 + o2.dropShadow_dy, x2: i2.x2 + e2 + o2.dropShadow_dx, y2: i2.y2 + e2 + o2.dropShadow_dy}).x1 < i2.x1 && (i2.x1 = e2.x1), e2.y1 < i2.y1 && (i2.y1 = e2.y1), e2.x2 > i2.x2 && (i2.x2 = e2.x2), e2.y2 > i2.y2 && (i2.y2 = e2.y2), ["x", "y"].forEach(function(e3) {
        var t2, n2 = "dropShadow_" + e3;
        o2[n2] = t2 = i2[e3 + "1"], Xe(a2, l2, n2, t2) && (a2.efc_dropShadow_elmFilter[e3].baseVal.value = t2);
      }));
    }}}, Object.keys(Z).forEach(function(e2) {
      var t2 = Z[e2], n2 = t2.stats;
      n2[e2 + "_enabled"] = {iniValue: false}, n2[e2 + "_options"] = {hasProps: true}, t2.anim && (n2[e2 + "_animOptions"] = {}, n2[e2 + "_animId"] = {});
    }), w = {none: {defaultAnimOptions: {}, init: function(e2, t2) {
      var n2 = e2.curStats;
      n2.show_animId && (g.remove(n2.show_animId), n2.show_animId = null), w.none.start(e2, t2);
    }, start: function(e2, t2) {
      w.none.stop(e2, true);
    }, stop: function(e2, t2, n2) {
      var a2 = e2.curStats;
      return n2 = n2 != null ? n2 : e2.aplStats.show_on, a2.show_inAnim = false, t2 && Je(e2, n2), n2 ? 1 : 0;
    }}, fade: {defaultAnimOptions: {duration: 300, timing: "linear"}, init: function(n2, e2) {
      var t2 = n2.curStats, a2 = n2.aplStats;
      t2.show_animId && g.remove(t2.show_animId), t2.show_animId = g.add(function(e3) {
        return e3;
      }, function(e3, t3) {
        t3 ? w.fade.stop(n2, true) : (n2.svg.style.opacity = e3 + "", ie && (je(n2, n2.svg), He(n2)));
      }, a2.show_animOptions.duration, 1, a2.show_animOptions.timing, null, false), w.fade.start(n2, e2);
    }, start: function(e2, t2) {
      var n2, a2 = e2.curStats;
      a2.show_inAnim && (n2 = g.stop(a2.show_animId)), Je(e2, 1), a2.show_inAnim = true, g.start(a2.show_animId, !e2.aplStats.show_on, t2 != null ? t2 : n2);
    }, stop: function(e2, t2, n2) {
      var a2, i2 = e2.curStats;
      return n2 = n2 != null ? n2 : e2.aplStats.show_on, a2 = i2.show_inAnim ? g.stop(i2.show_animId) : n2 ? 1 : 0, i2.show_inAnim = false, t2 && (e2.svg.style.opacity = n2 ? "" : "0", Je(e2, n2)), a2;
    }}, draw: {defaultAnimOptions: {duration: 500, timing: [0.58, 0, 0.42, 1]}, init: function(n2, e2) {
      var t2 = n2.curStats, a2 = n2.aplStats, o2 = n2.pathList.baseVal, i2 = Re(o2), l2 = i2.segsLen, r2 = i2.lenAll;
      t2.show_animId && g.remove(t2.show_animId), t2.show_animId = g.add(function(e3) {
        var t3, n3, a3, i3 = -1;
        if (e3 === 0)
          n3 = [[o2[0][0], o2[0][0]]];
        else if (e3 === 1)
          n3 = o2;
        else {
          for (t3 = r2 * e3, n3 = []; t3 >= l2[++i3]; )
            n3.push(o2[i3]), t3 -= l2[i3];
          t3 && ((a3 = o2[i3]).length === 2 ? n3.push([a3[0], Ve(a3[0], a3[1], t3 / l2[i3])]) : (e3 = Ne(a3[0], a3[1], a3[2], a3[3], We(a3[0], a3[1], a3[2], a3[3], t3)), n3.push([a3[0], e3.fromP1, e3.fromP2, e3])));
        }
        return n3;
      }, function(e3, t3) {
        t3 ? w.draw.stop(n2, true) : (n2.pathList.animVal = e3, $e(n2, {path: true}));
      }, a2.show_animOptions.duration, 1, a2.show_animOptions.timing, null, false), w.draw.start(n2, e2);
    }, start: function(e2, t2) {
      var n2, a2 = e2.curStats;
      a2.show_inAnim && (n2 = g.stop(a2.show_animId)), Je(e2, 1), a2.show_inAnim = true, Ge(e2, "apl_position", w.draw.update), g.start(a2.show_animId, !e2.aplStats.show_on, t2 != null ? t2 : n2);
    }, stop: function(e2, t2, n2) {
      var a2, i2 = e2.curStats;
      return n2 = n2 != null ? n2 : e2.aplStats.show_on, a2 = i2.show_inAnim ? g.stop(i2.show_animId) : n2 ? 1 : 0, i2.show_inAnim = false, t2 && (e2.pathList.animVal = n2 ? null : [[e2.pathList.baseVal[0][0], e2.pathList.baseVal[0][0]]], $e(e2, {path: true}), Je(e2, n2)), a2;
    }, update: function(e2) {
      De(e2, "apl_position", w.draw.update), e2.curStats.show_inAnim ? w.draw.init(e2, w.draw.stop(e2)) : e2.aplStats.show_animOptions = {};
    }}}, [["start", "anchorSE", 0], ["end", "anchorSE", 1], ["color", "lineColor"], ["size", "lineSize"], ["startSocketGravity", "socketGravitySE", 0], ["endSocketGravity", "socketGravitySE", 1], ["startPlugColor", "plugColorSE", 0], ["endPlugColor", "plugColorSE", 1], ["startPlugSize", "plugSizeSE", 0], ["endPlugSize", "plugSizeSE", 1], ["outline", "lineOutlineEnabled"], ["outlineColor", "lineOutlineColor"], ["outlineSize", "lineOutlineSize"], ["startPlugOutline", "plugOutlineEnabledSE", 0], ["endPlugOutline", "plugOutlineEnabledSE", 1], ["startPlugOutlineColor", "plugOutlineColorSE", 0], ["endPlugOutlineColor", "plugOutlineColorSE", 1], ["startPlugOutlineSize", "plugOutlineSizeSE", 0], ["endPlugOutlineSize", "plugOutlineSizeSE", 1]].forEach(function(e2) {
      var t2 = e2[0], n2 = e2[1], a2 = e2[2];
      Object.defineProperty(ot.prototype, t2, {get: function() {
        var e3 = a2 != null ? Se[this._id].options[n2][a2] : n2 ? Se[this._id].options[n2] : Se[this._id].options[t2];
        return e3 == null ? D : we(e3);
      }, set: lt(t2), enumerable: true});
    }), [["path", R], ["startSocket", V, "socketSE", 0], ["endSocket", V, "socketSE", 1], ["startPlug", F, "plugSE", 0], ["endPlug", F, "plugSE", 1]].forEach(function(e2) {
      var a2 = e2[0], i2 = e2[1], o2 = e2[2], l2 = e2[3];
      Object.defineProperty(ot.prototype, a2, {get: function() {
        var t2, n2 = l2 != null ? Se[this._id].options[o2][l2] : o2 ? Se[this._id].options[o2] : Se[this._id].options[a2];
        return n2 ? Object.keys(i2).some(function(e3) {
          return i2[e3] === n2 && (t2 = e3, true);
        }) ? t2 : new Error("It's broken") : D;
      }, set: lt(a2), enumerable: true});
    }), Object.keys(Z).forEach(function(n2) {
      var a2 = Z[n2];
      Object.defineProperty(ot.prototype, n2, {get: function() {
        var s2, e2, t2 = Se[this._id].options[n2];
        return he(t2) ? (s2 = t2, e2 = a2.optionsConf.reduce(function(e3, t3) {
          var n3, a3 = t3[0], i2 = t3[1], o2 = t3[2], l2 = t3[3], t3 = t3[4], r2 = t3 != null ? s2[l2][t3] : l2 ? s2[l2] : s2[i2];
          return e3[i2] = a3 === "id" ? r2 ? Object.keys(o2).some(function(e4) {
            return o2[e4] === r2 && (n3 = e4, true);
          }) ? n3 : new Error("It's broken") : D : r2 == null ? D : we(r2), e3;
        }, {}), a2.anim && (e2.animation = we(s2.animation)), e2) : t2;
      }, set: lt(n2), enumerable: true});
    }), ["startLabel", "endLabel", "middleLabel"].forEach(function(e2, n2) {
      Object.defineProperty(ot.prototype, e2, {get: function() {
        var e3 = Se[this._id], t2 = e3.options;
        return t2.labelSEM[n2] && !e3.optionIsAttach.labelSEM[n2] ? _e[t2.labelSEM[n2]._id].text : t2.labelSEM[n2] || "";
      }, set: lt(e2), enumerable: true});
    }), ot.prototype.setOptions = function(e2) {
      return it(Se[this._id], e2), this;
    }, ot.prototype.position = function() {
      return $e(Se[this._id], {position: true}), this;
    }, ot.prototype.remove = function() {
      var t2 = Se[this._id], n2 = t2.curStats;
      Object.keys(Z).forEach(function(e2) {
        e2 += "_animId";
        n2[e2] && g.remove(n2[e2]);
      }), n2.show_animId && g.remove(n2.show_animId), t2.attachments.slice().forEach(function(e2) {
        at(t2, e2);
      }), t2.baseWindow && t2.svg && t2.baseWindow.document.body.removeChild(t2.svg), delete Se[this._id];
    }, ot.prototype.show = function(e2, t2) {
      return tt(Se[this._id], true, e2, t2), this;
    }, ot.prototype.hide = function(e2, t2) {
      return tt(Se[this._id], false, e2, t2), this;
    }, o = function(t2) {
      t2 && _e[t2._id] && (t2.boundTargets.slice().forEach(function(e2) {
        at(e2.props, t2, true);
      }), t2.conf.remove && t2.conf.remove(t2), delete _e[t2._id]);
    }, rt.prototype.remove = function() {
      var t2 = this, n2 = _e[t2._id];
      n2 && (n2.boundTargets.slice().forEach(function(e2) {
        n2.conf.removeOption(n2, e2);
      }), ze(function() {
        var e2 = _e[t2._id];
        e2 && (console.error("LeaderLineAttachment was not removed by removeOption"), o(e2));
      }));
    }, M = rt, window.LeaderLineAttachment = M, I = function(e2, t2) {
      return e2 instanceof M && (!(e2.isRemoved || t2 && _e[e2._id].conf.type !== t2) || null);
    }, O = {pointAnchor: {type: "anchor", argOptions: [{optionName: "element", type: Me}], init: function(e2, t2) {
      return e2.element = O.pointAnchor.checkElement(t2.element), e2.x = O.pointAnchor.parsePercent(t2.x, true) || [0.5, true], e2.y = O.pointAnchor.parsePercent(t2.y, true) || [0.5, true], true;
    }, removeOption: function(e2, t2) {
      var n2 = t2.props, a2 = {}, i2 = e2.element, e2 = n2.options.anchorSE[t2.optionName === "start" ? 1 : 0];
      i2 === e2 && (i2 = e2 === document.body ? new M(O.pointAnchor, [i2]) : document.body), a2[t2.optionName] = i2, it(n2, a2);
    }, getBBoxNest: function(e2, t2) {
      var n2 = Le(e2.element, t2.baseWindow), a2 = n2.width, t2 = n2.height;
      return n2.width = n2.height = 0, n2.left = n2.right = n2.left + e2.x[0] * (e2.x[1] ? a2 : 1), n2.top = n2.bottom = n2.top + e2.y[0] * (e2.y[1] ? t2 : 1), n2;
    }, parsePercent: function(e2, t2) {
      var n2, a2, i2 = false;
      return pe(e2) ? a2 = e2 : typeof e2 == "string" && (n2 = m.exec(e2)) && n2[2] && (i2 = (a2 = parseFloat(n2[1]) / 100) !== 0), a2 != null && (t2 || 0 <= a2) ? [a2, i2] : null;
    }, checkElement: function(e2) {
      if (e2 == null)
        e2 = document.body;
      else if (!Me(e2))
        throw new Error("`element` must be Element");
      return e2;
    }}, areaAnchor: {type: "anchor", argOptions: [{optionName: "element", type: Me}, {optionName: "shape", type: "string"}], stats: {color: {}, strokeWidth: {}, elementWidth: {}, elementHeight: {}, elementLeft: {}, elementTop: {}, pathListRel: {}, bBoxRel: {}, pathData: {}, viewBoxBBox: {hasProps: true}, dashLen: {}, dashGap: {}}, init: function(a2, e2) {
      var t2, n2 = [];
      return a2.element = O.pointAnchor.checkElement(e2.element), typeof e2.color == "string" && (a2.color = e2.color.trim()), typeof e2.fillColor == "string" && (a2.fill = e2.fillColor.trim()), pe(e2.size) && 0 <= e2.size && (a2.size = e2.size), e2.dash && (a2.dash = true, pe(e2.dash.len) && 0 < e2.dash.len && (a2.dashLen = e2.dash.len), pe(e2.dash.gap) && 0 < e2.dash.gap && (a2.dashGap = e2.dash.gap)), e2.shape === "circle" ? a2.shape = e2.shape : e2.shape === "polygon" && Array.isArray(e2.points) && 3 <= e2.points.length && e2.points.every(function(e3) {
        var t3 = {};
        return !(!(t3.x = O.pointAnchor.parsePercent(e3[0], true)) || !(t3.y = O.pointAnchor.parsePercent(e3[1], true))) && (n2.push(t3), (t3.x[1] || t3.y[1]) && (a2.hasRatio = true), true);
      }) ? (a2.shape = e2.shape, a2.points = n2) : (a2.shape = "rect", a2.radius = pe(e2.radius) && 0 <= e2.radius ? e2.radius : 0), a2.shape !== "rect" && a2.shape !== "circle" || (a2.x = O.pointAnchor.parsePercent(e2.x, true) || [-0.05, true], a2.y = O.pointAnchor.parsePercent(e2.y, true) || [-0.05, true], a2.width = O.pointAnchor.parsePercent(e2.width) || [1.1, true], a2.height = O.pointAnchor.parsePercent(e2.height) || [1.1, true], (a2.x[1] || a2.y[1] || a2.width[1] || a2.height[1]) && (a2.hasRatio = true)), t2 = a2.element.ownerDocument, a2.svg = e2 = t2.createElementNS(ae, "svg"), e2.className.baseVal = C + "-areaAnchor", e2.viewBox.baseVal || e2.setAttribute("viewBox", "0 0 0 0"), a2.path = e2.appendChild(t2.createElementNS(ae, "path")), a2.path.style.fill = a2.fill || "none", a2.isShown = false, e2.style.visibility = "hidden", t2.body.appendChild(e2), Qe(t2 = t2.defaultView), a2.bodyOffset = qe(t2), a2.updateColor = function() {
        var e3 = a2.curStats, t3 = a2.aplStats, n3 = a2.boundTargets.length ? a2.boundTargets[0].props.curStats : null;
        e3.color = n3 = a2.color || (n3 ? n3.line_color : ue.lineColor), Xe(a2, t3, "color", n3) && (a2.path.style.stroke = n3);
      }, a2.updateShow = function() {
        Je(a2, a2.boundTargets.some(function(e3) {
          return e3.props.isShown === true;
        }));
      }, true;
    }, bind: function(e2, t2) {
      t2 = t2.props;
      return e2.color || Ge(t2, "cur_line_color", e2.updateColor), Ge(t2, "svgShow", e2.updateShow), ze(function() {
        e2.updateColor(), e2.updateShow();
      }), true;
    }, unbind: function(e2, t2) {
      t2 = t2.props;
      e2.color || De(t2, "cur_line_color", e2.updateColor), De(t2, "svgShow", e2.updateShow), 1 < e2.boundTargets.length && ze(function() {
        e2.updateColor(), e2.updateShow(), O.areaAnchor.update(e2) && e2.boundTargets.forEach(function(e3) {
          $e(e3.props, {position: true});
        });
      });
    }, removeOption: function(e2, t2) {
      O.pointAnchor.removeOption(e2, t2);
    }, remove: function(t2) {
      t2.boundTargets.length && (console.error("LeaderLineAttachment was not unbound by remove"), t2.boundTargets.forEach(function(e2) {
        O.areaAnchor.unbind(t2, e2);
      })), t2.svg.parentNode.removeChild(t2.svg);
    }, getStrokeWidth: function(e2, t2) {
      return O.areaAnchor.update(e2) && 1 < e2.boundTargets.length && ze(function() {
        e2.boundTargets.forEach(function(e3) {
          e3.props !== t2 && $e(e3.props, {position: true});
        });
      }), e2.curStats.strokeWidth;
    }, getPathData: function(e2, t2) {
      var n2 = Le(e2.element, t2.baseWindow);
      return Be(e2.curStats.pathListRel, function(e3) {
        e3.x += n2.left, e3.y += n2.top;
      });
    }, getBBoxNest: function(e2, t2) {
      t2 = Le(e2.element, t2.baseWindow), e2 = e2.curStats.bBoxRel;
      return {left: e2.left + t2.left, top: e2.top + t2.top, right: e2.right + t2.left, bottom: e2.bottom + t2.top, width: e2.width, height: e2.height};
    }, update: function(t2) {
      var n2, a2, i2, o2, e2, l2, r2, s2, u2, h2, p2, c2, d2, f2, y2, m2, S2 = t2.curStats, g2 = t2.aplStats, _2 = t2.boundTargets.length ? t2.boundTargets[0].props.curStats : null, v2 = {};
      if (v2.strokeWidth = Xe(t2, S2, "strokeWidth", t2.size != null ? t2.size : _2 ? _2.line_strokeWidth : ue.lineSize), n2 = Ie(t2.element), v2.elementWidth = Xe(t2, S2, "elementWidth", n2.width), v2.elementHeight = Xe(t2, S2, "elementHeight", n2.height), v2.elementLeft = Xe(t2, S2, "elementLeft", n2.left), v2.elementTop = Xe(t2, S2, "elementTop", n2.top), v2.strokeWidth || t2.hasRatio && (v2.elementWidth || v2.elementHeight)) {
        switch (t2.shape) {
          case "rect":
            (c2 = {left: t2.x[0] * (t2.x[1] ? n2.width : 1), top: t2.y[0] * (t2.y[1] ? n2.height : 1), width: t2.width[0] * (t2.width[1] ? n2.width : 1), height: t2.height[0] * (t2.height[1] ? n2.height : 1)}).right = c2.left + c2.width, c2.bottom = c2.top + c2.height, p2 = S2.strokeWidth / 2, s2 = (r2 = Math.min(c2.width, c2.height)) ? r2 / 2 * Math.SQRT2 + p2 : 0, h2 = (r2 = t2.radius ? t2.radius <= s2 ? t2.radius : s2 : 0) ? (s2 = (r2 - p2) / Math.SQRT2, h2 = [{x: c2.left - (u2 = r2 - s2), y: c2.top + s2}, {x: c2.left + s2, y: c2.top - u2}, {x: c2.right - s2, y: c2.top - u2}, {x: c2.right + u2, y: c2.top + s2}, {x: c2.right + u2, y: c2.bottom - s2}, {x: c2.right - s2, y: c2.bottom + u2}, {x: c2.left + s2, y: c2.bottom + u2}, {x: c2.left - u2, y: c2.bottom - s2}], S2.pathListRel = [[h2[0], {x: h2[0].x, y: h2[0].y - (p2 = r2 * te)}, {x: h2[1].x - p2, y: h2[1].y}, h2[1]]], h2[1].x !== h2[2].x && S2.pathListRel.push([h2[1], h2[2]]), S2.pathListRel.push([h2[2], {x: h2[2].x + p2, y: h2[2].y}, {x: h2[3].x, y: h2[3].y - p2}, h2[3]]), h2[3].y !== h2[4].y && S2.pathListRel.push([h2[3], h2[4]]), S2.pathListRel.push([h2[4], {x: h2[4].x, y: h2[4].y + p2}, {x: h2[5].x + p2, y: h2[5].y}, h2[5]]), h2[5].x !== h2[6].x && S2.pathListRel.push([h2[5], h2[6]]), S2.pathListRel.push([h2[6], {x: h2[6].x - p2, y: h2[6].y}, {x: h2[7].x, y: h2[7].y + p2}, h2[7]]), h2[7].y !== h2[0].y && S2.pathListRel.push([h2[7], h2[0]]), S2.pathListRel.push([]), u2 = r2 - s2 + S2.strokeWidth / 2, [{x: c2.left - u2, y: c2.top - u2}, {x: c2.right + u2, y: c2.bottom + u2}]) : (u2 = S2.strokeWidth / 2, h2 = [{x: c2.left - u2, y: c2.top - u2}, {x: c2.right + u2, y: c2.bottom + u2}], S2.pathListRel = [[h2[0], {x: h2[1].x, y: h2[0].y}], [{x: h2[1].x, y: h2[0].y}, h2[1]], [h2[1], {x: h2[0].x, y: h2[1].y}], []], [{x: c2.left - S2.strokeWidth, y: c2.top - S2.strokeWidth}, {x: c2.right + S2.strokeWidth, y: c2.bottom + S2.strokeWidth}]), S2.bBoxRel = {left: h2[0].x, top: h2[0].y, right: h2[1].x, bottom: h2[1].y, width: h2[1].x - h2[0].x, height: h2[1].y - h2[0].y};
            break;
          case "circle":
            (l2 = {left: t2.x[0] * (t2.x[1] ? n2.width : 1), top: t2.y[0] * (t2.y[1] ? n2.height : 1), width: t2.width[0] * (t2.width[1] ? n2.width : 1), height: t2.height[0] * (t2.height[1] ? n2.height : 1)}).width || l2.height || (l2.width = l2.height = 10), l2.width || (l2.width = l2.height), l2.height || (l2.height = l2.width), l2.right = l2.left + l2.width, l2.bottom = l2.top + l2.height, p2 = l2.left + l2.width / 2, r2 = l2.top + l2.height / 2, e2 = S2.strokeWidth / 2, s2 = l2.width / 2, u2 = l2.height / 2, c2 = s2 * Math.SQRT2 + e2, h2 = u2 * Math.SQRT2 + e2, S2.pathListRel = [[(e2 = [{x: p2 - c2, y: r2}, {x: p2, y: r2 - h2}, {x: p2 + c2, y: r2}, {x: p2, y: r2 + h2}])[0], {x: e2[0].x, y: e2[0].y - (p2 = h2 * te)}, {x: e2[1].x - (r2 = c2 * te), y: e2[1].y}, e2[1]], [e2[1], {x: e2[1].x + r2, y: e2[1].y}, {x: e2[2].x, y: e2[2].y - p2}, e2[2]], [e2[2], {x: e2[2].x, y: e2[2].y + p2}, {x: e2[3].x + r2, y: e2[3].y}, e2[3]], [e2[3], {x: e2[3].x - r2, y: e2[3].y}, {x: e2[0].x, y: e2[0].y + p2}, e2[0]], []], s2 = c2 - s2 + S2.strokeWidth / 2, u2 = h2 - u2 + S2.strokeWidth / 2, e2 = [{x: l2.left - s2, y: l2.top - u2}, {x: l2.right + s2, y: l2.bottom + u2}], S2.bBoxRel = {left: e2[0].x, top: e2[0].y, right: e2[1].x, bottom: e2[1].y, width: e2[1].x - e2[0].x, height: e2[1].y - e2[0].y};
            break;
          case "polygon":
            t2.points.forEach(function(e3) {
              var t3 = e3.x[0] * (e3.x[1] ? n2.width : 1), e3 = e3.y[0] * (e3.y[1] ? n2.height : 1);
              i2 ? (t3 < i2.left && (i2.left = t3), t3 > i2.right && (i2.right = t3), e3 < i2.top && (i2.top = e3), e3 > i2.bottom && (i2.bottom = e3)) : i2 = {left: t3, right: t3, top: e3, bottom: e3}, o2 ? S2.pathListRel.push([o2, {x: t3, y: e3}]) : S2.pathListRel = [], o2 = {x: t3, y: e3};
            }), S2.pathListRel.push([]), e2 = S2.strokeWidth / 2, e2 = [{x: i2.left - e2, y: i2.top - e2}, {x: i2.right + e2, y: i2.bottom + e2}], S2.bBoxRel = {left: e2[0].x, top: e2[0].y, right: e2[1].x, bottom: e2[1].y, width: e2[1].x - e2[0].x, height: e2[1].y - e2[0].y};
        }
        v2.pathListRel = v2.bBoxRel = true;
      }
      return (v2.pathListRel || v2.elementLeft || v2.elementTop) && (S2.pathData = Be(S2.pathListRel, function(e3) {
        e3.x += n2.left, e3.y += n2.top;
      })), Xe(t2, g2, "strokeWidth", a2 = S2.strokeWidth) && (t2.path.style.strokeWidth = a2 + "px"), Fe(a2 = S2.pathData, g2.pathData) && (t2.path.setPathData(a2), g2.pathData = a2, v2.pathData = true), t2.dash && (!v2.pathData && (!v2.strokeWidth || t2.dashLen && t2.dashGap) || (S2.dashLen = t2.dashLen || 2 * S2.strokeWidth, S2.dashGap = t2.dashGap || S2.strokeWidth), v2.dash = Xe(t2, g2, "dashLen", S2.dashLen) || v2.dash, v2.dash = Xe(t2, g2, "dashGap", S2.dashGap) || v2.dash, v2.dash && (t2.path.style.strokeDasharray = g2.dashLen + "," + g2.dashGap)), d2 = S2.viewBoxBBox, f2 = g2.viewBoxBBox, y2 = t2.svg.viewBox.baseVal, m2 = t2.svg.style, d2.x = S2.bBoxRel.left + n2.left, d2.y = S2.bBoxRel.top + n2.top, d2.width = S2.bBoxRel.width, d2.height = S2.bBoxRel.height, ["x", "y", "width", "height"].forEach(function(e3) {
        (a2 = d2[e3]) !== f2[e3] && (y2[e3] = f2[e3] = a2, m2[Q[e3]] = a2 + (e3 === "x" || e3 === "y" ? t2.bodyOffset[e3] : 0) + "px");
      }), v2.strokeWidth || v2.pathListRel || v2.bBoxRel;
    }}, mouseHoverAnchor: {type: "anchor", argOptions: [{optionName: "element", type: Me}, {optionName: "showEffectName", type: "string"}], style: {backgroundImage: "url('data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==')", backgroundSize: "", backgroundRepeat: "no-repeat", backgroundColor: "#f8f881", cursor: "default"}, hoverStyle: {backgroundImage: "none", backgroundColor: "#fadf8f"}, padding: {top: 1, right: 15, bottom: 1, left: 2}, minHeight: 15, backgroundPosition: {right: 2, top: 2}, backgroundSize: {width: 12, height: 12}, dirKeys: [["top", "Top"], ["right", "Right"], ["bottom", "Bottom"], ["left", "Left"]], init: function(a2, i2) {
      var n2, t2, e2, o2, l2, r2, s2, u2, h2, p2 = O.mouseHoverAnchor, c2 = {};
      if (a2.element = O.pointAnchor.checkElement(i2.element), s2 = a2.element, !((u2 = s2.ownerDocument) && (h2 = u2.defaultView) && h2.HTMLElement && s2 instanceof h2.HTMLElement))
        throw new Error("`element` must be HTML element");
      return p2.style.backgroundSize = p2.backgroundSize.width + "px " + p2.backgroundSize.height + "px", ["style", "hoverStyle"].forEach(function(e3) {
        var n3 = p2[e3];
        a2[e3] = Object.keys(n3).reduce(function(e4, t3) {
          return e4[t3] = n3[t3], e4;
        }, {});
      }), (n2 = a2.element.ownerDocument.defaultView.getComputedStyle(a2.element, "")).display === "inline" ? a2.style.display = "inline-block" : n2.display === "none" && (a2.style.display = "block"), O.mouseHoverAnchor.dirKeys.forEach(function(e3) {
        var t3 = e3[0], e3 = "padding" + e3[1];
        parseFloat(n2[e3]) < p2.padding[t3] && (a2.style[e3] = p2.padding[t3] + "px");
      }), a2.style.display && (e2 = a2.element.style.display, a2.element.style.display = a2.style.display), O.mouseHoverAnchor.dirKeys.forEach(function(e3) {
        e3 = "padding" + e3[1];
        a2.style[e3] && (c2[e3] = a2.element.style[e3], a2.element.style[e3] = a2.style[e3]);
      }), (s2 = a2.element.getBoundingClientRect()).height < p2.minHeight && (ie ? (h2 = p2.minHeight, n2.boxSizing === "content-box" ? h2 -= parseFloat(n2.borderTopWidth) + parseFloat(n2.borderBottomWidth) + parseFloat(n2.paddingTop) + parseFloat(n2.paddingBottom) : n2.boxSizing === "padding-box" && (h2 -= parseFloat(n2.borderTopWidth) + parseFloat(n2.borderBottomWidth)), a2.style.height = h2 + "px") : a2.style.height = parseFloat(n2.height) + (p2.minHeight - s2.height) + "px"), a2.style.backgroundPosition = re ? s2.width - p2.backgroundSize.width - p2.backgroundPosition.right + "px " + p2.backgroundPosition.top + "px" : "right " + p2.backgroundPosition.right + "px top " + p2.backgroundPosition.top + "px", a2.style.display && (a2.element.style.display = e2), O.mouseHoverAnchor.dirKeys.forEach(function(e3) {
        e3 = "padding" + e3[1];
        a2.style[e3] && (a2.element.style[e3] = c2[e3]);
      }), ["style", "hoverStyle"].forEach(function(e3) {
        var t3 = a2[e3], n3 = i2[e3];
        he(n3) && Object.keys(n3).forEach(function(e4) {
          typeof n3[e4] == "string" || pe(n3[e4]) ? t3[e4] = n3[e4] : n3[e4] == null && delete t3[e4];
        });
      }), typeof i2.onSwitch == "function" && (r2 = i2.onSwitch), i2.showEffectName && w[i2.showEffectName] && (a2.showEffectName = o2 = i2.showEffectName), l2 = i2.animOptions, a2.elmStyle = t2 = a2.element.style, a2.mouseenter = function(e3) {
        a2.hoverStyleSave = p2.getStyles(t2, Object.keys(a2.hoverStyle)), p2.setStyles(t2, a2.hoverStyle), a2.boundTargets.forEach(function(e4) {
          tt(e4.props, true, o2, l2);
        }), r2 && r2(e3);
      }, a2.mouseleave = function(e3) {
        p2.setStyles(t2, a2.hoverStyleSave), a2.boundTargets.forEach(function(e4) {
          tt(e4.props, false, o2, l2);
        }), r2 && r2(e3);
      }, true;
    }, bind: function(e2, t2) {
      var n2, a2, i2, o2, l2;
      return t2.props.svg ? O.mouseHoverAnchor.llShow(t2.props, false, e2.showEffectName) : ze(function() {
        O.mouseHoverAnchor.llShow(t2.props, false, e2.showEffectName);
      }), e2.enabled || (e2.styleSave = O.mouseHoverAnchor.getStyles(e2.elmStyle, Object.keys(e2.style)), O.mouseHoverAnchor.setStyles(e2.elmStyle, e2.style), e2.removeEventListener = (n2 = e2.element, a2 = e2.mouseenter, i2 = e2.mouseleave, "onmouseenter" in n2 && "onmouseleave" in n2 ? (n2.addEventListener("mouseenter", a2, false), n2.addEventListener("mouseleave", i2, false), function() {
        n2.removeEventListener("mouseenter", a2, false), n2.removeEventListener("mouseleave", i2, false);
      }) : (console.warn("mouseenter and mouseleave events polyfill is enabled."), n2.addEventListener("mouseover", o2 = function(e3) {
        e3.relatedTarget && (e3.relatedTarget === this || this.compareDocumentPosition(e3.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY) || a2.apply(this, arguments);
      }), n2.addEventListener("mouseout", l2 = function(e3) {
        e3.relatedTarget && (e3.relatedTarget === this || this.compareDocumentPosition(e3.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY) || i2.apply(this, arguments);
      }), function() {
        n2.removeEventListener("mouseover", o2, false), n2.removeEventListener("mouseout", l2, false);
      })), e2.enabled = true), true;
    }, unbind: function(e2, t2) {
      e2.enabled && e2.boundTargets.length <= 1 && (e2.removeEventListener(), O.mouseHoverAnchor.setStyles(e2.elmStyle, e2.styleSave), e2.enabled = false), O.mouseHoverAnchor.llShow(t2.props, true, e2.showEffectName);
    }, removeOption: function(e2, t2) {
      O.pointAnchor.removeOption(e2, t2);
    }, remove: function(t2) {
      t2.boundTargets.length && (console.error("LeaderLineAttachment was not unbound by remove"), t2.boundTargets.forEach(function(e2) {
        O.mouseHoverAnchor.unbind(t2, e2);
      }));
    }, getBBoxNest: function(e2, t2) {
      return Le(e2.element, t2.baseWindow);
    }, llShow: function(e2, t2, n2) {
      w[n2 || e2.curStats.show_effect].stop(e2, true, t2), e2.aplStats.show_on = t2;
    }, getStyles: function(n2, e2) {
      return e2.reduce(function(e3, t2) {
        return e3[t2] = n2[t2], e3;
      }, {});
    }, setStyles: function(t2, n2) {
      Object.keys(n2).forEach(function(e2) {
        t2[e2] = n2[e2];
      });
    }}, captionLabel: {type: "label", argOptions: [{optionName: "text", type: "string"}], stats: {color: {}, x: {}, y: {}}, textStyleProps: ["fontFamily", "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize", "fontSizeAdjust", "kerning", "letterSpacing", "wordSpacing", "textDecoration"], init: function(l2, t2) {
      return typeof t2.text == "string" && (l2.text = t2.text.trim()), !!l2.text && (typeof t2.color == "string" && (l2.color = t2.color.trim()), l2.outlineColor = typeof t2.outlineColor == "string" ? t2.outlineColor.trim() : "#fff", Array.isArray(t2.offset) && pe(t2.offset[0]) && pe(t2.offset[1]) && (l2.offset = {x: t2.offset[0], y: t2.offset[1]}), pe(t2.lineOffset) && (l2.lineOffset = t2.lineOffset), O.captionLabel.textStyleProps.forEach(function(e2) {
        t2[e2] != null && (l2[e2] = t2[e2]);
      }), l2.updateColor = function(e2) {
        O.captionLabel.updateColor(l2, e2);
      }, l2.updateSocketXY = function(e2) {
        var t3, n2 = l2.curStats, a2 = l2.aplStats, i2 = e2.curStats, o2 = i2.position_socketXYSE[l2.socketIndex];
        o2.x != null && (l2.offset ? (n2.x = o2.x + l2.offset.x, n2.y = o2.y + l2.offset.y) : (t3 = l2.height / 2, e2 = Math.max(i2.attach_plugSideLenSE[l2.socketIndex] || 0, i2.line_strokeWidth / 2), i2 = i2.position_socketXYSE[l2.socketIndex ? 0 : 1], o2.socketId === A || o2.socketId === k ? (n2.x = o2.socketId === A ? o2.x - t3 - l2.width : o2.x + t3, n2.y = i2.y < o2.y ? o2.y + e2 + t3 : o2.y - e2 - t3 - l2.height) : (n2.x = i2.x < o2.x ? o2.x + e2 + t3 : o2.x - e2 - t3 - l2.width, n2.y = o2.socketId === b ? o2.y - t3 - l2.height : o2.y + t3)), Xe(l2, a2, "x", t3 = n2.x) && (l2.elmPosition.x.baseVal.getItem(0).value = t3), Xe(l2, a2, "y", t3 = n2.y) && (l2.elmPosition.y.baseVal.getItem(0).value = t3 + l2.height));
      }, l2.updatePath = function(e2) {
        var t3 = l2.curStats, n2 = l2.aplStats, e2 = e2.pathList.animVal || e2.pathList.baseVal;
        e2 && (e2 = O.captionLabel.getMidPoint(e2, l2.lineOffset), t3.x = e2.x - l2.width / 2, t3.y = e2.y - l2.height / 2, Xe(l2, n2, "x", e2 = t3.x) && (l2.elmPosition.x.baseVal.getItem(0).value = e2), Xe(l2, n2, "y", e2 = t3.y) && (l2.elmPosition.y.baseVal.getItem(0).value = e2 + l2.height));
      }, l2.updateShow = function(e2) {
        O.captionLabel.updateShow(l2, e2);
      }, re && (l2.adjustEdge = function(e2, t3) {
        var n2 = l2.curStats;
        n2.x != null && O.captionLabel.adjustEdge(t3, {x: n2.x, y: n2.y, width: l2.width, height: l2.height}, l2.strokeWidth / 2);
      }), true);
    }, updateColor: function(e2, t2) {
      var n2 = e2.curStats, a2 = e2.aplStats, t2 = t2.curStats;
      n2.color = t2 = e2.color || t2.line_color, Xe(e2, a2, "color", t2) && (e2.styleFill.fill = t2);
    }, updateShow: function(e2, t2) {
      t2 = t2.isShown === true;
      t2 !== e2.isShown && (e2.styleShow.visibility = t2 ? "" : "hidden", e2.isShown = t2);
    }, adjustEdge: function(e2, t2, n2) {
      n2 = {x1: t2.x - n2, y1: t2.y - n2, x2: t2.x + t2.width + n2, y2: t2.y + t2.height + n2};
      n2.x1 < e2.x1 && (e2.x1 = n2.x1), n2.y1 < e2.y1 && (e2.y1 = n2.y1), n2.x2 > e2.x2 && (e2.x2 = n2.x2), n2.y2 > e2.y2 && (e2.y2 = n2.y2);
    }, newText: function(e2, t2, n2, a2, i2) {
      var o2, l2, r2 = t2.createElementNS(ae, "text");
      return r2.textContent = e2, [r2.x, r2.y].forEach(function(e3) {
        var t3 = n2.createSVGLength();
        t3.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), e3.baseVal.initialize(t3);
      }), typeof h != "boolean" && (h = "paintOrder" in r2.style), i2 && !h ? (o2 = t2.createElementNS(ae, "defs"), r2.id = a2, o2.appendChild(r2), (l2 = (e2 = t2.createElementNS(ae, "g")).appendChild(t2.createElementNS(ae, "use"))).href.baseVal = "#" + a2, (t2 = e2.appendChild(t2.createElementNS(ae, "use"))).href.baseVal = "#" + a2, (l2 = l2.style).strokeLinejoin = "round", {elmPosition: r2, styleText: r2.style, styleFill: t2.style, styleStroke: l2, styleShow: e2.style, elmsAppend: [o2, e2]}) : (l2 = r2.style, i2 && (l2.strokeLinejoin = "round", l2.paintOrder = "stroke"), {elmPosition: r2, styleText: l2, styleFill: l2, styleStroke: i2 ? l2 : null, styleShow: l2, elmsAppend: [r2]});
    }, getMidPoint: function(e2, t2) {
      var n2, a2, i2 = Re(e2), o2 = i2.segsLen, i2 = i2.lenAll, l2 = -1, r2 = i2 / 2 + (t2 || 0);
      if (r2 <= 0)
        return (n2 = e2[0]).length === 2 ? Ve(n2[0], n2[1], 0) : Ne(n2[0], n2[1], n2[2], n2[3], 0);
      if (i2 <= r2)
        return (n2 = e2[e2.length - 1]).length === 2 ? Ve(n2[0], n2[1], 1) : Ne(n2[0], n2[1], n2[2], n2[3], 1);
      for (a2 = []; r2 > o2[++l2]; )
        a2.push(e2[l2]), r2 -= o2[l2];
      return (n2 = e2[l2]).length === 2 ? Ve(n2[0], n2[1], r2 / o2[l2]) : Ne(n2[0], n2[1], n2[2], n2[3], We(n2[0], n2[1], n2[2], n2[3], r2));
    }, initSvg: function(t2, n2) {
      var e2, a2, i2 = O.captionLabel.newText(t2.text, n2.baseWindow.document, n2.svg, C + "-captionLabel-" + t2._id, t2.outlineColor);
      ["elmPosition", "styleFill", "styleShow", "elmsAppend"].forEach(function(e3) {
        t2[e3] = i2[e3];
      }), t2.isShown = false, t2.styleShow.visibility = "hidden", O.captionLabel.textStyleProps.forEach(function(e3) {
        t2[e3] != null && (i2.styleText[e3] = t2[e3]);
      }), i2.elmsAppend.forEach(function(e3) {
        n2.svg.appendChild(e3);
      }), e2 = i2.elmPosition.getBBox(), t2.width = e2.width, t2.height = e2.height, t2.outlineColor && (a2 = e2.height / 9, i2.styleStroke.strokeWidth = (a2 = 10 < a2 ? 10 : a2 < 2 ? 2 : a2) + "px", i2.styleStroke.stroke = t2.outlineColor), t2.strokeWidth = a2 || 0, Ye(t2.aplStats, O.captionLabel.stats), t2.updateColor(n2), t2.refSocketXY ? t2.updateSocketXY(n2) : t2.updatePath(n2), re && $e(n2, {}), t2.updateShow(n2);
    }, bind: function(e2, t2) {
      var n2 = t2.props;
      return e2.color || Ge(n2, "cur_line_color", e2.updateColor), (e2.refSocketXY = t2.optionName === "startLabel" || t2.optionName === "endLabel") ? (e2.socketIndex = t2.optionName === "startLabel" ? 0 : 1, Ge(n2, "apl_position", e2.updateSocketXY), e2.offset || (Ge(n2, "cur_attach_plugSideLenSE", e2.updateSocketXY), Ge(n2, "cur_line_strokeWidth", e2.updateSocketXY))) : Ge(n2, "apl_path", e2.updatePath), Ge(n2, "svgShow", e2.updateShow), re && Ge(n2, "new_edge4viewBox", e2.adjustEdge), O.captionLabel.initSvg(e2, n2), true;
    }, unbind: function(e2, t2) {
      var n2 = t2.props;
      e2.elmsAppend && (e2.elmsAppend.forEach(function(e3) {
        n2.svg.removeChild(e3);
      }), e2.elmPosition = e2.styleFill = e2.styleShow = e2.elmsAppend = null), Ye(e2.curStats, O.captionLabel.stats), Ye(e2.aplStats, O.captionLabel.stats), e2.color || De(n2, "cur_line_color", e2.updateColor), e2.refSocketXY ? (De(n2, "apl_position", e2.updateSocketXY), e2.offset || (De(n2, "cur_attach_plugSideLenSE", e2.updateSocketXY), De(n2, "cur_line_strokeWidth", e2.updateSocketXY))) : De(n2, "apl_path", e2.updatePath), De(n2, "svgShow", e2.updateShow), re && (De(n2, "new_edge4viewBox", e2.adjustEdge), $e(n2, {}));
    }, removeOption: function(e2, t2) {
      var n2 = t2.props, a2 = {};
      a2[t2.optionName] = "", it(n2, a2);
    }, remove: function(t2) {
      t2.boundTargets.length && (console.error("LeaderLineAttachment was not unbound by remove"), t2.boundTargets.forEach(function(e2) {
        O.captionLabel.unbind(t2, e2);
      }));
    }}, pathLabel: {type: "label", argOptions: [{optionName: "text", type: "string"}], stats: {color: {}, startOffset: {}, pathData: {}}, init: function(l2, t2) {
      return typeof t2.text == "string" && (l2.text = t2.text.trim()), !!l2.text && (typeof t2.color == "string" && (l2.color = t2.color.trim()), l2.outlineColor = typeof t2.outlineColor == "string" ? t2.outlineColor.trim() : "#fff", pe(t2.lineOffset) && (l2.lineOffset = t2.lineOffset), O.captionLabel.textStyleProps.forEach(function(e2) {
        t2[e2] != null && (l2[e2] = t2[e2]);
      }), l2.updateColor = function(e2) {
        O.captionLabel.updateColor(l2, e2);
      }, l2.updatePath = function(e2) {
        var t3 = l2.curStats, n2 = l2.aplStats, a2 = e2.curStats, i2 = e2.pathList.animVal || e2.pathList.baseVal;
        i2 && (t3.pathData = a2 = O.pathLabel.getOffsetPathData(i2, a2.line_strokeWidth / 2 + l2.strokeWidth / 2 + l2.height / 4, 1.25 * l2.height), Fe(a2, n2.pathData) && (l2.elmPath.setPathData(a2), n2.pathData = a2, l2.bBox = l2.elmPosition.getBBox(), l2.updateStartOffset(e2)));
      }, l2.updateStartOffset = function(e2) {
        var i2, t3, n2 = l2.curStats, a2 = l2.aplStats, o2 = e2.curStats;
        n2.pathData && (l2.semIndex === 2 && !l2.lineOffset || (t3 = n2.pathData.reduce(function(e3, t4) {
          var n3, a3 = t4.values;
          switch (t4.type) {
            case "M":
              i2 = {x: a3[0], y: a3[1]};
              break;
            case "L":
              n3 = {x: a3[0], y: a3[1]}, i2 && (e3 += Ae(i2, n3)), i2 = n3;
              break;
            case "C":
              n3 = {x: a3[4], y: a3[5]}, i2 && (e3 += Te(i2, {x: a3[0], y: a3[1]}, {x: a3[2], y: a3[3]}, n3)), i2 = n3;
          }
          return e3;
        }, 0), e2 = l2.semIndex === 0 ? 0 : l2.semIndex === 1 ? t3 : t3 / 2, l2.semIndex !== 2 && (o2 = Math.max(o2.attach_plugBackLenSE[l2.semIndex] || 0, o2.line_strokeWidth / 2) + l2.strokeWidth / 2 + l2.height / 4, e2 = (e2 += l2.semIndex === 0 ? o2 : -o2) < 0 ? 0 : t3 < e2 ? t3 : e2), l2.lineOffset && (e2 = (e2 += l2.lineOffset) < 0 ? 0 : t3 < e2 ? t3 : e2), n2.startOffset = e2, Xe(l2, a2, "startOffset", e2) && (l2.elmOffset.startOffset.baseVal.value = e2)));
      }, l2.updateShow = function(e2) {
        O.captionLabel.updateShow(l2, e2);
      }, re && (l2.adjustEdge = function(e2, t3) {
        l2.bBox && O.captionLabel.adjustEdge(t3, l2.bBox, l2.strokeWidth / 2);
      }), true);
    }, getOffsetPathData: function(e2, c2, n2) {
      var d2, a2, f2 = [];
      function y2(e3, t2) {
        return Math.abs(e3.x - t2.x) < 3 && Math.abs(e3.y - t2.y) < 3;
      }
      return e2.forEach(function(e3) {
        var t2, n3, a3, i2, o2, l2, r2, s2, u2, h2, p2;
        e3.length === 2 ? (s2 = e3[0], u2 = e3[1], h2 = c2, p2 = Math.atan2(s2.y - u2.y, u2.x - s2.x) + 0.5 * Math.PI, t2 = [{x: s2.x + Math.cos(p2) * h2, y: s2.y + Math.sin(p2) * h2 * -1}, {x: u2.x + Math.cos(p2) * h2, y: u2.y + Math.sin(p2) * h2 * -1}], d2 ? (a3 = d2.points, 0 <= (r2 = Math.atan2(a3[1].y - a3[0].y, a3[0].x - a3[1].x) - Math.atan2(e3[0].y - e3[1].y, e3[1].x - e3[0].x)) && r2 <= Math.PI ? n3 = {type: "line", points: t2, inside: true} : (o2 = Pe(a3[0], a3[1], c2), i2 = Pe(t2[1], t2[0], c2), l2 = a3[0], s2 = t2[1], p2 = (u2 = o2).x - l2.x, h2 = u2.y - l2.y, r2 = s2.x - i2.x, u2 = s2.y - i2.y, s2 = (-h2 * (l2.x - i2.x) + p2 * (l2.y - i2.y)) / (-r2 * h2 + p2 * u2), u2 = (r2 * (l2.y - i2.y) - u2 * (l2.x - i2.x)) / (-r2 * h2 + p2 * u2), n3 = (h2 = 0 <= s2 && s2 <= 1 && 0 <= u2 && u2 <= 1 ? {x: l2.x + u2 * p2, y: l2.y + u2 * h2} : null) ? {type: "line", points: [a3[1] = h2, t2[1]]} : (a3[1] = y2(i2, o2) ? i2 : o2, {type: "line", points: [i2, t2[1]]}), d2.len = Ae(a3[0], a3[1]))) : n3 = {type: "line", points: t2}, n3.len = Ae(n3.points[0], n3.points[1]), f2.push(d2 = n3)) : (f2.push({type: "cubic", points: function(e4, t3, n4, a4, i3, o3) {
          for (var l3, r3, s3 = Te(e4, t3, n4, a4) / o3, u3 = 1 / (o3 < i3 ? i3 / o3 * s3 : s3), h3 = [], p3 = 0; r3 = (90 - (l3 = Ne(e4, t3, n4, a4, p3)).angle) * (Math.PI / 180), h3.push({x: l3.x + Math.cos(r3) * i3, y: l3.y + Math.sin(r3) * i3 * -1}), !(1 <= p3); )
            1 < (p3 += u3) && (p3 = 1);
          return h3;
        }(e3[0], e3[1], e3[2], e3[3], c2, 16)}), d2 = null);
      }), d2 = null, f2.forEach(function(e3) {
        var t2;
        d2 = e3.type === "line" ? (e3.inside && (d2.len > c2 ? ((t2 = d2.points)[1] = Pe(t2[0], t2[1], -c2), d2.len = Ae(t2[0], t2[1])) : (d2.points = null, d2.len = 0), e3.len > c2 + n2 ? ((t2 = e3.points)[0] = Pe(t2[1], t2[0], -(c2 + n2)), e3.len = Ae(t2[0], t2[1])) : (e3.points = null, e3.len = 0)), e3) : null;
      }), f2.reduce(function(t2, e3) {
        var n3 = e3.points;
        return n3 && (a2 && y2(n3[0], a2) || t2.push({type: "M", values: [n3[0].x, n3[0].y]}), e3.type === "line" ? t2.push({type: "L", values: [n3[1].x, n3[1].y]}) : (n3.shift(), n3.forEach(function(e4) {
          t2.push({type: "L", values: [e4.x, e4.y]});
        })), a2 = n3[n3.length - 1]), t2;
      }, []);
    }, newText: function(e2, t2, n2, a2) {
      var i2, o2, l2, r2, s2 = t2.createElementNS(ae, "defs"), u2 = s2.appendChild(t2.createElementNS(ae, "path"));
      return u2.id = i2 = n2 + "-path", (l2 = (o2 = t2.createElementNS(ae, "text")).appendChild(t2.createElementNS(ae, "textPath"))).href.baseVal = "#" + i2, l2.startOffset.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), l2.textContent = e2, typeof h != "boolean" && (h = "paintOrder" in o2.style), a2 && !h ? (o2.id = e2 = n2 + "-text", s2.appendChild(o2), (r2 = (n2 = t2.createElementNS(ae, "g")).appendChild(t2.createElementNS(ae, "use"))).href.baseVal = "#" + e2, (t2 = n2.appendChild(t2.createElementNS(ae, "use"))).href.baseVal = "#" + e2, (r2 = r2.style).strokeLinejoin = "round", {elmPosition: o2, elmPath: u2, elmOffset: l2, styleText: o2.style, styleFill: t2.style, styleStroke: r2, styleShow: n2.style, elmsAppend: [s2, n2]}) : (r2 = o2.style, a2 && (r2.strokeLinejoin = "round", r2.paintOrder = "stroke"), {elmPosition: o2, elmPath: u2, elmOffset: l2, styleText: r2, styleFill: r2, styleStroke: a2 ? r2 : null, styleShow: r2, elmsAppend: [s2, o2]});
    }, initSvg: function(t2, n2) {
      var e2, a2, i2, o2 = O.pathLabel.newText(t2.text, n2.baseWindow.document, C + "-pathLabel-" + t2._id, t2.outlineColor);
      ["elmPosition", "elmPath", "elmOffset", "styleFill", "styleShow", "elmsAppend"].forEach(function(e3) {
        t2[e3] = o2[e3];
      }), t2.isShown = false, t2.styleShow.visibility = "hidden", O.captionLabel.textStyleProps.forEach(function(e3) {
        t2[e3] != null && (o2.styleText[e3] = t2[e3]);
      }), o2.elmsAppend.forEach(function(e3) {
        n2.svg.appendChild(e3);
      }), o2.elmPath.setPathData([{type: "M", values: [0, 100]}, {type: "h", values: [100]}]), le && (i2 = o2.elmOffset.href.baseVal, o2.elmOffset.href.baseVal = ""), e2 = o2.elmPosition.getBBox(), le && (o2.elmOffset.href.baseVal = i2), o2.styleText.textAnchor = ["start", "end", "middle"][t2.semIndex], t2.semIndex !== 2 || t2.lineOffset || o2.elmOffset.startOffset.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 50), t2.height = e2.height, t2.outlineColor && (a2 = e2.height / 9, o2.styleStroke.strokeWidth = (a2 = 10 < a2 ? 10 : a2 < 2 ? 2 : a2) + "px", o2.styleStroke.stroke = t2.outlineColor), t2.strokeWidth = a2 || 0, Ye(t2.aplStats, O.pathLabel.stats), t2.updateColor(n2), t2.updatePath(n2), t2.updateStartOffset(n2), re && $e(n2, {}), t2.updateShow(n2);
    }, bind: function(e2, t2) {
      var n2 = t2.props;
      return e2.color || Ge(n2, "cur_line_color", e2.updateColor), Ge(n2, "cur_line_strokeWidth", e2.updatePath), Ge(n2, "apl_path", e2.updatePath), e2.semIndex = t2.optionName === "startLabel" ? 0 : t2.optionName === "endLabel" ? 1 : 2, e2.semIndex === 2 && !e2.lineOffset || Ge(n2, "cur_attach_plugBackLenSE", e2.updateStartOffset), Ge(n2, "svgShow", e2.updateShow), re && Ge(n2, "new_edge4viewBox", e2.adjustEdge), O.pathLabel.initSvg(e2, n2), true;
    }, unbind: function(e2, t2) {
      var n2 = t2.props;
      e2.elmsAppend && (e2.elmsAppend.forEach(function(e3) {
        n2.svg.removeChild(e3);
      }), e2.elmPosition = e2.elmPath = e2.elmOffset = e2.styleFill = e2.styleShow = e2.elmsAppend = null), Ye(e2.curStats, O.pathLabel.stats), Ye(e2.aplStats, O.pathLabel.stats), e2.color || De(n2, "cur_line_color", e2.updateColor), De(n2, "cur_line_strokeWidth", e2.updatePath), De(n2, "apl_path", e2.updatePath), e2.semIndex === 2 && !e2.lineOffset || De(n2, "cur_attach_plugBackLenSE", e2.updateStartOffset), De(n2, "svgShow", e2.updateShow), re && (De(n2, "new_edge4viewBox", e2.adjustEdge), $e(n2, {}));
    }, removeOption: function(e2, t2) {
      var n2 = t2.props, a2 = {};
      a2[t2.optionName] = "", it(n2, a2);
    }, remove: function(t2) {
      t2.boundTargets.length && (console.error("LeaderLineAttachment was not unbound by remove"), t2.boundTargets.forEach(function(e2) {
        O.pathLabel.unbind(t2, e2);
      }));
    }}}, Object.keys(O).forEach(function(e2) {
      ot[e2] = function() {
        return new M(O[e2], Array.prototype.slice.call(arguments));
      };
    }), ot.positionByWindowResize = true, window.addEventListener("resize", S.add(function() {
      ot.positionByWindowResize && Object.keys(Se).forEach(function(e2) {
        $e(Se[e2], {position: true});
      });
    }), false), ot;
  }();
});

// build/output/ui/Connection.js
var Connection = class {
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.line = new LeaderLine(source, target, {
      color: "#111",
      endSocket: "left",
      startSocket: "right"
    });
  }
  disconnect() {
    this.source.disconnect(this);
    this.target.disconnect(this);
    this.line.remove();
  }
};

// build/output/ui/Decoy.module.css
var _default2 = {};

// build/output/ui/Decoy.js
var Decoy = class extends HTMLElement {
  init(parent, initParameters) {
    this.classList.add(_default2.decoy);
  }
};
customElements.define("dt-decoy", Decoy);

// build/output/ui/Input.module.css
var _default3 = {};

// build/_snowpack/pkg/nanoid.js
var nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    let byte = bytes[size] & 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte < 63) {
      id += "_";
    } else {
      id += "-";
    }
  }
  return id;
};

// build/output/ui/Node.module.css
var _default4 = {};

// build/output/ui/Node.js
var _selected, _titleElement, _editElement, _deleteElement, _inputSectionElement, _outputSectionElement;
var _Node = class extends HTMLElement {
  constructor(typeIdentifier, namePrefix) {
    super();
    _selected.set(this, void 0);
    _titleElement.set(this, void 0);
    _editElement.set(this, void 0);
    _deleteElement.set(this, void 0);
    _inputSectionElement.set(this, void 0);
    _outputSectionElement.set(this, void 0);
    this.workarea = null;
    this.behaviorEditor = null;
    this.behavior = null;
    this.behaviorCompiled = null;
    this.x = 0;
    this.y = 0;
    this.hasBehavior = false;
    this.hasIo = true;
    __privateSet(this, _selected, false);
    __privateSet(this, _titleElement, null);
    __privateSet(this, _editElement, null);
    __privateSet(this, _deleteElement, null);
    this.inputs = new Array();
    this.outputs = new Array();
    __privateSet(this, _inputSectionElement, null);
    __privateSet(this, _outputSectionElement, null);
    this.typeIdentifier = typeIdentifier;
    this.nodeId = _Node.makeId(typeIdentifier);
    this.name = namePrefix;
  }
  get selected() {
    return __privateGet(this, _selected);
  }
  set selected(value) {
    if (value) {
      this.select();
    } else {
      this.deselect();
    }
  }
  get titleElement() {
    return __privateGet(this, _titleElement);
  }
  set titleElement(value) {
    __privateSet(this, _titleElement, value);
  }
  get editElement() {
    return __privateGet(this, _editElement);
  }
  set editElement(value) {
    __privateSet(this, _editElement, value);
  }
  get deleteElement() {
    return __privateGet(this, _deleteElement);
  }
  set deleteElement(value) {
    __privateSet(this, _deleteElement, value);
  }
  connectedCallback() {
    this.workarea = this.parentElement;
    this.classList.add(_default4.node);
    this.titleElement = document.createElement("title");
    this.titleElement.classList.add(_default4.title);
    this.titleElement.textContent = this.name;
    this.titleElement.title = this.nodeId;
    this.titleElement.addEventListener("click", (event) => this.onClickTitle(event));
    this.appendChild(this.titleElement);
    if (this.hasBehavior) {
      this.editElement = document.createElement("button");
      this.editElement.classList.add(_default4.edit);
      this.editElement.textContent = "⬤";
      this.editElement.addEventListener("click", (event) => this.onClickEdit(event));
      this.appendChild(this.editElement);
    }
    this.deleteElement = document.createElement("button");
    this.deleteElement.classList.add(_default4.delete);
    this.deleteElement.textContent = "✖";
    this.deleteElement.addEventListener("click", (event) => this.onClickDelete(event));
    this.appendChild(this.deleteElement);
    if (this.hasIo) {
      __privateSet(this, _inputSectionElement, document.createElement("div"));
      __privateGet(this, _inputSectionElement).classList.add(_default4.inputSection);
      this.appendChild(__privateGet(this, _inputSectionElement));
      __privateSet(this, _outputSectionElement, document.createElement("div"));
      __privateGet(this, _outputSectionElement).classList.add(_default4.outputSection);
      this.appendChild(__privateGet(this, _outputSectionElement));
    }
  }
  init(initParameters) {
    this.nodeId = initParameters?.id ?? this.nodeId;
    this.name = initParameters?.name ?? this.name;
    this.x = initParameters?.x ?? this.x;
    this.y = initParameters?.y ?? this.y;
    if (initParameters) {
      for (let inputIndex = 0; inputIndex < initParameters.inputs.length; ++inputIndex) {
        this.inputs[inputIndex].init(initParameters.inputs[inputIndex]);
      }
      for (let outputIndex = 0; outputIndex < initParameters.outputs.length; ++outputIndex) {
        this.outputs[outputIndex].init(initParameters.outputs[outputIndex]);
      }
    }
    if (initParameters?.behavior) {
      for (let inputIndex = 0; inputIndex < initParameters.behavior.metadata.inputs.length; ++inputIndex) {
        this.inputs[inputIndex].label = mustExist(initParameters?.behavior?.metadata.inputs[inputIndex].label);
      }
      for (let outputIndex = 0; outputIndex < initParameters.behavior.metadata.outputs.length; ++outputIndex) {
        this.outputs[outputIndex].label = mustExist(initParameters?.behavior?.metadata.outputs[outputIndex].label);
      }
      this.behavior = Behavior.fromCodeFragment(initParameters.behavior.script, new BehaviorMetadata(this.name, initParameters.behavior.metadata.inputs, initParameters.behavior.metadata.outputs));
    }
  }
  initConnectionFrom(columnSource, event) {
    mustExist(this.workarea).initConnectionFrom(columnSource, event);
  }
  finalizeConnection(columnTarget) {
    mustExist(this.workarea).finalizeConnection(columnTarget);
  }
  onConnect(connection) {
    this.update();
    this.updateUi();
  }
  onClickTitle(event) {
    if (!event.ctrlKey) {
      return;
    }
    if (!__privateGet(this, _selected)) {
      this.select();
    } else {
      this.deselect();
    }
  }
  onClickEdit(event) {
    mustExist(this.workarea).editNodeBehavior(this, event);
  }
  onClickDelete(event) {
    mustExist(this.workarea).deleteNode(this);
  }
  select(event) {
    if (__privateGet(this, _selected)) {
      return;
    }
    this.classList.add(_default4.selected);
    __privateSet(this, _selected, true);
    this.workarea?.onNodeSelect(this, event);
  }
  deselect(event) {
    if (!__privateGet(this, _selected)) {
      return;
    }
    this.classList.remove(_default4.selected);
    __privateSet(this, _selected, false);
    this.workarea?.onNodeDeselect(this, event);
  }
  async update() {
    console.debug(`Updating ${this.nodeId}...`);
    for (const input of this.inputs) {
      input.update();
    }
    if (this.behaviorCompiled) {
      console.debug("  Executing compiled behavior...");
      try {
        await this.behaviorCompiled();
      } catch (error) {
        console.error(`  Execution of ${this.nodeId} failed!`, error);
      }
    }
  }
  updateUi(newPosition) {
    mustExist(this.titleElement).textContent = this.name;
    mustExist(this.titleElement).title = this.nodeId;
    this.x = newPosition?.x ?? this.x;
    this.y = newPosition?.y ?? this.y;
    for (const input of this.inputs) {
      input.updateUi();
    }
    for (const output of this.outputs) {
      output.updateUi();
    }
    if (this.behaviorEditor) {
      this.behaviorEditor.updateUi();
    }
  }
  updateBehavior(behavior = this.behavior) {
    this.behavior = behavior;
    if (this.behavior === null) {
      this.behaviorCompiled = null;
      return;
    }
    const script = this.behavior.toExecutableBehavior();
    this.rebuildFromMetadata();
    this.behaviorCompiled = new Function(script).bind(this);
    this.update();
  }
  addInput(initParameters) {
    const input = document.createElement("dt-input");
    mustExist(__privateGet(this, _inputSectionElement)).appendChild(input);
    input.init(initParameters);
    this.inputs.push(input);
    return input;
  }
  removeInput(input) {
    const workarea = mustExist(this.workarea);
    mustExist(__privateGet(this, _inputSectionElement)).removeChild(input);
    if (input.output) {
      workarea.disconnect(input.output);
    }
    this.inputs.splice(this.inputs.indexOf(input), 1);
  }
  addOutput(initParameters) {
    const output = document.createElement("dt-output");
    mustExist(__privateGet(this, _outputSectionElement)).appendChild(output);
    output.init(initParameters);
    this.outputs.push(output);
    return output;
  }
  removeOutput(output) {
    const workarea = mustExist(this.workarea);
    mustExist(__privateGet(this, _outputSectionElement)).removeChild(output);
    for (const input of output.inputs) {
      workarea.disconnect(input);
    }
    this.outputs.splice(this.outputs.indexOf(output), 1);
  }
  rebuildFromMetadata() {
    const behavior = mustExist(this.behavior);
    this.name = behavior.metadata.title;
    const excessInputCount = this.inputs.length - behavior.metadata.inputs.length;
    const excessInputs = this.inputs.splice(behavior.metadata.inputs.length, excessInputCount);
    for (let inputIndex = 0; inputIndex < behavior.metadata.inputs.length; ++inputIndex) {
      if (this.inputs.length <= inputIndex) {
        this.addInput();
      }
      this.inputs[inputIndex].label = behavior.metadata.inputs[inputIndex].label;
    }
    excessInputs.forEach((input) => this.removeInput(input));
    const excessOutputCount = this.outputs.length - behavior.metadata.outputs.length;
    const excessOutputs = this.outputs.splice(behavior.metadata.inputs.length, excessInputCount);
    for (let outputIndex = 0; outputIndex < behavior.metadata.outputs.length; ++outputIndex) {
      if (this.outputs.length <= outputIndex) {
        this.addOutput();
      }
      this.outputs[outputIndex].label = behavior.metadata.outputs[outputIndex].label;
    }
    excessOutputs.forEach((output) => this.removeOutput(output));
    this.outputs.splice(behavior.metadata.outputs.length, excessOutputCount);
  }
  serialize() {
    const serialized = {
      type: this.typeIdentifier,
      id: mustExist(this.nodeId),
      name: this.name,
      x: this.x,
      y: this.y,
      inputs: this.inputs.map((input) => ({
        id: mustExist(input.columnId),
        output: input.output ? mustExist(input.output.source.columnId) : null
      })),
      outputs: this.outputs.map((output) => ({
        id: mustExist(output.columnId),
        inputs: output.inputs.map((connection) => mustExist(connection.target.columnId))
      }))
    };
    if (this.behavior) {
      serialized.behavior = {
        metadata: {
          inputs: this.behavior.metadata.inputs,
          outputs: this.behavior.metadata.outputs
        },
        script: this.behavior.toCodeFragment()
      };
    }
    return serialized;
  }
  static makeId(type) {
    return `${type}-${nanoid(6)}`;
  }
};
var Node2 = _Node;
_selected = new WeakMap();
_titleElement = new WeakMap();
_editElement = new WeakMap();
_deleteElement = new WeakMap();
_inputSectionElement = new WeakMap();
_outputSectionElement = new WeakMap();

// build/output/ui/Input.js
var Input = class extends Column {
  constructor() {
    super();
    this.columnId = Node2.makeId("input");
    this.label = "<unlabled input>";
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(_default3.input);
    this.addEventListener("mouseup", (event) => this.onMouseUp(event));
  }
  connect(connection) {
    if (this.output) {
      this.output.disconnect();
    }
    this.output = connection;
    this.update();
    super.connect(connection);
    console.log(`${connection.source.parent?.nodeId}::${connection.source.columnId} → ${this.parent?.nodeId}::${this.columnId}`);
  }
  disconnect(connection) {
    super.disconnect(connection);
    this.output = void 0;
    this.value = void 0;
    this.parent?.update();
  }
  update() {
    if (isNil(this.output)) {
      return;
    }
    this.value = this.output.source.value;
  }
  updateUi() {
    super.updateUi();
    if (this.output) {
      this.output.line.position();
    }
  }
  onMouseEnter(event) {
    if (!isNil(this.output)) {
      this.output.line.dash = {animation: true};
    }
  }
  onMouseLeave(event) {
    if (!isNil(this.output)) {
      this.output.line.dash = false;
    }
  }
  onMouseUp(event) {
    if (this.output) {
      this.parent?.workarea?.disconnect(this.output);
    }
    this.parent?.finalizeConnection(this);
    this.update();
  }
};
customElements.define("dt-input", Input);

// build/output/ui/NodeEditor.js
var _textarea, _resizeObserver;
var NodeEditor = class extends Node2 {
  constructor() {
    super("_editor", "Behavior Editor");
    _textarea.set(this, void 0);
    _resizeObserver.set(this, void 0);
    __privateSet(this, _textarea, null);
    __privateSet(this, _resizeObserver, null);
    this.target = null;
    this.line = null;
    this.hasIo = false;
  }
  get behaviorSource() {
    return __privateGet(this, _textarea)?.value ?? "";
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _textarea, document.createElement("textarea"));
    __privateGet(this, _textarea).setAttribute("spellcheck", "false");
    this.appendChild(__privateGet(this, _textarea));
    __privateSet(this, _resizeObserver, new ResizeObserver(() => {
      this.workarea?.onNodeResize(this);
    }));
    __privateGet(this, _resizeObserver).observe(__privateGet(this, _textarea));
  }
  disconnectedCallback() {
    __privateGet(this, _resizeObserver)?.disconnect();
    __privateSet(this, _resizeObserver, null);
  }
  editNodeBehavior(node) {
    this.target = node;
    node.behaviorEditor = this;
    this.name = `Behavior Editor for ${this.target.nodeId}`;
    mustExist(__privateGet(this, _textarea)).value = node.behavior?.toEditableScript() ?? "";
  }
  onClickDelete(event) {
    if (this.behaviorSource !== this.target?.behavior?.toEditableScript()) {
      const shouldApply = window.confirm("Apply new behavior?");
      if (shouldApply) {
        this.workarea?.closeBehaviorEditor(mustExist(this.target));
        return;
      }
    }
    super.onClickDelete(event);
  }
  init(initParameters) {
    super.init(initParameters);
    this.updateUi();
  }
  updateUi(newPosition) {
    super.updateUi(newPosition);
    if (this.line) {
      this.line.position();
    }
  }
  serialize() {
    throw new Error("Node can not be serialized.");
  }
};
_textarea = new WeakMap();
_resizeObserver = new WeakMap();
customElements.define("dt-node-editor", NodeEditor);

// build/output/ui/NodeNoop.js
var NodeNoop = class extends Node2 {
  constructor() {
    super("noop", "Noop");
  }
  connectedCallback() {
    super.connectedCallback();
    this.addInput();
  }
  init(initParameters) {
    super.init(initParameters);
    this.inputs[0].init(initParameters?.inputs[0]);
    this.updateUi();
  }
  serialize() {
    return {
      type: "noop",
      id: mustExist(this.nodeId),
      name: this.name,
      x: this.x,
      y: this.y,
      inputs: this.inputs.map((input) => ({
        id: mustExist(input.columnId),
        output: input.output ? mustExist(input.output.source.columnId) : null
      })),
      outputs: this.outputs.map((output) => ({
        id: mustExist(output.columnId),
        inputs: output.inputs.map((connection) => mustExist(connection.target.columnId))
      }))
    };
  }
};
customElements.define("dt-node-noop", NodeNoop);

// build/output/ui/NodeRow.js
var _outputIntElements;
var NodeRow = class extends Node2 {
  constructor() {
    super("row", "Row");
    _outputIntElements.set(this, void 0);
    __privateSet(this, _outputIntElements, new Array());
    this.hasBehavior = true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateBehavior(Behavior.fromCodeFragment(`
while(this.outputs.length < 5) { 
  const output = this.addOutput();
  output.label = \`Output \${this.outputs.length}\`;
  output.value = this.outputs.length * 2;
}
`, new BehaviorMetadata("Row", [], [])));
    this.rebuildFromMetadata();
  }
  rebuildFromMetadata() {
    const behavior = mustExist(this.behavior);
    this.name = behavior.metadata.title;
  }
};
_outputIntElements = new WeakMap();
customElements.define("dt-node-row", NodeRow);

// build/output/ui/NodeScript.js
var NodeScript = class extends Node2 {
  constructor() {
    super("script", "Script");
    this.hasBehavior = true;
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateBehavior(Behavior.fromCodeFragment("sum = Number(a) + Number(b);", new BehaviorMetadata("Sum", [
      {identifier: "a", label: "A"},
      {identifier: "b", label: "B"}
    ], [{identifier: "sum", label: "Sum"}])));
    this.rebuildFromMetadata();
  }
  init(initParameters) {
    super.init(initParameters);
    this.updateUi();
  }
};
customElements.define("dt-node-script", NodeScript);

// build/_snowpack/pkg/arbit.js
function alea(s0, s1, c) {
  var f = function aleaStep() {
    var t = 2091639 * s0 + c * 23283064365386963e-26;
    s0 = s1;
    return s1 = t - (c = t | 0);
  };
  f.getState = function aleaGetState() {
    return [s0, s1, c];
  };
  f.nextFloat = aleaNextFloat;
  f.nextInt = aleaNextInt;
  return f;
}
function aleaNextFloat(opt_minOrMax, opt_max) {
  var value = this();
  var min, max;
  if (typeof opt_max == "number") {
    min = opt_minOrMax;
    max = opt_max;
  } else if (typeof opt_minOrMax == "number") {
    min = 0;
    max = opt_minOrMax;
  } else {
    return value;
  }
  return min + value * (max - min);
}
function aleaNextInt(minOrMax, opt_max) {
  return Math.floor(this.nextFloat(minOrMax, opt_max));
}
function aleaFromSeed(seed) {
  var s0, s1, h, n = 4022871197, v;
  seed = "X" + (seed || +new Date());
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < seed.length; j++) {
      n += seed.charCodeAt(j);
      h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 4294967296;
    }
    v = (n >>> 0) * 23283064365386963e-26;
    if (i === 0)
      s0 = v;
    else
      s1 = v;
  }
  return alea(s0, s1, 1);
}
aleaFromSeed.fromState = function aleaFromState(state) {
  return alea.apply(null, state);
};
var arbit = aleaFromSeed;
var arbit_default = arbit;

// build/output/ui/NodeSeed.js
var NodeSeed = class extends Node2 {
  constructor() {
    super("seed", "Seed");
    this.hasBehavior = true;
    this.random = arbit_default(this.nodeId);
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateBehavior(Behavior.fromCodeFragment("float = this.random();\nint = this.random.nextInt(256);", new BehaviorMetadata("Seed", [], [
      {identifier: "float", label: "Float"},
      {identifier: "int", label: "Integer"}
    ])));
    this.rebuildFromMetadata();
  }
  init(initParameters) {
    super.init(initParameters);
    this.random = arbit_default(mustExist(this.nodeId));
    this.updateUi();
  }
};
customElements.define("dt-node-seed", NodeSeed);

// build/output/ui/Output.module.css
var _default5 = {};

// build/output/ui/Output.js
var Output = class extends Column {
  constructor() {
    super();
    this.inputs = new Array();
    this.columnId = Node2.makeId("output");
    this.label = "<unlabled output>";
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(_default5.output);
    this.addEventListener("mousedown", (event) => this.onMouseDown(event));
  }
  connect(connection) {
    this.inputs.push(connection);
    super.connect(connection);
  }
  disconnect(connection) {
    this.inputs.splice(this.inputs.indexOf(connection), 1);
    super.disconnect(connection);
  }
  onMouseEnter(event) {
    for (const input of this.inputs) {
      input.line.dash = {animation: true};
    }
  }
  onMouseLeave(event) {
    for (const input of this.inputs) {
      input.line.dash = false;
    }
  }
  onMouseDown(event) {
    if (!this.parent) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    console.log(`Begin sending output from ${this.parent.name}...`);
    this.parent.initConnectionFrom(this, event);
  }
  updateUi() {
    super.updateUi();
    for (const connection of this.inputs) {
      connection.line.position();
    }
  }
};
customElements.define("dt-output", Output);

// build/output/ui/Scrollable.module.css
var _default6 = {};

// build/output/ui/Scrollable.js
var _workarea;
var Scrollable = class extends HTMLElement {
  constructor() {
    super();
    _workarea.set(this, void 0);
    __privateSet(this, _workarea, null);
    console.debug("Scrollable constructed.");
  }
  connectedCallback() {
    __privateSet(this, _workarea, this.querySelector("dt-workarea"));
    this.classList.add(_default6.scrollable);
    this.addEventListener("scroll", (event) => this.onScroll(event));
    console.debug("Scrollable connected.");
    this.waitForWorkarea().catch(console.error);
  }
  async waitForWorkarea() {
    await customElements.whenDefined("dt-workarea");
    mustExist(__privateGet(this, _workarea)).registerScrollableContainer(this);
    this.scroll(this.scrollHeight / 3, this.scrollWidth / 3);
  }
  onScroll(event) {
    if (!__privateGet(this, _workarea)) {
      return;
    }
    __privateGet(this, _workarea).updateConnections();
  }
};
_workarea = new WeakMap();
customElements.define("dt-scrollable", Scrollable);

// build/output/ui/Toolbar.module.css
var _default7 = {};

// build/output/ui/Toolbar.js
var _workarea2;
var Toolbar = class extends HTMLElement {
  constructor() {
    super();
    _workarea2.set(this, void 0);
    __privateSet(this, _workarea2, null);
    console.debug("Toolbar constructed.");
  }
  connectedCallback() {
    this.classList.add(_default7.toolbar);
    const forWorkarea = this.getAttribute("for");
    if (isNil(forWorkarea)) {
      throw new Error("Missing `for` attribute on dt-toolbar. Requires an ID of a dt-workarea.");
    }
    __privateSet(this, _workarea2, mustExist(document.getElementById(forWorkarea)));
    const addRowButton = document.createElement("button");
    addRowButton.classList.add(_default7.button);
    addRowButton.textContent = "➕ Row";
    addRowButton.title = "4";
    addRowButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).createNode("row"));
    this.appendChild(addRowButton);
    const addSeedButton = document.createElement("button");
    addSeedButton.classList.add(_default7.button);
    addSeedButton.textContent = "➕ Seed";
    addSeedButton.title = "1";
    addSeedButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).createNode("seed"));
    this.appendChild(addSeedButton);
    const addNoopButton = document.createElement("button");
    addNoopButton.classList.add(_default7.button);
    addNoopButton.textContent = "➕ Noop";
    addNoopButton.title = "2";
    addNoopButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).createNode("noop"));
    this.appendChild(addNoopButton);
    const addScriptButton = document.createElement("button");
    addScriptButton.classList.add(_default7.button);
    addScriptButton.textContent = "➕ Script";
    addScriptButton.title = "3";
    addScriptButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).createNode("script"));
    this.appendChild(addScriptButton);
    const divider1 = document.createElement("span");
    divider1.classList.add(_default7.divider);
    this.appendChild(divider1);
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(_default7.button);
    deleteButton.textContent = "✖ Delete";
    deleteButton.title = "D";
    deleteButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).deleteSelectedNodes());
    this.appendChild(deleteButton);
    const clearButton = document.createElement("button");
    clearButton.classList.add(_default7.button);
    clearButton.textContent = "♻ Clear";
    clearButton.title = "X";
    clearButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).clear());
    this.appendChild(clearButton);
    const divider2 = document.createElement("span");
    divider2.classList.add(_default7.divider);
    this.appendChild(divider2);
    const exportButton = document.createElement("button");
    exportButton.classList.add(_default7.button);
    exportButton.textContent = "🔽 Export";
    exportButton.title = "E";
    exportButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).export());
    this.appendChild(exportButton);
    const restoreButton = document.createElement("button");
    restoreButton.classList.add(_default7.button);
    restoreButton.textContent = "🔃 Restore snapshot";
    restoreButton.title = "R";
    restoreButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).restoreSnapshot());
    this.appendChild(restoreButton);
    const demoButton = document.createElement("button");
    demoButton.classList.add(_default7.button);
    demoButton.textContent = "🎪 Demo";
    demoButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).restoreSnapshotDemo());
    this.appendChild(demoButton);
    const executeButton = document.createElement("button");
    executeButton.classList.add(_default7.button);
    executeButton.textContent = "▶ Execute";
    executeButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea2)).execute());
    this.appendChild(executeButton);
    console.debug("Toolbar connected.");
  }
};
_workarea2 = new WeakMap();
customElements.define("dt-toolbar", Toolbar);

// build/_snowpack/pkg/lz-string.js
var lzString = createCommonjsModule(function(module) {
  var LZString = function() {
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (var i = 0; i < alphabet.length; i++) {
          baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
      }
      return baseReverseDic[alphabet][character];
    }
    var LZString2 = {
      compressToBase64: function(input) {
        if (input == null)
          return "";
        var res = LZString2._compress(input, 6, function(a) {
          return keyStrBase64.charAt(a);
        });
        switch (res.length % 4) {
          default:
          case 0:
            return res;
          case 1:
            return res + "===";
          case 2:
            return res + "==";
          case 3:
            return res + "=";
        }
      },
      decompressFromBase64: function(input) {
        if (input == null)
          return "";
        if (input == "")
          return null;
        return LZString2._decompress(input.length, 32, function(index) {
          return getBaseValue(keyStrBase64, input.charAt(index));
        });
      },
      compressToUTF16: function(input) {
        if (input == null)
          return "";
        return LZString2._compress(input, 15, function(a) {
          return f(a + 32);
        }) + " ";
      },
      decompressFromUTF16: function(compressed) {
        if (compressed == null)
          return "";
        if (compressed == "")
          return null;
        return LZString2._decompress(compressed.length, 16384, function(index) {
          return compressed.charCodeAt(index) - 32;
        });
      },
      compressToUint8Array: function(uncompressed) {
        var compressed = LZString2.compress(uncompressed);
        var buf = new Uint8Array(compressed.length * 2);
        for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
          var current_value = compressed.charCodeAt(i);
          buf[i * 2] = current_value >>> 8;
          buf[i * 2 + 1] = current_value % 256;
        }
        return buf;
      },
      decompressFromUint8Array: function(compressed) {
        if (compressed === null || compressed === void 0) {
          return LZString2.decompress(compressed);
        } else {
          var buf = new Array(compressed.length / 2);
          for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
            buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
          }
          var result = [];
          buf.forEach(function(c) {
            result.push(f(c));
          });
          return LZString2.decompress(result.join(""));
        }
      },
      compressToEncodedURIComponent: function(input) {
        if (input == null)
          return "";
        return LZString2._compress(input, 6, function(a) {
          return keyStrUriSafe.charAt(a);
        });
      },
      decompressFromEncodedURIComponent: function(input) {
        if (input == null)
          return "";
        if (input == "")
          return null;
        input = input.replace(/ /g, "+");
        return LZString2._decompress(input.length, 32, function(index) {
          return getBaseValue(keyStrUriSafe, input.charAt(index));
        });
      },
      compress: function(uncompressed) {
        return LZString2._compress(uncompressed, 16, function(a) {
          return f(a);
        });
      },
      _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null)
          return "";
        var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
        for (ii = 0; ii < uncompressed.length; ii += 1) {
          context_c = uncompressed.charAt(ii);
          if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
          }
          context_wc = context_w + context_c;
          if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
          } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
          }
        }
        if (context_w !== "") {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 8; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 16; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
        }
        value = 2;
        for (i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1 | value & 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
        while (true) {
          context_data_val = context_data_val << 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
          } else
            context_data_position++;
        }
        return context_data.join("");
      },
      decompress: function(compressed) {
        if (compressed == null)
          return "";
        if (compressed == "")
          return null;
        return LZString2._decompress(compressed.length, 32768, function(index) {
          return compressed.charCodeAt(index);
        });
      },
      _decompress: function(length, resetValue, getNextValue) {
        var dictionary = [], enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = {val: getNextValue(0), position: resetValue, index: 1};
        for (i = 0; i < 3; i += 1) {
          dictionary[i] = i;
        }
        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        switch (bits) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;
          case 2:
            return "";
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        while (true) {
          if (data.index > length) {
            return "";
          }
          bits = 0;
          maxpower = Math.pow(2, numBits);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          switch (c = bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;
            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;
            case 2:
              return result.join("");
          }
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
          if (dictionary[c]) {
            entry = dictionary[c];
          } else {
            if (c === dictSize) {
              entry = w + w.charAt(0);
            } else {
              return null;
            }
          }
          result.push(entry);
          dictionary[dictSize++] = w + entry.charAt(0);
          enlargeIn--;
          w = entry;
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
        }
      }
    };
    return LZString2;
  }();
  if (module != null) {
    module.exports = LZString;
  }
});
var lz_string_default = lzString;

// build/_snowpack/pkg/plain-draggable.js
var MSPF = 1e3 / 60;
var KEEP_LOOP = 500;
var tasks = [];
var requestAnim = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
  return setTimeout(callback, MSPF);
};
var cancelAnim = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(requestID2) {
  return clearTimeout(requestID2);
};
var lastFrameTime = Date.now();
var requestID;
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
var PREFIXES = ["webkit", "moz", "ms", "o"];
var NAME_PREFIXES = PREFIXES.reduce(function(prefixes, prefix) {
  prefixes.push(prefix);
  prefixes.push(ucf(prefix));
  return prefixes;
}, []);
var VALUE_PREFIXES = PREFIXES.map(function(prefix) {
  return "-".concat(prefix, "-");
});
var getDeclaration = function() {
  var declaration;
  return function() {
    return declaration = declaration || document.createElement("div").style;
  };
}();
var normalizeName = function() {
  var rePrefixedName = new RegExp("^(?:" + PREFIXES.join("|") + ")(.)", "i"), reUc = /[A-Z]/;
  return function(propName) {
    return (propName = (propName + "").replace(/\s/g, "").replace(/-([\da-z])/gi, function(str, p1) {
      return p1.toUpperCase();
    }).replace(rePrefixedName, function(str, p1) {
      return reUc.test(p1) ? p1.toLowerCase() : str;
    })).toLowerCase() === "float" ? "cssFloat" : propName;
  };
}();
var normalizeValue = function() {
  var rePrefixedValue = new RegExp("^(?:" + VALUE_PREFIXES.join("|") + ")", "i");
  return function(propValue) {
    return (propValue != null ? propValue + "" : "").replace(/\s/g, "").replace(rePrefixedValue, "");
  };
}();
var cssSupports = function() {
  return function(propName, propValue) {
    var declaration = getDeclaration();
    propName = propName.replace(/[A-Z]/g, function(str) {
      return "-".concat(str.toLowerCase());
    });
    declaration.setProperty(propName, propValue);
    return declaration[propName] != null && declaration.getPropertyValue(propName) === propValue;
  };
}();
var propNames = {};
var propValues = {};
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
var ZINDEX = 9e3;
var SNAP_GRAVITY = 20;
var SNAP_CORNER = "tl";
var SNAP_SIDE = "both";
var SNAP_EDGE = "both";
var SNAP_BASE = "containment";
var SNAP_ALL_CORNERS = ["tl", "tr", "bl", "br"];
var SNAP_ALL_SIDES = ["start", "end"];
var SNAP_ALL_EDGES = ["inside", "outside"];
var AUTOSCROLL_SPEED = [40, 200, 1e3];
var AUTOSCROLL_SENSITIVITY = [100, 40, 0];
var IS_EDGE = "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style && !window.navigator.msPointerEnabled;
var IS_TRIDENT = !IS_EDGE && !!document.uniqueID;
var IS_GECKO = "MozAppearance" in document.documentElement.style;
var IS_BLINK = !IS_EDGE && !IS_GECKO && !!window.chrome && !!window.CSS;
var IS_WEBKIT = !IS_EDGE && !IS_TRIDENT && !IS_GECKO && !IS_BLINK && !window.chrome && "WebkitAppearance" in document.documentElement.style;
var isObject = function() {
  var toString = {}.toString, fnToString = {}.hasOwnProperty.toString, objFnString = fnToString.call(Object);
  return function(obj) {
    var proto, constr;
    return obj && toString.call(obj) === "[object Object]" && (!(proto = Object.getPrototypeOf(obj)) || (constr = proto.hasOwnProperty("constructor") && proto.constructor) && typeof constr === "function" && fnToString.call(constr) === objFnString);
  };
}();
var isFinite = Number.isFinite || function(value) {
  return typeof value === "number" && window.isFinite(value);
};
var insProps = {};
var pointerOffset = {};
var pointerEvent = new PointerEvent();
var insId = 0;
var activeProps;
var hasMoved;
var body;
var cssValueDraggableCursor;
var cssValueDraggingCursor;
var cssOrgValueBodyCursor;
var cssPropTransitionProperty;
var cssPropTransform;
var cssPropUserSelect;
var cssOrgValueBodyUserSelect;
var cssWantedValueDraggableCursor = IS_WEBKIT ? ["all-scroll", "move"] : ["grab", "all-scroll", "move"];
var cssWantedValueDraggingCursor = IS_WEBKIT ? "move" : ["grabbing", "move"];
var draggableClass = "plain-draggable";
var draggingClass = "plain-draggable-dragging";
var movingClass = "plain-draggable-moving";
var scrollFrame = {};
var MSPF$1 = 1e3 / 60;
var requestAnim$1 = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
  return setTimeout(callback, MSPF$1);
};
var cancelAnim$1 = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(requestID2) {
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
  curXyMoveArgs = {};
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
var curXyMoveArgs;
var curElement;
var curScrollXY;
var requestID$1;
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
var plain_draggable_default = PlainDraggable;

// build/output/execution/Execution.js
var _consumersToStage, consumersToStage_fn;
var _Execution = class {
  constructor(nodes) {
    _consumersToStage.add(this);
    this.stages = null;
    this.nodes = nodes;
  }
  plan() {
    const roots = new Set();
    for (const node of this.nodes) {
      if (node.inputs.length === 0) {
        roots.add(node);
        continue;
      }
    }
    if (roots.size === 0) {
      return;
    }
    this.stages = [roots];
    let stage = roots;
    while (0 < stage.size) {
      stage = __privateMethod(this, _consumersToStage, consumersToStage_fn).call(this, stage);
      if (0 < stage.size) {
        this.stages.push(stage);
      }
    }
  }
  execute(withUpdateUi = true) {
    if (isNil(this.stages)) {
      return;
    }
    if (withUpdateUi) {
      for (const stage of this.stages) {
        for (const node of stage) {
          node.update();
          node.updateUi();
        }
      }
    } else {
      for (const stage of this.stages) {
        for (const node of stage) {
          node.update();
        }
      }
    }
  }
  static fromNodes(nodes) {
    const execution = new _Execution([...nodes]);
    return execution;
  }
};
var Execution = _Execution;
_consumersToStage = new WeakSet();
consumersToStage_fn = function(roots) {
  const consumers = new Set();
  for (const root of roots) {
    for (const output of root.outputs) {
      for (const input of output.inputs) {
        consumers.add(mustExist(input.target.parent));
      }
    }
  }
  return consumers;
};

// build/output/ui/Locator.js
var Locator = class {
  constructor(workarea, scrollable) {
    this.workarea = workarea;
    this.scrollContainer = scrollable;
  }
  draggableToAbsolute(position) {
    const scrollOffset = this.scrollContainer ? {
      left: this.scrollContainer.scrollLeft,
      top: this.scrollContainer.scrollTop
    } : {
      left: 0,
      top: 0
    };
    return {
      x: position.x - this.workarea.offsetLeft + scrollOffset.left,
      y: position.y - this.workarea.offsetTop + scrollOffset.top
    };
  }
  absoluteToDraggable(position) {
    const scrollOffset = this.scrollContainer ? {
      left: this.scrollContainer.scrollLeft,
      top: this.scrollContainer.scrollTop
    } : {
      left: 0,
      top: 0
    };
    return {
      x: position.x + this.workarea.offsetLeft - scrollOffset.left,
      y: position.y + this.workarea.offsetTop - scrollOffset.top
    };
  }
  static forWorkarea(workarea, scrollable) {
    return new Locator(workarea, scrollable);
  }
};

// build/output/ui/snapshot.js
var snapshot = {
  stage: {
    x: 2845,
    y: 2396
  },
  nodes: [
    {
      type: "seed",
      id: "seed-QNK9dZ",
      name: "Seed",
      x: 3e3,
      y: 3e3,
      inputs: [],
      outputs: [
        {
          id: "output-Rcps9C",
          inputs: ["input-gUjyDm"]
        },
        {
          id: "output-IL0s6U",
          inputs: []
        }
      ]
    },
    {
      type: "seed",
      id: "seed-vgGwv5",
      name: "Seed",
      x: 3065,
      y: 3424,
      inputs: [],
      outputs: [
        {
          id: "output-7ZYio3",
          inputs: []
        },
        {
          id: "output-34yJYx",
          inputs: ["input-HUuye1"]
        }
      ]
    },
    {
      type: "script",
      id: "script-rUMGRx",
      name: "Script",
      x: 3539,
      y: 3276,
      inputs: [
        {
          id: "input-gUjyDm",
          output: "output-Rcps9C"
        },
        {
          id: "input-HUuye1",
          output: "output-34yJYx"
        }
      ],
      outputs: [
        {
          id: "output-v4t1jr",
          inputs: []
        }
      ],
      behavior: {
        metadata: {
          inputs: [
            {
              identifier: "a",
              label: "A"
            },
            {
              identifier: "b",
              label: "B"
            }
          ],
          outputs: [
            {
              identifier: "sum",
              label: "Sum"
            }
          ]
        },
        script: "sum = Number(a) + Number(b);"
      }
    }
  ]
};

// build/output/ui/Workarea.module.css
var _default8 = {};

// build/output/ui/Workarea.js
var _currentConnectionSource, _currentDecoy, _currentDecoyLine, _draggables, _dragOperationSource, _scrollableContainer, _updateDecoy, updateDecoy_fn, _clearDecoy, clearDecoy_fn, _panning, _panInitMouse, _panInitWorkarea, _beginSynchronizedDragOperation, beginSynchronizedDragOperation_fn, _synchronizeDragOperation, synchronizeDragOperation_fn, _initNode, initNode_fn;
var Workarea = class extends HTMLElement {
  constructor() {
    super();
    _updateDecoy.add(this);
    _clearDecoy.add(this);
    _beginSynchronizedDragOperation.add(this);
    _synchronizeDragOperation.add(this);
    _initNode.add(this);
    _currentConnectionSource.set(this, void 0);
    _currentDecoy.set(this, void 0);
    _currentDecoyLine.set(this, void 0);
    _draggables.set(this, void 0);
    _dragOperationSource.set(this, void 0);
    _scrollableContainer.set(this, void 0);
    _panning.set(this, void 0);
    _panInitMouse.set(this, void 0);
    _panInitWorkarea.set(this, void 0);
    this.nodes = new Array();
    this.connections = new Set();
    __privateSet(this, _currentConnectionSource, null);
    __privateSet(this, _currentDecoy, null);
    __privateSet(this, _currentDecoyLine, null);
    __privateSet(this, _draggables, new Map());
    __privateSet(this, _dragOperationSource, new Map());
    __privateSet(this, _scrollableContainer, null);
    __privateSet(this, _panning, false);
    __privateSet(this, _panInitMouse, [0, 0]);
    __privateSet(this, _panInitWorkarea, [0, 0]);
    console.debug("Workarea constructed.");
  }
  get selectedNodes() {
    return this.nodes.filter((node) => node.selected);
  }
  connectedCallback() {
    this.classList.add(_default8.workarea);
    this.addEventListener("click", (event) => this.onClick(event));
    this.addEventListener("mousedown", (event) => this.onMouseDown(event));
    this.addEventListener("mousemove", (event) => this.onMouseMove(event));
    this.addEventListener("mouseup", (event) => this.onMouseUp(event));
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("keyup", (event) => this.onKeyUp(event));
    console.debug("Workarea connected.");
  }
  initConnectionFrom(columnSource, event) {
    __privateSet(this, _currentConnectionSource, columnSource);
    const decoy = document.createElement("dt-decoy");
    decoy.init(this);
    this.appendChild(decoy);
    __privateSet(this, _currentDecoy, decoy);
    __privateSet(this, _currentDecoyLine, new LeaderLine(__privateGet(this, _currentConnectionSource), __privateGet(this, _currentDecoy), {
      color: "#0078d7",
      endSocket: "left",
      startSocket: "right"
    }));
    __privateMethod(this, _updateDecoy, updateDecoy_fn).call(this, event);
  }
  finalizeConnection(columnTarget) {
    if (!__privateGet(this, _currentConnectionSource)) {
      return;
    }
    this.connect(__privateGet(this, _currentConnectionSource), columnTarget);
  }
  updateConnections() {
    for (const connection of this.connections) {
      connection.line.position();
    }
    for (const node of this.nodes) {
      if (node.behaviorEditor) {
        node.behaviorEditor.line?.position();
      }
    }
  }
  connect(columnSource, columnTarget) {
    const connection = new Connection(columnSource, columnTarget);
    columnSource.connect(connection);
    columnTarget.connect(connection);
    this.connections.add(connection);
    this.storeSnapshot();
  }
  disconnect(connection) {
    this.connections.delete(connection);
    connection.disconnect();
    connection.target.parent?.updateUi();
  }
  disconnectNode(node, updateSnapshot = true) {
    for (const input of node.inputs) {
      if (input.output) {
        if (!this.connections.has(input.output)) {
          continue;
        }
        input.output.disconnect();
        this.connections.delete(input.output);
      }
    }
    for (const output of node.outputs) {
      for (const connection of output.inputs) {
        if (!this.connections.has(connection)) {
          continue;
        }
        connection.disconnect();
        this.connections.delete(connection);
      }
    }
    if (updateSnapshot) {
      this.storeSnapshot();
    }
  }
  editNodeBehavior(node, event) {
    if (node.behaviorEditor) {
      node.behaviorEditor.onClickDelete(event);
      return;
    }
    const editor = document.createElement("dt-node-editor");
    this.appendChild(editor);
    editor.init();
    editor.editNodeBehavior(node);
    editor.updateUi();
    const position = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).absoluteToDraggable({
      x: node.x + 250,
      y: node.y - 250
    });
    const draggable = new plain_draggable_default(editor, {
      autoScroll: true,
      handle: editor.getElementsByTagName("title")[0],
      left: position.x,
      onDragStart: (event2) => {
        __privateMethod(this, _beginSynchronizedDragOperation, beginSynchronizedDragOperation_fn).call(this, node);
      },
      onMove: (newPosition) => {
        __privateMethod(this, _synchronizeDragOperation, synchronizeDragOperation_fn).call(this, node, newPosition);
        editor.updateUi();
      },
      top: position.y
    });
    __privateGet(this, _draggables).set(editor, draggable);
    editor.line = new LeaderLine(editor, mustExist(node.editElement), {
      color: "#888",
      dash: {len: 2, gap: 4},
      endSocket: "top",
      path: "grid",
      size: 2
    });
  }
  cancelBehaviorEditor(node, event) {
    if (!node.behaviorEditor) {
      return;
    }
    node.behaviorEditor.line?.remove();
    this.removeChild(node.behaviorEditor);
    __privateGet(this, _draggables).delete(node.behaviorEditor);
    node.behaviorEditor = null;
    node.updateUi();
  }
  closeBehaviorEditor(node, event) {
    if (!node.behaviorEditor) {
      return;
    }
    node.updateBehavior(Behavior.fromEditableScript(node.behaviorEditor.behaviorSource));
    this.cancelBehaviorEditor(node, event);
  }
  onClick(event) {
    if (event.target !== this) {
      return;
    }
  }
  onMouseDown(event) {
    if (__privateGet(this, _scrollableContainer) && event.button === 1) {
      __privateSet(this, _panning, true);
      __privateSet(this, _panInitMouse, [event.x, event.y]);
      __privateSet(this, _panInitWorkarea, [
        __privateGet(this, _scrollableContainer).scrollLeft,
        __privateGet(this, _scrollableContainer).scrollTop
      ]);
    }
  }
  onMouseMove(event) {
    if (__privateGet(this, _currentDecoy)) {
      __privateMethod(this, _updateDecoy, updateDecoy_fn).call(this, event);
    }
    if (__privateGet(this, _scrollableContainer) && __privateGet(this, _panning)) {
      __privateGet(this, _scrollableContainer).scrollLeft = __privateGet(this, _panInitWorkarea)[0] + __privateGet(this, _panInitMouse)[0] - event.x;
      __privateGet(this, _scrollableContainer).scrollTop = __privateGet(this, _panInitWorkarea)[1] + __privateGet(this, _panInitMouse)[1] - event.y;
    }
  }
  onMouseUp(event) {
    __privateSet(this, _currentConnectionSource, null);
    __privateMethod(this, _clearDecoy, clearDecoy_fn).call(this);
    __privateSet(this, _panning, false);
    if (event.target === this) {
      for (const node of [...this.selectedNodes]) {
        node.deselect();
      }
    }
  }
  onKeyDown(event) {
  }
  onKeyUp(event) {
    return;
    switch (event.keyCode) {
      case 49: {
        this.createNode("seed");
        break;
      }
      case 50: {
        this.createNode("noop");
        break;
      }
      case 51: {
        this.createNode("script");
        break;
      }
      case 52: {
        this.createNode("row");
        break;
      }
      case 67:
        this.clear();
        break;
      case 82:
        this.restoreSnapshot();
        break;
      case 88:
        this.export();
        break;
      default:
        console.debug(event.keyCode);
    }
  }
  onNodeSelect(node, event) {
  }
  onNodeDeselect(node, event) {
  }
  onNodeResize(node) {
    if (node instanceof NodeEditor) {
      node.line?.position();
    }
  }
  registerScrollableContainer(scrollable) {
    __privateSet(this, _scrollableContainer, scrollable);
  }
  createNode(type, initParameters) {
    let node = null;
    switch (type) {
      case "script": {
        node = document.createElement("dt-node-script");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "noop": {
        node = document.createElement("dt-node-noop");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "row": {
        node = document.createElement("dt-node-row");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "seed": {
        node = document.createElement("dt-node-seed");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "_editor":
        throw new Error("Behavior editors can not be created through this code path.");
    }
    return node;
  }
  deleteNode(node, updateSnapshot = true) {
    if (node instanceof NodeEditor) {
      this.cancelBehaviorEditor(mustExist(node.target));
      return;
    }
    if (node.behaviorEditor) {
      this.cancelBehaviorEditor(node);
    }
    this.disconnectNode(node, updateSnapshot);
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.removeChild(node);
    __privateGet(this, _draggables).delete(node);
    if (updateSnapshot) {
      this.storeSnapshot();
    }
  }
  deleteSelectedNodes() {
    for (const node of [...this.selectedNodes]) {
      this.deleteNode(node);
    }
  }
  clear() {
    for (const node of [...this.nodes]) {
      this.deleteNode(node, false);
    }
  }
  execute() {
    const execution = Execution.fromNodes(this.nodes);
    execution.plan();
    execution.execute();
  }
  export() {
    const serialized = this.serialize();
    const pretty = JSON.stringify(serialized, void 0, 2);
    const short = JSON.stringify(serialized);
    const compressed = lz_string_default.compressToBase64(short);
    console.debug(pretty);
    console.info(`http://localhost:8080/#${compressed}`);
  }
  import(compressedSnapshot) {
    const short = lz_string_default.decompressFromBase64(compressedSnapshot);
    if (short === null) {
      throw new Error("Unable to decompress snapshot!");
    }
    const parsed = JSON.parse(short);
    this.deserialize(parsed);
  }
  storeSnapshot() {
    const snapshot2 = this.serialize();
    localStorage.setItem("snapshot", JSON.stringify(snapshot2));
    console.debug("Snapshot updated.");
  }
  restoreSnapshot() {
    const snapshotItem = localStorage.getItem("snapshot");
    if (snapshotItem === null) {
      return;
    }
    const snapshot2 = JSON.parse(snapshotItem);
    this.deserialize(snapshot2);
  }
  restoreSnapshotDemo() {
    this.deserialize(snapshot);
  }
  deserialize(workarea) {
    this.clear();
    const nodes = new Map();
    const inputs = new Map();
    const outputs = new Map();
    for (const node of workarea.nodes) {
      const createdNode = this.createNode(node.type, node);
      nodes.set(mustExist(createdNode.nodeId), createdNode);
      for (const input of createdNode.inputs) {
        inputs.set(mustExist(input.columnId), input);
      }
      for (const output of createdNode.outputs) {
        outputs.set(mustExist(output.columnId), output);
      }
    }
    for (const node of workarea.nodes) {
      for (const output of node.outputs) {
        for (const inputId of output.inputs) {
          this.connect(mustExist(outputs.get(output.id)), mustExist(inputs.get(inputId)));
        }
      }
    }
    for (const node of this.nodes) {
      for (const input of node.inputs) {
        input.update();
        input.updateUi();
      }
    }
    if (!isNil(workarea.stage) && !isNil(__privateGet(this, _scrollableContainer))) {
      __privateGet(this, _scrollableContainer).scroll(workarea.stage.x, workarea.stage.y);
    }
  }
  serialize() {
    return {
      stage: __privateGet(this, _scrollableContainer) ? {x: __privateGet(this, _scrollableContainer).scrollLeft, y: __privateGet(this, _scrollableContainer).scrollTop} : void 0,
      nodes: this.nodes.map((node) => node.serialize())
    };
  }
};
_currentConnectionSource = new WeakMap();
_currentDecoy = new WeakMap();
_currentDecoyLine = new WeakMap();
_draggables = new WeakMap();
_dragOperationSource = new WeakMap();
_scrollableContainer = new WeakMap();
_updateDecoy = new WeakSet();
updateDecoy_fn = function(event) {
  if (!isNil(__privateGet(this, _currentDecoy))) {
    const bounds = this.getBoundingClientRect();
    __privateGet(this, _currentDecoy).style.transform = `translate(${event.pageX - bounds.left}px, ${event.pageY - bounds.top}px)`;
  }
  if (!isNil(__privateGet(this, _currentDecoyLine))) {
    __privateGet(this, _currentDecoyLine).position();
  }
};
_clearDecoy = new WeakSet();
clearDecoy_fn = function() {
  if (!isNil(__privateGet(this, _currentDecoy))) {
    this.removeChild(__privateGet(this, _currentDecoy));
    __privateSet(this, _currentDecoy, null);
  }
  if (!isNil(__privateGet(this, _currentDecoyLine))) {
    __privateGet(this, _currentDecoyLine).remove();
    __privateSet(this, _currentDecoyLine, null);
  }
};
_panning = new WeakMap();
_panInitMouse = new WeakMap();
_panInitWorkarea = new WeakMap();
_beginSynchronizedDragOperation = new WeakSet();
beginSynchronizedDragOperation_fn = function(dragRoot) {
  __privateGet(this, _dragOperationSource).clear();
  __privateGet(this, _dragOperationSource).set(dragRoot, {x: dragRoot.x, y: dragRoot.y});
  const locator = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0);
  for (const node of this.selectedNodes) {
    __privateGet(this, _dragOperationSource).set(node, locator.absoluteToDraggable({x: node.x, y: node.y}));
  }
};
_synchronizeDragOperation = new WeakSet();
synchronizeDragOperation_fn = function(dragRoot, newPosition) {
  const rootDragSource = mustExist(__privateGet(this, _dragOperationSource).get(dragRoot));
  const deltaX = newPosition.left - rootDragSource.x;
  const deltaY = newPosition.top - rootDragSource.y;
  for (const node of this.selectedNodes) {
    if (node === dragRoot) {
      continue;
    }
    const nodeDragSource = mustExist(__privateGet(this, _dragOperationSource).get(node));
    const nodeDraggable = mustExist(__privateGet(this, _draggables).get(node));
    const position = {
      x: nodeDragSource.x + deltaX,
      y: nodeDragSource.y + deltaY
    };
    nodeDraggable.left = position.x;
    nodeDraggable.top = position.y;
    const positionAbsolute = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).draggableToAbsolute(position);
    node.x = positionAbsolute.x;
    node.y = positionAbsolute.y;
    node.updateUi();
  }
};
_initNode = new WeakSet();
initNode_fn = function(node, initParameters) {
  this.appendChild(node);
  node.init(initParameters);
  this.nodes.push(node);
  const containerBounds = __privateGet(this, _scrollableContainer) ? {
    width: __privateGet(this, _scrollableContainer).clientWidth,
    height: __privateGet(this, _scrollableContainer).clientHeight
  } : {
    width: this.clientWidth,
    height: this.clientHeight
  };
  let position;
  if (!isNil(initParameters) && !isNil(initParameters.x) && !isNil(initParameters.y)) {
    position = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).absoluteToDraggable(initParameters);
  } else {
    position = {
      x: this.offsetLeft + containerBounds.width / 2 - node.clientWidth / 2,
      y: this.offsetTop + containerBounds.height / 2 - node.clientHeight / 2
    };
  }
  const draggable = new plain_draggable_default(node, {
    autoScroll: true,
    handle: node.getElementsByTagName("title")[0],
    left: position.x,
    onDragEnd: (newPosition) => {
      node.updateUi(Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).draggableToAbsolute({
        x: newPosition.left,
        y: newPosition.top
      }));
      console.debug(`Node ${node.nodeId} moved to ${node.x}x${node.y} (movement was ${newPosition.left}x${newPosition.top}).`);
      this.storeSnapshot();
    },
    onDragStart: (event) => {
      __privateMethod(this, _beginSynchronizedDragOperation, beginSynchronizedDragOperation_fn).call(this, node);
    },
    onMove: (newPosition) => {
      __privateMethod(this, _synchronizeDragOperation, synchronizeDragOperation_fn).call(this, node, newPosition);
      mustExist(node).updateUi();
    },
    top: position.y
  });
  __privateGet(this, _draggables).set(node, draggable);
  const coords = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).draggableToAbsolute(position);
  node.updateUi(coords);
  console.debug(`Created node ${node.nodeId} at ${node.x}x${node.y}.`);
  this.storeSnapshot();
};
customElements.define("dt-workarea", Workarea);

// build/output/index.js
window.addEventListener("load", () => {
  const href = window.location.href;
  const hashPosition = href.lastIndexOf("#");
  if (-1 < hashPosition) {
    const payload = href.substring(hashPosition + 1);
    const workarea = document.getElementById("workarea");
    workarea.import(payload);
  }
});
export {
  Behavior,
  BehaviorMetadata,
  Column,
  Connection,
  Decoy,
  Input,
  MatchInputMarkup,
  MatchOutputMarkup,
  MatchTitleMarkup,
  Node2 as Node,
  NodeEditor,
  NodeNoop,
  NodeRow,
  NodeScript,
  NodeSeed,
  Output,
  Scrollable,
  Toolbar,
  Workarea
};
