// ================= THE BIG BUILD: COAST, RUST BELT, GROUND ZERO, JAPAN, SCOTLAND, MEXICO, EGYPT =================
// --- fixes to older data ---
(function(){const i=BLD3.findIndex((b,k)=>b.id==='plow'&&BLD3.findIndex(x=>x.id==='plow')!==k);if(i>=0)BLD3.splice(i,1);
  const g=BLD5.find(b=>b.id==='garage');if(g)g.id='parkgarage';THEMES.parkgarage=THEMES.garage;})();
// --- two new power families ---
FAM.spirit={name:'Spirit',color:'#ff9ad0',icon:'🏮'};FAM.sun={name:'Sun & Sand',color:'#ffcc4a',icon:'☀️'};
def('spirit','foxfire','Foxfire','🦊',5,'Three ghostly fox flames chase enemies and set them burning.',[{t:'bolt',n:3,spread:.35,homing:true,dmg:14,spd:380,range:480,st:'burn'}]);
def('spirit','galeslash','Gale Slash','🌪️',4,'A wind blade slices everything in front of you and slows it.',[{t:'cone',r:120,arc:.7,dmg:24,st:'slow'}]);
def('spirit','lanterns','Spirit Lanterns','🏮',12,'Floating lanterns follow you, scaring enemies and healing you a little.',[{t:'zone',follow:true,r:100,dps:10,life:6,st:'fear'},{t:'heal',amt:20}]);
def('spirit','trickster','Trickster','🎭',9,'Vanish to where you aim and leave a decoy behind.',[{t:'summon',look:'decoy',n:1,hp:60,dmg:0,life:5,taunt:true},{t:'teleport',dist:200}]);
def('spirit','spiritchain','Spirit Chain','⛓️',6,'A chain of spirit light jumps between enemies and slows them.',[{t:'chain',n:4,dmg:20,st:'slow'}]);
def('spirit','hyakki','Night Parade','👹',40,'A hundred spirits rain down on every enemy nearby.',[{t:'strikes',n:12,dmg:28,st:'fear'}],true);
def('sun','sunbeam','Sunbeam','🌞',6,'A blazing beam of sunlight that burns and heals you a little.',[{t:'beam',range:300,dmg:36,heal:10}]);
def('sun','sandstorm','Sandstorm','🏜️',12,'A sandstorm follows you, slowing and grinding enemies.',[{t:'zone',follow:true,r:130,dps:9,life:6,st:'slow'}]);
def('sun','scarabs','Scarab Swarm','🪲',12,'Three golden scarabs fight beside you.',[{t:'summon',look:'bee',n:3,hp:25,dmg:7,spd:200,life:10}]);
def('sun','wraps','Mummy Wraps','🧻',7,'Leap and wrap everything you land on so it can\'t move.',[{t:'leap',dist:220,r:90,dmg:24,st:'stun'}]);
def('sun','solarflare','Solar Flare','☀️',7,'Burst into sunlight, burning everything around you.',[{t:'nova',r:160,dmg:26,st:'burn'}]);
def('sun','ra','Eye of Ra','👁️',40,'The sun god opens its eye. Every enemy on screen burns.',[{t:'screen',dmg:30,st:'burn'}],true);
Object.assign(RECIPES,{
  'fire|spirit':{name:'Fox Inferno',icon:'🦊🔥',cd:9,desc:'A ring of fox flames bursts out and keeps burning.',fx:[{t:'nova',r:160,dmg:28,st:'burn'},{t:'zone',r:140,life:4,dps:12,st:'burn',kind:'fire'}]},
  'spirit|water':{name:'Kappa Flood',icon:'🐢',cd:10,desc:'A spirit wave that slows everything it hits.',fx:[{t:'wave',dmg:30},{t:'zone',r:150,life:4,dps:6,st:'slow'}]},
  'sun|toxic':{name:'Pharaoh\'s Curse',icon:'⚱️',cd:10,desc:'Cursed sand poisons every enemy around you.',fx:[{t:'nova',r:170,dmg:22,st:'poison'},{t:'zone',follow:true,r:120,dps:10,life:5,st:'poison'}]},
  'metal|sun':{name:'Pyramid Wall',icon:'🔺',cd:11,desc:'Golden stone walls burst up in a line.',fx:[{t:'line',n:6,gap:40,r:32,dps:14,life:5,st:'stun'}]},
  'mind|spirit':{name:'Haunting',icon:'👻',cd:10,desc:'Every nearby enemy is terrified and hurt.',fx:[{t:'nova',r:200,dmg:18,st:'fear'}]},
  'beast|sun':{name:'Sphinx Pounce',icon:'🦁',cd:7,desc:'A golden pounce that stuns where you land.',fx:[{t:'leap',dist:260,r:110,dmg:34,st:'stun'}]}
});
// --- monster helpers ---
const M_=(name,power,hp,spd,dmg,r,color,eye,genes,shape,abs,extra)=>Object.assign({name,power,hp,spd,dmg,r,color,eye,genes,shape,abs:abs||[]},extra||{});
const MIN=(name,power,hp,color,eye,genes,shape)=>({name,power,hp,spd:120,dmg:5,r:10,color,eye,genes,shape:shape||'spiky',minion:true});
function BOSS(base,name,color,eye,hp,genes,minionType,extra){const b=MONSTERS[base];return Object.assign({},b,{name,color,eye,hp,genes,minionType,boss:true},extra||{});}
function WARDEN(base,name,color,eye,hp,genes,minionType,dmg){const b=MONSTERS[base];return Object.assign({},b,{name,color,eye,hp,genes,minionType,boss:true,warden:true,dmg:dmg||b.dmg});}
const SH=(spd,dmg,col,extra)=>Object.assign({k:'shoot',cd:2.6,spd,dmg,col},extra||{}),NV=(r,dmg,col,extra)=>Object.assign({k:'nova',cd:5,r,dmg,col},extra||{}),ZN=(r,dps,col,extra)=>Object.assign({k:'zone',cd:5,r,dps,col},extra||{});
Object.assign(MONSTERS,{
  // The Coast
  crusher:M_('Hermit Crusher','bubble',150,50,16,24,'#d8704a','#ffd166',['bubble','ironfist','thickhide'],'brute',[NV(100,12,'#9fe8ff',{stun:.6})]),
  eel:M_('Shock Eel','riptide',70,115,10,15,'#3a8a9a','#d6ff70',['riptide','chain','swift'],'serpent',[SH(420,9,'#7fd6ff',{homing:1})]),
  gull:M_('Gull Swarm','lure',55,135,8,14,'#e8ecf0','#ffb347',['lure','pounce','swift'],'bird',[{k:'dash',cd:3,spd:560}]),
  sailor:M_('Drowned Sailor','tar',95,70,13,18,'#4a6a6a','#bff0ff',['tar','hex','bogskin'],'wraith',[ZN(80,7,'#2a4a3a'),{k:'hex',cd:7}]),
  jelly:M_('Jelly Drifter','staticfield',70,60,9,18,'#c8a8ff','#ffffff',['staticfield','geyser','glow'],'blob',[NV(110,10,'#c8a8ff',{stun:.5})]),
  lobster:M_('Siege Lobster','snap',140,75,17,22,'#c83a2a','#111111',['snap','charge','thickhide'],'quad',[{k:'dash',cd:3.5,spd:600}]),
  crabling:MIN('Crabling','snap',26,'#e88a5a','#ffd166',['snap','bubble']),
  tidemother:BOSS('queen','The Tide Mother','#2a7a9a','#d6ff70',1500,['wave','whirlpool'],'crabling'),
  kraken:BOSS('queen','The Harbor Kraken','#7a3a5a','#ffd166',1650,['riptide','tar'],'crabling'),
  barnacle:BOSS('king','Captain Barnacle','#5a6a5a','#ff6a5a',1800,['geyser','ironfist'],'crabling'),
  ringmaster:BOSS('broadcast','The Ringmaster','#c83a6a','#ffd166',1900,['puppet','confusion'],'gull'),
  warden3:WARDEN('warden2','The Tidal Warden','#1a4a6a','#7fd6ff',3200,['wave','riptide','stormcall','titan'],'crabling',32),
  // The Rust Belt
  slag:M_('Slag Golem','napalm',170,40,18,26,'#5a3a2a','#ff7a2f',['napalm','boulder','firewalker'],'golem',[NV(110,14,'#ff7a2f',{kind:'fire'})]),
  drone:M_('Rust Drone','balllightning',60,130,9,14,'#8a6a4a','#7fd6ff',['balllightning','overcharge','glow'],'bird',[SH(440,9,'#7fd6ff',{homing:1})]),
  smog:M_('Smog Wraith','miasma',80,85,11,17,'#6a6a5a','#d6ff70',['miasma','toxicburst','toxicblood'],'wraith',[ZN(90,8,'#8a8a5a',{kind:'tar'}),{k:'invis'}]),
  gear:M_('Gearbeast','charge',150,80,17,22,'#8a8a92','#ffb347',['charge','spikewall','thickhide'],'quad',[{k:'dash',cd:3.2,spd:620}]),
  welder:M_('Welder','firewall',120,65,15,20,'#4a5a6a','#ff7a2f',['firewall','ironfist','firewalker'],'brute',[SH(380,10,'#ff7a2f',{kind:'fire'})]),
  mite:M_('Magnet Mite','metal',65,110,10,15,'#7a7e86','#ff4d5e',['metal','resonance','swift'],'bug',[{k:'leap',cd:4}]),
  scrapling:MIN('Scrapling','metal',28,'#8a8a92','#ff7a2f',['metal','spikewall']),
  furnace:BOSS('scorpion','The Furnace','#7a2a1a','#ffd166',2000,['inferno','napalm'],'scrapling'),
  ironpress:BOSS('king','The Iron Press','#5a5e66','#ff4d5e',2150,['titan','quake'],'scrapling'),
  crucible:BOSS('scorpion','The Crucible','#a8421a','#fff2a0',2300,['firewall','boulder'],'scrapling'),
  ghosttrain:BOSS('broadcast','The Ghost Train','#3a3a4a','#bff0ff',2400,['overcharge','nightfall'],'drone'),
  warden4:WARDEN('warden2','The Rust Warden','#4a3a2a','#ff7a2f',3800,['titan','inferno','stormcall','hivemind'],'scrapling',36),
  // Ground Zero
  source:WARDEN('warden2','Patient Zero','#2a1a2a','#ff3b5c',5200,['eclipse','dominate','pandemic','phoenix'],'brat',42),
  // Japan
  kappa:M_('Kappa','whirlpool',110,70,13,18,'#4a8a4a','#ffd166',['whirlpool','snap','bogskin'],'blob',[ZN(90,8,'#5fd3e8')]),
  kitsune:M_('Kitsune','foxfire',80,125,12,16,'#ff9a4a','#ffffff',['foxfire','trickster','swift'],'quad',[SH(400,10,'#ff9ad0',{homing:1}),{k:'invis'}]),
  oni:M_('Oni','galeslash',190,60,20,25,'#c83a3a','#ffd166',['galeslash','ironfist','thickhide'],'brute',[NV(110,16,'#ff9ad0',{stun:.6})]),
  tengu:M_('Tengu','galeslash',80,135,12,15,'#2a2a3a','#ff4d5e',['galeslash','shadowstep','springlegs'],'bird',[{k:'dash',cd:3,spd:600}]),
  yurei:M_('Yurei','lanterns',85,80,12,17,'#e8e8f0','#ff9ad0',['lanterns','ghost','nighteyes'],'wraith',[{k:'invis'},{k:'hex',cd:6}]),
  kumo:M_('Tsuchigumo','spiritchain',150,80,16,22,'#4a3a2a','#ff4d5e',['spiritchain','vines','toxicblood'],'bug',[{k:'leap',cd:3.5}]),
  hitodama:MIN('Hitodama','foxfire',30,'#9fd0ff','#ffffff',['foxfire','lanterns']),
  jorogumo:BOSS('queen','The Spider Bride','#6a2a4a','#ff9ad0',2600,['spiritchain','vines'],'hitodama'),
  umibozu:BOSS('queen','Umibozu','#1a2a3a','#ffffff',2750,['whirlpool','wave'],'hitodama'),
  gashadokuro:BOSS('king','Gashadokuro','#e8e0d0','#ff4d5e',2900,['hyakki','shatter'],'hitodama'),
  orochi:WARDEN('warden2','Yamata no Orochi','#3a5a2a','#ff4d5e',6000,['hyakki','foxfire','spiritchain','galeslash'],'hitodama',44),
  // Scotland
  kelpie:M_('Kelpie','riptide',120,125,14,19,'#2a4a5a','#bff0ff',['riptide','charge','swift'],'quad',[{k:'dash',cd:3,spd:620}]),
  boggart:M_('Boggart','hex',110,70,13,19,'#5a4a3a','#d6ff70',['hex','fearaura','bogskin'],'blob',[{k:'hex',cd:5},ZN(80,7,'#3a4a2a',{kind:'tar'})]),
  willwisp:M_('Will-o\'-Wisp','lanterns',55,130,9,12,'#bff0ff','#ffffff',['lanterns','glow','spiritchain'],'bird',[{k:'invis'},SH(420,9,'#bff0ff')]),
  sidhe:M_('Bean Sidhe','banshee',90,85,12,17,'#c8d0e0','#7fd6ff',['banshee','scream','nighteyes'],'wraith',[NV(140,10,'#f2dc7a',{stun:.9})]),
  redcap:M_('Redcap','hemorrhage',120,100,17,18,'#8a2a2a','#ffd166',['hemorrhage','snap','lifesteal'],'brute',[{k:'leap',cd:3.5}]),
  selkie:M_('Selkie','wave',100,90,12,18,'#6a7a8a','#ffffff',['wave','bubble','coldblood'],'serpent',[SH(400,10,'#5fd3e8')]),
  midge:MIN('Midge Cloud','locust',28,'#4a4a3a','#ff4d5e',['locust','swift'],'bug'),
  blackdog:BOSS('queen','The Black Shuck','#1a1a1a','#ff3b3b',3000,['howl','nightfall'],'midge'),
  stagking:BOSS('king','The Stag King','#6a4a2a','#d6ff70',3150,['charge','overgrowth'],'midge'),
  greylady:BOSS('broadcast','The Grey Lady','#a8b0b8','#bff0ff',3300,['banshee','ghost'],'willwisp'),
  nessie:WARDEN('warden2','The Loch Beast','#2a4a3a','#d6ff70',6800,['wave','titan','riptide','sonicboom'],'midge',46),
  // Mexico
  chupa:M_('Chupacabra','drain',100,130,14,16,'#5a6a4a','#ff3b3b',['drain','pounce','swift'],'quad',[{k:'leap',cd:3}]),
  nahual:M_('Nahual','howl',150,95,17,21,'#4a3a3a','#ffd166',['howl','shroud','nighteyes'],'brute',[{k:'invis'},{k:'dash',cd:4,spd:560}]),
  alux:M_('Alux','seedbomb',60,120,9,12,'#8a6a3a','#d6ff70',['seedbomb','confusion','luck'],'spiky',[SH(380,8,'#e6cf86',{n:3,spread:.25})]),
  calaca:M_('Calaca','shatter',110,85,14,18,'#f0e8d8','#ff9ad0',['shatter','fearaura','mindshield'],'wraith',[NV(110,12,'#f2dc7a',{stun:.6})]),
  lechuza:M_('Lechuza','umbral',75,140,11,15,'#3a3030','#ffd166',['umbral','scream','nighteyes'],'bird',[{k:'dash',cd:3,spd:600}]),
  serpiente:M_('Rattle Serpent','acidspit',110,100,14,17,'#a8823a','#ff4d3a',['acidspit','tongue','toxicblood'],'serpent',[SH(420,10,'#a6d65a')]),
  sombra:MIN('Sombrita','umbral',30,'#3a2a3a','#ff9ad0',['umbral','shroud']),
  llorona:BOSS('broadcast','La Llorona','#c8d8e8','#7fd6ff',3400,['banshee','riptide'],'sombra'),
  cadejo:BOSS('queen','El Cadejo','#2a2a2a','#ff3b3b',3550,['pounce','nightfall'],'sombra'),
  calavera:BOSS('king','Rey Calavera','#f0e0c0','#ff4d5e',3700,['shatter','dominate'],'sombra'),
  quetzal:WARDEN('warden2','The Feathered Serpent','#2a8a5a','#ffd166',7600,['stormcall','phoenix','tongue','hivemind'],'sombra',48),
  // Egypt
  mummy:M_('Mummy','wraps',180,55,18,22,'#d8c8a0','#7fd6ff',['wraps','plaguebite','regen'],'brute',[{k:'leap',cd:4}]),
  beetle:M_('Gold Beetle','scarabs',90,100,12,17,'#c8a020','#ffffff',['scarabs','acidspit','thickhide'],'bug',[{k:'summon',cd:7,type:'scarablet',n:2,max:5}]),
  jackal:M_('Jackal','pounce',95,140,13,16,'#3a2a1a','#ffd166',['pounce','howl','swift'],'quad',[{k:'leap',cd:3}]),
  asp:M_('Sun Asp','sunbeam',90,105,13,15,'#d8a020','#ff4d3a',['sunbeam','acidspit','firewalker'],'serpent',[SH(460,12,'#ffcc4a')]),
  sandwraith:M_('Sand Wraith','sandstorm',100,90,13,18,'#c8a070','#fff2a0',['sandstorm','shroud','firewalker'],'wraith',[ZN(100,8,'#c8a070'),{k:'invis'}]),
  sphinx:M_('Sphinxling','solarflare',140,90,15,20,'#d8b060','#7fd6ff',['solarflare','mindblast','mindshield'],'quad',[NV(120,13,'#ffcc4a',{kind:'fire'})]),
  scarablet:MIN('Scarablet','scarabs',24,'#e8c040','#ffffff',['scarabs'],'bug'),
  pharaoh:BOSS('king','The Risen Pharaoh','#c8a040','#7fd6ff',3800,['wraps','dominate'],'scarablet'),
  sobek:BOSS('queen','Sobek','#4a6a3a','#ffd166',3950,['whirlpool','snap'],'scarablet'),
  anubis:BOSS('broadcast','The Jackal Lord','#1a1a2a','#ffcc4a',4100,['solarflare','nightfall'],'jackal'),
  apophis:WARDEN('warden2','Apophis, the World Serpent','#3a1a4a','#ffcc4a',9000,['ra','eclipse','pandemic','titan'],'scarablet',52)
});
for(const t in MONSTERS){const m=MONSTERS[t];(m.genes||[]).forEach(g=>{if(!SRC[g]||(MONSTERS[SRCTYPE[g]]&&MONSTERS[SRCTYPE[g]].minion&&!m.minion)){SRC[g]=m.name;SRCTYPE[g]=t;}});}
Object.assign(MEMORY,{foxfire:'A memory surfaces: a paper lantern festival. Your hand in someone else\'s, sending wishes down a river.',sunbeam:'A memory surfaces: a museum trip, a gold mask behind glass, and you promising to see the real pyramids one day.'});
// --- town builder ---
const SLOTS=[[240,200,260,170],[930,130,230,150],[1620,160,230,230],[170,760,220,150],[2020,600,230,150],[420,1260,230,160],[1060,1330,320,190],[1640,1320,240,160]];
function mkTown(key,name,list,boss,lair,raid,lvl,biome,ground,patch,extra){
  const blds=list.map((b,k)=>{const [bn,mon,theme,roof,wall,sign]=b,id=key+'_'+k,[x,y,w,h]=SLOTS[k];THEMES[id]=THEMES[theme]||THEMES.hardware;return {id,name:bn,x,y,w,h,roof,wall,sign,monster:mon};});
  blds.push({id:key+'_lair',name:lair.replace(/^the /,'The '),x:2060,y:1000,w:200,h:200,monster:boss,boss:true,sign:MONSTERS[boss].eye});
  return Object.assign({name,blds,raid,boss,lair,outposts:blds.slice(0,6).map(b=>b.id),lvl,crate:.14,biome,ground,patch},extra||{});
}
const ARENA=(name,boss,raid,lvl,biome,ground,patch,extra)=>Object.assign({name,arena:true,blds:[],raid,boss,lair:name,outposts:[],lvl,crate:0,biome,ground,patch},extra||{});
const R=(a,b,c)=>[a,b,c];
const C_RAID=['crusher','eel','gull','sailor','jelly','lobster'],RB_RAID=['slag','drone','smog','gear','welder','mite'],JP=['kappa','kitsune','oni','tengu','yurei','kumo'],SC=['kelpie','boggart','willwisp','sidhe','redcap','selkie'],MX=['chupa','nahual','alux','calaca','lechuza','serpiente'],EG=['mummy','beetle','jackal','asp','sandwraith','sphinx'];
const pk=(arr,k)=>arr[k%arr.length];
function bl(names,raid,themes,cols){return names.map((n,k)=>[n,pk(raid,k),pk(themes,k),cols[k%cols.length][0],cols[k%cols.length][1],cols[k%cols.length][2]]);}
const COL_COAST=[['#3a6a8a','#e8e0d0','#2a7ab0'],['#c8483a','#f0e8d8','#d84a3a'],['#6a8a7a','#d8d8c8','#2a8a6a'],['#8a6a4a','#d8c8a8','#c08a3a']];
const COL_RUST=[['#5a4a42','#9a8a7a','#c8602a'],['#4a4e56','#8a8e96','#e8a020'],['#6a3a2a','#a8786a','#c83a2a'],['#3a3a3a','#7a7a72','#7fd6ff']];
const COL_JP=[['#3a2a2a','#f0e8d8','#c83a3a'],['#4a4a5a','#e8e0d0','#2a5ab0'],['#6a2a2a','#f4ecdc','#ff9ad0'],['#2a3a2a','#e0d8c8','#5a8a3a']];
const COL_SC=[['#4a4a4a','#b8b0a0','#5a8a3a'],['#3a4a3a','#c8c0b0','#2a6a8a'],['#5a3a2a','#d0c4b0','#8a3a3a'],['#4a4a5a','#a8a8a0','#c8a020']];
const COL_MX=[['#c8603a','#f0d8b8','#2aa06a'],['#a83a5a','#f4e0c8','#e8a020'],['#3a7a8a','#f0e8d0','#d84a3a'],['#c8a03a','#f0e0c0','#8a3ab0']];
const COL_EG=[['#c8a060','#f0e0c0','#2a6ab0'],['#a8804a','#e8d4a8','#c8a020'],['#8a6a3a','#e0c890','#2a8a8a'],['#c89050','#f4e4c4','#a83a2a']];
const NEW=[
  // ---- The Coast ----
  mkTown('drift','Driftwood',bl(['Surf Shack','Lifeguard Tower','Seashell Church','Boathouse','Pier Arcade','Fish Market','Driftwood Elementary','Beach Motel'],C_RAID,['bait','ranger','chapel','cannery','electro','market','school','motel'],COL_COAST),'tidemother','the Tide Pools',C_RAID,2.7,'coast','#c8b888','#d8c898',{country:0}),
  mkTown('grey','Port Grey',bl(['Harbor Office','Net Loft','Lighthouse Keeper\'s House','Ice House','Ship Chandler','Seamen\'s Mission','Boatyard','Sardine Cannery'],C_RAID,['sheriff','cannery','tcabin','plow','hardware','dchurch','plow','cannery'],COL_COAST),'kraken','the Sunken Pier',C_RAID,2.8,'coast','#a8a898','#b8b8a8',{country:0}),
  mkTown('docks','Bayview: The Docks',bl(['Container Yard','Customs House','Dry Dock','Crane Tower','Warehouse 9','Union Hall','Ferry Terminal','Rope Works'],C_RAID,['subway','precinct','plow','substation','parkgarage','apts','ferry','feed'],COL_COAST),'barnacle','the Rusted Freighter',C_RAID,2.9,'city','#5a6468','#6a7478',{country:0,city:'Bayview City',district:'The Docks'}),
  mkTown('board','Bayview: The Boardwalk',bl(['Funhouse','Ferris Wheel','Aquarium','Hot Dog Stand','Hotel Bayview','Arcade','Carousel','Souvenir Shop'],C_RAID,['electro','substation','hospital','diner','apts','electro','rink','market'],COL_COAST),'ringmaster','the Big Top',C_RAID,3.0,'city','#6a6058','#7a7068',{country:0,city:'Bayview City',district:'The Boardwalk'}),
  ARENA('Breakwater','warden3',['crabling','gull','eel'],3.1,'coast','#8a9aa0','#9aaab0',{country:0}),
  // ---- The Rust Belt ----
  mkTown('cinder','Cinder',bl(['Steel Mill','Company Store','Union Church','Coal Tipple','Diner 24','Mill Houses','Cinder High','Pawn Shop'],RB_RAID,['mine','gstore','church','mine','diner','apts','school','market'],COL_RUST),'furnace','the Blast Furnace',RB_RAID,3.2,'rust','#5a5048','#6a5e54',{country:0}),
  mkTown('iron','Ironside',bl(['Auto Plant','Tool & Die','Junkyard Office','Power Plant','Bowling Alley','Motor Inn','Trade School','Bar & Grill'],RB_RAID,['hardware','hardware','trailer','substation','rink','motel9','school','diner'],COL_RUST),'ironpress','the Stamping Plant',RB_RAID,3.3,'rust','#4e4a46','#5e5a56',{country:0}),
  mkTown('foundry','Steelport: The Foundry',bl(['Foundry Hall','Pattern Shop','Slag Pits','Smokestack','Workers\' Clinic','Gate House','Pipe Yard','Canteen'],RB_RAID,['mine','hardware','drain','substation','clinic','precinct','drain','diner'],COL_RUST),'crucible','the Crucible',RB_RAID,3.4,'city','#4a4442','#5a5452',{country:0,city:'Steelport',district:'The Foundry'}),
  mkTown('rail','Steelport: The Rail Yards',bl(['Roundhouse','Signal Tower','Freight Depot','Hobo Camp','Station Hotel','Engine Shed','Ticket Hall','Water Tower'],RB_RAID,['plow','substation','feed','trailer','apts','plow','library','pump'],COL_RUST),'ghosttrain','the Dead Platform',RB_RAID,3.5,'city','#4a4846','#5a5856',{country:0,city:'Steelport',district:'The Rail Yards'}),
  ARENA('The Smelter','warden4',['scrapling','drone','mite'],3.6,'rust','#5a3a2a','#6a4a3a',{country:0}),
  // ---- Ground Zero ----
  ARENA('Ground Zero','source',['brat','scrapling','crabling','rat'],3.7,'city','#2a2428','#3a3438',{country:0,finalBoss:true}),
  // ---- Japan ----
  mkTown('hana','Hanamura',bl(['Shrine','Tea House','Ramen Shop','Bathhouse','Pachinko Parlor','Rice Barn','Hanamura School','Ryokan Inn'],JP,['chapel','diner','diner','clinic','electro','feed','school','motel'],COL_JP),'jorogumo','the Spider Shrine',JP,3.4,'japan','#5a7a4a','#6a8a5a',{country:1}),
  mkTown('kumo','Kumo Port',bl(['Fish Auction','Shipyard','Lantern Shop','Sake Brewery','Karaoke Bar','Sea Shrine','Ferry Office','Dock Houses'],JP,['cannery','plow','market','distill','electro','chapel','ferry','apts'],COL_JP),'umibozu','the Black Bay',JP,3.5,'japan','#4a6a5a','#5a7a6a',{country:1}),
  mkTown('edo','Neo Edo City',bl(['Arcade Tower','Capsule Hotel','Train Station','Department Store','Robot Café','Temple Gate','Night Market','Love Hotel'],JP,['electro','apts','subway','market','diner','chapel','market','motel'],COL_JP),'gashadokuro','the Bone Tower',JP,3.6,'city','#3a3a44','#4a4a54',{country:1,city:'Neo Edo City',district:'Downtown'}),
  ARENA('Mount Kurai','orochi',['hitodama','kitsune','tengu'],3.7,'japan','#4a4a4a','#5a5a5a',{country:1,finalBoss:true}),
  // ---- Scotland ----
  mkTown('glen','Glenmor',bl(['Whisky Distillery','Kirk','Sheep Barn','Tartan Mill','Village Pub','Croft House','Post Office','Bothy'],SC,['distill','church','feed','hardware','diner','tcabin','gstore','tcabin'],COL_SC),'blackdog','the Moor',SC,3.6,'highland','#4a6a3a','#5a7a4a',{country:2}),
  mkTown('kil','Kilbrae',bl(['Castle Gate','Smokehouse','Harbour Inn','Peat Shed','Chapel Ruins','Blacksmith','Wool Shop','Ferry Slip'],SC,['precinct','cannery','motel','feed','chapel','hardware','market','ferry'],COL_SC),'stagking','the Stone Circle',SC,3.7,'highland','#3e5e36','#4e6e46',{country:2}),
  mkTown('edin','Edinmoor City',bl(['Old Town Close','Royal Mile Shops','Cathedral','Museum','Underground Vaults','Train Station','University','Pub Crawl Lane'],SC,['apts','market','church','library','subway','subway','school','diner'],COL_SC),'greylady','Edinmoor Castle',SC,3.8,'city','#4a4a48','#5a5a58',{country:2,city:'Edinmoor City',district:'Old Town'}),
  ARENA('Loch Dubh','nessie',['midge','kelpie','selkie'],3.9,'highland','#2a3a3a','#3a4a4a',{country:2,finalBoss:true}),
  // ---- Mexico ----
  mkTown('laz','San Lázaro',bl(['Mercado','Cantina','Mission Church','Tortillería','Pharmacy','Bus Station','Escuela','Hacienda'],MX,['market','diner','church','diner','pharmacy','subway','school','lodge'],COL_MX),'llorona','the Weeping River',MX,3.8,'mexico','#a8885a','#b8986a',{country:3}),
  mkTown('sol','Puerto Sol',bl(['Fish Market','Lucha Arena','Cliff Hotel','Taquería','Lighthouse Cantina','Surf Shop','Chapel by the Sea','Boat Repair'],MX,['cannery','rink','motel','diner','diner','bait','chapel','plow'],COL_MX),'cadejo','the Black Cove',MX,3.9,'mexico','#b8a070','#c8b080',{country:3}),
  mkTown('sombra','Ciudad Sombra',bl(['Cathedral','Metro Station','Mariachi Plaza','Hospital General','Museo','Skyscraper','Panadería','Cemetery Gate'],MX,['church','subway','market','hospital','library','apts','diner','chapel'],COL_MX),'calavera','the Grand Cemetery',MX,4.0,'city','#4a3a3a','#5a4a4a',{country:3,city:'Ciudad Sombra',district:'El Centro'}),
  ARENA('Temple of Xibalba','quetzal',['sombra','chupa','lechuza'],4.1,'mexico','#5a6a3a','#6a7a4a',{country:3,finalBoss:true}),
  // ---- Egypt ----
  mkTown('wadi','Wadi Nur',bl(['Bazaar','Mosque','Camel Market','Spice Shop','Tea House','Mud-brick Houses','Dig Site Office','Water Well House'],EG,['market','church','feed','gstore','diner','apts','library','pump'],COL_EG),'pharaoh','the Royal Tomb',EG,4.0,'egypt','#c8a870','#d8b880',{country:4}),
  mkTown('sabra','Port Sabra',bl(['Felucca Dock','Fishmonger','Hotel Cleopatra','Lighthouse Ruin','Customs Office','Papyrus Shop','Cotton Gin','Ferry House'],EG,['ferry','cannery','motel','tcabin','sheriff','library','hardware','ferry'],COL_EG),'sobek','the Crocodile Shrine',EG,4.1,'egypt','#b8a070','#c8b080',{country:4}),
  mkTown('neferu','Neferu City',bl(['Museum of Antiquities','Grand Bazaar','Train Station','Cairo Tower Hotel','Old Mosque','Market Alley','University','Hospital'],EG,['library','market','subway','apts','church','market','school','hospital'],COL_EG),'anubis','the Hall of Judgment',EG,4.2,'city','#5a4e3a','#6a5e4a',{country:4,city:'Neferu City',district:'Old City'}),
  ARENA('The Great Pyramid','apophis',['scarablet','jackal','asp'],4.3,'egypt','#c89a5a','#d8aa6a',{country:4,finalBoss:true,worldBoss:true})
];
THEMES.distill=THEMES.distill||THEMES.cannery;
TOWNS.forEach(t=>{if(t.country===undefined)t.country=0;});
TOWNS.find(t=>t.name==='Old Haven').city='Old Haven';TOWNS.find(t=>t.name==='Old Haven').district='Downtown';
const OLDN=TOWNS.length;TOWNS.push(...NEW);
const TI=n=>TOWNS.findIndex(t=>t.name===n);
STATES.length=0;STATES.push(
  {name:'The Hollows',towns:[0,1,2,3],color:'#6a9a5a',x:60,y:60,w:300,h:250,country:0},
  {name:'Red Mesa',towns:[4,5,6],color:'#c8743a',x:400,y:60,w:240,h:250,country:0},
  {name:'The Coast',towns:[TI('Driftwood'),TI('Port Grey'),TI('Bayview: The Docks'),TI('Bayview: The Boardwalk'),TI('Breakwater')],color:'#4a7ab0',x:60,y:340,w:340,h:210,country:0},
  {name:'The Rust Belt',towns:[TI('Cinder'),TI('Ironside'),TI('Steelport: The Foundry'),TI('Steelport: The Rail Yards'),TI('The Smelter')],color:'#8a8a9a',x:430,y:340,w:300,h:210,country:0},
  {name:'Ground Zero',towns:[TI('Ground Zero')],color:'#5a2a3a',x:660,y:110,w:150,h:180,country:0,final:true},
  {name:'Honshu',towns:[TI('Hanamura'),TI('Kumo Port'),TI('Neo Edo City'),TI('Mount Kurai')],color:'#c84a5a',x:120,y:120,w:560,h:340,country:1,final:true},
  {name:'The Highlands',towns:[TI('Glenmor'),TI('Kilbrae'),TI('Edinmoor City'),TI('Loch Dubh')],color:'#4a7a5a',x:120,y:120,w:560,h:340,country:2,final:true},
  {name:'Sierra Madre',towns:[TI('San Lázaro'),TI('Puerto Sol'),TI('Ciudad Sombra'),TI('Temple of Xibalba')],color:'#c8843a',x:120,y:120,w:560,h:340,country:3,final:true},
  {name:'The Nile',towns:[TI('Wadi Nur'),TI('Port Sabra'),TI('Neferu City'),TI('The Great Pyramid')],color:'#c8a04a',x:120,y:120,w:560,h:340,country:4,final:true}
);
TOWN_POS.length=0;TOWN_POS.push([140,150],[230,250],[300,140],[250,90],[460,200],[560,260],[580,130],
  [120,420],[210,500],[300,410],[350,480],[240,560],[480,420],[570,500],[640,410],[690,480],[600,560],[735,200],
  [200,350],[360,240],[540,330],[640,180],[200,350],[360,240],[540,330],[640,180],[200,350],[360,240],[540,330],[640,180],[200,350],[360,240],[540,330],[640,180]);
COUNTRIES.length=0;COUNTRIES.push({name:'The United Wastes',flag:'🏚️',hint:'Where it all started',color:'#6a9a5a'},{name:'Japan',flag:'🏯',hint:'yokai, fox spirits and oni',color:'#c84a5a'},{name:'Scotland',flag:'🏰',hint:'loch beasts, kelpies and bog wraiths',color:'#4a7a5a'},{name:'Mexico',flag:'🌵',hint:'chupacabras, La Llorona and calacas',color:'#c8843a'},{name:'Egypt',flag:'🏜️',hint:'mummies, scarabs and a sun-eating serpent',color:'#c8a04a'});
