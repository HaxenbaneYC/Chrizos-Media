create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- Privacy-friendly: no emails, IPs, or identifiers — only event type, source, and time.
create table public.checklist_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('signup','download')),
  source text not null default 'page' check (source in ('page','email')),
  created_at timestamptz not null default now()
);
create index checklist_events_created_idx on public.checklist_events (created_at);
grant select on public.checklist_events to authenticated;
grant all on public.checklist_events to service_role;
alter table public.checklist_events enable row level security;
create policy "Admins read checklist events" on public.checklist_events for select to authenticated using (public.has_role(auth.uid(), 'admin'));