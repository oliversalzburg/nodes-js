import "./behavior/Behavior";
import "./behavior/BehaviorMetadata";
import "./ui/Column";
import "./ui/Connection";
import "./ui/Decoy";
import "./ui/Input";
import "./ui/Node";
import "./ui/NodeEditor";
import "./ui/NodeNoop";
import "./ui/NodeRow";
import "./ui/NodeScript";
import "./ui/NodeSeed";
import "./ui/Output";
import "./ui/Scrollable";
import "./ui/Toolbar";
import "./ui/Workarea";
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
