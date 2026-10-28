// ================= WORLD: generic monster abilities, conquest log, map, biomes =================
function dmgScale(m){const d=MONSTERS[m.type];return m.dmg/(d.dmg||1);}
function runMonsterAb(m,a,dd,dx,dy){
  const P=S.P,sc=dmgScale(m),ux=dx/(dd||1),uy=dy/(dd||1);
  switch(a.k){
    case 'shoot':{if(dd>420||dd<40)return false;const n=a.n||1,base=Math.atan2(dy,dx);
      for(let i=0;i<n;i++){const ang=base+(n>1?(i-(n-1)/2)*(a.spread||.2):0);S.proj.push({x:m.x,y:m.y,vx:Math.cos(ang)*a.spd,vy:Math.sin(ang)*a.spd,r:a.r||5,dmg:a.dmg*sc,owner:'e',life:1.8,color:a.col,from:m,sc:m.sc,pst:a.pst,homing:a.homing});}return true;}
    case 'nova':{if(dd>a.r+(m.boss?60:10))return false;addFx({type:'shock',x:m.x,y:m.y,r:a.r,life:.45,color:a.col});
      if(!P.dead&&dist(P,m)<a.r+P.r){damagePlayer(a.dmg*sc,m,a.kind);if(a.stun&&!P.car&&!P.hidden&&!hasTrait('mindshield')){P.stunT=Math.max(P.stunT,a.stun);floatText(P.x,P.y-30,'STUNNED','#f2dc7a');}}return true;}
    case 'dash':{if(dd>340||dd<80)return false;m.dashT=.38;m.dvx=ux*a.spd;m.dvy=uy*a.spd;if(a.hide)m.alpha=.35;return true;}
    case 'leap':{if(dd>300||dd<90)return false;m.leap={sx:m.x,sy:m.y,tx:P.x,ty:P.y,t:0,dur:.5};return true;}
    case 'zone':{if(dd>260)return false;S.hazards.push({x:P.x,y:P.y,r:a.r,life:4.5,max:4.5,dps:a.dps*sc,owner:'e',color:a.col,kind:a.kind||'zone',sc:m.sc});return true;}
    case 'summon':{const n=S.enemies.filter(e=>!e.dead&&e.summoner===m).length;if(n>=a.max)return false;
      for(let i=0;i<a.n;i++){const s=spawnMonster(a.type,m.x+rnd(-30,30),m.y+rnd(-30,30),{sc:m.sc});s.state='chase';s.summoner=m;}addFx({type:'ring',x:m.x,y:m.y,r:40,life:.4,color:m.eye});return true;}
    case 'hex':{if(dd>260)return false;if(!hasTrait('mindshield')){P.hexT=4;floatText(P.x,P.y-30,'HEXED: +50% damage taken','#d6ff70');}addFx({type:'bolt',x:m.x,y:m.y,x2:P.x,y2:P.y,life:.3,color:'#d6ff70'});return true;}
  }
  return false;
}
function wardenPhase(m){
  const f=m.hp/m.maxHp,ph=f<.25?3:f<.55?2:1;
  if(ph!==m.phase){const first=!m.phase;m.phase=ph;if(!first){
    if(ph===2){banner(m.name.toUpperCase()+' ADAPTS','It\'s copying your powers now. Watch for their colors.','#ff7be0');m.spd*=1.15;}
    if(ph===3){banner(m.name.toUpperCase()+' IS ENRAGED','It\'s faster, and it\'s calling everything in the state to it.','#ff3b3b');m.spd*=1.2;m.dmg*=1.2;
      for(let i=0;i<4;i++){const s=spawnMonster(pick(TOWNS[S.town].raid),m.x+rnd(-80,80),m.y+rnd(-80,80),{sc:m.sc});s.state='chase';}}}}
  if(ph>=2){m.mirT=(m.mirT||2)-1/60;if(m.mirT<=0){m.mirT=3;const P=S.P,cols=S.slots.filter(Boolean).map(id=>POWERS[id].color);if(!cols.length)cols.push('#ff7be0');
    for(let i=0;i<12;i++){const a=i/12*6.28+S.t;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*300,vy:Math.sin(a)*300,r:7,dmg:9*dmgScale(m),owner:'e',life:2.4,color:cols[i%cols.length],from:m,sc:m.sc,pst:i%3===0?'slow':null});}}}
}
// ---------- town log / conquest ----------
function tlog(i){i=i===undefined?S.town:i;if(!S.townLog[i])S.townLog[i]={visited:false,liberated:false,claimed:false,bossDead:false,lairs:[],campsHelped:[],campsRaided:[],mimic:false,searched:0};return S.townLog[i];}
function townCompletion(i){
  const T=TOWNS[i],L=tlog(i);if(T.arena)return L.bossDead?100:0;
  const nb=T.blds.filter(b=>!b.boss).length||1;
  return Math.round((L.bossDead||L.claimed?40:0)+30*Math.min(1,L.lairs.length/nb)+15*Math.min(1,(L.campsHelped.length+L.campsRaided.length)/2)+(L.mimic?5:0)+10*Math.min(1,L.searched/10));
}
function liberateTown(){
  const L=tlog();if(L.liberated)return;L.liberated=true;L.bossDead=true;
  banner(TOWNS[S.town].name.toUpperCase()+' LIBERATED','The boss is dead. The camps here will remember you. Press M to see your conquest map.','#7fc8ff');
  S.camps.forEach(c=>{if(!c.raided)c.rep=Math.min(60,c.rep+20);});
}
function claimTown(){
  const L=tlog();if(L.claimed)return;L.claimed=true;
  const N=TOWNS[S.town+1];
  banner(TOWNS[S.town].name.toUpperCase()+' CLAIMED',N?'This town is hive territory now. Go to your nest and press B to migrate to '+N.name+'.':'There is nowhere left to go.','#c27bff');
}
function migrateTown(){
  const i=S.town+1;if(!TOWNS[i])return;
  S.day=1;S.clock=0;S.night=true;loadTown(i);setupMonsterTown();
  banner(TOWNS[i].name.toUpperCase(),'The swarm moves on. '+(TOWNS[i].arena?'Something huge is waiting here.':'Break the outposts and raid the camps.'),'#c27bff');
}
function stateOfTown(i){return STATES.findIndex(s=>s.towns&&s.towns.includes(i));}
// ---------- map ----------
/* openMap: replaced later */
function townStatus(i){const L=S.townLog[i],cur=i===S.town;if(L&&L.liberated)return{t:'LIBERATED',c:'#7fc8ff'};if(L&&L.claimed)return{t:'CLAIMED',c:'#c27bff'};if(cur)return{t:'YOU ARE HERE',c:'#ffd166'};if(L&&L.visited)return{t:'LEFT BEHIND',c:'#a39e91'};return{t:'UNEXPLORED',c:'#5a5a5a'};}
/* mapHtml: replaced later */
const TRAVEL_TEXT={
  Saltmarsh:'Two days of road later, the asphalt turns into boardwalk and the air turns thick. A sign, half underwater: <em>WELCOME TO SALTMARSH.</em> Someone has painted underneath it: <em>TURN AROUND.</em>',
  Frostfall:'The road climbs into the mountains. Snow starts falling sideways. The welcome sign for <em>FROSTFALL</em> is buried up to the second L, and something big has walked through the drifts beside it.',
  'Hollow Dam':'The road ends at a concrete dam taller than any building you\'ve seen. The water behind it has gone black. Something is standing on top of it, watching your truck pull in. <em>The State Warden.</em>',
  Dustbowl:'You cross the state line into red dirt. The heat makes the road shimmer. <em>DUSTBOWL, POP. 412</em>. Someone has crossed out the number and written <em>0?</em>',
  'Old Haven':'A real city. Skyscrapers with their windows blown out. Car alarms still going, years later. A radio tower at the center is broadcasting the same word over and over: <em>"Come."</em>',
  'Mesa Gate':'Two giant rock pillars stand on either side of the highway like a gate. Between them waits the second Warden. It\'s wearing pieces of the first one.'
};
// ---------- biome decor ----------
function biomeDecorType(b,r){
  if(b==='snow')return r<.35?'pine':r<.55?'drift':r<.7?'ice':r<.82?'rock':r<.9?'lamp':'bush';
  if(b==='desert')return r<.25?'cactus':r<.45?'rock':r<.58?'skull':r<.72?'tumble':r<.85?'dune':'lamp';
  if(b==='city')return r<.3?'rubble':r<.45?'crater':r<.6?'barrelfire':r<.75?'trash':r<.88?'lamp':'tree';
  if(b==='dam')return r<.4?'rubble':r<.6?'crack':r<.8?'barrier':'lamp';
  if(b==='mesa')return r<.4?'rock':r<.6?'pillar':r<.8?'skull':'dune';
  if(b==='swamp')return r<.3?'cypress':r<.5?'pool':r<.72?'reeds':r<.82?'boat':r<.9?'lamp':'bush';
  return r<.4?'tree':r<.58?'bush':r<.72?'rubble':r<.84?'flowers':r<.93?'lamp':'hydrant';
}
function drawBiomeDecor(d){
  const t=S.t;
  switch(d.t){
    case 'drift':ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(d.x,d.y,40*d.s,18*d.s,d.a*.3,0,7);ctx.fill();ctx.strokeStyle='#c8d8e4';ctx.lineWidth=2;ctx.stroke();break;
    case 'ice':ctx.fillStyle='rgba(170,220,250,.7)';ctx.beginPath();ctx.ellipse(d.x,d.y,46*d.s,24*d.s,d.a,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(d.x-20,d.y);ctx.lineTo(d.x+10,d.y-6);ctx.stroke();break;
    case 'rock':box(d.x-14*d.s,d.y-10*d.s,28*d.s,20*d.s,TOWNS[S.town].biome==='snow'?'#8a9098':'#a0705a',8,2);ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(d.x-8*d.s,d.y-6*d.s,10*d.s,4*d.s);break;
    case 'skull':circ(d.x,d.y,7*d.s,'#efe6d0',1.5);ctx.fillStyle='#222';ctx.beginPath();ctx.arc(d.x-2.5*d.s,d.y-1,1.6*d.s,0,7);ctx.arc(d.x+2.5*d.s,d.y-1,1.6*d.s,0,7);ctx.fill();break;
    case 'tumble':ctx.strokeStyle='#8a6a3a';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(d.x+Math.sin(t*.5+d.a)*20,d.y,11*d.s,0,7);ctx.stroke();ctx.beginPath();ctx.arc(d.x+Math.sin(t*.5+d.a)*20,d.y,6*d.s,0,7);ctx.stroke();break;
    case 'dune':ctx.strokeStyle='rgba(120,80,40,.35)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(d.x,d.y+30,50*d.s,Math.PI*1.15,Math.PI*1.85);ctx.stroke();break;
    case 'crater':ctx.fillStyle='rgba(30,30,30,.5)';ctx.beginPath();ctx.ellipse(d.x,d.y,30*d.s,22*d.s,d.a,0,7);ctx.fill();ctx.strokeStyle='#4a4a4a';ctx.lineWidth=3;ctx.stroke();break;
    case 'barrelfire':box(d.x-9,d.y-9,18,18,'#6a4a3a',9,2);for(let i=0;i<3;i++){ctx.fillStyle=['#ffd166','#ff7a2f','#ff4d3a'][i];ctx.beginPath();ctx.arc(d.x+Math.sin(t*9+i)*2,d.y-3-i*3,5-i*1.2,0,7);ctx.fill();}break;
    case 'trash':for(let i=0;i<4;i++)box(d.x+((i*13)%22)-11,d.y+((i*7)%14)-7,9,7,['#4a6a8a','#8a4a4a','#ddd','#6a8a4a'][i],1,1);break;
    case 'crack':ctx.strokeStyle='#4a4e52';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(d.x-30,d.y);ctx.lineTo(d.x-10,d.y-8);ctx.lineTo(d.x+8,d.y+4);ctx.lineTo(d.x+30,d.y-6);ctx.stroke();break;
    case 'barrier':ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a);box(-30,-8,60,16,'#d8d4cc',3,2);ctx.fillStyle='#e8a020';ctx.fillRect(-26,-3,52,6);ctx.restore();break;
    case 'pillar':ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(d.x+10,d.y+12,34*d.s,26*d.s,0,0,7);ctx.fill();circ(d.x,d.y,30*d.s,'#a8582a',3);circ(d.x-6,d.y-6,16*d.s,'#c8743a',0);break;
    default:return false;
  }
  return true;
}
function drawBiomeHigh(d){
  if(d.t==='pine'){ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(d.x+8,d.y+10,22*d.s,14*d.s,0,0,7);ctx.fill();
    for(let i=0;i<3;i++){const s=(26-i*7)*d.s,y=d.y-i*8*d.s;ctx.beginPath();ctx.moveTo(d.x,y-s);ctx.lineTo(d.x+s,y+s*.6);ctx.lineTo(d.x-s,y+s*.6);ctx.closePath();fs(i===2?'#3a6a4a':'#2a5a3c',2);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(d.x,y-s);ctx.lineTo(d.x+s*.35,y-s*.3);ctx.lineTo(d.x-s*.35,y-s*.3);ctx.fill();}return true;}
  if(d.t==='cactus'){ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(d.x+6,d.y+8,14*d.s,8*d.s,0,0,7);ctx.fill();box(d.x-6*d.s,d.y-20*d.s,12*d.s,34*d.s,'#4a9a4a',6,2);box(d.x-16*d.s,d.y-10*d.s,8*d.s,16*d.s,'#4a9a4a',4,2);box(d.x+8*d.s,d.y-14*d.s,8*d.s,14*d.s,'#4a9a4a',4,2);ctx.fillStyle='#ff8ab0';ctx.beginPath();ctx.arc(d.x,d.y-21*d.s,3,0,7);ctx.fill();return true;}
  return false;
}
function biomeGround(){
  const T=TOWNS[S.town];
  return {road:{town:'#54585e',snow:'#9aa4ac',desert:'#b08a5a',city:'#3e4044',swamp:'#9a7a4e'}[T.biome]||'#54585e',side:{town:'#a19c8e',snow:'#ffffff',desert:'#c8a070',city:'#6a6c6e',swamp:'#2e2416'}[T.biome]||'#a19c8e',
    dash:{town:'#e8c85a',snow:'#ffffff',desert:null,city:'#e8e8e8'}[T.biome],yard:{town:'#8a7652',snow:'#c8d0d8',desert:'#c09a62',city:'#5a5c5e',swamp:'#6a5a3a',dam:'#8a8e92',mesa:'#a8623a'}[T.biome]};
}
function drawLairGeneric(b,cx,cy){
  const mon=S.mode==='monster';
  if(b.id==='falls'){circ(cx,cy,86,'#cfe8f4',3);circ(cx,cy,60,'#7ab8d8',2);circ(cx,cy,34,'#244a62',2);for(let i=0;i<10;i++){const a=i/10*6.28;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*60,cy+Math.sin(a)*60);ctx.lineTo(cx+Math.cos(a+.15)*82,cy+Math.sin(a+.15)*82);ctx.lineTo(cx+Math.cos(a+.3)*60,cy+Math.sin(a+.3)*60);fs('#eaf8ff',1.5);}}
  else if(b.id==='well'){circ(cx,cy,80,'#c8a070',3);for(let i=0;i<14;i++){const a=i/14*6.28;box(cx+Math.cos(a)*62-8,cy+Math.sin(a)*62-6,16,12,'#9a7a5a',3,1.5);}circ(cx,cy,46,'#1a1208',2);}
  else if(b.id==='btower'){circ(cx,cy,84,'#4a4e54',3);ctx.strokeStyle='#c8ccd0';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<4;i++){const a=i/4*6.28+.78;ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*76,cy+Math.sin(a)*76);}ctx.stroke();circ(cx,cy,14,'#222',2);
    if(!mon&&Math.floor(S.t*2)%2){ctx.fillStyle='#ff3b3b';ctx.shadowColor='#ff3b3b';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(cx,cy,7,0,7);ctx.fill();ctx.shadowBlur=0;}}
  else return false;
  return true;
}
// ---------- generic monster shapes ----------
function drawShape(m,c,r,t){
  switch(MONSTERS[m.type].shape){
    case 'copy':{ctx.globalAlpha*=.7+.25*Math.sin(t*9);const o=Math.sin(t*20)*2;circ(-r*.15+o,0,r,c,3);for(const s of [-1,1])circ(r*.45,s*r*.85,r*.32,c,2);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-r*.15-o*2,0,r+3,0,7);ctx.stroke();ctx.globalAlpha=m.alpha;break;}
    case 'brute':circ(-r*.2,0,r,c,3);circ(r*.55,0,r*.5,shade(m.color,-.1),2.5);for(const s of [-1,1])circ(r*.3,s*r*.95,r*.35,shade(m.color,-.15),2);break;
    case 'wraith':ctx.globalAlpha*=.85;ctx.beginPath();ctx.moveTo(r*1.2,0);for(let i=0;i<=8;i++){const a=Math.PI*.5+i/8*Math.PI;ctx.lineTo(Math.cos(a)*r*(1+(i%2)*.35)-r*.2,Math.sin(a)*r);}ctx.closePath();fs(c);ctx.globalAlpha=m.alpha;break;
    case 'quad':for(const s of [-1,1])for(const o of [-.5,.5]){ctx.strokeStyle=OUT;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(o*r,s*r*.4);ctx.lineTo(o*r+Math.sin(t*12+o)*4,s*r*1.05);ctx.stroke();}
      ctx.beginPath();ctx.ellipse(-2,0,r*1.2,r*.62,0,0,7);fs(c);circ(r*.95,0,r*.5,c,2.5);ctx.beginPath();ctx.moveTo(-r*1.1,0);ctx.lineTo(-r*1.7,Math.sin(t*8)*5);ctx.strokeStyle=OUT;ctx.lineWidth=4;ctx.stroke();break;
    case 'bird':{const f=Math.sin(t*12)*.4;ctx.beginPath();ctx.moveTo(r*1.2,0);ctx.lineTo(-r*.6,-r*(1.7+f));ctx.lineTo(-r*.2,0);ctx.lineTo(-r*.6,r*(1.7+f));ctx.closePath();fs(c);circ(r*.7,0,r*.45,shade(m.color,-.1),2);break;}
    case 'bug':for(let i=0;i<3;i++)for(const s of [-1,1]){ctx.strokeStyle=OUT;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo((i-1)*r*.5,s*r*.4);ctx.lineTo((i-1)*r*.6+Math.sin(t*14+i)*3,s*r*1.2);ctx.stroke();}
      ctx.beginPath();ctx.ellipse(0,0,r*1.1,r*.75,0,0,7);fs(c);ctx.strokeStyle=shade(m.color,-.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r*.6,0);ctx.stroke();circ(r*.9,0,r*.4,shade(m.color,-.15),2);break;
    case 'serpent':for(let i=4;i>=0;i--){const x=-i*r*.55,y=Math.sin(t*6+i)*r*.35;circ(x,y,r*(1-i*.12),i?shade(m.color,-.06*i):c,2.5);}break;
    case 'golem':box(-r,-r*.85,r*2,r*1.7,c,6,3);ctx.fillStyle=shade(m.color,-.25);for(let i=0;i<3;i++)ctx.fillRect(-r*.8+i*r*.6,-r*.6,r*.35,r*1.2);for(const s of [-1,1])box(r*.1,s*r*1.05-r*.25,r*.7,r*.5,shade(m.color,.1),4,2);break;
    case 'blob':ctx.beginPath();for(let i=0;i<12;i++){const a=i/12*6.28,rr=r*(1+.1*Math.sin(t*4+i*1.3));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();fs(c);circ(-r*.2,-r*.2,r*.35,shade(m.color,.15),0);break;
    case 'spiky':for(let i=0;i<10;i++){const a=i/10*6.28;ctx.beginPath();ctx.moveTo(Math.cos(a-.2)*r*.8,Math.sin(a-.2)*r*.8);ctx.lineTo(Math.cos(a)*r*1.5,Math.sin(a)*r*1.5);ctx.lineTo(Math.cos(a+.2)*r*.8,Math.sin(a+.2)*r*.8);fs(shade(m.color,.1),1.5);}circ(0,0,r,c,2.5);break;
    case 'boss':{const pz=Math.sin(t*1.6)*4;ctx.strokeStyle=shade(m.color,-.2);ctx.lineWidth=9;for(let i=0;i<8;i++){const a=i/8*6.28+Math.sin(t+i)*.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a+.3)*r,Math.sin(a+.3)*r,Math.cos(a)*(r+28),Math.sin(a)*(r+28));ctx.stroke();}
      circ(0,0,r+pz,c,3);circ(0,0,r*.62,shade(m.color,-.35),2);for(let i=0;i<6;i++){const a=-1+i*.4;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.75,Math.sin(a)*r*.75);ctx.lineTo(Math.cos(a)*r*1.2,Math.sin(a)*r*1.2);ctx.lineTo(Math.cos(a+.14)*r*.75,Math.sin(a+.14)*r*.75);fs('#f0ece0',1.5);}
      ctx.fillStyle=m.eye;ctx.shadowColor=m.eye;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(r*.38,-12,6,0,7);ctx.arc(r*.38,12,6,0,7);ctx.fill();ctx.shadowBlur=0;break;}
    case 'warden':{ctx.rotate(-m.fa);const pz=Math.sin(t*2)*3;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(0,0,r*1.4,0,7);ctx.fill();
      for(let i=0;i<12;i++){const a=i/12*6.28+t*.3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.9,Math.sin(a)*r*.9);ctx.lineTo(Math.cos(a+.1)*(r*1.45+pz),Math.sin(a+.1)*(r*1.45+pz));ctx.lineTo(Math.cos(a+.2)*r*.9,Math.sin(a+.2)*r*.9);fs(m.phase===3?'#ff3b3b':shade(m.color,.3),2);}
      circ(0,0,r,c,4);circ(0,0,r*.7,shade(m.color,-.3),3);
      const cols=Object.values(FAM).map(f=>f.color);for(let i=0;i<6;i++){const a=i/6*6.28-t*.8;circ(Math.cos(a)*r*.5,Math.sin(a)*r*.5,6,cols[(i*2)%cols.length],1.5);}
      ctx.fillStyle=m.eye;ctx.shadowColor=m.eye;ctx.shadowBlur=20;ctx.beginPath();ctx.arc(0,-8,9,0,7);ctx.fill();ctx.shadowBlur=0;circ(0,-8,4,'#000',0);break;}
    default:circ(0,0,r,c,2.5);
  }
}
