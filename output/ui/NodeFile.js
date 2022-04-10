import {fileOpen} from "../../_snowpack/pkg/browser-fs-access.js";
import {Behavior} from "../behavior/Behavior.js";
import {Node} from "./Node.js";
export class NodeFile extends Node {
  constructor() {
    super("file", "File");
    this.file = null;
    this.hasBehavior = true;
  }
  getFactory() {
    return NodeFile;
  }
  openFile() {
    return fileOpen();
  }
  async init(initParameters) {
    await super.init(initParameters);
    await this.updateBehavior(await Behavior.fromCodeFragment(initParameters?.behavior?.script ?? `this._title("File");

this._command("Pick file", async function(command) {
  const file = await this.openFile();
  command.value = file.name;
  this.file = file;
});

text = this._output("Text");

if(this.file !== null) {
  const fileContent = await this.file.text();
  text.update(fileContent);
}`, NodeFile));
    this.rebuildFromMetadata();
    this.updateUi();
  }
}
customElements.define("dt-node-file", NodeFile);
