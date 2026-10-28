// ================= NIGHT DEFENSE: LOOK OUT WINDOWS, TRAPS & WALLS, BREACH, WILD SURGE =================
// ---------- looking out a window / the door ----------
function nearPost(){const P=S.P;if(P.sc!=='base'||P.dead)return null;const I=S.baseInt;
  let best=null,bd=62;I.windows.forEach((w,i)=>{const d=Math.hypot(P.x-w.ix,P.y-w.iy);if(d<bd){bd=d;best={kind:'win',i};}});
  const dd=Math.hypot(P.x-I.door.x,P.y-(I.door.y-56));if(dd<70&&dd<bd)best={kind:'door'};return best;}
function postPoint(pt){const br=baseRect();
  if(pt.kind==='door')return {x:BASE.x,y:br.y+br.h+62,ox:0,oy:1};
  return [{x:br.x+br.w*.3,y:br.y-26,ox:0,oy:-1},{x:br.x+br.w*.7,y:br.y-26,ox:0,oy:-1},{x:br.x-26,y:br.y+br.h*.78,ox:-1,oy:0},{x:br.x+br.w+26,y:br.y+br.h*.78,ox:1,oy:0}][pt.i];}
function enterPost(pt){const P=S.P,o=postPoint(pt);S.post={...pt,...o,ret:{x:P.x,y:P.y}};P.posted=true;teleport(P,o.x,o.y,'out');P.face=Math.atan2(o.oy,o.ox);P.doorCd=1;sfx('door');
  if(!S.postHelped){S.postHelped=true;toast('🪟 You\'re looking out. Click monsters to fight them, use powers 1-3, press R to board up, and press WASD to step back inside.');}}
function exitPost(){const P=S.P,p=S.post;if(!p)return;P.posted=false;S.post=null;teleport(P,p.ret.x,p.ret.y,'base');P.doorCd=1;}
{const _up=updatePlayer;updatePlayer=function(dt){const P=S.P;
  if(P.posted&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].some(k=>keys[k])){exitPost();return;}
  _up(dt);if(P.posted&&S.post){P.x=S.post.x;P.y=S.post.y;}};}
{const _gc=getCam;getCam=function(){const c=_gc();const p=S&&S.P&&S.P.posted&&S.post;if(p){c.x=clamp(c.x+p.ox*c.vw*.22,0,Math.max(0,WW-c.vw));c.y=clamp(c.y+p.oy*c.vh*.22,0,Math.max(0,WH-c.vh));}return c;};}
{const _in=interact;interact=function(){const P=S.P;if(P&&P.posted){exitPost();return;}
  if(S.mode==='hunter'&&P.sc==='base'&&!P.dead){const pt=nearPost();if(pt){enterPost(pt);return;}}_in();};}
{const _pt=promptText;promptText=function(){const P=S.P;
  if(P.posted)return (S.post.kind==='door'?'🚪 Watching from the doorway':'🪟 Looking out the window')+' · Click to fight · R board up · WASD step back';
  if(S.mode==='hunter'&&P.sc==='base'){const pt=nearPost();if(pt){if(pt.kind==='door')return 'E: look out the door';const W=S.windows[pt.i];return 'E: look out the window'+(W.hp<winMax()?' · R: board it up (1 wood)':'');}}
  return _pt();};}
function boardWindow(i){if(S.windows[i].hp>=winMax()){toast('That window is already boarded up.');return;}if(S.res.wood<1){toast('You need 1 🪵 wood to board up a window.','bad');return;}
  S.res.wood--;S.windows[i].hp=winMax();sfx('hit');floatText(S.P.x,S.P.y-30,'🪵 Boarded!','#b8e04a');}
addEventListener('keydown',e=>{if(!S||ovMode||S.mode!=='hunter'||e.repeat)return;const k=e.key.toLowerCase();
  if(k==='r'){const P=S.P;if(P.posted&&S.post.kind==='win')boardWindow(S.post.i);else{const pt=nearPost();if(pt&&pt.kind==='win')boardWindow(pt.i);}}
  if(k==='f')castSurge();});
function drawPostFrame(){
  const p=S.post,W=VW,H=VH,door=p.kind==='door',t=Math.min(W,H)*.07;
  ctx.save();
  const hx=door?W*.26:t,hy=t*.8,hw=door?W*.48:W-2*t,hh=H-hy-(door?0:t*1.6);
  ctx.fillStyle='#3a2616';ctx.fillRect(0,0,W,hy);ctx.fillRect(0,hy+hh,W,H-hy-hh);ctx.fillRect(0,hy,hx,hh);ctx.fillRect(hx+hw,hy,W-hx-hw,hh);
  ctx.strokeStyle='#1a0e06';ctx.lineWidth=8;rrect(ctx,hx,hy,hw,hh,door?18:10);ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=3;for(let y=12;y<H;y+=26){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(hx-6,y);ctx.moveTo(hx+hw+6,y);ctx.lineTo(W,y);ctx.stroke();}
  if(!door){const Wn=S.windows[p.i],fr=Wn.hp/winMax();ctx.fillStyle='#8a5a30';const nb=Math.ceil(fr*3);
    for(let k=0;k<nb;k++){const yy=hy+hh*(.2+k*.3);ctx.save();ctx.translate(W/2,yy);ctx.rotate((k-1)*.05);ctx.fillRect(-hw/2-10,-9,hw*.18,18);ctx.fillRect(hw/2-hw*.18+10,-9,hw*.18,18);ctx.restore();}
    const bw=260;box(W/2-bw/2,H-t*1.25,bw,26,'rgba(0,0,0,.6)',6,2);bar(W/2-bw/2+6,H-t*1.25+6,bw-12,14,fr,fr>.5?'#b8e04a':fr>0?'#ffb347':'#ff5a68','WINDOW '+(Wn.hp<=0?'BROKEN':Math.round(fr*100)+'%'));
    hov(W/2-bw/2,H-t*1.25,bw,26,'🪟 This window','Monsters claw at it. If it breaks they climb inside. Press R to board it up with 1 wood.');}
  ctx.restore();
}
// half damage while you're behind cover
// ---------- traps & walls ----------
const DEFS={spikes:{icon:'🔺',name:'Spike pit',cost:{wood:3,scrap:2},desc:'Hurts and slows anything that walks over it.'},
  trap:{icon:'🪤',name:'Bear trap',cost:{scrap:3,wire:1},desc:'Snaps shut: big damage and holds a monster still for 3 seconds. Resets itself.'},
  wall:{icon:'🪵',name:'Log wall',cost:{wood:5},desc:'Blocks monsters until they chew through it. Repair it with 2 wood.',hp:220}};
const DEF_ANG=[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
function defPos(s){const br=baseRect(),R=Math.max(br.w,br.h)/2+80,a=DEF_ANG[s]*Math.PI/180;return {x:BASE.x+Math.cos(a)*R,y:BASE.y+Math.sin(a)*R*.85};}
function updateDefs(dt){if(S.mode!=='hunter'||!S.defs)return;
  for(const s in S.defs){const D=S.defs[s],p=defPos(+s);
    if(D.type==='trap'&&!D.armed){D.rt-=dt;if(D.rt<=0)D.armed=true;}
    for(const m of S.enemies){if(m.dead||m.sc!=='out'||m.kind!=='monster')continue;const d=Math.hypot(m.x-p.x,m.y-p.y);
      if(D.type==='spikes'&&d<30+m.r){dmgFoe(m,18*dt,null,true);m.slowT=Math.max(m.slowT,.5);}
      if(D.type==='trap'&&D.armed&&d<24+m.r&&!m.boss){D.armed=false;D.rt=20;dmgFoe(m,45);m.stunT=Math.max(m.stunT,3);sfx('hit');burst(p.x,p.y,'#c8c8c8',10);floatText(p.x,p.y-30,'SNAP!','#ffd166');}
      if(D.type==='wall'&&D.hp>0&&d<36+m.r){const dd=d||1;m.x=p.x+(m.x-p.x)/dd*(36+m.r);m.y=p.y+(m.y-p.y)/dd*(36+m.r);D.hp-=m.dmg*dt*.6;D.flash=.1;if(D.hp<=0){D.hp=0;toast('🪵 A log wall broke! Repair it at the workbench.','bad');}}}
    if(D.flash>0)D.flash-=dt;}}
function drawDefs(){if(S.mode!=='hunter'||!S.defs)return;
  for(const s in S.defs){const D=S.defs[s],p=defPos(+s);ctx.save();ctx.translate(p.x,p.y);
    if(D.type==='spikes'){ctx.fillStyle='#5a4028';ctx.beginPath();ctx.ellipse(0,0,30,22,0,0,7);ctx.fill();for(let i=0;i<7;i++){const a=i/7*6.28;ctx.fillStyle='#c8ccd0';ctx.beginPath();ctx.moveTo(Math.cos(a)*16-4,Math.sin(a)*12);ctx.lineTo(Math.cos(a)*16+4,Math.sin(a)*12);ctx.lineTo(Math.cos(a)*16,Math.sin(a)*12-14);ctx.closePath();ctx.fill();ctx.strokeStyle='#222';ctx.lineWidth=1;ctx.stroke();}}
    if(D.type==='trap'){circ(0,0,20,'#6a6a6a',2.5);ctx.strokeStyle='#ddd';ctx.lineWidth=3;
      if(D.armed){for(let i=0;i<10;i++){const a=i/10*6.28;ctx.beginPath();ctx.moveTo(Math.cos(a)*14,Math.sin(a)*14);ctx.lineTo(Math.cos(a)*20,Math.sin(a)*20);ctx.stroke();}circ(0,0,6,'#b8862a',1.5);}
      else{ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(18,0);ctx.stroke();label(Math.ceil(D.rt)+'s',0,-24,'#bbb',11);}}
    if(D.type==='wall'){const a=Math.atan2(p.y-BASE.y,p.x-BASE.x)+Math.PI/2;ctx.rotate(a);
      if(D.hp>0){for(let k=-1;k<=1;k++)box(-34,k*11-5,68,10,D.flash>0?'#d89a5a':'#8a5a30',5,2);if(D.hp<DEFS.wall.hp){ctx.rotate(-a);hpBar(0,-30,50,D.hp/DEFS.wall.hp,'#b8e04a');}}
      else{box(-30,-4,22,8,'#5a3a20',3,1.5);box(6,6,26,8,'#5a3a20',3,1.5);}}
    ctx.restore();
    if(S.P.sc==='out'&&Math.hypot(S.P.x-p.x,S.P.y-p.y)<220)hovWorld(p.x,p.y,30,DEFS[D.type].icon+' '+DEFS[D.type].name,DEFS[D.type].desc+(D.type==='wall'?' Health '+Math.round(D.hp)+'/'+DEFS.wall.hp+'.':D.type==='trap'?(D.armed?' Armed.':' Resetting…'):''));}}
function hovWorld(x,y,r,t,d){const c=getCam();hov((x-c.x)*SCALE-r,(y-c.y)*SCALE-r,r*2,r*2,t,d);}
{const _dbo=drawBaseOut;drawBaseOut=function(){drawDefs();_dbo();};}
function defenseHtml(){
  S.defs=S.defs||{};const sel=S.defSlot;const D=sel!==undefined&&sel!==null?S.defs[sel]:null;
  const slots=DEF_ANG.map((ang,s)=>{const a=ang*Math.PI/180,x=50+Math.cos(a)*40,y=50+Math.sin(a)*38,d=S.defs[s];
    return `<button class="dslot ${d?'full':''} ${sel===s?'sel':''}" style="left:${x}%;top:${y}%" data-a="defslot" data-s="${s}" title="${d?DEFS[d.type].name:'Empty spot. Click to build something here.'}">${d?DEFS[d.type].icon:'＋'}${d&&d.type==='wall'&&d.hp<DEFS.wall.hp?'<i>!</i>':''}</button>`;}).join('');
  let side='<p class="mute" style="margin:0">👆 Click a spot around your base.</p>';
  if(sel!==undefined&&sel!==null){
    if(!D)side=Object.keys(DEFS).map(k=>{const T=DEFS[k];return `<div class="act"><div><span style="font-size:24px">${T.icon}</span> <b>${T.name}</b><small>${T.desc}</small>${costHtml(T.cost)}</div><button class="btn sm" data-a="defbuild" data-t="${k}" ${canPay(T.cost)?'':'disabled'}>Build</button></div>`;}).join('');
    else{const T=DEFS[D.type];side=`<div class="act"><div><span style="font-size:28px">${T.icon}</span> <b>${T.name}</b><small>${T.desc}</small>${D.type==='wall'?`<small>Health ${Math.round(D.hp)} / ${T.hp}</small>`:''}</div></div>
      <div class="row" style="margin-top:6px">${D.type==='wall'?`<button class="btn sm" data-a="defrepair" ${D.hp<T.hp&&S.res.wood>=2?'':'disabled'}>Repair (2 🪵)</button>`:''}<button class="btn sm ghost" data-a="defremove">Take it down</button></div>`;}}
  return `<section style="margin-top:12px"><h3>🛡️ Night defenses <small>traps and walls around your base</small></h3><div class="defwrap"><div class="defmap"><div class="dbase">🏠</div><div class="ddoor">door</div>${slots}</div><div>${side}</div></div></section>`;
}
{const _bh=benchHtml;benchHtml=function(){const h=_bh();return h.replace(/<\/div>\s*$/,defenseHtml()+'</div>');};}
function defAct(a,d){
  if(a==='defslot'){S.defSlot=+d.s;refreshPanel();return true;}
  if(a==='defbuild'){const T=DEFS[d.t],s=S.defSlot;if(T&&s!==undefined&&!S.defs[s]&&canPay(T.cost)){pay(T.cost);S.defs[s]={type:d.t,hp:T.hp||0,armed:true,rt:0};sfx('build');toast(T.icon+' Built a '+T.name.toLowerCase()+'.','good');}refreshPanel();return true;}
  if(a==='defrepair'){const D=S.defs[S.defSlot];if(D&&S.res.wood>=2){S.res.wood-=2;D.hp=DEFS.wall.hp;}refreshPanel();return true;}
  if(a==='defremove'){delete S.defs[S.defSlot];refreshPanel();return true;}
  return false;
}
{const _act=act;act=function(a,d){if(defAct(a,d||{}))return;_act(a,d);};}
// per-town memory for defenses
{const _l=leaveTownMemory;leaveTownMemory=function(){_l();tlog().defs=S.defs||{};};}
{const _a=arriveTown;arriveTown=function(){_a();S.defs=tlog(S.town).defs||{};};}
// ---------- base breach instead of game over ----------
function baseBreached(){
  if(S.breachT&&S.t-S.breachT<8)return;S.breachT=S.t;
  const lost=[];for(const k in S.res){const l=Math.floor(S.res[k]*.25);if(l>0){S.res[k]-=l;lost.push(RES_ICON[k]+l);}}
  const oldName=TIERS[S.tier].name,drop=S.tier>0;if(drop)S.tier--;
  const P=S.P,wasIn=P.sc==='base';if(P.posted)exitPost();
  S.windows=[];makeBaseInterior();S._sol={};S.windows.forEach(w=>w.hp=0);S.baseHp=Math.round(baseMax()*.3);
  const B=S.baseInt;if(P.sc==='base')teleport(P,B.x+B.w/2,B.y+B.h/2,'base');
  S.enemies.filter(e=>e.sc==='base'&&!e.dead).forEach((e,i)=>{const w=B.windows[i%4];teleport(e,w.ix,w.iy,'base');});
  S.enemies.filter(e=>e.raid&&!e.dead&&e.sc==='out').slice(0,4).forEach((e,i)=>{const w=B.windows[i%4];teleport(e,w.ix,w.iy,'base');e.raid=false;e.state='chase';e.hx=w.ix;e.hy=w.iy;});
  S.shake=12;sfx('bad');
  banner('BREACHED!',(drop?'Your '+oldName+' caved in. It\'s a '+TIERS[S.tier].name+' again. ':'The walls gave way. ')+'Monsters are pouring inside!','#ff4d5e');
  toast('🏚️ Your base was breached. You lost '+(lost.join(' ')||'nothing')+'. Fight them off, then patch the walls and board the windows at the workbench.','bad');
}
// ---------- WILD SURGE: the upside of absorbing raw ----------
function absorbRaw(v,quiet){
  const g=geneInfo(v.gene);S.vault=S.vault.filter(x=>x!==v);addDNA(v.gene,Math.round(v.val*.5));
  healPlayer(15);humanityHit(1);
  S.surge={id:v.gene,t:TRAITS[v.gene]?60:30,max:TRAITS[v.gene]?60:30};
  if(!quiet){banner('⚡ WILD SURGE: '+g.name.toUpperCase(),TRAITS[v.gene]?'This trait is ON for 60 seconds, even if it\'s still locked.':'Press F to use it at FULL power for 30 seconds, even if it\'s still locked!',g.color);sfx('power');}
}
function castSurge(){const s=S.surge,P=S.P;if(!s||s.t<=0){floatText(P.x,P.y-30,'No Wild Surge. Absorb a strand raw to get one.','#bbb');return;}
  if(!POWERS[s.id]){floatText(P.x,P.y-30,'This surge is a trait. It\'s already on.','#bbb');return;}
  if(P.dead||P.car||P.hidden)return;if((S.cds[s.id]||0)>0)return;castPower(s.id,(level(s.id)||0)<1?1/(level(s.id)||1):1);S.cds[s.id]=powerCd(s.id);humanityHit(.15);}
{const _ht=hasTrait;hasTrait=function(id){return (S.surge&&S.surge.t>0&&S.surge.id===id)||_ht(id);};}
{const _act=act;act=function(a,d){
  if(a==='absorb'){const v=S.vault.find(x=>x.id==d.v);if(v)absorbRaw(v);if(S.panel)refreshPanel();return;}
  if(a==='absorbAll'){const vs=S.vault.slice();vs.forEach((v,i)=>absorbRaw(v,i<vs.length-1));if(S.panel)refreshPanel();return;}
  _act(a,d);};}
function drawSurge(){const s=S.surge;if(!s||s.t<=0||S.mode!=='hunter'||S.P.hidden)return;const g=geneInfo(s.id),w=250,x=VW/2-w/2,y=VH-190;
  panelBg(x,y,w,34);txt('⚡ '+g.icon+' '+g.name+(POWERS[s.id]?' · F':' · ON'),x+10,y+22,16,g.color,'left',700);bar(x+w-74,y+12,64,10,s.t/s.max,g.color);
  hov(x,y,w,34,'⚡ Wild Surge: '+g.name,POWERS[s.id]?'You absorbed this strand raw, so you can use it at full power for a short time. Press F.':'You absorbed this trait raw, so it\'s switched on for a short time.');}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(S.surge&&S.surge.t>0){S.surge.t-=dt;if(S.surge.t<=0)toast('⚡ The Wild Surge faded.');}updateDefs(dt);};}
{const _dh=drawHUD;drawHUD=function(){_dh();drawSurge();};}
{const _nf=onNightfall;onNightfall=function(){_nf();if(S.mode==='hunter')toast('🪟 Inside your base, stand at a window or the door and press E to look out and fight. Traps and walls are built at the workbench.');};}
{const _sr=scavengedRestart;scavengedRestart=function(){_sr();S.defs={};S.surge=null;};}
