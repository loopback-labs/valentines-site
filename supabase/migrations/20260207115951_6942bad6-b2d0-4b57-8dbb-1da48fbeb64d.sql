-- Add date planning columns to valentine_sites
ALTER TABLE public.valentine_sites
ADD COLUMN enable_date_planning boolean NOT NULL DEFAULT false,
ADD COLUMN available_dates date[] DEFAULT NULL,
ADD COLUMN time_slots text[] DEFAULT ARRAY['7-10 AM', '10 AM-12 PM', '12-2 PM', '2-5 PM', '5-8 PM', '8-10 PM', 'Post 10 PM'],
ADD COLUMN food_options text[] DEFAULT ARRAY['Indian', 'Asian', 'North Indian', 'South Indian'],
ADD COLUMN activity_options text[] DEFAULT ARRAY['Movie night', 'Dinner date', 'Walk in the park', 'Cozy night in', 'Arcade'],
ADD COLUMN success_headline text DEFAULT NULL,
ADD COLUMN success_subtext text DEFAULT NULL;

-- Create date_preferences table
CREATE TABLE public.date_preferences (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id uuid NOT NULL REFERENCES public.valentine_sites(id) ON DELETE CASCADE,
    selected_date date NOT NULL,
    selected_time text NOT NULL,
    food_preference text NOT NULL,
    activity_preference text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.date_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for date_preferences
CREATE POLICY "Site owners can view preferences for their sites"
ON public.date_preferences
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.valentine_sites
        WHERE valentine_sites.id = date_preferences.site_id
        AND valentine_sites.user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can insert preferences for published sites"
ON public.date_preferences
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.valentine_sites
        WHERE valentine_sites.id = date_preferences.site_id
        AND valentine_sites.is_published = true
    )
);