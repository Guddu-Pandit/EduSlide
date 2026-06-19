-- Lets the user request a specific slide count when generating, and keeps
-- it on the row so retrying a failed generation reuses the same target.
alter table public.presentations
  add column if not exists requested_slide_count int;
