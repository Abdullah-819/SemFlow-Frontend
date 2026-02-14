import { useState, useRef, useEffect } from "react"

const DAY_LABELS = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri"
}

const slots = [
  { label: "1st", time: "8:30 – 9:55", key: "1st" },
  { label: "2nd", time: "9:55 – 11:20", key: "2nd" },
  { label: "3rd", time: "11:20 – 12:45", key: "3rd" },
  { label: "Break", time: "12:45 – 1:45", key: "Break" },
  { label: "4th", time: "1:45 – 3:05", key: "4th" },
  { label: "5th", time: "3:05 – 4:30", key: "5th" }
]

const SLOT_ORDER = { "1st": 0, "2nd": 1, "3rd": 2, "Break": 3, "4th": 4, "5th": 5 }

const getSlotSortKey = slotStr => {
  if (!slotStr) return 99
  const match = slotStr.match(/(1st|2nd|3rd|4th|5th|Break)/)
  return match ? SLOT_ORDER[match[1]] ?? 99 : 99
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
  const [selectedSlots, setSelectedSlots] = useState([])
  const [teacherFilter, setTeacherFilter] = useState("")
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setFilterMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const toggleSlot = key => {
    setSelectedSlots(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const clearFilters = () => {
    setSelectedSlots([])
    setTeacherFilter("")
  }

  const hasActiveFilters = selectedSlots.length > 0 || teacherFilter

  // When teacher selected: show ALL lectures by that teacher across ALL days
  // Otherwise: show selected day's timetable (filtered by slots if any)
  let lecturesRaw = []
  let viewMode = "day" // "day" | "teacher"

  if (teacherFilter) {
    viewMode = "teacher"
    lecturesRaw = timetable.flatMap(d =>
      d.lectures
        .filter(l => l.teacher === teacherFilter)
        .map(l => ({ ...l, day: d.day }))
    )
  } else {
    const dayData = timetable.find(d => d.day === selectedDay)
    lecturesRaw = (dayData?.lectures ?? []).map(l => ({ ...l, day: dayData.day }))
  }

  const lecturesFiltered = lecturesRaw.filter(lec => {
    if (selectedSlots.length === 0) return true
    return selectedSlots.some(sk => lec.slot && lec.slot.includes(sk))
  })

  const lecturesSorted = [...lecturesFiltered].sort((a, b) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    if (dayDiff !== 0) return dayDiff
    return getSlotSortKey(a.slot) - getSlotSortKey(b.slot)
  })

  const currentDayData = timetable.find(d => d.day === selectedDay)

  return (
    <div className="venues-page">
      <div className="venues-page-header">
        <h2 className="page-title">Venues</h2>
        <div className="venues-filter-wrap" ref={menuRef}>
          <button
            type="button"
            className={`venues-filter-btn ${filterMenuOpen ? "active" : ""} ${hasActiveFilters ? "has-filters" : ""}`}
            onClick={e => {
              e.stopPropagation()
              setFilterMenuOpen(prev => !prev)
            }}
            aria-expanded={filterMenuOpen}
            aria-haspopup="true"
          >
            <span>Filter & Sort</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {hasActiveFilters && <span className="filter-dot" />}
          </button>

          {filterMenuOpen && (
            <div className="venues-filter-menu">
              <div className="filter-section">
                <span className="filter-label">By Time Slot</span>
                <div className="filter-options filter-slot-options">
                  {slots.map(s => (
                    <label key={s.key} className="filter-option checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(s.key)}
                        onChange={() => toggleSlot(s.key)}
                      />
                      <span>{s.label} ({s.time})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <span className="filter-label">By Teacher</span>
                <select
                  className="filter-select"
                  value={teacherFilter}
                  onChange={e => setTeacherFilter(e.target.value)}
                >
                  <option value="">All teachers</option>
                  {allTeachers.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <small className="filter-hint">Shows all lectures across the week</small>
              </div>
              {hasActiveFilters && (
                <button type="button" className="filter-clear-btn" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="day-filter">
        {timetable.map(d => (
          <button
            key={d.day}
            className={`day-btn day-${d.day.toLowerCase()} ${selectedDay === d.day && !teacherFilter ? "active" : ""}`}
            onClick={() => setSelectedDay(d.day)}
            disabled={!!teacherFilter}
          >
            {DAY_LABELS[d.day]}
          </button>
        ))}
      </div>

      <div className="slot-filter">
        {slots.map(s => (
          <button
            key={s.key}
            type="button"
            className={`slot-btn ${selectedSlots.includes(s.key) ? "active" : ""} ${s.key === "Break" ? "slot-break" : ""}`}
            onClick={() => toggleSlot(s.key)}
          >
            <span className="slot-btn-label">{s.label}</span>
            <small className="slot-btn-time">{s.time}</small>
          </button>
        ))}
      </div>

      <div className={`day-header day-${viewMode === "teacher" ? "teacher-view" : selectedDay.toLowerCase()}`}>
        <h3>
          {viewMode === "teacher"
            ? `${teacherFilter} – All Lectures`
            : selectedDay}
        </h3>
        <span>
          {lecturesSorted.length} Lecture{lecturesSorted.length !== 1 ? "s" : ""}
          {hasActiveFilters && " (filtered)"}
        </span>
      </div>

      {lecturesSorted.length === 0 ? (
        <div className="holiday-card premium">
          {viewMode === "teacher" ? (
            <>No lectures found for this teacher</>
          ) : currentDayData?.lectures.length === 0 ? (
            <>
              🎉 Ajj koi lecture nahi mojain maro
              <small>FA24-BCS-4-E</small>
            </>
          ) : (
            <>No lectures match the selected filters</>
          )}
        </div>
      ) : (
        <div className="card-list premium">
          {lecturesSorted.map((lec, i) => (
            <div key={i} className="venue-card">
              {viewMode === "teacher" && (
                <div className="venue-card-day-badge">{DAY_LABELS[lec.day]}</div>
              )}
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
              <div className="venue-location">📍 {lec.venue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Venues
