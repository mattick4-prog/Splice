// ================= CAMP GATES + CHECKPOINT GUARDS (human and monster ways in) =================
const GATE_T=[-.27,-.135,0,.135,.27];
function gateCenter(c,out){const k=c.r+6+(out||0);return {x:c.x+Math.cos(c.gate)*k,y:c.y+Math.sin(c.gate)*k};}
function gateRects(c){return GATE_T.map(t=>{const a=c.gate+t;return {x:c.x+Math.cos(a)*(c.r+6)-12,y:c.y+Math.sin(a)*(c.r+6)-12,w:24,h:24,gate:c.id};});}
function insideCamp(c){const P=S.P;return P.sc==='out'&&Math.hypot(P.x-c.x,P.y-c.y)<c.r-4;}
function monsterAtGate(c){const g=gateCenter(c);return S.enemies.some(e=>!e.dead&&e.kind==='monster'&&e.sc==='out'&&!(e.charmT>0)&&Math.hypot(e.x-g.x,e.y-g.y)<230);}
function gateOpen(c){if(!c.fort||c.raided)return true;
  if(S.mode==='monster')return !!c.gateBroken;
  if(c.brood||c.hostile||c.gateBroken)return true;
  return (c.openT||0)>0;}
function visibleChanges(){return S.disguise?0:bodyChanges().length;}
{const _sf=solidsFor;solidsFor=function(sc){const r=_sf(sc);if(sc==='out'&&!r._g){r._g=1;(S.camps||[]).forEach(c=>{if(c.fort&&!gateOpen(c))gateRects(c).forEach(g=>r.push(g));});}return r;};}
function hasPass(c){return c.passDay===S.day&&!!c.passNight===!!S.night;}
function gatePass(c,msg,good){c.passDay=S.day;c.passNight=!!S.night;c.everPassed=true;hideOv();toast(msg,good?'good':'');tryOpenGate(c);}
function tryOpenGate(c){if(monsterAtGate(c)){if(S.t-(c.warnT||-99)>4){c.warnT=S.t;const g=gateCenter(c,40);floatText(g.x,g.y-30,'"Not with that thing out there! Kill it first!"','#ff8a95');toast('🛑 The guards won\'t open the gate while a monster is near it.','bad');}return false;}
  if(!((c.openT||0)>0))sfx('door');c.openT=Math.max(c.openT||0,3);S._sol={};return true;}
/* gateHtml: replaced later */
/* searchOdds: replaced later */
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='gate'){showOv(gateHtml(),'panel');return;}_rp();};}
function openGate(c){S.gateOpenFor=c.id;openPanel('gate');}
{const _act=act;act=function(a,d){const c=campOf(S.gateOpenFor);
  if(c&&a==='gsearch'){if(Math.random()<searchOdds(c)){campRep(c,2,'"You came up clean at the gate."');gatePass(c,'🔍 "Clean. Go on in."',true);}
    else{c.refuseDay=S.day;campRep(c,-3,'"Our gate guard didn\'t like what he found on you."');toast('🔍 "'+(visibleChanges()>=3?'Your skin is… no. Not today.':S.vault.length>=5?'What is all this monster DNA? Not today.':'Something\'s off about you. Not today.')+'"','bad');refreshPanel();}return;}
  if(c&&a==='gvax'&&cureN()>0){campRep(c,3,'"The vaccine maker! Let them in."');gatePass(c,'💉 "Doc! Come in, come in."',true);return;}
  if(c&&a==='gtoll'){if(S.res.food>0)S.res.food--;else if(S.res.meds>0)S.res.meds--;else return;gatePass(c,'🎁 "Fair trade. In you go."',true);return;}
  if(c&&a==='gstare'){campRep(c,-6,'"You scared our gate guard half to death."');humanityHit(2);gatePass(c,'😠 The guard backs away and fumbles the gate open.');return;}
  if(c&&a==='gmind'){humanityHit(3);if(Math.random()<.2)campRep(c,-10,'"The gate guard says you did something to his head."');gatePass(c,'🧠 The guard\'s eyes go blank. He opens the gate.');return;}
  if(c&&a==='gturn'&&S.night&&S.vault.length){S.vault.shift();humanityHit(4);
    if(Math.random()<.3){hideOv();makeCampHostile(c);townWordX(c,-10,'"Someone tried to turn '+c.name+'\'s gate guard into a monster."');banner('CAUGHT AT THE GATE','The other guard saw everything.','#ff3b3b');return;}
    c.sleeper=true;broodGain(1);S._sol={};hideOv();banner('THE GATEKEEPER IS YOURS','Every night, the gate opens for you and the searchlights look the other way.','#c27bff');return;}
  if(c&&a==='gbreak'){hideOv();makeCampHostile(c);townWordX(c,-8,'"You attacked '+c.name+'\'s gate."');return;}
  _act(a,d);};}
// halt! when you walk up to a closed gate
function gateTick(dt){if(!S.camps)return;const P=S.P;
  S.camps.forEach(c=>{if(!c.fort)return;
    if(c.openT>0){const g=gateCenter(c),inWay=P.sc==='out'&&Math.hypot(P.x-g.x,P.y-g.y)<46;
      if(monsterAtGate(c)&&!inWay)c.openT=0;else if(inWay)c.openT=Math.max(c.openT,.6);else c.openT-=dt;}
    const o=gateOpen(c);if(o!==c._go){c._go=o;S._sol={};if(!o&&!c.brood&&!c.hostile&&S.mode==='hunter'&&Math.hypot(P.x-c.x,P.y-c.y)<c.r+300)sfx('door');}});
  if(S.mode!=='hunter'||P.sc!=='out'||P.dead||P.car||ovMode)return;
  for(const c of S.camps){if(!c.fort||c.brood||c.hostile||c.raided||c.gateBroken||gateOpen(c))continue;
    // leaving: walk up to the gate from inside and they let you out
    if(insideCamp(c)){const gi=gateCenter(c,-40);if(Math.hypot(P.x-gi.x,P.y-gi.y)<50)tryOpenGate(c);continue;}
    const g=gateCenter(c,44);if(Math.hypot(P.x-g.x,P.y-g.y)>60)continue;
    if(hasPass(c)||(c.sleeper&&S.night)){if(tryOpenGate(c)&&S.t-(c.hiT||-99)>20){c.hiT=S.t;toast(c.sleeper&&S.night?'🧬 Your gatekeeper slides the bolt open without a word.':'🙂 "It\'s you again. Come on in."','good');}continue;}
    if(S.t-(c.haltT||-99)<8)continue;c.haltT=S.t;
    if(c.everPassed&&wTier(c).name==='TRUSTED'&&S.humanity>=50&&visibleChanges()<3&&!S.night){gatePass(c,'🙂 '+c.leader+' waves from the tower: "Open up, it\'s a friend!"',true);return;}
    floatText(g.x,g.y-30,'"HALT!"','#ffd166');openGate(c);return;}}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);gateTick(dt);};}
{const _in=interact;interact=function(){const P=S.P;if(S.mode==='hunter'&&P.sc==='out'){const c=S.camps.find(c=>c.fort&&!gateOpen(c)&&Math.hypot(P.x-gateCenter(c,44).x,P.y-gateCenter(c,44).y)<70);if(c){openGate(c);return;}}_in();};}
{const _pt=promptText;promptText=function(){const P=S.P;if(S.mode==='hunter'&&P.sc==='out'){const c=S.camps.find(c=>c.fort&&!gateOpen(c)&&Math.hypot(P.x-gateCenter(c,44).x,P.y-gateCenter(c,44).y)<90);if(c)return '🛑 '+c.name+' gate is shut · E: talk to the guards';}return _pt();};}
// a sleeper gatekeeper points the searchlights away from you
{const _il=inLight;inLight=function(c,x,y){if(c.sleeper)return false;return _il(c,x,y);};}
// the Apex has to smash the gate
{const _ds=dmgStructures;dmgStructures=function(x,y,r,dmg){_ds(x,y,r,dmg);if(S.mode!=='monster')return;
  S.camps.forEach(c=>{if(!c.fort||c.gateBroken||c.raided)return;const g=gateCenter(c);if(Math.hypot(x-g.x,y-g.y)>r+40)return;
    if(c.gateHp===undefined)c.gateHp=120+40*(TOWNS[S.town].lvl||1);c.gateHp-=dmg;c.gateFlash=.12;burst(g.x,g.y,'#8a6236',6);
    if(c.gateHp<=0){c.gateBroken=true;S._sol={};S.shake=8;banner(c.name.toUpperCase()+': GATE DOWN','The way in is open. Take the camp.','#c27bff');}});};}
// drawing: the gate itself and its two guards
{const _dc=drawCamps;drawCamps=function(cam){_dc(cam);S.camps.forEach(c=>{if(!c.fort||c.raided||!onCam(c.x,c.y,c.r+120,cam))return;const op=gateOpen(c);
  ctx.save();if(c.gateFlash>0){c.gateFlash-=1/60;ctx.globalAlpha=.6;}
  if(c.gateBroken){gateRects(c).forEach((s,i)=>{if(i%2)box(s.x+4,s.y+8,14,8,'#4a3420',1,1.5);});}
  else if(!op){gateRects(c).forEach(s=>{box(s.x,s.y,s.w,s.h,c.sleeper?'#6a4a7a':'#a8743c',2,2);ctx.strokeStyle='#5a3a1a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.x+3,s.y+3);ctx.lineTo(s.x+s.w-3,s.y+s.h-3);ctx.stroke();});}
  else{const g0=gateRects(c)[0],g4=gateRects(c)[4];box(g0.x+2,g0.y+2,12,12,'#a8743c',2,1.5);box(g4.x+8,g4.y+8,12,12,'#a8743c',2,1.5);}
  ctx.restore();
  if(c.brood||c.hostile||S.mode==='monster')return;
  const g=gateCenter(c,34),tx=-Math.sin(c.gate),ty=Math.cos(c.gate);
  [-1,1].forEach(s=>{const x=g.x+tx*s*40,y=g.y+ty*s*40;circ(x,y,11,c.sleeper&&s===1?'#5a3a7a':'#4a6a3a',2);circ(x+Math.cos(c.gate)*3,y+Math.sin(c.gate)*3,6,c.sleeper&&s===1?'#b8a0d0':'#e8c09a',1.5);
    if(c.sleeper&&s===1){ctx.fillStyle='#d6a0ff';ctx.beginPath();ctx.arc(x+Math.cos(c.gate)*6,y+Math.sin(c.gate)*6,1.8,0,7);ctx.fill();}});
  const P=S.P;if(!op&&Math.hypot(P.x-g.x,P.y-g.y)<260)label(monsterAtGate(c)?'⚠️ gate locked: monster near':hasPass(c)?'✅ walk up, they\'ll open':'🛑 checkpoint',g.x,g.y+30,'#ffd166',12);});};}
saveExt(d=>{d.campg=S.camps.map(c=>({sleeper:!!c.sleeper,gateBroken:!!c.gateBroken,passDay:c.passDay,passNight:!!c.passNight,refuseDay:c.refuseDay}));});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();(d.campg||[]).forEach((x,j)=>{if(S.camps[j])Object.assign(S.camps[j],x);});S._sol={};}}catch(e){}return ok;};}
{const _lm=leaveTownMemory;leaveTownMemory=function(){_lm();const L=tlog();if(L.camps)S.camps.forEach((c,j)=>{if(L.camps[j])L.camps[j].sleeper=!!c.sleeper;});};}
