'use client'

import { useRouter } from 'next/navigation'

type Project = {
  id: string
  title: string
  specialty: string
  current_stage: number
  stage_status: string
  updated_at: string
  client: { full_name: string } | { full_name: string }[] | null
}

function getClientName(client: Project['client']): string {
  if (!client) return '—'
  if (Array.isArray(client)) return client[0]?.full_name ?? '—'
  return client.full_name
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function StaffPipeline({
  projects,
  role,
}: {
  projects: Project[]
  role: 'writer' | 'stats'
}) {
  const router = useRouter()

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-[#666666] text-sm bg-white border border-[#E5E5E5] rounded-lg">
        No projects assigned to you yet.
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F8F7] border-b border-[#E5E5E5]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Title / Client</th>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Specialty</th>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Stage</th>
              <th className="text-left px-4 py-3 font-medium text-[#666666]">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {projects.map((p) => (
              <tr
                key={p.id}
                onClick={() => router.push(`/${role}/projects/${p.id}`)}
                className="hover:bg-[#F8F8F7] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[#1A1A1A]">{p.title}</div>
                  <div className="text-xs text-[#666666] mt-0.5">{getClientName(p.client)}</div>
                </td>
                <td className="px-4 py-3 text-[#666666]">{p.specialty}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    p.stage_status === 'completed'
                      ? 'bg-green-50 text-[#1F7A3D] border border-green-200'
                      : 'bg-amber-50 text-[#B07000] border border-amber-200'
                  }`}>
                    Stage {p.current_stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#666666]">{timeAgo(p.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-[#E5E5E5]">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push(`/${role}/projects/${p.id}`)}
            className="px-4 py-4 cursor-pointer hover:bg-[#F8F8F7] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium text-[#1A1A1A] text-sm">{p.title}</div>
                <div className="text-xs text-[#666666] mt-0.5">{getClientName(p.client)}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                p.stage_status === 'completed'
                  ? 'bg-green-50 text-[#1F7A3D] border border-green-200'
                  : 'bg-amber-50 text-[#B07000] border border-amber-200'
              }`}>
                Stage {p.current_stage}
              </span>
            </div>
            <div className="text-xs text-[#666666] mt-1">{p.specialty} · {timeAgo(p.updated_at)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
