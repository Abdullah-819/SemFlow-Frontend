import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    try {
      await register({ displayName, rollNumber, password })
      navigate("/dashboard")
    } catch {
      setError("Registration failed")
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
        />

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

        <p className="switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
