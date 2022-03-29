import "leader-line";
import PlainDraggable from "plain-draggable";
import { Connection } from "./Connection";
import { Decoy } from "./Decoy";
import { Input } from "./Input";
import { isNil, mustExist } from "./Maybe";
import { Node } from "./Node";
import { NodeNoop } from "./NodeNoop";
import { NodeSeed } from "./NodeSeed";
import { Output } from "./Output";
import { Toolbar } from "./Toolbar";
import styles from "./Workarea.module.css";

export type NodeTypes = "noop" | "seed";

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

  #currentConnectionSource: Output | null = null;
  #currentDecoy: Decoy | null = null;
  #currentDecoyLine: LeaderLine | null = null;

  constructor() {
    super();

    this.classList.add(styles.workarea);

    this.addEventListener("click", event => this.onClick(event));
    this.addEventListener("mousemove", event => this.onMouseMove(event));
    this.addEventListener("mouseup", event => this.onMouseUp(event));

    document.addEventListener("keyup", event => this.onKeyUp(event));
  }

  registerToolbar(toolbar:Toolbar) {
    toolbar.init(this);
  }

  initConnectionFrom(columnSource: Output) {
    this.#currentConnectionSource = columnSource;

    const decoy = document.createElement("dt-decoy") as Decoy;
    decoy.init(this);
    this.appendChild(decoy);
    this.#currentDecoy = decoy;

    this.#currentDecoyLine = new LeaderLine(this.#currentConnectionSource, this.#currentDecoy);

    this.classList.add("connecting");
  }
  finalizeConnection(columnTarget: Input) {
    if (!this.#currentConnectionSource) {
      return;
    }

    this.#clearDecoy();

    this.classList.remove("connecting");

    const connection = new Connection(this.#currentConnectionSource, columnTarget);
    this.#currentConnectionSource.connect(connection);
    columnTarget.connect(connection);
  }

  connect(columnSource: Output, columnTarget: Input) {
    const connection = new Connection(columnSource, columnTarget);
    columnSource.connect(connection);
    columnTarget.connect(connection);
  }
  disconnect(node: Node) {
    for (const input of node.inputs) {
      for (const connection of input.connections) {
        connection.line.remove();
        connection.source.disconnect(connection);
      }
    }
    for (const output of node.outputs) {
      for (const connection of output.connections) {
        connection.line.remove();
        connection.target.disconnect(connection);
      }
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

  onMouseMove(event: MouseEvent) {
    if (!this.#currentDecoy || !this.#currentDecoyLine) {
      return;
    }

    const bounds = this.getBoundingClientRect();

    this.#currentDecoy.style.transform = `translate(${event.pageX}px, ${event.pageY - bounds.top}px)`;

    this.#currentDecoyLine.position();
  }
  onMouseUp(event: MouseEvent) {
    // Other mouseUp events are handled by individual components.
    this.#clearDecoy();
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

      case 73:
        // i
        this.deserialize({
          nodes: [
            {
              type: "seed",
              id: "seed-3vbS7d",
              name: "Seed seed-3vbS7d",
              x: 129,
              y: 158,
              inputs: [],
              outputs: [
                {
                  id: "output-zH80OT",
                  connections: [
                    {
                      source: "output-zH80OT",
                      target: "input-DXvtsb",
                    },
                    {
                      source: "output-zH80OT",
                      target: "input-JD0Vgi",
                    },
                  ],
                },
              ],
            },
            {
              type: "seed",
              id: "seed-81lYBT",
              name: "Seed seed-81lYBT",
              x: 150,
              y: 793,
              inputs: [],
              outputs: [
                {
                  id: "output-Riaeer",
                  connections: [
                    {
                      source: "output-Riaeer",
                      target: "input-JD0Vgi",
                    },
                    {
                      source: "output-Riaeer",
                      target: "input-DXvtsb",
                    },
                  ],
                },
              ],
            },
            {
              type: "noop",
              id: "noop-ijbNh9",
              name: "Noop noop-ijbNh9",
              x: 680,
              y: 270,
              inputs: [
                {
                  id: "input-DXvtsb",
                  connections: [
                    {
                      source: "output-zH80OT",
                      target: "input-DXvtsb",
                    },
                    {
                      source: "output-Riaeer",
                      target: "input-DXvtsb",
                    },
                  ],
                },
              ],
              outputs: [],
            },
            {
              type: "noop",
              id: "noop-D97Zz9",
              name: "Noop noop-D97Zz9",
              x: 680,
              y: 655,
              inputs: [
                {
                  id: "input-JD0Vgi",
                  connections: [
                    {
                      source: "output-Riaeer",
                      target: "input-JD0Vgi",
                    },
                    {
                      source: "output-zH80OT",
                      target: "input-JD0Vgi",
                    },
                  ],
                },
              ],
              outputs: [],
            },
          ],
        });
        break;

      case 88:
        // x
        console.log(JSON.stringify(this.serialize(), undefined, 2));
        break;

      default:
        console.debug(event.keyCode);
    }
  }

  createNode(type: NodeTypes, initParameters?: SerializedNode) {
    let node: Node | null = null;
    switch (type) {
      case "noop": {
        node = document.createElement("dt-node-noop") as NodeNoop;
        node.init(this, initParameters);
        this.appendChild(node);
        this.nodes.push(node);
        new PlainDraggable(node, {
          handle: node.getElementsByTagName("title")[0],
          left: initParameters?.x,
          onMove: newPosition => mustExist(node).updatePosition(newPosition),
          top: initParameters?.y,
        });
        break;
      }

      case "seed": {
        node = document.createElement("dt-node-seed", {}) as NodeSeed;
        node.init(this, initParameters);
        this.appendChild(node);
        this.nodes.push(node);
        new PlainDraggable(node, {
          handle: node.getElementsByTagName("title")[0],
          left: initParameters?.x,
          onMove: newPosition => mustExist(node).updatePosition(newPosition),
          top: initParameters?.y,
        });
        break;
      }
    }
    return node;
  }

  deleteNode(node: Node) {
    this.disconnect(node);
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.removeChild(node);
  }

  deserialize(workarea: SerializedWorkarea) {
    const nodes = new Map<string, Node>();
    const inputs = new Map<string, Input>();
    const outputs = new Map<string, Output>();
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
  }

  serialize(): SerializedWorkarea {
    return { nodes: this.nodes.map(node => node.serialize()) };
  }
}

customElements.define("dt-workarea", Workarea);
