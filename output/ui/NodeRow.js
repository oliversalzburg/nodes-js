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
import {BehaviorMetadata} from "../behavior/BehaviorMetadata.js";
import {mustExist} from "../Maybe.js";
import {Node} from "./Node.js";
export class NodeRow extends Node {
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
}
_outputIntElements = new WeakMap();
customElements.define("dt-node-row", NodeRow);
