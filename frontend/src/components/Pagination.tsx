interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex justify-between items-center mt-6">
      <span className="text-gray-400 text-sm">
        Showing {total === 0 ? 0 : from} to {to} of {total} results
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded disabled:opacity-40 hover:bg-gray-700 transition"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm rounded transition ${
              p === page ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded disabled:opacity-40 hover:bg-gray-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  )
}