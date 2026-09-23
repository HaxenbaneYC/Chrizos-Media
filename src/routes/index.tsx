import { createFileRoute } from "@tanstack/react-router";
import logoWhite from "../assets/chrizos-logo-white.png";
import { Button } from "@/components/ui/button";

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

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      {/* soft glow behind the logo */}
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
    </main>
  );
}
