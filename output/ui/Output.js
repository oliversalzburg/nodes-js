import {Column} from "./Column.js";
import {Node} from "./Node.js";
import styles from "./Output.module.css.proxy.js";
export class Output extends Column {
  constructor() {
    super();
    this.inputs = new Array();
    this.columnId = Node.makeId("output");
    this.label = "<unlabled output>";
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(styles.output);
    this.addEventListener("mousedown", (event) => this.onMouseDown(event));
  }
  connect(connection) {
    this.inputs.push(connection);
    return super.connect(connection);
  }
  disconnect(connection) {
    this.inputs.splice(this.inputs.indexOf(connection), 1);
    super.disconnect(connection);
  }
  onMouseEnter(event) {
    for (const input of this.inputs) {
      input.line.dash = {animation: true};
    }
  }
  onMouseLeave(event) {
    for (const input of this.inputs) {
      input.line.dash = false;
    }
  }
  onMouseDown(event) {
    if (!this.parent) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    console.log(`Begin sending output from ${this.parent.name}...`);
    this.parent.initConnectionFrom(this, event);
  }
  updateUi() {
    super.updateUi();
    for (const connection of this.inputs) {
      connection.line.position();
    }
  }
}
customElements.define("dt-output", Output);
