-- Add template column to valentine_sites table
ALTER TABLE public.valentine_sites 
ADD COLUMN template text NOT NULL DEFAULT 'classic';

-- Add a check constraint to ensure valid template values
ALTER TABLE public.valentine_sites 
ADD CONSTRAINT valid_template CHECK (template IN ('classic', 'meme_gif'));