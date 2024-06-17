import { isNil, mustExist } from "@oliversalzburg/js-utils/nil.js";
import { Locator } from "./Locator.js";
import styles from "./MiniMap.module.css";
import { Scrollable } from "./Scrollable.js";
import { Workarea } from "./Workarea.js";

/**
 * A map that provides an overview of a work area.
 */
export class MiniMap extends HTMLElement {
  #scrollableContainer: Scrollable | null = null;
  #workarea: Workarea | null = null;
  #canvas: HTMLCanvasElement | null = null;
  #intervalHandle: number | null = null;

  /**
   * Invoked when the DOM element is connected.
   */
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

    this.addEventListener("click", (event: MouseEvent) => {
      this.onClick(event);
    });

    this.#intervalHandle = window.setInterval(() => {
      this.update();
    }, 1000);
  }

  /**
   * Invoked when the DOM element is disconnected.
   */
  disconnectedCallback() {
    if (this.#intervalHandle !== null) {
      clearInterval(this.#intervalHandle);
      this.#intervalHandle = null;
    }
  }

  /**
   * Updates the minimap.
   */
  update(): void {
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
      this.#canvas,
    );
    const size = locator.absoluteToMiniMap(
      {
        x: this.#scrollableContainer.clientWidth,
        y: this.#scrollableContainer.clientHeight,
      },
      this.#canvas,
    );
    context.beginPath();
    context.rect(position.x, position.y, size.x, size.y);
    context.lineWidth = 1;
    context.strokeStyle = "#111";
    context.stroke();
    context.closePath();
  }

  /**
   * Invoked when the user clicks on the map.
   * @param event - The mouse event that triggered the operation.
   */
  onClick(event: MouseEvent): void {
    if (isNil(this.#canvas) || isNil(this.#scrollableContainer) || isNil(this.#workarea)) {
      return;
    }

    const locator = Locator.forWorkarea(this.#workarea);

    const position = locator.miniMapToAbsolute({ x: event.offsetX, y: event.offsetY }, this);

    this.#scrollableContainer.scrollLeft = position.x;
    this.#scrollableContainer.scrollTop = position.y;
  }
}

customElements.define("dt-minimap", MiniMap);
