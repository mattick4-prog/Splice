const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S,o={};hideOv();S.banners=[];const c=S.camps[0];teleport(S.P,BASE.x,BASE.y+200,'base');
 sendRaid(c,4);const R=raidersOf(c);o.n=R.length;
 for(let i=0;i<60*40;i++){S.enemies.forEach(e=>{if(!e.dead&&e.kind==='monster')updateMonster(e,1/60);});updateCamps(1/60);S.proj.forEach(pp=>{pp.x+=pp.vx/60;pp.y+=pp.vy/60;});gateTick(1/60);raidTick();}
 o.gateHp=c.gateHp;o.broken=c.gateBroken;o.def=c.def;o.sick=(c.sick||[]).length;o.raided=c.raided;o.left=raidersOf(c).length;o.dists=raidersOf(c).map(m=>Math.round(Math.hypot(m.x-c.x,m.y-c.y)));return o;});
console.log(r);
const r2=await p.evaluate(()=>{const S=__splice.S,o={},c=S.camps[0];c.raided=false;c.sick=[{name:'Bo',t:0,fam:'fire',a:0,r:30},{name:'Al',t:1,fam:'frost',a:2,r:40}];
 const sp=sickPos(c,c.sick[0]);teleport(S.P,sp.x+10,sp.y,'out');interact();o.panel=S.panel;o.txt=document.querySelector('#ov').innerText.slice(0,60);
 S.res.meds=3;S.vault.push({id:9,gene:'dive',q:'clean',val:10,age:0});S.cure={x:1};act('skcure',{});o.after=c.sick.map(s=>s.name);
 onDawn();o.dawn=c.sick.length;o.turnedMon=S.enemies.filter(e=>!e.dead&&e.campRaid===c.id).length;
 // pack
 S.humanity=40;const c2=S.camps[1];teleport(S.P,c2.x+c2.r+400,c2.y,'out');S.enemies.forEach(e=>e.dead=true);for(let i=0;i<4;i++)spawnMonster(pick(TOWNS[S.town].raid),S.P.x+30*i,S.P.y+60,{sc:'out'});
 packKey();o.pack=packList().length;const hp=S.P.hp;for(let i=0;i<120;i++)S.enemies.forEach(e=>{if(!e.dead)updateMonster(e,1/60);});o.hpKept=S.P.hp===hp;
 teleport(S.P,c2.x+c2.r+200,c2.y,'out');S.night=true;packKey();o.sent=S.enemies.filter(e=>e.campRaid===c2.id).length;o.packRaid=c2.packRaid;
 for(let i=0;i<60*60;i++){S.enemies.forEach(e=>{if(!e.dead&&e.kind==='monster')updateMonster(e,1/60);});updateCamps(1/60);gateTick(1/60);raidTick();}
 o.c2=[c2.gateHp,c2.def,c2.raided,(c2.sick||[]).length];return o;});
console.log(r2);console.log(errs);await b.close();})();
