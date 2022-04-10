import arbit from "../../_snowpack/pkg/arbit.js";
import {Behavior} from "../behavior/Behavior.js";
import {mustExist} from "../Maybe.js";
import {Node} from "./Node.js";
export class NodeSeed extends Node {
  constructor() {
    super("seed", "Seed");
    this.hasBehavior = true;
    this.random = arbit(this.nodeId);
  }
  getFactory() {
    return NodeSeed;
  }
  async init(initParameters) {
    await super.init(initParameters);
    this.random = arbit(mustExist(this.nodeId));
    await this.updateBehavior(await Behavior.fromCodeFragment(`this._title("Seed");

let float = this._output("Float");
let int = this._output("Int");

float.update(this.random());
int.update(this.random.nextInt(256));`, NodeSeed));
    this.rebuildFromMetadata();
    this.updateUi();
  }
}
customElements.define("dt-node-seed", NodeSeed);
