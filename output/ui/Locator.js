export class Locator {
  constructor(workarea, scrollable) {
    this.workarea = workarea;
    this.scrollContainer = scrollable;
  }
  draggableToAbsolute(position) {
    const scrollOffset = this.scrollContainer ? {
      left: this.scrollContainer.scrollLeft,
      top: this.scrollContainer.scrollTop
    } : {
      left: 0,
      top: 0
    };
    return {
      x: position.x - this.workarea.offsetLeft + scrollOffset.left,
      y: position.y - this.workarea.offsetTop + scrollOffset.top
    };
  }
  absoluteToDraggable(position) {
    const scrollOffset = this.scrollContainer ? {
      left: this.scrollContainer.scrollLeft,
      top: this.scrollContainer.scrollTop
    } : {
      left: 0,
      top: 0
    };
    return {
      x: position.x + this.workarea.offsetLeft - scrollOffset.left,
      y: position.y + this.workarea.offsetTop - scrollOffset.top
    };
  }
  absoluteToMiniMap(position, miniMapCanvas) {
    return {
      x: position.x / this.workarea.scrollWidth * miniMapCanvas.width,
      y: position.y / this.workarea.scrollHeight * miniMapCanvas.height
    };
  }
  static forWorkarea(workarea, scrollable) {
    return new Locator(workarea, scrollable);
  }
}
