// ================= FORTIFIED CAMPS + SLOW, RISKY TAINTING + CURING BROOD CAMPS =================
const TAINT_DOSES=3,TAINT_STRANDS=2,TAINT_HOLD=5;
function fortify(c){if(c.fort)return c;c.fort=true;c.gate=Math.atan2(BASE.y-c.y,BASE.x-c.x);
  const lvl=TOWNS[S.town].lvl||1,n=Math.min(6,4+Math.floor(lvl/2));c.guards=Array.from({length:n},(_,g)=>({a:c.gate+(g+.5)*6.283/n,cd:rnd(0,1),aim:0}));
  const ta=c.gate+Math.PI;c.tank={x:c.x+Math.cos(ta)*c.r*.6,y:c.y+Math.sin(ta)*c.r*.6};
  c.towers=[-.42,.42].map(o=>({x:c.x+Math.cos(c.gate+o)*(c.r+10),y:c.y+Math.sin(c.gate+o)*(c.r+10),ph:Math.random()*6}));
  c.taint=c.taint||0;return c;}
{const _mc=makeCamps;makeCamps=function(){const out=_mc();out.forEach(fortify);return out;};}
function wallSegs(c){const out=[],N=26;for(let i=0;i<N;i++){const a=i/N*6.283;let da=Math.abs(((a-c.gate)%6.283+9.425)%6.283-3.1416);if(da<.3)continue;
  out.push({x:c.x+Math.cos(a)*(c.r+6)-12,y:c.y+Math.sin(a)*(c.r+6)-12,w:24,h:24,a});}return out;}
{const _sf=solidsFor;solidsFor=function(sc){const r=_sf(sc);if(sc==='out'&&!r._w){r._w=1;(S.camps||[]).forEach(c=>{if(c.fort&&!c.raided)wallSegs(c).forEach(s=>r.push(s));});}return r;};}
// ---------- searchlights ----------
function lightAng(c,t){return c.gate+Math.PI+Math.sin(S.t*(c.alert?.9:.55)+t.ph)*1.6;}
function inLight(c,x,y){if(!S.night||!c.towers)return false;return c.towers.some(t=>{const d=Math.hypot(x-t.x,y-t.y);if(d>(c.alert?330:290))return false;
  let da=Math.abs(((Math.atan2(y-t.y,x-t.x)-lightAng(c,t))%6.283+9.425)%6.283-3.1416);return da<(c.alert?.32:.26);});}
function seen(c){const P=S.P;if(P.invisT>0||P.hidden||P.sc!=='out')return false;if(inLight(c,P.x,P.y))return true;
  return !!(c.alert&&c.tank&&Math.hypot(P.x-c.tank.x,P.y-c.tank.y)<95);} // a guard watches the tank once they're on alert
function nearTank(){const P=S.P;if(P.sc!=='out'||S.mode!=='hunter')return null;return S.camps.find(c=>c.tank&&!c.brood&&!c.raided&&!c.hostile&&Math.hypot(P.x-c.tank.x,P.y-c.tank.y)<48)||null;}
function fortTick(dt){if(S.mode!=='hunter')return;const P=S.P;
  S.camps.forEach(c=>{if(!c.fort||c.raided||c.brood||c.hostile)return;
    if(S.night&&seen(c)&&Math.hypot(P.x-c.x,P.y-c.y)<c.r+60){
      const busy=S.taintJob&&S.taintJob.c===c;
      if(busy){S.taintJob=null;makeCampHostile(c);townWordX(c,-12,'"They caught someone poisoning '+c.name+'\'s water. It was YOU."');banner('CAUGHT AT THE WATER TANK',c.name+' saw everything. They are coming for you.','#ff3b3b');}
      else if(c.spotDay!==S.day){c.spotDay=S.day;campRep(c,-4,'"Our searchlight caught you sneaking around at night."');toast('🔦 The searchlight swept over you. They saw you.','bad');}}});
  // tainting: hold E at the tank, at night
  const c=nearTank();
  if(!c||!S.night||!keys['e']||ovMode||P.dead){if(S.taintJob&&(!c||!keys['e']))S.taintJob=null;return;}
  if(c.taintDay===S.day){if(!S.taintWarn){S.taintWarn=1;toast('☣️ One dose per night. Come back tomorrow night.','bad');}return;}
  if(S.vault.length<TAINT_STRANDS){if(!S.taintWarn){S.taintWarn=1;toast('☣️ You need '+TAINT_STRANDS+' DNA strands for a dose.','bad');}return;}
  if(!S.taintJob||S.taintJob.c!==c)S.taintJob={c,t:0};S.taintJob.t+=dt;
  if(S.taintJob.t>=TAINT_HOLD){S.taintJob=null;S.vault.splice(0,TAINT_STRANDS);c.taint++;c.taintDay=S.day;humanityHit(4);broodGain(1);sfx('pickup');
    if(c.taint>=TAINT_DOSES){toast('☣️ Dose '+c.taint+'/'+TAINT_DOSES+'. It\'s done. By morning, '+c.name+' will be yours.','mem');}
    else toast('☣️ Dose '+c.taint+'/'+TAINT_DOSES+' in '+c.name+'\'s water. Come back on another night. They may notice people getting sick…','mem');}}
function townWordX(except,d,why){S.camps.forEach(o=>{if(o!==except&&!o.raided&&!o.brood&&!o.hostile)campRep(o,d,why);});}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);fortTick(dt);if(!keys['e'])S.taintWarn=0;};}
{const _od=onDawn;onDawn=function(){_od();if(S.mode!=='hunter')return;
  S.camps.forEach(c=>{if(!c.fort||c.brood||c.raided)return;
    if(c.taint>=TAINT_DOSES){c.brood=true;c.guards=[];S.taintN=(S.taintN||0)+1;broodGain(1);S.shake=6;townWordX(c,-25,'"Something happened at '+c.name+'. Their people… changed. We know it was you."');
      banner(c.name.toUpperCase()+' IS A BROOD CAMP','Everyone in the camp woke up with your eyes.','#c27bff');return;}
    if(c.taint>0&&c.taintDay===S.day-1&&!c.alert&&Math.random()<.4){c.alert=true;campRep(c,-10,'"People are getting sick. Someone is poisoning our water. We\'re doubling the watch."');
      toast('🔦 '+c.name+' is on ALERT: faster searchlights, and a guard on the water tank.','bad');}});};}
// the camp panel: tainting now happens at the tank, not from a button
{const _cd=campDnaSec;campDnaSec=function(c){let h=_cd(c);
  return h.replace(/<button class="btn sm ghost" data-a="taint"[\s\S]*?<\/button>/,`<div class="tinfo" title="Sneak to their 💧 water tank at night and hold E for ${TAINT_HOLD}s. Each dose costs ${TAINT_STRANDS} strands. ${TAINT_DOSES} doses on different nights turn the whole camp. Searchlights see you, and if they catch you at the tank the camp will attack.">☣️ Taint their water: 💧 tank · 🌙 night · hold E · ${TAINT_STRANDS} 🧪 · dose <b>${c.taint||0}/${TAINT_DOSES}</b>${c.alert?' · <span style="color:#ff8a95">🔦 ON ALERT</span>':''}</div>`);};}
{const _act=act;act=function(a,d){if(a==='taint')return;
  if(a==='unbrood'){const c=campOf(S.campOpen);if(!c||!c.brood||cureN()<3||S.res.meds<3||!S.vault.length)return;
    S.res.meds-=3;S.vault.shift();c.brood=false;c.taint=0;c.alert=false;c.fort=false;fortify(c);c.rep=15;S.broodN=Math.max(0,broodN()-3);S.humanity=Math.min(100,S.humanity+8);S._sol={};
    townWordX(c,10,'"You brought '+c.name+' back. We didn\'t think that was possible."');cureGain('unbrood_'+c.id);
    banner(c.name.toUpperCase()+' IS HUMAN AGAIN','The glow fades from their eyes. '+c.leader+' just stares at their hands.','#7dff9a');refreshPanel();return;}
  _act(a,d);};}
{const _bh=broodCampHtml;broodCampHtml=function(c){const h=_bh(c),ok=cureN()>=3&&S.res.meds>=3&&S.vault.length>0;
  const box=`<section style="margin-top:10px;border-color:#7dff9a"><h3 style="color:#7dff9a">💉 Bring them back</h3>
    <p style="margin:0 0 8px">Use what you learned making vaccines to pull the monster DNA back out of them. They'll be human again (and your Brood shrinks by 3).</p>
    <div class="row" style="gap:10px;align-items:center"><button class="btn" data-a="unbrood" ${ok?'':'disabled'}>💉 Cure ${c.name}</button>
    <small class="mute">${cureN()>=3?'✅':'⬜'} Cure road 3+ (${cureN()}) · ${S.res.meds>=3?'✅':'⬜'} 3 💊 · ${S.vault.length?'✅':'⬜'} 1 🧪 strand</small></div></section>`;
  return h.replace(/<\/div>\s*$/,box+'</div>');};}
// prompts
{const _pt=promptText;promptText=function(){const c=nearTank();if(c&&!S.P.dead){
  if(!S.night)return '💧 '+c.name+'\'s water tank · come back at night if you want to taint it';
  const j=S.taintJob;return '☣️ Hold E: taint the water ('+TAINT_STRANDS+' 🧪) · dose '+(c.taint||0)+'/'+TAINT_DOSES+(j?' · '+Math.round(100*j.t/TAINT_HOLD)+'%':'')+(inLight(c,S.P.x,S.P.y)?' · 🔦 YOU ARE IN THE LIGHT':'');}
  return _pt();};}
{const _in=interact;interact=function(){if(nearTank()&&S.night)return;_in();};}
// drawing: walls, gate, towers, searchlights, water tank
{const _dc=drawCamps;drawCamps=function(cam){_dc(cam);S.camps.forEach(c=>{if(!c.fort||!onCam(c.x,c.y,c.r+340,cam))return;const dead=c.raided;
  if(c.tank){const t=c.tank;circ(t.x+3,t.y+4,17,'rgba(0,0,0,.3)',0);circ(t.x,t.y,16,c.brood?'#6a3a8a':'#4a7a9a',2.5);ctx.fillStyle=c.brood?'#c27bff':'#8ad0ff';ctx.fillRect(t.x-10,t.y-3,20,5);
    if(c.taint>0&&!c.brood){ctx.fillStyle='#a6d65a';ctx.beginPath();ctx.arc(t.x,t.y,5+c.taint*2,0,7);ctx.fill();}
    if(Math.hypot(S.P.x-t.x,S.P.y-t.y)<200)label('💧 water',t.x,t.y-24,'#cfe6f4',11);
    const j=S.taintJob;if(j&&j.c===c){ctx.strokeStyle='#a6d65a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(t.x,t.y,26,-Math.PI/2,-Math.PI/2+6.283*j.t/TAINT_HOLD);ctx.stroke();}}
  wallSegs(c).forEach(s=>{box(s.x,s.y,s.w,s.h,dead?'#3a2a20':'#7a5a36',3,2);ctx.strokeStyle=dead?'#2a1a10':'#5a3e22';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.x+4,s.y+6);ctx.lineTo(s.x+s.w-4,s.y+6);ctx.moveTo(s.x+4,s.y+s.h-6);ctx.lineTo(s.x+s.w-4,s.y+s.h-6);ctx.stroke();});
  if(dead)return;
  (c.towers||[]).forEach(t=>{if(S.night&&!c.brood&&!c.hostile){const a=lightAng(c,t),R=c.alert?330:290,w=c.alert?.32:.26;ctx.fillStyle=c.alert?'rgba(255,120,120,.26)':'rgba(255,240,170,.24)';ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.arc(t.x,t.y,R,a-w,a+w);ctx.closePath();ctx.fill();}
    box(t.x-11,t.y-11,22,22,c.brood?'#4a2a5a':'#5a4a3a',2,2);circ(t.x,t.y,6,S.night&&!c.brood?'#fff3b0':'#444',1.5);});
  if(c.alert&&!c.brood&&!c.hostile)label('🔦 ON ALERT',c.x,c.y+c.r+30,'#ff8a95',12);});};}
// keep fort data on saves and when coming back to a town
saveExt(d=>{d.campf=S.camps.map(c=>({taint:c.taint||0,alert:!!c.alert,taintDay:c.taintDay}));});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();(d.campf||[]).forEach((x,j)=>{if(S.camps[j])Object.assign(S.camps[j],x);});S.camps.forEach(c=>{if(c.brood)c.guards=[];});S._sol={};}}catch(e){}return ok;};}
{const _lm=leaveTownMemory;leaveTownMemory=function(){_lm();const L=tlog();if(L.camps)S.camps.forEach((c,j)=>{if(L.camps[j]){L.camps[j].taint=c.taint||0;L.camps[j].alert=!!c.alert;}});};}
(function(){const st=document.createElement('style');st.textContent=`.tinfo{border:2px dashed #c27bff88;border-radius:8px;padding:5px 8px;font-size:13px;cursor:help}`;document.head.appendChild(st);})();
