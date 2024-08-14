import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { nanoid } from "nanoid";
import { Behavior } from "../behavior/Behavior.js";
import { Command } from "./Command.js";
import { Connection } from "./Connection.js";
import { Input } from "./Input.js";
import { Coordinates } from "./Locator.js";
import styles from "./Node.module.css";
import { NodeEditor } from "./NodeEditor.js";
import { Output } from "./Output.js";
import {
  CommandDescription,
  NodeTypes,
  SerializedInput,
  SerializedNode,
  SerializedOutput,
  Workarea,
} from "./Workarea.js";

/**
 * Describes a compiled behavior, which is a simple async function.
 */
export type CompiledBehavior = () => Promise<unknown>;

/**
 * Base class for all nodes.
 */
export abstract class Node extends HTMLElement {
  /**
   * The type of node this is.
   */
  typeIdentifier: NodeTypes;

  /**
   * The ID of the node.
   */
  nodeId: string;

  /**
   * The workarea this node appears in.
   */
  workarea: Workarea | null = null;

  /**
   * The current instance of the behavior editor for this node.
   */
  behaviorEditor: NodeEditor | null = null;

  /**
   * The behavior of this node.
   */
  behavior: Behavior | null = null;

  /**
   * The compiled behavior of this node.
   */
  behaviorCompiled: CompiledBehavior | null = null;

  /**
   * The name of this node.
   */
  name: string;

  /**
   * The X-coordinate of this node.
   */
  x = 0;

  /**
   * The Y-coordinate of this node.
   */
  y = 0;

  protected hasBehavior = false;
  protected hasIo = true;

  #selected = false;

  #titleElement: HTMLTitleElement | null = null;
  #editElement: HTMLButtonElement | null = null;
  #deleteElement: HTMLButtonElement | null = null;

  /**
   * The commands of this node.
   */
  commands = new Array<Command>();

  /**
   * The inputs of this node.
   */
  inputs = new Array<Input>();

  /**
   * The outputs of this node.
   */
  outputs = new Array<Output>();

  #inputSectionElement: HTMLDivElement | null = null;
  #outputSectionElement: HTMLDivElement | null = null;

  abstract getFactory(): ConstructorOf<Node>;

  /**
   * Is this node currently selected?
   * @returns `true` if the node is selected; `false` otherwise.
   */
  get selected() {
    return this.#selected;
  }

  /**
   * Select or deselect this node.
   */
  set selected(value: boolean) {
    if (value) {
      this.select();
    } else {
      this.deselect();
    }
  }

  /**
   * Retrieve the DOM element that serves as this node's title.
   * @returns The DOM element that serves as this node's title.
   */
  get titleElement(): HTMLTitleElement | null {
    return this.#titleElement;
  }
  protected set titleElement(value: HTMLTitleElement | null) {
    this.#titleElement = value;
  }

  /**
   * Retrieve the DOM element that serves as this node's edit button.
   * @returns The DOM element that serves as this node's edit button.
   */
  get editElement(): HTMLButtonElement | null {
    return this.#editElement;
  }
  protected set editElement(value: HTMLButtonElement | null) {
    this.#editElement = value;
  }

  /**
   * Retrieve the DOM element that serves as this node's delete button.
   * @returns The DOM element that serves as this node's delete button.
   */
  get deleteElement(): HTMLButtonElement | null {
    return this.#deleteElement;
  }
  protected set deleteElement(value: HTMLButtonElement | null) {
    this.#deleteElement = value;
  }

  /**
   * Constructs a new node.
   * @param typeIdentifier - The type of this node.
   * @param namePrefix - A prefix for the node's name.
   */
  constructor(typeIdentifier: NodeTypes, namePrefix: string) {
    super();

    this.typeIdentifier = typeIdentifier;
    this.nodeId = Node.makeId(typeIdentifier);
    this.name = namePrefix;
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    this.workarea = this.parentElement as Workarea;

    this.classList.add(styles.node);

    this.titleElement = document.createElement("title");
    this.titleElement.classList.add(styles.title);
    this.titleElement.textContent = this.name;
    this.titleElement.title = this.nodeId;
    this.titleElement.addEventListener("click", (event: MouseEvent) => {
      this.onClickTitle(event);
    });
    this.appendChild(this.titleElement);

    if (this.hasBehavior) {
      this.editElement = document.createElement("button");
      this.editElement.classList.add(styles.edit);
      this.editElement.textContent = "⬤";
      this.editElement.addEventListener("click", event => {
        this.onClickEdit(event).catch(redirectErrorsToConsole(console));
      });
      this.appendChild(this.editElement);
    }

    this.deleteElement = document.createElement("button");
    this.deleteElement.classList.add(styles.delete);
    this.deleteElement.textContent = "✖";
    this.deleteElement.addEventListener("click", (event: MouseEvent) => {
      void this.onClickDelete(event);
    });
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

  /**
   * Initializes a new instance of the Node.
   * @param initParameters - The parameters for the Node.
   */
  async init(initParameters?: SerializedNode) {
    this.nodeId = initParameters?.id ?? this.nodeId;
    this.name = initParameters?.name ?? this.name;
    this.x = initParameters?.x ?? this.x;
    this.y = initParameters?.y ?? this.y;

    if (initParameters?.behavior) {
      this.updateBehavior(
        await Behavior.fromCodeFragment(initParameters.behavior.script, this.getFactory()),
      );
      for (
        let inputIndex = 0;
        inputIndex < initParameters.behavior.metadata.inputs.length;
        ++inputIndex
      ) {
        this.inputs[inputIndex].label = mustExist(
          initParameters.behavior.metadata.inputs[inputIndex].label,
        );
      }
      for (
        let outputIndex = 0;
        outputIndex < initParameters.behavior.metadata.outputs.length;
        ++outputIndex
      ) {
        this.outputs[outputIndex].label = mustExist(
          initParameters.behavior.metadata.outputs[outputIndex].label,
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

  /**
   * Creates a new in-progress connection operation.
   * @param columnSource - The source column.
   * @param event - The mouse event that triggered the connection.
   */
  initConnectionFrom(columnSource: Output, event: MouseEvent) {
    mustExist(this.workarea).initConnectionFrom(columnSource, event);
  }
  /**
   * Finalizes a connection between two columns.
   * @param columnTarget - The target column.
   * @returns A promise that is resolved once the connection was finalized.
   */
  finalizeConnection(columnTarget: Input) {
    return mustExist(this.workarea).finalizeConnection(columnTarget);
  }

  /**
   * Invoked when this node was connected to another node.
   * @param _connection - The connection that was created.
   */
  async onConnect(_connection: Connection) {
    await this.update();
    this.updateUi();
  }

  /**
   * Invoked when the user clicks the title of the node.
   * @param event - The mouse event that triggered the operation.
   */
  onClickTitle(event: MouseEvent): void {
    if (!event.ctrlKey) {
      return;
    }

    if (!this.#selected) {
      this.select();
    } else {
      this.deselect();
    }
  }
  /**
   * Invoked when the user clicks the edit button of the node.
   * @param event - The mouse event that triggered the operation.
   */
  async onClickEdit(event: MouseEvent) {
    await mustExist(this.workarea).editNodeBehavior(this, event);
  }
  /**
   * Invoked when the user clicks the delete button of the node.
   * @param _event - The mouse event that triggered the operation.
   * @returns Nothing
   */
  onClickDelete(_event?: MouseEvent): Promise<void> {
    mustExist(this.workarea).deleteNode(this);
    return Promise.resolve();
  }

  /**
   * Select this node.
   * @param event - The mouse event that triggered the operation.
   */
  select(event?: MouseEvent): void {
    if (this.#selected) {
      return;
    }

    this.classList.add(styles.selected);
    this.#selected = true;
    this.workarea?.onNodeSelect(this, event);
  }
  /**
   * De-select this node.
   * @param event - The mouse event that triggered the operation.
   */
  deselect(event?: MouseEvent) {
    if (!this.#selected) {
      return;
    }

    this.classList.remove(styles.selected);
    this.#selected = false;
    this.workarea?.onNodeDeselect(this, event);
  }

  /**
   * Update this node.
   */
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
          error,
        );
      }
    }
  }

  /**
   * Update the UI of the node.
   * @param newPosition - The new position for the node.
   */
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

  /**
   * Updates the behavior of the node.
   * @param behavior - The new behavior.
   */
  updateBehavior(behavior = this.behavior): void {
    this.behavior = behavior;
    if (this.behavior === null) {
      this.behaviorCompiled = null;
      return;
    }

    const script = this.behavior.toExecutableBehavior();
    this.rebuildFromMetadata();
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
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
      excessCommandCount,
    );
    for (let commandIndex = 0; commandIndex < behavior.metadata.commands.length; ++commandIndex) {
      if (this.commands.length <= commandIndex) {
        this.addCommand();
      }
      this.commands[commandIndex].init(behavior.metadata.commands[commandIndex]);
    }
    excessCommands.forEach(command => {
      this.removeCommand(command);
    });

    const excessInputCount = this.inputs.length - behavior.metadata.inputs.length;
    const excessInputs = this.inputs.splice(behavior.metadata.inputs.length, excessInputCount);
    for (let inputIndex = 0; inputIndex < behavior.metadata.inputs.length; ++inputIndex) {
      if (this.inputs.length <= inputIndex) {
        this.addInput();
      }
      this.inputs[inputIndex].label = behavior.metadata.inputs[inputIndex].label;
    }
    excessInputs.forEach(input => {
      this.removeInput(input);
    });

    const excessOutputCount = this.outputs.length - behavior.metadata.outputs.length;
    const excessOutputs = this.outputs.splice(behavior.metadata.inputs.length, excessOutputCount);
    for (let outputIndex = 0; outputIndex < behavior.metadata.outputs.length; ++outputIndex) {
      if (this.outputs.length <= outputIndex) {
        this.addOutput();
      }
      this.outputs[outputIndex].label = behavior.metadata.outputs[outputIndex].label;
    }
    excessOutputs.forEach(output => {
      this.removeOutput(output);
    });

    this.outputs.splice(behavior.metadata.outputs.length, excessOutputCount);
  }

  /**
   * Serialize the node.
   * @returns The serialized node.
   */
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

  /**
   * Generates a unique ID for a node.
   * @param type - The type of the node to generate the ID for.
   * @returns The generated ID.
   */
  static makeId(type: string) {
    return `${type}-${nanoid(6)}`;
  }
}
