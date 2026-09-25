import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";

import logoWhite from "../assets/chrizos-logo-white.webp";
import logoWhiteSmall from "../assets/chrizos-logo-white-small.webp";
import glauciaCampaign from "../assets/glaucia-campaign-shoot.png.asset.json";
import glauciaLogo from "../assets/glaucia-logo.jpg.asset.json";
import socialShareImage from "../assets/chrizos-media-social-share.jpg.asset.json";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendlyBooking } from "@/components/calendly-booking";
import { DEFAULT_SETTINGS, getSiteSettings, trackBookingClick } from "@/lib/site-settings.functions";
import { Reveal } from "@/components/reveal";
import { sendChecklistRequest, sendContactInquiry } from "@/lib/contact.functions";
import {
  ContentFlow,
  GrowthFlow,
  ProblemFlow,
  SearchFlow,
  StrategyFlow,
} from "@/components/fluid-illustrations";

const INSTAGRAM_URL = "https://www.instagram.com/chrizosmedia/";
const WHATSAPP_TEXT = "?text=Hi%20Chrizos%20Media%2C%20I%27d%20like%20to%20ask%20about%20your%20services.";
const REMAINING_CLIENT_SPOTS = 2;
const HERO_SUBHEADING =
  "Paid ads, content and SEO for growing businesses. Run personally by the founder, not handed to a junior.";
const SITE_DESCRIPTION =
  "Founder-led marketing agency. Paid ads on Meta and Google, content and SEO that turn attention into paying customers. Book a free brand audit.";
const SOCIAL_SHARE_IMAGE_URL = `https://chrizosmedia.com${socialShareImage.url}`;

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.7Z" />
      <path d="M8.2 7.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.8 2c.1.3 0 .5-.1.7l-.6.7c-.2.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l2 .9c.3.1.4.3.4.5 0 .4-.2 1.6-.8 2.1-.6.5-1.4.8-2.3.7-1-.1-2.4-.5-4.1-1.9-2-1.7-3.3-3.8-3.4-4-.1-.2-.8-1.1-.8-2.2 0-1 .5-1.6.7-1.9Z" />
    </svg>
  );
}


// ---- Glaucia case study content — edit the numbers and quote here ----
const CASE_STUDY = {
  client: "Glaucia",
  industry: "Fashion brand launch",
  location: "Brand launch",
  problem:
    "A single-product fashion brand with no identity, no content and no audience, starting from zero before its first campaign.",
  deliverables: [
    "Full brand identity",
    "Product production",
    "Campaign photography",
    "Product images",
    "Social reels",
    "Paid marketing",
  ],
  result:
    "From zero to a launched brand with a running paid campaign, reaching break-even in 3 months.",
  stats: [
    { value: "32%", label: "Increase in 6 weeks" },
    { value: "400", label: "New followers in [period]" },
    { value: "3", label: "Months to break-even" },
  ],
  quote: {
    text: "They never promised overnight miracles. We got an honest plan, weekly updates, and the brand paid for itself by month three, exactly as they said it would.",
    name: "Glaucia team",
    role: "Founder, Glaucia",
  },
};

const RESULT_STAGES = [
  { label: "Brand built", detail: "Identity" },
  { label: "Content ready", detail: "Production" },
  { label: "Campaign live", detail: "Publishing" },
  { label: "Break-even", detail: "Month 3" },
];

// ---- "How it works" and FAQ content — edit the wording here ----
const HOW_IT_WORKS_STEPS = [
  {
    title: "Free Brand Audit",
    detail: "A 30-minute call where we review your ads, content and online presence together.",
  },
  {
    title: "Your Growth Plan",
    detail:
      "You receive a clear written plan within 48 hours. Yours to keep either way.",
  },
  {
    title: "Launch & Report",
    detail:
      "We execute, you get weekly updates and a monthly results review.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is the brand audit really free?",
    answer:
      "Yes. There is no obligation and no catch. You keep the written plan either way, whether we work together or not.",
  },
  {
    question: "Why only 5 clients?",
    answer:
      "So every client gets founder-level attention, not a junior account manager. Deliberately small is how we keep the quality high.",
  },
  {
    question: "Do you lock me into a long contract?",
    answer:
      "No. After the initial period, everything runs month-to-month, so you can pause or stop whenever you need to. [Edit this to match your terms.]",
  },
  {
    question: "What budget do I need for ads?",
    answer:
      "[Placeholder: write your recommended starting ad budget and how you size it per business.]",
  },
  {
    question: "Which industries do you work with?",
    answer:
      "[Placeholder: list the industries you serve best, e.g. fashion, beauty, hospitality, local services.]",
  },
];

function ResultTracker() {
  const trackerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    const tracker = trackerRef.current;
    if (!tracker) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let currentStage = -1;
    const advance = () => {
      if (currentStage === RESULT_STAGES.length - 1) {
        timer = setTimeout(() => {
          currentStage = -1;
          setActiveStage(-1);
          timer = setTimeout(advance, 500);
        }, 1100);
        return;
      }
      currentStage += 1;
      setActiveStage(currentStage);
      timer = setTimeout(advance, 600);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || timer) return;
        setActiveStage(-1);
        timer = setTimeout(advance, 700);
      },
      { threshold: 0.6 },
    );

    observer.observe(tracker);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={trackerRef}
      className="result-tracker mt-7"
      data-active={activeStage}
      aria-label="Glaucia's journey to break-even"
    >
      <div aria-hidden className="result-track">
        <span className="result-track-fill" />
      </div>
      {RESULT_STAGES.map((step, index) => (
        <div key={step.label} className="result-step min-w-0 text-center">
          <span aria-hidden className={`result-dot ${index <= activeStage ? "is-lit" : ""}`} />
          <span className={`mt-3 block text-[10px] font-extrabold leading-tight transition-opacity duration-500 sm:text-xs ${index <= activeStage ? "opacity-100" : "opacity-55"}`}>
            {step.label}
          </span>
          <span className="mt-1 block text-[9px] font-semibold leading-tight text-foreground/55 sm:text-[10px]">{step.detail}</span>
        </div>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: () => getSiteSettings(),
  head: () => ({
    meta: [
      { title: "Chrizos Media | Marketing Agency for Ads, Content & SEO" },
      {
        name: "description",
        content: SITE_DESCRIPTION,
      },
      { property: "og:title", content: "Chrizos Media | Marketing Agency for Ads, Content & SEO" },
      { property: "og:site_name", content: "Chrizos Media" },
      { name: "twitter:title", content: "Chrizos Media | Marketing Agency for Ads, Content & SEO" },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      {
        property: "og:description",
        content: SITE_DESCRIPTION,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/" },
      { property: "og:image", content: SOCIAL_SHARE_IMAGE_URL },
      { property: "og:image:alt", content: "Chrizos Media logo on an electric blue background" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_SHARE_IMAGE_URL },
      { name: "twitter:image:alt", content: "Chrizos Media logo on an electric blue background" },
      { name: "google-site-verification", content: "uzzj9R9Aahmkmf3VYqislFgiWItzv8dwuVJ5lUHZKc0" },
    ],
    links: [{ rel: "canonical", href: "https://chrizosmedia.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Chrizos Media",
          description: SITE_DESCRIPTION,
          url: "https://chrizosmedia.com",
          logo: SOCIAL_SHARE_IMAGE_URL,
          image: SOCIAL_SHARE_IMAGE_URL,
          knowsAbout: ["Marketing", "Advertising", "Paid Advertising", "Content Strategy", "Brand Strategy", "SEO"],
          serviceType: ["Paid Advertising", "Content Strategy", "Brand Strategy & Consulting", "SEO"],
          sameAs: [INSTAGRAM_URL],
        }),
      },
    ],
  }),
  component: Index,
});

type Service = {
  number: string;
  title: string;
  tagline: string;
  points: string[];
  timeframe: string;
  visual: "growth" | "content" | "strategy" | "search";
};

const services: Service[] = [
  {
    number: "01",
    title: "Paid Advertising",
    tagline: "Turn ad spend into booked customers, not just clicks.",
    points: [
      "Campaign setup and management on Meta (Instagram & Facebook) and Google",
      "A weekly performance report you can actually read",
      "A monthly strategy call to agree the next moves",
    ],
    timeframe: "First results in: 2–4 weeks",
    visual: "growth",
  },
  {
    number: "02",
    title: "Content Strategy",
    tagline: "Build attention and trust before you ever ask for the sale.",
    points: [
      "A monthly content calendar for Instagram & Facebook",
      "Hooks, captions and campaign ideas written to prompt action",
      "Launch and seasonal content planned around your key dates",
    ],
    timeframe: "First results in: 4–6 weeks",
    visual: "content",
  },
  {
    number: "03",
    title: "Brand Consulting",
    tagline: "Know what to say, who to say it to, and why they'll pick you.",
    points: [
      "Audience, competitor and market research",
      "A clear positioning and message framework",
      "A step-by-step 90-day growth plan",
    ],
    timeframe: "First results in: 2–3 weeks",
    visual: "strategy",
  },
  {
    number: "04",
    title: "SEO",
    tagline: "Get found on Google by people already searching for what you sell.",
    points: [
      "Website health fixes for speed, Google access and structure",
      "Page improvements built around what customers search for",
      "Content designed to rank and bring free traffic over time",
    ],
    timeframe: "First results in: 2–3 months",
    visual: "search",
  },
];

function Index() {
  const settings = Route.useLoaderData() ?? DEFAULT_SETTINGS;
  const CONTACT_EMAIL = settings.contact_email;
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp_number}${WHATSAPP_TEXT}`;
  const IG_URL = settings.instagram_url;
  const logBooking = useServerFn(trackBookingClick);
  const submitContactInquiry = useServerFn(sendContactInquiry);
  const submitChecklistRequest = useServerFn(sendChecklistRequest);
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [checklistStatus, setChecklistStatus] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [checklistMessage, setChecklistMessage] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrollY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);


  async function handleInquirySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "General Enquiry") as
      | "Paid Advertising"
      | "Content Strategy"
      | "Brand Consulting"
      | "SEO"
      | "General Enquiry";
    const message = String(formData.get("message") ?? "").trim();

    setInquiryStatus("sending");
    setInquiryMessage("");

    try {
      const result = await submitContactInquiry({
        data: {
          submissionId: crypto.randomUUID(),
          name,
          email,
          phone,
          service,
          message,
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

  async function handleChecklistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("checklistEmail") ?? "").trim();

    setChecklistStatus("sending");
    setChecklistMessage("");

    try {
      const result = await submitChecklistRequest({
        data: { submissionId: crypto.randomUUID(), email },
      });

      if (result.status === "sent") {
        setChecklistStatus("sent");
        setChecklistMessage("Sent. Your checklist is on its way to your inbox, or grab it right now:");
        form.reset();
        return;
      }

      setChecklistStatus("not_sent");
      setChecklistMessage(
        result.reason === "rate_limited"
          ? "That request is already on our list."
          : `We could not save your request. Please email ${CONTACT_EMAIL}.`,
      );
    } catch {
      setChecklistStatus("not_sent");
      setChecklistMessage(`We could not save your request. Please email ${CONTACT_EMAIL}.`);
    }
  }

  return (
    <main className="bg-background text-foreground">
      {settings.announcement_text ? (
        <div className="relative z-[60] truncate bg-primary px-4 py-2 text-center text-xs font-bold text-primary-foreground sm:fixed sm:inset-x-0 sm:top-0 sm:text-sm" title={settings.announcement_text}>{settings.announcement_text}</div>
      ) : null}
      <header
        className={`relative top-auto z-50 sm:fixed sm:inset-x-0 ${settings.announcement_text ? "sm:top-9" : "sm:top-0"} transition-colors duration-200 ${
          scrollY > 12
            ? "glass-panel rounded-none border-x-0 border-t-0"
            : "border-b border-border bg-background/95"
        }`}
      >

        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-1 px-3 py-3 sm:flex sm:justify-between sm:gap-4 sm:px-6">
          <a href="#top" aria-label="Chrizos Media home" className="shrink-0">
            <img
              src={logoWhiteSmall}
              alt="Chrizos Media lightning bolt logo"
              width={488}
              height={216}
              decoding="async"
              className="h-auto w-16 sm:w-28"
            />
          </a>

          <nav aria-label="Primary navigation" className="flex min-w-0 items-center justify-end gap-0.5 sm:gap-1">
            {[
              { label: "Services", href: "#services" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#work-with-us" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full px-1.5 py-2 text-[10px] font-bold uppercase text-foreground/70 transition-colors hover:text-foreground min-[390px]:px-2 sm:px-3 sm:text-sm"
              >
                {item.label}
              </a>
            ))}
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Chrizos Media on Instagram"
              className="ml-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/75 transition-colors hover:text-foreground sm:inline-flex"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </header>

      {/* ============ Hero ============ */}
      <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-28 pt-28 sm:px-6 sm:pb-32 sm:pt-24">
        <img
          src={logoWhite}
          alt="Chrizos Media logo with a lightning bolt replacing the letter Z"
          width={975}
          height={431}
          fetchPriority="high"
          decoding="async"
          className="parallax-layer relative z-10 w-full max-w-xs sm:max-w-md"
          style={{ "--hero-shift": `${scrollY * 0.12}px` } as CSSProperties}
        />


        <h1 className="relative z-10 mt-7 max-w-4xl text-center text-3xl font-extrabold leading-tight sm:mt-10 sm:text-6xl">
          {settings.hero_headline}
        </h1>

        <p className="relative z-10 mt-5 max-w-2xl text-center text-base leading-7 text-foreground/80 sm:text-lg">
          {HERO_SUBHEADING}
        </p>

        <div className="relative z-10 mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Button asChild size="lg" className="lift min-h-12 rounded-xl px-7 font-extrabold">
            <a href="#work-with-us">Book Your Free Brand Audit</a>
          </Button>
          <a
            href="#services"
            className="inline-flex min-h-11 items-center px-2 text-sm font-bold text-foreground/80 underline decoration-foreground/35 underline-offset-4 transition-colors hover:text-foreground"
          >
            See how we work ↓
          </a>
        </div>

        <p className="relative z-10 mt-4 max-w-xl text-center text-xs font-semibold leading-5 text-foreground/60 sm:text-sm">
          Currently onboarding 5 clients · {REMAINING_CLIENT_SPOTS} spots left
        </p>


        <div className="relative z-10 mt-8 grid w-full max-w-3xl gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-3">
          {["Sales-focused strategy", "Premium execution", "Clearer campaign decisions"].map((claim) => (
            <div key={claim} className="lift rounded-xl bg-chip px-4 py-3 text-center text-xs font-bold uppercase text-foreground">
              {claim}
            </div>
          ))}

        </div>

        <a
          href="#problem"
          aria-label="Scroll down to see the strategy"
          className="relative z-10 mt-8 text-foreground/70 transition-colors hover:text-foreground sm:absolute sm:bottom-8 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2"
        >
          <span className="mb-2 block text-center text-[11px] font-semibold uppercase">
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
      <section id="problem" className="scroll-mt-28 bg-section-navy px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-bold uppercase text-foreground/70">
              The problem
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
              Most brands are visible. Fewer are easy to choose.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-foreground/80">
              Ads, posts and content only work when the right audience sees a clear offer, understands the
              message, and can take an easy next step. When one part is unclear, you lose customers before the sale.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass-panel aspect-[4/3] overflow-hidden">
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
              className="px-6 text-sm font-semibold uppercase text-foreground/60"
            >
              Paid Advertising&nbsp;&nbsp;✦&nbsp;&nbsp;Meta (Instagram &amp; Facebook) Ads&nbsp;&nbsp;✦&nbsp;&nbsp;Content Strategy&nbsp;&nbsp;✦&nbsp;&nbsp;Brand Strategy&nbsp;&nbsp;✦&nbsp;&nbsp;Market Insights&nbsp;&nbsp;✦&nbsp;&nbsp;Sales Funnels&nbsp;&nbsp;✦&nbsp;&nbsp;SEO&nbsp;&nbsp;✦&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ============ Services ============ */}
      <section id="services" className="scroll-mt-28 px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase text-foreground/70">
              The solution
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
              Strategy, campaigns and content built around commercial growth.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-foreground/80">
              Premium marketing work should make decisions easier, campaigns sharper and your business
              harder to ignore.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {["More sales", "More revenue per campaign", "More brand recognition"].map((claim, index) => (
              <Reveal key={claim} delay={index * 100}>
                <div className="lift rounded-xl bg-chip px-5 py-4 text-sm font-bold uppercase text-foreground">
                  {claim}
                </div>
              </Reveal>
            ))}
          </div>


          <div className="mt-14 grid items-start gap-5 sm:mt-24 lg:auto-rows-fr lg:grid-cols-2 lg:items-stretch lg:gap-6">
            {services.map((service, index) => (
              <Reveal key={service.number} delay={(index % 2) * 100} className="lg:h-full">
                <article className="glass-soft lift flex flex-col overflow-hidden p-5 sm:p-7 lg:h-full">
                  <div className="flex flex-col lg:flex-1">
                    <span className="text-5xl font-extrabold text-foreground/25 sm:text-6xl">
                      {service.number}
                    </span>
                    <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-base font-semibold text-foreground/70">
                      {service.tagline}
                    </p>
                    <p className="mt-6 text-xs font-bold uppercase text-foreground/60">
                      What you get
                    </p>
                    <ul className="mt-3 space-y-2.5 pb-1">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm font-semibold">
                          <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-extrabold text-foreground/85">
                      {service.timeframe}
                    </p>
                  </div>
                  <div className="mt-8">
                    <div className="glass-panel overflow-hidden">
                      <div className={`${service.visual === "strategy" || service.visual === "search" ? "h-[340px]" : "h-[320px]"} w-full sm:h-auto sm:aspect-[4/3]`}>
                        {service.visual === "growth" ? (
                          <GrowthFlow className="h-full w-full" />
                        ) : service.visual === "content" ? (
                          <ContentFlow className="h-full w-full" />
                        ) : service.visual === "strategy" ? (
                          <StrategyFlow className="h-full w-full" />
                        ) : (
                          <SearchFlow className="h-full w-full" />
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

      {/* ============ Lead magnet ============ */}
      {settings.checklist_enabled ? (
      <section className="bg-section-navy px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="checklist-title">
        <Reveal>
            <div className="glass-panel mx-auto max-w-4xl p-5 sm:p-10">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase text-foreground/60">Free marketing checklist</p>
                <h2 id="checklist-title" className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                  Free Checklist: 5 Marketing Mistakes Costing Businesses Clients
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/75 sm:text-base">
                  The exact issues we see most often in businesses&apos; ads, content and how they stand out. See if you&apos;re making any of them.
                </p>
                <a href="/production-checklist" className="mt-4 inline-block text-sm font-bold underline underline-offset-4">
                  Planning a shoot or launch? Get a free AI production checklist →
                </a>
              </div>
              <form onSubmit={handleChecklistSubmit} className="grid gap-3">
                <label htmlFor="checklistEmail" className="sr-only">Email address</label>
                <input
                  id="checklistEmail"
                  name="checklistEmail"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email and we'll send it instantly"
                  className="min-h-12 w-full rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-foreground"
                />
                <Button type="submit" disabled={checklistStatus === "sending"} className="lift min-h-12 w-full font-extrabold">
                  {checklistStatus === "sending" ? "Saving..." : "Get the Free Checklist"}
                </Button>
                {checklistMessage ? (
                  <p className="text-sm font-semibold leading-6 text-foreground/75" role={checklistStatus === "not_sent" ? "alert" : "status"}>
                    {checklistMessage}
                  </p>
                ) : null}
                {checklistStatus === "sent" ? (
                  <a
                    href="/api/public/checklist-download?src=page"
                    className="lift min-h-12 inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 font-extrabold text-background"
                  >
                    Download the Checklist (PDF)
                  </a>
                ) : null}
              </form>
            </div>
          </div>
        </Reveal>
      </section>
      ) : null}

      {/* ============ Glaucia Case Study ============ */}
      <section id="proof" className="bg-section-navy px-4 py-20 sm:px-6 sm:py-32" aria-labelledby="glaucia-case-study-title">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-foreground/70">Client case study</p>
                <h2 id="glaucia-case-study-title" className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl">
                  Building Glaucia from brand to market.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-foreground/70 sm:text-right">
                Fashion brand launch · Full creative and paid campaign delivery
              </p>
            </div>
          </Reveal>

          <Reveal>
            <article className="glass-panel mt-10 overflow-hidden">
              {/* Client header */}
              <div className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-5">
                  <img
                    src={glauciaLogo.url}
                    alt="Glaucia logo"
                    className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-2xl font-extrabold sm:text-3xl">{CASE_STUDY.client}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground/70">{CASE_STUDY.industry}</p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase text-primary">
                  {CASE_STUDY.location}
                </span>
              </div>

              {/* Problem / What we did / Result */}
              <div className="grid gap-px bg-border md:grid-cols-3">
                <div className="bg-card p-6 sm:p-8">
                  <span className="text-xs font-bold uppercase text-foreground/55">The problem</span>
                  <p className="mt-4 text-sm leading-7 text-foreground/80">{CASE_STUDY.problem}</p>
                </div>
                <div className="bg-card p-6 sm:p-8">
                  <span className="text-xs font-bold uppercase text-foreground/55">What we did</span>
                  <ul className="mt-4 space-y-2.5">
                    {CASE_STUDY.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-semibold leading-6">
                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6 sm:p-8">
                  <span className="text-xs font-bold uppercase text-foreground/55">The result</span>
                  <p className="mt-4 text-sm leading-7 text-foreground/80">{CASE_STUDY.result}</p>
                  <ResultTracker />
                </div>
              </div>

              {/* Stats row — edit the numbers in CASE_STUDY.stats above */}
              <div className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
                {CASE_STUDY.stats.map((stat) => (
                  <div key={stat.label} className="bg-section-electric/40 p-6 text-center sm:p-8">
                    <p className="text-3xl font-extrabold leading-tight text-primary sm:text-4xl">{stat.value}</p>
                    <p className="mt-2 text-xs font-bold uppercase text-foreground/65">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Before / after + quote */}
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <figure className="glass-soft relative aspect-[4/5] overflow-hidden">
                    <img
                      src={glauciaLogo.url}
                      alt="Glaucia brand identity before the campaign launch"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-card/85 px-3 py-1 text-[10px] font-extrabold uppercase text-foreground/80">Before</span>
                  </figure>
                  <figure className="glass-soft relative aspect-[4/5] overflow-hidden">
                    <img
                      src={glauciaCampaign.url}
                      alt="Glaucia fashion campaign featuring two models wearing the branded clothing produced for the launch"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase text-primary-foreground">After</span>
                  </figure>
                </div>
                <blockquote className="glass-soft flex flex-col justify-between p-6 sm:p-8">
                  <p className="text-base font-semibold leading-8 text-foreground/90 sm:text-lg">
                    &ldquo;{CASE_STUDY.quote.text}&rdquo;
                  </p>
                  <footer className="mt-6 border-t border-border pt-5">
                    <p className="text-sm font-extrabold">{CASE_STUDY.quote.name}</p>
                    <p className="mt-1 text-xs font-semibold uppercase text-foreground/55">{CASE_STUDY.quote.role}</p>
                  </footer>
                </blockquote>
              </div>
            </article>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10 flex justify-center sm:mt-12">
              <Button asChild size="lg" className="lift min-h-12 rounded-xl px-7 font-extrabold">
                <a href="#work-with-us">Get the same plan for your business</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ About ============ */}
      <section id="about" className="scroll-mt-28 bg-section-navy px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase text-foreground/70">
              About
            </p>
            <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
                Not a big agency. That is the point.
              </h2>
              <div className="space-y-5 leading-7 text-foreground/80">
                <p>
                  I started Chrizos Media after seeing how large marketing agencies treat local businesses:
                  one account among hundreds, generic playbooks, and results nobody is truly accountable for.
                  I wanted to build something different: a young, ambitious team that treats every
                  client as the top priority, not another line item.
                </p>
                <p>
                   We are deliberately small: our entire focus right now is on our first five clients, so
                   each one gets full attention instead of being passed down a team.
                </p>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ How it works ============ */}
      <section id="how-it-works" className="scroll-mt-28 bg-section-electric px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-32" aria-labelledby="how-it-works-title">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase text-foreground/70">
              How it works
            </p>
            <h2 id="how-it-works-title" className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
              From first call to first results.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {/* Connecting line: vertical on mobile, horizontal on desktop */}
              <span
                aria-hidden
                className="absolute left-[1.375rem] top-2 h-[calc(100%-1rem)] w-px bg-foreground/25 md:left-[10%] md:right-[10%] md:top-[1.375rem] md:h-px md:w-auto"
              />
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <li key={step.title} className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-lg font-extrabold text-primary shadow-[0_0_24px_rgba(255,255,255,0.25)]">
                    {index + 1}
                  </span>
                  <div className="md:mt-6">
                    <h3 className="text-xl font-extrabold leading-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground/80 md:max-w-xs md:mx-auto">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="scroll-mt-28 bg-section-navy px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-32" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-sm font-bold uppercase text-foreground/70">
              FAQ
            </p>
            <h2 id="faq-title" className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              Questions, answered.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <Accordion type="single" collapsible className="glass-soft mt-10 px-6 sm:px-8">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.question} value={item.question} className="border-border">
                  <AccordionTrigger className="py-5 text-base font-extrabold hover:no-underline sm:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-foreground/80">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ============ Final CTA: booking first ============ */}
      <section id="work-with-us" className="scroll-mt-20 bg-section-electric px-4 py-20 sm:scroll-mt-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase text-foreground/70">
              Contact
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              Claim one of the remaining spots
            </h2>
            <p className="mt-5 leading-7 text-foreground/80">
               A quick, honest read on how your brand compares, how clearly it communicates and how well your
               website turns interest into enquiries. No pitch, no obligation.
            </p>
             <div className="glass-soft mx-auto mt-7 max-w-2xl space-y-3 p-5 text-left">
               <p className="text-sm font-extrabold leading-6">
                 If you don&apos;t walk away with at least one clear, usable idea, we&apos;ll give you a second audit: free.
               </p>
               <p className="text-sm font-semibold leading-6 text-foreground/75">
                 You&apos;ll also get a written 1-page summary of the audit: yours to keep and act on, whether we work together or not.
               </p>
               <p className="text-sm font-semibold leading-6 text-foreground/75">
                 Currently onboarding 5 clients · {REMAINING_CLIENT_SPOTS} spots left
               </p>
             </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-foreground/65">
              Book below, ask a quick question on WhatsApp, or send a written enquiry.
            </p>
            <Button asChild variant="outline" className="lift mt-7 min-h-12 border-whatsapp px-6 font-extrabold text-foreground hover:bg-whatsapp/20">
              <a href={WHATSAPP_URL} onClick={() => { void logBooking({ data: { source: "whatsapp" } }); }} target="_blank" rel="noreferrer" aria-label="Message Chrizos Media on WhatsApp">
                <WhatsAppIcon className="mr-2 h-5 w-5 text-whatsapp" />
                Ask on WhatsApp
              </a>
            </Button>
          </Reveal>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Reveal delay={100}>
            <CalendlyBooking url={settings.calendly_url} onBooked={() => { void logBooking({ data: { source: "calendly" } }); }} />
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-6xl border-t border-border pt-14 sm:mt-20 sm:pt-16">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <Reveal delay={160}>
              <div>
                <span className="inline-flex items-center rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-bold uppercase text-foreground/80">
                  We&apos;re listening
                </span>
                <h2 className="mt-6 text-4xl font-extrabold leading-none sm:text-6xl sm:leading-[0.95]">
                  GET IN
                  <br />
                  TOUCH.
                </h2>
                <p className="mt-6 max-w-none text-lg leading-7 text-foreground/80 lg:max-w-sm">
                  Tell us what you&apos;re building. We&apos;ll come back with a route and a
                  timeline. We reply to every brief within 6&ndash;12 hours.
                </p>

                <div className="mt-8 grid gap-4">
                  <a
                    href={WHATSAPP_URL}
                    onClick={() => { void logBooking({ data: { source: "whatsapp" } }); }}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Message Chrizos Media on WhatsApp"
                    className="glass-soft group flex items-center gap-4 rounded-2xl p-4 transition-transform duration-200 hover:scale-[1.03]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                      <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-extrabold">WhatsApp</span>
                      <span className="block text-xs font-semibold uppercase text-foreground/60">
                        Fastest reply
                      </span>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 shrink-0 text-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5">
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    aria-label={`Email Chrizos Media at ${CONTACT_EMAIL}`}
                    className="glass-soft group flex items-center gap-4 rounded-2xl p-4 transition-transform duration-200 hover:scale-[1.03]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5 text-foreground/80">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-extrabold">{CONTACT_EMAIL}</span>
                      <span className="block text-xs font-semibold uppercase text-foreground/60">
                        Email &middot; Briefs &amp; enquiries
                      </span>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 shrink-0 text-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5">
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>

              </div>
            </Reveal>

            <Reveal delay={220}>
              <form onSubmit={handleInquirySubmit} className="glass-soft grid gap-4 rounded-2xl p-5 sm:rounded-3xl sm:p-8">
                <div>
                  <h3 className="text-2xl font-extrabold sm:text-3xl">Start a project</h3>
                  <p className="mt-1 text-sm font-semibold text-foreground/65">
                    The more you tell us, the sharper the first reply.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase text-foreground/65">
                      Your name <span aria-hidden="true" className="text-foreground/85">*</span>
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

                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase text-foreground/65">
                      Email <span aria-hidden="true" className="text-foreground/85">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="min-h-12 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-xs font-bold uppercase text-foreground/65">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="min-h-12 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="service" className="text-xs font-bold uppercase text-foreground/65">
                      What do you need? <span aria-hidden="true" className="text-foreground/85">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      defaultValue="General Enquiry"
                      className="min-h-12 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors focus:border-foreground"
                    >
                      <option>Paid Advertising</option>
                      <option>Content Strategy</option>
                      <option>Brand Consulting</option>
                      <option>SEO</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase text-foreground/65">
                    Tell us about the project <span aria-hidden="true" className="text-foreground/85">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    className="min-h-28 resize-y rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold leading-6 text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
                    placeholder="What are you building, who is it for and when does it need to land?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={inquiryStatus === "sending"}
                  className="lift min-h-12 w-full rounded-full font-extrabold"
                >
                  {inquiryStatus === "sending" ? "Sending..." : "Send Enquiry"}
                </Button>

                <p className="text-center text-xs font-semibold text-foreground/60">
                  We reply to every brief within 6&ndash;12 hours.
                </p>

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
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-3 text-sm font-bold uppercase text-foreground/75 transition-colors hover:text-foreground"
          >
            <InstagramIcon className="h-5 w-5" />
            Instagram

          </a>
          <p className="text-center text-xs font-semibold uppercase text-foreground/50">
            © {new Date().getFullYear()} Chrizos Media
          </p>
        </div>
      </section>
      <a
        href={WHATSAPP_URL}
        onClick={() => { void logBooking({ data: { source: "whatsapp" } }); }}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Chrizos Media on WhatsApp"
        className="fixed bottom-4 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:bottom-6 sm:right-6"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </main>
  );
}
