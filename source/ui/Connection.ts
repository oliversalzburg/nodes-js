import "leader-line";
import { Input } from "./Input.js";
import { Output } from "./Output.js";

/**
 * A connection between an output and an input.
 */
export class Connection {
  /**
   * The source output.
   */
  source: Output;

  /**
   * The target input.
   */
  target: Input;

  /**
   * The UI element connecting the source and target.
   */
  line: LeaderLine;

  /**
   * Constructs a new connection.
   * @param source - The source of the connection.
   * @param target - The target of the connection.
   */
  constructor(source: Output, target: Input) {
    this.source = source;
    this.target = target;

    this.line = new LeaderLine(source, target, {
      color: "#111",
      endSocket: "left",
      startSocket: "right",
    });
  }

  /**
   * Disconnect this connection.
   */
  disconnect() {
    this.source.disconnect(this);
    this.target.disconnect(this);
    this.line.remove();
  }
}
