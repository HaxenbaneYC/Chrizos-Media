import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import logoWhite from "../assets/chrizos-logo-white.webp";
import socialShareImage from "../assets/chrizos-media-social-share.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { sendChecklistRequest } from "@/lib/contact.functions";

const SOCIAL_SHARE_IMAGE_URL = `https://chrizosmedia.com${socialShareImage.url}`;

export const Route = createFileRoute("/checklist")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      {
        title: "Free Checklist: 5 Marketing Mistakes Costing Dubai Businesses Clients | Chrizos Media",
        description:
          "Get the free Dubai marketing checklist: the 5 mistakes that quietly cost local businesses clients, plus a 30-day fix plan. Enter your email and it lands in your inbox instantly.",
      },
      {
        property: "og:title",
        content: "Free Checklist: 5 Marketing Mistakes Costing Dubai Businesses Clients",
      },
      {
        property: "og:description",
        content:
          "The 5 marketing mistakes we see most often in Dubai businesses — and how to fix them. Free PDF, sent instantly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/checklist" },
      { property: "og:image", content: SOCIAL_SHARE_IMAGE_URL },
      { property: "og:image:alt", content: "Chrizos Media logo on an electric blue background" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_SHARE_IMAGE_URL },
      { name: "twitter:image:alt", content: "Chrizos Media logo on an electric blue background" },
    ],
    links: [{ rel: "canonical", href: "https://chrizosmedia.com/checklist" }],
  }),
});

function ChecklistPage() {
  const submitChecklistRequest = useServerFn(sendChecklistRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "not_sent">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("checklistEmail") ?? "").trim();

    setStatus("sending");
    setMessage("");

    try {
      const result = await submitChecklistRequest({
        data: { submissionId: crypto.randomUUID(), email, source: "instagram" },
      });

      if (result.status === "sent") {
        setStatus("sent");
        setMessage("Sent! Your checklist is on its way to your inbox — or grab it right now:");
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
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-background px-4 py-12 text-foreground sm:py-16">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-10">
        <a href="/" className="inline-flex items-center" aria-label="Chrizos Media home">
          <img src={logoWhite} alt="Chrizos Media" className="h-auto w-24 sm:w-28" />
        </a>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-foreground/60">
          Free Dubai marketing checklist
        </p>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-4xl">
          5 Marketing Mistakes Costing Dubai Businesses Clients
        </h1>
        <p className="mt-4 text-sm leading-6 text-foreground/75 sm:text-base">
          The exact issues we see most often in local businesses&apos; ads and content — and a
          simple 30-day plan to fix them. Enter your email and the PDF lands in your inbox
          instantly.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          <label htmlFor="checklistEmail" className="sr-only">
            Email address
          </label>
          <input
            id="checklistEmail"
            name="checklistEmail"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Enter your email — we'll send it instantly"
            className="min-h-12 w-full rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-foreground"
          />
          <Button
            type="submit"
            disabled={status === "sending"}
            className="lift min-h-12 w-full font-extrabold"
          >
            {status === "sending" ? "Saving..." : "Send Me the Free Checklist"}
          </Button>
          {message ? (
            <p
              className="text-sm font-semibold leading-6 text-foreground/75"
              role={status === "not_sent" ? "alert" : "status"}
            >
              {message}
            </p>
          ) : null}
          {status === "sent" ? (
            <a
              href="/api/public/checklist-download?src=instagram"
              className="lift inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-foreground px-4 font-extrabold text-background"
            >
              Download the Checklist (PDF)
            </a>
          ) : null}
        </form>

        <p className="mt-6 text-xs leading-5 text-foreground/55">
          No spam — just the checklist and the occasional useful note. Want to talk instead?{" "}
          <a href="/" className="font-bold underline underline-offset-4">
            Book a free audit call
          </a>
          .
        </p>
      </div>
    </main>
  );
}
