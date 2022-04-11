export let code = "._minimap_ixhva_1 {\n  display: inline-block;\n  width: 200px;\n  height: 200px;\n\n  position: absolute;\n  right: 30px;\n  bottom: 30px;\n\n  background-color: transparent;\n  border: 1px solid #111;\n}\n\n._minimap_ixhva_1 canvas {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  margin: 0;\n}\n";
let json = {minimap: "_minimap_ixhva_1"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
