var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _workarea;
import {asyncEventHandler} from "../Async.js";
import {isNil, mustExist} from "../Maybe.js";
import {Confirm} from "./Confirm.js";
import styles from "./Toolbar.module.css.proxy.js";
export class Toolbar extends HTMLElement {
  constructor() {
    super();
    _workarea.set(this, void 0);
    __privateSet(this, _workarea, null);
    console.debug("Toolbar constructed.");
  }
  connectedCallback() {
    this.classList.add(styles.toolbar);
    const forWorkarea = this.getAttribute("for");
    if (isNil(forWorkarea)) {
      throw new Error("Missing `for` attribute on dt-toolbar. Requires an ID of a dt-workarea.");
    }
    __privateSet(this, _workarea, mustExist(document.getElementById(forWorkarea)));
    const addScriptButton = document.createElement("button");
    addScriptButton.classList.add(styles.button, styles.highlightedButton);
    addScriptButton.textContent = "📜 Script";
    addScriptButton.title = "3";
    addScriptButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).createNode("script").catch(console.error);
    });
    this.appendChild(addScriptButton);
    const addRowButton = document.createElement("button");
    addRowButton.classList.add(styles.button);
    addRowButton.textContent = "📜 Row";
    addRowButton.title = "4";
    addRowButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).createNode("row").catch(console.error);
    });
    this.appendChild(addRowButton);
    const addNoopButton = document.createElement("button");
    addNoopButton.classList.add(styles.button);
    addNoopButton.textContent = "📜 Noop";
    addNoopButton.title = "2";
    addNoopButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).createNode("noop").catch(console.error);
    });
    this.appendChild(addNoopButton);
    const addSeedButton = document.createElement("button");
    addSeedButton.classList.add(styles.button);
    addSeedButton.textContent = "➕ Seed";
    addSeedButton.title = "1";
    addSeedButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).createNode("seed").catch(console.error);
    });
    this.appendChild(addSeedButton);
    const addFileButton = document.createElement("button");
    addFileButton.classList.add(styles.button);
    addFileButton.textContent = "➕ File";
    addFileButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).createNode("file").catch(console.error);
    });
    this.appendChild(addFileButton);
    const divider1 = document.createElement("span");
    divider1.classList.add(styles.divider);
    this.appendChild(divider1);
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(styles.button);
    deleteButton.textContent = "✖ Delete";
    deleteButton.title = "D";
    deleteButton.addEventListener("click", asyncEventHandler(async (event) => {
      const choice = await Confirm.yesNo("Delete selected nodes?");
      if (choice === Confirm.YES) {
        mustExist(__privateGet(this, _workarea)).deleteSelectedNodes();
      }
    }));
    this.appendChild(deleteButton);
    const clearButton = document.createElement("button");
    clearButton.classList.add(styles.button);
    clearButton.textContent = "♻ Clear";
    clearButton.title = "X";
    clearButton.addEventListener("click", asyncEventHandler(async () => {
      const choice = await Confirm.yesNo("Clear all nodes?");
      if (choice === Confirm.YES) {
        mustExist(__privateGet(this, _workarea)).clear();
      }
    }));
    this.appendChild(clearButton);
    const divider2 = document.createElement("span");
    divider2.classList.add(styles.divider);
    this.appendChild(divider2);
    const exportButton = document.createElement("button");
    exportButton.classList.add(styles.button);
    exportButton.textContent = "🔽 Export";
    exportButton.title = "E";
    exportButton.addEventListener("click", () => mustExist(__privateGet(this, _workarea)).export());
    this.appendChild(exportButton);
    const restoreButton = document.createElement("button");
    restoreButton.classList.add(styles.button);
    restoreButton.textContent = "🔃 Restore snapshot";
    restoreButton.title = "R";
    restoreButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).restoreSnapshot().catch(console.error);
    });
    this.appendChild(restoreButton);
    const demoButton = document.createElement("button");
    demoButton.classList.add(styles.button);
    demoButton.textContent = "🎪 Demo";
    demoButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).restoreSnapshotDemo().catch(console.error);
    });
    this.appendChild(demoButton);
    const executeButton = document.createElement("button");
    executeButton.classList.add(styles.button);
    executeButton.textContent = "▶ Execute";
    executeButton.addEventListener("click", () => {
      mustExist(__privateGet(this, _workarea)).execute().catch(console.error);
    });
    this.appendChild(executeButton);
    console.debug("Toolbar connected.");
  }
}
_workarea = new WeakMap();
customElements.define("dt-toolbar", Toolbar);
