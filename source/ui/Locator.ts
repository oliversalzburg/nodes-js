import { Scrollable } from "./Scrollable";
import { Workarea } from "./Workarea";

export type Coordinates = { x: number; y: number };

export class Locator {
  workarea: Workarea;
  scrollContainer: Scrollable | undefined;

  constructor(workarea: Workarea, scrollable?: Scrollable) {
    this.workarea = workarea;
    this.scrollContainer = scrollable;
  }

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

  static forWorkarea(workarea: Workarea, scrollable?: Scrollable) {
    return new Locator(workarea, scrollable);
  }
}