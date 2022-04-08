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
var _workarea;
import {mustExist} from "../Maybe.js";
import styles from "./Scrollable.module.css.proxy.js";
export class Scrollable extends HTMLElement {
  constructor() {
    super();
    _workarea.set(this, void 0);
    __privateSet(this, _workarea, null);
    console.debug("Scrollable constructed.");
  }
  connectedCallback() {
    __privateSet(this, _workarea, this.querySelector("dt-workarea"));
    this.classList.add(styles.scrollable);
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
}
_workarea = new WeakMap();
customElements.define("dt-scrollable", Scrollable);
