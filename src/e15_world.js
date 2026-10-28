// ================= WORLD: MAP, COUNTRIES, CHAPTERS, ENDINGS =================
const countryOf=i=>TOWNS[i]?TOWNS[i].country||0:0;
const NEWCAMPS={coast:[{name:'Pier Camp',leader:'Captain Odessa'},{name:'Shell Bay Camp',leader:'Nico'}],rust:[{name:'Furnace Camp',leader:'Big Lou'},{name:'Bridge Camp',leader:'Rosa'}],
  japan:[{name:'Temple Camp',leader:'Old Hana'},{name:'Harbor Watch',leader:'Kenji'}],highland:[{name:'Bothy Camp',leader:'Morag'},{name:'Kirk Camp',leader:'Father Ewan'}],
  mexico:[{name:'Mercado Camp',leader:'Doña Lupe'},{name:'Mission Camp',leader:'Padre Tomás'}],egypt:[{name:'Oasis Watch',leader:'Amira'},{name:'Dig Site Camp',leader:'Professor Hadi'}],
  city:[{name:'Rooftop Camp',leader:'Jax'},{name:'Metro Camp',leader:'Priya'}]};
TOWNS.forEach((t,i)=>{if(i>=7&&!t.arena)t.campNames=NEWCAMPS[t.biome]||NEWCAMPS.city;});
Object.assign(TRAVEL_TEXT,{
  'Driftwood':'The road bends west until it runs out of land. Salt in the air, gulls screaming, and a beach covered in shells that are much too big.',
  'Port Grey':'Fog rolls off the water. Every boat in Port Grey has been dragged up onto the street, like something wanted them out of the sea.',
  'Bayview: The Docks':'Bayview City rises out of the mist: cranes, towers, and a freighter rusted halfway into the bay. You start at the docks.',
  'Bayview: The Boardwalk':'The Ferris wheel is still turning. Nobody is on it. Carnival music is playing from somewhere you can\'t see.',
  'Breakwater':'A concrete wall holds back the ocean. Something huge is standing on top of it, dripping. The Tidal Warden.',
  'Cinder':'The sky goes orange. Smokestacks everywhere, and every one of them is still burning, years after the workers left.',
  'Ironside':'Car factories as big as mountains. Somewhere inside, a machine is still stamping metal. Clang. Clang. Clang.',
  'Steelport: The Foundry':'Steelport. A city made of iron and fire. The Foundry district glows like the inside of an oven.',
  'Steelport: The Rail Yards':'Trains that will never move again, stacked like toys. One of them has its lights on.',
  'The Smelter':'The road ends at a lake of molten metal. The Rust Warden climbs out of it.',
  'Ground Zero':'Every road in the United Wastes leads here. A crater, a dead laboratory, and a broadcast you\'ve heard in your dreams: "Come home."',
  'Hanamura':'A fishing boat drops you on a new shore. Cherry trees, red shrine gates, and lanterns that light themselves at dusk. Japan.',
  'Kumo Port':'The sea here is black and perfectly still. Fishermen leave offerings on the pier and never look at the water.',
  'Neo Edo City':'Neon signs still flicker over empty streets. A giant skeleton is sitting on top of the tallest tower, watching.',
  'Mount Kurai':'A volcano wrapped in fog. Eight glowing eyes open in the dark above you.',
  'Glenmor':'Another boat, another shore. Green hills, stone walls, sheep that stare at you, and bagpipes playing from an empty hill. Scotland.',
  'Kilbrae':'A castle on a cliff and a circle of standing stones. Something with antlers walks between them.',
  'Edinmoor City':'Old stone streets, a castle on a rock, and a woman in grey who keeps appearing at the end of every alley.',
  'Loch Dubh':'The loch is black and very, very deep. A long neck rises out of the water.',
  'San Lázaro':'Hot wind, painted buildings, a market full of skulls made of sugar. Mexico. Someone is crying down by the river.',
  'Puerto Sol':'Cliffs over a turquoise sea. A black dog with burning eyes follows your truck along the beach road.',
  'Ciudad Sombra':'A huge city in the shadow of a volcano. The grand cemetery glows with candles nobody lit.',
  'Temple of Xibalba':'A pyramid in the jungle. Feathers the size of surfboards are scattered down its steps.',
  'Wadi Nur':'Sand to the horizon and a town built around a well. Egypt. The dig site\'s tent is flapping, and the tomb is open.',
  'Port Sabra':'The river is wide and slow and full of eyes. Something that is half man, half crocodile rules here.',
  'Neferu City':'A city of minarets and museums. The mummies in the museum are gone. Their glass cases are broken from the inside.',
  'The Great Pyramid':'The last place on Earth. The sun goes dark, and a serpent big enough to swallow it uncoils around the pyramid.'
});
// ---------- story chapters for the new towns ----------
(function(){const last=CHAPTERS.find(c=>c.town===6);if(last&&last.goals.length===1)last.goals.push(['Head for the coast',()=>(S.maxTown||0)>6]);
  for(let i=7;i<TOWNS.length;i++){const T=TOWNS[i],N=TOWNS[i+1],ci=countryOf(i),newC=i>0&&countryOf(i-1)!==ci;
    const goals=T.arena?[['Defeat '+MONSTERS[T.boss].name,()=>tlog(i).bossDead]]:[['Kill '+MONSTERS[T.boss].name+' in '+T.lair,()=>tlog(i).bossDead||tlog(i).claimed],['Find the truck parts 🔩 and fix the truck at the Garage 🔧',()=>(S.maxTown||0)>i||(S.town===i&&truckReady())]];
    if(N)goals.push([(countryOf(i+1)!==ci?'Sail to '+COUNTRIES[countryOf(i+1)].name+': ':'Move on to ')+N.name,()=>(S.maxTown||0)>i]);
    CHAPTERS.push({town:i,name:'Chapter '+(CHAPTERS.length+1)+' · '+(newC?COUNTRIES[ci].flag+' ':'')+T.name,goals});}})();
// ---------- biome looks ----------
{const _bd=biomeDecorType;biomeDecorType=function(b,r){
  const L={coast:['rock','dune','boat','pool','reeds','lamp'],rust:['rubble','barrelfire','trash','crater','barrier','lamp'],japan:['tree','flowers','lamp','rock','bush','pool'],
    highland:['pine','rock','pool','bush','reeds','rock'],mexico:['cactus','rock','skull','tumble','flowers','lamp'],egypt:['dune','pillar','skull','rock','cactus','tumble']}[b];
  return L?L[Math.floor(r*L.length)%L.length]:_bd(b,r);};}
{const _bg=biomeGround;biomeGround=function(){const g=_bg(),b=TOWNS[S.town].biome;
  const X={coast:['#6a6a64','#d8ccaa','#f0f0e8','#c8b888'],rust:['#3a3634','#5a524c','#e8a020','#4a4440'],japan:['#5a5a60','#c8bca8','#ffffff','#7a6a52'],highland:['#5a5a52','#8a8a7a',null,'#6a6a4a'],mexico:['#9a7a5a','#d8b890','#ffffff','#b8946a'],egypt:['#b8925a','#e0c48a',null,'#d0b07a']}[b];
  if(X){g.road=X[0];g.side=X[1];g.dash=X[2];g.yard=X[3];}return g;};}
// ---------- arriving in a new country ----------
{const _a=arriveTown;arriveTown=function(){const prevC=countryOf(S.town);_a();const ci=countryOf(S.town);
  if(ci!==prevC&&tlog(S.town).visits===undefined){tlog(S.town).visits=1;const C=COUNTRIES[ci];
    setTimeout(()=>{if(S)banner(C.flag+' '+C.name.toUpperCase(),'A new country. New monsters ('+C.hint+') and a whole new family of DNA to steal.',C.color);},1500);
    toast(C.flag+' Welcome to '+C.name+'. The monsters here carry DNA you\'ve never seen. Press M for the new map.');}};}
// ---------- state / country / world cards ----------
function nextTownTxt(){const N=TOWNS[S.town+1];if(!N)return '';const c=countryOf(S.town+1)!==countryOf(S.town);
  return `<p class="mute">Next: ${c?COUNTRIES[countryOf(S.town+1)].flag+' <b>'+COUNTRIES[countryOf(S.town+1)].name+'</b>, starting with ':''}${N.name}. ${S.mode==='monster'?'Go to your nest and migrate.':'Fix the truck at the Garage to get there.'}</p>`;}
function showStateCard(){
  const si=stateOfTown(S.town),St=STATES[si]||{name:'?'},ci=countryOf(S.town),C=COUNTRIES[ci],last=!TOWNS[S.town+1];
  if(St.final){
    if(last||TOWNS[S.town].worldBoss){showWorldWin();return;}
    showOv(`<div class="card story"><div class="eyebrow">${C.flag} Country ${ci+1} of ${COUNTRIES.length}</div><h1 style="font-size:clamp(40px,7vw,80px);color:var(--gold)">${C.name} Is Yours</h1>
      <p>${MONSTERS[TOWNS[S.town].boss].name} falls, and the whole country goes quiet. Every monster that's left bows, or runs.</p>
      <p>On the radio, a new voice in a new language: ${ci===0?'<em>"…across the sea… the monsters started in Japan too…"</em>':'<em>"…it\'s spreading… there\'s another country fighting back…"</em>'}</p>
      <p>Your path so far: <b style="color:var(--gold)">${pathName()}</b>.</p>${statsHtml()}${nextTownTxt()}<button class="btn big" data-a="continue">Keep going</button></div>`,'story');return;}
  showOv(`<div class="card story"><div class="eyebrow">${C.flag} ${C.name}</div><h1 style="font-size:clamp(44px,8vw,84px);color:var(--gold)">${St.name} Conquered</h1>
  ${storyStateText(si)}${statsHtml()}${nextTownTxt()}<button class="btn big" data-a="continue">Keep going</button></div>`,'story');
}
{const _st=storyStateText;storyStateText=function(si){if(si<=1)return _st(si);const p=pathName();
  const t={2:'The Tidal Warden sinks back into the sea. The tide goes out, and keeps going out, until the bay is dry and full of things that were hiding under it.',3:'The Rust Warden melts into its own lake of fire. Every factory in the Rust Belt finally goes silent.'}[si]||'Another Warden falls.';
  return `<p>${t}</p><p>Your path so far: <b style="color:var(--gold)">${p}</b>.</p>`;};}
function showWorldWin(){
  const p=pathName();S.worldDone=true;
  const end={Hunter:'You stayed human the whole way around the world. The monsters are gone. People come out of the camps and look at the sky. Somebody hands you a coffee. It is the best thing you have ever tasted.',
    Apex:'There is nothing left in the world stronger than you. The monsters follow you now, a sea of them, waiting for you to tell them where to go next.',
    Splicer:'Human and monster at the same time, and in balance. You did the thing everyone said was impossible. Vance raises a cup to you. "Now," he says, "we fix it."'}[p]||'';
  showOv(`<div class="card story"><div class="eyebrow">🌍 The World</div><h1 style="font-size:clamp(40px,7vw,84px);color:var(--gold)">You Conquered the World</h1>
    <p>Apophis coils around the pyramid one last time and turns to sand. The sun comes back.</p><p><b>Ending: ${p}.</b> ${end}</p>${statsHtml()}
    <p class="mute">Every town, city, state and country is done. You can keep playing to finish towns at 100%, or start a new run on a harder difficulty.</p>
    <div class="row"><button class="btn big" data-a="close">Keep exploring</button><button class="btn big ghost" data-a="start">New game</button></div></div>`,'story');
}
// ---------- the map: country tabs + world view ----------
function maxCountry(){return countryOf(Math.max(S.maxTown||0,S.town));}
function countryDone(ci){const f=TOWNS.findIndex(t=>t.country===ci&&t.finalBoss);return f>=0&&!!(S.townLog[f]&&S.townLog[f].bossDead);}
function openMap(){S.mapSel=S.town;S.mapCountry=countryOf(S.town);openPanel('map');}
function worldHtml(){
  const mc=maxCountry();
  return `<div class="worldgrid">${COUNTRIES.map((C,ci)=>{const ts=TOWNS.map((t,i)=>i).filter(i=>countryOf(i)===ci),lib=ts.filter(i=>S.townLog[i]&&(S.townLog[i].liberated||S.townLog[i].claimed||S.townLog[i].bossDead)).length,locked=ci>mc,done=countryDone(ci),here=countryOf(S.town)===ci;
    return `<button class="wcard ${locked?'lk':''} ${here?'here':''}" style="--c:${C.color}" ${locked?'disabled':`data-a="mapc" data-c="${ci}"`} title="${C.hint}">
      <span class="wf">${C.flag}</span><b>${C.name}</b><small>${C.hint}</small>
      <div class="dbar" style="margin-top:6px"><i style="width:${Math.round(100*lib/ts.length)}%;background:var(--c)"></i></div>
      <small>${locked?'🔒 Beat the boss of the country before it':done?'👑 CONQUERED':here?'📍 You are here':''} · ${lib}/${ts.length} places</small></button>`;}).join('')}</div>
    <p class="mute" style="margin-top:10px">Each country has towns, a big city and a final boss. Beat the final boss to sail on to the next country. Beat Apophis in Egypt to finish the game.</p>`;
}
function mapHtml(){
  const view=S.mapCountry===undefined?countryOf(S.town):S.mapCountry,mc=maxCountry();
  const tabs=`<div class="row" style="margin:6px 0 10px;gap:6px"><button class="btn sm ${view==='world'?'gold':'ghost'}" data-a="mapc" data-c="world">🌍 World</button>${COUNTRIES.map((C,ci)=>`<button class="btn sm ${view===ci?'gold':'ghost'}" ${ci>mc?'disabled title="Locked"':`data-a="mapc" data-c="${ci}"`}>${ci>mc?'🔒':C.flag} ${C.name}</button>`).join('')}</div>`;
  if(view==='world')return `<div class="card wide">${head('World map · M to close','The World')}${tabs}${worldHtml()}</div>`;
  const ci=view,C=COUNTRIES[ci],tIdx=TOWNS.map((t,i)=>i).filter(i=>countryOf(i)===ci);
  let sel=S.mapSel;if(countryOf(sel)!==ci)sel=tIdx.includes(S.town)?S.town:tIdx[0];
  const T=TOWNS[sel],L=tlog(sel),st=townStatus(sel),pct=townCompletion(sel);
  let svg=`<svg viewBox="0 0 820 600" style="width:100%;height:auto;display:block;background:#1a2420;border-radius:10px" role="img" aria-label="${C.name} map"><defs><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#000" stroke-width="3" opacity=".35"/></pattern></defs>`;
  STATES.forEach((s,si)=>{if(s.country!==ci)return;const done=s.towns.every(i=>{const l=S.townLog[i];return l&&(l.liberated||l.claimed||l.bossDead);}),seen=s.towns.some(i=>S.townLog[i]&&S.townLog[i].visited);
    svg+=`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="22" fill="${s.color}" opacity="${seen?.45:.22}" stroke="${done?'#ffd166':'#000'}" stroke-width="${done?4:2}"/>${seen?'':`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="22" fill="url(#hatch)"/>`}
      <text x="${s.x+16}" y="${s.y+28}" fill="#fff" font-family="Barlow Condensed,sans-serif" font-size="21" font-weight="700">${s.final&&ci===0?'☢️ ':''}${s.name.toUpperCase()}${done?' ✓':''}</text>`;});
  for(let k=0;k<tIdx.length-1;k++){const a=TOWN_POS[tIdx[k]],b=TOWN_POS[tIdx[k+1]];if(a&&b)svg+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e8dcc0" stroke-width="4" stroke-dasharray="10 8" opacity=".7"/>`;}
  const cities={};tIdx.forEach(i=>{const t=TOWNS[i];if(t.city&&t.district&&tIdx.filter(j=>TOWNS[j].city===t.city).length>1)(cities[t.city]=cities[t.city]||[]).push(TOWN_POS[i]);});
  for(const c in cities){const ps=cities[c],x=ps.reduce((a,p)=>a+p[0],0)/ps.length,y=ps.reduce((a,p)=>a+p[1],0)/ps.length,r=Math.max(...ps.map(p=>Math.hypot(p[0]-x,p[1]-y)))+42;
    svg+=`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.05)" stroke="#fff" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/><text x="${x}" y="${y-r+18}" text-anchor="middle" fill="#fff" font-family="Barlow Condensed,sans-serif" font-size="15" font-weight="700" opacity=".85">🏙️ ${c.toUpperCase()}</text>`;}
  tIdx.forEach(i=>{const t=TOWNS[i],[x,y]=TOWN_POS[i]||[400,300],s=townStatus(i),cur=i===S.town,r=t.arena?20:16,lab=t.district&&TOWNS.filter(x=>x.city===t.city).length>1?t.district:t.name;
    svg+=`<g data-a="mapsel" data-i="${i}" style="cursor:pointer">${cur?`<circle cx="${x}" cy="${y}" r="${r+10}" fill="none" stroke="#ffd166" stroke-width="3"><animate attributeName="r" values="${r+6};${r+14};${r+6}" dur="1.6s" repeatCount="indefinite"/></circle>`:''}
      <circle cx="${x}" cy="${y}" r="${r}" fill="${s.c}" stroke="${i===sel?'#fff':'#000'}" stroke-width="${i===sel?4:2}"/>
      <text x="${x}" y="${y+6}" text-anchor="middle" font-size="16">${t.finalBoss?'👑':t.arena?'💀':s.t==='LIBERATED'?'🛡️':s.t==='CLAIMED'?'🕷️':t.city?'🏙️':'🏘️'}</text>
      <text x="${x}" y="${y+r+20}" text-anchor="middle" fill="#fff" font-family="Barlow Condensed,sans-serif" font-size="16" font-weight="700" stroke="#000" stroke-width="3" paint-order="stroke">${lab}</text></g>`;});
  svg+='</svg>';
  const nb=T.blds.filter(b=>!b.boss).length,check=(ok,txt)=>`<div class="act"><div>${ok?'✅':'⬜'} ${txt}</div></div>`;
  const details=T.arena?check(L.bossDead,'Defeat '+MONSTERS[T.boss].name):
    check(L.bossDead,'Kill '+MONSTERS[T.boss].name+' in '+T.lair+' (40%)')+check(L.lairs.length>=nb,'Clear the monster in every building: '+L.lairs.length+'/'+nb+' (30%)')+
    check(L.campsHelped.length+L.campsRaided.length>=2,'Deal with both survivor camps: '+(L.campsHelped.length+L.campsRaided.length)+'/2 (15%)')+check(L.mimic,'Find the mimic building (5%)')+check(L.searched>=10,'Search 10 containers: '+Math.min(10,L.searched)+'/10 (10%)');
  const si=stateOfTown(sel);
  return `<div class="card wide">${head('Conquest map · M to close',C.flag+' '+C.name)}${tabs}
    <div class="cols" style="grid-template-columns:1.6fr 1fr;align-items:start"><div style="min-width:0">${svg}
      <p class="mute" style="margin:8px 0 0">🏘️ town · 🏙️ city district · 💀 State Warden · 👑 country boss. Free every town, beat each Warden to conquer a state, then beat the country boss to sail on.</p></div>
    <section><div class="eyebrow">${STATES[si]?STATES[si].name:''}${T.city?' · '+T.city:''}</div><h2 style="margin:4px 0">${T.district||T.name}</h2>
      <p style="margin:0 0 6px"><b style="color:${st.c}">${st.t}</b> · ${pct}% complete</p><div class="dbar"><i style="width:${pct}%;background:${st.c}"></i></div>
      <div style="margin-top:10px">${details}</div></section></div></div>`;
}
{const _act=act;act=function(a,d){if(a==='mapc'){S.mapCountry=d.c==='world'?'world':+d.c;refreshPanel();return;}_act(a,d);};}

{const _sm=spawnMonster;spawnMonster=function(type,x,y,o){const m=_sm(type,x,y,o);const L=(TOWNS[S.town]&&TOWNS[S.town].lvl)||1;if(L>2.6&&!m.boss){const fh=(2.6+(L-2.6)*.55)/L,fd=(2.6+(L-2.6)*.3)/L;m.hp*=fh;m.maxHp*=fh;m.dmg*=fd;}return m;};}
