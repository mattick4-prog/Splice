// ================= TURNED CREW FOLLOW YOU (or stay home) =================
function isFollower(m){return m.turned?m.follow!==false:m.follow===true;}
function followers(){return S.crew.filter(m=>!m.dead&&isFollower(m));}
function crewAllyTick(){if(S.mode!=='hunter'){return;}const P=S.P;
  followers().forEach(m=>{let a=S.allies.find(x=>x.crewRef===m&&!x.dead);
    if(!a){if(m.hp!==undefined&&m.hp<=0)return;a={x:P.x+rnd(-30,30),y:P.y+rnd(-30,30),r:11,hp:m.hp||80,maxHp:80,dmg:12,spd:205,life:1e9,atkCd:0,dead:false,sc:P.sc,look:'crew',col:'#c27bff',crewRef:m};S.allies.push(a);}
    m.hp=a.hp;if(a.hp<=0){m.dead=true;a.dead=true;banner(m.name.toUpperCase()+' IS DEAD','Your mutant fought for you to the end.','#c27bff');}});
  // sent home: remove their ally body
  S.allies.forEach(a=>{if(a.crewRef&&(a.crewRef.follow===false||a.crewRef.dead))a.dead=true;});}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);crewAllyTick();};}
// followers aren't at the base, and they never attack your pack
{const _uc=updateCrew;updateCrew=function(dt){const all=S.crew;S.crew=all.filter(m=>!isFollower(m));try{_uc(dt);}finally{const home=S.crew;S.crew=all;}};}
{const _dc=drawCrew;drawCrew=function(){const all=S.crew;S.crew=all.filter(m=>!isFollower(m));try{_dc();}finally{S.crew=all;}};}
{const _ua=updateAllies;updateAllies=function(dt){const pk=S.enemies.filter(e=>e.pack);if(pk.length)S.enemies=S.enemies.filter(e=>!e.pack);try{_ua(dt);}finally{if(pk.length)S.enemies=S.enemies.concat(pk);}
  S.allies.forEach(a=>{if(a.crewRef&&!a.dead&&a.hp<a.maxHp)a.hp=Math.min(a.maxHp,a.hp+1.5*dt);});};}
// draw them as mutants, not bugs
{const _dw=drawWorld;drawWorld=function(cam){const cr=S.allies.filter(a=>a.crewRef);if(cr.length)S.allies=S.allies.filter(a=>!a.crewRef);try{_dw(cam);}finally{if(cr.length)S.allies=S.allies.concat(cr);}
  cr.forEach(a=>{if(a.dead||a.sc!==S.P.sc)return;const m=a.crewRef,tg=nearestFoe(a,420),fa=tg?Math.atan2(tg.y-a.y,tg.x-a.x):Math.atan2(S.P.y-a.y,S.P.x-a.x);
    ctx.save();ctx.translate(a.x,a.y);ctx.fillStyle=m.turned?'rgba(194,123,255,.22)':'rgba(127,200,255,.18)';ctx.beginPath();ctx.arc(0,0,18,0,7);ctx.fill();ctx.rotate(fa);
    const tn=m.turned,sk=tn?'#b8a0d0':'#e8c09a';circ(6,-8,4.5,sk,1.5);circ(6,8,4.5,sk,1.5);circ(0,0,11,tn?'#5a3a7a':'#4a7a9a',2);circ(2,0,6,sk,1.5);if(!tn){ctx.strokeStyle='#333';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(4,4);ctx.lineTo(18,4);ctx.stroke();}
    if(m.turned){ctx.fillStyle='#d6a0ff';ctx.shadowColor='#d6a0ff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(6,-2,1.7,0,7);ctx.arc(6,2,1.7,0,7);ctx.fill();ctx.shadowBlur=0;}ctx.restore();
    label((m.turned?'🧬 ':ROLES[m.role].icon+' ')+m.name,a.x,a.y-20,m.turned?'#d6a0ff':'#cfe6f4',12);if(a.hp<a.maxHp)hpBar(a.x,a.y-30,30,a.hp/a.maxHp,'#c27bff');});};}
// camps notice the mutant walking with you
{const _so=searchOdds;searchOdds=function(c){return clamp(_so(c)-(followers().some(m=>m.turned)?.2:0),.05,.95);};}
function crewCampTick(){if(S.mode!=='hunter'||!followers().length)return;const P=S.P;
  S.camps.forEach(c=>{if(c.raided||c.brood||c.hostile||c.mutDay===S.day)return;
    if(S.allies.some(a=>a.crewRef&&a.crewRef.turned&&!a.dead&&a.sc==='out'&&Math.hypot(a.x-c.x,a.y-c.y)<c.r+30)){c.mutDay=S.day;campRep(c,-6,'"You brought THAT inside our wall?! Its eyes are glowing!"');}});}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);crewCampTick();};}
// the Bag shows your crew, with a follow / stay-home switch
{const _ih=invHtml;invHtml=function(){const h=_ih(),crew=S.crew.filter(m=>!m.dead);if(!crew.length)return h;
  const rows=crew.map(m=>{const i=S.crew.indexOf(m),f=isFollower(m);
    return `<div class="crow ${m.turned?'mut':''}"><span class="ci">${m.turned?'🧬':ROLES[m.role].icon}</span><div><b>${m.name}</b><small>${m.turned?'Turned mutant · '+(f?'following you':'at your cabin'):ROLES[m.role].name+' · lives at your cabin'}</small></div>
      ${m.turned?`<button class="btn sm ${f?'gold':'ghost'}" data-a="crewfollow" data-i="${i}" title="${f?'Send them home to guard your cabin':'Bring them with you. They fight for you, but camps hate seeing them.'}">${f?'🐾 Following':'🏠 At home'}</button>`:''}</div>`;}).join('');
  return h.replace('<h3 class="ih">🕒 Just picked up</h3>',`<h3 class="ih">👥 Crew <small>turned mutants can follow you</small></h3><div class="crows">${rows}</div><h3 class="ih">🕒 Just picked up</h3>`);};}
{const _act=act;act=function(a,d){if(a==='crewfollow'){const m=S.crew[+d.i];if(m&&m.turned){m.follow=m.follow===false?true:false;toast(m.follow?'🐾 '+m.name+' falls in beside you.':'🏠 '+m.name+' heads back to your cabin.','mem');}refreshPanel();return;}_act(a,d);};}
// save follow choice (turned crew are already saved)
saveExt(d=>{if(!d.crew)return;d.crew.forEach((c,i)=>{if(S.crew[i])c.follow=S.crew[i].follow;});});
(function(){const st=document.createElement('style');st.textContent=`.crows{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}.crow{display:flex;align-items:center;gap:10px;background:#0006;border:2px solid #3a423e;border-radius:12px;padding:6px 10px}.crow.mut{border-color:#c27bff88}.crow .ci{font-size:26px}.crow div{flex:1}.crow b{display:block}.crow small{opacity:.7;font-size:12px}`;document.head.appendChild(st);})();
