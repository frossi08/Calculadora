"""Gera kb.json (respostas prontas do modo demonstração) a partir de topics*.py."""
import json, pathlib, importlib.util
here = pathlib.Path(__file__).parent
topics = []
for f in sorted(here.glob("topics*.py")):
    spec = importlib.util.spec_from_file_location(f.stem, f); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    topics += m.T
FIELDS = "oscpaemrix"
for t in topics:
    for f in FIELDS: assert t.get(f), (t["t"], f)
out = [{"t": t["t"], "k": t["k"], **{f: t[f].split(";") for f in FIELDS}} for t in topics]
(here.parent / "src" / "kb.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(out), "temas x", len(FIELDS), "=", len(out) * len(FIELDS), "respostas")
