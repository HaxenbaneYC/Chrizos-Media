import { createFileRoute } from "@tanstack/react-router";
import logoWhite from "../assets/chrizos-logo-white.png";
import photographyImg from "../assets/services-photography.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ContentFlow, GrowthFlow } from "@/components/fluid-illustrations";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Chrizos Media — Marketing & Advertising Agency" },
      {
        name: "description",
        content:
          "Chrizos Media is a boutique digital marketing agency specializing in high-ROI strategies — social media marketing, sales funnel optimization, and online advertising.",
      },
      { property: "og:title", content: "Chrizos Media — Marketing & Advertising Agency" },
      {
        property: "og:description",
        content:
          "A boutique digital marketing agency specializing in high-ROI strategies — social media, sales funnels, and online advertising.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://graphics-gleam-lab.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://graphics-gleam-lab.lovable.app/" }],
  }),
  component: Index,
});

const services = [
  {
    number: "01",
    title: "Content Strategy",
    tagline: "Feeds people can't scroll past.",
    description:
      "We plan, create, and run social media content that builds a brand people actually follow. From content calendars to campaign storytelling, every post has a job to do.",
    points: ["Social media marketing", "Content calendars & planning", "Brand storytelling & copywriting"],
    image: contentStrategyImg,
    alt: "Content calendar and planning materials on a navy desk",
  },
  {
    number: "02",
    title: "Paid Advertising",
    tagline: "Ad spend that pays for itself.",
    description:
      "High-return campaigns across Meta, Google, and TikTok. We build the funnels, run the tests, and optimize relentlessly so your ad spend comes back with company.",
    points: ["Meta, Google & TikTok ads", "Sales funnel optimization", "Conversion tracking & reporting"],
    image: paidAdsImg,
    alt: "Smartphone showing a rising performance chart",
  },
  {
    number: "03",
    title: "Photography",
    tagline: "Products that look worth buying.",
    description:
      "Studio-grade photography that makes your products the hero — clean e-commerce shots, scroll-stopping lifestyle imagery, and content ready for every channel.",
    points: ["Product & e-commerce photography", "Lifestyle & brand shoots", "Content ready for every platform"],
    image: photographyImg,
    alt: "Product photography studio with sneaker and bottle on blue backdrop",
  },
];

function Index() {
  return (
    <main className="bg-background text-foreground">
      {/* ============ Hero ============ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-2/3 rounded-full bg-primary/25 blur-[120px]"
        />

        <img
          src={logoWhite}
          alt="Chrizos Media"
          className="relative z-10 w-full max-w-md"
        />

        <h1 className="relative z-10 mt-10 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Chrizos Media — Marketing &amp; Advertising Agency
        </h1>

        <p className="relative z-10 mt-5 max-w-2xl text-center text-base leading-7 text-foreground/80 sm:text-lg">
          Chrizos Media is a boutique digital marketing agency specializing in high-return-on-investment
          strategies — social media marketing, sales funnel optimization, and online advertising.
        </p>

        <Button asChild size="lg" className="relative z-10 mt-8 min-h-11 px-7 font-semibold">
          <a href="mailto:chrizosmedia@gmail.com?subject=Project%20enquiry">Start a project</a>
        </Button>

        <a
          href="#services"
          aria-label="Scroll down to see what we do"
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
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
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
              Content Strategy&nbsp;&nbsp;✦&nbsp;&nbsp;Paid Advertising&nbsp;&nbsp;✦&nbsp;&nbsp;Social Media&nbsp;&nbsp;✦&nbsp;&nbsp;Photography&nbsp;&nbsp;✦&nbsp;&nbsp;Sales Funnels&nbsp;&nbsp;✦&nbsp;&nbsp;Brand Identity&nbsp;&nbsp;✦&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ============ Services ============ */}
      <section id="services" className="scroll-mt-8 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-foreground/70">
              What we do
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Three ways we make brands impossible to ignore.
            </h2>
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
                    <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/30">
                      <img
                        src={service.image}
                        alt={service.alt}
                        loading="lazy"
                        width={1200}
                        height={912}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-card px-6 py-24 sm:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Let's make your brand impossible to ignore.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-foreground/80">
            Tell us about your business and we'll show you exactly how we'd grow it.
          </p>
          <Button asChild size="lg" className="mt-8 min-h-11 px-8 font-semibold">
            <a href="mailto:chrizosmedia@gmail.com?subject=Project%20enquiry">Start a project</a>
          </Button>
        </Reveal>

        <p className="mt-16 text-center text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
          © {new Date().getFullYear()} Chrizos Media
        </p>
      </section>
    </main>
  );
}
