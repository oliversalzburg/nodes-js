import { Behavior } from "../behavior/Behavior";
import { ConstructorOf } from "../Mixins";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeScript extends Node {
  constructor() {
    super("script", "Script");

    this.hasBehavior = true;
  }

  getFactory(): ConstructorOf<Node> {
    return NodeScript;
  }

  async connectedCallback() {
    super.connectedCallback();

    await this.updateBehavior(
      await Behavior.fromCodeFragment(
        `this._title("Sum");
const a = this._input("A");
const b = this._input("B");
let sum = this._output("Sum");
sum.update( Number(a) + Number(b));`,
        NodeScript
      )
    );

    this.rebuildFromMetadata();
  }

  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-script", NodeScript);
