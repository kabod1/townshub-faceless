-- Run in Supabase SQL Editor to add word-level timestamps for animated captions
alter table user_videos add column if not exists words jsonb;
