import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import "leader-line";
import LZString from "lz-string";
import PlainDraggable, { NewPosition } from "plain-draggable";
import { Behavior } from "../behavior/Behavior.js";
import { CommandMetadata, InputMetadata, OutputMetadata } from "../behavior/BehaviorMetadata.js";
import { Execution } from "../execution/Execution.js";
import { Connection } from "./Connection.js";
import { Decoy } from "./Decoy.js";
import { Input } from "./Input.js";
import { Coordinates, Locator } from "./Locator.js";
import { Node } from "./Node.js";
import stylesNode from "./Node.module.css";
import { NodeEditor } from "./NodeEditor.js";
import { NodeFile } from "./NodeFile.js";
import { NodeNoop } from "./NodeNoop.js";
import { NodeRow } from "./NodeRow.js";
import { NodeScript } from "./NodeScript.js";
import { NodeSeed } from "./NodeSeed.js";
import { Output } from "./Output.js";
import { Scrollable } from "./Scrollable.js";
import styles from "./Workarea.module.css";
import { snapshot } from "./snapshot.js";

/**
 * The diufferent node types we support
 */
export type NodeTypes = "_editor" | "file" | "noop" | "row" | "script" | "seed";

/**
 * Describes a `Command`.
 */
export type CommandDescription = CommandMetadata & {
  /**
   * The ID of the command.
   */
  id: string;
};

/**
 * An input for a `Node`.
 */
export type SerializedInput = {
  /**
   * The ID of the input.
   */
  id: string;
};

/**
 * An output of a `Node`.
 */
export type SerializedOutput = {
  /**
   * The ID of the output.
   */
  id: string;

  /**
   * The IDs of inputs that are connected to this output.
   */
  inputs: Array<string>;
};

/**
 * Describes the behavior of a `Node`.
 */
export type SerializedBehavior = {
  /**
   * The IO metadata of the behavior.
   */
  metadata: {
    inputs: Array<InputMetadata>;
    outputs: Array<OutputMetadata>;
  };

  /**
   * The behavior script itself.
   */
  script: string;
};

/**
 * Describes a `Node`.
 */
export type SerializedNode = {
  /**
   * The type of the node.
   */
  type: NodeTypes;

  /**
   * The ID of the node.
   */
  id: string;

  /**
   * The name of the node.
   */
  name: string;

  /**
   * The X-coordinate of the node.
   */
  x: number;

  /**
   * The Y-coordinate of the node.
   */
  y: number;

  /**
   * The inputs of this node.
   */
  inputs: Array<SerializedInput>;

  /**
   * The outputs of this node.
   */
  outputs: Array<SerializedOutput>;

  /**
   * The behavior of the node.
   */
  behavior?: SerializedBehavior;
};

/**
 * Describes a work area.
 */
export type SerializedWorkarea = {
  /**
   * The current center of the viewport.
   */
  stage?: { x: number; y: number };

  /**
   * The Nodes on the workarea.
   */
  nodes: Array<SerializedNode>;
};

/**
 * The work area, where we place Nodes.
 */
export class Workarea extends HTMLElement {
  /**
   * The nodes on the work area.
   */
  nodes = new Array<Node>();

  /**
   * The connections between Nodes.
   */
  connections = new Set<Connection>();

  #currentConnectionSource: Output | null = null;
  #currentDecoy: Decoy | null = null;
  #currentDecoyLine: LeaderLine | null = null;

  #draggables = new Map<Node, PlainDraggable>();
  #dragOperationSource = new Map<Node, Coordinates>();
  #openEditors = new Set<NodeEditor>();

  #scrollableContainer: Scrollable | null = null;

  /**
   * Constructs a new work area.
   */
  constructor() {
    super();
    console.debug("Workarea constructed.");
  }

  get #selectedEditors(): Iterable<NodeEditor> {
    return [...this.#openEditors].filter(node => node.selected);
  }
  /**
   * Retrieves the nodes that are currently selected.
   * @returns The nodes that are currently selected.
   */
  get selectedNodes(): Iterable<Node> {
    return this.nodes.filter(node => node.selected);
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    this.classList.add(styles.workarea);

    this.addEventListener("click", event => {
      this.onClick(event);
    });
    this.addEventListener("mousedown", event => {
      this.onMouseDown(event);
    });
    this.addEventListener("mousemove", event => {
      this.onMouseMove(event);
    });
    this.addEventListener("mouseup", event => {
      this.onMouseUp(event);
    });

    document.addEventListener("keydown", event => {
      this.onKeyDown(event).catch(redirectErrorsToConsole(console));
    });
    document.addEventListener("keyup", event => {
      this.onKeyUp(event).catch(redirectErrorsToConsole(console));
    });

    console.debug("Workarea connected.");
  }

  /**
   * Creates a new in-progress connection operation.
   * @param columnSource - The source column.
   * @param event - The mouse event that triggered the connection.
   */
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
  /**
   * Finalizes a connection between two columns.
   * @param columnTarget - The target column.
   * @returns A promise that is resolved once the connection was finalized.
   */
  async finalizeConnection(columnTarget: Input) {
    if (!this.#currentConnectionSource) {
      return;
    }

    await this.connect(this.#currentConnectionSource, columnTarget);
  }

  /**
   * Update the connection lines for all connections.
   */
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

  /**
   * Connect an output with an input.
   * @param columnSource - The source column.
   * @param columnTarget - The target column.
   */
  async connect(columnSource: Output, columnTarget: Input) {
    const connection = new Connection(columnSource, columnTarget);
    await columnSource.connect(connection);
    await columnTarget.connect(connection);
    this.connections.add(connection);
    this.storeSnapshot();
  }

  /**
   * Disconnects the given connection.
   * @param connection - The connection to disconnect.
   */
  disconnect(connection: Connection) {
    this.connections.delete(connection);
    connection.disconnect();
    connection.target.parent?.updateUi();
  }

  /**
   * Disconnects a node entirely.
   * @param node - The node to disconnect.
   * @param updateSnapshot - Should the current snapshot be updated by this?
   */
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

  /**
   * Opens the behavior editor for the given Node.
   * @param node - The Node of which to edit the behavior.
   * @param event - The mouse event that triggered the operation.
   * @returns A promise that resolves once the editor has been opened.
   */
  async editNodeBehavior(node: Node, event?: MouseEvent) {
    if (node.behaviorEditor) {
      await node.behaviorEditor.onClickDelete(event);
      return;
    }

    const editor = document.createElement("dt-node-editor") as NodeEditor;
    this.#openEditors.add(editor);
    this.appendChild(editor);
    await editor.init();
    editor.editNodeBehavior(node);
    editor.updateUi();

    editor.x = node.x + 250;
    editor.y = node.y - 250;
    const position = Locator.forWorkarea(
      this,
      this.#scrollableContainer ?? undefined,
    ).absoluteToDraggable({
      x: editor.x,
      y: editor.y,
    });

    const draggable = new PlainDraggable(editor, {
      autoScroll: true,
      handle: editor.getElementsByTagName("title")[0],
      left: position.x,
      onDragEnd: (newPosition: NewPosition) => {
        editor.updateUi(
          Locator.forWorkarea(this, this.#scrollableContainer ?? undefined).draggableToAbsolute({
            x: newPosition.left,
            y: newPosition.top,
          }),
        );
        this.#endDragOperation();
      },
      onDragStart: (_event: MouseEvent | (TouchEvent & Touch)): undefined => {
        this.#beginSynchronizedDragOperation(editor);
      },
      onMove: newPosition => {
        this.#synchronizeDragOperation(editor, newPosition);
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

  /**
   * Closes the behavior editor for a Node without saving changes.
   * @param node - The node for which to cancel the editor.
   * @param _event - The mouse event that triggered this operation.
   */
  cancelBehaviorEditor(node: Node, _event?: MouseEvent): void {
    if (!node.behaviorEditor) {
      return;
    }

    node.behaviorEditor.line?.remove();

    this.#openEditors.delete(node.behaviorEditor);
    this.removeChild(node.behaviorEditor);
    this.#draggables.delete(node.behaviorEditor);

    node.behaviorEditor = null;
    node.updateUi();
  }

  /**
   * Closes the behavior editor for a node and saves any changes.
   * @param node - The node for which to close the behavior editor.
   * @param event - The mouse event that triggered this operation.
   */
  async closeBehaviorEditor(node: Node, event?: MouseEvent): Promise<void> {
    if (!node.behaviorEditor) {
      return;
    }

    node.updateBehavior(
      await Behavior.fromEditableScript(node.behaviorEditor.behaviorSource, node.getFactory()),
    );
    await node.update();

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

  /**
   * Triggered when the component is clicked.
   * @param event - The mouse event that triggered this operation.
   */
  onClick(event: MouseEvent): void {
    if (event.target !== this) {
      return;
    }
  }

  #panning = false;
  #panInitMouse: [number, number] = [0, 0];
  #panInitWorkarea: [number, number] = [0, 0];

  /**
   * Triggered when the user presses down on a mouse button.
   * @param event - The mouse event that triggered this operation.
   */
  onMouseDown(event: MouseEvent): void {
    if (event.target !== this) {
      return;
    }

    // Left or middle mouse button.
    if (this.#scrollableContainer && (event.button === 0 || event.button === 1)) {
      this.#panning = true;
      this.#panInitMouse = [event.x, event.y];
      this.#panInitWorkarea = [
        this.#scrollableContainer.scrollLeft,
        this.#scrollableContainer.scrollTop,
      ];
    }
  }

  /**
   * Triggered when the user moves the mouse.
   * @param event - The mouse event that triggered this operation.
   */
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

  /**
   * Triggered when the user releases a mouse button.
   * @param event - The mouse event that triggered this operation.
   */
  onMouseUp(event: MouseEvent) {
    // End connection operation.
    this.#currentConnectionSource = null;
    this.#clearDecoy();

    // End panning operation.
    this.#panning = false;

    // When the workare itself was clicked, deselect selected nodes.
    if (event.target === this) {
      for (const node of [...this.selectedNodes, ...this.#selectedEditors]) {
        node.deselect();
      }
    }
  }
  #beginSynchronizedDragOperation(dragRoot: Node) {
    this.#dragOperationSource.clear();
    const locator = Locator.forWorkarea(this, this.#scrollableContainer ?? undefined);
    this.#dragOperationSource.set(
      dragRoot,
      locator.absoluteToDraggable({ x: dragRoot.x, y: dragRoot.y }),
    );
    for (const node of [...this.selectedNodes, ...this.#selectedEditors] as Iterable<Node>) {
      this.#dragOperationSource.set(node, locator.absoluteToDraggable({ x: node.x, y: node.y }));
      node.classList.add(stylesNode.dragging);
    }
  }
  #synchronizeDragOperation(dragRoot: Node, newPosition: NewPosition) {
    const rootDragSource = mustExist(this.#dragOperationSource.get(dragRoot));
    const deltaX = newPosition.left - rootDragSource.x;
    const deltaY = newPosition.top - rootDragSource.y;

    for (const node of [...this.selectedNodes, ...this.#selectedEditors] as Iterable<Node>) {
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
        this.#scrollableContainer ?? undefined,
      ).draggableToAbsolute(position);
      node.x = positionAbsolute.x;
      node.y = positionAbsolute.y;

      node.updateUi();
    }
  }
  #endDragOperation() {
    for (const node of [...this.selectedNodes, ...this.#selectedEditors] as Iterable<Node>) {
      node.classList.remove(stylesNode.dragging);
    }
  }

  /**
   * Triggered when the user presses down on a keyboard key.
   * @param _event - The keyboard event that triggered this operation.
   */
  async onKeyDown(_event: KeyboardEvent) {
    // intentionally left blank
  }

  /**
   * Triggered when the user releases a keyboard key.
   * @param event - The keyboard event that triggered this operation.
   */
  async onKeyUp(event: KeyboardEvent) {
    if (event.target !== document.body) {
      return;
    }

    switch (event.key) {
      case "1": {
        await this.createNode("seed");
        break;
      }

      case "2": {
        await this.createNode("noop");
        break;
      }

      case "3": {
        await this.createNode("script");
        break;
      }

      case "4": {
        await this.createNode("row");
        break;
      }

      case "x":
        this.clear();
        break;

      case "r":
        await this.restoreSnapshot();
        break;

      case "e":
        this.export();
        break;

      default:
        console.debug(event.key);
    }
  }

  /**
   * Triggered when a user selects a node.
   * @param _node - The node that was selected.
   * @param _event - The mouse event that triggered the operation.
   */
  onNodeSelect(_node: Node, _event?: MouseEvent) {
    // intentionally left blank
  }

  /**
   * Triggered when a user de-selects a node.
   * @param _node - The node that was de-selected.
   * @param _event - The mouse event that triggered the operation.
   */
  onNodeDeselect(_node: Node, _event?: MouseEvent) {
    // intentionally left blank
  }

  /**
   * Triggered when a user resizes a node.
   * @param node - The node that was resized.
   */
  onNodeResize(node: Node) {
    if (node instanceof NodeEditor) {
      node.line?.position();
    }
  }

  /**
   * Registers a child container as it becomes available.
   * @param scrollable - The scrollable container.
   */
  registerScrollableContainer(scrollable: Scrollable) {
    this.#scrollableContainer = scrollable;
  }

  /**
   * Constructs a new node on the work area.
   * @param type - The type of node to create.
   * @param shouldUpdateSnapshot - Should we update the snapshot after creating the node?
   * @param initParameters - The parameters for the node.
   * @returns The constructed node.
   */
  async createNode(type: NodeTypes, shouldUpdateSnapshot = true, initParameters?: SerializedNode) {
    let node: Node | null = null;
    switch (type) {
      case "script": {
        node = document.createElement("dt-node-script") as NodeScript;
        await this.#initNode(node, shouldUpdateSnapshot, initParameters);
        break;
      }

      case "file": {
        node = document.createElement("dt-node-file") as NodeFile;
        await this.#initNode(node, shouldUpdateSnapshot, initParameters);
        break;
      }

      case "noop": {
        node = document.createElement("dt-node-noop") as NodeNoop;
        await this.#initNode(node, shouldUpdateSnapshot, initParameters);
        break;
      }

      case "row": {
        node = document.createElement("dt-node-row") as NodeRow;
        await this.#initNode(node, shouldUpdateSnapshot, initParameters);
        break;
      }

      case "seed": {
        node = document.createElement("dt-node-seed") as NodeSeed;
        await this.#initNode(node, shouldUpdateSnapshot, initParameters);
        break;
      }

      case "_editor":
        throw new Error("Behavior editors can not be created through this code path.");
    }
    return node;
  }

  async #initNode(node: Node, shouldUpdateSnapshot = true, initParameters?: SerializedNode) {
    this.appendChild(node);
    await node.init(initParameters);
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
        this.#scrollableContainer ?? undefined,
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
          }),
        );
        this.#endDragOperation();

        console.debug(
          `Node ${node.nodeId} moved to ${node.x}x${node.y} (movement was ${Math.round(
            newPosition.left,
          )}x${Math.round(newPosition.top)}).`,
        );
        this.storeSnapshot();
      },
      onDragStart: (_event: MouseEvent | (TouchEvent & Touch)): undefined => {
        this.#beginSynchronizedDragOperation(node);
      },
      onMove: newPosition => {
        this.#synchronizeDragOperation(node, newPosition);
        node.updateUi();
      },
      top: position.y,
    });
    this.#draggables.set(node, draggable);

    const coords = Locator.forWorkarea(
      this,
      this.#scrollableContainer ?? undefined,
    ).draggableToAbsolute(position);
    await node.update();
    node.updateUi(coords);

    console.debug(`Created node ${node.nodeId} at ${Math.round(node.x)}x${Math.round(node.y)}.`);
    if (shouldUpdateSnapshot) {
      this.storeSnapshot();
    }
  }

  /**
   * Removes a node from the work area.
   * @param node - The node to remove.
   * @param updateSnapshot - Should the snapshot be updated after this operation?
   */
  deleteNode(node: Node, updateSnapshot = true): void {
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

  /**
   * Deletes all selected nodes.
   */
  deleteSelectedNodes() {
    for (const node of [...this.selectedNodes]) {
      this.deleteNode(node);
    }
    console.info("Selected nodes deleted.");
  }

  /**
   * Removes all nodes from the work area.
   */
  clear() {
    for (const node of [...this.nodes]) {
      this.deleteNode(node, false);
    }
    console.info("All nodes deleted.");
  }

  /**
   * Executes the current workflow.
   * @returns A promise that is resolved after the execution.
   */
  execute() {
    const execution = Execution.fromNodes(this.nodes);
    execution.plan();
    return execution.execute();
  }

  /**
   * Serialize the current work area and print it to the console.
   */
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

  /**
   * Restores the state of the workarea from a snapshot.
   * @param compressedSnapshot - The lz-string compressed snapshot.
   */
  async import(compressedSnapshot: string) {
    const short = LZString.decompressFromBase64(compressedSnapshot);
    const parsed = JSON.parse(short) as SerializedWorkarea;
    await this.deserialize(parsed);
  }

  /**
   * Store the current workarea in a snapshot in local storage.
   */
  storeSnapshot() {
    const snapshot = this.serialize();
    localStorage.setItem("snapshot", JSON.stringify(snapshot));
    console.debug("Snapshot updated.");
  }

  /**
   * Restores the state of the work area from a snapshot in local storage.
   * @returns A promise that is resolved once the snapshot was restored.
   */
  async restoreSnapshot() {
    const snapshotItem = localStorage.getItem("snapshot");
    if (snapshotItem === null) {
      return;
    }
    const snapshot = JSON.parse(snapshotItem) as SerializedWorkarea;
    await this.deserialize(snapshot);
  }

  /**
   * Restores the demo snapshot in the work area.
   */
  async restoreSnapshotDemo() {
    await this.deserialize(snapshot as SerializedWorkarea);
  }

  /**
   * Deserialize the state of the given work area into itself.
   * @param workarea - The state of the work area.
   */
  async deserialize(workarea: SerializedWorkarea) {
    this.clear();

    const nodes = new Map<string, Node>();
    const inputs = new Map<string, Input>();
    const outputs = new Map<string, Output>();

    // Create nodes
    for (const node of workarea.nodes) {
      const createdNode = await this.createNode(node.type, false, node);
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
          await this.connect(mustExist(outputs.get(output.id)), mustExist(inputs.get(inputId)));
        }
      }
    }

    // Init data
    for (const node of this.nodes) {
      await node.update();
      for (const input of node.inputs) {
        input.update();
        input.updateUi();
      }
    }

    if (!isNil(workarea.stage) && !isNil(this.#scrollableContainer)) {
      this.#scrollableContainer.scroll(workarea.stage.x, workarea.stage.y);
    }
  }

  /**
   * Serializes the work area.
   * @returns The serialized work area.
   */
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
