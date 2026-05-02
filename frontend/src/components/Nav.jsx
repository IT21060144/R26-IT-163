export default function Nav({ go, code, clearCode }) {
  return (
    <nav className="top-nav">
      <div onClick={() => go('landing')} className="top-nav-brand-wrap">
        <div className="top-nav-brand-dot" />
        <div className="top-nav-brand-text">
          <div className="top-nav-brand">
            Study<span style={{ color:'var(--accent)' }}>Track</span>
          </div>
          <div className="top-nav-subtitle">little study log I made</div>
        </div>
      </div>
      <div className="top-nav-actions">
        {code ? <>
          <button onClick={() => go('streak')} className="nav-mini-btn">Streak</button>
          <button onClick={() => go('dashboard')} className="nav-mini-btn">Dashboard</button>
          <button onClick={() => go('questionnaire')} className="nav-cta">+ log a day</button>
          <div className="nav-chip">
            <span className="nav-chip-label">Code:</span>
            <span className="nav-chip-code">{code}</span>
            <button onClick={clearCode} className="nav-chip-close">x</button>
          </div>
        </> : null}
      </div>
    </nav>
  )
}
