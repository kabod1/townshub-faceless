create table if not exists consulting_conversations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  messages jsonb not null default '[]',
  msg_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table consulting_conversations enable row level security;

drop policy if exists "Users can manage own conversation" on consulting_conversations;
create policy "Users can manage own conversation"
  on consulting_conversations for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
