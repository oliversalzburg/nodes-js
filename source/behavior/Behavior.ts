import { ConstructorOf } from "../Mixins";
import { Node } from "../ui/Node";
import { BehaviorMetadata } from "./BehaviorMetadata";

export class Behavior {
  #script: string;
  #metadata: BehaviorMetadata;

  get metadata() {
    return this.#metadata;
  }

  constructor(script = "", metadata = new BehaviorMetadata()) {
    this.#script = script;
    this.#metadata = metadata;
  }

  toExecutableBehavior() {
    return BehaviorMetadata.wrapExecutable(this.#script);
  }

  toEditableScript() {
    const metadata = this.#metadata.serialize();
    return (metadata !== "" ? metadata + "\n\n" : "") + this.#script;
  }
  toCodeFragment() {
    return this.#script;
  }

  static async fromEditableScript<TNode extends Node>(
    editable: string,
    nodeConstructor: ConstructorOf<TNode>,
  ) {
    const metadata = await BehaviorMetadata.parse(editable, nodeConstructor);
    const script = BehaviorMetadata.stripMetadataFromBehaviorScript(editable);
    return new Behavior(script, metadata);
  }
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
  static fromCodeFragmentForNode(executable: string, node: Node) {
    return new Behavior(executable, BehaviorMetadata.fromNode(node));
  }
}
