export let code = "._scrollable_1a6b5_1 {\n  display: block;\n  height: 100%;\n\n  overflow: scroll;\n}\n";
let json = {scrollable: "_scrollable_1a6b5_1"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
