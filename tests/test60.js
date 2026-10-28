const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.screenshot({path:'shots/title2.png'});
await p.evaluate(()=>{try{TITLE_TUT=true;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(3500);
console.log(await p.evaluate(()=>({panel:__splice.S.panel,tut:__splice.S.tut&&__splice.S.tut.on})));await p.screenshot({path:'shots/tut1.png'});
await p.click('[data-a="tutok"]');await p.waitForTimeout(400);await p.screenshot({path:'shots/tut1b.png'});
// jump: night 1
await p.evaluate(()=>{const S=__splice.S;S.clock=DAY_LEN-0.3;});await p.waitForTimeout(4000);console.log(await p.evaluate(()=>[__splice.S.night,__splice.S.panel]));await p.screenshot({path:'shots/tut2.png'});
await p.evaluate(()=>{act('tutok');const S=__splice.S;S.clock=DAY_LEN+NIGHT_LEN-0.3;});await p.waitForTimeout(4500);console.log(await p.evaluate(()=>[__splice.S.day,__splice.S.panel]));
await p.evaluate(()=>{act('tutok');const S=__splice.S;S.day=3;});await p.waitForTimeout(3500);console.log(await p.evaluate(()=>[__splice.S.day,__splice.S.panel]));
await p.evaluate(()=>{act('tutok');const S=__splice.S;S.day=4;});await p.waitForTimeout(3500);console.log(await p.evaluate(()=>[__splice.S.day,__splice.S.panel,__splice.S.tut.on]));await p.screenshot({path:'shots/tut5.png'});
console.log(errs);await b.close();})();
