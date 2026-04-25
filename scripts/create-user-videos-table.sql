-- Run this in Supabase SQL Editor

create table if not exists user_videos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled Video',
  video_url   text not null,
  filename    text not null,
  duration    numeric default 0,
  file_size   bigint default 0,
  status      text not null default 'uploaded', -- uploaded | transcribing | ready | error
  transcript  jsonb,   -- full Whisper verbose_json response
  captions    jsonb,   -- processed caption segments [{start, end, text}]
  caption_style jsonb, -- {fontSize, color, position, animation, bgColor}
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table user_videos enable row level security;

create policy "Users can manage their own videos"
  on user_videos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger user_videos_updated_at
  before update on user_videos
  for each row execute function update_updated_at();
