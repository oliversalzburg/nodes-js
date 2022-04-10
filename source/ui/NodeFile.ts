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
  text = fileContent;
}`,
        new BehaviorMetadata(
          "File",
          [],
          [
            { identifier: "binary", label: "Binary" },
            { identifier: "text", label: "Text" },
          ],
          [
            {
              identifier: "selectFile",
              label: "Pick file",
              code: `return (async(command = arguments[0])=>{
  const file = await this.openFile();
  command.value = file.name;
  this.file = file;
})();`,
            },
          ]
        )
      )
    );

    this.rebuildFromMetadata();

    /*
    const command = this.addCommand({
      label: "Pick file",
      callback: async () => {
        const file = await fileOpen();
        command.value = file.name;
        this.file = file;
        await this.update();
        this.updateUi();
      },
    });
    */
  }

  openFile() {
    return fileOpen();
  }

  init(initParameters?: SerializedNode) {
    super.init(initParameters);

    this.updateUi();
  }
}

customElements.define("dt-node-file", NodeFile);
