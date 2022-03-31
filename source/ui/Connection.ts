import "leader-line";
import { Input } from "./Input";
import { Output } from "./Output";

export class Connection {
  source: Output;
  target: Input;

  line: LeaderLine;

  constructor(source: Output, target: Input) {
    this.source = source;
    this.target = target;

    this.line = new LeaderLine(source, target, {
      color: "#111",
      endSocket: "left",
      startSocket: "right",
    });
  }

  disconnect() {
    this.source.disconnect(this);
    this.target.disconnect(this);
    this.line.remove();
  }
}
