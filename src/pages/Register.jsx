import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [profilePic, setProfilePic] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return

    setError("")

    try {
      const formData = new FormData()
      formData.append("displayName", displayName)
      formData.append("rollNumber", rollNumber)
      formData.append("password", password)

      if (profilePic) {
        formData.append("profilePic", profilePic)
      }

      await register(formData)
      navigate("/dashboard")
    } catch {
      setError("Registration failed. Try again.")
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
          disabled={loading}
          required
        />

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={e => setRollNumber(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setProfilePic(e.target.files[0])}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </button>

        <p className="switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
