import { mustExist } from "./Maybe";
import styles from "./Scrollable.module.css";
import { Workarea } from "./Workarea";

export class Scrollable extends HTMLElement {
  #workarea: Workarea | null = null;

  constructor() {
    super();

    console.debug("Scrollable constructed.")
  }

  connectedCallback() {
    this.#workarea = mustExist(this.querySelector("dt-workarea")) as Workarea;
    this.#workarea.registerScrollableContainer(this);

    this.classList.add(styles.scrollable);
    this.addEventListener("scroll", event => this.onScroll(event));

    console.debug("Scrollable connected.")
  }

  onScroll(event: Event) {
    if (!this.#workarea) {
      return;
    }

    this.#workarea.updateConnections();
  }
}

customElements.define("dt-scrollable", Scrollable);
