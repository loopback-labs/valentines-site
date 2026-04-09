-- Public-safe view for published Valentine sites.
-- Excludes sensitive columns like password_hash and user_id.
create or replace view public.valentine_sites_public
with (security_invoker = true) as
select
  id,
  slug,
  headline,
  subtext,
  yes_button_text,
  no_button_text,
  no_button_variants,
  theme,
  template,
  is_published,
  password_protected,
  view_count,
  yes_count,
  enable_date_planning,
  available_dates,
  time_slots,
  food_options,
  activity_options,
  background_photos,
  photo_display_mode,
  success_headline,
  success_subtext,
  created_at,
  updated_at
from public.valentine_sites
where is_published = true;

grant select on public.valentine_sites_public to anon, authenticated;
