import styles from "./Decoy.module.css.proxy.js";
export class Decoy extends HTMLElement {
  init(parent, initParameters) {
    this.classList.add(styles.decoy);
  }
}
customElements.define("dt-decoy", Decoy);
