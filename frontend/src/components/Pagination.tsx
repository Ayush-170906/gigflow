import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  if (totalPages <= 1) {
    return (
      <div className="mt-8 flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl px-6 py-5">

        <p className="text-sm text-gray-400">
          Showing{' '}
          <span className="text-white font-medium">
            {total === 0 ? 0 : from}
          </span>{' '}
          to{' '}
          <span className="text-white font-medium">
            {to}
          </span>{' '}
          of{' '}
          <span className="text-violet-400 font-semibold">
            {total}
          </span>{' '}
          leads
        </p>

      </div>
    )
  }

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl px-6 py-5 shadow-[0_0_40px_rgba(139,92,246,0.06)]">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        {/* Left */}
        <div>

          <p className="text-sm text-gray-400">
            Showing{' '}
            <span className="text-white font-medium">
              {from}
            </span>{' '}
            to{' '}
            <span className="text-white font-medium">
              {to}
            </span>{' '}
            of{' '}
            <span className="text-violet-400 font-semibold">
              {total}
            </span>{' '}
            total leads
          </p>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Previous */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/[0.03]"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Pages */}
          <div className="flex items-center gap-2">

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (

              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-11 h-11 rounded-2xl font-medium transition-all duration-300
                ${
                  p === page
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 scale-105'
                    : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {p}
              </button>

            ))}

          </div>

          {/* Next */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/[0.03]"
          >
            Next
            <ChevronRight size={16} />
          </button>

        </div>

      </div>

    </div>
  )
}