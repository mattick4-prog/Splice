const {chromium}=require('playwright');const fs=require('fs');
(async()=>{fs.writeFileSync('wrapped.html','<!doctype html><html><head><meta charset="utf-8"></head><body>'+fs.readFileSync('../build/splice-body.html','utf8')+'</body></html>');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/wrapped.html');await p.waitForTimeout(300);
await p.evaluate(()=>{try{TITLE_TUT=false;}catch(e){}});await p.click('button[data-a="start"][data-mode="story"]');await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=__splice.S;hideOv();const H=houseList();const f=H[0],d=houseDoorPt(f);teleport(S.P,d.x,d.y+40,'out');S.P.doorCd=0;return {n:H.length,f:[f.x,f.y,f.w,f.h]};});
console.log(r);await p.waitForTimeout(300);await p.screenshot({path:'shots/house_out.png'});
await p.keyboard.down('w');await p.waitForTimeout(500);await p.keyboard.up('w');await p.waitForTimeout(400);
const r2=await p.evaluate(()=>{const S=__splice.S;const I=sceneObj(S.P.sc);return {sc:S.P.sc,props:I&&I.props.map(p=>p.type).join(','),haz:I&&I.haz&&I.haz.length,mons:S.enemies.filter(e=>e.sc===S.P.sc).length};});
console.log(r2);await p.screenshot({path:'shots/house_in.png'});
// walk out
await p.evaluate(()=>{const S=__splice.S;const I=sceneObj(S.P.sc);S.enemies.forEach(e=>{if(e.sc===S.P.sc)e.dead=true;});teleport(S.P,I.door.x,I.y+I.h-40,S.P.sc);S.P.doorCd=0;});
await p.keyboard.down('s');await p.waitForTimeout(500);await p.keyboard.up('s');await p.waitForTimeout(200);
console.log(await p.evaluate(()=>__splice.S.P.sc));
// enter all houses in all towns check
const r3=await p.evaluate(()=>{const S=__splice.S,out=[];for(let t=0;t<TOWNS.length;t++){loadTown(t);const H=houseList();let ok=0;H.forEach(f=>{const I=houseInterior(f);if(I&&I.props.length)ok++;});out.push(H.length+'/'+ok);}return out.join(' ');});
console.log(r3);console.log(errs);await b.close();})();
