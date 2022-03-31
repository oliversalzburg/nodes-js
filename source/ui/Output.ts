import { Column } from "./Column";
import { Node } from "./Node";
import styles from "./Output.module.css";

export class Output extends Column {
  constructor() {
    super();

    this.columnId = Node.makeId("output");
    this.label = "<unlabled output>";
  }

  connectedCallback() {
    super.connectedCallback();

    this.classList.add(styles.output);

    this.addEventListener("mousedown", event => this.onMouseDown(event));
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
