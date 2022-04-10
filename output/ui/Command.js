import {isNil, mustExist} from "../Maybe.js";
import {Column} from "./Column.js";
import styles from "./Input.module.css.proxy.js";
import {Node} from "./Node.js";
export class Command extends Column {
  constructor() {
    super();
    this.entrypoint = null;
    this.columnId = Node.makeId("command");
    this.label = "<unlabled command>";
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(styles.command);
    this.addEventListener("mouseup", (event) => this.onMouseUp(event));
  }
  async init(initParameters) {
    super.init(initParameters);
    this.label = initParameters?.label ?? "";
    this.entrypoint = initParameters?.entrypoint ?? null;
  }
  update() {
    this.value = void 0;
  }
  updateUi() {
    super.updateUi();
  }
  onMouseEnter(event) {
  }
  onMouseLeave(event) {
  }
  async onMouseUp(event) {
    if (!isNil(this.entrypoint)) {
      await this.entrypoint.bind(this.parent)(this);
    }
    await mustExist(this.parent).update();
    mustExist(this.parent).updateUi();
  }
}
customElements.define("dt-command", Command);
