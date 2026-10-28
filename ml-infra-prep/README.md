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

python3 build.py 的输出 dist/site 是完整静态站点。上传该目录到有权限的 Cloudflare Pages、Netlify 或任意静态托管即可。

仓库根目录 .github/workflows/deploy-ml-infra.yml 支持 GitHub Pages，已推送独立的 codex/ml-infra-prep 分支。先在 Settings → Pages 选择 GitHub Actions，再重跑工作流；也支持 main 或部署分支的新推送。部署前先上传 ml-infra-ready-to-use 构建产物，即使 Pages 设置未完成也可下载部署/离线包。工作流只发布本子目录，保留原来的 Python 算法文件。相对路径和 hash 路由同时支持根路径和 /PERSONAL/ 项目路径。

只有部署成功且实际 HTTP 验证后，才能把云端 URL 作为已交付地址。离线交付 offline.zip 含完整网站和 labs.zip；解压后启动 Python 静态服务即可。进度另行导出 JSON。

## 边界

- 容量数字是练习假设，不是 DoorDash 生产事实。
- 批处理实验是单实例线性计算模型，不是 Triton benchmark。
- KV 估算不含权重、workspace、碎片和并行布局。
- Starter 默认未实现，测试失败；reference 的 10 项合同测试应通过。
- 资源检测区分成功、HTTP 错误和 egress 限制，见 VALIDATION.md。
- 网站不上传数据；备份 JSON 含个人笔记，请妥善保管。
