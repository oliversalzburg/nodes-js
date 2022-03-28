import { mustExist } from "./Maybe";
import { Node } from "./node";
import { Output } from "./output";
import { SerializedNode, Workarea } from "./workarea";

export class NodeSeed extends Node {
  constructor() {
    super();

    this.nodeId = Node.makeId("seed");
    this.name = Node.makeName("Seed", this.nodeId);
  }

  init(workarea: Workarea, initParameters?: SerializedNode) {
    super.init(workarea, initParameters);

    const connectorOut = document.createElement("dt-output") as Output;
    connectorOut.init(this, initParameters?.outputs[0]);
    this.appendChild(connectorOut);
    this.outputs.push(connectorOut);
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
