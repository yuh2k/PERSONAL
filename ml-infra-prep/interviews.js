'use strict';
const INTERVIEW_RESEARCH = {
  "updated": "本轮检索",
  "coverage": {
    "summary": "本轮尚未核验到 DoorDash ML 专项候选人面经。主流搜索/面经站点被环境网络策略阻挡；公开 GitHub 文档与索引可读。已筛选工程背景和资料线索，未计入普通后端/算法面经、招聘广告及其他公司经验。索引日期不是面试日期，资料数量不是题目频率。下方列出实际查询词和受阻入口，可在自己的浏览器继续检索。",
    "queries": [
      "DoorDash machine learning",
      "DoorDash ML interview",
      "DoorDash system design",
      "DoorDash domain interview",
      "DoorDash MLE",
      "DoorDash interview in:title",
      "DoorDash 面经",
      "DoorDash interview",
      "ML 面经",
      "machine learning 面经",
      "DoorDash ML",
      "DoorDash MLE interview",
      "DoorDash \"machine learning\" interview",
      "DoorDash \"ML infra\"",
      "DoorDash 面经 in:readme",
      "DoorDash 机器学习 in:readme",
      "DoorDash machine learning interview in:readme",
      "DoorDash 系统设计 in:readme",
      "doordash \"domain knowledge\"",
      "doordash \"ML system design\""
    ],
    "blocked": [
      {
        "name": "Google search",
        "url": "https://www.google.com/search?q=DoorDash+ML+infrastructure+interview+experience",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "Reddit search",
        "url": "https://www.reddit.com/search/?q=doordash%20machine%20learning%20interview",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "LeetCode Discuss",
        "url": "https://leetcode.com/discuss/interview-experience/?currentPage=1&orderBy=most_relevant&query=doordash",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "InterviewQuery guide",
        "url": "https://www.interviewquery.com/interview-guides/doordash-machine-learning-engineer",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "Glassdoor company interviews",
        "url": "https://www.glassdoor.com/Interview/DoorDash-Interview-Questions-E813073.htm",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "Medium search",
        "url": "https://medium.com/search?q=doordash%20machine%20learning%20interview",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "Blind search",
        "url": "https://www.teamblind.com/search/Doordash%20ML%20interview",
        "reason": "环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。"
      },
      {
        "name": "一亩三分地",
        "url": "https://www.1point3acres.com/bbs/",
        "reason": "环境代理在到达网站前拒绝连接；未读取页面，不能判定网站有无相关帖子。"
      },
      {
        "name": "牛客",
        "url": "https://www.nowcoder.com/search/all?query=doordash",
        "reason": "环境代理在到达网站前拒绝连接；未读取页面，不能判定网站有无相关帖子。"
      },
      {
        "name": "Bing 搜索",
        "url": "https://www.bing.com/search?q=DoorDash+machine+learning+system+design+interview",
        "reason": "环境代理 CONNECT 403。"
      },
      {
        "name": "Triton Auto Tuner: Finding the Right Triton Configuration for Hundreds of Models",
        "url": "https://careersatdoordash.com/blog/triton-auto-tuner-finding-the-right-triton-configuration-for-hundreds-of-models/",
        "reason": "CONNECT 403，未读到原文"
      },
      {
        "name": "DoorDash Engineering Blog",
        "url": "https://careersatdoordash.com/blog/",
        "reason": "CONNECT 403，未读到原文"
      },
      {
        "name": "GitHub 后续精确检索",
        "url": "https://github.com/search?q=DoorDash+ML+interview&type=issues",
        "reason": "可读搜索后续遇到 HTTP 429，已停止重复请求；代码搜索需登录，未绕过。"
      }
    ]
  },
  "entries": [
    {
      "id": "official-epcas",
      "title": "Elastic Pod CPU Auto-Scaler",
      "url": "https://github.com/doordash-oss/elastic-cpu-pod-autoscaler",
      "evidenceUrl": "https://raw.githubusercontent.com/doordash-oss/elastic-cpu-pod-autoscaler/main/README.md",
      "date": "文档发表日期未标注",
      "role": "DoorDash OSS · 技术资料，无候选人岗位信息",
      "kind": "official",
      "language": "English",
      "rounds": [
        "ML Domain",
        "ML System Design"
      ],
      "topics": [
        "Kubernetes",
        "Autoscaling",
        "CPU"
      ],
      "summary": "原文已读。通过 Kubernetes Pod resize 子资源原地调整容器 CPU requests，重点是避免敏感服务重启。 从 kubelet cAdvisor 采集 CPU usage 和 throttling，通过 API server node proxy 访问，不依赖 Prometheus。",
      "reportedQuestions": [],
      "followups": [
        "模型服务不希望重启，CPU 突发时原地扩 CPU、HPA 和 warm replicas 如何取舍？",
        "为什么 CPU request 增加后仍未改善 p99？"
      ],
      "answerPoints": [
        "先判断 CPU throttling 还是模型/GPU/队列瓶颈。原地扩容受节点余量与 quota 约束；HPA 有模型加载/预热延迟；温热副本花成本换响应速度。衡量第一轮过载、p99、拒绝率与资源成本。",
        "可能没有足够 node headroom、实际瓶颈并非 CPU，或线程池/模型队列/下游尾延迟没变。观察控制动作是否完成、throttling、queue 和 inference 分解。"
      ],
      "lessons": [
        "autoscaling",
        "capacity"
      ],
      "caveat": "这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。",
      "provenance": "已读取官方原文（HTTP 200）。可见材料说明：EPCAS is a Kubernetes operator for restart-free vertical CPU scaling; it watches ElasticWorkloadPolicy, samples CPU usage/throttling, and changes CPU requests via Pod resize."
    },
    {
      "id": "official-agentico",
      "title": "Agentic Orchestrator",
      "url": "https://github.com/doordash-oss/agentic-orchestrator",
      "evidenceUrl": "https://raw.githubusercontent.com/doordash-oss/agentic-orchestrator/main/README.md",
      "date": "文档发表日期未标注",
      "role": "DoorDash OSS · 技术资料，无候选人岗位信息",
      "kind": "official",
      "language": "English",
      "rounds": [
        "ML Domain",
        "ML System Design"
      ],
      "topics": [
        "开发平台",
        "Agent",
        "评估"
      ],
      "summary": "原文已读。强调从高层需求到可审查 PR 的持久流程，显式建立仓库上下文，避免只依赖单个长对话。 在实现前进行计划校验；验证与最终审查需要具体证据。",
      "reportedQuestions": [],
      "followups": [
        "设计一个帮助模型开发者自主实验的 agent 平台，如何避免不可复现结果和失控成本？"
      ],
      "answerPoints": [
        "借鉴持久流程、版本化上下文、可恢复状态与验证门槛；再补实验特有的 dataset/model/eval 版本、预算、工具权限、隔离与审计。这是基于公开设计的延伸练习，非该项目已实现能力清单。"
      ],
      "lessons": [
        "developer-platform"
      ],
      "caveat": "这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。",
      "provenance": "已读取官方原文（HTTP 200）。可见材料说明：README describes a durable engineering workflow: gather context, inquire/research/design, phase plans, implementation, verification, final review, publish."
    },
    {
      "id": "official-dqr",
      "title": "DataQualityReport",
      "url": "https://github.com/doordash-oss/DataQualityReport",
      "evidenceUrl": "https://raw.githubusercontent.com/doordash-oss/DataQualityReport/main/README.md",
      "date": "文档发表日期未标注",
      "role": "DoorDash OSS · 技术资料，无候选人岗位信息",
      "kind": "official",
      "language": "English",
      "rounds": [
        "ML Domain",
        "ML System Design"
      ],
      "topics": [
        "数据质量",
        "Observability"
      ],
      "summary": "原文已读。面向 Pandas DataFrame 的快速数据质量诊断，目标是机器运行时间和用户注意力成本都低。 README 以小于一分钟为诊断速度目标，鼓励交互开发中频繁使用。",
      "reportedQuestions": [],
      "followups": [
        "离线实验中的 DataFrame 质量检查和生产特征监控分别解决什么问题？"
      ],
      "answerPoints": [
        "前者快速发现样本、类型、缺失等问题；生产还需要连续 freshness/schema/缺失率监控、版本与时间语义、成熟标签和回滚。对同一错误保持可复现 golden cases。"
      ],
      "lessons": [
        "observability"
      ],
      "caveat": "这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。",
      "provenance": "已读取官方原文（HTTP 200）。可见材料说明：DataQualityReport aims to quickly make users aware of potential data quality issues in Pandas DataFrames, with diagnostics targeted at under one minute."
    },
    {
      "id": "nvidia-batching",
      "title": "Triton Inference Server — Batchers",
      "url": "https://github.com/triton-inference-server/server/blob/main/docs/user_guide/batcher.md",
      "evidenceUrl": "https://raw.githubusercontent.com/triton-inference-server/server/main/docs/user_guide/batcher.md",
      "date": "文档发表日期未标注",
      "role": "NVIDIA / Triton · 技术资料，无候选人岗位信息",
      "kind": "official",
      "language": "English",
      "rounds": [
        "ML Domain",
        "ML System Design"
      ],
      "topics": [
        "Triton",
        "Dynamic batching"
      ],
      "summary": "原文已读。Dynamic batching 面向 stateless 模型，sequence batching 面向需要保持实例/序列状态的模型。 默认动态批处理尽量凑到模型允许的最大批大小，但不为凑批额外等待。",
      "reportedQuestions": [],
      "followups": [
        "max_queue_delay=5ms，为何请求仍排队 80ms？",
        "是否应该给每个模型都设置 preferred_batch_size=[8,16,32]？"
      ],
      "answerPoints": [
        "区分为凑批而等待与实例忙碌造成的资源排队。检查到达率/服务率、pending、执行时间；再设置有界队列、deadline、拒绝与扩容。",
        "不能机械照抄。官方建议多数模型不设 preferred；先测 baseline，仅在特定批大小有明显性能收益（如 TensorRT optimization profile）时考虑设置。"
      ],
      "lessons": [
        "batching",
        "triton"
      ],
      "caveat": "这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。",
      "provenance": "已读取官方原文（HTTP 200）。可见材料说明：The documentation recommends starting with default dynamic_batching, measuring latency/throughput, and says preferred_batch_size should not be used for most models."
    },
    {
      "id": "nvidia-model-config",
      "title": "Triton Inference Server — Model Configuration",
      "url": "https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_configuration.md",
      "evidenceUrl": "https://raw.githubusercontent.com/triton-inference-server/server/main/docs/user_guide/model_configuration.md",
      "date": "文档发表日期未标注",
      "role": "NVIDIA / Triton · 技术资料，无候选人岗位信息",
      "kind": "official",
      "language": "English",
      "rounds": [
        "ML Domain",
        "ML System Design"
      ],
      "topics": [
        "Triton",
        "模型发布"
      ],
      "summary": "原文已读。max_batch_size 声明模型支持的批大小；模型自身不符合 batching 约束时需设为 0。 输入/输出要声明与模型一致的 name、datatype、shape；不能仅改服务器配置就改变模型图。",
      "reportedQuestions": [],
      "followups": [
        "新模型容器进程健康，但第一批预测超时，发布系统应加什么 gate？"
      ],
      "answerPoints": [
        "校验模型制品/输入合约，等待 model ready 与代表性 warm-up；保留旧模型温热副本，在性能和功能验证后进入 canary。"
      ],
      "lessons": [
        "deployment"
      ],
      "caveat": "这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。",
      "provenance": "已读取官方原文（HTTP 200）。可见材料说明：Batching requires compatible first batch dimensions on all inputs/outputs; non-batching models must use max_batch_size=0. Model instances are served after successful configured warm-up."
    },
    {
      "id": "nvidia-metrics",
      "title": "Triton Inference Server — Metrics",
      "url": "https://github.com/triton-inference-server/server/blob/main/docs/user_guide/metrics.md",
      "evidenceUrl": "https://raw.githubusercontent.com/triton-inference-server/server/main/docs/user_guide/metrics.md",
      "date": "文档发表日期未标注",
      "role": "NVIDIA / Triton · 技术资料，无候选人岗位信息",
      "kind": "official",
      "language": "English",
      "rounds": [
        "ML Domain",
        "ML System Design"
      ],
      "topics": [
        "Triton",
        "Observability",
        "p99"
      ],
      "summary": "原文已读。单个请求可带多个 items；request、inference、execution 三种计数不能混用。平均执行 batch 可用 inference_count / execution_count（注意缓存和统计窗口口径）。 pending_request_count 表示已入服务但 backend 尚未开始执行的请求，可能不只对应单一物理队列。",
      "reportedQuestions": [],
      "followups": [
        "监控显示每秒 1K request、8K inference、500 execution，平均 batch 是多少？能直接得到 p99 吗？"
      ],
      "answerPoints": [
        "在对应窗口且排除缓存口径差异后，平均 batch=8000/500=16。这些 count 不能得出 p99；累计耗时/请求数至多给平均，需要延迟分布。"
      ],
      "lessons": [
        "observability"
      ],
      "caveat": "这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。",
      "provenance": "已读取官方原文（HTTP 200）。可见材料说明：Metrics distinguish Request Count, Inference Count and Execution Count; average batch size is Inference Count / Execution Count. Latency counters are cumulative durations, not percentiles."
    },
    {
      "id": "dd-index-65",
      "title": "How DoorDash is Scaling its Data Platform to Delight Customers and Meet Growing Demand",
      "url": "https://doordash.engineering/2020/09/25/how-doordash-is-scaling-its-data-platform/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L65",
      "date": "2020-09-25（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Kafka",
        "Flink",
        "实时特征"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Kafka / Flink / 实时特征 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计实时特征流：事件重复、乱序、迟到、窗口边界和 Flink 重启分别如何处理？",
        "在线写入与历史 backfill 并发时，怎样避免旧值覆盖新值以及恢复时翻倍计数？"
      ],
      "answerPoints": [
        "定义 event_id、event_time、available_at、watermark 与允许迟到；明确 sink 是否支持事务或幂等。",
        "用版本/时间条件 upsert、隔离回填命名空间和资源；以 golden cases、对账和端到端 freshness 验证。"
      ],
      "lessons": [
        "features",
        "skew",
        "design-features"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-70",
      "title": "Introducing Fabricator: A Declarative Feature Engineering Framework",
      "url": "https://doordash.engineering/2022/01/11/introducing-fabricator-a-declarative-feature-engineering-framework/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L70",
      "date": "2022-01-11（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Feature Engineering",
        "开发平台"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Feature Engineering / 开发平台 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计声明式特征平台：怎样让同一份定义在离线训练和在线物化中保持语义一致？",
        "用户修改特征窗口或类型后，怎样验证影响范围、回填、推广并回退？"
      ],
      "answerPoints": [
        "定义 feature schema、owner、版本、数据源、时间语义和依赖 DAG；共享定义仍需 golden tests 与线上回放。",
        "记录 lineage、运行预算、不可变输出和质量 gate；双版本迁移，避免模型仍依赖旧定义时直接覆盖。"
      ],
      "lessons": [
        "developer-platform",
        "lifecycle",
        "skew"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-76",
      "title": "Building Scalable Real Time Event Processing with Kafka and Flink",
      "url": "https://doordash.engineering/2022/08/02/building-scalable-real-time-event-processing-with-kafka-and-flink/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L76",
      "date": "2022-08-02（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Kafka",
        "Flink",
        "实时特征"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Kafka / Flink / 实时特征 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计实时特征流：事件重复、乱序、迟到、窗口边界和 Flink 重启分别如何处理？",
        "在线写入与历史 backfill 并发时，怎样避免旧值覆盖新值以及恢复时翻倍计数？"
      ],
      "answerPoints": [
        "定义 event_id、event_time、available_at、watermark 与允许迟到；明确 sink 是否支持事务或幂等。",
        "用版本/时间条件 upsert、隔离回填命名空间和资源；以 golden cases、对账和端到端 freshness 验证。"
      ],
      "lessons": [
        "features",
        "skew",
        "design-features"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-108",
      "title": "Building a Scalable ML Feature Store with Redis, Binary Serialization, and Compression",
      "url": "https://doordash.engineering/2020/11/19/building-a-gigascale-ml-feature-store-with-redis/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L108",
      "date": "2020-11-19（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Feature Store",
        "Redis"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Feature Store / Redis 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计 online/offline Feature Store：实体键、TTL、批读和 point-in-time join 分别放在哪层？",
        "特征库的内存和网络成本太高时，如何评估二进制编码、压缩和缓存对 p99 的影响？"
      ],
      "answerPoints": [
        "先区分最新值随机读和历史训练 join；定义 schema、缺失与 freshness 契约，避免把 latest join 到过去样本。",
        "量化 payload、网络往返和 CPU 解压成本；用真实 key 分布与热键压测，版本化编码并保留回滚兼容。"
      ],
      "lessons": [
        "features",
        "design-features"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-112",
      "title": "Building Riviera: A Declarative Real-Time Feature Engineering Framework",
      "url": "https://doordash.engineering/2021/03/04/building-a-declarative-real-time-feature-engineering-framework/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L112",
      "date": "2021-03-04（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Feature Engineering",
        "开发平台"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Feature Engineering / 开发平台 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计声明式特征平台：怎样让同一份定义在离线训练和在线物化中保持语义一致？",
        "用户修改特征窗口或类型后，怎样验证影响范围、回填、推广并回退？"
      ],
      "answerPoints": [
        "定义 feature schema、owner、版本、数据源、时间语义和依赖 DAG；共享定义仍需 golden tests 与线上回放。",
        "记录 lineage、运行预算、不可变输出和质量 gate；双版本迁移，避免模型仍依赖旧定义时直接覆盖。"
      ],
      "lessons": [
        "developer-platform",
        "lifecycle",
        "skew"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-156",
      "title": "Retraining Machine Learning Models in the Wake of COVID-19",
      "url": "https://doordash.engineering/2020/09/15/retraining-ml-models-covid-19/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L156",
      "date": "2020-09-15（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Observability",
        "Data drift",
        "Skew"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Observability / Data drift / Skew 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "服务错误率正常，但模型效果下降：如何区分 skew、输入 drift、标签延迟与真正的 concept drift？",
        "怎样设计模型监控，使低流量模型和高流量模型都得到可靠告警？"
      ],
      "answerPoints": [
        "比较同一请求的训练/服务特征、模型/特征版本与发布事件；按 cohort 看缺失、新鲜度、预测分布和成熟标签。",
        "不要把累计 duration 除以次数当 p99；结合延迟分布、超预算事件比例和多窗口错误预算，注明样本量与不确定性。"
      ],
      "lessons": [
        "observability",
        "skew",
        "deployment"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-263",
      "title": "Powering Search & Recommendations at DoorDash",
      "url": "https://doordash.engineering/2017/07/06/powering-search-recommendations-at-doordash/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L263",
      "date": "2017-07-06（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "推荐",
        "Embedding",
        "向量召回"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 推荐 / Embedding / 向量召回 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计商家推荐或搜索召回：离线 embedding、在线 query、ANN 索引和 rerank 如何串起来？",
        "模型与向量索引更新怎样保证版本兼容？新用户、新商家和无召回结果怎样处理？"
      ],
      "answerPoints": [
        "先量化 candidates/request 和 items/s；把召回与精排分层，分配端到端时间预算，区分 freshness、召回率和排序效果。",
        "embedding 模型版本与索引 generation 绑定，构建验证后原子切换；保留旧索引、冷启动基线与 canary 护栏。"
      ],
      "lessons": [
        "design-serving",
        "features",
        "deployment"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-300",
      "title": "Things Not Strings: Understanding Search Intent with Better Recall",
      "url": "https://doordash.engineering/2020/12/15/understanding-search-intent-with-better-recall/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L300",
      "date": "2020-12-15（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "推荐",
        "Embedding",
        "向量召回"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 推荐 / Embedding / 向量召回 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计商家推荐或搜索召回：离线 embedding、在线 query、ANN 索引和 rerank 如何串起来？",
        "模型与向量索引更新怎样保证版本兼容？新用户、新商家和无召回结果怎样处理？"
      ],
      "answerPoints": [
        "先量化 candidates/request 和 items/s；把召回与精排分层，分配端到端时间预算，区分 freshness、召回率和排序效果。",
        "embedding 模型版本与索引 generation 绑定，构建验证后原子切换；保留旧索引、冷启动基线与 canary 护栏。"
      ],
      "lessons": [
        "design-serving",
        "features",
        "deployment"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-329",
      "title": "Personalized Store Feed with Vector Embeddings",
      "url": "https://doordash.engineering/2018/04/02/personalized-store-feed-with-vector-embeddings/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L329",
      "date": "2018-04-02（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "推荐",
        "Embedding",
        "向量召回"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 推荐 / Embedding / 向量召回 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计商家推荐或搜索召回：离线 embedding、在线 query、ANN 索引和 rerank 如何串起来？",
        "模型与向量索引更新怎样保证版本兼容？新用户、新商家和无召回结果怎样处理？"
      ],
      "answerPoints": [
        "先量化 candidates/request 和 items/s；把召回与精排分层，分配端到端时间预算，区分 freshness、召回率和排序效果。",
        "embedding 模型版本与索引 generation 绑定，构建验证后原子切换；保留旧索引、冷启动基线与 canary 护栏。"
      ],
      "lessons": [
        "design-serving",
        "features",
        "deployment"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-537",
      "title": "Supporting Rapid Product Iteration with an Experimentation Analysis Platform",
      "url": "https://doordash.engineering/2020/09/09/experimentation-analysis-platform-mvp/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L537",
      "date": "2020-09-09（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "A/B",
        "模型发布",
        "评估"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 A/B / 模型发布 / 评估 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "Shadow 和 Canary 能回答哪些不同问题？离线指标改善后还需要什么上线证据？",
        "配送/物流实验存在用户相互影响和延迟结果，怎样定义实验单位和停止条件？"
      ],
      "answerPoints": [
        "Shadow 查兼容、性能和预测分布，不直接证明用户收益；稳定分桶的 Canary/A-B 观测真实行为并保护服务指标。",
        "澄清干扰与时间/地域相关性，和实验专家选择单位；预先定义指标、样本量、成熟窗口和护栏，不用短期噪声宣布胜负。"
      ],
      "lessons": [
        "deployment",
        "observability"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-557",
      "title": "Meet Dash-AB — The Statistics Engine of Experimentation at DoorDash",
      "url": "https://doordash.engineering/2022/05/24/meet-dash-ab-the-statistics-engine-of-experimentation-at-doordash/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L557",
      "date": "2022-05-24（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "A/B",
        "模型发布",
        "评估"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 A/B / 模型发布 / 评估 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "Shadow 和 Canary 能回答哪些不同问题？离线指标改善后还需要什么上线证据？",
        "配送/物流实验存在用户相互影响和延迟结果，怎样定义实验单位和停止条件？"
      ],
      "answerPoints": [
        "Shadow 查兼容、性能和预测分布，不直接证明用户收益；稳定分桶的 Canary/A-B 观测真实行为并保护服务指标。",
        "澄清干扰与时间/地域相关性，和实验专家选择单位；预先定义指标、样本量、成熟窗口和护栏，不用短期噪声宣布胜负。"
      ],
      "lessons": [
        "deployment",
        "observability"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-596",
      "title": "Building Flexible Ensemble ML Models with a Computational Graph",
      "url": "https://doordash.engineering/2021/01/26/computational-graph-machine-learning-ensemble-model-support/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L596",
      "date": "2021-01-26（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Serving",
        "计算图",
        "p99"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Serving / 计算图 / p99 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "多个模型组成计算图时，怎样传播 deadline、复用特征并控制 fan-out 的尾延迟？",
        "模型图的一条支路变慢或版本不兼容，平台应怎样检测、降级与回滚？"
      ],
      "answerPoints": [
        "区分可并行与有依赖的节点，沿关键路径分配剩余 budget；复用有版本的输入，限制队列和无界并发。",
        "逐节点记录版本与 trace；fallback 必须业务可接受，不能随意丢掉关键模型输出；按图的兼容 manifest 回滚。"
      ],
      "lessons": [
        "serving",
        "triton",
        "rpc"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "dd-index-630",
      "title": "Maintaining Machine Learning Model Accuracy Through Monitoring",
      "url": "https://doordash.engineering/2021/05/20/monitor-machine-learning-model-drift/",
      "evidenceUrl": "https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L630",
      "date": "2021-05-20（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Observability",
        "Data drift",
        "Skew"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Observability / Data drift / Skew 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "服务错误率正常，但模型效果下降：如何区分 skew、输入 drift、标签延迟与真正的 concept drift？",
        "怎样设计模型监控，使低流量模型和高流量模型都得到可靠告警？"
      ],
      "answerPoints": [
        "比较同一请求的训练/服务特征、模型/特征版本与发布事件；按 cohort 看缺失、新鲜度、预测分布和成熟标签。",
        "不要把累计 duration 除以次数当 p99；结合延迟分布、超预算事件比例和多窗口错误预算，注明样本量与不确定性。"
      ],
      "lessons": [
        "observability",
        "skew",
        "deployment"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "zh-index-0",
      "title": "DoorDash 避开 \"缓存风暴\"",
      "url": "https://blog.doordash.com/avoiding-cache-stampede-at-doordash-55bbf596d94b",
      "evidenceUrl": "https://github.com/carlos19960601/awesome-scalability-zh/blob/0c1dc62f5d1005436e4049db288987f4c70c7917/README.md#L143",
      "date": "原文发表日期未核验",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "中文",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Caching",
        "热点",
        "p99"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Caching / 热点 / p99 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "热门商家特征缓存同时过期，怎样避免 cache stampede 冲垮底层 feature store？",
        "模型/特征版本发布后如何让缓存既可命中又不返回不兼容的预测？"
      ],
      "answerPoints": [
        "按 key 合并请求，采用抖动 TTL、受限后台刷新和有界 stale-if-error；评估允许陈旧的时间窗。",
        "key 绑定模型/特征版本与必要上下文；衡量有效命中、失效成本和数据质量，不能以缓存命中率替代预测正确性。"
      ],
      "lessons": [
        "features",
        "capacity"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "zh-index-2",
      "title": "DoorDash 强制超时：一种可靠性方法",
      "url": "https://doordash.engineering/2018/12/21/enforce-timeout-a-doordash-reliability-methodology/",
      "evidenceUrl": "https://github.com/carlos19960601/awesome-scalability-zh/blob/0c1dc62f5d1005436e4049db288987f4c70c7917/README.md#L540",
      "date": "2018-12-21（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "中文",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Deadline",
        "gRPC",
        "过载保护"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Deadline / gRPC / 过载保护 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "每一跳都设置 100ms timeout，为何仍会造成超过总预算的无效计算？",
        "推理服务过载时，怎样选择重试、快速拒绝、取消和 fallback？"
      ],
      "answerPoints": [
        "传播同一总 deadline 的剩余时间，入队前检查可完成性；GPU kernel 未必能立即中断，但可取消排队与上游等待。",
        "限制 in-flight、队列与重试放大；退避/jitter 只用于可恢复错误，降级语义和 fallback rate 必须可观测。"
      ],
      "lessons": [
        "rpc",
        "serving"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "zh-index-3",
      "title": "实时预测在DoorDash",
      "url": "https://www.infoq.com/presentations/doordash-real-time-predictions",
      "evidenceUrl": "https://github.com/carlos19960601/awesome-scalability-zh/blob/0c1dc62f5d1005436e4049db288987f4c70c7917/README.md#L687",
      "date": "原文发表日期未核验",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "中文",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "Serving",
        "实时预测"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 Serving / 实时预测 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "在明确的流量和 p99 目标下，怎样设计在线特征读取、版本路由与 CPU/GPU 模型池？",
        "模型冷启动较慢时怎样应对突发？哪些降级可以保护用户体验？"
      ],
      "answerPoints": [
        "区分 requests/s、items/s、batch 和读放大；逐层 deadline、有界 admission、可追踪模型/特征版本。",
        "用代表性压测确定容量；结合 warm replicas、预测性扩容和租户隔离，保留温热回滚目标。"
      ],
      "lessons": [
        "serving",
        "design-serving",
        "autoscaling"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    },
    {
      "id": "eta-long-tail",
      "title": "Improving ETA Prediction Accuracy for Long-tail Events",
      "url": "https://doordash.engineering/2021/04/28/improving-eta-prediction-accuracy-for-long-tail-events/",
      "evidenceUrl": "https://github.com/khangich/machine-learning-interview/blob/968a286650c964f8583b73b3e0864475b86f22b6/appliedml.md#Doordash",
      "date": "2021-04-28（URL 路径日期，非面试日期）",
      "role": "DoorDash 工程案例索引 · 无候选人岗位/级别信息",
      "kind": "prep",
      "language": "English",
      "rounds": [
        "ML System Design",
        "ML Domain"
      ],
      "topics": [
        "ETA",
        "长尾",
        "评估"
      ],
      "summary": "已核对公开索引中的标题和原始链接。该条用于定位 ETA / 长尾 / 评估 相关阅读；原文正文尚未读到，以下练习仅按题材编写。",
      "reportedQuestions": [],
      "followups": [
        "设计 ETA 预测全链路：标签何时成熟，在线有哪些可用特征，如何避免未来信息泄漏？",
        "平均误差改善但长尾配送体验变差，怎样切片评估与保护上线质量？"
      ],
      "answerPoints": [
        "把 prediction time、实际送达时间和 label availability 分开；训练 join 只取预测时可见的历史特征。",
        "按区域、商家、时间与异常场景切片；对比均值、分位误差、校准和用户影响，再验证服务 p99 与降级。"
      ],
      "lessons": [
        "foundations",
        "design-serving",
        "observability"
      ],
      "caveat": "仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。",
      "provenance": "公开资料索引在所链接的具体提交/位置列出了此标题和 URL。历史文章日期不代表面试时间；同题材的重复链接已去重。"
    }
  ]
};
