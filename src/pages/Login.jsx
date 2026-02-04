import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    try {
      await login({ rollNumber, password })
      navigate("/dashboard")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={e => setRollNumber(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p className="switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
