import { createFileRoute } from "@tanstack/react-router";

const VERIFICATION_RESPONSE = "google-site-verification: google2046e1efb4605547.html";

export const Route = createFileRoute("/google2046e1efb4605547.html")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () =>
        new Response(VERIFICATION_RESPONSE, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});