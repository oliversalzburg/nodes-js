const e = (() => {
  if (typeof self == "undefined")
    return false;
  if ("top" in self && self !== top)
    try {
      top;
    } catch (e2) {
      return false;
    }
  else if ("showOpenFilePicker" in self)
    return "showOpenFilePicker";
  return false;
})(), t = e ? import("./common/file-open-002ab408-ab0f0a40.js") : import("./common/file-open-7c801643-3910d768.js");
async function n(...e2) {
  return (await t).default(...e2);
}
const i = e ? import("./common/directory-open-4ed118d0-505a0c36.js") : import("./common/directory-open-01563666-63e10f88.js");
const o = e ? import("./common/file-save-d7634209-7a8dee3a.js") : import("./common/file-save-c8e3403f-6fc0ccec.js");
export {n as fileOpen};
