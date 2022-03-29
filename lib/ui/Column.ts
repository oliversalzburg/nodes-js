import { Connection } from "./Connection";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";

export class Column extends HTMLElement {
  columnId: string | null = null;
  parent: Node | null = null;
  connections = new Array<Connection>();

  label = "<unlabled column>";
  labelElement?: HTMLLabelElement;

  init(parent: Node, initParameters?: SerializedConnection) {
    this.parent = parent;

    this.columnId = initParameters?.id ?? this.columnId;

    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }
  disconnect(connection: Connection) {
    this.connections.splice(this.connections.indexOf(connection), 1);
  }

  updateUi() {
    mustExist(this.labelElement).textContent = this.label;
    
    for (const connection of this.connections) {
      connection.line.position();
    }
  }
}
