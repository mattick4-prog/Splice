// ================= KID / EASY MODE TUNING =================
const DIFF_K={kid:{raid:.3,gate:.25,ambush:.3,hunger:2,hazards:0},easy:{raid:.6,gate:.12,ambush:.6,hunger:1,hazards:0},normal:{raid:1,gate:0,ambush:1,hunger:1,hazards:1},hard:{raid:1.3,gate:-.05,ambush:1.3,hunger:1,hazards:1}};
function diffK(k){const D=DIFF_K[(S&&S.diff)||'normal']||DIFF_K.normal;return D[k];}
// no traps / gas / rotten floors in buildings on Easy and Kid
{const _ah=addHazards;addHazards=function(I){if(!diffK('hazards')){if(I){I.haz=[];}return;}return _ah(I);};}
// fewer ambushes when searching
{const _am=ambush;ambush=function(...a){if(Math.random()>diffK('ambush'))return;return _am(...a);};}
// slower hunger: only eat every other morning in Kid mode
{const _od=onDawn;onDawn=function(){const f=S.res.food;_od();if(diffK('hunger')>1&&S.day%2===0&&S.res.food<f){S.res.food=f;}};}
// gate guards go easier on kids
{const _so=searchOdds;searchOdds=function(c){return clamp(_so(c)+diffK('gate'),.05,.95);};}
// change difficulty any time from the Menu
{const _mh=menuHtml;menuHtml=function(){const h=_mh();const row=`<section style="margin-top:10px"><h3>🎚️ Difficulty</h3><div class="row" style="gap:6px;flex-wrap:wrap">${Object.keys(DIFFS).map(k=>`<button class="btn sm ${S.diff===k?'gold':'ghost'}" data-a="setdiff" data-d="${k}" title="${DIFFS[k].desc}">${DIFFS[k].name}</button>`).join('')}</div><small class="mute">${DIFFS[S.diff].desc}. Changing it keeps your progress.</small></section>`;
  return h.replace(/<\/div>\s*$/,row+'</div>');};}
{const _act=act;act=function(a,d){if(a==='setdiff'&&DIFFS[d.d]){S.diff=d.d;toast('🎚️ Difficulty: '+DIFFS[d.d].name+'.','good');refreshPanel();return;}_act(a,d);};}
