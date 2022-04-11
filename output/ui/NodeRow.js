import {Behavior} from "../behavior/Behavior.js";
import {Node} from "./Node.js";
export class NodeRow extends Node {
  constructor() {
    super("row", "Row");
    this.hasBehavior = true;
  }
  getFactory() {
    return NodeRow;
  }
  async init(initParameters) {
    await super.init(initParameters);
    this.updateBehavior(await Behavior.fromCodeFragment(initParameters?.behavior?.script ?? `this._title("Row");
for(let inputIndex = 0; inputIndex < 5; ++inputIndex) { 
  const output = this._output(\`Output \${inputIndex}\`);
  output.update(inputIndex * 2);
}`, NodeRow));
    this.rebuildFromMetadata();
    this.updateUi();
  }
}
customElements.define("dt-node-row", NodeRow);
