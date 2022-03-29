import { Column } from "./Column";
import { mustExist } from "./Maybe";
import { Node } from "./Node";
import styles from "./Output.module.css";
import { SerializedConnection } from "./Workarea";

export class Output extends Column {
  label: string;
  labelElement?: HTMLLabelElement;

  value: unknown;
  valueElement?: HTMLSpanElement;

  constructor() {
    super();

    this.columnId = Node.makeId("output");
    this.label = "<unlabled output>";

    this.addEventListener("mousedown", event => this.onMouseDown(event));
  }

  init(parent: Node, initParameters?: SerializedConnection) {
    super.init(parent, initParameters);

    this.classList.add(styles.output);

    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);

    this.valueElement = document.createElement("span");
    this.valueElement.classList.add(styles.value);
    this.valueElement.textContent = String(this.value);
    this.appendChild(this.valueElement);
  }

  updateUi() {
    super.updateUi();
    
    mustExist(this.labelElement).textContent = this.label;
    mustExist(this.valueElement).textContent = String(this.value);
  }

  onMouseDown(event: MouseEvent) {
    if (!this.parent) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    console.log(`Begin sending output from ${this.parent.name}...`);
    this.parent.initConnectionFrom(this, event);
  }
}

customElements.define("dt-output", Output);
