import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

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

<div className="avatar" onClick={() => setShowProfile(true)}>
  {user?.profilePic ? (
    <img src={user.profilePic} alt="profile" />
  ) : (
    <span>{user?.displayName?.charAt(0)}</span>
  )}
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
      {showProfile && (
  <div className="profile-modal">
    <div className="profile-box">
      <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>

      <img src={user?.profilePic} className="profile-large" />

      <h3>{user?.displayName}</h3>
      <p>{user?.rollNumber}</p>

      <input
        type="file"
        accept="image/*"
        onChange={async e => {
          const file = e.target.files[0]
          if (!file) return

          const formData = new FormData()
          formData.append("profilePic", file)

          const token = localStorage.getItem("token")

          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-photo`,
            {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
              body: formData
            }
          )

          const data = await res.json()
          localStorage.setItem("semflow_user", JSON.stringify(data))
          window.location.reload()
        }}
      />
    </div>
  </div>
)}

      <footer className="app-footer">
  Developed by Abdullah Rana © 2026
</footer>

    </div>
  )
}

export default Dashboard
