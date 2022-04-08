import { isNil, mustExist } from "../Maybe";
import { Node } from "../ui/Node";

export type ExecutionStage = Set<Node>;

export class Execution {
  nodes: Array<Node>;

  stages: Array<ExecutionStage> | null = null;

  constructor(nodes: Array<Node>) {
    this.nodes = nodes;
  }

  plan() {
    const roots = new Set<Node>();
    for (const node of this.nodes) {
      if (node.inputs.length === 0) {
        roots.add(node);
        continue;
      }
    }
    if (roots.size === 0) {
      return;
    }

    this.stages = [roots];

    let stage = roots;
    while (0 < stage.size) {
      stage = this.#consumersToStage(stage);
      if (0 < stage.size) {
        this.stages.push(stage);
      }
    }
  }

  execute(withUpdateUi = true) {
    if (isNil(this.stages)) {
      return;
    }

    if (withUpdateUi) {
      for (const stage of this.stages) {
        for (const node of stage) {
          node.update();
          node.updateUi();
        }
      }
    } else {
      for (const stage of this.stages) {
        for (const node of stage) {
          node.update();
        }
      }
    }
  }

  #consumersToStage(roots: Iterable<Node>) {
    const consumers = new Set<Node>();
    for (const root of roots) {
      for (const output of root.outputs) {
        for (const input of output.inputs) {
          consumers.add(mustExist(input.target.parent));
        }
      }
    }
    return consumers;
  }

  static fromNodes(nodes: Iterable<Node>): Execution {
    const execution = new Execution([...nodes]);
    return execution;
  }
}
