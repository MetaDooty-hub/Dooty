import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://fllbxwcmpifwtptkzjva.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGJ4d2NtcGlmd3RwdGt6anZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjgzNjQsImV4cCI6MjA5MDA0NDM2NH0.hLUFdtpoBXz7quAUs12WtcisbUk7Eu079sKfIcPj3bQ';

const TABS = ['AR', 'SMG', 'LMG', 'Sniper', 'Shotgun', 'DMR', 'Other', 'BO7'];
const TIER_COLORS = {
  S: { bg: '#ff4444', text: '#fff', label: 'S TIER' },
  A: { bg: '#ff8c00', text: '#fff', label: 'A TIER' },
  B: { bg: '#ffd700', text: '#000', label: 'B TIER' },
  C: { bg: '#555', text: '#fff', label: 'C TIER' },
};
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

function getTier(votes) {
  if (votes >= 20) return 'S';
  if (votes >= 10) return 'A';
  if (votes >= 0) return 'B';
  return 'C';
}

function getFingerprint() {
  let fp = localStorage.getItem('md_fp');
  if (!fp) { fp = Math.random().toString(36).slice(2); localStorage.setItem('md_fp', fp); }
  return fp;
}

async function sbFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...opts.headers },
    ...opts,
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

function SubmitLoadout({ activeTab, onSubmitted }) {
  const [open, setOpen] = useState(false);
  const [weapon, setWeapon] = useState('');
  const [attachments, setAttachments] = useState('');
  const [note, setNote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit() {
    if (!weapon.trim() || !attachments.trim()) return;
    setLoading(true);
    const atts = attachments.split(',').map(a => a.trim()).filter(Boolean);
    await sbFetch('loadouts', {
      method: 'POST',
      body: JSON.stringify({ weapon_name: weapon.trim(), class: activeTab, attachments: atts, note: note.trim(), submitted_by: author.trim() || 'Anonymous', votes: 0 }),
    });
    setLoading(false);
    setSuccess(true);
    setWeapon(''); setAttachments(''); setNote(''); setAuthor('');
    setTimeout(() => { setSuccess(false); setOpen(false); onSubmitted(); }, 1500);
  }

  const inp = { background: '#0d1117', border: '1px solid #30363d', borderRadius: '3px', color: '#e6f0ff', fontSize: '16px', padding: '12px', fontFamily: "'Courier New', monospace", width: '100%' };

  return (
    <div style={{ marginBottom: '16px' }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: '#00e5ff22', border: '1px solid #00e5ff44', borderRadius: '3px', color: '#00e5ff', fontSize: '12px', padding: '12px 20px', cursor: 'pointer', fontFamily: "'Courier New', monospace", letterSpacing: '2px', width: '100%' }}>
        {open ? '✕ CANCEL' : '+ SUBMIT YOUR LOADOUT'}
      </button>
      {open && (
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '4px', padding: '16px', marginTop: '8px', display: 'grid', gap: '10px' }}>
          <input style={inp} placeholder="Weapon name (e.g. Kilo 141)" value={weapon} onChange={e => setWeapon(e.target.value)} />
          <input style={inp} placeholder="Attachments (comma separated)" value={attachments} onChange={e => setAttachments(e.target.value)} />
          <input style={inp} placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
          <input style={inp} placeholder="Your name (optional)" value={author} onChange={e => setAuthor(e.target.value)} />
          <button onClick={submit} disabled={loading || success} style={{ background: success ? '#00e5ff44' : '#00e5ff22', border: '1px solid #00e5ff', borderRadius: '3px', color: '#00e5ff', fontSize: '14px', padding: '14px', cursor: 'pointer', fontFamily: "'Courier New', monospace", letterSpacing: '2px', width: '100%' }}>
            {success ? '✓ SUBMITTED!' : loading ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </div>
      )}
    </div>
  );
}

function CommentSection({ loadoutId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadComments() {
    const data = await sbFetch(`comments?loadout_id=eq.${loadoutId}&order=created_at.asc`);
    if (data) setComments(data);
    setLoaded(true);
  }

  function toggle() {
    if (!open && !loaded) loadComments();
    setOpen(o => !o);
  }

  async function submit() {
    if (!input.trim()) return;
    const data = await sbFetch('comments', {
      method: 'POST',
      body: JSON.stringify({ loadout_id: loadoutId, author: name.trim() || 'Anonymous', body: input.trim() }),
    });
    if (data) setComments(c => [...c, ...(Array.isArray(data) ? data : [data])]);
    setInput('');
  }

  return (
    <div style={{ marginTop: '12px', borderTop: '1px solid #21262d', paddingTop: '10px' }}>
      <button onClick={toggle} style={{ background: 'none', border: 'none', color: '#484f58', fontSize: '12px', cursor: 'pointer', fontFamily: "'Courier New', monospace", letterSpacing: '1px', padding: '4px 0', minHeight: '44px' }}>
        {open ? '// HIDE COMMENTS' : `// COMMENTS (${comments.length})`}
      </button>
      {open && (
        <div style={{ marginTop: '10px' }}>
          {comments.length === 0 && <div style={{ color: '#484f58', fontSize: '12px', fontFamily: "'Courier New', monospace", marginBottom: '8px' }}>// no comments yet — be first</div>}
          {comments.map((c) => (
            <div key={c.id} style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: '3px', padding: '10px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#00e5ff', fontSize: '11px', fontFamily: "'Courier New', monospace" }}>{c.author}</span>
                <span style={{ color: '#484f58', fontSize: '11px', fontFamily: "'Courier New', monospace" }}>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ color: '#c9d1d9', fontSize: '13px', lineHeight: '1.4' }}>{c.body}</div>
            </div>
          ))}
          <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="your name (optional)" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '3px', color: '#e6f0ff', fontSize: '16px', padding: '10px', fontFamily: "'Courier New', monospace', width: '100%'" }} />
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="drop your thoughts..." style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '3px', color: '#e6f0ff', fontSize: '16px', padding: '10px', fontFamily: "'Courier New', monospace", width: '100%' }} />
            <button onClick={submit} style={{ background: '#00e5ff22', border: '1px solid #00e5ff44', borderRadius: '3px', color: '#00e5ff', fontSize: '13px', padding: '12px', cursor: 'pointer', fontFamily: "'Courier New', monospace", width: '100%' }}>POST COMMENT</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadoutCard({ loadout, index, activeTab }) {
  const [votes, setVotes] = useState(loadout.votes || 0);
  const [userVote, setUserVote] = useState(null);

  async function handleVote(dir) {
    if (userVote === dir) return;
    const fp = getFingerprint();
    const delta = dir === 'up' ? 1 : -1;
    const undo = userVote !== null ? (userVote === 'up' ? -1 : 1) : 0;
    const newVotes = votes + delta + undo;
    setVotes(newVotes);
    setUserVote(dir);
    if (userVote !== null) {
      await sbFetch(`votes?loadout_id=eq.${loadout.id}&fingerprint=eq.${fp}`, { method: 'DELETE' });
    }
    await sbFetch('votes', { method: 'POST', body: JSON.stringify({ loadout_id: loadout.id, fingerprint: fp, direction: dir }) });
    await sbFetch(`loadouts?id=eq.${loadout.id}`, { method: 'PATCH', body: JSON.stringify({ votes: newVotes }) });
  }

  const tier = getTier(votes);
  const tierStyle = TIER_COLORS[tier];

  return (
    <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', border: '1px solid #30363d', borderRadius: '4px', overflow: 'hidden', animation: 'fadeSlideIn 0.4s ease both', animationDelay: `${index * 0.08}s` }}>
      <div style={{ background: 'linear-gradient(90deg, #1a1f2e 0%, #0d1117 100%)', borderBottom: '2px solid #00e5ff22', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{ width: '4px', height: '32px', background: 'linear-gradient(180deg, #00e5ff, #0077ff)', borderRadius: '2px', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#00e5ff', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Courier New', monospace", marginBottom: '2px' }}>{loadout.submitted_by || 'Anonymous'}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#e6f0ff', fontFamily: "'Courier New', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loadout.weapon_name}</div>
            </div>
          </div>
          <div style={{ opacity: 0.5, flexShrink: 0, width: '100px', display: 'none' }} className="desktop-only" dangerouslySetInnerHTML={{ __html: WEAPON_SVGS[activeTab] || WEAPON_SVGS['Other'] }} />
        </div>
        <div style={{ marginTop: '8px', opacity: 0.5 }} dangerouslySetInnerHTML={{ __html: WEAPON_SVGS[activeTab] || WEAPON_SVGS['Other'] }} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ background: '#0a0e14', border: '1px solid #21262d', borderRadius: '3px', padding: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: tierStyle.bg, color: tierStyle.text, fontSize: '9px', fontWeight: '900', letterSpacing: '2px', padding: '3px 8px', fontFamily: "'Courier New', monospace" }}>{tierStyle.label}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px', paddingTop: '4px' }}>
                {loadout.attachments.map(att => (<span key={att} style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e', fontSize: '10px', padding: '3px 8px', borderRadius: '2px', fontFamily: "'Courier New', monospace" }}>{att}</span>))}
              </div>
              {loadout.note && <div style={{ fontSize: '11px', color: '#484f58', fontStyle: 'italic', marginBottom: '4px' }}>// {loadout.note}</div>}
              <CommentSection loadoutId={loadout.id} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button onClick={() => handleVote('up')} style={{ width: '44px', height: '44px', background: userVote === 'up' ? '#00e5ff22' : '#161b22', border: userVote === 'up' ? '1px solid #00e5ff' : '1px solid #30363d', borderRadius: '3px', color: userVote === 'up' ? '#00e5ff' : '#8b949e', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▲</button>
              <div style={{ fontSize: '14px', fontWeight: '700', color: votes >= 20 ? '#ff4444' : votes >= 10 ? '#ff8c00' : '#e6f0ff', fontFamily: "'Courier New', monospace", minWidth: '28px', textAlign: 'center' }}>{votes}</div>
              <button onClick={() => handleVote('down')} style={{ width: '44px', height: '44px', background: userVote === 'down' ? '#ff444422' : '#161b22', border: userVote === 'down' ? '1px solid #ff4444' : '1px solid #30363d', borderRadius: '3px', color: userVote === 'down' ? '#ff4444' : '#8b949e', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▼</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState('AR');
  const [loadouts, setLoadouts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLoadouts() {
    setLoading(true);
    const data = await sbFetch(`loadouts?class=eq.${active}&order=votes.desc`);
    setLoadouts(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchLoadouts(); }, [active]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080b10; }
        html { -webkit-text-size-adjust: 100%; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { filter: brightness(1.3); }
        input, button { -webkit-appearance: none; }
        input:focus { outline: 1px solid #00e5ff44; }
        .tab-scroll { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; border-bottom: 1px solid #21262d; }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-btn { flex-shrink: 0; padding: 12px 16px; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-family: Rajdhani, sans-serif; transition: all 0.15s; margin-bottom: -1px; white-space: nowrap; }
        .tab-btn.active { color: #00e5ff; border-bottom-color: #00e5ff; }
        .tab-btn:not(.active) { color: #8b949e; }
      `}</style>
      <div style={{ background: '#080b10', minHeight: '100vh', color: '#e6f0ff' }}>
        <header style={{ background: 'linear-gradient(180deg, #0d1117 0%, #080b10 100%)', borderBottom: '1px solid #21262d', padding: '0 16px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '3px', height: '26px', background: 'linear-gradient(180deg, #00e5ff, #0055ff)' }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '20px', fontWeight: '700', letterSpacing: '3px', color: '#fff', textTransform: 'uppercase' }}>META</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '20px', fontWeight: '700', letterSpacing: '3px', color: '#00e5ff', textTransform: 'uppercase' }}>DOOTY</span>
              <div style={{ background: '#00e5ff22', border: '1px solid #00e5ff44', color: '#00e5ff', fontSize: '8px', letterSpacing: '2px', padding: '2px 6px', fontFamily: "'Courier New', monospace" }}>MVP</div>
            </div>
          </div>
        </header>

        <div className="tab-scroll" style={{ padding: '0 16px', maxWidth: '900px', margin: '0 auto' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActive(tab)} className={`tab-btn${active === tab ? ' active' : ''}`}>{tab}</button>
          ))}
        </div>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
          <SubmitLoadout activeTab={active} onSubmitted={fetchLoadouts} />
          <div style={{ display: 'grid', gap: '12px' }}>
            {loading && <div style={{ color: '#484f58', fontFamily: "'Courier New', monospace", fontSize: '12px', letterSpacing: '2px', padding: '40px', textAlign: 'center' }}>// LOADING LOADOUTS...</div>}
            {!loading && loadouts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#484f58', fontFamily: "'Courier New', monospace", fontSize: '13px', letterSpacing: '2px', border: '1px dashed #21262d', borderRadius: '4px' }}>
                // NO LOADOUTS YET — BE THE FIRST TO SUBMIT
              </div>
            )}
            {!loading && loadouts.map((l, i) => <LoadoutCard key={l.id} loadout={l} index={i} activeTab={active} />)}
          </div>
        </main>
      </div>
    </>
  );
}
