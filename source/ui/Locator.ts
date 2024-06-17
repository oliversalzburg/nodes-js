import { MiniMap } from "./MiniMap.js";
import { Scrollable } from "./Scrollable.js";
import { Workarea } from "./Workarea.js";

/**
 * X and Y coordinates.
 */
export type Coordinates = {
  /**
   * The X-coordinate.
   */
  x: number;

  /**
   * The Y-coordinate.
   */
  y: number;
};

/**
 * Helps with calculations inside a work area.
 */
export class Locator {
  /**
   * The target work area.
   */
  workarea: Workarea;

  /**
   * The scrollable container for the work area.
   */
  scrollContainer: Scrollable | undefined;

  /**
   * Constructs a new locator.
   * @param workarea - The work area this locator refers to.
   * @param scrollable - The scrollable area this locator refers to.
   */
  constructor(workarea: Workarea, scrollable?: Scrollable) {
    this.workarea = workarea;
    this.scrollContainer = scrollable;
  }

  /**
   * Convert the position of a draggable item to absolute values.
   * @param position - The position to convert.
   * @returns The converted position.
   */
  draggableToAbsolute(position: Coordinates): Coordinates {
    const scrollOffset = this.scrollContainer
      ? {
          left: this.scrollContainer.scrollLeft,
          top: this.scrollContainer.scrollTop,
        }
      : {
          left: 0,
          top: 0,
        };

    return {
      x: position.x - this.workarea.offsetLeft + scrollOffset.left,
      y: position.y - this.workarea.offsetTop + scrollOffset.top,
    };
  }

  /**
   * Convert an absolute position to the position of a draggable item.
   * @param position - The position to convert.
   * @returns The converted position.
   */
  absoluteToDraggable(position: Coordinates): Coordinates {
    const scrollOffset = this.scrollContainer
      ? {
          left: this.scrollContainer.scrollLeft,
          top: this.scrollContainer.scrollTop,
        }
      : {
          left: 0,
          top: 0,
        };

    return {
      x: position.x + this.workarea.offsetLeft - scrollOffset.left,
      y: position.y + this.workarea.offsetTop - scrollOffset.top,
    };
  }

  /**
   * Convert an absolute position to a position on the minimap.
   * @param position - The position to convert.
   * @param miniMapCanvas - The canvas element in the minimap.
   * @returns The converted position.
   */
  absoluteToMiniMap(position: Coordinates, miniMapCanvas: HTMLCanvasElement): Coordinates {
    return {
      x: (position.x / this.workarea.scrollWidth) * miniMapCanvas.width,
      y: (position.y / this.workarea.scrollHeight) * miniMapCanvas.height,
    };
  }

  /**
   * Convert a minimap position to an absolute position.
   * @param position - The position to convert.
   * @param miniMap - The minimap.
   * @returns The converted position.
   */
  miniMapToAbsolute(position: Coordinates, miniMap: MiniMap): Coordinates {
    return {
      x: (position.x / miniMap.clientWidth) * this.workarea.scrollWidth,
      y: (position.y / miniMap.clientHeight) * this.workarea.scrollHeight,
    };
  }

  /**
   * Constructs a new locator for the given components.
   * @param workarea - The workarea for which this should be the locator.
   * @param scrollable - The scrollable area associated with the workarea.
   * @returns A new locator for the given workarea.
   */
  static forWorkarea(workarea: Workarea, scrollable?: Scrollable) {
    return new Locator(workarea, scrollable);
  }
}
