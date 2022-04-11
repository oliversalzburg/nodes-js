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
var _scrollableContainer, _workarea, _canvas, _intervalHandle;
import {isNil, mustExist} from "../Maybe.js";
import {Locator} from "./Locator.js";
import styles from "./MiniMap.module.css.proxy.js";
export class MiniMap extends HTMLElement {
  constructor() {
    super(...arguments);
    _scrollableContainer.set(this, void 0);
    _workarea.set(this, void 0);
    _canvas.set(this, void 0);
    _intervalHandle.set(this, void 0);
    __privateSet(this, _scrollableContainer, null);
    __privateSet(this, _workarea, null);
    __privateSet(this, _canvas, null);
    __privateSet(this, _intervalHandle, null);
  }
  connectedCallback() {
    this.classList.add(styles.minimap);
    const forWorkarea = this.getAttribute("for");
    if (isNil(forWorkarea)) {
      throw new Error("Missing `for` attribute on dt-minimap. Requires an ID of a dt-workarea.");
    }
    __privateSet(this, _workarea, mustExist(document.getElementById(forWorkarea)));
    __privateSet(this, _scrollableContainer, this.parentElement);
    __privateSet(this, _canvas, document.createElement("canvas"));
    __privateGet(this, _canvas).width = this.clientWidth * devicePixelRatio;
    __privateGet(this, _canvas).height = this.clientHeight * devicePixelRatio;
    this.appendChild(__privateGet(this, _canvas));
    __privateSet(this, _intervalHandle, setInterval(() => this.update(), 1e3));
  }
  disconnectedCallback() {
    if (__privateGet(this, _intervalHandle) !== null) {
      clearInterval(__privateGet(this, _intervalHandle));
      __privateSet(this, _intervalHandle, null);
    }
  }
  update() {
    if (isNil(__privateGet(this, _canvas)) || isNil(__privateGet(this, _scrollableContainer)) || isNil(__privateGet(this, _workarea))) {
      return;
    }
    const context = mustExist(__privateGet(this, _canvas).getContext("2d"));
    const locator = Locator.forWorkarea(__privateGet(this, _workarea));
    context.clearRect(0, 0, __privateGet(this, _canvas).width, __privateGet(this, _canvas).height);
    for (const node of mustExist(__privateGet(this, _workarea)).nodes) {
      const position2 = locator.absoluteToMiniMap({x: node.x, y: node.y}, __privateGet(this, _canvas));
      context.beginPath();
      context.rect(position2.x, position2.y, 6, 3);
      context.fillStyle = "#666";
      context.fill();
      context.closePath();
    }
    const position = locator.absoluteToMiniMap({x: __privateGet(this, _scrollableContainer).scrollLeft, y: __privateGet(this, _scrollableContainer).scrollTop}, __privateGet(this, _canvas));
    const size = locator.absoluteToMiniMap({
      x: __privateGet(this, _scrollableContainer).clientWidth,
      y: __privateGet(this, _scrollableContainer).clientHeight
    }, __privateGet(this, _canvas));
    context.beginPath();
    context.rect(position.x, position.y, size.x, size.y);
    context.lineWidth = 1;
    context.strokeStyle = "#111";
    context.stroke();
    context.closePath();
  }
}
_scrollableContainer = new WeakMap();
_workarea = new WeakMap();
_canvas = new WeakMap();
_intervalHandle = new WeakMap();
customElements.define("dt-minimap", MiniMap);
