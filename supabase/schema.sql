create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  morning_available boolean not null default false,
  afternoon_available boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_availability_slots_updated_at on public.availability_slots;
create trigger set_availability_slots_updated_at
before update on public.availability_slots
for each row
execute function public.set_updated_at();

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(trim(first_name)) > 0),
  last_name text,
  phone text not null check (char_length(trim(phone)) > 0),
  design_status text not null check (design_status in ('yes', 'no', 'unsure')),
  comment text,
  selected_slots jsonb not null
    check (
      jsonb_typeof(selected_slots) = 'array'
      and jsonb_array_length(selected_slots) > 0
    ),
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;

grant select on table public.availability_slots to anon, authenticated;
grant insert, update, delete on table public.availability_slots to authenticated;

revoke all on table public.appointment_requests from anon, authenticated;

grant insert (
  first_name,
  last_name,
  phone,
  design_status,
  comment,
  selected_slots
) on table public.appointment_requests to anon, authenticated;

grant select on table public.appointment_requests to authenticated;

grant update (status) on table public.appointment_requests to authenticated;

alter table public.availability_slots enable row level security;
alter table public.appointment_requests enable row level security;

drop policy if exists "Public can read availability slots" on public.availability_slots;
create policy "Public can read availability slots"
on public.availability_slots
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert availability slots" on public.availability_slots;
create policy "Authenticated can insert availability slots"
on public.availability_slots
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update availability slots" on public.availability_slots;
create policy "Authenticated can update availability slots"
on public.availability_slots
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete availability slots" on public.availability_slots;
create policy "Authenticated can delete availability slots"
on public.availability_slots
for delete
to authenticated
using (true);

drop policy if exists "Public can create appointment requests" on public.appointment_requests;
create policy "Public can create appointment requests"
on public.appointment_requests
for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Authenticated can read appointment requests" on public.appointment_requests;
create policy "Authenticated can read appointment requests"
on public.appointment_requests
for select
to authenticated
using (true);

drop policy if exists "Authenticated can update appointment requests" on public.appointment_requests;
create policy "Authenticated can update appointment requests"
on public.appointment_requests
for update
to authenticated
using (true)
with check (status in ('pending', 'contacted', 'confirmed', 'cancelled'));
