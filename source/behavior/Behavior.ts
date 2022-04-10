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
    return this.#metadata.wrapExecutable(this.#script);
  }

  toEditableScript() {
    const metadata = this.#metadata.serialize();
    return (metadata !== "" ? metadata + "\n\n" : "") + this.#script;
  }
  toCodeFragment() {
    return this.#script;
  }

  static fromEditableScript(editable: string) {
    const metadata = BehaviorMetadata.parse(editable);
    const script = BehaviorMetadata.stripMetadataFromBehaviorScript(editable);
    return new Behavior(script, metadata);
  }
  static fromCodeFragment(executable: string, metadata?: BehaviorMetadata) {
    return new Behavior(executable, metadata ?? BehaviorMetadata.parse(executable));
  }
  static fromCodeFragmentForNode(executable: string, node: Node) {
    return new Behavior(executable, BehaviorMetadata.fromNode(node));
  }
}
