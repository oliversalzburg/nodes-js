import { isNil, mustExist } from "../Maybe";
import { Locator } from "./Locator";
import styles from "./MiniMap.module.css";
import { Scrollable } from "./Scrollable";
import { Workarea } from "./Workarea";

export class MiniMap extends HTMLElement {
  #scrollableContainer: Scrollable | null = null;
  #workarea: Workarea | null = null;
  #canvas: HTMLCanvasElement | null = null;
  #intervalHandle: number | null = null;

  connectedCallback() {
    this.classList.add(styles.minimap);

    const forWorkarea = this.getAttribute("for");
    if (isNil(forWorkarea)) {
      throw new Error("Missing `for` attribute on dt-minimap. Requires an ID of a dt-workarea.");
    }
    this.#workarea = mustExist(document.getElementById(forWorkarea)) as Workarea;

    this.#scrollableContainer = this.parentElement as Scrollable;

    this.#canvas = document.createElement("canvas");
    this.#canvas.width = this.clientWidth * devicePixelRatio;
    this.#canvas.height = this.clientHeight * devicePixelRatio;
    this.appendChild(this.#canvas);

    this.#intervalHandle = setInterval(() => this.update(), 1000);
  }

  disconnectedCallback() {
    if (this.#intervalHandle !== null) {
      clearInterval(this.#intervalHandle);
      this.#intervalHandle = null;
    }
  }

  update() {
    if (isNil(this.#canvas) || isNil(this.#scrollableContainer) || isNil(this.#workarea)) {
      return;
    }

    const context = mustExist(this.#canvas.getContext("2d"));
    const locator = Locator.forWorkarea(this.#workarea);

    context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    for (const node of mustExist(this.#workarea).nodes) {
      const position = locator.absoluteToMiniMap({ x: node.x, y: node.y }, this.#canvas);
      context.beginPath();
      context.rect(position.x, position.y, 6, 3);
      context.fillStyle = "#666";
      context.fill();
      context.closePath();
    }

    const position = locator.absoluteToMiniMap(
      { x: this.#scrollableContainer.scrollLeft, y: this.#scrollableContainer.scrollTop },
      this.#canvas
    );
    const size = locator.absoluteToMiniMap(
      {
        x: this.#scrollableContainer.clientWidth,
        y: this.#scrollableContainer.clientHeight,
      },
      this.#canvas
    );
    context.beginPath();
    context.rect(position.x, position.y, size.x, size.y);
    context.lineWidth = 1;
    context.strokeStyle = "#111";
    context.stroke();
    context.closePath();
  }
}

customElements.define("dt-minimap", MiniMap);
