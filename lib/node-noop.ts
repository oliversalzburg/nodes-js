import { Input } from "./input";
import { Node } from "./node";
import { SerializedNode, Workarea } from "./workarea";

export class NodeNoop extends Node {
  constructor() {
    super();

    this.nodeId = Node.makeId("noop");
    this.name = Node.makeName("Noop", this.nodeId);
  }

  init(workarea: Workarea, initParameters?: SerializedNode) {
    super.init(workarea, initParameters);



    const connectorIn = document.createElement("dt-input") as Input;
    connectorIn.init(this, initParameters?.inputs[0]);
    this.appendChild(connectorIn);
    this.inputs.push(connectorIn);

    /*
    const connectorOut = document.createElement("dt-output") as Output;
    connectorOut.init(this);
    this.appendChild(connectorOut);
    */
  }

  serialize(): SerializedNode {
    this.getClientRects();
    return {
      type: "noop",
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

customElements.define("dt-node-noop", NodeNoop);
