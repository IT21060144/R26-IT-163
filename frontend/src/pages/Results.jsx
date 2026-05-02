import { useEffect, useState } from 'react'
const METRICS = [
  {key:'HTS',label:'Habit Tracking Score', formula:'HTS = (Ds/Dt) x 100',   color:'#8ab4f8'},
  {key:'SIS',label:'Study Intensity Score', formula:'SIS = (Hs/Hmax) x 100', color:'#6bc4b8'},
  {key:'GCS',label:'Goal Completion Score', formula:'GCS = (Gc/Gt) x 100',   color:'#a894e8'},
  {key:'QPS',label:'Quiz Performance Score',formula:'QPS = (Qs/Qt) x 100',   color:'#d4956c'},
]
const sc = s => s>=70?'#7cb88a':s>=45?'#d4a574':'#e08585'
const sl = s => s>=70?'Good':s>=45?'Average':'Needs Work'

export default function Results({ go, result }) {
  const [anim, setAnim] = useState(false)
  useEffect(() => { setTimeout(()=>setAnim(true),100) }, [])
  if (!result) return <div style={{ textAlign:'center', padding:'4rem' }}>No result. <button className="btn btn-primary" onClick={()=>go('questionnaire')} style={{ marginLeft:8 }}>Take Questionnaire</button></div>
  const {scores} = result
  const tagline = scores.PS>=70?'Great consistency. Keep going.':scores.PS>=45?'Good progress. You can improve more.':'Start small and stay consistent.'
  const tips = [
    scores.HTS<60?'Try to study more days per week. Consistency matters more than duration.':'Good study frequency. Keep it consistent.',
    scores.SIS<50?'Increase your daily study hours gradually. Even 30 more minutes helps.':'Good study intensity. Make sure those hours are focused.',
    scores.GCS<60?'Set small clear goals before each session to boost your completion rate.':'You have a solid goal-setting habit. Keep it up.',
    scores.QPS<60?'Review notes more regularly instead of only before exams.':'Good review habits. Try active recall to push even further.',
  ]
  return (
    <div className="page-shell">
      <div style={{ background:'linear-gradient(135deg,#f0f9ff,#bae6fd)', borderRadius:20, padding:'34px', textAlign:'center', marginBottom:18, color:'var(--text)', border:'1px solid #bae6fd', boxShadow:'0 16px 40px rgba(2,132,199,0.1)' }}>
        <div style={{ fontSize:12, opacity:.75, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--accent)' }}>Overall Progress Score</div>
        <div style={{ fontSize:64, fontWeight:700, lineHeight:1, marginBottom:8 }}>{scores.PS}%</div>
        <div style={{ fontSize:11, fontFamily:'monospace', opacity:.6, marginBottom:10 }}>PS = 0.3(HTS) + 0.2(SIS) + 0.2(GCS) + 0.3(QPS)</div>
        <div style={{ fontSize:14, opacity:.85 }}>{tagline}</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:16 }}>
        {METRICS.map(m=>(
          <div key={m.key} className="card" style={{ padding:'16px', borderTop:`3px solid ${m.color}` }}>
            <div style={{ fontSize:11, color:'var(--text2)', marginBottom:2 }}>{m.label}</div>
            <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'monospace', marginBottom:8 }}>{m.formula}</div>
            <div style={{ fontSize:26, fontWeight:700, color:m.color, marginBottom:8 }}>{scores[m.key]}%</div>
            <div style={{ height:5, background:'var(--border)', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', background:m.color, borderRadius:99, width:anim?`${scores[m.key]}%`:'0%', transition:'width 1s ease' }} />
            </div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>{sl(scores[m.key])}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:'16px', marginBottom:16, borderLeft:'4px solid var(--accent)' }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:8 }}>Quick Tip</div>
        <div style={{ fontSize:13, color:'var(--text2)' }}>{tips.find(t => t.toLowerCase().includes('good')) || tips[0]}</div>
      </div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <button onClick={()=>go('dashboard')}     className="btn btn-primary">View Dashboard</button>
        <button onClick={()=>go('streak')}        className="btn btn-secondary">Streak Tracker</button>
        <button onClick={()=>go('questionnaire')} className="btn btn-secondary">Retake</button>
      </div>
    </div>
  )
}
