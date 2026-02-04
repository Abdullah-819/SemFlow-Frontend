import { useAuth } from "../hooks/useAuth"

const Dashboard = () => {
  const { user, logout } = useAuth()

  const courses = [
    {
      id: 1,
      title: "Data Structures",
      code: "CS-301"
    },
    {
      id: 2,
      title: "Database Systems",
      code: "CS-305"
    }
  ]

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>Hi{user?.displayName ? `, ${user.displayName}` : ""}</h2>
          <p className="dash-subtitle">Track your semester flow</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="section">
        <div className="section-header">
          <h3>Your Courses</h3>
          <button className="primary-btn">Add</button>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <p>No courses added yet</p>
            <span>Start by adding your first course</span>
          </div>
        ) : (
          <div className="course-list">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <span>{course.code}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
