import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  UserCheck,
  CircleDollarSign,
  Plus,
  Download,
} from 'lucide-react'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
} from 'recharts'

import Layout from '../components/Layout'
import LeadTable from '../components/LeadTable'
import LeadForm, { LeadFormData } from '../components/LeadForm'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Lead } from '../types'

interface Filters {
  search: string
  status: string
  source: string
  sort: string
}

const COLORS = ['#8B5CF6', '#6366F1', '#06B6D4', '#10B981']

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    source: '',
    sort: 'latest',
  })

  const limit = 10

  const fetchLeads = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      params.append('page', String(page))
      params.append('limit', String(limit))

      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.source) params.append('source', filters.source)
      if (filters.sort) params.append('sort', filters.sort)

      const res = await api.get(`/leads?${params.toString()}`)

      setLeads(res.data.data.leads)
      setTotalPages(res.data.data.pagination.totalPages)
      setTotal(res.data.data.pagination.total)
    } catch (err) {
      console.error(err)
      setError('Failed to load leads.')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleCreate = async (data: LeadFormData) => {
    setFormLoading(true)

    try {
      await api.post('/leads', data)
      setShowForm(false)
      fetchLeads()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Create failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: LeadFormData) => {
    if (!editingLead) return

    setFormLoading(true)

    try {
      await api.put(`/leads/${editingLead._id}`, data)
      setEditingLead(null)
      setShowForm(false)
      fetchLeads()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return

    try {
      await api.delete(`/leads/${id}`)
      fetchLeads()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get('/leads/export', {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', 'leads.csv')

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed')
    }
  }

  const pieData = [
    {
      name: 'New',
      value: leads.filter((l: any) => l.status === 'New').length,
    },
    {
      name: 'Contacted',
      value: leads.filter((l: any) => l.status === 'Contacted').length,
    },
    {
      name: 'Qualified',
      value: leads.filter((l: any) => l.status === 'Qualified').length,
    },
    {
      name: 'Converted',
      value: leads.filter((l: any) => l.status === 'Converted').length,
    },
  ]

  const growthData = [
    { month: 'Jan', leads: 12 },
    { month: 'Feb', leads: 22 },
    { month: 'Mar', leads: 35 },
    { month: 'Apr', leads: 48 },
    { month: 'May', leads: total || 60 },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white relative overflow-hidden px-8 py-8">

        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full"></div>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12"
        >
          <div>
            <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-white via-violet-300 to-fuchsia-500 bg-clip-text text-transparent">
              GigFlow CRM
            </h1>

            <p className="text-gray-500 mt-4 text-lg">
              AI Powered Smart Leads Dashboard
            </p>
          </div>

          <div className="flex gap-4 mt-6 lg:mt-0">
            {isAdmin && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-lg shadow-emerald-500/10 hover:scale-[1.03]"
              >
                <Download size={18} />
                Export
              </button>
            )}

            <button
              onClick={() => {
                setEditingLead(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 hover:opacity-90 transition-all shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:scale-[1.03]"
            >
              <Plus size={18} />
              Add Lead
            </button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 relative z-10">

          <Card
            title="Total Leads"
            value={total}
            icon={<Users size={28} />}
          />

          <Card
            title="Growth"
            value="+24%"
            icon={<TrendingUp size={28} />}
          />

          <Card
            title="Converted"
            value={pieData[3].value}
            icon={<UserCheck size={28} />}
          />

          <Card
            title="Revenue"
            value="$12.4K"
            icon={<CircleDollarSign size={28} />}
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-2 bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[32px] p-7 shadow-[0_0_50px_rgba(139,92,246,0.06)]"
          >
            <h2 className="text-2xl font-bold mb-6">
              Lead Growth
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[32px] p-7 shadow-[0_0_50px_rgba(139,92,246,0.06)]"
          >
            <h2 className="text-2xl font-bold mb-6">
              Lead Status
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-black/40 border border-white/10 backdrop-blur-2xl rounded-[32px] p-7 shadow-[0_0_50px_rgba(139,92,246,0.06)]"
        >
          <FilterBar onFilterChange={handleFilterChange} />

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-4 mt-4">
              {error}
            </div>
          )}

          <div className="mt-6">
            <LeadTable
              leads={leads}
              onEdit={(lead) => {
                setEditingLead(lead)
                setShowForm(true)
              }}
              onDelete={handleDelete}
              isAdmin={isAdmin}
              loading={loading}
            />
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        </motion.div>

        {showForm && (
          <LeadForm
            onSubmit={editingLead ? handleUpdate : handleCreate}
            onClose={() => {
              setShowForm(false)
              setEditingLead(null)
            }}
            initialData={editingLead}
            loading={formLoading}
          />
        )}
      </div>
    </Layout>
  )
}

function Card({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[28px] p-7 shadow-[0_0_40px_rgba(139,92,246,0.08)] hover:border-violet-500/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="text-gray-400 text-sm">
          {title}
        </div>

        <div className="text-violet-400">
          {icon}
        </div>
      </div>

      <h2 className="text-5xl font-black tracking-tight">
        {value}
      </h2>
    </motion.div>
  )
}