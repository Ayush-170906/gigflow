import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2.5 focus:outline-none focus:border-blue-500 text-sm"

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-blue-400 font-bold text-3xl">GigFlow</h1>
          <p className="text-gray-400 mt-2">Smart Leads Dashboard</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <h2 className="text-white font-semibold text-xl mb-6">Sign In</h2>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className={inputClass}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-gray-400 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}