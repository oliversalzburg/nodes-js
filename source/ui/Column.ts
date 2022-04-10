import { mustExist } from "../Maybe";
import styles from "./Column.module.css";
import { Connection } from "./Connection";
import { Node } from "./Node";
import { CommandDescription, SerializedInput, SerializedOutput } from "./Workarea";

export abstract class Column extends HTMLElement {
  columnId: string | null = null;
  parent: Node | null = null;

  label = "<unlabled column>";
  labelElement?: HTMLLabelElement;

  value: unknown;
  valueElement?: HTMLSpanElement;

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

    this.addEventListener("mouseenter", event => this.onMouseEnter(event));
    this.addEventListener("mouseleave", event => this.onMouseLeave(event));
  }

  abstract onMouseEnter(event: MouseEvent): void;
  abstract onMouseLeave(event: MouseEvent): void;

  init(initParameters?: Partial<CommandDescription | SerializedInput | SerializedOutput>) {
    this.columnId = initParameters?.id ?? this.columnId;
  }

  connect(connection: Connection) {
    mustExist(this.parent).onConnect(connection);
    this.classList.add(styles.connected);
  }
  disconnect(connection?: Connection) {
    this.classList.remove(styles.connected);
  }

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
