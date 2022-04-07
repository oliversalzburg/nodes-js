import { nanoid } from "nanoid";
import { Connection } from "./Connection";
import { Input } from "./Input";
import { mustExist } from "./Maybe";
import styles from "./Node.module.css";
import { NodeEditor } from "./NodeEditor";
import { Output } from "./Output";
import { SerializedInput, SerializedNode, SerializedOutput, Workarea } from "./Workarea";

export type CompiledBehavior = () => void;

export abstract class Node extends HTMLElement {
  nodeId: string;
  workarea: Workarea | null = null;

  behaviorEditor: NodeEditor | null = null;
  behavior: string | null = null;
  behaviorCompiled: CompiledBehavior | null = null;

  name: string;
  x = 0;
  y = 0;
  protected hasBehavior = false;

  #selected = false;

  #titleElement: HTMLTitleElement | null = null;
  #editElement: HTMLButtonElement | null = null;
  #deleteElement: HTMLButtonElement | null = null;

  inputs = new Array<Input>();
  outputs = new Array<Output>();

  get selected() {
    return this.#selected;
  }
  set selected(value: boolean) {
    if (value) {
      this.select();
    } else {
      this.deselect();
    }
  }

  get titleElement(): HTMLTitleElement | null {
    return this.#titleElement;
  }
  protected set titleElement(value: HTMLTitleElement | null) {
    this.#titleElement = value;
  }

  get editElement(): HTMLButtonElement | null {
    return this.#editElement;
  }
  protected set editElement(value: HTMLButtonElement | null) {
    this.#editElement = value;
  }

  get deleteElement(): HTMLButtonElement | null {
    return this.#deleteElement;
  }
  protected set deleteElement(value: HTMLButtonElement | null) {
    this.#deleteElement = value;
  }

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
    this.titleElement.addEventListener("click", (event: MouseEvent) => this.onClickTitle(event));
    this.appendChild(this.titleElement);

    if (this.hasBehavior) {
      this.editElement = document.createElement("button");
      this.editElement.classList.add(styles.edit);
      this.editElement.textContent = "⬤";
      this.editElement.addEventListener("click", event =>
        mustExist(this.workarea).editNodeBehavior(this, event)
      );
      this.appendChild(this.editElement);
    }

    this.deleteElement = document.createElement("button");
    this.deleteElement.classList.add(styles.delete);
    this.deleteElement.textContent = "✖";
    this.deleteElement.addEventListener("click", () => mustExist(this.workarea).deleteNode(this));
    this.appendChild(this.deleteElement);
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
  onClickTitle(event: MouseEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (!this.#selected) {
      this.select();
    } else {
      this.deselect();
    }
  }
  select(event?: MouseEvent) {
    if (this.#selected) {
      return;
    }

    this.classList.add(styles.selected);
    this.#selected = true;
    this.workarea?.onNodeSelect(this, event);
  }
  deselect(event?: MouseEvent) {
    if (!this.#selected) {
      return;
    }

    this.classList.remove(styles.selected);
    this.#selected = false;
    this.workarea?.onNodeDeselect(this, event);
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

    if (this.behaviorEditor) {
      this.behaviorEditor.updateUi();
    }
  }
  updateBehavior(behavior = this.behavior) {
    this.behavior = behavior;
    if (this.behavior === null) {
      this.behaviorCompiled = null;
      return;
    }

    this.behaviorCompiled = new Function(this.behavior) as CompiledBehavior;
    this.update();
  }

  protected addInput(initParameters?: SerializedInput) {
    const input = document.createElement("dt-input") as Input;
    this.appendChild(input);
    input.init(initParameters);
    this.inputs.push(input);
    return input;
  }
  protected addOutput(initParameters?: SerializedOutput) {
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
