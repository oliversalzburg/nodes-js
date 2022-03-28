import { Column } from "./Column";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";
import styles from "./Output.module.css";

export class Output extends Column {
  constructor() {
    super();

    this.columnId = Node.makeId("output");

    this.addEventListener("mousedown", event => this.onMouseDown(event));
  }

  init(parent: Node, initParameters?: SerializedConnection) {
    super.init(parent, initParameters);

    this.classList.add(styles.output);
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
