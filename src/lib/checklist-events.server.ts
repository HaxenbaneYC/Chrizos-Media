// Records anonymous events — no emails, IPs, or identifiers are stored.
export async function recordChecklistEvent(
  eventType: "signup" | "download" | "booking",
  source: "page" | "email" | "calendly" | "whatsapp" | "instagram",
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("checklist_events").insert({ event_type: eventType, source });
  } catch (error) {
    console.error("event not recorded", error);
  }
}
