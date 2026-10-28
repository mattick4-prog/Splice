// ================= DOORS & INTERACTION =================
function enterScene(sc,x,y){
  const P=S.P,from=P.sc;
  S.enemies.forEach(m=>{if(!m.dead&&m.kind==='monster'&&!m.boss&&m.sc===from&&m.state==='chase'&&dist(m,P)<220)S.followers.push({m,t:.9,x,y,sc});});
  if(from==='base'&&sc==='out')S.flags.wentOut=true;
  teleport(P,x,y,sc);P.doorCd=.7;S.hold=null;S.fade=.35;sfx('door');if(sc==='base'&&S.mode==='hunter')saveGame();
}
function updateDoors(){
  const P=S.P;if(P.doorCd>0)return;
  if(P.sc==='out'){
    const br=baseRect(),mon=S.mode==='monster';
    if(!mon&&Math.hypot(P.x-BASE.x,P.y-(br.y+br.h+14))<26){const B=S.baseInt;enterScene('base',B.door.x,B.door.y-56);return;}
    for(const b of S.blds){if(b.boss||b.awake)continue;if(mon&&!(b.outpost&&!b.fallen))continue;
      if(Math.hypot(P.x-(b.dx+b.nx*14),P.y-(b.dy+b.ny*14))<28){
        if(b.mimicBld&&!mon){wakeHouse(b);P.doorCd=1;return;}
        const I=S.interiors[b.id];enterScene(b.id,I.door.x,I.door.y-56);
        if(mon){if(!b.monVisited){b.monVisited=true;banner('INSIDE THE '+b.name.toUpperCase()+' OUTPOST','Kill the Outpost Captain and the whole outpost falls.','#c27bff');}}
        else if(!b.visited&&b.garage){b.visited=true;banner('THE GARAGE','Your broken truck is here. Walk up to it and press E to see which parts it needs.','#4aa8ff');}
        else if(!b.visited){b.visited=true;banner(b.name.toUpperCase(),'Hold E on containers to search them. Smash furniture for materials.',b.sign);}
        return;}}
  }else{
    const I=sceneObj(P.sc);
    if(P.y>I.y+I.h-24&&Math.abs(P.x-I.door.x)<60){
      if(P.sc==='base'){const br=baseRect();enterScene('out',BASE.x,br.y+br.h+50);}
      else{const b=I.bld;enterScene('out',b.dx+b.nx*48,b.dy+b.ny*48);}
    }
  }
}
function updateFollowers(dt){
  S.followers=S.followers.filter(f=>{f.t-=dt;if(f.t>0)return true;
    if(!f.m.dead){teleport(f.m,f.x+rnd(-30,30),f.y+rnd(-10,10),f.sc);f.m.state='chase';f.m.raid=false;f.m.hx=f.x;f.m.hy=f.y;floatText(f.x,f.y-30,'It followed you!','#ff8a95');}
    return false;});
}
function wakeHouse(b){
  b.awake=true;S._sol={};tlog().mimic=true;
  const h=spawnMonster('house',b.x+b.w/2,b.y+b.h/2,{sc:'out'});h.state='chase';h.loot={wood:2,scrap:2,food:2,meds:1,wire:1,ammo:1};h.color=b.roof;
  S.shake=12;banner('THE BUILDING IS ALIVE',b.name+' was a mimic the whole time. Kill it for a huge haul.','#ff4d5e');
}
function nearStation(){const P=S.P;const I=P.sc==='base'?S.baseInt:P.sc!=='out'?S.interiors[P.sc]:null;if(!I||!I.stations)return null;let best=null,bd=P.sc==='base'?40:70;for(const s of I.stations){const d=rectDist(P,s);if(d<bd){bd=d;best=s;}}return best;}
function nearWindow(){const P=S.P;if(P.sc!=='base')return -1;let bi=-1,bd=60;S.baseInt.windows.forEach((w,i)=>{const d=Math.hypot(P.x-w.ix,P.y-w.iy);if(d<bd&&S.windows[i].hp<winMax()){bd=d;bi=i;}});return bi;}
function interact(){
  const P=S.P;if(P.dead)return;
  if(S.mode!=='hunter'){if(S.atBase)openBasePanel();return;}
  if(P.car){exitCar();return;}
  if(P.hidden){exitHide();return;}
  if(P.sc==='base'){
    const wi=nearWindow();if(wi>=0){if(S.res.wood<1){toast('You need 1 wood to board up a window.');return;}S.res.wood--;S.windows[wi].hp=winMax();floatText(P.x,P.y-30,'Window boarded','#b8e04a');return;}
    const st=nearStation();if(st){useStation(st);return;}
  }
  if(P.sc!=='out'&&P.sc!=='base'){const st=nearStation();if(st){useStation(st);return;}}
  if(P.sc==='out'){const cp=nearCamp();if(cp&&!cp.hostile){openCamp(cp);return;}}
  if(P.sc==='out'){const c=nearCar();if(c&&(c.searched||(c.drivable&&S.keys[c.id]&&!c.wreck))){
    if(c.drivable&&S.keys[c.id])enterCar(c);
    else if(c.hp>0)hideIn(c);
    return;}}
}
function updateHold(dt){
  const P=S.P;S.holdTarget=null;
  if(S.mode!=='hunter'||P.dead||P.car||P.hidden){S.hold=null;return;}
  let tgt=null,kind=null;
  if(P.sc==='out'){const c=nearCar();if(c&&!c.searched){tgt=c;kind='car';}}
  else if(P.sc!=='base'){const I=S.interiors[P.sc];let bd=44;for(const p of I.props){if(p.dead||!PROPS[p.type].cont||p.searched)continue;const d=rectDist(P,p);if(d<bd){bd=d;tgt=p;kind='prop';}}}
  if(tgt)S.holdTarget={tgt,kind};
  if(tgt&&keys['e']){
    if(!S.hold||S.hold.tgt!==tgt)S.hold={tgt,kind,t:0};
    S.hold.t+=dt;
    if(S.hold.t>.35&&!S.hold.noise){S.hold.noise=true;S.enemies.forEach(m=>{if(m.sc===P.sc&&!m.dead&&m.kind==='monster'&&!m.boss&&dist(m,P)<450)m.state='chase';});}
    if(S.hold.t>=1.2){if(kind==='car')searchCar(tgt);else lootContainer(tgt);S.hold=null;}
  }else S.hold=null;
}
function lootContainer(p){
  p.searched=true;S.stats.searched++;tlog().searched++;S._sol={};const D=PROPS[p.type],cx=p.x+p.w/2,cy=p.y+p.h/2;
  if(p.part){findPart(p.part,cx,cy);giveRes(rollTable(D.cont,1),cx,cy-20);return;}
  if(Math.random()<TOWNS[S.town].crate){const c=spawnMonster('crate',cx,cy-40,{sc:S.P.sc});c.state='chase';c.loot=D.cont;
    floatText(cx,cy-30,'IT HAS TEETH','#ff4d5e');toast('Mimic! Kill it for its loot and the DNA it stole.','bad');S.shake=6;return;}
  const parts=giveRes(rollTable(D.cont,Math.random()<.5?3:2),cx,cy-20);
  toast('Searched the '+D.name.toLowerCase()+': '+(parts.join(', ')||'nothing')+'.');
  if(Math.random()<.15)giveKey();
  if(Math.random()<.08)giveWeapon();
}
function giveWeapon(){
  const cand=['bat','bat','machete','machete','axe','shotgun','nailgun'].filter(w=>!S.weapons.includes(w));if(!cand.length)return;
  const w=pick(cand),W=WEAPONS[w];S.weapons.push(w);if(W.ranged)S.res.ammo+=6;
  banner('FOUND: '+W.name.toUpperCase(),W.desc+' Press Q to switch weapons.','#ffd166');
}
function useStation(st){
  const P=S.P;
  if(st.id==='bed'){
    if(S.night){toast('You can\'t sleep with them scratching at the walls.','bad');return;}
    S.clock=DAY_LEN-6;P.hp=maxHp();toast('You slept until dusk. Fully healed. Night is coming.');banner('YOU WAKE UP','It\'s almost dark.','#7fc8ff');return;
  }
  if(st.id==='lab'){S.seq=S.seq&&!S.seq.done?S.seq:null;openGenome('seq');return;}
  if(st.id==='assembly'){openPanel('garage');return;}
  ({bench:openWorkbench,board:openStats,pantry:openPantry,rack:openRack})[st.id]();
}

// ================= WORLD EVENTS =================
function damageBase(n){
  if(S.mode!=='hunter')return;
  S.baseHp-=n;if(S.baseHp<=0){S.baseHp=0;baseBreached();}
}
function damageNest(n){
  if(S.nestDead)return;S.nestHp-=n;
  if(S.nestHp<=0){S.nestHp=0;S.nestDead=true;banner('THE NEST IS BURNING','You can no longer respawn. Do not go down.','#ff4d5e');}
}
function updateClock(dt){
  S.clock+=dt;const len=S.night?NIGHT_LEN:DAY_LEN;
  if(S.clock>=len){S.clock=0;S.night=!S.night;if(S.night)onNightfall();else onDawn();}
}
function onNightfall(){
  if(S.mode==='hunter'){
    S.bloodMoon=S.day>=3&&(S.day%7===0||Math.random()<.06);
    sfx('night');
    if(S.bloodMoon){banner('BLOOD MOON','Every monster mutates tonight. DNA drops are even richer.','#ff3b3b');S.enemies.forEach(e=>{if(e.kind==='monster')mutate(e);});}
    else banner('NIGHT FALLS','They are coming for your base. Get inside and guard the windows, or hunt in the dark for richer DNA.','#7fc8ff');
    const n=Math.round((2+Math.floor(S.day*.8))*(S.bloodMoon?1.5:1)),pool=TOWNS[S.town].raid;
    for(let i=0;i<n;i++){const side=Math.floor(rnd(0,4));const x=side===0?20:side===1?WW-20:rnd(50,WW-50),y=side===2?20:side===3?WH-20:rnd(50,WH-50);
      spawnMonster(pick(pool),x,y,{raid:true,sc:'out'});}
  }else banner('NIGHT','Your hour. Claws +30%, you move faster, they see less.','#c27bff');
}
function onDawn(){
  S.day++;S.stats.days++;
  if(S.mode==='hunter'){
    S.bloodMoon=false;S.humanity=Math.min(100,S.humanity+4);crewDawn();
    if(S.res.food>0){S.res.food--;S.starving=false;toast('Ate 1 food at dawn.');}
    else{S.starving=true;toast('No food. You are starving: -20 max HP and slower.','bad');}
    if(S.tier<3&&S.vault.length){S.vault.forEach(v=>v.age++);const sp=S.vault.filter(v=>v.age>3);
      if(sp.length){S.vault=S.vault.filter(v=>v.age<=3);toast(sp.length+' DNA strand'+(sp.length>1?'s':'')+' in your vault spoiled. Use strands within 3 days, or build the Bunker freezer.','bad');}
      else if(S.vault.some(v=>v.age===3))toast('Some vault strands spoil tomorrow. Absorb or sequence them (Tab).','bad');}
    for(const id in S.interiors){const I=S.interiors[id];I.props.forEach(p=>{if(PROPS[p.type].cont&&p.searched&&Math.random()<.45)p.searched=false;if(p.dead&&Math.random()<.3){p.dead=false;p.hp=p.max;}});}
    S._sol={};
    S.blds.forEach(b=>{if(b.boss||!b.monster)return;const I=S.interiors[b.id];const c=S.enemies.filter(e=>e.home===b&&!e.dead).length;
      const want=S.day>=3?2:1;for(let i=c;i<want;i++)spawnMonster(b.monster,I.lx+rnd(-40,40),I.ly+rnd(-20,20),{home:b,sc:b.id});});
    spawnStrays(2+Math.floor(S.day/2));
    banner('DAY '+S.day,'Scavenge while it\'s light. The monsters are back in their buildings.','#ffd166');sfx('dawn');setTimeout(()=>saveGame(),100);
  }else{
    const alive=S.blds.filter(b=>b.outpost&&!b.fallen);
    if(!alive.length)banner('DAWN','The sun is up. Nothing left here dares to hunt you.','#ffd166');else banner('DAWN','The survivors send a purge party to burn your nest.','#ffd166');
    if(!S.nestDead&&alive.length){const n=2+Math.floor(S.day*.7)+Math.floor(alive.length/3);
      for(let i=0;i<n;i++){const b=alive.length?pick(alive):null;const x=b?b.lx:pick([30,WW-30]),y=b?b.ly:rnd(100,WH-100);
        spawnHuman(Math.random()<.6?'hunter':'torch',x,y,b,{purge:true});}}
  }
}
function updateOutposts(dt){
  S.blds.forEach(b=>{if(!b.outpost||b.fallen)return;b.flash-=dt;b.spawnT-=dt;
    if(b.spawnT<=0){b.spawnT=rnd(8,12);
      const alive=S.enemies.filter(e=>e.home===b&&!e.dead&&!e.purge).length;
      const cap=2+Math.floor(S.stats.outposts/2)+(S.night?0:1);
      if(alive<cap){const r=Math.random();spawnHuman(r<.35?'scav':r<.7?'hunter':r<.85?'torch':'trapper',b.lx,b.ly,b);}}});
}
function outpostFall(b){
  if(b.fallen)return;b.fallen=true;b.hp=0;S._sol={};S.stats.outposts++;S.biomass+=15;S.fear=Math.min(100,S.fear+18);
  burst(b.x+b.w/2,b.y+b.h/2,'#ff7a2f',40);S.shake=10;
  banner(b.name.toUpperCase()+' HAS FALLEN','+15 biomass. Fear spreads through town.','#ff7a2f');
  S.enemies.forEach(e=>{if(e.home===b&&!e.purge&&e.type!=='rival')e.flee=true;});
  let best=null,bc=0;for(const id in S.usage){if(S.usage[id]>bc&&!S.resist.includes(id)&&POWERS[id]){best=id;bc=S.usage[id];}}
  S.usage={};
  if(best&&bc>=3){S.resist.push(best);S.enemies.forEach(e=>{if(e.kind==='human'&&!e.isRival)e.resist=[...S.resist];});
    banner('THEY ADAPTED','Survivors now carry '+(ADAPT[best]||'improvised countermeasures')+'. '+POWERS[best].name+' is weaker against them.','#7fc8ff');
    toast('Adaptation: '+POWERS[best].name+' now does 40% damage to survivors. Rotate your powers.','bad');}
  if(S.stats.outposts>=3&&!S.rival&&!S.rivalDone&&!S.rivalT)S.rivalT=3;
  checkWin();
}
function checkWin(){
  if(S.mode!=='monster')return;
  if(TOWNS[S.town].arena)return;
  const all=S.blds.every(b=>!b.outpost||b.fallen);
  if(all&&!S.rival&&!S.rivalDone&&!S.rivalT)S.rivalT=2;
  if(all&&S.rivalDone)claimTown();
}
function rivalDefeated(){const r=S.rival;S.rivalDone=true;S.rival=null;if(r&&r.name.startsWith('Vance'))S.vanceDead=true;
  if(S.mode==='hunter'){S.path.apex+=1;banner('VANCE IS DEAD','His DNA spills out in glowing strands. Grab them.','#7fd6ff');const gs=Object.keys(POWERS).filter(id=>!POWERS[id].hybrid&&!POWERS[id].ult);for(let i=0;i<4;i++)S.pickups.push({x:r.x+rnd(-30,30),y:r.y+rnd(-30,30),sc:'out',gene:pick(gs),q:'pure',val:irnd(26,34),t:0,vx:rnd(-90,90),vy:rnd(-90,90)});return;}
  S.biomass+=40;S.fear=100;banner((r?r.name.split(',')[0].toUpperCase():'THE HUNTER')+' IS GONE','Their DNA library is yours. +40 biomass.','#7fd6ff');checkWin();}
function bossDefeated(){
  const T=TOWNS[S.town],B=MONSTERS[T.boss];S.bossDead=true;const L=tlog();L.bossDead=true;
  B.genes.forEach((g,i)=>{if(i===0||T.arena){if((S.dna[g]||0)<40)S.stats.powers++;S.dna[g]=Math.max(S.dna[g]||0,100);}});
  autoSlot(B.genes[0]);
  if(S.mode==='hunter')findPart('engine',S.P.x,S.P.y);
  if(T.arena){wardenDefeated();return;}
  banner(B.name.toUpperCase()+' FALLS',POWERS[B.genes[0]].name+' is yours now. So is a lot of her.',B.eye);
  if(S.mode==='hunter'){humanityHit(12);setTimeout(()=>{if(S&&S.mode==='hunter')liberateTown();},2500);if(!S.pendingTurn)S.pendingStory=3;}
}
function wardenDefeated(){
  const si=stateOfTown(S.town);if(!S.stateDone.includes(si))S.stateDone.push(si);
  if(S.mode==='monster')tlog().claimed=true;else tlog().liberated=true;
  banner(STATES[si].name.toUpperCase()+' CONQUERED','The State Warden is dead. Its powers are yours.','#ffd166');
  S.pendingState=3;
}
/* arriveTown: replaced later */
function startMonsterMode(){
  Object.keys(S.stolen).forEach(id=>{S.dna[id]=S.stolen[id]||100;delete S.stolen[id];autoSlot(id,true);});
  if(S.vance&&pathName()==='Splicer')S.vance.stays=true;
  S.mode='monster';S.banners=[];S.log=[];S.pendingTurn=0;
  if(S.crew.length)toast('Your crew ran the night you changed. You\'re alone now.','bad');S.crew=[];S.jobs=[];S.lost=[];
  {const bp=MONSTERS[TOWNS[S.town].boss].genes[0];S.dna[bp]=Math.max(S.dna[bp]||0,100);autoSlot(bp,true);}
  S.nestHp=NEST_MAX;S.nestDead=false;S.night=true;S.clock=0;S.day=1;S.usage={};S.resist=[];S.fear=0;S.biomass=10;
  setupMonsterTown();
  banner('THE HUNT BEGINS','Break the survivor outposts and raid the camps. Take what they have.','#c27bff');
  toast('Claw the barricades (click or Space) to break an outpost, or sneak in its door and take out the captain.');
  toast('Stand in the nest and press B to evolve with biomass 🧬. Tab for powers. M for the map.');
}
function setupMonsterTown(){
  S.enemies=[];S.allies=[];S.proj=[];S.hazards=[];S.followers=[];S._sol={};S.bloodMoon=false;S.rival=null;S.rivalDone=false;S.rivalT=0;
  const P=S.P;P.r=20;P.dead=false;P.armorT=0;P.invisT=0;P.stunT=0;P.rootT=0;P.car=null;P.hidden=null;teleport(P,BASE.x,BASE.y+70,'out');P.hp=maxHp();
  const T=TOWNS[S.town];
  if(T.arena){const w=spawnMonster(T.boss,1200,360,{sc:'out'});w.hx=1200;w.hy=360;return;}
  S.camps.forEach(c=>{if(!c.raided)makeCampHostile(c);});
  S.blds.forEach(b=>{if(T.outposts.includes(b.id)){b.outpost=true;b.awake=false;b.maxHp=240;b.hp=240;b.fallen=false;b.spawnT=rnd(3,6);
    spawnHuman('scav',b.lx,b.ly,b);spawnHuman(Math.random()<.5?'hunter':'trapper',b.lx,b.ly,b);
    const I=S.interiors[b.id];if(I){const cap=spawnHuman('hunter',I.x+I.w/2,I.y+140,b,{sc:b.id});cap.captain=true;cap.hp*=2.2;cap.maxHp=cap.hp;cap.r=15;cap.name='Outpost Captain';
      for(let k=0;k<2;k++){const h=spawnHuman(pick(['hunter','torch','scav']),I.x+rnd(120,I.w-120),I.y+rnd(120,I.h-160),b,{sc:b.id});}}}});
}
function pollAutosave(dt){S.saveT=(S.saveT||0)+dt;if(S.saveT>60){S.saveT=0;saveGame(true);}}
// ================= MAIN UPDATE =================
function update(dt){
  S._sol={};
  S.t+=dt;if(S.shake>0)S.shake=Math.max(0,S.shake-dt*20);if(S.fade>0)S.fade-=dt;
  updateClock(dt);updatePlayer(dt);updateHold(dt);updateFollowers(dt);updatePickups(dt);updateCamps(dt);updateCrew(dt);
  S.echoQ=S.echoQ.filter(q=>{q.t-=dt;if(q.t<=0){if(!S.P.dead&&level(q.id))castPower(q.id,.5,true);return false;}return true;});
  for(const id in S.cds)S.cds[id]=Math.max(0,S.cds[id]-dt);
  for(const c of S.cars)c.flash-=dt;
  S.windows.forEach(w=>w.flash-=dt);
  for(const e of S.enemies){if(e.dead)continue;if(e.kind==='monster')updateMonster(e,dt);else updateHuman(e,dt);}
  separate();updateAllies(dt);
  if(S.mode==='hunter')updateTurrets(dt);
  updateProj(dt);updateHazards(dt);
  S.enemies=S.enemies.filter(e=>!e.dead);S.allies=S.allies.filter(a=>!a.dead);
  S.fx.forEach(f=>{f.life-=dt;if(f.type==='p'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.92;f.vy*=.92;}});S.fx=S.fx.filter(f=>f.life>0);
  S.floats.forEach(f=>{f.life-=dt;f.y-=30*dt;});S.floats=S.floats.filter(f=>f.life>0);
  if(S.banners.length){S.banners[0].life-=dt;if(S.banners[0].life<=0)S.banners.shift();}
  if(S.mode==='monster'){updateOutposts(dt);S.fear=Math.max(0,S.fear-dt*.15);}
  if(S.rivalT>0){S.rivalT-=dt;if(S.rivalT<=0){S.rivalT=0;if(!S.rival&&!S.rivalDone)spawnRival();}}
  if(S.pendingStory>0&&S.mode==='hunter'&&!S.pendingTurn){S.pendingStory-=dt;if(S.pendingStory<=0)afterBossStory();}
  if(S.pendingVance&&!ovMode){S.pendingVance=0;showChoice('vance');}
  updateVance(dt);pollAutosave(dt);
  if(S.pendingTurn>0&&S.mode==='hunter'){S.pendingTurn-=dt;if(S.pendingTurn<=0)showTurnStory();}
  if(S.pendingWin>0){S.pendingWin-=dt;if(S.pendingWin<=0)winGame();}
  if(S.pendingState>0){S.pendingState-=dt;if(S.pendingState<=0)showStateCard();}
}
