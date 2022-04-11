import {mustExist} from "../Maybe.js";
import styles from "./Column.module.css.proxy.js";
export class Column extends HTMLElement {
  constructor() {
    super(...arguments);
    this.columnId = null;
    this.parent = null;
    this.label = "<unlabled column>";
  }
  connectedCallback() {
    this.parent = mustExist(this.parentElement).parentElement;
    this.classList.add(styles.column);
    this.labelElement = document.createElement("label");
    this.labelElement.textContent = this.label;
    this.appendChild(this.labelElement);
    this.valueElement = document.createElement("span");
    this.valueElement.classList.add(styles.value);
    this.valueElement.textContent = String(this.value);
    this.appendChild(this.valueElement);
    this.addEventListener("mouseenter", (event) => this.onMouseEnter(event));
    this.addEventListener("mouseleave", (event) => this.onMouseLeave(event));
  }
  init(initParameters) {
    this.columnId = initParameters?.id ?? this.columnId;
  }
  async connect(connection) {
    await mustExist(this.parent).onConnect(connection);
    this.classList.add(styles.connected);
  }
  disconnect(connection) {
    this.classList.remove(styles.connected);
  }
  updateUi() {
    mustExist(this.labelElement).textContent = this.label;
    mustExist(this.valueElement).textContent = Column.makeDisplayValue(this.value);
  }
  static makeDisplayValue(value) {
    const stringValue = String(value);
    if (20 < stringValue.length) {
      return `${stringValue.substring(0, 18)}…`;
    }
    return stringValue;
  }
}
