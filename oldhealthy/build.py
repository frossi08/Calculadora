"""Monta oldhealthy/index.html a partir de src/app.html, embutindo a ilustração.

Uso: python3 build.py [saida_extra_sem_doctype.html]
"""
import base64
import pathlib
import sys

here = pathlib.Path(__file__).parent
body = (here / "src" / "app.html").read_text(encoding="utf-8")
img = base64.b64encode((here / "assets" / "vovo.webp").read_bytes()).decode()
body = body.replace("%%VOVO%%", "data:image/webp;base64," + img)
body = body.replace("%%KB%%", (here / "src" / "kb.json").read_text(encoding="utf-8").replace("</", "<\\/"))

manifest = '<link rel="manifest" href="manifest.webmanifest">\n'
doc = (
    "<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n"
    + manifest
    + "</head>\n<body>\n"
    + body
    + "\n</body>\n</html>\n"
)
(here / "index.html").write_text(doc, encoding="utf-8")
print("index.html gerado")

# Arquivo único para apresentar em qualquer computador (abre com dois cliques, sem servidor).
(here / "OldHealthy.html").write_text(doc.replace(manifest, ""), encoding="utf-8")
print("OldHealthy.html gerado")

if len(sys.argv) > 1:
    pathlib.Path(sys.argv[1]).write_text(body, encoding="utf-8")
    print("versão sem doctype gerada em", sys.argv[1])
