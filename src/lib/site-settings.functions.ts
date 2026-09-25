import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const DEFAULT_SETTINGS = {
  contact_email: "chrizosmedia@gmail.com",
  whatsapp_number: "971504254366",
  instagram_url: "https://www.instagram.com/chrizosmedia/",
  calendly_url: "https://calendly.com/chrizosmedia/youssef",
  hero_headline: "More sales. More revenue. More recognition.",
  hero_subheading:
    "Paid ads, content and SEO for growing businesses. Run personally by the founder, not handed to a junior.",
  scarcity_enabled: true,
  scarcity_text: "We're currently taking on our first 5 clients: limited spots, and each one gets full focus.",
  checklist_enabled: true,
  announcement_text: "",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async (): Promise<SiteSettings> => {
  try {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data } = await client
      .from("site_settings")
      .select(
        "contact_email, whatsapp_number, instagram_url, calendly_url, hero_headline, hero_subheading, scarcity_enabled, scarcity_text, checklist_enabled, announcement_text",
      )
      .eq("id", 1)
      .maybeSingle();
    return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
});

export const trackBookingClick = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ source: z.enum(["calendly", "whatsapp"]) }).parse(d))
  .handler(async ({ data }) => {
    const { recordChecklistEvent } = await import("./checklist-events.server");
    await recordChecklistEvent("booking", data.source);
    return { ok: true };
  });
