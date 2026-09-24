import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { useSession } from "@tanstack/react-start/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type PanelSession = { unlockedAt?: number; userId?: string };
const TWELVE_HOURS = 60 * 60 * 12;

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "chrizos-admin-panel",
    maxAge: TWELVE_HOURS,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function panelSession() {
  return useSession<PanelSession>(sessionConfig());
}

export async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export function hashPassword(password: string, salt: string) {
  return createHash("sha256").update(salt + password, "utf8").digest("hex");
}

export function newSalt() {
  return randomBytes(16).toString("hex");
}

export function hashesMatch(a: string, b: string) {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

export type PanelRole = "owner" | "viewer";

export async function getRole(supabase: SupabaseClient<Database>, userId: string): Promise<PanelRole | null> {
  const [{ data: isAdmin }, { data: isViewer }] = await Promise.all([
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabase.rpc("has_role", { _user_id: userId, _role: "viewer" }),
  ]);
  if (isAdmin) return "owner";
  if (isViewer) return "viewer";
  return null;
}

export async function isUnlocked(userId: string) {
  const session = await panelSession();
  const { unlockedAt, userId: sessionUser } = session.data;
  if (!unlockedAt || sessionUser !== userId) return false;
  if (Date.now() - unlockedAt > TWELVE_HOURS * 1000) return false;
  const admin = await getAdmin();
  const { data } = await admin.from("admin_config").select("sessions_valid_after").eq("id", 1).single();
  if (data && new Date(data.sessions_valid_after).getTime() > unlockedAt) return false;
  return true;
}

/** Throws unless the caller has a team role AND has unlocked the panel. */
export async function requirePanel(
  context: { supabase: SupabaseClient<Database>; userId: string },
  need: PanelRole = "viewer",
) {
  const role = await getRole(context.supabase, context.userId);
  if (!role) throw new Error("Forbidden");
  if (need === "owner" && role !== "owner") throw new Error("Owners only");
  if (!(await isUnlocked(context.userId))) throw new Error("Panel locked");
  return role;
}
