import { Behavior } from "../behavior/Behavior";
import { ConstructorOf } from "../Mixins";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeRow extends Node {
  constructor() {
    super("row", "Row");

    this.hasBehavior = true;
  }

  getFactory(): ConstructorOf<Node> {
    return NodeRow;
  }

  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.updateBehavior(
      await Behavior.fromCodeFragment(
        initParameters?.behavior?.script ??
          `this._title("Row");
for(let inputIndex = 0; inputIndex < 5; ++inputIndex) { 
  const output = this._output(\`Output \${inputIndex}\`);
  output.update(inputIndex * 2);
}`,
        NodeRow
      )
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-row", NodeRow);
