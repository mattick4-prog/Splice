// ================= WINDOW WARNINGS · LESSONS ANY TIME · MYSTERY POWERS =================
// ---------- 1) windows and the door glow when something is coming at them ----------
const POSTS=[{kind:'win',i:0},{kind:'win',i:1},{kind:'win',i:2},{kind:'win',i:3},{kind:'door'}];
function threatLevels(){const lv=[0,0,0,0,0];if(!S||S.mode!=='hunter')return lv;const pts=POSTS.map(postPoint);
  S.enemies.forEach(m=>{if(m.dead||m.kind!=='monster'||m.sc!=='out'||m.pack||m.campRaid)return;if(Math.hypot(m.x-BASE.x,m.y-BASE.y)>700)return;
    let bi=0,bd=1e9;pts.forEach((p,i)=>{const d=Math.hypot(m.x-p.x,m.y-p.y);if(d<bd){bd=d;bi=i;}});lv[bi]=Math.max(lv[bi],clamp(1-bd/620,0,1));});
  return lv;}
{const _di=drawInterior;drawInterior=function(I){_di(I);if(I!==S.baseInt||S.mode!=='hunter')return;const lv=threatLevels();
  POSTS.forEach((pt,i)=>{const k=lv[i];if(k<.04)return;const x=pt.kind==='door'?I.door.x:I.windows[pt.i].px,y=pt.kind==='door'?I.door.y-6:I.windows[pt.i].py,pul=.65+.35*Math.sin(S.t*(4+k*6));
    const g=ctx.createRadialGradient(x,y,4,x,y,46+k*60);g.addColorStop(0,`rgba(255,${Math.round(150-k*110)},60,${(.35+.45*k)*pul})`);g.addColorStop(1,'rgba(255,60,40,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,46+k*60,0,7);ctx.fill();
    if(k>.35)label(k>.7?'⚠️ HERE!':'⚠️',x,y+(pt.kind==='door'?-34:(I.windows[pt.i].side==='h'?40:0))+(I.windows[pt.i]&&I.windows[pt.i].side==='v'?-30:0),k>.7?'#ff5a68':'#ffb347',k>.7?15:13);});};}
// ---------- 2) lessons you can open again ----------
function lessonsHtml(){S.tut=S.tut||{on:false,shown:{}};
  return `<div class="card">${head('Lessons · Esc to close','📘 Lessons')}<p class="mute" style="margin-top:2px">Click any lesson to see it again.</p>
  <div class="lgrid">${LESSONS.map((L,i)=>`<button class="lcard" data-a="lessonview" data-i="${i}" style="--tc:${L.col}"><span class="li">${L.icon}</span><b>${L.title}</b><small>${L.when}</small></button>`).join('')}</div></div>`;}
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='lessons'){showOv(lessonsHtml(),'panel');return;}_rp();};}
{const _act=act;act=function(a,d){
  if(a==='lessons'){openPanel('lessons');return;}
  if(a==='lessonview'){S.tut=S.tut||{on:false,shown:{}};lessonCard(+d.i);const sk=ov.querySelector('[data-a="tutskip"]');if(sk){sk.dataset.a='lessons';sk.textContent='← All lessons';}return;}
  _act(a,d);};}
{const _hh=helpHtml;helpHtml=function(){return _hh().replace(/(<\/div>)/,'$1<div style="margin:6px 0 10px"><button class="btn gold" data-a="lessons">📘 See the lessons again</button></div>');};}
{const _mh=menuHtml;menuHtml=function(){return _mh().replace(/<\/div>\s*$/,'<section style="margin-top:10px"><button class="btn" data-a="lessons">📘 Lessons</button></section></div>');};}
// ---------- 3) mystery powers: unlocked by what you DO ----------
def('spirit','m_angel','Guardian Angel','👼',22,'Heal a lot, wrap yourself in armor, and slow everything near you.',[{t:'heal',amt:45},{t:'buff',armor:1,dur:4},{t:'nova',r:170,st:'slow'}]);
def('beast','m_howl','Moon Howl','🌕',24,'Howl, and three shadow wolves come running to fight for you.',[{t:'summon',n:3,hp:45,dmg:12,life:18},{t:'nova',r:150,st:'fear'}]);
def('metal','m_golem','Scrap Golem','🤖',30,'Build a hulking scrap golem that fights beside you.',[{t:'summon',n:1,hp:160,dmg:22,life:25},{t:'buff',armor:1,dur:2}]);
def('shadow','m_ghost','Ghost Walk','👻',16,'Turn invisible and fast for a few seconds.',[{t:'buff',invis:1,speed:1,dur:5}]);
def('mind','m_genestorm','Gene Storm','🌀',20,'Lightning leaps between every enemy you can see and scrambles their minds.',[{t:'chain',n:8,dmg:26},{t:'screen',st:'fear'}]);
def('blood','m_phoenix','Second Chance','🔥',40,'Burst back to full strength: a huge heal and a wave of blood that heals you for every hit.',[{t:'heal',amt:80},{t:'nova',r:180,dmg:22,heal:5}]);
const MYSTERY=[
  {id:'m_angel',hint:'Help three people who were bitten.',prog:()=>[(S.curedN||0)+(S.treatedN||0),3]},
  {id:'m_howl',hint:'Call monsters to your side. Six of them.',prog:()=>[S.packN||0,6]},
  {id:'m_golem',hint:'Build things that protect people: walls, traps, or gates. Four of them.',prog:()=>[Object.keys(S.defs||{}).length+(S.gatesBuilt||0),4]},
  {id:'m_ghost',hint:'Be a true scavenger. Search 25 things.',prog:()=>[S.stats.searched||0,25]},
  {id:'m_genestorm',hint:'Get a perfect score on 5 lab tests.',prog:()=>[S.perfectN||0,5]},
  {id:'m_phoenix',hint:'Fall far (humanity under 30), then find your way back (70+).',prog:()=>[(S.minHum<30?1:0)+(S.minHum<30&&S.humanity>=70?1:0),2]}];
function mysteryTick(){if(S.mode!=='hunter')return;S.minHum=Math.min(S.minHum===undefined?100:S.minHum,S.humanity);S.flags=S.flags||{};
  MYSTERY.forEach(M=>{if(S.flags['myst_'+M.id])return;const [a,b]=M.prog();if(a>=b){S.flags['myst_'+M.id]=true;S.dna[M.id]=100;const P=POWERS[M.id];
    banner('MYSTERY POWER: '+P.name.toUpperCase(),P.icon+' '+P.desc+' Press Tab to put it on a key.',FAM[P.fam].color);sfx('coin');}});}
{let acc=0;const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);acc+=dt;if(acc>1){acc=0;try{mysteryTick();}catch(e){}}};}
{const _se=seqEnd;seqEnd=function(){const q=S.seq,real=q&&!q.done&&!q.practice;_se();if(real&&q.score===1)S.perfectN=(S.perfectN||0)+1;};}
{const _act=act;act=function(a,d){if(a==='sktreat'||a==='hmeds'){const m=S.res.meds;_act(a,d);if(S.res.meds<m)S.treatedN=(S.treatedN||0)+1;return;}_act(a,d);};}
saveExt(d=>{d.myst={perfectN:S.perfectN||0,treatedN:S.treatedN||0,minHum:S.minHum};});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const m=saveInfo().myst||{};S.perfectN=m.perfectN||0;S.treatedN=m.treatedN||0;if(m.minHum!==undefined)S.minHum=m.minHum;}}catch(e){}return ok;};}
// mystery cards in the Powers tab
{const _pt=powersTab;powersTab=function(){const h=_pt();
  const cards=MYSTERY.map(M=>{const P=POWERS[M.id],done=!!(S.flags&&S.flags['myst_'+M.id]),[a,b]=M.prog();
    return done?`<div class="mcard on" style="--mc:${FAM[P.fam].color}" title="${P.name}||${P.desc}"><span class="mi">${P.icon}</span><b>${P.name}</b><small>unlocked!</small></div>`
      :`<div class="mcard" title="Mystery power||${M.hint}"><span class="mi">❓</span><b>???</b><small>${M.hint}</small><span class="mbar"><i style="width:${Math.min(100,100*a/b)}%"></i></span><em>${Math.min(a,b)}/${b}</em></div>`;}).join('');
  return h+`<div class="myst"><h3>❓ Mystery DNA <small>secret powers you unlock by what you do</small></h3><div class="mgrid">${cards}</div></div>`;};}
(function(){const st=document.createElement('style');st.textContent=`
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:8px}.lcard{display:flex;flex-direction:column;align-items:center;gap:2px;background:#0006;border:3px solid var(--tc);border-radius:14px;padding:12px 8px;color:inherit;cursor:pointer}.lcard:hover{background:#ffffff12}.lcard .li{font-size:40px}.lcard small{opacity:.7}
.myst{margin-top:12px;background:#0005;border-radius:12px;padding:8px 12px}.myst h3{margin:2px 0 8px}.myst h3 small{font-weight:normal;opacity:.6;font-size:12px;text-transform:none;letter-spacing:0}
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px}.mcard{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px;background:repeating-linear-gradient(45deg,#1a1a22,#1a1a22 8px,#20202a 8px,#20202a 16px);border:2px dashed #6a6a8a;border-radius:12px;padding:10px 8px;cursor:help}
.mcard .mi{font-size:34px}.mcard small{font-size:12px;opacity:.85}.mcard em{font-style:normal;font-size:11px;opacity:.7}.mcard.on{background:#0006;border:2px solid var(--mc);box-shadow:0 0 14px var(--mc)}
.mbar{display:block;width:100%;height:5px;background:#ffffff18;border-radius:3px;overflow:hidden;margin-top:4px}.mbar i{display:block;height:100%;background:#c27bff}`;document.head.appendChild(st);})();
