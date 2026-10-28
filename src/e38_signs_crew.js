// ================= MONSTER SIGNS THAT STICK AND DO THINGS · TALKING TO YOUR CREW =================
// ---------- 1) eyes / claws / spikes: they grow below 75/50/25 and only pull back when you climb 10 higher ----------
const SIGN_AT=[75,50,25];
function signStage(){return S.signStage||0;}
function signTick(){if(S.mode!=='hunter')return;let st=signStage();const h=S.humanity;
  while(st<3&&h<SIGN_AT[st]){st++;const msg=['','👁️ Your eyes glow now. You can see in the dark.','🦴 CLAWS. Your fingers split and harden. Your melee hits do +25% damage, and people can see them.','🦔 Spikes push out of your back. Anything that hits you gets cut.'][st];
    banner(['','GLOWING EYES','YOU GREW CLAWS','BACK SPIKES'][st],msg.slice(2),'#c27bff');}
  while(st>0&&h>=SIGN_AT[st-1]+10){toast(['','👁️ The glow fades from your eyes.','🦴 Your claws pull back in. Just hands again.','🦔 The spikes on your back soften and drop off.'][st],'good');st--;}
  if(st!==S.signStage)S.signStage=st;S.hstage=3;
  // heads-up before the next one
  const nx=SIGN_AT[st];if(nx!==undefined&&h<nx+8&&h>=nx&&S.signWarn!==st+'_'+S.day){S.signWarn=st+'_'+S.day;toast('⚠️ Humanity '+Math.round(h)+'. '+['Your eyes','Claws','Spikes'][st]+' will appear below '+nx+'.','bad');}}
{let acc=0;const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);acc+=dt;if(acc>.5){acc=0;try{signTick();}catch(e){}}};}
// everything that DRAWS a sign uses the sticky stage, not the raw number
function signHum(){return [100,74,49,24][signStage()];}
function withSignHum(fn){const h=S.humanity;S.humanity=Math.min(h,signHum());if(signStage()===0)S.humanity=Math.max(h,75);try{return fn();}finally{S.humanity=h;}}
{const _dp=drawPlayer;drawPlayer=function(){if(S.mode!=='hunter')return _dp();return withSignHum(_dp);};}
{const _bc=bodyChanges;bodyChanges=function(){if(!S||S.mode!=='hunter')return _bc();return withSignHum(_bc);};}
{const _bs=bodySvg;bodySvg=function(){if(S.mode!=='hunter')return _bs();let s=withSignHum(_bs);
  if(signStage()>=2)s=s.replace('</svg>',`<g class="mut" title="🦴 Claws: +25% melee damage. People can see them."><path d="M50 186 l-6 16 l10 -10 Z M57 190 l-1 18 l7 -14 Z M64 189 l5 16 l-1 -15 Z M150 186 l6 16 l-10 -10 Z M143 190 l1 18 l-7 -14 Z M136 189 l-5 16 l1 -15 Z" fill="#f4f0ff" stroke="#3a2a4a" stroke-width="1.5"/></g></svg>`);
  return s;};}
// the signs do something
BODY_HUM[0][3]='Below 75 humanity your eyes glow. You can see in the dark (free Night Eyes).';
BODY_HUM[1][3]='Below 50 humanity you grow claws: +25% melee damage. People notice.';
BODY_HUM[2][3]='Below 25 humanity spikes grow on your back: anything that hits you takes damage (free Thorn Skin).';
{const _ht=hasTrait;hasTrait=function(id){if(S&&S.mode==='hunter'){if(id==='nighteyes'&&signStage()>=1)return true;if(id==='thornskin'&&signStage()>=3)return true;}return _ht(id);};}
{const _df=dmgFoe;dmgFoe=function(e,amt,src,quiet,opt){if(opt&&opt.melee&&S.mode==='hunter'&&signStage()>=2)amt*=1.25;return _df(e,amt,src,quiet,opt);};}
saveExt(d=>{d.signStage=S.signStage||0;});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();S.signStage=d.signStage!==undefined?d.signStage:(S.humanity<25?3:S.humanity<50?2:S.humanity<75?1:0);}}catch(e){}return ok;};}
// ---------- 2) talk to your crew ----------
const CREW_LINES={
  happy:['"Honestly? This shack is starting to feel like home."','"I saw a deer this morning. A real one. Things are coming back."','"You know you hum when you sequence DNA? It\'s nice."','"I used to be a teacher, before. Kids would\'ve loved those lab machines."'],
  tips:['"The scout says some houses have people hiding in them. Bring food."','"Heard if you heal enough bitten people, something wakes up inside you. A good something."','"Gate guards go easier if your vault isn\'t stuffed with monster DNA."','"Search enough drawers and you learn to move like a ghost. That\'s what my grandma said, anyway."','"Monsters hit the window that\'s glowing. Watch the glow."'],
  scared:['"Your eyes… they glow when you\'re angry. Did you know that?"','"I\'m not leaving. Yet. Just… don\'t do the thing with the claws near me."','"Some of the others are talking about leaving."'],
  turned:['"…hungry… but I wait. For you."','"The others… smell afraid. I like it."','"I remember a song. From before. Not the words."','"Tell me who. I will go."']};
function crewMood(m){if(m.morale===undefined)m.morale=70;return m.morale;}
function nearCrewMember(){const P=S.P;let best=null,bd=48;
  if(P.sc==='base')S.crew.forEach(m=>{if(m.dead||isFollower(m)||m.x===undefined)return;const d=Math.hypot(P.x-m.x,P.y-m.y);if(d<bd){bd=d;best=m;}});
  S.allies.forEach(a=>{if(!a.crewRef||a.dead||a.sc!==P.sc)return;const d=Math.hypot(P.x-a.x,P.y-a.y);if(d<bd){bd=d;best=a.crewRef;}});return best;}
function crewHtml(){const m=S.crewOpen;if(!m||m.dead||!S.crew.includes(m)){S.panel=null;return '<div class="card"></div>';}
  const mo=crewMood(m),R=ROLES[m.role]||{icon:'🙂',name:'Helper',desc:''},tn=m.turned,f=isFollower(m);
  const line=m.lastLine||(tn?pick(CREW_LINES.turned):S.humanity<45?pick(CREW_LINES.scared):pick(CREW_LINES.happy));m.lastLine=line;
  const row=(a,ic,t,sub,ok,col,extra)=>`<button class="hopt" data-a="${a}" ${extra||''} ${ok?'':'disabled'} style="--hc:${col}"><span>${ic}</span><div><b>${t}</b><small>${sub}</small></div></button>`;
  const roles=Object.keys(ROLES).map(k=>`<button class="btn sm ${m.role===k?'gold':'ghost'}" data-a="crewrole" data-r="${k}" title="${ROLES[k].desc}">${ROLES[k].icon} ${ROLES[k].name}</button>`).join('');
  return `<div class="card">${head((tn?'Your mutant':'Your crew')+' · Esc to close',(tn?'🧬 ':R.icon+' ')+m.name,tn?'#c27bff':'#7fc8ff')}
  <div class="sview"><div class="sface" style="${tn?'background:radial-gradient(#d8c0f0,#7a5a9a)':''}">${tn?'👁️':mo>60?'😊':mo>30?'😐':'😟'}</div><div style="flex:1">
    <p class="ssay">${line}</p><div class="schips"><span class="schip">${R.icon} ${R.name}</span><span class="schip ${f?'ok':''}">${f?'🐾 with you':'🏠 at your cabin'}</span></div>
    <div title="Mood. Below 20, they might leave in the night." style="margin-top:6px"><div class="dbar"><i style="width:${mo}%;background:${mo>60?'#7dff9a':mo>30?'#ffd166':'#ff5a68'}"></i></div><small class="mute">Mood ${Math.round(mo)} / 100</small></div></div></div>
  <div class="hopts">
    ${row('crewchat','💬','Talk','Hear what\'s on their mind. Sometimes they know things. (+mood, once a day)',m.chatDay!==S.day,'#7fc8ff')}
    ${row('crewfeed','🍲','Share a meal','1 food. +15 mood.',S.res.food>0,'#7fc8ff')}
    ${row('crewfollow2','🐾',f?'Send them home':'"Come with me"',f?'They go back to guard and work at your cabin.':'They follow you and fight. They stop doing their cabin job while away.',true,'#7fc8ff')}
    ${row('crewbye','👋','Let them go',tn?'They wander off into the dark. You might see them again… on the other side.':'They walk back to a camp. No hard feelings.',true,'#ff8a95')}
  </div><h4 style="margin:12px 0 6px">🛠️ Job at the cabin</h4><div class="row" style="gap:6px;flex-wrap:wrap">${roles}</div>
  <p class="mute" style="margin:6px 0 0;font-size:13px">${R.desc}</p></div>`;}
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='crewtalk'){showOv(crewHtml(),'panel');return;}_rp();};}
{const _in=interact;interact=function(){if(S.mode==='hunter'&&!S.P.dead){const m=nearCrewMember();if(m){S.crewOpen=m;m.lastLine=null;openPanel('crewtalk');return;}}_in();};}
{const _act=act;act=function(a,d){const m=S.crewOpen;
  if(m&&a==='crewchat'&&m.chatDay!==S.day){m.chatDay=S.day;m.morale=Math.min(100,crewMood(m)+6);m.lastLine=m.turned?pick(CREW_LINES.turned):Math.random()<.5?pick(CREW_LINES.tips):pick(S.humanity<45?CREW_LINES.scared:CREW_LINES.happy);refreshPanel();return;}
  if(m&&a==='crewfeed'&&S.res.food>0){S.res.food--;m.morale=Math.min(100,crewMood(m)+15);m.lastLine=m.turned?'"…good. More."':'"Oh, thank you. I didn\'t want to say I was hungry."';sfx('pickup');refreshPanel();return;}
  if(m&&a==='crewfollow2'){m.follow=!isFollower(m);toast(m.follow?'🐾 '+m.name+' falls in beside you.':'🏠 '+m.name+' heads back to your cabin.','mem');hideOv();return;}
  if(m&&a==='crewbye'){S.crew=S.crew.filter(x=>x!==m);S.allies.forEach(x=>{if(x.crewRef===m)x.dead=true;});if(!m.turned){const c=S.camps.find(c=>!c.raided&&!c.brood);if(c)(c.recruits=c.recruits||[]).push({name:m.name,role:m.role});}
    toast('👋 '+m.name+(m.turned?' slips away into the dark.':' heads off to a camp.'));hideOv();return;}
  if(m&&a==='crewrole'&&ROLES[d.r]){m.role=d.r;m.lastLine='"'+ROLES[d.r].name+'? Sure. I can do that."';refreshPanel();return;}
  _act(a,d);};}
// mood over time: being kind helps, being a monster hurts
{const _od=onDawn;onDawn=function(){_od();if(S.mode!=='hunter')return;const gone=[];
  S.crew.forEach(m=>{if(m.dead)return;const mo=crewMood(m);let d=m.turned?0:(S.humanity<50?-6:-2);if(S.harmDay===S.day-1&&!m.turned)d-=6;m.morale=clamp(mo+d,0,100);
    if(!m.turned&&m.morale<20&&Math.random()<.5){m.dead=true;m.left=true;gone.push(m.name);}});
  if(gone.length)toast('😟 '+gone.join(' and ')+' packed up and left in the night. Their mood was too low.','bad');};}
// jobs pause while they're following you
{const _cd=crewDawn;crewDawn=function(){const all=S.crew,away=all.filter(m=>!m.turned&&isFollower(m));S.crew=all.filter(m=>!away.includes(m));try{_cd();}finally{const now=S.crew;S.crew=now.concat(away.filter(m=>!now.includes(m)));}};}
{const _ch=crewHas;crewHas=function(role){return S.crew.some(m=>m.role===role&&!m.dead&&!isFollower(m));};}
// show "E: talk" over crew at the cabin
{const _pt=promptText;promptText=function(){if(S.mode==='hunter'&&!S.P.dead){const m=nearCrewMember();if(m)return '💬 E: talk to '+m.name;}return _pt();};}
saveExt(d=>{if(d.crew)d.crew.forEach((c,i)=>{const m=S.crew[i];if(m){c.morale=m.morale;c.follow=m.follow;}});});
