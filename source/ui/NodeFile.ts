import { fileOpen, FileWithHandle } from "browser-fs-access";
import { Behavior } from "../behavior/Behavior";
import { ConstructorOf } from "../Mixins";
import { Node } from "./Node";
import { SerializedNode } from "./Workarea";

export class NodeFile extends Node {
  file: FileWithHandle | null = null;

  constructor() {
    super("file", "File");

    this.hasBehavior = true;
  }

  getFactory(): ConstructorOf<Node> {
    return NodeFile;
  }

  openFile() {
    return fileOpen();
  }

  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    await this.updateBehavior(
      await Behavior.fromCodeFragment(
        initParameters?.behavior?.script ??
          `this._title("File");

this._command("Pick file", async function(command) {
  const file = await this.openFile();
  command.value = file.name;
  this.file = file;
});

text = this._output("Text");

if(this.file !== null) {
  const fileContent = await this.file.text();
  text.update(fileContent);
}`,
        NodeFile
      )
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-file", NodeFile);
