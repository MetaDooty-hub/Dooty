import { useState } from 'react';
import seedData from '../data/seedData.json';

const TABS = ['AR', 'SMG', 'LMG', 'Sniper', 'Shotgun', 'DMR', 'Other', 'BO7'];
const TIER_COLORS = {
  S: { bg: '#ff4444', text: '#fff', label: 'S TIER' },
  A: { bg: '#ff8c00', text: '#fff', label: 'A TIER' },
  B: { bg: '#ffd700', text: '#000', label: 'B TIER' },
  C: { bg: '#555', text: '#fff', label: 'C TIER' },
};
function getTier(votes) {
  if (votes >= 20) return 'S';
  if (votes >= 10) return 'A';
  if (votes >= 0) return 'B';
  return 'C';
}
const WEAPON_SVGS = {
  AR: `<svg viewBox="0 0 300 60" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="200" y="22" width="85" height="5" rx="1"/><rect x="268" y="17" width="4" height="10" rx="1"/><rect x="155" y="20" width="50" height="12" rx="2"/><rect x="90" y="18" width="70" height="14" rx="2"/><rect x="90" y="30" width="60" height="10" rx="2"/><rect x="110" y="40" width="14" height="28" rx="3"/><rect x="88" y="38" width="12" height="24" rx="3"/><rect x="30" y="22" width="62" height="12" rx="2"/><rect x="20" y="20" width="20" height="16" rx="3"/><rect x="95" y="14" width="55" height="5" rx="1"/><rect x="282" y="20" width="12" height="9" rx="1"/></g></svg>`,
  SMG: `<svg viewBox="0 0 260 60" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="175" y="23" width="60" height="5" rx="1"/><rect x="232" y="21" width="10" height="9" rx="1"/><rect x="140" y="21" width="38" height="12" rx="2"/><rect x="95" y="19" width="52" height="14" rx="2"/><rect x="95" y="31" width="48" height="10" rx="2"/><rect x="112" y="40" width="12" height="32" rx="4"/><rect x="93" y="38" width="11" height="22" rx="3"/><rect x="30" y="22" width="66" height="10" rx="2"/><rect x="20" y="20" width="22" height="14" rx="3"/></g></svg>`,
  LMG: `<svg viewBox="0 0 310 65" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="185" y="20" width="100" height="6" rx="1"/><rect x="282" y="18" width="14" height="10" rx="1"/><rect x="148" y="18" width="42" height="14" rx="2"/><rect x="95" y="16" width="60" height="16" rx="2"/><rect x="100" y="12" width="50" height="6" rx="1"/><rect x="95" y="30" width="55" height="10" rx="2"/><rect x="108" y="39" width="28" height="22" rx="3"/><rect x="93" y="38" width="12" height="26" rx="3"/><rect x="28" y="20" width="68" height="14" rx="3"/><rect x="18" y="18" width="22" height="18" rx="3"/></g></svg>`,
  Sniper: `<svg viewBox="0 0 320 65" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="185" y="23" width="115" height="5" rx="1"/><rect x="296" y="20" width="14" height="11" rx="1"/><rect x="18" y="25" width="75" height="14" rx="3"/><rect x="10" y="24" width="25" height="16" rx="3"/><rect x="92" y="20" width="65" height="15" rx="2"/><rect x="100" y="10" width="55" height="12" rx="4"/><rect x="110" y="13" width="38" height="6" rx="1"/><rect x="91" y="33" width="12" height="22" rx="3"/><rect x="140" y="28" width="50" height="10" rx="2"/><circle cx="147" cy="15" r="4" fill="#8b949e"/></g></svg>`,
  Shotgun: `<svg viewBox="0 0 290 65" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="175" y="21" width="100" height="8" rx="2"/><rect x="272" y="18" width="10" height="14" rx="2"/><rect x="148" y="24" width="32" height="14" rx="2"/><rect x="92" y="18" width="62" height="18" rx="3"/><rect x="148" y="34" width="80" height="5" rx="2"/><rect x="22" y="21" width="72" height="14" rx="3"/><rect x="12" y="19" width="26" height="18" rx="3"/><rect x="91" y="34" width="13" height="26" rx="3"/></g></svg>`,
  DMR: `<svg viewBox="0 0 300 62" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="185" y="22" width="95" height="5" rx="1"/><rect x="277" y="19" width="12" height="11" rx="1"/><rect x="148" y="20" width="42" height="12" rx="2"/><rect x="92" y="18" width="62" height="14" rx="2"/><rect x="100" y="11" width="48" height="10" rx="3"/><rect x="92" y="30" width="58" height="10" rx="2"/><rect x="108" y="39" width="13" height="26" rx="3"/><rect x="90" y="38" width="12" height="22" rx="3"/><rect x="28" y="21" width="65" height="12" rx="2"/><rect x="18" y="20" width="22" height="14" rx="3"/></g></svg>`,
  Other: `<svg viewBox="0 0 130 80" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="20" y="8" width="75" height="14" rx="2"/><rect x="88" y="10" width="10" height="10" rx="1"/><rect x="20" y="20" width="52" height="10" rx="2"/><rect x="20" y="28" width="28" height="38" rx="4"/><rect x="22" y="64" width="24" height="5" rx="2"/></g></svg>`,
  BO7: `<svg viewBox="0 0 310 62" width="100%" xmlns="http://www.w3.org/2000/svg"><g fill="#8b949e"><rect x="210" y="20" width="90" height="6" rx="1"/><rect x="297" y="16" width="14" height="14" rx="2"/><rect x="165" y="18" width="50" height="14" rx="1"/><rect x="100" y="16" width="70" height="16" rx="1"/><rect x="105" y="12" width="60" height="5" rx="1"/><rect x="100" y="30" width="68" height="10" rx="1"/><rect x="115" y="38" width="16" height="30" rx="2"/><rect x="98" y="38" width="13" height="24" rx="2"/><rect x="30" y="20" width="72" height="12" rx="1"/><rect x="18" y="18" width="24" height="16" rx="2"/></g></svg>`,
};

function WeaponCard({ item, index, activeTab }) {
  const [votes, setVotes] = useState(item.loadouts.map(() => 0));
  const [userVotes, setUserVotes] = useState(item.loadouts.map(() => null));
  function handleVote(j, dir) {
    if (userVotes[j] === dir) return;
    const delta = dir === 'up' ? 1 : -1;
    const undo = userVotes[j] !== null ? (userVotes[j] === 'up' ? -1 : 1) : 0;
    setVotes(v => v.map((val, i) => i === j ? val + delta + undo : val));
    setUserVotes(u => u.map((val, i) => i === j ? dir : val));
  }
  return (
    <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', border: '1px solid #30363d', borderRadius: '4px', overflow: 'hidden', animation: 'fadeSlideIn 0.4s ease both', animationDelay: `${index * 0.08}s` }}>
      <div style={{ background: 'linear-gradient(90deg, #1a1f2e 0%, #0d1117 100%)', borderBottom: '2px solid #00e5ff22', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '36px', background: 'linear-gradient(180deg, #00e5ff, #0077ff)', borderRadius: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', color: '#00e5ff', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Courier New', monospace", marginBottom: '2px' }}>META LOADOUT</div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#e6f0ff', letterSpacing: '1px', fontFamily: "'Courier New', monospace" }}>{item.meta.split(' - ')[1] || item.meta}</div>
          </div>
        </div>
        <div style={{ opacity: 0.6, flexShrink: 0, width: '150px' }} dangerouslySetInnerHTML={{ __html: WEAPON_SVGS[activeTab] || WEAPON_SVGS['Other'] }} />
      </div>
      <div style={{ padding: '12px 18px 18px' }}>
        {item.loadouts.map((loadout, j) => {
          const tier = getTier(votes[j]);
          const tierStyle = TIER_COLORS[tier];
          return (
            <div key={loadout.weaponName} style={{ background: '#0a0e14', border: '1px solid #21262d', borderRadius: '3px', padding: '14px', marginTop: j > 0 ? '10px' : '0', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: tierStyle.bg, color: tierStyle.text, fontSize: '10px', fontWeight: '900', letterSpacing: '2px', padding: '3px 10px', fontFamily: "'Courier New', monospace" }}>{tierStyle.label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '8px', fontFamily: "'Courier New', monospace" }}>{loadout.weaponName}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                    {loadout.attachments.map(att => (<span key={att} style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e', fontSize: '10px', padding: '2px 8px', borderRadius: '2px', fontFamily: "'Courier New', monospace" }}>{att}</span>))}
                  </div>
                  {loadout.note && <div style={{ fontSize: '11px', color: '#484f58', fontStyle: 'italic' }}>// {loadout.note}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <button onClick={() => handleVote(j, 'up')} style={{ width: '32px', height: '32px', background: userVotes[j] === 'up' ? '#00e5ff22' : '#161b22', border: userVotes[j] === 'up' ? '1px solid #00e5ff' : '1px solid #30363d', borderRadius: '3px', color: userVotes[j] === 'up' ? '#00e5ff' : '#8b949e', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▲</button>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: votes[j] >= 20 ? '#ff4444' : votes[j] >= 10 ? '#ff8c00' : '#e6f0ff', fontFamily: "'Courier New', monospace", minWidth: '24px', textAlign: 'center' }}>{votes[j]}</div>
                  <button onClick={() => handleVote(j, 'down')} style={{ width: '32px', height: '32px', background: userVotes[j] === 'down' ? '#ff444422' : '#161b22', border: userVotes[j] === 'down' ? '1px solid #ff4444' : '1px solid #30363d', borderRadius: '3px', color: userVotes[j] === 'down' ? '#ff4444' : '#8b949e', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▼</button>
                </div>
              </div>
            </div>
          );
        })}
        {item.loadouts.length === 0 && <div style={{ color: '#484f58', fontSize: '12px', fontFamily: "'Courier New', monospace", padding: '10px 0' }}>// NO LOADOUTS SUBMITTED YET</div>}
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState('AR');
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080b10; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { filter: brightness(1.3); }
      `}</style>
      <div style={{ background: '#080b10', minHeight: '100vh', color: '#e6f0ff' }}>
        <header style={{ background: 'linear-gradient(180deg, #0d1117 0%, #080b10 100%)', borderBottom: '1px solid #21262d', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(180deg, #00e5ff, #0055ff)' }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '22px', fontWeight: '700', letterSpacing: '3px', color: '#fff', textTransform: 'uppercase' }}>META</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '22px', fontWeight: '700', letterSpacing: '3px', color: '#00e5ff', textTransform: 'uppercase' }}>DOOTY</span>
              <div style={{ background: '#00e5ff22', border: '1px solid #00e5ff44', color: '#00e5ff', fontSize: '9px', letterSpacing: '2px', padding: '2px 8px', fontFamily: "'Courier New', monospace" }}>MVP</div>
            </div>
            <div style={{ fontSize: '10px', color: '#484f58', letterSpacing: '2px', fontFamily: "'Courier New', monospace" }}>COMMUNITY LOADOUTS</div>
          </div>
        </header>
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#484f58', fontFamily: "'Courier New', monospace", letterSpacing: '1px' }}>TIER KEY:</span>
            {Object.entries(TIER_COLORS).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '20px', background: val.bg, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', color: val.text, fontFamily: "'Courier New', monospace" }}>{key}</div>
                <span style={{ fontSize: '10px', color: '#484f58', fontFamily: "'Courier New', monospace" }}>{key === 'S' ? '20+ votes' : key === 'A' ? '10+ votes' : key === 'B' ? '0+ votes' : 'negative'}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #21262d' }}>
            {TABS.map(tab => (<button key={tab} onClick={() => setActive(tab)} style={{ padding: '10px 18px', background: 'transparent', color: active === tab ? '#00e5ff' : '#8b949e', border: 'none', borderBottom: active === tab ? '2px solid #00e5ff' : '2px solid transparent', cursor: 'pointer', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.15s', marginBottom: '-1px' }}>{tab}</button>))}
          </div>
          <div style={{ display: 'grid', gap: '14px' }}>
            {seedData[active] && seedData[active].length > 0
              ? seedData[active].map((item, i) => <WeaponCard key={item.meta} item={item} index={i} activeTab={active} />)
              : <div style={{ textAlign: 'center', padding: '60px 20px', color: '#484f58', fontFamily: "'Courier New', monospace", fontSize: '13px', letterSpacing: '2px', border: '1px dashed #21262d', borderRadius: '4px' }}>// NO META LOADOUTS FOR THIS CLASS YET</div>}
          </div>
        </main>
      </div>
    </>
  );
}
