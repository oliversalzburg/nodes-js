import { mustExist } from "../Maybe";
import styles from "./Column.module.css";
import { Connection } from "./Connection";
import { Node } from "./Node";
import { SerializedInput, SerializedOutput } from "./Workarea";

export class Column extends HTMLElement {
  columnId: string | null = null;
  parent: Node | null = null;

  label = "<unlabled column>";
  labelElement?: HTMLLabelElement;

  value: unknown;
  valueElement?: HTMLSpanElement;

  connectedCallback() {
    this.parent = this.parentElement as Node;

    this.classList.add(styles.column);

    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);

    this.valueElement = document.createElement("span");
    this.valueElement.classList.add(styles.value);
    this.valueElement.textContent = String(this.value);
    this.appendChild(this.valueElement);
  }

  init(initParameters?: SerializedInput | SerializedOutput) {
    this.columnId = initParameters?.id ?? this.columnId;
  }

  connect(connection: Connection) {
    mustExist(this.parent).onConnect(connection);
    this.classList.add(styles.connected);
  }
  disconnect(connection: Connection) {
    this.classList.remove(styles.connected);
  }

  updateUi() {
    mustExist(this.labelElement).textContent = this.label;
    mustExist(this.valueElement).textContent = String(this.value);
  }
}
