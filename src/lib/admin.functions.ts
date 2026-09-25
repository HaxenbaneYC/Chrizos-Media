import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getAdmin,
  getRole,
  hashPassword,
  hashesMatch,
  isUnlocked,
  newSalt,
  panelSession,
  requirePanel,
} from "./admin-panel.server";

export const getPanelStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await getRole(context.supabase, context.userId);
    const unlocked = role ? await isUnlocked(context.userId) : false;
    return { role, unlocked };
  });

export const unlockPanel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ context, data }) => {
    const role = await getRole(context.supabase, context.userId);
    if (!role) return { ok: false as const };
    const admin = await getAdmin();
    const { data: cfg } = await admin
      .from("admin_config")
      .select("panel_password_hash, panel_password_salt")
      .eq("id", 1)
      .single();
    if (!cfg || !hashesMatch(hashPassword(data.password, cfg.panel_password_salt), cfg.panel_password_hash)) {
      return { ok: false as const };
    }
    const session = await panelSession();
    await session.update({ unlockedAt: Date.now(), userId: context.userId });
    return { ok: true as const };
  });

export const lockPanel = createServerFn({ method: "POST" }).handler(async () => {
  const session = await panelSession();
  await session.clear();
  return { ok: true };
});

export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ days: z.number().int().min(0).max(3650) }).parse(d))
  .handler(async ({ context, data }) => {
    await requirePanel(context);
    const admin = await getAdmin();
    const since = data.days ? new Date(Date.now() - data.days * 86400000).toISOString() : "1970-01-01";
    const [events, inquiries] = await Promise.all([
      admin.from("checklist_events").select("event_type, source, utm_source, utm_medium, utm_campaign, created_at").gte("created_at", since).order("created_at").limit(20000),
      admin.from("inquiries").select("created_at").gte("created_at", since).order("created_at").limit(20000),
    ]);
    return {
      events: events.data ?? [],
      inquiries: (inquiries.data ?? []).map((i) => i.created_at),
    };
  });

export const listInquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await requirePanel(context);
    const admin = await getAdmin();
    const { data } = await admin.from("inquiries").select("*").order("created_at", { ascending: false }).limit(1000);
    return { role, inquiries: data ?? [] };
  });

export const updateInquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "won", "lost"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requirePanel(context, "owner");
    const admin = await getAdmin();
    await admin.from("inquiries").update({ status: data.status }).eq("id", data.id);
    return { ok: true };
  });

export const deleteInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await requirePanel(context, "owner");
    const admin = await getAdmin();
    await admin.from("inquiries").delete().eq("id", data.id);
    return { ok: true };
  });

async function allUsers() {
  const admin = await getAdmin();
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
  return data?.users ?? [];
}

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await requirePanel(context);
    const admin = await getAdmin();
    const [{ data: roles }, users] = await Promise.all([
      admin.from("user_roles").select("user_id, role").in("role", ["admin", "viewer"]),
      allUsers(),
    ]);
    const byId = new Map(users.map((u) => [u.id, u.email ?? ""]));
    const members = new Map<string, { userId: string; email: string; role: "owner" | "viewer" }>();
    for (const r of roles ?? []) {
      const existing = members.get(r.user_id);
      const mapped = r.role === "admin" ? "owner" : "viewer";
      if (!existing || mapped === "owner") {
        members.set(r.user_id, { userId: r.user_id, email: byId.get(r.user_id) ?? "(unknown)", role: mapped });
      }
    }
    return { role, me: context.userId, members: [...members.values()] };
  });

export const setTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ email: z.string().trim().email().max(254), role: z.enum(["owner", "viewer"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requirePanel(context, "owner");
    const user = (await allUsers()).find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!user) return { ok: false as const, reason: "no_account" as const };
    if (user.id === context.userId) return { ok: false as const, reason: "self" as const };
    const admin = await getAdmin();
    await admin.from("user_roles").delete().eq("user_id", user.id).in("role", ["admin", "viewer"]);
    await admin.from("user_roles").insert({ user_id: user.id, role: data.role === "owner" ? "admin" : "viewer" });
    return { ok: true as const };
  });

export const removeTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await requirePanel(context, "owner");
    if (data.userId === context.userId) return { ok: false as const };
    const admin = await getAdmin();
    await admin.from("user_roles").delete().eq("user_id", data.userId).in("role", ["admin", "viewer"]);
    return { ok: true as const };
  });

const settingsInput = z.object({
  contact_email: z.string().trim().email().max(254),
  whatsapp_number: z.string().trim().regex(/^\d{6,15}$/, "Digits only, with country code"),
  instagram_url: z.string().trim().url().max(300),
  calendly_url: z.string().trim().url().startsWith("https://calendly.com/").max(300),
  hero_headline: z.string().trim().min(3).max(120),
  hero_subheading: z.string().trim().min(3).max(400),
  scarcity_enabled: z.boolean(),
  scarcity_text: z.string().trim().max(200),
  checklist_enabled: z.boolean(),
  announcement_text: z.string().trim().max(200),
});

export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => settingsInput.parse(d))
  .handler(async ({ context, data }) => {
    await requirePanel(context, "owner");
    const admin = await getAdmin();
    const { error } = await admin
      .from("site_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error("Could not save settings");
    return { ok: true };
  });

export const changePanelPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ current: z.string().min(1).max(200), next: z.string().min(6).max(200) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requirePanel(context, "owner");
    const admin = await getAdmin();
    const { data: cfg } = await admin
      .from("admin_config")
      .select("panel_password_hash, panel_password_salt")
      .eq("id", 1)
      .single();
    if (!cfg || !hashesMatch(hashPassword(data.current, cfg.panel_password_salt), cfg.panel_password_hash)) {
      return { ok: false as const };
    }
    const salt = newSalt();
    await admin
      .from("admin_config")
      .update({ panel_password_hash: hashPassword(data.next, salt), panel_password_salt: salt })
      .eq("id", 1);
    return { ok: true as const };
  });

export const lockAllPanels = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requirePanel(context, "owner");
    const admin = await getAdmin();
    await admin.from("admin_config").update({ sessions_valid_after: new Date().toISOString() }).eq("id", 1);
    const session = await panelSession();
    await session.clear();
    return { ok: true };
  });
