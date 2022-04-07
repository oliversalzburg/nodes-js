import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { mustExist } from "../Maybe";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeAdd extends Node {
  constructor() {
    super("add", "Add");

    this.hasBehavior = true;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.behavior = Behavior.fromExecutableScript(
      "sum = Number(a) + Number(b);",
      new BehaviorMetadata(
        [
          { identifier: "a", label: "A" },
          { identifier: "b", label: "B" },
        ],
        [{ identifier: "sum", label: "Sum" }]
      )
    );

    this.rebuildIoFromMetadata();
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
