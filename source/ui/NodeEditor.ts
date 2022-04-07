import { mustExist } from "./Maybe";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeEditor extends Node {
  #textarea: HTMLTextAreaElement | null = null;

  target: Node | null = null;
  line: LeaderLine | null = null;

  get behaviorSource(): string {
    return this.#textarea?.value ?? "";
  }

  constructor() {
    super();

    this.nodeId = Node.makeId("editor");
    this.name = Node.makeName("Editor", this.nodeId);
  }

  connectedCallback() {
    super.connectedCallback();

    this.#textarea = document.createElement("textarea");
    this.#textarea.setAttribute("spellcheck", "false");
    this.appendChild(this.#textarea);
  }

  editNodeBehavior(node: Node) {
    this.target = node;
    node.behaviorEditor = this;
    mustExist(this.#textarea).value = node.behavior ?? "";
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);
    this.updateUi();
  }

  updateUi(newPosition?: { left: number; top: number }) {
    super.updateUi(newPosition);

    if (this.line) {
      this.line.position();
    }
  }

  serialize(): SerializedNode {
    throw new Error("Node can not be serialized.");
  }
}

customElements.define("dt-node-editor", NodeEditor);
