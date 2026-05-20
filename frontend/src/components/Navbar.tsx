import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-blue-400 font-bold text-xl">GigFlow</span>
        <span className="text-gray-400 text-sm">Smart Leads Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">
          {user?.name}
          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
            user?.role === 'admin' 
              ? 'bg-purple-900 text-purple-300' 
              : 'bg-blue-900 text-blue-300'
          }`}>
            {user?.role}
          </span>
        </span>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}