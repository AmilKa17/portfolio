from pathlib import Path
import re

p = Path("src/data/content.ts")
t = p.read_text(encoding="utf-8")
helper = (
    "const assetPath = (path: string) =>\n"
    "  `${import.meta.env.BASE_URL}${path.replace(/^\\//, '')}`\n\n"
)
if "assetPath" not in t:
    marker = "/** Videos only once"
    if marker not in t:
        raise SystemExit("marker missing")
    t = t.replace(marker, helper + marker)

def repl(m: re.Match[str]) -> str:
    path = m.group(1)
    return f"assetPath('{path}')"

t2 = re.sub(r"'/(shots/[^']+)'", repl, t)
p.write_text(t2, encoding="utf-8")
print("ok", sum(1 for _ in re.finditer(r"assetPath\(", t2)))
