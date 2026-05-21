import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react'

import api from '../api/axios'

import {
  User,
  ApiResponse,
  AuthDataPayload,
  UserRole,
} from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean

  login: (
    email: string,
    password: string
  ) => Promise<void>

  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>

  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export const AuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null)

  const [token, setToken] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)

  // Restore Session
  useEffect(() => {

    const initializeAuth = async () => {

      try {

        const storedToken =
          localStorage.getItem('token')

        const storedUser =
          localStorage.getItem('user')

        if (storedToken && storedUser) {

          setToken(storedToken)

          setUser(JSON.parse(storedUser))

          // Optional small delay for smoother loader UX
          await new Promise((resolve) =>
            setTimeout(resolve, 700)
          )
        }

      } catch (error) {

        console.error(
          'Failed to restore auth session:',
          error
        )

        localStorage.removeItem('token')
        localStorage.removeItem('user')

      } finally {

        setLoading(false)

      }
    }

    initializeAuth()

  }, [])

  // LOGIN
  const login = async (
    email: string,
    password: string
  ): Promise<void> => {

    try {

      const response =
        await api.post<
          ApiResponse<AuthDataPayload>
        >('/auth/login', {
          email,
          password,
        })

      const {
        user: loggedInUser,
        token: jwtToken,
      } = response.data.data

      setToken(jwtToken)

      setUser(loggedInUser)

      localStorage.setItem(
        'token',
        jwtToken
      )

      localStorage.setItem(
        'user',
        JSON.stringify(loggedInUser)
      )

    } catch (error: any) {

      const errMsg =
        error.response?.data?.message ||
        'Login failed'

      throw new Error(errMsg)

    }
  }

  // REGISTER
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {

    try {

      const response =
        await api.post<
          ApiResponse<AuthDataPayload>
        >('/auth/register', {
          name,
          email,
          password,
          role,
        })

      const {
        user: registeredUser,
        token: jwtToken,
      } = response.data.data

      setToken(jwtToken)

      setUser(registeredUser)

      localStorage.setItem(
        'token',
        jwtToken
      )

      localStorage.setItem(
        'user',
        JSON.stringify(registeredUser)
      )

    } catch (error: any) {

      const errMsg =
        error.response?.data?.message ||
        'Registration failed'

      throw new Error(errMsg)

    }
  }

  // LOGOUT
  const logout = () => {

    setToken(null)

    setUser(null)

    localStorage.removeItem('token')

    localStorage.removeItem('user')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}

export default AuthContext