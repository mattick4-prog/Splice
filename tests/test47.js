const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
// walk up to the gate for real
await p.evaluate(()=>{const S=__splice.S;hideOv();S.banners=[];const c=S.camps[0];const g=gateCenter(c,150);teleport(S.P,g.x,g.y,'out');S.P.face=c.gate+Math.PI;});
const dirs=await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];const dx=Math.cos(c.gate+Math.PI),dy=Math.sin(c.gate+Math.PI);return [dx,dy];});
const k=[];if(dirs[0]>.4)k.push('d');if(dirs[0]<-.4)k.push('a');if(dirs[1]>.4)k.push('s');if(dirs[1]<-.4)k.push('w');
for(const x of k)await p.keyboard.down(x);await p.waitForTimeout(1800);for(const x of k)await p.keyboard.up(x);
console.log(await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];return {panel:S.panel,inside:insideCamp(c),d:Math.round(Math.hypot(S.P.x-c.x,S.P.y-c.y)),r:c.r};}));
await p.screenshot({path:'shots/gate_panel.png'});
await p.evaluate(()=>{hideOv();});await p.waitForTimeout(400);await p.screenshot({path:'shots/gate.png'});
// pay toll then walk in
console.log(await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];openGate(c);act('gtoll',{});return {open:gateOpen(c),food:S.res.food,solids:solidsFor('out').filter(s=>s.gate).length};}));
for(const x of k)await p.keyboard.down(x);await p.waitForTimeout(1500);for(const x of k)await p.keyboard.up(x);
console.log(await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];return {inside:insideCamp(c)};}));
// monster mode: break the gate
console.log(await p.evaluate(()=>{const S=__splice.S;startMonsterMode();const c=S.camps[0];const closed=!gateOpen(c);const g=gateCenter(c);for(let i=0;i<30;i++)dmgStructures(g.x,g.y,55,40);return {closed,broken:c.gateBroken};}));
console.log(errs);await b.close();})();
