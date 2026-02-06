import { createContext, useEffect, useState } from "react"
import { getToken, setToken, removeToken } from "../utils/storage"
import api from "../api/axios"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("semflow_user")
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [token, setAuthToken] = useState(() => getToken())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async credentials => {
    Object.keys(localStorage)
      .filter(k => k.startsWith("semflow_"))
      .forEach(k => localStorage.removeItem(k))

    setLoading(true)
    try {
      const res = await api.post("/api/auth/login", credentials)

      setToken(res.data.token)
      localStorage.setItem(
        "semflow_user",
        JSON.stringify(res.data.user)
      )

      setAuthToken(res.data.token)
      setUser(res.data.user)
    } finally {
      setLoading(false)
    }
  }

  const register = async formData => {
    setLoading(true)
    try {
      const res = await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setToken(res.data.token)
      localStorage.setItem(
        "semflow_user",
        JSON.stringify(res.data.user)
      )

      setAuthToken(res.data.token)
      setUser(res.data.user)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem("semflow_user")
    Object.keys(localStorage)
      .filter(k => k.startsWith("semflow_"))
      .forEach(k => localStorage.removeItem(k))
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
