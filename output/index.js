export * from "./behavior/Behavior.js";
export * from "./behavior/BehaviorMetadata.js";
export * from "./ui/Column.js";
export * from "./ui/Connection.js";
export * from "./ui/Decoy.js";
export * from "./ui/Input.js";
export * from "./ui/Node.js";
export * from "./ui/NodeEditor.js";
export * from "./ui/NodeNoop.js";
export * from "./ui/NodeRow.js";
export * from "./ui/NodeScript.js";
export * from "./ui/NodeSeed.js";
export * from "./ui/Output.js";
export * from "./ui/Scrollable.js";
export * from "./ui/Toolbar.js";
export * from "./ui/Workarea.js";
window.addEventListener("load", () => {
  const href = window.location.href;
  const hashPosition = href.lastIndexOf("#");
  if (-1 < hashPosition) {
    const payload = href.substring(hashPosition + 1);
    const workarea = document.getElementById("workarea");
    workarea.import(payload);
  }
});
