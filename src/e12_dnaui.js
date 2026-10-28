// ================= VISUAL DNA SCREENS: POWER DECK, TRAIT PINS, CRYO VAULT, SPLICE-TRON =================
const STAGE_TXT=['Locked','Weak','Full power','Mastered'];
function stageN(id){if(POWERS[id]&&POWERS[id].hybrid)return 2;const p=S.dna[id]||0;if(TRAITS[id])return p>=100?3:0;return p>=150?3:p>=100?2:p>=40?1:0;}
function gColor(id){const g=geneInfo(id);return g&&g.color?g.color:TRAITS[id]?FAM[TRAITS[id].fam].color:'#7dff9a';}
function stars(n){return '<span class="stars">'+'★'.repeat(n)+'<i>'+'★'.repeat(3-n)+'</i></span>';}
function pcard(id,kind){
  const g=geneInfo(id),hyb=POWERS[id]&&POWERS[id].hybrid,pct=Math.round(S.dna[id]||0),max=TRAITS[id]?100:150,st=stageN(id),owned=st>0||hyb;
  const slot=kind==='trait'?S.traits.indexOf(id):S.slots.indexOf(id),vial=S.vault.filter(v=>v.gene===id).length,sel=S.gpick===id,stolen=!!S.stolen[id];
  return `<div class="pc ${owned?'':'lk'} ${sel?'sel':''} ${kind==='trait'?'tr':''}" draggable="${owned}" data-a="gpick" data-id="${id}" data-kind="${kind}" style="--c:${gColor(id)}" title="${g.name}: ${g.desc||''}">
    <div class="ring" style="--p:${hyb?100:Math.min(100,pct/max*100)}"><span>${g.icon}</span></div>
    <b>${g.name}</b>${stars(st)}<small>${hyb?'spliced':pct+'%'}</small>
    ${slot>=0?`<span class="keytag">${kind==='trait'?'T'+(slot+1):slot+1}</span>`:''}${!owned?'<span class="lock">🔒</span>':''}${vial?`<span class="vialtag">🧪${vial}</span>`:''}${stolen?'<span class="stolen">STOLEN</span>':''}</div>`;
}
/* ghostCard: replaced later */
function sockets(kind){
  const arr=kind==='trait'?S.traits:S.slots,pk=S.gpick,want=pk&&stageN(pk)>0&&(kind==='trait'?!!TRAITS[pk]:!!POWERS[pk])&&!arr.includes(pk);
  return `<div class="socks">${arr.map((id,i)=>{const g=id&&geneInfo(id);
    return `<div class="sock ${kind==='trait'?'pin':''} ${id?'full':''} ${want?'want':''}" data-a="sock" data-kind="${kind}" data-i="${i}" style="--c:${id?gColor(id):'#2f8a4a'}" title="${id?g.name+'. Click ✕ to take it off.':'Empty. Drag a card here, or click a card and then this slot.'}">
      <span class="kn">${kind==='trait'?'T'+(i+1):i+1}</span>${id?`<span class="si">${g.icon}</span><b>${g.name}</b><button class="sx" data-a="${kind==='trait'?'clrt':'clr'}" data-i="${i}" title="Take it off">✕</button>`:`<span class="mute">${kind==='trait'?'empty pin':'empty key'}</span>`}</div>`;}).join('')}</div>`;
}
function detailDeck(kind){
  const id=S.gpick;if(!id||!geneInfo(id)||(kind==='trait')!==!!TRAITS[id])return `<div class="hint">👆 Click a card to see what it does. Drag a card onto a ${kind==='trait'?'pin':'key'} to equip it.</div>`;
  const g=geneInfo(id),st=stageN(id),hyb=POWERS[id]&&POWERS[id].hybrid,pct=Math.round(S.dna[id]||0),P=POWERS[id];
  const need=TRAITS[id]?(st?'':`🔒 ${Math.ceil(100-pct)}% more DNA to unlock`):st===0?`🔒 ${Math.ceil(40-pct)}% more DNA to unlock`:st===1?`⬆️ ${Math.ceil(100-pct)}% more for full power`:st===2&&!hyb?`⬆️ ${Math.ceil(150-pct)}% more to master it`:'🏆 Mastered!';
  const ms=TRAITS[id]?0:modSlots(id),mods=S.gmods[id]||[];
  const modRow=ms?`<div class="row" style="gap:6px;margin-top:6px"><span class="mute" title="Gene mods are extra upgrades for one power. Add one at the DNA Lab with 1 mutagen 🧪.">🧩 Mods:</span>${[0,1].slice(0,ms).map(i=>mods[i]?`<span class="tag" title="${GMODS[mods[i]].desc}">${GMODS[mods[i]].icon} ${GMODS[mods[i]].name}</span>`:'<span class="tag mute">empty</span>').join('')}${mods.length<ms?`<button class="btn sm ghost" data-a="addmod" data-id="${id}" ${S.res.mutagen>=1&&atLab()?'':'disabled'} title="${atLab()?'Uses 1 mutagen 🧪':'Only at the DNA Lab in your cabin'}">+ 🧪</button>`:''}</div>`:'';
  const btns=st>0||hyb?(kind==='trait'?[0,1].map(i=>arcBtn('T'+(i+1),`data-a="eqt" data-id="${id}" data-i="${i}"`,S.traits[i]===id?'#7dff9a':'#c27bff',S.traits[i]===id?'wearing':'wear here')).join(''):[0,1,2].map(i=>arcBtn(String(i+1),`data-a="eqs" data-id="${id}" data-i="${i}"`,S.slots[i]===id?'#7dff9a':'#ffd166',S.slots[i]===id?'on this key':'put on key')).join('')):'';
  return `<div class="detail"><div class="pc big" style="--c:${gColor(id)}"><div class="ring" style="--p:${hyb?100:Math.min(100,pct/(TRAITS[id]?100:150)*100)}"><span>${g.icon}</span></div>${stars(st)}</div>
    <div><h3 style="margin:0">${g.name} <small class="mute">${STAGE_TXT[st]}${hyb?' · spliced hybrid':''}</small></h3>
    <p style="margin:4px 0;font-size:17px">${g.desc||''}</p>
    <div class="row" style="gap:8px">${P?`<span class="tag">⏱ ${Math.round(P.cd*10)/10}s</span>`:'<span class="tag">Always on</span>'}${!hyb?`<span class="tag" title="Kill this monster to get DNA strands">🗡️ ${SRC[id]||'?'}</span>`:''}<span class="tag">${need}</span>${P&&P.curse?`<span class="tag" style="color:#ff8a95" title="${CURSES[P.curse].desc}">☠️ ${CURSES[P.curse].name}</span>`:''}</div>${modRow}</div>
    <div class="deckrow" style="justify-content:flex-end">${btns}</div></div>`;
}
function powersTab(){
  const base=Object.keys(POWERS).filter(id=>!POWERS[id].hybrid);
  const known=base.filter(id=>(S.dna[id]||0)>0||S.stolen[id]||S.vault.some(v=>v.gene===id)||(SRCTYPE[id]&&S.seen[SRCTYPE[id]]));
  const hyb=Object.keys(POWERS).filter(id=>POWERS[id].hybrid&&(S.dna[id]||0)>0);
  const by=(a,b)=>(S.dna[b]||0)-(S.dna[a]||0);
  const have=hyb.concat(known.filter(id=>(S.dna[id]||0)>0||S.stolen[id]||S.vault.some(v=>v.gene===id))).sort(by),seen=known.filter(id=>!have.includes(id));
  return machine(`🎮 POWER DECK · ${have.filter(id=>stageN(id)>0).length} ready · ${known.length}/${base.length} found`,
    `${sockets('power')}<div class="pdeck">${have.map(id=>pcard(id,'power')).join('')}${seen.map(ghostCard).join('')}${!have.length&&!seen.length?'<p class="mute">No DNA yet. Kill monsters and walk over the glowing strands they drop.</p>':''}</div>`,
    detailDeck('power'));
}
function traitsTab(){
  const known=Object.keys(TRAITS).filter(id=>(S.dna[id]||0)>0||S.vault.some(v=>v.gene===id)||(SRCTYPE[id]&&S.seen[SRCTYPE[id]]));
  return machine(`🎖️ TRAIT PINS · always on, no button · ${known.length}/${Object.keys(TRAITS).length} found`,
    `${sockets('trait')}<div class="pdeck">${known.map(id=>(S.dna[id]||0)>0||S.vault.some(v=>v.gene===id)?pcard(id,'trait'):ghostCard(id)).join('')||'<p class="mute">No traits found yet. Some monster strands are traits.</p>'}</div>`,
    detailDeck('trait'),['#c27bff','#7dff9a','#ffd166']);
}
function qStars(q){return {rough:1,clean:2,pure:3}[q]||1;}
function vaultTab(){
  const lab=atLab(),v=S.vault.find(x=>x.id==S.vpick)||S.vault[0];if(v)S.vpick=v.id;
  const tubes=S.vault.length?`<div class="rack">${S.vault.map(x=>{const g=geneInfo(x.gene),left=S.tier>=3?'❄️':'⏳'+Math.max(0,3-x.age)+'d';
      return `<button class="ttube ${v&&x.id===v.id?'sel':''}" data-a="vpick" data-v="${x.id}" title="${g.name} strand · ${QUAL[x.q].name} quality · ${S.tier>=3?'frozen, never spoils':(3-x.age)+' days until it spoils'}">
      <span class="glass"><span class="liq2" style="background:${g.color};height:${30+qStars(x.q)*20}%"></span><span class="gi">${g.icon}</span></span><b>${g.name}</b><span class="qs">${'★'.repeat(qStars(x.q))}</span><small class="spoil">${left}</small></button>`;}).join('')}</div>`
    :`<div class="rack">${[0,1,2,3,4].map(()=>'<span class="ttube"><span class="glass"></span><small class="mute">empty</small></span>').join('')}</div><p class="mute" style="margin:8px 0 0">🗡️ Kill monsters, then walk over the glowing strands they drop.</p>`;
  const info=v?`<div class="vinfo">${geneInfo(v.gene).icon} <b>${geneInfo(v.gene).name}</b> · you have ${Math.round(S.dna[v.gene]||0)}% now</div>`:'';
  const deck=v?`<div class="deckrow">${arcBtn('🧪',`data-a="absorb" data-v="${v.id}"`,'#ffd166','absorb raw +'+Math.round(v.val*.5)+'% ⚡ risky')}
      ${lab?arcBtn('🔬',`data-a="seqStart" data-v="${v.id}"`,'#7dff9a','sequence up to +'+Math.round(v.val*1.6)+'%'):arcBtn('🔬','disabled title="Only at the Gene-O-Matic in your cabin"','#555','sequence (cabin only)')}
      ${S.vault.length>1?arcBtn('⚡','data-a="absorbAll"','#ff7a2f','absorb all raw'):''}</div>`:'';
  return machine(`🧊 CRYO VAULT · ${S.vault.length} / ${vaultCap()} strands`,tubes+info,deck,['#7fd6ff','#7fd6ff','#7dff9a']);
}
function spliceTab(){
  const unlocked=S.mode==='monster'||Math.max(S.tier,S.maxTier||0)>=3,lab=atLab();
  const can=Object.keys(S.dna).filter(id=>S.dna[id]>=100&&POWERS[id]&&!POWERS[id].hybrid);
  const pk=S.splicePick,A=pk[0]&&POWERS[pk[0]],B=pk[1]&&POWERS[pk[1]];
  let out='<span class="q">?</span>',outName='Load two powers';
  if(A&&B){const key=recipeKey(pk[0],pk[1]),R=RECIPES[key],same=A.fam===B.fam;
    if(R&&S.recipesFound.includes(key)){out=R.icon;outName=R.name;}else if(R){out='✨';outName='Secret recipe!';}else if(same){out=A.icon+B.icon;outName='Stable fusion';}else{out='⚠️';outName='Unstable + a curse';}}
  const ch=(P,i)=>`<div class="chamber ${P?'full':''}" style="--c:${P?P.color:'#2f8a4a'}" ${P?`data-a="spk" data-id="${pk[i]}" title="Click to take it out"`:''}>${P?`<span>${P.icon}</span><b>${P.name}</b>`:'<span class="mute">empty</span>'}</div>`;
  const costTxt=S.mode==='monster'?'🧬 30 biomass':'🔌2 💊2 · -8 humanity';
  const ok=unlocked&&lab&&pk.length===2&&(S.mode==='monster'?S.biomass>=30:(S.res.wire>=2&&S.res.meds>=2));
  const why=!unlocked?'🔒 Build the Bunker once to unlock splicing.':!lab?'🔒 Splicing only works at the Gene-O-Matic in your cabin.':can.length<2?'You need two powers at FULL (★★) to splice.':pk.length<2?'Click two FULL powers to load them.':!ok?'Need 🔌2 wire and 💊2 meds.':'Ready! Both powers get used up.';
  const book=Object.keys(RECIPES).map(k=>{const [a,b]=k.split('|'),found=S.recipesFound.includes(k),R=RECIPES[k];
    return `<div class="rb ${found?'found':''}" title="${found?R.name+': '+R.desc:FAM[a].name+' + '+FAM[b].name+' = ???'}"><span>${FAM[a].icon}+${FAM[b].icon}</span><b>${found?R.icon:'❓'}</b></div>`;}).join('');
  return machine('✂️ SPLICE-TRON',`<div class="chambers">${ch(A,0)}<span class="plus">＋</span>${ch(B,1)}<span class="plus">＝</span><div class="chamber out ${A&&B?'full':''}"><span>${out}</span><b>${outName}</b></div></div>
    <div class="why">${why}</div>
    <div class="pdeck small">${can.map(id=>`<div class="pc ${pk.includes(id)?'sel':''}" data-a="spk" data-id="${id}" style="--c:${POWERS[id].color}" title="${POWERS[id].name} (${FAM[POWERS[id].fam].name})"><div class="ring" style="--p:100"><span>${POWERS[id].icon}</span></div><b>${POWERS[id].name}</b></div>`).join('')||''}</div>
    <details class="book"><summary>📖 Recipe book · ${S.recipesFound.length} of ${Object.keys(RECIPES).length} found (hover a tile)</summary><div class="rbook">${book}</div></details>`,
    `<div class="deckrow">${arcBtn('SPLICE',`data-a="doSplice" ${ok?'':'disabled'}`,'#ff3b3b',costTxt,'big')}</div>`,['#ff5a68','#ffd166','#ff5a68']);
}
const GTABS2=[['powers','🎮','Powers','Moves you put on keys 1, 2, 3'],['traits','🎖️','Traits','Always-on bonuses'],['vault','🧊','Vault','Strands you picked up'],['seq','🔬','Sequencer','Lab games for full DNA'],['splice','✂️','Splice','Combine two powers']];
function genomeTabs(){return `<div class="gtabs2">${GTABS2.map(([k,i,n,d])=>{const badge=k==='vault'&&S.vault.length?`<em>${S.vault.length}</em>`:'';
  return `<button class="${S.gtab===k?'on':''}" data-a="gtab" data-t="${k}" title="${d}"><span>${i}</span><b>${n}${badge}</b></button>`;}).join('')}</div>`;}
function flowStrip(){const [step,msg,btn]=dnaNext();const st=[['🗡️','Kill'],['🧪','Collect'],['🧬','Absorb / Lab'],['🎮','Equip']];
  return `<div class="fstrip">${st.map((s,i)=>`<span class="${i===step?'on':''}">${s[0]}<small>${s[1]}</small></span>`).join('<i>›</i>')}<div class="fmsg">${msg}${btn?` <button class="btn sm gold" data-a="gtab" data-t="${btn[0]}">${btn[1]}</button>`:''}</div></div>`;}
/* genomeHtml: replaced later */
function dnaAct(a,d){
  if(a==='gpick'){S.gpick=S.gpick===d.id?null:d.id;refreshPanel();return true;}
  if(a==='vpick'){S.vpick=d.v;refreshPanel();return true;}
  if(a==='sock'){const pk=S.gpick,i=+d.i;if(pk&&stageN(pk)>0&&(d.kind==='trait'?TRAITS[pk]:POWERS[pk])){act(d.kind==='trait'?'eqt':'eqs',{id:pk,i});sfx('ui');return true;}
    const cur=(d.kind==='trait'?S.traits:S.slots)[i];if(cur){S.gpick=cur;refreshPanel();}return true;}
  return false;
}
{const _act=act;act=function(a,d){if(dnaAct(a,d||{}))return;_act(a,d);};}
// drag & drop cards onto sockets
document.addEventListener('dragstart',e=>{const c=e.target.closest&&e.target.closest('.pc[draggable="true"]');if(!c)return;e.dataTransfer.setData('text/plain',c.dataset.id+'|'+c.dataset.kind);e.dataTransfer.effectAllowed='move';S.gpick=c.dataset.id;});
document.addEventListener('dragover',e=>{const s=e.target.closest&&e.target.closest('.sock');if(!s)return;e.preventDefault();s.classList.add('over');});
document.addEventListener('dragleave',e=>{const s=e.target.closest&&e.target.closest('.sock');if(s)s.classList.remove('over');});
document.addEventListener('drop',e=>{const s=e.target.closest&&e.target.closest('.sock');if(!s)return;e.preventDefault();const [id,kind]=(e.dataTransfer.getData('text/plain')||'').split('|');
  if(!id||kind!==s.dataset.kind||stageN(id)<1)return;sfx('pickup');act(kind==='trait'?'eqt':'eqs',{id,i:+s.dataset.i});});
