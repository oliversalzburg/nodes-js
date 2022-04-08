export let code = "._input_3gytg_1 {\n  border-left-width: 4px;\n  border-left-style: solid;\n}\n";
let json = {input: "_input_3gytg_1"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
