import arbit, { ArbitGenerator } from "arbit";
import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { mustExist } from "../Maybe";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeSeed extends Node {
  random: ArbitGenerator;

  constructor() {
    super("seed", "Seed");

    this.hasBehavior = true;
    this.random = arbit(this.nodeId);
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateBehavior(
      Behavior.fromCodeFragment(
        "float = this.random();" + "\n" + "int = this.random.nextInt(256);",
        new BehaviorMetadata(
          "Seed",
          [],
          [
            { identifier: "float", label: "Float" },
            { identifier: "int", label: "Integer" },
          ]
        )
      )
    );

    this.rebuildFromMetadata();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.random = arbit(mustExist(this.nodeId));

    this.updateUi();
  }
}

customElements.define("dt-node-seed", NodeSeed);
