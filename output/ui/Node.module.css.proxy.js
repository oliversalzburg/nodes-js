export let code = "._node_b84i4_1 {\n  display: inline-block;\n  position: absolute;\n\n  min-width: 200px;\n\n  background-color: #ddd;\n  border: 1px solid #111;\n  color: #222;\n}\n\n._selected_b84i4_12 {\n  outline: 2px dashed #333;\n}\n\n._node_b84i4_1 ._title_b84i4_16 {\n  display: block;\n  height: 20px;\n  padding: 0 2px;\n\n  font-family: monospace;\n  line-height: 20px;\n}\n\n._node_b84i4_1 ._edit_b84i4_25 {\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  right: 20px;\n  width: 20px;\n  height: 20px;\n\n  border: none;\n  border-left: 1px solid #111;\n\n  font-family: monospace;\n  line-height: 20px;\n}\n\n._node_b84i4_1 ._delete_b84i4_40 {\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 20px;\n  height: 20px;\n\n  border: none;\n  border-left: 1px solid #111;\n\n  font-family: monospace;\n  line-height: 20px;\n}\n\n._node_b84i4_1 ._inputSection_b84i4_55,\n._node_b84i4_1 ._outputSection_b84i4_56 {\n  border-top: 1px solid #111;\n}\n\n._node_b84i4_1 textarea {\n  position: relative;\n  box-sizing: border-box;\n\n  width: 100%;\n  height: 100%;\n  margin: 0 0 -1px 0; /* weird 1px margin below textarea */\n  padding: 2px;\n  min-width: 300px;\n  min-height: 150px;\n  z-index: 1; /* raise above delete button */\n\n  border: none;\n  background-color: #222;\n  color: #ddd;\n}\n";
let json = {node: "_node_b84i4_1", selected: "_selected_b84i4_12", title: "_title_b84i4_16", edit: "_edit_b84i4_25", delete: "_delete_b84i4_40", inputSection: "_inputSection_b84i4_55", outputSection: "_outputSection_b84i4_56"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
