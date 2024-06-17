import { Column } from "./Column.js";
import { Connection } from "./Connection.js";
import { Node } from "./Node.js";
import styles from "./Output.module.css";

/**
 * An output column.
 */
export class Output extends Column {
  /**
   * The inputs this output is connected to.
   */
  inputs = new Array<Connection>();

  /**
   * Constructs a new output.
   */
  constructor() {
    super();

    this.columnId = Node.makeId("output");
    this.label = "<unlabled output>";
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    super.connectedCallback();

    this.classList.add(styles.output);

    this.addEventListener("mousedown", event => {
      this.onMouseDown(event);
    });
  }

  /**
   * Connects the output to an input.
   * @param connection - The connection to add.
   * @returns A promise that is resolved once the connection is established.
   */
  connect(connection: Connection) {
    this.inputs.push(connection);

    return super.connect(connection);
  }

  /**
   * Disconnects the output from an input.
   * @param connection - The connection that should be disconnected.
   */
  disconnect(connection: Connection): void {
    this.inputs.splice(this.inputs.indexOf(connection), 1);

    super.disconnect(connection);
  }

  /**
   * Invoked when the mouse cursor enters the bounds of the output.
   * @param _event - The mouse event that triggered the operation.
   */
  onMouseEnter(_event: MouseEvent) {
    for (const input of this.inputs) {
      input.line.dash = { animation: true };
    }
  }
  /**
   * Invoked when the mouse cursor leaves the bounds of the output.
   * @param _event - The mouse event that triggered the operation.
   */
  onMouseLeave(_event: MouseEvent) {
    for (const input of this.inputs) {
      input.line.dash = false;
    }
  }

  /**
   * Triggered when the user presses down on a mouse button.
   * @param event - The mouse event that triggered the operation.
   */
  onMouseDown(event: MouseEvent): void {
    if (!this.parent) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    console.log(`Begin sending output from ${this.parent.name}...`);
    this.parent.initConnectionFrom(this, event);
  }

  /**
   * Refresh the UI.
   */
  updateUi() {
    super.updateUi();

    for (const connection of this.inputs) {
      connection.line.position();
    }
  }
}

customElements.define("dt-output", Output);
