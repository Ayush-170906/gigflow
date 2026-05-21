import React from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {

  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">

        {/* Background Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-blue-600/20 blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Loader Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl px-12 py-10 shadow-[0_0_60px_rgba(139,92,246,0.10)]"
        >

          {/* Spinner */}
          <div className="relative mb-6">

            <div className="w-16 h-16 rounded-full border-4 border-violet-500/20"></div>

            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"></div>

          </div>

          {/* Brand */}
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-violet-300 to-fuchsia-500 bg-clip-text text-transparent">
            GigFlow
          </h1>

          {/* Text */}
          <p className="mt-4 text-sm tracking-wide text-gray-400 animate-pulse">
            Restoring secure session...
          </p>

        </motion.div>

      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute