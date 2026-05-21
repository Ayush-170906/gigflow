import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-violet-300 to-fuchsia-500 bg-clip-text text-transparent">
              GigFlow
            </h1>

            <div className="absolute -inset-2 bg-violet-500/10 blur-2xl rounded-full"></div>
          </div>

          <div className="hidden md:block h-6 w-px bg-white/10"></div>

          <p className="hidden md:block text-gray-500 text-sm tracking-wide">
            AI Powered Smart Leads Dashboard
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10">

            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>

            <div>
              <p className="text-white text-sm font-semibold">
                {user?.name}
              </p>

              <p className="text-xs text-violet-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-300 hover:scale-[1.03]"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </div>
    </header>
  )
}