// ================= RENDER HELPERS =================
const OUT='#17130f';
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
  if(f<0){r*=1+f;g*=1+f;b*=1+f;}else{r+=(255-r)*f;g+=(255-g)*f;b+=(255-b)*f;}return `rgb(${r|0},${g|0},${b|0})`;}
function rrect(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function fs(fill,lw){if(fill)ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=lw||2.5;ctx.strokeStyle=OUT;ctx.stroke();}
function box(x,y,w,h,fill,r,lw){rrect(ctx,x,y,w,h,r||0);fs(fill,lw);}
function circ(x,y,r,fill,lw){ctx.beginPath();ctx.arc(x,y,r,0,7);fs(fill,lw);}
function hpBar(x,y,w,frac,col){ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x-w/2-1,y-1,w+2,7);ctx.fillStyle=col;ctx.fillRect(x-w/2,y,w*clamp(frac,0,1),5);}
function label(t,x,y,c,size){ctx.font='700 '+(size||15)+'px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.strokeText(t,x,y);ctx.fillStyle=c;ctx.fillText(t,x,y);}
function onCam(x,y,m,cam){return x>cam.x-m&&x<cam.x+cam.vw+m&&y>cam.y-m&&y<cam.y+cam.vh+m;}

// ================= OUTSIDE =================
/* drawOutside: replaced later */
function drawDecorLow(d){
  const t=S.t;if(drawBiomeDecor(d))return;
  if(d.t==='pool'){ctx.fillStyle='#2e5a5a';ctx.beginPath();ctx.ellipse(d.x,d.y,50*d.s,28*d.s,d.a,0,7);ctx.fill();ctx.strokeStyle='#1e3a3a';ctx.lineWidth=3;ctx.stroke();
    const k=.6+.4*Math.sin(t+d.a);ctx.strokeStyle='rgba(200,255,240,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(d.x,d.y,40*d.s*k,20*d.s*k,d.a,0,7);ctx.stroke();}
  else if(d.t==='reeds'){ctx.strokeStyle='#8a9a4a';ctx.lineWidth=2.5;for(let i=0;i<7;i++){const ox=(i-3)*4*d.s;ctx.beginPath();ctx.moveTo(d.x+ox,d.y+8);ctx.lineTo(d.x+ox+Math.sin(t*1.5+i+d.a)*4,d.y-16*d.s);ctx.stroke();}
    ctx.fillStyle='#6a4a2a';ctx.fillRect(d.x-2,d.y-18*d.s,4,7);}
  else if(d.t==='boat'){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a);ctx.beginPath();ctx.ellipse(0,0,32,12,0,0,7);fs('#8a5a36');ctx.fillStyle='#5a3a22';ctx.fillRect(-6,-9,4,18);ctx.restore();}
  else if(d.t==='rubble'){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a);box(-12*d.s,-7*d.s,24*d.s,14*d.s,'#8a8680',2,2);box(4,-14*d.s,12*d.s,10*d.s,'#a09a90',2,2);ctx.restore();}
  else if(d.t==='flowers'){for(let i=0;i<6;i++){ctx.fillStyle=['#ffd166','#ff8fab','#fff'][i%3];ctx.beginPath();ctx.arc(d.x+Math.cos(i*1.7+d.a)*10*d.s,d.y+Math.sin(i*1.7+d.a)*8*d.s,3,0,7);ctx.fill();}}
  else if(d.t==='hydrant'){circ(d.x,d.y,7,'#d63a2a',2);circ(d.x,d.y,3,'#f2a33a',1.5);}
  else if(d.t==='lamp'){circ(d.x,d.y,6,'#3a3e44',2);ctx.fillStyle=S.night?'#ffe08a':'#c8c8b8';ctx.beginPath();ctx.arc(d.x,d.y,3,0,7);ctx.fill();}
  else if(d.t==='bush'){circ(d.x,d.y,15*d.s,TOWNS[S.town].swamp?'#3f5a32':'#4a7a3a',2);ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(d.x-4,d.y-5,6*d.s,0,7);ctx.fill();}
}
function drawDecorHigh(cam){
  decor.forEach(d=>{if(!onCam(d.x,d.y,60,cam))return;if(drawBiomeHigh(d))return;
    if(d.t==='tree'){ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.arc(d.x+8,d.y+10,26*d.s,0,7);ctx.fill();
      circ(d.x,d.y,26*d.s,'#3d6e34',2.5);ctx.fillStyle='#4f8a42';ctx.beginPath();ctx.arc(d.x-6*d.s,d.y-6*d.s,16*d.s,0,7);ctx.fill();ctx.fillStyle='#64a252';ctx.beginPath();ctx.arc(d.x-9*d.s,d.y-10*d.s,7*d.s,0,7);ctx.fill();}
    else if(d.t==='cypress'){ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.arc(d.x+8,d.y+10,26*d.s,0,7);ctx.fill();
      circ(d.x,d.y,26*d.s,'#2f4a2c',2.5);ctx.fillStyle='#3f5e38';ctx.beginPath();ctx.arc(d.x-5*d.s,d.y-6*d.s,15*d.s,0,7);ctx.fill();
      ctx.strokeStyle='#8a9a7a';ctx.lineWidth=2;for(let i=0;i<6;i++){const a=i*1.1+d.a,ex=d.x+Math.cos(a)*16*d.s,ey=d.y+Math.sin(a)*16*d.s;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+Math.sin(S.t+i)*2,ey+14);ctx.stroke();}}
  });
}
function drawDoorMark(x,y,col){
  const P=S.P;if(S.mode!=='hunter'||P.sc!=='out'||Math.hypot(P.x-x,P.y-y)>170)return;
  const bob=Math.sin(S.t*5)*4;ctx.fillStyle=col||'#ffd166';ctx.beginPath();ctx.moveTo(x-9,y-30+bob);ctx.lineTo(x+9,y-30+bob);ctx.lineTo(x,y-18+bob);ctx.closePath();ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=OUT;ctx.stroke();
  label('ENTER',x,y-36+bob,col||'#ffd166',13);
}
function drawBldOut(b){
  if(b.boss){drawBossLair(b);return;}
  const mon=S.mode==='monster';
  if(b.awake&&!mon){ctx.fillStyle='#3a3028';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.strokeStyle='#6a5040';ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.strokeRect(b.x,b.y,b.w,b.h);ctx.setLineDash([]);
    for(let i=0;i<8;i++)box(b.x+((i*67)%b.w),b.y+((i*41)%b.h),18,12,'#6a5a4a',2,2);label(b.name.toUpperCase()+' (IT WALKED OFF)',b.x+b.w/2,b.y+b.h/2,'#ff8a95');return;}
  const fh=Math.min(30,b.h*.2),rh=b.h-fh;
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(b.x+12,b.y+14,b.w,b.h);
  box(b.x,b.y+rh,b.w,fh,b.wall,0,3);
  for(let x=b.x+16;x<b.x+b.w-30;x+=46){if(b.ny===1&&Math.abs(x+12-b.dx)<34)continue;box(x,b.y+rh+7,24,fh-14,S.night?'#ffd36b':'#a8d8ec',1,2);}
  ctx.fillStyle=b.roof;ctx.fillRect(b.x-6,b.y-6,b.w+12,rh+6);
  ctx.strokeStyle=shade(b.roof,-.2);ctx.lineWidth=2;
  for(let y=b.y+6,row=0;y<b.y+rh-2;y+=12,row++){ctx.beginPath();ctx.moveTo(b.x-6,y);ctx.lineTo(b.x+b.w+6,y);ctx.stroke();
    for(let x=b.x-6+(row%2?10:0);x<b.x+b.w+6;x+=20){ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x,y);ctx.stroke();}}
  ctx.fillStyle=shade(b.roof,.18);ctx.fillRect(b.x-6,b.y+rh/2-4,b.w+12,8);
  ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.strokeRect(b.x-6,b.y-6,b.w+12,rh+6);
  if(b.id==='church'){box(b.x+b.w/2-18,b.y+10,36,36,shade(b.roof,.1),2,2);ctx.fillStyle='#f2e6a0';ctx.fillRect(b.x+b.w/2-3,b.y+14,6,28);ctx.fillRect(b.x+b.w/2-11,b.y+22,22,6);}
  if(b.id==='gas'){for(let i=0;i<3;i++)box(b.x+30+i*60,b.y+b.h+30,18,26,'#e74c3c',3,2);}
  if(b.id==='substation'){ctx.strokeStyle='#ffe066';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x+20,b.y+20);ctx.lineTo(b.x+34,b.y+34);ctx.lineTo(b.x+26,b.y+36);ctx.lineTo(b.x+40,b.y+52);ctx.stroke();}
  // door
  const dc='#5a3a22';
  if(b.ny===1){box(b.dx-17,b.y+rh+2,34,fh-2,dc,2,2);ctx.fillStyle='#ffd166';ctx.fillRect(b.dx+9,b.y+rh+fh/2,3,3);ctx.fillStyle='#a33a2a';ctx.fillRect(b.dx-22,b.y+b.h+2,44,10);}
  else if(b.ny===-1){box(b.dx-17,b.y-10,34,14,dc,2,2);ctx.fillStyle='#a33a2a';ctx.fillRect(b.dx-22,b.y-22,44,10);}
  else{const x=b.nx>0?b.x+b.w-6:b.x-8;box(x,b.dy-18,14,36,dc,2,2);ctx.fillStyle='#a33a2a';ctx.fillRect(b.nx>0?b.x+b.w+10:b.x-20,b.dy-22,10,44);}
  // sign
  ctx.font='700 17px "Barlow Condensed",sans-serif';const tw=ctx.measureText(b.name.toUpperCase()).width+22;
  box(b.x+b.w/2-tw/2,b.y+rh/2-15,tw,28,b.sign,5,2.5);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(b.name.toUpperCase(),b.x+b.w/2,b.y+rh/2+5);
  if(!mon&&!b.awake)drawDoorMark(b.dx+b.nx*16,b.dy+b.ny*16+(b.ny===-1?-10:0));
  if(!mon&&S.jobs.some(j=>j.bld===b.id&&j.state==='active')){const bob=Math.sin(S.t*4)*4;box(b.x+b.w/2-14,b.y-58+bob,28,28,'#ffd166',14,2.5);label('!',b.x+b.w/2,b.y-37+bob,'#241a00',22);label('JOB',b.x+b.w/2,b.y-64+bob,'#ffd166',12);}
  if(mon&&b.outpost){
    if(!b.fallen){
      ctx.strokeStyle=b.flash>0?'#fff':'#8a6236';ctx.lineWidth=8;ctx.strokeRect(b.x-14,b.y-14,b.w+28,b.h+28);
      ctx.fillStyle='#6a4626';for(let x=b.x-14;x<=b.x+b.w+14;x+=26){ctx.fillRect(x-3,b.y-22,6,14);ctx.fillRect(x-3,b.y+b.h+8,6,14);}
      for(let y=b.y-14;y<=b.y+b.h+14;y+=26){ctx.fillRect(b.x-22,y-3,14,6);ctx.fillRect(b.x+b.w+8,y-3,14,6);}
      ctx.fillStyle='#ece6d8';ctx.fillRect(b.x+b.w-30,b.y-62,3,46);ctx.fillStyle='#7fc8ff';ctx.beginPath();ctx.moveTo(b.x+b.w-27,b.y-62);ctx.lineTo(b.x+b.w-2,b.y-54+Math.sin(S.t*4)*3);ctx.lineTo(b.x+b.w-27,b.y-46);ctx.fill();
      label('SURVIVOR OUTPOST',b.x+b.w/2,b.y-36,'#7fc8ff');hpBar(b.x+b.w/2,b.y-30,b.w*.7,b.hp/b.maxHp,'#7fc8ff');
    }else{ctx.fillStyle='rgba(20,10,6,.6)';ctx.fillRect(b.x-6,b.y-6,b.w+12,b.h+6);label('FALLEN',b.x+b.w/2,b.y+b.h/2+30,'#ff7a2f');
      if(Math.random()<.15)addFx({type:'p',x:b.x+rnd(10,b.w-10),y:b.y+rnd(10,b.h-10),vx:rnd(-10,10),vy:rnd(-50,-20),life:1.2,color:pick(['#ff7a2f','#555','#444']),r:rnd(2,5)});}
  }
}
function drawBossLair(b){
  const cx=b.x+b.w/2,cy=b.y+b.h/2,bl=S.enemies.find(e=>e.boss),mon=S.mode==='monster';
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.arc(cx+12,cy+14,86,0,7);ctx.fill();
  if(['falls','well','btower'].includes(b.id))drawLairGeneric(b,cx,cy);
  else if(b.id==='lighthouse'){
    circ(cx,cy,86,'#5a6a66',3);
    for(let i=5;i>0;i--)circ(cx,cy,i*14,i%2?'#f0ece0':'#c83a34',2);
    circ(cx,cy,12,'#ffe9a0',2);
    if(!mon){const a=S.t*.8;ctx.fillStyle='rgba(255,240,180,.12)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,480,a-.18,a+.18);ctx.closePath();ctx.fill();}
  }else{
    ctx.strokeStyle='#5a646c';ctx.lineWidth=10;
    [[b.x+20,b.y+20],[b.x+b.w-20,b.y+20],[b.x+20,b.y+b.h-20],[b.x+b.w-20,b.y+b.h-20]].forEach(p=>{ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(cx,cy);ctx.stroke();});
    circ(cx,cy,76,'#7a8a94',3);circ(cx,cy,56,'#5a6a74',2);ctx.font='700 18px "Barlow Condensed",sans-serif';ctx.fillStyle='#e8eef2';ctx.textAlign='center';ctx.fillText(TOWNS[S.town].name.toUpperCase(),cx,cy+6);
  }
  if(bl&&!mon){ctx.strokeStyle=bl.eye;ctx.globalAlpha=.4+.25*Math.sin(S.t*2);ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,100,0,7);ctx.stroke();ctx.globalAlpha=1;}
  label(b.name.toUpperCase(),cx,b.y-18,'#ffe9f6');
}
const BASE_LOOK=[{roof:'#8a7a68',wall:'#8a6a48',name:'shack'},{roof:'#7a4a2a',wall:'#b07e50'},{roof:'#8e3a2c',wall:'#c08a62'},{roof:'#5e646c',wall:'#9aa0a6'},{roof:'#3e464e',wall:'#7a828a'}];
function drawBaseOut(){
  const br=baseRect(),t=S.tier;
  if(S.mode==='monster'){drawNest();return;}
  {
    const L=BASE_LOOK[Math.min(t,4)],fh=22,rh=br.h-fh;
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(br.x+10,br.y+12,br.w,br.h);
    if(t>=3){for(let a=0;a<6.28;a+=.33)box(BASE.x+Math.cos(a)*96-11,BASE.y+Math.sin(a)*82-7,22,14,'#b0a070',5,2);}
    box(br.x,br.y+rh,br.w,fh,L.wall,0,3);
    ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1.5;for(let x=br.x+8;x<br.x+br.w;x+=10){ctx.beginPath();ctx.moveTo(x,br.y+rh);ctx.lineTo(x,br.y+br.h);ctx.stroke();}
    const winLit=S.night?'#ffd36b':'#a8d8ec';
    box(br.x+8,br.y+rh+5,16,fh-10,winLit,1,2);box(br.x+br.w-24,br.y+rh+5,16,fh-10,winLit,1,2);
    if(S.windows.some(w=>w.hp<winMax()*.5)){ctx.strokeStyle='#5a3a22';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(br.x+6,br.y+rh+6);ctx.lineTo(br.x+26,br.y+br.h-6);ctx.stroke();}
    ctx.fillStyle=L.roof;ctx.fillRect(br.x-6,br.y-6,br.w+12,rh+6);
    if(t===0){ctx.fillStyle='#a0563a';ctx.fillRect(br.x+6,br.y+2,22,14);ctx.fillStyle='#6a7a7a';ctx.fillRect(br.x+br.w-30,br.y+14,20,12);ctx.fillStyle='#2a2a2a';ctx.fillRect(br.x+br.w/2-4,br.y+8,8,6);}
    ctx.strokeStyle=shade(L.roof,-.22);ctx.lineWidth=2;for(let x=br.x;x<br.x+br.w;x+=t===0?9:12){ctx.beginPath();ctx.moveTo(x,br.y-6);ctx.lineTo(x,br.y+rh);ctx.stroke();}
    ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.strokeRect(br.x-6,br.y-6,br.w+12,rh+6);
    if(t>=1){ctx.fillStyle='#8a8a8a';ctx.fillRect(br.x+br.w-22,br.y-14,10,16);ctx.strokeRect(br.x+br.w-22,br.y-14,10,16);}
    box(BASE.x-12,br.y+rh+2,24,fh-2,'#4a2e1a',2,2);ctx.fillStyle='#a33a2a';ctx.fillRect(BASE.x-18,br.y+br.h+2,36,9);
  }
  const nT=turretCount(),tr=TR();
  for(let i=0;i<nT;i++){const ang=-Math.PI/2+i*2*Math.PI/nT,tx=BASE.x+Math.cos(ang)*tr,ty=BASE.y+Math.sin(ang)*tr;
    circ(tx,ty,12,'#4a5258',2.5);ctx.strokeStyle='#c8ccd0';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(S.turA[i])*20,ty+Math.sin(S.turA[i])*20);ctx.stroke();circ(tx,ty,5,'#ffd166',1.5);}
  label(TIERS[S.tier].name.toUpperCase()+' (YOUR BASE)',BASE.x,br.y-18,'#d6ff70');
  if(S.baseHp<baseMax())hpBar(BASE.x,br.y-12,100,S.baseHp/baseMax(),'#b8e04a');
  drawDoorMark(BASE.x,br.y+br.h+14,'#d6ff70');
}
function drawRig(x,y){
  ctx.save();ctx.translate(x,y);
  if(S.mods.lights&&S.night){ctx.fillStyle='rgba(255,240,180,.1)';ctx.beginPath();ctx.moveTo(90,0);ctx.arc(90,0,300,-.35,.35);ctx.closePath();ctx.fill();}
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-84,-30,182,82);
  for(const wx of [-62,-30,32,64]){box(wx-11,-48,22,12,'#1c1c1c',3,2);box(wx-11,36,22,12,'#1c1c1c',3,2);}
  box(-92,-40,138,80,S.mods.armor?'#5e6a5a':'#6e7a44',4,3);
  ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2;for(let i=-76;i<44;i+=16){ctx.beginPath();ctx.moveTo(i,-40);ctx.lineTo(i,40);ctx.stroke();}
  box(46,-34,46,68,'#55623a',6,3);box(70,-26,16,52,S.night?'#ffd36b':'#8ec9e6',3,2);
  ctx.fillStyle='#fff3b0';ctx.fillRect(90,-28,5,10);ctx.fillRect(90,18,5,10);
  if(S.mods.armor){for(let i=-88;i<40;i+=24){box(i,-46,20,7,'#9aa098',1,1.5);box(i,39,20,7,'#9aa098',1,1.5);}}
  if(S.mods.rack){ctx.strokeStyle='#c49a62';ctx.lineWidth=3;ctx.strokeRect(-86,-30,54,60);ctx.beginPath();ctx.moveTo(-86,0);ctx.lineTo(-32,0);ctx.stroke();}
  box(-18,46,24,10,'#a33a2a',1,1.5);
  ctx.restore();
}
function drawNest(){
  const x=BASE.x,y=BASE.y,pulse=Math.sin(S.t*2)*4,dead=S.nestDead;
  ctx.strokeStyle=dead?'#3a2a2a':'#6a2a8a';ctx.lineWidth=7;
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2+Math.sin(S.t*.7+i)*.15;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(a+.4)*70,y+Math.sin(a+.4)*70,x+Math.cos(a)*(115+pulse),y+Math.sin(a)*(115+pulse));ctx.stroke();}
  circ(x,y,64+pulse/2,dead?'#2a1e1e':'#4a2066',3);
  ctx.fillStyle=dead?'#3a2a2a':'#6a2a8a';ctx.beginPath();ctx.arc(x-12,y-10,34,0,7);ctx.fill();ctx.beginPath();ctx.arc(x+20,y+12,26,0,7);ctx.fill();
  if(!dead){ctx.fillStyle='#ff7be0';ctx.globalAlpha=.6+.3*Math.sin(S.t*3);ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.globalAlpha=1;}
  label(dead?'THE NEST (BURNED)':'THE NEST',x,y-86,'#d6a0ff');
  if(!dead&&S.nestHp<NEST_MAX)hpBar(x,y-80,100,S.nestHp/NEST_MAX,'#c27bff');
}
function drawCar(c){
  const CT=CARTYPES[c.type],L=CT.w,W=CT.h,P=S.P;
  ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);
  ctx.fillStyle='rgba(0,0,0,.3)';rrect(ctx,-L/2+5,-W/2+6,L,W,8);ctx.fill();
  for(const sx of [-1,1])for(const sy of [-1,1])box(sx*L*.32-8,sy*W*.5-4,16,8,'#1a1a1a',2,1.5);
  const body=c.wreck?shade(c.color,-.08):c.color;
  box(-L/2,-W/2,L,W,c.flash>0?'#fff':body,8,2.5);
  if(c.type==='pickup')box(-L/2+4,-W/2+4,L*.4,W-8,shade(body,-.25),3,2);
  if(c.type==='cruiser'){ctx.fillStyle='#1e1e22';ctx.fillRect(-L/2+3,-W/2+3,L*.2,W-6);ctx.fillRect(L/2-L*.2-3,-W/2+3,L*.2,W-6);}
  box(-L*.14,-W/2+4,L*.36,W-8,shade(body,.14),5,2);
  const glass=c.wreck?'#2a3438':'#8ec9e6';
  box(L*.2,-W/2+5,L*.1,W-10,glass,2,1.5);box(-L*.2,-W/2+6,L*.07,W-12,glass,2,1.5);
  if(c.wreck){ctx.strokeStyle='#9ab';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(L*.22,-4);ctx.lineTo(L*.28,3);ctx.moveTo(L*.24,4);ctx.lineTo(L*.27,-6);ctx.stroke();
    ctx.fillStyle='rgba(110,60,30,.6)';for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(((c.id*13+i*17)%L)-L/2,((c.id*7+i*11)%W)-W/2,4,0,7);ctx.fill();}}
  else{ctx.fillStyle='#fff3b0';ctx.fillRect(L/2-5,-W*.38,4,6);ctx.fillRect(L/2-5,W*.38-6,4,6);ctx.fillStyle='#e33';ctx.fillRect(-L/2+1,-W*.38,3,6);ctx.fillRect(-L/2+1,W*.38-6,3,6);}
  if(CT.siren&&!c.wreck){const on=Math.floor(S.t*6)%2;box(-4,-W*.3,8,W*.28,on?'#ff3344':'#661111',2,1.5);box(-4,2,8,W*.28,on?'#223366':'#3a6cff',2,1.5);}
  if(CT.music&&!c.wreck){ctx.fillStyle='#e8c88a';ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(4,-6);ctx.lineTo(4,6);ctx.closePath();ctx.fill();circ(6,0,6,'#ff8fc0',1.5);}
  ctx.restore();
  if(c.drivable&&S.keys[c.id]&&S.mode==='hunter'&&P.car!==c)label('🔑',c.x,c.y-W-8+Math.sin(S.t*4)*3,'#ffd166',20);
  if((P.car===c||P.hidden===c)&&c.hp<c.max)hpBar(c.x,c.y-W-6,60,c.hp/c.max,'#ffd166');
  if(P.hidden===c)label('hiding',c.x,c.y+W+12,'#cfe6f4',13);
}

// ================= INTERIORS =================
function drawFloor(I){
  const {x,y,w,h}=I;
  if(I.floor==='wood'){ctx.fillStyle='#a67e54';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#8a663f';ctx.lineWidth=2;
    for(let yy=y,r=0;yy<y+h;yy+=20,r++){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();for(let xx=x+(r%3)*50;xx<x+w;xx+=150){ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+20);ctx.stroke();}}}
  else if(I.floor==='tile'){for(let yy=y,r=0;yy<y+h;yy+=44,r++)for(let xx=x,c=0;xx<x+w;xx+=44,c++){ctx.fillStyle=(r+c)%2?'#e4ddcc':'#bfb5a0';ctx.fillRect(xx,yy,44,44);}}
  else if(I.floor==='lino'){ctx.fillStyle='#a9c0b4';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#93ab9e';ctx.lineWidth=2;for(let xx=x;xx<x+w;xx+=64){ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx,y+h);ctx.stroke();}for(let yy=y;yy<y+h;yy+=64){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}}
  else{ctx.fillStyle='#9c9c94';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#8a8a82';ctx.lineWidth=2;for(let xx=x;xx<x+w;xx+=120){ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx,y+h);ctx.stroke();}for(let yy=y;yy<y+h;yy+=120){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}
    ctx.fillStyle='rgba(0,0,0,.06)';for(let i=0;i<14;i++){ctx.beginPath();ctx.ellipse(x+((i*137)%w),y+((i*89)%h),40,22,i,0,7);ctx.fill();}}
}
function drawInterior(I){
  drawFloor(I);
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(I.x+20,I.y+20,I.w-40,14);
  I.walls.forEach(r=>{box(r.x,r.y,r.w,r.h,'#4e423a',0,2.5);});
  if(I.id!=='base')for(let wx=I.x+120;wx<I.x+I.w-80;wx+=200)box(wx,I.y+4,60,12,'#a8d8ec',1,2);
  const d=I.door;ctx.fillStyle='#9a3a2a';ctx.fillRect(d.x-46,I.y+I.h-22,92,20);label('EXIT',d.x,I.y+I.h-7,'#ffe9c0',14);
  I.props.forEach(p=>{if(!p.dead)drawProp(p);});drawPartMarks(I);
  if(I.stations){I.stations.forEach(drawStation);if(I.windows){drawWindows(I);drawCrew();}}
  drawLost(I.id);
  if(I.id!=='base')label(I.bld.name.toUpperCase(),I.x+I.w/2,I.y-10,I.bld.sign,18);
  else label('INSIDE YOUR '+TIERS[S.tier].name.toUpperCase(),I.x+I.w/2,I.y-10,'#d6ff70',18);
}
function drawProp(p){
  const D=PROPS[p.type],x=p.x,y=p.y,w=p.w,h=p.h,col=p.flash>0?'#fff':D.col,cx=x+w/2,cy=y+h/2;
  p.flash-=1/60;
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x+4,y+5,w,h);
  switch(p.type){
    case 'shelf':box(x,y,w,h,col,2);for(let i=0;i<5;i++)box(x+6+i*19,y+5,13,h-10,['#d4442e','#3f86d0','#e8c85a','#6aa84f','#ddd'][i],1,1.5);break;
    case 'lumber':for(let i=0;i<4;i++)box(x,y+i*10,w,9,shade(col,i%2?-.1:0),2,1.5);break;
    case 'crate':box(x,y,w,h,col,2);ctx.strokeStyle=shade(col,-.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+3,y+3);ctx.lineTo(x+w-3,y+h-3);ctx.moveTo(x+w-3,y+3);ctx.lineTo(x+3,y+h-3);ctx.stroke();break;
    case 'transformer':box(x,y,w,h,col,4);for(let i=0;i<3;i++)box(x+8+i*14,y+8,8,h-16,shade(col,-.25),2,1.5);ctx.fillStyle='#ffe066';ctx.fillRect(x+w-14,y+6,8,8);break;
    case 'pew':box(x,y,w,h,col,4);ctx.fillStyle=shade(col,-.2);ctx.fillRect(x+4,y+h-8,w-8,5);break;
    case 'pipes':for(let i=0;i<3;i++)box(x,y+i*8,w,7,shade(col,i*.08),3,1.5);box(x+w*.4,y-4,12,h+8,'#b85a2a',2,1.5);break;
    case 'barrel':circ(cx,cy,w/2,col);ctx.strokeStyle=shade(col,-.35);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,w/2-6,0,7);ctx.stroke();break;
    case 'desk':box(x,y,w,h,col,3);box(x+w*.3,y+h-12,w*.4,10,'#5a86aa',2,1.5);break;
    case 'table':circ(cx,cy,w/2,col);circ(cx,cy,8,'#f2f2f2',1.5);break;
    case 'stove':box(x,y,w,h,col,4);for(const ox of [-1,1])for(const oy of [-1,1])circ(cx+ox*12,cy+oy*10,7,'#333',1.5);break;
    case 'bed':box(x,y,w,h,'#d8d0c0',6);box(x+4,y+4,w-8,20,'#f4f4f4',5,1.5);box(x+4,y+30,w-8,h-34,col,4,1.5);break;
    default:{ // containers
      const open=p.searched;box(x,y,w,h,col,4);
      if(p.type==='fridge'){ctx.fillStyle='#9aa';ctx.fillRect(x+w-8,y+6,3,h-12);}
      if(p.type==='toolbox'){box(x+w/2-8,y-5,16,6,'#888',2,1.5);}
      if(p.type==='medcab'){ctx.fillStyle='#e33';ctx.fillRect(cx-2,cy-7,4,14);ctx.fillRect(cx-7,cy-2,14,4);}
      if(p.type==='register'){box(x+6,y+4,w-12,10,'#a8f0a8',2,1.5);}
      if(p.type==='locker'){ctx.fillStyle=shade(col,-.3);for(let i=0;i<3;i++)ctx.fillRect(x+6,y+6+i*5,w-12,2);}
      if(p.type==='donation'){ctx.fillStyle='#222';ctx.fillRect(cx-8,y+6,16,3);}
      if(open){ctx.fillStyle='rgba(0,0,0,.45)';rrect(ctx,x,y,w,h,4);ctx.fill();ctx.fillStyle='#b8e04a';ctx.font='700 14px sans-serif';ctx.textAlign='center';ctx.fillText('✓',cx,cy+5);}
      else{ctx.strokeStyle='#ffd166';ctx.lineWidth=2;ctx.globalAlpha=.4+.3*Math.sin(S.t*4);rrect(ctx,x-3,y-3,w+6,h+6,6);ctx.stroke();ctx.globalAlpha=1;}
    }
  }
  if(D.hp&&p.hp<p.max)hpBar(cx,y-8,Math.max(30,w*.6),p.hp/p.max,'#e8c85a');
  if(S.hold&&S.hold.tgt===p){ctx.strokeStyle='#ffd166';ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,Math.max(w,h)/2+12,-Math.PI/2,-Math.PI/2+Math.PI*2*S.hold.t/1.2);ctx.stroke();}
}
function drawStation(s){
  const {x,y,w,h}=s,cx=x+w/2,cy=y+h/2;
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x+4,y+5,w,h);
  if(s.id==='assembly'){drawTruck(x+20,y+28,w-50,h-56,S.truck?S.truck.parts:{},S.truck?S.truck.fuel:3);label('🔧 ASSEMBLY BAY · press E',cx,y-8,'#7fd6ff',13);return;}
  if(s.id==='bench'){box(x,y,w,h,'#9a6e42',3);box(x+10,y+8,26,10,'#c8ccd0',2,1.5);box(x+48,y+10,14,22,'#d4442e',2,1.5);box(x+76,y+6,30,8,'#7a5a3a',2,1.5);}
  else if(s.id==='lab'){box(x,y,w,h,'#3a4a5a',4);for(let i=0;i<3;i++){box(x+12+i*32,y+8,16,h-16,'#123',3,1.5);ctx.fillStyle=['#b8e04a','#7fd6ff','#ff7be0'][i];ctx.globalAlpha=.7+.3*Math.sin(S.t*3+i);ctx.fillRect(x+15+i*32,y+12+((S.t*20+i*10)%(h-24)),10,8);ctx.globalAlpha=1;}}
  else if(s.id==='rack'){box(x,y,w,h,'#6a4a2a',2);let i=0;S.weapons.forEach(wp=>{ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText(WEAPONS[wp].icon,x+14+i*20,y+h-6);i++;});}
  else if(s.id==='board'){box(x,y,w,h,'#b88a52',2);for(let i=0;i<4;i++)box(x+4,y+8+i*24,w-8,16,'#f2ead8',1,1);}
  else if(s.id==='bed'){box(x,y,w,h,'#7a5a3a',5);box(x+4,y+4,w-8,22,'#f0ece0',5,1.5);box(x+4,y+32,w-8,h-36,'#4a6a9a',4,1.5);}
  else if(s.id==='pantry'){box(x,y,w,h,'#8a6a44',2);for(let i=0;i<Math.min(6,S.res.food+1);i++)box(x+6+i*14,y+10,10,h-20,i%2?'#d4442e':'#e8c85a',2,1);}
  const near=nearStation()===s;
  label(s.name.toUpperCase(),cx,y-8,near?'#ffd166':'#efe9dc',13);
  if(near){ctx.strokeStyle='#ffd166';ctx.lineWidth=2.5;rrect(ctx,x-4,y-4,w+8,h+8,6);ctx.stroke();}
}
function drawWindows(I){
  I.windows.forEach((wd,i)=>{const W=S.windows[i],frac=W.hp/winMax(),hz=wd.side==='h';
    const w=hz?64:14,h=hz?14:64,x=wd.px-w/2,y=wd.py-h/2;
    box(x,y,w,h,W.hp<=0?'#0a0a0a':S.night?'#1a2438':'#a8d8ec',1,2);
    const nb=Math.ceil(frac*3);ctx.fillStyle=W.flash>0?'#ff8a8a':'#a0723e';
    for(let k=0;k<nb;k++){if(hz)ctx.fillRect(x-4+k*22,y-3,18,h+6);else ctx.fillRect(x-3,y-4+k*22,w+6,18);}
    if(S.enemies.some(m=>m.raid&&m.win===i&&!m.dead&&rectDist(m,baseRect())<m.r+14)){ctx.fillStyle='#ff4d5e';ctx.beginPath();ctx.arc(wd.px-5,wd.py,2.5,0,7);ctx.arc(wd.px+5,wd.py,2.5,0,7);ctx.fill();}
    if(W.hp<winMax()&&nearWindow()===i)label('R: board up (1 wood)',wd.ix,wd.iy+30,'#ffd166',13);
    else if(W.hp<winMax()*.5)label(W.hp<=0?'BROKEN':'WEAK',wd.ix,wd.iy+24,'#ff8a95',12);
  });
}

// ================= CREATURES =================
function drawMonster(m){
  const r=m.r,t=S.t,c=m.flash>0?'#fff':m.color,bob=1+Math.sin(t*6+m.bob)*.04;
  ctx.save();ctx.translate(m.x,m.y);ctx.globalAlpha=m.alpha;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(4,r*.7,r*1.05,r*.5,0,0,7);ctx.fill();
  if(m.stolen.length){const sc=POWERS[m.stolen[0]]?POWERS[m.stolen[0]].color:'#fff';ctx.strokeStyle=sc;ctx.lineWidth=4;ctx.globalAlpha=m.alpha*(.5+.3*Math.sin(t*6));ctx.beginPath();ctx.arc(0,0,r+10,0,7);ctx.stroke();ctx.globalAlpha=m.alpha;}
  if(m.mut){ctx.strokeStyle='#ff3b3b';ctx.lineWidth=3;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(0,0,r+6,0,7);ctx.stroke();ctx.setLineDash([]);}
  if(m.leap){const k=m.leap.t/m.leap.dur,s=1+Math.sin(k*Math.PI)*.5;ctx.scale(s,s);}
  ctx.rotate(m.fa);ctx.scale(bob,1/bob);ctx.lineJoin='round';
  switch(m.type){
    case 'crawler':ctx.strokeStyle=OUT;ctx.lineWidth=4;for(let i=-1;i<=1;i++){const w=Math.sin(t*10+i)*4;ctx.beginPath();ctx.moveTo(i*8,-r+3);ctx.lineTo(i*11+w,-r-11);ctx.moveTo(i*8,r-3);ctx.lineTo(i*11-w,r+11);ctx.stroke();}
      ctx.beginPath();ctx.ellipse(0,0,r,r*.82,0,0,7);fs(c);ctx.strokeStyle=shade(m.color,.35);ctx.lineWidth=3;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(i*7-2,0,r*.6,-1.2,1.2);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(r*.8,-6);ctx.lineTo(r*1.3,-10);ctx.lineTo(r*.9,-2);fs('#e8d8b0',2);ctx.beginPath();ctx.moveTo(r*.8,6);ctx.lineTo(r*1.3,10);ctx.lineTo(r*.9,2);fs('#e8d8b0',2);break;
    case 'leech':{const s=Math.sin(t*6)*2;ctx.beginPath();ctx.ellipse(0,0,r*1.45,r*.72+s*.3,0,0,7);fs(c);for(let i=-1;i<=1;i++){ctx.strokeStyle=shade(m.color,-.25);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i*7,-r*.6);ctx.lineTo(i*7,r*.6);ctx.stroke();}circ(r*1.15,0,r*.42,'#3a0a18',2);ctx.fillStyle='#fff';for(let i=0;i<6;i++){const a=i/6*6.28;ctx.fillRect(r*1.15+Math.cos(a)*r*.3-1,Math.sin(a)*r*.3-1,2.5,2.5);}break;}
    case 'hound':ctx.beginPath();ctx.ellipse(-3,0,r*1.25,r*.75,0,0,7);fs(c);circ(r*.95,0,r*.62,c);ctx.beginPath();ctx.moveTo(r*.7,-r*.5);ctx.lineTo(r*.6,-r*1.05);ctx.lineTo(r*1.0,-r*.55);fs(c,2);ctx.beginPath();ctx.moveTo(r*.7,r*.5);ctx.lineTo(r*.6,r*1.05);ctx.lineTo(r*1.0,r*.55);fs(c,2);
      ctx.strokeStyle='#e0faff';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<3;i++){const sx=rnd(-r,r*.4);ctx.moveTo(sx,-r*.5);ctx.lineTo(sx+5,0);ctx.lineTo(sx-2,r*.5);}ctx.stroke();break;
    case 'bell':circ(0,0,r,c,3);ctx.strokeStyle=shade(m.color,.45);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r*.68,0,7);ctx.stroke();circ(0,0,r*.32,'#4a3a10',2);
      ctx.strokeStyle='rgba(255,246,192,.5)';ctx.lineWidth=2;const k=(t*1.5)%1;ctx.beginPath();ctx.arc(0,0,r*(1.1+k*.6),0,7);ctx.globalAlpha=m.alpha*(1-k);ctx.stroke();ctx.globalAlpha=m.alpha;break;
    case 'matron':ctx.beginPath();for(let i=0;i<10;i++){const a=i/10*6.28,rr=r*(1+.15*Math.sin(t*3+i));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();fs(c);
      for(let i=0;i<6;i++)circ(Math.cos(i*1.2)*r*.5,Math.sin(i*1.2)*r*.5,3.5,'#e6ff9a',1.2);break;
    case 'stalker':ctx.beginPath();ctx.moveTo(r*1.4,0);ctx.lineTo(0,r*.85);ctx.lineTo(-r*1.25,0);ctx.lineTo(0,-r*.85);ctx.closePath();ctx.fillStyle=c;ctx.globalAlpha=m.alpha*.85;ctx.fill();ctx.globalAlpha=m.alpha;ctx.lineWidth=2.5;ctx.strokeStyle='#ffffff';ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-r*.4,-r*.3);ctx.lineTo(r*.3,r*.2);ctx.stroke();break;
    case 'crow':{const f=Math.sin(t*14)*.4;ctx.beginPath();ctx.moveTo(r*1.4,0);ctx.lineTo(-r,-r*(1.5+f));ctx.lineTo(-r*.4,0);ctx.lineTo(-r,r*(1.5+f));ctx.closePath();fs(c);ctx.beginPath();ctx.moveTo(r*1.4,-3);ctx.lineTo(r*1.9,0);ctx.lineTo(r*1.4,3);fs('#ffd166',1.5);
      ctx.fillStyle='rgba(255,180,60,.8)';ctx.beginPath();ctx.arc(-r*1.1,0,4+Math.random()*3,0,7);ctx.fill();break;}
    case 'brat':ctx.strokeStyle=OUT;ctx.lineWidth=3;for(let i=0;i<6;i++){const a=i/6*6.28+.3+Math.sin(t*12+i)*.2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*r*1.9,Math.sin(a)*r*1.9);ctx.stroke();}circ(0,0,r,c);break;
    case 'nest':{const pz=Math.sin(t*2)*3;ctx.strokeStyle=shade(m.color,-.2);ctx.lineWidth=8;for(let i=0;i<8;i++){const a=i/8*6.28+Math.sin(t+i)*.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a+.3)*r,Math.sin(a+.3)*r,Math.cos(a)*(r+24),Math.sin(a)*(r+24));ctx.stroke();}
      circ(0,0,r+pz,c,3);ctx.fillStyle=shade(m.color,.2);ctx.beginPath();ctx.arc(-8,-6,r*.6,0,7);ctx.fill();
      for(let i=0;i<7;i++){circ(Math.cos(i*.9)*r*.55+6,Math.sin(i*.9)*r*.55,5+(i%3),'#fff',1.5);ctx.fillStyle=m.eye;ctx.beginPath();ctx.arc(Math.cos(i*.9)*r*.55+8,Math.sin(i*.9)*r*.55,2.5+(i%3)*.6,0,7);ctx.fill();}break;}
    case 'lurker':ctx.beginPath();for(let i=0;i<12;i++){const a=i/12*6.28,rr=r*(1+.12*Math.sin(t*2+i*1.7));ctx.lineTo(Math.cos(a)*rr*1.2,Math.sin(a)*rr*.9);}ctx.closePath();fs(c);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(-4,0,r*.5,0,7);ctx.fill();
      ctx.fillStyle='#3a2a10';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-r*.9-i*6,Math.sin(t*3+i)*6,3,0,7);ctx.fill();}break;
    case 'gator':ctx.beginPath();ctx.moveTo(-r*1.2,-r*.28);ctx.lineTo(-r*2.3,Math.sin(t*6)*6);ctx.lineTo(-r*1.2,r*.28);fs(c,2);ctx.beginPath();ctx.ellipse(-4,0,r*1.3,r*.62,0,0,7);fs(c);
      ctx.beginPath();ctx.moveTo(r*.8,-r*.38);ctx.lineTo(r*2.05,-r*.16);ctx.lineTo(r*2.05,r*.16);ctx.lineTo(r*.8,r*.38);ctx.closePath();fs(c);ctx.fillStyle='#f4ecd0';for(let i=0;i<5;i++){ctx.fillRect(r*1+i*6,-r*.22,2.5,4);ctx.fillRect(r*1+i*6,r*.22-4,2.5,4);}
      ctx.fillStyle=shade(m.color,-.25);for(let i=0;i<4;i++)ctx.fillRect(-r+i*9,-3,5,6);break;
    case 'wisp':ctx.shadowColor=m.color;ctx.shadowBlur=20;circ(0,0,r*(1+.15*Math.sin(t*8)),c,2);ctx.shadowBlur=0;ctx.globalAlpha=m.alpha*.45;ctx.fillStyle=c;ctx.beginPath();ctx.arc(-r*1.3,0,r*.6,0,7);ctx.arc(-r*2.1,0,r*.35,0,7);ctx.fill();ctx.globalAlpha=m.alpha;
      circ(r*.2,-r*.3,2.5,'#1a3a3a',1);circ(r*.2,r*.3,2.5,'#1a3a3a',1);break;
    case 'hag':ctx.beginPath();ctx.moveTo(r*1.15,0);ctx.lineTo(-r*.85,-r*1.05);ctx.lineTo(-r*1.15,0);ctx.lineTo(-r*.85,r*1.05);ctx.closePath();fs(c);circ(r*.4,0,r*.45,'#c8b8a0',2);
      ctx.strokeStyle='#d6ff70';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*1.35,t,t+2);ctx.stroke();ctx.strokeStyle='#ddd';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.2,-r*.6);ctx.lineTo(-r*.9,-r*.4);ctx.moveTo(-r*.2,r*.6);ctx.lineTo(-r*.9,r*.4);ctx.stroke();break;
    case 'toad':ctx.beginPath();ctx.ellipse(-r*.6,-r*.82,r*.48,r*.26,0,0,7);fs(shade(m.color,-.25),2);ctx.beginPath();ctx.ellipse(-r*.6,r*.82,r*.48,r*.26,0,0,7);fs(shade(m.color,-.25),2);
      ctx.beginPath();ctx.ellipse(0,0,r,r*.86,0,0,7);fs(c);ctx.fillStyle='rgba(0,0,0,.2)';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-r*.4+i*6,(i%2?-1:1)*r*.3,3,0,7);ctx.fill();}break;
    case 'reed':ctx.strokeStyle='#e6cf86';ctx.lineWidth=2.5;for(let i=0;i<7;i++){const a=Math.PI+(i-3)*.3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.4);ctx.lineTo(Math.cos(a)*r*1.7,Math.sin(a)*r*1.4);ctx.stroke();}ctx.beginPath();ctx.ellipse(0,0,r,r*.58,0,0,7);fs(c);break;
    case 'drowned':circ(0,0,r,c);ctx.strokeStyle='rgba(159,255,232,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+4,0,7);ctx.stroke();ctx.strokeStyle='#2a4a40';ctx.beginPath();ctx.moveTo(-r,0);ctx.quadraticCurveTo(-r*1.6,Math.sin(t*5)*5,-r*2,0);ctx.stroke();break;
    case 'queen':{const pz=Math.sin(t*1.5)*4;ctx.strokeStyle=shade(m.color,.25);ctx.lineWidth=8;for(let i=0;i<10;i++){const a=i/10*6.28+Math.sin(t*.8+i)*.25;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a+.4)*r*1.1,Math.sin(a+.4)*r*1.1,Math.cos(a)*(r+32),Math.sin(a)*(r+32));ctx.stroke();}
      circ(0,0,r+pz,c,3);circ(0,0,r*.65,'#1a3a48',2);
      for(let i=0;i<5;i++){const a=-.9+i*.45;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.7,Math.sin(a)*r*.7);ctx.lineTo(Math.cos(a)*r*1.18,Math.sin(a)*r*1.18);ctx.lineTo(Math.cos(a+.15)*r*.7,Math.sin(a+.15)*r*.7);fs('#f0ece0',1.5);}
      ctx.fillStyle=m.eye;ctx.shadowColor=m.eye;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(r*.35,-11,6,0,7);ctx.arc(r*.35,11,6,0,7);ctx.fill();ctx.shadowBlur=0;break;}
    case 'crate':{const o=Math.abs(Math.sin(t*10))*6;box(-r,-r,r*2,r*2,c,2);ctx.strokeStyle=shade(m.color,-.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r+3,-r+3);ctx.lineTo(r-3,r-3);ctx.stroke();
      box(r-4,-r*.7-o/2,8,r*1.4+o,'#3a0808',1,1.5);ctx.fillStyle='#fff';for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(r-4,i*5);ctx.lineTo(r+4,i*5+2);ctx.lineTo(r-4,i*5+4);ctx.fill();}
      circ(r*.3,-r*.5,3,'#ff4d5e',1);circ(r*.3,r*.5,3,'#ff4d5e',1);break;}
    default:drawShape(m,c,r,t);break;
    case 'house':{ctx.rotate(-m.fa);const o=Math.abs(Math.sin(t*3))*12;ctx.strokeStyle=OUT;ctx.lineWidth=8;
      for(let i=0;i<4;i++){const a=i/4*6.28+.78,wv=Math.sin(t*6+i)*9;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6);ctx.lineTo(Math.cos(a)*(r+20)+wv,Math.sin(a)*(r+20));ctx.stroke();}
      box(-r*.8,-r*.7,r*1.6,r*1.4,c,3);ctx.beginPath();ctx.moveTo(-r*.98,-r*.7);ctx.lineTo(0,-r*1.18);ctx.lineTo(r*.98,-r*.7);ctx.closePath();fs(shade(m.color,-.25));
      ctx.fillStyle='#ff4d5e';ctx.shadowColor='#ff4d5e';ctx.shadowBlur=14;ctx.fillRect(-r*.5,-r*.42,r*.3,r*.26);ctx.fillRect(r*.2,-r*.42,r*.3,r*.26);ctx.shadowBlur=0;
      box(-r*.32,r*.02,r*.64,r*.32+o,'#200606',2,2);ctx.fillStyle='#fff';for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-r*.32+i*r*.128,r*.02);ctx.lineTo(-r*.26+i*r*.128,r*.17);ctx.lineTo(-r*.19+i*r*.128,r*.02);ctx.fill();}break;}
  }
  if(!['nest','queen','house','crate','wisp','stalker'].includes(m.type)&&!['boss','warden','wraith','serpent','golem'].includes(MONSTERS[m.type].shape)){const ex=m.type==='hound'?r*1.15:m.type==='gator'?r*.9:r*.55;
    for(const s of [-1,1]){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex,s*r*.3,3.6,0,7);ctx.fill();ctx.fillStyle=m.eye;ctx.shadowColor=m.eye;ctx.shadowBlur=S.night?10:0;ctx.beginPath();ctx.arc(ex+1,s*r*.3,2.2,0,7);ctx.fill();ctx.shadowBlur=0;}}
  if(m.type==='stalker'){circ(r*.6,-r*.25,3,m.eye,1);circ(r*.6,r*.25,3,m.eye,1);}
  ctx.restore();
  if(m.stunT>0){ctx.fillStyle='#f2dc7a';ctx.font='13px sans-serif';ctx.textAlign='center';for(let i=0;i<3;i++){const a=S.t*4+i*2.1;ctx.fillText('✦',m.x+Math.cos(a)*m.r,m.y-m.r-6+Math.sin(a)*4);}}
  if(m.hp<m.maxHp&&m.alpha>.5)hpBar(m.x,m.y-m.r-12,Math.max(28,m.r*2),m.hp/m.maxHp,m.boss?m.eye:'#ff5a68');
  let ly=m.y-m.r-18;
  if(m.boss&&m.awake){label(m.name.toUpperCase(),m.x,ly,m.eye);ly-=16;}
  if(m.type==='house'){label('MIMIC HOUSE',m.x,ly-8,'#ff5a68');ly-=16;}
  if(m.stolen.length){label('HAS YOUR '+(POWERS[m.stolen[0]]?POWERS[m.stolen[0]].name.toUpperCase():'POWER'),m.x,ly,POWERS[m.stolen[0]]?POWERS[m.stolen[0]].color:'#fff');ly-=16;}
  if(m.mut&&m.alpha>.5){label(m.mut.toUpperCase(),m.x,ly,'#ff6b6b',13);ly-=15;}
  const d=MONSTERS[m.type];
  if(S.mode==='hunter'&&d.power&&m.alpha>.5&&dist(m,S.P)<340){const pw=POWERS[d.power],pct=Math.round(S.dna[d.power]||0);label(pw.icon+' '+pct+'%',m.x,ly,pw.color,13);}
  drawStatus(m);
}
function drawStatus(e){
  const t=S.t,r=e.r;
  if(e.frozen>0){ctx.fillStyle='rgba(170,230,255,.45)';ctx.beginPath();ctx.arc(e.x,e.y,r+3,0,7);ctx.fill();ctx.strokeStyle='#e8fbff';ctx.lineWidth=2;ctx.stroke();}
  if(e.dots.burn)for(let i=0;i<3;i++){ctx.fillStyle=['#ffd166','#ff7a2f','#ff4d3a'][i];ctx.beginPath();ctx.arc(e.x+Math.sin(t*9+i*2)*r*.6,e.y-r*.4-((t*40+i*12)%18),3.5-i*.6,0,7);ctx.fill();}
  if(e.dots.poison)for(let i=0;i<3;i++){ctx.fillStyle='rgba(166,214,90,.85)';ctx.beginPath();ctx.arc(e.x+Math.cos(t*3+i*2.1)*r*.7,e.y-((t*25+i*9)%20),2.8,0,7);ctx.fill();}
  if(e.dots.bleed){ctx.fillStyle='#d22a3a';for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(e.x+(i?-r*.4:r*.4),e.y+r*.3+((t*30+i*10)%14),2.4,0,7);ctx.fill();}}
  if(e.rootT>0){ctx.strokeStyle='#7a9a3a';ctx.lineWidth=3;for(let i=0;i<5;i++){const a=i/5*6.28;ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*(r+8),e.y+Math.sin(a)*(r+8));ctx.quadraticCurveTo(e.x+Math.cos(a+.6)*r*.6,e.y+Math.sin(a+.6)*r*.6,e.x+Math.cos(a+1)*r*.3,e.y+Math.sin(a+1)*r*.3);ctx.stroke();}}
  if(e.marked>0||e.vulnT>0){ctx.strokeStyle=e.vulnT>0?'#d6ff70':'#f2dc7a';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(e.x,e.y,r+9,t,t+5.5);ctx.stroke();ctx.setLineDash([]);}
  let tag='';if(e.fearT>0)tag='😱';if(e.charmT>0)tag='💚';if(e.vulnT>0&&!tag)tag='🧿';
  if(tag){ctx.font='15px sans-serif';ctx.textAlign='center';ctx.fillText(tag,e.x+r+2,e.y-r);}
}
function drawHuman(h){
  if(h.siphon){const s=h.siphon;ctx.strokeStyle='#ff4d5e';ctx.lineWidth=3;ctx.globalAlpha=.6+.4*Math.sin(S.t*20);ctx.beginPath();ctx.arc(s.x,s.y,80,0,7);ctx.stroke();
    ctx.fillStyle='rgba(255,77,94,.18)';ctx.beginPath();ctx.arc(s.x,s.y,80*(1-s.t/1.2),0,7);ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle='rgba(255,77,94,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.lineTo(s.x,s.y);ctx.stroke();}
  ctx.save();ctx.translate(h.x,h.y);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(3,h.r*.7,h.r,h.r*.45,0,0,7);ctx.fill();
  if(h.isRival){ctx.strokeStyle='#7fd6ff';ctx.globalAlpha=.4+.2*Math.sin(S.t*5);ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,h.r+8,0,7);ctx.stroke();ctx.globalAlpha=1;
    h.stolen.forEach((id,i)=>{const a=S.t*2+i*2.1;circ(Math.cos(a)*(h.r+14),Math.sin(a)*(h.r+14),5,POWERS[id]?POWERS[id].color:'#fff',1.5);});}
  ctx.rotate(h.fa);
  if(h.type==='hunter'||h.isRival){box(4,1,h.r+14,5,h.isRival?'#7fd6ff':'#333',1,1.5);}
  circ(0,0,h.r,h.flash>0?'#fff':h.color);
  if(h.type==='torch'){ctx.fillStyle=pick(['#ffb347','#ff7a2f','#ffd166']);ctx.beginPath();ctx.arc(h.r+7,0,5+Math.random()*3,0,7);ctx.fill();}
  if(h.type==='scav')box(-h.r-6,-7,10,14,'#8a6a44',2,1.5);
  if(h.type==='trapper'){ctx.strokeStyle='#bbb';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-h.r,0,5,0,7);ctx.stroke();}
  circ(2,0,h.r*.52,'#e8c09a',2);ctx.fillStyle=h.isRival?'#ddd':'#4a3424';ctx.beginPath();ctx.arc(-1,0,h.r*.5,Math.PI*.5,Math.PI*1.5);ctx.fill();
  ctx.restore();
  if(h.stunT>0){ctx.fillStyle='#f2dc7a';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText('✦ ✦',h.x,h.y-h.r-6);}
  if(h.hp<h.maxHp)hpBar(h.x,h.y-h.r-12,h.isRival?60:28,h.hp/h.maxHp,h.isRival?'#7fd6ff':'#ffd166');
  if(h.isRival)label(h.name.split(',')[0].toUpperCase(),h.x,h.y-h.r-18,'#7fd6ff');
  if(h.captain)label('★ CAPTAIN',h.x,h.y-h.r-18,'#ffd166',13);
  drawStatus(h);
  if(h.flee)label('!',h.x,h.y-h.r-6,'#fff',16);
}
function drawWeapon(w,sw){
  ctx.save();ctx.rotate(.7-sw*1.6);
  if(w==='crowbar'){ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(36,0);ctx.lineTo(40,-6);ctx.stroke();ctx.strokeStyle='#a8b0b8';ctx.lineWidth=4;ctx.stroke();}
  else if(w==='bat'){ctx.strokeStyle=OUT;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(40,0);ctx.stroke();ctx.strokeStyle='#b88a52';ctx.lineWidth=6;ctx.stroke();ctx.fillStyle='#ccc';for(let i=0;i<4;i++)ctx.fillRect(28+i*3,i%2?-6:3,2,4);}
  else if(w==='machete'){box(10,-2,8,5,'#3a2a1a',1,1.5);ctx.beginPath();ctx.moveTo(18,-3);ctx.lineTo(44,-5);ctx.lineTo(46,0);ctx.lineTo(18,3);ctx.closePath();fs('#dfe6ea',2);}
  else if(w==='axe'){ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(42,0);ctx.stroke();ctx.strokeStyle='#8a5a32';ctx.lineWidth=4;ctx.stroke();ctx.beginPath();ctx.moveTo(34,-2);ctx.lineTo(40,-14);ctx.lineTo(46,-12);ctx.lineTo(42,0);ctx.closePath();fs('#d63a2a',2);}
  ctx.restore();
}
function drawPlayer(){
  const P=S.P;if(P.dead||P.car||P.hidden)return;
  ctx.save();ctx.translate(P.x,P.y);ctx.globalAlpha=P.invisT>0?.3:1;
  if(P.leap){const k=P.leap.t/P.leap.dur,s=1+Math.sin(k*Math.PI)*.6;ctx.scale(s,s);}
  ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(3,P.r*.75,P.r*1.05,P.r*.5,0,0,7);ctx.fill();
  if(P.slowT>0){ctx.fillStyle='rgba(106,90,34,.6)';ctx.beginPath();ctx.ellipse(0,P.r*.6,P.r+8,P.r*.6,0,0,7);ctx.fill();}
  if(P.armorT>0){ctx.strokeStyle='#c8d0d8';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,P.r+7,0,7);ctx.stroke();}
  if(P.rootT>0){ctx.strokeStyle='#bbb';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,P.r+3,0,7);ctx.stroke();}
  ctx.rotate(P.face+(P.rollT>0?S.t*25:0));
  const mon=S.mode==='monster',hs=S.humanity<25?3:S.humanity<50?2:S.humanity<75?1:0,hurt=P.hurtT>0,sw=P.swing>0?Math.sin((P.swing/.15)*Math.PI)*.9:0,step=Math.sin(P.walk)*3;
  if(mon||hs>=3){for(let i=0;i<10;i++){const a=i/10*6.28;ctx.beginPath();ctx.moveTo(Math.cos(a-.15)*P.r,Math.sin(a-.15)*P.r);ctx.lineTo(Math.cos(a)*(P.r+9),Math.sin(a)*(P.r+9));ctx.lineTo(Math.cos(a+.15)*P.r,Math.sin(a+.15)*P.r);fs(mon?'#6a3a8a':'#6a6a7a',1.5);}}
  if(!mon){box(-P.r-5,-8,10,16,'#7a5232',3,2);}
  circ(-step*.3+P.r*.55,-P.r*.75,5,mon?'#2a1236':'#e0b88a',2);circ(step*.3+P.r*.55,P.r*.75,5,mon?'#2a1236':'#e0b88a',2);
  circ(0,0,P.r,hurt?'#ff5a68':mon?'#4a2260':hs>=2?'#3d5578':'#2f72a8',2.5);
  if(!mon){ctx.fillStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.arc(-3,-4,P.r*.55,0,7);ctx.fill();}
  if(mon||hs>=2){ctx.strokeStyle=mon?'#ff7be0':'#d8d0e8';ctx.lineWidth=3;
    [-1,1].forEach(s=>{for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(P.r*.6,s*P.r*.7+i*3);ctx.lineTo(P.r+11+(s===1?sw*12:0),s*P.r*.8+i*4);ctx.stroke();}});}
  if(!mon){const W=WEAPONS[S.weapons[S.wpn]];
    if(W.ranged){ctx.save();ctx.translate(P.r*.5,P.r*.55);box(0,-3,S.weapons[S.wpn]==='shotgun'?30:20,7,S.weapons[S.wpn]==='shotgun'?'#3a3a3a':'#e8c040',2,2);ctx.restore();}
    else{ctx.save();ctx.translate(P.r*.5,P.r*.7);drawWeapon(S.weapons[S.wpn],sw);ctx.restore();}}
  circ(3,0,P.r*.52,mon?'#2a1236':'#e8c09a',2);
  if(!mon){ctx.fillStyle='#3a2616';ctx.beginPath();ctx.arc(0,0,P.r*.52,Math.PI*.55,Math.PI*1.45);ctx.fill();}
  if(mon||hs>=1){ctx.fillStyle=mon?'#ff3b5c':'#d6a0ff';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(P.r*.55,-4,2.6,0,7);ctx.arc(P.r*.55,4,2.6,0,7);if(mon){ctx.arc(P.r*.3,-9,2,0,7);ctx.arc(P.r*.3,9,2,0,7);}ctx.fill();ctx.shadowBlur=0;}
  ctx.restore();
  if(P.stunT>0){ctx.fillStyle='#f2dc7a';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('✦ ✦',P.x,P.y-P.r-8);}
  if(P.hexT>0){ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('🧿',P.x+P.r+4,P.y-P.r-2);}
}
function drawFx(){
  S.fx.forEach(f=>{const k=f.life/f.max;ctx.globalAlpha=Math.max(0,k);
    const fx=f.follow?S.P.x:f.x,fy=f.follow?S.P.y:f.y;
    if(f.type==='p'){ctx.fillStyle=f.color;ctx.beginPath();ctx.arc(f.x,f.y,f.r*k+.5,0,7);ctx.fill();}
    else if(f.type==='ring'){ctx.strokeStyle=f.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(fx,fy,f.r*(1.6-k*.6),0,7);ctx.stroke();}
    else if(f.type==='shock'){ctx.strokeStyle=f.color;ctx.lineWidth=6*k+1;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(1-k*.7),0,7);ctx.stroke();}
    else if(f.type==='swing'){ctx.strokeStyle=f.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(fx,fy,f.r,f.a-(f.arc||1.1),f.a+(f.arc||1.1));ctx.stroke();}
    else if(f.type==='beam'){ctx.strokeStyle=f.color;ctx.lineWidth=6*k;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x2,f.y2);ctx.stroke();}
    else if(f.type==='bolt'){ctx.strokeStyle=f.color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.x,f.y);const n=6;for(let i=1;i<n;i++)ctx.lineTo(f.x+(f.x2-f.x)*i/n+rnd(-10,10),f.y+(f.y2-f.y)*i/n+rnd(-10,10));ctx.lineTo(f.x2,f.y2);ctx.stroke();}
    else if(f.type==='cone'){ctx.fillStyle=f.color;ctx.globalAlpha=k*.28;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.arc(f.x,f.y,f.r,f.a-(f.arc||.75),f.a+(f.arc||.75));ctx.closePath();ctx.fill();}
    else if(f.type==='bite'){ctx.strokeStyle=f.color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.x-8,f.y-8);ctx.lineTo(f.x+8,f.y+8);ctx.moveTo(f.x+8,f.y-8);ctx.lineTo(f.x-8,f.y+8);ctx.stroke();}
  });ctx.globalAlpha=1;
}
function drawWorld(cam){
  const P=S.P,sc=P.sc;
  if(sc==='out')drawOutside(cam);else drawInterior(sceneObj(sc));
  S.hazards.forEach(h=>{if(h.sc!==sc)return;const k=Math.min(1,h.life/(h.max||1)*2);
    if(h.kind==='trap'){ctx.strokeStyle=h.arm>0?'#777':'#e0c8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(h.x,h.y,h.r*.7,0,7);ctx.stroke();for(let i=0;i<8;i++){const a=i/8*6.28;ctx.beginPath();ctx.moveTo(h.x+Math.cos(a)*h.r*.7,h.y+Math.sin(a)*h.r*.7);ctx.lineTo(h.x+Math.cos(a)*h.r,h.y+Math.sin(a)*h.r);ctx.stroke();}return;}
    ctx.globalAlpha=.32*k;ctx.fillStyle=h.color;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,7);ctx.fill();
    ctx.globalAlpha=.55*k;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(h.x+Math.cos(S.t*2+i*2)*h.r*.5,h.y+Math.sin(S.t*2+i*2)*h.r*.5,h.r*.25,0,7);ctx.fill();}ctx.globalAlpha=1;});
  S.pickups.forEach(p=>{if(p.sc!==sc)return;const g=geneInfo(p.gene),Q=QUAL[p.q],bob=Math.sin(S.t*4+p.x)*3;
    ctx.fillStyle=g.color;ctx.globalAlpha=.25+.15*Math.sin(S.t*5);ctx.beginPath();ctx.arc(p.x,p.y+bob,18+(p.q==='pure'?6:0),0,7);ctx.fill();ctx.globalAlpha=1;
    box(p.x-6,p.y-11+bob,12,22,g.color,4,2);ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(p.x-3,p.y-8+bob,3,10);box(p.x-7,p.y-15+bob,14,5,Q.col,1,1.5);
    if(dist(p,S.P)<200)label(g.icon+' '+Q.name,p.x,p.y-22+bob,Q.col,12);});
  S.allies.forEach(a=>{if(a.sc!==sc)return;ctx.save();ctx.translate(a.x,a.y);const col=a.col||'#a86ae0';
    if(a.look==='decoy'){ctx.globalAlpha=.6+.3*Math.sin(S.t*6);ctx.fillStyle='#ffe9a0';ctx.beginPath();ctx.arc(0,0,a.r+6,0,7);ctx.fill();ctx.globalAlpha=1;circ(0,0,a.r,'#fff6c0',2);}
    else if(a.look==='rat'){ctx.rotate(S.t*3+a.maxHp);ctx.beginPath();ctx.ellipse(0,0,a.r*1.4,a.r,0,0,7);fs('#8a7a6a',2);ctx.strokeStyle='#d8a0a0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-a.r*1.4,0);ctx.lineTo(-a.r*2.6,Math.sin(S.t*8)*4);ctx.stroke();}
    else if(a.look==='clone'){const tg=S.enemies.find(e=>!e.dead&&e.sc===a.sc&&dist(e,a)<300);
      ctx.strokeStyle='rgba(194,123,255,'+(.5+.3*Math.sin(S.t*8+a.maxHp))+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,a.r+6,0,7);ctx.stroke();
      ctx.save();ctx.rotate(tg?Math.atan2(tg.y-a.y,tg.x-a.x):0);circ(a.r*.55,-a.r*.75,5,'#e0b88a',2);circ(a.r*.55,a.r*.75,5,'#e0b88a',2);circ(0,0,a.r,'#2f72a8',2.5);ctx.restore();
      ctx.globalAlpha=Math.max(.3,a.life/12);label('COPY',0,-a.r-12,'#d6a0ff',11);ctx.globalAlpha=1;}
    else if(a.look==='bee'){circ(0,0,a.r,'#ffd166',2);ctx.fillStyle='#222';ctx.fillRect(-2,-a.r,3,a.r*2);ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(-3,-a.r,5,3,Math.sin(S.t*30),0,7);ctx.ellipse(-3,a.r,5,3,-Math.sin(S.t*30),0,7);ctx.fill();}
    else{ctx.strokeStyle=OUT;ctx.lineWidth=2.5;for(let i=0;i<6;i++){const an=i/6*6.28+.3+Math.sin(S.t*14+i)*.25;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(an)*16,Math.sin(an)*16);ctx.stroke();}
      circ(0,0,a.r,col,2);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(3,-2,1.8,0,7);ctx.arc(3,2,1.8,0,7);ctx.fill();}
    ctx.restore();});
  const ents=S.enemies.filter(e=>e.sc===sc&&onCam(e.x,e.y,100,cam)).sort((a,b)=>a.y-b.y);
  ents.forEach(e=>e.kind==='monster'?drawMonster(e):drawHuman(e));
  drawPlayer();drawVance();
  S.proj.forEach(p=>{if(p.sc!==sc)return;const a=Math.atan2(p.vy,p.vx);
    if(p.wave){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.globalAlpha=Math.min(1,p.life*1.5);ctx.strokeStyle=p.color;ctx.lineWidth=10;ctx.beginPath();ctx.arc(-p.r*.4,0,p.r,-1,1);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#e8fbff';ctx.beginPath();ctx.arc(-p.r*.4+6,0,p.r,-.8,.8);ctx.stroke();ctx.restore();ctx.globalAlpha=1;return;}
    if(p.spike||p.bullet){ctx.strokeStyle=p.color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-Math.cos(a)*(p.bullet?10:14),p.y-Math.sin(a)*(p.bullet?10:14));ctx.stroke();return;}
    ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();ctx.shadowBlur=0;});
  if(sc==='out')drawDecorHigh(cam);
  drawFx();
  S.floats.forEach(f=>{ctx.globalAlpha=Math.min(1,f.life*1.6);label(f.text,f.x,f.y,f.color,16);});ctx.globalAlpha=1;
  if(sc==='out'&&TOWNS[S.town].biome==='snow'){ctx.fillStyle='rgba(255,255,255,.8)';const cam2=cam;for(let i=0;i<120;i++){const x=cam2.x+((i*137+S.t*30*(1+i%3))%(cam2.vw+40))-20,y=cam2.y+((i*91+S.t*60*(1+i%2))%(cam2.vh+40))-20;ctx.fillRect(x,y,2+(i%2),2+(i%2));}}
  if(sc==='out'&&TOWNS[S.town].swamp){ctx.fillStyle='rgba(210,230,220,.05)';for(let i=0;i<9;i++){const x=(i*397+S.t*12)%(WW+500)-250,y=(i*233)%WH;ctx.beginPath();ctx.ellipse(x,y,280,90,0,0,7);ctx.fill();}}
}
function darkness(){
  if(S.mode==='title')return 0;
  if(S.night){const a=Math.min(1,S.clock/4),b=Math.min(1,(NIGHT_LEN-S.clock)/5);return Math.min(a,b);}
  const left=DAY_LEN-S.clock;return left<8?(1-left/8)*.7:0;
}
function drawNight(cam){
  const P=S.P,out=P.sc==='out',mon=S.mode==='monster';
  let d,col;
  if(out){d=darkness()*(mon?.62:.7);col=mon?'26,8,44':S.bloodMoon?'60,4,12':'10,16,46';}
  else if(P.sc==='base'){d=S.night?.3:.08;col='20,14,8';}
  else{d=S.night?.6:.38;col='14,10,8';}
  if(d<=.01)return;
  const w=dk.width,h=dk.height,sc=SCALE/2;
  dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,w,h);
  dctx.fillStyle=`rgba(${col},${d})`;dctx.fillRect(0,0,w,h);
  dctx.globalCompositeOperation='destination-out';
  const light=(x,y,r)=>{const sx=(x-cam.x)*sc,sy=(y-cam.y)*sc,rr=r*sc;if(sx<-rr||sy<-rr||sx>w+rr||sy>h+rr)return;
    const g=dctx.createRadialGradient(sx,sy,rr*.2,sx,sy,rr);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');dctx.fillStyle=g;dctx.beginPath();dctx.arc(sx,sy,rr,0,7);dctx.fill();};
  const lr=(hasTrait('nighteyes')?1.5:1)*(hasTrait('glow')?1.2:1);light(P.x,P.y,(out?(mon?440:330):300)*lr);
  if(out){
    if(!mon)light(BASE.x,BASE.y,S.mods.lights?380:S.tier>=1?220:140);
    if(P.car){light(P.x+Math.cos(P.car.a)*150,P.y+Math.sin(P.car.a)*150,190);}
    S.hazards.forEach(hz=>{if(hz.kind==='fire'&&hz.sc==='out')light(hz.x,hz.y,70);});
    S.enemies.forEach(e=>{if(e.sc!=='out')return;if(e.type==='torch')light(e.x,e.y,110);if(e.isRival)light(e.x,e.y,90);if(e.type==='hound'||e.type==='wisp'||e.type==='crow')light(e.x,e.y,60);});
    if(mon)S.blds.forEach(b=>{if(b.outpost&&!b.fallen)light(b.x+b.w/2,b.y+b.h/2,170);});
    decor.forEach(dd=>{if(dd.t==='lamp')light(dd.x,dd.y,90);});
    S.camps.forEach(c=>{if(!c.raided)light(c.x+30,c.y+20,170);});
    S.blds.forEach(b=>{if(b.id==='lighthouse'&&!mon)light(b.x+b.w/2,b.y+b.h/2,140);});
  }else{const I=sceneObj(P.sc);if(!S.night&&I.id!=='base')for(let wx=I.x+150;wx<I.x+I.w-80;wx+=200)light(wx,I.y+60,180);
    if(I.id==='base'){light(I.x+I.w/2,I.y+I.h/2,Math.max(I.w,I.h)*.6);}}
  ctx.drawImage(dk,0,0,VW,VH);
}
