"""Check exact official source links; distinguish network blocks from bad pages."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import re
import subprocess
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def check(source):
    result = {"title": source["title"], "url": source["url"]}
    try:
        request = urllib.request.Request(source["url"], headers={"User-Agent": "MLInfraStudyLinkCheck/1.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            text = response.read(65536).decode("utf-8", "replace")
            title = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
            result.update(status="verified", http=response.status, final_url=response.url,
                          page_title=re.sub(r"\s+", " ", title.group(1)).strip() if title else None)
    except urllib.error.HTTPError as error:
        result.update(status="http_error", http=error.code)
    except urllib.error.URLError as error:
        result.update(status="network_blocked" if "403" in str(error.reason) else "network_error",
                      reason=str(error.reason))
    except (TimeoutError, OSError) as error:
        result.update(status="network_error", reason=type(error).__name__)
    return result


def main():
    script = "const fs=require('fs'),vm=require('vm');process.stdout.write(vm.runInNewContext(fs.readFileSync('curriculum.js','utf8')+';JSON.stringify(SOURCES)'))"
    sources = json.loads(subprocess.check_output(["node", "-e", script], cwd=ROOT))
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, sources))
    target = ROOT / "test-results"
    target.mkdir(exist_ok=True)
    (target / "link-report.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
    for row in results:
        print(row["status"], row.get("http", ""), row["url"])
    print("Verified:", sum(r["status"] == "verified" for r in results), "/", len(results))


if __name__ == "__main__":
    main()
