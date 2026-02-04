import { createContext, useEffect, useState } from "react"
import api from "../api/axios"
import { getToken, setToken, removeToken } from "../utils/storage"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setAuthToken] = useState(getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async credentials => {
    const res = await api.post("/api/auth/login", credentials)
    setToken(res.data.token)
    setAuthToken(res.data.token)
    setUser(res.data.user)
  }

  const register = async data => {
    const res = await api.post("/api/auth/register", data)
    setToken(res.data.token)
    setAuthToken(res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    removeToken()
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
