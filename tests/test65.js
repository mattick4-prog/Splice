const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const S=__splice.S,o={};hideOv();
 // two powers to full + mastery-ish, 30 casts, 3 raw absorbs, one turned survivor
 addDNA('dive',100);addDNA('icelance',100);o.afterPowers=Math.round(S.humanity);
 S.slots=['dive','icelance',null];for(let i=0;i<30;i++){S.cds={};castSlot(i%2);}o.afterCasts=Math.round(S.humanity);
 for(let i=0;i<3;i++){S.vault.push({id:i,gene:'drain',q:'clean',val:10,age:0});absorbRaw(S.vault[S.vault.length-1]);}o.afterRaw=Math.round(S.humanity);
 humanityHit(5);broodGain(1);o.afterTurn=Math.round(S.humanity);
 const c=S.camps[0];c.rep=20;o.odds=Math.round(searchOdds(c)*100);o.marks=[powerMarks(),humanMarks()];
 // quiet day regen
 S.harmDay=-1;const h=S.humanity;onDawn();o.regen=Math.round(S.humanity-h);
 // hit a survivor in a house
 let I;for(const f of houseList()){I=houseInterior(f);if(I.hiders)break;}if(!I||!I.hiders){I=houseInterior(houseList()[0]);I.hiders=[{name:'Bo',x:I.x+300,y:I.y+200,sc:I.id,mood:'scared'}];}
 S.enemies.forEach(e=>{if(e.sc===I.id)e.dead=true;});const hd=I.hiders[0];teleport(S.P,hd.x-30,hd.y,I.id);S.P.face=0;S.P.atkCd=0;const h0=S.humanity,r0=S.camps.map(c=>c.rep);
 playerAttack();o.hit1=[hd.mood,Math.round(h0-S.humanity)];playerAttack();o.hit2=[hd.gone,Math.round(h0-S.humanity),S.camps.map((c,i)=>c.rep-r0[i])];
 // hit a camp leader
 teleport(S.P,c.x-20,c.y+28,'out');S.P.face=0;playerAttack();o.camp=[c.rep,c.hostile];
 return o;}));
console.log(errs);await b.close();})();
