'use strict';

let researchFilters = {query:'', kind:'all', round:'all', topic:'all', status:'all'};
const RESEARCH_KINDS = {candidate:'候选人自述', repost:'面经转载', prep:'资料索引 / 备考整理', official:'官方技术背景'};

function researchData(){
  return typeof INTERVIEW_RESEARCH==='undefined' ? {entries:[],coverage:{}} : INTERVIEW_RESEARCH;
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
function researchMatches(entry){
  const saved=researchProgress(entry.id);
  const haystack=[entry.title,entry.summary,entry.role,entry.language,entry.provenance].concat(entry.topics||[],entry.rounds||[],entry.reportedQuestions||[],entry.followups||[]).join(' ').toLowerCase();
  return (!researchFilters.query || haystack.includes(researchFilters.query.toLowerCase().trim())) &&
    (researchFilters.kind==='all'||entry.kind===researchFilters.kind) &&
    (researchFilters.round==='all'||(entry.rounds||[]).includes(researchFilters.round)) &&
    (researchFilters.topic==='all'||(entry.topics||[]).includes(researchFilters.topic)) &&
    (researchFilters.status==='all'||researchFilters.status==='saved'&&saved.saved||researchFilters.status==='unread'&&!saved.read);
}
function researchCard(entry){
  const progress=researchProgress(entry.id);
  const kind=RESEARCH_KINDS[entry.kind]||'资料记录';
  const lessons=(entry.lessons||[]).map(function(id){return LESSONS.find(function(lesson){return lesson.id===id;});}).filter(Boolean);
  const reported=entry.reportedQuestions||[];
  return '<article class="research-card '+(progress.read?'is-read':'')+'" id="research-card-'+esc(entry.id)+'" data-research-id="'+esc(entry.id)+'">'+
    '<div class="research-card-top"><span class="research-kind research-kind-'+esc(entry.kind)+'">'+esc(kind)+'</span><span class="research-meta">'+esc(entry.language||'')+(entry.language?' · ':'')+esc(entry.date||'日期未标注')+'</span></div>'+
    '<h2>'+esc(entry.title)+'</h2><p class="research-role">'+esc(entry.role||'岗位未标注')+'</p>'+
    '<p class="research-summary">'+esc(entry.summary||'')+'</p>'+
    (entry.kind==='prep'&&entry.caveat?'<p class="research-visible-caveat">'+esc(entry.caveat)+'</p>':'')+
    '<div class="research-tags">'+(entry.rounds||[]).map(function(round){return '<span class="research-round">'+esc(round)+'</span>';}).join('')+(entry.topics||[]).map(function(topic){return '<span>'+esc(topic)+'</span>';}).join('')+'</div>'+
    '<div class="research-sources">'+researchLink(entry.url,'原始链接')+(entry.evidenceUrl&&entry.evidenceUrl!==entry.url?researchLink(entry.evidenceUrl,'本次可见材料'):'')+'</div>'+
    '<details class="research-evidence"><summary>查看来源记录与可见题目'+(reported.length?' · '+reported.length+' 条':'')+'</summary>'+
      (entry.provenance?'<p><strong>来源依据：</strong>'+esc(entry.provenance)+'</p>':'')+
      (reported.length?'<h3>材料中记录的题目 / 主题</h3>'+researchList(reported):'<p>这份材料没有可核对的候选人题目记录，适合用来补充背景知识。</p>')+
      (entry.caveat?'<p class="research-caveat">'+esc(entry.caveat)+'</p>':'')+'</details>'+
    ((entry.followups||[]).length||(entry.answerPoints||[]).length?'<details class="research-practice"><summary>延伸练习与回答要点 <span>整理者推演</span></summary><p class="research-practice-label">以下是基于材料整理的备考练习，不是候选人原话或官方答案。</p>'+
      ((entry.followups||[]).length?'<h3>可以这样追问自己</h3>'+researchList(entry.followups):'')+
      ((entry.answerPoints||[]).length?'<h3>回答时覆盖这些判断</h3>'+researchList(entry.answerPoints):'')+'</details>':'')+
    (lessons.length?'<div class="research-lessons"><span>关联课程</span>'+lessons.map(function(lesson){return '<a href="#lesson/'+esc(lesson.id)+'">'+esc(lesson.title)+' ↗</a>';}).join('')+'</div>':'')+
    '<div class="research-card-actions"><button class="button small '+(progress.saved?'primary':'')+'" data-research-toggle="saved" data-research-entry="'+esc(entry.id)+'" aria-pressed="'+Boolean(progress.saved)+'">'+(progress.saved?'★ 已收藏':'☆ 收藏这条')+'</button>'+
      '<button class="button small" data-research-toggle="read" data-research-entry="'+esc(entry.id)+'" aria-pressed="'+Boolean(progress.read)+'">'+(progress.read?'✓ 已读，点击撤销':'标记已读')+'</button>'+
      (lessons.length?'<button class="button ghost small" data-review-add="'+esc(lessons[0].id)+'">关联课程加入复习 ↻</button>':'')+'</div>'+
    '<details class="research-note"><summary>我的笔记'+(progress.note?' · 已记录':'')+'</summary><label class="notes-label" for="research-note-'+esc(entry.id)+'">用自己的经验回答 · 本地自动保存</label><textarea id="research-note-'+esc(entry.id)+'" data-research-note="'+esc(entry.id)+'" maxlength="50000" placeholder="这条材料让我需要补哪块知识？如果面试官这样问，我怎样澄清、设计和验证？">'+esc(progress.note)+'</textarea></details>'+
  '</article>';
}
function researchResults(){
  const entries=researchData().entries||[];
  const visible=entries.filter(researchMatches);
  return '<div class="research-result-heading"><p id="research-result-count" role="status" aria-live="polite">显示 <strong>'+visible.length+'</strong> / '+entries.length+' 条资料</p><span>先核对来源，再练习追问</span></div>'+
    (visible.length?'<div class="research-cards">'+visible.map(researchCard).join('')+'</div>':'<div class="empty research-empty"><p>没有符合当前条件的资料。</p><button class="button small" data-research-reset>清除搜索与筛选</button></div>');
}
function researchCoverage(){
  const coverage=researchData().coverage||{};
  const blocked=coverage.blocked||[];
  const queries=coverage.queries||[];
  return '<details class="research-coverage"><summary>查看检索范围、查询词与未能读取的来源</summary>'+
    (coverage.summary?'<p>'+esc(coverage.summary)+'</p>':'')+'<div class="question-actions"><a class="button small" href="./research-audit.json" download>下载完整检索记录 JSON ↓</a><a class="button small" href="./RESEARCH.md" download>下载来源清单 Markdown ↓</a></div>'+
    (queries.length?'<h3>实际检索词</h3><div class="research-query-list">'+queries.map(function(query){return '<code>'+esc(typeof query==='string'?query:query.query||query.text||'')+'</code>';}).join('')+'</div>':'')+
    (blocked.length?'<h3>本次未能完整读取</h3><p class="meta">这些入口不计作已收录的面经；无法读取也不等于没有相关内容。</p><ul class="research-blocked">'+blocked.map(function(item){return '<li><span>'+researchLink(item.url,item.name||item.url)+'</span><span>'+esc(item.reason||'未能读取')+'</span></li>';}).join('')+'</ul>':'')+'</details>';
}
function interviewPage(){
  const data=researchData(), entries=data.entries||[];
  const counts={candidate:0,repost:0,prep:0,official:0};
  entries.forEach(function(entry){if(Object.hasOwn(counts,entry.kind))counts[entry.kind]++;});
  const hasReports=counts.candidate+counts.repost>0;
  const topics=Array.from(new Set(entries.flatMap(function(entry){return entry.topics||[];}))).sort();
  const rounds=Array.from(new Set(entries.flatMap(function(entry){return entry.rounds||[];}))).sort();
  return heading('INTERVIEW FIELD NOTES',hasReports?'把面经，读成自己的判断。':'ML 专项面经，先核对证据。','聚焦 DoorDash ML System Design 与 ML Infra Domain。每条资料保留来源、岗位背景、可见问题和可继续练习的追问。','<span class="pill">检索记录 · '+esc(data.updated||'持续更新')+'</span>')+
    (!hasReports?'<div class="research-availability"><strong>本轮尚未核验到 ML 专项候选人面经</strong><p>下方是已读技术资料与待核验原文线索。官方项目和资料索引单独计数，不据此推断 DoorDash 实际面试题或出题频率。</p></div>':'')+
    '<section class="research-intro"><div><span class="eyebrow">SOURCE → QUESTION → PRACTICE</span><h2>'+(hasReports?'先看别人经历了什么，<br>再练自己会怎么答。':'读懂公开的技术材料，<br>继续核验候选人经历。')+'</h2><p>'+(hasReports?'面经中的岗位、年份和轮次很重要。把历史记录作为练习线索，结合本次 recruiter 的 ML Infra 范围调整重点。':'目前收录可直接阅读的技术背景与可追溯的资料线索。原文未读的部分保留限制，供你后续核验。')+'</p></div><div class="research-intro-aside"><span>你的阅读工作台</span><strong><b id="research-saved-count">'+entries.filter(function(entry){return researchProgress(entry.id).saved;}).length+'</b> 条收藏</strong><span><b id="research-read-count">'+entries.filter(function(entry){return researchProgress(entry.id).read;}).length+'</b> / '+entries.length+' 条已读 · 笔记随进度一起备份</span></div></section>'+
    '<section class="research-source-counts" aria-label="资料来源统计">'+Object.keys(RESEARCH_KINDS).map(function(kind){return '<div><span class="research-kind research-kind-'+kind+'">'+RESEARCH_KINDS[kind]+'</span><strong>'+counts[kind]+'</strong><p>'+({candidate:'可见作者自述，保留原始语境',repost:'来自整理或转述，留意溯源',prep:'索引与备考资料，不计作真实题目',official:'理解平台背景，不计作面经'}[kind])+'</p></div>';}).join('')+'</section>'+
    '<div class="research-reading-guide"><strong>阅读方式</strong><span>“来源记录”只摘录材料支持的主题；“延伸练习”是为你整理的模拟追问。数量按资料记录统计，不代表独立候选人数或题目频率。</span></div>'+
    '<section class="research-toolbar" aria-label="面经搜索和筛选"><label class="sr-only" for="research-search">搜索面经标题、岗位、主题或题目</label><input class="search" id="research-search" type="search" value="'+esc(researchFilters.query)+'" placeholder="搜索 feature store、推荐、batching、岗位或题目…">'+
      '<div class="research-filter-grid"><div><label for="research-kind">来源类型</label><select id="research-kind" data-research-select="kind"><option value="all">全部来源</option>'+Object.keys(RESEARCH_KINDS).map(function(kind){return '<option value="'+kind+'" '+(researchFilters.kind===kind?'selected':'')+'>'+RESEARCH_KINDS[kind]+'</option>';}).join('')+'</select></div>'+
      '<div><label for="research-round">面试方向</label><select id="research-round" data-research-select="round"><option value="all">全部方向</option>'+rounds.map(function(round){return '<option value="'+esc(round)+'" '+(researchFilters.round===round?'selected':'')+'>'+esc(round)+'</option>';}).join('')+'</select></div>'+
      '<div><label for="research-topic">主题</label><select id="research-topic" data-research-select="topic"><option value="all">全部主题</option>'+topics.map(function(topic){return '<option value="'+esc(topic)+'" '+(researchFilters.topic===topic?'selected':'')+'>'+esc(topic)+'</option>';}).join('')+'</select></div></div>'+
      '<div class="research-filter-actions"><button class="filter '+(researchFilters.status==='saved'?'active':'')+'" data-research-status="saved" aria-pressed="'+(researchFilters.status==='saved')+'">☆ 只看收藏</button><button class="filter '+(researchFilters.status==='unread'?'active':'')+'" data-research-status="unread" aria-pressed="'+(researchFilters.status==='unread')+'">只看未读</button><button class="button ghost small" data-research-reset>重置筛选</button></div></section>'+
    '<div id="research-results">'+researchResults()+'</div>'+researchCoverage();
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
    if(researchFilters.status!=='all'){refreshResearchResults();return;}
    button.setAttribute('aria-pressed',String(progress[field]));
    if(field==='saved'){button.textContent=progress.saved?'★ 已收藏':'☆ 收藏这条';button.classList.toggle('primary',progress.saved);}
    else{button.textContent=progress.read?'✓ 已读，点击撤销':'标记已读';button.closest('.research-card').classList.toggle('is-read',progress.read);}
    refreshResearchCounts();
  }
});
