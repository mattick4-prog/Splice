const {chromium}=require('playwright');const fs=require('fs');fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{TITLE_TUT=false;});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const S=__splice.S;hideOv();S.town=17;loadTown(17);S.maxTown=18;S.travelTo=18;arriveTown(18);});await p.waitForTimeout(3500);
await p.screenshot({path:'shots/story_japan.png'});await p.click('[data-a="storyok"]');await p.waitForTimeout(400);await p.screenshot({path:'shots/story_zero.png'});
console.log(await p.evaluate(()=>!!document.querySelector('[data-c="zero"]')));console.log(errs);await b.close();})();
