import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { Behavior } from "../behavior/Behavior.js";
import { Node } from "./Node.js";
import { SerializedNode } from "./Workarea.js";

/**
 * A node that does nothing.
 */
export class NodeNoop extends Node {
  /**
   * Constructs a new noop node.
   */
  constructor() {
    super("noop", "Noop");

    this.hasBehavior = true;
  }

  /**
   * Retrieves the constructor for this Node.
   * @returns The constructor for this Node.
   */
  getFactory(): ConstructorOf<Node> {
    return NodeNoop;
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
          `this._title("Noop");
this._input("Sink")`,
        NodeNoop,
      ),
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-noop", NodeNoop);
