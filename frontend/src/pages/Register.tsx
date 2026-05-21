import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>()

  const onSubmit = async (data: RegisterForm) => {

    setLoading(true)

    setError('')

    try {

      await registerUser(
        data.name,
        data.email,
        data.password,
        data.role
      )

      navigate('/dashboard')

    } catch (err: any) {

      setError(
        err.message || 'Registration failed'
      )

    } finally {

      setLoading(false)

    }
  }

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-black/60'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">

      {/* Glow Effects */}
      <div className="absolute top-[-140px] left-[-140px] w-[340px] h-[340px] rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="absolute bottom-[-140px] right-[-140px] w-[340px] h-[340px] rounded-full bg-blue-600/20 blur-[120px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >

        {/* Brand */}
        <div className="text-center mb-10">

          <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-white via-violet-300 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]">
            GigFlow
          </h1>

          <p className="mt-4 text-lg text-gray-500">
            Create your AI CRM account
          </p>

        </div>

        {/* Card */}
        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.12)]">

          <h2 className="text-3xl font-bold text-white mb-8">
            Create Account
          </h2>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Full Name
              </label>

              <input
                {...register('name', {
                  required: 'Name is required',
                })}
                className={inputClass}
                placeholder="John Doe"
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}

            </div>

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Email
              </label>

              <input
                {...register('email', {
                  required: 'Email is required',
                })}
                type="email"
                className={inputClass}
                placeholder="you@example.com"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Password
              </label>

              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Minimum 6 characters',
                  },
                })}
                type="password"
                className={inputClass}
                placeholder="••••••••"
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Role */}
            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Role
              </label>

              <select
                {...register('role')}
                className={inputClass}
              >
                <option
                  className="bg-black text-white"
                  value="sales"
                >
                  Sales User
                </option>

                <option
                  className="bg-black text-white"
                  value="admin"
                >
                  Admin
                </option>
              </select>

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 hover:scale-[1.02] hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">

            Already have an account?{' '}

            <Link
              to="/login"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Sign In
            </Link>

          </p>

        </div>

      </motion.div>

    </div>
  )
}