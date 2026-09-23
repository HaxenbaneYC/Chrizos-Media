import { createFileRoute } from "@tanstack/react-router";
import logoWhite from "../assets/chrizos-logo-white.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chrizos Media — Marketing & Advertising Agency" },
      {
        name: "description",
        content:
          "Chrizos Media is a marketing and advertising agency. Something electric is coming soon.",
      },
      { property: "og:title", content: "Chrizos Media — Marketing & Advertising Agency" },
      {
        property: "og:description",
        content: "Chrizos Media is a marketing and advertising agency. Something electric is coming soon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
        We're building something electric.
      </h1>

      <p className="relative z-10 mt-6 inline-flex items-center gap-2.5 rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-foreground" />
        </span>
        Coming soon
      </p>

      <p className="relative z-10 mt-14 text-center text-sm text-foreground/70">
        Marketing &amp; Advertising — launching shortly
      </p>
    </main>
  );
}
