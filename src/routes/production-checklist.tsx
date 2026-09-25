import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import logoWhite from "../assets/chrizos-logo-white.webp";
import { Button } from "@/components/ui/button";
import {
  generateProductionChecklist,
  type ProductionChecklistResult,
} from "@/lib/production-checklist.functions";

export const Route = createFileRoute("/production-checklist")({
  staticData: { sitemap: true },
  component: ProductionChecklistPage,
  head: () => ({
    meta: [
      { title: "Free AI Production Checklist for Your Project | Chrizos Media" },
      {
        name: "description",
        content:
          "Describe your shoot, campaign or brand project and get a personalized, step-by-step production checklist in seconds.",
      },
      { property: "og:title", content: "Free AI Production Checklist | Chrizos Media" },
      {
        property: "og:description",
        content: "Tell us about your project and get a tailored production checklist instantly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://chrizosmedia.com/production-checklist" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://chrizosmedia.com/production-checklist" }],
  }),
});

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-foreground";

function ProductionChecklistPage() {
  const generate = useServerFn(generateProductionChecklist);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductionChecklistResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setLoading(true);
    setResult(null);
    try {
      setResult(
        await generate({
          data: {
            project: String(f.get("project") ?? ""),
            business: String(f.get("business") ?? ""),
            goal: String(f.get("goal") ?? ""),
          },
        }),
      );
    } catch {
      setResult({ status: "error", message: "Please describe your project in at least a couple of sentences." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-background px-4 py-12 text-foreground sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <a href="/" className="flex justify-center" aria-label="Chrizos Media home">
          <img src={logoWhite} alt="Chrizos Media lightning bolt logo" decoding="async" className="h-auto w-24 sm:w-28" />
        </a>
        <div className="glass-panel mt-8 p-6 sm:p-10">
          <p className="text-xs font-bold uppercase text-foreground/60">Free AI tool</p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-4xl">
            Get your personalized production checklist
          </h1>
          <p className="mt-4 text-sm leading-6 text-foreground/75 sm:text-base">
            Tell us what you're planning (a shoot, reels, a launch, a rebrand) and get a step-by-step
            checklist tailored to your project in seconds.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
            <label className="grid gap-1 text-sm font-bold">
              Your business (optional)
              <input name="business" maxLength={120} placeholder="e.g. Streetwear brand" className={`${inputClass} min-h-12`} />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Main goal (optional)
              <input name="goal" maxLength={200} placeholder="e.g. Launch a new collection online" className={`${inputClass} min-h-12`} />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Describe your project *
              <textarea
                name="project"
                required
                minLength={20}
                maxLength={2000}
                rows={5}
                placeholder="What are you making, who is it for, and when do you want it live?"
                className={`${inputClass} py-3`}
              />
            </label>
            <Button type="submit" disabled={loading} className="lift min-h-12 w-full font-extrabold">
              {loading ? "Building your checklist…" : "Generate My Checklist"}
            </Button>
          </form>
          {result?.status === "error" ? (
            <p role="alert" className="mt-4 text-sm font-semibold text-foreground/80">{result.message}</p>
          ) : null}
        </div>

        {result?.status === "ok" ? (
          <section className="glass-panel mt-6 p-6 sm:p-10" aria-live="polite">
            <h2 className="text-xl font-extrabold sm:text-3xl">{result.title}</h2>
            {result.summary ? <p className="mt-3 text-sm leading-6 text-foreground/75">{result.summary}</p> : null}
            <ol className="mt-6 grid gap-6">
              {result.phases.map((p, i) => (
                <li key={p.phase}>
                  <h3 className="text-sm font-extrabold uppercase">
                    {i + 1}. {p.phase}
                  </h3>
                  <ul className="mt-3 grid gap-2">
                    {p.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6">
                        <input type="checkbox" className="mt-1.5 h-4 w-4 shrink-0 accent-primary" aria-label={item} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="lift min-h-12 flex-1 font-extrabold">
                <a href="/#contact">Get Chrizos to produce it</a>
              </Button>
              <Button variant="outline" className="min-h-12 flex-1 font-extrabold" onClick={() => window.print()}>
                Print / save as PDF
              </Button>
            </div>
            <p className="mt-4 text-xs text-foreground/55">AI-generated guide. We'll refine it with you on a call.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
