
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'jobseeker' check (role in ('jobseeker','employer')),
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'role','jobseeker'));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Jobs
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  location text not null,
  job_type text not null default 'Full-time',
  salary text,
  description text not null,
  requirements text,
  created_at timestamptz not null default now()
);
grant select on public.jobs to anon;
grant select, insert, update, delete on public.jobs to authenticated;
grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "jobs_select_all" on public.jobs for select using (true);
create policy "jobs_insert_own" on public.jobs for insert to authenticated with check (auth.uid() = posted_by);
create policy "jobs_update_own" on public.jobs for update to authenticated using (auth.uid() = posted_by);
create policy "jobs_delete_own" on public.jobs for delete to authenticated using (auth.uid() = posted_by);

-- Applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  cover_letter text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (job_id, applicant_id)
);
grant select, insert, update on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "apps_insert_own" on public.applications for insert to authenticated with check (auth.uid() = applicant_id);
create policy "apps_select_own_or_employer" on public.applications for select to authenticated using (
  auth.uid() = applicant_id or auth.uid() in (select posted_by from public.jobs where id = job_id)
);
create policy "apps_update_employer" on public.applications for update to authenticated using (
  auth.uid() in (select posted_by from public.jobs where id = job_id)
);
