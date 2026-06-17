-- Backfill profiles for any auth.users created before the
-- on_auth_user_created trigger (0001) existed.

insert into public.profiles (id, full_name, role)
select
  u.id,
  u.raw_user_meta_data ->> 'full_name',
  'user'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
