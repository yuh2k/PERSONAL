# DoorDash ML 专项面经检索与资料整理

**本轮未核验到 ML 专项候选人面经，不能声称完成了全网面经搜集。** Google/Bing、Reddit、LeetCode、一亩三分地等入口被环境代理 CONNECT 403 拦截；公开 GitHub 文档和索引可读，后续 GitHub 精确搜索遇到 429 后停止。

已读 6 份官方技术文档，精选 17 条工程文章索引，整理 30 道不同的自行编写追问（关联到资料卡片共 42 条）。普通后端/算法题、其他公司经验和招聘广告均不计入 ML 面经。旧文章发布日期不代表面试发生时间。

网页入口：侧栏「面经资料库」，路由 #interviews。支持来源/方向/主题筛选、搜索、收藏、已读、笔记和进度导入导出；全部随离线包提供。

## 可追溯来源

### Elastic Pod CPU Auto-Scaler

已读原文 · 文档发表日期未标注

[原始链接](https://github.com/doordash-oss/elastic-cpu-pod-autoscaler) · [本次可见证据](https://raw.githubusercontent.com/doordash-oss/elastic-cpu-pod-autoscaler/main/README.md)

这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。

衍生练习（不是面经原题）：

- 模型服务不希望重启，CPU 突发时原地扩 CPU、HPA 和 warm replicas 如何取舍？ 回答要点：先判断 CPU throttling 还是模型/GPU/队列瓶颈。原地扩容受节点余量与 quota 约束；HPA 有模型加载/预热延迟；温热副本花成本换响应速度。衡量第一轮过载、p99、拒绝率与资源成本。
- 为什么 CPU request 增加后仍未改善 p99？ 回答要点：可能没有足够 node headroom、实际瓶颈并非 CPU，或线程池/模型队列/下游尾延迟没变。观察控制动作是否完成、throttling、queue 和 inference 分解。

### Agentic Orchestrator

已读原文 · 文档发表日期未标注

[原始链接](https://github.com/doordash-oss/agentic-orchestrator) · [本次可见证据](https://raw.githubusercontent.com/doordash-oss/agentic-orchestrator/main/README.md)

这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。

衍生练习（不是面经原题）：

- 设计一个帮助模型开发者自主实验的 agent 平台，如何避免不可复现结果和失控成本？ 回答要点：借鉴持久流程、版本化上下文、可恢复状态与验证门槛；再补实验特有的 dataset/model/eval 版本、预算、工具权限、隔离与审计。这是基于公开设计的延伸练习，非该项目已实现能力清单。

### DataQualityReport

已读原文 · 文档发表日期未标注

[原始链接](https://github.com/doordash-oss/DataQualityReport) · [本次可见证据](https://raw.githubusercontent.com/doordash-oss/DataQualityReport/main/README.md)

这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。

衍生练习（不是面经原题）：

- 离线实验中的 DataFrame 质量检查和生产特征监控分别解决什么问题？ 回答要点：前者快速发现样本、类型、缺失等问题；生产还需要连续 freshness/schema/缺失率监控、版本与时间语义、成熟标签和回滚。对同一错误保持可复现 golden cases。

### Triton Inference Server — Batchers

已读原文 · 文档发表日期未标注

[原始链接](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/batcher.md) · [本次可见证据](https://raw.githubusercontent.com/triton-inference-server/server/main/docs/user_guide/batcher.md)

这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。

衍生练习（不是面经原题）：

- max_queue_delay=5ms，为何请求仍排队 80ms？ 回答要点：区分为凑批而等待与实例忙碌造成的资源排队。检查到达率/服务率、pending、执行时间；再设置有界队列、deadline、拒绝与扩容。
- 是否应该给每个模型都设置 preferred_batch_size=[8,16,32]？ 回答要点：不能机械照抄。官方建议多数模型不设 preferred；先测 baseline，仅在特定批大小有明显性能收益（如 TensorRT optimization profile）时考虑设置。

### Triton Inference Server — Model Configuration

已读原文 · 文档发表日期未标注

[原始链接](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_configuration.md) · [本次可见证据](https://raw.githubusercontent.com/triton-inference-server/server/main/docs/user_guide/model_configuration.md)

这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。

衍生练习（不是面经原题）：

- 新模型容器进程健康，但第一批预测超时，发布系统应加什么 gate？ 回答要点：校验模型制品/输入合约，等待 model ready 与代表性 warm-up；保留旧模型温热副本，在性能和功能验证后进入 canary。

### Triton Inference Server — Metrics

已读原文 · 文档发表日期未标注

[原始链接](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/metrics.md) · [本次可见证据](https://raw.githubusercontent.com/triton-inference-server/server/main/docs/user_guide/metrics.md)

这是公开技术文档，不是候选人面经，不证明 DoorDash 本次会问这些问题。文档 main 分支可能更新，配置应与实际版本核对。

衍生练习（不是面经原题）：

- 监控显示每秒 1K request、8K inference、500 execution，平均 batch 是多少？能直接得到 p99 吗？ 回答要点：在对应窗口且排除缓存口径差异后，平均 batch=8000/500=16。这些 count 不能得出 p99；累计耗时/请求数至多给平均，需要延迟分布。

### How DoorDash is Scaling its Data Platform to Delight Customers and Meet Growing Demand

仅索引已读，原文待核验 · 2020-09-25（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2020/09/25/how-doordash-is-scaling-its-data-platform/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L65)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计实时特征流：事件重复、乱序、迟到、窗口边界和 Flink 重启分别如何处理？ 回答要点：定义 event_id、event_time、available_at、watermark 与允许迟到；明确 sink 是否支持事务或幂等。
- 在线写入与历史 backfill 并发时，怎样避免旧值覆盖新值以及恢复时翻倍计数？ 回答要点：用版本/时间条件 upsert、隔离回填命名空间和资源；以 golden cases、对账和端到端 freshness 验证。

### Introducing Fabricator: A Declarative Feature Engineering Framework

仅索引已读，原文待核验 · 2022-01-11（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2022/01/11/introducing-fabricator-a-declarative-feature-engineering-framework/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L70)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计声明式特征平台：怎样让同一份定义在离线训练和在线物化中保持语义一致？ 回答要点：定义 feature schema、owner、版本、数据源、时间语义和依赖 DAG；共享定义仍需 golden tests 与线上回放。
- 用户修改特征窗口或类型后，怎样验证影响范围、回填、推广并回退？ 回答要点：记录 lineage、运行预算、不可变输出和质量 gate；双版本迁移，避免模型仍依赖旧定义时直接覆盖。

### Building Scalable Real Time Event Processing with Kafka and Flink

仅索引已读，原文待核验 · 2022-08-02（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2022/08/02/building-scalable-real-time-event-processing-with-kafka-and-flink/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L76)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计实时特征流：事件重复、乱序、迟到、窗口边界和 Flink 重启分别如何处理？ 回答要点：定义 event_id、event_time、available_at、watermark 与允许迟到；明确 sink 是否支持事务或幂等。
- 在线写入与历史 backfill 并发时，怎样避免旧值覆盖新值以及恢复时翻倍计数？ 回答要点：用版本/时间条件 upsert、隔离回填命名空间和资源；以 golden cases、对账和端到端 freshness 验证。

### Building a Scalable ML Feature Store with Redis, Binary Serialization, and Compression

仅索引已读，原文待核验 · 2020-11-19（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2020/11/19/building-a-gigascale-ml-feature-store-with-redis/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L108)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计 online/offline Feature Store：实体键、TTL、批读和 point-in-time join 分别放在哪层？ 回答要点：先区分最新值随机读和历史训练 join；定义 schema、缺失与 freshness 契约，避免把 latest join 到过去样本。
- 特征库的内存和网络成本太高时，如何评估二进制编码、压缩和缓存对 p99 的影响？ 回答要点：量化 payload、网络往返和 CPU 解压成本；用真实 key 分布与热键压测，版本化编码并保留回滚兼容。

### Building Riviera: A Declarative Real-Time Feature Engineering Framework

仅索引已读，原文待核验 · 2021-03-04（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2021/03/04/building-a-declarative-real-time-feature-engineering-framework/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L112)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计声明式特征平台：怎样让同一份定义在离线训练和在线物化中保持语义一致？ 回答要点：定义 feature schema、owner、版本、数据源、时间语义和依赖 DAG；共享定义仍需 golden tests 与线上回放。
- 用户修改特征窗口或类型后，怎样验证影响范围、回填、推广并回退？ 回答要点：记录 lineage、运行预算、不可变输出和质量 gate；双版本迁移，避免模型仍依赖旧定义时直接覆盖。

### Retraining Machine Learning Models in the Wake of COVID-19

仅索引已读，原文待核验 · 2020-09-15（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2020/09/15/retraining-ml-models-covid-19/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L156)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 服务错误率正常，但模型效果下降：如何区分 skew、输入 drift、标签延迟与真正的 concept drift？ 回答要点：比较同一请求的训练/服务特征、模型/特征版本与发布事件；按 cohort 看缺失、新鲜度、预测分布和成熟标签。
- 怎样设计模型监控，使低流量模型和高流量模型都得到可靠告警？ 回答要点：不要把累计 duration 除以次数当 p99；结合延迟分布、超预算事件比例和多窗口错误预算，注明样本量与不确定性。

### Powering Search & Recommendations at DoorDash

仅索引已读，原文待核验 · 2017-07-06（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2017/07/06/powering-search-recommendations-at-doordash/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L263)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计商家推荐或搜索召回：离线 embedding、在线 query、ANN 索引和 rerank 如何串起来？ 回答要点：先量化 candidates/request 和 items/s；把召回与精排分层，分配端到端时间预算，区分 freshness、召回率和排序效果。
- 模型与向量索引更新怎样保证版本兼容？新用户、新商家和无召回结果怎样处理？ 回答要点：embedding 模型版本与索引 generation 绑定，构建验证后原子切换；保留旧索引、冷启动基线与 canary 护栏。

### Things Not Strings: Understanding Search Intent with Better Recall

仅索引已读，原文待核验 · 2020-12-15（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2020/12/15/understanding-search-intent-with-better-recall/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L300)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计商家推荐或搜索召回：离线 embedding、在线 query、ANN 索引和 rerank 如何串起来？ 回答要点：先量化 candidates/request 和 items/s；把召回与精排分层，分配端到端时间预算，区分 freshness、召回率和排序效果。
- 模型与向量索引更新怎样保证版本兼容？新用户、新商家和无召回结果怎样处理？ 回答要点：embedding 模型版本与索引 generation 绑定，构建验证后原子切换；保留旧索引、冷启动基线与 canary 护栏。

### Personalized Store Feed with Vector Embeddings

仅索引已读，原文待核验 · 2018-04-02（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2018/04/02/personalized-store-feed-with-vector-embeddings/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L329)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计商家推荐或搜索召回：离线 embedding、在线 query、ANN 索引和 rerank 如何串起来？ 回答要点：先量化 candidates/request 和 items/s；把召回与精排分层，分配端到端时间预算，区分 freshness、召回率和排序效果。
- 模型与向量索引更新怎样保证版本兼容？新用户、新商家和无召回结果怎样处理？ 回答要点：embedding 模型版本与索引 generation 绑定，构建验证后原子切换；保留旧索引、冷启动基线与 canary 护栏。

### Supporting Rapid Product Iteration with an Experimentation Analysis Platform

仅索引已读，原文待核验 · 2020-09-09（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2020/09/09/experimentation-analysis-platform-mvp/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L537)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- Shadow 和 Canary 能回答哪些不同问题？离线指标改善后还需要什么上线证据？ 回答要点：Shadow 查兼容、性能和预测分布，不直接证明用户收益；稳定分桶的 Canary/A-B 观测真实行为并保护服务指标。
- 配送/物流实验存在用户相互影响和延迟结果，怎样定义实验单位和停止条件？ 回答要点：澄清干扰与时间/地域相关性，和实验专家选择单位；预先定义指标、样本量、成熟窗口和护栏，不用短期噪声宣布胜负。

### Meet Dash-AB — The Statistics Engine of Experimentation at DoorDash

仅索引已读，原文待核验 · 2022-05-24（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2022/05/24/meet-dash-ab-the-statistics-engine-of-experimentation-at-doordash/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L557)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- Shadow 和 Canary 能回答哪些不同问题？离线指标改善后还需要什么上线证据？ 回答要点：Shadow 查兼容、性能和预测分布，不直接证明用户收益；稳定分桶的 Canary/A-B 观测真实行为并保护服务指标。
- 配送/物流实验存在用户相互影响和延迟结果，怎样定义实验单位和停止条件？ 回答要点：澄清干扰与时间/地域相关性，和实验专家选择单位；预先定义指标、样本量、成熟窗口和护栏，不用短期噪声宣布胜负。

### Building Flexible Ensemble ML Models with a Computational Graph

仅索引已读，原文待核验 · 2021-01-26（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2021/01/26/computational-graph-machine-learning-ensemble-model-support/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L596)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 多个模型组成计算图时，怎样传播 deadline、复用特征并控制 fan-out 的尾延迟？ 回答要点：区分可并行与有依赖的节点，沿关键路径分配剩余 budget；复用有版本的输入，限制队列和无界并发。
- 模型图的一条支路变慢或版本不兼容，平台应怎样检测、降级与回滚？ 回答要点：逐节点记录版本与 trace；fallback 必须业务可接受，不能随意丢掉关键模型输出；按图的兼容 manifest 回滚。

### Maintaining Machine Learning Model Accuracy Through Monitoring

仅索引已读，原文待核验 · 2021-05-20（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2021/05/20/monitor-machine-learning-model-drift/) · [本次可见证据](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md#L630)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 服务错误率正常，但模型效果下降：如何区分 skew、输入 drift、标签延迟与真正的 concept drift？ 回答要点：比较同一请求的训练/服务特征、模型/特征版本与发布事件；按 cohort 看缺失、新鲜度、预测分布和成熟标签。
- 怎样设计模型监控，使低流量模型和高流量模型都得到可靠告警？ 回答要点：不要把累计 duration 除以次数当 p99；结合延迟分布、超预算事件比例和多窗口错误预算，注明样本量与不确定性。

### DoorDash 避开 "缓存风暴"

仅索引已读，原文待核验 · 原文发表日期未核验

[原始链接](https://blog.doordash.com/avoiding-cache-stampede-at-doordash-55bbf596d94b) · [本次可见证据](https://github.com/carlos19960601/awesome-scalability-zh/blob/0c1dc62f5d1005436e4049db288987f4c70c7917/README.md#L143)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 热门商家特征缓存同时过期，怎样避免 cache stampede 冲垮底层 feature store？ 回答要点：按 key 合并请求，采用抖动 TTL、受限后台刷新和有界 stale-if-error；评估允许陈旧的时间窗。
- 模型/特征版本发布后如何让缓存既可命中又不返回不兼容的预测？ 回答要点：key 绑定模型/特征版本与必要上下文；衡量有效命中、失效成本和数据质量，不能以缓存命中率替代预测正确性。

### DoorDash 强制超时：一种可靠性方法

仅索引已读，原文待核验 · 2018-12-21（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2018/12/21/enforce-timeout-a-doordash-reliability-methodology/) · [本次可见证据](https://github.com/carlos19960601/awesome-scalability-zh/blob/0c1dc62f5d1005436e4049db288987f4c70c7917/README.md#L540)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 每一跳都设置 100ms timeout，为何仍会造成超过总预算的无效计算？ 回答要点：传播同一总 deadline 的剩余时间，入队前检查可完成性；GPU kernel 未必能立即中断，但可取消排队与上游等待。
- 推理服务过载时，怎样选择重试、快速拒绝、取消和 fallback？ 回答要点：限制 in-flight、队列与重试放大；退避/jitter 只用于可恢复错误，降级语义和 fallback rate 必须可观测。

### 实时预测在DoorDash

仅索引已读，原文待核验 · 原文发表日期未核验

[原始链接](https://www.infoq.com/presentations/doordash-real-time-predictions) · [本次可见证据](https://github.com/carlos19960601/awesome-scalability-zh/blob/0c1dc62f5d1005436e4049db288987f4c70c7917/README.md#L687)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 在明确的流量和 p99 目标下，怎样设计在线特征读取、版本路由与 CPU/GPU 模型池？ 回答要点：区分 requests/s、items/s、batch 和读放大；逐层 deadline、有界 admission、可追踪模型/特征版本。
- 模型冷启动较慢时怎样应对突发？哪些降级可以保护用户体验？ 回答要点：用代表性压测确定容量；结合 warm replicas、预测性扩容和租户隔离，保留温热回滚目标。

### Improving ETA Prediction Accuracy for Long-tail Events

仅索引已读，原文待核验 · 2021-04-28（URL 路径日期，非面试日期）

[原始链接](https://doordash.engineering/2021/04/28/improving-eta-prediction-accuracy-for-long-tail-events/) · [本次可见证据](https://github.com/khangich/machine-learning-interview/blob/968a286650c964f8583b73b3e0864475b86f22b6/appliedml.md#Doordash)

仅索引已读，原文未核验。不能视为已读文章摘要、当前内部架构或候选人实际考题。

衍生练习（不是面经原题）：

- 设计 ETA 预测全链路：标签何时成熟，在线有哪些可用特征，如何避免未来信息泄漏？ 回答要点：把 prediction time、实际送达时间和 label availability 分开；训练 join 只取预测时可见的历史特征。
- 平均误差改善但长尾配送体验变差，怎样切片评估与保护上线质量？ 回答要点：按区域、商家、时间与异常场景切片；对比均值、分位误差、校准和用户影响，再验证服务 p99 与降级。

## 检索覆盖与限制

本轮尚未核验到 DoorDash ML 专项候选人面经。主流搜索/面经站点被环境网络策略阻挡；公开 GitHub 文档与索引可读。已筛选工程背景和资料线索，未计入普通后端/算法面经、招聘广告及其他公司经验。索引日期不是面试日期，资料数量不是题目频率。下方列出实际查询词和受阻入口，可在自己的浏览器继续检索。

- [Google search](https://www.google.com/search?q=DoorDash+ML+infrastructure+interview+experience)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [Reddit search](https://www.reddit.com/search/?q=doordash%20machine%20learning%20interview)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [LeetCode Discuss](https://leetcode.com/discuss/interview-experience/?currentPage=1&orderBy=most_relevant&query=doordash)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [InterviewQuery guide](https://www.interviewquery.com/interview-guides/doordash-machine-learning-engineer)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [Glassdoor company interviews](https://www.glassdoor.com/Interview/DoorDash-Interview-Questions-E813073.htm)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [Medium search](https://medium.com/search?q=doordash%20machine%20learning%20interview)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [Blind search](https://www.teamblind.com/search/Doordash%20ML%20interview)：环境代理 CONNECT 403，未到达目标页面；不能确认有哪些面经。
- [一亩三分地](https://www.1point3acres.com/bbs/)：环境代理在到达网站前拒绝连接；未读取页面，不能判定网站有无相关帖子。
- [牛客](https://www.nowcoder.com/search/all?query=doordash)：环境代理在到达网站前拒绝连接；未读取页面，不能判定网站有无相关帖子。
- [Bing 搜索](https://www.bing.com/search?q=DoorDash+machine+learning+system+design+interview)：环境代理 CONNECT 403。
- [Triton Auto Tuner: Finding the Right Triton Configuration for Hundreds of Models](https://careersatdoordash.com/blog/triton-auto-tuner-finding-the-right-triton-configuration-for-hundreds-of-models/)：CONNECT 403，未读到原文
- [DoorDash Engineering Blog](https://careersatdoordash.com/blog/)：CONNECT 403，未读到原文
- [GitHub 后续精确检索](https://github.com/search?q=DoorDash+ML+interview&type=issues)：可读搜索后续遇到 HTTP 429，已停止重复请求；代码搜索需登录，未绕过。

完整可审计记录见 research-audit.json，其中另保留 33 条 DoorDash 文章索引和实际搜索词；未把全文不可读的条目冒充已读文章。
