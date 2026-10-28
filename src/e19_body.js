// ================= "YOU" TAB: your body and how it is changing =================
const BODY_FAM={
  fire:['Ember veins','Glowing cracks run down your arms.'],
  frost:['Frost crystals','Ice grows out of your shoulders.'],
  storm:['Static hair','Your hair stands up and sparks.'],
  toxic:['Toxic spots','Green spots on your skin.'],
  blood:['Red veins','Dark red veins under your skin.'],
  shadow:['Shadow haze','Darkness clings to you.'],
  metal:['Stone plates','Rock plates on your arms and chest.'],
  sonic:['Ear fins','Fins on your ears pick up every sound.'],
  water:['Gills','Gills on your neck. Webbed hands.'],
  swarm:['Bug wings','See-through wings on your back.'],
  beast:['Fur & ears','Pointed ears, fur, and a tail.'],
  mind:['Third eye','An eye opens on your forehead.'],
  plant:['Vines','Vines and leaves grow up your leg.'],
  spirit:['Spirit wisps','Little lights float around you.'],
  sun:['Sun marks','Gold marks glow on your skin.']
};
const BODY_HUM=[[75,'👁️','Glowing eyes','Below 75 humanity your eyes glow.'],[50,'🦴','Claws','Below 50 humanity you grow claws.'],[25,'🦔','Back spikes','Below 25 humanity spikes grow out of your back.'],[0,'👹','The monster','At 0 humanity you turn into the monster.']];
function famLevel(f){let best=0,src=null;
  for(const id in POWERS){const p=POWERS[id];if(p.hybrid||p.fam!==f)continue;const n=stageN(id);if(n>best){best=n;src=id;}}
  for(const id in TRAITS){if(TRAITS[id].fam!==f)continue;const n=stageN(id);if(n>best){best=n;src=id;}}
  return [best,src];}
function bodyChanges(){const out=[];
  for(const f in BODY_FAM){const [lv,src]=famLevel(f);if(!lv)continue;const g=geneInfo(src);
    out.push({k:'f_'+f,fam:f,lv,icon:FAM[f].icon,name:BODY_FAM[f][0],desc:BODY_FAM[f][1],src:g.icon+' '+g.name+' · '+['','weak','full','mastered'][lv],color:FAM[f].color});}
  BODY_HUM.forEach(([at,ic,n,d],i)=>{if(S.humanity<at||(at===0&&S.mode==='monster'))out.push({k:'h_'+i,icon:ic,name:n,desc:d,src:'🧍 humanity '+Math.round(S.humanity),color:'#c27bff',lv:3});});
  return out;}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function bodySvg(){
  const mon=S.mode==='monster',hum=S.humanity,L={};for(const f in BODY_FAM)L[f]=famLevel(f)[0];
  const skin=mon?'#7a4a96':mixHex('#e8c09a','#a99cc0',Math.max(0,(100-hum)/100)),shirt=mon?'#4a2260':'#2f72a8',pants=mon?'#2a1236':'#2b3a55';
  const op=f=>[0,.5,.9,1][L[f]],gl=f=>L[f]>=3?'filter="url(#bglow)"':'';
  const G=(f,inner)=>{if(!L[f])return '';const [n,d]=BODY_FAM[f];return `<g class="mut" opacity="${op(f)}" ${gl(f)} title="${FAM[f].icon} ${n}: ${d}">${inner}</g>`;};
  const H=(i,inner)=>(hum<BODY_HUM[i][0]||mon)?`<g class="mut" title="${BODY_HUM[i][1]} ${BODY_HUM[i][2]}: ${BODY_HUM[i][3]}">${inner}</g>`:'';
  let s=`<svg viewBox="0 0 200 290" class="bodysvg"><defs><filter id="bglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="bblur"><feGaussianBlur stdDeviation="9"/></filter></defs>`;
  // behind the body
  s+=G('shadow',`<ellipse cx="100" cy="150" rx="78" ry="128" fill="#2a2040" filter="url(#bblur)"/>`);
  s+=G('swarm',`<ellipse cx="62" cy="110" rx="40" ry="18" transform="rotate(-30 62 110)" fill="#b880ff55" stroke="#b880ff"/><ellipse cx="138" cy="110" rx="40" ry="18" transform="rotate(30 138 110)" fill="#b880ff55" stroke="#b880ff"/>`);
  s+=H(2,`<path d="M74 100 L60 78 L82 96 Z M126 100 L140 78 L118 96 Z M88 96 L84 72 L96 94 Z M112 96 L116 72 L104 94 Z" fill="#6a6a7a" stroke="#222" stroke-width="1.5"/>`);
  s+=G('beast',`<path d="M118 180 Q160 200 150 240 Q146 250 140 238 Q148 205 114 188 Z" fill="#7a5232" stroke="#222" stroke-width="1.5"/>`);
  // legs, torso, arms, head
  s+=`<rect x="78" y="180" width="19" height="82" rx="6" fill="${pants}" stroke="#111" stroke-width="2"/><rect x="103" y="180" width="19" height="82" rx="6" fill="${pants}" stroke="#111" stroke-width="2"/>
  <ellipse cx="86" cy="266" rx="13" ry="7" fill="#3a2616"/><ellipse cx="114" cy="266" rx="13" ry="7" fill="#3a2616"/>
  <rect x="52" y="100" width="17" height="78" rx="8" fill="${skin}" stroke="#111" stroke-width="2"/><rect x="131" y="100" width="17" height="78" rx="8" fill="${skin}" stroke="#111" stroke-width="2"/>
  <rect x="51" y="98" width="19" height="34" rx="8" fill="${shirt}" stroke="#111" stroke-width="2"/><rect x="130" y="98" width="19" height="34" rx="8" fill="${shirt}" stroke="#111" stroke-width="2"/>
  <rect x="92" y="78" width="16" height="22" fill="${skin}" stroke="#111" stroke-width="2"/>
  <rect x="68" y="94" width="64" height="92" rx="14" fill="${shirt}" stroke="#111" stroke-width="2.5"/>
  <circle cx="60.5" cy="182" r="9" fill="${L.water?'#5fd3e8':skin}" stroke="#111" stroke-width="2"/><circle cx="139.5" cy="182" r="9" fill="${L.water?'#5fd3e8':skin}" stroke="#111" stroke-width="2"/>
  <circle cx="100" cy="56" r="28" fill="${skin}" stroke="#111" stroke-width="2.5"/>
  <path d="M72 52 Q74 24 100 24 Q126 24 128 52 Q118 38 100 40 Q82 38 72 52 Z" fill="${mon?'#2a1236':'#3a2616'}"/>`;
  // eyes and mouth
  const eyeGlow=hum<75||mon;
  s+=eyeGlow?H(0,`<circle cx="90" cy="58" r="4.5" fill="${mon?'#ff3b5c':'#d6a0ff'}" filter="url(#bglow)"/><circle cx="110" cy="58" r="4.5" fill="${mon?'#ff3b5c':'#d6a0ff'}" filter="url(#bglow)"/>`)
    :`<circle cx="90" cy="58" r="4" fill="#fff"/><circle cx="110" cy="58" r="4" fill="#fff"/><circle cx="91" cy="58.5" r="2" fill="#222"/><circle cx="111" cy="58.5" r="2" fill="#222"/>`;
  s+=`<path d="M91 70 Q100 ${hum<40||mon?66:75} 109 70" stroke="#3a1a1a" stroke-width="2.2" fill="none"/>`;
  // family changes on the body
  s+=G('fire',`<polyline points="56,140 62,150 57,160 63,170" stroke="#ff7a2f" stroke-width="3" fill="none"/><polyline points="144,140 138,150 143,160 137,170" stroke="#ff7a2f" stroke-width="3" fill="none"/><circle cx="64" cy="128" r="2" fill="#ffd166"/><circle cx="140" cy="122" r="2" fill="#ffd166"/>`);
  s+=G('frost',`<path d="M56 100 L50 82 L62 96 L64 78 L70 98 Z M144 100 L150 82 L138 96 L136 78 L130 98 Z" fill="#cff4ff" stroke="#6ac8e8" stroke-width="1.5"/>`);
  s+=G('storm',`<path d="M78 34 L74 14 L86 30 L90 8 L98 28 L104 6 L110 28 L118 10 L120 32 L128 18 L124 40" fill="#3a2616" stroke="#7fd6ff" stroke-width="2"/><polyline points="132,20 138,28 134,30 140,40" stroke="#ffe066" stroke-width="2.5" fill="none"/>`);
  s+=G('toxic',`<circle cx="82" cy="66" r="3.5" fill="#a6d65a"/><circle cx="117" cy="47" r="3" fill="#a6d65a"/><circle cx="58" cy="150" r="3.5" fill="#a6d65a"/><circle cx="141" cy="162" r="4" fill="#a6d65a"/><circle cx="115" cy="140" r="5" fill="#a6d65a"/>`);
  s+=G('blood',`<path d="M95 82 L98 90 L96 98 M105 82 L102 90 L104 98 M60 136 L64 148 L60 162 M140 136 L136 148 L140 162" stroke="#c2203a" stroke-width="1.8" fill="none"/>`);
  s+=G('metal',`<rect x="53" y="140" width="15" height="22" rx="3" fill="#9aa4ae" stroke="#333" stroke-width="1.5"/><rect x="132" y="140" width="15" height="22" rx="3" fill="#9aa4ae" stroke="#333" stroke-width="1.5"/><path d="M82 104 L118 104 L112 130 L88 130 Z" fill="#9aa4ae" stroke="#333" stroke-width="1.5"/>`);
  s+=G('sonic',`<path d="M73 52 L56 40 L60 64 Z M127 52 L144 40 L140 64 Z" fill="#f2dc7a" stroke="#8a7a2a" stroke-width="1.5"/>`);
  s+=G('water',`<path d="M93 84 q-4 3 0 6 M93 90 q-4 3 0 6 M107 84 q4 3 0 6 M107 90 q4 3 0 6" stroke="#2a8aa8" stroke-width="2" fill="none"/>`);
  s+=G('beast',`<path d="M76 40 L70 12 L90 30 Z M124 40 L130 12 L110 30 Z" fill="#7a5232" stroke="#222" stroke-width="1.5"/><path d="M70 186 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6" stroke="#7a5232" stroke-width="3" fill="none"/>`);
  s+=G('mind',`<ellipse cx="100" cy="42" rx="6" ry="4" fill="#fff" stroke="#111" stroke-width="1.5"/><circle cx="100" cy="42" r="2.4" fill="#9acd32"/>`);
  s+=G('plant',`<path d="M80 262 Q96 240 82 220 Q70 200 88 186" stroke="#4a8a2a" stroke-width="3" fill="none"/><ellipse cx="92" cy="242" rx="6" ry="3" transform="rotate(-30 92 242)" fill="#6ac04a"/><ellipse cx="74" cy="214" rx="6" ry="3" transform="rotate(30 74 214)" fill="#6ac04a"/><ellipse cx="90" cy="196" rx="6" ry="3" fill="#6ac04a"/>`);
  s+=G('spirit',`<circle cx="44" cy="60" r="5" fill="#ff9ad0"><animate attributeName="cy" values="60;48;60" dur="3s" repeatCount="indefinite"/></circle><circle cx="158" cy="80" r="4" fill="#ff9ad0"><animate attributeName="cy" values="80;66;80" dur="2.4s" repeatCount="indefinite"/></circle><circle cx="150" cy="30" r="3" fill="#ffd0ea"><animate attributeName="cy" values="30;22;30" dur="2s" repeatCount="indefinite"/></circle>`);
  s+=G('sun',`<path d="M80 60 l5 0 M80 64 l5 0 M115 60 l5 0 M115 64 l5 0" stroke="#ffcc4a" stroke-width="2.5"/><circle cx="100" cy="150" r="9" fill="none" stroke="#ffcc4a" stroke-width="2.5"/><path d="M100 136 v-5 M100 164 v5 M86 150 h-5 M114 150 h5" stroke="#ffcc4a" stroke-width="2.5"/>`);
  s+=H(1,`<path d="M54 188 l-3 10 l6 -7 Z M60 190 l0 11 l4 -9 Z M66 188 l3 10 l-1 -10 Z M146 188 l3 10 l-6 -7 Z M140 190 l0 11 l-4 -9 Z M134 188 l-3 10 l1 -10 Z" fill="#f4f0ff" stroke="#222" stroke-width="1"/>`);
  return s+'</svg>';
}
function meTab(){
  const ch=bodyChanges(),seen=S.bodySeen||[],hum=Math.max(0,Math.round(S.humanity)),mon=S.mode==='monster';
  const nxt=BODY_HUM.find(b=>hum>=b[0]);
  const meter=`<div class="hmeter"><div class="hbar"><i style="width:${hum}%"></i>${BODY_HUM.map(b=>`<span class="hmk ${hum<b[0]||mon?'on':''}" style="left:${b[0]}%" title="${b[2]}: ${b[3]}">${b[1]}</span>`).join('')}<b class="hnow" style="left:${hum}%">▼</b></div>
    <div class="hlbl"><span>👹 0</span><span>🧍 Humanity <b>${hum}</b></span><span>100 🙂</span></div>
    ${!mon&&nxt?`<small class="mute">Next change: ${nxt[1]} ${nxt[2]} below ${nxt[0]||1}. 💉 Suppressant shots (2 meds) give +15.</small>`:''}</div>`;
  const list=ch.length?ch.map(c=>`<div class="chg" style="--c:${c.color}" title="${c.desc}"><span class="ci">${c.icon}</span><div><b>${c.name}${seen.includes(c.k)?'':' <em class="newt">NEW</em>'}</b><small>${c.src}</small></div>${c.lv<3&&c.fam?`<span class="lvdots">${'●'.repeat(c.lv)}${'○'.repeat(3-c.lv)}</span>`:''}</div>`).join('')
    :'<p class="mute" style="margin:6px 0;grid-column:1/-1">Still 100% human. Absorb DNA and your body will start to change.</p>';
  const tsteps=`<div class="tsteps"><span>🗡️<small>Kill the monster</small></span><i>›</i><span>🧪<small>Grab its strand</small></span><i>›</i><span>🧬<small>Fill to 100%</small></span><i>›</i><span>📌<small>Wear it (2 pins)</small></span></div>`;
  const traits=Object.keys(TRAITS).map(id=>{const t=TRAITS[id],p=Math.min(100,Math.round(S.dna[id]||0)),worn=S.traits.includes(id),mt=SRCTYPE[id]&&MONSTERS[SRCTYPE[id]],met=mt&&S.seen[SRCTYPE[id]];
    return `<button class="trow ${worn?'worn':p>=100?'ready':''}" data-a="gtab" data-t="traits" title="${t.name}: ${t.desc}"><span class="ti">${t.icon}</span><div><b>${t.name}</b><small>${met?'from '+mt.name:mt?'❓ '+mt.name:'???'}</small><span class="tbar"><i style="width:${p}%;background:${FAM[t.fam].color}"></i></span></div><span class="tst">${worn?'📌':p>=100?'✅':p+'%'}</span></button>`;}).join('');
  setTimeout(()=>{S.bodySeen=ch.map(c=>c.k);},0);
  return `<div class="metab"><div class="mirror">${bodySvg()}<small class="mute">Hover a change to see what it is</small></div>
    <div class="mecol"><h3>🧍 Humanity</h3>${meter}<h3>🧬 Changes (${ch.length})</h3><div class="chgs">${list}</div></div></div>
    <div class="tguide"><h3>🎖️ How to get traits</h3>${tsteps}<p class="mute" style="margin:4px 0 8px">Traits only come from certain monsters (❓ = not met yet). There's no weak version: fill one to <b>100%</b>, then it's always on.</p><div class="tgrid">${traits}</div></div>`;
}
GTABS2.unshift(['me','🧍','You','Your body and how it is changing']);
function genomeHtml(){
  S.gtab=S.gtab||'powers';const mon=S.mode==='monster';
  const body={me:meTab,powers:powersTab,traits:traitsTab,vault:vaultTab,seq:seqTab,splice:spliceTab}[S.gtab]();
  return `<div class="card wide">${head((mon?'The Apex':'Your DNA')+' · Tab or Esc to close',S.gtab==='seq'?'Gene-O-Matic':S.gtab==='me'?'You':'DNA Lab',mon?'var(--monster)':null)}
  ${genomeTabs()}${S.gtab==='seq'||S.gtab==='me'?'':flowStrip()}<div style="height:8px"></div>${body}</div>`;
}
// tell the player when their body changes
{const _ad=addDNA;addDNA=function(id,amt,src){const before=bodyChanges().map(c=>c.k);_ad(id,amt,src);
  const now=bodyChanges().filter(c=>c.fam&&!before.includes(c.k));now.forEach(c=>toast('🧍 Your body is changing: '+c.icon+' '+c.name+'. See the 🧍 You tab.','mem'));};}
// styles
(function(){const st=document.createElement('style');st.textContent=`
.metab{display:grid;grid-template-columns:minmax(180px,250px) 1fr;gap:14px;align-items:start}
.mirror{background:radial-gradient(ellipse at 50% 40%,#2a3a4a,#10161c 70%);border:6px solid #6a4a2a;border-radius:110px 110px 14px 14px;padding:14px 8px 6px;text-align:center;box-shadow:inset 0 0 30px #000,0 6px 18px #0008}
.bodysvg{width:100%;max-height:340px;display:block}.bodysvg .mut{cursor:help}.bodysvg .mut:hover{filter:brightness(1.4) drop-shadow(0 0 4px #fff)}
.mecol h3,.tguide h3{margin:4px 0 6px}
.hmeter{margin-bottom:10px}.hbar{position:relative;height:16px;border-radius:8px;background:linear-gradient(90deg,#6a2a8a,#a08cff 50%,#7fc8ff);margin:18px 6px 4px;border:2px solid #111}
.hbar>i{position:absolute;inset:0 auto 0 0;background:#ffffff22;border-radius:6px}
.hmk{position:absolute;top:-20px;transform:translateX(-50%);font-size:16px;filter:grayscale(1) opacity(.45);cursor:help}.hmk.on{filter:none}
.hnow{position:absolute;top:12px;transform:translateX(-50%);color:#fff;font-size:14px;text-shadow:0 0 4px #000}
.hlbl{display:flex;justify-content:space-between;font-size:12px;margin:10px 0 2px}
.chgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px}
.chg{display:flex;align-items:center;gap:8px;background:#0006;border:2px solid var(--c);border-radius:10px;padding:5px 8px;cursor:help}.chg .ci{font-size:22px}.chg b{display:block;font-size:13px}.chg small{opacity:.75;font-size:11px}
.lvdots{margin-left:auto;color:var(--c);font-size:11px;letter-spacing:1px}
.newt{font-style:normal;background:#ffd166;color:#222;border-radius:5px;padding:0 4px;font-size:10px;margin-left:4px;animation:pulse 1s infinite alternate}
.tguide{margin-top:12px;background:#0005;border-radius:12px;padding:10px 12px}
.tsteps{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.tsteps span{display:flex;flex-direction:column;align-items:center;font-size:24px;background:#ffffff10;border-radius:10px;padding:4px 10px}.tsteps small{font-size:11px;opacity:.8}.tsteps i{opacity:.5;font-style:normal;font-size:20px}
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px}
.trow{display:flex;align-items:center;gap:8px;text-align:left;background:#0006;border:2px solid #333;border-radius:10px;padding:5px 8px;color:inherit;cursor:pointer}.trow:hover{border-color:#c27bff}
.trow.ready{border-color:#7dff9a}.trow.worn{border-color:#ffd166;background:#ffd16618}.trow .ti{font-size:22px}.trow div{flex:1;min-width:0}.trow b{display:block;font-size:13px}.trow small{display:block;font-size:11px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tbar{display:block;height:5px;background:#ffffff18;border-radius:3px;margin-top:3px;overflow:hidden}.tbar i{display:block;height:100%}
.tst{font-size:12px;font-weight:bold;min-width:30px;text-align:right}
@keyframes pulse{to{opacity:.55}}
@media (max-width:640px){.metab{grid-template-columns:1fr}.mirror{max-width:240px;margin:0 auto}}`;document.head.appendChild(st);})();
