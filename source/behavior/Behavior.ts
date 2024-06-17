import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { Node } from "../ui/Node.js";
import { BehaviorMetadata } from "./BehaviorMetadata.js";

/**
 * Defines the behavior of a node.
 */
export class Behavior {
  #script: string;
  #metadata: BehaviorMetadata;

  /**
   * Retrieve the metadata for the behavior.
   * @returns The metadata for the behavior.
   */
  get metadata() {
    return this.#metadata;
  }

  /**
   * Constructs a new behavior.
   * @param script - The script that defines the behavior.
   * @param metadata - The metadata of the behavior.
   */
  constructor(script = "", metadata = new BehaviorMetadata()) {
    this.#script = script;
    this.#metadata = metadata;
  }

  /**
   * Returns the code of this behavior as an executable code snippet.
   * @returns The executable behavior code.
   */
  toExecutableBehavior() {
    return BehaviorMetadata.wrapExecutable(this.#script);
  }

  /**
   * Turns the behavior into a fully editable script, which reflects the behavior.
   * @returns The editable behavior script.
   */
  toEditableScript() {
    const metadata = this.#metadata.serialize();
    return (metadata !== "" ? metadata + "\n\n" : "") + this.#script;
  }
  /**
   * Returns the script of the behavior.
   * @returns The script of the behavior.
   */
  toCodeFragment() {
    return this.#script;
  }

  /**
   * Constructs a new behavior from the given script.
   * @param editable - An editable behavior script.
   * @param nodeConstructor - The node constructor to use for the behavior.
   * @returns A new behavior based on the given script.
   */
  static async fromEditableScript<TNode extends Node>(
    editable: string,
    nodeConstructor: ConstructorOf<TNode>,
  ) {
    const metadata = await BehaviorMetadata.parse(editable, nodeConstructor);
    const script = BehaviorMetadata.stripMetadataFromBehaviorScript(editable);
    return new Behavior(script, metadata);
  }
  /**
   * Constructs a new behavior from the given script.
   * @param executable - An executable behavior script.
   * @param nodeConstructor - The node constructor to use for the behavior.
   * @param metadata - The metadata for the behavior.
   * @returns A new behavior based on the given script.
   */
  static async fromCodeFragment<TNode extends Node>(
    executable: string,
    nodeConstructor: ConstructorOf<TNode>,
    metadata?: BehaviorMetadata,
  ) {
    return new Behavior(
      executable,
      metadata ?? (await BehaviorMetadata.parse(executable, nodeConstructor)),
    );
  }
  /**
   * Constructs a new behavior with the given script.
   * @param executable - The executable script.
   * @param node - The node for which this should be the behavior.
   * @returns The new behavior.
   */
  static fromCodeFragmentForNode(executable: string, node: Node) {
    return new Behavior(executable, BehaviorMetadata.fromNode(node));
  }
}
