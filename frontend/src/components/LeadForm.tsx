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

export default function LeadForm({
  onSubmit,
  onClose,
  initialData,
  loading
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadFormData>()

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        source: initialData.source
      })
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website'
      })
    }
  }, [initialData, reset])

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white placeholder:text-gray-500 backdrop-blur-md focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-7 shadow-[0_0_60px_rgba(139,92,246,0.15)]">
        
        <div className="mb-6">
          <h2 className="bg-gradient-to-r from-white via-violet-300 to-fuchsia-500 bg-clip-text text-3xl font-black text-transparent">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Manage your CRM pipeline efficiently
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Name
            </label>

            <input
              {...register('name', {
                required: 'Name is required'
              })}
              className={inputClass}
              placeholder="John Doe"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Email
            </label>

            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email'
                }
              })}
              className={inputClass}
              placeholder="john@example.com"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Status
            </label>

            <select
              {...register('status')}
              className={inputClass}
            >
              <option className="bg-black text-white" value="New">
                New
              </option>

              <option className="bg-black text-white" value="Contacted">
                Contacted
              </option>

              <option className="bg-black text-white" value="Qualified">
                Qualified
              </option>

              <option className="bg-black text-white" value="Lost">
                Lost
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Source
            </label>

            <select
              {...register('source')}
              className={inputClass}
            >
              <option className="bg-black text-white" value="Website">
                Website
              </option>

              <option className="bg-black text-white" value="Instagram">
                Instagram
              </option>

              <option className="bg-black text-white" value="Referral">
                Referral
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : initialData
                ? 'Update Lead'
                : 'Create Lead'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-gray-300 transition-all hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}