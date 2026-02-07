-- Create a public view that excludes user_id for privacy
CREATE VIEW public.valentine_sites_public
WITH (security_invoker = on) AS
SELECT 
    id,
    slug,
    headline,
    subtext,
    yes_button_text,
    no_button_text,
    no_button_variants,
    template,
    theme,
    is_published,
    view_count,
    yes_count,
    created_at,
    updated_at,
    enable_date_planning,
    available_dates,
    time_slots,
    food_options,
    activity_options,
    success_headline,
    success_subtext,
    background_photos,
    photo_display_mode,
    password_protected
FROM public.valentine_sites
WHERE is_published = true;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.valentine_sites_public TO anon;
GRANT SELECT ON public.valentine_sites_public TO authenticated;