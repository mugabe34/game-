import { useEffect, useState } from 'react'
import { getGames, getPlayers, addPlayer, updatePayment } from '../lib/api'

export default function Players(){
  const [games, setGames] = useState([])
  const [selected, setSelected] = useState('')
  const [players, setPlayers] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name:'', teamName:'', amount:0, paymentStatus:'unpaid', date:'' })

  useEffect(()=>{ (async()=>{ const g = await getGames(); setGames(g); if (g[0]?._id) setSelected(g[0]._id) })() },[])
  useEffect(()=>{ if(selected) load() },[selected])

  async function load(){ setPlayers(await getPlayers(selected)) }

  async function save(){ await addPlayer(selected, { ...form, date: form.date? new Date(form.date): undefined }); setOpen(false); setForm({ name:'', teamName:'', amount:0, paymentStatus:'unpaid', date:'' }); load() }

  async function togglePayment(p){ await updatePayment(p._id, { status: p.paymentStatus==='paid'?'unpaid':'paid', amount: p.amount }); load() }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <select className="px-3 py-2 rounded-md bg-white/5 border border-white/10" value={selected} onChange={e=>setSelected(e.target.value)}>
          {games.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <button onClick={()=>setOpen(true)} className="ripple px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">Add Player</button>
      </div>
      <div className="glass rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Team</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Date</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p._id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.teamName}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${p.paymentStatus==='paid'?'bg-green-500/20 text-green-300':'bg-yellow-500/20 text-yellow-300'}`}>{p.paymentStatus}</span></td>
                <td className="p-3">{new Intl.NumberFormat('en-US').format(p.amount)} RWF</td>
                <td className="p-3">{new Date(p.date).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <button className="ripple px-3 py-1 rounded-md bg-white/10" onClick={()=>togglePayment(p)}>{p.paymentStatus==='paid'?'Mark Unpaid':'Mark Paid'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <div className="glass w-full max-w-lg p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Add Player</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Name" value={form.name} onChange={v=>setForm(s=>({...s, name:v}))} />
              <Input label="Team" value={form.teamName} onChange={v=>setForm(s=>({...s, teamName:v}))} />
              <Input label="Amount" type="number" value={form.amount} onChange={v=>setForm(s=>({...s, amount:Number(v)}))} />
              <div>
                <label className="text-sm">Payment Status</label>
                <select className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10" value={form.paymentStatus} onChange={e=>setForm(s=>({...s, paymentStatus:e.target.value}))}>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <Input label="Date" type="datetime-local" value={form.date} onChange={v=>setForm(s=>({...s, date:v}))} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 rounded-md bg-white/10" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500" onClick={save}>Save</button>
            </div>
          </div>
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


