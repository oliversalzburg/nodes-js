import { nanoid } from "nanoid";
import { Input } from "./input";
import styles from "./node.module.css";
import { Output } from "./output";
import { SerializedNode, Workarea } from "./workarea";

export abstract class Node extends HTMLElement {
  nodeId: string | null = null;
  workarea: Workarea | null = null;

  name = "";
  x = 0;
  y = 0;

  inputs = new Array<Input>();
  outputs = new Array<Output>();

  constructor() {
    super();
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
    deleteButton.addEventListener("click", () => this.workarea!.deleteNode(this));
    this.appendChild(deleteButton);
  }

  initConnectionFrom(columnSource: Output) {
    this.workarea?.initConnectionFrom(columnSource);
  }
  finalizeConnection(columnTarget: Input) {
    this.workarea?.finalizeConnection(columnTarget);
  }

  updatePosition(newPosition: { left: number; top: number }) {
    this.x = newPosition.left;
    this.y = newPosition.top;

    for (const input of this.inputs) {
      input.updateConnections();
    }
    for (const output of this.outputs) {
      output.updateConnections();
    }
  }

  abstract serialize(): SerializedNode;

  static makeId(type: string) {
    return `${type}-${nanoid(6)}`;
  }
  static makeName(type: string, id: string) {
    return `${type} ${id}`;
  }
}
