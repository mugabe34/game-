import { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from '../lib/api'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('mugabeherve7@gmail.com')
  const [password, setPassword] = useState('3434')
  const [error, setError] = useState('')

  async function submit(e){
    e.preventDefault()
    setError('')
    try {
      const { token } = await login(email, password)
      onLogin(token)
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center relative">
      <div className="blur-circle w-72 h-72 -z-10 -top-10 right-10" />
      <motion.form onSubmit={submit} className={`glass w-full max-w-md p-6 rounded-xl ${error? 'shake':''}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <div className="flex items-center gap-3 mb-4">
          <img src="/lg.png" className="w-10 h-10" alt="logo"/>
          <h1 className="text-xl font-semibold">Admin Login</h1>
        </div>
        <label className="text-sm">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 rounded-md bg-white/5 border border-white/10" />
        <label className="text-sm">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 mb-4 px-3 py-2 rounded-md bg-white/5 border border-white/10" />
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        <button className="ripple w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">Sign In</button>
      </motion.form>
    </div>
  )
}


