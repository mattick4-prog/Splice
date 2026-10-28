// ================= DNA LAB: 10 SEQUENCING MINIGAMES =================
const BASES=['A','T','G','C'],PAIR={A:'T',T:'A',G:'C',C:'G'},BCOL={A:'#ff5a68',T:'#4aa8ff',G:'#5ad66a',C:'#ffd166',U:'#c27bff'};
const RNA={A:'U',T:'A',G:'C',C:'G'};
const PAIR_RULE=`<span class="pairrule"><b style="color:${BCOL.A}">A</b> ↔ <b style="color:${BCOL.T}">T</b> &nbsp;·&nbsp; <b style="color:${BCOL.G}">G</b> ↔ <b style="color:${BCOL.C}">C</b></span>`;
const rb=n=>Array.from({length:n},()=>pick(BASES));
function tile(b,o){o=o||{};const bg=b&&b!=='?'?BCOL[b]:'#000';
  return `<div class="tile ${o.cls||''}" ${o.attr||''} style="background:${bg};${o.ring?'outline:3px solid #fff;outline-offset:2px;':''}${o.border?'border:3px solid '+o.border+';':''}">${b||'?'}</div>`;}
function ladder(top,bot,o){o=o||{};return `<div class="ladder">${top.map((t,i)=>`<div class="rung">${tile(t,{ring:o.ringTop===i})}<div class="bond"></div>${tile(bot[i],{ring:o.ringBot===i,border:o.borders&&o.borders[i],attr:o.click?`data-a="seqAct" data-i="${i}" role="button"`:''})}</div>`).join('')}</div>`;}
const PARTNER_TXT={A:'pairs with T',T:'pairs with A',G:'pairs with C',C:'pairs with G',U:'RNA letter'};
const arcBtn=(lab,data,col,sub,cls)=>`<button class="arc ${cls||''}" style="--ac:${col};--ad:${shade(col,-.5)};--al:${shade(col,.45)}" ${data}><span class="cap">${lab}</span>${sub?`<small>${sub}</small>`:''}</button>`;
const letterBtns=(ls,noHint)=>'<!--deck-->'+`<div class="deckrow">${ls.map(b=>arcBtn(b,`data-a="seqKey" data-b="${b}"`,BCOL[b],noHint?'key '+b:PARTNER_TXT[b])).join('')}</div>`;
// each game: name, icon, how, sci, time(q), setup(q), body(q), key(q,k), act(q,d), tick(q,dt), score(q)
const SEQ_GAMES=[
 {id:'ladder',short:'See a letter ➜ press its partner',name:'Base Pairs',icon:'🪜',how:`Each letter has a partner on the other side of the DNA ladder. Press the <b>opposite</b> letter for the highlighted one. See <b>A</b>, press <b>T</b>. See <b>G</b>, press <b>C</b>.`,
  sci:'DNA is a twisted ladder. Each rung is two bases holding hands: A always pairs with T, and G always pairs with C.',
  time:q=>q.n*1.6,setup(q){q.n=6+q.d*2;q.top=rb(q.n);q.ans=[];q.idx=0;},
  body:q=>ladder(q.top,q.top.map((b,i)=>q.ans[i]||'?'),{ringTop:q.idx,borders:q.top.map((b,i)=>q.ans[i]?(q.ans[i]===PAIR[b]?'#b8e04a':'#ff5a68'):null)})+letterBtns(BASES),
  key(q,k){k=k.toUpperCase();if(!BASES.includes(k))return;q.ans[q.idx++]=k;if(q.idx>=q.n)seqEnd();else refreshPanel();},
  score:q=>q.top.filter((b,i)=>q.ans[i]===PAIR[b]).length/q.n},
 {id:'memory',short:'Remember ➜ type the partners',name:'Memory Strand',icon:'🧠',how:`Memorize the strand before it disappears. Then type its <b>partner</b> strand from memory, left to right.`,
  sci:'Cells copy DNA by reading one strand and building the partner strand to match it.',
  time:q=>3.5+q.n*2.2,setup(q){q.n=4+q.d;q.top=rb(q.n);q.ans=[];q.idx=0;q.showT=3.5;},
  body:q=>q.showT>0?`<p class="big2">Memorize! <span id="memT">${Math.ceil(q.showT)}</span></p>`+ladder(q.top,q.top.map(()=>' ')):`<p class="big2">Now type the partner strand.</p>`+ladder(q.top.map(()=>'?'),q.top.map((b,i)=>q.ans[i]||'?'),{ringBot:q.idx})+letterBtns(BASES),
  tick(q,dt){if(q.showT>0){q.showT-=dt;const e=document.getElementById('memT');if(e)e.textContent=Math.ceil(Math.max(0,q.showT));if(q.showT<=0)refreshPanel();}},
  key(q,k){if(q.showT>0)return;k=k.toUpperCase();if(!BASES.includes(k))return;q.ans[q.idx++]=k;if(q.idx>=q.n)seqEnd();else refreshPanel();},
  score:q=>q.top.filter((b,i)=>q.ans[i]===PAIR[b]).length/q.n},
 {id:'mutation',short:'Tap the 3 wrong letters',name:'Mutation Hunt',icon:'🔍',how:`The bottom strand should be the partner of the top strand, but <b>3 letters are wrong</b>. Click the wrong ones on the bottom.`,
  sci:'A mutation is a mistake in the DNA code. Some do nothing, some cause disease, and a few are useful.',
  time:q=>14+q.d*2,setup(q){q.n=8+q.d*2;q.top=rb(q.n);q.bot=q.top.map(b=>PAIR[b]);q.muts=[];while(q.muts.length<3){const i=irnd(0,q.n-1);if(!q.muts.includes(i))q.muts.push(i);}
    q.muts.forEach(i=>{q.bot[i]=pick(BASES.filter(b=>b!==PAIR[q.top[i]]));});q.found=[];q.miss=[];},
  body:q=>`<p class="big2">Found ${q.found.length} of 3 · Wrong clicks: ${q.miss.length}</p>`+ladder(q.top,q.bot,{click:true,borders:q.bot.map((b,i)=>q.found.includes(i)?'#b8e04a':q.miss.includes(i)?'#ff5a68':null)}),
  act(q,d){const i=+d.i;if(q.found.includes(i)||q.miss.includes(i))return;if(q.muts.includes(i))q.found.push(i);else q.miss.push(i);if(q.found.length>=3)seqEnd();else refreshPanel();},
  score:q=>clamp((q.found.length-q.miss.length*.5)/3,0,1)},
 {id:'gaps',short:'Fill the ? with the partner',name:'Fill the Gaps',icon:'🧩',how:`The bottom strand is complete. The top strand has holes. Fill each highlighted hole with the <b>partner</b> of the letter under it.`,
  sci:'Because A only fits T and G only fits C, one strand of DNA is enough to rebuild the other.',
  time:q=>q.gaps.length*2.4+3,setup(q){q.n=8+q.d*2;q.bot=rb(q.n);const g=[];while(g.length<3+q.d){const i=irnd(0,q.n-1);if(!g.includes(i))g.push(i);}q.gaps=g.sort((a,b)=>a-b);q.ans={};q.idx=0;},
  body:q=>ladder(q.bot.map((b,i)=>q.gaps.includes(i)?(q.ans[i]||'?'):PAIR[b]),q.bot,{ringTop:q.gaps[q.idx]})+letterBtns(BASES),
  key(q,k){k=k.toUpperCase();if(!BASES.includes(k))return;q.ans[q.gaps[q.idx++]]=k;if(q.idx>=q.gaps.length)seqEnd();else refreshPanel();},
  score:q=>q.gaps.filter(i=>q.ans[i]===PAIR[q.bot[i]]).length/q.gaps.length},
 {id:'bonds',short:'A–T = 2 · G–C = 3',name:'Bond Count',icon:'🔗',how:`How many bonds hold this pair together? <b>A–T has 2 bonds.</b> <b>G–C has 3 bonds.</b> Click 2 or 3 (or press the 2 or 3 key).`,
  sci:'G–C pairs have 3 hydrogen bonds and A–T pairs have 2, so G–C pairs are a little harder to pull apart.',
  time:q=>q.rounds*2.6,setup(q){q.rounds=6+q.d*2;q.pairs=Array.from({length:q.rounds},()=>{const b=pick(BASES);return [b,PAIR[b]];});q.idx=0;q.right=0;q.last=null;},
  body:q=>{const [a,b]=q.pairs[q.idx]||['',''];return `<p class="big2">Pair ${q.idx+1} of ${q.rounds}${q.last!==null?` · <span style="color:${q.last?'#9dffb2':'#ff8a95'}">${q.last?'Correct!':'Not quite'}</span>`:''}</p>
    <div class="row" style="justify-content:center;gap:0;margin:10px 0">${tile(a)}<div style="display:grid;gap:5px;padding:0 10px">${'<span class="hb"></span>'.repeat(1)}<span class="hb q">?</span>${'<span class="hb"></span>'.repeat(1)}</div>${tile(b)}</div>
    <!--deck--><div class="deckrow">${arcBtn('2','data-a="seqKey" data-b="2"','#4aa8ff','bonds · A–T')}${arcBtn('3','data-a="seqKey" data-b="3"','#5ad66a','bonds · G–C')}</div>`;},
  key(q,k){if(k!=='2'&&k!=='3')return;const [a]=q.pairs[q.idx];const ok=(a==='G'||a==='C')?k==='3':k==='2';q.last=ok;if(ok)q.right++;q.idx++;if(q.idx>=q.rounds)seqEnd();else refreshPanel();},
  score:q=>q.right/q.rounds},
 {id:'rna',short:'A→U · T→A · G→C · C→G',name:'Make the RNA',icon:'📜',how:`Copy this DNA into RNA. RNA has no T. It uses <b>U</b> instead. Rules: <b>A → U</b>, <b>T → A</b>, <b>G → C</b>, <b>C → G</b>.`,
  sci:'Transcription: a cell copies a gene from DNA into messenger RNA (mRNA), which carries the recipe out to build proteins.',
  time:q=>q.n*2,setup(q){q.n=6+q.d*2;q.top=rb(q.n);q.ans=[];q.idx=0;},
  body:q=>`<p class="mute" style="margin:0">DNA (top) → RNA (bottom)</p>`+ladder(q.top,q.top.map((b,i)=>q.ans[i]||'?'),{ringTop:q.idx,borders:q.top.map((b,i)=>q.ans[i]?(q.ans[i]===RNA[b]?'#b8e04a':'#ff5a68'):null)})+letterBtns(['A','U','G','C'],true),
  key(q,k){k=k.toUpperCase();if(!'AUGC'.includes(k)||k.length!==1)return;q.ans[q.idx++]=k;if(q.idx>=q.n)seqEnd();else refreshPanel();},
  score:q=>q.top.filter((b,i)=>q.ans[i]===RNA[b]).length/q.n},
 {id:'copy',short:'Watch ➜ type the partners',name:'Copy Machine',icon:'📠',how:`Letters flash one at a time. When they stop, type the <b>partner</b> of each one, in order. 3 rounds, each one longer.`,
  sci:'DNA replication: before a cell divides, it unzips its DNA and builds a matching partner for every base.',
  time:()=>45,setup(q){q.round=0;q.passed=0;q.part=0;simonRound(q);},
  body:q=>`<p class="big2">Round ${q.round+1} of 3 · ${q.phase==='show'?'Watch…':'Type the partners!'}</p>
    <div class="row" style="justify-content:center;margin:10px 0">${q.phase==='show'?`<div id="simon">${tile(' ')}</div>`:q.seq.map((b,i)=>tile(q.ans[i]||'?',{border:q.ans[i]?(q.ans[i]===PAIR[b]?'#b8e04a':'#ff5a68'):null})).join('')}</div>${q.phase==='show'?'':letterBtns(BASES)}`,
  tick(q,dt){if(q.phase!=='show')return;q.st+=dt;if(q.st<0)return;const i=Math.floor(q.st/.8),on=(q.st%.8)<.6;const e=document.getElementById('simon');
    if(i>=q.seq.length){q.phase='input';refreshPanel();return;}if(e)e.innerHTML=tile(on?q.seq[i]:' ');},
  key(q,k){if(q.phase!=='input')return;k=k.toUpperCase();if(!BASES.includes(k))return;q.ans.push(k);const i=q.ans.length-1;
    if(k!==PAIR[q.seq[i]]){q.part+=i/q.seq.length;nextSimon(q);return;}if(q.ans.length>=q.seq.length){q.passed++;nextSimon(q);return;}refreshPanel();},
  score:q=>(q.passed+q.part)/3},
 {id:'spin',short:'Stop in the green',name:'Centrifuge',icon:'🌀',how:`Spin the sample to separate the DNA. Press <b>SPACE</b> or click <b>STOP</b> when the needle is inside the green zone. 5 tries.`,
  sci:'A centrifuge spins samples very fast so heavy parts sink to the bottom. Labs use it to pull DNA out of cells.',
  time:()=>30,setup(q){q.tries=0;q.hits=0;q.res=[];spinNext(q);},
  body:q=>`<p class="big2">Try ${Math.min(5,q.tries+1)} of 5 · Hits: ${q.hits}</p>
    <div class="spinbar"><div class="zone" style="left:${(q.zc-q.zw/2)*100}%;width:${q.zw*100}%"></div><div id="needle" style="left:${q.pos*100}%"></div></div>
    <div class="row" style="margin-top:6px">${q.res.map(r=>r?'✅':'❌').join(' ')}</div>
    <!--deck--><div class="deckrow">${arcBtn('STOP','data-a="seqKey" data-b=" "','#ff3b3b','or press Space','big')}</div>`,
  tick(q,dt){q.pos+=q.v*dt;if(q.pos>1){q.pos=1;q.v*=-1;}if(q.pos<0){q.pos=0;q.v*=-1;}const e=document.getElementById('needle');if(e)e.style.left=(q.pos*100)+'%';},
  key(q,k){if(k!==' ')return;const hit=Math.abs(q.pos-q.zc)<=q.zw/2;q.res.push(hit);if(hit)q.hits++;q.tries++;sfx(hit?'coin':'bad');if(q.tries>=5)seqEnd();else{spinNext(q);refreshPanel();}},
  score:q=>q.hits/5},
 {id:'gel',short:'Smallest ➜ largest',name:'Gel Sort',icon:'🧫',how:`DNA pieces move through gel at different speeds. <b>Small pieces travel farthest.</b> Click the pieces from <b>smallest to largest</b>.`,
  sci:'Gel electrophoresis sorts DNA by size. Scientists use it for DNA fingerprinting and paternity tests.',
  time:q=>14+q.d*2,setup(q){const s=[];while(s.length<5+q.d){const v=irnd(2,30)*50;if(!s.includes(v))s.push(v);}q.frags=s;q.done2=[];q.miss=0;q.flash=-1;},
  body:q=>{const mx=Math.max(...q.frags);return `<p class="big2">Sorted ${q.done2.length} of ${q.frags.length} · Mistakes: ${q.miss}</p><div class="gel">${q.frags.map((v,i)=>{const d=q.done2.includes(i);
    return `<button class="frag ${d?'done':''} ${q.flash===i?'bad':''}" data-a="seqAct" data-i="${i}" ${d?'disabled':''}><span style="width:${Math.max(8,100*v/mx)}%"></span><b>${v} base pairs</b>${d?' ✅ #'+(q.done2.indexOf(i)+1):''}</button>`;}).join('')}</div>`;},
  act(q,d){const i=+d.i;if(q.done2.includes(i))return;const left=q.frags.map((v,j)=>j).filter(j=>!q.done2.includes(j));const small=left.reduce((a,b)=>q.frags[a]<q.frags[b]?a:b);
    if(i===small){q.done2.push(i);q.flash=-1;}else{q.miss++;q.flash=i;sfx('bad');}if(q.done2.length>=q.frags.length)seqEnd();else refreshPanel();},
  score:q=>clamp(q.done2.length/q.frags.length-q.miss*.2,0,1)},
 {id:'pipette',short:'Hold ➜ let go at the line',name:'Pipette',icon:'💉',how:`Fill each tube exactly to the gold line. <b>Hold</b> the FILL button (or hold SPACE) and <b>let go</b> right at the line. 3 tubes.`,
  sci:'Lab scientists measure tiny amounts of liquid with pipettes. Too much or too little can ruin an experiment.',
  time:()=>30,setup(q){q.tube=0;q.lvl=0;q.fill=false;q.errs=[];q.target=rnd(.35,.85);},
  body:q=>`<p class="big2">Tube ${Math.min(3,q.tube+1)} of 3</p><div class="row" style="align-items:flex-end;gap:18px;justify-content:center">
    ${[0,1,2].map(i=>`<div class="tube"><div class="liq" ${i===q.tube?'id="liq"':''} style="height:${i<q.tube?q.errs[i].lvl*100:i===q.tube?q.lvl*100:0}%"></div><div class="line" style="bottom:${(i<q.tube?q.errs[i].t:i===q.tube?q.target:-1)*100}%"></div></div>`).join('')}</div>
    <div class="row" style="justify-content:center;margin-top:6px">${q.errs.map(e=>e.ok?'✅ close!':'❌ off').join(' · ')}</div>
    <!--deck--><div class="deckrow">${arcBtn('FILL','data-pip="1"','#4aa8ff','hold, then let go','big')}</div>`,
  tick(q,dt){if(q.fill){q.lvl=Math.min(1,q.lvl+dt*(.42+q.d*.08));const e=document.getElementById('liq');if(e)e.style.height=(q.lvl*100)+'%';if(q.lvl>=1)pipRelease();}},
  score:q=>q.errs.reduce((a,e)=>a+Math.max(0,1-e.err*5),0)/3}
];
function simonRound(q){q.seq=rb(3+q.round+q.d);q.ans=[];q.phase='show';q.st=-.4;}
function nextSimon(q){q.round++;if(q.round>=3){seqEnd();return;}simonRound(q);refreshPanel();}
function spinNext(q){q.pos=0;q.v=(.9+q.d*.25+q.tries*.15)*(Math.random()<.5?1:-1);if(q.v<0)q.pos=1;q.zw=Math.max(.08,.24-q.tries*.03-q.d*.03);q.zc=rnd(.15+q.zw/2,.85-q.zw/2);}
function pipPress(){const q=S&&S.seq;if(!q||q.done||curGame(q).id!=='pipette'||q.tube>=3)return;q.fill=true;}
function pipRelease(){const q=S&&S.seq;if(!q||q.done||!q.fill)return;q.fill=false;const err=Math.abs(q.lvl-q.target);q.errs.push({err,ok:err<.06,lvl:q.lvl,t:q.target});sfx(err<.06?'coin':'bad');
  q.tube++;q.lvl=0;q.target=rnd(.35,.85);if(q.tube>=3)seqEnd();else refreshPanel();}
addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('[data-pip]')){e.preventDefault();pipPress();}});
addEventListener('pointerup',()=>pipRelease());
addEventListener('keyup',e=>{if(e.key===' ')pipRelease();});
const curGame=q=>SEQ_GAMES.find(g=>g.id===q.g);
/* nextGameIdx: replaced later */
const PRACTICE_GENE={icon:'🧪',name:'Practice sample',color:'#7dff9a'};
const vialGene=q=>q.practice?PRACTICE_GENE:geneInfo(q.vial.gene);
function seqStart(vid,practiceIdx){
  const practice=vid==='practice';if(!atLab())return;
  const v=practice?{id:'practice',gene:'practice',q:'clean',val:0}:S.vault.find(x=>x.id==vid);if(!v)return;
  const G=SEQ_GAMES[practice&&practiceIdx!==undefined?+practiceIdx:nextGameIdx()];
  const q={g:G.id,vial:v,d:{rough:0,clean:1,pure:2}[v.q]||0,done:false,started:false};G.setup(q);q.max=q.t=G.time(q);
  q.practice=practice;S.seq=q;S.gtab='seq';
}
function seqGo(){const q=S.seq;if(!q||q.done)return;q.started=true;seqEnsureTimer();refreshPanel();}
function seqEnsureTimer(){clearInterval(S.seqTimer);let last=performance.now();
  S.seqTimer=setInterval(()=>{const q=S.seq,now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
    if(!q||q.done||ovMode!=='panel'||S.panel!=='genome'||S.gtab!=='seq'||!q.started){clearInterval(S.seqTimer);return;}
    q.t-=dt;const b=document.getElementById('seqbar');if(b)b.style.width=Math.max(0,100*q.t/q.max)+'%';
    const G=curGame(q);if(G.tick)G.tick(q,dt);if(q.t<=0&&!q.done)seqEnd();},40);}
function seqKeyIn(k){const q=S.seq;if(!q||q.done)return;sfx('ui');if(!q.started){if(k===' '||k==='enter')seqGo();return;}const G=curGame(q);if(G.key)G.key(q,k);}
function seqPress(b){seqKeyIn(String(b).toLowerCase());}
function seqActIn(d){const q=S.seq;if(!q||q.done||!q.started)return;const G=curGame(q);if(G.act)G.act(q,d);}
function seqEnd(){
  const q=S.seq;if(!q||q.done)return;clearInterval(S.seqTimer);const G=curGame(q);
  q.score=clamp(G.score(q),0,1);
  if(q.practice){toast('🧪 Practice '+G.name+': '+Math.round(q.score*100)+'%.');q.gain=0;q.done=true;refreshPanel();return;}const bonus=q.t/q.max>.35&&q.score===1?.1:0;const mult=.7+.8*q.score+bonus;
  q.gain=Math.round(q.vial.val*mult);S.vault=S.vault.filter(v=>v!==q.vial);
  addDNA(q.vial.gene,q.gain);S.seqIdx=(S.seqIdx||0)+1;
  if(q.score===1&&POWERS[q.vial.gene]&&Math.random()<.5){const cur=S.gmods[q.vial.gene]||[];if(cur.length<modSlots(q.vial.gene)){const opts=Object.keys(GMODS).filter(m=>!cur.includes(m));q.mod=pick(opts);S.gmods[q.vial.gene]=cur.concat(q.mod);}}
  toast('🔬 '+G.name+': '+Math.round(q.score*100)+'% → +'+q.gain+'% '+geneInfo(q.vial.gene).name+' DNA.','good');
  q.done=true;refreshPanel();
}
function labOrder(){const i=nextGameIdx();return `<div class="laborder">${SEQ_GAMES.map((g,j)=>`<button class="lo ${j===i?'on':''}" data-a="seqPractice" data-g="${j}" title="${g.name}: ${g.short}. Click to practice it (no DNA used).">${g.icon}<small>${j+1}</small></button>`).join('')}</div>`;}
const HELIX=`<div class="helix">${Array.from({length:22},(_,i)=>`<span style="--i:${i}"><i></i><b></b></span>`).join('')}</div>`;
function machine(title,screen,deck,lights){
  const L=lights||['#7dff9a','#ffd166','#ff5a68'];
  return `<div class="machine"><div class="mtop"><span class="plate">🧬 GENE-O-MATIC 3000</span><span class="mlights">${L.map((c,i)=>`<i style="--lc:${c};animation-delay:${i*.3}s"></i>`).join('')}</span></div>
    <div class="scr">${HELIX}<div class="scrhead">${title}</div>${screen}</div>${deck?`<div class="deck">${deck}</div>`:''}<span class="screw s1"></span><span class="screw s2"></span><span class="screw s3"></span><span class="screw s4"></span></div>`;}
function tubeRack(off){
  return `<div class="rack ${off?'off':''}">${S.vault.map(v=>{const g=geneInfo(v.gene),Q=QUAL[v.q];return `<button class="ttube" ${off?'disabled':''} data-a="seqStart" data-v="${v.id}" title="${g.name} (${Q.name} strand). Click to load it into the machine. Up to +${Math.round(v.val*1.6)}% DNA.">
    <span class="glass"><span class="liq2" style="background:${g.color};height:${30+(v.val/60)*60}%"></span><span class="gi">${g.icon}</span></span><b>${g.name}</b><small style="color:${Q.col}">${Q.name}</small></button>`;}).join('')}</div>`;}
function seqTab(){
  if(!atLab())return machine('⚠ MACHINE OFFLINE',`<div class="intro"><div class="bigic">🏠</div><div><h3 style="margin:0 0 6px">The Gene-O-Matic is in your cabin</h3>
    <p style="margin:0;font-size:18px">Walk into your base and press <b>E</b> at the <b>DNA Lab</b> to load strands and play the lab tests.</p>
    <p class="mute" style="margin:8px 0 0">Out here you can only absorb strands raw (half strength).</p></div></div>
    ${S.vault.length?`<p class="mute" style="margin:10px 0 0">Strands waiting to be loaded:</p>`+tubeRack(true):''}`,
    `<div class="deckrow">${arcBtn('🧪','data-a="gtab" data-t="vault"','#ffd166','absorb raw now')}${arcBtn('🧬','data-a="gtab" data-t="powers"','#c27bff','my powers')}</div>`,['#555','#555','#ff5a68']);
  const q=S.seq;
  if(q&&q.done){const g=vialGene(q),G=curGame(q),N=SEQ_GAMES[nextGameIdx()],grade=q.score===1?'PERFECT':q.score>=.75?'GREAT':q.score>=.5?'OKAY':'MESSY';
    const stars='★'.repeat(Math.round(q.score*5))+'☆'.repeat(5-Math.round(q.score*5));
    return machine(`${G.icon} ${G.name} · DONE`,`<div class="ticket"><div class="tk1">LAB RESULT</div><div style="font-size:40px">${g.icon}</div><div class="tk2" style="color:${g.color}">${grade}</div><div class="stars">${stars}</div>
      ${q.practice?'<div class="tk3">Practice run</div><div class="mute">No DNA used. Load a real strand for DNA.</div>':`<div class="tk3">+${q.gain}% ${g.name} DNA</div><div class="mute">Now at ${Math.round(S.dna[q.vial.gene]||0)}%</div>`}${q.mod?`<div style="color:var(--gold);margin-top:4px">Bonus gene mod: ${GMODS[q.mod].icon} ${GMODS[q.mod].name}</div>`:''}
      <div class="tksci">🔬 ${G.sci}</div></div><p style="text-align:center;margin:8px 0 0">Next test: <b>${N.icon} ${N.name}</b></p>`,
      `<div class="deckrow">${S.vault.length?arcBtn('▶','data-a="gtab" data-t="seq"','#7dff9a','load another ('+S.vault.length+')'):''}${arcBtn('🧬','data-a="gtab" data-t="powers"','#c27bff','see my powers')}</div>`);}
  if(q&&!q.done){const G=curGame(q),g=vialGene(q);
    const title=`${G.icon} TEST ${SEQ_GAMES.indexOf(G)+1}/10 · ${G.name.toUpperCase()} <span class="mute" style="float:right">${g.icon} ${g.name} · ${q.practice?'practice':QUAL[q.vial.q].name}</span>`;
    const pr=['ladder','memory'].includes(G.id);
    if(!q.started)return machine(title,`<div class="intro"><div class="bigic">${G.icon}</div><div><h3 style="margin:0 0 6px">${G.name}</h3><p style="margin:0 0 8px;font-size:18px">${G.how}</p>${pr?`<p style="margin:0">${PAIR_RULE}</p>`:''}
      <p class="mute" style="margin:8px 0 0">⏱ ${Math.round(q.max)} seconds · Better score = more DNA · Perfect = maybe a free gene mod</p></div></div>`,
      `<div class="deckrow">${arcBtn('START','data-a="seqGo"','#ff3b3b','or press Space','big')}</div>`);
    seqEnsureTimer();
    const parts=G.body(q).split('<!--deck-->');
    return machine(title,`<div class="row" style="gap:8px;margin-bottom:6px"><span class="chip">🎯 ${G.short}</span>${pr?PAIR_RULE:''}</div><div class="ledbar"><i id="seqbar" style="width:${100*q.t/q.max}%"></i></div>
      <div style="margin-top:8px">${parts[0]}</div>`,parts[1]||'');}
  return machine('SELECT A SAMPLE',`<p style="margin:0 0 6px;font-size:18px">Click a test tube to load it into the machine. Each strand plays a random lab test.</p>
    <p class="mute" style="margin:0 0 4px">Each strand gets a random lab test. Gold = the one you'll get next (click any to practice it):</p>${labOrder()}
    ${S.vault.length?tubeRack():`<div class="rack">${[0,1,2,3].map(()=>'<span class="ttube"><span class="glass"></span><small class="mute">empty</small></span>').join('')}</div>`}`,
    `<div class="deckrow">${arcBtn('▶','data-a="seqPractice" data-g="'+nextGameIdx()+'"','#4aa8ff','practice next test')}${S.vault.length?'':arcBtn('🗡️','data-a="close"','#ff5a68','go hunt for strands')}</div>`);
}
