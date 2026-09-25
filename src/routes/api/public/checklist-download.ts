import { createFileRoute } from "@tanstack/react-router";
import { recordChecklistEvent } from "@/lib/checklist-events.server";

const PDF_PATH = "/downloads/chrizos-media-dubai-marketing-checklist.pdf";

export const Route = createFileRoute("/api/public/checklist-download")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const rawSource = url.searchParams.get("src") ?? "page";
        const source = (["email", "instagram"].includes(rawSource) ? rawSource : "page") as
          | "email"
          | "instagram"
          | "page";
        await recordChecklistEvent("download", source, {
          source: url.searchParams.get("utm_source") ?? undefined,
          medium: url.searchParams.get("utm_medium") ?? undefined,
          campaign: url.searchParams.get("utm_campaign") ?? undefined,
        });
        return new Response(null, {
          status: 302,
          headers: { Location: PDF_PATH, "Cache-Control": "no-store" },
        });
      },
    },
  },
});
