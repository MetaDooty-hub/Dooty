import React, { useState } from ''react'';
import seedData from ''../data/seedData.json'';

export default function Home() {
  const [active, setActive] = useState(''AR'');
  const tabs = [''AR'', ''SMG'', ''LMG'', ''Sniper'', ''Shotgun'', ''DMR'', ''Other'', ''BO7''];
  
  return (
    <div style={{ background: ''#0a0f14'', color: ''#e6f0ff'', minHeight: ''100vh'', fontFamily: ''sans-serif'', padding: ''20px'' }}>
      <header style={{ borderBottom: ''1px solid #333'', paddingBottom: ''20px'', marginBottom: ''20px'' }}>
        <h1 style={{ margin: 0 }}>Meta <span style={{ color: ''#00e5ff'' }}>Dooty</span> MVP</h1>
      </header>
      
      <div style={{ display: ''flex'', gap: ''10px'', marginBottom: ''20px'', flexWrap: ''wrap'' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActive(tab)}
            style={{ 
              padding: ''10px 20px'', 
              background: active === tab ? ''#00e5ff'' : ''#1e232a'',
              color: active === tab ? ''#000'' : ''#fff'',
              border: ''none'', borderRadius: ''5px'', cursor: ''pointer''
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: ''grid'', gap: ''15px'' }}>
        {seedData[active] && seedData[active].map((item, i) => (
          <div key={i} style={{ background: ''#171e25'', padding: ''15px'', borderRadius: ''10px'' }}>
            <h3 style={{ marginTop: 0 }}>{item.meta}</h3>
            {item.loadouts.map((loadout, j) => (
              <div key={j} style={{ marginTop: ''10px'', paddingTop: ''10px'', borderTop: ''1px solid #333'' }}>
                <strong>{loadout.weaponName}</strong>: {loadout.attachments.join('', '')}
                <div style={{ fontSize: ''0.9em'', color: ''#aaa'', marginTop: ''5px'' }}>{loadout.note}</div>
              </div>
            ))}
          </div>
        ))}
        {(!seedData[active] || seedData[active].length === 0) && <p>No meta loaded for this class yet.</p>}
      </div>
    </div>
  );
}
