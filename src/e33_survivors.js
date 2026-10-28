// ================= ONE SURVIVOR SYSTEM: hiding in houses or lying in a camp's sick tent =================
// House survivors can now be bitten too (same clock and same cures as camp survivors).
{const _hi=houseInterior;houseInterior=function(f){const fresh=!f.int,I=_hi(f);if(fresh&&I.hiders)I.hiders.forEach(h=>{if(h.trapped?Math.random()<.5:Math.random()<.2){h.bite={t:0,fam:pick(Object.keys(FAM))};}});return I;};}
function survCard(o){// o: {name, where:'house'|'camp', hurt, bite:{t,fam}|null, mood, acts:{...}}
  const F=o.bite?(FAM[o.bite.fam]||FAM.beast):null,face=o.mood==='angry'?'😠':o.bite?'🤒':o.hurt?'🤕':o.mood==='friend'?'🙂':'😨';
  const say=o.mood==='angry'?'"Get away from us. We saw what you took."':o.bite?(o.bite.t?'"It\'s spreading… my veins are turning '+F.name.toLowerCase()+'-colored. Please…"':'"Something bit me. It burns."'):scary()?'"Stay back! What… what are you?"':o.trapped?'"Shh! It\'s still in here. Please, kill it!"':o.mood==='friend'?'"Thank you. Really."':'"Please don\'t hurt us. This is all we have left."';
  const chips=[o.where==='camp'?'<span class="schip">🏕️ in the sick tent</span>':'<span class="schip">🏠 hiding</span>',o.hurt?'<span class="schip bad">🩸 hurt</span>':'',o.bite?`<span class="schip bad" title="Infected with ${F.name} DNA">🤒 bitten · ${F.icon}</span>`:'',o.mood==='angry'?'<span class="schip bad">😠 angry at you</span>':o.mood==='friend'?'<span class="schip ok">🙂 trusts you</span>':''].join('');
  const clock=o.bite?`<div class="sclock" title="When this fills, ${o.name} turns into a monster"><div class="dbar"><i style="width:${50+o.bite.t*50}%;background:#ff5a68"></i></div><small>${o.bite.t?'⚠️ Turns at dawn!':'Turns in 2 days'}</small></div>`:'';
  const B=(k,ic,t,sub,ok,col)=>o.acts[k]===undefined?'':`<button class="hopt" data-a="${o.acts[k]}" ${ok?'':'disabled'} style="--hc:${col}"><span>${ic}</span><div><b>${t}</b><small>${sub}</small></div></button>`;
  const can=o.can;
  return `<div class="card">${head((o.where==='camp'?o.campName+' · sick tent':'Survivor')+' · Esc to close',o.name,'#7dff9a')}
  <div class="sview"><div class="sface ${o.bite?'sick':''}">${face}${F?`<b style="color:${F.color}">${F.icon}</b>`:''}</div><div style="flex:1"><p class="ssay">${say}</p><div class="schips">${chips}</div>${clock}</div></div>
  <h4 class="sh" style="color:#7dff9a">💉 Help them</h4><div class="hopts">
  ${B('food','🍞','Give food','1 food. Word gets around: +trust everywhere.',can.food,'#7dff9a')}
  ${B('treat','💊',o.bite?'Treat the bite':'Patch them up',o.bite?'1 med. Resets their clock.':'1 med. Big trust boost.',can.treat,'#7dff9a')}
  ${B('cure','💉','Cure the bite',cureN()?'1 med + 1 strand. Pulls the monster DNA out for good.':'Make a vaccine at any camp first to learn how.',can.cure,'#7dff9a')}
  ${B('lead','🏕️','"Come with me"',o.bite?'Walk them to a camp\'s sick tent.':'Walk them to a camp. They join as a recruit.',can.lead,'#7dff9a')}
  ${B('share','🤝','Ask to share','They give you something from their stuff.',can.share,'#7dff9a')}
  </div><h4 class="sh" style="color:#c27bff">🧬 The monster way</h4><div class="hopts">
  ${B('turn','🧬',o.bite?'Finish the change':'Turn them','1 strand. A loyal mutant who follows you. Brood +1. People may find out.',can.turn,'#c27bff')}
  </div>${o.where==='house'?'<p class="mute" style="margin:10px 0 0">🏷️ Containers marked <b>theirs</b> belong to them. Search them while they watch and they\'ll tell everyone.</p>':''}</div>`;}
function hiderHtml(){const h=S.hiderOpen;if(!h||h.gone){S.panel=null;return '<div class="card"></div>';}
  const trapped=lurkersIn(h.sc)>0,angry=h.mood==='angry';
  return survCard({name:h.name,where:'house',hurt:h.hurt,bite:h.bite||null,mood:h.mood,trapped,
    acts:{food:'hfood',treat:'hmeds',cure:'hcure',lead:'hlead',share:'hask',turn:'hturn'},
    can:{food:S.res.food>0&&!h.fed&&!angry,treat:S.res.meds>0&&(h.hurt||!!h.bite)&&!angry,cure:!!h.bite&&cureN()>0&&S.res.meds>0&&S.vault.length>0&&!angry,lead:!angry&&!h.follow&&!scary()&&!trapped,share:h.mood==='friend'&&!h.shared,turn:S.vault.length>0&&S.crew.length<4}});}
function sickHtml(){const o=S.sickOpen;if(!o||!(o.c.sick||[]).includes(o.s)){S.panel=null;return '<div class="card"></div>';}const {c,s}=o;
  return survCard({name:s.name,where:'camp',campName:c.name,hurt:false,bite:{t:s.t,fam:s.fam},mood:'friend',
    acts:{treat:'sktreat',cure:'skcure',turn:'skturn'},
    can:{treat:S.res.meds>0,cure:cureN()>0&&S.res.meds>0&&S.vault.length>0,turn:S.vault.length>0&&S.crew.length<4}});}
{const _act=act;act=function(a,d){const h=S.hiderOpen;
  if(a==='hmeds'&&h&&h.bite&&S.res.meds>0){S.res.meds--;h.bite.t=0;h.hurt=false;h.mood='friend';townWord(4,'"You treated '+h.name+'\'s bite."');refreshPanel();return;}
  if(a==='hcure'&&h&&h.bite&&cureN()>0&&S.res.meds>0&&S.vault.length){S.res.meds--;const v=S.vault.shift();h.bite=null;h.mood='friend';townWord(8,'"Someone cured a bite out in the houses!"');S.humanity=Math.min(100,S.humanity+3);S.curedN=(S.curedN||0)+1;cureGain(v.gene);banner(h.name.toUpperCase()+' IS CURED','The color drains out of their veins.','#7dff9a');refreshPanel();return;}
  _act(a,d);};}
// bitten house survivors turn at dawn if nobody helps; bitten survivors you lead home go to the sick tent
{const _od=onDawn;onDawn=function(){_od();if(S.mode!=='hunter')return;
  for(const id in S.interiors){const I=S.interiors[id];(I.hiders||[]).forEach(h=>{if(h.gone||!h.bite)return;h.bite.t++;
    if(h.bite.t>=2){h.gone=true;spawnMonster(pick(TOWNS[S.town].raid),h.x,h.y,{sc:id});if(S.P.sc===id)toast('🧟 '+h.name+' turned!','bad');}});}
  (S.escorts||[]).forEach(h=>{if(h.gone||!h.bite)return;h.bite.t++;if(h.bite.t>=2){h.gone=true;spawnMonster(pick(TOWNS[S.town].raid),h.x,h.y,{sc:h.sc});toast('🧟 '+h.name+' turned right beside you!','bad');}});};}
{const _ht=hiderTick;hiderTick=function(dt){const bit=allHiders().filter(h=>h.bite&&h.follow&&!h.gone);_ht(dt);
  bit.forEach(h=>{if(!h.gone)return;const c=S.camps.find(c=>Math.hypot(h.x-c.x,h.y-c.y)<c.r+10);if(!c)return;c.recruits=(c.recruits||[]).filter(r=>r.name!==h.name);
    (c.sick=c.sick||[]).push({name:h.name,t:h.bite.t,fam:h.bite.fam,a:Math.random()*6.28,r:rnd(20,70)});toast('🏕️ '+c.name+' takes '+h.name+' to their sick tent. Treat or cure them there.','good');});};}
// the bitten show up as bitten in the world too
{const _dp=drawPlayer;drawPlayer=function(){_dp();const sc=S.P.sc;allHiders().forEach(h=>{if(h.sc!==sc||!h.bite)return;ctx.fillStyle='rgba(166,214,90,'+(.3+.2*Math.sin(S.t*4))+')';ctx.beginPath();ctx.arc(h.x,h.y,15,0,7);ctx.fill();label('🤒',h.x+14,h.y-8,'#d6ff70',12);});};}
(function(){const st=document.createElement('style');st.textContent=`
.sview{display:flex;gap:14px;align-items:center;margin:4px 0 6px}.sface{position:relative;width:78px;height:78px;border-radius:50%;background:radial-gradient(#f0d0a8,#c09068);border:3px solid #3a2a1a;display:grid;place-items:center;font-size:44px;flex:none}
.sface.sick{background:radial-gradient(#d8e8a0,#8aa860);box-shadow:0 0 16px #a6d65a}.sface b{position:absolute;right:-6px;bottom:-4px;font-size:22px}
.ssay{font-size:17px;margin:0 0 6px}.schips{display:flex;flex-wrap:wrap;gap:6px}.schip{border:2px solid #555;border-radius:9px;padding:1px 8px;font-size:13px}.schip.bad{border-color:#ff5a68aa}.schip.ok{border-color:#7dff9a88}
.sclock{margin-top:6px}.sclock small{font-size:12px;color:#ff8a95}.sh{margin:12px 0 6px}`;document.head.appendChild(st);})();
