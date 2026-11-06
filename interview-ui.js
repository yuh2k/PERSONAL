'use strict';

let researchFilters = {query:'', kind:'all', round:'all', topic:'all', status:'all'};
const RESEARCH_KINDS = {candidate:'候选人自述', repost:'面经转载', prep:'资料索引 / 备考整理', official:'官方技术背景'};
const RESEARCH_PRIORITY = ['dd-index-108','nvidia-batching','zh-index-3','dd-index-76','dd-index-630','dd-index-70','nvidia-model-config','zh-index-2','dd-index-112','dd-index-596','nvidia-metrics','official-epcas','dd-index-263','eta-long-tail'];

function researchData(){
  return typeof INTERVIEW_RESEARCH==='undefined' ? {entries:[],coverage:{}} : INTERVIEW_RESEARCH;
}
function researchGuide(id){
  return typeof INTERVIEW_GUIDES!=='undefined' && Object.hasOwn(INTERVIEW_GUIDES,id) ? INTERVIEW_GUIDES[id] : null;
}
function researchProgress(id){
  return state.research && state.research[id] || {saved:false,read:false,note:''};
}
function researchLink(url,label,cls){
  try{
    const parsed=new URL(url);
    if(!['https:','http:'].includes(parsed.protocol))return '';
    return '<a class="'+(cls||'research-source-link')+'" href="'+esc(parsed.href)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' <span aria-hidden="true">↗</span></a>';
  }catch(error){return '';}
}
function researchList(items,cls){
  return '<ul class="'+(cls||'research-bullets')+'">'+items.map(function(item){return '<li>'+esc(item)+'</li>';}).join('')+'</ul>';
}
function researchParagraphs(items){
  return items.map(function(text){return '<p>'+esc(text)+'</p>';}).join('');
}
function researchLessons(entry){
  return (entry.lessons||[]).map(function(id){return LESSONS.find(function(lesson){return lesson.id===id;});}).filter(Boolean);
}
function researchLessonLinks(entry){
  const lessons=researchLessons(entry);
  return lessons.length?'<div class="research-lessons"><span>关联课程</span>'+lessons.map(function(lesson){return '<a href="#lesson/'+esc(lesson.id)+'">'+esc(lesson.title)+' ↗</a>';}).join('')+'</div>':'';
}
function researchActions(entry){
  const progress=researchProgress(entry.id), lessons=researchLessons(entry);
  return '<div class="research-card-actions"><button class="button small '+(progress.saved?'primary':'')+'" data-research-toggle="saved" data-research-entry="'+esc(entry.id)+'" aria-pressed="'+Boolean(progress.saved)+'">'+(progress.saved?'★ 已收藏':'☆ 收藏这条')+'</button>'+
    '<button class="button small" data-research-toggle="read" data-research-entry="'+esc(entry.id)+'" aria-pressed="'+Boolean(progress.read)+'">'+(progress.read?'✓ 已读，点击撤销':'标记已读')+'</button>'+
    (lessons.length?'<button class="button ghost small" data-review-add="'+esc(lessons[0].id)+'">关联课程加入复习 ↻</button>':'')+'</div>';
}
function researchNote(entry){
  const progress=researchProgress(entry.id);
  return '<details class="research-note"><summary>我的笔记'+(progress.note?' · 已记录':'')+'</summary><label class="notes-label" for="research-note-'+esc(entry.id)+'">用自己的经验回答 · 本地自动保存</label><textarea id="research-note-'+esc(entry.id)+'" data-research-note="'+esc(entry.id)+'" maxlength="50000" placeholder="先写自己的答案，再记录遗漏的假设、取舍与追问。换设备前请导出进度。">'+esc(progress.note)+'</textarea></details>';
}
function researchEvidence(entry){
  const reported=entry.reportedQuestions||[];
  return '<details class="research-evidence"><summary>来源与核验范围 · '+esc(entry.title)+'</summary><p>'+esc(entry.role||'岗位未标注')+' · '+esc(entry.date||'日期未标注')+'</p>'+
    '<div class="research-sources">'+researchLink(entry.url,'原始链接')+(entry.evidenceUrl&&entry.evidenceUrl!==entry.url?researchLink(entry.evidenceUrl,'本次可见材料'):'')+'</div>'+
    (entry.provenance?'<p><strong>来源依据：</strong>'+esc(entry.provenance)+'</p>':'')+
    (reported.length?'<h3>材料中记录的题目 / 主题</h3>'+researchList(reported):'<p>该来源没有可核对的候选人题目记录。下方演练由整理者编写，不代表真实出题或官方答案。</p>')+
    (entry.caveat?'<p class="research-caveat">'+esc(entry.caveat)+'</p>':'')+'</details>';
}
function researchMatches(entry){
  const saved=researchProgress(entry.id), guide=researchGuide(entry.id);
  const haystack=[entry.title,entry.summary,entry.role,entry.language,entry.provenance,guide?JSON.stringify(guide):''].concat(entry.topics||[],entry.rounds||[],entry.reportedQuestions||[],entry.followups||[]).join(' ').toLowerCase();
  return (!researchFilters.query || haystack.includes(researchFilters.query.toLowerCase().trim())) &&
    (researchFilters.kind==='all'||entry.kind===researchFilters.kind) &&
    (researchFilters.round==='all'||(entry.rounds||[]).includes(researchFilters.round)) &&
    (researchFilters.topic==='all'||(entry.topics||[]).includes(researchFilters.topic)) &&
    (researchFilters.status==='all'||researchFilters.status==='saved'&&saved.saved||researchFilters.status==='unread'&&!saved.read);
}
function researchCard(entry){
  const progress=researchProgress(entry.id), guide=researchGuide(entry.id);
  return '<article class="research-card '+(progress.read?'is-read':'')+'" id="research-card-'+esc(entry.id)+'" data-research-id="'+esc(entry.id)+'">'+
    '<div class="research-card-top"><span class="research-kind research-kind-'+esc(entry.kind)+'">'+esc(RESEARCH_KINDS[entry.kind]||'资料记录')+'</span><span class="research-meta">'+(guide?'约 '+esc(guide.minutes)+' 分钟 · '+guide.followups.length+' 个追问':esc(entry.date||'日期未标注'))+'</span></div>'+
    '<h2>'+(guide?'<a href="#interview/'+esc(entry.id)+'">'+esc(guide.title)+'</a>':esc(entry.title))+'</h2>'+
    (guide?'<p class="research-basis">'+esc(guide.basis)+'</p><div class="research-prompt"><span>题意转述 · 自编演练</span><p>'+esc(guide.prompt)+'</p></div><div class="research-answer-preview"><h3>先抓住这条回答主线</h3><p>'+esc(guide.shortAnswer)+'</p></div><a class="button primary research-open" href="#interview/'+esc(entry.id)+'">打开完整解析 <span aria-hidden="true">→</span></a><p class="research-content-map">概念拆解 · 参考架构 · 算例 · 追问与答案 · 常见失误 · 动手验证</p>':'<p class="research-summary">'+esc(entry.summary||'')+'</p>')+
    '<div class="research-tags">'+(entry.rounds||[]).map(function(round){return '<span class="research-round">'+esc(round)+'</span>';}).join('')+(entry.topics||[]).map(function(topic){return '<span>'+esc(topic)+'</span>';}).join('')+'</div>'+
    researchActions(entry)+researchNote(entry)+researchEvidence(entry)+'</article>';
}
function researchResults(){
  const entries=researchData().entries||[];
  const visible=entries.filter(researchMatches).sort(function(a,b){
    const ai=RESEARCH_PRIORITY.indexOf(a.id), bi=RESEARCH_PRIORITY.indexOf(b.id);
    return (ai<0?RESEARCH_PRIORITY.length:ai)-(bi<0?RESEARCH_PRIORITY.length:bi);
  });
  return '<div class="research-result-heading"><p id="research-result-count" role="status" aria-live="polite">显示 <strong>'+visible.length+'</strong> / '+entries.length+' 个专题</p><span>默认按 ML Infra 备考建议顺序排列</span></div>'+
    (visible.length?'<div class="research-cards">'+visible.map(researchCard).join('')+'</div>':'<div class="empty research-empty"><p>没有符合当前条件的资料。</p><button class="button small" data-research-reset>清除搜索与筛选</button></div>');
}
function researchCoverage(){
  const coverage=researchData().coverage||{}, blocked=coverage.blocked||[], queries=coverage.queries||[];
  return '<details class="research-coverage"><summary>查看检索范围、查询词与未能读取的来源</summary>'+
    (coverage.summary?'<p>'+esc(coverage.summary)+'</p>':'')+'<div class="question-actions"><a class="button small" href="./research-audit.json" download>下载完整检索记录 JSON ↓</a><a class="button small" href="./RESEARCH.md" download>下载完整解析与答案 Markdown ↓</a></div>'+
    (queries.length?'<h3>实际检索词</h3><div class="research-query-list">'+queries.map(function(query){return '<code>'+esc(typeof query==='string'?query:query.query||query.text||'')+'</code>';}).join('')+'</div>':'')+
    (blocked.length?'<h3>本次未能完整读取</h3><p class="meta">这些入口不计作已收录的面经；无法读取也不等于没有相关内容。</p><ul class="research-blocked">'+blocked.map(function(item){return '<li><span>'+researchLink(item.url,item.name||item.url)+'</span><span>'+esc(item.reason||'未能读取')+'</span></li>';}).join('')+'</ul>':'')+'</details>';
}
function interviewPage(){
  const data=researchData(), entries=data.entries||[], counts={candidate:0,repost:0,prep:0,official:0};
  entries.forEach(function(entry){if(Object.hasOwn(counts,entry.kind))counts[entry.kind]++;});
  const hasReports=counts.candidate+counts.repost>0;
  const guides=entries.map(function(entry){return researchGuide(entry.id);}).filter(Boolean);
  const followups=guides.reduce(function(sum,guide){return sum+guide.followups.length;},0);
  const topics=Array.from(new Set(entries.flatMap(function(entry){return entry.topics||[];}))).sort();
  const rounds=Array.from(new Set(entries.flatMap(function(entry){return entry.rounds||[];}))).sort();
  return heading('EXPLAIN → ANSWER → DEFEND','ML 专项面经与深度解析','从题意转述到完整作答，再用追问检查边界。围绕 ML Serving、特征平台和生产系统设计，直接在站内学习。','<span class="pill">'+guides.length+' 个完整专题</span>')+
    '<section class="research-study-plan" aria-label="专题学习方法"><div><strong>每题这样练</strong><p>2 分钟说出澄清问题 → 90 秒口述主线 → 对照详细答案 → 独立回答追问 → 完成验证练习</p></div><div class="research-study-counts"><span><b>'+guides.length+'</b> 份完整解析</span><span><b>'+followups+'</b> 个追问及答案</span><span><b id="research-saved-count">'+entries.filter(function(entry){return researchProgress(entry.id).saved;}).length+'</b> 已收藏</span><span><b id="research-read-count">'+entries.filter(function(entry){return researchProgress(entry.id).read;}).length+'</b> 已读</span></div></section>'+
    '<div class="research-handbook"><a class="button small" href="./RESEARCH.md" download>下载完整解析与答案 ↓</a><span>全部专题、算例和追问答案，保存为 Markdown 随时复习。</span></div>'+
    (!hasReports?'<div class="research-availability"><strong>来源说明：已核验候选人面经 0 条；已读技术资料 '+counts.official+' 份、文章索引 '+counts.prep+' 条。</strong><p>这里的完整答案和追问是自编演练。读过原文的内容提供要点转述；只核验到索引的文章仅作选题线索，不把未读原文编成摘要，也不据此预测出题频率。</p></div>':'')+
    '<section class="research-toolbar" aria-label="面经搜索和筛选"><label class="sr-only" for="research-search">搜索题目、答案、概念或资料</label><input class="search" id="research-search" type="search" value="'+esc(researchFilters.query)+'" placeholder="搜索题目、答案或概念，例如 point-in-time、p99、动态批处理…">'+
      '<div class="research-filter-grid"><div><label for="research-kind">来源类型</label><select id="research-kind" data-research-select="kind"><option value="all">全部来源</option>'+Object.keys(RESEARCH_KINDS).map(function(kind){return '<option value="'+kind+'" '+(researchFilters.kind===kind?'selected':'')+'>'+RESEARCH_KINDS[kind]+'</option>';}).join('')+'</select></div>'+
      '<div><label for="research-round">面试方向</label><select id="research-round" data-research-select="round"><option value="all">全部方向</option>'+rounds.map(function(round){return '<option value="'+esc(round)+'" '+(researchFilters.round===round?'selected':'')+'>'+esc(round)+'</option>';}).join('')+'</select></div>'+
      '<div><label for="research-topic">主题</label><select id="research-topic" data-research-select="topic"><option value="all">全部主题</option>'+topics.map(function(topic){return '<option value="'+esc(topic)+'" '+(researchFilters.topic===topic?'selected':'')+'>'+esc(topic)+'</option>';}).join('')+'</select></div></div>'+
      '<div class="research-filter-actions"><button class="filter '+(researchFilters.status==='saved'?'active':'')+'" data-research-status="saved" aria-pressed="'+(researchFilters.status==='saved')+'">☆ 只看收藏</button><button class="filter '+(researchFilters.status==='unread'?'active':'')+'" data-research-status="unread" aria-pressed="'+(researchFilters.status==='unread')+'">只看未读</button><button class="button ghost small" data-research-reset>重置筛选</button></div></section>'+
    '<div id="research-results">'+researchResults()+'</div>'+researchCoverage();
}
function guideSection(id,title,body){
  return '<section class="guide-section" aria-labelledby="'+id+'"><h2 id="'+id+'" tabindex="-1">'+title+'</h2>'+body+'</section>';
}
function interviewGuide(id){
  const entry=(researchData().entries||[]).find(function(item){return item.id===id;}), guide=researchGuide(id);
  if(!entry||!guide)return heading('INTERVIEW PRACTICE','没有找到这个专题','请返回资料库选择一个可用专题。')+'<a class="button" href="#interviews">← 返回面经资料库</a>';
  const progress=researchProgress(id);
  const sections=[['guide-prompt','题意与澄清'],['guide-concepts','概念与考点'],['guide-answer','90 秒回答'],['guide-deep','分层解析'],['guide-calculation','架构与算例'],['guide-followups','追问与答案'],['guide-pitfalls','失误与经验迁移'],['guide-english','英文表达'],['guide-exercise','动手与自测'],['guide-notes','笔记与来源']];
  return '<a class="text-link guide-back" href="#interviews">← 返回面经资料库</a>'+heading('INTERVIEW DEEP DIVE',guide.title,'题意转述 · 参考答案 · '+guide.followups.length+' 个追问及答案 · 约 '+esc(guide.minutes)+' 分钟','<span class="pill">自编演练</span>')+
    '<article class="interview-guide '+(progress.read?'is-read':'')+'" data-research-id="'+esc(id)+'"><p class="guide-basis">'+esc(guide.basis)+'。参考架构、数字算例和回答均用于练习，不代表 DoorDash 内部实现或实际面试题。</p>'+researchActions(entry)+'<a class="button small guide-download" href="./RESEARCH.md" download>下载全部专题解析与答案 ↓</a>'+
    '<div class="guide-layout"><aside class="guide-toc" aria-label="本题目录"><strong>本题目录</strong>'+sections.map(function(section){return '<button type="button" data-guide-jump="'+section[0]+'">'+section[1]+'</button>';}).join('')+'</aside><div class="guide-reading">'+
    guideSection('guide-prompt','01 · 题意转述与先问什么','<div class="guide-question"><span class="eyebrow">INTERVIEW PROMPT · 自编题目</span><p>'+esc(guide.prompt)+'</p></div>'+researchParagraphs(guide.paraphrase)+'<h3>开口设计之前，先澄清</h3>'+researchList(guide.clarify))+
    guideSection('guide-concepts','02 · 概念拆解与考察点','<dl class="guide-concepts">'+guide.concepts.map(function(concept){return '<div><dt>'+esc(concept.term)+'</dt><dd>'+esc(concept.explanation)+'</dd></div>';}).join('')+'</dl><h3>回答里需要体现的判断</h3>'+researchList(guide.tests))+
    guideSection('guide-answer','03 · 60–90 秒口述参考答案','<div class="guide-spoken-answer"><span class="eyebrow">SAY IT OUT LOUD</span><p>'+esc(guide.shortAnswer)+'</p></div><p class="guide-caption">先用自己的话复述。下面展开每个决策的依据、机制和失败路径。</p>')+
    guideSection('guide-deep','04 · 分层参考答案',guide.deepAnswer.map(function(step,i){return '<div class="guide-answer-step"><h3><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(step.title)+'</h3><p>'+esc(step.body)+'</p></div>';}).join(''))+
    guideSection('guide-calculation','05 · 参考架构与具体算例','<h3>演练用数据流 / 诊断路径</h3><pre class="guide-architecture" tabindex="0" aria-label="可横向滚动的参考架构"><code>'+esc(guide.architecture)+'</code></pre><div class="guide-worked-example"><h3>把数字或时间线算清楚</h3><p>'+esc(guide.calculation.problem)+'</p><ol>'+guide.calculation.steps.map(function(step){return '<li>'+esc(step)+'</li>';}).join('')+'</ol><p class="guide-conclusion"><strong>如何解读：</strong>'+esc(guide.calculation.conclusion)+'</p></div>')+
    guideSection('guide-followups','06 · 面试官可能怎样继续追问','<div class="guide-followup-head"><p>先口述，再展开对应答案。每个追问单独解释机制和取舍。</p><button type="button" class="button small" data-guide-expand aria-pressed="false">展开全部追问答案</button></div>'+guide.followups.map(function(item,i){return '<details class="guide-followup"><summary><span class="guide-q-number">Q'+(i+1)+'</span>'+esc(item.question)+'</summary><p class="guide-followup-signal"><strong>继续考察：</strong>'+esc(item.signal)+'</p><div class="guide-followup-answer"><h3>参考回答</h3><p>'+esc(item.answer)+'</p></div></details>';}).join(''))+
    guideSection('guide-pitfalls','07 · 常见失误与你的经验怎么用',guide.pitfalls.map(function(item){return '<div class="guide-pitfall"><h3>容易答成：'+esc(item.mistake)+'</h3><p><strong>修正：</strong>'+esc(item.fix)+'</p></div>';}).join('')+'<div class="guide-bridge"><h3>从后端 / 分布式经验迁移到 ML Infra</h3><p>'+esc(guide.bridge)+'</p></div>')+
    guideSection('guide-english','08 · 英文面试表达','<blockquote class="guide-english" lang="en">'+esc(guide.english)+'</blockquote>')+
    guideSection('guide-exercise','09 · 动手练习与自测','<div class="guide-exercise"><h3>现在做这个练习</h3><p>'+esc(guide.exercise.task)+'</p><p><strong>留下的产出：</strong>'+esc(guide.exercise.deliverable)+'</p><h3>检查标准</h3>'+researchList(guide.exercise.checks)+'</div><h3>作答后逐项自评</h3><p class="guide-caption">每项记 0 分（未提及）、1 分（能解释）、2 分（能结合本题给出机制与验证）。把薄弱项和证据写进下方笔记。</p><ol class="guide-rubric">'+guide.rubric.map(function(item){return '<li>'+esc(item)+'</li>';}).join('')+'</ol>')+
    guideSection('guide-notes','10 · 我的答案与来源',researchNote(entry)+researchLessonLinks(entry)+researchEvidence(entry))+
    '<a class="button" href="#interviews">← 继续选择专题</a></div></div></article>';
}
function refreshResearchResults(){
  const results=document.getElementById('research-results');
  if(results)results.innerHTML=researchResults();
  refreshResearchCounts();
}
function refreshResearchCounts(){
  const entries=researchData().entries||[];
  ['saved','read'].forEach(function(field){
    const target=document.getElementById('research-'+field+'-count');
    if(target)target.textContent=entries.filter(function(entry){return researchProgress(entry.id)[field];}).length;
  });
}
function writeResearchState(id){
  state.research=state.research||{};
  state.research[id]=state.research[id]||{saved:false,read:false,note:''};
  return state.research[id];
}
document.addEventListener('input',function(event){
  const target=event.target;
  if(target.id==='research-search'){researchFilters.query=target.value;refreshResearchResults();}
  if(target.dataset.researchNote&&(researchData().entries||[]).some(function(entry){return entry.id===target.dataset.researchNote;})){
    writeResearchState(target.dataset.researchNote).note=target.value;
    persist();
    const summary=target.closest('details').querySelector('summary');
    summary.textContent='我的笔记'+(target.value?' · 已记录':'');
  }
});
document.addEventListener('change',function(event){
  const name=event.target.dataset.researchSelect;
  if(['kind','round','topic'].includes(name)){researchFilters[name]=event.target.value;refreshResearchResults();}
});
document.addEventListener('click',function(event){
  const button=event.target.closest('button');
  if(!button)return;
  if(button.dataset.guideJump){
    const target=document.getElementById(button.dataset.guideJump);
    if(target){target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}
  }
  if(button.hasAttribute('data-guide-expand')){
    const expand=button.getAttribute('aria-pressed')!=='true';
    document.querySelectorAll('.guide-followup').forEach(function(details){details.open=expand;});
    button.setAttribute('aria-pressed',String(expand));
    button.textContent=expand?'收起全部追问答案':'展开全部追问答案';
  }
  if(button.hasAttribute('data-research-reset')){
    researchFilters={query:'',kind:'all',round:'all',topic:'all',status:'all'};
    const search=document.getElementById('research-search');
    if(search)search.value='';
    document.querySelectorAll('[data-research-select]').forEach(function(select){select.value='all';});
    document.querySelectorAll('[data-research-status]').forEach(function(control){control.classList.remove('active');control.setAttribute('aria-pressed','false');});
    refreshResearchResults();
  }
  if(button.dataset.researchStatus){
    researchFilters.status=researchFilters.status===button.dataset.researchStatus?'all':button.dataset.researchStatus;
    document.querySelectorAll('[data-research-status]').forEach(function(control){const active=researchFilters.status===control.dataset.researchStatus;control.classList.toggle('active',active);control.setAttribute('aria-pressed',String(active));});
    refreshResearchResults();
  }
  if(button.dataset.researchToggle){
    const id=button.dataset.researchEntry, field=button.dataset.researchToggle;
    if(!['saved','read'].includes(field)||!(researchData().entries||[]).some(function(entry){return entry.id===id;}))return;
    const progress=writeResearchState(id);
    progress[field]=!progress[field];
    persist();
    if(researchFilters.status!=='all'&&document.getElementById('research-results')){refreshResearchResults();return;}
    button.setAttribute('aria-pressed',String(progress[field]));
    if(field==='saved'){button.textContent=progress.saved?'★ 已收藏':'☆ 收藏这条';button.classList.toggle('primary',progress.saved);}
    else{button.textContent=progress.read?'✓ 已读，点击撤销':'标记已读';button.closest('[data-research-id]').classList.toggle('is-read',progress.read);}
    refreshResearchCounts();
  }
});
