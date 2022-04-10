import arbit, { ArbitGenerator } from "arbit";
import { Behavior } from "../behavior/Behavior";
import { mustExist } from "../Maybe";
import { ConstructorOf } from "../Mixins";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeSeed extends Node {
  random: ArbitGenerator;

  constructor() {
    super("seed", "Seed");

    this.hasBehavior = true;
    this.random = arbit(this.nodeId);
  }

  getFactory(): ConstructorOf<Node> {
    return NodeSeed;
  }

  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.random = arbit(mustExist(this.nodeId));

    await this.updateBehavior(
      await Behavior.fromCodeFragment(
        initParameters?.behavior?.script ??
          `this._title("Seed");

let float = this._output("Float");
let int = this._output("Int");

float.update(this.random());
int.update(this.random.nextInt(256));`,
        NodeSeed
      )
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-seed", NodeSeed);
