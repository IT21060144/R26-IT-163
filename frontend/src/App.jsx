import { useState, useEffect } from 'react'
import Nav           from './components/Nav.jsx'
import Landing       from './pages/Landing.jsx'
import CodeEntry     from './pages/CodeEntry.jsx'
import Questionnaire from './pages/Questionnaire.jsx'
import Results       from './pages/Results.jsx'
import Dashboard     from './pages/Dashboard.jsx'
import Streak        from './pages/Streak.jsx'

export default function App() {
  const [page,       setPage]       = useState('landing')
  const [code,       setCode]       = useState(null)
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('st_code')
    if (saved) setCode(saved)
  }, [])

  const go = p => { setPage(p); window.scrollTo(0, 0) }

  const activateCode = c => {
    setCode(c)
    localStorage.setItem('st_code', c)
    go('landing')
  }

  const clearCode = () => {
    setCode(null)
    localStorage.removeItem('st_code')
    go('landing')
  }

  const Guard = ({ children }) => !code
    ? <div className="guard-box card">
        <p style={{ color:'var(--text2)', marginBottom:16 }}>Please enter your student code first.</p>
        <button className="btn btn-primary" onClick={() => go('code')}>Enter Code</button>
      </div>
    : children

  return (
    <div>
      {!(page === 'dashboard' && code) && (
        <Nav go={go} code={code} clearCode={clearCode} />
      )}
      {page==='landing'       && <Landing go={go} code={code} />}
      {page==='code'          && <CodeEntry go={go} activateCode={activateCode} />}
      {page==='questionnaire' && <Guard><Questionnaire go={go} code={code} setLastResult={setLastResult} /></Guard>}
      {page==='results'       && <Guard><Results go={go} result={lastResult} /></Guard>}
      {page==='dashboard'     && <Guard><Dashboard go={go} code={code} clearCode={clearCode} /></Guard>}
      {page==='streak'        && <Guard><Streak go={go} code={code} /></Guard>}
    </div>
  )
}
