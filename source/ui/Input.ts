import { Column } from "./Column";
import { Connection } from "./Connection";
import styles from "./Input.module.css";
import { isNil } from "./Maybe";
import { Node } from "./Node";
import { SerializedConnection } from "./Workarea";

export class Input extends Column {
  #connection?: Connection;

  constructor() {
    super();

    this.columnId = Node.makeId("input");
    this.label = "<unlabled input>";
  }

  connectedCallback() {
    this.addEventListener("mouseup", event => this.onMouseUp(event));
  }

  init(parent: Node, initParameters?: SerializedConnection) {
    super.init(parent, initParameters);

    this.classList.add(styles.input);
  }

  connect(connection: Connection) {
    if (0 < this.connections.length) {
      this.connections[0].disconnect();
    }

    this.#connection = connection;
    this.update();

    super.connect(connection);

    console.log(
      `${connection.source.parent?.nodeId}::${connection.source.columnId} → ${this.parent?.nodeId}::${this.columnId}`
    );
  }

  update(): void {
    if (isNil(this.#connection)) {
      return;
    }

    this.value = this.#connection.source.value;
  }

  onMouseUp(event: MouseEvent) {
    this.parent?.finalizeConnection(this);

    this.update();
  }
}

customElements.define("dt-input", Input);
