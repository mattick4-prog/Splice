// ================= INVENTORY (I) — everything you're carrying =================
RES_INFO.fuel=['Fuel','Pour '+FUEL_NEED+' into the truck at the Garage to drive to the next town. Barrels and gas stations have it.'];
const RES_NAME={wood:'Wood',scrap:'Scrap',wire:'Wire',food:'Food',meds:'Meds',fuel:'Fuel',ammo:'Ammo',mutagen:'Mutagen'};
function recentAdd(icon,txt){S.recent=S.recent||[];S.recent.unshift({icon,txt,day:S.day});if(S.recent.length>10)S.recent.length=10;}
{const _gr=giveRes;giveRes=function(got,x,y){const r=_gr(got,x,y);for(const k in got)if(got[k]>0)recentAdd(RES_ICON[k],'+'+got[k]+' '+RES_NAME[k]);return r;};}
{const _gw=giveWeapon;giveWeapon=function(){const n=S.weapons.length;_gw();if(S.weapons.length>n){const W=WEAPONS[S.weapons[S.weapons.length-1]];recentAdd(W.icon,W.name);}};}
{const _gk=giveKey;giveKey=function(){const r=_gk();if(r!==false)recentAdd('🔑','Car keys');return r;};}
{const _fp=findPart;findPart=function(id,x,y){const b=S.truck&&S.truck.parts[id];_fp(id,x,y);if(S.truck&&S.truck.parts[id]!==b)recentAdd(TPARTS[id].icon,TPARTS[id].name);};}
{const _ft=foundTire;foundTire=function(c){const n=S.truck&&S.truck.tires;_ft(c);if(S.truck&&S.truck.tires!==n)recentAdd('🛞','Good tire');};}
function slot(icon,n,name,tip,opts){opts=opts||{};
  return `<div class="islot ${opts.on?'on':''} ${opts.dim?'dim':''}" title="${(name+'||'+tip).replace(/"/g,'&quot;')}" ${opts.act||''}><span class="ii">${icon}</span>${n!==undefined&&n!==''?`<em class="in">${n}</em>`:''}<small>${name}</small>${opts.btn||''}</div>`;}
function invHtml(){
  const R=S.res,t=S.truck,mon=S.mode==='monster';
  const sup=Object.keys(RES_ICON).map(k=>{const info=RES_INFO[k]||[RES_NAME[k],''];
    const btn=k==='meds'&&!mon?`<button class="btn sm" data-a="invheal" ${R.meds>0&&S.P.hp<maxHp()?'':'disabled'}>Use (H)</button>`:'';
    return slot(RES_ICON[k],Math.max(0,R[k]),RES_NAME[k],info[1],{dim:R[k]<=0,btn});}).join('');
  const wps=S.weapons.map((w,i)=>{const W=WEAPONS[w];return slot(W.icon,'',W.name,W.desc+'<br>Damage '+W.dmg+(W.ranged?' · uses ammo':'')+(i===S.wpn?'<br><b>In your hands.</b>':'<br>Click to hold it.'),{on:i===S.wpn,act:i===S.wpn?'':`data-a="invwpn" data-i="${i}"`});}).join('');
  const keys=Object.keys(S.keys||{}).map(id=>{const c=S.cars.find(c=>c.id==id);if(!c)return '';const CT=CARTYPES[c.type];
    return slot('🔑','',CT.name,'Starts the '+(CT.cname?CT.cname+' ':'')+CT.name+' in this town. Follow the gold 🔑 arrow, then press E next to it to drive.'+(c.wreck?'<br>It got wrecked.':''),{dim:!!c.wreck});}).join('');
  const parts=t&&truckParts().length?truckParts().map(k=>{const st=t.parts[k],P=TPARTS[k];
    const lab={missing:'❓ not found',found:'🎒 carrying',dead:'🪫 needs charging',installed:'✅ in the truck'}[st]||st;
    const n=k==='tires'&&st==='missing'?(t.tires||0)+'/'+TIRES_NEED:'';
    return slot(P.icon,n,P.name,P.desc+'<br>'+lab+(st==='found'||st==='dead'?'<br>Take it to the Garage 🔧.':''),{dim:st==='missing',on:st==='installed'});}).join('')
    +slot('⛽',(t.fuel||0)+'/'+FUEL_NEED,'Fuel in truck','Fuel you have poured into the truck. You need '+FUEL_NEED+'.',{dim:(t.fuel||0)<FUEL_NEED,on:(t.fuel||0)>=FUEL_NEED}):'<p class="mute">No truck in this town.</p>';
  const strands=S.vault.length;
  const special=[
    strands?slot('🧪',strands,'DNA strands','Monster DNA in your vault. Click to open the Vault.',{act:'data-a="invvault"'}):'',
    S.disguiseOwned?slot('🧥','',S.disguise?'Hood (on)':'Hood (off)','Hides your changes from camps. Click to '+(S.disguise?'take it off.':'put it on.'),{on:S.disguise,act:'data-a="disguise"'}):'',
    cureN()>=6&&!S.antiUsed?slot('💉','1','Antiserum','One dose. If you ever become the Apex, use it at your nest to turn human again.',{}):'',
    (S.crew||[]).filter(m=>!m.dead).length?slot('👥',S.crew.filter(m=>!m.dead).length,'Crew','People living at your base. Check them at your bench.',{}):''
  ].join('');
  const recent=(S.recent||[]).map(r=>`<span class="rec">${r.icon} ${r.txt}</span>`).join('')||'<span class="mute">Nothing yet. Search containers (hold E) and smash furniture.</span>';
  return `<div class="card wide">${head('Inventory · I or Esc to close','🎒 Your bag')}
    <h3 class="ih">📦 Supplies</h3><div class="igrid">${sup}</div>
    <div class="icols"><div><h3 class="ih">⚔️ Weapons <small>Q to switch</small></h3><div class="igrid">${wps}</div></div>
    <div><h3 class="ih">🔑 Keys</h3><div class="igrid">${keys||'<p class="mute">No keys yet. Some containers and car visors have them.</p>'}</div></div></div>
    <h3 class="ih">🚚 Truck parts</h3><div class="igrid">${parts}</div>
    ${special?`<h3 class="ih">✨ Special</h3><div class="igrid">${special}</div>`:''}
    <h3 class="ih">🕒 Just picked up</h3><div class="recs">${recent}</div></div>`;
}
function openInv(){openPanel('inv');}
{const _rp=refreshPanel;refreshPanel=function(){if(S.panel==='inv'){const sc=ov.querySelector('.card'),top=sc?sc.scrollTop:0;showOv(invHtml(),'panel');const nc=ov.querySelector('.card');if(nc)nc.scrollTop=top;return;}_rp();};}
{const _act=act;act=function(a,d){
  if(a==='invheal'){useMeds();refreshPanel();return;}
  if(a==='invwpn'){S.wpn=+d.i;sfx('ui');refreshPanel();return;}
  if(a==='invvault'){openGenome('vault');return;}
  _act(a,d);if(S.panel==='inv'&&a==='disguise')refreshPanel();};}
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='i'||e.repeat||!S||!(S.mode==='hunter'||S.mode==='monster'))return;
  if(ovMode==='panel'&&S.panel==='inv'){hideOv();return;}if(!ovMode)openInv();});
// toolbar button
{const _ut=updateToolbar;updateToolbar=function(){_ut();if(tbEl&&!tbEl.querySelector('[data-tb="inv"]')){const d=tbEl.querySelector('[data-tb="dna"]');
  const b=document.createElement('button');b.dataset.tb='inv';b.title='Inventory (I)';b.innerHTML='<span>🎒</span><b>Bag</b><kbd>I</kbd>';
  b.addEventListener('click',e=>{e.stopPropagation();if(S)openInv();});d.after(b);}};}
(function(){const st=document.createElement('style');st.textContent=`
.ih{margin:12px 0 6px}.ih small{font-weight:normal;opacity:.6;font-size:12px;margin-left:6px;text-transform:none;letter-spacing:0}
.igrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}
.islot{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;background:linear-gradient(#2a2f2c,#1a1e1c);border:2px solid #3a423e;border-radius:12px;padding:10px 4px 8px;cursor:help;box-shadow:inset 0 2px 0 #ffffff10}
.islot[data-a]{cursor:pointer}.islot[data-a]:hover{border-color:var(--gold)}
.islot .ii{font-size:32px;line-height:1}.islot small{font-size:12px;text-align:center}.islot .in{position:absolute;top:4px;right:6px;font-style:normal;font-weight:800;font-size:15px;color:#ffd166;text-shadow:0 1px 2px #000}
.islot.on{border-color:#7dff9a;background:linear-gradient(#24402c,#16261a)}.islot.dim{opacity:.4}.islot .btn{margin-top:4px;padding:2px 8px;font-size:11px}
.icols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.recs{display:flex;flex-wrap:wrap;gap:6px}.rec{background:#0006;border:1px solid #3a423e;border-radius:8px;padding:3px 8px;font-size:13px}
@media (max-width:640px){.icols{grid-template-columns:1fr}}`;document.head.appendChild(st);})();
