import "leader-line";
import { Column } from "./Column";

export class Connection {
  source: Column;
  target: Column;

  line: LeaderLine;

  constructor(source: Column, target: Column) {
    this.source = source;
    this.target = target;

    this.line = new LeaderLine(source, target);
  }
}
