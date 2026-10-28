const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
// wall
await p.evaluate(()=>{const S=__splice.S;hideOv();S.banners=[];S.defs={2:{type:'wall',hp:220,armed:true,rt:0},5:{type:'spikes',hp:0,armed:true,rt:0}};enterScene('out',BASE.x,BASE.y+150);});await p.waitForTimeout(700);await p.screenshot({path:'shots/wall2.png'});
// vault quick
const r=await p.evaluate(()=>{const S=__splice.S,o={};const B=S.baseInt;teleport(S.P,B.x+200,B.y+200,'base');o.lab=atLab();for(let i=0;i<5;i++)S.vault.push({id:300+i,gene:i<3?'dive':'icelance',q:'clean',val:15,age:0});
 openGenome('vault');o.btns=[...document.querySelectorAll('.qb')].map(b=>b.innerText.split('\n')[0]);act('render',{v:300});o.mut=S.res.mutagen;o.v=S.vault.length;act('qseq',{v:302});o.dive=S.dna.dive;o.v2=S.vault.length;
 openGenome('seq');o.seqBtn=!!document.querySelector('[data-a="qseqall"]');act('qseqall',{});o.v3=S.vault.length;o.ice=S.dna.icelance;return o;});
console.log(r);
await p.evaluate(()=>{const S=__splice.S;S.cure={a:1,b:1,c:1,d:1};S.broodN=2;hideOv();openGenome('me');document.querySelector('.card').scrollTop=520;});await p.waitForTimeout(400);await p.screenshot({path:'shots/roads3.png'});
// gate rebuild
const r2=await p.evaluate(()=>{const S=__splice.S,o={},c=S.camps[0];hideOv();c.gateBroken=true;c.gateHp=0;S._sol={};S.res.wood=10;S.res.scrap=10;S.res.wire=2;teleport(S.P,c.x,c.y,'out');S.campOpen=c.id;openPanel('camp');
 o.btn=!!document.querySelector('[data-a="gaterebuild"]:not([disabled])');act('gaterebuild',{});o.panel=S.panel;const B=S.bp;B.tiles.forEach(t=>{const si=B.slots.findIndex(x=>!x.filled&&x.mat===t.mat);bpPlace(t.id,si);});return o;});
await p.waitForTimeout(1200);
console.log(r2,await p.evaluate(()=>{const S=__splice.S,c=S.camps[0];const o={broken:c.gateBroken,hp:c.gateHp,panel:S.panel};act('gatereinforce',{});const B=S.bp;if(B)B.tiles.forEach(t=>{const si=B.slots.findIndex(x=>!x.filled&&x.mat===t.mat);bpPlace(t.id,si);});return o;}));
await p.waitForTimeout(1200);console.log(await p.evaluate(()=>{const c=__splice.S.camps[0];return {lvl:c.gateLvl,hp:c.gateHp,max:campGateMax(c)};}));
await p.evaluate(()=>{document.querySelector('.card').scrollTop=9999;});await p.screenshot({path:'shots/campgate.png'});
console.log(errs);await b.close();})();
