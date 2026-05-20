import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Lead } from '../types'

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void
  onClose: () => void
  initialData?: Lead | null
  loading: boolean
}

export interface LeadFormData {
  name: string
  email: string
  status: string
  source: string
}

export default function LeadForm({ onSubmit, onClose, initialData, loading }: LeadFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>()

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        source: initialData.source,
      })
    } else {
      reset({ name: '', email: '', status: 'New', source: 'Website' })
    }
  }, [initialData, reset])

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-white font-semibold text-lg mb-5">
          {initialData ? 'Edit Lead' : 'Add New Lead'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className={inputClass}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              className={inputClass}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Status</label>
            <select {...register('status')} className={inputClass}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Source</label>
            <select {...register('source')} className={inputClass}>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}