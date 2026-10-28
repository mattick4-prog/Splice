// ================= SPAWNING =================
function spawnMonster(type,x,y,o){
  o=o||{};const d=MONSTERS[type];const lvl=d.boss?1:(1+(S.day-1)*.1)*(TOWNS[S.town].lvl||1);
  const eh=DIFFS[S.diff].ehp;const m={kind:'monster',type,name:d.name,x,y,r:d.r,hp:d.hp*lvl*eh,maxHp:d.hp*lvl*eh,spd:d.spd,dmg:d.dmg*lvl,color:d.color,eye:d.eye,
    home:o.home||null,hx:x,hy:y,state:'idle',wx:x,wy:y,wT:0,atkCd:0,abCd:rnd(1,3),ab2:2,stunT:0,boss:!!d.boss,stolen:[],raid:!!o.raid,
    flash:0,alpha:1,dashT:0,dvx:0,dvy:0,awake:!d.boss,resist:[],fa:rnd(0,6.28),dead:false,slowT:0,vulnT:0,fearT:0,charmT:0,rootT:0,dots:{},mut:null,leap:null,sc:o.sc||scAt(x,y),bob:rnd(0,6)};
  if(S.bloodMoon&&S.night&&S.mode==='hunter')mutate(m);
  S.enemies.push(m);return m;
}
function spawnHuman(type,x,y,home,o){
  o=o||{};const d=HUMANS[type];const sc=1+S.day*.06;
  const h={kind:'human',type,name:d.name,x:x+rnd(-18,18),y:y+rnd(-18,18),r:d.r,hp:d.hp*sc,maxHp:d.hp*sc,spd:d.spd,color:d.color,bio:d.bio,
    home:home||null,hx:x,hy:y,wx:x,wy:y,wT:0,atkCd:rnd(.5,1.5),abCd:rnd(2,5),stunT:0,flash:0,alert:0,resist:[...S.resist],purge:!!o.purge,
    stolen:[],dead:false,flee:false,fa:0,slowT:0,vulnT:0,fearT:0,charmT:0,rootT:0,dots:{},sc:o.sc||'out'};
  S.enemies.push(h);return h;
}
function spawnRival(){
  const nm=S.choices&&S.choices.vance&&S.choices.vance!=='fight'&&S.mode==='monster'||S.vanceGone||S.vanceDead?pick(['Captain Reyes','The Twins','Sergeant Okafor']):'Vance, the Last Hunter';
  const side=pick([[40,rnd(100,WH-100)],[WW-40,rnd(100,WH-100)],[rnd(100,WW-100),40]]);
  const r={kind:'human',type:'rival',name:'Vance, the Last Hunter',isRival:true,name:nm,x:side[0],y:side[1],r:17,hp:480*(1+S.town*.25),maxHp:480*(1+S.town*.25),spd:150,color:'#e8e8e8',bio:40,
    home:null,atkCd:1.5,abCd:3,siphonCd:6,dashCd:0,siphon:null,strafe:1,stunT:0,flash:0,alert:99,resist:[],stolen:[],dead:false,fa:0,slowT:0,vulnT:0,fearT:0,charmT:0,rootT:0,dots:{},sc:'out'};
  S.enemies.push(r);S.rival=r;
  banner(nm.toUpperCase().split(',')[0]+' HAS ARRIVED',(nm.startsWith('Vance')?'The last hunter in the county. He':'A hunter captain who')+' absorbs DNA too, and can rip your powers out.','#7fd6ff');
  toast('Vance can SIPHON: when a red circle locks onto you, get out of it.','bad');
}
function mutate(m){if(m.mut||m.boss||MONSTERS[m.type].mimic)return;m.mut=pick(MUTS);m.spd*=1.2;m.dmg*=1.35;
  if(m.mut==='Giant'){m.r*=1.35;m.maxHp*=1.7;m.hp*=1.7;}if(m.mut==='Swift')m.spd*=1.3;}
function wakeBoss(m){m.awake=true;banner(m.name.toUpperCase()+' WAKES',m.type==='queen'?'The tide comes in with her.':'Everything in this town came out of her.',m.eye);}

// ================= STATUS EFFECTS =================
function hasTrait(id){return S.traits&&S.traits.includes(id)&&(S.dna[id]||0)>=100;}
function applyStatus(e,st,m,stunT){
  if(!st||e.dead)return;if(Array.isArray(st)){st.forEach(s=>applyStatus(e,s,m,stunT));return;}
  m=m||1;const boss=e.boss||e.isRival;
  switch(st){
    case 'burn':e.dots.burn={dps:7*m,t:3};break;
    case 'poison':e.dots.poison={dps:5*m,t:5};break;
    case 'bleed':e.dots.bleed={dps:4*m,t:6};break;
    case 'slow':e.slowT=Math.max(e.slowT,2.5);break;
    case 'freeze':e.stunT=Math.max(e.stunT,boss?.5:1.4*Math.min(m,1.3));e.slowT=Math.max(e.slowT,3.5);e.frozen=1.4;break;
    case 'stun':e.stunT=Math.max(e.stunT,(stunT||.9)*(boss?.4:1)*Math.min(m,1.3));break;
    case 'vuln':e.vulnT=Math.max(e.vulnT,6);break;
    case 'fear':if(!boss)e.fearT=Math.max(e.fearT||0,3*Math.min(m,1.3));break;
    case 'charm':if(!boss)e.charmT=Math.max(e.charmT||0,4.5*Math.min(m,1.3));break;
    case 'root':e.rootT=Math.max(e.rootT||0,boss?.6:2);break;
  }
}
function tickStatus(e,dt){
  for(const k in e.dots){const d=e.dots[k];d.t-=dt;if(d.t<=0){delete e.dots[k];continue;}if(!e.dead)dmgFoe(e,d.dps*dt,null,true,{dot:1});}
  e.fearT=(e.fearT||0)-dt;e.charmT=(e.charmT||0)-dt;e.rootT=(e.rootT||0)-dt;if(e.frozen)e.frozen-=dt;
}

// ================= COMBAT =================
function damagePlayer(dmg,src,kind){
  const P=S.P;if(P.dead||P.dashT>0||P.leap)return;
  if((kind==='fire'||kind==='burn')&&(hasTrait('firewalker')||P.buffs.fireimm>0))return;
  const car=P.car||P.hidden;
  if(car){car.hp-=dmg*.7*(car.locked&&P.hidden===car?.7:1);if(P.hidden===car)S.carGrime=Math.min(1,(S.carGrime||0)+.15);car.flash=.12;S.shake=Math.min(6,S.shake+2);if(car.hp<=0)wreckCar(car);return;}
  dmg*=DIFFS[S.diff].edmg;if(P.posted)dmg*=.5;
  if(P.hexT>0)dmg*=1.5;
  if(hasTrait('coldblood'))dmg*=.9;
  if(P.armorT>0)dmg*=(S.mode==='monster'&&S.resist.includes('metal'))?.6:.3;
  if(src&&src.kind==='monster'&&!src.dead){
    if(P.buffs.thorns>0){dmgFoe(src,dmg*1.2+6,null,false);if(P.buffs.thornSt)applyStatus(src,P.buffs.thornSt,1);}
    if(hasTrait('thornskin'))dmgFoe(src,dmg*.3+2,null,true);
    if(hasTrait('toxicblood'))applyStatus(src,'poison',1);
  }
  P.hp-=dmg;if(P.hurtT<=0)sfx('hurt');P.hurtT=.18;S.shake=Math.min(9,S.shake+dmg*.35);
  if(P.hp<=0)playerDown(src);
}
function dmgFoe(e,amt,src,quiet,opt){
  if(e.dead)return;opt=opt||{};
  if(src&&e.resist&&e.resist.includes(src)){amt*=.4;if(!quiet&&Math.random()<.3)floatText(e.x,e.y-e.r-18,'RESIST','#7fc8ff');}
  if(opt.melee&&e.type==='crawler')amt*=.6;
  if(S.mode==='monster'&&S.night)amt*=1.3;
  if(e.vulnT>0)amt*=1.6;
  if(e.boss&&!e.awake)wakeBoss(e);
  e.hp-=amt;if(!opt.dot)e.flash=.1;
  if(!opt.dot){
    if(e.kind==='monster'&&e.state!=='chase'&&!S.P.dead&&e.sc===S.P.sc&&!(e.charmT>0))e.state='chase';
    if(e.kind==='human')e.alert=4;
    if(S.P.buffs.lifesteal>0)healPlayer(amt*.15,true);
    else if(opt.melee&&hasTrait('lifesteal'))healPlayer(amt*.12,true);
  }
  if(opt.st)applyStatus(e,opt.st,opt.m||1,opt.stunT);
  if(opt.mods){if(opt.mods.includes('vamp'))healPlayer(amt*.15,true);if(opt.mods.includes('burn'))applyStatus(e,'burn',1);if(opt.mods.includes('chill'))applyStatus(e,'slow',1);if(opt.mods.includes('shock'))applyStatus(e,'stun',1,.4);}
  if(!quiet)floatText(e.x+rnd(-8,8),e.y-e.r-6,Math.round(amt),src&&POWERS[src]?POWERS[src].color:'#fff');
  if(!opt.dot&&!quiet)sfx('hit');
  if(e.hp<=0)killEnemy(e);
}
function dmgStructures(x,y,r,amt){
  if(S.mode!=='monster'||!amt)return;
  for(const b of S.blds){if(!b.outpost||b.fallen)continue;
    const cx=clamp(x,b.x-14,b.x+b.w+14),cy=clamp(y,b.y-14,b.y+b.h+14);
    if(Math.hypot(x-cx,y-cy)<r){b.hp-=amt;b.flash=.1;if(b.hp<=0)outpostFall(b);}}
}
function killEnemy(e){
  if(e.dead)return;e.dead=true;burst(e.x,e.y,e.color,16);sfx(e.boss?'boss':'kill');
  e.stolen.forEach(returnStolen);e.stolen=[];
  jobOnKill(e);
  if(e.kind==='monster'){
    S.stats.kills++;const d=MONSTERS[e.type];
    if(e.mut==='Volatile'){addFx({type:'shock',x:e.x,y:e.y,r:90,life:.4,color:'#ff4d5e'});if(!S.P.dead&&e.sc===S.P.sc&&dist(e,S.P)<90)damagePlayer(18,null);}
    if(d.mimic&&S.mode==='hunter')mimicReward(e);
    if(S.mode==='hunter'&&!e.boss&&d.genes&&d.genes.length&&(!d.minion||Math.random()<.4)){dropStrand(e);if(e.mut&&Math.random()<.5)dropStrand(e);}
    if(S.mode==='hunter'&&Math.random()<.3&&!e.boss){const k=pick(['food','scrap','wood','ammo']);const n=k==='ammo'?3:1;S.res[k]+=n;floatText(e.x,e.y-36,'+'+n+' '+RES_ICON[k],'#ffd166');}
    if(e.home&&e.home.id&&!e.boss){const L=tlog();if(!L.lairs.includes(e.home.id))L.lairs.push(e.home.id);}
    if(e.boss)bossDefeated();
  }else{
    S.stats.humans++;S.biomass+=e.bio;S.fear=Math.min(100,S.fear+1.5);if(S.mode==='hunter')humanityHit(3);
    floatText(e.x,e.y-18,'+'+e.bio+' 🧬','#c27bff');
    if(e.isRival)rivalDefeated();
    if(e.captain&&e.home&&!e.home.fallen){banner('CAPTAIN DOWN','With their captain gone, the '+e.home.name+' outpost collapses.','#ff7a2f');outpostFall(e.home);}
  }
}
// ================= DNA STRANDS & VAULT =================
const QUAL={rough:{name:'Rough',col:'#b8a890',min:5,max:8},clean:{name:'Clean',col:'#7fd6ff',min:12,max:18},pure:{name:'Pure',col:'#ffd166',min:26,max:34}};
function rollGene(genes){const w=[.6,.28,.12];let r=Math.random()*w.slice(0,genes.length).reduce((a,b)=>a+b,0);for(let i=0;i<genes.length;i++){r-=w[i];if(r<=0)return genes[i];}return genes[0];}
function rollQuality(){const bonus=(S.night?.08:0)+(S.bloodMoon&&S.night?.1:0)+(hasTrait('glow')?.1:0)+(S.tier>=2?.08:0);const r=Math.random();return r<.08+bonus*.6?'pure':r<.4+bonus?'clean':'rough';}
function dropStrand(e,gene,q){
  const d=MONSTERS[e.type];gene=gene||rollGene(d.genes);q=q||rollQuality();
  const Q=QUAL[q];S.pickups.push({x:e.x,y:e.y,sc:e.sc,gene,q,val:irnd(Q.min,Q.max),t:0,vx:rnd(-90,90),vy:rnd(-90,90)});
}
function vaultCap(){return 10+S.tier*2;}
function addToVault(pk){
  const g=geneInfo(pk.gene),Q=QUAL[pk.q];
  if(S.vault.length>=vaultCap()){addDNA(pk.gene,Math.round(pk.val*.5));toast('Vault full, so you absorbed the '+g.name+' strand raw (half strength).','bad');return;}
  S.vault.push({id:Math.random(),gene:pk.gene,q:pk.q,val:pk.val,age:0});sfx('pickup');
  floatText(S.P.x,S.P.y-40,'🧪 '+Q.name+' '+g.name+' strand → Vault','#'+(pk.q==='pure'?'ffd166':pk.q==='clean'?'7fd6ff':'e2dccf'));
  if(!S.vaultHint){S.vaultHint=1;banner('DNA STRAND COLLECTED','It\'s in your Vault. Press Tab: absorb it now at half strength, or sequence it at the DNA Lab for full strength.',g.color);}
}
function updatePickups(dt){
  const P=S.P;
  S.pickups.forEach(p=>{p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.9;p.vy*=.9;
    if(P.dead||p.sc!==P.sc||S.mode!=='hunter')return;const d=dist(p,P);
    if(d<140&&p.t>.4){p.x+=(P.x-p.x)/d*320*dt;p.y+=(P.y-p.y)/d*320*dt;}
    if(d<26&&p.t>.4){p.got=true;addToVault(p);}});
  S.pickups=S.pickups.filter(p=>!p.got&&p.t<90);
}
function mimicReward(e){
  const genes=[];for(const t in MONSTERS){const m=MONSTERS[t];if(!m.boss&&!m.minion&&m.genes&&m.genes.length)genes.push(...m.genes);}
  const big=e.type==='house';for(let i=0;i<(big?3:1);i++)dropStrand(e,pick(genes),Math.random()<.4?'pure':'clean');
  const parts=giveRes(rollTable(e.loot||{wood:1,scrap:1,food:1},big?7:3),e.x,e.y-50);
  toast('The mimic was stuffed with stolen supplies and DNA strands: '+parts.join(', ')+'.','good');
}
function addDNA(id,amt,src){
  const g=geneInfo(id);if(!g)return;
  const before=S.dna[id]||0,after=Math.min(g.trait?100:150,before+amt);S.dna[id]=after;
  const x=src?src.x:S.P.x,y=(src?src.y:S.P.y)-44;
  if(g.trait){
    floatText(x,y,g.icon+' '+g.name+' '+Math.round(after)+'%'+(after<100?' · '+Math.ceil(100-after)+'% to unlock':''),g.color);
    if(before<100&&after>=100){S.stats.powers++;banner('NEW TRAIT: '+g.name.toUpperCase(),g.desc+' Press Tab to wear it.',g.color);const i=S.traits.indexOf(null);if(i>=0)S.traits[i]=id;humanityHit(6);}
    return;
  }
  const next=after<40?' · '+Math.ceil(40-after)+'% to unlock':after<100?' · '+Math.ceil(100-after)+'% to full':after<150?' · '+Math.ceil(150-after)+'% to master':'';
  floatText(x,y,g.icon+' '+g.name+' '+Math.round(after)+'%'+next,g.color);
  if(before<40&&after>=40){S.stats.powers++;banner('NEW POWER: '+g.name.toUpperCase(),'Echo strength for now. Press Tab to see your DNA and equip powers.',g.color);autoSlot(id);humanityHit(4);}
  if(before<100&&after>=100){banner('FULL POWER: '+g.name.toUpperCase(),'Your body rewrites itself again. It can now hold 2 gene mods.',g.color);humanityHit(7);}
  if(before<150&&after>=150){banner('MASTERY: '+g.name.toUpperCase(),MEMORY[id]||'You know this power better than the thing you took it from.',g.color);if(MEMORY[id])toast(MEMORY[id],'mem');humanityHit(5);}
}
function autoSlot(id,quiet){
  if(S.slots.includes(id))return;const i=S.slots.indexOf(null);
  if(i>=0){S.slots[i]=id;if(!quiet)toast(POWERS[id].name+' equipped to key '+(i+1)+'.');}
  else if(!quiet)toast(POWERS[id].name+' is ready. Press Tab to put it on a key.');
}
function humanityHit(n){
  if(S.mode!=='hunter')return;
  S.humanity=Math.max(0,S.humanity-n);
  const st=S.humanity<25?3:S.humanity<50?2:S.humanity<75?1:0;
  if(st>S.hstage){S.hstage=st;toast(['','Your eyes have started to glow in the dark.','Those are claws. You have claws now.','The plating on your back won\'t come off.'][st],'mem');}
  if(S.humanity<=0&&!S.pendingTurn){S.turnReason='humanity';S.pendingTurn=1.6;banner('SOMETHING IS WRONG','Your humanity just hit zero.','#c27bff');}
}
function stealPower(src){
  const opts=S.slots.map((id,i)=>({id,i})).filter(o=>o.id&&(S.dna[o.id]||0)>=40);
  if(!opts.length)return;
  if(src.kind==='monster'&&src.stolen.length)return;
  const o=pick(opts);S.stolen[o.id]=S.dna[o.id];S.dna[o.id]=0;S.slots[o.i]=null;src.stolen.push(o.id);
  if(src.isRival||src.boss){src.hp=Math.min(src.maxHp,src.hp+120);}
  else{src.maxHp*=1.6;src.hp=src.maxHp;src.dmg*=1.3;src.r*=1.15;src.home=null;src.raid=false;src.hx=src.x;src.hy=src.y;}
  banner(POWERS[o.id].name.toUpperCase()+' STOLEN',src.name+' ripped it out of you. Hunt it down to take it back.','#ff4d5e');
}
function returnStolen(id){S.dna[id]=S.stolen[id]||100;delete S.stolen[id];toast('You took back '+POWERS[id].name+'.','good');autoSlot(id);}

// ================= POWER ENGINE =================
const FX={
  bolt(f,c){const P=S.P,n=f.n||1,spd=f.spd||500;for(let i=0;i<n;i++){const a=P.face+(n>1?(i-(n-1)/2)*(f.spread||.15):0);
    S.proj.push({x:P.x+Math.cos(a)*18,y:P.y+Math.sin(a)*18,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:f.r||5,dmg:(f.dmg||0)*c.m,owner:'p',life:(f.range||400)*c.area/spd,
      color:POWERS[c.src].color,src:c.src,homing:f.homing,pierce:f.pierce,hit:[],st:f.st,explode:f.explode?f.explode*c.area:0,heal:f.heal?f.heal*c.m:0,knock:f.knock||0,zone:f.zone||null,spike:f.spike,sc:P.sc,mods:c.mods,m:c.m,orb:!f.spike});}},
  nova(f,c){const P=S.P,at=f.at==='aim'?aimPoint(260):{x:P.x,y:P.y},R=f.r*c.area;let hits=0;
    S.enemies.forEach(e=>{if(!e.dead&&e.sc===P.sc&&dist(e,at)<R+e.r){hits++;dmgFoe(e,(f.dmg||0)*c.m,c.src,!f.dmg,{st:f.st,m:c.m,mods:c.mods,stunT:f.stunT});
      if(f.knock&&!e.boss&&e.type!=='house'){const d=dist(e,at)||1;e.x+=(e.x-at.x)/d*f.knock;e.y+=(e.y-at.y)/d*f.knock;}}});
    if(f.heal&&hits)healPlayer(f.heal*hits*c.m);
    dmgStructures(at.x,at.y,R,(f.dmg||0)*c.m);addFx({type:'shock',x:at.x,y:at.y,r:R,life:.45,color:POWERS[c.src].color});if((f.dmg||0)>20)S.shake=Math.max(S.shake,5);},
  cone(f,c){const P=S.P,R=f.r*c.area,arc=f.arc||.7;
    S.enemies.forEach(e=>{if(e.dead||e.sc!==P.sc)return;const d=dist(e,P);if(d<R+e.r&&(Math.abs(angDiff(Math.atan2(e.y-P.y,e.x-P.x),P.face))<arc||d<P.r+e.r)){
      dmgFoe(e,(f.dmg||0)*c.m,c.src,!f.dmg,{st:f.st,m:c.m,mods:c.mods});if(f.knock&&!e.boss&&e.type!=='house'){e.x+=Math.cos(P.face)*f.knock;e.y+=Math.sin(P.face)*f.knock;}}});
    dmgStructures(P.x+Math.cos(P.face)*R*.5,P.y+Math.sin(P.face)*R*.5,R*.5,(f.dmg||0)*c.m);addFx({type:'cone',x:P.x,y:P.y,a:P.face,r:R,arc,life:.35,color:POWERS[c.src].color});},
  chain(f,c){const P=S.P;let cur=P;const hit=[];const n=(f.n||3)+Math.round(c.m*2);
    for(let k=0;k<n;k++){const e=nearestFoe(cur,(k?190:290)*c.area,hit);if(!e)break;hit.push(e);addFx({type:'bolt',x:cur.x,y:cur.y,x2:e.x,y2:e.y,life:.25,color:'#7fd6ff'});dmgFoe(e,f.dmg*c.m,c.src,false,{st:f.st,m:c.m,mods:c.mods});cur=e;}
    if(!hit.length)floatText(P.x,P.y-30,'No target in range','#bbb');},
  beam(f,c){const P=S.P,e=nearestFoe(P,(f.range||250)*c.area);if(!e){floatText(P.x,P.y-30,'No target in range','#bbb');return;}
    addFx({type:'beam',x:P.x,y:P.y,x2:e.x,y2:e.y,life:.35,color:POWERS[c.src].color});
    if(f.pull&&!e.boss&&e.type!=='house'){const d=dist(e,P)||1;e.x=P.x+(e.x-P.x)/d*(P.r+e.r+6);e.y=P.y+(e.y-P.y)/d*(P.r+e.r+6);}
    dmgFoe(e,(f.dmg||0)*c.m,c.src,!f.dmg,{st:f.st,m:c.m,mods:c.mods});if(f.heal)healPlayer(f.heal*c.m);},
  zone(f,c){const P=S.P,at=f.at==='aim'?aimPoint(240):f.at==='front'?{x:P.x+Math.cos(P.face)*60,y:P.y+Math.sin(P.face)*60}:{x:P.x,y:P.y};
    S.hazards.push({x:at.x,y:at.y,r:f.r*c.area,life:f.life||5,max:f.life||5,dps:(f.dps||0)*c.m,owner:'p',color:POWERS[c.src].color,src:c.src,kind:f.kind||'zone',st:f.st,pull:f.pull||0,follow:!!f.follow,sc:P.sc,mods:c.mods,m:c.m,tick:0});},
  line(f,c){const P=S.P;for(let i=1;i<=f.n;i++){const d=i*f.gap*c.area;S.hazards.push({x:P.x+Math.cos(P.face)*d,y:P.y+Math.sin(P.face)*d,r:f.r,life:f.life,max:f.life,dps:f.dps*c.m,owner:'p',color:POWERS[c.src].color,src:c.src,kind:f.kind||'zone',st:f.st,sc:P.sc,mods:c.mods,m:c.m,tick:0});}},
  dash(f,c){const P=S.P,dist0=(f.dist||230)*c.area*(hasTrait('springlegs')?1.3:1);P.dashT=dist0/880;P.dashVx=Math.cos(P.face)*880;P.dashVy=Math.sin(P.face)*880;P.dashM=c.m;P.dashSrc=c.src;P.dashHit=[];P.trail=0;P.dashFx=f;P.dashMods=c.mods;},
  leap(f,c){const P=S.P,t=aimPoint((f.dist||260)*c.area*(hasTrait('springlegs')?1.3:1));P.leap={sx:P.x,sy:P.y,tx:t.x,ty:t.y,t:0,dur:.42,m:c.m,src:c.src,f,mods:c.mods,area:c.area};},
  teleport(f,c){const P=S.P,t=aimPoint(f.dist*c.area);addFx({type:'ring',x:P.x,y:P.y,r:26,life:.4,color:POWERS[c.src].color});P.x=t.x;P.y=t.y;pushOut(P,solidsFor(P.sc));addFx({type:'ring',x:P.x,y:P.y,r:26,life:.4,color:POWERS[c.src].color});
    S.enemies.forEach(e=>{if(e.kind==='monster'&&e.state==='chase'&&dist(e,P)>150)e.state='idle';});},
  buff(f,c){const P=S.P,d=(f.dur||4)*(c.m<1?.75:c.m>1.2?1.3:1);
    if(f.armor)P.armorT=Math.max(P.armorT,d);if(f.invis){P.invisT=Math.max(P.invisT,d);S.enemies.forEach(e=>{if(e.kind==='monster'&&e.state==='chase')e.state='idle';});}
    for(const k of ['speed','regen','thorns','lifesteal','frenzy','fireimm'])if(f[k])P.buffs[k]=Math.max(P.buffs[k]||0,d);
    if(f.thornSt)P.buffs.thornSt=f.thornSt;
    addFx({type:'ring',x:P.x,y:P.y,r:36,life:.45,color:POWERS[c.src].color,follow:true});},
  heal(f,c){healPlayer(f.amt*Math.min(c.m,1.3));},
  summon(f,c){const P=S.P;const n=f.n+(c.m>=1.4?1:0)-(c.m<1&&f.n>1?1:0);
    for(let i=0;i<n;i++)S.allies.push({x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),r:f.look==='decoy'||f.look==='clone'?13:f.look==='rat'?7:9,hp:f.hp*c.m,maxHp:f.hp*c.m,dmg:f.dmg*c.m,spd:f.spd||165,life:f.life,atkCd:0,dead:false,sc:P.sc,look:f.look,taunt:!!f.taunt,col:POWERS[c.src].color});
    addFx({type:'ring',x:P.x,y:P.y,r:50,life:.5,color:POWERS[c.src].color});},
  wave(f,c){const P=S.P,a=P.face;S.proj.push({x:P.x+Math.cos(a)*20,y:P.y+Math.sin(a)*20,vx:Math.cos(a)*400,vy:Math.sin(a)*400,r:60*c.area,dmg:f.dmg*c.m,owner:'p',life:1.3,color:'#5fd3e8',src:c.src,pierce:true,hit:[],wave:true,knock:.18,sc:P.sc,mods:c.mods,m:c.m});S.shake=5;},
  roll(f,c){const P=S.P;P.rollT=f.pulses*.26;P.rollTick=0;P.rollM=c.m;P.rollSrc=c.src;P.rollF=f;P.rollMods=c.mods;P.rollArea=c.area;},
  screen(f,c){const P=S.P,cam=getCam();let n=0;
    S.enemies.forEach(e=>{if(e.dead||e.sc!==P.sc||!onCam(e.x,e.y,0,cam))return;n++;dmgFoe(e,(f.dmg||0)*c.m,c.src,!f.dmg,{st:f.st,m:c.m,mods:c.mods});});
    addFx({type:'flash',x:0,y:0,life:.5,color:POWERS[c.src].color});S.shake=8;if(!n)floatText(P.x,P.y-30,'No enemies in sight','#bbb');},
  strikes(f,c){const P=S.P;const t=S.enemies.filter(e=>!e.dead&&e.sc===P.sc&&dist(e,P)<420*c.area).sort((a,b)=>dist(a,P)-dist(b,P)).slice(0,f.n);
    t.forEach(e=>{addFx({type:'bolt',x:e.x+rnd(-20,20),y:e.y-300,x2:e.x,y2:e.y,life:.3,color:'#cfefff'});dmgFoe(e,f.dmg*c.m,c.src,false,{st:f.st,m:c.m,mods:c.mods});});
    if(!t.length)floatText(P.x,P.y-30,'No targets','#bbb');S.shake=6;},
  mark(f,c){const P=S.P;let n=0;S.enemies.forEach(e=>{if(!e.dead&&e.sc===P.sc&&dist(e,P)<f.r*c.area){applyStatus(e,'vuln',1);e.marked=6;n++;}});
    addFx({type:'shock',x:P.x,y:P.y,r:f.r*c.area,life:.7,color:POWERS[c.src].color});floatText(P.x,P.y-30,n+' marked','#f2dc7a');}
};
function powerCd(id){const def=POWERS[id],mods=S.gmods[id]||[];return def.cd*(level(id)<1?1.3:1)*(mods.includes('quick')?.75:1)*(def.curse==='sluggish'?1.4:1);}
function castPower(id,mult,isEcho){
  const def=POWERS[id],L=level(id)||1,mods=S.gmods[id]||[];
  const c={m:L*(mods.includes('amp')?1.3:1)*(S.P.buffs.frenzy>0?1.25:1)*(mult||1)*(def.boost||1),area:mods.includes('wide')?1.35:1,src:id,mods};
  def.fx.forEach(f=>FX[f.t]&&FX[f.t](f,c));sfx('power');
  if(!isEcho&&mods.includes('echo'))S.echoQ.push({t:.6,id});
}
function castSlot(i){
  if(S.paused)return;const P=S.P;if(P.dead||P.stunT>0)return;
  if(P.car||P.hidden){floatText(P.x,P.y-30,'Get out of the car first','#bbb');return;}
  const id=S.slots[i];if(!id){floatText(P.x,P.y-30,'Key '+(i+1)+' is empty. Press Tab.','#bbb');return;}
  if(!level(id))return;
  if((S.cds[id]||0)>0)return;
  castPower(id);
  S.cds[id]=powerCd(id);
  S.usage[id]=(S.usage[id]||0)+1;
  const cu=POWERS[id].curse;if(cu==='hungry')humanityHit(2);if(cu==='recoil'){P.hp-=8;P.hurtT=.15;if(P.hp<=0)playerDown(null);}
  if(S.mode==='hunter')humanityHit(.15);
}
function useMeds(){
  if(S.mode!=='hunter')return;
  if(S.res.meds<1){toast('No meds left.');return;}
  if(S.P.hp>=maxHp()){toast('Already at full health.');return;}
  S.res.meds--;healPlayer(45);
}
function doSplice(a,b){
  const A=POWERS[a],B=POWERS[b],key=recipeKey(a,b),R=RECIPES[key],hid='H_'+a+'_'+b,same=A.fam===B.fam;
  if(R)POWERS[hid]={id:hid,fam:A.fam,fam2:B.fam,name:R.name,icon:R.icon,cd:R.cd,desc:R.desc,fx:R.fx,color:A.color,color2:B.color,hybrid:true,parts:[a,b]};
  else{const curse=same?null:pick(Object.keys(CURSES));
    POWERS[hid]={id:hid,fam:A.fam,fam2:B.fam,name:(same?'Fused ':'Unstable ')+A.name.split(' ')[0]+' '+B.name.split(' ').slice(-1)[0],icon:A.icon+B.icon,cd:Math.round(Math.max(A.cd,B.cd)*.9),
      desc:(same?'A stable fusion of ':'An unstable mix of ')+A.name+' and '+B.name+'. Both fire at once'+(same?'.':', 15% stronger.'),fx:A.fx.concat(B.fx),color:A.color,color2:B.color,hybrid:true,parts:[a,b],curse,boost:same?1:1.15};}
  S.dna[hid]=100;S.dna[a]=0;S.dna[b]=0;delete S.gmods[a];delete S.gmods[b];
  S.slots=S.slots.map(s=>(s===a||s===b)?null:s);autoSlot(hid,true);
  if(!S.recipesFound.includes(key)&&R)S.recipesFound.push(key);
  const H=POWERS[hid];
  banner((R?'RECIPE FOUND: ':'SPLICED: ')+H.name.toUpperCase(),R?R.desc:(H.curse?'It\'s unstable. Curse: '+CURSES[H.curse].name+' ('+CURSES[H.curse].desc+').':H.desc),A.color);
}
function cycleWeapon(){
  if(S.mode!=='hunter'||S.weapons.length<2)return;
  S.wpn=(S.wpn+1)%S.weapons.length;const W=WEAPONS[S.weapons[S.wpn]];
  floatText(S.P.x,S.P.y-34,W.icon+' '+W.name+(W.ranged?' ('+S.res.ammo+' ammo)':''),'#ffd166');
}

// ================= PLAYER =================
function playerAttack(){
  const P=S.P,hunter=S.mode==='hunter',W=WEAPONS[S.weapons[S.wpn]]||WEAPONS.crowbar,fr=P.buffs.frenzy>0?1.5:1;
  if(hunter&&W.ranged){
    if(S.res.ammo<=0){floatText(P.x,P.y-30,'OUT OF AMMO (press Q)','#ff8a95');P.atkCd=.5;return;}
    S.res.ammo--;P.atkCd=W.cd;P.swing=.1;sfx('shot');S.shake=Math.max(S.shake,W.pellets>1?4:1.5);
    for(let i=0;i<W.pellets;i++){const a=P.face+rnd(-W.spread,W.spread),sp=rnd(650,760);
      S.proj.push({x:P.x+Math.cos(P.face)*20,y:P.y+Math.sin(P.face)*20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:3,dmg:W.dmg*fr,owner:'p',life:W.range/sp,color:'#ffe08a',bullet:true,sc:P.sc});}
    addFx({type:'p',x:P.x+Math.cos(P.face)*26,y:P.y+Math.sin(P.face)*26,vx:0,vy:0,life:.08,color:'#fff4b0',r:9});
    return;
  }
  P.atkCd=(hunter?W.cd:.34)*(P.buffs.speed>0?.85:1);P.swing=.15;sfx('swing');
  const range=(hunter?W.range:90)+(P.posted?50:0),dmg=(hunter?W.dmg:22+S.evo.claw*6)*fr,a=P.face,arc=hunter?W.arc:1.15;
  addFx({type:'swing',x:P.x,y:P.y,a,r:range,arc,life:.15,color:hunter?'#fff':'#ff6bd6',follow:true});
  S.enemies.forEach(e=>{if(e.dead||e.sc!==P.sc)return;const d=dist(P,e);if(d<range+e.r){const ang=Math.atan2(e.y-P.y,e.x-P.x);if(Math.abs(angDiff(ang,a))<arc||d<P.r+e.r)dmgFoe(e,dmg,null,false,{melee:true});}});
  if(!hunter)dmgStructures(P.x+Math.cos(a)*42,P.y+Math.sin(a)*42,55,dmg);
  if(hunter&&P.sc!=='out'&&P.sc!=='base')breakProps(range,a,arc,dmg*(W.brk||1));
}
function breakProps(range,a,arc,dmg){
  const P=S.P,I=S.interiors[P.sc];if(!I)return;
  for(const p of I.props){if(p.dead||!PROPS[p.type].brk)continue;
    const c={x:p.x+p.w/2,y:p.y+p.h/2},d=rectDist(P,p);
    if(d<range-10&&(Math.abs(angDiff(Math.atan2(c.y-P.y,c.x-P.x),a))<arc+.4||d<P.r+6)){
      p.hp-=dmg;p.flash=.12;burst(c.x,c.y,PROPS[p.type].col,4);
      if(p.hp<=0){p.dead=true;S._sol={};S.stats.broken++;const D=PROPS[p.type].brk,got={};
        for(const k in D)got[k]=irnd(D[k][0],D[k][1]);burst(c.x,c.y,PROPS[p.type].col,14);
        const parts=giveRes(got,c.x,c.y-10);if(!parts.length)floatText(c.x,c.y-10,'nothing useful','#999');}
    }}
}
function playerDown(src){
  const P=S.P;
  if(P.car||P.hidden){P.car=null;P.hidden=null;}
  P.dead=true;P.hp=0;P.respawnT=4;P.dashT=0;P.invisT=0;P.armorT=0;P.leap=null;P.rollT=0;P.buffs={};burst(P.x,P.y,S.mode==='hunter'?'#ff4d5e':'#c27bff',24);
  if(S.mode==='hunter'){
    S.lives--;
    if(src&&src.kind==='monster'&&!src.dead)stealPower(src);
    if(S.lives<=0){scavengedRestart();banner('LAST LIFE LOST','Everything goes dark…','#ff4d5e');return;}
    const lost=[];for(const k in S.res){const l=Math.floor(S.res[k]*.3);if(l>0){S.res[k]-=l;lost.push(l+' '+k);}}
    spawnStrays(3,16);toast('🩸 The smell of your blood draws more monsters into town.','bad');
    toast('You went down. '+S.lives+(S.lives===1?' life':' lives')+' left.'+(lost.length?' Dropped '+lost.join(', ')+'.':''),'bad');
    banner('YOU WENT DOWN',S.lives+(S.lives===1?' life left. Be careful.':' lives left. Crawling back to base…'),'#ff4d5e');
  }else{
    if(src&&src.isRival)stealPower(src);
    const l=Math.floor(S.biomass*.3);S.biomass-=l;
    if(S.nestDead){gameOver('The survivors burned your nest, then they found you. The town goes quiet again.');return;}
    toast('You were driven back to the nest. Lost '+l+' biomass.','bad');
    banner('DRIVEN BACK','Reforming in the nest…','#c27bff');
  }
}
function respawn(){
  const P=S.P;P.dead=false;P.hp=maxHp()*.6;P.stunT=0;P.rootT=0;P.slowT=0;P.hexT=0;
  if(S.mode==='hunter'){const B=S.baseInt;teleport(P,B.x+B.w/2,B.y+B.h/2,'base');if(S.restartCard){P.hp=maxHp();showRestartCard();saveGame(true);}}
  else teleport(P,BASE.x,BASE.y+70,'out');
  S.enemies.forEach(e=>{if(e.kind==='monster'&&e.state==='chase')e.state='idle';});
}
function moveSpeed(){
  const P=S.P;let sp=P.spd;
  if(S.mode==='monster')sp=185*(1+.12*S.evo.spd)*(S.night?1.15:1);
  else if(S.starving)sp*=.88;
  if(hasTrait('swift'))sp*=1.12;if(hasTrait('springlegs'))sp*=1.08;if(P.buffs.speed>0)sp*=1.3;
  if(P.slowT>0&&!hasTrait('bogskin'))sp*=.5;
  return sp;
}
function updatePlayer(dt){
  const P=S.P;
  if(P.dead){P.respawnT-=dt;if(P.respawnT<=0)respawn();return;}
  P.armorT-=dt;P.invisT-=dt;P.stunT-=dt;P.rootT-=dt;P.hurtT-=dt;P.atkCd-=dt;P.swing-=dt;P.slowT-=dt;P.hexT-=dt;P.doorCd-=dt;P.hornCd-=dt;
  for(const k in P.buffs)if(typeof P.buffs[k]==='number'){P.buffs[k]-=dt;if(P.buffs[k]<=0)delete P.buffs[k];}
  if(!P.buffs.thorns)delete P.buffs.thornSt;
  if(hasTrait('mindshield')){P.stunT=Math.min(P.stunT,0);P.hexT=0;}
  if(hasTrait('bogskin'))P.rootT=Math.min(P.rootT,0);
  const reg=(hasTrait('regen')?2:0)+(P.buffs.regen>0?6:0);if(reg)P.hp=Math.min(maxHp(),P.hp+reg*dt);
  if(P.hp>maxHp())P.hp=maxHp();
  if(P.car){updateCar(dt);return;}
  if(P.hidden){P.x=P.hidden.x;P.y=P.hidden.y;S.atBase=false;updateHiding(dt);return;}
  const cam=getCam();
  let mx=0,my=0;
  if(keys['w']||keys['arrowup'])my-=1;if(keys['s']||keys['arrowdown'])my+=1;
  if(keys['a']||keys['arrowleft'])mx-=1;if(keys['d']||keys['arrowright'])mx+=1;
  const ml=Math.hypot(mx,my);if(ml){mx/=ml;my/=ml;}
  if(S.padAimT&&performance.now()-S.padAimT<400)P.face=S.padAim;
  else if(performance.now()-mouse.moved<2500){const wx=cam.x+mouse.x/SCALE,wy=cam.y+mouse.y/SCALE;P.face=Math.atan2(wy-P.y,wx-P.x);}
  else if(ml)P.face=Math.atan2(my,mx);
  if(P.rollT>0){P.rollT-=dt;P.rollTick-=dt;if(P.rollTick<=0){P.rollTick=.26;const f=P.rollF||{r:100,dmg:14,knock:30},R=f.r*(P.rollArea||1);
    S.enemies.forEach(e=>{if(!e.dead&&e.sc===P.sc&&dist(e,P)<R+e.r){dmgFoe(e,f.dmg*P.rollM,P.rollSrc,false,{mods:P.rollMods});const d=dist(e,P)||1;if(!e.boss&&e.type!=='house'){e.x+=(e.x-P.x)/d*(f.knock||30);e.y+=(e.y-P.y)/d*(f.knock||30);}}});
    dmgStructures(P.x,P.y,R,f.dmg*P.rollM);addFx({type:'shock',x:P.x,y:P.y,r:R,life:.25,color:'#8fd060'});}}
  if(P.leap){const L=P.leap;L.t+=dt;const k=Math.min(1,L.t/L.dur);P.x=L.sx+(L.tx-L.sx)*k;P.y=L.sy+(L.ty-L.sy)*k;
    if(k>=1){P.leap=null;const f=L.f||{r:95,dmg:30,st:'stun'},R=f.r*(L.area||1);S.enemies.forEach(e=>{if(!e.dead&&e.sc===P.sc&&dist(e,P)<R+e.r)dmgFoe(e,f.dmg*L.m,L.src,false,{st:f.st,m:L.m,mods:L.mods,stunT:.6});});
      dmgStructures(P.x,P.y,R,f.dmg*L.m);addFx({type:'shock',x:P.x,y:P.y,r:R,life:.4,color:POWERS[L.src]?POWERS[L.src].color:'#c6d94a'});S.shake=7;pushOut(P,solidsFor(P.sc));}
    return;}
  if(P.dashT>0){
    const f=P.dashFx||{};P.dashT-=dt;P.x+=P.dashVx*dt;P.y+=P.dashVy*dt;P.trail-=dt;
    if(f.trail&&P.trail<=0){P.trail=.035;S.hazards.push({x:P.x,y:P.y,r:26,life:2.6,max:2.6,dps:f.trail.dps*P.dashM,owner:'p',color:'#ff7a2f',src:P.dashSrc,kind:'fire',st:f.trail.st,sc:P.sc,m:P.dashM,tick:0});}
    S.enemies.forEach(e=>{if(!e.dead&&e.sc===P.sc&&!P.dashHit.includes(e)&&dist(e,P)<P.r+e.r+8){P.dashHit.push(e);dmgFoe(e,(f.hit||14)*P.dashM,P.dashSrc,false,{st:f.st,m:P.dashM,mods:P.dashMods});}});
    pushOut(P,solidsFor(P.sc));
  }else if(P.stunT<=0&&(P.rootT<=0)){
    const sp=moveSpeed();P.x+=mx*sp*dt;P.y+=my*sp*dt;if(ml)P.walk+=dt*sp/30;
  }
  pushOut(P,solidsFor(P.sc));
  if(P.sc==='out'&&S.mode==='hunter')for(const c of S.cars){const d=Math.hypot(P.x-c.x,P.y-c.y),rr=CARTYPES[c.type].w*.42+P.r;if(d<rr&&d>0){P.x=c.x+(P.x-c.x)/d*rr;P.y=c.y+(P.y-c.y)/d*rr;}}
  clampScene(P);
  if((mouse.down||keys[' ']||keys['j'])&&P.atkCd<=0&&P.stunT<=0&&P.dashT<=0)playerAttack();
  if(S.mode==='hunter'){S.atBase=P.sc==='base';if(S.atBase)P.hp=Math.min(maxHp(),P.hp+(S.tier>=1?5:2)*dt);updateDoors();}
  else{S.atBase=P.sc==='out'&&dist(P,BASE)<BASE_ZONE;if(S.atBase&&!S.nestDead)P.hp=Math.min(maxHp(),P.hp+10*dt);updateDoors();}
}

// ================= CARS =================
function nearCar(){const P=S.P;if(P.sc!=='out')return null;let best=null,bd=64;for(const c of S.cars){const d=Math.hypot(P.x-c.x,P.y-c.y)-CARTYPES[c.type].w*.3;if(d<bd){bd=d;best=c;}}return best;}
function enterCar(c){const P=S.P;P.car=c;P.hidden=null;c.v=0;P.x=c.x;P.y=c.y;
  toast('Driving the '+CARTYPES[c.type].name+'. WASD to steer, Space to '+(CARTYPES[c.type].siren?'use the siren':CARTYPES[c.type].music?'play the jingle':'honk')+', E to get out.');}
function exitSpot(c){const P=S.P,a=c.a+Math.PI/2,o=CARTYPES[c.type].h*.5+P.r+8;P.x=c.x+Math.cos(a)*o;P.y=c.y+Math.sin(a)*o;pushOut(P,solidsFor('out'));clampScene(P);}
function exitCar(){const P=S.P,c=P.car;P.car=null;c.v=0;exitSpot(c);}
function hideIn(c){const P=S.P;P.hidden=c;P.x=c.x;P.y=c.y;
  S.enemies.forEach(m=>{m.sawHide=m.state==='chase'&&m.sc==='out'&&dist(m,P)<170;if(!m.sawHide&&m.kind==='monster'&&m.state==='chase')m.state='idle';});
  toast('Hiding in the car. Monsters that didn\'t see you get in will lose track of you. E to get out.');}
function exitHide(){const P=S.P,c=P.hidden;P.hidden=null;S.quiet=false;S.carMsg='';S.enemies.forEach(m=>m.sus=0);exitSpot(c);}
function searchCar(c){
  c.searched=true;S.stats.searched++;
  const parts=giveRes(rollTable({food:2,ammo:2,meds:1,scrap:1,fuel:1,mutagen:.3},irnd(1,2)+(hasTrait('luck')&&Math.random()<.4?1:0)),c.x,c.y-30);
  toast('Searched the '+(c.wreck?'wrecked ':'')+CARTYPES[c.type].name.toLowerCase()+': '+(parts.join(', ')||'nothing')+'.');
  if(Math.random()<.3)giveKey();
}
function giveKey(){
  const cand=S.cars.filter(c=>c.drivable&&!S.keys[c.id]);if(!cand.length)return false;
  const c=pick(cand),CT=CARTYPES[c.type];S.keys[c.id]=true;
  banner('FOUND CAR KEYS','Keys to the '+CT.cname+' '+CT.name+'. Go outside and follow the gold 🔑 arrow to it, then press E next to it to drive.','#ffd166');toast('🔑 These keys start the '+CT.name+'. A gold arrow on screen points to it, and the map shows a 🔑.','good');return true;
}
function wreckCar(c){
  const P=S.P;c.drivable=false;c.wreck=true;c.hp=0;c.v=0;burst(c.x,c.y,'#ff7a2f',30);burst(c.x,c.y,'#555',20);S.shake=10;
  addFx({type:'shock',x:c.x,y:c.y,r:90,life:.4,color:'#ff7a2f'});
  if(P.car===c||P.hidden===c){P.car=null;P.hidden=null;exitSpot(c);toast('The car is wrecked. You crawl out.','bad');P.hp-=12;if(P.hp<=0)playerDown(null);}
}
function updateCar(dt){
  const P=S.P,c=P.car,CT=CARTYPES[c.type];
  let mx=0,my=0;
  if(keys['w']||keys['arrowup'])my-=1;if(keys['s']||keys['arrowdown'])my+=1;
  if(keys['a']||keys['arrowleft'])mx-=1;if(keys['d']||keys['arrowright'])mx+=1;
  if(mx||my){const ta=Math.atan2(my,mx);c.a+=clamp(angDiff(ta,c.a),-3.6*dt,3.6*dt);c.v=Math.min(CT.spd,c.v+540*dt);}
  else c.v*=Math.pow(.2,dt);
  c.x+=Math.cos(c.a)*c.v*dt;c.y+=Math.sin(c.a)*c.v*dt;
  const body={x:c.x,y:c.y,r:CT.w*.42};
  if(pushOut(body,solidsFor('out'))){if(c.v>160){c.hp-=c.v*.03;c.flash=.1;S.shake=4;}c.v*=.4;}
  for(const o of S.cars){if(o===c)continue;const d=Math.hypot(body.x-o.x,body.y-o.y),rr=body.r+CARTYPES[o.type].w*.42;if(d<rr&&d>0){body.x=o.x+(body.x-o.x)/d*rr;body.y=o.y+(body.y-o.y)/d*rr;c.v*=.5;}}
  c.x=clamp(body.x,30,WW-30);c.y=clamp(body.y,30,WH-30);
  if(c.v>110)S.enemies.forEach(e=>{if(e.dead||e.sc!=='out')return;if(Math.hypot(e.x-c.x,e.y-c.y)<body.r+e.r){
    dmgFoe(e,c.v*.1*CT.ram,null);if(!e.boss&&e.type!=='house'){e.x+=Math.cos(c.a)*40;e.y+=Math.sin(c.a)*40;}c.hp-=3;c.v*=.8;burst(e.x,e.y,e.color,6);}});
  P.x=c.x;P.y=c.y;P.face=c.a;S.atBase=false;
  if((keys[' ']||mouse.down)&&P.hornCd<=0){
    if(CT.siren){P.hornCd=6;addFx({type:'shock',x:c.x,y:c.y,r:230,life:.6,color:'#4a8aff'});S.enemies.forEach(e=>{if(!e.dead&&e.sc==='out'&&dist(e,c)<230)e.stunT=Math.max(e.stunT,1.6);});}
    else if(CT.music){P.hornCd=10;addFx({type:'shock',x:c.x,y:c.y,r:270,life:.7,color:'#ff9ad0'});S.enemies.forEach(e=>{if(!e.dead&&e.sc==='out'&&dist(e,c)<270){e.stunT=Math.max(e.stunT,2.2);floatText(e.x,e.y-e.r-10,'♪','#ff9ad0');}});}
    else{P.hornCd=2.5;addFx({type:'shock',x:c.x,y:c.y,r:140,life:.3,color:'#ffd166'});S.enemies.forEach(e=>{if(!e.dead&&e.sc==='out'&&!e.boss&&dist(e,c)<140){const d=dist(e,c)||1;e.x+=(e.x-c.x)/d*60;e.y+=(e.y-c.y)/d*60;}});}
  }
  if(c.hp<=0)wreckCar(c);
}

// ================= ENEMY AI =================
function raidHit(m){
  const P=S.P;
  if((P.sc==='base'||P.posted)&&!P.dead){
    if(m.win===undefined)m.win=Math.floor(Math.random()*4);
    const W=S.windows[m.win];
    if(W.hp>0){W.hp=Math.max(0,W.hp-m.dmg);W.flash=.25;if(W.hp<=0)toast('A window just broke. Something is climbing in!','bad');}
    else{const bw=S.baseInt.windows[m.win];teleport(m,bw.ix,bw.iy,'base');m.raid=false;m.state='chase';m.hx=bw.ix;m.hy=bw.iy;floatText(bw.ix,bw.iy-24,'IT GOT IN!','#ff4d5e');S.shake=6;if(P.posted){exitPost();toast('Something got inside! You jump back from the window.','bad');}}
  }else{damageBase(m.dmg);const br=baseRect();addFx({type:'bite',x:clamp(m.x,br.x,br.x+br.w),y:clamp(m.y,br.y,br.y+br.h),life:.2,color:'#ffb347'});}
}
function charmedAct(m,dt){
  const t=nearestIn(S.enemies.filter(e=>e!==m&&!(e.charmT>0)),m,320);
  if(!t){m.fa+=dt;return;}
  const dx=t.x-m.x,dy=t.y-m.y,d=Math.hypot(dx,dy)||1;
  if(d>m.r+t.r+4){const sp=m.spd*(m.slowT>0?.45:1);m.x+=dx/d*sp*dt;m.y+=dy/d*sp*dt;m.fa=Math.atan2(dy,dx);}
  else if(m.atkCd<=0){m.atkCd=1;dmgFoe(t,m.dmg*1.5,null,false);addFx({type:'bite',x:t.x,y:t.y,life:.2,color:'#d6ff70'});}
}
function updateMonster(m,dt){
  const P=S.P;m.flash-=dt;tickStatus(m,dt);if(m.dead)return;
  if(m.stunT>0){m.stunT-=dt;return;}
  if(MONSTERS[m.type].splits&&!m.split&&m.hp<m.maxHp*.5){m.split=true;const k=spawnMonster(m.type,m.x+24,m.y+10,{sc:m.sc,home:m.home,raid:m.raid});k.split=true;k.hp=m.hp;k.maxHp=m.maxHp;k.state='chase';floatText(m.x,m.y-m.r-20,'IT SPLIT IN TWO!','#ffffff');burst(m.x,m.y,'#ffffff',10);}
  m.atkCd-=dt;m.abCd-=dt;m.ab2-=dt;m.slowT-=dt;m.vulnT-=dt;if(m.marked)m.marked-=dt;
  if(m.mut==='Regen')m.hp=Math.min(m.maxHp,m.hp+4*dt);
  const same=m.sc===P.sc,pd=same?dist(m,P):1e9;
  if(same&&pd<380&&S.mode==='hunter')S.seen[m.type]=1;
  if(S.mods.lights&&S.mode==='hunter'&&m.sc==='out'&&rectDist(m,baseRect())<170)m.slowT=Math.max(m.slowT,.2);
  if(m.boss&&!m.awake){if(same&&!P.dead&&pd<240)wakeBoss(m);return;}
  if(m.charmT>0){charmedAct(m,dt);pushOut(m,solidsFor(m.sc));clampScene(m);return;}
  if(m.fearT>0&&same){const d=pd||1;if(!(m.rootT>0)){m.x-=(P.x-m.x)/d*m.spd*1.1*dt;m.y-=(P.y-m.y)/d*m.spd*1.1*dt;m.fa=Math.atan2(m.y-P.y,m.x-P.x);}pushOut(m,solidsFor(m.sc));clampScene(m);return;}
  if(m.leap){const L=m.leap;L.t+=dt;const k=Math.min(1,L.t/L.dur);m.x=L.sx+(L.tx-L.sx)*k;m.y=L.sy+(L.ty-L.sy)*k;
    if(k>=1){m.leap=null;addFx({type:'shock',x:m.x,y:m.y,r:75,life:.35,color:'#c6d94a'});if(same&&!P.dead&&dist(m,P)<75+P.r)damagePlayer(m.dmg*1.3,m);pushOut(m,solidsFor(m.sc));}return;}
  if(m.dashT>0){m.dashT-=dt;m.x+=m.dvx*dt;m.y+=m.dvy*dt;if(same&&!P.dead&&dist(m,P)<m.r+P.r&&m.atkCd<=0){m.atkCd=.8;damagePlayer(m.dmg*1.2,m);}pushOut(m,solidsFor(m.sc));clampScene(m);return;}
  const nightMul=S.night&&m.sc==='out'?1.25:1;
  const hidden=P.hidden&&!m.sawHide;
  if(hidden&&same&&!P.dead&&!m.boss&&!m.raid){
    if(pd<200&&m.state!=='chase'){m.wx=P.x+rnd(-30,30);m.wy=P.y+rnd(-30,30);m.wT=1.2;}
    if(pd<120){m.sus=Math.min(1,(m.sus||0)+dt*susRate());
      if(m.sus>=1){m.sawHide=true;m.state='chase';floatText(m.x,m.y-m.r-20,'IT FOUND YOU','#ff4d5e');S.shake=8;}}
    else m.sus=Math.max(0,(m.sus||0)-dt*.3);
  }else if(m.sus)m.sus=Math.max(0,m.sus-dt*.3);
  const visible=same&&!P.dead&&!hidden&&(P.invisT<=0||pd<45);
  const aggro=m.boss?520:(S.night&&m.sc==='out'?380:290);
  if(visible&&pd<aggro)m.state='chase';
  else if(m.state==='chase'&&(!visible||pd>650))m.state='idle';
  if(m.boss&&m.state==='chase'&&Math.hypot(m.x-m.hx,m.y-m.hy)>400&&pd>220)m.state='idle';
  let tgt=m.state==='chase'?P:null;
  const decoy=S.allies.find(a=>!a.dead&&a.taunt&&a.sc===m.sc&&dist(a,m)<340);
  if(decoy)tgt=decoy;else{const al=nearestIn(S.allies,m,160);if(al&&(!tgt||dist(al,m)<pd))tgt=al;}
  if(m.sc==='base'){const cm=nearestIn(S.crew.filter(c=>!c.dead),m,200);if(cm&&(!tgt||dist(cm,m)<pd-30))tgt=cm;}
  let tx,ty,sp=m.spd*nightMul*(m.slowT>0?.45:1);
  if(tgt){tx=tgt.x;ty=tgt.y;}
  else if(m.raid&&m.sc==='out'){tx=BASE.x;ty=BASE.y;}
  else{m.wT-=dt;if(m.wT<=0){m.wT=rnd(2,4);m.wx=m.hx+rnd(-120,120);m.wy=m.hy+rnd(-120,120);}tx=m.wx;ty=m.wy;sp*=.4;}
  const dx=tx-m.x,dy=ty-m.y,dd=Math.hypot(dx,dy)||1;
  const atBase=!tgt&&m.raid&&m.sc==='out'&&rectDist(m,baseRect())<=m.r+10;
  const reach=tgt?tgt.r+m.r+((P.car||P.hidden)&&tgt===P?18:0):4;
  if(!atBase&&dd>reach&&!(m.rootT>0)){m.x+=dx/dd*sp*dt;m.y+=dy/dd*sp*dt;m.fa=Math.atan2(dy,dx);}
  if(m.type==='wisp'&&!(m.rootT>0)){m.x+=Math.sin(S.t*5+m.hx)*60*dt;m.y+=Math.cos(S.t*4+m.hy)*60*dt;}
  if(tgt&&dd<=reach+8&&m.atkCd<=0){m.atkCd=m.boss?1.2:1;addFx({type:'bite',x:tgt.x,y:tgt.y,life:.2,color:m.eye});
    if(tgt===P)damagePlayer(m.dmg,m);else tgt.hp-=m.dmg;
    if(m.type==='leech')m.hp=Math.min(m.maxHp,m.hp+m.dmg);}
  if(atBase&&m.atkCd<=0){m.atkCd=1;raidHit(m);}
  if(m.type==='stalker')m.alpha=(tgt&&dd<130)||m.flash>0||m.marked>0?1:.25;
  if(tgt===P&&!P.dead){
    if(m.type==='hound'&&m.abCd<=0&&dd<320&&dd>70){m.abCd=2.6;shootAt(m,P,380,7,'#9fe8ff');}
    if(m.type==='bell'&&m.abCd<=0&&dd<120){m.abCd=5.5;if(!P.car&&!P.hidden&&!hasTrait('mindshield')){P.stunT=.9;floatText(P.x,P.y-30,'STUNNED','#f2dc7a');}addFx({type:'shock',x:m.x,y:m.y,r:120,life:.5,color:'#f2dc7a'});}
    if(m.type==='matron'&&m.abCd<=0&&dd<220){m.abCd=5;S.hazards.push({x:m.x,y:m.y,r:65,life:4.5,max:4.5,dps:9,owner:'e',color:'#a6d65a',kind:'spore',sc:m.sc});}
    if(m.type==='crow'&&m.abCd<=0&&dd<280&&dd>80){m.abCd=3.2;m.dashT=.35;m.dvx=dx/dd*560;m.dvy=dy/dd*560;}
    if(m.type==='lurker'&&m.abCd<=0&&dd<230){m.abCd=5;S.hazards.push({x:P.x,y:P.y,r:70,life:5,max:5,dps:5,owner:'e',color:'#6a5a22',kind:'tar',sc:m.sc});}
    if(m.type==='gator'&&m.abCd<=0&&dd<85){m.abCd=4;addFx({type:'shock',x:m.x,y:m.y,r:95,life:.35,color:'#8fd060'});damagePlayer(m.dmg*1.2,m);}
    if(m.type==='wisp'&&m.abCd<=0&&dd<340){m.abCd=3;S.proj.push({x:m.x,y:m.y,vx:dx/dd*180,vy:dy/dd*180,r:6,dmg:6,owner:'e',life:3,color:'#7fe0c8',from:m,homing:true,sc:m.sc});}
    if(m.type==='hag'&&m.abCd<=0&&dd<260){m.abCd=6;if(!hasTrait('mindshield')){P.hexT=4;floatText(P.x,P.y-30,'HEXED: +50% damage taken','#d6ff70');}addFx({type:'bolt',x:m.x,y:m.y,x2:P.x,y2:P.y,life:.3,color:'#d6ff70'});}
    if(m.type==='toad'&&m.abCd<=0&&dd<300&&dd>90){m.abCd=4;m.leap={sx:m.x,sy:m.y,tx:P.x,ty:P.y,t:0,dur:.5};}
    if(m.type==='reed'&&m.abCd<=0&&dd<330&&dd>60){m.abCd=2.6;for(let i=-1;i<=1;i++){const a=Math.atan2(dy,dx)+i*.2;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,r:3,dmg:6,owner:'e',life:1,color:'#e6cf86',from:m,spike:true,sc:m.sc});}}
    if(m.type==='house'&&m.abCd<=0&&dd<360){m.abCd=3;for(let i=-1;i<=1;i++){const a=Math.atan2(dy,dx)+i*.25;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*320,vy:Math.sin(a)*320,r:7,dmg:10,owner:'e',life:1.6,color:'#8a6a44',from:m,sc:m.sc});}}
    if(m.stolen.length&&m.ab2<=0&&dd<340){m.ab2=2.2;shootAt(m,P,420,10,POWERS[m.stolen[0]]?POWERS[m.stolen[0]].color:'#fff',7);}
  }
  {const d=MONSTERS[m.type];if(d.abs){if(!m.abT)m.abT=d.abs.map(a=>rnd(1,a.cd||3));d.abs.forEach((a,i)=>{if(a.k==='invis'){m.alpha=(tgt&&dd<130)||m.flash>0||m.marked>0?1:.22;return;}
    if(tgt!==P||P.dead||(m.boss&&!m.awake))return;m.abT[i]-=dt;if(m.abT[i]>0)return;if(runMonsterAb(m,a,dd,dx,dy))m.abT[i]=a.cd*rnd(.85,1.15);});}
    if(d.warden&&m.awake)wardenPhase(m);}
  if(m.boss&&m.awake&&same&&!P.dead&&pd<700){
    const minion=MONSTERS[m.type].minionType||(m.type==='queen'?'drowned':'brat');
    if(m.abCd<=0){m.abCd=6.5;const n=S.enemies.filter(e=>e.type===minion&&!e.dead).length;
      if(n<6)for(let i=0;i<(m.type==='queen'?3:2);i++){const b=spawnMonster(minion,m.x+rnd(-40,40),m.y+rnd(-40,40),{sc:'out'});b.state='chase';}}
    if(m.type==='queen'){m.ab3=(m.ab3===undefined?3:m.ab3)-dt;if(m.ab3<=0){m.ab3=4.5;const a=Math.atan2(P.y-m.y,P.x-m.x);S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*300,vy:Math.sin(a)*300,r:45,dmg:16,owner:'e',life:2.2,color:'#5fd3e8',from:m,wave:true,sc:'out'});}}
    if(m.hp<m.maxHp*.6&&m.ab2<=0){m.ab2=4.5;for(let i=0;i<12;i++){const a=i/12*Math.PI*2+S.t;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*260,vy:Math.sin(a)*260,r:6,dmg:8,owner:'e',life:2.2,color:m.eye,from:m,sc:'out'});}}
  }
  if(!m.boss)pushOut(m,solidsFor(m.sc));
  clampScene(m);
}
function updateHuman(h,dt){
  h.flash-=dt;tickStatus(h,dt);if(h.dead)return;
  if(h.stunT>0||h.charmT>0){h.stunT-=dt;return;}
  const P=S.P;h.atkCd-=dt;h.abCd-=dt;h.alert-=dt;
  const pd=h.sc===P.sc?dist(h,P):1e9;
  const reveal=h.resist.includes('ghost')?170:50;
  const visible=!P.dead&&h.sc===P.sc&&(P.invisT<=0||pd<reveal);
  if(h.type==='rival'){updateRival(h,dt,pd,visible);return;}
  const sight=(S.night?230:380)+(h.alert>0?200:0);
  const sees=visible&&pd<sight;
  h.slowT-=dt;h.vulnT-=dt;
  let mx=0,my=0,sp=h.spd*(h.slowT>0?.45:1);const l=pd||1,ux=(P.x-h.x)/l,uy=(P.y-h.y)/l;
  if(h.flee||h.fearT>0||(h.type==='scav'&&sees&&(pd<240||S.fear>=60))){
    mx=-ux;my=-uy;sp*=1.15;
    if(h.flee){h.fleeT=(h.fleeT===undefined?7:h.fleeT)-dt;if(h.fleeT<=0||h.x<15||h.x>WW-15||h.y<15||h.y>WH-15){h.dead=true;return;}}
  }else if(sees&&h.type!=='scav'){
    if(h.type==='hunter'){
      if(pd<190){mx=-ux;my=-uy;}else if(pd>270){mx=ux;my=uy;}else{mx=-uy*.6;my=ux*.6;}
      if(h.atkCd<=0){h.atkCd=S.fear>=60?1.8:1.25;const a=Math.atan2(P.y-h.y,P.x-h.x)+rnd(-.12,.12);
        S.proj.push({x:h.x,y:h.y,vx:Math.cos(a)*440,vy:Math.sin(a)*440,r:3,dmg:7,owner:'e',life:1.4,color:'#ffe08a',from:h,sc:h.sc,bullet:true});}
    }else if(h.type==='torch'){
      if(pd>70){mx=ux;my=uy;}else{damagePlayer(20*dt,h,'fire');if(Math.random()<.5)addFx({type:'p',x:h.x+ux*20,y:h.y+uy*20,vx:ux*120+rnd(-40,40),vy:uy*120+rnd(-40,40),life:.35,color:pick(['#ffb347','#ff7a2f','#ffd166']),r:rnd(3,6)});}
    }else if(h.type==='trapper'){
      if(pd>220){mx=ux;my=uy;}else if(pd<150){mx=-ux;my=-uy;}
      if(h.abCd<=0){h.abCd=5;S.hazards.push({kind:'trap',x:P.x,y:P.y,r:22,life:9,max:9,arm:.8,owner:'e',sc:h.sc});}
      if(h.atkCd<=0&&pd<260){h.atkCd=1.7;shootAt(h,P,400,5,'#d9b8ff',3);}
    }
    h.fa=Math.atan2(uy,ux);
  }else if(h.purge){
    const dx=BASE.x-h.x,dy=BASE.y-h.y,ll=Math.hypot(dx,dy)||1;
    if(S.nestDead)h.purge=false;
    else if(ll>70+h.r){mx=dx/ll;my=dy/ll;}
    else if(h.atkCd<=0){h.atkCd=1;damageNest(h.type==='torch'?14:8);if(h.type==='torch')burst(h.x+dx/ll*14,h.y+dy/ll*14,'#ff7a2f',4);}
  }else{
    h.wT-=dt;if(h.wT<=0){h.wT=rnd(2,5);h.wx=h.hx+rnd(-140,140);h.wy=h.hy+rnd(-140,140);}
    const dx=h.wx-h.x,dy=h.wy-h.y,ll=Math.hypot(dx,dy);if(ll>6){mx=dx/ll;my=dy/ll;sp*=.45;}
  }
  if((mx||my)&&!(h.type==='hunter'&&sees))h.fa=Math.atan2(my,mx);
  if(!(h.rootT>0)){h.x+=mx*sp*dt;h.y+=my*sp*dt;}pushOut(h,solidsFor(h.sc));clampScene(h);
}
function updateRival(h,dt,pd,visible){
  const P=S.P;h.dashCd-=dt;h.siphonCd-=dt;h.slowT-=dt;h.vulnT-=dt;
  let mx=0,my=0;const l=pd||1,ux=(P.x-h.x)/l,uy=(P.y-h.y)/l;
  if(!P.dead){
    if(Math.random()<dt*.3)h.strafe*=-1;
    if(pd<200){mx=-ux;my=-uy;}else if(pd>300){mx=ux;my=uy;}else{mx=-uy*h.strafe;my=ux*h.strafe;}
    if(pd<100&&h.dashCd<=0){h.dashCd=3;addFx({type:'ring',x:h.x,y:h.y,r:24,life:.3,color:'#7fd6ff'});h.x-=ux*170;h.y-=uy*170;clampScene(h);}
    if(h.atkCd<=0&&visible){h.atkCd=1.05;const n=h.stolen.length?3:1;
      for(let i=0;i<n;i++){const a=Math.atan2(P.y-h.y,P.x-h.x)+(i-(n-1)/2)*.18;S.proj.push({x:h.x,y:h.y,vx:Math.cos(a)*520,vy:Math.sin(a)*520,r:5,dmg:9+3*h.stolen.length,owner:'e',life:1.6,color:'#7fd6ff',from:h,sc:'out'});}}
    if(h.siphonCd<=0&&!h.siphon&&visible&&pd<330){h.siphon={x:P.x,y:P.y,t:1.2};h.siphonCd=11;floatText(P.x,P.y-40,'SIPHON! MOVE!','#ff4d5e');}
    h.fa=Math.atan2(uy,ux);
  }
  if(h.siphon){h.siphon.t-=dt;if(h.siphon.t<=0){
    if(!P.dead&&dist(P,h.siphon)<80){damagePlayer(14,h);if(!P.dead)stealPower(h);}
    addFx({type:'shock',x:h.siphon.x,y:h.siphon.y,r:80,life:.4,color:'#ff4d5e'});h.siphon=null;}}
  const sp=h.spd*(h.slowT>0?.5:1)*(h.rootT>0?0:1);h.x+=mx*sp*dt;h.y+=my*sp*dt;pushOut(h,solidsFor('out'));clampScene(h);
}
function separate(){
  const a=S.enemies;
  for(let i=0;i<a.length;i++){const e=a[i];if(e.dead)continue;
    for(let j=i+1;j<a.length;j++){const f=a[j];if(f.dead||f.sc!==e.sc)continue;
      const dx=f.x-e.x,dy=f.y-e.y,d=Math.hypot(dx,dy),mn=e.r+f.r;
      if(d>0&&d<mn){const p=(mn-d)/2,ux=dx/d,uy=dy/d;if(!e.boss){e.x-=ux*p;e.y-=uy*p;}if(!f.boss){f.x+=ux*p;f.y+=uy*p;}}}}
}
function updateAllies(dt){
  const P=S.P;
  S.allies.forEach(a=>{a.life-=dt;a.atkCd-=dt;if(a.life<=0||a.hp<=0){a.dead=true;burst(a.x,a.y,a.col||'#b880ff',6);return;}
    if(a.sc!==P.sc){teleport(a,P.x+rnd(-20,20),P.y+rnd(-20,20),P.sc);}
    if(a.look==='decoy')return;
    const e=nearestFoe(a,420);let tx,ty;
    if(e){tx=e.x;ty=e.y;}else{tx=P.x+Math.cos(S.t+a.maxHp)*40;ty=P.y+Math.sin(S.t+a.maxHp)*40;}
    const dx=tx-a.x,dy=ty-a.y,d=Math.hypot(dx,dy)||1;
    if(e&&d<a.r+e.r+4){if(a.atkCd<=0){a.atkCd=.7;dmgFoe(e,a.dmg,null,true);}}
    else if(d>6){a.x+=dx/d*a.spd*dt;a.y+=dy/d*a.spd*dt;}
    pushOut(a,solidsFor(a.sc));
  });
}
function updateTurrets(dt){
  const n=turretCount(),tr=TR();
  for(let i=0;i<n;i++){
    const ang=-Math.PI/2+i*2*Math.PI/n,tx=BASE.x+Math.cos(ang)*tr,ty=BASE.y+Math.sin(ang)*tr;
    S.turCd[i]-=dt;const e=nearestFoe({x:tx,y:ty,sc:'out'},320);
    if(e){S.turA[i]=Math.atan2(e.y-ty,e.x-tx);
      if(S.turCd[i]<=0){S.turCd[i]=1;S.proj.push({x:tx,y:ty,vx:Math.cos(S.turA[i])*620,vy:Math.sin(S.turA[i])*620,r:3,dmg:10,owner:'p',life:.7,color:'#ffd166',sc:'out',turret:true});}}
  }
}
function projExplode(p){
  addFx({type:'shock',x:p.x,y:p.y,r:p.explode,life:.35,color:p.color});
  S.enemies.forEach(e=>{if(!e.dead&&e.sc===p.sc&&dist(e,p)<p.explode+e.r&&!(p.hit||[]).includes(e)){dmgFoe(e,p.dmg*.6,p.src,true,{st:p.st,m:p.m,mods:p.mods});if(p.knock&&!e.boss){const d=dist(e,p)||1;e.x+=(e.x-p.x)/d*p.knock;e.y+=(e.y-p.y)/d*p.knock;}}});
  dmgStructures(p.x,p.y,p.explode,p.dmg*.6);
  if(p.zone)S.hazards.push({x:p.x,y:p.y,r:p.zone.r,life:p.zone.life,max:p.zone.life,dps:p.zone.dps*(p.m||1),owner:'p',color:p.color,src:p.src,kind:p.zone.kind||'zone',st:p.zone.st,sc:p.sc,m:p.m,tick:0});
}
function updateProj(dt){
  const P=S.P;
  S.proj.forEach(p=>{
    if(p.homing){const t=p.owner==='e'?(P.dead||P.sc!==p.sc?null:P):nearestFoe(p,420,p.hit);
      if(t){const a=Math.atan2(t.y-p.y,t.x-p.x),sp=Math.hypot(p.vx,p.vy),cur=Math.atan2(p.vy,p.vx),na=cur+clamp(angDiff(a,cur),-4*dt,4*dt);p.vx=Math.cos(na)*sp;p.vy=Math.sin(na)*sp;}}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.life<=0){if(p.explode&&!p.boom){p.boom=1;projExplode(p);}return;}
    if(p.owner==='e'){
      if(!P.dead&&!P.leap&&P.sc===p.sc&&dist(p,P)<p.r+P.r+((P.car||P.hidden)?14:0)){p.life=0;damagePlayer(p.dmg,p.from);burst(p.x,p.y,p.color,4);
        if(!P.car&&!P.hidden){if(p.pst==='slow'&&!hasTrait('bogskin')&&!hasTrait('coldblood'))P.slowT=Math.max(P.slowT,1.5);if(p.pst==='stun'&&!hasTrait('mindshield'))P.stunT=Math.max(P.stunT,.5);}return;}
      for(const a of S.allies){if(!a.dead&&a.sc===p.sc&&dist(p,a)<p.r+a.r){a.hp-=p.dmg;p.life=0;return;}}
    }else if(p.pierce){
      S.enemies.forEach(e=>{if(!e.dead&&e.sc===p.sc&&!p.hit.includes(e)&&dist(p,e)<p.r+e.r){p.hit.push(e);dmgFoe(e,p.dmg,p.src,false,{st:p.st,m:p.m,mods:p.mods});if(p.heal)healPlayer(p.heal);
        if(p.knock&&!e.boss&&e.type!=='house'){e.x+=p.vx*(p.wave?p.knock:.04);e.y+=p.vy*(p.wave?p.knock:.04);}}});
      if(p.wave)dmgStructures(p.x,p.y,p.r,60*dt);
      if(p.wave)return;
    }else{
      for(const e of S.enemies){if(!e.dead&&e.sc===p.sc&&dist(p,e)<p.r+e.r){
        dmgFoe(e,p.dmg,p.src||null,!p.src&&!p.bullet,{st:p.st,m:p.m,mods:p.mods});if(p.heal)healPlayer(p.heal);
        if(p.knock&&!e.boss&&e.type!=='house'){const d=Math.hypot(p.vx,p.vy)||1;e.x+=p.vx/d*p.knock;e.y+=p.vy/d*p.knock;}
        if(p.hit)p.hit.push(e);if(p.explode&&!p.boom){p.boom=1;projExplode(p);}
        p.life=0;burst(p.x,p.y,p.color,3);return;}}
      if(p.src&&S.mode==='monster')for(const b of S.blds){if(b.outpost&&!b.fallen&&p.x>b.x-14&&p.x<b.x+b.w+14&&p.y>b.y-14&&p.y<b.y+b.h+14){dmgStructures(p.x,p.y,10,p.dmg*.5);if(p.explode&&!p.boom){p.boom=1;projExplode(p);}p.life=0;return;}}
    }
    if(!p.wave&&!p.turret){for(const r of solidsFor(p.sc)){if(inRect(p.x,p.y,r)){if(p.explode&&!p.boom){p.boom=1;projExplode(p);}p.life=0;burst(p.x,p.y,'#bbb',2);return;}}}
  });
  S.proj=S.proj.filter(p=>p.life>0);
}
function updateHazards(dt){
  const P=S.P;
  S.hazards.forEach(h=>{h.life-=dt;
    if(h.follow){h.x=P.x;h.y=P.y;h.sc=P.sc;}
    if(h.kind==='trap'){h.arm-=dt;if(h.arm<=0&&!P.dead&&P.dashT<=0&&P.sc===h.sc&&dist(h,P)<h.r+P.r*.6){if(!hasTrait('bogskin'))P.rootT=1.6;damagePlayer(10,null);floatText(P.x,P.y-30,hasTrait('bogskin')?'Bog Skin: slipped free':'TRAPPED','#d9b8ff');h.life=0;burst(h.x,h.y,'#aaa',8);}return;}
    if(h.owner==='p'){h.tick=(h.tick||0)-dt;const doSt=h.tick<=0;if(doSt)h.tick=.4;
      S.enemies.forEach(e=>{if(e.dead||e.sc!==h.sc)return;const d=dist(e,h);if(d<h.r+e.r){
        if(h.dps)dmgFoe(e,h.dps*dt,h.src,true,{dot:1});
        if(doSt&&h.st)applyStatus(e,h.st,h.m||1);if(h.kind==='tar')e.slowT=Math.max(e.slowT,.3);
        if(h.pull&&!e.boss&&d>12){e.x+=(h.x-e.x)/d*h.pull*dt;e.y+=(h.y-e.y)/d*h.pull*dt;}}});
      if(h.dps)dmgStructures(h.x,h.y,h.r,h.dps*dt*.6);}
    else{if(!P.dead&&P.sc===h.sc&&dist(P,h)<h.r+P.r){damagePlayer(h.dps*dt,null,h.kind);if(h.kind==='tar'&&!hasTrait('bogskin'))P.slowT=.3;}}
  });
  S.hazards=S.hazards.filter(h=>h.life>0);
}
