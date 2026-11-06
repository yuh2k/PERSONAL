'use strict';
const SOURCES = [
  {id:'dd-triton', title:'Triton Auto Tuner: Finding the Right Triton Configuration for Hundreds of Models', org:'DoorDash Engineering', url:'https://careersatdoordash.com/blog/triton-auto-tuner-finding-the-right-triton-configuration-for-hundreds-of-models/', guide:'重点带着问题读：实例数、线程和 CPU 配置如何共同影响吞吐、p99 与成本？文章中的配置不能直接当作你的生产默认值。', type:'官方案例'},
  {id:'dd-blog', title:'DoorDash Engineering · AI / ML 工程文章', org:'DoorDash Engineering', url:'https://careersatdoordash.com/blog/', guide:'在官方博客中搜索 feature store、ML platform、inference。对比写入规模、特征新鲜度和读放大，记录文章发布时间。', type:'官方案例'},
  {id:'dd-serving', title:'Software Engineer, ML Serving Platform', org:'DoorDash Careers', url:'https://careersatdoordash.com/jobs/software-engineer-ml-serving-platform/8263726/', guide:'对照 inference、request routing、online feature retrieval 与 Kubernetes。招聘页面可能随岗位关闭而下线，面试范围以 recruiter 的 prep document 为准。', type:'岗位背景'},
  {id:'triton', title:'Triton Inference Server · User Guide', org:'NVIDIA', url:'https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html', guide:'阅读 model repository、model configuration、scheduler。先搞清 Triton 是可插拔模型后端的推理服务器，不是训练框架。', type:'技术文档'},
  {id:'batching', title:'Triton · Dynamic Batcher', org:'NVIDIA', url:'https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html', guide:'关注 max_queue_delay_microseconds、preferred_batch_size、queue policy；区分调度等待与总排队时间。', type:'技术文档'},
  {id:'feast', title:'Feast · Point-in-time joins', org:'Feast', url:'https://docs.feast.dev/getting-started/concepts/point-in-time-joins', guide:'逐行画出 entity timestamp、feature timestamp、TTL 的关系。不能把未来产生或后来补到的数据带入过去的预测。', type:'技术文档'},
  {id:'feast-home', title:'Feast · Feature Store concepts', org:'Feast', url:'https://docs.feast.dev/', guide:'区分 registry、offline store、online store、materialization；Feature Store 不会自动解决上游数据正确性。', type:'技术文档'},
  {id:'mlflow', title:'MLflow · Model Registry', org:'MLflow', url:'https://mlflow.org/docs/latest/ml/model-registry/', guide:'关注不可变版本、模型别名、lineage、权限与 deployment gate。别名可变，不应作为唯一审计标识。', type:'技术文档'},
  {id:'k8s', title:'Kubernetes · Horizontal Pod Autoscaling', org:'Kubernetes', url:'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/', guide:'理解控制回路、外部指标与稳定窗口。GPU 负载不能只看 CPU；模型冷启动使扩容不是瞬间完成。', type:'技术文档'},
  {id:'probes', title:'Kubernetes · Liveness, Readiness and Startup Probes', org:'Kubernetes', url:'https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/', guide:'区分活着、可接流量、启动完成。readiness 应包含模型加载和 warm-up，而非仅 HTTP 进程存活。', type:'技术文档'},
  {id:'grpc', title:'gRPC · Deadlines', org:'gRPC', url:'https://grpc.io/docs/guides/deadlines/', guide:'关注 deadline 传播与 cancellation。重试前先判断剩余 budget，避免对过期请求继续占 GPU。', type:'技术文档'},
  {id:'otel', title:'OpenTelemetry · Observability primer', org:'OpenTelemetry', url:'https://opentelemetry.io/docs/concepts/observability-primer/', guide:'把 metrics、logs、traces 与实际排障问题对应起来，避免给 user_id 做高基数指标标签。', type:'技术文档'},
  {id:'sre', title:'The Site Reliability Workbook · Implementing SLOs', org:'Google SRE', url:'https://sre.google/workbook/implementing-slos/', guide:'练习定义用户可感知 SLI、可用性和延迟 SLO、错误预算及多窗口告警；成功返回但预测不可用也可能是失败。', type:'技术文档'},
  {id:'ml-rules', title:'Rules of Machine Learning', org:'Google Developers', url:'https://developers.google.com/machine-learning/guides/rules-of-ml', guide:'重点看训练与服务偏差、简单基线、监控和数据质量；无需两周内学完模型数学推导。', type:'技术文档'},
  {id:'vllm', title:'vLLM · Documentation', org:'vLLM', url:'https://docs.vllm.ai/en/latest/', guide:'从 serving、continuous batching、KV cache、prefix caching 理解 LLM 推理，注意版本和硬件依赖。', type:'技术文档'},
  {id:'onnx', title:'ONNX Runtime · Performance tuning', org:'ONNX Runtime', url:'https://onnxruntime.ai/docs/performance/tune-performance/', guide:'了解线程池、图优化、execution provider。用实际模型、输入形状和并发压测验证，不能只比较孤立算子。', type:'技术文档'}
];

const LESSONS = [
{
id:'foundations', title:'补齐 ML 的最小知识闭环', phase:'基础搭桥', minutes:130, prereqs:[],
goal:'能用三分钟解释 feature → training → model → inference，并准确说清自己负责的平台边界。',
terms:'Feature 特征 · Label 标签 · Training 训练 · Inference 推理 · Embedding 向量表征',
sections:[
['先把模型看成带版本的计算函数','训练用历史样本的特征 X 与标签 y 调整参数 θ；推理是加载已经训练好的 θ，对新 X 执行 fθ(X)。例如配送 ETA 模型输入距离、商家历史备餐时间和实时供需，输出预计分钟数。平台工程师负责输入可靠、模型可加载、计算快、可回滚；不必声称自己设计了损失函数。\n\nFeature 是预测时能获得的输入；Label 是之后观察到的结果。点击预测的 label 可能要等曝光窗口结束才成熟。训练集必须按事件时间切分，避免把未来点击或未来商家统计泄漏到过去。'],
['你需要懂的模型指标','回归常用 MAE；二分类常用 precision、recall、AUC、log loss。AUC 衡量排序区分能力，不保证预测概率已校准，也不等价于业务转化率。离线指标通过只是上线门槛之一，线上需要 A/B 实验与业务护栏。\n\nEmbedding 是把离散对象编码成向量，可用向量距离做召回。推荐系统常分召回、粗排、精排；平台需要支持不同形状、延迟和资源成本，而不是把所有模型放进同一组 GPU。'],
['把后端经验迁移过来','把模型制品类比为不可变二进制发布包，把特征 schema 类比为 RPC 合约，把 batch inference 类比为吞吐优先的离线作业。差别是模型会因为数据变化而变差，即使代码和 CPU 都正常。\n\n先问清：谁提供特征、谁训练模型、谁选择评价指标、谁拥有线上结果。明确责任边界本身就是成熟的 ML Infra 判断。']],
lab:'画一个 ETA 预测闭环，标注每条数据的产生时刻。用 Python 写 predict(distance, prep_minutes) 的假模型，分别记录 model_version、feature_version、输出与耗时。最后解释：为什么“订单送达后才知道的实际时长”不能当作在线输入？',
quiz:[{q:'点击预测在曝光时使用“该曝光之后的点击数”作为输入，主要问题是什么？',options:['数据泄漏，使用了预测时不可获得的信息','模型参数太少','GPU 显存不足'],a:0,why:'特征在预测时必须可获得。未来点击只能成为成熟后的标签或未来样本的输入，不能回填当前样本。'},{q:'离线 AUC 提升是否足以直接全量发布？',options:['是，AUC 就是线上收入','否，还需兼容性、性能、在线实验和业务护栏','只要 CPU 正常就足够'],a:1,why:'离线改善不保证在线收益，数据分布、服务偏差和延迟都可能改变实际效果。'}],
english:'I have not owned model development, but I have built high-throughput data and serving systems. I would make the model and feature contracts explicit.',
interview:'如果模型在线效果突然下降，但错误率和 CPU 正常，你首先检查什么？',
hints:'先看数据新鲜度、缺失率、schema、训练服务一致性及模型版本，再看延迟成熟标签的效果；按用户/地区切片，比较发布前后与基线。',
resources:['ml-rules']
},
{
id:'lifecycle', title:'训练到上线：一条可追溯的生产流水线', phase:'基础搭桥', minutes:140, prereqs:['foundations'],
goal:'画出数据、训练、评估、注册、部署、监控的控制面与数据面，并说明每一步失败怎么恢复。',
terms:'Artifact 制品 · Lineage 血缘 · Reproducibility 可复现性 · Control plane 控制面',
sections:[
['把数据面与控制面分开','数据面处理线上特征读取和模型推理，追求稳定低延迟。控制面编排训练、登记模型、配置路由、推广版本。控制面短暂故障不应阻断正在提供服务的推理副本：副本持有最近一次验证过的配置和制品。\n\n完整链路是 events → validated dataset → training → evaluation → immutable artifact → registry → staged deployment → monitoring。每段都有版本与所有者，不是一条没有审计的脚本。'],
['复现不只是保存一个模型文件','记录 dataset snapshot、feature definition version、训练代码 commit、容器 digest、超参数、随机种子、依赖和评估结果。随机种子也不能保证不同 GPU 内核完全逐位一致，应明确可接受的数值容差。\n\n训练作业用稳定 run_id 做幂等输出，失败重试写到临时路径，完成校验后再原子发布 manifest。不要让服务发现读到只上传了一半的权重。'],
['发布门槛需要多层验证','先做 schema 与制品完整性校验，再做离线效果、分群公平性/业务约束、性能和兼容性验证。之后 shadow、canary、渐进流量与自动回滚。\n\n回滚不仅回滚模型：若新特征 schema 已破坏旧模型合约，旧模型也可能无法工作。用向后兼容的特征变更和一段双版本保留窗口，降低回退风险。']],
lab:'用 JSON 定义一个 model manifest：model_id、version、artifact_sha256、input_schema、feature_version、dataset_snapshot、image_digest、metrics。模拟制品上传中断，设计“校验完成才进入 READY”的状态机，列出三种重试的幂等键。',
quiz:[{q:'模型注册服务暂时不可用，已热身的推理服务应怎样？',options:['立即停止所有推理','继续用已验证的本地配置服务，暂停新发布','随机下载最新版'],a:1,why:'把控制面故障与数据面隔离；现有服务不应在每次请求中依赖 registry。'},{q:'保存随机种子是否足以完全复现训练？',options:['是','否，还需要数据、代码、依赖与硬件/数值约束','只需要模型名字'],a:1,why:'数据、算子、依赖、硬件和非确定性都可能改变结果；复现要求需要明确。'}],
english:'I would separate the control plane from the serving data plane, and make every deployment traceable to immutable artifacts and feature definitions.',
interview:'训练成功了，但模型上传到一半 worker 挂了，如何避免半成品上线？',
hints:'临时前缀 + manifest/hash 校验 + 原子 READY 状态；幂等 run_id；registry 只暴露已完成版本；清理孤儿制品。',
resources:['mlflow','triton']
},
{
id:'features', title:'Feature Store：把实时流处理经验变成优势', phase:'特征与数据', minutes:165, prereqs:['foundations','lifecycle'],
goal:'解释 online/offline store 的职责、物化链路、实体键和特征新鲜度，并设计低延迟读取。',
terms:'Entity 实体 · Materialization 物化 · Freshness 新鲜度 · TTL 生存时间',
sections:[
['同一份定义，两种访问模式','Offline store 存历史特征，支持大批量训练和 point-in-time join；Online store 通常按 entity key 读取最新可服务的值，优化毫秒级随机读。Registry 记录特征定义、owner、schema 与数据源，不等于保存所有特征值。\n\n不是所有特征都要进入特征库。请求上下文如当前位置可以直接传入；稳定商家画像可离线物化；实时 5 分钟订单量可由 Kafka/Flink 增量更新。按延迟、复用性、成本划边界。'],
['以 Kafka → Flink → Redis 为例','事件必须有 event_id、entity_id、event_time 和 ingestion_time。Flink 按事件时间做窗口聚合，用 watermark 处理乱序。写 Redis 时携带 feature_timestamp 和 definition_version，避免迟到旧数据覆盖较新的状态。\n\n端到端 exactly-once 取决于 source、checkpoint 和 sink 的事务/幂等能力，不能只因为使用 Flink 就宣称成立。常见可靠方案是 at-least-once 传输加幂等 upsert 与版本条件更新。'],
['线上读取的真实取舍','用 MGET/批量 RPC 减少往返，但要防止跨分片 fan-out 和热点 entity。给特征读取明确 deadline，缓存有界 TTL，记录 missing、stale、default 的比例与年龄分布。\n\n默认值能提高可用性，也可能严重改变预测分布。对高风险特征应拒绝或使用旧模型，对低风险特征可用训练时同样处理过的默认值。降级需要和模型方约定，不是随便填 0。']],
lab:'为 merchant_id 的最近 5 分钟订单量设计 Kafka → Flink → Redis 链路。造 8 条乱序、重复事件，手工计算窗口结果；写下 key、value、TTL、event-time/version CAS 策略，模拟重复投递并检查结果不会翻倍。',
quiz:[{q:'使用 Flink 是否自动意味着 Redis 中端到端 exactly-once？',options:['是，框架已经保证一切','否，要看 sink 的事务、幂等与恢复语义','只要开 100 个线程就可以'],a:1,why:'Flink 内部状态一致性不自动覆盖任意外部 sink，必须说明端到端交付和幂等语义。'},{q:'最新特征缺失时，直接填 0 一定安全吗？',options:['安全，0 是通用默认值','不安全，需要训练一致的缺失处理与业务降级策略','只需重新训练所有模型'],a:1,why:'0 可能是有效数值，会让模型无法区分缺失与真实 0，必须约定缺失语义。'}],
english:'I would define freshness and missing-value contracts per feature group, and use idempotent, version-aware writes to handle duplicate and late events.',
interview:'热门商家成为 Redis hot key，如何保护推理服务的 p99？',
hints:'批读与请求合并、短 TTL 本地缓存、热点复制/分片策略、限流；注意缓存带来的 freshness 与跨版本兼容，先量化读放大。',
resources:['feast-home','dd-blog']
},
{
id:'skew', title:'训练服务一致性与时间点正确性', phase:'特征与数据', minutes:155, prereqs:['features'],
goal:'用具体时间线区分 leakage、training-serving skew、data drift 与 concept drift。',
terms:'Point-in-time correctness 时间点正确性 · Leakage 泄漏 · Skew 偏差 · Drift 漂移',
sections:[
['时间点 join 的两条时间轴','一个训练样本的预测时刻为 t，只能用在 t 之前发生、并且按生产延迟在 t 时已可获得的特征。event_time ≤ t 是必要条件，但不总是充分：凌晨补到的昨天事件在线当时并不知道。\n\n例：12:00 预测，11:58 的订单到 12:05 才摄入。离线把它计入 12:00 聚合会比线上多一条。需要记录 available_at/ingestion_time，并明确历史重放是否模拟当时可见性。'],
['同样 schema 也会 skew','离线 Python 把空值填 -1，在线 Go 填 0；离线以本地时区截断日期，线上用 UTC；训练用 60 分钟窗口、线上用 5 分钟窗口。这些都可能导致 skew，类型校验无法识别。\n\n共享特征定义、golden examples、训练/服务一致性测试、少量线上特征日志回放可减少风险。日志必须采样、脱敏并有保留期限。'],
['不要把所有变化都叫 drift','Data drift 是输入分布 P(X) 变了，如节假日订单结构；Concept drift 是 P(y|X) 变了，如商家履约规律发生改变；Skew 是训练与服务路径存在不一致。它们可能同时发生，但处置不同。\n\n用分位数、缺失率、类别分布、PSI/KS 等做告警线索，不能把单一阈值当成模型失效证明。业务效果需要成熟标签与对照实验，按地区、设备、时间片检查，避免全局均值掩盖局部事故。']],
lab:'画出 12:00 预测、11:58 事件、12:05 摄入的双时间轴。为“过去 5 分钟订单数”写 5 个 golden test：乱序、重复、迟到、窗口边界、缺失。分别写出 leakage、skew、drift 的一个例子和对应缓解方法。',
quiz:[{q:'特征 event_time 早于预测时刻，就一定可安全用于历史训练吗？',options:['一定','不一定，需考虑当时是否已经可获得','只取决于 GPU 型号'],a:1,why:'事件虽已发生，可能在预测之后才摄入；历史重放需要考虑生产的可见性语义。'},{q:'训练填 -1、在线填 0，最直接属于哪类问题？',options:['Training-serving skew','仅仅是 concept drift','动态批处理'],a:0,why:'同一个输入经过不同处理，造成训练与服务特征不一致。'}],
english:'Point-in-time correctness means using only information that would have been available at prediction time, including realistic ingestion delays.',
interview:'离线验证很好，上线后效果下降：你怎样区分 skew 和 drift？',
hints:'对同一请求重放两条特征路径，比较值/版本/缺失；检查分群分布与发布变更；结合延迟标签，避免在标签未成熟时下结论。',
resources:['feast','ml-rules']
},
{
id:'serving', title:'在线推理服务：预算、合约与降级', phase:'推理平台', minutes:160, prereqs:['lifecycle','features'],
goal:'设计 40K QPS、p99 100ms 的假设推荐推理服务，并把延迟预算分解到每一段。',
terms:'Latency budget 延迟预算 · Warm-up 预热 · Fallback 降级 · Backpressure 背压',
sections:[
['先问需求，再画架构','40K QPS、p99 100ms 是练习假设，不是 DoorDash 真实内部指标。确认请求候选数、每次预测数量、特征读放大、模型体积、CPU/GPU、峰值倍率、可用性和成本，再定技术。\n\n一个推荐请求可能对 200 个候选打分，业务 QPS 不等于 inference items/s。40K×200 = 8M items/s，如果每请求 3 次特征 RPC，读流量又是另一种尺度。明确计量单位，才能谈容量。'],
['拆预算，不要机械相加分位数','示例预算：网关/网络 10ms、特征 25ms、排队 10ms、推理 35ms、序列化与余量 20ms。这个分配是目标预算，不是声称各段 p99 相加等于端到端 p99；相关性、并行 fan-out、尾部事件会影响实际分布。\n\n把剩余 deadline 逐层传播。请求过期后尽快取消特征查询与推理排队，限制 in-flight 和队列长度。不要用无限队列把流量尖峰变成延迟雪崩。'],
['稳态、冷态和故障态都要设计','Model loading 与 warm-up 完成前不接流量；readiness 检查真实模型可用。路由绑定 model_id/version，响应记录最终版本。支持旧稳定模型、缓存结果或简单基线 fallback，并明确哪些请求允许降级。\n\nCPU 小模型未必需要 GPU。先用真实形状与 batch 分布测量每副本吞吐、p99 与成本，在目标利用率下留冗余。部署故障时保持旧版本副本，避免同时卸载。']],
lab:'写一份 100ms budget 表，并为特征超时、模型未加载、队列满、请求取消各写一条行为。计算 40K requests/s×200 candidates 的 items/s，再用测得的“单副本 8K items/s，目标利用率 60%”估算基础副本数与冗余。',
quiz:[{q:'每段的 p99 加起来是否就是整体 p99？',options:['必然如此','不一定，要看联合分布、并行和相关性','只要都用 gRPC 就成立'],a:1,why:'分位数通常不可直接相加，预算分配需要用端到端压测和 tracing 验证。'},{q:'40K 请求/s，每请求 200 个候选，对应多少打分 items/s？',options:['40K','8M','200K'],a:1,why:'40,000×200=8,000,000。请求批大小是容量估算的核心输入。'}],
english:'I would clarify whether QPS counts requests or prediction items, then allocate an end-to-end latency budget and enforce bounded admission at every hop.',
interview:'流量翻倍时，你会先扩容还是先限制队列？',
hints:'先保护有界延迟和系统存活，观测排队/饱和；扩容有冷启动延迟，结合预留容量、优先级丢弃、降级与限流。',
resources:['grpc','sre','probes']
},
{
id:'triton', title:'Triton：模型仓库、调度器与实例组', phase:'推理平台', minutes:165, prereqs:['serving'],
goal:'读懂基本模型配置，解释 max_batch_size、instance_group、backend 与版本策略。',
terms:'Backend 模型后端 · Model repository 模型仓库 · Instance group 实例组 · Tensor 张量',
sections:[
['Triton 负责什么','Triton 是推理服务器，支持多个执行 backend，提供 HTTP/gRPC、模型生命周期和调度。ONNX Runtime、TensorRT、Python 等后端有不同的执行与硬件约束；并不是把任意 Python 函数丢进去就自动加速。\n\n典型模型仓库包含 model_name/config.pbtxt 和数字版本目录下的模型制品。配置声明输入输出名称、dtype、dims、batch 能力、实例与调度。客户端 schema 与模型 schema 不一致必须快速拒绝，不能默默 reshape。'],
['Batch 维度是契约','对于支持 batching 的模型，max_batch_size > 0 时，配置的 dims 通常不包含最前面的 batch 维，完整形状由 batch 与 dims 组合。模型本身必须真的支持该维度；把 max_batch_size 从 0 改为 32 不会神奇地改变模型图。\n\n输入形状、dtype、序列长度会影响能否拼 batch。不同形状的请求可能需要 padding 或分桶。需要考虑 padding 浪费和输出拆分，尤其多输入模型的 batch 维应一致。'],
['更多实例不总是更快','instance_group 决定实例数量和设备。CPU 模型实例内部可能还开线程池，实例数×线程数会争用有限 CPU，造成上下文切换和 p99 恶化。GPU 多实例也受显存、kernel 调度和带宽限制。\n\n固定硬件，扫描实例数、线程数、batch 与并发，记录吞吐、p99、内存和错误率。模型加载、预热、健康检查和版本路由也必须进入平台能力，不只 benchmark 一次 predict。']],
lab:'读官方 model configuration。写一个假想 ONNX 模型配置草稿：输入 FP32、每项 16 个特征、max_batch_size=16、一个 CPU 实例；列出必须通过实际模型校验的字段。无需本地 GPU；用本网站的批处理实验台感受吞吐与排队。',
quiz:[{q:'把 max_batch_size 设为 32 能让原本不支持 batch 的模型自动兼容吗？',options:['可以','不可以，模型图与输入输出也必须兼容','只要使用 HTTP 就可以'],a:1,why:'服务器配置声明能力，并不改写模型本身的维度与执行语义。'},{q:'增加 CPU model instance 后 p99 变差，可能原因是什么？',options:['实例与内部线程池过度订阅 CPU','CPU 越忙一定越快','模型 registry 需要加锁'],a:0,why:'实例并发和 backend 内部线程共同争用 CPU，需要联合调优。'}],
english:'I would tune model instances and backend thread pools together, because increasing concurrency can worsen tail latency through resource contention.',
interview:'如何区分 Triton 排队慢和模型计算慢？',
hints:'拆 request queue、input、infer、output 等耗时，结合 concurrency、utilization 和 batch distribution；校验指标语义和版本。',
resources:['triton','dd-triton','onnx']
},
{
id:'batching', title:'Dynamic batching：吞吐与尾延迟的边界', phase:'推理平台', minutes:170, prereqs:['triton'],
goal:'解释批处理何时有益、等待为何损害 p99，并设计可复现的调参实验。',
terms:'Dynamic batching 动态批处理 · Queue delay 排队延迟 · Head-of-line blocking 队头阻塞',
sections:[
['收益来自摊薄固定成本','假设每批耗时 S(b)=a+c×b，a 是固定启动开销，b 是 batch 大小；吞吐 b/S(b) 随 b 增加通常提升，但真实 GPU 的计算、带宽、显存和 kernel 行为可能非线性。批处理并非对所有模型都有好处。\n\n客户端 batching 一次请求带多项；动态 batching 则由服务端把兼容请求合成一批。需同时观测 requests/s、items/s 与 batch size histogram，否则“吞吐翻倍”可能只是计量单位换了。'],
['最大等待不是总排队上界','max_queue_delay 约束调度器为凑批愿意额外等待的时间；当实例繁忙或到达率超过服务率，总排队可能远大于这个值。必须同时配置有界队列、超时、拒绝策略与 deadline。\n\n低流量下凑大 batch 会白等；高流量下自然形成 batch，但饱和后队列会持续增长。不同模型或长短请求混排可能出现 head-of-line blocking，可以按模型/形状/优先级隔离。'],
['调优需要开放环负载','使用真实输入形状、稳定 warm-up、目标 QPS 梯度和短时突发。Closed-loop 客户端可能因为服务变慢而自动降压，出现 coordinated omission，低估尾延迟。开放环按到达计划发请求，记录拒绝和超时，避免只统计成功样本。\n\n扫描 batch cap、wait、instance count，先满足 SLO，再在可行解中优化成本。网站实验台是单实例、简化线性计算模型，不替代 Triton 性能验证。']],
lab:'打开“实验与训练”的批处理实验台，比较 100、800、1600 QPS；各测试 batch 1/8/16、wait 0/5/20ms。记录 p99、平均 batch、有效吞吐和排队。解释为什么高负载下把 wait 降为 0 也不保证低延迟。',
quiz:[{q:'max_queue_delay=5ms 是否意味着所有请求排队最多 5ms？',options:['是','否，实例饱和仍可能造成更长排队','只要 batch=32 就是'],a:1,why:'凑批等待与资源不可用造成的总队列等待不是同一件事。'},{q:'客户端在服务变慢后自动降低发压速率，可能造成什么？',options:['更准确测出生产突发','coordinated omission，低估尾延迟','自动消除所有超时'],a:1,why:'闭环负载把未产生的请求遗漏掉，可能隐藏服务饱和的后果。'}],
english:'I would optimize throughput subject to a p99 SLO, and measure queue time separately from compute time under an open-loop workload.',
interview:'batch size 翻倍后 GPU 利用率提升但 p99 超标，你会怎么办？',
hints:'先拆排队与执行；缩小 wait/cap、增实例或隔离形状，检查饱和与 admission；在可行 SLO 范围内选成本最优点。',
resources:['batching','dd-triton']
},
{
id:'autoscaling', title:'Kubernetes 扩缩容与冷启动', phase:'推理平台', minutes:150, prereqs:['serving','batching'],
goal:'设计包含模型加载与 warm-up 的扩缩容策略，说明 GPU 服务为何不能只按 CPU 扩容。',
terms:'HPA 水平扩缩容 · Readiness 就绪 · Stabilization window 稳定窗口 · Headroom 余量',
sections:[
['选能反映瓶颈的指标','CPU-bound 模型可看 CPU，但 GPU-bound 服务 CPU 低并不代表空闲。结合队列等待、pending requests、每实例 in-flight、GPU utilization、显存与可持续 items/s。p99 更像结果指标，直接控制时噪声与滞后都较大。\n\n指标要按模型或资源池隔离，别把空闲小模型与繁忙大模型平均掉。GPU 显存占用高可能只是权重常驻，并不等价于计算饱和。'],
['扩容链路有多段延迟','检测 → HPA → 调度 → 节点/GPU provisioning → 镜像拉取 → 权重下载 → 编译/加载 → warm-up → readiness。对需要几分钟预热的服务，仅靠事后反应无法承受秒级流量尖峰。\n\n结合 min replicas、预测性扩容、活动前预扩、模型缓存、预热池、限流和降级。不要在此刻反复重启尚未完成模型加载的进程；startup probe 给足真实启动时间。'],
['缩容与故障域','缩容前停止接新请求并 drain in-flight，支持 termination grace period 与客户端重试预算。缩容稳定窗口防止振荡，但不应掩盖持续成本浪费。\n\n按 zone 分散副本并演练失去一个 zone 的容量，考虑 PodDisruptionBudget 与滚动升级策略；PDB 不能阻止节点硬故障，也不能替代剩余容量。']],
lab:'以单副本安全吞吐 500 items/s、峰值 10K items/s、目标利用率 65% 计算副本。假设模型冷启动 90 秒、突发 10 秒翻倍，写出 HPA 单独为何不够，并设计 readiness 与 graceful drain 的检查清单。',
quiz:[{q:'GPU 服务 CPU 利用率只有 15%，是否就无需扩容？',options:['是','否，GPU/队列/服务率可能已经饱和','看进程数量就行'],a:1,why:'CPU 可能只做轻量调度，真正瓶颈在 GPU、带宽或排队。'},{q:'readiness 应在什么时候成功？',options:['进程有 PID 时','模型已加载、必要 warm-up 完成且能提供推理时','镜像刚开始拉取时'],a:1,why:'readiness 是是否可安全接流量的信号，不等于容器活着。'}],
english:'Because scale-out includes model download and warm-up, I would combine queue-aware scaling with warm capacity and explicit overload protection.',
interview:'扩容 10 个 GPU Pod 都 Pending，你怎么排障和止损？',
hints:'资源配额、GPU 型号/节点选择器、污点/容忍、节点供给、镜像与模型下载；同时保护数据面、降级和限流。',
resources:['k8s','probes']
},
{
id:'rpc', title:'gRPC、Deadline 与过载保护', phase:'可靠性', minutes:140, prereqs:['serving'],
goal:'能设计剩余预算传播、有界重试、幂等与取消，避免一次超时演变成重试风暴。',
terms:'Deadline 截止时间 · Retry budget 重试预算 · Jitter 抖动 · Load shedding 负载丢弃',
sections:[
['一次请求的预算贯穿全链路','客户端给总 deadline，网关扣去已耗时间后传播到 feature service 和 model server。后端不应该每跳重新获得完整 100ms，否则上游早已失败，下游仍继续占资源。\n\n如果推理服务器的底层 GPU kernel 不可中断，取消仍可清掉尚未执行的队列并让上游停止等待；不能声称所有 GPU 计算都会立刻停止。尽量在入队前判断是否还有足够执行预算。'],
['重试有成本，不是可靠性的免费午餐','只重试可恢复错误，限制次数和总时间，采用指数退避与 jitter。尊重服务端 overload 信号，别对所有 deadline exceeded 立即重试。请求虽然是读操作，重复推理仍会放大算力成本。\n\n幂等 key 需要和 model version、输入 hash、特征版本及业务语义绑定，避免把不同请求错当成同一个。Hedged request 可降低尾延迟，但会加重负载，只对少量有预算、可取消、未饱和的请求谨慎使用。'],
['隔离和背压比无限缓存更可靠','限制每租户和每模型 in-flight、队列与并发。高优先级在线请求与离线回填分池，避免训练/批预测挤占实时容量。队列满时快速拒绝或降级，并使客户端能区分 overload、invalid input 和 internal error。\n\ngRPC channel 复用减少连接开销，但 HTTP/2 并发流、连接均衡和长连接粘连仍需要观察。序列化与大型 tensor 的拷贝成本也应进入 profile。']],
lab:'用自己的 Go 经验写伪代码：context deadline → 特征并行读取 → model RPC。注明在哪些位置检查 ctx.Err()、在哪些错误重试、最大额外请求比例为多少。设计一个 100 请求突发下不会无限增长的并发闸门。',
quiz:[{q:'每一跳都重新给 100ms 超时，会有什么问题？',options:['预算可能被层层延长，浪费过期工作','一定更快','不影响上游'],a:0,why:'应传递剩余预算，否则上游结束后下游还会继续排队或计算。'},{q:'服务端过载时，无退避重试通常会怎样？',options:['自动增加 GPU 数量','放大负载，导致重试风暴','修复输入 schema'],a:1,why:'重试增加到达率，可能把尚可恢复的过载变成级联故障。'}],
english:'Retries consume capacity. I would propagate deadlines, bound retry amplification, and shed work that cannot finish within its remaining budget.',
interview:'如何保证降级响应不会被客户端误认为正常模型结果？',
hints:'响应记录 model_version、fallback reason 与质量标志；业务明确允许范围；监控 fallback rate，不能只看 HTTP 200。',
resources:['grpc','sre']
},
{
id:'deployment', title:'Model Registry、Canary 与安全回滚', phase:'可靠性', minutes:155, prereqs:['lifecycle','serving'],
goal:'设计可审计、可渐进发布、可自动回退的模型部署状态机。',
terms:'Registry 模型注册 · Shadow 影子流量 · Canary 金丝雀 · Rollback 回滚',
sections:[
['制品身份必须不可变','用模型版本、内容 hash、容器 digest、feature schema 和 lineage 组成部署身份。registry 别名可指向新版本，但路由配置和日志应记录解析后的不可变版本。服务启动要校验制品完整性，禁止加载来源不明的任意 pickle。\n\n控制面使用权限分层、审批/自动 gate、审计与签名/校验。多租户平台要考虑模型代码执行权限、secret 访问和网络隔离。'],
['Shadow 与 Canary 回答不同问题','Shadow 把线上输入复制给新模型但不影响用户响应，适合查 schema、性能、预测分布差异。它额外消耗资源，并可能触发敏感数据与副作用问题；必须隔离并清除写操作。\n\nCanary 把少量真实用户交给新模型，才能观察真实业务效果。用稳定 entity 分桶防止同一用户来回切换，逐步推广，并设置延迟、错误率、fallback、特征缺失和业务护栏。'],
['回退依赖已知好的整套组合','新模型与新特征同时发布时，保留旧模型及其特征兼容路径。用 expand-contract 演进 schema，先支持双版本再迁移。回滚必须有温热容量，不能等事故发生才开始下载旧权重。\n\n业务指标往往有延迟标签，无法每分钟自动判断。短期 gate 用服务健康和代理指标，长期用成熟标签与实验统计。不要把随机波动当回滚信号。']],
lab:'写出 REGISTERED → VALIDATED → SHADOW → CANARY → ACTIVE 的状态表，每条边标注 gate、操作者、超时与回退。模拟 canary p99 从 70ms 变为 140ms，列出两分钟内动作和事后证据。',
quiz:[{q:'Shadow 能否直接证明新模型提高用户转化？',options:['能，因为复制了真实请求','不能，它不改变用户结果，需要真实在线实验','能，只要 shadow QPS 足够高'],a:1,why:'影子结果未展示给用户，无法观察由新模型决策导致的真实行为变化。'},{q:'仅保留旧模型文件是否足以可靠回滚？',options:['足够','不一定，还需特征、schema、运行环境兼容与容量','只要文件名相同即可'],a:1,why:'部署是模型、特征和运行环境的组合，回退必须能实际服务。'}],
english:'I would canary an immutable model-and-feature contract, keep a warm rollback target, and distinguish fast service-health gates from delayed quality signals.',
interview:'如果 registry 的 production alias 被错误修改，你如何保证审计与恢复？',
hints:'路由解析并持久化不可变版本；审计事件、权限与 CAS 更新；回到已验证部署 manifest，不仅手改别名。',
resources:['mlflow','probes']
},
{
id:'observability', title:'监控：从 p99 到模型效果', phase:'可靠性', minutes:155, prereqs:['skew','deployment','rpc'],
goal:'建立服务、数据、模型、业务四层观测，并用 trace 定位尾延迟。',
terms:'SLI/SLO 服务指标/目标 · Cardinality 基数 · Data quality 数据质量 · Delayed labels 延迟标签',
sections:[
['四层信号不能互相替代','服务层：请求成功率、deadline miss、p50/p95/p99、queue、batch、饱和与 fallback。数据层：特征缺失、年龄、schema、异常值与分布。模型层：预测分布、版本、成熟标签上的效果与校准。业务层：转化、履约或用户体验护栏。\n\nCPU 绿色不代表预测正确；HTTP 200 但全部 fallback 也可能是用户可感知事故。明确什么算 good event，统计分母要包含超时、拒绝与降级。'],
['Trace 找路径，Metric 找范围','给 gateway → feature fetch → queue → inference → postprocess 建立 spans，关联 model_version、feature group、region、结果类型。trace 采样要保留错误和慢请求的诊断能力，注意采样偏差。\n\n指标标签用有界 model/version/region 等，避免 user_id、request_id 带来高基数。详细请求信息用受控日志与 trace，并做敏感数据脱敏和访问限制。'],
['告警要能行动','定义例如“99% 有效预测在 100ms 内”及 availability SLO；用错误预算 burn rate 与多窗口告警区分持续事故和短突发。p99 告警需要足够样本，低流量模型可以用超预算事件比例。\n\n标签延迟时，先用输入质量和服务指标止损；成熟标签到齐后按 cohort 评估效果。记录每次发布与特征变更，使相关性能够被验证，而不是仅凭同时发生认定因果。']],
lab:'画一个四行 dashboard，每行选 3 个指标并写出阈值、owner、runbook。为“p99 高但均值稳定”给出排查树：热点/大请求、特征 fan-out、排队、GC、冷模型、下游重试。',
quiz:[{q:'把 user_id 加到所有 Prometheus 指标标签会怎样？',options:['免费获得精确分析','可能造成高基数与存储/查询压力','能自动修复数据漂移'],a:1,why:'用户数量往往无界，指标时间序列爆炸，应使用有界标签和受控日志/trace。'},{q:'标签要两天后成熟，上线十分钟怎样监控？',options:['立即计算最终业务精度','先看服务/输入/预测分布代理指标，后补成熟标签评估','完全不监控'],a:1,why:'标签未成熟时不能伪造效果结论，必须区分代理信号和真实结果。'}],
english:'I would monitor serving health, feature quality, model quality, and business outcomes separately, with explicit handling of delayed labels.',
interview:'用户抱怨推荐失效，但所有 HTTP 都是 200，哪些 dashboard 可能揭示问题？',
hints:'fallback rate、缺失/陈旧特征、预测分布、版本命中率与切片质量；检查 SLI 是否错误地只定义为 HTTP 成功。',
resources:['otel','sre','ml-rules']
},
{
id:'capacity', title:'容量、成本与性能实验', phase:'性能与设计', minutes:150, prereqs:['batching','autoscaling','observability'],
goal:'从请求放大、实测吞吐与冗余推导容量，能解释成本优化为何受 SLO 约束。',
terms:'Little’s Law 利特尔法则 · Utilization 利用率 · Cost per 1M predictions 每百万预测成本',
sections:[
['容量先统一单位','40K requests/s×候选数=items/s，在线特征 fan-out、缓存命中率、batch 和 replica 都要用一致单位。假设单副本在目标 p99 下可持续 8K items/s、目标利用率 60%，8M items/s 的基础需求是 ceil(8M/(8K×0.6))=1667 副本；再单独算故障域与发布冗余。\n\n数字只是练习。若需要如此多副本，应挑战候选数、模型计算和架构分层，不能机械地堆硬件。召回/粗排/精排、缓存与共享特征可能更经济。'],
['平均并发不是 p99','稳态下 Little’s Law：L=λW，若完成速率 1000/s、平均系统内耗时 0.02s，平均 in-flight 约 20。这里是平均，不可把 W 换成 p99 就得到严谨的并发容量。\n\n负载接近饱和时排队通常快速增长。大请求、输入形状、共享 CPU、内存与网络会使尾部更差。单模型 microbenchmark 结果无法自动推广到多租户真实流量。'],
['实验应可复现且保护正确性','固定版本、硬件、输入分布、warm-up、发压模型、并发和测量窗口，报告成功、拒绝、超时、预测一致性与置信范围。缓存优化必须绑定模型/特征版本及 freshness，量化失效与命中偏差。\n\n优化 cost per million useful predictions：无效、过期或被 fallback 的预测不应被算成成功产出。量化、图优化与 GPU/CPU 切换都需要精度/质量门槛，不能只报告 TPS。']],
lab:'用表格比较 CPU 与 GPU：每小时成本、满足 p99 的 items/s、利用率、复制冗余、每百万有效预测成本。解释为何“GPU 利用率 95%”可能比 65% 更差；写下开放环 benchmark 的 8 个固定条件。',
quiz:[{q:'Little’s Law 中 W 应当是什么？',options:['平均系统内耗时','任意 p99','最大请求耗时'],a:0,why:'L=λW 是稳态平均量的关系，不是尾分位容量公式。'},{q:'优化推理成本时，首要约束之一是什么？',options:['只看最高 GPU 利用率','满足质量、可靠性与延迟 SLO','让 batch 尽可能无限大'],a:1,why:'便宜但超时或错误的预测不是有效产出，成本优化必须受正确性与 SLO 约束。'}],
english:'I would compare cost per million useful predictions at the required tail-latency SLO, rather than maximizing raw hardware utilization.',
interview:'如何证明一次量化优化值得上线？',
hints:'代表性精度与分群质量、性能/成本、兼容性与误差容差；shadow/canary；用相同输入和硬件测，保留回滚。',
resources:['dd-triton','onnx']
},
{
id:'design-serving', title:'系统设计 I：推荐模型 Serving Platform', phase:'性能与设计', minutes:180, prereqs:['serving','capacity','deployment'],
goal:'在 45 分钟内完成推荐推理平台设计，覆盖数据流、预算、故障与成本。',
terms:'Multi-tenancy 多租户 · Admission control 准入控制 · Routing 路由',
sections:[
['0–10 分钟：界定问题','先确认在线/离线、模型数量、请求与 item QPS、输入大小、p99、可用性、freshness、租户优先级、是否 GPU 和预算。明确假设后才做容量。建议拿 40K requests/s、200 candidates、100ms 练习，主动指出并非公司真实指标。\n\n回答要围绕用户路径和平台所有者：模型方提交什么，业务方调用什么，平台保证什么。不要用一页 Kubernetes 图跳过 API 和模型合约。'],
['10–30 分钟：数据面与控制面','数据面：Client → Gateway/auth/admission → Feature service/cache → model-version router → CPU/GPU pool → response；在每跳传播 deadline。离线数据经训练/评估产出模型，registry 与 deployment controller 控制路由，线上不依赖 registry 每次查配置。\n\n描述 predict API 的 model_id/version、entity/context、候选、deadline、trace；响应带 resolved_version、predictions、fallback reason。对多租户设置配额、队列与资源隔离。'],
['30–45 分钟：深挖两个取舍','选择 batching/p99 和 rollout/skew 深挖：用预算与压测确定 batch cap/wait，按形状隔离；以 immutable manifest、schema gate、shadow/canary 和温热旧版本回退。\n\n故障练习：Redis 尾延迟、模型加载失败、某模型流量暴涨、GPU 节点丢失。每种都说检测、止损、降级、恢复与验证。最后总结未解决假设与下一步实验。']],
lab:'去“实验与训练”选择推荐 Serving 设计，计时 45 分钟；前 5 分钟只写澄清问题。完成架构后逐项自评：容量、时间预算、在线/离线、版本、回滚、数据质量、扩容、成本。录一段 3 分钟英文总结。',
quiz:[{q:'设计开头最有价值的动作是什么？',options:['立刻选择 GPU 型号','澄清请求单位、SLO、输入/模型与数据新鲜度','先列出所有云产品'],a:1,why:'需求与负载形状决定架构，技术选型应在约束明确后进行。'},{q:'registry 是否应该成为每次预测的同步必经 RPC？',options:['是','通常不应，服务持有已验证的版本路由与制品','registry 可以替代 feature store'],a:1,why:'控制面与数据面解耦，避免注册服务故障扩大到所有预测请求。'}],
english:'Let me first clarify the request shape, freshness requirement, and p99 target. Then I will separate the serving path from model lifecycle management.',
interview:'面试官说成本要砍半但 p99 不变，你按什么顺序调查？',
hints:'测量成本分解与有效利用；候选分层、模型/输入优化、batch tune、缓存与资源池；每步验证质量与 SLO，拒绝无依据承诺。',
resources:['dd-triton','triton','sre']
},
{
id:'design-features', title:'系统设计 II：实时 Feature Platform', phase:'性能与设计', minutes:180, prereqs:['features','skew','observability'],
goal:'设计可重放、可回填、线上线下一致的特征平台，解释事件时间与可见性。',
terms:'Backfill 历史回填 · Watermark 水位线 · Deduplication 去重 · Schema evolution 模式演进',
sections:[
['先定义特征产品的接口','输入是带版本的事件与特征定义，输出是在线按 entity 获取特征、离线按时间点构造训练样本。写明 freshness SLO、读取 p99、特征数量、实体规模、吞吐和保留期。区分秒级实时特征和每日画像，不要强迫一条链路满足所有需求。\n\n平台需要 ownership、发现、schema、TTL、质量、访问控制和 lineage，而不只是“Redis 前面套服务”。'],
['双路径与统一语义','Kafka → Flink 做事件时间聚合，结果写 online store，同时保留原始事件/历史特征到对象存储或 lakehouse。离线训练用版本化定义与 point-in-time join，避免简单取 latest。\n\n去重范围、late event policy、watermark、窗口边界、时区与缺失处理都属于合约。实时与批回填共用语义或 golden tests，而不是仅仅代码语言相同。'],
['回填不要污染现网','历史 backfill 写入独立版本/命名空间，验证结果后再物化推广。在线写比较 feature timestamp/version，避免旧回填覆盖新实时值。隔离回填与在线资源，避免一次大作业吃光 Redis 带宽。\n\n故障恢复用 checkpoint 与可重放日志，但保留期必须覆盖最大恢复窗口。设计 schema expand-contract、坏数据隔离队列、端到端 freshness 指标和核对机制。']],
lab:'按每秒 200K 事件、1M entities、3 类特征做假设，画在线与离线双路径。模拟重复、晚到、Flink 重启和回填四种情况，每种写下数据正确性与对在线延迟的保护措施。',
quiz:[{q:'历史 backfill 最需要防止哪一种线上问题？',options:['旧值覆盖新实时值及资源争抢','文件名太长','使用版本号'],a:0,why:'回填应隔离版本并做时间/版本条件更新，也应隔离资源保护线上。'},{q:'训练集直接 join 每个实体最新特征是否合适？',options:['总是合适','历史样本通常需要时间点 join，latest 可能带入未来','只看 Redis 是否快速'],a:1,why:'历史训练样本必须模拟预测时可见的数据，latest 容易造成泄漏。'}],
english:'I would isolate backfills from the online path and preserve event-time, availability-time, and feature-version semantics across both stores.',
interview:'如何验证 offline 与 online 特征一致，又不记录所有用户原始数据？',
hints:'采样脱敏 golden cases、hash/统计对账、受控回放、版本/时间分桶；有明确保留和权限，注意聚合统计也有局限。',
resources:['feast','feast-home','dd-blog']
},
{
id:'llm', title:'LLM Inference：Prefill、Decode 与 KV Cache', phase:'扩展与实战', minutes:165, prereqs:['batching','capacity'],
goal:'解释 LLM serving 与普通预测的差异，并计算 KV cache 的近似显存需求。',
terms:'Prefill 提示词处理 · Decode 逐 token 生成 · TTFT 首 token 时间 · TPOT 每输出 token 时间',
sections:[
['一次请求不是一次固定时长计算','Prefill 并行处理输入 token，通常计算密集；decode 逐步生成，每步依赖前一个 token，常受内存带宽与 KV cache 访问约束，具体瓶颈取决于模型/硬件/批大小。长输入与长输出有不同的成本。\n\nTTFT 衡量用户多久看到第一个 token，TPOT/ITL 衡量之后的生成节奏；端到端 latency 还受输出长度影响。不能只报 tokens/s 而忽略 TTFT、并发与成功率。'],
['Continuous batching 与分页 KV','普通动态批处理常整批执行后结束，LLM 请求生成长度不同，continuous batching 可在迭代边界加入新请求、移出完成请求，提高资源利用。长短请求、prefill 与 decode 混合需要调度与公平性。\n\nKV cache 保存每层过去 token 的 key/value，避免重复计算。简化公式 bytes ≈ 2×layers×KV_heads×head_dim×bytes_per_element×cached_tokens。GQA 的 KV heads 少于 query heads，应使用 KV heads；还需额外考虑权重、碎片、workspace 与并行切分。'],
['缓存、量化与可靠性边界','Prefix caching 复用共享前缀，但命中受模板/版本/租户隔离影响；不能跨用户泄漏私人上下文。量化减少权重或 KV 开销但可能影响质量，需评估精度、硬件支持与实际内核。\n\n限制 input/output token、并发与 token budget，避免长请求挤占所有显存。流式取消要释放 KV 与队列资源。实践里可讨论 vLLM、Triton/TensorRT-LLM，但要说明未实际运维过的边界。']],
lab:'用实验台 KV 计算器验证：32 layers、8 KV heads、128 head dim、FP16、总缓存 32768 tokens，KV 约 4 GiB。再把 KV heads 改为 32。画出 prefill/decode 与连续批处理时间线，解释为何只限制 requests/s 不够。',
quiz:[{q:'KV cache 估算应该用哪一个 head 数？',options:['总是 query heads','模型实际的 KV heads，GQA 下可能更少','固定为 1'],a:1,why:'KV cache 存储 key/value，使用实际 KV heads；GQA/MQA 会改变其大小。'},{q:'用户看到第一个 token 慢，优先看什么指标？',options:['TTFT 与 prefill/queue 分解','只看最终输出长度','只看进程 uptime'],a:0,why:'首 token 延迟包含等待与 prefill，需要和 decode 速度区分。'}],
english:'For LLM serving I would track TTFT and inter-token latency separately, budget KV memory, and use token-aware admission rather than request count alone.',
interview:'大量长 prompt 到来导致短请求 TTFT 变差，你怎么做？',
hints:'token-aware admission、输入长度分桶、prefill/decode 调度、chunked prefill（实现依赖）、独立资源池；评估吞吐/公平性权衡。',
resources:['vllm','triton']
},
{
id:'developer-platform', title:'ML Developer Infrastructure 与训练编排', phase:'扩展与实战', minutes:150, prereqs:['lifecycle','deployment','observability'],
goal:'设计让模型开发者自助实验、可靠训练和安全发布的平台接口，兼顾 agent/evaluation。',
terms:'Experiment tracking 实验追踪 · Orchestration 编排 · Checkpoint 检查点 · Evaluation 评估',
sections:[
['平台价值是缩短可信反馈循环','ML Developer Infra 让开发者从数据验证、实验、训练、评估到发布自助完成，同时有配额、可追踪性和 guardrails。衡量 time-to-first-experiment、可复现率、失败恢复时间、实验成本与开发者体验，不只看集群利用率。\n\n提供最小 golden path：版本化输入 → job spec → 分配资源 → checkpoints/logs → metrics/artifacts → evaluation gate → registry。保留逃生口，但别为每个团队定制一套不可维护流程。'],
['训练失败与资源调度','区分可重试基础设施故障和不可重试的数据/代码错误。checkpoint 记录完整恢复状态，写入先临时后原子提交。重试有上限且有预算，避免错误数据使上千 GPU 无限重跑。\n\n分布式训练要考虑 gang scheduling、资源配额、GPU topology、抢占恢复和数据供给。无需两周内掌握全部训练算法，但应能解释作业控制与数据吞吐瓶颈。'],
['Agent 不会免除工程责任','如果让 agent 改特征或跑实验，要约束可用工具、数据权限、预算、审批与审计。基于固定、版本化 eval set 加 adversarial cases 比只看一次漂亮 demo 更可信。\n\n区分任务成功、工具错误、环境错误与质量回归；保存 prompt/tool/model/eval 版本，防止训练/评估泄漏。生产数据和凭证不能随便交给外部模型。']],
lab:'写一页 submit-training-job API：dataset snapshot、code/image digest、resources、checkpoint policy、budget、owner。模拟节点被抢占与数据 schema 错误，分别设计 retry 行为。为 coding agent 列出 5 条不能越过的工具权限边界。',
quiz:[{q:'训练出现确定性的 schema 错误，最好怎么做？',options:['无限重试直到成功','尽早失败、给可行动诊断，阻止昂贵空转','增加 GPU 数量'],a:1,why:'确定性输入错误不应靠基础设施重试解决，需要用户修正数据或代码。'},{q:'Agent 自动完成一次实验，就能说明平台可靠？',options:['能','不能，需要可复现评估、预算、权限和审计','只需展示截图'],a:1,why:'单次 demo 无法覆盖回归、越权、数据泄漏与成本失控。'}],
english:'I would optimize the developer feedback loop with reproducible jobs, actionable failures, versioned evaluations, and explicit resource budgets.',
interview:'你没有训练平台经验，如何诚实说明与这个团队的匹配？',
hints:'说明已有编排/流处理/可靠性/观测能力，明确未拥有的模型部分；给出可迁移设计与验证计划，不虚构生产经验。',
resources:['mlflow','k8s','otel']
},
{
id:'coding-one', title:'AI Coding I：实现可靠的微批调度器', phase:'扩展与实战', minutes:150, prereqs:['batching','rpc'],
goal:'用自己的 IDE/Agent 在 60 分钟内实现并测试微批处理，能解释边界与 AI 产出的取舍。',
terms:'Acceptance criteria 验收标准 · Bounded queue 有界队列 · Cancellation 取消 · Test oracle 测试判据',
sections:[
['0–10 分钟先读题和现有代码','先跑 baseline，再澄清同步/异步、最大 batch、最大等待、队列容量、返回顺序、错误传播与关闭行为。把可验收行为写出来，让 agent 先定位入口和测试而不是直接重写项目。\n\n推荐练习使用随站提供的 Python stdlib 实验包；你也可以用 Go 重做。题目是模拟工程任务，不是 DoorDash 真实面试题。'],
['10–45 分钟小步实现与验证','让 AI 先给最小修改计划，然后分步做 bounded admission、批量 drain、deadline/取消、结果映射。每步运行测试，检查 race、重复完成、取消后资源释放、worker 异常和 shutdown。\n\n不要把 sleep 当作精确时钟的测试判据。可注入时钟或使用事件同步，避免随机 flaky。AI 生成“看起来合理”的测试可能镜像实现错误，手写独立 oracle 与边界案例。'],
['45–60 分钟解释与收尾','保留工程判断的声音：为什么不引入依赖、为什么队列有界、为什么只对明确错误重试。读 diff 检查越界改动，说明仍有哪些性能、持久性或公平性限制。\n\n工具原理可以解释为上下文构建、模型生成候选、工具执行、反馈修正；agent 并不天然知道仓库真相，也可能编造 API。测试与可观察结果比生成代码的自信语气可信。']],
lab:'下载“Python 实战包”，先跑 python3 -m unittest discover -s starter -v，观察未实现项失败。60 分钟内完成 starter/batcher.py 的 plan_batches；满足容量、FIFO、最大凑批等待与非负时间约束。完成后与 reference 对照，再提出真实在线实现还缺什么。',
quiz:[{q:'Agent 一次性重写整个仓库后测试全绿，你应怎么办？',options:['直接提交','检查 diff 范围、测试有效性和需求边界','删除测试提升速度'],a:1,why:'AI 的大范围修改和自证测试可能掩盖回归，工程师必须审查实际行为。'},{q:'面试中使用 AI 最该持续说明什么？',options:['只念 prompt','做什么、为什么、如何验证以及哪些建议没采纳','只说 AI 很强'],a:1,why:'Recruiter 强调速度与工程判断，必须让面试官看到自己的决策过程。'}],
english:'I will ask the agent for a small change, then verify the behavior independently. I am keeping admission bounded so overload does not become unbounded latency.',
interview:'AI 给出一个没有队列上限的方案，你如何当场指出并修正？',
hints:'解释内存与尾延迟风险，设最大队列/拒绝策略，补超载测试，再讨论优先级与公平性扩展。',
resources:['batching','grpc']
},
{
id:'coding-two', title:'AI Coding II：调试特征一致性与上线回归', phase:'扩展与实战', minutes:150, prereqs:['coding-one','skew','deployment'],
goal:'在受限时间内定位数据时间错误，补独立回归测试，并清晰解释修复范围。',
terms:'Root cause 根因 · Regression test 回归测试 · Invariant 不变量 · Diff review 变更审查',
sections:[
['把问题转成可复现输入','现象是 offline metric 好、线上转化跌，不要先改模型。构造一个预测时刻和一组包含未来、迟到、重复事件的特征记录，手工写出期望值。这样根因检查有独立判据，不会被 agent 的解释带跑。\n\n先画数据流、追踪调用者，再决定在公共特征选择逻辑修复，而不是在每个 API 末端打补丁。'],
['可用性时间与事件时间一起检查','实验包的 latest_available(entity, prediction_time, rows) 需要选择 event_time≤t 且 available_at≤t 的最新有效记录；相同 event_time 用确定性的版本规则。缺失时返回 None，而不是偷偷取未来数据。\n\n这是简化的时间点可见性练习，不等于完整生产 feature join。真实系统还要按特征定义处理 TTL、纠正、删除、数据隐私和重放语义。'],
['AI 协作的质量在审查','让 agent 解释它改了哪些不变量，再用自己写的反例攻击。确认未删测试、未放宽 assertion、未伪造预期结果，检查错误和边界没有被 catch-all 吞掉。\n\n最后汇报触发条件、根因、修改位置、通过的证据与局限。面试时比“AI 帮我写完了”更有说服力的是“我用这个反例证明了根因，并验证修复”。']],
lab:'继续实战包的 starter/features.py。先运行 tests，画出迟到事件反例；实现 point-in-time 可见性，再添加你自己的同时间戳版本测试。设 60 分钟，最后用英文做 90 秒根因说明。参考实现只在自己完成后查看。',
quiz:[{q:'修复前最好先做什么？',options:['随机改缓存 TTL','构造最小反例与独立期望结果','删掉失败的测试'],a:1,why:'可复现输入和独立判据能区分根因、表象和 AI 的错误假设。'},{q:'给历史样本选择特征时，仅按 event_time 排序够吗？',options:['够','不够，还需可见性时间、版本及约定的有效性规则','只看输入顺序'],a:1,why:'迟到、纠正与版本会改变当时可见的记录集合，不能用未来获知的信息。'}],
english:'I reproduced the failure with a minimal late-arrival case. The fix enforces availability at prediction time, and the regression test is independent of the implementation.',
interview:'如果 agent 建议把失败 assertion 改成当前输出，你怎么判断？',
hints:'以需求与独立手算 oracle 为准；只有确认需求错误才改测试，并解释原因，不能为绿而绿。',
resources:['feast','ml-rules']
},
{
id:'behavioral', title:'Behavioral：把真实工程故事讲得具体', phase:'模拟与收束', minutes:160, prereqs:['foundations'],
goal:'完成 failure、feedback、initiative、ambiguity 四张 STAR 故事卡，说明自己做了什么及学到了什么。',
terms:'STAR 情境/任务/行动/结果 · Ownership 主人翁意识 · Reflection 反思',
sections:[
['四个故事，四种判断信号','Failure：你自己的判断哪里错了，如何止损、复盘和系统改进。Feedback：最初为什么不认同，如何听懂、验证并改变行为。Initiative：没有人要求时为何主动做，如何获得支持并控制范围。Ambiguity：需求不完整时如何定义成功、验证假设与协调分歧。\n\n可以用高并发平台、Kafka/Flink、Redis 热点、K8s 发布与跨团队经历，不需要硬编一个模型训练故事。'],
['STAR 的重点是 Action 和反思','Situation 20 秒、Task 20 秒、Action 60–90 秒、Result 20–30 秒、Reflection 20 秒。把团队的结果和你个人的行动分开，说清你查了什么、改变了什么、如何沟通、拒绝了什么方案。\n\n数字必须来自你的真实经验，无法确认时用范围或定性结果。40K+ QPS 只能在你确实做过的系统范围内讲，不能迁移为未做过的 ML serving 实绩。'],
['给出成长而不是完美人设','好 failure 有具体错误、后果、承担、修复和后续机制；不要把“我太努力”包装成失败。讲 tough feedback 时避免贬低同事，说明你如何改变可观察行为以及后续反馈。\n\n面对“为什么 ML Infra / DoorDash”，连接实时系统经验、模型生产架构的工程挑战和想补齐的知识；参考公开文章提出具体问题，别把团队内部架构猜测说成事实。']],
lab:'在“实验与训练”的 STAR 工作台分别写四类故事，每个至少一句个人 Action、一条真实 Result 和一个 Reflection。录音两分钟，检查是否全是“我们”，是否有自己做的决定。导出进度同时备份故事。',
quiz:[{q:'没有做过模型训练时，应该如何描述相关经历？',options:['把团队做过的模型说成自己训练','明确自己负责的数据/基础设施与模型团队边界','完全不谈工程经验'],a:1,why:'诚实边界与可迁移能力比虚构直接经验更可信，也能避免无法回答的追问。'},{q:'Failure 故事最该包含什么？',options:['证明都是别人导致','自己的判断、影响、修复与长期学习','只有一个成功结果'],a:1,why:'面试官关注承担、反思与行为改变，不是一个伪装成失败的功劳故事。'}],
english:'My responsibility was the infrastructure path, not the model architecture. The mistake I made was ___. I changed ___, and the evidence was ___.',
interview:'Tell me about a time you received tough feedback.',
hints:'真实具体反馈 → 初始反应 → 澄清/证据 → 行为改变 → 之后的反馈；不要借机批评反馈者。',
resources:['dd-serving','dd-blog']
},
{
id:'mock', title:'四轮模拟：让知识变成可表达的判断', phase:'模拟与收束', minutes:210, prereqs:['design-serving','design-features','coding-two','behavioral'],
goal:'完成四轮分时模拟，按遗漏点复习，而不是再读一遍所有材料。',
terms:'Mock interview 模拟面试 · Rubric 评分维度 · Trade-off 取舍',
sections:[
['按真实时长练习，但可以分天','AI Coding 60 分钟：读现有代码、澄清、实现、测试、解释。Domain 60 分钟：连续追问 batching、skew、autoscaling、回滚、观测。System Design 60 分钟：5 分钟澄清、10 分钟高层、25 分钟深挖、10 分钟故障与成本、10 分钟总结/问题。Behavioral 60 分钟：四类故事加追问。\n\n本日建议先做 3.5 小时的分段练习；完整四小时模拟可拆到今天和次日。计时器只管理练习时间，不代表系统能自动评判口头回答。'],
['自评比自我感觉更有用','每题从正确性、需求澄清、生产故障、量化与沟通各给 0–2 分。低分必须写证据，例如“把 max_queue_delay 当作总排队上限”，不是“感觉还行”。网站题库能揭示提示，但不自动宣称你已掌握。\n\n把答错的选择题加入错题本，把答不完整的开放题加入复习清单。用无提示复述，而不是马上重读答案后的熟悉感判断掌握。'],
['带着取舍回答追问','回答结构：目标 → 假设 → 两个可选方案 → 选一个并说原因 → 指标和故障验证。面对不知道的内容，说明边界和验证计划，别伪造在 Triton/GPU 上的生产经验。\n\n如果说出“depends”，立即补上到底取决于什么：输入形状、到达率、模型、资源和 SLO。能落到验证实验比背架构名词更有分量。']],
lab:'用网站模拟题随机抽题并启动 60 分钟计时，完成后记录三条最弱环节。分别录一段 90 秒英文解释 batching、skew 与 rollout；对照答案提示检查遗漏，再设明日复习。',
quiz:[{q:'开放题自评最可信的方式是什么？',options:['读完提示后觉得熟悉','无提示作答并按维度记下具体缺口','只统计刷题数量'],a:1,why:'熟悉感不等于可提取与可表达的能力，需独立回答和具体评分证据。'},{q:'遇到没运维过的 GPU 机制，应如何回答？',options:['虚构生产经验','说明边界，给出原理理解与验证方法','回避所有性能话题'],a:1,why:'成熟工程判断包含诚实范围与可验证的推理。'}],
english:'The choice depends on arrival rate, input shape, and the latency SLO. I would test both configurations under a representative workload before committing.',
interview:'设计题被追问“这个方案哪里会先失败”，如何回答？',
hints:'从容量和最稀缺资源定位；说清可观测信号、保护与恢复；承认单点/假设，避免声称系统没有弱点。',
resources:['dd-triton','sre']
},
{
id:'review', title:'最后收束：补短板与面试当天清单', phase:'模拟与收束', minutes:120, prereqs:['mock'],
goal:'完成错题回测、架构复述、设备检查与真实自我介绍，停止无边界补课。',
terms:'Readiness 就绪度 · Evidence 证据 · Scope 边界',
sections:[
['先复习错误，再补充新知识','打开错题和待复习列表，遮住提示重新回答。重点解释 training-serving skew、point-in-time、Triton instance/batch、p99、deadline、模型回滚与数据质量。能用例子解释并说明取舍，才标记掌握。\n\n14 天冲刺下不再扩展训练数学和所有模型算法。若目标团队最终偏 Developer Infra，把训练编排、eval、agent guardrails 放入最后补充；若偏 Serving，优先批处理、容量与低延迟。'],
['两张图与四个故事','不看资料画出推荐 serving 和 feature platform 两张图，给出容量、时间预算、控制/数据面、失败模式与回滚。准备四个 STAR 故事的 2 分钟和 5 分钟版本；保留真实结果与个人责任边界。\n\n准备反问：平台最紧迫的性能/开发体验问题是什么？如何定义模型方与平台方责任？发布与质量回归由谁 owning？新成员前 90 天成功标准是什么？这些问题比猜测内部架构更有用。'],
['设备与协作习惯也要演练','确认 recruiter 的最新 prep document、面试时间/时区、可用 IDE/Agent 与账户、网络、屏幕共享、终端字体、测试命令和备用连接。不要在当天升级整个开发环境。面试中隐藏凭证与私人通知。\n\n开场简洁说明工程背景与 ML Infra 动机；coding 持续讲 what/why/validation，design 先澄清，behavioral 先给结论再讲故事。备考进度只是投入记录，不是通过概率。']],
lab:'重新做所有错题，导出进度 JSON；离线刷新检查网站能用。画两张图并录英文自我介绍。把 recruiter prep document 与最终日程逐项核对，列出仍需问 recruiter 的具体问题。',
quiz:[{q:'网站进度 100% 是否代表面试必过？',options:['代表','不代表，进度只记录学习投入与自评','只要读完英文句子就可以'],a:1,why:'实际结果依赖知识深度、表达、题目与面试判断，不能从打卡推导通过率。'},{q:'面试当天最合理的工具策略是什么？',options:['临时升级所有工具','使用演练过的 IDE/Agent，验证账户与测试命令','让 Agent 静默做完不解释'],a:1,why:'稳定熟悉的工具和明确的协作表达能减少无关失败。'}],
english:'My strength is building reliable, low-latency distributed systems. I am translating that experience into model-serving and feature infrastructure, with clear ownership boundaries.',
interview:'Why DoorDash, and why ML Infrastructure?',
hints:'连接真实工程背景与 serving/feature/开发平台问题；引用读过的公开材料，说明想解决的具体挑战与学习动机，避免泛泛夸公司。',
resources:['dd-serving','dd-blog']
}
];

const SCHEDULE_14 = [[0],[1,2],[3],[4],[5,6],[7,8],[9,10],[11],[12],[13],[14,15],[16,17],[18,19],[20]];
const DESIGNS = [
 {id:'serving',title:'推荐模型 Serving Platform',brief:'假设 40K requests/s，每次 200 candidates，目标 p99 100ms。支持多模型、多租户、CPU/GPU、canary 和快速回滚。',questions:['QPS 的单位是请求还是打分项？峰值倍率？','模型和特征维度、freshness、是否允许 fallback？','SLO、成本上限、租户隔离和故障域是什么？'],online:['Client / Gateway','Feature Service + Cache','Version Router','CPU / GPU Model Pools','Prediction + Telemetry'],offline:['Events → Lake / Feature Pipeline','Dataset → Train → Evaluate','Immutable Artifact → Registry','Deployment Controller → Routing'],tradeoffs:['动态 batching 提高吞吐，但需要以 p99 约束等待与 cap。','强隔离成本较高，共享池需要配额、有界队列和 noisy-neighbor 保护。','Shadow 检验兼容/分布；Canary 才能观测真实用户效果。'],failure:'Redis p99 变高时按剩余 deadline 降级、使用训练一致的默认/缓存策略；隔离特征组，监控 fallback。模型加载失败不进入 readiness，保留旧版本温热副本。',rubric:['量化 requests 与 items/s','逐段 latency budget 和 deadline','线上线下与控制/数据面分离','模型/特征版本与安全回滚','过载、故障域与多租户隔离','数据质量/服务/业务监控']},
 {id:'features',title:'实时 Feature Platform',brief:'假设 200K events/s，百万实体，线上读取 p99 15ms，实时特征新鲜度 10s；支持离线训练和历史回填。',questions:['哪些特征必须实时，哪些可以每天更新？','entity/feature 数量、值大小、热点和保留期？','迟到与纠正的业务语义，offline 可见性如何定义？'],online:['Kafka / Event Log','Flink Event-time + Dedup','Version-aware Upsert','Online Store / Redis','Feature API + Freshness'],offline:['Raw Events → Object Store','Versioned Feature Definitions','Point-in-time Training Join','Isolated Backfill → Validation → Materialize'],tradeoffs:['更长 watermark 等待减少晚到误差，但牺牲实时新鲜度。','本地缓存降尾延迟，但必须明确 TTL、版本和失效。','统一定义减少 skew，仍需 golden tests 与线上回放验证。'],failure:'Flink 重启后从 checkpoint 与 Kafka 恢复，sink 用幂等/version-aware upsert；回填写独立版本，防止旧值覆盖新实时结果，隔离在线与回填资源。',rubric:['事件时间与可见性时间','online/offline 双路径','去重/晚到/恢复的 sink 语义','point-in-time 与缺失处理','隔离 backfill 与版本推广','freshness/质量/访问权限']},
 {id:'llm',title:'多租户 LLM Inference Gateway',brief:'假设为内部应用提供流式生成。长短 prompt 混合、共享 GPU，需控制 TTFT、token 成本、隐私与公平性。',questions:['输入/输出长度分布和并发，TTFT/TPOT 目标？','模型大小、KV heads、精度和可用 GPU 显存？','租户预算、上下文隔离与取消语义？'],online:['Tenant Auth + Token Budget','Length-aware Admission','Scheduler / Continuous Batch','GPU Workers + KV Cache','Streaming Response + Cancel'],offline:['Model Artifact + Eval Set','Quality / Safety / Performance Gate','Registry + Warm Pools','Canary + Usage / Cost Accounting'],tradeoffs:['prefill/decode 混合可提高利用，但长 prompt 可能损害短请求 TTFT。','prefix cache 节省计算，需要租户、版本与隐私隔离。','量化减少成本，但必须验证质量与实际硬件收益。'],failure:'显存压力时限制 token admission 与并发，拒绝超预算输入；取消流释放 KV；worker 异常要把部分输出和可重试语义讲清，避免重复计费/重放。',rubric:['TTFT/TPOT 与吞吐分别度量','KV + 权重 + workspace 显存预算','token-aware admission 与公平性','流式取消和资源回收','隐私/配额/成本核算','质量 gate 与安全回退']}
];
const QUESTIONS = LESSONS.map(function(l,i){return {id:l.id,round:i>=16&&i<=17?'AI Coding':i===18?'Behavioral':i===12||i===13?'System Design':'Domain Knowledge',q:l.interview,answer:l.hints,lesson:l.id};});
