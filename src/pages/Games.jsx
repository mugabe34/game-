import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createGame, getGames } from '../lib/api'

export default function Games(){
  const [games, setGames] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name:'', description:'', registeringFee:0, stage:'Round 1', date:'' })

  async function load(){ setGames(await getGames()) }
  useEffect(()=>{ load() },[])

  async function save(){
    await createGame({ ...form, date: form.date? new Date(form.date): undefined })
    setOpen(false); setForm({ name:'', description:'', registeringFee:0, stage:'Round 1', date:'' });
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Games</h2>
        <button onClick={()=>setOpen(true)} className="ripple px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">Create Game</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {games.map(g => (
          <motion.div key={g._id} className="glass rounded-xl p-4 hover:bg-white/10 transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-semibold">{g.name}</div>
                <div className="text-sm opacity-80">Stage: {g.stage}</div>
              </div>
              <div className="text-sm">RWF {new Intl.NumberFormat('en-US').format(g.registeringFee)}</div>
            </div>
            <div className="opacity-80 mt-2 text-sm">{g.description}</div>
            <div className="flex gap-2 mt-3">
              <button className="ripple px-3 py-1 rounded bg-white/10">Open Table</button>
              <button className="ripple px-3 py-1 rounded bg-white/10">View Players</button>
              <button className="ripple px-3 py-1 rounded bg-white/10">Plan Matches</button>
              <button className="ripple px-3 py-1 rounded bg-blue-600 hover:bg-blue-500">Generate Report</button>
            </div>
          </motion.div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <motion.div initial={{scale:.95, opacity:0}} animate={{scale:1, opacity:1}} className="glass w-full max-w-lg p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Create Game</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Name" value={form.name} onChange={v=>setForm(s=>({...s, name:v}))} />
              <Input label="Stage" value={form.stage} onChange={v=>setForm(s=>({...s, stage:v}))} />
              <Input label="Fee (RWF)" type="number" value={form.registeringFee} onChange={v=>setForm(s=>({...s, registeringFee:Number(v)}))} />
              <Input label="Date" type="datetime-local" value={form.date} onChange={v=>setForm(s=>({...s, date:v}))} />
              <div className="md:col-span-2">
                <label className="text-sm">Description</label>
                <textarea className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 rounded-md bg-white/10" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500" onClick={save}>Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function Input({ label, value, onChange, type='text' }){
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10" />
    </div>
  )
}


