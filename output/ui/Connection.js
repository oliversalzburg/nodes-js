import "../../_snowpack/pkg/leader-line.js";
export class Connection {
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.line = new LeaderLine(source, target, {
      color: "#111",
      endSocket: "left",
      startSocket: "right"
    });
  }
  disconnect() {
    this.source.disconnect(this);
    this.target.disconnect(this);
    this.line.remove();
  }
}
