import { isNil } from "../Maybe";
import { Column } from "./Column";
import { Connection } from "./Connection";
import styles from "./Input.module.css";
import { Node } from "./Node";

export class Input extends Column {
  output?: Connection;

  constructor() {
    super();

    this.columnId = Node.makeId("input");
    this.label = "<unlabled input>";
  }

  connectedCallback() {
    super.connectedCallback();

    this.classList.add(styles.input);

    this.addEventListener("mouseup", event => this.onMouseUp(event));
  }

  connect(connection: Connection) {
    if (this.output) {
      this.output.disconnect();
    }

    this.output = connection;
    this.update();

    super.connect(connection);

    console.log(
      `${connection.source.parent?.nodeId}::${connection.source.columnId} → ${this.parent?.nodeId}::${this.columnId}`
    );
  }
  disconnect(connection?: Connection): void {
    super.disconnect(connection);
    this.output = undefined;
    this.value = undefined;
  }

  update(): void {
    if (isNil(this.output)) {
      return;
    }

    this.value = this.output.source.value;
  }

  updateUi() {
    super.updateUi();

    if (this.output) {
      this.output.line.position();
    }
  }

  onMouseEnter(event: MouseEvent) {
    if (!isNil(this.output)) {
      this.output.line.dash = { animation: true };
    }
  }
  onMouseLeave(event: MouseEvent) {
    if (!isNil(this.output)) {
      this.output.line.dash = false;
    }
  }

  onMouseUp(event: MouseEvent) {
    // Always disconnect on click.
    if (this.output) {
      this.parent?.workarea?.disconnect(this.output);
    }

    // Create new connection, in case this was the end of a connect operation.
    this.parent?.finalizeConnection(this);

    this.update();
  }
}

customElements.define("dt-input", Input);
