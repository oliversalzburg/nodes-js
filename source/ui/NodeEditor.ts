import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeEditor extends Node {
  target: Node | null = null;
  line: LeaderLine | null = null;

  constructor() {
    super();

    this.nodeId = Node.makeId("editor");
    this.name = Node.makeName("Editor", this.nodeId);
  }

  connectedCallback() {
    super.connectedCallback();

    const textarea = document.createElement("textarea");
    this.appendChild(textarea);
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
