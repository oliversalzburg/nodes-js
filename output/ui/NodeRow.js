var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _outputIntElements;
import {Behavior} from "../behavior/Behavior.js";
import {Node} from "./Node.js";
const _NodeRow = class extends Node {
  constructor() {
    super("row", "Row");
    _outputIntElements.set(this, void 0);
    __privateSet(this, _outputIntElements, new Array());
    this.hasBehavior = true;
  }
  getFactory() {
    return _NodeRow;
  }
  async connectedCallback() {
    super.connectedCallback();
    await this.updateBehavior(await Behavior.fromCodeFragment(`this._title("Row");
for(let inputIndex = 0; inputIndex < 5; ++inputIndex) { 
  const output = this._output(\`Output \${inputIndex}\`);
  output.update(inputIndex * 2);
}`, _NodeRow));
    this.rebuildFromMetadata();
  }
  async init(initParameters) {
    await super.init(initParameters);
    this.updateUi();
  }
};
export let NodeRow = _NodeRow;
_outputIntElements = new WeakMap();
customElements.define("dt-node-row", NodeRow);
