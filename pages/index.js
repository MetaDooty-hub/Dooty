import { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = 'https://fllbxwcmpifwtptkzjva.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGJ4d2NtcGlmd3RwdGt6anZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjgzNjQsImV4cCI6MjA5MDA0NDM2NH0.hLUFdtpoBXz7quAUs12WtcisbUk7Eu079sKfIcPj3bQ';

const TABS = ['AR', 'SMG', 'LMG', 'Sniper', 'Shotgun', 'DMR', 'Other'];
const MODES = ['Warzone', 'Multiplayer'];

const GAME_BADGE = {
  BO7:     { label: 'BO7', color: '#ff4444', bg: '#ff444422' },
  BO6:     { label: 'BO6', color: '#ff8c00', bg: '#ff8c0022' },
  Warzone: { label: 'WZ',  color: '#00e5ff', bg: '#00e5ff22' },
};

const ATTACHMENT_SLOTS = {
  AR: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','Muzzle Brake','Sonic Suppressor','BO7 Flash Hider','BO7 Compensator','BO7 Muzzle Brake','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','CHF Barrel','Short Light Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel','BO7 Short Barrel','MFS Precision Barrel'],
    Optic: ['None','Slate Reflector','Cronen Mini Red Dot','VLK 4.0x','Corio Eagleseye 2.5x','MK. 23 Reflector','JAK Glassless Optic','BO7 Reflex Sight','BO7 Holographic','BO7 2x Scope','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Ranger Foregrip','Commando Foregrip','Merc Foregrip','BO7 Vertical Grip','BO7 Angled Grip','MFS Grenade Launcher'],
    Magazine: ['None','30 Round Mag','45 Round Mag','60 Round Mag','Extended Mag','Fast Mag','Drum Mag','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag','BO7 Drum Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','Canted Vibro-Dot 7','BO7 Laser Sight','BO7 Tac Laser','MFS Motion Strike Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','BRT Grip Tape','D15 Combat Grip','BO7 Grip Tape','BO7 Combat Grip','MFS Ergonomic Grip'],
    Stock: ['None','No Stock','Demo Cleanshot Stock','FT Tac-Elite Stock','BO7 Heavy Stock','BO7 Light Stock','BO7 Folding Stock','MFS Tactical Stock','MFS Striker Tactical Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Burst','Single','3-Round Burst','4-Round Burst'],
  },
  SMG: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','BO7 Flash Hider','BO7 Compensator','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','Short Light Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Short Barrel','MFS Precision Barrel'],
    Optic: ['None','Slate Reflector','Cronen Mini Red Dot','MK. 23 Reflector','JAK Glassless Optic','BO7 Reflex Sight','BO7 Holographic','BO7 2x Scope','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Commando Foregrip','Merc Foregrip','BO7 Vertical Grip','BO7 Angled Grip'],
    Magazine: ['None','24 Round Mag','32 Round Mag','48 Round Mag','Extended Mag','Fast Mag','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','BO7 Laser Sight','BO7 Tac Laser','MFS Precision Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','D15 Combat Grip','BO7 Grip Tape','BO7 Combat Grip'],
    Stock: ['None','No Stock','Folding Stock','Collapsed Stock','BO7 Heavy Stock','BO7 Light Stock','BO7 Folding Stock','MFS Tactical Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Burst','3-Round Burst'],
  },
  LMG: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','BO7 Flash Hider','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','BO7 Heavy Barrel','BO7 Extended Barrel','MFS Precision Barrel'],
    Optic: ['None','Slate Reflector','VLK 4.0x','Corio Eagleseye 2.5x','MK. 23 Reflector','BO7 Reflex Sight','BO7 4x Scope','BO7 6x Scope','MFS Thermal'],
    Underbarrel: ['None','XTEN Drop Grip','Ranger Foregrip','Commando Foregrip','BO7 Vertical Grip','MFS Grenade Launcher'],
    Magazine: ['None','75 Round Belt','100 Round Belt','Extended Belt','Drum Mag','BO7 Extended Mag','BO7 Large Mag','BO7 Drum Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','MFS Motion Strike Laser','BO7 Tac Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','D15 Combat Grip','BO7 Grip Tape'],
    Stock: ['None','LM Stockless Mod','Demo Cleanshot Stock','BO7 Heavy Stock','BO7 Light Stock','MFS Tactical Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Dual Fire Mode (Sokol 545)'],
  },
  Sniper: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','BO7 Flash Hider','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','BO7 Heavy Barrel','BO7 Extended Barrel','MFS Precision Barrel'],
    Optic: ['None','Schlager 4.0x','Forge Tac Delta 4','SP-X 80 6.6x','Victus V20 10x','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Comb: ['None','Aim-Assist Comb','Pro-Comb','Steady-Aim Comb','BO7 Aim-Assist Comb','BO7 Pro Comb'],
    Magazine: ['None','Extended Mag','Fast Mag','BO7 Extended Mag','BO7 Fast Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','BO7 Laser Sight','MFS Precision Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','BO7 Grip Tape','MFS Ergonomic Grip'],
    Stock: ['None','FSS Merc Stock','FT Tac-Elite Stock','BO7 Heavy Stock','BO7 Light Stock','MFS Tactical Stock'],
    'Fire Mode': ['None','Bolt Action','Semi Auto','3-Round Burst (XR-3 Ion)'],
  },
  Shotgun: {
    Muzzle: ['None','Shadowstrike Suppressor','Compensator','Choke','Full Choke','BO7 Compensator','BO7 Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Short Light Barrel','Extended Barrel','BO7 Heavy Barrel','BO7 Extended Barrel'],
    Optic: ['None','Slate Reflector','Cronen Mini Red Dot','BO7 Reflex Sight','BO7 Holographic'],
    Underbarrel: ['None','XTEN Drop Grip','Commando Foregrip','BO7 Vertical Grip','BO7 Angled Grip'],
    Magazine: ['None','Extended Tube','Fast Loader','Drum Shell Holder','BO7 Extended Mag','BO7 Large Mag'],
    Laser: ['None','FSS OLE-V Laser','Canted Vibro-Dot 7','BO7 Laser Sight','BO7 Tac Laser'],
    'Rear Grip': ['None','Commando Grip','D15 Combat Grip','BO7 Grip Tape'],
    Stock: ['None','No Stock','Stockless Pistol Grip','BO7 Heavy Stock','BO7 Light Stock'],
    'Fire Mode': ['None','Pump Action','Semi Auto','Full Auto','Double Barrel (Echo 12)'],
  },
  DMR: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','BO7 Flash Hider','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','BO7 Heavy Barrel','BO7 Extended Barrel','MFS Precision Barrel'],
    Optic: ['None','Schlager 4.0x','Corio Eagleseye 2.5x','VLK 4.0x','MK. 23 Reflector','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Commando Foregrip','Ranger Foregrip','BO7 Vertical Grip'],
    Magazine: ['None','Extended Mag','Fast Mag','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','BO7 Laser Sight','BO7 Tac Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','BO7 Grip Tape','MFS Ergonomic Grip'],
    Stock: ['None','No Stock','FT Tac-Elite Stock','BO7 Heavy Stock','BO7 Light Stock','MFS Striker Tactical Stock'],
    'Fire Mode': ['None','Semi Auto','Burst','Full Auto','4-Round Burst (M8A1)','Penta Burst (Swordfish A1)'],
  },
  Other: {
    Muzzle: ['None','Suppressor','Compensator','Flash Hider'],
    Barrel: ['None','Extended Barrel','Short Barrel'],
    Optic: ['None','Slate Reflector','Red Dot','BO7 Reflex Sight'],
    Underbarrel: ['None','Foregrip','BO7 Vertical Grip'],
    Magazine: ['None','Extended Mag','Fast Mag'],
    Laser: ['None','Laser Sight','BO7 Tac Laser'],
    'Rear Grip': ['None','Grip Tape'],
    Stock: ['None','No Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Burst'],
  },
};

const SLOT_GROUPS = {
  core: ['Muzzle','Barrel','Optic','Underbarrel','Comb','Magazine'],
  handle: ['Laser','Rear Grip','Stock'],
  mods: ['Fire Mode'],
};

const SLOT_COLORS = {
  Muzzle:'#00e5ff',Barrel:'#00e5ff',Optic:'#00e5ff',
  Underbarrel:'#00e5ff',Comb:'#00e5ff',Magazine:'#00e5ff',
  Laser:'#c084fc','Rear Grip':'#c084fc',Stock:'#c084fc',
  'Fire Mode':'#ff8c00',
};

const TIER_COLORS = {
  S:{bg:'#ff4444',text:'#fff',label:'S TIER'},
  A:{bg:'#ff8c00',text:'#fff',label:'A TIER'},
  B:{bg:'#ffd700',text:'#000',label:'B TIER'},
  C:{bg:'#555',text:'#fff',label:'C TIER'},
};

// ── SVG GUN SILHOUETTES ───────────────────────────────────────────────────────
const GC='#8b949e',GL='#adb5bd',GD='#6c737a',GA='#00e5ff',GV='#c084fc',GO='#ff8c00';

function drawGunSVG(cls,atts={}){
  const muz=atts.Muzzle&&atts.Muzzle!=='None';
  const bar=atts.Barrel&&atts.Barrel!=='None';
  const opt=atts.Optic&&atts.Optic!=='None';
  const und=(atts.Underbarrel&&atts.Underbarrel!=='None')||(atts.Comb&&atts.Comb!=='None');
  const mag=atts.Magazine&&atts.Magazine!=='None';
  const las=atts.Laser&&atts.Laser!=='None';
  const grip=atts['Rear Grip']&&atts['Rear Grip']!=='None';
  const stk=atts.Stock&&atts.Stock!=='None';
  const fmode=atts['Fire Mode']&&atts['Fire Mode']!=='None';
  const supp=muz&&(atts.Muzzle||'').toLowerCase().includes('suppressor');
  const bigOpt=opt&&!!(atts.Optic||'').match(/4x|6x|10x|eagleseye|thermal|eagle|victus|forge|schlager/i);
  const bigMag=mag&&!!(atts.Magazine||'').match(/60|100|drum|belt|large/i);
  const noStk=stk&&!!(atts.Stock||'').match(/no stock|stockless|pistol grip/i);
  const foldStk=stk&&!!(atts.Stock||'').match(/fold|collapse/i);
  const fns={AR:drawAR,SMG:drawSMG,LMG:drawLMG,Sniper:drawSniper,Shotgun:drawShotgun,DMR:drawDMR};
  return (fns[cls]||drawAR)(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag);
}

function gunViewBox(cls){
  if(cls==='SMG') return '0 0 420 66';
  if(cls==='Shotgun') return '0 0 460 66';
  if(cls==='AR') return '0 0 540 68';
  if(cls==='DMR') return '0 0 580 68';
  if(cls==='LMG') return '0 0 620 72';
  if(cls==='Sniper') return '0 0 660 66';
  return '0 0 540 68';
}

function drawSMG(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?52:36,mL=muz?(supp?26:12):0;let s='';
  if(!noStk){s+=`<rect x="6" y="20" width="44" height="4" rx="2" fill="${stk?GA:GC}"/><rect x="6" y="36" width="44" height="4" rx="2" fill="${stk?GA:GC}"/>`;s+=`<rect x="4" y="20" width="4" height="20" rx="2" fill="${GD}"/><rect x="18" y="20" width="2" height="20" rx="1" fill="${GD}"/>`;s+=`<circle cx="50" cy="22" r="3" fill="${GL}"/><circle cx="50" cy="22" r="1.5" fill="${GD}"/>`;s+=`<circle cx="50" cy="38" r="3" fill="${GL}"/><circle cx="50" cy="38" r="1.5" fill="${GD}"/>`;}
  s+=`<rect x="54" y="20" width="54" height="10" rx="2" fill="${GC}"/><rect x="56" y="21" width="50" height="5" rx="1" fill="${GL}"/>`;
  if(fmode)s+=`<rect x="58" y="25" width="5" height="3" rx="1" fill="${GO}"/>`;
  s+=`<path d="M90,26 Q90,42 82,44 Q76,45 72,39 L70,33" stroke="${GD}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M96,24 L106,24 L110,44 Q110,51 104,52 L94,52 Q88,52 86,45 L88,24 Z" fill="${grip?GA:GD}"/>`;
  for(let i=0;i<3;i++)s+=`<rect x="90" y="${30+i*4}" width="12" height="1.5" fill="${GD}" opacity="0.6"/>`;
  s+=`<rect x="68" y="28" width="16" height="3" fill="${GD}"/>`;
  const mh=bigMag?28:20;
  s+=`<path d="M70,28 L86,28 L87,${28+mh} Q87,${40+mh} 83,${42+mh} L73,${42+mh} Q69,${40+mh} 69,${28+mh} Z" fill="${mag?GA:GD}"/>`;
  s+=`<rect x="77" y="32" width="2" height="${mh-4}" rx="1" fill="${GD}"/><rect x="70" y="${50+mh}" width="16" height="2" rx="1" fill="${GC}"/>`;
  s+=`<rect x="56" y="11" width="52" height="10" rx="2" fill="${GL}"/><rect x="58" y="12" width="48" height="5" rx="1" fill="${GL}"/>`;
  s+=`<rect x="70" y="14" width="22" height="5" rx="1" fill="${GC}"/>`;
  s+=`<rect x="104" y="9" width="7" height="3" rx="1" fill="${GD}"/><rect x="107" y="6" width="3" height="5" rx="1" fill="${GD}"/>`;
  s+=`<rect x="58" y="7" width="50" height="5" rx="1" fill="${GD}"/><rect x="58" y="7" width="50" height="2" rx="1" fill="${GC}"/>`;
  for(let i=0;i<8;i++)s+=`<rect x="${61+i*6}" y="7" width="2" height="5" fill="${GD}" opacity="0.7"/>`;
  if(opt){const ow=bigOpt?34:20,oh=bigOpt?14:11;s+=`<rect x="62" y="${3-(bigOpt?3:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="65" y="${5-(bigOpt?3:0)}" width="${ow-6}" height="${oh-5}" rx="2" fill="${GD}" opacity="0.7"/>`;s+=`<circle cx="${62+ow/2}" cy="${5-(bigOpt?3:0)+(oh-5)/2}" r="${bigOpt?4:2.5}" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="65" y="${3+oh-(bigOpt?3:0)}" width="3" height="4" rx="1" fill="${GD}"/>`;s+=`<rect x="${62+ow-6}" y="${3+oh-(bigOpt?3:0)}" width="3" height="4" rx="1" fill="${GD}"/>`;}
  s+=`<rect x="110" y="11" width="70" height="16" rx="2" fill="${GC}"/><rect x="110" y="12" width="70" height="7" rx="1" fill="${GL}"/><rect x="110" y="25" width="70" height="3" rx="1" fill="${GD}"/>`;
  for(let i=0;i<6;i++){s+=`<rect x="${114+i*11}" y="13" width="7" height="4" rx="1" fill="${GD}" opacity="0.7"/>`;s+=`<rect x="${114+i*11}" y="21" width="7" height="4" rx="1" fill="${GD}" opacity="0.7"/>`;}
  if(las&&!und){s+=`<rect x="118" y="25" width="10" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="128" y1="27" x2="148" y2="27" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(und){s+=`<rect x="116" y="27" width="14" height="14" rx="2" fill="${GA}" opacity="0.85"/>`;if(las)s+=`<rect x="116" y="41" width="10" height="4" rx="2" fill="${GV}" opacity="0.9"/>`;}
  s+=`<rect x="180" y="16" width="${bL}" height="6" rx="2" fill="${bar?GA:GL}"/><rect x="180" y="17" width="${bL}" height="2" rx="0" fill="${GL}" opacity="0.5"/>`;
  s+=`<rect x="178" y="14" width="4" height="10" rx="1" fill="${GD}"/>`;
  if(muz){const mx=180+bL;if(supp){s+=`<rect x="${mx}" y="13" width="${mL}" height="12" rx="5" fill="${GA}"/>`;for(let i=0;i<4;i++)s+=`<rect x="${mx+4+i*5}" y="13" width="2" height="12" fill="${GD}" opacity="0.4"/>`;}else{s+=`<rect x="${mx}" y="14" width="${mL}" height="10" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx}" y="14" width="2" height="3" fill="${GD}"/><rect x="${mx}" y="20" width="2" height="3" fill="${GD}"/>`;s+=`<rect x="${mx+mL-2}" y="14" width="2" height="10" rx="1" fill="${GL}"/>`;}}
  return s;
}

function drawAR(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?192:164,mL=muz?(supp?38:16):0;let s='';
  if(!noStk){const sw=foldStk?36:54;s+=`<rect x="6" y="26" width="${sw}" height="8" rx="2" fill="${stk?GA:GC}"/>`;s+=`<rect x="4" y="22" width="5" height="16" rx="2" fill="${GD}"/>`;for(let i=0;i<7;i++)s+=`<rect x="${12+i*6}" y="26" width="2" height="8" fill="${GD}" opacity="0.5"/>`;s+=`<rect x="${6+sw}" y="24" width="5" height="12" rx="1" fill="${GD}"/>`;}
  const rx=noStk?20:foldStk?48:66;
  s+=`<rect x="${rx}" y="24" width="70" height="12" rx="2" fill="${GC}"/><rect x="${rx+2}" y="25" width="66" height="6" rx="1" fill="${GL}"/>`;
  if(fmode)s+=`<rect x="${rx+4}" y="29" width="6" height="3" rx="1" fill="${GO}"/>`;
  s+=`<rect x="${rx+14}" y="34" width="4" height="3" rx="1" fill="${GD}"/>`;
  s+=`<rect x="${rx+62}" y="30" width="4" height="5" rx="1" fill="${GD}"/>`;
  s+=`<path d="M${rx+46},26 Q${rx+46},42 ${rx+38},44 Q${rx+31},45 ${rx+27},39 L${rx+25},32" stroke="${GD}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="M${rx+50},32 L${rx+60},32 L${rx+64},52 Q${rx+64},58 ${rx+58},59 L${rx+48},59 Q${rx+42},59 ${rx+40},52 L${rx+44},32 Z" fill="${grip?GA:GD}"/>`;
  for(let i=0;i<4;i++)s+=`<rect x="${rx+44}" y="${38+i*4}" width="14" height="1.5" fill="${GD}" opacity="0.6"/>`;
  const mh=bigMag?36:26;
  s+=`<path d="M${rx+22},34 L${rx+44},34 L${rx+45},46 Q${rx+45},${58+mh/3} ${rx+40},${60+mh/3} L${rx+26},${60+mh/3} Q${rx+21},${58+mh/3} ${rx+21},46 Z" fill="${mag?GA:GD}"/>`;
  s+=`<rect x="${rx+31}" y="38" width="2" height="${mh-6}" rx="1" fill="${GD}"/>`;
  s+=`<rect x="${rx+22}" y="${60+mh/3}" width="22" height="3" rx="1" fill="${GC}"/>`;
  s+=`<rect x="${rx+2}" y="14" width="68" height="12" rx="2" fill="${GL}"/><rect x="${rx+4}" y="15" width="64" height="6" rx="1" fill="${GL}"/>`;
  s+=`<rect x="${rx+16}" y="18" width="28" height="6" rx="1" fill="${GC}"/>`;
  s+=`<rect x="${rx+42}" y="19" width="2" height="5" rx="1" fill="${GD}"/>`;
  s+=`<circle cx="${rx+62}" cy="19" r="3" fill="${GD}"/><circle cx="${rx+62}" cy="19" r="1.5" fill="${GD}"/>`;
  s+=`<rect x="${rx+58}" y="12" width="12" height="4" rx="1" fill="${GD}"/><rect x="${rx+62}" y="9" width="5" height="5" rx="2" fill="${GD}"/>`;
  s+=`<rect x="${rx+4}" y="10" width="66" height="5" rx="1" fill="${GD}"/><rect x="${rx+4}" y="10" width="66" height="2" rx="1" fill="${GC}"/>`;
  for(let i=0;i<11;i++)s+=`<rect x="${rx+7+i*6}" y="10" width="2" height="5" fill="${GD}" opacity="0.7"/>`;
  if(opt){const ox=rx+6,ow=bigOpt?44:26,oh=bigOpt?16:13;s+=`<rect x="${ox}" y="${5-(bigOpt?4:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="${ox+3}" y="${7-(bigOpt?4:0)}" width="${ow-6}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.7"/>`;s+=`<circle cx="${ox+ow/2}" cy="${7-(bigOpt?4:0)+(oh-6)/2}" r="${bigOpt?5:3}" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="${ox+3}" y="${5+oh-(bigOpt?4:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+ow-7}" y="${5+oh-(bigOpt?4:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;}
  const hx=rx+70;
  s+=`<rect x="${hx}" y="12" width="120" height="18" rx="2" fill="${GC}"/><rect x="${hx}" y="13" width="120" height="8" rx="1" fill="${GL}"/><rect x="${hx}" y="28" width="120" height="3" rx="1" fill="${GD}"/>`;
  for(let i=0;i<10;i++){s+=`<rect x="${hx+4+i*12}" y="14" width="8" height="4" rx="1" fill="${GD}" opacity="0.7"/>`;s+=`<rect x="${hx+4+i*12}" y="22" width="8" height="4" rx="1" fill="${GD}" opacity="0.7"/>`;}
  s+=`<rect x="${hx+112}" y="14" width="8" height="8" rx="1" fill="${GD}"/>`;s+=`<rect x="${hx+114}" y="9" width="4" height="6" rx="1" fill="${GD}"/>`;
  if(las&&!und){s+=`<rect x="${hx+8}" y="27" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+20}" y1="29" x2="${hx+40}" y2="29" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(und){s+=`<rect x="${hx+6}" y="30" width="18" height="16" rx="2" fill="${GA}" opacity="0.85"/>`;if(las)s+=`<rect x="${hx+6}" y="46" width="12" height="4" rx="2" fill="${GV}" opacity="0.9"/>`;}
  const bx=hx+120;
  s+=`<rect x="${bx}" y="17" width="${bL}" height="7" rx="2" fill="${bar?GA:GL}"/><rect x="${bx}" y="18" width="${bL}" height="3" rx="0" fill="${GL}" opacity="0.5"/>`;
  s+=`<rect x="${bx-2}" y="15" width="4" height="11" rx="1" fill="${GD}"/>`;
  if(muz){const mx2=bx+bL;if(supp){s+=`<rect x="${mx2}" y="13" width="${mL}" height="15" rx="6" fill="${GA}"/>`;for(let i=0;i<5;i++)s+=`<rect x="${mx2+5+i*6}" y="13" width="2" height="15" fill="${GD}" opacity="0.4"/>`;}else{s+=`<rect x="${mx2}" y="15" width="${mL}" height="11" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx2+mL-3}" y="13" width="4" height="15" rx="1" fill="${GL}"/>`;}}
  return s;
}

function drawLMG(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?344:308,mL=muz?(supp?40:18):0;let s='';
  s+=`<path d="M4,26 L56,24 L60,24 L60,46 L56,46 L4,44 Z" fill="${GD}"/>`;
  s+=`<rect x="6" y="26" width="50" height="18" rx="2" fill="${stk?GA:GC}"/>`;
  s+=`<path d="M4,26 L12,22 L14,42 L4,44 Z" fill="${GD}"/>`;
  s+=`<path d="M104,26 L114,26 L118,48 Q118,55 112,56 L102,56 Q96,56 94,49 L96,26 Z" fill="${grip?GA:GD}"/>`;
  for(let i=0;i<4;i++)s+=`<rect x="98" y="${33+i*4}" width="14" height="1.5" fill="${GD}" opacity="0.7"/>`;
  s+=`<path d="M106,28 Q106,44 98,46 Q91,47 87,41 L85,34" stroke="${GD}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="62" y="22" width="50" height="12" rx="2" fill="${GC}"/><rect x="64" y="23" width="46" height="6" rx="1" fill="${GL}"/>`;
  if(fmode)s+=`<rect x="66" y="27" width="6" height="3" rx="1" fill="${GO}"/>`;
  const dh=bigMag?38:30;
  s+=`<rect x="70" y="32" width="28" height="${dh}" rx="3" fill="${mag?GA:GD}"/>`;
  s+=`<rect x="72" y="34" width="24" height="${dh-4}" rx="2" fill="${mag?GA:GD}"/>`;
  for(let i=0;i<3;i++)s+=`<rect x="82" y="${42+i*10}" width="3" height="5" rx="1" fill="${GD}"/>`;
  s+=`<rect x="99" y="32" width="2" height="${dh}" rx="1" fill="${GD}"/>`;
  s+=`<rect x="64" y="10" width="48" height="14" rx="2" fill="${GL}"/><rect x="66" y="11" width="44" height="7" rx="1" fill="${GL}"/>`;
  s+=`<rect x="66" y="5" width="44" height="5" rx="1" fill="${GD}"/><rect x="66" y="5" width="44" height="2" rx="1" fill="${GC}"/>`;
  for(let i=0;i<7;i++)s+=`<rect x="${69+i*6}" y="5" width="2" height="5" fill="${GD}" opacity="0.7"/>`;
  if(opt){const ow=bigOpt?46:28,oh=bigOpt?16:13;s+=`<rect x="68" y="${4-(bigOpt?3:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="71" y="${6-(bigOpt?3:0)}" width="${ow-6}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.7"/>`;s+=`<circle cx="${68+ow/2}" cy="${6-(bigOpt?3:0)+(oh-6)/2}" r="${bigOpt?5:3}" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="71" y="${4+oh-(bigOpt?3:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;s+=`<rect x="${68+ow-7}" y="${4+oh-(bigOpt?3:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;}
  s+=`<rect x="114" y="10" width="122" height="20" rx="2" fill="${GC}"/><rect x="114" y="11" width="122" height="9" rx="1" fill="${GL}"/><rect x="114" y="28" width="122" height="3" rx="1" fill="${GD}"/>`;
  for(let i=0;i<9;i++){s+=`<rect x="${118+i*13}" y="12" width="9" height="5" rx="1" fill="${GD}" opacity="0.7"/>`;s+=`<rect x="${118+i*13}" y="21" width="9" height="5" rx="1" fill="${GD}" opacity="0.7"/>`;}
  s+=`<path d="M224,30 L216,62 L222,62 L228,34" fill="${GD}"/>`;
  s+=`<path d="M232,30 L240,62 L234,62 L228,34" fill="${GD}"/>`;
  s+=`<rect x="212" y="60" width="12" height="3" rx="1" fill="${GD}"/><rect x="232" y="60" width="12" height="3" rx="1" fill="${GD}"/>`;
  s+=`<rect x="218" y="28" width="14" height="6" rx="2" fill="${GD}"/>`;
  s+=`<rect x="234" y="8" width="5" height="15" rx="2" fill="${GD}"/>`;
  if(las&&!und){s+=`<rect x="122" y="28" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="134" y1="30" x2="154" y2="30" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(und){s+=`<rect x="120" y="30" width="20" height="18" rx="2" fill="${GA}" opacity="0.85"/>`;if(las)s+=`<rect x="120" y="48" width="12" height="4" rx="2" fill="${GV}" opacity="0.9"/>`;}
  s+=`<rect x="236" y="11" width="${bL}" height="11" rx="2" fill="${bar?GA:GL}"/><rect x="236" y="12" width="${bL}" height="5" rx="1" fill="${GL}" opacity="0.5"/>`;
  for(let i=0;i<6;i++)s+=`<circle cx="${250+i*12}" cy="14" r="1.5" fill="${GD}" opacity="0.7"/>`;
  if(muz){const mx=236+bL;if(supp){s+=`<rect x="${mx}" y="8" width="${mL}" height="17" rx="7" fill="${GA}"/>`;for(let i=0;i<5;i++)s+=`<rect x="${mx+5+i*6}" y="8" width="2" height="17" fill="${GD}" opacity="0.4"/>`;}else{s+=`<rect x="${mx}" y="9" width="8" height="15" rx="1" fill="${GD}"/>`;s+=`<rect x="${mx+8}" y="7" width="6" height="19" rx="2" fill="${GD}"/>`;for(let i=0;i<3;i++)s+=`<rect x="${mx+9}" y="${7+i*6}" width="4" height="4" fill="${GD}" opacity="0.7"/>`;s+=`<rect x="${mx+14}" y="10" width="6" height="13" rx="2" fill="${GC}"/>`;}  }
  return s;
}

function drawSniper(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?394:354,mL=muz?(supp?48:22):0;let s='';
  s+=`<path d="M4,28 L12,24 L14,24 L18,28 L18,46 L14,50 L12,50 L4,46 Z" fill="${GD}"/>`;
  s+=`<rect x="6" y="26" width="12" height="22" rx="2" fill="${stk?GA:GC}"/>`;
  s+=`<rect x="10" y="16" width="46" height="12" rx="3" fill="${GC}"/><rect x="12" y="17" width="42" height="5" rx="2" fill="${GL}"/>`;
  s+=`<ellipse cx="30" cy="34" rx="7" ry="5" fill="#080b10" opacity="0.7"/>`;
  s+=`<rect x="14" y="38" width="44" height="5" rx="2" fill="${GD}"/>`;
  s+=`<path d="M58,26 L68,26 L72,46 Q72,53 66,54 L58,54 Q52,54 50,47 L52,26 Z" fill="${grip?GA:GD}"/>`;
  for(let i=0;i<4;i++)s+=`<rect x="54" y="${33+i*4}" width="12" height="1.5" fill="${GD}" opacity="0.6"/>`;
  s+=`<path d="M64,38 Q64,54 56,56 Q49,57 45,51 L43,44" stroke="${GD}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="62" y="20" width="96" height="18" rx="2" fill="${GL}"/><rect x="64" y="21" width="92" height="8" rx="1" fill="${GL}"/>`;
  s+=`<rect x="88" y="24" width="30" height="10" rx="1" fill="${GC}"/>`;
  s+=`<rect x="138" y="18" width="18" height="5" rx="2" fill="${GD}"/>`;
  s+=`<rect x="152" y="14" width="5" height="9" rx="3" fill="${GL}"/>`;
  s+=`<circle cx="154" cy="16" r="4" fill="${GL}"/><circle cx="154" cy="16" r="2" fill="${GD}"/>`;
  s+=`<rect x="64" y="16" width="94" height="5" rx="1" fill="${GD}"/><rect x="64" y="16" width="94" height="2" rx="1" fill="${GC}"/>`;
  for(let i=0;i<14;i++)s+=`<rect x="${67+i*7}" y="16" width="2" height="5" fill="${GD}" opacity="0.7"/>`;
  s+=`<ellipse cx="80" cy="10" rx="13" ry="13" fill="${GD}"/>`;
  s+=`<ellipse cx="80" cy="10" rx="10" ry="10" fill="#303840"/>`;
  s+=`<ellipse cx="80" cy="10" rx="6" ry="6" fill="#1a2028"/>`;
  const ow=bigOpt?170:148;
  s+=`<rect x="92" y="5" width="${ow}" height="10" rx="4" fill="${GD}"/>`;
  s+=`<rect x="92" y="6" width="${ow}" height="5" rx="2" fill="${opt?GA:GD}"/>`;
  s+=`<rect x="${92+50}" y="1" width="12" height="7" rx="2" fill="${GC}"/>`;
  s+=`<rect x="${92+90}" y="1" width="12" height="7" rx="2" fill="${GC}"/>`;
  s+=`<rect x="${92+20}" y="4" width="14" height="17" rx="2" fill="${GC}"/><rect x="${92+22}" y="5" width="10" height="6" rx="1" fill="${GL}"/><rect x="${92+20}" y="20" width="14" height="4" rx="1" fill="${GD}"/>`;
  s+=`<rect x="${92+ow-18}" y="4" width="14" height="17" rx="2" fill="${GC}"/><rect x="${92+ow-16}" y="5" width="10" height="6" rx="1" fill="${GL}"/><rect x="${92+ow-18}" y="20" width="14" height="4" rx="1" fill="${GD}"/>`;
  s+=`<ellipse cx="${92+ow+14}" cy="10" rx="12" ry="12" fill="${GD}"/>`;
  s+=`<ellipse cx="${92+ow+14}" cy="10" rx="8" ry="8" fill="#303840"/>`;
  s+=`<ellipse cx="${92+ow+14}" cy="10" rx="4" ry="4" fill="#1a2028"/>`;
  s+=`<rect x="158" y="22" width="98" height="15" rx="2" fill="${GC}"/><rect x="158" y="23" width="98" height="7" rx="1" fill="${GL}"/>`;
  s+=`<rect x="172" y="35" width="16" height="22" rx="3" fill="${mag?GA:GD}"/>`;
  s+=`<rect x="174" y="37" width="12" height="18" rx="2" fill="${mag?GA:GD}"/>`;
  if(und){s+=`<rect x="162" y="12" width="46" height="10" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="164" y="13" width="42" height="6" rx="2" fill="${GD}" opacity="0.5"/>`;}
  if(las){s+=`<rect x="164" y="36" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="176" y1="38" x2="196" y2="38" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  s+=`<rect x="256" y="24" width="${bL}" height="8" rx="2" fill="${bar?GA:GL}"/><rect x="256" y="25" width="${bL}" height="3" rx="0" fill="${GL}" opacity="0.5"/>`;
  s+=`<rect x="254" y="22" width="5" height="12" rx="1" fill="${GD}"/>`;
  for(let i=0;i<20;i++)s+=`<rect x="${270+i*18}" y="24" width="2" height="8" fill="${GD}" opacity="0.35"/>`;
  if(muz){const mx=256+bL;if(supp){s+=`<rect x="${mx}" y="21" width="${mL}" height="14" rx="6" fill="${GA}"/>`;for(let i=0;i<7;i++)s+=`<rect x="${mx+5+i*6}" y="21" width="2" height="14" fill="${GD}" opacity="0.4"/>`;}else{s+=`<rect x="${mx}" y="22" width="8" height="12" rx="1" fill="${GD}"/>`;s+=`<rect x="${mx+8}" y="20" width="6" height="16" rx="2" fill="${GD}"/>`;for(let i=0;i<3;i++)s+=`<rect x="${mx+9}" y="${20+i*5}" width="4" height="4" fill="${GD}" opacity="0.6"/>`;s+=`<rect x="${mx+14}" y="23" width="8" height="10" rx="2" fill="${GC}"/>`;}  }
  return s;
}

function drawShotgun(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?188:164,mL=muz?(supp?28:12):0;let s='';
  if(!noStk){s+=`<path d="M6,24 L16,20 L18,20 L22,24 L22,46 L18,50 L16,50 L6,46 Z" fill="${GD}"/>`;s+=`<rect x="8" y="22" width="14" height="26" rx="2" fill="${stk?GA:GC}"/>`;s+=`<rect x="18" y="22" width="50" height="20" rx="3" fill="${GC}"/>`;s+=`<rect x="66" y="24" width="14" height="18" rx="3" fill="${GC}"/>`;}
  s+=`<path d="M78,24 L90,24 L94,46 Q94,53 88,54 L78,54 Q72,54 70,47 L72,24 Z" fill="${grip?GA:GD}"/>`;
  for(let i=0;i<4;i++)s+=`<rect x="74" y="${32+i*4}" width="12" height="1.5" fill="${GD}" opacity="0.6"/>`;
  s+=`<path d="M86,26 Q86,42 78,44 Q72,45 68,39 L66,33" stroke="${GD}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="90" y="16" width="84" height="22" rx="3" fill="${GL}"/><rect x="92" y="17" width="80" height="10" rx="2" fill="${GL}"/>`;
  s+=`<rect x="108" y="20" width="36" height="13" rx="2" fill="${GC}"/>`;
  s+=`<rect x="92" y="35" width="28" height="4" rx="1" fill="${GD}"/>`;
  if(opt){s+=`<rect x="96" y="6" width="28" height="12" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="99" y="8" width="22" height="7" rx="2" fill="${GD}" opacity="0.7"/>`;s+=`<circle cx="110" cy="11" r="3.5" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="100" y="17" width="4" height="3" rx="1" fill="${GD}"/>`;s+=`<rect x="116" y="17" width="4" height="3" rx="1" fill="${GD}"/>`;}
  s+=`<rect x="90" y="38" width="${bL+6}" height="9" rx="4" fill="${mag?GA:GC}"/><rect x="92" y="39" width="${bL+2}" height="5" rx="3" fill="${mag?GA:GL}"/>`;
  s+=`<rect x="${90+bL}" y="36" width="6" height="13" rx="3" fill="${GD}"/>`;
  s+=`<rect x="174" y="18" width="50" height="18" rx="3" fill="${GC}"/><rect x="176" y="20" width="46" height="7" rx="2" fill="${GL}"/>`;
  for(let i=0;i<7;i++)s+=`<rect x="${179+i*7}" y="20" width="3" height="14" rx="1" fill="${GD}" opacity="0.5"/>`;
  s+=`<rect x="252" y="16" width="6" height="20" rx="2" fill="${GD}"/>`;s+=`<rect x="310" y="16" width="6" height="20" rx="2" fill="${GD}"/>`;
  s+=`<rect x="174" y="18" width="${bL}" height="10" rx="2" fill="${bar?GA:GL}"/><rect x="174" y="19" width="${bL}" height="4" rx="1" fill="${GL}" opacity="0.5"/>`;
  s+=`<rect x="174" y="27" width="${bL}" height="3" rx="1" fill="${GC}"/>`;
  if(las){s+=`<rect x="182" y="28" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="194" y1="30" x2="214" y2="30" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(und){s+=`<rect x="194" y="28" width="16" height="14" rx="2" fill="${GA}" opacity="0.85"/>`;}
  if(muz){const mx=174+bL;if(supp){s+=`<rect x="${mx}" y="15" width="${mL}" height="16" rx="6" fill="${GA}"/>`;}else{s+=`<rect x="${mx}" y="16" width="${mL}" height="12" rx="1" fill="${GA}"/>`;s+=`<rect x="${mx+mL-3}" y="14" width="3" height="16" rx="1" fill="${GL}"/>`;}}
  return s;
}

function drawDMR(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?256:224,mL=muz?(supp?44:18):0;let s='';
  if(!noStk){s+=`<rect x="4" y="22" width="50" height="4" rx="2" fill="${stk?GA:GC}"/>`;s+=`<rect x="4" y="38" width="50" height="4" rx="2" fill="${stk?GA:GC}"/>`;s+=`<rect x="2" y="22" width="4" height="20" rx="2" fill="${GD}"/>`;s+=`<rect x="50" y="24" width="6" height="16" rx="2" fill="${GC}"/>`;for(let i=0;i<4;i++){s+=`<rect x="${12+i*8}" y="23" width="2" height="3" rx="0" fill="${GD}"/>`;s+=`<rect x="${12+i*8}" y="38" width="2" height="3" rx="0" fill="${GD}"/>`;}  }
  s+=`<path d="M96,24 L106,24 L110,46 Q110,53 104,54 L94,54 Q88,54 86,47 L88,24 Z" fill="${grip?GA:GD}"/>`;
  for(let i=0;i<4;i++)s+=`<rect x="90" y="${31+i*4}" width="12" height="1.5" fill="${GD}" opacity="0.6"/>`;
  s+=`<path d="M100,26 Q100,42 92,44 Q85,45 81,39 L79,33" stroke="${GD}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="58" y="20" width="50" height="12" rx="2" fill="${GC}"/><rect x="60" y="21" width="46" height="6" rx="1" fill="${GL}"/>`;
  if(fmode)s+=`<rect x="62" y="25" width="6" height="3" rx="1" fill="${GO}"/>`;
  const mh=bigMag?30:22;
  s+=`<rect x="70" y="30" width="18" height="${mh}" rx="3" fill="${mag?GA:GD}"/>`;
  s+=`<rect x="78" y="34" width="2" height="${mh-8}" rx="1" fill="${GD}"/>`;
  s+=`<rect x="70" y="${30+mh}" width="18" height="3" rx="1" fill="${GC}"/>`;
  s+=`<rect x="60" y="9" width="48" height="13" rx="2" fill="${GL}"/><rect x="62" y="10" width="44" height="6" rx="1" fill="${GL}"/>`;
  s+=`<rect x="74" y="13" width="22" height="7" rx="1" fill="${GC}"/>`;
  s+=`<rect x="102" y="7" width="7" height="4" rx="1" fill="${GD}"/><rect x="105" y="4" width="4" height="5" rx="2" fill="${GD}"/>`;
  s+=`<rect x="62" y="5" width="46" height="5" rx="1" fill="${GD}"/><rect x="62" y="5" width="46" height="2" rx="1" fill="${GC}"/>`;
  for(let i=0;i<8;i++)s+=`<rect x="${65+i*6}" y="5" width="2" height="5" fill="${GD}" opacity="0.7"/>`;
  if(opt){const ow=bigOpt?72:52,oh=bigOpt?14:11;s+=`<ellipse cx="74" cy="${8-(bigOpt?2:0)}" rx="${bigOpt?10:8}" ry="${bigOpt?10:8}" fill="${GD}"/>`;s+=`<ellipse cx="74" cy="${8-(bigOpt?2:0)}" rx="${bigOpt?7:5}" ry="${bigOpt?7:5}" fill="#1a2028"/>`;s+=`<rect x="82" y="${3-(bigOpt?2:0)}" width="${ow-16}" height="${oh}" rx="4" fill="${GD}"/>`;s+=`<rect x="82" y="${4-(bigOpt?2:0)}" width="${ow-16}" height="${oh-4}" rx="2" fill="${opt?GA:GD}"/>`;s+=`<rect x="${82+18}" y="1" width="10" height="6" rx="2" fill="${GC}"/>`;s+=`<rect x="${82+(ow-16)/2-8}" y="${3+oh-(bigOpt?2:0)}" width="12" height="3" rx="1" fill="${GD}"/>`;s+=`<ellipse cx="${82+ow-14}" cy="${8-(bigOpt?2:0)}" rx="${bigOpt?9:7}" ry="${bigOpt?9:7}" fill="${GD}"/>`;s+=`<ellipse cx="${82+ow-14}" cy="${8-(bigOpt?2:0)}" rx="${bigOpt?6:4}" ry="${bigOpt?6:4}" fill="#1a2028"/>`;s+=`<rect x="${82+10}" y="${2+oh-(bigOpt?2:0)}" width="12" height="12" rx="2" fill="${GC}"/>`;s+=`<rect x="${82+ow-28}" y="${2+oh-(bigOpt?2:0)}" width="12" height="12" rx="2" fill="${GC}"/>`;}
  s+=`<rect x="110" y="10" width="110" height="16" rx="2" fill="${GC}"/><rect x="110" y="11" width="110" height="7" rx="1" fill="${GL}"/><rect x="110" y="24" width="110" height="3" rx="1" fill="${GD}"/>`;
  for(let i=0;i<9;i++){s+=`<rect x="${114+i*12}" y="12" width="8" height="4" rx="1" fill="${GD}" opacity="0.7"/>`;s+=`<rect x="${114+i*12}" y="20" width="8" height="4" rx="1" fill="${GD}" opacity="0.7"/>`;}
  if(las&&!und){s+=`<rect x="118" y="24" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="130" y1="26" x2="150" y2="26" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(und){s+=`<rect x="116" y="26" width="18" height="16" rx="2" fill="${GA}" opacity="0.85"/>`;if(las)s+=`<rect x="116" y="42" width="12" height="4" rx="2" fill="${GV}" opacity="0.9"/>`;}
  const bx=220;
  s+=`<rect x="${bx}" y="13" width="${bL}" height="8" rx="2" fill="${bar?GA:GL}"/><rect x="${bx}" y="14" width="${bL}" height="3" rx="0" fill="${GL}" opacity="0.5"/>`;
  s+=`<rect x="${bx-2}" y="11" width="4" height="12" rx="1" fill="${GD}"/>`;
  if(muz){const mx=bx+bL;if(supp){s+=`<rect x="${mx}" y="10" width="${mL}" height="14" rx="6" fill="${GA}"/>`;for(let i=0;i<6;i++)s+=`<rect x="${mx+4+i*6}" y="10" width="2" height="14" fill="${GD}" opacity="0.4"/>`;}else{s+=`<rect x="${mx}" y="11" width="${mL}" height="12" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx+mL-3}" y="9" width="4" height="16" rx="1" fill="${GL}"/>`;}}
  return s;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getTier(v){return v>=20?'S':v>=10?'A':v>=0?'B':'C';}
function getFingerprint(){let fp=localStorage.getItem('md_fp');if(!fp){fp=Math.random().toString(36).slice(2);localStorage.setItem('md_fp',fp);}return fp;}
async function sbFetch(path,opts={}){const res=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation',...opts.headers},...opts});if(!res.ok)return null;const text=await res.text();return text?JSON.parse(text):[];}
async function sbAuthFetch(path,body){const res=await fetch(`${SUPABASE_URL}/auth/v1/${path}`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});return res.json();}
function getYouTubeId(url){if(!url)return null;const m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/);return m?m[1]:null;}
function parseAtts(attachments){return(attachments||[]).reduce((acc,att)=>{const i=att.indexOf(':');if(i>-1){acc[att.substring(0,i).trim()]=att.substring(i+1).trim();}return acc;},{});}
const inp={background:'#0d1117',border:'1px solid #30363d',borderRadius:'3px',color:'#e6f0ff',fontSize:'14px',padding:'12px',fontFamily:"'Courier New', monospace",width:'100%'};

// ── FEEDBACK BUTTON ───────────────────────────────────────────────────────────
function FeedbackButton({gamertag}){
  const[open,setOpen]=useState(false);const[rating,setRating]=useState(0);const[hovered,setHovered]=useState(0);const[type,setType]=useState('general');const[message,setMessage]=useState('');const[loading,setLoading]=useState(false);const[success,setSuccess]=useState(false);
  const TYPES=[{id:'general',label:'General'},{id:'bug',label:'Bug Report'},{id:'feature',label:'Feature Request'},{id:'weapons',label:'Weapons/Attachments'}];
  async function submit(){if(!message.trim())return;setLoading(true);await sbFetch('feedback',{method:'POST',body:JSON.stringify({gamertag:gamertag||'Anonymous',rating:rating||null,type,message:message.trim()})});setLoading(false);setSuccess(true);setTimeout(()=>{setSuccess(false);setOpen(false);setRating(0);setMessage('');setType('general');},2000);}
  return(<>
    <button onClick={()=>setOpen(o=>!o)} style={{position:'fixed',bottom:'24px',right:'24px',width:'52px',height:'52px',borderRadius:'50%',background:open?'#ff8c00':'#00e5ff',border:'none',cursor:'pointer',fontSize:'22px',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9000,boxShadow:`0 4px 20px ${open?'#ff8c0044':'#00e5ff44'}`,transition:'all 0.2s'}} title="Send Feedback">{open?'✕':'💬'}</button>
    {open&&<div style={{position:'fixed',bottom:'88px',right:'24px',width:'320px',background:'#0d1117',border:'1px solid #30363d',borderRadius:'8px',padding:'20px',zIndex:9000,boxShadow:'0 8px 32px #00000088'}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
        <div style={{width:'3px',height:'20px',background:'linear-gradient(180deg,#00e5ff,#0077ff)',borderRadius:'2px'}}/>
        <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'16px',fontWeight:'700',letterSpacing:'3px',color:'#00e5ff'}}>FEEDBACK</span>
      </div>
      {success?(<div style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>✓</div><div style={{color:'#00e5ff',fontFamily:"'Courier New', monospace",fontSize:'13px',letterSpacing:'2px'}}>THANKS FOR THE FEEDBACK!</div></div>):(
        <div style={{display:'grid',gap:'12px'}}>
          <div><div style={{color:'#484f58',fontSize:'9px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'8px'}}>// RATE THE APP</div>
            <div style={{display:'flex',gap:'6px'}}>{[1,2,3,4,5].map(star=><button key={star} onClick={()=>setRating(star)} onMouseEnter={()=>setHovered(star)} onMouseLeave={()=>setHovered(0)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'24px',padding:'2px',color:star<=(hovered||rating)?'#ffd700':'#30363d',transition:'color 0.1s'}}>★</button>)}
              {rating>0&&<span style={{color:'#484f58',fontFamily:"'Courier New', monospace",fontSize:'11px',alignSelf:'center',marginLeft:'4px'}}>{['','Poor','Fair','Good','Great','GOATED'][rating]}</span>}
            </div>
          </div>
          <div><div style={{color:'#484f58',fontSize:'9px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'8px'}}>// TYPE</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px'}}>{TYPES.map(t=><button key={t.id} onClick={()=>setType(t.id)} style={{padding:'7px 10px',background:type===t.id?'#00e5ff22':'#161b22',border:type===t.id?'1px solid #00e5ff44':'1px solid #30363d',borderRadius:'3px',color:type===t.id?'#00e5ff':'#484f58',fontFamily:"'Courier New', monospace",fontSize:'10px',letterSpacing:'1px',cursor:'pointer',textAlign:'left'}}>{t.label}</button>)}</div>
          </div>
          <div><div style={{color:'#484f58',fontSize:'9px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'8px'}}>// MESSAGE</div>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us what you think, what's broken, or what you want to see..." rows={4} style={{background:'#0d1117',border:'1px solid #30363d',borderRadius:'3px',color:'#e6f0ff',fontSize:'13px',padding:'10px 12px',fontFamily:"'Courier New', monospace",width:'100%',resize:'vertical',lineHeight:'1.5'}}/>
          </div>
          <div style={{color:'#484f58',fontSize:'10px',fontFamily:"'Courier New', monospace"}}>// Sending as: <span style={{color:'#00e5ff'}}>{gamertag||'Anonymous'}</span></div>
          <button onClick={submit} disabled={loading||!message.trim()} style={{background:message.trim()?'#00e5ff22':'#161b22',border:`1px solid ${message.trim()?'#00e5ff':'#30363d'}`,borderRadius:'3px',color:message.trim()?'#00e5ff':'#484f58',fontSize:'13px',padding:'12px',cursor:message.trim()?'pointer':'not-allowed',fontFamily:"'Courier New', monospace",letterSpacing:'2px',width:'100%'}}>{loading?'SENDING...':'SEND FEEDBACK'}</button>
        </div>
      )}
    </div>}
  </>);
}

// ── DROPDOWN ──────────────────────────────────────────────────────────────────
function Dropdown({label,options,value,onChange,placeholder}){
  const[open,setOpen]=useState(false);const ref=useRef();
  useEffect(()=>{function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  return(<div ref={ref} style={{position:'relative',width:'100%'}}>
    <button type="button" onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'#0d1117',border:'1px solid #30363d',borderRadius:open?'3px 3px 0 0':'3px',color:value&&value!=='None'?'#e6f0ff':'#484f58',fontSize:'13px',padding:'10px 12px',fontFamily:"'Courier New', monospace",cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span>{label&&<span style={{color:'#00e5ff',fontSize:'10px',letterSpacing:'1px',marginRight:'8px'}}>{label}</span>}{value||placeholder}</span>
      <span style={{color:'#484f58',fontSize:'10px',marginLeft:'8px'}}>{open?'▲':'▼'}</span>
    </button>
    {open&&<div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:9999,background:'#161b22',border:'1px solid #30363d',borderTop:'none',borderRadius:'0 0 3px 3px',maxHeight:'200px',overflowY:'auto'}}>
      {options.map(opt=><div key={opt} onClick={()=>{onChange(opt);setOpen(false);}} style={{padding:'10px 12px',cursor:'pointer',fontSize:'13px',fontFamily:"'Courier New', monospace",color:opt===value?'#00e5ff':opt==='None'?'#484f58':'#c9d1d9',background:opt===value?'#00e5ff11':'transparent',borderBottom:'1px solid #21262d'}} onMouseEnter={e=>e.currentTarget.style.background='#00e5ff11'} onMouseLeave={e=>e.currentTarget.style.background=opt===value?'#00e5ff11':'transparent'}>{opt}</div>)}
    </div>}
  </div>);
}

// ── WEAPON DROPDOWN ───────────────────────────────────────────────────────────
function WeaponDropdown({weapons,value,onChange}){
  const[open,setOpen]=useState(false);const ref=useRef();
  useEffect(()=>{function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  const selected=weapons.find(w=>w.name===value);
  return(<div ref={ref} style={{position:'relative',width:'100%'}}>
    <button type="button" onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'#0d1117',border:'1px solid #30363d',borderRadius:open?'3px 3px 0 0':'3px',color:value?'#e6f0ff':'#484f58',fontSize:'13px',padding:'10px 12px',fontFamily:"'Courier New', monospace",cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{display:'flex',alignItems:'center',gap:'8px'}}>
        {selected&&<span style={{background:GAME_BADGE[selected.game]?.bg||'#ffffff11',border:`1px solid ${GAME_BADGE[selected.game]?.color||'#fff'}44`,color:GAME_BADGE[selected.game]?.color||'#fff',fontSize:'9px',padding:'1px 5px',borderRadius:'2px',fontFamily:"'Courier New', monospace",flexShrink:0}}>{GAME_BADGE[selected.game]?.label||selected.game}</span>}
        {value||'Select weapon...'}
      </span>
      <span style={{color:'#484f58',fontSize:'10px',marginLeft:'8px'}}>{open?'▲':'▼'}</span>
    </button>
    {open&&<div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:9999,background:'#161b22',border:'1px solid #30363d',borderTop:'none',borderRadius:'0 0 3px 3px',maxHeight:'240px',overflowY:'auto'}}>
      {['BO7','BO6','Warzone'].map(game=>{const group=weapons.filter(w=>w.game===game);if(!group.length)return null;return(<div key={game}><div style={{padding:'6px 12px',color:GAME_BADGE[game]?.color||'#fff',fontSize:'9px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",background:'#0d1117',borderBottom:'1px solid #21262d'}}>{game.toUpperCase()}</div>{group.map(w=><div key={w.name} onClick={()=>{onChange(w.name);setOpen(false);}} style={{padding:'10px 12px',cursor:'pointer',fontSize:'13px',fontFamily:"'Courier New', monospace",color:w.name===value?'#00e5ff':'#c9d1d9',background:w.name===value?'#00e5ff11':'transparent',borderBottom:'1px solid #21262d'}} onMouseEnter={e=>e.currentTarget.style.background='#00e5ff11'} onMouseLeave={e=>e.currentTarget.style.background=w.name===value?'#00e5ff11':'transparent'}>{w.name}</div>)}</div>);})}
    </div>}
  </div>);
}

// ── AUTH MODAL ────────────────────────────────────────────────────────────────
function AuthModal({onClose,onAuth}){
  const[mode,setMode]=useState('login');const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[gamertag,setGamertag]=useState('');const[error,setError]=useState('');const[loading,setLoading]=useState(false);const[showReset,setShowReset]=useState(false);const[resetEmail,setResetEmail]=useState('');const[resetSent,setResetSent]=useState(false);
  async function handleSubmit(){setError('');if(!email||!password)return setError('Email and password required.');if(mode==='signup'&&!gamertag.trim())return setError('Gamertag required.');setLoading(true);if(mode==='signup'){const res=await sbAuthFetch('signup',{email,password});if(res.error){setError(res.error.message);setLoading(false);return;}const userId=res.user?.id;if(userId){await sbFetch('profiles',{method:'POST',headers:{Authorization:`Bearer ${res.access_token}`},body:JSON.stringify({id:userId,gamertag:gamertag.trim()})});onAuth({user:res.user,gamertag:gamertag.trim()});}}else{const res=await sbAuthFetch('token?grant_type=password',{email,password});if(res.error){setError(res.error.message);setLoading(false);return;}const profile=await sbFetch(`profiles?id=eq.${res.user.id}&select=gamertag`);onAuth({user:res.user,gamertag:profile?.[0]?.gamertag||'Operator'});}setLoading(false);}
  async function handleReset(){if(!resetEmail)return;await fetch(`${SUPABASE_URL}/auth/v1/recover`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email:resetEmail})});setResetSent(true);}
  return(<div style={{position:'fixed',inset:0,background:'#000000cc',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
    <div style={{background:'#0d1117',border:'1px solid #30363d',borderRadius:'6px',padding:'24px',width:'100%',maxWidth:'380px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}><span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'18px',fontWeight:'700',letterSpacing:'3px',color:'#00e5ff'}}>{showReset?'RESET PASSWORD':mode==='login'?'LOGIN':'CREATE ACCOUNT'}</span><button onClick={onClose} style={{background:'none',border:'none',color:'#484f58',cursor:'pointer',fontSize:'18px'}}>✕</button></div>
      {showReset?(<div style={{display:'grid',gap:'10px'}}>{resetSent?<div style={{color:'#00e5ff',fontFamily:"'Courier New', monospace",fontSize:'13px'}}>// Reset email sent!</div>:<><input style={inp} placeholder="Enter your email" type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)}/><button onClick={handleReset} style={{background:'#00e5ff22',border:'1px solid #00e5ff',borderRadius:'3px',color:'#00e5ff',fontSize:'14px',padding:'12px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'2px'}}>SEND RESET EMAIL</button></>}<button onClick={()=>setShowReset(false)} style={{background:'none',border:'none',color:'#484f58',fontSize:'12px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'1px'}}>← BACK TO LOGIN</button></div>):(
      <><div style={{display:'flex',background:'#161b22',borderRadius:'3px',padding:'4px',gap:'4px',marginBottom:'20px'}}>{['login','signup'].map(m=><button key={m} onClick={()=>{setMode(m);setError('');}} style={{flex:1,padding:'10px',background:mode===m?'#00e5ff22':'transparent',border:mode===m?'1px solid #00e5ff44':'1px solid transparent',borderRadius:'2px',color:mode===m?'#00e5ff':'#484f58',fontFamily:"'Courier New', monospace",fontSize:'12px',letterSpacing:'2px',cursor:'pointer'}}>{m==='login'?'LOGIN':'SIGN UP'}</button>)}</div>
      <div style={{display:'grid',gap:'10px'}}>{mode==='signup'&&<input style={inp} placeholder="Gamertag" value={gamertag} onChange={e=>setGamertag(e.target.value)}/>}<input style={inp} placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/><input style={inp} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>{error&&<div style={{color:'#ff4444',fontSize:'12px',fontFamily:"'Courier New', monospace"}}>// {error}</div>}<button onClick={handleSubmit} disabled={loading} style={{background:'#00e5ff22',border:'1px solid #00e5ff',borderRadius:'3px',color:'#00e5ff',fontSize:'14px',padding:'14px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'2px',marginTop:'4px'}}>{loading?'LOADING...':mode==='login'?'LOGIN':'CREATE ACCOUNT'}</button>{mode==='login'&&<button onClick={()=>setShowReset(true)} style={{background:'none',border:'none',color:'#484f58',fontSize:'12px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'1px',textAlign:'center'}}>// forgot password?</button>}</div></>)}
    </div>
  </div>);
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────
function Leaderboard(){
  const[range,setRange]=useState('alltime');const[entries,setEntries]=useState([]);const[loading,setLoading]=useState(true);const[open,setOpen]=useState(true);
  useEffect(()=>{fetchLeaderboard();},[range]);
  async function fetchLeaderboard(){setLoading(true);let query='loadouts?order=votes.desc&limit=10&select=id,weapon_name,class,mode,votes,submitted_by,attachments';if(range==='week'){const weekAgo=new Date(Date.now()-7*24*60*60*1000).toISOString();query+=`&created_at=gte.${weekAgo}`;}const data=await sbFetch(query);setEntries(data||[]);setLoading(false);}
  const medalColors=['#ffd700','#c0c0c0','#cd7f32'];
  return(<div style={{background:'#0d1117',border:'1px solid #21262d',borderRadius:'4px',marginBottom:'16px',overflow:'hidden'}}>
    <div onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',cursor:'pointer',borderBottom:open?'1px solid #21262d':'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}><div style={{width:'3px',height:'20px',background:'linear-gradient(180deg,#ffd700,#ff8c00)',borderRadius:'2px'}}/><span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'14px',fontWeight:'700',letterSpacing:'3px',color:'#ffd700'}}>LEADERBOARD</span><span style={{fontFamily:"'Courier New', monospace",fontSize:'9px',color:'#484f58',letterSpacing:'1px'}}>TOP LOADOUTS</span></div>
      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
        {open&&<div style={{display:'flex',background:'#161b22',borderRadius:'3px',padding:'3px',gap:'3px'}} onClick={e=>e.stopPropagation()}>{[['alltime','ALL TIME'],['week','THIS WEEK']].map(([val,label])=><button key={val} onClick={()=>setRange(val)} style={{padding:'5px 10px',background:range===val?'#ffd70022':'transparent',border:range===val?'1px solid #ffd70044':'1px solid transparent',borderRadius:'2px',color:range===val?'#ffd700':'#484f58',fontFamily:"'Courier New', monospace",fontSize:'10px',letterSpacing:'1px',cursor:'pointer'}}>{label}</button>)}</div>}
        <span style={{color:'#484f58',fontSize:'12px'}}>{open?'▲':'▼'}</span>
      </div>
    </div>
    {open&&<div>
      {loading&&<div style={{padding:'20px',textAlign:'center',color:'#484f58',fontFamily:"'Courier New', monospace",fontSize:'11px',letterSpacing:'2px'}}>// LOADING...</div>}
      {!loading&&entries.length===0&&<div style={{padding:'20px',textAlign:'center',color:'#484f58',fontFamily:"'Courier New', monospace",fontSize:'11px',letterSpacing:'2px'}}>// NO LOADOUTS YET</div>}
      {!loading&&entries.map((entry,i)=>{const tier=getTier(entry.votes);const tierStyle=TIER_COLORS[tier];const parsedAtts=parseAtts(entry.attachments);const vb=gunViewBox(entry.class);const svg=drawGunSVG(entry.class,parsedAtts);const medal=i<3?medalColors[i]:null;
        return(<div key={entry.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',borderBottom:'1px solid #21262d',background:i===0?'#ffd70008':i===1?'#ffffff04':i===2?'#cd7f3208':'transparent'}}>
          <div style={{width:'28px',flexShrink:0,textAlign:'center'}}>{medal?<div style={{width:'24px',height:'24px',borderRadius:'50%',background:medal+'22',border:`1px solid ${medal}44`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto'}}><span style={{color:medal,fontSize:'10px',fontWeight:'700',fontFamily:"'Courier New', monospace"}}>{i+1}</span></div>:<span style={{color:'#484f58',fontSize:'11px',fontFamily:"'Courier New', monospace"}}>#{i+1}</span>}</div>
          <div style={{width:'100px',flexShrink:0,opacity:0.8}}><svg width="100%" viewBox={vb} style={{display:'block'}}><g dangerouslySetInnerHTML={{__html:svg}}/></svg></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'2px',flexWrap:'wrap'}}>
              <span style={{fontFamily:"'Courier New', monospace",fontSize:'13px',fontWeight:'700',color:'#e6f0ff'}}>{entry.weapon_name}</span>
              <span style={{background:'#161b22',border:'1px solid #30363d',color:'#484f58',fontSize:'9px',padding:'1px 5px',borderRadius:'2px',fontFamily:"'Courier New', monospace"}}>{entry.class}</span>
              <span style={{background:entry.mode==='Warzone'?'#00e5ff11':'#ff8c0011',border:entry.mode==='Warzone'?'1px solid #00e5ff33':'1px solid #ff8c0033',color:entry.mode==='Warzone'?'#00e5ff':'#ff8c00',fontSize:'9px',padding:'1px 5px',borderRadius:'2px',fontFamily:"'Courier New', monospace"}}>{entry.mode}</span>
            </div>
            <div style={{color:'#484f58',fontSize:'10px',fontFamily:"'Courier New', monospace",letterSpacing:'1px'}}>by {entry.submitted_by||'Anonymous'}</div>
          </div>
          <div style={{flexShrink:0,textAlign:'right',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
            <div style={{background:tierStyle.bg,color:tierStyle.text,fontSize:'8px',fontWeight:'900',letterSpacing:'2px',padding:'2px 6px',fontFamily:"'Courier New', monospace",borderRadius:'2px'}}>{tierStyle.label}</div>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}><span style={{color:'#ffd700',fontSize:'11px'}}>▲</span><span style={{color:'#e6f0ff',fontFamily:"'Courier New', monospace",fontSize:'14px',fontWeight:'700'}}>{entry.votes}</span></div>
          </div>
        </div>);
      })}
    </div>}
  </div>);
}

// ── SUBMIT LOADOUT ────────────────────────────────────────────────────────────
function SubmitLoadout({activeTab,activeMode,onSubmitted,user,gamertag,onNeedAuth,weaponsList}){
  const[open,setOpen]=useState(false);const[weapon,setWeapon]=useState('');const[note,setNote]=useState('');const[videoUrl,setVideoUrl]=useState('');const[loading,setLoading]=useState(false);const[success,setSuccess]=useState(false);
  const currentSlots=ATTACHMENT_SLOTS[activeTab]||ATTACHMENT_SLOTS['Other'];const slotNames=Object.keys(currentSlots);
  const[atts,setAtts]=useState(()=>Object.fromEntries(slotNames.map(s=>[s,'None'])));
  useEffect(()=>{setWeapon('');const s=ATTACHMENT_SLOTS[activeTab]||ATTACHMENT_SLOTS['Other'];setAtts(Object.fromEntries(Object.keys(s).map(k=>[k,'None'])));},[activeTab]);
  function handleOpen(){if(!user){onNeedAuth();return;}setOpen(o=>!o);}
  async function submit(){if(!weapon)return;setLoading(true);const attList=Object.entries(atts).filter(([,v])=>v&&v!=='None').map(([slot,val])=>`${slot}: ${val}`);await sbFetch('loadouts',{method:'POST',body:JSON.stringify({weapon_name:weapon,class:activeTab,mode:activeMode,attachments:attList,note:note.trim(),submitted_by:gamertag||'Anonymous',user_id:user?.id||null,video_url:videoUrl.trim()||null,votes:0})});setLoading(false);setSuccess(true);setWeapon('');setNote('');setVideoUrl('');setAtts(Object.fromEntries(slotNames.map(s=>[s,'None'])));setTimeout(()=>{setSuccess(false);setOpen(false);onSubmitted();},1500);}
  const activeAttCount=Object.values(atts).filter(v=>v&&v!=='None').length;
  const vb=gunViewBox(activeTab);const svg=drawGunSVG(activeTab,atts);
  return(<div style={{marginBottom:'16px'}}>
    <button onClick={handleOpen} style={{background:'#00e5ff22',border:'1px solid #00e5ff44',borderRadius:'3px',color:'#00e5ff',fontSize:'12px',padding:'12px 20px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'2px',width:'100%'}}>{open?'✕ CANCEL':'+ SUBMIT YOUR LOADOUT'}</button>
    {open&&<div style={{background:'#0d1117',border:'1px solid #30363d',borderRadius:'4px',padding:'16px',marginTop:'8px',display:'grid',gap:'12px'}}>
      <div style={{background:'#080b10',border:'1px solid #21262d',borderRadius:'4px',padding:'10px 14px'}}>
        <div style={{color:'#00e5ff',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'4px'}}>{weapon?`// ${weapon.toUpperCase()}`:'// SELECT WEAPON TO PREVIEW'}</div>
        <svg width="100%" viewBox={vb} style={{display:'block'}}>{weapon?<g dangerouslySetInnerHTML={{__html:svg}}/>:<text x="50%" y="50%" textAnchor="middle" fill="#484f58" fontSize="11" fontFamily="Courier New" letterSpacing="2">// BUILD YOUR LOADOUT BELOW</text>}</svg>
        <div style={{color:activeAttCount===9?'#00e5ff':activeAttCount>=5?'#ff8c00':'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",textAlign:'right'}}>{activeAttCount} / 9 ATTACHMENTS</div>
      </div>
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// WEAPON</div><WeaponDropdown weapons={weaponsList} value={weapon} onChange={setWeapon}/></div>
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// CORE ATTACHMENTS</div><div style={{display:'grid',gap:'6px'}}>{Object.entries(currentSlots).filter(([slot])=>SLOT_GROUPS.core.includes(slot)).map(([slot,opts])=><Dropdown key={slot} label={slot.toUpperCase()} placeholder={`Select ${slot}...`} options={opts} value={atts[slot]||'None'} onChange={val=>setAtts(p=>({...p,[slot]:val}))}/>)}</div></div>
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// HANDLING & CONTROL</div><div style={{display:'grid',gap:'6px'}}>{Object.entries(currentSlots).filter(([slot])=>SLOT_GROUPS.handle.includes(slot)).map(([slot,opts])=><Dropdown key={slot} label={slot.toUpperCase()} placeholder={`Select ${slot}...`} options={opts} value={atts[slot]||'None'} onChange={val=>setAtts(p=>({...p,[slot]:val}))}/>)}</div></div>
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// MODS</div><div style={{display:'grid',gap:'6px'}}>{Object.entries(currentSlots).filter(([slot])=>SLOT_GROUPS.mods.includes(slot)).map(([slot,opts])=><Dropdown key={slot} label={slot.toUpperCase()} placeholder={`Select ${slot}...`} options={opts} value={atts[slot]||'None'} onChange={val=>setAtts(p=>({...p,[slot]:val}))}/>)}</div></div>
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// YOUTUBE VIDEO (optional)</div><input style={inp} placeholder="Paste YouTube URL..." value={videoUrl} onChange={e=>setVideoUrl(e.target.value)}/></div>
      <input style={inp} placeholder="// Note — tip, playstyle, range..." value={note} onChange={e=>setNote(e.target.value)}/>
      <button onClick={submit} disabled={loading||success||!weapon} style={{background:success?'#00e5ff44':'#00e5ff22',border:'1px solid #00e5ff',borderRadius:'3px',color:'#00e5ff',fontSize:'14px',padding:'14px',cursor:weapon?'pointer':'not-allowed',fontFamily:"'Courier New', monospace",letterSpacing:'2px',opacity:weapon?1:0.5}}>{success?'✓ SUBMITTED!':loading?'SUBMITTING...':'SUBMIT'}</button>
    </div>}
  </div>);
}

// ── COMMENT SECTION ───────────────────────────────────────────────────────────
function CommentSection({loadoutId,gamertag}){
  const[comments,setComments]=useState([]);const[input,setInput]=useState('');const[open,setOpen]=useState(false);const[loaded,setLoaded]=useState(false);
  async function loadComments(){const data=await sbFetch(`comments?loadout_id=eq.${loadoutId}&order=created_at.asc`);if(data)setComments(data);setLoaded(true);}
  function toggle(){if(!open&&!loaded)loadComments();setOpen(o=>!o);}
  async function submit(){if(!input.trim())return;const data=await sbFetch('comments',{method:'POST',body:JSON.stringify({loadout_id:loadoutId,author:gamertag||'Anonymous',body:input.trim()})});if(data)setComments(c=>[...c,...(Array.isArray(data)?data:[data])]);setInput('');}
  return(<div style={{marginTop:'12px',borderTop:'1px solid #21262d',paddingTop:'10px'}}>
    <button onClick={toggle} style={{background:'none',border:'none',color:'#484f58',fontSize:'12px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'1px',padding:'4px 0',minHeight:'44px'}}>{open?'// HIDE COMMENTS':`// COMMENTS (${comments.length})`}</button>
    {open&&<div style={{marginTop:'10px'}}>
      {comments.length===0&&<div style={{color:'#484f58',fontSize:'12px',fontFamily:"'Courier New', monospace",marginBottom:'8px'}}>// no comments yet — be first</div>}
      {comments.map(c=><div key={c.id} style={{background:'#0d1117',border:'1px solid #21262d',borderRadius:'3px',padding:'10px',marginBottom:'6px'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{color:'#00e5ff',fontSize:'11px',fontFamily:"'Courier New', monospace"}}>{c.author}</span><span style={{color:'#484f58',fontSize:'11px',fontFamily:"'Courier New', monospace"}}>{new Date(c.created_at).toLocaleDateString()}</span></div><div style={{color:'#c9d1d9',fontSize:'13px',lineHeight:'1.4'}}>{c.body}</div></div>)}
      <div style={{display:'grid',gap:'8px',marginTop:'10px'}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="drop your thoughts..." style={{...inp,padding:'10px'}}/><button onClick={submit} style={{background:'#00e5ff22',border:'1px solid #00e5ff44',borderRadius:'3px',color:'#00e5ff',fontSize:'13px',padding:'12px',cursor:'pointer',fontFamily:"'Courier New', monospace",width:'100%'}}>POST COMMENT</button></div>
    </div>}
  </div>);
}

// ── LOADOUT CARD ──────────────────────────────────────────────────────────────
function LoadoutCard({loadout,index,activeTab,user,onDeleted,weaponGame}){
  const[votes,setVotes]=useState(loadout.votes||0);const[userVote,setUserVote]=useState(null);const[deleting,setDeleting]=useState(false);
  const isOwner=user&&user.id===loadout.user_id;const ytId=getYouTubeId(loadout.video_url);const tier=getTier(votes);const tierStyle=TIER_COLORS[tier];
  const parsedAtts=parseAtts(loadout.attachments);const vb=gunViewBox(activeTab);const svg=drawGunSVG(activeTab,parsedAtts);
  const gameBadge=GAME_BADGE[weaponGame]||GAME_BADGE['Warzone'];
  async function handleVote(dir){if(userVote===dir)return;const fp=getFingerprint();const delta=dir==='up'?1:-1;const undo=userVote!==null?(userVote==='up'?-1:1):0;const newVotes=votes+delta+undo;setVotes(newVotes);setUserVote(dir);if(userVote!==null)await sbFetch(`votes?loadout_id=eq.${loadout.id}&fingerprint=eq.${fp}`,{method:'DELETE'});await sbFetch('votes',{method:'POST',body:JSON.stringify({loadout_id:loadout.id,fingerprint:fp,direction:dir})});await sbFetch(`loadouts?id=eq.${loadout.id}`,{method:'PATCH',body:JSON.stringify({votes:newVotes})});}
  async function handleDelete(){if(!confirm('Delete this loadout?'))return;setDeleting(true);await sbFetch(`loadouts?id=eq.${loadout.id}`,{method:'DELETE'});onDeleted(loadout.id);}
  return(<div style={{background:'linear-gradient(135deg,#0d1117 0%,#161b22 100%)',border:'1px solid #30363d',borderRadius:'4px',overflow:'hidden',animation:'fadeSlideIn 0.4s ease both',animationDelay:`${index*0.08}s`}}>
    <div style={{background:'linear-gradient(90deg,#1a1f2e 0%,#0d1117 100%)',borderBottom:'2px solid #00e5ff22',padding:'12px 14px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
          <div style={{width:'4px',height:'32px',background:'linear-gradient(180deg,#00e5ff,#0077ff)',borderRadius:'2px',flexShrink:0}}/>
          <div style={{minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'2px'}}>
              <div style={{fontSize:'10px',color:'#00e5ff',letterSpacing:'2px',textTransform:'uppercase',fontFamily:"'Courier New', monospace"}}>{loadout.submitted_by||'Anonymous'}</div>
              <span style={{background:gameBadge.bg,border:`1px solid ${gameBadge.color}44`,color:gameBadge.color,fontSize:'8px',padding:'1px 4px',borderRadius:'2px',fontFamily:"'Courier New', monospace",letterSpacing:'1px'}}>{gameBadge.label}</span>
            </div>
            <div style={{fontSize:'16px',fontWeight:'700',color:'#e6f0ff',fontFamily:"'Courier New', monospace"}}>{loadout.weapon_name}</div>
          </div>
        </div>
        {isOwner&&<button onClick={handleDelete} disabled={deleting} style={{background:'#ff444411',border:'1px solid #ff444433',borderRadius:'3px',color:'#ff4444',fontSize:'11px',padding:'6px 10px',cursor:'pointer',fontFamily:"'Courier New', monospace",flexShrink:0,letterSpacing:'1px'}}>{deleting?'...':'DELETE'}</button>}
      </div>
      <div style={{marginTop:'10px',opacity:0.9}}><svg width="100%" viewBox={vb} style={{display:'block'}}><g dangerouslySetInnerHTML={{__html:svg}}/></svg></div>
    </div>
    <div style={{padding:'14px'}}>
      <div style={{background:'#0a0e14',border:'1px solid #21262d',borderRadius:'3px',padding:'14px',position:'relative'}}>
        <div style={{position:'absolute',top:0,right:0,background:tierStyle.bg,color:tierStyle.text,fontSize:'9px',fontWeight:'900',letterSpacing:'2px',padding:'3px 8px',fontFamily:"'Courier New', monospace"}}>{tierStyle.label}</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{paddingTop:'8px'}}>{Object.entries(SLOT_COLORS).map(([slot,color])=>{const val=parsedAtts[slot];if(!val||val==='None')return null;return(<div key={slot} style={{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'6px',flexWrap:'wrap'}}><span style={{color:color,fontSize:'9px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",flexShrink:0,minWidth:'80px'}}>{slot.toUpperCase()}</span><span style={{background:'#161b22',border:`1px solid ${color}33`,color:'#c9d1d9',fontSize:'13px',padding:'4px 10px',borderRadius:'2px',fontFamily:"'Courier New', monospace",lineHeight:'1.4'}}>{val}</span></div>);})}</div>
            {loadout.note&&<div style={{fontSize:'12px',color:'#484f58',fontStyle:'italic',marginTop:'8px'}}>// {loadout.note}</div>}
            {ytId&&<div style={{marginTop:'12px',borderRadius:'4px',overflow:'hidden',border:'1px solid #21262d',position:'relative',paddingTop:'56.25%'}}><iframe src={`https://www.youtube.com/embed/${ytId}`} title="Loadout video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}/></div>}
            <CommentSection loadoutId={loadout.id} gamertag={loadout.submitted_by}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',flexShrink:0}}>
            <button onClick={()=>handleVote('up')} style={{width:'44px',height:'44px',background:userVote==='up'?'#00e5ff22':'#161b22',border:userVote==='up'?'1px solid #00e5ff':'1px solid #30363d',borderRadius:'3px',color:userVote==='up'?'#00e5ff':'#8b949e',cursor:'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>▲</button>
            <div style={{fontSize:'14px',fontWeight:'700',color:votes>=20?'#ff4444':votes>=10?'#ff8c00':'#e6f0ff',fontFamily:"'Courier New', monospace",minWidth:'28px',textAlign:'center'}}>{votes}</div>
            <button onClick={()=>handleVote('down')} style={{width:'44px',height:'44px',background:userVote==='down'?'#ff444422':'#161b22',border:userVote==='down'?'1px solid #ff4444':'1px solid #30363d',borderRadius:'3px',color:userVote==='down'?'#ff4444':'#8b949e',cursor:'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>▼</button>
          </div>
        </div>
      </div>
    </div>
  </div>);
}

// ── HOME ──────────────────────────────────────────────────────────────────────
export default function Home(){
  const[active,setActive]=useState('AR');const[mode,setMode]=useState('Warzone');const[loadouts,setLoadouts]=useState([]);const[loading,setLoading]=useState(true);const[user,setUser]=useState(null);const[gamertag,setGamertag]=useState('');const[showAuth,setShowAuth]=useState(false);
  const[allWeapons,setAllWeapons]=useState([]);const[weaponsLoading,setWeaponsLoading]=useState(true);
  useEffect(()=>{async function fetchWeapons(){setWeaponsLoading(true);const data=await sbFetch('weapons?order=game.asc,name.asc');setAllWeapons(data||[]);setWeaponsLoading(false);}fetchWeapons();},[]);
  const weaponsList=allWeapons.filter(w=>w.class===active);
  async function fetchLoadouts(){setLoading(true);const data=await sbFetch(`loadouts?class=eq.${active}&mode=eq.${mode}&order=votes.desc`);setLoadouts(data||[]);setLoading(false);}
  useEffect(()=>{fetchLoadouts();},[active,mode]);
  function handleAuth({user,gamertag}){setUser(user);setGamertag(gamertag);setShowAuth(false);}
  async function handleLogout(){await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});setUser(null);setGamertag('');}
  function getWeaponGame(weaponName){const w=allWeapons.find(x=>x.name===weaponName);return w?.game||'Warzone';}
  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}body{background:#080b10;}html{-webkit-text-size-adjust:100%;}
      @keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      button:hover{filter:brightness(1.2);}input,button{-webkit-appearance:none;}input:focus{outline:1px solid #00e5ff44;}
      .tab-scroll{display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;border-bottom:1px solid #21262d;}
      .tab-scroll::-webkit-scrollbar{display:none;}
      .tab-btn{flex-shrink:0;padding:12px 16px;background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Rajdhani,sans-serif;transition:all 0.15s;margin-bottom:-1px;white-space:nowrap;}
      .tab-btn.active{color:#00e5ff;border-bottom-color:#00e5ff;}.tab-btn:not(.active){color:#8b949e;}
      ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0d1117;}::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px;}
    `}</style>
    {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={handleAuth}/>}
    <div style={{background:'#080b10',minHeight:'100vh',color:'#e6f0ff'}}>
      <header style={{background:'linear-gradient(180deg,#0d1117 0%,#080b10 100%)',borderBottom:'1px solid #21262d',padding:'0 16px',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:'54px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'3px',height:'26px',background:'linear-gradient(180deg,#00e5ff,#0055ff)'}}/>
            <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'20px',fontWeight:'700',letterSpacing:'3px',color:'#fff'}}>META</span>
            <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'20px',fontWeight:'700',letterSpacing:'3px',color:'#00e5ff'}}>DOOTY</span>
            <div style={{background:'#00e5ff22',border:'1px solid #00e5ff44',color:'#00e5ff',fontSize:'8px',letterSpacing:'2px',padding:'2px 6px',fontFamily:"'Courier New', monospace"}}>MVP</div>
          </div>
          {user?(<div style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{color:'#00e5ff',fontFamily:"'Courier New', monospace",fontSize:'12px',letterSpacing:'1px'}}>{gamertag}</span><button onClick={handleLogout} style={{background:'none',border:'1px solid #30363d',borderRadius:'3px',color:'#484f58',fontSize:'11px',padding:'6px 10px',cursor:'pointer',fontFamily:"'Courier New', monospace"}}>LOGOUT</button></div>):(<button onClick={()=>setShowAuth(true)} style={{background:'#00e5ff22',border:'1px solid #00e5ff44',borderRadius:'3px',color:'#00e5ff',fontSize:'11px',padding:'8px 14px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'1px'}}>LOGIN / SIGN UP</button>)}
        </div>
      </header>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'12px 16px 0'}}>
        <div style={{display:'flex',background:'#0d1117',border:'1px solid #21262d',borderRadius:'4px',padding:'4px',gap:'4px'}}>
          {MODES.map(m=><button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:'10px',borderRadius:'3px',cursor:'pointer',fontFamily:'Rajdhani, sans-serif',fontSize:'13px',fontWeight:'700',letterSpacing:'2px',background:mode===m?(m==='Warzone'?'#00e5ff22':'#ff8c0022'):'transparent',border:mode===m?`1px solid ${m==='Warzone'?'#00e5ff44':'#ff8c0044'}`:'1px solid transparent',color:mode===m?(m==='Warzone'?'#00e5ff':'#ff8c00'):'#484f58',transition:'all 0.15s'}}>{m==='Warzone'?'🟦 WARZONE':'🟧 MULTIPLAYER'}</button>)}
        </div>
      </div>
      <div className="tab-scroll" style={{padding:'0 16px',maxWidth:'900px',margin:'0 auto'}}>
        {TABS.map(tab=>(
          <button key={tab} onClick={()=>setActive(tab)} className={`tab-btn${active===tab?' active':''}`}>
            {tab}
            {!weaponsLoading&&<span style={{fontSize:'9px',color:'#484f58',marginLeft:'4px',fontFamily:"'Courier New', monospace"}}>({allWeapons.filter(w=>w.class===tab).length})</span>}
          </button>
        ))}
      </div>
      <main style={{maxWidth:'900px',margin:'0 auto',padding:'16px'}}>
        <Leaderboard/>
        <SubmitLoadout activeTab={active} activeMode={mode} onSubmitted={fetchLoadouts} user={user} gamertag={gamertag} onNeedAuth={()=>setShowAuth(true)} weaponsList={weaponsList}/>
        <div style={{display:'grid',gap:'12px'}}>
          {loading&&<div style={{color:'#484f58',fontFamily:"'Courier New', monospace",fontSize:'12px',letterSpacing:'2px',padding:'40px',textAlign:'center'}}>// LOADING LOADOUTS...</div>}
          {!loading&&loadouts.length===0&&<div style={{textAlign:'center',padding:'60px 20px',color:'#484f58',fontFamily:"'Courier New', monospace",fontSize:'13px',letterSpacing:'2px',border:'1px dashed #21262d',borderRadius:'4px'}}>// NO LOADOUTS YET — BE THE FIRST TO SUBMIT</div>}
          {!loading&&loadouts.map((l,i)=><LoadoutCard key={l.id} loadout={l} index={i} activeTab={active} user={user} onDeleted={id=>setLoadouts(prev=>prev.filter(x=>x.id!==id))} weaponGame={getWeaponGame(l.weapon_name)}/>)}
        </div>
      </main>
      <FeedbackButton gamertag={gamertag}/>
    </div>
  </>);
}
