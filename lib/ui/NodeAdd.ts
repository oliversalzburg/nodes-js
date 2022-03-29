import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode, Workarea } from "./Workarea";

export class NodeAdd extends Node {
  constructor() {
    super();

    this.nodeId = Node.makeId("add");
    this.name = Node.makeName("Add", this.nodeId);
  }

  init(workarea: Workarea, initParameters?: SerializedNode) {
    super.init(workarea, initParameters);

    const first = this.addInput(initParameters?.inputs[0]);
    first.label = "A";
    const second = this.addInput(initParameters?.inputs[1]);
    second.label = "B";

    const sum = this.addOutput(initParameters?.outputs[0]);
    sum.label = "Sum";

    this.updateUi();
  }

  update() {
    super.update();

    this.outputs[0].value = Number(this.inputs[0].value) + Number(this.inputs[1].value);
  }

  serialize(): SerializedNode {
    return {
      type: "add",
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

customElements.define("dt-node-add", NodeAdd);
