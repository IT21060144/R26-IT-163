import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '../data/api.js'

const sc = s => (s >= 70 ? '#7cb88a' : s >= 45 ? '#d4a574' : '#e08585')
const badgeBg = s => (s >= 70 ? 'rgba(124,184,138,0.18)' : s >= 45 ? 'rgba(212,165,116,0.18)' : 'rgba(224,133,133,0.16)')
const sl = s => (s >= 70 ? 'Good' : s >= 45 ? 'Average' : 'Needs Work')

function startOfWeekMonday(d) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function fmtKey(d) {
  return d.toISOString().slice(0, 10)
}

const HABITS = [
  { id: 'deep', name: 'Deep Work Session (90m block)', tint: '#3b82f6', block: true, target: 90 },
  { id: 'review', name: 'Review Notes (Spaced Rep.)', tint: '#fb923c' },
  { id: 'pomodoro', name: 'Pomodoro Rounds (25m x 4)', tint: '#22c55e' },
  { id: 'recall', name: 'Active Recall (Flashcards)', tint: '#a855f7' },
  { id: 'assign', name: 'Assignment Progress (Essay)', tint: '#0ea5e9' },
]

function Donut({ pct, size = 120, stroke = 10, color = '#ca8a04', track = '#e7e5e4' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.min(100, Math.max(0, pct)) / 100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
      />
    </svg>
  )
}

function IconDashboard({ active }) {
  return (
    <svg width="20" height="20" fill="none" stroke={active ? '#0284c7' : '#64748b'} strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M4 13h6V4H4v9zm10 7h6V11h-6v9zM4 20h6v-5H4v5zm10-16h6V4h-6v4z" />
    </svg>
  )
}
function IconHabits() {
  return (
    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}
function IconStats() {
  return (
    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function IconGoals() {
  return (
    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.6" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.6" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="1.6" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

export default function Dashboard({ go, code, clearCode }) {
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [error, setError] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)
  const [habitLog, setHabitLog] = useState({})
  const [searchQ, setSearchQ] = useState('')

  const storageKey = `studytrack_habits_${code || ''}`

  const load = useCallback(async () => {
    if (!code) return
    setLoading(true)
    setError('')
    try {
      const [rRes, sRes] = await Promise.all([api(`/api/results/${code}`), api(`/api/streak/${code}`)])
      const results = await rRes.json()
      const streakData = await sRes.json()
      setHistory(Array.isArray(results) ? results : [])
      setStreak(streakData)
    } catch {
      setError('Could not load data. If MongoDB failed in the terminal, the backend exited — fix Atlas IP whitelist, then restart npm run dev.')
    }
    setLoading(false)
  }, [code])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setHabitLog(JSON.parse(raw))
    } catch {
      setHabitLog({})
    }
  }, [storageKey])

  const persistHabits = useCallback(
    next => {
      setHabitLog(next)
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  )

  const weekStart = useMemo(() => addDays(startOfWeekMonday(new Date()), weekOffset * 7), [weekOffset])
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6)
    const opts = { month: 'short', day: 'numeric', year: 'numeric' }
    return `${weekStart.toLocaleDateString('en', opts).replace(/, \d{4}$/, '')} – ${end.toLocaleDateString('en', opts)}`
  }, [weekStart])

  function cellKey(habitId, date) {
    return `${fmtKey(date)}_${habitId}`
  }

  function toggleCell(habit, date) {
    const key = cellKey(habit.id, date)
    const cur = habitLog[key]
    if (habit.block) {
      const steps = [null, 30, 60, 90]
      const idx = steps.indexOf(cur?.minutes ?? null)
      const nextMin = steps[(idx + 1) % steps.length]
      const next = { ...habitLog }
      if (nextMin == null) delete next[key]
      else next[key] = { minutes: nextMin }
      persistHabits(next)
    } else {
      const next = { ...habitLog }
      if (cur?.done) delete next[key]
      else next[key] = { done: true }
      persistHabits(next)
    }
  }

  async function clearAll() {
    if (!confirm("Delete every saved questionnaire run? (can't undo)")) return
    try {
      await api(`/api/results/${code}`, { method: 'DELETE' })
      load()
    } catch {
      /* ignore */
    }
  }

  const latest = history[0]
  const prev = history[1]
  const diff = latest && prev ? latest.scores.PS - prev.scores.PS : null
  const best = history.length ? Math.max(...history.map(h => h.scores.PS)) : null
  const avg = history.length ? Math.round(history.reduce((s, h) => s + h.scores.PS, 0) / history.length) : null
  const avgHTS = history.length ? Math.round(history.reduce((s, h) => s + h.scores.HTS, 0) / history.length) : 0
  const avgSIS = history.length ? Math.round(history.reduce((s, h) => s + h.scores.SIS, 0) / history.length) : 0
  const avgGCS = history.length ? Math.round(history.reduce((s, h) => s + h.scores.GCS, 0) / history.length) : 0
  const avgQPS = history.length ? Math.round(history.reduce((s, h) => s + h.scores.QPS, 0) / history.length) : 0
  const chart = [...history].reverse().slice(-7)

  const dailyGoalPct = latest ? latest.scores.PS : avg || 0
  const streakDays = streak?.currentStreak ?? 0
  const totalHoursDisplay = history.length ? Math.round((history.length * 45) / 60) : 0

  const distribution = latest
    ? [
        { label: 'Habit (HTS)', pct: latest.scores.HTS, color: '#60a5fa' },
        { label: 'Intensity (SIS)', pct: latest.scores.SIS, color: '#34d399' },
        { label: 'Goals (GCS)', pct: latest.scores.GCS, color: '#fb923c' },
        { label: 'Quiz (QPS)', pct: latest.scores.QPS, color: '#38bdf8' },
      ]
    : [
        { label: 'Math', pct: 30, color: '#3b82f6' },
        { label: 'History', pct: 25, color: '#22c55e' },
        { label: 'Lit', pct: 20, color: '#fb923c' },
        { label: 'Sci', pct: 25, color: '#7dd3fc' },
      ]

  const habitBars = chart.length
    ? chart.map(h => h.scores.PS)
    : [40, 55, 48, 72, 65]

  const lineSeries = chart.length
    ? chart.map(h => h.scores.PS)
    : [52, 58, 55, 62, 68, 74, 78]

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const Tab = ({ t, l }) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      style={{
        padding: '8px 14px',
        borderRadius: 8,
        fontSize: 13,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: tab === t ? '#134e4a' : '#d6d3d1',
        background: tab === t ? 'var(--accent-d)' : '#fff',
        color: tab === t ? '#fff' : '#57534e',
        fontWeight: tab === t ? 600 : 500,
        boxShadow: tab === t ? '2px 2px 0 #44403c' : 'none',
      }}
    >
      {l}
    </button>
  )

  const filteredHabits = searchQ.trim()
    ? HABITS.filter(h => h.name.toLowerCase().includes(searchQ.trim().toLowerCase()))
    : HABITS

  return (
    <div className="study-dash">
      <aside className="study-dash__sidebar">
        <button type="button" className="study-dash__logo" onClick={() => go('landing')} aria-label="Home">
          <span className="study-dash__logo-mark" />
        </button>
        <nav className="study-dash__nav">
          <button type="button" className="study-dash__nav-item study-dash__nav-item--active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <IconDashboard active />
            Home board
          </button>
          <button type="button" className="study-dash__nav-item" onClick={() => scrollTo('dash-habits')}>
            <IconHabits />
            Habit grid
          </button>
          <button type="button" className="study-dash__nav-item" onClick={() => scrollTo('study-analytics')}>
            <IconStats />
            Quiz scores
          </button>
          <button type="button" className="study-dash__nav-item" onClick={() => scrollTo('dash-habits')}>
            <IconCalendar />
            This week
          </button>
          <button type="button" className="study-dash__nav-item" onClick={() => go('questionnaire')}>
            <IconGoals />
            New log
          </button>
          <button
            type="button"
            className="study-dash__nav-item"
            onClick={() => {
              if (confirm('Clear your code from this browser and go back to the start page?')) clearCode?.()
            }}
          >
            <IconSettings />
            Reset / leave
          </button>
        </nav>
        <div className="study-dash__sidebar-goal card">
          <div className="study-dash__sidebar-goal-title">{"today's goal (rough)"}</div>
          <div className="study-dash__sidebar-goal-ring">
            <Donut pct={dailyGoalPct} size={88} stroke={8} color="#ca8a04" />
            <span className="study-dash__sidebar-goal-pct">{Math.round(dailyGoalPct)}%</span>
          </div>
        </div>
      </aside>

      <div className="study-dash__main">
        <header className="study-dash__header">
          <h1 className="study-dash__title">my study week</h1>
          <div className="study-dash__header-actions">
            <label className="study-dash__search" aria-label="Filter habit names">
              <IconSearch />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="filter habits…" className="study-dash__search-input" />
            </label>
            <div className="study-dash__avatar" title="not a real profile lol">
              📚
            </div>
          </div>
        </header>

        <div className="study-dash__toolbar">
          <button type="button" className="study-dash__chip" onClick={() => go('streak')}>
            streak view
          </button>
          <button type="button" className="study-dash__chip" onClick={() => go('questionnaire')}>
            add questionnaire
          </button>
          <button type="button" className="study-dash__chip study-dash__chip--ghost" onClick={load}>
            reload from server
          </button>
        </div>

        <div className="study-dash__body">
          <div className="study-dash__primary">
            {error && (
              <div className="alert alert-error">
                {error}{' '}
                <button type="button" onClick={load} style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 13 }}>
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="card study-dash__loading">one sec, grabbing your saved stuff…</div>
            ) : (
              <>
                <section id="dash-habits" className="card study-dash__habit-card">
                  <div className="study-dash__week-nav">
                    <button type="button" className="study-dash__week-arrow" onClick={() => setWeekOffset(o => o - 1)} aria-label="Previous week">
                      ‹
                    </button>
                    <span className="study-dash__week-label">{weekLabel}</span>
                    <button type="button" className="study-dash__week-arrow" onClick={() => setWeekOffset(o => o + 1)} aria-label="Next week">
                      ›
                    </button>
                  </div>
                  <div className="study-dash__table-wrap">
                    <table className="study-dash__table">
                      <thead>
                        <tr>
                          <th>Habit</th>
                          <th className="study-dash__th-check">Done</th>
                          {weekDays.map(d => (
                            <th key={fmtKey(d)} className="study-dash__th-day">
                              {d.toLocaleDateString('en', { weekday: 'short' })}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHabits.map(h => (
                          <tr key={h.id}>
                            <td>
                              <span className="study-dash__habit-dot" style={{ background: h.tint }} />
                              <span className="study-dash__habit-name">{h.name}</span>
                            </td>
                            <td className="study-dash__td-check">
                              <input
                                type="checkbox"
                                disabled
                                checked={weekDays.some(d => {
                                  const v = habitLog[cellKey(h.id, d)]
                                  return h.block ? (v?.minutes ?? 0) >= h.target : !!v?.done
                                })}
                                className="study-dash__row-check"
                                title="Any day completed this week"
                                aria-label={`This week for ${h.name}`}
                              />
                            </td>
                            {weekDays.map(d => {
                              const v = habitLog[cellKey(h.id, d)]
                              if (h.block) {
                                const m = v?.minutes ?? 0
                                const full = m >= h.target
                                return (
                                  <td key={fmtKey(d)}>
                                    <button
                                      type="button"
                                      className={`study-dash__cell study-dash__cell--block ${full ? 'study-dash__cell--full' : m ? 'study-dash__cell--partial' : ''}`}
                                      style={{ '--habit-tint': h.tint }}
                                      onClick={() => toggleCell(h, d)}
                                    >
                                      {m > 0 ? `${m}/${h.target}m` : '—'}
                                    </button>
                                  </td>
                                )
                              }
                              return (
                                <td key={fmtKey(d)}>
                                  <button
                                    type="button"
                                    className={`study-dash__cell study-dash__cell--tick ${v?.done ? 'study-dash__cell--on' : ''}`}
                                    style={{ '--habit-tint': h.tint }}
                                    onClick={() => toggleCell(h, d)}
                                    aria-pressed={!!v?.done}
                                  >
                                    {v?.done ? '✓' : ''}
                                  </button>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="study-dash__charts-row">
                  <div className="card study-dash__chart-card">
                    <div className="study-dash__chart-title">last few tries (bar)</div>
                    <div className="study-dash__mini-bars">
                      {habitBars.map((h, i) => (
                        <div key={i} className="study-dash__mini-bar-wrap">
                          <div className="study-dash__mini-bar" style={{ height: `${Math.max(8, h)}%`, background: ['#34d399', '#fb923c', '#60a5fa', '#a855f7', '#38bdf8'][i % 5] }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card study-dash__chart-card">
                    <div className="study-dash__chart-title">split by metric / subject</div>
                    <div className="study-dash__hbar-list">
                      {distribution.map(row => (
                        <div key={row.label} className="study-dash__hbar-row">
                          <span className="study-dash__hbar-label">{row.label}</span>
                          <div className="study-dash__hbar-track">
                            <div className="study-dash__hbar-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                          </div>
                          <span className="study-dash__hbar-pct">{row.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card study-dash__chart-card">
                    <div className="study-dash__chart-title">PS line (rough)</div>
                    <svg className="study-dash__line-svg" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <line x1="8" y1="72" x2="192" y2="72" stroke="#e2e8f0" strokeWidth="1" />
                      <polyline
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        points={lineSeries
                          .map((v, i) => {
                            const x = 8 + (i / Math.max(1, lineSeries.length - 1)) * 184
                            const y = 72 - (v / 100) * 58
                            return `${x},${y}`
                          })
                          .join(' ')}
                      />
                    </svg>
                    <div className="study-dash__line-labels">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].slice(0, lineSeries.length).map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <section id="study-analytics" className="card study-dash__analytics">
                  <div className="study-dash__analytics-head">
                    <h2 className="study-dash__analytics-title">numbers from the questionnaire</h2>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Tab t="overview" l="overview" />
                      <Tab t="scores" l="averages" />
                      <Tab t="history" l="past runs" />
                    </div>
                  </div>

                  {history.length === 0 ? (
                    <div className="study-dash__empty-analytics">
                      <p>nothing here yet — do the questionnaire once and this section fills in.</p>
                      <button type="button" className="btn btn-primary" onClick={() => go('questionnaire')}>
                        ok let me do it
                      </button>
                    </div>
                  ) : (
                    <>
                      {tab === 'overview' && (
                        <>
                          <div className="study-dash__stat-grid">
                            {[
                              { label: 'Latest PS', val: latest ? `${latest.scores.PS}%` : '—', vc: latest ? sc(latest.scores.PS) : 'var(--text)', sub: latest ? sl(latest.scores.PS) : '' },
                              { label: 'vs Previous', val: diff == null ? '—' : `${diff >= 0 ? '+' : ''}${diff}%`, vc: diff == null ? 'var(--text)' : diff >= 0 ? '#7cb88a' : '#e08585', sub: diff == null ? '' : diff >= 0 ? 'Improved' : 'Dropped' },
                              { label: 'Average PS', val: avg ? `${avg}%` : '—', vc: avg ? sc(avg) : 'var(--text)', sub: 'all attempts' },
                              { label: 'Best PS', val: best ? `${best}%` : '—', vc: 'var(--accent)', sub: 'personal best' },
                              { label: 'Attempts', val: history.length, vc: 'var(--text)', sub: 'questionnaires' },
                              { label: 'Streak', val: streak ? `${streak.currentStreak} days` : '0 days', vc: '#d97706', sub: `best: ${streak?.longestStreak || 0}d` },
                            ].map(c => (
                              <div key={c.label} className="study-dash__mini-stat">
                                <div className="study-dash__mini-stat-label">{c.label}</div>
                                <div className="study-dash__mini-stat-val" style={{ color: c.vc }}>
                                  {c.val}
                                </div>
                                <div className="study-dash__mini-stat-sub">{c.sub}</div>
                              </div>
                            ))}
                          </div>
                          {chart.length > 1 && (
                            <div className="study-dash__block-chart">
                              <div className="study-dash__chart-title">Progress score — last {chart.length} attempts</div>
                              <div className="study-dash__attempt-bars">
                                {chart.map((h, i) => (
                                  <div key={i} className="study-dash__attempt-bar-wrap">
                                    <div style={{ fontSize: 10, color: sc(h.scores.PS), fontWeight: 600 }}>{h.scores.PS}%</div>
                                    <div className="study-dash__attempt-bar" style={{ height: `${Math.max(h.scores.PS, 4)}px`, background: sc(h.scores.PS) }} />
                                    <div className="study-dash__attempt-date">{new Date(h.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {latest && (
                            <div className="study-dash__latest-block">
                              <div className="study-dash__chart-title">
                                Latest —{' '}
                                {new Date(latest.createdAt).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                              <div className="study-dash__latest-grid">
                                {[
                                  ['HTS', 'Habit tracking', latest.scores.HTS, '#8ab4f8'],
                                  ['SIS', 'Study intensity', latest.scores.SIS, '#6bc4b8'],
                                  ['GCS', 'Goal completion', latest.scores.GCS, '#a894e8'],
                                  ['QPS', 'Quiz performance', latest.scores.QPS, '#d4956c'],
                                ].map(([k, n, v, c]) => (
                                  <div key={k}>
                                    <div className="study-dash__metric-row">
                                      <span>{n}</span>
                                      <span style={{ fontWeight: 600, color: c }}>{v}%</span>
                                    </div>
                                    <div className="study-dash__metric-track">
                                      <div className="study-dash__metric-fill" style={{ width: `${v}%`, background: c }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {tab === 'scores' && (
                        <>
                          <div className="study-dash__scores-block">
                            <div className="study-dash__chart-title">Average scores</div>
                            <p className="study-dash__muted">Based on {history.length} attempt{history.length > 1 ? 's' : ''}</p>
                            {[
                              ['HTS', 'Habit tracking score', 'HTS = (Ds/Dt) x 100', avgHTS, '#8ab4f8'],
                              ['SIS', 'Study intensity score', 'SIS = (Hs/Hmax) x 100', avgSIS, '#6bc4b8'],
                              ['GCS', 'Goal completion score', 'GCS = (Gc/Gt) x 100', avgGCS, '#a894e8'],
                              ['QPS', 'Quiz performance score', 'QPS = (Qs/Qt) x 100', avgQPS, '#d4956c'],
                            ].map(([k, n, f, v, c]) => (
                              <div key={k} className="study-dash__score-row">
                                <div className="study-dash__score-head">
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{n}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace' }}>{f}</div>
                                  </div>
                                  <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}%</div>
                                </div>
                                <div className="study-dash__metric-track study-dash__metric-track--tall">
                                  <div className="study-dash__metric-fill" style={{ width: `${v}%`, background: c }} />
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{v >= 70 ? 'Strong' : v >= 45 ? 'Average' : 'Needs attention'}</div>
                              </div>
                            ))}
                          </div>
                          <div className="study-dash__formula card" style={{ padding: 14, background: 'var(--bg-mid)', fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)', lineHeight: 2, border: '1px solid var(--border)' }}>
                            <strong style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: 13, color: 'var(--text)' }}>Average progress score:</strong>
                            <br />
                            PS = 0.3({avgHTS}) + 0.2({avgSIS}) + 0.2({avgGCS}) + 0.3({avgQPS}) = <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{avg}%</span>
                          </div>
                        </>
                      )}
                      {tab === 'history' && (
                        <div className="study-dash__history-list">
                          {history.map((h, i) => (
                            <div key={h._id || i} className="study-dash__history-card" style={{ borderLeft: `3px solid ${sc(h.scores.PS)}` }}>
                              <div className="study-dash__history-top">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                                    {new Date(h.createdAt).toLocaleDateString('en', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                  {i === 0 && <span className="study-dash__pill-latest">Latest</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: sc(h.scores.PS), background: badgeBg(h.scores.PS), padding: '2px 8px', borderRadius: 3 }}>{sl(h.scores.PS)}</span>
                                  <span style={{ fontSize: 20, fontWeight: 700, color: sc(h.scores.PS) }}>{h.scores.PS}%</span>
                                </div>
                              </div>
                              <div className="study-dash__history-metrics">
                                {[
                                  ['HTS', h.scores.HTS, '#8ab4f8'],
                                  ['SIS', h.scores.SIS, '#6bc4b8'],
                                  ['GCS', h.scores.GCS, '#a894e8'],
                                  ['QPS', h.scores.QPS, '#d4956c'],
                                ].map(([k, v, c]) => (
                                  <div key={k} className="study-dash__history-metric">
                                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3, fontFamily: 'monospace', fontWeight: 500 }}>{k}</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}%</div>
                                    <div className="study-dash__metric-track" style={{ marginTop: 4, height: 3 }}>
                                      <div className="study-dash__metric-fill" style={{ width: `${v}%`, background: c }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {history.length > 0 && (
                    <div className="study-dash__danger-row">
                      <button type="button" className="btn btn-danger" style={{ fontSize: 12, padding: '7px 12px' }} onClick={clearAll}>
                        wipe all questionnaire data
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          <aside className="study-dash__rail">
            <div className="card study-dash__rail-card study-dash__rail-goal">
              <div className="study-dash__rail-title">goal donut</div>
              <div className="study-dash__rail-donut">
                <Donut pct={dailyGoalPct} size={140} stroke={12} color="#ca8a04" />
                <span className="study-dash__rail-donut-pct">{Math.round(dailyGoalPct)}%</span>
              </div>
              <p className="study-dash__rail-caption">same as your latest PS score — not scientific, just what I coded.</p>
            </div>
            <div className="card study-dash__rail-card">
              <div className="study-dash__rail-title">streak (backend)</div>
              <div className="study-dash__rail-big">{streakDays} days</div>
              <div className="study-dash__metric-track study-dash__metric-track--tall" style={{ marginTop: 10 }}>
                <div className="study-dash__metric-fill" style={{ width: `${Math.min(100, streakDays * 8)}%`, background: '#ea580c' }} />
              </div>
            </div>
            <div className="card study-dash__rail-card">
              <div className="study-dash__rail-title">hours-ish</div>
              <div className="study-dash__rail-big">{totalHoursDisplay}h</div>
              <div className="study-dash__metric-track study-dash__metric-track--tall" style={{ marginTop: 10 }}>
                <div className="study-dash__metric-fill" style={{ width: `${Math.min(100, totalHoursDisplay * 2)}%`, background: '#0d9488' }} />
              </div>
              <p className="study-dash__rail-caption">fuzzy math: ~45 min guessed per questionnaire submit.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
