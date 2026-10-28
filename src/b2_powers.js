// ================= POWER LIBRARY =================
const FAM={
  fire:{name:'Fire',color:'#ff7a2f',icon:'🔥'},frost:{name:'Frost',color:'#9fe8ff',icon:'❄️'},storm:{name:'Storm',color:'#7fd6ff',icon:'⚡'},
  toxic:{name:'Toxic',color:'#a6d65a',icon:'☣️'},blood:{name:'Blood',color:'#ff5a7a',icon:'🩸'},shadow:{name:'Shadow',color:'#c9b6ff',icon:'🌑'},
  metal:{name:'Stone & Metal',color:'#c8d0d8',icon:'⛰️'},sonic:{name:'Sonic',color:'#f2dc7a',icon:'🔔'},water:{name:'Water',color:'#5fd3e8',icon:'🌊'},
  swarm:{name:'Swarm',color:'#b880ff',icon:'🐝'},beast:{name:'Beast',color:'#8fd060',icon:'🐾'},mind:{name:'Mind',color:'#d6ff70',icon:'🧠'},plant:{name:'Plant',color:'#e6cf86',icon:'🌿'}
};
const POWERS={};
function def(fam,id,name,icon,cd,desc,fx,ult){POWERS[id]={id,fam,name,icon,cd,desc,fx,color:FAM[fam].color,ult:!!ult};}
// Fire
def('fire','dive','Fire Dive','🔥',5,'Dash where you aim, leaving a trail of fire.',[{t:'dash',dist:230,trail:{dps:14,st:'burn'}}]);
def('fire','ember','Ember Burst','💥',6,'Explode in a ring of embers that sets enemies on fire.',[{t:'nova',r:120,dmg:18,st:'burn'}]);
def('fire','napalm','Napalm Spit','🫗',5,'Spit a glob that bursts into a puddle of fire.',[{t:'bolt',dmg:16,spd:420,range:360,explode:70,st:'burn',zone:{r:60,dps:10,life:3,st:'burn',kind:'fire'}}]);
def('fire','firewall','Wall of Fire','🧱',9,'Raise a line of flames in front of you.',[{t:'line',n:5,gap:40,r:34,dps:16,life:5,st:'burn',kind:'fire'}]);
def('fire','inferno','Inferno Cloak','🧥',12,'Wrap yourself in flames that burn anything near you. You stop burning.',[{t:'zone',follow:true,r:90,dps:14,life:5,st:'burn',kind:'fire'},{t:'buff',fireimm:1,dur:5}]);
def('fire','phoenix','Phoenix Rise','🌅',30,'Heal a lot and explode in fire. Ultimate.',[{t:'heal',amt:50},{t:'nova',r:190,dmg:30,st:'burn'}],1);
// Frost
def('frost','icelance','Ice Lance','🧊',3,'Fire a spear of ice that pierces and slows.',[{t:'bolt',dmg:24,spd:640,range:460,pierce:true,st:'slow',r:6}]);
def('frost','frostnova','Frost Nova','❄️',9,'Freeze everything around you solid.',[{t:'nova',r:150,dmg:10,st:'freeze'}]);
def('frost','frozenground','Frozen Ground','🥶',8,'Ice over the ground where you aim. Enemies crawl through it.',[{t:'zone',at:'aim',r:110,dps:4,life:6,st:'slow'}]);
def('frost','cryoshell','Cryo Shell','🛡️',12,'Ice armor. Anything that hits you gets frozen.',[{t:'buff',armor:1,thorns:1,thornSt:'freeze',dur:4}]);
def('frost','blizzard','Blizzard','🌨️',14,'A storm of ice follows you, slowing and hurting enemies.',[{t:'zone',follow:true,r:200,dps:8,life:6,st:'slow'}]);
def('frost','zero','Absolute Zero','🧊',40,'Freeze every enemy you can see. Ultimate.',[{t:'screen',dmg:20,st:'freeze'}],1);
// Storm
def('storm','chain','Chain Lightning','⚡',4,'Lightning jumps between several enemies.',[{t:'chain',n:3,dmg:24}]);
def('storm','staticfield','Static Field','🌩️',9,'Crackle with electricity that zaps anything close.',[{t:'zone',follow:true,r:110,dps:12,life:4}]);
def('storm','thunderclap','Thunderclap','💥',8,'Slam the air. Stuns everything around you.',[{t:'nova',r:140,dmg:22,st:'stun'}]);
def('storm','balllightning','Ball Lightning','🔮',6,'A slow ball of lightning that hunts enemies and zaps everything it passes.',[{t:'bolt',dmg:12,spd:160,range:520,pierce:true,homing:true,r:10}]);
def('storm','overcharge','Overcharge','🔋',12,'Supercharge your body: faster and hitting harder.',[{t:'buff',speed:1,frenzy:1,dur:5}]);
def('storm','stormcall','Storm Call','⛈️',24,'Call lightning down on up to 8 enemies. Ultimate.',[{t:'strikes',n:8,dmg:30,st:'stun'}],1);
// Toxic
def('toxic','spore','Spore Cloud','🍄',7,'Drop a poison cloud that eats at enemies.',[{t:'zone',r:95,dps:15,life:5,st:'poison'}]);
def('toxic','acidspit','Acid Spit','🤮',3,'Spit acid. Poisons and makes the target take extra damage.',[{t:'bolt',dmg:12,spd:520,range:380,st:['poison','vuln']}]);
def('toxic','plaguebite','Plague Bite','🦷',5,'A filthy bite that poisons whatever is in front of you.',[{t:'cone',r:80,arc:.6,dmg:22,st:'poison'}]);
def('toxic','miasma','Miasma','☁️',10,'A poison fog follows you around.',[{t:'zone',follow:true,r:100,dps:10,life:6,st:'poison'}]);
def('toxic','toxicburst','Toxic Burst','☣️',9,'Burst open in a ring of poison.',[{t:'nova',r:160,dmg:8,st:'poison'}]);
def('toxic','pandemic','Pandemic','🦠',30,'Poison every enemy you can see and make them weak. Ultimate.',[{t:'screen',dmg:10,st:['poison','vuln']}],1);
// Blood
def('blood','drain','Life Drain','🩸',5,'Rip life out of the nearest enemy and heal yourself.',[{t:'beam',range:250,dmg:32,heal:26}]);
def('blood','hemorrhage','Hemorrhage','🔪',5,'Slash in front of you. Enemies keep bleeding.',[{t:'cone',r:110,arc:.55,dmg:12,st:'bleed'}]);
def('blood','bloodpact','Blood Pact','🤝',12,'Your hits heal you and hit harder for a while.',[{t:'buff',lifesteal:1,frenzy:1,dur:6}]);
def('blood','crimsonnova','Crimson Nova','⭕',8,'A blood blast that heals you for every enemy it hits.',[{t:'nova',r:130,dmg:24,heal:5}]);
def('blood','sanguine','Blood Spear','🗡️',4,'Throw a spear of blood that pierces and heals you.',[{t:'bolt',dmg:30,spd:700,range:460,pierce:true,heal:6,r:6}]);
def('blood','frenzy','Blood Frenzy','😡',24,'Go berserk: faster, stronger, and every hit heals. Ultimate.',[{t:'buff',frenzy:1,lifesteal:1,speed:1,dur:8}],1);
// Shadow
def('shadow','ghost','Glass Skin','👻',12,'Turn invisible. Enemies lose track of you.',[{t:'buff',invis:1,dur:5}]);
def('shadow','shadowstep','Shadow Step','🌀',4,'Teleport to where you aim.',[{t:'teleport',dist:230}]);
def('shadow','multiply','Multiply','👯',14,'Split into copies of yourself that fight beside you for 12 seconds. 1 copy as an echo, 2 at full power, 3 at mastery.',[{t:'summon',look:'clone',n:2,hp:45,dmg:10,spd:200,life:12}]);
def('shadow','umbral','Umbral Blades','🗡️',5,'Throw three shadow blades that chase enemies.',[{t:'bolt',n:3,spread:.3,homing:true,dmg:14,spd:420,range:520}]);
def('shadow','nightfall','Nightfall','🌑',12,'Darkness around you. Enemies inside panic and run.',[{t:'zone',r:170,life:5,st:'fear'}]);
def('shadow','shroud','Shroud','🕶️',9,'Vanish for a moment and move faster.',[{t:'buff',invis:1,dur:2},{t:'buff',speed:1,dur:4}]);
def('shadow','eclipse','Eclipse','🌘',30,'Every enemy you can see panics, and you vanish. Ultimate.',[{t:'screen',st:'fear'},{t:'buff',invis:1,dur:4}],1);
// Stone & Metal
def('metal','metal','Metal Skin','🛡️',9,'Iron plating. Take 70% less damage for a few seconds.',[{t:'buff',armor:1,dur:5}]);
def('metal','quake','Quake Stomp','🪨',7,'Stomp the ground. Stuns and shoves enemies around you.',[{t:'nova',r:150,dmg:18,st:'stun',knock:30}]);
def('metal','spikewall','Spike Wall','🗻',9,'Raise a line of stone spikes that hurt and slow.',[{t:'line',n:6,gap:36,r:30,dps:14,life:5,st:'slow',kind:'spike'}]);
def('metal','boulder','Boulder Toss','🥌',6,'Hurl a boulder that smashes and shoves.',[{t:'bolt',dmg:40,spd:380,r:12,range:380,explode:60,knock:40}]);
def('metal','ironfist','Iron Fist','👊',6,'A huge punch that sends enemies flying.',[{t:'cone',r:85,arc:.5,dmg:42,knock:60,st:'stun'}]);
def('metal','titan','Titan Form','🗿',30,'Become a giant: armored, spiky, and stronger. Ultimate.',[{t:'buff',armor:1,thorns:1,frenzy:1,dur:8}],1);
// Sonic
def('sonic','scream','Sonic Scream','🔔',8,'Stun everything around you.',[{t:'nova',r:200,dmg:8,st:'stun',stunT:2.4}]);
def('sonic','shatter','Shatter','🔊',7,'A focused blast of sound. Hits hard and cracks armor.',[{t:'cone',r:210,arc:.45,dmg:30,st:'vuln'}]);
def('sonic','echoloc','Echolocation','📡',10,'Ping the area. Every enemy nearby is marked and takes extra damage.',[{t:'mark',r:450}]);
def('sonic','resonance','Resonance','〰️',10,'Hum at a frequency that hurts everything close.',[{t:'zone',follow:true,r:120,dps:12,life:5}]);
def('sonic','banshee','Banshee Wail','😱',12,'A terrifying wail. Enemies run away.',[{t:'nova',r:220,st:'fear'}]);
def('sonic','sonicboom','Sonic Boom','💢',30,'A massive shockwave that stuns everything. Ultimate.',[{t:'nova',r:330,dmg:40,st:'stun',knock:50}],1);
// Water
def('water','tar','Tar Pit','🛢️',8,'Spill tar in front of you that slows and burns enemies.',[{t:'zone',at:'front',r:105,dps:7,life:6,st:'slow',kind:'tar'}]);
def('water','whirlpool','Whirlpool','🌀',10,'A whirlpool that drags enemies into the middle.',[{t:'zone',at:'aim',r:130,dps:6,life:5,pull:90}]);
def('water','geyser','Geyser','⛲',6,'A geyser bursts where you aim, launching enemies.',[{t:'nova',at:'aim',r:80,dmg:30,knock:40}]);
def('water','bubble','Bubble Shield','🫧',12,'A bubble that blocks damage and heals you a little.',[{t:'buff',armor:1,dur:3},{t:'heal',amt:20}]);
def('water','riptide','Riptide','💧',5,'Three jets of water that slow and push.',[{t:'bolt',n:3,spread:.2,dmg:12,spd:500,range:360,st:'slow',knock:20}]);
def('water','wave','Tidal Wave','🌊',12,'Send a wave rolling forward that smashes and shoves everything in its path. Ultimate.',[{t:'wave',dmg:34}],1);
// Swarm
def('swarm','brood','Brood Call','🕷️',14,'Summon broodlings that fight for you. Ultimate.',[{t:'summon',n:3,look:'spider',hp:42,dmg:7,life:20}],1);
def('swarm','wisp','Wisp Swarm','✨',6,'Release spirit lights that hunt down enemies on their own.',[{t:'bolt',n:5,spread:.5,homing:true,dmg:14,spd:260,range:780}]);
def('swarm','locust','Locust Cloud','🦗',10,'A cloud of locusts follows you and chews on enemies.',[{t:'zone',follow:true,r:100,dps:11,life:6}]);
def('swarm','ratpack','Rat Pack','🐀',12,'Summon a pack of rats.',[{t:'summon',n:5,look:'rat',hp:18,dmg:5,life:15,spd:190}]);
def('swarm','lure','Wisp Lure','🏮',12,'Drop a glowing decoy that monsters attack instead of you.',[{t:'summon',n:1,look:'decoy',hp:120,dmg:0,life:8,taunt:true},{t:'buff',invis:1,dur:1.5}]);
def('swarm','hivemind','Hive Mind','🐝',30,'Summon a cloud of giant bees and get stronger. Ultimate.',[{t:'summon',n:6,look:'bee',hp:30,dmg:9,life:25},{t:'buff',frenzy:1,dur:6}],1);
// Beast
def('beast','roll','Death Roll','🐊',6,'Spin and slam everything around you three times.',[{t:'roll',pulses:3,r:100,dmg:14,knock:30}]);
def('beast','pounce','Pounce','🐸',5,'Leap where you aim and crush whatever you land on.',[{t:'leap',dist:260,r:95,dmg:30,st:'stun'}]);
def('beast','snap','Snap','🦈',4,'A massive bite at whatever is in front of you.',[{t:'cone',r:80,arc:.5,dmg:38}]);
def('beast','charge','Charge','🐗',7,'Charge forward, flattening anything in the way.',[{t:'dash',dist:300,hit:26,st:'stun'}]);
def('beast','tongue','Tongue Lash','👅',5,'Grab the nearest enemy and yank it to you.',[{t:'beam',range:280,dmg:16,pull:true,st:'stun'}]);
def('beast','howl','Howl','🐺',12,'Howl: you get faster and stronger, nearby enemies flee.',[{t:'buff',speed:1,frenzy:1,dur:5},{t:'nova',r:140,st:'fear'}]);
def('beast','wildheal','Wild Heal','💚',14,'Heal up and keep healing for a while.',[{t:'heal',amt:40},{t:'buff',regen:1,dur:6}]);
// Mind
def('mind','hex','Hex','🧿',9,'Curse every enemy in front of you. Cursed enemies take 60% more damage.',[{t:'cone',r:280,arc:.75,st:'vuln'}]);
def('mind','fearaura','Fear Aura','👁️',10,'Enemies around you are terrified and run.',[{t:'nova',r:170,st:'fear'}]);
def('mind','puppet','Puppet','🪆',12,'Take control of the nearest enemy. It fights for you.',[{t:'beam',range:300,st:'charm'}]);
def('mind','mindblast','Mind Blast','🧠',4,'A bolt of psychic force that stuns.',[{t:'bolt',dmg:22,spd:560,range:420,st:'stun'}]);
def('mind','confusion','Confusion','💫',12,'Enemies where you aim start fighting each other.',[{t:'zone',at:'aim',r:120,life:4,st:'charm'}]);
def('mind','dominate','Dominate','👑',30,'Every enemy you can see fights for you for a while. Ultimate.',[{t:'screen',st:'charm'}],1);
// Plant
def('plant','thorn','Thorn Volley','🌾',3,'Fire a fan of spikes where you aim.',[{t:'bolt',n:7,spread:.12,dmg:11,spd:580,range:350,spike:true}]);
def('plant','vines','Strangling Vines','🌱',9,'Vines grab enemies where you aim and hold them in place.',[{t:'zone',at:'aim',r:110,dps:5,life:4,st:'root'}]);
def('plant','bramble','Bramble Armor','🌵',12,'Thorny armor. Anything that hits you gets hurt.',[{t:'buff',thorns:1,armor:1,dur:6}]);
def('plant','seedbomb','Seed Bomb','🌰',5,'Lob a seed pod that explodes.',[{t:'bolt',dmg:20,spd:420,range:380,explode:80}]);
def('plant','overgrowth','Overgrowth','🌳',10,'A line of grabbing roots in front of you.',[{t:'line',n:6,gap:38,r:32,dps:10,life:6,st:'root'}]);
def('plant','bloom','Bloom','🌸',14,'Heal yourself and slow everything around you with pollen.',[{t:'heal',amt:30},{t:'nova',r:150,st:'slow'}]);

// Traits (passive genes): unlock at 100% DNA, wear up to 2
const TRAITS={
  thickhide:{name:'Thick Hide',icon:'🦏',fam:'metal',desc:'+25 max HP.'},
  lifesteal:{name:'Leech Mouth',icon:'🧛',fam:'blood',desc:'Your weapon hits heal you for 12% of the damage.'},
  swift:{name:'Swift',icon:'💨',fam:'storm',desc:'+12% move speed.'},
  echo:{name:'Echo Sense',icon:'👂',fam:'sonic',desc:'See every monster in the area on your minimap, even through walls.'},
  toxicblood:{name:'Toxic Blood',icon:'🧪',fam:'toxic',desc:'Monsters that bite you get poisoned.'},
  nighteyes:{name:'Night Eyes',icon:'🦉',fam:'shadow',desc:'See much farther in the dark.'},
  firewalker:{name:'Firewalker',icon:'🔥',fam:'fire',desc:'Fire and burning can\'t hurt you.'},
  bogskin:{name:'Bog Skin',icon:'🐸',fam:'water',desc:'Slows, tar and traps can\'t stop you.'},
  regen:{name:'Regeneration',icon:'💚',fam:'beast',desc:'Heal 2 HP every second.'},
  glow:{name:'Glow',icon:'💡',fam:'swarm',desc:'A light follows you, and DNA strands are more often clean or pure.'},
  luck:{name:'Witch\'s Luck',icon:'🍀',fam:'mind',desc:'Searching finds more stuff.'},
  springlegs:{name:'Spring Legs',icon:'🦘',fam:'beast',desc:'+8% speed. Dashes and leaps go 30% farther.'},
  thornskin:{name:'Thorn Skin',icon:'🌵',fam:'plant',desc:'Monsters that hit you take 30% of the damage back.'},
  coldblood:{name:'Cold Blood',icon:'🧊',fam:'frost',desc:'Freezing can\'t stop you, and you take 10% less damage.'},
  mindshield:{name:'Iron Will',icon:'🛡️',fam:'mind',desc:'You can\'t be stunned or hexed.'}
};
// Gene mods: rolled by perfect sequencing or added with mutagen
const GMODS={
  amp:{name:'Amplified',icon:'⬆️',desc:'+30% power'},wide:{name:'Wide',icon:'↔️',desc:'+35% area and range'},
  quick:{name:'Quick',icon:'⏩',desc:'-25% cooldown'},echo:{name:'Echoing',icon:'🔁',desc:'Casts a second, weaker time'},
  vamp:{name:'Vampiric',icon:'🧛',desc:'Heals you for 15% of its damage'},burn:{name:'Burning',icon:'🔥',desc:'Also sets enemies on fire'},
  chill:{name:'Chilling',icon:'❄️',desc:'Also slows enemies'},shock:{name:'Shocking',icon:'⚡',desc:'Also stuns briefly'}
};
const CURSES={hungry:{name:'Hungry',desc:'Costs 2 humanity every cast'},recoil:{name:'Recoil',desc:'Hurts you for 8 HP every cast'},sluggish:{name:'Sluggish',desc:'+40% cooldown'}};
// Splice recipes by family pair
const RECIPES={
  'fire|frost':{name:'Steam Burst',icon:'♨️',cd:8,desc:'Explode in scalding steam: big damage, slows, and the fog makes enemies panic.',fx:[{t:'nova',r:170,dmg:26,st:'slow'},{t:'zone',r:150,life:4,st:'fear'}]},
  'storm|water':{name:'Storm Surge',icon:'🌩️',cd:10,desc:'A wave crackling with lightning.',fx:[{t:'wave',dmg:30},{t:'chain',n:4,dmg:20}]},
  'swarm|toxic':{name:'Plague Locusts',icon:'🦗',cd:10,desc:'A poisonous swarm follows you everywhere.',fx:[{t:'zone',follow:true,r:120,dps:16,life:6,st:'poison'}]},
  'blood|shadow':{name:'Vampire Step',icon:'🦇',cd:5,desc:'Teleport and burst in blood, healing for each enemy hit.',fx:[{t:'teleport',dist:240},{t:'nova',r:110,dmg:22,heal:6}]},
  'fire|metal':{name:'Molten Armor',icon:'🌋',cd:12,desc:'Armor of molten rock that burns everything near you.',fx:[{t:'buff',armor:1,fireimm:1,dur:5},{t:'zone',follow:true,r:90,dps:14,life:5,st:'burn',kind:'fire'}]},
  'frost|metal':{name:'Glacier Fist',icon:'🥊',cd:7,desc:'A punch so cold it freezes everything in front of you.',fx:[{t:'cone',r:100,arc:.55,dmg:44,st:'freeze'}]},
  'sonic|storm':{name:'Thunder Scream',icon:'🌩️',cd:10,desc:'A scream that stuns, then lightning jumps between the stunned.',fx:[{t:'nova',r:220,dmg:20,st:'stun'},{t:'chain',n:4,dmg:18}]},
  'beast|blood':{name:'Feral Frenzy',icon:'🐺',cd:18,desc:'Go feral: faster, stronger, every hit heals.',fx:[{t:'buff',frenzy:1,lifesteal:1,speed:1,dur:8}]},
  'mind|shadow':{name:'Nightmare',icon:'😨',cd:20,desc:'Every enemy you see panics and takes extra damage.',fx:[{t:'screen',st:['fear','vuln']}]},
  'plant|water':{name:'Mangrove Snare',icon:'🌳',cd:10,desc:'Roots drag enemies together and hold them.',fx:[{t:'zone',at:'aim',r:140,pull:80,dps:6,life:4,st:'root'}]},
  'fire|plant':{name:'Wildfire',icon:'🔥',cd:10,desc:'A long line of burning brush.',fx:[{t:'line',n:8,gap:40,r:36,dps:18,life:6,st:'burn',kind:'fire'}]},
  'mind|swarm':{name:'Hive Puppets',icon:'🐝',cd:16,desc:'Summon bees and turn enemies against each other.',fx:[{t:'summon',n:3,look:'bee',hp:30,dmg:9,life:20},{t:'zone',at:'aim',r:120,life:3,st:'charm'}]},
  'toxic|water':{name:'Acid Rain',icon:'🌧️',cd:12,desc:'Acid pours down on a big area.',fx:[{t:'zone',at:'aim',r:180,dps:12,life:6,st:'poison'}]},
  'frost|water':{name:'Ice Age',icon:'🧊',cd:20,desc:'Slow everything you can see and freeze what\'s close.',fx:[{t:'screen',dmg:10,st:'slow'},{t:'nova',r:150,st:'freeze'}]},
  'beast|metal':{name:'Rhino Charge',icon:'🦏',cd:8,desc:'An armored charge that flattens everything.',fx:[{t:'buff',armor:1,dur:2},{t:'dash',dist:360,hit:36,st:'stun'}]},
  'metal|sonic':{name:'Bell Hammer',icon:'🔨',cd:8,desc:'A ringing hammer blow that stuns a wide area in front of you.',fx:[{t:'cone',r:120,arc:.6,dmg:40,st:'stun',knock:50}]},
  'fire|storm':{name:'Plasma Bolt',icon:'☄️',cd:5,desc:'A bolt of plasma that explodes and burns.',fx:[{t:'bolt',dmg:30,spd:600,range:460,explode:80,st:'burn'}]},
  'blood|toxic':{name:'Black Blood',icon:'🖤',cd:9,desc:'Poisonous blood bursts out of you and heals you.',fx:[{t:'nova',r:150,dmg:14,st:'poison',heal:6}]},
  'beast|shadow':{name:'Night Hunter',icon:'🐆',cd:8,desc:'Vanish, then pounce from the shadows.',fx:[{t:'buff',invis:1,dur:2},{t:'leap',dist:300,r:95,dmg:34}]},
  'fire|swarm':{name:'Firefly Swarm',icon:'🪲',cd:7,desc:'Eight burning fireflies hunt enemies down.',fx:[{t:'bolt',n:8,spread:.4,homing:true,dmg:12,st:'burn',spd:280,range:700}]},
  'frost|storm':{name:'Hailstorm',icon:'🌨️',cd:10,desc:'Hail pounds a big area, slowing everything in it.',fx:[{t:'zone',at:'aim',r:160,dps:14,life:5,st:'slow'}]},
  'mind|sonic':{name:'Psychic Scream',icon:'🗯️',cd:12,desc:'A scream inside their heads: damage and panic.',fx:[{t:'nova',r:220,dmg:16,st:'fear'}]},
  'plant|toxic':{name:'Poison Ivy',icon:'🍃',cd:10,desc:'Poisonous vines spread around you and grab enemies.',fx:[{t:'zone',follow:true,r:110,dps:12,life:6,st:['poison','slow']}]},
  'beast|storm':{name:'Thunder Hooves',icon:'🐎',cd:8,desc:'Charge forward and leave lightning behind you.',fx:[{t:'dash',dist:320,hit:24,st:'stun'},{t:'zone',r:120,dps:14,life:3}]}
};
function recipeKey(a,b){return [POWERS[a].fam,POWERS[b].fam].sort().join('|');}
const SRC={},SRCTYPE={};
for(const t in MONSTERS){const m=MONSTERS[t];(m.genes||[]).forEach(g=>{if(!SRC[g]||(MONSTERS[SRCTYPE[g]].minion&&!m.minion)){SRC[g]=m.name;SRCTYPE[g]=t;}});}
const isTrait=id=>!!TRAITS[id];
const geneInfo=id=>TRAITS[id]?{...TRAITS[id],color:FAM[TRAITS[id].fam].color,trait:true}:POWERS[id];
