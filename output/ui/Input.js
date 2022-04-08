import {isNil} from "../Maybe.js";
import {Column} from "./Column.js";
import styles from "./Input.module.css.proxy.js";
import {Node} from "./Node.js";
export class Input extends Column {
  constructor() {
    super();
    this.columnId = Node.makeId("input");
    this.label = "<unlabled input>";
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(styles.input);
    this.addEventListener("mouseup", (event) => this.onMouseUp(event));
  }
  connect(connection) {
    if (this.output) {
      this.output.disconnect();
    }
    this.output = connection;
    this.update();
    super.connect(connection);
    console.log(`${connection.source.parent?.nodeId}::${connection.source.columnId} → ${this.parent?.nodeId}::${this.columnId}`);
  }
  disconnect(connection) {
    super.disconnect(connection);
    this.output = void 0;
    this.value = void 0;
  }
  update() {
    if (isNil(this.output)) {
      return;
    }
    this.value = this.output.source.value;
  }
  updateUi() {
    super.updateUi();
    if (this.output) {
      this.output.line.position();
    }
  }
  onMouseEnter(event) {
    if (!isNil(this.output)) {
      this.output.line.dash = {animation: true};
    }
  }
  onMouseLeave(event) {
    if (!isNil(this.output)) {
      this.output.line.dash = false;
    }
  }
  onMouseUp(event) {
    if (this.output) {
      this.parent?.workarea?.disconnect(this.output);
    }
    this.parent?.finalizeConnection(this);
    this.update();
  }
}
customElements.define("dt-input", Input);
