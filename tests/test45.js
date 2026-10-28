const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S,o={};hideOv();const c=S.camps[0];o.fort=[c.fort,c.guards.length,!!c.tank,c.towers.length,wallSegs(c).length];
 for(let i=0;i<8;i++)S.vault.push({id:100+i,gene:'dive',q:'clean',val:15,age:0});
 // wall blocks? walk from outside straight toward center on far side
 const ta=c.gate+Math.PI;teleport(S.P,c.x+Math.cos(ta)*(c.r+40),c.y+Math.sin(ta)*(c.r+40),'out');
 o.solidHit=solidsFor('out').some(s=>s.a!==undefined&&inRect(c.x+Math.cos(ta)*(c.r+6),c.y+Math.sin(ta)*(c.r+6),s));
 // taint: place at tank, night, invisible to avoid lights
 S.night=true;teleport(S.P,c.tank.x,c.tank.y,'out');S.P.invisT=99;keys['e']=true;for(let i=0;i<60;i++)fortTick(.1);keys['e']=false;o.dose1=[c.taint,S.vault.length,broodN()];
 keys['e']=true;for(let i=0;i<60;i++)fortTick(.1);keys['e']=false;o.sameNight=c.taint;
 S.day++;c.taintDay=S.day-1;keys['e']=true;for(let i=0;i<60;i++)fortTick(.1);keys['e']=false;S.day++;keys['e']=true;for(let i=0;i<60;i++)fortTick(.1);keys['e']=false;o.dose3=c.taint;
 onDawn();o.brood=c.brood;o.broodN=broodN();
 // caught scenario on camp 1
 const c2=S.camps[1];S.P.invisT=0;c2.alert=true;teleport(S.P,c2.tank.x,c2.tank.y,'out');S.day+=5;keys['e']=true;fortTick(.1);keys['e']=false;o.caught=c2.hostile;
 // cure camp 0
 S.cure={a:1,b:1,c:1};S.res.meds=3;S.campOpen=c.id;openPanel('camp');o.cureBtn=!!document.querySelector('[data-a="unbrood"]:not([disabled])');act('unbrood',{});o.after=[c.brood,c.guards.length,broodN(),S.humanity];
 return o;});
console.log(r);
await p.evaluate(()=>{const S=__splice.S;hideOv();const c=S.camps[0];S.night=true;S.P.invisT=0;teleport(S.P,c.x,c.y+c.r+150,'out');});await p.waitForTimeout(400);await p.screenshot({path:'shots/fort.png'});
console.log(errs);await b.close();})();
