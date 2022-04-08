export let code = "._output_1fphq_1 {\n  border-right-width: 4px;\n  border-right-style: solid;\n}\n";
let json = {output: "_output_1fphq_1"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
