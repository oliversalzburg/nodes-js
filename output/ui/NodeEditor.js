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
var _textarea, _resizeObserver, _codeMirror;
import "../../_snowpack/pkg/codemirror.js";
import CodeMirror from "../../_snowpack/pkg/codemirror.js";
import "../../_snowpack/pkg/codemirror/addon/hint/javascript-hint.js";
import "../../_snowpack/pkg/codemirror/addon/hint/show-hint.js";
import "../../_snowpack/pkg/codemirror/addon/hint/show-hint.css.proxy.js";
import "../../_snowpack/pkg/codemirror/lib/codemirror.css.proxy.js";
import "../../_snowpack/pkg/codemirror/mode/javascript/javascript.js";
import "../../_snowpack/pkg/codemirror/theme/mdn-like.css.proxy.js";
import {mustExist} from "../Maybe.js";
import {Confirm} from "./Confirm.js";
import {Node} from "./Node.js";
const _NodeEditor = class extends Node {
  constructor() {
    super("_editor", "Behavior Editor");
    _textarea.set(this, void 0);
    _resizeObserver.set(this, void 0);
    _codeMirror.set(this, void 0);
    __privateSet(this, _textarea, null);
    __privateSet(this, _resizeObserver, null);
    __privateSet(this, _codeMirror, null);
    this.target = null;
    this.line = null;
    this.hasIo = false;
  }
  getFactory() {
    return _NodeEditor;
  }
  get behaviorSource() {
    return __privateGet(this, _codeMirror)?.getValue() ?? "";
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _textarea, document.createElement("textarea"));
    __privateGet(this, _textarea).setAttribute("spellcheck", "false");
    this.appendChild(__privateGet(this, _textarea));
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
    __privateSet(this, _codeMirror, CodeMirror.fromTextArea(mustExist(__privateGet(this, _textarea)), {
      extraKeys: {"Ctrl-Space": "autocomplete"},
      lineNumbers: true,
      mode: {name: "javascript"},
      showHint: true,
      theme: "mdn-like"
    }));
    __privateGet(this, _resizeObserver)?.disconnect();
    __privateSet(this, _resizeObserver, new ResizeObserver(() => {
      this.workarea?.onNodeResize(this);
    }));
    __privateGet(this, _resizeObserver).observe(__privateGet(this, _codeMirror).getWrapperElement());
  }
  async onClickDelete(event) {
    if (this.behaviorSource !== this.target?.behavior?.toEditableScript()) {
      const shouldApply = await Confirm.yesNoCancel("Apply new behavior?");
      if (shouldApply === Confirm.YES) {
        await this.workarea?.closeBehaviorEditor(mustExist(this.target));
        return;
      } else if (shouldApply === Confirm.CANCEL) {
        return;
      }
    }
    super.onClickDelete(event);
  }
  async init(initParameters) {
    await super.init(initParameters);
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
export let NodeEditor = _NodeEditor;
_textarea = new WeakMap();
_resizeObserver = new WeakMap();
_codeMirror = new WeakMap();
customElements.define("dt-node-editor", NodeEditor);
