/**
 * This talks to the backend (or Pi directly) via VITE_LIGHTING_API_URL in .env
 * If that var is not set it falls back to http://localhost:3001
 */

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Config ────────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_LIGHTING_API_URL || 'http://localhost:3001'
const RATE_LIMIT_MS = 3500

const PRESETS = [
  { id: 'warm',   label: 'Warm',    desc: 'Amber glow',      r: 255, g: 120, b: 20,  hex: '#ff7814' },
  { id: 'chill',  label: 'Chill',   desc: 'Ocean blue',      r: 0,   g: 140, b: 255, hex: '#008cff' },
  { id: 'focus',  label: 'Focus',   desc: 'Crisp white',     r: 255, g: 255, b: 220, hex: '#ffffdc' },
  { id: 'vibe',   label: 'Vibe',    desc: 'Deep violet',     r: 160, g: 0,   b: 255, hex: '#a000ff' },
  { id: 'nature', label: 'Nature',  desc: 'Forest green',    r: 10,  g: 200, b: 80,  hex: '#0ac850' },
  { id: 'party',  label: '🎉 Party', desc: 'Colour cycling', r: 255, g: 0,   b: 120, hex: 'party'   },
]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Mulish:wght@300;400;600&display=swap');

  .lc-section {
    background: #0d0d10;
    border-radius: 20px;
    padding: 32px 28px 28px;
    font-family: 'Mulish', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* animated background grain */
  .lc-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.6;
  }

  .lc-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .lc-heading {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #fff;
    letter-spacing: -0.02em;
    margin: 0 0 2px;
  }

  .lc-subheading {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
  }

  .lc-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 99px;
    padding: 5px 12px;
  }

  .lc-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #444;
    transition: background 0.4s, box-shadow 0.4s;
  }
  .lc-dot.online  { background: #2ecc71; box-shadow: 0 0 7px #2ecc71aa; }
  .lc-dot.offline { background: #e74c3c; box-shadow: 0 0 7px #e74c3caa; }
  .lc-dot.loading { background: #f1c40f; animation: lc-pulse 1s infinite; }

  @keyframes lc-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── live colour bar ── */
  .lc-bar {
    height: 4px;
    border-radius: 4px;
    background: rgba(255,255,255,0.08);
    margin-bottom: 24px;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }
  .lc-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: background 0.6s ease, width 0.4s ease;
    width: 100%;
  }

  /* ── preset grid ── */
  .lc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 480px) {
    .lc-grid { grid-template-columns: repeat(2, 1fr); }
    .lc-party { grid-column: 1 / -1; }
  }

  .lc-preset {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 16px 14px;
    cursor: pointer;
    transition: transform 0.15s, border-color 0.25s, box-shadow 0.25s, background 0.25s;
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .lc-preset:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.07);
  }

  .lc-preset:active { transform: scale(0.96); }

  .lc-preset.active {
    border-color: var(--pc);
    box-shadow: 0 0 24px var(--pg), inset 0 0 16px rgba(255,255,255,0.02);
  }

  /* shimmer sweep on active presets */
  .lc-preset.active::after {
    content: '';
    position: absolute;
    top: 0; left: -80%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    animation: lc-sweep 2.5s linear infinite;
  }
  @keyframes lc-sweep { to { left: 120%; } }

  .lc-swatch {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-bottom: 10px;
    position: relative;
  }
  .lc-swatch::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: inherit;
    opacity: 0.3;
    filter: blur(5px);
  }

  .lc-preset-label {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    display: block;
    line-height: 1;
  }
  .lc-preset-desc {
    font-size: 10px;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-top: 3px;
  }

  /* party button full-width */
  .lc-party { grid-column: 1 / -1; }
  .lc-party .lc-preset-label {
    background: linear-gradient(90deg,#ff0078,#ff7814,#a000ff,#008cff,#0ac850);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% auto;
    animation: lc-flow 3s linear infinite;
  }
  @keyframes lc-flow { to { background-position: 200% center; } }

  /* ── cooldown bar ── */
  .lc-cooldown {
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    margin-top: 16px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .lc-cooldown.visible { opacity: 1; }
  .lc-cooldown-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.6));
    transition: width 0.06s linear;
  }

  /* ── toast ── */
  .lc-toast {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    padding: 8px 20px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    white-space: nowrap;
    pointer-events: none;
    animation: lc-rise 0.25s ease forwards;
    z-index: 10;
  }
  .lc-toast.ok    { background:#0f2a14; border:1px solid #2ecc71; color:#2ecc71; }
  .lc-toast.wait  { background:#2a220a; border:1px solid #f1c40f; color:#f1c40f; }
  .lc-toast.error { background:#2a0f0f; border:1px solid #e74c3c; color:#e74c3c; }
  @keyframes lc-rise {
    from { opacity:0; transform:translateX(-50%) translateY(10px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0);    }
  }
`

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LightingControl() {
  const [conn, setConn]         = useState('loading')   // 'loading' | 'online' | 'offline'
  const [active, setActive]     = useState(null)
  const [toast, setToast]       = useState(null)        // { msg, type }
  const [cooldown, setCooldown] = useState(0)
  const [partyHue, setPartyHue] = useState(0)
  const lastSentRef             = useRef(0)
  const toastTimer              = useRef(null)

  // ── status check on mount ──
  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then(r => r.ok ? setConn('online') : setConn('offline'))
      .catch(() => setConn('offline'))
  }, [])

  // ── party hue cycling ──
  useEffect(() => {
    if (active?.id !== 'party') return
    const id = setInterval(() => setPartyHue(h => (h + 2) % 360), 40)
    return () => clearInterval(id)
  }, [active])

  // ── cooldown ticker ──
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown(c => Math.max(0, c - 60)), 60)
    return () => clearInterval(id)
  }, [cooldown])

  const showToast = useCallback((msg, type = 'ok') => {
    clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const handlePreset = useCallback(async (preset) => {
    const now = Date.now()
    const elapsed = now - lastSentRef.current

    if (elapsed < RATE_LIMIT_MS) {
      const wait = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000)
      showToast(`Wait ${wait}s before changing again`, 'wait')
      return
    }

    lastSentRef.current = now
    setActive(preset)
    setCooldown(RATE_LIMIT_MS)

    try {
      const res = await fetch(`${API_URL}/set-colour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ r: preset.r, g: preset.g, b: preset.b, preset: preset.id }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      showToast(`${preset.label} applied ✓`, 'ok')
    } catch (err) {
      showToast('Could not reach lighting server', 'error')
      console.error('[LightingControl]', err)
    }
  }, [showToast])

  // ── live bar colour ──
  const barBg = active
    ? active.id === 'party'
      ? `hsl(${partyHue}, 100%, 55%)`
      : active.hex
    : 'rgba(255,255,255,0.12)'

  const cooldownPct = Math.round((cooldown / RATE_LIMIT_MS) * 100)

  return (
    <>
      <style>{CSS}</style>

      <section className="lc-section" aria-label="Lighting control">

        <div className="lc-header">
          <div>
            <h2 className="lc-heading">Lighting</h2>
            <p className="lc-subheading">Venue atmosphere</p>
          </div>
          <div className="lc-status">
            <span className={`lc-dot ${conn}`} />
            {conn === 'online' ? 'Live' : conn === 'offline' ? 'Offline' : '…'}
          </div>
        </div>

        {/* live colour bar */}
        <div className="lc-bar">
          <div className="lc-bar-fill" style={{ background: barBg }} />
        </div>

        {/* preset buttons */}
        <div className="lc-grid">
          {PRESETS.map(p => {
            const isActive = active?.id === p.id
            const swatchBg = p.id === 'party'
              ? `hsl(${partyHue}, 100%, 55%)`
              : p.hex
            const glowColor = p.id === 'party'
              ? `hsla(${partyHue},100%,55%,0.45)`
              : `${p.hex}77`

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Set lighting to ${p.label}`}
                className={`lc-preset${p.id === 'party' ? ' lc-party' : ''}${isActive ? ' active' : ''}`}
                style={{ '--pc': p.id === 'party' ? `hsl(${partyHue},100%,55%)` : p.hex, '--pg': glowColor }}
                onClick={() => handlePreset(p)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handlePreset(p)}
              >
                <div className="lc-swatch" style={{ background: swatchBg }} />
                <span className="lc-preset-label">{p.label}</span>
                <span className="lc-preset-desc">{p.desc}</span>
              </div>
            )
          })}
        </div>

        {/* cooldown strip */}
        <div className={`lc-cooldown${cooldown > 0 ? ' visible' : ''}`}>
          <div className="lc-cooldown-fill" style={{ width: `${cooldownPct}%` }} />
        </div>

        {/* toast */}
        {toast && (
          <div className={`lc-toast ${toast.type}`} role="status">
            {toast.msg}
          </div>
        )}

      </section>
    </>
  )
}
