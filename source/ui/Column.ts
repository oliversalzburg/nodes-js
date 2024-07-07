import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import styles from "./Column.module.css";
import { Connection } from "./Connection.js";
import { Node } from "./Node.js";
import { CommandDescription, SerializedInput, SerializedOutput } from "./Workarea.js";

/**
 * A column is an element that represents an input/output.
 */
export abstract class Column extends HTMLElement {
  /**
   * The ID of the column.
   */
  columnId: string | null = null;
  /**
   * The node this column appears in.
   */
  parent: Node | null = null;

  /**
   * The label of the column.
   */
  label = "<unlabled column>";
  /**
   * The UI element that represents the label.
   */
  labelElement?: HTMLLabelElement;

  /**
   * The value of the column.
   */
  value: unknown;
  /**
   * The UI element that represents the value.
   */
  valueElement?: HTMLSpanElement;

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    this.parent = mustExist(this.parentElement).parentElement as Node;

    this.classList.add(styles.column);

    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);

    this.valueElement = document.createElement("span");
    this.valueElement.classList.add(styles.value);
    this.valueElement.textContent = String(this.value);
    this.appendChild(this.valueElement);

    this.addEventListener("mouseenter", event => {
      this.onMouseEnter(event);
    });
    this.addEventListener("mouseleave", event => {
      this.onMouseLeave(event);
    });
  }

  abstract onMouseEnter(event: MouseEvent): void;
  abstract onMouseLeave(event: MouseEvent): void;

  /**
   * Initialize the column.
   * @param initParameters - The parameters for the column.
   */
  init(initParameters?: Partial<CommandDescription | SerializedInput | SerializedOutput>) {
    this.columnId = initParameters?.id ?? this.columnId;
  }

  /**
   * Connect this column to another column.
   * @param connection - The connection to create.
   */
  async connect(connection: Connection) {
    await mustExist(this.parent).onConnect(connection);
    this.classList.add(styles.connected);
  }
  /**
   * Disconnect the given connection.
   * @param _connection - The connection to disconnect.
   */
  disconnect(_connection?: Connection) {
    this.classList.remove(styles.connected);
  }

  /**
   * Update the UI of the column.
   */
  updateUi() {
    mustExist(this.labelElement).textContent = this.label;
    mustExist(this.valueElement).textContent = Column.makeDisplayValue(this.value);
  }

  protected static makeDisplayValue(value: unknown) {
    const stringValue = String(value);
    if (20 < stringValue.length) {
      return `${stringValue.substring(0, 18)}…`;
    }
    return stringValue;
  }
}
