import { Routes, Route } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"

import ProtectedRoute from "./components/ProtectedRoute"
import Spinner from "./components/Spinner"

import StudyLog from "./pages/StudyLog"
import Courses from "./pages/Courses"
import Assessments from "./pages/Assessments"
import Venues from "./pages/Venues"
import SemesterCalendar from "./pages/SemesterCalendar"
import About from "./pages/About"

function App() {
  const { loading } = useAuth()

  return (
    <>
      {loading && <Spinner />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Courses />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="venues" element={<Venues />} />
          <Route path="calendar" element={<SemesterCalendar />} />
          <Route path="about" element={<About />} />
          <Route path="study-log" element={<StudyLog />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
