// ================= HUMANITY & TRUST BALANCE: having powers ≠ hurting people =================
// 1) Humanity: getting and using powers costs a little. Hurting or changing people costs a lot.
let HUM_CTX=null;
{const _hh=humanityHit;humanityHit=function(n){const k={dna:.45,cast:.35,surge:.6,raw:.5}[HUM_CTX]||1;return _hh(n*k);};}
{const _ad=addDNA;addDNA=function(...a){const o=HUM_CTX;HUM_CTX='dna';try{return _ad(...a);}finally{HUM_CTX=o;}};}
{const _cs=castSlot;castSlot=function(...a){const o=HUM_CTX;HUM_CTX='cast';try{return _cs(...a);}finally{HUM_CTX=o;}};}
{const _su=castSurge;castSurge=function(...a){const o=HUM_CTX;HUM_CTX='surge';try{return _su(...a);}finally{HUM_CTX=o;}};}
{const _ar=absorbRaw;absorbRaw=function(...a){const o=HUM_CTX;HUM_CTX='raw';try{return _ar(...a);}finally{HUM_CTX=o;}};}
// anything that changes or hurts people marks the day as a "harm day"
function markHarm(){S.harmDay=S.day;}
{const _bg=broodGain;broodGain=function(n){markHarm();return _bg(n);};}
// a calm day with nobody hurt lets some humanity come back
{const _od=onDawn;onDawn=function(){const harmed=S.harmDay===S.day;_od();if(S.mode==='hunter'&&!harmed&&S.humanity<100&&S.humanity>0){const g=S.humanity<50?4:2;S.humanity=Math.min(100,S.humanity+g);toast('🙂 A quiet day where nobody got hurt. +'+g+' humanity.','good');}};}
// 2) Gate suspicion: powers are a little suspicious; monster marks and what you DO matter more
function powerMarks(){return S.disguise?0:bodyChanges().filter(c=>c.fam).length;}
function humanMarks(){return S.disguise?0:bodyChanges().filter(c=>!c.fam).length;}
function searchOdds(c){
  return clamp(.52+(c.rep||0)*.004+(S.humanity-50)*.004+(S.disguise?.15:0)-Math.min(.15,powerMarks()*.03)-humanMarks()*.08-(S.vault.length>=5?.1:0)-(S.night?.1:0),.05,.95);}
// the checkpoint shows power marks as mild, monster marks as serious
{const _gh=gateHtml;gateHtml=function(){let h=_gh();const ch=S.disguise?[]:bodyChanges();
  ch.forEach(x=>{if(x.fam)h=h.replace(`<span class="gchip bad" title="${x.name}: they can see it">${x.icon}</span>`,`<span class="gchip mild" title="${x.name}: a little strange, not scary">${x.icon}</span>`);});
  return h.replace(/(\d+) visible change(s?) on your body/,()=>{const p=powerMarks(),m=humanMarks();return [p?p+' power mark'+(p>1?'s':'')+' (a bit odd)':'',m?m+' monster sign'+(m>1?'s':'')+' (scary)':''].filter(Boolean).join(' and ')||'nothing strange';});};}
// 3) You can hit people. They will remember.
function hitReact(x,y,txt){floatText(x,y-24,txt,'#ff8a95');burst(x,y,'#ff5a68',6);sfx('hit');}
function campPeople(c){const out=[{x:c.x+10,y:c.y+28,who:'leader',name:c.leader}];(c.recruits||[]).forEach((r,i)=>out.push({x:c.x-30+i*22,y:c.y-4,who:'recruit',name:r.name,ref:r}));
  (c.guards||[]).forEach(g=>out.push({x:c.x+Math.cos(g.a)*c.r*.85,y:c.y+Math.sin(g.a)*c.r*.85,who:'guard',name:'a guard'}));
  (c.sick||[]).forEach(s=>{const p=sickPos(c,s);out.push({x:p.x,y:p.y,who:'sick',name:s.name,ref:s});});
  if(c.fort&&!c.brood){const g=gateCenter(c,34),tx=-Math.sin(c.gate),ty=Math.cos(c.gate);[-1,1].forEach(s=>out.push({x:g.x+tx*s*40,y:g.y+ty*s*40,who:'guard',name:'the gate guard'}));}
  return out;}
function inSwing(px,py,range,arc){const P=S.P,d=Math.hypot(px-P.x,py-P.y);if(d>range+12)return false;return d<P.r+14||Math.abs(angDiff(Math.atan2(py-P.y,px-P.x),P.face))<arc;}
{const _pa=playerAttack;playerAttack=function(){const P=S.P,W=WEAPONS[S.weapons[S.wpn]]||WEAPONS.crowbar,melee=S.mode==='hunter'&&!W.ranged;_pa();if(!melee||P.dead)return;
  const range=W.range,arc=W.arc;
  if(S.enemies.some(e=>!e.dead&&!e.pack&&e.sc===P.sc&&inSwing(e.x,e.y,range+e.r,arc)))return; // you were fighting something; bystanders are safe
  // survivors in houses (and anyone following you)
  allHiders().forEach(h=>{if(h.gone||h.sc!==P.sc||!inSwing(h.x,h.y,range,arc))return;h.hits=(h.hits||0)+1;markHarm();
    if(h.hits===1){h.mood='angry';h.hurt=true;h.follow=false;humanityHit(4);townWord(-6,'"You HIT '+h.name+'? What is wrong with you?"');hitReact(h.x,h.y,'"OW! Stop!"');}
    else{h.gone=true;humanityHit(10);townWord(-15,'"'+h.name+' is dead. They say you did it."');hitReact(h.x,h.y,'💀');toast('💀 You killed '+h.name+'. Their things are yours now. Everyone will hear about this.','bad');
      const I=S.interiors[h.sc];if(I)I.props.forEach(p=>{if(p.owner)p.shareOK=true;});}});
  // people in camps
  if(P.sc==='out')S.camps.forEach(c=>{if(c.raided||c.brood||Math.hypot(P.x-c.x,P.y-c.y)>c.r+140)return;
    campPeople(c).forEach(pp=>{if(!inSwing(pp.x,pp.y,range,arc))return;markHarm();
      if(pp.who==='sick'){c.sick=c.sick.filter(s=>s!==pp.ref);humanityHit(10);campRep(c,-40,'"You killed '+pp.name+' in our sick tent!"');hitReact(pp.x,pp.y,'💀');}
      else{humanityHit(5);campRep(c,-30,'"You attacked '+(pp.who==='leader'?'our leader':pp.who==='guard'?'one of our guards':pp.name)+'!"');hitReact(pp.x,pp.y,pp.who==='leader'?'"Have you lost your MIND?!"':'"HEY!"');}
      if(S.t-(c.hitT||-99)<20||pp.who==='guard')makeCampHostile(c);c.hitT=S.t;});});};}
(function(){const st=document.createElement('style');st.textContent=`.gchip.mild{border-color:#ffd16699}`;document.head.appendChild(st);})();
