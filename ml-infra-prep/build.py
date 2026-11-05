"""Build dependency-free static site and offline/lab ZIPs."""
from pathlib import Path
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent
FILES = ["index.html", "style.css", "curriculum.js", "app.js", "interviews.js", "interview-guides.js", "interview-ui.js", "interview.css", "research-audit.json", "RESEARCH.md", "sw.js", "icon.svg", "manifest.webmanifest"]


def read_data(filename, variable):
    text = (ROOT / filename).read_text()
    prefix = "'use strict';\nconst " + variable + " = "
    if not text.startswith(prefix) or not text.endswith(";\n"):
        raise ValueError(filename + " must contain one JSON-backed constant")
    return json.loads(text[len(prefix):-2])


def build_playbook():
    """Keep the downloadable answer book identical to the website's data."""
    sources = read_data("interviews.js", "INTERVIEW_RESEARCH")
    guides = read_data("interview-guides.js", "INTERVIEW_GUIDES")
    assert set(guides) == {source["id"] for source in sources["entries"]}
    followups = sum(len(guide["followups"]) for guide in guides.values())
    out = ["# DoorDash ML Infra · 中文题意、解析与参考答案", "",
           f"{len(guides)} 个完整专题 · {followups} 个逐题解答的追问 · 每题含计算示例、架构与动手验收。", "",
           "来源边界：目前 0 条已核验候选人专项面经。6 份官方技术资料已读，17 条文章仅核验了索引。以下面试题、答案和架构均为自编演练；索引衍生内容不是未读原文的摘要，也不代表 DoorDash 实际出题。", "",
           "网页入口：面经资料库 → 打开完整解析。建议先口述，再读答案；用验收条件检查产出。所有容量、时间线与样本数字都是练习假设。", ""]
    def section(title, paragraphs):
        out.extend(["### " + title, ""])
        for paragraph in paragraphs:
            out.extend([paragraph, ""])
    for source in sources["entries"]:
        guide = guides[source["id"]]
        out.extend(["## " + guide["title"], "", guide["basis"], "",
                    f"资料：[{source['title']}]({source['url']}) · [本次可见证据]({source['evidenceUrl']})", "",
                    source["caveat"], ""])
        section("中文题意与背景", guide["paraphrase"] + ["演练题：" + guide["prompt"]])
        section("先澄清", guide["clarify"])
        section("先修概念", [x["term"] + "：" + x["explanation"] for x in guide["concepts"]])
        section("考点拆解", guide["tests"])
        section("60–90 秒参考回答", [guide["shortAnswer"]])
        section("完整答案与取舍", ["**" + x["title"] + "**\n\n" + x["body"] for x in guide["deepAnswer"]])
        section("参考架构 / 排查流程（演练）", ["```text\n" + guide["architecture"] + "\n```"])
        calc = guide["calculation"]
        section("算一遍 / 走一遍时间线", [calc["problem"]] + calc["steps"] + [calc["conclusion"]])
        section("可能的追问与回答", [f"**{i+1}. {x['question']}**\n\n{x['answer']}\n\n考察：{x['signal']}" for i, x in enumerate(guide["followups"])])
        section("常见失分点", ["误区：" + x["mistake"] + "\n\n修正：" + x["fix"] for x in guide["pitfalls"]])
        section("迁移你的后端经验", [guide["bridge"]])
        section("英文面试表达", [guide["english"]])
        exercise = guide["exercise"]
        section("动手练习与验收", [exercise["task"], "产出：" + exercise["deliverable"]] + exercise["checks"])
        section("自测评分依据", guide["rubric"])
    section("检索范围", [sources["coverage"]["summary"], "实际查询和访问限制见同目录 research-audit.json。"])
    (ROOT / "RESEARCH.md").write_text("\n".join(out))
    audit_path = ROOT / "research-audit.json"
    audit = json.loads(audit_path.read_text())
    audit["summary"].update({"deep_dive_guides": len(guides), "answered_followups": followups,
                             "worked_examples": len(guides), "guide_origin": "authored_practice_not_candidate_reports"})
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")


def build():
    build_playbook()
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
