import { Behavior } from "../behavior/Behavior";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeScript extends Node {
  constructor() {
    super("script", "Script");

    this.hasBehavior = true;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.updateBehavior(
      Behavior.fromCodeFragment(
        `this._title("Sum");
const a = this._input("A");
const b = this._input("B");
let sum = this._output("Sum");
sum.update( Number(a) + Number(b));`
      )
    );

    this.rebuildFromMetadata();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-script", NodeScript);
