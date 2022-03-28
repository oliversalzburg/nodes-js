import { mustExist } from "./Maybe";
import "./Column";
import "./Connection";
import "./Input";
import "./Node";
import "./NodeNoop";
import "./NodeSeed";
import "./Output";
import "./Toolbar";
import "./Workarea";
import { Workarea } from "./Workarea";

const workarea = mustExist(document.getElementById("workarea")) as Workarea;
workarea.init();
