export let code = "._workarea_mvzr4_1 {\n  display: block;\n  position: relative;\n  \n  width: 10000px;\n  height: 10000px;\n\n  background-color: #eee;\n\n  z-index:0;\n}\n";
let json = {workarea: "_workarea_mvzr4_1"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
