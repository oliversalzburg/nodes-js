import { Behavior } from "../behavior/Behavior";
import { ConstructorOf } from "../Mixins";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeNoop extends Node {
  constructor() {
    super("noop", "Noop");

    this.hasBehavior = true;
  }

  getFactory(): ConstructorOf<Node> {
    return NodeNoop;
  }

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
