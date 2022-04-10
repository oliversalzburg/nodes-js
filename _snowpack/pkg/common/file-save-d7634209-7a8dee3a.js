var e = async (e2, t = [{}], a = null, i = false) => {
  Array.isArray(t) || (t = [t]), t[0].fileName = t[0].fileName || "Untitled";
  const s = [];
  if (t.forEach((t2, a2) => {
    s[a2] = {description: t2.description || "", accept: {}}, t2.mimeTypes ? (a2 === 0 && (e2.type ? t2.mimeTypes.push(e2.type) : e2.headers && e2.headers.get("content-type") && t2.mimeTypes.push(e2.headers.get("content-type"))), t2.mimeTypes.map((e3) => {
      s[a2].accept[e3] = t2.extensions || [];
    })) : e2.type && (s[a2].accept[e2.type] = t2.extensions || []);
  }), a)
    try {
      await a.getFile();
    } catch (e3) {
      if (a = null, i)
        throw e3;
    }
  const p = a || await window.showSaveFilePicker({suggestedName: t[0].fileName, id: t[0].id, startIn: t[0].startIn, types: s, excludeAcceptAllOption: t[0].excludeAcceptAllOption || false}), c = await p.createWritable();
  if ("stream" in e2) {
    const t2 = e2.stream();
    return await t2.pipeTo(c), p;
  }
  return "body" in e2 ? (await e2.body.pipeTo(c), p) : (await c.write(blob), await c.close(), p);
};
export default e;
