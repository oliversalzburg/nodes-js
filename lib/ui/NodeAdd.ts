import { Input } from "./Input";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode, Workarea } from "./Workarea";

export class NodeAdd extends Node {
  constructor() {
    super();

    this.nodeId = Node.makeId("sum");
    this.name = Node.makeName("Sum", this.nodeId);
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

customElements.define("dt-node-add", NodeAdd);
