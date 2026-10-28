// ================= OVERLAYS =================
function showOv(html,mode){ov.innerHTML=html;ov.classList.add('show');ovMode=mode;for(const k in keys)keys[k]=false;mouse.down=false;
  const f=ov.querySelector('button[data-a="start"],button[data-a="turn"],button[data-a="arrive"]');if(f)setTimeout(()=>f.focus(),30);}
function hideOv(){ov.classList.remove('show');ov.innerHTML='';ovMode=null;if(S)S.panel=null;}
function openPanel(name){S.panel=name;refreshPanel();}
function refreshPanel(){
  const f={map:mapHtml,journal:journalHtml,camp:campHtml,genome:genomeHtml,bench:benchHtml,stats:statsBoardHtml,pantry:pantryHtml,rack:rackHtml,nest:nestHtml,pack:packHtml,help:helpHtml,garage:garageHtml,log:logHtml,menu:menuHtml,bp:bpHtml}[S.panel];
  if(f){const sc=ov.querySelector('.card');const top=sc?sc.scrollTop:0;showOv(f(),'panel');const nc=ov.querySelector('.card');if(nc)nc.scrollTop=top;}
}
function openGenome(tab){S.splicePick=[];if(tab)S.gtab=tab;openPanel('genome');}
function openWorkbench(){openPanel('bench');}
function openStats(){openPanel('stats');}
function openPantry(){openPanel('pantry');}
function openRack(){openPanel('rack');}
function openBasePanel(){
  if(S.mode==='monster'){if(!S.atBase){toast('Get back to the nest to evolve.');return;}openPanel('nest');return;}
  if(S.P.sc!=='base'){toast('Walk through the door of your '+TIERS[S.tier].name.toLowerCase()+' to use the workbench.');return;}
  openWorkbench();
}
const head=(eyebrow,title,col)=>`<div class="ph"><div><div class="eyebrow">${eyebrow}</div><h2${col?` style="color:${col}"`:''}>${title}</h2></div><button class="x" data-a="close" aria-label="Close">✕</button></div>`;
function costHtml(c){return '<div class="cost">'+Object.keys(c).map(k=>`<span class="${S.res[k]>=c[k]?'ok':'no'}">${RES_ICON[k]} ${S.res[k]}/${c[k]} ${k}</span>`).join('')+'</div>';}

// ---------- Genome (DNA) ----------
function atLab(){return S.mode==='hunter'?S.P.sc==='base':S.atBase;}
function modSlots(id){if(TRAITS[id])return 0;const p=S.dna[id]||0;return p>=100?2:p>=40?1:0;}
function dnaBar(pct,col,trait){
  return trait?`<div class="dbar"><i style="width:${Math.min(100,pct)}%;background:${col}"></i></div><div class="tks"><span>unlocks at 100%</span></div>`
  :`<div class="dbar" title="40% = weak version unlocks · 100% = full power · 150% = mastered"><i style="width:${Math.min(100,pct/1.5)}%;background:${col}"></i><span class="tk" style="left:26.6%"></span><span class="tk" style="left:66.6%"></span></div>
    <div class="tks"><span style="left:26.6%">40 weak</span><span style="left:66.6%">100 full</span><span>150 max</span></div>`;
}
const STAGE_COL={locked:'#555',weak:'#ffb347',full:'#7dff9a','full power':'#7dff9a',mastered:'#ffd166',unlocked:'#7dff9a'};
function stagePill(id){const s=stageName(id);return `<span class="lvl" style="background:${STAGE_COL[s]||'#555'};color:#111" title="${{locked:'Not unlocked yet. Needs 40% DNA.',weak:'Weak version: works, but weaker and slower. Reach 100% for full power.','full power':'Full strength. Reach 150% to master it.',mastered:'Mastered: strongest version, with an extra bonus.',unlocked:'Unlocked: wear it in a trait slot.'}[s]||''}">${s.toUpperCase()}</span>`;}
function dnaCard(id){
  const p=POWERS[id],pct=Math.round(S.dna[id]||0),owned=pct>=40||p.hybrid,j=S.slots.indexOf(id),src=SRC[id];
  const mods=S.gmods[id]||[],ms=modSlots(id),vial=S.vault.filter(v=>v.gene===id).length;
  const status=owned?(j>=0?`<div class="st ok">✅ On key ${j+1}. Press ${j+1} in the game to use it.</div>`:`<div class="st go">👉 Ready! Pick a key below to equip it.</div>`)
    :`<div class="st no">🔒 Needs ${Math.ceil(40-pct)}% more DNA to unlock.</div>`;
  const grow=p.hybrid?'Spliced hybrid.':pct>=150?'Fully mastered.':pct>=100?Math.ceil(150-pct)+'% more DNA to master it.':pct>=40?Math.ceil(100-pct)+'% more DNA for full power.':'';
  const modHtml=ms?`<div class="mods"><small title="Gene mods are extra upgrades for one power. Mod slots open at 40% and 100% DNA. Add one at the DNA Lab with 1 mutagen, or win one with a perfect sequence.">Gene mods (extra upgrades) ⓘ</small><div class="row" style="gap:6px">${[0,1].slice(0,ms).map(i=>mods[i]?`<span class="tag" title="${GMODS[mods[i]].desc}">${GMODS[mods[i]].icon} ${GMODS[mods[i]].name}</span>`:`<span class="tag mute">empty</span>`).join('')}
    ${mods.length<ms?`<button class="btn sm ghost" data-a="addmod" data-id="${id}" ${S.res.mutagen>=1&&atLab()?'':'disabled'} title="${atLab()?(S.res.mutagen>=1?'Uses 1 mutagen':'You need 1 mutagen 🧪'):'Only at the DNA Lab in your base'}">+ Add mod (1 🧪)</button>`:''}</div></div>`:'';
  return `<div class="gc ${owned?'':'locked'} ${j>=0?'on':''}" style="--c:${p.color}">
    <div class="top"><div class="ic">${p.icon}</div><div class="nm"><b>${p.name}</b><small title="${FAM[p.fam].name} family">${FAM[p.fam].icon} ${FAM[p.fam].name}${p.fam2?' + '+FAM[p.fam2].name:''}${p.ult?' · <b style="color:var(--gold)">ULTIMATE</b>':''}</small></div>${stagePill(id)}</div>
    ${status}
    <p class="what">${p.desc} <span class="mute">(${Math.round(p.cd*10)/10}s cooldown)</span></p>
    ${p.hybrid?'':dnaBar(pct,p.color)}
    ${p.hybrid?'':`<small><b style="color:var(--ink)">${pct}% DNA.</b> ${grow}</small>`}
    ${p.hybrid?'':`<small>🗡️ Get DNA from: <b style="color:var(--ink)">${src||'unknown monster'}</b>${vial?` · <b style="color:var(--gold)">🧪 ${vial} strand${vial>1?'s':''} waiting in your Vault</b>`:''}</small>`}
    ${p.curse?`<small style="color:var(--blood)">Curse: ${CURSES[p.curse].name}. ${CURSES[p.curse].desc}.</small>`:''}
    ${modHtml}
    ${owned?`<div class="eq"><small>Put on key:</small>${[0,1,2].map(i=>`<button class="btn sm ${S.slots[i]===id?'gold':'ghost'}" data-a="eqs" data-id="${id}" data-i="${i}" title="${S.slots[i]===id?'Already on key '+(i+1):S.slots[i]?'Replaces '+POWERS[S.slots[i]].name:'Key '+(i+1)+' is empty'}">${i+1}</button>`).join('')}</div>`:''}</div>`;
}
function traitCard(id){
  const t=TRAITS[id],pct=Math.round(S.dna[id]||0),owned=pct>=100,j=S.traits.indexOf(id),col=FAM[t.fam].color,vial=S.vault.filter(v=>v.gene===id).length;
  return `<div class="gc ${owned?'':'locked'} ${j>=0?'on':''}" style="--c:${col}">
    <div class="top"><div class="ic">${t.icon}</div><div class="nm"><b>${t.name}</b><small>${FAM[t.fam].icon} ${FAM[t.fam].name} trait</small></div>${stagePill(id)}</div>
    ${owned?(j>=0?`<div class="st ok">✅ Wearing it (slot T${j+1}). It's always on.</div>`:`<div class="st go">👉 Ready! Wear it below.</div>`):`<div class="st no">🔒 Needs ${Math.ceil(100-pct)}% more DNA to unlock.</div>`}
    <p class="what">${t.desc}</p>${dnaBar(pct,col,true)}<small><b style="color:var(--ink)">${pct}% DNA.</b></small>
    <small>🗡️ Get DNA from: <b style="color:var(--ink)">${SRC[id]||'unknown monster'}</b>${vial?` · <b style="color:var(--gold)">🧪 ${vial} in your Vault</b>`:''}</small>
    ${owned?`<div class="eq"><small>Wear in:</small>${[0,1].map(i=>`<button class="btn sm ${S.traits[i]===id?'gold':'ghost'}" data-a="eqt" data-id="${id}" data-i="${i}">T${i+1}</button>`).join('')}</div>`:''}</div>`;
}
const GTABS=[['powers','🧬','My Powers','Powers you can put on keys 1, 2, 3'],['traits','🧷','Traits','Always-on bonuses'],['vault','🧪','Vault','Strands waiting to be used'],['seq','🔬','Sequencer','Lab tests for full DNA (cabin only)'],['splice','✂️','Splice Lab','Combine two powers into one']];
/* genomeTabs: replaced later */
function dnaNext(){
  const empty=S.slots.indexOf(null)>=0||S.slots.some(x=>!x),ready=Object.keys(S.dna).filter(id=>POWERS[id]&&(S.dna[id]>=40||POWERS[id].hybrid)&&!S.slots.includes(id));
  const readyT=Object.keys(S.dna).filter(id=>TRAITS[id]&&S.dna[id]>=100&&!S.traits.includes(id)),emptyT=S.traits.some(x=>!x);
  const n=S.vault.length;
  if(Object.keys(S.stolen).length)return [0,'🩸 A monster stole '+Object.keys(S.stolen).map(id=>POWERS[id].name).join(', ')+'. Kill the monster carrying it (it glows that power\'s color) to get it back.',null];
  if(n&&atLab()&&S.mode==='hunter')return [2,`You're at the DNA Lab and have <b>${n} strand${n>1?'s':''}</b>. Sequence them for full strength.`,['seq','Open the Sequencer']];
  if(n)return [2,`You have <b>${n} strand${n>1?'s':''}</b> in your Vault. Absorb them now for half strength, or carry them home to the DNA Lab for full strength.`,['vault','Open the Vault']];
  if(ready.length&&empty)return [3,`<b>${POWERS[ready[0]].icon} ${POWERS[ready[0]].name}</b> is ready but not on a key. Click a number on its card to equip it.`,['powers','Show my powers']];
  if(readyT.length&&emptyT)return [3,`<b>${TRAITS[readyT[0]].icon} ${TRAITS[readyT[0]].name}</b> is unlocked. Wear it in a trait slot.`,['traits','Show my traits']];
  return [0,'Hunt monsters to collect more DNA. Each kind of monster gives different powers. Hover over a monster to see what it drops.',null];
}
/* genomeHtml: replaced later */
/* powersTab: replaced later */
/* traitsTab: replaced later */
function vialRow(v,actions){
  const g=geneInfo(v.gene),Q=QUAL[v.q],raw=Math.round(v.val*.5),left=S.tier>=3?'never spoils':(3-v.age)+' day'+(3-v.age===1?'':'s')+' until it spoils';
  return `<div class="wp"><div class="ic" style="border-color:${g.color};box-shadow:0 0 10px ${g.color}55">${g.icon}</div><div><b style="font-size:18px">${g.name}</b> <span class="tag" style="color:${Q.col}" title="Better quality strands give more DNA. Rough < Clean < Pure.">${Q.name.toUpperCase()}</span>${g.trait?' <span class="tag">TRAIT</span>':''}
    <small>You have ${Math.round(S.dna[v.gene]||0)}% now · ${left}</small><small>Absorb raw: <b style="color:var(--ink)">+${raw}%</b> · Sequence in your cabin: <b style="color:var(--ink)">up to +${Math.round(v.val*1.6)}%</b></small></div>
    <div class="row">${actions(v)}</div></div>`;
}
/* vaultTab: replaced later */
/* spliceTab: replaced later */
function spliceHtml(){return '';}
// ---------- Base stations ----------
function benchHtml(){
  const next=TIERS[S.tier+1];
  return `<div class="card">${head('Workbench · Day '+S.day,TIERS[S.tier].name)}
  <p class="mute" style="margin-top:4px">${TIERS[S.tier].perk.replace(/\.?$/,'.')} Base HP ${Math.round(S.baseHp)} / ${baseMax()}.</p>
  <div class="cols"><section><h3>Build next</h3>${next?`<b style="font-size:20px">${next.name}</b><p class="mute" style="margin:4px 0">${next.perk}</p>${costHtml(next.cost)}
    <button class="btn" data-a="upgrade" ${canPay(next.cost)?'':'disabled'}>Build the ${next.name}</button>`:'<p>Your base is fully built. Install modules below.</p>'}</section>
  <section><h3>Repairs &amp; ammo</h3>
    <div class="act"><div>Patch the walls<small>2 wood + 1 scrap → +80 base HP</small></div><button class="btn sm" data-a="repair" ${S.res.wood>=2&&S.res.scrap>=1&&S.baseHp<baseMax()?'':'disabled'}>Repair</button></div>
    <div class="act"><div>Board every window<small>3 wood → all windows back to full</small></div><button class="btn sm" data-a="board" ${S.res.wood>=3&&S.windows.some(w=>w.hp<winMax())?'':'disabled'}>Board up</button></div>
    <div class="act"><div>Make ammo<small>2 scrap → 6 ammo (you have ${S.res.ammo})</small></div><button class="btn sm" data-a="ammo" ${S.res.scrap>=2?'':'disabled'}>Make</button></div>
  </section></div>${rigHtml()}</div>`;
}
function rigHtml(){
  if(S.tier<4)return '';
  const mods=Object.keys(MODS).filter(k=>k!=='rack').map(k=>{const M=MODS[k],have=S.mods[k];
    return `<div class="act"><div>${M.name}${have?' <span class="tag">INSTALLED</span>':''}<small>${M.desc}</small>${have?'':costHtml(M.cost)}</div><button class="btn sm" data-a="mod" data-k="${k}" ${!have&&canPay(M.cost)?'':'disabled'}>${have?'Done':'Install'}</button></div>`;}).join('');
  return `<section style="margin-top:12px"><h3>Base modules</h3>${mods}<p class="mute" style="margin:8px 0 0">To leave town, fix the truck at the Garage 🔧.</p></section>`;
}
function rackHtml(){
  const rows=Object.keys(WEAPONS).map(w=>{const W=WEAPONS[w],own=S.weapons.includes(w),eq=S.weapons[S.wpn]===w;
    const stats=W.ranged?`${W.pellets>1?W.pellets+' × ':''}${W.dmg} damage · ${W.range} range · uses ammo`:`${W.dmg} damage · ${W.range} reach · smashes furniture ×${W.brk}`;
    return `<div class="wp"><div class="ic">${W.icon}</div><div><b style="font-size:19px">${W.name}</b>${eq?' <span class="tag">IN HAND</span>':''}<small>${stats}</small><small>${W.desc}</small>${!own&&W.cost?costHtml(W.cost):''}</div>
    ${own?`<button class="btn sm ${eq?'ghost':''}" data-a="wield" data-w="${w}" ${eq?'disabled':''}>${eq?'Holding':'Hold'}</button>`:W.cost?`<button class="btn sm" data-a="craft" data-w="${w}" ${canPay(W.cost)?'':'disabled'}>Craft</button>`:''}</div>`;}).join('');
  return `<div class="card">${head('Weapon rack · Q switches weapons anywhere','Weapons')}<p class="mute" style="margin-top:6px">You have ${S.res.ammo} ammo. Weapons can also turn up when you search containers.</p>${rows}</div>`;
}
function statsBoardHtml(){
  const s=S.stats,owned=Object.keys(S.dna).filter(id=>S.dna[id]>=40).length,keys=Object.keys(S.keys).length;
  return `<div class="card">${head('Stat board','How you\'re doing')}
  <div class="stats">
    <div><b style="color:var(--blood)">${'❤'.repeat(S.lives)}${'♡'.repeat(Math.max(0,3-S.lives))}</b><span>Lives left</span></div>
    <div><b>${Math.round(S.P.hp)}/${maxHp()}</b><span>Health</span></div>
    <div><b style="color:var(--human)">${Math.round(S.humanity)}</b><span>Humanity</span></div>
    <div><b>${Math.round(S.baseHp)}/${baseMax()}</b><span>Base HP</span></div>
    <div><b>${s.days}</b><span>Days survived</span></div>
    <div><b>${s.kills}</b><span>Monsters killed</span></div>
    <div><b>${owned}</b><span>Powers unlocked</span></div>
    <div><b>${s.searched}</b><span>Things searched</span></div>
    <div><b>${s.broken}</b><span>Furniture smashed</span></div>
    <div><b>${S.weapons.length}</b><span>Weapons</span></div>
    <div><b>${keys}</b><span>Car keys found</span></div>
    <div><b>${TOWNS[S.town].name}</b><span>Town ${S.town+1}</span></div>
  </div>
  <h3>Your crew (${S.crew.length}/4)</h3>${S.crew.length?S.crew.map(m=>`<div class="act"><div>${ROLES[m.role].icon} <b>${m.name}</b> · ${ROLES[m.role].name}<small>${ROLES[m.role].desc}</small></div></div>`).join(''):'<p class="mute">No crew yet. Recruit survivors at camps.</p>'}
  <p class="mute">You get one life back each time you reach a new town. Lose all three and the run is over.</p></div>`;
}
function pantryHtml(){
  return `<div class="card">${head('Pantry','Food & Medicine')}
  <section style="margin-top:12px">
    <div class="act"><div>Eat a meal<small>1 food → +35 HP. You also eat 1 food every dawn automatically.</small></div><button class="btn sm" data-a="eat" ${S.res.food>=1?'':'disabled'}>Eat (${S.res.food})</button></div>
    <div class="act"><div>First aid<small>1 meds → +45 HP. Press H anywhere to do this.</small></div><button class="btn sm" data-a="heal" ${S.res.meds>=1?'':'disabled'}>Patch up (${S.res.meds})</button></div>
    <div class="act"><div>Suppressant shot<small>2 meds → +15 humanity. Slows down what's happening to you.</small></div><button class="btn sm" data-a="supp" ${S.res.meds>=2&&S.humanity<100?'':'disabled'}>Inject</button></div>
  </section><p class="mute" style="margin-top:10px">Humanity ${Math.round(S.humanity)}. Every power you absorb pushes it down.</p></div>`;
}
function nestHtml(){
  const evo=Object.keys(EVO).map(k=>{const c=k==='nest'?10:EVO[k].base+S.evo[k]*6;const dis=S.biomass<c||(k==='nest'&&(S.nestDead||S.nestHp>=NEST_MAX));
    return `<div class="act"><div>${EVO[k].name}${k!=='nest'?' <span class="tag">LV '+S.evo[k]+'</span>':''}<small>${EVO[k].desc} · ${c} 🧬</small></div><button class="btn sm mon" data-a="evo" data-k="${k}" ${dis?'disabled':''}>Evolve</button></div>`;}).join('');
  return `<div class="card">${head('The nest · Night hunt '+S.day,'The Shackwraith\'s Nest','var(--monster)')}
    <p class="mute" style="margin-top:4px">${S.nestDead?'The nest is burned. You can no longer respawn.':'Nest HP '+Math.round(S.nestHp)+' / '+NEST_MAX+'. You heal fast in here.'} Press Tab to swap powers.</p>
    <div class="cols"><section><h3>Evolve <small>${S.biomass} 🧬 biomass</small></h3>${evo}</section>
    ${tlog().claimed&&TOWNS[S.town+1]?`<section style="margin-bottom:12px;border-color:var(--monster)"><h3>Migrate</h3><p>${TOWNS[S.town].name} is claimed. The swarm can move on to <b>${TOWNS[S.town+1].name}</b>.</p><button class="btn mon" data-a="migrate">Migrate to ${TOWNS[S.town+1].name}</button></section>`:''}
    <section><h3>What they've learned</h3>${S.resist.length?'<ul>'+S.resist.map(id=>`<li>${ADAPT[id]||'countermeasures'} vs <b>${POWERS[id].name}</b></li>`).join('')+'</ul>':'<p class="mute">Nothing yet. Each time an outpost falls, the survivors adapt to the power you used most since the last one.</p>'}
    <p class="mute" style="font-size:15px;margin-top:8px">Fear ${Math.round(S.fear)}%. At 60%+ scavengers bolt on sight and hunters shoot slower.</p></section></div></div>`;
}
function packHtml(){
  const cap=CARGO+(S.mods.rack?10:0),used=Object.values(S.pack).reduce((a,b)=>a+b,0),T=TOWNS[S.town],N=TOWNS[destTown()],lost=Object.keys(S.stolen);
  const rows=Object.keys(S.res).map(k=>{const have=Math.max(0,S.res[k]);
    return `<div class="act"><div>${RES_ICON[k]} ${k}<small>${have} available</small></div><div class="row">
    <button class="btn sm ghost" data-a="pk" data-k="${k}" data-d="-1" ${S.pack[k]>0?'':'disabled'} aria-label="Less ${k}">−</button>
    <b style="min-width:32px;text-align:center;font-size:20px;font-variant-numeric:tabular-nums">${S.pack[k]}</b>
    <button class="btn sm ghost" data-a="pk" data-k="${k}" data-d="1" ${S.pack[k]<have&&used<cap?'':'disabled'} aria-label="More ${k}">+</button></div></div>`;}).join('');
  return `<div class="card">${head('Leaving '+T.name,'Load the truck')}
    <p class="mute" style="margin-top:4px">Cargo ${used} / ${cap}. Whatever doesn't fit stays in ${T.name}. Your powers, weapons and DNA come with you.</p>
  ${lost.length?`<p style="color:var(--blood)">Still held by monsters, gone for good if you leave: ${lost.map(id=>POWERS[id].name).join(', ')}.</p>`:''}
  <section>${rows}</section><div class="row" style="margin-top:14px"><button class="btn big" data-a="drive">Drive to ${N.name}</button><button class="btn ghost" data-a="unpack">Not yet</button></div></div>`;
}

// ================= STORY CARDS =================
function showJournal(){
  showOv(`<div class="card story"><div class="eyebrow">Inside ${TOWNS[S.town].lair}</div><h1 style="font-size:clamp(44px,8vw,80px)">The Journal</h1>
  <p>Behind the nest, wrapped in a tarp, there's a journal. The handwriting is yours.</p>
  <p><em>"Don't stay in Millbrook. Fix the truck. Take only what fits. Drive south to Saltmarsh, and whatever you do, stay away from the lighthouse. That's where it happened last time."</em></p>
  <p>The last entry is dated three weeks from now.</p>
  <button class="btn big" data-a="close">Keep going</button></div>`,'story');
}
function showTravel(){const T=TOWNS[S.town],N=TOWNS[destTown()],back=tlog(destTown()).visited;
  showOv(`<div class="card story"><div class="eyebrow">On the road</div><h1 style="font-size:clamp(44px,8vw,80px)">Leaving ${T.name}</h1>
  <p>The truck coughs, shudders, and rolls. ${T.name} shrinks in the mirror until it's just a water tower against the sky.</p>
  <p>${back?'The road back to '+N.name+' is familiar now. You wonder what changed while you were gone.':(TRAVEL_TEXT[N.name]||'The road goes on.')}</p>
  <button class="btn big" data-a="arrive">Park the truck</button></div>`,'story');}
/* showStateCard: replaced later */
function storyStateText(si){
  const p=pathName();
  if(si===0)return `<p>The Warden falls apart into a hundred smaller things that crawl away into the dark. Inside its chest is a journal. The handwriting is yours.</p><p><em>"${p==='Apex'?'You did it. You became what it was. Now there\'s room for you at the top.':p==='Hunter'?'You stayed human. That has never happened before. Keep going. The cure is real.':'You found the balance. Vance knows the way to the Source. Trust him.'}"</em></p>`;
  return `<p>The Mesa Warden screams one word before it dies: <em>"Source."</em> Somewhere past the coast, the first absorber knows your name now.</p><p>Your path so far: <b style="color:var(--gold)">${p}</b>.</p>`;
}
function showTurnStory(){
  S.mode='turn';
  const early=S.turnReason==='humanity',T=TOWNS[S.town],BN=MONSTERS[T.boss].name;
  const onames=T.outposts.slice(0,3).map(id=>S.blds.find(x=>x.id===id).name).join(', ');
  showOv(`<div class="card story"><div class="eyebrow">Act II</div><h1 class="mon">The Apex</h1>
    ${early?`<p>You absorbed one power too many. The last human part of you goes quiet, like a radio someone finally switched off.</p>${S.bossDead?'<p>Out in the dark, every monster in town turns to face you. <em>Then they bow.</em></p>':`<p>Up in ${T.lair}, ${BN} lowers her head. Not to fight. <em>To bow.</em></p>`}`
    :`<p>${BN} collapses, and everything she was pours into you.</p>`}
    <p>In ${T.lair} you find ${S.town>0?'another':'a'} journal. The handwriting is yours. Every entry ends the same way: <em>"If you're reading this, it already happened."</em></p>
    <p>Three weeks later, survivors from the next county move into ${T.name}. They board up ${onames}, and more. They've heard something lives in the old ${TIERS[Math.min(S.tier,3)].name.toLowerCase()}. They call it <em>the Shackwraith</em>.</p>
    <p>They're right.</p>
    <p class="mute" style="font-size:17px">Now you're the monster. Break the ${T.outposts.length} survivor outposts, feed on biomass to evolve, and defend your nest when they come to burn it. Every power you've collected comes with you.</p>
    <button class="btn big mon" data-a="turn">Become the monster</button></div>`,'story');
}
function statsHtml(){const s=S.stats;return `<div class="stats">
  <div><b>${s.days}</b><span>Days survived</span></div><div><b>${s.kills}</b><span>Monsters slain</span></div>
  <div><b>${s.powers}</b><span>Powers absorbed</span></div><div><b>${s.searched}</b><span>Things searched</span></div>
  <div><b>${s.humans}</b><span>Survivors taken</span></div><div><b>${s.outposts}/${TOWNS[S.town].outposts.length}</b><span>Outposts fallen</span></div></div>`;}
function gameOver(reason){
  S.mode='over';clearSave();sfx('bad');
  showOv(`<div class="card"><div class="eyebrow">${TOWNS[S.town].name}</div><h1 style="color:var(--blood)">Game Over</h1><p class="sub">${reason}</p>${statsHtml()}
  <button class="btn big" data-a="start">Start over</button></div>`,'over');
}
function winGame(){
  S.mode='won';
  showOv(`<div class="card story"><div class="eyebrow">Town ${S.town+1} · ${TOWNS[S.town].name}</div><h1 class="mon">${TOWNS[S.town].name} Is Yours</h1>
  <p>The last outpost is ash. Vance's journal is in your claws, and his last entry is about <em>you</em>.</p>
  <p>Somewhere past the county line, the <em>State Warden</em> opens its eyes. It remembers you. You have done this before.</p>
  ${statsHtml()}
  <p class="mute" style="font-size:16px">End of the prototype. Next up: the first State Warden.</p>
  <button class="btn big mon" data-a="start">Play again</button></div>`,'over');
}
function showTitle(keep){
  if(!keep){newGame();S.mode='title';}
  const sv=saveInfo(),ap=activeProfile();
  const profileOptions=PROFILES.map(p=>{const d=profileSaveInfo(p.id),progress=d?' · '+(TOWNS[d.town]?TOWNS[d.town].name:'Unknown town')+' · day '+(d.day||1):' · new';return `<option value="${p.id}" ${p.id===ACTIVE_PROFILE_ID?'selected':''}>${profileHtml(p.name)}${progress}</option>`;}).join('');
  showOv(`<div class="card"><div class="eyebrow">The United Wastes · Millbrook</div><h1>Splice</h1>
  <p class="sub">Hunt the monsters. Steal their DNA. Try not to become one.</p>
  <div class="row" style="margin-bottom:10px"><label class="mute" for="player-profile">Player profile</label><select id="player-profile" data-profile>${profileOptions}</select><button class="btn sm ghost" data-a="newprofile">New profile</button>${ap.id!=='default'?'<button class="btn sm ghost" data-a="deleteprofile">Delete profile</button>':''}</div>
  <div class="row" style="margin-bottom:14px">${sv?`<button class="btn big gold" data-a="load">Continue · ${TOWNS[sv.town]?TOWNS[sv.town].name:''}, day ${sv.day}${sv.mode==='monster'?' (monster)':''}</button>`:''}
    <button class="btn big" data-a="start" data-mode="story">${sv?'New story':'Story mode'}</button><button class="btn big ghost" data-a="start" data-mode="conquest">Conquest mode</button></div>
  <div class="row" style="margin-bottom:6px"><b class="mute" style="margin-right:6px">Difficulty</b>${Object.keys(DIFFS).map(k=>`<button class="btn sm ${TITLE_DIFF===k?'gold':'ghost'}" data-a="diff" data-d="${k}">${DIFFS[k].name} · ${DIFFS[k].desc}</button>`).join('')}
    <button class="btn sm ghost" data-a="snd" style="margin-left:auto">Sound: ${SND?'on':'off'}</button></div>
  <p class="mute" style="font-size:15px">Story mode has chapters, big choices and three endings: Hunter, Apex, and a hidden one. Conquest mode is pure survival with no story choices. The game saves at every dawn and whenever you go home.</p>
  <div class="cols"><section><h3>How it works</h3><ul>
    <li>Walk through doors to go inside buildings. <b>Hold E</b> on containers to search them. <b>Smash furniture</b> for materials.</li>
    <li>Every building has a monster. Monsters drop <b>DNA strands</b>. Absorb them, or sequence them at your base's DNA Lab for full strength.</li>
    <li>Visit <b>survivor camps</b> for trades, jobs and recruits. How they treat you depends on how human you still are.</li>
    <li>Kill each town's boss to <b>liberate</b> it, fix the truck at the Garage, and drive on. Beat the <b>State Warden</b> to conquer a state.</li>
    <li>You have limited <b>lives</b>. Every power you absorb costs a little <b>humanity</b>.</li></ul></section>
  <section><h3>Controls</h3><div class="keys">
    <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><span>Move or drive</span>
    <span><kbd>Mouse</kbd> / <kbd>Click</kbd></span><span>Aim / attack (Space too)</span>
    <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></span><span>Use powers</span>
    <span><kbd>E</kbd></span><span>Search (hold), talk, use, hide, drive</span>
    <span><kbd>Tab</kbd></span><span>DNA: powers, vault, sequencer, splicing</span>
    <span><kbd>M</kbd> · <kbd>J</kbd></span><span>Conquest map · Journal</span>
    <span><kbd>Q</kbd> · <kbd>H</kbd></span><span>Switch weapon · Use meds</span>
    <span><kbd>P</kbd> · <kbd>N</kbd></span><span>Pause · Sound on/off</span></div>
    <p class="mute" style="margin-top:10px;font-size:15px">Gamepads work too: left stick moves, right stick aims, RT attacks, A interacts, X/Y/B are powers, Back opens DNA.</p></section></div></div>`,'title');
}

// ================= ACTIONS =================
ov.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;act(t.dataset.a,t.dataset);});
ov.addEventListener('change',e=>{const t=e.target.closest('[data-profile]');if(t){setGameProfile(t.value);showTitle(true);}});
function act(a,d){
  if(a==='load'){audioInit();hideOv();if(!loadGame())showTitle();return;}
  if(a==='newprofile'){const name=prompt('Name this player profile (up to 24 characters):');if(name===null)return;if(!addGameProfile(name)){alert('Enter a unique profile name.');return;}showTitle(true);return;}
  if(a==='deleteprofile'){const p=activeProfile();if(p.id!=='default'&&confirm('Delete '+p.name+' and this profile\'s saved game?')){deleteGameProfile(p.id);showTitle(true);}return;}
  if(a==='profile'){setGameProfile(d.id);showTitle(true);return;}
  if(a==='diff'){TITLE_DIFF=d.d;showTitle(true);return;}
  if(a==='snd'){SND=!SND;try{localStorage.setItem('splice_sound',SND?'on':'off');}catch(e){}showTitle(true);return;}
  if(a==='start'){if(saveInfo()&&!confirm('Start a new game in '+activeProfile().name+' and replace this profile\'s saved game?'))return;audioInit();newGame({story:d.mode!=='conquest',diff:TITLE_DIFF});hideOv();banner('DAY 1','You wake up in a rickety shack. Walk out the door and find supplies.','#ffd166');
    toast('WASD to move · mouse to aim · click or Space to swing.');toast('Walk into a building\'s door to go inside. Hold E to search containers.');toast('The workbench, DNA lab, bed and pantry are right here in your shack. Press E next to them.');return;}
  if(a==='turn'){hideOv();startMonsterMode();return;}
  if(a==='choice'){hideOv();applyChoice(d.c,d.o);return;}
  if(a==='close'){hideOv();return;}
  if(!S)return;
  if(a==='mapsel'){S.mapSel=+d.i;refreshPanel();return;}
  if(a==='migrate'){hideOv();migrateTown();return;}
  if(a==='continue'){hideOv();return;}
  if(S.panel==='camp'){const r=campAct(a,d);if(r==='closed')return;if(r){refreshPanel();return;}}
  if(a==='leave'){S.pack={};const cap=CARGO+(S.mods.rack?10:0);let used=0;Object.keys(S.res).forEach(k=>S.pack[k]=0);
    const order=['food','meds','fuel','ammo','wire','scrap','wood'],hv=k=>Math.max(0,S.res[k]);let moved=true;
    while(used<cap&&moved){moved=false;for(const k of order){if(used<cap&&S.pack[k]<hv(k)){S.pack[k]++;used++;moved=true;}}}
    openPanel('pack');return;}
  if(a==='pk'){const k=d.k,dd=+d.d,cap=CARGO+(S.mods.rack?10:0),used=Object.values(S.pack).reduce((x,y)=>x+y,0),have=Math.max(0,S.res[k]);
    if(dd<0)S.pack[k]=Math.max(0,S.pack[k]-1);else if(used<cap&&S.pack[k]<have)S.pack[k]++;refreshPanel();return;}
  if(a==='unpack'){openPanel('bench');return;}
  if(a==='drive'){if(S.mode==='hunter')leaveTownMemory();S.res={...S.pack};showTravel();return;}
  if(a==='arrive'){hideOv();arriveTown();return;}
  if(a==='mod'){const M=MODS[d.k];if(M&&!S.mods[d.k]&&canPay(M.cost)){pay(M.cost);S.mods[d.k]=true;if(d.k==='armor')S.baseHp+=250;banner(M.name.toUpperCase()+' INSTALLED',M.desc,'#b8e04a');}}
  if(a==='upgrade'){const n=TIERS[S.tier+1];if(n&&canPay(n.cost)){pay(n.cost);S.tier++;S.maxTier=Math.max(S.maxTier||0,S.tier);S.baseHp=baseMax();S.P.hp=maxHp();makeBaseInterior();S.windows.forEach(w=>w.hp=winMax());
    const B=S.baseInt;teleport(S.P,B.x+B.w/2,B.y+B.h-90,'base');S._sol={};banner(n.name.toUpperCase()+' BUILT',n.perk,'#b8e04a');}}
  if(a==='eat'&&S.res.food>=1){S.res.food--;healPlayer(35);}
  if(a==='heal'&&S.res.meds>=1){S.res.meds--;healPlayer(45);}
  if(a==='supp'&&S.res.meds>=2){S.res.meds-=2;S.humanity=Math.min(100,S.humanity+15);S.hstage=S.humanity<25?3:S.humanity<50?2:S.humanity<75?1:0;}
  if(a==='repair'&&S.res.wood>=2&&S.res.scrap>=1){S.res.wood-=2;S.res.scrap-=1;S.baseHp=Math.min(baseMax(),S.baseHp+80);}
  if(a==='board'&&S.res.wood>=3){S.res.wood-=3;S.windows.forEach(w=>w.hp=winMax());}
  if(a==='ammo'&&S.res.scrap>=2){S.res.scrap-=2;S.res.ammo+=6;}
  if(a==='craft'){const W=WEAPONS[d.w];if(W&&W.cost&&canPay(W.cost)&&!S.weapons.includes(d.w)){pay(W.cost);S.weapons.push(d.w);S.wpn=S.weapons.length-1;if(W.ranged)S.res.ammo+=6;toast('Crafted the '+W.name+'. It\'s in your hands.','good');}}
  if(a==='wield'){const i=S.weapons.indexOf(d.w);if(i>=0)S.wpn=i;}
  if(a==='eqs'){const id=d.id,i=+d.i,j=S.slots.indexOf(id);if(j>=0)S.slots[j]=S.slots[i];S.slots[i]=id;}
  if(a==='clr')S.slots[+d.i]=null;
  if(a==='eqt'){const id=d.id,i=+d.i,j=S.traits.indexOf(id);if(j>=0)S.traits[j]=S.traits[i];S.traits[i]=id;}
  if(a==='clrt')S.traits[+d.i]=null;
  if(a==='gtab'){S.gtab=d.t;if(d.t==='seq'&&S.seq&&S.seq.done)S.seq=null;if(d.t!=='splice')S.splicePick=[];}
  if(a==='gfam')S.gfam=d.f;
  if(a==='absorb'){const v=S.vault.find(x=>x.id==d.v);if(v){S.vault=S.vault.filter(x=>x!==v);addDNA(v.gene,Math.round(v.val*.5));}}
  if(a==='absorbAll'){const vs=S.vault;S.vault=[];vs.forEach(v=>addDNA(v.gene,Math.round(v.val*.5)));}
  if(a==='seqStart'&&atLab())seqStart(d.v);
  if(a==='seqKey')seqPress(d.b);
  if(a==='seqAct'){seqActIn(d);return;}
  if(a==='seqGo'){seqGo();return;}
  if(a==='seqPractice'){S.seq=null;seqStart('practice',d.g);refreshPanel();return;}
  if(a==='logcat'){S.logCat=d.c;refreshPanel();return;}
  if(garageAct(a,d)){refreshPanel();return;}
  if(menuAct(a))return;
  if(a==='addmod'){const id=d.id,cur=S.gmods[id]||[];if(S.res.mutagen>=1&&atLab()&&cur.length<modSlots(id)){S.res.mutagen--;const m=pick(Object.keys(GMODS).filter(x=>!cur.includes(x)));S.gmods[id]=cur.concat(m);toast('Mutagen worked: '+POWERS[id].name+' is now '+GMODS[m].name+' ('+GMODS[m].desc+').','good');}}
  if(a==='evo'){const k=d.k,c=k==='nest'?10:EVO[k].base+S.evo[k]*6;if(S.biomass>=c){S.biomass-=c;if(k==='nest')S.nestHp=Math.min(NEST_MAX,S.nestHp+200);else S.evo[k]++;if(k==='hp')S.P.hp+=30;}}
  if(a==='spk'){const id=d.id,i=S.splicePick.indexOf(id);if(i>=0)S.splicePick.splice(i,1);else{S.splicePick.push(id);if(S.splicePick.length>2)S.splicePick.shift();}}
  if(a==='doSplice'&&S.splicePick.length===2&&atLab()&&(S.mode==='monster'||Math.max(S.tier,S.maxTier||0)>=3)){
    if(S.mode==='monster'){if(S.biomass<30)return;S.biomass-=30;}else{if(S.res.wire<2||S.res.meds<2)return;S.res.wire-=2;S.res.meds-=2;}
    doSplice(S.splicePick[0],S.splicePick[1]);S.splicePick=[];if(S.mode==='hunter')humanityHit(8);
    if(S.mode!=='hunter'&&S.mode!=='monster')return;}
  if(S.panel)refreshPanel();
}
