import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import glauciaCampaign from "../assets/glaucia-campaign-shoot.png.asset.json";
import { DEFAULT_SETTINGS, getSiteSettings, trackBookingClick } from "@/lib/site-settings.functions";
import { sendContactInquiry } from "@/lib/contact.functions";
import { D_FONTS_HREF, IconD, LogoD, Mark, SafeImageD, Sparkline, Ticker, usePrintCanvas } from "@/components/site-d/brand-d";
import { LeakQuiz, type QuizResult } from "@/components/site-d/leak-quiz";
import { GrowthCalc } from "@/components/site-d/growth-calc";
import { CalendlyD } from "@/components/site-d/calendly-d";
import { HOMEPAGE } from "@/lib/homepage";
import { AttentionStory } from "@/components/site-d/attention-story";
import { Scribble, SlideBand } from "@/components/site-d/play-d";
import { AdsFunnel, BrandMap, BreakEvenChart, ContentCalendar, ResultsTimeline, SearchRank, Seats } from "@/components/site-d/infographics-d";

const REMAINING_SPOTS = 2;

const SERVICES = [
  {
    section: "Attention you buy",
    name: "Ads",
    headline: "Put your business in front of thousands of the right people. Every day.",
    standfirst: "Meta and Google campaigns with new hooks tested every month, reported in customers, not clicks.",
    points: [
      "Meta and Google campaigns, set up and managed",
      "New hooks tested every month, winners scaled",
      "Retargeting, so paid attention doesn’t walk away",
      "A weekly report in customers, not clicks",
    ],
    first: "2 to 4 weeks",
  },
  {
    section: "Attention you earn",
    name: "Content",
    headline: "Posts people stop for, then act on.",
    standfirst: "Build attention and trust before you ever ask for the sale.",
    points: ["A monthly content calendar", "Hooks, captions and ideas written to prompt action", "Launches planned around your key dates"],
    first: "4 to 6 weeks",
  },
  {
    section: "Attention you’re found by",
    name: "SEO",
    headline: "Found on Google by people ready to buy.",
    standfirst: "Show up when customers search for exactly what you sell.",
    points: ["Website health fixes: speed, access, structure", "Pages built around real searches", "Content that ranks and brings free traffic"],
    first: "2 to 3 months",
  },
  {
    section: "Attention that sticks",
    name: "Brand",
    headline: "Know what to say, and why you win.",
    standfirst: "Positioning and messaging that make you the easy choice.",
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

const RIVAGE_DELIVERABLES = ["Brand identity", "Vision and mission", "Campaign shoot", "Product photography", "Packaging", "Print pieces"];

const RIVAGE_SHOTS = [
  { file: "campaign-man", caption: "Campaign · the R5", alt: "Man wearing Rivage R5 sunglasses in the campaign shoot" },
  { file: "swan", caption: "Campaign · the R5 in Sage", alt: "A white swan wearing Rivage sunglasses with green lenses" },
  { file: "campaign-woman", caption: "Campaign", alt: "Woman wearing Rivage sunglasses in the campaign shoot" },
  { file: "product-black", caption: "Product · matte black", alt: "Close-up of matte black Rivage sunglasses" },
  { file: "product-green", caption: "Product · grey with green lenses", alt: "Rivage sunglasses with a grey frame and green lenses" },
  { file: "leather-case", caption: "Packaging · leather case", alt: "Rivage premium green leather glasses case" },
  { file: "bags", caption: "Packaging · shopping bags", alt: "Stack of green Rivage shopping bags" },
  { file: "welcome-card", caption: "Print · welcome card", alt: "Rivage welcome card that reads You're in" },
  { file: "lens-cloth", caption: "Packaging · lens cloth", alt: "Cream Rivage lens cleaning cloth" },
];

const WHATSAPP_BASE = "Hi Chrizos Media, I'd like to ask about your services.";

function StepIcon({ index }: { index: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...common}>
      {index === 0 ? (
        <>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M11 18.5h2" />
        </>
      ) : index === 1 ? (
        <>
          <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
          <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
        </>
      ) : (
        <>
          <path d="M4 20h16" />
          <path d="M6 16v-3M10 16v-6M14 16v-4M18 16V6" />
        </>
      )}
    </svg>
  );
}

const SITE_TITLE = "Chrizos Media | More eyes. More customers.";
const SITE_DESCRIPTION =
  "Most businesses don't have a product problem. They have an attention problem. Founder-led paid ads, content and SEO for growing businesses. Get your free Attention Score in 60 seconds.";
const OG_IMAGE = "https://chrizosmedia.com/d/og-image.png";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  beforeLoad: () => {
    if (HOMEPAGE === "classic") throw redirect({ to: "/classic" });
  },
  loader: () => getSiteSettings(),
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#0D3B2E" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:site_name", content: "Chrizos Media" },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Great businesses don't have a product problem. They have an attention problem." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "google-site-verification", content: "uzzj9R9Aahmkmf3VYqislFgiWItzv8dwuVJ5lUHZKc0" },
    ],
    links: [
      { rel: "canonical", href: "https://chrizosmedia.com/" },
      { rel: "icon", href: "/d/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/d/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: D_FONTS_HREF },
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
          logo: "https://chrizosmedia.com/d/icon-512.png",
          image: OG_IMAGE,
          knowsAbout: ["Paid Advertising", "Meta Ads", "Google Ads", "Content Strategy", "Brand Strategy", "SEO"],
          serviceType: ["Paid Advertising", "Content Strategy", "Brand Strategy & Consulting", "SEO"],
          sameAs: ["https://www.instagram.com/chrizosmedia/"],
        }),
      },
    ],
  }),
  component: OptionD,
});

function OptionD() {
  const settings = Route.useLoaderData() ?? DEFAULT_SETTINGS;
  const CONTACT_EMAIL = settings.contact_email;
  const logBooking = useServerFn(trackBookingClick);
  const submitInquiry = useServerFn(sendContactInquiry);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [copied, setCopied] = useState(false);
  usePrintCanvas();

  const waText = result ? `${WHATSAPP_BASE}\n\nI took the Attention Score test.\n${result.summary}` : WHATSAPP_BASE;
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

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="d-root overflow-x-clip">
      <a href="#main-d" className="d-skip">
        Skip to content
      </a>

      {/* ============ Masthead ============ */}
      <div className="border-b border-[var(--d-rule)] px-6 lg:px-12">
        <div className="d-mono d-wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-xs sm:text-sm">
          <span suppressHydrationWarning>The Growth Report · Issue 01 · {today}</span>
          <span className="flex items-center gap-2 font-semibold">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--d-moss)]" />
            Onboarding 5 clients · {REMAINING_SPOTS} spots left
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b-2 border-[var(--d-ink)] bg-[var(--d-print)] px-6 lg:px-12">
        <div className="d-wrap flex items-center justify-between gap-6 py-4">
          <a href="#top" className="inline-flex min-h-11 items-center text-[1.75rem] sm:text-[2.1rem]" aria-label="Chrizos Media home">
            <LogoD />
          </a>
          <nav aria-label="Primary" className="flex items-center gap-6">
            <a href="#attention-score" className="d-link hidden min-h-11 items-center text-base no-underline lg:inline-flex">
              Attention Score
            </a>
            <a href="#services" className="d-link hidden min-h-11 items-center text-base no-underline md:inline-flex">
              Services
            </a>
            <a href="#results" className="d-link hidden min-h-11 items-center text-base no-underline md:inline-flex">
              Results
            </a>
            <a href="#faq" className="d-link hidden min-h-11 min-w-11 items-center justify-center text-base no-underline lg:inline-flex">
              FAQ
            </a>
            <a href="#book" className="d-btn d-btn-forest min-h-11 px-5 text-sm">
              Book a free audit
            </a>
          </nav>
        </div>
      </header>

      <main id="main-d">
        {/* ============ Front page ============ */}
        <section id="top" className="d-section !pt-16 lg:!pt-24">
          <div className="d-wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="d-kicker">Front page · For growing businesses</p>
              <h1 className="d-display d-h1 mt-4">
                Great businesses don’t have a <Scribble kind="strike">product problem.</Scribble> They have an{" "}
                <Mark>attention problem.</Mark>
              </h1>
              <p className="d-lead">
                We run the paid ads and content that put you in front of the right people every day, and turn that attention into
                customers. Run personally by the founder.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <a href="#attention-score" className="d-btn d-btn-forest min-h-14 px-7 text-base">
                  Get my Attention Score
                </a>
                <a href="#book" className="d-btn d-btn-line min-h-14 px-7 text-base">
                  Book a free audit
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <Seats open={REMAINING_SPOTS} size="sm" />
                <p className="text-sm font-semibold">
                  We take 5 clients at a time. {REMAINING_SPOTS} spots open.
                </p>
              </div>
            </div>

            <aside aria-label="Case study" className="d-card self-end p-8 lg:col-span-4">
              <p className="d-kicker">Case study · Glaucia</p>
              <p className="d-display mt-3 text-6xl leading-none">
                3 <span className="text-2xl">months</span>
              </p>
              <p className="mt-1 text-base font-semibold">from launch to break-even</p>
              <Sparkline points={[2, 3, 2.6, 4, 5.2, 4.8, 7, 8.4, 10]} className="mt-4 h-16 w-full" label="Rising revenue after launch" />
              <p className="mt-4 text-sm">Brand, campaign shoot, launch content and paid ads, from zero.</p>
              <a href="#results" className="d-link mt-2 inline-flex min-h-11 items-center text-sm">
                Read the story
              </a>
            </aside>
          </div>
        </section>

        <Ticker
          items={[
            { label: "GLAUCIA", value: "break-even in month 3" },
            { label: "ADS", value: "first results in 2 to 4 weeks" },
            { label: "HOOKS", value: "new tests every month" },
            { label: "CONTENT", value: "4 to 6 weeks" },
            { label: "SEO", value: "2 to 3 months" },
            { label: "AUDIT", value: "written plan in 48 hours" },
            { label: "REPLIES", value: "within 6 to 12 hours" },
          ]}
        />

        <AttentionStory />

        {/* ============ Attention Score ============ */}
        <section id="attention-score" aria-labelledby="leak-title" className="scroll-mt-24 d-section">
          <div className="d-wrap">
            <p className="d-kicker">The Attention Score</p>
            <h2 id="leak-title" className="d-display d-h2">
              How many of your future customers have actually seen you?
            </h2>
            <p className="d-lead">
              Five questions about your ads and your reach. You get a score out of 100 and the three biggest attention gaps, each with a
              fix you can start on today.
            </p>
            <div className="mt-12 max-w-4xl">
              <LeakQuiz onResult={setResult} />
            </div>

            {result ? (
              <div className="mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
                <div className="d-rule-top grid content-start gap-3 pt-4">
                  <p className="text-lg font-semibold">Fix it with us</p>
                  <p>Book the free audit. Your answers go with your booking, so we start with your biggest gap.</p>
                  <a href="#book" className="d-btn d-btn-forest min-h-12 justify-self-start px-6 text-base">
                    Book with my answers
                  </a>
                </div>
                <div className="d-rule-top grid content-start gap-3 pt-4">
                  <p className="text-lg font-semibold">Ask a quick question</p>
                  <p>Send your score on WhatsApp. We reply within 6 to 12 hours.</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={trackWhatsApp} className="d-btn d-btn-line min-h-12 justify-self-start px-6 text-base">
                    Send on WhatsApp
                  </a>
                </div>
                <div className="d-rule-top grid content-start gap-3 pt-4">
                  <p className="text-lg font-semibold">Get the full report</p>
                  {sendState === "sent" ? (
                    <p role="status" className="font-semibold">
                      Got it. Your report and three next steps are on their way within 12 hours.
                    </p>
                  ) : (
                    <form onSubmit={sendReport} className="grid gap-3">
                      <label className="sr-only" htmlFor="rep-name">
                        Your name
                      </label>
                      <input id="rep-name" name="name" required autoComplete="name" placeholder="Your name" className="d-input" />
                      <label className="sr-only" htmlFor="rep-email">
                        Your email
                      </label>
                      <input id="rep-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="d-input" />
                      <button type="submit" disabled={sendState === "sending"} className="d-btn d-btn-lime min-h-12 justify-self-start px-6 text-base">
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
            ) : null}
          </div>
        </section>

        {/* ============ Calculator ============ */}
        <section id="calculator" aria-labelledby="calc-title" className="scroll-mt-24 border-t-2 border-[var(--d-ink)] d-section">
          <div className="d-wrap">
            <p className="d-kicker">The ad calculator</p>
            <h2 id="calc-title" className="d-display d-h2">
              Same budget. <Mark>Better hooks.</Mark> More customers.
            </h2>
            <p className="d-lead">
              Paid attention is bought by the thousand views. The hook decides how many of those people stop. See what that’s worth.
            </p>
            <div className="mt-12">
              <GrowthCalc />
            </div>
          </div>
        </section>

        <SlideBand top="ATTENTION IN ▲ " bottom="CUSTOMERS OUT ▲" />

        {/* ============ Services ============ */}
        <section id="services" aria-labelledby="services-title" className="scroll-mt-24 border-t-2 border-[var(--d-ink)] d-section">
          <div className="d-wrap">
            <p className="d-kicker">In this issue</p>
            <h2 id="services-title" className="d-display d-h2">
              Every kind of attention, <Mark>working for you.</Mark>
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {SERVICES.map((s, i) =>
                i === 0 ? (
                  <article key={s.name} className="d-lift grid gap-12 border-2 border-[var(--d-ink)] bg-[var(--d-lime)] p-8 md:col-span-3 md:grid-cols-2 lg:p-12">
                    <div className="grid content-start gap-4">
                      <p className="d-kicker text-[var(--d-ink)]">
                        Lead story · {s.section} · {s.name}
                      </p>
                      <h3 className="d-display d-h2 !mt-0">{s.headline}</h3>
                      <ul className="grid gap-2 text-lg">
                        {s.points.map((pt) => (
                          <li key={pt} className="flex gap-3">
                            <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 bg-[var(--d-ink)]" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="self-center">
                      <AdsFunnel />
                    </div>
                  </article>
                ) : (
                  <article key={s.name} className="d-lift grid content-start gap-6 border-2 border-[var(--d-ink)] bg-[var(--d-print)] p-8">
                    <p className="d-kicker text-[var(--d-ink)]">
                      {s.section} · {s.name}
                    </p>
                    <h3 className="d-display d-h3">{s.headline}</h3>
                    <div className="py-2">{s.name === "Content" ? <ContentCalendar /> : s.name === "SEO" ? <SearchRank /> : <BrandMap />}</div>
                    <ul className="grid gap-2">
                      {s.points.map((pt) => (
                        <li key={pt} className="flex gap-3">
                          <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 bg-[var(--d-lime)] ring-1 ring-[var(--d-ink)]" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </article>
                ),
              )}
            </div>

            <div className="mt-32">
              <p className="d-kicker">Timing</p>
              <h3 className="d-display d-h2">When you’ll see first results.</h3>
              <div className="mt-12">
                <ResultsTimeline />
              </div>
            </div>
          </div>
        </section>

        {/* ============ Feature: Glaucia ============ */}
        <section id="results" aria-labelledby="results-title" className="d-forest scroll-mt-24 d-section">
          <div className="d-wrap">
            <p className="d-kicker">Feature · Fashion brand launch</p>
            <h2 id="results-title" className="d-display d-h2">
              How Glaucia went from zero to <Mark>break-even in 3 months.</Mark>
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <figure className="lg:col-span-5">
                <div className="d-taped mx-2 mt-4">
                  <SafeImageD
                    src={glauciaCampaign.url}
                    alt="Glaucia fashion campaign featuring two models wearing the branded clothing produced for the launch"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <figcaption className="d-mono mt-6 text-sm text-[var(--d-muted)]">Campaign shoot produced for the launch.</figcaption>
              </figure>
              <div className="grid content-start gap-8 lg:col-span-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="d-kicker">The problem</p>
                    <p className="mt-2 text-lg">A single-product fashion brand with no identity, no content and no audience, starting from zero before its first campaign.</p>
                  </div>
                  <div>
                    <p className="d-kicker">What we did</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {["Brand identity", "Product production", "Campaign shoot", "Product images", "Social reels", "Paid launch"].map((d) => (
                        <li key={d} className="rounded-full border border-[var(--d-print)] px-3 py-1 text-sm">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <blockquote className="d-display d-h3 border-l-4 border-[var(--d-lime)] pl-6">
                  “They never promised overnight miracles. We got an honest plan, weekly updates, and the brand paid for itself by month three,
                  exactly as they said it would.”
                  <footer className="d-kicker mt-4 not-italic">Amr, founder of Glaucia</footer>
                </blockquote>
                <div className="border-t border-[var(--d-rule)] pt-6">
                  <p className="d-kicker">Revenue against spend, first 5 months</p>
                  <BreakEvenChart />
                </div>
              </div>
            </div>

            {/* ---------- Feature 2: Rivage ---------- */}
            <div className="mt-32 border-t border-[var(--d-rule)] pt-16">
              <p className="d-kicker">Also in this issue · Premium eyewear</p>
              <h3 className="d-display d-h2">
                Rivage: an eyewear brand <Mark>built to be noticed.</Mark>
              </h3>
              <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
                <div className="grid content-start gap-6 lg:col-span-4">
                  <p className="text-lg">
                    Italian craftsmanship meets Mediterranean and Middle Eastern sensibility. The brand was built from its story out: identity,
                    campaign, product photography and every piece the customer touches.
                  </p>
                  <p className="d-display border-l-4 border-[var(--d-lime)] pl-5 text-2xl">“Vision beyond sight.”</p>
                  <div>
                    <p className="d-kicker">What we made</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {RIVAGE_DELIVERABLES.map((d) => (
                        <li key={d} className="rounded-full border border-[var(--d-print)] px-3 py-1 text-sm">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="min-w-0 lg:col-span-8">
                  <ul aria-label="Rivage brand work" className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:mx-0 lg:px-0">
                    {RIVAGE_SHOTS.map((shot) => (
                      <li key={shot.file} className="w-[62vw] max-w-[18rem] shrink-0 snap-start sm:w-[16rem]">
                        <figure>
                          <img
                            src={`/work/rivage/${shot.file}.webp`}
                            alt={shot.alt}
                            width={900}
                            height={1124}
                            loading="lazy"
                            className="aspect-[4/5] w-full bg-[var(--d-print)] object-cover"
                          />
                          <figcaption className="d-mono mt-2 text-xs text-[var(--d-muted)]">{shot.caption}</figcaption>
                        </figure>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-4">
              <a href="#book" className="d-btn d-btn-lime min-h-14 px-8 text-base">
                Get a plan like this, free
              </a>
              <p className="d-mono text-sm">30-minute audit · plan within 48 hours</p>
            </div>
          </div>
        </section>

        {/* ============ Letter from the founder ============ */}
        <section id="about" aria-labelledby="about-title" className="scroll-mt-24 d-section">
          <div className="d-wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="d-kicker">Letter from the founder</p>
              <h2 id="about-title" className="d-display d-h2">
                Not a big agency. <Mark>That’s the point.</Mark>
              </h2>
            </div>
            <div className="grid max-w-[36rem] gap-6 text-lg lg:col-span-7 lg:col-start-6">
              <p>
                I started Chrizos Media after seeing how large agencies treat growing businesses: one account among hundreds, generic
                playbooks, and results nobody is truly accountable for.
              </p>
              <p>
                So we built the opposite. A small, ambitious team that treats every client as the top priority. We only take on five clients
                at a time, so each one gets full attention instead of being passed down a chain.
              </p>
              <p>You talk to the person doing the work, every time. And every week you see the numbers, good or bad.</p>
              <p className="d-mono text-sm">Youssef Christofides · Founder, Chrizos Media</p>
            </div>
          </div>
        </section>

        {/* ============ How it works ============ */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-24 border-t-2 border-[var(--d-ink)] d-section">
          <div className="d-wrap">
            <p className="d-kicker">How it works</p>
            <h2 id="how-title" className="d-display d-h2">
              From first call to first results.
            </h2>
            <ol className="relative mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
              <span aria-hidden className="absolute left-8 top-8 hidden h-0.5 w-[calc(100%-4rem)] bg-[var(--d-ink)] md:block" />
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative grid content-start gap-3">
                  <span
                    aria-hidden
                    className={`grid h-16 w-16 place-items-center rounded-full border-2 border-[var(--d-ink)] ${
                      i === STEPS.length - 1 ? "bg-[var(--d-lime)]" : "bg-[var(--d-print)]"
                    }`}
                  >
                    <StepIcon index={i} />
                  </span>
                  <p className="d-mono text-sm">
                    Step {i + 1} · {s.when}
                  </p>
                  <h3 className="d-display d-h3">{s.title}</h3>
                  <p className="text-lg">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 border-t-2 border-[var(--d-ink)] d-section">
          <div className="d-wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="d-kicker">Questions</p>
              <h2 id="faq-title" className="d-display d-h2">
                Answered plainly.
              </h2>
            </div>
            <div className="lg:col-span-8">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-[var(--d-ink)]">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold">
                    {f.q}
                    <span aria-hidden className="d-display text-3xl transition-transform group-open:rotate-45">
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
        <section id="book" aria-labelledby="book-title" className="d-forest scroll-mt-24 d-section">
          <div className="d-wrap">
            <p className="d-kicker">Claim one of the {REMAINING_SPOTS} remaining spots</p>
            <h2 id="book-title" className="d-display d-h2">
              The free audit. <Mark>Zero pitch.</Mark>
            </h2>
            <div className="mt-12 flex flex-col gap-8 rounded-sm bg-[var(--d-print)] p-8 text-[var(--d-ink)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="d-display d-h3">We only take 5 clients at a time.</p>
                <p className="mt-2 text-lg">So the founder runs every account. Right now {REMAINING_SPOTS} spots are open.</p>
              </div>
              <Seats open={REMAINING_SPOTS} />
            </div>
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="grid content-start gap-8 lg:col-span-5">
                <div className="border-4 border-double border-[var(--d-print)] p-8">
                  <p className="d-kicker">Your audit includes</p>
                  <ul className="mt-4 grid gap-4">
                    {OFFER.map((o) => (
                      <li key={o.title} className="flex gap-3">
                        <span aria-hidden className="d-mono text-[var(--d-lime)]">▲</span>
                        <span>
                          <b>{o.title}.</b> <span className="text-[var(--d-muted)]">{o.body}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="d-mono mt-6 border-t border-[var(--d-rule)] pt-4 text-sm">Price: free · 30 minutes · no obligation</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-lg font-semibold">Our promise</p>
                  <p>If you don’t leave with at least one clear idea you can use, we’ll do a second audit, free.</p>
                </div>
                <div className="grid gap-3">
                  <p className="text-lg font-semibold">Prefer to talk first?</p>
                  <div className="flex flex-wrap gap-3">
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={trackWhatsApp} className="d-btn d-btn-line min-h-12 px-6 text-base">
                      Ask on WhatsApp
                    </a>
                    <button type="button" onClick={copyEmail} className="d-btn d-btn-line min-h-12 px-6 text-base">
                      {copied ? "Email copied" : CONTACT_EMAIL}
                    </button>
                  </div>
                  <p className="text-sm text-[var(--d-muted)]">We reply to every message within 6 to 12 hours.</p>
                </div>
              </div>
              <div className="lg:col-span-7">
                {result ? (
                  <p className="d-mono mb-3 text-sm">
                    <span className="bg-[var(--d-lime)] px-1 text-[var(--d-ink)]">Your Attention Score answers are attached ({result.score}/100).</span>
                  </p>
                ) : null}
                <CalendlyD
                  url={settings.calendly_url}
                  notes={result?.summary}
                  onBooked={() => {
                    void logBooking({ data: { source: "calendly" } });
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ Footer ============ */}
      <footer className="bg-[var(--d-forest-deep)] px-6 pb-12 pt-24 text-[var(--d-print)] lg:px-12">
        <div className="d-wrap grid gap-12">
          <span className="block text-[clamp(3rem,11vw,9rem)] leading-none">
            <LogoD tone="forest" />
          </span>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[rgba(243,239,228,0.2)] pt-6 text-sm">
            <p className="d-mono flex items-center gap-3">
              <IconD tone="forest" className="h-6 w-6" />
              Growth you can measure. © {new Date().getFullYear()} Chrizos Media
            </p>
            <div className="flex flex-wrap gap-x-6">
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="d-link inline-flex min-h-11 items-center">
                Instagram
              </a>
              <a href="#attention-score" className="d-link inline-flex min-h-11 items-center">
                Attention Score
              </a>
              <a href="#book" className="d-link inline-flex min-h-11 items-center">
                Book a free audit
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
