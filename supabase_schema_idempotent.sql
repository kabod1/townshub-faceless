-- Townshub Faceless — Supabase Database Schema (safe to re-run)

-- Drop policies safely (handles missing tables)
DO $$ BEGIN DROP POLICY IF EXISTS "Users can read own profile" ON profiles; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can update own profile" ON profiles; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can CRUD own scripts" ON scripts; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can CRUD own ideas" ON video_ideas; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can CRUD own tasks" ON production_tasks; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can CRUD own thumbnails" ON thumbnails; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can CRUD own channel profiles" ON channel_profiles; EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  plan         text not null default 'starter',
  scripts_used int  not null default 0,
  created_at   timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Scripts ───────────────────────────────────────────────────────────────────
create table if not exists scripts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  niche      text default 'General',
  format     text default 'listicle',
  words      int  default 0,
  duration   int  default 10,
  status     text not null default 'draft',
  sections   jsonb not null default '[]',
  created_at timestamptz default now()
);
alter table scripts enable row level security;
create policy "Users can CRUD own scripts" on scripts for all using (auth.uid() = user_id);

-- ── Video Ideas ───────────────────────────────────────────────────────────────
create table if not exists video_ideas (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  hook            text,
  virality        int  default 0,
  estimated_views text,
  niche           text,
  format          text,
  difficulty      text default 'Medium',
  why_it_works    text,
  created_at      timestamptz default now()
);
alter table video_ideas enable row level security;
create policy "Users can CRUD own ideas" on video_ideas for all using (auth.uid() = user_id);

-- ── Production Tasks ──────────────────────────────────────────────────────────
create table if not exists production_tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  stage      text not null default 'ideas',
  priority   text not null default 'medium',
  due_date   text,
  assignee   text,
  tags       text[] default '{}',
  checklist  jsonb not null default '[]',
  position   int   default 0,
  created_at timestamptz default now()
);
alter table production_tasks enable row level security;
create policy "Users can CRUD own tasks" on production_tasks for all using (auth.uid() = user_id);

-- ── Thumbnails ────────────────────────────────────────────────────────────────
create table if not exists thumbnails (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  data_url     text,
  storage_path text,
  created_at   timestamptz default now()
);
alter table thumbnails enable row level security;
create policy "Users can CRUD own thumbnails" on thumbnails for all using (auth.uid() = user_id);

-- ── Channel Profiles ──────────────────────────────────────────────────────────
create table if not exists channel_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  channel_name  text not null,
  channel_url   text,
  niche         text,
  writing_style text,
  created_at    timestamptz default now()
);
alter table channel_profiles enable row level security;
create policy "Users can CRUD own channel profiles" on channel_profiles for all using (auth.uid() = user_id);
