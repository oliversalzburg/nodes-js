import { Node } from "../ui/Node";
import { BehaviorMetadata, MatchInputMarkup, MatchOutputMarkup } from "./BehaviorMetadata";

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
    return this.#metadata.serialize() + "\n\n" + this.#script;
  }
  toExecutableScript() {
    return this.#script;
  }

  static fromEditableScript(editable: string) {
    const metadata = BehaviorMetadata.parse(editable);
    const script = Behavior.stripMetadataFromEditable(editable);
    return new Behavior(script, metadata);
  }
  static fromExecutableScript(executable: string, metadata?: BehaviorMetadata) {
    return new Behavior(executable, metadata);
  }
  static fromExecutableNodeScript(executable: string, node: Node) {
    return new Behavior(executable, BehaviorMetadata.fromNode(node));
  }

  static stripMetadataFromEditable(behavior: string) {
    return behavior.replaceAll(MatchInputMarkup, "").replaceAll(MatchOutputMarkup, "").trim();
  }
}
