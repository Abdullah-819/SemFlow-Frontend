import { useState, useEffect, useRef } from "react"

const slots = [
  { label: "1st Slot", time: "8:30 – 9:55" },
  { label: "2nd Slot", time: "9:55 – 11:20" },
  { label: "3rd Slot", time: "11:20 – 12:45" },
  { label: "Break", time: "12:45 – 1:45" },
  { label: "4th Slot", time: "1:45 – 3:05" },
  { label: "5th Slot", time: "3:05 – 4:30" }
]

const slotOrderMap = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 5 }
const getSlotOrder = (slotStr) => {
  const m = slotStr.match(/(\d+)(?:st|nd|rd|th)/)
  return m ? (slotOrderMap[+m[1]] ?? 99) : 99
}

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const dayAccents = {
  Monday: "day-monday",
  Tuesday: "day-tuesday",
  Wednesday: "day-wednesday",
  Thursday: "day-thursday",
  Friday: "day-friday"
}

const timetable = [
  {
    day: "Monday",
    lectures: [
      {
        subject: "Computer Networks",
        type: "Lab",
        slot: "2nd–3rd Slot",
        time: "9:55 – 12:45",
        teacher: "Mr. Muhammad Usman Nasir",
        venue: "CLab-11"
      },
      {
        subject: "Artificial Intelligence",
        type: "Theory",
        slot: "4th Slot",
        time: "1:45 – 3:05",
        teacher: "Ms. Rimsha Rafiq",
        venue: "C2.4"
      }
    ]
  },
  { day: "Tuesday", lectures: [] },
  {
    day: "Wednesday",
    lectures: [
      {
        subject: "Computer Networks",
        type: "Theory",
        slot: "2nd Slot",
        time: "9:55 – 11:20",
        teacher: "Mr. Muhammad Usman Nasir",
        venue: "D9"
      },
      {
        subject: "Multivariable Calculus",
        type: "Theory",
        slot: "4th Slot",
        time: "1:45 – 3:05",
        teacher: "Dr. Asma",
        venue: "C1.3"
      },
      {
        subject: "Information Security",
        type: "Theory",
        slot: "5th Slot",
        time: "3:05 – 4:30",
        teacher: "Mr. Muhammad Umar",
        venue: "C1.1"
      }
    ]
  },
  {
    day: "Thursday",
    lectures: [
      {
        subject: "Information Security",
        type: "Lab",
        slot: "1st–2nd Slot",
        time: "8:30 – 11:20",
        teacher: "Ms. Nusra Rehman",
        venue: "CLab-9"
      },
      {
        subject: "Multivariable Calculus",
        type: "Theory",
        slot: "3rd Slot",
        time: "11:20 – 12:45",
        teacher: "Dr. Asma",
        venue: "B7"
      },
      {
        subject: "Artificial Intelligence",
        type: "Lab",
        slot: "4th Slot",
        time: "1:45 – 3:05",
        teacher: "Ms. Rimsha Rafiq",
        venue: "CLab-2"
      }
    ]
  },
  {
    day: "Friday",
    lectures: [
      {
        subject: "Information Security",
        type: "Theory",
        slot: "1st Slot",
        time: "8:30 – 9:55",
        teacher: "Mr. Muhammad Umar",
        venue: "C1.3"
      },
      {
        subject: "Artificial Intelligence",
        type: "Theory",
        slot: "2nd Slot",
        time: "9:55 – 11:20",
        teacher: "Ms. Rimsha Rafiq",
        venue: "C4"
      },
      {
        subject: "Computer Networks",
        type: "Theory",
        slot: "3rd Slot",
        time: "11:20 – 12:45",
        teacher: "Mr. Muhammad Usman Nasir",
        venue: "D1"
      }
    ]
  }
]

const allTeachers = [...new Set(timetable.flatMap(d => d.lectures.map(l => l.teacher)))].sort()

const Venues = () => {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [daySort, setDaySort] = useState("mon-fri")
  const [timeSort, setTimeSort] = useState("earliest")
  const [teacherFilter, setTeacherFilter] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleTeacher = (t) => {
    setTeacherFilter(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const sortedDays = [...timetable].sort((a, b) => {
    if (daySort === "mon-fri")
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    if (daySort === "fri-mon")
      return dayOrder.indexOf(b.day) - dayOrder.indexOf(a.day)
    if (daySort === "most")
      return b.lectures.length - a.lectures.length
    return a.lectures.length - b.lectures.length
  })

  const currentDay = timetable.find(d => d.day === selectedDay)
  const filteredLectures = (currentDay?.lectures ?? [])
    .filter(l => teacherFilter.length === 0 || teacherFilter.includes(l.teacher))
  const sortedLectures = [...filteredLectures].sort((a, b) => {
    const oa = getSlotOrder(a.slot)
    const ob = getSlotOrder(b.slot)
    return timeSort === "earliest" ? oa - ob : ob - oa
  })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="venues-page">
      <div className="venues-page-header">
        <h2 className="page-title">Venues</h2>
        <div className="venues-filter-wrap" ref={menuRef}>
          <button
            type="button"
            className={`venues-filter-btn ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span>Filter & Sort</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {menuOpen && (
            <div className="venues-filter-menu">
              <div className="filter-section">
                <span className="filter-label">Day order</span>
                <div className="filter-options">
                  {[
                    { id: "mon-fri", label: "Mon → Fri" },
                    { id: "fri-mon", label: "Fri → Mon" },
                    { id: "most", label: "Most lectures first" },
                    { id: "least", label: "Least lectures first" }
                  ].map(opt => (
                    <label key={opt.id} className="filter-option">
                      <input
                        type="radio"
                        name="daySort"
                        checked={daySort === opt.id}
                        onChange={() => setDaySort(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <span className="filter-label">Time slots</span>
                <div className="filter-options">
                  {[
                    { id: "earliest", label: "Earliest first" },
                    { id: "latest", label: "Latest first" }
                  ].map(opt => (
                    <label key={opt.id} className="filter-option">
                      <input
                        type="radio"
                        name="timeSort"
                        checked={timeSort === opt.id}
                        onChange={() => setTimeSort(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <span className="filter-label">Teachers</span>
                <div className="filter-options filter-teachers">
                  {allTeachers.map(t => (
                    <label key={t} className="filter-option checkbox">
                      <input
                        type="checkbox"
                        checked={teacherFilter.includes(t)}
                        onChange={() => toggleTeacher(t)}
                      />
                      <span>{t.replace(/^(Mr\.|Ms\.|Dr\.)\s*/, "")}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="day-filter">
        {sortedDays.map(d => (
          <button
            key={d.day}
            className={`day-btn ${dayAccents[d.day] || ""} ${selectedDay === d.day ? "active" : ""}`}
            onClick={() => setSelectedDay(d.day)}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div className="slot-legend premium">
        {slots.map(s => (
          <div key={s.label} className="slot-pill">
            <span>{s.label}</span>
            <small>{s.time}</small>
          </div>
        ))}
      </div>

      <div className={`day-header ${dayAccents[selectedDay] || ""}`}>
        <h3>{selectedDay}</h3>
        <span>{sortedLectures.length} Lectures</span>
      </div>

      {currentDay.lectures.length === 0 ? (
        <div className="holiday-card premium">
          🎉 Ajj koi lecture nahi mojain maro
          <small>FA24-BCS-4-E</small>
        </div>
      ) : sortedLectures.length === 0 ? (
        <div className="holiday-card premium filter-empty">
          No lectures match the selected teachers
        </div>
      ) : (
        <div className="card-list premium">
          {sortedLectures.map((lec, i) => (
            <div key={i} className="venue-card">
              <div className="venue-card-header">
                <h4>{lec.subject}</h4>
                <span className={`badge ${lec.type.toLowerCase()}`}>
                  {lec.type}
                </span>
              </div>

              <div className="venue-meta">
                <span>{lec.slot}</span>
                <span>{lec.time}</span>
              </div>

              <div className="venue-teacher">{lec.teacher}</div>

              <div className="venue-location">
                📍 {lec.venue}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Venues
