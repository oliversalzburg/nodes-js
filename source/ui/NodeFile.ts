import { fileOpen, FileWithHandle } from "browser-fs-access";
import { Behavior } from "../behavior/Behavior";
import { BehaviorMetadata } from "../behavior/BehaviorMetadata";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeFile extends Node {
  file: FileWithHandle | null = null;

  constructor() {
    super("file", "File");

    this.hasBehavior = true;
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateBehavior(
      Behavior.fromCodeFragment(
        `if(this.file !== null) {
  const fileContent = await this.file.text();
  text = fileContent.substring(0, 20);
}`,
        new BehaviorMetadata(
          "File",
          [],
          [
            { identifier: "binary", label: "Binary" },
            { identifier: "text", label: "Text" },
          ]
        )
      )
    );

    this.rebuildFromMetadata();

    const command = this.addCommand("Select", async () => {
      const file = await fileOpen();
      command.value = file.name;
      //command.updateUi();
      this.file = file;
      this.update();
    });
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-file", NodeFile);
