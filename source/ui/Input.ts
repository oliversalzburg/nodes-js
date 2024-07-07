import { prepareAsyncContext } from "@oliversalzburg/js-utils/async/async.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Column } from "./Column.js";
import { Connection } from "./Connection.js";
import styles from "./Input.module.css";
import { Node } from "./Node.js";

/**
 * An input column.
 */
export class Input extends Column {
  /**
   * The output this column is connected to.
   */
  output?: Connection;

  /**
   * Constructs a new input.
   */
  constructor() {
    super();

    this.columnId = Node.makeId("input");
    this.label = "<unlabled input>";
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    super.connectedCallback();

    this.classList.add(styles.input);

    this.addEventListener(
      "mouseup",
      prepareAsyncContext(async (event: MouseEvent) => this.onMouseUp(event)),
    );
  }

  /**
   * Connect this input to an output.
   * @param connection - The connection to create.
   * @returns A promise that is resolved once the connection is finalized.
   */
  async connect(connection: Connection) {
    if (this.output) {
      this.output.disconnect();
    }

    this.output = connection;
    this.update();

    return super.connect(connection);
  }
  /**
   * Disconnect the given connection.
   * @param connection - The connection to disconnect.
   */
  disconnect(connection?: Connection): void {
    super.disconnect(connection);
    this.output = undefined;
    this.value = undefined;
  }

  /**
   * Update the input.
   */
  update(): void {
    if (isNil(this.output)) {
      return;
    }

    this.value = this.output.source.value;
  }

  /**
   * Update the UI of the input.
   */
  updateUi() {
    super.updateUi();

    if (this.output) {
      this.output.line.position();
    }
  }

  /**
   * Invoked when the mouse cursor enters the bounds of the input.
   * @param _event - The mouse event that triggered the operation.
   */
  onMouseEnter(_event: MouseEvent) {
    if (!isNil(this.output)) {
      this.output.line.dash = { animation: true };
    }
  }
  /**
   * Invoked when the mouse cursor leaves the bounds of the input.
   * @param _event - The mouse event that triggered the operation.
   */
  onMouseLeave(_event: MouseEvent) {
    if (!isNil(this.output)) {
      this.output.line.dash = false;
    }
  }

  /**
   * Triggered when the user releases a mouse button.
   * @param _event - The mouse event that triggered the operation.
   */
  async onMouseUp(_event: MouseEvent) {
    // Always disconnect on click.
    if (this.output) {
      this.parent?.workarea?.disconnect(this.output);
    }

    // Create new connection, in case this was the end of a connect operation.
    await this.parent?.finalizeConnection(this);

    this.update();
  }
}

customElements.define("dt-input", Input);
