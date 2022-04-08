import arbit, { ArbitGenerator } from "arbit";
import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { mustExist } from "../Maybe";
import { Node } from "./Node";
import { Output } from "./Output";
import { SerializedNode } from "./Workarea";

export class NodeSeed extends Node {
  #outputFloatElement: Output | null = null;
  #outputIntElement: Output | null = null;

  random: ArbitGenerator;

  constructor() {
    super("seed", "Seed");

    this.hasBehavior = true;
    this.random = arbit(this.nodeId);
  }

  connectedCallback() {
    super.connectedCallback();
    /*
    this.#outputFloatElement = this.addOutput();
    this.#outputFloatElement.label = "Float";
    this.#outputFloatElement.value = this.#random();

    this.#outputIntElement = this.addOutput();
    this.#outputIntElement.label = "Int";
    this.#outputIntElement.value = this.#random.nextInt(256);
*/
    this.updateBehavior(
      Behavior.fromCodeFragment(
        "float = this.random();" + "\n" + "int = this.random.nextInt(256);",
        new BehaviorMetadata(
          [],
          [
            { identifier: "float", label: "Float" },
            { identifier: "int", label: "Integer" },
          ]
        )
      )
    );

    this.rebuildIoFromMetadata();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.random = arbit(mustExist(this.nodeId));
    /*
    this.outputs[0].init(initParameters?.outputs[0]);
    this.outputs[1].init(initParameters?.outputs[1]);

    mustExist(this.#outputFloatElement).value = this.#random();
    mustExist(this.#outputIntElement).value = this.#random.nextInt(256);
*/
    this.updateUi();
  }
}

customElements.define("dt-node-seed", NodeSeed);
