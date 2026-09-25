// Records anonymous events — no emails, IPs, or identifiers are stored.
// Campaign tags (utm_*) describe the link clicked, not the person.
export type Utm = { source?: string; medium?: string; campaign?: string };

function clean(value: string | null | undefined, max: number) {
  const v = (value ?? "").trim().toLowerCase().replace(/[^a-z0-9._\- ]/g, "").slice(0, max);
  return v || null;
}

export async function recordChecklistEvent(
  eventType: "signup" | "download" | "booking",
  source: "page" | "email" | "calendly" | "whatsapp" | "instagram",
  utm?: Utm,
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("checklist_events").insert({
      event_type: eventType,
      source,
      utm_source: clean(utm?.source, 80),
      utm_medium: clean(utm?.medium, 80),
      utm_campaign: clean(utm?.campaign, 120),
    });
  } catch (error) {
    console.error("event not recorded", error);
  }
}
