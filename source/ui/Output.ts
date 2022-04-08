import { Column } from "./Column";
import { Connection } from "./Connection";
import { Node } from "./Node";
import styles from "./Output.module.css";

export class Output extends Column {
  inputs = new Array<Connection>();

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

  connect(connection: Connection) {
    this.inputs.push(connection);

    super.connect(connection);
  }
  disconnect(connection: Connection): void {
    this.inputs.splice(this.inputs.indexOf(connection), 1);

    super.disconnect(connection);
  }

  onMouseEnter(event: MouseEvent) {
    for (const input of this.inputs) {
      input.line.dash = { animation: true };
    }
  }
  onMouseLeave(event: MouseEvent) {
    for (const input of this.inputs) {
      input.line.dash = false;
    }
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

  updateUi() {
    super.updateUi();

    for (const connection of this.inputs) {
      connection.line.position();
    }
  }
}

customElements.define("dt-output", Output);
