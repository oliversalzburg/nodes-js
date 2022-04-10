import arbit, { ArbitGenerator } from "arbit";
import { Behavior } from "../behavior/Behavior";
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
        'this._title("Seed");' +
          "\n" +
          'let float = this._output("Float");' +
          "\n" +
          'let int = this._output("Int");' +
          "\n" +
          "float.update(this.random());" +
          "\n" +
          "int.update(this.random.nextInt(256));"
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
