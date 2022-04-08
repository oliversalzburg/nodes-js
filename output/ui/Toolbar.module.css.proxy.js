export let code = "._toolbar_1u7av_1 {\n  display: block;\n  \n  height: 50px;\n\n  padding: 0;\n  margin: 0;\n\n  background-color: #ddd;\n  border: 1px solid #111;\n\n  z-index: 2;\n}\n\n._toolbar_1u7av_1 ._button_1u7av_15 {\n  display: inline-block;\n  height: 40px;\n\n  margin: 5px;\n  padding: 5px 10px;\n\n  background-color: #eee;\n  border: 1px solid #111;\n}\n._toolbar_1u7av_1 ._button_1u7av_15:hover {\n  background-color: #ddd;\n}\n\n._toolbar_1u7av_1 ._divider_1u7av_29 {\n  display: inline-block;\n  width: 20px;\n}\n";
let json = {toolbar: "_toolbar_1u7av_1", button: "_button_1u7av_15", divider: "_divider_1u7av_29"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
