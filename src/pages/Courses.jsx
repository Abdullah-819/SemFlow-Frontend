import { useEffect, useState } from "react"
import api from "../api/axios"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    courseName: "",
    creditHours: "",
    theoryAssignments: "",
    theoryQuizzes: "",
    hasLab: false,
    labHours: "",
    labAssignments: "",
    labQuizzes: ""
  })

  useEffect(() => {
    const loadCourses = async () => {
      const token = localStorage.getItem("token")
      const cached = localStorage.getItem("semflow_courses")

      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.token === token) {
          setCourses(parsed.data)
          setLoading(false)
          return
        }
      }

      try {
        const res = await api.get("/api/courses")
        setCourses(res.data)
        localStorage.setItem(
          "semflow_courses",
          JSON.stringify({ token, data: res.data })
        )
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const openAdd = () => {
    setEditingCourse(null)
    setForm({
      courseName: "",
      creditHours: "",
      theoryAssignments: "",
      theoryQuizzes: "",
      hasLab: false,
      labHours: "",
      labAssignments: "",
      labQuizzes: ""
    })
    setShowModal(true)
  }

  const openEdit = course => {
    setEditingCourse(course)
    setForm({
      courseName: course.courseName,
      creditHours: course.creditHours,
      theoryAssignments: course.theoryAssignments,
      theoryQuizzes: course.theoryQuizzes,
      hasLab: Boolean(course.hasLab),
      labHours: course.labHours ?? "",
      labAssignments: course.labAssignments ?? "",
      labQuizzes: course.labQuizzes ?? ""
    })
    setShowModal(true)
  }

  const saveCourse = async () => {
    if (!form.courseName || !form.creditHours) return

    setSaving(true)

    const payload = {
      courseName: form.courseName,
      creditHours: Number(form.creditHours),
      theoryAssignments: Number(form.theoryAssignments),
      theoryQuizzes: Number(form.theoryQuizzes),
      hasLab: Boolean(form.hasLab),
      labHours: form.hasLab ? Number(form.labHours) : 0,
      labAssignments: form.hasLab ? Number(form.labAssignments) : 0,
      labQuizzes: form.hasLab ? Number(form.labQuizzes) : 0
    }

    try {
      let updated
      if (editingCourse) {
        const res = await api.put(`/api/courses/${editingCourse._id}`, payload)
        updated = courses.map(c =>
          c._id === editingCourse._id ? res.data : c
        )
      } else {
        const res = await api.post("/api/courses", payload)
        updated = [res.data, ...courses]
      }

      setCourses(updated)
      localStorage.setItem(
        "semflow_courses",
        JSON.stringify({ token: localStorage.getItem("token"), data: updated })
      )

      setShowModal(false)
      setEditingCourse(null)
    } finally {
      setSaving(false)
    }
  }

  const deleteCourse = async id => {
    await api.delete(`/api/courses/${id}`)
    const updated = courses.filter(c => c._id !== id)
    setCourses(updated)
    localStorage.setItem(
      "semflow_courses",
      JSON.stringify({ token: localStorage.getItem("token"), data: updated })
    )
    setSelectedCourse(null)
  }

  return (
    <section className="section">
      {!selectedCourse && (
        <>
          <div className="section-header">
            <h3>Your Courses</h3>
            <button className="primary-btn" onClick={openAdd}>+ Add</button>
          </div>

          {loading ? (
            <div className="empty-state"><p>Loading courses...</p></div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <p>No courses yet</p>
              <span>Add your semester courses</span>
            </div>
          ) : (
            <div className="course-table">
              {courses.map(course => (
                <div
                  key={course._id}
                  className="course-row"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="course-cell">
                    <span className="cell-label">Course</span>
                    <span className="cell-value">{course.courseName}</span>
                  </div>
                  <div className="course-cell">
                    <span className="cell-label">CH</span>
                    <span className="cell-value">{course.creditHours}</span>
                  </div>
                  <div className="course-cell">
                    <span className="cell-label">Theory</span>
                    <span className="cell-value">
                      {course.theoryAssignments}/{course.theoryQuizzes}
                    </span>
                  </div>
                  {course.hasLab && (
                    <div className="course-cell">
                      <span className="cell-label">Lab</span>
                      <span className="cell-value">
                        {(course.labAssignments ?? 0)}/{(course.labQuizzes ?? 0)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedCourse && (
        <>
          <button className="back-btn" onClick={() => setSelectedCourse(null)}>
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
                <span>Hours: {selectedCourse.labHours ?? 0}</span>
                <span>Assignments: {selectedCourse.labAssignments ?? 0}</span>
                <span>Quizzes: {selectedCourse.labQuizzes ?? 0}</span>
              </div>
            )}

            <div className="detail-actions">
              <button className="secondary-btn" onClick={() => openEdit(selectedCourse)}>
                Edit
              </button>
              <button className="danger" onClick={() => deleteCourse(selectedCourse._id)}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>

            <input name="courseName" value={form.courseName} onChange={handleChange} />
            <input name="creditHours" type="number" value={form.creditHours} onChange={handleChange} />
            <input name="theoryAssignments" type="number" value={form.theoryAssignments} onChange={handleChange} />
            <input name="theoryQuizzes" type="number" value={form.theoryQuizzes} onChange={handleChange} />

            <label className="checkbox-row">
              <input type="checkbox" name="hasLab" checked={form.hasLab} onChange={handleChange} />
              Has Lab
            </label>

            {form.hasLab && (
              <>
                <input name="labHours" type="number" value={form.labHours} onChange={handleChange} />
                <input name="labAssignments" type="number" value={form.labAssignments} onChange={handleChange} />
                <input name="labQuizzes" type="number" value={form.labQuizzes} onChange={handleChange} />
              </>
            )}

            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={saveCourse} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Courses
