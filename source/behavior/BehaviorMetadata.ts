import { mustExist } from "../Maybe";
import { Node } from "../ui/Node";

export type InputMetadata = {
  identifier: string;
  label: string;
};
export type OutputMetadata = {
  identifier: string;
  label: string;
};

export const MatchInputMarkup = /^\/\/\/ @input (?<identifier>[^ ]+) "(?<label>[^"]+)".*$/gm;
export const MatchOutputMarkup = /^\/\/\/ @output (?<identifier>[^ ]+) "(?<label>[^"]+)".*$/gm;

export class BehaviorMetadata {
  inputs = new Array<InputMetadata>();
  outputs = new Array<OutputMetadata>();

  serialize() {
    const meta = new Array<string>();

    for (const input of this.inputs) {
      meta.push(`/// @input ${input.identifier} "${input.label}"`);
    }
    for (const output of this.outputs) {
      meta.push(`/// @output ${output.identifier} "${output.label}"`);
    }

    return meta.join("\n");
  }

  wrapExecutable(executable: string) {
    const inputsInit = this.inputs
      .map((input, index) => `const ${input.identifier} = this.inputs[${index}].value;`)
      .join("\n");
    const outputsInit = this.outputs
      .map((output, index) => `let ${output.identifier} = undefined;`)
      .join("\n");
    const outputsWrite = this.outputs
      .map((output, index) => `this.outputs[${index}].value = ${output.identifier};`)
      .join("\n");

    return `
${inputsInit}
${outputsInit}

${executable}

${outputsWrite}
    `.trim();
  }

  static generate(node: Node) {
    const meta = new BehaviorMetadata();

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
    const meta = new BehaviorMetadata();

    const inputMatches = script.matchAll(MatchInputMarkup);
    const outputMatches = script.matchAll(MatchOutputMarkup);

    for (const inputMatch of inputMatches) {
      meta.inputs.push({
        identifier: mustExist(inputMatch.groups)["identifier"],
        label: mustExist(inputMatch.groups)["label"],
      });
    }
    for (const outputMatch of outputMatches) {
      meta.outputs.push({
        identifier: mustExist(outputMatch.groups)["identifier"],
        label: mustExist(outputMatch.groups)["label"],
      });
    }

    return meta;
  }
}
