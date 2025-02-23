import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { Column } from "./Column.js";
import styles from "./Input.module.css";
import { Node } from "./Node.js";
import { CommandDescription } from "./Workarea.js";

/**
 * A command is a column that hosts a function.
 */
export class Command extends Column {
  /**
   * The function of this command.
   */
  entrypoint: ((command: Command) => Promise<unknown>) | null = null;

  /**
   * Constructs a new command.
   */
  constructor() {
    super();

    this.columnId = Node.makeId("command");
    this.label = "<unlabled command>";
  }

  /**
   * Invoked when the DOM element is connected.
   */
  connectedCallback() {
    super.connectedCallback();

    this.classList.add(styles.command);

    this.addEventListener("mouseup", event => {
      this.onMouseUp(event).catch(redirectErrorsToConsole(console));
    });
  }

  /**
   * Initialize the command from a command description.
   * @param initParameters - The command description.
   */
  init(initParameters?: Partial<CommandDescription>) {
    super.init(initParameters);

    this.label = initParameters?.label ?? "";
    this.entrypoint = initParameters?.entrypoint ?? null;
  }

  /**
   * Update the command.
   */
  update(): void {
    this.value = undefined;
  }

  /**
   * Update the UI of the command.
   */
  updateUi() {
    super.updateUi();
  }

  /**
   * Invoked when the mouse cursor enters the bounds of the column.
   * @param _event - The mouse event that triggered the operation.
   */
  onMouseEnter(_event: MouseEvent) {
    /* intentionally left blank */
  }
  /**
   * Invoked when the mouse cursor leaves the bounds of the column.
   * @param _event - The mouse event that triggered the operation.
   */
  onMouseLeave(_event: MouseEvent) {
    /* intentionally left blank */
  }

  /**
   * Triggered when the user releases a mouse button.
   * @param _event - The mouse event that triggered the operation.
   */
  async onMouseUp(_event: MouseEvent) {
    // Always disconnect on click.
    if (!isNil(this.entrypoint)) {
      await this.entrypoint.bind(this.parent)(this);
    }

    await mustExist(this.parent).update();
    mustExist(this.parent).updateUi();
  }
}

customElements.define("dt-command", Command);
