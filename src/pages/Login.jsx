import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
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
      navigate("/")
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  )
}
