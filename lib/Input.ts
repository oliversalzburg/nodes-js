import { Column } from "./Column";
import { Node } from "./Node";

export class Input extends Column {
  constructor() {
    super();

    this.columnId = Node.makeId("input");

    this.addEventListener("mouseup", event => this.onMouseUp(event));
  }

  onMouseUp(event: MouseEvent) {
    console.log("Begin receiving input.");

    this.parent?.finalizeConnection(this);
  }
}

customElements.define("dt-input", Input);
