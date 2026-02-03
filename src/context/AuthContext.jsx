import { createContext, useEffect, useState } from "react"
import api from "../api/axios"
import { setToken, getToken, removeToken } from "../utils/storage"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      setUser({ authenticated: true })
    }
    setLoading(false)
  }, [])

  const login = async data => {
    const res = await api.post("/auth/login", data)
    setToken(res.data.token)
    setUser({ authenticated: true })
  }

  const register = async data => {
    const res = await api.post("/auth/register", data)
    setToken(res.data.token)
    setUser({ authenticated: true })
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
