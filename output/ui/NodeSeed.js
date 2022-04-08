import arbit from "../../_snowpack/pkg/arbit.js";
import {Behavior} from "../behavior/Behavior.js";
import {BehaviorMetadata} from "../behavior/BehaviorMetadata.js";
import {mustExist} from "../Maybe.js";
import {Node} from "./Node.js";
export class NodeSeed extends Node {
  constructor() {
    super("seed", "Seed");
    this.hasBehavior = true;
    this.random = arbit(this.nodeId);
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateBehavior(Behavior.fromCodeFragment("float = this.random();\nint = this.random.nextInt(256);", new BehaviorMetadata("Seed", [], [
      {identifier: "float", label: "Float"},
      {identifier: "int", label: "Integer"}
    ])));
    this.rebuildFromMetadata();
  }
  init(initParameters) {
    super.init(initParameters);
    this.random = arbit(mustExist(this.nodeId));
    this.updateUi();
  }
}
customElements.define("dt-node-seed", NodeSeed);
