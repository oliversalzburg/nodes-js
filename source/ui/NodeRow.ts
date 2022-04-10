import { Behavior } from "../behavior/Behavior";
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
        `this._title("Row");
for(let inputIndex = 0; inputIndex < 5; ++inputIndex) { 
  const output = this._output(\`Output \${inputIndex}\`);
  output.update(inputIndex * 2);
}`
      )
    );

    this.rebuildFromMetadata();
  }
}

customElements.define("dt-node-row", NodeRow);
