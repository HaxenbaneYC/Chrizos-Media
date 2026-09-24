// Records anonymous checklist events — no emails, IPs, or identifiers are stored.
export async function recordChecklistEvent(eventType: "signup" | "download", source: "page" | "email") {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("checklist_events").insert({ event_type: eventType, source });
  } catch (error) {
    console.error("checklist event not recorded", error);
  }
}
