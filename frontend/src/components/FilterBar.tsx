import { useEffect, useState } from 'react'

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
      onFilterChange({ search, status, source, sort })
    }, 500)
    return () => clearTimeout(timer)
  }, [search, status, source, sort])

  const inputClass = "bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-blue-500"

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={`${inputClass} w-64`}
      />
      <select value={status} onChange={e => setStatus(e.target.value)} className={inputClass}>
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>
      <select value={source} onChange={e => setSource(e.target.value)} className={inputClass}>
        <option value="">All Sources</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </select>
      <select value={sort} onChange={e => setSort(e.target.value)} className={inputClass}>
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
      {(search || status || source) && (
        <button
          onClick={() => { setSearch(''); setStatus(''); setSource(''); setSort('latest') }}
          className="text-sm text-red-400 hover:text-red-300 px-2"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}