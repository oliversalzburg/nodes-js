import { Behavior } from "../behavior/Behavior";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeAdd extends Node {
  constructor() {
    super();

    this.nodeId = Node.makeId("add");
    this.name = Node.makeName("Add", this.nodeId);

    this.hasBehavior = true;
  }

  connectedCallback(): void {
    super.connectedCallback();

    const first = this.addInput();
    first.label = "A";
    const second = this.addInput();
    second.label = "B";

    const sum = this.addOutput();
    sum.label = "Sum";

    this.behavior = Behavior.fromExecutableNodeScript(
      "this.outputs[0].value = Number(this.inputs[0].value) + Number(this.inputs[1].value);",
      this
    );
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.inputs[0].init(initParameters?.inputs[0]);
    this.inputs[1].init(initParameters?.inputs[1]);

    this.outputs[0].init(initParameters?.outputs[0]);

    this.updateUi();
  }

  update() {
    super.update();

    if (this.behaviorCompiled) {
      this.behaviorCompiled();
    } else {
      this.outputs[0].value = Number(this.inputs[0].value) + Number(this.inputs[1].value);
    }
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
        output: input.output ? mustExist(input.output.source.columnId) : null,
      })),
      outputs: this.outputs.map(output => ({
        id: mustExist(output.columnId),
        inputs: output.inputs.map(connection => mustExist(connection.target.columnId)),
      })),
    };
  }
}

customElements.define("dt-node-add", NodeAdd);
