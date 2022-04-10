import { isNil, mustExist } from "../Maybe";
import { Column } from "./Column";
import styles from "./Input.module.css";
import { Node } from "./Node";
import { CommandDescription } from "./Workarea";

export class Command extends Column {
  callback: ((command: Command) => Promise<unknown>) | null = null;

  constructor() {
    super();

    this.columnId = Node.makeId("command");
    this.label = "<unlabled command>";
  }

  connectedCallback() {
    super.connectedCallback();

    this.classList.add(styles.command);

    this.addEventListener("mouseup", event => this.onMouseUp(event));
  }

  async init(initParameters?: Partial<CommandDescription>): Promise<void> {
    super.init(initParameters);

    const instruction = initParameters?.callback ?? initParameters?.code ?? null;

    this.label = initParameters?.label ?? "";
    this.callback =
      typeof instruction === "function"
        ? instruction
        : typeof instruction === "string"
        ? new Function(instruction).bind(this.parent)
        : null;
  }

  update(): void {
    this.value = undefined;
  }

  updateUi() {
    super.updateUi();
  }

  onMouseEnter(event: MouseEvent) {
    /* intentionally left blank */
  }
  onMouseLeave(event: MouseEvent) {
    /* intentionally left blank */
  }

  async onMouseUp(event: MouseEvent) {
    // Always disconnect on click.
    if (!isNil(this.callback)) {
      await this.callback(this);
    }

    await mustExist(this.parent).update();
    mustExist(this.parent).updateUi();
  }
}

customElements.define("dt-command", Command);
