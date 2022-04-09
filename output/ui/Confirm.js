var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _addCancel, _a, addCancel_fn, _addNo, addNo_fn, _addYes, addYes_fn;
const _Confirm = (_a = class {
  static yesNo(question, parent = document.body) {
    return new Promise((resolve, reject) => {
      const dialog = document.createElement("dialog");
      const label = document.createElement("div");
      label.textContent = question;
      dialog.appendChild(label);
      const choiceSection = document.createElement("div");
      dialog.appendChild(choiceSection);
      __privateMethod(_Confirm, _addYes, addYes_fn).call(_Confirm, parent, dialog, choiceSection, resolve);
      __privateMethod(_Confirm, _addNo, addNo_fn).call(_Confirm, parent, dialog, choiceSection, resolve);
      parent.appendChild(dialog);
      dialog.showModal();
    });
  }
  static yesNoCancel(question, parent = document.body) {
    return new Promise((resolve, reject) => {
      const dialog = document.createElement("dialog");
      const label = document.createElement("div");
      label.textContent = question;
      dialog.appendChild(label);
      const choiceSection = document.createElement("div");
      dialog.appendChild(choiceSection);
      __privateMethod(_Confirm, _addYes, addYes_fn).call(_Confirm, parent, dialog, choiceSection, resolve);
      __privateMethod(_Confirm, _addNo, addNo_fn).call(_Confirm, parent, dialog, choiceSection, resolve);
      __privateMethod(_Confirm, _addCancel, addCancel_fn).call(_Confirm, parent, dialog, choiceSection, resolve);
      parent.appendChild(dialog);
      dialog.showModal();
    });
  }
}, _addCancel = new WeakSet(), addCancel_fn = function(parent, dialog, section, resolve) {
  const button = document.createElement("button");
  button.textContent = "Cancel";
  button.addEventListener("click", () => {
    dialog.close();
    parent.removeChild(dialog);
    resolve(_Confirm.CANCEL);
  });
  section.appendChild(button);
}, _addNo = new WeakSet(), addNo_fn = function(parent, dialog, section, resolve) {
  const button = document.createElement("button");
  button.textContent = "No";
  button.addEventListener("click", () => {
    dialog.close();
    parent.removeChild(dialog);
    resolve(_Confirm.NO);
  });
  section.appendChild(button);
}, _addYes = new WeakSet(), addYes_fn = function(parent, dialog, section, resolve) {
  const button = document.createElement("button");
  button.textContent = "Yes";
  button.addEventListener("click", () => {
    dialog.close();
    parent.removeChild(dialog);
    resolve(_Confirm.YES);
  });
  section.appendChild(button);
}, _addCancel.add(_a), _addNo.add(_a), _addYes.add(_a), _a);
export let Confirm = _Confirm;
Confirm.CANCEL = "cancel";
Confirm.NO = "no";
Confirm.YES = "yes";
