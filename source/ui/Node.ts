import { nanoid } from "nanoid";
import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { mustExist } from "../Maybe";
import { Command } from "./Command";
import { Connection } from "./Connection";
import { Input } from "./Input";
import { Coordinates } from "./Locator";
import styles from "./Node.module.css";
import { NodeEditor } from "./NodeEditor";
import { Output } from "./Output";
import {
  CommandDescription,
  NodeTypes,
  SerializedInput,
  SerializedNode,
  SerializedOutput,
  Workarea,
} from "./Workarea";

export type CompiledBehavior = () => Promise<unknown>;

export abstract class Node extends HTMLElement {
  typeIdentifier: NodeTypes;
  nodeId: string;
  workarea: Workarea | null = null;

  behaviorEditor: NodeEditor | null = null;
  behavior: Behavior | null = null;
  behaviorCompiled: CompiledBehavior | null = null;

  name: string;
  x = 0;
  y = 0;
  protected hasBehavior = false;
  protected hasIo = true;

  #selected = false;

  #titleElement: HTMLTitleElement | null = null;
  #editElement: HTMLButtonElement | null = null;
  #deleteElement: HTMLButtonElement | null = null;

  commands = new Array<Command>();
  inputs = new Array<Input>();
  outputs = new Array<Output>();

  #inputSectionElement: HTMLDivElement | null = null;
  #outputSectionElement: HTMLDivElement | null = null;

  get selected() {
    return this.#selected;
  }
  set selected(value: boolean) {
    if (value) {
      this.select();
    } else {
      this.deselect();
    }
  }

  get titleElement(): HTMLTitleElement | null {
    return this.#titleElement;
  }
  protected set titleElement(value: HTMLTitleElement | null) {
    this.#titleElement = value;
  }

  get editElement(): HTMLButtonElement | null {
    return this.#editElement;
  }
  protected set editElement(value: HTMLButtonElement | null) {
    this.#editElement = value;
  }

  get deleteElement(): HTMLButtonElement | null {
    return this.#deleteElement;
  }
  protected set deleteElement(value: HTMLButtonElement | null) {
    this.#deleteElement = value;
  }

  constructor(typeIdentifier: NodeTypes, namePrefix: string) {
    super();

    this.typeIdentifier = typeIdentifier;
    this.nodeId = Node.makeId(typeIdentifier);
    this.name = namePrefix;
  }

  connectedCallback() {
    this.workarea = this.parentElement as Workarea;

    this.classList.add(styles.node);

    this.titleElement = document.createElement("title");
    this.titleElement.classList.add(styles.title);
    this.titleElement.textContent = this.name;
    this.titleElement.title = this.nodeId;
    this.titleElement.addEventListener("click", (event: MouseEvent) => this.onClickTitle(event));
    this.appendChild(this.titleElement);

    if (this.hasBehavior) {
      this.editElement = document.createElement("button");
      this.editElement.classList.add(styles.edit);
      this.editElement.textContent = "⬤";
      this.editElement.addEventListener("click", event => this.onClickEdit(event));
      this.appendChild(this.editElement);
    }

    this.deleteElement = document.createElement("button");
    this.deleteElement.classList.add(styles.delete);
    this.deleteElement.textContent = "✖";
    this.deleteElement.addEventListener("click", (event: MouseEvent) => this.onClickDelete(event));
    this.appendChild(this.deleteElement);

    if (this.hasIo) {
      this.#inputSectionElement = document.createElement("div");
      this.#inputSectionElement.classList.add(styles.inputSection);
      this.appendChild(this.#inputSectionElement);
      this.#outputSectionElement = document.createElement("div");
      this.#outputSectionElement.classList.add(styles.outputSection);
      this.appendChild(this.#outputSectionElement);
    }
  }

  init(initParameters?: SerializedNode): void {
    this.nodeId = initParameters?.id ?? this.nodeId;
    this.name = initParameters?.name ?? this.name;
    this.x = initParameters?.x ?? this.x;
    this.y = initParameters?.y ?? this.y;

    if (initParameters?.behavior) {
      this.updateBehavior(
        Behavior.fromCodeFragment(
          initParameters.behavior.script,
          new BehaviorMetadata(
            this.name,
            initParameters.behavior.metadata.inputs,
            initParameters.behavior.metadata.outputs
          )
        )
      );
      for (
        let inputIndex = 0;
        inputIndex < initParameters.behavior.metadata.inputs.length;
        ++inputIndex
      ) {
        this.inputs[inputIndex].label = mustExist(
          initParameters?.behavior?.metadata.inputs[inputIndex].label
        );
      }
      for (
        let outputIndex = 0;
        outputIndex < initParameters.behavior.metadata.outputs.length;
        ++outputIndex
      ) {
        this.outputs[outputIndex].label = mustExist(
          initParameters?.behavior?.metadata.outputs[outputIndex].label
        );
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

  initConnectionFrom(columnSource: Output, event: MouseEvent) {
    mustExist(this.workarea).initConnectionFrom(columnSource, event);
  }
  finalizeConnection(columnTarget: Input) {
    mustExist(this.workarea).finalizeConnection(columnTarget);
  }

  onConnect(connection: Connection) {
    this.update();
    this.updateUi();
  }
  onClickTitle(event: MouseEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (!this.#selected) {
      this.select();
    } else {
      this.deselect();
    }
  }
  onClickEdit(event: MouseEvent) {
    mustExist(this.workarea).editNodeBehavior(this, event);
  }
  onClickDelete(event?: MouseEvent) {
    mustExist(this.workarea).deleteNode(this);
  }
  select(event?: MouseEvent) {
    if (this.#selected) {
      return;
    }

    this.classList.add(styles.selected);
    this.#selected = true;
    this.workarea?.onNodeSelect(this, event);
  }
  deselect(event?: MouseEvent) {
    if (!this.#selected) {
      return;
    }

    this.classList.remove(styles.selected);
    this.#selected = false;
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
          _input: () => {
            const inputPointer = inputsRequested++;
            return this.inputs[inputPointer].value;
          },
          _output: () => {
            const outputPointer = outputsRequested++;
            const update = (value: unknown) => (this.outputs[outputPointer].value = value);
            return {
              update,
            };
          },
          _title: Function.prototype,
        });
        await this.behaviorCompiled.bind(context)();
      } catch (error) {
        console.error(
          `  Execution of ${this.nodeId} failed!`,
          this.behavior?.toExecutableBehavior(),
          error
        );
      }
    }
  }
  updateUi(newPosition?: Coordinates) {
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
    this.behaviorCompiled = new Function(script) as CompiledBehavior;
  }

  protected addCommand(initParameters?: Partial<CommandDescription>) {
    const command = document.createElement("dt-command") as Command;
    mustExist(this.#inputSectionElement).appendChild(command);
    command.init(initParameters);
    this.commands.push(command);
    return command;
  }
  protected removeCommand(command: Command) {
    mustExist(this.#inputSectionElement).removeChild(command);
    this.commands.splice(this.commands.indexOf(command), 1);
  }
  protected addInput(initParameters?: Partial<SerializedInput>) {
    const input = document.createElement("dt-input") as Input;
    mustExist(this.#inputSectionElement).appendChild(input);
    input.init(initParameters);
    this.inputs.push(input);
    return input;
  }
  protected removeInput(input: Input) {
    const workarea = mustExist(this.workarea);
    mustExist(this.#inputSectionElement).removeChild(input);
    if (input.output) {
      workarea.disconnect(input.output);
    }
    this.inputs.splice(this.inputs.indexOf(input), 1);
  }
  protected addOutput(initParameters?: Partial<SerializedOutput>) {
    const output = document.createElement("dt-output") as Output;
    mustExist(this.#outputSectionElement).appendChild(output);
    output.init(initParameters);
    this.outputs.push(output);
    return output;
  }
  protected removeOutput(output: Output) {
    const workarea = mustExist(this.workarea);
    mustExist(this.#outputSectionElement).removeChild(output);
    for (const input of output.inputs) {
      workarea.disconnect(input);
    }
    this.outputs.splice(this.outputs.indexOf(output), 1);
  }
  protected rebuildFromMetadata() {
    const behavior = mustExist(this.behavior);

    this.name = behavior.metadata.title;

    const excessCommandCount = this.commands.length - behavior.metadata.commands.length;
    const excessCommands = this.commands.splice(
      behavior.metadata.commands.length,
      excessCommandCount
    );
    for (let commandIndex = 0; commandIndex < behavior.metadata.commands.length; ++commandIndex) {
      if (this.commands.length <= commandIndex) {
        this.addCommand();
      }
      this.commands[commandIndex].init(behavior.metadata.commands[commandIndex]);
    }
    excessCommands.forEach(command => this.removeCommand(command));

    const excessInputCount = this.inputs.length - behavior.metadata.inputs.length;
    const excessInputs = this.inputs.splice(behavior.metadata.inputs.length, excessInputCount);
    for (let inputIndex = 0; inputIndex < behavior.metadata.inputs.length; ++inputIndex) {
      if (this.inputs.length <= inputIndex) {
        this.addInput();
      }
      this.inputs[inputIndex].label = behavior.metadata.inputs[inputIndex].label;
    }
    excessInputs.forEach(input => this.removeInput(input));

    const excessOutputCount = this.outputs.length - behavior.metadata.outputs.length;
    const excessOutputs = this.outputs.splice(behavior.metadata.inputs.length, excessOutputCount);
    for (let outputIndex = 0; outputIndex < behavior.metadata.outputs.length; ++outputIndex) {
      if (this.outputs.length <= outputIndex) {
        this.addOutput();
      }
      this.outputs[outputIndex].label = behavior.metadata.outputs[outputIndex].label;
    }
    excessOutputs.forEach(output => this.removeOutput(output));

    this.outputs.splice(behavior.metadata.outputs.length, excessOutputCount);
  }

  serialize(): SerializedNode {
    const serialized: SerializedNode = {
      type: this.typeIdentifier,
      id: mustExist(this.nodeId),
      name: this.name,
      x: this.x,
      y: this.y,
      inputs: this.inputs.map(input => ({
        id: mustExist(input.columnId),
        output: input.output ? mustExist(input.output.source.columnId) : null,
      })),
      outputs: this.outputs.map(output => ({
        id: mustExist(output.columnId),
        inputs: output.inputs.map(connection => mustExist(connection.target.columnId)),
      })),
    };

    if (this.behavior) {
      serialized.behavior = {
        metadata: {
          inputs: this.behavior.metadata.inputs,
          outputs: this.behavior.metadata.outputs,
        },
        script: this.behavior.toCodeFragment(),
      };
    }

    return serialized;
  }

  static makeId(type: NodeTypes | string) {
    return `${type}-${nanoid(6)}`;
  }
}
