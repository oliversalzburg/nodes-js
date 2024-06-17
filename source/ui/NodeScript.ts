import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { Behavior } from "../behavior/Behavior.js";
import { Node } from "./Node.js";
import { SerializedNode } from "./Workarea.js";

/**
 * A node that contains a script.
 */
export class NodeScript extends Node {
  /**
   * Constructs a new script node.
   */
  constructor() {
    super("script", "Script");

    this.hasBehavior = true;
  }

  /**
   * Retrieves the constructor for this Node.
   * @returns The constructor for this Node.
   */
  getFactory(): ConstructorOf<Node> {
    return NodeScript;
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
          `this._title("Sum");
const a = this._input("A");
const b = this._input("B");
let sum = this._output("Sum");
sum.update( Number(a) + Number(b));`,
        NodeScript,
      ),
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-script", NodeScript);
