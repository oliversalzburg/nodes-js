import { Connection } from "./Connection";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";

export class Column extends HTMLElement {
  columnId: string | null = null;
  parent: Node | null = null;
  connections = new Array<Connection>();

  init(parent: Node, initParameters?: SerializedConnection) {
    this.parent = parent;

    this.columnId = initParameters?.id ?? this.columnId;
  }

  connect(connection: Connection) {
    this.connections.push(connection);
  }
  disconnect(connection: Connection) {
    this.connections.splice(this.connections.indexOf(connection), 1);
    connection.line.remove();
  }

  updateUi() {
    for (const connection of this.connections) {
      connection.line.position();
    }
  }
}
