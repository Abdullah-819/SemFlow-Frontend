import { useEffect, useState } from "react"
import api from "../api/axios"

const normalizeArray = (arr, length, defaults) => {
  const safe = Array.isArray(arr) ? [...arr] : []
  while (safe.length < length) safe.push({ ...defaults })
  return safe.slice(0, length)
}

const fixedTheoryAssignments = normalizeArray([], 4, { obtained: "", total: 10 })
const fixedTheoryQuizzes = normalizeArray([], 4, { obtained: "", total: 5 })
const fixedLabAssignments = normalizeArray([], 4, { obtained: "", total: 10 })

const emptyTheory = {
  assignments: fixedTheoryAssignments,
  quizzes: fixedTheoryQuizzes,
  mid: { obtained: "" },
  final: { obtained: "" }
}

const emptyLab = {
  assignments: fixedLabAssignments,
  mid: { obtained: "" },
  final: { obtained: "" }
}

const Assessments = () => {
  const [courses, setCourses] = useState([])
  const [assessments, setAssessments] = useState([])
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ theory: emptyTheory, lab: null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token")
        const cached = localStorage.getItem("semflow_assessments")

        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed.token === token) setAssessments(parsed.data)
        }

        const [cRes, aRes] = await Promise.all([
          api.get("/api/courses"),
          api.get("/api/assessments")
        ])

        setCourses(cRes.data)
        setAssessments(aRes.data)

        localStorage.setItem(
          "semflow_assessments",
          JSON.stringify({ token, data: aRes.data })
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const openEditor = course => {
    const existing = assessments.find(
  a => a.course && a.course._id === course._id
)


    setSelected(course)

    if (existing) {
      setForm({
        theory: {
          assignments: fixedTheoryAssignments.map((a, i) => ({
            obtained: existing.theory?.assignments?.[i]?.obtained || "",
            total: 10
          })),
          quizzes: fixedTheoryQuizzes.map((q, i) => ({
            obtained: existing.theory?.quizzes?.[i]?.obtained || "",
            total: 5
          })),
          mid: existing.theory?.mid || { obtained: "" },
          final: existing.theory?.final || { obtained: "" }
        },
        lab: course.hasLab
          ? {
              assignments: fixedLabAssignments.map((a, i) => ({
                obtained: existing.lab?.assignments?.[i]?.obtained || "",
                total: 10
              })),
              mid: existing.lab?.mid || { obtained: "" },
              final: existing.lab?.final || { obtained: "" }
            }
          : null
      })
    } else {
      setForm({
        theory: emptyTheory,
        lab: course.hasLab ? emptyLab : null
      })
    }

    setEditing(true)
  }

  const updateArray = (section, field, index, value) => {
    const updated = [...form[section][field]]
    updated[index] = { ...updated[index], obtained: value }
    setForm({
      ...form,
      [section]: { ...form[section], [field]: updated }
    })
  }

  const saveAssessment = async () => {
    if (!selected) return

    setSaving(true)

    const payload = {
      courseId: selected._id,
      semester: "Fall 2025",
      theory: form.theory,
      lab: selected.hasLab ? form.lab : undefined
    }

    const res = await api.post("/api/assessments", payload)

    const updated = assessments.filter(
  a => a.course && a.course._id !== selected._id
)

    updated.push(res.data)

    setAssessments(updated)

    localStorage.setItem(
      "semflow_assessments",
      JSON.stringify({
        token: localStorage.getItem("token"),
        data: updated
      })
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
          <h2>{selected.courseName}</h2>

          <div className="detail-block">
            <h4>Theory Assignments</h4>
            <div className="marks-grid">
              {form.theory.assignments.map((a, i) => (
                <div key={i} className="marks-input">
                  <input
                    type="number"
                    placeholder={`A${i + 1}`}
                    value={a.obtained}
                    onChange={e =>
                      updateArray("theory", "assignments", i, e.target.value)
                    }
                  />
                  <input type="number" value={10} disabled />
                </div>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <h4>Theory Quizzes</h4>
            <div className="marks-grid">
              {form.theory.quizzes.map((q, i) => (
                <div key={i} className="marks-input">
                  <input
                    type="number"
                    placeholder={`Q${i + 1}`}
                    value={q.obtained}
                    onChange={e =>
                      updateArray("theory", "quizzes", i, e.target.value)
                    }
                  />
                  <input type="number" value={5} disabled />
                </div>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <h4>Theory Exams</h4>
            <input
              type="number"
              placeholder="Mid (out of 25)"
              value={form.theory.mid.obtained}
              onChange={e =>
                setForm({
                  ...form,
                  theory: {
                    ...form.theory,
                    mid: { obtained: e.target.value }
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
                    final: { obtained: e.target.value }
                  }
                })
              }
            />
          </div>

          {selected.hasLab && form.lab && (
            <div className="detail-block">
              <h4>Lab</h4>
              <div className="marks-grid">
                {form.lab.assignments.map((a, i) => (
                  <div key={i} className="marks-input">
                    <input
                      type="number"
                      placeholder={`Lab A${i + 1}`}
                      value={a.obtained}
                      onChange={e =>
                        updateArray("lab", "assignments", i, e.target.value)
                      }
                    />
                    <input type="number" value={10} disabled />
                  </div>
                ))}
              </div>

              <input
                type="number"
                placeholder="Lab Mid (out of 25)"
                value={form.lab.mid.obtained}
                onChange={e =>
                  setForm({
                    ...form,
                    lab: {
                      ...form.lab,
                      mid: { obtained: e.target.value }
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
                      final: { obtained: e.target.value }
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
            <button className="primary-btn" onClick={saveAssessment} disabled={saving}>
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
  a => a.course && a.course._id === course._id
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
                  {assessment && typeof assessment.finalMarks === "number"
  ? assessment.finalMarks.toFixed(2)
  : "Enter"}

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
