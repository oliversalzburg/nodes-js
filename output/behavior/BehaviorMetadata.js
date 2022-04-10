var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _executeScriptMeta, executeScriptMeta_fn;
const _BehaviorMetadata = class {
  constructor(title = "", inputs = new Array(), outputs = new Array(), commands = new Array()) {
    this.title = title;
    this.commands = commands;
    this.inputs = inputs;
    this.outputs = outputs;
  }
  serialize() {
    return "";
  }
  static wrapExecutable(executable) {
    return `
return (async () => {
${executable}
})();
    `.trim();
  }
  static fromNode(node) {
    const meta = new _BehaviorMetadata();
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
  static async parse(script, nodeConstructor) {
    return __privateMethod(_BehaviorMetadata, _executeScriptMeta, executeScriptMeta_fn).call(_BehaviorMetadata, _BehaviorMetadata.wrapExecutable(script), nodeConstructor);
  }
  static stripMetadataFromBehaviorScript(behavior) {
    return behavior;
  }
};
export let BehaviorMetadata = _BehaviorMetadata;
_executeScriptMeta = new WeakSet();
executeScriptMeta_fn = async function(script, nodeConstructor) {
  const meta = new _BehaviorMetadata();
  const executionSink = Object.assign(new nodeConstructor(), {
    _command: (label, callback) => {
      meta.commands.push({
        identifier: `command${meta.commands.length}`,
        label,
        entrypoint: callback
      });
    },
    _input: (label) => {
      meta.inputs.push({identifier: `input${meta.inputs.length}`, label});
    },
    _output: (label) => {
      meta.outputs.push({identifier: `ouput${meta.outputs.length}`, label});
      return {
        update: Function.prototype
      };
    },
    _title: (title) => meta.title = title
  });
  const executable = new Function(script).bind(executionSink);
  try {
    await executable();
  } catch (error) {
    console.error(script, error);
  }
  return meta;
};
_executeScriptMeta.add(BehaviorMetadata);
