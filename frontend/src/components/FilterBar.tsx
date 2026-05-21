import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string
    status: string
    source: string
    sort: string
  }) => void
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [sort, setSort] = useState('latest')

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        status,
        source,
        sort,
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [search, status, source, sort])

  const selectClass =
    'bg-white/[0.04] border border-white/10 text-white rounded-2xl px-4 py-3 outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all duration-300 backdrop-blur-xl'

  return (
    <div className="relative mb-10">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 blur-3xl rounded-[40px]"></div>

      <div className="relative rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-2xl p-5 shadow-[0_0_40px_rgba(139,92,246,0.08)]">

        <div className="flex flex-col xl:flex-row xl:items-center gap-4">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all duration-300"
            />

          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-gray-400">
              <SlidersHorizontal size={16} />
              <span className="text-sm">Filters</span>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={selectClass}
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={selectClass}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {(search || status || source) && (
              <button
                onClick={() => {
                  setSearch('')
                  setStatus('')
                  setSource('')
                  setSort('latest')
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <X size={16} />
                Clear
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}