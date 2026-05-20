import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

interface RegisterForm {
  name: string
  email: string
  password: string
  role: UserRole
}

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>()

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')
    try {
      await registerUser(data.name, data.email, data.password, data.role)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <h2 className="text-white font-semibold text-xl mb-6">Register</h2>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className={inputClass}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' }
                })}
                type="password"
                className={inputClass}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Role</label>
              <select {...register('role')} className={inputClass}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}