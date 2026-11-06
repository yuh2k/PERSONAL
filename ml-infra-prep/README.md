# 跃迁 · DoorDash ML Infra 备考工作台

中文优先的个人学习网站：21 节完整课程，14/21 天路线，84 项任务，42 道检测，21 道开放题，3 个系统设计参考，批处理/KV 计算实验，AI Coding 实战包，STAR 笔记，错题与间隔复习。

所有进度保存在浏览器 localStorage，支持带结构校验的 JSON 导入导出。无 CDN、账户、后端或 API key。外部文章需要联网。模拟题与架构不是 DoorDash 内部资料，也不承诺面试结果。

## 运行

    cd /workspace/PERSONAL/ml-infra-prep
    python3 build.py
    python3 -m http.server 8000 --bind 0.0.0.0

浏览器访问服务所在机器的地址。HTTPS 或 localhost 安全上下文支持 Service Worker；首次缓存完成后可断网刷新。文件直接双击不保证缓存和存储语义，请用 HTTP 服务。进度按浏览器和 origin 隔离，更换域名前先导出 JSON。

## 验证

    node --check app.js
    node --check curriculum.js
    PYTHONPATH=labs/reference python3 -m unittest discover -s labs -v
    python3 tests/browser_test.py

浏览器测试用已有 Python Playwright 和 /usr/bin/chromium；自动启动服务器，验证桌面/手机、持久化、测验、复习、模拟器、导入导出和断网刷新。截图/报告在忽略的 test-results/。

## 部署

正式网站：https://yuh2k.github.io/PERSONAL/

面经与答案：https://yuh2k.github.io/PERSONAL/#interviews

已将 build.py 生成的 dist/site 独立发布到 gh-pages 分支（含 .nojekyll），GitHub 自动触发 Pages 发布并成功。无需读者安装 Python 或下载代码。源代码仍在 codex/ml-infra-prep；gh-pages 只保存构建产物。

部署成功记录：https://github.com/yuh2k/PERSONAL/actions/runs/42161100926
公网验证记录：https://github.com/yuh2k/PERSONAL/actions/runs/42161234873

独立云端检查确认正式 HTTPS 返回 200，且解析数据包含 23 个完整专题与 92 个带答案追问，答案手册可访问。当前编辑环境本身访问 github.io 仍受网络代理限制，公网验证通过 GitHub Actions 执行。

后续手动发布：运行 python3 build.py，将 dist/site 的完整内容同步到 gh-pages 分支的独立工作目录，提交并正常推送（不用 force）；等待 pages build and deployment 成功。应先获取该分支最新提交，避免覆盖其他更新。源代码分支仍保留自定义 Actions 部署工作流；如果将 Pages Source 切换为 GitHub Actions，可使用该路径。

离线包 offline.zip 仍可独立使用。浏览器进度按 origin 保存，更换网址前请导出 JSON，再在正式网站导入。

## 边界

- 容量数字是练习假设，不是 DoorDash 生产事实。
- 批处理实验是单实例线性计算模型，不是 Triton benchmark。
- KV 估算不含权重、workspace、碎片和并行布局。
- Starter 默认未实现，测试失败；reference 的 10 项合同测试应通过。
- 资源检测区分成功、HTTP 错误和 egress 限制，见 VALIDATION.md。
- 网站不上传数据；备份 JSON 含个人笔记，请妥善保管。

## 面经题意、解析与答案

#interviews 提供 23 个中文专题，点击卡片进入 #interview/资料ID。卡片直接展示中文问题和 60–90 秒参考回答；详情提供题意转述、澄清问题、先修术语、考点、完整答案与取舍、参考架构、计算示例、逐题解答的追问、常见误区、后端经验迁移、英文表达、动手验收和自测依据。搜索覆盖解析与追问答案。

来源仍区分为 6 份已读官方资料、17 条已核验索引。0 条已核验候选人专项面经：网络限制仍未解除。已读原文可转述要点；未读原文只提供明确标注的主题衍生练习，不伪装为文章摘要、真实面经原题或官方答案。所有演练容量与架构均为假设。

interview-guides.js 是完整解析的数据源。python3 build.py 将同一份内容生成 RESEARCH.md 中文答案手册，并一同打入部署包和离线包；网页可直接下载。修改解析后必须重新构建，避免手册和页面不一致。

收藏、已读、资料笔记复用已有本地进度；在卡片和详情页之间保持一致，旧备份仍可导入。离线缓存升到 v3，包含完整解析、答案手册和来源记录。外部原文仍需联网，站内答案不需要。
