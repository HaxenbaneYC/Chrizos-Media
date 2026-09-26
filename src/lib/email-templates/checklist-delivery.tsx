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
const DOWNLOAD_URL = `${SITE_URL}/api/public/checklist-download?src=email`

export interface ChecklistDeliveryEmailProps {
  email?: string
}

const styles = {
  body: { margin: 0, backgroundColor: '#F3EFE4', color: '#111210', fontFamily: 'Geist, "Segoe UI", Helvetica, Arial, sans-serif' },
  container: { margin: '0 auto', padding: '32px 20px', maxWidth: '640px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #D8D2C2', borderRadius: '4px', padding: '28px' },
  eyebrow: { color: '#0D3B2E', fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', margin: '0 0 12px', textTransform: 'uppercase' as const },
  heading: { color: '#111210', fontSize: '28px', lineHeight: '34px', fontWeight: 800, margin: '0 0 16px' },
  text: { color: '#3A3C36', fontSize: '15px', lineHeight: '24px', fontWeight: 500, margin: '0 0 20px' },
  button: {
    backgroundColor: '#0D3B2E',
    borderRadius: '999px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: 800,
    padding: '14px 28px',
    textDecoration: 'none',
  },
  link: { color: '#0D3B2E', wordBreak: 'break-all' as const },
  footer: { color: '#6B6D64', fontSize: '12px', lineHeight: '18px', margin: '20px 0 0' },
}

export function ChecklistDeliveryEmail({ email }: ChecklistDeliveryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your marketing checklist is ready</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Text style={styles.eyebrow}>Chrizos Media</Text>
            <Heading style={styles.heading}>Your checklist is ready</Heading>
            <Text style={styles.text}>
              Here is your free guide: &ldquo;5 marketing mistakes costing you customers&rdquo;.
              Five common mistakes, and the simple fix for each. A 10-minute read.
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
              you can ignore this email. Nothing else will be sent.
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
  subject: 'Your free marketing checklist (PDF)',
  previewData: {
    email: 'owner@example.com',
  },
} satisfies TemplateEntry
