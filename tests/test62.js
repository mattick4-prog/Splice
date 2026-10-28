const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{TITLE_TUT=false;});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S,o={};hideOv();o.towns={};
 for(const k in CHOICES){if(CHOICES[k].town!==undefined)o.towns[k]=CHOICES[k].town;}
 // ship choice at town 8
 S.town=8;loadTown(8);afterBossStory();return o;});
console.log(r);await p.waitForTimeout(700);await p.screenshot({path:'shots/story_ship.png'});
console.log(await p.evaluate(()=>{const S=__splice.S;const o={panel:ovMode,btns:[...document.querySelectorAll('[data-a="choice"]')].map(b=>b.innerText.split('\n')[0])};act('choice',{c:'ship',o:'notes'});o.cure=cureN();return o;}));
// each choice applies without error
console.log(await p.evaluate(()=>{const S=__splice.S,out=[];for(const k in CHOICES){if(CHOICES[k].town===undefined)continue;for(const op of CHOICES[k].opts){try{delete S.choices[k];applyChoice(k,op.id);out.push(k+':'+op.id+':ok');}catch(e){out.push(k+':'+op.id+':ERR '+e.message);}}}hideOv();return out.filter(x=>x.includes('ERR')).concat([cureN(),broodN()]);}));
// country arrival after ground zero
console.log(await p.evaluate(()=>{const S=__splice.S;delete S.choices.zero;S.town=17;loadTown(17);S.maxTown=18;S.travelTo=18;try{arriveTown(18);}catch(e){return 'arrive err '+e.message;}return [S.town,S.pendingChoice];}));
await p.waitForTimeout(3200);await p.screenshot({path:'shots/story_japan.png'});
console.log(await p.evaluate(()=>{act('storyok');return [ovMode,!!document.querySelector('[data-c="zero"]')];}));
await p.waitForTimeout(300);await p.screenshot({path:'shots/story_zero.png'});
console.log(await p.evaluate(()=>{hideOv();openJournal();return document.querySelector('#ov').innerText.includes('What you know');}));
console.log(await p.evaluate(()=>{hideOv();showWorldWin();return document.querySelector('.card.story').innerText.slice(0,300);}));
console.log(errs);await b.close();})();
