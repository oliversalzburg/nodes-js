import { isNil, mustExist } from "./Maybe";
import styles from "./Toolbar.module.css";
import { Workarea } from "./Workarea";

export class Toolbar extends HTMLElement {
  #workarea: Workarea | null = null;

  constructor() {
    super();
    console.debug("Toolbar constructed.");
  }

  connectedCallback() {
    this.classList.add(styles.toolbar);

    const forWorkarea = this.getAttribute("for");
    if (isNil(forWorkarea)) {
      throw new Error("Missing `for` attribute on dt-toolbar. Requires an ID of a dt-workarea.");
    }
    this.#workarea = mustExist(document.getElementById(forWorkarea)) as Workarea;

    const addSeedButton = document.createElement("button");
    addSeedButton.classList.add(styles.button);
    addSeedButton.textContent = "➕ Seed";
    addSeedButton.title = "1";
    addSeedButton.addEventListener("click", () => mustExist(this.#workarea).createNode("seed"));
    this.appendChild(addSeedButton);

    const addNoopButton = document.createElement("button");
    addNoopButton.classList.add(styles.button);
    addNoopButton.textContent = "➕ Noop";
    addNoopButton.title = "2";
    addNoopButton.addEventListener("click", () => mustExist(this.#workarea).createNode("noop"));
    this.appendChild(addNoopButton);

    const addAddButton = document.createElement("button");
    addAddButton.classList.add(styles.button);
    addAddButton.textContent = "➕ Add";
    addAddButton.title = "3";
    addAddButton.addEventListener("click", () => mustExist(this.#workarea).createNode("add"));
    this.appendChild(addAddButton);

    const divider1 = document.createElement("span");
    divider1.classList.add(styles.divider);
    this.appendChild(divider1);

    const clearButton = document.createElement("button");
    clearButton.classList.add(styles.button);
    clearButton.textContent = "✖ Clear";
    clearButton.title = "c";
    clearButton.addEventListener("click", () => mustExist(this.#workarea).clear());
    this.appendChild(clearButton);

    const divider2 = document.createElement("span");
    divider2.classList.add(styles.divider);
    this.appendChild(divider2);

    const exportButton = document.createElement("button");
    exportButton.classList.add(styles.button);
    exportButton.textContent = "🔽 Export";
    exportButton.title = "x";
    exportButton.addEventListener("click", () => mustExist(this.#workarea).export());
    this.appendChild(exportButton);

    const restoreButton = document.createElement("button");
    restoreButton.classList.add(styles.button);
    restoreButton.textContent = "🔃 Restore";
    restoreButton.title = "i";
    restoreButton.addEventListener("click", () => mustExist(this.#workarea).restoreSnapshot());
    this.appendChild(restoreButton);

    console.debug("Toolbar connected.");
  }
}

customElements.define("dt-toolbar", Toolbar);
