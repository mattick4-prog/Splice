const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;localStorage.removeItem('splice_rail');}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const S=__splice.S;S.banners=[];S.vault.push({id:1,gene:'dive',q:'clean',val:10,age:0});giveRes({wood:2},0,0);addHistory('test');});
await p.mouse.move(60,400);await p.waitForTimeout(500);await p.screenshot({path:'shots/rail_near.png',clip:{x:0,y:150,width:420,height:520}});
await p.mouse.move(30,380);await p.waitForTimeout(600);await p.screenshot({path:'shots/rail_hover.png',clip:{x:0,y:150,width:420,height:520}});
await p.mouse.move(700,400);await p.waitForTimeout(4200);await p.screenshot({path:'shots/rail_quiet.png',clip:{x:0,y:150,width:420,height:520}});
// click map via rail
await p.mouse.move(30,380);await p.waitForTimeout(400);await p.click('[data-tb="map"]');await p.waitForTimeout(300);console.log(await p.evaluate(()=>__splice.S.panel));await p.evaluate(()=>hideOv());
await p.click('#toolbar .rtuck');await p.waitForTimeout(600);await p.screenshot({path:'shots/rail_tucked.png',clip:{x:0,y:150,width:420,height:520}});
await p.click('#railhandle');await p.waitForTimeout(500);console.log(await p.evaluate(()=>document.getElementById('toolbar').classList.contains('tucked')));
console.log(errs);await b.close();})();
