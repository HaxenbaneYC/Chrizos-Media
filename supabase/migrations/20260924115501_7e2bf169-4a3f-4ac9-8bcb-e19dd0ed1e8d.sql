-- Site settings: single editable row, readable by everyone (public site content only).
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  contact_email text not null default 'chrizosmedia@gmail.com',
  whatsapp_number text not null default '971504254366',
  instagram_url text not null default 'https://www.instagram.com/chrizosmedia/',
  calendly_url text not null default 'https://calendly.com/chrizosmedia/youssef',
  hero_headline text not null default 'More sales. More revenue. More recognition.',
  hero_subheading text not null default 'Chrizos Media helps Dubai businesses turn attention into paying customers, with strategy, campaigns, and content built around your local market, not generic playbooks.',
  scarcity_enabled boolean not null default true,
  scarcity_text text not null default 'We''re currently taking on our first 5 clients: limited spots, and each one gets full focus.',
  checklist_enabled boolean not null default true,
  announcement_text text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1);
grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Anyone can read site settings" on public.site_settings for select to anon, authenticated using (true);

-- Inquiries from the Work With Us form.
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  service text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','won','lost')),
  created_at timestamptz not null default now()
);
create index inquiries_created_idx on public.inquiries (created_at desc);
grant all on public.inquiries to service_role;
alter table public.inquiries enable row level security;

-- Panel password hash: server-only.
create table public.admin_config (
  id int primary key default 1 check (id = 1),
  panel_password_hash text not null,
  panel_password_salt text not null,
  sessions_valid_after timestamptz not null default now()
);
grant all on public.admin_config to service_role;
alter table public.admin_config enable row level security;

-- Anonymous booking clicks.
alter table public.checklist_events drop constraint checklist_events_event_type_check;
alter table public.checklist_events add constraint checklist_events_event_type_check check (event_type in ('signup','download','booking'));
alter table public.checklist_events drop constraint checklist_events_source_check;
alter table public.checklist_events add constraint checklist_events_source_check check (source in ('page','email','calendly','whatsapp'));