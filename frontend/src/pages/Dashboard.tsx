import { useState, useEffect, useCallback } from 'react'
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
    search: '', status: '', source: '', sort: 'latest'
  })
  const limit = 10

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError('')
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
      // FIX: pagination metadata lives inside res.data.data.pagination
      setTotalPages(res.data.data.pagination.totalPages)
      setTotal(res.data.data.pagination.total)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
      setError('Failed to load leads. Please try again.')
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
      console.error('Failed to create lead:', err)
      alert(err.response?.data?.message || 'Failed to create lead')
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
      console.error('Failed to update lead:', err)
      alert(err.response?.data?.message || 'Failed to update lead')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    try {
      await api.delete(`/leads/${id}`)
      fetchLeads()
    } catch (err: any) {
      console.error('Failed to delete lead:', err)
      alert(err.response?.data?.message || 'Failed to delete lead')
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get('/leads/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'leads.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed. You may not have admin access.')
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Leads</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total leads</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <button
              onClick={handleExport}
              className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded transition"
            >
              Export CSV
            </button>
          )}
          <button
            onClick={() => { setEditingLead(null); setShowForm(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
          >
            + Add Lead
          </button>
        </div>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 text-sm px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <LeadTable
        leads={leads}
        onEdit={(lead) => { setEditingLead(lead); setShowForm(true) }}
        onDelete={handleDelete}
        isAdmin={isAdmin}
        loading={loading}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {showForm && (
        <LeadForm
          onSubmit={editingLead ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditingLead(null) }}
          initialData={editingLead}
          loading={formLoading}
        />
      )}
    </Layout>
  )
}
