import { nanoid } from "nanoid";
import { Connection } from "./Connection";
import { Input } from "./Input";
import { mustExist } from "./Maybe";
import styles from "./Node.module.css";
import { Output } from "./Output";
import { SerializedConnection, SerializedNode, Workarea } from "./Workarea";

export abstract class Node extends HTMLElement {
  nodeId: string;
  workarea: Workarea | null = null;

  name: string;
  titleElement: HTMLTitleElement | null = null;
  x = 0;
  y = 0;

  inputs = new Array<Input>();
  outputs = new Array<Output>();

  constructor() {
    super();

    this.nodeId = Node.makeId("node");
    this.name = Node.makeName("Node", this.nodeId);
  }

  connectedCallback() {
    this.workarea = this.parentElement as Workarea;

    this.classList.add(styles.node);

    this.titleElement = document.createElement("title");
    this.titleElement.classList.add(styles.title);
    this.titleElement.textContent = this.name;
    this.appendChild(this.titleElement);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(styles.delete);
    deleteButton.textContent = "✖";
    deleteButton.addEventListener("click", () => mustExist(this.workarea).deleteNode(this));
    this.appendChild(deleteButton);
  }

  init(initParameters?: SerializedNode): void {
    this.nodeId = initParameters?.id ?? this.nodeId;
    this.name = initParameters?.name ?? this.name;
    this.x = initParameters?.x ?? this.x;
    this.y = initParameters?.y ?? this.y;
  }

  initConnectionFrom(columnSource: Output, event: MouseEvent) {
    mustExist(this.workarea).initConnectionFrom(columnSource, event);
  }
  finalizeConnection(columnTarget: Input) {
    mustExist(this.workarea).finalizeConnection(columnTarget);
  }

  onConnect(connection: Connection) {
    this.update();
    this.updateUi();
  }

  update() {
    for (const input of this.inputs) {
      input.update();
    }
  }

  updateUi(newPosition?: { left: number; top: number }) {
    mustExist(this.titleElement).textContent = this.name;

    this.x = newPosition?.left ?? this.x;
    this.y = newPosition?.top ?? this.y;

    for (const input of this.inputs) {
      input.updateUi();
    }
    for (const output of this.outputs) {
      output.updateUi();
    }
  }

  protected addInput(initParameters?: SerializedConnection) {
    const input = document.createElement("dt-input") as Input;
    this.appendChild(input);
    input.init(initParameters);
    this.inputs.push(input);
    return input;
  }
  protected addOutput(initParameters?: SerializedConnection) {
    const output = document.createElement("dt-output") as Output;
    this.appendChild(output);
    output.init(initParameters);
    this.outputs.push(output);
    return output;
  }

  abstract serialize(): SerializedNode;

  static makeId(type: string) {
    return `${type}-${nanoid(6)}`;
  }
  static makeName(type: string, id: string) {
    return `${type} ${id}`;
  }
}
