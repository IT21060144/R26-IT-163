export default function Landing({ go, code }) {
  return (
    <div className="page-shell">
      <div className="hero-card">
        <div className="hero-card__inner">
          <h1 className="landing-title-hand" style={{ color:'var(--text)', fontSize:'clamp(2.1rem,5vw,3rem)', fontWeight:700, lineHeight:1.15, marginBottom:10 }}>
            StudyTrack
          </h1>
          <p style={{ color:'var(--text2)', maxWidth:520, margin:'0 auto 8px', fontSize:15, lineHeight:1.65, fontWeight:500 }}>
            I built this to track how my study week is going — questionnaire scores + a habit grid on the dashboard.
          </p>
          <p style={{ color:'var(--text3)', maxWidth:520, margin:'0 auto 24px', fontSize:13, lineHeight:1.6 }}>
            No account, just a code so your stuff stays on this browser.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {code ? <>
              <button type="button" className="hero-btn-primary" onClick={() => go('questionnaire')}>Do the questionnaire</button>
              <button type="button" className="hero-btn-ghost" onClick={() => go('dashboard')}>Open my board</button>
            </> : <>
              <button type="button" className="hero-btn-primary" onClick={() => go('code')}>Get a code</button>
              <button type="button" className="hero-btn-ghost" onClick={() => go('code')}>Already have one</button>
            </>}
          </div>
          {code && <div style={{ marginTop:18, display:'inline-block', background:'rgba(180,83,9,0.08)', border:'1px solid rgba(180,83,9,0.25)', borderRadius:10, padding:'8px 18px', color:'#92400e', fontFamily:'ui-monospace, monospace', fontSize:14 }}>using code: {code}</div>}
        </div>
      </div>

      <div className="card landing-mock-preview" style={{ marginTop:14, padding:'clamp(12px,2vw,20px)' }}>
        <div style={{ fontSize:18, fontFamily:'var(--font-hand), cursive', color:'#57534e', marginBottom:8 }}>sketch I drew before coding the layout</div>
        <img
          src="/dashboard-mockup.png"
          alt="Hand-drawn style mockup of the study dashboard"
          width={1200}
          loading="lazy"
          decoding="async"
          className="landing-mock-preview__img"
        />
      </div>

      <div className="card card--lift" style={{ marginTop:14, display:'flex', justifyContent:'center', flexWrap:'wrap', borderBottom:'1px solid var(--border)' }}>
        {[['14','questions'],['4','scores mashed together'],['no login','just a code'],['streak','if you keep logging']].map(([n,l],i,arr) => (
          <div key={l} style={{ padding:'16px 32px', textAlign:'center', borderRight:i<arr.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ fontSize:18, fontWeight:700, color:'var(--text)' }}>{n}</div>
            <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'20px 4px 4px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
        {[
          {title:'Code instead of login',  desc:'Meant for a class / personal use, not a full auth system.', color:'rgba(251,191,36,0.25)', border:'#ca8a04'},
          {title:'Short form', desc:'Takes a few minutes when you want to update how studying went.', color:'rgba(52,211,153,0.2)', border:'#059669'},
          {title:'Board + charts',  desc:'Dashboard is where the numbers and my weekly habits live.', color:'rgba(167,139,250,0.2)', border:'#7c3aed'},
          {title:'Streak counter',  desc:'Tries to nudge you to log again the next day.', color:'rgba(14,165,233,0.15)', border:'var(--accent)'},
        ].map(f => (
          <div key={f.title} className="card card--lift" style={{ padding:'18px', borderTop:`3px solid ${f.border}` }}>
            <div style={{ width:36, height:36, background:f.color, borderRadius:8, marginBottom:10 }} />
            <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:5 }}>{f.title}</h3>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.55 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
