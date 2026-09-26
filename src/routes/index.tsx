import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import glauciaCampaign from "../assets/glaucia-campaign-shoot.png.asset.json";
import { DEFAULT_SETTINGS, getSiteSettings, trackBookingClick } from "@/lib/site-settings.functions";
import { sendContactInquiry } from "@/lib/contact.functions";
import { Mark } from "@/components/site-d/brand-d";
import { type QuizResult } from "@/components/site-d/leak-quiz";
import { CalendlyD } from "@/components/site-d/calendly-d";
import { HOMEPAGE } from "@/lib/homepage";
import { StrikeHero } from "@/components/site-b/strike-hero";
import { Manifesto } from "@/components/site-b/manifesto";
import { BoltIcon, BoltSeats, ProofNumbers, Switchboard, type Service } from "@/components/site-b/pieces-b";
import { AttentionTest } from "@/components/site-b/attention-test";
import { MoneyDial } from "@/components/site-b/money-dial";
import { ReelPanel, WorkReel } from "@/components/site-b/work-reel";

const REMAINING_SPOTS = 2;

const SERVICES: Service[] = [
  {
    name: "Ads",
    line: "Attention you buy",
    headline: "Put your business in front of thousands of the right people. Every day.",
    points: [
      "Meta and Google campaigns, set up and managed",
      "New hooks tested every month, winners scaled",
      "Retargeting, so paid attention doesn’t walk away",
      "A weekly report in customers, not clicks",
    ],
    first: "2 to 4 weeks",
  },
  {
    name: "Content",
    line: "Attention you earn",
    headline: "Posts people stop for, then act on.",
    points: ["A monthly content calendar", "Hooks, captions and ideas written to prompt action", "Launches planned around your key dates"],
    first: "4 to 6 weeks",
  },
  {
    name: "SEO",
    line: "Attention you’re found by",
    headline: "Found on Google by people ready to buy.",
    points: ["Website health fixes: speed, access, structure", "Pages built around real searches", "Content that ranks and brings free traffic"],
    first: "2 to 3 months",
  },
  {
    name: "Brand",
    line: "Attention that sticks",
    headline: "Know what to say, and why you win.",
    points: ["Audience, competitor and market research", "A clear message framework", "A step-by-step 90-day growth plan"],
    first: "2 to 3 weeks",
  },
];

const OFFER = [
  { title: "Ad account review", body: "What’s working, what’s wasting money, and why." },
  { title: "Hook and creative teardown", body: "Why people scroll past your ads, and what would make them stop." },
  { title: "Competitor ad check", body: "What your competitors are running, and the gap you can take." },
  { title: "Your first 3 ad angles to test", body: "Ready to brief or launch, whether we work together or not." },
  { title: "A written 1-page plan within 48 hours", body: "Yours to keep, whether we work together or not." },
];

const STEPS = [
  { when: "30 minutes", title: "Free audit", body: "We review your ads, content and online presence together, on a call." },
  { when: "Within 48 hours", title: "Your growth plan", body: "A clear written plan for your business. Yours to keep either way." },
  { when: "Every week", title: "Launch and report", body: "We do the work. You get weekly numbers and a monthly results review." },
];

const FAQ = [
  { q: "Is the audit really free?", a: "Yes. No obligation and no catch. You keep the written plan whether we work together or not." },
  { q: "Why only 5 clients?", a: "So every client gets founder-level attention, not a junior account manager. Staying small is how we keep the quality high." },
  { q: "Do you lock me into a long contract?", a: "No. After the initial period, everything runs month to month, so you can pause or stop when you need to." },
  { q: "What budget do I need for ads?", a: "It depends on your market and your goal. We’ll recommend a starting budget in your audit, sized so you can test without risking much." },
  { q: "Which businesses do you work with?", a: "Growing businesses that sell to real customers: product and fashion brands, beauty, hospitality, clinics and local services." },
  { q: "How fast will I see results?", a: "Ads usually show first results in 2 to 4 weeks, content in 4 to 6 weeks, SEO in 2 to 3 months. You get numbers every week." },
];

const RIVAGE_SHOTS = [
  { file: "campaign-man", caption: "Campaign · the R5", alt: "Man wearing Rivage R5 sunglasses in the campaign shoot" },
  { file: "swan", caption: "Campaign · the R5 in Sage", alt: "A white swan wearing Rivage sunglasses with green lenses" },
  { file: "product-green", caption: "Product photography", alt: "Rivage sunglasses with a grey frame and green lenses" },
  { file: "leather-case", caption: "Packaging · leather case", alt: "Rivage premium green leather glasses case" },
  { file: "welcome-card", caption: "Print · welcome card", alt: "Rivage welcome card that reads You're in" },
];

const WHATSAPP_BASE = "Hi Chrizos Media, I'd like to ask about your services.";

const SITE_TITLE = "Chrizos Media | More eyes. More customers.";
const SITE_DESCRIPTION =
  "Founder-led paid ads and content that put growing businesses in front of the right people, and turn that attention into customers. Take the free 60-second Attention Test.";
const OG_IMAGE = "https://chrizosmedia.com/b/og-image.png";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: () => getSiteSettings(),
  beforeLoad: () => {
    if (HOMEPAGE === "classic") throw redirect({ to: "/classic" });
  },
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#052662" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:site_name", content: "Chrizos Media" },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "More eyes. More customers. Chrizos Media." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "google-site-verification", content: "uzzj9R9Aahmkmf3VYqislFgiWItzv8dwuVJ5lUHZKc0" },
    ],
    links: [
      { rel: "canonical", href: "https://chrizosmedia.com/" },
      { rel: "icon", href: "/b/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/b/site.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Chrizos Media",
          description: SITE_DESCRIPTION,
          url: "https://chrizosmedia.com",
          logo: "https://chrizosmedia.com/b/icon-512.png",
          image: OG_IMAGE,
          founder: { "@type": "Person", name: "Youssef Christofides" },
          telephone: "+971504254366",
          knowsAbout: ["Paid Advertising", "Meta Ads", "Google Ads", "Content Strategy", "Brand Strategy", "SEO"],
          serviceType: ["Paid Advertising", "Content Strategy", "Brand Strategy & Consulting", "SEO"],
          sameAs: ["https://www.instagram.com/chrizosmedia/"],
        }),
      },
    ],
  }),
  component: HomeB,
});

function HomeB() {
  const settings = Route.useLoaderData() ?? DEFAULT_SETTINGS;
  const CONTACT_EMAIL = settings.contact_email;
  const logBooking = useServerFn(trackBookingClick);
  const submitInquiry = useServerFn(sendContactInquiry);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [copied, setCopied] = useState(false);

  const waText = result ? `${WHATSAPP_BASE}\n\nI took the Attention Test.\n${result.summary}` : WHATSAPP_BASE;
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(waText)}`;
  const trackWhatsApp = () => void logBooking({ data: { source: "whatsapp" } });

  async function sendReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!result) return;
    const fd = new FormData(e.currentTarget);
    setSendState("sending");
    try {
      const r = await submitInquiry({
        data: {
          submissionId: crypto.randomUUID(),
          name: String(fd.get("name") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          phone: "",
          service: "General Enquiry",
          message: `Please send my full Attention Score report.\n\n${result.summary}`,
        },
      });
      setSendState(r.status === "sent" ? "sent" : "not_sent");
    } catch {
      setSendState("not_sent");
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="d-root b-theme overflow-x-clip">
      <a href="#main-b" className="d-skip">
        Skip to content
      </a>

      <header className="b-bar sticky top-0 z-50 px-6 lg:px-12">
        <div className="d-wrap flex h-16 items-center justify-between gap-6">
          <a href="#top" className="inline-flex min-h-11 items-center" aria-label="Chrizos Media home">
            <img src="/b/logo-white.svg" alt="Chrizos Media" width={952} height={386} className="h-auto w-[92px] sm:w-[100px]" />
          </a>
          <nav aria-label="Primary" className="flex items-center gap-6">
            <a href="#attention-test" className="d-link hidden min-h-11 items-center text-base font-semibold no-underline lg:inline-flex">
              Attention Test
            </a>
            <a href="#services" className="d-link hidden min-h-11 items-center text-base font-semibold no-underline md:inline-flex">
              Services
            </a>
            <a href="#results" className="d-link hidden min-h-11 items-center text-base font-semibold no-underline md:inline-flex">
              Results
            </a>
            <a href="#faq" className="d-link hidden min-h-11 min-w-11 items-center justify-center text-base font-semibold no-underline lg:inline-flex">
              FAQ
            </a>
            <a href="#book" className="d-btn min-h-11 bg-white px-5 text-sm text-[#1700FF]">
              Book a free audit
            </a>
          </nav>
        </div>
      </header>

      <main id="main-b">
        {/* ============ The Strike: scroll-scrubbed opening ============ */}
        <StrikeHero
          lead={
            <p>
              We run the paid ads and content that put you in front of the right people every day, and turn that attention into
              customers. Run personally by the founder.
            </p>
          }
          actions={
            <>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#attention-test" className="d-btn min-h-12 bg-white px-6 text-base text-[#1700FF] sm:min-h-14 sm:px-7">
                  Take the Attention Test
                </a>
                <a href="#book" className="d-btn min-h-12 border-2 border-white px-6 text-base text-white sm:min-h-14 sm:px-7">
                  Book a free audit
                </a>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <BoltSeats open={REMAINING_SPOTS} className="h-6" />
                <p className="text-sm font-semibold">We take 5 clients at a time. {REMAINING_SPOTS} spots open.</p>
              </div>
            </>
          }
        />

        {/* ============ Manifesto ============ */}
        <Manifesto
          text="Nobody buys from a business they’ve never seen. We put you in front of the right people every day, then turn that attention into customers you can count. Every week, in plain numbers."
          charged={["seen.", "customers"]}
        />

        {/* ============ Proof ============ */}
        <section aria-label="Proof in numbers" className="d-section">
          <div className="d-wrap">
            <ProofNumbers
              stats={[
                { value: 3, unit: "months", label: "Glaucia, from launch to break-even." },
                { value: 48, unit: "hours", label: "From your free audit to a written growth plan." },
                { value: 5, unit: "clients", label: "At a time, so the founder runs every account." },
              ]}
            />
          </div>
        </section>

        {/* ============ Services: the switchboard ============ */}
        <section id="services" aria-labelledby="services-title" className="scroll-mt-16 d-section !pt-0">
          <div className="d-wrap">
            <p className="d-kicker">What we do</p>
            <h2 id="services-title" className="d-display d-h2">
              Every kind of attention, <Mark>working for you.</Mark>
            </h2>
            <div className="mt-12">
              <Switchboard services={SERVICES} />
            </div>
          </div>
        </section>

        {/* ============ The Attention Test ============ */}
        <section id="attention-test" aria-labelledby="test-title" className="b-takeover scroll-mt-16 d-section">
          <div className="d-wrap grid gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em]">The Attention Test · 60 seconds</p>
              <h2 id="test-title" className="d-display d-h2 mt-4">
                How many of your future customers have actually seen you?
              </h2>
            </div>
            <AttentionTest
              onResult={setResult}
              next={(r) => (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="grid content-start gap-3">
                    <p className="text-lg font-bold">Fix it with us</p>
                    <p>Book the free audit. Your answers go with your booking, so we start with your biggest gap.</p>
                    <a href="#book" className="d-btn min-h-12 justify-self-start bg-white px-6 text-base text-[#1700FF]">
                      Book with my answers
                    </a>
                  </div>
                  <div className="grid content-start gap-3">
                    <p className="text-lg font-bold">Ask a quick question</p>
                    <p>Send your score of {r.score} on WhatsApp. We reply within 6 to 12 hours.</p>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={trackWhatsApp}
                      className="d-btn min-h-12 justify-self-start border-2 border-white px-6 text-base text-white"
                    >
                      Send on WhatsApp
                    </a>
                  </div>
                  <div className="grid content-start gap-3">
                    <p className="text-lg font-bold">Get the full report</p>
                    {sendState === "sent" ? (
                      <p role="status" className="font-semibold">
                        Got it. Your report and three next steps are on their way within 12 hours.
                      </p>
                    ) : (
                      <form onSubmit={sendReport} className="grid gap-3">
                        <label className="sr-only" htmlFor="rep-name">
                          Your name
                        </label>
                        <input id="rep-name" name="name" required autoComplete="name" placeholder="Your name" className="b-input" />
                        <label className="sr-only" htmlFor="rep-email">
                          Your email
                        </label>
                        <input id="rep-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="b-input" />
                        <button
                          type="submit"
                          disabled={sendState === "sending"}
                          className="d-btn min-h-12 justify-self-start bg-white px-6 text-base text-[#1700FF]"
                        >
                          {sendState === "sending" ? "Sending…" : "Email me the report"}
                        </button>
                        {sendState === "not_sent" ? (
                          <p role="alert" className="text-sm font-semibold">
                            That didn’t send. Write to {CONTACT_EMAIL} and we’ll reply the same day.
                          </p>
                        ) : null}
                      </form>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </section>

        {/* ============ The money dial ============ */}
        <section id="calculator" aria-labelledby="calc-title" className="b-night scroll-mt-16 d-section">
          <div className="d-wrap grid gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em]">The money dial</p>
              <h2 id="calc-title" className="d-display d-h2 mt-4">
                What is a better hook worth?
              </h2>
              <p className="d-lead">Same budget, same people. The hook decides how many of them stop, click and buy.</p>
            </div>
            <MoneyDial />
          </div>
        </section>

        {/* ============ The work reel ============ */}
        <WorkReel label="Results: Glaucia and Rivage">
          <ReelPanel tone="white" wide>
            <p className="d-kicker">Results</p>
            <h2 className="d-display d-h2">
              Brands we put <Mark>in front of people.</Mark>
            </h2>
            <p className="d-lead">A fashion launch that broke even in three months, and an eyewear brand built to be noticed.</p>
            <a href="#book" className="d-btn d-btn-forest mt-12 min-h-14 justify-self-start px-7 text-base">
              Get a plan like this, free
            </a>
          </ReelPanel>

          <ReelPanel tone="navy" wide>
            <p className="text-sm font-semibold uppercase tracking-[0.14em]">Case study · Glaucia · fashion launch</p>
            <p className="d-display mt-6 flex items-baseline gap-4 leading-none">
              <span className="text-[clamp(6rem,14vw,11rem)]">3</span>
              <span className="text-3xl uppercase">months</span>
            </p>
            <p className="d-display mt-2 text-2xl uppercase">
              <span className="bg-white px-[0.12em] text-[#052662]">From launch to break-even.</span>
            </p>
            <p className="mt-8 max-w-[30rem] text-lg">
              A single-product fashion brand with no identity, content or audience. We built the brand, shot the campaign and ran the paid
              launch.
            </p>
          </ReelPanel>

          <ReelPanel tone="navy">
            <img
              src={glauciaCampaign.url}
              alt="Glaucia fashion campaign featuring two models wearing the branded clothing produced for the launch"
              loading="lazy"
              className="b-panel-img"
            />
          </ReelPanel>

          <ReelPanel tone="blue" wide>
            <BoltIcon className="h-12 w-auto" />
            <blockquote className="d-display mt-8 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight">
              “They never promised overnight miracles. We got an honest plan, weekly updates, and the brand paid for itself by month three,
              exactly as they said it would.”
              <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.14em]">Amr, founder of Glaucia</footer>
            </blockquote>
          </ReelPanel>

          <ReelPanel tone="white" wide>
            <p className="d-kicker">Case study · Rivage · premium eyewear</p>
            <h3 className="d-display d-h2">
              An eyewear brand <Mark>built to be noticed.</Mark>
            </h3>
            <p className="d-lead">
              Italian craftsmanship with Mediterranean and Middle Eastern sensibility. Identity, campaign, product photography and every
              piece the customer touches.
            </p>
            <p className="d-display mt-8 text-2xl">“Vision beyond sight.”</p>
          </ReelPanel>

          {RIVAGE_SHOTS.map((s) => (
            <ReelPanel key={s.file} tone="white">
              <figure className="grid h-full content-center gap-3">
                <img src={`/work/rivage/${s.file}.webp`} alt={s.alt} width={900} height={1124} loading="lazy" className="b-panel-img" />
                <figcaption className="text-sm font-semibold">{s.caption}</figcaption>
              </figure>
            </ReelPanel>
          ))}

          <ReelPanel tone="blue" wide>
            <h3 className="d-display d-h2">Your brand next?</h3>
            <p className="d-lead">A 30-minute audit and a written plan within 48 hours. Free.</p>
            <a href="#book" className="d-btn mt-12 min-h-14 justify-self-start bg-white px-7 text-base text-[#1700FF]">
              Book a free audit
            </a>
          </ReelPanel>
        </WorkReel>

        {/* ============ Letter from the founder ============ */}
        <section id="about" aria-labelledby="about-title" className="scroll-mt-16 d-section">
          <div className="d-wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="d-kicker">Letter from the founder</p>
              <h2 id="about-title" className="d-display d-h2">
                Not a big agency. <Mark>That’s the point.</Mark>
              </h2>
            </div>
            <div className="grid max-w-[36rem] gap-6 text-lg lg:col-span-6 lg:col-start-7">
              <p>
                I started Chrizos Media after seeing how large agencies treat growing businesses: one account among hundreds, generic
                playbooks, and results nobody is truly accountable for.
              </p>
              <p>
                So we built the opposite. A small, ambitious team that treats every client as the top priority. We only take on five clients
                at a time, so each one gets full attention instead of being passed down a chain.
              </p>
              <p>You talk to the person doing the work, every time. And every week you see the numbers, good or bad.</p>
              <p className="font-semibold">Youssef Christofides · Founder, Chrizos Media</p>
            </div>
          </div>
        </section>

        {/* ============ How it works ============ */}
        <section id="how" aria-labelledby="how-title" className="b-grey scroll-mt-16 d-section">
          <div className="d-wrap">
            <p className="d-kicker">How it works</p>
            <h2 id="how-title" className="d-display d-h2">
              From first call to first results.
            </h2>
            <ol className="mt-12 border-t-2 border-[var(--d-ink)]">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[4rem_1fr] gap-4 border-b-2 border-[var(--d-ink)] py-8 sm:grid-cols-[8rem_1fr_1fr] sm:gap-8">
                  <span className="d-display text-5xl leading-none text-[var(--d-lime)] sm:text-7xl">0{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em]">{s.when}</p>
                    <h3 className="d-display mt-2 text-3xl uppercase">{s.title}</h3>
                  </div>
                  <p className="col-start-2 max-w-[30rem] text-lg sm:col-start-3 sm:self-end">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 d-section">
          <div className="d-wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="d-kicker">Questions</p>
              <h2 id="faq-title" className="d-display d-h2">
                Answered plainly.
              </h2>
            </div>
            <div className="lg:col-span-8">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b-2 border-[var(--d-ink)]">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold">
                    {f.q}
                    <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[var(--d-ink)] text-2xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[36rem] pb-8 text-lg">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ The offer + booking ============ */}
        <section id="book" aria-labelledby="book-title" className="b-takeover scroll-mt-16 d-section">
          <div className="d-wrap">
            <p className="text-sm font-semibold uppercase tracking-[0.14em]">Claim one of the {REMAINING_SPOTS} remaining spots</p>
            <h2 id="book-title" className="d-display d-h2 mt-4">
              The free audit. <span className="bg-white px-[0.12em] text-[#052662]">Zero pitch.</span>
            </h2>
            <div className="mt-12 flex flex-col gap-8 bg-white p-8 text-[#052662] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="d-display text-2xl uppercase">We only take 5 clients at a time.</p>
                <p className="mt-2 text-lg">So the founder runs every account. Right now {REMAINING_SPOTS} spots are open.</p>
              </div>
              <span className="text-[#1700FF]">
                <BoltSeats open={REMAINING_SPOTS} className="h-14" />
              </span>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="grid content-start gap-8 lg:col-span-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em]">Your audit includes</p>
                  <ul className="mt-4 grid gap-4">
                    {OFFER.map((o) => (
                      <li key={o.title} className="flex gap-3">
                        <BoltIcon className="mt-1 h-5 w-auto shrink-0" />
                        <span>
                          <b>{o.title}.</b> <span className="opacity-85">{o.body}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-white/30 pt-4 text-sm font-semibold">Price: free · 30 minutes · no obligation</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-lg font-bold">Our promise</p>
                  <p>If you don’t leave with at least one clear idea you can use, we’ll do a second audit, free.</p>
                </div>
                <div className="grid gap-3">
                  <p className="text-lg font-bold">Prefer to talk first?</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={trackWhatsApp}
                      className="d-btn min-h-12 border-2 border-white px-6 text-base text-white"
                    >
                      Ask on WhatsApp
                    </a>
                    <button type="button" onClick={copyEmail} className="d-btn min-h-12 border-2 border-white px-6 text-base text-white">
                      {copied ? "Email copied" : CONTACT_EMAIL}
                    </button>
                  </div>
                  <p className="text-sm opacity-85">We reply to every message within 6 to 12 hours.</p>
                </div>
              </div>
              <div className="lg:col-span-7">
                {result ? (
                  <p className="mb-3 text-sm font-semibold">
                    <span className="bg-white px-1 text-[#052662]">Your Attention Test answers are attached ({result.score}/100).</span>
                  </p>
                ) : null}
                <CalendlyD
                  url={settings.calendly_url}
                  notes={result?.summary}
                  colours={{ background: "ffffff", text: "052662", primary: "1700ff" }}
                  icon={<img src="/b/favicon.svg" alt="" width={56} height={56} className="h-14 w-14" />}
                  onBooked={() => {
                    void logBooking({ data: { source: "calendly" } });
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ Footer: the logo, edge to edge ============ */}
      <footer className="bg-[#031A45] px-6 pb-12 pt-24 text-white lg:px-12">
        <div className="d-wrap grid gap-16">
          <p className="d-display text-[clamp(2rem,5vw,4rem)] uppercase leading-none">
            More eyes.
            <br />
            <span className="bg-white px-[0.12em] text-[#052662]">More customers.</span>
          </p>
          <img src="/b/logo-white.svg" alt="Chrizos Media" width={952} height={386} loading="lazy" className="h-auto w-full" />
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/20 pt-6 text-sm">
            <p className="font-semibold">© {new Date().getFullYear()} Chrizos Media</p>
            <div className="flex flex-wrap gap-x-6">
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="d-link inline-flex min-h-11 items-center text-white">
                Instagram
              </a>
              <a href="#attention-test" className="d-link inline-flex min-h-11 items-center text-white">
                Attention Test
              </a>
              <a href="#book" className="d-link inline-flex min-h-11 items-center text-white">
                Book a free audit
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
