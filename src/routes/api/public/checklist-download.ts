import { createFileRoute } from "@tanstack/react-router";
import { recordChecklistEvent } from "@/lib/checklist-events.server";

const PDF_PATH = "/downloads/chrizos-media-dubai-marketing-checklist.pdf";

export const Route = createFileRoute("/api/public/checklist-download")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const source = url.searchParams.get("src") === "email" ? "email" : "page";
        await recordChecklistEvent("download", source);
        return new Response(null, {
          status: 302,
          headers: { Location: PDF_PATH, "Cache-Control": "no-store" },
        });
      },
    },
  },
});
