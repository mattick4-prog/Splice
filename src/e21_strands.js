// ================= DNA strand tooltips + stacking duplicate strands =================
function strandTip(v,n){
  const g=geneInfo(v.gene);if(!g)return '';const Q=QUAL[v.q]||QUAL.clean,trait=!!TRAITS[v.gene],fam=FAM[g.fam]||{name:''},have=Math.round(S.dna[v.gene]||0);
  const stage=trait?(have>=100?'unlocked':'locked, needs 100%'):(have>=150?'mastered':have>=100?'full power':have>=40?'weak echo':'locked, needs 40%');
  const lines=[g.desc,'🧬 You have: '+have+'% ('+stage+')',
    '🧪 This strand ('+Q.name+' '+'★'.repeat(qStars(v.q))+'): +'+Math.round(v.val*.5)+'% raw, up to +'+Math.round(v.val*1.6)+'% in the lab'];
  if(SRC[v.gene])lines.push('🗡️ From: '+SRC[v.gene]);
  if(n>1)lines.push('📦 ×'+n+': '+n+' strands of the same DNA (you killed that kind of monster more than once). Each one adds more %.');
  return (g.icon+' '+g.name+' · '+(trait?'Trait':'Power')+(fam.name?' ('+fam.name+')':'')+'||'+lines.join('<br>')).replace(/"/g,'&quot;');
}
function strandGroups(){const m={};S.vault.forEach(v=>{const k=v.gene+'|'+v.q;(m[k]=m[k]||[]).push(v);});return m;}
function fixRack(html){
  if(!html||html.indexOf('ttube')<0)return html;const G=strandGroups(),byId={};for(const k in G)G[k].forEach(v=>byId[String(v.id)]=G[k]);
  const selGroups=new Set();
  html.replace(/<button class="ttube( sel)?[^"]*"[^>]*data-v="([^"]+)"/g,(m,sel,id)=>{if(sel&&byId[id])selGroups.add(byId[id]);return m;});
  return html.replace(/<button class="ttube([^"]*)"([^>]*?)data-v="([^"]+)"([^>]*)>([\s\S]*?)<\/button>/g,(m,cls,a1,id,a2,inner)=>{
    const grp=byId[id];if(!grp)return m;if(String(grp[0].id)!==id)return '';
    const n=grp.length,sel=selGroups.has(grp)?' sel':'';cls=cls.replace(' sel','')+sel;
    const attrs=(a1+'data-v="'+id+'"'+a2).replace(/\stitle="[^"]*"/,'')+' title="'+strandTip(grp[0],n)+'"';
    return `<button class="ttube${cls}"${attrs.startsWith(' ')?'':' '}${attrs}>${inner}${n>1?`<em class="tcount">×${n}</em>`:''}</button>`;});
}
{const _vt=vaultTab;vaultTab=function(){return fixRack(_vt());};}
{const _tr=tubeRack;tubeRack=function(off){return fixRack(_tr(off));};}
{const _cd=campDnaSec;campDnaSec=function(c){return fixRack(_cd(c));};}
// strands on the ground
{const _wt=worldTip;worldTip=function(){const r=_wt();if(!r||!/^DNA strand/.test(r[0]))return r;
  const P=S.P,cam=getCam(),wx=cam.x+mouse.x/SCALE,wy=cam.y+mouse.y/SCALE;const pk=S.pickups.find(p=>p.sc===P.sc&&Math.hypot(p.x-wx,p.y-wy)<22);if(!pk)return r;
  const g=geneInfo(pk.gene);return ['DNA strand: '+g.icon+' '+g.name+(TRAITS[pk.gene]?' (trait)':' (power)'),g.desc+' '+QUAL[pk.q].name+' quality. Walk over it to grab it.'];};}
(function(){const st=document.createElement('style');st.textContent=`.ttube{position:relative}.tcount{position:absolute;top:2px;right:2px;font-style:normal;font-weight:800;font-size:12px;background:#ffd166;color:#222;border-radius:8px;padding:0 5px;box-shadow:0 1px 3px #000a}#tip span{display:block}`;document.head.appendChild(st);})();
// locked cards show WHICH power they are, not just the monster (no more look-alike cards)
function ghostCard(id){const g=geneInfo(id),tr=!!TRAITS[id];
  const tip=(g.icon+' '+g.name+' · '+(tr?'Trait':'Power')+' (locked)||'+g.desc+'<br>🗡️ Get it from: '+(SRC[id]||'?')+'<br>'+(tr?'Fill to 100% to unlock.':'Reach 40% to unlock a weak echo.')).replace(/"/g,'&quot;');
  return `<div class="pc ghost" title="${tip}"><div class="ring" style="--p:0"><span style="filter:grayscale(1) brightness(.8)">${g.icon}</span></div><b>${g.name}</b><small>🗡️ ${SRC[id]||'?'}</small></div>`;}
