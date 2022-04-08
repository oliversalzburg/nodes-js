export * from "./behavior/Behavior";
export * from "./behavior/BehaviorMetadata";
export * from "./ui/Column";
export * from "./ui/Connection";
export * from "./ui/Decoy";
export * from "./ui/Input";
export * from "./ui/Node";
export * from "./ui/NodeEditor";
export * from "./ui/NodeNoop";
export * from "./ui/NodeRow";
export * from "./ui/NodeScript";
export * from "./ui/NodeSeed";
export * from "./ui/Output";
export * from "./ui/Scrollable";
export * from "./ui/Toolbar";
export * from "./ui/Workarea";
import { Workarea } from "./ui/Workarea";

window.addEventListener("load", () => {
  const href = window.location.href;
  const hashPosition = href.lastIndexOf("#");
  if (-1 < hashPosition) {
    const payload = href.substring(hashPosition + 1);
    const workarea = document.getElementById("workarea") as Workarea;
    workarea.import(payload);
  }
});
