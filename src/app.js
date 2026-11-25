const $ = selector => document.querySelector(selector);
const all = selector => Array.from(document.querySelectorAll(selector));
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  github:'<path fill="currentColor" stroke="none" d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-2.06c-3.06.67-3.7-1.3-3.7-1.3-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.35.75 1.02.75 2.07v3.01c0 .3.2.64.76.53A11 11 0 0 0 12 1Z"/>',
  linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7m3.5 0v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7.5" cy="7" r=".75" fill="currentColor"/>',
  superteam:'<path d="M3 16h12l-3 3H1zm4-6h13l-3 3H4zm5-6h11l-3 3H9z" fill="currentColor" stroke="none"/>',astana:'<path d="m12 2 9 18h-5l-4-9-4 9H3z"/>',
  x:'<path d="M3 3h4.4L21 21h-4.5zM20 3l-6.8 7.7M4 21l6.6-7.4"/>',
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor"/>',
  trophy:'<path d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v2a5 5 0 0 0 5 5m9-7h4v2a5 5 0 0 1-5 5m-4 2v5m-4 2h8"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  layers:'<path d="m2 8 10-5 10 5-10 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 10-13h-7z"/>',chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3m6-3v3m-6 12v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
  terminal:'<path d="m4 6 6 6-6 6m10 0h6"/>',branch:'<circle cx="7" cy="5" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="19" r="2"/><path d="M7 7v10m0-3c7 0 10-2 10-5"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  sticker:'<path d="M4 3h16v11l-7 7H4zM13 21v-7h7"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
  calc:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 7h8M8 12h2m4 0h2m-8 5h2m4 0h2"/>',key:'<circle cx="8" cy="9" r="5"/><path d="m12 12 8 8m-5-5 3-3m0 6 3-3"/>',
  receipt:'<path d="M5 2h14v20l-3-2-4 2-4-2-3 2zM8 7h8m-8 4h8m-8 4h5"/>',pause:'<path d="M8 5v14m8-14v14" stroke-width="3"/>',play:'<path d="m7 4 12 8-12 8z"/>'
};
const icon=k=>'<svg class="ui" aria-hidden="true" viewBox="0 0 24 24">'+(icons[k]||icons.layers)+'</svg>';
const dims={city:[192,104],hack:[201,147],sol:[202,154],decent:[207,111],coffee:[183,138],ship:[127,55],sana:[186,55],icpc:[186,55],crab:[60,40]};
function art(id){if(!dims[id])return icon('layers');return '<svg aria-hidden="true" class="art" viewBox="0 0 '+dims[id].join(' ')+'" shape-rendering="crispEdges"><use href="#art-'+id+'"/></svg>'}
function storeRead(key){try{return JSON.parse(localStorage.getItem('pow.v1.'+key))}catch{return null}}
function storeWrite(key,value){try{localStorage.setItem('pow.v1.'+key,JSON.stringify(value))}catch{/* Storage is optional. */}}
function link(el,url){el.href=url;el.target='_blank';el.rel='noopener noreferrer'}
function openUrl(url){window.open(url,'_blank','noopener,noreferrer')}
all('[data-i]').forEach(el=>el.innerHTML=icon(el.dataset.i));
all('[data-url]').forEach(el=>link(el,links[el.dataset.url]));
const socialNames = {github:'GitHub', linkedin:'LinkedIn', superteam:'Superteam Earn', astana:'Astana Hub', instagram:'Instagram'};
for (const [key,name] of Object.entries(socialNames)) {
  const anchor = document.createElement('a');
  link(anchor,links[key]);
  anchor.innerHTML = icon(key) + '<span>' + esc(name) + '</span>';
  $('#socials').append(anchor);
}
$('#bio').textContent = profile.role + ' · ' + profile.location;
$('#handle').textContent = profile.handle;
$('#email').onclick = () => copy(profile.email);
const clockFormat=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:profile.timezone});
function clockTick(){$('#clock').textContent=clockFormat.format(new Date())}clockTick();setInterval(clockTick,12000);
const views = [['overview','Hybrid','grid'],['shelf','Trophy Shelf','trophy'],['bomb','Stickerbomb','sticker']];
for (const dock of all('[data-dock]')) {
  dock.innerHTML = views.map(([id,label,key]) => '<button data-view="'+id+'">'+icon(key)+label+'</button>').join('');
}
function showView(hash,focus=false) {
  const view = views.find(([id]) => id === hash)?.[0] || 'overview';
  for (const [id] of views) $('#'+id).hidden = id !== view;
  for (const button of all('[data-dock] button')) {
    if (button.dataset.view === view) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  }
  updateStickers();
  if (focus) {
    const target = document.getElementById(hash);
    if (view === 'overview' && target && target !== $('#overview')) target.scrollIntoView();
    else { $('#main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  }
}
function navigate(id) {
  if (location.hash === '#'+id) showView(id,true);
  else location.hash = id;
}
window.addEventListener('hashchange',()=>showView(location.hash.slice(1),true));
let toastTimer;function notify(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
async function copy(text){try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text)}catch{const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;top:4px;left:4px;opacity:.01';($('#dialog').open?$('#dialog'):document.body).append(field);field.select();let ok=false;try{ok=document.execCommand('copy')}finally{field.remove()}if(!ok){dialog('Copy text','<label class="field-label" for="manual">Select and copy this text</label><textarea id="manual"></textarea>');$('#manual').value=text;$('#manual').select();return false}}notify('Copied!');return true}
const dlg=$('#dialog');let returnFocus;
function dialog(title,body){if(!dlg.open)returnFocus=document.activeElement;$('#dialog-title').textContent=title;$('#dialog-content').innerHTML=body;if(!dlg.open)dlg.showModal()}
function closeDialog(){dlg.close()}
$('#close').onclick=closeDialog;dlg.addEventListener('click',e=>{if(e.target===dlg){const r=dlg.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});
dlg.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})});
function ai(provider,prompt=PROMPT){const name=AI_PROVIDERS[provider].name;dialog('Ask '+name+' about Daniil','<label for="draft" class="field-label">Review and edit the prompt before opening '+name+'.</label><textarea id="draft"></textarea><p class="hint">The next step shares this text with '+name+'. You can also copy it into a new chat.</p><div class="dialog-actions"><button id="continue-ai" class="primary">Open '+name+' ↗</button><button id="copy-draft" class="secondary">Copy prompt</button></div>');$('#draft').value=prompt;$('#continue-ai').onclick=()=>{openUrl(buildAskAiUrl(provider,$('#draft').value))};$('#copy-draft').onclick=()=>copy($('#draft').value)}
function themes(){dialog('Theme Admin','<p class="hint">Preview only · Dark Terminal is active on your deck.</p><div class="swatches"><button data-sample="dark">Terminal</button><button data-sample="light">Paper <b class="wip">DEMO / WIP</b></button><button data-sample="night">Midnight <b class="wip">DEMO / WIP</b></button></div><div class="theme-sample">Hello, <em>Daniil.</em></div>');const samples={dark:['#161513','#e6b296'],light:['#f1e7db','#66452f'],night:['#202332','#c5c0e5']};for(const b of all('[data-sample]'))b.onclick=()=>{const [bg,color]=samples[b.dataset.sample];const s=$('.theme-sample');s.style.background=bg;s.style.color=color;all('[data-sample]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))};all('[data-sample]')[0].click()}
$('#theme').onclick=themes;
function outbound(url, label) {
  return '<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>';
}
function credentialBody(c,expanded=false) {
  const mark = dims[c.id] ? art(c.id) : icon(c.icon);
  const heading = expanded ? '' : '<h3>'+esc(c.name)+'</h3>';
  const evidence = [['Credential ID',c.serial],['Verification hash',c.hash]].filter(([,val])=>val)
    .map(([name,val])=>'<button class="tag" data-copy="'+esc(val)+'" title="Copy '+name+'">'+icon('copy')+' '+esc(val)+'</button>').join('');
  const details = '<dl><dt>Date</dt><dd>'+esc(c.date)+'</dd><dt>Role</dt><dd>'+esc(c.role)+'</dd></dl>'
    +evidence+(c.url ? outbound(c.url,c.source) : '<small>'+esc(c.source)+'</small>');
  return '<div class="stamp">'+mark+'</div><small>'+esc(c.result)+'</small>'+heading+'<p>'+esc(c.context)+'</p>'
    +(expanded ? details : '<button class="tag" data-credential="'+esc(c.id)+'">View record ↗</button>');
}
$('#trophies').innerHTML = credentials.map(c=>'<article class="trophy">'+credentialBody(c)+'</article>').join('');
function credential(id) {
  const c = credentials.find(c=>c.id === id);
  if (c) dialog(c.name,'<article class="trophy credential">'+credentialBody(c,true)+'</article>');
  else dialog('Sticker','<div class="credential"><div class="stamp">'+art(id)+'</div></div>');
}
let activeChoice=0,choices=[];

function palette(){dialog('Command palette','<input id="palette-query" class="search-input" aria-label="Search commands or bookmarks" placeholder="Search projects, credentials, or /commands..." autocomplete="off"><div class="choices" id="choices"></div>');const input=$('#palette-query');input.oninput=()=>{activeChoice=0;drawChoices()};input.onkeydown=e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(choices.length)activeChoice=(activeChoice+(e.key==='ArrowDown'?1:-1)+choices.length)%choices.length;markChoice()}if(e.key==='Enter'&&choices[activeChoice]){e.preventDefault();choices[activeChoice].run()}};drawChoices();input.focus()}
const bookmarks=[['Lichess',links.lichess],['ChatGPT',links.chatgpt],['GitHub',links.github]];
function markChoice(){all('#choices button').forEach((b,i)=>{b.classList.toggle('selected',i===activeChoice);if(i===activeChoice)b.scrollIntoView({block:'nearest'})})}
function drawChoices(){const input=$('#palette-query'),query=input.value.trim(),match=query.match(/^\/(google|gh|ask|claude)\s+(.+)$/i);
const cmd=(mode,q)=>{if(mode==='claude'||mode==='ask'){ai(mode==='claude'?'claude':'chatgpt',PROMPT+'\n\nQuestion: '+q);return}openUrl((mode==='gh'?'https://github.com/search?q=':'https://www.google.com/search?q=')+encodeURIComponent(q));closeDialog()};
const external=(name,kind,url,keywords='')=>({name,kind,keywords,run:()=>{openUrl(url);closeDialog()}});
const options=[
 ...projects.map(p=>external(p.name,'Repository',repoUrl(p),[p.category,p.summary,...p.stack].join(' '))),
 {name:'/help',kind:'Commands',run:()=>dialog('Command guide','<p class="hint">/gh &lt;query&gt; — search GitHub<br>/google &lt;query&gt; — search the web<br>/claude &lt;question&gt; — ask Claude<br>/ask &lt;question&gt; — ask ChatGPT<br>↑ / ↓ to select · Enter to open · Esc to close</p>')},
 ...credentials.map(c=>({name:c.name+' · '+c.result,kind:'Credential',keywords:[c.serial,c.source,c.context,'cert certificate'].join(' '),run:()=>credential(c.id)})),
 ...views.map(([id,name])=>({name,kind:'View',run:()=>{closeDialog();navigate(id)}})),
 ...Object.entries(socialNames).map(([key,name])=>external(name,'Profile',links[key],key+' social')),
 ...bookmarks.filter(([name])=>name!=='GitHub').map(([name,url])=>external(name,'Bookmark',url)),
 ...['google','gh','claude','ask'].map(k=>({name:'/'+k,kind:'Command',run:()=>{input.value='/'+k+' ';input.focus();activeChoice=0;drawChoices()}}))
];
choices=match?[{name:match[2],kind:'/'+match[1],run:()=>cmd(match[1].toLowerCase(),match[2])}]:options.filter(o=>query.toLowerCase().split(/\s+/).every(term=>[o.name,o.kind,o.keywords].join(' ').toLowerCase().includes(term)));if(query&&!query.startsWith('/'))choices.push({name:'Search the web for “'+query+'”',kind:'Google',run:()=>cmd('google',query)});
$('#choices').innerHTML=choices.length?choices.map((o,i)=>'<button data-choice="'+i+'"><span>'+esc(o.name)+'</span><small>'+esc(o.kind)+'</small></button>').join(''):'<p class="hint">No matching commands.</p>';all('[data-choice]').forEach((b,i)=>b.onclick=choices[i].run);markChoice()}
$('#hero-search').onclick=palette;for(const k of all('.search-launch kbd'))k.textContent=/Mac|iPhone|iPad/.test(navigator.platform)?'⌘ K':'Ctrl + K';
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(dlg.open&&$('#palette-query'))closeDialog();else palette()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.copy)copy(b.dataset.copy==='dossier'?PROMPT:b.dataset.copy);else if(b.dataset.ai)ai(b.dataset.ai);else if(b.dataset.view)navigate(b.dataset.view);else if(b.dataset.credential)credential(b.dataset.credential)});
const zoneDefaults={ 'hero-stickers':[[.25,.35,.32],[.70,.36,.32],[.48,.73,.36],[.80,.81,.27],[.16,.77,.18]],canvas:[[.19,.28,.22],[.70,.30,.25],[.31,.74,.27],[.81,.73,.19],[.53,.62,.15]] };
const bound=(v,min,max)=>Math.min(max,Math.max(min,v));
const zoneStates=new Map();
function positionSticker(b){const z=b.parentElement,r=zoneStates.get(z.id)[Number(b.dataset.index)],w=z.clientWidth,h=z.clientHeight;if(!w||!h)return;
const [sw,sh]=dims[b.dataset.sticker],radians=r.angle*Math.PI/180;
const sin=Math.abs(Math.sin(radians)),cos=Math.abs(Math.cos(radians)),ratio=sh/sw;
const inset=Math.min(12,w*.04,h*.08);
const width=Math.min(r.scale*w, (w-2*inset)/(cos+ratio*sin),(h-2*inset)/(sin+ratio*cos));
const hx=width*(cos+ratio*sin)/2,hy=width*(sin+ratio*cos)/2;
r.x=bound(r.x*w,hx+inset,w-hx-inset)/w;r.y=bound(r.y*h,hy+inset,h-hy-inset)/h;b.style.cssText='width:'+width+'px;left:'+r.x*100+'%;top:'+r.y*100+'%;--rot:'+r.angle+'deg'}
function updateStickers(){all('.sticker').forEach(positionSticker)}
function seedZone(z,reset=false){const saved=reset?null:storeRead('stickers.'+z.id);const states=zoneDefaults[z.id].map(([x,y,scale],i)=>{const s=saved?.[i];return s&&[s.x,s.y,s.angle].every(Number.isFinite)?{x:s.x,y:s.y,angle:s.angle,scale}:{x,y,scale,angle:stickers[i].angle}});zoneStates.set(z.id,states)}
for(const z of all('.sticker-area')){
 seedZone(z);z.innerHTML=stickers.map((s,i)=>'<button class="sticker" data-index="'+i+'" data-sticker="'+s.id+'" aria-label="'+esc(s.label)+'. Drag to move, R to rotate." title="'+esc(s.label)+' · Drag / double-click to rotate">'+art(s.id)+'</button>').join('');
 for(const b of z.children){let drag=null;const state=()=>zoneStates.get(z.id)[Number(b.dataset.index)],save=()=>storeWrite('stickers.'+z.id,zoneStates.get(z.id));
 b.onpointerdown=e=>{if(e.button!==0)return;const r=state();drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:r.x,y:r.y};b.setPointerCapture(e.pointerId)};
 b.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const r=state();r.x=drag.x+(e.clientX-drag.startX)/z.clientWidth;r.y=drag.y+(e.clientY-drag.startY)/z.clientHeight;positionSticker(b)};
 b.onlostpointercapture=()=>{if(drag)save();drag=null};
 b.ondblclick=()=>{state().angle=(state().angle+15)%360;positionSticker(b);save()};
 b.onkeydown=e=>{const r=state();if(e.key.toLowerCase()==='r')r.angle=(r.angle+15)%360;else if(e.key==='ArrowLeft')r.x-=.025;else if(e.key==='ArrowRight')r.x+=.025;else if(e.key==='ArrowUp')r.y-=.035;else if(e.key==='ArrowDown')r.y+=.035;else if(e.key==='Enter'){credential(b.dataset.sticker);return}else return;e.preventDefault();positionSticker(b);save()};
 }
 new ResizeObserver(updateStickers).observe(z)
}
$('#reset').onclick=()=>{seedZone($('#canvas'),true);storeWrite('stickers.canvas',null);updateStickers();notify('Layout reset')};
function formatDate(iso) {
  return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T00:00:00Z'));
}
function renderProject(p) {
  const resultText = esc(p.result) + ' · ' + esc(p.context);
  const result = p.proof
    ? '<button class="card-result" data-credential="'+esc(p.proof)+'">'+icon('trophy')+' '+resultText+'</button>'
    : '<span class="card-result">'+resultText+'</span>';
  const illustration = document.getElementById('project-art-'+p.id)?.innerHTML || icon('terminal');
  return '<article class="project-card" id="project-'+esc(p.id)+'" data-id="'+esc(p.id)+'">'
    +'<div class="artstage" aria-hidden="true">'+illustration+'</div><div class="card-body">'
    +'<span class="card-type">'+esc(p.category)+'</span><h3>'+esc(p.name)+'</h3>'+result+'<p>'+esc(p.summary)+'</p>'
    +'<div class="stack">'+p.stack.map(s=>'<span>'+esc(s)+'</span>').join('')+'</div>'
    +'<div class="project-links">'+outbound(repoUrl(p),'View repo')+outbound(repoUrl(p)+p.docs,p.id==='sol'?'Architecture':'Setup guide')+'</div></div>'
    +'<div class="card-foot"><span>'+esc(p.language)+' · ☆ '+p.stars+'</span>'+outbound(repoUrl(p)+'/commit/'+p.commit,'Commit · '+formatDate(p.commitDate))+'</div></article>';
}
$('#project-grid').innerHTML = projects.map(renderProject).join('');
$('#footer-projects').innerHTML = projects.map(p=>'<a href="#project-'+esc(p.id)+'">'+esc(p.name)+'</a>').join('');
$('#stack').innerHTML = profile.stack.map(s=>'<span>'+esc(s)+'</span>').join('');
const stats = [['5 years','Engineering'],['$250+','Superteam earned'],[projects.length,'Public builds'],[credentials.length,'Milestones']];
$('#stats').innerHTML = stats.map(([n,s])=>'<div><b>'+esc(n)+'</b><small>'+esc(s)+'</small></div>').join('');
$('#ids').innerHTML = credentials.filter(c=>c.serial).map(c=>'<button data-copy="'+esc(c.serial)+'" title="'+esc(c.serial)+'" aria-label="Copy '+esc(c.name)+' credential ID">'+esc(c.name)+icon('copy')+'</button>').join('');

const groups = [['all','All'],['git','GitHub Releases & Commits'],['wins','Hackathons & Wins'],['social','Social Posts']];
$('#filters').innerHTML = groups.map(([id,label])=>'<button class="pill" data-group="'+id+'">'+label+'</button>').join('');
function renderLog(group) {
  all('#filters button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.group===group)));
  const selected = feedPosts.filter(row=>group==='all'||row.group===group);
  $('#stream').innerHTML = selected.map(row=>{
    const content = '<span class="log-icon">'+icon(row.icon)+'</span><span><strong>'+esc(row.title)+'</strong><small>'+esc(row.detail)+'</small></span>'
      +'<span class="log-meta"><span class="source">'+esc(row.source)+' ↗</span><small>'+esc(row.date)+'</small></span>';
    const attrs = 'class="log-row" data-group="'+esc(row.group)+'"';
    if (row.proof) return '<button '+attrs+' data-credential="'+esc(row.proof)+'">'+content+'</button>';
    return '<a '+attrs+' href="'+esc(row.url)+'" target="_blank" rel="noopener noreferrer">'+content+'</a>';
  }).join('') || '<p class="empty">No social posts pinned yet.<br>'+outbound(links.linkedin,'LinkedIn')+' · '+outbound(links.instagram,'Instagram')+'</p>';
}
for (const b of all('#filters button')) b.onclick=()=>renderLog(b.dataset.group);
renderLog('all');
const chips = credentials.map(c=>'<button data-credential="'+esc(c.id)+'">'+icon(c.icon)+esc(c.name)+' · '+esc(c.result)+'</button>').join('');
$('#ticker').innerHTML = '<div>'+chips+'</div><div aria-hidden="true">'+chips.replaceAll('<button ','<button tabindex="-1" ')+'</div>';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function setTicker(paused) {
  $('#wins').classList.toggle('paused',paused);
  const button = $('#pause');
  button.hidden = reduced.matches;
  button.innerHTML = icon(paused?'play':'pause');
  button.setAttribute('aria-label',paused?'Play ticker':'Pause ticker');
}
setTicker(reduced.matches);
reduced.addEventListener('change',()=>setTicker(reduced.matches));
$('#pause').onclick=()=>setTicker(!$('#wins').classList.contains('paused'));
showView(location.hash.slice(1),Boolean(location.hash));
