import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { mustExist } from "../Maybe";
import { Node } from "./Node";
import { Output } from "./Output";

export class NodeRow extends Node {
  #outputIntElements = new Array<Output>();

  constructor() {
    super("row", "Row");

    this.hasBehavior = true;
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateBehavior(
      Behavior.fromCodeFragment(
        `
while(this.outputs.length < 5) { 
  const output = this.addOutput();
  output.label = \`Output \${this.outputs.length}\`;
  output.value = this.outputs.length * 2;
}
`,
        new BehaviorMetadata("Row", [], [])
      )
    );

    this.rebuildFromMetadata();
  }

  rebuildFromMetadata() {
    const behavior = mustExist(this.behavior);

    this.name = behavior.metadata.title;

    // Ignore rest of metadata. We build the node from script.
  }
}

customElements.define("dt-node-row", NodeRow);
