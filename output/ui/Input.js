import {asyncEventHandler} from "../Async.js";
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
    this.addEventListener("mouseup", asyncEventHandler(async (event) => this.onMouseUp(event)));
  }
  async connect(connection) {
    if (this.output) {
      this.output.disconnect();
    }
    this.output = connection;
    this.update();
    return super.connect(connection);
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
  async onMouseUp(event) {
    if (this.output) {
      this.parent?.workarea?.disconnect(this.output);
    }
    await this.parent?.finalizeConnection(this);
    this.update();
  }
}
customElements.define("dt-input", Input);
