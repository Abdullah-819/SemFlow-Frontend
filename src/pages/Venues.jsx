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

/* =========================
   SECTION TIMETABLES CORE
   ========================= */

const SECTION_TIMETABLES = {

"FA24-BCS-4-E": [
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
        subject: "Information Security",
        type: "Theory",
        slot: "5th Slot",
        time: "3:05 – 4:30",
        teacher: "Mr. Muhammad Umar",
        venue: "C1"
      }
    ]
  },

  {
    day: "Tuesday",
    lectures: []
  },

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
        subject: "Artificial Intelligence",
        type: "Theory",
        slot: "3rd Slot",
        time: "11:20 – 12:45",
        teacher: "Ms. Rimsha Rafiq",
        venue: "D1"
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
        slot: "4th–5th Slot",
        time: "1:45 – 4:30",
        teacher: "Ms. Rimsha Rafiq",
        venue: "CLab-2"
      }
    ]
  },

  {
    day: "Friday",
    lectures: [
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
],

"SP25-BSE-3-B": [
  {
    day: "Monday",
    lectures: [
      {
        subject: "Database Systems",
        type: "Theory",
        slot: "2nd Slot",
        time: "9:55 – 11:20",
        teacher: "Ms. Afia Afzaal",
        venue: "D8"
      },
      {
        subject: "Database Systems",
        type: "Lab",
        slot: "4th–5th Slot",
        time: "1:45 – 4:30",
        teacher: "Ms. Afia Afzaal",
        venue: "CLab-9"
      }
    ]
  },

  {
    day: "Tuesday",
    lectures: [
      {
        subject: "Software Engineering",
        type: "Theory",
        slot: "1st Slot",
        time: "8:30 – 9:55",
        teacher: "Ms. Abida Kausar",
        venue: "D2"
      },
      {
        subject: "Fundamentals of Digital Logic Design",
        type: "Lab",
        slot: "2nd–3rd Slot",
        time: "9:55 – 12:45",
        teacher: "Mr. Kashif",
        venue: "DLD Lab"
      },
      {
        subject: "Data Structures",
        type: "Theory",
        slot: "4th Slot",
        time: "1:45 – 3:05",
        teacher: "Dr. Muhammad Shoaib",
        venue: "C1.1"
      }
    ]
  },

  {
    day: "Wednesday",
    lectures: [
      {
        subject: "Calculus and Analytic Geometry",
        type: "Theory",
        slot: "1st Slot",
        time: "8:30 – 9:55",
        teacher: "Dr. Amar Rauf",
        venue: "D4"
      },
      {
        subject: "Data Structures",
        type: "Theory",
        slot: "2nd Slot",
        time: "9:55 – 11:20",
        teacher: "Dr. Muhammad Shoaib",
        venue: "C1.4"
      },
      {
        subject: "Software Engineering",
        type: "Theory",
        slot: "3rd Slot",
        time: "11:20 – 12:45",
        teacher: "Ms. Abida Kausar",
        venue: "W2"
      },
      {
        subject: "Database Systems",
        type: "Theory",
        slot: "4th Slot",
        time: "1:45 – 3:05",
        teacher: "Ms. Afia Afzaal",
        venue: "D4"
      },
      {
        subject: "Fundamentals of Digital Logic Design",
        type: "Theory",
        slot: "5th Slot",
        time: "3:05 – 4:30",
        teacher: "Mr. Khalid Majeed",
        venue: "D9"
      }
    ]
  },

  {
    day: "Thursday",
    lectures: [
      {
        subject: "Calculus and Analytic Geometry",
        type: "Theory",
        slot: "1st Slot",
        time: "8:30 – 9:55",
        teacher: "Dr. Amar Rauf",
        venue: "C2.5"
      },
      {
        subject: "Data Structures",
        type: "Lab",
        slot: "2nd–3rd Slot",
        time: "9:55 – 12:45",
        teacher: "Mr. Shehzad Ali",
        venue: "CLab-3"
      },
      {
        subject: "Fundamentals of Digital Logic Design",
        type: "Theory",
        slot: "4th Slot",
        time: "1:45 – 3:05",
        teacher: "Mr. Khalid Majeed",
        venue: "D9"
      }
    ]
  },

  {
    day: "Friday",
    lectures: []
  }
]}


const Venues = () => {

  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedSlots, setSelectedSlots] = useState([])
  const [teacherFilter, setTeacherFilter] = useState("")
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)

  const menuRef = useRef(null)

  const timetable = selectedSection ? SECTION_TIMETABLES[selectedSection] : []

  const allTeachers = [
    ...new Set(
      timetable.flatMap(d => d.lectures.map(l => l.teacher))
    )
  ].sort()

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

  let lecturesRaw = []
  let viewMode = "day"

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

  /* =========================
     SECTION SELECT SCREEN
     ========================= */

  if (!selectedSection) {
    return (
      <div className="venues-page">
        <h2 className="page-title">View Timetable</h2>

        <div className="section-selector">
          {Object.keys(SECTION_TIMETABLES).map(section => (
            <button
              key={section}
              className="section-btn"
              onClick={() => setSelectedSection(section)}
            >
              {section}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* =========================
     MAIN VENUES UI
     ========================= */

  const currentDayData = timetable.find(d => d.day === selectedDay)

  return (
    <div className="venues-page">

      <div className="venues-page-header">
        <h2 className="page-title">Venues</h2>

        <button
          className="back-section-btn"
          onClick={() => {
            setSelectedSection(null)
            clearFilters()
          }}
        >
          Change Section
        </button>

        <div className="venues-filter-wrap" ref={menuRef}>
          <button
            type="button"
            className={`venues-filter-btn ${filterMenuOpen ? "active" : ""} ${hasActiveFilters ? "has-filters" : ""}`}
            onClick={e => {
              e.stopPropagation()
              setFilterMenuOpen(prev => !prev)
            }}
          >
            Filter & Sort
          </button>

          {filterMenuOpen && (
            <div className="venues-filter-menu">

              <div className="filter-section">
                <span className="filter-label">By Time Slot</span>
                <div className="filter-options">
                  {slots.map(s => (
                    <label key={s.key}>
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
                  value={teacherFilter}
                  onChange={e => setTeacherFilter(e.target.value)}
                >
                  <option value="">All teachers</option>
                  {allTeachers.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters}>
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
            className={selectedDay === d.day ? "active" : ""}
            onClick={() => setSelectedDay(d.day)}
            disabled={!!teacherFilter}
          >
            {DAY_LABELS[d.day]}
          </button>
        ))}
      </div>

      {lecturesSorted.length === 0 ? (
        <div className="holiday-card premium">
          No lectures available
          <small>{selectedSection}</small>
        </div>
      ) : (
        <div className="card-list premium">
          {lecturesSorted.map((lec, i) => (
            <div key={i} className="venue-card">
              <div className="venue-card-header">
                <h4>{lec.subject}</h4>
                <span>{lec.type}</span>
              </div>
              <div>{lec.slot}</div>
              <div>{lec.time}</div>
              <div>{lec.teacher}</div>
              <div>📍 {lec.venue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Venues
