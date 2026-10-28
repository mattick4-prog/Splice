// ================= HUD =================
function txt(t,x,y,size,col,align,weight){ctx.font=(weight||600)+' '+size+'px "Barlow Condensed",sans-serif';ctx.textAlign=align||'left';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y);}
function bar(x,y,w,h,frac,col,lab){ctx.fillStyle='rgba(0,0,0,.6)';rrect(ctx,x,y,w,h,3);ctx.fill();ctx.fillStyle=col;if(frac>0){rrect(ctx,x,y,Math.max(6,w*clamp(frac,0,1)),h,3);ctx.fill();}
  if(lab)txt(lab,x+6,y+h-3,h-2,'#fff');}
function panelBg(x,y,w,h){ctx.fillStyle='rgba(14,17,15,.78)';rrect(ctx,x,y,w,h,8);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;ctx.stroke();}
function promptText(){
  const P=S.P;if(P.dead)return 'Respawning in '+Math.ceil(P.respawnT)+'…';
  if(S.mode==='monster')return S.atBase?'B · Evolve     Tab · Powers':'';
  if(P.car){const CT=CARTYPES[P.car.type];return 'Driving the '+CT.name+' · Space: '+(CT.siren?'siren':CT.music?'jingle':'honk')+' · E: get out';}
  if(P.hidden)return 'Hiding in the car · E: get out';
  const h=S.holdTarget;
  if(h){const nm=h.kind==='car'?(h.tgt.wreck?'wrecked car':CARTYPES[h.tgt.type].name):PROPS[h.tgt.type].name;return 'Hold E to search the '+(h.kind==='car'?'trunk of the ':'')+nm.toLowerCase()+(S.hold?'…':'');}
  if(P.sc==='out'){const c=nearCar();if(c&&c.drivable&&S.keys[c.id]&&!c.wreck)return '🔑 E: drive the '+CARTYPES[c.type].name;if(c&&c.searched){if(c.drivable&&S.keys[c.id])return 'E: drive the '+CARTYPES[c.type].name;if(c.hp>0)return 'E: hide in the car'+(c.drivable?' (find its keys to drive it)':'');}}
  if(P.sc==='out'){const cp=nearCamp();if(cp&&!cp.hostile)return 'E: talk to '+cp.leader+' at '+cp.name;}
  if(P.sc!=='out'&&P.sc!=='base'){const st=nearStation();if(st)return 'E: use the '+st.name;}
  if(P.sc==='base'){const wi=nearWindow();if(wi>=0)return 'E: board up the window (1 wood)';const st=nearStation();if(st)return 'E: use the '+st.name;}
  if(P.sc!=='out'&&P.sc!=='base'){const I=S.interiors[P.sc];if(I.props.some(p=>!p.dead&&PROPS[p.type].brk&&rectDist(P,p)<70))return 'Attack furniture to smash it for materials';}
  return '';
}
function objective(){
  if(S.pendingTurn)return '…';
  if(S.helpCall&&S.helpCall.active&&S.helpCall.town===S.town)return '🆘 Save '+S.helpCall.name+': kill the monsters attacking it!';
  if(S.story&&S.mode==='hunter'){const g=nextGoal();if(g)return 'Goal: '+g+'  (J for journal)';}
  const TT=TOWNS[S.town];if(TT.arena)return tlog().bossDead?(TOWNS[S.town+1]?(S.mode==='monster'?'Migrate onward from your nest (B).':'Go to the Garage 🔧 and drive onward.'):'You did it.'):'Defeat '+MONSTERS[TT.boss].name+'. It waits at the top of the map.';
  if(S.mode==='monster'&&tlog().claimed)return TOWNS[S.town+1]?'Claimed. Go to your nest and press B to migrate to '+TOWNS[S.town+1].name+'.':'Claimed.';
  if(S.mode==='monster'){const left=S.blds.filter(b=>b.outpost&&!b.fallen).length;
    if(S.rival)return 'Vance is hunting you. Watch for the red siphon circle.';
    if(!left&&!S.rivalDone)return 'Something is coming…';
    return S.night?'Break the outposts. '+left+' still standing.':'Defend the nest from the purge party, or strike while they are away.';}
  if(S.pendingTurn)return '…';
  if(S.night)return S.P.sc==='base'?'Guard the windows until dawn. Press E at a broken window to board it up.':'Night. Get back inside your base, or hunt for richer DNA.';
  const T=TOWNS[S.town],next=TIERS[S.tier+1];
  if(S.mode==='hunter'&&S.town<(S.maxTown||0)&&S.bossDead)return 'Back in '+TOWNS[S.town].name+'. Put '+FUEL_NEED+' fuel in the truck at the Garage 🔧 when you want to drive somewhere else.';
  if(S.bossDead&&TOWNS[S.town+1]&&S.truck)return truckReady()?'The truck is ready. Go to the Garage 🔧 and drive to '+TOWNS[S.town+1].name+'.':'Fix the truck at the Garage 🔧. Still need '+truckNeed()+'.';
  if(next){const need=Object.keys(next.cost).filter(k=>S.res[k]<next.cost[k]).map(k=>(next.cost[k]-S.res[k])+' '+k);
    return need.length?'Next: '+next.name+'. Need '+need.join(', ')+'.':'You have everything for the '+next.name+'. Build it at the workbench.';}
  return S.bossDead?'The boss is dead. Hold out, or let the hunger win.':'Kill '+MONSTERS[T.boss].name+' in '+T.lair+'.';
}
function drawHUD(){
  const P=S.P,mon=S.mode==='monster',small=VW<720;hudTips();
  // status
  panelBg(12,12,256,mon?112:128);
  bar(22,22,236,18,P.hp/maxHp(),'#ff5a68','HP '+Math.max(0,Math.round(P.hp))+' / '+maxHp());
  if(!mon){
    txt('❤'.repeat(Math.max(0,S.lives))+'♡'.repeat(Math.max(0,3-S.lives)),22,60,20,'#ff5a68','left',700);txt(S.lives+(S.lives===1?' LIFE':' LIVES'),96,58,14,'#d8d2c6','left',600);
    bar(22,68,236,14,S.humanity/100,S.humanity>50?'#7fc8ff':S.humanity>25?'#a08cff':'#c27bff','HUMANITY '+Math.round(S.humanity));
    bar(22,88,236,14,S.baseHp/baseMax(),'#b8e04a',TIERS[S.tier].name.toUpperCase()+' '+Math.round(S.baseHp));
    txt(S.starving?'STARVING: eat something':P.sc==='base'?'Inside your base':P.sc==='out'?'Outside':'Inside '+S.interiors[P.sc].bld.name,22,120,15,S.starving?'#ff5a68':'#b8b2a4');
  }else{bar(22,46,236,14,S.fear/100,'#ff7a2f','FEAR '+Math.round(S.fear)+'%');
    bar(22,66,236,14,S.nestHp/NEST_MAX,'#c27bff',S.nestDead?'NEST BURNED':'NEST '+Math.round(S.nestHp));
    txt('🧬 '+S.biomass+' biomass'+(S.atBase?'  ·  B to evolve':''),22,102,16,'#d6a0ff');}
  // clock & objective
  const len=S.night?NIGHT_LEN:DAY_LEN,cx=VW/2,bm=S.bloodMoon&&S.night;
  const L0=tlog();txt((L0.liberated?'🛡️ ':L0.claimed?'🕷️ ':'')+TOWNS[S.town].name.toUpperCase()+' · '+(bm?'BLOOD MOON ':mon?(S.night?'HUNT ':'DAY '):(S.night?'NIGHT ':'DAY '))+S.day,cx,34,small?20:26,bm?'#ff3b3b':S.night?'#7fc8ff':'#ffd166','center',700);
  bar(cx-90,42,180,6,1-S.clock/len,S.night?'#7fc8ff':'#ffd166');
  txt(objective(),cx,68,small?14:17,'#efe9dc','center',500);
  activeJobs().slice(0,3).forEach((j,i)=>{hov(VW/2-260,76+i*19,520,19,'Survivor job',j.state==='done'?'Finished! Go back to the camp for your reward.':'A job from a survivor camp. Do it to earn their trust and a reward.');txt((j.state==='done'?'✅ Job done: return to '+campOf(j.camp).name:'📋 '+jobText(j)),cx,90+i*19,small?13:15,j.state==='done'?'#7dff9a':'#ffd166','center',600);});
  // resources
  let ry=12;
  if(!mon){const ks=Object.keys(S.res);let x=VW-16;
    for(let i=ks.length-1;i>=0;i--){const k=ks[i],s=RES_ICON[k]+' '+S.res[k];ctx.font='600 18px "Barlow Condensed",sans-serif';const w=ctx.measureText(s).width+14;
      panelBg(x-w,ry,w-4,28);hov(x-w,ry,w-4,28,RES_ICON[k]+' '+RES_INFO[k][0]+': '+S.res[k],RES_INFO[k][1]);txt(s,x-11,ry+20,18,'#efe9dc','right');x-=w;}
    ry+=36;
    // DNA tracker
    const ids=Object.keys(S.dna).filter(id=>{const g=geneInfo(id);return g&&!g.hybrid&&S.dna[id]>0&&S.dna[id]<(g.trait?100:150);}).sort((a,b)=>S.dna[b]-S.dna[a]).slice(0,4);
    if(!small){const w=220,x0=VW-16-w,hh=44+ids.length*30;panelBg(x0,ry,w,hh);hov(x0,ry,w,40,'🧪 DNA Vault: '+S.vault.length+' of '+vaultCap()+' strands','Strands you picked up from dead monsters. Press Tab to use them. Raw strands spoil after 3 days.');
      txt('🧪 VAULT '+S.vault.length+'/'+vaultCap(),x0+10,ry+18,15,S.vault.length?'#ffd166':'#a39e91','left',700);txt('Tab: DNA',x0+w-10,ry+18,13,'#a39e91','right');
      if(S.vault.length&&S.vault.some(v=>v.age>=3&&S.tier<3))txt('strands spoil soon!',x0+10,ry+34,12,'#ff8a95');
      else txt(ids.length?'Sequencing progress':'Kill monsters for DNA strands',x0+10,ry+34,12,'#a39e91');
      ids.forEach((id,i)=>{const p=geneInfo(id),y=ry+42+i*30,pct=S.dna[id],mx=p.trait?100:150;hov(x0,y,w,28,p.icon+' '+p.name+': '+Math.round(pct)+'% DNA',(p.trait?'Unlocks at 100%. ':'The lines mark 40% (weak version unlocks) and 100% (full power). 150% is mastered. ')+(p.desc||''));
        txt(p.icon+' '+p.name,x0+10,y+12,14,p.color);txt(Math.round(pct)+'%',x0+w-10,y+12,14,'#efe9dc','right',700);
        ctx.fillStyle='#000';ctx.fillRect(x0+10,y+17,w-20,5);ctx.fillStyle=p.color;ctx.fillRect(x0+10,y+17,(w-20)*Math.min(1,pct/mx),5);
        ctx.fillStyle='rgba(255,255,255,.7)';if(!p.trait){ctx.fillRect(x0+10+(w-20)*.266,y+15,1.5,9);ctx.fillRect(x0+10+(w-20)*.666,y+15,1.5,9);}});}
  }else{panelBg(VW-206,12,190,28);txt('Outposts fallen '+S.stats.outposts+'/'+TOWNS[S.town].outposts.length,VW-24,32,18,'#ff7a2f','right');}
  const hid=!!P.hidden&&!mon;
  if(!hid){
  // power slots
  const sw=small?58:72,gap=10,sx=VW/2-(3*sw+2*gap)/2,sy=VH-sw-22;
  for(let i=0;i<3;i++){const id=S.slots[i],x=sx+i*(sw+gap),p=id?POWERS[id]:null;
    ctx.fillStyle='rgba(14,17,15,.85)';rrect(ctx,x,sy,sw,sw,10);ctx.fill();ctx.strokeStyle=p?p.color:'#3a3a3a';ctx.lineWidth=2.5;ctx.stroke();
    txt(String(i+1),x+7,sy+16,14,'#a39e91',null,700);
    hov(x,sy,sw,sw,p?'Key '+(i+1)+': '+p.icon+' '+p.name+' ('+stageName(id)+')':'Key '+(i+1)+': empty',p?p.desc+' Cooldown '+Math.round(p.cd*10)/10+'s. Press '+(i+1)+' to use it.'+((S.gmods[id]||[]).length?' Gene mods: '+S.gmods[id].map(m=>GMODS[m].icon+' '+GMODS[m].name).join(', ')+'.':''):'Press Tab and put a power on this key.');
    if(p){ctx.font=(small?22:30)+'px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(p.icon,x+sw/2,sy+sw/2+10);
      txt(lvlName(id),x+sw-6,sy+15,11,p.color,'right',700);
      ctx.fillStyle='#000';ctx.fillRect(x+6,sy+sw-9,sw-12,4);ctx.fillStyle=p.color;ctx.fillRect(x+6,sy+sw-9,(sw-12)*Math.min(1,(S.dna[id]||0)/150),4);
      const cd=S.cds[id]||0;if(cd>0){const fr=cd/(p.cd*(level(id)<1?1.3:1));ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(x+2,sy+2+(sw-4)*(1-fr),sw-4,(sw-4)*fr);txt(cd.toFixed(1),x+sw/2,sy+sw/2+6,18,'#fff','center',700);}
      if(!small)txt(p.name,x+sw/2,sy-6,13,'#d8d2c4','center');
      (S.gmods[id]||[]).forEach((md,k)=>{txt(GMODS[md].icon,x+8+k*16,sy+sw-12,11,'#fff','left');});}
    else{txt('Tab',x+sw/2,sy+sw/2+5,14,'#6a665e','center');}
  }
  // traits
  S.traits.forEach((id,i)=>{const t=id&&TRAITS[id],x=sx+3*(sw+gap)+i*(sw*.62+6),s2=sw*.62,y=sy+sw-s2;
    hov(x,y,s2,s2,t?'Trait: '+t.icon+' '+t.name:'Trait slot '+(i+1)+': empty',t?t.desc+' Always on.':'Traits are always-on bonuses. Unlock one at 100% DNA, then wear it from Tab.');ctx.fillStyle='rgba(14,17,15,.85)';rrect(ctx,x,y,s2,s2,8);ctx.fill();ctx.strokeStyle=t&&hasTrait(id)?FAM[t.fam].color:'#3a3a3a';ctx.lineWidth=2;ctx.stroke();
    if(t){ctx.font=(small?16:22)+'px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(t.icon,x+s2/2,y+s2/2+8);}else txt('T'+(i+1),x+s2/2,y+s2/2+5,12,'#6a665e','center');});
  if(!small)txt('Traits',sx+3*(sw+gap)+sw*.62+3,sy+sw-sw*.62-6,13,'#a39e91','center');
  // weapon
  if(!mon){const W=WEAPONS[S.weapons[S.wpn]],wx=sx-(small?78:96),ww=small?68:86;
    hov(wx,sy,ww,sw,'Weapon: '+W.icon+' '+W.name,(W.ranged?'Uses ammo ('+S.res.ammo+' left). ':'Melee, no ammo needed. ')+'Click or Space to attack.'+(S.weapons.length>1?' Q switches weapons.':''));ctx.fillStyle='rgba(14,17,15,.85)';rrect(ctx,wx,sy,ww,sw,10);ctx.fill();ctx.strokeStyle='#ffd166';ctx.lineWidth=2;ctx.stroke();
    ctx.font=(small?22:28)+'px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(W.icon,wx+ww/2,sy+sw/2+6);
    txt(W.ranged?S.res.ammo+' ammo':'melee',wx+ww/2,sy+sw-8,12,W.ranged&&S.res.ammo<=0?'#ff8a95':'#d8d2c4','center');
    if(!small)txt(W.name+(S.weapons.length>1?' · Q':''),wx+ww/2,sy-6,13,'#ffd166','center');}
  // prompt
  const pr=promptText();
  if(pr){ctx.font='700 18px "Barlow Condensed",sans-serif';const w=ctx.measureText(pr).width+28;panelBg(VW/2-w/2,sy-58,w,30);txt(pr,VW/2,sy-37,18,'#ffd166','center',700);}
  if(S.hold){const w=160;ctx.fillStyle='#000';ctx.fillRect(VW/2-w/2,sy-24,w,6);ctx.fillStyle='#ffd166';ctx.fillRect(VW/2-w/2,sy-24,w*S.hold.t/1.2,6);}
  // log
  const now=S.t;let ly=VH-24-(small?sw+80:0);
  for(let i=S.log.length-1;i>=0;i--){const l=S.log[i],age=now-l.t;if(age>9)continue;ctx.globalAlpha=Math.min(1,(9-age)/1.5);
    const col=l.kind==='bad'?'#ff9aa4':l.kind==='good'?'#c8f060':l.kind==='mem'?'#d6a0ff':'#e2dccf';
    const nl=wrapTxt(l.text,16,ly,small?VW-32:Math.min(430,VW/2-(3*sw)/2-150),col);ly-=18*nl+6;}
  ctx.globalAlpha=1;
  // minimap
  if(!small)drawMinimap();
  drawKeyGuide();
  }
  // banner
  if(S.banners.length){const b=S.banners[0],a=Math.min(1,b.life*2,(3.4-b.life)*4);ctx.globalAlpha=Math.max(0,a);
    const by=VH*.26;ctx.fillStyle='rgba(8,9,9,.66)';ctx.fillRect(0,by-54,VW,b.sub?96:68);
    ctx.font=(small?30:48)+'px "Creepster",Impact,fantasy';ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(b.text,VW/2,by);ctx.fillStyle=b.col;ctx.fillText(b.text,VW/2,by);
    if(b.sub)wrapTxt(b.sub,VW/2,by+28,Math.min(760,VW-40),'#efe9dc',true,18);ctx.globalAlpha=1;}
  if(S.paused){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,VW,VH);ctx.font='64px "Creepster",Impact';ctx.textAlign='center';ctx.fillStyle='#b8e04a';ctx.fillText('PAUSED',VW/2,VH/2);txt('Press P to resume',VW/2,VH/2+36,20,'#efe9dc','center');}
}
function drawMinimap(){
  const P=S.P,mw=200,mx=VW-mw-16;
  if(P.sc==='out'){
    const mh=mw*WH/WW,my=VH-mh-16,k=mw/WW;
    panelBg(mx-5,my-5,mw+10,mh+10);hov(mx,my,mw,mh,'Map of town','White dot = you · bright green = your base · ⛺ = survivor camp · 🔑 = car you have keys for · yellow ! = job · red dots = monsters · yellow dots = humans · purple building = boss · 🔧 = garage · 🔩 = a truck part is in there. Press M for the big map.');
    ctx.fillStyle=TOWNS[S.town].ground;ctx.fillRect(mx,my,mw,mh);drawMiniTown(mx,my,k);
    S.blds.forEach(b=>{ctx.fillStyle=b.boss?'#7a3aa6':S.mode==='monster'&&b.outpost?(b.fallen?'#4a3020':'#3a7ab0'):b.awake?'#3a3028':(b.roof||'#555');ctx.fillRect(mx+b.x*k,my+b.y*k,b.w*k,b.h*k);});
    ctx.fillStyle=S.mode==='monster'?'#c27bff':'#d6ff70';ctx.fillRect(mx+BASE.x*k-4,my+BASE.y*k-3,8,6);
    S.camps.forEach(c=>{ctx.font='13px sans-serif';ctx.textAlign='center';ctx.globalAlpha=c.raided?.4:1;ctx.fillText('⛺',mx+c.x*k,my+c.y*k+5);ctx.globalAlpha=1;if(!c.raided&&S.mode==='hunter'){ctx.strokeStyle=c.hostile?'#ff5a68':wTier(c).col;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(mx+c.x*k,my+c.y*k,7,0,7);ctx.stroke();}});
    {const g=S.blds.find(b=>b.garage);if(g){ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('🔧',mx+(g.x+g.w/2)*k,my+(g.y+g.h/2)*k+5);}}
    if(S.truck)Object.keys(S.truck.parts).forEach(id=>{if(S.truck.parts[id]!=='missing')return;const w=S.truck.where[id];const b=w==='boss'?S.blds.find(b=>b.boss):S.blds.find(b=>b.id===w);if(!b)return;ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText('🔩',mx+(b.x+b.w)*k-2,my+b.y*k+8);});
    S.jobs.forEach(j=>{if(j.state!=='active'||!j.bld)return;const b=S.blds.find(x=>x.id===j.bld);if(b){ctx.fillStyle='#ffd166';ctx.font='700 12px sans-serif';ctx.textAlign='center';ctx.fillText('!',mx+(b.x+b.w/2)*k,my+(b.y+b.h/2)*k+4);}});
    if(S.mode==='hunter')S.cars.forEach(c=>{if(c.drivable&&S.keys[c.id]){ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText('🔑',mx+c.x*k,my+c.y*k+4);}else{ctx.fillStyle='rgba(30,30,30,.7)';ctx.fillRect(mx+c.x*k-2,my+c.y*k-1.5,4,3);}});
    if(crewHas('scout')||hasTrait('echo'))S.blds.forEach(b=>{const I=S.interiors[b.id];if(!I)return;const n=I.props.filter(p=>!p.dead&&PROPS[p.type].cont&&!p.searched).length+S.enemies.filter(e=>e.sc===b.id).length*0;if(n){ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(n+'📦',mx+(b.x+b.w/2)*k,my+(b.y+b.h)*k+9);}});
    S.enemies.forEach(e=>{if(e.sc!=='out')return;ctx.fillStyle=e.isRival?'#7fd6ff':e.stolen.length?(POWERS[e.stolen[0]]?POWERS[e.stolen[0]].color:'#fff'):e.kind==='human'?'#ffd166':e.boss?'#ff7be0':'#ff4d5e';const s=e.boss||e.isRival?6:3.5;ctx.fillRect(mx+e.x*k-s/2,my+e.y*k-s/2,s,s);});
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(mx+P.x*k,my+P.y*k,3.5,0,7);ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke();
    const cam=getCam();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.strokeRect(mx+cam.x*k,my+cam.y*k,cam.vw*k,cam.vh*k);
  }else{
    const I=sceneObj(P.sc),k=mw/I.w,mh=I.h*k,my=VH-mh-16;
    panelBg(mx-5,my-22,mw+10,mh+27);hov(mx,my-22,mw,mh+22,'Map of this room','White dot = you · yellow = things to search · green = stations you can use · red bar = exit · red dots = monsters.');txt(P.sc==='base'?'YOUR BASE':I.bld.name.toUpperCase(),mx,my-7,13,'#a39e91');
    ctx.fillStyle='#5a5048';ctx.fillRect(mx,my,mw,mh);
    I.props.forEach(p=>{if(p.dead)return;ctx.fillStyle=PROPS[p.type].cont&&!p.searched?'#ffd166':'#8a7a68';ctx.fillRect(mx+(p.x-I.x)*k,my+(p.y-I.y)*k,Math.max(2,p.w*k),Math.max(2,p.h*k));});
    (I.stations||[]).forEach(s=>{ctx.fillStyle='#d6ff70';ctx.fillRect(mx+(s.x-I.x)*k,my+(s.y-I.y)*k,s.w*k,s.h*k);});
    ctx.fillStyle='#c84a3a';ctx.fillRect(mx+(I.door.x-I.x)*k-8,my+mh-3,16,3);
    S.enemies.forEach(e=>{if(e.sc!==P.sc)return;ctx.fillStyle='#ff4d5e';ctx.fillRect(mx+(e.x-I.x)*k-2,my+(e.y-I.y)*k-2,4,4);});
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(mx+(P.x-I.x)*k,my+(P.y-I.y)*k,3.5,0,7);ctx.fill();
  }
}
function wrapTxt(t,x,y,maxW,col,center,size){size=size||16;ctx.font='500 '+size+'px "Barlow Condensed",sans-serif';
  if(ctx.measureText(t).width<=maxW){txt(t,x,y,size,col,center?'center':'left',500);return 1;}
  const words=t.split(' ');let line='';const lines=[];words.forEach(w=>{const tl=line?line+' '+w:w;if(ctx.measureText(tl).width>maxW&&line){lines.push(line);line=w;}else line=tl;});lines.push(line);
  if(!center){lines.slice().reverse().forEach((l,i)=>txt(l,x,y-i*18,size,col,'left',500));}else lines.slice(0,2).forEach((l,i)=>txt(l,x,y+i*20,size,col,'center',500));return lines.length;}

// ================= LOOP =================
let last=performance.now();
let crashMsgs={};
function crashNote(where,e){const k=where+':'+(e&&e.message);if(crashMsgs[k])return;crashMsgs[k]=1;console.error('[Splice]',where,e);
  try{toast('⚠️ Something glitched ('+where+'). The game kept going. If it acts weird, save and reload.','bad');}catch(_){}}
function frame(now){try{frameInner(now);}catch(e){crashNote('frame',e);}requestAnimationFrame(frame);}
function frameInner(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;pollPad();
  HOV.length=0;
  if(S&&!ovMode&&!S.paused&&(S.mode==='hunter'||S.mode==='monster')){try{update(dt);}catch(e){crashNote('update',e);}}
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#0b0d0c';ctx.fillRect(0,0,VW,VH);
  if(S){const cam=getCam(),sh=S.shake&&!ovMode?rnd(-S.shake,S.shake):0;
    ctx.setTransform(DPR*SCALE,0,0,DPR*SCALE,(-cam.x*SCALE+sh)*DPR,(-cam.y*SCALE+sh)*DPR);drawWorld(cam);
    ctx.setTransform(DPR,0,0,DPR,0,0);drawNight(cam);if(S.P.posted&&S.post)drawPostFrame();
    S.fx.forEach(f=>{if(f.type==='flash'){ctx.globalAlpha=Math.max(0,f.life/f.max)*.35;ctx.fillStyle=f.color;ctx.fillRect(0,0,VW,VH);ctx.globalAlpha=1;}});
    if(S.fade>0){ctx.fillStyle=`rgba(0,0,0,${clamp(S.fade/.35,0,1)})`;ctx.fillRect(0,0,VW,VH);}
    if(S.P.hidden&&S.mode==='hunter')drawCarInterior();
    if(S.mode!=='title')drawHUD();}
  updateCarUI();updateToolbar();updateTips();
}
window.__splice={get S(){return S;},startMonsterMode,showTurnStory,addDNA,winGame,giveKey,giveWeapon,arriveTown};
showTitle();requestAnimationFrame(frame);
