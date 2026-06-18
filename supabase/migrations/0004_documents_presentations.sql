-- Adds product data: per-user preferences on profiles, plus the
-- documents (uploaded source files) and presentations (generated decks)
-- tables that back the dashboard.

alter table public.profiles
  add column if not exists plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  add column if not exists institution text,
  add column if not exists default_template text not null default 'corporate',
  add column if not exists speaker_notes_default boolean not null default true,
  add column if not exists email_on_completion boolean not null default true,
  add column if not exists auto_delete_uploads boolean not null default false;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  file_path text not null,
  file_type text not null check (file_type in ('pdf', 'docx', 'txt')),
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Users can view their own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

create table if not exists public.presentations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  document_id uuid references public.documents (id) on delete set null,
  name text not null,
  template text not null default 'corporate',
  slide_count int not null default 0,
  status text not null default 'queued' check (status in ('queued', 'generating', 'done', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.presentations enable row level security;

create policy "Users can view their own presentations"
  on public.presentations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own presentations"
  on public.presentations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own presentations"
  on public.presentations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own presentations"
  on public.presentations for delete
  using (auth.uid() = user_id);

create index if not exists documents_user_id_idx on public.documents (user_id);
create index if not exists presentations_user_id_idx on public.presentations (user_id);
create index if not exists presentations_document_id_idx on public.presentations (document_id);

-- Private storage bucket for uploaded source documents, scoped per user
-- via a `<user_id>/<filename>` path convention.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Users can upload to their own document folder"
  on storage.objects for insert
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view their own document files"
  on storage.objects for select
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own document files"
  on storage.objects for delete
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
