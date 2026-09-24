grant select on public.inquiries to authenticated;
create policy "Team can read inquiries" on public.inquiries for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'viewer'));
-- admin_config is intentionally server-only: no client policies.
create policy "No client access to admin config" on public.admin_config for select to authenticated using (false);