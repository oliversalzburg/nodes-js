import { ConstructorOf } from "../Mixins";
import { Command } from "../ui/Command";
import { Node } from "../ui/Node";

export type CommandMetadata = {
  identifier: string;
  label: string;
  entrypoint: (command: Command) => Promise<unknown>;
};
export type InputMetadata = {
  identifier: string;
  label: string;
};
export type OutputMetadata = {
  identifier: string;
  label: string;
};

export class BehaviorMetadata {
  title: string;
  commands: Array<CommandMetadata>;
  inputs: Array<InputMetadata>;
  outputs: Array<OutputMetadata>;

  constructor(
    title = "",
    inputs = new Array<InputMetadata>(),
    outputs = new Array<OutputMetadata>(),
    commands = new Array<CommandMetadata>()
  ) {
    this.title = title;
    this.commands = commands;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  serialize() {
    return "";
  }

  static wrapExecutable(executable: string) {
    return `
return (async () => {
${executable}
})();
    `.trim();
  }

  static fromNode(node: Node) {
    const meta = new BehaviorMetadata();

    meta.title = node.name;
    let inputIndex = 0;
    for (const input of node.inputs) {
      meta.inputs.push({ identifier: `input${inputIndex++}`, label: input.label });
    }
    let outputIndex = 0;
    for (const output of node.outputs) {
      meta.outputs.push({ identifier: `output${outputIndex++}`, label: output.label });
    }

    return meta;
  }

  static async parse<TNode extends Node>(script: string, nodeConstructor: ConstructorOf<TNode>) {
    return BehaviorMetadata.#executeScriptMeta(
      BehaviorMetadata.wrapExecutable(script),
      nodeConstructor
    );
  }

  static async #executeScriptMeta<TNode extends Node>(
    script: string,
    nodeConstructor: ConstructorOf<TNode>
  ) {
    const meta = new BehaviorMetadata();

    const executionSink = Object.assign(new nodeConstructor(), {
      _command: (label: string, callback: (command: Command) => Promise<unknown>) => {
        meta.commands.push({
          identifier: `command${meta.commands.length}`,
          label,
          entrypoint: callback,
        });
      },
      _input: (label: string) => {
        meta.inputs.push({ identifier: `input${meta.inputs.length}`, label });
      },
      _output: (label: string) => {
        meta.outputs.push({ identifier: `ouput${meta.outputs.length}`, label });
        return {
          update: Function.prototype,
        };
      },
      _title: (title: string) => (meta.title = title),
    });

    const executable = new Function(script).bind(executionSink);
    try {
      await executable();
    } catch (error) {
      console.error(script, error);
    }
    return meta;
  }

  static stripMetadataFromBehaviorScript(behavior: string) {
    return behavior;
  }
}
