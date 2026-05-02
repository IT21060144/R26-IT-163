import { useState, useEffect, useCallback } from 'react'
import { api } from '../data/api.js'

export default function Streak({ go, code }) {
  const [data,     setData]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [msg,      setMsg]      = useState('')
  const [checking, setChecking] = useState(false)
  const [error,    setError]    = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await api(`/api/streak/${code}`)
      const d   = await res.json()
      setData(d)
    } catch { setError('Could not load streak. Backend may be down (often MongoDB / Atlas) — check the dev terminal.') }
    setLoading(false)
  }, [code])

  useEffect(() => { load() }, [load])

  async function checkIn() {
    setChecking(true); setMsg(''); setError('')
    try {
      const res  = await api('/api/streak/checkin',{ method:'POST', body: JSON.stringify({code}) })
      const json = await res.json()
      if (!res.ok) { setError(json.error||'Check-in failed.'); setChecking(false); return }
      setData(json.streak)
      setMsg(json.message)
      setTimeout(()=>setMsg(''),3000)
    } catch { setError('Check-in failed. Backend may be down — check the dev terminal (MongoDB / port 5002).') }
    setChecking(false)
  }

  async function reset() {
    if (!confirm('Reset your streak?')) return
    try { await api(`/api/streak/${code}`,{method:'DELETE'}); load() } catch {}
  }

  const today        = new Date().toISOString().split('T')[0]
  const checkedToday = data?.lastStudyDate===today
  const cur          = data?.currentStreak||0

  function getLast7() {
    return Array.from({length:7},(_,i)=>{
      const d=new Date(); d.setDate(d.getDate()-(6-i))
      const s=d.toISOString().split('T')[0]
      return {s, label:d.toLocaleDateString('en',{weekday:'short'}), done:data?.studyDates?.includes(s)||false, isToday:s===today}
    })
  }

  const motivation =
    cur===0 ? 'Start your streak today. Check in after studying.' :
    cur===1 ? 'Good start. Come back tomorrow to keep it going.' :
    cur<5   ? `${cur} days in a row. You are building a strong habit.` :
    cur<10  ? `${cur} days straight. Impressive consistency.` :
              `${cur} day streak. Outstanding dedication.`

  return (
    <div className="page-shell" style={{ maxWidth:620 }}>
      <div className="card" style={{ marginBottom:16, background:'linear-gradient(135deg,#f0f9ff,#bae6fd)', color:'var(--text)', border:'1px solid #bae6fd', padding:'16px 20px' }}>
        <div style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.06em', opacity:0.9 }}>Consistency mode</div>
        <div style={{ fontSize:22, fontWeight:800, lineHeight:1.2 }}>Keep Your Study Streak Alive</div>
      </div>
      <div style={{ marginBottom:20 }}>
        <h2 className="section-title">Study Streak Tracker</h2>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <p style={{ fontSize:13, color:'var(--text2)' }}>Check in every day after studying.</p>
          <span style={{ fontSize:11, color:'var(--violet)', background:'rgba(168,148,232,0.14)', padding:'2px 10px', borderRadius:99, fontFamily:'monospace', fontWeight:600 }}>{code}</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error} <button onClick={load} style={{ marginLeft:8, textDecoration:'underline', background:'none', border:'none', color:'inherit', cursor:'pointer', fontSize:13 }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign:'center', padding:'3rem', color:'var(--text3)' }}>Loading streak data...</div>
      ) : (
        <>
          <div className="card" style={{ padding:'30px', textAlign:'center', marginBottom:14, background:checkedToday?'#f0f9ff':'var(--surface)', border:checkedToday?'1px solid rgba(14,165,233,0.4)':'1px solid var(--border)', borderRadius:20 }}>
            <div style={{ fontSize:52, fontWeight:700, marginBottom:6, color:checkedToday?'var(--accent)':'var(--text3)' }}>
              {cur>=10?'★★★':cur>=5?'★★':cur>=1?'★':'○'}
            </div>
            <div style={{ fontSize:64, fontWeight:700, color:checkedToday?'var(--accent)':'#8ab4f8', lineHeight:1, marginBottom:4 }}>{cur}</div>
            <div style={{ fontSize:14, color:'var(--text2)', marginBottom:6 }}>day{cur!==1?'s':''} streak</div>
            {data?.longestStreak>0 && (
              <div style={{ display:'inline-block', fontSize:12, background:checkedToday?'rgba(14,165,233,0.1)':'rgba(212,165,116,0.14)', color:checkedToday?'var(--text2)':'var(--amber)', padding:'3px 12px', borderRadius:99, marginBottom:18, fontWeight:500 }}>
                Personal best: {data.longestStreak} days
              </div>
            )}
            <br/>
            {!checkedToday ? (
              <button onClick={checkIn} disabled={checking} className="btn btn-primary" style={{ width:'100%', padding:'12px', fontSize:14, marginTop:8 }}>
                {checking?'Checking in...':'I studied today — Check In'}
              </button>
            ) : (
              <div style={{ background:'var(--bg-mid)', border:'1px solid var(--border)', borderRadius:8, padding:'12px', color:'var(--accent)', fontSize:13, marginTop:8 }}>
                Checked in today. Come back tomorrow to continue your streak.
              </div>
            )}
            {msg && <div style={{ marginTop:10, fontSize:13, color:checkedToday?'var(--accent)':'var(--green)', fontWeight:500 }}>{msg}</div>}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
            {[{l:'Current',v:`${cur} days`,c:'#8ab4f8'},{l:'Longest',v:`${data?.longestStreak||0} days`,c:'var(--amber)'},{l:'Total',v:`${data?.totalDays||0} days`,c:'var(--green)'}].map(x=>(
              <div key={x.l} className="card" style={{ padding:'12px', textAlign:'center', borderTop:`2px solid ${x.c}` }}>
                <div style={{ fontSize:11, color:'var(--text2)', marginBottom:4 }}>{x.l}</div>
                <div style={{ fontSize:16, fontWeight:700, color:x.c }}>{x.v}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:'16px', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:12 }}>Last 7 Days</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
              {getLast7().map(day=>(
                <div key={day.s} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'var(--text3)', marginBottom:6 }}>{day.label}</div>
                  <div style={{ width:34, height:34, borderRadius:'50%', margin:'0 auto', background:day.done?'linear-gradient(135deg, var(--accent-d), var(--accent))':'#e2e8f0', border:`2px solid ${day.isToday?'var(--accent)':'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:day.done?'#fff':day.isToday?'var(--accent-d)':'var(--text3)', fontWeight:600 }}>
                    {day.done?'✓':day.isToday?'·':''}
                  </div>
                  {day.isToday&&<div style={{ fontSize:9, color:'var(--accent)', marginTop:3, fontWeight:600 }}>Today</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:'12px 14px', marginBottom:14, borderLeft:'3px solid var(--accent)', background:'var(--bg-mid)' }}>
            <p style={{ fontSize:13, color:'var(--text2)' }}>{motivation}</p>
          </div>

          <div className="card" style={{ padding:'12px 14px', marginBottom:14, fontSize:12, color:'var(--text2)', lineHeight:1.8 }}>
            <div style={{ fontWeight:600, color:'var(--text)', fontSize:13, marginBottom:4 }}>How it works</div>
            Study today → Click Check In → Streak count increases<br/>
            Miss a day → Streak resets to 0<br/>
            Goal: Build the longest streak you can
          </div>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={()=>go('questionnaire')} className="btn btn-primary">Take Questionnaire</button>
            <button onClick={()=>go('dashboard')}     className="btn btn-secondary">View Dashboard</button>
            <button onClick={reset}                   className="btn btn-danger" style={{ marginLeft:'auto' }}>Reset Streak</button>
          </div>
        </>
      )}
    </div>
  )
}
