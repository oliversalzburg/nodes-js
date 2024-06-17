import styles from "./Decoy.module.css";
import { Workarea } from "./Workarea.js";

/**
 * The decoy helps with temporary dragging operations.
 */
export class Decoy extends HTMLElement {
  /**
   * Initialize the decoy.
   * @param _parent - The work area this decoy exists in.
   * @param _initParameters - The parameters for the decoy.
   */
  init(_parent: Workarea, _initParameters?: unknown) {
    this.classList.add(styles.decoy);
  }
}

customElements.define("dt-decoy", Decoy);
