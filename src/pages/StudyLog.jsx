import { useEffect, useState } from "react"
import api from "../api/axios.js"

const todayString = () => {
  const d = new Date()
  return d.toISOString().split("T")[0]
}

const normalizeArray = value => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return []
}

const StudyLog = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedDate, setSelectedDate] = useState(todayString())
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    topicStudied: "",
    topicNotStudied: "",
    quizOccurred: false,
    remarks: "",
    status: "Completed"
  })

  useEffect(() => {
    try {
      const cached = localStorage.getItem("semflow_courses")
      if (cached) {
        const parsed = JSON.parse(cached)
        const list = normalizeArray(parsed)
        setCourses(list)
        if (list.length > 0) setSelectedCourse(list[0]._id)
        return
      }
    } catch {}

    api.get("/api/courses").then(res => {
      const list = normalizeArray(res.data)
      setCourses(list)
      localStorage.setItem("semflow_courses", JSON.stringify(list))
      if (list.length > 0) setSelectedCourse(list[0]._id)
    })
  }, [])

  useEffect(() => {
    if (!selectedCourse) return

    const key = `semflow_studylog_${selectedCourse}_${selectedDate}`

    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const parsed = JSON.parse(cached)
        setLogs(Array.isArray(parsed) ? parsed : [])
        return
      }
    } catch {}

    setLoading(true)
    api
      .get(`/api/logs/course/${selectedCourse}`)
      .then(res => {
        const list = normalizeArray(res.data)
        const filtered = list.filter(l => l.date === selectedDate)

        const enriched = filtered.map(l => ({
          ...l,
          course: courses.find(c => c._id === l.course) || l.course
        }))

        setLogs(enriched)
        localStorage.setItem(key, JSON.stringify(enriched))
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [selectedCourse, selectedDate, courses])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!selectedCourse || !selectedDate) return

    const payload = { date: selectedDate, ...form }

    const res = await api.post(`/api/logs/course/${selectedCourse}`, payload)
    const log = res.data?.data
    if (!log) return

    const courseObj = courses.find(c => c._id === selectedCourse)

    const enrichedLog = {
      ...log,
      course: courseObj || log.course
    }

    const updated = [enrichedLog, ...logs]
    setLogs(updated)

    const key = `semflow_studylog_${selectedCourse}_${selectedDate}`
    localStorage.setItem(key, JSON.stringify(updated))

    setForm({
      topicStudied: "",
      topicNotStudied: "",
      quizOccurred: false,
      remarks: "",
      status: "Completed"
    })

    setShowForm(false)
  }

  const deleteLog = async id => {
    await api.delete(`/api/logs/${id}`)
    const updated = logs.filter(l => l._id !== id)
    setLogs(updated)

    const key = `semflow_studylog_${selectedCourse}_${selectedDate}`
    localStorage.setItem(key, JSON.stringify(updated))
  }

  return (
    <div className="studylog-page">
      <h2>Daily Study Log</h2>

      <div className="studylog-controls">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />

        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          {courses.map(c => (
            <option key={c._id} value={c._id}>
              {c.courseName}
            </option>
          ))}
        </select>
      </div>

      <button
        className="add-log-toggle"
        onClick={() => setShowForm(p => !p)}
      >
        {showForm ? "Cancel" : "Add Study Log"}
      </button>

      {showForm && (
        <form className="studylog-form" onSubmit={handleSubmit}>
          <input
            placeholder="Topic studied"
            value={form.topicStudied}
            onChange={e =>
              setForm({ ...form, topicStudied: e.target.value })
            }
          />

          <input
            placeholder="Topic not studied"
            value={form.topicNotStudied}
            onChange={e =>
              setForm({ ...form, topicNotStudied: e.target.value })
            }
          />

          <label>
            <input
              type="checkbox"
              checked={form.quizOccurred}
              onChange={e =>
                setForm({ ...form, quizOccurred: e.target.checked })
              }
            />
            Quiz today
          </label>

          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <textarea
            placeholder="Remarks"
            value={form.remarks}
            onChange={e => setForm({ ...form, remarks: e.target.value })}
          />

          <button type="submit">Add Log</button>
        </form>
      )}

      <div className="studylog-list">
        {loading && <p>Loading...</p>}

        {!loading && logs.length === 0 && (
          <p>No study logs for this day</p>
        )}

        {Array.isArray(logs) &&
          logs.map(log => (
            <div key={log._id} className="studylog-card">
              <h4>{log.course?.courseName || "Course"}</h4>
              <p>Studied: {log.topicStudied || "—"}</p>
              <p>Not studied: {log.topicNotStudied || "—"}</p>
              <p>Status: {log.status}</p>
              {log.quizOccurred && <span>Quiz</span>}
              <button onClick={() => deleteLog(log._id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default StudyLog
