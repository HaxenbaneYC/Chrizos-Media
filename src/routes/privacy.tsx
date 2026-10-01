import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site-b/legal-page";
import { ANALYTICS_ENABLED, openCookieSettings } from "@/lib/analytics";

const DESCRIPTION =
  "How Chrizos Media collects, uses and protects your personal data, and the choices you have.";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Chrizos Media" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Privacy Policy | Chrizos Media" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://chrizosmedia.com/privacy" },
      { property: "og:image", content: "https://chrizosmedia.com/b/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://chrizosmedia.com/privacy" }],
  }),
});

const EMAIL = "chrizosmedia@gmail.com";

function PrivacyPage() {
  return (
    <LegalPage kicker="Legal" title="Privacy policy" updated="1 October 2026">
      <p>
        This policy explains what personal data Chrizos Media collects through chrizosmedia.com,
        why, who we share it with, and the choices you have. We follow the UAE Personal Data
        Protection Law (Federal Decree-Law No. 45 of 2021).
      </p>

      <h2>Who we are</h2>
      <p>
        Chrizos Media is a marketing studio based in the United Arab Emirates, run by its founder,
        Youssef Christofides. For anything about your data, email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <b>When you book a free audit:</b> your name, business name, email, WhatsApp number,
          website or Instagram, and your answers about your business and ads.
        </li>
        <li>
          <b>When you ask for our guide:</b> your email address.
        </li>
        <li>
          <b>When you book a call:</b> the name, email and answers you give in our booking calendar
          (Calendly).
        </li>
        <li>
          <b>When you message us:</b> whatever you choose to send by email, WhatsApp or Instagram.
        </li>
        <li>
          <b>When you browse:</b> anonymous counts of actions such as guide downloads and booking
          clicks, which don’t identify you and use no cookies; and standard technical logs (such as
          IP address and browser type) kept by our hosting provider for security.
          {ANALYTICS_ENABLED
            ? " Analytics cookies only if you accept them (see Cookies below)."
            : ""}
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To prepare and run your audit, and send you the written plan.</li>
        <li>To reply to you and arrange calls.</li>
        <li>To send you the guide you asked for.</li>
        <li>To keep the website secure and understand which pages help people.</li>
        <li>With your consent, to measure how well our own ads work.</li>
      </ul>
      <p>
        We rely on your consent, on steps you ask us to take before working together, and on our
        legitimate interest in running and protecting the website. We never sell your data.
      </p>

      <h2>Who we share it with</h2>
      <p>
        Only the services that help us run the website and our work, under their own data protection
        terms:
      </p>
      <ul>
        <li>Lovable Cloud and Supabase (hosting, database and sending our emails)</li>
        <li>Cloudflare (delivering the website securely)</li>
        <li>Calendly (booking calls)</li>
        <li>Google (Gmail, for our email; Google Analytics, only if you accept cookies)</li>
        <li>
          Meta (WhatsApp and Instagram when you message us; the Meta Pixel, only if you accept
          cookies)
        </li>
      </ul>
      <p>
        Some of these providers store data outside the UAE. Where that happens, we rely on their
        contractual and security safeguards. We may also share data if the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Audit and enquiry details are kept for up to 24 months after our last contact, then deleted.
        If you become a client, we keep what we need for the length of our work together and as long
        as UAE law requires for business records.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see the data we hold about you, correct it, delete it, receive a copy, limit
        or object to how we use it, and withdraw your consent at any time. Email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we’ll respond within 30 days. If you’re not
        happy with our answer, you can complain to the UAE Data Office.
      </p>

      <h2 id="cookies">Cookies</h2>
      <p>
        The website works without cookies. We save one small setting in your browser to remember
        your cookie choice.
        {ANALYTICS_ENABLED
          ? " If you accept, we also use Google Analytics and the Meta Pixel to understand visits and measure our ads. You can change your choice at any time."
          : " We don’t currently use analytics or advertising cookies. If we add them, we’ll ask you first."}
      </p>
      {ANALYTICS_ENABLED ? (
        <p>
          <button
            type="button"
            onClick={openCookieSettings}
            className="d-btn d-btn-forest min-h-11 px-5 text-sm"
          >
            Change cookie settings
          </button>
        </p>
      ) : null}

      <h2>Security</h2>
      <p>
        We use encrypted connections (HTTPS), access controls and trusted providers to protect your
        data. No system is perfectly secure, so if we ever learn of a breach that affects you, we’ll
        tell you and the authorities as the law requires.
      </p>

      <h2>Children</h2>
      <p>Our services are for businesses. We don’t knowingly collect data from anyone under 18.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we’ll update it here and change the date at the top.</p>
    </LegalPage>
  );
}
