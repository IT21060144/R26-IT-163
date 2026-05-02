import { useState } from 'react'
import { api } from '../data/api.js'

export default function CodeEntry({ go, activateCode }) {
  const [tab,    setTab]    = useState('new')
  const [load,   setLoad]   = useState(false)
  const [err,    setErr]    = useState('')
  const [code,   setCode]   = useState('')
  const [input,  setInput]  = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoad(true); setErr('')
    try {
      const res  = await api('/api/student/new', { method:'POST', body:'{}' })
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || 'Could not create a code. Is the database connected?')
        setLoad(false)
        return
      }
      setCode(data.code)
    } catch {
      setErr('Cannot reach the API on port 5002. If the dev terminal shows a MongoDB error, the backend exited — fix Atlas IP whitelist and MONGO_URI, then restart npm run dev.')
    }
    setLoad(false)
  }

  async function verify() {
    const c = input.trim().toUpperCase()
    if (!c) { setErr('Please enter your code.'); return }
    setLoad(true); setErr('')
    try {
      const res  = await api('/api/student/verify', { method:'POST', body: JSON.stringify({ code:c }) })
      const data = await res.json()
      if (!res.ok) { setErr(data.error || 'Invalid code.'); setLoad(false); return }
      activateCode(data.code)
    } catch {
      setErr('Cannot reach the API on port 5002. If the dev terminal shows a MongoDB error, the backend exited — fix Atlas IP whitelist and MONGO_URI, then restart npm run dev.')
    }
    setLoad(false)
  }

  const switchTab = t => { setTab(t); setErr(''); setCode('') }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div className="study-panel-top">
          <h1 style={{ color:'var(--text)', fontSize:20, fontWeight:700, marginBottom:6 }}>Anonymous Access</h1>
          <p style={{ color:'var(--text2)', fontSize:13 }}>Start in seconds with your student code.</p>
        </div>
        <div className="card" style={{ borderRadius:'0 0 20px 20px', padding:'26px 28px', borderTop:'none' }}>
          <div style={{ display:'flex', background:'var(--bg-mid)', borderRadius:8, padding:3, marginBottom:20, gap:3, border:'1px solid var(--border)' }}>
            {[['new','New Code'],['return','I have a code']].map(([t,l]) => (
              <button key={t} onClick={() => switchTab(t)} style={{ flex:1, padding:'8px', border:'none', borderRadius:6, fontSize:13, fontWeight:500, cursor:'pointer', background:tab===t?'var(--surface-2)':'transparent', color:tab===t?'var(--text)':'var(--text2)', boxShadow:tab===t?'0 1px 6px rgba(2,132,199,0.12)':'none', transition:'all 0.15s' }}>{l}</button>
            ))}
          </div>

          {err && <div className="alert alert-error">{err}</div>}

          {tab === 'new' && (
            !code ? (
              <div>
                <p style={{ fontSize:13, color:'var(--text2)', marginBottom:18, lineHeight:1.6 }}>Generate your code and continue.</p>
                <button onClick={generate} disabled={load} className="btn btn-primary" style={{ width:'100%', padding:'11px' }}>
                  {load ? 'Generating...' : 'Generate My Code'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ background:'var(--bg-mid)', borderRadius:10, padding:'22px', textAlign:'center', marginBottom:14, border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:11, color:'var(--text3)', marginBottom:8, letterSpacing:'0.08em', textTransform:'uppercase' }}>Your Code</div>
                  <div style={{ fontSize:40, fontWeight:700, color:'var(--accent)', fontFamily:'monospace', letterSpacing:4 }}>{code}</div>
                  <div style={{ fontSize:12, color:'var(--text2)', marginTop:8 }}>Write this down or take a screenshot</div>
                </div>
                <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                  <button onClick={() => { navigator.clipboard.writeText(code).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000) }} className="btn btn-secondary" style={{ flex:1 }}>
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button onClick={() => activateCode(code)} className="btn btn-primary" style={{ flex:1 }}>Use This Code</button>
                </div>
                <div className="alert alert-success">Code generated. Save it before continuing.</div>
              </div>
            )
          )}

          {tab === 'return' && (
            <div>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:18, lineHeight:1.6 }}>Enter your code to continue.</p>
              <label className="label">Student Code</label>
              <input className="input" type="text" placeholder="e.g. ST-A7829" value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key==='Enter' && verify()}
                style={{ fontFamily:'monospace', fontSize:20, fontWeight:600, textAlign:'center', letterSpacing:3, marginBottom:14 }}
              />
              <button onClick={verify} disabled={load} className="btn btn-primary" style={{ width:'100%', padding:'11px' }}>
                {load ? 'Verifying...' : 'Access My Data'}
              </button>
            </div>
          )}

          <div style={{ marginTop:18, padding:'10px 12px', background:'rgba(138,180,248,0.08)', border:'1px solid rgba(138,180,248,0.22)', borderRadius:8, fontSize:12, color:'var(--blue-metric)', lineHeight:1.6 }}>
            Tip: Save your code before moving ahead.
          </div>
        </div>
      </div>
    </div>
  )
}
