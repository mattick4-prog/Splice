const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S,o={};hideOv();S.banners=[];let I;for(const f of houseList()){I=houseInterior(f);if(I.hiders)break;}
 const h=I.hiders[0];h.bite={t:1,fam:'fire'};S.enemies.forEach(e=>{if(e.sc===I.id)e.dead=true;});teleport(S.P,h.x-30,h.y,I.id);interact();o.panel=S.panel;o.opts=[...document.querySelectorAll('.hopt')].map(b=>b.innerText.split('\n')[1]+(b.disabled?'(off)':''));
 S.res.meds=2;act('hmeds',{});o.t=h.bite.t;
 // lead bitten to camp
 h.mood='friend';act('hlead',{});const c=S.camps[0];teleport(S.P,c.x,c.y,'out');for(let i=0;i<3;i++)hiderTick(.1);h.x=c.x;h.y=c.y;hiderTick(.1);o.sick=(c.sick||[]).map(s=>s.name);o.rec=c.recruits.map(r=>r.name);
 // open the camp sick panel
 const s=c.sick[c.sick.length-1];const sp=sickPos(c,s);teleport(S.P,sp.x+10,sp.y,'out');interact();o.panel2=S.panel;o.title=document.querySelector('#ov h1,#ov h2')&&document.querySelector('#ov h1,#ov h2').innerText;
 return o;});
console.log(r);await p.screenshot({path:'shots/surv.png'});
console.log(errs);await b.close();})();
