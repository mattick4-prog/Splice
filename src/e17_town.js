// ================= TOWN LAYOUT: STREET GRID, HOUSES, PARKS, PARKED CARS =================
function townStreets(){
  return [{x1:60,y1:470,x2:WW-60,y2:470,main:1},{x1:60,y1:1190,x2:1990,y2:1190,main:1},{x1:420,y1:860,x2:1990,y2:860,main:1},
    {x1:700,y1:60,x2:700,y2:WH-60},{x1:1500,y1:60,x2:1500,y2:WH-60},{x1:1950,y1:420,x2:1950,y2:1560}];
}
function segNear(x,y,s){const vx=s.x2-s.x1,vy=s.y2-s.y1,l2=vx*vx+vy*vy||1,t=clamp(((x-s.x1)*vx+(y-s.y1)*vy)/l2,0,1);return {x:s.x1+vx*t,y:s.y1+vy*t,d:Math.hypot(x-(s.x1+vx*t),y-(s.y1+vy*t))};}
function buildRoads(){const T=TOWNS[S.town];if(T.arena||!S.blds.length)return null;
  const st=townStreets(),drives=[];
  S.blds.forEach(b=>{const dx=b.dx+(b.nx||0)*6,dy=b.dy+(b.ny||0)*6;let best=null;st.forEach(s=>{const n=segNear(dx,dy,s);if(!best||n.d<best.d)best=n;});
    if(best)drives.push({x1:dx,y1:dy,x2:best.x,y2:best.y,drive:1});});
  return st.concat(drives);
}
{const _nr=nearRoad;nearRoad=function(x,y,pad){if(!S.roads)return _nr(x,y,pad);for(const s of S.roads){if(segNear(x,y,s).d<pad+(s.drive?10:24))return true;}return false;};}
{const _md=makeDecor;makeDecor=function(){S.roads=buildRoads();const d=_md();return S.roads?d.filter(x=>x.t==='patch'||!nearRoad(x.x,x.y,20)):d;};}
const HOUSE_COLS=[['#8a3a2a','#e8dcc8'],['#3a4a6a','#d8d0c0'],['#5a6a3a','#e0d8c0'],['#6a4a6a','#e8e0d8'],['#7a5a2a','#d8c8a8'],['#3a5a5a','#c8d0c8']];
function makeFillers(){
  const T=TOWNS[S.town];S.fillers=[];if(T.arena||!S.roads)return;
  const free=(r,pad)=>{if(r.x<40||r.y<40||r.x+r.w>WW-40||r.y+r.h>WH-40)return false;
    if(S.blds.some(b=>overlap(r,b,pad)))return false;
    if(S.fillers.some(f=>overlap(r,f,26)))return false;
    const cx=r.x+r.w/2,cy=r.y+r.h/2;if(Math.hypot(cx-BASE.x,cy-BASE.y)<300)return false;
    if(S.camps.some(c=>Math.hypot(cx-c.x,cy-c.y)<c.r+r.w/2+40))return false;
    for(const [px,py] of [[r.x,r.y],[r.x+r.w,r.y],[r.x,r.y+r.h],[r.x+r.w,r.y+r.h],[cx,cy]])if(nearRoad(px,py,8))return false;return true;};
  townStreets().forEach((s,si)=>{const L=Math.hypot(s.x2-s.x1,s.y2-s.y1),hz=s.y1===s.y2;
    for(let t=90;t<L-60;t+=rnd(150,200)){for(const side of [-1,1]){
      const roll=Math.random(),kind=roll<.72?'house':roll<.86?'park':'lot',w=kind==='house'?rnd(96,124):kind==='park'?rnd(160,220):rnd(140,180),h=kind==='house'?rnd(74,92):kind==='park'?rnd(120,150):rnd(100,120);
      const px=hz?s.x1+t:s.x1+side*(48+w/2),py=hz?s.y1+side*(48+h/2):s.y1+t;
      const r={x:Math.round(px-w/2),y:Math.round(py-h/2),w:Math.round(w),h:Math.round(h)};
      if(!free(r,kind==='house'?40:30))continue;
      const col=pick(HOUSE_COLS);S.fillers.push({...r,kind,solid:kind==='house',roof:col[0],wall:col[1],face:hz?(side<0?'s':'n'):(side<0?'e':'w'),seed:Math.random()});}}});
  // keep decor out of houses, and parked cars on the curbs
  decor=decor.filter(d=>d.t==='patch'||!S.fillers.some(f=>f.kind!=='park'&&inRect(d.x,d.y,{x:f.x-10,y:f.y-10,w:f.w+20,h:f.h+20})));
  const st=townStreets().filter(s=>!s.drive);
  S.cars.forEach(c=>{for(let k=0;k<40;k++){const s=pick(st),hz=s.y1===s.y2,t=Math.random(),x=s.x1+(s.x2-s.x1)*t,y=s.y1+(s.y2-s.y1)*t,side=Math.random()<.5?-1:1;
    const cx=hz?x:x+side*30,cy=hz?y+side*30:y;
    if(Math.hypot(cx-BASE.x,cy-BASE.y)<260)continue;if(S.blds.some(b=>inRect(cx,cy,{x:b.x-40,y:b.y-40,w:b.w+80,h:b.h+80})))continue;
    if(S.cars.some(o=>o!==c&&o._parked&&Math.hypot(o.x-cx,o.y-cy)<120))continue;if(S.camps.some(cp=>Math.hypot(cx-cp.x,cy-cp.y)<cp.r+60))continue;
    c.x=cx;c.y=cy;c.a=(hz?0:Math.PI/2)+(Math.random()<.5?0:Math.PI)+rnd(-.08,.08);c._parked=true;break;}});
  S._sol={};
}
{const _lt=loadTown;loadTown=function(i){S.roads=TOWNS[i]&&!TOWNS[i].arena?townStreets():null;S.fillers=[];_lt(i);makeFillers();};}
{const _sf=solidsFor;solidsFor=function(sc){const r=_sf(sc);if(sc==='out'&&S.fillers&&!r._f){r._f=1;S.fillers.forEach(f=>{if(f.solid)r.push(f);});}return r;};}
// ---------- drawing ----------
function drawStreets(BG,sw){
  const R=S.roads;if(!R)return;const side=sw?'#2e2416':BG.side,road=sw?'#8a6a42':BG.road;ctx.lineCap='butt';
  // sidewalks + asphalt
  R.forEach(s=>{ctx.strokeStyle=side;ctx.lineWidth=s.drive?44:s.main?92:84;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();});
  R.forEach(s=>{ctx.strokeStyle=road;ctx.lineWidth=s.drive?32:s.main?68:60;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();});
  // curb lines & sidewalk slabs
  if(!sw)R.forEach(s=>{if(s.drive)return;const hz=s.y1===s.y2,o=(s.main?34:30)+2;ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;
    for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(s.x1+(hz?0:sd*o),s.y1+(hz?sd*o:0));ctx.lineTo(s.x2+(hz?0:sd*o),s.y2+(hz?sd*o:0));ctx.stroke();}
    ctx.strokeStyle='rgba(0,0,0,.12)';const L=Math.hypot(s.x2-s.x1,s.y2-s.y1),off=(s.main?46:42)-4;
    for(let t=0;t<L;t+=36)for(const sd of [-1,1]){const x=s.x1+(hz?t:sd*off),y=s.y1+(hz?sd*off:t);ctx.beginPath();if(hz){ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);}else{ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);}ctx.stroke();}});
  if(BG.dash&&!sw){ctx.setLineDash([26,22]);ctx.strokeStyle=BG.dash;ctx.lineWidth=3;R.forEach(s=>{if(s.drive)return;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();});ctx.setLineDash([]);}
  // crosswalks at intersections
  const st=R.filter(s=>!s.drive),hs=st.filter(s=>s.y1===s.y2),vs=st.filter(s=>s.x1===s.x2);
  if(!sw)hs.forEach(h=>vs.forEach(v=>{const x=v.x1,y=h.y1;if(x<Math.min(h.x1,h.x2)||x>Math.max(h.x1,h.x2)||y<Math.min(v.y1,v.y2)||y>Math.max(v.y1,v.y2))return;
    ctx.fillStyle=road;ctx.fillRect(x-34,y-34,68,68);ctx.fillStyle='rgba(255,255,255,.75)';
    for(let k=-26;k<=26;k+=10){ctx.fillRect(x+k-3,y-50,6,12);ctx.fillRect(x+k-3,y+38,6,12);ctx.fillRect(x-50,y+k-3,12,6);ctx.fillRect(x+38,y+k-3,12,6);}}));
  ctx.lineCap='round';
}
function drawFiller(f){
  const {x,y,w,h}=f,night=S.night;
  if(f.kind==='park'){box(x,y,w,h,'#5a8a46',10,0);ctx.strokeStyle='#4a6a36';ctx.lineWidth=3;ctx.setLineDash([6,6]);ctx.strokeRect(x+4,y+4,w-8,h-8);ctx.setLineDash([]);
    ctx.strokeStyle='#c8b890';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x+12,y+h/2);ctx.quadraticCurveTo(x+w/2,y+h*.2,x+w-12,y+h/2);ctx.stroke();
    for(let i=0;i<3;i++){const tx=x+w*(.22+i*.28),ty=y+h*(i%2?.72:.32);ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(tx+5,ty+6,18,12,0,0,7);ctx.fill();circ(tx,ty,17,'#3e7a3a',2);circ(tx-5,ty-5,7,'#5a9a4e',0);}
    box(x+w/2-14,y+h-24,28,8,'#8a5a30',2,1.5);return;}
  if(f.kind==='lot'){box(x,y,w,h,'#5a5a5c',4,2);ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=2;for(let k=x+24;k<x+w-10;k+=28){ctx.beginPath();ctx.moveTo(k,y+6);ctx.lineTo(k,y+h*.4);ctx.moveTo(k,y+h-6);ctx.lineTo(k,y+h*.6);ctx.stroke();}return;}
  // house + yard
  ctx.strokeStyle='#e8e0d0';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.strokeRect(x-10,y-10,w+20,h+20);ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(x+8,y+9,w,h);
  const rh=h*.72;box(x,y+rh-4,w,h-rh+4,f.wall,0,2.5);
  const lit=night&&f.seed>.4?'#ffd36b':'#7a96a8';box(x+8,y+rh+2,14,h-rh-8,lit,1,1.5);box(x+w-22,y+rh+2,14,h-rh-8,lit,1,1.5);box(x+w/2-8,y+rh,16,h-rh-2,'#5a3a22',1,1.5);
  ctx.fillStyle=f.roof;ctx.fillRect(x-4,y-4,w+8,rh);ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.strokeRect(x-4,y-4,w+8,rh);
  ctx.strokeStyle=shade(f.roof,.25);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-2,y+rh/2-4);ctx.lineTo(x+w+2,y+rh/2-4);ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1.5;for(let k=y+4;k<y+rh-6;k+=8){ctx.beginPath();ctx.moveTo(x,k);ctx.lineTo(x+w,k);ctx.stroke();}
  if(f.seed>.6)box(x+w*.7,y+2,12,14,'#7a6a5a',1,1.5);
}
function drawOutside(cam){
  const T=TOWNS[S.town],sw=T.swamp,mon=S.mode==='monster';
  ctx.fillStyle=mon?shade(T.ground,-.25):T.ground;ctx.fillRect(0,0,WW,WH);
  decor.forEach(d=>{if(d.t!=='patch'||!onCam(d.x,d.y,200,cam))return;ctx.fillStyle=mon?shade(T.patch,-.25):T.patch;ctx.beginPath();ctx.ellipse(d.x,d.y,70*d.s,40*d.s,d.a,0,7);ctx.fill();});
  const BG=biomeGround();
  if(T.biome==='dam'){ctx.fillStyle='#2e5468';ctx.fillRect(0,0,WW,240);box(0,230,WW,40,'#a8acb0',0,3);}
  if(T.biome==='mesa'){ctx.fillStyle='rgba(120,50,20,.25)';for(let i=0;i<8;i++){ctx.beginPath();ctx.ellipse((i*331)%WW,(i*197)%WH,300,80,i,0,7);ctx.fill();}}
  if(S.roads){drawStreets(BG,sw);
    // town square around the base
    ctx.fillStyle=sw?'#6a5a3a':shade(BG.side||'#a19c8e',-.05);ctx.beginPath();ctx.ellipse(BASE.x,BASE.y+10,200,165,0,0,7);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=2;for(let r=60;r<200;r+=40){ctx.beginPath();ctx.ellipse(BASE.x,BASE.y+10,r,r*.82,0,0,7);ctx.stroke();}
    S.fillers.forEach(f=>{if(onCam(f.x+f.w/2,f.y+f.h/2,Math.max(f.w,f.h),cam))drawFiller(f);});}
  else{ctx.fillStyle=BG.yard;ctx.beginPath();ctx.ellipse(BASE.x,BASE.y+10,175,140,0,0,7);ctx.fill();}
  decor.forEach(d=>{if(!onCam(d.x,d.y,80,cam))return;drawDecorLow(d);});
  S.blds.forEach(b=>{if(onCam(b.x+b.w/2,b.y+b.h/2,Math.max(b.w,b.h),cam))drawBldOut(b);});
  drawBaseOut();
  S.cars.forEach(c=>{if(onCam(c.x,c.y,80,cam))drawCar(c);});
  drawCamps(cam);
}
function drawMiniTown(mx,my,k){if(!S.roads)return;ctx.strokeStyle='rgba(90,90,96,.85)';ctx.lineCap='butt';
  S.roads.forEach(s=>{ctx.lineWidth=s.drive?2:s.main?5:4;ctx.beginPath();ctx.moveTo(mx+s.x1*k,my+s.y1*k);ctx.lineTo(mx+s.x2*k,my+s.y2*k);ctx.stroke();});
  S.fillers.forEach(f=>{ctx.fillStyle=f.kind==='park'?'#4a7a3a':f.kind==='lot'?'#4a4a4c':shade(f.roof,-.1);ctx.fillRect(mx+f.x*k,my+f.y*k,Math.max(2,f.w*k),Math.max(2,f.h*k));});ctx.lineCap='round';}
