-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(site_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.valentine_sites 
    SET view_count = view_count + 1 
    WHERE id = site_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to increment yes count
CREATE OR REPLACE FUNCTION public.increment_yes_count(site_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.valentine_sites 
    SET yes_count = yes_count + 1 
    WHERE id = site_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;