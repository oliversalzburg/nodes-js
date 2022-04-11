import { asyncEventHandler } from "../Async";
import { isNil, mustExist } from "../Maybe";
import { Confirm } from "./Confirm";
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

    const addScriptButton = document.createElement("button");
    addScriptButton.classList.add(styles.button, styles.highlightedButton);
    addScriptButton.textContent = "📜 Script";
    addScriptButton.title = "3";
    addScriptButton.addEventListener("click", () => {
      mustExist(this.#workarea).createNode("script").catch(console.error);
    });
    this.appendChild(addScriptButton);

    const addRowButton = document.createElement("button");
    addRowButton.classList.add(styles.button);
    addRowButton.textContent = "📜 Row";
    addRowButton.title = "4";
    addRowButton.addEventListener("click", () => {
      mustExist(this.#workarea).createNode("row").catch(console.error);
    });
    this.appendChild(addRowButton);

    const addNoopButton = document.createElement("button");
    addNoopButton.classList.add(styles.button);
    addNoopButton.textContent = "📜 Noop";
    addNoopButton.title = "2";
    addNoopButton.addEventListener("click", () => {
      mustExist(this.#workarea).createNode("noop").catch(console.error);
    });
    this.appendChild(addNoopButton);

    const addSeedButton = document.createElement("button");
    addSeedButton.classList.add(styles.button);
    addSeedButton.textContent = "➕ Seed";
    addSeedButton.title = "1";
    addSeedButton.addEventListener("click", () => {
      mustExist(this.#workarea).createNode("seed").catch(console.error);
    });
    this.appendChild(addSeedButton);

    const addFileButton = document.createElement("button");
    addFileButton.classList.add(styles.button);
    addFileButton.textContent = "➕ File";
    addFileButton.addEventListener("click", () => {
      mustExist(this.#workarea).createNode("file").catch(console.error);
    });
    this.appendChild(addFileButton);

    const divider1 = document.createElement("span");
    divider1.classList.add(styles.divider);
    this.appendChild(divider1);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(styles.button);
    deleteButton.textContent = "✖ Delete";
    deleteButton.title = "D";
    deleteButton.addEventListener(
      "click",
      asyncEventHandler(async event => {
        const choice = await Confirm.yesNo("Delete selected nodes?");
        if (choice === Confirm.YES) {
          mustExist(this.#workarea).deleteSelectedNodes();
        }
      })
    );
    this.appendChild(deleteButton);

    const clearButton = document.createElement("button");
    clearButton.classList.add(styles.button);
    clearButton.textContent = "♻ Clear";
    clearButton.title = "X";
    clearButton.addEventListener(
      "click",
      asyncEventHandler(async () => {
        const choice = await Confirm.yesNo("Clear all nodes?");
        if (choice === Confirm.YES) {
          mustExist(this.#workarea).clear();
        }
      })
    );
    this.appendChild(clearButton);

    const divider2 = document.createElement("span");
    divider2.classList.add(styles.divider);
    this.appendChild(divider2);

    const exportButton = document.createElement("button");
    exportButton.classList.add(styles.button);
    exportButton.textContent = "🔽 Export";
    exportButton.title = "E";
    exportButton.addEventListener("click", () => mustExist(this.#workarea).export());
    this.appendChild(exportButton);

    const restoreButton = document.createElement("button");
    restoreButton.classList.add(styles.button);
    restoreButton.textContent = "🔃 Restore snapshot";
    restoreButton.title = "R";
    restoreButton.addEventListener("click", () => {
      mustExist(this.#workarea).restoreSnapshot().catch(console.error);
    });
    this.appendChild(restoreButton);

    const demoButton = document.createElement("button");
    demoButton.classList.add(styles.button);
    demoButton.textContent = "🎪 Demo";
    demoButton.addEventListener("click", () => {
      mustExist(this.#workarea).restoreSnapshotDemo().catch(console.error);
    });
    this.appendChild(demoButton);

    const executeButton = document.createElement("button");
    executeButton.classList.add(styles.button);
    executeButton.textContent = "▶ Execute";
    executeButton.addEventListener("click", () => {
      mustExist(this.#workarea).execute().catch(console.error);
    });
    this.appendChild(executeButton);

    console.debug("Toolbar connected.");
  }
}

customElements.define("dt-toolbar", Toolbar);
