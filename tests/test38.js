const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S,o={};hideOv();
 const genes=['dive','icelance','drain','thickhide','swift','bloom','icelance'];genes.forEach((g,i)=>S.vault.push({id:500+i,gene:g,q:'clean',val:30,age:0}));
 const c=S.camps[0],c2=S.camps[1];teleport(S.P,c.x+c.r+20,c.y,'out');S.campOpen=c.id;openPanel('camp');
 o.hasSec=!!document.querySelector('[data-a="vax"]');o.recBtns=document.querySelectorAll('[data-a="turnrec"]').length;
 const rep0=c.rep;S.cvPick=500;act('vax',{});S.cvPick=501;act('vax',{});S.cvPick=503;act('vax',{});o.cure=cureN();o.rep=[rep0,c.rep];o.c2rep=c2.rep;o.vax=c.vax;
 S.cvPick=502;act('turnrec',{i:0});o.crew=S.crew.map(m=>m.name+(m.turned?'*':''));o.brood=broodN();
 S.night=true;S.campOpen=c2.id;openPanel('camp');act('taint',{});o.c2brood=c2.brood;o.brood2=broodN();o.vaultLeft=S.vault.length;
 openPanel('camp');o.broodHtml=document.querySelector('#ov').innerText.slice(0,80);
 S.night=false;
 // disguise
 S.res.scrap=5;S.res.wire=2;act('disguise',{});o.dis=[S.disguiseOwned,S.disguise,standing(c)];
 // reverse splice
 S.dna.dive=120;S.humanity=50;const B=S.baseInt;teleport(S.P,B.x+100,B.y+100,'base');
 o.atLab=atLab();
 return o;});
console.log(r);
await p.evaluate(()=>{const S=__splice.S;const lab=S.baseInt.stations?null:null;});
// force atLab true for reverse test
const r2=await p.evaluate(()=>{const S=__splice.S,o={};const _a=atLab;window.atLab=()=>true;try{revStart('fire');o.seq=!!S.seq&&S.seq.reverse;S.seq.started=true;seqEnd();o.dive=S.dna.dive;o.hum=S.humanity;o.done=S.seq.done;}catch(e){o.err=e.message;}
 openGenome('seq');o.ticket=document.querySelector('.ticket')?document.querySelector('.ticket').innerText.replace(/\n/g,' | '):null;
 onDawn();onNightfall();o.allies=S.allies.length;saveGame();o.saved=JSON.parse(localStorage.getItem(SAVE_KEY)).broodN;return o;});
console.log(r2);
await p.evaluate(()=>{openGenome('me');});await p.waitForTimeout(300);await p.screenshot({path:'shots/me2.png',fullPage:false});
await p.evaluate(()=>{document.querySelector('.card').scrollTop=600;});await p.waitForTimeout(100);await p.screenshot({path:'shots/me3.png'});
await p.evaluate(()=>{const S=__splice.S;S.campOpen=S.camps[0].id;openPanel('camp');});await p.waitForTimeout(200);await p.evaluate(()=>{const el=document.querySelector('.card');el.scrollTop=9999;});await p.screenshot({path:'shots/camp_dna.png'});
console.log(errs);await b.close();})();
