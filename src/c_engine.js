// ================= SETUP =================
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),ov=document.getElementById('ov');
let VW=0,VH=0,DPR=1,SCALE=1;
const dk=document.createElement('canvas'),dctx=dk.getContext('2d');
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);VW=innerWidth;VH=innerHeight;cv.width=VW*DPR;cv.height=VH*DPR;cv.style.width=VW+'px';cv.style.height=VH+'px';dk.width=Math.ceil(VW/2);dk.height=Math.ceil(VH/2);SCALE=Math.max(.5,Math.min(1.2,Math.min(VW/1200,VH/760)));}
addEventListener('resize',resize);resize();

const WW=2400,WH=1700,BASE={x:1200,y:860},BASE_ZONE=125,DAY_LEN=110,NIGHT_LEN=55,NEST_MAX=700,IX=3200;
const rnd=(a,b)=>a+Math.random()*(b-a);
const irnd=(a,b)=>Math.floor(rnd(a,b+1));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const inRect=(x,y,r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
function rectDist(p,r){const cx=clamp(p.x,r.x,r.x+r.w),cy=clamp(p.y,r.y,r.y+r.h);return Math.hypot(p.x-cx,p.y-cy);}
function overlap(a,b,pad){pad=pad||0;return a.x<b.x+b.w+pad&&a.x+a.w+pad>b.x&&a.y<b.y+b.h+pad&&a.y+a.h+pad>b.y;}

// ================= INPUT =================
const keys={};const mouse={x:0,y:0,down:false,moved:-1e9};
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(k==='tab'||k===' '||k==='f1'||k.startsWith('arrow'))e.preventDefault();
  if(ovMode&&ovMode!=='panel')return;
  if(e.repeat){keys[k]=true;return;}
  keys[k]=true;
  if(!S||!(S.mode==='hunter'||S.mode==='monster'))return;
  if(ovMode==='panel'){if(S&&S.seq&&!S.seq.done&&S.panel==='genome'&&S.gtab==='seq'&&atLab()){if(k==='escape'){hideOv();return;}seqKeyIn(k);return;}
    if(['escape','tab','g','b','e','m','j','f1','?','l','p'].includes(k))hideOv();return;}
  if(k==='p'||k==='escape'){openMenu();return;}
  if(k==='f1'||k==='?'){openHelp();return;}
  if(S.P&&S.P.hidden&&S.mode==='hunter'&&carKey(k))return;
  if(k==='1'||k==='2'||k==='3')castSlot(+k-1);
  if(k==='tab'||k==='g'){if(S.mode==='hunter'&&S.P.sc==='base'){S.seq=S.seq&&!S.seq.done?S.seq:null;openGenome('seq');}else openGenome();}
  if(k==='b')openBasePanel();
  if(k==='e')interact();
  if(k==='m')openMap();
  if(k==='j')openJournal();
  if(k==='l')openLog();
  if(k==='n')toggleSound();
  if(k==='q')cycleWeapon();
  if(k==='h')useMeds();
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;mouse.down=false;});
cv.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.moved=performance.now();});
cv.addEventListener('mousedown',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.moved=performance.now();if(e.button===0)mouse.down=true;});
addEventListener('mouseup',()=>{mouse.down=false;});
cv.addEventListener('contextmenu',e=>e.preventDefault());

// ================= STATE =================
let S=null,decor=[],ovMode=null;
function newGame(opts){
  opts=opts||{};const DF=DIFFS[opts.diff||'normal'];
  S={mode:'hunter',t:0,day:1,clock:0,night:false,paused:false,
    P:{x:0,y:0,r:15,hp:100,spd:180,face:-Math.PI/2,atkCd:0,armorT:0,invisT:0,dashT:0,dashVx:0,dashVy:0,dashM:1,dashSrc:null,dashHit:[],stunT:0,rootT:0,
      dead:false,respawnT:0,hurtT:0,trail:0,swing:0,slowT:0,hexT:0,rollT:0,leap:null,car:null,hidden:null,doorCd:0,hornCd:0,sc:'base',walk:0,buffs:{}},
    res:{wood:0,scrap:0,wire:0,food:3,meds:1,fuel:0,ammo:0,mutagen:0},
    tier:0,baseHp:150,humanity:100,hstage:0,lives:3,
    dna:{},stolen:{},slots:[null,null,null],cds:{},seen:{},vault:[],pickups:[],traits:[null,null],gmods:{},echoQ:[],recipesFound:[],
    weapons:['crowbar'],wpn:0,
    enemies:[],allies:[],proj:[],hazards:[],fx:[],floats:[],log:[],banners:[],shake:0,fade:0,turCd:[0,0,0,0],turA:[0,0,0,0],
    blds:[],interiors:{},baseInt:null,cars:[],keys:{},windows:[],
    town:0,mods:{},bloodMoon:false,bossDead:false,pack:null,pendingStory:0,
    stats:{kills:0,powers:0,humans:0,outposts:0,days:1,broken:0,searched:0},
    usage:{},resist:[],biomass:0,fear:0,evo:{hp:0,claw:0,spd:0,nest:0},rival:null,rivalDone:false,rivalT:0,
    nestHp:0,nestDead:false,starving:false,splicePick:[],turnReason:null,pendingTurn:0,pendingWin:0,
    atBase:true,hold:null,holdTarget:null,followers:[],panel:null,_sol:{},camps:[],jobs:[],crew:[],lost:[],campTab:'trade',townLog:{},stateDone:[],maxLives:DF.lives,story:opts.story!==false,diff:opts.diff||'normal',path:{hunter:0,apex:0,splicer:0},choices:{},flags:{}};
  S.lives=DF.lives;
  loadTown(0);
  const B=S.baseInt;S.P.x=B.x+B.w/2;S.P.y=B.y+B.h/2+30;S.P.sc='base';
}
function loadTown(i){
  S.town=i;const T=TOWNS[i];
  S.blds=T.blds.map((b,idx)=>({...b,idx,awake:false,mimicBld:false,fallen:false,hp:0,maxHp:0,spawnT:0,flash:0,visited:false}));
  S.blds.forEach(b=>{
    const cx=b.x+b.w/2,cy=b.y+b.h/2,vx=BASE.x-cx,vy=BASE.y-cy;
    if(Math.abs(vx)/b.w>Math.abs(vy)/b.h){b.nx=Math.sign(vx);b.ny=0;b.dx=vx>0?b.x+b.w:b.x;b.dy=cy;}
    else{b.nx=0;b.ny=Math.sign(vy)||1;b.dy=vy>0?b.y+b.h:b.y;b.dx=cx;}
    b.lx=b.dx+b.nx*60;b.ly=b.dy+b.ny*60;
  });
  if(S.mode!=='monster')addGarage();
  {const nb=S.blds.filter(b=>!b.boss&&!b.garage);if(nb.length)pick(nb).mimicBld=true;}tlog(i).visited=true;
  S.enemies=[];S.allies=[];S.proj=[];S.hazards=[];S.followers=[];S.bossDead=!!tlog(i).bossDead;S.bloodMoon=false;S.keys={};
  S.interiors={};S.blds.forEach(b=>{if(!b.boss)S.interiors[b.id]=makeInterior(b);});setupGarageInterior();
  makeBaseInterior();
  decor=makeDecor();
  S.cars=makeCars();
  S.jobs=[];S.lost=[];S.camps=makeCamps();
  if(T.arena&&!tlog(i).bossDead){const w=spawnMonster(tlog(i).bossType||T.boss,1200,360,{sc:'out'});w.hx=1200;w.hy=360;}
  S.blds.forEach(b=>{
    if(b.boss){if(!tlog(i).bossDead)spawnMonster(tlog(i).bossType||b.monster,b.x+b.w/2,b.y+b.h/2,{home:b,sc:'out'});}
    else if(b.monster){const I=S.interiors[b.id];spawnMonster(b.monster,I.lx,I.ly,{home:b,sc:b.id});}
  });
  spawnStrays(5);initTruck();
}
function spawnStrays(n,cap){
  const T=TOWNS[S.town];
  for(let i=0;i<n;i++){
    if(S.enemies.filter(e=>e.sc==="out"&&!e.raid&&!e.boss).length>=(cap||12))return;
    for(let k=0;k<30;k++){const x=rnd(60,WW-60),y=rnd(60,WH-60);
      if(Math.hypot(x-BASE.x,y-BASE.y)<450||S.blds.some(b=>inRect(x,y,{x:b.x-40,y:b.y-40,w:b.w+80,h:b.h+80})))continue;
      spawnMonster(pick(T.raid),x,y,{sc:'out'});break;}
  }
}
function makeInterior(b){
  const th=THEMES[b.id]||THEMES.hardware;
  const w=Math.round(clamp(b.w*3.3,780,1080)),h=Math.round(clamp(b.h*3.3,540,720));
  const x=IX+(b.idx%3)*1300,y=Math.floor(b.idx/3)*900;
  const I={id:b.id,bld:b,x,y,w,h,floor:th.floor,walls:[],props:[],door:{x:x+w/2,y:y+h-12}};
  wallsFor(I,110);
  if(w>=900){const px=x+Math.round(w*.6);I.walls.push({x:px,y,w:20,h:Math.round(h*.3)},{x:px,y:y+Math.round(h*.64),w:20,h:Math.round(h*.36)});}
  I.lx=x+w*.4;I.ly=y+120;
  th.props.forEach(([type,n])=>{for(let k=0;k<n;k++)placeProp(I,type);});
  return I;
}
function wallsFor(I,gap){
  const T=20,{x,y,w,h}=I;
  I.walls=[{x,y,w,h:T},{x,y,w:T,h},{x:x+w-T,y,w:T,h},{x,y:y+h-T,w:w/2-gap/2,h:T},{x:x+w/2+gap/2,y:y+h-T,w:w/2-gap/2,h:T}];
}
function placeProp(I,type){
  const D=PROPS[type];
  for(let k=0;k<40;k++){
    const p={type,x:Math.round(rnd(I.x+44,I.x+I.w-44-D.w)),y:Math.round(rnd(I.y+48,I.y+I.h-48-D.h)),w:D.w,h:D.h,hp:D.hp||0,max:D.hp||0,searched:false,dead:false,flash:0};
    const corridor={x:I.x+I.w/2-90,y:I.y+I.h-200,w:180,h:200};
    if(overlap(p,corridor))continue;
    if(I.walls.some(wl=>overlap(p,wl,18)))continue;
    if(I.props.some(q=>overlap(p,q,22)))continue;
    if(Math.hypot(p.x+p.w/2-I.lx,p.y+p.h/2-I.ly)<70)continue;
    I.props.push(p);return;
  }
}
const BASE_DIMS=[[640,440],[760,500],[860,560],[960,600],[1040,460]];
function makeBaseInterior(){
  const [w,h]=BASE_DIMS[S.tier],x=IX+3*1300,y=0;
  const I={id:'base',x,y,w,h,floor:S.tier>=3?'concrete':'wood',walls:[],props:[],door:{x:x+w/2,y:y+h-12}};
  wallsFor(I,100);
  I.stations=[
    {id:'bench',name:'Workbench',x:x+56,y:y+40,w:120,h:46},
    {id:'lab',name:'Gene-O-Matic DNA Lab',x:x+w-56-110,y:y+40,w:110,h:50},
    {id:'rack',name:'Weapon Rack',x:x+w/2-55,y:y+28,w:110,h:28},
    {id:'board',name:'Stat Board',x:x+26,y:y+h/2-60,w:26,h:110},
    {id:'bed',name:'Bed',x:x+w-30-62,y:y+h/2-30,w:62,h:96},
    {id:'pantry',name:'Pantry',x:x+56,y:y+h-112,w:96,h:42}
  ];
  I.windows=[
    {px:x+w*.3,py:y+10,ix:x+w*.3,iy:y+60,side:'h'},{px:x+w*.7,py:y+10,ix:x+w*.7,iy:y+60,side:'h'},
    {px:x+10,py:y+h*.78,ix:x+60,iy:y+h*.78,side:'v'},{px:x+w-10,py:y+h*.78,ix:x+w-60,iy:y+h*.78,side:'v'}];
  const wm=winMax();
  if(S.windows.length!==4)S.windows=[0,1,2,3].map(()=>({hp:wm,flash:0}));
  S.baseInt=I;
}
function winMax(){return 50+S.tier*35;}
const BASE_RECTS=[[80,62],[100,78],[118,90],[130,98],[186,80]];
function baseRect(){const [w,h]=BASE_RECTS[Math.min(S.tier,4)];return{x:BASE.x-w/2,y:BASE.y-h/2,w,h};}
function makeDecor(){
  const d=[],sw=TOWNS[S.town].swamp;let tries=0;
  while(d.length<150&&tries<4000){tries++;
    const x=rnd(30,WW-30),y=rnd(30,WH-30);
    if(Math.hypot(x-BASE.x,y-BASE.y)<190)continue;
    if(S.blds.some(b=>x>b.x-60&&x<b.x+b.w+60&&y>b.y-70&&y<b.y+b.h+70))continue;
    if(nearRoad(x,y,sw?28:46))continue;
    const r=Math.random();
    d.push({x,y,t:biomeDecorType(TOWNS[S.town].biome,r),s:rnd(.75,1.3),a:rnd(0,6.28)});
  }
  for(let i=0;i<60;i++)d.unshift({x:rnd(0,WW),y:rnd(0,WH),t:'patch',s:rnd(1,2.6),a:rnd(0,6.28)});
  return d;
}
function nearRoad(x,y,pad){
  for(const b of S.blds){const ax=BASE.x,ay=BASE.y,bx=b.dx,by=b.dy,vx=bx-ax,vy=by-ay,l2=vx*vx+vy*vy;
    const t=clamp(((x-ax)*vx+(y-ay)*vy)/l2,0,1),px=ax+vx*t,py=ay+vy*t;if(Math.hypot(x-px,y-py)<pad)return true;}
  return false;
}
function makeCars(){
  const types=Object.keys(CARTYPES).sort(()=>Math.random()-.5).slice(0,3);
  const cars=[];
  for(let i=0;i<13;i++){
    const drivable=i<types.length,type=drivable?types[i]:pick(['hatch','pickup','hatch','pickup','cruiser']),CT=CARTYPES[type];
    for(let k=0;k<60;k++){
      const x=rnd(80,WW-80),y=rnd(80,WH-80);
      if(Math.hypot(x-BASE.x,y-BASE.y)<230)continue;
      if(S.blds.some(b=>inRect(x,y,{x:b.x-70,y:b.y-70,w:b.w+140,h:b.h+140})))continue;
      if(cars.some(c=>Math.hypot(c.x-x,c.y-y)<110))continue;
      cars.push({id:i,x,y,a:rnd(0,6.28),type,drivable,wreck:!drivable,searched:false,hp:drivable?CT.hp:90,max:drivable?CT.hp:90,v:0,flash:0,
        color:drivable?CT.color:pick(WRECK_COLORS)});break;
    }
  }
  return cars;
}

// ================= SCENES & COLLISION =================
function sceneObj(sc){return sc==='out'?{x:0,y:0,w:WW,h:WH}:sc==='base'?S.baseInt:S.interiors[sc];}
function scAt(x,y){if(x<3000)return 'out';if(S.baseInt&&inRect(x,y,S.baseInt))return 'base';for(const id in S.interiors)if(inRect(x,y,S.interiors[id]))return id;return 'out';}
function solidsFor(sc){
  if(S._sol[sc])return S._sol[sc];let a;
  if(sc==='out'){a=[];
    for(const b of S.blds){if(b.boss||b.awake)continue;
      if(S.mode==='monster'){if(b.outpost&&b.fallen)continue;const pad=b.outpost?14:0;a.push({x:b.x-pad,y:b.y-pad,w:b.w+pad*2,h:b.h+pad*2});}
      else a.push(b);}
    if(S.mode!=='monster')a.push(baseRect());
  }else{const I=sceneObj(sc);if(!I)return [];a=I.walls.concat(I.props.filter(p=>!p.dead),I.stations||[]);}
  S._sol[sc]=a;return a;
}
function pushOut(e,rects){
  let hit=false;
  for(const r of rects){
    const cx=clamp(e.x,r.x,r.x+r.w),cy=clamp(e.y,r.y,r.y+r.h),dx=e.x-cx,dy=e.y-cy,d=Math.hypot(dx,dy);
    if(d<e.r){hit=true;
      if(d>0.01){e.x=cx+dx/d*e.r;e.y=cy+dy/d*e.r;}
      else{const dl=e.x-r.x,dr=r.x+r.w-e.x,du=e.y-r.y,dd=r.y+r.h-e.y,m=Math.min(dl,dr,du,dd);
        if(m===dl)e.x=r.x-e.r;else if(m===dr)e.x=r.x+r.w+e.r;else if(m===du)e.y=r.y-e.r;else e.y=r.y+r.h+e.r;}}
  }
  return hit;
}
function clampScene(e){const B=sceneObj(e.sc||'out');if(!B)return;e.x=clamp(e.x,B.x+8,B.x+B.w-8);e.y=clamp(e.y,B.y+8,B.y+B.h+(e===S.P?14:-8));}
function teleport(e,x,y,sc){e.x=x;e.y=y;e.sc=sc;}

// ================= HELPERS =================
function toast(text,kind){S.log.push({text,kind:kind||'',t:S.t});if(S.log.length>6)S.log.shift();}
function banner(text,sub,col){S.banners.push({text,sub:sub||'',col:col||'#efe9dc',life:3.4});while(S.banners.length>3)S.banners.splice(1,1);}
function floatText(x,y,text,color){S.floats.push({x,y,text:String(text),color:color||'#fff',life:1.1});if(S.floats.length>60)S.floats.shift();}
function addFx(o){o.max=o.life;S.fx.push(o);if(S.fx.length>300)S.fx.shift();}
function burst(x,y,color,n){for(let i=0;i<n;i++){const a=rnd(0,6.28),s=rnd(40,220);addFx({type:'p',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rnd(.3,.7),color,r:rnd(2,4.5)});}}
function maxHp(){if(S.mode==='monster')return 180+30*S.evo.hp+(hasTrait('thickhide')?25:0);return 100+(S.tier>=1?20:0)+(S.tier>=3?20:0)-(S.starving?20:0)+(hasTrait('thickhide')?25:0);}
function baseMax(){return TIERS[S.tier].hp+(S.mods&&S.mods.armor?250:0);}
function level(id){const p=S.dna[id]||0;return p>=150?1.4:p>=100?1:p>=40?.55:0;}
function stageName(id){const p=S.dna[id]||0;if(TRAITS[id])return p>=100?'unlocked':'locked';return p>=150?'mastered':p>=100?'full power':p>=40?'weak':'locked';}
function lvlName(id){const p=S.dna[id]||0;if(TRAITS[id])return p>=100?'UNLOCKED':'LOCKED';return p>=150?'MASTER':p>=100?'FULL':p>=40?'WEAK':'LOCKED';}
function nearestIn(arr,from,maxD,excl){let best=null,bd=maxD;for(const e of arr){if(e.dead||(excl&&excl.includes(e)))continue;if(from.sc&&e.sc&&from.sc!==e.sc)continue;const d=dist(e,from);if(d<bd){bd=d;best=e;}}return best;}
function nearestFoe(from,maxD,excl){return nearestIn(S.enemies,from,maxD,excl);}
function shootAt(from,to,spd,dmg,color,r){const a=Math.atan2(to.y-from.y,to.x-from.x);S.proj.push({x:from.x,y:from.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:r||4,dmg,owner:'e',life:2,color,from,sc:from.sc});}
function healPlayer(n,quiet){const P=S.P;if(P.dead)return;P.hp=Math.min(maxHp(),P.hp+n);if(!quiet)floatText(P.x,P.y-24,'+'+Math.round(n),'#7dff9a');}
function turretCount(){return Math.min(S.tier,3)+(S.mods.gun?1:0);}
function TR(){return S.tier>=4?110:84;}
function getCam(){const vw=VW/SCALE,vh=VH/SCALE,P=S.P,B=sceneObj(P.sc)||{x:0,y:0,w:WW,h:WH};
  const x=vw>=B.w?B.x+(B.w-vw)/2:clamp(P.x-vw/2,B.x,B.x+B.w-vw),py=P.y+(P.hidden?vh*.2:0),y=vh>=B.h?B.y+(B.h-vh)/2:clamp(py-vh/2,B.y-(P.hidden?vh*.3:0),B.y+B.h-vh*(P.hidden?.6:1));return{x,y,vw,vh};}
function aimPoint(maxD){const P=S.P,cam=getCam();let x,y;
  if(performance.now()-mouse.moved<2500){x=cam.x+mouse.x/SCALE;y=cam.y+mouse.y/SCALE;const d=Math.hypot(x-P.x,y-P.y);if(d>maxD){x=P.x+(x-P.x)/d*maxD;y=P.y+(y-P.y)/d*maxD;}}
  else{x=P.x+Math.cos(P.face)*maxD;y=P.y+Math.sin(P.face)*maxD;}
  const B=sceneObj(P.sc);return{x:clamp(x,B.x+30,B.x+B.w-30),y:clamp(y,B.y+30,B.y+B.h-30)};}
function canPay(c){return Object.keys(c).every(k=>S.res[k]>=c[k]);}
function pay(c){Object.keys(c).forEach(k=>S.res[k]-=c[k]);}
function rollTable(T,n){const ks=Object.keys(T);let tot=0;ks.forEach(k=>tot+=T[k]);const got={};
  for(let i=0;i<n;i++){let r=Math.random()*tot;for(const k of ks){r-=T[k];if(r<=0){got[k]=(got[k]||0)+(k==='ammo'?irnd(2,4):1);break;}}}return got;}
function giveRes(got,x,y){const parts=[];let yy=0;for(const k in got){if(!got[k])continue;S.res[k]+=got[k];parts.push('+'+got[k]+' '+k);floatText(x,y-yy,'+'+got[k]+' '+RES_ICON[k],'#ffd166');yy+=16;}return parts;}
