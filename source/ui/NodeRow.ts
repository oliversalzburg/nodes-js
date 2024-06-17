import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { Behavior } from "../behavior/Behavior.js";
import { Node } from "./Node.js";
import { SerializedNode } from "./Workarea.js";

/**
 * A row node contains a row of outputs.
 */
export class NodeRow extends Node {
  /**
   * Constructs a new row node.
   */
  constructor() {
    super("row", "Row");

    this.hasBehavior = true;
  }

  /**
   * Retrieves the constructor for this Node.
   * @returns The constructor for this Node.
   */
  getFactory(): ConstructorOf<Node> {
    return NodeRow;
  }

  /**
   * Initializes a new instance of the Node.
   * @param initParameters - The parameters for the Node.
   */
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
        NodeRow,
      ),
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-row", NodeRow);
