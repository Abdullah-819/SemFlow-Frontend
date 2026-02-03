# SemFlow Frontend

SemFlow Frontend is a React (Vite) based web application for managing semester courses and tracking daily, subject-wise study progress.  
It integrates with a secure JWT-based backend deployed on Render.

This project is built as a **real semester-level full-stack application**, focusing on clean structure, clarity, and extensibility.

---

## 🚀 Tech Stack

- React
- Vite
- React Router v6
- Context API
- Axios
- Plain CSS (single global stylesheet)

---

## 🔗 Backend Integration

The frontend consumes a live backend API deployed on Render:

https://semflow-backend.onrender.com


Backend features include:
- JWT authentication
- Course management
- Daily study logs
- Global error handling
- MongoDB Atlas

The backend is considered **stable and final** for Phase-1.

---

## 📁 Folder Structure

src/
├── api/
│ └── axios.js
├── context/
│ └── AuthContext.jsx
├── hooks/
│ └── useAuth.js
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Dashboard.jsx
│ └── NotFound.jsx
├── components/
│ ├── ProtectedRoute.jsx
│ ├── Navbar.jsx
│ └── Loader.jsx
├── utils/
│ └── storage.js
├── App.jsx
├── main.jsx
└── index.css


---

## 🎨 Styling Rules

- All styling is handled **only in `src/index.css`**
- No component-level CSS files
- No CSS modules
- Minimal inline styles

This keeps the project simple and easy to maintain.

---

## 🔐 Authentication Flow

- User registers or logs in using roll number and password
- JWT token is stored in localStorage
- Token is attached automatically to API requests
- Protected routes are accessible only when authenticated

---

## 🧠 Project Goals

- Build a clean semester management system
- Track daily study activity per course
- Maintain clear separation of concerns
- Follow real-world full-stack practices
- Keep the system extensible for future features (GPA, analytics, etc.)

---

## 🛠️ Setup & Run Locally

```bash
npm install
npm run dev
Vite will start the app on:
http://localhost:5173
📌 Project Status

Backend: ✅ Completed & Deployed

Frontend: 🚧 In Progress

Phase-1 Scope: Completed

Future Enhancements: GPA, UI polish, mobile responsiveness

👨‍💻 Author
Abdullah Rana is the developer of this project
Developed as a semester project with a focus on clarity, correctness, and production-style architecture.
