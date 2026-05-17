'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Project = {
  id: string
  title: string
  specialty: string
  sample_size: number | null
  tier: string
  current_stage: number
  stage_status: string
  is_balance_paid: boolean
  total_amount: number
  updated_at: string
  client: { full_name: string } | { full_name: string }[] | null
}

function getClientName(client: Project['client']): string {
  if (!client) return '—'
  if (Array.isArray(client)) return client[0]?.full_name ?? '—'
  return client.full_name
}

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard',
  special: 'Special',
  super: 'Super',
  custom: 'Custom',
}

const STAGE_COLORS: Record<string, string> = {
  in_progress: 'bg-amber-50 text-[#B07000] border border-amber-200',
  completed: 'bg-green-50 text-[#1F7A3D] border border-green-200',
}

function formatAmount(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function PipelineTable({ projects, pendingPaymentProjectIds = [], pendingDeliverableProjectIds = [] }: { projects: Project[], pendingPaymentProjectIds?: string[], pendingDeliverableProjectIds?: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentPending = searchParams.get('payment') === 'pending'
  const deliverablePending = searchParams.get('deliverable') === 'pending'

  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [filterTier, setFilterTier] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortKey, setSortKey] = useState<'updated_at' | 'total_amount'>('updated_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let rows = projects

    if (paymentPending && pendingPaymentProjectIds.length > 0) {
      rows = rows.filter((p) => pendingPaymentProjectIds.includes(p.id))
    }
    if (deliverablePending && pendingDeliverableProjectIds.length > 0) {
      rows = rows.filter((p) => pendingDeliverableProjectIds.includes(p.id))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          getClientName(p.client).toLowerCase().includes(q) ||
          p.specialty.toLowerCase().includes(q)
      )
    }
    if (filterStage !== 'all') rows = rows.filter((p) => String(p.current_stage) === filterStage)
    if (filterTier !== 'all') rows = rows.filter((p) => p.tier === filterTier)
    if (filterStatus !== 'all') rows = rows.filter((p) => p.stage_status === filterStatus)

    rows = [...rows].sort((a, b) => {
      const av = sortKey === 'updated_at' ? new Date(a.updated_at).getTime() : a.total_amount
      const bv = sortKey === 'updated_at' ? new Date(b.updated_at).getTime() : b.total_amount
      return sortDir === 'asc' ? av - bv : bv - av
    })

    return rows
  }, [projects, search, filterStage, filterTier, filterStatus, sortKey, sortDir])

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <div>
      {/* Payment pending banner */}
      {paymentPending && (
        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-[#B07000]">
          <span>Showing {pendingPaymentProjectIds.length} project{pendingPaymentProjectIds.length !== 1 ? 's' : ''} with payments awaiting verification</span>
          <button onClick={() => router.push('/admin')} className="text-xs underline ml-4 whitespace-nowrap">Clear filter</button>
        </div>
      )}
      {/* Deliverable pending banner */}
      {deliverablePending && (
        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-[#B07000]">
          <span>Showing {pendingDeliverableProjectIds.length} project{pendingDeliverableProjectIds.length !== 1 ? 's' : ''} with deliverables awaiting approval</span>
          <button onClick={() => router.push('/admin')} className="text-xs underline ml-4 whitespace-nowrap">Clear filter</button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search title, client, specialty…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
        />
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
        >
          <option value="all">All Stages</option>
          <option value="1">Stage 1</option>
          <option value="2">Stage 2</option>
          <option value="3">Stage 3</option>
        </select>
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
        >
          <option value="all">All Tiers</option>
          <option value="standard">Standard</option>
          <option value="special">Special</option>
          <option value="super">Super</option>
          <option value="custom">Custom</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
        >
          <option value="all">All Status</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#666666] text-sm bg-white border border-[#E5E5E5] rounded-lg">
          {projects.length === 0
            ? 'No projects yet. Click + New project to add your first one.'
            : 'No projects match your filters.'}
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F8F7] border-b border-[#E5E5E5]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#666666]">Title / Client</th>
                  <th className="text-left px-4 py-3 font-medium text-[#666666]">Specialty</th>
                  <th className="text-left px-4 py-3 font-medium text-[#666666]">N</th>
                  <th className="text-left px-4 py-3 font-medium text-[#666666]">Tier</th>
                  <th className="text-left px-4 py-3 font-medium text-[#666666]">Stage</th>
                  <th className="text-left px-4 py-3 font-medium text-[#666666]">Balance</th>
                  <th
                    className="text-left px-4 py-3 font-medium text-[#666666] cursor-pointer hover:text-[#1A1A1A]"
                    onClick={() => toggleSort('total_amount')}
                  >
                    Amount {sortKey === 'total_amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    className="text-left px-4 py-3 font-medium text-[#666666] cursor-pointer hover:text-[#1A1A1A]"
                    onClick={() => toggleSort('updated_at')}
                  >
                    Updated {sortKey === 'updated_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/admin/projects/${p.id}`)}
                    className="hover:bg-[#F8F8F7] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1A1A1A] leading-snug">{p.title}</div>
                      <div className="text-xs text-[#666666] mt-0.5">{getClientName(p.client)}</div>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{p.specialty}</td>
                    <td className="px-4 py-3 text-[#666666]">{p.sample_size ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 bg-[#F8F8F7] border border-[#E5E5E5] rounded text-[#1A1A1A]">
                        {TIER_LABELS[p.tier]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${STAGE_COLORS[p.stage_status]}`}>
                        Stage {p.current_stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.is_balance_paid ? (
                        <span className="text-xs text-[#1F7A3D]">Paid</span>
                      ) : (
                        <span className="text-xs text-[#666666]">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#1A1A1A]">{formatAmount(p.total_amount)}</td>
                    <td className="px-4 py-3 text-[#666666] text-xs">{timeAgo(p.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#E5E5E5]">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/admin/projects/${p.id}`)}
                className="px-4 py-4 cursor-pointer hover:bg-[#F8F8F7] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-[#1A1A1A] text-sm leading-snug">{p.title}</div>
                    <div className="text-xs text-[#666666] mt-0.5">{getClientName(p.client)}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${STAGE_COLORS[p.stage_status]}`}>
                    Stage {p.current_stage}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#666666]">
                  <span>{p.specialty}</span>
                  <span>·</span>
                  <span>{TIER_LABELS[p.tier]}</span>
                  <span>·</span>
                  <span>{formatAmount(p.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-[#666666] mt-3">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  )
}
