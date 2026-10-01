import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";

import { sendChecklistRequest } from "@/lib/contact.functions";
import { Honeypot, useSpamTraps } from "@/components/site-b/honeypot";
import { Mark } from "@/components/site-d/brand-d";

const SOCIAL_SHARE_IMAGE_URL = "https://chrizosmedia.com/b/og-image.png";

export const Route = createFileRoute("/checklist")({
  staticData: { sitemap: true },
  component: ChecklistPage,
  head: () => ({
    meta: [
      { title: "Free Guide: 3 Reasons People Scroll Past Your Ads | Chrizos Media" },
      {
        name: "description",
        content: "Why people scroll past your ads, a quick test for each, and one fix you can try today. Free PDF from Chrizos Media, sent instantly.",
      },
      {
        property: "og:title",
        content: "Free Guide: 3 Reasons People Scroll Past Your Ads",
      },
      {
        property: "og:description",
        content:
          "Why people scroll past your ads, a quick test for each, and one fix you can try today. Free PDF, sent instantly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/checklist" },
      { property: "og:image", content: SOCIAL_SHARE_IMAGE_URL },
      { property: "og:image:alt", content: "Chrizos Media: great businesses don't have a product problem, they have an attention problem" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_SHARE_IMAGE_URL },
      { name: "twitter:image:alt", content: "Chrizos Media: great businesses don't have a product problem, they have an attention problem" },
    ],
    links: [
      { rel: "canonical", href: "https://chrizosmedia.com/checklist" },
    ],
  }),
});

function ChecklistPage() {
  const submitChecklistRequest = useServerFn(sendChecklistRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [message, setMessage] = useState("");
  const readTraps = useSpamTraps();
  const [utm, setUtm] = useState<{ source?: string | undefined; medium?: string | undefined; campaign?: string | undefined }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pick = (k: string) => params.get(k)?.slice(0, 80) || undefined;
    setUtm({
      source: pick("utm_source") ?? "instagram",
      medium: pick("utm_medium") ?? "bio",
      campaign: pick("utm_campaign"),
    });
  }, []);

  const downloadHref = `/api/public/checklist-download?${new URLSearchParams({
    src: "instagram",
    ...(utm.source ? { utm_source: utm.source } : {}),
    ...(utm.medium ? { utm_medium: utm.medium } : {}),
    ...(utm.campaign ? { utm_campaign: utm.campaign } : {}),
  }).toString()}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("checklistEmail") ?? "").trim();

    setStatus("sending");
    setMessage("");

    try {
      const result = await submitChecklistRequest({
        data: { submissionId: crypto.randomUUID(), email, source: "instagram", utm, ...readTraps(fd) },
      });

      if (result.status === "sent") {
        setStatus("sent");
        setMessage("Sent. Your guide is on its way to your inbox, or grab it right now:");
        form.reset();
        return;
      }

      setStatus("not_sent");
      setMessage(
        result.reason === "rate_limited"
          ? "That request is already on our list."
          : "We could not save your request. Please email chrizosmedia@gmail.com.",
      );
    } catch {
      setStatus("not_sent");
      setMessage("We could not save your request. Please email chrizosmedia@gmail.com.");
    }
  }

  return (
    <div className="d-root b-theme min-h-[100svh]">
      <main className="d-section">
        <div className="d-wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <a href="/" className="inline-flex min-h-11 items-center" aria-label="Chrizos Media home">
              <img src="/b/logo-blue.svg" alt="Chrizos Media" width={952} height={386} className="h-auto w-[112px]" />
            </a>
            <p className="d-kicker mt-16">Free guide · 5-minute read</p>
            <h1 className="d-display d-h1 mt-4">
              3 reasons people scroll past <Mark>your ads.</Mark>
            </h1>
            <p className="d-lead">What we see in almost every ad account we audit, a quick test for each, and one fix you can try today.</p>
          </div>

          <div className="lg:col-span-5 lg:self-end">
            <form onSubmit={handleSubmit} className="d-card relative grid gap-6 p-8">
              <Honeypot />
              <label htmlFor="checklistEmail" className="text-lg font-semibold">
                Where should we send it?
              </label>
              <input
                id="checklistEmail"
                name="checklistEmail"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@company.com"
                className="d-input"
              />
              <button type="submit" disabled={status === "sending"} className="d-btn d-btn-forest min-h-14 px-7 text-base">
                {status === "sending" ? "Sending…" : "Send me the free guide"}
              </button>
              {message ? (
                <p className="text-base font-semibold" role={status === "not_sent" ? "alert" : "status"}>
                  {message}
                </p>
              ) : null}
              {status === "sent" ? (
                <a href={downloadHref} className="d-btn d-btn-lime min-h-14 px-7 text-base">
                  Download the guide (PDF)
                </a>
              ) : null}
              <p className="text-sm text-[var(--d-muted)]">
                No spam. Just the guide and the occasional useful note (<a href="/privacy" className="d-link">privacy policy</a>). Want to talk instead?{" "}
                <a href="/audit?src=guide" className="d-link">
                  Book a free audit
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
