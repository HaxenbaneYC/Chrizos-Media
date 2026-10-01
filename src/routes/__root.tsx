import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { CookieBanner } from "@/components/site-b/cookie-banner";
import { reportLovableError } from "../lib/lovable-error-reporting";

/** Full-screen Electric Blue message, shared by the 404 and error pages. */
function BlueMessage({ kicker, title, children }: { kicker: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="d-root b-theme flex min-h-[100svh] flex-col bg-[#1700FF] px-6 py-8 text-white lg:px-12">
      <div className="d-wrap w-full">
        <a href="/" className="inline-flex min-h-11 items-center" aria-label="Chrizos Media home">
          <img src="/b/logo-white.svg" alt="Chrizos Media" width={952} height={386} className="h-auto w-[104px]" />
        </a>
      </div>
      <main className="d-wrap flex w-full flex-1 flex-col justify-center py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em]">{kicker}</p>
        <h1 className="d-display mt-4 text-[clamp(3rem,10vw,7.5rem)] uppercase leading-[0.95]">{title}</h1>
        {children}
      </main>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <BlueMessage
      kicker="Error 404 · Page not found"
      title={
        <>
          This page
          <br />
          <span className="bg-white px-[0.1em] text-[#052662]">scrolled past.</span>
        </>
      }
    >
      <p className="mt-8 max-w-xl text-lg">The link may be old or mistyped. Here’s where most people are headed:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="d-btn min-h-12 bg-white px-6 text-base text-[#1700FF]">
          Go to the homepage
        </Link>
        <a href="/audit" className="d-btn min-h-12 border-2 border-white px-6 text-base text-white">
          Book a free ad audit
        </a>
      </div>
    </BlueMessage>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <BlueMessage kicker="Something went wrong" title="This page didn’t load.">
      <p className="mt-8 max-w-xl text-lg">It’s on our side, not yours. Try again, or head back to the homepage.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="d-btn min-h-12 bg-white px-6 text-base text-[#1700FF]"
        >
          Try again
        </button>
        <a href="/" className="d-btn min-h-12 border-2 border-white px-6 text-base text-white">
          Go to the homepage
        </a>
      </div>
    </BlueMessage>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chrizos Media" },
      { name: "description", content: "Founder-led paid ads, content and SEO that put growing businesses in front of the right people." },
      { name: "theme-color", content: "#052662" },
      { property: "og:title", content: "Chrizos Media" },
      { property: "og:description", content: "More eyes. More customers. Founder-led paid ads, content and SEO for growing businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "yIrVdXEEixhch8oPlilP_6LwzxN7fV_k6VQIj_QoCxg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/montserrat-var.woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", type: "image/x-icon", href: "/b/favicon.ico" },
      { rel: "shortcut icon", type: "image/x-icon", href: "/b/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", href: "/b/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/b/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/b/icon-192.png" },
      { rel: "manifest", href: "/b/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieBanner />
    </QueryClientProvider>
  );
}
