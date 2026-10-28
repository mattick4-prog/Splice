// ================= PEOPLE HIDING IN HOUSES + COMING BACK FROM THE APEX =================
// ---------- hiders ----------
{const _hi=houseInterior;houseInterior=function(f){const fresh=!f.int,I=_hi(f);if(!fresh||S.mode!=='hunter')return I;
  if(Math.random()<.24){const n=Math.random()<.35?2:1,names=[];I.hiders=[];
    for(let k=0;k<n;k++){let nm=pick(NPC_NAMES);for(let z=0;z<20&&names.includes(nm);z++)nm=pick(NPC_NAMES);names.push(nm);
      I.hiders.push({name:nm,x:I.x+I.w*(.7+k*.08),y:I.y+I.h*.3+k*30,sc:I.id,hurt:Math.random()<.5,mood:'scared',fed:false,follow:false,gone:false,trapped:!!f.lurk});}
    I.props.filter(p=>PROPS[p.type].cont).slice(0,3).forEach(p=>p.owner=true);f.people=true;}
  return I;};}
function allHiders(){const out=[];for(const id in S.interiors){const I=S.interiors[id];(I.hiders||[]).forEach(h=>{if(!h.gone)out.push(h);});}(S.escorts||[]).forEach(h=>{if(!h.gone)out.push(h);});return out;}
function nearHider(){const P=S.P;return allHiders().find(h=>h.sc===P.sc&&Math.hypot(P.x-h.x,P.y-h.y)<55);}
function townWord(d,why){S.camps.forEach(c=>{if(!c.raided&&!c.brood&&!c.hostile)campRep(c,d,why);});}
function scary(){return S.humanity<35&&!S.disguise;}
function lurkersIn(sc){return S.enemies.filter(e=>!e.dead&&e.kind==='monster'&&e.sc===sc).length;}
/* hiderHtml: replaced later */
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='hider'){const sc=ov.querySelector('.card'),top=sc?sc.scrollTop:0;showOv(hiderHtml(),'panel');const nc=ov.querySelector('.card');if(nc)nc.scrollTop=top;return;}_rp();};}
{const _in=interact;interact=function(){if(S.mode==='hunter'&&!S.P.dead){const h=nearHider();if(h){S.hiderOpen=h;openPanel('hider');return;}}_in();};}
{const _act=act;act=function(a,d){const h=S.hiderOpen;
  if(a==='hfood'&&h&&S.res.food>0){S.res.food--;h.fed=true;h.mood='friend';townWord(5,'"Someone in town says you shared your food with them."');sfx('coin');refreshPanel();return;}
  if(a==='hmeds'&&h&&S.res.meds>0){S.res.meds--;h.hurt=false;h.mood='friend';townWord(8,'"You patched up '+h.name+'. They told everyone."');S.humanity=Math.min(100,S.humanity+2);sfx('coin');refreshPanel();return;}
  if(a==='hlead'&&h){h.follow=true;h.mood='friend';toast('🏕️ '+h.name+' is following you. Walk them into any camp.','good');hideOv();return;}
  if(a==='hask'&&h&&h.mood==='friend'){h.shared=true;const I=S.interiors[h.sc];if(I)I.props.forEach(p=>{if(p.owner)p.shareOK=true;});const k=pick(['food','meds','ammo','scrap','wire']);S.res[k]+=2;toast('🤝 '+h.name+' shares: +2 '+RES_ICON[k]+'. "Take what you need from our stuff too."','good');refreshPanel();return;}
  if(a==='hturn'&&h&&S.vault.length){const v=S.vault.shift();h.gone=true;S.crew.push({name:h.name,role:pick(Object.keys(ROLES)),turned:true,town:S.town,gene:v.gene});humanityHit(5);broodGain(1);
    banner(h.name.toUpperCase()+' IS YOURS NOW','Nobody saw. For now.','#c27bff');if(Math.random()<.25)townWord(-15,'"People are going missing from the houses. And they come back… wrong."');hideOv();return;}
  _act(a,d);};}
// messing with their stuff
{const _lc=lootContainer;lootContainer=function(p){const I=S.interiors[S.P.sc],hs=I&&I.hiders?I.hiders.filter(h=>!h.gone&&!h.follow&&h.sc===I.id):[];
  if(p.owner&&!p.shareOK&&hs.length){hs.forEach(h=>h.mood='angry');townWord(-6,'"'+hs[0].name+' says you robbed them while they watched."');floatText(p.x+p.w/2,p.y-20,'"HEY! That\'s ours!"','#ff5a68');toast('😠 '+hs[0].name+' saw you take their stuff. Every camp will hear about it.','bad');}
  _lc(p);};}
// saving them from a monster, leading them home, scaring them off
function hiderTick(dt){dt=dt||1/60;if(S.mode!=='hunter')return;const P=S.P;
  for(const id in S.interiors){const I=S.interiors[id];(I.hiders||[]).forEach(h=>{if(h.gone||h.follow)return;
    if(h.trapped&&!lurkersIn(id)){h.trapped=false;h.mood=h.mood==='angry'?'angry':'friend';townWord(10,'"You killed the thing that had '+h.name+' trapped."');toast('🙌 '+h.name+': "You saved us!"','good');}
    if(scary()&&P.sc===id&&dist(P,h)<200&&!h.fled){h.fled=true;h.gone=true;toast('😱 '+h.name+' saw your face and ran out the back.','bad');townWord(-3,'"There\'s a monster walking around in people\'s houses."');}});}
  S.escorts=S.escorts||[];
  allHiders().forEach(h=>{if(!h.follow)return;if(!S.escorts.includes(h)){S.escorts.push(h);const I=S.interiors[h.sc];if(I&&I.hiders)I.hiders=I.hiders.filter(x=>x!==h);}
    if(h.sc!==P.sc){h.sc=P.sc;h.x=P.x-20;h.y=P.y+20;}
    const d=dist(P,h);if(d>45){h.x+=(P.x-h.x)/d*Math.min(d-40,240*dt);h.y+=(P.y-h.y)/d*Math.min(d-40,240*dt);}
    const c=S.camps.find(c=>!c.raided&&!c.brood&&!c.hostile&&h.sc==='out'&&Math.hypot(h.x-c.x,h.y-c.y)<c.r);
    if(c){h.gone=true;campRep(c,15,'"You brought '+h.name+' here safe. They can stay."');townWord(3,'"Heard you walked survivors to safety."');(c.recruits=c.recruits||[]).push({name:h.name,role:pick(Object.keys(ROLES))});banner(h.name.toUpperCase()+' IS SAFE',c.name+' takes them in. You can hire them there.','#7dff9a');}
    const m=S.enemies.find(e=>!e.dead&&e.kind==='monster'&&e.sc===h.sc&&Math.hypot(e.x-h.x,e.y-h.y)<34);
    h.hitT=(h.hitT||0)-dt;if(m&&h.hitT<=0){h.hitT=1;h.hp=(h.hp===undefined?3:h.hp)-1;floatText(h.x,h.y-20,'"HELP!"','#ff5a68');if(h.hp<=0){h.gone=true;townWord(-6,'"'+h.name+' trusted you, and now they\'re dead."');toast('💀 '+h.name+' didn\'t make it.','bad');}}});
  S.escorts=S.escorts.filter(h=>!h.gone);}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);hiderTick(dt);};}
{const _dp=drawPlayer;drawPlayer=function(){const sc=S.P.sc;
  allHiders().forEach(h=>{if(h.sc!==sc)return;const bob=Math.sin(S.t*3+h.x)*1.5,col=h.mood==='angry'?'#ff5a68':h.mood==='friend'?'#7dff9a':'#ffd166';
    circ(h.x,h.y+bob,11,'#8a6a9a',2);circ(h.x+2,h.y+bob,6,'#e8c09a',1.5);if(h.hurt){ctx.fillStyle='#c2203a';ctx.fillRect(h.x-7,h.y+bob-2,5,3);}
    label((h.mood==='angry'?'😠 ':h.follow?'🏕️ ':'🙋 ')+h.name,h.x,h.y-20,col,12);
    if(!h.follow&&dist(S.P,h)<70)label('E: talk',h.x,h.y+26,'#fff',11);});
  if(sc!=='out'&&sc!=='base'){const I=S.interiors[sc];if(I&&I.hiders&&I.hiders.some(h=>!h.gone))I.props.forEach(p=>{if(p.owner&&!p.shareOK&&!p.searched)label('🏷️ theirs',p.x+p.w/2,p.y-6,'#ffb0b8',11);});}
  _dp();};}
// ---------- coming back from the Apex (needs the Antiserum from the Cure road) ----------
function canComeBack(){return S.mode==='monster'&&cureN()>=6&&!S.antiUsed;}
function comeBack(){if(!canComeBack())return;S.antiUsed=true;
  S.mode='hunter';S.humanity=30;S.hstage=2;S.night=false;S.clock=0;S.pendingTurn=0;S.biomass=0;
  S.banners=[];S.log=[];loadTown(S.town);S.camps.forEach(c=>{c.hostile=false;c.rep=Math.max(c.rep||0,0);});S.enemies=S.enemies.filter(e=>!e.campId);S.baseHp=baseMax();S.P.hp=maxHp();S.P.dead=false;const B=S.baseInt;teleport(S.P,B.door.x,B.door.y-80,'base');
  S.camps.forEach(c=>campRep(c,-10,'"We remember what you were. Don\'t make us regret letting you near."'));
  hideOv();banner('HUMAN AGAIN','You inject the Antiserum. It burns. When it stops, your hands are just hands. Humanity 30.','#7fc8ff');
  toast('The Antiserum only works once. If your humanity hits 0 again, there is no coming back.','bad');}
{const _nh=nestHtml;nestHtml=function(){const h=_nh();if(S.mode!=='monster')return h;
  const box=canComeBack()?`<section style="margin-top:10px;border-color:#7fc8ff"><h3 style="color:#7fc8ff">💉 The Antiserum</h3><p style="margin:0 0 8px">You made it back when you were still human. One shot, and you're human again: humanity 30, back in your shack. Your powers stay. You lose your biomass, and the camps will be wary of you.</p><button class="btn" data-a="comeback">💉 Become human again</button></section>`
    :`<p class="mute" style="margin-top:10px">💉 No way back${S.antiUsed?' this time. You already used the Antiserum.':'. (Reaching 6 on the Cure road as a human gives you one Antiserum.)'}</p>`;
  return h.replace(/<\/div>\s*$/,box+'</div>');};}
{const _act=act;act=function(a,d){if(a==='comeback'){comeBack();return;}_act(a,d);};}
// road guide: mention switching
{const _rg=roadGuide;roadGuide=function(){let h=_rg();
  const sw=S.mode==='monster'?(canComeBack()?'<div class="rstp nx"><span>💉</span><div><b>Or come back</b><small>Use the Antiserum at your nest. Humanity 30, back in your shack.</small></div></div>':''):
    `<p class="rswitch">🔁 <b>You can switch roads any time.</b> Both meters keep their progress, but camps remember what you did. Becoming the Apex is the only big jump, and the way back needs the 💉 Antiserum (Cure 6). ${S.antiUsed?'You already used yours.':''}</p>`;
  return h.replace(/<\/section>\s*$/,sw+'</section>');};}
// save
saveExt(d=>{d.antiUsed=!!S.antiUsed;});
{const _lg=loadGame;loadGame=function(){const ok=_lg();try{if(ok){const d=saveInfo();S.antiUsed=!!d.antiUsed;}}catch(e){}return ok;};}
(function(){const st=document.createElement('style');st.textContent=`
.hopts{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hopt{display:flex;gap:10px;align-items:center;text-align:left;background:#0006;border:2px solid var(--hc,#7dff9a);border-radius:12px;padding:8px 10px;color:inherit;cursor:pointer}
.hopt:hover:not([disabled]){background:#ffffff14}.hopt[disabled]{opacity:.35;cursor:default}.hopt>span{font-size:26px}.hopt b{display:block}.hopt small{opacity:.75;font-size:12px}
.rswitch{margin:10px 0 0;padding:8px 10px;border-radius:10px;background:#ffd16614;border:1px solid #ffd16655;font-size:14px}
@media (max-width:640px){.hopts{grid-template-columns:1fr}}`;document.head.appendChild(st);})();
