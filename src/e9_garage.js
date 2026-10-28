// ================= GARAGE & ESCAPE TRUCK =================
const FUEL_NEED=5,TIRES_NEED=4;
const TPARTS={
  tires:{icon:'🛞',name:'Tires',desc:'The old ones are shredded.',cost:{scrap:2}},
  battery:{icon:'🔋',name:'Car battery',desc:'Dead as a doornail.',cost:{wire:1}},
  plugs:{icon:'🔩',name:'Spark plugs',desc:'No spark, no start.',cost:{wire:2}},
  belt:{icon:'➰',name:'Fan belt',desc:'Snapped on the way in.',cost:{scrap:1,wire:1}},
  engine:{icon:'⚙️',name:'Engine part',desc:'Something big tore it right out.',cost:{scrap:3,wire:2}}
};
THEMES.garage={floor:'concrete',props:[['toolbox',3],['barrel',3],['locker',1],['crate',2]]};
function addGarage(){
  const T=TOWNS[S.town],w=230,h=150;
  const ok=(x,y)=>{const r={x,y,w,h};if(x<80||y<80||x+w>WW-80||y+h>WH-80)return false;
    if(S.blds.some(b=>overlap(r,b,110)))return false;
    if(Math.hypot(x+w/2-BASE.x,y+h/2-BASE.y)<330)return false;
    for(const [px,py] of [[x,y],[x+w,y],[x,y+h],[x+w,y+h],[x+w/2,y+h/2]])if(nearRoad(px,py,40))return false;return true;};
  let spot=null;
  const cands=[[700,520],[1500,520],[640,1020],[1560,1020],[760,330],[1450,320],[700,1180],[1500,1180],[420,520],[1880,380],[380,1050],[1900,1250]];
  for(const [x,y] of cands)if(ok(x,y)){spot=[x,y];break;}
  if(!spot)for(let k=0;k<600&&!spot;k++){const x=rnd(100,WW-330),y=rnd(100,WH-250);if(ok(x,y))spot=[x,y];}
  if(!spot)spot=[700,520];
  const b={id:'garage',name:'Garage',x:spot[0],y:spot[1],w,h,roof:'#4a5560',wall:'#c8c0b0',sign:'#4aa8ff',monster:null,garage:true,idx:S.blds.length,awake:false,mimicBld:false,fallen:false,hp:0,maxHp:0,spawnT:0,flash:0,visited:false};
  const cx=b.x+b.w/2,cy=b.y+b.h/2,vx=BASE.x-cx,vy=BASE.y-cy;
  if(Math.abs(vx)/b.w>Math.abs(vy)/b.h){b.nx=Math.sign(vx);b.ny=0;b.dx=vx>0?b.x+b.w:b.x;b.dy=cy;}else{b.nx=0;b.ny=Math.sign(vy)||1;b.dy=vy>0?b.y+b.h:b.y;b.dx=cx;}
  b.lx=b.dx+b.nx*60;b.ly=b.dy+b.ny*60;
  S.blds.push(b);
}
function setupGarageInterior(){
  const I=S.interiors.garage;if(!I)return;
  const st={id:'assembly',name:'Assembly Bay',x:I.x+I.w/2-130,y:I.y+120,w:260,h:150};
  I.props=I.props.filter(p=>!overlap(p,st,70));I.stations=[st];
}
function initTruck(){
  const T=TOWNS[S.town];S.truck={parts:{},where:{},fuel:T.arena?FUEL_NEED:0,tires:0};S.charge=null;
  if(T.arena)return;
  const blds=S.blds.filter(b=>!b.boss&&!b.mimicBld&&!b.garage).sort(()=>Math.random()-.5);
  ['battery','plugs','belt'].forEach((id,i)=>{const b=blds[i%blds.length],I=S.interiors[b.id];if(!I)return;
    const props=I.props.filter(p=>PROPS[p.type].cont&&!p.part);const p=props.length?pick(props):I.props.find(p=>!p.part);if(!p)return;
    if(!PROPS[p.type].cont){p.type='toolbox';p.w=PROPS.toolbox.w;p.h=PROPS.toolbox.h;}
    p.part=id;p.searched=false;S.truck.parts[id]='missing';S.truck.where[id]=b.id;});
  S.truck.parts.tires='missing';S.truck.where.tires='cars';
  S.cars.forEach(c=>c.tire=false);S.cars.slice().sort(()=>Math.random()-.5).slice(0,Math.min(S.cars.length,TIRES_NEED+2)).forEach(c=>{c.tire=true;c.searched=false;});
  S.truck.parts.engine='missing';S.truck.where.engine='boss';
}
function partWhere(id){const w=S.truck.where[id];if(w==='boss'){const T=TOWNS[S.town];return 'Carried by '+MONSTERS[T.boss].name+' in '+T.lair;}
  if(w==='cars')return 'Search car trunks 🚗. About half the cars have a good tire. ('+(S.truck.tires||0)+'/'+TIRES_NEED+' found)';
  const b=S.blds.find(b=>b.id===w);return 'Hidden in the '+(b?b.name:'?')+'. Look for the glowing blue "TRUCK PART" container. Something guards it.';}
function truckParts(){return Object.keys(S.truck?S.truck.parts:{});}
function truckReady(){return !!S.truck&&truckParts().every(k=>S.truck.parts[k]==='installed')&&S.truck.fuel>=FUEL_NEED;}
function truckNeed(){const t=S.truck,miss=truckParts().filter(k=>t.parts[k]!=='installed');const out=[];
  if(miss.length)out.push(miss.length+' part'+(miss.length>1?'s':''));if(t.fuel<FUEL_NEED)out.push((FUEL_NEED-t.fuel)+' fuel');return out.join(' and ');}
function spawnGuardian(x,y){const P=S.P,b=S.blds.find(b=>b.id===P.sc),type=b&&b.monster?b.monster:pick(TOWNS[S.town].raid);
  const m=spawnMonster(type,x+rnd(-40,40),y+60,{sc:P.sc,home:b});m.hp*=2.5;m.maxHp*=2.5;m.dmg*=1.4;m.r*=1.3;if(typeof mutate==='function')mutate(m);m.name='Guardian '+MONSTERS[type].name.replace(/^The /,'');m.state='chase';m.awake=true;
  banner('A GUARDIAN WAKES UP','Something big was sleeping on that part. Run or fight!','#ff5a68');S.shake=8;}
function findPart(id,x,y){
  if(!S.truck||!S.truck.parts[id]||S.truck.parts[id]!=='missing')return;
  const P=TPARTS[id];
  if(id==='battery'){S.truck.parts.battery='dead';banner('FOUND: A DEAD BATTERY','Take it to the Garage 🔧 and charge it. The charger is loud…','#4aa8ff');}
  else{S.truck.parts[id]='found';banner('FOUND: '+P.name.toUpperCase(),'Bring it to the Garage 🔧 and install it in the truck.','#4aa8ff');}
  toast(P.icon+' Found the '+P.name.toLowerCase()+' for the truck.','good');sfx('pickup');
  if(x!==undefined)floatText(x,y-30,P.icon+' '+P.name+'!','#7fd6ff');
  if(id!=='engine'&&S.P.sc!=='out')spawnGuardian(x||S.P.x,y||S.P.y);
}
function foundTire(c){const t=S.truck;if(!t||t.parts.tires!=='missing')return;t.tires=(t.tires||0)+1;c.tire=false;sfx('pickup');
  floatText(c.x,c.y-50,'🛞 Good tire! '+t.tires+'/'+TIRES_NEED,'#7fd6ff');toast('🛞 Found a good tire ('+t.tires+'/'+TIRES_NEED+').','good');
  if(t.tires>=TIRES_NEED){t.parts.tires='found';banner('ALL 4 TIRES','Roll them back to the Garage 🔧 and put them on.','#4aa8ff');}}
function drawPartMarks(I){
  I.props.forEach(p=>{if(!p.part||p.dead||p.searched)return;const cx=p.x+p.w/2,cy=p.y+p.h/2;
    ctx.strokeStyle='rgba(74,168,255,'+(.5+.4*Math.sin(S.t*4))+')';ctx.lineWidth=4;ctx.strokeRect(p.x-6,p.y-6,p.w+12,p.h+12);
    label('🔩 TRUCK PART',cx,p.y-14,'#7fd6ff',13);});
}
function drawTruck(x,y,w,h,parts,fuel){
  const has=k=>!parts[k]||parts[k]==='installed';
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(x+6,y+8,w,h);
  for(const [wx,wy] of [[x+w*.14,y-8],[x+w*.14,y+h-6],[x+w*.72,y-8],[x+w*.72,y+h-6]]){
    if(has('tires'))box(wx,wy,w*.15,14,'#1c1c1c',4,2);else{ctx.setLineDash([4,4]);ctx.strokeStyle='#ff8a95';ctx.lineWidth=2;ctx.strokeRect(wx,wy,w*.15,14);ctx.setLineDash([]);}}
  box(x,y,w*.68,h,'#b8462e',4,3);box(x+w*.68,y+6,w*.32,h-12,'#c8563a',6,3);box(x+w*.74,y+14,w*.12,h-28,'#8ec9e6',3,2);
  ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;for(let i=x+14;i<x+w*.66;i+=18){ctx.beginPath();ctx.moveTo(i,y+4);ctx.lineTo(i,y+h-4);ctx.stroke();}
  if(!has('engine')||!has('plugs')||!has('belt')||!has('battery')){box(x+w*.88,y+12,w*.16,h-24,'#2a2a2a',3,2);}
  ctx.fillStyle='#fff3b0';ctx.fillRect(x+w-4,y+10,5,10);ctx.fillRect(x+w-4,y+h-20,5,10);
}
function garageHtml(){
  const T=TOWNS[S.town],t=S.truck,ks=truckParts();
  const rows=ks.map(k=>{const P=TPARTS[k],st=t.parts[k];
    const tag=st==='installed'?['✅ INSTALLED','#9dffb2']:st==='found'?['READY TO INSTALL','var(--gold)']:st==='dead'?['🪫 DEAD, CHARGE IT','#ffb347']:k==='tires'&&t.tires?[t.tires+'/'+TIRES_NEED+' FOUND','#ffb347']:['MISSING','#ff8a95'];
    let btn='';
    if(st==='found')btn=`<div style="text-align:right">${costHtml(P.cost)}<button class="btn sm gold" data-a="install" data-k="${k}" ${canPay(P.cost)?'':'disabled'}>Install</button></div>`;
    if(st==='dead')btn=S.charge?`<span class="tag">⚡ charging…</span>`:`<button class="btn sm gold" data-a="charge" title="Takes 30 seconds inside the Garage. The noise brings monsters.">⚡ Charge it</button>`;
    return `<div class="act part ${st}"><div style="display:flex;gap:12px;align-items:center"><span style="font-size:30px">${P.icon}</span><div><b style="font-size:18px">${P.name}</b>
      <span class="tag" style="color:${tag[1]}">${tag[0]}</span>
      <small>${st==='missing'?'📍 '+partWhere(k):st==='dead'?'Charge it here. It takes 30 seconds, and the noise draws monsters into the Garage. Stay inside until it\'s done.':st==='found'?'Fitting it takes parts and tools.':P.desc.replace('.',' — fixed now.')}</small></div></div>${btn}</div>`;}).join('');
  const fuelRow=`<div class="act part"><div style="display:flex;gap:12px;align-items:center"><span style="font-size:30px">⛽</span><div><b style="font-size:18px">Fuel tank: ${t.fuel} / ${FUEL_NEED}</b><small>Every trip burns ${FUEL_NEED} fuel. You have ${S.res.fuel} ⛽ in your pack. Barrels, gas stations and car trunks have fuel.</small></div></div>
    <button class="btn sm ${t.fuel<FUEL_NEED&&S.res.fuel>0?'gold':'ghost'}" data-a="pourfuel" ${t.fuel<FUEL_NEED&&S.res.fuel>0?'':'disabled'}>${t.fuel>=FUEL_NEED?'Full':'Pour in fuel'}</button></div>`;
  const rk=MODS.rack,haveRack=S.mods.rack;
  const rackRow=`<div class="act"><div>📦 ${rk.name}${haveRack?' <span class="tag">INSTALLED</span>':''}<small>${rk.desc}</small>${haveRack?'':costHtml(rk.cost)}</div><button class="btn sm" data-a="mod" data-k="rack" ${!haveRack&&canPay(rk.cost)?'':'disabled'}>${haveRack?'Done':'Build'}</button></div>`;
  const allIn=ks.every(k=>t.parts[k]==='installed'),fueled=t.fuel>=FUEL_NEED;
  const chk=(ok,txt)=>`<div class="act"><div>${ok?'✅':'⬜'} ${txt}</div></div>`;
  const leave=`${chk(allIn,ks.length?'Every part installed ('+ks.filter(k=>t.parts[k]==='installed').length+' of '+ks.length+')':'Truck runs fine, no parts needed')}${chk(fueled,FUEL_NEED+' fuel in the tank ('+t.fuel+'/'+FUEL_NEED+')')}<div style="margin-top:12px">${driveToHtml()}</div>`;
  return `<div class="card wide">${head('Garage · '+T.name+' · E or Esc to close','The Escape Truck')}
  <p style="margin:6px 0 12px">${!ks.length?'The truck made it here in one piece. Put '+FUEL_NEED+' fuel in the tank, then pick where to drive.':'The truck broke down on the way into '+T.name+'. Hunt down the parts, charge the battery, pay for the bolts and wiring, and fill the tank.'}</p>
  <div class="cols"><section><h3>Parts</h3>${rows||'<p class="mute">Nothing to fix.</p>'}${fuelRow}<h3 style="margin-top:14px">Truck upgrades</h3>${rackRow}</section>
  <section><h3>Truck status</h3>${leave}</section></div></div>`;
}
function garageAct(a,d){
  const t=S.truck;
  if(a==='install'&&t.parts[d.k]==='found'){const P=TPARTS[d.k];if(!canPay(P.cost)){toast('You need '+Object.keys(P.cost).map(k=>P.cost[k]+' '+k).join(' and ')+' to fit it.','bad');return true;}
    pay(P.cost);t.parts[d.k]='installed';sfx('hit');toast(P.icon+' Installed the '+P.name.toLowerCase()+'.','good');
    if(truckParts().every(k=>t.parts[k]==='installed'))banner('TRUCK FIXED','Fill the tank with '+FUEL_NEED+' fuel, then pick where to drive.','#7dff9a');return true;}
  if(a==='charge'&&t.parts.battery==='dead'&&!S.charge){S.charge={t:0,max:30,spawnT:2};hideOv();banner('⚡ CHARGING THE BATTERY','The charger is roaring. Monsters heard it. Survive 30 seconds inside the Garage!','#ffd166');return 'closed';}
  if(a==='driveto'){S.travelTo=+d.i;act('leave',{});return false;}
  if(a==='pourfuel'&&S.res.fuel>0&&t.fuel<FUEL_NEED){const n=Math.min(S.res.fuel,FUEL_NEED-t.fuel);S.res.fuel-=n;t.fuel+=n;toast('⛽ Poured '+n+' fuel into the truck ('+t.fuel+'/'+FUEL_NEED+').','good');return true;}
  return false;
}
function chargeTick(dt){const c=S.charge,P=S.P;if(!c||S.mode!=='hunter')return;if(P.dead){S.charge=null;toast('🔋 The charge was lost when you went down. Try again.','bad');return;}
  if(P.sc!=='garage')return;c.t+=dt;c.spawnT-=dt;
  if(c.spawnT<=0){c.spawnT=6.5;const I=S.interiors.garage,pool=TOWNS[S.town].raid;for(let i=0;i<2;i++){const m=spawnMonster(pick(pool),I.door.x+rnd(-80,80),I.door.y-50,{sc:'garage'});m.state='chase';m.awake=true;}floatText(I.door.x,I.door.y-80,'THEY HEARD IT!','#ff4d5e');}
  if(c.t>=c.max){S.charge=null;S.truck.parts.battery='found';banner('🔋 BATTERY CHARGED','Now install it in the truck.','#7dff9a');sfx('coin');}}
function drawCharge(){const c=S.charge;if(!c||S.mode!=='hunter')return;const w=300,x=VW/2-w/2,y=150;panelBg(x,y,w,40);
  txt('🔋 Charging battery'+(S.P.sc!=='garage'?' (paused, go back inside!)':''),x+10,y+17,15,'#ffd166','left',700);bar(x+10,y+24,w-20,10,c.t/c.max,'#7dff9a');}
// ================= ACTION LOG =================
const LOG_CATS={all:['📜','Everything'],dna:['🧬','DNA & powers'],loot:['🎒','Loot & supplies'],danger:['⚠️','Danger'],truck:['🚚','Truck'],people:['⛺','Survivors'],story:['📖','Big moments']};
function logCat(text,kind){const s=text.toLowerCase();
  if(kind==='banner')return 'story';
  if(/truck|garage|fuel|part|install/.test(s))return 'truck';
  if(/dna|strand|power|absorb|sequenc|gene|trait|splice|mutagen/.test(s))return 'dna';
  if(kind==='bad'||/mimic|attack|stole|hurt|died|starv|danger|found you/.test(s))return 'danger';
  if(/camp|job|recruit|survivor|trade|rumor/.test(s))return 'people';
  if(/search|found|\+\d|loot|key|weapon/.test(s))return 'loot';
  return 'story';}
function addHistory(text,kind){if(!S)return;S.history=S.history||[];
  const clean=String(text).replace(/<[^>]+>/g,'');const last=S.history[S.history.length-1];
  if(last&&last.text===clean&&last.day===S.day){last.n=(last.n||1)+1;return;}
  S.history.push({text:clean,kind:kind||'',cat:logCat(clean,kind),day:S.day,night:!!S.night,town:S.town,clock:Math.round(S.clock||0)});if(S.history.length>400)S.history.shift();}
{const _t=toast;toast=function(text,kind){_t(text,kind);addHistory(text,kind);};
 const _b=banner;banner=function(text,sub,col){_b(text,sub,col);addHistory(text+(sub?' — '+sub:''),'banner');};}
function openLog(){S.logCat=S.logCat||'all';openPanel('log');}
function logHtml(){
  const c=S.logCat||'all',H=(S.history||[]).filter(h=>c==='all'||h.cat===c).slice().reverse();
  let lastKey='';const rows=H.map(h=>{const key=h.town+'|'+h.day;let hd='';
    if(key!==lastKey){lastKey=key;hd=`<h4 class="lbl" style="margin-top:14px">${TOWNS[h.town]?TOWNS[h.town].name:''} · Day ${h.day}</h4>`;}
    const col=h.kind==='bad'?'#ff9aa4':h.kind==='good'?'#c8f060':h.kind==='banner'?'var(--gold)':'var(--ink)';
    return hd+`<div class="logrow"><span class="lc" title="${LOG_CATS[h.cat][1]}">${LOG_CATS[h.cat][0]}</span><span class="lt">${h.night?'🌙':'☀️'}</span><span style="color:${col}">${h.text}${h.n>1?` <b class="mute">×${h.n}</b>`:''}</span></div>`;}).join('');
  return `<div class="card wide">${head('Log · L to close','What happened')}
  <p class="mute" style="margin:4px 0 10px">Everything the game told you, newest first. Use the buttons to show only one kind.</p>
  <div class="row" style="margin-bottom:8px">${Object.keys(LOG_CATS).map(k=>`<button class="btn sm ${c===k?'gold':'ghost'}" data-a="logcat" data-c="${k}">${LOG_CATS[k][0]} ${LOG_CATS[k][1]}</button>`).join('')}</div>
  ${rows||'<p class="mute">Nothing here yet.</p>'}</div>`;
}

CHAPTERS.forEach(ch=>{const T=TOWNS[ch.town];if(T&&!T.arena&&ch.goals.length>1)ch.goals.splice(ch.goals.length-1,0,['Find the truck parts 🔩 and fix the truck at the Garage 🔧',()=>(S.maxTown||0)>ch.town||(S.town===ch.town&&truckReady())]);});
// ================= CAR KEY GUIDE =================
function keyCars(){return S.mode==='hunter'?S.cars.filter(c=>c.drivable&&S.keys[c.id]&&!c.wreck):[];}
function drawKeyGuide(){
  const P=S.P,list=keyCars();if(!list.length||P.car)return;
  const names=list.map(c=>CARTYPES[c.type].name).join(', ');
  // chip under the toolbar
  {const t='🔑 Keys: '+names;ctx.font='700 15px "Barlow Condensed",sans-serif';const w=Math.min(300,ctx.measureText(t).width+20),x=12,y=486;
    panelBg(x,y,w,28);txt(t,x+10,y+19,15,'#ffd166','left',700);
    hov(x,y,w,28,'🔑 Car keys you have','They start: '+names+'. '+(P.sc==='out'?'Follow the gold arrow (or the 🔑 on the map) to the car, walk up to it and press E to drive.':'Go outside, then follow the gold arrow to the car.'));}
  if(P.sc!=='out')return;
  const cam=getCam();let best=null,bd=1e9;list.forEach(c=>{const d=dist(c,P);if(d<bd){bd=d;best=c;}});if(!best)return;
  const sx=(best.x-cam.x)*SCALE,sy=(best.y-cam.y)*SCALE,on=sx>40&&sx<VW-40&&sy>60&&sy<VH-60,nm=CARTYPES[best.type].name;
  if(on){const r=46+Math.sin(S.t*5)*5;ctx.strokeStyle='#ffd166';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(sx,sy,r,0,7);ctx.stroke();ctx.setLineDash([]);
    txt('🔑 YOUR '+nm.toUpperCase(),sx,sy-r-10,16,'#ffd166','center',700);if(bd<160)txt('Walk up and press E to drive',sx,sy+r+20,14,'#efe9dc','center',600);}
  else{const cx=VW/2,cy=VH/2,a=Math.atan2(sy-cy,sx-cx),m=70,ex=clamp(cx+Math.cos(a)*VW,m,VW-m),ey=clamp(cy+Math.sin(a)*VH,m+70,VH-m-90);
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle='#ffd166';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(26,0);ctx.lineTo(-10,-16);ctx.lineTo(-4,0);ctx.lineTo(-10,16);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    txt('🔑 '+nm+' · '+Math.round(bd/10)+'m',ex-Math.cos(a)*44,ey-Math.sin(a)*30+5,14,'#ffd166','center',700);
    hov(ex-40,ey-30,80,60,'🔑 Your car is this way',nm+'. Follow the arrow, walk up to it and press E to drive.');}
}
// ================= PAUSE MENU =================
function openMenu(){S.menuMsg='';openPanel('menu');}
function agoTxt(t){if(!t)return 'not yet this session';const s=Math.round((Date.now()-t)/1000);return s<60?s+' seconds ago':Math.round(s/60)+' minutes ago';}
function menuHtml(){
  const mon=S.mode==='monster',p=S.story&&!mon?pathName():null;
  const big=(a,icon,t,d,cls)=>`<button class="mbtn ${cls||''}" data-a="${a}"><span>${icon}</span><b>${t}</b><small>${d}</small></button>`;
  return `<div class="card">${head('Paused · Esc or P to resume','Menu')}
  ${S.menuMsg?`<div class="next" style="margin:8px 0"><span>${S.menuMsg}</span></div>`:''}
  <div class="mgrid">
    ${big('resume','▶️','Resume','Back to the game')}
    ${big('savenow','💾','Save game','Last saved '+agoTxt(S.lastSaveAt),'gold')}
    ${big('saveexit','🏠','Save & exit','Save, then go to the main screen')}
    ${big('menuhelp','❓','How to play','Controls, DNA, cars, the truck')}
    ${big('menulog','📜','Log','Everything that happened')}
    ${big('menusnd',SND?'🔊':'🔇','Sound: '+(SND?'on':'off'),'Click to turn it '+(SND?'off':'on'))}
  </div>
  <section style="margin-top:14px"><h3>${S.story?'Story mode':'Conquest mode'}${p?' · leaning '+p:''}</h3>
    <p style="margin:0">${S.story?'You aren\'t locked into an ending. Your humanity, your big choices, the camps you help or raid, and the powers you splice keep shifting you between <b>Hunter</b>, <b>Apex</b> and the hidden <b>Splicer</b> path. Press J to see where you stand.':'Pure survival: no chapters or big story choices. Clear towns and conquer states.'}</p></section>
  <p class="mute" style="margin:10px 0 0">The game also saves by itself every minute, at dawn, and whenever you walk into your base. On the main screen, click <b>Continue</b> to pick up where you left off.</p></div>`;
}
function menuAct(a){
  if(a==='resume'){hideOv();return true;}
  if(a==='savenow'){saveGame(true);S.menuMsg='💾 Saved! You can close the game and click Continue on the main screen later.';refreshPanel();return true;}
  if(a==='saveexit'){saveGame(true);hideOv();showTitle();return true;}
  if(a==='menuhelp'){openHelp();return true;}
  if(a==='menulog'){openLog();return true;}
  if(a==='menusnd'){toggleSound();refreshPanel();return true;}
  return false;
}
// ================= LAST LIFE: START OVER IN A NEW SHACK =================
function scavengedRestart(){
  const T=TOWNS[S.town],lost=[];
  const had=Object.keys(S.res).filter(k=>S.res[k]>0).map(k=>RES_ICON[k]+' '+S.res[k]).join('  ');
  if(S.vault.length)lost.push(S.vault.length+' DNA strand'+(S.vault.length>1?'s':''));
  if(S.weapons.length>1)lost.push(S.weapons.filter(w=>w!=='crowbar').map(w=>WEAPONS[w].name).join(', '));
  if(S.tier>0)lost.push('your '+TIERS[S.tier].name);
  if(Object.keys(S.keys).length)lost.push('your car keys');
  const tparts=S.truck?truckParts().filter(k=>S.truck.parts[k]!=='missing'):[];if(tparts.length)lost.push('the truck parts');
  const crewN=S.crew.filter(m=>!m.dead).length;if(crewN)lost.push(crewN+' crew member'+(crewN>1?'s':''));
  S.res={wood:0,scrap:0,wire:0,food:2,meds:1,fuel:0,ammo:0,mutagen:0};
  S.vault=[];S.weapons=['crowbar'];S.wpn=0;S.tier=0;S.mods={};S.keys={};S.crew=[];S.followers=[];
  S.windows=[];makeBaseInterior();S.baseHp=baseMax();S._sol={};
  // scavengers moved things around: containers have new junk in them, the truck got stripped
  Object.values(S.interiors).forEach(I=>I.props.forEach(p=>{if(PROPS[p.type].cont&&!p.dead)p.searched=false;delete p.part;}));
  const L=tlog(),bossBack=!!L.bossDead;
  if(bossBack){L.bossDead=false;L.liberated=false;S.bossDead=false;spawnRisenBoss();}
  if(S.truck&&!T.arena)initTruck();
  spawnStrays(8,22);S.enemies.forEach(e=>{if(!e.boss&&e.sc==='out')e.state='idle';});S.bossBack=bossBack;
  S.lives=S.maxLives||3;S.deaths=(S.deaths||0)+1;S.night=false;S.clock=0;S.day+=3;
  const kept=S.slots.filter(Boolean).map(id=>POWERS[id].icon+' '+POWERS[id].name).concat(S.traits.filter(Boolean).map(id=>TRAITS[id].icon+' '+TRAITS[id].name));
  S.restartCard={town:T.name,lost,had,kept};
  addHistory('💀 You lost your last life in '+T.name+'. You woke up in a new shack. Your powers stayed with you; everything else was scavenged.','banner');
}
function placePart(id){const b=S.blds.find(b=>b.id===S.truck.where[id]),I=b&&S.interiors[b.id];if(!I)return;const props=I.props.filter(p=>PROPS[p.type].cont&&!p.part&&!p.dead);const p=props.length?pick(props):null;if(p){p.part=id;p.searched=false;}}
function showRestartCard(){
  const R=S.restartCard;if(!R)return;S.restartCard=null;
  showOv(`<div class="card story"><div class="eyebrow">${R.town} · Day ${S.day}</div><h1 style="font-size:clamp(40px,7vw,72px);color:var(--blood)">You Wake Up Again</h1>
  <p>Your last life ran out. Somebody dragged you into a different empty shack on the edge of ${R.town}. By the time you open your eyes, scavengers have picked your old place clean.</p>
  <div class="cols" style="margin-top:8px"><section><h3 style="color:var(--toxic)">✅ You kept</h3><p style="margin:0">All your DNA and powers${R.kept.length?': '+R.kept.join(', '):''}. Your humanity and story choices too.</p></section>
  <section><h3 style="color:var(--blood)">❌ Scavenged</h3><p style="margin:0">${R.had?'Your supplies ('+R.had+')':'Your supplies'}${R.lost.length?', '+R.lost.join(', '):''}.</p></section></div>
  ${S.bossBack?`<p style="color:#ff8a95"><b>⚠️ A new boss has taken over ${R.town}.</b> ${MONSTERS[TOWNS[S.town].boss].name} is back, risen and stronger. The town isn't free anymore.</p>`:''}
  <p class="mute">You're in a fresh Rickety Shack with full lives. While you were out, <b>more monsters moved in</b> and everything got tougher. The scavengers left new junk in the cupboards. The truck was stripped, so its parts are hidden again.</p>
  <button class="btn big" data-a="close">Get up</button></div>`,'story');
}

/* spawnRisenBoss: replaced later */
