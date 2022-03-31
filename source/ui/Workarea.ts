import "leader-line";
import PlainDraggable, { NewPosition } from "plain-draggable";
import { Connection } from "./Connection";
import { Decoy } from "./Decoy";
import { Input } from "./Input";
import { isNil, mustExist } from "./Maybe";
import { Node } from "./Node";
import stylesNode from "./Node.module.css";
import { NodeAdd } from "./NodeAdd";
import { NodeNoop } from "./NodeNoop";
import { NodeSeed } from "./NodeSeed";
import { Output } from "./Output";
import { Scrollable } from "./Scrollable";
import styles from "./Workarea.module.css";

export type NodeTypes = "add" | "noop" | "seed";

export type SerializedConnection = {
  id: string;
  connections: Array<{ source: string; target: string }>;
};

export type SerializedNode = {
  type: NodeTypes;
  id: string;
  name: string;
  x: number;
  y: number;
  inputs: Array<SerializedConnection>;
  outputs: Array<SerializedConnection>;
};

export type SerializedWorkarea = {
  nodes: Array<SerializedNode>;
};

export class Workarea extends HTMLElement {
  nodes = new Array<Node>();
  connections = new Set<Connection>();

  #currentConnectionSource: Output | null = null;
  #currentDecoy: Decoy | null = null;
  #currentDecoyLine: LeaderLine | null = null;

  #draggables = new Map<Node, PlainDraggable>();
  #dragOperationSource = new Map<Node, [number, number]>();

  #scrollableContainer: Scrollable | null = null;

  constructor() {
    super();
    console.debug("Workarea constructed.");
  }

  connectedCallback() {
    this.classList.add(styles.workarea);

    this.addEventListener("click", event => this.onClick(event));
    this.addEventListener("mousedown", event => this.onMouseDown(event));
    this.addEventListener("mousemove", event => this.onMouseMove(event));
    this.addEventListener("mouseup", event => this.onMouseUp(event));

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
  }

  connect(columnSource: Output, columnTarget: Input) {
    const connection = new Connection(columnSource, columnTarget);
    columnSource.connect(connection);
    columnTarget.connect(connection);
    this.connections.add(connection);
  }
  disconnect(node: Node) {
    for (const input of node.inputs) {
      for (const connection of input.connections) {
        connection.disconnect();
        this.connections.delete(connection);
      }
    }
    for (const output of node.outputs) {
      for (const connection of output.connections) {
        connection.disconnect();
        this.connections.delete(connection);
      }
    }
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

    // When the workare itself was clicked, deslect selected nodes.
    if (event.target === this) {
      const selectedNodes = this.getElementsByClassName(stylesNode.selected);
      for (const node of selectedNodes as Iterable<Node>) {
        node.deselect();
      }
    }
  }
  #beginSynchronizedDragOperation(dragRoot: Node) {
    const selectedNodes = this.getElementsByClassName(stylesNode.selected);
    this.#dragOperationSource.clear();
    this.#dragOperationSource.set(dragRoot, [dragRoot.x, dragRoot.y]);
    for (const node of selectedNodes as Iterable<Node>) {
      this.#dragOperationSource.set(node, [node.x, node.y]);
    }
  }
  #synchronizeDragOperation(dragRoot: Node, newPosition: NewPosition) {
    const rootDragSource = mustExist(this.#dragOperationSource.get(dragRoot));

    const selectedNodes = this.getElementsByClassName(stylesNode.selected);
    for (const node of selectedNodes as Iterable<Node>) {
      if (node === dragRoot) {
        continue;
      }

      const nodeDragSource = mustExist(this.#dragOperationSource.get(node));
      const nodeDraggable = mustExist(this.#draggables.get(node));
      const position = [
        nodeDragSource[0] + newPosition.left - rootDragSource[0],
        nodeDragSource[1] + newPosition.top - rootDragSource[1],
      ];
      node.x = position[0];
      node.y = position[1];
      nodeDraggable.left = node.x;
      nodeDraggable.top = node.y;
      node.updateUi();
    }
  }

  onKeyUp(event: KeyboardEvent) {
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
        this.createNode("add");
        break;
      }

      case 67:
        // c
        this.clear();
        break;

      case 73:
        // i
        this.restoreSnapshot();
        break;

      case 88:
        // x
        this.export();
        break;

      default:
        console.debug(event.keyCode);
    }
  }

  registerScrollableContainer(scrollable: Scrollable) {
    this.#scrollableContainer = scrollable;
  }

  createNode(type: NodeTypes, initParameters?: SerializedNode) {
    let node: Node | null = null;
    switch (type) {
      case "add": {
        node = document.createElement("dt-node-add") as NodeAdd;
        this.#initNode(node, initParameters);
        break;
      }

      case "noop": {
        node = document.createElement("dt-node-noop") as NodeNoop;
        this.#initNode(node, initParameters);
        break;
      }

      case "seed": {
        node = document.createElement("dt-node-seed", {}) as NodeSeed;
        this.#initNode(node, initParameters);
        break;
      }
    }
    return node;
  }

  #initNode(node: Node, initParameters?: SerializedNode) {
    this.appendChild(node);
    node.init(initParameters);
    this.nodes.push(node);
    const draggable = new PlainDraggable(node, {
      autoScroll: true,
      handle: node.getElementsByTagName("title")[0],
      left: initParameters?.x,
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
        mustExist(node).updateUi(newPosition);
      },
      top: initParameters?.y,
    });
    this.#draggables.set(node, draggable);
  }

  deleteNode(node: Node) {
    this.disconnect(node);
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.removeChild(node);
    this.#draggables.delete(node);
  }

  clear() {
    for (const node of [...this.nodes]) {
      this.deleteNode(node);
    }
  }

  export() {
    console.debug(JSON.stringify(this.serialize(), undefined, 2));
  }
  restoreSnapshot() {
    this.deserialize({
      nodes: [
        {
          type: "seed",
          id: "seed-UoBoRw",
          name: "Seed seed-UoBoRw",
          x: 55,
          y: 260.3333282470703,
          inputs: [],
          outputs: [
            {
              id: "output-5Kvvfp",
              connections: [
                {
                  source: "output-5Kvvfp",
                  target: "input-0hRMNl",
                },
              ],
            },
            {
              id: "output-6pNbhj",
              connections: [
                {
                  source: "output-6pNbhj",
                  target: "input-YTHliL",
                },
              ],
            },
          ],
        },
        {
          type: "seed",
          id: "seed-V610qb",
          name: "Seed seed-V610qb",
          x: 65,
          y: 653.3333282470703,
          inputs: [],
          outputs: [
            {
              id: "output-wlBs-Q",
              connections: [],
            },
            {
              id: "output-MK3Og-",
              connections: [
                {
                  source: "output-MK3Og-",
                  target: "input-Jhgi34",
                },
              ],
            },
          ],
        },
        {
          type: "add",
          id: "add-qRGuO7",
          name: "Add add-qRGuO7",
          x: 660,
          y: 305.3333282470703,
          inputs: [
            {
              id: "input-0hRMNl",
              connections: [
                {
                  source: "output-5Kvvfp",
                  target: "input-0hRMNl",
                },
              ],
            },
            {
              id: "input-cm02VG",
              connections: [
                {
                  source: "output-L_cDzf",
                  target: "input-cm02VG",
                },
              ],
            },
          ],
          outputs: [
            {
              id: "output-YWD-Iy",
              connections: [
                {
                  source: "output-YWD-Iy",
                  target: "input-3CnnBq",
                },
              ],
            },
          ],
        },
        {
          type: "add",
          id: "add-dYjhk6",
          name: "Add add-dYjhk6",
          x: 383,
          y: 557.3333282470703,
          inputs: [
            {
              id: "input-YTHliL",
              connections: [
                {
                  source: "output-6pNbhj",
                  target: "input-YTHliL",
                },
              ],
            },
            {
              id: "input-Jhgi34",
              connections: [
                {
                  source: "output-MK3Og-",
                  target: "input-Jhgi34",
                },
              ],
            },
          ],
          outputs: [
            {
              id: "output-L_cDzf",
              connections: [
                {
                  source: "output-L_cDzf",
                  target: "input-cm02VG",
                },
              ],
            },
          ],
        },
        {
          type: "noop",
          id: "noop-eK-79L",
          name: "Noop noop-eK-79L",
          x: 950,
          y: 417.3333282470703,
          inputs: [
            {
              id: "input-3CnnBq",
              connections: [
                {
                  source: "output-YWD-Iy",
                  target: "input-3CnnBq",
                },
              ],
            },
          ],
          outputs: [],
        },
      ],
    });
  }

  deserialize(workarea: SerializedWorkarea) {
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
        for (const connection of output.connections) {
          this.connect(
            mustExist(outputs.get(connection.source)),
            mustExist(inputs.get(connection.target))
          );
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
  }

  serialize(): SerializedWorkarea {
    return { nodes: this.nodes.map(node => node.serialize()) };
  }
}

customElements.define("dt-workarea", Workarea);
