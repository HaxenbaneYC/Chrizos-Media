import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

const SITE_URL = 'https://chrizosmedia.com'
const DOWNLOAD_URL = `${SITE_URL}/downloads/chrizos-media-dubai-marketing-checklist.pdf`

export interface ChecklistDeliveryEmailProps {
  email?: string
}

const styles = {
  body: { margin: 0, backgroundColor: '#f4f7fb', color: '#052662', fontFamily: 'Montserrat, Arial, sans-serif' },
  container: { margin: '0 auto', padding: '32px 20px', maxWidth: '640px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #dbe5f2', borderRadius: '18px', padding: '28px' },
  eyebrow: { color: '#1700FF', fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', margin: '0 0 12px', textTransform: 'uppercase' as const },
  heading: { color: '#052662', fontSize: '28px', lineHeight: '34px', fontWeight: 800, margin: '0 0 16px' },
  text: { color: '#42536F', fontSize: '15px', lineHeight: '24px', fontWeight: 500, margin: '0 0 20px' },
  button: {
    backgroundColor: '#1700FF',
    borderRadius: '12px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: 800,
    padding: '14px 28px',
    textDecoration: 'none',
  },
  link: { color: '#1700FF', wordBreak: 'break-all' as const },
  footer: { color: '#6f7f9d', fontSize: '12px', lineHeight: '18px', margin: '20px 0 0' },
}

export function ChecklistDeliveryEmail({ email }: ChecklistDeliveryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Dubai marketing checklist is ready</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Text style={styles.eyebrow}>Chrizos Media</Text>
            <Heading style={styles.heading}>Your checklist is ready</Heading>
            <Text style={styles.text}>
              Here is your free guide: &ldquo;5 Marketing Mistakes Costing Dubai Businesses Clients&rdquo;.
              Inside you&rsquo;ll find the 10-minute leak check, five mistakes to fix first, and a 30-day action plan.
            </Text>
            <Button href={DOWNLOAD_URL} style={styles.button}>
              Download the checklist (PDF)
            </Button>
            <Text style={styles.footer}>
              Button not working? Copy this link into your browser:{' '}
              <a href={DOWNLOAD_URL} style={styles.link}>{DOWNLOAD_URL}</a>
            </Text>
            <Text style={styles.footer}>
              This copy was requested for {email?.trim() || 'your email'} from chrizosmedia.com. If that wasn&rsquo;t you,
              you can ignore this email — nothing else will be sent.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ChecklistDeliveryEmail,
  displayName: 'Checklist delivery',
  subject: 'Your free Dubai marketing checklist (PDF)',
  previewData: {
    email: 'owner@example.com',
  },
} satisfies TemplateEntry
