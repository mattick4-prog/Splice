// ================= MORE TOWNS, BIOMES, MONSTERS =================
Object.assign(MONSTERS,{
  copycat:{name:'The Copycat',power:'multiply',hp:70,spd:95,dmg:9,r:16,color:'#5a6470',eye:'#ffffff',genes:['multiply','umbral','luck'],shape:'copy',splits:true},
  // Frostfall (snow)
  yeti:{name:'Frost Brute',power:'icelance',hp:120,spd:62,dmg:14,r:23,color:'#dfeaf2',eye:'#3aa8ff',genes:['icelance','frostnova','coldblood'],shape:'brute',abs:[{k:'shoot',cd:2.8,spd:420,dmg:9,col:'#bff0ff',pst:'slow'}]},
  rime:{name:'Rime Wraith',power:'frozenground',hp:70,spd:80,dmg:10,r:16,color:'#a8d8ff',eye:'#ffffff',genes:['frozenground','cryoshell','coldblood'],shape:'wraith',abs:[{k:'zone',cd:5,r:70,dps:5,col:'#bff0ff',kind:'tar'}]},
  ram:{name:'Avalanche Ram',power:'charge',hp:110,spd:70,dmg:15,r:21,color:'#b8a890',eye:'#ffcf6a',genes:['charge','quake','thickhide'],shape:'quad',abs:[{k:'dash',cd:3.5,spd:600}]},
  moth:{name:'Snow Moth',power:'blizzard',hp:50,spd:100,dmg:7,r:15,color:'#eef4ff',eye:'#7fd6ff',genes:['blizzard','echoloc','glow'],shape:'bird',abs:[{k:'zone',cd:5,r:80,dps:6,col:'#dff6ff'}]},
  wolf:{name:'Pale Wolf',power:'howl',hp:65,spd:125,dmg:11,r:16,color:'#c8ccd4',eye:'#ff6a5a',genes:['howl','snap','swift'],shape:'quad',abs:[{k:'leap',cd:4}]},
  golemice:{name:'Crystal Golem',power:'boulder',hp:150,spd:40,dmg:16,r:25,color:'#8ad8e8',eye:'#ffffff',genes:['boulder','ironfist','thickhide'],shape:'golem',abs:[{k:'nova',cd:5,r:110,dmg:12,col:'#bff0ff',stun:.7}]},
  shard:{name:'Ice Shard',power:'icelance',hp:22,spd:120,dmg:5,r:9,color:'#bff0ff',eye:'#3aa8ff',genes:['icelance','frostnova'],shape:'spiky',minion:true},
  king:{name:'The Hollow King',power:'zero',hp:950,spd:38,dmg:22,r:52,color:'#9fd0e8',eye:'#3aa8ff',genes:['zero'],boss:true,shape:'boss',minionType:'shard',abs:[{k:'nova',cd:7,r:200,dmg:16,col:'#bff0ff',stun:1},{k:'shoot',cd:3,spd:380,dmg:10,col:'#bff0ff',n:5,spread:.35,pst:'slow'}]},
  // Dustbowl (desert)
  scarab:{name:'Sand Scarab',power:'locust',hp:55,spd:90,dmg:9,r:15,color:'#c8a24a',eye:'#ff4d3a',genes:['locust','acidspit','toxicblood'],shape:'bug',abs:[{k:'shoot',cd:2.6,spd:380,dmg:7,col:'#a6d65a'}]},
  worm:{name:'Dune Worm',power:'tongue',hp:130,spd:70,dmg:16,r:22,color:'#c88a5a',eye:'#ffd166',genes:['tongue','quake','regen'],shape:'serpent',abs:[{k:'dash',cd:4,spd:520,hide:1}]},
  mirage:{name:'Heat Mirage',power:'shroud',hp:60,spd:95,dmg:12,r:16,color:'#ffb066',eye:'#fff2a0',genes:['shroud','ember','firewalker'],shape:'wraith',abs:[{k:'invis'},{k:'nova',cd:5,r:90,dmg:10,col:'#ff7a2f',kind:'fire'}]},
  vulture:{name:'Bone Vulture',power:'umbral',hp:50,spd:130,dmg:9,r:14,color:'#6a5a4a',eye:'#ff4d3a',genes:['umbral','shadowstep','nighteyes'],shape:'bird',abs:[{k:'dash',cd:3,spd:560}]},
  cactus:{name:'Cactus Fiend',power:'bramble',hp:100,spd:45,dmg:12,r:20,color:'#5a9a4a',eye:'#ff6a8a',genes:['bramble','seedbomb','thornskin'],shape:'spiky',abs:[{k:'shoot',cd:2.5,spd:400,dmg:6,col:'#e6cf86',n:3,spread:.25}]},
  tick:{name:'Blood Tick',power:'bloodpact',hp:70,spd:85,dmg:11,r:16,color:'#8a2a3a',eye:'#ffd0d8',genes:['bloodpact','crimsonnova','sanguine'],shape:'bug',abs:[{k:'leap',cd:4}]},
  larva:{name:'Scorpling',power:'plaguebite',hp:24,spd:115,dmg:5,r:10,color:'#b8903a',eye:'#ff4d3a',genes:['plaguebite','miasma'],shape:'bug',minion:true},
  scorpion:{name:'The Scorpion King',power:'pandemic',hp:1050,spd:45,dmg:24,r:54,color:'#a8742a',eye:'#ff4d3a',genes:['pandemic'],boss:true,shape:'boss',minionType:'larva',abs:[{k:'shoot',cd:2.6,spd:420,dmg:11,col:'#a6d65a',n:3,spread:.2},{k:'zone',cd:6,r:110,dps:9,col:'#a6d65a'}]},
  // Old Haven (ruined city)
  golem:{name:'Rebar Golem',power:'spikewall',hp:140,spd:42,dmg:17,r:24,color:'#7a7e86',eye:'#ff9f40',genes:['spikewall','ironfist','thickhide'],shape:'golem',abs:[{k:'nova',cd:5,r:100,dmg:12,col:'#c8d0d8',stun:.6}]},
  signal:{name:'Signal Ghost',power:'mindblast',hp:55,spd:90,dmg:9,r:15,color:'#c8ffd8',eye:'#d6ff70',genes:['mindblast','confusion','mindshield'],shape:'wraith',abs:[{k:'shoot',cd:2.4,spd:460,dmg:8,col:'#d6ff70',pst:'stun'},{k:'invis'}]},
  ratking:{name:'Rat King',power:'ratpack',hp:90,spd:70,dmg:10,r:19,color:'#7a6a5a',eye:'#ff4d3a',genes:['ratpack','plaguebite','luck'],shape:'blob',abs:[{k:'summon',cd:6,type:'rat',n:2,max:6}]},
  siren:{name:'Car Alarm Siren',power:'banshee',hp:75,spd:70,dmg:10,r:17,color:'#e84a4a',eye:'#ffffff',genes:['banshee','resonance','echo'],shape:'blob',abs:[{k:'nova',cd:5,r:130,dmg:6,col:'#f2dc7a',stun:.8}]},
  spark:{name:'Live Wire',power:'balllightning',hp:55,spd:115,dmg:9,r:14,color:'#4ab8ff',eye:'#ffffff',genes:['balllightning','thunderclap','swift'],shape:'serpent',abs:[{k:'shoot',cd:2.2,spd:300,dmg:8,col:'#7fd6ff',homing:1}]},
  mannequin:{name:'Mannequin',power:'puppet',hp:80,spd:75,dmg:12,r:16,color:'#e8d8c8',eye:'#ff2a4a',genes:['puppet','fearaura','mindshield'],shape:'brute',abs:[{k:'hex',cd:6}]},
  rat:{name:'Sewer Rat',power:'ratpack',hp:18,spd:130,dmg:4,r:8,color:'#8a7a6a',eye:'#ff4d3a',genes:['ratpack','plaguebite'],shape:'quad',minion:true},
  broadcast:{name:'The Broadcast',power:'dominate',hp:1100,spd:30,dmg:24,r:56,color:'#5a6a7a',eye:'#d6ff70',genes:['dominate'],boss:true,shape:'boss',minionType:'rat',abs:[{k:'nova',cd:6,r:230,dmg:14,col:'#d6ff70',stun:.9},{k:'shoot',cd:2.4,spd:420,dmg:10,col:'#d6ff70',n:4,spread:.3,pst:'stun'}]},
  // State Wardens
  warden1:{name:'The Hollow Warden',power:'sonicboom',hp:1800,spd:55,dmg:26,r:60,color:'#3a3046',eye:'#ff3b5c',genes:['sonicboom','titan','eclipse'],boss:true,warden:true,shape:'warden',minionType:'brat',abs:[{k:'nova',cd:6,r:240,dmg:20,col:'#ff3b5c',stun:.8},{k:'shoot',cd:2.2,spd:430,dmg:12,col:'#ff7be0',n:6,spread:.3},{k:'dash',cd:7,spd:620}]},
  warden2:{name:'The Mesa Warden',power:'hivemind',hp:2400,spd:58,dmg:30,r:64,color:'#5a2a1a',eye:'#ffd166',genes:['hivemind','frenzy','phoenix','stormcall'],boss:true,warden:true,shape:'warden',minionType:'larva',abs:[{k:'nova',cd:5.5,r:250,dmg:22,col:'#ff7a2f',stun:.8,kind:'fire'},{k:'shoot',cd:2,spd:450,dmg:13,col:'#ffd166',n:7,spread:.3},{k:'dash',cd:6,spd:660},{k:'zone',cd:7,r:140,dps:10,col:'#ff7a2f',kind:'fire'}]}
});
const BLD3=[
  {id:'lodge',name:'Ski Lodge',x:240,y:200,w:260,h:170,roof:'#6a4a3a',wall:'#e8dcc8',sign:'#c0392b',monster:'yeti'},
  {id:'rink',name:'Ice Rink',x:930,y:130,w:230,h:150,roof:'#5a7a9a',wall:'#e0e8f0',sign:'#2f80c4',monster:'rime'},
  {id:'chapel',name:'Snow Chapel',x:1620,y:160,w:230,h:230,roof:'#5e4a7a',wall:'#f0ece8',sign:'#8f6bd1',monster:'moth'},
  {id:'mine',name:'Old Mine',x:170,y:760,w:220,h:150,roof:'#4a4a4a',wall:'#9a9088',sign:'#a0602a',monster:'golemice'},
  {id:'plow',name:'Plow Garage',x:2020,y:600,w:230,h:150,roof:'#c89a2a',wall:'#d8d0c0',sign:'#e8a020',monster:'ram'},
  {id:'clinic',name:'Clinic',x:420,y:1260,w:230,h:160,roof:'#2a7a7a',wall:'#f0f4f4',sign:'#27ae60',monster:'rime'},
  {id:'gstore',name:'General Store',x:1060,y:1330,w:320,h:190,roof:'#8a3a2a',wall:'#e0c8a8',sign:'#c0392b',monster:'wolf'},
  {id:'tcabin',name:'Trapper\'s Cabin',x:1640,y:1320,w:240,h:160,roof:'#5a3a22',wall:'#a87a52',sign:'#8a5a2a',monster:'wolf'},
  {id:'falls',name:'The Frozen Falls',x:2060,y:1000,w:200,h:200,monster:'king',boss:true,sign:'#9fd0e8'}
];
const BLD4=[
  {id:'rt66',name:'Route 66 Diner',x:240,y:200,w:260,h:170,roof:'#c83a3a',wall:'#f0e0c0',sign:'#2fa0c0',monster:'scarab'},
  {id:'sheriff',name:'Sheriff\'s Office',x:930,y:130,w:230,h:150,roof:'#6a5a4a',wall:'#d8c098',sign:'#c8a020',monster:'vulture'},
  {id:'dchurch',name:'Church of the Dunes',x:1620,y:160,w:230,h:230,roof:'#a87a4a',wall:'#f0e0c8',sign:'#c06030',monster:'mirage'},
  {id:'feed',name:'Feed Store',x:170,y:760,w:220,h:150,roof:'#8a6a3a',wall:'#d8b888',sign:'#6a8a2a',monster:'tick'},
  {id:'lastgas',name:'Last Chance Gas',x:2020,y:600,w:230,h:150,roof:'#d0402a',wall:'#f0e8d8',sign:'#e74c3c',monster:'worm'},
  {id:'motel9',name:'Motel 9',x:420,y:1260,w:230,h:160,roof:'#3a8a8a',wall:'#f0d8c0',sign:'#d84a8a',monster:'cactus'},
  {id:'radio',name:'Radio Shack',x:1060,y:1330,w:320,h:190,roof:'#5a5a6a',wall:'#d0c8b8',sign:'#3a7ab0',monster:'scarab'},
  {id:'trailer2',name:'Trailer Lot',x:1640,y:1320,w:240,h:160,roof:'#a8a090',wall:'#e0d8c8',sign:'#9a7a4a',monster:'tick'},
  {id:'well',name:'The Dry Well',x:2060,y:1000,w:200,h:200,monster:'scorpion',boss:true,sign:'#ffb066'}
];
const BLD5=[
  {id:'apts',name:'Apartments',x:240,y:200,w:260,h:170,roof:'#5a5a62',wall:'#b8a898',sign:'#8a6a4a',monster:'mannequin'},
  {id:'precinct',name:'Police Precinct',x:930,y:130,w:230,h:150,roof:'#3a4a6a',wall:'#c8ccd4',sign:'#2a5ab0',monster:'signal'},
  {id:'hospital',name:'Hospital',x:1620,y:160,w:230,h:230,roof:'#e0e4e8',wall:'#f4f6f8',sign:'#d63a3a',monster:'siren'},
  {id:'subway',name:'Subway Entrance',x:170,y:760,w:220,h:150,roof:'#3a3a3a',wall:'#8a8a82',sign:'#e8b020',monster:'ratking'},
  {id:'electro',name:'Electronics Store',x:2020,y:600,w:230,h:150,roof:'#2a2a3a',wall:'#c0c4cc',sign:'#4ab8ff',monster:'spark'},
  {id:'market',name:'Supermarket',x:420,y:1260,w:230,h:160,roof:'#a83a2a',wall:'#f0e8d8',sign:'#27ae60',monster:'ratking'},
  {id:'library',name:'Library',x:1060,y:1330,w:320,h:190,roof:'#6a3a2a',wall:'#d8c8a8',sign:'#8a5a2a',monster:'mannequin'},
  {id:'garage',name:'Parking Garage',x:1640,y:1320,w:240,h:160,roof:'#6a6a6a',wall:'#9a9a94',sign:'#e8a020',monster:'golem'},
  {id:'btower',name:'Broadcast Tower',x:2060,y:1000,w:200,h:200,monster:'broadcast',boss:true,sign:'#d6ff70'}
];
Object.assign(THEMES,{
  lodge:{floor:'wood',props:[['table',4],['bed',2],['fridge',1],['cabinet',2],['crate',1]]},
  rink:{floor:'concrete',props:[['pew',4],['locker',3],['crate',2]]},
  chapel:{floor:'wood',props:[['pew',7],['donation',2],['cabinet',1]]},
  mine:{floor:'concrete',props:[['lumber',3],['barrel',3],['crate',3],['toolbox',1]]},
  plow:{floor:'concrete',props:[['toolbox',2],['barrel',3],['pipes',2],['locker',1]]},
  clinic:{floor:'tile',props:[['medcab',3],['bed',2],['desk',1],['cabinet',1]]},
  gstore:{floor:'wood',props:[['shelf',4],['register',1],['fridge',2],['crate',2]]},
  tcabin:{floor:'wood',props:[['table',1],['bed',1],['cabinet',2],['lumber',2],['fridge',1]]},
  rt66:{floor:'tile',props:[['table',5],['fridge',2],['stove',2],['register',1]]},
  sheriff:{floor:'lino',props:[['desk',3],['locker',3],['cabinet',1]]},
  dchurch:{floor:'wood',props:[['pew',7],['donation',2]]},
  feed:{floor:'wood',props:[['lumber',3],['crate',4],['shelf',2]]},
  lastgas:{floor:'tile',props:[['shelf',3],['fridge',2],['register',1],['barrel',2]]},
  motel9:{floor:'lino',props:[['bed',4],['cabinet',2],['fridge',1]]},
  radio:{floor:'lino',props:[['transformer',3],['shelf',2],['desk',2],['toolbox',1]]},
  trailer2:{floor:'lino',props:[['table',2],['cabinet',2],['fridge',1],['crate',2],['toolbox',1]]},
  apts:{floor:'wood',props:[['bed',3],['table',2],['fridge',1],['cabinet',2]]},
  precinct:{floor:'lino',props:[['desk',4],['locker',4],['cabinet',1]]},
  hospital:{floor:'tile',props:[['bed',4],['medcab',4],['desk',1]]},
  subway:{floor:'concrete',props:[['pipes',3],['crate',3],['barrel',2],['locker',1]]},
  electro:{floor:'tile',props:[['transformer',3],['shelf',3],['register',1]]},
  market:{floor:'tile',props:[['shelf',5],['fridge',2],['register',1]]},
  library:{floor:'wood',props:[['desk',4],['shelf',4],['cabinet',1]]},
  garage:{floor:'concrete',props:[['barrel',4],['crate',3],['toolbox',2]]}
});
TOWNS.forEach(t=>{t.biome=t.swamp?'swamp':'town';});
TOWNS.push(
  {name:'Frostfall',blds:BLD3,raid:['yeti','rime','ram','moth','wolf','golemice'],boss:'king',lair:'the Frozen Falls',outposts:['lodge','rink','chapel','plow','clinic','gstore'],lvl:1.75,crate:.14,biome:'snow',ground:'#dfe6ea',patch:'#f2f6f8'},
  {name:'Hollow Dam',arena:true,blds:[],raid:['brat','shard','drowned'],boss:'warden1',lair:'Hollow Dam',outposts:[],lvl:1.9,crate:0,biome:'dam',ground:'#7a7f82',patch:'#8a8f92'},
  {name:'Dustbowl',blds:BLD4,raid:['scarab','worm','mirage','vulture','cactus','tick'],boss:'scorpion',lair:'the Dry Well',outposts:['rt66','sheriff','dchurch','lastgas','motel9','radio'],lvl:2.1,crate:.15,biome:'desert',ground:'#d8b878',patch:'#e4c88a'},
  {name:'Old Haven',blds:BLD5,raid:['golem','signal','ratking','siren','spark','mannequin'],boss:'broadcast',lair:'the Broadcast Tower',outposts:['apts','precinct','hospital','electro','market','library'],lvl:2.4,crate:.16,biome:'city',ground:'#6a6c6e',patch:'#7a7c7e'},
  {name:'Mesa Gate',arena:true,blds:[],raid:['larva','rat','shard'],boss:'warden2',lair:'Mesa Gate',outposts:[],lvl:2.6,crate:0,biome:'mesa',ground:'#b86a3a',patch:'#c87a4a'}
);
const STATES=[
  {name:'The Hollows',towns:[0,1,2,3],color:'#6a9a5a',x:120,y:90,w:330,h:260},
  {name:'Red Mesa',towns:[4,5,6],color:'#c8743a',x:470,y:150,w:300,h:240},
  {name:'The Coast',locked:true,color:'#4a7ab0',x:110,y:370,w:300,h:170},
  {name:'The Rust Belt',locked:true,color:'#8a8a9a',x:440,y:410,w:330,h:150}
];
const TOWN_POS=[[200,180],[300,300],[390,170],[350,95],[560,240],[680,320],[700,200]];
const COUNTRIES=[{name:'The United Wastes',here:true},{name:'Japan',hint:'yokai-style monsters'},{name:'Scotland',hint:'loch beasts and bog wraiths'},{name:'Mexico',hint:'chupacabras'},{name:'Egypt',hint:'sand-scarab swarms'}];
