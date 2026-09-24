import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  changePanelPassword,
  deleteInquiry,
  getOverview,
  getPanelStatus,
  listInquiries,
  listTeam,
  lockAllPanels,
  lockPanel,
  removeTeamMember,
  setTeamMember,
  unlockPanel,
  updateInquiryStatus,
  updateSiteSettings,
} from "@/lib/admin.functions";
import { getSiteSettings, type SiteSettings } from "@/lib/site-settings.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Admin Panel | Chrizos Media" },
      { name: "description", content: "Private control panel for the Chrizos Media website." },
      { property: "og:title", content: "Admin Panel | Chrizos Media" },
      { property: "og:description", content: "Private control panel for the Chrizos Media website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const statusFn = useServerFn(getPanelStatus);
  const lockFn = useServerFn(lockPanel);
  const status = useQuery({ queryKey: ["panel-status"], queryFn: () => statusFn() });

  async function signOut() {
    await lockFn();
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function lock() {
    await lockFn();
    queryClient.clear();
    status.refetch();
  }

  return (
    <main className="min-h-screen bg-section-navy px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-foreground/60">Chrizos Media</p>
            <h1 className="text-3xl font-extrabold">Admin panel</h1>
            <p className="mt-1 text-sm text-foreground/70">Signed in as {user.email}</p>
          </div>
          <div className="flex gap-2">
            {status.data?.unlocked ? <Button variant="outline" onClick={lock}>Lock panel</Button> : null}
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </header>

        {status.isLoading ? (
          <p>Loading…</p>
        ) : !status.data?.role ? (
          <Card>
            <p className="font-bold">This account doesn't have panel access.</p>
            <p className="mt-1 text-sm text-foreground/70">Ask the owner to add you under Team &amp; Access.</p>
          </Card>
        ) : !status.data.unlocked ? (
          <UnlockForm onUnlocked={() => status.refetch()} />
        ) : (
          <Panel role={status.data.role} />
        )}
      </div>
    </main>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

function UnlockForm({ onUnlocked }: { onUnlocked: () => void }) {
  const unlock = useServerFn(unlockPanel);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const password = String(new FormData(e.currentTarget).get("panelPassword") ?? "");
    const res = await unlock({ data: { password } });
    setBusy(false);
    if (res.ok) onUnlocked();
    else setError(true);
  }
  return (
    <Card className="mx-auto max-w-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-xl font-extrabold">Enter panel password</h2>
        <Input name="panelPassword" type="password" required autoComplete="off" aria-label="Panel password" />
        {error ? <p className="text-sm font-semibold" role="alert">Incorrect password.</p> : null}
        <Button type="submit" disabled={busy} className="w-full font-extrabold">{busy ? "Checking…" : "Unlock"}</Button>
      </form>
    </Card>
  );
}

function Panel({ role }: { role: "owner" | "viewer" }) {
  const isOwner = role === "owner";
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="flex h-auto flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        <TabsTrigger value="team">Team &amp; Access</TabsTrigger>
        {isOwner ? <TabsTrigger value="settings">Website Settings</TabsTrigger> : null}
        {isOwner ? <TabsTrigger value="security">Security</TabsTrigger> : null}
      </TabsList>
      <TabsContent value="overview"><Overview /></TabsContent>
      <TabsContent value="inquiries"><Inquiries isOwner={isOwner} /></TabsContent>
      <TabsContent value="team"><Team isOwner={isOwner} /></TabsContent>
      {isOwner ? <TabsContent value="settings"><Settings /></TabsContent> : null}
      {isOwner ? <TabsContent value="security"><Security /></TabsContent> : null}
    </Tabs>
  );
}

/* ---------------- Overview ---------------- */

const RANGES = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: 0 },
] as const;

function Overview() {
  const fn = useServerFn(getOverview);
  const [range, setRange] = useState<(typeof RANGES)[number]>(RANGES[1]);
  const q = useQuery({ queryKey: ["overview", range.key], queryFn: () => fn({ data: { days: range.days } }) });

  const stats = useMemo(() => {
    const events = q.data?.events ?? [];
    const inquiries = q.data?.inquiries ?? [];
    const count = (t: string, s?: string) => events.filter((e) => e.event_type === t && (!s || e.source === s)).length;
    const signups = count("signup");
    const downloads = count("download");
    const earliest = [events[0]?.created_at, inquiries[0]].filter(Boolean).map((d) => new Date(d!).getTime());
    const days = range.days || Math.max(1, Math.ceil((Date.now() - Math.min(Date.now(), ...earliest)) / 86400000) + 1);
    const buckets = new Map<string, { s: number; d: number; i: number }>();
    for (let n = days - 1; n >= 0; n--) buckets.set(new Date(Date.now() - n * 86400000).toISOString().slice(0, 10), { s: 0, d: 0, i: 0 });
    for (const e of events) {
      const b = buckets.get(e.created_at.slice(0, 10));
      if (!b) continue;
      if (e.event_type === "signup") b.s++;
      if (e.event_type === "download") b.d++;
    }
    for (const d of inquiries) {
      const b = buckets.get(d.slice(0, 10));
      if (b) b.i++;
    }
    const series = [...buckets.entries()].map(([day, v]) => ({ day, ...v }));
    const max = Math.max(1, ...series.map((x) => Math.max(x.s, x.d, x.i)));
    return {
      signups,
      downloads,
      emailDl: count("download", "email"),
      rate: signups ? Math.round((downloads / signups) * 100) : 0,
      inquiries: inquiries.length,
      bookings: count("booking", "calendly"),
      whatsapp: count("booking", "whatsapp"),
      series,
      max,
    };
  }, [q.data, range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Time range">
        {RANGES.map((r) => (
          <Button key={r.key} size="sm" variant={r.key === range.key ? "default" : "outline"} onClick={() => setRange(r)}>
            {r.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Checklist sign-ups" value={stats.signups} />
        <Stat label="Checklist downloads" value={stats.downloads} note={`${stats.emailDl} from email, ${stats.downloads - stats.emailDl} from site`} />
        <Stat label="Download rate" value={`${stats.rate}%`} note="Downloads per sign-up" />
        <Stat label="Inquiries" value={stats.inquiries} note="Work With Us form" />
        <Stat label="Calls booked" value={stats.bookings} note="Confirmed in Calendly" />
        <Stat label="WhatsApp clicks" value={stats.whatsapp} />
      </div>
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
          <Legend className="bg-primary" label="Sign-ups" />
          <Legend className="bg-foreground" label="Downloads" />
          <Legend className="bg-foreground/40" label="Inquiries" />
        </div>
        {q.isLoading ? <p>Loading…</p> : (
          <div className="flex h-56 items-end gap-px overflow-x-auto">
            {stats.series.map((p) => (
              <div key={p.day} className="flex h-full min-w-[8px] flex-1 items-end gap-px" title={`${p.day}: ${p.s} sign-ups, ${p.d} downloads, ${p.i} inquiries`}>
                <div className="flex-1 rounded-t bg-primary" style={{ height: `${(p.s / stats.max) * 100}%` }} />
                <div className="flex-1 rounded-t bg-foreground" style={{ height: `${(p.d / stats.max) * 100}%` }} />
                <div className="flex-1 rounded-t bg-foreground/40" style={{ height: `${(p.i / stats.max) * 100}%` }} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex justify-between text-xs text-foreground/60">
          <span>{stats.series[0]?.day}</span>
          <span>{stats.series.at(-1)?.day}</span>
        </div>
        <p className="mt-4 text-xs text-foreground/60">Counts only. No visitor emails or details are stored for checklist and booking activity.</p>
      </Card>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return <span className="flex items-center gap-2"><i className={`inline-block h-3 w-3 rounded-sm ${className}`} />{label}</span>;
}

function Stat({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">{label}</p>
      <p className="mt-2 text-4xl font-extrabold">{value}</p>
      {note ? <p className="mt-1 text-xs text-foreground/60">{note}</p> : null}
    </Card>
  );
}

/* ---------------- Inquiries ---------------- */

const STATUSES = ["new", "contacted", "won", "lost"] as const;

function Inquiries({ isOwner }: { isOwner: boolean }) {
  const listFn = useServerFn(listInquiries);
  const updateFn = useServerFn(updateInquiryStatus);
  const deleteFn = useServerFn(deleteInquiry);
  const q = useQuery({ queryKey: ["inquiries"], queryFn: () => listFn() });
  const [filter, setFilter] = useState<string>("all");
  const rows = (q.data?.inquiries ?? []).filter((r) => filter === "all" || r.status === filter);

  function exportCsv() {
    const header = ["Date", "Name", "Email", "Phone", "Service", "Status", "Message"];
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = (q.data?.inquiries ?? []).map((r) =>
      [r.created_at, r.name, r.email, r.phone, r.service, r.status, r.message].map(esc).join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `chrizos-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={exportCsv} disabled={!q.data?.inquiries.length}>Export CSV</Button>
      </div>
      {q.isLoading ? <p>Loading…</p> : rows.length === 0 ? (
        <Card><p className="text-foreground/70">No inquiries yet. New messages from the Work With Us form will appear here.</p></Card>
      ) : (
        rows.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold">{r.name}</p>
                <p className="text-sm text-foreground/75">
                  <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>
                  {r.phone ? <> · <a className="underline" href={`tel:${r.phone}`}>{r.phone}</a></> : null}
                </p>
                <p className="mt-1 text-xs text-foreground/60">{r.service} · {new Date(r.created_at).toLocaleString()}</p>
              </div>
              {isOwner ? (
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Status"
                    value={r.status}
                    onChange={async (e) => {
                      await updateFn({ data: { id: r.id, status: e.target.value as (typeof STATUSES)[number] } });
                      q.refetch();
                    }}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (!confirm("Delete this inquiry?")) return;
                      await deleteFn({ data: { id: r.id } });
                      q.refetch();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <span className="rounded-full border border-border px-3 py-1 text-xs capitalize">{r.status}</span>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{r.message}</p>
          </Card>
        ))
      )}
    </div>
  );
}

/* ---------------- Team ---------------- */

function Team({ isOwner }: { isOwner: boolean }) {
  const listFn = useServerFn(listTeam);
  const setFn = useServerFn(setTeamMember);
  const removeFn = useServerFn(removeTeamMember);
  const q = useQuery({ queryKey: ["team"], queryFn: () => listFn() });
  const [msg, setMsg] = useState("");

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await setFn({ data: { email: String(fd.get("email")), role: fd.get("role") as "owner" | "viewer" } });
    if (res.ok) {
      setMsg("Access updated.");
      form.reset();
      q.refetch();
    } else {
      setMsg(res.reason === "no_account"
        ? "No account found for that email. Ask them to create one at /auth first."
        : "You can't change your own access.");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-extrabold">People with access</h2>
        <ul className="mt-4 divide-y divide-border">
          {(q.data?.members ?? []).map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-semibold">{m.email}{m.userId === q.data?.me ? " (you)" : ""}</p>
                <p className="text-xs capitalize text-foreground/60">{m.role === "owner" ? "Owner: full control" : "Viewer: stats and inquiries only"}</p>
              </div>
              {isOwner && m.userId !== q.data?.me ? (
                <Button size="sm" variant="outline" onClick={async () => {
                  if (!confirm(`Remove access for ${m.email}?`)) return;
                  await removeFn({ data: { userId: m.userId } });
                  q.refetch();
                }}>Remove</Button>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>
      {isOwner ? (
        <Card>
          <form onSubmit={onAdd} className="space-y-3">
            <h2 className="text-lg font-extrabold">Add or change a teammate</h2>
            <p className="text-sm text-foreground/70">They need to create an account at /auth first. They'll also need the panel password to get in.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input name="email" type="email" required placeholder="teammate@email.com" aria-label="Teammate email" />
              <select name="role" aria-label="Role" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="viewer">Viewer</option>
                <option value="owner">Owner</option>
              </select>
              <Button type="submit">Save</Button>
            </div>
            {msg ? <p className="text-sm" role="status">{msg}</p> : null}
          </form>
        </Card>
      ) : null}
    </div>
  );
}

/* ---------------- Settings ---------------- */

function Settings() {
  const getFn = useServerFn(getSiteSettings);
  const saveFn = useServerFn(updateSiteSettings);
  const q = useQuery({ queryKey: ["site-settings"], queryFn: () => getFn() });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: SiteSettings = {
      contact_email: String(fd.get("contact_email")),
      whatsapp_number: String(fd.get("whatsapp_number")).replace(/\D/g, ""),
      instagram_url: String(fd.get("instagram_url")),
      calendly_url: String(fd.get("calendly_url")),
      hero_headline: String(fd.get("hero_headline")),
      hero_subheading: String(fd.get("hero_subheading")),
      scarcity_enabled: fd.get("scarcity_enabled") === "on",
      scarcity_text: String(fd.get("scarcity_text")),
      checklist_enabled: fd.get("checklist_enabled") === "on",
      announcement_text: String(fd.get("announcement_text")),
    };
    setBusy(true);
    setMsg("");
    try {
      await saveFn({ data });
      setMsg("Saved. Changes are live on the website.");
      q.refetch();
    } catch {
      setMsg("Couldn't save. Check that emails and links are valid (Calendly links must start with https://calendly.com/).");
    } finally {
      setBusy(false);
    }
  }

  if (q.isLoading || !q.data) return <p>Loading…</p>;
  const s = q.data;
  return (
    <Card>
      <form onSubmit={onSave} className="grid gap-5">
        <Section title="Contact details">
          <Field label="Contact email" name="contact_email" defaultValue={s.contact_email} type="email" />
          <Field label="WhatsApp number (with country code, digits only)" name="whatsapp_number" defaultValue={s.whatsapp_number} />
          <Field label="Instagram link" name="instagram_url" defaultValue={s.instagram_url} type="url" />
          <Field label="Calendly booking link" name="calendly_url" defaultValue={s.calendly_url} type="url" />
        </Section>
        <Section title="Top of the homepage">
          <Field label="Headline" name="hero_headline" defaultValue={s.hero_headline} />
          <label className="grid gap-1 text-sm font-semibold">
            Subheading
            <Textarea name="hero_subheading" defaultValue={s.hero_subheading} rows={3} />
          </label>
          <Field label="Announcement bar (leave empty to hide)" name="announcement_text" defaultValue={s.announcement_text} required={false} />
        </Section>
        <Section title="Offers">
          <Toggle name="scarcity_enabled" label="Show the limited-spots line" defaultChecked={s.scarcity_enabled} />
          <Field label="Limited-spots text" name="scarcity_text" defaultValue={s.scarcity_text} required={false} />
          <Toggle name="checklist_enabled" label="Show the free checklist offer" defaultChecked={s.checklist_enabled} />
        </Section>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy} className="font-extrabold">{busy ? "Saving…" : "Save changes"}</Button>
          {msg ? <p className="text-sm" role="status">{msg}</p> : null}
        </div>
      </form>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-2 text-lg font-extrabold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, name, defaultValue, type = "text", required = true }: { label: string; name: string; defaultValue: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <Input name={name} type={type} defaultValue={defaultValue} required={required} />
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-5 w-5 accent-primary" />
      {label}
    </label>
  );
}

/* ---------------- Security ---------------- */

function Security() {
  const changeFn = useServerFn(changePanelPassword);
  const lockAllFn = useServerFn(lockAllPanels);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  async function onChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const next = String(fd.get("next"));
    if (next !== String(fd.get("confirm"))) return setMsg("The new passwords don't match.");
    try {
      const res = await changeFn({ data: { current: String(fd.get("current")), next } });
      setMsg(res.ok ? "Panel password changed." : "Current password is incorrect.");
      if (res.ok) form.reset();
    } catch {
      setMsg("New password must be at least 6 characters.");
    }
  }

  async function signOutEverywhere() {
    if (!confirm("Lock the panel and sign out on every device?")) return;
    await lockAllFn();
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut({ scope: "global" });
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <form onSubmit={onChange} className="space-y-3">
          <h2 className="text-lg font-extrabold">Change panel password</h2>
          <Input name="current" type="password" required placeholder="Current panel password" aria-label="Current panel password" autoComplete="off" />
          <Input name="next" type="password" required minLength={6} placeholder="New panel password" aria-label="New panel password" autoComplete="new-password" />
          <Input name="confirm" type="password" required minLength={6} placeholder="Repeat new password" aria-label="Repeat new password" autoComplete="new-password" />
          <Button type="submit">Change password</Button>
          {msg ? <p className="text-sm" role="status">{msg}</p> : null}
        </form>
      </Card>
      <Card>
        <h2 className="text-lg font-extrabold">Sign out everywhere</h2>
        <p className="mt-2 text-sm text-foreground/70">Locks the panel on every device and signs everyone out. Use this if you think someone else has your password.</p>
        <Button variant="outline" className="mt-4" onClick={signOutEverywhere}>Sign out everywhere</Button>
      </Card>
    </div>
  );
}
