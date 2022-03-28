export class RecordSet {
  columns: Array<string>;
  data: Array<unknown>;
  
  constructor(columns: Array<string>, data: Array<unknown>) {
    this.columns = columns;
    this.data = data;
  }
}
