var e = async (e2, t = [{}], a = null, i = false, n = null) => {
  Array.isArray(t) || (t = [t]), t[0].fileName = t[0].fileName || "Untitled";
  const s = [];
  let c = null;
  if (e2 instanceof Blob && e2.type ? c = e2.type : e2.headers && e2.headers.get("content-type") && (c = e2.headers.get("content-type")), t.forEach((e3, t2) => {
    s[t2] = {description: e3.description || "", accept: {}}, e3.mimeTypes ? (t2 === 0 && c && e3.mimeTypes.push(c), e3.mimeTypes.map((a2) => {
      s[t2].accept[a2] = e3.extensions || [];
    })) : c && (s[t2].accept[c] = e3.extensions || []);
  }), a)
    try {
      await a.getFile();
    } catch (e3) {
      if (a = null, i)
        throw e3;
    }
  const l = a || await window.showSaveFilePicker({suggestedName: t[0].fileName, id: t[0].id, startIn: t[0].startIn, types: s, excludeAcceptAllOption: t[0].excludeAcceptAllOption || false});
  !a && n && n();
  const r = await l.createWritable();
  if ("stream" in e2) {
    const t2 = e2.stream();
    return await t2.pipeTo(r), l;
  }
  return "body" in e2 ? (await e2.body.pipeTo(r), l) : (await r.write(blob), await r.close(), l);
};
export default e;
