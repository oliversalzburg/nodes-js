import { Column } from "./column";
import { Node } from "./node";

export class Output extends Column {
  constructor() {
    super();

    this.columnId = Node.makeId("output");

    this.addEventListener("mousedown", event => this.onMouseDown(event));
  }

  onMouseDown(event: MouseEvent) {
    if (!this.parent) {
      return;
    }

    console.log(`Begin sending output from ${this.parent.name}...`);
    this.parent.initConnectionFrom(this);
  }
}

customElements.define("dt-output", Output);
