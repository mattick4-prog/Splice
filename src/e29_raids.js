// ================= MONSTERS RAID CAMPS · INFECTED SURVIVORS · YOUR PACK =================
function campDef(c){if(c.def===undefined)c.def=100;return c.def;}
function gateMax(){return 120+60*(TOWNS[S.town].lvl||1);}
function raidersOf(c){return S.enemies.filter(e=>!e.dead&&e.campRaid===c.id);}
function packList(){return S.enemies.filter(e=>!e.dead&&e.pack);}
function packCap(){return Math.min(6,3+Math.floor(broodN()/3));}
function canCall(){return S.mode==='hunter'&&(broodN()>=1||S.humanity<50);}
// ---------- natural raids at night ----------
function sendRaid(c,n,byYou){const T=TOWNS[S.town],a0=Math.random()*6.283;
  for(let k=0;k<n;k++){const a=a0+rnd(-.5,.5),x=clamp(c.x+Math.cos(a)*520,60,WW-60),y=clamp(c.y+Math.sin(a)*520,60,WH-60);
    const m=spawnMonster(pick(T.raid),x,y,{sc:'out'});m.campRaid=c.id;}
  c.raidOn=true;c.raidHelp=false;}
{const _on=onNightfall;onNightfall=function(){_on();if(S.mode!=='hunter'||TOWNS[S.town].arena)return;
  S.camps.forEach(c=>{if(c.raided||c.brood||c.hostile||!c.fort)return;if(Math.random()<(.3+Math.min(.25,S.day*.02))*diffK('raid')){const n=irnd(2,3)+Math.floor((TOWNS[S.town].lvl||1)/3);sendRaid(c,n);
    toast('📻 Radio from '+c.name+': "Monsters coming at our wall! Anyone out there?!"','bad');}});};}
// ---------- raider + pack brains ----------
{const _um=updateMonster;updateMonster=function(m,dt){const P=S.P;
  if(m.pack&&!m.dead){tickStatus(m,dt);m.atkCd-=dt;if(m.stunT>0){m.stunT-=dt;return;}
    // follow you, fight anything that isn't yours
    const foe=nearestIn(S.enemies.filter(e=>e!==m&&!e.pack&&!e.dead&&e.sc===m.sc&&e.kind!=='monster'),m,200);
    const t=foe||P,d=dist(m,t),want=foe?m.r+t.r:90;
    if(m.sc!==P.sc){m.sc=P.sc;m.x=P.x+rnd(-40,40);m.y=P.y+rnd(-40,40);}
    if(d>want){const sp=m.spd*(S.night?1.2:1);m.x+=(t.x-m.x)/d*sp*dt;m.y+=(t.y-m.y)/d*sp*dt;m.fa=Math.atan2(t.y-m.y,t.x-m.x);}
    else if(foe&&m.atkCd<=0){m.atkCd=1;dmgFoe(foe,m.dmg,null,false);}
    pushOut(m,solidsFor(m.sc));clampScene(m);return;}
  if(m.campRaid&&m.sc==='out'){const c=campOf(m.campRaid),pd=P.sc==='out'?dist(m,P):1e9;
    if(!c||c.raided||c.brood){m.campRaid=null;return _um(m,dt);}
    if(!m.byYou&&pd<170&&!P.dead&&!P.hidden&&!(P.invisT>0))return _um(m,dt); // you're in its face: it fights you
    tickStatus(m,dt);m.atkCd-=dt;if(m.stunT>0){m.stunT-=dt;return;}
    const open=gateOpen(c),g=gateCenter(c,30);let tg=open?{x:c.x,y:c.y}:g;
    {const am=Math.atan2(m.y-c.y,m.x-c.x),dm=Math.hypot(m.x-c.x,m.y-c.y),da=angDiff(c.gate,am);
      if(dm>c.r-10&&dm<c.r+110&&Math.abs(da)>.32){const na=am+Math.sign(da)*Math.min(.6,Math.abs(da));tg={x:c.x+Math.cos(na)*(c.r+48),y:c.y+Math.sin(na)*(c.r+48)};}}
    const d=Math.hypot(tg.x-m.x,tg.y-m.y)||1,sp=m.spd*(S.night?1.25:1)*(m.slowT>0?.45:1);
    if(d>26&&!(m.rootT>0)){m.x+=(tg.x-m.x)/d*sp*dt;m.y+=(tg.y-m.y)/d*sp*dt;m.fa=Math.atan2(tg.y-m.y,tg.x-m.x);}
    pushOut(m,solidsFor('out'));clampScene(m);
    if(m.atkCd<=0){
      if(!open&&Math.hypot(m.x-g.x,m.y-g.y)<60){m.atkCd=1;if(c.gateHp===undefined)c.gateHp=gateMax();c.gateHp-=m.dmg;c.gateFlash=.12;addFx({type:'bite',x:g.x,y:g.y,life:.2,color:m.eye});
        if(c.gateHp<=0){c.gateBroken=true;S._sol={};S.shake=Math.max(S.shake,4);toast('💥 '+c.name+'\'s gate is down! Monsters are inside!','bad');}}
      else if(Math.hypot(m.x-c.x,m.y-c.y)<c.r){m.atkCd=2;c.def=campDef(c)-(m.byYou?5:4);addFx({type:'bite',x:m.x+rnd(-20,20),y:m.y+rnd(-20,20),life:.25,color:'#ff5a68'});
        if(Math.random()<.35&&(c.sick||[]).length<4)infect(c,m);
        if(c.def<=0)campFalls(c,m.byYou);}}
    return;}
  _um(m,dt);};}
function infect(c,m){const nm=pick(NPC_NAMES);(c.sick=c.sick||[]).push({name:nm,t:0,fam:famOfType(m.type)[0]||'beast',a:Math.random()*6.28,r:rnd(20,70)});
  floatText(c.x,c.y-20,'🤒 '+nm+' got bitten!','#ff8a95');}
function campFalls(c,byYou){if(c.raided)return;S.enemies.forEach(e=>{if(e.campRaid===c.id)e.campRaid=null;});
  if(byYou){raidCamp(c,true);broodGain(2);banner(c.name.toUpperCase()+' HAS FALLEN','Your pack tore through it. Brood +2. Take what\'s left.','#c27bff');}
  else{c.raided=true;S.shake=8;banner(c.name.toUpperCase()+' HAS FALLEN','The monsters got in. The survivors scattered into the dark.','#ff3b3b');townWordX(c,-4,'"Where were you when '+c.name+' fell?"');}}
// raid over: did you help?
function raidTick(){if(S.mode!=='hunter')return;const P=S.P;
  S.camps.forEach(c=>{if(!c.raidOn)return;const left=raidersOf(c);
    if(left.length&&P.sc==='out'&&Math.hypot(P.x-c.x,P.y-c.y)<c.r+320)c.raidHelp=true;
    if(!left.length){c.raidOn=false;if(c.raided)return;
      if(c.raidHelp&&!c.packRaid){campRep(c,10,'"You helped us hold the wall. We owe you."');S.heldN=(S.heldN||0)+1;S.humanity=Math.min(100,S.humanity+2);banner(c.name.toUpperCase()+' HELD','You fought the monsters off their wall. +trust, +2 humanity.','#7dff9a');}
      c.packRaid=false;}});}
{const _od=onDawn;onDawn=function(){_od();if(S.mode!=='hunter')return;
  // the pack scatters, raiders slink off, camps patch up, the sick get worse
  S.enemies.forEach(e=>{if(e.pack)e.pack=false;if(e.campRaid){e.campRaid=null;e.state='idle';}});
  S.camps.forEach(c=>{if(c.raided)return;c.raidOn=false;c.def=Math.min(100,campDef(c)+30);if(c.gateBroken&&!c.hostile){c.gateBroken=false;c.gateHp=gateMax();S._sol={};}
    (c.sick||[]).forEach(s=>s.t++);const turned=(c.sick||[]).filter(s=>s.t>=2);
    turned.forEach(s=>{const m=spawnMonster(pick(TOWNS[S.town].raid),c.x+rnd(-40,40),c.y+rnd(-40,40),{sc:'out'});m.campRaid=c.id;c.def-=15;toast('🧟 '+s.name+' turned in the night, inside '+c.name+'!','bad');});
    c.sick=(c.sick||[]).filter(s=>s.t<2);
    if(c.packSeen){c.packSeen=false;}});};}
// ---------- your pack (C) ----------
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='c'||e.repeat||ovMode||!S||S.mode!=='hunter'||S.P.dead)return;packKey();});
function packKey(){const P=S.P;if(!canCall()){toast('🐾 You can\'t call monsters yet. Walk the monster road first (Brood 1+, or humanity under 50).','bad');return;}
  const pack=packList(),c=S.camps.find(c=>!c.raided&&!c.brood&&!c.hostile&&c.fort&&P.sc==='out'&&Math.hypot(P.x-c.x,P.y-c.y)<c.r+280);
  if(pack.length&&c){pack.forEach(m=>{m.pack=false;m.campRaid=c.id;m.byYou=true;m.maxHp*=1.5;m.hp=Math.min(m.maxHp,m.hp*1.5);m.dmg*=1.4;});c.raidOn=true;c.packRaid=true;humanityHit(4);S.packSent=(S.packSent||0)+1;
    banner('SIC \'EM','Your pack throws itself at '+c.name+'\'s wall.','#c27bff');
    const spotted=!S.night||seen(c)||Math.hypot(P.x-c.x,P.y-c.y)<c.r+80;
    if(spotted){campRep(c,-25,'"We SAW you. You sent those things at us!"');townWordX(c,-10,'"Someone is leading monsters at the camps. It\'s you."');}
    else c.packSeen=true;return;}
  if(pack.length>=packCap()){toast('🐾 Your pack is full ('+pack.length+'). Walk near a camp and press C to send them.','');return;}
  const near=S.enemies.filter(m=>!m.dead&&m.kind==='monster'&&!m.boss&&!m.pack&&!m.campRaid&&m.sc===P.sc&&dist(m,P)<260).sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,packCap()-pack.length);
  if(!near.length){toast('🐾 No monsters close enough to hear you.','');return;}
  near.forEach(m=>{m.pack=true;m.state='idle';floatText(m.x,m.y-m.r-14,'🐾','#c27bff');});humanityHit(2);S.packN=(S.packN||0)+near.length;sfx('pickup');
  toast('🐾 '+near.length+' monster'+(near.length>1?'s':'')+' fall in behind you. Walk near a camp and press C to send them. They scatter at dawn.','mem');}
// monsters in your pack won't hurt you
{const _dp=damagePlayer;damagePlayer=function(amt,src){if(src&&src.pack)return;return _dp(amt,src);};}
// ---------- infected survivors ----------
function sickPos(c,s){return {x:c.x+Math.cos(s.a)*s.r,y:c.y+Math.sin(s.a)*s.r};}
function nearSick(){const P=S.P;if(P.sc!=='out')return null;for(const c of S.camps){if(c.raided||c.brood)continue;for(const s of (c.sick||[])){const p=sickPos(c,s);if(Math.hypot(P.x-p.x,P.y-p.y)<44)return {c,s};}}return null;}
/* sickHtml: replaced later */
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='sick'){showOv(sickHtml(),'panel');return;}_rp();};}
{const _in=interact;interact=function(){if(S.mode==='hunter'&&!S.P.dead){const o=nearSick();if(o){S.sickOpen=o;openPanel('sick');return;}}_in();};}
{const _act=act;act=function(a,d){const o=S.sickOpen;
  if(o&&a==='sktreat'&&S.res.meds>0){S.res.meds--;o.s.t=0;o.s.treated=true;campRep(o.c,4,'"You treated '+o.s.name+'\'s bite."');refreshPanel();return;}
  if(o&&a==='skcure'&&cureN()>0&&S.res.meds>0&&S.vault.length){S.res.meds--;const v=S.vault.shift();o.c.sick=o.c.sick.filter(x=>x!==o.s);campRep(o.c,10,'"You CURED '+o.s.name+'. We didn\'t know that was possible."');townWordX(o.c,3,'"There\'s someone who can cure the bites."');
    S.humanity=Math.min(100,S.humanity+3);S.curedN=(S.curedN||0)+1;cureGain(v.gene);banner(o.s.name.toUpperCase()+' IS CURED','The color drains out of their veins.','#7dff9a');hideOv();return;}
  if(o&&a==='skturn'&&S.vault.length&&S.crew.length<4){S.vault.shift();o.c.sick=o.c.sick.filter(x=>x!==o.s);S.crew.push({name:o.s.name,role:pick(Object.keys(ROLES)),turned:true,town:S.town,gene:'x'});humanityHit(5);broodGain(1);
    if(!S.night||Math.random()<.4){campRep(o.c,-20,'"We saw what you did to '+o.s.name+'!"');}else toast('🤫 Nobody saw. They think '+o.s.name+' ran off in the night.','mem');
    banner(o.s.name.toUpperCase()+' IS YOURS','The change finishes. Their eyes open, glowing, and look only at you.','#c27bff');hideOv();return;}
  _act(a,d);};}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);raidTick();};}
// ---------- drawing ----------
{const _dc=drawCamps;drawCamps=function(cam){_dc(cam);S.camps.forEach(c=>{if(c.raided||!onCam(c.x,c.y,c.r+80,cam))return;
  (c.sick||[]).forEach(s=>{const p=sickPos(c,s),F=FAM[s.fam]||FAM.beast;ctx.fillStyle='rgba(166,214,90,'+(.25+.15*Math.sin(S.t*3))+')';ctx.beginPath();ctx.arc(p.x,p.y,16,0,7);ctx.fill();
    box(p.x-14,p.y-8,28,16,'#cfc8b0',4,1.5);circ(p.x-8,p.y,6,'#c8d8a0',1.5);label('🤒 '+s.name+(s.t?' ⚠️':''),p.x,p.y-18,s.t?'#ff8a95':'#d6ff70',11);
    if(Math.hypot(S.P.x-p.x,S.P.y-p.y)<60)label('E: help',p.x,p.y+22,'#fff',11);});
  if(c.raidOn&&!c.brood){label('⚠️ UNDER ATTACK',c.x,c.y-c.r-48,'#ff5a68',14);}
  if(campDef(c)<100&&!c.brood){const w=80,k=Math.max(0,c.def)/100;box(c.x-w/2,c.y+c.r+40,w,7,'#2a1a1a',2,1);ctx.fillStyle=k>.5?'#7dff9a':k>.25?'#ffd166':'#ff5a68';ctx.fillRect(c.x-w/2+1,c.y+c.r+41,(w-2)*k,5);}});};}
{const _dm=drawMonster;drawMonster=function(m){if(m.pack||m.byYou){ctx.strokeStyle='rgba(194,123,255,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(m.x,m.y,m.r+8,0,7);ctx.stroke();}_dm(m);if(m.pack)label('🐾',m.x,m.y-m.r-12,'#d6a0ff',12);};}
{const _pt=promptText;promptText=function(){const P=S.P;if(S.mode==='hunter'&&!P.dead){if(nearSick())return '🤒 E: help the sick survivor';
  const pk=packList().length;if(pk&&P.sc==='out'){const c=S.camps.find(c=>!c.raided&&!c.brood&&!c.hostile&&c.fort&&Math.hypot(P.x-c.x,P.y-c.y)<c.r+280);if(c)return '🐾 C: send your pack ('+pk+') at '+c.name;}}
  return _pt();};}
// save
saveExt(d=>{d.campr=S.camps.map(c=>({def:c.def,sick:c.sick||[]}));Object.assign(d,{heldN:S.heldN||0,curedN:S.curedN||0,packN:S.packN||0,packSent:S.packSent||0});});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();(d.campr||[]).forEach((x,j)=>{if(S.camps[j])Object.assign(S.camps[j],x);});['heldN','curedN','packN','packSent'].forEach(k=>{if(d[k]!==undefined)S[k]=d[k];});}}catch(e){}return ok;};}
(function(){const st=document.createElement('style');st.textContent=`.sickrow{display:flex;gap:12px;align-items:center}.sickbed{position:relative;font-size:52px;line-height:1}.sickbed b{position:absolute;right:-6px;top:-6px;font-size:22px}`;document.head.appendChild(st);})();

// you can help your pack break a gate (and the camp will know)
{const _pa2=playerAttack;playerAttack=function(){_pa2();const P=S.P;if(S.mode!=='hunter'||P.sc!=='out')return;
  S.camps.forEach(c=>{if(!c.fort||c.raided||c.brood||c.gateBroken||gateOpen(c))return;const g=gateCenter(c,10);if(Math.hypot(P.x-g.x,P.y-g.y)>70)return;
    if(!c.packRaid){if(S.t-(c.hitWarn||-99)>3){c.hitWarn=S.t;toast('🛑 The guards yell at you to stop hitting their gate. Keep going and they will open fire.','bad');c.gateStrikes=(c.gateStrikes||0)+1;if(c.gateStrikes>=3)makeCampHostile(c);}return;}
    if(c.gateHp===undefined)c.gateHp=gateMax();const W=WEAPONS[S.weapons[S.wpn]]||WEAPONS.crowbar;c.gateHp-=W.dmg*(W.brk||1)*.8;c.gateFlash=.12;burst(g.x,g.y,'#8a6236',5);
    if(c.packSeen!==false&&!c.youSeenGate){c.youSeenGate=true;campRep(c,-15,'"You were RIGHT THERE smashing our gate with them!"');}
    if(c.gateHp<=0){c.gateBroken=true;S._sol={};S.shake=6;toast('💥 The gate gives way. Your pack pours in.','mem');}});};}
// guards get better guns in tougher towns
function guardMul(){return 1+((TOWNS[S.town].lvl||1)-1)*.9;}
{const _uc=updateCamps;updateCamps=function(dt){const n0=S.proj.length;_uc(dt);for(let i=n0;i<S.proj.length;i++){const p=S.proj[i];if(p.turret&&p.bullet&&!p._gm){p._gm=1;p.dmg*=guardMul();}}};}
