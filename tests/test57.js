// save -> reload page -> continue: extension data survives
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const ctx=await b.newContext();const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const S=__splice.S;hideOv();const c=S.camps[0];c.taint=2;c.sleeper=true;c.gateLvl=1;c.sick=[{name:'Bo',t:0,fam:'fire',a:1,r:30}];S.antiUsed=true;S.cure={dive:1};S.crew.push({name:'June',role:'guard',turned:true,town:0,follow:false});S.gatesBuilt=2;saveGame();});
await p.reload();await p.waitForTimeout(500);
const cont=await p.$('button[data-a="continue"],button[data-a="load"]');if(cont)await cont.click();else await p.evaluate(()=>loadGame());await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];return {taint:c.taint,sleeper:c.sleeper,gateLvl:c.gateLvl,sick:(c.sick||[]).length,anti:S.antiUsed,cure:Object.keys(S.cure||{}).length,june:(S.crew.find(m=>m.name==='June')||{}).follow,gates:S.gatesBuilt};}));
console.log(errs);await b.close();})();
