-- Create theme enum for valentine sites
CREATE TYPE public.site_theme AS ENUM ('cute', 'minimal', 'dark', 'pastel', 'chaotic');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create valentine_sites table for storing site configurations
CREATE TABLE public.valentine_sites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    headline TEXT NOT NULL DEFAULT 'Will You Be My Valentine?',
    subtext TEXT DEFAULT 'I really like you... 💕',
    yes_button_text TEXT NOT NULL DEFAULT 'Yes! 💕',
    no_button_text TEXT NOT NULL DEFAULT 'No',
    no_button_variants TEXT[] DEFAULT ARRAY['No', 'Are you sure?', 'Really sure?', 'Think again!', 'Last chance!', 'Surely not?', 'You might regret this!', 'Give it another thought!', 'Are you absolutely sure?', 'This could be a mistake!', 'Have a heart!', 'Don''t be so cold!', 'Change of heart?', 'Wouldn''t you reconsider?', 'Is that your final answer?', 'You''re breaking my heart ;('],
    theme site_theme NOT NULL DEFAULT 'cute',
    is_published BOOLEAN NOT NULL DEFAULT false,
    password_protected BOOLEAN NOT NULL DEFAULT false,
    password_hash TEXT,
    view_count INTEGER NOT NULL DEFAULT 0,
    yes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_responses table for tracking visitor interactions
CREATE TABLE public.site_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES public.valentine_sites(id) ON DELETE CASCADE,
    response_type TEXT NOT NULL CHECK (response_type IN ('view', 'yes_click')),
    visitor_ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valentine_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_responses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Valentine sites policies
CREATE POLICY "Users can view their own sites"
    ON public.valentine_sites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published sites by slug"
    ON public.valentine_sites FOR SELECT
    USING (is_published = true);

CREATE POLICY "Users can create their own sites"
    ON public.valentine_sites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites"
    ON public.valentine_sites FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites"
    ON public.valentine_sites FOR DELETE
    USING (auth.uid() = user_id);

-- Site responses policies (anyone can insert for tracking)
CREATE POLICY "Anyone can insert responses"
    ON public.site_responses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Site owners can view their site responses"
    ON public.site_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.valentine_sites
            WHERE valentine_sites.id = site_responses.site_id
            AND valentine_sites.user_id = auth.uid()
        )
    );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_valentine_sites_updated_at
    BEFORE UPDATE ON public.valentine_sites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create index for faster slug lookups
CREATE INDEX idx_valentine_sites_slug ON public.valentine_sites(slug);
CREATE INDEX idx_valentine_sites_user_id ON public.valentine_sites(user_id);
CREATE INDEX idx_site_responses_site_id ON public.site_responses(site_id);