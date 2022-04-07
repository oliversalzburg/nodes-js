import { mustExist } from "../Maybe";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeEditor extends Node {
  #textarea: HTMLTextAreaElement | null = null;
  #resizeObserver: ResizeObserver | null = null;

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

    this.#resizeObserver = new ResizeObserver(() => {
      this.workarea?.onNodeResize(this);
    });
    this.#resizeObserver.observe(this.#textarea);
  }

  disconnectedCallback() {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  editNodeBehavior(node: Node) {
    this.target = node;
    node.behaviorEditor = this;
    mustExist(this.#textarea).value = node.behavior?.toEditableScript() ?? "";
  }

  onClickDelete(event: MouseEvent): void {
    const shouldApply = window.confirm("Apply new behavior?");
    if (shouldApply) {
      this.workarea?.closeBehaviorEditor(mustExist(this.target));
    } else {
      super.onClickDelete(event);
    }
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
