import { createServerFn } from '@tanstack/react-start'
import { EmailAPIError } from '@lovable.dev/email-js'
import { z } from 'zod'

import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const CONTACT_EMAIL = 'chrizosmedia@gmail.com'
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const MAX_SUBMISSIONS_PER_WINDOW = 3

const recentSubmissions = new Map<string, number[]>()

const contactInquiryInput = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: z.string().trim().max(50).optional().default(''),
  service: z.enum([
    'Paid Advertising',
    'Content Strategy',
    'Brand Strategy & Market Insights',
    'SEO',
    'General Enquiry',
  ]),
  message: z.string().trim().min(10).max(3000),
})

export type ContactInquiryResult =
  | { status: 'sent' }
  | { status: 'not_sent'; reason: 'recipient_suppressed' | 'email_unavailable' | 'rate_limited' }

function isWithinRateLimit(key: string) {
  const now = Date.now()
  const activeWindow = now - RATE_LIMIT_WINDOW_MS
  const previous = recentSubmissions.get(key)?.filter((timestamp) => timestamp > activeWindow) ?? []

  if (previous.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    recentSubmissions.set(key, previous)
    return false
  }

  recentSubmissions.set(key, [...previous, now])
  return true
}

function formatSubmittedAt() {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date()) + ' UTC'
}

export const sendContactInquiry = createServerFn({ method: 'POST' })
  .inputValidator((data) => contactInquiryInput.parse(data))
  .handler(async ({ data }): Promise<ContactInquiryResult> => {
    if (!isWithinRateLimit(data.email)) {
      return { status: 'not_sent', reason: 'rate_limited' }
    }

    try {
      const result = await sendTemplateEmail('contact-inquiry', CONTACT_EMAIL, {
        idempotencyKey: `contact-inquiry-${data.submissionId}`,
        replyTo: data.email,
        templateData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
          submittedAt: formatSubmittedAt(),
        },
      })

      if (!result.sent) {
        return { status: 'not_sent', reason: 'recipient_suppressed' }
      }

      return { status: 'sent' }
    } catch (error) {
      if (error instanceof EmailAPIError) {
        return { status: 'not_sent', reason: 'email_unavailable' }
      }

      throw error
    }
  })