# Private Admin Panel for Chrizos Media

A single private area, like a mini Shopify admin, where you manage the website without asking me.

## How you get in
1. Sign in at /auth with your email and account password (same as today).
2. Open /admin. It asks for the extra panel password. You enter it once, and the panel stays unlocked for 12 hours on that device.
3. You need both steps. An owner account alone won't open the panel, and neither will the panel password on its own.

## Panel sections
- **Overview**: the stats already on the dashboard (checklist sign-ups, downloads, download rate), plus totals for inquiries and bookings clicked, with 7/30/90-day and all-time ranges.
- **Inquiries**: every message sent through the Work With Us form (name, email, phone, service, message, date). You can mark each one New, Contacted, Won, or Lost, and export them to CSV. For now only inquiries are stored. Checklist sign-ups stay counts-only, as you chose earlier.
- **Team & Access**: see who has access, add a teammate by email (they create an account first), remove access, and set each person as Owner (full control) or Viewer (stats and inquiries only).
- **Website Settings**: edit key details without code:
  - Contact email, WhatsApp number, Instagram link, Calendly link
  - Hero headline and subheading
  - The "first 5 clients" scarcity line (on/off plus text)
  - Checklist offer on/off
  - Site announcement bar (optional text at the top of the site)
- **Security**: change the panel password, and sign out everywhere.

The public site reads these settings live, so saved changes show up right away.

## Technical details
- New tables: `site_settings` (single row, public read of safe fields only), `inquiries` (owner/viewer read, server insert), plus a `viewer` role added to `app_role`. RLS and grants on every table.
- The panel password is stored as a server-only secret (with a hash on first change) and checked with a timing-safe compare inside a server function. An unlock flag is kept in an encrypted, httpOnly session cookie. Every admin server function requires both `requireSupabaseAuth` with an owner/viewer role AND the unlocked session.
- Contact form server function also saves the inquiry. Booking clicks are counted anonymously, like checklist events.
- The home page loads settings through a public server function with defaults, so it never breaks if settings are empty.
- Routes: `/_authenticated/admin` layout with tabs (overview, inquiries, team, settings, security). The existing `/dashboard` redirects to `/admin`.
