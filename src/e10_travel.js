// ================= DRIVING BACK: TOWN MEMORY, DRIVE-TO MAP, MARKETS, HELP CALLS =================
function destTown(){return S.travelTo!==undefined&&S.travelTo!==null?S.travelTo:S.town+1;}
function curChapter(){const t=Math.max(S.maxTown||0,S.town);return CHAPTERS.find(c=>c.town===t)||CHAPTERS[CHAPTERS.length-1];}
function townGenes(i){const T=TOWNS[i],types=new Set(T.raid.concat(T.blds.filter(b=>b.monster).map(b=>b.monster)));if(T.boss)types.add(T.boss);
  const g=new Set();types.forEach(t=>{const M=MONSTERS[t];if(M)(M.genes||[M.power]).forEach(x=>{if(geneInfo(x))g.add(x);});});return [...g];}
function dnaNeeded(i){return townGenes(i).filter(g=>(S.dna[g]||0)<100);}
function frontierOpen(){const f=S.maxTown||0;return !!TOWNS[f+1]&&!!tlog(f).bossDead;}
function destinations(){
  const out=[];
  Object.keys(S.townLog).map(Number).sort((a,b)=>a-b).forEach(i=>{if(i===S.town||!TOWNS[i]||!tlog(i).visited||TOWNS[i].arena)return;out.push({i,fresh:false});});
  const f=(S.maxTown||0)+1;if(TOWNS[f]&&f!==S.town)out.push({i:f,fresh:true,locked:!tlog(S.maxTown||0).bossDead});
  return out;
}
function townCard(d){
  const T=TOWNS[d.i],L=tlog(d.i),away=(S.gday||1)-(L.leftDay||S.gday||1),hc=S.helpCall&&S.helpCall.town===d.i?S.helpCall:null;
  const tags=[];
  if(d.fresh)tags.push(`<span class="tag" style="color:#7fe0c8">❓ NEW TOWN</span>`);
  else if(L.liberated)tags.push(`<span class="tag" style="color:#7fc8ff">🛡️ FREED · safer</span>`);
  else tags.push(`<span class="tag" style="color:#ff8a95">⚠️ UNFINISHED · monsters +${Math.min(6,Math.max(0,away))*10}%</span>`);
  if(hc)tags.push(`<span class="tag" style="color:#ff5a68">🆘 ${hc.name} under attack · ${Math.max(0,hc.deadline-(S.gday||1))+1} day${hc.deadline-(S.gday||1)>=1?'s':''} left</span>`);
  if(!d.fresh&&L.liberated)tags.push(`<span class="tag" style="color:var(--gold)">🏪 Trading post</span>`);
  const camps=(L.camps||[]).filter(c=>!c.raided&&!c.hostile).length;if(!d.fresh&&camps)tags.push(`<span class="tag">📋 ${camps} camp${camps>1?'s':''} with jobs</span>`);
  if(!d.fresh&&(L.tier||0)>0)tags.push(`<span class="tag">🏠 Your ${TIERS[L.tier].name}</span>`);
  if(!d.fresh&&L.stash&&Object.values(L.stash).some(v=>v>0))tags.push(`<span class="tag">📦 Stash: ${Object.keys(L.stash).filter(k=>L.stash[k]>0).map(k=>RES_ICON[k]+L.stash[k]).join(' ')}</span>`);
  const need=d.fresh?[]:dnaNeeded(d.i);
  const dna=d.fresh?'<small>🧬 New monster families, new DNA.</small>':need.length?`<small>🧬 DNA you still need here: ${need.slice(0,8).map(g=>`<span title="${geneInfo(g).name}">${geneInfo(g).icon}</span>`).join(' ')}${need.length>8?' +'+(need.length-8):''}</small>`:'<small>🧬 You have all the DNA from this town.</small>';
  const ok=truckReady()&&!d.locked;
  return `<div class="tcard ${hc?'urgent':''}"><div class="row" style="justify-content:space-between;align-items:baseline"><b style="font-size:20px">${T.name}</b>${d.fresh?'':`<small class="mute">${townCompletion(d.i)}% done · ${away>0?away+' day'+(away>1?'s':'')+' away':'just left'}</small>`}</div>
    <div class="row" style="gap:6px;margin:6px 0">${tags.join('')}</div>${dna}
    <button class="btn ${hc?'gold':''}" style="margin-top:8px" data-a="driveto" data-i="${d.i}" ${ok?'':'disabled'} title="${d.locked?'Kill the boss in '+TOWNS[S.maxTown||0].name+' first':!truckReady()?'Fix the truck and put '+FUEL_NEED+' fuel in it first':'Uses the '+FUEL_NEED+' fuel in the tank'}">🚚 Drive to ${T.name} (${FUEL_NEED} ⛽)</button>${d.locked?`<small style="display:block;color:#ff8a95">🔒 Kill ${MONSTERS[TOWNS[S.maxTown||0].boss].name} in ${TOWNS[S.maxTown||0].name} first.</small>`:''}</div>`;
}
function driveToHtml(){
  const ds=destinations();
  return `<h3>🗺️ Drive to…</h3><p class="mute" style="margin:0 0 8px">Every trip burns the ${FUEL_NEED} fuel in the tank. Your base stays in each town, and whatever doesn't fit in the truck stays in that town's stash.</p>
  ${ds.length?ds.map(townCard).join(''):'<p class="mute">Nowhere else to go yet.</p>'}`;
}
function leaveTownMemory(){
  const L=tlog();L.tier=S.tier;L.leftDay=S.gday||1;L.day=S.day;
  L.camps=S.camps.map(c=>({rep:c.rep,raided:c.raided,hostile:c.hostile,visited:c.visited,tested:c.tested}));
  const st={};Object.keys(S.res).forEach(k=>{const left=S.res[k]-(S.pack&&S.pack[k]||0);if(left>0)st[k]=left;});
  L.stash=st;
}
function marketOffers(i){
  const genes=townGenes(i).filter(g=>POWERS[g]||TRAITS[g]);const out=[];
  if(genes.length){const g=pick(genes);out.push({give:{scrap:3,meds:1},get:{strand:g},stock:1,market:true});}
  out.push({give:{wire:2,scrap:2},get:{mutagen:2},stock:2,market:true});
  out.push({give:{scrap:6,wire:2},get:{weapon:1},stock:1,market:true});
  return out;
}
function offerTxt(get){return Object.keys(get).map(k=>k==='strand'?`🧪 pure ${geneInfo(get[k]).icon} ${geneInfo(get[k]).name} strand`:k==='weapon'?'🗡️ a better weapon':get[k]+' '+RES_ICON[k]+' '+k).join(' + ');}
function giveOffer(get){for(const k in get){if(k==='strand')S.vault.push({id:Math.random(),gene:get[k],q:'pure',val:40,age:0});else if(k==='weapon')giveWeapon();else S.res[k]+=get[k];}}
function arriveTown(){
  const i=destTown();S.travelTo=null;Object.keys(S.stolen).forEach(id=>delete S.stolen[id]);
  const L=tlog(i),fresh=!L.visited,away=fresh?0:Math.max(0,(S.gday||1)-(L.leftDay||S.gday||1));
  S.gday=(S.gday||1)+1;
  S.day=fresh?1:Math.min(30,(L.day||1)+(L.bossDead?0:Math.min(6,away)));S.clock=0;S.night=false;S.starving=false;
  if(fresh)S.lives=Math.min(S.maxLives||3,S.lives+1);
  loadTown(i);S.maxTown=Math.max(S.maxTown||0,i);
  S.tier=L.tier||0;S.windows=[];makeBaseInterior();S._sol={};
  S.baseHp=baseMax();S.windows.forEach(w=>w.hp=winMax());
  const P=S.P,B=S.baseInt;teleport(P,B.x+B.w/2,B.y+B.h/2,'base');P.hp=maxHp();P.dead=false;P.leap=null;P.rollT=0;P.car=null;P.hidden=null;
  S.log=[];S.banners=[];const T=TOWNS[i];
  if(fresh){
    if(T.arena){banner(T.name.toUpperCase(),MONSTERS[T.boss].name+' is waiting outside. This is the fight for the whole state. +1 life.','#ff3b5c');toast('The Warden copies your powers when it gets hurt, and gets angry near the end. Bring your best loadout.','bad');}
    else{banner(T.name.toUpperCase(),'New town, new monsters, new DNA. The boss is in '+T.lair+'. +1 life.','#7fe0c8');
      toast(T.name+' has its own monster families. Their DNA unlocks new powers.');
      toast('🏠 Your base doesn\'t come with you. You set up in an empty shack here. Your old base is still waiting in the last town.');
      toast('One building in every town is a mimic. You will find out which when you try the door.','bad');
      toast('🚚 The truck broke down on the way in. Find its missing parts and fix it at the Garage 🔧.');}
    return;}
  // ---- coming back ----
  Object.values(S.interiors).forEach(I=>I.props.forEach(p=>{delete p.part;}));S.truck={parts:{},where:{},fuel:0};
  const refill=clamp(.15+away*.15,.15,.6);Object.values(S.interiors).forEach(I=>I.props.forEach(p=>{if(PROPS[p.type].cont&&Math.random()>refill)p.searched=true;}));
  if(L.camps)S.camps.forEach((c,j)=>{if(L.camps[j])Object.assign(c,L.camps[j]);});
  if(L.liberated){let n=0;S.enemies=S.enemies.filter(e=>!(e.sc==='out'&&!e.home&&!e.boss&&++n>2));
    S.camps.forEach(c=>{if(c.raided||c.hostile)return;c.market=true;c.offers=c.offers.concat(marketOffers(i));if(c.recruits.length<3)c.recruits.push({name:pick(NPC_NAMES),role:pick(Object.keys(ROLES))});});}
  if(L.stash&&Object.values(L.stash).some(v=>v>0)){const got=Object.keys(L.stash).filter(k=>L.stash[k]>0).map(k=>{S.res[k]+=L.stash[k];return RES_ICON[k]+' '+L.stash[k];});L.stash={};toast('📦 Your stash was still here: '+got.join(', ')+'.','good');}
  banner('BACK IN '+T.name.toUpperCase(),(L.liberated?'Freed town: fewer monsters, and the camps run a trading post now.':'Unfinished town'+(away?': '+away+' day'+(away>1?'s':'')+' away made the monsters '+Math.min(6,away)*10+'% stronger.':'.'))+' The truck runs; it just needs '+FUEL_NEED+' fuel to leave.',L.liberated?'#7fc8ff':'#ffb347');
  if(away)toast('⏳ '+away+' day'+(away>1?'s':'')+' passed. Some containers have new loot, and strays wandered back in.');
  if((L.tier||0)>0)toast('🏠 Your '+TIERS[L.tier].name+' is still standing here.','good');
  if(S.helpCall&&S.helpCall.town===i)startHelpDefense();
}
// ---------- help calls ----------
function helpCallTick(){
  if(S.mode!=='hunter')return;const g=S.gday||1;
  if(S.helpCall&&!S.helpCall.active&&g>S.helpCall.deadline){const h=S.helpCall,L=tlog(h.town);if(L.camps&&L.camps[h.camp])L.camps[h.camp].raided=true;
    toast('📻 Silence on the radio. '+h.name+' in '+TOWNS[h.town].name+' fell. Nobody came.','bad');banner(h.name.toUpperCase()+' FELL','You didn\'t make it back in time.','#ff5a68');S.helpCall=null;return;}
  if(S.helpCall||Math.random()>.35)return;
  const cand=[];Object.keys(S.townLog).map(Number).forEach(i=>{if(i===S.town||!TOWNS[i]||TOWNS[i].arena)return;const L=tlog(i);(L.camps||[]).forEach((c,j)=>{if(!c.raided&&!c.hostile&&c.visited)cand.push([i,j]);});});
  if(!cand.length)return;const [i,j]=pick(cand),N=CAMP_NAMES[{Millbrook:0,Saltmarsh:1,Frostfall:2,Dustbowl:3,'Old Haven':4}[TOWNS[i].name]||0];
  const name=(N&&N[j]?N[j].name:'A camp');S.helpCall={town:i,camp:j,name,deadline:g+2};
  banner('🆘 RADIO: '+name.toUpperCase(),'"Anybody out there? We\'re being overrun in '+TOWNS[i].name+'!" Drive back within 3 days to save them.','#ff5a68');
  toast('🆘 '+name+' in '+TOWNS[i].name+' is under attack. Fix the truck, fuel up, and drive there from the Garage 🔧 within 3 days.','bad');
}
function startHelpDefense(){
  const h=S.helpCall,c=S.camps[h.camp];if(!c){S.helpCall=null;return;}h.active=true;
  const pool=TOWNS[S.town].raid;for(let k=0;k<6;k++){const a=k/6*6.28,m=spawnMonster(pick(pool),c.x+Math.cos(a)*190,c.y+Math.sin(a)*190,{sc:'out'});m.helpRaid=true;m.state='chase';m.wx=c.x;m.wy=c.y;}
  banner('SAVE '+h.name.toUpperCase(),'Monsters are attacking the camp. Get over there and kill them all!','#ff5a68');
}
function helpTick(){const h=S.helpCall;if(!h||!h.active||S.town!==h.town)return;
  if(S.enemies.some(e=>e.helpRaid&&!e.dead))return;
  const parts=giveRes({food:3,meds:2,ammo:6,scrap:3},S.P.x,S.P.y-30);S.humanity=Math.min(100,S.humanity+6);const c=S.camps[h.camp];if(c)c.rep=Math.min(100,(c.rep||0)+30);
  banner(h.name.toUpperCase()+' SAVED','They\'ll never forget it. +6 humanity, and a reward: '+parts.join(', ')+'.','#7dff9a');S.helpCall=null;S.stats.saved=(S.stats.saved||0)+1;}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(S&&S.mode==='hunter')helpTick();};}
{const _od=onDawn;onDawn=function(){S.gday=(S.gday||1)+1;_od();helpCallTick();};}
