import { createAdminClient } from '@/lib/supabase/admin'

interface AuditEntry {
  userId: string
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, unknown>
}

// Writes via service role — bypasses RLS. Never fails loudly.
export async function writeAuditLog(entry: AuditEntry) {
  try {
    const admin = createAdminClient()
    await admin.from('audit_log').insert({
      user_id: entry.userId,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      details: entry.details ?? null,
    })
  } catch (err) {
    console.error('[audit]', err)
  }
}
