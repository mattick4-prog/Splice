// ================= SURVIVOR CAMPS, WARINESS, JOBS, RECRUITS =================
const CAMP_NAMES=[[{name:'Hilltop Camp',leader:'Marta'},{name:'Rail Yard Camp',leader:'Gus'}],[{name:'Stilt Village',leader:'Old Remy'},{name:'Floating Market',leader:'Dee'}],
  [{name:'Ice Fort',leader:'Sven'},{name:'Chapel of Snow',leader:'Sister Ana'}],[{name:'Oasis Camp',leader:'Rafi'},{name:'Bus Fort',leader:'Lou'}],[{name:'Rooftop Commune',leader:'Kit'},{name:'Subway Shelter',leader:'Dante'}]];
const NPC_NAMES=['Jo','Priya','Hank','Lena','Mo','Tess','Abe','Rosa','Kai','Wren','Otis','June','Ezra','Nell','Bo','Ivy','Sal','Rue','Cy','Dot'];
const ROLES={
  mechanic:{name:'Mechanic',icon:'🔧',desc:'Repairs your base and windows a little every second.'},
  medic:{name:'Medic',icon:'🩺',desc:'You heal faster inside your base, and she makes 1 meds every dawn.'},
  scout:{name:'Scout',icon:'🔭',desc:'Shows every monster in town on your minimap and marks unsearched containers.'},
  cook:{name:'Cook',icon:'🍳',desc:'Cooks 1 food every dawn so you don\'t starve.'},
  guard:{name:'Guard',icon:'🛡️',desc:'Defends your base like an extra turret and shoots anything that climbs inside.'},
  scavenger:{name:'Scavenger',icon:'🎒',desc:'Brings back 2 random supplies every dawn.'}
};
const TIERS_W=[
  {min:80,name:'TRUSTED',col:'#7dff9a',desc:'They trust you. Best prices, all jobs, recruits will join you.',mul:.8},
  {min:60,name:'UNEASY',col:'#ffd166',desc:'They\'ve noticed something off. Prices are higher, guards watch you, and recruits need more convincing.',mul:1.2},
  {min:40,name:'WARY',col:'#ffb347',desc:'They want proof you\'re still human before they deal with you. Prices are high. No recruits.',mul:1.5},
  {min:20,name:'HOSTILE',col:'#ff5a68',desc:'They see a monster. Guards shoot on sight. Glass Skin or hiding can get you past them.',mul:0},
  {min:0,name:'FEARED',col:'#c27bff',desc:'They are terrified of you. They hide and leave tribute so you\'ll pass them by.',mul:0}
];
/* standing: replaced later */
function wTier(c){const s=standing(c);return TIERS_W.find(t=>s>=t.min);}
function makeCamps(){
  const T=TOWNS[S.town];if(T.arena)return [];const names=T.campNames||CAMP_NAMES[{Millbrook:0,Saltmarsh:1,Frostfall:2,Dustbowl:3,'Old Haven':4}[T.name]||0],out=[];
  for(let i=0;i<2;i++){
    for(let k=0;k<400;k++){
      const x=rnd(180,WW-180),y=rnd(180,WH-180);
      if(Math.hypot(x-BASE.x,y-BASE.y)<420)continue;
      if(S.blds.some(b=>rectDist({x,y},{x:b.x-30,y:b.y-30,w:b.w+60,h:b.h+60})<150))continue;
      if(nearRoad(x,y,S.roads?70:150))continue;if(S.blds.some(b=>b.boss&&Math.hypot(b.x+b.w/2-x,b.y+b.h/2-y)<650))continue;if(out.some(o=>Math.hypot(o.x-x,o.y-y)<600))continue;
      const N=names[i];
      const c={id:'camp'+i,name:N.name,leader:N.leader,x,y,r:120,rep:0,tested:false,raided:false,hostile:false,visited:false,tribute:true,rumorDay:-1,
        offers:makeOffers(),jobs:[],recruits:[],guards:[0,1,2].map(g=>({a:g*2.1+.5,cd:rnd(0,1),aim:0})),npcs:[]};
      c.recruits=[0,1].map(()=>({name:pick(NPC_NAMES),role:pick(Object.keys(ROLES))}));
      for(let j=0;j<3;j++)c.jobs.push(makeJob(c));
      out.push(c);break;
    }
  }
  decor=decor.filter(d=>!out.some(c=>Math.hypot(d.x-c.x,d.y-c.y)<c.r+30));
  S.cars=S.cars.filter(car=>!out.some(c=>Math.hypot(car.x-c.x,car.y-c.y)<c.r+50));
  return out;
}
function makeOffers(){
  const all=[[{wood:3},{meds:2}],[{scrap:2},{ammo:5}],[{food:3},{fuel:1}],[{wire:2},{mutagen:1}],[{scrap:4},{wire:2}],[{meds:2},{food:3}],[{fuel:1},{scrap:3}],[{food:2},{wood:3}]];
  return all.sort(()=>Math.random()-.5).slice(0,5).map(([give,get])=>({give,get,stock:2}));
}
function makeJob(c){
  const r=Math.random(),cand=S.blds.filter(b=>!b.boss&&!b.mimicBld&&b.monster);
  if(r<.35&&cand.length){const b=pick(cand);return {type:'kill',bld:b.id,text:'Kill the '+MONSTERS[b.monster].name+' living in the '+b.name+'.',rew:rollReward(),rep:20,camp:c.id,state:'open'};}
  if(r<.6){const k=pick(['food','wood','scrap','meds']),n=k==='meds'?2:irnd(3,5);return {type:'fetch',res:k,n,text:'Bring '+n+' '+k+' to the camp.',rew:rollReward(),rep:15,camp:c.id,state:'open'};}
  if(r<.8&&cand.length){const b=pick(cand);return {type:'rescue',bld:b.id,who:pick(NPC_NAMES),text:'',rew:rollReward(),rep:25,camp:c.id,state:'open'};}
  const n=irnd(4,7);return {type:'hunt',n,got:0,text:'Kill '+n+' monsters anywhere in town.',rew:rollReward(),rep:15,camp:c.id,state:'open'};
}
function rollReward(){const r=rollTable({meds:2,ammo:2,food:2,wire:1,fuel:1,mutagen:1},2);if(Math.random()<.2)r.key=1;return r;}
function rewardText(r){return Object.keys(r).map(k=>k==='key'?'🔑 car keys':(r[k]+' '+RES_ICON[k])).join(' + ');}
function jobText(j){return j.type==='rescue'?'Find '+j.who+', who went into the '+S.blds.find(b=>b.id===j.bld).name+' and never came back.':j.type==='hunt'?j.text+' ('+j.got+'/'+j.n+')':j.text;}
function campOf(id){return S.camps.find(c=>c.id===id);}
function nearCamp(){const P=S.P;if(P.sc!=='out')return null;return S.camps.find(c=>!c.raided&&Math.hypot(P.x-c.x,P.y-c.y)<c.r)||null;}
function activeJobs(){return S.jobs.filter(j=>j.state==='active'||j.state==='done');}
function acceptJob(c,i){
  const j=c.jobs[i];if(!j||activeJobs().length>=3)return;j.state='active';S.jobs.push(j);
  if(j.type==='rescue'){const I=S.interiors[j.bld];if(I){const p=I.props.find(q=>!q.dead)||{x:I.x+I.w/2,y:I.y+I.h/2,w:0,h:0};
    S.lost.push({x:clamp(I.x+I.w*.75,I.x+60,I.x+I.w-60),y:I.y+I.h*.35,sc:j.bld,name:j.who,job:j,found:false});}}
  toast('Job accepted: '+jobText(j),'good');
}
function completeJob(j){
  const c=campOf(j.camp);j.state='paid';{const L=tlog();if(c&&!L.campsHelped.includes(c.id))L.campsHelped.push(c.id);}S.jobs=S.jobs.filter(x=>x!==j);if(c){c.jobs=c.jobs.filter(x=>x!==j);c.jobs.push(makeJob(c));c.rep=Math.min(60,c.rep+j.rep);}
  S.path.hunter+=.5;const r={...j.rew};const key=r.key;delete r.key;const parts=giveRes(r,S.P.x,S.P.y-30);if(key)giveKey();
  banner('JOB DONE',(c?c.leader+' pays you: ':'')+(parts.join(', ')||'thanks')+(key?' and a set of car keys':'')+'. They trust you more.','#7dff9a');
  if(j.type==='rescue'&&c&&c.recruits.length<3){c.recruits.push({name:j.who,role:pick(Object.keys(ROLES))});toast(j.who+' wants to join your crew. Talk to '+c.leader+'.','good');}
}
function jobOnKill(e){
  S.jobs.forEach(j=>{if(j.state!=='active')return;
    if(j.type==='kill'&&e.home&&e.home.id===j.bld){j.state='done';toast('Job ready: go back to '+campOf(j.camp).name+' to get paid.','good');}
    if(j.type==='hunt'&&e.kind==='monster'){j.got++;if(j.got>=j.n){j.state='done';toast('Job ready: go back to '+campOf(j.camp).name+' to get paid.','good');}}});
  if(e.kind==='monster')S.camps.forEach(c=>{if(!c.raided&&!c.hostile&&Math.hypot(e.x-c.x,e.y-c.y)<c.r+200&&e.sc==='out'){c.rep=Math.min(60,c.rep+2);}});
  if(e.campId){const c=campOf(e.campId);if(c&&!c.raided&&!S.enemies.some(x=>!x.dead&&x.campId===c.id))raidCamp(c,true);}
}
function raidCamp(c,fought){
  c.raided=true;c.hostile=false;{const L=tlog();if(!L.campsRaided.includes(c.id))L.campsRaided.push(c.id);}
  const parts=giveRes(rollTable({food:3,meds:2,ammo:2,scrap:2,wood:2,fuel:1,wire:1,mutagen:1},S.mode==='monster'?4:7),c.x,c.y-30);
  if(S.mode==='monster'){S.biomass+=20;S.fear=Math.min(100,S.fear+12);banner(c.name.toUpperCase()+' RAIDED','+20 biomass. The survivors who lived scatter into the swamp and fields.','#c27bff');}
  else{humanityHit(fought?6:10);S.path.apex+=1;banner(c.name.toUpperCase()+' RAIDED','You took everything: '+parts.join(', ')+'. Word will spread.','#ff5a68');
    S.camps.forEach(o=>{if(o!==c)o.rep=Math.max(-60,o.rep-25);});}
  S.jobs=S.jobs.filter(j=>j.camp!==c.id);S.lost=S.lost.filter(l=>l.job.camp!==c.id);
}
function makeCampHostile(c){
  if(c.hostile||c.raided)return;c.hostile=true;
  c.guards.forEach(g=>{const h=spawnHuman('hunter',c.x+Math.cos(g.a)*c.r*.8,c.y+Math.sin(g.a)*c.r*.8,null);h.campId=c.id;h.alert=99;h.hx=c.x;h.hy=c.y;});
  for(let i=0;i<2;i++){const h=spawnHuman(i?'torch':'trapper',c.x+rnd(-40,40),c.y+rnd(-40,40),null);h.campId=c.id;h.alert=99;h.hx=c.x;h.hy=c.y;}
  banner(c.name.toUpperCase()+' OPENS FIRE',S.mode==='monster'?'Break their camp.':'They see a monster now. Fight, flee, or hide.','#ff5a68');
}
function updateCamps(dt){
  const P=S.P;
  S.camps.forEach(c=>{if(c.raided)return;
    const d=Math.hypot(P.x-c.x,P.y-c.y),T=wTier(c);
    if(S.mode==='hunter'&&!c.hostile&&P.sc==='out'&&!P.dead){
      if(d<c.r+40&&!c.visited){c.visited=true;vanceCampHook(c);banner(c.name.toUpperCase(),'Survivors! '+c.leader+' runs this camp. Walk up and press E to talk. They see you as '+T.name+'.',T.col);}
      if(T.name==='HOSTILE'&&d<300&&P.invisT<=0&&!P.hidden)makeCampHostile(c);
    }
    if(!c.hostile&&S.mode==='hunter')c.guards.forEach(g=>{g.cd-=dt;const gx=c.x+Math.cos(g.a)*c.r*.85,gy=c.y+Math.sin(g.a)*c.r*.85;
      const e=nearestFoe({x:gx,y:gy,sc:'out'},270);if(e&&e.kind==='monster'&&!e.boss){g.aim=Math.atan2(e.y-gy,e.x-gx);if(g.cd<=0){g.cd=1.3;S.proj.push({x:gx,y:gy,vx:Math.cos(g.aim)*560,vy:Math.sin(g.aim)*560,r:3,dmg:8,owner:'p',life:.6,color:'#ffe08a',sc:'out',turret:true,bullet:true});}}});
  });
  // rescue NPCs
  S.lost.forEach(l=>{if(l.found)return;if(P.sc===l.sc&&dist(P,l)<40){l.found=true;l.job.state='done';banner(l.name.toUpperCase()+' FOUND','"Thank you! I\'ll run back to camp." Go back to '+campOf(l.job.camp).name+' to finish the job.','#7dff9a');}});
  S.lost=S.lost.filter(l=>!l.found);
}
// ---------- crew ----------
function crewHas(role){return S.crew.some(m=>m.role===role&&!m.dead);}
function updateCrew(dt){
  const B=S.baseInt;if(!B)return;
  S.crew.forEach(m=>{if(m.dead)return;if(m.hp!==undefined&&m.hp<=0){m.dead=true;banner(m.name.toUpperCase()+' IS DEAD','Something got inside and your '+ROLES[m.role].name.toLowerCase()+' didn\'t make it.','#ff5a68');return;}if(m.x===undefined||!inRect(m.x,m.y,B)){m.x=B.x+rnd(120,B.w-120);m.y=B.y+rnd(140,B.h-120);m.sc='base';m.hp=40;m.r=11;}
    m.wT=(m.wT||0)-dt;if(m.wT<=0){m.wT=rnd(2,5);m.tx=B.x+rnd(100,B.w-100);m.ty=B.y+rnd(120,B.h-100);}
    const dx=m.tx-m.x,dy=m.ty-m.y,d=Math.hypot(dx,dy);if(d>4){m.x+=dx/d*40*dt;m.y+=dy/d*40*dt;m.fa=Math.atan2(dy,dx);}
    pushOut(m,solidsFor('base'));
    if(m.role==='guard'){m.cd=(m.cd||0)-dt;const e=nearestFoe({x:m.x,y:m.y,sc:'base'},300);if(e&&m.cd<=0){m.cd=1.1;const a=Math.atan2(e.y-m.y,e.x-m.x);m.fa=a;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*560,vy:Math.sin(a)*560,r:3,dmg:9,owner:'p',life:.6,color:'#ffe08a',sc:'base',bullet:true});}}
  });
  if(S.mode==='hunter'){
    if(crewHas('mechanic')){S.baseHp=Math.min(baseMax(),S.baseHp+2*dt);S.windows.forEach(w=>{if(w.hp>0)w.hp=Math.min(winMax(),w.hp+3*dt);});}
    if(crewHas('medic')&&S.P.sc==='base'&&!S.P.dead)S.P.hp=Math.min(maxHp(),S.P.hp+4*dt);
  }
}
function crewDawn(){
  if(S.mode!=='hunter')return;
  const gone=[];
  S.crew.forEach(m=>{if(m.dead)return;
    if(S.humanity<30&&Math.random()<.5){m.dead=true;m.left=true;gone.push(m);return;}
    if(m.role==='medic'){S.res.meds++;}
    if(m.role==='cook'){S.res.food++;}
    if(m.role==='scavenger'){const k1=pick(['wood','scrap','wire','food','ammo']),k2=pick(['wood','scrap','food','meds']);S.res[k1]++;S.res[k2]++;}});
  if(gone.length)toast(gone.map(m=>m.name+' the '+ROLES[m.role].name).join(' and ')+(gone.length>1?' left':' left')+' in the night. They said they saw what you\'re turning into.','bad');
  const made=[];if(crewHas('medic'))made.push('+1 meds');if(crewHas('cook'))made.push('+1 food');if(crewHas('scavenger'))made.push('+2 supplies');
  if(made.length)toast('Your crew got to work: '+made.join(', ')+'.','good');
  S.crew=S.crew.filter(m=>!m.dead);
  S.camps.forEach(c=>{c.offers.forEach(o=>o.stock=2);c.tribute=true;});
}
// ---------- camp UI ----------
function openCamp(c){S.campOpen=c.id;openPanel('camp');}
function costScaled(give,mul){const o={};for(const k in give)o[k]=Math.max(1,Math.ceil(give[k]*mul));return o;}
function campHtml(){
  const c=campOf(S.campOpen);if(!c)return '<div class="card">Gone.</div>';
  const T=wTier(c),st=Math.round(standing(c));
  const meter=`<div style="position:relative;height:16px;border-radius:8px;background:linear-gradient(90deg,#c27bff 0 20%,#ff5a68 20% 40%,#ffb347 40% 60%,#ffd166 60% 80%,#7dff9a 80%);margin:8px 0 4px">
    <div style="position:absolute;top:-4px;left:calc(${st}% - 3px);width:6px;height:24px;background:#fff;border-radius:3px;box-shadow:0 0 0 2px #000"></div></div>
    <div class="tks"><span style="left:10%">FEARED</span><span style="left:30%">HOSTILE</span><span style="left:50%">WARY</span><span style="left:70%">UNEASY</span><span>TRUSTED</span></div>`;
  let body='';
  if(T.name==='FEARED'){
    body=`<section><h3>Tribute</h3><p>Nobody comes out. A crate sits by the fire with a note: <em style="color:var(--monster)">"Please. Take it and go."</em></p>
      ${c.tribute?`<button class="btn" data-a="tribute">Take the tribute</button>`:'<p class="mute">You already took today\'s tribute. More tomorrow.</p>'}
      <p class="mute" style="margin-top:12px">Or you could take everything they have. That would cost you humanity, and the other camps would hear about it.</p><button class="btn ghost" data-a="raid">Raid the camp</button></section>`;
  }else if(T.name==='WARY'&&!c.tested){
    body=`<section><h3>Blood test</h3><p>${c.leader} won't talk until their medic takes a sample. "No offense. We've seen what happens."</p>
      <button class="btn" data-a="btest" ${S.res.meds>=1?'':'disabled'}>Give blood (uses 1 meds for the needle)</button></section>`;
  }else{
    const mul=T.mul,tab=S.campTab||'trade';
    const tabs=`<div class="row" style="margin:10px 0 14px">${[['trade','🤝 Trade'],['jobs','📋 Jobs ('+c.jobs.length+')'],['recruit','👥 Recruits ('+c.recruits.length+')'],['rumors','👂 Rumors']].map(([k,l])=>`<button class="btn sm ${tab===k?'gold':'ghost'}" data-a="ctab" data-t="${k}">${l}</button>`).join('')}</div>`;
    let inner='';
    if(tab==='trade')inner=c.offers.map((o,i)=>{const g=costScaled(o.give,mul);
      return `<div class="act"><div><b>${Object.keys(g).map(k=>g[k]+' '+RES_ICON[k]+' '+k).join(' + ')}</b>  →  <b style="color:var(--toxic)">${offerTxt(o.get)}</b>${o.market?' <span class="tag" style="color:var(--gold)">🏪 TRADING POST</span>':''}<small>${o.stock} left today</small></div>
        <button class="btn sm" data-a="trade" data-i="${i}" ${o.stock>0&&canPay(g)?'':'disabled'}>Trade</button></div>`;}).join('')+`<p class="mute" style="margin-top:8px">Prices ×${mul} because they see you as ${T.name}.</p>`;
    else if(tab==='jobs'){
      const mine=S.jobs.filter(j=>j.camp===c.id);
      inner=(mine.length?'<h3>Your jobs here</h3>'+mine.map(j=>`<div class="act"><div><b>${jobText(j)}</b><small>Reward: ${rewardText(j.rew)} · +trust</small></div>${j.type==='fetch'?`<button class="btn sm" data-a="deliver" data-j="${c.jobs.indexOf(j)}" ${S.res[j.res]>=j.n?'':'disabled'}>Hand over</button>`:j.state==='done'?`<button class="btn sm gold" data-a="payjob" data-j="${c.jobs.indexOf(j)}">Get paid</button>`:'<span class="tag">IN PROGRESS</span>'}</div>`).join(''):'')+
        '<h3 style="margin-top:12px">Job board</h3>'+(c.jobs.filter(j=>j.state==='open').map(j=>`<div class="act"><div><b>${jobText(j)}</b><small>Reward: ${rewardText(j.rew)} · +trust</small></div><button class="btn sm" data-a="takejob" data-j="${c.jobs.indexOf(j)}" ${activeJobs().length<3?'':'disabled'}>Take job</button></div>`).join('')||'<p class="mute">No open jobs.</p>')+
        `<p class="mute" style="margin-top:8px">You can work 3 jobs at once. Jobs show on your map and at the top of the screen.</p>`;}
    else if(tab==='recruit'){
      const ok=T.name==='TRUSTED'||(T.name==='UNEASY'&&c.rep>=20);
      inner=(ok?'':`<p style="color:var(--blood)">${T.name==='UNEASY'?'They need to trust you more first. Do a job or two (trust '+Math.round(c.rep)+'/20).':'Nobody here will follow someone they\'re wary of.'}</p>`)+
        c.recruits.map((r,i)=>`<div class="wp"><div class="ic">${ROLES[r.role].icon}</div><div><b style="font-size:19px">${r.name} · ${ROLES[r.role].name}</b><small>${ROLES[r.role].desc}</small><small>Wants 2 🥫 food to come with you. Crew: ${S.crew.length}/4.</small></div>
          <button class="btn sm" data-a="hire" data-i="${i}" ${ok&&S.res.food>=2&&S.crew.length<4?'':'disabled'}>Recruit</button></div>`).join('')+
        `<p class="mute" style="margin-top:8px">Recruits live in your base and ride with you in the truck. If something gets inside at night, they can die. If your humanity drops below 30, they might leave.</p>`;}
    else{const today=S.stats.days;inner=c.rumorDay===today?`<p>"${c.rumor}"</p><p class="mute">Come back tomorrow for more news.</p>`:`<button class="btn" data-a="rumor">Ask ${c.leader} what they've heard</button>`;}
    body=tabs+`<section>${inner}</section>`;
  }
  return `<div class="card">${head(c.name+' · '+c.leader+'\'s camp',c.name)}
    <p style="margin:8px 0 0">They see you as <b style="color:${T.col}">${T.name}</b>. ${T.desc}</p>${meter}
    <p class="mute" style="font-size:15px">Standing ${st}/100 comes from your humanity (${Math.round(S.humanity)}) plus their trust in you (${c.rep>=0?'+':''}${Math.round(c.rep)}). Jobs raise trust. Raiding camps destroys it.</p>${body}</div>`;
}
function makeRumor(c){
  const mim=S.blds.find(b=>b.mimicBld&&!b.awake),key=S.cars.find(x=>x.drivable&&!S.keys[x.id]),T=TOWNS[S.town];
  const opts=[];
  if(mim)opts.push('Somebody swore they saw the '+mim.name+' breathe. Like a chest going up and down. I stay away from that one.');
  if(key)opts.push('There\'s a '+CARTYPES[key.type].cname+' '+CARTYPES[key.type].name.toLowerCase()+' out there that still runs. The keys are in a glovebox or a locker somewhere in town.');
  opts.push(MONSTERS[T.boss].name+' lives in '+T.lair+'. Don\'t go near it until you have real powers.');
  const rk=Object.keys(RECIPES).filter(k=>!S.recipesFound.includes(k));if(rk.length){const k=pick(rk),[a,b]=k.split('|');opts.push('An old scientist said if you mix '+FAM[a].name+' and '+FAM[b].name+' blood together, you get something new. Called it '+RECIPES[k].name+'.');}
  opts.push('Monsters drop cleaner DNA at night. Even cleaner under a blood moon. Not that you\'d want any of that.');
  opts.push('The other camp, '+(S.camps.find(o=>o!==c)||c).name+', is good people. Mostly.');
  return pick(opts);
}
function campAct(a,d){
  const c=campOf(S.campOpen);if(!c)return false;const T=wTier(c);
  if(a==='ctab'){S.campTab=d.t;return true;}
  if(a==='trade'){const o=c.offers[+d.i],g=costScaled(o.give,T.mul);if(o.stock>0&&canPay(g)){pay(g);giveOffer(o.get);o.stock--;toast('Traded.','good');}return true;}
  if(a==='takejob'){acceptJob(c,+d.j);return true;}
  if(a==='deliver'){const j=c.jobs[+d.j];if(j&&S.res[j.res]>=j.n){S.res[j.res]-=j.n;completeJob(j);}return true;}
  if(a==='payjob'){const j=c.jobs[+d.j];if(j&&j.state==='done')completeJob(j);return true;}
  if(a==='hire'){const r=c.recruits[+d.i];if(r&&S.res.food>=2&&S.crew.length<4){S.res.food-=2;S.crew.push({name:r.name,role:r.role});c.recruits.splice(+d.i,1);banner(r.name.toUpperCase()+' JOINED YOUR CREW',ROLES[r.role].name+': '+ROLES[r.role].desc,'#7dff9a');}return true;}
  if(a==='rumor'){c.rumor=S.town===2&&!S.flags.wardenRumor?'There\'s a dam past the mountains. Something huge stands on top of it, wearing pieces of every monster we\'ve ever seen. They call it the Warden. Every state has one.':makeRumor(c);if(S.town===2)S.flags.wardenRumor=true;c.rumorDay=S.stats.days;return true;}
  if(a==='btest'){if(S.res.meds>=1){S.res.meds--;c.tested=true;c.rep+=5;toast(c.leader+': "Huh. Still human. Barely. Fine, let\'s talk."');}return true;}
  if(a==='tribute'){if(c.tribute){c.tribute=false;giveRes(rollTable({food:2,meds:1,ammo:1,scrap:1},3),S.P.x,S.P.y-30);toast('You took the tribute. Nobody came out.');}return true;}
  if(a==='raid'){hideOv();raidCamp(c,false);return 'closed';}
  return false;
}
// ---------- drawing ----------
function drawCamps(cam){
  S.camps.forEach(c=>{if(!onCam(c.x,c.y,c.r+60,cam))return;
    const T=wTier(c),mon=S.mode==='monster',dead=c.raided;
    ctx.fillStyle=dead?'rgba(40,30,24,.5)':'rgba(140,110,70,.35)';ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,7);ctx.fill();
    for(let i=0;i<28;i++){const a=i/28*6.28;if(i%7===5)continue;box(c.x+Math.cos(a)*c.r-3,c.y+Math.sin(a)*c.r-3,6,6,dead?'#3a2a20':'#8a6236',1,1.5);}
    [[-50,-40,'#d98a3a'],[45,-45,'#4a8acd'],[-10,50,'#7aa84a']].forEach(([dx,dy,col])=>{const x=c.x+dx,y=c.y+dy;ctx.beginPath();ctx.moveTo(x-24,y+16);ctx.lineTo(x,y-18);ctx.lineTo(x+24,y+16);ctx.closePath();fs(dead?'#3a2e26':col);if(!dead){ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-18);ctx.lineTo(x,y+16);ctx.stroke();}});
    circ(c.x+30,c.y+20,10,'#5a4a3a',2);
    if(!dead){for(let i=0;i<3;i++){ctx.fillStyle=['#ffd166','#ff7a2f','#ff4d3a'][i];ctx.beginPath();ctx.arc(c.x+30+Math.sin(S.t*8+i)*3,c.y+16-i*4,6-i*1.5,0,7);ctx.fill();}}
    box(c.x-70,c.y+10,20,16,'#a67c4e',2,2);box(c.x-48,c.y+14,16,12,'#a67c4e',2,2);
    if(!dead&&!c.hostile&&!(T.name==='FEARED'&&!mon)){
      const npc=(x,y,col,gun)=>{circ(x,y,10,col,2);circ(x+2,y,5.5,'#e8c09a',1.5);if(gun){ctx.strokeStyle='#333';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+4,y+3);ctx.lineTo(x+18,y+3);ctx.stroke();}};
      npc(c.x+10,c.y+28,'#c84a4a');label(c.leader,c.x+10,c.y+50,'#efe9dc',12);
      c.recruits.forEach((r,i)=>{npc(c.x-30+i*22,c.y-4,'#6a8aaa');});
      c.guards.forEach(g=>{const gx=c.x+Math.cos(g.a)*c.r*.85,gy=c.y+Math.sin(g.a)*c.r*.85;ctx.save();ctx.translate(gx,gy);ctx.rotate(g.aim);npc(0,0,'#5f7f4a',true);ctx.restore();});
    }
    if(T.name==='FEARED'&&!mon&&!dead&&c.tribute){box(c.x-14,c.y-10,28,22,'#c49a62',3,2);label('TRIBUTE',c.x,c.y-16,'#c27bff',12);}
    ctx.font='700 16px "Barlow Condensed",sans-serif';const nm=c.name.toUpperCase(),tw=ctx.measureText(nm).width+20;
    box(c.x-tw/2,c.y-c.r-38,tw,24,dead?'#3a3028':'#6a4a2a',4,2);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(nm,c.x,c.y-c.r-21);
    if(!mon)label(dead?'RAIDED':c.hostile?'HOSTILE · SHOOTING ON SIGHT':'They see you as '+T.name,c.x,c.y-c.r-44,dead?'#888':c.hostile?'#ff5a68':T.col,13);
  });
}
function drawLost(sc){
  S.lost.forEach(l=>{if(l.sc!==sc)return;const bob=Math.sin(S.t*3)*2;circ(l.x,l.y+bob,11,'#d8b46a',2);circ(l.x+2,l.y+bob,6,'#e8c09a',1.5);label('HELP! ('+l.name+')',l.x,l.y-20,'#7dff9a',13);});
}
/* drawCrew: replaced later */
