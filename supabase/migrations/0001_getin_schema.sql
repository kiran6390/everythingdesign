-- GetIn — schema for profiles, shared happenings, and saved/going
-- Run this in Supabase Dashboard → SQL Editor → Run.

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  neighborhood text default 'Bandra',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'there'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- happenings (user-shared) ----------
create table if not exists public.happenings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  neighborhood text not null,
  venue text not null,
  address text,
  when_text text,
  time_bucket text not null default 'tonight',
  price text default 'Free',
  emoji text default '🔥',
  color text default '#C8FF00',
  vibe text default 'Chill',
  host text default 'You',
  description text,
  tags text[] default '{}',
  hype int default 1,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.happenings enable row level security;

-- any signed-in user can read all shared happenings
drop policy if exists "happenings_select_all" on public.happenings;
create policy "happenings_select_all" on public.happenings
  for select using (auth.uid() is not null);

drop policy if exists "happenings_insert_own" on public.happenings;
create policy "happenings_insert_own" on public.happenings
  for insert with check (auth.uid() = created_by);

drop policy if exists "happenings_update_own" on public.happenings;
create policy "happenings_update_own" on public.happenings
  for update using (auth.uid() = created_by);

drop policy if exists "happenings_delete_own" on public.happenings;
create policy "happenings_delete_own" on public.happenings
  for delete using (auth.uid() = created_by);

-- ---------- saved / going ----------
-- happening_id is text so it can reference either a seeded id ("1") or a uuid.
create table if not exists public.user_happenings (
  user_id uuid references auth.users(id) on delete cascade,
  happening_id text not null,
  kind text not null check (kind in ('saved', 'going')),
  created_at timestamptz default now(),
  primary key (user_id, happening_id, kind)
);
alter table public.user_happenings enable row level security;

drop policy if exists "user_happenings_manage_own" on public.user_happenings;
create policy "user_happenings_manage_own" on public.user_happenings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
