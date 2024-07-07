import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import arbit, { ArbitGenerator } from "arbit";
import { Behavior } from "../behavior/Behavior.js";
import { Node } from "./Node.js";
import { SerializedNode } from "./Workarea.js";

/**
 * A node that provides a random number generator.
 */
export class NodeSeed extends Node {
  /**
   * The instance of the random number generator.
   */
  random: ArbitGenerator;

  /**
   * Constructs a new seed node.
   */
  constructor() {
    super("seed", "Seed");

    this.hasBehavior = true;
    this.random = arbit(this.nodeId);
  }

  /**
   * Retrieves the constructor for this Node.
   * @returns The constructor for this Node.
   */
  getFactory(): ConstructorOf<Node> {
    return NodeSeed;
  }

  /**
   * Initializes a new instance of the Node.
   * @param initParameters - The parameters for the Node.
   */
  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.random = arbit(mustExist(this.nodeId));

    this.updateBehavior(
      await Behavior.fromCodeFragment(
        initParameters?.behavior?.script ??
          `this._title("Seed");

let float = this._output("Float");
let int = this._output("Int");

float.update(this.random());
int.update(this.random.nextInt(256));`,
        NodeSeed,
      ),
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-seed", NodeSeed);
