// ================= RISK: SURGE DANGERS, BUILDING HAZARDS, RUINED SHACK, CAMP SHELTER =================
// ---------- Wild Surge dangers ----------
const BAD_BATCH=[
  ['🤒 FEVER','Your body fights the wild DNA. -20 health.',()=>{const P=S.P;P.hp=Math.max(1,P.hp-20);P.hurtT=.3;}],
  ['✨ YOU GLOW','The raw DNA makes you glow. Every monster nearby smells you and comes running!',()=>{S.enemies.forEach(e=>{if(!e.dead&&e.kind==='monster'&&e.sc===S.P.sc&&dist(e,S.P)<700&&!e.boss){e.state='chase';e.awake=true;}});}],
  ['🫨 THE SHAKES','Your legs won\'t listen. Slowed for 8 seconds.',()=>{S.P.slowT=Math.max(S.P.slowT,8);}],
  ['🧠 IT ITCHES','Something inside you shifts. -4 humanity.',()=>{humanityHit(4);}]
];
{const _ar=absorbRaw;absorbRaw=function(v,quiet){_ar(v,quiet);
  if(Math.random()<.22){const b=pick(BAD_BATCH);b[2]();sfx('bad');banner('BAD BATCH: '+b[0],b[1],'#ff5a68');}};}
{const _cs=castSurge;castSurge=function(){const s=S.surge;const before=s&&POWERS[s.id]?(S.cds[s.id]||0):1;_cs();if(s&&POWERS[s.id]&&before<=0&&(S.cds[s.id]||0)>0){humanityHit(.85);floatText(S.P.x,S.P.y-40,'wild DNA burns: -1 humanity','#d6a0ff');}};}
{const _dp=damagePlayer;damagePlayer=function(d,s,k){if(S.P.crashT>0)d*=1.25;_dp(d,s,k);};}
function surgeTick(dt){const P=S.P;const on=!!(S.surge&&S.surge.t>0),was=S._surgeOn;S._surgeOn=on;
  if(was&&!on){P.crashT=8;P.slowT=Math.max(P.slowT,8);banner('😵 SURGE CRASH','The wild DNA burns out. For 8 seconds you\'re slow and take extra damage.','#c27bff');}
  if(P.crashT>0)P.crashT-=dt;}
{const _dh=drawHUD;drawHUD=function(){_dh();const P=S.P;if(P.crashT>0&&S.mode==='hunter'&&!P.hidden){const w=250,x=VW/2-w/2,y=VH-190-(S.surge&&S.surge.t>0?40:0);
  panelBg(x,y,w,30);txt('😵 Surge crash · slow, +25% damage',x+10,y+20,15,'#d6a0ff','left',700);txt(Math.ceil(P.crashT)+'s',x+w-10,y+20,15,'#fff','right',700);
  hov(x,y,w,30,'😵 Surge crash','Your Wild Surge just ended. For a few seconds you move slower and take 25% more damage.');}};}
// ---------- building hazards ----------
const HAZ={gas:{icon:'☣️',name:'Gas leak',desc:'Poison gas. It hurts while you stand in it, and coughing wakes the monsters.'},
  wire:{icon:'⚡',name:'Live wire',desc:'A sparking puddle. Step in it and you get zapped and stunned.'},
  floor:{icon:'🕳️',name:'Rotten floor',desc:'The floorboards are cracked. They might give way under you.'},
  eggs:{icon:'🥚',name:'Egg sac',desc:'Something laid eggs here. Get too close and they hatch. Smash them from a distance first!'}};
function addHazards(I){if(!I||I.id==='base'||I.id==='garage'||S.mode==='monster')return;const lvl=TOWNS[S.town].lvl||1;
  const n=Math.min(3,irnd(0,2)+(lvl>1.3?1:0));I.haz=[];
  for(let k=0;k<n;k++){const type=pick(['gas','wire','floor','eggs','eggs','floor']);
    for(let t=0;t<40;t++){const h={type,x:rnd(I.x+90,I.x+I.w-90),y:rnd(I.y+90,I.y+I.h-170),r:type==='gas'?78:type==='wire'?40:type==='floor'?38:24,cd:0,done:false};
      if(Math.hypot(h.x-I.door.x,h.y-I.door.y)<200)continue;if(I.props.some(p=>Math.hypot(p.x+p.w/2-h.x,p.y+p.h/2-h.y)<h.r+30))continue;if(I.haz.some(o=>Math.hypot(o.x-h.x,o.y-h.y)<o.r+h.r+20))continue;I.haz.push(h);break;}}
  I.props.forEach(p=>{if(PROPS[p.type].cont&&!p.part&&Math.random()<.13)p.trap=pick(['alarm','needle','collapse']);});
}
{const _mi=makeInterior;makeInterior=function(b){const I=_mi(b);addHazards(I);return I;};}
function hazTick(dt){if(S.mode!=='hunter')return;const P=S.P;if(P.dead||P.sc==='out'||P.sc==='base')return;const I=S.interiors[P.sc];if(!I||!I.haz)return;
  for(const h of I.haz){if(h.done)continue;const d=Math.hypot(P.x-h.x,P.y-h.y);h.cd-=dt;
    if(h.type==='gas'&&d<h.r){damagePlayer(7*dt,null,'gas');if(h.cd<=0){h.cd=2.5;floatText(P.x,P.y-34,'*cough*','#b8e04a');S.enemies.forEach(e=>{if(e.sc===P.sc&&!e.dead&&e.kind==='monster')e.state='chase';});}}
    if(h.type==='wire'&&d<h.r&&h.cd<=0){h.cd=1.6;damagePlayer(10,null,'shock');P.stunT=Math.max(P.stunT,.7);burst(P.x,P.y,'#7fd6ff',10);floatText(P.x,P.y-34,'ZAP!','#7fd6ff');sfx('hit');}
    if(h.type==='floor'&&d<h.r*.8){h.done=true;damagePlayer(16,null,'fall');P.stunT=Math.max(P.stunT,1);S.shake=8;burst(h.x,h.y,'#6a4a2a',18);floatText(P.x,P.y-34,'THE FLOOR GAVE WAY!','#ffb347');sfx('bad');}
    if(h.type==='eggs'&&d<110){h.done=true;hatchEggs(I,h);}}}
function hatchEggs(I,h){const b=S.blds.find(b=>b.id===I.id),pool=TOWNS[S.town].raid;
  for(let i=0;i<3;i++){const m=spawnMonster(b&&b.monster?b.monster:pick(pool),h.x+rnd(-20,20),h.y+rnd(-20,20),{sc:I.id});m.hp*=.35;m.maxHp*=.35;m.r*=.65;m.dmg*=.6;m.name='Hatchling '+m.name.replace(/^The /,'');m.state='chase';}
  burst(h.x,h.y,'#e8e0a0',20);floatText(h.x,h.y-30,'THE EGGS HATCH!','#ff8a95');S.shake=6;sfx('bad');}
{const _pa=playerAttack;playerAttack=function(){_pa();const P=S.P;if(S.mode!=='hunter'||P.sc==='out'||P.sc==='base')return;const I=S.interiors[P.sc];if(!I||!I.haz)return;
  const W=WEAPONS[S.weapons[S.wpn]]||WEAPONS.crowbar,rng=W.ranged?W.range:W.range+20;
  I.haz.forEach(h=>{if(h.type!=='eggs'||h.done)return;const d=Math.hypot(P.x-h.x,P.y-h.y),a=Math.atan2(h.y-P.y,h.x-P.x);if(d<rng&&Math.abs(angDiff(a,P.face))<(W.ranged?.25:1.1)){h.done=true;h.smashed=true;burst(h.x,h.y,'#e8e0a0',14);floatText(h.x,h.y-24,'Smashed!','#b8e04a');sfx('hit');}});};}
function drawHaz(I){if(!I.haz)return;const P=S.P;
  I.haz.forEach(h=>{ctx.save();ctx.translate(h.x,h.y);
    if(h.type==='gas'){for(let i=0;i<6;i++){const a=S.t*.4+i,rr=h.r*(.45+.25*Math.sin(S.t+i));ctx.fillStyle='rgba(150,220,60,.13)';ctx.beginPath();ctx.arc(Math.cos(a)*h.r*.4,Math.sin(a)*h.r*.3,rr,0,7);ctx.fill();}label('☣️',0,6,'#b8e04a',18);}
    if(h.type==='wire'){ctx.fillStyle='rgba(60,90,130,.55)';ctx.beginPath();ctx.ellipse(0,0,h.r,h.r*.7,0,0,7);ctx.fill();ctx.strokeStyle='#222';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-h.r-30,-h.r);ctx.quadraticCurveTo(-10,-10,4,2);ctx.stroke();
      if(Math.random()<.5){ctx.strokeStyle='#bff0ff';ctx.lineWidth=2;ctx.beginPath();let x=0,y=0;ctx.moveTo(x,y);for(let k=0;k<4;k++){x+=rnd(-12,12);y+=rnd(-12,12);ctx.lineTo(x,y);}ctx.stroke();}}
    if(h.type==='floor'){if(!h.done){ctx.strokeStyle='rgba(40,20,10,.75)';ctx.lineWidth=2;for(let i=0;i<7;i++){const a=i*.9;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*h.r,Math.sin(a)*h.r*.8);ctx.stroke();}}
      else{ctx.fillStyle='#0a0604';ctx.beginPath();ctx.ellipse(0,0,h.r*.9,h.r*.7,0,0,7);ctx.fill();}}
    if(h.type==='eggs'&&!h.done){for(let i=0;i<5;i++){const a=i*1.26;ctx.fillStyle=i%2?'#e8e0b0':'#d8c890';ctx.strokeStyle='#5a4a20';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(Math.cos(a)*12,Math.sin(a)*10,9,12,a,0,7);ctx.fill();ctx.stroke();}
      ctx.globalAlpha=.4+.3*Math.sin(S.t*4);ctx.fillStyle='#ff5a68';ctx.beginPath();ctx.arc(0,0,4,0,7);ctx.fill();ctx.globalAlpha=1;}
    ctx.restore();
    if(!h.done||h.type==='gas'||h.type==='wire')if(Math.hypot(P.x-h.x,P.y-h.y)<500)hovWorld(h.x,h.y,Math.max(24,h.r*.8),HAZ[h.type].icon+' '+HAZ[h.type].name,HAZ[h.type].desc);});}
{const _di=drawInterior;drawInterior=function(I){_di(I);drawHaz(I);};}
{const _lc=lootContainer;lootContainer=function(p){const P=S.P,I=S.interiors[P.sc],cx=p.x+p.w/2,cy=p.y+p.h/2;
  if(p.trap&&!p.searched&&S.mode==='hunter'){const t=p.trap;p.trap=null;sfx('bad');
    if(t==='alarm'){banner('TRIPWIRE!','An old alarm starts screaming. Everything in this building knows you\'re here.','#ff5a68');S.enemies.forEach(e=>{if(e.sc===P.sc&&!e.dead)e.state='chase';});const b=S.blds.find(b=>b.id===P.sc);if(b&&b.monster)for(let i=0;i<2;i++){const m=spawnMonster(b.monster,I.door.x+rnd(-60,60),I.door.y-80,{sc:P.sc,home:b});m.state='chase';}}
    if(t==='needle'){damagePlayer(12,null,'trap');P.slowT=Math.max(P.slowT,3);floatText(cx,cy-30,'NEEDLE TRAP!','#ff8a95');toast('💉 A rusty needle was hidden inside. Ouch. Slowed for a bit.','bad');}
    if(t==='collapse'){damagePlayer(18,null,'trap');P.stunT=Math.max(P.stunT,.8);S.shake=8;burst(cx,cy,'#8a6a44',16);floatText(cx,cy-30,'IT COLLAPSED!','#ffb347');toast('🧱 The '+PROPS[p.type].name.toLowerCase()+' collapsed on you, but it spilled extra loot.','bad');giveRes(rollTable(PROPS[p.type].cont,2),cx,cy-20);}}
  _lc(p);
  if(I&&I.haz&&I.haz.length>=2&&S.mode==='hunter'&&Math.random()<.35){const parts=giveRes(rollTable(PROPS[p.type].cont,1),cx,cy-40);if(parts.length)toast('⚠️ Risky building, better loot: '+parts.join(', ')+'.','good');}};}
{const _es=enterScene;enterScene=function(sc,x,y){_es(sc,x,y);const I=S.interiors&&S.interiors[sc];if(I&&I.haz&&I.haz.length&&!I.hazWarned&&S.mode==='hunter'){I.hazWarned=true;
  toast('⚠️ Danger in here: '+[...new Set(I.haz.map(h=>HAZ[h.type].icon+' '+HAZ[h.type].name.toLowerCase()))].join(', ')+'. Hover to see what they do.','bad');}};}
// ---------- the shack becomes a ruin ----------
const RUIN_COST={wood:4,scrap:3};
{const _bb=baseBreached;baseBreached=function(){const wasShack=S.tier===0;_bb();if(wasShack){S.ruined=true;S.windows.forEach(w=>w.hp=0);
  banner('YOUR SHACK IS A RUIN','You can\'t sleep, cook or use the DNA Lab until you rebuild it at the workbench. Or shelter at a survivor camp tonight.','#ff4d5e');}};}
{const _us=useStation;useStation=function(st){if(S.ruined&&st.id!=='bench'){toast('🏚️ Your shack is a ruin. Rebuild it at the workbench first (🪵'+RUIN_COST.wood+' ⚙️'+RUIN_COST.scrap+').','bad');return;}_us(st);};}
{const _bh=benchHtml;benchHtml=function(){const h=_bh();if(!S.ruined)return h;
  return h.replace(/(<div class="card">[\s\S]*?<\/h2><\/div><button class="x"[^>]*>✕<\/button><\/div>)/,'$1'+`<section style="border-color:#ff5a68;margin:10px 0"><h3 style="color:#ff8a95">🏚️ Your shack is a ruin</h3><p style="margin:0 0 6px">The bed, pantry, weapon rack and DNA Lab are wrecked, and the windows can't hold. Rebuild it with scrap and wood.</p>${costHtml(RUIN_COST)}<button class="btn gold" data-a="rebuild" ${canPay(RUIN_COST)?'':'disabled'}>Rebuild the shack</button></section>`);};}
{const _act=act;act=function(a,d){if(a==='rebuild'&&S.ruined&&canPay(RUIN_COST)){pay(RUIN_COST);S.ruined=false;S.baseHp=Math.round(baseMax()*.6);S.windows.forEach(w=>w.hp=winMax());banner('SHACK REBUILT','It\'s not pretty, but it\'s home again.','#b8e04a');refreshPanel();return;}
  if(a==='shelter'){shelterNight();return;}_act(a,d);};}
{const _dbo=drawBaseOut;drawBaseOut=function(){_dbo();if(S.ruined&&S.mode==='hunter'){const br=baseRect();ctx.fillStyle='rgba(20,14,10,.55)';ctx.fillRect(br.x-6,br.y-6,br.w+12,br.h+12);
  ctx.strokeStyle='#3a2616';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(br.x,br.y);ctx.lineTo(br.x+br.w,br.y+br.h);ctx.moveTo(br.x+br.w,br.y);ctx.lineTo(br.x,br.y+br.h);ctx.stroke();label('🏚️ RUINED',BASE.x,br.y+br.h/2,'#ff8a95',16);}};}
{const _ro=objective;objective=function(){if(S.ruined&&S.mode==='hunter')return '🏚️ Your shack is a ruin. Rebuild it at the workbench (🪵4 ⚙️3), or shelter at a camp tonight.';return _ro();};}
// ---------- shelter at a survivor camp ----------
function shelterCost(c){const T=wTier(c);return {TRUSTED:1,UNEASY:2,WARY:3}[T.name]||0;}
function shelterHtml(c){const n=shelterCost(c),late=S.night||S.clock>DAY_LEN*.6;if(!late||!n)return '';
  return `<section style="border-color:#7fc8ff;margin-top:12px"><h3>🏕️ Stay the night here</h3><p style="margin:0 0 6px">Sleep safe inside the camp until morning. You wake up fully healed. Your base will have to hold out without you${S.defs&&Object.keys(S.defs).length?', but your traps and walls will help':''}.</p>
    <button class="btn" data-a="shelter" ${S.res.food>=n?'':'disabled'}>Sleep here (costs ${n} 🥫 food)</button>${S.res.food>=n?'':'<small class="mute"> You need more food.</small>'}</section>`;}
{const _ch=campHtml;campHtml=function(){const h=_ch(),c=campOf(S.campOpen);if(!c)return h;const s=shelterHtml(c);return s?h.replace(/<\/div>\s*$/,s+'</div>'):h;};}
function shelterNight(){
  const c=campOf(S.campOpen);if(!c)return;const n=shelterCost(c);if(!n||S.res.food<n)return;S.res.food-=n;
  const raiders=S.enemies.filter(e=>e.raid&&!e.dead&&e.sc==='out');const defs=Object.keys(S.defs||{}).length;
  let dmg=Math.max(0,(raiders.length+(S.night?2:3))*28-defs*20-turretCount()*25);
  S.enemies=S.enemies.filter(e=>!(e.raid&&e.sc==='out'));
  S.windows.forEach(w=>{w.hp=Math.max(0,w.hp-dmg*.15);});
  hideOv();S.clock=0;S.night=false;onDawn();S.P.hp=maxHp();c.rep=Math.min(100,(c.rep||0)+3);
  if(dmg>=S.baseHp){S.baseHp=0;baseBreached();}else S.baseHp-=dmg;
  banner('MORNING AT '+c.name.toUpperCase(),'You slept safe. '+(dmg?'Your base took '+Math.round(dmg)+' damage overnight.':'Your base held without a scratch.'),'#ffd166');
}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(S.mode==='hunter'){surgeTick(dt);hazTick(dt);}};}
// ---------- ambushes while searching ----------
const AMBUSH_LINES=['SOMETHING WAS HIDING IN THERE!','IT WAS WAITING FOR YOU!','BEHIND YOU!','IT CRAWLS OUT!'];
function ambush(x,y,sc,home){const T=TOWNS[S.town],type=home&&home.monster?home.monster:pick(T.raid);
  const m=spawnMonster(type,x+rnd(-30,30),y+rnd(20,50),{sc,home});m.state='chase';m.awake=true;m.stunT=0;
  S.shake=7;sfx('bad');burst(x,y,'#3a2a20',14);floatText(x,y-40,pick(AMBUSH_LINES),'#ff4d5e');toast('⚠️ Ambush! A '+m.name+' jumped out while you were searching.','bad');}
{const _lc=lootContainer;lootContainer=function(p){const P=S.P,sc=P.sc,cx=p.x+p.w/2,cy=p.y+p.h/2;_lc(p);
  if(S.mode==='hunter'&&!p.part&&Math.random()<(S.night?.18:.12)){const b=S.blds.find(b=>b.id===sc);ambush(cx,cy,sc,b);}};}
{const _sc=searchCar;searchCar=function(c){_sc(c);if(S.mode==='hunter'&&Math.random()<(S.night?.15:.08)){ambush(c.x,c.y,'out',null);floatText(c.x,c.y-60,'FROM UNDER THE CAR!','#ff4d5e');}};}
{const _sc=searchCar;searchCar=function(c){const had=c.tire;_sc(c);if(had&&S.mode==='hunter')foundTire(c);};}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);chargeTick(dt);};}
{const _dh=drawHUD;drawHUD=function(){_dh();drawCharge();};}
