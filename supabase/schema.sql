-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Uma linha por jogador com o save completo do app.
create table if not exists public.saves (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.saves enable row level security;

-- Cada pessoa só vê e altera o próprio save.
drop policy if exists "ler o proprio save" on public.saves;
create policy "ler o proprio save" on public.saves
  for select using (auth.uid() = user_id);

drop policy if exists "criar o proprio save" on public.saves;
create policy "criar o proprio save" on public.saves
  for insert with check (auth.uid() = user_id);

drop policy if exists "atualizar o proprio save" on public.saves;
create policy "atualizar o proprio save" on public.saves
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
