export default function Protected({ token, children }){
  if (!token) return null
  return children
}


