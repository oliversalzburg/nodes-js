import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeNoop extends Node {
  constructor() {
    super();

    this.nodeId = Node.makeId("noop");
    this.name = Node.makeName("Noop", this.nodeId);
  }

  connectedCallback() {
    super.connectedCallback();

    this.addInput();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.inputs[0].init(initParameters?.inputs[0]);

    this.updateUi();
  }

  serialize(): SerializedNode {
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
