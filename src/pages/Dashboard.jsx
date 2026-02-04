import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../hooks/useAuth"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("courses")
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses")
        setCourses(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const navigate = tab => {
    setActiveTab(tab)
    setSelectedCourse(null)
    setMenuOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="brand">SemFlow</h1>
      </header>

      <main className="main-content">
        {activeTab === "courses" && !selectedCourse && (
          <section className="section">
            <h3>Your Courses</h3>

            {loading ? (
              <div className="empty-state">
                <p>Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <p>No courses yet</p>
                <span>Add your semester courses</span>
              </div>
            ) : (
              <div className="course-list">
                {courses.map(course => (
                  <div
                    key={course._id}
                    className="course-card"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="course-card-head">
                      <h4>{course.courseName}</h4>
                      <span>{course.creditHours} CH</span>
                    </div>
                    <div className="course-meta">
                      <span>
                        Theory: {course.theoryAssignments} A · {course.theoryQuizzes} Q
                      </span>
                      {course.hasLab && (
                        <span>
                          Lab: {course.labAssignments} A · {course.labQuizzes} Q
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {selectedCourse && (
          <section className="section">
            <button
              className="back-btn"
              onClick={() => setSelectedCourse(null)}
            >
              ← Back
            </button>

            <div className="detail-card">
              <h2>{selectedCourse.courseName}</h2>
              <p>{selectedCourse.creditHours} Credit Hours</p>

              <div className="detail-block">
                <h4>Theory</h4>
                <span>Assignments: {selectedCourse.theoryAssignments}</span>
                <span>Quizzes: {selectedCourse.theoryQuizzes}</span>
              </div>

              {selectedCourse.hasLab && (
                <div className="detail-block">
                  <h4>Lab</h4>
                  <span>Lab Hours: {selectedCourse.labHours}</span>
                  <span>Assignments: {selectedCourse.labAssignments}</span>
                  <span>Quizzes: {selectedCourse.labQuizzes}</span>
                </div>
              )}
            </div>
          </section>
        )}
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
          <button className={activeTab === "courses" ? "active" : ""} onClick={() => navigate("courses")}>
            Courses
          </button>
          <button className={activeTab === "venues" ? "active" : ""} onClick={() => navigate("venues")}>
            Venues
          </button>
          <button className={activeTab === "calendar" ? "active" : ""} onClick={() => navigate("calendar")}>
            Semester Calendar
          </button>
          <button className={activeTab === "timetable" ? "active" : ""} onClick={() => navigate("timetable")}>
            CS Timetable
          </button>
        </nav>

        <div className="side-footer">
          <button onClick={() => navigate("password")}>
            Update Password
          </button>
          <button className="danger" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Dashboard
