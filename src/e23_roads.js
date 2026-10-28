// ================= ROAD GUIDE: what to do on the human road vs the monster road =================
function turnedN(){return S.crew.filter(m=>m.turned&&!m.dead).length;}
function roadSteps(){
  const hum=Math.round(S.humanity);
  return {
    human:[
      ['💉','Make a vaccine','At any camp: pick a strand, press 💉.',cureN()>0,cureN()+(cureN()===1?' kind':' kinds')],
      ['🛑','Get through a camp gate','Let them search you, show your vaccine work, or pay the toll.',(S.camps||[]).some(c=>c.passDay!==undefined),''],
      ['⏪','Reverse splice a power','🧍 You tab, at your cabin lab.',(S.revN||0)>0,(S.revN||0)+' done'],
      ['🛡️','Help a camp hold its wall','📻 When monsters raid a camp at night, go fight them off.',(S.heldN||0)>0,(S.heldN||0)+' held'],
      ['🤒','Cure a bitten survivor','Bitten survivors lie in the camp. Treat or cure them before they turn.',(S.curedN||0)>0,(S.curedN||0)+' cured'],
      ['🌸','Heal near a camp','Use a healing power (like Bloom) near survivors.',(S.healN||0)>0,(S.healN||0)+' times'],
      ['🙂','Keep humanity above 50','Suppressant shots: 2 💊 at your pantry.',hum>=50,'now '+hum],
      ['🧬','Reach THE CURE','Donate 10 different kinds of strands.',!!S.cureDone,cureN()+'/'+CURE_NEED]],
    monster:[
      ['🧬','Turn a recruit','At any camp: pick a strand, press 🧬 Turn.',turnedN()>0,turnedN()+' turned'],
      ['🚪','Turn a gatekeeper','At a camp gate at night: 1 strand. The gate opens for you every night.',(S.camps||[]).some(c=>c.sleeper),''],
      ['🐾','Call a pack (C)','Press C near monsters. They follow you and won\'t bite you.',(S.packN||0)>0,(S.packN||0)+' called'],
      ['💥','Send a pack at a camp','Near a camp, press C again. Do it at night, out of the searchlights.',(S.packSent||0)>0,(S.packSent||0)+' sent'],
      ['☣️','Taint a camp\'s water','Sneak to a camp\'s 💧 tank at night and hold E. 3 doses, 3 nights. Dodge the searchlights.',(S.taintN||0)>0,(S.taintN||0)+' camps'],
      ['⚡','Absorb strands raw','Vault tab. Faster, wilder, costs humanity.',(S.stats.raw||0)>0,(S.stats.raw||0)+' times'],
      ['🐛','Reach THE BROOD','Grow your brood to 10.',!!S.broodDone,broodN()+'/'+BROOD_NEED],
      ['👹','Become the Apex','Let humanity hit 0. You turn into the monster and hunt the town.',S.mode==='monster','humanity '+hum]]
  };
}
function roadCol(key,title,col,goal,gets,costs){const st=roadSteps()[key],next=st.find(s=>!s[3]);
  return `<div class="road2" style="--rc:${col}"><h3>${title}</h3><div class="rgoal">🏁 ${goal}</div>
    ${st.map(s=>`<div class="rstp ${s[3]?'ok':''} ${s===next?'nx':''}" title="${s[2]}"><span>${s[3]?'✅':s[0]}</span><div><b>${s[1]}</b><small>${s[2]}</small></div>${s[4]?`<em>${s[4]}</em>`:''}</div>`).join('')}
    <div class="rgain">🎁 ${gets}</div><div class="rcost">💔 ${costs}</div></div>`;}
function roadGuide(){
  if(S.mode==='monster')return `<section class="roadsec"><h3 style="color:var(--monster)">👹 You are the Apex</h3>
    <div class="rstp nx"><span>🏚️</span><div><b>Break the outposts</b><small>At night, smash the survivors' outposts. Kill each Outpost Captain.</small></div></div>
    <div class="rstp nx"><span>🪺</span><div><b>Defend your nest</b><small>By day the purge parties come to burn it.</small></div></div>
    <div class="rstp nx"><span>👑</span><div><b>Claim the town, then migrate</b><small>When every outpost falls, go to your nest and press B.</small></div></div></section>`;
  return `<section class="roadsec"><h3>🛣️ Choose your road</h3><p class="mute" style="margin:0 0 8px">Every DNA strand is a choice: keep it, give it away to help people, or use it to change them. Glowing step = do this next.</p>
    <div class="roads2">${roadCol('human','💉 Human road','#7dff9a','THE CURE: save the survivors','Trusted camps, gifts every morning, stronger meds, more humanity.','You give away strands instead of getting stronger.')}
    ${roadCol('monster','🧬 Monster road','#c27bff','THE BROOD, then become the Apex','Mutant allies every night, free strands and mutagen, loyal Brood camps.','Humanity drops fast. Normal camps hate you and may attack.')}</div></section>`;
}
{const _jh=journalHtml;journalHtml=function(){const h=_jh();const i=h.indexOf('<section');return i<0?h.replace(/<\/div>\s*$/,roadGuide()+'</div>'):h.slice(0,i)+roadGuide()+h.slice(i);};}
// count raw absorbs
{const _ar=absorbRaw;absorbRaw=function(v,q){S.stats.raw=(S.stats.raw||0)+1;return _ar(v,q);};}
// tell the player the roads exist (once, on the 2nd morning)
{const _od=onDawn;onDawn=function(){_od();if(S.mode==='hunter'&&!S.roadIntro&&S.day>=4){S.roadIntro=true;banner('TWO ROADS','Stay human and find a cure, or spread the DNA and build a brood. Press J to see both.','#ffd166');}};}
// "You" tab: point at the next step on each road
{const _mt=meTab;meTab=function(){let h=_mt();if(S.mode!=='hunter')return h;const st=roadSteps(),nh=st.human.find(s=>!s[3]),nm=st.monster.find(s=>!s[3]);
  const nxt=`<div class="rnext"><span style="--rc:#7dff9a">💉 Next: ${nh?nh[0]+' '+nh[1]:'✅ Done'}</span><span style="--rc:#c27bff">🧬 Next: ${nm?nm[0]+' '+nm[1]:'✅ Done'}</span><button class="btn sm ghost" data-a="openJournal">📖 Full guide (J)</button></div>`;
  return h.replace('<h3>🛣️ Two roads</h3>','<h3>🛣️ Two roads</h3>'+nxt);};}
{const _act=act;act=function(a,d){if(a==='openJournal'){openJournal();return;}_act(a,d);};}
(function(){const st=document.createElement('style');st.textContent=`
.roadsec{margin:10px 0}.roads2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.road2{border:2px solid var(--rc);border-radius:12px;padding:8px 10px;background:#0005}.road2 h3{margin:0 0 4px;color:var(--rc)}
.rgoal{font-weight:700;margin-bottom:6px}.rgain,.rcost{font-size:13px;margin-top:6px}.rcost{opacity:.75}
.rstp{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:8px;margin:3px 0;background:#ffffff08}.rstp>span{font-size:20px;width:26px;text-align:center}
.rstp b{display:block;font-size:14px}.rstp small{display:block;font-size:12px;opacity:.75}.rstp em{margin-left:auto;font-style:normal;font-size:12px;opacity:.8;white-space:nowrap}
.rstp.ok{opacity:.55}.rstp.nx{outline:2px solid var(--rc,#ffd166);background:#ffffff14;animation:pulse 1.2s infinite alternate}
.rnext{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 8px}.rnext span{border:2px solid var(--rc);border-radius:8px;padding:3px 8px;font-size:13px}
@media (max-width:640px){.roads2{grid-template-columns:1fr}}`;document.head.appendChild(st);})();
