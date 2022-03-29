import { nanoid } from "nanoid";
import { Input } from "./Input";
import { mustExist } from "./Maybe";
import styles from "./Node.module.css";
import { Output } from "./Output";
import { SerializedConnection, SerializedNode, Workarea } from "./Workarea";

export abstract class Node extends HTMLElement {
  nodeId: string;
  workarea: Workarea | null = null;

  name: string;
  x = 0;
  y = 0;

  inputs = new Array<Input>();
  outputs = new Array<Output>();

  constructor() {
    super();

    this.nodeId = Node.makeId("node");
    this.name = Node.makeName("Node", this.nodeId);
  }

  init(workarea: Workarea, initParameters?: SerializedNode): void {
    this.workarea = workarea;

    this.nodeId = initParameters?.id ?? this.nodeId;
    this.name = initParameters?.name ?? this.name;
    this.x = initParameters?.x ?? this.x;
    this.y = initParameters?.y ?? this.y;

    this.classList.add(styles.node);

    const title = document.createElement("title");
    title.classList.add(styles.title);
    title.textContent = this.name;
    this.appendChild(title);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(styles.delete);
    deleteButton.textContent = "✖";
    deleteButton.addEventListener("click", () => mustExist(this.workarea).deleteNode(this));
    this.appendChild(deleteButton);
  }

  initConnectionFrom(columnSource: Output, event: MouseEvent) {
    mustExist(this.workarea).initConnectionFrom(columnSource, event);
  }
  finalizeConnection(columnTarget: Input) {
    mustExist(this.workarea).finalizeConnection(columnTarget);
  }

  updatePosition(newPosition: { left: number; top: number }) {
    this.x = newPosition.left;
    this.y = newPosition.top;

    for (const input of this.inputs) {
      input.updateUi();
    }
    for (const output of this.outputs) {
      output.updateUi();
    }
  }

  protected addOutput(initParameters?: SerializedConnection) {
    const connectorOut = document.createElement("dt-output") as Output;
    connectorOut.init(this, initParameters);
    this.appendChild(connectorOut);
    this.outputs.push(connectorOut);
    return connectorOut;
  }

  abstract serialize(): SerializedNode;

  static makeId(type: string) {
    return `${type}-${nanoid(6)}`;
  }
  static makeName(type: string, id: string) {
    return `${type} ${id}`;
  }
}
