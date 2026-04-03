create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'client' check (role in ('client', 'importer', 'admin')),
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users_can_view_own_profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "users_can_update_own_profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

create policy "service_role_full_access"
on public.profiles
for all
to service_role
using (true)
with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'client');

  if requested_role not in ('client', 'importer', 'admin') then
    requested_role := 'client';
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    approved
  )
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ''),
    requested_role,
    case when requested_role = 'admin' then true else false end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();
