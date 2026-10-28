// ---------- one shared hook for extra save data (each feature registers with saveExt) ----------
const SAVE_EXT=[];function saveExt(fn){SAVE_EXT.push(fn);}
{const _sv=saveGame;saveGame=function(q){_sv(q);if(!SAVE_EXT.length)return;try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));if(!d)return;SAVE_EXT.forEach(f=>{try{f(d);}catch(e){console.error('[save ext]',e);}});localStorage.setItem(SAVE_KEY,JSON.stringify(d));}catch(e){}};}
// ================= TWO ROADS: THE CURE (stay human) vs THE BROOD (spread it) =================
const CURE_NEED=10,BROOD_NEED=10;
const CURE_STEPS=[[3,'📻 Word spreads','Camps everywhere hear what you\'re doing. +8 trust with every camp here.'],[6,'💉 Antiserum','Suppressant shots now give +25 humanity instead of +15.'],[10,'🧬 THE CURE','+30 humanity, every camp trusts you more, and friendly camps send you gifts every morning.']];
const BROOD_STEPS=[[3,'🐛 Brood scouts','Your brood brings you a DNA strand every morning.'],[6,'🌙 Night pack','2 more brood mutants fight beside you every night.'],[10,'👑 THE BROOD','4 mutants every night, +2 mutagen every morning. The town is starting to belong to you.']];
function cureN(){return Object.keys(S.cure||{}).length;}
function broodN(){return S.broodN||0;}
function famOfType(t){const M=MONSTERS[t];if(!M||!M.genes)return [];return M.genes.map(g=>geneInfo(g)&&geneInfo(g).fam).filter(Boolean);}
function freshStrandId(){return Math.random();}
function milestone(steps,before,after,cb){steps.forEach(([n,t,d],i)=>{if(before<n&&after>=n){banner(t.toUpperCase(),d,cb.col);addHistory(t+': '+d,'banner');cb.fn(i);}});}
function cureGain(gene){S.cure=S.cure||{};const before=cureN();if(S.cure[gene])return;S.cure[gene]=1;S.path.hunter=(S.path.hunter||0)+.4;
  milestone(CURE_STEPS,before,cureN(),{col:'#7dff9a',fn:i=>{
    if(i===0)S.camps.forEach(c=>{if(!c.brood&&!c.raided)campRep(c,8,'"We heard you\'re making vaccines. Thank you."');});
    if(i===2){S.humanity=Math.min(100,S.humanity+30);S.cureDone=true;S.path.hunter+=3;S.camps.forEach(c=>{if(!c.brood&&!c.raided)campRep(c,25,'"You did it. You actually made a cure."');});}}});}
function broodGain(n){const before=broodN();S.broodN=before+n;S.path.apex=(S.path.apex||0)+.4*n;
  milestone(BROOD_STEPS,before,broodN(),{col:'#c27bff',fn:i=>{if(i===2){S.broodDone=true;S.path.apex+=3;}}});}
// ---------- camp side: vaccines, turning survivors, tainting water ----------
function vPick(){const v=S.vault.find(x=>x.id==S.cvPick)||S.vault[0];if(v)S.cvPick=v.id;return v;}
function campDnaSec(c){
  const T=wTier(c),talk=!(T.name==='HOSTILE'||T.name==='FEARED'),v=vPick();
  const tubes=S.vault.length?`<div class="rack" style="margin:4px 0 8px">${S.vault.map(x=>{const g=geneInfo(x.gene);return `<button class="ttube ${v&&x.id===v.id?'sel':''}" data-a="cvpick" data-v="${x.id}" title="${g.name} strand (${QUAL[x.q].name})"><span class="glass"><span class="liq2" style="background:${g.color};height:${30+qStars(x.q)*20}%"></span><span class="gi">${g.icon}</span></span><b>${g.name}</b></button>`;}).join('')}</div>`
    :'<p class="mute" style="margin:4px 0 8px">Your vault is empty. Kill monsters and grab their strands first.</p>';
  const g=v&&geneInfo(v.gene),has=!!v,vaxd=(c.vax||[]).map(f=>FAM[f]?FAM[f].icon:'').join(' ');
  const human=`<div class="road h"><h4>💉 Help them <small>(Cure path · ${cureN()}/${CURE_NEED})</small></h4>
    <button class="btn sm" data-a="vax" ${has&&talk?'':'disabled'} title="Give the strand to their medic. They make a vaccine: monsters of that kind get sick and slow near this camp. Every NEW kind of strand you donate moves the Cure forward.">💉 Make a vaccine${g?' from '+g.icon+' '+g.name:''}</button>
    ${vaxd?`<small class="mute">Vaccinated against: ${vaxd}</small>`:''}</div>`;
  const recs=(c.recruits||[]).map((r,i)=>`<button class="btn sm ghost" data-a="turnrec" data-i="${i}" ${has&&S.crew.length<4?'':'disabled'} title="Slip ${r.name} the strand. They turn into a mutant who serves only you: tougher, fights at your base, never leaves you. If anyone sees you do it (more likely in daylight), this camp will hate you.">🧬 Turn ${r.name} ${ROLES[r.role].icon}</button>`).join('');
  const mon=`<div class="road m"><h4>🧬 Spread it <small>(Brood path · ${broodN()}/${BROOD_NEED})</small></h4>
    <div class="row" style="gap:6px;flex-wrap:wrap">${recs||'<small class="mute">No one here to turn right now.</small>'}
    <button class="btn sm ghost" data-a="taint" ${!c.brood&&S.night&&S.vault.length>=3?'':'disabled'} title="Pour 3 strands into their water at night. The whole camp turns into a Brood camp: loyal to you, at war with every other camp. Costs a lot of humanity.">☣️ Taint their water ${S.night?'(3 strands)':'(night only)'}</button></div></div>`;
  return `<section style="margin-top:12px"><h3>🧪 Your DNA and this camp</h3>${tubes}<div class="roads">${human}${mon}</div></section>`;
}
function broodCampHtml(c){return `<div class="card">${head('Brood camp · Esc to close','🧬 '+c.name,'#c27bff')}
  <p>Their eyes glow like yours now. ${c.leader} bows when you walk in. "What do you need from us?"</p>
  <p class="mute">Every morning they leave you 🧪 mutagen and a DNA strand. Every night their mutants fight beside you. Every other camp in town hates you for this.</p></div>`;}
{const _ch=campHtml;campHtml=function(){const c=campOf(S.campOpen);if(c&&c.brood)return broodCampHtml(c);const h=_ch();if(!c||S.mode!=='hunter')return h;return h.replace(/<\/div>\s*$/,campDnaSec(c)+'</div>');};}
function takeStrand(){const v=vPick();if(!v)return null;S.vault=S.vault.filter(x=>x!==v);S.cvPick=null;return v;}
{const _act=act;act=function(a,d){d=d||{};
  if(a==='cvpick'){S.cvPick=d.v;refreshPanel();return;}
  if(a==='vax'){const c=campOf(S.campOpen),v=takeStrand();if(!c||!v)return;const g=geneInfo(v.gene);c.vax=c.vax||[];const nf=!c.vax.includes(g.fam);if(nf)c.vax.push(g.fam);
    const newKind=!(S.cure||{})[v.gene];campRep(c,nf?12:5,'"Our medic made a vaccine from your '+g.name+' strand. You might have saved us."');S.humanity=Math.min(100,S.humanity+3);
    sfx('coin');toast('💉 Vaccine made. '+(newKind?'New kind of DNA: the Cure moves forward ('+(cureN()+1)+'/'+CURE_NEED+').':'You already donated this kind, so the Cure doesn\'t move.'),'good');cureGain(v.gene);refreshPanel();return;}
  if(a==='turnrec'){const c=campOf(S.campOpen),r=c&&c.recruits[+d.i];if(!r||S.crew.length>=4)return;const v=takeStrand();if(!v)return;
    c.recruits.splice(+d.i,1);S.crew.push({name:r.name,role:r.role,turned:true,camp:c.id,town:S.town,gene:v.gene});humanityHit(5);
    banner(r.name.toUpperCase()+' IS YOURS NOW','Their eyes glow when they look at you. They\'ll fight for you, and they\'ll never leave.','#c27bff');
    if(Math.random()<(S.night?.3:.6))campRep(c,-30,'"We SAW you. What did you put in '+r.name+'\'s drink?!"');else toast('🤫 Nobody saw. '+c.leader+' thinks '+r.name+' just left with you.','mem');
    broodGain(1);refreshPanel();return;}
  if(a==='taint'){const c=campOf(S.campOpen);if(!c||c.brood||!S.night||S.vault.length<3)return;S.vault.splice(0,3);humanityHit(12);
    c.brood=true;c.guards=[];S.taintN=(S.taintN||0)+1;broodGain(3);S.shake=6;
    S.camps.forEach(o=>{if(o!==c&&!o.raided&&!o.brood)campRep(o,-25,'"Something happened at '+c.name+'. Their people… changed. We know it was you."');});
    banner(c.name.toUpperCase()+' IS A BROOD CAMP','By morning, everyone in the camp has your eyes.','#c27bff');refreshPanel();return;}
  if(a==='revs'){revStart(d.f);return;}
  if(a==='disguise'){if(!S.disguiseOwned){if(S.res.scrap>=2&&S.res.wire>=1){S.res.scrap-=2;S.res.wire-=1;S.disguiseOwned=true;S.disguise=true;toast('🧥 You stitched a hood and gloves. Camps can\'t see your changes as easily.','good');}}else S.disguise=!S.disguise;refreshPanel();return;}
  if(a==='supp'&&S.res.meds>=2&&cureN()>=6){S.res.meds-=2;S.humanity=Math.min(100,S.humanity+25);S.hstage=S.humanity<25?3:S.humanity<50?2:S.humanity<75?1:0;refreshPanel();return;}
  _act(a,d);};}
// brood camps don't judge you, and trust you completely
{const _cr=campRep;campRep=function(c,delta,why){if(c&&c.brood)return;_cr(c,delta,why);};}
function standing(c){if(c.brood)return 100;return clamp(S.humanity+c.rep*.4+(S.disguise&&S.mode==='hunter'?10:0),0,100);}
function trustTick2(){if(S.mode!=='hunter'||S.P.dead)return;const P=S.P;if(P.sc!=='out')return;
  S.camps.forEach(c=>{if(c.raided||c.hostile||c.brood)return;const d=dist(P,c);if(d>c.r+40)return;
    if(S.disguise&&c.disDay!==S.day){c.disDay=S.day;if(Math.random()<(S.humanity<35?.3:.15)){S.disguise=false;S.disguiseOwned=false;campRep(c,-15,'"Take that hood off. …WHAT is under there?! What else are you hiding?"');return;}}
    if(S.night&&c.nightDay!==S.day){c.nightDay=S.day;const bad=S.humanity<50&&!S.disguise;campRep(c,bad?-8:-3,bad?'"Coming in at night, with eyes like that? Back off."':'"It\'s the middle of the night. You scared us half to death."');}
    if(S.vault.length>=Math.ceil(vaultCap()*.7)&&c.vaultDay!==S.day){c.vaultDay=S.day;campRep(c,-4,'"You reek of monster DNA. How much of that stuff are you carrying?"');}
    if(S.humanity<35&&!S.disguise&&c.aimDay!==S.day){c.aimDay=S.day;campRep(c,-5,'"Something is wrong with your face. Guards, keep your sights on it."');}});}
// healing powers near a camp earn trust instead of fear
function isHealPower(id){const p=POWERS[id];return !!(p&&p.fx&&p.fx.some(f=>f.t==='heal'||f.heal));}
{const _cs=castSlot;castSlot=function(i){const id=S.slots[i],ready=id&&!(S.cds[id]>0);
  if(ready&&isHealPower(id)&&S.mode==='hunter'&&S.P.sc==='out'){S.camps.forEach(c=>{if(c.raided||c.brood||c.hostile||dist(S.P,c)>c.r+260)return;c.powT=S.t;
    if(c.healDay!==S.day){c.healDay=S.day;S.healN=(S.healN||0)+1;campRep(c,4,'"You used that power to heal our wounded. Maybe you\'re not so scary."');}});}
  _cs(i);};}
// vaccinated camps make those monsters sick; brood camps don't shoot monsters
function pathTick(){if(S.mode!=='hunter')return;
  S.camps.forEach(c=>{if(c.brood){c.guards=[];return;}if(!c.vax||!c.vax.length||c.raided)return;
    S.enemies.forEach(e=>{if(e.dead||e.kind!=='monster'||e.sc!=='out'||e.boss||dist(e,c)>c.r+150)return;if(famOfType(e.type).some(f=>c.vax.includes(f))){applyStatus(e,'slow');if(!e.vaxT||S.t-e.vaxT>3){e.vaxT=S.t;floatText(e.x,e.y-30,'💉 sick','#7dff9a');}}});});}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(Math.floor(S.t*2)!==Math.floor((S.t-dt)*2))pathTick();};}
// mornings and nights
{const _od=onDawn;onDawn=function(){_od();if(S.mode!=='hunter')return;const got=[];
  const genes=[];S.enemies.forEach(e=>{const M=MONSTERS[e.type];if(M&&M.genes&&!M.boss)genes.push(...M.genes);});
  const strand=()=>{if(genes.length&&S.vault.length<vaultCap()){const g=pick(genes);S.vault.push({id:freshStrandId(),gene:g,q:'clean',val:irnd(12,18),age:0});got.push(geneInfo(g).icon+' strand');}};
  S.camps.forEach(c=>{if(!c.brood||c.raided)return;S.res.mutagen++;got.push('🧪');strand();});
  if(broodN()>=3)strand();if(S.broodDone){S.res.mutagen+=2;got.push('🧪🧪');}
  S.crew.forEach(m=>{if(m.turned&&!m.dead){S.res.mutagen++;got.push('🧪');}});
  if(got.length)toast('🧬 Your brood left gifts: '+got.join(' ')+'.','mem');
  if(S.cureDone){const gifts=[];S.camps.forEach(c=>{if(c.brood||c.raided)return;const T=wTier(c);if(T.name==='TRUSTED'||T.name==='UNEASY'){const k=pick(['meds','food','ammo']);S.res[k]++;gifts.push(RES_ICON[k]);}});
    if(gifts.length)toast('💉 Grateful camps sent gifts: '+gifts.join(' ')+'.','good');}};}
function broodAllies(n){const P=S.P;for(let i=0;i<n;i++)S.allies.push({x:P.x+rnd(-40,40),y:P.y+rnd(-40,40),r:10,hp:70,maxHp:70,dmg:10,spd:170,life:NIGHT_LEN+10,atkCd:0,dead:false,sc:P.sc,look:'brood',col:'#c27bff'});}
{const _on=onNightfall;onNightfall=function(){_on();if(S.mode!=='hunter')return;let n=S.camps.filter(c=>c.brood&&!c.raided).length*2;if(broodN()>=6)n+=2;if(S.broodDone)n+=2;n=Math.min(n,6);
  if(n){broodAllies(n);toast('🧬 '+n+' brood mutants came to fight beside you tonight.','mem');}};}
// turned crew: stay loyal, fight, look different
{const _cd=crewDawn;crewDawn=function(){const t=S.crew.filter(m=>m.turned);S.crew=S.crew.filter(m=>!m.turned);_cd();S.crew=S.crew.concat(t);};}
{const _uc=updateCrew;updateCrew=function(dt){_uc(dt);S.crew.forEach(m=>{if(!m.turned||m.dead||m.x===undefined)return;if(!m.buffed){m.buffed=1;m.hp=70;}
  m.cd2=(m.cd2||0)-dt;const e=nearestFoe({x:m.x,y:m.y,sc:'base'},260);if(e&&m.cd2<=0&&m.role!=='guard'){m.cd2=1.2;const a=Math.atan2(e.y-m.y,e.x-m.x);m.fa=a;S.proj.push({x:m.x,y:m.y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,r:5,dmg:10,owner:'p',life:.7,color:'#c27bff',sc:'base'});}});};}
function drawCrew(){
  S.crew.forEach(m=>{if(m.dead||m.x===undefined)return;ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.fa||0);const tn=m.turned;
    if(tn){ctx.fillStyle='rgba(194,123,255,.25)';ctx.beginPath();ctx.arc(0,0,17,0,7);ctx.fill();}
    circ(0,0,11,tn?'#5a3a7a':'#4a7a9a',2);circ(2,0,6,tn?'#b8a0d0':'#e8c09a',1.5);
    if(tn){ctx.fillStyle='#d6a0ff';ctx.beginPath();ctx.arc(6,-2,1.6,0,7);ctx.arc(6,2,1.6,0,7);ctx.fill();}
    if(m.role==='guard'){ctx.strokeStyle='#333';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(4,4);ctx.lineTo(18,4);ctx.stroke();}ctx.restore();
    const mh=tn?70:40;label((tn?'🧬 ':ROLES[m.role].icon+' ')+m.name,m.x,m.y-18,tn?'#d6a0ff':'#cfe6f4',12);if(m.hp<mh)hpBar(m.x,m.y-30,30,m.hp/mh,'#7dff9a');});
}
// brood camps look different on the map
{const _dc=drawCamps;drawCamps=function(cam){_dc(cam);S.camps.forEach(c=>{if(!c.brood||c.raided)return;ctx.fillStyle='rgba(150,60,200,'+(.18+.06*Math.sin(S.t*2))+')';ctx.beginPath();ctx.arc(c.x,c.y,c.r+10,0,7);ctx.fill();label('🧬 BROOD CAMP',c.x,c.y-c.r-30,'#d6a0ff',14);});};}
// remember camp changes when you leave a town
{const _lm=leaveTownMemory;leaveTownMemory=function(){_lm();const L=tlog();if(L.camps)S.camps.forEach((c,j)=>{if(L.camps[j]){L.camps[j].brood=!!c.brood;L.camps[j].vax=c.vax||[];}});};}
// ---------- reverse splice at the lab ----------
function revStart(fam){if(!atLab()){toast('⏪ Reverse splicing needs the Gene-O-Matic in your cabin.','bad');return;}
  const [lv,src]=famLevel(fam);if(!lv||!src)return;
  const G=SEQ_GAMES[nextGameIdx()],q={g:G.id,vial:{id:'rev',gene:src,q:'clean',val:0},d:1,done:false,started:false};G.setup(q);q.max=q.t=G.time(q);q.reverse=src;q.practice=false;
  S.seq=q;S.gtab='seq';openGenome('seq');}
{const _se=seqEnd;seqEnd=function(){const q=S.seq;if(!q||q.done||!q.reverse)return _se();
  clearInterval(S.seqTimer);const G=curGame(q);q.score=clamp(G.score(q),0,1);const id=q.reverse,g=geneInfo(id);
  const take=Math.round(25+25*q.score),before=S.dna[id]||0;S.dna[id]=Math.max(0,before-take);
  if(TRAITS[id]&&S.dna[id]<100){const j=S.traits.indexOf(id);if(j>=0)S.traits[j]=null;}
  if(POWERS[id]&&S.dna[id]<40){const j=S.slots.indexOf(id);if(j>=0)S.slots[j]=null;}
  const hum=Math.round(4+8*q.score);S.humanity=Math.min(100,S.humanity+hum);S.hstage=S.humanity<25?3:S.humanity<50?2:S.humanity<75?1:0;
  S.revN=(S.revN||0)+1;q.revTake=Math.round(before-S.dna[id]);q.revHum=hum;if(S.vault.length<vaultCap()){S.vault.push({id:freshStrandId(),gene:id,q:'clean',val:15,age:0});q.revStrand=true;}
  q.done=true;let n=S.nextGame;while(n===S.nextGame&&SEQ_GAMES.length>1)n=Math.floor(Math.random()*SEQ_GAMES.length);S.nextGame=n;
  toast('⏪ Pulled '+q.revTake+'% '+g.name+' DNA out of you. +'+hum+' humanity.','good');refreshPanel();};}
{const _st=seqTab;seqTab=function(){const q=S.seq;if(!(q&&q.done&&q.reverse))return _st();const g=geneInfo(q.reverse),G=curGame(q);
  return machine(`⏪ REVERSE SPLICE · DONE`,`<div class="ticket"><div class="tk1">REVERSE SPLICE</div><div style="font-size:40px">${g.icon}</div><div class="tk2" style="color:${g.color}">−${q.revTake}% ${g.name}</div>
    <div class="tk3" style="color:#7fc8ff">+${q.revHum} humanity</div><div class="mute">${g.name} is now at ${Math.round(S.dna[q.reverse]||0)}%.${q.revStrand?' The DNA you pulled out went into your Vault as a strand. Donate it to a camp as a vaccine!':''}</div>
    <div class="tksci">🔬 ${G.sci}</div></div>`,`<div class="deckrow">${arcBtn('🧍','data-a="gtab" data-t="me"','#7fc8ff','see my body')}${arcBtn('▶','data-a="gtab" data-t="seq"','#7dff9a','back to the lab')}</div>`);};}
{const _gt=act;act=function(a,d){if(a==='gtab'&&S.seq&&S.seq.reverse&&S.seq.done)S.seq=null;_gt(a,d);};}
// ---------- "You" tab: reverse buttons, disguise, the two roads ----------
/* roadMeter: replaced later */
{const _mt=meTab;meTab=function(){let h=_mt();const lab=atLab();
  const fams=bodyChanges().filter(c=>c.fam);
  const rev=fams.length&&S.mode==='hunter'?`<div class="revrow"><b>⏪ Reverse splice</b> <small class="mute">${lab?'Play a lab test to pull DNA back out. You lose some of that power, get humanity back, and keep the strand.':'Only at the Gene-O-Matic in your cabin.'}</small><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:4px">${fams.map(c=>`<button class="btn sm ghost" data-a="revs" data-f="${c.fam}" ${lab?'':'disabled'} title="Reverse ${c.name}: pulls DNA out of ${c.src.split(' · ')[0]}">${c.icon} ${c.name}</button>`).join('')}</div></div>`:'';
  const dis=S.mode==='hunter'?`<div class="revrow"><b>🧥 Disguise</b> <small class="mute">A hood and gloves hide your changes, so camps trust you a bit more. If they catch you hiding something, they trust you less.</small>
    <div style="margin-top:4px">${S.disguiseOwned?`<button class="btn sm ${S.disguise?'gold':'ghost'}" data-a="disguise">${S.disguise?'🧥 Wearing it (click to take off)':'🧥 Put it on'}</button>`:`<button class="btn sm" data-a="disguise" ${S.res.scrap>=2&&S.res.wire>=1?'':'disabled'}>🧥 Make one (2 ⚙️ + 1 🔌)</button>`}</div></div>`:'';
  const roads=S.mode==='hunter'?`<div class="tguide"><h3>🛣️ Two roads</h3><p class="mute" style="margin:0 0 8px">At any camp, give monster DNA away to help people (💉) or to change them (🧬).</p>
    ${roadMeter(cureN(),CURE_NEED,CURE_STEPS,'#7dff9a','💉','The Cure','donate NEW kinds of strands as vaccines')}${roadMeter(broodN(),BROOD_NEED,BROOD_STEPS,'#c27bff','🧬','The Brood','turn survivors (+1) or taint a camp\'s water (+3)')}</div>`:'';
  return h.replace('<div class="tguide">',rev+dis+roads+'<div class="tguide">');};}
// hood in the mirror
{const _bs=bodySvg;bodySvg=function(){let s=_bs();if(!S.disguise)return s;
  return s.replace('</svg>',`<g title="🧥 Disguise: hides your changes from camps"><path d="M66 60 Q64 18 100 16 Q136 18 134 60 L134 96 L66 96 Z M78 58 Q78 36 100 34 Q122 36 122 58 Q122 84 100 86 Q78 84 78 58 Z" fill="#5a4a3a" fill-rule="evenodd" stroke="#111" stroke-width="2"/><circle cx="60.5" cy="182" r="10" fill="#4a3a2a" stroke="#111" stroke-width="2"/><circle cx="139.5" cy="182" r="10" fill="#4a3a2a" stroke="#111" stroke-width="2"/></g></svg>`);};}
// save + load
saveExt(d=>{
  Object.assign(d,{revN:S.revN||0,healN:S.healN||0,taintN:S.taintN||0,roadIntro:!!S.roadIntro,cure:S.cure||{},broodN:S.broodN||0,cureDone:!!S.cureDone,broodDone:!!S.broodDone,disguise:!!S.disguise,disguiseOwned:!!S.disguiseOwned,crew:S.crew.map(c=>({name:c.name,role:c.role,turned:!!c.turned,camp:c.camp,town:c.town})),campx:S.camps.map(c=>({brood:!!c.brood,vax:c.vax||[]}))});
  });
{const _lg=loadGame;loadGame=function(){const ok=_lg();if(!ok)return ok;try{const d=saveInfo();['cure','broodN','cureDone','broodDone','disguise','disguiseOwned','revN','healN','taintN','roadIntro'].forEach(k=>{if(d[k]!==undefined)S[k]=d[k];});
  (d.campx||[]).forEach((x,j)=>{if(S.camps[j])Object.assign(S.camps[j],x);});}catch(e){}return ok;};}
(function(){const st=document.createElement('style');st.textContent=`
.roads{display:grid;grid-template-columns:1fr 1fr;gap:8px}.road{border-radius:10px;padding:8px 10px;background:#0006}.road.h{border:2px solid #7dff9a66}.road.m{border:2px solid #c27bff66}
.road h4{margin:0 0 6px}.road h4 small{font-weight:normal;opacity:.7}.road small{display:block;margin-top:4px}
.rmeter{margin:6px 0 16px}.rtop{display:flex;gap:8px;align-items:baseline}.rtop small{opacity:.7;flex:1}.rtop span{font-weight:bold;color:var(--rc)}
.rbar{position:relative;height:12px;background:#ffffff14;border-radius:6px;margin:6px 4px 0;border:1px solid #000}.rbar>i{display:block;height:100%;background:var(--rc);border-radius:6px}
.rstep{position:absolute;top:-2px;transform:translateX(-50%);font-size:14px;filter:grayscale(1) opacity(.5);cursor:help}.rstep.on{filter:none}
.revrow{margin-top:10px;background:#0005;border-radius:12px;padding:8px 12px}
@media (max-width:640px){.roads{grid-template-columns:1fr}}`;document.head.appendChild(st);})();
