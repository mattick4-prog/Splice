// ================= A NEW BOSS MOVES IN, FRESH SHACK, AND MORE WAYS TO LOSE A CAMP'S TRUST =================
function bossType(i){i=i===undefined?S.town:i;return (S.townLog[i]&&S.townLog[i].bossType)||TOWNS[i].boss;}
function bossName(i){return MONSTERS[bossType(i)].name;}
function spawnRisenBoss(){
  const T=TOWNS[S.town],L=tlog(),old=bossType(),oldM=MONSTERS[old];
  const pool=Object.keys(MONSTERS).filter(k=>{const M=MONSTERS[k];return M.boss&&!M.warden&&k!==old&&k!==T.boss&&M.hp<=oldM.hp*3.2;});
  const type=pick(pool.length?pool:[old]);L.bossType=type;
  let m;if(T.arena)m=spawnMonster(type,1200,360,{sc:'out'});
  else{const b=S.blds.find(b=>b.boss);if(!b)return;m=spawnMonster(type,b.x+b.w/2,b.y+b.h/2,{home:b,sc:'out'});}
  const hp=Math.max(m.maxHp,oldM.hp*1.3);m.hp=m.maxHp=hp;m.dmg*=1.1;
  banner('A NEW BOSS MOVED IN',m.name+' took over '+T.lair+' while you were gone. It\'s stronger than the last one.',m.eye);
  addHistory('👑 '+m.name+' moved into '+T.lair+' in '+T.name+'.','banner');
}
{const _bd=bossDefeated;bossDefeated=function(){const T=TOWNS[S.town],t=bossType();if(t===T.boss)return _bd();
  const keep=T.boss;T.boss=t;try{_bd();}finally{T.boss=keep;}};}
{const _ob=objective;objective=function(){const T=TOWNS[S.town],t=bossType();if(t===T.boss)return _ob();const keep=T.boss;T.boss=t;try{return _ob();}finally{T.boss=keep;}};}
{const _pw=partWhere;partWhere=function(id){const T=TOWNS[S.town],t=bossType();if(t===T.boss)return _pw(id);const keep=T.boss;T.boss=t;try{return _pw(id);}finally{T.boss=keep;}};}
// fresh shack after losing your last life
{const _sr=scavengedRestart;scavengedRestart=function(){_sr();S.ruined=false;S.baseHp=baseMax();S.windows.forEach(w=>w.hp=winMax());};}
// ---------- camp supply crates (stealing) ----------
function campCrates(c){if(!c.crates)c.crates=[{dx:-46,dy:38},{dx:44,dy:42}].map(o=>({x:c.x+o.dx,y:c.y+o.dy,searched:false}));return c.crates;}
function nearCampCrate(){const P=S.P;if(P.sc!=='out'||P.car||P.hidden)return null;for(const c of S.camps){if(c.raided||c.hostile)continue;for(const k of campCrates(c)){if(!k.searched&&Math.hypot(P.x-k.x,P.y-k.y)<46)return {c,k};}}return null;}
function stealTick(dt){const t=nearCampCrate();
  if(!t||!keys['e']){S.steal=null;return;}if(!S.steal||S.steal.k!==t.k)S.steal={k:t.k,c:t.c,t:0};S.steal.t+=dt;
  if(S.steal.t>=1.4){const {c,k}=S.steal;S.steal=null;k.searched=true;const parts=giveRes(rollTable({food:2,meds:1,ammo:2,wire:1,fuel:.5},2),k.x,k.y-30);
    const seen=S.P.invisT>0?0:S.night?.45:.85;
    if(Math.random()<seen){campRep(c,-25,'"THIEF! We saw you going through our supplies!"');S.shake=4;}
    else{toast('🤫 You took '+(parts.join(', ')||'nothing')+' from '+c.name+'\'s crate. Nobody saw… this time.');(c.missing=c.missing||0);c.missing++;}}}
{const _pt=promptText;promptText=function(){const t=nearCampCrate();if(t&&!S.P.posted)return '⚠️ Hold E: take from '+t.c.name+'\'s supply crate (that\'s stealing!)'+(S.steal?'…':'');return _pt();};}
{const _dc=drawCamps;drawCamps=function(cam){_dc(cam);if(S.mode!=='hunter')return;const P=S.P;
  S.camps.forEach(c=>{if(c.raided)return;campCrates(c).forEach(k=>{box(k.x-14,k.y-11,28,22,k.searched?'#5a4a3a':'#a8783a',3,2);ctx.strokeStyle='#5a3a1a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(k.x-14,k.y);ctx.lineTo(k.x+14,k.y);ctx.stroke();
      if(S.steal&&S.steal.k===k){ctx.fillStyle='#000';ctx.fillRect(k.x-20,k.y-24,40,5);ctx.fillStyle='#ff8a95';ctx.fillRect(k.x-20,k.y-24,40*S.steal.t/1.4,5);}});
    if(S.humanity<35&&!c.hostile&&P.sc==='out'&&dist(P,c)<c.r+220){c.guards.forEach(g=>{const gx=c.x+Math.cos(g.a)*c.r*.85,gy=c.y+Math.sin(g.a)*c.r*.85;g.aim=Math.atan2(P.y-gy,P.x-gx);
      ctx.strokeStyle='rgba(255,40,60,'+(.35+.25*Math.sin(S.t*6))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(P.x,P.y);ctx.stroke();});
      if(Math.floor(S.t*2)%4===0)label('🎯 They\'re aiming at you',P.x,P.y-46,'#ff8a95',13);}});};}
// ---------- watching what you do near camps ----------
/* trustTick2: replaced later */
function crewTick(){S.crew.forEach(m=>{if(!m.dead||m.mourned)return;m.mourned=true;
  const c=m.town===S.town?S.camps.find(x=>x.id===m.camp):null;
  if(c)campRep(c,-15,'"You were supposed to keep '+m.name+' safe."');
  else if(m.town!==undefined){const L=tlog(m.town);const j=L.camps?+String(m.camp).replace('camp',''):-1;if(L.camps&&L.camps[j]){L.camps[j].rep=(L.camps[j].rep||0)-15;toast('📻 Word travels: '+m.name+'\'s old camp blames you for their death.','bad');}}});}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(S.mode==='hunter'){stealTick(dt);if(Math.floor(S.t*2)!==Math.floor((S.t-dt)*2)){trustTick2();crewTick();}}};}
// ---------- dawn: refilled crates, missing supplies noticed, lies found out, stale jobs ----------
{const _od=onDawn;onDawn=function(){_od();if(S.mode!=='hunter')return;
  S.camps.forEach(c=>{if(c.missing){c.missing=0;campRep(c,-6,'"Someone has been going through our crates at night…"');}campCrates(c).forEach(k=>k.searched=false);});
  (S.lies||[]).forEach(l=>{if(l.found||l.town!==S.town)return;if(Math.random()<.4){l.found=true;const c=S.camps.find(x=>x.id===l.camp);if(c)campRep(c,-18,'"We checked. You never did that job. LIAR."');}});
  S.jobs.forEach(j=>{if(j.state==='active'){j.age=(j.age||0)+1;if(j.age>=3){j.state='open';const c=campOf(j.camp);if(c)campRep(c,-6,'"You took our job three days ago and never came back."');}}});
  S.jobs=S.jobs.filter(j=>j.state==='active'||j.state==='done');};}
// ---------- SOS ignored: other camps hear about it ----------
{const _hc=helpCallTick;helpCallTick=function(){const h=S.helpCall,g=S.gday||1,falls=h&&!h.active&&g>h.deadline;_hc();
  if(falls)S.camps.forEach(c=>{if(!c.raided&&!c.hostile)campRep(c,-6,'"We heard you let '+h.name+' fall. You had the radio. You heard them."');});};}
// ---------- recruits remember where they came from ----------
{const _act=act;act=function(a,d){d=d||{};
  if(a==='hire'){const c=campOf(S.campOpen),n=S.crew.length;_act(a,d);if(c&&S.crew.length>n){const m=S.crew[S.crew.length-1];m.camp=c.id;m.town=S.town;}return;}
  if(a==='quitjob'){const c=campOf(S.campOpen),j=S.jobs[+d.j];if(j&&c){j.state='open';S.jobs=S.jobs.filter(x=>x!==j);campRep(c,-6,'"You gave up on our job? We were counting on you."');}refreshPanel();return;}
  if(a==='liejob'){const c=campOf(S.campOpen),j=S.jobs[+d.j];if(j&&c&&j.state==='active'){
      if(Math.random()<.55){campRep(c,-18,'"Don\'t lie to us. We know you didn\'t do it."');}
      else{j.state='done';completeJob(j);(S.lies=S.lies||[]).push({camp:c.id,town:S.town,day:S.day});toast('🤥 They believed you… for now. They might check tomorrow.','bad');}}refreshPanel();return;}
  if(a==='askhelp'){const c=campOf(S.campOpen);if(c&&c.askDay!==S.day){c.askDay=S.day;const T=wTier(c);
      if(T.name==='TRUSTED'||(T.name==='UNEASY'&&Math.random()<.5)){const parts=giveRes(rollTable({food:2,meds:1,ammo:2},2),S.P.x,S.P.y-30);toast('🙏 '+c.leader+' hands you '+parts.join(', ')+'. "Pay us back sometime."','good');}
      else toast('🙅 '+c.leader+': "We barely have enough for ourselves."','bad');}refreshPanel();return;}
  _act(a,d);};}
{const _ch=campHtml;campHtml=function(){const h=_ch(),c=campOf(S.campOpen);if(!c)return h;const T=wTier(c);if(T.name==='HOSTILE'||T.name==='FEARED')return h;
  const mine=S.jobs.map((j,i)=>({j,i})).filter(x=>x.j.camp===c.id&&x.j.state==='active');
  const jobs=mine.length?`<div style="margin-top:8px"><b>Jobs you're working on for them</b>${mine.map(({j,i})=>`<div class="act"><div><small>${jobText(j)}${j.age?' · day '+(j.age+1)+' of 3 before they give up on you':''}</small></div><div class="row"><button class="btn sm ghost" data-a="quitjob" data-j="${i}" title="Costs some trust">Give up</button><button class="btn sm ghost" data-a="liejob" data-j="${i}" title="Get paid now… if they believe you. More than half the time they don't, and they might check tomorrow.">🤥 Say it's done</button></div></div>`).join('')}</div>`:'';
  const sec=`<section style="margin-top:12px"><h3>🙏 Ask, don't take</h3><p style="margin:0 0 6px">Their supply crates are right there. Taking from them is stealing, and they usually notice.</p>
    <button class="btn sm" data-a="askhelp" ${c.askDay===S.day?'disabled':''}>${c.askDay===S.day?'You already asked today':'Ask '+c.leader+' for supplies'}</button>${jobs}
    <p class="mute" style="margin:8px 0 0">Camps don't like it when you: lead monsters here · use powers in front of them · show up glowing or at night · carry a stuffed DNA vault · steal from their crates · quit or lie about jobs · let their people die · ignore a 🆘 call · look less and less human.</p></section>`;
  return h.replace(/<\/div>\s*$/,sec+'</div>');};}
{const _in=interact;interact=function(){if(S&&S.mode==='hunter'&&!S.P.posted&&nearCampCrate())return;_in();};}
// ---------- random lab test each time ----------
function nextGameIdx(){if(S.nextGame===undefined||S.nextGame>=SEQ_GAMES.length)S.nextGame=Math.floor(Math.random()*SEQ_GAMES.length);return S.nextGame;}
{const _se=seqEnd;seqEnd=function(){const q=S.seq,real=q&&!q.done&&!q.practice;_se();if(real){const cur=S.nextGame;let n=cur;while(n===cur&&SEQ_GAMES.length>1)n=Math.floor(Math.random()*SEQ_GAMES.length);S.nextGame=n;}};}
