import { useState } from "react";

const slots = [
  { label: "1st Slot", time: "8:30 – 9:55" },
  { label: "2nd Slot", time: "9:55 – 11:20" },
  { label: "3rd Slot", time: "11:20 – 12:45" },
  { label: "Break", time: "12:45 – 1:45" },
  { label: "4th Slot", time: "1:45 – 3:05" },
  { label: "5th Slot", time: "3:05 – 4:30" }
];

const timetable = [
  {
    day: "Monday",
    lectures: [
      {
        subject: "Computer Networks",
        type: "Lab",
        slot: "1st–3rd Slot",
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
];

export default function Venues() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const currentDay = timetable.find(d => d.day === selectedDay);

  return (
    <div className="page">
      <h2 className="page-title">Venues</h2>

      <div className="day-filter">
        {timetable.map(d => (
          <button
            key={d.day}
            className={selectedDay === d.day ? "day-btn active" : "day-btn"}
            onClick={() => setSelectedDay(d.day)}
          >
            {d.day}
          </button>
        ))}
      </div>

      {currentDay.lectures.length === 0 ? (
        <div className="holiday-card">
          Tuesday is a holiday for FA24-BCS-4-E 📍
        </div>
      ) : (
        <div className="card-list">
          {currentDay.lectures.map((lec, i) => (
            <div key={i} className="card">
              <div className="card-title">
                {lec.subject} <span className="badge">{lec.type}</span>
              </div>
              <div className="card-row">{lec.slot} · {lec.time}</div>
              <div className="card-row">{lec.teacher}</div>
              <div className="card-row venue">{lec.venue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
