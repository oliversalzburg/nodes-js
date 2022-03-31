import { mustExist } from "./Maybe";
import styles from "./Scrollable.module.css";
import { Workarea } from "./Workarea";

export class Scrollable extends HTMLElement {
  #workarea: Workarea | null = null;

  constructor() {
    super();

    console.debug("Scrollable constructed.");
  }

  connectedCallback() {
    this.#workarea = this.querySelector("dt-workarea") as Workarea;

    this.classList.add(styles.scrollable);
    this.addEventListener("scroll", event => this.onScroll(event));

    console.debug("Scrollable connected.");

    this.waitForWorkarea().catch(console.error);
  }

  async waitForWorkarea() {
    await customElements.whenDefined("dt-workarea");
    mustExist(this.#workarea).registerScrollableContainer(this);
  }

  onScroll(event: Event) {
    if (!this.#workarea) {
      return;
    }

    this.#workarea.updateConnections();
  }
}

customElements.define("dt-scrollable", Scrollable);
