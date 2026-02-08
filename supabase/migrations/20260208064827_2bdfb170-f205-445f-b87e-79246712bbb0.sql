
-- Allow anyone (including anonymous) to view published sites via the base table
-- This is required for the valentine_sites_public view to work for anonymous users
CREATE POLICY "Anyone can view published sites"
ON public.valentine_sites
FOR SELECT
USING (is_published = true);
