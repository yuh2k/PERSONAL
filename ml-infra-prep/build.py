"""Build dependency-free static site and offline/lab ZIPs."""
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent
FILES = ["index.html", "style.css", "curriculum.js", "app.js", "sw.js", "icon.svg", "manifest.webmanifest"]


def build():
    with zipfile.ZipFile(ROOT / "labs.zip", "w", zipfile.ZIP_DEFLATED) as bundle:
        for variant in ("starter", "reference"):
            for source in sorted((ROOT / "labs" / variant).glob("*.py")):
                bundle.write(source, variant + "/" + source.name)
            bundle.write(ROOT / "labs" / "test_contracts.py", variant + "/test_contracts.py")
        bundle.writestr("README.txt",
                        "Python 3 standard library only.\n"
                        "1. python3 -m unittest discover -s starter -v (expected failures until implemented)\n"
                        "2. Implement starter/batcher.py and starter/features.py without weakening tests.\n"
                        "3. python3 -m unittest discover -s reference -v (10 tests pass)\n"
                        "These are teaching exercises, not production online infrastructure.\n")
    with zipfile.ZipFile(ROOT / "offline.zip", "w", zipfile.ZIP_DEFLATED) as bundle:
        for name in FILES + ["labs.zip"]:
            if name == "index.html":
                bundle.writestr(name, (ROOT / name).read_text().replace('<html lang="zh-CN">', '<html lang="zh-CN" data-offline-bundle>'))
            else:
                bundle.write(ROOT / name, name)
        bundle.writestr("README.txt",
                        "Run: python3 -m http.server 8000 --bind 127.0.0.1\n"
                        "Open the local address printed by Python in your browser.\n"
                        "Progress is per browser/origin. Export JSON before moving.\n"
                        "External articles require Internet. All lessons and labs are included.\n")
    target = ROOT / "dist" / "site"
    target.mkdir(parents=True, exist_ok=True)
    for name in FILES + ["labs.zip", "offline.zip"]:
        shutil.copy2(ROOT / name, target / name)
    (target / ".nojekyll").touch()
    with zipfile.ZipFile(ROOT / "site-deploy.zip", "w", zipfile.ZIP_DEFLATED) as bundle:
        for source in sorted(target.iterdir()):
            if source.is_file():
                bundle.write(source, source.name)
    print("Built dist/site, site-deploy.zip, offline.zip and labs.zip; no dependencies or secrets.")


if __name__ == "__main__":
    build()
