create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_email text,
  category text not null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table support_tickets enable row level security;

drop policy if exists "Users can insert own tickets" on support_tickets;
create policy "Users can insert own tickets"
  on support_tickets for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own tickets" on support_tickets;
create policy "Users can view own tickets"
  on support_tickets for select
  to authenticated
  using (auth.uid() = user_id);
