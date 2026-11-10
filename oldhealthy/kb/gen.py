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
# Temas que podem ser combinados em pares ("tenho X e Y"): 45 temas -> 990 pares x 10 tipos = 9.900 respostas
COMBO = {"pressão alta","pressão baixa","diabetes","colesterol alto","insuficiência cardíaca","arritmia","varizes e circulação","anemia","asma e bronquite","refluxo e azia","prisão de ventre","osteoporose","artrose","artrite e gota","dor nas costas","câimbras","fibromialgia","dor de cabeça","tontura e labirintite","Parkinson","Alzheimer e memória","neuropatia e formigamento","insônia","ronco e apneia","depressão","ansiedade","solidão","estresse","catarata","glaucoma","audição","saúde bucal","pele seca e coceira","obesidade","perda de peso sem querer","desidratação","doença renal","próstata","incontinência urinária","hipotireoidismo e tireoide","menopausa","fígado gorduroso","quedas","gripe","infecção urinária"}
assert COMBO <= {t["t"] for t in topics}
out = [{"t": t["t"], "k": t["k"], "c2": int(t["t"] in COMBO), **{f: t[f].split(";") for f in FIELDS}} for t in topics]
(here.parent / "src" / "kb.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
n = len(COMBO); pares = n * (n - 1) // 2
print(len(out) * 10, "respostas individuais +", pares * 10, "combinadas =", len(out) * 10 + pares * 10)
