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
      id: this.nodeId!,
      name: this.name,
      x: this.x,
      y: this.y,
      inputs: this.inputs.map(input => ({
        id: input.columnId!,
        connections: input.connections.map(connection => ({
          source: connection.source.columnId!,
          target: connection.target.columnId!,
        })),
      })),
      outputs: this.outputs.map(output => ({
        id: output.columnId!,
        connections: output.connections.map(connection => ({
          source: connection.source.columnId!,
          target: connection.target.columnId!,
        })),
      })),
    };
  }
}

customElements.define("dt-node-seed", NodeSeed);
