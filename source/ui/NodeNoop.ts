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

  async connectedCallback() {
    super.connectedCallback();

    await this.updateBehavior(
      await Behavior.fromCodeFragment(
        `this._title("Noop");
this._input("Sink")`,
        NodeNoop
      )
    );

    this.rebuildFromMetadata();
  }

  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-noop", NodeNoop);
