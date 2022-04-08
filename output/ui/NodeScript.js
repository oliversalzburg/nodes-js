import {Behavior} from "../behavior/Behavior.js";
import {BehaviorMetadata} from "../behavior/BehaviorMetadata.js";
import {Node} from "./Node.js";
export class NodeScript extends Node {
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
}
customElements.define("dt-node-script", NodeScript);
