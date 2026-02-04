import { useEffect, useState } from "react"
import api from "../api/axios"

const emptyMarks = {
  assignments: [],
  quizzes: [],
  mid: { obtained: "" },
  final: { obtained: "" }
}

const Assessments = () => {
  const [courses, setCourses] = useState([])
  const [assessments, setAssessments] = useState([])
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ theory: emptyMarks, lab: emptyMarks })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token")
      const cached = localStorage.getItem("semflow_assessments")

      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.token === token) {
          setAssessments(parsed.data)
        }
      }

      const [coursesRes, assessRes] = await Promise.all([
        api.get("/api/courses"),
        api.get("/api/assessments")
      ])

      setCourses(coursesRes.data)
      setAssessments(assessRes.data)

      localStorage.setItem(
        "semflow_assessments",
        JSON.stringify({ token, data: assessRes.data })
      )

      setLoading(false)
    }

    loadData()
  }, [])

  const openEditor = course => {
    const existing = assessments.find(a => a.course._id === course._id)
    setSelected({ course, assessment: existing })
    setForm(
      existing
        ? { theory: existing.theory, lab: existing.lab || emptyMarks }
        : { theory: emptyMarks, lab: emptyMarks }
    )
    setEditing(true)
  }

  const saveAssessment = async () => {
    setSaving(true)

    const payload = {
      courseId: selected.course._id,
      semester: "Fall 2025",
      theory: form.theory,
      lab: selected.course.hasLab ? form.lab : undefined
    }

    const res = await api.post("/api/assessments", payload)

    const updated = assessments.filter(
      a => a.course._id !== selected.course._id
    )

    updated.push(res.data)
    setAssessments(updated)

    localStorage.setItem(
      "semflow_assessments",
      JSON.stringify({ token: localStorage.getItem("token"), data: updated })
    )

    setEditing(false)
    setSelected(null)
    setSaving(false)
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

  if (editing && selected) {
    return (
      <section className="section">
        <button className="back-btn" onClick={() => setEditing(false)}>
          ← Back
        </button>

        <div className="detail-card">
          <h2>{selected.course.courseName}</h2>

          <div className="detail-block">
            <h4>Theory</h4>
            <input
              type="number"
              placeholder="Mid (out of 25)"
              value={form.theory.mid.obtained}
              onChange={e =>
                setForm({
                  ...form,
                  theory: {
                    ...form.theory,
                    mid: { obtained: Number(e.target.value) }
                  }
                })
              }
            />
            <input
              type="number"
              placeholder="Final (out of 50)"
              value={form.theory.final.obtained}
              onChange={e =>
                setForm({
                  ...form,
                  theory: {
                    ...form.theory,
                    final: { obtained: Number(e.target.value) }
                  }
                })
              }
            />
          </div>

          {selected.course.hasLab && (
            <div className="detail-block">
              <h4>Lab</h4>
              <input
                type="number"
                placeholder="Lab Mid (out of 25)"
                value={form.lab.mid.obtained}
                onChange={e =>
                  setForm({
                    ...form,
                    lab: {
                      ...form.lab,
                      mid: { obtained: Number(e.target.value) }
                    }
                  })
                }
              />
              <input
                type="number"
                placeholder="Lab Final (out of 50)"
                value={form.lab.final.obtained}
                onChange={e =>
                  setForm({
                    ...form,
                    lab: {
                      ...form.lab,
                      final: { obtained: Number(e.target.value) }
                    }
                  })
                }
              />
            </div>
          )}

          <div className="detail-actions">
            <button className="secondary-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button
              className="primary-btn"
              disabled={saving}
              onClick={saveAssessment}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
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
          const assessment = assessments.find(
            a => a.course._id === course._id
          )

          return (
            <div
              key={course._id}
              className="course-row"
              onClick={() => openEditor(course)}
            >
              <div className="course-cell">
                <span className="cell-label">Course</span>
                <span className="cell-value">{course.courseName}</span>
              </div>

              <div className="course-cell">
                <span className="cell-label">Marks</span>
                <span className="cell-value">
                  {assessment ? assessment.finalMarks.toFixed(2) : "Enter"}
                </span>
              </div>

              <div className="course-cell">
                <span className="cell-label">Grade</span>
                <span className="cell-value">
                  {assessment ? assessment.grade : "—"}
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
