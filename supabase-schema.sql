-- ============================================
-- Supabase Schema Setup for Portfolio Website
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- PROJECTS TABLE
-- =====================
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  tech_stack text[] default '{}',
  category text default 'frontend',
  image_url text default '',
  live_url text default '',
  github_url text default '',
  created_at timestamptz default now()
);

-- RLS for projects
alter table projects enable row level security;

drop policy if exists "Public can read projects" on projects;
create policy "Public can read projects"
  on projects for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert projects" on projects;
create policy "Authenticated can insert projects"
  on projects for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update projects" on projects;
create policy "Authenticated can update projects"
  on projects for update
  to authenticated
  using (true);

drop policy if exists "Authenticated can delete projects" on projects;
create policy "Authenticated can delete projects"
  on projects for delete
  to authenticated
  using (true);

-- =====================
-- SKILLS TABLE
-- =====================
create table if not exists skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  level integer default 50,
  category text default 'frontend',
  created_at timestamptz default now()
);

-- RLS for skills
alter table skills enable row level security;

drop policy if exists "Public can read skills" on skills;
create policy "Public can read skills"
  on skills for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert skills" on skills;
create policy "Authenticated can insert skills"
  on skills for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can delete skills" on skills;
create policy "Authenticated can delete skills"
  on skills for delete
  to authenticated
  using (true);

-- =====================
-- MESSAGES TABLE
-- =====================
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- RLS for messages
alter table messages enable row level security;

drop policy if exists "Anyone can insert messages" on messages;
create policy "Anyone can insert messages"
  on messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read messages" on messages;
create policy "Authenticated can read messages"
  on messages for select
  to authenticated
  using (true);

-- =====================
-- STORAGE BUCKET
-- =====================
-- Create bucket 'project-images' in Supabase Dashboard → Storage
-- Set to Public bucket for read access
-- Authenticated users can upload
