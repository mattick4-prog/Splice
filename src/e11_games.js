// ================= NEW LAB GAMES (replace 3-8) =================
function ryb2rgb(r,y,b){const m=Math.max(r,y,b,1e-6);r/=m;y/=m;b/=m;
  const C=[[1,1,1],[1,0,0],[1,1,0],[1,.5,0],[.163,.373,.6],[.5,0,.5],[0,.66,.2],[.2,.094,0]];
  const out=[0,0,0];for(let i=0;i<3;i++){const w000=C[0][i],w100=C[1][i],w010=C[2][i],w110=C[3][i],w001=C[4][i],w101=C[5][i],w011=C[6][i],w111=C[7][i];
    const x0=w000+(w100-w000)*r,x1=w010+(w110-w010)*r,x2=w001+(w101-w001)*r,x3=w011+(w111-w011)*r,y0=x0+(x1-x0)*y,y1=x2+(x3-x2)*y;out[i]=y0+(y1-y0)*b;}
  return `rgb(${out.map(v=>Math.round(clamp(v,0,1)*255)).join(',')})`;}
const gcd=(a,b)=>b?gcd(b,a%b):a;
const ratioKey=a=>{const g=a.reduce((x,y)=>gcd(x,y))||1;return a.map(v=>v/g).join(',');};
const LAB_PICS=[['🔬','Microscope'],['🧪','Test tube'],['🧫','Petri dish'],['🧬','DNA'],['🦠','Microbe'],['🩸','Blood'],['⚗️','Flask'],['🧲','Magnet']];
const CELL_PARTS={nucleus:['Nucleus','the control center. It keeps the DNA 🧬'],mito:['Mitochondria','the power plants. They make energy ⚡'],membrane:['Cell membrane','the skin of the cell. It lets things in and out 🚪'],ribo:['Ribosomes','tiny factories that build proteins 🏭'],vacuole:['Vacuole','the storage tank for water and food 💧']};
const SPECIMENS=[['🦠','Bacteria','A million bacteria could fit on the head of a pin.'],['🦐','Water flea','Water fleas are see-through. You can watch their heart beat!'],['🐛','Tardigrade','Tardigrades (water bears) can survive in outer space.'],['🌿','Plant cells','Plant cells have hard walls, like tiny bricks.'],['🍄','Mold spores','Mold spreads by floating spores through the air.']];
function zapUpdate(q){const e=document.getElementById('zapc');if(e)e.textContent=q.zap+' / '+q.n;}
const NEW_GAMES=[
 {id:'zapper',short:'Click the germs 🦠, not the blood cells',name:'Germ Zapper',icon:'🦠',
  how:'Look through the microscope. <b>Click every germ 🦠</b> to zap it. Don\'t zap the round red blood cells!',
  sci:'Germs like bacteria are too small to see without a microscope. White blood cells hunt germs in your body every day.',
  time:q=>16+q.d*3,setup(q){q.n=7+q.d*2;q.zap=0;q.miss=0;q.ents=[];for(let i=0;i<q.n+6;i++){const bad=i<q.n,a=rnd(0,6.28),s=rnd(8,16)+q.d*4;q.ents.push({bad,x:rnd(10,86),y:rnd(10,82),vx:Math.cos(a)*s,vy:Math.sin(a)*s,dead:false});}},
  body:q=>`<div class="row" style="justify-content:space-between"><span class="chip">🦠 Zapped <b id="zapc">${q.zap} / ${q.n}</b></span><span class="chip" style="background:#301018;border-color:#8a2f3a;color:#ffc0c8">❌ Oops: <b id="zapm">${q.miss}</b></span></div>
    <div class="scope"><div class="scopein">${q.ents.map((e,i)=>`<button class="ent ${e.bad?'germ':'rbc'} ${e.dead?'pop':''}" id="z${i}" data-a="seqAct" data-i="${i}" style="left:${e.x}%;top:${e.y}%">${e.bad?'🦠':''}</button>`).join('')}</div></div>`,
  tick(q,dt){q.ents.forEach((e,i)=>{if(e.dead)return;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.x<4||e.x>90)e.vx*=-1;if(e.y<4||e.y>86)e.vy*=-1;e.x=clamp(e.x,4,90);e.y=clamp(e.y,4,86);const el=document.getElementById('z'+i);if(el){el.style.left=e.x+'%';el.style.top=e.y+'%';}});},
  act(q,d){const i=+d.i,e=q.ents[i];if(!e||e.dead)return;const el=document.getElementById('z'+i);
    if(e.bad){e.dead=true;q.zap++;sfx('coin');if(el)el.classList.add('pop');zapUpdate(q);if(q.zap>=q.n)seqEnd();}
    else{q.miss++;sfx('bad');if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}const m=document.getElementById('zapm');if(m)m.textContent=q.miss;}},
  score:q=>clamp(q.zap/q.n-q.miss*.12,0,1)},
 {id:'flip',short:'Flip two cards. Find the matching pairs',name:'Flip & Match',icon:'🃏',
  how:'Flip two cards at a time. <b>Find the matching lab tools.</b> Fewer flips = better score.',
  sci:'Every one of these is a real lab tool. Petri dishes grow microbes, and flasks hold liquids that are being mixed.',
  time:()=>50,setup(q){const n=6+Math.min(2,q.d);const pics=LAB_PICS.slice().sort(()=>Math.random()-.5).slice(0,n);q.pairs=n;q.cards=pics.concat(pics).map(p=>({p,up:false,done:false})).sort(()=>Math.random()-.5);q.open=[];q.moves=0;q.found=0;q.hideT=0;},
  body:q=>`<div class="row" style="justify-content:space-between"><span class="chip">🃏 Pairs: <b>${q.found} / ${q.pairs}</b></span><span class="chip">👆 Flips: <b>${q.moves}</b></span></div>
    <div class="cards">${q.cards.map((c,i)=>`<button class="fcard ${c.up||c.done?'up':''} ${c.done?'done':''}" data-a="seqAct" data-i="${i}"><span class="back">🧬</span><span class="front">${c.p[0]}<small>${c.p[1]}</small></span></button>`).join('')}</div>`,
  tick(q,dt){if(q.hideT>0){q.hideT-=dt;if(q.hideT<=0){q.open.forEach(i=>q.cards[i].up=false);q.open=[];refreshPanel();}}},
  act(q,d){const i=+d.i,c=q.cards[i];if(!c||c.up||c.done||q.open.length>=2)return;c.up=true;q.open.push(i);sfx('ui');
    if(q.open.length===2){q.moves++;const [a,b]=q.open.map(k=>q.cards[k]);if(a.p===b.p){a.done=b.done=true;q.open=[];q.found++;sfx('coin');if(q.found>=q.pairs){refreshPanel();seqEnd();return;}}else q.hideT=.8;}
    refreshPanel();},
  score:q=>(q.found/q.pairs)*clamp(1-Math.max(0,q.moves-q.pairs-3)*.07,.35,1)},
 {id:'catch',short:'Catch the PARTNER letters in your beaker',name:'Catch the Bases',icon:'🧺',
  how:'Letters rain down. Move the beaker with your <b>mouse</b> or the <b>← →</b> arrow keys. <b>Catch only the partner</b> of the big letter on top.',
  sci:'When DNA copies itself, each loose base floating in the cell has to find its exact partner: A grabs T, and G grabs C.',
  time:()=>28,setup(q){q.goal=10;q.good=0;q.bad=0;q.cx=50;q.items=[];q.spT=0;q.uid=0;q.tgt=pick(BASES);q.streak=0;},
  body:q=>`<div class="row" style="justify-content:space-between;align-items:center"><span class="chip">🎯 Partner of <span id="ctgt" class="mini" style="background:${BCOL[q.tgt]}">${q.tgt}</span></span><span class="chip">✅ <b id="cgood">${q.good}</b> / ${q.goal} · ❌ <b id="cbad">${q.bad}</b></span></div>
    <div class="catcharea" id="catchArea"><div id="catcher" style="left:${q.cx}%">🧪</div></div>`,
  tick(q,dt){const A=document.getElementById('catchArea');if(!A)return;const H=A.clientHeight||260;
    if(keys['arrowleft'])q.cx=clamp(q.cx-dt*75,6,94);if(keys['arrowright'])q.cx=clamp(q.cx+dt*75,6,94);
    const C=document.getElementById('catcher');if(C)C.style.left=q.cx+'%';
    q.spT-=dt;if(q.spT<=0){q.spT=.6-q.d*.08;const want=Math.random()<.45,b=want?PAIR[q.tgt]:pick(BASES.filter(x=>x!==PAIR[q.tgt]));
      const it={id:q.uid++,b,x:rnd(6,94),y:-40,v:110+q.d*30+rnd(0,40)};q.items.push(it);const el=document.createElement('div');el.className='fall';el.id='f'+it.id;el.textContent=b;el.style.background=BCOL[b];el.style.left=it.x+'%';A.appendChild(el);}
    q.items=q.items.filter(it=>{it.y+=it.v*dt;const el=document.getElementById('f'+it.id);
      if(it.y>H-62&&it.y<H-20&&Math.abs(it.x-q.cx)<9){const ok=it.b===PAIR[q.tgt];if(ok){q.good++;q.streak++;sfx('coin');}else{q.bad++;sfx('bad');}
        if(el){el.classList.add(ok?'got':'nope');setTimeout(()=>el.remove(),250);}
        const g=document.getElementById('cgood'),bd=document.getElementById('cbad');if(g)g.textContent=q.good;if(bd)bd.textContent=q.bad;
        if(ok&&q.streak%3===0){q.tgt=pick(BASES);const t=document.getElementById('ctgt');if(t){t.textContent=q.tgt;t.style.background=BCOL[q.tgt];}}
        if(q.good>=q.goal)seqEnd();return false;}
      if(it.y>H){if(el)el.remove();return false;}if(el)el.style.top=it.y+'px';return true;});},
  score:q=>clamp((q.good-q.bad*.5)/q.goal,0,1)},
 {id:'potion',short:'Mix drops to match the color',name:'Potion Mixer',icon:'⚗️',
  how:'Add <b>red, yellow and blue</b> drops to the beaker to make the <b>same color</b> as the target flask. Messed up? Pour it out.',
  sci:'Red, yellow and blue mix into new colors. Chemists add things one drop at a time so the mix comes out exactly right.',
  time:()=>45,setup(q){const pool=[[1,1,0],[0,1,1],[1,0,1],[2,1,0],[0,1,2],[1,0,2],[2,0,1],[0,2,1],[1,2,0],[1,1,1],[2,1,1],[1,1,2]];q.rounds=3;q.round=0;q.mist=0;
    q.tg=pool.sort(()=>Math.random()-.5).slice(0,3).sort((a,b)=>a.reduce((x,y)=>x+y)-b.reduce((x,y)=>x+y));q.mix=[0,0,0];q.flash='';},
  body:q=>{const t=q.tg[q.round]||q.tg[2],tc=ryb2rgb(...t),n=q.mix.reduce((a,b)=>a+b),mc=n?ryb2rgb(...q.mix):'transparent';
    return `<div class="row" style="justify-content:space-between"><span class="chip">⚗️ Potion ${Math.min(q.round+1,3)} of 3</span><span class="chip">🫗 Pour-outs: ${q.mist}</span></div>
    <div class="potions"><div class="pflask"><div class="liq3" style="background:${tc};height:70%"></div><span>🎯 Target</span></div><div class="arrowbig">➜</div>
      <div class="pflask mine ${q.flash}"><div class="liq3" style="background:${mc};height:${Math.min(90,n*14)}%"></div><div class="drops">${q.mix.map((c,i)=>'<i style="background:'+['#e63c3c','#ffd23c','#3c6ee6'][i]+'"></i>'.repeat(c)).join('')}</div><span>Your beaker</span></div></div>
    <!--deck--><div class="deckrow">${arcBtn('💧','data-a="seqAct" data-c="0"','#e63c3c','red drop')}${arcBtn('💧','data-a="seqAct" data-c="1"','#ffd23c','yellow drop')}${arcBtn('💧','data-a="seqAct" data-c="2"','#3c6ee6','blue drop')}${arcBtn('🫗','data-a="seqAct" data-c="dump"','#8a8a8a','pour out')}</div>`;},
  act(q,d){if(d.c==='dump'){if(q.mix.some(v=>v))q.mist++;q.mix=[0,0,0];refreshPanel();return;}
    q.mix[+d.c]++;sfx('ui');const t=q.tg[q.round];
    if(ratioKey(q.mix)===ratioKey(t)){q.round++;sfx('coin');q.mix=[0,0,0];if(q.round>=3){seqEnd();return;}toast('⚗️ Perfect match!','good');}
    else if(q.mix.reduce((a,b)=>a+b)>6){q.mist++;q.mix=[0,0,0];sfx('bad');}
    refreshPanel();},
  score:q=>clamp(q.round/3-q.mist*.08,0,1)},
 {id:'cell',short:'Find the part of the cell',name:'Cell Explorer',icon:'🔬',
  how:'This is an animal cell under a microscope. Read the clue and <b>click the right part of the cell</b>.',
  sci:'Every living thing is made of cells. Your body has about 30 trillion of them, and almost every one has a nucleus full of DNA.',
  time:()=>40,setup(q){q.order=Object.keys(CELL_PARTS).sort(()=>Math.random()-.5);q.idx=0;q.miss=0;q.got=[];q.wrong=null;},
  body:q=>{const want=q.order[q.idx],P=CELL_PARTS[want]||['',''];const lab=k=>q.got.includes(k)?'got':q.wrong===k?'wrong':'';
    return `<div class="cellq">🔎 Find the <b>${P[0]}</b>: ${P[1]}</div>
    <div class="cellbox"><svg viewBox="0 0 400 270" class="cellsvg">
      <ellipse cx="200" cy="135" rx="182" ry="118" fill="#ffd6e0" opacity=".9"/>
      <ellipse class="part ${lab('membrane')}" data-a="seqAct" data-p="membrane" cx="200" cy="135" rx="182" ry="118" fill="none" stroke="#e8749a" stroke-width="16"/>
      <ellipse class="part ${lab('vacuole')}" data-a="seqAct" data-p="vacuole" cx="300" cy="170" rx="42" ry="30" fill="#8fd0ff" stroke="#3a8ad0" stroke-width="3"/>
      <g class="part ${lab('mito')}" data-a="seqAct" data-p="mito"><ellipse cx="105" cy="90" rx="38" ry="18" fill="#ff9a3c" stroke="#b85a10" stroke-width="3" transform="rotate(-20 105 90)"/><path d="M78 96 q8 -14 16 0 t16 0 t16 0" fill="none" stroke="#b85a10" stroke-width="3" transform="rotate(-20 105 90)"/>
        <ellipse cx="270" cy="70" rx="34" ry="16" fill="#ff9a3c" stroke="#b85a10" stroke-width="3" transform="rotate(15 270 70)"/><path d="M246 70 q8 -12 14 0 t14 0 t14 0" fill="none" stroke="#b85a10" stroke-width="3" transform="rotate(15 270 70)"/></g>
      <g class="part ${lab('ribo')}" data-a="seqAct" data-p="ribo">${[[80,170],[95,190],[120,205],[150,215],[245,215],[340,110],[355,128],[60,140]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#6a3ab0"/>`).join('')}<rect x="50" y="130" width="320" height="95" fill="transparent" style="pointer-events:none"/></g>
      <g class="part ${lab('nucleus')}" data-a="seqAct" data-p="nucleus"><circle cx="190" cy="140" r="52" fill="#b48ae8" stroke="#6a3ab0" stroke-width="4"/><circle cx="200" cy="130" r="14" fill="#7a4ac8"/><path d="M160 150 q10 -16 20 0 t20 0 t20 0" fill="none" stroke="#fff" stroke-width="3"/></g>
      ${q.got.map(k=>{const L={membrane:[200,22],vacuole:[300,215],mito:[105,55],ribo:[120,240],nucleus:[190,82]}[k];return `<text x="${L[0]}" y="${L[1]}" text-anchor="middle" class="ptxt">${CELL_PARTS[k][0]} ✓</text>`;}).join('')}
      ${q.wrong?`<text x="200" y="262" text-anchor="middle" class="ptxt bad">That's the ${CELL_PARTS[q.wrong][0]}!</text>`:''}
    </svg></div>`;},
  act(q,d){const p=d.p,want=q.order[q.idx];if(!p)return;if(p===want){q.got.push(p);q.idx++;q.wrong=null;sfx('coin');if(q.idx>=q.order.length){refreshPanel();seqEnd();return;}}else{q.miss++;q.wrong=p;sfx('bad');}refreshPanel();},
  score:q=>clamp(q.got.length/5-q.miss*.1,0,1)},
 {id:'focus',short:'Turn the knob until it\'s sharp, then SNAP',name:'Microscope Focus',icon:'🔭',
  how:'Turn the <b>focus knob</b> (drag the slider or hold ← →) until the tiny creature looks sharp. Then press <b>📸 SNAP</b>.',
  sci:'A microscope\'s focus knob slides the lens closer or farther until the tiny thing looks sharp. Real scientists photograph what they find.',
  time:()=>36,setup(q){q.specs=SPECIMENS.slice().sort(()=>Math.random()-.5).slice(0,3);q.i=0;q.errs=[];q.pos=rnd(0,100);q.t0=rnd(15,85);while(Math.abs(q.pos-q.t0)<30)q.pos=rnd(0,100);},
  body:q=>{const s=q.specs[Math.min(q.i,2)],bl=Math.min(18,Math.abs(q.pos-q.t0)*.45);
    return `<div class="row" style="justify-content:space-between"><span class="chip">📸 Photo ${Math.min(q.i+1,3)} of 3</span><span class="chip">${q.errs.map(e=>e<6?'⭐':e<14?'👍':'😵').join(' ')||'…'}</span></div>
    <div class="focusrow"><div class="scope small"><div class="scopein"><div id="spec" style="filter:blur(${bl}px)">${s[0]}</div></div></div>
      <div class="knobcol"><div class="sharp" id="sharp"><i style="opacity:${bl<2.5?1:.15}"></i>SHARP</div><input type="range" id="focusR" min="0" max="100" value="${q.pos}"><div class="mute" style="text-align:center">🎛️ focus knob</div></div></div>
    ${q.last?`<p class="mute" style="text-align:center;margin:4px 0 0">${q.last}</p>`:''}
    <!--deck--><div class="deckrow">${arcBtn('📸','data-a="seqKey" data-b=" "','#ff3b3b','snap the photo (Space)','big')}</div>`;},
  tick(q,dt){if(keys['arrowleft'])q.pos=clamp(q.pos-dt*30,0,100);if(keys['arrowright'])q.pos=clamp(q.pos+dt*30,0,100);if(keys['arrowleft']||keys['arrowright']){focusApply(q);const r=document.getElementById('focusR');if(r)r.value=q.pos;}},
  key(q,k){if(k!==' ')return;const err=Math.abs(q.pos-q.t0),s=q.specs[q.i];q.errs.push(err);q.last=`${s[0]} ${s[1]}: ${s[2]}`;sfx(err<6?'coin':'ui');q.i++;
    if(q.i>=3){refreshPanel();seqEnd();return;}q.t0=rnd(15,85);while(Math.abs(q.pos-q.t0)<30)q.t0=rnd(5,95);refreshPanel();},
  score:q=>q.errs.reduce((a,e)=>a+clamp(1-e/25,0,1),0)/3}
];
function focusApply(q){const bl=Math.min(18,Math.abs(q.pos-q.t0)*.45),el=document.getElementById('spec');if(el)el.style.filter=`blur(${bl}px)`;const s=document.querySelector('#sharp i');if(s)s.style.opacity=bl<2.5?1:.15;}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='focusR'&&S&&S.seq&&!S.seq.done){S.seq.pos=+e.target.value;focusApply(S.seq);}});
document.addEventListener('mousemove',e=>{const q=S&&S.seq;if(!q||q.done||q.g!=='catch')return;const A=document.getElementById('catchArea');if(!A)return;const r=A.getBoundingClientRect();if(e.clientY<r.top-40||e.clientY>r.bottom+80)return;q.cx=clamp((e.clientX-r.left)/r.width*100,6,94);});
{const keep=id=>SEQ_GAMES.find(g=>g.id===id),N=id=>NEW_GAMES.find(g=>g.id===id);
 const order=[keep('ladder'),keep('memory'),N('zapper'),N('flip'),N('catch'),N('potion'),N('cell'),N('focus'),keep('gel'),keep('pipette')];
 SEQ_GAMES.splice(0,SEQ_GAMES.length,...order);}
