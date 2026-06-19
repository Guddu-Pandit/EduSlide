-- Stores the AI-generated slide deck (title/bullets/notes per slide) so the
-- presentations list and detail view can render real output instead of just
-- tracking generation status.

alter table public.presentations
  add column if not exists content jsonb;
