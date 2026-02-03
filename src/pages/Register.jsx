import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    try {
      await register({ rollNumber, password })
      navigate("/")
    } catch (err) {
      setError("Registration failed")
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>

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

        <button type="submit">Register</button>
      </form>
    </div>
  )
}
