# 交付验证

2026-10-28，在实际 Linux 环境的 Chromium 中运行。

## 已通过

- JavaScript：app.js、curriculum.js 语法检查。
- Python 参考实现：10 项合同测试全部通过。
- 浏览器：12 组场景全部通过，0 个未捕获 JavaScript 错误：
  - 21 节完整课程、42 道检测、唯一 ID、先修/资源引用、14 天计划覆盖全部课程。
  - 任务刷新持久化，14/21 天切换保留进度。
  - 课程和英文术语搜索，包括无结果状态。
  - 错题收集、重答纠正、检测任务自动完成、笔记转义与间隔复习。
  - 批处理过载排队、低负载等待取舍、非法参数及 KV 4/16 GiB 计算。
  - STAR/设计草稿持久化、题库筛选、随机抽题和计时结束。
  - 实战 ZIP 下载，进度导出、清空、导入完整往返；非法导入保留原数据。
  - 全部课程路由、全部任务完成状态、项目子路径部署。
  - 390px 手机端无横向溢出，底部导航、课程与架构交互。
  - 真正断网刷新、跨课程切换、样式与已缓存实战 ZIP。
  - 实际离线 ZIP 解压后再次运行网站与断网刷新。
  - ZIP 内 reference 的 10 项测试通过；starter 因未实现而按预期失败。
- 三个 ZIP 的 CRC 完整性通过。site-deploy.zip 是可直接上传的静态托管包。

## 外链检查的实际限制

16 个原文链接均已发起 GET 检测。当前出站代理对所需官方域名返回 CONNECT 403，无法到达目标服务器，因此不能判断页面是否仍存在，不能标记为通过或 404。网络域名已保留在环境配置草稿中。应用网络设置后运行：

    python3 tests/check_links.py

区分“环境网络策略阻挡”和“目标页面 HTTP 失败”。岗位页面尤其可能随招聘关闭而下线。无需联网即可阅读全部站内课程、英文表达、参考架构与实战。

## 部署

已成功推送部署分支 codex/ml-infra-prep；main 分支保持原样。实际云端运行 https://github.com/yuh2k/PERSONAL/actions/runs/40740040949 的 JavaScript 检查、10 项参考测试和静态构建已通过，部署在 actions/configure-pages 阶段失败：Get Pages site failed / HTTP 404，仓库尚未启用 GitHub Pages。

需仓库管理员在 https://github.com/yuh2k/PERSONAL/settings/pages 的 Build and deployment → Source 选择 GitHub Actions，然后重跑工作流。官方 actions/configure-pages 说明默认 GITHUB_TOKEN 无法自行启用 Pages，因此不能在没有所需管理能力时声称已发布。

工作流会在部署前先保存 ml-infra-ready-to-use 构建产物，包含 site-deploy.zip、offline.zip 和 labs.zip；即使 Pages 设置未完成也能下载交付包。Pages 成功后仍需实际 HTTP 验证 URL。当前运行环境的 GitHub API 和托管域名访问还受 CONNECT 403 限制。环境配置发布不等于网站部署。

## 复现命令

    cd /workspace/PERSONAL/ml-infra-prep
    python3 build.py
    node --check app.js
    node --check curriculum.js
    PYTHONPATH=labs/reference python3 -m unittest discover -s labs -v
    python3 tests/browser_test.py

浏览器结果、截图与链接明细存于被忽略的 test-results/。默认 starter 测试失败是练习契约，不是环境故障。所有演示容量和系统图均为备考假设，不宣称是 DoorDash 内部事实。
