-- Drop the overly permissive policy
DROP POLICY "Anyone can insert responses" ON public.site_responses;

-- Create a more secure policy that validates the site exists and is published
CREATE POLICY "Anyone can insert responses for published sites"
    ON public.site_responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.valentine_sites
            WHERE valentine_sites.id = site_id
            AND valentine_sites.is_published = true
        )
    );