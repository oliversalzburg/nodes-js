import { Connection } from "./connection";
import { Node } from "./node";
import { SerializedConnection } from "./workarea";

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
  disconnect(connections: Connection) {
    this.connections.splice(this.connections.indexOf(connections), 1);
  }

  updateConnections() {
    for (const connection of this.connections) {
      connection.line.position();
    }
  }
}
