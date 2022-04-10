import { isNil } from "../Maybe";
import { Column } from "./Column";
import styles from "./Input.module.css";
import { Node } from "./Node";
import { CommandDescription } from "./Workarea";

export class Command extends Column {
  callback: (() => unknown) | null = null;

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

  init(initParameters?: Partial<CommandDescription>): void {
    super.init(initParameters);

    this.label = initParameters?.label ?? "";
    this.callback = initParameters?.callback ?? null;
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

  onMouseUp(event: MouseEvent) {
    // Always disconnect on click.
    if (!isNil(this.callback)) {
      this.callback();
    }

    this.update();
  }
}

customElements.define("dt-command", Command);
