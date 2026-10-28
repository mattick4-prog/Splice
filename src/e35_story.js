// ================= THE STORY, ALL THE WAY AROUND THE WORLD =================
// The secret, revealed a piece at a time:
//   Before the world broke, a lab called the SPLICE PROJECT built the Gene-O-Matic to cure every disease by borrowing animal DNA.
//   Patient Zero was the first test subject. YOU were the second. The machine worked too well. Your memory was wiped,
//   and the journals "in your handwriting" are yours, from before. Vance was a project guard who was told to stop you.
//   The project shipped DNA "seed vaults" around the world. Every country's monsters grew from one.
//   Apophis, under the Great Pyramid, is the oldest splice of all: the Source the Signal was calling from.
// Every big choice now has a 💉 Cure option (help people, stay human) and a 🧬 Brood option (change them, gain power),
// plus a 🤝 Vance option once he trusts you.
const ROAD_TAG={cure:'💉 Cure road',brood:'🧬 Brood road',split:'🤝 Splicer'};
function storyCure(n,key){S.cure=S.cure||{};for(let i=0;i<n;i++)cureGain('story_'+key+'_'+i);}
function vanceOk(){return S.choices.vance==='ally'&&S.vance&&!S.vanceGone;}
Object.assign(CHOICES,{
  ship:{town:8,title:'The Lab Ship',text:'Inside the Kraken\'s wreck is a research ship: <b>SPLICE-1</b>. In the captain\'s cabin there\'s an ID badge with a photo on it. It\'s <em>your</em> face. Under it: "Test Subject #2". Two lockers are still sealed.',
    opts:[{id:'notes',road:'cure',label:'Open the locker of vaccine notes',eff:'Cure road +2. You learn how they planned to fix all this.'},
      {id:'seeds',road:'brood',label:'Open the locker of DNA seeds',eff:'Brood road +2 and 3 rare DNA strands. Humanity −10.'},
      {id:'vance',road:'split',label:'Show Vance the badge',need:vanceOk,needTxt:'Needs Vance as your ally',eff:'He goes very quiet. "I knew you before," he says. Splicer +3.'}]},
  factory:{town:14,title:'The Vaccine Factory',text:'Deep in the Foundry is a whole factory built to make one thing: the cure. The machines are cold, but they still work. A sign on the wall says <b>SPLICE PROJECT · PHASE 3</b>.',
    opts:[{id:'restart',road:'cure',label:'Restart the factory for the survivors',eff:'Cure road +2, +10 humanity, every camp here trusts you more.'},
      {id:'hatchery',road:'brood',label:'Turn it into a hatchery',eff:'Brood road +3 and +5 mutagen. Humanity −20.'}]},
  train:{town:15,title:'The Last Train',text:'With the Ghost Train gone, a real train is idling in the yard. Forty survivors are huddled in the cars, too scared to move. The tracks run west, all the way to the sea.',
    opts:[{id:'escort',road:'cure',label:'Drive them to safety',eff:'Cure road +1, +1 life, and they spread word of you everywhere.'},
      {id:'ride',road:'brood',label:'Let your brood ride it west',eff:'Brood road +2. Your kind will be waiting in every town ahead.'}]},
  zero:{town:17,title:'Patient Zero',text:'Patient Zero is dying in the ruins of the first lab. "I was the first," it whispers. "You were the second. They wiped your memory so you could try again. The cure and the hive are in my blood. Take one."',
    opts:[{id:'cure',road:'cure',label:'Make a cure from its blood',eff:'Cure road +3 and the Antiserum, even if you haven\'t earned it yet.'},
      {id:'crown',road:'brood',label:'Take its place as the first',eff:'Brood road +3. Monsters across the sea hear your name. Humanity −25.'},
      {id:'burn',road:'split',label:'Burn the lab with Vance',need:vanceOk,needTxt:'Needs Vance as your ally',eff:'No one gets to do this again. Splicer +3, +1 life.'}]},
  cocoons:{town:18,title:'The Silk Village',text:'The Spider Bride kept a whole village wrapped in silk. Some of the cocoons are still breathing. Some of them are… moving. Changing.',
    opts:[{id:'free',road:'cure',label:'Cut them all free',eff:'Cure road +1, +8 humanity. Some of them are sick: they need care.'},
      {id:'hatch',road:'brood',label:'Let them finish hatching',eff:'Brood road +2. Some of them will hatch loyal to you.'}]},
  tower:{town:20,title:'The Neo Edo Lab',text:'The top floor of the tallest tower is a second Splice lab. Its radio can reach every camp on Earth. One switch, one message.',
    opts:[{id:'vaccine',road:'cure',label:'Broadcast your vaccine recipe',eff:'Cure road +2. Every camp you ever meet starts out trusting you more.'},
      {id:'call',road:'brood',label:'Broadcast the brood call',eff:'Brood road +2. Your packs grow bigger.'}]},
  clan:{town:23,title:'The Old Clan',text:'Up in the hills, a clan has lived beside the monsters for two hundred years. They keep them calm with herbs and a song. "Which one do you want to learn?" the old woman asks.',
    opts:[{id:'herbs',road:'cure',label:'Learn the herbs',eff:'Cure road +1. Suppressant shots give +10 more humanity.'},
      {id:'song',road:'brood',label:'Learn the song',eff:'Brood road +1. Your pack can hold 2 more monsters.'}]},
  archive:{town:24,title:'The Ghost Archive',text:'The Grey Lady guarded an archive of the Splice Project. One folder has Vance\'s photo in it. He was a project guard. His last order: <em>"If Subject #2 wakes up, stop it."</em>',
    opts:[{id:'forgive',road:'split',label:'Forgive Vance',need:()=>S.choices.vance&&S.choices.vance!=='fight',needTxt:'You and Vance need to be on speaking terms',eff:'Splicer +3. If he left, he comes back.'},
      {id:'records',road:'cure',label:'Take the medical records',eff:'Cure road +2. The project\'s own notes on how to undo it.'},
      {id:'sample',road:'brood',label:'Take the frozen sample',eff:'Brood road +2, and one of your powers jumps to mastery.'}]},
  river:{town:26,title:'The Weeping River',text:'La Llorona\'s river runs through every village in the valley. It\'s full of loose DNA. Every family that drinks from it is changing, slowly.',
    opts:[{id:'filter',road:'cure',label:'Build filters in every village',eff:'Cure road +2, +6 humanity.'},
      {id:'seed',road:'brood',label:'Seed the river with your DNA',eff:'Brood road +3. The whole valley will grow up like you.'}]},
  parade:{town:28,title:'The Parade of the Lost',text:'The survivors hold a parade for everyone they lost, with candles and painted skulls. The monsters watch from the rooftops. So do you.',
    opts:[{id:'guard',road:'cure',label:'Guard the parade all night',eff:'Cure road +1, +1 life, and every camp here trusts you completely.'},
      {id:'join',road:'brood',label:'Walk in it with your true face',eff:'Brood road +2. They decide monsters can be family too. Camps stop fearing your changes.'}]},
  tomb:{town:30,title:'The First Splice',text:'Under the Pharaoh\'s tomb is a wall painting of a man with a jackal\'s head, a falcon\'s wings, a crocodile\'s jaw. It\'s 4,000 years old. Splicing is not new. Someone did this before, and something went wrong.',
    opts:[{id:'seal',road:'cure',label:'Seal the tomb forever',eff:'Cure road +2, +8 humanity.'},
      {id:'open',road:'brood',label:'Open the sarcophagus',eff:'Brood road +3 and a burst of ancient DNA. Humanity −20.'}]},
  source:{town:32,title:'The Source',text:'Under the Great Pyramid, something huge is breathing. Apophis, the World Serpent: the very first splice, the thing the Signal was calling from. Whatever you bring down there decides how the world ends.',
    opts:[{id:'cure',road:'cure',label:'Bring the Cure',need:()=>cureN()>=6,needTxt:'Needs the Cure road at 6+',eff:'You will try to heal the Source itself.'},
      {id:'brood',road:'brood',label:'Bring the Brood',need:()=>broodN()>=6,needTxt:'Needs the Brood road at 6+',eff:'You will take its place.'},
      {id:'vance',road:'split',label:'Bring Vance',need:vanceOk,needTxt:'Needs Vance as your ally',eff:'Two old enemies, one last job.'},
      {id:'alone',label:'Go alone',eff:'Just you, and whatever you\'ve become.'}]}
});
// add road tags to every option, old and new, so the choice is always clear
(function(){const tag={heart:{absorb:'brood',destroy:'cure',share:'split'},crown:{wear:'brood',bury:'cure',give:'split'},well:{poison:'brood',clean:'cure'},signal:{answer:'brood',cut:'cure',record:'split'},vance:{ally:'split',refuse:'cure',fight:'brood'}};
  for(const k in tag)CHOICES[k].opts.forEach(o=>{o.road=tag[k][o.id];});})();
{const _sc=showChoice;showChoice=function(key){_sc(key);const C=CHOICES[key];if(!C)return;
  ov.querySelectorAll('[data-a="choice"]').forEach(b=>{const o=C.opts.find(x=>x.id===b.dataset.o);if(o&&o.road){const t=document.createElement('span');t.className='rtag '+o.road;t.textContent=ROAD_TAG[o.road];b.prepend(t);}});
  const p=ov.querySelector('.card.story p');if(p)p.innerHTML=C.text;};}
{const _ac=applyChoice;applyChoice=function(key,o){const P=S.path,C=CHOICES[key];if(!C||C.town===undefined){_ac(key,o);return;}
  S.choices[key]=o;const opt=C.opts.find(x=>x.id===o)||{};
  if(opt.road==='cure')P.hunter+=2;else if(opt.road==='brood')P.apex+=2;else if(opt.road==='split')P.splicer+=3;
  const H=n=>{S.humanity=clamp(S.humanity+n,0,100);if(n<0)humanityHit(0);},life=()=>{S.lives=Math.min(S.maxLives+1,S.lives+1);};
  const fx={
    ship:{notes:()=>storyCure(2,key),seeds:()=>{broodGain(2);H(-10);for(let i=0;i<3;i++)if(S.vault.length<vaultCap())S.vault.push({id:Math.random(),gene:pick(Object.keys(POWERS).filter(k=>!POWERS[k].hybrid)),q:'pure',val:30,age:0});},vance:()=>{}},
    factory:{restart:()=>{storyCure(2,key);H(10);S.camps.forEach(c=>campRep(c,15,'"The factory is running again. Because of you."'));},hatchery:()=>{broodGain(3);S.res.mutagen+=5;H(-20);}},
    train:{escort:()=>{storyCure(1,key);life();},ride:()=>broodGain(2)},
    zero:{cure:()=>{storyCure(3,key);S.cure=S.cure||{};while(cureN()<6)cureGain('zero_'+cureN());},crown:()=>{broodGain(3);H(-25);},burn:()=>life()},
    cocoons:{free:()=>{storyCure(1,key);H(8);},hatch:()=>broodGain(2)},
    tower:{vaccine:()=>{storyCure(2,key);S.flags.broadcast=true;},call:()=>{broodGain(2);S.flags.bigPack=(S.flags.bigPack||0)+1;}},
    clan:{herbs:()=>{storyCure(1,key);S.flags.herbs=true;},song:()=>{broodGain(1);S.flags.bigPack=(S.flags.bigPack||0)+2;}},
    archive:{forgive:()=>{if(!S.vance){spawnVance();S.vanceGone=false;S.choices.vance='ally';banner('VANCE IS BACK','"I was wrong about you," he says.','#7fd6ff');}},records:()=>storyCure(2,key),
      sample:()=>{broodGain(2);const own=Object.keys(S.dna).filter(k=>POWERS[k]&&!POWERS[k].hybrid&&S.dna[k]>=40);if(own.length){const k=pick(own);S.dna[k]=150;toast('🧬 '+POWERS[k].name+' jumps to mastery.','mem');}}},
    river:{filter:()=>{storyCure(2,key);H(6);},seed:()=>broodGain(3)},
    parade:{guard:()=>{storyCure(1,key);life();S.camps.forEach(c=>campRep(c,40,'"You guarded our parade all night."'));},join:()=>{broodGain(2);S.flags.familyFace=true;}},
    tomb:{seal:()=>{storyCure(2,key);H(8);},open:()=>{broodGain(3);H(-20);Object.keys(S.dna).forEach(k=>{if(POWERS[k]&&!POWERS[k].hybrid&&S.dna[k]>=40)S.dna[k]=Math.min(150,S.dna[k]+20);});}},
    source:{cure:()=>{S.flags.finale='cure';},brood:()=>{S.flags.finale='brood';},vance:()=>{S.flags.finale='split';},alone:()=>{S.flags.finale='alone';}}
  }[key];if(fx&&fx[o])fx[o]();
  toast(opt.road?ROAD_TAG[opt.road]+' chosen.':'Choice made.','mem');};}
// story perks from choices
{const _pk=packCap;packCap=function(){return _pk()+(S.flags.bigPack||0);};}
{const _vc=visibleChanges;visibleChanges=function(){return S.flags.familyFace&&countryOf(S.town)===3?0:_vc();};}
{const _act=act;act=function(a,d){if(a==='supp'&&S.flags.herbs&&S.res.meds>=2){const h=S.humanity;_act(a,d);if(S.humanity>h)S.humanity=Math.min(100,S.humanity+10);return;}_act(a,d);};}
{const _mc=makeCamps;makeCamps=function(){const out=_mc();if(S&&S.flags&&S.flags.broadcast)out.forEach(c=>c.rep=(c.rep||0)+15);return out;};}
// when the choices happen
{const _ab=afterBossStory;afterBossStory=function(){_ab();if(S.mode!=='hunter'||!S.story)return;const key=Object.keys(CHOICES).find(k=>CHOICES[k].town===S.town&&k!=='zero');if(key&&!S.choices[key])setTimeout(()=>{if(S&&!ovMode)showChoice(key);else if(S)S.pendingChoice=key;},400);};}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(S.pendingChoice&&!ovMode&&S.mode==='hunter'){const k=S.pendingChoice;S.pendingChoice=null;showChoice(k);}};}
// country arrival stories (and Patient Zero's choice, which comes right after Ground Zero)
const COUNTRY_STORY={1:['🇯🇵 Japan','The ferry radio crackles the whole way across the sea. The Splice Project shipped a "seed vault" here years ago. Whatever grew from it learned to look like the old stories: spider brides, sea monks, skeleton giants.','Find out what happened to Japan\'s seed vault.'],
  2:['🏴 Scotland','Fog, castles, and a clan that says the monsters here are older than anyone remembers. The Signal is louder in the hills. Somebody here knows who you used to be.','Learn what the Splice Project hid in the Highlands.'],
  3:['🇲🇽 Mexico','The river towns light candles every night for the people they\'ve lost. The monsters here walk in the old legends\' shapes: the weeping woman, the ghost dog, the skeleton king.','Follow the river to the temple.'],
  4:['🇪🇬 Egypt','Sand, heat, and the oldest buildings on Earth. The Signal doesn\'t crackle here. It sings. Whatever started all of this is waiting under the Great Pyramid.','Reach the Source.']};
function countryCard(ci){const [nm,txt,goal]=COUNTRY_STORY[ci];
  showOv(`<div class="card story"><div class="eyebrow">A new country · Your path: ${pathName()}</div><h1 style="font-size:clamp(40px,7vw,76px);color:var(--gold)">${nm}</h1><p>${txt}</p><p><b>🎯 ${goal}</b></p>
    <div class="roadmini">💉 Cure <b>${cureN()}/10</b> · 🧬 Brood <b>${broodN()}/10</b></div><button class="btn big" data-a="storyok">Go</button></div>`,'story');}
{const _a=arriveTown;arriveTown=function(...args){const prevC=countryOf(S.town),prevT=S.town;const r=_a(...args);if(!S.story||S.mode!=='hunter')return r;const ci=countryOf(S.town);
  if(ci!==prevC&&COUNTRY_STORY[ci]&&!S.flags['cs'+ci]){S.flags['cs'+ci]=true;S.pendingCountry=ci;S.pendingCountryT=S.t+2.6;}
  if(prevT===17&&!S.choices.zero)S.zeroNext=true;
  return r;};}
{const _pa=pollAutosave;pollAutosave=function(dt){_pa(dt);if(ovMode||S.mode!=='hunter')return;
  if(S.pendingCountry!=null&&S.t>=(S.pendingCountryT||0)){const ci=S.pendingCountry;S.pendingCountry=null;countryCard(ci);return;}
  if(S.zeroNext&&S.pendingCountry==null){S.zeroNext=false;showChoice('zero');}};}
{const _act=act;act=function(a,d){if(a==='storyok'){hideOv();if(S.zeroNext){S.zeroNext=false;showChoice('zero');}return;}_act(a,d);};}
// chapter goals for the new story beats
CHAPTERS.forEach(ch=>{const key=Object.keys(CHOICES).find(k=>CHOICES[k].town===ch.town&&k!=='zero');if(key)ch.goals.splice(1,0,['Decide: '+CHOICES[key].title,()=>!!S.choices[key]]);});
{const ch=CHAPTERS.find(c=>c.town===18);if(ch)ch.goals.unshift(['Decide: Patient Zero',()=>!!S.choices.zero]);}
// state cards get real story text
{const _st=storyStateText;storyStateText=function(si){const p=pathName();
  const T={2:'The Tidal Warden sinks into the bay. Painted on its shell, under the barnacles: <b>SPLICE PROJECT · UNIT 3</b>. The Wardens weren\'t monsters that grew wild. They were built to guard something.',
    3:'The Rust Warden melts into its own furnace. Inside its chest plate is a list of test subjects. Two names are crossed out. The second one is yours.',
    4:'Patient Zero\'s Warden is gone. All that\'s left is the first lab, and the thing dying inside it.'}[si];
  return T?`<p>${T}</p><p>Your path so far: <b style="color:var(--gold)">${p}</b> · 💉 ${cureN()}/10 · 🧬 ${broodN()}/10</p>`:_st(si);};}
// endings follow the two roads
{const _ww=showWorldWin;showWorldWin=function(){_ww();if(!S.story)return;const c=cureN(),b=broodN(),f=S.flags.finale;
  const end=(f==='split'||(S.cureDone&&S.broodDone))?['The Splicer Ending','You walk into the dark with Vance at your side and come out with both: a cure for the people who want it, and a home for the ones who changed. The world isn\'t fixed. It\'s <em>shared</em>.']
    :(f==='cure'||(c>=b&&c>=6))?['The Cure Ending','You pour every vaccine you ever made into the Source. Apophis shudders, shrinks, and turns back into a very old, very tired snake. All over the world, people wake up from the change. Somebody hands you a coffee. It is the best thing you have ever tasted.']
    :(f==='brood'||b>c)?['The Brood Ending','You take the Source\'s place in the dark. Every monster on Earth turns toward the pyramid at once, and waits for you to tell them where to go. The old world is over. Yours is just starting.']
    :['The Lone Ending','You beat the Source alone, and walk back out into the sun still not sure what you are. Maybe that\'s the most human thing of all.'];
  const card=ov.querySelector('.card.story');if(card){const p=card.querySelector('p:nth-of-type(2)');if(p)p.innerHTML=`<b style="font-size:22px;color:var(--gold)">${end[0]}.</b> ${end[1]}<br><span class="mute">💉 Cure ${c}/10 · 🧬 Brood ${b}/10 · path: ${pathName()}</span>`;}};}
// the journal tells the story so far
const STORY_LOG=[['ship','You were Test Subject #2.'],['factory','The project built a vaccine factory.'],['zero','Patient Zero was the first. You were the second.'],['tower','The Neo Edo lab can talk to the whole world.'],['archive','Vance was ordered to stop you.'],['tomb','People were splicing 4,000 years ago.'],['source','The Source is under the Great Pyramid.']];
{const _jh=journalHtml;journalHtml=function(){const h=_jh();if(!S.story)return h;const got=STORY_LOG.filter(([k])=>S.choices[k]);
  const box=`<section style="margin:10px 0"><h3>🗝️ What you know</h3>${got.length?got.map(([k,t])=>`<div class="act"><div>📄 ${t}<small>${CHOICES[k].title}: you chose ${ROAD_TAG[(CHOICES[k].opts.find(o=>o.id===S.choices[k])||{}).road]||'your own way'}</small></div></div>`).join(''):'<p class="mute" style="margin:0">Nothing yet. The truth about you is out there, one town at a time.</p>'}</section>`;
  const i=h.lastIndexOf('<section');return i<0?h:h.slice(0,i)+box+h.slice(i);};}
(function(){const st=document.createElement('style');st.textContent=`.rtag{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.5px;border-radius:6px;padding:1px 6px;margin-right:8px;vertical-align:middle}.rtag.cure{background:#7dff9a;color:#123}.rtag.brood{background:#c27bff;color:#201}.rtag.split{background:#7fd6ff;color:#123}
.roadmini{background:#0005;border-radius:10px;padding:6px 10px;margin:6px 0 10px;display:inline-block}`;document.head.appendChild(st);})();
