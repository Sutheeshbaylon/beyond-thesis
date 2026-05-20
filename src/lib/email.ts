import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM ?? 'Beyond Thesis <noreply@beyondthesis.in>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://beyondthesis.in'

// Lazy — only instantiated when key is present, so missing key never crashes on import
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendWelcomeEmail({
  to, name, tempPassword,
}: {
  to: string; name: string; tempPassword: string
}) {
  const resend = getResend()
  if (!resend) {
    console.log(`[email] Welcome email skipped (no RESEND_API_KEY). Would send to: ${to}`)
    return
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Beyond Thesis — Your thesis portal is ready',
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; color: #1A1A1A; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
  <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">Welcome, ${name}</h2>
  <p style="color: #666666; font-size: 14px; margin-bottom: 24px;">Beyond Research Unit · Thesis Support Portal</p>

  <p style="font-size: 14px; line-height: 1.6;">Your thesis project has been set up. You can now log in to track progress, download approved chapters, and communicate with your team.</p>

  <div style="background: #F8F8F7; border: 1px solid #E5E5E5; border-radius: 8px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">Your login details</p>
    <p style="margin: 0 0 4px; font-size: 14px;"><strong>Portal:</strong> <a href="${APP_URL}/login" style="color: #1A3A5C;">${APP_URL}/login</a></p>
    <p style="margin: 0 0 4px; font-size: 14px;"><strong>Email:</strong> ${to}</p>
    <p style="margin: 0; font-size: 14px;"><strong>Password:</strong> <code style="background: #E5E5E5; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
  </div>

  <p style="font-size: 13px; color: #666666;">If you have any questions, reply to this email.</p>

  <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;" />
  <p style="font-size: 12px; color: #666666; margin: 0;">Beyond Research Unit · Thesis Support Services</p>
</body>
</html>`,
  })
}

export async function sendPaymentReceiptEmail({
  to, name, paymentType, amount, utrNumber, projectTitle,
}: {
  to: string; name: string; paymentType: string; amount: number; utrNumber: string; projectTitle: string
}) {
  const resend = getResend()
  if (!resend) {
    console.log(`[email] Payment receipt skipped (no RESEND_API_KEY). Would send to: ${to}`)
    return
  }
  const typeLabel = paymentType === 'advance' ? 'Advance' : paymentType === 'balance' ? 'Balance' : 'Custom'
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Payment verified — ₹${amount.toLocaleString('en-IN')} ${typeLabel}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; color: #1A1A1A; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
  <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">Payment verified</h2>
  <p style="color: #666666; font-size: 14px; margin-bottom: 24px;">Beyond Research Unit · Thesis Support Portal</p>

  <p style="font-size: 14px;">Hi ${name}, your payment has been verified.</p>

  <div style="background: #F8F8F7; border: 1px solid #E5E5E5; border-radius: 8px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 6px; font-size: 14px;"><strong>Project:</strong> ${projectTitle}</p>
    <p style="margin: 0 0 6px; font-size: 14px;"><strong>Payment type:</strong> ${typeLabel}</p>
    <p style="margin: 0 0 6px; font-size: 14px;"><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
    <p style="margin: 0; font-size: 14px;"><strong>UTR:</strong> <code style="background: #E5E5E5; padding: 2px 6px; border-radius: 4px;">${utrNumber}</code></p>
  </div>

  ${paymentType === 'advance' ? '<p style="font-size: 14px;">Your thesis work has begun. Log in to track progress.</p>' : ''}
  ${paymentType === 'balance' ? '<p style="font-size: 14px;">Your final thesis is now available for download. Log in to access it.</p>' : ''}

  <p style="margin-top: 16px;"><a href="${APP_URL}/client" style="background: #1A3A5C; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; display: inline-block;">View your thesis</a></p>

  <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;" />
  <p style="font-size: 12px; color: #666666; margin: 0;">Beyond Research Unit · Thesis Support Services</p>
</body>
</html>`,
  })
}

export async function sendDeliverableApprovedEmail({
  to, name, chapterLabel, projectTitle,
}: {
  to: string; name: string; chapterLabel: string; projectTitle: string
}) {
  const resend = getResend()
  if (!resend) {
    console.log(`[email] Deliverable approved email skipped (no RESEND_API_KEY). Would send to: ${to}`)
    return
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: `New chapter ready: ${chapterLabel}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; color: #1A1A1A; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
  <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">Chapter approved</h2>
  <p style="color: #666666; font-size: 14px; margin-bottom: 24px;">Beyond Research Unit · Thesis Support Portal</p>

  <p style="font-size: 14px;">Hi ${name}, a new chapter of your thesis is ready to download.</p>

  <div style="background: #F8F8F7; border: 1px solid #E5E5E5; border-radius: 8px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 6px; font-size: 14px;"><strong>Project:</strong> ${projectTitle}</p>
    <p style="margin: 0; font-size: 14px;"><strong>Chapter:</strong> ${chapterLabel}</p>
  </div>

  <p style="margin-top: 16px;"><a href="${APP_URL}/client" style="background: #1A3A5C; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; display: inline-block;">Download now</a></p>

  <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;" />
  <p style="font-size: 12px; color: #666666; margin: 0;">Beyond Research Unit · Thesis Support Services</p>
</body>
</html>`,
  })
}
