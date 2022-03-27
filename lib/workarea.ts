import "leader-line";
import PlainDraggable from "plain-draggable";
import { Connection } from "./connection";
import { Input } from "./input";
import { Node } from "./node";
import { NodeNoop } from "./node-noop";
import { NodeSeed } from "./node-seed";
import { Output } from "./output";

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

  constructor() {
    super();

    this.addEventListener("click", event => this.onClick(event));

    document.addEventListener("keyup", event => this.onKeyUp(event));
  }

  initConnectionFrom(columnSource: Output) {
    this.#currentConnectionSource = columnSource;
  }
  finalizeConnection(columnTarget: Input) {
    if (!this.#currentConnectionSource) {
      return;
    }

    const connection = new Connection(this.#currentConnectionSource, columnTarget);
    this.#currentConnectionSource.connect(connection);
    columnTarget.connect(connection);
  }
  connect(columnSource: Output, columnTarget: Input) {
    const connection = new Connection(columnSource, columnTarget);
    columnSource.connect(connection);
    columnTarget.connect(connection);
  }

  onClick(event: MouseEvent) {
    if (event.target !== this) {
      return;
    }

    /*
    const node = document.createElement("dt-node-seed");
    node.init();
    this.appendChild(node);
    new PlainDraggable(node, { handle: node.getElementsByTagName("title")[0] });
    */
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
              id: "seed-bDsFrl",
              name: "Seed seed-bDsFrl",
              type: "seed",
              x: 172,
              y: 287.3333282470703,
              inputs: [],
              outputs: [
                {
                  id: "output-CA88XV",
                  connections: [
                    {
                      source: "output-CA88XV",
                      target: "input-tKChVd",
                    },
                  ],
                },
              ],
            },
            {
              id: "noop-ssAe4t",
              name: "Noop noop-ssAe4t",
              type: "noop",
              x: 725.3333282470703,
              y: 362.3333282470703,
              inputs: [
                {
                  id: "input-tKChVd",
                  connections: [
                    {
                      source: "output-CA88XV",
                      target: "input-tKChVd",
                    },
                  ],
                },
              ],
              outputs: [],
            },
          ],
        });

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
          onMove: newPosition => node!.updatePosition(newPosition),
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
          onMove: newPosition => node!.updatePosition(newPosition),
          top: initParameters?.y,
        });
        break;
      }
    }
    return node;
  }

  deserialize(workarea: SerializedWorkarea) {
    const nodes = new Map<string, Node>();
    const inputs = new Map<string, Input>();
    const outputs = new Map<string, Output>();
    for (const node of workarea.nodes) {
      const createdNode = this.createNode(node.type, node);
      nodes.set(createdNode.nodeId!, createdNode);
      for (const input of createdNode.inputs) {
        inputs.set(input.columnId!, input);
      }
      for (const output of createdNode.outputs) {
        outputs.set(output.columnId!, output);
      }
    }

    for (const node of workarea.nodes) {
      for (const output of node.outputs) {
        for (const connection of output.connections) {
          this.connect(outputs.get(connection.source)!, inputs.get(connection.target)!);
        }
      }
    }
  }

  serialize(): SerializedWorkarea {
    return { nodes: this.nodes.map(node => node.serialize()) };
  }
}

customElements.define("dt-workarea", Workarea);
