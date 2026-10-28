// ================= GUIDED FIRST DAYS: one new thing at a time =================
let TITLE_TUT=true;try{TITLE_TUT=localStorage.getItem('splice_tut')!=='off';}catch(e){}
const LESSONS=[
  {id:'d1',when:'Day 1',title:'Search & fight',icon:'🔦',col:'#ffd166',pic:['🚪','✋','🗡️'],
   text:'Walk out of your shack and into any building or house. Hold <b>E</b> on drawers, fridges and crates. Click or press <b>Space</b> to swing at monsters.',
   steps:[['🚶','Walk outside',()=>!!S.flags.wentOut],['🔍','Search 3 containers',()=>S.stats.searched>=3],['🗡️','Defeat a monster',()=>S.stats.kills>=1]]},
  {id:'n1',when:'Night 1',title:'Defend your shack',icon:'🌙',col:'#7fc8ff',pic:['🏠','🪟','🪵'],
   text:'Monsters come for your shack at night. Go inside, stand at a <b>window or the door</b> and press <b>E</b> to look out and fight. <b>R</b> boards a window up. Walls and traps are built at the <b>workbench</b>.',
   steps:[['🏠','Get inside your shack',()=>S.P.sc==='base'],['🪟','Look out a window or the door (E)',()=>!!S.tutPosted],['☀️','Survive until morning',()=>S.day>=2]]},
  {id:'d2',when:'Day 2',title:'DNA & the lab',icon:'🧬',col:'#7dff9a',pic:['🧪','🔬','🎮'],
   text:'Monsters drop glowing <b>DNA strands</b>. Walk over them. Back in your shack, the <b>Gene-O-Matic</b> turns strands into powers: play a lab test, or quick-run it. Powers go on keys <b>1, 2, 3</b>.',
   steps:[['🧪','Pick up a DNA strand',()=>S.vault.length>0||Object.keys(S.dna).some(k=>S.dna[k]>0)],['🔬','Sequence one at your lab',()=>(S.seqIdx||0)>0||Object.keys(S.dna).some(k=>S.dna[k]>=15)],['🎮','Have a power on a key',()=>S.slots.some(Boolean)]]},
  {id:'d3',when:'Day 3',title:'Camps & gates',icon:'🏕️',col:'#ffb347',pic:['🗺️','🛑','🤝'],
   text:'Survivors live in walled <b>camps</b> (🏕️ on the map, M). Guards stop you at the gate. Get through the checkpoint, then trade, take jobs and hire help. How human you look matters.',
   steps:[['🗺️','Find a camp',()=>S.camps.some(c=>c.visited)],['🛑','Get through a gate',()=>S.camps.some(c=>c.everPassed)],['💬','Talk to a camp leader (E)',()=>!!S.tutTalked]]},
  {id:'d4',when:'Day 4',title:'Two roads',icon:'🛣️',col:'#c27bff',pic:['💉','⚖️','🧬'],
   text:'Now the real choice. Use monster DNA to <b>help people</b> (vaccines, cures, rebuilding gates) and stay human, or use it to <b>change them</b> (turn people, lead monster packs) and become something else. Press <b>J</b> any time to see both roads.',
   steps:[]}];
function tutOn(){return S&&S.mode==='hunter'&&S.tut&&S.tut.on;}
function tutStage(){if(!tutOn())return -1;const d=S.day;return d<=1?(S.night?1:0):d===2?2:d===3?3:4;}
function lessonCard(i){const L=LESSONS[i];S.tut.shown[i]=true;
  showOv(`<div class="card tutcard" style="--tc:${L.col}"><div class="eyebrow">${L.when} · lesson ${i+1} of ${LESSONS.length}</div><h1 style="color:${L.col}">${L.icon} ${L.title}</h1>
  <div class="tutpics">${L.pic.map((p,j)=>`<span style="animation-delay:${j*.15}s">${p}</span>`).join('<i>›</i>')}</div>
  <p class="tuttext">${L.text}</p>
  ${L.steps.length?`<div class="tutsteps">${L.steps.map(s=>`<div>${s[0]} ${s[1]}</div>`).join('')}</div>`:''}
  <div class="row" style="margin-top:12px"><button class="btn big gold" data-a="tutok">Got it!</button><button class="btn ghost" data-a="tutskip" style="margin-left:auto">Skip all lessons</button></div></div>`,'panel');S.panel='tut';}
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='tut')return;_rp();};}
{const _act=act;act=function(a,d){if(a==='tutok'){hideOv();return;}if(a==='tutskip'){if(S.tut)S.tut.on=false;try{localStorage.setItem('splice_tut','off');}catch(e){}hideOv();toast('Lessons off. You can turn them back on from the title screen.');return;}
  if(a==='tuttoggle'){TITLE_TUT=!TITLE_TUT;try{localStorage.setItem('splice_tut',TITLE_TUT?'on':'off');}catch(e){}showTitle(true);return;}_act(a,d);};}
function tutTick(){const st=tutStage();if(st<0)return;
  if(S.tut.last!==st){S.tut.last=st;S.tut.wait=S.t+2.6;}
  if(!S.tut.shown[st]&&!ovMode&&S.t>=(S.tut.wait||0)){lessonCard(st);if(st===4){S.tut.on=false;S.roadIntro=true;}}
  if(S.P.posted)S.tutPosted=true;if(S.panel==='camp')S.tutTalked=true;}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);try{tutTick();}catch(e){}};}
// the lesson checklist on screen
let tutEl=null;
function updateTutBox(){if(!tutEl){tutEl=document.createElement('div');tutEl.id='tutbox';document.body.appendChild(tutEl);}
  const st=tutStage(),L=LESSONS[st];if(st<0||!L||!L.steps.length||ovMode||!S.tut.shown[st]){tutEl.style.display='none';return;}
  const done=L.steps.filter(s=>s[2]()).length;
  const html=`<b style="color:${L.col}">${L.icon} ${L.title}</b> <small>${done}/${L.steps.length}</small>${L.steps.map(s=>`<div class="${s[2]()?'ok':''}">${s[2]()?'✅':'⬜'} ${s[1]}</div>`).join('')}`;
  if(tutEl._h!==html){tutEl.innerHTML=html;tutEl._h=html;}tutEl.style.display='block';}
{const _ut=updateToolbar;updateToolbar=function(){_ut();try{updateTutBox();}catch(e){}};}
// pacing while learning: nothing extra before you've met it
{const _ng=newGame;newGame=function(o){_ng(o);S.tut={on:TITLE_TUT&&!!(o&&o.story!==undefined),shown:{},t0:0};};}
{const _hi=houseInterior;houseInterior=function(f){const fresh=!f.int,I=_hi(f);if(fresh&&tutOn()&&S.day<3&&I.hiders){I.hiders=null;I.props.forEach(p=>delete p.owner);}if(fresh&&tutOn()&&S.day<2){I.haz=[];I.props.forEach(p=>delete p.trap);}return I;};}
{const _sr=sendRaid;sendRaid=function(c,n,b){if(tutOn()&&S.day<4&&!b)return;return _sr(c,n,b);};}
// remember lesson progress
saveExt(d=>{d.tut=S.tut;});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();S.tut=d.tut||{on:false,shown:{}};}}catch(e){}return ok;};}
// title screen toggle
{const _st=showTitle;showTitle=function(keep){_st(keep);const row=ov.querySelector('[data-a="diff"]');if(row&&row.parentElement){const b=document.createElement('button');b.className='btn sm '+(TITLE_TUT?'gold':'ghost');b.dataset.a='tuttoggle';b.textContent='📘 Guided start: '+(TITLE_TUT?'on':'off');b.title='Teaches one thing per day for the first 4 days';row.parentElement.insertBefore(b,row.parentElement.querySelector('[data-a="snd"]'));}};}
(function(){const st=document.createElement('style');st.textContent=`
.tutcard{border:3px solid var(--tc);max-width:640px}.tutcard h1{font-size:42px;line-height:1.1;margin:4px 0 2px}.tutpics{display:flex;align-items:center;justify-content:center;gap:14px;font-size:54px;margin:6px 0 4px}.tutpics span{animation:tutpop .5s backwards}.tutpics i{font-size:28px;opacity:.5;font-style:normal}
@keyframes tutpop{from{transform:scale(.3);opacity:0}}.tuttext{font-size:19px;line-height:1.45}.tutsteps{display:grid;gap:4px;background:#0005;border-radius:10px;padding:8px 12px;font-size:16px}
#tutbox{position:fixed;right:12px;top:100px;z-index:20;background:rgba(10,12,11,.86);border:2px solid #ffffff30;border-radius:12px;padding:8px 12px;font:600 14px/1.5 var(--body,sans-serif);color:#eee;pointer-events:none;max-width:260px}
#tutbox small{opacity:.6}#tutbox .ok{opacity:.55;text-decoration:line-through}
@media (max-width:640px){#tutbox{top:auto;bottom:150px;font-size:12px}}`;document.head.appendChild(st);})();
