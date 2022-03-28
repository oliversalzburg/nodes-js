declare module "leader-line" {
  class LeaderLine {
    constructor(start: HTMLElement, end: HTMLElement);
    position(): void;
    remove(): void;
  }

  export default LeaderLine;
}
