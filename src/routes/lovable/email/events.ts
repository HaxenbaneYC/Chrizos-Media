import { createEmailWebhookHandler } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'

const handledEventIds = new Set<string>()

async function recordEmailDeliveryEvent(eventType: 'bounced' | 'complaint' | 'unsubscribed', eventId: string) {
  if (handledEventIds.has(eventId)) {
    console.info('Email event already handled', { event_id: eventId })
    return
  }

  handledEventIds.add(eventId)
  console.info('Email event handled', { event_type: eventType, event_id: eventId })
}

export const Route = createFileRoute("/lovable/email/events")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) {
          console.error('Missing required environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const handler = createEmailWebhookHandler({
          apiKey,
          on: {
            'email.bounced': async (event) => {
              await recordEmailDeliveryEvent('bounced', event.event_id)
            },
            'email.complaint': async (event) => {
              await recordEmailDeliveryEvent('complaint', event.event_id)
            },
            'email.unsubscribed': async (event) => {
              await recordEmailDeliveryEvent('unsubscribed', event.event_id)
            },
          },
        })
        return handler(request)
      },
    },
  },
})
