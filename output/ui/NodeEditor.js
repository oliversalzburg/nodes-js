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
var _textarea, _resizeObserver;
import {mustExist} from "../Maybe.js";
import {Node} from "./Node.js";
export class NodeEditor extends Node {
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
}
_textarea = new WeakMap();
_resizeObserver = new WeakMap();
customElements.define("dt-node-editor", NodeEditor);