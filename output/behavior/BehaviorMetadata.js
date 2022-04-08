import {mustExist} from "../Maybe.js";
export const MatchTitleMarkup = /^\/\/\/ @title "(?<title>[^"]+)"$/gm;
export const MatchInputMarkup = /^\/\/\/ @input (?<identifier>[^ ]+) "(?<label>[^"]+)".*$/gm;
export const MatchOutputMarkup = /^\/\/\/ @output (?<identifier>[^ ]+) "(?<label>[^"]+)".*$/gm;
export class BehaviorMetadata {
  constructor(title = "", inputs = new Array(), outputs = new Array()) {
    this.title = title;
    this.inputs = inputs;
    this.outputs = outputs;
  }
  serialize() {
    const meta = new Array();
    meta.push(`/// @title "${this.title}"`);
    for (const input of this.inputs) {
      meta.push(`/// @input ${input.identifier} "${input.label}"`);
    }
    for (const output of this.outputs) {
      meta.push(`/// @output ${output.identifier} "${output.label}"`);
    }
    return meta.join("\n");
  }
  wrapExecutable(executable) {
    const inputsInit = this.inputs.map((input, index) => `const ${input.identifier} = this.inputs[${index}].value;`).join("\n");
    const outputsInit = this.outputs.map((output, index) => `let ${output.identifier} = undefined;`).join("\n");
    const outputsWrite = this.outputs.map((output, index) => `this.outputs[${index}].value = ${output.identifier};`).join("\n");
    return `
${inputsInit}
${outputsInit}

${executable}

${outputsWrite}
    `.trim();
  }
  static fromNode(node) {
    const meta = new BehaviorMetadata();
    meta.title = node.name;
    let inputIndex = 0;
    for (const input of node.inputs) {
      meta.inputs.push({identifier: `input${inputIndex++}`, label: input.label});
    }
    let outputIndex = 0;
    for (const output of node.outputs) {
      meta.outputs.push({identifier: `output${outputIndex++}`, label: output.label});
    }
    return meta;
  }
  static parse(script) {
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
        label: mustExist(inputMatch.groups)["label"]
      });
    }
    for (const outputMatch of outputMatches) {
      meta.outputs.push({
        identifier: mustExist(outputMatch.groups)["identifier"],
        label: mustExist(outputMatch.groups)["label"]
      });
    }
    return meta;
  }
  static stripMetadataFromBehaviorScript(behavior) {
    return behavior.replaceAll(MatchTitleMarkup, "").replaceAll(MatchInputMarkup, "").replaceAll(MatchOutputMarkup, "").trim();
  }
}
