import { mustExist } from "./Maybe";
import styles from "./Scrollable.module.css";
import { Workarea } from "./Workarea";

export class Scrollable extends HTMLElement {
  constructor() {
    super();
    this.classList.add(styles.scrollable);
    this.addEventListener("scroll",event=>this.onScroll(event));
  }

  onScroll(event:Event){
    const workarea = mustExist(this.querySelector("dt-workarea")) as Workarea;
    workarea.updateConnections();
  }
}

customElements.define("dt-scrollable", Scrollable);
