import { useEffect, useState } from 'react'
import { getReports, createReport, deleteReport, updateReport } from '../lib/api'

export default function Reports(){
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)

  async function load(){ setReports(await getReports()) }
  useEffect(()=>{ load() },[])

  async function generate(format){
    setLoading(true)
    const start = Date.now()
    try {
      await createReport(format)
    } finally {
      const elapsed = Date.now() - start
      const remaining = 2000 - elapsed
      const finish = ()=>{ setLoading(false); load() }
      if (remaining > 0) setTimeout(finish, remaining); else finish()
    }
  }

  async function edit(r){ await updateReport(r._id, { currentStage: r.currentStage }) ; load() }
  async function remove(id){ await deleteReport(id); load() }

  return (
    <div className="space-y-3 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reports</h2>
        <div className="flex gap-2">
          <button className="ripple px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500" onClick={()=>generate('pdf')}>Download PDF</button>
          <button className="ripple px-4 py-2 rounded-md bg-white/10" onClick={()=>generate('csv')}>Download CSV</button>
        </div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left">Players</th>
              <th className="p-3 text-left">RWF</th>
              <th className="p-3 text-left">Stage</th>
              <th className="p-3 text-left">Unpaid</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id} className="border-t border-white/10">
                <td className="p-3">{r.totalPlayers}</td>
                <td className="p-3">{new Intl.NumberFormat('en-US').format(r.totalMoney)} RWF</td>
                <td className="p-3">{r.currentStage}</td>
                <td className="p-3">{r.unpaidPlayers}</td>
                <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <button className="ripple px-3 py-1 rounded bg-white/10 mr-2" onClick={()=>edit(r)}>Edit</button>
                  <button className="ripple px-3 py-1 rounded bg-red-600 hover:bg-red-500" onClick={()=>remove(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="dots-loader"><span></span><span></span><span></span></div>
        </div>
      )}
    </div>
  )
}


