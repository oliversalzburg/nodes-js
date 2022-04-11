var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _selected, _titleElement, _editElement, _deleteElement, _inputSectionElement, _outputSectionElement;
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import {Behavior} from "../behavior/Behavior.js";
import {mustExist} from "../Maybe.js";
import styles from "./Node.module.css.proxy.js";
const _Node = class extends HTMLElement {
  constructor(typeIdentifier, namePrefix) {
    super();
    _selected.set(this, void 0);
    _titleElement.set(this, void 0);
    _editElement.set(this, void 0);
    _deleteElement.set(this, void 0);
    _inputSectionElement.set(this, void 0);
    _outputSectionElement.set(this, void 0);
    this.workarea = null;
    this.behaviorEditor = null;
    this.behavior = null;
    this.behaviorCompiled = null;
    this.x = 0;
    this.y = 0;
    this.hasBehavior = false;
    this.hasIo = true;
    __privateSet(this, _selected, false);
    __privateSet(this, _titleElement, null);
    __privateSet(this, _editElement, null);
    __privateSet(this, _deleteElement, null);
    this.commands = new Array();
    this.inputs = new Array();
    this.outputs = new Array();
    __privateSet(this, _inputSectionElement, null);
    __privateSet(this, _outputSectionElement, null);
    this.typeIdentifier = typeIdentifier;
    this.nodeId = _Node.makeId(typeIdentifier);
    this.name = namePrefix;
  }
  get selected() {
    return __privateGet(this, _selected);
  }
  set selected(value) {
    if (value) {
      this.select();
    } else {
      this.deselect();
    }
  }
  get titleElement() {
    return __privateGet(this, _titleElement);
  }
  set titleElement(value) {
    __privateSet(this, _titleElement, value);
  }
  get editElement() {
    return __privateGet(this, _editElement);
  }
  set editElement(value) {
    __privateSet(this, _editElement, value);
  }
  get deleteElement() {
    return __privateGet(this, _deleteElement);
  }
  set deleteElement(value) {
    __privateSet(this, _deleteElement, value);
  }
  connectedCallback() {
    this.workarea = this.parentElement;
    this.classList.add(styles.node);
    this.titleElement = document.createElement("title");
    this.titleElement.classList.add(styles.title);
    this.titleElement.textContent = this.name;
    this.titleElement.title = this.nodeId;
    this.titleElement.addEventListener("click", (event) => this.onClickTitle(event));
    this.appendChild(this.titleElement);
    if (this.hasBehavior) {
      this.editElement = document.createElement("button");
      this.editElement.classList.add(styles.edit);
      this.editElement.textContent = "⬤";
      this.editElement.addEventListener("click", (event) => {
        this.onClickEdit(event).catch(console.error);
      });
      this.appendChild(this.editElement);
    }
    this.deleteElement = document.createElement("button");
    this.deleteElement.classList.add(styles.delete);
    this.deleteElement.textContent = "✖";
    this.deleteElement.addEventListener("click", (event) => this.onClickDelete(event));
    this.appendChild(this.deleteElement);
    if (this.hasIo) {
      __privateSet(this, _inputSectionElement, document.createElement("div"));
      __privateGet(this, _inputSectionElement).classList.add(styles.inputSection);
      this.appendChild(__privateGet(this, _inputSectionElement));
      __privateSet(this, _outputSectionElement, document.createElement("div"));
      __privateGet(this, _outputSectionElement).classList.add(styles.outputSection);
      this.appendChild(__privateGet(this, _outputSectionElement));
    }
  }
  async init(initParameters) {
    this.nodeId = initParameters?.id ?? this.nodeId;
    this.name = initParameters?.name ?? this.name;
    this.x = initParameters?.x ?? this.x;
    this.y = initParameters?.y ?? this.y;
    if (initParameters?.behavior) {
      this.updateBehavior(await Behavior.fromCodeFragment(initParameters.behavior.script, this.getFactory()));
      for (let inputIndex = 0; inputIndex < initParameters.behavior.metadata.inputs.length; ++inputIndex) {
        this.inputs[inputIndex].label = mustExist(initParameters?.behavior?.metadata.inputs[inputIndex].label);
      }
      for (let outputIndex = 0; outputIndex < initParameters.behavior.metadata.outputs.length; ++outputIndex) {
        this.outputs[outputIndex].label = mustExist(initParameters?.behavior?.metadata.outputs[outputIndex].label);
      }
    }
    if (initParameters) {
      for (let inputIndex = 0; inputIndex < initParameters.inputs.length; ++inputIndex) {
        this.inputs[inputIndex].init(initParameters.inputs[inputIndex]);
      }
      for (let outputIndex = 0; outputIndex < initParameters.outputs.length; ++outputIndex) {
        this.outputs[outputIndex].init(initParameters.outputs[outputIndex]);
      }
    }
  }
  initConnectionFrom(columnSource, event) {
    mustExist(this.workarea).initConnectionFrom(columnSource, event);
  }
  finalizeConnection(columnTarget) {
    return mustExist(this.workarea).finalizeConnection(columnTarget);
  }
  async onConnect(connection) {
    await this.update();
    this.updateUi();
  }
  onClickTitle(event) {
    if (!event.ctrlKey) {
      return;
    }
    if (!__privateGet(this, _selected)) {
      this.select();
    } else {
      this.deselect();
    }
  }
  async onClickEdit(event) {
    await mustExist(this.workarea).editNodeBehavior(this, event);
  }
  onClickDelete(event) {
    mustExist(this.workarea).deleteNode(this);
  }
  select(event) {
    if (__privateGet(this, _selected)) {
      return;
    }
    this.classList.add(styles.selected);
    __privateSet(this, _selected, true);
    this.workarea?.onNodeSelect(this, event);
  }
  deselect(event) {
    if (!__privateGet(this, _selected)) {
      return;
    }
    this.classList.remove(styles.selected);
    __privateSet(this, _selected, false);
    this.workarea?.onNodeDeselect(this, event);
  }
  async update() {
    console.debug(`Updating ${this.nodeId}...`);
    for (const input of this.inputs) {
      input.update();
    }
    if (this.behaviorCompiled) {
      console.debug("  Executing compiled behavior...");
      try {
        let inputsRequested = 0;
        let outputsRequested = 0;
        const context = Object.assign({}, this, {
          _command: Function.prototype,
          _input: () => {
            const inputPointer = inputsRequested++;
            return this.inputs[inputPointer].value;
          },
          _output: () => {
            const outputPointer = outputsRequested++;
            const update = (value) => this.outputs[outputPointer].value = value;
            return {
              update
            };
          },
          _title: Function.prototype
        });
        await this.behaviorCompiled.bind(context)();
      } catch (error) {
        console.error(`  Execution of ${this.nodeId} failed!`, this.behavior?.toExecutableBehavior(), error);
      }
    }
  }
  updateUi(newPosition) {
    mustExist(this.titleElement).textContent = this.name;
    mustExist(this.titleElement).title = this.nodeId;
    this.x = newPosition?.x ?? this.x;
    this.y = newPosition?.y ?? this.y;
    for (const command of this.commands) {
      command.updateUi();
    }
    for (const input of this.inputs) {
      input.updateUi();
    }
    for (const output of this.outputs) {
      output.updateUi();
    }
    if (this.behaviorEditor) {
      this.behaviorEditor.updateUi();
    }
  }
  updateBehavior(behavior = this.behavior) {
    this.behavior = behavior;
    if (this.behavior === null) {
      this.behaviorCompiled = null;
      return;
    }
    const script = this.behavior.toExecutableBehavior();
    this.rebuildFromMetadata();
    this.behaviorCompiled = new Function(script);
  }
  addCommand(initParameters) {
    const command = document.createElement("dt-command");
    mustExist(__privateGet(this, _inputSectionElement)).appendChild(command);
    command.init(initParameters);
    this.commands.push(command);
    return command;
  }
  removeCommand(command) {
    mustExist(__privateGet(this, _inputSectionElement)).removeChild(command);
    this.commands.splice(this.commands.indexOf(command), 1);
  }
  addInput(initParameters) {
    const input = document.createElement("dt-input");
    mustExist(__privateGet(this, _inputSectionElement)).appendChild(input);
    input.init(initParameters);
    this.inputs.push(input);
    return input;
  }
  removeInput(input) {
    const workarea = mustExist(this.workarea);
    mustExist(__privateGet(this, _inputSectionElement)).removeChild(input);
    if (input.output) {
      workarea.disconnect(input.output);
    }
    this.inputs.splice(this.inputs.indexOf(input), 1);
  }
  addOutput(initParameters) {
    const output = document.createElement("dt-output");
    mustExist(__privateGet(this, _outputSectionElement)).appendChild(output);
    output.init(initParameters);
    this.outputs.push(output);
    return output;
  }
  removeOutput(output) {
    const workarea = mustExist(this.workarea);
    mustExist(__privateGet(this, _outputSectionElement)).removeChild(output);
    for (const input of output.inputs) {
      workarea.disconnect(input);
    }
    this.outputs.splice(this.outputs.indexOf(output), 1);
  }
  rebuildFromMetadata() {
    const behavior = mustExist(this.behavior);
    this.name = behavior.metadata.title;
    const excessCommandCount = this.commands.length - behavior.metadata.commands.length;
    const excessCommands = this.commands.splice(behavior.metadata.commands.length, excessCommandCount);
    for (let commandIndex = 0; commandIndex < behavior.metadata.commands.length; ++commandIndex) {
      if (this.commands.length <= commandIndex) {
        this.addCommand();
      }
      this.commands[commandIndex].init(behavior.metadata.commands[commandIndex]);
    }
    excessCommands.forEach((command) => this.removeCommand(command));
    const excessInputCount = this.inputs.length - behavior.metadata.inputs.length;
    const excessInputs = this.inputs.splice(behavior.metadata.inputs.length, excessInputCount);
    for (let inputIndex = 0; inputIndex < behavior.metadata.inputs.length; ++inputIndex) {
      if (this.inputs.length <= inputIndex) {
        this.addInput();
      }
      this.inputs[inputIndex].label = behavior.metadata.inputs[inputIndex].label;
    }
    excessInputs.forEach((input) => this.removeInput(input));
    const excessOutputCount = this.outputs.length - behavior.metadata.outputs.length;
    const excessOutputs = this.outputs.splice(behavior.metadata.inputs.length, excessOutputCount);
    for (let outputIndex = 0; outputIndex < behavior.metadata.outputs.length; ++outputIndex) {
      if (this.outputs.length <= outputIndex) {
        this.addOutput();
      }
      this.outputs[outputIndex].label = behavior.metadata.outputs[outputIndex].label;
    }
    excessOutputs.forEach((output) => this.removeOutput(output));
    this.outputs.splice(behavior.metadata.outputs.length, excessOutputCount);
  }
  serialize() {
    const serialized = {
      type: this.typeIdentifier,
      id: mustExist(this.nodeId),
      name: this.name,
      x: this.x,
      y: this.y,
      inputs: this.inputs.map((input) => ({
        id: mustExist(input.columnId),
        output: input.output ? mustExist(input.output.source.columnId) : null
      })),
      outputs: this.outputs.map((output) => ({
        id: mustExist(output.columnId),
        inputs: output.inputs.map((connection) => mustExist(connection.target.columnId))
      }))
    };
    if (this.behavior) {
      serialized.behavior = {
        metadata: {
          inputs: this.behavior.metadata.inputs,
          outputs: this.behavior.metadata.outputs
        },
        script: this.behavior.toCodeFragment()
      };
    }
    return serialized;
  }
  static makeId(type) {
    return `${type}-${nanoid(6)}`;
  }
};
export let Node = _Node;
_selected = new WeakMap();
_titleElement = new WeakMap();
_editElement = new WeakMap();
_deleteElement = new WeakMap();
_inputSectionElement = new WeakMap();
_outputSectionElement = new WeakMap();
