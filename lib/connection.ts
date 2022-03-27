import { Column } from "./column";
import { Input } from "./input";
import { Output } from "./output";

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
