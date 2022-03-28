import { Input } from "./Input";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode, Workarea } from "./Workarea";

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

customElements.define("dt-node-noop", NodeNoop);
