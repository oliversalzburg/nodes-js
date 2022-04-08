export let code = "._decoy_199pg_1 {\n  display: inline-block;\n  position: absolute;\n\n  width: 1px;\n  height: 1px;\n\n  pointer-events: none;\n\n  background-color: transparent;\n}\n";
let json = {decoy: "_decoy_199pg_1"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
