import { Column } from "./Column";
import styles from "./Input.module.css";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";

export class Input extends Column {
  constructor() {
    super();

    this.columnId = Node.makeId("input");

    this.addEventListener("mouseup", event => this.onMouseUp(event));
  }

  init(parent: Node, initParameters?: SerializedConnection) {
    super.init(parent, initParameters);

    this.classList.add(styles.input);
  }

  onMouseUp(event: MouseEvent) {
    console.log("Begin receiving input.");

    this.parent?.finalizeConnection(this);
  }
}

customElements.define("dt-input", Input);
