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

  const isActive = path =>
    location.pathname === path ||
    (path === "/dashboard" && location.pathname === "/dashboard")

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
  <div className="nav-section">
    <div className="nav-label">Academic</div>

    <button
      className={isActive("/dashboard/study-log") ? "active" : ""}
      onClick={() => go("/dashboard/study-log")}
    >
      📒 Study Log
    </button>

    <button
      className={isActive("/dashboard") ? "active" : ""}
      onClick={() => go("/dashboard")}
    >
      📘 Courses
    </button>

    <button
      className={isActive("/dashboard/assessments") ? "active" : ""}
      onClick={() => go("/dashboard/assessments")}
    >
      📝 Assessments
    </button>

    <button
      className={isActive("/dashboard/venues") ? "active" : ""}
      onClick={() => go("/dashboard/venues")}
    >
      🏫 Venues
    </button>

    <button
      className={isActive("/dashboard/calendar") ? "active" : ""}
      onClick={() => go("/dashboard/calendar")}
    >
      🗓️ Semester Calendar
    </button>
  </div>

  <div className="nav-divider" />

  <div className="nav-section">
    <div className="nav-label">General</div>

    <button
      className={isActive("/dashboard/about") ? "active" : ""}
      onClick={() => go("/dashboard/about")}
    >
      ℹ️ About Developer
    </button>
  </div>
</nav>


        <div className="side-footer">
          <button className="danger" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <footer className="app-footer">
  Developed by Abdullah Rana © 2026
</footer>

    </div>
  )
}

export default Dashboard
