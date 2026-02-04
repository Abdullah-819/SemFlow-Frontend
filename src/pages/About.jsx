const About = () => {
  return (
    <section className="section">
      <div className="about-card">
        <h2 className="about-title">About Me</h2>

        <p className="about-text">
          I’m Abdullah Imran, a Computer Science student working on real,
          semester-grade software projects with a strong focus on correctness,
          architecture, and long-term maintainability.
        </p>

        <p className="about-text">
          SemFlow is built as a practical solution to manage courses,
          assessments, and academic progress in a structured and reliable way,
          following real university grading systems.
        </p>

        <div className="about-divider" />

        <h3 className="about-subtitle">About SemFlow</h3>

        <p className="about-text">
          SemFlow is a MERN stack semester management system designed to track
          courses, assessments, GPA, and academic standing with backend-
          authoritative grading logic.
        </p>

        <div className="about-divider" />

        <h3 className="about-subtitle">Connect</h3>

        <ul className="about-links">
          <li>
            <a
              href="https://www.linkedin.com/in/abdullah-imran-835483327/"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Abdullah-819"
              target="_blank"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href="mailto:ranaabdullah228.ar1@gmail.com">
              Email
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default About
