import { isNil, mustExist } from "@oliversalzburg/js-utils/nil.js";
import ElapsedTime from "elapsed-time";
import { Node } from "../ui/Node.js";

/**
 * A set of nodes to be executed at a given stage.
 */
export type ExecutionStage = Set<Node>;

/**
 * Executes a workflow.
 */
export class Execution {
  /**
   * The nodes that take part in the execution.
   */
  nodes: Array<Node>;

  /**
   * The stages of the execution.
   */
  stages: Array<ExecutionStage> | null = null;

  /**
   * Constructs a new execution.
   * @param nodes - The nodes that should be executed.
   */
  constructor(nodes: Array<Node>) {
    this.nodes = nodes;
  }

  /**
   * Plans the execution.
   */
  plan(): void {
    const entry = ElapsedTime.new().start();

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

    console.log(`Execution planned in ${entry.getValue()}.`);
  }

  /**
   * Execute the execution plan.
   * @param withUpdateUi - Should we update the UI during the execution?
   */
  async execute(withUpdateUi = true): Promise<void> {
    const entry = ElapsedTime.new().start();

    if (isNil(this.stages)) {
      return;
    }

    if (withUpdateUi) {
      for (const stage of this.stages) {
        for (const node of stage) {
          await node.update();
          node.updateUi();
        }
      }
    } else {
      for (const stage of this.stages) {
        for (const node of stage) {
          await node.update();
        }
      }
    }

    console.log(`Executed in ${entry.getValue()}.`);
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

  /**
   * Constructs an execution for the given nodes.
   * @param nodes - The nodes to execute.
   * @returns The execution for the given nodes.
   */
  static fromNodes(nodes: Iterable<Node>): Execution {
    const execution = new Execution([...nodes]);
    return execution;
  }
}
