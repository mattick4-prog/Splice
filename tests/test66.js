const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
// monsters approaching west window and door
await p.evaluate(()=>{const S=__splice.S;hideOv();S.banners=[];S.night=true;const br=baseRect();const B=S.baseInt;teleport(S.P,B.x+B.w/2,B.y+B.h/2,'base');
 const m1=spawnMonster(pick(TOWNS[S.town].raid),br.x-180,br.y+br.h*.78,{sc:'out'});m1.stunT=99;const m2=spawnMonster(pick(TOWNS[S.town].raid),BASE.x,br.y+br.h+330,{sc:'out'});m2.stunT=99;});
await p.waitForTimeout(600);console.log(await p.evaluate(()=>threatLevels().map(x=>x.toFixed(2))));await p.screenshot({path:'shots/winglow.png'});
// lessons
await p.evaluate(()=>{openHelp();});await p.waitForTimeout(200);await p.click('[data-a="lessons"]');await p.waitForTimeout(200);await p.screenshot({path:'shots/lessons.png'});
await p.click('[data-a="lessonview"][data-i="2"]');await p.waitForTimeout(200);console.log(await p.evaluate(()=>[__splice.S.panel,!!document.querySelector('[data-a="lessons"]')]));
// mystery
console.log(await p.evaluate(()=>{const S=__splice.S;hideOv();S.stats.searched=25;S.curedN=3;S.packN=6;S.perfectN=5;S.minHum=20;S.humanity=80;S.gatesBuilt=4;mysteryTick();return MYSTERY.map(M=>M.id+':'+(S.dna[M.id]||0));}));
await p.evaluate(()=>{const S=__splice.S;S.flags.myst_m_phoenix=false;S.flags.myst_m_genestorm=false;S.dna.m_phoenix=0;S.dna.m_genestorm=0;S.perfectN=2;S.minHum=50;openGenome('powers');document.querySelector('.card').scrollTop=9999;});await p.waitForTimeout(300);await p.screenshot({path:'shots/myst.png'});
console.log(await p.evaluate(()=>{const S=__splice.S;hideOv();const out=[];['m_angel','m_howl','m_golem','m_ghost'].forEach((id,i)=>{S.slots[0]=id;S.cds={};try{castSlot(0);out.push(id+' ok');}catch(e){out.push(id+' ERR '+e.message);}});return out;}));
console.log(errs);await b.close();})();
