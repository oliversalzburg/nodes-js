import { Column } from "./Column";
import { Connection } from "./Connection";
import styles from "./Input.module.css";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";

export class Input extends Column {
  label: string;

  constructor() {
    super();

    this.columnId = Node.makeId("input");
    this.label = "<unlabled input>";

    this.addEventListener("mouseup", event => this.onMouseUp(event));
  }

  init(parent: Node, initParameters?: SerializedConnection) {
    super.init(parent, initParameters);

    this.classList.add(styles.input);

    const label = document.createElement("span");
    label.textContent = this.label;
    this.appendChild(label);
  }

  connect(connection: Connection) {
    if (0 < this.connections.length) {
      this.disconnect(this.connections[0]);
    }
    
    super.connect(connection);

    console.log(`${connection.source.parent?.nodeId}::${connection.source.columnId} → ${this.parent?.nodeId}::${this.columnId}`)
  }

  onMouseUp(event: MouseEvent) {
    this.parent?.finalizeConnection(this);
  }
}

customElements.define("dt-input", Input);
