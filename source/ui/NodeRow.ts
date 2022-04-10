import { Behavior } from "../behavior/Behavior";
import { ConstructorOf } from "../Mixins";
import { Node } from "./Node";
import { Output } from "./Output";
import { SerializedNode } from "./Workarea";

export class NodeRow extends Node {
  #outputIntElements = new Array<Output>();

  constructor() {
    super("row", "Row");

    this.hasBehavior = true;
  }

  getFactory(): ConstructorOf<Node> {
    return NodeRow;
  }

  async connectedCallback() {
    super.connectedCallback();

    await this.updateBehavior(
      await Behavior.fromCodeFragment(
        `this._title("Row");
for(let inputIndex = 0; inputIndex < 5; ++inputIndex) { 
  const output = this._output(\`Output \${inputIndex}\`);
  output.update(inputIndex * 2);
}`,
        NodeRow
      )
    );

    this.rebuildFromMetadata();
  }

  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-row", NodeRow);
