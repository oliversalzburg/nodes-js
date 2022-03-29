import arbit, { ArbitGenerator } from "arbit";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode, Workarea } from "./Workarea";

export class NodeSeed extends Node {
  #random: ArbitGenerator;

  constructor() {
    super();

    this.nodeId = Node.makeId("seed");
    this.name = Node.makeName("Seed", this.nodeId);

    this.#random = arbit(this.nodeId);
  }

  init(workarea: Workarea, initParameters?: SerializedNode) {
    super.init(workarea, initParameters);

    this.#random = arbit(mustExist(this.nodeId));

    const outputFloat = this.addOutput(initParameters?.outputs[0]);
    outputFloat.label = "Float";
    outputFloat.value = this.#random();
    outputFloat.updateUi();

    const outputInt = this.addOutput(initParameters?.outputs[1]);
    outputInt.label = "Int";
    outputInt.value = this.#random.nextInt(Number.MAX_SAFE_INTEGER);
    outputInt.updateUi();
  }

  serialize(): SerializedNode {
    return {
      type: "seed",
      id: mustExist(this.nodeId),
      name: this.name,
      x: this.x,
      y: this.y,
      inputs: this.inputs.map(input => ({
        id: mustExist(input.columnId),
        connections: input.connections.map(connection => ({
          source: mustExist(connection.source.columnId),
          target: mustExist(connection.target.columnId),
        })),
      })),
      outputs: this.outputs.map(output => ({
        id: mustExist(output.columnId),
        connections: output.connections.map(connection => ({
          source: mustExist(connection.source.columnId),
          target: mustExist(connection.target.columnId),
        })),
      })),
    };
  }
}

customElements.define("dt-node-seed", NodeSeed);
