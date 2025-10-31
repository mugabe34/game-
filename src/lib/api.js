import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(email, password){
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getOverview(){ const { data } = await api.get('/overview'); return data }
export async function getGames(){ const { data } = await api.get('/games'); return data }
export async function createGame(payload){ const { data } = await api.post('/games', payload); return data }
export async function getPlayers(gameId){ const { data } = await api.get(`/games/${gameId}/players`); return data }
export async function addPlayer(gameId, payload){ const { data } = await api.post(`/games/${gameId}/players`, payload); return data }
export async function updatePayment(playerId, payload){ const { data } = await api.patch(`/players/${playerId}/payment`, payload); return data }
export async function getReports(){ const { data } = await api.get('/reports'); return data }
export async function createReport(format){ return api.post(`/reports${format?`?format=${format}`:''}`) }
export async function updateReport(id, payload){ const { data } = await api.put(`/reports/${id}`, payload); return data }
export async function deleteReport(id){ const { data } = await api.delete(`/reports/${id}`); return data }


