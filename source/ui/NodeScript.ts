import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeScript extends Node {
  constructor() {
    super("script", "Script");

    this.hasBehavior = true;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.behavior = Behavior.fromCodeFragment(
      "sum = Number(a) + Number(b);",
      new BehaviorMetadata(
        [
          { identifier: "a", label: "A" },
          { identifier: "b", label: "B" },
        ],
        [{ identifier: "sum", label: "Sum" }]
      )
    );

    this.rebuildIoFromMetadata();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-script", NodeScript);
