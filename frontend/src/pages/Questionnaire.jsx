import { useState } from 'react'
import { QUESTIONS, SECTIONS, SEC_COLOR, SEC_ACCENT, computeScores } from '../data/questions.js'
import { api } from '../data/api.js'

export default function Questionnaire({ go, code, setLastResult }) {
  const [cur,    setCur]    = useState(0)
  const [ans,    setAns]    = useState(new Array(QUESTIONS.length).fill(null))
  const [err,    setErr]    = useState(false)
  const [saving, setSaving] = useState(false)

  const q   = QUESTIONS[cur]
  const pct = Math.round(((cur+1)/QUESTIONS.length)*100)
  const acc = SEC_ACCENT[q.sec]
  const col = SEC_COLOR[q.sec]

  const secStatus = sec => {
    const idxs = QUESTIONS.map((q,i)=>q.sec===sec?i:-1).filter(i=>i>=0)
    if (idxs.every(i=>i<cur&&ans[i]!=null)) return 'done'
    if (idxs.includes(cur)) return 'active'
    return 'idle'
  }

  function pick(i) { const a=[...ans]; a[cur]=i; setAns(a); setErr(false) }

  async function next() {
    if (ans[cur]==null) { setErr(true); return }
    if (cur < QUESTIONS.length-1) { setCur(cur+1); return }
    setSaving(true)
    const scores = computeScores(ans)
    try { await api('/api/results',{ method:'POST', body: JSON.stringify({scores,answers:ans,studentCode:code}) }) } catch {}
    setLastResult({scores,answers:ans})
    go('results')
    setSaving(false)
  }

  function back() { if (cur>0) { setCur(cur-1); setErr(false) } }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'calc(100vh - 64px)', gap:16, padding:'16px' }}>
      <div className="card" style={{ padding:'20px 16px', position:'sticky', top:80, height:'calc(100vh - 96px)', overflowY:'auto' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:4 }}>Sections</div>
        <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'monospace', marginBottom:14 }}>{code}</div>
        {SECTIONS.map(sec => {
          const s = secStatus(sec)
          return (
            <div key={sec} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'1px solid var(--border-soft)', fontSize:12, color:s==='done'?'var(--green)':s==='active'?SEC_ACCENT[sec]:'var(--text3)', fontWeight:s==='active'?600:400 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background:s==='done'?'var(--green)':s==='active'?SEC_ACCENT[sec]:'var(--border)' }} />
              {sec}
              {s==='done' && <span style={{ marginLeft:'auto', fontSize:10 }}>Done</span>}
            </div>
          )
        })}
        <div style={{ marginTop:14, background:'var(--bg-mid)', border:'1px solid var(--border)', borderRadius:6, padding:'10px', fontSize:10, color:'var(--text2)', fontFamily:'monospace', lineHeight:1.9 }}>
          PS = 0.3(HTS)<br/>+ 0.2(SIS)<br/>+ 0.2(GCS)<br/>+ 0.3(QPS)
        </div>
      </div>

      <div style={{ padding:'14px 14px 18px', maxWidth:700 }}>
        <div className="card" style={{ marginBottom:14, background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)', color:'var(--text)', border:'1px solid #bae6fd', padding:'16px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontSize:18, fontWeight:700 }}>Questionnaire</div>
              <div style={{ fontSize:12, opacity:.9 }}>Code: <span style={{ fontFamily:'monospace', fontWeight:700 }}>{code}</span></div>
            </div>
            <div style={{ background:'rgba(14,165,233,0.12)', border:'1px solid rgba(14,165,233,0.28)', borderRadius:999, padding:'4px 12px', fontSize:12, fontWeight:700, color:'var(--accent-d)' }}>
              {pct}% complete
            </div>
          </div>
        </div>
        <div style={{ height:4, background:'var(--border)', borderRadius:99, marginBottom:6, overflow:'hidden' }}>
          <div style={{ height:'100%', background:acc, width:`${pct}%`, borderRadius:99, transition:'width 0.3s' }} />
        </div>
        <div style={{ fontSize:12, color:'var(--text3)', marginBottom:22 }}>Question {cur+1} of {QUESTIONS.length}</div>

        <div className="card" style={{ padding:'24px', marginBottom:18, border:`2px solid ${err?'rgba(224,133,133,0.55)':col}` }}>
          <div style={{ display:'inline-block', background:col, color:acc, fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:99, marginBottom:10 }}>{q.sec}</div>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--text)', marginBottom:16, lineHeight:1.4 }}>{cur+1}. {q.q}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {q.opts.map((opt,i)=>(
              <div key={i} onClick={()=>pick(i)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', border:`1.5px solid ${ans[cur]===i?acc:'var(--border)'}`, background:ans[cur]===i?col:'var(--bg-mid)', borderRadius:8, cursor:'pointer', transition:'all 0.1s' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${ans[cur]===i?acc:'var(--text3)'}`, background:ans[cur]===i?acc:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {ans[cur]===i && <div style={{ width:6, height:6, background:'#fff', borderRadius:'50%' }} />}
                </div>
                <span style={{ fontSize:13, color:'var(--text)', fontWeight:ans[cur]===i?500:400 }}>{opt}</span>
              </div>
            ))}
          </div>
          {err && <div style={{ fontSize:12, color:'var(--red)', marginTop:10 }}>Please select an answer to continue.</div>}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <button onClick={back} disabled={cur===0} className="btn btn-secondary" style={{ opacity:cur===0?0.4:1 }}>Back</button>
          <button onClick={next} disabled={saving}  className="btn btn-primary"   style={{ background:acc, borderColor:acc }}>
            {saving?'Saving...':cur===QUESTIONS.length-1?'Submit':'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
