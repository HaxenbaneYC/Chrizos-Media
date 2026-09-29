import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { BoltIcon } from "@/components/site-b/pieces-b";
import { Mark } from "@/components/site-d/brand-d";
import { CalendlyD } from "@/components/site-d/calendly-d";
import { sendAuditRequest } from "@/lib/contact.functions";
import { DEFAULT_SETTINGS, getSiteSettings, trackBookingClick } from "@/lib/site-settings.functions";

const SHARE_IMAGE = "https://chrizosmedia.com/b/og-image.png";
const TITLE = "Book your free ad audit | Chrizos Media";
const DESCRIPTION = "Tell us about your business, pick a time, and get 30 minutes on your real ads plus a written plan within 48 hours. Free.";

/**
 * The link sent in Instagram and WhatsApp messages: chrizosmedia.com/audit?src=instagram.
 * Step 1 collects what's needed to prepare the audit, step 2 books the call.
 */
export const Route = createFileRoute("/audit")({
  staticData: { sitemap: true },
  loader: () => getSiteSettings(),
  component: AuditPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Book your free ad audit" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/audit" },
      { property: "og:image", content: SHARE_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SHARE_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://chrizosmedia.com/audit" }],
  }),
});

const INDUSTRIES = ["Clinic", "Beauty & skincare", "Fitness", "Restaurant or café", "Online store", "Real estate", "Other"];
const ADS_STATUS = ["Yes, running now", "Ran them before", "Not yet"];
const SPEND = ["Under AED 2,000", "AED 2,000–5,000", "AED 5,000–15,000", "Over AED 15,000", "Not sure"];
const GOALS = ["More bookings or leads", "More online sales", "More people knowing us"];

type Lead = { name: string; email: string; notes: string };

function Choices({ name, legend, options, required = false }: { name: string; legend: string; options: string[]; required?: boolean }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 text-lg font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="b-choice">
            <input type="radio" name={name} value={o} required={required} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-lg font-semibold">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-[var(--d-muted)]">{hint}</p> : null}
    </div>
  );
}

function AuditPage() {
  const settings = Route.useLoaderData() ?? DEFAULT_SETTINGS;
  const submit = useServerFn(sendAuditRequest);
  const logBooking = useServerFn(trackBookingClick);
  const [source, setSource] = useState("link");
  const [sending, setSending] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get("src") ?? "";
    const clean = src.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
    if (clean) setSource(clean);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const data = {
      submissionId: crypto.randomUUID(),
      name: get("name"),
      business: get("business"),
      email: get("email"),
      phone: get("phone"),
      link: get("link"),
      industry: get("industry"),
      adsStatus: get("adsStatus"),
      spend: get("spend"),
      goal: get("goal"),
      problem: get("problem"),
      source,
    };
    setSending(true);
    try {
      await submit({ data });
    } catch {
      // Still move on: the same details travel with the Calendly booking below.
    }
    setSending(false);
    setLead({
      name: data.name,
      email: data.email,
      notes: `${data.business} · ${data.link} · ${data.industry} · Ads: ${data.adsStatus} · Spend: ${data.spend} · Goal: ${data.goal}${data.problem ? ` · Problem: ${data.problem}` : ""}`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const whatsapp = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hi Youssef, I’d like to book my free ad audit.")}`;

  return (
    <div className="d-root b-theme min-h-[100svh]">
      <main className="d-section">
        <div className="d-wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-12">
              <a href="/" className="inline-flex min-h-11 items-center" aria-label="Chrizos Media home">
                <img src="/b/logo-blue.svg" alt="Chrizos Media" width={952} height={386} className="h-auto w-[112px]" />
              </a>
              <p className="d-kicker mt-12">Free ad audit · 3 spots this month</p>
              <h1 className="d-display d-h1 mt-4">
                {lead ? (
                  <>
                    Now pick <Mark>a time.</Mark>
                  </>
                ) : (
                  <>
                    Let’s look at <Mark>your ads.</Mark>
                  </>
                )}
              </h1>
              <p className="d-lead">
                {lead
                  ? `Thanks, ${lead.name.split(" ")[0]}. I’ll go through your ads before we talk, so the 30 minutes are all about fixes.`
                  : "Two quick steps: tell me about your business, then pick a time. It takes about 2 minutes."}
              </p>
              <ol className="mt-8 grid gap-3 text-base font-semibold" aria-label="Steps">
                <li className={lead ? "opacity-50" : ""}>1 · About your business</li>
                <li className={lead ? "" : "opacity-50"}>2 · Pick a time</li>
              </ol>
              <ul className="mt-10 grid gap-4 border-t border-[var(--d-rule)] pt-8">
                {[
                  ["30 minutes on your real ads", "with me, Youssef Christofides, founder of Chrizos Media."],
                  ["A written 1-page plan within 48 hours.", "Yours to keep, whether we work together or not."],
                  ["Free.", "No obligation, no hard sell."],
                ].map(([b, t]) => (
                  <li key={b} className="flex gap-3">
                    <BoltIcon className="mt-1 h-5 w-auto shrink-0 text-[var(--d-lime)]" />
                    <span>
                      <b>{b}</b> {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            {lead ? (
              <div className="grid gap-4">
                <CalendlyD
                  url={settings.calendly_url}
                  notes={lead.notes}
                  prefill={{ name: lead.name, email: lead.email }}
                  colours={{ background: "ffffff", text: "052662", primary: "1700ff" }}
                  icon={<img src="/b/favicon.svg" alt="" width={56} height={56} className="h-14 w-14" />}
                  onBooked={() => void logBooking({ data: { source: "calendly" } })}
                />
                <p className="text-sm text-[var(--d-muted)]">
                  None of the times work?{" "}
                  <a href={whatsapp} target="_blank" rel="noreferrer" className="d-link font-semibold">
                    Message me on WhatsApp
                  </a>{" "}
                  and we’ll find one.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="d-card grid gap-8 p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="name" label="Your name">
                    <input id="name" name="name" required autoComplete="name" maxLength={120} className="d-input" />
                  </Field>
                  <Field id="business" label="Business name">
                    <input id="business" name="business" required autoComplete="organization" maxLength={160} className="d-input" />
                  </Field>
                  <Field id="email" label="Email">
                    <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" maxLength={254} className="d-input" />
                  </Field>
                  <Field id="phone" label="WhatsApp number">
                    <input id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" minLength={6} maxLength={50} placeholder="+971" className="d-input" />
                  </Field>
                </div>
                <Field id="link" label="Website or Instagram" hint="So I can find your ads before the call.">
                  <input id="link" name="link" required maxLength={300} placeholder="yourbusiness.com or @yourbusiness" className="d-input" />
                </Field>
                <Choices name="industry" legend="What kind of business is it?" options={INDUSTRIES} required />
                <Choices name="adsStatus" legend="Are you running Meta ads (Instagram or Facebook)?" options={ADS_STATUS} required />
                <Choices name="spend" legend="Roughly how much do you spend on ads a month?" options={SPEND} required />
                <Choices name="goal" legend="What do you want most from your ads?" options={GOALS} required />
                <Field id="problem" label="What’s not working right now? (optional)">
                  <textarea id="problem" name="problem" rows={3} maxLength={2000} placeholder="e.g. lots of views, few bookings" className="d-input py-3" />
                </Field>
                <div className="grid gap-3">
                  <button type="submit" disabled={sending} className="d-btn d-btn-forest min-h-14 px-7 text-base">
                    {sending ? "Saving…" : "Next: pick a time"}
                  </button>
                  <p className="text-sm text-[var(--d-muted)]">I only use this to prepare your audit. No spam, ever.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
