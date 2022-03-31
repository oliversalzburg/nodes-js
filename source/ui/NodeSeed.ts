import arbit, { ArbitGenerator } from "arbit";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { Output } from "./Output";
import { SerializedNode } from "./Workarea";

export class NodeSeed extends Node {
  #outputFloatElement: Output | null = null;
  #outputIntElement: Output | null = null;

  #random: ArbitGenerator;

  constructor() {
    super();

    this.nodeId = Node.makeId("seed");
    this.name = Node.makeName("Seed", this.nodeId);

    this.#random = arbit(this.nodeId);
  }

  connectedCallback() {
    super.connectedCallback();

    this.#outputFloatElement = this.addOutput();
    this.#outputFloatElement.label = "Float";
    this.#outputFloatElement.value = this.#random();

    this.#outputIntElement = this.addOutput();
    this.#outputIntElement.label = "Int";
    this.#outputIntElement.value = this.#random.nextInt(256);
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.#random = arbit(mustExist(this.nodeId));

    this.outputs[0].init(initParameters?.outputs[0]);
    this.outputs[1].init(initParameters?.outputs[1]);

    mustExist(this.#outputFloatElement).value = this.#random();
    mustExist(this.#outputIntElement).value = this.#random.nextInt(256);

    this.updateUi();
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
