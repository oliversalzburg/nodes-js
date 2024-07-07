export * from "./behavior/Behavior.js";
export * from "./behavior/BehaviorMetadata.js";
export * from "./ui/Column.js";
export * from "./ui/Command.js";
export * from "./ui/Connection.js";
export * from "./ui/Decoy.js";
export * from "./ui/Input.js";
export * from "./ui/MiniMap.js";
export * from "./ui/Node.js";
export * from "./ui/NodeEditor.js";
export * from "./ui/NodeFile.js";
export * from "./ui/NodeNoop.js";
export * from "./ui/NodeRow.js";
export * from "./ui/NodeScript.js";
export * from "./ui/NodeSeed.js";
export * from "./ui/Output.js";
export * from "./ui/Scrollable.js";
export * from "./ui/Toolbar.js";
export * from "./ui/Workarea.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { Workarea } from "./ui/Workarea.js";

window.addEventListener("load", () => {
  const url = new URL(window.location.href);
  if (url.hash) {
    const payload = url.hash.substring(1);
    const workarea = document.getElementById("workarea") as Workarea;
    workarea.import(payload).catch(redirectErrorsToConsole(console));
  }
});
