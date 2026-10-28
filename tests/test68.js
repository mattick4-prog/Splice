const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const S=__splice.S,c=S.camps[0],o={};hideOv();S.enemies.forEach(e=>e.dead=true);S.night=false;c.everPassed=true;gatePass(c,'x',true);o.day=hasPass(c);
 S.night=true;o.nightSameDay=hasPass(c);c.openT=0;c.haltT=-99;gateTick(1/60);const g=gateCenter(c,44);teleport(S.P,g.x,g.y,'out');gateTick(1/60);o.panel=S.panel;o.say=(document.querySelector('.bubble')||{}).innerText;
 act('gtoll',{});return o;}));
await p.waitForTimeout(1300);console.log(await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];return [hasPass(c),c.passNight];}));
console.log(errs);await b.close();})();
