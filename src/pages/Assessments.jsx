import { useEffect, useState } from "react"
import api from "../api/axios"

const Assessments = () => {
  const [courses, setCourses] = useState([])
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [coursesRes, assessRes] = await Promise.all([
        api.get("/api/courses"),
        api.get("/api/assessments")
      ])

      setCourses(coursesRes.data)
      setAssessments(assessRes.data)
      setLoading(false)
    }

    loadData()
  }, [])

  const getAssessmentForCourse = courseId => {
    return assessments.find(a => a.course._id === courseId)
  }

  if (loading) {
    return (
      <section className="section">
        <div className="empty-state">
          <p>Loading assessments...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="section-header">
        <h3>Assessments</h3>
      </div>

      <div className="course-table">
        {courses.map(course => {
          const assessment = getAssessmentForCourse(course._id)

          return (
            <div key={course._id} className="course-row">
              <div className="course-cell">
                <span className="cell-label">Course</span>
                <span className="cell-value">{course.courseName}</span>
              </div>

              <div className="course-cell">
                <span className="cell-label">Credits</span>
                <span className="cell-value">{course.creditHours}</span>
              </div>

              <div className="course-cell">
                <span className="cell-label">Final Marks</span>
                <span className="cell-value">
                  {assessment ? assessment.finalMarks.toFixed(2) : "—"}
                </span>
              </div>

              <div className="course-cell">
                <span className="cell-label">Grade</span>
                <span className="cell-value">
                  {assessment ? assessment.grade : "Pending"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Assessments
