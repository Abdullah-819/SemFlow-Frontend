import { createContext, useEffect, useState } from "react"
import { getToken, setToken, removeToken } from "../utils/storage"
import api from "../api/axios"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("semflow_user"))
  )
  const [token, setAuthToken] = useState(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async credentials => {
    const res = await api.post("/api/auth/login", credentials)

    setToken(res.data.token)
    localStorage.setItem(
      "semflow_user",
      JSON.stringify(res.data.user)
    )

    setAuthToken(res.data.token)
    setUser(res.data.user)
  }

  const register = async data => {
    const res = await api.post("/api/auth/register", data)

    setToken(res.data.token)
    localStorage.setItem(
      "semflow_user",
      JSON.stringify(res.data.user)
    )

    setAuthToken(res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem("semflow_user")
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
