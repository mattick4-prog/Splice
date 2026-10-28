// ================= EVERY HOUSE CAN BE ENTERED (same dangers as any building) =================
THEMES.home={floor:'wood',props:[['bed',2],['table',1],['fridge',1],['cabinet',2],['stove',1],['crate',1],['medcab',1]]};
function houseDoorPt(f){return {x:f.x+f.w/2,y:f.y+f.h+14};}
function houseList(){return (S.fillers||[]).filter(f=>f.kind==='house'&&!f.gone);}
function houseInterior(f){
  if(f.int)return f.int;const i=S.fillers.indexOf(f),id='hs'+i;THEMES[id]=THEMES.home;
  const b={id,name:'House',x:f.x,y:f.y,w:f.w,h:f.h,idx:60+i,dx:f.x+f.w/2,dy:f.y+f.h,nx:0,ny:1,sign:'#e8c09a',filler:true,awake:false,fallen:false};
  const I=makeInterior(b);S.interiors[id]=I;f.id=id;f.int=I;S._sol={};
  // something may already be living in here
  const T=TOWNS[S.town],raid=T.raid&&T.raid.length?T.raid:null;
  if(raid&&Math.random()<(S.night?.5:.33)){const n=Math.random()<.3?2:1;for(let k=0;k<n;k++)spawnMonster(pick(raid),I.lx+rnd(-60,60),I.ly+rnd(-20,30),{sc:id});f.lurk=true;}
  return I;}
function wakeFillerHouse(f){f.gone=true;f.solid=false;S._sol={};
  const h=spawnMonster('house',f.x+f.w/2,f.y+f.h/2,{sc:'out'});h.state='chase';h.loot={wood:2,scrap:2,food:2,meds:1,wire:1,ammo:1};h.color=f.roof;
  S.shake=12;banner('THE HOUSE IS ALIVE','It was a mimic the whole time. Kill it for a huge haul.','#ff4d5e');}
{const _ud=updateDoors;updateDoors=function(){const P=S.P;
  if(P.sc==='out'&&!(P.doorCd>0)&&S.mode==='hunter'&&!P.car){
    for(const f of houseList()){const d=houseDoorPt(f);if(Math.hypot(P.x-d.x,P.y-d.y)>28)continue;
      if(!f.touched){f.touched=true;if(S.day>=2&&Math.random()<.06){wakeFillerHouse(f);P.doorCd=1;return;}}
      const I=houseInterior(f);enterScene(f.id,I.door.x,I.door.y-56);
      if(!f.visited){f.visited=true;toast(f.lurk?'🏠 Something moved in the dark. You are not alone in here.':'🏠 An empty house. Hold E on drawers and fridges to search. Watch your step.',f.lurk?'bad':'');}
      return;}}
  _ud();};}
// show which houses you've been in, and a doormat to find the door
{const _df=drawFiller;drawFiller=function(f){if(f.gone)return;_df(f);if(f.kind!=='house')return;
  const d=houseDoorPt(f);ctx.fillStyle=f.visited?'#3a2a1a':'#8a6a42';ctx.fillRect(d.x-14,f.y+f.h+1,28,8);
  if(f.visited){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(f.x+f.w/2-8,f.y+f.h*.72,16,f.h*.28-2);}
  if(Math.hypot(S.P.x-d.x,S.P.y-d.y)<150&&S.P.sc==='out')label(f.visited?'🏠 searched':'🏠 walk in',d.x,f.y+f.h+26,f.visited?'#aaa':'#ffd166',12);};}
{const _wt=worldTip;worldTip=function(){const r=_wt();if(r||S.P.sc!=='out')return r;
  const cam=getCam(),wx=cam.x+mouse.x/SCALE,wy=cam.y+mouse.y/SCALE;const f=houseList().find(f=>inRect(wx,wy,f));if(!f)return r;
  return ['🏠 House',f.visited?'You have been inside. Containers you searched stay empty until supplies drift back in.':'Walk into the front door to go in. Supplies inside, but also traps, gas, rotten floors, and sometimes a monster. A few houses are mimics.'];};}
