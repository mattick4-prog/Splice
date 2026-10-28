// ================= HOVER TOOLTIPS =================
const RES_INFO={wood:['Wood','Boards up windows at night and builds base upgrades. Smash furniture to get it.'],
  scrap:['Scrap metal','Builds base upgrades and better weapons. Smash furniture and search toolboxes.'],
  wire:['Wire','Needed for upgrades, turrets and splicing powers. Found in electronics and under car seats.'],
  food:['Food','You eat 1 every morning. With none, you start starving and lose health.'],
  meds:['Meds','Press H to heal. Also used to splice powers together.'],
  fuel:['Fuel','Pour 3 into the truck at the Garage to drive to the next town. Barrels and gas stations have it.'],
  ammo:['Ammo','Bullets for guns. Melee weapons don\'t need any.'],
  mutagen:['Mutagen','Adds a gene mod (an extra upgrade) to a power at the DNA Lab.']};
const HOV=[];
function hov(x,y,w,h,t,d){HOV.push({x,y,w,h,t,d});}
let tipEl=null,domTip=false;
function ensureTip(){if(tipEl)return;tipEl=document.createElement('div');tipEl.id='tip';document.body.appendChild(tipEl);
  document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('[title],[data-tip]');
    if(!el){if(domTip){domTip=false;tipEl.style.display='none';}return;}
    if(el.hasAttribute('title')){const t=el.getAttribute('title');el.removeAttribute('title');if(t)el.dataset.tip=t;}
    if(!el.dataset.tip)return;domTip=true;const tp=el.dataset.tip.split('||');showTip(tp[0],tp[1]||'',e.clientX,e.clientY);});
  document.addEventListener('mousemove',e=>{if(domTip)placeTip(e.clientX,e.clientY);});}
function showTip(t,d,x,y){tipEl.innerHTML=(t?`<b>${t}</b>`:'')+(d?`<span>${d}</span>`:'');tipEl.style.display='block';placeTip(x,y);}
function placeTip(x,y){const r=tipEl.getBoundingClientRect();let tx=x+16,ty=y+18;if(tx+r.width>innerWidth-8)tx=x-r.width-12;if(ty+r.height>innerHeight-8)ty=y-r.height-12;tipEl.style.left=Math.max(8,tx)+'px';tipEl.style.top=Math.max(8,ty)+'px';}
function geneList(type){const g=(MONSTERS[type].genes||[MONSTERS[type].power]).map(id=>geneInfo(id)).filter(Boolean);return g.map(x=>x.icon+' '+x.name).join(', ');}
function worldTip(){
  const P=S.P,cam=getCam(),wx=cam.x+mouse.x/SCALE,wy=cam.y+mouse.y/SCALE,sc=P.sc;
  const e=S.enemies.filter(e=>!e.dead&&e.sc===sc&&Math.hypot(e.x-wx,e.y-wy)<e.r+10).sort((a,b)=>Math.hypot(a.x-wx,a.y-wy)-Math.hypot(b.x-wx,b.y-wy))[0];
  if(e){if(e.kind==='monster'){const M=MONSTERS[e.type];return [e.name+(e.boss?' (boss)':''),'Health '+Math.max(0,Math.round(e.hp))+' / '+Math.round(e.maxHp)+'. Kill it and it may drop DNA for: '+geneList(e.type)+'.'+(e.stolen.length?' It stole your '+e.stolen.map(id=>POWERS[id].name).join(', ')+'! Kill it to get it back.':'')+(M.splits&&!e.split?' Splits in two when hurt.':'')];}
    return [e.name||'Survivor',e.isRival?'The hunter Vance. He can rip powers out of you.':'A human. Health '+Math.round(e.hp)+'.'];}
  const pk=S.pickups.find(p=>p.sc===sc&&Math.hypot(p.x-wx,p.y-wy)<22);
  if(pk){const g=geneInfo(pk.gene);return ['DNA strand: '+g.name,QUAL[pk.q].name+' quality. Walk over it to put it in your vault, then press Tab to use it.'];}
  const al=S.allies.find(a=>a.sc===sc&&Math.hypot(a.x-wx,a.y-wy)<a.r+8);
  if(al)return [al.look==='clone'?'Your copy':'Your ally','Fights on your side for '+Math.ceil(al.life)+' more seconds.'];
  if(sc==='out'){
    const c=S.cars.find(c=>Math.hypot(c.x-wx,c.y-wy)<34);
    if(c){const CT=CARTYPES[c.type];return [c.wreck?'Wrecked car':CT.name,c.wreck?'Too smashed to use. You can still search it.':(c.searched?'Trunk already searched. ':'Hold E next to it to search the trunk. ')+'Press E to hide inside.'+(c.drivable?(S.keys[c.id]?' You have its keys: press E to drive.':' Find its keys to drive it.'):'')];}
    const cp=S.camps.find(c=>Math.hypot(c.x-wx,c.y-wy)<60);
    if(cp)return ['⛺ '+cp.name,cp.raided?'Raided and empty.':cp.hostile?'Hostile. They will shoot at you.':'Survivor camp led by '+cp.leader+'. Walk up and press E to trade, get jobs and hear rumors.'];
    const b=S.blds.find(b=>wx>=b.x&&wx<=b.x+b.w&&wy>=b.y&&wy<=b.y+b.h);
    if(b&&b.garage)return ['🔧 Garage',S.truck&&truckParts().length?'Your broken truck is in here. Truck needs: '+(truckReady()?'nothing! Ready to go.':truckNeed())+'.':'Your truck is in here.'];
    if(b&&S.truck&&Object.keys(S.truck.where).some(k=>S.truck.where[k]===b.id&&S.truck.parts[k]==='missing'))return [b.name,'🔩 A truck part is hidden in here. Look for the glowing blue container.'];
    if(b){if(b.id==='base'||b===BASE)return ['Your base','Walk in the door to use the workbench, DNA lab, bed and more.'];
      const I=S.interiors[b.id],left=I?I.props.filter(p=>!p.dead&&PROPS[p.type].cont&&!p.searched).length:0;
      return [b.name,(b.boss?'The boss lives here. ':'')+'Walk into the door to go inside.'+(I&&I.visited||b.visited?(left?' '+left+' things left to search.':' Searched out.'):'')];}
    if(BASE&&wx>=BASE.x-60&&wx<=BASE.x+60&&wy>=BASE.y-60&&wy<=BASE.y+60)return ['Your base','Walk in the door to use the workbench, DNA lab, bed and more.'];
  }else{
    const I=sceneObj(sc);if(!I)return null;
    const st=(I.stations||[]).find(s=>wx>=s.x&&wx<=s.x+s.w&&wy>=s.y&&wy<=s.y+s.h);if(st)return [st.name,'Stand next to it and press E.'];
    const p=(I.props||[]).find(p=>!p.dead&&wx>=p.x&&wx<=p.x+p.w&&wy>=p.y&&wy<=p.y+p.h);
    if(p&&p.part&&!p.searched)return ['🔩 Truck part inside!','Hold E next to it to grab the '+TPARTS[p.part].name.toLowerCase()+'.'];
    if(p){const D=PROPS[p.type];return [D.name,D.cont?(p.searched?'Already searched.':'Hold E next to it to search it.'):D.brk?'Attack it to smash it for materials.':'Just furniture.'];}
  }
  return null;
}
function updateTips(){
  ensureTip();if(domTip)return;
  if(!S||ovMode||!(S.mode==='hunter'||S.mode==='monster')||performance.now()-mouse.moved>4000){tipEl.style.display='none';return;}
  let h=null;for(let i=HOV.length-1;i>=0;i--){const r=HOV[i];if(mouse.x>=r.x&&mouse.x<=r.x+r.w&&mouse.y>=r.y&&mouse.y<=r.y+r.h){h=[r.t,r.d];break;}}
  if(!h&&!S.P.hidden&&performance.now()-mouse.moved>350&&!mouse.down)h=worldTip();
  if(h)showTip(h[0],h[1],mouse.x,mouse.y);else tipEl.style.display='none';
}
function hudTips(sx,sy,sw,small){
  const P=S.P,mon=S.mode==='monster';
  hov(22,22,236,18,'Health','If it runs out you lose a life. Press H to use meds. Sleeping in your bed and eating also help.');
  if(!mon){hov(22,44,236,20,'Lives: '+S.lives+' of 3','Lose all 3 and you start over in a new shack in this town. You keep your powers, but lose your supplies and base. You get a life back in each new town.');
    hov(22,68,236,14,'Humanity '+Math.round(S.humanity),'Using powers costs a little humanity. Survivors trust you less as it drops. At 0 you become the monster.');
    hov(22,88,236,14,'Base health: '+TIERS[S.tier].name,'Monsters claw at your base at night. Board up windows and build upgrades at the workbench.');}
  else{hov(22,46,236,14,'Fear','How scared the town is of you. Breaking outposts and hunting raise it.');hov(22,66,236,14,'Nest health','Defend your nest. If it burns, you lose your spawning ground.');hov(22,88,236,22,'Biomass','Spend it at your nest (B) to evolve.');}
  hov(VW/2-200,10,400,40,'Town, day and clock','The bar shows how long until '+(S.night?'dawn':'night')+'. Monsters get stronger at night.');
  hov(VW/2-300,54,600,20,'Your goal','What to do next. Press J for the full list.');
}
