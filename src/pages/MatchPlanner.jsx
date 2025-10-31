import { useMemo, useState } from 'react'

export default function MatchPlanner(){
  const [teams, setTeams] = useState([{teamA:'',teamB:'',round:'Round 1'}])
  const rounds = useMemo(()=>['Round 1','Quarterfinals','Semifinals','Final'],[])

  function add(){ setTeams(t=>[...t, {teamA:'',teamB:'',round:'Round 1'}]) }
  function randomize(){
    const pool = ['Team A','Team B','Team C','Team D','Team E','Team F']
    const shuffled = [...pool].sort(()=>Math.random()-0.5)
    const matches = []
    for(let i=0;i<shuffled.length;i+=2){ matches.push({ teamA: shuffled[i], teamB: shuffled[i+1] || 'BYE', round:'Round 1'}) }
    setTeams(matches)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button className="ripple px-4 py-2 rounded-md bg-white/10" onClick={add}>Add Match</button>
        <button className="ripple px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500" onClick={randomize}>Auto Pair</button>
      </div>
      <div className="glass rounded-xl p-4 grid gap-3">
        {teams.map((m,idx)=>(
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <input value={m.teamA} onChange={e=>setTeams(t=>t.map((x,i)=>i===idx?{...x, teamA:e.target.value}:x))} className="px-3 py-2 rounded-md bg-white/5 border border-white/10" placeholder="Team A" />
            <span className="text-center">vs</span>
            <input value={m.teamB} onChange={e=>setTeams(t=>t.map((x,i)=>i===idx?{...x, teamB:e.target.value}:x))} className="px-3 py-2 rounded-md bg-white/5 border border-white/10" placeholder="Team B" />
            <select value={m.round} onChange={e=>setTeams(t=>t.map((x,i)=>i===idx?{...x, round:e.target.value}:x))} className="px-3 py-2 rounded-md bg-white/5 border border-white/10">
              {rounds.map(r=> <option key={r}>{r}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}


