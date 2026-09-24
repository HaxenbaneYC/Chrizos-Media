import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Checklist Dashboard | Chrizos Media" },
      { name: "description", content: "Private checklist sign-up and download stats." },
      { property: "og:title", content: "Checklist Dashboard | Chrizos Media" },
      { property: "og:description", content: "Private checklist sign-up and download stats." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const RANGES = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: 0 },
] as const;

type Row = { event_type: string; source: string; created_at: string };

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [range, setRange] = useState<(typeof RANGES)[number]>(RANGES[1]);

  const admin = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return Boolean(data);
    },
  });

  const events = useQuery({
    queryKey: ["checklist-events", range.key],
    enabled: admin.data === true,
    queryFn: async () => {
      let q = supabase.from("checklist_events").select("event_type, source, created_at").order("created_at").limit(10000);
      if (range.days) q = q.gte("created_at", new Date(Date.now() - range.days * 86400000).toISOString());
      const { data, error } = await q;
      if (error) throw error;
      return data as Row[];
    },
  });

  const stats = useMemo(() => {
    const rows = events.data ?? [];
    const signups = rows.filter((r) => r.event_type === "signup").length;
    const downloads = rows.filter((r) => r.event_type === "download").length;
    const emailDl = rows.filter((r) => r.event_type === "download" && r.source === "email").length;
    const days = range.days || Math.max(1, Math.ceil((Date.now() - (rows[0] ? new Date(rows[0].created_at).getTime() : Date.now())) / 86400000) + 1);
    const buckets = new Map<string, { s: number; d: number }>();
    for (let i = days - 1; i >= 0; i--) buckets.set(dayKey(new Date(Date.now() - i * 86400000)), { s: 0, d: 0 });
    for (const r of rows) {
      const b = buckets.get(r.created_at.slice(0, 10));
      if (!b) continue;
      if (r.event_type === "signup") b.s++;
      else b.d++;
    }
    const series = [...buckets.entries()].map(([day, v]) => ({ day, ...v }));
    const max = Math.max(1, ...series.map((x) => Math.max(x.s, x.d)));
    return { signups, downloads, emailDl, rate: signups ? Math.round((downloads / signups) * 100) : 0, series, max };
  }, [events.data, range]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-section-navy px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-foreground/60">Private</p>
            <h1 className="text-3xl font-extrabold">Checklist dashboard</h1>
            <p className="mt-1 text-sm text-foreground/70">Counts only — no emails or visitor details are stored.</p>
          </div>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </header>

        {admin.isLoading ? <p>Loading…</p> : admin.data === false ? (
          <div className="glass-panel rounded-2xl p-6">
            <p className="font-bold">This account doesn't have dashboard access yet.</p>
            <p className="mt-1 text-sm text-foreground/70">Signed in as {user.email}.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Time range">
              {RANGES.map((r) => (
                <Button key={r.key} size="sm" variant={r.key === range.key ? "default" : "outline"} onClick={() => setRange(r)}>
                  {r.label}
                </Button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Sign-ups" value={stats.signups} />
              <Stat label="Downloads" value={stats.downloads} note={`${stats.emailDl} from email, ${stats.downloads - stats.emailDl} from site`} />
              <Stat label="Download rate" value={`${stats.rate}%`} note="Downloads per sign-up" />
            </div>
            <section className="glass-panel rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-sm bg-primary" />Sign-ups</span>
                <span className="flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-sm bg-foreground" />Downloads</span>
              </div>
              {events.isLoading ? <p>Loading…</p> : (
                <div className="flex h-56 items-end gap-px overflow-x-auto">
                  {stats.series.map((p) => (
                    <div key={p.day} className="flex h-full min-w-[6px] flex-1 items-end gap-px" title={`${p.day}: ${p.s} sign-ups, ${p.d} downloads`}>
                      <div className="flex-1 rounded-t bg-primary" style={{ height: `${(p.s / stats.max) * 100}%` }} />
                      <div className="flex-1 rounded-t bg-foreground" style={{ height: `${(p.d / stats.max) * 100}%` }} />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex justify-between text-xs text-foreground/60">
                <span>{stats.series[0]?.day}</span>
                <span>{stats.series.at(-1)?.day}</span>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">{label}</p>
      <p className="mt-2 text-4xl font-extrabold">{value}</p>
      {note ? <p className="mt-1 text-xs text-foreground/60">{note}</p> : null}
    </div>
  );
}
