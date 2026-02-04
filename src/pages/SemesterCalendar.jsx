const calendarEvents = [
  {
    title: "Registration Week / Leave of Absence / Re-admission",
    date: "Mon, Jan 26 – Fri, Jan 30, 2026",
    type: "registration"
  },
  {
    title: "Commencement of Classes",
    date: "Mon, Feb 02, 2026",
    type: "academic"
  },
  {
    title: "Last Date for Drop of Course(s)",
    date: "Fri, Feb 27, 2026",
    type: "deadline"
  },
  {
    title: "Last Date for Withdrawal of Course(s)",
    date: "Fri, Mar 27, 2026",
    type: "deadline"
  },
  {
    title: "Mid-Term Examination",
    date: "Mon, Apr 06, 2026",
    type: "exam"
  },
  {
    title: "Students’ Week",
    date: "Mon, Apr 13 – Sat, Apr 18, 2026",
    type: "academic"
  },
  {
    title: "Last Date for Submission of Mid-Term Examination Result",
    date: "Fri, Apr 17, 2026",
    type: "deadline"
  },
  {
    title: "Last Date for Submission of Assignments & Quizzes Results",
    date: "Fri, May 22, 2026",
    type: "deadline"
  },
  {
    title: "Last Date for Submission of MS Thesis",
    date: "Fri, May 22, 2026",
    type: "research"
  },
  {
    title: "Last Day of Classes / Attendance Lock",
    date: "Fri, May 22, 2026",
    type: "academic"
  },
  {
    title: "Availability of Terminal Examination Admit Card (After 6:00 PM)",
    date: "Fri, May 22, 2026",
    type: "academic"
  },
  {
    title: "Start Date of Terminal Examination",
    date: "Wed, Jun 03, 2026",
    type: "exam"
  },
  {
    title: "Declaration of Results",
    date: "Mon, Jul 06, 2026",
    type: "result"
  },
  {
    title: "Final Submission of Discrepancy-Free PhD Scholar File",
    date: "One month before PhD thesis submission due date",
    type: "research"
  },
  {
    title: "Submission of PhD Thesis",
    date: "One week before commencement of Fall 2026 semester",
    type: "research"
  }
];

export default function SemesterCalendar() {
  return (
    <div className="page">
      <h2 className="page-title">Semester Calendar</h2>

      <div className="calendar-table">
        {calendarEvents.map((event, index) => (
          <div key={index} className={`calendar-row ${event.type}`}>
            <div className="calendar-date">{event.date}</div>
            <div className="calendar-title">{event.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
