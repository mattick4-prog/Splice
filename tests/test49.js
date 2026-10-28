const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const step=(n)=>p.evaluate((n)=>{const S=__splice.S,c=S.camps[0],P=S.P;for(let i=0;i<n;i++){const a=Math.atan2(c.y-P.y,c.x-P.x);if(Math.hypot(c.x-P.x,c.y-P.y)>20){P.x+=Math.cos(a)*3;P.y+=Math.sin(a)*3;}pushOut(P,solidsFor('out'));gateTick(1/60);}return {d:Math.round(Math.hypot(P.x-c.x,P.y-c.y)),open:gateOpen(c),panel:S.panel};},n);
await p.evaluate(()=>{const S=__splice.S;hideOv();S.banners=[];S.enemies=S.enemies.filter(e=>e.sc!=='out');const c=S.camps[0];const g=gateCenter(c,90);teleport(S.P,g.x,g.y,'out');});
console.log('trusted first visit:',await p.evaluate(()=>wTier(__splice.S.camps[0]).name),await step(40));
await p.evaluate(()=>{act('gtoll',{});});console.log('after toll',await p.evaluate(()=>gateOpen(__splice.S.camps[0])));
console.log('walk in',await step(80));
console.log('after 4s',await p.evaluate(()=>{for(let i=0;i<240;i++)gateTick(1/60);return gateOpen(__splice.S.camps[0]);}));
// monster tries to follow: spawn monster outside gate and push it toward center
console.log('monster blocked',await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];const g=gateCenter(c,120);const m=spawnMonster(pick(TOWNS[S.town].raid),g.x,g.y,{sc:'out'});for(let i=0;i<200;i++){const a=Math.atan2(c.y-m.y,c.x-m.x);m.x+=Math.cos(a)*3;m.y+=Math.sin(a)*3;pushOut(m,solidsFor('out'));gateTick(1/60);}return Math.round(Math.hypot(m.x-c.x,m.y-c.y));}));
// leave with monster near: gate stays shut
console.log('leave w monster',await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];const gi=gateCenter(c,-40);teleport(S.P,gi.x,gi.y,'out');gateTick(1/60);return gateOpen(c);}));
// kill monster then leave
console.log('leave clear',await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];S.enemies.forEach(e=>e.dead=true);gateTick(1/60);return gateOpen(c);}));
// come back same day: opens without panel
console.log('return',await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];c.openT=0;gateTick(1/60);const g=gateCenter(c,44);teleport(S.P,g.x,g.y,'out');gateTick(1/60);return [gateOpen(c),S.panel];}));
console.log(errs);await b.close();})();
