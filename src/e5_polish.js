// ================= POLISH: sound, saving, difficulty, gamepad =================
const DIFFS={kid:{name:'Kid',lives:6,ehp:.6,edmg:.45,desc:'for younger players: no traps, rare raids, slow hunger'},easy:{name:'Easy',lives:5,ehp:.75,edmg:.65,desc:'5 lives, weaker monsters, no traps in houses'},normal:{name:'Normal',lives:3,ehp:1,edmg:1,desc:'3 lives'},hard:{name:'Hard',lives:2,ehp:1.3,edmg:1.35,desc:'2 lives, tougher monsters'}};
let TITLE_DIFF='normal';
// ---------- sound (synthesized, no files) ----------
let AC=null,SND=true;const SLAST={};
try{SND=localStorage.getItem('splice_sound')!=='off';}catch(e){}
function audioInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}
const SFX={swing:[0,'triangle',260,120,.06,.1],hit:[1,'square',180,60,.07,.1],power:[0,'sawtooth',300,900,.07,.22],pickup:[0,'sine',660,1320,.08,.16],door:[1,'sine',110,60,.1,.22],
  hurt:[1,'square',140,40,.1,.2],kill:[1,'sawtooth',220,40,.08,.3],ui:[0,'sine',520,620,.05,.07],night:[0,'sine',140,55,.1,1.4],dawn:[0,'sine',330,660,.08,1],boss:[1,'sawtooth',80,35,.14,1.2],shot:[1,'square',500,90,.07,.08],coin:[0,'square',880,1320,.05,.12],bad:[0,'sawtooth',200,90,.07,.4]};
function sfx(n){
  if(!AC||!SND)return;const P=SFX[n];if(!P)return;const now=AC.currentTime;if(SLAST[n]&&now-SLAST[n]<.05)return;SLAST[n]=now;
  try{const [noise,type,f1,f2,vol,dur]=P;const g=AC.createGain();g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(.0001,now+dur);g.connect(AC.destination);
    const o=AC.createOscillator();o.type=type;o.frequency.setValueAtTime(f1,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),now+dur);o.connect(g);o.start(now);o.stop(now+dur+.02);
    if(noise){const len=Math.floor(AC.sampleRate*dur),buf=AC.createBuffer(1,len,AC.sampleRate),ch=buf.getChannelData(0);for(let i=0;i<len;i++)ch[i]=(Math.random()*2-1)*(1-i/len);
      const s=AC.createBufferSource();s.buffer=buf;const ng=AC.createGain();ng.gain.value=vol*.8;s.connect(ng);ng.connect(AC.destination);s.start(now);}}catch(e){}
}
function toggleSound(){SND=!SND;try{localStorage.setItem('splice_sound',SND?'on':'off');}catch(e){}if(S)toast('Sound '+(SND?'on':'off')+' (N to toggle).');}
// ---------- saving ----------
const PROFILE_INDEX_KEY='splice_profiles_v1';
let SAVE_KEY='splice_save_v1';
let PROFILES=[{id:'default',name:'Player 1'}];
let ACTIVE_PROFILE_ID='default';
function profileSaveKey(id){return id==='default'?'splice_save_v1':'splice_save_v1_'+id;}
function saveProfileIndex(){try{localStorage.setItem(PROFILE_INDEX_KEY,JSON.stringify({profiles:PROFILES,active:ACTIVE_PROFILE_ID}));}catch(e){}}
function loadProfiles(){
  let saved=null;try{saved=JSON.parse(localStorage.getItem(PROFILE_INDEX_KEY)||'null');}catch(e){}
  PROFILES=[{id:'default',name:'Player 1'}];
  const ids=new Set(['default']);
  if(saved&&Array.isArray(saved.profiles))saved.profiles.forEach(p=>{
    if(!p||typeof p.id!=='string'||!/^p_[a-z0-9_]+$/.test(p.id)||ids.has(p.id))return;
    const name=String(p.name||'').trim().slice(0,24);if(!name)return;
    PROFILES.push({id:p.id,name});ids.add(p.id);
  });
  ACTIVE_PROFILE_ID=PROFILES.some(p=>p.id===saved?.active)?saved.active:'default';
  SAVE_KEY=profileSaveKey(ACTIVE_PROFILE_ID);saveProfileIndex();
}
function activeProfile(){return PROFILES.find(p=>p.id===ACTIVE_PROFILE_ID)||PROFILES[0];}
function setGameProfile(id){if(!PROFILES.some(p=>p.id===id))return false;ACTIVE_PROFILE_ID=id;SAVE_KEY=profileSaveKey(id);saveProfileIndex();return true;}
function addGameProfile(name){
  name=String(name||'').trim().slice(0,24);if(!name||PROFILES.some(p=>p.name.toLowerCase()===name.toLowerCase()))return false;
  const id='p_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);PROFILES.push({id,name});setGameProfile(id);return true;
}
function deleteGameProfile(id){
  if(id==='default'||PROFILES.length<=1)return false;
  const i=PROFILES.findIndex(p=>p.id===id);if(i<0)return false;
  try{localStorage.removeItem(profileSaveKey(id));}catch(e){}
  PROFILES.splice(i,1);if(ACTIVE_PROFILE_ID===id)ACTIVE_PROFILE_ID='default';SAVE_KEY=profileSaveKey(ACTIVE_PROFILE_ID);saveProfileIndex();return true;
}
function profileSaveInfo(id){try{return JSON.parse(localStorage.getItem(profileSaveKey(id))||'null');}catch(e){return null;}}
function profileHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
loadProfiles();
function saveGame(quiet){
  try{if(!S||!(S.mode==='hunter'||S.mode==='monster'))return;
    const hyb={};Object.keys(POWERS).forEach(id=>{if(POWERS[id].hybrid)hyb[id]=POWERS[id];});
    const d={v:1,town:S.town,day:S.day,mode:S.mode,tier:S.tier,baseHp:S.baseHp,humanity:S.humanity,lives:S.lives,maxLives:S.maxLives,res:S.res,dna:S.dna,slots:S.slots,traits:S.traits,gmods:S.gmods,
      vault:S.vault,weapons:S.weapons,wpn:S.wpn,stats:S.stats,mods:S.mods,recipesFound:S.recipesFound,crew:S.crew.map(c=>({name:c.name,role:c.role})),townLog:S.townLog,stateDone:S.stateDone,
      story:S.story,path:S.path,choices:S.choices,flags:S.flags,diff:S.diff,evo:S.evo,biomass:S.biomass,hyb,vance:!!S.vance,vanceGone:!!S.vanceGone,seen:S.seen,windows:S.windows.map(w=>w.hp),truck:S.truck,ruined:!!S.ruined,defs:S.defs||{},gday:S.gday||1,maxTown:S.maxTown||0,maxTier:S.maxTier||0,helpCall:S.helpCall||null,history:(S.history||[]).slice(-200),seqIdx:S.seqIdx||0,savedAt:Date.now()};
    localStorage.setItem(SAVE_KEY,JSON.stringify(d));S.lastSaveAt=Date.now();if(!quiet)floatText(S.P.x,S.P.y-52,'💾 Saved','#a8e0a0');}catch(e){}
}
function saveInfo(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));if(!d)return null;return d;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
function loadGame(){
  const d=saveInfo();if(!d)return false;
  Object.assign(POWERS,d.hyb||{});
  newGame({diff:d.diff||'normal',story:d.story!==false});
  ['tier','baseHp','humanity','lives','maxLives','res','dna','slots','traits','gmods','vault','weapons','wpn','stats','mods','recipesFound','townLog','stateDone','path','choices','flags','evo','biomass','seen','gday','maxTier','helpCall'].forEach(k=>{if(d[k]!==undefined)S[k]=d[k];});
  S.crew=d.crew||[];S.vanceGone=!!d.vanceGone;S.day=d.day||1;S.clock=0;S.night=false;
  loadTown(d.town);makeBaseInterior();S.history=d.history||[];S.ruined=!!d.ruined;S.defs=d.defs||{};S.maxTown=Math.max(d.maxTown||0,d.town||0);S.seqIdx=d.seqIdx||0;
  if(d.truck&&S.truck){S.truck.fuel=d.truck.fuel||0;Object.keys(d.truck.parts||{}).forEach(k=>{if(S.truck.parts[k]===undefined)return;const st=d.truck.parts[k];S.truck.parts[k]=st;if(st!=='missing')Object.values(S.interiors).forEach(I=>I.props.forEach(p=>{if(p.part===k)delete p.part;}));});}if(d.windows)S.windows.forEach((w,i)=>w.hp=d.windows[i]||w.hp);
  if(d.vance)spawnVance();
  if(d.mode==='monster'){S.mode='monster';S.nestHp=NEST_MAX;S.nestDead=false;S.night=true;setupMonsterTown();}
  else{const B=S.baseInt;teleport(S.P,B.x+B.w/2,B.y+B.h/2,'base');S.P.hp=maxHp();}
  banner('WELCOME BACK',TOWNS[S.town].name+', day '+S.day+'. Your progress was saved at the last dawn or the last time you went home.','#7dff9a');
  return true;
}
// ---------- gamepad ----------
const PAD={prev:[],held:{},ax:false};
function focusMove(dir){const list=[...ov.querySelectorAll('button:not([disabled])')];if(!list.length)return;let i=list.indexOf(document.activeElement);i=(i+dir+list.length)%list.length;list[i].focus();}
function pollPad(){
  const gps=navigator.getGamepads?navigator.getGamepads():[];const gp=gps&&gps[0];if(!gp)return;
  const b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed),edge=i=>b(i)&&!PAD.prev[i];
  const ax=gp.axes[0]||0,ay=gp.axes[1]||0,dz=.3;
  if(ovMode){
    const seq=S&&S.seq&&!S.seq.done&&S.panel==='genome'&&S.gtab==='seq';
    if(seq){if(edge(0))seqPress('A');if(edge(1))seqPress('T');if(edge(2))seqPress('G');if(edge(3))seqPress('C');}
    else{if(edge(1)&&ovMode==='panel')hideOv();if(edge(0)){const f=document.activeElement;if(f&&ov.contains(f)&&f.click)f.click();else focusMove(1);}}
    const lr=Math.abs(ax)>.6||Math.abs(ay)>.6;if(lr&&!PAD.ax)focusMove(ax>.6||ay>.6?1:-1);PAD.ax=lr;
    if(edge(14)||edge(12))focusMove(-1);if(edge(15)||edge(13))focusMove(1);
    if(edge(9)&&ovMode==='panel')hideOv();
  }else if(S&&(S.mode==='hunter'||S.mode==='monster')){
    const set=(k,on)=>{if(on){keys[k]=true;PAD.held[k]=true;}else if(PAD.held[k]){keys[k]=false;PAD.held[k]=false;}};
    set('w',ay<-dz);set('s',ay>dz);set('a',ax<-dz);set('d',ax>dz);set(' ',b(7)||b(6));set('e',b(0));
    const rx=gp.axes[2]||0,ry=gp.axes[3]||0;if(Math.hypot(rx,ry)>.35){S.padAim=Math.atan2(ry,rx);S.padAimT=performance.now();}
    if(edge(0))interact();if(edge(2))castSlot(0);if(edge(3))castSlot(1);if(edge(1))castSlot(2);
    if(edge(4))cycleWeapon();if(edge(5))useMeds();if(edge(8))openGenome();if(edge(9))openMenu();if(edge(12))openMap();if(edge(13))openJournal();
  }
  PAD.prev=gp.buttons.map(x=>x.pressed);
}
addEventListener('gamepadconnected',()=>{if(S&&S.mode!=='title')toast('Gamepad connected: left stick moves, right stick aims, RT attacks, A interacts, X/Y/B use powers, LB switches weapon, Back opens DNA, Start pauses.');});
