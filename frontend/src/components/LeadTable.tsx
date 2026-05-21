import { Pencil, Trash2 } from 'lucide-react'
import { Lead } from '../types'

const statusStyles: Record<string, string> = {
  New: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  Contacted: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  Qualified: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  Lost: 'bg-red-500/15 text-red-400 border border-red-500/20',
}

interface LeadTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  isAdmin: boolean
  loading: boolean
}

export default function LeadTable({
  leads,
  onEdit,
  onDelete,
  isAdmin,
  loading,
}: LeadTableProps) {

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-16 text-center">
        <div className="text-6xl mb-6">📊</div>

        <h2 className="text-2xl font-bold text-white mb-2">
          No Leads Found
        </h2>

        <p className="text-gray-400">
          Add new leads to start tracking your CRM pipeline.
        </p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(139,92,246,0.08)]">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">

              <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </th>

              <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </th>

              <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Source
              </th>

              <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Created
              </th>

              <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {leads.map((lead, index) => (
              <tr
                key={lead._id}
                className={`group transition-all duration-300 hover:bg-white/[0.03]
                ${index !== leads.length - 1 ? 'border-b border-white/5' : ''}`}
              >

                {/* NAME */}
                <td className="px-8 py-6">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-white font-semibold text-[15px]">
                        {lead.name}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Lead Prospect
                      </p>
                    </div>

                  </div>

                </td>

                {/* EMAIL */}
                <td className="px-8 py-6 text-gray-300 text-sm">
                  {lead.email}
                </td>

                {/* STATUS */}
                <td className="px-8 py-6">

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-semibold ${statusStyles[lead.status]}`}
                  >
                    {lead.status}
                  </span>

                </td>

                {/* SOURCE */}
                <td className="px-8 py-6">

                  <span className="text-gray-300 text-sm bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl">
                    {lead.source}
                  </span>

                </td>

                {/* DATE */}
                <td className="px-8 py-6 text-gray-400 text-sm">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                </td>

                {/* ACTIONS */}
                <td className="px-8 py-6">

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() => onEdit(lead)}
                      className="group/edit flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="group/delete flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <Trash2 size={15} />
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
    </div>
  )
}