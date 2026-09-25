import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  project: z.string().trim().min(20).max(2000),
  business: z.string().trim().max(120).optional().default(""),
  goal: z.string().trim().max(200).optional().default(""),
});

export type ChecklistPhase = { phase: string; items: string[] };
export type ProductionChecklistResult =
  | { status: "ok"; title: string; summary: string; phases: ChecklistPhase[] }
  | { status: "error"; message: string };

const hits = new Map<string, number[]>();

export const generateProductionChecklist = createServerFn({ method: "POST" })
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data }): Promise<ProductionChecklistResult> => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const ip = req.headers.get("cf-connecting-ip") ?? "anon";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => t > now - 3600_000);
    if (recent.length >= 5) {
      return { status: "error", message: "You've made several checklists already — please try again in an hour." };
    }
    hits.set(ip, [...recent, now]);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { status: "error", message: "The checklist tool isn't configured yet." };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const system = `You are a senior production producer at Chrizos Media, a creative and performance marketing agency.
Write a practical, personalized production checklist for the prospective client's project (content shoots, reels, product images, branding, paid ads, SEO, as relevant).
Rules: 4-6 phases (e.g. Brief & strategy, Pre-production, Shoot day, Post-production, Launch & ads, Measure). 3-6 short, concrete, actionable items per phase (max 18 words each).
Never promise results, revenue, or specific numbers. Plain English, no jargon.
Respond ONLY with JSON: {"title": string, "summary": string (max 2 sentences), "phases": [{"phase": string, "items": string[]}]}`;

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system,
        prompt: `Business: ${data.business || "not specified"}\nMain goal: ${data.goal || "not specified"}\nProject description:\n${data.project}`,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = await result.text;
      const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
      const phases: ChecklistPhase[] = (Array.isArray(json.phases) ? json.phases : [])
        .slice(0, 6)
        .map((p: { phase?: unknown; items?: unknown }) => ({
          phase: String(p.phase ?? "").slice(0, 80),
          items: (Array.isArray(p.items) ? p.items : []).slice(0, 6).map((i: unknown) => String(i).slice(0, 200)),
        }))
        .filter((p: ChecklistPhase) => p.phase && p.items.length);
      if (!phases.length) throw new Error("empty");
      return {
        status: "ok",
        title: String(json.title ?? "Your production checklist").slice(0, 120),
        summary: String(json.summary ?? "").slice(0, 400),
        phases,
      };
    } catch (error) {
      const status = (error as { statusCode?: number })?.statusCode;
      console.error("production checklist failed", status, error);
      if (status === 429) return { status: "error", message: "It's busy right now — please try again in a minute." };
      if (status === 402 || status === 403)
        return { status: "error", message: "The checklist tool is temporarily unavailable. Please message us instead." };
      return { status: "error", message: "We couldn't build your checklist. Please try again." };
    }
  });
