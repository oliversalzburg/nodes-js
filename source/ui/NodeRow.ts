import { mustExist } from "../Maybe";
import { Node } from "./Node";
import { Output } from "./Output";
import { SerializedNode } from "./Workarea";

export class NodeRow extends Node {
  #outputIntElements = new Array<Output>();

  constructor() {
    super("row", "Row");
  }

  connectedCallback() {
    super.connectedCallback();

    for (let elementIndex = 0; elementIndex < 5; ++elementIndex) {
      const element = this.addOutput();
      element.label = `Int #${elementIndex}`;
      element.value = elementIndex;
      this.#outputIntElements.push(element);
    }
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.outputs[0].init(initParameters?.outputs[0]);
    this.outputs[1].init(initParameters?.outputs[1]);
    this.outputs[2].init(initParameters?.outputs[2]);
    this.outputs[3].init(initParameters?.outputs[3]);
    this.outputs[4].init(initParameters?.outputs[4]);

    this.updateUi();
  }

  serialize(): SerializedNode {
    return {
      type: "row",
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

customElements.define("dt-node-row", NodeRow);
