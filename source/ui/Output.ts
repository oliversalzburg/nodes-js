import { Column } from "./Column";
import { mustExist } from "./Maybe";
import styles from "./Output.module.css";
import { Node } from "./Node";

import { SerializedConnection } from "./Workarea";

export class Output extends Column {
  
  constructor() {
    super();

    this.columnId = Node.makeId("output");
    this.label = "<unlabled output>";
  }

  connectedCallback() {
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

    if (event.button !== 0) {
      return;
    }

    console.log(`Begin sending output from ${this.parent.name}...`);
    this.parent.initConnectionFrom(this, event);
  }
}

customElements.define("dt-output", Output);
