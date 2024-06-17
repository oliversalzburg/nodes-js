import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { mustExist } from "@oliversalzburg/js-utils/nil.js";
import "codemirror";
import CodeMirror from "codemirror";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/mdn-like.css";
import { Confirm } from "./Confirm.js";
import { Coordinates } from "./Locator.js";
import { Node } from "./Node.js";
import { SerializedNode } from "./Workarea.js";

/**
 * A node that serves as a behavior editor for other nodes.
 */
export class NodeEditor extends Node {
  #textarea: HTMLTextAreaElement | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #codeMirror: CodeMirror.EditorFromTextArea | null = null;

  /**
   * The target node.
   */
  target: Node | null = null;

  /**
   * The line that connects this editor to its target node.
   */
  line: LeaderLine | null = null;

  /**
   * Retrieves the constructor for this Node.
   * @returns The constructor for this Node.
   */
  getFactory(): ConstructorOf<Node> {
    return NodeEditor;
  }

  /**
   * Retrieve the source code of the behavior.
   * @returns The source code of the behavior.
   */
  get behaviorSource(): string {
    return this.#codeMirror?.getValue() ?? "";
  }

  /**
   * Constructs a new behavior editor.
   */
  constructor() {
    super("_editor", "Behavior Editor");

    this.hasIo = false;
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    super.connectedCallback();

    this.#textarea = document.createElement("textarea");
    this.#textarea.setAttribute("spellcheck", "false");
    this.appendChild(this.#textarea);
  }

  /**
   * Invoked when the DOM element is disconnected.
   */
  disconnectedCallback() {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  /**
   * Edit the given node's behavior.
   * @param node - The node that should be edited.
   */
  editNodeBehavior(node: Node) {
    this.target = node;
    node.behaviorEditor = this;

    this.name = `Behavior Editor for ${this.target.nodeId}`;

    mustExist(this.#textarea).value = node.behavior?.toEditableScript() ?? "";
    this.#codeMirror = CodeMirror.fromTextArea(mustExist(this.#textarea), {
      extraKeys: { "Ctrl-Space": "autocomplete" },
      lineNumbers: true,
      mode: { name: "javascript" },
      theme: "mdn-like",
    });

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = new ResizeObserver(() => {
      this.workarea?.onNodeResize(this);
    });
    this.#resizeObserver.observe(this.#codeMirror.getWrapperElement());
  }

  /**
   * Invoked when the user closes the editor.
   * @param event - The mouse event that triggered the operation.
   * @returns A promise that is resolved once the operation completes.
   */
  async onClickDelete(event?: MouseEvent): Promise<void> {
    // Check if the current script is different from what the behavior defines.
    // TODO: This is kinda wasteful. Maybe do some caching?
    if (this.behaviorSource !== this.target?.behavior?.toEditableScript()) {
      const shouldApply = await Confirm.yesNoCancel("Apply new behavior?");
      if (shouldApply === "yes") {
        await this.workarea?.closeBehaviorEditor(mustExist(this.target));
        return;
      } else if (shouldApply === "cancel") {
        return;
      }
    }

    super.onClickDelete(event);
  }

  /**
   * Initializes a new instance of the Node.
   * @param initParameters - The parameters for the Node.
   */
  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);
    this.updateUi();
  }

  /**
   * Update the UI of the node.
   * @param newPosition - The new position for the node.
   */
  updateUi(newPosition?: Coordinates) {
    super.updateUi(newPosition);

    if (this.line) {
      this.line.position();
    }
  }

  /**
   * Serialize the node.
   */
  serialize(): SerializedNode {
    throw new Error("Node can not be serialized.");
  }
}

customElements.define("dt-node-editor", NodeEditor);
