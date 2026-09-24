import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

const CONTACT_EMAIL = 'chrizosmedia@gmail.com'

export interface ChecklistRequestEmailProps {
  email?: string
  submittedAt?: string
}

const styles = {
  body: { margin: 0, backgroundColor: '#f4f7fb', color: '#052662', fontFamily: 'Montserrat, Arial, sans-serif' },
  container: { margin: '0 auto', padding: '32px 20px', maxWidth: '640px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #dbe5f2', borderRadius: '18px', padding: '28px' },
  eyebrow: { color: '#1700FF', fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', margin: '0 0 12px', textTransform: 'uppercase' as const },
  heading: { color: '#052662', fontSize: '28px', lineHeight: '34px', fontWeight: 800, margin: '0 0 20px' },
  label: { color: '#5b6f91', fontSize: '11px', fontWeight: 800, letterSpacing: '0.16em', margin: '0 0 6px', textTransform: 'uppercase' as const },
  value: { color: '#052662', fontSize: '16px', lineHeight: '24px', fontWeight: 600, margin: '0' },
  footer: { color: '#6f7f9d', fontSize: '12px', lineHeight: '18px', margin: '20px 0 0' },
}

export function ChecklistRequestEmail({ email, submittedAt }: ChecklistRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Dubai marketing checklist request</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Text style={styles.eyebrow}>Chrizos Media</Text>
            <Heading style={styles.heading}>New checklist request</Heading>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email?.trim() || 'Not provided'}</Text>
            <Text style={styles.footer}>
              Requested from the Chrizos Media website{submittedAt ? ` on ${submittedAt}` : ''}. Send the checklist when the PDF is ready.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ChecklistRequestEmail,
  displayName: 'Checklist request',
  subject: 'New Dubai marketing checklist request',
  previewData: {
    email: 'owner@example.com',
    submittedAt: '24 Sep 2026, 11:10 UTC',
  },
  to: CONTACT_EMAIL,
} satisfies TemplateEntry