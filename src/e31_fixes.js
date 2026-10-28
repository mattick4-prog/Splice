// ================= FIXES: visible walls, fast DNA handling, clear road meters, camp balance, gate rebuilding =================
// ---------- log walls: a real palisade you can see (and that really blocks) ----------
function wallSeg(s){const p=defPos(s),a=Math.atan2(p.y-BASE.y,p.x-BASE.x)+Math.PI/2,L=66;return {p,a,x1:p.x-Math.cos(a)*L,y1:p.y-Math.sin(a)*L,x2:p.x+Math.cos(a)*L,y2:p.y+Math.sin(a)*L};}
function segPush(m,w,rad){const vx=w.x2-w.x1,vy=w.y2-w.y1,l2=vx*vx+vy*vy,t=clamp(((m.x-w.x1)*vx+(m.y-w.y1)*vy)/l2,0,1),cx=w.x1+vx*t,cy=w.y1+vy*t,d=Math.hypot(m.x-cx,m.y-cy)||1;
  if(d<rad){m.x=cx+(m.x-cx)/d*rad;m.y=cy+(m.y-cy)/d*rad;return true;}return false;}
{const _ud=updateDefs;updateDefs=function(dt){_ud(dt);if(S.mode!=='hunter'||!S.defs)return;
  for(const s in S.defs){const D=S.defs[s];if(D.type!=='wall'||D.hp<=0)continue;const w=wallSeg(+s);
    for(const m of S.enemies){if(m.dead||m.sc!=='out'||m.kind!=='monster'||m.pack)continue;if(segPush(m,w,14+m.r)){D.hp-=m.dmg*dt*.4;D.flash=.1;if(D.hp<=0){D.hp=0;toast('🪵 A log wall broke! Repair it at the workbench.','bad');}}}
    if(S.P.sc==='out')segPush(S.P,w,14+S.P.r);}};}
{const _dd=drawDefs;drawDefs=function(){if(S.mode!=='hunter'||!S.defs)return;const all=S.defs,rest={};for(const s in all)if(all[s].type!=='wall')rest[s]=all[s];S.defs=rest;try{_dd();}finally{S.defs=all;}
  const near=S.P.sc==='out'&&Math.hypot(S.P.x-BASE.x,S.P.y-BASE.y)<520;
  for(const s in all){const D=all[s];if(D.type!=='wall')continue;const w=wallSeg(+s);ctx.save();ctx.translate(w.p.x,w.p.y);ctx.rotate(w.a);
    if(D.hp>0){ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-68,-6,140,22);for(let k=-60;k<=60;k+=13){box(k-6,-14,12,28,D.flash>0?'#d89a5a':'#8a5a30',5,2);ctx.fillStyle='#b88a52';ctx.beginPath();ctx.arc(k,-14,5,0,7);ctx.fill();}
      box(-66,-6,132,6,'#5a3a1a',2,1.5);box(-66,6,132,6,'#5a3a1a',2,1.5);}
    else{for(let k=-50;k<=50;k+=26)box(k-10,-4+(k%4),20,8,'#5a3a20',3,1.5);}
    ctx.restore();if(near)label(D.hp>0?'🪵 your log wall'+(D.hp<DEFS.wall.hp?' '+Math.round(100*D.hp/DEFS.wall.hp)+'%':''):'🪵 broken wall',w.p.x,w.p.y-26,D.hp>0?'#e8d0a0':'#ff8a95',11);}
  // show empty build spots so you know where things go
  if(near&&!S.night)DEF_ANG.forEach((_,s)=>{if(all[s])return;const p=defPos(s);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(p.x,p.y,24,0,7);ctx.stroke();ctx.setLineDash([]);label('＋',p.x,p.y+5,'rgba(255,255,255,.5)',14);});};}
{const _dh=defenseHtml;defenseHtml=function(){return _dh().replace('👆 Click a spot around your base.','👆 Click a spot around your base. Walk outside to see it: empty spots show as dashed circles ＋ around your shack.');};}
// ---------- DNA you don't want right now ----------
function quickGain(v){return Math.round(v.val);}
function quickSeq(v){if(!v||!atLab())return 0;const g=quickGain(v);S.vault=S.vault.filter(x=>x!==v);addDNA(v.gene,g);return g;}
{const _act=act;act=function(a,d){d=d||{};
  if(a==='qseq'){const v=S.vault.find(x=>x.id==d.v);if(!atLab()){toast('⚡ Quick runs need the Gene-O-Matic in your cabin.','bad');return;}const g=quickSeq(v);if(g){sfx('pickup');toast('⚡ Quick run: +'+g+'% '+geneInfo(v.gene).name+'.','good');}refreshPanel();return;}
  if(a==='qseqall'){if(!atLab())return;const n=S.vault.length;let tot=0;[...S.vault].forEach(v=>tot+=quickSeq(v));sfx('coin');banner('BATCH DONE',n+' strands run through the machine. Total +'+tot+'% DNA.','#7dff9a');refreshPanel();return;}
  if(a==='render'){const v=S.vault.find(x=>x.id==d.v);if(!v||S.vault.length<2)return;const other=S.vault.find(x=>x!==v);S.vault=S.vault.filter(x=>x!==v&&x!==other);S.res.mutagen++;sfx('pickup');toast('♻️ Boiled 2 strands down into 1 🧪 mutagen.','good');refreshPanel();return;}
  if(a==='dump'){const v=S.vault.find(x=>x.id==d.v);if(!v)return;S.vault=S.vault.filter(x=>x!==v);toast('🗑️ Dumped the '+geneInfo(v.gene).name+' strand.');refreshPanel();return;}
  _act(a,d);};}
{const _vt=vaultTab;vaultTab=function(){const h=_vt();const v=S.vault.find(x=>x.id==S.vpick)||S.vault[0];if(!v)return h;const lab=atLab();
  const opts=`<div class="qopts"><div class="qtitle">🤷 Don't feel like a lab game? Other things you can do with this strand:</div><div class="qrow">
    <button class="qb" data-a="qseq" data-v="${v.id}" ${lab?'':'disabled'} title="${lab?'Run it through the machine with no game. Less than a great lab game (up to +'+Math.round(v.val*1.6)+'%) but more than raw.':'Only at the Gene-O-Matic in your cabin'}">⚡ Quick run<small>+${quickGain(v)}%, no game${lab?'':' · cabin only'}</small></button>
    ${S.vault.length>1?`<button class="qb" data-a="qseqall" ${lab?'':'disabled'} title="Run every strand in the vault at once, no games">⚡⚡ Quick run ALL ${S.vault.length}<small>${lab?'the whole vault at once':'cabin only'}</small></button>`:''}
    <button class="qb" data-a="render" data-v="${v.id}" ${S.vault.length>1?'':'disabled'} title="Boil this strand and one other down into mutagen, for gene mods">♻️ Render<small>2 strands → 1 🧪 mutagen</small></button>
    <button class="qb bad" data-a="dump" data-v="${v.id}" title="Throw it away. Frees a vault slot.">🗑️ Dump<small>free the slot</small></button></div></div>`;
  return h+opts;};}
{const _st=seqTab;seqTab=function(){const h=_st();if(!atLab()||S.seq||S.vault.length<2)return h;
  return `<div class="qopts" style="margin:0 0 10px"><div class="qrow"><button class="qb" data-a="qseqall">⚡⚡ Skip the games: quick run all ${S.vault.length} strands<small>about ${S.vault.reduce((a,v)=>a+quickGain(v),0)}% total, no lab games</small></button></div></div>`+h;};}
// ---------- the two roads, explained ----------
function roadMeter(n,need,steps,col,icon,name,sub){const cure=name==='The Cure';
  const what=cure?'Counts the <b>different kinds</b> of monster DNA you have given to camps as vaccines (or used to cure people). Giving the same kind twice does not count.':'Counts every person or camp you have <b>changed</b>: turned recruits, turned survivors and gatekeepers (+1 each), and tainted camps.';
  return `<div class="road3" style="--rc:${col}"><div class="r3top"><b>${icon} ${name}</b><span class="r3n">${Math.min(n,need)} <small>of ${need}</small></span></div>
    <div class="r3what">${what}</div>
    <div class="r3steps">${steps.map(([k,t,dd])=>`<div class="r3s ${n>=k?'on':''}"><div class="r3k">${n>=k?'✅':k}</div><b>${t}</b><small>${dd}</small></div>`).join('')}</div>
    <div class="rbar"><i style="width:${100*Math.min(1,n/need)}%"></i></div></div>`;}
// ---------- stray Brood camps: only ones you caused stay Brood ----------
{const _od=onDawn;onDawn=function(){S.camps.forEach(c=>{if(c.taint>=TAINT_DOSES&&!c.brood)c.broodBy='you';});_od();};}
function broodSanity(){(S.camps||[]).forEach(c=>{if(c.brood&&c.broodBy!=='you'&&!(c.taint>=TAINT_DOSES)){c.brood=false;c.guards=c.guards&&c.guards.length?c.guards:[0,1,2,3].map(g=>({a:c.gate+(g+.5)*1.57,cd:0,aim:0}));S._sol={};}});}
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok)broodSanity();}catch(e){}return ok;};}
{const _at=arriveTown;arriveTown=function(...a){const r=_at(...a);try{broodSanity();}catch(e){}return r;};}
saveExt(d=>{d.campb=S.camps.map(c=>c.broodBy||null);});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();(d.campb||[]).forEach((b,j)=>{if(S.camps[j]&&b){S.camps[j].broodBy=b;}});}}catch(e){}return ok;};}
{const _lm=leaveTownMemory;leaveTownMemory=function(){_lm();const L=tlog();if(L.camps)S.camps.forEach((c,j)=>{if(L.camps[j])L.camps[j].broodBy=c.broodBy||null;});};}
// ---------- camp balance: wild raids rarely get in; YOUR pack is the real threat ----------
{const _um=updateMonster;updateMonster=function(m,dt){const c=m.campRaid&&!m.byYou&&campOf(m.campRaid);
  if(c&&!(S.P.sc==='out'&&dist(m,S.P)<170)){const d0=m.dmg;m.dmg=d0*.12;try{_um(m,dt);}finally{m.dmg=d0;}return;}
  _um(m,dt);};}
// a broken gate stays broken until it is rebuilt (by you now, or by the camp after 2 days)
{const _od=onDawn;onDawn=function(){const keep=S.camps.map(c=>c.gateBroken&&!c.raided?{c,d:(c.brokeDays||0)+1}:null);_od();
  keep.forEach(k=>{if(!k)return;k.c.brokeDays=k.d;if(k.d<2){k.c.gateBroken=true;k.c.gateHp=0;S._sol={};}else{k.c.brokeDays=0;toast('🔨 '+k.c.name+' finally patched their gate.');}});};}
function gateRebuildCost(){return {wood:4,scrap:2};}
function gateReinforceCost(){return {scrap:4,wire:1};}
{const _gm=gateMax;gateMax=function(){return _gm();};}
function campGateMax(c){return Math.round(gateMax()*(c.gateLvl?1.6:1));}
{const _act=act;act=function(a,d){d=d||{};const c=campOf(S.campOpen);
  if(a==='gaterebuild'&&c&&c.gateBroken&&canPay(gateRebuildCost())){if(d.bp!=='1'){openBlueprint(a,d,{name:'New gate',icon:'🚪',cost:gateRebuildCost(),shape:'wall'});return;}
    pay(gateRebuildCost());c.gateBroken=false;c.brokeDays=0;c.gateHp=campGateMax(c);S._sol={};campRep(c,10,'"You built us a new gate. With your own hands."');S.humanity=Math.min(100,S.humanity+2);S.gatesBuilt=(S.gatesBuilt||0)+1;
    banner('NEW GATE FOR '+c.name.toUpperCase(),'Solid wood and scrap. The monsters will have to work for it now.','#7dff9a');refreshPanel();return;}
  if(a==='gatereinforce'&&c&&!c.gateBroken&&!c.gateLvl&&canPay(gateReinforceCost())){if(d.bp!=='1'){openBlueprint(a,d,{name:'Reinforced gate',icon:'🛡️',cost:gateReinforceCost(),shape:'wall'});return;}
    pay(gateReinforceCost());c.gateLvl=1;c.gateHp=campGateMax(c);campRep(c,6,'"Metal plates on the gate! Thank you."');S.gatesBuilt=(S.gatesBuilt||0)+1;toast('🛡️ '+c.name+'\'s gate is reinforced: much harder to break.','good');refreshPanel();return;}
  _act(a,d);};}
{const _bi=bpInfo;bpInfo=function(a,d){if(a==='gaterebuild'||a==='gatereinforce')return null;return _bi(a,d);};}
{const _ch=campHtml;campHtml=function(){const h=_ch(),c=campOf(S.campOpen);if(!c||c.brood||S.mode!=='hunter'||!c.fort)return h;
  const max=campGateMax(c),hp=c.gateBroken?0:(c.gateHp===undefined?max:Math.max(0,c.gateHp)),k=hp/max;
  const box=`<section style="margin-top:12px"><h3>🚪 Their gate</h3><div class="row" style="gap:12px;align-items:center;flex-wrap:wrap">
    <div style="flex:1;min-width:180px"><div class="dbar"><i style="width:${Math.round(k*100)}%;background:${k>.5?'#7dff9a':k>.25?'#ffd166':'#ff5a68'}"></i></div><small class="mute">${c.gateBroken?'💥 BROKEN. Monsters can walk right in.'+(c.brokeDays?'':' They can\'t fix it for 2 days.'):Math.round(hp)+' / '+max+(c.gateLvl?' · 🛡️ reinforced':'')}</small></div>
    ${c.gateBroken?`<button class="btn sm" data-a="gaterebuild" ${canPay(gateRebuildCost())?'':'disabled'}>🔨 Build a new gate</button>${costHtml(gateRebuildCost())}`:c.gateLvl?'':`<button class="btn sm ghost" data-a="gatereinforce" ${canPay(gateReinforceCost())?'':'disabled'}>🛡️ Reinforce it</button>${costHtml(gateReinforceCost())}`}</div></section>`;
  return h.replace(/<\/div>\s*$/,box+'</div>');};}
// monsters hitting a reinforced gate: use the camp's own max
{const _sr=sendRaid;sendRaid=function(c,n,b){if(c.gateHp===undefined||c.gateHp>campGateMax(c))c.gateHp=campGateMax(c);return _sr(c,n,b);};}
// road guide: rebuilding gates is a human-road step
{const _rs=roadSteps;roadSteps=function(){const r=_rs();r.human.splice(2,0,['🔨','Build or reinforce a camp gate','At a camp: rebuild a broken gate, or add metal plates.',(S.gatesBuilt||0)>0,(S.gatesBuilt||0)+' built']);return r;};}
saveExt(d=>{d.campgl=S.camps.map(c=>({gateLvl:c.gateLvl||0,gateBroken:!!c.gateBroken,brokeDays:c.brokeDays||0,gateHp:c.gateHp}));d.gatesBuilt=S.gatesBuilt||0;});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();(d.campgl||[]).forEach((x,j)=>{if(S.camps[j])Object.assign(S.camps[j],x);});S.gatesBuilt=d.gatesBuilt||0;S._sol={};}}catch(e){}return ok;};}
(function(){const st=document.createElement('style');st.textContent=`
.qopts{margin-top:10px;background:#0006;border-radius:12px;padding:8px 10px}.qtitle{font-size:13px;opacity:.8;margin-bottom:6px}.qrow{display:flex;flex-wrap:wrap;gap:8px}
.qb{display:flex;flex-direction:column;align-items:flex-start;background:linear-gradient(#3a4a3e,#26302a);border:2px solid #7dff9a88;border-radius:10px;color:inherit;padding:6px 12px;font-weight:700;cursor:pointer}
.qb small{font-weight:400;opacity:.75;font-size:12px}.qb:hover:not([disabled]){border-color:#7dff9a}.qb[disabled]{opacity:.4;cursor:default}.qb.bad{border-color:#ff5a6888;background:linear-gradient(#4a3030,#2a1c1c)}
.road3{border:2px solid var(--rc);border-radius:12px;padding:8px 10px;margin:8px 0;background:#0004}.r3top{display:flex;justify-content:space-between;align-items:baseline}.r3top b{font-size:17px;color:var(--rc)}.r3n{font-size:22px;font-weight:800;color:var(--rc)}.r3n small{font-size:12px;opacity:.7}
.r3what{font-size:13px;opacity:.85;margin:2px 0 8px}.r3steps{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}
.r3s{background:#ffffff08;border:1px dashed #ffffff30;border-radius:10px;padding:6px 8px;opacity:.7}.r3s.on{opacity:1;border:2px solid var(--rc);background:#ffffff12}.r3k{float:right;font-weight:800;color:var(--rc)}.r3s b{display:block;font-size:13px}.r3s small{font-size:11px;opacity:.8}
@media (max-width:640px){.r3steps{grid-template-columns:1fr}}`;document.head.appendChild(st);})();
