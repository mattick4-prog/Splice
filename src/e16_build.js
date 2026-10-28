// ================= BLUEPRINTS: DRAG MATERIAL TILES TO BUILD =================
const MAT_COL={wood:'#a8743e',scrap:'#8a96a2',wire:'#d8a040',meds:'#e86a7a',fuel:'#c84a3a',food:'#c8a050',mutagen:'#7ad66a',ammo:'#d8c050'};
const BP_SHAPES={
  house:[[1,5],[2,5],[3,5],[4,5],[5,5],[1,4],[5,4],[1,3],[5,3],[2,4],[4,4],[3,4],[2,3],[4,3],[1,2],[2,2],[3,2],[4,2],[5,2],[2,1],[3,1],[4,1],[3,0]],
  wheel:[[3,3],[2,0],[3,0],[4,0],[1,1],[5,1],[0,2],[6,2],[0,3],[6,3],[0,4],[6,4],[1,5],[5,5],[2,5],[3,5],[4,5],[3,2],[2,3],[4,3]],
  gear:[[3,2],[3,3],[2,2],[4,3],[3,0],[1,1],[5,1],[0,3],[6,3],[1,5],[5,5],[3,5],[2,1],[4,1],[0,2],[6,2],[2,5],[4,5],[0,4],[6,4]],
  wall:[[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[1,2],[5,2],[1,4],[5,4],[1,5],[5,5]],
  spikes:[[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[1,4],[3,4],[5,4],[1,3],[3,3],[5,3],[3,2],[1,2],[5,2],[3,1]],
  ring:[[3,3],[2,1],[3,1],[4,1],[1,2],[5,2],[1,3],[5,3],[1,4],[5,4],[2,5],[3,5],[4,5],[3,0],[0,3],[6,3]],
  sword:[[0,5],[1,4],[2,3],[3,2],[4,1],[5,0],[1,5],[0,4],[2,4],[3,3],[4,2],[5,1],[6,0],[2,5],[0,3]],
  gun:[[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[1,3],[2,3],[1,4],[2,4],[4,3],[1,5]]
};
function bpInfo(a,d){
  if(a==='install'){const P=TPARTS[d.k];return S.truck&&S.truck.parts[d.k]==='found'?{name:P.name,icon:P.icon,cost:P.cost,shape:d.k==='tires'?'wheel':'gear'}:null;}
  if(a==='upgrade'){const n=TIERS[S.tier+1];return n?{name:n.name,icon:'🏠',cost:n.cost,shape:'house'}:null;}
  if(a==='defbuild'){const T=DEFS[d.t];return T&&S.defSlot!==undefined&&S.defSlot!==null&&!(S.defs||{})[S.defSlot]?{name:T.name,icon:T.icon,cost:T.cost,shape:d.t==='wall'?'wall':d.t==='trap'?'ring':'spikes'}:null;}
  if(a==='mod'){const M=MODS[d.k];return M&&!S.mods[d.k]?{name:M.name,icon:'🔧',cost:M.cost,shape:'gear'}:null;}
  if(a==='craft'){const W=WEAPONS[d.w];return W&&W.cost&&!S.weapons.includes(d.w)?{name:W.name,icon:W.icon,cost:W.cost,shape:W.ranged?'gun':'sword'}:null;}
  if(a==='rebuild')return S.ruined?{name:'Your shack',icon:'🏚️',cost:RUIN_COST,shape:'house'}:null;
  return null;
}
function openBlueprint(a,d,info){
  const mats=Object.keys(info.cost).filter(k=>info.cost[k]>0),total=mats.reduce((s,k)=>s+info.cost[k],0),n=Math.min(total,12);
  const cnt={};mats.forEach(k=>cnt[k]=Math.max(1,Math.round(n*info.cost[k]/total)));
  let sum=mats.reduce((s,k)=>s+cnt[k],0);while(sum>n){const k=mats.filter(k=>cnt[k]>1).sort((x,y)=>cnt[y]-cnt[x])[0];if(!k)break;cnt[k]--;sum--;}
  const slots=[];mats.forEach(k=>{const c=cnt[k],q=info.cost[k];for(let i=0;i<c;i++)slots.push({mat:k,qty:Math.floor(q/c)+(i<q%c?1:0),filled:false});});
  for(let i=slots.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}
  const tiles=slots.map((s,i)=>({id:i,mat:s.mat,qty:s.qty,used:false})).sort(()=>Math.random()-.5);
  S.bp={a,d:{...d},info,slots,tiles,back:S.panel,pick:null,done:false};openPanel('bp');
}
function bpHtml(){
  const B=S.bp;if(!B)return '<div class="card">Nothing to build.</div>';const cells=BP_SHAPES[B.info.shape]||BP_SHAPES.gear,filled=B.slots.filter(s=>s.filled).length;
  const grid=cells.map((c,i)=>{const s=B.slots[i],st=`left:${c[0]*14.28}%;top:${c[1]*16.66}%`;
    if(!s)return `<div class="bpcell deco" style="${st}"></div>`;
    return s.filled?`<div class="bpcell full" style="${st};--m:${MAT_COL[s.mat]}">${RES_ICON[s.mat]}${s.qty>1?'<i>×'+s.qty+'</i>':''}</div>`
      :`<div class="bpcell slot" data-a="bpslot" data-i="${i}" data-mat="${s.mat}" style="${st};--m:${MAT_COL[s.mat]}" title="Needs ${s.qty} ${s.mat}">${RES_ICON[s.mat]}${s.qty>1?'<i>×'+s.qty+'</i>':''}</div>`;}).join('');
  const tray=B.tiles.map(t=>t.used?'':`<div class="bptile ${B.pick===t.id?'sel':''}" draggable="true" data-a="bptile" data-t="${t.id}" data-mat="${t.mat}" style="--m:${MAT_COL[t.mat]}" title="${t.qty} ${t.mat}: drag it onto a matching spot">${RES_ICON[t.mat]}<b>${t.qty>1?'×'+t.qty:''}</b></div>`).join('');
  return `<div class="card">${head('Blueprint · Esc to cancel (nothing is spent until it\'s finished)','Build: '+B.info.icon+' '+B.info.name)}
    <div class="bpwrap ${B.done?'done':''}"><div class="bpboard"><div class="bpgrid">${grid}</div>${B.done?`<div class="bpdone">${B.info.icon}<b>BUILT!</b></div>`:''}</div>
    <div class="bpside"><p style="margin:0 0 6px;font-size:17px">🧩 <b>Drag each material onto a spot with the same picture</b>, or click a tile and then a spot.</p>
      <div class="dbar"><i style="width:${Math.round(100*filled/B.slots.length)}%;background:var(--gold)"></i></div><small class="mute">${filled} of ${B.slots.length} pieces placed</small>
      <div class="bptray">${tray||'<p class="mute">All pieces placed!</p>'}</div>${costHtml(B.info.cost)}</div></div></div>`;
}
function bpPlace(tid,si){const B=S.bp;if(!B||B.done)return;const t=B.tiles.find(x=>x.id==tid),s=B.slots[si];if(!t||t.used||!s||s.filled)return;
  if(t.mat!==s.mat){sfx('bad');toast('That spot needs '+s.mat+' '+RES_ICON[s.mat]+', not '+t.mat+'.','bad');B.pick=null;refreshPanel();const el=ov.querySelector(`[data-i="${si}"].bpcell`);if(el)el.classList.add('shake');return;}
  const same=B.slots.filter(x=>!x.filled&&x.mat===t.mat&&x.qty===t.qty);const target=s.qty===t.qty?s:(same[0]||s);
  target.filled=true;t.used=true;B.pick=null;sfx('hit');
  if(B.slots.every(x=>x.filled)){B.done=true;sfx('coin');refreshPanel();setTimeout(()=>{if(!S.bp||!S.bp.done)return;const {a,d,back}=S.bp;S.bp=null;S.panel=back;act(a,{...d,bp:'1'});if(back)openPanel(back);},700);return;}
  refreshPanel();}
{const _act=act;act=function(a,d){d=d||{};
  if(a==='bptile'){const B=S.bp;if(B){B.pick=B.pick===+d.t?null:+d.t;refreshPanel();}return;}
  if(a==='bpslot'){const B=S.bp;if(B&&B.pick!==null)bpPlace(B.pick,+d.i);else toast('Pick a material tile first, or drag one here.');return;}
  if(d.bp!=='1'){const info=bpInfo(a,d);if(info&&canPay(info.cost)&&!(a==='install'&&!canPay(info.cost))){openBlueprint(a,d,info);return;}}
  _act(a,d);};}
document.addEventListener('dragstart',e=>{const t=e.target.closest&&e.target.closest('.bptile');if(!t)return;e.dataTransfer.setData('text/plain','bp|'+t.dataset.t);e.dataTransfer.effectAllowed='move';});
document.addEventListener('dragover',e=>{const s=e.target.closest&&e.target.closest('.bpcell.slot');if(!s)return;e.preventDefault();s.classList.add('over');});
document.addEventListener('dragleave',e=>{const s=e.target.closest&&e.target.closest('.bpcell.slot');if(s)s.classList.remove('over');});
document.addEventListener('drop',e=>{const s=e.target.closest&&e.target.closest('.bpcell.slot');if(!s)return;const v=(e.dataTransfer.getData('text/plain')||'').split('|');if(v[0]!=='bp')return;e.preventDefault();bpPlace(+v[1],+s.dataset.i);});
// ================= CAMP TRUST: THINGS THAT MAKE THEM NERVOUS =================
function campRep(c,delta,why){c.rep=clamp((c.rep||0)+delta,-60,100);(c.mem=c.mem||[]).unshift({d:delta,why,day:S.day});if(c.mem.length>6)c.mem.length=6;
  floatText(c.x,c.y-c.r-24,(delta>0?'+':'')+delta+' trust','#'+(delta>0?'7dff9a':'ff8a95'));toast((delta>0?'😊 ':'😠 ')+c.name+': '+why+' ('+(delta>0?'+':'')+delta+' trust)',delta>0?'good':'bad');}
function campTrustTick(){if(S.mode!=='hunter'||S.P.dead)return;const P=S.P;if(P.sc!=='out'&&!P.posted)return;
  S.camps.forEach(c=>{if(c.raided||c.hostile)return;const d=dist(P,c);if(d>c.r+170)return;
    const chasers=S.enemies.filter(e=>!e.dead&&e.kind==='monster'&&e.sc==='out'&&e.state==='chase'&&dist(e,P)<260&&!(e.charmT>0)).length;
    if(chasers&&S.t-(c.ledT||-99)>20){c.ledT=S.t;campRep(c,-Math.min(15,5+chasers*2),'"You led '+chasers+' monster'+(chasers>1?'s':'')+' straight to us!"');}
    if(S.surge&&S.surge.t>0&&d<c.r+120&&S.t-(c.glowT||-99)>60){c.glowT=S.t;campRep(c,-4,'"You\'re glowing. What did you just put in your body?"');}});}
function powerSeen(){const P=S.P;if(S.mode!=='hunter'||P.sc!=='out')return;S.camps.forEach(c=>{if(c.raided||c.hostile)return;if(dist(P,c)<c.r+260&&S.t-(c.powT||-99)>8){c.powT=S.t;campRep(c,-3,'"We saw what you just did. That\'s not human."');}});}
{const _cs=castSlot;castSlot=function(i){const id=S.slots[i],before=id?(S.cds[id]||0):1;_cs(i);if(id&&before<=0&&(S.cds[id]||0)>0)powerSeen();};}
{const _cx=castSurge;castSurge=function(){const s=S.surge,before=s?(S.cds[s.id]||0):1;_cx();if(s&&before<=0&&(S.cds[s.id]||0)>0)powerSeen();};}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(Math.floor(S.t*4)!==Math.floor((S.t-dt)*4))campTrustTick();};}
{const _ch=campHtml;campHtml=function(){const h=_ch(),c=campOf(S.campOpen);if(!c)return h;
  const m=(c.mem||[]).map(x=>`<div class="logrow"><span style="color:${x.d>0?'#7dff9a':'#ff8a95'};font-weight:700;min-width:36px">${x.d>0?'+':''}${x.d}</span><span>${x.why}</span></div>`).join('');
  const sec=`<section style="margin-top:12px"><h3>🗣️ What they've noticed about you</h3>${m||'<p class="mute" style="margin:0">Nothing yet. Keep it that way: don\'t lead monsters here, don\'t use powers where they can see, and don\'t show up glowing.</p>'}</section>`;
  return h.replace(/<\/div>\s*$/,sec+'</div>');};}
