create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  company_name text,
  phone text,
  email text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,
  notes text
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_id uuid references public.customers(id) on delete set null,
  project_name text,
  project_type text,
  project_status text default 'New',
  requested_work text,
  budget_range text,
  target_timeline text,
  site_address_same_as_customer boolean default true,
  site_address_line1 text,
  site_address_line2 text,
  site_city text,
  site_state text,
  site_zip text,
  internal_notes text
);

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_id uuid references public.projects(id) on delete cascade,
  visit_date date,
  access_notes text,
  existing_conditions text,
  measurements text,
  requirements text,
  customer_concerns text,
  follow_up_items text
);

create table if not exists public.estimate_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_id uuid references public.projects(id) on delete cascade,
  item_type text,
  description text,
  quantity numeric,
  unit_cost numeric,
  labor_hours numeric,
  labor_rate numeric,
  total numeric
);

create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_id uuid references public.projects(id) on delete cascade,
  storage_path text,
  caption text,
  category text
);

alter table public.customers enable row level security;
alter table public.projects enable row level security;
alter table public.site_visits enable row level security;
alter table public.estimate_items enable row level security;
alter table public.project_photos enable row level security;

create policy "Authenticated users can manage customers"
on public.customers for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage projects"
on public.projects for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage site visits"
on public.site_visits for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage estimate items"
on public.estimate_items for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage project photos"
on public.project_photos for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('project-photos', 'project-photos', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload project photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-photos');

create policy "Authenticated users can read project photos"
on storage.objects for select
to authenticated
using (bucket_id = 'project-photos');

create policy "Authenticated users can update project photos"
on storage.objects for update
to authenticated
using (bucket_id = 'project-photos')
with check (bucket_id = 'project-photos');

create policy "Authenticated users can delete project photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-photos');

create index if not exists customers_created_at_idx on public.customers(created_at desc);
create index if not exists projects_customer_id_idx on public.projects(customer_id);
create index if not exists projects_created_at_idx on public.projects(created_at desc);
create index if not exists site_visits_project_id_idx on public.site_visits(project_id);
create index if not exists estimate_items_project_id_idx on public.estimate_items(project_id);
create index if not exists project_photos_project_id_idx on public.project_photos(project_id);
