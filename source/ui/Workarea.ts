import "leader-line";
import LZString from "lz-string";
import PlainDraggable, { NewPosition } from "plain-draggable";
import { Behavior } from "../behavior/Behavior";
import { Execution } from "../execution/Execution";
import { isNil, mustExist } from "../Maybe";
import { Connection } from "./Connection";
import { Decoy } from "./Decoy";
import { Input } from "./Input";
import { Coordinates, Locator } from "./Locator";
import { Node } from "./Node";
import { NodeEditor } from "./NodeEditor";
import { NodeNoop } from "./NodeNoop";
import { NodeRow } from "./NodeRow";
import { NodeScript } from "./NodeScript";
import { NodeSeed } from "./NodeSeed";
import { Output } from "./Output";
import { Scrollable } from "./Scrollable";
import { snapshot } from "./snapshot";
import styles from "./Workarea.module.css";

export type NodeTypes = "_editor" | "noop" | "row" | "script" | "seed";

export type SerializedConnection = {
  id: string;
  connections: Array<{ source: string; target: string }>;
};

export type SerializedInput = {
  id: string;
  output: string | null;
};

export type SerializedOutput = {
  id: string;
  inputs: Array<string>;
};

export type SerializedBehavior = {
  metadata: {
    inputs: Array<{ identifier: string; label: string }>;
    outputs: Array<{ identifier: string; label: string }>;
  };
  script: string;
};

export type SerializedNode = {
  type: NodeTypes;
  id: string;
  name: string;
  x: number;
  y: number;
  inputs: Array<SerializedInput>;
  outputs: Array<SerializedOutput>;
  behavior?: SerializedBehavior;
};

export type SerializedWorkarea = {
  stage?: { x: number; y: number };
  nodes: Array<SerializedNode>;
};

export class Workarea extends HTMLElement {
  nodes = new Array<Node>();
  connections = new Set<Connection>();

  #currentConnectionSource: Output | null = null;
  #currentDecoy: Decoy | null = null;
  #currentDecoyLine: LeaderLine | null = null;

  #draggables = new Map<Node, PlainDraggable>();
  #dragOperationSource = new Map<Node, Coordinates>();

  #scrollableContainer: Scrollable | null = null;

  constructor() {
    super();
    console.debug("Workarea constructed.");
  }

  get selectedNodes(): Iterable<Node> {
    return this.nodes.filter(node => node.selected);
  }

  connectedCallback() {
    this.classList.add(styles.workarea);

    this.addEventListener("click", event => this.onClick(event));
    this.addEventListener("mousedown", event => this.onMouseDown(event));
    this.addEventListener("mousemove", event => this.onMouseMove(event));
    this.addEventListener("mouseup", event => this.onMouseUp(event));

    document.addEventListener("keydown", event => this.onKeyDown(event));
    document.addEventListener("keyup", event => this.onKeyUp(event));

    console.debug("Workarea connected.");
  }

  initConnectionFrom(columnSource: Output, event: MouseEvent) {
    this.#currentConnectionSource = columnSource;

    const decoy = document.createElement("dt-decoy") as Decoy;
    decoy.init(this);
    this.appendChild(decoy);
    this.#currentDecoy = decoy;

    this.#currentDecoyLine = new LeaderLine(this.#currentConnectionSource, this.#currentDecoy, {
      color: "#0078d7",
      endSocket: "left",
      startSocket: "right",
    });

    this.#updateDecoy(event);
  }
  finalizeConnection(columnTarget: Input) {
    if (!this.#currentConnectionSource) {
      return;
    }

    this.connect(this.#currentConnectionSource, columnTarget);
  }

  updateConnections() {
    for (const connection of this.connections) {
      connection.line.position();
    }
    for (const node of this.nodes) {
      if (node.behaviorEditor) {
        node.behaviorEditor.line?.position();
      }
    }
  }

  connect(columnSource: Output, columnTarget: Input) {
    const connection = new Connection(columnSource, columnTarget);
    columnSource.connect(connection);
    columnTarget.connect(connection);
    this.connections.add(connection);
    this.storeSnapshot();
  }
  disconnect(connection: Connection) {
    this.connections.delete(connection);
    connection.disconnect();
    connection.target.parent?.updateUi();
  }
  disconnectNode(node: Node, updateSnapshot = true) {
    for (const input of node.inputs) {
      if (input.output) {
        if (!this.connections.has(input.output)) {
          continue;
        }
        this.connections.delete(input.output);
        input.output.disconnect();
      }
    }
    for (const output of node.outputs) {
      for (const connection of output.inputs) {
        if (!this.connections.has(connection)) {
          continue;
        }
        this.connections.delete(connection);
        connection.disconnect();
      }
    }

    if (updateSnapshot) {
      this.storeSnapshot();
    }
  }

  editNodeBehavior(node: Node, event?: MouseEvent) {
    if (node.behaviorEditor) {
      node.behaviorEditor.onClickDelete(event);
      return;
    }

    const editor = document.createElement("dt-node-editor") as NodeEditor;
    this.appendChild(editor);
    editor.init();
    editor.editNodeBehavior(node);
    editor.updateUi();

    const position = Locator.forWorkarea(
      this,
      this.#scrollableContainer ?? undefined
    ).absoluteToDraggable({
      x: node.x + 250,
      y: node.y - 250,
    });

    const draggable = new PlainDraggable(editor, {
      autoScroll: true,
      handle: editor.getElementsByTagName("title")[0],
      left: position.x,
      onDragStart: (event: MouseEvent | (TouchEvent & Touch)) => {
        this.#beginSynchronizedDragOperation(node);
      },
      onMove: newPosition => {
        this.#synchronizeDragOperation(node, newPosition);
        editor.updateUi();
      },
      top: position.y,
    });
    this.#draggables.set(editor, draggable);

    editor.line = new LeaderLine(editor, mustExist(node.editElement), {
      color: "#888",
      dash: { len: 2, gap: 4 },
      endSocket: "top",
      path: "grid",
      size: 2,
    });
  }
  cancelBehaviorEditor(node: Node, event?: MouseEvent) {
    if (!node.behaviorEditor) {
      return;
    }

    node.behaviorEditor.line?.remove();

    this.removeChild(node.behaviorEditor);
    this.#draggables.delete(node.behaviorEditor);

    node.behaviorEditor = null;
    node.updateUi();
  }
  closeBehaviorEditor(node: Node, event?: MouseEvent) {
    if (!node.behaviorEditor) {
      return;
    }

    node.updateBehavior(Behavior.fromEditableScript(node.behaviorEditor.behaviorSource));

    this.cancelBehaviorEditor(node, event);
  }

  #updateDecoy(event: MouseEvent) {
    if (!isNil(this.#currentDecoy)) {
      const bounds = this.getBoundingClientRect();

      this.#currentDecoy.style.transform = `translate(${event.pageX - bounds.left}px, ${
        event.pageY - bounds.top
      }px)`;
    }
    if (!isNil(this.#currentDecoyLine)) {
      this.#currentDecoyLine.position();
    }
  }

  #clearDecoy() {
    if (!isNil(this.#currentDecoy)) {
      this.removeChild(this.#currentDecoy);
      this.#currentDecoy = null;
    }
    if (!isNil(this.#currentDecoyLine)) {
      this.#currentDecoyLine.remove();
      this.#currentDecoyLine = null;
    }
  }

  onClick(event: MouseEvent) {
    if (event.target !== this) {
      return;
    }
  }

  #panning = false;
  #panInitMouse: [number, number] = [0, 0];
  #panInitWorkarea: [number, number] = [0, 0];

  onMouseDown(event: MouseEvent) {
    // Middle mouse button.
    if (this.#scrollableContainer && event.button === 1) {
      this.#panning = true;
      this.#panInitMouse = [event.x, event.y];
      this.#panInitWorkarea = [
        this.#scrollableContainer.scrollLeft,
        this.#scrollableContainer.scrollTop,
      ];
    }
  }
  onMouseMove(event: MouseEvent) {
    if (this.#currentDecoy) {
      this.#updateDecoy(event);
    }

    if (this.#scrollableContainer && this.#panning) {
      this.#scrollableContainer.scrollLeft =
        this.#panInitWorkarea[0] + this.#panInitMouse[0] - event.x;
      this.#scrollableContainer.scrollTop =
        this.#panInitWorkarea[1] + this.#panInitMouse[1] - event.y;
    }
  }
  onMouseUp(event: MouseEvent) {
    // End connection operation.
    this.#currentConnectionSource = null;
    this.#clearDecoy();

    // End panning operation.
    this.#panning = false;

    // When the workare itself was clicked, deselect selected nodes.
    if (event.target === this) {
      for (const node of [...this.selectedNodes]) {
        node.deselect();
      }
    }
  }
  #beginSynchronizedDragOperation(dragRoot: Node) {
    this.#dragOperationSource.clear();
    this.#dragOperationSource.set(dragRoot, { x: dragRoot.x, y: dragRoot.y });
    const locator = Locator.forWorkarea(this, this.#scrollableContainer ?? undefined);
    for (const node of this.selectedNodes as Iterable<Node>) {
      this.#dragOperationSource.set(node, locator.absoluteToDraggable({ x: node.x, y: node.y }));
    }
  }
  #synchronizeDragOperation(dragRoot: Node, newPosition: NewPosition) {
    const rootDragSource = mustExist(this.#dragOperationSource.get(dragRoot));
    const deltaX = newPosition.left - rootDragSource.x;
    const deltaY = newPosition.top - rootDragSource.y;

    for (const node of this.selectedNodes as Iterable<Node>) {
      if (node === dragRoot) {
        continue;
      }

      const nodeDragSource = mustExist(this.#dragOperationSource.get(node));
      const nodeDraggable = mustExist(this.#draggables.get(node));
      const position = {
        x: nodeDragSource.x + deltaX,
        y: nodeDragSource.y + deltaY,
      };
      nodeDraggable.left = position.x;
      nodeDraggable.top = position.y;

      const positionAbsolute = Locator.forWorkarea(
        this,
        this.#scrollableContainer ?? undefined
      ).draggableToAbsolute(position);
      node.x = positionAbsolute.x;
      node.y = positionAbsolute.y;

      node.updateUi();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // intentionally left blank
  }
  onKeyUp(event: KeyboardEvent) {
    if (event.target !== document.body) {
      return;
    }

    switch (event.keyCode) {
      case 49: {
        // 1
        this.createNode("seed");
        break;
      }

      case 50: {
        // 2
        this.createNode("noop");
        break;
      }

      case 51: {
        // 3
        this.createNode("script");
        break;
      }

      case 52: {
        // 4
        this.createNode("row");
        break;
      }

      case 67:
        // x
        this.clear();
        break;

      case 82:
        // r
        this.restoreSnapshot();
        break;

      case 88:
        // e
        this.export();
        break;

      default:
        console.debug(event.keyCode);
    }
  }

  onNodeSelect(node: Node, event?: MouseEvent) {
    // intentionally left blank
  }
  onNodeDeselect(node: Node, event?: MouseEvent) {
    // intentionally left blank
  }
  onNodeResize(node: Node) {
    if (node instanceof NodeEditor) {
      node.line?.position();
    }
  }

  registerScrollableContainer(scrollable: Scrollable) {
    this.#scrollableContainer = scrollable;
  }

  createNode(type: NodeTypes, initParameters?: SerializedNode) {
    let node: Node | null = null;
    switch (type) {
      case "script": {
        node = document.createElement("dt-node-script") as NodeScript;
        this.#initNode(node, initParameters);
        break;
      }

      case "noop": {
        node = document.createElement("dt-node-noop") as NodeNoop;
        this.#initNode(node, initParameters);
        break;
      }

      case "row": {
        node = document.createElement("dt-node-row") as NodeRow;
        this.#initNode(node, initParameters);
        break;
      }

      case "seed": {
        node = document.createElement("dt-node-seed") as NodeSeed;
        this.#initNode(node, initParameters);
        break;
      }

      case "_editor":
        throw new Error("Behavior editors can not be created through this code path.");
    }
    return node;
  }

  #initNode(node: Node, initParameters?: SerializedNode) {
    this.appendChild(node);
    node.init(initParameters);
    this.nodes.push(node);

    // Place new nodes at the center of the stage.
    const containerBounds = this.#scrollableContainer
      ? {
          width: this.#scrollableContainer.clientWidth,
          height: this.#scrollableContainer.clientHeight,
        }
      : {
          width: this.clientWidth,
          height: this.clientHeight,
        };

    let position;
    if (!isNil(initParameters) && !isNil(initParameters.x) && !isNil(initParameters.y)) {
      position = Locator.forWorkarea(
        this,
        this.#scrollableContainer ?? undefined
      ).absoluteToDraggable(initParameters);
    } else {
      position = {
        x: this.offsetLeft + containerBounds.width / 2 - node.clientWidth / 2,
        y: this.offsetTop + containerBounds.height / 2 - node.clientHeight / 2,
      };
    }

    const draggable = new PlainDraggable(node, {
      autoScroll: true,
      handle: node.getElementsByTagName("title")[0],
      left: position.x,
      onDragEnd: (newPosition: NewPosition) => {
        node.updateUi(
          Locator.forWorkarea(this, this.#scrollableContainer ?? undefined).draggableToAbsolute({
            x: newPosition.left,
            y: newPosition.top,
          })
        );

        console.debug(
          `Node ${node.nodeId} moved to ${node.x}x${node.y} (movement was ${Math.round(
            newPosition.left
          )}x${Math.round(newPosition.top)}).`
        );
        this.storeSnapshot();
      },
      onDragStart: (event: MouseEvent | (TouchEvent & Touch)) => {
        /*
        if (event.ctrlKey) {
          return false;
        }
        */

        this.#beginSynchronizedDragOperation(node);
      },
      onMove: newPosition => {
        this.#synchronizeDragOperation(node, newPosition);
        mustExist(node).updateUi();
      },
      top: position.y,
    });
    this.#draggables.set(node, draggable);

    const coords = Locator.forWorkarea(
      this,
      this.#scrollableContainer ?? undefined
    ).draggableToAbsolute(position);
    node.updateUi(coords);

    console.debug(`Created node ${node.nodeId} at ${Math.round(node.x)}x${Math.round(node.y)}.`);
    this.storeSnapshot();
  }

  deleteNode(node: Node, updateSnapshot = true) {
    if (node instanceof NodeEditor) {
      this.cancelBehaviorEditor(mustExist(node.target));
      return;
    }
    if (node.behaviorEditor) {
      this.cancelBehaviorEditor(node);
    }

    this.disconnectNode(node, updateSnapshot);
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.removeChild(node);
    this.#draggables.delete(node);

    if (updateSnapshot) {
      this.storeSnapshot();
    }
  }

  deleteSelectedNodes() {
    for (const node of [...this.selectedNodes]) {
      this.deleteNode(node);
    }
  }

  clear() {
    for (const node of [...this.nodes]) {
      this.deleteNode(node, false);
    }
  }

  execute() {
    const execution = Execution.fromNodes(this.nodes);
    execution.plan();
    execution.execute();
  }

  export() {
    const serialized = this.serialize();
    const pretty = JSON.stringify(serialized, undefined, 2);
    console.debug(pretty);

    const short = JSON.stringify(serialized);
    const compressed = LZString.compressToBase64(short);

    const url = new URL(window.location.href);
    url.hash = compressed;
    console.info(url.toString());
  }
  import(compressedSnapshot: string) {
    const short = LZString.decompressFromBase64(compressedSnapshot);
    if (short === null) {
      throw new Error("Unable to decompress snapshot!");
    }
    const parsed = JSON.parse(short) as SerializedWorkarea;
    this.deserialize(parsed);
  }

  storeSnapshot() {
    const snapshot = this.serialize();
    localStorage.setItem("snapshot", JSON.stringify(snapshot));
    console.debug("Snapshot updated.");
  }
  restoreSnapshot() {
    const snapshotItem = localStorage.getItem("snapshot");
    if (snapshotItem === null) {
      return;
    }
    const snapshot = JSON.parse(snapshotItem) as SerializedWorkarea;
    this.deserialize(snapshot);
  }
  restoreSnapshotDemo() {
    this.deserialize(snapshot as SerializedWorkarea);
  }

  deserialize(workarea: SerializedWorkarea) {
    this.clear();

    const nodes = new Map<string, Node>();
    const inputs = new Map<string, Input>();
    const outputs = new Map<string, Output>();

    // Create nodes
    for (const node of workarea.nodes) {
      const createdNode = this.createNode(node.type, node);
      nodes.set(mustExist(createdNode.nodeId), createdNode);
      for (const input of createdNode.inputs) {
        inputs.set(mustExist(input.columnId), input);
      }
      for (const output of createdNode.outputs) {
        outputs.set(mustExist(output.columnId), output);
      }
    }

    // Connect nodes
    for (const node of workarea.nodes) {
      for (const output of node.outputs) {
        for (const inputId of output.inputs) {
          this.connect(mustExist(outputs.get(output.id)), mustExist(inputs.get(inputId)));
        }
      }
    }

    // Init data
    for (const node of this.nodes) {
      for (const input of node.inputs) {
        input.update();
        input.updateUi();
      }
    }

    if (!isNil(workarea.stage) && !isNil(this.#scrollableContainer)) {
      this.#scrollableContainer.scroll(workarea.stage.x, workarea.stage.y);
    }
  }

  serialize(): SerializedWorkarea {
    return {
      stage: this.#scrollableContainer
        ? { x: this.#scrollableContainer.scrollLeft, y: this.#scrollableContainer.scrollTop }
        : undefined,
      nodes: this.nodes.map(node => node.serialize()),
    };
  }
}

customElements.define("dt-workarea", Workarea);
