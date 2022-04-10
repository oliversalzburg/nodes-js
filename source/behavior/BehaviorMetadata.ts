import { Node } from "../ui/Node";
import { NodeSeed } from "../ui/NodeSeed";

export type CommandMetadata = {
  identifier: string;
  label: string;
  code: string;
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
    const meta = new Array<string>();

    for (const command of this.commands) {
      meta.push(`// @command ${command.identifier} "${command.label}"`);
      meta.push(`${command.code}`);
    }

    return meta.join("\n");
  }

  wrapExecutable(executable: string) {
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

  static parse(script: string) {
    return this.#executeScriptMeta(script);
  }

  static #executeScriptMeta(script: string) {
    const meta = new BehaviorMetadata();

    const executionSink = Object.assign(new NodeSeed(), {
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
    executable();
    return meta;
  }

  static stripMetadataFromBehaviorScript(behavior: string) {
    return behavior;
  }
}
