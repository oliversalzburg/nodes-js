declare module "plain-draggable" {
  export type NewPosition = {
    left: number;
    top: number;
  };

  export type ConstructionOptions = {
    autoScroll: boolean;
    handle: HTMLElement;
    left: number;
    onDrag: (event: NewPosition) => boolean | undefined;
    onDragEnd: (event: NewPosition) => void;
    onDragStart: (event: PointerEvent) => boolean | undefined;
    onMove: (event: NewPosition) => void;
    top: number;
  };

  class PlainDraggable {
    constructor(target: HTMLElement, options: Partial<ConstructionOptions>);
    left: number;
    top: number;
  }

  export default PlainDraggable;
}
