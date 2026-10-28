const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S,o={};hideOv();const _r=Math.random;
 // find a house that gets hiders
 let f,I;for(const ff of houseList()){I=houseInterior(ff);if(I.hiders){f=ff;break;}}
 o.hiders=I.hiders.map(h=>h.name+(h.trapped?'(trapped)':''));o.owned=I.props.filter(p=>p.owner).length;o.mons=lurkersIn(I.id);
 teleport(S.P,I.hiders[0].x-30,I.hiders[0].y,I.id);const reps0=S.camps.map(c=>c.rep);
 interact();o.panel=S.panel;o.html=document.querySelector('#ov').innerText.slice(0,120).replace(/\n/g,' | ');
 // kill lurkers -> saved
 S.enemies.forEach(e=>{if(e.sc===I.id)e.dead=true;});hiderTick(.1);o.afterSave=S.camps.map(c=>c.rep);
 S.res.food=2;S.res.meds=2;S.hiderOpen=I.hiders[0];act('hfood',{});act('hmeds',{});o.afterHelp=S.camps.map(c=>c.rep);
 // steal from 2nd? steal with no permission
 const own=I.props.find(p=>p.owner);lootContainer(own);o.afterSteal=S.camps.map(c=>c.rep);o.mood=I.hiders.map(h=>h.mood);
 // lead
 const h=I.hiders[0];h.mood='friend';S.hiderOpen=h;act('hlead',{});const c=S.camps[0];teleport(S.P,c.x,c.y,'out');for(let i=0;i<5;i++)hiderTick(.1);
 h.x=c.x;h.y=c.y;hiderTick(.1);o.safe=h.gone;o.recruits=c.recruits.map(r=>r.name);
 return o;});
console.log(r);
const r2=await p.evaluate(()=>{const S=__splice.S,o={};S.cure={a:1,b:1,c:1,d:1,e:1,f:1};startMonsterMode();o.mode=S.mode;o.can=canComeBack();S.atBase=true;openPanel('nest');o.btn=!!document.querySelector('[data-a="comeback"]');
 act('comeback',{});o.mode2=S.mode;o.hum=S.humanity;o.sc=S.P.sc;o.camps=S.camps.length;o.blds=S.blds.length;return o;});
console.log(r2);await p.waitForTimeout(1500);await p.screenshot({path:'shots/comeback.png'});
// run a few seconds of the game to catch runtime errors in hunter mode after coming back
await p.keyboard.down('s');await p.waitForTimeout(1200);await p.keyboard.up('s');
console.log(errs);await b.close();})();
