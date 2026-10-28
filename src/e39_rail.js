// ================= LEFT TOOLBAR → a slim icon rail that grows on hover, fades while you play, and tucks away =================
let RAIL_HIDDEN=false;try{RAIL_HIDDEN=localStorage.getItem('splice_rail')==='hidden';}catch(e){}
let railLastNear=0;
addEventListener('mousemove',e=>{if(e.clientX<240)railLastNear=performance.now();});
function railSetup(){if(!tbEl||tbEl.classList.contains('rail'))return;tbEl.classList.add('rail');
  const order=['menu','dna','inv','map','journal','log','help'],groups={menu:1,inv:1,log:1};
  order.forEach(k=>{const b=tbEl.querySelector(`[data-tb="${k}"]`);if(!b)return;b.removeAttribute('title');delete b.dataset.tip;tbEl.appendChild(b);if(!b.querySelector('em.rb')){const em=document.createElement('em');em.className='rb';b.appendChild(em);}
    if(groups[k]){const d=document.createElement('i');d.className='rdiv';tbEl.appendChild(d);}});
  const t=document.createElement('button');t.className='rtuck';t.title='Hide the toolbar (you can bring it back from the little tab)';t.innerHTML='<span>‹</span><b>Hide</b>';
  t.addEventListener('click',e=>{e.stopPropagation();railHide(true);});tbEl.appendChild(t);
  const h=document.createElement('button');h.id='railhandle';h.title='Show the toolbar';h.innerHTML='☰';h.addEventListener('click',()=>railHide(false));document.body.appendChild(h);
  railHide(RAIL_HIDDEN,true);}
function railHide(v,quiet){RAIL_HIDDEN=v;try{localStorage.setItem('splice_rail',v?'hidden':'shown');}catch(e){}if(!tbEl)return;tbEl.classList.toggle('tucked',v);const h=document.getElementById('railhandle');if(h)h.classList.toggle('on',v);if(!quiet)sfx('ui');}
function railBadges(){if(!S||!tbEl)return;const set=(k,txt)=>{const em=tbEl.querySelector(`[data-tb="${k}"] em.rb`);if(!em)return;if(em._t!==txt){em._t=txt;em.textContent=txt||'';em.style.display=txt?'grid':'none';}};
  set('dna',S.vault&&S.vault.length?String(S.vault.length):'');
  const rec=(S.recent||[]).length,seenBag=S.bagSeen||0;set('inv',rec>seenBag?'•':'');
  const hist=(S.history||[]).length,seenLog=S.logSeen||0;set('log',hist>seenLog?String(Math.min(99,hist-seenLog)):'');}
{const _ut=updateToolbar;updateToolbar=function(){_ut();if(!tbEl)return;railSetup();
  const show=tbEl.style.display!=='none';const h=document.getElementById('railhandle');if(h)h.style.display=show&&RAIL_HIDDEN?'block':'none';
  // fade while you're busy playing, wake up when the mouse comes near
  const moving=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].some(k=>keys[k]);
  tbEl.classList.toggle('quiet',(moving||performance.now()-railLastNear>3500)&&!tbEl.matches(':hover'));
  railBadges();};}
// opening Bag / Log clears their badges
{const _op=openPanel;openPanel=function(n){if(S){if(n==='inv')S.bagSeen=(S.recent||[]).length;if(n==='log')S.logSeen=(S.history||[]).length;}return _op(n);};}
{const _rp=refreshPanel;refreshPanel=function(){_rp();if(S&&S.panel==='log')S.logSeen=(S.history||[]).length;};}
(function(){const st=document.createElement('style');st.textContent=`
#toolbar.rail{left:10px;top:50%;transform:translateY(-50%);gap:4px;padding:6px;background:rgba(10,12,11,.72);border:1px solid #ffffff18;border-radius:16px;box-shadow:0 6px 24px #0008;backdrop-filter:blur(4px);transition:opacity .35s,transform .35s,left .35s}
#toolbar.rail.quiet{opacity:.38}
#toolbar.rail.tucked{left:-90px;opacity:0;pointer-events:none}
#toolbar.rail button{position:relative;min-width:0;width:44px;height:44px;padding:0 11px;gap:10px;border-radius:12px;background:transparent;border:1px solid transparent;overflow:hidden;white-space:nowrap;transition:width .25s ease,background .2s,border-color .2s}
#toolbar.rail:hover button{width:150px}
#toolbar.rail button:hover{background:#ffffff14;border-color:var(--gold)}
#toolbar.rail button span{font-size:21px;width:22px;flex:none;text-align:center}
#toolbar.rail button b{opacity:0;transition:opacity .2s}#toolbar.rail:hover button b{opacity:1}
#toolbar.rail button kbd{opacity:0;transition:opacity .2s;margin-left:auto}#toolbar.rail:hover button kbd{opacity:.8}
#toolbar.rail em.rb{position:absolute;left:25px;top:3px;display:none;place-items:center;min-width:14px;height:14px;padding:0 3px;border-radius:7px;background:#ffd166;color:#222;font:800 10px/1 var(--body,sans-serif);font-style:normal;box-shadow:0 1px 3px #000a}
#toolbar.rail .rdiv{display:block;height:1px;margin:2px 6px;background:#ffffff22}
#toolbar.rail .rtuck{height:30px;opacity:.6}#toolbar.rail .rtuck span{font-size:18px}
#railhandle{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:5;display:none;width:26px;height:56px;border:1px solid #ffffff22;border-left:0;border-radius:0 12px 12px 0;background:rgba(10,12,11,.8);color:#eee;font-size:16px;cursor:pointer;opacity:.6}
#railhandle:hover{opacity:1;width:32px}`;document.head.appendChild(st);})();
