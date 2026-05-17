'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const FROM = process.env.RESEND_FROM ?? 'Beyond Thesis <noreply@beyondthesis.in>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'drshorafbaylon@gmail.com'

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function submitQuote(formData: FormData) {
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).trim()
  const phone = (formData.get('phone') as string).trim()
  const specialty = (formData.get('specialty') as string).trim()
  const message = (formData.get('message') as string).trim()

  if (!name || !email || !specialty) {
    return { error: 'Name, email and specialty are required.' }
  }

  // Save to database (ignore errors — don't block the user)
  try {
    const supabase = await createClient()
    await supabase.from('quote_requests').insert({ name, email, phone, specialty, message })
  } catch {
    // non-blocking
  }

  const resend = getResend()
  if (!resend) {
    console.log(`[quote] Quote request from ${name} <${email}> — ${specialty}`)
    return { success: true }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New quote request — ${specialty} (${name})`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; color: #1A1A1A; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
  <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">New quote request</h2>
  <p style="color: #666666; font-size: 14px; margin-bottom: 24px;">From the Beyond Thesis public site</p>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #666666; font-size: 13px; width: 120px;">Name</td><td style="padding: 8px 0; font-size: 14px;">${name}</td></tr>
    <tr><td style="padding: 8px 0; color: #666666; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #1A3A5C;">${email}</a></td></tr>
    <tr><td style="padding: 8px 0; color: #666666; font-size: 13px;">Phone</td><td style="padding: 8px 0; font-size: 14px;">${phone || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #666666; font-size: 13px;">Specialty</td><td style="padding: 8px 0; font-size: 14px;">${specialty}</td></tr>
    ${message ? `<tr><td style="padding: 8px 0; color: #666666; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0; font-size: 14px;">${message}</td></tr>` : ''}
  </table>
  <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;" />
  <p style="font-size: 12px; color: #666666; margin: 0;">Reply to this email to respond to ${name}.</p>
</body>
</html>`,
    })
    return { success: true }
  } catch {
    return { error: 'Failed to send. Please try again.' }
  }
}
