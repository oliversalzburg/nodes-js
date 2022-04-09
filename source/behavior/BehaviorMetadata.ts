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

export const MatchTitleMarkup = /^\/\/ @title\nconst title = "(?<title>[^"]+)";$/gm;
export const MatchInputMarkup =
  /^\/\/ @input "(?<label>[^"]+)"\nconst (?<identifier>[^ ]+) = .+;$/gm;
export const MatchOutputMarkup =
  /^\/\/ @output "(?<label>[^"]+)"\nlet (?<identifier>[^ ]+) = .+;$/gm;

export class BehaviorMetadata {
  title: string;
  inputs: Array<InputMetadata>;
  outputs: Array<OutputMetadata>;

  constructor(
    title = "",
    inputs = new Array<InputMetadata>(),
    outputs = new Array<OutputMetadata>()
  ) {
    this.title = title;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  serialize() {
    const meta = new Array<string>();

    meta.push("// @title");
    meta.push(`const title = "${this.title}";`);
    meta.push("");

    let inputIndex = 0;
    for (const input of this.inputs) {
      meta.push(`// @input "${input.label}"`);
      meta.push(`const ${input.identifier} = this.inputs[${inputIndex++}].value;`);
    }
    if (0 < inputIndex) {
      meta.push("");
    }

    for (const output of this.outputs) {
      meta.push(`// @output "${output.label}"`);
      meta.push(`let ${output.identifier} = undefined;`);
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
return (async () => {
${inputsInit}
${outputsInit}
${executable}

${outputsWrite}
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
    const meta = new BehaviorMetadata();

    const titleMatches = script.matchAll(MatchTitleMarkup);
    for (const titleMatch of titleMatches) {
      meta.title = mustExist(titleMatch.groups)["title"];
    }

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

  static stripMetadataFromBehaviorScript(behavior: string) {
    return behavior
      .replaceAll(MatchTitleMarkup, "")
      .replaceAll(MatchInputMarkup, "")
      .replaceAll(MatchOutputMarkup, "")
      .trim();
  }
}
