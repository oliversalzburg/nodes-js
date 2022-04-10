import {Behavior} from "../behavior/Behavior.js";
import {Node} from "./Node.js";
export class NodeScript extends Node {
  constructor() {
    super("script", "Script");
    this.hasBehavior = true;
  }
  getFactory() {
    return NodeScript;
  }
  async connectedCallback() {
    super.connectedCallback();
    await this.updateBehavior(await Behavior.fromCodeFragment(`this._title("Sum");
const a = this._input("A");
const b = this._input("B");
let sum = this._output("Sum");
sum.update( Number(a) + Number(b));`, NodeScript));
    this.rebuildFromMetadata();
  }
  async init(initParameters) {
    await super.init(initParameters);
    this.updateUi();
  }
}
customElements.define("dt-node-script", NodeScript);
