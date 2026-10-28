// ================= CHECKPOINT SCREEN: scanner pad, suspicion gauge, stamps =================
function guardSvg(c){const night=S.night,turned=c.sleeper;
  const g=(x,flip,eye)=>`<g transform="translate(${x},0) scale(${flip?-1:1},1)">
    <rect x="-13" y="66" width="11" height="34" rx="4" fill="#3a3a2a"/><rect x="2" y="66" width="11" height="34" rx="4" fill="#3a3a2a"/>
    <rect x="-17" y="30" width="34" height="40" rx="9" fill="#4a6a3a" stroke="#111" stroke-width="2"/>
    <rect x="-24" y="40" width="44" height="6" rx="2" fill="#2a2a2a" transform="rotate(-20 0 43)"/>
    <circle cx="0" cy="18" r="14" fill="#e0b88a" stroke="#111" stroke-width="2"/><path d="M-15 14 Q0 -4 15 14 Z" fill="#3a4a2a" stroke="#111" stroke-width="1.5"/>
    <circle cx="-5" cy="19" r="2.2" fill="${eye}"/><circle cx="5" cy="19" r="2.2" fill="${eye}"/>
    <path d="M-5 27 h10" stroke="#3a1a1a" stroke-width="2"/></g>`;
  return `<svg viewBox="0 0 1000 140" class="gscene" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="gsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${night?'#0a1022':'#7ab0d8'}"/><stop offset="1" stop-color="${night?'#1a2238':'#cfe2ee'}"/></linearGradient></defs>
    <rect width="1000" height="140" fill="url(#gsky)"/><rect y="116" width="1000" height="24" fill="${night?'#2a2a1e':'#7a6a4a'}"/>${[60,170,280,720,830,940].map((x,i)=>`<circle cx="${x}" cy="${100-(i%2)*6}" r="${22+(i%2)*6}" fill="${night?'#1e3020':'#4a7a3a'}"/>`).join('')}<g transform="translate(340,20)">${night?'<circle cx="270" cy="22" r="10" fill="#f0ecd0"/>':'<circle cx="270" cy="24" r="12" fill="#ffd166"/>'}
    ${night?'<path d="M40 8 L110 120 L-20 120 Z" fill="#fff3b0" opacity=".12"/>':''}
    <rect y="96" width="320" height="24" fill="${night?'#2a2a1e':'#7a6a4a'}"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${70+i*23}" y="${46+(i%2)*3}" width="20" height="54" rx="3" fill="${turned?'#6a4a7a':'#a8743c'}" stroke="#4a2a12" stroke-width="2"/>`).join('')}
    <rect x="66" y="58" width="190" height="8" fill="#5a3a1a"/><rect x="66" y="82" width="190" height="8" fill="#5a3a1a"/>
    <text x="161" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="#fff6d0" stroke="#4a2a12" stroke-width="3" paint-order="stroke">${c.name.toUpperCase()}</text>
    ${g(40,false,'#222')}${g(280,true,turned?'#d6a0ff':'#222')}
    ${[0,1,2].map(i=>`<ellipse cx="${20+i*16}" cy="110" rx="9" ry="6" fill="#b8a07a" stroke="#6a5a3a"/>`).join('')}${[0,1,2].map(i=>`<ellipse cx="${270+i*16}" cy="110" rx="9" ry="6" fill="#b8a07a" stroke="#6a5a3a"/>`).join('')}
  </g></svg>`;}
function gauge(p){const a=Math.PI*(1-p),x=60+Math.cos(a)*44,y=58-Math.sin(a)*44,col=p>.6?'#7dff9a':p>.35?'#ffd166':'#ff5a68';
  return `<svg viewBox="0 0 120 70" class="ggauge"><path d="M14 58 A46 46 0 0 1 106 58" fill="none" stroke="#333" stroke-width="12"/>
    <path d="M14 58 A46 46 0 0 1 38 18" fill="none" stroke="#ff5a68" stroke-width="10"/><path d="M38 18 A46 46 0 0 1 82 18" fill="none" stroke="#ffd166" stroke-width="10"/><path d="M82 18 A46 46 0 0 1 106 58" fill="none" stroke="#7dff9a" stroke-width="10"/>
    <line x1="60" y1="58" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#fff" stroke-width="3" stroke-linecap="round" class="needle"/><circle cx="60" cy="58" r="5" fill="#fff"/>
    <text x="60" y="69" text-anchor="middle" font-size="11" font-weight="800" fill="${col}">${Math.round(p*100)}%</text></svg>`;}
function gateHtml(){const c=campOf(S.gateOpenFor);if(!c){S.panel=null;return '<div class="card"></div>';}
  const mind=Object.keys(POWERS).some(id=>POWERS[id].fam==='mind'&&!POWERS[id].hybrid&&stageN(id)>0),odds=searchOdds(c),refused=c.refuseDay===S.day,scan=S.gateScan,stamp=S.gateStamp;
  const lvl=visibleChanges(),ch=S.disguise?[]:bodyChanges();
  const say=stamp?stamp.say:scan?'"Hold still. This old scanner beeps if you\'re carrying anything weird…"':refused?'"We already said no. Come back tomorrow."':lvl>=4?'"Stop right there! Hands up! What is WRONG with your skin?"':S.night?'"Who\'s out there?! Step into the light, slowly!"':'"Halt! Nobody gets in without a check."';
  const seen=[...ch.map(x=>`<span class="gchip bad" title="${x.name}: they can see it">${x.icon}</span>`),S.vault.length>=5?`<span class="gchip bad" title="A vault full of monster DNA">🧪×${S.vault.length}</span>`:'',S.disguise?'<span class="gchip" title="Your hood hides your changes">🧥 hood</span>':'',S.night?'<span class="gchip bad" title="Night makes them jumpy">🌙</span>':''].join('')||'<span class="gchip ok">nothing strange</span>';
  const off=refused||!!scan||!!stamp;
  const B=(a,cap,col,lab,ok,tip)=>`<div class="gbtn ${ok&&!off?'':'off'}" title="${tip}">${arcBtn(cap,`data-a="${a}" ${ok&&!off?'':'disabled'}`,col,lab)}</div>`;
  return `<div class="card wide ckpt ${S.night?'night':''}">${head(c.name+' · gate · Esc to walk away','🛑 Checkpoint','#ffd166')}
  <div class="gtop"><div class="bubble">${say}</div>${guardSvg(c)}</div>
  <div class="gmid">
    <div class="gpad ${scan?'scanning':''}"><div class="gpadlbl">SCAN PAD</div>${bodySvg()}${scan?'<i class="beam"></i>':''}
      ${stamp?`<div class="stamp" style="--sc:${stamp.col}">${stamp.txt}</div>`:''}</div>
    <div class="gside"><div class="gtitle">👀 What they notice</div><div class="gchips">${seen}</div>
      <div class="gtitle" style="margin-top:10px">🎲 Chance a search gets you in</div>${gauge(odds)}
      <div class="gtier">They see you as <b style="color:${wTier(c).col}">${wTier(c).name}</b></div></div></div>
  <div class="gdecks">
    <div class="gdeck h"><div class="gdl">💉 THE HUMAN WAY</div><div class="gbtns">
      ${B('gsearch','🔍','#7dff9a','get scanned',true,'Step on the scan pad. '+Math.round(odds*100)+'% chance. Fewer changes, an empty vault and more trust help. Fail and they turn you away until tomorrow.')}
      ${B('gvax','💉','#7dff9a','vaccine maker',cureN()>0,cureN()?'They\'ve heard about your vaccines. Walk right in.':'Make a vaccine at any camp first.')}
      ${B('gtoll','🎁','#7dff9a','pay toll',S.res.food>0||S.res.meds>0,'1 🥫 food or 1 💊 med gets you in today.')}</div></div>
    <div class="gdeck m"><div class="gdl">🧬 THE MONSTER WAY</div><div class="gbtns">
      ${B('gstare','😠','#c27bff','stare down',S.humanity<50||broodN()>=3,S.humanity<50||broodN()>=3?'They open up because they\'re scared. They\'ll hate you for it.':'Not scary enough yet: humanity under 50, or Brood 3+.')}
      ${B('gmind','🧠','#c27bff','mind trick',mind,mind?'Make the guard open up and forget why. He might notice.':'Needs a Mind power at 40%+.')}
      ${B('gturn','🧬','#c27bff','turn guard',!c.sleeper&&S.night&&S.vault.length>0,c.sleeper?'Already yours.':S.night?'1 strand. The gate opens for you every night after, and the searchlights look away. 30% chance you get caught.':'Only at night.')}
      ${B('gbreak','💥','#ff5a68','break in',true,'Fight your way in. The whole camp turns on you.')}</div></div></div></div>`;}
// animated outcomes: scan beam, then a stamp, then the gate
{const _act=act;act=function(a,d){const c=campOf(S.gateOpenFor);
  if(c&&S.panel==='gate'&&!S.gateScan&&!S.gateStamp){
    if(a==='gsearch'){const ok=Math.random()<searchOdds(c);S.gateScan={ok};sfx('ui');refreshPanel();
      setTimeout(()=>{if(S.panel!=='gate'){S.gateScan=null;return;}S.gateScan=null;
        S.gateStamp=ok?{txt:'CLEARED',col:'#7dff9a',say:'"Huh. Clean. Go on in."'}:{txt:'DENIED',col:'#ff5a68',say:'"'+(visibleChanges()>=3?'The scanner went nuts on your skin.':S.vault.length>=5?'What is all this monster DNA?!':'Something\'s off about you.')+' Not today."'};sfx(ok?'coin':'hit');refreshPanel();
        setTimeout(()=>{S.gateStamp=null;if(ok){campRep(c,2,'"You came up clean at the gate."');gatePass(c,'🔍 Cleared at the gate.',true);}else{c.refuseDay=S.day;campRep(c,-3,'"Our gate guard didn\'t like what the scanner found."');if(S.panel==='gate')refreshPanel();}},1100);},1600);return;}
    const st={gvax:['WELCOME, DOC','#7dff9a','"The vaccine maker! Open up!"'],gtoll:['PAID','#ffd166','"Fair trade. In you go."'],gstare:['…OKAY…','#c27bff','"O-okay! Okay! Just… don\'t hurt anybody."'],gmind:['OPEN','#c27bff','"…I should… open the gate. Yes."']}[a];
    if(st&&!document.querySelector(`[data-a="${a}"][disabled]`)){S.gateStamp={txt:st[0],col:st[1],say:st[2]};sfx('coin');refreshPanel();setTimeout(()=>{S.gateStamp=null;_act(a,d);},1000);return;}}
  _act(a,d);};}
{const _ho=hideOv;hideOv=function(){if(S&&S.panel==='gate'){S.gateScan=null;S.gateStamp=null;}_ho();};}
(function(){const st=document.createElement('style');st.textContent=`
.ckpt{background:linear-gradient(#2a2418,#1a1610)}.ckpt.night{background:linear-gradient(#141a2a,#0c0f18)}
.gtop{position:relative;margin:4px 0 8px}.gscene{width:100%;height:140px;display:block;border-radius:12px;border:3px solid #4a2a12}
.bubble{position:relative;margin:0 auto 10px;width:fit-content;max-width:80%;text-align:center;background:#fffbea;color:#2a1a0a;font-weight:700;font-size:15px;padding:6px 12px;border-radius:14px;border:2px solid #4a2a12;box-shadow:0 3px 0 #4a2a12}
.bubble::after{content:'';position:absolute;left:50%;margin-left:-8px;bottom:-18px;border:8px solid transparent;border-top-color:#4a2a12}
.gmid{display:grid;grid-template-columns:170px 1fr;gap:14px;align-items:start}
.gpad{position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 100%,#2a5a3a,#0c1a12 70%);border:4px solid #1a1a1a;border-radius:14px;padding:18px 6px 6px;box-shadow:inset 0 0 20px #000}
.gpad .bodysvg{max-height:200px}.gpadlbl{position:absolute;top:3px;left:0;right:0;text-align:center;font:800 10px monospace;letter-spacing:2px;color:#7dff9a}
.gpad .beam{position:absolute;left:0;right:0;height:16px;background:linear-gradient(transparent,#7dff9acc,transparent);box-shadow:0 0 18px #7dff9a;animation:gbeam .8s linear infinite alternate}
@keyframes gbeam{from{top:10px}to{top:calc(100% - 20px)}}
.gpad.scanning{border-color:#7dff9a}
.stamp{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%) rotate(-14deg);font:900 24px/1 var(--display,serif);color:var(--sc);border:4px solid var(--sc);border-radius:8px;padding:6px 10px;background:#000a;letter-spacing:2px;animation:gstamp .35s cubic-bezier(.2,2,.4,1)}
@keyframes gstamp{from{transform:translate(-50%,-50%) rotate(-14deg) scale(2.4);opacity:0}}
.gside{background:#0006;border-radius:12px;padding:8px 12px}.gtitle{font-weight:800;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.8}
.gchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.gchip{background:#ffffff12;border:2px solid #555;border-radius:10px;padding:2px 8px;font-size:20px;cursor:help}.gchip.bad{border-color:#ff5a68aa}.gchip.ok{font-size:14px;border-color:#7dff9a88}
.ggauge{width:170px;display:block;margin:2px 0}.ggauge .needle{transform-origin:60px 58px;animation:gneed .8s ease-out}@keyframes gneed{from{transform:rotate(-80deg)}}
.gtier{font-size:14px}
.gdecks{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.gdeck{background:linear-gradient(180deg,#5a6268,#3a4045);border:3px solid #1c2024;border-radius:14px;padding:8px 10px 10px;box-shadow:inset 0 2px 0 #8a939a}.gdeck.m{background:linear-gradient(180deg,#5a4868,#3a2a45)}
.gdl{font:800 12px monospace;letter-spacing:2px;text-align:center;margin-bottom:6px;color:#fff}.gdeck.h .gdl{color:#b8ffc8}.gdeck.m .gdl{color:#e0c0ff}
.gbtns{display:flex;justify-content:space-around;flex-wrap:wrap;gap:6px}.gbtn.off{opacity:.35;filter:grayscale(.7)}.gbtn .arc .cap{width:58px;height:58px;font-size:24px}.gbtn .arc::before{width:72px;height:72px;margin-left:-36px}
@media (max-width:640px){.gmid,.gdecks{grid-template-columns:1fr}.gpad{max-width:200px;margin:0 auto}.bubble{max-width:80%;font-size:13px}}`;document.head.appendChild(st);})();
