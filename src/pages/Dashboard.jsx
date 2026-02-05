import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  const go = path => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(p => !p)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="brand">SemFlow</h1>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      {menuOpen && (
        <div className="side-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`side-panel ${menuOpen ? "show" : ""}`}>
        <div className="side-identity">
          <div className="avatar">
            {user?.displayName?.charAt(0)}
          </div>
          <div className="identity-text">
            <div className="identity-name">{user?.displayName}</div>
            <div className="identity-roll">{user?.rollNumber}</div>
          </div>
        </div>

        <nav className="side-nav">
          <button onClick={() => go("/dashboard")}>📘 Courses</button>
          <button onClick={() => go("/dashboard/assessments")}>📝 Assessments</button>
          <button onClick={() => go("/dashboard/venues")}>🏫 Venues</button>
          <button onClick={() => go("/dashboard/calendar")}>🗓️ Semester Calendar</button>
          <button onClick={() => go("/dashboard/about")}>ℹ️ About</button>
        </nav>

        <div className="side-footer">
          <button
            className="danger"
            onClick={() => {
              logout()
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Dashboard
