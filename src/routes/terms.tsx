import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site-b/legal-page";

const DESCRIPTION =
  "The terms for using chrizosmedia.com and booking a free ad audit with Chrizos Media.";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Chrizos Media" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Terms and Conditions | Chrizos Media" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://chrizosmedia.com/terms" },
      { property: "og:image", content: "https://chrizosmedia.com/b/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://chrizosmedia.com/terms" }],
  }),
});

const EMAIL = "chrizosmedia@gmail.com";

function TermsPage() {
  return (
    <LegalPage kicker="Legal" title="Terms and conditions" updated="1 October 2026">
      <p>
        These terms apply when you use chrizosmedia.com or book a free ad audit with Chrizos Media
        (“we”, “us”). By using the website, you agree to them.
      </p>

      <h2>The free ad audit</h2>
      <ul>
        <li>The audit is free and comes with no obligation to buy anything.</li>
        <li>Spots are limited each month. We may decline or reschedule a request.</li>
        <li>
          To prepare, we may look at your public ads (for example in the Meta Ad Library), your
          website and social profiles. If you choose to share access to your ad account, we only use
          it for the audit.
        </li>
        <li>The written plan we send is yours to keep and use, whether or not we work together.</li>
        <li>
          Our advice is based on the information available to us at the time. Results from
          advertising are never guaranteed, and decisions about your business, ads and budget remain
          yours.
        </li>
      </ul>

      <h2>Paid work</h2>
      <p>
        Any paid service is agreed separately in a written proposal or agreement, which sets out the
        scope, fees and terms. If that agreement conflicts with these terms, the agreement applies.
      </p>

      <h2>Using the website</h2>
      <ul>
        <li>Please give accurate details in our forms.</li>
        <li>
          Don’t misuse the website: no spam, scraping, attempts to break security, or anything
          unlawful.
        </li>
        <li>
          Tools on the website, such as the Attention Test and the ad cost calculator, give
          estimates for guidance only.
        </li>
      </ul>

      <h2>Our content</h2>
      <p>
        The website’s text, design, logo, guides and graphics belong to Chrizos Media. You may share
        links to them, but please don’t copy or resell them without permission. Client work shown on
        the website is shown with permission and remains the property of its owners.
      </p>

      <h2>Other websites</h2>
      <p>
        We link to services such as Calendly, WhatsApp and Instagram. We’re not responsible for
        their content or how they handle your data; their own terms apply.
      </p>

      <h2>Liability</h2>
      <p>
        We work hard to keep the website accurate and available, but we provide it “as is”. To the
        extent UAE law allows, we’re not liable for indirect losses or lost profits from using the
        website or the free audit.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle your data is explained in our <a href="/privacy">privacy policy</a>.
      </p>

      <h2>Law</h2>
      <p>
        These terms are governed by the laws of the United Arab Emirates, and disputes go to the UAE
        courts.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms; the date at the top shows the latest version. Questions? Email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
