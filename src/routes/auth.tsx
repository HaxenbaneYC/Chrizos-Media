import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Sign in | Chrizos Media" },
      { name: "description", content: "Private sign-in for the Chrizos Media team." },
      { property: "og:title", content: "Sign in | Chrizos Media" },
      { property: "og:description", content: "Private sign-in for the Chrizos Media team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setBusy(true);
    setMessage("");
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMessage(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/dashboard" },
      });
      setBusy(false);
      setMessage(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-section-navy px-6">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-sm space-y-4 rounded-2xl p-8">
        <h1 className="text-2xl font-extrabold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <Input name="email" type="email" required placeholder="Email" autoComplete="email" />
        <Input name="password" type="password" required minLength={8} placeholder="Password" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
        <Button type="submit" disabled={busy} className="w-full font-extrabold">
          {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
        {message ? <p className="text-sm text-foreground/80" role="status">{message}</p> : null}
        <button type="button" className="text-sm underline text-foreground/70" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "Need an account? Create one" : "Have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
