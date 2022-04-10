export let code = "._toolbar_18bcn_1 {\n  display: block;\n\n  height: 50px;\n\n  padding: 0;\n  margin: 0;\n\n  background-color: #ddd;\n  border: 1px solid #111;\n\n  z-index: 2;\n}\n\n._toolbar_18bcn_1 ._button_18bcn_15 {\n  display: inline-block;\n  height: 40px;\n\n  margin: 5px;\n  padding: 5px 10px;\n\n  background-color: #eee;\n  border: 1px solid #111;\n}\n._toolbar_18bcn_1 ._button_18bcn_15:hover {\n  background-color: #ddd;\n}\n._toolbar_18bcn_1 ._highlightedButton_18bcn_28 {\n  color: #eee;\n  background-color: #0078d7;\n  border: 1px solid #111;\n}\n._toolbar_18bcn_1 ._highlightedButton_18bcn_28:hover {\n  color: #0078d7;\n  border-color: #0078d7;\n}\n\n._toolbar_18bcn_1 ._divider_18bcn_38 {\n  display: inline-block;\n  width: 20px;\n}\n";
let json = {toolbar: "_toolbar_18bcn_1", button: "_button_18bcn_15", highlightedButton: "_highlightedButton_18bcn_28", divider: "_divider_18bcn_38"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
