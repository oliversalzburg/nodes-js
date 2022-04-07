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

  async update() {
    await super.update();

    if (this.behaviorCompiled) {
      this.behaviorCompiled();
    } else {
      this.outputs[0].value = Number(this.inputs[0].value) + Number(this.inputs[1].value);
    }
  }
}

customElements.define("dt-node-script", NodeScript);
