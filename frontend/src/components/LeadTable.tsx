import { Lead } from '../types'

const statusColors: Record<string, string> = {
  New: 'bg-blue-900 text-blue-300',
  Contacted: 'bg-yellow-900 text-yellow-300',
  Qualified: 'bg-green-900 text-green-300',
  Lost: 'bg-red-900 text-red-300',
}

interface LeadTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  isAdmin: boolean
  loading: boolean
}

export default function LeadTable({ leads, onEdit, onDelete, isAdmin, loading }: LeadTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm mt-1">Try adjusting your filters or add a new lead</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Source</th>
            <th className="px-4 py-3 text-left">Created At</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {leads.map(lead => (
            <tr key={lead._id} className="bg-gray-900 hover:bg-gray-800 transition">
              <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
              <td className="px-4 py-3 text-gray-300">{lead.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-300">{lead.source}</td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString('en-IN')}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}