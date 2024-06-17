import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { Command } from "../ui/Command.js";
import { Node } from "../ui/Node.js";

/**
 * Describes the metadata of a `Command`.
 */
export type CommandMetadata = {
  /**
   * The label of the command.
   */
  label: string;

  /**
   * The execution entrypoint for the command.
   * @param command - The command itself.
   * @returns A promise that is resolved when the execution completes.
   */
  entrypoint: (command: Command) => Promise<unknown>;
};

/**
 * Describes the metadata of an `Input`.
 */
export type InputMetadata = {
  /**
   * The label of the input.
   */
  label: string;
};

/**
 * Describes the metadata of an `Output`.
 */
export type OutputMetadata = {
  /**
   * The label of the output.
   */
  label: string;
};

/**
 * Metadata for a behavior.
 */
export class BehaviorMetadata {
  /**
   * The title of the behavior.
   */
  title: string;

  /**
   * The commands in the behavior.
   */
  commands: Array<CommandMetadata>;

  /**
   * The inputs of the behavior.
   */
  inputs: Array<InputMetadata>;

  /**
   * The outputs of the behavior.
   */
  outputs: Array<OutputMetadata>;

  /**
   * Constructs a new behavior metadata description.
   * @param title - Title of the behavior.
   * @param inputs - The inputs for this behavior.
   * @param outputs - The outputs for this behavior.
   * @param commands - The commands in this behavior.
   */
  constructor(
    title = "",
    inputs = new Array<InputMetadata>(),
    outputs = new Array<OutputMetadata>(),
    commands = new Array<CommandMetadata>(),
  ) {
    this.title = title;
    this.commands = commands;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  /**
   * Serializes the behavior into a string.
   * @returns The behavior as a string.
   */
  serialize() {
    return "";
  }

  /**
   * Wraps executable code in the behavior wrapper.
   * @param executable - A piece of executable JS code.
   * @returns The wrapped executable code.
   */
  static wrapExecutable(executable: string) {
    return `
return (async () => {
${executable}
})();
    `.trim();
  }

  /**
   * Contructs behavior metadata from an existing Node.
   * @param node - The node to pull the behavior from.
   * @returns The behavior metadata of the given Node.
   */
  static fromNode(node: Node) {
    const meta = new BehaviorMetadata();

    meta.title = node.name;
    for (const input of node.inputs) {
      meta.inputs.push({ label: input.label });
    }
    for (const output of node.outputs) {
      meta.outputs.push({ label: output.label });
    }

    return meta;
  }

  /**
   * Generates new behavior metadata for the given script and Node type.
   * @param script - The executable script.
   * @param nodeConstructor - The constructor of the expected container Node.
   * @returns New behavior metadata for the given script.
   */
  static async parse<TNode extends Node>(script: string, nodeConstructor: ConstructorOf<TNode>) {
    return BehaviorMetadata.#executeScriptMeta(
      BehaviorMetadata.wrapExecutable(script),
      nodeConstructor,
    );
  }

  static async #executeScriptMeta<TNode extends Node>(
    script: string,
    nodeConstructor: ConstructorOf<TNode>,
  ) {
    const meta = new BehaviorMetadata();

    const executionSink = Object.assign(new nodeConstructor(), {
      _command: (label: string, callback: (command: Command) => Promise<unknown>) => {
        meta.commands.push({
          label,
          entrypoint: callback,
        });
      },
      _input: (label: string) => {
        meta.inputs.push({ label });
      },
      _output: (label: string) => {
        meta.outputs.push({ label });
        return {
          update: Function.prototype,
        };
      },
      _title: (title: string) => (meta.title = title),
    });

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const executable = new Function(script).bind(executionSink) as () => Promise<unknown>;
    try {
      await executable();
    } catch (error) {
      console.error(script, error);
    }
    return meta;
  }

  /**
   * Strips metadata from a given behavior script.
   * @param behavior - The behavior script to remove the metadata from.
   * @returns The behavior script without metadata.
   */
  static stripMetadataFromBehaviorScript(behavior: string) {
    return behavior;
  }
}
