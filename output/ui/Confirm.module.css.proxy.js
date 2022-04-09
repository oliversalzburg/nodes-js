export let code = "._dialog_6803m_1 {\n  padding: 10px;\n\n  font-family: system-ui;\n  line-height: 20px;\n}\n\n._dialog_6803m_1 ._choiceSection_6803m_8 {\n  margin: 10px 0 0 0;\n}\n\n._dialog_6803m_1 button {\n  border: 1px solid #111;\n  margin-right: 10px;\n  padding: 5px 10px;\n}\n";
let json = {dialog: "_dialog_6803m_1", choiceSection: "_choiceSection_6803m_8"};
export default json;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = "text/css";
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}
