export let code = "._column_dkpfu_1 {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  user-select: none;\n\n  min-height: 16px;\n  padding: 1px;\n\n  background-color: #ccc;\n  border-color: #888;\n\n  font-family: system-ui;\n  font-size: 14px;\n}\n._column_dkpfu_1:hover {\n  background-color: #bbb;\n}\n\n._column_dkpfu_1 label {\n  color: #111;\n}\n\n._column_dkpfu_1 ._value_dkpfu_24 {\n  color: #888;\n  font-family: monospace;\n}\n\n._column_dkpfu_1._connected_dkpfu_29 {\n  border-color: #111;\n}\n._column_dkpfu_1._connected_dkpfu_29 ._value_dkpfu_24 {\n  color: #111;\n}\n";
let json = {column: "_column_dkpfu_1", value: "_value_dkpfu_24", connected: "_connected_dkpfu_29"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
