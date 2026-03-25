$content = @'
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

function WeaponCard({ item, index }) {
  const [votes, setVotes] = useState(item.loadouts.map(() => Math.floor(Math.random() * 25)));
  const [userVotes, setUserVotes] = useState(item.loadouts.map(() => null));

  function handleVote(j, dir) {
    if (userVotes[j] === dir) return;
    const delta = dir === 'up' ? 1 : -1;
    const undo = userVotes[j] !== null ? (userVotes[j] === 'up' ? -1 : 1) : 0;
    setVotes(v => v.map((val, i) => i === j ? val + delta + undo : val));
    setUserVotes(u => u.map((val, i) => i === j ? dir : val));
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
      border: '1px solid #30363d',
      borderRadius: '4px',
      overflow: 'hidden',
      animation: 'fadeSlideIn 0.4s ease both',
      animationDelay: `${index * 0.08}s`,
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #1a1f2e 0%, #0d1117 100%)',
        borderBottom: '2px solid #00e5ff22',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{ width: '4px', height: '36px', background: 'linear-gradient(180deg, #00e5ff, #0077ff)', borderRadius: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '11px', color: '#00e5ff', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Courier New', monospace", marginBottom: '2px' }}>
            META LOADOUT
          </div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#e6f0ff', letterSpacing: '1px', fontFamily: "'Courier New', monospace" }}>
            {item.meta.split(' - ')[1] || item.meta}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 18px 18px' }}>
        {item.loadouts.map((loadout, j) => {
          const tier = getTier(votes[j]);
          const tierStyle = TIER_COLORS[tier];
          return (
            <div key={loadout.weaponName} style={{
              background: '#0a0e14',
              border: '1px solid #21262d',
              borderRadius: '3px',
              padding: '14px',
              marginTop: j > 0 ? '10px' : '0',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: tierStyle.bg, color: tierStyle.text,
                fontSize: '10px', fontWeight: '900', letterSpacing: '2px',
                padding: '3px 10px', fontFamily: "'Courier New', monospace",
              }}>
                {tierStyle.label}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '8px', fontFamily: "'Courier New', monospace" }}>
                    {loadout.weaponName}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                    {loadout.attachments.map(att => (
                      <span key={att} style={{
                        background: '#161b22', border: '1px solid #30363d',
                        color: '#8b949e', fontSize: '10px', padding: '2px 8px',
                        borderRadius: '2px', letterSpacing: '0.5px', fontFamily: "'Courier New', monospace",
                      }}>
                        {att}
                      </span>
                    ))}
                  </div>
                  {loadout.note && (
                    <div style={{ fontSize: '11px', color: '#484f58', fontStyle: 'italic' }}>
                      // {loadout.note}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <button onClick={() => handleVote(j, 'up')} style={{
                    width: '32px', height: '32px',
                    background: userVotes[j] === 'up' ? '#00e5ff22' : '#161b22',
                    border: userVotes[j] === 'up' ? '1px solid #00e5ff' : '1px solid #30363d',
                    borderRadius: '3px', color: userVotes[j] === 'up' ? '#00e5ff' : '#8b949e',
                    cursor: 'pointer', fontSize: '14px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                  }}>▲</button>
                  <div style={{
                    fontSize: '13px', fontWeight: '700',
                    color: votes[j] >= 20 ? '#ff4444' : votes[j] >= 10 ? '#ff8c00' : '#e6f0ff',
                    fontFamily: "'Courier New', monospace", minWidth: '24px', textAlign: 'center',
                  }}>
                    {votes[j]}
                  </div>
                  <button onClick={() => handleVote(j, 'down')} style={{
                    width: '32px', height: '32px',
                    background: userVotes[j] === 'down' ? '#ff444422' : '#161b22',
                    border: userVotes[j] === 'down' ? '1px solid #ff4444' : '1px solid #30363d',
                    borderRadius: '3px', color: userVotes[j] === 'down' ? '#ff4444' : '#8b949e',
                    cursor: 'pointer', fontSize: '14px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                  }}>▼</button>
                </div>
              </div>
            </div>
          );
        })}

        {item.loadouts.length === 0 && (
          <div style={{ color: '#484f58', fontSize: '12px', fontFamily: "'Courier New', monospace", padding: '10px 0', letterSpacing: '1px' }}>
            // NO LOADOUTS SUBMITTED YET
          </div>
        )}
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
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover { filter: brightness(1.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
      `}</style>

      <div style={{ background: '#080b10', minHeight: '100vh', color: '#e6f0ff' }}>
        <header style={{
          background: 'linear-gradient(180deg, #0d1117 0%, #080b10 100%)',
          borderBottom: '1px solid #21262d',
          padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '3px', height: '28px', background: 'linear-gradient(180deg, #00e5ff, #0055ff)' }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '22px', fontWeight: '700', letterSpacing: '3px', color: '#fff', textTransform: 'uppercase' }}>META</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '22px', fontWeight: '700', letterSpacing: '3px', color: '#00e5ff', textTransform: 'uppercase' }}>DOOTY</span>
              <div style={{ background: '#00e5ff22', border: '1px solid #00e5ff44', color: '#00e5ff', fontSize: '9px', letterSpacing: '2px', padding: '2px 8px', fontFamily: "'Courier New', monospace" }}>
                MVP
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#484f58', letterSpacing: '2px', fontFamily: "'Courier New', monospace" }}>
              COMMUNITY LOADOUTS
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#484f58', fontFamily: "'Courier New', monospace", letterSpacing: '1px' }}>TIER KEY:</span>
            {Object.entries(TIER_COLORS).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '20px', background: val.bg, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', color: val.text, fontFamily: "'Courier New', monospace" }}>{key}</div>
                <span style={{ fontSize: '10px', color: '#484f58', fontFamily: "'Courier New', monospace" }}>
                  {key === 'S' ? '20+ votes' : key === 'A' ? '10+ votes' : key === 'B' ? '0+ votes' : 'negative'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #21262d' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActive(tab)} style={{
                padding: '10px 18px',
                background: 'transparent',
                color: active === tab ? '#00e5ff' : '#8b949e',
                border: 'none',
                borderBottom: active === tab ? '2px solid #00e5ff' : '2px solid transparent',
                cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                letterSpacing: '2px', textTransform: 'uppercase',
                fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.15s',
                marginBottom: '-1px',
              }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {seedData[active] && seedData[active].length > 0
              ? seedData[active].map((item, i) => <WeaponCard key={item.meta} item={item} index={i} />)
              : (
                <div style={{
                  textAlign: 'center', padding: '60px 20px', color: '#484f58',
                  fontFamily: "'Courier New', monospace", fontSize: '13px', letterSpacing: '2px',
                  border: '1px dashed #21262d', borderRadius: '4px',
                }}>
                  // NO META LOADOUTS FOR THIS CLASS YET
                </div>
              )
            }
          </div>
        </main>
      </div>
    </>
  );
}
'@

Set-Content -Path "pages\index.js" -Value $content -Encoding UTF8
Write-Host "Done! File replaced successfully."
