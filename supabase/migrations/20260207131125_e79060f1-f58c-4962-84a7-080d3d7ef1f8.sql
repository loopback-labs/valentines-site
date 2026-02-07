-- Fix: Remove public access to valentine_sites base table to prevent password_hash exposure
-- The valentine_sites_public view (which excludes password_hash) should be used for public access

-- Drop the problematic policy that exposes password_hash to everyone
DROP POLICY IF EXISTS "Anyone can view published sites by slug" ON public.valentine_sites;

-- Note: The following policies remain intact:
-- - "Users can view their own sites" (owner can see their own data including password_hash for management)
-- - "Users can create/update/delete their own sites" (owner management)

-- The valentine_sites_public view already exists and excludes sensitive columns
-- Application code should use valentine_sites_public for public site viewing