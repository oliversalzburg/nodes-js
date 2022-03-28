import type LeaderLine from "leader-line";
import { Column } from "./column";

export class Connection {
  source: Column;
  target: Column;

  line: LeaderLine;

  constructor(source: Column, target: Column) {
    this.source = source;
    this.target = target;

    // @ts-expect-error LeaderLine is imported globally.
    this.line = new LeaderLine(source, target);
  }
}
