import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

const CONTACT_EMAIL = 'chrizosmedia@gmail.com'

export interface ContactInquiryEmailProps {
  name?: string
  email?: string
  phone?: string
  inquiry?: string
  submittedAt?: string
}

const styles = {
  body: {
    margin: 0,
    backgroundColor: '#f4f7fb',
    color: '#052662',
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '32px 20px',
    maxWidth: '640px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #dbe5f2',
    borderRadius: '18px',
    padding: '28px',
  },
  eyebrow: {
    color: '#1700FF',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.18em',
    margin: '0 0 12px',
    textTransform: 'uppercase' as const,
  },
  heading: {
    color: '#052662',
    fontSize: '28px',
    lineHeight: '34px',
    fontWeight: 800,
    margin: '0 0 20px',
  },
  label: {
    color: '#5b6f91',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.16em',
    margin: '0 0 6px',
    textTransform: 'uppercase' as const,
  },
  value: {
    color: '#052662',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600,
    margin: '0',
  },
  block: {
    margin: '18px 0',
  },
  inquiry: {
    color: '#052662',
    fontSize: '16px',
    lineHeight: '26px',
    fontWeight: 500,
    whiteSpace: 'pre-wrap' as const,
    margin: '0',
  },
  footer: {
    color: '#6f7f9d',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '20px 0 0',
  },
}

function display(value: string | undefined, fallback = 'Not provided') {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

export function ContactInquiryEmail({
  name,
  email,
  phone,
  inquiry,
  submittedAt,
}: ContactInquiryEmailProps) {
  const displayName = display(name, 'New lead')

  return (
    <Html>
      <Head />
      <Preview>New Chrizos Media inquiry from {displayName}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Text style={styles.eyebrow}>Chrizos Media</Text>
            <Heading style={styles.heading}>New work inquiry</Heading>

            <Section style={styles.block}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{display(name)}</Text>
            </Section>

            <Section style={styles.block}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{display(email)}</Text>
            </Section>

            <Section style={styles.block}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{display(phone)}</Text>
            </Section>

            <Hr />

            <Section style={styles.block}>
              <Text style={styles.label}>Inquiry / Service Needed</Text>
              <Text style={styles.inquiry}>{display(inquiry)}</Text>
            </Section>

            <Text style={styles.footer}>
              Submitted from the Chrizos Media website{submittedAt ? ` on ${submittedAt}` : ''}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactInquiryEmail,
  displayName: 'Contact inquiry',
  subject: (data) => {
    const name = typeof data['name'] === 'string' ? data['name'].trim() : ''
    return `New Chrizos Media inquiry${name ? `: ${name}` : ''}`
  },
  previewData: {
    name: 'Placeholder Client',
    email: 'client@example.com',
    phone: '+971 50 000 0000',
    inquiry:
      'We want to improve lead quality and make our paid campaigns easier to measure. We are interested in paid advertising and brand strategy.',
    submittedAt: '23 Sep 2026, 14:27 UTC',
  },
  to: CONTACT_EMAIL,
} satisfies TemplateEntry