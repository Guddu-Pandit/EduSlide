-- Admin is a valid role (see 0001), but it must only ever be assigned
-- directly in the database (SQL editor / migration / direct connection).
-- Requests coming through the API with a logged-in user's JWT (auth.uid()
-- is set) can never change their own role, even though the existing
-- "Users can update their own profile" policy lets them update the row.

create or replace function public.protect_role_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role_before_update on public.profiles;

create trigger protect_role_before_update
  before update on public.profiles
  for each row execute function public.protect_role_column();
