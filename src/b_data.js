"use strict";
// ================= DATA =================
const MONSTERS={
  crawler:{name:'Rustback Crawler',power:'metal',hp:70,spd:60,dmg:9,r:19,color:'#b0784a',eye:'#ffb347',dna:34,genes:['metal','quake','thickhide']},
  leech:{name:'Gutter Leech',power:'drain',hp:45,spd:80,dmg:7,r:15,color:'#b03a58',eye:'#ffe0e8',dna:34,genes:['drain','hemorrhage','lifesteal']},
  hound:{name:'Static Hound',power:'chain',hp:50,spd:115,dmg:7,r:16,color:'#3a80c4',eye:'#d6f8ff',dna:34,genes:['chain','staticfield','swift']},
  bell:{name:'The Bellringer',power:'scream',hp:100,spd:42,dmg:13,r:24,color:'#c9a640',eye:'#fff6c0',dna:34,genes:['scream','shatter','echo']},
  matron:{name:'Mold Matron',power:'spore',hp:80,spd:48,dmg:8,r:22,color:'#6f9a3a',eye:'#f2ffa0',dna:34,genes:['spore','acidspit','toxicblood']},
  stalker:{name:'Glass Stalker',power:'ghost',hp:55,spd:95,dmg:11,r:16,color:'#cfe6f4',eye:'#3a7bff',dna:34,genes:['ghost','shadowstep','nighteyes']},
  crow:{name:'Pyre Crow',power:'dive',hp:38,spd:135,dmg:6,r:13,color:'#e2602a',eye:'#ffe066',dna:34,genes:['dive','ember','firewalker']},
  brat:{name:'Broodling',power:'brood',hp:18,spd:125,dmg:4,r:9,color:'#9a52c8',eye:'#f0d0ff',dna:7,minion:true,genes:['brood','locust','glow']},
  nest:{name:'The Nest Mother',power:'brood',hp:550,spd:36,dmg:16,r:46,color:'#7a3aa6',eye:'#ff7be0',dna:0,boss:true,genes:['brood']},
  lurker:{name:'Bog Lurker',power:'tar',hp:95,spd:50,dmg:11,r:22,color:'#7a6a3a',eye:'#ffd84a',dna:30,genes:['tar','whirlpool','bogskin']},
  gator:{name:'Gator Wraith',power:'roll',hp:110,spd:72,dmg:14,r:21,color:'#4f8a46',eye:'#fff27a',dna:30,genes:['roll','snap','regen']},
  wisp:{name:'Swamp Wisp',power:'wisp',hp:45,spd:115,dmg:6,r:13,color:'#8ff0dc',eye:'#ffffff',dna:30,genes:['wisp','lure','glow']},
  hag:{name:'Mire Hag',power:'hex',hp:75,spd:65,dmg:9,r:17,color:'#8a64aa',eye:'#e0ff7a',dna:30,genes:['hex','fearaura','luck']},
  toad:{name:'Leaper Toad',power:'pounce',hp:70,spd:60,dmg:12,r:18,color:'#8aa036',eye:'#ff9f40',dna:30,genes:['pounce','tongue','springlegs']},
  reed:{name:'Reed Stalker',power:'thorn',hp:60,spd:85,dmg:8,r:16,color:'#a4ae5e',eye:'#fff0b0',dna:30,genes:['thorn','vines','thornskin']},
  drowned:{name:'Drowned One',power:'wave',hp:30,spd:90,dmg:6,r:12,color:'#4a7a8a',eye:'#9fffe8',dna:6,minion:true,genes:['wave','geyser','bogskin']},
  queen:{name:'The Drowned Queen',power:'wave',hp:800,spd:40,dmg:20,r:50,color:'#2f6a80',eye:'#9fffe8',dna:0,boss:true,genes:['wave']},
  crate:{name:'Mimic Crate',power:null,hp:60,spd:140,dmg:10,r:17,color:'#a67c4e',eye:'#ff4d5e',dna:0,mimic:true,genes:[]},
  house:{name:'Mimic House',power:null,hp:420,spd:30,dmg:22,r:66,color:'#8a6a4a',eye:'#ff4d5e',dna:0,mimic:true,genes:[]}
};
const MUTS=['Giant','Swift','Regen','Volatile'];
const MEMORY={
  multiply:'A memory surfaces: twin girls at the county fair, swapping hats to fool their dad. He always pretended to be fooled.',
  metal:'A memory surfaces: a mechanic named Dale, welding scrap plates onto his own arms. "Just in case," he said.',
  drain:'A memory surfaces: a nurse in this town, giving blood to a stranger. Then giving more than she had.',
  chain:'A memory surfaces: a lineman, still clipped to the pole, laughing as the storm hit.',
  scream:'A memory surfaces: Father Ames ringing the church bell for three days so survivors could find him.',
  spore:'A memory surfaces: Rosie, from the diner. She never threw anything out. Not even the bread with the green on it.',
  ghost:'A memory surfaces: a quiet kid at Millbrook High who could stand in a hallway and nobody ever noticed.',
  dive:'A memory surfaces: the gas station clerk who stayed to light the pumps so everyone else could run.',
  brood:'A memory surfaces: a mother counting her children over and over. There were always more than there should be.',
  tar:'A memory surfaces: a man who sank his truck in the bog on purpose, so the thing following him would sink with it.',
  roll:'A memory surfaces: an old gator wrangler who swore he would never let go first. He never did.',
  wisp:'A memory surfaces: a girl with a lantern, walking out onto the water to show lost people the way home.',
  hex:'A memory surfaces: the woman at the edge of town everyone called a witch. She was the only one who boiled the water.',
  pounce:'A memory surfaces: a track star from Saltmarsh High. Long jump. County record. Still stands.',
  thorn:'A memory surfaces: a duck hunter who never missed, crouched in the reeds for three days straight.',
  wave:'A memory surfaces: the lighthouse keeper. She kept the light on for a ferry that was never coming back.'
};
const ADAPT={metal:'armor-piercing rounds',drain:'blood-thinner darts',chain:'rubber insulated suits',scream:'earplugs and padded helmets',spore:'gas masks',ghost:'flour bombs that coat invisible things',dive:'fire-retardant coats',brood:'bug-spray flamers',tar:'solvent sprayers',roll:'spiked shields',wisp:'iron chimes that scatter spirits',hex:'blessed charms',pounce:'bear-trap boots',thorn:'riot shields',wave:'sandbag walls'};
const BLD=[
  {id:'hardware',name:'Hardware Store',x:240,y:200,w:260,h:170,roof:'#9a4a2a',wall:'#d8c3a0',sign:'#e07b28',monster:'crawler'},
  {id:'substation',name:'Power Substation',x:930,y:130,w:230,h:150,roof:'#56636e',wall:'#b8bec4',sign:'#2f80c4',monster:'hound'},
  {id:'church',name:'St. Agnes Church',x:1620,y:160,w:230,h:230,roof:'#5e4a7a',wall:'#e0d8c8',sign:'#8f6bd1',monster:'bell'},
  {id:'drain',name:'Drainage Plant',x:170,y:760,w:220,h:150,roof:'#4a6658',wall:'#a8b0a0',sign:'#2f9a72',monster:'leech'},
  {id:'gas',name:"Gas 'n Go",x:2020,y:600,w:230,h:150,roof:'#b8362a',wall:'#e8e2d6',sign:'#e74c3c',monster:'crow'},
  {id:'pharmacy',name:'Pharmacy',x:420,y:1260,w:230,h:160,roof:'#2a7a7a',wall:'#e6ece8',sign:'#27ae60',monster:'copycat'},
  {id:'school',name:'Millbrook High',x:1060,y:1330,w:320,h:190,roof:'#9a3a34',wall:'#d8b89a',sign:'#c0392b',monster:'stalker'},
  {id:'diner',name:"Rosie's Diner",x:1640,y:1320,w:240,h:160,roof:'#c99a1a',wall:'#f0e4c8',sign:'#e67e22',monster:'matron'},
  {id:'tower',name:'Water Tower',x:2060,y:1000,w:200,h:200,monster:'nest',boss:true,sign:'#ff7be0'}
];
const BLD2=[
  {id:'cannery',name:'Fish Cannery',x:220,y:240,w:280,h:170,roof:'#56666a',wall:'#a8b4b4',sign:'#2c7a8a',monster:'reed'},
  {id:'bait',name:'Bait & Tackle',x:950,y:140,w:210,h:140,roof:'#7a5a32',wall:'#c8b08a',sign:'#c58b2a',monster:'toad'},
  {id:'ranger',name:'Ranger Station',x:1640,y:180,w:220,h:200,roof:'#4a6a3a',wall:'#b8a888',sign:'#6a8a2a',monster:'hag'},
  {id:'pump',name:'Pump House',x:180,y:770,w:210,h:150,roof:'#4a5a60',wall:'#9aa6aa',sign:'#3a7a9a',monster:'lurker'},
  {id:'motel',name:'Swamp Motel',x:2000,y:560,w:260,h:170,roof:'#8a3a5a',wall:'#e0c8d0',sign:'#d84a8a',monster:'wisp'},
  {id:'trailer',name:'Trailer Park',x:400,y:1250,w:280,h:170,roof:'#8a8a7a',wall:'#d8d8c8',sign:'#9a7a4a',monster:'gator'},
  {id:'ferry',name:'Ferry Dock',x:1050,y:1340,w:320,h:170,roof:'#3a5a7a',wall:'#b0b8c0',sign:'#2a6aaa',monster:'lurker'},
  {id:'distillery',name:'Old Distillery',x:1650,y:1300,w:240,h:170,roof:'#6a4a2a',wall:'#c0a078',sign:'#a0602a',monster:'wisp'},
  {id:'lighthouse',name:'The Lighthouse',x:2080,y:1000,w:180,h:180,monster:'queen',boss:true,sign:'#9fffe8'}
];
const TOWNS=[
  {name:'Millbrook',blds:BLD,raid:['crawler','leech','hound','bell','matron','stalker','crow','copycat'],boss:'nest',lair:'the water tower',outposts:['hardware','church','gas','pharmacy','school','diner'],lvl:1,crate:.08,swamp:false,ground:'#5d7c46',patch:'#6b8c50'},
  {name:'Saltmarsh',blds:BLD2,raid:['lurker','gator','wisp','hag','toad','reed'],boss:'queen',lair:'the lighthouse',outposts:['cannery','bait','ranger','motel','trailer','distillery'],lvl:1.4,crate:.14,swamp:true,ground:'#4e6a42',patch:'#5a784a'}
];
const TIERS=[
  {name:'Rickety Shack',hp:150,cost:null,perk:'A roof. Mostly.'},
  {name:'Boarded Cabin',hp:300,cost:{wood:6,scrap:3},perk:'+20 max HP, faster healing inside, tougher windows, 1 auto-turret'},
  {name:'Fortified House',hp:450,cost:{wood:6,scrap:6,wire:3},perk:'DNA Sequencer (strands drop cleaner more often), bigger DNA Vault, 2 turrets'},
  {name:'Bunker',hp:650,cost:{scrap:8,wire:5,meds:2,fuel:3},perk:'Gene Freezer (vault strands never spoil), Splicing Lab, +20 max HP, 3 turrets'},
  {name:'Steel Fortress',hp:800,cost:{scrap:10,wire:6,meds:2},perk:'The toughest base. More turrets, and you can install base modules (floodlights, mounted gun, armor plating)'}
];
const MODS={
  rack:{name:'Cargo Rack',desc:'+10 cargo space in the truck when you leave town',cost:{wood:4,scrap:4}},
  lights:{name:'Floodlights',desc:'Much bigger light at night. Raiders near your base are slowed.',cost:{wire:4,fuel:2}},
  gun:{name:'Mounted Gun',desc:'+1 auto-turret',cost:{scrap:6,wire:3}},
  armor:{name:'Armor Plating',desc:'+250 base HP',cost:{scrap:8}}
};
const CARGO=18;
const RES_ICON={wood:'🪵',scrap:'⚙️',wire:'🔌',food:'🥫',meds:'💊',fuel:'⛽',ammo:'🔫',mutagen:'🧪'};
const HUMANS={
  scav:{name:'Scavenger',hp:30,spd:95,r:11,color:'#d9b47a',bio:3},
  hunter:{name:'Hunter',hp:50,spd:85,r:12,color:'#6f9a52',bio:5},
  torch:{name:'Torchbearer',hp:75,spd:100,r:13,color:'#d4662a',bio:6},
  trapper:{name:'Trapper',hp:45,spd:90,r:12,color:'#8a6a9a',bio:5}
};
const EVO={hp:{name:'Thicker Hide',desc:'+30 max HP',base:14},claw:{name:'Longer Claws',desc:'+6 claw damage',base:14},spd:{name:'Stronger Legs',desc:'+12% speed',base:12},nest:{name:'Mend the Nest',desc:'+200 nest HP',base:10}};
// Interiors: breakables drop materials when smashed; containers are searched by holding E
const PROPS={
  shelf:{name:'Shelf',w:100,h:26,hp:30,brk:{scrap:[0,2],wood:[1,2]},col:'#8a6a44'},
  lumber:{name:'Lumber pile',w:80,h:40,hp:30,brk:{wood:[2,4]},col:'#c49a62'},
  crate:{name:'Crate',w:36,h:36,hp:18,brk:{wood:[1,2]},col:'#b4884f'},
  transformer:{name:'Transformer',w:56,h:50,hp:45,brk:{wire:[1,3],scrap:[1,2]},col:'#7c8a96'},
  pew:{name:'Pew',w:130,h:24,hp:30,brk:{wood:[2,3]},col:'#8a5a36'},
  pipes:{name:'Pipes',w:110,h:24,hp:35,brk:{scrap:[2,3]},col:'#8a96a2'},
  barrel:{name:'Barrel',w:30,h:30,hp:20,brk:{fuel:[0,1],scrap:[0,1]},col:'#b8502a',round:true},
  desk:{name:'Desk',w:56,h:36,hp:20,brk:{wood:[1,2]},col:'#a8845a'},
  table:{name:'Table',w:56,h:56,hp:22,brk:{wood:[1,2]},col:'#9a744a',round:true},
  stove:{name:'Stove',w:52,h:44,hp:40,brk:{scrap:[2,3]},col:'#d8d8d0'},
  bed:{name:'Bed',w:60,h:90,hp:25,brk:{wood:[1,2]},col:'#6a8ab0'},
  toolbox:{name:'Toolbox',w:42,h:28,cont:{wire:2,scrap:2,ammo:1,mutagen:.4},col:'#d4442e'},
  locker:{name:'Locker',w:36,h:32,cont:{food:1,meds:1,ammo:2,wire:1,mutagen:.4},col:'#5a86aa'},
  cabinet:{name:'Cabinet',w:52,h:30,cont:{meds:1,food:1,wood:1,ammo:1},col:'#8a7452'},
  fridge:{name:'Fridge',w:42,h:42,cont:{food:3},col:'#eef2f4'},
  register:{name:'Cash register',w:46,h:30,cont:{ammo:2,meds:1,food:1},col:'#555'},
  medcab:{name:'Medicine cabinet',w:48,h:26,cont:{meds:3,mutagen:.6},col:'#f2f8f8'},
  donation:{name:'Donation box',w:36,h:32,cont:{food:2,meds:1},col:'#9a7a32'}
};
const THEMES={
  hardware:{floor:'concrete',props:[['shelf',4],['lumber',2],['crate',3],['toolbox',2],['locker',1]]},
  substation:{floor:'concrete',props:[['transformer',4],['locker',2],['crate',2],['barrel',2],['toolbox',1]]},
  church:{floor:'wood',props:[['pew',8],['donation',2],['cabinet',1],['crate',1]]},
  drain:{floor:'concrete',props:[['pipes',4],['barrel',3],['locker',2],['crate',2]]},
  gas:{floor:'tile',props:[['shelf',3],['fridge',2],['register',1],['barrel',3],['crate',1]]},
  pharmacy:{floor:'tile',props:[['shelf',3],['medcab',3],['register',1],['crate',1]]},
  school:{floor:'lino',props:[['desk',8],['locker',3],['cabinet',1]]},
  diner:{floor:'tile',props:[['table',5],['fridge',2],['stove',2],['register',1]]},
  cannery:{floor:'concrete',props:[['crate',4],['barrel',3],['pipes',2],['fridge',1],['locker',1]]},
  bait:{floor:'wood',props:[['shelf',3],['fridge',2],['register',1],['crate',2]]},
  ranger:{floor:'wood',props:[['desk',2],['locker',2],['medcab',1],['cabinet',1],['crate',2]]},
  pump:{floor:'concrete',props:[['pipes',4],['transformer',2],['barrel',2],['toolbox',1]]},
  motel:{floor:'lino',props:[['bed',4],['cabinet',2],['fridge',1],['table',2]]},
  trailer:{floor:'lino',props:[['table',2],['cabinet',2],['fridge',1],['crate',3],['toolbox',1]]},
  ferry:{floor:'wood',props:[['crate',5],['barrel',3],['locker',1]]},
  distillery:{floor:'wood',props:[['barrel',6],['stove',1],['crate',2],['cabinet',1]]}
};
const WEAPONS={
  crowbar:{name:'Crowbar',icon:'🔧',dmg:14,range:72,cd:.42,arc:1.1,brk:1,desc:'Your starter. Pries things open.'},
  bat:{name:'Nail Bat',icon:'🏏',dmg:20,range:78,cd:.5,arc:1.3,brk:1.3,cost:{wood:3,scrap:2},desc:'Wide swing. Good when you are surrounded.'},
  machete:{name:'Machete',icon:'🗡️',dmg:21,range:80,cd:.3,arc:1.0,brk:.8,cost:{scrap:4,wire:1},desc:'Light and very fast.'},
  axe:{name:'Fire Axe',icon:'🪓',dmg:38,range:86,cd:.72,arc:1.0,brk:3,cost:{wood:2,scrap:6},desc:'Slow, huge hits. Smashes furniture in one or two swings.'},
  shotgun:{name:'Shotgun',icon:'💥',ranged:true,dmg:10,pellets:6,spread:.32,range:300,cd:.85,cost:{scrap:6,wire:2},desc:'Six pellets per shot. Uses 1 ammo.'},
  nailgun:{name:'Nail Gun',icon:'📌',ranged:true,dmg:9,pellets:1,spread:.05,range:420,cd:.16,cost:{scrap:4,wire:4},desc:'Rapid-fire nails. Uses 1 ammo per nail.'}
};
const CARTYPES={
  hatch:{name:'Hatchback',color:'#e04848',cname:'red',spd:340,hp:120,ram:1,w:58,h:30,horn:'Honk: shoves nearby monsters back'},
  pickup:{name:'Pickup Truck',color:'#3f86d0',cname:'blue',spd:290,hp:230,ram:1.6,w:72,h:34,horn:'Honk: shoves nearby monsters back'},
  cruiser:{name:'Police Cruiser',color:'#f2f2f2',cname:'police',spd:370,hp:160,ram:1.2,w:66,h:32,siren:true,horn:'Siren: stuns monsters around you'},
  icecream:{name:'Ice Cream Truck',color:'#f5a8cb',cname:'pink',spd:240,hp:270,ram:1.9,w:82,h:40,music:true,horn:'Jingle: monsters nearby freeze and stare'}
};
const WRECK_COLORS=['#b08a62','#8a9aa6','#94a470','#b86a52','#9a88b0','#c0a46e'];
