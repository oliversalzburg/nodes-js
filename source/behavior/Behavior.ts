import { Node } from "../ui/Node";
import { BehaviorMetadata, MatchInputMarkup, MatchOutputMarkup } from "./BehaviorMetadata";

export class Behavior {
  #script: string;
  #metadata: BehaviorMetadata;

  constructor(script = "", metadata = new BehaviorMetadata()) {
    this.#script = script;
    this.#metadata = metadata;
  }

  toExecutableScript() {
    return this.#metadata.wrapExecutable(this.#script);
  }

  toEditableScript() {
    return this.#metadata.serialize() + "\n\n" + this.#script;
  }

  static fromEditableScript(editable: string) {
    const metadata = BehaviorMetadata.parse(editable);
    const script = Behavior.stripBehaviorMetadata(editable);
    return new Behavior(script, metadata);
  }
  static fromExecutableScript(executable: string) {
    return new Behavior(executable);
  }
  static fromExecutableNodeScript(executable: string, node: Node) {
    return new Behavior(executable, BehaviorMetadata.generate(node));
  }

  static annotateWithMetadata(behavior: string, node: Node) {
    const metadata = BehaviorMetadata.generate(node);
    return metadata.serialize() + "\n\n" + behavior;
  }

  static stripBehaviorMetadata(behavior: string) {
    return behavior.replaceAll(MatchInputMarkup, "").replaceAll(MatchOutputMarkup, "").trim();
  }
}
