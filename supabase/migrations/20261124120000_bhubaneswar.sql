-- Bhubaneswar defaults for new profiles, with previously issued invite codes still valid.
alter table public.profiles
  alter column location set default 'Saheed Nagar',
  alter column spot set default 'rupali-square';

alter table public.invites
  drop constraint invites_code_check,
  add constraint invites_code_check check (code ~ '^(BBS|BLR)-[A-Z0-9]{6}$');

create or replace function public.gen_invite_code() returns text
language plpgsql volatile set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  c text;
begin
  loop
    c := 'BBS-';
    for i in 1..6 loop
      c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.invites where code = c);
  end loop;
  return c;
end $$;

create or replace function public.check_invite(p_code text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  r public.invites;
  st text;
  who public.profiles;
begin
  select * into r from public.invites where code = upper(trim(p_code));
  st := public.invite_state(r);
  if st <> 'ok' then
    return jsonb_build_object('state', st);
  end if;
  select * into who from public.profiles where id = r.owner;
  return jsonb_build_object(
    'state', 'ok',
    'inviter_name', coalesce(who.name, 'The founders'),
    'inviter_role', coalesce(who.role, 'People of Bhubaneswar')
  );
end $$;

create or replace function public.redeem_invite(p_code text, p_profile jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  r public.invites;
  st text;
begin
  if uid is null then
    return jsonb_build_object('ok', false, 'state', 'signed_out');
  end if;

  select * into r from public.invites where code = upper(trim(p_code)) for update;
  st := public.invite_state(r);
  if st <> 'ok' then
    return jsonb_build_object('ok', false, 'state', st);
  end if;

  insert into public.profiles as p (
    id, name, role, company, location, building, previously, open_to_work, skills,
    portfolio, linkedin, x, character, spot, status, invited_by
  ) values (
    uid,
    p_profile ->> 'name',
    p_profile ->> 'role',
    nullif(p_profile ->> 'company', ''),
    coalesce(nullif(p_profile ->> 'location', ''), 'Saheed Nagar'),
    nullif(p_profile ->> 'building', ''),
    nullif(p_profile ->> 'previously', ''),
    coalesce((p_profile ->> 'open_to_work')::boolean, false),
    coalesce(array(select jsonb_array_elements_text(p_profile -> 'skills')), '{}'),
    nullif(p_profile ->> 'portfolio', ''),
    nullif(p_profile ->> 'linkedin', ''),
    nullif(p_profile ->> 'x', ''),
    coalesce(nullif(p_profile ->> 'character', ''), 'designer'),
    coalesce(nullif(p_profile ->> 'spot', ''), 'rupali-square'),
    'approved',
    r.owner
  )
  on conflict (id) do update set
    name = excluded.name, role = excluded.role, company = excluded.company,
    location = excluded.location, building = excluded.building, previously = excluded.previously,
    open_to_work = excluded.open_to_work, skills = excluded.skills, portfolio = excluded.portfolio,
    linkedin = excluded.linkedin, x = excluded.x, character = excluded.character, spot = excluded.spot,
    -- an invite approves an application that was waiting (or turned down) too
    status = 'approved', invited_by = excluded.invited_by;

  update public.invites set state = 'used', used_by = uid, used_at = now() where code = r.code;

  if not exists (select 1 from public.invites where owner = uid) then
    perform public.issue_invites(uid, public.setting_int('invites_per_member', 2));
  end if;

  return jsonb_build_object('ok', true);
end $$;

create or replace function public.approve_application(p_id uuid, p_note text default null) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  a public.applications;
  p jsonb;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'state', 'not_admin');
  end if;

  select * into a from public.applications where id = p_id for update;
  if a.id is null then
    return jsonb_build_object('ok', false, 'state', 'missing');
  end if;
  if a.status not in ('paid', 'under_review') then
    return jsonb_build_object('ok', false, 'state', 'not_reviewable', 'status', a.status);
  end if;

  p := a.profile;
  insert into public.profiles as pr (
    id, name, role, company, location, building, previously, open_to_work, skills,
    portfolio, linkedin, x, character, spot, status
  ) values (
    a.user_id,
    p ->> 'name',
    p ->> 'role',
    nullif(p ->> 'company', ''),
    coalesce(nullif(p ->> 'location', ''), 'Saheed Nagar'),
    nullif(p ->> 'building', ''),
    nullif(p ->> 'previously', ''),
    coalesce((p ->> 'open_to_work')::boolean, false),
    coalesce(array(select jsonb_array_elements_text(p -> 'skills')), '{}'),
    nullif(p ->> 'portfolio', ''),
    nullif(p ->> 'linkedin', ''),
    nullif(p ->> 'x', ''),
    coalesce(nullif(p ->> 'character', ''), 'designer'),
    coalesce(nullif(p ->> 'spot', ''), 'rupali-square'),
    'approved'
  )
  on conflict (id) do update set
    name = excluded.name, role = excluded.role, company = excluded.company,
    location = excluded.location, building = excluded.building, previously = excluded.previously,
    open_to_work = excluded.open_to_work, skills = excluded.skills, portfolio = excluded.portfolio,
    linkedin = excluded.linkedin, x = excluded.x, character = excluded.character, spot = excluded.spot,
    status = 'approved';

  if not exists (select 1 from public.invites where owner = a.user_id) then
    perform public.issue_invites(a.user_id, public.setting_int('invites_per_member', 2));
  end if;

  update public.applications
    set status = 'approved', reviewer = auth.uid(), reason = nullif(trim(p_note), ''), decided_at = now()
    where id = a.id;

  return jsonb_build_object('ok', true);
end $$;
