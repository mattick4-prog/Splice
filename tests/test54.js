const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const S=__splice.S;hideOv();S.banners=[];S.crew.push({name:'June',role:'guard',turned:true,town:0,gene:'dive'});S.crew.push({name:'Hank',role:'cook'});const B=S.baseInt;teleport(S.P,B.door.x,B.door.y-60,'base');});
await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{const S=__splice.S;return {ally:S.allies.filter(a=>a.crewRef).map(a=>a.crewRef.name+'@'+a.sc)};}));
// walk outside
await p.evaluate(()=>{const S=__splice.S;enterScene('out',BASE.x,BASE.y+120);});await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const S=__splice.S,a=S.allies.find(a=>a.crewRef);return {sc:a&&a.sc,d:a&&Math.round(dist(a,S.P))};}));
await p.evaluate(()=>{const S=__splice.S;spawnMonster(pick(TOWNS[S.town].raid),S.P.x+150,S.P.y,{sc:'out'});});await p.waitForTimeout(1200);await p.screenshot({path:'shots/crewfollow.png'});
await p.keyboard.press('i');await p.waitForTimeout(300);await p.screenshot({path:'shots/crewbag.png'});
await p.click('[data-a="crewfollow"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const S=__splice.S;return {follow:S.crew[0].follow,allies:S.allies.filter(a=>a.crewRef&&!a.dead).length};}));
console.log(errs);await b.close();})();
