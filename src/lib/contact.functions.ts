import { createServerFn } from '@tanstack/react-start'
import { EmailAPIError } from '@lovable.dev/email-js'
import { z } from 'zod'

import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const CONTACT_EMAIL = 'chrizosmedia@gmail.com'
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const MAX_SUBMISSIONS_PER_WINDOW = 3

const recentSubmissions = new Map<string, number[]>()

// Spam traps: a hidden field people never see, and how long the form was open.
const spamTraps = {
  hp: z.string().max(300).optional().default(''),
  elapsedMs: z.number().int().nonnegative().optional(),
}

const checklistRequestInput = z.object({
  submissionId: z.string().uuid(),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  source: z.enum(['page', 'instagram']).optional().default('page'),
  utm: z
    .object({
      source: z.string().max(80).optional(),
      medium: z.string().max(80).optional(),
      campaign: z.string().max(120).optional(),
    })
    .optional(),
  ...spamTraps,
})

const contactInquiryInput = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: z.string().trim().max(50).optional().default(''),
  service: z.enum([
    'Paid Advertising',
    'Content Strategy',
    'Brand Consulting',
    'SEO',
    'General Enquiry',
  ]),
  message: z.string().trim().min(10).max(3000),
  ...spamTraps,
})

const auditRequestInput = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  business: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/),
  link: z.string().trim().min(2).max(300),
  industry: z.string().trim().max(80),
  adsStatus: z.string().trim().max(80),
  spend: z.string().trim().max(80),
  goal: z.string().trim().max(80),
  problem: z.string().trim().max(2000).optional().default(''),
  source: z.string().trim().max(40).optional().default('link'),
  ...spamTraps,
})

export type ContactInquiryResult =
  | { status: 'sent' }
  | { status: 'not_sent'; reason: 'recipient_suppressed' | 'email_unavailable' | 'rate_limited' }

export type ChecklistRequestResult = ContactInquiryResult

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

/** Bots fill hidden fields and submit instantly. Pretend success so they don't retry. */
function looksLikeSpam(data: { hp?: string; elapsedMs?: number | undefined }) {
  return Boolean(data.hp) || (data.elapsedMs !== undefined && data.elapsedMs < 2500)
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
    if (looksLikeSpam(data)) return { status: 'sent' }
    if (!isWithinRateLimit(data.email)) {
      return { status: 'not_sent', reason: 'rate_limited' }
    }

    try {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
      await supabaseAdmin.from('inquiries').upsert({
        id: data.submissionId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
      }, { onConflict: 'id', ignoreDuplicates: true })
    } catch (error) {
      console.error('inquiry not stored', error)
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

/** The /audit page: saves the lead with everything needed to prepare the audit, then emails it to Chrizos. */
export const sendAuditRequest = createServerFn({ method: 'POST' })
  .inputValidator((data) => auditRequestInput.parse(data))
  .handler(async ({ data }): Promise<ContactInquiryResult> => {
    if (looksLikeSpam(data)) return { status: 'sent' }
    if (!isWithinRateLimit(`audit:${data.email}`)) {
      return { status: 'not_sent', reason: 'rate_limited' }
    }

    const message = [
      `Business: ${data.business}`,
      `Website / Instagram: ${data.link}`,
      `Industry: ${data.industry || 'Not given'}`,
      `Meta ads: ${data.adsStatus || 'Not given'}`,
      `Monthly ad spend: ${data.spend || 'Not given'}`,
      `Main goal: ${data.goal || 'Not given'}`,
      `Biggest problem: ${data.problem || 'Not given'}`,
      `Came from: ${data.source}`,
    ].join('\n')

    try {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
      await supabaseAdmin.from('inquiries').upsert({
        id: data.submissionId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: 'Free Ad Audit',
        message,
      }, { onConflict: 'id', ignoreDuplicates: true })
    } catch (error) {
      console.error('audit request not stored', error)
    }

    try {
      const result = await sendTemplateEmail('contact-inquiry', CONTACT_EMAIL, {
        idempotencyKey: `audit-request-${data.submissionId}`,
        replyTo: data.email,
        templateData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: 'Free Ad Audit',
          message,
          submittedAt: formatSubmittedAt(),
        },
      })
      return result.sent ? { status: 'sent' } : { status: 'not_sent', reason: 'recipient_suppressed' }
    } catch (error) {
      // The lead is already saved; a failed notification must not block booking.
      console.error('audit request email failed', error)
      return { status: 'sent' }
    }
  })

export const sendChecklistRequest = createServerFn({ method: 'POST' })
  .inputValidator((data) => checklistRequestInput.parse(data))
  .handler(async ({ data }): Promise<ChecklistRequestResult> => {
    if (looksLikeSpam(data)) return { status: 'sent' }
    if (!isWithinRateLimit(`checklist:${data.email}`)) {
      return { status: 'not_sent', reason: 'rate_limited' }
    }

    try {
      // Deliver the checklist PDF link straight to the requester.
      const delivery = await sendTemplateEmail('checklist-delivery', data.email, {
        idempotencyKey: `checklist-delivery-${data.submissionId}`,
        templateData: { email: data.email },
      })

      if (!delivery.sent) {
        return { status: 'not_sent', reason: 'recipient_suppressed' }
      }

      const { recordChecklistEvent } = await import('./checklist-events.server')
      await recordChecklistEvent('signup', data.source, data.utm)


      // Best-effort notification to Chrizos Media — never blocks delivery.
      try {
        await sendTemplateEmail('checklist-request', CONTACT_EMAIL, {
          idempotencyKey: `checklist-request-${data.submissionId}`,
          replyTo: data.email,
          templateData: {
            email: data.email,
            submittedAt: formatSubmittedAt(),
          },
        })
      } catch {
        // Notification failure is non-fatal — the checklist was delivered.
      }

      return { status: 'sent' }
    } catch (error) {
      if (error instanceof EmailAPIError) {
        return { status: 'not_sent', reason: 'email_unavailable' }
      }

      throw error
    }
  })