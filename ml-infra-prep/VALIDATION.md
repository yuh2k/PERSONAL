# 交付验证

2026-11-05，在实际 Linux 环境的 Chromium 中完成完整回归。

## 完整解析与内容复核

- 23 个来源全部有独立中文解析页；92 个不同追问均有对应答案。
- 每页提供题意转述、澄清、概念、考点、口述答案、分层答案、架构、计算示例、易错点、英文表达、动手产出与验收依据。
- Serving、Feature Platform、System Design 三组内容分别复核了来源、技术边界与算术。EPCAS 的 requests/limits 行为核对到固定提交源码；统计区间使用未提前舍入的标准误。
- 6 份官方原文重新读取成功，17 条索引的原文未读状态保留。0 条已核验候选人专项面经；自编题和答案没有标成原题或官方答案。
- RESEARCH.md 由网页同一份数据生成，包含完整答案，不是只有链接的清单。

## 15 组浏览器场景全部通过

- 原有 21 节课程、42 道检测、14/21 天路线、任务与进度持久化。
- 资料来源标注、全文搜索、筛选、收藏、已读、笔记转义及旧备份兼容。
- 23 个详情页均可访问，短答案和详细答案直接可读，追问可单独或全部展开。
- 答案内容可被搜索命中；详情页笔记刷新保留，非法来源 ID 安全回退。
- 完整答案手册可下载，内容与网页数据一致。
- 错题、复习、STAR、系统设计草稿、模拟器、计时器和进度导入导出。
- 390px 手机端，包括完整解析及展开追问，无横向页面溢出。
- 真正断网后刷新详情页，答案、架构、来源记录和答案手册均可访问。
- 下载的 offline.zip 解压后实际运行及断网测试通过。
- 实战包 reference 的 10 项测试通过；starter 按练习设计抛出未实现错误。
- 0 个未捕获 JavaScript 错误；JavaScript/Python 语法和 diff 检查通过。

截图和机器可读报告在被忽略的 test-results/。统计区间舍入文案在完整回归后修正并重新构建，不改变交互行为。

## 网络与部署边界

本轮仅重试一篇 DoorDash 原文和一个 Reddit 搜索入口，仍被代理 CONNECT 403 拦截；不将网络限制报告为文章不存在，也没有声称获得新的候选人面经。官方 GitHub 文档可读，检索记录及固定提交证据见 research-audit.json。

网站已正式部署到 https://yuh2k.github.io/PERSONAL/ 。通过发布独立 gh-pages 静态分支，触发 GitHub 内置 Pages 发布，成功运行：https://github.com/yuh2k/PERSONAL/actions/runs/42161100926 。此前 Pages 未启用导致的 404 已通过这条发布路径解决。

随后独立执行公开 HTTPS 验证：https://github.com/yuh2k/PERSONAL/actions/runs/42161234873 。检查首页 HTTP 200、23 个完整指南、92 个逐题回答追问及 RESEARCH.md 均通过。验证工作流定义在 .github/workflows/check-ml-infra-public.yml。

这项公网检查在 GitHub Actions 中执行；当前编辑环境的代理仍禁止直接访问 github.io，不将本地代理限制等同于网站不可用。此前完成的 Chromium 交互、移动端与离线回归验证对应同一份发布内容。

## 复现

    cd /workspace/PERSONAL/ml-infra-prep
    python3 build.py
    node --check app.js
    node --check curriculum.js
    node --check interviews.js
    node --check interview-guides.js
    node --check interview-ui.js
    PYTHONPATH=labs/reference python3 -m unittest discover -s labs -v
    python3 tests/browser_test.py

构建无需安装应用依赖。浏览器验证需要 Python Playwright 和 Chromium；当前环境均已具备。
