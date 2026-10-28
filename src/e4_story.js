// ================= STORY MODE: chapters, choices, paths, Vance =================
const CHAPTERS=[
  {town:0,name:'Chapter 1 · Wake Up',goals:[
    ['Walk out of your shack',()=>S.flags.wentOut],['Go inside a building and search 3 containers',()=>tlog(0).searched>=3],['Unlock your first power (40% DNA)',()=>S.stats.powers>=1],
    ['Visit a survivor camp',()=>S.camps.some(c=>c.visited)||tlog(0).campsHelped.length>0],['Build the Boarded Cabin',()=>S.tier>=1],['Kill the Nest Mother in the water tower',()=>tlog(0).bossDead],['Drive to Saltmarsh',()=>(S.maxTown||0)>0]]},
  {town:1,name:'Chapter 2 · The Last Hunter',goals:[
    ['Meet the hunter at a Saltmarsh camp',()=>S.flags.metVance],['Decide what to do about Vance',()=>!!S.choices.vance],['Kill the Drowned Queen in the lighthouse',()=>tlog(1).bossDead||tlog(1).claimed],['Decide what to do with the Queen\'s heart',()=>!!S.choices.heart||tlog(1).claimed],['Move on to Frostfall',()=>(S.maxTown||0)>1]]},
  {town:2,name:'Chapter 3 · Cold Blood',goals:[
    ['Deal with both Frostfall camps (help or raid)',()=>tlog(2).campsHelped.length+tlog(2).campsRaided.length>=2],['Hear a rumor about the Warden at a camp',()=>S.flags.wardenRumor],['Kill the Hollow King at the Frozen Falls',()=>tlog(2).bossDead||tlog(2).claimed],['Decide what to do with his crown',()=>!!S.choices.crown||tlog(2).claimed],['Go to Hollow Dam',()=>(S.maxTown||0)>2]]},
  {town:3,name:'Chapter 4 · The Hollow Warden',goals:[['Defeat the Hollow Warden at the dam',()=>tlog(3).bossDead],['Cross into Red Mesa',()=>(S.maxTown||0)>3]]},
  {town:4,name:'Chapter 5 · Red Dust',goals:[['Kill the Scorpion King in the Dry Well',()=>tlog(4).bossDead||tlog(4).claimed],['Decide what to do with the well',()=>!!S.choices.well||tlog(4).claimed],['Move on to Old Haven',()=>(S.maxTown||0)>4]]},
  {town:5,name:'Chapter 6 · The Broadcast',goals:[['Destroy the Broadcast at the radio tower',()=>tlog(5).bossDead||tlog(5).claimed],['Decide what to do with the signal',()=>!!S.choices.signal||tlog(5).claimed],['Go to Mesa Gate',()=>(S.maxTown||0)>5]]},
  {town:6,name:'Chapter 7 · The Mesa Warden',goals:[['Defeat the Mesa Warden',()=>tlog(6).bossDead]]}
];
const CHOICES={
  vance:{title:'Vance, the Last Hunter',text:'A tall man in a white coat is sharpening a machete by the fire. Blue light crawls over his knuckles. "You absorb too," he says without looking up. "I can smell it on you. So. Are we going to have a problem?"',
    opts:[{id:'ally',label:'Team up with him',need:()=>S.humanity>=50,needTxt:'He won\'t trust you below 50 humanity',eff:'He fights beside you. Leans you toward the hidden Splicer path.'},
      {id:'refuse',label:'Go your own way',eff:'He leaves. You\'ll probably see him again. Leans Hunter.'},
      {id:'fight',label:'Fight him for his DNA',eff:'He\'s strong and he can steal your powers. If you win, you get his DNA. Leans Apex.'}]},
  heart:{title:'The Queen\'s Heart',text:'The Drowned Queen\'s heart is still beating in your hand, cold and salty. It\'s packed with more DNA than anything you\'ve ever touched.',
    opts:[{id:'absorb',label:'Absorb it',eff:'Tidal Wave jumps to 150%. Costs 40 humanity. Might turn you. Leans Apex.'},
      {id:'destroy',label:'Destroy it',eff:'+20 humanity and +1 life. Leans Hunter.'},
      {id:'share',label:'Share it with Vance',need:()=>S.choices.vance==='ally'&&S.vance&&!S.vanceGone,needTxt:'Needs Vance as your ally',eff:'You both get stronger. Leans Splicer.'}]},
  crown:{title:'The Hollow King\'s Crown',text:'The crown is made of ice that doesn\'t melt. When you hold it, you can hear the King\'s thoughts. He was so lonely.',
    opts:[{id:'wear',label:'Wear it',eff:'Absolute Zero jumps to 150%. Costs 20 humanity. Leans Apex.'},{id:'bury',label:'Bury it',eff:'+10 humanity and +1 life. Leans Hunter.'},
      {id:'give',label:'Give it to Vance',need:()=>S.choices.vance==='ally'&&S.vance&&!S.vanceGone,needTxt:'Needs Vance as your ally',eff:'Vance\'s attacks freeze. Leans Splicer.'}]},
  well:{title:'The Dry Well',text:'With the Scorpion King dead, water starts seeping back into the well. Both camps are watching you.',
    opts:[{id:'poison',label:'Poison the well',eff:'+5 mutagen. The camps here hate you. Leans Apex.'},{id:'clean',label:'Clean the well',eff:'+10 humanity. Camps trust you a lot more. Leans Hunter.'}]},
  signal:{title:'The Signal',text:'The Broadcast is dead, but the tower is still sending one word into your head: "Come." It\'s coming from past the coast. From the Source.',
    opts:[{id:'answer',label:'Answer the call',eff:'Costs 30 humanity. Something answers back. Leans Apex.'},{id:'cut',label:'Cut the signal',eff:'+1 life. Leans Hunter.'},
      {id:'record',label:'Record it for Vance',need:()=>S.choices.vance==='ally'&&S.vance&&!S.vanceGone,needTxt:'Needs Vance as your ally',eff:'He can trace it to the Source. Leans Splicer.'}]}
};
function pathScores(){const p=S.path,h=S.humanity,hyb=Object.keys(S.dna).filter(id=>POWERS[id]&&POWERS[id].hybrid&&S.dna[id]>0).length;
  return {Hunter:p.hunter+(h-50)/12,Apex:p.apex+(50-h)/12+(S.mode==='monster'?6:0),Splicer:p.splicer+hyb*.6+(S.choices.vance==='ally'&&!S.vanceGone?2:0)};}
function pathName(){if(S.mode==='monster')return 'Apex';const s=pathScores();return Object.keys(s).sort((a,b)=>s[b]-s[a])[0];}
/* curChapter: replaced later */
function nextGoal(){const ch=curChapter();const g=ch.goals.find(g=>!g[1]());return g?g[0]:null;}
function showChoice(key){
  const C=CHOICES[key];if(!C||S.choices[key])return;
  showOv(`<div class="card story"><div class="eyebrow">A choice · ${pathName()} path so far</div><h1 style="font-size:clamp(40px,7vw,72px)">${C.title}</h1><p>${C.text}</p>
  <div style="display:grid;gap:10px;margin-top:8px">${C.opts.map(o=>{const ok=!o.need||o.need();return `<button class="btn ${ok?'':'ghost'}" data-a="choice" data-c="${key}" data-o="${o.id}" ${ok?'':'disabled'} style="text-align:left;text-transform:none;letter-spacing:0;font-size:19px;line-height:1.25">${o.label}<br><span style="font-weight:500;font-size:15px;opacity:.85">${ok?o.eff:o.needTxt}</span></button>`;}).join('')}</div></div>`,'story');
}
function applyChoice(key,o){
  S.choices[key]=o;const P=S.path;
  if(key==='vance'){
    if(o==='ally'){P.splicer+=2;spawnVance();banner('VANCE JOINS YOU','"Don\'t make me regret this." He fights beside you now.','#7fd6ff');}
    else if(o==='refuse'){P.hunter+=1;toast('"Suit yourself." Vance disappears into the reeds.');}
    else{P.apex+=2;spawnRival();S.rival.hunterDuel=true;}
  }
  if(key==='heart'){if(o==='absorb'){P.apex+=3;S.dna.wave=150;humanityHit(40);}if(o==='destroy'){P.hunter+=3;S.humanity=Math.min(100,S.humanity+20);S.lives=Math.min(S.maxLives+1,S.lives+1);}
    if(o==='share'){P.splicer+=3;S.dna.wave=120;if(S.vance){S.vance.maxHp+=80;S.vance.hp=S.vance.maxHp;S.vance.wave=true;}}}
  if(key==='crown'){if(o==='wear'){P.apex+=2;S.dna.zero=150;humanityHit(20);}if(o==='bury'){P.hunter+=2;S.humanity=Math.min(100,S.humanity+10);S.lives=Math.min(S.maxLives+1,S.lives+1);}
    if(o==='give'){P.splicer+=2;if(S.vance)S.vance.freeze=true;}}
  if(key==='well'){if(o==='poison'){P.apex+=2;S.res.mutagen+=5;S.camps.forEach(c=>c.rep-=30);}else{P.hunter+=2;S.humanity=Math.min(100,S.humanity+10);S.camps.forEach(c=>c.rep+=30);}}
  if(key==='signal'){if(o==='answer'){P.apex+=3;humanityHit(30);}else if(o==='cut'){P.hunter+=3;S.lives=Math.min(S.maxLives+1,S.lives+1);}else P.splicer+=3;}
  toast('Your path is leaning '+pathName()+'. Press J to see your journal.','mem');
}
function afterBossStory(){
  if(S.mode!=='hunter')return;
  const key={1:'heart',2:'crown',4:'well',5:'signal'}[S.town];
  if(S.town===0)showJournal();else if(key&&S.story)showChoice(key);
}
// ---------- Vance ally ----------
function spawnVance(){S.vance={x:S.P.x+30,y:S.P.y,sc:S.P.sc,r:15,hp:220,maxHp:220,cd:0,cd2:3,fa:0,down:0};}
function updateVance(dt){
  const V=S.vance,P=S.P;if(!V)return;
  if(S.mode==='monster'&&pathName()!=='Splicer'&&!V.stays){S.vance=null;S.vanceGone=true;toast('Vance looks at what you\'ve become for a long time. Then he walks away.','bad');return;}
  if(V.down>0){V.down-=dt;if(V.down<=0){V.hp=V.maxHp;teleport(V,P.x+30,P.y,P.sc);toast('Vance is back on his feet.','good');}return;}
  if(V.sc!==P.sc||dist(V,P)>700){teleport(V,P.x+rnd(-30,30),P.y+rnd(-30,30),P.sc);}
  V.cd-=dt;V.cd2-=dt;
  const e=nearestFoe(V,360);
  if(e){V.fa=Math.atan2(e.y-V.y,e.x-V.x);
    if(V.cd<=0){V.cd=.8;S.proj.push({x:V.x,y:V.y,vx:Math.cos(V.fa)*560,vy:Math.sin(V.fa)*560,r:5,dmg:13,owner:'p',life:.75,color:'#7fd6ff',sc:V.sc,st:V.freeze?'slow':null});}
    if(V.cd2<=0){V.cd2=6;let cur=V;const hit=[];for(let k=0;k<4;k++){const t=nearestFoe(cur,220,hit);if(!t)break;hit.push(t);addFx({type:'bolt',x:cur.x,y:cur.y,x2:t.x,y2:t.y,life:.25,color:'#7fd6ff'});dmgFoe(t,18,null,false,{st:V.freeze?'freeze':null});cur=t;}
      if(V.wave){S.proj.push({x:V.x,y:V.y,vx:Math.cos(V.fa)*380,vy:Math.sin(V.fa)*380,r:50,dmg:25,owner:'p',life:1,color:'#5fd3e8',pierce:true,hit:[],wave:true,knock:.15,sc:V.sc});}}}
  const tx=P.x-Math.cos(P.face)*50,ty=P.y-Math.sin(P.face)*50,d=Math.hypot(tx-V.x,ty-V.y);
  if(d>30){V.x+=(tx-V.x)/d*Math.min(d*3,220)*dt;V.y+=(ty-V.y)/d*Math.min(d*3,220)*dt;if(!e)V.fa=Math.atan2(ty-V.y,tx-V.x);}
  pushOut(V,solidsFor(V.sc));
  S.enemies.forEach(m=>{if(!m.dead&&m.kind==='monster'&&m.sc===V.sc&&dist(m,V)<m.r+V.r+6&&m.atkCd>.8&&Math.random()<dt*.6){V.hp-=m.dmg;if(V.hp<=0){V.down=30;toast('Vance is down! He\'ll get back up in 30 seconds.','bad');}}});
}
function drawVance(){
  const V=S.vance;if(!V||V.sc!==S.P.sc||V.down>0)return;
  ctx.save();ctx.translate(V.x,V.y);ctx.strokeStyle='#7fd6ff';ctx.globalAlpha=.35+.2*Math.sin(S.t*5);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,V.r+7,0,7);ctx.stroke();ctx.globalAlpha=1;
  ctx.rotate(V.fa);box(4,1,V.r+14,5,'#7fd6ff',1,1.5);circ(0,0,V.r,'#e8e8e8');circ(2,0,V.r*.52,'#e8c09a',2);ctx.fillStyle='#ddd';ctx.beginPath();ctx.arc(-1,0,V.r*.5,Math.PI*.5,Math.PI*1.5);ctx.fill();ctx.restore();
  label('VANCE (ALLY)',V.x,V.y-V.r-16,'#7fd6ff',13);if(V.hp<V.maxHp)hpBar(V.x,V.y-V.r-10,40,V.hp/V.maxHp,'#7fd6ff');
}
function vanceCampHook(c){
  if(S.town!==1||S.flags.metVance||!S.story||S.mode!=='hunter')return;
  S.flags.metVance=true;setTimeout(()=>{if(S&&S.mode==='hunter'&&!ovMode)showChoice('vance');else if(S)S.pendingVance=1;},600);
}
// ---------- journal ----------
function openJournal(){openPanel('journal');}
function journalHtml(){
  const sc=pathScores(),tot=Object.values(sc).reduce((a,b)=>a+Math.max(0,b),0)||1,p=pathName();
  const chs=CHAPTERS.filter(c=>c.town<=S.town).map(ch=>{const done=ch.goals.every(g=>g[1]());const cur=ch===curChapter();
    return `<section style="margin-bottom:10px;${cur?'border-color:var(--gold)':''}"><h3 style="color:${cur?'var(--gold)':done?'var(--toxic)':'var(--muted)'}">${done?'✅ ':''}${ch.name}${cur?' · NOW':''}</h3>
    ${cur||!done?ch.goals.map(g=>`<div class="act"><div>${g[1]()?'✅':'⬜'} ${g[0]}</div></div>`).join(''):''}</section>`;}).reverse().join('');
  const bar=(n,c,d)=>`<div style="margin:6px 0"><div class="row" style="justify-content:space-between"><b style="color:${c}">${n}${p===n?' ◀ you':''}</b><small class="mute">${d}</small></div><div class="dbar"><i style="width:${Math.max(4,100*Math.max(0,sc[n])/tot)}%;background:${c}"></i></div></div>`;
  return `<div class="card">${head('Journal · J to close',S.story?'Your Story':'Your Goals')}
    ${S.story?`<section style="margin:10px 0"><h3>Your path</h3>${bar('Hunter','#7fc8ff','Stay human. Protect people. Find the cure.')}${bar('Apex','#c27bff','Embrace the hunger. Take everything.')}${bar('Splicer','#ffd166','Balance both. Trust Vance. The hidden ending.')}
    <p class="mute" style="margin:8px 0 0">Your humanity, your choices, the camps you help or raid, and the hybrids you splice all push your path.</p></section>`:''}
    ${chs}</div>`;
}
