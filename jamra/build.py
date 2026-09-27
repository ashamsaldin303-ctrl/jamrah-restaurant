import base64, re, os

SRC = "jamra/src"
OUT = "jamra/index.html"

def b64(path, mime):
    with open(path, "rb") as f:
        return f"data:{mime};base64,{base64.b64encode(f.read()).decode()}"

html  = open(f"{SRC}/index.html", encoding="utf-8").read()
css   = open(f"{SRC}/styles.css", encoding="utf-8").read()
fonts = open(f"{SRC}/fonts/fonts.css", encoding="utf-8").read()
js    = open(f"{SRC}/script.js", encoding="utf-8").read()

missing = []
def img_repl(m):
    q, src = m.group(1), m.group(2)
    if src.startswith(("data:", "http")):
        return m.group(0)
    ext = src.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "webp", "gif"):
        return m.group(0)
    p = os.path.join(SRC, src)
    if not os.path.exists(p):
        missing.append(src)
        return m.group(0)
    mime = "image/jpeg" if ext in ("jpg", "jpeg") else f"image/{ext}"
    return f"src={q}{b64(p, mime)}{q}"

html = re.sub(r'src=(["\'])(.*?)\1', img_repl, html)
html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{fonts}\n\n{css}\n</style>")
html = html.replace('<script src="script.js" defer></script>', f"<script>\n{js}\n</script>")

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

print("bundle written:", OUT, os.path.getsize(OUT) // 1024, "KB")
if missing: print("MISSING assets:", missing)
