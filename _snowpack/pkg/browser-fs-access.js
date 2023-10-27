const e = (() => {
  if (typeof self == "undefined")
    return false;
  if ("top" in self && self !== top)
    try {
      top.window.document._ = 0;
    } catch (e2) {
      return false;
    }
  return "showOpenFilePicker" in self;
})(), t = e ? Promise.resolve().then(function() {
  return l;
}) : Promise.resolve().then(function() {
  return v;
});
async function n(...e2) {
  return (await t).default(...e2);
}
const r = e ? Promise.resolve().then(function() {
  return y;
}) : Promise.resolve().then(function() {
  return b;
});
const a = e ? Promise.resolve().then(function() {
  return m;
}) : Promise.resolve().then(function() {
  return k;
});
const s = async (e2) => {
  const t2 = await e2.getFile();
  return t2.handle = e2, t2;
};
var c = async (e2 = [{}]) => {
  Array.isArray(e2) || (e2 = [e2]);
  const t2 = [];
  e2.forEach((e3, n3) => {
    t2[n3] = {description: e3.description || "Files", accept: {}}, e3.mimeTypes ? e3.mimeTypes.map((r3) => {
      t2[n3].accept[r3] = e3.extensions || [];
    }) : t2[n3].accept["*/*"] = e3.extensions || [];
  });
  const n2 = await window.showOpenFilePicker({id: e2[0].id, startIn: e2[0].startIn, types: t2, multiple: e2[0].multiple || false, excludeAcceptAllOption: e2[0].excludeAcceptAllOption || false}), r2 = await Promise.all(n2.map(s));
  return e2[0].multiple ? r2 : r2[0];
}, l = {__proto__: null, default: c};
function u(e2) {
  function t2(e3) {
    if (Object(e3) !== e3)
      return Promise.reject(new TypeError(e3 + " is not an object."));
    var t3 = e3.done;
    return Promise.resolve(e3.value).then(function(e4) {
      return {value: e4, done: t3};
    });
  }
  return u = function(e3) {
    this.s = e3, this.n = e3.next;
  }, u.prototype = {s: null, n: null, next: function() {
    return t2(this.n.apply(this.s, arguments));
  }, return: function(e3) {
    var n2 = this.s.return;
    return n2 === void 0 ? Promise.resolve({value: e3, done: true}) : t2(n2.apply(this.s, arguments));
  }, throw: function(e3) {
    var n2 = this.s.return;
    return n2 === void 0 ? Promise.reject(e3) : t2(n2.apply(this.s, arguments));
  }}, new u(e2);
}
const p = async (e2, t2, n2 = e2.name, r2) => {
  const i = [], a2 = [];
  var o, s2 = false, c2 = false;
  try {
    for (var l2, d2 = function(e3) {
      var t3, n3, r3, i2 = 2;
      for (typeof Symbol != "undefined" && (n3 = Symbol.asyncIterator, r3 = Symbol.iterator); i2--; ) {
        if (n3 && (t3 = e3[n3]) != null)
          return t3.call(e3);
        if (r3 && (t3 = e3[r3]) != null)
          return new u(t3.call(e3));
        n3 = "@@asyncIterator", r3 = "@@iterator";
      }
      throw new TypeError("Object is not async iterable");
    }(e2.values()); s2 = !(l2 = await d2.next()).done; s2 = false) {
      const o2 = l2.value, s3 = `${n2}/${o2.name}`;
      o2.kind === "file" ? a2.push(o2.getFile().then((t3) => (t3.directoryHandle = e2, t3.handle = o2, Object.defineProperty(t3, "webkitRelativePath", {configurable: true, enumerable: true, get: () => s3})))) : o2.kind !== "directory" || !t2 || r2 && r2(o2) || i.push(p(o2, t2, s3, r2));
    }
  } catch (e3) {
    c2 = true, o = e3;
  } finally {
    try {
      s2 && d2.return != null && await d2.return();
    } finally {
      if (c2)
        throw o;
    }
  }
  return [...(await Promise.all(i)).flat(), ...await Promise.all(a2)];
};
var d = async (e2 = {}) => {
  e2.recursive = e2.recursive || false, e2.mode = e2.mode || "read";
  const t2 = await window.showDirectoryPicker({id: e2.id, startIn: e2.startIn, mode: e2.mode});
  return (await (await t2.values()).next()).done ? [t2] : p(t2, e2.recursive, void 0, e2.skipDirectory);
}, y = {__proto__: null, default: d}, f = async (e2, t2 = [{}], n2 = null, r2 = false, i = null) => {
  Array.isArray(t2) || (t2 = [t2]), t2[0].fileName = t2[0].fileName || "Untitled";
  const a2 = [];
  let o = null;
  if (e2 instanceof Blob && e2.type ? o = e2.type : e2.headers && e2.headers.get("content-type") && (o = e2.headers.get("content-type")), t2.forEach((e3, t3) => {
    a2[t3] = {description: e3.description || "Files", accept: {}}, e3.mimeTypes ? (t3 === 0 && o && e3.mimeTypes.push(o), e3.mimeTypes.map((n3) => {
      a2[t3].accept[n3] = e3.extensions || [];
    })) : o ? a2[t3].accept[o] = e3.extensions || [] : a2[t3].accept["*/*"] = e3.extensions || [];
  }), n2)
    try {
      await n2.getFile();
    } catch (e3) {
      if (n2 = null, r2)
        throw e3;
    }
  const s2 = n2 || await window.showSaveFilePicker({suggestedName: t2[0].fileName, id: t2[0].id, startIn: t2[0].startIn, types: a2, excludeAcceptAllOption: t2[0].excludeAcceptAllOption || false});
  !n2 && i && i(s2);
  const c2 = await s2.createWritable();
  if ("stream" in e2) {
    const t3 = e2.stream();
    return await t3.pipeTo(c2), s2;
  }
  return "body" in e2 ? (await e2.body.pipeTo(c2), s2) : (await c2.write(await e2), await c2.close(), s2);
}, m = {__proto__: null, default: f}, w = async (e2 = [{}]) => (Array.isArray(e2) || (e2 = [e2]), new Promise((t2, n2) => {
  const r2 = document.createElement("input");
  r2.type = "file";
  const i = [...e2.map((e3) => e3.mimeTypes || []), ...e2.map((e3) => e3.extensions || [])].join();
  r2.multiple = e2[0].multiple || false, r2.accept = i || "", r2.style.display = "none", document.body.append(r2);
  const a2 = (e3) => {
    typeof o == "function" && o(), t2(e3);
  }, o = e2[0].legacySetup && e2[0].legacySetup(a2, () => o(n2), r2), s2 = () => {
    window.removeEventListener("focus", s2), r2.remove();
  };
  r2.addEventListener("click", () => {
    window.addEventListener("focus", s2);
  }), r2.addEventListener("change", () => {
    window.removeEventListener("focus", s2), r2.remove(), a2(r2.multiple ? Array.from(r2.files) : r2.files[0]);
  }), "showPicker" in HTMLInputElement.prototype ? r2.showPicker() : r2.click();
})), v = {__proto__: null, default: w}, h = async (e2 = [{}]) => (Array.isArray(e2) || (e2 = [e2]), e2[0].recursive = e2[0].recursive || false, new Promise((t2, n2) => {
  const r2 = document.createElement("input");
  r2.type = "file", r2.webkitdirectory = true;
  const i = (e3) => {
    typeof a2 == "function" && a2(), t2(e3);
  }, a2 = e2[0].legacySetup && e2[0].legacySetup(i, () => a2(n2), r2);
  r2.addEventListener("change", () => {
    let t3 = Array.from(r2.files);
    e2[0].recursive ? e2[0].recursive && e2[0].skipDirectory && (t3 = t3.filter((t4) => t4.webkitRelativePath.split("/").every((t5) => !e2[0].skipDirectory({name: t5, kind: "directory"})))) : t3 = t3.filter((e3) => e3.webkitRelativePath.split("/").length === 2), i(t3);
  }), "showPicker" in HTMLInputElement.prototype ? r2.showPicker() : r2.click();
})), b = {__proto__: null, default: h}, P = async (e2, t2 = {}) => {
  Array.isArray(t2) && (t2 = t2[0]);
  const n2 = document.createElement("a");
  let r2 = e2;
  "body" in e2 && (r2 = await async function(e3, t3) {
    const n3 = e3.getReader(), r3 = new ReadableStream({start: (e4) => async function t4() {
      return n3.read().then(({done: n4, value: r4}) => {
        if (!n4)
          return e4.enqueue(r4), t4();
        e4.close();
      });
    }()}), i2 = new Response(r3), a3 = await i2.blob();
    return n3.releaseLock(), new Blob([a3], {type: t3});
  }(e2.body, e2.headers.get("content-type"))), n2.download = t2.fileName || "Untitled", n2.href = URL.createObjectURL(await r2);
  const i = () => {
    typeof a2 == "function" && a2();
  }, a2 = t2.legacySetup && t2.legacySetup(i, () => a2(), n2);
  return n2.addEventListener("click", () => {
    setTimeout(() => URL.revokeObjectURL(n2.href), 3e4), i();
  }), n2.click(), null;
}, k = {__proto__: null, default: P};
export {n as fileOpen};
