declare module "plain-draggable" {
  export type NewPosition = {
    left: number;
    top: number;
  };

  export type ConstructionOptions = {
    autoScroll: boolean;
    handle?: HTMLElement;
    left?: number;
    onMove: (event: NewPosition) => void;
    top?: number;
  };

  class PlainDraggable {
    constructor(target: HTMLElement, options: ConstructionOptions);
  }

  export default PlainDraggable;
}
