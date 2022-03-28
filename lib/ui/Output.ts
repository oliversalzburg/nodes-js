import { Column } from "./Column";
import { Node } from "./Node";
import styles from "./Output.module.css";
import { SerializedConnection } from "./Workarea";

export class Output extends Column {
  label: string;

  constructor() {
    super();

    this.columnId = Node.makeId("output");
    this.label = "<unlabled output>";

    this.addEventListener("mousedown", event => this.onMouseDown(event));
  }

  init(parent: Node, initParameters?: SerializedConnection) {
    super.init(parent, initParameters);

    this.classList.add(styles.output);

    const label = document.createElement("span");
    label.textContent = this.label;
    this.appendChild(label);
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
