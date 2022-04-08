import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeNoop extends Node {
  constructor() {
    super("noop", "Noop");

    this.hasBehavior = true;
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateBehavior(
      Behavior.fromCodeFragment(
        "",
        new BehaviorMetadata("Noop", [{ identifier: "sink", label: "Sink" }], [])
      )
    );

    this.rebuildFromMetadata();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.inputs[0].init(initParameters?.inputs[0]);

    this.updateUi();
  }
}

customElements.define("dt-node-noop", NodeNoop);
