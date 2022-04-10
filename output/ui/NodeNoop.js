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
    await this.updateBehavior(await Behavior.fromCodeFragment(`this._title("Noop");
this._input("Sink")`, NodeNoop));
    this.rebuildFromMetadata();
    this.updateUi();
  }
}
customElements.define("dt-node-noop", NodeNoop);
