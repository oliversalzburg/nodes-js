import { isNil, mustExist } from "./Maybe";
import styles from "./Toolbar.module.css";
import { Workarea } from "./Workarea";

export class Toolbar extends HTMLElement {
  workarea: Workarea | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    setTimeout(() => {
      const forWorkarea = this.getAttribute("for");
      if (isNil(forWorkarea)) {
        throw new Error("Missing `for` attribute on dt-toolbar. Requires an ID of a dt-workarea.");
      }
      const workarea = mustExist(document.getElementById(forWorkarea)) as Workarea;
      workarea.registerToolbar(this);
    });
  }

  init(workarea: Workarea, initParameters?: unknown): void {
    this.workarea = workarea;

    this.classList.add(styles.toolbar);

    const addSeedButton = document.createElement("button");
    addSeedButton.classList.add(styles.button);
    addSeedButton.textContent = "➕ Seed";
    addSeedButton.addEventListener("click", () => mustExist(this.workarea).createNode("seed"));
    this.appendChild(addSeedButton);

    const addNoopButton = document.createElement("button");
    addNoopButton.classList.add(styles.button);
    addNoopButton.textContent = "➕ Noop";
    addNoopButton.addEventListener("click", () => mustExist(this.workarea).createNode("noop"));
    this.appendChild(addNoopButton);
  }
}

customElements.define("dt-toolbar", Toolbar);
