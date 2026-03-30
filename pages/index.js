import { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = 'https://fllbxwcmpifwtptkzjva.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGJ4d2NtcGlmd3RwdGt6anZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjgzNjQsImV4cCI6MjA5MDA0NDM2NH0.hLUFdtpoBXz7quAUs12WtcisbUk7Eu079sKfIcPj3bQ';

const TABS = ['AR', 'SMG', 'LMG', 'Sniper', 'Shotgun', 'DMR', 'Other'];
const MODES = ['Warzone', 'Multiplayer'];

const GAME_BADGE = {
  BO7:     { label: 'BO7',     color: '#ff4444', bg: '#ff444422' },
  BO6:     { label: 'BO6',     color: '#ff8c00', bg: '#ff8c0022' },
  Warzone: { label: 'WZ',      color: '#00e5ff', bg: '#00e5ff22' },
};

// Static attachment slots — these rarely change mid-season
// To add new attachments: just add to the arrays below and redeploy
const ATTACHMENT_SLOTS = {
  AR: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','Muzzle Brake','Sonic Suppressor','ZEHMN35 Compensated Flash Hider','BO7 Flash Hider','BO7 Compensator','BO7 Muzzle Brake','BO7 Suppressor','BO7 Sonic Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','CHF Barrel','Short Light Barrel','Ranger Barrel','Long Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel','BO7 Short Barrel','MFS Precision Barrel'],
    Optic: ['None','Slate Reflector','Cronen Mini Red Dot','Solozero NVG Enhanced','VLK 4.0x','Corio Eagleseye 2.5x','SZ Recharge-DX','MK. 23 Reflector','JAK Glassless Optic','Kasher Reflex','BO7 Reflex Sight','BO7 Holographic','BO7 2x Scope','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Ranger Foregrip','Bruen Pivot Vertical Grip','Commando Foregrip','Merc Foregrip','Field Agent Foregrip','BO7 Vertical Grip','BO7 Angled Grip','MFS Grenade Launcher','MFS Tactical Grip'],
    Magazine: ['None','30 Round Mag','45 Round Mag','60 Round Mag','Extended Mag','Fast Mag','Flip Mag','Drum Mag','BO7 Standard Mag','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag','BO7 Drum Mag','MFS High Capacity Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','Canted Vibro-Dot 7','Point-G3P 04','SZ 1MW PEQ Laser','BO7 Laser Sight','BO7 PEQ Laser','BO7 Tac Laser','MFS Motion Strike Laser','MFS Precision Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','Bruen Q900 Grip','BRT Grip Tape','D15 Combat Grip','BO7 Grip Tape','BO7 Rubber Grip','BO7 Combat Grip','MFS Tactical Grip','MFS Ergonomic Grip'],
    Stock: ['None','No Stock','Demo Cleanshot Stock','Bruen Pivot Stock','FT Tac-Elite Stock','FTAC Ripper 56','BO7 Heavy Stock','BO7 Light Stock','BO7 Folding Stock','MFS Tactical Stock','MFS Striker Tactical Stock','MFS Counterforce-C1 Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Burst','Single','3-Round Burst','4-Round Burst'],
  },
  SMG: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','Muzzle Brake','Sonic Suppressor','BO7 Flash Hider','BO7 Compensator','BO7 Suppressor','BO7 Sonic Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','Short Light Barrel','Ranger Barrel','CHF Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel','BO7 Short Barrel','MFS Precision Barrel'],
    Optic: ['None','Slate Reflector','Cronen Mini Red Dot','MK. 23 Reflector','Corio CQB Pad','JAK Glassless Optic','Kasher Reflex','BO7 Reflex Sight','BO7 Holographic','BO7 2x Scope','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Commando Foregrip','Bruen Pivot Vertical Grip','Merc Foregrip','Field Agent Foregrip','BO7 Vertical Grip','BO7 Angled Grip','MFS Tactical Grip'],
    Magazine: ['None','24 Round Mag','32 Round Mag','48 Round Mag','Extended Mag','Fast Mag','Flip Mag','BO7 Standard Mag','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag','MFS High Capacity Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','Canted Vibro-Dot 7','Point-G3P 04','BO7 Laser Sight','BO7 PEQ Laser','BO7 Tac Laser','MFS Precision Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','D15 Combat Grip','BRT Grip Tape','BO7 Grip Tape','BO7 Rubber Grip','BO7 Combat Grip','MFS Ergonomic Grip'],
    Stock: ['None','No Stock','Folding Stock','Collapsed Stock','Demo Fade Stock','Agile Assault Stock','BO7 Heavy Stock','BO7 Light Stock','BO7 Folding Stock','MFS Tactical Stock','MFS Striker Tactical Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Burst','3-Round Burst'],
  },
  LMG: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','Muzzle Brake','BO7 Flash Hider','BO7 Compensator','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','CHF Barrel','Short Light Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel','MFS Precision Barrel'],
    Optic: ['None','Slate Reflector','VLK 4.0x','Corio Eagleseye 2.5x','SZ Recharge-DX','MK. 23 Reflector','BO7 Reflex Sight','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Ranger Foregrip','Commando Foregrip','Bruen Pivot Vertical Grip','BO7 Vertical Grip','BO7 Angled Grip','MFS Grenade Launcher'],
    Magazine: ['None','75 Round Belt','100 Round Belt','Extended Belt','Fast Mag','Drum Mag','BO7 Standard Mag','BO7 Extended Mag','BO7 Large Mag','BO7 Drum Mag','MFS High Capacity Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','Point-G3P 04','MFS Motion Strike Laser','BO7 Laser Sight','BO7 Tac Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','D15 Combat Grip','BO7 Grip Tape','BO7 Combat Grip','MFS Tactical Grip'],
    Stock: ['None','LM Stockless Mod','Demo Cleanshot Stock','FT Tac-Elite Stock','BO7 Heavy Stock','BO7 Light Stock','MFS Tactical Stock'],
    'Fire Mode': ['None','Full Auto','Semi Auto','Dual Fire Mode (Sokol 545)'],
  },
  Sniper: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','BO7 Flash Hider','BO7 Compensator','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','Short Light Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel','MFS Precision Barrel'],
    Optic: ['None','Schlager 4.0x','Forge Tac Delta 4','Corio Eagleseye 2.5x','SP-X 80 6.6x','Victus V20 10x','SZ Recharge-DX','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Comb: ['None','Aim-Assist Comb','Pro-Comb','Steady-Aim Comb','BO7 Aim-Assist Comb','BO7 Pro Comb','BO7 Steady Comb'],
    Magazine: ['None','Extended Mag','Fast Mag','Flip Mag','BO7 Extended Mag','BO7 Fast Mag','MFS High Capacity Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','Canted Vibro-Dot 7','BO7 Laser Sight','MFS Precision Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','Schlager Match Grip','BO7 Grip Tape','BO7 Combat Grip','MFS Ergonomic Grip'],
    Stock: ['None','FSS Merc Stock','FT Tac-Elite Stock','Demo Precision Elite Factory','BO7 Heavy Stock','BO7 Light Stock','MFS Tactical Stock'],
    'Fire Mode': ['None','Bolt Action','Semi Auto','3-Round Burst (XR-3 Ion)'],
  },
  Shotgun: {
    Muzzle: ['None','Shadowstrike Suppressor','Compensator','Choke','Full Choke','Cylinder','BO7 Flash Hider','BO7 Compensator','BO7 Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Short Light Barrel','Extended Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel'],
    Optic: ['None','Slate Reflector','Cronen Mini Red Dot','MK. 23 Reflector','BO7 Reflex Sight','BO7 Holographic'],
    Underbarrel: ['None','XTEN Drop Grip','Commando Foregrip','Merc Foregrip','BO7 Vertical Grip','BO7 Angled Grip'],
    Magazine: ['None','Extended Tube','Fast Loader','Drum Shell Holder','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag'],
    Laser: ['None','FSS OLE-V Laser','Canted Vibro-Dot 7','Point-G3P 04','BO7 Laser Sight','BO7 Tac Laser'],
    'Rear Grip': ['None','Commando Grip','D15 Combat Grip','BRT Grip Tape','BO7 Grip Tape','BO7 Combat Grip'],
    Stock: ['None','No Stock','Stockless Pistol Grip','Demo Cleanshot Stock','BO7 Heavy Stock','BO7 Light Stock'],
    'Fire Mode': ['None','Pump Action','Semi Auto','Full Auto','Double Barrel (Echo 12)'],
  },
  DMR: {
    Muzzle: ['None','Shadowstrike Suppressor','Monolithic Suppressor','Compensator','Flash Hider','Muzzle Brake','BO7 Flash Hider','BO7 Compensator','BO7 Suppressor','MFS Motion Suppressor'],
    Barrel: ['None','Reinforced Heavy Barrel','Lightweight Barrel','Extended Barrel','CHF Barrel','BO7 Heavy Barrel','BO7 Lightweight Barrel','BO7 Extended Barrel','MFS Precision Barrel'],
    Optic: ['None','Schlager 4.0x','Corio Eagleseye 2.5x','VLK 4.0x','SZ Recharge-DX','MK. 23 Reflector','JAK Glassless Optic','BO7 4x Scope','BO7 6x Scope','MFS Thermal','MFS Eagle Eye'],
    Underbarrel: ['None','XTEN Drop Grip','Commando Foregrip','Ranger Foregrip','BO7 Vertical Grip','BO7 Angled Grip','MFS Tactical Grip'],
    Magazine: ['None','Extended Mag','Fast Mag','Flip Mag','BO7 Extended Mag','BO7 Fast Mag','BO7 Large Mag','MFS High Capacity Mag'],
    Laser: ['None','FSS OLE-V Laser','Schlager PEQ Box IV','Canted Vibro-Dot 7','BO7 Laser Sight','BO7 Tac Laser','MFS Precision Laser'],
    'Rear Grip': ['None','Commando Grip','Sakin ZX Grip','D15 Combat Grip','BO7 Grip Tape','BO7 Combat Grip','MFS Ergonomic Grip'],
    Stock: ['None','No Stock','FT Tac-Elite Stock','Demo Precision Elite Factory','BO7 Heavy Stock','BO7 Light Stock','MFS Striker Tactical Stock'],
    'Fire Mode': ['None','Semi Auto','Burst','Full Auto','4-Round Burst (M8A1)','Penta Burst (Swordfish A1)'],
  },
  Other: {
    Muzzle: ['None','Suppressor','Compensator','Flash Hider','BO7 Suppressor'],
    Barrel: ['None','Extended Barrel','Short Barrel','BO7 Extended Barrel'],
    Optic: ['None','Slate Reflector','Red Dot','BO7 Reflex Sight'],
    Underbarrel: ['None','Foregrip','Laser','BO7 Vertical Grip'],
    Magazine: ['None','Extended Mag','Fast Mag','BO7 Extended Mag'],
    Laser: ['None','Laser Sight','BO7 Tac Laser'],
    'Rear Grip': ['None','Grip Tape','BO7 Grip Tape'],
    Stock: ['None','No Stock','BO7 Light Stock'],
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

// ── SVG GUN DRAWING ───────────────────────────────────────────────────────────
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
  const bigOpt=opt&&!!(atts.Optic||'').match(/4x|6x|10x|eagleseye|schlager|forge|victus|thermal|eagle/i);
  const bigMag=mag&&!!(atts.Magazine||'').match(/60|100|drum|belt|large/i);
  const noStk=stk&&!!(atts.Stock||'').match(/no stock|stockless|pistol grip/i);
  const foldStk=stk&&!!(atts.Stock||'').match(/fold|collapse/i);
  const fns={AR:drawAR,SMG:drawSMG,LMG:drawLMG,Sniper:drawSniper,Shotgun:drawShotgun,DMR:drawDMR};
  return (fns[cls]||drawAR)(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag);
}

function drawAR(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?72:52,mL=muz?(supp?34:16):0,sX=noStk?110:foldStk?80:60;let s='';
  if(!noStk){s+=`<rect x="${sX}" y="34" width="${foldStk?32:48}" height="12" rx="3" fill="${stk?GA:GC}"/>`;s+=`<rect x="${sX+4}" y="46" width="13" height="${foldStk?16:22}" rx="3" fill="${stk?GA:GD}"/>`;if(!foldStk)s+=`<rect x="${sX+40}" y="46" width="10" height="18" rx="2" fill="${GD}"/>`;}
  const rx=noStk?sX:foldStk?sX+32:sX+48;
  s+=`<rect x="${rx}" y="28" width="68" height="16" rx="2" fill="${GC}"/>`;
  s+=`<rect x="${rx}" y="42" width="64" height="10" rx="2" fill="${GD}"/>`;
  s+=`<rect x="${rx+14}" y="50" width="14" height="${bigMag?34:26}" rx="4" fill="${grip?GA:GC}"/>`;
  s+=`<path d="M${rx+8},51 Q${rx+4},62 ${rx+14},62 L${rx+16},62" stroke="${GD}" stroke-width="1.5" fill="none"/>`;
  s+=`<rect x="${rx+4}" y="20" width="52" height="10" rx="2" fill="${GL}"/>`;
  s+=`<rect x="${rx+5}" y="18" width="48" height="4" rx="1" fill="${GD}"/>`;
  if(fmode)s+=`<rect x="${rx+46}" y="36" width="8" height="4" rx="1" fill="${GO}" opacity="0.8"/>`;
  const hx=rx+68;
  s+=`<rect x="${hx}" y="26" width="${bL+8}" height="13" rx="2" fill="${GC}"/>`;
  s+=`<rect x="${hx}" y="38" width="${bL}" height="8" rx="1" fill="${GD}"/>`;
  if(bar)s+=`<rect x="${hx+bL-2}" y="28" width="18" height="8" rx="1" fill="${GA}" opacity="0.5"/>`;
  if(muz){const mx=hx+bL+(bar?18:4);if(supp){s+=`<rect x="${mx}" y="24" width="${mL}" height="16" rx="6" fill="${GA}"/>`;for(let i=0;i<4;i++)s+=`<line x1="${mx+7+i*7}" y1="24" x2="${mx+7+i*7}" y2="40" stroke="${GD}" stroke-width="1.2" opacity="0.5"/>`;}else{s+=`<rect x="${mx}" y="27" width="${mL}" height="10" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx+mL-4}" y="25" width="4" height="14" rx="1" fill="${GL}"/>`;}}
  if(opt){const ox=rx+6,ow=bigOpt?42:24,oh=bigOpt?18:13;s+=`<rect x="${ox}" y="${8-(bigOpt?5:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${ox+4}" y="${10-(bigOpt?5:0)}" width="${ow-8}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.6"/>`;s+=`<circle cx="${ox+ow/2}" cy="${10-(bigOpt?5:0)+(oh-6)/2}" r="${bigOpt?5:3}" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="${ox+4}" y="${8+oh-(bigOpt?5:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+ow-8}" y="${8+oh-(bigOpt?5:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;}
  if(und){s+=`<rect x="${hx+8}" y="46" width="18" height="${las?24:20}" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${hx+12}" y="50" width="10" height="12" rx="2" fill="${GD}" opacity="0.5"/>`;}
  if(las&&!und){s+=`<rect x="${hx+10}" y="43" width="12" height="6" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+22}" y1="46" x2="${hx+38}" y2="46" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(las&&und){s+=`<rect x="${hx+12}" y="66" width="10" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;}
  if(mag){const mgx=rx+20,mgh=bigMag?34:24;s+=`<rect x="${mgx}" y="52" width="15" height="${mgh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="${mgx+3}" y="56" width="9" height="${mgh-8}" rx="2" fill="${GD}" opacity="0.5"/>`;if(bigMag)s+=`<rect x="${mgx-3}" y="62" width="21" height="${mgh-14}" rx="2" fill="${GA}" opacity="0.35"/>`;}
  return s;
}
function drawSMG(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?52:36,mL=muz?(supp?26:12):0,sX=noStk?130:foldStk?100:80;let s='';
  if(!noStk){s+=`<rect x="${sX}" y="34" width="${foldStk?28:36}" height="10" rx="3" fill="${stk?GA:GC}"/>`;s+=`<rect x="${sX+2}" y="44" width="11" height="${foldStk?14:20}" rx="2" fill="${stk?GA:GD}"/>`;}
  const rx=noStk?sX:foldStk?sX+28:sX+36;
  s+=`<rect x="${rx}" y="28" width="56" height="14" rx="2" fill="${GC}"/>`;s+=`<rect x="${rx}" y="40" width="52" height="8" rx="2" fill="${GD}"/>`;
  s+=`<rect x="${rx+13}" y="46" width="12" height="${bigMag?28:20}" rx="4" fill="${grip?GA:GC}"/>`;
  s+=`<path d="M${rx+7},47 Q${rx+4},56 ${rx+13},56 L${rx+15},56" stroke="${GD}" stroke-width="1.5" fill="none"/>`;
  s+=`<rect x="${rx+4}" y="20" width="44" height="9" rx="2" fill="${GL}"/>`;s+=`<rect x="${rx+5}" y="18" width="40" height="4" rx="1" fill="${GD}"/>`;
  if(fmode)s+=`<rect x="${rx+38}" y="36" width="6" height="4" rx="1" fill="${GO}" opacity="0.8"/>`;
  const hx=rx+56;
  s+=`<rect x="${hx}" y="26" width="${bL+6}" height="12" rx="2" fill="${GC}"/>`;s+=`<rect x="${hx}" y="37" width="${bL}" height="6" rx="1" fill="${GD}"/>`;
  if(bar)s+=`<rect x="${hx+bL-2}" y="28" width="12" height="6" rx="1" fill="${GA}" opacity="0.5"/>`;
  if(muz){const mx=hx+bL+(bar?12:4);if(supp){s+=`<rect x="${mx}" y="25" width="${mL}" height="12" rx="4" fill="${GA}"/>`;for(let i=0;i<3;i++)s+=`<line x1="${mx+5+i*6}" y1="25" x2="${mx+5+i*6}" y2="37" stroke="${GD}" stroke-width="1" opacity="0.5"/>`;}else{s+=`<rect x="${mx}" y="27" width="${mL}" height="8" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx+mL-3}" y="26" width="3" height="10" rx="1" fill="${GL}"/>`;}}
  if(opt){const ox=rx+5,ow=bigOpt?34:20,oh=bigOpt?16:12;s+=`<rect x="${ox}" y="${9-(bigOpt?4:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${ox+3}" y="${11-(bigOpt?4:0)}" width="${ow-6}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.6"/>`;s+=`<circle cx="${ox+ow/2}" cy="${11-(bigOpt?4:0)+(oh-6)/2}" r="${bigOpt?4:2.5}" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="${ox+3}" y="${9+oh-(bigOpt?4:0)}" width="3" height="4" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+ow-6}" y="${9+oh-(bigOpt?4:0)}" width="3" height="4" rx="1" fill="${GD}"/>`;}
  if(und)s+=`<rect x="${hx+6}" y="43" width="14" height="16" rx="2" fill="${GA}" opacity="0.85"/>`;
  if(las&&!und){s+=`<rect x="${hx+8}" y="40" width="10" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+18}" y1="42" x2="${hx+30}" y2="42" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(las&&und)s+=`<rect x="${hx+8}" y="59" width="10" height="4" rx="2" fill="${GV}" opacity="0.9"/>`;
  if(mag){const mgx=rx+17,mgh=bigMag?28:20;s+=`<rect x="${mgx}" y="50" width="12" height="${mgh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="${mgx+3}" y="54" width="6" height="${mgh-8}" rx="2" fill="${GD}" opacity="0.5"/>`;}
  return s;
}
function drawLMG(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?88:68,mL=muz?(supp?36:18):0,sX=50;let s='';
  s+=`<rect x="${sX}" y="30" width="52" height="14" rx="3" fill="${stk?GA:GC}"/>`;s+=`<rect x="${sX+4}" y="44" width="14" height="26" rx="3" fill="${stk?GA:GD}"/>`;s+=`<rect x="${sX+44}" y="44" width="10" height="20" rx="2" fill="${GD}"/>`;
  const rx=sX+52;
  s+=`<rect x="${rx}" y="22" width="70" height="18" rx="2" fill="${GC}"/>`;s+=`<rect x="${rx}" y="38" width="66" height="10" rx="2" fill="${GD}"/>`;
  s+=`<rect x="${rx+16}" y="46" width="16" height="${bigMag?36:28}" rx="4" fill="${grip?GA:GC}"/>`;
  s+=`<rect x="${rx+4}" y="12" width="54" height="12" rx="2" fill="${GL}"/>`;s+=`<rect x="${rx+5}" y="10" width="50" height="4" rx="1" fill="${GD}"/>`;
  if(fmode)s+=`<rect x="${rx+54}" y="36" width="8" height="4" rx="1" fill="${GO}" opacity="0.8"/>`;
  const hx=rx+70;
  s+=`<rect x="${hx}" y="20" width="${bL+10}" height="14" rx="2" fill="${GC}"/>`;s+=`<rect x="${hx}" y="34" width="${bL}" height="8" rx="1" fill="${GD}"/>`;
  if(bar){s+=`<rect x="${hx+bL-4}" y="22" width="20" height="9" rx="1" fill="${GA}" opacity="0.5"/>`;s+=`<rect x="${hx+bL+14}" y="20" width="4" height="13" rx="1" fill="${GL}"/>`;}
  if(muz){const mx=hx+bL+(bar?20:4);if(supp){s+=`<rect x="${mx}" y="19" width="${mL}" height="16" rx="6" fill="${GA}"/>`;for(let i=0;i<5;i++)s+=`<line x1="${mx+6+i*6}" y1="19" x2="${mx+6+i*6}" y2="35" stroke="${GD}" stroke-width="1" opacity="0.4"/>`;}else{s+=`<rect x="${mx}" y="21" width="${mL}" height="12" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx+mL-4}" y="19" width="4" height="16" rx="1" fill="${GL}"/>`;}}
  if(opt){const ox=rx+6,ow=bigOpt?44:26,oh=bigOpt?20:14;s+=`<rect x="${ox}" y="${4-(bigOpt?4:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${ox+4}" y="${6-(bigOpt?4:0)}" width="${ow-8}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.6"/>`;s+=`<circle cx="${ox+ow/2}" cy="${6-(bigOpt?4:0)+(oh-6)/2}" r="${bigOpt?6:3.5}" fill="${GA}" opacity="0.35"/>`;s+=`<rect x="${ox+5}" y="${4+oh-(bigOpt?4:0)}" width="4" height="6" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+ow-9}" y="${4+oh-(bigOpt?4:0)}" width="4" height="6" rx="1" fill="${GD}"/>`;}
  if(und){s+=`<rect x="${hx+10}" y="42" width="20" height="22" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${hx+14}" y="46" width="12" height="14" rx="2" fill="${GD}" opacity="0.5"/>`;}
  if(las&&!und){s+=`<rect x="${hx+12}" y="37" width="12" height="6" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+24}" y1="40" x2="${hx+40}" y2="40" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(las&&und)s+=`<rect x="${hx+14}" y="64" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;
  if(mag){const mgx=rx+20,mgh=bigMag?36:24,mgw=bigMag?30:20;s+=`<rect x="${mgx}" y="50" width="${mgw}" height="${mgh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="${mgx+3}" y="54" width="${mgw-6}" height="${mgh-10}" rx="2" fill="${GD}" opacity="0.4"/>`;if(bigMag)for(let i=0;i<4;i++)s+=`<rect x="${mgx+mgw}" y="${52+i*6}" width="8" height="4" rx="1" fill="${GA}" opacity="0.6"/>`;}
  return s;
}
function drawSniper(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?120:95,mL=muz?(supp?42:20):0,sX=20;let s='';
  s+=`<rect x="${sX}" y="32" width="68" height="10" rx="3" fill="${stk?GA:GC}"/>`;s+=`<rect x="${sX}" y="42" width="66" height="24" rx="4" fill="${stk?GA:GD}"/>`;
  if(und){s+=`<rect x="${sX+8}" y="22" width="46" height="12" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${sX+10}" y="24" width="42" height="7" rx="2" fill="${GD}" opacity="0.5"/>`;}
  const rx=sX+68;
  s+=`<rect x="${rx}" y="24" width="74" height="16" rx="2" fill="${GC}"/>`;s+=`<rect x="${rx}" y="38" width="70" height="8" rx="1" fill="${GD}"/>`;
  s+=`<rect x="${rx+18}" y="44" width="14" height="24" rx="4" fill="${grip?GA:GC}"/>`;
  s+=`<rect x="${rx+44}" y="22" width="6" height="4" rx="1" fill="${GL}"/>`;s+=`<circle cx="${rx+54}" cy="24" r="4" fill="${GL}"/>`;
  const hx=rx+74;
  s+=`<rect x="${hx}" y="28" width="${bL}" height="10" rx="1" fill="${bar?GA:GC}" opacity="${bar?0.9:1}"/>`;
  if(bar)s+=`<rect x="${hx}" y="29" width="${bL}" height="4" rx="1" fill="${GA}" opacity="0.3"/>`;
  if(muz){const mx=hx+bL;if(supp){s+=`<rect x="${mx}" y="24" width="${mL}" height="18" rx="7" fill="${GA}"/>`;for(let i=0;i<5;i++)s+=`<line x1="${mx+7+i*7}" y1="24" x2="${mx+7+i*7}" y2="42" stroke="${GD}" stroke-width="1.5" opacity="0.45"/>`;}else{s+=`<rect x="${mx}" y="26" width="${mL}" height="14" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx+mL-5}" y="24" width="5" height="18" rx="1" fill="${GL}"/>`;for(let i=0;i<3;i++)s+=`<rect x="${mx+4+i*5}" y="26" width="2" height="6" rx="1" fill="${GD}" opacity="0.6"/>`;}}
  if(opt){const ox=rx+8,ow=bigOpt?68:50,oh=bigOpt?22:18;s+=`<rect x="${ox}" y="${4-(bigOpt?3:0)}" width="${ow}" height="${oh}" rx="4" fill="${GA}" opacity="0.9"/>`;s+=`<circle cx="${ox+10}" cy="${4-(bigOpt?3:0)+oh/2}" r="${bigOpt?9:7}" fill="${GD}" opacity="0.5"/>`;s+=`<circle cx="${ox+ow-10}" cy="${4-(bigOpt?3:0)+oh/2}" r="${bigOpt?10:8}" fill="${GD}" opacity="0.5"/>`;s+=`<rect x="${ox+18}" y="${6-(bigOpt?3:0)}" width="${ow-36}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.3"/>`;s+=`<rect x="${ox+ow/2-3}" y="2" width="6" height="5" rx="1" fill="${GL}"/>`;s+=`<rect x="${ox+12}" y="${4+oh-(bigOpt?3:0)}" width="5" height="7" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+ow-17}" y="${4+oh-(bigOpt?3:0)}" width="5" height="7" rx="1" fill="${GD}"/>`;}
  if(las){s+=`<rect x="${hx+8}" y="38" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+20}" y1="40" x2="${hx+38}" y2="40" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(mag){s+=`<rect x="${rx+26}" y="52" width="14" height="22" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="${rx+29}" y="56" width="8" height="14" rx="2" fill="${GD}" opacity="0.4"/>`;}
  return s;
}
function drawShotgun(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?76:58,mL=muz?(supp?28:14):0,sX=noStk?120:85;let s='';
  if(!noStk){s+=`<rect x="${sX}" y="32" width="56" height="14" rx="4" fill="${stk?GA:GC}"/>`;s+=`<rect x="${sX+4}" y="46" width="13" height="24" rx="4" fill="${stk?GA:GD}"/>`;s+=`<rect x="${sX+46}" y="44" width="12" height="20" rx="3" fill="${GD}"/>`;}
  const rx=noStk?sX:sX+56;
  s+=`<rect x="${rx}" y="26" width="60" height="18" rx="2" fill="${GC}"/>`;s+=`<rect x="${rx}" y="42" width="56" height="10" rx="2" fill="${GD}"/>`;
  s+=`<rect x="${rx+15}" y="50" width="14" height="24" rx="4" fill="${grip?GA:GC}"/>`;s+=`<rect x="${rx+2}" y="16" width="46" height="12" rx="2" fill="${GL}"/>`;
  const hx=rx+60;
  s+=`<rect x="${hx}" y="24" width="${bL}" height="20" rx="3" fill="${GC}"/>`;s+=`<rect x="${hx+6}" y="36" width="${bL-10}" height="10" rx="2" fill="${GD}"/>`;
  s+=`<rect x="${hx}" y="26" width="${bL-4}" height="6" rx="2" fill="${GD}" opacity="0.5"/>`;s+=`<rect x="${hx}" y="34" width="${bL-4}" height="6" rx="2" fill="${GD}" opacity="0.4"/>`;
  if(bar)s+=`<rect x="${hx+bL-8}" y="24" width="10" height="20" rx="2" fill="${GA}" opacity="0.5"/>`;
  if(muz){const mx=hx+bL;if(supp){s+=`<rect x="${mx}" y="25" width="${mL}" height="18" rx="6" fill="${GA}"/>`;}else{s+=`<rect x="${mx}" y="27" width="${mL}" height="14" rx="1" fill="${GA}"/>`;s+=`<rect x="${mx+mL-3}" y="25" width="3" height="18" rx="1" fill="${GL}"/>`;}}
  if(opt){const ox=rx+3;s+=`<rect x="${ox}" y="8" width="28" height="14" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${ox+3}" y="10" width="22" height="8" rx="2" fill="${GD}" opacity="0.6"/>`;s+=`<circle cx="${ox+14}" cy="14" r="3.5" fill="${GA}" opacity="0.4"/>`;s+=`<rect x="${ox+4}" y="20" width="3" height="4" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+21}" y="20" width="3" height="4" rx="1" fill="${GD}"/>`;}
  if(und)s+=`<rect x="${hx+10}" y="44" width="16" height="18" rx="3" fill="${GA}" opacity="0.85"/>`;
  if(las&&!und){s+=`<rect x="${hx+12}" y="41" width="10" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+22}" y1="43" x2="${hx+36}" y2="43" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(mag){s+=`<rect x="${rx}" y="54" width="28" height="14" rx="5" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${rx+4}" y="57" width="20" height="8" rx="3" fill="${GD}" opacity="0.4"/>`;}
  return s;
}
function drawDMR(muz,bar,opt,und,mag,las,grip,stk,noStk,foldStk,fmode,supp,bigOpt,bigMag){
  const bL=bar?96:76,mL=muz?(supp?36:18):0,sX=noStk?100:foldStk?75:55;let s='';
  if(!noStk){s+=`<rect x="${sX}" y="32" width="${foldStk?30:54}" height="12" rx="3" fill="${stk?GA:GC}"/>`;s+=`<rect x="${sX+4}" y="44" width="13" height="${foldStk?18:24}" rx="3" fill="${stk?GA:GD}"/>`;if(!foldStk)s+=`<rect x="${sX+46}" y="44" width="10" height="20" rx="2" fill="${GD}"/>`;}
  const rx=noStk?sX:foldStk?sX+30:sX+54;
  s+=`<rect x="${rx}" y="26" width="66" height="16" rx="2" fill="${GC}"/>`;s+=`<rect x="${rx}" y="40" width="62" height="8" rx="1" fill="${GD}"/>`;
  s+=`<rect x="${rx+16}" y="46" width="14" height="${bigMag?34:26}" rx="4" fill="${grip?GA:GC}"/>`;
  s+=`<path d="M${rx+9},47 Q${rx+5},58 ${rx+16},58 L${rx+18},58" stroke="${GD}" stroke-width="1.5" fill="none"/>`;
  s+=`<rect x="${rx+4}" y="16" width="50" height="12" rx="2" fill="${GL}"/>`;s+=`<rect x="${rx+5}" y="14" width="46" height="4" rx="1" fill="${GD}"/>`;
  if(fmode)s+=`<rect x="${rx+46}" y="34" width="8" height="4" rx="1" fill="${GO}" opacity="0.8"/>`;
  const hx=rx+66;
  s+=`<rect x="${hx}" y="24" width="${bL+8}" height="14" rx="2" fill="${GC}"/>`;s+=`<rect x="${hx}" y="37" width="${bL}" height="6" rx="1" fill="${GD}"/>`;
  if(bar){s+=`<rect x="${hx+bL-4}" y="26" width="18" height="9" rx="1" fill="${GA}" opacity="0.5"/>`;s+=`<rect x="${hx+bL+12}" y="24" width="4" height="13" rx="1" fill="${GL}"/>`;}
  if(muz){const mx=hx+bL+(bar?18:4);if(supp){s+=`<rect x="${mx}" y="22" width="${mL}" height="15" rx="6" fill="${GA}"/>`;for(let i=0;i<5;i++)s+=`<line x1="${mx+5+i*6}" y1="22" x2="${mx+5+i*6}" y2="37" stroke="${GD}" stroke-width="1" opacity="0.4"/>`;}else{s+=`<rect x="${mx}" y="24" width="${mL}" height="11" rx="2" fill="${GA}"/>`;s+=`<rect x="${mx+mL-4}" y="22" width="4" height="15" rx="1" fill="${GL}"/>`;}}
  if(opt){const ox=rx+5,ow=bigOpt?46:28,oh=bigOpt?20:14;s+=`<rect x="${ox}" y="${7-(bigOpt?4:0)}" width="${ow}" height="${oh}" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${ox+4}" y="${9-(bigOpt?4:0)}" width="${ow-8}" height="${oh-6}" rx="2" fill="${GD}" opacity="0.6"/>`;if(bigOpt)s+=`<circle cx="${ox+ow/2}" cy="${9-(bigOpt?4:0)+6}" r="5" fill="${GA}" opacity="0.35"/>`;s+=`<rect x="${ox+4}" y="${7+oh-(bigOpt?4:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;s+=`<rect x="${ox+ow-8}" y="${7+oh-(bigOpt?4:0)}" width="4" height="5" rx="1" fill="${GD}"/>`;}
  if(und){s+=`<rect x="${hx+8}" y="43" width="16" height="20" rx="3" fill="${GA}" opacity="0.85"/>`;s+=`<rect x="${hx+12}" y="47" width="8" height="12" rx="2" fill="${GD}" opacity="0.5"/>`;}
  if(las&&!und){s+=`<rect x="${hx+10}" y="40" width="12" height="5" rx="2" fill="${GV}" opacity="0.9"/>`;s+=`<line x1="${hx+22}" y1="42" x2="${hx+38}" y2="42" stroke="${GV}" stroke-width="1" opacity="0.7" stroke-dasharray="2 2"/>`;}
  if(las&&und)s+=`<rect x="${hx+12}" y="63" width="10" height="4" rx="2" fill="${GV}" opacity="0.9"/>`;
  if(mag){const mgx=rx+20,mgh=bigMag?32:22;s+=`<rect x="${mgx}" y="52" width="14" height="${mgh}" rx="3" fill="${GA}" opacity="0.9"/>`;s+=`<rect x="${mgx+3}" y="56" width="8" height="${mgh-8}" rx="2" fill="${GD}" opacity="0.4"/>`;}
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

// ── WEAPON SELECT with game badges ────────────────────────────────────────────
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
      {['BO7','BO6','Warzone'].map(game=>{
        const group=weapons.filter(w=>w.game===game);
        if(!group.length)return null;
        return(<div key={game}>
          <div style={{padding:'6px 12px',color:GAME_BADGE[game]?.color||'#fff',fontSize:'9px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",background:'#0d1117',borderBottom:'1px solid #21262d'}}>{game.toUpperCase()}</div>
          {group.map(w=><div key={w.name} onClick={()=>{onChange(w.name);setOpen(false);}} style={{padding:'10px 12px',cursor:'pointer',fontSize:'13px',fontFamily:"'Courier New', monospace",color:w.name===value?'#00e5ff':'#c9d1d9',background:w.name===value?'#00e5ff11':'transparent',borderBottom:'1px solid #21262d'}} onMouseEnter={e=>e.currentTarget.style.background='#00e5ff11'} onMouseLeave={e=>e.currentTarget.style.background=w.name===value?'#00e5ff11':'transparent'}>{w.name}</div>)}
        </div>);
      })}
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
      {!loading&&entries.map((entry,i)=>{const tier=getTier(entry.votes);const tierStyle=TIER_COLORS[tier];const parsedAtts=parseAtts(entry.attachments);const gunSVG=drawGunSVG(entry.class,parsedAtts);const medal=i<3?medalColors[i]:null;
        return(<div key={entry.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 16px',borderBottom:'1px solid #21262d',background:i===0?'#ffd70008':i===1?'#ffffff04':i===2?'#cd7f3208':'transparent'}}>
          <div style={{width:'28px',flexShrink:0,textAlign:'center'}}>{medal?<div style={{width:'24px',height:'24px',borderRadius:'50%',background:medal+'22',border:`1px solid ${medal}44`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto'}}><span style={{color:medal,fontSize:'10px',fontWeight:'700',fontFamily:"'Courier New', monospace"}}>{i+1}</span></div>:<span style={{color:'#484f58',fontSize:'11px',fontFamily:"'Courier New', monospace"}}>#{i+1}</span>}</div>
          <div style={{width:'90px',flexShrink:0,opacity:0.7}}><svg width="100%" viewBox="0 0 560 90" style={{display:'block'}}><g dangerouslySetInnerHTML={{__html:gunSVG}}/></svg></div>
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
  return(<div style={{marginBottom:'16px'}}>
    <button onClick={handleOpen} style={{background:'#00e5ff22',border:'1px solid #00e5ff44',borderRadius:'3px',color:'#00e5ff',fontSize:'12px',padding:'12px 20px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'2px',width:'100%'}}>{open?'✕ CANCEL':'+ SUBMIT YOUR LOADOUT'}</button>
    {open&&<div style={{background:'#0d1117',border:'1px solid #30363d',borderRadius:'4px',padding:'16px',marginTop:'8px',display:'grid',gap:'12px'}}>
      {/* Live gun preview */}
      <div style={{background:'#080b10',border:'1px solid #21262d',borderRadius:'4px',padding:'10px 14px'}}>
        <div style={{color:'#00e5ff',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'4px'}}>{weapon?`// ${weapon.toUpperCase()}`:'// SELECT WEAPON TO PREVIEW'}</div>
        <svg width="100%" viewBox="0 0 560 90" style={{display:'block'}}>{weapon?<g dangerouslySetInnerHTML={{__html:drawGunSVG(activeTab,atts)}}/>:<text x="280" y="50" textAnchor="middle" fill="#484f58" fontSize="11" fontFamily="Courier New" letterSpacing="2">// BUILD YOUR LOADOUT BELOW</text>}</svg>
        <div style={{color:activeAttCount===9?'#00e5ff':activeAttCount>=5?'#ff8c00':'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",textAlign:'right'}}>{activeAttCount} / 9 ATTACHMENTS</div>
      </div>
      {/* Weapon with game badges */}
      <div>
        <div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// WEAPON</div>
        <WeaponDropdown weapons={weaponsList} value={weapon} onChange={setWeapon}/>
      </div>
      {/* Core */}
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// CORE ATTACHMENTS</div><div style={{display:'grid',gap:'6px'}}>{Object.entries(currentSlots).filter(([slot])=>SLOT_GROUPS.core.includes(slot)).map(([slot,opts])=><Dropdown key={slot} label={slot.toUpperCase()} placeholder={`Select ${slot}...`} options={opts} value={atts[slot]||'None'} onChange={val=>setAtts(p=>({...p,[slot]:val}))}/>)}</div></div>
      {/* Handle */}
      <div><div style={{color:'#484f58',fontSize:'10px',letterSpacing:'2px',fontFamily:"'Courier New', monospace",marginBottom:'6px'}}>// HANDLING & CONTROL</div><div style={{display:'grid',gap:'6px'}}>{Object.entries(currentSlots).filter(([slot])=>SLOT_GROUPS.handle.includes(slot)).map(([slot,opts])=><Dropdown key={slot} label={slot.toUpperCase()} placeholder={`Select ${slot}...`} options={opts} value={atts[slot]||'None'} onChange={val=>setAtts(p=>({...p,[slot]:val}))}/>)}</div></div>
      {/* Mods */}
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
  const isOwner=user&&user.id===loadout.user_id;const ytId=getYouTubeId(loadout.video_url);const tier=getTier(votes);const tierStyle=TIER_COLORS[tier];const parsedAtts=parseAtts(loadout.attachments);const gunSVG=drawGunSVG(activeTab,parsedAtts);
  const gameBadge=GAME_BADGE[weaponGame]||GAME_BADGE['Warzone'];
  async function handleVote(dir){if(userVote===dir)return;const fp=getFingerprint();const delta=dir==='up'?1:-1;const undo=userVote!==null?(userVote==='up'?-1:1):0;const newVotes=votes+delta+undo;setVotes(newVotes);setUserVote(dir);if(userVote!==null)await sbFetch(`votes?loadout_id=eq.${loadout.id}&fingerprint=eq.${fp}`,{method:'DELETE'});await sbFetch('votes',{method:'POST',body:JSON.stringify({loadout_id:loadout.id,fingerprint:fp,direction:dir})});await sbFetch(`loadouts?id=eq.${loadout.id}`,{method:'PATCH',body:JSON.stringify({votes:newVotes})});}
  async function handleDelete(){if(!confirm('Delete this loadout?'))return;setDeleting(true);await sbFetch(`loadouts?id=eq.${loadout.id}`,{method:'DELETE'});onDeleted(loadout.id);}
  return(<div style={{background:'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',border:'1px solid #30363d',borderRadius:'4px',overflow:'hidden',animation:'fadeSlideIn 0.4s ease both',animationDelay:`${index*0.08}s`}}>
    <div style={{background:'linear-gradient(90deg, #1a1f2e 0%, #0d1117 100%)',borderBottom:'2px solid #00e5ff22',padding:'12px 14px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
          <div style={{width:'4px',height:'32px',background:'linear-gradient(180deg, #00e5ff, #0077ff)',borderRadius:'2px',flexShrink:0}}/>
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
      <div style={{marginTop:'10px',opacity:0.85}}><svg width="100%" viewBox="0 0 560 90" style={{display:'block'}}><g dangerouslySetInnerHTML={{__html:gunSVG}}/></svg></div>
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

  // Load weapons from Supabase on mount — auto-updates whenever you add to the DB
  useEffect(()=>{
    async function fetchWeapons(){
      setWeaponsLoading(true);
      const data=await sbFetch('weapons?order=game.asc,name.asc');
      setAllWeapons(data||[]);
      setWeaponsLoading(false);
    }
    fetchWeapons();
  },[]);

  const weaponsList=allWeapons.filter(w=>w.class===active);

  async function fetchLoadouts(){setLoading(true);const data=await sbFetch(`loadouts?class=eq.${active}&mode=eq.${mode}&order=votes.desc`);setLoadouts(data||[]);setLoading(false);}
  useEffect(()=>{fetchLoadouts();},[active,mode]);
  function handleAuth({user,gamertag}){setUser(user);setGamertag(gamertag);setShowAuth(false);}
  async function handleLogout(){await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});setUser(null);setGamertag('');}

  // Get game for a weapon name (for badge display on card)
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
      <header style={{background:'linear-gradient(180deg, #0d1117 0%, #080b10 100%)',borderBottom:'1px solid #21262d',padding:'0 16px',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:'54px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'3px',height:'26px',background:'linear-gradient(180deg, #00e5ff, #0055ff)'}}/>
            <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'20px',fontWeight:'700',letterSpacing:'3px',color:'#fff'}}>META</span>
            <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'20px',fontWeight:'700',letterSpacing:'3px',color:'#00e5ff'}}>DOOTY</span>
            <div style={{background:'#00e5ff22',border:'1px solid #00e5ff44',color:'#00e5ff',fontSize:'8px',letterSpacing:'2px',padding:'2px 6px',fontFamily:"'Courier New', monospace"}}>MVP</div>
          </div>
          {user?(<div style={{display:'flex',alignItems:'center',gap:'10px'}}><span style={{color:'#00e5ff',fontFamily:"'Courier New', monospace",fontSize:'12px',letterSpacing:'1px'}}>{gamertag}</span><button onClick={handleLogout} style={{background:'none',border:'1px solid #30363d',borderRadius:'3px',color:'#484f58',fontSize:'11px',padding:'6px 10px',cursor:'pointer',fontFamily:"'Courier New', monospace"}}>LOGOUT</button></div>):(<button onClick={()=>setShowAuth(true)} style={{background:'#00e5ff22',border:'1px solid #00e5ff44',borderRadius:'3px',color:'#00e5ff',fontSize:'11px',padding:'8px 14px',cursor:'pointer',fontFamily:"'Courier New', monospace",letterSpacing:'1px'}}>LOGIN / SIGN UP</button>)}
        </div>
      </header>

      {/* Mode toggle */}
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'12px 16px 0'}}>
        <div style={{display:'flex',background:'#0d1117',border:'1px solid #21262d',borderRadius:'4px',padding:'4px',gap:'4px'}}>
          {MODES.map(m=><button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:'10px',borderRadius:'3px',cursor:'pointer',fontFamily:'Rajdhani, sans-serif',fontSize:'13px',fontWeight:'700',letterSpacing:'2px',background:mode===m?(m==='Warzone'?'#00e5ff22':'#ff8c0022'):'transparent',border:mode===m?`1px solid ${m==='Warzone'?'#00e5ff44':'#ff8c0044'}`:'1px solid transparent',color:mode===m?(m==='Warzone'?'#00e5ff':'#ff8c00'):'#484f58',transition:'all 0.15s'}}>{m==='Warzone'?'🟦 WARZONE':'🟧 MULTIPLAYER'}</button>)}
        </div>
      </div>

      {/* Weapon class tabs — no BO7 tab, weapons live in their class */}
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
    </div>
  </>);
}
 
 
