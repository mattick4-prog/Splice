const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.click('button[data-a="diff"][data-d="kid"]');await p.waitForTimeout(200);await p.screenshot({path:'shots/title.png'});
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const S=__splice.S,o={diff:S.diff,lives:S.lives};hideOv();const f=houseList()[0];const I=houseInterior(f);o.haz=(I.haz||[]).length;o.traps=I.props.filter(p=>p.trap).length;
 const food=S.res.food;onDawn();o.food1=[food,S.res.food];onDawn();o.food2=S.res.food;openMenu();o.menu=!!document.querySelector('[data-a="setdiff"]');act('setdiff',{d:'normal'});o.d2=S.diff;return o;}));
console.log(errs);await b.close();})();
