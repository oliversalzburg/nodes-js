import styles from "./Decoy.module.css";
import { Workarea } from "./Workarea";

export class Decoy extends HTMLElement {
  init(parent: Workarea, initParameters?: unknown) {
    this.classList.add(styles.decoy);
  }
}

customElements.define("dt-decoy", Decoy);
