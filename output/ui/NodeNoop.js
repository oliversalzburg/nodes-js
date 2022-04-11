import {Behavior} from "../behavior/Behavior.js";
import {Node} from "./Node.js";
export class NodeNoop extends Node {
  constructor() {
    super("noop", "Noop");
    this.hasBehavior = true;
  }
  getFactory() {
    return NodeNoop;
  }
  async init(initParameters) {
    await super.init(initParameters);
    this.updateBehavior(await Behavior.fromCodeFragment(initParameters?.behavior?.script ?? `this._title("Noop");
this._input("Sink")`, NodeNoop));
    this.rebuildFromMetadata();
    this.updateUi();
  }
}
customElements.define("dt-node-noop", NodeNoop);
