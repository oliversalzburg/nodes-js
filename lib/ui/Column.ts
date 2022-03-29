import { Connection } from "./Connection";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";
import styles from "./Column.module.css";

export class Column extends HTMLElement {
  columnId: string | null = null;
  parent: Node | null = null;
  connections = new Array<Connection>();

  label = "<unlabled column>";
  labelElement?: HTMLLabelElement;

  value: unknown;
  valueElement?: HTMLSpanElement;


  init(parent: Node, initParameters?: SerializedConnection) {
    this.parent = parent;

    this.columnId = initParameters?.id ?? this.columnId;

    this.classList.add(styles.column);

    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);

    this.valueElement = document.createElement("span");
    this.valueElement.classList.add(styles.value);
    this.valueElement.textContent = String(this.value);
    this.appendChild(this.valueElement);
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }
  disconnect(connection: Connection) {
    this.connections.splice(this.connections.indexOf(connection), 1);
  }

  updateUi() {
    mustExist(this.labelElement).textContent = this.label;
    mustExist(this.valueElement).textContent = String(this.value);
    
    for (const connection of this.connections) {
      connection.line.position();
    }
  }
}
