// ================= CAR CONTROLS, TOOLBAR, HELP =================
const CAR_CTRL=[
  {k:'1',id:'horn',icon:'📯',name:'Horn',tip:'Monsters right next to the car flinch away, but everything nearby comes to look.'},
  {k:'2',id:'wipers',icon:'🌧️',name:'Wipers',tip:'Clear the windshield so you can see outside.'},
  {k:'3',id:'lights',icon:'💡',name:'Headlights',tip:'See ahead in the dark. Monsters notice the light.',toggle:true},
  {k:'4',id:'radio',icon:'📻',name:'Radio',tip:'Might pick up useful news. Makes noise while it\'s on.',toggle:true},
  {k:'5',id:'lock',icon:'🔒',name:'Lock doors',tip:'If they find you, the car takes 30% less damage.',toggle:true},
  {k:'6',id:'visor',icon:'🕶️',name:'Sun visor',tip:'Flip it down. People hide keys up there.',search:true},
  {k:'7',id:'glove',icon:'🧤',name:'Glove box',tip:'Search it for supplies and keys.',search:true},
  {k:'8',id:'seat',icon:'💺',name:'Under the seat',tip:'Feel around under the seat. Sometimes a weapon.',search:true}
];
let CARHIT=[];
function carHit(x,y){for(let i=CARHIT.length-1;i>=0;i--){const h=CARHIT[i];if(h.r?Math.hypot(x-h.x,y-h.y)<=h.r:(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h))return h;}return null;}
function carZone(id,x,y,w,h,t,d,r){const z=r?{id,x,y,r}:{id,x,y,w,h};CARHIT.push(z);r?hov(x-r,y-r,r*2,r*2,t,d):hov(x,y,w,h,t,d);}
cv.addEventListener('mousedown',e=>{if(!S||ovMode||!S.P||!S.P.hidden||S.mode!=='hunter')return;const h=carHit(e.clientX,e.clientY);if(!h)return;
  if(h.id==='quiet'){S.quietBtn=true;return;}carAction(h.id);});
addEventListener('pointerup',()=>{if(S)S.quietBtn=false;});
cv.addEventListener('mousemove',e=>{if(!S||!S.P||!S.P.hidden){cv.style.cursor='';return;}cv.style.cursor=carHit(e.clientX,e.clientY)?'pointer':'';});
function carSay(m){S.carMsg=m;S.carMsgT=S.t;}
function carNoise(amt,r){const c=S.P.hidden;S.enemies.forEach(m=>{if(m.dead||m.sc!=='out'||m.sawHide)return;const d=dist(m,c);if(d<(r||200)){m.sus=Math.min(1,(m.sus||0)+amt);m.wx=c.x+rnd(-30,30);m.wy=c.y+rnd(-30,30);m.wT=2;}});}
function carAction(id){
  const P=S.P,c=P.hidden;if(!c)return;
  if(id==='out'){exitHide();return;}
  if(id==='horn'){c.hornCd=c.hornCd||0;if(S.t<c.hornCd){carSay('The horn needs a second.');return;}c.hornCd=S.t+3;c.hornT=S.t;sfx('door');addFx({type:'shock',x:c.x,y:c.y,r:120,life:.4,color:'#ffd166'});
    S.enemies.forEach(m=>{if(m.dead||m.sc!=='out')return;const d=dist(m,c);if(d<120&&!m.boss){m.stunT=Math.max(m.stunT,1.2);const dd=d||1;m.x+=(m.x-c.x)/dd*50;m.y+=(m.y-c.y)/dd*50;m.sus=Math.max(0,(m.sus||0)-.4);}
      else if(d<450){m.wx=c.x;m.wy=c.y;m.wT=3;m.sus=Math.min(.7,(m.sus||0)+.25);}});
    carSay('HONK! The ones right outside jumped back, but now everything nearby is coming to look.');}
  if(id==='wipers'){S.carGrime=0;S.wipeT=.7;carNoise(.06,160);sfx('swing');carSay('Swish, swish. You can see again.');}
  if(id==='lights'){c.lights=!c.lights;sfx('ui');carSay(c.lights?'Headlights on. You can see, and so can they.':'Headlights off.');}
  if(id==='radio'){c.radio=!c.radio;sfx('ui');if(c.radio){c.radioMsg=makeRumor(S.camps[0]||{name:'the camps'});carSay('The radio crackles: "'+c.radioMsg+'"');toast('📻 Radio: "'+c.radioMsg+'"');}else carSay('Radio off. Quiet again.');}
  if(id==='lock'){c.locked=!c.locked;sfx('ui');carSay(c.locked?'Click. Doors locked. If they find you, the car takes less damage.':'Doors unlocked.');}
  if(id==='visor'||id==='glove'||id==='seat'){
    if(c[id]){carSay('You already checked there. Nothing left.');return;}c[id]=true;c[id+'T']=S.t;carNoise(.08,160);sfx('pickup');
    if(id==='visor'){if(Math.random()<.35&&giveKey()){c.visorFind='🔑';carSay('A set of car keys falls into your lap! A 🔑 arrow will point you to the car they start.');}
      else{c.visorFind='🖼️';S.humanity=Math.min(100,S.humanity+2);carSay('Just an old photo of a family at the beach. You remember being human. +2 humanity.');}}
    if(id==='glove'){const parts=giveRes(rollTable({food:1,ammo:2,meds:1,mutagen:.5,fuel:.5},irnd(1,2)),c.x,c.y-30);const k=Math.random()<.2&&giveKey();
      c.gloveFind=parts.map(s=>{const m=String(s).match(/(\d+)\s+(\w+)/);return m?(RES_ICON[m[2]]||m[2])+m[1]:s;}).join('  ')+(k?' 🔑':'');carSay('Glove box: '+(parts.join(', ')||'just napkins')+(k?', and car keys! Follow the 🔑 arrow to find their car.':'.'));}
    if(id==='seat'){const parts=giveRes(rollTable({ammo:2,scrap:1,wire:1,food:1},irnd(1,2)),c.x,c.y-30);let w='';if(Math.random()<.15){const before=S.weapons.length;giveWeapon();if(S.weapons.length>before)w=' and a '+WEAPONS[S.weapons[S.weapons.length-1]].name+'!';}
      carSay('Under the seat: '+(parts.join(', ')||'crumbs and a sock')+(w||'.'));}
  }
}
const CAR_KEYS={'1':'horn','2':'wipers','3':'lights','4':'radio','5':'lock','6':'visor','7':'glove','8':'seat'};
function carKey(k){if(CAR_KEYS[k]){carAction(CAR_KEYS[k]);return true;}return false;}
function updateCarUI(){const el=document.getElementById('carui');if(el)el.style.display='none';}
function updateHiding(dt){
  const P=S.P;if(!P.hidden)return;
  const qm=S.quietMeter===undefined?1:S.quietMeter;
  S.quiet=(keys[' ']||S.quietBtn)&&qm>0;S.quietMeter=clamp(qm+(S.quiet?-.2:.15)*dt,0,1);
  S.carGrime=Math.min(1,(S.carGrime||0)+dt*.012);if(S.wipeT>0)S.wipeT-=dt;
}
function susRate(){const c=S.P.hidden;let r=S.quiet?.1:.5;if(c&&c.radio)r+=.15;if(c&&c.lights&&S.night)r*=1.6;return r;}
// ---------- car interior drawing (clickable) ----------
function keyBadge(k,x,y){box(x-9,y-9,18,18,'#000',4,1.5);txt(k,x,y+5,12,'#ffd166','center',700);}
function drawCarInterior(){
  const P=S.P,c=P.hidden,W=VW,H=VH;CARHIT=[];
  let nd=1e9;S.enemies.forEach(e=>{if(e.sc==='out'&&!e.dead){const d=dist(e,c);if(d<nd)nd=d;}});
  const threat=clamp(1-(nd-60)/320,0,1),sus=S.enemies.reduce((a,e)=>Math.max(a,e.sus||0),0);
  const shake=nd<130?Math.sin(S.t*45)*2.5*threat:0,mx=W/2,mY=mouse.y,mX=mouse.x;
  const hot=(x,y,w,h)=>mX>=x&&mX<=x+w&&mY>=y&&mY<=y+h,hotC=(x,y,r)=>Math.hypot(mX-x,mY-y)<=r;
  ctx.save();ctx.translate(shake,0);
  const wx=W*.15,wy=H*.07,ww=W*.7,wh=H*.47,frame=shade(c.color,-.5),trim=shade(c.color,-.3),dy=wy+wh;
  if(c.lights){const g=ctx.createLinearGradient(0,dy,0,wy);g.addColorStop(0,'rgba(255,240,180,0)');g.addColorStop(1,'rgba(255,240,180,.2)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(W*.4,dy);ctx.lineTo(W*.6,dy);ctx.lineTo(wx+ww,wy);ctx.lineTo(wx,wy);ctx.fill();}
  const g0=S.carGrime||0,bio=TOWNS[S.town].biome,gcol={snow:'235,245,255',swamp:'110,90,50',desert:'210,170,110',city:'120,120,120'}[bio]||'150,140,120';
  if(g0>.05){ctx.fillStyle=`rgba(${gcol},${g0*.6})`;ctx.fillRect(wx,wy,ww,wh);ctx.strokeStyle=`rgba(${gcol},${g0*.8})`;ctx.lineWidth=2;for(let i=0;i<30;i++){const x=wx+((i*97)%ww),y=wy+((i*53)%wh);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3,y+14);ctx.stroke();}}
  if(threat>.2){ctx.fillStyle=`rgba(225,232,240,${threat*.15})`;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(wx+ww*(.15+i*.18),wy+wh*.85,ww*.12,wh*.1,0,0,7);ctx.fill();}}
  if(c.wreck||c.hp<c.max*.5){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.5;const cx=wx+ww*.7,cy=wy+wh*.3;for(let i=0;i<7;i++){const a=i*.9;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*90,cy+Math.sin(a)*60);ctx.stroke();}}
  ctx.beginPath();ctx.rect(-20,-20,W+40,H+40);
  ctx.moveTo(wx+40,wy);ctx.lineTo(wx+ww-40,wy);ctx.lineTo(wx+ww,dy);ctx.lineTo(wx,dy);ctx.closePath();
  ctx.moveTo(W*.015,H*.13);ctx.lineTo(W*.105,H*.1);ctx.lineTo(W*.115,H*.5);ctx.lineTo(W*.015,H*.57);ctx.closePath();
  ctx.moveTo(W*.985,H*.13);ctx.lineTo(W*.895,H*.1);ctx.lineTo(W*.885,H*.5);ctx.lineTo(W*.985,H*.57);ctx.closePath();
  ctx.fillStyle=frame;ctx.fill('evenodd');
  ctx.strokeStyle=trim;ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(wx+40,wy);ctx.lineTo(wx+ww-40,wy);ctx.lineTo(wx+ww,dy);ctx.lineTo(wx,dy);ctx.closePath();ctx.stroke();
  // wipers (blades on glass)
  const wp=S.wipeT>0?Math.sin((1-S.wipeT/.7)*Math.PI):0;ctx.strokeStyle='#111';ctx.lineWidth=5;ctx.lineCap='round';
  for(const bx of [wx+ww*.3,wx+ww*.65]){const a=-Math.PI*.15-wp*Math.PI*.7,len=wh*.7;ctx.beginPath();ctx.moveTo(bx,dy-6);ctx.lineTo(bx+Math.cos(a)*len,dy-6+Math.sin(a)*len);ctx.stroke();}
  // mirror + dice
  box(mx-70,wy+8,140,34,'#222',8,3);ctx.fillStyle='#3a4650';rrect(ctx,mx-62,wy+13,124,24,6);ctx.fill();
  if(threat>.45){ctx.fillStyle='#ff3b5c';ctx.beginPath();ctx.arc(mx-12+Math.sin(S.t*2)*20,wy+25,3,0,7);ctx.arc(mx+Math.sin(S.t*2)*20,wy+25,3,0,7);ctx.fill();}
  const sw=Math.sin(S.t*2.4)*.25+shake*.05;ctx.strokeStyle='#ddd';ctx.lineWidth=1.5;
  for(const o of [-14,12]){const dx=mx+o+Math.sin(sw)*40,dd=wy+90;ctx.beginPath();ctx.moveTo(mx+o*.4,wy+42);ctx.lineTo(dx,dd-12);ctx.stroke();ctx.save();ctx.translate(dx,dd);ctx.rotate(sw+o*.02);box(-11,-11,22,22,o<0?'#e23a5a':'#f2f2f2',4,2);ctx.restore();}
  // SUN VISOR
  {const vx=wx+50,vy=wy+2,vw=150,down=c.visor,vh=down?78:30,hv=hot(vx,vy,vw,vh);
    box(vx,vy,vw,vh,hv?shade(c.color,-.15):shade(c.color,-.35),5,hv?3:2);
    if(down){box(vx+10,vy+36,vw-20,34,'#d8d0c0',3,1.5);txt(c.visorFind||'🪞',vx+vw/2,vy+62,24,'#fff','center');}else{ctx.fillStyle='rgba(255,255,255,.15)';ctx.fillRect(vx+12,vy+12,vw-24,4);}
    label(down?'SUN VISOR ✓':'SUN VISOR',vx+vw/2,vy+(down?28:21),'#efe9dc',12);keyBadge('6',vx+vw+12,vy+14);
    carZone('visor',vx,vy,vw,vh,'🕶️ Sun visor'+(down?' (checked)':''),down?'Already flipped down.':'Click to flip it down. People hide car keys up here.');}
  // DASHBOARD
  const gr=ctx.createLinearGradient(0,dy,0,H);gr.addColorStop(0,'#3a322c');gr.addColorStop(1,'#141110');
  ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(-20,dy+30);ctx.quadraticCurveTo(W/2,dy-30,W+20,dy+30);ctx.lineTo(W+20,H+20);ctx.lineTo(-20,H+20);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#4a4038';ctx.lineWidth=3;ctx.stroke();
  // driver door panel: lock + handle
  {const px=0,py=dy+H*.08,pw=W*.065,ph=H-py;ctx.fillStyle=shade(c.color,-.55);ctx.fillRect(px,py,pw,ph);ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(px,py,pw,ph);
    const lx=pw/2,ly=py+26,up=!c.locked,hv=hotC(lx,ly,22);circ(lx,ly,14,'#1a1a1a',2);box(lx-4,ly-(up?24:8),8,up?24:10,hv?'#ffd166':'#c8c0b0',3,1.5);
    label(c.locked?'LOCKED':'LOCK',lx,ly+30,c.locked?'#7dff9a':'#efe9dc',11);keyBadge('5',pw-8,ly-20);
    carZone('lock',lx,ly,0,0,'🔒 Door lock: '+(c.locked?'LOCKED':'unlocked'),'Click to '+(c.locked?'unlock':'lock')+' the doors. Locked doors mean the car takes 30% less damage if they find you.',26);
    const hx=6,hy=py+ph*.42,hw=pw-12,hh=30,hh2=hot(hx,hy,hw,hh);box(hx,hy,hw,hh,hh2?'#8a8a8a':'#5a5a5a',8,2);ctx.fillStyle='#222';rrect(ctx,hx+6,hy+9,hw-12,12,5);ctx.fill();
    label('GET OUT',hx+hw/2,hy+hh+16,'#efe9dc',12);keyBadge('E',hx+hw/2,hy+hh+32);
    carZone('out',hx,hy,hw,hh,'🚪 Door handle','Click to get out of the car (or press E).');}
  // headlight knob
  {const kx=W*.12,ky=dy+H*.16,r=24,hv=hotC(kx,ky,r+6);circ(kx,ky,r+6,'#0e0c0b',2);circ(kx,ky,r,hv?'#5a5048':'#3a342e',2.5);
    ctx.save();ctx.translate(kx,ky);ctx.rotate(c.lights?.9:-.5);ctx.fillStyle='#ddd';ctx.fillRect(-3,-r+3,6,r-3);ctx.restore();
    txt('💡',kx+r+4,ky-r+4,16,'#fff','left');if(c.lights)circ(kx+r+14,ky+r-6,5,'#7fd6ff',1);
    label(c.lights?'LIGHTS ON':'LIGHTS',kx,ky+r+18,c.lights?'#7fd6ff':'#efe9dc',12);keyBadge('3',kx-r-10,ky-r);
    carZone('lights',kx,ky,0,0,'💡 Headlight knob: '+(c.lights?'ON':'off'),'Click to turn the headlights '+(c.lights?'off':'on')+'. You can see ahead in the dark, but monsters notice the light at night.',r+6);}
  // heartbeat
  {const hx=W*.08,hy=dy+H*.03,hw=W*.12,hh=34;box(hx,hy,hw,hh,'#08100a',6,2);
    const bpm=1.2+threat*3.5;ctx.strokeStyle=threat>.6?'#ff5a68':'#7dff9a';ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=hw-12;i+=3){const ph=((i/(hw-12))*3+S.t*bpm)%1;const yv=ph<.08?-12:ph<.12?10:ph<.16?-4:0;i?ctx.lineTo(hx+6+i,hy+hh/2+yv*(.5+threat*.7)):ctx.moveTo(hx+6,hy+hh/2);}ctx.stroke();
    hov(hx,hy,hw,hh,'Your heartbeat','It speeds up when monsters get close to the car.');}
  // gauges
  const sx=W*.31,sr=Math.min(H*.2,150),sy=H+sr*.25;
  {const gx=sx,gy=dy+H*.08;for(const o of [-1,1]){circ(gx+o*52,gy,30,'#0e0c0b',3);ctx.strokeStyle='#ffd166';ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx+o*52,gy,23,Math.PI*.8,Math.PI*2.2);ctx.stroke();
    const a=Math.PI*.8+(o<0?0:c.hp/c.max)*Math.PI*1.4;ctx.strokeStyle='#ff5a68';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx+o*52,gy);ctx.lineTo(gx+o*52+Math.cos(a)*21,gy+Math.sin(a)*21);ctx.stroke();
    txt(o<0?'MPH':'CAR HP',gx+o*52,gy+20,10,'#a39e91','center',700);}
    hov(gx+22,gy-30,60,60,'Car health: '+Math.round(c.hp)+' / '+Math.round(c.max),'If monsters find you they attack the car. At zero it wrecks and you crawl out.');}
  // wiper stalk
  {const bx=sx+sr*.55,by=sy-sr*.95,ex=bx+90,ey=by-26-(S.wipeT>0?10:0),hv=hot(bx,ey-16,110,52);
    ctx.strokeStyle=hv?'#6a625a':'#2a2420';ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.stroke();circ(ex,ey,10,hv?'#8a8278':'#3a342e',2);
    label('WIPERS',ex+6,ey-16,'#efe9dc',12);keyBadge('2',ex+30,ey+4);
    carZone('wipers',bx,ey-16,110,52,'🌧️ Wiper stalk','Click to swipe the windshield clean. Dirt and weather build up over time and when the car gets hit.');}
  // steering wheel + horn
  {ctx.lineWidth=22;ctx.strokeStyle='#0d0b0a';ctx.beginPath();ctx.arc(sx,sy,sr,0,7);ctx.stroke();ctx.lineWidth=14;ctx.strokeStyle='#2a2420';ctx.stroke();
    ctx.strokeStyle='#1c1816';ctx.lineWidth=16;for(const a of [Math.PI*1.1,Math.PI*1.9,Math.PI*1.5]){ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(a)*sr,sy+Math.sin(a)*sr);ctx.stroke();}
    const hy=sy-sr*.42,hr=36,pressed=c.hornT&&S.t-c.hornT<.25,hv=hotC(sx,hy,hr);
    circ(sx,hy,hr,pressed?'#ffd166':hv?'#4a4038':'#2a2420',3);txt('📯',sx,hy+4,20,'#fff','center');label('HORN',sx,hy+22,'#efe9dc',11);keyBadge('1',sx+hr,hy-hr+8);
    const cd=c.hornCd&&S.t<c.hornCd;if(cd){ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(sx,hy,hr+5,-Math.PI/2,-Math.PI/2+6.28*(1-(c.hornCd-S.t)/3));ctx.stroke();}
    carZone('horn',sx,hy,0,0,'📯 Horn','Click to honk. Monsters right next to the car flinch back, but everything nearby comes to look.',hr);}
  // radio
  {const rw=230,rh=74,rx=W*.5-rw/2,ry=dy+H*.05,hv=hot(rx,ry,rw,rh);box(rx,ry,rw,rh,hv?'#2a2420':'#0e0c0b',8,3);
    box(rx+44,ry+10,rw-88,28,c.radio?'#123a1a':'#0a120c',3,1.5);
    const rt=c.radio?(c.radioMsg||'...static...'):'OFF';ctx.save();ctx.beginPath();ctx.rect(rx+46,ry+10,rw-92,28);ctx.clip();
    txt(rt,c.radio?rx+rw-46-((S.t*50)%(rt.length*8+rw)):rx+rw/2,ry+30,15,c.radio?'#7dff9a':'#3a5a3a',c.radio?'left':'center',600);ctx.restore();
    for(const [kx,on] of [[rx+22,c.radio],[rx+rw-22,0]]){circ(kx,ry+24,15,'#3a342e',2);ctx.save();ctx.translate(kx,ry+24);ctx.rotate(on?1:-.6+S.t*(c.radio&&kx>rx+40?.5:0));ctx.fillStyle='#ddd';ctx.fillRect(-2,-13,4,10);ctx.restore();}
    for(let i=0;i<6;i++)box(rx+50+i*22,ry+46,16,16,'#2a2420',3,1.5);
    label(c.radio?'📻 RADIO ON':'📻 RADIO',rx+rw/2,ry+rh+16,c.radio?'#7dff9a':'#efe9dc',12);keyBadge('4',rx+rw+6,ry+8);
    carZone('radio',rx,ry,rw,rh,'📻 Radio: '+(c.radio?'ON':'off'),'Click to turn it '+(c.radio?'off':'on')+'. It might pick up useful news, but it makes noise while it plays.');}
  // stay-quiet pad
  {const qw=270,qh=62,qx=W*.5-qw/2,qy=H-qh-12,q=S.quiet,qm=S.quietMeter===undefined?1:S.quietMeter,hv=hot(qx,qy,qw,qh);
    box(qx,qy,qw,qh,q?'#1e3a55':hv?'#1a2a38':'#14202c',12,3);ctx.strokeStyle=q?'#7fc8ff':'#3a5a7a';ctx.lineWidth=2;rrect(ctx,qx,qy,qw,qh,12);ctx.stroke();
    txt('🤫',qx+28,qy+40,28,'#fff','center');txt(q?'Staying quiet…':'HOLD TO STAY QUIET · Space',qx+52,qy+28,16,'#e8f4ff','left',700);
    bar(qx+52,qy+38,qw-66,9,qm,'#7fc8ff');
    carZone('quiet',qx,qy,qw,qh,'🤫 Stay quiet','Hold the mouse here (or hold Space) so monsters sniffing around can\'t hear you. The blue bar runs out, then refills.');}
  // glove box
  {const gx=W*.64,gy=dy+H*.06,gw=W*.2,gh=H*.11,open=c.glove,hv=hot(gx,gy,gw,gh+(open?40:0));
    box(gx,gy,gw,gh,hv?'#3e3630':'#2e2824',6,3);
    if(open){box(gx+8,gy+gh-6,gw-16,46,'#1a1614',4,2.5);txt(c.gloveFind||'🧻',gx+gw/2,gy+gh+26,20,'#fff','center');}
    else{box(gx+gw/2-24,gy+gh/2-5,48,10,hv?'#bbb':'#666',3,1.5);}
    label(open?'GLOVE BOX ✓':'🧤 GLOVE BOX',gx+gw/2,gy+18,'#efe9dc',12);keyBadge('7',gx+gw-6,gy+6);
    carZone('glove',gx,gy,gw,gh+(open?44:0),'🧤 Glove box'+(open?' (searched)':''),open?'Already searched.':'Click to open it and grab what\'s inside. Sometimes car keys.');}
  // passenger seat (under the seat)
  {const px=W*.62,py=H*.82,pw=W*.36,ph=H*.2,done=c.seat,hv=hot(px,py-30,pw,ph+30);
    ctx.fillStyle=hv?'#5a4a3e':'#4a3c32';rrect(ctx,px,py,pw,ph,18);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#0a0807';ctx.fillRect(px+40,py-14,pw-80,12);
    if(done){txt('✋',px+pw/2,py-8,20,'#fff','center');}else if(hv){txt('✋',px+pw/2+Math.sin(S.t*6)*30,py-8,20,'#fff','center');}
    label(done?'UNDER THE SEAT ✓':'💺 UNDER THE SEAT',px+pw/2,py+30,'#efe9dc',12);keyBadge('8',px+pw-26,py+16);
    carZone('seat',px,py-30,pw,ph+30,'💺 Under the passenger seat'+(done?' (searched)':''),done?'Already searched.':'Click to feel around under the seat. Sometimes there\'s a weapon.');}
  // messages / threat / hint
  if(sus>.02){const tw=360,ty=wy+wh*.5;box(W/2-tw/2,ty,tw,46,'rgba(10,8,8,.82)',8,2);txt('👁  Something is sniffing around the car…',W/2,ty+19,16,'#ff8a95','center',700);bar(W/2-tw/2+12,ty+29,tw-24,9,sus,sus>.7?'#ff3b5c':'#ffb347');}
  if(S.carMsg&&S.t-(S.carMsgT||0)<7){const a=Math.min(1,(7-(S.t-S.carMsgT))/1.5);ctx.globalAlpha=a;const bw=Math.min(620,W*.6),by=wy+wh*.64;
    ctx.font='600 17px "Barlow Condensed",sans-serif';const lines=[];let line='';S.carMsg.split(' ').forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width>bw-30&&line){lines.push(line);line=w;}else line=t;});lines.push(line);
    box(W/2-bw/2,by,bw,22+lines.length*20,'rgba(12,10,8,.9)',10,2);lines.forEach((l,i)=>txt(l,W/2,by+24+i*20,17,'#ffe9b0','center',600));ctx.globalAlpha=1;}
  {const t='🚗 Click anything in the car to use it · hover to see what it does';ctx.font='600 15px "Barlow Condensed",sans-serif';const tw=ctx.measureText(t).width+24;box(W/2-tw/2,dy-34,tw,24,'rgba(0,0,0,.6)',8,1);txt(t,W/2,dy-17,15,'#d8d2c4','center',600);}
  ctx.restore();
}
// ---------- toolbar + help ----------
let tbEl=null;
function updateToolbar(){
  if(!tbEl){tbEl=document.createElement('div');tbEl.id='toolbar';document.body.appendChild(tbEl);
    tbEl.innerHTML=[['menu','☰','Menu','Esc'],['dna','🧬','DNA','Tab'],['map','🗺️','Map','M'],['journal','📖','Goals','J'],['log','📜','Log','L'],['help','❓','Help','F1']].map(([a,i,n,k])=>`<button data-tb="${a}" title="${n} (${k})"><span>${i}</span><b>${n}</b><kbd>${k}</kbd></button>`).join('');
    tbEl.addEventListener('click',e=>{const b=e.target.closest('[data-tb]');if(!b||!S)return;({menu:openMenu,dna:()=>openGenome(),map:openMap,journal:openJournal,log:openLog,help:openHelp})[b.dataset.tb]();});}
  const show=S&&(S.mode==='hunter'||S.mode==='monster')&&!ovMode&&!(S.P&&S.P.hidden);
  tbEl.style.display=show?'flex':'none';
}
function openHelp(){openPanel('help');}
function helpHtml(){
  const mon=S.mode==='monster',goal=(S.story&&!mon&&nextGoal())||objective();
  const sec=(t,items)=>`<section style="margin-bottom:12px"><h3>${t}</h3><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul></section>`;
  return `<div class="card wide">${head('Help · F1 or ? to close','How to play')}
  <section style="margin:10px 0 12px;border-color:var(--gold)"><h3 style="color:var(--gold)">What to do right now</h3><p style="font-size:20px;margin:0">${goal}</p><p class="mute" style="margin:6px 0 0">The same goal is always shown at the top of the screen. Press J for the full list.</p></section>
  <div class="cols" style="margin-top:0">
  <div>${sec('Exploring',['Walk into a door (yellow ENTER arrow) to go inside. Walk out through the red EXIT mat.','<b>Hold E</b> next to cabinets, fridges, lockers and toolboxes (they glow yellow) to search them.','<b>Attack furniture</b> to smash it for wood, scrap and wire.','Building anything (base upgrades, truck parts, weapons, traps) opens a <b>blueprint</b>: drag the material tiles onto the matching spots to put it together.','Searching is noisy. Whatever lives in the building will come.','Buildings can be <b>dangerous</b>: ☣️ gas leaks, ⚡ live wires, 🕳️ rotten floors, 🥚 egg sacs (smash them from a distance before they hatch) and booby-trapped cupboards. Hover over anything to check it. Risky buildings have better loot. Sometimes a monster jumps out while you search, so keep your weapon ready.'])}
  ${sec('Cars',['<b>Hold E</b> next to a car to search its trunk. Press <b>E</b> again to hide inside.','Inside the car, <b>click the parts of the car</b>: the horn on the steering wheel, the wiper stalk, the light knob, the radio, the door lock, the sun visor, the glove box and under the seat. Hover over anything to see what it does.','Hold <b>Space</b> to stay quiet when something sniffs around.','Find car keys (🔑 on your map) to drive. Running monsters over hurts them.'])}
  ${sec('Your base',['Your base has a Workbench (build upgrades), DNA Lab, Weapon Rack, Stat Board, Bed and Pantry. Stand next to one and press <b>E</b>.','At night monsters attack. Inside, stand at a window or the door and press <b>E</b> to <b>look out and fight</b> (you take half damage behind cover). Press <b>R</b> to board up a window with 1 wood. Build spike pits, bear traps and log walls at the workbench. If the base falls, it gets breached: monsters pour in, you lose some supplies and the base drops a level. A breached Rickety Shack becomes a <b>ruin</b> you must rebuild (🪵4 ⚙️3). Late in the day you can also <b>sleep at a friendly survivor camp</b> for food instead of defending.','The game saves every dawn and whenever you walk into your base.'])}</div>
  <div>${sec('DNA & powers',['Killed monsters drop glowing <b>DNA strands</b>. Walk over them to put them in your Vault.','Out in town you can only <b>absorb strands raw</b> (half strength). At the DNA Lab in your cabin you can <b>sequence</b> them by playing a lab test (full strength). There are 10 lab tests, and you get a random one each time.','<b>40%</b> unlocks a weak echo of a power, <b>100%</b> the full power, <b>150%</b> mastery. Put powers on keys <b>1, 2, 3</b>.','Every power costs a little <b>humanity</b>. At 0 humanity, you become the monster.','<b>Two roads:</b> at any camp, give DNA away. <b>💉 Vaccines</b> help them and move you toward <b>The Cure</b>. <b>🧬 Turning</b> survivors or <b>☣️ tainting</b> a camp\'s water builds <b>The Brood</b>. At your lab you can <b>⏪ reverse splice</b> to win humanity back.','<b>🎚️ Difficulty:</b> Kid mode has no traps in buildings, rare raids, slow hunger and friendlier gate guards. Change it any time in the Menu. <b>📘 Lessons</b> teach one new thing per day for the first 4 days (turn them on or off on the title screen).','<b>🗝️ The story</b> (Story mode): every country has big choices with a 💉 Cure answer, a 🧬 Brood answer, and sometimes a 🤝 Vance answer. Your two road meters decide the ending. The Goals journal (J) keeps track of what you\'ve learned.','<b>📻 Camp raids:</b> at night monsters attack camps. They smash the gate, get inside and bite people. Help a camp hold its wall for trust and humanity. Bitten survivors (🤒) turn into monsters in 2 days: treat them (1 💊), cure them (needs vaccine know-how), or finish the change and make them yours. If a camp\'s health hits 0, it falls.','<b>🐾 Your pack (C):</b> on the monster road (Brood 1+ or humanity under 50), press C near monsters to make them follow you. Press C near a camp to send them at it. If the camp sees you do it, they will hate you. If your pack takes a camp, you get its loot and Brood +2. The pack scatters at dawn.','<b>🛑 Camp gates:</b> guards stop you at the gate. Human ways in: let them search you (fewer body changes and an empty vault help), show your vaccine work, or pay a toll. Trusted friends get waved through. Monster ways in: stare them down, use a Mind power, turn the gatekeeper at night (the gate then opens for you every night and the searchlights look away), or break in. As the Apex you smash the gate.','<b>Two roads</b> (at any camp): 💉 give a strand to their medic as a <b>vaccine</b> (more trust, and those monsters get sick near the camp). Every new kind of strand moves <b>The Cure</b> forward. Or 🧬 <b>spread it</b>: turn a recruit into a loyal mutant, or sneak to a camp\'s 💧 water tank at night and hold E to taint it. It takes <b>3 doses on 3 different nights</b> (2 strands each). Camps have walls, guards and 🔦 searchlights, and if they catch you at the tank they attack. A camp that notices people getting sick goes on alert. 3 doses make it a <b>Brood camp</b>, and every other camp will hate you for that. With Cure 3+, 3 meds and a strand you can <b>bring a Brood camp back</b>.','<b>⏪ Reverse splice</b> (You tab, at your lab): play a lab test to pull DNA back out of you for humanity. <b>🧥 Disguise</b> hides your changes, unless a camp catches you.','<b>🧍 You tab</b> (in DNA): see your body change with every power family and as humanity drops. <b>Traits</b> come only from certain monsters: fill one to 100% and it is always on.','<b>Absorbing raw</b> gives half the DNA, but it heals you and gives a <b>⚡ Wild Surge</b>: use that power at full strength with <b>F</b> for 30 seconds, even if it\'s still locked. But it\'s risky: sometimes you get a <b>bad batch</b> (fever, glowing, the shakes, or lost humanity), each surge use burns humanity, and when the surge ends you <b>crash</b> (slow and fragile for 8 seconds).'])}
  ${sec('Powers vs traits',['<b>Powers</b> are moves you use: put up to 3 on keys <b>1, 2, 3</b>, press the key to fire it, then wait for the cooldown. Each use costs a little humanity. They unlock at 40% DNA.','<b>Traits</b> are always-on bonuses, like a tougher hide or finding more loot. No button, no cooldown, no humanity cost. They unlock at 100% DNA and you can wear 2.'])}
  ${sec('Survivors',['Camps (⛺ on the minimap) trade, give jobs, share rumors and have recruits.','How they treat you depends on your humanity: Trusted, Uneasy, Wary, Hostile or Feared.','Jobs show at the top of the screen and with a yellow ! on the map.','Camps lose trust if you <b>lead monsters to them</b>, <b>use powers where they can see</b>, or show up <b>glowing</b> from a Wild Surge. Their camp screen shows what they\'ve noticed.'])}
  ${sec('Winning',['Kill a town\'s boss to <b>liberate</b> it. Fix the truck at the <b>Garage</b> 🔧: find 4 tires in car trunks, grab the guarded parts 🔩, charge the battery while monsters attack, pay scrap and wire to fit each part, and add 5 fuel. Then and drive to the next town.','<b>Driving back:</b> the Garage\'s Drive-to list shows every town you\'ve been to. Go back for DNA you\'re missing, to finish a town, to shop at a freed town\'s 🏪 trading post, or to answer a 🆘 radio call. Each town keeps its own base and a stash of what didn\'t fit in the truck. Towns you leave unfinished get more dangerous every day.','Free towns and <b>city districts</b> 🏙️, beat each <b>State Warden</b> 💀 to conquer a state, then beat the <b>country boss</b> 👑 to sail to the next country: the United Wastes → Japan → Scotland → Mexico → Egypt. Beat Apophis in Egypt to win the world. Press <b>M</b> for the map (it has a 🌍 World tab).','You have 3 lives (hearts, top left), and you get one back in each new town. Every time you go down, more monsters come into town. Lose all 3 lives and you wake up in a new shack in the same town: you keep your powers, but everything else gets scavenged, lots more monsters move in, and if you\'d killed the boss, a new stronger boss takes over.'])}</div></div>
  <section><h3>Keys</h3><div class="keys" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
    <span><kbd>WASD</kbd> move · <kbd>Mouse</kbd> aim</span><span><kbd>Click</kbd>/<kbd>Space</kbd> attack</span><span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> powers</span><span><kbd>E</kbd> use / search (hold)</span>
    <span><kbd>Tab</kbd> DNA</span><span><kbd>M</kbd> map · <kbd>J</kbd> goals · <kbd>L</kbd> log</span><span><kbd>Q</kbd> weapon · <kbd>H</kbd> meds</span><span><kbd>Esc</kbd>/<kbd>P</kbd> menu &amp; save · <kbd>N</kbd> sound</span></div></section></div>`;
}
