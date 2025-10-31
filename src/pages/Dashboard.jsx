import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { getOverview, createReport } from '../lib/api'

export default function Dashboard(){
  const [data, setData] = useState({ totalPlayers:0, totalMoney:0, unpaidPlayers:0, playersPerGame:[] })
  const [loading, setLoading] = useState(false)

  const refresh = async ()=>{
    setLoading(true)
    const start = Date.now()
    try {
      const ov = await getOverview()
      setData(ov)
    } finally {
      const elapsed = Date.now() - start
      const remaining = 2000 - elapsed
      if (remaining > 0) {
        setTimeout(()=> setLoading(false), remaining)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(()=>{ refresh(); const t = setInterval(refresh, 10000); return ()=>clearInterval(t) },[])

  const colors = ['#60a5fa','#93c5fd','#1e40af','#3b82f6']

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat title="Players" value={data.totalPlayers} />
        <Stat title="Collected (RWF)" value={new Intl.NumberFormat('en-US').format(data.totalMoney)} />
        <Stat title="Unpaid" value={data.unpaidPlayers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Players per Game">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.playersPerGame}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Total RWF Collected">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={[{name:'Collected', value:data.totalMoney},{name:'Pending', value:data.unpaidPlayers}]} dataKey="value" nameKey="name" outerRadius={80} label>
                {[0,1].map((idx)=>(<Cell key={idx} fill={colors[idx%colors.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Card title="Weekly Progress">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={[{w:1,v:5},{w:2,v:9},{w:3,v:14},{w:4,v:20}]}> 
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="w" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="v" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="flex gap-2">
        <button onClick={()=>createReport('pdf')} className="ripple px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">Generate Report (PDF)</button>
        <button onClick={refresh} className="ripple px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">Refresh Overview</button>
      </div>

      {loading && <Loader />}
    </div>
  )
}

function Card({ title, children }){
  return (
    <motion.div className="glass rounded-xl p-4" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

function Stat({ title, value }){
  return (
    <motion.div className="glass rounded-xl p-4" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </motion.div>
  )
}

function Loader(){
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40">
      <div className="glass p-6 rounded-xl">
        <div className="dots-loader"><span></span><span></span><span></span></div>
      </div>
    </div>
  )
}


