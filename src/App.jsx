import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Games from './pages/Games'
import Players from './pages/Players'
import Reports from './pages/Reports'
import MatchPlanner from './pages/MatchPlanner'
import Activity from './pages/Activity'
import Login from './pages/Login'
import Protected from './components/Protected'

function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 glass h-14 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <img src="/lg.png" alt="Peace and Love Proclaimers" className="w-8 h-8" />
        <span className="font-semibold tracking-wide">Sports Admin</span>
      </div>
      <ThemeToggle />
    </div>
  )
}

function ThemeToggle() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return (
    <button className="ripple px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 transition" onClick={(e)=>{
      const d = document.createElement('span')
      const rect = e.currentTarget.getBoundingClientRect()
      d.style.width = d.style.height = Math.max(rect.width, rect.height) + 'px'
      d.style.left = (e.clientX - rect.left - (Math.max(rect.width, rect.height)/2)) + 'px'
      d.style.top = (e.clientY - rect.top - (Math.max(rect.width, rect.height)/2)) + 'px'
      d.className = 'absolute animate-[ripple_600ms_linear] rounded-full bg-white/40'
      e.currentTarget.appendChild(d)
      setTimeout(()=>d.remove(), 650)
      setDark(v => !v)
    }}>{dark? 'Dark' : 'Light'}</button>
  )
}

function Sidebar() {
  const location = useLocation()
  const links = useMemo(()=>[
    { to: '/dashboard', label: 'Overview' },
    { to: '/games', label: 'Games' },
    { to: '/players', label: 'Players' },
    { to: '/reports', label: 'Reports' },
    { to: '/matches', label: 'Match Planner' },
    { to: '/activity', label: 'Activity Log' },
  ],[])
  return (
    <aside className="fixed top-14 bottom-0 left-0 w-60 glass p-3">
      <div className="relative h-full">
        <div className="blur-circle w-40 h-40 -left-10 top-20" />
        <nav className="flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`px-3 py-2 rounded-md transition hover:bg-white/10 ${location.pathname.startsWith(l.to) ? 'bg-white/10' : ''}`}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const onLogin = (t) => { localStorage.setItem('token', t); setToken(t) }
  const onLogout = () => { localStorage.removeItem('token'); setToken(null) }

  return (
    <div>
      <Navbar />
      <div className="pt-14 flex">
        {token && <Sidebar />}
        <main className={`flex-1 ${token? 'ml-60' : ''} p-4`}> 
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={token? <Navigate to="/dashboard" replace/> : <Login onLogin={onLogin} />} />
              <Route path="/dashboard" element={<Protected token={token}><Dashboard /></Protected>} />
              <Route path="/games" element={<Protected token={token}><Games /></Protected>} />
              <Route path="/players" element={<Protected token={token}><Players /></Protected>} />
              <Route path="/reports" element={<Protected token={token}><Reports /></Protected>} />
              <Route path="/matches" element={<Protected token={token}><MatchPlanner /></Protected>} />
              <Route path="/activity" element={<Protected token={token}><Activity /></Protected>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}


