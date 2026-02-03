import { useAuth } from "../hooks/useAuth"

export default function Dashboard() {
  const { logout } = useAuth()

  return (
    <div className="dashboard">
      <h1>SemFlow Dashboard</h1>

      <p>Welcome to your semester workspace</p>

      <button onClick={logout}>Logout</button>
    </div>
  )
}
