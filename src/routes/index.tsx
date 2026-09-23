import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import logoWhite from "../assets/chrizos-logo-white.webp";
import logoWhiteSmall from "../assets/chrizos-logo-white-small.webp";
import { Reveal } from "@/components/reveal";
import { sendContactInquiry } from "@/lib/contact.functions";
import {
  ContentFlow,
  GrowthFlow,
  ProblemFlow,
  ProofFlow,
  StrategyFlow,
} from "@/components/fluid-illustrations";

const CONTACT_EMAIL = "chrizosmedia@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/chrizosmedia/";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Chrizos Media | Marketing & Advertising Agency" },
      {
        name: "description",
        content:
          "Chrizos Media helps ambitious businesses turn attention into sales, revenue, and recognition through paid advertising, content strategy, and brand consulting.",
      },
      { property: "og:title", content: "Chrizos Media | Marketing & Advertising Agency" },
      {
        property: "og:description",
        content:
          "A boutique digital marketing agency for paid advertising, content strategy, and brand consulting that turns attention into measurable growth.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://graphics-gleam-lab.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://graphics-gleam-lab.lovable.app/" }],
  }),
  component: Index,
});

type Service = {
  number: string;
  title: string;
  tagline: string;
  description: string;
  points: string[];
  visual: "growth" | "content" | "strategy";
};

const services: Service[] = [
  {
    number: "01",
    title: "Paid Advertising",
    tagline: "Turn ad spend into sales, leads, and measurable momentum.",
    description:
      "Campaign strategy and management across Meta (Instagram & Facebook), Google, and TikTok, built around sharper tracking, stronger offers, and better conversion paths so spend has a clear commercial job.",
    points: [
      "Meta (Instagram & Facebook), Google & TikTok ads",
      "Sales funnel optimization",
      "Conversion tracking & revenue reporting",
    ],
    visual: "growth",
  },
  {
    number: "02",
    title: "Content Strategy",
    tagline: "Attention that builds trust before the sale.",
    description:
      "We plan the themes, angles, calendars, and campaign stories that make your brand easier to understand, remember, and choose across social media, launch moments, and always-on content.",
    points: [
      "Instagram & Facebook content planning",
      "Content calendars & campaign ideas",
      "Brand storytelling & conversion-focused copy",
    ],
    visual: "content",
  },
  {
    number: "03",
    title: "Brand Strategy & Market Insights",
    tagline: "Know what to say, who to say it to, and why it will move them.",
    description:
      "Premium strategy consulting for businesses that need clarity before scaling. We study the market, customer motivations, competitors, positioning, and offer structure, then turn the findings into sharper messaging and smarter growth decisions.",
    points: [
      "Audience, competitor & category research",
      "Positioning, offers & messaging strategy",
      "Actionable growth roadmap for campaigns and content",
    ],
    visual: "strategy",
  },
];

const proofCards = [
  {
    label: "Placeholder result",
    value: "+61% qualified enquiries",
    detail: "Replace with a real client win once available.",
  },
  {
    label: "Placeholder proof",
    value: "4.8x campaign return",
    detail: "Use a verified number from future campaign reporting.",
  },
  {
    label: "Placeholder quote",
    value: "\u201cSharper strategy, better leads.\u201d",
    detail: "Swap for an approved testimonial.",
  },
];

function Index() {
  const submitContactInquiry = useServerFn(sendContactInquiry);
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");

  async function handleInquirySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const inquiry = String(formData.get("inquiry") ?? "").trim();

    setInquiryStatus("sending");
    setInquiryMessage("");

    try {
      const result = await submitContactInquiry({
        data: {
          submissionId: crypto.randomUUID(),
          name,
          email,
          phone,
          inquiry,
        },
      });

      if (result.status === "sent") {
        setInquiryStatus("sent");
        setInquiryMessage("Thanks. Your inquiry has been sent to Chrizos Media.");
        form.reset();
        return;
      }

      setInquiryStatus("not_sent");
      setInquiryMessage(
        result.reason === "rate_limited"
          ? `Please wait a little before sending another inquiry, or email ${CONTACT_EMAIL}.`
          : `Email sending is still being verified. Please email ${CONTACT_EMAIL} if this is urgent.`,
      );
    } catch {
      setInquiryStatus("not_sent");
      setInquiryMessage(`Something stopped the form from sending. Please email ${CONTACT_EMAIL}.`);
    }
  }

  return (
    <main className="bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" aria-label="Chrizos Media home" className="shrink-0">
            <img
              src={logoWhiteSmall}
              alt="Chrizos Media"
              width={488}
              height={216}
              decoding="async"
              className="h-auto w-24 sm:w-28"
            />
          </a>

          <nav aria-label="Primary navigation" className="flex items-center gap-1 overflow-x-auto">
            {[
              { label: "Services", href: "#services" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#work-with-us" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="shrink-0 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground sm:text-sm"
              >
                {item.label}
              </a>
            ))}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Chrizos Media Instagram placeholder"
              className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/75 transition-colors hover:text-foreground"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </header>

      {/* ============ Hero ============ */}
      <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-2/3 rounded-full bg-primary/25 blur-[120px]"
        />

        <img
          src={logoWhite}
          alt="Chrizos Media"
          width={975}
          height={431}
          fetchPriority="high"
          decoding="async"
          className="relative z-10 w-full max-w-md"
        />

        <h1 className="relative z-10 mt-10 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          More sales. More revenue. More recognition.
        </h1>

        <p className="relative z-10 mt-5 max-w-2xl text-center text-base leading-7 text-foreground/80 sm:text-lg">
          Chrizos Media is a boutique digital marketing agency for businesses that want clearer strategy,
          sharper campaigns, and growth that shows up in the numbers.
        </p>

        <a
          href="#work-with-us"
          className="relative z-10 mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Work With Us
        </a>

        <div className="relative z-10 mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {["Sales-focused strategy", "Premium execution", "Clearer campaign decisions"].map((claim) => (
            <div key={claim} className="border-y border-border py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-foreground/70">
              {claim}
            </div>
          ))}
        </div>

        <a
          href="#problem"
          aria-label="Scroll down to see the strategy"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-foreground/70 transition-colors hover:text-foreground"
        >
          <span className="mb-2 block text-center text-[11px] font-semibold uppercase tracking-[0.3em]">
            Scroll
          </span>
          <svg
            className="mx-auto h-6 w-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </section>

      {/* ============ Problem ============ */}
      <section id="problem" className="scroll-mt-24 px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-foreground/70">
              The problem
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Most brands are visible. Fewer are easy to choose.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-foreground/80">
              Ads, posts, and content only work when the audience, offer, message, and conversion path
              line up. When one part is unclear, attention leaks before it becomes revenue.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
              <ProblemFlow className="h-full w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ Marquee ============ */}
      <div className="overflow-hidden border-y border-border bg-card py-4">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1}
              className="px-6 text-sm font-semibold uppercase tracking-[0.35em] text-foreground/60"
            >
              Paid Advertising&nbsp;&nbsp;✦&nbsp;&nbsp;Meta (Instagram &amp; Facebook) Ads&nbsp;&nbsp;✦&nbsp;&nbsp;Content Strategy&nbsp;&nbsp;✦&nbsp;&nbsp;Brand Strategy&nbsp;&nbsp;✦&nbsp;&nbsp;Market Insights&nbsp;&nbsp;✦&nbsp;&nbsp;Sales Funnels&nbsp;&nbsp;✦&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ============ Services ============ */}
      <section id="services" className="scroll-mt-24 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-foreground/70">
              The solution
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Strategy, campaigns, and content built around commercial growth.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-foreground/80">
              Premium marketing work should make decisions easier, campaigns sharper, and your business
              harder to ignore.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["More sales", "More revenue per campaign", "More brand recognition"].map((claim) => (
                <div
                  key={claim}
                  className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold uppercase tracking-[0.12em]"
                >
                  {claim}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-28">
            {services.map((service, index) => (
              <Reveal key={service.number}>
                <article className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2">
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <span className="text-5xl font-extrabold text-foreground/25 sm:text-6xl">
                      {service.number}
                    </span>
                    <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-base font-semibold text-foreground/70">
                      {service.tagline}
                    </p>
                    <p className="mt-4 max-w-lg leading-7 text-foreground/80">
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm font-semibold">
                          <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
                      <div className="aspect-[4/3] w-full">
                        {service.visual === "growth" ? (
                          <GrowthFlow className="h-full w-full" />
                        ) : service.visual === "content" ? (
                          <ContentFlow className="h-full w-full" />
                        ) : (
                          <StrategyFlow className="h-full w-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Social Proof ============ */}
      <section id="proof" className="bg-card px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-foreground/70">
              Social proof
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Placeholder proof, ready for real wins.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-foreground/80">
              This section is structured for testimonials, client logos, and verified campaign results once
              approved proof is ready to publish.
            </p>
            <div className="mt-8 grid gap-3">
              {proofCards.map((card) => (
                <div key={card.value} className="rounded-2xl border border-border bg-background/20 p-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/55">
                    {card.label}
                  </span>
                  <p className="mt-2 text-xl font-extrabold tracking-tight">{card.value}</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">{card.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
              <ProofFlow className="h-full w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ About ============ */}
      <section id="about" className="scroll-mt-24 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-foreground/70">
              About
            </p>
            <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                A boutique marketing partner for sharper growth decisions.
              </h2>
              <div className="space-y-5 leading-7 text-foreground/80">
                <p>
                  Chrizos Media helps ambitious businesses connect brand clarity with measurable marketing
                  execution, from strategy and content to paid campaigns that are easier to track and improve.
                </p>
                <p>
                  Placeholder bio: add the founder story, key credentials, client categories, and strongest
                  proof points here when ready.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ Work With Us ============ */}
      <section id="work-with-us" className="scroll-mt-24 bg-card px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-foreground/70">
              Contact
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Work With Us
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-foreground/80">
               Tell us what you want to improve: sales, leads, positioning, content, or recognition. Then
              Chrizos Media will review the best next step.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:text-foreground"
            >
               <InstagramIcon className="h-5 w-5" />
              Instagram placeholder
            </a>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={handleInquirySubmit} className="grid gap-4 rounded-2xl border border-border bg-background/20 p-5 sm:p-7">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/65">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="min-h-12 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                  placeholder="Your name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/65">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="min-h-12 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/65">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="min-h-12 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                    placeholder="+971..."
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="inquiry" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/65">
                  Inquiry / Service Needed
                </label>
                <textarea
                  id="inquiry"
                  name="inquiry"
                  required
                  minLength={10}
                  rows={6}
                  className="min-h-36 resize-y rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold leading-6 text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                  placeholder="Tell us what you want to grow or improve."
                />
              </div>

              <Button type="submit" size="lg" disabled={inquiryStatus === "sending"} className="min-h-12 w-full font-semibold">
                {inquiryStatus === "sending" ? "Sending..." : "Send Inquiry"}
              </Button>

              {inquiryMessage ? (
                <p
                  className="text-sm font-semibold leading-6 text-foreground/70"
                  role={inquiryStatus === "not_sent" ? "alert" : "status"}
                >
                  {inquiryMessage}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>

        <p className="mt-16 text-center text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
          © {new Date().getFullYear()} Chrizos Media
        </p>
      </section>
    </main>
  );
}
