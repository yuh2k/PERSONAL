"""Real Chromium functional, mobile and offline checks. No application dependencies."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
import json
import subprocess
import tempfile
import zipfile
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "test-results"
OUT.mkdir(exist_ok=True)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def run():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT.parent)))
    Thread(target=server.serve_forever, daemon=True).start()
    url = "http://127.0.0.1:" + str(server.server_port) + "/ml-infra-prep/"
    checks, errors = [], []

    def passed(name):
        checks.append(name)
        print("PASS", name, flush=True)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox", "--disable-dev-shm-usage"])
            context = browser.new_context(viewport={"width": 1440, "height": 1050}, accept_downloads=True)
            page = context.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(url)
            expect(page.locator("h1")).to_contain_text("ML Infra")
            assert page.evaluate("LESSONS.length") == 21
            assert page.evaluate("LESSONS.reduce((n,l)=>n+l.quiz.length,0)") == 42
            assert page.evaluate("new Set(LESSONS.map(l=>l.id)).size") == 21
            assert page.evaluate("SCHEDULE_14.flat().sort((a,b)=>a-b).every((x,i)=>x===i)&&SCHEDULE_14.flat().length===21")
            assert page.evaluate("LESSONS.every(l=>l.sections.length>=3&&l.sections.every(s=>s[1].length>100)&&l.quiz.length===2&&l.prereqs.every(id=>LESSONS.some(x=>x.id===id))&&l.resources.every(id=>SOURCES.some(x=>x.id===id)))")
            page.screenshot(path=str(OUT / "desktop.png"), full_page=True)
            passed("21 complete lessons / 42 quizzes / valid schedule and references")

            page.goto(url + "#interviews")
            expect(page.locator("h1")).to_contain_text("ML 专项")
            expect(page.locator(".research-availability")).to_be_visible()
            assert page.evaluate("INTERVIEW_RESEARCH.entries.length") == 23
            assert page.evaluate("INTERVIEW_RESEARCH.entries.filter(e=>e.kind==='candidate'||e.kind==='repost').length") == 0
            assert page.evaluate("INTERVIEW_RESEARCH.entries.every(e=>e.reportedQuestions.length===0&&e.evidenceUrl.startsWith('https://')&&e.lessons.every(id=>LESSONS.some(l=>l.id===id)))")
            assert page.evaluate("new Set(INTERVIEW_RESEARCH.entries.map(e=>e.id)).size") == 23
            assert page.evaluate("(()=>{const s=blankState();delete s.research;return validState(s);})()")
            assert page.evaluate("(()=>{const s=blankState();s.research.bad={saved:true};return !validState(s);})()")
            first_id=page.evaluate("INTERVIEW_RESEARCH.entries[0].id")
            first=page.locator('[data-research-id="'+first_id+'"]')
            first.locator('[data-research-toggle="saved"]').click()
            first.locator('[data-research-toggle="read"]').click()
            first.locator('.research-note summary').click()
            first.locator('textarea').fill('<img src=x onerror="window.RESEARCH_INJECTED=1"> 需要复习 CPU throttling')
            page.reload()
            assert page.evaluate("state.research[INTERVIEW_RESEARCH.entries[0].id].saved")
            assert page.evaluate("state.research[INTERVIEW_RESEARCH.entries[0].id].read")
            assert page.evaluate("window.RESEARCH_INJECTED") is None
            page.locator('#research-search').fill('不存在的面经xyz123')
            expect(page.locator('.research-empty')).to_be_visible()
            page.locator('[data-research-reset]').first.click()
            page.locator('#research-kind').select_option('candidate')
            expect(page.locator('.research-empty')).to_be_visible()
            page.locator('#research-kind').select_option('official')
            expect(page.locator('.research-card')).to_have_count(6)
            page.locator('[data-research-status="saved"]').click()
            expect(page.locator('.research-card')).to_have_count(1)
            page.locator('[data-research-reset]').first.click()
            page.locator('#research-search').fill('Redis')
            assert page.locator('.research-card').count()>0
            page.locator('[data-research-reset]').first.click()
            page.screenshot(path=str(OUT/'research-desktop.png'))
            passed("Research provenance counts, source/search filters, saved/read/escaped notes and old-backup compatibility")

            # Readable answers must exist on every source, including offline, not only external links.
            assert page.evaluate("Object.keys(INTERVIEW_GUIDES).length") == 23
            assert page.evaluate("INTERVIEW_RESEARCH.entries.every(e=>Object.hasOwn(INTERVIEW_GUIDES,e.id))")
            assert page.evaluate("Object.values(INTERVIEW_GUIDES).every(g=>g.paraphrase.length>=2&&g.clarify.length>=3&&g.concepts.length>=3&&g.deepAnswer.length>=4&&g.followups.length>=4&&g.followups.every(f=>f.question&&f.answer&&f.signal)&&g.calculation.steps.length>=2&&g.exercise.checks.length>=3)")
            query=page.evaluate("INTERVIEW_GUIDES['nvidia-batching'].followups[0].answer.slice(0,25)")
            page.locator('#research-search').fill(query)
            expect(page.locator('[data-research-id="nvidia-batching"]')).to_be_visible()
            page.locator('a[href="#interview/nvidia-batching"]').first.click()
            expect(page.locator('.interview-guide')).to_be_visible()
            expect(page.locator('#guide-answer').locator('..')).to_contain_text(page.evaluate("INTERVIEW_GUIDES['nvidia-batching'].shortAnswer"))
            expect(page.locator('nav a[href="#interviews"]')).to_have_attribute('aria-current','page')
            page.locator('[data-guide-expand]').click()
            expect(page.locator('#guide-followups').locator('..').locator('details[open]')).to_have_count(page.evaluate("INTERVIEW_GUIDES[location.hash.split('/')[1]].followups.length"))
            note=page.locator('[data-research-note="nvidia-batching"]')
            note.locator('xpath=ancestor::details/summary').click()
            note.fill('模型实例繁忙时，凑批等待上限不等于总排队 deadline。')
            page.reload()
            expect(page.locator('[data-research-note="nvidia-batching"]')).to_have_value('模型实例繁忙时，凑批等待上限不等于总排队 deadline。')
            page.screenshot(path=str(OUT/'interview-answer-desktop.png'))
            with page.expect_download() as answerbook:
                page.locator('a[download][href="./RESEARCH.md"]').first.click()
            book=Path(answerbook.value.path()).read_text()
            assert '60–90 秒参考回答' in book and '可能的追问与回答' in book
            assert page.evaluate("INTERVIEW_GUIDES['nvidia-batching'].shortAnswer") in book
            for invalid in ['missing-guide','__proto__','constructor']:
                page.goto(url+'#interview/'+invalid)
                expect(page.locator('main a[href="#interviews"]').first).to_be_visible()
                assert page.locator('.interview-guide').count()==0
            passed("Deep answers, answer-content search, followup reveal, detail notes, downloadable answer book and invalid routes")
            page.goto(url+'#home')

            page.locator('[data-task="foundations:read"]').check()
            page.reload()
            expect(page.locator('[data-task="foundations:read"]')).to_be_checked()
            page.locator('[data-plan="14"]').click()
            assert page.evaluate("state.plan") == 14
            assert page.evaluate("state.tasks['foundations:read']") is True
            page.goto(url + "#roadmap")
            expect(page.locator(".roadmap-day")).to_have_count(14)
            page.locator('[data-plan="21"]').click()
            expect(page.locator(".roadmap-day")).to_have_count(21)
            passed("Task persistence and 14/21-day switching retain progress")

            page.goto(url + "#courses")
            expect(page.locator(".lesson-card")).to_have_count(21)
            page.locator("#course-search").fill("KV Cache")
            assert 0 < page.locator(".lesson-card").count() < 21
            page.locator("#course-search").fill("找不到的内容abcxyz")
            expect(page.locator(".empty")).to_be_visible()
            passed("Course and terminology search")

            page.goto(url + "#lesson/foundations")
            page.locator('[data-quiz="foundations:0:1"]').click()
            assert page.evaluate("wrongAnswers().length") == 1
            page.goto(url + "#review")
            expect(page.locator(".review-card").first).to_contain_text("点击预测")
            page.goto(url + "#lesson/foundations")
            page.locator('[data-quiz="foundations:0:0"]').click()
            page.locator('[data-quiz="foundations:1:1"]').click()
            assert page.evaluate("wrongAnswers().length") == 0
            expect(page.locator('[data-task="foundations:quiz"]')).to_be_checked()
            malicious = '<img src=x onerror="window.INJECTED=1"> 我的笔记'
            page.locator("#lesson-note").fill(malicious)
            page.reload()
            expect(page.locator("#lesson-note")).to_have_value(malicious)
            assert page.evaluate("window.INJECTED") is None
            page.locator('[data-review-add="foundations"]').click()
            page.goto(url + "#review")
            page.locator('[data-review-grade="foundations:good"]').click()
            assert page.evaluate("state.reviews.foundations.level") == 1
            passed("Wrong-answer collection, correction, quiz completion, safe notes and spaced review")

            page.goto(url + "#practice")
            expect(page.locator("#batch-result")).to_contain_text("有效吞吐")
            page.locator("#sim-arrival").fill("10000")
            page.locator("#sim-batch").fill("1")
            page.locator("#sim-wait").fill("0")
            page.locator("#batch-form button[type=submit]").click()
            expect(page.locator("#batch-result")).to_contain_text("队列持续积压")
            assert page.evaluate("simulateBatch({arrival:10000,batch:1,wait:0,fixed:2,per:.5}).queue99>5")
            assert page.evaluate("simulateBatch({arrival:1,batch:8,wait:20,fixed:2,per:.5}).p50>simulateBatch({arrival:1,batch:8,wait:0,fixed:2,per:.5}).p50")
            invalid = page.evaluate("(()=>{try{simulateBatch({arrival:0,batch:8,wait:0,fixed:2,per:.5});return false;}catch(e){return true;}})()")
            assert invalid
            page.locator('[data-practice-tab="kv"]').click()
            expect(page.locator("#kv-result")).to_contain_text("4.00 GiB")
            page.locator("#kv-heads").fill("32")
            page.locator("#kv-form button[type=submit]").click()
            expect(page.locator("#kv-result")).to_contain_text("16.00 GiB")
            passed("Batching overload/latency behavior and 4/16 GiB KV calculations")

            page.locator('[data-practice-tab="star"]').click()
            page.locator("#star-failure-action").fill("I personally bounded the queue and measured p99.")
            page.locator('[data-practice-tab="design"]').click()
            page.locator("#design-serving").fill("Budget: gateway 10, features 25, queue 10, infer 35, remainder 20.")
            page.reload()
            page.locator('[data-practice-tab="star"]').click()
            expect(page.locator("#star-failure-action")).to_have_value("I personally bounded the queue and measured p99.")
            page.locator('[data-practice-tab="design"]').click()
            expect(page.locator("#design-serving")).to_contain_text("Budget")
            page.locator('[data-practice-tab="questions"]').click()
            expect(page.locator(".question-card")).to_have_count(21)
            page.locator('[data-question-filter="Behavioral"]').click()
            expect(page.locator(".question-card")).to_have_count(1)
            page.locator("[data-random-question]").click()
            page.locator("#timer-length").select_option("1200")
            page.locator("#timer-toggle").click()
            page.evaluate("timerEnd=Date.now()-1000;updateTimer()")
            expect(page.locator("#timer-display")).to_have_text("00:00")
            assert page.evaluate("state.sessions") == 1
            passed("Persistent STAR and design drafts, question filters and timer completion")

            page.locator('[data-practice-tab="coding"]').click()
            with page.expect_download() as download:
                page.locator('a[download][href="./labs.zip"]').click()
            with zipfile.ZipFile(download.value.path()) as bundle:
                assert "starter/batcher.py" in bundle.namelist()
                assert "reference/test_contracts.py" in bundle.namelist()
            page.locator("#settings-button").click()
            with page.expect_download() as download:
                page.locator("dialog [data-export]").click()
            backup_path = OUT / "roundtrip-progress.json"
            download.value.save_as(str(backup_path))
            exported = json.loads(backup_path.read_text())
            assert exported["tasks"]["foundations:read"]
            assert exported["stars"]["failure"]["action"]
            assert exported["research"][first_id]["saved"]
            assert page.evaluate("(()=>{const s=JSON.parse(JSON.stringify(state));s.answers['foundations:01']=1;return !validState(s);})()")
            page.locator("#import-file").set_input_files({"name": "invalid.json", "mimeType": "application/json", "buffer": b'{"version":1}'})
            expect(page.locator("#toast")).to_contain_text("导入失败")
            assert page.evaluate("state.tasks['foundations:read']") is True
            page.once("dialog", lambda dialog: dialog.accept())
            page.locator("#reset-state").click()
            assert page.evaluate("totalDone()") == 0
            page.locator("#settings-button").click()
            page.once("dialog", lambda dialog: dialog.accept())
            page.locator("#import-file").set_input_files(str(backup_path))
            expect(page.locator("#settings-dialog")).not_to_be_visible()
            assert page.evaluate("state.tasks['foundations:read']") is True
            assert page.evaluate("state.stars.failure.action") == exported["stars"]["failure"]["action"]
            assert page.evaluate("state.research[INTERVIEW_RESEARCH.entries[0].id].note") == exported["research"][first_id]["note"]
            passed("Downloadable lab ZIP and progress export/reset/import round-trip; invalid imports rejected")

            ids = page.evaluate("LESSONS.map(l=>l.id)")
            for lesson_id in ids:
                page.goto(url + "#lesson/" + lesson_id)
                expect(page.locator(".article")).to_be_visible()
                expect(page.locator(".quiz-question")).to_have_count(2)
            for source_id in page.evaluate("INTERVIEW_RESEARCH.entries.map(e=>e.id)"):
                page.goto(url+'#interview/'+source_id)
                expect(page.locator('.interview-guide')).to_be_visible()
                expect(page.locator('h1')).to_have_text(page.evaluate("INTERVIEW_GUIDES["+json.dumps(source_id)+"].title"))
                expect(page.locator('#guide-followups').locator('..').locator('details')).to_have_count(page.evaluate("INTERVIEW_GUIDES[location.hash.split('/')[1]].followups.length"))
            passed("All 23 complete interview-answer routes render with answered followups")
            page.evaluate("LESSONS.forEach(l=>TASKS.forEach(t=>state.tasks[l.id+':'+t.id]=true));persist()")
            page.goto(url + "#roadmap")
            assert page.locator('a[href="#lesson/undefined"]').count() == 0
            expect(page.locator(".roadmap-day")).to_have_count(21)
            passed("All lesson routes, complete-state roadmap and project subpath")

            mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, device_scale_factor=1, has_touch=True)
            mp = mobile.new_page()
            mp.on("pageerror", lambda error: errors.append(str(error)))
            for route in ["home", "roadmap", "courses", "lesson/batching", "practice", "review", "resources", "interviews", "interview/nvidia-batching", "interview/dd-index-108"]:
                mp.goto(url + "#" + route)
                assert mp.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), route + " overflows mobile"
            mp.goto(url + "#home")
            mp.screenshot(path=str(OUT / "mobile.png"), full_page=True)
            mp.goto(url + "#lesson/batching")
            mp.screenshot(path=str(OUT / "mobile-lesson.png"), full_page=True)
            expect(mp.locator("nav a")).to_have_count(7)
            mp.locator('nav a[href="#practice"]').click()
            mp.locator('[data-practice-tab="design"]').click()
            mp.locator(".diagram").first.wait_for(state="attached")
            mp.goto(url+"#interviews")
            mp.screenshot(path=str(OUT/"research-mobile.png"))
            mp.goto(url+'#interview/nvidia-batching')
            mp.locator('[data-guide-expand]').click()
            assert mp.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
            mp.screenshot(path=str(OUT/'interview-answer-mobile.png'))
            mobile.close()
            passed("390px mobile layouts, bottom navigation and responsive lesson/diagram")

            page.goto(url + "#lesson/features")
            page.evaluate("navigator.serviceWorker.ready")
            page.wait_for_function("navigator.serviceWorker.controller!==null")
            context.set_offline(True)
            page.reload(wait_until="domcontentloaded")
            expect(page.locator("h1")).to_contain_text("Feature Store")
            page.goto(url + "#lesson/llm")
            expect(page.locator("h1")).to_contain_text("LLM Inference")
            assert page.evaluate("fetch('./labs.zip').then(r=>r.ok)")
            assert page.evaluate("getComputedStyle(document.querySelector('.sidebar')).position") == "fixed"
            page.goto(url+"#interviews")
            expect(page.locator(".research-card")).to_have_count(23)
            assert page.evaluate("fetch('./research-audit.json').then(r=>r.ok)")
            page.goto(url+'#interview/dd-index-108')
            expect(page.locator('.interview-guide')).to_be_visible()
            page.reload(wait_until='domcontentloaded')
            expect(page.locator('#guide-answer').locator('..')).to_contain_text(page.evaluate("INTERVIEW_GUIDES['dd-index-108'].shortAnswer"))
            assert page.evaluate("fetch('./RESEARCH.md').then(r=>r.text()).then(t=>t.includes(INTERVIEW_GUIDES['dd-index-108'].shortAnswer))")
            context.set_offline(False)
            passed("Actual network-off reload, cross-lesson navigation, styles and cached lab download")
            # Validate the actual downloadable artifact, not only source files.
            unpacked = OUT / "offline-bundle"
            unpacked.mkdir(exist_ok=True)
            with zipfile.ZipFile(ROOT / "offline.zip") as bundle:
                assert bundle.testzip() is None
                bundle.extractall(unpacked)
            lab_dir = OUT / "lab-bundle"
            lab_dir.mkdir(exist_ok=True)
            with zipfile.ZipFile(unpacked / "labs.zip") as bundle:
                bundle.extractall(lab_dir)
            reference = subprocess.run(["python3", "-m", "unittest", "discover", "-s", "reference", "-v"], cwd=lab_dir, capture_output=True, text=True)
            starter = subprocess.run(["python3", "-m", "unittest", "discover", "-s", "starter", "-v"], cwd=lab_dir, capture_output=True, text=True)
            assert reference.returncode == 0 and "Ran 10 tests" in reference.stderr
            assert starter.returncode == 1 and "NotImplementedError" in starter.stderr
            page.goto(url + "test-results/offline-bundle/#resources")
            assert page.locator('a[href="./offline.zip"]').count() == 0
            page.evaluate("navigator.serviceWorker.ready")
            page.wait_for_function("navigator.serviceWorker.controller!==null")
            context.set_offline(True)
            page.reload(wait_until="domcontentloaded")
            expect(page.locator("h1")).to_contain_text("读原文")
            context.set_offline(False)
            passed("Shipped offline ZIP works; packaged reference passes 10 tests; starter fails as intended")
            assert not errors, errors
            passed("No uncaught JavaScript errors")
            browser.close()
    finally:
        server.shutdown()
        (OUT / "browser-report.json").write_text(json.dumps({"passed": checks, "js_errors": errors}, ensure_ascii=False, indent=2))
    print(str(len(checks)) + " browser scenarios passed.", flush=True)


if __name__ == "__main__":
    run()
