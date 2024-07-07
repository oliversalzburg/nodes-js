import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import styles from "./Scrollable.module.css";
import { Workarea } from "./Workarea.js";

/**
 * A component with scrollbar.
 */
export class Scrollable extends HTMLElement {
  #workarea: Workarea | null = null;

  /**
   * Constructs a new scrollable.
   */
  constructor() {
    super();

    console.debug("Scrollable constructed.");
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    this.#workarea = this.querySelector("dt-workarea") as Workarea;

    this.classList.add(styles.scrollable);
    this.addEventListener("scroll", event => {
      this.onScroll(event);
    });

    console.debug("Scrollable connected.");

    this.waitForWorkarea().catch(redirectErrorsToConsole(console));
  }

  /**
   * Waits for the `dt-workarea` component to be available.
   */
  async waitForWorkarea() {
    await customElements.whenDefined("dt-workarea");
    mustExist(this.#workarea).registerScrollableContainer(this);

    // Don't init on origin. It's uncomfortable.
    this.scroll(this.scrollHeight / 3, this.scrollWidth / 3);
  }

  /**
   * Invoked when the component was scrolled.
   * @param _event - The event that triggered this operation.
   */
  onScroll(_event: Event): void {
    if (!this.#workarea) {
      return;
    }

    this.#workarea.updateConnections();
  }
}

customElements.define("dt-scrollable", Scrollable);
