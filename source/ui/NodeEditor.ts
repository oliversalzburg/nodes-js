import "codemirror";
import CodeMirror from "codemirror";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/mdn-like.css";
import { mustExist } from "../Maybe";
import { Coordinates } from "./Locator";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeEditor extends Node {
  #textarea: HTMLTextAreaElement | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #codeMirror: CodeMirror.EditorFromTextArea | null = null;

  target: Node | null = null;
  line: LeaderLine | null = null;

  get behaviorSource(): string {
    return this.#codeMirror?.getValue() ?? "";
  }

  constructor() {
    super("_editor", "Behavior Editor");

    this.hasIo = false;
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

    this.name = `Behavior Editor for ${this.target.nodeId}`;

    mustExist(this.#textarea).value = node.behavior?.toEditableScript() ?? "";
    this.#codeMirror = CodeMirror.fromTextArea(mustExist(this.#textarea), {
      extraKeys: { "Ctrl-Space": "autocomplete" },
      lineNumbers: true,
      mode: { name: "javascript" },
      showHint: true,
      theme: "mdn-like",
    });
  }

  onClickDelete(event?: MouseEvent): void {
    // Check if the current script is different from what the behavior defines.
    // TODO: This is kinda wasteful. Maybe do some caching?
    if (this.behaviorSource !== this.target?.behavior?.toEditableScript()) {
      const shouldApply = window.confirm("Apply new behavior?");
      if (shouldApply) {
        this.workarea?.closeBehaviorEditor(mustExist(this.target));
        return;
      }
    }

    super.onClickDelete(event);
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);
    this.updateUi();
  }

  updateUi(newPosition?: Coordinates) {
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
