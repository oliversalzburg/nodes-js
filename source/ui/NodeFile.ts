import { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import { fileOpen, FileWithHandle } from "browser-fs-access";
import { Behavior } from "../behavior/Behavior.js";
import { Node } from "./Node.js";
import { SerializedNode } from "./Workarea.js";

/**
 * A Node to interact with local files.
 */
export class NodeFile extends Node {
  /**
   * A handle to the file itself.
   */
  file: FileWithHandle | null = null;

  /**
   * Constructs a new `NodeFile`.
   */
  constructor() {
    super("file", "File");

    this.hasBehavior = true;
  }

  /**
   * Retrieves the constructor for this Node.
   * @returns The constructor for this Node.
   */
  getFactory(): ConstructorOf<Node> {
    return NodeFile;
  }

  /**
   * Opens a local file.
   * @returns A promise for a file handle.
   */
  openFile() {
    return fileOpen();
  }

  /**
   * Initializes a new instance of the Node.
   * @param initParameters - The parameters for the Node.
   */
  async init(initParameters?: SerializedNode) {
    await super.init(initParameters);

    this.updateBehavior(
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
        NodeFile,
      ),
    );

    this.rebuildFromMetadata();

    this.updateUi();
  }
}

customElements.define("dt-node-file", NodeFile);
